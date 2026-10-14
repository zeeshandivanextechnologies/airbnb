import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaShare, FaRegHeart, FaRegClock, FaWalking, FaWheelchair, FaMapMarkerAlt } from 'react-icons/fa';
import { FiMapPin, FiClipboard, FiGrid, FiUsers, FiBriefcase, FiCheckCircle, FiCalendar, FiX, FiPlus, FiMinus, FiChevronLeft } from 'react-icons/fi';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from '../../components/styles/ExperienceDetails.module.css';

export default function ExperienceDetails() {
  const { id } = useParams();

  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 9, 10)); // October 10, 2026
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [adultCount, setAdultCount] = useState(1);
  const [clickedIndex, setClickedIndex] = useState(0);

  const [showConfirmPayPage, setShowConfirmPayPage] = useState(false);
  const [showEditGuestsModal, setShowEditGuestsModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showSearchAddressModal, setShowSearchAddressModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [confirmGuests, setConfirmGuests] = useState(1);
  const mainRef = useRef(null);
  const thumbRef = useRef(null);

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

  const timelinePackages = [
    {
      id: 1,
      title: "Travel to forts",
      img: "https://picsum.photos/seed/pkg1/400/400",
      desc: "Find secret forts in the Nahargarh range.",
      meta: "45 mins"
    },
    {
      id: 2,
      title: "Watch the sun rise",
      img: "https://picsum.photos/seed/pkg2/400/400",
      desc: "Glimpse the dawn over Amer and Jaigarh Forts.",
      meta: "30 mins"
    },
    {
      id: 3,
      title: "Bird watching",
      img: "https://picsum.photos/seed/pkg3/400/400",
      desc: "Observe native and migratory bird species.",
      meta: "1 hr"
    },
    {
      id: 4,
      title: "Hear about Aravali",
      img: "https://picsum.photos/seed/pkg4/400/400",
      desc: "Learn the history of the oldest mountain range.",
      meta: "30 mins"
    },
    {
      id: 5,
      title: "Enjoy breakfast",
      img: "https://picsum.photos/seed/pkg5/400/400",
      desc: "Recharge with a filling breakfast.",
      meta: "45 mins"
    }
  ];

  const experienceReviews = [
    {
      id: 1,
      name: "Peter",
      loc: "England, United Kingdom",
      img: "https://randomuser.me/api/portraits/men/33.jpg",
      rating: 5,
      date: "1 week ago",
      text: "We had such a brilliant time exploring Jaipur with Juber! It was so reassuring to have someone guiding us around and it made it so much easier not to have to organise tuktuks or ubers all the time. He is so kind and patient and knows Jaipur like the..."
    },
    {
      id: 2,
      name: "Tomi",
      loc: "Kuta, Indonesia",
      img: "https://randomuser.me/api/portraits/men/44.jpg",
      rating: 4,
      date: "September 2026",
      text: "Juber was friendly and the Tuk Tuk transportation itself was enjoyable. I would simply recommend this experience to travelers who are primarily looking for private transportation around the listed sites. If you are hoping for detailed explanations and..."
    },
    {
      id: 3,
      name: "Andrés Joel",
      loc: "Mexico City, Mexico",
      img: "https://randomuser.me/api/portraits/men/55.jpg",
      rating: 5,
      date: "September 2026",
      text: "The tour was fabulous. The guide knows the subject and explains it with a lot of patience. I highly recommend this tour."
    },
    {
      id: 4,
      name: "현종",
      loc: "Seoul, South Korea",
      img: "https://randomuser.me/api/portraits/women/66.jpg",
      rating: 5,
      date: "August 2026",
      text: "An excellent day. We covered a lot — Amber Fort, Panna Meena ka Kund, Gaitor Ki Chhatriyan, City Palace, Jantar Mantar, Jal Mahal and Galtaji — but it never felt rushed. Juber knew the history of each place well and explained things clearly, which mad..."
    },
    {
      id: 5,
      name: "Prisca",
      loc: "Lyon, France",
      img: "https://randomuser.me/api/portraits/women/77.jpg",
      rating: 5,
      date: "August 2026",
      text: "We had a great day in Jaipur, and this visit far exceeded our expectations. The guide was really great: very friendly, punctual, available, and above all, he gave us a lot of interesting information and valuable advice throughout the day. We were able..."
    },
    {
      id: 6,
      name: "Caroline",
      loc: "",
      img: "https://randomuser.me/api/portraits/women/88.jpg",
      rating: 5,
      date: "August 2026",
      text: "Juber was amazing! He really loves his beautiful home of Jaipur and taught us so much about it's history. He completely tailored the day to what we (me and my son - 22 and daughter - 18) wanted to see and made fantastic recommendations -..."
    }
  ];

  const timeSlots = [
     { day: "Tomorrow, 10 October", time: "9:00 am – 4:00 pm", price: 2000 },
     { day: "Sunday, 11 October", time: "9:00 am – 4:00 pm", price: 2000 },
     { day: "Monday, 12 October", time: "9:00 am – 4:00 pm", price: 2000 },
     { day: "Tuesday, 13 October", time: "9:00 am – 4:00 pm", price: 2000 }
  ];

  const guests = adultCount;
  const setGuests = setAdultCount;
  const selectedPkg = timelinePackages[clickedIndex] || timelinePackages[0];
  const selectedTimePill = timeSlots[selectedSlot !== null ? selectedSlot : 0];
  const minPrice = "₹" + (guests * 2000).toLocaleString();

  if (showConfirmPayPage) {
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
              <div className={styles.scheduleModalHeader}>
                <h2 className="fw-bold mb-0 mx-auto" style={{fontSize:'18px'}}>Edit guests</h2>
                <button className={styles.scheduleModalCloseBtn} onClick={() => setShowEditGuestsModal(false)}>
                  <FiX size={24} />
                </button>
              </div>
              <div className={styles.scheduleModalConfigRow} style={{paddingTop: '24px'}}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span style={{fontSize:'16px', fontWeight:600}}>{confirmGuests} guest{confirmGuests > 1 ? 's' : ''}</span>
                  <div className="d-flex align-items-center gap-3">
                    <button className={styles.counterBtn} onClick={() => setConfirmGuests(Math.max(1, confirmGuests - 1))}><FiMinus /></button>
                    <span>{confirmGuests}</span>
                    <button className={styles.counterBtn} onClick={() => setConfirmGuests(confirmGuests + 1)}><FiPlus /></button>
                  </div>
                </div>
              </div>
              <div className={styles.scheduleModalFooter}>
                <div style={{fontSize:'16px', fontWeight:600}}>
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
              <div className={styles.scheduleModalHeader}>
                <button className={styles.scheduleModalCloseBtn} onClick={() => setShowLocationModal(false)}>
                  <FiX size={24} />
                </button>
                <div style={{ flex: 1 }}></div>
              </div>
              <div className={styles.scheduleModalBody}>
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
              <div className={styles.scheduleModalHeader}>
                <h2 className="fw-bold mb-0 mx-auto" style={{fontSize:'18px'}}>Change service location</h2>
                <button className={styles.scheduleModalCloseBtn} onClick={() => setShowSearchAddressModal(false)}>
                  <FiX size={24} />
                </button>
              </div>
              <div className={styles.scheduleModalBody} style={{paddingTop: '24px'}}>
                <input type="text" className={styles.addressInput} placeholder="search by address" />
              </div>
            </div>
          </div>
        )}

        {/* Coupon Modal */}
        {showCouponModal && (
          <div className={styles.scheduleModalOverlay}>
            <div className={styles.scheduleModalContainer}>
              <div className={styles.scheduleModalHeader}>
                <h2 className="fw-bold mb-0 mx-auto" style={{fontSize:'18px'}}>Coupons</h2>
                <button className={styles.scheduleModalCloseBtn} onClick={() => setShowCouponModal(false)}>
                  <FiX size={24} />
                </button>
              </div>
              <div className={styles.scheduleModalBody} style={{ display: 'flex', flexDirection: 'column', paddingTop: '24px' }}>
                <label className={styles.couponLabel}>Add a coupon</label>
                <input type="text" className={styles.couponInput} placeholder="Enter a coupon" />
              </div>
              <div className={styles.scheduleModalFooter} style={{ justifyContent: 'space-between' }}>
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
    <div className={`container ${styles.container}`}>
      
      {/* Top Header Section */}
      <div className="row align-items-center mb-5 pb-5 border-bottom">
        {/* Left Column: Image Grid */}
        <div className="col-lg-6 mb-4 mb-lg-0">
          <div className={styles['photo-grid-2x2']}>
            <img 
              src="https://picsum.photos/seed/hike1/600/800" 
              alt="Hike sunrise" 
              className={`${styles['grid-img']} ${styles['grid-img-1']}`} 
            />
            <img 
              src="https://picsum.photos/seed/hike2/600/800" 
              alt="Fort view" 
              className={`${styles['grid-img']} ${styles['grid-img-2']}`} 
            />
            <img 
              src="https://picsum.photos/seed/hike3/600/800" 
              alt="Fort sunset" 
              className={`${styles['grid-img']} ${styles['grid-img-3']}`} 
            />
            <div className={`${styles['grid-img-wrapper']} ${styles['grid-img-4']}`}>
              <img 
                src="https://picsum.photos/seed/hike4/600/800" 
                alt="Nature walk" 
                className={`${styles['grid-img']} ${styles['grid-img-4']}`} 
              />
              <div className={styles['show-all-photos-btn']}>
                <FiGrid size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Title and Details */}
        <div className="col-lg-6 d-flex flex-column align-items-center justify-content-center pt-lg-5">
          <div className={styles['details-wrapper']}>
            
            <h1 className="fw-bold text-center mb-3" style={{ fontSize: '32px', lineHeight: '1.1' }}>
              Hike/Trek/Nature Walk<br />with sunrise views & Birding
            </h1>
            
            <p className="text-center text-muted mb-4" style={{ fontSize: '15px' }}>
              Hike through the Aravali ranges, finding breathtaking<br />views, and rare wildlife.
            </p>
            
            <div className="d-flex justify-content-center align-items-center gap-1 mb-1" style={{ fontSize: '13px', fontWeight: '600' }}>
              <FaStar size={12} /> 4.91
              <span className="mx-1">·</span>
              <span className="text-decoration-underline">46 ratings</span>
            </div>
            
            <div className="d-flex justify-content-center gap-1 mb-4 text-muted" style={{ fontSize: '13px' }}>
              <span>Jaipur</span>
              <span className="mx-1">·</span>
              <span>Outdoors</span>
            </div>
            
            <div className="d-flex justify-content-center gap-4 mb-5">
              <button className="btn btn-link text-dark p-0"><FaShare size={18} /></button>
              <button className="btn btn-link text-dark p-0"><FaRegHeart size={18} /></button>
            </div>

            {/* List Items */}
            <div className="d-flex flex-column gap-4">
              <div className="d-flex align-items-center gap-3">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Host" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div className="fw-bold" style={{ fontSize: '15px' }}>Hosted by Harshit</div>
                  <div className="text-muted" style={{ fontSize: '13px' }}>Professional Trek Leader</div>
                </div>
              </div>
              
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center bg-light" style={{ width: '48px', height: '48px', borderRadius: '50%' }}>
                  <FiMapPin size={20} />
                </div>
                <div>
                  <div className="fw-bold" style={{ fontSize: '15px' }}>Jaipur</div>
                  <div className="text-muted" style={{ fontSize: '13px' }}>Rajasthan</div>
                </div>
              </div>
              
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center bg-light" style={{ width: '48px', height: '48px', borderRadius: '50%' }}>
                  <FaRegClock size={20} />
                </div>
                <div>
                  <div className="fw-bold" style={{ fontSize: '15px' }}>Around 2 hrs experience</div>
                  <div className="text-muted" style={{ fontSize: '13px' }}>Hosted in English, Hindi</div>
                </div>
              </div>
              
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center bg-light" style={{ width: '48px', height: '48px', borderRadius: '50%' }}>
                  <FiClipboard size={20} />
                </div>
                <div>
                  <div className="fw-bold" style={{ fontSize: '15px' }}>What's included</div>
                  <div className="text-muted" style={{ fontSize: '13px' }}>Light bites</div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="row">
        <div className="col-lg-7 pe-lg-5">
          <h2 className="mb-4 fw-bold" style={{ fontSize: '22px' }}>What you'll do</h2>
          <div className={styles.packagesContainer}>
            {timelinePackages.map((pkg, index) => (
              <div key={pkg.id} className={styles.packageCard} onClick={() => openPackageModal(index)}>
                 <img src={pkg.img} alt={pkg.title} className={styles.packageImg} />
                 <div className={styles.packageDetails}>
                    <h4 className={styles.packageTitle}>{pkg.title}</h4>
                    <p className={styles.packageDesc}>{pkg.desc}</p>
                    <div className={styles.packageMeta}>{pkg.meta}</div>
                 </div>
              </div>
            ))}
          </div>

          <hr className="my-5" />

          {/* Reviews Section */}
          <div className={styles.reviewsSection}>
             <h2 className={styles.reviewsTitle}><FaStar size={20} className="me-2 mb-1" /> 4.9 · 99 ratings</h2>
             
             <div className="row gy-4 mb-4">
                {experienceReviews.map((review) => (
                   <div key={review.id} className="col-md-6">
                      <div className={styles.reviewCard}>
                         <div className={styles.reviewerHeader}>
                            <img src={review.img} className={styles.reviewerImg} alt={review.name} />
                            <div className={styles.reviewerInfo}>
                               <div className={styles.reviewerName}>{review.name}</div>
                               {review.loc && <div className={styles.reviewerLocation}>{review.loc}</div>}
                            </div>
                         </div>
                         <div className={styles.reviewMeta}>
                            <div className={styles.reviewStars}>
                               {[...Array(5)].map((_, idx) => (
                                  <FaStar key={idx} size={10} color={idx < review.rating ? "#222222" : "#dddddd"} />
                               ))}
                            </div>
                            <span className="mx-1">·</span>
                            <span className={styles.reviewDate}>{review.date}</span>
                         </div>
                         <div className={styles.reviewText}>
                            {review.text}
                         </div>
                         <div className={styles.reviewShowMore}>Show more</div>
                      </div>
                   </div>
                ))}
             </div>
             
             <button className={styles.showAllReviewsBtn}>Show all ratings</button>
             <div className="text-center mt-3">
               <span className={styles.learnReviewsLink}>Learn how ratings and reviews work</span>
             </div>
          </div>

          <hr className="my-5" />

          {/* Where we'll meet */}
          <div className={styles.locationSection}>
             <h2 className={styles.sectionTitle}>Where we'll meet</h2>
             <div className="mb-4">
                <div style={{fontSize: '16px', color: '#222'}}>Pick up from airport train station bus station guest hotels</div>
                <div style={{fontSize: '15px', color: '#717171'}}>Jaipur, Rajasthan, 302006</div>
             </div>
             
             <div className={styles.mapContainer}>
                {/* Google Maps Embed iframe */}
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113911.66624991094!2d75.71445722420953!3d26.912433596657922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db4b51cad7c93%3A0xc6651231f8f74a00!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{border:0}} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Meetup Location"
                ></iframe>
             </div>
          </div>

          <hr className="my-5" />

          {/* About me */}
          <div className={styles.aboutMeSection}>
             <h2 className={styles.sectionTitle}>About me</h2>
             
             <div className="row mt-4">
                <div className="col-md-5 mb-4 mb-md-0 d-flex flex-column align-items-center">
                   <div className={styles.hostCard}>
                      <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Host" className={styles.hostCardImg} />
                      <div className={styles.hostCardName}>Juber</div>
                      <div className={styles.hostCardTagline}>Ride, Discover & Hear Jaipur's Tales.</div>
                   </div>
                   
                   <button className={styles.messageHostBtn}>Message Juber</button>
                   
                   <p className={styles.protectionText}>
                     To help protect your payment, always use Airbnb to send money and<br/>communicate with hosts.
                   </p>
                </div>
                
                <div className="col-md-7 ps-md-4">
                   <div className={styles.hostBio}>
                      Hello traveler! Salam I'm Juber<br />
                      I love showing my clients the beauty of Jaipur city from a local's perspective. My tour is focused to make sure you have the best possible experience in Jaipur, and I customize each tour based on your interests and preferences.<br /><br />
                      Whether you want to see the most popular Jaipur sites, learn about Mughal history, take Instagram-worthy pictures, eat or drink in some of the city's hidden gems, explore,shop to find local Jaipur treasures, or something else entirely, I am here and excited to host you around each experience!Thank you for considering Juber Tours! I hope to be able to show you beautiful Jaipur city soon
                   </div>
                </div>
             </div>
          </div>
          
        </div>

        {/* Right Column: Sticky Booking Widget */}
        <div className="col-lg-5 position-relative ps-lg-4">
          <div className={styles.stickyBookingWidget}>
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <div className={styles.bookingPrice}>
                  From <span className="text-decoration-underline fw-bold">₹4,200</span> <span className="text-muted fw-normal" style={{fontSize:'14px'}}>/ guest</span>
                </div>
                <div className={styles.bookingFreeCancel}>Free cancellation</div>
              </div>
              <button className={styles.bookingShowDatesBtn} onClick={() => setShowScheduleModal(true)}>Show dates</button>
            </div>
            
            <hr className={styles.widgetDivider} />
            
            <div className={styles.dateCardsList}>
              <div className={styles.dateCard}>
                <div className={styles.dateCardTitle}>Tomorrow, 10 October</div>
                <div className={styles.dateCardTime}>6:00 - 8:00 am</div>
              </div>
              <div className={styles.dateCard}>
                <div className={styles.dateCardTitle}>Sunday, 11 October</div>
                <div className={styles.dateCardTime}>6:00 - 8:00 am</div>
              </div>
              <div className={styles.dateCard}>
                <div className={styles.dateCardTitle}>Monday, 12 October</div>
                <div className={styles.dateCardTime}>6:00 - 8:00 am</div>
              </div>
              <div className={styles.dateCard}>
                <div className={styles.dateCardTitle}>Tuesday, 13 October</div>
                <div className={styles.dateCardTime}>6:00 - 8:00 am</div>
              </div>
              <div className={styles.dateCard}>
                <div className={styles.dateCardTitle}>Wednesday, 14 October</div>
                <div className={styles.dateCardTime}>6:00 - 8:00 am</div>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <span className={styles.showAllDatesText}>Show all dates</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-5" />

      {/* Things to know (Full Width) */}
      <div className={styles.thingsToKnowSection}>
        <h2 className={styles.sectionTitle}>Things to know</h2>
        
        <div className="row mt-4 gy-5">
          {/* Item 1 */}
          <div className="col-md-4 pe-md-4">
             <div className={styles.infoIcon}><FiUsers size={24} /></div>
             <div className={styles.infoTitle}>Guest requirements</div>
             <div className={styles.infoDesc}>Guests aged 18 and over can attend, up to 10 guests in total.</div>
          </div>
          
          {/* Item 2 */}
          <div className="col-md-4 pe-md-4">
             <div className={styles.infoIcon}><FaWalking size={24} /></div>
             <div className={styles.infoTitle}>Activity level</div>
             <div className={styles.infoDesc}>The activity level for this experience is moderate and the skill level is beginner.</div>
          </div>
          
          {/* Item 3 */}
          <div className="col-md-4 pe-md-4">
             <div className={styles.infoIcon}><FiBriefcase size={24} /></div>
             <div className={styles.infoTitle}>What to bring</div>
             <div className={styles.infoDesc}>Please bring your student ID if you have one for reduced price tickets. Be sure to wear comfortable walking shoes and be prepared for hot weather daily</div>
          </div>
          
          {/* Item 4 */}
          <div className="col-md-4 pe-md-4">
             <div className={styles.infoIcon}><FiCheckCircle size={24} /></div>
             <div className={styles.infoTitle}>What's included</div>
             <div className={styles.infoDesc}>The host will provide speciality drinks, pickup & drop-off, public transport fares and parking.</div>
          </div>
          
          {/* Item 5 */}
          <div className="col-md-4 pe-md-4">
             <div className={styles.infoIcon}><FaWheelchair size={24} /></div>
             <div className={styles.infoTitle}>Accessibility</div>
             <div className={styles.infoDesc}>Step-free bathroom available <span className="text-decoration-underline text-dark" style={{cursor: 'pointer'}}>Learn more</span></div>
          </div>
          
          {/* Item 6 */}
          <div className="col-md-4 pe-md-4">
             <div className={styles.infoIcon}><FiCalendar size={24} /></div>
             <div className={styles.infoTitle}>Cancellation policy</div>
             <div className={styles.infoDesc}>Cancel at least 1 day before the start time for a full refund.</div>
          </div>
        </div>
      </div>

      {/* Package Modal */}
      {showPackageModal && (
        <div className={styles.sliderModalOverlay}>
          <div className={styles.sliderModalContainer}>
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
                {timelinePackages.map((pkg, index) => (
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
                {timelinePackages.map((pkg) => (
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

      {/* Schedule / Select Time Modal */}
      {showScheduleModal && (
        <div className={styles.scheduleModalOverlay}>
          <div className={styles.scheduleModalContainer}>
            
            {/* Header */}
            <div className={styles.scheduleModalHeader}>
               <h3 className="fw-bold mb-0">Select a time</h3>
               <button className={styles.scheduleModalCloseBtn} onClick={() => setShowScheduleModal(false)}>
                 <FiX size={24} />
               </button>
            </div>
            
            <div className={styles.scheduleModalConfigRow}>
               <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <div className="fw-bold" style={{fontSize: '16px'}}>1 adult</div>
                    <div className="text-decoration-underline text-muted" style={{fontSize: '14px', cursor: 'pointer'}}>Add children</div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <button className={styles.counterBtn} onClick={() => setAdultCount(Math.max(1, adultCount - 1))}><FiMinus /></button>
                    <span>{adultCount}</span>
                    <button className={styles.counterBtn} onClick={() => setAdultCount(adultCount + 1)}><FiPlus /></button>
                  </div>
               </div>
               
               <div className="d-flex justify-content-between align-items-center pb-3 border-bottom position-relative">
                  <div className="fw-bold" style={{fontSize: '16px'}}>
                    {selectedDate ? selectedDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : 'October 2026'}
                  </div>
                  <div style={{cursor: 'pointer', padding: '4px'}} onClick={() => setShowCalendarModal(true)}>
                    <FiCalendar size={20} />
                  </div>
               </div>
            </div>

            {/* Scrollable Body */}
            <div className={styles.scheduleModalBody}>
               {timeSlots.map((slot, index) => (
                 <div key={index} className="mb-4">
                    <h5 className="fw-bold mb-3" style={{fontSize: '16px'}}>{slot.day}</h5>
                    <div 
                      className={`${styles.timeSlotCard} ${selectedSlot === index ? styles.timeSlotCardSelected : ''}`}
                      onClick={() => setSelectedSlot(index)}
                    >
                       <div className="fw-bold mb-1" style={{fontSize: '16px'}}>{slot.time}</div>
                       <div className="mb-1" style={{fontSize: '14px'}}>
                         <span className="fw-bold">₹{slot.price}</span> <span className="text-muted">/ guest</span>
                       </div>
                       <div className="text-muted" style={{fontSize: '13px'}}>Private pricing available</div>
                    </div>
                 </div>
               ))}
            </div>

            {/* Sticky Footer */}
            {selectedSlot !== null && (
               <div className={styles.scheduleModalFooter}>
                  <div>
                    <div className="fw-bold" style={{fontSize: '16px'}}>₹{adultCount * 2000}</div>
                    <div className="text-muted" style={{fontSize: '14px'}}>for {adultCount} guest{adultCount > 1 ? 's' : ''}</div>
                  </div>
                  <button className={styles.scheduleNextBtn} onClick={() => {
                     setConfirmGuests(adultCount);
                     setShowScheduleModal(false);
                     setShowConfirmPayPage(true);
                  }}>Next</button>
               </div>
            )}
            
          </div>
        </div>
      )}

      {/* Calendar Modal */}
      {showCalendarModal && (
        <div className={styles.scheduleModalOverlay} style={{ zIndex: 10005 }}>
          <div className={styles.scheduleModalContainer}>
            
            {/* Header */}
            <div className={styles.scheduleModalHeader}>
               <button className={styles.scheduleModalCloseBtn} onClick={() => setShowCalendarModal(false)}>
                 <FiChevronLeft size={24} />
               </button>
               <h3 className="fw-bold mb-0 mx-auto" style={{fontSize: '18px'}}>Select dates</h3>
               <div style={{width: 32}}></div>
            </div>
            
            <div className={styles.scheduleModalBody}>
               <div className={styles.calendarWrapper}>
                 <DayPicker 
                   mode="single" 
                   selected={selectedDate} 
                   onSelect={(date) => {
                     if(date) {
                       setSelectedDate(date);
                       setShowCalendarModal(false);
                     }
                   }} 
                   numberOfMonths={3}
                 />
               </div>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
