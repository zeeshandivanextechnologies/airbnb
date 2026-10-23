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

export default function Experiences() {
  const [dynamicExperiences, setDynamicExperiences] = useState([]);
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

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        const res = await fetch(`${baseUrl}/listings?type=Experience&status=Active`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          // Strictly keep only Experience items
          const experiencesOnly = json.data.filter(item => {
            const t = (item.type || '').toLowerCase();
            const c = (item.category || '').toLowerCase();
            return t.includes('experience') || c.includes('experience');
          });
          setDynamicExperiences(experiencesOnly);
        }
      } catch (err) {
        console.warn('Failed to load experiences from backend:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  const images = [
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=720&q=80", // travel/adventure
    "https://images.unsplash.com/photo-1528181304800-259b08848526?w=720&q=80", // cooking
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=720&q=80", // festival
    "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=720&q=80", // surfing
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=720&q=80", // beach
    "https://images.unsplash.com/photo-1516598540642-e8f40a09d939?w=720&q=80", // city tour
    "https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=720&q=80", // yoga
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=720&q=80"  // food/dinner
  ];

  const defaultRowsData = [
    {
      category: "Happening today in Jaipur",
      listings: [
        { title: "Old City Street Food Walk", rating: "4.97", time: "4pm", price: "2,500", image: images[1] },
        { title: "Cruise Jaipur's Forts & Bazaars", rating: "5.0", time: "6pm", price: "3,600", image: images[5] },
        { title: "Create traditional handblock fabric", rating: "4.99", time: "2pm", price: "2,600", image: images[4] },
        { title: "Hands On Blue Pottery", rating: "4.97", time: "11am", price: "3,900", image: images[2] },
        { title: "Jaipur Home Cooking", rating: "4.98", time: "4pm", price: "3,000", image: images[1] },
        { title: "Evening Yoga Retreat", rating: "4.9", time: "5:30pm", price: "1,500", image: images[6] },
        { title: "Sunrise Hot Air Balloon", rating: "4.95", time: "6am", price: "9,000", image: images[0] },
        { title: "Local Market Tasting", rating: "4.8", time: "1pm", price: "2,000", image: images[7] }
      ]
    },
    {
      category: "Popular experiences in Goa",
      listings: [
        { title: "Surfing Lessons for Beginners", rating: "4.98", time: "8am", price: "4,000", image: images[3] },
        { title: "Seafood Cooking Masterclass", rating: "4.9", time: "12pm", price: "3,500", image: images[1] },
        { title: "Old Goa Heritage Walk", rating: "4.85", time: "9am", price: "1,200", image: images[5] },
        { title: "Sunset Cruise & Dinner", rating: "4.92", time: "5pm", price: "4,500", image: images[0] },
        { title: "Beachside Yoga Flow", rating: "4.97", time: "7am", price: "800", image: images[6] },
        { title: "Local Feni Tasting", rating: "4.88", time: "4pm", price: "1,500", image: images[7] },
        { title: "Music & Dance Festival", rating: "4.95", time: "8pm", price: "2,500", image: images[2] },
        { title: "Pottery by the Sea", rating: "4.8", time: "3pm", price: "2,000", image: images[4] }
      ]
    },
    {
      category: "Weekend getaways near Gurgaon",
      listings: [
        { title: "Organic Farm Cooking", rating: "4.92", time: "Fri - 11am", price: "2,800", image: images[1] },
        { title: "Pottery Workshop", rating: "4.85", time: "Sat - 1pm", price: "1,500", image: images[4] },
        { title: "Sunset Yoga Retreat", rating: "4.95", time: "Sun - 5pm", price: "1,200", image: images[6] },
        { title: "Aravalli Hills Nature Walk", rating: "4.8", time: "Sat - 7am", price: "1,000", image: images[5] },
        { title: "Hot Air Balloon Safari", rating: "4.98", time: "Sun - 6am", price: "12,000", image: images[0] },
        { title: "Street Food Tour", rating: "4.9", time: "Sat - 6pm", price: "1,800", image: images[2] },
        { title: "Wine Tasting Masterclass", rating: "4.88", time: "Thu - 4pm", price: "3,000", image: images[7] },
        { title: "Lake Kayaking & Surfing", rating: "4.75", time: "Fri - 9am", price: "2,200", image: images[3] }
      ]
    },
    {
      category: "Trending across India",
      listings: [
        { title: "Kerala Backwaters Tour", rating: "4.98", time: "Fri - 9am", price: "5,000", image: images[5] },
        { title: "Traditional Cooking in Kerala", rating: "4.95", time: "11am", price: "3,200", image: images[1] },
        { title: "Goa Music Festival", rating: "4.92", time: "7pm", price: "4,000", image: images[2] },
        { title: "Himalayan Yoga Retreat", rating: "4.99", time: "Sun - 6am", price: "8,500", image: images[6] },
        { title: "Rajasthan Hot Air Balloon", rating: "4.94", time: "Sat - 6am", price: "10,500", image: images[0] },
        { title: "Sula Vineyards Tour", rating: "4.85", time: "Sat - 2pm", price: "2,500", image: images[7] },
        { title: "Pondicherry Surfing", rating: "4.9", time: "Fri - 7am", price: "3,500", image: images[3] },
        { title: "Dharavi Pottery Making", rating: "4.88", time: "3pm", price: "1,200", image: images[4] }
      ]
    }
  ];

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
      image: item.cover_img || (Array.isArray(item.photos) && item.photos[0]) || images[0]
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

  // Map predefined rows, augmenting with any matching dynamic experiences
  const matchedCategories = new Set();
  const enhancedStaticRows = defaultRowsData.map((r, rIdx) => {
    const matchingDynamic = dynamicByCategory[r.category] || [];
    if (matchingDynamic.length > 0) {
      matchedCategories.add(r.category);
    }
    return {
      category: r.category,
      listings: [
        ...matchingDynamic,
        ...r.listings.map((item, idx) => ({
          ...item,
          category: r.category,
          id: `demo-exp-${rIdx}-${idx}`
        }))
      ]
    };
  });

  // Rows for newly created categories from admin or host
  const newDynamicRows = Object.keys(dynamicByCategory)
    .filter(cat => !matchedCategories.has(cat))
    .map(cat => ({
      category: cat,
      listings: dynamicByCategory[cat]
    }));

  // Combined rows: newly created categories first, then the augmented existing rows
  const rowsData = [...newDynamicRows, ...enhancedStaticRows];

  return (
    <div className={styles['experiences-container']}>
      <main className={styles['main-content']}>
        {rowsData.map((row, rowIndex) => (
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

              <SplideTrack>
                {row.listings.map((listing, index) => {
                  const targetId = listing.id || index;
                  const isSaved = isItemInAnyWishlist(listing.id, listing.title, row.category);

                  return (
                    <SplideSlide key={listing.id || index}>
                      <NavLink 
                        to={`/experience/${targetId}`} 
                        
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <div className={styles['listing-card']}>
                          {/* Image Container with Badges */}
                          <div className={styles['image-container']}>
                            <img 
                              src={listing.image} 
                              alt={listing.title}
                              className={styles['listing-image']}
                              onError={(e) => {
                                e.target.src = images[0];
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
