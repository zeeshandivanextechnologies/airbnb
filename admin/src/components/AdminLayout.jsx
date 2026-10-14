import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  FaAirbnb, 
  FaBars, 
  FaThLarge, 
  FaHome, 
  FaUsers, 
  FaUserTie, 
  FaCalendarCheck, 
  FaMoneyBillWave, 
  FaStar, 
  FaDatabase, 
  FaUserShield,
  FaLifeRing,
  FaBullhorn,
  FaFileAlt,
  FaChartLine,
  FaShieldAlt,
  FaCog, 
  FaBell, 
  FaSearch, 
  FaExternalLinkAlt,
  FaSignOutAlt,
  FaChevronDown,
  FaExclamationTriangle
} from 'react-icons/fa';
import styles from './styles/AdminLayout.module.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);

  // Dynamic Logged-in Admin State
  const [currentAdmin, setCurrentAdmin] = useState({
    name: 'Admin User',
    email: 'admin@airbnb.internal',
    role: 'Superadmin',
    avatar: 'AU'
  });

  useEffect(() => {
    // Read session from localStorage
    const authData = localStorage.getItem('airbnb_admin_auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        if (parsed.user) {
          const userName = parsed.user.name || 'Admin User';
          const initials = userName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2) || 'AU';

          setCurrentAdmin({
            name: userName,
            email: parsed.user.email || 'admin@airbnb.internal',
            role: parsed.user.role || 'Superadmin',
            avatar: initials
          });
        }
      } catch (e) {
        // Ignore parse error
      }
    }

    // Click outside handler for dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Open Logout Modal
  const promptLogout = () => {
    setProfileDropdownOpen(false);
    setShowLogoutModal(true);
  };

  // Perform Confirmed Logout with Toast
  const handleConfirmLogout = () => {
    // 1. Remove auth credentials
    localStorage.removeItem('airbnb_admin_auth');
    setShowLogoutModal(false);

    // 2. Trigger React Hot Toast Alert
    toast.success('Logged out successfully. See you soon!', {
      icon: '👋',
    });

    // 3. Redirect to Login
    setTimeout(() => {
      navigate('/login');
    }, 400);
  };

  const mainNav = [
    { to: '/', icon: <FaThLarge />, label: 'Dashboard' },
    { to: '/listings', icon: <FaHome />, label: 'All Listings' },
    { to: '/users', icon: <FaUsers />, label: 'Guests (Users)' },
    { to: '/hosts', icon: <FaUserTie />, label: 'Hosts Management' },
    { to: '/bookings', icon: <FaCalendarCheck />, label: 'Bookings' },
    { to: '/finance', icon: <FaMoneyBillWave />, label: 'Payments & Finance' },
    { to: '/reviews', icon: <FaStar />, label: 'Reviews & Ratings' },
    { to: '/master-data', icon: <FaDatabase />, label: 'Master Data Setup' },
    { to: '/roles', icon: <FaUserShield />, label: 'Roles & Permissions' },
    { to: '/support', icon: <FaLifeRing />, label: 'Support & Safety', badge: '4' },
    { to: '/marketing', icon: <FaBullhorn />, label: 'Marketing & Promos' },
    { to: '/cms', icon: <FaFileAlt />, label: 'CMS Content Pages' },
    { to: '/reports', icon: <FaChartLine />, label: 'Reports & Analytics' },
    { to: '/security', icon: <FaShieldAlt />, label: 'Activity Logs & Security' },
  ];

  const secondaryNav = [
    { to: '/settings', icon: <FaCog />, label: 'Settings' },
  ];

  const handleToggle = () => {
    if (window.innerWidth <= 991) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className={styles.adminContainer}>
      {/* Mobile backdrop */}
      <div 
        className={`${styles.mobileBackdrop} ${mobileOpen ? styles.mobileBackdropActive : ''}`} 
        onClick={() => setMobileOpen(false)} 
      />

      {/* Sleek Dark Airbnb Sidebar */}
      <aside className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''} ${mobileOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.sidebarBrand}>
          <div className={styles.brandLogoWrapper}>
            <FaAirbnb />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>Airbnb</span>
            <span className={styles.brandBadge}>Admin Portal</span>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          <div className={styles.navGroupLabel}>Main Menu</div>
          {mainNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              onClick={() => setMobileOpen(false)}
              title={item.label}
            >
              <div className={styles.navItemLeft}>
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navText}>{item.label}</span>
              </div>
              {item.badge && <span className={styles.navCountBadge}>{item.badge}</span>}
            </NavLink>
          ))}

          <div className={styles.navGroupLabel} style={{ marginTop: '14px' }}>System</div>
          {secondaryNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              onClick={() => setMobileOpen(false)}
              title={item.label}
            >
              <div className={styles.navItemLeft}>
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navText}>{item.label}</span>
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer with Admin Profile & Logout Trigger */}
        <div className={styles.sidebarFooter}>
          <div className={styles.adminAvatar}>
            {currentAdmin.avatar}
            <span className={styles.onlineIndicator} />
          </div>
          <div className={styles.adminInfo}>
            <span className={styles.adminName}>{currentAdmin.name}</span>
            <span className={styles.adminRole}>{currentAdmin.email}</span>
          </div>
          <button 
            type="button" 
            className={styles.logoutBtn} 
            onClick={promptLogout} 
            title="Logout Administrator"
          >
            <FaSignOutAlt size={14} />
          </button>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className={styles.mainWrapper}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button 
              type="button" 
              className={styles.toggleBtn} 
              onClick={handleToggle} 
              title="Toggle Sidebar"
            >
              <FaBars />
            </button>
            <div className={styles.headerTitles}>
              <h1 className={styles.pageHeaderTitle}>Admin Portal</h1>
              <span className={styles.pageHeaderSubtitle}>Overview & Realtime Platform Control</span>
            </div>
          </div>

          {/* Central Search */}
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search listings, hosts, bookings..." 
              className={styles.searchInput}
            />
            <span className={styles.searchShortcut}>Ctrl+K</span>
          </div>

          {/* Header Right */}
          <div className={styles.headerRight}>
            <a 
              href="http://localhost:5173" 
              target="_blank" 
              rel="noreferrer" 
              className={styles.visitSiteBtn}
              title="Open Airbnb User App"
            >
              <span>Live Website</span>
              <FaExternalLinkAlt size={10} />
            </a>

            <button type="button" className={styles.headerActionBtn} title="Notifications">
              <FaBell size={15} />
              <span className={styles.badgeDot} />
            </button>

            {/* Exactly Matching User Avatar + Admin User + Superadmin Dropdown Pill */}
            <div className="position-relative" ref={dropdownRef}>
              <div 
                className={styles.profilePillButton}
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                title="Admin Account Menu"
              >
                {/* Left Cyan Circular Avatar */}
                <div className={styles.profileAvatarCircle}>
                  {currentAdmin.avatar}
                </div>

                {/* Right Text Stack: Name on top, Role on bottom */}
                <div className={styles.profileTextContainer}>
                  <span className={styles.profileUserName}>{currentAdmin.name}</span>
                  <span className={styles.profileUserRole}>{currentAdmin.role}</span>
                </div>

                {/* Chevron Down Arrow */}
                <FaChevronDown className={`${styles.profileCaret} ${profileDropdownOpen ? styles.profileCaretOpen : ''}`} />
              </div>

              {/* Dropdown Menu on Click */}
              {profileDropdownOpen && (
                <div className={styles.profileDropdownMenu}>
                  <div className={styles.profileDropdownHeader}>
                    <strong style={{ fontSize: '13px', color: '#111827', display: 'block' }}>
                      {currentAdmin.name}
                    </strong>
                    <span className={styles.dropdownAdminEmail}>
                      {currentAdmin.email}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className={styles.dropdownItem}
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate('/settings');
                    }}
                  >
                    <FaCog size={13} />
                    <span>Account Settings</span>
                  </button>
                  <button 
                    type="button" 
                    className={styles.dropdownItem}
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate('/security');
                    }}
                  >
                    <FaShieldAlt size={13} />
                    <span>Security & 2FA</span>
                  </button>
                  <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }} />
                  <button 
                    type="button" 
                    className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                    onClick={promptLogout}
                  >
                    <FaSignOutAlt size={13} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Main Content */}
        <main className={styles.contentBody}>
          <div className="container-fluid p-0">
            <div className={styles.pageContainer}>
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* CONFIRMATION LOGOUT MODAL */}
      {showLogoutModal && (
        <div className={styles.modalOverlay} onClick={() => setShowLogoutModal(false)}>
          <div className={styles.logoutModalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.logoutIconWrapper}>
              <FaExclamationTriangle />
            </div>
            <h3 className={styles.logoutModalTitle}>Confirm Logout</h3>
            <p className={styles.logoutModalText}>
              Are you sure you want to end your administrative session, <strong>{currentAdmin.name}</strong>? You will need to sign in again to access the portal.
            </p>
            <div className={styles.logoutModalActions}>
              <button 
                type="button" 
                className={styles.cancelModalBtn}
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className={styles.confirmLogoutBtn}
                onClick={handleConfirmLogout}
              >
                <FaSignOutAlt size={13} />
                <span>Yes, Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
