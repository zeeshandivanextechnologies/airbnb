// Helper utilities for managing Wishlists across the app with persistence (localStorage + custom event)

const WISHLISTS_STORAGE_KEY = 'airbnb_user_wishlists';

export const getStoredWishlists = () => {
  try {
    const raw = localStorage.getItem(WISHLISTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Filter out any obsolete static mock items from older sessions
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

  // Dynamic default state without static fake listings
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

export const saveWishlists = (wishlists) => {
  try {
    localStorage.setItem(WISHLISTS_STORAGE_KEY, JSON.stringify(wishlists));
    // Trigger window event so any open pages or tabs update automatically
    window.dispatchEvent(new Event('airbnb_wishlists_updated'));
  } catch (err) {
    console.error('Failed to save wishlists:', err);
  }
};

export const trackRecentlyViewedItem = (item) => {
  if (!item || (!item.id && !item.title)) return;
  const current = getStoredWishlists();
  const updated = current.map(wl => {
    if (wl.id === 'recently-viewed') {
      const existing = (wl.items || []).filter(i => String(i.id) !== String(item.id) && i.title !== item.title);
      return {
        ...wl,
        subtitle: 'Recently viewed',
        items: [item, ...existing].slice(0, 20)
      };
    }
    return wl;
  });
  saveWishlists(updated);
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
  return newWishlist;
};

export const addItemToWishlist = (wishlistId, item) => {
  const current = getStoredWishlists();
  const updated = current.map(wl => {
    if (wl.id === wishlistId) {
      // Avoid duplicate item
      const exists = wl.items.some(i => String(i.id) === String(item.id) || (i.title === item.title && i.image === item.image));
      if (!exists) {
        return {
          ...wl,
          subtitle: 'Updated today',
          items: [item, ...wl.items]
        };
      }
    }
    return wl;
  });

  saveWishlists(updated);
  return updated;
};

export const isItemInAnyWishlist = (itemId, itemTitle = '', itemCategory = '') => {
  const current = getStoredWishlists();
  // IMPORTANT: Exclude 'recently-viewed' - browsing or recently viewed items must NOT turn the heart red!
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
    // Only remove from actual wishlists, leave recently-viewed intact unless it explicitly matches
    if (wl.id === 'recently-viewed') {
      return wl;
    }
    return {
      ...wl,
      items: (wl.items || []).filter(i => {
        if (itemId && i.id && String(i.id) === String(itemId)) return false;
        if (itemTitle && i.title === itemTitle) {
          if (itemCategory && i.category) {
            return i.category !== itemCategory;
          }
          return false;
        }
        return true;
      })
    };
  });

  saveWishlists(updated);
  return updated;
};

export const deleteWishlist = (wishlistId) => {
  const current = getStoredWishlists();
  const updated = current.filter(wl => wl.id !== wishlistId);
  saveWishlists(updated);
  return updated;
};
