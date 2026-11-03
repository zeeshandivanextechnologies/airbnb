import React, { useState, useEffect } from 'react';
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { FaHeart, FaStar, FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import styles from '../../components/styles/Home.module.css';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Loader from '../../components/Loader';

export default function Home() {
  const { t } = useTranslation();
  const [allListings, setAllListings] = useState([]);
  const [destinationsData, setDestinationsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      
      try {
        setLoading(true);

        // 1. Fetch Dynamic Destinations from Admin MasterData
        try {
          const destRes = await fetch(`${baseUrl}/listings/home-destinations?status=active`);
          const destJson = await destRes.json();
          if (destJson.success && Array.isArray(destJson.data) && destJson.data.length > 0) {
            setDestinationsData(destJson.data);
          } else {
            setDestinationsData(fallbackDestinations);
          }
        } catch (e) {
          setDestinationsData(fallbackDestinations);
        }

        // 2. Fetch all Active listings from Backend
        const res = await fetch(`${baseUrl}/listings?status=Active`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setAllListings(json.data);
        }
      } catch (err) {
        console.warn('Failed to load homepage data from backend:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const fallbackDestinations = [
    { country: "Maldives", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=720&q=80", title: "Prime beach spot" },
    { country: "Switzerland", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=720&q=80", title: "Mountain retreat" },
    { country: "Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=720&q=80", title: "Cultural hub" },
    { country: "Italy", image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=720&q=80", title: "Historic getaway" },
    { country: "Thailand", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=720&q=80", title: "Tropical paradise" },
    { country: "France", image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=720&q=80", title: "Romantic escape" },
    { country: "Greece", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=720&q=80", title: "Island adventure" },
    { country: "Australia", image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=720&q=80", title: "Coastal charm" },
    { country: "Bali", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=720&q=80", title: "Lush greenery" },
    { country: "Dubai", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=720&q=80", title: "Urban luxury" },
    { country: "Spain", image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=720&q=80", title: "Vibrant nightlife" },
    { country: "New Zealand", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=720&q=80", title: "Nature's best" }
  ];

  const defaultCoverImage = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=720&q=80";

  // Format raw listing object for home card display
  const formatItem = (item) => {
    const revCount = Number(item.reviews_count) || 0;
    const numRating = Number(item.rating) || 0;
    const t = (item.type || '').toLowerCase();
    const isExp = t.includes('experience');
    const isSrv = t.includes('service');
    const itemType = isExp ? 'experience' : isSrv ? 'service' : 'stay';

    return {
      id: item.id,
      title: item.title,
      itemType: itemType,
      type: item.type || 'Stay',
      rating: revCount > 0 && numRating > 0 ? numRating.toFixed(2) : (numRating > 0 ? numRating.toFixed(2) : "4.95"),
      reviewsCount: revCount,
      subtitle: item.is_guest_favourite ? "Guest favourite" : (item.city || item.category || "Available now"),
      price: item.price ? `₹${Number(item.price).toLocaleString('en-IN')}` : "₹2,500",
      duration: item.duration || (itemType === 'experience' ? "guest" : itemType === 'service' ? "service" : "night"),
      image: item.cover_img || (Array.isArray(item.photos) && item.photos[0]) || defaultCoverImage
    };
  };

  // Group listings dynamically
  const stayItems = allListings
    .filter(i => {
      const t = (i.type || '').toLowerCase();
      const c = (i.category || '').toLowerCase();
      return !t.includes('experience') && !c.includes('experience') && !t.includes('service') && !c.includes('service');
    })
    .map(formatItem);

  const experienceItems = allListings
    .filter(i => {
      const t = (i.type || '').toLowerCase();
      const c = (i.category || '').toLowerCase();
      return t.includes('experience') || c.includes('experience');
    })
    .map(formatItem);

  const serviceItems = allListings
    .filter(i => {
      const t = (i.type || '').toLowerCase();
      const c = (i.category || '').toLowerCase();
      return (t.includes('service') || ['chef', 'hairstyling', 'make-up', 'massage', 'personal training', 'photography', 'prepared meals', 'spa treatments', 'catering'].some(sc => c.includes(sc) || t.includes(sc))) && !t.includes('experience');
    })
    .map(formatItem);

  // Group stays by city/location dynamically
  const staysByCity = {};
  stayItems.forEach(item => {
    const rawCity = item.subtitle ? item.subtitle.split(',')[0].trim() : 'Popular';
    const cityKey = rawCity !== 'Guest favourite' ? rawCity : 'Top Picks';
    if (!staysByCity[cityKey]) {
      staysByCity[cityKey] = [];
    }
    staysByCity[cityKey].push(item);
  });

  // Construct dynamic rows
  const rowsData = [];

  // 1. Newly Added Homes & Stays
  if (stayItems.length > 0) {
    rowsData.push({ category: "Newly Added Homes & Stays", listings: stayItems });
  }

  // 2. City-based stay rows from real database items
  Object.keys(staysByCity).forEach(cityName => {
    if (staysByCity[cityName].length > 0 && cityName !== 'Top Picks') {
      rowsData.push({
        category: `Popular places in ${cityName}`,
        listings: staysByCity[cityName]
      });
    }
  });

  // 3. Popular Experiences
  if (experienceItems.length > 0) {
    rowsData.push({ category: "Popular Experiences", listings: experienceItems });
  }

  // 4. Featured Guest Services
  if (serviceItems.length > 0) {
    rowsData.push({ category: "Featured Guest Services", listings: serviceItems });
  }

  // 5. Fallback general stays if specific rows are few
  if (stayItems.length > 4 && rowsData.length < 3) {
    rowsData.push({ category: "Trending Homes across India", listings: stayItems });
  }

  return (
    <div className={styles['home-container']}>
      {loading ? (
        <div style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader size="large" text="Discovering top places & experiences..." variant="airbnb" />
        </div>
      ) : (
        <main className={styles['main-content']}>
          {/* Destinations for you Section (Admin MasterData Dynamic) */}
        {destinationsData.length > 0 && (
          <div className={styles['category-row']} style={{ marginBottom: '32px' }}>
            <Splide 
              hasTrack={false}
              options={{
                perPage: 8,
                gap: '1rem',
                pagination: false,
                arrows: true,
                breakpoints: {
                  1400: { perPage: 8 },
                  1024: { perPage: 6 },
                  768: { perPage: 4 },
                  640: { perPage: 3 },
                  480: { perPage: 2 },
                }
              }}
            >
              <div className={styles['category-header']}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 className={styles['category-title']}>
                    <span className="fs-6 fw-600">Destinations for you</span>
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
                {destinationsData.map((dest, index) => (
                  <SplideSlide key={dest.id || index}>
                    <NavLink to={`/search/${(dest.country || '').toLowerCase()}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                      <div style={{ cursor: 'pointer' }}>
                        <div style={{ 
                          width: '100%', 
                          aspectRatio: '1', 
                          borderRadius: '12px', 
                          overflow: 'hidden',
                          marginBottom: '8px'
                        }}>
                          <img 
                            src={dest.image} 
                            alt={dest.country} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            onError={(e) => { e.target.src = defaultCoverImage; }}
                          />
                        </div>
                        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#222', margin: '0' }}>{dest.country}</h3>
                        <p style={{ fontSize: '13px', color: '#717171', margin: '0', textTransform: 'capitalize' }}>{dest.title}</p>
                      </div>
                    </NavLink>
                  </SplideSlide>
                ))}
              </SplideTrack>
            </Splide>
          </div>
        )}

        {/* Dynamic Category Sliders */}
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
                  const targetPath = listing.itemType === 'experience'
                    ? `/experience/${listing.id || index + 1}`
                    : listing.itemType === 'service'
                    ? `/service/${listing.id || index + 1}`
                    : `/listing/${listing.id || index + 1}`;

                  return (
                    <SplideSlide key={listing.id || index}>
                      <NavLink to={targetPath} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <div className={styles['listing-card']}>
                          
                          {/* Image Container with Badges */}
                          <div className={styles['image-container']}>
                            <img 
                              src={listing.image} 
                              alt={listing.title}
                              className={styles['listing-image']}
                              onError={(e) => { e.target.src = defaultCoverImage; }}
                            />
                            
                            {/* Guest Favourite Pill */}
                            {listing.subtitle && (
                              <div className={styles['guest-favourite']}>
                                {listing.subtitle}
                              </div>
                            )}
                            
                            {/* Heart Button */}
                            <div className={styles['heart-btn']}>
                              <FaHeart size={24} className={styles['heart-icon']} />
                            </div>
                          </div>
                          
                          {/* Listing Details */}
                          <div className={styles['listing-info']}>
                            <h3 className={styles['listing-title']}>
                              {listing.title}
                            </h3>
                            <div className={styles['listing-details']}>
                              <span className={styles.price}>{listing.price}</span> 
                              {listing.duration && (
                                <span className={styles.duration}>
                                  {listing.duration.startsWith('for') ? listing.duration : `/${listing.duration}`}
                                </span>
                              )}
                              {listing.rating && (
                                <span className={styles['rating-container']}>
                                  <FaStar size={10} className={styles['star-icon']} />
                                  {listing.rating}
                                </span>
                              )}
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
    </div>
  );
}
