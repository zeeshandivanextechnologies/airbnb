import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaHeart, 
  FaEllipsisH, 
  FaShare, 
  FaTimes, 
  FaStar,
  FaEnvelope,
  FaCommentDots,
  FaWhatsapp,
  FaFacebookMessenger,
  FaFacebook,
  FaLink
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { BsCalendar4 } from "react-icons/bs";
import { FiPlus, FiMinus, FiCopy, FiLink2 } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { TbLinkOff } from "react-icons/tb";
import styles from "../../components/styles/Wishlists.module.css";
import { getStoredWishlists, saveWishlists, addWishlist } from "../../utils/wishlistStorage";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import toast from "react-hot-toast";
import { 
  addMonths, 
  subMonths, 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isBefore, 
  startOfDay 
} from "date-fns";

// Airbnb Map Pin Icon
const createPinIcon = (label) => {
  return L.divIcon({
    className: "custom-wishlist-pin",
    html: `
      <div style="
        background: #ffffff;
        color: #222222;
        padding: 6px 12px;
        border-radius: 20px;
        font-weight: 700;
        font-size: 13px;
        box-shadow: 0 4px 14px rgba(0,0,0,0.22);
        display: flex;
        align-items: center;
        gap: 4px;
        transform: translate(-50%, -50%);
        white-space: nowrap;
        border: 1px solid #ebebeb;
      ">
        <span>${label || '★ 4.9'}</span>
      </div>
    `,
    iconSize: [80, 32],
    iconAnchor: [40, 16]
  });
};

const CITY_COORDINATES = {
  'jaipur': [26.9124, 75.7873],
  'sawai madhopur': [25.9928, 76.3533],
  'delhi': [28.6139, 77.2090],
  'rome': [41.9028, 12.4964],
  'mumbai': [19.0760, 72.8777],
  'bengaluru': [12.9716, 77.5946],
  'udaipur': [24.5854, 73.7125],
  'goa': [15.2993, 74.1240]
};

const getCoords = (item, idx = 0) => {
  const text = `${item.title || ''} ${item.location || ''} ${item.city || ''}`.toLowerCase();
  for (const [city, coords] of Object.entries(CITY_COORDINATES)) {
    if (text.includes(city)) {
      return [coords[0] + (idx * 0.006), coords[1] + (idx * 0.006)];
    }
  }
  return [26.9124 + (idx * 0.008), 75.7873 + (idx * 0.008)];
};

function MapFlyController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 11, { animate: true, duration: 1 });
    }
  }, [center, map]);
  return null;
}

function WishlistDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [wishlists, setWishlists] = useState(getStoredWishlists());
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [showShareOverviewModal, setShowShareOverviewModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMoreOptionsModal, setShowMoreOptionsModal] = useState(false);
  const [isLinkDeactivated, setIsLinkDeactivated] = useState(false);

  // Dates dropdown states matching Header.jsx
  const [showDatesDropdown, setShowDatesDropdown] = useState(false);
  const [datesTab, setDatesTab] = useState('dates');
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedFlexibleMonths, setSelectedFlexibleMonths] = useState([]);
  const datesContainerRef = useRef(null);
  const monthsScrollRef = useRef(null);

  // Guests dropdown states matching Header.jsx with local storage sync
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [adultsCount, setAdultsCount] = useState(() => {
    const val = localStorage.getItem('airbnb_search_adults');
    return val !== null ? Number(val) : 1;
  });
  const [childrenCount, setChildrenCount] = useState(() => {
    const val = localStorage.getItem('airbnb_search_children');
    return val !== null ? Number(val) : 0;
  });
  const [infantsCount, setInfantsCount] = useState(() => {
    const val = localStorage.getItem('airbnb_search_infants');
    return val !== null ? Number(val) : 0;
  });
  const [petsCount, setPetsCount] = useState(() => {
    const val = localStorage.getItem('airbnb_search_pets');
    return val !== null ? Number(val) : 0;
  });
  const guestsContainerRef = useRef(null);

  const updateGuests = (newAdults, newChildren, newInfants, newPets) => {
    setAdultsCount(newAdults);
    setChildrenCount(newChildren);
    setInfantsCount(newInfants);
    setPetsCount(newPets);
    try {
      localStorage.setItem('airbnb_search_adults', newAdults);
      localStorage.setItem('airbnb_search_children', newChildren);
      localStorage.setItem('airbnb_search_infants', newInfants);
      localStorage.setItem('airbnb_search_pets', newPets);
      window.dispatchEvent(new CustomEvent('airbnb_search_guests_updated', {
        detail: { adults: newAdults, children: newChildren, infants: newInfants, pets: newPets }
      }));
    } catch (e) {}
  };

  const flexibleMonths = Array.from({ length: 12 }).map((_, i) => addMonths(new Date(), i));

  // Close dropdowns on outside click and listen to external updates
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (datesContainerRef.current && !datesContainerRef.current.contains(e.target)) {
        setShowDatesDropdown(false);
      }
      if (guestsContainerRef.current && !guestsContainerRef.current.contains(e.target)) {
        setShowGuestsDropdown(false);
      }
    };

    const handleGuestsSync = (e) => {
      if (e.detail) {
        setAdultsCount(e.detail.adults);
        setChildrenCount(e.detail.children);
        setInfantsCount(e.detail.infants);
        setPetsCount(e.detail.pets);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("airbnb_search_guests_updated", handleGuestsSync);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("airbnb_search_guests_updated", handleGuestsSync);
    };
  }, []);

  const getGuestsButtonText = () => {
    let guests = adultsCount + childrenCount;
    let text = [];
    if (guests > 0) text.push(`${guests} guest${guests > 1 ? 's' : ''}`);
    if (infantsCount > 0) text.push(`${infantsCount} infant${infantsCount > 1 ? 's' : ''}`);
    if (petsCount > 0) text.push(`${petsCount} pet${petsCount > 1 ? 's' : ''}`);
    
    if (text.length === 0) return 'Add guests';
    return text.join(', ');
  };

  const getDatesButtonText = () => {
    if (datesTab === 'flexible' && selectedFlexibleMonths.length > 0) {
      return selectedFlexibleMonths.join(', ');
    }
    if (checkInDate && checkOutDate) {
      return `${format(checkInDate, 'MMM d')} – ${format(checkOutDate, 'MMM d')}`;
    } else if (checkInDate) {
      return `${format(checkInDate, 'MMM d')} – Add check-out`;
    }
    return 'Add dates';
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const first = user.firstName ? user.firstName.trim().charAt(0).toUpperCase() : '';
    const last = user.lastName ? user.lastName.trim().charAt(0).toUpperCase() : '';
    return `${first}${last}`.trim() || (user.firstName ? user.firstName.substring(0, 2).toUpperCase() : 'U');
  };

  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
  const userAvatar = user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";

  const handleShareOption = (platform) => {
    if (isLinkDeactivated) {
      toast.error("Invitation link is deactivated. Please reactivate it from options.");
      return;
    }
    const shareUrl = window.location.href;
    const shareText = `Join my wishlist: ${currentWishlist.title}! Check it out here: ${shareUrl}`;
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    switch (platform) {
      case 'copy':
        navigator.clipboard?.writeText(shareUrl).then(() => {
          toast.success("Link copied to clipboard!");
        }).catch(() => toast.error("Failed to copy link"));
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(`Join my wishlist: ${currentWishlist.title}`)}&body=${encodedText}`, '_blank');
        break;
      case 'messages':
        window.open(`sms:?&body=${encodedText}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
        break;
      case 'messenger':
        window.open(`https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=292787834164101&redirect_uri=${encodedUrl}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
        break;
      default:
        navigator.clipboard?.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
        break;
    }
  };

  const handleDateClick = (day) => {
    if (isBefore(day, startOfDay(new Date()))) return;

    if (!checkInDate || (checkInDate && checkOutDate)) {
      setCheckInDate(day);
      setCheckOutDate(null);
    } else if (checkInDate && !checkOutDate) {
      if (isBefore(day, checkInDate)) {
        setCheckInDate(day);
        setCheckOutDate(null);
      } else {
        setCheckOutDate(day);
        setShowDatesDropdown(false);
        toast.success(`Dates set: ${format(checkInDate, 'MMM d')} – ${format(day, 'MMM d')}`);
      }
    }
  };

  const toggleFlexibleMonth = (monthStr) => {
    setSelectedFlexibleMonths(prev => 
      prev.includes(monthStr) ? prev.filter(m => m !== monthStr) : [...prev, monthStr]
    );
  };

  const scrollMonthsLeft = () => {
    if (monthsScrollRef.current) {
      monthsScrollRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const scrollMonthsRight = () => {
    if (monthsScrollRef.current) {
      monthsScrollRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  const renderMonthGrid = (monthDate) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    let days = [];
    let day = startDate;
    const today = startOfDay(new Date());

    while (day <= endDate) {
      const formattedDate = format(day, "d");
      const isPast = isBefore(day, today);
      const isSameMonth = day.getMonth() === monthStart.getMonth();
      const dKey = new Date(day);

      const isCheckIn = checkInDate && day.getTime() === checkInDate.getTime();
      const isCheckOut = checkOutDate && day.getTime() === checkOutDate.getTime();
      const isBetween = checkInDate && checkOutDate && day > checkInDate && day < checkOutDate;

      days.push(
        <div 
          key={dKey.toString()} 
          onClick={() => {
            if (isSameMonth && !isPast) {
              handleDateClick(dKey);
            }
          }}
          className={`
            ${styles.calDay} 
            ${!isSameMonth ? styles.calEmpty : ''} 
            ${isPast && isSameMonth ? styles.calPast : ''}
            ${(isCheckIn || isCheckOut) && isSameMonth ? styles.calActive : ''}
            ${isBetween && isSameMonth ? styles.calInRange : ''}
          `}
        >
          {isSameMonth ? formattedDate : ''}
        </div>
      );
      day = new Date(day.setDate(day.getDate() + 1));
    }
    return days;
  };

  useEffect(() => {
    const handleUpdate = () => {
      setWishlists(getStoredWishlists());
    };
    window.addEventListener('airbnb_wishlists_updated', handleUpdate);
    return () => window.removeEventListener('airbnb_wishlists_updated', handleUpdate);
  }, []);

  // Find target wishlist or fallback to first
  const currentWishlist = wishlists.find(w => String(w.id) === String(id)) || wishlists[0] || {
    id: id || 'recently-viewed',
    title: 'Wishlist',
    items: []
  };

  const handleRemoveFromWishlist = (e, item) => {
    e.stopPropagation();
    
    const updated = wishlists.map(wl => {
      if (wl.id === currentWishlist.id) {
        return {
          ...wl,
          items: (wl.items || []).filter(i => String(i.id) !== String(item.id))
        };
      }
      return wl;
    });

    saveWishlists(updated);
    toast.success(`Removed "${item.title}" from ${currentWishlist.title}!`);
  };

  const mapCenter = currentWishlist.items && currentWishlist.items.length > 0
    ? getCoords(currentWishlist.items[0], 0)
    : [26.9124, 75.7873];

  return (
    <div className={`container-fluid ${styles.pageContainer}`}>
      {/* Split Screen Layout (Left Cards, Right Map) */}
      <div className={`row ${styles.wishlistDetailRow}`}>
        {/* Left Side: Wishlist Items */}
        <div className={`col-lg-8 col-xl-8 ${styles.wishlistItemsCol}`}>
          {/* Top Navigation Row */}
          <div className={styles.detailHeader}>
            <button
              className={styles.backBtn}
              onClick={() => navigate("/wishlists")}
              aria-label="Back to wishlists"
            >
              <FaChevronLeft size={16} />
            </button>
            <button
              className={styles.moreOptionsBtn}
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
              }}
              title="Share / Options"
            >
              <FaEllipsisH size={18} />
            </button>
          </div>

          {/* Title */}
          <h1 className={styles.pageTitle} style={{ fontSize: '2rem', fontWeight: 700, margin: '8px 0 16px' }}>
            {currentWishlist.title}
          </h1>

          {/* Filter / Action Pills with Dates & Guests Dropdowns */}
          <div className={styles.filterPillsRow} style={{ position: 'relative' }}>
            <div ref={datesContainerRef} style={{ display: 'inline-block' }}>
              <button 
                className={`${styles.filterPill} ${showDatesDropdown ? styles.filterPillActive : ''}`}
                onClick={() => {
                  setShowDatesDropdown(!showDatesDropdown);
                  setShowGuestsDropdown(false);
                }}
              >
                {getDatesButtonText()}
              </button>

              {/* Exactly Styled Airbnb Dates Dropdown from Header.jsx */}
              {showDatesDropdown && (
                <div className={styles.wishlistDatesDropdown} onClick={(e) => e.stopPropagation()}>
                  {/* Tabs */}
                  <div className={styles.datesTabsContainer}>
                    <div className={styles.datesTabs}>
                      <button 
                        className={`${styles.datesTab} ${datesTab === 'dates' ? styles.datesTabActive : ''}`}
                        onClick={() => setDatesTab('dates')}
                      >
                        Dates
                      </button>
                      <button 
                        className={`${styles.datesTab} ${datesTab === 'flexible' ? styles.datesTabActive : ''}`}
                        onClick={() => setDatesTab('flexible')}
                      >
                        Flexible
                      </button>
                    </div>
                  </div>

                  {datesTab === 'dates' ? (
                    <div>
                      <div className={styles.fakeCalendars}>
                        {/* Left Calendar */}
                        <div className={styles.fakeCalendar}>
                          <div className={styles.calHeader}>
                            <button 
                              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                              disabled={isBefore(startOfMonth(subMonths(currentMonth, 1)), startOfMonth(new Date()))}
                              style={{ background: 'none', border: 'none', cursor: isBefore(startOfMonth(subMonths(currentMonth, 1)), startOfMonth(new Date())) ? 'not-allowed' : 'pointer', padding: 0 }}
                            >
                              <FaChevronLeft size={12} color={isBefore(startOfMonth(subMonths(currentMonth, 1)), startOfMonth(new Date())) ? '#dddddd' : '#222'}/>
                            </button>
                            <span>{format(currentMonth, 'MMMM yyyy')}</span>
                            <div></div>
                          </div>
                          <div className={styles.calGrid}>
                            {['S','M','T','W','T','F','S'].map(d => <div key={d} className={styles.calDayName}>{d}</div>)}
                            {renderMonthGrid(currentMonth)}
                          </div>
                        </div>
                        
                        {/* Right Calendar */}
                        <div className={styles.fakeCalendar}>
                          <div className={styles.calHeader}>
                            <div></div>
                            <span>{format(addMonths(currentMonth, 1), 'MMMM yyyy')}</span>
                            <button 
                              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                              <FaChevronRight size={12} color="#222"/>
                            </button>
                          </div>
                          <div className={styles.calGrid}>
                            {['S','M','T','W','T','F','S'].map(d => <div key={d} className={styles.calDayName}>{d}</div>)}
                            {renderMonthGrid(addMonths(currentMonth, 1))}
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.exactDatesOptions}>
                        <button className={styles.exactOptBtnActive}>Exact dates</button>
                        <button className={styles.exactOptBtn}>± 1 day</button>
                        <button className={styles.exactOptBtn}>± 2 days</button>
                        <button className={styles.exactOptBtn}>± 3 days</button>
                        <button className={styles.exactOptBtn}>± 7 days</button>
                        <button 
                          className={styles.exactOptBtn}
                          onClick={() => {
                            setCheckInDate(null);
                            setCheckOutDate(null);
                            setShowDatesDropdown(false);
                            toast.success("Dates cleared");
                          }}
                        >
                          Clear dates
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.flexibleContent}>
                      <h3 className={styles.flexTitle}>How long would you like to stay?</h3>
                      <div className={styles.flexDurationOpts}>
                        <button className={styles.flexDurBtn}>Weekend</button>
                        <button className={styles.flexDurBtn}>Week</button>
                        <button className={`${styles.flexDurBtn} ${styles.flexDurBtnActive}`}>Month</button>
                      </div>

                      <h3 className={styles.flexTitle}>When do you want to go?</h3>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <button 
                          onClick={scrollMonthsLeft} 
                          style={{ background: 'white', border: '1px solid #ddd', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: '8px' }}
                        >
                          <FaChevronLeft size={12}/>
                        </button>
                        
                        <div className={styles.flexMonthsRow} ref={monthsScrollRef}>
                          {flexibleMonths.map((m, idx) => {
                            const monthStr = format(m, 'MMM');
                            const isActive = selectedFlexibleMonths.includes(monthStr);
                            return (
                              <div 
                                key={idx} 
                                className={`${styles.flexMonthCard} ${isActive ? styles.flexMonthActive : ''}`}
                                onClick={() => toggleFlexibleMonth(monthStr)}
                              >
                                <BsCalendar4 size={24} color="#222"/>
                                <span>{format(m, 'MMMM')}<br/>{format(m, 'yyyy')}</span>
                              </div>
                            );
                          })}
                        </div>

                        <button 
                          onClick={scrollMonthsRight} 
                          style={{ background: 'white', border: '1px solid #ddd', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: '8px' }}
                        >
                          <FaChevronRight size={12}/>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div ref={guestsContainerRef} style={{ display: 'inline-block' }}>
              <button 
                className={`${styles.filterPill} ${showGuestsDropdown ? styles.filterPillActive : ''}`}
                onClick={() => {
                  setShowGuestsDropdown(!showGuestsDropdown);
                  setShowDatesDropdown(false);
                }}
              >
                {getGuestsButtonText()}
              </button>

              {/* Exactly Styled Airbnb Guests Dropdown from Header.jsx */}
              {showGuestsDropdown && (
                <div className={styles.wishlistGuestsDropdown} onClick={(e) => e.stopPropagation()}>
                  {/* Adults */}
                  <div className={styles.wishlistGuestRow}>
                    <div className={styles.wishlistGuestInfo}>
                      <div className={styles.wishlistGuestTitle}>Adults</div>
                      <div className={styles.wishlistGuestSubtitle}>Ages 13 or above</div>
                    </div>
                    <div className={styles.wishlistGuestControls}>
                      <button 
                        type="button"
                        className={styles.wishlistGuestCtrlBtn} 
                        disabled={adultsCount <= 1 && (childrenCount > 0 || infantsCount > 0 || petsCount > 0)} 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGuests(Math.max(0, adultsCount - 1), childrenCount, infantsCount, petsCount);
                        }}
                      >
                        <FiMinus size={14}/>
                      </button>
                      <span className={styles.wishlistGuestCount}>{adultsCount}</span>
                      <button 
                        type="button"
                        className={styles.wishlistGuestCtrlBtn} 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGuests(adultsCount + 1, childrenCount, infantsCount, petsCount);
                        }}
                      >
                        <FiPlus size={14}/>
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className={styles.wishlistGuestRow}>
                    <div className={styles.wishlistGuestInfo}>
                      <div className={styles.wishlistGuestTitle}>Children</div>
                      <div className={styles.wishlistGuestSubtitle}>Ages 2–12</div>
                    </div>
                    <div className={styles.wishlistGuestControls}>
                      <button 
                        type="button"
                        className={styles.wishlistGuestCtrlBtn} 
                        disabled={childrenCount === 0} 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGuests(adultsCount, Math.max(0, childrenCount - 1), infantsCount, petsCount);
                        }}
                      >
                        <FiMinus size={14}/>
                      </button>
                      <span className={styles.wishlistGuestCount}>{childrenCount}</span>
                      <button 
                        type="button"
                        className={styles.wishlistGuestCtrlBtn} 
                        onClick={(e) => { 
                          e.stopPropagation();
                          const newAdults = adultsCount === 0 ? 1 : adultsCount;
                          updateGuests(newAdults, childrenCount + 1, infantsCount, petsCount); 
                        }}
                      >
                        <FiPlus size={14}/>
                      </button>
                    </div>
                  </div>

                  {/* Infants */}
                  <div className={styles.wishlistGuestRow}>
                    <div className={styles.wishlistGuestInfo}>
                      <div className={styles.wishlistGuestTitle}>Infants</div>
                      <div className={styles.wishlistGuestSubtitle}>Under 2</div>
                    </div>
                    <div className={styles.wishlistGuestControls}>
                      <button 
                        type="button"
                        className={styles.wishlistGuestCtrlBtn} 
                        disabled={infantsCount === 0} 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGuests(adultsCount, childrenCount, Math.max(0, infantsCount - 1), petsCount);
                        }}
                      >
                        <FiMinus size={14}/>
                      </button>
                      <span className={styles.wishlistGuestCount}>{infantsCount}</span>
                      <button 
                        type="button"
                        className={styles.wishlistGuestCtrlBtn} 
                        onClick={(e) => { 
                          e.stopPropagation();
                          const newAdults = adultsCount === 0 ? 1 : adultsCount;
                          updateGuests(newAdults, childrenCount, infantsCount + 1, petsCount); 
                        }}
                      >
                        <FiPlus size={14}/>
                      </button>
                    </div>
                  </div>

                  {/* Pets */}
                  <div className={styles.wishlistGuestRow}>
                    <div className={styles.wishlistGuestInfo}>
                      <div className={styles.wishlistGuestTitle}>Pets</div>
                      <div className={styles.wishlistGuestSubtitle} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                        Bringing a service animal?
                      </div>
                    </div>
                    <div className={styles.wishlistGuestControls}>
                      <button 
                        type="button"
                        className={styles.wishlistGuestCtrlBtn} 
                        disabled={petsCount === 0} 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGuests(adultsCount, childrenCount, infantsCount, Math.max(0, petsCount - 1));
                        }}
                      >
                        <FiMinus size={14}/>
                      </button>
                      <span className={styles.wishlistGuestCount}>{petsCount}</span>
                      <button 
                        type="button"
                        className={styles.wishlistGuestCtrlBtn} 
                        onClick={(e) => { 
                          e.stopPropagation();
                          const newAdults = adultsCount === 0 ? 1 : adultsCount;
                          updateGuests(newAdults, childrenCount, infantsCount, petsCount + 1); 
                        }}
                      >
                        <FiPlus size={14}/>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Share / Invite Pill matching user screenshot */}
            <button 
              type="button"
              className={styles.shareAvatarPill}
              onClick={() => setShowShareOverviewModal(true)}
              title="Share Wishlist"
            >
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.firstName || "User"} 
                  className={styles.shareAvatarImg} 
                />
              ) : (
                <img 
                  src={userAvatar} 
                  alt="Owner" 
                  className={styles.shareAvatarImg} 
                />
              )}
              <FiPlus className={styles.sharePlusIcon} />
            </button>
          </div>

          {/* 1. Share Overview Modal */}
          {showShareOverviewModal && (
            <div className={styles.shareModalOverlay} onClick={() => setShowShareOverviewModal(false)}>
              <div className={styles.shareModalCard} onClick={(e) => e.stopPropagation()}>
                <div className={styles.shareModalHeader}>
                  <h3 className={styles.shareModalTitleCenter}>{currentWishlist.title}</h3>
                  <button 
                    type="button"
                    className={styles.shareModalCloseBtn}
                    onClick={() => setShowShareOverviewModal(false)}
                    aria-label="Close"
                  >
                    <IoMdClose />
                  </button>
                </div>

                <div className={styles.shareOwnerRow}>
                  <img 
                    src={userAvatar} 
                    alt="Owner" 
                    className={styles.shareOwnerAvatar} 
                  />
                  <div>
                    <div className={styles.shareOwnerName}>You</div>
                    <div className={styles.shareOwnerRole}>Owner</div>
                  </div>
                </div>

                <button 
                  type="button"
                  className={styles.sharePrimaryBtn}
                  onClick={() => {
                    setShowShareOverviewModal(false);
                    setShowInviteModal(true);
                  }}
                >
                  Invite others
                </button>

                <button 
                  type="button"
                  className={styles.shareSecondaryBtn}
                  onClick={() => {
                    setShowShareOverviewModal(false);
                    setShowMoreOptionsModal(true);
                  }}
                >
                  More options
                </button>
              </div>
            </div>
          )}

          {/* 2. Invite Others to Join Modal */}
          {showInviteModal && (
            <div className={styles.shareModalOverlay} onClick={() => setShowInviteModal(false)}>
              <div className={styles.inviteModalCard} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h2 className={styles.inviteModalTitle}>Invite others to join</h2>
                  <button 
                    type="button"
                    className={styles.shareModalCloseBtn}
                    onClick={() => setShowInviteModal(false)}
                    aria-label="Close"
                    style={{ position: 'static', transform: 'none' }}
                  >
                    <IoMdClose />
                  </button>
                </div>

                <div className={styles.inviteWishlistBadge}>
                  <img 
                    src={(currentWishlist.items && currentWishlist.items[0]?.image) || userAvatar} 
                    alt="Wishlist preview"
                    className={styles.inviteWishlistImg} 
                  />
                  <div className={styles.inviteWishlistInfo}>
                    Join my wishlist: {currentWishlist.title} · {(currentWishlist.items || []).length} saved
                  </div>
                </div>

                <div className={styles.inviteGrid}>
                  <button 
                    type="button"
                    className={styles.inviteOptionBtn}
                    onClick={() => handleShareOption('copy')}
                  >
                    <span className={styles.inviteOptionIcon}><FiCopy /></span>
                    <span>Copy Link</span>
                  </button>

                  <button 
                    type="button"
                    className={styles.inviteOptionBtn}
                    onClick={() => handleShareOption('email')}
                  >
                    <span className={styles.inviteOptionIcon}><FaEnvelope /></span>
                    <span>Email</span>
                  </button>

                  <button 
                    type="button"
                    className={styles.inviteOptionBtn}
                    onClick={() => handleShareOption('messages')}
                  >
                    <span className={styles.inviteOptionIcon}><FaCommentDots /></span>
                    <span>Messages</span>
                  </button>

                  <button 
                    type="button"
                    className={styles.inviteOptionBtn}
                    onClick={() => handleShareOption('whatsapp')}
                  >
                    <span className={styles.inviteOptionIcon} style={{ color: '#25D366' }}><FaWhatsapp /></span>
                    <span>WhatsApp</span>
                  </button>

                  <button 
                    type="button"
                    className={styles.inviteOptionBtn}
                    onClick={() => handleShareOption('messenger')}
                  >
                    <span className={styles.inviteOptionIcon} style={{ color: '#0084FF' }}><FaFacebookMessenger /></span>
                    <span>Messenger</span>
                  </button>

                  <button 
                    type="button"
                    className={styles.inviteOptionBtn}
                    onClick={() => handleShareOption('facebook')}
                  >
                    <span className={styles.inviteOptionIcon} style={{ color: '#1877F2' }}><FaFacebook /></span>
                    <span>Facebook</span>
                  </button>

                  <button 
                    type="button"
                    className={styles.inviteOptionBtn}
                    onClick={() => handleShareOption('twitter')}
                  >
                    <span className={styles.inviteOptionIcon}><FaXTwitter /></span>
                    <span>Twitter</span>
                  </button>
                </div>

                <div className={styles.inviteFooterNote}>
                  Once you share this link, anyone can view your wishlist. <span className={styles.inviteLearnMoreLink}>Learn more</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. More Options Modal */}
          {showMoreOptionsModal && (
            <div className={styles.shareModalOverlay} onClick={() => setShowMoreOptionsModal(false)}>
              <div className={styles.moreOptionsModalCard} onClick={(e) => e.stopPropagation()}>
                <div className={styles.moreOptionsHeader}>
                  <button 
                    type="button"
                    className={styles.moreOptionsBackBtn}
                    onClick={() => {
                      setShowMoreOptionsModal(false);
                      setShowShareOverviewModal(true);
                    }}
                    title="Back"
                  >
                    <FaChevronLeft size={16} />
                  </button>
                  <h3 className={styles.moreOptionsTitle}>More options</h3>
                  <button 
                    type="button"
                    className={styles.shareModalCloseBtn}
                    onClick={() => setShowMoreOptionsModal(false)}
                    aria-label="Close"
                  >
                    <IoMdClose />
                  </button>
                </div>

                <div 
                  className={styles.deactivateItemRow}
                  onClick={() => {
                    const nextStatus = !isLinkDeactivated;
                    setIsLinkDeactivated(nextStatus);
                    if (nextStatus) {
                      toast.success("Invitation link has been deactivated.");
                    } else {
                      toast.success("Invitation link reactivated!");
                    }
                  }}
                >
                  <TbLinkOff className={styles.deactivateIcon} style={{ color: isLinkDeactivated ? '#c13515' : '#222222' }} />
                  <div>
                    <div className={styles.deactivateHeading}>
                      {isLinkDeactivated ? "Reactivate invitation link" : "Deactivate invitation link"}
                    </div>
                    <div className={styles.deactivateSubtext}>
                      {isLinkDeactivated 
                        ? "Click here to reactivate sharing for this wishlist."
                        : "You'll be able to create a new invitation link later."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentWishlist.items && currentWishlist.items.length > 0 ? (
            <div className="row">
              {currentWishlist.items.map((item, idx) => (
                <div key={item.id || idx} className="col-lg-4 col-md-4 col-sm-12 mb-3">
                  <div 
                    className={styles.listingCard}
                    onClick={() => {
                      const isExp = item.type === 'Experience' || 
                        (item.category && (
                          item.category.toLowerCase().includes('experience') || 
                          item.category.toLowerCase().includes('tour') || 
                          item.category.toLowerCase().includes('jaipur') || 
                          item.category.toLowerCase().includes('goa') ||
                          item.category.toLowerCase().includes('outdoors')
                        ));
                      if (item.id && !isNaN(Number(item.id))) {
                        navigate(isExp ? `/experience/${item.id}` : `/service/${item.id}`);
                      } else {
                        navigate(isExp ? '/experiences' : '/services');
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.listingImageWrapper}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className={styles.listingImg}
                      />

                      {/* Heart Button: Clicking removes item with React Hot Toast */}
                      <button
                        type="button"
                        className={styles.heartBtn}
                        onClick={(e) => handleRemoveFromWishlist(e, item)}
                        title="Remove from wishlist"
                      >
                        <FaHeart style={{ color: '#e51d53' }} />
                      </button>
                    </div>

                    <h3 className={styles.listingTitle} style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 2px' }}>
                      {item.title}
                    </h3>
                    <p className={styles.listingHost} style={{ fontSize: '13px', color: '#717171', margin: '0 0 4px' }}>
                      {item.category || item.host || 'Service'}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', color: '#222', marginBottom: '2px' }}>
                      <FaStar color="#222" size={10} />
                      <span style={{ fontWeight: 600 }}>5.0</span>
                      <span style={{ color: '#717171' }}>· {item.reviews_count || 1} review</span>
                    </div>

                    <p style={{ fontSize: '13.5px', color: '#222', margin: 0 }}>
                      From <strong style={{ fontWeight: 700 }}>{item.price || '₹2,500'}</strong> / guest
                    </p>

                    <button 
                      type="button" 
                      className={styles.addNoteBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        toast('Note feature coming soon!', { icon: '📝' });
                      }}
                    >
                      Add note
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#717171' }}>
              <p style={{ fontSize: '16px', fontWeight: 500 }}>No items in this wishlist yet.</p>
              <button 
                className={styles.createBtn} 
                onClick={() => navigate('/services')}
                style={{ marginTop: '12px' }}
              >
                Explore services
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Map matching Screenshot */}
        <div className={`col-lg-4 col-xl-4 d-none d-lg-block ${styles.wishlistMapCol}`}>
          <MapContainer 
            center={mapCenter} 
            zoom={11} 
            scrollWheelZoom={true}
            zoomControl={false}
            attributionControl={false}
            className={styles.detailMapFrame}
          >
            <TileLayer
              url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            />

            <MapFlyController center={mapCenter} />

            {/* Pins on Map for all wishlist items */}
            {(currentWishlist.items || []).map((item, idx) => {
              const pos = getCoords(item, idx);
              return (
                <Marker 
                  key={item.id || idx} 
                  position={pos}
                  icon={createPinIcon(item.price || '₹2,500')}
                >
                  <Popup>
                    <div style={{ padding: '4px', minWidth: '140px' }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#222' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#717171' }}>
                        {item.price || '₹2,500'}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default WishlistDetail;
