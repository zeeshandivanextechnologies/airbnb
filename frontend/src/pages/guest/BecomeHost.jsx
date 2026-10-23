import React, { useState, useEffect } from 'react';
import styles from '../../components/styles/BecomeHost.module.css';
import { MdOutlineAddHome, MdChevronRight, MdOutlineEditNote } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthModal from '../../components/AuthModal';

function BecomeHost() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [draftListing, setDraftListing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Extract display name dynamically
  const firstName = user?.firstName || user?.first_name || (user?.name ? user.name.split(' ')[0] : '');
  const displayName = firstName ? firstName : (isAuthenticated ? 'Host' : '');

  // Check for in-progress or draft listing from backend or localStorage
  useEffect(() => {
    let isMounted = true;
    const fetchUserDrafts = async () => {
      const activeUserId = user?.id || (user?._id);
      if (!activeUserId) {
        // Fallback to local draft check if any
        try {
          const step1Str = localStorage.getItem('host_step1_data');
          const step2Str = localStorage.getItem('host_step2_data');
          const resumeRoute = localStorage.getItem('host_resume_route');
          if (step1Str || step2Str || resumeRoute) {
            let step2Data = {};
            try { if (step2Str) step2Data = JSON.parse(step2Str); } catch (e) {}
            if (isMounted) {
              setDraftListing({
                id: localStorage.getItem('host_draft_listing_id') || 'local-draft',
                title: step2Data.title || 'Finish your listing',
                route: resumeRoute || '/host'
              });
            }
          }
        } catch (e) {}
        return;
      }

      setIsLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${baseUrl}/listings?host_id=${activeUserId}&status=all`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          // Look for an in-progress or draft listing
          const foundDraft = json.data.find(item => {
            const st = (item.status || '').toLowerCase();
            return st.includes('in progress') || st.includes('draft') || st.includes('action');
          });

          if (foundDraft && isMounted) {
            setDraftListing({
              id: foundDraft.id,
              title: foundDraft.title || 'Finish your listing in progress',
              route: `/host?id=${foundDraft.id}`
            });
          } else {
            // Also check localStorage
            const resumeRoute = localStorage.getItem('host_resume_route');
            const step1Str = localStorage.getItem('host_step1_data');
            if ((resumeRoute || step1Str) && isMounted) {
              setDraftListing({
                id: 'local-draft',
                title: 'Finish your listing in progress',
                route: resumeRoute || '/host'
              });
            }
          }
        }
      } catch (err) {
        console.error('Error fetching host drafts:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchUserDrafts();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleStartNewListing = (e) => {
    e.preventDefault();
    if (!isAuthenticated && !user) {
      setShowAuthModal(true);
      return;
    }
    // Clear previous draft references if explicitly starting fresh
    try {
      localStorage.removeItem('host_draft_listing_id');
      localStorage.removeItem('host_step1_data');
      localStorage.removeItem('host_step2_data');
      localStorage.removeItem('host_resume_route');
    } catch (e) {}
    navigate('/host');
  };

  const handleResumeListing = (e, route) => {
    e.preventDefault();
    if (!isAuthenticated && !user) {
      setShowAuthModal(true);
      return;
    }
    navigate(route || '/host');
  };

  return (
    <div className={styles['bh-page-wrapper']}>
      <div className="container">
        {/* Bootstrap Grid for responsiveness */}
        <div className="row justify-content-center">
          <div className={`col-md-6 col-lg-6 col-sm-12 ${styles['bh-content-container']}`}>
            
            <h1 className={styles['bh-title']}>
              {displayName ? `Welcome back, ${displayName}` : 'Welcome to Airbnb Hosting'}
            </h1>
            <h2 className={styles['bh-subtitle']}>
              {draftListing ? 'Continue or start a new listing' : 'Start a new listing'}
            </h2>

            {/* If user has an in-progress draft */}
            {draftListing && (
              <button
                type="button"
                onClick={(e) => handleResumeListing(e, draftListing.route)}
                className={styles['bh-listing-btn']}
                style={{ textAlign: 'left' }}
              >
                <div className={styles['bh-btn-left']}>
                  <MdOutlineEditNote className={styles['bh-btn-icon']} />
                  <span className={styles['bh-btn-text']}>
                    {draftListing.title || 'Finish your listing'}
                  </span>
                </div>
                <MdChevronRight className={styles['bh-btn-arrow']} />
              </button>
            )}

            {/* Create fresh listing button */}
            <button
              type="button"
              onClick={handleStartNewListing}
              className={styles['bh-listing-btn']}
              style={{ textAlign: 'left' }}
            >
              <div className={styles['bh-btn-left']}>
                <MdOutlineAddHome className={styles['bh-btn-icon']} />
                <span className={styles['bh-btn-text']}>Create a new listing</span>
              </div>
              <MdChevronRight className={styles['bh-btn-arrow']} />
            </button>
            
          </div>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            navigate('/host');
          }}
        />
      )}
    </div>
  );
}

export default BecomeHost;