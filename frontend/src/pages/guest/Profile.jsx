import React, { useState, useEffect } from 'react';
import styles from '../../components/styles/Profile.module.css';
import { FcPortraitMode, FcConferenceCall } from 'react-icons/fc';
import { BsLayoutSidebar, BsLayoutSidebarInsetReverse, BsChatLeftText, BsShieldCheck } from 'react-icons/bs';
import { FaHome, FaUserCheck, FaAward } from 'react-icons/fa';
import { NavLink, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Profile() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [searchParams] = useSearchParams();

  // Redux Auth State
  const { user: authUser, isAuthenticated } = useSelector((state) => state.auth);

  // Local state for fetched profile data
  const [profileData, setProfileData] = useState(() => {
    // Initial fallback from localStorage or Redux
    try {
      const saved = localStorage.getItem('airbnb_user_auth');
      const parsed = saved ? JSON.parse(saved) : null;
      return authUser || parsed?.user || {
        firstName: 'Guest',
        lastName: 'User',
        email: 'guest@airbnb.com',
        role: 'guest'
      };
    } catch (e) {
      return authUser || { firstName: 'Guest', lastName: 'User', role: 'guest' };
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  // Determine if viewing in Host mode or Guest mode
  const roleParam = searchParams.get('role');
  const isHostMode = roleParam === 'host' || profileData?.role === 'host';

  // Fetch dynamic profile details from Backend
  useEffect(() => {
    const fetchProfile = async () => {
      const targetEmail = authUser?.email || profileData?.email;
      const targetId = authUser?.id || profileData?.id;

      if (!targetEmail && !targetId) return;

      try {
        setIsLoading(true);
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        const url = targetId 
          ? `${baseUrl}/auth/profile?id=${targetId}` 
          : `${baseUrl}/auth/profile?email=${encodeURIComponent(targetEmail)}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.success && data.user) {
          setProfileData(data.user);
        }
      } catch (err) {
        console.warn('Could not fetch live profile from backend, using cached state:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [authUser]);

  // Derived user details
  const firstName = profileData?.firstName || 'Guest';
  const lastName = profileData?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const avatarUrl = profileData?.avatar;
  const initialFirst = firstName ? firstName[0].toUpperCase() : 'G';
  const initialLast = lastName ? lastName[0].toUpperCase() : '';
  const initials = `${initialFirst}${initialLast}`;
  const joinedYear = profileData?.createdAt ? new Date(profileData.createdAt).getFullYear() : '2026';

  return (
    <div className={styles['prof-page-wrapper']}>
      
      {/* Sidebar */}
      <aside className={`${styles['prof-sidebar']} ${!isSidebarOpen ? styles.collapsed : ''}`}>
        <div className={styles['prof-sidebar-header']}>
          {isSidebarOpen && <h2 className={styles['prof-sidebar-title']}>Profile</h2>}
          <button 
            className={styles['prof-sidebar-toggle']} 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <BsLayoutSidebar size={20} /> : <BsLayoutSidebarInsetReverse size={20} />}
          </button>
        </div>

        <nav>
          <div 
            className={`${styles['prof-nav-item']} ${activeTab === 'about' ? styles.active : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <div className={styles['prof-nav-icon']}><FcPortraitMode /></div>
            {isSidebarOpen && <span className={styles['prof-nav-text']}>About me</span>}
          </div>
          <div 
            className={`${styles['prof-nav-item']} ${activeTab === 'connections' ? styles.active : ''}`}
            onClick={() => setActiveTab('connections')}
          >
            <div className={styles['prof-nav-icon']}><FcConferenceCall /></div>
            {isSidebarOpen && <span className={styles['prof-nav-text']}>Connections</span>}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles['prof-main-content']}>
        <div className="container-fluid p-0">
          
          {activeTab === 'about' && (
            <>
              <div className={styles['prof-header-section']}>
                <h1 className={styles['prof-main-title']}>
                  {isHostMode ? 'Host Profile' : 'About me'}
                </h1>
                <NavLink to='/edit-mode' className={styles['prof-edit-btn']}>Edit</NavLink>
              </div>

              <div className="row align-items-center">
                
                {/* Profile Card */}
                <div className="col-md-5 col-lg-4 mb-4 mb-md-0">
                  <div className={styles['prof-profile-card']}>
                    <div className={styles['prof-avatar']}>
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={fullName} className={styles['prof-avatar-img']} />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>
                    <h2 className={styles['prof-name']}>{fullName}</h2>
                    <div className={styles['prof-role']}>
                      {isHostMode ? (
                        <span className={`${styles['prof-badge-tag']} ${styles['prof-badge-host']}`}>
                          <FaAward style={{ marginRight: '4px' }} /> Host
                        </span>
                      ) : (
                        <span className={styles['prof-badge-tag']}>
                          <FaUserCheck style={{ marginRight: '4px' }} /> Guest
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Complete Profile Info / Details */}
                <div className="col-md-7 col-lg-8">
                  <div className={styles['prof-complete-section']}>
                    {isHostMode ? (
                      <>
                        <h3 className={styles['prof-complete-title']}>Hosting on Airbnb</h3>
                        <p className={styles['prof-complete-desc']}>
                          Welcome to your host profile! As an Airbnb host, your verified identity and genuine hospitality build trust with travellers around the world.
                        </p>
                        <div className="d-flex gap-3 flex-wrap align-items-center">
                          <NavLink to='/hosting/listings' className={styles['prof-get-started-btn']}>
                            Manage Listings
                          </NavLink>
                          <NavLink to='/edit-mode' className={styles['prof-edit-btn']} style={{ padding: '12px 20px', fontSize: '1rem' }}>
                            Edit Host Bio
                          </NavLink>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className={styles['prof-complete-title']}>Complete your profile</h3>
                        <p className={styles['prof-complete-desc']}>
                          Your Airbnb profile is an important part of every reservation. Create yours to help other hosts and guests get to know you.
                        </p>
                        <NavLink to='/edit-mode' className={styles['prof-get-started-btn']}>
                          Get started
                        </NavLink>
                      </>
                    )}
                  </div>
                </div>

              </div>

              <div className="row">
                <div className="col-lg-12">
                  <div className={styles['prof-reviews-link']}>
                    <BsChatLeftText size={18} /> {isHostMode ? "Show reviews from guests" : "Show reviews I've written"}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'connections' && (
            <>
              <div className={styles['prof-header-section']}>
                <h1 className={styles['prof-main-title']}>Connections</h1>
              </div>

              <div className={styles['prof-connections-content']}>
                <div className={styles['prof-connections-icon']}>
                  <FcConferenceCall size={120} />
                </div>
                <p className={styles['prof-connections-text']}>
                  When you join an experience or invite someone on a trip, you'll find the profiles of other guests here. <a href="#" className={styles['prof-connections-link']}>Learn more</a>
                </p>
                <NavLink to="/" className={styles['prof-book-trip-btn']}>Book a trip</NavLink>
              </div>
            </>
          )}

        </div>
      </main>

    </div>
  );
}

export default Profile;