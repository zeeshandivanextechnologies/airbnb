import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaCheckCircle, 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaUserFriends, 
  FaReceipt, 
  FaCreditCard, 
  FaSuitcase, 
  FaHome, 
  FaStar,
  FaShieldAlt,
  FaArrowLeft,
  FaShareAlt,
  FaPrint
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import styles from './BookingConfirmation.module.css';

export default function BookingConfirmation() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://airbnb-7xie.onrender.com/api');

  useEffect(() => {
    async function fetchBookingDetails() {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/payments/booking/${code}`);
        const data = await res.json();
        if (data.success && data.booking) {
          setBooking(data.booking);
        } else {
          toast.error(data.message || 'Booking not found');
        }
      } catch (err) {
        console.error('Fetch booking error:', err);
        toast.error('Could not load booking details');
      } finally {
        setLoading(false);
      }
    }

    if (code) {
      fetchBookingDetails();
    }
  }, [code, baseUrl]);

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className="container text-center py-5">
          <div className="spinner-border text-danger mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading reservation...</span>
          </div>
          <h4 style={{ fontWeight: '700', color: '#222' }}>Confirming your reservation details...</h4>
          <p style={{ color: '#717171' }}>Please hold on while we prepare your official itinerary.</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className={styles.pageWrapper}>
        <div className="container py-5 text-center">
          <div className="card p-5 mx-auto shadow-sm" style={{ maxWidth: '500px', borderRadius: '20px' }}>
            <h3 style={{ fontWeight: '800', marginBottom: '12px' }}>Reservation Not Found</h3>
            <p style={{ color: '#717171', marginBottom: '24px' }}>
              We couldn't retrieve booking details for reference <strong>{code}</strong>.
            </p>
            <Link to="/trips" className={styles.btnPrimary}>
              Go to My Trips
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = booking.booking_date 
    ? new Date(booking.booking_date).toLocaleDateString('default', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : (booking.check_in ? new Date(booking.check_in).toLocaleDateString('default', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Confirmed Date');

  return (
    <div className={styles.pageWrapper}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        
        {/* Navigation Breadcrumb */}
        <div className={`d-flex justify-content-between align-items-center mb-4 ${styles.noPrint}`}>
          <button 
            type="button" 
            onClick={() => navigate('/trips')}
            className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-2"
            style={{ color: '#222', fontWeight: '600', fontSize: '14.5px' }}
          >
            <FaArrowLeft /> View All Trips
          </button>
          
          <div className="d-flex gap-2">
            <button 
              type="button" 
              onClick={() => window.print()}
              className="btn btn-light border btn-sm d-flex align-items-center gap-2"
              style={{ borderRadius: '8px', fontWeight: '600', fontSize: '13px' }}
            >
              <FaPrint /> Print Receipt
            </button>
          </div>
        </div>

        {/* Hero Banner */}
        <div className={styles.successHero}>
          <div className={styles.badgeSuccessTag}>
            <FaCheckCircle /> Reservation Confirmed & Paid
          </div>
          <h1 className={styles.heroHeading}>You're all booked, {booking.guest_name?.split(' ')[0] || 'there'}!</h1>
          <p className={styles.heroSubtext}>
            A receipt and confirmation details have been generated for reference.
          </p>
        </div>

        {/* Two Column Grid */}
        <div className="row g-4">
          
          {/* Left Column: Itinerary & Payment Breakdown */}
          <div className="col-lg-7">
            
            {/* Itinerary Overview */}
            <div className={styles.bookingCard}>
              <h2 className={styles.sectionTitle}>
                <FaSuitcase color="#ff385c" /> Reservation Itinerary
              </h2>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>
                  <FaReceipt /> Confirmation Code
                </span>
                <span className={styles.codePill}>{booking.booking_code}</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>
                  <FaCalendarAlt /> Date
                </span>
                <span className={styles.infoVal}>{formattedDate}</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>
                  <FaClock /> Scheduled Time
                </span>
                <span className={styles.infoVal}>{booking.booking_time || '10:00 am'}</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>
                  <FaUserFriends /> Number of Guests
                </span>
                <span className={styles.infoVal}>{booking.guests_count || 1} guest{(booking.guests_count > 1) ? 's' : ''}</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>
                  <FaMapMarkerAlt /> Meeting / Starting Point
                </span>
                <span className={styles.infoVal}>{booking.location || 'Jaipur, Rajasthan, India'}</span>
              </div>
            </div>

            {/* Payment & Invoice Breakdown */}
            <div className={styles.bookingCard}>
              <h2 className={styles.sectionTitle}>
                <FaCreditCard color="#ff385c" /> Payment Breakdown
              </h2>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Package Selected</span>
                <span className={styles.infoVal}>{booking.package_title || 'Tailored Package'}</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Payment Method</span>
                <span className={styles.infoVal}>Razorpay Online (UPI/Card/NetBanking)</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Razorpay Payment ID</span>
                <span className={styles.codePill} style={{ fontSize: '12px' }}>
                  {booking.razorpay_payment_id || 'Pay-Authorized'}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Razorpay Order ID</span>
                <span className={styles.codePill} style={{ fontSize: '12px' }}>
                  {booking.razorpay_order_id}
                </span>
              </div>

              <div className={styles.infoRow} style={{ paddingTop: '16px', marginTop: '6px', borderTop: '2px solid #222' }}>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#222' }}>Total Paid</span>
                <span style={{ fontSize: '20px', fontWeight: '800', color: '#16a34a' }}>
                  ₹{Number(booking.total_amount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Airbnb Protection Tip */}
            <div className={styles.tipBox}>
              <FaShieldAlt className={styles.tipIcon} />
              <div>
                <strong style={{ fontSize: '14px', color: '#1e3a8a', display: 'block', marginBottom: '2px' }}>
                  Protected by AirCover for Experiences
                </strong>
                <p className={styles.tipText}>
                  Your booking includes 24/7 safety line, booking protection guarantee, and hassle-free host coordination.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Listing & Host Card */}
          <div className="col-lg-5">
            <div className={styles.listingPreviewCard}>
              <div className={styles.listingImgBox}>
                <img 
                  src={booking.cover_img || (booking.photos && booking.photos[0]) || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'} 
                  alt={booking.listing_title} 
                  className={styles.listingImg} 
                />
              </div>

              <div className={styles.listingContent}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  {Number(booking.reviews_count) > 0 ? (
                    <>
                      <FaStar color="#ff385c" size={13} />
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#222' }}>
                        {booking.rating ? Number(booking.rating).toFixed(1) : '5.0'}
                      </span>
                      <span style={{ fontSize: '13px', color: '#717171' }}>
                        ({booking.reviews_count} review{Number(booking.reviews_count) > 1 ? 's' : ''})
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#717171', background: '#f7f7f7', padding: '2px 8px', borderRadius: '6px', border: '1px solid #ebebeb' }}>
                      ★ New · No reviews yet
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#222', marginBottom: '10px', lineHeight: '1.4' }}>
                  {booking.listing_title}
                </h3>

                <p style={{ fontSize: '13.5px', color: '#717171', margin: 0 }}>
                  <FaMapMarkerAlt size={12} className="me-1" />
                  {booking.location || 'Jaipur, Rajasthan'}
                </p>

                {/* Host Details */}
                <div className={styles.hostRow}>
                  {booking.host_avatar ? (
                    <img src={booking.host_avatar} alt={booking.host_name} className={styles.hostAvatar} />
                  ) : (
                    <div className={styles.hostAvatarFallback}>
                      {(booking.host_name || 'H').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <span style={{ fontSize: '12px', color: '#717171', display: 'block' }}>Hosted by</span>
                    <span style={{ fontSize: '15px', fontWeight: '700', color: '#222' }}>{booking.host_name || 'Host'}</span>
                  </div>
                </div>

                <div className="mt-4 d-flex flex-column gap-2">
                  <Link to="/trips" className={styles.btnPrimary}>
                    <FaSuitcase /> View in My Trips
                  </Link>
                  <Link to="/" className={styles.btnSecondary}>
                    <FaHome /> Explore More on Airbnb
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
