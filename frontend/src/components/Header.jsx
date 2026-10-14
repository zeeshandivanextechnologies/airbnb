import { useState, useEffect, useRef } from 'react';
import styles from './styles/Header.module.css';
import { FaAirbnb, FaGlobe, FaSearch, FaBars, FaUserCircle, FaHome, FaConciergeBell, FaTimes, FaApple, FaGoogle, FaArrowLeft, FaRegQuestionCircle, FaChevronLeft, FaChevronRight, FaRegHeart, FaRegCommentAlt, FaRegBell, FaCog } from 'react-icons/fa';
import { MdOutlineAttractions } from 'react-icons/md';
import { FiNavigation, FiPlus, FiMinus } from 'react-icons/fi';
import { BsBuildings, BsCalendar4 } from 'react-icons/bs';
import { TbBeach } from 'react-icons/tb';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { addMonths, subMonths, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isBefore, startOfDay } from 'date-fns';
import AuthModal from './AuthModal';
import toast from 'react-hot-toast';

import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, updateUser } from '../store/slices/authSlice.js';
import { useTranslation } from 'react-i18next';
import { applyGoogleTranslate } from '../i18n.js';
import { getUserProfileApi, updateUserProfileApi } from '../services/api.js';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isLoggedIn = isAuthenticated;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const isSearchExpandedRef = useRef(false);
  const expandScrollY = useRef(0);
  const expandTime = useRef(0);
  
  useEffect(() => {
    isSearchExpandedRef.current = isSearchExpanded;
    if (isSearchExpanded) {
      expandScrollY.current = window.scrollY;
      expandTime.current = Date.now();
    }
  }, [isSearchExpanded]);

  // Real-time verification: automatically log out if account was blocked by administrator
  useEffect(() => {
    if (isLoggedIn && (user?.email || user?.id)) {
      const checkBlockedStatus = async () => {
        try {
          const endpoint = user.id ? `?id=${user.id}` : `?email=${encodeURIComponent(user.email)}`;
          const res = await fetch(`http://localhost:5000/api/auth/profile${endpoint}`);
          const data = await res.json();
          if (res.status === 403 || data.isBlocked || String(data.user?.status || '').toUpperCase() === 'BLOCKED') {
            dispatch(logoutUser());
            toast.error('Your account has been blocked by administrator.');
            navigate('/');
          }
        } catch (e) {
          // Network error ignored
        }
      };
      checkBlockedStatus();
    }
  }, [isLoggedIn, user, dispatch]);

  const searchContainerRef = useRef(null);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsIsRendered, setSettingsIsRendered] = useState(false);
  const [settingsIsVisible, setSettingsIsVisible] = useState(false);
  const [settingsTab, setSettingsTab] = useState('language');
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem('airbnb_preferred_language') || 'English'
  );
  const [selectedRegion, setSelectedRegion] = useState('United States');
  const [selectedCurrency, setSelectedCurrency] = useState(
    localStorage.getItem('airbnb_preferred_currency') || 'INR'
  );
  const [automaticTranslation, setAutomaticTranslation] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('');

  // Sync user profile settings (language, currency, translation) from Backend
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!isLoggedIn || (!user?.id && !user?.email)) {
        const localLang = localStorage.getItem('airbnb_preferred_language');
        if (localLang) {
          setSelectedLanguage(localLang);
        }
        const localCurr = localStorage.getItem('airbnb_preferred_currency');
        if (localCurr) {
          setSelectedCurrency(localCurr);
        }
        return;
      }

      try {
        const res = await getUserProfileApi(user.id || user.email);
        if (res.success && res.user) {
          if (res.user.preferredLanguage) {
            setSelectedLanguage(res.user.preferredLanguage);
            localStorage.setItem('airbnb_preferred_language', res.user.preferredLanguage);
          }
          if (res.user.preferredCurrency) {
            setSelectedCurrency(res.user.preferredCurrency);
            localStorage.setItem('airbnb_preferred_currency', res.user.preferredCurrency);
          }
          if (res.user.automaticTranslation !== undefined) {
            setAutomaticTranslation(res.user.automaticTranslation);
          }
        }
      } catch (e) {
        // Fallback to local storage if offline
      }
    };

    fetchUserSettings();
  }, [isLoggedIn, user?.id, user?.email]);

  const handleLanguageSelect = async (langName, region) => {
    setSelectedLanguage(langName);
    setSelectedRegion(region);
    setShowSettingsModal(false);

    const mappedLang = langName === 'हिन्दी' ? 'Hindi' : langName;
    localStorage.setItem('airbnb_preferred_language', mappedLang);
    if (i18n && i18n.changeLanguage) {
      i18n.changeLanguage(mappedLang);
    }
    applyGoogleTranslate(mappedLang);

    if (isLoggedIn && (user?.id || user?.email)) {
      try {
        await updateUserProfileApi({ preferredLanguage: mappedLang });
        dispatch(updateUser({ preferredLanguage: mappedLang }));
        toast.success(`Language set to ${langName}`);
      } catch (err) {
        // quiet fallback
      }
    } else {
      toast.success(`Language set to ${langName}`);
    }
  };

  const handleTranslationToggle = async (e) => {
    const nextVal = e.target.checked;
    setAutomaticTranslation(nextVal);

    if (isLoggedIn && (user?.id || user?.email)) {
      try {
        await updateUserProfileApi({ automaticTranslation: nextVal });
        dispatch(updateUser({ automaticTranslation: nextVal }));
      } catch (err) {}
    }

    if (nextVal) {
      toast.success('Automatic translation enabled');
    } else {
      toast.success('Automatic translation disabled');
    }
  };

  const handleCurrencySelect = async (currency) => {
    setSelectedCurrency(currency.code);
    setShowSettingsModal(false);
    localStorage.setItem('airbnb_preferred_currency', currency.code);

    if (isLoggedIn && (user?.id || user?.email)) {
      try {
        await updateUserProfileApi({ preferredCurrency: currency.code });
        dispatch(updateUser({ preferredCurrency: currency.code }));
        toast.success(`Currency set to ${currency.code} (${currency.name})`);
      } catch (err) {}
    } else {
      toast.success(`Currency set to ${currency.code} (${currency.name})`);
    }
  };
  const isHostMode = location.pathname.startsWith('/host');

  const dropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);
  const guestsDropdownRef = useRef(null);
  const datesDropdownRef = useRef(null);
  const monthsScrollRef = useRef(null);

  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [showDatesDropdown, setShowDatesDropdown] = useState(false);
  const [datesTab, setDatesTab] = useState('dates'); // 'dates' or 'flexible'
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [selectedFlexibleMonths, setSelectedFlexibleMonths] = useState([]);
  const [adultsCount, setAdultsCount] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infantsCount, setInfantsCount] = useState(0);
  const [petsCount, setPetsCount] = useState(0);

  const getGuestsText = () => {
    let guests = adultsCount + childrenCount;
    let text = [];
    if (guests > 0) text.push(`${guests} guest${guests > 1 ? 's' : ''}`);
    if (infantsCount > 0) text.push(`${infantsCount} infant${infantsCount > 1 ? 's' : ''}`);
    if (petsCount > 0) text.push(`${petsCount} pet${petsCount > 1 ? 's' : ''}`);
    
    if (text.length === 0) return 'Add guests';
    return text.join(', ');
  };

  const getDatesText = () => {
    if (datesTab === 'flexible' && selectedFlexibleMonths.length > 0) {
      return selectedFlexibleMonths.join(', ');
    }
    if (checkInDate && checkOutDate) {
      return `${format(checkInDate, 'MMM d')} – ${format(checkOutDate, 'MMM d')}`;
    } else if (checkInDate) {
      return format(checkInDate, 'MMM d');
    }
    return 'Add dates';
  };

  // Calculate First Name Initial + Last Name Initial
  const getUserInitials = () => {
    if (!user) return 'U';
    const firstInitial = user.firstName ? user.firstName.trim().charAt(0).toUpperCase() : '';
    const lastInitial = user.lastName ? user.lastName.trim().charAt(0).toUpperCase() : '';
    const combined = `${firstInitial}${lastInitial}`.trim();
    return combined || (user.firstName ? user.firstName.substring(0, 2).toUpperCase() : 'U');
  };

  const toggleFlexibleMonth = (monthStr) => {
    setSelectedFlexibleMonths(prev => 
      prev.includes(monthStr) ? prev.filter(m => m !== monthStr) : [...prev, monthStr]
    );
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
        setShowDatesDropdown(false); // Optionally close after selecting check-out
      }
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
            ${styles['cal-day']} 
            ${!isSameMonth ? styles['cal-empty'] : ''} 
            ${isPast && isSameMonth ? styles['cal-past'] : ''}
            ${(isCheckIn || isCheckOut) && isSameMonth ? styles['cal-active'] : ''}
            ${isBetween && isSameMonth ? styles['cal-in-range'] : ''}
          `}
        >
          {isSameMonth ? formattedDate : ''}
        </div>
      );
      day = new Date(day.setDate(day.getDate() + 1));
    }
    return days;
  };

  const scrollMonthsRight = () => {
    if (monthsScrollRef.current) {
      monthsScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  const scrollMonthsLeft = () => {
    if (monthsScrollRef.current) {
      monthsScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const flexibleMonths = Array.from({ length: 12 }).map((_, i) => addMonths(new Date(), i));

  useEffect(() => {
    let timer;
    if (showSettingsModal) {
      setSettingsIsRendered(true);
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";
      timer = setTimeout(() => {
        setSettingsIsVisible(true);
      }, 10);
    } else {
      setSettingsIsVisible(false);
      
      timer = setTimeout(() => {
        setSettingsIsRendered(false);
        document.body.style.overflow = "unset";
        document.body.style.paddingRight = "0px";
      }, 300);
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
      clearTimeout(timer);
    };
  }, [showSettingsModal]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isSearchExpanded &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target) &&
        !event.target.closest(`.${styles['compact-search-pill']}`)
      ) {
        setIsSearchExpanded(false);
      }
      
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
      if (guestsDropdownRef.current && !guestsDropdownRef.current.contains(event.target)) {
        setShowGuestsDropdown(false);
      }
      if (datesDropdownRef.current && !datesDropdownRef.current.contains(event.target)) {
        setShowDatesDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, locationDropdownRef, guestsDropdownRef, datesDropdownRef, isSearchExpanded]);



  useEffect(() => {
    if (showAuthModal || showSettingsModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAuthModal, showSettingsModal]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY > 10) {
            setIsScrolled(true);
            
            // Close if we are expanded, user scrolls more than 20px, and at least 500ms has passed
            // The 500ms delay prevents the browser's automatic layout-shift scroll from instantly closing it
            if (
              isSearchExpandedRef.current && 
              Date.now() - expandTime.current > 500 &&
              Math.abs(currentScrollY - expandScrollY.current) > 20
            ) {
              setIsSearchExpanded(false);
            }
          } else if (currentScrollY === 0) {
            setIsScrolled(false);
            setIsSearchExpanded(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles['custom-header']} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles['header-top']}>
    
        <NavLink to="/" className={styles['header-logo']}>
          <FaAirbnb size={32} />
          <span className={styles['header-logo-text']}>airbnb</span>
        </NavLink>

        <div className={styles['header-center']}>
          <nav className={`${styles['header-nav']} ${(isScrolled && !isSearchExpanded) ? styles.hidden : ''}`}>
            <NavLink to="/" className={({ isActive }) => isActive ? `${styles['nav-item']} ${styles.active}` : styles['nav-item']}>
              <FaGlobe className={styles['nav-icon']} />
              <span>All</span>
            </NavLink>
            <NavLink to="/home" className={({ isActive }) => isActive ? `${styles['nav-item']} ${styles.active}` : styles['nav-item']}>
              <FaHome className={styles['nav-icon']} />
              <span>{t('Home')}</span>
            </NavLink>
            <NavLink to="/experiences" className={({ isActive }) => isActive ? `${styles['nav-item']} ${styles.active}` : styles['nav-item']}>
              <MdOutlineAttractions className={styles['nav-icon']} />
              <span>{t('Experiences')}</span>
            </NavLink>
            <NavLink to="/services" className={({ isActive }) => isActive ? `${styles['nav-item']} ${styles.active}` : styles['nav-item']}>
              <FaConciergeBell className={styles['nav-icon']} />
              <span>{t('Services')}</span>
            </NavLink>
          </nav>
          
          <button 
            className={`${styles['compact-search-pill']} ${(!isScrolled || isSearchExpanded) ? styles.hidden : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsSearchExpanded(true);
            }}
          >
            <span className={styles['compact-text']}>Anywhere</span>
            <span className={styles['compact-divider']}></span>
            <span className={styles['compact-text']}>Anytime</span>
            <span className={styles['compact-divider']}></span>
            <span className={`${styles['compact-text']} ${styles.light}`}>Add guests</span>
            <div className={styles['compact-search-icon']}>
              <FaSearch size={12} />
            </div>
          </button>
        </div>

        {/* Right Section */}
        <div className={styles['header-right']}>
          {isLoggedIn ? (
            <button 
              className={styles['host-link']} 
              onClick={() => navigate(isHostMode ? '/' : '/host')}
            >
              {isHostMode ? 'Switch to travelling' : 'Switch to hosting'}
            </button>
          ) : (
            <button className={styles['host-link']} onClick={() => setShowAuthModal(true)}>
              Become a host
            </button>
          )}

          <div className="d-flex align-items-center gap-2" ref={dropdownRef} style={{ position: 'relative' }}>
            {/* Avatar Button: Shows Initial letters or Uploaded Photo */}
            <button 
              className={styles['user-menu']} 
              onClick={() => {
                if (isLoggedIn) {
                  // Navigate to Profile page or toggle dropdown
                  navigate('/profile');
                } else {
                  // If not logged in, open AuthModal
                  setShowAuthModal(true);
                }
              }}
              title={isLoggedIn ? `Profile: ${user?.firstName || 'User'}` : 'Log in or sign up'}
            >
              {isLoggedIn ? (
                user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="User Profile" 
                    className={styles['user-avatar-img']} 
                  />
                ) : (
                  <div className={styles['user-avatar-initials']}>
                    {getUserInitials()}
                  </div>
                )
              ) : (
                <div className={styles['user-avatar']}>
                  <FaUserCircle />
                </div>
              )}
            </button>
            <button className={styles['user-menu']} onClick={() => setShowUserDropdown(!showUserDropdown)}>
              <FaBars />
            </button>
            
            {showUserDropdown && (
              <div className={styles['user-dropdown']}>
                {isLoggedIn ? (
                  <>
                    <NavLink to="/wishlists" className={styles['dropdown-item']} onClick={() => setShowUserDropdown(false)}>
                      <FaRegHeart className={styles['dropdown-icon']} /> Wishlists
                    </NavLink>
                    <NavLink to="/trips" className={styles['dropdown-item']} onClick={() => setShowUserDropdown(false)}>
                      <FaAirbnb className={styles['dropdown-icon']} /> Trips
                    </NavLink>
                    <NavLink to="/messages" className={styles['dropdown-item']} onClick={() => setShowUserDropdown(false)}>
                      <FaRegCommentAlt className={styles['dropdown-icon']} /> Messages
                    </NavLink>
                    <NavLink to="/profile" className={styles['dropdown-item']} onClick={() => setShowUserDropdown(false)}>
                      <FaUserCircle className={styles['dropdown-icon']} /> Profile
                    </NavLink>
                    
                    <div className={styles['dropdown-divider']}></div>
                    
                    <NavLink to="/notification" className={styles['dropdown-item']} onClick={() => setShowUserDropdown(false)}>
                      <FaRegBell className={styles['dropdown-icon']} /> Notifications
                    </NavLink>
                    <NavLink to="/account-settings" className={styles['dropdown-item']} onClick={() => setShowUserDropdown(false)}>
                      <FaCog className={styles['dropdown-icon']} /> Account settings
                    </NavLink>
                    <button className={styles['dropdown-item']} onClick={() => { setShowSettingsModal(true); setShowUserDropdown(false); }}>
                      <FaGlobe className={styles['dropdown-icon']} /> Languages & currency
                    </button>
                    <button className={styles['dropdown-item']}>
                      <FaRegQuestionCircle className={styles['dropdown-icon']} /> Help Centre
                    </button>
                    
                    <div className={styles['dropdown-divider']}></div>
                    
                    <NavLink to="/hosting/home" className={styles['dropdown-item-host']}>
                      <div className={styles['host-content']}>
                        <span className={styles['host-title']}>Become a host</span>
                        <span className={styles['host-subtitle']}>It's easy to start hosting and earn extra income.</span>
                      </div>
                      <img src="https://a0.muscache.com/pictures/b9adfc39-6e2a-4e5f-b6f3-681b306fae5c.jpg" alt="Host" className={styles['host-image']} />
                    </NavLink>
                    
                    <div className={styles['dropdown-divider']}></div>
                    
                    <NavLink to="/hosting/refer" className={styles['dropdown-item']} onClick={() => setShowUserDropdown(false)}>
                      Refer a host
                    </NavLink>
                    <NavLink to="/find-cost-host" className={styles['dropdown-item']} onClick={() => setShowUserDropdown(false)}>
                      Find a co-host
                    </NavLink>
                    
                    <div className={styles['dropdown-divider']}></div>
                    
                    <button 
                      className={styles['dropdown-item']} 
                      onClick={() => { 
                        dispatch(logoutUser()); 
                        toast.success('Logged out successfully');
                        setShowUserDropdown(false); 
                        navigate('/');
                      }}
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <button className={styles['dropdown-item']} onClick={() => { setShowSettingsModal(true); setShowUserDropdown(false); }}>
                      <FaGlobe className={styles['dropdown-icon']} /> Languages & currency
                    </button>
                    <button className={styles['dropdown-item']}>
                      <FaRegQuestionCircle className={styles['dropdown-icon']} /> Help Centre
                    </button>
                    
                    <div className={styles['dropdown-divider']}></div>
                    
                    <NavLink to="/hosting/home" className={styles['dropdown-item-host']}>
                      <div className={styles['host-content']}>
                        <span className={styles['host-title']}>Become a host</span>
                        <span className={styles['host-subtitle']}>It's easy to start hosting and earn extra income.</span>
                      </div>
                      <img src="https://a0.muscache.com/pictures/b9adfc39-6e2a-4e5f-b6f3-681b306fae5c.jpg" alt="Host" className={styles['host-image']} />
                    </NavLink>
                    
                    <div className={styles['dropdown-divider']}></div>
                    
                    <NavLink to="/hosting/refer" className={styles['dropdown-item']} onClick={() => setShowUserDropdown(false)}>
                      Refer a host
                    </NavLink>
                    <NavLink to="/find-cost-host" className={styles['dropdown-item']} onClick={() => setShowUserDropdown(false)}>
                      Find a co-host
                    </NavLink>
                    
                    <div className={styles['dropdown-divider']}></div>
                    
                    <button 
                      className={styles['dropdown-item']} 
                      onClick={() => { 
                        setShowAuthModal(true); 
                        setShowUserDropdown(false); 
                      }}
                    >
                      Log in or sign up
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Search Bar */}
      <div 
        ref={searchContainerRef}
        className={`${styles['search-container']} ${(isScrolled && !isSearchExpanded) ? styles.hidden : ''}`}
      >
        <div className={styles['search-bar']} ref={locationDropdownRef}>
          <div 
            className={`${styles['search-section']} ${showLocationDropdown ? styles['search-section-active'] : ''}`}
            onClick={() => {
              setShowLocationDropdown(true);
              setShowDatesDropdown(false);
              setShowGuestsDropdown(false);
            }}
          >
            <span className={styles['search-label']}>{t('Where')}</span>
            <input 
              type="text"
              className={styles['search-input-field']}
              placeholder="Search destinations"
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
            />
            {selectedDestination && (
              <div 
                className={styles['clear-btn']} 
                onClick={(e) => { e.stopPropagation(); setSelectedDestination(''); }}
              >
                <FaTimes size={10} />
              </div>
            )}
          </div>

          {/* Location Dropdown */}
          {showLocationDropdown && (
            <div className={styles['location-dropdown']}>
              <div className={styles['loc-dropdown-title']}>Suggested destinations</div>
              <div className={styles['loc-list']}>
                {[
                  { name: "Nearby", desc: "Find what's around you", icon: <FiNavigation />, iconClass: 'loc-icon-nav' },
                  { name: "Jaipur, Rajasthan", desc: "For sights like Amber Fort", icon: <BsBuildings />, iconClass: 'loc-icon-city' },
                  { name: "North Goa, Goa", desc: "Popular beach destination", icon: <TbBeach />, iconClass: 'loc-icon-beach' },
                  { name: "Udaipur, Rajasthan", desc: "For its stunning architecture", icon: <BsBuildings />, iconClass: 'loc-icon-city' },
                  { name: "Dubai, United Arab Emirates", desc: "For its bustling nightlife", icon: <BsBuildings />, iconClass: 'loc-icon-city2' },
                  { name: "Gurgaon District, Haryana", desc: "Popular with travellers near you", icon: <TbBeach />, iconClass: 'loc-icon-beach' },
                  { name: "Mumbai, Maharashtra", desc: "For sights like Gateway of India", icon: <BsBuildings />, iconClass: 'loc-icon-city2' }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className={styles['loc-item']}
                    onClick={() => {
                      setSelectedDestination(item.name);
                      setShowLocationDropdown(false);
                    }}
                  >
                    <div className={`${styles['loc-icon']} ${styles[item.iconClass]}`}>{item.icon}</div>
                    <div className={styles['loc-text']}>
                      <div className={styles['loc-name']}>{item.name}</div>
                      <div className={styles['loc-desc']}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={`${styles['search-section']} ${showDatesDropdown ? styles['search-section-active'] : ''}`} ref={datesDropdownRef} onClick={() => {
            setShowDatesDropdown(!showDatesDropdown);
            if (!showDatesDropdown) {
              setShowLocationDropdown(false);
              setShowGuestsDropdown(false);
            }
          }}>
            <span className={styles['search-label']}>When</span>
            <span className={styles['search-input']} style={{ color: (checkInDate || selectedFlexibleMonths.length > 0) ? '#222' : '#717171', fontWeight: (checkInDate || selectedFlexibleMonths.length > 0) ? '600' : '400' }}>{getDatesText()}</span>

            {(checkInDate || selectedFlexibleMonths.length > 0) && (
              <div 
                className={styles['clear-btn']} 
                onClick={(e) => { e.stopPropagation(); setCheckInDate(null); setCheckOutDate(null); setSelectedFlexibleMonths([]); }}
              >
                <FaTimes size={10} />
              </div>
            )}

            {/* Dates Dropdown */}
            {showDatesDropdown && (
              <div className={styles['dates-dropdown']} onClick={(e) => e.stopPropagation()}>
                
                {/* Tabs */}
                <div className={styles['dates-tabs-container']}>
                  <div className={styles['dates-tabs']}>
                    <button 
                      className={`${styles['dates-tab']} ${datesTab === 'dates' ? styles['dates-tab-active'] : ''}`}
                      onClick={() => setDatesTab('dates')}
                    >Dates</button>
                    <button 
                      className={`${styles['dates-tab']} ${datesTab === 'flexible' ? styles['dates-tab-active'] : ''}`}
                      onClick={() => setDatesTab('flexible')}
                    >Flexible</button>
                  </div>
                </div>

                {datesTab === 'dates' ? (
                  <div className={styles['dates-content']}>
                    <div className={styles['fake-calendars']}>
                      {/* Left Calendar */}
                      <div className={styles['fake-calendar']}>
                        <div className={styles['cal-header']}>
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
                        <div className={styles['cal-grid']}>
                          {['S','M','T','W','T','F','S'].map(d => <div key={d} className={styles['cal-day-name']}>{d}</div>)}
                          {renderMonthGrid(currentMonth)}
                        </div>
                      </div>
                      
                      {/* Right Calendar */}
                      <div className={styles['fake-calendar']}>
                        <div className={styles['cal-header']}>
                          <div></div>
                          <span>{format(addMonths(currentMonth, 1), 'MMMM yyyy')}</span>
                          <button 
                             onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                             style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          >
                            <FaChevronRight size={12} color="#222"/>
                          </button>
                        </div>
                        <div className={styles['cal-grid']}>
                          {['S','M','T','W','T','F','S'].map(d => <div key={d} className={styles['cal-day-name']}>{d}</div>)}
                          {renderMonthGrid(addMonths(currentMonth, 1))}
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles['exact-dates-options']}>
                       <button className={styles['exact-opt-btn-active']}>Exact dates</button>
                       <button className={styles['exact-opt-btn']}>± 1 day</button>
                       <button className={styles['exact-opt-btn']}>± 2 days</button>
                       <button className={styles['exact-opt-btn']}>± 3 days</button>
                       <button className={styles['exact-opt-btn']}>± 7 days</button>
                       <button className={styles['exact-opt-btn']}>± 14 days</button>
                    </div>
                  </div>
                ) : (
                  <div className={styles['flexible-content']}>
                    <h3 className={styles['flex-title']}>How long would you like to stay?</h3>
                    <div className={styles['flex-duration-opts']}>
                      <button className={styles['flex-dur-btn']}>Weekend</button>
                      <button className={styles['flex-dur-btn']}>Week</button>
                      <button className={`${styles['flex-dur-btn']} ${styles['flex-dur-btn-active']}`}>Month</button>
                    </div>

                    <h3 className={styles['flex-title']}>When do you want to go?</h3>
                    <div className={styles['flex-months-container']}>
                      <button className={styles['flex-scroll-left-btn']} onClick={scrollMonthsLeft}><FaChevronLeft size={12}/></button>
                      
                      <div className={styles['flex-months-row']} ref={monthsScrollRef}>
                        {flexibleMonths.map((m, idx) => {
                          const monthStr = format(m, 'MMM');
                          const isActive = selectedFlexibleMonths.includes(monthStr);
                          return (
                            <div 
                              key={idx} 
                              className={`${styles['flex-month-card']} ${isActive ? styles['flex-month-active'] : ''}`}
                              onClick={() => toggleFlexibleMonth(monthStr)}
                            >
                              <BsCalendar4 size={28} color="#222"/>
                              <span>{format(m, 'MMMM')}<br/>{format(m, 'yyyy')}</span>
                            </div>
                          );
                        })}
                      </div>

                      <button className={styles['flex-scroll-right-btn']} onClick={scrollMonthsRight}><FaChevronRight size={12}/></button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className={`${styles['search-section']} ${styles['no-border']} ${showGuestsDropdown ? styles['search-section-active'] : ''}`} ref={guestsDropdownRef} onClick={() => {
            setShowGuestsDropdown(!showGuestsDropdown);
            if (!showGuestsDropdown) {
              setShowLocationDropdown(false);
              setShowDatesDropdown(false);
            }
          }}>
            <span className={styles['search-label']}>{t('Who')}</span>
            <span className={styles['search-input']} style={{ color: (adultsCount > 0 || childrenCount > 0 || infantsCount > 0 || petsCount > 0) ? '#222' : '#717171', fontWeight: (adultsCount > 0 || childrenCount > 0 || infantsCount > 0 || petsCount > 0) ? '600' : '400' }}>{getGuestsText()}</span>

            {(adultsCount > 0 || childrenCount > 0 || infantsCount > 0 || petsCount > 0) && (
              <div 
                className={styles['clear-btn']} 
                onClick={(e) => { e.stopPropagation(); setAdultsCount(0); setChildrenCount(0); setInfantsCount(0); setPetsCount(0); }}
              >
                <FaTimes size={10} />
              </div>
            )}

            {/* Guests Dropdown */}
            {showGuestsDropdown && (
              <div className={styles['guests-dropdown']} onClick={(e) => e.stopPropagation()}>
                
                <div className={styles['guest-row']}>
                  <div className={styles['guest-info']}>
                    <div className={styles['guest-title']}>Adults</div>
                    <div className={styles['guest-subtitle']}>Ages 13 or above</div>
                  </div>
                  <div className={styles['guest-controls']}>
                    <button className={styles['guest-ctrl-btn']} disabled={adultsCount === 0} onClick={() => setAdultsCount(prev => prev - 1)}><FiMinus size={14}/></button>
                    <span className={styles['guest-count']}>{adultsCount}</span>
                    <button className={styles['guest-ctrl-btn']} onClick={() => setAdultsCount(prev => prev + 1)}><FiPlus size={14}/></button>
                  </div>
                </div>

                <div className={styles['guest-row']}>
                  <div className={styles['guest-info']}>
                    <div className={styles['guest-title']}>Children</div>
                    <div className={styles['guest-subtitle']}>Ages 2-12</div>
                  </div>
                  <div className={styles['guest-controls']}>
                    <button className={styles['guest-ctrl-btn']} disabled={childrenCount === 0} onClick={() => setChildrenCount(prev => prev - 1)}><FiMinus size={14}/></button>
                    <span className={styles['guest-count']}>{childrenCount}</span>
                    <button className={styles['guest-ctrl-btn']} onClick={() => { setChildrenCount(prev => prev + 1); if(adultsCount === 0) setAdultsCount(1); }}><FiPlus size={14}/></button>
                  </div>
                </div>

                <div className={styles['guest-row']}>
                  <div className={styles['guest-info']}>
                    <div className={styles['guest-title']}>Infants</div>
                    <div className={styles['guest-subtitle']}>Under 2</div>
                  </div>
                  <div className={styles['guest-controls']}>
                    <button className={styles['guest-ctrl-btn']} disabled={infantsCount === 0} onClick={() => setInfantsCount(prev => prev - 1)}><FiMinus size={14}/></button>
                    <span className={styles['guest-count']}>{infantsCount}</span>
                    <button className={styles['guest-ctrl-btn']} onClick={() => { setInfantsCount(prev => prev + 1); if(adultsCount === 0) setAdultsCount(1); }}><FiPlus size={14}/></button>
                  </div>
                </div>

                <div className={styles['guest-row']}>
                  <div className={styles['guest-info']}>
                    <div className={styles['guest-title']}>Pets</div>
                    <div className={styles['guest-subtitle-link']}>Bringing a service animal?</div>
                  </div>
                  <div className={styles['guest-controls']}>
                    <button className={styles['guest-ctrl-btn']} disabled={petsCount === 0} onClick={() => setPetsCount(prev => prev - 1)}><FiMinus size={14}/></button>
                    <span className={styles['guest-count']}>{petsCount}</span>
                    <button className={styles['guest-ctrl-btn']} onClick={() => { setPetsCount(prev => prev + 1); if(adultsCount === 0) setAdultsCount(1); }}><FiPlus size={14}/></button>
                  </div>
                </div>

              </div>
            )}
          </div>
          <div className={styles['search-btn-container']}>
            <button className={styles['search-btn']} aria-label="Search">
              <FaSearch size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal (Bootstrap styled like Airbnb) */}
      <AuthModal show={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Settings Modal (Language & Currency) */}
      {settingsIsRendered && (
        <div 
          className={`modal d-block ${styles.authOverlay} ${settingsIsVisible ? styles.visible : ''}`} 
          tabIndex="-1" 
          onClick={() => setShowSettingsModal(false)}
        >
          <div 
            className={`modal-dialog modal-dialog-centered modal-lg ${styles.authDialog} ${settingsIsVisible ? styles.visible : ''}`} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom-0 pt-4 ">
                <button 
                  type="button" 
                  className={`btn btn-sm btn-light position-absolute rounded-circle d-flex align-items-center justify-content-center ${styles.settingsCloseBtn}`} 
                  aria-label="Close" 
                  onClick={() => setShowSettingsModal(false)}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body px-4 pb-4 pt-2">
                <div className={`d-flex ${styles.settingsTabs} mb-4`}>
                  <button 
                    className={`${styles.settingsTab} ${settingsTab === 'language' ? styles.settingsTabActive : ''}`}
                    onClick={() => setSettingsTab('language')}
                  >
                    Language and region
                  </button>
                  <button 
                    className={`${styles.settingsTab} ${settingsTab === 'currency' ? styles.settingsTabActive : ''}`}
                    onClick={() => setSettingsTab('currency')}
                  >
                    Currency
                  </button>
                </div>
                
                <div className="py-2" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                  {settingsTab === 'language' && (
                    <div className="pe-2">
                      <div className={`p-3 mb-4 rounded-3 d-flex justify-content-between align-items-center ${styles.translationToggleBox}`}>
                        <div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-bold" style={{ fontSize: '15px' }}>Translation</span>
                            <FaGlobe size={16} />
                          </div>
                          <p className="text-muted mb-0 mt-1" style={{ fontSize: '14px' }}>Automatically translate descriptions and reviews to English.</p>
                        </div>
                        <div className="form-check form-switch fs-4 mb-0">
                          <input 
                            className="form-check-input bg-dark border-dark" 
                            type="checkbox" 
                            role="switch" 
                            checked={automaticTranslation}
                            onChange={handleTranslationToggle}
                          />
                        </div>
                      </div>

                      <h5 className="fw-bold mb-4">Suggested languages and regions</h5>
                      <div className="row g-3 mb-5">
                        {[
                          { name: 'English', region: 'United States' },
                          { name: 'English', region: 'United Kingdom' },
                          { name: 'हिन्दी', region: 'भारत' },
                          { name: 'ಕನ್ನಡ', region: 'ಭಾರत' },
                          { name: 'मराठी', region: 'भारत' }
                        ].map((lang, index) => (
                          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
                            <button 
                              className={`w-100 text-start p-2 rounded-3 border-0 bg-transparent ${styles.langOptionBtn} ${selectedLanguage === lang.name && selectedRegion === lang.region ? styles.langOptionBtnActive : ''}`}
                              onClick={() => handleLanguageSelect(lang.name, lang.region)}
                            >
                              <div className="fw-bold text-dark notranslate" translate="no" style={{ fontSize: '14px' }}>{lang.name}</div>
                              <div className="text-muted notranslate" translate="no" style={{ fontSize: '14px' }}>{lang.region}</div>
                            </button>
                          </div>
                        ))}
                      </div>

                      <h5 className="fw-bold mb-4">Choose a language and region</h5>
                      <div className="row g-3">
                        {[
                          { name: 'English', region: 'United States' },
                          { name: 'Azərbaycan dili', region: 'Azərbaycan' },
                          { name: 'Bahasa Indonesia', region: 'Indonesia' },
                          { name: 'Bosanski', region: 'Bosna i Hercegovina' },
                          { name: 'Català', region: 'Espanya' },
                          { name: 'Čeština', region: 'Česká republika' },
                          { name: 'Crnogorski', region: 'Crna Gora' },
                          { name: 'Dansk', region: 'Danmark' },
                          { name: 'Deutsch', region: 'Deutschland' },
                          { name: 'Deutsch', region: 'Österreich' },
                          { name: 'Deutsch', region: 'Schweiz' },
                          { name: 'Deutsch', region: 'Luxemburg' },
                          { name: 'Eesti', region: 'Eesti' },
                          { name: 'English', region: 'Australia' },
                          { name: 'English', region: 'Canada' },
                          { name: 'English', region: 'Guyana' },
                          { name: 'English', region: 'Ireland' },
                          { name: 'English', region: 'New Zealand' },
                          { name: 'English', region: 'Singapore' },
                          { name: 'English', region: 'United Arab Emirates' },
                          { name: 'Español', region: 'Argentina' },
                          { name: 'Español', region: 'Belice' },
                          { name: 'Español', region: 'Bolivia' },
                          { name: 'Español', region: 'Chile' },
                          { name: 'Español', region: 'Colombia' },
                          { name: 'Español', region: 'Costa Rica' },
                          { name: 'Español', region: 'Ecuador' },
                          { name: 'Español', region: 'El Salvador' },
                          { name: 'Español', region: 'España' },
                          { name: 'Español', region: 'Estados Unidos' },
                          { name: 'Français', region: 'France' },
                          { name: 'Italiano', region: 'Italia' },
                          { name: '日本語', region: '日本' },
                          { name: '한국어', region: '한국' },
                          { name: 'Português', region: 'Brasil' },
                          { name: 'Русский', region: 'Россия' },
                          { name: '中文 (简体)', region: '中国' }
                        ].map((lang, index) => (
                          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
                            <button 
                              className={`w-100 text-start p-2 rounded-3 border-0 bg-transparent ${styles.langOptionBtn} ${selectedLanguage === lang.name && selectedRegion === lang.region ? styles.langOptionBtnActive : ''}`}
                              onClick={() => handleLanguageSelect(lang.name, lang.region)}
                            >
                              <div className="fw-bold text-dark notranslate" translate="no" style={{ fontSize: '14px' }}>{lang.name}</div>
                              <div className="text-muted notranslate" translate="no" style={{ fontSize: '14px' }}>{lang.region}</div>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {settingsTab === 'currency' && (
                    <div className="pe-2">
                      <h5 className="fw-bold mb-4">Choose a currency</h5>
                      <div className="row g-3">
                        {[
                          { name: 'Indian rupee', code: 'INR', symbol: '₹' },
                          { name: 'Australian dollar', code: 'AUD', symbol: '$' },
                          { name: 'Brazilian real', code: 'BRL', symbol: 'R$' },
                          { name: 'Bulgarian lev', code: 'BGN', symbol: 'лв.' },
                          { name: 'Canadian dollar', code: 'CAD', symbol: '$' },
                          { name: 'Chilean peso', code: 'CLP', symbol: '$' },
                          { name: 'Chinese yuan', code: 'CNY', symbol: '￥' },
                          { name: 'Colombian peso', code: 'COP', symbol: '$' },
                          { name: 'Costa Rican colon', code: 'CRC', symbol: '₡' },
                          { name: 'Czech koruna', code: 'CZK', symbol: 'Kč' },
                          { name: 'Danish krone', code: 'DKK', symbol: 'kr' },
                          { name: 'Egyptian pound', code: 'EGP', symbol: 'ج.م' },
                          { name: 'Emirati dirham', code: 'AED', symbol: 'د.إ' },
                          { name: 'Euro', code: 'EUR', symbol: '€' },
                          { name: 'Ghanaian cedi', code: 'GHS', symbol: 'GH₵' },
                          { name: 'Hong Kong dollar', code: 'HKD', symbol: '$' },
                          { name: 'Hungarian forint', code: 'HUF', symbol: 'Ft' },
                          { name: 'Indonesian rupiah', code: 'IDR', symbol: 'Rp' },
                          { name: 'Israeli new shekel', code: 'ILS', symbol: '₪' },
                          { name: 'Japanese yen', code: 'JPY', symbol: '¥' },
                          { name: 'Kazakhstani tenge', code: 'KZT', symbol: '₸' },
                          { name: 'Kenyan shilling', code: 'KES', symbol: 'KSh' },
                          { name: 'Malaysian ringgit', code: 'MYR', symbol: 'RM' },
                          { name: 'Mexican peso', code: 'MXN', symbol: '$' },
                          { name: 'Moroccan dirham', code: 'MAD', symbol: '' },
                          { name: 'New Taiwan dollar', code: 'TWD', symbol: '$' },
                          { name: 'New Zealand dollar', code: 'NZD', symbol: '$' },
                          { name: 'Norwegian krone', code: 'NOK', symbol: 'kr' },
                          { name: 'Peruvian sol', code: 'PEN', symbol: 'S/' },
                          { name: 'Philippine peso', code: 'PHP', symbol: '₱' },
                          { name: 'Polish zloty', code: 'PLN', symbol: 'zł' },
                          { name: 'Pound sterling', code: 'GBP', symbol: '£' },
                          { name: 'Qatari riyal', code: 'QAR', symbol: 'ر.ق' },
                          { name: 'Romanian leu', code: 'RON', symbol: 'lei' },
                          { name: 'Saudi Arabian riyal', code: 'SAR', symbol: 'SR' },
                          { name: 'Singapore dollar', code: 'SGD', symbol: '$' },
                          { name: 'South African rand', code: 'ZAR', symbol: 'R' },
                          { name: 'South Korean won', code: 'KRW', symbol: '₩' },
                          { name: 'Swedish krona', code: 'SEK', symbol: 'kr' },
                          { name: 'Swiss franc', code: 'CHF', symbol: '' },
                          { name: 'Thai baht', code: 'THB', symbol: '฿' },
                          { name: 'Turkish lira', code: 'TRY', symbol: '₺' },
                          { name: 'Ugandan shilling', code: 'UGX', symbol: 'USh' },
                          { name: 'Ukrainian hryvnia', code: 'UAH', symbol: '₴' },
                          { name: 'United States dollar', code: 'USD', symbol: '$' },
                          { name: 'Uruguayan peso', code: 'UYU', symbol: '$U' },
                          { name: 'Vietnamese dong', code: 'VND', symbol: '₫' }
                        ].map((currency, index) => (
                          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
                            <button 
                              className={`w-100 text-start p-2 rounded-3 border-0 bg-transparent ${styles.langOptionBtn} ${selectedCurrency === currency.code ? styles.langOptionBtnActive : ''}`}
                              onClick={() => handleCurrencySelect(currency)}
                            >
                              <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{currency.name}</div>
                              <div className="text-muted" style={{ fontSize: '14px' }}>
                                {currency.code} {currency.symbol && `- ${currency.symbol}`}
                              </div>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
