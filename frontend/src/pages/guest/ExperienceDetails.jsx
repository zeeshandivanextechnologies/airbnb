import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaStar, FaShare, FaRegHeart, FaHeart, FaRegClock, FaWalking, FaWheelchair, FaMapMarkerAlt } from 'react-icons/fa';
import { FiMapPin, FiClipboard, FiGrid, FiUsers, FiBriefcase, FiCheckCircle, FiCalendar, FiX, FiPlus, FiMinus, FiChevronLeft } from 'react-icons/fi';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import toast from 'react-hot-toast';
import styles from '../../components/styles/ExperienceDetails.module.css';
import { 
  getStoredWishlists, 
  addWishlist, 
  isItemInAnyWishlist, 
  removeItemFromWishlists,
  trackRecentlyViewedItem 
} from '../../utils/wishlistStorage';

export default function ExperienceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useSelector((state) => state.auth || {});

  // Dynamic backend experience data state
  const [experienceData, setExperienceData] = useState(null);
  const [loadingExperience, setLoadingExperience] = useState(true);
  const [dynamicReviews, setDynamicReviews] = useState([]);

  // Wishlist and save state
  const [isSavedInWishlist, setIsSavedInWishlist] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [wishlistName, setWishlistName] = useState('');

  // Sync wishlist status across tabs and events
  useEffect(() => {
    const handleWishlistUpdate = () => {
      if (experienceData) {
        setIsSavedInWishlist(isItemInAnyWishlist(experienceData.id, experienceData.title, experienceData.category));
      }
    };
    window.addEventListener('airbnb_wishlists_updated', handleWishlistUpdate);
    return () => window.removeEventListener('airbnb_wishlists_updated', handleWishlistUpdate);
  }, [experienceData]);

  // Modals state
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showAllPhotosModal, setShowAllPhotosModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [adultCount, setAdultCount] = useState(1);
  const [clickedIndex, setClickedIndex] = useState(0);

  // Booking & Confirm payment state
  const [showConfirmPayPage, setShowConfirmPayPage] = useState(false);
  const [showEditGuestsModal, setShowEditGuestsModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showSearchAddressModal, setShowSearchAddressModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [confirmGuests, setConfirmGuests] = useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Splide refs
  const mainRef = useRef(null);
  const thumbRef = useRef(null);

  // Fetch listing data & reviews from backend
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoadingExperience(true);
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        let targetId = id;
        let fetched = null;

        if (targetId) {
          try {
            const res = await fetch(`${baseUrl}/listings/${targetId}`);
            const json = await res.json();
            if (json.success && json.data) fetched = json.data;
          } catch (e) {
            console.warn('Failed to fetch specific experience by ID:', e);
          }
        }

        // If not found or invalid id, fetch first active experience from backend
        if (!fetched) {
          try {
            const res = await fetch(`${baseUrl}/listings?type=Experience&status=Active`);
            const json = await res.json();
            if (json.success && Array.isArray(json.data) && json.data.length > 0) {
              fetched = json.data[0];
            }
          } catch (e) {
            console.warn('Failed to fetch active fallback experience:', e);
          }
        }

        if (fetched) {
          setExperienceData(fetched);
          
          // Track recently viewed
          trackRecentlyViewedItem({
            id: fetched.id,
            title: fetched.title,
            category: fetched.category || 'Experience',
            host: fetched.host_name || 'Airbnb Host',
            image: fetched.cover_img || (Array.isArray(fetched.photos) && fetched.photos[0]) || '',
            price: `₹${Number(fetched.price || 2000).toLocaleString('en-IN')}`
          });

          // Check wishlist status
          setIsSavedInWishlist(isItemInAnyWishlist(fetched.id, fetched.title, fetched.category));

          // Fetch dynamic reviews
          try {
            const revRes = await fetch(`${baseUrl}/listings/${fetched.id}/reviews`);
            const revJson = await revRes.json();
            if (revJson.success && Array.isArray(revJson.data) && revJson.data.length > 0) {
              setDynamicReviews(revJson.data);
            }
          } catch (revErr) {
            console.warn('No custom reviews found for listing:', revErr);
          }
        }
      } catch (err) {
        console.error('Error in fetchExperience:', err);
      } finally {
        setLoadingExperience(false);
      }
    };

    fetchExperience();
  }, [id]);

  useEffect(() => {
    if (
      showPackageModal || 
      showScheduleModal || 
      showCalendarModal || 
      showAllPhotosModal || 
      showWishlistModal ||
      showEditGuestsModal ||
      showLocationModal ||
      showSearchAddressModal ||
      showCouponModal
    ) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [
    showPackageModal, 
    showScheduleModal, 
    showCalendarModal, 
    showAllPhotosModal, 
    showWishlistModal,
    showEditGuestsModal,
    showLocationModal,
    showSearchAddressModal,
    showCouponModal
  ]);

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

  // Default fallback packages if not provided by host itinerary
  const defaultTimelinePackages = [
    {
      id: 1,
      title: "Travel to forts & scenic trail",
      img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=720&q=80",
      desc: "Find secret forts in the Nahargarh range and discover hidden heritage vantage points.",
      meta: "45 mins"
    },
    {
      id: 2,
      title: "Watch the golden sun rise",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=720&q=80",
      desc: "Glimpse the dawn over historic ramparts Amer and Jaigarh Forts.",
      meta: "30 mins"
    },
    {
      id: 3,
      title: "Bird watching & photography",
      img: "https://images.unsplash.com/photo-1516598540642-e8f40a09d939?w=720&q=80",
      desc: "Observe native and migratory bird species with expert guidance.",
      meta: "1 hr"
    },
    {
      id: 4,
      title: "Local folklore & heritage stories",
      img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=720&q=80",
      desc: "Learn the rich history and age-old mountain range tales from your local host.",
      meta: "30 mins"
    },
    {
      id: 5,
      title: "Enjoy traditional breakfast / refreshments",
      img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=720&q=80",
      desc: "Recharge with fresh, authentic local delicacies and tea.",
      meta: "45 mins"
    }
  ];

  const defaultExperienceReviews = [
    {
      id: 1,
      name: "Peter",
      loc: "England, United Kingdom",
      img: "https://randomuser.me/api/portraits/men/33.jpg",
      rating: 5,
      date: "1 week ago",
      text: "We had such a brilliant time! It was so reassuring to have someone guiding us around with such passion. Truly an unforgettable highlight."
    },
    {
      id: 2,
      name: "Tomi",
      loc: "Kuta, Indonesia",
      img: "https://randomuser.me/api/portraits/men/44.jpg",
      rating: 5,
      date: "September 2026",
      text: "Friendly, highly informative and well coordinated. Highly recommended for anyone wanting authentic cultural immersion!"
    },
    {
      id: 3,
      name: "Andrés Joel",
      loc: "Mexico City, Mexico",
      img: "https://randomuser.me/api/portraits/men/55.jpg",
      rating: 5,
      date: "September 2026",
      text: "The tour was fabulous. The guide knows the subject and explains it with a lot of patience. 10/10."
    },
    {
      id: 4,
      name: "Prisca",
      loc: "Lyon, France",
      img: "https://randomuser.me/api/portraits/women/77.jpg",
      rating: 5,
      date: "August 2026",
      text: "We had a great day, and this visit far exceeded our expectations. The guide was punctual, knowledgeable, and caring."
    }
  ];

  // Derive dynamic properties from backend experienceData with fallbacks
  const expTitle = experienceData?.title || "Hike/Trek/Nature Walk with sunrise views & Birding";
  const expCity = experienceData?.city || "Jaipur";
  const expCategory = experienceData?.category || "Outdoors";
  const expHostName = experienceData?.host_name || "Harshit";
  const expHostIntro = experienceData?.host_intro || experienceData?.description || "Professional Guide & Local Host";
  const expDescription = experienceData?.description || "Hike through the local trails, finding breathtaking views, and rare experiences.";
  const expPriceNum = Number(experienceData?.price) || 2000;
  // Calculate dynamic average rating and count
  const expReviewsCount = dynamicReviews.length > 0 ? dynamicReviews.length : (Number(experienceData?.reviews_count) || 46);
  const calculatedAvgRating = dynamicReviews.length > 0 
    ? (dynamicReviews.reduce((sum, r) => sum + (parseFloat(r.rating) || 5), 0) / dynamicReviews.length).toFixed(2)
    : (Number(experienceData?.rating) || 4.95).toFixed(2);
  const expRatingNum = Number(calculatedAvgRating);
  
  const expPhotos = Array.isArray(experienceData?.photos) && experienceData.photos.length > 0 
    ? experienceData.photos 
    : [
        experienceData?.cover_img || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=720&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=720&q=80",
        "https://images.unsplash.com/photo-1516598540642-e8f40a09d939?w=720&q=80",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=720&q=80"
      ];

  // Parse itinerary packages
  let dynamicTimelinePackages = defaultTimelinePackages;
  if (Array.isArray(experienceData?.itinerary) && experienceData.itinerary.length > 0) {
    dynamicTimelinePackages = experienceData.itinerary.map((it, idx) => ({
      id: idx + 1,
      title: it.title || `Activity ${idx + 1}`,
      img: it.photo || expPhotos[idx % expPhotos.length] || defaultTimelinePackages[idx % defaultTimelinePackages.length].img,
      desc: it.desc || "Experience activity led by host.",
      meta: it.duration ? `${it.duration} mins` : "45 mins"
    }));
  }

  // Parse dynamic time slots / business hours
  let timeSlots = [
    { day: "Tomorrow, " + new Date(Date.now() + 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), time: "9:00 am – 12:00 pm", price: expPriceNum },
    { day: "Day after, " + new Date(Date.now() + 172800000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), time: "2:00 pm – 5:00 pm", price: expPriceNum },
    { day: "Weekend slot", time: "8:00 am – 11:00 am", price: expPriceNum },
    { day: "Evening slot", time: "4:00 pm – 7:00 pm", price: expPriceNum }
  ];

  if (Array.isArray(experienceData?.business_hours) && experienceData.business_hours.length > 0) {
    timeSlots = experienceData.business_hours.map((bh, idx) => ({
      day: bh.day || `Slot ${idx + 1}`,
      time: `${bh.open || '9:00 am'} – ${bh.close || '12:00 pm'}`,
      price: expPriceNum
    }));
  }

  // Reviews to display - handles both DB schema (reviewer_name/review_text) and custom schema
  const displayReviews = dynamicReviews.length > 0 ? dynamicReviews.map((r, i) => ({
    id: r.id || i + 1,
    name: r.reviewer_name || r.author_name || r.guest_name || 'Verified Guest',
    loc: r.reviewer_location || r.author_location || expCity || 'India',
    img: r.reviewer_avatar || r.author_avatar || `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${30 + (i % 50)}.jpg`,
    rating: Number(r.rating) || 5,
    date: r.created_at ? new Date(r.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : 'Recently',
    text: r.review_text || r.comment || r.content || 'Exceptional experience with great hospitality!'
  })) : defaultExperienceReviews;

  // Pricing calculations
  const guests = adultCount;
  const setGuests = setAdultCount;
  const selectedPkg = dynamicTimelinePackages[clickedIndex] || dynamicTimelinePackages[0];
  const selectedTimePill = timeSlots[selectedSlot !== null ? selectedSlot : 0];
  const subTotal = (confirmGuests || guests || 1) * expPriceNum;
  const discountAmount = appliedCoupon?.discountAmount ? Number(appliedCoupon.discountAmount) : 0;
  const finalTotalAmount = Math.max(1, subTotal - discountAmount);
  const minPrice = "₹" + finalTotalAmount.toLocaleString('en-IN');

  // Meetup location text
  const meetupText = experienceData?.meetup_address?.address || 
    (experienceData?.city ? `${experienceData.city}, India` : 'Jaipur, Rajasthan, 302006');

  // Heart wishlist toggle
  const handleToggleWishlist = () => {
    if (!experienceData) return;
    const cat = expCategory || 'Experiences';
    if (isSavedInWishlist) {
      removeItemFromWishlists(experienceData.id, expTitle, cat);
      setIsSavedInWishlist(false);
      toast.success('Removed from wishlist');
    } else {
      setWishlistName(expCategory || 'My Wishlist');
      setShowWishlistModal(true);
    }
  };

  const handleSaveToWishlist = () => {
    if (!wishlistName.trim() || !experienceData) return;
    addWishlist(wishlistName.trim(), {
      id: experienceData.id,
      title: expTitle,
      category: expCategory,
      host: expHostName,
      image: expPhotos[0],
      price: `₹${expPriceNum.toLocaleString('en-IN')}`
    });
    setIsSavedInWishlist(true);
    setShowWishlistModal(false);
    toast.success(`Saved to "${wishlistName.trim()}"!`);
  };

  // Share handler
  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        toast.success('Link copied to clipboard!');
      }).catch(() => toast.success('Link copied to clipboard!'));
    } else {
      toast.success('Link copied to clipboard!');
    }
  };

  // Coupon handling
  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    try {
      setIsApplyingCoupon(true);
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const res = await fetch(`${baseUrl}/coupons/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCodeInput.trim(),
          bookingAmount: subTotal
        })
      });
      const data = await res.json();
      if (data.success && data.coupon) {
        setAppliedCoupon(data.coupon);
        setShowCouponModal(false);
        setCouponCodeInput('');
        toast.success(data.message || `Coupon "${data.coupon.code}" applied!`);
      } else {
        toast.error(data.message || 'Invalid coupon code. Please try again.');
      }
    } catch (err) {
      toast.error('Failed to apply coupon. Please check connection.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Razorpay Payment Handler
  const handleRazorpayPayment = async () => {
    try {
      setIsProcessingPayment(true);
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

      const orderPayload = {
        amount: finalTotalAmount,
        listingId: experienceData?.id || (id && !isNaN(Number(id)) ? Number(id) : null),
        listingTitle: expTitle,
        packageTitle: selectedPkg?.title || 'Selected Experience',
        guestsCount: confirmGuests || guests || 1,
        hostName: expHostName,
        location: meetupText,
        bookingDate: selectedDate.toISOString(),
        bookingTime: selectedTimePill?.time || '9:00 am',
        guestName: authUser ? `${authUser.firstName || authUser.first_name || ''} ${authUser.lastName || authUser.last_name || ''}`.trim() : 'Guest User',
        guestEmail: authUser?.email || 'guest@example.com',
        guestPhone: authUser?.phone || '+91 98765 43210',
        userId: authUser?.id || null
      };

      const res = await fetch(`${baseUrl}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const orderData = await res.json();
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to initiate booking payment');
      }

      if (!window.Razorpay) {
        toast.success('Reservation initiated successfully!');
        const bCode = orderData.bookingCode || orderData.booking?.booking_code;
        if (bCode) navigate(`/booking-confirmed/${bCode}`);
        setIsProcessingPayment(false);
        return;
      }

      const options = {
        key: orderData.key || 'rzp_test_ToafKH36vIRD5L',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Airbnb Experience Booking',
        description: `${expTitle} with ${expHostName}`,
        image: expPhotos[0] || '/favicon.png',
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${baseUrl}/payments/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingCode: orderData.bookingCode
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              toast.success('🎉 Booking Confirmed & Paid Successfully!');
              setShowConfirmPayPage(false);
              const bCode = verifyData.bookingCode || orderData.bookingCode;
              navigate(`/booking-confirmed/${bCode}`);
            } else {
              toast.error(verifyData.message || 'Payment verification failed');
            }
          } catch (err) {
            console.error('Verify error:', err);
            toast.error('Network error verifying payment.');
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: authUser ? `${authUser.firstName || ''} ${authUser.lastName || ''}`.trim() : 'Guest User',
          email: authUser?.email || 'guest@example.com',
          contact: authUser?.phone || '9876543210'
        },
        theme: {
          color: '#ff385c'
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
            toast('Payment cancelled', { icon: 'ℹ️' });
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error(`Payment Failed: ${response.error.description || 'Unknown error'}`);
        setIsProcessingPayment(false);
      });
      rzp.open();
    } catch (err) {
      console.error('Booking checkout error:', err);
      toast.error(err.message || 'Payment initiation failed');
      setIsProcessingPayment(false);
    }
  };

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
            <p className={styles.proceedPaymentDesc}>You'll be directed to Razorpay to complete your secure payment.</p>
            <p className={styles.termsText}>By selecting the button, I agree to the booking terms and host cancellation policies. <span className={styles.linkText}>View Privacy Policy.</span></p>
            <button 
              className={styles.primaryActionBtn} 
              onClick={handleRazorpayPayment}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? 'Processing...' : 'Confirm and pay with Razorpay'}
            </button>
          </div>

          <div className="col-lg-6">
            <div className={styles.summaryCard}>
              <div className={styles.summaryTop}>
                <img src={selectedPkg.img} alt="Package" className={styles.summaryImg} />
                <div className={styles.summaryTopRight}>
                  <h4 className={styles.summaryPkgTitle}>{selectedPkg.title}</h4>
                  <p className={styles.summaryPkgSub}>{expTitle} by {expHostName}</p>
                </div>
              </div>

              <hr className={styles.summaryDivider} />

              <div className={styles.summarySection}>
                <h5 className={styles.summarySecTitle}>Free cancellation</h5>
                <p className={styles.summarySecDesc}>
                  Cancel at least 1 day before the scheduled session for a full refund.
                </p>
              </div>

              <hr className={styles.summaryDivider} />

              <div className={styles.summarySection}>
                <h5 className={styles.summarySecTitle}>Date & Time</h5>
                <p className={styles.summarySecDesc}>
                  {selectedDate.toLocaleDateString('default', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}<br/>
                  {selectedTimePill?.time}
                </p>
              </div>

              <hr className={styles.summaryDivider} />

              <div className={styles.summaryFlexRow}>
                <div>
                  <h5 className={styles.summarySecTitle}>Guests</h5>
                  <p className={styles.summarySecDesc}>{confirmGuests || guests} guest{(confirmGuests || guests) > 1 ? 's' : ''}</p>
                </div>
                <button className={styles.changeBtn} onClick={() => { setConfirmGuests(guests); setShowEditGuestsModal(true); }}>Change</button>
              </div>

              <hr className={styles.summaryDivider} />

              <div className={styles.summaryFlexRow}>
                <div>
                  <h5 className={styles.summarySecTitle}>Location</h5>
                  <p className={styles.summarySecDesc}>{meetupText}</p>
                </div>
                <button className={styles.changeBtn} onClick={() => setShowLocationModal(true)}>View</button>
              </div>

              <hr className={styles.summaryDivider} />

              <div className={styles.summarySection}>
                <h5 className={styles.summarySecTitle}>Price details</h5>
                <div className={styles.priceRow}>
                  <span>{confirmGuests || guests} guest × ₹{expPriceNum.toLocaleString('en-IN')}</span>
                  <span>₹{subTotal.toLocaleString('en-IN')}</span>
                </div>
                {appliedCoupon && (
                  <div className={styles.priceRow} style={{ color: '#16a34a', fontWeight: '600' }}>
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
              
              <div className={styles.couponSection} onClick={() => setShowCouponModal(true)}>
                {appliedCoupon ? `Applied: ${appliedCoupon.code} (Click to change)` : 'Enter a coupon code'}
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
                <h2 className="fw-bold mb-0 mx-auto" style={{ fontSize: '18px' }}>Edit guests</h2>
                <button className={styles.scheduleModalCloseBtn} onClick={() => setShowEditGuestsModal(false)}>
                  <FiX size={24} />
                </button>
              </div>
              <div className={styles.scheduleModalConfigRow} style={{ paddingTop: '24px' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span style={{ fontSize: '16px', fontWeight: 600 }}>{confirmGuests} guest{confirmGuests > 1 ? 's' : ''}</span>
                  <div className="d-flex align-items-center gap-3">
                    <button className={styles.counterBtn} onClick={() => setConfirmGuests(Math.max(1, confirmGuests - 1))}><FiMinus /></button>
                    <span>{confirmGuests}</span>
                    <button className={styles.counterBtn} onClick={() => setConfirmGuests(confirmGuests + 1)}><FiPlus /></button>
                  </div>
                </div>
              </div>
              <div className={styles.scheduleModalFooter}>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>
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
                <h2 className={styles.locationModalTitle}>Meetup & Session Location</h2>
                <div className={styles.locationItem}>
                  <div className={styles.locIconWrapper}><FaMapMarkerAlt className={styles.locIcon} /></div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className={styles.locText}>{meetupText}</span>
                  </div>
                </div>
              </div>
              <div className={styles.locationFooter}>
                <button className={styles.scheduleNextBtn} onClick={() => setShowLocationModal(false)}>Got it</button>
              </div>
            </div>
          </div>
        )}

        {/* Coupon Modal */}
        {showCouponModal && (
          <div className={styles.scheduleModalOverlay}>
            <div className={styles.scheduleModalContainer}>
              <div className={styles.scheduleModalHeader}>
                <h2 className="fw-bold mb-0 mx-auto" style={{ fontSize: '18px' }}>Coupons</h2>
                <button className={styles.scheduleModalCloseBtn} onClick={() => setShowCouponModal(false)}>
                  <FiX size={24} />
                </button>
              </div>
              <div className={styles.scheduleModalBody} style={{ display: 'flex', flexDirection: 'column', paddingTop: '24px' }}>
                <label className={styles.couponLabel}>Add a promotional code</label>
                <input 
                  type="text" 
                  className={styles.couponInput} 
                  placeholder="e.g. WELCOME10, SUMMER20" 
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value)}
                />
              </div>
              <div className={styles.scheduleModalFooter} style={{ justifyContent: 'space-between' }}>
                <button className={styles.cancelBtn} onClick={() => setShowCouponModal(false)}>Cancel</button>
                <button 
                  className={styles.scheduleNextBtn} 
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon}
                >
                  {isApplyingCoupon ? 'Applying...' : 'Apply Coupon'}
                </button>
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
      <div className="row align-items-center mb-lg-5 pb-lg-5 mb-3 pb-3 border-bottom ">
        {/* Left Column: Image Grid */}
        <div className="col-lg-6 mb-4 mb-lg-0">
          <div className={styles['photo-grid-2x2']}>
            <img 
              src={expPhotos[0]} 
              alt="Experience main photo" 
              className={`${styles['grid-img']} ${styles['grid-img-1']}`} 
              onClick={() => setShowAllPhotosModal(true)}
              style={{ cursor: 'pointer' }}
            />
            <img 
              src={expPhotos[1] || expPhotos[0]} 
              alt="Experience photo 2" 
              className={`${styles['grid-img']} ${styles['grid-img-2']}`} 
              onClick={() => setShowAllPhotosModal(true)}
              style={{ cursor: 'pointer' }}
            />
            <img 
              src={expPhotos[2] || expPhotos[0]} 
              alt="Experience photo 3" 
              className={`${styles['grid-img']} ${styles['grid-img-3']}`} 
              onClick={() => setShowAllPhotosModal(true)}
              style={{ cursor: 'pointer' }}
            />
            <div className={`${styles['grid-img-wrapper']} ${styles['grid-img-4']}`}>
              <img 
                src={expPhotos[3] || expPhotos[0]} 
                alt="Experience photo 4" 
                className={`${styles['grid-img']} ${styles['grid-img-4']}`} 
                onClick={() => setShowAllPhotosModal(true)}
                style={{ cursor: 'pointer' }}
              />
              <div 
                className={styles['show-all-photos-btn']}
                onClick={() => setShowAllPhotosModal(true)}
                title="View all photos"
              >
                <FiGrid size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Title and Details */}
        <div className="col-lg-6 d-flex flex-column align-items-center justify-content-center pt-lg-5">
          <div className={styles['details-wrapper']}>
            
            <h1 className="fw-bold text-center mb-3" style={{ fontSize: '32px', lineHeight: '1.2' }}>
              {expTitle}
            </h1>
            
            <p className="text-center text-muted mb-4" style={{ fontSize: '15px' }}>
              {expDescription}
            </p>
            
            <div className="d-flex justify-content-center align-items-center gap-1 mb-1" style={{ fontSize: '13px', fontWeight: '600' }}>
              <FaStar size={12} color="#ff385c" /> {expRatingNum.toFixed(2)}
              <span className="mx-1">·</span>
              <span className="text-decoration-underline">{expReviewsCount} ratings</span>
            </div>
            
            <div className="d-flex justify-content-center gap-1 mb-4 text-muted" style={{ fontSize: '13px' }}>
              <span>{expCity}</span>
              <span className="mx-1">·</span>
              <span>{expCategory}</span>
            </div>
            
            <div className="d-flex justify-content-center gap-4 mb-lg-5 mb-3">
              <button 
                type="button" 
                className="btn btn-link text-dark p-0" 
                onClick={handleShare}
                title="Share experience link"
              >
                <FaShare size={18} />
              </button>
              <button 
                type="button" 
                className={`btn btn-link p-0 ${isSavedInWishlist ? styles.heartActive : 'text-dark'}`}
                onClick={handleToggleWishlist}
                title={isSavedInWishlist ? 'Saved in wishlist' : 'Save to wishlist'}
              >
                {isSavedInWishlist ? <FaHeart size={18} color="#ff385c" /> : <FaRegHeart size={18} />}
              </button>
            </div>

            {/* List Items */}
            <div className="d-flex flex-column gap-4">
              <div className="d-flex align-items-center gap-3">
                <img 
                  src={experienceData?.host_avatar || "https://randomuser.me/api/portraits/men/32.jpg"} 
                  alt="Host" 
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                <div>
                  <div className="fw-bold" style={{ fontSize: '15px' }}>Hosted by {expHostName}</div>
                  <div className="text-muted" style={{ fontSize: '13px' }}>{expHostIntro}</div>
                </div>
              </div>
              
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center bg-light" style={{ width: '48px', height: '48px', borderRadius: '50%' }}>
                  <FiMapPin size={20} />
                </div>
                <div>
                  <div className="fw-bold" style={{ fontSize: '15px' }}>{expCity}</div>
                  <div className="text-muted" style={{ fontSize: '13px' }}>India</div>
                </div>
              </div>
              
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center bg-light" style={{ width: '48px', height: '48px', borderRadius: '50%' }}>
                  <FaRegClock size={20} />
                </div>
                <div>
                  <div className="fw-bold" style={{ fontSize: '15px' }}>Experience Session</div>
                  <div className="text-muted" style={{ fontSize: '13px' }}>
                    Hosted in {experienceData?.languages ? (Array.isArray(experienceData.languages) ? experienceData.languages.join(', ') : experienceData.languages) : 'English, Hindi'}
                  </div>
                </div>
              </div>
              
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center bg-light" style={{ width: '48px', height: '48px', borderRadius: '50%' }}>
                  <FiClipboard size={20} />
                </div>
                <div>
                  <div className="fw-bold" style={{ fontSize: '15px' }}>What's included</div>
                  <div className="text-muted" style={{ fontSize: '13px' }}>
                    {Array.isArray(experienceData?.amenities) && experienceData.amenities.length > 0
                      ? experienceData.amenities.join(', ')
                      : 'Equipment & Host guidance'}
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="row">
        <div className="col-lg-7 pe-lg-5 mb-3">
          <h2 className="mb-3 fw-bold" style={{ fontSize: '22px' }}>What you'll do</h2>
          <div className={styles.packagesContainer}>
            {dynamicTimelinePackages.map((pkg, index) => (
              <div key={pkg.id || index} className={styles.packageCard} onClick={() => openPackageModal(index)}>
                 <img src={pkg.img} alt={pkg.title} className={styles.packageImg} />
                 <div className={styles.packageDetails}>
                    <h4 className={styles.packageTitle}>{pkg.title}</h4>
                    <p className={styles.packageDesc}>{pkg.desc}</p>
                    {/* <div className={styles.packageMeta}>{pkg.meta}</div> */}
                 </div>
              </div>
            ))}
          </div>

          <hr className="my-lg-5 my-3" />

          {/* Reviews Section */}
          <div className={styles.reviewsSection}>
             <h2 className={styles.reviewsTitle}>
               <FaStar size={20} className="me-2 mb-1" /> 
               {expRatingNum.toFixed(1)} · {expReviewsCount} ratings
             </h2>
             
             <div className="row">
                {displayReviews.map((review) => (
                   <div key={review.id} className="col-md-6 mb-3">
                      <div className={styles.reviewCard}>
                         <div className={styles.reviewerHeader}>
                            <img 
                              src={review.img} 
                              className={styles.reviewerImg} 
                              alt={review.name} 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://randomuser.me/api/portraits/men/33.jpg';
                              }}
                            />
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

          <hr className="my-lg-5 my-3" />

          {/* Where we'll meet */}
          <div className={styles.locationSection}>
             <h2 className={styles.sectionTitle}>Where we'll meet</h2>
             <div className="mb-4">
                <div style={{ fontSize: '16px', color: '#222' }}>{meetupText}</div>
                <div style={{ fontSize: '15px', color: '#717171' }}>{expCity}, India</div>
             </div>
             
             <div className={styles.mapContainer}>
                <iframe 
                  src={`https://www.google.com/maps?q=${encodeURIComponent(meetupText)}&output=embed`}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Meetup Location"
                ></iframe>
             </div>
          </div>

          <hr className="my-lg-5 my-3" />

          {/* About me */}
          <div className={styles.aboutMeSection}>
             <h2 className={styles.sectionTitle}>About me</h2>
             
             <div className="row mt-4">
                <div className="col-md-5 mb-4 mb-md-0 d-flex flex-column align-items-center">
                   <div className={styles.hostCard}>
                      <img src={experienceData?.host_avatar || "https://randomuser.me/api/portraits/men/32.jpg"} alt="Host" className={styles.hostCardImg} />
                      <div className={styles.hostCardName}>{expHostName}</div>
                      <div className={styles.hostCardTagline}>{expHostIntro}</div>
                   </div>
                   
                   <button 
                     type="button" 
                     className={styles.messageHostBtn}
                     onClick={() => {
                       navigate(`/hosting/messages`);
                     }}
                   >
                     Message {expHostName}
                   </button>
                   
                   <p className={styles.protectionText}>
                     To help protect your payment, always use Airbnb to send money and<br/>communicate with hosts.
                   </p>
                </div>
                
                <div className="col-md-7 ps-md-4">
                   <div className={styles.hostBio}>
                      {experienceData?.host_intro || experienceData?.description || "Hello traveler! I love showing my clients the beauty of our local culture and spots from an authentic perspective. I am excited to host you and make sure you have the best possible experience!"}
                   </div>
                </div>
             </div>
          </div>
          
        </div>

        {/* Right Column: Sticky Booking Widget */}
        <div className="col-lg-5 position-relative ps-lg-4">
          <div className={styles.stickyBookingWidget}>
            <div className="d-flex justify-content-between align-items-start mb-lg-4 mb-0">
              <div>
                <div className={styles.bookingPrice}>
                  From <span className="text-decoration-underline fw-bold">₹{expPriceNum.toLocaleString('en-IN')}</span> <span className="text-muted fw-normal" style={{ fontSize: '14px' }}>/ guest</span>
                </div>
                <div className={styles.bookingFreeCancel}>Free cancellation</div>
              </div>
              <button className={styles.bookingShowDatesBtn} onClick={() => setShowScheduleModal(true)}>Show dates</button>
            </div>
            
            <hr className={styles.widgetDivider} />
            
            <div className={styles.dateCardsList}>
              {timeSlots.map((slot, index) => (
                <div 
                  key={index} 
                  className={styles.dateCard}
                  onClick={() => {
                    setSelectedSlot(index);
                    setShowScheduleModal(true);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.dateCardTitle}>{slot.day}</div>
                  <div className={styles.dateCardTime}>{slot.time}</div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-4">
              <span className={styles.showAllDatesText} onClick={() => setShowScheduleModal(true)}>Show all dates</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-lg-5 my-3" />

      {/* Things to know (Full Width) */}
      <div className={styles.thingsToKnowSection}>
        <h2 className={styles.sectionTitle}>Things to know</h2>
        
        <div className="row mt-3">
          <div className="col-md-4 pe-md-4 mb-3">
             <div className={styles.infoIcon}><FiUsers size={24} /></div>
             <div className={styles.infoTitle}>Guest requirements</div>
             <div className={styles.infoDesc}>
               Guests aged {experienceData?.min_age || 18} and over can attend, up to {experienceData?.max_guests || 10} guests in total.
             </div>
          </div>
          
          <div className="col-md-4 pe-md-4 mb-3">
             <div className={styles.infoIcon}><FaWalking size={24} /></div>
             <div className={styles.infoTitle}>Activity level</div>
             <div className={styles.infoDesc}>The activity level for this experience is beginner to moderate.</div>
          </div>
          
          <div className="col-md-4 pe-md-4 mb-3">
             <div className={styles.infoIcon}><FiBriefcase size={24} /></div>
             <div className={styles.infoTitle}>What to bring</div>
             <div className={styles.infoDesc}>Be sure to wear comfortable walking shoes and bring your positive energy.</div>
          </div>
          
          <div className="col-md-4 pe-md-4 mb-3">
             <div className={styles.infoIcon}><FiCheckCircle size={24} /></div>
             <div className={styles.infoTitle}>What's included</div>
             <div className={styles.infoDesc}>
               {Array.isArray(experienceData?.amenities) && experienceData.amenities.length > 0 
                 ? experienceData.amenities.join(', ')
                 : 'Host guidance, equipment, and tailored itinerary.'}
             </div>
          </div>
          
          <div className="col-md-4 pe-md-4 mb-3">
             <div className={styles.infoIcon}><FaWheelchair size={24} /></div>
             <div className={styles.infoTitle}>Accessibility</div>
             <div className={styles.infoDesc}>
               {Array.isArray(experienceData?.accessibility_features) && experienceData.accessibility_features.length > 0
                 ? experienceData.accessibility_features.join(', ')
                 : 'Accessible paths and host assistance available upon request.'}
             </div>
          </div>
          
          <div className="col-md-4 pe-md-4 mb-3">
             <div className={styles.infoIcon}><FiCalendar size={24} /></div>
             <div className={styles.infoTitle}>Cancellation policy</div>
             <div className={styles.infoDesc}>
               Cancel at least {experienceData?.cancellation_policy || '1 day'} prior for a full refund.
             </div>
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
                {dynamicTimelinePackages.map((pkg, index) => (
                  <SplideSlide key={`thumb-${pkg.id || index}`}>
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
                {dynamicTimelinePackages.map((pkg, index) => (
                  <SplideSlide key={`main-${pkg.id || index}`}>
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
                    <div className="fw-bold" style={{ fontSize: '16px' }}>{adultCount} guest{adultCount > 1 ? 's' : ''}</div>
                    <div className="text-muted" style={{ fontSize: '13px' }}>Max capacity: {experienceData?.max_guests || 10}</div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <button className={styles.counterBtn} onClick={() => setAdultCount(Math.max(1, adultCount - 1))}><FiMinus /></button>
                    <span>{adultCount}</span>
                    <button className={styles.counterBtn} onClick={() => setAdultCount(Math.min(experienceData?.max_guests || 20, adultCount + 1))}><FiPlus /></button>
                  </div>
               </div>
               
               <div className="d-flex justify-content-between align-items-center pb-3 border-bottom position-relative">
                  <div className="fw-bold" style={{ fontSize: '16px' }}>
                    {selectedDate ? selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Select Date'}
                  </div>
                  <div style={{ cursor: 'pointer', padding: '4px' }} onClick={() => setShowCalendarModal(true)}>
                    <FiCalendar size={20} />
                  </div>
               </div>
            </div>

            {/* Scrollable Body */}
            <div className={styles.scheduleModalBody}>
               {timeSlots.map((slot, index) => (
                 <div key={index} className="mb-4">
                    <h5 className="fw-bold mb-3" style={{ fontSize: '16px' }}>{slot.day}</h5>
                    <div 
                      className={`${styles.timeSlotCard} ${selectedSlot === index ? styles.timeSlotCardSelected : ''}`}
                      onClick={() => setSelectedSlot(index)}
                    >
                       <div className="fw-bold mb-1" style={{ fontSize: '16px' }}>{slot.time}</div>
                       <div className="mb-1" style={{ fontSize: '14px' }}>
                         <span className="fw-bold">₹{Number(slot.price).toLocaleString('en-IN')}</span> <span className="text-muted">/ guest</span>
                       </div>
                       <div className="text-muted" style={{ fontSize: '13px' }}>Instant confirmation available</div>
                    </div>
                 </div>
               ))}
            </div>

            {/* Sticky Footer */}
            {selectedSlot !== null && (
               <div className={styles.scheduleModalFooter}>
                  <div>
                    <div className="fw-bold" style={{ fontSize: '16px' }}>₹{(adultCount * expPriceNum).toLocaleString('en-IN')}</div>
                    <div className="text-muted" style={{ fontSize: '14px' }}>for {adultCount} guest{adultCount > 1 ? 's' : ''}</div>
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
            <div className={styles.scheduleModalHeader}>
               <button className={styles.scheduleModalCloseBtn} onClick={() => setShowCalendarModal(false)}>
                 <FiChevronLeft size={24} />
               </button>
               <h3 className="fw-bold mb-0 mx-auto" style={{ fontSize: '18px' }}>Select date</h3>
               <div style={{ width: 32 }}></div>
            </div>
            
            <div className={styles.scheduleModalBody}>
               <div className={styles.calendarWrapper}>
                 <DayPicker 
                   mode="single" 
                   selected={selectedDate} 
                   onSelect={(date) => {
                     if (date) {
                       setSelectedDate(date);
                       setShowCalendarModal(false);
                     }
                   }} 
                   numberOfMonths={1}
                 />
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen All Photos Modal */}
      {showAllPhotosModal && (
        <div className={styles.galleryModalOverlay}>
          <div className={styles.galleryModalHeader}>
            <button 
              type="button" 
              className={styles.galleryModalCloseBtn} 
              onClick={() => setShowAllPhotosModal(false)}
            >
              <FiX size={24} />
            </button>
            <span style={{ fontWeight: '700', fontSize: '16px' }}>Photos ({expPhotos.length})</span>
            <div style={{ width: 32 }}></div>
          </div>
          <div className={styles.galleryGridContainer}>
            {expPhotos.map((photoUrl, idx) => (
              <img 
                key={idx} 
                src={photoUrl} 
                alt={`Photo ${idx + 1}`} 
                className={styles.galleryModalImg} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Wishlist Modal */}
      {showWishlistModal && (
        <div className={styles.scheduleModalOverlay}>
          <div className={styles.scheduleModalContainer}>
            <div className={styles.scheduleModalHeader}>
              <h3 className="fw-bold mb-0 mx-auto" style={{ fontSize: '18px' }}>Name this wishlist</h3>
              <button 
                type="button" 
                className={styles.scheduleModalCloseBtn} 
                onClick={() => setShowWishlistModal(false)}
              >
                <FiX size={24} />
              </button>
            </div>
            <div className={styles.scheduleModalBody} style={{ paddingTop: '24px' }}>
              <input 
                type="text" 
                className={styles.addressInput}
                value={wishlistName}
                onChange={(e) => setWishlistName(e.target.value)}
                autoFocus
                placeholder="e.g. Jaipur Experience, Nature Walk"
              />
            </div>
            <div className={styles.scheduleModalFooter} style={{ justifyContent: 'space-between' }}>
              <button className={styles.cancelBtn} onClick={() => setShowWishlistModal(false)}>Cancel</button>
              <button 
                className={styles.scheduleNextBtn} 
                onClick={handleSaveToWishlist}
                disabled={!wishlistName.trim()}
              >
                Create & Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
