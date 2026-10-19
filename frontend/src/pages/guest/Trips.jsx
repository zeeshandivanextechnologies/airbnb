import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from '../../components/styles/Trips.module.css';
import illustration from '../../assets/trip_illustration.jpg';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUserFriends, 
  FaMapMarkerAlt, 
  FaCheckCircle, 
  FaReceipt, 
  FaArrowRight, 
  FaTimes,
  FaPlus,
  FaMinus,
  FaLocationArrow
} from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { FiStar } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

// Custom Airbnb Map Pin Icon (Pill with price & status highlight)
const createCustomPin = (formattedPrice, isSelected) => {
  return L.divIcon({
    className: 'custom-trip-marker',
    html: `
      <div style="
        background-color: ${isSelected ? '#222222' : '#ffffff'};
        color: ${isSelected ? '#ffffff' : '#222222'};
        padding: 6px 12px;
        border-radius: 28px;
        font-weight: 700;
        font-size: 13px;
        letter-spacing: -0.2px;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.22);
        display: flex;
        align-items: center;
        gap: 6px;
        justify-content: center;
        white-space: nowrap;
        border: 1px solid rgba(0, 0, 0, 0.08);
        cursor: pointer;
        transition: transform 0.15s ease, background-color 0.15s ease, color 0.15s ease;
        transform: translate(-50%, -50%) scale(${isSelected ? 1.08 : 1});
      ">
        <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: ${isSelected ? '#ff385c' : '#059669'};"></span>
        <span>${formattedPrice}</span>
      </div>
    `,
    iconSize: [95, 32],
    iconAnchor: [48, 16]
  });
};

// Airbnb Live Location Glowing Blue Pulse Pin
const createUserLiveLocationIcon = () => {
  return L.divIcon({
    className: 'custom-user-live-pin',
    html: `
      <div style="
        position: relative; 
        width: 24px; 
        height: 24px; 
        display: flex; 
        align-items: center; 
        justify-content: center;
      ">
        <div style="
          position: absolute; 
          width: 24px; 
          height: 24px; 
          border-radius: 50%; 
          background: rgba(0, 132, 255, 0.35); 
          animation: pulseTripLive 2s infinite ease-out;
        "></div>
        <div style="
          width: 14px; 
          height: 14px; 
          border-radius: 50%; 
          background: #0084ff; 
          border: 2.5px solid #ffffff; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const CITY_COORDINATES = {
  'jaipur': [26.9124, 75.7873],
  'sawai madhopur': [25.9928, 76.3533],
  'delhi': [28.6139, 77.2090],
  'new delhi': [28.6139, 77.2090],
  'mumbai': [19.0760, 72.8777],
  'bengaluru': [12.9716, 77.5946],
  'bangalore': [12.9716, 77.5946],
  'udaipur': [24.5854, 73.7125],
  'jodhpur': [26.2389, 73.0243],
  'goa': [15.2993, 74.1240],
  'agra': [27.1767, 78.0081],
  'varanasi': [25.3176, 82.9739],
  'kolkata': [22.5726, 88.3639],
  'hyderabad': [17.3850, 78.4867],
  'chennai': [13.0827, 80.2707],
  'pune': [18.5204, 73.8567],
  'manali': [32.2432, 77.1892],
  'shimla': [31.1048, 77.1734],
  'rishikesh': [30.0869, 78.2676]
};

const getCoordinatesForBooking = (booking, index = 0) => {
  if (!booking) return [26.9124, 75.7873];
  const textToScan = `${booking.location || ''} ${booking.city || ''} ${booking.state || ''}`.toLowerCase();
  
  for (const [cityName, coords] of Object.entries(CITY_COORDINATES)) {
    if (textToScan.includes(cityName)) {
      return [coords[0] + (index * 0.008), coords[1] + (index * 0.008)];
    }
  }

  return [26.9124 + (index * 0.008), 75.7873 + (index * 0.008)];
};

// Smoothly animate map camera to selected booking location
function MapViewController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2) {
      map.flyTo(center, 12, { animate: true, duration: 1.0 });
    }
  }, [center, map]);
  return null;
}

// Map Controls Overlay (Live location, Zoom In, Zoom Out)
function MapControls({ baseCenter, userCoords, onLocateMe, isLocating }) {
  const map = useMap();
  return (
    <div className={styles.mapControlsOverlay}>
      <button 
        type="button" 
        className={styles.mapControlBtn}
        onClick={() => {
          if (userCoords) {
            map.flyTo(userCoords, 14, { animate: true, duration: 0.8 });
          } else if (onLocateMe) {
            onLocateMe();
          } else {
            map.flyTo(baseCenter, 12, { animate: true, duration: 0.6 });
          }
        }}
        title="Find My Live Location"
        style={{ color: userCoords ? '#0084ff' : '#222' }}
      >
        <FaLocationArrow size={14} style={{ transform: isLocating ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s' }} />
      </button>

      <div className={styles.mapZoomGroup}>
        <button 
          type="button" 
          className={styles.mapZoomBtn}
          onClick={() => map.zoomIn()}
          title="Zoom In"
        >
          <FaPlus size={12} />
        </button>
        <div className={styles.mapZoomDivider} />
        <button 
          type="button" 
          className={styles.mapZoomBtn}
          onClick={() => map.zoomOut()}
          title="Zoom Out"
        >
          <FaMinus size={12} />
        </button>
      </div>
    </div>
  );
}

// Map Popup Card for Trips
function MapTripPopupCard({ booking, onNavigate, onClose }) {
  const map = useMap();

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (map) {
      map.closePopup();
    }
    if (onClose) {
      onClose();
    }
  };

  const coverPhoto = booking.cover_img || (Array.isArray(booking.photos) && booking.photos[0]) || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=720&q=80';
  const title = booking.package_title || booking.listing_title || 'Confirmed Stay / Trip';
  const locationText = booking.location || booking.city || 'Jaipur, Rajasthan';
  const priceFormatted = `₹${Number(booking.total_amount).toLocaleString('en-IN')}`;
  const dateFormatted = booking.booking_date 
    ? new Date(booking.booking_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
    : (booking.check_in ? new Date(booking.check_in).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Confirmed date');

  return (
    <div 
      className={styles.tripPopupCard}
      onClick={() => onNavigate(`/booking-confirmed/${booking.booking_code}`)}
    >
      <div className={styles.tripPopupImgWrap}>
        <img src={coverPhoto} alt={title} className={styles.tripPopupImg} />
        <button 
          type="button"
          className={styles.tripPopupCloseBtn}
          onClick={handleClose}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          title="Close"
          aria-label="Close"
        >
          <IoMdClose size={15} />
        </button>
        <div className={styles.tripPopupStatusBadge}>
          {booking.status || 'CONFIRMED'}
        </div>
      </div>

      <div className={styles.tripPopupBody}>
        <h4 className={styles.tripPopupTitle}>{title}</h4>
        <p className='m-0'>
          <FaMapMarkerAlt className='me-2' color="#ff385c" size={16} />
          <span>{locationText}</span>
        </p>
        <p className='m-0'>
          <FaCalendarAlt className='me-2' size={16} style={{ marginRight: '4px' }} />
          <span>{dateFormatted}</span>
        </p>

        <div className={styles.tripPopupPriceRow}>
          <span className={styles.tripPopupPrice}>{priceFormatted}</span>
          <button 
            type="button" 
            className={styles.tripPopupViewBtn}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onNavigate(`/booking-confirmed/${booking.booking_code}`);
            }}
          >
            <span>View receipt</span>
            <FaArrowRight size={9} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Trips() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [userLiveCoords, setUserLiveCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setUserLiveCoords([26.9124, 75.7873]);
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setUserLiveCoords([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.warn('Geolocation error or permission denied:', err);
        setIsLocating(false);
        setUserLiveCoords([26.9124, 75.7873]);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    handleLocateMe();
  }, []);

  // Review Modal State
  const [reviewModalState, setReviewModalState] = useState({
    isOpen: false,
    booking: null,
    rating: 5,
    reviewText: '',
    isSubmitting: false
  });

  const handleOpenReviewModal = (booking) => {
    setReviewModalState({
      isOpen: true,
      booking,
      rating: 5,
      reviewText: '',
      isSubmitting: false
    });
  };

  const handleSubmitReview = async () => {
    const { booking, rating, reviewText } = reviewModalState;
    if (!reviewText.trim()) {
      toast.error('Please write a short review before submitting');
      return;
    }

    try {
      setReviewModalState(prev => ({ ...prev, isSubmitting: true }));
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      
      const listingId = booking.listing_id || 5;
      const guestFullName = user ? `${user.firstName || user.first_name || ''} ${user.lastName || user.last_name || ''}`.trim() : (booking.guest_name || 'Guest User');
      const guestAvatar = user?.avatar || null;
      const guestLoc = user?.city || booking.location || 'India';

      const res = await fetch(`${baseUrl}/listings/${listingId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewer_name: guestFullName,
          reviewer_avatar: guestAvatar,
          reviewer_location: guestLoc,
          rating: Number(rating) || 5,
          review_text: reviewText.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success('🎉 Thank you! Your review has been submitted successfully.');
        setReviewModalState({ isOpen: false, booking: null, rating: 5, reviewText: '', isSubmitting: false });
      } else {
        toast.error(data.message || 'Failed to submit review');
        setReviewModalState(prev => ({ ...prev, isSubmitting: false }));
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error('Network error submitting review.');
      setReviewModalState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        
        let storedUser = user;
        if (!storedUser) {
          try {
            const raw = localStorage.getItem('user') || localStorage.getItem('airbnb_user_auth');
            if (raw) storedUser = JSON.parse(raw)?.user || JSON.parse(raw);
          } catch(e) {}
        }

        const params = new URLSearchParams();
        if (storedUser?.id) params.append('userId', storedUser.id);
        if (storedUser?.email) params.append('email', storedUser.email);

        const res = await fetch(`${baseUrl}/payments/my-bookings?${params.toString()}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.bookings)) {
          setBookings(data.bookings);
          if (data.bookings.length > 0) {
            setSelectedBooking(data.bookings[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load trips / bookings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  return (
    <div className="container-fluid">
      <div className={`row ${styles.mainRow}`}>
        {/* Left Side */}
        <div className="col-md-5 col-lg-5 mb-lg-0 mb-3" style={{ height: '100%' }}>
          <div className={styles.leftSidebar}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#222' }}>Trips</h1>
              {bookings.length > 0 && (
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#717171', background: '#f7f7f7', padding: '4px 12px', borderRadius: '16px', border: '1px solid #ebebeb' }}>
                  {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
                </span>
              )}
            </div>

            {isLoading ? (
              <div style={{ padding: '60px 0', textAlign: 'center', color: '#717171' }}>
                <div className="spinner-border spinner-border-sm text-danger me-2" role="status"></div>
                Loading your trips...
              </div>
            ) : bookings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '32px' }}>
                {bookings.map((b) => {
                  const isSelected = selectedBooking?.id === b.id;
                  const dateStr = b.booking_date 
                    ? new Date(b.booking_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
                    : (b.check_in ? new Date(b.check_in).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Flexible date');

                  const coverPhoto = b.cover_img || (Array.isArray(b.photos) && b.photos[0]) || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=720&q=80';

                  return (
                    <div 
                      key={b.id || b.booking_code}
                      onClick={() => setSelectedBooking(b)}
                      style={{
                        borderRadius: '16px',
                        border: isSelected ? '2px solid #222222' : '1px solid #ebebeb',
                        padding: '16px',
                        background: isSelected ? '#ffffff' : '#fafafa',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 6px 18px rgba(0,0,0,0.08)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                        <img 
                          src={coverPhoto} 
                          alt={b.listing_title} 
                          style={{ width: '84px', height: '84px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} 
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: b.status === 'CONFIRMED' ? '#059669' : '#d97706', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              <FaCheckCircle style={{ marginRight: '4px' }} />
                              {b.status || 'CONFIRMED'}
                            </span>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#222' }}>
                              ₹{Number(b.total_amount).toLocaleString('en-IN')}
                            </span>
                          </div>

                          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#222', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {b.package_title || b.listing_title}
                          </h3>

                          <p style={{ fontSize: '13px', color: '#717171', margin: '0 0 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            Hosted by {b.host_name || 'Airbnb Host'}
                          </p>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px', color: '#484848' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <FaCalendarAlt size={10} color="#717171" />
                              {dateStr}
                            </span>
                            {b.booking_time && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <FaClock size={10} color="#717171" />
                                {b.booking_time}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid #f0f0f0', marginTop: '14px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11.5px', color: '#717171', fontFamily: 'monospace' }}>
                          Ref: {b.booking_code}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenReviewModal(b);
                            }}
                            style={{
                              background: '#f7f7f7',
                              border: '1px solid #dddddd',
                              borderRadius: '6px',
                              color: '#222222',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 10px',
                              transition: 'all 0.2s'
                            }}
                          >
                            <FiStar size={12} color="#e51d53" />
                            Write a review
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/booking-confirmed/${b.booking_code}`);
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#e51d53',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: 0
                            }}
                          >
                            <FaReceipt size={11} />
                            View receipt
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.contentWrapper}>
                <img src={illustration} alt="Map illustration" className={styles.illustration} />
                <h2 className={styles.title}>Map out your next trip</h2>
                <p className={styles.subtitle}>
                  After you book a trip, experience or service, come back here to see details, explore the map and save places to visit.
                </p>
                <button className={styles.getStartedBtn} onClick={() => navigate('/services')}>
                  Explore services
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Side - Map & Details */}
        <div className="col-md-7 col-lg-7 d-none d-md-block" style={{ height: '100%', position: 'relative' }}>
          <div className={styles.mapContainer}>
            <MapContainer 
              center={selectedBooking ? getCoordinatesForBooking(selectedBooking) : [26.9124, 75.7873]} 
              zoom={11} 
              scrollWheelZoom={true}
              zoomControl={false}
              attributionControl={false}
              className={styles.mapFrame}
            >
              <TileLayer
                url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              />

              {/* Map Controls: Live Location, Zoom In / Zoom Out */}
              <MapControls 
                baseCenter={selectedBooking ? getCoordinatesForBooking(selectedBooking) : [26.9124, 75.7873]} 
                userCoords={userLiveCoords} 
                onLocateMe={handleLocateMe} 
                isLocating={isLocating} 
              />

              {/* Live Location Marker */}
              {userLiveCoords && (
                <Marker 
                  position={userLiveCoords} 
                  icon={createUserLiveLocationIcon()} 
                  zIndexOffset={1000}
                >
                  <Popup closeButton={false} offset={[0, -10]}>
                    <div style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 700, color: '#222' }}>
                      📍 You are here
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Dynamic Camera Pan to active trip */}
              <MapViewController center={selectedBooking ? getCoordinatesForBooking(selectedBooking) : [26.9124, 75.7873]} />

              {/* Dynamic Markers for all confirmed trips */}
              {bookings.map((b, idx) => {
                const pos = getCoordinatesForBooking(b, idx);
                const isSelected = selectedBooking?.id === b.id;
                const formattedPrice = `₹${Number(b.total_amount).toLocaleString('en-IN')}`;

                return (
                  <Marker 
                    key={b.id || idx} 
                    position={pos}
                    icon={createCustomPin(formattedPrice, isSelected)}
                    eventHandlers={{
                      click: () => setSelectedBooking(b)
                    }}
                  >
                    <Popup closeButton={false} offset={[0, -12]} autoPan={true}>
                      <MapTripPopupCard 
                        booking={b} 
                        onNavigate={navigate} 
                        onClose={() => setSelectedBooking(null)} 
                      />
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            {/* Float Info Card on Map if booking selected */}
            {selectedBooking && (
              <div style={{
                position: 'absolute',
                bottom: '52px',
                left: '52px',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 8px 28px rgba(0,0,0,0.16)',
                padding: '18px 24px',
                zIndex: 1000,
                maxWidth: '420px',
                border: '1px solid #ebebeb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                    Active Trip
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#222' }}>
                    ₹{Number(selectedBooking.total_amount).toLocaleString('en-IN')}
                  </span>
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#222', margin: '0 0 4px' }}>
                  {selectedBooking.package_title || selectedBooking.listing_title}
                </h4>
                <div style={{ fontSize: '13px', color: '#717171', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <FaMapMarkerAlt color="#e51d53" />
                  {selectedBooking.location || selectedBooking.city || 'Jaipur, Rajasthan'}
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/booking-confirmed/${selectedBooking.booking_code}`)}
                  style={{
                    width: '100%',
                    background: '#222',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  View full booking details <FaArrowRight size={11} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Airbnb Write a Review Modal */}
      {reviewModalState.isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setReviewModalState(prev => ({ ...prev, isOpen: false }))}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '16px',
              maxWidth: '540px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 12px 36px rgba(0,0,0,0.22)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #ebebeb', paddingBottom: '14px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#222' }}>
                Rate & Review your stay
              </h3>
              <button 
                onClick={() => setReviewModalState(prev => ({ ...prev, isOpen: false }))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#717171', padding: '4px' }}
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Property details */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontWeight: 600, fontSize: '15px', color: '#222' }}>
                {reviewModalState.booking?.listing_title || reviewModalState.booking?.package_title}
              </div>
              <div style={{ fontSize: '13px', color: '#717171', marginTop: '2px' }}>
                Hosted by {reviewModalState.booking?.host_name || 'Host'}
              </div>
            </div>

            {/* Star Rating Select */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#222', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                Overall Rating: {reviewModalState.rating} Stars
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewModalState(prev => ({ ...prev, rating: star }))}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '26px',
                      color: star <= reviewModalState.rating ? '#e51d53' : '#dddddd',
                      padding: '2px',
                      transition: 'transform 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Review Comment Textarea */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#222', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                Your Public Review
              </label>
              <textarea
                rows={4}
                value={reviewModalState.reviewText}
                onChange={(e) => setReviewModalState(prev => ({ ...prev, reviewText: e.target.value }))}
                placeholder="Share your experience: How was the hospitality, cleanliness, accuracy, and comfort?"
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid #b0b0b0',
                  padding: '12px 14px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setReviewModalState(prev => ({ ...prev, isOpen: false }))}
                style={{
                  background: 'white',
                  border: '1px solid #222',
                  borderRadius: '8px',
                  padding: '10px 18px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={reviewModalState.isSubmitting}
                style={{
                  background: '#e51d53',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 22px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {reviewModalState.isSubmitting ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Submitting...
                  </span>
                ) : (
                  'Submit review'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Trips;