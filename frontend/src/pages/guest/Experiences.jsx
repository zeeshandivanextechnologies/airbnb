import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { FaHeart, FaStar, FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import styles from '../../components/styles/Experiences.module.css';
import { NavLink } from 'react-router-dom';

export default function Experiences() {
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

  const rowsData = [
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
        { title: "Kerala Backwaters Tour", rating: "4.98", time: "Original", price: "5,000", image: images[5] },
        { title: "Traditional Cooking in Kerala", rating: "4.95", time: "Original", price: "3,200", image: images[1] },
        { title: "Goa Music Festival", rating: "4.92", time: "7pm", price: "4,000", image: images[2] },
        { title: "Himalayan Yoga Retreat", rating: "4.99", time: "Original", price: "8,500", image: images[6] },
        { title: "Rajasthan Hot Air Balloon", rating: "4.94", time: "Original", price: "10,500", image: images[0] },
        { title: "Sula Vineyards Tour", rating: "4.85", time: "Original", price: "2,500", image: images[7] },
        { title: "Pondicherry Surfing", rating: "4.9", time: "Original", price: "3,500", image: images[3] },
        { title: "Dharavi Pottery Making", rating: "4.88", time: "Original", price: "1,200", image: images[4] }
      ]
    }
  ];

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
              {row.listings.map((listing, index) => (
                <SplideSlide key={index}>
                  <NavLink to={`/experience/${index}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className={styles['listing-card']}>
                      
                      {/* Image Container with Badges */}
                      <div className={styles['image-container']}>
                        <img 
                          src={listing.image} 
                          alt={listing.title}
                          className={styles['listing-image']}
                        />
                        
                        {/* Time Pill */}
                        {listing.time && (
                          <div className={styles['time-pill']}>
                            {listing.time}
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
              ))}
              </SplideTrack>
            </Splide>
          </div>
        ))}
      </main>
    </div>
  );
}
