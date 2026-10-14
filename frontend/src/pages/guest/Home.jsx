import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { FaHeart, FaStar, FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import styles from '../../components/styles/Home.module.css';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const images = [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=720&q=80",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=720&q=80",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=720&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=720&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=720&q=80",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=720&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=720&q=80",
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=720&q=80"
  ];

  const destinationsData = [
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

  const baseListings1 = [
    { title: "Villa in Anjuna", rating: "4.97", subtitle: "Guest favourite", price: "₹32,000", image: images[0] },
    { title: "Luxury Stay in Baga", rating: "4.85", subtitle: "", price: "₹15,000", image: images[1] },
    { title: "Poolside Mansion", rating: "5.0", subtitle: "Guest favourite", price: "₹45,000", image: images[2] },
    { title: "Cozy Cottage Goa", rating: "4.7", subtitle: "", price: "₹8,000", image: images[3] },
    { title: "Beachfront Villa", rating: "4.92", subtitle: "Guest favourite", price: "₹28,000", image: images[4] },
    { title: "Modern Apartment", rating: "4.6", subtitle: "", price: "₹6,500", image: images[5] },
    { title: "Hilltop Retreat", rating: "4.88", subtitle: "Guest favourite", price: "₹22,000", image: images[6] },
    { title: "Seaview Studio", rating: "4.75", subtitle: "", price: "₹9,000", image: images[7] }
  ];

  const baseListings2 = [
    { title: "Lakeview Palace", rating: "4.99", subtitle: "Guest favourite", price: "₹55,000", image: images[7] },
    { title: "Heritage Haveli", rating: "4.90", subtitle: "", price: "₹12,000", image: images[6] },
    { title: "Royal Suite", rating: "5.0", subtitle: "Guest favourite", price: "₹85,000", image: images[5] },
    { title: "Udaipur Boutique", rating: "4.75", subtitle: "", price: "₹9,500", image: images[4] },
    { title: "Old City Home", rating: "4.82", subtitle: "Guest favourite", price: "₹14,000", image: images[3] },
    { title: "Sunset Terrace", rating: "4.68", subtitle: "", price: "₹7,200", image: images[2] },
    { title: "Luxury Villa", rating: "4.95", subtitle: "Guest favourite", price: "₹30,000", image: images[1] },
    { title: "Lakeside Resort", rating: "4.85", subtitle: "", price: "₹25,000", image: images[0] }
  ];

  const baseListings3 = [
    { title: "DLF Cyber City Apt", rating: "4.85", subtitle: "Guest favourite", price: "₹6,000", image: images[3] },
    { title: "Luxury Penthouse", rating: "4.95", subtitle: "", price: "₹18,000", image: images[5] },
    { title: "Golf Course Studio", rating: "4.75", subtitle: "Guest favourite", price: "₹4,500", image: images[1] },
    { title: "Modern Condo", rating: "4.6", subtitle: "", price: "₹5,500", image: images[7] },
    { title: "Premium Suite", rating: "4.88", subtitle: "Guest favourite", price: "₹9,000", image: images[0] },
    { title: "Business Stay", rating: "4.7", subtitle: "", price: "₹3,800", image: images[2] },
    { title: "Spacious Villa", rating: "4.92", subtitle: "Guest favourite", price: "₹24,000", image: images[4] },
    { title: "Cozy Room", rating: "4.65", subtitle: "", price: "₹2,500", image: images[6] }
  ];

  const baseListings4 = [
    { title: "Himalayan Cabin", rating: "4.98", subtitle: "Guest favourite", price: "₹12,000", image: images[2] },
    { title: "Forest Retreat", rating: "4.85", subtitle: "", price: "₹8,500", image: images[4] },
    { title: "Desert Camp", rating: "4.90", subtitle: "Guest favourite", price: "₹15,000", image: images[6] },
    { title: "Treehouse Stay", rating: "4.95", subtitle: "", price: "₹11,000", image: images[0] },
    { title: "Riverside Camp", rating: "4.75", subtitle: "Guest favourite", price: "₹5,000", image: images[1] },
    { title: "Munnar Tea Estate", rating: "4.88", subtitle: "", price: "₹14,500", image: images[3] },
    { title: "Bamboo House", rating: "4.82", subtitle: "Guest favourite", price: "₹6,800", image: images[7] },
    { title: "Snow View Room", rating: "4.91", subtitle: "", price: "₹9,200", image: images[5] }
  ];

  const rowsData = [
    { category: "Explore experiences nearby", listings: baseListings4 },
    { category: "Popular homes in Manali", listings: baseListings4 },
    { category: "Popular homes in Gurgaon District", listings: baseListings3 },
    { category: "Homes in Noida", listings: baseListings3 },
    { category: "Places to stay in Rishikesh", listings: baseListings4 },
    { category: "Stay in New Delhi", listings: baseListings3 },
    { category: "Check out homes in Mumbai", listings: baseListings1 },
    { category: "Stay in Varanasi", listings: baseListings2 },
    { category: "Available in Udaipur this weekend", listings: baseListings2 },
    { category: "Available next month in North Goa", listings: baseListings1 },
    { category: "Available in Dehradun this weekend", listings: baseListings4 },
    { category: "Capture memories nearby", listings: baseListings2 },
  ];

  return (
    <div className={styles['home-container']}>
      <main className={styles['main-content']}>
        
        {/* Destinations for you Section */}
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
                <SplideSlide key={index}>
                  <NavLink to={`/search/${dest.country.toLowerCase()}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
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
                    <NavLink to=""  className="fs-6 fw-600">
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
              {row.listings.map((listing, index) => (
                <SplideSlide key={index}>
                  <NavLink to={`/listing/${index + 1}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
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
                        <span className={styles.duration}>for 2 nights</span>
                        <span className={styles['rating-container']}>
                          <FaStar size={10} className={styles['star-icon']} />
                          {listing.rating}
                        </span>
                      </div>
                    </div>
                    
                  </div>
                  </NavLink>
                </SplideSlide>
              ))}
              </SplideTrack>
            </Splide>
          </div>
        ))}
      </main>
    </div>
  );
}
