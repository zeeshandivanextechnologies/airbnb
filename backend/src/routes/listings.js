import express from 'express';
import { pool } from '../config/db.js';
import { sendListingCreatedEmail, sendListingDeletedEmail } from '../config/mailer.js';

const router = express.Router();

/**
 * GET All Listings (Public for Guest App & Admin Portal)
 * GET /api/listings
 */
router.get('/', async (req, res) => {
  try {
    const { category, city, status, host_id, location, q, type } = req.query;
    let query = `
      SELECT 
        l.*,
        COALESCE(
          NULLIF(u.host_display_name, ''),
          NULLIF(CONCAT(u.first_name, ' ', COALESCE(u.last_name, '')), ' '),
          NULLIF(u.first_name, ''),
          NULLIF(l.host_name, ''),
          'Airbnb Host'
        ) AS host_name,
        COALESCE(u.avatar, NULLIF(l.host_avatar, '')) AS host_avatar,
        u.about_me AS host_bio,
        COALESCE(u.identity_verification_status, 'Verified') AS host_verification,
        COALESCE(u.preferred_language, 'English') AS host_preferred_language,
        COALESCE(u.last_active_location, l.city) AS host_location,
        u.created_at AS host_member_since
      FROM listings l
      LEFT JOIN users u ON l.host_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (host_id) {
      params.push(parseInt(host_id, 10));
      query += ` AND l.host_id = $${params.length}`;
    }

    if (type) {
      const lowerType = type.toLowerCase();
      if (lowerType === 'stay' || lowerType === 'home') {
        // Homes/Stays: type is 'home', 'stay', 'entire place', etc. AND not Experience and not Service
        query += ` AND LOWER(COALESCE(l.type, 'home')) NOT LIKE '%experience%' 
                   AND LOWER(COALESCE(l.type, 'home')) NOT LIKE '%service%'
                   AND LOWER(COALESCE(l.category, '')) NOT LIKE '%experience%'
                   AND LOWER(COALESCE(l.category, '')) NOT IN ('chef', 'hairstyling', 'make-up', 'makeup', 'massage', 'personal training', 'photography', 'prepared meals', 'spa treatments', 'catering')`;
      } else if (lowerType === 'experience') {
        // Experiences: type is 'experience' OR category is experience-related
        query += ` AND (LOWER(COALESCE(l.type, '')) LIKE '%experience%' OR LOWER(COALESCE(l.category, '')) LIKE '%experience%')`;
      } else if (lowerType === 'service') {
        // Services: type is 'service' OR category is service-related AND not Experience
        query += ` AND (LOWER(COALESCE(l.type, '')) LIKE '%service%' 
                   OR LOWER(COALESCE(l.category, '')) IN ('chef', 'hairstyling', 'make-up', 'makeup', 'massage', 'personal training', 'photography', 'prepared meals', 'spa treatments', 'catering'))
                   AND LOWER(COALESCE(l.type, '')) NOT LIKE '%experience%'`;
      } else {
        params.push(type);
        query += ` AND LOWER(COALESCE(l.type, 'home')) = LOWER($${params.length})`;
      }
    }

    if (category) {
      params.push(category);
      query += ` AND LOWER(l.category) = LOWER($${params.length})`;
    }

    const searchLoc = location || city || q;
    if (searchLoc && searchLoc.trim()) {
      const cleanLoc = searchLoc.trim();
      params.push(`%${cleanLoc}%`);
      query += ` AND (
        l.city ILIKE $${params.length} 
        OR COALESCE(l.state, '') ILIKE $${params.length} 
        OR COALESCE(l.country, '') ILIKE $${params.length}
        OR l.title ILIKE $${params.length}
      )`;
    }

    if (status && status !== 'all') {
      params.push(status);
      query += ` AND l.status = $${params.length}`;
    } else if (!host_id && (!status || status !== 'all')) {
      // By default on public guest routes, only show Active listings (hide 'Action required', 'In progress', 'Draft')
      query += ` AND LOWER(l.status) = 'active'`;
    }

    query += ' ORDER BY l.id DESC';

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
 * GET Dynamic Property Types (HostStep1 Step 2 & Admin MasterData)
 * GET /api/listings/property-types
 */
router.get('/property-types', async (req, res) => {
  try {
    const { all } = req.query;
    let query = 'SELECT * FROM property_types';
    if (all !== 'true') {
      query += ' WHERE is_active = true';
    }
    query += ' ORDER BY display_order ASC, id ASC';
    const result = await pool.query(query);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Property types error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch property types' });
  }
});

/**
 * CREATE Property Type
 * POST /api/listings/property-types
 */
router.post('/property-types', async (req, res) => {
  try {
    const { slug, name, icon, description, is_active, display_order } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    const cleanSlug = (slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '_')).replace(/^_+|_+$/g, '');

    const result = await pool.query(
      `INSERT INTO property_types (slug, name, icon, description, is_active, display_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [cleanSlug, name, icon || 'home', description || '', is_active !== false, display_order || 0]
    );

    res.status(201).json({ success: true, message: 'Property type created successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Create property type error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create property type' });
  }
});

/**
 * UPDATE Property Type
 * PUT /api/listings/property-types/:id
 */
router.put('/property-types/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { slug, name, icon, description, is_active, display_order } = req.body;

    const check = await pool.query('SELECT * FROM property_types WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Property type not found' });
    }

    const cur = check.rows[0];
    const updatedSlug = slug !== undefined ? slug : cur.slug;
    const updatedName = name !== undefined ? name : cur.name;
    const updatedIcon = icon !== undefined ? icon : cur.icon;
    const updatedDesc = description !== undefined ? description : cur.description;
    const updatedIsActive = is_active !== undefined ? is_active : cur.is_active;
    const updatedOrder = display_order !== undefined ? display_order : cur.display_order;

    const result = await pool.query(
      `UPDATE property_types 
       SET slug = $1, name = $2, icon = $3, description = $4, is_active = $5, display_order = $6
       WHERE id = $7
       RETURNING *`,
      [updatedSlug, updatedName, updatedIcon, updatedDesc, updatedIsActive, updatedOrder, id]
    );

    res.status(200).json({ success: true, message: 'Property type updated successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Update property type error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update property type' });
  }
});

/**
 * DELETE Property Type
 * DELETE /api/listings/property-types/:id
 */
router.delete('/property-types/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM property_types WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Property type not found' });
    }
    res.status(200).json({ success: true, message: 'Property type deleted successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Delete property type error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete property type' });
  }
});

/**
 * GET Dynamic Place Types (HostStep1 Step 3 - Entire place, Room, Shared room)
 * GET /api/listings/place-types
 */
router.get('/place-types', async (req, res) => {
  try {
    const { all } = req.query;
    let query = 'SELECT * FROM place_types';
    if (all !== 'true') {
      query += ' WHERE is_active = true';
    }
    query += ' ORDER BY display_order ASC, id ASC';
    const result = await pool.query(query);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Place types error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch place types' });
  }
});

/**
 * CREATE Place Type
 * POST /api/listings/place-types
 */
router.post('/place-types', async (req, res) => {
  try {
    const { key, title, subtitle, icon, is_active, display_order } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    const cleanKey = (key || title.toLowerCase().replace(/[^a-z0-9]+/g, '_')).replace(/^_+|_+$/g, '');

    const result = await pool.query(
      `INSERT INTO place_types (key, title, subtitle, icon, is_active, display_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [cleanKey, title, subtitle || '', icon || 'home', is_active !== false, display_order || 0]
    );

    res.status(201).json({ success: true, message: 'Place type created successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Create place type error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create place type' });
  }
});

/**
 * UPDATE Place Type
 * PUT /api/listings/place-types/:id
 */
router.put('/place-types/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { key, title, subtitle, icon, is_active, display_order } = req.body;

    const check = await pool.query('SELECT * FROM place_types WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Place type not found' });
    }

    const cur = check.rows[0];
    const updatedKey = key !== undefined ? key : cur.key;
    const updatedTitle = title !== undefined ? title : cur.title;
    const updatedSubtitle = subtitle !== undefined ? subtitle : cur.subtitle;
    const updatedIcon = icon !== undefined ? icon : cur.icon;
    const updatedIsActive = is_active !== undefined ? is_active : cur.is_active;
    const updatedOrder = display_order !== undefined ? display_order : cur.display_order;

    const result = await pool.query(
      `UPDATE place_types 
       SET key = $1, title = $2, subtitle = $3, icon = $4, is_active = $5, display_order = $6
       WHERE id = $7
       RETURNING *`,
      [updatedKey, updatedTitle, updatedSubtitle, updatedIcon, updatedIsActive, updatedOrder, id]
    );

    res.status(200).json({ success: true, message: 'Place type updated successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Update place type error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update place type' });
  }
});

/**
 * DELETE Place Type
 * DELETE /api/listings/place-types/:id
 */
router.delete('/place-types/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM place_types WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Place type not found' });
    }
    res.status(200).json({ success: true, message: 'Place type deleted successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Delete place type error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete place type' });
  }
});

/**
 * GET Step Settings (Host Onboarding Steps like Step 5 location display)
 * GET /api/listings/step-settings/:key?
 */
router.get('/step-settings', async (req, res) => {
  try {
    const { key } = req.query;
    let query = 'SELECT * FROM step_settings';
    const params = [];
    if (key) {
      params.push(key);
      query += ' WHERE step_key = $1';
    }
    query += ' ORDER BY id ASC';
    const result = await pool.query(query, params);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Step settings get error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch step settings' });
  }
});

/**
 * GET Single Step Setting by Key
 * GET /api/listings/step-settings/:key
 */
router.get('/step-settings/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const result = await pool.query('SELECT * FROM step_settings WHERE step_key = $1', [key]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Step setting not found' });
    }
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Step setting get single error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch step setting' });
  }
});

/**
 * UPDATE Step Setting
 * PUT /api/listings/step-settings/:key
 */
router.put('/step-settings/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { title, subtitle, toggle_label, toggle_subtitle, default_state, learn_more_link } = req.body;

    const check = await pool.query('SELECT * FROM step_settings WHERE step_key = $1', [key]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Step setting not found' });
    }

    const cur = check.rows[0];
    const updatedTitle = title !== undefined ? title : cur.title;
    const updatedSubtitle = subtitle !== undefined ? subtitle : cur.subtitle;
    const updatedToggleLabel = toggle_label !== undefined ? toggle_label : cur.toggle_label;
    const updatedToggleSubtitle = toggle_subtitle !== undefined ? toggle_subtitle : cur.toggle_subtitle;
    const updatedDefaultState = default_state !== undefined ? default_state : cur.default_state;
    const updatedLink = learn_more_link !== undefined ? learn_more_link : cur.learn_more_link;

    const result = await pool.query(
      `UPDATE step_settings
       SET title = $1, subtitle = $2, toggle_label = $3, toggle_subtitle = $4, default_state = $5, learn_more_link = $6, updated_at = CURRENT_TIMESTAMP
       WHERE step_key = $7
       RETURNING *`,
      [updatedTitle, updatedSubtitle, updatedToggleLabel, updatedToggleSubtitle, updatedDefaultState, updatedLink, key]
    );

    res.status(200).json({ success: true, message: 'Step setting updated successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Update step setting error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update step setting' });
  }
});

/**
 * GET Dynamic Step 6 Basics (Guests, Bedrooms, Beds, Bathrooms)
 * GET /api/listings/step-basics
 */
router.get('/step-basics', async (req, res) => {
  try {
    const { all } = req.query;
    let query = 'SELECT * FROM step_basics';
    if (all !== 'true') {
      query += ' WHERE is_active = true';
    }
    query += ' ORDER BY display_order ASC, id ASC';
    const result = await pool.query(query);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Step basics get error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch step basics' });
  }
});

/**
 * CREATE Step Basic Counter
 * POST /api/listings/step-basics
 */
router.post('/step-basics', async (req, res) => {
  try {
    const { key, label, default_val, min_val, max_val, display_order, is_active } = req.body;
    if (!label) {
      return res.status(400).json({ success: false, message: 'Label is required' });
    }
    const cleanKey = (key || label.toLowerCase().replace(/[^a-z0-9]+/g, '_')).replace(/^_+|_+$/g, '');

    const result = await pool.query(
      `INSERT INTO step_basics (key, label, default_val, min_val, max_val, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [cleanKey, label, default_val || 1, min_val || 1, max_val || 50, display_order || 0, is_active !== false]
    );

    res.status(201).json({ success: true, message: 'Step basic counter added successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Create step basic error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create step basic counter' });
  }
});

/**
 * UPDATE Step Basic Counter
 * PUT /api/listings/step-basics/:id
 */
router.put('/step-basics/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { key, label, default_val, min_val, max_val, display_order, is_active } = req.body;

    const check = await pool.query('SELECT * FROM step_basics WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Step basic item not found' });
    }

    const cur = check.rows[0];
    const updatedKey = key !== undefined ? key : cur.key;
    const updatedLabel = label !== undefined ? label : cur.label;
    const updatedDefault = default_val !== undefined ? default_val : cur.default_val;
    const updatedMin = min_val !== undefined ? min_val : cur.min_val;
    const updatedMax = max_val !== undefined ? max_val : cur.max_val;
    const updatedOrder = display_order !== undefined ? display_order : cur.display_order;
    const updatedIsActive = is_active !== undefined ? is_active : cur.is_active;

    const result = await pool.query(
      `UPDATE step_basics
       SET key = $1, label = $2, default_val = $3, min_val = $4, max_val = $5, display_order = $6, is_active = $7
       WHERE id = $8
       RETURNING *`,
      [updatedKey, updatedLabel, updatedDefault, updatedMin, updatedMax, updatedOrder, updatedIsActive, id]
    );

    res.status(200).json({ success: true, message: 'Step basic counter updated successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Update step basic error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update step basic item' });
  }
});

/**
 * DELETE Step Basic Counter
 * DELETE /api/listings/step-basics/:id
 */
router.delete('/step-basics/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM step_basics WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Step basic item not found' });
    }
    res.status(200).json({ success: true, message: 'Step basic item deleted successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Delete step basic error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete step basic item' });
  }
});

/**
 * GET Dynamic Master Amenities (HostStep2 Step 2 & Admin MasterData)
 * GET /api/listings/master-amenities?all=true|category=Basics
 */
router.get('/master-amenities', async (req, res) => {
  try {
    const { all, category } = req.query;
    let query = 'SELECT * FROM master_amenities';
    const params = [];
    const conditions = [];

    if (all !== 'true') {
      conditions.push('is_active = true');
    }

    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ' ORDER BY display_order ASC, id ASC';

    const result = await pool.query(query, params);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Fetch master amenities error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch master amenities' });
  }
});

/**
 * POST Create Master Amenity
 * POST /api/listings/master-amenities
 */
router.post('/master-amenities', async (req, res) => {
  try {
    const { key, name, sublabel, category, icon, is_highlight, display_order, is_active } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Amenity name is required' });
    }

    const autoKey = (key && key.trim()) 
      ? key.trim().toLowerCase().replace(/\s+/g, '_')
      : name.trim().toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');

    // Check duplicate key
    const check = await pool.query('SELECT id FROM master_amenities WHERE key = $1', [autoKey]);
    if (check.rows.length > 0) {
      return res.status(400).json({ success: false, message: `Amenity with key "${autoKey}" already exists` });
    }

    const result = await pool.query(
      `INSERT INTO master_amenities (key, name, sublabel, category, icon, is_highlight, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        autoKey,
        name.trim(),
        sublabel ? sublabel.trim() : '',
        category ? category.trim() : 'Basics',
        icon ? icon.trim() : 'wifi',
        is_highlight === true,
        display_order !== undefined ? parseInt(display_order, 10) : 0,
        is_active !== false
      ]
    );

    res.status(201).json({ success: true, message: 'Master amenity created successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Create master amenity error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create master amenity' });
  }
});

/**
 * PUT Update Master Amenity
 * PUT /api/listings/master-amenities/:id
 */
router.put('/master-amenities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { key, name, sublabel, category, icon, is_highlight, display_order, is_active } = req.body;

    const check = await pool.query('SELECT * FROM master_amenities WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Master amenity not found' });
    }

    const cur = check.rows[0];
    const updatedKey = key !== undefined ? key.trim().toLowerCase() : cur.key;
    const updatedName = name !== undefined ? name.trim() : cur.name;
    const updatedSublabel = sublabel !== undefined ? sublabel.trim() : cur.sublabel;
    const updatedCategory = category !== undefined ? category.trim() : cur.category;
    const updatedIcon = icon !== undefined ? icon.trim() : cur.icon;
    const updatedHighlight = is_highlight !== undefined ? is_highlight : cur.is_highlight;
    const updatedOrder = display_order !== undefined ? parseInt(display_order, 10) : cur.display_order;
    const updatedIsActive = is_active !== undefined ? is_active : cur.is_active;

    const result = await pool.query(
      `UPDATE master_amenities
       SET key = $1, name = $2, sublabel = $3, category = $4, icon = $5, is_highlight = $6, display_order = $7, is_active = $8
       WHERE id = $9
       RETURNING *`,
      [updatedKey, updatedName, updatedSublabel, updatedCategory, updatedIcon, updatedHighlight, updatedOrder, updatedIsActive, id]
    );

    res.status(200).json({ success: true, message: 'Master amenity updated successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Update master amenity error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update master amenity' });
  }
});

/**
 * DELETE Master Amenity
 * DELETE /api/listings/master-amenities/:id
 */
router.delete('/master-amenities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM master_amenities WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Master amenity not found' });
    }
    res.status(200).json({ success: true, message: 'Master amenity deleted successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Delete master amenity error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete master amenity' });
  }
});

/**
 * GET Dynamic Master Highlights (HostStep2 Step 5 & Admin MasterData)
 * GET /api/listings/master-highlights?all=true
 */
router.get('/master-highlights', async (req, res) => {
  try {
    const { all } = req.query;
    let query = 'SELECT * FROM master_highlights';
    if (all !== 'true') {
      query += ' WHERE is_active = true';
    }
    query += ' ORDER BY display_order ASC, id ASC';

    const result = await pool.query(query);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Fetch master highlights error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch master highlights' });
  }
});

/**
 * POST Create Master Highlight
 * POST /api/listings/master-highlights
 */
router.post('/master-highlights', async (req, res) => {
  try {
    const { key, label, icon, display_order, is_active } = req.body;
    if (!label || !label.trim()) {
      return res.status(400).json({ success: false, message: 'Highlight label is required' });
    }

    const autoKey = (key && key.trim())
      ? key.trim().toLowerCase().replace(/\s+/g, '-')
      : label.trim().toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    const check = await pool.query('SELECT id FROM master_highlights WHERE key = $1', [autoKey]);
    if (check.rows.length > 0) {
      return res.status(400).json({ success: false, message: `Highlight with key "${autoKey}" already exists` });
    }

    const result = await pool.query(
      `INSERT INTO master_highlights (key, label, icon, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        autoKey,
        label.trim(),
        icon ? icon.trim() : 'star',
        display_order !== undefined ? parseInt(display_order, 10) : 0,
        is_active !== false
      ]
    );

    res.status(201).json({ success: true, message: 'Highlight created successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Create master highlight error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create master highlight' });
  }
});

/**
 * PUT Update Master Highlight
 * PUT /api/listings/master-highlights/:id
 */
router.put('/master-highlights/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { key, label, icon, display_order, is_active } = req.body;

    const check = await pool.query('SELECT * FROM master_highlights WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Highlight not found' });
    }

    const cur = check.rows[0];
    const updatedKey = key !== undefined ? key.trim().toLowerCase() : cur.key;
    const updatedLabel = label !== undefined ? label.trim() : cur.label;
    const updatedIcon = icon !== undefined ? icon.trim() : cur.icon;
    const updatedOrder = display_order !== undefined ? parseInt(display_order, 10) : cur.display_order;
    const updatedIsActive = is_active !== undefined ? is_active : cur.is_active;

    const result = await pool.query(
      `UPDATE master_highlights
       SET key = $1, label = $2, icon = $3, display_order = $4, is_active = $5
       WHERE id = $6
       RETURNING *`,
      [updatedKey, updatedLabel, updatedIcon, updatedOrder, updatedIsActive, id]
    );

    res.status(200).json({ success: true, message: 'Highlight updated successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Update master highlight error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update master highlight' });
  }
});

/**
 * DELETE Master Highlight
 * DELETE /api/listings/master-highlights/:id
 */
router.delete('/master-highlights/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM master_highlights WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Highlight not found' });
    }
    res.status(200).json({ success: true, message: 'Highlight deleted successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Delete master highlight error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete master highlight' });
  }
});

/**
 * =========================================================================
 * MASTER BOOKING OPTIONS ENDPOINTS (HostStep3 Step 2 - Pick your booking settings)
 * =========================================================================
 */

/**
 * GET All Master Booking Options
 * GET /api/listings/master-booking-options
 */
router.get('/master-booking-options', async (req, res) => {
  try {
    const { all } = req.query;
    let query = 'SELECT * FROM master_booking_options';
    if (all !== 'true') {
      query += ' WHERE is_active = true';
    }
    query += ' ORDER BY display_order ASC, id ASC';

    const result = await pool.query(query);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Fetch master booking options error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch master booking options' });
  }
});

/**
 * POST Create Master Booking Option
 * POST /api/listings/master-booking-options
 */
router.post('/master-booking-options', async (req, res) => {
  try {
    const { key, title, badge, description, icon, display_order, is_active } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Option title is required' });
    }

    const autoKey = (key && key.trim())
      ? key.trim().toLowerCase().replace(/\s+/g, '-')
      : title.trim().toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    const check = await pool.query('SELECT id FROM master_booking_options WHERE key = $1', [autoKey]);
    if (check.rows.length > 0) {
      return res.status(400).json({ success: false, message: `Option with key "${autoKey}" already exists` });
    }

    const result = await pool.query(
      `INSERT INTO master_booking_options (key, title, badge, description, icon, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        autoKey,
        title.trim(),
        badge ? badge.trim() : '',
        description ? description.trim() : '',
        icon ? icon.trim() : 'calendar',
        display_order !== undefined ? parseInt(display_order, 10) : 0,
        is_active !== false
      ]
    );

    res.status(201).json({ success: true, message: 'Booking option created successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Create master booking option error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create booking option' });
  }
});

/**
 * PUT Update Master Booking Option
 * PUT /api/listings/master-booking-options/:id
 */
router.put('/master-booking-options/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { key, title, badge, description, icon, display_order, is_active } = req.body;

    const check = await pool.query('SELECT * FROM master_booking_options WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking option not found' });
    }

    const cur = check.rows[0];
    const updatedKey = key !== undefined ? key.trim().toLowerCase() : cur.key;
    const updatedTitle = title !== undefined ? title.trim() : cur.title;
    const updatedBadge = badge !== undefined ? badge.trim() : cur.badge;
    const updatedDesc = description !== undefined ? description.trim() : cur.description;
    const updatedIcon = icon !== undefined ? icon.trim() : cur.icon;
    const updatedOrder = display_order !== undefined ? parseInt(display_order, 10) : cur.display_order;
    const updatedIsActive = is_active !== undefined ? is_active : cur.is_active;

    const result = await pool.query(
      `UPDATE master_booking_options
       SET key = $1, title = $2, badge = $3, description = $4, icon = $5, display_order = $6, is_active = $7
       WHERE id = $8
       RETURNING *`,
      [updatedKey, updatedTitle, updatedBadge, updatedDesc, updatedIcon, updatedOrder, updatedIsActive, id]
    );

    res.status(200).json({ success: true, message: 'Booking option updated successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Update master booking option error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update booking option' });
  }
});

/**
 * DELETE Master Booking Option
 * DELETE /api/listings/master-booking-options/:id
 */
router.delete('/master-booking-options/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM master_booking_options WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking option not found' });
    }
    res.status(200).json({ success: true, message: 'Booking option deleted successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Delete master booking option error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete booking option' });
  }
});

/**
 * =========================================================================
 * MASTER DISCOUNTS ENDPOINTS (HostStep3 Step 4 - Add discounts)
 * =========================================================================
 */

/**
 * GET All Master Discounts
 * GET /api/listings/master-discounts
 */
router.get('/master-discounts', async (req, res) => {
  try {
    const { all } = req.query;
    let query = 'SELECT * FROM master_discounts';
    if (all !== 'true') {
      query += ' WHERE is_active = true';
    }
    query += ' ORDER BY display_order ASC, id ASC';

    const result = await pool.query(query);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Fetch master discounts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch master discounts' });
  }
});

/**
 * POST Create Master Discount
 * POST /api/listings/master-discounts
 */
router.post('/master-discounts', async (req, res) => {
  try {
    const { key, title, description, discount_percentage, is_customizable, display_order, is_active } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Discount title is required' });
    }

    const autoKey = (key && key.trim())
      ? key.trim()
      : title.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    const check = await pool.query('SELECT id FROM master_discounts WHERE key = $1', [autoKey]);
    if (check.rows.length > 0) {
      return res.status(400).json({ success: false, message: `Discount with key "${autoKey}" already exists` });
    }

    const result = await pool.query(
      `INSERT INTO master_discounts (key, title, description, discount_percentage, is_customizable, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        autoKey,
        title.trim(),
        description ? description.trim() : '',
        discount_percentage !== undefined ? parseInt(discount_percentage, 10) : 0,
        is_customizable !== false,
        display_order !== undefined ? parseInt(display_order, 10) : 0,
        is_active !== false
      ]
    );

    res.status(201).json({ success: true, message: 'Discount created successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Create master discount error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create discount' });
  }
});

/**
 * PUT Update Master Discount
 * PUT /api/listings/master-discounts/:id
 */
router.put('/master-discounts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { key, title, description, discount_percentage, is_customizable, display_order, is_active } = req.body;

    const check = await pool.query('SELECT * FROM master_discounts WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Discount not found' });
    }

    const cur = check.rows[0];
    const updatedKey = key !== undefined ? key.trim() : cur.key;
    const updatedTitle = title !== undefined ? title.trim() : cur.title;
    const updatedDesc = description !== undefined ? description.trim() : cur.description;
    const updatedPct = discount_percentage !== undefined ? parseInt(discount_percentage, 10) : cur.discount_percentage;
    const updatedCustom = is_customizable !== undefined ? is_customizable : cur.is_customizable;
    const updatedOrder = display_order !== undefined ? parseInt(display_order, 10) : cur.display_order;
    const updatedIsActive = is_active !== undefined ? is_active : cur.is_active;

    const result = await pool.query(
      `UPDATE master_discounts
       SET key = $1, title = $2, description = $3, discount_percentage = $4, is_customizable = $5, display_order = $6, is_active = $7
       WHERE id = $8
       RETURNING *`,
      [updatedKey, updatedTitle, updatedDesc, updatedPct, updatedCustom, updatedOrder, updatedIsActive, id]
    );

    res.status(200).json({ success: true, message: 'Discount updated successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Update master discount error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update discount' });
  }
});

/**
 * DELETE Master Discount
 * DELETE /api/listings/master-discounts/:id
 */
router.delete('/master-discounts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM master_discounts WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Discount not found' });
    }
    res.status(200).json({ success: true, message: 'Discount deleted successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Delete master discount error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete discount' });
  }
});

/**
 * =========================================================================
 * MASTER SAFETY ITEMS ENDPOINTS (HostStep3 Step 5 - Share safety details)
 * =========================================================================
 */

/**
 * GET All Master Safety Items
 * GET /api/listings/master-safety-items
 */
router.get('/master-safety-items', async (req, res) => {
  try {
    const { all } = req.query;
    let query = 'SELECT * FROM master_safety_items';
    if (all !== 'true') {
      query += ' WHERE is_active = true';
    }
    query += ' ORDER BY display_order ASC, id ASC';

    const result = await pool.query(query);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Fetch master safety items error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch master safety items' });
  }
});

/**
 * POST Create Master Safety Item
 * POST /api/listings/master-safety-items
 */
router.post('/master-safety-items', async (req, res) => {
  try {
    const { key, label, requires_details, display_order, is_active } = req.body;
    if (!label || !label.trim()) {
      return res.status(400).json({ success: false, message: 'Safety item label is required' });
    }

    const autoKey = (key && key.trim())
      ? key.trim()
      : label.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    const check = await pool.query('SELECT id FROM master_safety_items WHERE key = $1', [autoKey]);
    if (check.rows.length > 0) {
      return res.status(400).json({ success: false, message: `Safety item with key "${autoKey}" already exists` });
    }

    const result = await pool.query(
      `INSERT INTO master_safety_items (key, label, requires_details, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        autoKey,
        label.trim(),
        requires_details === true,
        display_order !== undefined ? parseInt(display_order, 10) : 0,
        is_active !== false
      ]
    );

    res.status(201).json({ success: true, message: 'Safety item created successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Create master safety item error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create safety item' });
  }
});

/**
 * PUT Update Master Safety Item
 * PUT /api/listings/master-safety-items/:id
 */
router.put('/master-safety-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { key, label, requires_details, display_order, is_active } = req.body;

    const check = await pool.query('SELECT * FROM master_safety_items WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Safety item not found' });
    }

    const cur = check.rows[0];
    const updatedKey = key !== undefined ? key.trim() : cur.key;
    const updatedLabel = label !== undefined ? label.trim() : cur.label;
    const updatedReq = requires_details !== undefined ? requires_details : cur.requires_details;
    const updatedOrder = display_order !== undefined ? parseInt(display_order, 10) : cur.display_order;
    const updatedIsActive = is_active !== undefined ? is_active : cur.is_active;

    const result = await pool.query(
      `UPDATE master_safety_items
       SET key = $1, label = $2, requires_details = $3, display_order = $4, is_active = $5
       WHERE id = $6
       RETURNING *`,
      [updatedKey, updatedLabel, updatedReq, updatedOrder, updatedIsActive, id]
    );

    res.status(200).json({ success: true, message: 'Safety item updated successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Update master safety item error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update safety item' });
  }
});

/**
 * DELETE Master Safety Item
 * DELETE /api/listings/master-safety-items/:id
 */
router.delete('/master-safety-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM master_safety_items WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Safety item not found' });
    }
    res.status(200).json({ success: true, message: 'Safety item deleted successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Delete master safety item error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete safety item' });
  }
});

/**
 * GET Dynamic Host Categories (Services & Experiences)
 * GET /api/listings/host-categories?type=service|experience
 */
router.get('/host-categories', async (req, res) => {
  try {
    const { type, all } = req.query;
    let query = 'SELECT * FROM host_categories';
    const params = [];
    const conditions = [];

    // If 'all' is not true, show only active ones
    if (all !== 'true') {
      conditions.push('is_active = true');
    }

    if (type) {
      params.push(type.toLowerCase());
      conditions.push(`LOWER(hosting_type) = $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
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
 * GET Dynamic Intro to Host Webinars
 * GET /api/listings/intro-webinars
 */
router.get('/intro-webinars', async (req, res) => {
  try {
    const { all } = req.query;
    let query = 'SELECT * FROM intro_webinars';
    if (all !== 'true') {
      query += ' WHERE is_active = true';
    }
    query += ' ORDER BY display_order ASC, id ASC';
    const result = await pool.query(query);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Intro webinars error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch intro webinars' });
  }
});

/**
 * GET Dynamic Intro to Host FAQs (supports category=experience|general)
 * GET /api/listings/intro-faqs?category=experience
 */
router.get('/intro-faqs', async (req, res) => {
  try {
    const { all, category } = req.query;

    // Check if category=experience faqs exist, if not seed them
    if (category === 'experience') {
      const checkExpFaqs = await pool.query("SELECT COUNT(*) FROM intro_faqs WHERE category = 'experience'");
      if (parseInt(checkExpFaqs.rows[0].count, 10) === 0) {
        await pool.query(`
          INSERT INTO intro_faqs (question, answer, category, display_order)
          VALUES
          ('Top questions', 'Here are some of the most frequently asked questions about hosting an Airbnb experience. Experiences are small-group activities led by passionate local hosts that immerse guests in unique cultures, skills, or adventures.', 'experience', 1),
          ('Hosting basics', 'Learn the basics of hosting an experience, including requirements and expectations. All experiences must offer expertise, insider access, and a connection with the host.', 'experience', 2),
          ('Application process', 'Find out how to submit your experience idea and what we look for in applications. Our review team evaluates quality standards, host background, and safety.', 'experience', 3),
          ('Licensing & insurance', 'Understand the local regulations, licensing, and insurance requirements for your activity. Hosts are protected under Airbnb''s Experience Protection Insurance.', 'experience', 4);
        `);
      }
    }

    let query = 'SELECT * FROM intro_faqs WHERE 1=1';
    const params = [];

    if (all !== 'true') {
      query += ' AND is_active = true';
    }

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    query += ' ORDER BY display_order ASC, id ASC';
    const result = await pool.query(query, params);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Intro faqs error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch intro FAQs' });
  }
});

/**
 * GET Host Calendar Dates
 * GET /api/listings/calendar-dates?host_id=...&listing_id=...&month=...&year=...
 */
router.get('/calendar-dates', async (req, res) => {
  try {
    const { host_id, listing_id, month, year } = req.query;
    let query = `
      SELECT 
        id, host_id, listing_id, 
        TO_CHAR(calendar_date, 'YYYY-MM-DD') as date_str,
        is_available, price, note
      FROM host_calendar_dates
      WHERE 1=1
    `;
    const params = [];

    if (host_id && !isNaN(Number(host_id))) {
      params.push(Number(host_id));
      query += ` AND host_id = $${params.length}`;
    }

    if (listing_id && !isNaN(Number(listing_id))) {
      params.push(Number(listing_id));
      query += ` AND listing_id = $${params.length}`;
    }

    if (month && year && !isNaN(Number(month)) && !isNaN(Number(year))) {
      params.push(Number(month));
      query += ` AND EXTRACT(MONTH FROM calendar_date) = $${params.length}`;
      params.push(Number(year));
      query += ` AND EXTRACT(YEAR FROM calendar_date) = $${params.length}`;
    }

    query += ' ORDER BY calendar_date ASC';
    const result = await pool.query(query, params);

    // Also fetch confirmed bookings in this month so booked dates are reflected
    let bookedDates = [];
    try {
      const bRes = await pool.query(`
        SELECT check_in, check_out, guest_name, booking_code
        FROM bookings
        WHERE status = 'CONFIRMED'
      `);
      bookedDates = bRes.rows;
    } catch (e) {}

    res.status(200).json({
      success: true,
      dates: result.rows,
      bookedDates
    });
  } catch (error) {
    console.error('Fetch calendar dates error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch calendar dates' });
  }
});

/**
 * UPSERT Host Calendar Date (Set Availability, Custom Price, or Note)
 * POST /api/listings/calendar-dates
 */
router.post('/calendar-dates', async (req, res) => {
  try {
    const { host_id, listing_id, date, is_available, price, note } = req.body;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const hId = host_id && !isNaN(Number(host_id)) ? Number(host_id) : 4;
    const lId = listing_id && !isNaN(Number(listing_id)) ? Number(listing_id) : null;
    const avail = is_available !== undefined ? Boolean(is_available) : true;
    const pr = price !== undefined && price !== '' ? Number(price) : null;
    const nt = note !== undefined ? note : '';

    const query = `
      INSERT INTO host_calendar_dates (host_id, listing_id, calendar_date, is_available, price, note, updated_at)
      VALUES ($1, $2, $3::DATE, $4, $5, $6, CURRENT_TIMESTAMP)
      ON CONFLICT (host_id, listing_id, calendar_date)
      DO UPDATE SET
        is_available = EXCLUDED.is_available,
        price = COALESCE(EXCLUDED.price, host_calendar_dates.price),
        note = EXCLUDED.note,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *, TO_CHAR(calendar_date, 'YYYY-MM-DD') as date_str;
    `;

    const result = await pool.query(query, [hId, lId, date, avail, pr, nt]);

    res.status(200).json({
      success: true,
      message: 'Calendar updated successfully',
      date: result.rows[0]
    });
  } catch (error) {
    console.error('Update calendar date error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update calendar' });
  }
});

/**
 * CREATE Host Category (Services / Experiences)
 * POST /api/listings/host-categories
 */
router.post('/host-categories', async (req, res) => {
  try {
    const { hosting_type, name, icon, sub_options, is_active } = req.body;
    if (!hosting_type || !name) {
      return res.status(400).json({ success: false, message: 'hosting_type and name are required' });
    }

    const subArr = Array.isArray(sub_options) 
      ? sub_options 
      : (typeof sub_options === 'string' ? sub_options.split(',').map(s => s.trim()).filter(Boolean) : []);

    const result = await pool.query(
      `INSERT INTO host_categories (hosting_type, name, icon, sub_options, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [hosting_type.toLowerCase(), name, icon || '✨', subArr, is_active !== false]
    );

    res.status(201).json({ success: true, message: 'Category created successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Create host category error:', error);
    res.status(500).json({ success: false, message: 'Failed to create host category' });
  }
});

/**
 * UPDATE Host Category
 * PUT /api/listings/host-categories/:id
 */
router.put('/host-categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { hosting_type, name, icon, sub_options, is_active } = req.body;

    const subArr = Array.isArray(sub_options) 
      ? sub_options 
      : (typeof sub_options === 'string' ? sub_options.split(',').map(s => s.trim()).filter(Boolean) : undefined);

    const check = await pool.query('SELECT * FROM host_categories WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const current = check.rows[0];
    const updatedHostingType = hosting_type ? hosting_type.toLowerCase() : current.hosting_type;
    const updatedName = name ?? current.name;
    const updatedIcon = icon ?? current.icon;
    const updatedSubOptions = subArr !== undefined ? subArr : current.sub_options;
    const updatedIsActive = is_active !== undefined ? is_active : current.is_active;

    const result = await pool.query(
      `UPDATE host_categories 
       SET hosting_type = $1, name = $2, icon = $3, sub_options = $4, is_active = $5
       WHERE id = $6
       RETURNING *`,
      [updatedHostingType, updatedName, updatedIcon, updatedSubOptions, updatedIsActive, id]
    );

    res.status(200).json({ success: true, message: 'Category updated successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Update host category error:', error);
    res.status(500).json({ success: false, message: 'Failed to update host category' });
  }
});

/**
 * DELETE Host Category
 * DELETE /api/listings/host-categories/:id
 */
/**
 * DELETE Host Category
 * DELETE /api/listings/host-categories/:id
 */
router.delete('/host-categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM host_categories WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, message: 'Category deleted successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Delete host category error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete host category' });
  }
});

/**
 * SEARCH & AUTOCOMPLETE Address / Location (Host Setup Address Modal)
 * GET /api/listings/locations/search?q=query&lat=...&lng=...
 */
router.get('/locations/search', async (req, res) => {
  try {
    const { q, lat, lng } = req.query;

    // 1. If lat & lng are passed, perform real reverse geocoding dynamically using high-precision OpenStreetMap Nominatim
    if (lat && lng) {
      try {
        const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`;
        const osmRes = await fetch(osmUrl, {
          headers: {
            'User-Agent': 'AirbnbCloneApp/2.0 (contact: support@airbnb.local)',
            'Accept-Language': 'en'
          }
        });

        if (osmRes.ok) {
          const osmData = await osmRes.json();
          const addr = osmData.address || {};
          
          const country = addr.country || 'India';
          const countryCode = (addr.country_code || 'in').toUpperCase();
          const pin = addr.postcode || '';
          const state = addr.state || addr.region || '';
          const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || '';
          const district = addr.suburb || addr.neighbourhood || addr.city_district || addr.district || addr.county || city;
          
          // Compose complete detailed street address
          const streetParts = [
            addr.house_number,
            addr.building,
            addr.road || addr.pedestrian || addr.footway || addr.path,
            addr.neighbourhood || addr.suburb
          ].filter(Boolean);
          const street = streetParts.length > 0 ? Array.from(new Set(streetParts)).join(', ') : (addr.road || district);

          const landmark = addr.amenity || addr.shop || addr.tourism || addr.leisure || '';
          const flat = [addr.house_number, addr.building].filter(Boolean).join(', ') || '';

          const full_address = osmData.display_name || [street, district, city, state, pin, country].filter(Boolean).join(', ');

          const liveAddress = {
            country,
            country_code: countryCode,
            flat,
            street,
            landmark,
            district,
            city,
            state,
            pin,
            lat: parseFloat(lat || osmData.lat),
            lng: parseFloat(lng || osmData.lon),
            full_address
          };

          return res.status(200).json({
            success: true,
            is_live: true,
            count: 1,
            data: [liveAddress]
          });
        }
      } catch (osmErr) {
        console.warn('Backend Nominatim live reverse-geocoding fallback:', osmErr.message);
      }

      // Fallback geocoder if Nominatim is unreachable
      try {
        const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
        const geoRes = await fetch(geoUrl);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          const city = geoData.city || geoData.locality || geoData.principalSubdivisionDistrict || '';
          const state = geoData.principalSubdivision || '';
          const country = geoData.countryName || 'India';
          const countryCode = geoData.countryCode || 'IN';
          const pin = geoData.postcode || '';
          const street = geoData.localityInfo?.administrative?.[3]?.name || geoData.locality || '';
          const district = geoData.localityInfo?.administrative?.[2]?.name || city;

          const liveAddress = {
            country,
            country_code: countryCode,
            flat: '',
            street,
            landmark: '',
            district,
            city,
            state,
            pin,
            full_address: [street, district, city, state, pin, country].filter(Boolean).join(', ')
          };

          return res.status(200).json({
            success: true,
            is_live: true,
            count: 1,
            data: [liveAddress]
          });
        }
      } catch (geoErr) {
        console.warn('Backend BigDataCloud fallback:', geoErr.message);
      }
    }

    // Preset verified locations across popular Indian cities & regions
    const predefinedLocations = [
      {
        country: 'India',
        country_code: 'IN',
        flat: 'Flat 101, Vaishali Tower II',
        street: '1st floor, Vaishali Tower II, 101, Nursery Circle',
        landmark: 'Near Nursery Circle Garden',
        district: 'Vaishali Nagar',
        city: 'Jaipur',
        state: 'Rajasthan',
        pin: '302021',
        full_address: '1st floor, Vaishali Tower II, 101, Nursery Circle, Vaishali Nagar, Jaipur, Rajasthan 302021, India'
      },
      {
        country: 'India',
        country_code: 'IN',
        flat: 'House 42, Heritage Enclave',
        street: 'Subhash Marg, C-Scheme',
        landmark: 'Opposite Central Park Gate 2',
        district: 'C-Scheme',
        city: 'Jaipur',
        state: 'Rajasthan',
        pin: '302001',
        full_address: 'Subhash Marg, C-Scheme, Jaipur, Rajasthan 302001, India'
      },
      {
        country: 'India',
        country_code: 'IN',
        flat: 'Villa No. 7, Lakeview Residency',
        street: 'Haridas Ji Ki Magri, Trident Road',
        landmark: 'Near Oberoi Udaivilas',
        district: 'Haridas Ji Ki Magri',
        city: 'Udaipur',
        state: 'Rajasthan',
        pin: '313001',
        full_address: 'Haridas Ji Ki Magri, Trident Road, Udaipur, Rajasthan 313001, India'
      },
      {
        country: 'India',
        country_code: 'IN',
        flat: 'Bungalow 12, Coconut Grove',
        street: 'Calangute - Baga Road, Cobravaddo',
        landmark: 'Behind Tito\'s Lane',
        district: 'North Goa',
        city: 'Calangute',
        state: 'Goa',
        pin: '403516',
        full_address: 'Calangute - Baga Road, Cobravaddo, North Goa, Goa 403516, India'
      },
      {
        country: 'India',
        country_code: 'IN',
        flat: 'Flat 402, Pine Wood Heights',
        street: 'Hadimba Temple Road, Old Manali',
        landmark: 'Near Hadimba Devi Temple',
        district: 'Kullu',
        city: 'Manali',
        state: 'Himachal Pradesh',
        pin: '175131',
        full_address: 'Hadimba Temple Road, Old Manali, Manali, Himachal Pradesh 175131, India'
      },
      {
        country: 'India',
        country_code: 'IN',
        flat: 'Tower B, Suite 1204, Cyber City Heights',
        street: 'DLF Phase 2, Golf Course Road',
        landmark: 'Opposite Cyber Hub Metro Station',
        district: 'DLF Phase 2',
        city: 'Gurugram',
        state: 'Haryana',
        pin: '122002',
        full_address: 'DLF Phase 2, Golf Course Road, Gurugram, Haryana 122002, India'
      },
      {
        country: 'India',
        country_code: 'IN',
        flat: 'Flat 14A, Marine View Apartments',
        street: 'Bandra Bandstand Promenade',
        landmark: 'Near Mannat',
        district: 'Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pin: '400050',
        full_address: 'Bandra Bandstand Promenade, Bandra West, Mumbai, Maharashtra 400050, India'
      },
      {
        country: 'India',
        country_code: 'IN',
        flat: 'House 88, 100 Feet Road',
        street: '12th Main, HAL 2nd Stage, Indiranagar',
        landmark: 'Near Toit Brewpub',
        district: 'Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pin: '560038',
        full_address: '12th Main, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038, India'
      }
    ];

    // Also fetch distinct locations registered in current listings
    const dbLocs = await pool.query(
      `SELECT DISTINCT city, state, country, street FROM listings WHERE city IS NOT NULL AND city != '' LIMIT 20`
    );

    const dynamicFromDb = dbLocs.rows.map(row => ({
      country: row.country || 'India',
      country_code: 'IN',
      flat: '',
      street: row.street || `${row.city} Central Road`,
      landmark: '',
      district: row.city,
      city: row.city,
      state: row.state || 'Rajasthan',
      pin: '302001',
      full_address: `${row.street ? row.street + ', ' : ''}${row.city}, ${row.state || ''}, ${row.country || 'India'}`
    }));

    const allCombined = [...predefinedLocations, ...dynamicFromDb];

    // Filter by query string if provided
    if (q && q.trim()) {
      const searchTerm = q.trim().toLowerCase();
      
      // 1. First fetch live dynamic matches from OpenStreetMap Nominatim for accurate full addresses
      let liveOsmResults = [];
      try {
        const searchOsmUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(q.trim())}&addressdetails=1&limit=6`;
        const osmSearchRes = await fetch(searchOsmUrl, {
          headers: {
            'User-Agent': 'AirbnbCloneApp/2.0 (contact: support@airbnb.local)',
            'Accept-Language': 'en'
          }
        });
        if (osmSearchRes.ok) {
          const osmItems = await osmSearchRes.json();
          liveOsmResults = osmItems.map(item => {
            const addr = item.address || {};
            const country = addr.country || 'India';
            const countryCode = (addr.country_code || 'in').toUpperCase();
            const pin = addr.postcode || '';
            const state = addr.state || addr.region || '';
            const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || '';
            const district = addr.suburb || addr.neighbourhood || addr.city_district || addr.district || addr.county || city;
            
            const streetParts = [
              addr.house_number,
              addr.building,
              addr.road || addr.pedestrian || addr.footway || addr.path,
              addr.neighbourhood || addr.suburb
            ].filter(Boolean);
            const street = streetParts.length > 0 ? Array.from(new Set(streetParts)).join(', ') : (addr.road || item.name || district);
            const landmark = addr.amenity || addr.shop || addr.tourism || addr.leisure || '';
            const flat = [addr.house_number, addr.building].filter(Boolean).join(', ') || '';

            return {
              country,
              country_code: countryCode,
              flat,
              street,
              landmark,
              district,
              city,
              state,
              pin,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              full_address: item.display_name || [street, district, city, state, pin, country].filter(Boolean).join(', ')
            };
          });
        }
      } catch (err) {
        console.warn('Nominatim search failed:', err.message);
      }

      // 2. Also match from existing listings and combined list
      const filtered = allCombined.filter(loc => 
        loc.full_address.toLowerCase().includes(searchTerm) ||
        loc.city.toLowerCase().includes(searchTerm) ||
        loc.district.toLowerCase().includes(searchTerm) ||
        loc.street.toLowerCase().includes(searchTerm) ||
        loc.state.toLowerCase().includes(searchTerm) ||
        loc.pin.includes(searchTerm)
      );

      const allMerged = [...liveOsmResults, ...filtered];
      // Deduplicate by full_address
      const seen = new Set();
      const uniqueResults = allMerged.filter(item => {
        const key = (item.full_address || '').toLowerCase().trim();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      return res.status(200).json({
        success: true,
        count: uniqueResults.length,
        data: uniqueResults.length > 0 ? uniqueResults : [
          {
            country: 'India',
            country_code: 'IN',
            flat: '',
            street: q.trim(),
            landmark: '',
            district: q.trim(),
            city: q.trim().split(',')[0] || '',
            state: '',
            pin: '',
            full_address: `${q.trim()}, India`
          }
        ]
      });
    }

    // Default list
    return res.status(200).json({
      success: true,
      count: predefinedLocations.length,
      data: predefinedLocations
    });
  } catch (error) {
    console.error('Location search error:', error);
    res.status(500).json({ success: false, message: 'Failed to search locations' });
  }
});



/**
 * GET All Home Destinations (Public for Homepage & Admin MasterData)
 * GET /api/listings/home-destinations
 */
router.get('/home-destinations', async (req, res) => {
  try {
    const { all, status } = req.query;
    let query = 'SELECT * FROM home_destinations';
    if (!all) {
      if (status === 'inactive') {
        query += ' WHERE is_active = false';
      } else {
        query += ' WHERE is_active = true';
      }
    }
    query += ' ORDER BY display_order ASC, id ASC';
    const result = await pool.query(query);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Fetch home destinations error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch home destinations' });
  }
});

/**
 * CREATE Home Destination (Admin MasterData)
 * POST /api/listings/home-destinations
 */
router.post('/home-destinations', async (req, res) => {
  try {
    const { country, title, image, display_order, is_active } = req.body;
    if (!country || !title || !image) {
      return res.status(400).json({ success: false, message: 'Country, title, and image are required' });
    }
    const result = await pool.query(
      `INSERT INTO home_destinations (country, title, image, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [country, title, image, parseInt(display_order, 10) || 0, is_active !== false]
    );
    res.status(201).json({ success: true, message: 'Destination created', data: result.rows[0] });
  } catch (error) {
    console.error('Create home destination error:', error);
    res.status(500).json({ success: false, message: 'Failed to create destination' });
  }
});

/**
 * UPDATE Home Destination (Admin MasterData)
 * PUT /api/listings/home-destinations/:id
 */
router.put('/home-destinations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { country, title, image, display_order, is_active } = req.body;
    const result = await pool.query(
      `UPDATE home_destinations 
       SET country = COALESCE($1, country),
           title = COALESCE($2, title),
           image = COALESCE($3, image),
           display_order = COALESCE($4, display_order),
           is_active = COALESCE($5, is_active)
       WHERE id = $6 RETURNING *`,
      [country, title, image, display_order !== undefined ? parseInt(display_order, 10) : null, is_active, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.status(200).json({ success: true, message: 'Destination updated', data: result.rows[0] });
  } catch (error) {
    console.error('Update home destination error:', error);
    res.status(500).json({ success: false, message: 'Failed to update destination' });
  }
});

/**
 * DELETE Home Destination (Admin MasterData)
 * DELETE /api/listings/home-destinations/:id
 */
router.delete('/home-destinations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM home_destinations WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.status(200).json({ success: true, message: 'Destination deleted' });
  } catch (error) {
    console.error('Delete home destination error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete destination' });
  }
});

/**
 * GET Single Listing Details
 * GET /api/listings/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        l.*,
        COALESCE(
          NULLIF(u.host_display_name, ''),
          NULLIF(CONCAT(u.first_name, ' ', COALESCE(u.last_name, '')), ' '),
          NULLIF(u.first_name, ''),
          NULLIF(l.host_name, ''),
          'Airbnb Host'
        ) AS host_name,
        COALESCE(u.avatar, NULLIF(l.host_avatar, '')) AS host_avatar,
        u.about_me AS host_bio,
        COALESCE(u.identity_verification_status, 'Verified') AS host_verification,
        COALESCE(u.preferred_language, 'English') AS host_preferred_language,
        COALESCE(u.last_active_location, l.city) AS host_location,
        u.created_at AS host_member_since
      FROM listings l
      LEFT JOIN users u ON l.host_id = u.id
      WHERE l.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving listing' });
  }
});

/**
 * GET Reviews for a Listing
 * GET /api/listings/:id/reviews
 */
router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM reviews WHERE listing_id = $1 ORDER BY id DESC',
      [id]
    );
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
});

/**
 * POST Create Review for a Listing
 * POST /api/listings/:id/reviews
 */
router.post('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewer_name, reviewer_avatar, reviewer_location, rating, review_text } = req.body;

    if (!reviewer_name || !review_text) {
      return res.status(400).json({ success: false, message: 'Reviewer name and review text are required' });
    }

    const newRev = await pool.query(
      `INSERT INTO reviews (listing_id, reviewer_name, reviewer_avatar, reviewer_location, rating, review_text)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id, reviewer_name, reviewer_avatar || null, reviewer_location || 'India', Number(rating) || 5.0, review_text]
    );

    // Update listing reviews_count and average rating
    const agg = await pool.query(
      'SELECT COUNT(*) as count, AVG(rating) as avg_rating FROM reviews WHERE listing_id = $1',
      [id]
    );
    const newCount = parseInt(agg.rows[0].count, 10);
    const newRating = Number(agg.rows[0].avg_rating).toFixed(2);

    await pool.query(
      'UPDATE listings SET reviews_count = $1, rating = $2 WHERE id = $3',
      [newCount, newRating, id]
    );

    res.status(201).json({ success: true, data: newRev.rows[0] });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ success: false, message: 'Failed to add review' });
  }
});

/**
 * DELETE Review (Admin)
 * DELETE /api/listings/reviews/:reviewId
 */
router.delete('/reviews/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const del = await pool.query('DELETE FROM reviews WHERE id = $1 RETURNING *', [reviewId]);
    if (del.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    const listingId = del.rows[0].listing_id;
    const agg = await pool.query(
      'SELECT COUNT(*) as count, AVG(rating) as avg_rating FROM reviews WHERE listing_id = $1',
      [listingId]
    );
    const newCount = parseInt(agg.rows[0].count, 10) || 0;
    const newRating = newCount > 0 ? Number(agg.rows[0].avg_rating).toFixed(2) : 5.0;

    await pool.query(
      'UPDATE listings SET reviews_count = $1, rating = $2 WHERE id = $3',
      [newCount, newRating, listingId]
    );

    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
});

/**
 * GET All Reviews (Admin Portal Moderation)
 * GET /api/listings/admin/all-reviews
 */
router.get('/admin/all-reviews', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        r.id,
        r.listing_id,
        r.reviewer_name AS "authorName",
        r.author_type AS "authorType",
        COALESCE(r.author_type, 'Guest') AS "authorRole",
        COALESCE(r.recipient_name, COALESCE(l.host_name, 'Airbnb Host')) AS "recipientName",
        COALESCE(r.recipient_role, 'Host') AS "recipientRole",
        COALESCE(l.title, 'Listing Stay') AS "stayTitle",
        ROUND(COALESCE(r.rating, 5)::numeric) AS rating,
        r.review_text AS "comment",
        r.created_at AS date,
        COALESCE(r.status, 'Published') AS status,
        COALESCE(r.flag_reason, '') AS "flagReason",
        r.reviewer_avatar AS "reviewerAvatar",
        r.reviewer_location AS "reviewerLocation"
      FROM reviews r
      LEFT JOIN listings l ON r.listing_id = l.id
      ORDER BY r.id DESC;
    `);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Admin all-reviews error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews for admin' });
  }
});

/**
 * UPDATE Review Status / Flag (Admin Moderation)
 * PUT /api/listings/reviews/:reviewId/status
 */
router.put('/reviews/:reviewId/status', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { status, flagReason } = req.body;

    const result = await pool.query(
      `UPDATE reviews 
       SET status = $1, flag_reason = $2 
       WHERE id = $3 
       RETURNING *`,
      [status || 'Published', flagReason || '', reviewId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Review status updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update review status' });
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
      service_provision_type,
      service_offerings,
      business_hours,
      review_requirements_agreed,
      time
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
    const safeServiceOfferings = service_offerings ? JSON.stringify(service_offerings) : '[]';
    const safeBusinessHours = business_hours ? JSON.stringify(business_hours) : '[]';
    const safeRequirementsAgreed = review_requirements_agreed !== false;
    const safeTime = (time || '').trim() || null;
    // Safeguard host_id: if not a valid positive integer, fallback to active host 4
    let safeHostId = 4;
    if (host_id && !isNaN(parseInt(host_id, 10)) && parseInt(host_id, 10) > 0) {
      safeHostId = parseInt(host_id, 10);
    }
    const safeMaxGuests = parseInt(max_guests, 10) || 1;
    const safeYearsExp = parseInt(years_experience, 10) || 0;
    const safeStatus = req.body.status || 'Active';

    const result = await pool.query(
      `INSERT INTO listings (
        title, type, category, host_name, host_phone, city, price, 
        cover_img, amenities, description, photos, itinerary, discounts, 
        host_id, max_guests, years_experience, host_intro, host_qualifications, host_recognition, online_profiles, 
        residential_address, hosting_as_business, meetup_address, service_area, service_provision_type, 
        service_offerings, business_hours, review_requirements_agreed, rating, reviews_count, status, time
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13::jsonb, $14, $15, $16, $17, $18, $19, $20, $21::jsonb, $22, $23::jsonb, $24::jsonb, $25, $26::jsonb, $27::jsonb, $28, 0, 0, $29, $30)
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
        safeHostId,
        safeMaxGuests,
        safeYearsExp,
        host_intro || '',
        host_qualifications || '',
        host_recognition || '',
        safeOnlineProfiles,
        safeResidentialAddress,
        safeHostingAsBusiness,
        safeMeetupAddress,
        safeServiceArea,
        safeServiceProvisionType,
        safeServiceOfferings,
        safeBusinessHours,
        safeRequirementsAgreed,
        safeStatus,
        safeTime
      ]
    );

    const createdListing = result.rows[0];

    // Trigger confirmation email to host Gmail (Non-blocking)
    (async () => {
      try {
        let recipientEmail = req.body.host_email || null;
        if (!recipientEmail && safeHostId) {
          const userCheck = await pool.query('SELECT email, first_name, last_name FROM users WHERE id = $1', [safeHostId]);
          if (userCheck.rows.length > 0 && userCheck.rows[0].email) {
            recipientEmail = userCheck.rows[0].email;
          }
        }
        if (!recipientEmail) {
          recipientEmail = process.env.SMTP_USER || 'zeeshandivanextechnologies@gmail.com';
        }
        if (recipientEmail && safeStatus === 'Active') {
          await sendListingCreatedEmail(recipientEmail, createdListing);
        }
      } catch (mailErr) {
        console.warn('Listing created mail trigger skipped or failed:', mailErr.message);
      }
    })();

    res.status(201).json({ success: true, data: createdListing, message: 'Listing created successfully' });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create listing',
      detail: error.detail || error.toString()
    });
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

/**
 * TOGGLE Listing Badges (Featured / Guest Favourite)
 * PATCH /api/listings/:id/badges
 */
router.patch('/:id/badges', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_featured, is_guest_favourite } = req.body;

    const check = await pool.query('SELECT is_featured, is_guest_favourite FROM listings WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    const current = check.rows[0];
    const newFeatured = is_featured !== undefined ? Boolean(is_featured) : current.is_featured;
    const newGuestFav = is_guest_favourite !== undefined ? Boolean(is_guest_favourite) : current.is_guest_favourite;

    const result = await pool.query(
      `UPDATE listings 
       SET is_featured = $1, is_guest_favourite = $2 
       WHERE id = $3 
       RETURNING id, is_featured, is_guest_favourite`,
      [newFeatured, newGuestFav, id]
    );

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update badges error:', error);
    res.status(500).json({ success: false, message: 'Failed to update badges' });
  }
});

/**
 * UPDATE Listing Details (Host Listing Editor & Admin)
 * PUT /api/listings/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      type,
      category,
      price,
      city,
      description,
      status,
      amenities,
      photos,
      cover_img,
      discounts,
      service_offerings,
      business_hours,
      max_guests,
      years_experience,
      host_intro,
      host_qualifications,
      itinerary,
      languages,
      accessibility_features,
      co_hosts,
      travel_preference,
      service_radius_desc,
      street,
      state,
      country,
      min_age,
      allow_infants,
      experience_description,
      degree,
      career_highlight,
      simultaneous_bookings,
      social_link,
      cancellation_policy,
      custom_link,
      photo_captions,
      host_name,
      host_avatar,
      is_featured,
      is_guest_favourite,
      bedrooms,
      beds,
      bathrooms,
      categorized_photos,
      time
    } = req.body;

    const check = await pool.query('SELECT * FROM listings WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    const cur = check.rows[0];

    const updatedTitle = title !== undefined ? title : cur.title;
    const updatedType = type !== undefined ? type : cur.type;
    const updatedTime = time !== undefined ? (time ? String(time).trim() : null) : cur.time;
    const updatedCategory = category !== undefined ? category : cur.category;
    const updatedPrice = price !== undefined ? Number(price) : cur.price;
    const updatedCity = city !== undefined ? city : cur.city;
    const updatedDesc = description !== undefined ? description : cur.description;
    const updatedStatus = status !== undefined ? status : cur.status;
    const updatedAmenities = Array.isArray(amenities) ? amenities : cur.amenities;
    const updatedPhotos = Array.isArray(photos) ? photos : cur.photos;
    const updatedCover = cover_img !== undefined ? cover_img : (updatedPhotos && updatedPhotos[0]) || cur.cover_img;
    const updatedHostName = host_name !== undefined ? host_name : cur.host_name;
    const updatedHostAvatar = host_avatar !== undefined ? host_avatar : cur.host_avatar;
    const updatedIsFeatured = is_featured !== undefined ? Boolean(is_featured) : cur.is_featured;
    const updatedIsGuestFav = is_guest_favourite !== undefined ? Boolean(is_guest_favourite) : cur.is_guest_favourite;
    const updatedBedrooms = bedrooms !== undefined ? Number(bedrooms) : (cur.bedrooms !== undefined ? cur.bedrooms : 2);
    const updatedBeds = beds !== undefined ? Number(beds) : (cur.beds !== undefined ? cur.beds : 3);
    const updatedBathrooms = bathrooms !== undefined ? Number(bathrooms) : (cur.bathrooms !== undefined ? cur.bathrooms : 2);
    const safeJson = (val, fallback = null) => {
      if (val === undefined) return fallback;
      if (val === null) return null;
      if (typeof val === 'string') {
        try {
          return JSON.stringify(JSON.parse(val));
        } catch (e) {
          return JSON.stringify(val);
        }
      }
      return JSON.stringify(val);
    };

    const updatedCategorizedPhotos = categorized_photos !== undefined ? safeJson(categorized_photos, '[]') : safeJson(cur.categorized_photos, '[]');
    const updatedDiscounts = discounts !== undefined ? safeJson(discounts) : safeJson(cur.discounts, '{}');
    const updatedOfferings = service_offerings !== undefined ? safeJson(service_offerings) : safeJson(cur.service_offerings, '[]');
    const updatedHours = business_hours !== undefined ? safeJson(business_hours) : safeJson(cur.business_hours, '[]');
    const updatedGuests = max_guests !== undefined ? Number(max_guests) : cur.max_guests;
    const updatedYears = years_experience !== undefined ? Number(years_experience) : cur.years_experience;
    const updatedIntro = host_intro !== undefined ? host_intro : cur.host_intro;
    const updatedQual = host_qualifications !== undefined ? host_qualifications : cur.host_qualifications;
    const updatedItinerary = itinerary !== undefined ? safeJson(itinerary) : safeJson(cur.itinerary, '[]');

    const updatedLanguages = Array.isArray(languages) ? languages : cur.languages;
    const updatedAccessibility = Array.isArray(accessibility_features) ? accessibility_features : cur.accessibility_features;
    const updatedCoHosts = co_hosts !== undefined ? safeJson(co_hosts) : safeJson(cur.co_hosts, '[]');
    const updatedTravelPref = travel_preference !== undefined ? travel_preference : cur.travel_preference;
    const updatedRadiusDesc = service_radius_desc !== undefined ? service_radius_desc : cur.service_radius_desc;
    const updatedStreet = street !== undefined ? street : cur.street;
    const updatedState = state !== undefined ? state : cur.state;
    const updatedCountry = country !== undefined ? country : cur.country;
    const updatedMinAge = min_age !== undefined ? Number(min_age) : cur.min_age;
    const updatedAllowInfants = allow_infants !== undefined ? Boolean(allow_infants) : cur.allow_infants;
    const updatedExpDesc = experience_description !== undefined ? experience_description : cur.experience_description;
    const updatedDegree = degree !== undefined ? degree : cur.degree;
    const updatedCareer = career_highlight !== undefined ? career_highlight : cur.career_highlight;
    const updatedSimultaneous = simultaneous_bookings !== undefined ? simultaneous_bookings : cur.simultaneous_bookings;
    const updatedSocial = social_link !== undefined ? social_link : cur.social_link;
    const updatedCancellation = cancellation_policy !== undefined ? cancellation_policy : cur.cancellation_policy;
    const updatedCustomLink = custom_link !== undefined ? custom_link : cur.custom_link;
    const updatedPhotoCaptions = photo_captions !== undefined ? safeJson(photo_captions, '{}') : safeJson(cur.photo_captions, '{}');

    const result = await pool.query(
      `UPDATE listings SET
        title = $1,
        type = $2,
        category = $3,
        price = $4,
        city = $5,
        description = $6,
        status = $7,
        amenities = $8,
        photos = $9,
        cover_img = $10,
        discounts = $11,
        service_offerings = $12,
        business_hours = $13,
        max_guests = $14,
        years_experience = $15,
        host_intro = $16,
        host_qualifications = $17,
        itinerary = $18,
        languages = $19,
        accessibility_features = $20,
        co_hosts = $21,
        travel_preference = $22,
        service_radius_desc = $23,
        street = $24,
        state = $25,
        country = $26,
        min_age = $27,
        allow_infants = $28,
        experience_description = $29,
        degree = $30,
        career_highlight = $31,
        simultaneous_bookings = $32,
        social_link = $33,
        cancellation_policy = $34,
        custom_link = $35,
        photo_captions = $36,
        host_name = $37,
        host_avatar = $38,
        is_featured = $39,
        is_guest_favourite = $40,
        bedrooms = $41,
        beds = $42,
        bathrooms = $43,
        categorized_photos = $44,
        time = $45
      WHERE id = $46
      RETURNING *`,
      [
        updatedTitle,
        updatedType,
        updatedCategory,
        updatedPrice,
        updatedCity,
        updatedDesc,
        updatedStatus,
        updatedAmenities,
        updatedPhotos,
        updatedCover,
        updatedDiscounts,
        updatedOfferings,
        updatedHours,
        updatedGuests,
        updatedYears,
        updatedIntro,
        updatedQual,
        updatedItinerary,
        updatedLanguages,
        updatedAccessibility,
        updatedCoHosts,
        updatedTravelPref,
        updatedRadiusDesc,
        updatedStreet,
        updatedState,
        updatedCountry,
        updatedMinAge,
        updatedAllowInfants,
        updatedExpDesc,
        updatedDegree,
        updatedCareer,
        updatedSimultaneous,
        updatedSocial,
        updatedCancellation,
        updatedCustomLink,
        updatedPhotoCaptions,
        updatedHostName,
        updatedHostAvatar,
        updatedIsFeatured,
        updatedIsGuestFav,
        updatedBedrooms,
        updatedBeds,
        updatedBathrooms,
        updatedCategorizedPhotos,
        updatedTime,
        id
      ]
    );

    res.status(200).json({ success: true, message: 'Listing updated successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to update listing',
      detail: error.detail || error.toString()
    });
  }
});

/**
 * DELETE Listing (Host Listing Editor & Admin)
 * DELETE /api/listings/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch listing info before deletion to send deletion notice to host
    const existingCheck = await pool.query(
      `SELECT l.id, l.title, l.type, l.category, l.city, l.host_id, l.host_name, u.email as host_email 
       FROM listings l 
       LEFT JOIN users u ON l.host_id = u.id 
       WHERE l.id = $1`,
      [id]
    );

    const listingToDelete = existingCheck.rows[0] || null;

    const result = await pool.query('DELETE FROM listings WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    // Trigger removal notification email to host Gmail (Non-blocking)
    if (listingToDelete) {
      (async () => {
        try {
          let recipientEmail = listingToDelete.host_email || process.env.SMTP_USER || 'zeeshandivanextechnologies@gmail.com';
          if (recipientEmail) {
            await sendListingDeletedEmail(recipientEmail, listingToDelete);
          }
        } catch (mailErr) {
          console.warn('Listing deleted mail trigger failed:', mailErr.message);
        }
      })();
    }

    res.status(200).json({ success: true, message: 'Listing removed successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete listing' });
  }
});

/**
 * GET Top Rated Co-Hosts for FindCostHost Page
 * GET /api/listings/cohosts?city=...
 */
router.get('/cohosts', async (req, res) => {
  try {
    const { city } = req.query;
    let query = `
      SELECT 
        l.host_id,
        l.host_name,
        l.host_avatar,
        COALESCE(NULLIF(l.city, ''), l.residential_address->>'city', 'Jaipur, Rajasthan') as city,
        COALESCE(l.rating, 4.90) as rating,
        COALESCE(l.reviews_count, 12) as reviews_count,
        COALESCE(l.years_experience, 3) as years_experience,
        COUNT(l.id) as properties_managed
      FROM listings l
      WHERE l.host_name IS NOT NULL AND TRIM(l.host_name) != ''
    `;
    const params = [];

    if (city && city.trim()) {
      const cleanCity = city.trim();
      params.push(`%${cleanCity}%`);
      query += ` AND (
        l.city ILIKE $${params.length} 
        OR COALESCE(l.state, '') ILIKE $${params.length} 
        OR COALESCE(l.country, '') ILIKE $${params.length}
        OR l.residential_address->>'city' ILIKE $${params.length}
        OR l.residential_address->>'state' ILIKE $${params.length}
        OR l.residential_address->>'district' ILIKE $${params.length}
        OR l.residential_address->>'full_address' ILIKE $${params.length}
      )`;
    }

    query += `
      GROUP BY l.host_id, l.host_name, l.host_avatar, l.city, l.residential_address, l.rating, l.reviews_count, l.years_experience
      ORDER BY l.rating DESC, l.reviews_count DESC
      LIMIT 12
    `;

    const result = await pool.query(query, params);

    // Fallback list of curated Superhosts across India
    const fallbackHosts = [
      {
        host_name: 'Rajesh Sharma',
        host_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80',
        city: 'Jaipur, Rajasthan',
        rating: 4.98,
        reviews_count: 142,
        years_experience: 5,
        properties_managed: 4
      },
      {
        host_name: 'Priyanka Patel',
        host_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80',
        city: 'North Goa, Goa',
        rating: 4.95,
        reviews_count: 98,
        years_experience: 4,
        properties_managed: 3
      },
      {
        host_name: 'Vikram Rajput',
        host_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
        city: 'Udaipur, Rajasthan',
        rating: 4.96,
        reviews_count: 76,
        years_experience: 3,
        properties_managed: 2
      },
      {
        host_name: 'Siddharth Roy',
        host_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80',
        city: 'Mumbai, Maharashtra',
        rating: 4.92,
        reviews_count: 55,
        years_experience: 4,
        properties_managed: 3
      },
      {
        host_name: 'Kavita Thakur',
        host_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80',
        city: 'Manali, Himachal Pradesh',
        rating: 4.98,
        reviews_count: 82,
        years_experience: 5,
        properties_managed: 2
      },
      {
        host_name: 'Rohan Mehra',
        host_avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80',
        city: 'Gurugram, Haryana',
        rating: 4.89,
        reviews_count: 38,
        years_experience: 3,
        properties_managed: 2
      }
    ];

    if (result.rows.length === 0) {
      if (city && city.trim()) {
        const cLower = city.trim().toLowerCase();
        const matched = fallbackHosts.filter(h => h.city.toLowerCase().includes(cLower) || h.host_name.toLowerCase().includes(cLower));
        return res.status(200).json({ success: true, data: matched });
      }
      return res.status(200).json({ success: true, data: fallbackHosts });
    }

    // Enhance any rows without avatars with nice professional photos
    const avatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80'
    ];

    const finalRows = result.rows.map((r, i) => ({
      ...r,
      host_avatar: r.host_avatar || avatars[i % avatars.length]
    }));

    return res.status(200).json({ success: true, data: finalRows });
  } catch (error) {
    console.error('Co-hosts fetch error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch co-hosts' });
  }
});

/**
 * GET Available Cities for Co-Hosts
 * GET /api/listings/cohosts/cities
 */
router.get('/cohosts/cities', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT 
        COALESCE(NULLIF(l.city, ''), l.residential_address->>'city') as city
      FROM listings l 
      WHERE l.city IS NOT NULL OR l.residential_address->>'city' IS NOT NULL
      LIMIT 20
    `);

    const dbCities = result.rows.map(r => r.city).filter(Boolean);
    const defaultCities = ['Jaipur', 'Goa', 'Udaipur', 'Mumbai', 'Manali', 'Gurugram', 'Delhi', 'Bangalore'];
    const merged = Array.from(new Set([...dbCities, ...defaultCities])).slice(0, 10);

    return res.status(200).json({ success: true, cities: merged });
  } catch (err) {
    return res.status(200).json({ 
      success: true, 
      cities: ['Jaipur', 'Goa', 'Udaipur', 'Mumbai', 'Manali', 'Gurugram'] 
    });
  }
});

/**
 * GET City Earnings Estimate for Host Home
 * GET /api/listings/earnings-estimate?city=...&bedrooms=...
 */
router.get('/earnings-estimate', async (req, res) => {
  try {
    const { city } = req.query;
    const targetCity = city ? city.trim() : 'Jaipur';

    // Calculate average price of active listings in this city from database
    const result = await pool.query(`
      SELECT 
        COALESCE(ROUND(AVG(price)), 3484) as avg_price,
        COUNT(*) as total_listings
      FROM listings 
      WHERE (city ILIKE $1 OR state ILIKE $1) AND price > 0
    `, [`%${targetCity}%`]);

    const avgPrice = Number(result.rows[0]?.avg_price) || 3484;
    const totalListings = Number(result.rows[0]?.total_listings) || 0;

    return res.status(200).json({
      success: true,
      city: targetCity,
      basePrice: avgPrice,
      totalListings
    });
  } catch (err) {
    console.error('Earnings estimate error:', err);
    return res.status(200).json({
      success: true,
      city: 'Jaipur',
      basePrice: 3484,
      totalListings: 10
    });
  }
});

export default router;
