import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

// Auto-create marketing_campaigns and marketing_referrals tables
const ensureMarketingTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS marketing_campaigns (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        channel VARCHAR(100) DEFAULT 'Email',
        segment VARCHAR(255) DEFAULT 'All Active Guests',
        recipients INT DEFAULT 0,
        open_rate VARCHAR(50) DEFAULT '0.0%',
        click_rate VARCHAR(50) DEFAULT '0.0%',
        sent_date VARCHAR(100) DEFAULT 'Just now',
        status VARCHAR(50) DEFAULT 'Sent',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS marketing_referrals (
        id SERIAL PRIMARY KEY,
        referrer_name VARCHAR(255) NOT NULL,
        referrer_email VARCHAR(255) NOT NULL,
        user_type VARCHAR(50) DEFAULT 'Host',
        program_type VARCHAR(100) DEFAULT 'Refer a Host',
        referral_code VARCHAR(100) UNIQUE NOT NULL,
        invited_count INT DEFAULT 0,
        converted_count INT DEFAULT 0,
        reward_earned NUMERIC DEFAULT 0,
        payout_status VARCHAR(100) DEFAULT 'Pending Verification',
        referred_list JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed initial campaigns if empty
    const campCount = await pool.query('SELECT COUNT(*) FROM marketing_campaigns');
    if (parseInt(campCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO marketing_campaigns (name, subject, channel, segment, recipients, open_rate, click_rate, sent_date, status)
        VALUES 
        ('Monsoon Villa Getaways in Goa', 'Rain-soaked paradise: Private pool villas starting at ₹3,999/night 🌧️', 'Email', 'Guests who searched beach destinations', 42500, '38.4%', '14.2%', 'Yesterday, 4:30 PM', 'Sent'),
        ('Become a Host: Earn up to ₹85,000/Month', 'Have an extra room or villa? Start hosting on Airbnb today with 0% fee!', 'Email', 'Prospective Hosts in Top Tier-1 Cities', 28400, '41.2%', '19.8%', '3 days ago', 'Sent'),
        ('Weekend Flash Deal Push Alert', '⚡ Flash Sale: Get 20% OFF this weekend with code AIRBNB2026', 'Push Notification', 'Active Mobile App Users (Last 7 Days)', 65000, '24.6%', '9.8%', 'Today, 10:00 AM', 'Sent'),
        ('Diwali Festive Holiday Advance Booking', 'Book your Diwali family holiday before havelis run out of slots!', 'Email', 'High LTV Repeat Guests', 15200, '-', '-', 'Scheduled: 20 Oct 2026, 9:00 AM', 'Scheduled')
      `);
    }

    // Seed initial referrals if empty
    const refCount = await pool.query('SELECT COUNT(*) FROM marketing_referrals');
    if (parseInt(refCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO marketing_referrals (referrer_name, referrer_email, user_type, program_type, referral_code, invited_count, converted_count, reward_earned, payout_status, referred_list)
        VALUES 
        ('Amit Saxena', 'amit.saxena@gmail.com', 'Host', 'Refer a Host', 'HOST-AMIT-99', 14, 9, 22500, 'Disbursed', '[{"name":"Pankaj Varma","property":"Goa Coastal Villa","status":"Active & Hosting","date":"12 Sep 2026"},{"name":"Sunita Roy","property":"Kasauli Pine Cottage","status":"Active & Hosting","date":"28 Aug 2026"},{"name":"Deepak Rao","property":"Bengaluru Penthouse","status":"Active & Hosting","date":"04 Oct 2026"}]'::jsonb),
        ('Pooja Mehta', 'pooja.mehta@yahoo.com', 'Host', 'Refer a Host', 'POOJA-HOST-GOA', 10, 6, 15000, 'Disbursed', '[{"name":"Rohan Deshmukh","property":"Alibaug Farmhouse","status":"Active & Hosting","date":"19 Sep 2026"},{"name":"Kavita Joshi","property":"Lonavala Glass Villa","status":"Active & Hosting","date":"02 Oct 2026"}]'::jsonb),
        ('Rohit Bansal', 'rohit.b@outlook.com', 'Guest', 'Refer a Guest', 'ROHIT-STAYS-26', 22, 14, 14000, 'Disbursed', '[{"name":"Aditi Sharma","property":"First Booking at Manali Chalet","status":"Stay Completed","date":"22 Sep 2026"},{"name":"Nikhil Sen","property":"First Booking at Udaipur Palace","status":"Stay Completed","date":"29 Sep 2026"}]'::jsonb),
        ('Neha Singhal', 'neha.singhal@gmail.com', 'Host', 'Refer a Host', 'HOST-NEHA-DELHI', 5, 2, 5000, 'Pending Verification', '[{"name":"Sameer Juneja","property":"Jaipur Heritage Flat","status":"Listing Pending Approval","date":"08 Oct 2026"}]'::jsonb)
      `);
    }
  } catch (err) {
    console.error('Error ensuring marketing tables:', err);
  }
};
ensureMarketingTables();

// GET all campaigns
router.get('/campaigns', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM marketing_campaigns ORDER BY id DESC');
    const mapped = result.rows.map(r => ({
      id: r.id,
      name: r.name,
      subject: r.subject,
      channel: r.channel,
      segment: r.segment,
      recipients: r.recipients,
      openRate: r.open_rate,
      clickRate: r.click_rate,
      sentDate: r.sent_date,
      status: r.status
    }));
    return res.status(200).json({ success: true, count: mapped.length, data: mapped });
  } catch (error) {
    console.error('Fetch campaigns error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch campaigns' });
  }
});

// POST create campaign
router.post('/campaigns', async (req, res) => {
  const { name, subject, channel, segment, recipients, openRate, clickRate, sentDate, status } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO marketing_campaigns (name, subject, channel, segment, recipients, open_rate, click_rate, sent_date, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      name || 'New Campaign',
      subject || '',
      channel || 'Email',
      segment || 'All Active Guests',
      recipients || 34000,
      openRate || '0.0%',
      clickRate || '0.0%',
      sentDate || 'Just now',
      status || 'Sent'
    ]);
    const r = result.rows[0];
    return res.status(201).json({
      success: true,
      data: {
        id: r.id,
        name: r.name,
        subject: r.subject,
        channel: r.channel,
        segment: r.segment,
        recipients: r.recipients,
        openRate: r.open_rate,
        clickRate: r.click_rate,
        sentDate: r.sent_date,
        status: r.status
      }
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create campaign' });
  }
});

// GET all referrals
router.get('/referrals', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM marketing_referrals ORDER BY id ASC');
    const mapped = result.rows.map(r => ({
      id: r.id,
      referrerName: r.referrer_name,
      referrerEmail: r.referrer_email,
      userType: r.user_type,
      programType: r.program_type,
      referralCode: r.referral_code,
      invitedCount: r.invited_count,
      convertedCount: r.converted_count,
      rewardEarned: Number(r.reward_earned),
      payoutStatus: r.payout_status,
      referredList: Array.isArray(r.referred_list) ? r.referred_list : (typeof r.referred_list === 'string' ? JSON.parse(r.referred_list) : [])
    }));
    return res.status(200).json({ success: true, count: mapped.length, data: mapped });
  } catch (error) {
    console.error('Fetch referrals error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch referrals' });
  }
});

// PUT update referral payout status
router.put('/referrals/:id', async (req, res) => {
  const { id } = req.params;
  const { payoutStatus } = req.body;
  try {
    const result = await pool.query(`
      UPDATE marketing_referrals 
      SET payout_status = $1 
      WHERE id = $2 
      RETURNING *
    `, [payoutStatus || 'Disbursed', id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Referral record not found' });
    }

    const r = result.rows[0];
    return res.status(200).json({
      success: true,
      message: 'Referral payout status updated successfully',
      data: {
        id: r.id,
        referrerName: r.referrer_name,
        payoutStatus: r.payout_status
      }
    });
  } catch (error) {
    console.error('Update referral error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update referral' });
  }
});

export default router;

