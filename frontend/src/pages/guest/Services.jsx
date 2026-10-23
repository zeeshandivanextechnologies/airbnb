import { useState, useEffect } from 'react';
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { FaHeart, FaStar, FaChevronLeft, FaChevronRight, FaArrowRight, FaTimes } from 'react-icons/fa';
import styles from '../../components/styles/Services.module.css';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getStoredWishlists, addWishlist, isItemInAnyWishlist, removeItemFromWishlists } from '../../utils/wishlistStorage';

export default function Services() {
  const [dynamicListings, setDynamicListings] = useState([]);
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

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    fetch(`${baseUrl}/listings?type=Service&status=Active`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          // Strictly keep only Service items (exclude Stays and Experiences)
          const servicesOnly = data.data.filter(item => {
            const t = (item.type || '').toLowerCase();
            const c = (item.category || '').toLowerCase();
            return !t.includes('experience') && !c.includes('experience');
          });
          setDynamicListings(servicesOnly);
        }
      })
      .catch(err => console.error('Failed to load dynamic listings for services:', err));
  }, []);

  const photoImages = [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=720&q=80",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=720&q=80",
    "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=720&q=80",
    "https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=720&q=80",
    "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=720&q=80",
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=720&q=80",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=720&q=80",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=720&q=80"
  ];

  const laImages = [
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=720&q=80",
    "https://images.unsplash.com/photo-1528181304800-259b08848526?w=720&q=80",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=720&q=80",
    "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=720&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=720&q=80",
    "https://images.unsplash.com/photo-1516598540642-e8f40a09d939?w=720&q=80",
    "https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=720&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=720&q=80"
  ];

  const londonImages = [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=720&q=80",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=720&q=80",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=720&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=720&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=720&q=80",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=720&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=720&q=80",
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=720&q=80"
  ];

  const romeImages = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=720&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=720&q=80",
    "https://images.unsplash.com/photo-1516598540642-e8f40a09d939?w=720&q=80",
    "https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=720&q=80",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=720&q=80",
    "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=720&q=80",
    "https://images.unsplash.com/photo-1528181304800-259b08848526?w=720&q=80",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=720&q=80"
  ];

  const rowsData = [
    {
      category: "Photography",
      listings: [
        { title: "Portrait Photoshoot", rating: "4.97", subtitle: "Guest favourite", price: "₹2,000", image: photoImages[0] },
        { title: "Wedding Photography", rating: "4.85", subtitle: "", price: "₹15,000", image: photoImages[1] },
        { title: "Nature Photography Walk", rating: "5.0", subtitle: "Guest favourite", price: "₹1,500", image: photoImages[2] },
        { title: "Studio Photoshoot", rating: "4.7", subtitle: "", price: "₹3,000", image: photoImages[3] },
        { title: "Street Photography Tour", rating: "4.92", subtitle: "Guest favourite", price: "₹2,500", image: photoImages[4] },
        { title: "Fashion Shoot", rating: "4.6", subtitle: "", price: "₹5,500", image: photoImages[5] },
        { title: "Food Photography", rating: "4.88", subtitle: "Guest favourite", price: "₹4,000", image: photoImages[6] },
        { title: "Product Photography", rating: "4.75", subtitle: "", price: "₹3,500", image: photoImages[7] }
      ]
    },
    {
      category: "Services in Los Angeles",
      listings: [
        { title: "Hollywood Hills Tour", rating: "4.99", subtitle: "Guest favourite", price: "₹5,000", image: laImages[0] },
        { title: "Venice Beach Walk", rating: "4.90", subtitle: "", price: "₹2,000", image: laImages[1] },
        { title: "Santa Monica Pier", rating: "5.0", subtitle: "Guest favourite", price: "₹3,500", image: laImages[2] },
        { title: "Beverly Hills Shopping", rating: "4.75", subtitle: "", price: "₹8,500", image: laImages[3] },
        { title: "Griffith Observatory", rating: "4.82", subtitle: "Guest favourite", price: "₹1,000", image: laImages[4] },
        { title: "Downtown LA Art Tour", rating: "4.68", subtitle: "", price: "₹2,200", image: laImages[5] },
        { title: "Malibu Beach Surf", rating: "4.95", subtitle: "Guest favourite", price: "₹4,000", image: laImages[6] },
        { title: "Sunset Boulevard Drive", rating: "4.85", subtitle: "", price: "₹3,000", image: laImages[7] }
      ]
    },
    {
      category: "Services in London",
      listings: [
        { title: "Big Ben & Parliament", rating: "4.85", subtitle: "Guest favourite", price: "₹3,000", image: londonImages[0] },
        { title: "London Eye Experience", rating: "4.95", subtitle: "", price: "₹4,000", image: londonImages[1] },
        { title: "Tower Bridge Tour", rating: "4.75", subtitle: "Guest favourite", price: "₹2,500", image: londonImages[2] },
        { title: "British Museum Walk", rating: "4.6", subtitle: "", price: "₹1,500", image: londonImages[3] },
        { title: "Camden Market Food", rating: "4.88", subtitle: "Guest favourite", price: "₹2,000", image: londonImages[4] },
        { title: "Luxury Spa Day", rating: "4.7", subtitle: "", price: "₹8,000", image: londonImages[5] },
        { title: "London Park Yoga", rating: "4.92", subtitle: "Guest favourite", price: "₹1,500", image: londonImages[6] },
        { title: "Professional Photoshoot", rating: "4.65", subtitle: "", price: "₹5,000", image: londonImages[7] }
      ]
    },
    {
      category: "Services in Rome",
      listings: [
        { title: "Colosseum Tour", rating: "4.98", subtitle: "Guest favourite", price: "₹4,200", image: romeImages[0] },
        { title: "Vatican Museums", rating: "4.85", subtitle: "", price: "₹5,500", image: romeImages[1] },
        { title: "Trevi Fountain Walk", rating: "4.90", subtitle: "Guest favourite", price: "₹1,500", image: romeImages[2] },
        { title: "Pantheon Visit", rating: "4.95", subtitle: "", price: "₹2,000", image: romeImages[3] },
        { title: "Roman Forum Guide", rating: "4.75", subtitle: "Guest favourite", price: "₹3,000", image: romeImages[4] },
        { title: "Pasta Making Class", rating: "4.88", subtitle: "", price: "₹4,500", image: romeImages[5] },
        { title: "Trastevere Food Tour", rating: "4.82", subtitle: "Guest favourite", price: "₹3,800", image: romeImages[6] },
        { title: "Piazza Navona Evening", rating: "4.91", subtitle: "", price: "₹2,200", image: romeImages[7] }
      ]
    }
  ];

  // Format raw listing object for Splide slider card
  const formatListingCard = (item) => ({
    id: item.id,
    title: item.title,
    category: item.category || 'Services',
    rating: item.rating ? Number(item.rating).toFixed(2) : "4.95",
    subtitle: item.is_guest_favourite ? "Guest favourite" : (item.city || "Available now"),
    price: `₹${Number(item.price).toLocaleString('en-IN')}`,
    image: item.cover_img || (Array.isArray(item.photos) && item.photos[0]) || photoImages[0]
  });

  // Group dynamic services by category
  const dynamicByCategory = {};
  dynamicListings.forEach(item => {
    // Determine category name
    const rawCat = (item.category || '').trim();
    const catName = rawCat && rawCat !== 'Services' && rawCat !== 'Service' ? rawCat : 'Featured Services';
    if (!dynamicByCategory[catName]) {
      dynamicByCategory[catName] = [];
    }
    dynamicByCategory[catName].push(formatListingCard(item));
  });

  // Map predefined static demo rows, augmenting with any matching dynamic services
  const matchedCategories = new Set();
  const enhancedStaticRows = rowsData.map((r, rIdx) => {
    // Check if dynamic listings match this row's category
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
          // Give each demo card an independent unique ID so saving one does not affect others
          id: `demo-${rIdx}-${idx}`
        }))
      ]
    };
  });

  // Create rows for dynamic categories not present in static rows
  const newDynamicRows = Object.keys(dynamicByCategory)
    .filter(cat => !matchedCategories.has(cat))
    .map(cat => ({
      category: cat,
      listings: dynamicByCategory[cat]
    }));

  // Put newly published dynamic category rows at the top so they are immediately visible
  const displayRows = [...newDynamicRows, ...enhancedStaticRows];

  return (
    <div className={styles['home-container']}>
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
                  <SplideSlide key={index}>
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
                            type="button"
                            className={styles['heart-btn']}
                            onClick={(e) => handleHeartClick(e, listing, row.category)}
                            title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
                          >
                            <FaHeart 
                              size={24} 
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
