import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaLayerGroup } from 'react-icons/fa';
import styles from '../../components/styles/HostListings.module.css';
import VerifyBanner from '../../components/VerifyBanner';

function HostListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/listings');
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setListings(data.data);
        } else {
          // Fallback initial
          setListings([
            {
              id: 'sample',
              title: 'Your Experience & Stay',
              type: 'Home',
              city: 'Jaipur, India',
              cover_img: '/face_04.avif',
              status: 'Active'
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching host listings:', err);
        setListings([
          {
            id: 'sample',
            title: 'Your Experience & Stay',
            type: 'Home',
            city: 'Jaipur, India',
            cover_img: '/face_04.avif',
            status: 'Active'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className={styles.listingsPage}>
      <VerifyBanner />

      <div className="container-fluid p-lg-5">
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>Your listings</h1>
          <div className={styles.headerActions}>
            <button className={styles.iconBtn} title="View all">
              <FaLayerGroup size={16} />
            </button>
            <button className={styles.iconBtn} onClick={() => navigate('/host')} title="Create new listing">
              <FaPlus size={16} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            {listings.map((item) => (
              <div key={item.id} className="col-sm-12 col-md-4 col-lg-3 mb-4">
                <div 
                  className={styles.listingCard} 
                  onClick={() => navigate('/hosting/listing-editor')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.imageWrapper}>
                    <div className={styles.statusPill}>
                      <span className={item.status === 'Active' ? styles.greenDot || styles.redDot : styles.redDot}></span>
                      {item.status || 'Active'}
                    </div>
                    <img 
                      src={item.cover_img || '/face_04.avif'} 
                      alt={item.title} 
                      className={styles.listingImage}
                      onError={(e) => { e.target.src = '/face_04.avif'; }} 
                    />
                  </div>
                  <div className={styles.listingInfo}>
                    <h3 className={styles.listingTitle}>{item.title}</h3>
                    <p className={styles.listingLocation}>
                      {item.type || 'Listing'} in {item.city}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HostListings;