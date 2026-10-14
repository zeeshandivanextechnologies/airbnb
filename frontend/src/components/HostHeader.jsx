import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaAirbnb, FaBars, FaCog, FaGlobe, FaBookOpen, FaQuestionCircle, FaUserFriends, FaPlus, FaUsers, FaSignOutAlt, FaBell, FaTimes, FaUserCircle } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice.js';
import styles from './styles/HostHeader.module.css';

const HostHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

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
    navigate('/');
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
    <header className={styles.hostHeader}>
      <div className={styles.headerLeft}>
     
        {/* <NavLink to="/" className={styles.logoLink}>
                  <FaAirbnb className={styles.logoIcon} size={36} /> 
                  
                </NavLink> */}

                  <NavLink to="/" className={styles.logoLink}>
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
          <div className={styles.userIconCircle} onClick={() => navigate('/account-settings')}>
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
          <button className={styles.menuCircleBtn} onClick={() => setIsMenuOpen(true)}>
            <FaBars className={styles.barsIcon} />
          </button>
        </div>
      </div>
    </header>

    {createPortal(
      <>
        <div 
          className={`${styles.overlay} ${isMenuOpen ? styles.open : ''}`} 
          onClick={() => setIsMenuOpen(false)}
        ></div>
        
        <div className={`${styles.offcanvas} ${isMenuOpen ? styles.open : ''}`}>
          <div className={styles.offcanvasHeader}>
            <button className={styles.circleBtn}>
              <FaBell size={14} />
            </button>
            <button className={styles.circleBtn} onClick={() => setIsMenuOpen(false)}>
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
              <button className={styles.promoBtn}>Get started</button>
            </div>

            <div className={styles.menuList}>
              <NavLink to="/account-settings" className={styles.menuItem}>
                <FaCog className={styles.menuIcon} /> Account settings
              </NavLink>
              <button className={styles.menuItem}>
                <FaGlobe className={styles.menuIcon} /> Languages & currency
              </button>
              <button className={styles.menuItem}>
                <FaBookOpen className={styles.menuIcon} /> Hosting resources
              </button>
              <button className={styles.menuItem}>
                <FaQuestionCircle className={styles.menuIcon} /> Get help
              </button>
              <NavLink to="/find-cost-host" className={styles.menuItem}>
                <FaUserFriends className={styles.menuIcon} /> Find a co-host
              </NavLink>
              <NavLink to="/become-host" className={styles.menuItem}>
                <FaPlus className={styles.menuIcon} /> Create a new listing
              </NavLink>
              <NavLink to="/refer" className={styles.menuItem}>
                <FaUsers className={styles.menuIcon} /> Refer a host
              </NavLink>

              <hr className={styles.menuDivider} />

              <button className={styles.menuItem} onClick={handleLogout}>
                <FaSignOutAlt className={styles.menuIcon} /> Log out
              </button>
            </div>
          </div>
        </div>
      </>,
      document.body
    )}
    </>
  );
};

export default HostHeader;
