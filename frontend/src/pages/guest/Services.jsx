import { useState, useEffect } from 'react';
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { FaHeart, FaStar, FaChevronLeft, FaChevronRight, FaArrowRight, FaTimes } from 'react-icons/fa';
import styles from '../../components/styles/Services.module.css';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getStoredWishlists, addWishlist, isItemInAnyWishlist, removeItemFromWishlists } from '../../utils/wishlistStorage';
import Loader from '../../components/Loader';

export default function Services() {
  const [dynamicListings, setDynamicListings] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [wishlistName, setWishlistName] = useState('');
  const [selectedListingForWishlist, setSelectedListingForWishlist] = useState(null);
  const [savedWishlistVersion, setSavedWishlistVersion] = useState(0);

  useEffect(() => {
    const handleWishlistUpdate = () => {
      setSavedWishlistVersion(v => v + 1);
    };
    window.addEventListener('airbnb_wishlists_updated', handleWishlistUpdate);
    return () => window.removeEventListener('airbnb_wishlists_updated', handleWishlistUpdate);
  }, []);

  const handleHeartClick = (e, listing, category) => {
    e.preventDefault();
    e.stopPropagation();

    const alreadySaved = isItemInAnyWishlist(listing.id, listing.title, category);

    if (alreadySaved) {
      // Remove from wishlist directly
      removeItemFromWishlists(listing.id, listing.title, category);
      toast.success('Removed from wishlist');
    } else {
      // Open Create Wishlist modal with default suggestion matching the category
      setSelectedListingForWishlist({ ...listing, category });
      setWishlistName(category && category !== 'Featured Services' ? category : 'My Wishlist');
      setIsWishlistModalOpen(true);
    }
  };

  const closeWishlistModal = () => {
    setIsWishlistModalOpen(false);
    setSelectedListingForWishlist(null);
    setWishlistName('');
  };

  const handleCreateWishlist = () => {
    if (!wishlistName.trim()) return;

    const initialItem = selectedListingForWishlist ? {
      id: selectedListingForWishlist.id || `item-${Date.now()}`,
      title: selectedListingForWishlist.title,
      category: selectedListingForWishlist.category || 'Services',
      host: selectedListingForWishlist.host || 'Airbnb Host',
      image: selectedListingForWishlist.image,
      price: selectedListingForWishlist.price
    } : null;

    addWishlist(wishlistName.trim(), initialItem);
    toast.success(`Saved to "${wishlistName.trim()}"!`);
    closeWishlistModal();
  };

  // Fetch both dynamic listings and active admin categories
  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    setLoading(true);

    const pCategories = fetch(`${baseUrl}/listings/host-categories?type=service&all=false`)
      .then(res => res.json())
      .then(catData => {
        if (catData.success && Array.isArray(catData.data)) {
          setServiceCategories(catData.data);
        }
      })
      .catch(err => console.error('Failed to load host categories:', err));

    const pListings = fetch(`${baseUrl}/listings?status=Active`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          const servicesOnly = data.data.filter(item => {
            const t = (item.type || '').toLowerCase();
            const c = (item.category || '').toLowerCase();
            return (
              t.includes('service') || 
              ['chef', 'hairstyling', 'make-up', 'makeup', 'massage', 'personal training', 'photography', 'prepared meals', 'spa treatments', 'catering'].some(sc => c.includes(sc) || t.includes(sc))
            ) && !t.includes('experience') && !c.includes('experience');
          });
          setDynamicListings(servicesOnly);
        }
      })
      .catch(err => console.error('Failed to load dynamic listings for services:', err));

    Promise.allSettled([pCategories, pListings]).finally(() => {
      setLoading(false);
    });
  }, []);

  const fallbackServiceImage = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=720&q=80";

  // Format raw listing object for Splide slider card
  const formatListingCard = (item) => ({
    id: item.id,
    title: item.title,
    category: item.category || 'Services',
    rating: item.rating ? Number(item.rating).toFixed(2) : "4.95",
    subtitle: item.is_guest_favourite ? "Guest favourite" : (item.city || "Available now"),
    price: `₹${Number(item.price).toLocaleString('en-IN')}`,
    image: item.cover_img || (Array.isArray(item.photos) && item.photos[0]) || fallbackServiceImage
  });

  // Group dynamic services by category
  const dynamicByCategory = {};
  dynamicListings.forEach(item => {
    const rawCat = (item.category || '').trim();
    const catName = rawCat && rawCat !== 'Services' && rawCat !== 'Service' ? rawCat : 'Featured Services';
    if (!dynamicByCategory[catName]) {
      dynamicByCategory[catName] = [];
    }
    dynamicByCategory[catName].push(formatListingCard(item));
  });

  // Build rows dynamically based on admin categories & listings
  const matchedCategories = new Set();
  const displayRows = [];

  // Priority 1: Iterate over categories configured in Admin (host_categories)
  if (serviceCategories.length > 0) {
    serviceCategories.forEach(cat => {
      const catName = cat.name;
      // Match case-insensitively with grouped listings
      const matchedKey = Object.keys(dynamicByCategory).find(k => k.toLowerCase() === catName.toLowerCase());
      if (matchedKey && dynamicByCategory[matchedKey].length > 0) {
        displayRows.push({
          category: catName,
          listings: dynamicByCategory[matchedKey]
        });
        matchedCategories.add(matchedKey);
      }
    });
  }

  // Priority 2: Add any remaining categories that have services but were not in host_categories
  Object.keys(dynamicByCategory).forEach(catName => {
    if (!matchedCategories.has(catName) && dynamicByCategory[catName].length > 0) {
      displayRows.push({
        category: catName,
        listings: dynamicByCategory[catName]
      });
    }
  });

  return (
    <div className={styles['home-container']}>
      {loading ? (
        <div style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader size="large" text="Finding curated services..." variant="airbnb" />
        </div>
      ) : (
        <main className={styles['main-content']}>
          {displayRows.map((row, rowIndex) => (
            <div key={rowIndex} className={styles['category-row']}>
            <Splide 
              hasTrack={false}
              options={{
                perPage: 7,
                gap: '1.5rem',
                pagination: false,
                arrows: true,
                breakpoints: {
                  1400: { perPage: 5 },
                  1024: { perPage: 4 },
                  768: { perPage: 3 },
                  640: { perPage: 2 },
                  480: { perPage: 1 },
                }
              }}
            >
              {/* Header and Custom Arrows */}
              <div className={styles['category-header']}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 className={styles['category-title']}>
                    <NavLink to="" className="fs-6 fw-600">
                      {row.category} <FaArrowRight size={12} />
                    </NavLink>
                  </h2>
                </div>
                <div className={`${styles['arrows-container']} splide__arrows`}>
                  <button className={`splide__arrow splide__arrow--prev ${styles['custom-arrow']}`}>
                    <FaChevronLeft size={10} />
                  </button>
                  <button className={`splide__arrow splide__arrow--next ${styles['custom-arrow']}`}>
                    <FaChevronRight size={10} />
                  </button>
                </div>
              </div>

              <SplideTrack>
              {row.listings.map((listing, index) => {
                const isSaved = isItemInAnyWishlist(listing.id, listing.title, row.category);

                return (
                  <SplideSlide key={listing.id || index}>
                    <NavLink to={`/service/${listing.id || index}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className={styles['listing-card']}>
                        
                        {/* Image Container with Badges */}
                        <div className={styles['image-container']}>
                          <img 
                            src={listing.image} 
                            alt={listing.title}
                            className={styles['listing-image']}
                          />
                          
                          {/* Guest Favourite Pill */}
                          {listing.subtitle && (
                            <div className={styles['guest-favourite']}>
                              {listing.subtitle}
                            </div>
                          )}

                          {/* Heart Button */}
                          <button 
                            className={styles['heart-button']}
                            onClick={(e) => handleHeartClick(e, listing, row.category)}
                            aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                          >
                            <FaHeart className={isSaved ? styles['heart-icon-active'] : styles['heart-icon']} />
                          </button>
                        </div>

                        {/* Listing Info */}
                        <div className={styles['listing-info']}>
                          <h3 className={styles['listing-title']}>
                            {listing.title}
                          </h3>
                          <div className={styles['listing-details']}>
                            <span className={styles.price}>{listing.price}</span> 
                            <span className={styles.duration}>per service</span>
                            <span className={styles['rating-container']}>
                              <FaStar size={10} className={styles['star-icon']} />
                              {listing.rating}
                            </span>
                          </div>
                        </div>
                        
                      </div>
                    </NavLink>
                  </SplideSlide>
                );
              })}
              </SplideTrack>
            </Splide>
          </div>
        ))}
        </main>
      )}

      {/* Create Wishlist Modal */}
      {isWishlistModalOpen && (
        <div className={styles.wishlistModalOverlay} onClick={closeWishlistModal}>
          <div className={styles.wishlistModalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.wishlistModalHeader}>
              <h2 className={styles.wishlistModalTitle}>Create wishlist</h2>
              <button 
                type="button" 
                className={styles.wishlistCloseBtn} 
                onClick={closeWishlistModal}
                aria-label="Close"
              >
                <FaTimes size={15} />
              </button>
            </div>

            <div className={styles.wishlistModalBody}>
              <div className={styles.wishlistInputWrapper}>
                <div className={styles.wishlistLabel}>Name</div>
                <input 
                  type="text" 
                  className={styles.wishlistInputField}
                  value={wishlistName}
                  onChange={(e) => {
                    if (e.target.value.length <= 50) {
                      setWishlistName(e.target.value);
                    }
                  }}
                  autoFocus
                  maxLength={50}
                  placeholder="e.g. Summer Vacation, Jaipur Trips"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && wishlistName.trim()) {
                      handleCreateWishlist();
                    }
                  }}
                />
              </div>
              <div className={styles.wishlistCharCount}>
                {wishlistName.length}/50 characters
              </div>
            </div>

            <div className={styles.wishlistModalFooter}>
              <button 
                type="button" 
                className={styles.wishlistCancelBtn} 
                onClick={closeWishlistModal}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className={styles.wishlistCreateBtn} 
                disabled={!wishlistName.trim()}
                onClick={handleCreateWishlist}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
