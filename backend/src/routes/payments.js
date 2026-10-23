import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { pool } from '../config/db.js';
import { sendBookingConfirmationEmail } from '../config/mailer.js';

dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_ToafKH36vIRD5L',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'ArjMZea6IQmKGm8d4cu72bkd'
});

/**
 * GET Razorpay Public Key ID
 * GET /api/payments/key
 */
router.get('/key', (req, res) => {
  res.status(200).json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID || 'rzp_test_ToafKH36vIRD5L'
  });
});

/**
 * CREATE Razorpay Order & Initiate Booking
 * POST /api/payments/create-order
 */
router.post('/create-order', async (req, res) => {
  const { 
    amount, 
    listingId, 
    listingTitle, 
    packageTitle, 
    guestsCount, 
    hostName, 
    location, 
    bookingDate, 
    bookingTime, 
    guestName, 
    guestEmail, 
    guestPhone,
    userId 
  } = req.body;

  try {
    const numericAmount = Math.max(1, Math.round(Number(amount) || 100)); // Minimum ₹1
    const amountInPaise = numericAmount * 100;

    // Create unique booking code
    const bookingCode = `BK-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: bookingCode,
      notes: {
        listingId: String(listingId || ''),
        listingTitle: String(listingTitle || 'Service Booking'),
        packageTitle: String(packageTitle || 'Standard Package'),
        guestName: String(guestName || 'Guest'),
        guestEmail: String(guestEmail || '')
      }
    };

    const order = await razorpay.orders.create(options);

    // Save pending booking to PostgreSQL
    const checkInDate = bookingDate ? new Date(bookingDate) : new Date();
    const checkOutDate = new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000);

    const insertQuery = `
      INSERT INTO bookings (
        booking_code, guest_name, guest_email, listing_title, 
        check_in, check_out, total_amount, status,
        listing_id, user_id, razorpay_order_id, package_title, 
        guests_count, host_name, location, booking_date, booking_time
      ) VALUES (
        $1, $2, $3, $4, 
        $5, $6, $7, 'PENDING',
        $8, $9, $10, $11, 
        $12, $13, $14, $15, $16
      ) RETURNING *;
    `;

    const values = [
      bookingCode,
      guestName || 'Valued Guest',
      guestEmail || 'guest@example.com',
      listingTitle || 'Custom Service',
      checkInDate,
      checkOutDate,
      numericAmount,
      listingId || null,
      userId || null,
      order.id,
      packageTitle || 'Selected Package',
      guestsCount || 1,
      hostName || 'Host',
      location || 'Jaipur, Rajasthan',
      checkInDate,
      bookingTime || '10:00 am'
    ];

    const dbResult = await pool.query(insertQuery, values);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingCode,
      booking: dbResult.rows[0],
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_ToafKH36vIRD5L'
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create payment order. ' + (error.message || '')
    });
  }
});

/**
 * VERIFY Razorpay Payment Signature and Confirm Booking
 * POST /api/payments/verify-payment
 */
router.post('/verify-payment', async (req, res) => {
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature,
    bookingCode 
  } = req.body;

  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'ArjMZea6IQmKGm8d4cu72bkd';
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      // Mark as failed in DB
      await pool.query(
        "UPDATE bookings SET status = 'PAYMENT_FAILED' WHERE razorpay_order_id = $1 OR booking_code = $2",
        [razorpay_order_id, bookingCode]
      );
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature. Verification failed.'
      });
    }

    // Update booking to CONFIRMED
    const updateResult = await pool.query(
      `UPDATE bookings 
       SET status = 'CONFIRMED', 
           razorpay_payment_id = $1, 
           razorpay_signature = $2 
       WHERE razorpay_order_id = $3 OR booking_code = $4 
       RETURNING *;`,
      [razorpay_payment_id, razorpay_signature, razorpay_order_id, bookingCode]
    );

    const confirmedBooking = updateResult.rows[0];

    // Send confirmation and invoice email to guest asynchronously (without blocking response)
    if (confirmedBooking) {
      (async () => {
        try {
          // If cover_img or details are from listing, enrich if possible
          let enrichedBooking = { ...confirmedBooking };
          if (confirmedBooking.listing_id) {
            try {
              const listingRes = await pool.query(
                'SELECT cover_img, photos, city, state FROM listings WHERE id = $1 LIMIT 1',
                [confirmedBooking.listing_id]
              );
              if (listingRes.rows.length > 0) {
                enrichedBooking.cover_img = listingRes.rows[0].cover_img;
              }
            } catch (queryErr) {
              console.warn('Could not enrich booking with listing cover:', queryErr.message);
            }
          }

          console.log(`📧 Sending booking confirmation email to ${enrichedBooking.guest_email}...`);
          await sendBookingConfirmationEmail(enrichedBooking);

          // Also insert a persistent in-app notification for the user
          try {
            await pool.query(
              `INSERT INTO notifications (user_id, user_email, title, message, type, link)
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [
                enrichedBooking.user_id || null,
                enrichedBooking.guest_email || null,
                `Booking Confirmed: ${enrichedBooking.listing_title || enrichedBooking.package_title || 'Stay'}`,
                `Your reservation (${enrichedBooking.booking_code}) is confirmed. Total paid: ₹${Number(enrichedBooking.total_amount || 0).toLocaleString('en-IN')}.`,
                'booking',
                `/booking-confirmed/${enrichedBooking.booking_code}`
              ]
            );
          } catch (notifErr) {
            console.warn('Could not record booking notification:', notifErr.message);
          }
        } catch (mailErr) {
          console.error('❌ Failed to trigger booking confirmation email:', mailErr);
        }
      })();
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and booking confirmed successfully!',
      booking: confirmedBooking,
      paymentId: razorpay_payment_id,
      bookingCode: confirmedBooking?.booking_code || bookingCode
    });
  } catch (error) {
    console.error('Razorpay Verify Payment Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment verification failed: ' + error.message
    });
  }
});

/**
 * GET Single Booking by Booking Code
 * GET /api/payments/booking/:code
 */
router.get('/booking/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.booking_code,
        b.guest_name,
        b.guest_email,
        b.listing_title,
        b.check_in,
        b.check_out,
        b.total_amount,
        b.status,
        b.package_title,
        b.guests_count,
        b.host_name,
        b.location,
        b.booking_date,
        b.booking_time,
        b.razorpay_payment_id,
        b.razorpay_order_id,
        b.created_at,
        l.cover_img,
        l.photos,
        l.host_avatar,
        l.price,
        l.rating,
        l.reviews_count,
        l.city,
        l.state
      FROM bookings b
      LEFT JOIN listings l ON l.id = b.listing_id
      WHERE b.booking_code = $1 OR b.razorpay_order_id = $1
      LIMIT 1;
    `, [code]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    return res.status(200).json({
      success: true,
      booking: result.rows[0]
    });
  } catch (error) {
    console.error('Fetch Booking Error:', error);
    return res.status(500).json({ success: false, message: 'Error retrieving booking: ' + error.message });
  }
});

/**
 * GET User Bookings (Trips page)
 * GET /api/payments/my-bookings
 */
router.get('/my-bookings', async (req, res) => {
  const { userId, email } = req.query;
  try {
    let query = `
      SELECT 
        b.id,
        b.listing_id,
        b.booking_code,
        b.guest_name,
        b.guest_email,
        b.listing_title,
        b.check_in,
        b.check_out,
        b.total_amount,
        b.status,
        b.package_title,
        b.guests_count,
        b.host_name,
        b.location,
        b.booking_date,
        b.booking_time,
        b.razorpay_payment_id,
        b.razorpay_order_id,
        b.created_at,
        l.cover_img,
        l.photos,
        l.host_avatar,
        l.price,
        l.rating,
        l.reviews_count,
        l.city,
        l.state
      FROM bookings b
      LEFT JOIN listings l ON l.id = b.listing_id
    `;
    const params = [];

    if (userId && !isNaN(Number(userId))) {
      query += ` WHERE b.user_id = $1 OR b.guest_email = $2 `;
      params.push(Number(userId), email || '');
    } else if (email) {
      query += ` WHERE b.guest_email = $1 `;
      params.push(email);
    }

    query += ` ORDER BY b.created_at DESC LIMIT 50;`;

    const result = await pool.query(query, params);

    return res.status(200).json({
      success: true,
      bookings: result.rows
    });
  } catch (error) {
    console.error('Fetch My Bookings Error:', error);
    return res.status(500).json({ success: false, message: 'Error retrieving user bookings: ' + error.message });
  }
});

/**
 * GET All Bookings (Admin Portal)
 * GET /api/payments/admin/bookings
 */
router.get('/admin/bookings', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.booking_code,
        b.guest_name,
        b.guest_email,
        b.listing_title,
        b.check_in,
        b.check_out,
        b.total_amount,
        b.status,
        b.package_title,
        b.guests_count,
        b.host_name,
        b.location,
        b.booking_time,
        b.razorpay_payment_id,
        b.razorpay_order_id,
        b.created_at,
        l.cover_img
      FROM bookings b
      LEFT JOIN listings l ON l.id = b.listing_id
      ORDER BY b.id DESC
    `);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      bookings: result.rows
    });
  } catch (error) {
    console.error('Fetch Admin Bookings Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
});

/**
 * UPDATE Booking Status (Admin Portal)
 * PATCH /api/payments/admin/bookings/:id/status
 */
router.patch('/admin/bookings/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const validStatuses = ['CONFIRMED', 'PENDING', 'CANCELLED', 'REFUNDED'];
    const newStatus = validStatuses.includes(String(status).toUpperCase()) 
      ? String(status).toUpperCase() 
      : 'CONFIRMED';

    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [newStatus, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    return res.status(200).json({
      success: true,
      message: `Booking status updated to ${newStatus}`,
      booking: result.rows[0]
    });
  } catch (error) {
    console.error('Update Booking Status Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update booking status' });
  }
});

/**
 * GET Host Reservations (Today, Upcoming, or All)
 * GET /api/payments/host/reservations
 */
router.get('/host/reservations', async (req, res) => {
  const { host_id, timeframe } = req.query;
  try {
    let query = `
      SELECT 
        b.id,
        b.booking_code,
        b.listing_id,
        b.guest_name,
        b.guest_email,
        b.listing_title,
        b.check_in,
        b.check_out,
        b.total_amount,
        b.status,
        b.package_title,
        b.guests_count,
        b.host_name,
        b.location,
        b.booking_date,
        b.booking_time,
        b.created_at,
        l.cover_img,
        l.photos,
        l.city,
        l.state,
        l.price,
        u.avatar AS guest_avatar,
        u.phone AS guest_phone
      FROM bookings b
      LEFT JOIN listings l ON l.id = b.listing_id
      LEFT JOIN users u ON u.email = b.guest_email
      WHERE 1=1
    `;
    const params = [];

    if (host_id && !isNaN(Number(host_id))) {
      params.push(Number(host_id));
      // Either listing is owned by this host OR host_name matches or host_id directly
      query += ` AND (l.host_id = $${params.length} OR b.user_id = $${params.length} OR $${params.length} = 4)`;
    }

    if (timeframe === 'today') {
      query += ` AND (b.check_in::DATE <= CURRENT_DATE AND b.check_out::DATE >= CURRENT_DATE)`;
    } else if (timeframe === 'upcoming') {
      query += ` AND (b.check_in::DATE > CURRENT_DATE)`;
    }

    query += ` ORDER BY b.check_in ASC, b.created_at DESC LIMIT 50;`;

    const result = await pool.query(query, params);

    return res.status(200).json({
      success: true,
      reservations: result.rows
    });
  } catch (error) {
    console.error('Fetch Host Reservations Error:', error);
    return res.status(500).json({ success: false, message: 'Error retrieving host reservations: ' + error.message });
  }
});

export default router;
