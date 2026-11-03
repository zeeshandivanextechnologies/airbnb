import React, { useState, useEffect } from 'react';
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { FaHeart, FaStar, FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import styles from '../../components/styles/HomeSecond.module.css';
import { NavLink } from 'react-router-dom';
import Loader from '../../components/Loader';

export default function HomeSecond() {
  const [dynamicStays, setDynamicStays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStays = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        const res = await fetch(`${baseUrl}/listings?status=Active`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          // Keep only Homes/Stays (exclude Experience and Service items)
          const staysOnly = json.data.filter(item => {
            const t = (item.type || '').toLowerCase();
            const c = (item.category || '').toLowerCase();
            return (
              !t.includes('experience') && 
              !c.includes('experience') && 
              !t.includes('service') && 
              !c.includes('service') &&
              !['chef', 'hairstyling', 'make-up', 'massage', 'personal training', 'photography', 'prepared meals', 'spa treatments', 'catering'].some(sc => c.includes(sc) || t.includes(sc))
            );
          });
          setDynamicStays(staysOnly);
        }
      } catch (e) {
        console.warn('Failed to fetch stays in HomeSecond:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchStays();
  }, []);

  const defaultStayImage = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=720&q=80";

  const formatStayCard = (item) => {
    const revCount = Number(item.reviews_count) || 0;
    const numRating = Number(item.rating) || 0;
    return {
      id: item.id,
      title: item.title,
      type: 'Stay',
      rating: revCount > 0 && numRating > 0 ? numRating.toFixed(2) : (numRating > 0 ? numRating.toFixed(2) : "4.95"),
      reviewsCount: revCount,
      subtitle: item.is_guest_favourite ? "Guest favourite" : (item.city || item.category || "Available now"),
      price: item.price ? `₹${Number(item.price).toLocaleString('en-IN')}` : "₹2,500",
      duration: item.duration || "for 2 nights",
      image: item.cover_img || (Array.isArray(item.photos) && item.photos[0]) || defaultStayImage
    };
  };

  const formattedStays = dynamicStays.map(formatStayCard);

  // Group stays dynamically by city/region
  const staysByCity = {};
  formattedStays.forEach(item => {
    const rawCity = item.subtitle ? item.subtitle.split(',')[0].trim() : 'Popular';
    const cityKey = rawCity !== 'Guest favourite' ? rawCity : 'Top Picks';
    if (!staysByCity[cityKey]) {
      staysByCity[cityKey] = [];
    }
    staysByCity[cityKey].push(item);
  });

  // Construct dynamic category rows
  const rowsData = [];

  // 1. Newly Added Homes & Stays row
  if (formattedStays.length > 0) {
    rowsData.push({
      category: "Newly Added Homes & Stays",
      listings: formattedStays
    });
  }

  // 2. City-based rows from real database items
  Object.keys(staysByCity).forEach(cityName => {
    if (staysByCity[cityName].length > 0 && cityName !== 'Top Picks') {
      rowsData.push({
        category: `Popular homes in ${cityName}`,
        listings: staysByCity[cityName]
      });
    }
  });

  // 3. Trending/Guest favourite row if multiple stays exist
  const favStays = formattedStays.filter(s => s.subtitle === 'Guest favourite');
  if (favStays.length > 0) {
    rowsData.push({
      category: "Guest favourites across India",
      listings: favStays
    });
  }

  return (
    <div className={styles['home-container']}>
      {loading ? (
        <div style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader size="large" text="Loading homes & stays..." variant="airbnb" />
        </div>
      ) : (
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
                const targetPath = `/listing/${listing.id || index + 1}`;

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
                            onError={(e) => { e.target.src = defaultStayImage; }}
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
                            <span className={styles.duration}>
                              {listing.duration ? (listing.duration.startsWith('for') ? listing.duration : `/${listing.duration}`) : 'for 2 nights'}
                            </span>
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
