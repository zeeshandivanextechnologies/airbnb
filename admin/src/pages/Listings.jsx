import React, { useState, useEffect } from 'react';
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
  FaUpload,
  FaConciergeBell,
  FaPlus
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import styles from './styles/Listings.module.css';

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'active' | 'hidden'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'services' | 'stays' | 'experiences'
  const [tagFilter, setTagFilter] = useState('all'); // 'all' | 'guest_fav' | 'featured'

  // Modals state
  const [previewListing, setPreviewListing] = useState(null); // for viewing photos, amenities & location
  const [editListing, setEditListing] = useState(null); // for editing title, price, location, status
  const [newImageUrl, setNewImageUrl] = useState('');

  // Admin / Owner Direct Listing Creation Modal State (Full Step-by-Step Wizard)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createStep, setCreateStep] = useState(1); // 1: Type & Category, 2: Location & Address, 3: Specs/Guests, 4: Photos, 5: Description & Price

  const homeCategories = [
    'Villas', 'Beachfront', 'Cabins', 'Mansions', 'Countryside', 'Lakefront', 
    'Tiny homes', 'Icons', 'Trending', 'Castles', 'Farms', 'Tropical'
  ];

  const experienceCategoriesList = [
    'Art and design', 'Fitness and wellness', 'Food and drink', 'History and culture', 
    'Music and entertainment', 'Nature and outdoors', 'Photography', 'Sports and active'
  ];

  const serviceCategoriesList = [
    'Catering', 'Chef', 'Hairstyling', 'Make-up', 'Massage', 
    'Personal training', 'Photography', 'Prepared meals', 'Spa treatments'
  ];

  const categorySubOptionsMap = {
    // Experience sub-options
    'Art and design': ['Architecture tour', 'Art workshop', 'Gallery tour', 'Shopping & fashion experience'],
    'Fitness and wellness': ['Yoga class', 'Meditation session', 'Fitness boot camp', 'Wellness retreat'],
    'Food and drink': ['Cooking class', 'Wine tasting', 'Food tour', 'Bar crawl'],
    'History and culture': ['Historical landmark tour', 'Museum visit', 'Archaeological tour', 'Cultural lecture'],
    'Music and entertainment': ['Live concert', 'Music production', 'DJ workshop', 'Theater & performance'],
    'Nature and outdoors': ['Hiking & trekking', 'Wildlife safari', 'Stargazing', 'Kayaking & boating'],
    'Photography': ['Portrait session', 'Street photography tour', 'Landscape workshop', 'Drone photography'],
    'Sports and active': ['Surfing lesson', 'Rock climbing', 'Cycling expedition', 'Scuba diving'],
    // Service sub-options
    'Catering': ['Event catering', 'Corporate catering', 'Private party', 'Wedding catering'],
    'Chef': ['Private dinners', 'Menu planning', 'Cooking classes', 'Dietary specialty'],
    'Hairstyling': ['Haircut', 'Coloring', 'Bridal styling', 'Hair treatments'],
    'Make-up': ['Bridal makeup', 'Special effects', 'Everyday glam', 'Makeup lessons'],
    'Massage': ['Swedish massage', 'Deep tissue', 'Sports massage', 'Reflexology'],
    'Personal training': ['Strength training', 'Cardio fitness', 'Yoga instruction', 'Pilates'],
    'Prepared meals': ['Weekly meal prep', 'Dietary specific', 'Family style', 'Gourmet boxes'],
    'Spa treatments': ['Facials', 'Body scrubs', 'Aromatherapy', 'Manicure/Pedicure']
  };

  const allAmenitiesList = [
    'Wifi', 'Air conditioning', 'Kitchen', 'Free parking on premises', 
    'Swimming pool', 'Hot tub', 'Dedicated workspace', 'TV', 
    'Washing machine', 'EV charger', 'Patio or balcony', 'Smoke alarm'
  ];

  const initialNewListing = {
    type: 'Home', // 'Home' | 'Experience' | 'Service'
    title: '',
    category: 'Villas',
    sub_category: '',
    host_name: 'Airbnb Owner',
    host_phone: '+91 98765 43210',
    host_intro: 'Certified verified host on Airbnb platform offering premium guest experiences.',
    street_address: '104, Royal Palms Avenue',
    city: 'North Goa',
    state: 'Goa',
    pin: '403509',
    country: 'India',
    price: 4500,
    max_guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    years_experience: 5,
    cover_img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Free parking on premises', 'Swimming pool'],
    description: 'Exclusive Airbnb owner curated listing with luxury amenities, prime scenic location, and 24/7 dedicated support.',
    status: 'Active'
  };
  const [newListing, setNewListing] = useState(initialNewListing);
  const [photoInput, setPhotoInput] = useState('');

  const baseUrl = 'http://localhost:5000/api';

  // Fetch listings from live database
  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/listings?status=all`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        // Normalize fields from DB columns
        const normalized = data.data.map(item => ({
          id: item.id,
          title: item.title,
          type: item.type,
          category: item.category || 'General',
          host: item.host_name || 'Airbnb Host',
          hostName: item.host_name || 'Airbnb Host',
          hostAvatar: item.host_avatar || '',
          hostPhone: item.host_phone || '+91 98765 43210',
          city: item.city || 'India',
          price: Number(item.price) || 0,
          status: item.status || 'Active',
          isFeatured: !!item.is_featured,
          isGuestFavourite: !!item.is_guest_favourite,
          rating: Number(item.rating) || 4.90,
          reviewsCount: item.reviews_count || 0,
          coverImg: item.cover_img || (Array.isArray(item.photos) && item.photos[0]) || 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=400&q=80',
          photos: Array.isArray(item.photos) && item.photos.length > 0 ? item.photos : [item.cover_img || 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=400&q=80'],
          amenities: Array.isArray(item.amenities) ? item.amenities : [],
          serviceOfferings: Array.isArray(item.service_offerings) ? item.service_offerings : (typeof item.service_offerings === 'string' ? JSON.parse(item.service_offerings || '[]') : []),
          businessHours: Array.isArray(item.business_hours) ? item.business_hours : (typeof item.business_hours === 'string' ? JSON.parse(item.business_hours || '[]') : []),
          discounts: typeof item.discounts === 'object' && item.discounts !== null ? item.discounts : (typeof item.discounts === 'string' ? JSON.parse(item.discounts || '{}') : {}),
          description: item.description || '',
          cancellationPolicy: item.cancellation_policy || '1 day',
          yearsExperience: item.years_experience !== undefined ? item.years_experience : 5,
          hostIntro: item.host_intro || '',
          degree: item.degree || item.host_qualifications || '',
          careerHighlight: item.career_highlight || item.host_recognition || '',
          minAge: item.min_age !== undefined ? item.min_age : 18,
          maxGuests: item.max_guests !== undefined ? item.max_guests : 4,
          bedrooms: item.bedrooms !== undefined ? item.bedrooms : 2,
          beds: item.beds !== undefined ? item.beds : 3,
          bathrooms: item.bathrooms !== undefined ? item.bathrooms : 2,
          categorizedPhotos: Array.isArray(item.categorized_photos) ? item.categorized_photos : (typeof item.categorized_photos === 'string' ? JSON.parse(item.categorized_photos || '[]') : []),
          travelPreference: item.travel_preference || '',
          accessibilityFeatures: Array.isArray(item.accessibility_features) ? item.accessibility_features : []
        }));
        setListings(normalized);
      }
    } catch (err) {
      console.error('Failed to fetch listings in admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const serviceCategories = [
    'chef', 'hairstyling', 'make-up', 'makeup', 'massage', 
    'personal training', 'photography', 'prepared meals', 'spa treatments', 'catering', 'service'
  ];

  // Filtered Listings
  const filteredListings = listings.filter((item) => {
    const matchesSearch = 
      (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.host || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'pending' ? item.status === 'Pending' :
      activeTab === 'active' ? item.status === 'Active' :
      activeTab === 'hidden' ? item.status === 'Hidden' : true;

    const matchesTag = 
      tagFilter === 'all' ? true :
      tagFilter === 'guest_fav' ? item.isGuestFavourite :
      tagFilter === 'featured' ? item.isFeatured : true;

    const isItemExperience = (item.type || '').toLowerCase().includes('experience') ||
      experienceCategoriesList.some(ec => (item.category || '').toLowerCase().includes(ec.toLowerCase()));

    const isItemService = !isItemExperience && (
      (item.type || '').toLowerCase().includes('service') ||
      serviceCategories.some(sc => (item.category || '').toLowerCase().includes(sc.toLowerCase()))
    );

    const matchesType = 
      typeFilter === 'all' ? true :
      typeFilter === 'services' ? isItemService :
      typeFilter === 'experiences' ? isItemExperience :
      typeFilter === 'stays' ? (!isItemService && !isItemExperience) : true;

    return matchesSearch && matchesTab && matchesTag && matchesType;
  });

  // Action handlers connected to backend
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${baseUrl}/listings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Listing marked as ${newStatus}`);
        setListings(listings.map(l => l.id === id ? { ...l, status: newStatus } : l));
        if (previewListing && previewListing.id === id) {
          setPreviewListing({ ...previewListing, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Failed to update status');
    }
  };

  const handleApprove = (id) => handleUpdateStatus(id, 'Active');
  const handleReject = (id) => handleUpdateStatus(id, 'Rejected');

  const handleToggleHide = (id) => {
    const item = listings.find(l => l.id === id);
    if (!item) return;
    const nextStatus = item.status === 'Hidden' ? 'Active' : 'Hidden';
    handleUpdateStatus(id, nextStatus);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing permanently from the database?')) {
      try {
        const res = await fetch(`${baseUrl}/listings/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          toast.success('Listing permanently deleted');
          setListings(listings.filter(l => l.id !== id));
          if (previewListing && previewListing.id === id) setPreviewListing(null);
          if (editListing && editListing.id === id) setEditListing(null);
        }
      } catch (err) {
        console.error('Delete failed:', err);
        toast.error('Failed to delete listing');
      }
    }
  };

  const handleToggleFeatured = async (id) => {
    const item = listings.find(l => l.id === id);
    if (!item) return;
    const nextVal = !item.isFeatured;
    // Optimistic UI update
    setListings(listings.map(l => l.id === id ? { ...l, isFeatured: nextVal } : l));
    if (previewListing && previewListing.id === id) {
      setPreviewListing({ ...previewListing, isFeatured: nextVal });
    }
    try {
      const res = await fetch(`${baseUrl}/listings/${id}/badges`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_featured: nextVal })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(nextVal ? 'Marked as Featured' : 'Removed from Featured');
      } else {
        // revert on failure
        setListings(listings.map(l => l.id === id ? { ...l, isFeatured: item.isFeatured } : l));
        toast.error('Failed to update badge');
      }
    } catch (err) {
      console.error('Badge update error:', err);
      setListings(listings.map(l => l.id === id ? { ...l, isFeatured: item.isFeatured } : l));
      toast.error('Failed to update badge');
    }
  };

  const handleToggleGuestFavourite = async (id) => {
    const item = listings.find(l => l.id === id);
    if (!item) return;
    const nextVal = !item.isGuestFavourite;
    // Optimistic UI update
    setListings(listings.map(l => l.id === id ? { ...l, isGuestFavourite: nextVal } : l));
    if (previewListing && previewListing.id === id) {
      setPreviewListing({ ...previewListing, isGuestFavourite: nextVal });
    }
    try {
      const res = await fetch(`${baseUrl}/listings/${id}/badges`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_guest_favourite: nextVal })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(nextVal ? 'Marked as Guest Favourite' : 'Removed Guest Favourite');
      } else {
        // revert on failure
        setListings(listings.map(l => l.id === id ? { ...l, isGuestFavourite: item.isGuestFavourite } : l));
        toast.error('Failed to update badge');
      }
    } catch (err) {
      console.error('Badge update error:', err);
      setListings(listings.map(l => l.id === id ? { ...l, isGuestFavourite: item.isGuestFavourite } : l));
      toast.error('Failed to update badge');
    }
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

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/listings/${editListing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editListing.title,
          type: editListing.type || 'Home',
          category: editListing.category,
          price: editListing.price,
          city: editListing.city,
          status: editListing.status,
          cover_img: editListing.coverImg,
          photos: editListing.photos,
          description: editListing.description,
          host_name: editListing.hostName || editListing.host,
          host_avatar: editListing.hostAvatar,
          host_intro: editListing.hostIntro,
          is_guest_favourite: editListing.isGuestFavourite,
          is_featured: editListing.isFeatured,
          cancellation_policy: editListing.cancellationPolicy,
          years_experience: editListing.yearsExperience,
          degree: editListing.degree,
          career_highlight: editListing.careerHighlight,
          min_age: editListing.minAge,
          max_guests: editListing.maxGuests,
          bedrooms: editListing.bedrooms,
          beds: editListing.beds,
          bathrooms: editListing.bathrooms,
          categorized_photos: editListing.categorizedPhotos,
          travel_preference: editListing.travelPreference,
          service_offerings: editListing.serviceOfferings,
          business_hours: editListing.businessHours
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Listing details updated successfully');
        setListings(listings.map(l => l.id === editListing.id ? editListing : l));
        setEditListing(null);
      }
    } catch (err) {
      console.error('Failed to update listing:', err);
      toast.error('Failed to update listing');
    }
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    if (!newListing.title.trim()) {
      toast.error('Please enter a listing title');
      return;
    }
    try {
      setCreating(true);
      const res = await fetch(`${baseUrl}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newListing.title,
          type: newListing.type,
          category: newListing.category,
          host_name: newListing.host_name,
          host_phone: newListing.host_phone,
          city: newListing.city,
          price: Number(newListing.price) || 0,
          max_guests: Number(newListing.max_guests) || 1,
          bedrooms: Number(newListing.bedrooms) || 1,
          beds: Number(newListing.beds) || 1,
          bathrooms: Number(newListing.bathrooms) || 1,
          years_experience: Number(newListing.years_experience) || 1,
          cover_img: newListing.cover_img,
          photos: newListing.photos,
          amenities: newListing.amenities,
          description: newListing.description,
          status: 'Active'
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Owner ${newListing.type} listing published successfully!`);
        setShowCreateModal(false);
        setNewListing(initialNewListing);
        fetchListings();
      } else {
        toast.error(data.message || 'Failed to create listing');
      }
    } catch (err) {
      console.error('Create listing failed:', err);
      toast.error('Network error creating listing');
    } finally {
      setCreating(false);
    }
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
              <span className={styles.statSubtext}>Across all services & stays</span>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Services & Experiences</span>
                <div className={styles.statIconBox} style={{ background: '#f0fdf4', color: '#16a34a' }}>
                  <FaConciergeBell />
                </div>
              </div>
              <div className={styles.statValue}>
                {listings.filter(l => (l.type || '').toLowerCase().includes('service') || serviceCategories.some(sc => (l.category || '').toLowerCase().includes(sc))).length}
              </div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
                Services
              </span>
              <span className={styles.statSubtext}>Chefs, Massage, Tours</span>
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
      </div>

      {/* 2. Main Listings Directory Card */}
      <div className={styles.mainCard}>
        <div className={styles.cardHeader}>
          <div className={styles.headerTitles}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 className={styles.title}>Listings & Services Management</h2>
                <p className={styles.subtitle}>
                  Manage and review Airbnb properties, home stays, and dynamic host services from live database.
                </p>
              </div>
              <button 
                type="button" 
                className={styles.btnPrimary}
                onClick={() => setShowCreateModal(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '13.5px', borderRadius: '8px' }}
              >
                <FaPlus size={12} /> + Create Listing
              </button>
            </div>
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
              placeholder="Search by title, category, location or host..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Type: All Listings</option>
              <option value="experiences">Experiences Only</option>
              <option value="services">Services Only</option>
              <option value="stays">Properties / Stays Only</option>
            </select>

            <select 
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Badge: All Badges</option>
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
                <th>Listing / Service</th>
                <th>Host</th>
                <th>Price</th>
                <th>Location</th>
                <th>Badges</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                    <div className="spinner-border spinner-border-sm text-danger me-2" role="status"></div>
                    Loading listings from database...
                  </td>
                </tr>
              ) : filteredListings.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#9ca3af' }}>
                    No listings found matching the selected search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredListings.map((item, idx) => {
                  const isExperienceItem = (item.type || '').toLowerCase().includes('experience') ||
                    experienceCategoriesList.some(ec => (item.category || '').toLowerCase().includes(ec.toLowerCase()));
                  const isServiceItem = !isExperienceItem && (
                    (item.type || '').toLowerCase().includes('service') ||
                    serviceCategories.some(sc => (item.category || '').toLowerCase().includes(sc.toLowerCase()))
                  );

                  return (
                    <tr key={item.id}>
                      <td><span style={{ fontWeight: '600', color: '#64748b' }}>{idx + 1}</span></td>
                      {/* Property Thumbnail & Title */}
                      <td>
                        <div className={styles.propertyCell}>
                          <div className={styles.propertyImageWrapper} onClick={() => setPreviewListing(item)} style={{ cursor: 'pointer' }} title="Click to view details">
                            <img src={item.coverImg} alt={item.title} className={styles.propertyThumbImg} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=400&q=80'; }} />
                          </div>
                          <div className={styles.propertyInfo}>
                            <span className={styles.propertyTitle}>
                              {item.title}
                            </span>
                            <span className={styles.propertySub}>
                              <span style={{
                                backgroundColor: isExperienceItem ? '#fef3c7' : isServiceItem ? '#eff6ff' : '#f3f4f6',
                                color: isExperienceItem ? '#b45309' : isServiceItem ? '#2563eb' : '#4b5563',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: '700',
                                marginRight: '6px'
                              }}>
                                {isExperienceItem ? 'EXPERIENCE' : isServiceItem ? 'SERVICE' : 'STAY'}
                              </span>
                              {item.category ? `${item.category} · ` : ''}{item.type}
                            </span>
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
                          ₹{Number(item.price).toLocaleString()}
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
                                title="Approve Listing"
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
                            title="View Photos, Offerings & Details"
                          >
                            <FaImages /> Preview
                          </button>

                          {/* Edit Listing */}
                          <button 
                            type="button" 
                            className={styles.btnAction}
                            onClick={() => setEditListing({ ...item })}
                            title="Edit Listing Details & Price"
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Preview Modal Dialog (Photos, Offerings, Business Hours, Location) */}
      {previewListing && (
        <div className={styles.modalBackdrop} onClick={() => setPreviewListing(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>{previewListing.title}</h3>
                <span style={{ fontSize: '12px', color: '#717171' }}>
                  {previewListing.category} ({previewListing.type}) · Hosted by {previewListing.host}
                </span>
              </div>
              <button type="button" className={styles.modalCloseBtn} onClick={() => setPreviewListing(null)}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Photo Gallery Grid */}
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#111111', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <FaCamera color="#ff385c" /> Verified Photos ({previewListing.photos.length}):
              </span>
              <div className={styles.photoGalleryGrid}>
                {previewListing.photos.map((url, idx) => (
                  <img key={idx} src={url} alt={`Photo ${idx + 1}`} className={styles.galleryThumb} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=400&q=80'; }} />
                ))}
              </div>

              {/* Price & Location details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '18px' }}>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Base Rate</span>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: '#111111' }}>
                    ₹{Number(previewListing.price).toLocaleString()}
                  </span>
                </div>

                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Verified Location</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#111111', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FaMapMarkerAlt color="#ff385c" /> {previewListing.city}
                  </span>
                </div>
              </div>

              {/* Service Offerings (If Service) */}
              {previewListing.serviceOfferings && previewListing.serviceOfferings.length > 0 && (
                <div style={{ marginBottom: '18px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#111111', display: 'block', marginBottom: '8px' }}>
                    Service Offerings ({previewListing.serviceOfferings.length}):
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {previewListing.serviceOfferings.map((off, oIdx) => (
                      <div key={oIdx} style={{ padding: '10px 14px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '14px' }}>
                          <span>{off.name || `Offering ${oIdx + 1}`}</span>
                          <span style={{ color: '#16a34a' }}>₹{Number(off.price || 0).toLocaleString()}</span>
                        </div>
                        {off.description && <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>{off.description}</p>}
                        <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: '600' }}>
                          {off.duration || '60 mins'} · Max {off.guests || 1} guests
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Business Hours */}
              {previewListing.businessHours && previewListing.businessHours.length > 0 && (
                <div style={{ marginBottom: '18px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#111111', display: 'block', marginBottom: '6px' }}>
                    Available Hours:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                    {previewListing.businessHours.map((bh, bhIdx) => (
                      <div key={bhIdx} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f3f4f6' }}>
                        <span style={{ fontWeight: '600' }}>{Array.isArray(bh.days) ? bh.days.join(', ') : bh.days}</span>
                        <span style={{ color: '#6b7280' }}>{bh.from} – {bh.to}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities / Included List */}
              {previewListing.amenities && previewListing.amenities.length > 0 && (
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#111111', display: 'block', marginBottom: '6px' }}>
                    Included Features / Amenities:
                  </span>
                  <div className={styles.amenitiesList}>
                    {previewListing.amenities.map((am, i) => (
                      <span key={i} className={styles.amenityPill}>
                        <FaCheck size={10} color="#16a34a" /> {am}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
                <h3 className={styles.modalTitle}>Edit Listing Details</h3>
                <button type="button" className={styles.modalCloseBtn} onClick={() => setEditListing(null)}>
                  <FaTimes />
                </button>
              </div>

              <div className={styles.modalBody}>
                {/* 1. Property Images Manager */}
                <div className={styles.imageManagerSection}>
                  <div className={styles.imageSectionTitle}>
                    <span>Photos ({editListing.photos ? editListing.photos.length : 0})</span>
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
                      <label className={styles.formLabel}>Rate / Price (₹)</label>
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
                  <div className="col-md-6 col-12">
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Listing Type</label>
                      <select 
                        value={editListing.type || 'Home'}
                        onChange={(e) => setEditListing({ ...editListing, type: e.target.value })}
                        className={styles.formInput}
                      >
                        <option value="Home">Home / Stay</option>
                        <option value="Experience">Experience</option>
                        <option value="Service">Service</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row g-2">
                  <div className="col-md-6 col-12">
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Category</label>
                      <input 
                        type="text" 
                        value={editListing.category || ''}
                        onChange={(e) => setEditListing({ ...editListing, category: e.target.value })}
                        placeholder="e.g. Photography, Chef, Hairstyling"
                        className={styles.formInput}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-12">
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Cancellation Policy</label>
                      <select 
                        value={editListing.cancellationPolicy || '1 day'}
                        onChange={(e) => setEditListing({ ...editListing, cancellationPolicy: e.target.value })}
                        className={styles.formInput}
                      >
                        <option value="1 day">1 day prior (Full refund)</option>
                        <option value="2 days">2 days prior (Full refund)</option>
                        <option value="7 days">7 days prior (Full refund)</option>
                        <option value="Flexible">Flexible</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Strict">Strict</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row g-2">
                  <div className="col-md-6 col-12">
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Host Name</label>
                      <input 
                        type="text" 
                        value={editListing.hostName || editListing.host || ''}
                        onChange={(e) => setEditListing({ ...editListing, hostName: e.target.value, host: e.target.value })}
                        placeholder="e.g. Prateek Sharma"
                        className={styles.formInput}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-12">
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Host Avatar Photo URL</label>
                      <input 
                        type="url" 
                        value={editListing.hostAvatar || ''}
                        onChange={(e) => setEditListing({ ...editListing, hostAvatar: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-..."
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                </div>

                <div className="row g-2">
                  <div className="col-md-6 col-12">
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Travel Preference / Service Provision</label>
                      <input 
                        type="text" 
                        value={editListing.travelPreference || ''}
                        onChange={(e) => setEditListing({ ...editListing, travelPreference: e.target.value })}
                        placeholder="e.g. You travel to guests / Provided on location"
                        className={styles.formInput}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-12">
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Host Short Intro / Subtitle</label>
                      <input 
                        type="text" 
                        value={editListing.hostIntro || ''}
                        onChange={(e) => setEditListing({ ...editListing, hostIntro: e.target.value })}
                        placeholder="e.g. Professional photographer with 8+ years experience"
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Description / Full Overview</label>
                  <textarea 
                    rows={3}
                    value={editListing.description || ''}
                    onChange={(e) => setEditListing({ ...editListing, description: e.target.value })}
                    placeholder="Enter detailed description of the service or stay..."
                    className={styles.formInput}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div className="row g-2">
                  <div className="col-md-4 col-12">
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Years Experience</label>
                      <input 
                        type="number" 
                        value={editListing.yearsExperience || 0}
                        onChange={(e) => setEditListing({ ...editListing, yearsExperience: Number(e.target.value) })}
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-12">
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Max Guests</label>
                      <input 
                        type="number" 
                        value={editListing.maxGuests || 4}
                        onChange={(e) => setEditListing({ ...editListing, maxGuests: Number(e.target.value) })}
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-12">
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Min Age</label>
                      <input 
                        type="number" 
                        value={editListing.minAge || 18}
                        onChange={(e) => setEditListing({ ...editListing, minAge: Number(e.target.value) })}
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                </div>

                {/* Stays Specific Details (Bedrooms, Beds, Bathrooms) */}
                <div className="row g-2">
                  <div className="col-md-4 col-12">
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Bedrooms</label>
                      <input 
                        type="number" 
                        min="1"
                        value={editListing.bedrooms !== undefined ? editListing.bedrooms : 2}
                        onChange={(e) => setEditListing({ ...editListing, bedrooms: Number(e.target.value) })}
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-12">
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Beds</label>
                      <input 
                        type="number" 
                        min="1"
                        value={editListing.beds !== undefined ? editListing.beds : 3}
                        onChange={(e) => setEditListing({ ...editListing, beds: Number(e.target.value) })}
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-12">
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Bathrooms</label>
                      <input 
                        type="number" 
                        min="1"
                        value={editListing.bathrooms !== undefined ? editListing.bathrooms : 2}
                        onChange={(e) => setEditListing({ ...editListing, bathrooms: Number(e.target.value) })}
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                </div>

                <div className="row g-2">
                  <div className="col-md-6 col-12">
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Career Highlight / Recognition</label>
                      <input 
                        type="text" 
                        value={editListing.careerHighlight || ''}
                        onChange={(e) => setEditListing({ ...editListing, careerHighlight: e.target.value })}
                        placeholder="e.g. Featured in Vogue, Award winner"
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Education / Degree</label>
                      <input 
                        type="text" 
                        value={editListing.degree || ''}
                        onChange={(e) => setEditListing({ ...editListing, degree: e.target.value })}
                        placeholder="e.g. BA Film Making, Certified Specialist"
                        className={styles.formInput}
                      />
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

      {/* 3. OWNER / ADMIN DIRECT CREATE LISTING MODAL (Full Step-by-Step Wizard Matching Frontend) */}
      {showCreateModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '840px', width: '92%' }}>
            {/* Modal Header with Step Indicator */}
            <div className={styles.modalHeader} style={{ flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 className={styles.modalTitle}>+ Airbnb Owner / Admin Listing Creator</h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Publish Homes, Experiences, or Services directly to the live Airbnb marketplace.
                  </span>
                </div>
                <button type="button" className={styles.modalCloseBtn} onClick={() => setShowCreateModal(false)}>
                  <FaTimes />
                </button>
              </div>

              {/* Step Navigation Tabs Bar */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', overflowX: 'auto' }}>
                {[
                  { step: 1, label: '1. Classification & Category' },
                  { step: 2, label: '2. Location & Address' },
                  { step: 3, label: '3. Capacity & Amenities' },
                  { step: 4, label: '4. Photos & Cover' },
                  { step: 5, label: '5. Pricing & Publish' }
                ].map((s) => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setCreateStep(s.step)}
                    style={{
                      background: createStep === s.step ? '#ff385c' : '#f1f5f9',
                      color: createStep === s.step ? '#ffffff' : '#475569',
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateListing}>
              <div className={styles.modalBody} style={{ minHeight: '380px' }}>
                
                {/* ================= STEP 1: TYPE & CATEGORY ================= */}
                {createStep === 1 && (
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '14px', color: '#0f172a' }}>
                      Step 1: Choose What You Want to Host
                    </h4>

                    {/* 3 Large Selectable Cards for Home, Experience, Service */}
                    <div className="row g-3 mb-4">
                      {[
                        { 
                          type: 'Home', 
                          title: 'Home / Villa / Stay', 
                          desc: 'Guests book entire place, private room, or villa with bedrooms & bathrooms.',
                          icon: <FaHome size={22} />
                        },
                        { 
                          type: 'Experience', 
                          title: 'Experience', 
                          desc: 'Curated activities, workshops, city walking tours, cooking classes.',
                          icon: <FaStar size={22} />
                        },
                        { 
                          type: 'Service', 
                          title: 'Service', 
                          desc: 'In-person or on-demand services: Chef, Catering, Makeup, Massage, etc.',
                          icon: <FaConciergeBell size={22} />
                        }
                      ].map(card => (
                        <div key={card.type} className="col-12 col-md-4">
                          <div 
                            onClick={() => {
                              let defaultCat = 'Villas';
                              if (card.type === 'Experience') defaultCat = 'Cooking class';
                              if (card.type === 'Service') defaultCat = 'Chef';
                              setNewListing({ ...newListing, type: card.type, category: defaultCat });
                            }}
                            style={{
                              border: newListing.type === card.type ? '2px solid #ff385c' : '1px solid #cbd5e1',
                              background: newListing.type === card.type ? '#fff1f2' : '#ffffff',
                              borderRadius: '12px',
                              padding: '16px',
                              cursor: 'pointer',
                              height: '100%',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{ color: newListing.type === card.type ? '#ff385c' : '#64748b', marginBottom: '8px' }}>
                              {card.icon}
                            </div>
                            <div style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>{card.title}</div>
                            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px', lineHeight: '1.4' }}>{card.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Category Selection Dropdown & Pills */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Select {newListing.type} Category *
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                        {(newListing.type === 'Home' 
                          ? homeCategories 
                          : newListing.type === 'Experience' 
                          ? experienceCategoriesList 
                          : serviceCategoriesList
                        ).map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setNewListing({ ...newListing, category: cat })}
                            style={{
                              background: newListing.category === cat ? '#111827' : '#f8fafc',
                              color: newListing.category === cat ? '#ffffff' : '#334155',
                              border: '1px solid #cbd5e1',
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      <input 
                        type="text"
                        value={newListing.category}
                        onChange={(e) => setNewListing({ ...newListing, category: e.target.value })}
                        placeholder="Or type a custom category name..."
                        className={styles.formInput}
                      />
                    </div>

                    {/* Sub-Options (Exact same as HostSetup.jsx Step 1 & 2) */}
                    {categorySubOptionsMap[newListing.category] && (
                      <div className={styles.formGroup} style={{ marginTop: '14px', background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                        <label className={styles.formLabel} style={{ color: '#0f172a' }}>
                          Specialty / Sub-Category (Optional):
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {categorySubOptionsMap[newListing.category].map(sub => {
                            const isSelected = newListing.sub_category === sub;
                            return (
                              <button
                                key={sub}
                                type="button"
                                onClick={() => setNewListing({ ...newListing, sub_category: isSelected ? '' : sub })}
                                style={{
                                  background: isSelected ? '#ff385c' : '#ffffff',
                                  color: isSelected ? '#ffffff' : '#334155',
                                  border: isSelected ? '1px solid #ff385c' : '1px solid #cbd5e1',
                                  padding: '5px 12px',
                                  borderRadius: '16px',
                                  fontSize: '11.5px',
                                  fontWeight: '500',
                                  cursor: 'pointer'
                                }}
                              >
                                {isSelected ? '✓ ' : '+ '}{sub}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ================= STEP 2: LOCATION & ADDRESS ================= */}
                {createStep === 2 && (
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '14px', color: '#0f172a' }}>
                      Step 2: Location & Address
                    </h4>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>City / Destination *</label>
                          <input 
                            type="text"
                            value={newListing.city}
                            onChange={(e) => setNewListing({ ...newListing, city: e.target.value })}
                            placeholder="e.g. North Goa, Udaipur, Jaipur"
                            className={styles.formInput}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>State / Region</label>
                          <input 
                            type="text"
                            value={newListing.state}
                            onChange={(e) => setNewListing({ ...newListing, state: e.target.value })}
                            placeholder="e.g. Goa, Rajasthan, Himachal Pradesh"
                            className={styles.formInput}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Street Address / Landmark</label>
                      <input 
                        type="text"
                        value={newListing.street_address}
                        onChange={(e) => setNewListing({ ...newListing, street_address: e.target.value })}
                        placeholder="e.g. Villa 14, Candolim Beach Road"
                        className={styles.formInput}
                      />
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>PIN / Postal Code</label>
                          <input 
                            type="text"
                            value={newListing.pin}
                            onChange={(e) => setNewListing({ ...newListing, pin: e.target.value })}
                            placeholder="e.g. 403515"
                            className={styles.formInput}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Country</label>
                          <input 
                            type="text"
                            value={newListing.country}
                            onChange={(e) => setNewListing({ ...newListing, country: e.target.value })}
                            className={styles.formInput}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= STEP 3: SPECS & AMENITIES ================= */}
                {createStep === 3 && (
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '14px', color: '#0f172a' }}>
                      Step 3: {newListing.type === 'Home' ? 'Property Capacity & Amenities' : 'Service Capacity & Highlights'}
                    </h4>

                    {newListing.type === 'Home' ? (
                      <div className="row mb-3">
                        <div className="col-6 col-md-3">
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Max Guests</label>
                            <input 
                              type="number"
                              min="1"
                              value={newListing.max_guests}
                              onChange={(e) => setNewListing({ ...newListing, max_guests: e.target.value })}
                              className={styles.formInput}
                            />
                          </div>
                        </div>
                        <div className="col-6 col-md-3">
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Bedrooms</label>
                            <input 
                              type="number"
                              min="1"
                              value={newListing.bedrooms}
                              onChange={(e) => setNewListing({ ...newListing, bedrooms: e.target.value })}
                              className={styles.formInput}
                            />
                          </div>
                        </div>
                        <div className="col-6 col-md-3">
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Beds</label>
                            <input 
                              type="number"
                              min="1"
                              value={newListing.beds}
                              onChange={(e) => setNewListing({ ...newListing, beds: e.target.value })}
                              className={styles.formInput}
                            />
                          </div>
                        </div>
                        <div className="col-6 col-md-3">
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Bathrooms</label>
                            <input 
                              type="number"
                              min="1"
                              value={newListing.bathrooms}
                              onChange={(e) => setNewListing({ ...newListing, bathrooms: e.target.value })}
                              className={styles.formInput}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Max Group / Booking Capacity</label>
                            <input 
                              type="number"
                              min="1"
                              value={newListing.max_guests}
                              onChange={(e) => setNewListing({ ...newListing, max_guests: e.target.value })}
                              className={styles.formInput}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Years of Professional Experience</label>
                            <input 
                              type="number"
                              min="0"
                              value={newListing.years_experience}
                              onChange={(e) => setNewListing({ ...newListing, years_experience: e.target.value })}
                              className={styles.formInput}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Amenities Checkbox Pills */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Select Amenities & Features Included</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {allAmenitiesList.map(item => {
                          const isSelected = newListing.amenities.includes(item);
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => {
                                const next = isSelected 
                                  ? newListing.amenities.filter(a => a !== item)
                                  : [...newListing.amenities, item];
                                setNewListing({ ...newListing, amenities: next });
                              }}
                              style={{
                                background: isSelected ? '#10b981' : '#f8fafc',
                                color: isSelected ? '#ffffff' : '#334155',
                                border: '1px solid #cbd5e1',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              {isSelected ? <FaCheck size={10} /> : <FaPlus size={10} />}
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= STEP 4: PHOTOS & COVER ================= */}
                {createStep === 4 && (
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '14px', color: '#0f172a' }}>
                      Step 4: Photos & Gallery
                    </h4>

                    {/* Cover Image */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Main Cover Photo URL *</label>
                      <input 
                        type="url"
                        value={newListing.cover_img}
                        onChange={(e) => {
                          const url = e.target.value;
                          setNewListing({ 
                            ...newListing, 
                            cover_img: url,
                            photos: [url, ...(newListing.photos.slice(1))]
                          });
                        }}
                        placeholder="https://images.unsplash.com/..."
                        className={styles.formInput}
                        required
                      />
                    </div>

                    {/* Add Gallery Photos */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Add Photo to Gallery</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input 
                          type="url"
                          value={photoInput}
                          onChange={(e) => setPhotoInput(e.target.value)}
                          placeholder="Paste image URL here..."
                          className={styles.formInput}
                          style={{ flex: 1 }}
                        />
                        <button 
                          type="button"
                          className={styles.btnSecondary}
                          onClick={() => {
                            if (photoInput.trim()) {
                              setNewListing({
                                ...newListing,
                                photos: [...newListing.photos, photoInput.trim()]
                              });
                              setPhotoInput('');
                            }
                          }}
                        >
                          <FaUpload size={12} style={{ marginRight: '6px' }} /> Add Photo
                        </button>
                      </div>
                    </div>

                    {/* Photo Thumbnails Preview */}
                    <div style={{ marginTop: '14px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                        Current Gallery Photos ({newListing.photos.length}):
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                        {newListing.photos.map((img, i) => (
                          <div key={i} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '95px', border: '1px solid #cbd5e1' }}>
                            <img src={img} alt={`Preview ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            {i === 0 && (
                              <span style={{ position: 'absolute', top: '4px', left: '4px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>
                                Cover
                              </span>
                            )}
                            {i > 0 && (
                              <button
                                type="button"
                                onClick={() => setNewListing({ ...newListing, photos: newListing.photos.filter((_, idx) => idx !== i) })}
                                style={{ position: 'absolute', top: '4px', right: '4px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <FaTimes size={10} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= STEP 5: PRICING & PUBLISH ================= */}
                {createStep === 5 && (
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '14px', color: '#0f172a' }}>
                      Step 5: Title, Pricing & Final Review
                    </h4>

                    {/* Title */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Listing Headline Title *</label>
                      <input 
                        type="text"
                        value={newListing.title}
                        onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                        placeholder={newListing.type === 'Home' ? 'e.g. Royal Palm Luxury Villa with Private Pool' : newListing.type === 'Experience' ? 'e.g. Old City Street Food & Culture Walk' : 'e.g. Private Five-Star Chef for Dinners'}
                        className={styles.formInput}
                        required
                      />
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Nightly / Hourly Tariff (₹) *</label>
                          <input 
                            type="number"
                            min="100"
                            value={newListing.price}
                            onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                            className={styles.formInput}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Host / Owner Name *</label>
                          <input 
                            type="text"
                            value={newListing.host_name}
                            onChange={(e) => setNewListing({ ...newListing, host_name: e.target.value })}
                            className={styles.formInput}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Detailed Description</label>
                      <textarea 
                        rows="3"
                        value={newListing.description}
                        onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                        className={styles.formInput}
                        style={{ height: 'auto', padding: '10px 12px' }}
                      />
                    </div>

                    {/* Host Bio */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Host Introduction</label>
                      <input 
                        type="text"
                        value={newListing.host_intro}
                        onChange={(e) => setNewListing({ ...newListing, host_intro: e.target.value })}
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Wizard Footer with Previous / Next / Publish Buttons */}
              <div className={styles.modalFooter} style={{ justifyContent: 'space-between' }}>
                <div>
                  {createStep > 1 && (
                    <button 
                      type="button" 
                      className={styles.btnSecondary}
                      onClick={() => setCreateStep(createStep - 1)}
                    >
                      ← Back
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" className={styles.btnSecondary} onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>

                  {createStep < 5 ? (
                    <button 
                      type="button" 
                      className={styles.btnPrimary}
                      onClick={() => setCreateStep(createStep + 1)}
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button type="submit" className={styles.btnPrimary} disabled={creating}>
                      {creating ? 'Publishing...' : `🚀 Publish ${newListing.type} Listing`}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
