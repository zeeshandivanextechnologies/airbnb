import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  FaAirbnb, 
  FaBars, 
  FaCog, 
  FaGlobe, 
  FaBookOpen, 
  FaQuestionCircle, 
  FaUserFriends, 
  FaPlus, 
  FaUsers, 
  FaSignOutAlt, 
  FaBell, 
  FaTimes, 
  FaUserCircle,
  FaCheck
} from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, updateUser } from '../store/slices/authSlice.js';
import { useTranslation } from 'react-i18next';
import { applyGoogleTranslate } from '../i18n.js';
import { getUserProfileApi, updateUserProfileApi } from '../services/api.js';
import toast from 'react-hot-toast';
import styles from './styles/HostHeader.module.css';

const HostHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsIsRendered, setSettingsIsRendered] = useState(false);
  const [settingsIsVisible, setSettingsIsVisible] = useState(false);
  const [settingsTab, setSettingsTab] = useState('language'); // 'language' | 'currency'
  
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem('airbnb_preferred_language') || 'English'
  );
  const [selectedRegion, setSelectedRegion] = useState('United States');
  const [selectedCurrency, setSelectedCurrency] = useState(
    localStorage.getItem('airbnb_preferred_currency') || 'INR'
  );
  const [automaticTranslation, setAutomaticTranslation] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Sync latest user profile and settings from backend database
  useEffect(() => {
    const fetchLatestProfile = async () => {
      if (!isAuthenticated || (!user?.id && !user?.email)) {
        const localLang = localStorage.getItem('airbnb_preferred_language');
        if (localLang) setSelectedLanguage(localLang);
        const localCurr = localStorage.getItem('airbnb_preferred_currency');
        if (localCurr) setSelectedCurrency(localCurr);
        return;
      }

      try {
        const res = await getUserProfileApi(user.id || user.email);
        if (res.success && res.user) {
          dispatch(updateUser(res.user));
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
      } catch (err) {
        // Fallback to cached state
      }
    };

    fetchLatestProfile();
  }, [isAuthenticated, user?.id, user?.email, dispatch]);

  // Smooth open / close for Settings Modal
  useEffect(() => {
    if (showSettingsModal) {
      setSettingsIsRendered(true);
      const timer = setTimeout(() => setSettingsIsVisible(true), 20);
      return () => clearTimeout(timer);
    } else {
      setSettingsIsVisible(false);
      const timer = setTimeout(() => setSettingsIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [showSettingsModal]);

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstInitial = (user.firstName || user.first_name) ? (user.firstName || user.first_name).trim().charAt(0).toUpperCase() : '';
    const lastInitial = (user.lastName || user.last_name) ? (user.lastName || user.last_name).trim().charAt(0).toUpperCase() : '';
    const combined = `${firstInitial}${lastInitial}`.trim();
    return combined || ((user.firstName || user.first_name) ? (user.firstName || user.first_name).substring(0, 2).toUpperCase() : 'U');
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsMenuOpen(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

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

    if (isAuthenticated && (user?.id || user?.email)) {
      try {
        await updateUserProfileApi({ preferredLanguage: mappedLang });
        dispatch(updateUser({ preferredLanguage: mappedLang }));
        toast.success(`Language set to ${langName}`);
      } catch (err) {}
    } else {
      toast.success(`Language set to ${langName}`);
    }
  };

  const handleTranslationToggle = async (e) => {
    const nextVal = e.target.checked;
    setAutomaticTranslation(nextVal);

    if (isAuthenticated && (user?.id || user?.email)) {
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

    if (isAuthenticated && (user?.id || user?.email)) {
      try {
        await updateUserProfileApi({ preferredCurrency: currency.code });
        dispatch(updateUser({ preferredCurrency: currency.code }));
        toast.success(`Currency changed to ${currency.code} (${currency.symbol})`);
      } catch (err) {}
    } else {
      toast.success(`Currency changed to ${currency.code} (${currency.symbol})`);
    }
  };

  useEffect(() => {
    if (isMenuOpen || showSettingsModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, showSettingsModal]);

  return (
    <>
    <header className={styles.hostHeader}>
      <div className={styles.headerLeft}>
        <NavLink to="/hosting/today" className={styles.logoLink}>
          <FaAirbnb className={styles.logoIcon} size={36} />
          <span className={styles['header-logo-texts']}>airbnb</span>
        </NavLink>
      </div>

      <nav className={styles.headerCenter}>
        <NavLink to="/hosting/today" className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>Today</NavLink>
        <NavLink to="/hosting/calendar" className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>Calendar</NavLink>
        <NavLink to="/hosting/listings" className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>Listings</NavLink>
        <NavLink to="/hosting/messages" className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>Messages</NavLink>
      </nav>

      <div className={styles.headerRight}>
        <button className={styles.switchBtn} onClick={() => navigate('/')}>Switch to travelling</button>
        <div className={styles.actionCircles}>
          <div className={styles.userIconCircle} onClick={() => navigate('/hosting/profile')} title="View Host Profile">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="User Profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
              />
            ) : (
              <span>{getUserInitials()}</span>
            )}
          </div>
          <button className={styles.menuCircleBtn} onClick={() => setIsMenuOpen(true)} title="Main Menu">
            <FaBars className={styles.barsIcon} />
          </button>
        </div>
      </div>
    </header>

    {/* Offcanvas Right Navigation Panel */}
    {createPortal(
      <>
        <div 
          className={`${styles.overlay} ${isMenuOpen ? styles.open : ''}`} 
          onClick={() => setIsMenuOpen(false)}
        ></div>
        
        <div className={`${styles.offcanvas} ${isMenuOpen ? styles.open : ''}`}>
          <div className={styles.offcanvasHeader}>
            <button 
              className={styles.circleBtn} 
              onClick={() => { setIsMenuOpen(false); navigate('/notification'); }}
              title="Notifications"
            >
              <FaBell size={14} />
            </button>
            <button className={styles.circleBtn} onClick={() => setIsMenuOpen(false)} title="Close Menu">
              <FaTimes size={14} />
            </button>
          </div>

          <div className={styles.offcanvasBody}>
            <h2 className={styles.menuTitle}>Menu</h2>

            <div className={styles.promoCard}>
              <div className={styles.promoImgRow}>
                <img src="https://picsum.photos/seed/promo1/100/100" alt="Promo" className={styles.promoImg1} />
                <img src="https://picsum.photos/seed/promo2/100/100" alt="Promo" className={styles.promoImg2} />
                <img src="https://picsum.photos/seed/promo3/100/100" alt="Promo" className={styles.promoImg3} />
              </div>
              <h4 className={styles.promoTitle}>New to Airbnb?</h4>
              <p className={styles.promoSub}>Discover tips and best practices shared by top-rated hosts.</p>
              <button 
                className={styles.promoBtn}
                onClick={() => { setIsMenuOpen(false); navigate('/hosting/intro-to-host'); }}
              >
                Get started
              </button>
            </div>

            <div className={styles.menuList}>
              <NavLink 
                to="/account-settings" 
                className={styles.menuItem}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaCog className={styles.menuIcon} /> Account settings
              </NavLink>

              <button 
                type="button"
                className={styles.menuItem}
                onClick={() => { setShowSettingsModal(true); setIsMenuOpen(false); }}
              >
                <FaGlobe className={styles.menuIcon} /> Languages & currency ({selectedCurrency})
              </button>

              <NavLink 
                to="/hosting/intro-to-host" 
                className={styles.menuItem}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaBookOpen className={styles.menuIcon} /> Hosting resources
              </NavLink>

              <button 
                type="button"
                className={styles.menuItem}
                onClick={() => {
                  window.open('https://www.airbnb.com/help', '_blank', 'noopener,noreferrer');
                  setIsMenuOpen(false);
                }}
              >
                <FaQuestionCircle className={styles.menuIcon} /> Get help
              </button>

              <NavLink 
                to="/find-cost-host" 
                className={styles.menuItem}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUserFriends className={styles.menuIcon} /> Find a co-host
              </NavLink>

              <NavLink 
                to="/become-host" 
                className={styles.menuItem}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaPlus className={styles.menuIcon} /> Create a new listing
              </NavLink>

              <NavLink 
                to="/hosting/refer" 
                className={styles.menuItem}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUsers className={styles.menuIcon} /> Refer a host
              </NavLink>

              <hr className={styles.menuDivider} />

              <button type="button" className={styles.menuItem} onClick={handleLogout}>
                <FaSignOutAlt className={styles.menuIcon} /> Log out
              </button>
            </div>
          </div>
        </div>

        {/* Global Languages & Currency Modal synced with DB */}
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
                <div className="modal-header border-bottom-0 pt-4">
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
                              className="form-check-input" 
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
                            { name: 'ಕನ್ನಡ', region: 'ಭಾರತ' },
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
                            { name: 'Español', region: 'España' },
                            { name: 'Français', region: 'France' },
                            { name: 'Italiano', region: 'Italia' },
                            { name: '日本語', region: '日本' },
                            { name: '한국어', region: '한국' },
                            { name: 'Português', region: 'Brasil' },
                            { name: 'Русский', region: 'Россия' }
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
                            { name: 'Canadian dollar', code: 'CAD', symbol: '$' },
                            { name: 'Euro', code: 'EUR', symbol: '€' },
                            { name: 'British pound', code: 'GBP', symbol: '£' },
                            { name: 'Japanese yen', code: 'JPY', symbol: '¥' },
                            { name: 'United States dollar', code: 'USD', symbol: '$' },
                            { name: 'UAE dirham', code: 'AED', symbol: 'د.إ' },
                            { name: 'Swiss franc', code: 'CHF', symbol: 'CHF' },
                            { name: 'Singapore dollar', code: 'SGD', symbol: '$' },
                            { name: 'New Zealand dollar', code: 'NZD', symbol: '$' }
                          ].map((curr, index) => (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
                              <button 
                                className={`w-100 text-start p-3 rounded-3 border-0 bg-transparent ${styles.langOptionBtn} ${selectedCurrency === curr.code ? styles.langOptionBtnActive : ''}`}
                                onClick={() => handleCurrencySelect(curr)}
                              >
                                <div className="fw-bold text-dark" style={{ fontSize: '15px' }}>{curr.name}</div>
                                <div className="text-muted" style={{ fontSize: '13px' }}>{curr.code} – {curr.symbol}</div>
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
      </>,
      document.body
    )}
    </>
  );
};

export default HostHeader;
