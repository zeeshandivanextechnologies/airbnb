// Helper utilities for managing Wishlists across the app with backend database sync & local fallback

const WISHLISTS_STORAGE_KEY = 'airbnb_user_wishlists';
const API_BASE = '/api/wishlists';

// Synchronous cached retrieval for fast initial renders
export const getStoredWishlists = () => {
  try {
    const raw = localStorage.getItem(WISHLISTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(wl => {
          if (wl.id === 'recently-viewed') {
            return {
              ...wl,
              items: (wl.items || []).filter(i => !String(i.id).startsWith('rv-'))
            };
          }
          return wl;
        });
      }
    }
  } catch (err) {
    console.error('Failed to parse wishlists from storage:', err);
  }

  const defaultWishlists = [
    {
      id: 'recently-viewed',
      title: 'Recently viewed',
      subtitle: 'Recently viewed services',
      items: []
    }
  ];

  try {
    localStorage.setItem(WISHLISTS_STORAGE_KEY, JSON.stringify(defaultWishlists));
  } catch (e) {}

  return defaultWishlists;
};

// Async fetch from backend database with fallback to localStorage
export const fetchLiveWishlists = async (userId = null) => {
  try {
    const url = userId ? `${API_BASE}?user_id=${userId}` : API_BASE;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.wishlists)) {
        localStorage.setItem(WISHLISTS_STORAGE_KEY, JSON.stringify(data.wishlists));
        if (Array.isArray(data.defaultThumbnails) && data.defaultThumbnails.length > 0) {
          localStorage.setItem('airbnb_wishlists_dynamic_thumbnails', JSON.stringify(data.defaultThumbnails));
        }
        window.dispatchEvent(new Event('airbnb_wishlists_updated'));
        return data.wishlists;
      }
    }
  } catch (err) {
    console.warn('Backend wishlist fetch fallback to local cache:', err.message);
  }
  return getStoredWishlists();
};

export const saveWishlists = (wishlists) => {
  try {
    localStorage.setItem(WISHLISTS_STORAGE_KEY, JSON.stringify(wishlists));
    window.dispatchEvent(new Event('airbnb_wishlists_updated'));
  } catch (err) {
    console.error('Failed to save wishlists:', err);
  }
};

// Sync wishlist item to backend
const syncWishlistToBackend = async (wishlist) => {
  try {
    await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wishlist)
    });
  } catch (err) {
    console.warn('Could not sync wishlist to backend:', err.message);
  }
};

export const trackRecentlyViewedItem = (item) => {
  if (!item || (!item.id && !item.title)) return;
  const current = getStoredWishlists();
  let rvTarget = null;
  const updated = current.map(wl => {
    if (wl.id === 'recently-viewed') {
      const existing = (wl.items || []).filter(i => String(i.id) !== String(item.id) && i.title !== item.title);
      rvTarget = {
        ...wl,
        subtitle: 'Recently viewed',
        items: [item, ...existing].slice(0, 20)
      };
      return rvTarget;
    }
    return wl;
  });
  saveWishlists(updated);
  if (rvTarget) syncWishlistToBackend(rvTarget);
};

export const addWishlist = (name, initialItem = null) => {
  const current = getStoredWishlists();
  const trimmed = name.trim();
  const id = `wl-${Date.now()}`;
  
  const newWishlist = {
    id,
    title: trimmed || 'My Wishlist',
    subtitle: 'Just now',
    items: initialItem ? [initialItem] : []
  };

  const updated = [newWishlist, ...current];
  saveWishlists(updated);
  syncWishlistToBackend(newWishlist);
  return newWishlist;
};

export const addItemToWishlist = (wishlistId, item) => {
  const current = getStoredWishlists();
  let targetSynced = null;
  const updated = current.map(wl => {
    if (wl.id === wishlistId) {
      const exists = wl.items.some(i => String(i.id) === String(item.id) || (i.title === item.title && i.image === item.image));
      if (!exists) {
        targetSynced = {
          ...wl,
          subtitle: 'Updated today',
          items: [item, ...wl.items]
        };
        return targetSynced;
      }
    }
    return wl;
  });

  saveWishlists(updated);
  if (targetSynced) syncWishlistToBackend(targetSynced);
  return updated;
};

export const isItemInAnyWishlist = (itemId, itemTitle = '', itemCategory = '') => {
  const current = getStoredWishlists();
  return current
    .filter(wl => wl.id !== 'recently-viewed')
    .some(wl => 
      wl.items && wl.items.some(i => {
        if (itemId && i.id && String(i.id) === String(itemId)) return true;
        if (itemTitle && i.title === itemTitle) {
          if (itemCategory && i.category) {
            return i.category === itemCategory;
          }
          return true;
        }
        return false;
      })
    );
};

export const removeItemFromWishlists = (itemId, itemTitle = '', itemCategory = '') => {
  const current = getStoredWishlists();
  const updated = current.map(wl => {
    if (wl.id === 'recently-viewed') {
      return wl;
    }
    const filtered = (wl.items || []).filter(i => {
      if (itemId && i.id && String(i.id) === String(itemId)) return false;
      if (itemTitle && i.title === itemTitle) {
        if (itemCategory && i.category) {
          return i.category !== itemCategory;
        }
        return false;
      }
      return true;
    });

    const modified = { ...wl, items: filtered };
    syncWishlistToBackend(modified);
    return modified;
  });

  saveWishlists(updated);
  return updated;
};

export const deleteWishlist = async (wishlistId) => {
  const current = getStoredWishlists();
  const updated = current.filter(wl => wl.id !== wishlistId);
  saveWishlists(updated);

  try {
    await fetch(`${API_BASE}/${wishlistId}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('Backend wishlist delete error:', err.message);
  }

  return updated;
};
