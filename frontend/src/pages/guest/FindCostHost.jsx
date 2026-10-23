import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from '../../components/styles/FindCostHost.module.css';
import { 
  FaStar, FaHeart, FaChevronRight, FaArrowRight, FaTimes 
} from 'react-icons/fa';
import { 
  FiSearch, FiMapPin, FiShield, FiKey, FiHome, FiCheckSquare, FiAward 
} from 'react-icons/fi';
import AuthModal from '../../components/AuthModal';
import toast from 'react-hot-toast';

export default function FindCostHost() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});

  const [cohosts, setCohosts] = useState([]);
  const [loadingCohosts, setLoadingCohosts] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [savedFavorites, setSavedFavorites] = useState({});

  // Fetch top co-hosts from backend database
  const fetchCoHosts = async (cityQuery = '') => {
    try {
      setLoadingCohosts(true);
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const clean = cityQuery.trim();
      const url = clean 
        ? `${baseUrl}/listings/cohosts?city=${encodeURIComponent(clean)}` 
        : `${baseUrl}/listings/cohosts`;

      const res = await fetch(url);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCohosts(json.data);
      }
    } catch (err) {
      console.warn('Failed to load co-hosts from backend:', err);
    } finally {
      setLoadingCohosts(false);
    }
  };

  useEffect(() => {
    fetchCoHosts();
  }, []);

  // Real-time live search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCoHosts(searchCity);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchCity]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCoHosts(searchCity.trim());
  };

  const handleToggleFavorite = (idx, e) => {
    e.stopPropagation();
    setSavedFavorites(prev => {
      const next = !prev[idx];
      toast.success(next ? 'Saved to favorites' : 'Removed from favorites');
      return { ...prev, [idx]: next };
    });
  };

  // Sticky footer action
  const handleFooterAction = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      navigate('/host');
    }
  };

  const handleConnectWithCoHost = (cohost, e) => {
    if (e) e.stopPropagation();
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    toast.success(`Request sent to ${cohost.host_name || 'co-host'}! They will contact you shortly.`, {
      icon: '🤝'
    });
  };

  return (
    <div className={styles['fch-page-wrapper']}>
      <main className={styles['fch-main-content']}>
        <div className="container">
          <div className="row justify-content-start">
            {/* Main content col */}
            <div className="col-12 col-lg-10">
              
              <h1 className={styles['fch-title']}>Find someone to help you host</h1>
              <p className={styles['fch-subtitle']}>
                Get help managing your home and guests from an experienced co-host — a top-rated Airbnb host.
              </p>

              {/* Feature Points with React Icons matching Airbnb Design */}
              <div className={styles['fch-features-list']}>
                
                <div className={styles['fch-feature-item']}>
                  <div className={styles['fch-icon-wrapper']}>
                    <FiCheckSquare size={28} color="#222222" />
                  </div>
                  <div className={styles['fch-feature-text']}>
                    <h3>Choose the help you need</h3>
                    <p>Let a co-host handle everything, or choose from a list of tailored hosting services.</p>
                  </div>
                </div>

                <div className={styles['fch-feature-item']}>
                  <div className={styles['fch-icon-wrapper']}>
                    <FiKey size={28} color="#222222" />
                  </div>
                  <div className={styles['fch-feature-text']}>
                    <h3>Get on-site support</h3>
                    <p>Co-hosts can be at your property for guest check-ins, key handovers, and emergencies.</p>
                  </div>
                </div>

                <div className={styles['fch-feature-item']}>
                  <div className={styles['fch-icon-wrapper']}>
                    <FiHome size={28} color="#222222" />
                  </div>
                  <div className={styles['fch-feature-text']}>
                    <h3>Make the most of your home</h3>
                    <p>Get expert advice styling your space, professional photography, and writing listing descriptions.</p>
                  </div>
                </div>

              </div>

              {/* Dynamic Co-Hosts Section matching Home.jsx Card Aesthetics */}
              <div className={styles['fch-cohosts-header']}>
                <h2 className={styles['fch-section-title']}>
                  <span>Top-rated co-hosts in India</span>
                  <FaArrowRight size={12} color="#717171" />
                </h2>
              </div>
              <p className={styles['fch-section-desc']}>
                Experienced Superhosts ready to help you manage bookings, guest messaging, and cleanings.
              </p>

              {/* City Search Filter Bar */}
              <form onSubmit={handleSearchSubmit} className={styles['fch-search-bar']}>
                <FiSearch size={18} color="#717171" />
                <input 
                  type="text" 
                  placeholder="Search city, area or co-host name (e.g. Jaipur, Goa)..." 
                  className={styles['fch-search-input']}
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                />
                {searchCity && (
                  <button 
                    type="button" 
                    className={styles['fch-clear-btn']} 
                    onClick={() => {
                      setSearchCity('');
                      fetchCoHosts('');
                    }}
                    title="Clear search"
                  >
                    <FaTimes size={13} />
                  </button>
                )}
              </form>

              {/* Home.jsx Style Co-Hosts Grid */}
              {loadingCohosts ? (
                <div className="py-4 text-center text-muted">
                  <div className="spinner-border spinner-border-sm text-danger me-2" role="status"></div>
                  <span>Finding top co-hosts...</span>
                </div>
              ) : (
                <div className={styles['fch-cohosts-grid']}>
                  {cohosts.map((ch, idx) => (
                    <div 
                      key={idx} 
                      className={styles['fch-listing-card']}
                      onClick={() => handleConnectWithCoHost(ch)}
                    >
                      {/* Image Container with Guest Favourite Badge & Heart button */}
                      <div className={styles['fch-image-container']}>
                        <img 
                          src={ch.host_avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80`} 
                          alt={ch.host_name} 
                          className={styles['fch-listing-image']}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80';
                          }}
                        />

                        {/* Top Host / Guest Favourite Pill */}
                        <div className={styles['fch-guest-favourite']}>
                          <FiAward size={12} color="#ff385c" />
                          <span>Superhost</span>
                        </div>

                        {/* Heart Button */}
                        <div 
                          className={styles['fch-heart-btn']}
                          onClick={(e) => handleToggleFavorite(idx, e)}
                        >
                          <FaHeart 
                            size={22} 
                            color={savedFavorites[idx] ? '#ff385c' : 'rgba(0,0,0,0.5)'} 
                          />
                        </div>
                      </div>

                      {/* Listing Info Row */}
                      <div className={styles['fch-listing-info']}>
                        <div className={styles['fch-listing-title-row']}>
                          <h3 className={styles['fch-listing-title']}>{ch.host_name}</h3>
                          <div className={styles['fch-listing-rating']}>
                            <FaStar size={12} color="#222222" />
                            <span>{Number(ch.rating || 4.95).toFixed(2)}</span>
                          </div>
                        </div>

                        <p className={styles['fch-listing-subtitle']}>
                          {ch.city || 'Jaipur, India'} · {ch.years_experience || 3} yrs hosting
                        </p>

                        <p className={styles['fch-listing-experience']}>
                          {ch.properties_managed || 2} properties managed · {ch.reviews_count || 48} reviews
                        </p>

                        <button 
                          type="button" 
                          className={styles['fch-connect-action-btn']}
                          onClick={(e) => handleConnectWithCoHost(ch, e)}
                        >
                          Message {ch.host_name?.split(' ')[0] || 'co-host'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className={styles['fch-sticky-footer']}>
        <button 
          className={styles['fch-login-btn']}
          onClick={handleFooterAction}
        >
          {isAuthenticated ? 'Get started with co-hosting' : 'Log in to continue'}
        </button>
      </footer>

      {/* Auth Modal if guest is not logged in */}
      <AuthModal 
        show={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}