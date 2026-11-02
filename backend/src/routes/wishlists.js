import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

// Auto-create user_wishlists table if not exists
const ensureWishlistsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_wishlists (
        id VARCHAR(100) PRIMARY KEY,
        user_id INT,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255) DEFAULT '0 saved',
        items JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (err) {
    console.error('Error ensuring user_wishlists table:', err);
  }
};
ensureWishlistsTable();

/**
 * GET All Wishlists
 * GET /api/wishlists
 */
router.get('/', async (req, res) => {
  const { user_id } = req.query;
  try {
    let query = 'SELECT * FROM user_wishlists ORDER BY updated_at DESC';
    let params = [];
    if (user_id) {
      query = 'SELECT * FROM user_wishlists WHERE user_id = $1 OR user_id IS NULL ORDER BY updated_at DESC';
      params = [user_id];
    }
    const result = await pool.query(query, params);

    // If database has 0 wishlists, insert the standard dynamic 'recently-viewed' container
    if (result.rows.length === 0) {
      const defaultId = 'recently-viewed';
      await pool.query(`
        INSERT INTO user_wishlists (id, title, subtitle, items)
        VALUES ($1, 'Recently viewed', 'Recently viewed services', '[]'::jsonb)
        ON CONFLICT (id) DO NOTHING
      `, [defaultId]);

      return res.status(200).json({
        success: true,
        wishlists: [
          {
            id: 'recently-viewed',
            title: 'Recently viewed',
            subtitle: 'Recently viewed services',
            items: []
          }
        ]
      });
    }

    // Fetch live sample thumbnails from listings table for empty/incomplete cards
    let dbThumbnails = [];
    try {
      const photosRes = await pool.query(`
        SELECT photos, service_offerings
        FROM listings 
        WHERE (photos IS NOT NULL OR service_offerings IS NOT NULL)
        ORDER BY id DESC
        LIMIT 10
      `);
      photosRes.rows.forEach(r => {
        if (Array.isArray(r.photos)) {
          r.photos.forEach(p => {
            if (typeof p === 'string' && p.startsWith('http') && !dbThumbnails.includes(p)) {
              dbThumbnails.push(p);
            }
          });
        }
        if (Array.isArray(r.service_offerings)) {
          r.service_offerings.forEach(so => {
            if (so && so.image && typeof so.image === 'string' && so.image.startsWith('http') && !dbThumbnails.includes(so.image)) {
              dbThumbnails.push(so.image);
            }
          });
        }
      });
    } catch (photoErr) {
      console.warn('Could not query dynamic listing thumbnails:', photoErr.message);
    }

    const mapped = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      items: Array.isArray(row.items) ? row.items : (typeof row.items === 'string' ? JSON.parse(row.items) : []),
      userId: row.user_id,
      updatedAt: row.updated_at
    }));

    return res.status(200).json({ success: true, wishlists: mapped, defaultThumbnails: dbThumbnails.slice(0, 8) });
  } catch (error) {
    console.error('Fetch Wishlists Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch wishlists' });
  }
});

/**
 * CREATE or UPDATE Wishlist
 * POST /api/wishlists
 */
router.post('/', async (req, res) => {
  const { id, title, subtitle, items, user_id } = req.body;
  try {
    const listId = id || `wl-${Date.now()}`;
    const itemsJson = JSON.stringify(items || []);

    const result = await pool.query(`
      INSERT INTO user_wishlists (id, user_id, title, subtitle, items, updated_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE 
      SET title = EXCLUDED.title,
          subtitle = EXCLUDED.subtitle,
          items = EXCLUDED.items,
          updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [listId, user_id || null, title || 'My Wishlist', subtitle || 'Just now', itemsJson]);

    return res.status(200).json({
      success: true,
      message: 'Wishlist saved successfully',
      wishlist: {
        id: result.rows[0].id,
        title: result.rows[0].title,
        subtitle: result.rows[0].subtitle,
        items: result.rows[0].items
      }
    });
  } catch (error) {
    console.error('Save Wishlist Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to save wishlist' });
  }
});

/**
 * DELETE Wishlist
 * DELETE /api/wishlists/:id
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM user_wishlists WHERE id = $1', [id]);
    return res.status(200).json({ success: true, message: 'Wishlist deleted successfully' });
  } catch (error) {
    console.error('Delete Wishlist Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete wishlist' });
  }
});

export default router;

