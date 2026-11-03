import React, { useState, useEffect } from 'react';
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { FaHeart, FaStar, FaChevronLeft, FaChevronRight, FaArrowRight, FaTimes } from 'react-icons/fa';
import styles from '../../components/styles/Experiences.module.css';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  getStoredWishlists, 
  addWishlist, 
  isItemInAnyWishlist, 
  removeItemFromWishlists 
} from '../../utils/wishlistStorage';
import Loader from '../../components/Loader';

export default function Experiences() {
  const [dynamicExperiences, setDynamicExperiences] = useState([]);
  const [experienceCategories, setExperienceCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Wishlist modal state
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
      removeItemFromWishlists(listing.id, listing.title, category);
      toast.success('Removed from wishlist');
    } else {
      setSelectedListingForWishlist({ ...listing, category });
      setWishlistName(category && category !== 'Featured Experiences' ? category : 'My Wishlist');
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
      category: selectedListingForWishlist.category || 'Experiences',
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
    const fetchExperiencesData = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

        // 1. Fetch active experience categories managed in Admin MasterData
        const catRes = await fetch(`${baseUrl}/listings/host-categories?type=experience&all=false`);
        const catJson = await catRes.json();
        if (catJson.success && Array.isArray(catJson.data)) {
          setExperienceCategories(catJson.data);
        }

        // 2. Fetch active listings
        const res = await fetch(`${baseUrl}/listings?status=Active`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          // Strictly keep only Experience items
          const expKeywords = [
            'experience', 'art and design', 'fitness and wellness', 'food and drink', 
            'history and culture', 'nature and outdoors', 'music and entertainment', 
            'sports and active', 'popular experiences in goa', 'happening today in jaipur',
            'weekend getaways near gurgaon', 'trending across india', 'outdoor adventures'
          ];
          const experiencesOnly = json.data.filter(item => {
            const t = (item.type || '').toLowerCase();
            const c = (item.category || '').toLowerCase();
            return (
              t.includes('experience') || 
              expKeywords.some(kw => c.includes(kw) || t.includes(kw))
            );
          });
          setDynamicExperiences(experiencesOnly);
        }
      } catch (err) {
        console.warn('Failed to load experiences from backend:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiencesData();
  }, []);

  const fallbackExpImage = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=720&q=80";

  // Helper to format live experience object for card display
  const formatExpCard = (item) => {
    const revCount = Number(item.reviews_count) || 0;
    const numRating = Number(item.rating) || 4.95;

    // Determine badge display: prioritize direct item.time (e.g., '8am', '4pm', 'Fri - 11am'),
    // then fallback to business_hours slot, then realistic day/time badge
    let badgeText = item.time && item.time !== 'Original' ? String(item.time).trim() : '';
    if (!badgeText && Array.isArray(item.business_hours) && item.business_hours.length > 0) {
      const bh = item.business_hours[0];
      const rawTime = bh.from || bh.open || bh.time;
      if (rawTime) {
        const cleanTime = String(rawTime).toLowerCase().replace(':00', '').replace(/\s+/g, '');
        if (bh.days && bh.days.length > 0) {
          badgeText = `${bh.days[0].slice(0, 3)} - ${cleanTime}`;
        } else if (cleanTime) {
          badgeText = cleanTime;
        }
      }
    }
    if (!badgeText) {
      const defaultBadges = ["Fri - 11am", "Sat - 1pm", "4pm", "8am", "Sun - 5pm", "9am", "6pm"];
      const hash = typeof item.id === 'number' ? item.id : (item.title ? item.title.length : 0);
      badgeText = defaultBadges[hash % defaultBadges.length];
    }

    return {
      id: item.id,
      title: item.title,
      category: item.category || 'Experiences',
      host: item.host_name || 'Airbnb Host',
      rating: revCount > 0 ? numRating.toFixed(2) : (item.rating ? Number(item.rating).toFixed(2) : "4.95"),
      time: badgeText,
      price: item.price ? Number(item.price).toLocaleString('en-IN') : "1,500",
      image: item.cover_img || (Array.isArray(item.photos) && item.photos[0]) || fallbackExpImage
    };
  };

  // Group dynamic experiences by category
  const dynamicByCategory = {};
  dynamicExperiences.forEach(item => {
    const rawCat = (item.category || '').trim();
    const catName = rawCat && rawCat !== 'Experiences' && rawCat !== 'Experience' ? rawCat : 'Featured Experiences';
    if (!dynamicByCategory[catName]) {
      dynamicByCategory[catName] = [];
    }
    dynamicByCategory[catName].push(formatExpCard(item));
  });

  // Build rows dynamically based on admin categories & listings
  const matchedCategories = new Set();
  const displayRows = [];

  // Priority 1: Iterate over categories configured in Admin (host_categories)
  if (experienceCategories.length > 0) {
    experienceCategories.forEach(cat => {
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

  // Priority 2: Add any remaining categories that have experiences
  Object.keys(dynamicByCategory).forEach(catName => {
    if (!matchedCategories.has(catName) && dynamicByCategory[catName].length > 0) {
      displayRows.push({
        category: catName,
        listings: dynamicByCategory[catName]
      });
    }
  });

  return (
    <div className={styles['experiences-container']}>
      {loading ? (
        <div style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader size="large" text="Exploring unforgettable experiences..." variant="airbnb" />
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
              {/* Category Header */}
              <div className={styles['category-header']}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

              {/* Slider Track */}
              <SplideTrack>
                {row.listings.map((listing, index) => {
                  const isSaved = isItemInAnyWishlist(listing.id, listing.title, row.category);

                  return (
                    <SplideSlide key={listing.id || index}>
                      <NavLink 
                        to={`/experience/${listing.id || index}`} 
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <div className={styles['listing-card']}>
                          {/* Image Box */}
                          <div className={styles['image-container']}>
                            <img 
                              src={listing.image} 
                              alt={listing.title}
                              className={styles['listing-image']}
                              onError={(e) => {
                                e.target.src = fallbackExpImage;
                              }}
                            />
                            
                            {/* Time / Location Pill */}
                            {listing.time && (
                              <div className={styles['time-pill']}>
                                {listing.time}
                              </div>
                            )}
                            
                            {/* Heart Button for Wishlist */}
                            <button
                              type="button"
                              className={`${styles['heart-btn']} ${isSaved ? styles['heart-btn-active'] : ''}`}
                              onClick={(e) => handleHeartClick(e, listing, row.category)}
                              aria-label="Save to wishlist"
                              title={isSaved ? 'Saved to wishlist' : 'Save to wishlist'}
                            >
                              <FaHeart 
                                size={22} 
                                className={`${styles['heart-icon']} ${isSaved ? styles['heart-icon-active'] : ''}`} 
                              />
                            </button>
                          </div>
                          
                          {/* Listing Details */}
                          <div className={styles['listing-info']}>
                            <h3 className={styles['listing-title']}>
                              {listing.title}
                            </h3>
                            <div className={styles['listing-details']}>
                              <div className={styles.price}>
                                From <span>₹{listing.price}</span> / guest
                              </div>
                              <div className={styles['rating-container']}>
                                <span style={{ margin: '0 4px' }}>•</span>
                                <FaStar size={10} className={styles['star-icon']} />
                                {listing.rating}
                              </div>
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

      {/* Wishlist Modal */}
      {isWishlistModalOpen && (
        <div className={styles.wishlistModalOverlay} onClick={closeWishlistModal}>
          <div className={styles.wishlistModalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.wishlistModalHeader}>
              <h3 className={styles.wishlistModalTitle}>Name this wishlist</h3>
              <button 
                type="button" 
                className={styles.wishlistCloseBtn} 
                onClick={closeWishlistModal}
                aria-label="Close"
              >
                <FaTimes size={16} />
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
                  placeholder="e.g. Jaipur Food Walk, Goa Adventures"
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
