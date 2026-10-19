import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

/**
 * GET Finance Settings (Commission, Service Fee, GST)
 * GET /api/finance/settings
 */
router.get('/settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM finance_settings ORDER BY id ASC LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          commission_rate: 20.00,
          guest_service_fee: 3.00,
          gst_tax_rate: 18.00
        }
      });
    }
    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Fetch Finance Settings Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch finance settings' });
  }
});

/**
 * UPDATE Finance Settings
 * PUT /api/finance/settings
 */
router.put('/settings', async (req, res) => {
  try {
    const { commission_rate, guest_service_fee, gst_tax_rate } = req.body;
    const cRate = parseFloat(commission_rate) || 20.00;
    const sFee = parseFloat(guest_service_fee) || 3.00;
    const gRate = parseFloat(gst_tax_rate) || 18.00;

    let result = await pool.query(`
      UPDATE finance_settings 
      SET commission_rate = $1, guest_service_fee = $2, gst_tax_rate = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = (SELECT id FROM finance_settings ORDER BY id ASC LIMIT 1)
      RETURNING *
    `, [cRate, sFee, gRate]);

    if (result.rows.length === 0) {
      result = await pool.query(`
        INSERT INTO finance_settings (commission_rate, guest_service_fee, gst_tax_rate)
        VALUES ($1, $2, $3)
        RETURNING *
      `, [cRate, sFee, gRate]);
    }

    return res.status(200).json({
      success: true,
      message: 'Finance settings updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update Finance Settings Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update finance settings' });
  }
});

/**
 * GET Finance Overview Metrics
 * GET /api/finance/overview
 */
router.get('/overview', async (req, res) => {
  try {
    // 1. Fetch current settings
    const setRes = await pool.query('SELECT * FROM finance_settings ORDER BY id ASC LIMIT 1');
    const settings = setRes.rows[0] || { commission_rate: 20.00, gst_tax_rate: 18.00, guest_service_fee: 3.00 };
    const commissionPercent = parseFloat(settings.commission_rate) || 20.00;
    const gstPercent = parseFloat(settings.gst_tax_rate) || 18.00;

    // 2. Aggregate confirmed bookings
    const revRes = await pool.query(`
      SELECT 
        COALESCE(SUM(total_amount), 0) AS total_gross_revenue,
        COUNT(id) AS total_transactions,
        COALESCE(SUM(CASE WHEN status = 'CONFIRMED' THEN total_amount ELSE 0 END), 0) AS confirmed_revenue,
        COALESCE(SUM(CASE WHEN status = 'REFUNDED' THEN total_amount ELSE 0 END), 0) AS refunded_amount
      FROM bookings
    `);

    const gross = parseFloat(revRes.rows[0].total_gross_revenue) || 0;
    const confirmed = parseFloat(revRes.rows[0].confirmed_revenue) || 0;
    const refunded = parseFloat(revRes.rows[0].refunded_amount) || 0;
    const netCommission = (confirmed * commissionPercent) / 100;
    const totalGst = (netCommission * gstPercent) / 100;
    const netPayoutsDue = confirmed - netCommission;

    // 3. Payouts processed aggregate
    const payRes = await pool.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN status = 'Processed' THEN amount ELSE 0 END), 0) AS processed_payouts,
        COALESCE(SUM(CASE WHEN status = 'Pending' THEN amount ELSE 0 END), 0) AS pending_payouts
      FROM host_payouts
    `);

    return res.status(200).json({
      success: true,
      data: {
        totalGrossRevenue: gross,
        confirmedRevenue: confirmed,
        netCommissionEarned: netCommission,
        totalGstTax: totalGst,
        totalRefunded: refunded,
        netPayoutsDue: netPayoutsDue,
        processedPayouts: parseFloat(payRes.rows[0].processed_payouts) || 0,
        pendingPayouts: parseFloat(payRes.rows[0].pending_payouts) || 0,
        settings
      }
    });
  } catch (error) {
    console.error('Finance Overview Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load finance overview' });
  }
});

/**
 * GET Live Guest Transactions (from Bookings)
 * GET /api/finance/transactions
 */
router.get('/transactions', async (req, res) => {
  try {
    const setRes = await pool.query('SELECT * FROM finance_settings ORDER BY id ASC LIMIT 1');
    const settings = setRes.rows[0] || { commission_rate: 20.00, gst_tax_rate: 18.00 };
    const commissionPercent = parseFloat(settings.commission_rate) || 20.00;
    const gstPercent = parseFloat(settings.gst_tax_rate) || 18.00;

    const result = await pool.query(`
      SELECT 
        b.id,
        b.booking_code AS "bookingId",
        b.guest_name AS "guest",
        b.host_name AS "host",
        b.listing_title AS "stayTitle",
        b.total_amount AS "amount",
        b.status,
        b.razorpay_payment_id,
        b.created_at,
        TO_CHAR(b.created_at, 'DD Mon YYYY') AS date
      FROM bookings b
      ORDER BY b.id DESC
    `);

    const formatted = result.rows.map(row => {
      const amt = parseFloat(row.amount) || 0;
      const comm = Math.round((amt * commissionPercent) / 100);
      const gst = Math.round((comm * gstPercent) / 100);
      const net = Math.max(0, amt - comm);

      const statusLabel = row.status === 'CONFIRMED' 
        ? 'Success' 
        : row.status === 'REFUNDED' 
        ? 'Refunded' 
        : (row.status === 'CANCELLED' ? 'Cancelled' : 'Pending');

      return {
        id: `TXN-${row.id + 98400}`,
        bookingId: row.bookingId || `BK-${row.id}`,
        dbId: row.id,
        guest: row.guest || 'Guest',
        host: row.host || 'Airbnb Host',
        stayTitle: row.stayTitle || 'Listing',
        amount: amt,
        commission: comm,
        gstTax: gst,
        netPayout: net,
        paymentMethod: row.razorpay_payment_id ? 'Razorpay (Online)' : 'UPI / Card',
        date: row.date || 'Recent',
        status: statusLabel
      };
    });

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    console.error('Fetch Transactions Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch transactions' });
  }
});

/**
 * GET Host Payouts
 * GET /api/finance/payouts
 */
router.get('/payouts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        payout_code AS "idStr",
        host_name AS "host",
        bank_account AS "bankAccount",
        amount,
        status,
        TO_CHAR(created_at, 'DD Mon YYYY') AS date
      FROM host_payouts
      ORDER BY id DESC
    `);

    // If no payouts entered yet, synthesize initial records from completed bookings or sample
    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    const payouts = result.rows.map(r => ({
      id: r.idStr || `PAY-${r.id + 7700}`,
      dbId: r.id,
      host: r.host,
      bankAccount: r.bankAccount || 'HDFC Bank ··· 8921',
      amount: parseFloat(r.amount) || 0,
      date: r.date,
      status: r.status
    }));

    return res.status(200).json({
      success: true,
      count: payouts.length,
      data: payouts
    });
  } catch (error) {
    console.error('Fetch Payouts Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch payouts' });
  }
});

/**
 * PROCESS / UPDATE Host Payout Status
 * PATCH /api/finance/payouts/:id
 */
router.patch('/payouts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(`
      UPDATE host_payouts
      SET status = $1
      WHERE id = $2 OR payout_code = $2
      RETURNING *
    `, [status || 'Processed', id]);

    return res.status(200).json({
      success: true,
      message: 'Payout status updated',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update Payout Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update payout' });
  }
});

/**
 * GET Refunds List
 * GET /api/finance/refunds
 */
router.get('/refunds', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        r.id,
        r.refund_code AS "idStr",
        b.booking_code AS "bookingId",
        r.guest_name AS "guest",
        r.amount,
        r.reason,
        r.status,
        TO_CHAR(r.created_at, 'DD Mon YYYY') AS date
      FROM refund_requests r
      LEFT JOIN bookings b ON b.id = r.booking_id
      ORDER BY r.id DESC
    `);

    const refunds = result.rows.map(r => ({
      id: r.idStr || `REF-${r.id + 1040}`,
      dbId: r.id,
      bookingId: r.bookingId || 'BK-10835',
      guest: r.guest || 'Guest',
      amount: parseFloat(r.amount) || 0,
      reason: r.reason || 'Requested by guest',
      date: r.date,
      status: r.status
    }));

    return res.status(200).json({
      success: true,
      count: refunds.length,
      data: refunds
    });
  } catch (error) {
    console.error('Fetch Refunds Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch refunds' });
  }
});

/**
 * PROCESS Refund (Approve & Update Booking Status)
 * PATCH /api/finance/refunds/:id
 */
router.patch('/refunds/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Processed', 'Rejected'

    const refundRes = await pool.query(`
      UPDATE refund_requests
      SET status = $1
      WHERE id = $2 OR refund_code = $2
      RETURNING *
    `, [status || 'Processed', id]);

    if (refundRes.rows.length > 0 && status === 'Processed') {
      const bId = refundRes.rows[0].booking_id;
      if (bId) {
        await pool.query("UPDATE bookings SET status = 'REFUNDED' WHERE id = $1", [bId]);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Refund ${status || 'Processed'} successfully`,
      data: refundRes.rows[0]
    });
  } catch (error) {
    console.error('Process Refund Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process refund' });
  }
});

export default router;
