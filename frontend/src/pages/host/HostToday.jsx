import React, { useState, useEffect } from 'react';
import styles from '../../components/styles/HostToday.module.css';
import VerifyBanner from '../../components/VerifyBanner';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function HostToday() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth || {});
  const [activeTab, setActiveTab] = useState('Today');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchReservations = async () => {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const hostId = user?.id || 4;
      const timeframeParam = activeTab === 'Today' ? 'today' : 'upcoming';
      try {
        const res = await fetch(`${baseUrl}/payments/host/reservations?host_id=${hostId}&timeframe=${timeframeParam}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setReservations(Array.isArray(data.reservations) ? data.reservations : []);
          }
        }
      } catch (err) {
        console.error('Error fetching host reservations:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReservations();
    return () => {
      isMounted = false;
    };
  }, [activeTab, user]);

  const handleCompleteListing = () => {
    // If user has local draft route or draft id, navigate there, else go to /become-host
    const resumeRoute = localStorage.getItem('host_resume_route');
    if (resumeRoute) {
      navigate(resumeRoute);
    } else {
      navigate('/become-host');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={styles.todayPage}>
      <VerifyBanner />
      {/* Main Content */}
      <div className="container py-4">
        {/* Tabs */}
        <div className={styles.tabsWrapper}>
          <button 
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'Today' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('Today')}
          >
            Today
          </button>
          <button 
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'Upcoming' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('Upcoming')}
          >
            Upcoming
          </button>
        </div>

        {/* Dynamic Reservation List or Empty State */}
        {reservations.length > 0 ? (
          <div className={`${styles.reservationList} ${styles.fadeInUp}`} key={activeTab}>
            {reservations.map((res) => {
              const coverImg = res.cover_img || (Array.isArray(res.photos) && res.photos[0]) || '/book_01.avif';
              return (
                <div key={res.id || res.booking_code} className={styles.reservationCard}>
                  <img src={coverImg} alt={res.listing_title} className={styles.resImage} />
                  <div className={styles.resDetails}>
                    <div className={styles.resHeader}>
                      <span className={styles.resCode}>Code: {res.booking_code}</span>
                      <span className={styles.resStatus}>{res.status || 'CONFIRMED'}</span>
                    </div>
                    <h3 className={styles.resTitle}>{res.listing_title}</h3>
                    <p className={styles.resInfo}>
                      <strong>Guest:</strong> {res.guest_name} • {res.guests_count || 1} guest{(res.guests_count > 1) ? 's' : ''}
                    </p>
                    <p className={styles.resInfo}>
                      <strong>Dates:</strong> {formatDate(res.check_in)} – {formatDate(res.check_out)}
                    </p>
                    <div className={styles.resPrice}>
                      Total: ₹{Number(res.total_amount || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="row w-100 justify-content-center" key={activeTab}>
            <div className={`col-md-8 col-lg-6 text-center ${styles.fadeInUp}`}>
              <div className={styles.bookImageContainer}>
                <img src="/book_01.avif" alt="Open book" className={styles.bookImage} />
              </div>
              <h2 className={styles.emptyTitle}>
                You don't have<br/>any {activeTab === 'Upcoming' ? 'upcoming ' : ''}reservations
              </h2>
              <p className={styles.emptySubtext}>
                To get booked, you'll need to<br/>complete and publish your listing.
              </p>
              <button 
                type="button" 
                onClick={handleCompleteListing}
                className={styles.completeBtn}
              >
                Complete your listing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HostToday;