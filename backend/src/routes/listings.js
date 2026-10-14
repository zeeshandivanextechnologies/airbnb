import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

/**
 * GET All Listings (Public for Guest App & Admin Portal)
 * GET /api/listings
 */
router.get('/', async (req, res) => {
  try {
    const { category, city, status } = req.query;
    let query = 'SELECT * FROM listings WHERE 1=1';
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND LOWER(category) = LOWER($${params.length})`;
    }

    if (city) {
      params.push(`%${city}%`);
      query += ` AND city ILIKE $${params.length}`;
    }

    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    } else {
      // Default to Active for guests
      query += ` AND status = 'Active'`;
    }

    query += ' ORDER BY id ASC';

    const result = await pool.query(query, params);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Listings API Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch listings' });
  }
});

/**
 * GET Dynamic Hosting Types (Experience, Service, etc.)
 * GET /api/listings/hosting-types
 */
router.get('/hosting-types', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hosting_types WHERE is_active = true ORDER BY id ASC');
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Hosting types error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch hosting types' });
  }
});

/**
 * GET Dynamic Host Categories (Services & Experiences)
 * GET /api/listings/host-categories?type=service|experience
 */
router.get('/host-categories', async (req, res) => {
  try {
    const { type } = req.query;
    let query = 'SELECT * FROM host_categories WHERE is_active = true';
    const params = [];
    if (type) {
      params.push(type.toLowerCase());
      query += ` AND LOWER(hosting_type) = $1`;
    }
    query += ' ORDER BY id ASC';
    const result = await pool.query(query, params);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Host categories error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch host categories' });
  }
});

/**
 * GET Single Listing Details
 * GET /api/listings/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM listings WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving listing' });
  }
});

/**
 * CREATE New Listing (Host App & Admin Portal)
 * POST /api/listings
 */
router.post('/', async (req, res) => {
  try {
    const {
      title,
      type,
      category,
      host_name,
      host_phone,
      city,
      price,
      cover_img,
      amenities,
      description,
      photos,
      itinerary,
      discounts,
      host_id,
      max_guests,
      years_experience,
      host_intro,
      host_qualifications,
      host_recognition,
      online_profiles,
      residential_address,
      hosting_as_business,
      meetup_address,
      service_area,
      service_provision_type
    } = req.body;

    const safeTitle = title || 'Untitled Service/Experience';
    const safeType = type || 'Experience';
    const safeCategory = category || 'Experiences';
    const safeHostName = host_name || 'Host';
    const safeCity = city || 'Jaipur, Rajasthan';
    const safePrice = Number(price) || 0;
    const safeCoverImg = cover_img || (Array.isArray(photos) && photos[0]) || 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80';
    const safeAmenities = Array.isArray(amenities) ? amenities : [];
    const safePhotos = Array.isArray(photos) ? photos : [];
    const safeItinerary = itinerary ? JSON.stringify(itinerary) : '[]';
    const safeDiscounts = discounts ? JSON.stringify(discounts) : '{}';
    const safeOnlineProfiles = Array.isArray(online_profiles) ? online_profiles : [];
    const safeResidentialAddress = residential_address ? JSON.stringify(residential_address) : '{}';
    const safeHostingAsBusiness = hosting_as_business || 'no';
    const safeMeetupAddress = meetup_address ? JSON.stringify(meetup_address) : '{}';
    const safeServiceArea = service_area ? JSON.stringify(service_area) : '{}';
    const safeServiceProvisionType = Array.isArray(service_provision_type) ? service_provision_type : [];

    const result = await pool.query(
      `INSERT INTO listings (
        title, type, category, host_name, host_phone, city, price, 
        cover_img, amenities, description, photos, itinerary, discounts, 
        host_id, max_guests, years_experience, host_intro, host_qualifications, host_recognition, online_profiles, 
        residential_address, hosting_as_business, meetup_address, service_area, service_provision_type, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13::jsonb, $14, $15, $16, $17, $18, $19, $20, $21::jsonb, $22, $23::jsonb, $24::jsonb, $25, 'Active')
      RETURNING *`,
      [
        safeTitle,
        safeType,
        safeCategory,
        safeHostName,
        host_phone || null,
        safeCity,
        safePrice,
        safeCoverImg,
        safeAmenities,
        description || '',
        safePhotos,
        safeItinerary,
        safeDiscounts,
        host_id || null,
        max_guests || 1,
        Number(years_experience) || 0,
        host_intro || '',
        host_qualifications || '',
        host_recognition || '',
        safeOnlineProfiles,
        safeResidentialAddress,
        safeHostingAsBusiness,
        safeMeetupAddress,
        safeServiceArea,
        safeServiceProvisionType
      ]
    );

    res.status(201).json({ success: true, data: result.rows[0], message: 'Listing created successfully' });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ success: false, message: 'Failed to create listing' });
  }
});

/**
 * UPDATE Listing Status (Admin Portal Approvals / Suspend)
 * PATCH /api/listings/:id/status
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE listings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update listing status' });
  }
});

export default router;
