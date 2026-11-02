import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { 
  FaHeart, 
  FaStar, 
  FaChevronLeft, 
  FaChevronRight, 
  FaPlus, 
  FaMinus, 
  FaLocationArrow, 
  FaCompress, 
  FaExpand,
  FaTimes
} from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';
import { getStoredWishlists, addWishlist, isItemInAnyWishlist, removeItemFromWishlists } from '../../utils/wishlistStorage';
import styles from '../../components/styles/SearchResults.module.css';
import homeStyles from '../../components/styles/Home.module.css';

// City Coordinates Dictionary for precision centering & realistic distribution
const CITY_COORDINATES = {
  'jaipur': [26.9124, 75.7873],
  'sawai madhopur': [26.0189, 76.3522],
  'ranthambore': [26.0189, 76.3522],
  'udaipur': [24.5854, 73.7125],
  'jodhpur': [26.2389, 73.0243],
  'jaisalmer': [26.9157, 70.9083],
  'pushkar': [26.4897, 74.5511],
  'ajmer': [26.4499, 74.6399],
  'goa': [15.2993, 74.1240],
  'north goa': [15.5494, 73.7535],
  'south goa': [15.1950, 73.9680],
  'calangute': [15.5439, 73.7554],
  'baga': [15.5553, 73.7517],
  'candolim': [15.5173, 73.7634],
  'panaji': [15.4909, 73.8278],
  'gurugram': [28.4595, 77.0266],
  'gurgaon': [28.4595, 77.0266],
  'manali': [32.2432, 77.1892],
  'shimla': [31.1048, 77.1734],
  'dharamshala': [32.2190, 76.3234],
  'kasol': [32.0100, 77.3150],
  'rishikesh': [30.0869, 78.2676],
  'dehradun': [30.3165, 78.0322],
  'mussoorie': [30.4598, 78.0644],
  'nainital': [29.3919, 79.4542],
  'haridwar': [29.9457, 78.1642],
  'dubai': [25.2048, 55.2708],
  'mumbai': [19.0760, 72.8777],
  'delhi': [28.6139, 77.2090],
  'new delhi': [28.6139, 77.2090],
  'noida': [28.5355, 77.3910],
  'bengaluru': [12.9716, 77.5946],
  'bangalore': [12.9716, 77.5946],
  'hyderabad': [17.3850, 78.4867],
  'chennai': [13.0827, 80.2707],
  'pune': [18.5204, 73.8567],
  'kolkata': [22.5726, 88.3639],
  'ahmedabad': [23.0225, 72.5714],
  'surat': [21.1702, 72.8311],
  'agra': [27.1767, 78.0081],
  'varanasi': [25.3176, 82.9739],
  'amritsar': [31.6340, 74.8723],
  'chandigarh': [30.7333, 76.7794],
  'kochi': [9.9312, 76.2673],
  'cochin': [9.9312, 76.2673],
  'munnar': [10.0889, 77.0595],
  'alleppey': [9.4981, 76.3388],
  'alappuzha': [9.4981, 76.3388],
  'kerala': [10.8505, 76.2711],
  'ooty': [11.4102, 76.6950],
  'switzerland': [46.8182, 8.2275],
  'maldives': [3.2028, 73.2207],
  'japan': [35.6762, 139.6503],
  'tokyo': [35.6762, 139.6503],
  'italy': [41.8719, 12.5674],
  'rome': [41.9028, 12.4964],
  'thailand': [13.7563, 100.5018],
  'bangkok': [13.7563, 100.5018],
  'phuket': [7.8804, 98.3923],
  'france': [48.8566, 2.3522],
  'paris': [48.8566, 2.3522],
  'greece': [37.9838, 23.7275],
  'santorini': [36.3932, 25.4615],
  'australia': [-33.8688, 151.2093],
  'sydney': [-33.8688, 151.2093],
  'bali': [-8.4095, 115.1889],
  'spain': [40.4168, -3.7038],
  'barcelona': [41.3879, 2.1699],
  'madrid': [40.4168, -3.7038],
  'london': [51.5074, -0.1278],
  'united kingdom': [51.5074, -0.1278],
  'singapore': [1.3521, 103.8198],
  'new zealand': [-40.9006, 174.8860]
};

// Offset generator so multiple listings in same city appear naturally spread across neighborhood map
const getListingCoords = (item, idx, baseCenter) => {
  // If listing has explicit lat & lng in DB
  if (item.latitude && item.longitude && !isNaN(Number(item.latitude)) && !isNaN(Number(item.longitude))) {
    return [Number(item.latitude), Number(item.longitude)];
  }

  const cityKey = `${item.city || ''} ${item.state || ''} ${item.country || ''}`.toLowerCase();
  
  let center = baseCenter;
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (cityKey.includes(key)) {
      center = coords;
      break;
    }
  }

  // Generate realistic slight jitter for distinct pins
  const jitterPatterns = [
    [0.008, 0.012],
    [-0.012, 0.009],
    [0.015, -0.014],
    [-0.009, -0.016],
    [0.022, 0.005],
    [-0.018, 0.021],
    [0.004, -0.024],
    [-0.025, -0.008]
  ];
  const offset = jitterPatterns[idx % jitterPatterns.length];
  return [center[0] + offset[0], center[1] + offset[1]];
};

// Airbnb Signature Custom Price Pin (White Pill with Bold Price)
const createPricePinIcon = (formattedPrice, isSelected = false) => {
  return L.divIcon({
    className: 'custom-airbnb-price-pin',
    html: `
      <div style="
        background-color: ${isSelected ? '#222222' : '#ffffff'};
        color: ${isSelected ? '#ffffff' : '#222222'};
        padding: 6px 12px;
        border-radius: 28px;
        font-weight: 700;
        font-size: 13.5px;
        letter-spacing: -0.2px;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.22);
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        border: 1px solid rgba(0, 0, 0, 0.08);
        cursor: pointer;
        transition: transform 0.15s ease, background-color 0.15s ease, color 0.15s ease;
        transform: translate(-50%, -50%) scale(${isSelected ? 1.08 : 1});
      ">
        <span>${formattedPrice}</span>
      </div>
    `,
    iconSize: [80, 32],
    iconAnchor: [40, 16]
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
          animation: pulseLiveRing 2s infinite ease-out;
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

// Smooth Map Centering & Auto-Bounds Controller
function MapFlyController({ center, listingsCoords }) {
  const map = useMap();

  useEffect(() => {
    // If we have listings with coordinates on the map, auto-fit bounds nicely
    if (listingsCoords && listingsCoords.length > 0) {
      if (listingsCoords.length === 1) {
        map.flyTo(listingsCoords[0], 13, { animate: true, duration: 0.8 });
      } else {
        const bounds = L.latLngBounds(listingsCoords);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14, animate: true, duration: 0.8 });
      }
    } else if (center) {
      map.flyTo(center, 12, { animate: true, duration: 0.8 });
    }
  }, [center, listingsCoords, map]);

  return null;
}

// Map Popup Card with guaranteed Leaflet close handling
function MapListingPopupCard({ 
  item, 
  images, 
  listingCity, 
  ratingScore, 
  bedrooms, 
  beds, 
  bathrooms, 
  priceLabel, 
  onClose,
  onNavigate,
  onHeartClick,
  isSaved
}) {
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

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const handlePrevImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div 
      className={styles.mapPopupCard}
      onClick={() => onNavigate(`/listing/${item.id}`)}
    >
      <div className={styles.mapPopupImageWrap}>
        <img 
          src={images[currentImgIndex] || images[0]} 
          alt={`${item.title} - ${currentImgIndex + 1}`} 
          className={styles.mapPopupImg} 
        />
        
        {/* Wishlist Heart Button */}
        <button 
          type="button"
          className={`${styles.mapPopupHeartBtn} ${isSaved ? styles.mapPopupHeartBtnActive : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onHeartClick) {
              onHeartClick(e, item, 'Places in ' + listingCity);
            }
          }}
          title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
          aria-label="Save"
        >
          <FaHeart size={13} color={isSaved ? "#ff385c" : "#222"} />
        </button>

        {/* Close Button */}
        <button 
          type="button"
          className={styles.mapPopupCloseBtn}
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

        {/* Previous and Next Navigation Arrows (visible if multiple images) */}
        {images.length > 1 && (
          <>
            <button 
              type="button"
              className={`${styles.mapPopupNavBtn} ${styles.mapPopupNavPrev}`}
              onClick={handlePrevImg}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              title="Previous Photo"
              aria-label="Previous Photo"
            >
              <FaChevronLeft size={10} />
            </button>
            <button 
              type="button"
              className={`${styles.mapPopupNavBtn} ${styles.mapPopupNavNext}`}
              onClick={handleNextImg}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              title="Next Photo"
              aria-label="Next Photo"
            >
              <FaChevronRight size={10} />
            </button>
          </>
        )}

        {/* Dynamic Pagination Indicator Dots */}
        {images.length > 1 && (
          <div className={styles.mapPopupDots} onClick={(e) => e.stopPropagation()}>
            {images.slice(0, 5).map((_, idx) => (
              <span 
                key={idx}
                className={`${styles.mapPopupDot} ${idx === currentImgIndex ? styles.mapPopupDotActive : ''}`} 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImgIndex(idx);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.mapPopupContent}>
        <div className={styles.mapPopupRowTop}>
          <span className={styles.mapPopupCity}>{listingCity}</span>
          <span className={styles.mapPopupRating}>
            ★ {ratingScore}
          </span> 
        </div>
        <h4 className={styles.mapPopupTitle}>{item.title}</h4>
        <p className={`m-0 ${styles.mapPopupDetails}`}>
          {bedrooms} bedrooms · {beds} beds · {bathrooms} bathrooms
        </p>
        <div className={styles.mapPopupPriceRow}>
          <span className={styles.mapPopupPrice}>{priceLabel}</span>
          <span className={styles.mapPopupDuration}>for night</span>
        </div>
      </div>
    </div>
  );
}

// Map Controls Component (Live Location, Zoom in, Zoom out)
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

export default function SearchResults() {
  const { location } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeListingId, setActiveListingId] = useState(null);
  const [userLiveCoords, setUserLiveCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  // Pagination state (20 listings per page: 10 rows of 2 cards each)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Wishlist modal state matching Services.jsx
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [wishlistName, setWishlistName] = useState('');
  const [selectedListingForWishlist, setSelectedListingForWishlist] = useState(null);
  const [savedWishlistVersion, setSavedWishlistVersion] = useState(0);

  useEffect(() => {
    const handleWishlistUpdate = () => {
      setSavedWishlistVersion(v => v + 1);
    };
    window.addEventListener('airbnb_wishlists_updated', handleWishlistUpdate);
    return () => window.removeEventListener('airbnb_wishlists_updated', handleWishlistUpdate);
  }, []);

  const handleHeartClick = (e, listing, category) => {
    e.preventDefault();
    e.stopPropagation();

    const cat = category || 'Stays in ' + (listing.city || displayLocation);
    const alreadySaved = isItemInAnyWishlist(listing.id, listing.title, cat);

    if (alreadySaved) {
      removeItemFromWishlists(listing.id, listing.title, cat);
      toast.success('Removed from wishlist');
    } else {
      setSelectedListingForWishlist({ ...listing, category: cat });
      setWishlistName(cat);
      setIsWishlistModalOpen(true);
    }
  };

  const closeWishlistModal = () => {
    setIsWishlistModalOpen(false);
    setSelectedListingForWishlist(null);
    setWishlistName('');
  };

  const handleCreateWishlist = () => {
    if (!wishlistName.trim()) return;

    const initialItem = selectedListingForWishlist ? {
      id: selectedListingForWishlist.id || `item-${Date.now()}`,
      title: selectedListingForWishlist.title,
      category: selectedListingForWishlist.category || 'Stays',
      host: selectedListingForWishlist.host || selectedListingForWishlist.city || 'Airbnb Host',
      image: selectedListingForWishlist.cover_img || (selectedListingForWishlist.photos && selectedListingForWishlist.photos[0]) || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=720&q=80',
      price: selectedListingForWishlist.price
    } : null;

    addWishlist(wishlistName.trim(), initialItem);
    toast.success(`Saved to "${wishlistName.trim()}"!`);
    closeWishlistModal();
  };

  // Normalize location name for display and search
  const decodedLocation = location ? decodeURIComponent(location) : '';
  const isNearbyOrAll = !decodedLocation || decodedLocation.toLowerCase() === 'nearby' || decodedLocation.toLowerCase() === 'all';
  const displayLocation = isNearbyOrAll 
    ? 'this area' 
    : decodedLocation.charAt(0).toUpperCase() + decodedLocation.slice(1);

  // Auto-detect user live location if permitted or requested
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setUserLiveCoords([26.9124, 75.7873]);
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setUserLiveCoords([latitude, longitude]);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Live location permission denied or error:', err.message);
        // Fallback default sample nearby location in Jaipur to show the pulsing blue pin nicely
        setUserLiveCoords([26.9124, 75.7873]);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    handleLocateMe();
  }, []);

  const [searchLocationCoords, setSearchLocationCoords] = useState(null);

  // Compute base map center according to searched location or dynamic geocode
  const computeBaseCenter = () => {
    if (searchLocationCoords) return searchLocationCoords;
    if (userLiveCoords && isNearbyOrAll) return userLiveCoords;
    if (isNearbyOrAll) return [26.9124, 75.7873]; // default Jaipur/India
    const lower = decodedLocation.toLowerCase();
    for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
      if (lower.includes(key)) return coords;
    }
    return [26.9124, 75.7873];
  };

  const mapCenter = computeBaseCenter();

  // If search query is not in static dictionary, geocode it dynamically via backend location search
  useEffect(() => {
    let isCancelled = false;
    const resolveLocationCoordinates = async () => {
      if (isNearbyOrAll) {
        setSearchLocationCoords(null);
        return;
      }
      const lower = decodedLocation.toLowerCase();
      let matchedCoord = null;
      for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
        if (lower.includes(key)) {
          matchedCoord = coords;
          break;
        }
      }
      if (matchedCoord) {
        setSearchLocationCoords(matchedCoord);
        return;
      }

      // Try geocoding from backend location search
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        const geoRes = await fetch(`${baseUrl}/listings/locations/search?q=${encodeURIComponent(decodedLocation)}`);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (!isCancelled && geoData.success && geoData.data && geoData.data.length > 0) {
            const firstWithCoords = geoData.data.find(d => d.lat && d.lng);
            if (firstWithCoords) {
              setSearchLocationCoords([Number(firstWithCoords.lat), Number(firstWithCoords.lng)]);
            }
          }
        }
      } catch (e) {
        console.warn('Could not geocode searched location:', e);
      }
    };

    resolveLocationCoordinates();
    return () => {
      isCancelled = true;
    };
  }, [decodedLocation, isNearbyOrAll]);

  // Fetch dynamic listings from Backend filtered strictly by location
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        
        // Pass strictly location filter to backend
        const queryParam = isNearbyOrAll ? '' : `?location=${encodeURIComponent(decodedLocation)}`;
        const res = await fetch(`${baseUrl}/listings${queryParam}`);
        const data = await res.json();
        
        if (data.success && Array.isArray(data.data)) {
          setListings(data.data);
          setActiveListingId(data.data[0]?.id || null);
        } else {
          setListings([]);
          setActiveListingId(null);
        }
      } catch (err) {
        console.error('Error fetching search results:', err);
        setListings([]);
        setActiveListingId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [decodedLocation]);

  // Format currency
  const formatPrice = (price) => {
    const num = Number(price) || 0;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  // Extract photos list
  const getListingImages = (item) => {
    if (Array.isArray(item.photos) && item.photos.length > 0) {
      return item.photos;
    }
    if (item.cover_img) {
      return [item.cover_img];
    }
    return [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=720&q=80",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=720&q=80"
    ];
  };

  // Reset to page 1 whenever searched location changes
  useEffect(() => {
    setCurrentPage(1);
  }, [decodedLocation]);

  // Pagination computations
  const totalPages = Math.ceil(listings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedListings = listings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className={homeStyles['home-container']}>
      <main className={homeStyles['main-content']}>
        <div className="container-fluid p-0">
          <div className="row">
            {/* Left side: Hotels / Listings list */}
            <div className="col-lg-6 col-md-12 col-sm-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="fs-5 fw-bold m-0">
                  {loading 
                    ? `Searching in ${displayLocation}...` 
                    : `${listings.length > 0 ? listings.length : 'No'} place${listings.length === 1 ? '' : 's'} in ${displayLocation}`}
                </h1>
                <div className={styles.priceToggleBadge}>
                  <span style={{ color: '#ff385c' }}>🏷️</span> Prices include all fees
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading places...</span>
                  </div>
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-5">
                  <h4 className="fw-semibold text-secondary">No exact matches found for "{displayLocation}"</h4>
                  <p className="text-muted">Try checking your spelling or search for popular destinations like Jaipur, Goa, Dubai or Mumbai.</p>
                </div>
              ) : (
                <>
                  <div className="row">
                    {paginatedListings.map((item) => {
                    const images = getListingImages(item);
                    const listingCity = item.city || displayLocation;
                    const ratingScore = Number(item.rating) > 0 ? Number(item.rating).toFixed(2) : '4.95';
                    const reviewsCount = item.reviews_count || (Math.floor(Math.random() * 40) + 12);
                    const bedrooms = item.bedrooms || 2;
                    const beds = item.beds || 2;
                    const bathrooms = item.bathrooms || 2;
                    const isSuperhost = item.is_featured || item.is_guest_favourite;

                    return (
                      <div key={item.id} className="col-lg-6 col-md-6 col-sm-12 mb-3">
                        <div 
                          className={styles.hotelCard}
                          onMouseEnter={() => setActiveListingId(item.id)}
                        >
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
                                {images.map((img, idx) => (
                                  <SplideSlide key={idx}>
                                    <img 
                                      src={img} 
                                      alt={`${item.title} - ${idx}`} 
                                      className={styles.hotelImage}
                                      onClick={() => navigate(`/listing/${item.id}`)}
                                      style={{ cursor: 'pointer' }}
                                    />
                                  </SplideSlide>
                                ))}
                              </SplideTrack>
                              
                              <div className="splide__arrows" onClick={(e) => e.stopPropagation()}>
                                <button 
                                  type="button"
                                  className={`splide__arrow splide__arrow--prev ${styles.customArrow}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                >
                                  <FaChevronLeft size={10} />
                                </button>
                                <button 
                                  type="button"
                                  className={`splide__arrow splide__arrow--next ${styles.customArrow}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                >
                                  <FaChevronRight size={10} />
                                </button>
                              </div>
                            </Splide>

                            {isSuperhost && (
                              <span 
                                className={styles.badge}
                                onClick={() => navigate(`/listing/${item.id}`)}
                                style={{ cursor: 'pointer' }}
                              >
                                {item.is_guest_favourite ? 'Guest favourite' : 'Superhost'}
                              </span>
                            )}
                            {(() => {
                              const isSaved = isItemInAnyWishlist(item.id, item.title, 'Stays in ' + listingCity);
                              return (
                                <button 
                                  type="button"
                                  className={`${styles.heartBtn} ${isSaved ? styles.heartBtnActive : ''}`} 
                                  onClick={(e) => handleHeartClick(e, item, 'Stays in ' + listingCity)}
                                  title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
                                  aria-label="Save"
                                >
                                  <FaHeart color={isSaved ? "#ff385c" : undefined} />
                                </button>
                              );
                            })()}
                          </div>
                          
                          <div 
                            className={styles.cardBody}
                            onClick={() => navigate(`/listing/${item.id}`)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <h3 className={styles.title}>{item.title}</h3>
                              <div className={styles.rating}>
                                <FaStar className={styles.starIcon} /> 
                                <span>{ratingScore} ({reviewsCount})</span>
                              </div>
                            </div>
                            
                            <p className={styles.subtitle}>{listingCity}</p>
                            <p className={styles.details}>
                              {item.type || `${bedrooms} bedrooms · ${beds} beds · ${bathrooms} bathrooms`}
                            </p>
                            <p className={styles.dates}>Available for booking</p>
                            
                            <div>
                              <span className={styles.price}>{formatPrice(item.price)}</span>
                              <span className={styles.duration}> night</span>
                            </div>
                            
                            <div className={styles.cancellation}>Free cancellation</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Airbnb Style Pagination Controls */}
                {totalPages > 1 && (
                  <div className={styles.paginationContainer}>
                    <ul className={styles.paginationList}>
                      <li>
                        <button
                          type="button"
                          className={styles.paginationArrowBtn}
                          disabled={currentPage === 1}
                          onClick={() => {
                            setCurrentPage(prev => Math.max(prev - 1, 1));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          aria-label="Previous Page"
                        >
                          <FaChevronLeft size={11} />
                        </button>
                      </li>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                        <li key={pageNumber}>
                          <button
                            type="button"
                            className={`${styles.paginationBtn} ${currentPage === pageNumber ? styles.paginationBtnActive : ''}`}
                            onClick={() => {
                              setCurrentPage(pageNumber);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            {pageNumber}
                          </button>
                        </li>
                      ))}

                      <li>
                        <button
                          type="button"
                          className={styles.paginationArrowBtn}
                          disabled={currentPage === totalPages}
                          onClick={() => {
                            setCurrentPage(prev => Math.min(prev + 1, totalPages));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          aria-label="Next Page"
                        >
                          <FaChevronRight size={11} />
                        </button>
                      </li>
                    </ul>

                    <div className={styles.paginationInfo}>
                      {startIndex + 1} – {Math.min(startIndex + itemsPerPage, listings.length)} of {listings.length} places
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
            
            {/* Right side: Dynamic Interactive Leaflet Map with Price Pins & Popup Card */}
            <div className="col-lg-6 col-md-12 col-sm-12">
              <div className={styles.mapContainer}>
                {(() => {
                  const renderedListingCoords = listings.map((item, idx) => getListingCoords(item, idx, mapCenter));
                  return (
                    <MapContainer 
                      center={mapCenter} 
                      zoom={12} 
                      scrollWheelZoom={true}
                      zoomControl={false}
                      attributionControl={false}
                      className={styles.mapFrame}
                    >
                      <TileLayer
                        url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                      />

                      <MapFlyController center={mapCenter} listingsCoords={renderedListingCoords} />
                      <MapControls 
                        baseCenter={mapCenter} 
                        userCoords={userLiveCoords}
                        onLocateMe={handleLocateMe}
                        isLocating={isLocating}
                      />

                      {/* Airbnb Live Location Blue Pulse Marker */}
                      {userLiveCoords && (
                        <Marker 
                          position={userLiveCoords} 
                          icon={createUserLiveLocationIcon()}
                          zIndexOffset={1000}
                        >
                          <Popup closeButton={false} offset={[0, -6]}>
                            <div style={{ padding: '6px 10px', fontSize: '12px', fontWeight: 600, color: '#222' }}>
                              📍 You are here
                            </div>
                          </Popup>
                        </Marker>
                      )}

                      {/* Dynamic Price Pin Markers for each listing */}
                      {listings.map((item, idx) => {
                        const coords = renderedListingCoords[idx] || getListingCoords(item, idx, mapCenter);
                        const isSelected = activeListingId === item.id;
                        const priceLabel = formatPrice(item.price);
                        const images = getListingImages(item);
                        const ratingScore = Number(item.rating) > 0 ? Number(item.rating).toFixed(2) : 'New';
                        const bedrooms = item.bedrooms || 2;
                        const beds = item.beds || 3;
                        const bathrooms = item.bathrooms || 2;
                        const listingCity = item.city || displayLocation;
                        const isSaved = isItemInAnyWishlist(item.id, item.title, 'Places in ' + listingCity);

                        return (
                          <Marker 
                            key={item.id} 
                            position={coords}
                            icon={createPricePinIcon(priceLabel, isSelected)}
                            eventHandlers={{
                              click: () => setActiveListingId(item.id)
                            }}
                          >
                            <Popup 
                              closeButton={false} 
                              offset={[0, -10]}
                              autoPan={true}
                            >
                              <MapListingPopupCard 
                                item={item}
                                images={images}
                                listingCity={listingCity}
                                ratingScore={ratingScore}
                                bedrooms={bedrooms}
                                beds={beds}
                                bathrooms={bathrooms}
                                priceLabel={priceLabel}
                                onClose={() => setActiveListingId(null)}
                                onNavigate={navigate}
                                onHeartClick={handleHeartClick}
                                isSaved={isSaved}
                              />
                            </Popup>
                          </Marker>
                        );
                      })}
                    </MapContainer>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Create Wishlist Modal - Exact Airbnb matching Services */}
      {isWishlistModalOpen && (
        <div className={styles.wishlistModalOverlay} onClick={closeWishlistModal}>
          <div className={styles.wishlistModalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.wishlistModalHeader}>
              <h2 className={styles.wishlistModalTitle}>Create wishlist</h2>
              <button 
                type="button" 
                className={styles.wishlistCloseBtn} 
                onClick={closeWishlistModal}
                aria-label="Close"
              >
                <FaTimes size={15} />
              </button>
            </div>

            <div className={styles.wishlistModalBody}>
              <div className={styles.wishlistInputWrapper}>
                <div className={styles.wishlistLabel}>Name</div>
                <input 
                  type="text" 
                  className={styles.wishlistInputField}
                  value={wishlistName}
                  onChange={(e) => {
                    if (e.target.value.length <= 50) {
                      setWishlistName(e.target.value);
                    }
                  }}
                  autoFocus
                  maxLength={50}
                  placeholder="e.g. Summer Vacation, Jaipur Trips"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && wishlistName.trim()) {
                      handleCreateWishlist();
                    }
                  }}
                />
              </div>
              <div className={styles.wishlistCharCount}>
                {wishlistName.length}/50 characters
              </div>
            </div>

            <div className={styles.wishlistModalFooter}>
              <button 
                type="button" 
                className={styles.wishlistCancelBtn} 
                onClick={closeWishlistModal}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className={styles.wishlistCreateBtn} 
                disabled={!wishlistName.trim()}
                onClick={handleCreateWishlist}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
