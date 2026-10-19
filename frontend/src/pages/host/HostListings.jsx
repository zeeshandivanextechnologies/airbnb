import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaLayerGroup, FaTimes, FaHome, FaThLarge, FaList, FaTrashAlt } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import styles from '../../components/styles/HostListings.module.css';
import setupStyles from '../../components/styles/HostSetup.module.css';
import VerifyBanner from '../../components/VerifyBanner';
import { renderCategoryIcon } from '../../utils/categoryIcons.jsx';

import { useSelector } from 'react-redux';

function HostListings() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'experiences' | 'services'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  
  // In-Progress / Action Required Modal State
  const [inProgressModalItem, setInProgressModalItem] = useState(null);

  // Create New Listing Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedHostingType, setSelectedHostingType] = useState(null);
  const [modalSettings, setModalSettings] = useState({
    title: "What would you like to host?",
    subtitle: ""
  });

  const hostingOptions = [
    {
      key: "home",
      name: "Home",
      icon: "home",
      description: "Rent out your entire place or a private room to guests.",
      route: "/host"
    },
    {
      key: "experience",
      name: "Experience",
      icon: "experience",
      description: "Lead activities guests can only find locally.",
      route: "/host?type=experience"
    },
    {
      key: "service",
      name: "Service",
      icon: "service",
      description: "Offer tailored in-person or on-demand services.",
      route: "/host?type=service"
    }
  ];

  useEffect(() => {
    const fetchStepSettings = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        const res = await fetch(`${baseUrl}/listings/step-settings/exp_type_modal`);
        const json = await res.json();
        if (json.success && json.data) {
          setModalSettings({
            title: json.data.title || "What would you like to host?",
            subtitle: json.data.subtitle || ""
          });
        }
      } catch (e) {}
    };
    fetchStepSettings();
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        
        // Find current user id from Redux or localStorage
        let currentUserId = user?.id;
        if (!currentUserId) {
          try {
            const stored = localStorage.getItem('user');
            if (stored) {
              const u = JSON.parse(stored);
              currentUserId = u?.id;
            }
            if (!currentUserId) {
              const storedAuth = localStorage.getItem('airbnb_user_auth');
              if (storedAuth) {
                const parsed = JSON.parse(storedAuth);
                currentUserId = parsed?.user?.id;
              }
            }
          } catch (e) {}
        }

        // Determine current user ID
        const queryHostId = currentUserId || 4;
        let url = `${baseUrl}/listings?host_id=${queryHostId}`;

        let res = await fetch(url);
        let data = await res.json();
        let fetchedListings = (data.success && Array.isArray(data.data)) ? data.data : [];

        // If current user is not 4, also fetch listings for current user or merge if host 4 was queried
        if (queryHostId !== 4) {
          try {
            const fallbackRes = await fetch(`${baseUrl}/listings?host_id=4`);
            const fallbackData = await fallbackRes.json();
            if (fallbackData.success && Array.isArray(fallbackData.data)) {
              // Combine unique listings
              const existingIds = new Set(fetchedListings.map(l => l.id));
              fallbackData.data.forEach(item => {
                if (!existingIds.has(item.id)) {
                  fetchedListings.push(item);
                  existingIds.add(item.id);
                }
              });
            }
          } catch (e) {}
        }

        // Also check localStorage for any pending/unfinished local drafts saved via Save & Exit
        try {
          const step1Str = localStorage.getItem('host_step1_data');
          const step2Str = localStorage.getItem('host_step2_data');
          const resumeRoute = localStorage.getItem('host_resume_route');
          const hostTypeDraft = localStorage.getItem('host_selected_type'); // 'experience' | 'service'
          
          const hasHomeDraft = Boolean(step1Str || step2Str || (resumeRoute && resumeRoute.includes('step')));
          const hasExpServiceDraft = Boolean(resumeRoute && (resumeRoute.includes('experience') || resumeRoute.includes('service')));

          // If there is an active local draft not yet in fetchedListings with 'In progress'
          const hasExistingDraft = fetchedListings.some(l => (l.status || '').toLowerCase().includes('in progress'));

          if ((hasHomeDraft || hasExpServiceDraft) && !hasExistingDraft) {
            let step1Data = {};
            let step2Data = {};
            try { if (step1Str) step1Data = JSON.parse(step1Str); } catch (e) {}
            try { if (step2Str) step2Data = JSON.parse(step2Str); } catch (e) {}

            const draftTitle = step2Data.title || (step1Data.selectedType ? `${step1Data.selectedType.charAt(0).toUpperCase() + step1Data.selectedType.slice(1)} listing` : 'Your listing in progress');
            const draftCategory = step1Data.selectedType ? (step1Data.selectedType.charAt(0).toUpperCase() + step1Data.selectedType.slice(1)) : (hasExpServiceDraft ? (resumeRoute.includes('service') ? 'Service' : 'Experience') : 'House');
            const draftCity = step1Data.address?.city || 'Jaipur, Rajasthan';
            const draftCover = step2Data.cover_img || (Array.isArray(step2Data.photos) && step2Data.photos[0]) || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';

            const syntheticDraft = {
              id: 'local_draft_' + Date.now(),
              title: draftTitle,
              type: step1Data.placeType === 'room' ? 'Room' : (step1Data.placeType === 'shared' ? 'Shared room' : (hasExpServiceDraft ? (resumeRoute.includes('service') ? 'Service' : 'Experience') : 'Entire place')),
              category: draftCategory,
              city: draftCity,
              status: 'In progress',
              cover_img: draftCover,
              photos: [draftCover],
              created_at: new Date().toISOString(),
              is_local_draft: true
            };

            fetchedListings.unshift(syntheticDraft);
          }
        } catch (e) {
          console.warn('Local draft merge error:', e);
        }

        setListings(fetchedListings);
      } catch (err) {
        console.error('Error fetching host listings:', err);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user]);

  // Filter listings based on active tab: 'all' | 'experiences' | 'services'
  const serviceCategories = [
    'chef', 'hairstyling', 'make-up', 'makeup', 'massage', 
    'personal training', 'photography', 'prepared meals', 'spa treatments', 'catering', 'service'
  ];

  const experienceCategories = [
    'art and design', 'fitness and wellness', 'food and drink', 
    'history and culture', 'nature and outdoors', 'experience'
  ];

  const filteredListings = listings.filter((item) => {
    if (activeFilter === 'all') return true;

    const itemType = (item.type || '').toLowerCase();
    const itemCat = (item.category || '').toLowerCase();

    if (activeFilter === 'services') {
      return (
        itemType.includes('service') ||
        serviceCategories.some(sc => itemCat.includes(sc) || itemType.includes(sc))
      );
    }

    if (activeFilter === 'experiences') {
      return (
        itemType.includes('experience') ||
        experienceCategories.some(ec => itemCat.includes(ec) || itemType.includes(ec))
      );
    }

    return true;
  });

  const handleListingClick = (item) => {
    const statusText = (item.status || '').toLowerCase();
    const isInProgress = statusText.includes('in progress') || statusText.includes('action') || statusText.includes('draft');
    
    if (isInProgress) {
      setInProgressModalItem(item);
    } else {
      navigate(item.id && item.id !== 'sample' ? `/hosting/listing-editor/${item.id}` : '/hosting/listing-editor');
    }
  };

  const handleRemoveListing = async (listingId) => {
    if (!listingId) return;
    try {
      if (String(listingId).startsWith('local_draft_')) {
        // Clear local storage drafts
        try {
          localStorage.removeItem('host_step1_data');
          localStorage.removeItem('host_step2_data');
          localStorage.removeItem('host_resume_route');
          localStorage.removeItem('host_draft_listing_id');
        } catch (e) {}
        setListings(prev => prev.filter(l => l.id !== listingId));
        setInProgressModalItem(null);
        toast.success('Listing removed successfully');
        return;
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const res = await fetch(`${baseUrl}/listings/${listingId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Listing removed successfully');
        try {
          const storedDraftId = localStorage.getItem('host_draft_listing_id');
          if (storedDraftId && String(storedDraftId) === String(listingId)) {
            localStorage.removeItem('host_draft_listing_id');
            localStorage.removeItem('host_step1_data');
            localStorage.removeItem('host_step2_data');
            localStorage.removeItem('host_resume_route');
          }
        } catch (e) {}
        setListings(prev => prev.filter(l => l.id !== listingId));
        setInProgressModalItem(null);
      } else {
        toast.error(data.message || 'Failed to remove listing');
      }
    } catch (err) {
      console.error('Failed to remove listing:', err);
      toast.error('Network error removing listing');
    }
  };

  return (
    <div className={styles.listingsPage}>
      <VerifyBanner />

      <div className="container-fluid p-lg-5">
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>Your listings</h1>
          <div className={styles.headerActions}>
            <button 
              className={styles.iconBtn} 
              onClick={() => setViewMode(prev => prev === 'grid' ? 'table' : 'grid')} 
              title={viewMode === 'grid' ? "Switch to table view" : "Switch to grid view"}
            >
              {viewMode === 'grid' ? <FaLayerGroup size={16} /> : <FaThLarge size={16} />}
            </button>
            <button 
              className={styles.iconBtn} 
              onClick={() => {
                setSelectedHostingType(null);
                setShowCreateModal(true);
              }} 
              title="Create new listing"
            >
              <FaPlus size={16} />
            </button>
          </div>
        </div>

        {/* Filter Tabs Bar (All | Experiences | Services) */}
        <div className={styles.filterTabsBar}>
          <button
            type="button"
            className={`${styles.filterTabPill} ${activeFilter === 'all' ? styles.filterTabPillActive : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button
            type="button"
            className={`${styles.filterTabPill} ${activeFilter === 'experiences' ? styles.filterTabPillActive : ''}`}
            onClick={() => setActiveFilter('experiences')}
          >
            Experiences
          </button>
          <button
            type="button"
            className={`${styles.filterTabPill} ${activeFilter === 'services' ? styles.filterTabPillActive : ''}`}
            onClick={() => setActiveFilter('services')}
          >
            Services
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className={styles.emptyState}>
            <h3 className={styles.emptyStateTitle}>
              No {activeFilter === 'all' ? '' : activeFilter} listings found
            </h3>
            <p className={styles.emptyStateSub}>
              {activeFilter === 'services' 
                ? 'You have not published any service listings yet.'
                : activeFilter === 'experiences'
                ? 'You have not published any experience listings yet.'
                : 'You have no listings yet.'}
            </p>
            <button 
              type="button" 
              className={styles.createListingBtn}
              onClick={() => {
                setSelectedHostingType(null);
                setShowCreateModal(true);
              }}
            >
              <FaPlus size={12} /> Create a new {activeFilter === 'services' ? 'service' : activeFilter === 'experiences' ? 'experience' : 'listing'}
            </button>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View matching screenshot */
          <div className={styles.tableResponsiveWrapper}>
            <table className={styles.listingsTable}>
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Listing</th>
                  <th style={{ width: '20%' }}>Type</th>
                  <th style={{ width: '20%' }}>Location</th>
                  <th style={{ width: '15%' }}>Status</th>
                  <th style={{ width: '5%', textAlign: 'center' }}>
                    <FiSettings size={16} color="#717171" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((item) => {
                  const statusText = item.status || 'In progress';
                  const isActionRequired = statusText.toLowerCase().includes('action');
                  const isSubmitted = statusText.toLowerCase().includes('submitted');
                  const isActive = statusText.toLowerCase().includes('active');

                  const dotClass = isActive 
                    ? styles.dotGreen 
                    : isActionRequired 
                    ? styles.dotRed 
                    : styles.dotOrange;

                  return (
                    <tr 
                      key={item.id} 
                      className={styles.tableRow}
                      onClick={() => handleListingClick(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <div className={styles.tableListingCell}>
                          <img 
                            src={item.cover_img || (Array.isArray(item.photos) && item.photos[0]) || '/face_04.avif'} 
                            alt={item.title} 
                            className={styles.tableThumb}
                            onError={(e) => { e.target.src = '/face_04.avif'; }}
                          />
                          <h4 className={styles.tableListingTitle}>{item.title}</h4>
                        </div>
                      </td>
                      <td className={styles.tableTypeCell}>
                        {item.type || 'Experience'}
                      </td>
                      <td className={styles.tableLocationCell}>
                        {item.city || 'Jaipur, Rajasthan'}
                      </td>
                      <td>
                        <div className={styles.tableStatusCell}>
                          <span className={`${styles.statusDot} ${dotClass}`}></span>
                          <span>{statusText}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          className={styles.tableSettingsBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleListingClick(item);
                          }}
                          title="Edit listing"
                        >
                          <FiSettings size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="row">
            {filteredListings.map((item) => (
              <div key={item.id} className="col-sm-12 col-md-4 col-lg-3 mb-4">
                <div 
                  className={styles.listingCard} 
                  onClick={() => handleListingClick(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.imageWrapper}>
                    {(() => {
                      const statusText = item.status || 'In progress';
                      const isActionRequired = statusText.toLowerCase().includes('action');
                      const isActive = statusText.toLowerCase().includes('active');
                      const dotClass = isActive ? styles.dotGreen : isActionRequired ? styles.dotRed : styles.dotOrange;
                      return (
                        <div className={styles.statusPill}>
                          <span className={`${styles.statusDot} ${dotClass}`}></span>
                          <span>{statusText}</span>
                        </div>
                      );
                    })()}
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

      {/* Create New Listing Modal (Home | Experience | Service) */}
      {showCreateModal && (
        <div 
          className={setupStyles.modalOverlay}
          onClick={() => setShowCreateModal(false)}
        >
          <div 
            className={setupStyles.expModalDialog}
            style={{ maxWidth: '820px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={setupStyles.expModalHeader}>
              <button 
                className={setupStyles.expModalClose}
                onClick={() => setShowCreateModal(false)}
              >
                <FaTimes />
              </button>
              <h2 className={setupStyles.expModalTitle}>
                {modalSettings.title || "What would you like to host?"}
              </h2>
              {modalSettings.subtitle && (
                <p style={{ fontSize: '14px', color: '#717171', margin: '4px 0 0 0', textAlign: 'center' }}>
                  {modalSettings.subtitle}
                </p>
              )}
            </div>

            <div className={setupStyles.expModalBody} style={{ flexWrap: 'wrap' }}>
              {hostingOptions.map((opt) => (
                <div 
                  key={opt.key}
                  className={`${setupStyles.expModalCard} ${selectedHostingType === opt.key ? setupStyles.expModalCardSelected : ''}`}
                  onClick={() => setSelectedHostingType(opt.key)}
                  style={{ minWidth: '220px', flex: '1 1 220px' }}
                >
                  <div className={setupStyles.expModalIcon}>
                    {renderCategoryIcon(opt.icon || opt.key, { size: '' })}
                  </div>
                  <div className={setupStyles.expModalName}>{opt.name}</div>
                  {opt.description && (
                    <div className={setupStyles.expModalSub}>
                      {opt.description}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className={setupStyles.expModalFooter}>
              <button
                className={`${setupStyles.footerNextBtn} ${!selectedHostingType ? setupStyles.footerNextBtnDisabled : ''}`}
                disabled={!selectedHostingType}
                onClick={() => {
                  const targetObj = hostingOptions.find(o => o.key === selectedHostingType);
                  setShowCreateModal(false);
                  if (targetObj) {
                    navigate(targetObj.route);
                  }
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-Progress / Action Required Modal (Matching User Screenshot) */}
      {inProgressModalItem && (
        <div 
          className={styles.inProgressModalOverlay}
          onClick={() => setInProgressModalItem(null)}
        >
          <div 
            className={styles.inProgressModalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button"
              className={styles.inProgressCloseBtn}
              onClick={() => setInProgressModalItem(null)}
              title="Close"
              aria-label="Close"
            >
              <FaTimes size={16} />
            </button>

            {/* Gray placeholder / Cover image */}
            <div className={styles.inProgressImgWrap}>
              {inProgressModalItem.cover_img ? (
                <img 
                  src={inProgressModalItem.cover_img} 
                  alt={inProgressModalItem.title} 
                  className={styles.inProgressImg}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : null}
            </div>

            {/* Dynamic Title (e.g., Your House listing started on 19 October 2026) */}
            <h3 className={styles.inProgressTitle}>
              {(() => {
                const categoryOrType = inProgressModalItem.category || inProgressModalItem.type || 'House';
                const createdDate = inProgressModalItem.created_at 
                  ? new Date(inProgressModalItem.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                  : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
                return `Your ${categoryOrType} listing started on ${createdDate}`;
              })()}
            </h3>

            {/* Location (e.g. Jaipur, India) */}
            <p className={styles.inProgressLocation}>
              {inProgressModalItem.city || 'Jaipur, India'}
            </p>

            {/* Primary Action Button: Edit listing */}
            <button 
              type="button"
              className={styles.inProgressEditBtn}
              onClick={() => {
                const targetId = inProgressModalItem.id;
                setInProgressModalItem(null);
                
                // If this is an in-progress draft created during wizard flow, resume at the exact saved step
                const savedResumeRoute = localStorage.getItem('host_resume_route');
                const itemCat = (inProgressModalItem.category || inProgressModalItem.type || '').toLowerCase();
                const isHome = itemCat.includes('home') || itemCat.includes('stay') || itemCat.includes('entire') || itemCat.includes('room') || itemCat.includes('house') || itemCat.includes('apartment');
                const isService = itemCat.includes('service');
                const isExperience = itemCat.includes('experience') || (!isHome && !isService);

                if (savedResumeRoute) {
                  // Direct jump to the exact step saved (e.g. /step1?step=4, /step2?step=3, /host?type=service&step=10)
                  navigate(savedResumeRoute);
                } else if (isHome) {
                  // Check localStorage step1 or step2
                  const s2 = localStorage.getItem('host_step2_data');
                  const s1 = localStorage.getItem('host_step1_data');
                  if (s2) {
                    try {
                      const parsed2 = JSON.parse(s2);
                      navigate(`/step2?step=${parsed2.lastStep || 1}`);
                      return;
                    } catch (e) {}
                  }
                  if (s1) {
                    try {
                      const parsed1 = JSON.parse(s1);
                      navigate(`/step1?step=${parsed1.lastStep || 1}`);
                      return;
                    } catch (e) {}
                  }
                  navigate('/step1');
                } else if (isService) {
                  navigate('/host?type=service');
                } else if (isExperience) {
                  navigate('/host?type=experience');
                } else {
                  navigate(targetId && targetId !== 'sample' ? `/hosting/listing-editor/${targetId}` : '/step1');
                }
              }}
            >
              Edit listing
            </button>

            {/* Secondary Action Button: Remove listing with Trash Icon */}
            <button 
              type="button"
              className={styles.inProgressRemoveBtn}
              onClick={() => handleRemoveListing(inProgressModalItem.id)}
            >
              <FaTrashAlt size={15} />
              <span>Remove listing</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HostListings;