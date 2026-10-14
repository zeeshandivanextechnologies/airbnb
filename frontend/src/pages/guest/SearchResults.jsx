import React from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { FaHeart, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from '../../components/styles/SearchResults.module.css';
import homeStyles from '../../components/styles/Home.module.css';

export default function SearchResults() {
  const { location } = useParams();

  const hotels = [
    {
      id: 1,
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=720&q=80",
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=720&q=80",
        "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=720&q=80"
      ],
      title: `Flat in ${location ? location.charAt(0).toUpperCase() + location.slice(1) : 'Dubai'}`,
      subtitle: "Luxury 3BD Open Marina & Swimming Pool View",
      details: "3 bedrooms · 3 king beds · 3 bathrooms",
      dates: "27 Feb – 4 Mar",
      price: "₹1,30,785",
      duration: "for 5 nights",
      rating: "5.0 (4)",
      badge: "Superhost",
      freeCancellation: true
    },
    {
      id: 2,
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=720&q=80",
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=720&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=720&q=80"
      ],
      title: `Flat in ${location ? location.charAt(0).toUpperCase() + location.slice(1) : 'Dubai'}`,
      subtitle: "Apartment in Downtown /Dormitory Room",
      details: "2 bedrooms · 4 bunk beds · 2.5 bathrooms",
      dates: "3–8 Oct",
      price: "₹11,836",
      originalPrice: "₹17,022",
      duration: "for 5 nights",
      rating: "4.71 (24)",
      badge: "",
      freeCancellation: false
    },
    {
      id: 3,
      images: [
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=720&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=720&q=80",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=720&q=80"
      ],
      title: `Villa in ${location ? location.charAt(0).toUpperCase() + location.slice(1) : 'Dubai'}`,
      subtitle: "Stunning Beachfront Villa with Private Pool",
      details: "4 bedrooms · 4 beds · 4 bathrooms",
      dates: "10-15 Nov",
      price: "₹85,000",
      duration: "for 5 nights",
      rating: "4.95 (128)",
      badge: "Guest favourite",
      freeCancellation: true
    },
    {
      id: 4,
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=720&q=80",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=720&q=80",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=720&q=80"
      ],
      title: `Apartment in ${location ? location.charAt(0).toUpperCase() + location.slice(1) : 'Dubai'}`,
      subtitle: "Cozy Studio near City Center",
      details: "1 bedroom · 1 bed · 1 bathroom",
      dates: "12-16 Dec",
      price: "₹15,000",
      duration: "for 4 nights",
      rating: "4.8 (65)",
      badge: "",
      freeCancellation: true
    },
    {
      id: 5,
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=720&q=80",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=720&q=80",
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=720&q=80"
      ],
      title: `Condo in ${location ? location.charAt(0).toUpperCase() + location.slice(1) : 'Dubai'}`,
      subtitle: "Modern Condo with Skyline Views",
      details: "2 bedrooms · 2 beds · 2 bathrooms",
      dates: "5-10 Jan",
      price: "₹28,500",
      duration: "for 5 nights",
      rating: "4.92 (40)",
      badge: "Superhost",
      freeCancellation: true
    },
    {
      id: 6,
      images: [
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=720&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=720&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=720&q=80"
      ],
      title: `Loft in ${location ? location.charAt(0).toUpperCase() + location.slice(1) : 'Dubai'}`,
      subtitle: "Spacious Industrial Loft",
      details: "1 bedroom · 2 beds · 1.5 bathrooms",
      dates: "15-20 Feb",
      price: "₹22,000",
      duration: "for 5 nights",
      rating: "4.88 (92)",
      badge: "Guest favourite",
      freeCancellation: false
    }
  ];

  return (
    <div className={homeStyles['home-container']}>
      <main className={homeStyles['main-content']}>
        <div className="container-fluid p-0">

      
      <div className="row">
        {/* Left side: Hotels list */}
        <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="fs-5 fw-bold m-0">Over 1,000 homes in {location ? location.charAt(0).toUpperCase() + location.slice(1) : 'this area'}</h1>
        <div className={styles.priceToggleBadge}>
           <span style={{color: '#ff385c'}}>🏷️</span> Prices include all fees
        </div>
      </div>

          <div className="row">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="col-lg-6 col-md-6 col-sm-12 mb-3">
                <NavLink to={`/listing/${hotel.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div className={styles.hotelCard}>
                  <div className={styles.imageContainer}>
                    <Splide
                      hasTrack={false}
                      options={{
                        type: 'loop',
                        perPage: 1,
                        pagination: true,
                        arrows: true,
                        drag: true,
                      }}
                    >
                      <SplideTrack>
                        {hotel.images.map((img, idx) => (
                          <SplideSlide key={idx}>
                            <img src={img} alt={`${hotel.title} - ${idx}`} className={styles.hotelImage} />
                          </SplideSlide>
                        ))}
                      </SplideTrack>
                      
                      <div className="splide__arrows">
                        <button className={`splide__arrow splide__arrow--prev ${styles.customArrow}`}>
                          <FaChevronLeft size={10} />
                        </button>
                        <button className={`splide__arrow splide__arrow--next ${styles.customArrow}`}>
                          <FaChevronRight size={10} />
                        </button>
                      </div>
                    </Splide>

                    {hotel.badge && (
                      <span className={styles.badge}>{hotel.badge}</span>
                    )}
                    <button className={styles.heartBtn}>
                      <FaHeart />
                    </button>
                  </div>
                  
                  <div className={styles.cardBody}>
                    <div className="d-flex justify-content-between align-items-start">
                      <h3 className={styles.title}>{hotel.title}</h3>
                      <div className={styles.rating}>
                        <FaStar className={styles.starIcon} /> 
                        <span>{hotel.rating}</span>
                      </div>
                    </div>
                    
                    <p className={styles.subtitle}>{hotel.subtitle}</p>
                    <p className={styles.details}>{hotel.details}</p>
                    <p className={styles.dates}>{hotel.dates}</p>
                    
                    <div className="">
                       {hotel.originalPrice && (
                         <span className={styles.originalPrice}>{hotel.originalPrice}</span>
                       )}
                       <span className={styles.price}>{hotel.price}</span>
                       <span className={styles.duration}> {hotel.duration}</span>
                    </div>
                    
                    {hotel.freeCancellation && (
                      <div className={styles.cancellation}>Free cancellation</div>
                    )}
                  </div>
                </div>
                </NavLink>
              </div>
            ))}
          </div>
        </div>
        
        <div className="col-lg-6 col-md-12 col-sm-12">
          <div className={styles.mapContainer}>
             <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115408.09796792404!2d55.2014163014184!3d25.076280459744153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sin!4v1709400000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0, borderRadius: '12px' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
             </iframe>
          </div>
        </div>
      </div>
        </div>
      </main>
    </div>
  );
}
