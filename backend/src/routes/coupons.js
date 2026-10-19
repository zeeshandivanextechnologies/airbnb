import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

/**
 * GET All Coupons (for Admin Marketing & Public query)
 * GET /api/coupons
 */
router.get('/', async (req, res) => {
  try {
    const { status, code } = req.query;
    let query = 'SELECT * FROM coupons WHERE 1=1';
    const params = [];

    if (status && status !== 'ALL') {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    if (code) {
      params.push(code.toUpperCase().trim());
      query += ` AND code = $${params.length}`;
    }

    query += ' ORDER BY id DESC';
    const result = await pool.query(query, params);

    // Map database snake_case to frontend camelCase
    const formatted = result.rows.map(c => ({
      id: c.id,
      code: c.code,
      discountType: c.discount_type,
      discountValue: Number(c.discount_value),
      maxDiscount: Number(c.max_discount),
      minBooking: Number(c.min_booking),
      usedCount: Number(c.used_count || 0),
      maxUses: Number(c.max_uses || 1000),
      validTill: c.valid_till ? c.valid_till.toISOString().split('T')[0] : '2026-12-31',
      targetAudience: c.target_audience || 'All Guests',
      status: c.status || 'Active',
      description: c.description || ''
    }));

    res.status(200).json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    console.error('Fetch coupons error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch coupons' });
  }
});

/**
 * Validate / Apply Coupon (Used by Guest Checkout in ServiceDetails.jsx)
 * POST /api/coupons/apply
 */
router.post('/apply', async (req, res) => {
  try {
    const { code, bookingAmount = 0 } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Please enter a coupon code' });
    }

    const cleanCode = code.toUpperCase().trim();
    const result = await pool.query('SELECT * FROM coupons WHERE code = $1', [cleanCode]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code. Please check and try again.' });
    }

    const coupon = result.rows[0];

    // Check status
    if (coupon.status !== 'Active') {
      return res.status(400).json({ success: false, message: 'This coupon has expired or is no longer active.' });
    }

    // Check expiration date
    if (coupon.valid_till && new Date(coupon.valid_till) < new Date()) {
      return res.status(400).json({ success: false, message: 'This coupon has expired.' });
    }

    // Check usage limits
    if (coupon.used_count >= coupon.max_uses) {
      return res.status(400).json({ success: false, message: 'This coupon usage limit has been reached.' });
    }

    // Check min booking requirement
    const numBookingAmount = Number(bookingAmount) || 0;
    const minBooking = Number(coupon.min_booking) || 0;
    if (numBookingAmount > 0 && numBookingAmount < minBooking) {
      return res.status(400).json({
        success: false,
        message: `Minimum booking amount of ₹${minBooking.toLocaleString('en-IN')} required for this coupon.`
      });
    }

    // Calculate discount
    let discount = 0;
    const discountVal = Number(coupon.discount_value);
    const maxDiscount = Number(coupon.max_discount);

    if (coupon.discount_type === 'Percentage') {
      discount = (numBookingAmount * discountVal) / 100;
      if (maxDiscount > 0 && discount > maxDiscount) {
        discount = maxDiscount;
      }
    } else {
      discount = discountVal;
      if (numBookingAmount > 0 && discount > numBookingAmount) {
        discount = numBookingAmount;
      }
    }

    discount = Math.round(discount);

    res.status(200).json({
      success: true,
      message: `Coupon applied successfully! You saved ₹${discount.toLocaleString('en-IN')}`,
      coupon: {
        code: coupon.code,
        discountType: coupon.discount_type,
        discountValue: discountVal,
        discountAmount: discount,
        description: coupon.description
      }
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({ success: false, message: 'Failed to apply coupon' });
  }
});

/**
 * POST Create new Coupon (Admin Marketing)
 * POST /api/coupons
 */
router.post('/', async (req, res) => {
  try {
    const {
      code,
      discountType = 'Percentage',
      discountValue,
      maxDiscount = 3000,
      minBooking = 0,
      maxUses = 1000,
      validTill = '2026-12-31',
      targetAudience = 'All Guests',
      description = ''
    } = req.body;

    if (!code || !discountValue) {
      return res.status(400).json({ success: false, message: 'Coupon code and discount value are required' });
    }

    const cleanCode = code.toUpperCase().trim();

    const insertQuery = `
      INSERT INTO coupons 
      (code, discount_type, discount_value, max_discount, min_booking, used_count, max_uses, valid_till, target_audience, status, description)
      VALUES ($1, $2, $3, $4, $5, 0, $6, $7, $8, 'Active', $9)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      cleanCode,
      discountType,
      Number(discountValue),
      Number(maxDiscount),
      Number(minBooking),
      Number(maxUses),
      validTill,
      targetAudience,
      description
    ]);

    const c = result.rows[0];
    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: {
        id: c.id,
        code: c.code,
        discountType: c.discount_type,
        discountValue: Number(c.discount_value),
        maxDiscount: Number(c.max_discount),
        minBooking: Number(c.min_booking),
        usedCount: 0,
        maxUses: Number(c.max_uses),
        validTill: c.valid_till ? c.valid_till.toISOString().split('T')[0] : '2026-12-31',
        targetAudience: c.target_audience,
        status: c.status,
        description: c.description
      }
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'A coupon with this code already exists' });
    }
    res.status(500).json({ success: false, message: 'Failed to create coupon' });
  }
});

/**
 * PUT Update existing Coupon (Admin Marketing)
 * PUT /api/coupons/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      discountType,
      discountValue,
      maxDiscount,
      minBooking,
      maxUses,
      validTill,
      targetAudience,
      status,
      description
    } = req.body;

    const updateQuery = `
      UPDATE coupons SET
        code = COALESCE($1, code),
        discount_type = COALESCE($2, discount_type),
        discount_value = COALESCE($3, discount_value),
        max_discount = COALESCE($4, max_discount),
        min_booking = COALESCE($5, min_booking),
        max_uses = COALESCE($6, max_uses),
        valid_till = COALESCE($7, valid_till),
        target_audience = COALESCE($8, target_audience),
        status = COALESCE($9, status),
        description = COALESCE($10, description)
      WHERE id = $11
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      code ? code.toUpperCase().trim() : null,
      discountType,
      discountValue ? Number(discountValue) : null,
      maxDiscount !== undefined ? Number(maxDiscount) : null,
      minBooking !== undefined ? Number(minBooking) : null,
      maxUses !== undefined ? Number(maxUses) : null,
      validTill,
      targetAudience,
      status,
      description,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    const c = result.rows[0];
    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      data: {
        id: c.id,
        code: c.code,
        discountType: c.discount_type,
        discountValue: Number(c.discount_value),
        maxDiscount: Number(c.max_discount),
        minBooking: Number(c.min_booking),
        usedCount: Number(c.used_count || 0),
        maxUses: Number(c.max_uses),
        validTill: c.valid_till ? c.valid_till.toISOString().split('T')[0] : '2026-12-31',
        targetAudience: c.target_audience,
        status: c.status,
        description: c.description
      }
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ success: false, message: 'Failed to update coupon' });
  }
});

/**
 * DELETE Coupon (Admin Marketing)
 * DELETE /api/coupons/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM coupons WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete coupon' });
  }
});

export default router;
