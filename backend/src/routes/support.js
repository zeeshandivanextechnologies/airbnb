import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

/**
 * GET /api/support/tickets
 * Fetch all support tickets with latest message and unread count
 */
router.get('/tickets', async (req, res) => {
  try {
    const query = `
      SELECT 
        t.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', m.id,
              'sender', m.sender,
              'text', m.text,
              'createdAt', m.created_at
            ) ORDER BY m.created_at ASC
          ) FILTER (WHERE m.id IS NOT NULL), '[]'
        ) AS messages
      FROM support_tickets t
      LEFT JOIN support_messages m ON t.id = m.ticket_id
      GROUP BY t.id
      ORDER BY t.created_at DESC;
    `;
    const result = await pool.query(query);
    
    // Format response to match existing UI structure seamlessly
    const formatted = result.rows.map(row => ({
      id: row.id,
      subject: row.subject,
      category: row.category,
      userType: row.user_type,
      userName: row.user_name,
      userEmail: row.user_email,
      userPhone: row.user_phone,
      priority: row.priority,
      status: row.status,
      assignedTo: row.assigned_to,
      listingName: row.listing_name,
      bookingId: row.booking_id,
      createdAt: row.created_at,
      messages: row.messages || []
    }));

    res.json({ success: true, tickets: formatted });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/support/tickets
 * Create a new ticket (from guest/host or admin)
 */
router.post('/tickets', async (req, res) => {
  try {
    const {
      subject,
      category = 'General Inquiry',
      userType = 'Guest',
      userName,
      userEmail,
      userPhone,
      priority = 'Medium',
      listingName = '',
      bookingId = '',
      initialMessage = ''
    } = req.body;

    const ticketId = 'TCK-' + Math.floor(1000 + Math.random() * 9000);

    await pool.query(
      `INSERT INTO support_tickets 
       (id, subject, category, user_type, user_name, user_email, user_phone, priority, status, assigned_to, listing_name, booking_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Open', 'Support Team', $9, $10)`,
      [ticketId, subject, category, userType, userName, userEmail, userPhone, priority, listingName, bookingId]
    );

    if (initialMessage && initialMessage.trim()) {
      await pool.query(
        `INSERT INTO support_messages (ticket_id, sender, text) VALUES ($1, $2, $3)`,
        [ticketId, userType, initialMessage.trim()]
      );
    }

    res.status(201).json({
      success: true,
      ticketId,
      message: 'Support ticket created successfully'
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/support/tickets/:id/messages
 * Send message in ticket
 */
router.post('/tickets/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { sender = 'Support', text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: 'Message text is required' });
    }

    const insertResult = await pool.query(
      `INSERT INTO support_messages (ticket_id, sender, text) VALUES ($1, $2, $3) RETURNING *`,
      [id, sender, text.trim()]
    );

    // Update ticket updated_at
    await pool.query(
      `UPDATE support_tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );

    res.status(201).json({
      success: true,
      message: insertResult.rows[0]
    });
  } catch (error) {
    console.error('Error saving support message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PATCH /api/support/tickets/:id/status
 * Update status or priority
 */
router.patch('/tickets/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assignedTo } = req.body;

    const updates = [];
    const values = [];
    let idx = 1;

    if (status) {
      updates.push(`status = $${idx++}`);
      values.push(status);
    }
    if (priority) {
      updates.push(`priority = $${idx++}`);
      values.push(priority);
    }
    if (assignedTo) {
      updates.push(`assigned_to = $${idx++}`);
      values.push(assignedTo);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    await pool.query(
      `UPDATE support_tickets SET ${updates.join(', ')} WHERE id = $${idx}`,
      values
    );

    res.json({ success: true, message: 'Ticket updated successfully' });
  } catch (error) {
    console.error('Error updating support ticket:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
