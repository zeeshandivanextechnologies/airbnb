import React, { useState } from 'react';
import { 
  FaHome, 
  FaClock, 
  FaStar, 
  FaHeart, 
  FaEye, 
  FaEyeSlash, 
  FaEdit, 
  FaTrashAlt, 
  FaCheck, 
  FaTimes, 
  FaSearch, 
  FaMapMarkerAlt, 
  FaRupeeSign, 
  FaImages, 
  FaWifi, 
  FaSwimmingPool, 
  FaParking, 
  FaTv, 
  FaSnowflake, 
  FaUtensils, 
  FaUserTie,
  FaArrowUp,
  FaCamera,
  FaUpload
} from 'react-icons/fa';
import styles from './styles/Listings.module.css';

export default function Listings() {
  const initialListings = [
    {
      id: 1,
      title: 'Sunset Hilltop Heritage Homestay',
      type: 'Entire Villa · 3 Beds · 3 Baths',
      host: 'Vikram Rajput',
      hostPhone: '+91 94140 88776',
      city: 'Udaipur, Rajasthan',
      price: 2400,
      status: 'Active', // 'Active' | 'Pending' | 'Hidden' | 'Rejected'
      isFeatured: true,
      isGuestFavourite: true,
      rating: 4.96,
      reviewsCount: 48,
      coverImg: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80',
      photos: [
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80'
      ],
      amenities: ['Private Pool', 'High-Speed WiFi', 'Free Parking', 'Kitchen', 'Air Conditioning', 'Lake View']
    },
    {
      id: 2,
      title: 'Goan Beachfront Eco Cottage',
      type: 'Private Cottage · 2 Beds · 2 Baths',
      host: 'Ananya Roy',
      hostPhone: '+91 99123 45678',
      city: 'North Goa',
      price: 3200,
      status: 'Pending',
      isFeatured: false,
      isGuestFavourite: false,
      rating: 4.88,
      reviewsCount: 12,
      coverImg: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=400&q=80',
      photos: [
        'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80'
      ],
      amenities: ['Beachfront Access', 'Free WiFi', 'Breakfast Included', 'Air Conditioning']
    },
    {
      id: 3,
      title: 'Creative Hair & Styling Studio Stay',
      type: 'Experience · Art & Culture',
      host: 'Mohammad Alvi',
      hostPhone: '+91 98760 54321',
      city: 'Sawai Madhopur, Rajasthan',
      price: 500,
      status: 'Active',
      isFeatured: false,
      isGuestFavourite: true,
      rating: 5.0,
      reviewsCount: 34,
      coverImg: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
      photos: [
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80'
      ],
      amenities: ['Styling Workshop', 'Beverages Included', 'Art Studio Tour']
    },
    {
      id: 4,
      title: 'Travel Sketching in Old Jaipur Courtyard',
      type: 'Experience · Painting & Arts',
      host: 'Priya Sharma',
      hostPhone: '+91 98290 12345',
      city: 'Jaipur, Rajasthan',
      price: 800,
      status: 'Active',
      isFeatured: true,
      isGuestFavourite: false,
      rating: 4.92,
      reviewsCount: 22,
      coverImg: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=400&q=80',
      photos: [
        'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80'
      ],
      amenities: ['Art Supplies Provided', 'Tea & Refreshments', 'Heritage Courtyard']
    },
    {
      id: 5,
      title: 'Snow View Wooden Chalet',
      type: 'Entire Chalet · 4 Beds · 3 Baths',
      host: 'Devendra Joshi',
      hostPhone: '+91 98111 22334',
      city: 'Manali, Himachal Pradesh',
      price: 4500,
      status: 'Hidden',
      isFeatured: false,
      isGuestFavourite: false,
      rating: 4.75,
      reviewsCount: 19,
      coverImg: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80',
      photos: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'
      ],
      amenities: ['Fireplace', 'Heater', 'Mountain View', 'Kitchen', 'Free Parking']
    }
  ];

  const [listings, setListings] = useState(initialListings);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'active' | 'hidden'
  const [tagFilter, setTagFilter] = useState('all'); // 'all' | 'guest_fav' | 'featured'

  // Modals state
  const [previewListing, setPreviewListing] = useState(null); // for viewing photos, amenities & location
  const [editListing, setEditListing] = useState(null); // for editing title, price, location, status
  const [newImageUrl, setNewImageUrl] = useState('');

  // Filtered Listings
  const filteredListings = listings.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.host.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'pending' ? item.status === 'Pending' :
      activeTab === 'active' ? item.status === 'Active' :
      activeTab === 'hidden' ? item.status === 'Hidden' : true;

    const matchesTag = 
      tagFilter === 'all' ? true :
      tagFilter === 'guest_fav' ? item.isGuestFavourite :
      tagFilter === 'featured' ? item.isFeatured : true;

    return matchesSearch && matchesTab && matchesTag;
  });

  // Action handlers
  const handleApprove = (id) => {
    setListings(listings.map(l => l.id === id ? { ...l, status: 'Active' } : l));
    if (previewListing && previewListing.id === id) {
      setPreviewListing({ ...previewListing, status: 'Active' });
    }
  };

  const handleReject = (id) => {
    setListings(listings.map(l => l.id === id ? { ...l, status: 'Rejected' } : l));
    if (previewListing && previewListing.id === id) {
      setPreviewListing({ ...previewListing, status: 'Rejected' });
    }
  };

  const handleToggleHide = (id) => {
    setListings(listings.map(l => {
      if (l.id === id) {
        const nextStatus = l.status === 'Hidden' ? 'Active' : 'Hidden';
        return { ...l, status: nextStatus };
      }
      return l;
    }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this property listing permanently?')) {
      setListings(listings.filter(l => l.id !== id));
      if (previewListing && previewListing.id === id) setPreviewListing(null);
      if (editListing && editListing.id === id) setEditListing(null);
    }
  };

  const handleToggleFeatured = (id) => {
    setListings(listings.map(l => l.id === id ? { ...l, isFeatured: !l.isFeatured } : l));
  };

  const handleToggleGuestFavourite = (id) => {
    setListings(listings.map(l => l.id === id ? { ...l, isGuestFavourite: !l.isGuestFavourite } : l));
  };

  
  // Image Manager Handlers
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    const currentPhotos = editListing.photos || [];
    const updatedPhotos = [...currentPhotos, newImageUrl.trim()];
    setEditListing({
      ...editListing,
      photos: updatedPhotos,
      coverImg: editListing.coverImg || newImageUrl.trim()
    });
    setNewImageUrl('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result;
        const currentPhotos = editListing.photos || [];
        setEditListing({
          ...editListing,
          photos: [...currentPhotos, base64Url],
          coverImg: editListing.coverImg || base64Url
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (photoIndex) => {
    const updatedPhotos = editListing.photos.filter((_, idx) => idx !== photoIndex);
    let updatedCover = editListing.coverImg;
    if (editListing.photos[photoIndex] === editListing.coverImg) {
      updatedCover = updatedPhotos[0] || '';
    }
    setEditListing({
      ...editListing,
      photos: updatedPhotos,
      coverImg: updatedCover
    });
  };

  const handleSetCoverPhoto = (photoUrl) => {
    setEditListing({
      ...editListing,
      coverImg: photoUrl
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setListings(listings.map(l => l.id === editListing.id ? editListing : l));
    setEditListing(null);
  };

  return (
    <>
      {/* 1. Stat Summary Cards */}
      <div className="row mb-3">
        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Total Listings</span>
                <div className={styles.statIconBox} style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <FaHome />
                </div>
              </div>
              <div className={styles.statValue}>{listings.length}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
                <FaArrowUp size={9} /> Live
              </span>
              <span className={styles.statSubtext}>Across all locations</span>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Pending Approval</span>
                <div className={styles.statIconBox} style={{ background: '#fefce8', color: '#ca8a04' }}>
                  <FaClock />
                </div>
              </div>
              <div className={styles.statValue}>{listings.filter(l => l.status === 'Pending').length}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeWarning}`}>
                Review Needed
              </span>
              <span className={styles.statSubtext}>New submissions</span>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Guest Favourites</span>
                <div className={styles.statIconBox} style={{ background: '#fff1f2', color: '#ff385c' }}>
                  <FaHeart />
                </div>
              </div>
              <div className={styles.statValue}>{listings.filter(l => l.isGuestFavourite).length}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgePink}`}>
                Top Rated
              </span>
              <span className={styles.statSubtext}>Highest guest reviews</span>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Featured Stays</span>
                <div className={styles.statIconBox} style={{ background: '#fefce8', color: '#ca8a04' }}>
                  <FaStar />
                </div>
              </div>
              <div className={styles.statValue}>{listings.filter(l => l.isFeatured).length}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeWarning}`}>
                Homepage
              </span>
              <span className={styles.statSubtext}>Highlighted properties</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Listings Directory Card */}
      <div className={styles.mainCard}>
        <div className={styles.cardHeader}>
          <div className={styles.headerTitles}>
            <h2 className={styles.title}>Listings (Property) Management</h2>
            <p className={styles.subtitle}>
              Approve new submissions, check photos & amenities, edit prices, toggle guest favourites, and manage listing visibility.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className={styles.tabGroup}>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'all' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All ({listings.length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'pending' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending ({listings.filter(l => l.status === 'Pending').length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'active' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'hidden' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('hidden')}
            >
              Hidden
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className={styles.controlsBar}>
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search by title, location or host name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <select 
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Badge: All Listings</option>
              <option value="guest_fav">Guest Favourite Only</option>
              <option value="featured">Featured Only</option>
            </select>
          </div>
        </div>

        {/* Listings Table */}
        <div className="table-responsive">
          <table className={`table table-hover align-middle mb-0 ${styles.listingTable}`}>
            <thead className="table-light">
              <tr>
                <th style={{ width: '60px' }}>Sr. No.</th>
                <th>Property / Stay</th>
                <th>Host</th>
                <th>Price / Night</th>
                <th>Location</th>
                <th>Badges</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#9ca3af' }}>
                    No listings found matching the selected search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredListings.map((item, idx) => (
                  <tr key={item.id}>
                    <td><span style={{ fontWeight: '600', color: '#64748b' }}>{idx + 1}</span></td>
                    {/* Property Thumbnail & Title */}
                    <td>
                      <div className={styles.propertyCell}>
                        <div className={styles.propertyImageWrapper} onClick={() => setPreviewListing(item)} style={{ cursor: 'pointer' }} title="Click to view photos">
                          <img src={item.coverImg} alt={item.title} className={styles.propertyThumbImg} />
                        </div>
                        <div className={styles.propertyInfo}>
                          <span className={styles.propertyTitle}>
                            {item.title}
                          </span>
                          <span className={styles.propertySub}>{item.type}</span>
                        </div>
                      </div>
                    </td>

                    {/* Host */}
                    <td>
                      <span style={{ fontWeight: '600', color: '#111111' }}>{item.host}</span>
                    </td>

                    {/* Price */}
                    <td>
                      <span style={{ fontWeight: '800', color: '#111111', fontSize: '14px' }}>
                        ₹{item.price.toLocaleString()}
                      </span>
                    </td>

                    {/* Location */}
                    <td>
                      <span style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FaMapMarkerAlt size={11} color="#ff385c" />
                        {item.city}
                      </span>
                    </td>

                    {/* Featured / Guest Favourite Toggles */}
                    <td>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <button 
                          type="button"
                          className={`${styles.btnAction} ${item.isGuestFavourite ? styles.btnActionFavActive : ''}`}
                          onClick={() => handleToggleGuestFavourite(item.id)}
                          title={item.isGuestFavourite ? 'Remove Guest Favourite' : 'Mark as Guest Favourite'}
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                        >
                          <FaHeart size={10} color={item.isGuestFavourite ? '#ff385c' : '#9ca3af'} />
                          {item.isGuestFavourite ? 'Fav' : '+Fav'}
                        </button>

                        <button 
                          type="button"
                          className={`${styles.btnAction} ${item.isFeatured ? styles.btnActionStarActive : ''}`}
                          onClick={() => handleToggleFeatured(item.id)}
                          title={item.isFeatured ? 'Remove from Featured' : 'Mark as Featured on Homepage'}
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                        >
                          <FaStar size={10} color={item.isFeatured ? '#ca8a04' : '#9ca3af'} />
                          {item.isFeatured ? 'Featured' : '+Feature'}
                        </button>
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`${styles.badgeStatus} ${
                        item.status === 'Active' ? styles.badgeActive :
                        item.status === 'Pending' ? styles.badgePending :
                        item.status === 'Hidden' ? styles.badgeHidden : styles.badgeRejected
                      }`}>
                        ● {item.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className={styles.actionGroup}>
                        {/* If Pending: Approve / Reject */}
                        {item.status === 'Pending' ? (
                          <>
                            <button 
                              type="button"
                              className={`${styles.btnAction} ${styles.btnActionApprove}`}
                              onClick={() => handleApprove(item.id)}
                              title="Approve Property Listing"
                            >
                              <FaCheck /> Approve
                            </button>
                            <button 
                              type="button"
                              className={`${styles.btnAction} ${styles.btnActionReject}`}
                              onClick={() => handleReject(item.id)}
                              title="Reject Listing"
                            >
                              <FaTimes /> Reject
                            </button>
                          </>
                        ) : null}

                        {/* View Photos & Details */}
                        <button 
                          type="button" 
                          className={styles.btnAction}
                          onClick={() => setPreviewListing(item)}
                          title="View Photos, Amenities & Location"
                        >
                          <FaImages /> Preview
                        </button>

                        {/* Edit Property */}
                        <button 
                          type="button" 
                          className={styles.btnAction}
                          onClick={() => setEditListing({ ...item })}
                          title="Edit Property Details & Price"
                        >
                          <FaEdit />
                        </button>

                        {/* Hide / Unhide */}
                        <button 
                          type="button" 
                          className={styles.btnAction}
                          onClick={() => handleToggleHide(item.id)}
                          title={item.status === 'Hidden' ? 'Unhide / Make Live' : 'Hide from Public Search'}
                        >
                          {item.status === 'Hidden' ? <FaEye color="#16a34a" /> : <FaEyeSlash color="#64748b" />}
                        </button>

                        {/* Delete */}
                        <button 
                          type="button" 
                          className={`${styles.btnAction} ${styles.btnActionDelete}`}
                          onClick={() => handleDelete(item.id)}
                          title="Delete Listing"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Preview Modal Dialog (Photos, Amenities, Location) */}
      {previewListing && (
        <div className={styles.modalBackdrop} onClick={() => setPreviewListing(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>{previewListing.title}</h3>
                <span style={{ fontSize: '12px', color: '#717171' }}>
                  {previewListing.type} · Managed by {previewListing.host}
                </span>
              </div>
              <button type="button" className={styles.modalCloseBtn} onClick={() => setPreviewListing(null)}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Photo Gallery Grid */}
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#111111', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <FaCamera color="#ff385c" /> Verified Property Photos ({previewListing.photos.length}):
              </span>
              <div className={styles.photoGalleryGrid}>
                {previewListing.photos.map((url, idx) => (
                  <img key={idx} src={url} alt={`Photo ${idx + 1}`} className={styles.galleryThumb} />
                ))}
              </div>

              {/* Price & Location details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '18px' }}>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Base Price / Night</span>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: '#111111' }}>
                    ₹{previewListing.price.toLocaleString()}
                  </span>
                </div>

                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Verified Location</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#111111', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FaMapMarkerAlt color="#ff385c" /> {previewListing.city}
                  </span>
                </div>
              </div>

              {/* Amenities List */}
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#111111', display: 'block', marginBottom: '6px' }}>
                Included Amenities:
              </span>
              <div className={styles.amenitiesList}>
                {previewListing.amenities.map((am, i) => (
                  <span key={i} className={styles.amenityPill}>
                    <FaCheck size={10} color="#16a34a" /> {am}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.modalFooter}>
              {previewListing.status === 'Pending' && (
                <>
                  <button 
                    type="button" 
                    className={`${styles.btnAction} ${styles.btnActionReject}`}
                    onClick={() => handleReject(previewListing.id)}
                  >
                    <FaTimes /> Reject
                  </button>
                  <button 
                    type="button" 
                    className={styles.btnPrimary}
                    onClick={() => handleApprove(previewListing.id)}
                  >
                    <FaCheck /> Approve Listing
                  </button>
                </>
              )}
              <button type="button" className={styles.btnSecondary} onClick={() => setPreviewListing(null)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Edit Property Modal Dialog */}
      {editListing && (
        <div className={styles.modalBackdrop} onClick={() => setEditListing(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSaveEdit}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Edit Property Details</h3>
                <button type="button" className={styles.modalCloseBtn} onClick={() => setEditListing(null)}>
                  <FaTimes />
                </button>
              </div>

              <div className={styles.modalBody}>
                {/* 1. Property Images Manager */}
                <div className={styles.imageManagerSection}>
                  <div className={styles.imageSectionTitle}>
                    <span>Property Photos ({editListing.photos ? editListing.photos.length : 0})</span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Select cover photo or upload new</span>
                  </div>

                  {/* Photo Cards Grid */}
                  <div className={styles.editPhotoGrid}>
                    {(editListing.photos || []).map((url, pIdx) => {
                      const isCover = editListing.coverImg === url;
                      return (
                        <div 
                          key={pIdx} 
                          className={`${styles.editPhotoCard} ${isCover ? styles.editPhotoCardCover : ''}`}
                        >
                          <img src={url} alt={`Listing photo ${pIdx + 1}`} className={styles.editPhotoImg} />
                          {isCover && <span className={styles.coverBadge}>Cover</span>}
                          
                          <button 
                            type="button" 
                            className={styles.removePhotoBtn}
                            onClick={() => handleRemovePhoto(pIdx)}
                            title="Delete this photo"
                          >
                            <FaTimes />
                          </button>

                          {!isCover && (
                            <button 
                              type="button"
                              className={styles.makeCoverBtn}
                              onClick={() => handleSetCoverPhoto(url)}
                              title="Set as main cover photo"
                            >
                              Set as Cover
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Photo Input & Local File Upload */}
                  <div className={styles.addPhotoBar}>
                    <input 
                      type="url"
                      placeholder="Paste Image URL (https://...)..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className={styles.formInput}
                      style={{ height: '36px', fontSize: '13px' }}
                    />
                    <button 
                      type="button" 
                      className={styles.btnSecondary}
                      onClick={handleAddImageUrl}
                      style={{ height: '36px', padding: '0 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
                    >
                      + Add URL
                    </button>

                    <label className={styles.uploadFileBtn} style={{ height: '36px', margin: 0 }}>
                      <FaUpload size={12} />
                      <span>Upload Device</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        style={{ display: 'none' }} 
                      />
                    </label>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Listing Title</label>
                  <input 
                    type="text" 
                    value={editListing.title}
                    onChange={(e) => setEditListing({ ...editListing, title: e.target.value })}
                    required
                    className={styles.formInput}
                  />
                </div>

                <div className="row g-2">
                  <div className="col-md-6 col-12">
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Price per Night (₹)</label>
                      <input 
                        type="number" 
                        value={editListing.price}
                        onChange={(e) => setEditListing({ ...editListing, price: Number(e.target.value) })}
                        required
                        className={styles.formInput}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-12">
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>City & Location</label>
                      <input 
                        type="text" 
                        value={editListing.city}
                        onChange={(e) => setEditListing({ ...editListing, city: e.target.value })}
                        required
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                </div>

                <div className="row g-2">
                  <div className="col-md-6 col-12">
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Listing Status</label>
                      <select 
                        value={editListing.status}
                        onChange={(e) => setEditListing({ ...editListing, status: e.target.value })}
                        className={styles.formInput}
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Hidden">Hidden</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6 col-12">
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Guest Favourite Badge</label>
                      <select 
                        value={editListing.isGuestFavourite ? 'yes' : 'no'}
                        onChange={(e) => setEditListing({ ...editListing, isGuestFavourite: e.target.value === 'yes' })}
                        className={styles.formInput}
                      >
                        <option value="yes">Yes (Guest Favourite)</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Featured on Homepage</label>
                  <select 
                    value={editListing.isFeatured ? 'yes' : 'no'}
                    onChange={(e) => setEditListing({ ...editListing, isFeatured: e.target.value === 'yes' })}
                    className={styles.formInput}
                  >
                    <option value="yes">Yes (Featured)</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={() => setEditListing(null)}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
