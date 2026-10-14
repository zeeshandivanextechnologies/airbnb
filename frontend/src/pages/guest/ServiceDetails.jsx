import React, { useState, useRef, useEffect } from 'react';
import { FaStar, FaShare, FaHeart, FaUserFriends, FaWheelchair, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { FiCamera, FiAward, FiBook, FiUpload } from 'react-icons/fi';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from './ServiceDetails.module.css';

const ServiceDetails = () => {
  const packages = [
    {
      id: 1,
      title: "Love couples",
      img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=720&q=80",
      desc: "A city tour with great experience pictures will be provided such us visiting different places in the city , exploring new things , get good...",
      meta: "₹2,000 / guest · Minimum ₹20,000 to book · 6 hrs"
    },
    {
      id: 2,
      title: "Solo portraits",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=720&q=80",
      desc: "Get amazing professional portraits around the best hidden spots in the city. Perfect for influencers, models, or just to have great photos.",
      meta: "₹1,500 / guest · Minimum ₹10,000 to book · 4 hrs"
    },
    {
      id: 3,
      title: "Family moments",
      img: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=720&q=80",
      desc: "Capture beautiful candid moments with your family. We will walk around the parks and iconic landmarks while taking natural, fun photos.",
      meta: "₹2,500 / guest · Minimum ₹25,000 to book · 5 hrs"
    },
    {
      id: 4,
      title: "Creative night shoot",
      img: "https://images.unsplash.com/photo-1514315384763-ba401779410f?w=720&q=80",
      desc: "Experience the city lights! A special night photography session using neon lights, long exposure, and creative techniques.",
      meta: "₹3,000 / guest · Minimum ₹15,000 to book · 3 hrs"
    }
  ];

  const [showPackageModal, setShowPackageModal] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(0);
  const mainRef = useRef(null);
  const thumbRef = useRef(null);

  const portfolioImages = [
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1080&q=80",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1080&q=80",
    "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1080&q=80"
  ];
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [portfolioIndex, setPortfolioIndex] = useState(0);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [guests, setGuests] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const [selectedTimePill, setSelectedTimePill] = useState(null);

  // Confirm and Pay states
  const [showConfirmPayPage, setShowConfirmPayPage] = useState(false);
  const [showEditGuestsModal, setShowEditGuestsModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showSearchAddressModal, setShowSearchAddressModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [confirmGuests, setConfirmGuests] = useState(guests);

  const openPortfolioModal = (index) => {
    setPortfolioIndex(index);
    setShowPortfolioModal(true);
  };

  useEffect(() => {
    if (showPackageModal) {
      setTimeout(() => {
        if (mainRef.current && thumbRef.current && mainRef.current.splide && thumbRef.current.splide) {
          mainRef.current.sync(thumbRef.current.splide);
        }
      }, 100);
    }
  }, [showPackageModal]);

  const openPackageModal = (index) => {
    setClickedIndex(index);
    setShowPackageModal(true);
  };

  if (showConfirmPayPage) {
    const selectedPkg = selectedTimePill ? packages.find(p => p.id === selectedTimePill.pkgId) : packages[0];
    const minPriceMatch = selectedPkg?.meta.match(/Minimum (₹[\d,]+) to book/);
    const minPrice = minPriceMatch ? minPriceMatch[1] : '₹10,230';

    return (
      <div className={`container py-lg-5 py-3  ${styles.confirmPayPage}`}>
        <div className={styles.confirmPayHeaderRow}>
          <button className={styles.backBtn} onClick={() => setShowConfirmPayPage(false)}>←</button>
          <h1 className={styles.confirmPayTitle}>Confirm and pay</h1>
        </div>
        
        <div className="row justify-content-center">
          <div className="col-lg-6 pe-lg-5 mb-4 mb-lg-0">
            <h2 className={styles.proceedPaymentTitle}>Proceed to payment</h2>
            <p className={styles.proceedPaymentDesc}>You'll be directed to Razorpay to provide your PAN and other details.</p>
            <p className={styles.termsText}>By selecting the button, I agree to the booking terms and release and waiver. <span className={styles.linkText}>View Privacy Policy.</span></p>
            <button className={styles.primaryActionBtn}>Confirm and pay</button>
          </div>

          <div className="col-lg-6">
            <div className={styles.summaryCard}>
              <div className={styles.summaryTop}>
                <img src={selectedPkg.img} alt="Package" className={styles.summaryImg} />
                <div className={styles.summaryTopRight}>
                  <h4 className={styles.summaryPkgTitle}>{selectedPkg.title}</h4>
                  <p className={styles.summaryPkgSub}>Results-oriented fitness by Amram</p>
                </div>
              </div>

              <hr className={styles.summaryDivider} />

              <div className={styles.summarySection}>
                <h5 className={styles.summarySecTitle}>Free cancellation</h5>
                <p className={styles.summarySecDesc}>Cancel before 13 Oct, 10:00 am (BST) for a full refund.</p>
              </div>

              <hr className={styles.summaryDivider} />

              <div className={styles.summarySection}>
                <h5 className={styles.summarySecTitle}>Date</h5>
                <p className={styles.summarySecDesc}>{selectedDate.toLocaleDateString('default', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}<br/>{selectedTimePill?.time} - {(parseInt(selectedTimePill?.time.split(':')[0])+1)+':00 am'}</p>
              </div>

              <hr className={styles.summaryDivider} />

              <div className={styles.summaryFlexRow}>
                <div>
                  <h5 className={styles.summarySecTitle}>Guests</h5>
                  <p className={styles.summarySecDesc}>{guests} guest{guests > 1 ? 's' : ''}</p>
                </div>
                <button className={styles.changeBtn} onClick={() => { setConfirmGuests(guests); setShowEditGuestsModal(true); }}>Change</button>
              </div>

              <hr className={styles.summaryDivider} />

              <div className={styles.summaryFlexRow}>
                <div>
                  <h5 className={styles.summarySecTitle}>Location</h5>
                  <p className={styles.summarySecDesc}>Greater London, SW11, United Kingdom</p>
                </div>
                <button className={styles.changeBtn} onClick={() => setShowLocationModal(true)}>Change</button>
              </div>

              <hr className={styles.summaryDivider} />

              <div className={styles.summarySection}>
                <h5 className={styles.summarySecTitle}>Price details</h5>
                <div className={styles.priceRow}>
                  <span>{selectedPkg.title}</span>
                  <span>{minPrice}</span>
                </div>
              </div>
              
              <div className={styles.couponSection} onClick={() => setShowCouponModal(true)}>
                Enter a coupon
              </div>

              <hr className={styles.summaryDivider} />

              <div className={styles.totalRow}>
                <span>Total <span className={styles.inrUnderline}>INR</span></span>
                <span>{minPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Guests Modal */}
        {showEditGuestsModal && (
          <div className={styles.scheduleModalOverlay}>
            <div className={styles.scheduleModalContainer}>
              <div className={styles.scheduleHeader}>
                <h2 className={styles.scheduleTitle}>Edit guests</h2>
                <button className={styles.scheduleCloseBtn} onClick={() => setShowEditGuestsModal(false)}>&times;</button>
              </div>
              <div className={styles.scheduleContent}>
                <div className={styles.guestSelector}>
                  <span className={styles.guestTextModal}>{confirmGuests} guest{confirmGuests > 1 ? 's' : ''}</span>
                  <div className={styles.guestControls}>
                    <button className={styles.guestBtn} onClick={() => setConfirmGuests(Math.max(1, confirmGuests - 1))}>-</button>
                    <span className={styles.guestCount}>{confirmGuests}</span>
                    <button className={styles.guestBtn} onClick={() => setConfirmGuests(confirmGuests + 1)}>+</button>
                  </div>
                </div>
              </div>
              <div className={styles.scheduleFooter}>
                <div className={styles.scheduleFooterPrice}>
                  {confirmGuests} guests
                </div>
                <button className={styles.scheduleNextBtn} onClick={() => { setGuests(confirmGuests); setShowEditGuestsModal(false); }}>Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Location Modal */}
        {showLocationModal && (
          <div className={styles.scheduleModalOverlay}>
            <div className={styles.scheduleModalContainer}>
              <div className={styles.scheduleHeader}>
                <button className={styles.scheduleCloseBtn} onClick={() => setShowLocationModal(false)}>&times;</button>
                <div style={{ flex: 1 }}></div>
              </div>
              <div className={styles.scheduleContent}>
                <h2 className={styles.locationModalTitle}>Confirm where you want your fitness session to take place</h2>
                <div className={styles.locationItem}>
                  <div className={styles.locIconWrapper}><FaMapMarkerAlt className={styles.locIcon} /></div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className={styles.locText}>Your service host's location</span>
                  </div>
                </div>
              </div>
              <div className={styles.locationFooter}>
                <button className={styles.outlineBtnFull} onClick={() => { setShowLocationModal(false); setShowSearchAddressModal(true); }}>Change service location</button>
                <button className={styles.scheduleNextBtn} onClick={() => setShowLocationModal(false)}>Confirm</button>
              </div>
            </div>
          </div>
        )}

        {/* Search Address Modal */}
        {showSearchAddressModal && (
          <div className={styles.scheduleModalOverlay}>
            <div className={styles.scheduleModalContainer}>
              <div className={styles.scheduleHeader}>
                <h2 className={styles.scheduleTitle}>Change service location</h2>
                <button className={styles.scheduleCloseBtn} onClick={() => setShowSearchAddressModal(false)}>&times;</button>
              </div>
              <div className={styles.scheduleContent}>
                <input type="text" className={styles.addressInput} placeholder="search by address" />
              </div>
            </div>
          </div>
        )}

        {/* Coupon Modal */}
        {showCouponModal && (
          <div className={styles.scheduleModalOverlay}>
            <div className={styles.scheduleModalContainer}>
              <div className={styles.scheduleHeader}>
                <h2 className={styles.scheduleTitle}>Coupons</h2>
                <button className={styles.scheduleCloseBtn} onClick={() => setShowCouponModal(false)}>&times;</button>
              </div>
              <div className={styles.scheduleContent} style={{ display: 'flex', flexDirection: 'column', paddingTop: '24px' }}>
                <label className={styles.couponLabel}>Add a coupon</label>
                <input type="text" className={styles.couponInput} placeholder="Enter a coupon" />
              </div>
              <div className={styles.scheduleFooter} style={{ justifyContent: 'space-between' }}>
                <button className={styles.cancelBtn} onClick={() => setShowCouponModal(false)}>Cancel</button>
                <button className={styles.scheduleNextBtn}>Add</button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className={`container py-5 ${styles.servicesPage}`}>
      <div className="row">
        {/* Left Sticky Column */}
        <div className="col-lg-5 d-none d-lg-block">
          <div className={styles.stickyLeft}>
              <div className={styles.profileCard}>
                <div className={styles.coverImageWrapper}>
                  <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=720&q=80" alt="Cover" className={styles.coverImage} />
                </div>
                <div className={styles.avatarWrapper}>
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" alt="Prateek" className={styles.avatarImage} />
                </div>
                <h1 className={styles.title}>Romantic city visuals by Prateek</h1>
                <p className={styles.subtitle}>I studied film making and worked for years as a full time photographer.</p>
                <div className={styles.metaInfo}>
                  <span><FaStar className="me-1" />5.0</span>
                  <span className={styles.dot}>·</span>
                  <span>Photographer in Jaipur</span>
                </div>
                <div className={styles.metaSub}>Provided on location</div>
                
                <div className={styles.actionButtons}>
                  <button className={styles.iconBtn}><FiUpload /></button>
                  <button className={styles.iconBtn}><FaHeart /></button>
                </div>
             </div>

             <div className={styles.bookingCard}>
               <div className="d-flex justify-content-between align-items-center">
                 <div>
                   <div className={styles.bookingPrice}>
                     <span className={styles.price}>From ₹2,000</span> <span className={styles.guestText}>/ guest</span>
                   </div>
                   <div className={styles.bookingSub}>
                     Minimum ₹20,000 to book<br/>
                     <span className={styles.freeCancel}>Free cancellation</span>
                   </div>
                 </div>
                 <button className={styles.showDatesBtn} onClick={() => setShowScheduleModal(true)}>Show dates</button>
               </div>
             </div>
          </div>
        </div>

        {/* Right Scrollable Column */}
        <div className="col-lg-7 ps-lg-5">
           <div className={styles.rightContent}>
              {/* Package Card */}
              {packages.map((pkg, index) => (
                <div key={pkg.id} className={styles.packageCard} onClick={() => openPackageModal(index)}>
                   <img src={pkg.img} alt={pkg.title} className={styles.packageImg} />
                   <div className={styles.packageDetails}>
                      <h4 className={styles.packageTitle}>{pkg.title}</h4>
                      <p className={styles.packageDesc}>{pkg.desc}</p>
                      <div className={styles.packageMeta}>{pkg.meta}</div>
                   </div>
                </div>
              ))}
              <p className={styles.messageHint}>You can message Prateek to customise or make changes.</p>
              
              <hr className={styles.divider} />

              {/* Reviews */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}><FaStar className="me-2"/>5.0 · 1 review</h2>
                <div className={styles.reviewCard}>
                  <div className={styles.reviewerInfo}>
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80" alt="Kelechi" className={styles.reviewerAvatar} />
                    <div>
                      <div className={styles.reviewerName}>Kelechi</div>
                      <div className={styles.reviewerLocation}>London, United Kingdom</div>
                    </div>
                  </div>
                  <div className={styles.reviewRating}>★★★★★ · August 2026</div>
                  <p className={styles.reviewText}>
                    Prateek went above and beyond. He is extremely passionate and comes with a unique creative perspective. He directed the entire shoot, worked extremely well under a lot of pressure and under unfavourable... <span className={styles.showMore}>Show more</span>
                  </p>
                </div>
                <button className={styles.outlineBtn}>Show all reviews</button>
                <div className={styles.learnMore}>Learn how reviews work</div>
              </div>

              <hr className={styles.divider} />

              {/* Qualifications */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>My qualifications</h2>
                <div className={styles.qualificationsLayout}>
                  <div className={styles.hostInfoCard}>
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" alt="Prateek" className={styles.largeAvatar} />
                    <h3 className={styles.hostName}>Prateek</h3>
                    <p className={styles.hostRole}>Photographer</p>
                  </div>
                  <div className={styles.qualificationsList}>
                    <div className={styles.qualItem}>
                      <FiCamera className={styles.qualIcon} />
                      <div>
                        <h4 className={styles.qualTitle}>8 years of experience</h4>
                        <p className={styles.qualDesc}>I spent years working as a full time photographer as well as cinematographer</p>
                      </div>
                    </div>
                    <div className={styles.qualItem}>
                      <FiAward className={styles.qualIcon} />
                      <div>
                        <h4 className={styles.qualTitle}>Career highlight</h4>
                        <p className={styles.qualDesc}>One of my work got selected for Jaipur photo exhibition and showcased at a great place</p>
                      </div>
                    </div>
                    <div className={styles.qualItem}>
                      <FiBook className={styles.qualIcon} />
                      <div>
                        <h4 className={styles.qualTitle}>Education and training</h4>
                        <p className={styles.qualDesc}>I studied film making from a respective university</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button className={styles.outlineBtn}>Message Prateek</button>
                <div className={styles.protectionText}>To help protect your payment, always use Airbnb to send money and communicate with hosts.</div>
              </div>

              <hr className={styles.divider} />

              {/* Portfolio */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>My portfolio</h2>
                <div className={styles.portfolioGrid}>
                  <div className={styles.portLarge} onClick={() => openPortfolioModal(0)} style={{ cursor: 'pointer' }}>
                    <img src={portfolioImages[0]} alt="Portfolio 1" />
                  </div>
                  <div className={styles.portRight}>
                    <div className={styles.portSmall} onClick={() => openPortfolioModal(1)} style={{ cursor: 'pointer' }}>
                      <img src={portfolioImages[1]} alt="Portfolio 2" />
                    </div>
                    <div className={styles.portSmall} onClick={() => openPortfolioModal(2)} style={{ cursor: 'pointer' }}>
                      <img src={portfolioImages[2]} alt="Portfolio 3" />
                    </div>
                  </div>
                </div>
              </div>

              <hr className={styles.divider} />

              {/* Where you'll go */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Where you'll go</h2>
                <p className={styles.locationText}>Jaipur, Rajasthan, 302021</p>
                <div className={styles.mapContainer}>
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113911.3916664972!2d75.72750058229415!3d26.88514169999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{border:0, borderRadius: '12px'}} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Jaipur Location Map"
                  ></iframe>
                </div>
              </div>

              <hr className={styles.divider} />

              {/* Things to know */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Things to know</h2>
                <div className="row mt-4">
                  <div className="col-md-4 mb-4">
                    <FaUserFriends className={styles.knowIcon} />
                    <h4 className={styles.knowTitle}>Guest requirements</h4>
                    <p className={styles.knowDesc}>Guests aged 18 and over can attend, up to 3 guests in total.</p>
                  </div>
                  <div className="col-md-4 mb-4">
                    <FaWheelchair className={styles.knowIcon} />
                    <h4 className={styles.knowTitle}>Accessibility</h4>
                    <p className={styles.knowDesc}>Message your host for details.<br/><span className={styles.linkText}>Learn more</span></p>
                  </div>
                  <div className="col-md-4 mb-4">
                    <FaCalendarAlt className={styles.knowIcon} />
                    <h4 className={styles.knowTitle}>Cancellation policy</h4>
                    <p className={styles.knowDesc}>Cancel at least 1 day before the start time for a full refund.</p>
                  </div>
                </div>
              </div>

           </div>
        </div>

        {/* Mobile Sticky Booking Footer (Only visible on mobile) */}
        <div className="col-12 d-block d-lg-none">
          <div className={styles.mobileBookingFooter}>
             <div className="d-flex justify-content-between align-items-center w-100">
               <div>
                 <div className={styles.bookingPrice}>
                   <span className={styles.price}>From ₹2,000</span> <span className={styles.guestText}>/ guest</span>
                 </div>
                 <div className={styles.freeCancel}>Free cancellation</div>
               </div>
               <button className={styles.showDatesBtn} onClick={() => setShowScheduleModal(true)}>Show dates</button>
             </div>
          </div>
        </div>
      </div>

      {showPackageModal && (
        <div className={styles.sliderModalOverlay}>
          <div className={styles.sliderModalContainer}>
            {/* Thumbnails */}
            <div className={styles.thumbnailColumn}>
              <Splide 
                ref={thumbRef}
                options={{
                  direction: 'ttb',
                  height: '320px',
                  autoHeight: true,
                  gap: '12px',
                  pagination: false,
                  arrows: false,
                  isNavigation: true,
                  start: clickedIndex,
                  focus: 'center'
                }}
              >
                {packages.map((pkg, index) => (
                  <SplideSlide key={`thumb-${pkg.id}`}>
                    <img 
                      src={pkg.img} 
                      alt={`Thumb ${pkg.title}`} 
                      className={styles.sliderThumbImg} 
                      onClick={() => {
                        if (mainRef.current && mainRef.current.splide) {
                          mainRef.current.splide.go(index);
                        }
                      }}
                    />
                  </SplideSlide>
                ))}
              </Splide>
            </div>

            {/* Main Modal Box */}
            <div className={styles.sliderMainBox}>
              <button className={styles.sliderCloseBtn} onClick={() => setShowPackageModal(false)}>&times;</button>
              <Splide
                ref={mainRef}
                options={{
                  type: 'slide',
                  direction: 'ttb',
                  height: '450px',
                  pagination: false,
                  arrows: false,
                  start: clickedIndex,
                  drag: false
                }}
              >
                {packages.map((pkg) => (
                  <SplideSlide key={`main-${pkg.id}`}>
                    <div className={styles.sliderMainSlide}>
                      <img src={pkg.img} alt={pkg.title} className={styles.sliderMainImg} />
                      <div className={styles.sliderMainContent}>
                        <h2 className={styles.sliderMainTitle}>{pkg.title}</h2>
                        <div className={styles.sliderMainMeta}>{pkg.meta}</div>
                        <p className={styles.sliderMainDesc}>{pkg.desc}</p>
                        <button className={styles.sliderMainBtn} onClick={() => { setShowPackageModal(false); setShowScheduleModal(true); }}>Show dates</button>
                      </div>
                    </div>
                  </SplideSlide>
                ))}
              </Splide>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Full View Modal */}
      {showPortfolioModal && (
        <div className={styles.portfolioModalOverlay}>
          <button className={styles.portfolioCloseBtn} onClick={() => setShowPortfolioModal(false)}>&times;</button>
          <div className={styles.portfolioModalContent}>
            <Splide
              options={{
                type: 'slide',
                pagination: true,
                arrows: true,
                start: portfolioIndex,
                keyboard: true,
                drag: true
              }}
            >
              {portfolioImages.map((src, index) => (
                <SplideSlide key={`portfolio-${index}`}>
                  <div className={styles.portfolioSlideWrapper}>
                    <img src={src} alt={`Portfolio full ${index + 1}`} className={styles.portfolioFullImg} />
                  </div>
                </SplideSlide>
              ))}
            </Splide>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className={styles.scheduleModalOverlay}>
          <div className={styles.scheduleModalContainer}>
            <div className={styles.scheduleHeader}>
              <h2 className={styles.scheduleTitle}>Schedule your session</h2>
              <button className={styles.scheduleCloseBtn} onClick={() => setShowScheduleModal(false)}>&times;</button>
            </div>
            
            <div className={styles.scheduleContent}>
              <div className={styles.guestSelector}>
                <span className={styles.guestTextModal}>{guests} guest{guests > 1 ? 's' : ''}</span>
                <div className={styles.guestControls}>
                  <button className={styles.guestBtn} onClick={() => setGuests(Math.max(1, guests - 1))}>-</button>
                  <span className={styles.guestCount}>{guests}</span>
                  <button className={styles.guestBtn} onClick={() => setGuests(guests + 1)}>+</button>
                </div>
              </div>

              <div className={styles.dateSelector}>
                <div className={styles.dateMonthRow}>
                  <span className={styles.dateMonthTitle}>{selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                  <FaCalendarAlt 
                    className={styles.calendarIcon} 
                    onClick={() => setShowFullCalendar(true)} 
                  />
                </div>
                <div className={styles.dateDaysRow}>
                  {(() => {
                    const days = [];
                    const startOfWeek = new Date(selectedDate);
                    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
                    const today = new Date();
                    today.setHours(0,0,0,0);

                    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                    for (let i = 0; i < 7; i++) {
                      const d = new Date(startOfWeek);
                      d.setDate(startOfWeek.getDate() + i);
                      
                      const isPast = d < today;
                      const isSelected = d.toDateString() === selectedDate.toDateString();
                      
                      let numClass = styles.dayNum;
                      if (isPast) numClass = styles.dayNumDisabled;
                      else if (isSelected) numClass = styles.dayNumActive;

                      days.push(
                        <div 
                          key={i} 
                          className={styles.dateDay} 
                          onClick={() => { if(!isPast) setSelectedDate(d) }}
                          style={{ cursor: isPast ? 'default' : 'pointer' }}
                        >
                          <span className={styles.dayName}>{dayNames[i]}</span>
                          <span className={numClass}>{d.getDate()}</span>
                        </div>
                      );
                    }
                    return days;
                  })()}
                </div>
              </div>

              <div className={styles.sessionsList}>
                {packages.map(pkg => (
                  <div key={`sched-${pkg.id}`} className={styles.sessionItem}>
                    <div className={styles.sessionHeader}>
                      <img src={pkg.img} alt={pkg.title} className={styles.sessionImg} />
                      <div>
                        <h4 className={styles.sessionTitle}>{pkg.title}</h4>
                        <p className={styles.sessionMeta}>{pkg.meta}</p>
                      </div>
                    </div>
                    <div className={styles.timePills}>
                      {['9:00 am', '9:30 am', '10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 pm', '12:30 pm', '1:00 pm'].slice(0, 4 + (pkg.id % 4)).map(time => {
                        const isSelected = selectedTimePill && selectedTimePill.pkgId === pkg.id && selectedTimePill.time === time;
                        return (
                          <button 
                            key={time} 
                            className={`${styles.timePill} ${isSelected ? styles.timePillSelected : ''}`}
                            onClick={() => setSelectedTimePill({ pkgId: pkg.id, time })}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedTimePill && (() => {
              const selectedPkg = packages.find(p => p.id === selectedTimePill.pkgId);
              const minPriceMatch = selectedPkg?.meta.match(/Minimum (₹[\d,]+) to book/);
              const minPrice = minPriceMatch ? minPriceMatch[1] : '₹10,230';
              return (
                <div className={styles.scheduleFooter}>
                  <div className={styles.scheduleFooterPrice}>
                    <span className={styles.footerPriceAmount}>{minPrice}</span> minimum to book
                  </div>
                  <button 
                    className={styles.scheduleNextBtn}
                    onClick={() => { setShowScheduleModal(false); setShowConfirmPayPage(true); }}
                  >
                    Next
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Full Calendar Modal */}
      {showFullCalendar && (
        <div className={styles.calendarModalOverlay}>
          <div className={styles.calendarModalContainer}>
            <div className={styles.calendarHeader}>
              <h2 className={styles.calendarTitle}>Select Date</h2>
              <button className={styles.scheduleCloseBtn} onClick={() => setShowFullCalendar(false)}>&times;</button>
            </div>
            <div className={styles.calendarContent}>
              <DayPicker 
                mode="single"
                numberOfMonths={2}
                selected={selectedDate}
                onSelect={(date) => {
                  if(date) {
                    setSelectedDate(date);
                    setShowFullCalendar(false);
                  }
                }}
                disabled={{ before: new Date() }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetails;
