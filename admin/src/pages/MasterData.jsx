import React, { useState } from 'react';
import { 
  FaHome, 
  FaSwimmingPool, 
  FaGlobeAmericas, 
  FaThLarge, 
  FaPlus, 
  FaEdit, 
  FaTrashAlt, 
  FaSearch, 
  FaCheck, 
  FaTimes, 
  FaWifi, 
  FaParking, 
  FaTv, 
  FaSnowflake, 
  FaUtensils, 
  FaBuilding, 
  FaCampground, 
  FaTree,
  FaMapMarkerAlt,
  FaImages,
  FaArrowUp,
  FaLayerGroup
} from 'react-icons/fa';
import styles from './styles/MasterData.module.css';

export default function MasterData() {
  const [activeTab, setActiveTab] = useState('propertyTypes'); // 'propertyTypes' | 'amenities' | 'locations' | 'categories'

  // 1. Property Types (Home, Flat, Cabin, Villa...)
  const [propertyTypes, setPropertyTypes] = useState([
    { id: 1, name: 'Entire Villa', slug: 'villa', description: 'Luxury private villas with independent amenities', count: 480, status: 'Active' },
    { id: 2, name: 'Apartment / Flat', slug: 'apartment', description: 'Modern residential urban apartments & studios', count: 1240, status: 'Active' },
    { id: 3, name: 'Wooden Cabin & Chalet', slug: 'cabin', description: 'Rustic wooden cabins in hills and forests', count: 310, status: 'Active' },
    { id: 4, name: 'Independent House / Home', slug: 'home', description: 'Standalone residential homes with yard', count: 890, status: 'Active' },
    { id: 5, name: 'Heritage Haveli / Homestay', slug: 'heritage', description: 'Traditional palaces, havelis & cultural stays', count: 220, status: 'Active' }
  ]);

  // 2. Amenities (WiFi, Pool, Parking...)
  const [amenities, setAmenities] = useState([
    { id: 1, name: 'Private Swimming Pool', category: 'Outdoor & Luxury', icon: 'pool', isHighlight: true, status: 'Active' },
    { id: 2, name: 'High-Speed WiFi (100+ Mbps)', category: 'Essentials', icon: 'wifi', isHighlight: true, status: 'Active' },
    { id: 3, name: 'Free Secure Parking', category: 'Facilities', icon: 'parking', isHighlight: true, status: 'Active' },
    { id: 4, name: 'Fully Equipped Kitchen', category: 'Dining', icon: 'kitchen', isHighlight: false, status: 'Active' },
    { id: 5, name: 'Air Conditioning (AC)', category: 'Climate', icon: 'ac', isHighlight: true, status: 'Active' },
    { id: 6, name: '55" Smart TV with Netflix', category: 'Entertainment', icon: 'tv', isHighlight: false, status: 'Active' },
    { id: 7, name: 'Dedicated Workspace', category: 'Work', icon: 'desk', isHighlight: false, status: 'Active' }
  ]);

  // 3. Locations (Countries, States & Cities)
  const [locations, setLocations] = useState([
    { id: 1, country: 'India', state: 'Rajasthan', city: 'Jaipur', tier: 'Top Destination', activeListings: 640, status: 'Active' },
    { id: 2, country: 'India', state: 'Rajasthan', city: 'Udaipur', tier: 'Top Destination', activeListings: 420, status: 'Active' },
    { id: 3, country: 'India', state: 'Goa', city: 'North Goa', tier: 'Top Destination', activeListings: 1180, status: 'Active' },
    { id: 4, country: 'India', state: 'Himachal Pradesh', city: 'Manali', tier: 'Hill Station', activeListings: 350, status: 'Active' },
    { id: 5, country: 'India', state: 'Kerala', city: 'Alleppey (Alappuzha)', tier: 'Backwaters', activeListings: 290, status: 'Active' },
    { id: 6, country: 'India', state: 'Maharashtra', city: 'Mumbai', tier: 'Metro', activeListings: 920, status: 'Active' }
  ]);

  // 4. Categories & Homepage Sections / Banners
  const [categories, setCategories] = useState([
    { id: 1, title: 'Icons & Celebrity Stays', sectionKey: 'hero_icons', badge: 'New 2026', displayOrder: 1, bannerText: 'Extraordinary experiences hosted by legends', status: 'Active' },
    { id: 2, title: 'Amazing Views & Lakefront', sectionKey: 'lakefront', badge: 'Trending', displayOrder: 2, bannerText: 'Wake up to breathtaking water & hilltop vistas', status: 'Active' },
    { id: 3, title: 'Beachfront Cottages', sectionKey: 'beachfront', badge: 'Popular', displayOrder: 3, bannerText: 'Step directly onto warm golden sands', status: 'Active' },
    { id: 4, title: 'Heritage & Castles', sectionKey: 'historical_homes', badge: 'Cultural', displayOrder: 4, bannerText: 'Live like royalty in restored forts & havelis', status: 'Active' },
    { id: 5, title: 'Cabins in the Woods', sectionKey: 'cabins', badge: 'Peaceful', displayOrder: 5, bannerText: 'Disconnect in secluded nature retreats', status: 'Active' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [modalType, setModalType] = useState(null); // 'propertyType' | 'amenity' | 'location' | 'category'
  const [editingItem, setEditingItem] = useState(null);

  // Handlers for deleting
  const handleDeleteItem = (id, type) => {
    if (window.confirm('Delete this master data entry permanently?')) {
      if (type === 'propertyTypes') setPropertyTypes(propertyTypes.filter(p => p.id !== id));
      if (type === 'amenities') setAmenities(amenities.filter(a => a.id !== id));
      if (type === 'locations') setLocations(locations.filter(l => l.id !== id));
      if (type === 'categories') setCategories(categories.filter(c => c.id !== id));
    }
  };

  // Handlers for saving Add/Edit
  const handleSaveModal = (e) => {
    e.preventDefault();
    if (modalType === 'propertyType') {
      if (editingItem.id) {
        setPropertyTypes(propertyTypes.map(p => p.id === editingItem.id ? editingItem : p));
      } else {
        setPropertyTypes([...propertyTypes, { ...editingItem, id: Date.now(), count: 0 }]);
      }
    } else if (modalType === 'amenity') {
      if (editingItem.id) {
        setAmenities(amenities.map(a => a.id === editingItem.id ? editingItem : a));
      } else {
        setAmenities([...amenities, { ...editingItem, id: Date.now() }]);
      }
    } else if (modalType === 'location') {
      if (editingItem.id) {
        setLocations(locations.map(l => l.id === editingItem.id ? editingItem : l));
      } else {
        setLocations([...locations, { ...editingItem, id: Date.now(), activeListings: 0 }]);
      }
    } else if (modalType === 'category') {
      if (editingItem.id) {
        setCategories(categories.map(c => c.id === editingItem.id ? editingItem : c));
      } else {
        setCategories([...categories, { ...editingItem, id: Date.now() }]);
      }
    }
    setModalType(null);
    setEditingItem(null);
  };

  return (
    <>
      {/* 1. Stat Summary Cards */}
      <div className="row mb-3">
        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Property Types</span>
                <div className={styles.statIconBox} style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <FaHome />
                </div>
              </div>
              <div className={styles.statValue}>{propertyTypes.length}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
                <FaArrowUp size={9} /> Configured
              </span>
              <span className={styles.statSubtext}>Villas, Flats, Cabins...</span>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Amenities Master</span>
                <div className={styles.statIconBox} style={{ background: '#f0fdf4', color: '#16a34a' }}>
                  <FaSwimmingPool />
                </div>
              </div>
              <div className={styles.statValue}>{amenities.length}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
                Global Tags
              </span>
              <span className={styles.statSubtext}>Pool, WiFi, AC, Kitchen</span>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Supported Cities</span>
                <div className={styles.statIconBox} style={{ background: '#fff1f2', color: '#ff385c' }}>
                  <FaGlobeAmericas />
                </div>
              </div>
              <div className={styles.statValue}>{locations.length}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgePink}`}>
                Regions
              </span>
              <span className={styles.statSubtext}>States & Cities in India</span>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Home Sections</span>
                <div className={styles.statIconBox} style={{ background: '#fefce8', color: '#ca8a04' }}>
                  <FaLayerGroup />
                </div>
              </div>
              <div className={styles.statValue}>{categories.length}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeWarning}`}>
                Banners Live
              </span>
              <span className={styles.statSubtext}>Homepage curation</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Panel Card */}
      <div className={styles.mainCard}>
        <div className={styles.cardHeader}>
          <div className={styles.headerTitles}>
            <h2 className={styles.title}>Master Data & Content Setup</h2>
            <p className={styles.subtitle}>
              Configure core system taxonomies: property types, amenities, geographical locations, and homepage display banners.
            </p>
          </div>

          {/* Section Selection Tabs */}
          <div className={styles.tabGroup}>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'propertyTypes' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('propertyTypes')}
            >
              Property Types ({propertyTypes.length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'amenities' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('amenities')}
            >
              Amenities ({amenities.length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'locations' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('locations')}
            >
              Cities & Regions ({locations.length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'categories' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              Categories & Banners ({categories.length})
            </button>
          </div>
        </div>

        {/* Controls Bar: Search & + Add Button */}
        <div className={styles.controlsBar}>
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search taxonomy items..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <button 
            type="button" 
            className={styles.btnAddItem}
            onClick={() => {
              if (activeTab === 'propertyTypes') {
                setEditingItem({ name: '', slug: '', description: '', status: 'Active' });
                setModalType('propertyType');
              } else if (activeTab === 'amenities') {
                setEditingItem({ name: '', category: 'Essentials', isHighlight: true, status: 'Active' });
                setModalType('amenity');
              } else if (activeTab === 'locations') {
                setEditingItem({ country: 'India', state: '', city: '', tier: 'Top Destination', status: 'Active' });
                setModalType('location');
              } else if (activeTab === 'categories') {
                setEditingItem({ title: '', sectionKey: '', badge: '', displayOrder: categories.length + 1, bannerText: '', status: 'Active' });
                setModalType('category');
              }
            }}
          >
            <FaPlus size={11} /> + Add New {activeTab === 'propertyTypes' ? 'Property Type' : activeTab === 'amenities' ? 'Amenity' : activeTab === 'locations' ? 'City' : 'Section'}
          </button>
        </div>

        {/* 1. Property Types Table */}
        {activeTab === 'propertyTypes' && (
          <div className="table-responsive">
            <table className={`table table-hover align-middle mb-0 ${styles.masterTable}`}>
              <thead className="table-light">
                <tr>
                  <th style={{ width: '60px' }}>Sr. No.</th>
                  <th>Property Type Name</th>
                  <th>URL Slug</th>
                  <th>Description</th>
                  <th>Active Stays</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {propertyTypes
                  .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.slug.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((p, idx) => (
                    <tr key={p.id}>
                      <td><span style={{ fontWeight: '600', color: '#64748b' }}>{idx + 1}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className={styles.itemIconCircle}><FaHome /></div>
                          <span style={{ fontWeight: '700', color: '#111111' }}>{p.name}</span>
                        </div>
                      </td>
                      <td><code>/{p.slug}</code></td>
                      <td><span style={{ color: '#4b5563' }}>{p.description}</span></td>
                      <td><span style={{ fontWeight: '700', color: '#ff385c' }}>{p.count} Stays</span></td>
                      <td>
                        <span className={`${styles.badgeStatus} ${p.status === 'Active' ? styles.badgeActive : styles.badgeInactive}`}>
                          ● {p.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionGroup}>
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnActionEdit}`}
                            onClick={() => { setEditingItem({ ...p }); setModalType('propertyType'); }}
                            title="Edit Property Type"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnActionDelete}`}
                            onClick={() => handleDeleteItem(p.id, 'propertyTypes')}
                            title="Delete Property Type"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. Amenities Table */}
        {activeTab === 'amenities' && (
          <div className="table-responsive">
            <table className={`table table-hover align-middle mb-0 ${styles.masterTable}`}>
              <thead className="table-light">
                <tr>
                  <th style={{ width: '60px' }}>Sr. No.</th>
                  <th>Amenity Name</th>
                  <th>Category</th>
                  <th>Highlighted Filter</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {amenities
                  .filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.category.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((a, idx) => (
                    <tr key={a.id}>
                      <td><span style={{ fontWeight: '600', color: '#64748b' }}>{idx + 1}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className={styles.itemIconCircle}><FaCheck color="#16a34a" /></div>
                          <span style={{ fontWeight: '700', color: '#111111' }}>{a.name}</span>
                        </div>
                      </td>
                      <td><span style={{ color: '#4b5563', fontWeight: '500' }}>{a.category}</span></td>
                      <td>
                        {a.isHighlight ? (
                          <span style={{ background: '#fefce8', color: '#ca8a04', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                            ★ Quick Filter
                          </span>
                        ) : (
                          <span style={{ color: '#9ca3af', fontSize: '12px' }}>Standard</span>
                        )}
                      </td>
                      <td>
                        <span className={`${styles.badgeStatus} ${a.status === 'Active' ? styles.badgeActive : styles.badgeInactive}`}>
                          ● {a.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionGroup}>
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnActionEdit}`}
                            onClick={() => { setEditingItem({ ...a }); setModalType('amenity'); }}
                            title="Edit Amenity"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnActionDelete}`}
                            onClick={() => handleDeleteItem(a.id, 'amenities')}
                            title="Delete Amenity"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. Locations Table */}
        {activeTab === 'locations' && (
          <div className="table-responsive">
            <table className={`table table-hover align-middle mb-0 ${styles.masterTable}`}>
              <thead className="table-light">
                <tr>
                  <th style={{ width: '60px' }}>Sr. No.</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Country</th>
                  <th>Destination Tier</th>
                  <th>Live Listings</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {locations
                  .filter(l => l.city.toLowerCase().includes(searchTerm.toLowerCase()) || l.state.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((l, idx) => (
                    <tr key={l.id}>
                      <td><span style={{ fontWeight: '600', color: '#64748b' }}>{idx + 1}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FaMapMarkerAlt color="#ff385c" />
                          <span style={{ fontWeight: '700', color: '#111111' }}>{l.city}</span>
                        </div>
                      </td>
                      <td><span style={{ color: '#4b5563' }}>{l.state}</span></td>
                      <td><strong>{l.country}</strong></td>
                      <td>
                        <span style={{ background: '#eff6ff', color: '#2563eb', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                          {l.tier}
                        </span>
                      </td>
                      <td><span style={{ fontWeight: '700', color: '#16a34a' }}>{l.activeListings} Properties</span></td>
                      <td>
                        <div className={styles.actionGroup}>
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnActionEdit}`}
                            onClick={() => { setEditingItem({ ...l }); setModalType('location'); }}
                            title="Edit City / Region"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnActionDelete}`}
                            onClick={() => handleDeleteItem(l.id, 'locations')}
                            title="Delete Location"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. Categories & Homepage Sections */}
        {activeTab === 'categories' && (
          <div className="table-responsive">
            <table className={`table table-hover align-middle mb-0 ${styles.masterTable}`}>
              <thead className="table-light">
                <tr>
                  <th style={{ width: '60px' }}>Sr. No.</th>
                  <th>Section / Category Title</th>
                  <th>API Section Key</th>
                  <th>Display Badge</th>
                  <th>Banner Tagline</th>
                  <th>Order</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories
                  .filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.sectionKey.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((c, idx) => (
                    <tr key={c.id}>
                      <td><span style={{ fontWeight: '600', color: '#64748b' }}>{idx + 1}</span></td>
                      <td>
                        <span style={{ fontWeight: '700', color: '#111111' }}>{c.title}</span>
                      </td>
                      <td><code>{c.sectionKey}</code></td>
                      <td>
                        <span style={{ background: '#fff1f2', color: '#ff385c', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                          {c.badge}
                        </span>
                      </td>
                      <td><span style={{ color: '#4b5563', fontStyle: 'italic' }}>"{c.bannerText}"</span></td>
                      <td><span style={{ fontWeight: '700' }}>#{c.displayOrder}</span></td>
                      <td>
                        <div className={styles.actionGroup}>
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnActionEdit}`}
                            onClick={() => { setEditingItem({ ...c }); setModalType('category'); }}
                            title="Edit Section Curation"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnActionDelete}`}
                            onClick={() => handleDeleteItem(c.id, 'categories')}
                            title="Delete Section"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. Modal Dialog for Add / Edit Master Data Item */}
      {modalType && editingItem && (
        <div className={styles.modalBackdrop} onClick={() => setModalType(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSaveModal}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>
                  {editingItem.id ? 'Edit' : 'Add New'} {
                    modalType === 'propertyType' ? 'Property Type' :
                    modalType === 'amenity' ? 'Amenity' :
                    modalType === 'location' ? 'City / Location' : 'Homepage Section'
                  }
                </h3>
                <button type="button" className={styles.modalCloseBtn} onClick={() => setModalType(null)}>
                  <FaTimes />
                </button>
              </div>

              <div className={styles.modalBody}>
                {/* Form fields for Property Type */}
                {modalType === 'propertyType' && (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Property Type Name</label>
                      <input 
                        type="text" 
                        value={editingItem.name} 
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} 
                        required 
                        className={styles.formInput} 
                        placeholder="e.g. Modern Penthouse"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>URL Slug</label>
                      <input 
                        type="text" 
                        value={editingItem.slug} 
                        onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })} 
                        required 
                        className={styles.formInput} 
                        placeholder="e.g. penthouse"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Description</label>
                      <input 
                        type="text" 
                        value={editingItem.description} 
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })} 
                        className={styles.formInput} 
                        placeholder="Short summary for hosts & guests"
                      />
                    </div>
                  </>
                )}

                {/* Form fields for Amenity */}
                {modalType === 'amenity' && (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Amenity Name</label>
                      <input 
                        type="text" 
                        value={editingItem.name} 
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} 
                        required 
                        className={styles.formInput} 
                        placeholder="e.g. EV Car Charger"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Category</label>
                      <select 
                        value={editingItem.category} 
                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })} 
                        className={styles.formInput}
                      >
                        <option value="Essentials">Essentials</option>
                        <option value="Outdoor & Luxury">Outdoor & Luxury</option>
                        <option value="Facilities">Facilities</option>
                        <option value="Dining">Dining</option>
                        <option value="Climate">Climate</option>
                        <option value="Entertainment">Entertainment</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Show as Highlight Filter</label>
                      <select 
                        value={editingItem.isHighlight ? 'yes' : 'no'} 
                        onChange={(e) => setEditingItem({ ...editingItem, isHighlight: e.target.value === 'yes' })} 
                        className={styles.formInput}
                      >
                        <option value="yes">Yes (Quick filter on search)</option>
                        <option value="no">No (Standard list)</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Form fields for Location */}
                {modalType === 'location' && (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>City Name</label>
                      <input 
                        type="text" 
                        value={editingItem.city} 
                        onChange={(e) => setEditingItem({ ...editingItem, city: e.target.value })} 
                        required 
                        className={styles.formInput} 
                        placeholder="e.g. Rishikesh"
                      />
                    </div>
                    <div className="row g-2">
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>State / Province</label>
                          <input 
                            type="text" 
                            value={editingItem.state} 
                            onChange={(e) => setEditingItem({ ...editingItem, state: e.target.value })} 
                            required 
                            className={styles.formInput} 
                            placeholder="e.g. Uttarakhand"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Country</label>
                          <input 
                            type="text" 
                            value={editingItem.country} 
                            onChange={(e) => setEditingItem({ ...editingItem, country: e.target.value })} 
                            required 
                            className={styles.formInput} 
                          />
                        </div>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Destination Tier</label>
                      <select 
                        value={editingItem.tier} 
                        onChange={(e) => setEditingItem({ ...editingItem, tier: e.target.value })} 
                        className={styles.formInput}
                      >
                        <option value="Top Destination">Top Destination</option>
                        <option value="Hill Station">Hill Station</option>
                        <option value="Backwaters">Backwaters</option>
                        <option value="Metro">Metro</option>
                        <option value="Heritage">Heritage</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Form fields for Category / Banner */}
                {modalType === 'category' && (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Category / Section Title</label>
                      <input 
                        type="text" 
                        value={editingItem.title} 
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} 
                        required 
                        className={styles.formInput} 
                        placeholder="e.g. Luxe Mountain Escapes"
                      />
                    </div>
                    <div className="row g-2">
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>API Section Key</label>
                          <input 
                            type="text" 
                            value={editingItem.sectionKey} 
                            onChange={(e) => setEditingItem({ ...editingItem, sectionKey: e.target.value })} 
                            required 
                            className={styles.formInput} 
                            placeholder="e.g. luxe_mountain"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Badge Tag</label>
                          <input 
                            type="text" 
                            value={editingItem.badge} 
                            onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })} 
                            className={styles.formInput} 
                            placeholder="e.g. Trending"
                          />
                        </div>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Banner Subtitle / Tagline</label>
                      <input 
                        type="text" 
                        value={editingItem.bannerText} 
                        onChange={(e) => setEditingItem({ ...editingItem, bannerText: e.target.value })} 
                        className={styles.formInput} 
                        placeholder="Tagline shown on homepage"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={() => setModalType(null)}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
