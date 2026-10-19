import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FaStar, FaShare, FaHeart, FaUserFriends, FaWheelchair, FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import { FiCamera, FiAward, FiBook, FiUpload } from 'react-icons/fi';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from './ServiceDetails.module.css';
import { trackRecentlyViewedItem } from '../../utils/wishlistStorage';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const defaultPackages = [
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

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState(defaultPackages);

  const defaultPortfolioImages = [
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1080&q=80",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1080&q=80",
    "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1080&q=80"
  ];
  const [portfolioImages, setPortfolioImages] = useState(defaultPortfolioImages);

  const [showPackageModal, setShowPackageModal] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(0);
  const mainRef = useRef(null);
  const thumbRef = useRef(null);

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
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [confirmGuests, setConfirmGuests] = useState(guests);
  const [isLiked, setIsLiked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showReviewsModal, setShowReviewsModal] = useState(false);

  // Apply Coupon with Backend API Verification
  const handleApplyCoupon = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!couponCodeInput.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    try {
      setIsApplyingCoupon(true);
      const selectedPkg = selectedTimePill ? packages.find(p => p.id === selectedTimePill.pkgId) : packages[0];
      const pkgPrice = selectedPkg?.rawPrice || Number(listing?.price) || 2000;
      const currentBookingTotal = pkgPrice * (confirmGuests || guests || 1);

      const res = await fetch(`${baseUrl}/coupons/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCodeInput.trim(),
          bookingAmount: currentBookingTotal
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

  // Remove applied coupon
  const handleRemoveCoupon = () => {
    if (appliedCoupon) {
      const removedCode = appliedCoupon.code;
      setAppliedCoupon(null);
      toast.success(`Coupon "${removedCode}" removed`);
    }
  };

  // Fetch listing data from backend
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        let fetchedItem = null;

        if (id && !isNaN(Number(id))) {
          const res = await fetch(`${baseUrl}/listings/${id}`);
          const data = await res.json();
          if (data.success && data.data) {
            fetchedItem = data.data;
          }
        }

        // If not found by direct ID or ID wasn't numeric, fetch latest service listing or fallback
        if (!fetchedItem) {
          const allRes = await fetch(`${baseUrl}/listings?status=all`);
          const allData = await allRes.json();
          if (allData.success && Array.isArray(allData.data) && allData.data.length > 0) {
            // Find service listing
            const found = allData.data.find(l => String(l.id) === String(id)) ||
              allData.data.find(l => (l.type || '').toLowerCase().includes('service')) ||
              allData.data[0];
            fetchedItem = found;
          }
        }

        if (fetchedItem) {
          setListing(fetchedItem);

          // Track in dynamic Recently viewed wishlist
          trackRecentlyViewedItem({
            id: fetchedItem.id,
            title: fetchedItem.title,
            category: fetchedItem.category || 'Services',
            host: fetchedItem.host_name || 'Airbnb Host',
            image: fetchedItem.cover_img || (Array.isArray(fetchedItem.photos) && fetchedItem.photos[0]) || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=720&q=80',
            price: `₹${Number(fetchedItem.price).toLocaleString('en-IN')}`
          });

          // Parse offerings
          let rawOfferings = fetchedItem.service_offerings;
          if (typeof rawOfferings === 'string') {
            try { rawOfferings = JSON.parse(rawOfferings); } catch(e) { rawOfferings = []; }
          }
          let parsedOfferings = Array.isArray(rawOfferings) ? rawOfferings : (rawOfferings ? Object.values(rawOfferings) : []);

          if (parsedOfferings && parsedOfferings.length > 0) {
            const mappedPackages = parsedOfferings.map((off, idx) => {
              const offPrice = Number(off.price) || Number(fetchedItem.price) || 500;
              const offDuration = off.duration || (off.durationHours ? `${off.durationHours} hrs` : (off.durationMinutes ? `${off.durationMinutes} mins` : '1 hr'));
              const minTotal = offPrice * 5; // minimum booking estimate
              return {
                id: idx + 1,
                title: off.title || off.name || off.serviceType || `Offering ${idx + 1}`,
                img: off.image || (fetchedItem.photos && fetchedItem.photos[idx]) || fetchedItem.cover_img || defaultPackages[idx % defaultPackages.length].img,
                desc: off.description || fetchedItem.description || `Tailored offering provided by ${fetchedItem.host_name || 'Host'}.`,
                meta: `₹${offPrice.toLocaleString('en-IN')} / guest · Minimum ₹${minTotal.toLocaleString('en-IN')} to book · ${offDuration}`,
                rawPrice: offPrice,
                duration: offDuration,
                maxGuests: off.maxGuests || fetchedItem.max_guests || 4
              };
            });
            setPackages(mappedPackages);
          }

          // Parse photos / portfolio
          const photos = Array.isArray(fetchedItem.photos) && fetchedItem.photos.length > 0
            ? fetchedItem.photos
            : (fetchedItem.cover_img ? [fetchedItem.cover_img] : defaultPortfolioImages);
          
          if (photos.length > 0) {
            setPortfolioImages(photos);
          }

          // Fetch real reviews from backend
          try {
            const revRes = await fetch(`${baseUrl}/listings/${fetchedItem.id}/reviews`);
            const revData = await revRes.json();
            if (revData.success && Array.isArray(revData.data)) {
              setReviews(revData.data);
            }
          } catch(e) {
            console.error('Failed to load reviews:', e);
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic service details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [id]);

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

  const { user: authUser, isAuthenticated } = useSelector((state) => state.auth);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);

  // Razorpay Checkout Handler
  const handleRazorpayPayment = async () => {
    try {
      setIsProcessingPayment(true);

      const selectedPkg = selectedTimePill ? packages.find(p => p.id === selectedTimePill.pkgId) : packages[0];
      const pkgPrice = selectedPkg?.rawPrice || Number(listing?.price) || 2000;
      const baseAmount = pkgPrice * (confirmGuests || guests || 1);
      const discountAmount = appliedCoupon?.discountAmount ? Number(appliedCoupon.discountAmount) : 0;
      const totalAmount = Math.max(1, baseAmount - discountAmount);
      const hostName = listing?.host_name || 'Host';
      const locationDisplay = listing?.service_area?.startingLocation || 
        (listing?.residential_address?.city ? `${listing.residential_address.street || ''}, ${listing.residential_address.city}, ${listing.residential_address.state || ''}, ${listing.residential_address.country || 'India'}` : null) || 
        listing?.city || 
        'Jaipur, Rajasthan, India';

      // 1. Create order on backend
      const orderPayload = {
        amount: totalAmount,
        listingId: listing?.id || (id && !isNaN(Number(id)) ? Number(id) : null),
        listingTitle: listing?.title || `Tailored service by ${hostName}`,
        packageTitle: selectedPkg?.title || 'Selected Package',
        guestsCount: confirmGuests || guests || 1,
        hostName,
        location: locationDisplay,
        bookingDate: selectedDate.toISOString(),
        bookingTime: selectedTimePill?.time || '10:00 am',
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

      // 2. Open Razorpay Checkout modal
      if (!window.Razorpay) {
        toast.error('Razorpay SDK failed to load. Please check your internet connection.');
        setIsProcessingPayment(false);
        return;
      }

      const options = {
        key: orderData.key || 'rzp_test_ToafKH36vIRD5L',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Airbnb Experiences & Services',
        description: `${selectedPkg?.title} with ${hostName}`,
        image: '/favicon.png',
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // 3. Verify Payment Signature on backend
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

            if (!verifyRes.ok) {
              const errText = await verifyRes.text();
              throw new Error(`Server returned ${verifyRes.status}: ${errText}`);
            }

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
            toast.error(err.message || 'Network error verifying payment.');
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
        setIsProcessingPayment(false);
        toast.error(`Payment failed: ${response.error?.description || 'Transaction declined'}`);
      });
      rzp.open();
    } catch (err) {
      console.error('Razorpay Error:', err);
      toast.error(err.message || 'Payment initiation failed');
      setIsProcessingPayment(false);
    }
  };

  if (showConfirmPayPage) {
    const selectedPkg = selectedTimePill ? packages.find(p => p.id === selectedTimePill.pkgId) : packages[0];
    const pkgPrice = selectedPkg?.rawPrice || Number(listing?.price) || 2000;
    const baseBookingPrice = pkgPrice * (confirmGuests || guests || 1);
    const discountAmount = appliedCoupon?.discountAmount ? Number(appliedCoupon.discountAmount) : 0;
    const finalBookingPrice = Math.max(1, baseBookingPrice - discountAmount);
    const minPriceFormatted = `₹${baseBookingPrice.toLocaleString('en-IN')}`;
    const finalPriceFormatted = `₹${finalBookingPrice.toLocaleString('en-IN')}`;

    const hostName = listing?.host_name || 'Host';
    const locationDisplay = listing?.service_area?.startingLocation || 
      (listing?.residential_address?.city ? `${listing.residential_address.street || ''}, ${listing.residential_address.city}, ${listing.residential_address.state || ''}, ${listing.residential_address.country || 'India'}` : null) || 
      listing?.city || 
      'Jaipur, Rajasthan, India';

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
            <p className={styles.termsText}>By selecting the button, I agree to the booking terms and release and waiver. <span className={styles.linkText}>View Privacy Policy.</span></p>
            <button 
              className={styles.primaryActionBtn}
              onClick={handleRazorpayPayment}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Processing with Razorpay...
                </span>
              ) : (
                `Confirm and pay ${finalPriceFormatted}`
              )}
            </button>
          </div>

          <div className="col-lg-6">
            <div className={styles.summaryCard}>
              <div className={styles.summaryTop}>
                <img 
                  src={selectedPkg.img} 
                  alt={selectedPkg.title} 
                  className={styles.summaryImg} 
                  onError={(e) => { e.target.src = defaultPackages[0].img; }}
                />
                <div className={styles.summaryTopRight}>
                  <h4 className={styles.summaryPkgTitle}>{selectedPkg.title}</h4>
                  <p className={styles.summaryPkgSub}>{listing?.title || `Tailored service by ${hostName}`}</p>
                </div>
              </div>

              <hr className={styles.summaryDivider} />

              <div className={styles.summarySection}>
                <h5 className={styles.summarySecTitle}>Free cancellation</h5>
                <p className={styles.summarySecDesc}>
                  Cancel at least {listing?.cancellation_policy || '1 day'} before start time for a full refund.
                </p>
              </div>

              <hr className={styles.summaryDivider} />

              <div className={styles.summarySection}>
                <h5 className={styles.summarySecTitle}>Date</h5>
                <p className={styles.summarySecDesc}>
                  {selectedDate.toLocaleDateString('default', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
                  <br/>
                  {selectedTimePill?.time || '10:00 am'} - {selectedTimePill ? `${(parseInt(selectedTimePill.time.split(':')[0]) + 1)}:00 ${selectedTimePill.time.includes('pm') ? 'pm' : 'am'}` : '11:00 am'}
                </p>
              </div>

              <hr className={styles.summaryDivider} />

              <div className={styles.summaryFlexRow}>
                <div>
                  <h5 className={styles.summarySecTitle}>Guests</h5>
                  <p className={styles.summarySecDesc}>{confirmGuests || guests} guest{(confirmGuests || guests) > 1 ? 's' : ''}</p>
                </div>
                <button className={styles.changeBtn} onClick={() => { setConfirmGuests(confirmGuests || guests); setShowEditGuestsModal(true); }}>Change</button>
              </div>

              <hr className={styles.summaryDivider} />

              <div className={styles.summaryFlexRow}>
                <div>
                  <h5 className={styles.summarySecTitle}>Location</h5>
                  <p className={styles.summarySecDesc}>{locationDisplay}</p>
                </div>
                <button className={styles.changeBtn} onClick={() => setShowLocationModal(true)}>Change</button>
              </div>

              <hr className={styles.summaryDivider} />

              <div className={styles.summarySection}>
                <h5 className={styles.summarySecTitle}>Price details</h5>
                <div className={styles.priceRow}>
                  <span>{selectedPkg.title} (x{confirmGuests || guests} guests)</span>
                  <span>{minPriceFormatted}</span>
                </div>
                {appliedCoupon && (
                  <div className={styles.priceRow} style={{ color: '#008a05', fontWeight: 600, marginTop: '8px' }}>
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
              
              {appliedCoupon ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
                  <span style={{ color: '#008a05', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ✓ Coupon "{appliedCoupon.code}" applied
                  </span>
                  <button 
                    type="button"
                    onClick={handleRemoveCoupon} 
                    style={{ background: 'none', border: 'none', color: '#ff385c', fontSize: '13px', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className={styles.couponSection} onClick={() => setShowCouponModal(true)}>
                  Enter a coupon
                </div>
              )}

              <hr className={styles.summaryDivider} />

              <div className={styles.totalRow}>
                <span>Total <span className={styles.inrUnderline}>INR</span></span>
                <span>{finalPriceFormatted}</span>
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
                    <button className={styles.guestBtn} onClick={() => setConfirmGuests(Math.min(listing?.max_guests || 10, confirmGuests + 1))}>+</button>
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
                <h2 className={styles.locationModalTitle}>
                  Confirm where you want your {listing?.category || 'service'} session to take place
                </h2>
                <div className={styles.locationItem}>
                  <div className={styles.locIconWrapper}><FaMapMarkerAlt className={styles.locIcon} /></div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className={styles.locText}>
                      {listing?.travel_preference || "Your service host's location"} ({listing?.city || 'Jaipur'})
                    </span>
                    <span style={{ fontSize: '13px', color: '#717171', marginTop: '4px' }}>
                      {locationDisplay}
                    </span>
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
          <div className={styles.scheduleModalOverlay} onClick={() => setShowCouponModal(false)}>
            <div className={styles.scheduleModalContainer} onClick={(e) => e.stopPropagation()}>
              <div className={styles.scheduleHeader}>
                <h2 className={styles.scheduleTitle}>Coupons</h2>
                <button className={styles.scheduleCloseBtn} onClick={() => setShowCouponModal(false)}>&times;</button>
              </div>
              <form onSubmit={handleApplyCoupon}>
                <div className={styles.scheduleContent} style={{ display: 'flex', flexDirection: 'column', paddingTop: '24px' }}>
                  <label className={styles.couponLabel}>Add a coupon</label>
                  <input 
                    type="text" 
                    className={styles.couponInput} 
                    placeholder="Enter a coupon (e.g. AIRBNB2026, FIRSTSTAY)" 
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    autoFocus
                  />
                </div>
                <div className={styles.scheduleFooter} style={{ justifyContent: 'space-between' }}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowCouponModal(false)}>Cancel</button>
                  <button 
                    type="submit" 
                    className={styles.scheduleNextBtn}
                    disabled={isApplyingCoupon || !couponCodeInput.trim()}
                  >
                    {isApplyingCoupon ? 'Applying...' : 'Add'}
                  </button>
                </div>
              </form>
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
                  <img 
                    src={listing?.cover_img || (Array.isArray(listing?.photos) && listing.photos[0]) || portfolioImages[0]} 
                    alt={listing?.title || "Cover"} 
                    className={styles.coverImage} 
                    onError={(e) => { 
                      if (portfolioImages[0] && e.target.src !== portfolioImages[0]) {
                        e.target.src = portfolioImages[0];
                      }
                    }}
                  />
                </div>
                {listing?.host_avatar ? (
                  <div className={styles.avatarWrapper}>
                    <img 
                      src={listing.host_avatar} 
                      alt={listing?.host_name || "Host"} 
                      className={styles.avatarImage} 
                    />
                  </div>
                ) : (
                  <div className={styles.avatarWrapper} style={{ background: '#222', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold' }}>
                    {(listing?.host_name || 'H').charAt(0).toUpperCase()}
                  </div>
                )}
                <h1 className={styles.title}>{listing?.title || "Service by Host"}</h1>
                <p className={styles.subtitle}>
                  {listing?.host_intro || listing?.description || ""}
                </p>
                <div className={styles.metaInfo}>
                  <span><FaStar className="me-1" />{listing?.rating ? Number(listing.rating).toFixed(1) : "5.0"}</span>
                  <span className={styles.dot}>·</span>
                  <span>{listing?.category || 'Service'} in {listing?.city || 'Location'}</span>
                </div>
                <div className={styles.metaSub}>
                  {listing?.travel_preference || (listing?.service_provision_type && listing.service_provision_type.includes('travel') ? 'You travel to guests' : 'Provided on location')}
                </div>
                
                <div className={styles.actionButtons}>
                  <button 
                    className={styles.iconBtn} 
                    title={copiedLink ? "Link copied!" : "Share service"}
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                  >
                    <FiUpload />
                    {copiedLink && <span style={{ position: 'absolute', top: '-28px', background: '#222', color: '#fff', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>Link copied!</span>}
                  </button>
                  <button 
                    className={styles.iconBtn} 
                    title="Save to wishlist"
                    onClick={() => setIsLiked(!isLiked)}
                    style={{ color: isLiked ? '#ff385c' : undefined }}
                  >
                    <FaHeart />
                  </button>
                </div>
             </div>

             <div className={styles.bookingCard}>
               <div className="d-flex justify-content-between align-items-center">
                 <div>
                   <div className={styles.bookingPrice}>
                     <span className={styles.price}>From ₹{Number(listing?.price || packages[0]?.rawPrice || 2000).toLocaleString('en-IN')}</span> <span className={styles.guestText}>/ guest</span>
                   </div>
                   <div className={styles.bookingSub}>
                     Minimum ₹{Number((listing?.price || packages[0]?.rawPrice || 2000) * 5).toLocaleString('en-IN')} to book<br/>
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
                   <img 
                     src={pkg.img} 
                     alt={pkg.title} 
                     className={styles.packageImg} 
                     onError={(e) => { e.target.src = defaultPackages[0].img; }}
                   />
                   <div className={styles.packageDetails}>
                      <h4 className={styles.packageTitle}>{pkg.title}</h4>
                      <p className={styles.packageDesc}>{pkg.desc}</p>
                      <div className={styles.packageMeta}>{pkg.meta}</div>
                   </div>
                </div>
              ))}
              <p className={styles.messageHint}>You can message {listing?.host_name || 'Prateek'} to customise or make changes.</p>
              
              <hr className={styles.divider} />

              {/* Reviews */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <FaStar className="me-2"/>
                  {listing?.rating ? Number(listing.rating).toFixed(1) : "5.0"} · {reviews.length > 0 ? reviews.length : (listing?.reviews_count || 0)} review{(reviews.length > 1 || (!reviews.length && listing?.reviews_count > 1)) ? 's' : ''}
                </h2>

                {reviews.length > 0 ? (
                  (() => {
                    const rev = reviews[0];
                    const dateFormatted = rev.created_at ? new Date(rev.created_at).toLocaleDateString('default', { month: 'long', year: 'numeric' }) : 'Recent';
                    const stars = '★'.repeat(Math.round(Number(rev.rating) || 5));
                    return (
                      <div className={styles.reviewCard}>
                        <div className={styles.reviewerInfo}>
                          {rev.reviewer_avatar ? (
                            <img src={rev.reviewer_avatar} alt={rev.reviewer_name} className={styles.reviewerAvatar} />
                          ) : (
                            <div className={styles.reviewerAvatar} style={{ background: '#222', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                              {(rev.reviewer_name || 'G').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className={styles.reviewerName}>{rev.reviewer_name}</div>
                            <div className={styles.reviewerLocation}>{rev.reviewer_location || 'India'}</div>
                          </div>
                        </div>
                        <div className={styles.reviewRating}>{stars} · {dateFormatted}</div>
                        <p className={styles.reviewText}>
                          {rev.review_text}
                        </p>
                      </div>
                    );
                  })()
                ) : (
                  <div className={styles.reviewCard}>
                    <p className={styles.reviewText} style={{ fontStyle: 'italic', color: '#717171' }}>
                      No reviews yet for this host. Book a session and be the first to share your experience!
                    </p>
                  </div>
                )}

                {reviews.length > 0 && (
                  <button className={styles.outlineBtn} onClick={() => setShowReviewsModal(true)}>
                    Show all {reviews.length} reviews
                  </button>
                )}
                <div className={styles.learnMore}>Learn how reviews work</div>
              </div>

              <hr className={styles.divider} />

              {/* Qualifications */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>My qualifications</h2>
                <div className={styles.qualificationsLayout}>
                  <div className={styles.hostInfoCard}>
                    {listing?.host_avatar ? (
                      <img 
                        src={listing.host_avatar} 
                        alt={listing?.host_name || "Host"} 
                        className={styles.largeAvatar} 
                      />
                    ) : (
                      <div className={styles.largeAvatar} style={{ background: '#222', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold' }}>
                        {(listing?.host_name || 'H').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <h3 className={styles.hostName}>{listing?.host_name || "Host"}</h3>
                    <p className={styles.hostRole}>{listing?.category || "Service Specialist"}</p>
                  </div>
                  <div className={styles.qualificationsList}>
                    <div className={styles.qualItem}>
                      <FiCamera className={styles.qualIcon} />
                      <div>
                        <h4 className={styles.qualTitle}>{listing?.years_experience ? `${listing.years_experience} years of experience` : "Years of experience"}</h4>
                        <p className={styles.qualDesc}>{listing?.host_intro || listing?.experience_description || listing?.description || "Dedicated specialist providing personalized services."}</p>
                      </div>
                    </div>
                    <div className={styles.qualItem}>
                      <FiAward className={styles.qualIcon} />
                      <div>
                        <h4 className={styles.qualTitle}>Career highlight</h4>
                        <p className={styles.qualDesc}>{listing?.career_highlight || listing?.host_recognition || "Verified track record of excellence in services and customer hospitality."}</p>
                      </div>
                    </div>
                    <div className={styles.qualItem}>
                      <FiBook className={styles.qualIcon} />
                      <div>
                        <h4 className={styles.qualTitle}>Education and training</h4>
                        <p className={styles.qualDesc}>{listing?.degree || listing?.host_qualifications || "Professional training and accredited credentials in this domain."}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  className={styles.outlineBtn} 
                  onClick={() => navigate('/hosting/messages')}
                >
                  Message {listing?.host_name || 'Host'}
                </button>
                <div className={styles.protectionText}>To help protect your payment, always use Airbnb to send money and communicate with hosts.</div>
              </div>

              <hr className={styles.divider} />

              {/* Portfolio */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>My portfolio</h2>
                <div className={styles.portfolioGrid}>
                  <div className={styles.portLarge} onClick={() => openPortfolioModal(0)} style={{ cursor: 'pointer' }}>
                    <img 
                      src={portfolioImages[0] || defaultPortfolioImages[0]} 
                      alt="Portfolio 1" 
                      onError={(e) => { e.target.src = defaultPortfolioImages[0]; }}
                    />
                  </div>
                  <div className={styles.portRight}>
                    <div className={styles.portSmall} onClick={() => openPortfolioModal(1)} style={{ cursor: 'pointer' }}>
                      <img 
                        src={portfolioImages[1] || defaultPortfolioImages[1]} 
                        alt="Portfolio 2" 
                        onError={(e) => { e.target.src = defaultPortfolioImages[1]; }}
                      />
                    </div>
                    <div className={styles.portSmall} onClick={() => openPortfolioModal(2)} style={{ cursor: 'pointer' }}>
                      <img 
                        src={portfolioImages[2] || defaultPortfolioImages[2]} 
                        alt="Portfolio 3" 
                        onError={(e) => { e.target.src = defaultPortfolioImages[2]; }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr className={styles.divider} />

              {/* Where you'll go */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Where you'll go</h2>
                <p className={styles.locationText}>
                  {listing?.city || 'Jaipur, Rajasthan, 302021'}
                  {listing?.service_area?.startingLocation ? ` · Service area: ${listing.service_area.startingLocation}` : ''}
                </p>
                <div className={styles.mapContainer}>
                  <iframe 
                    src={`https://www.google.com/maps?q=${encodeURIComponent(listing?.city || 'Jaipur, Rajasthan')}&output=embed`} 
                    width="100%" 
                    height="100%" 
                    style={{border:0, borderRadius: '12px'}} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location Map"
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
                    <p className={styles.knowDesc}>
                      Guests aged {listing?.min_age || 18} and over can attend, up to {listing?.max_guests || 4} guests in total.
                      {listing?.allow_infants ? ' Infants allowed under host supervision.' : ''}
                    </p>
                  </div>
                  <div className="col-md-4 mb-4">
                    <FaWheelchair className={styles.knowIcon} />
                    <h4 className={styles.knowTitle}>Accessibility</h4>
                    <p className={styles.knowDesc}>
                      {Array.isArray(listing?.accessibility_features) && listing.accessibility_features.length > 0 
                        ? listing.accessibility_features.join(', ') 
                        : 'Message your host for details.'}
                      <br/><span className={styles.linkText}>Learn more</span>
                    </p>
                  </div>
                  <div className="col-md-4 mb-4">
                    <FaCalendarAlt className={styles.knowIcon} />
                    <h4 className={styles.knowTitle}>Cancellation policy</h4>
                    <p className={styles.knowDesc}>
                      Cancel at least {listing?.cancellation_policy || '1 day'} before the start time for a full refund.
                    </p>
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
                   <span className={styles.price}>From ₹{Number(listing?.price || packages[0]?.rawPrice || 2000).toLocaleString('en-IN')}</span> <span className={styles.guestText}>/ guest</span>
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
                {packages.map(pkg => {
                  // Dynamically calculate time slots based on business_hours from backend if available
                  let availableSlots = ['9:00 am', '10:00 am', '11:00 am', '1:00 pm', '3:00 pm', '5:00 pm'];
                  if (listing?.business_hours) {
                    let bHours = listing.business_hours;
                    if (typeof bHours === 'string') {
                      try { bHours = JSON.parse(bHours); } catch(e) { bHours = []; }
                    }
                    if (Array.isArray(bHours) && bHours.length > 0 && bHours[0].from && bHours[0].to) {
                      const fromHour = parseInt(bHours[0].from) || 9;
                      const toHour = parseInt(bHours[0].to) || 17;
                      const generated = [];
                      for (let h = fromHour; h <= Math.min(toHour, fromHour + 5); h++) {
                        const ampm = h >= 12 && h < 24 ? 'pm' : 'am';
                        const displayH = h > 12 ? h - 12 : (h === 0 ? 12 : h);
                        generated.push(`${displayH}:00 ${ampm}`);
                      }
                      if (generated.length > 0) availableSlots = generated;
                    }
                  }

                  return (
                    <div key={`sched-${pkg.id}`} className={styles.sessionItem}>
                      <div className={styles.sessionHeader}>
                        <img src={pkg.img} alt={pkg.title} className={styles.sessionImg} />
                        <div>
                          <h4 className={styles.sessionTitle}>{pkg.title}</h4>
                          <p className={styles.sessionMeta}>{pkg.meta}</p>
                        </div>
                      </div>
                      <div className={styles.timePills}>
                        {availableSlots.map(time => {
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
                  );
                })}
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

      {/* Show All Reviews Modal */}
      {showReviewsModal && (
        <div className={styles.scheduleModalOverlay}>
          <div className={styles.scheduleModalContainer} style={{ maxWidth: '640px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div className={styles.scheduleHeader}>
              <h2 className={styles.scheduleTitle}>
                <FaStar className="me-2" style={{ color: '#222' }}/>
                {listing?.rating ? Number(listing.rating).toFixed(1) : "5.0"} · {reviews.length} review{reviews.length > 1 ? 's' : ''}
              </h2>
              <button className={styles.scheduleCloseBtn} onClick={() => setShowReviewsModal(false)}>&times;</button>
            </div>
            <div className={styles.scheduleContent} style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '16px' }}>
              {reviews.map((rev) => {
                const dateFormatted = rev.created_at ? new Date(rev.created_at).toLocaleDateString('default', { month: 'long', year: 'numeric' }) : 'Recent';
                const stars = '★'.repeat(Math.round(Number(rev.rating) || 5));
                return (
                  <div key={rev.id} style={{ borderBottom: '1px solid #ebebeb', paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      {rev.reviewer_avatar ? (
                        <img src={rev.reviewer_avatar} alt={rev.reviewer_name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#222', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {(rev.reviewer_name || 'G').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '15px' }}>{rev.reviewer_name}</div>
                        <div style={{ fontSize: '12px', color: '#717171' }}>{rev.reviewer_location || 'India'}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#222', marginBottom: '6px' }}>{stars} · {dateFormatted}</div>
                    <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#222', margin: 0 }}>{rev.review_text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Confirmed Booking Celebration Modal */}
      {confirmedBookingData && (
        <div className={styles.scheduleModalOverlay} style={{ zIndex: 9999 }}>
          <div className={styles.scheduleModalContainer} style={{ maxWidth: '520px', padding: '0', borderRadius: '24px', overflow: 'hidden' }}>
            {/* Top Brand Banner */}
            <div style={{ background: 'linear-gradient(135deg, #FF385C 0%, #D70466 100%)', color: '#fff', padding: '28px 24px', textAlign: 'center', position: 'relative' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fff', color: '#FF385C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: '28px', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
                ✓
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 6px', letterSpacing: '-0.3px', color: '#ffffff' }}>
                Booking Confirmed!
              </h2>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.92, fontWeight: '500' }}>
                Payment of ₹{Number(confirmedBookingData.amount).toLocaleString('en-IN')} received via Razorpay
              </p>
            </div>

            {/* Booking Details Card */}
            <div style={{ padding: '24px' }}>
              <div style={{ background: '#F8F9FA', borderRadius: '16px', padding: '18px', border: '1px solid #ECECEC', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>
                  <span style={{ fontSize: '13px', color: '#717171', fontWeight: '600' }}>Booking Ref:</span>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#222222', fontFamily: 'monospace', background: '#FFFFFF', padding: '3px 8px', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                    {confirmedBookingData.bookingCode}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#717171', fontWeight: '500' }}>Package / Service:</span>
                  <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#222222' }}>{confirmedBookingData.packageTitle}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#717171', fontWeight: '500' }}>Host:</span>
                  <span style={{ fontSize: '13.5px', fontWeight: '600', color: '#222222' }}>{confirmedBookingData.hostName}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#717171', fontWeight: '500' }}>Date & Time:</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#222222' }}>{confirmedBookingData.date} · {confirmedBookingData.time}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#717171', fontWeight: '500' }}>Razorpay Payment ID:</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#059669', fontFamily: 'monospace' }}>{confirmedBookingData.paymentId}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmedBookingData(null);
                    setShowConfirmPayPage(false);
                    navigate('/trips');
                  }}
                  style={{
                    flex: 1,
                    background: '#222222',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 18px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  View My Trips
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmedBookingData(null);
                    setShowConfirmPayPage(false);
                  }}
                  style={{
                    flex: 1,
                    background: '#F1F3F5',
                    color: '#222222',
                    border: '1px solid #D1D5DB',
                    borderRadius: '12px',
                    padding: '12px 18px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetails;
