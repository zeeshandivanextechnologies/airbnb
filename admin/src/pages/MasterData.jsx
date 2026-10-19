import React, { useState, useEffect } from 'react';
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
  FaLayerGroup,
  FaConciergeBell,
  FaStar,
  FaRegCalendarCheck,
  FaBolt,
  FaTag,
  FaShieldAlt
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { renderCategoryIcon, AVAILABLE_ICONS } from '../utils/categoryIcons.jsx';
import styles from './styles/MasterData.module.css';

export default function MasterData() {
  const [activeTab, setActiveTab] = useState('propertyTypes'); // 'propertyTypes' | 'amenities' | 'locations' | 'categories' | 'hostServices'

  // Dynamic Host Services & Experiences State
  const [hostServices, setHostServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Dynamic Property Types State from Backend
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loadingPropertyTypes, setLoadingPropertyTypes] = useState(false);

  // Dynamic Place Types State from Backend (HostStep1 Step 3)
  const [placeTypes, setPlaceTypes] = useState([]);
  const [loadingPlaceTypes, setLoadingPlaceTypes] = useState(false);

  // Dynamic Step Settings State from Backend (HostStep1 Step 5 & Step 6)
  const [stepSettings, setStepSettings] = useState([]);
  const [loadingStepSettings, setLoadingStepSettings] = useState(false);

  // Dynamic Step 6 Basics Counters State from Backend (Guests, Bedrooms, Beds, Bathrooms)
  const [stepBasics, setStepBasics] = useState([]);
  const [loadingStepBasics, setLoadingStepBasics] = useState(false);

  // Fetch step settings from backend
  const fetchStepSettings = async () => {
    try {
      setLoadingStepSettings(true);
      const res = await fetch('http://localhost:5000/api/listings/step-settings');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setStepSettings(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch step settings:', err);
    } finally {
      setLoadingStepSettings(false);
    }
  };

  // Fetch step basics from backend
  const fetchStepBasics = async () => {
    try {
      setLoadingStepBasics(true);
      const res = await fetch('http://localhost:5000/api/listings/step-basics?all=true');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setStepBasics(data.data.map(b => ({
          ...b,
          status: b.is_active ? 'Active' : 'Inactive'
        })));
      }
    } catch (err) {
      console.error('Failed to fetch step basics:', err);
    } finally {
      setLoadingStepBasics(false);
    }
  };

  // Fetch place types from backend
  const fetchPlaceTypes = async () => {
    try {
      setLoadingPlaceTypes(true);
      const res = await fetch('http://localhost:5000/api/listings/place-types?all=true');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPlaceTypes(data.data.map(pl => ({
          ...pl,
          status: pl.is_active ? 'Active' : 'Inactive'
        })));
      }
    } catch (err) {
      console.error('Failed to fetch place types:', err);
    } finally {
      setLoadingPlaceTypes(false);
    }
  };

  // Fetch property types from backend
  const fetchPropertyTypes = async () => {
    try {
      setLoadingPropertyTypes(true);
      const res = await fetch('http://localhost:5000/api/listings/property-types?all=true');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPropertyTypes(data.data.map(p => ({
          ...p,
          status: p.is_active ? 'Active' : 'Inactive',
          count: p.count || 0
        })));
      }
    } catch (err) {
      console.error('Failed to fetch property types:', err);
    } finally {
      setLoadingPropertyTypes(false);
    }
  };

  // Fetch host categories from backend
  const fetchHostServices = async () => {
    try {
      setLoadingServices(true);
      const res = await fetch('http://localhost:5000/api/listings/host-categories?all=true');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setHostServices(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch host categories:', err);
    } finally {
      setLoadingServices(false);
    }
  };

  // Dynamic Master Amenities State from Backend (HostStep2 Step 2)
  const [amenities, setAmenities] = useState([]);
  const [loadingAmenities, setLoadingAmenities] = useState(false);

  // Fetch amenities from backend
  const fetchAmenities = async () => {
    try {
      setLoadingAmenities(true);
      const res = await fetch('http://localhost:5000/api/listings/master-amenities?all=true');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAmenities(data.data.map(a => ({
          ...a,
          status: a.is_active ? 'Active' : 'Inactive'
        })));
      }
    } catch (err) {
      console.error('Failed to fetch amenities:', err);
    } finally {
      setLoadingAmenities(false);
    }
  };

  // Dynamic Master Highlights State from Backend (HostStep2 Step 5)
  const [highlights, setHighlights] = useState([]);
  const [loadingHighlights, setLoadingHighlights] = useState(false);

  // Fetch highlights from backend
  const fetchHighlights = async () => {
    try {
      setLoadingHighlights(true);
      const res = await fetch('http://localhost:5000/api/listings/master-highlights?all=true');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setHighlights(data.data.map(h => ({
          ...h,
          status: h.is_active ? 'Active' : 'Inactive'
        })));
      }
    } catch (err) {
      console.error('Failed to fetch highlights:', err);
    } finally {
      setLoadingHighlights(false);
    }
  };

  // Dynamic Master Booking Options State from Backend (HostStep3 Step 2)
  const [bookingOptions, setBookingOptions] = useState([]);
  const [loadingBookingOptions, setLoadingBookingOptions] = useState(false);

  // Fetch booking options from backend
  const fetchBookingOptions = async () => {
    try {
      setLoadingBookingOptions(true);
      const res = await fetch('http://localhost:5000/api/listings/master-booking-options?all=true');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setBookingOptions(data.data.map(b => ({
          ...b,
          status: b.is_active ? 'Active' : 'Inactive'
        })));
      }
    } catch (err) {
      console.error('Failed to fetch booking options:', err);
    } finally {
      setLoadingBookingOptions(false);
    }
  };

  // Dynamic Master Discounts State from Backend (HostStep3 Step 4)
  const [discounts, setDiscounts] = useState([]);
  const [loadingDiscounts, setLoadingDiscounts] = useState(false);

  // Fetch discounts from backend
  const fetchDiscounts = async () => {
    try {
      setLoadingDiscounts(true);
      const res = await fetch('http://localhost:5000/api/listings/master-discounts?all=true');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setDiscounts(data.data.map(d => ({
          ...d,
          status: d.is_active ? 'Active' : 'Inactive'
        })));
      }
    } catch (err) {
      console.error('Failed to fetch discounts:', err);
    } finally {
      setLoadingDiscounts(false);
    }
  };

  // Dynamic Master Safety Items State from Backend (HostStep3 Step 5)
  const [safetyItems, setSafetyItems] = useState([]);
  const [loadingSafetyItems, setLoadingSafetyItems] = useState(false);

  // Fetch safety items from backend
  const fetchSafetyItems = async () => {
    try {
      setLoadingSafetyItems(true);
      const res = await fetch('http://localhost:5000/api/listings/master-safety-items?all=true');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setSafetyItems(data.data.map(s => ({
          ...s,
          status: s.is_active ? 'Active' : 'Inactive'
        })));
      }
    } catch (err) {
      console.error('Failed to fetch safety items:', err);
    } finally {
      setLoadingSafetyItems(false);
    }
  };

  // Dynamic Home Destinations State from Backend (Home.jsx Destinations slider)
  const [homeDestinations, setHomeDestinations] = useState([]);
  const [loadingHomeDestinations, setLoadingHomeDestinations] = useState(false);

  // Fetch home destinations from backend
  const fetchHomeDestinations = async () => {
    try {
      setLoadingHomeDestinations(true);
      const res = await fetch('http://localhost:5000/api/listings/home-destinations?all=true');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setHomeDestinations(data.data.map(d => ({
          ...d,
          status: d.is_active ? 'Active' : 'Inactive'
        })));
      }
    } catch (err) {
      console.error('Failed to fetch home destinations:', err);
    } finally {
      setLoadingHomeDestinations(false);
    }
  };

  useEffect(() => {
    fetchPropertyTypes();
    fetchPlaceTypes();
    fetchHostServices();
    fetchStepSettings();
    fetchStepBasics();
    fetchAmenities();
    fetchHighlights();
    fetchBookingOptions();
    fetchDiscounts();
    fetchSafetyItems();
    fetchHomeDestinations();
  }, []);

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
  const [modalType, setModalType] = useState(null); // 'propertyType' | 'amenity' | 'location' | 'category' | 'hostService'
  const [editingItem, setEditingItem] = useState(null);

  // Handlers for deleting
  const handleDeleteItem = async (id, type) => {
    if (window.confirm('Delete this master data entry permanently?')) {
      if (type === 'propertyTypes') {
        try {
          const res = await fetch(`http://localhost:5000/api/listings/property-types/${id}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Property type deleted from database!');
            fetchPropertyTypes();
          } else {
            toast.error(data.message || 'Failed to delete property type');
          }
        } catch (err) {
          toast.error('Network error deleting property type');
        }
      }
      if (type === 'placeTypes') {
        try {
          const res = await fetch(`http://localhost:5000/api/listings/place-types/${id}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Place type deleted from database!');
            fetchPlaceTypes();
          } else {
            toast.error(data.message || 'Failed to delete place type');
          }
        } catch (err) {
          toast.error('Network error deleting place type');
        }
      }
      if (type === 'stepBasics') {
        try {
          const res = await fetch(`http://localhost:5000/api/listings/step-basics/${id}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Room basic item deleted from database!');
            fetchStepBasics();
          } else {
            toast.error(data.message || 'Failed to delete room basic item');
          }
        } catch (err) {
          toast.error('Network error deleting room basic item');
        }
      }
      if (type === 'amenities') {
        try {
          const res = await fetch(`http://localhost:5000/api/listings/master-amenities/${id}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Amenity deleted from database!');
            fetchAmenities();
          } else {
            toast.error(data.message || 'Failed to delete amenity');
          }
        } catch (err) {
          toast.error('Network error deleting amenity');
        }
      }
      if (type === 'highlights') {
        try {
          const res = await fetch(`http://localhost:5000/api/listings/master-highlights/${id}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Listing highlight deleted from database!');
            fetchHighlights();
          } else {
            toast.error(data.message || 'Failed to delete highlight');
          }
        } catch (err) {
          toast.error('Network error deleting highlight');
        }
      }
      if (type === 'bookingOptions') {
        try {
          const res = await fetch(`http://localhost:5000/api/listings/master-booking-options/${id}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Booking option deleted from database!');
            fetchBookingOptions();
          } else {
            toast.error(data.message || 'Failed to delete booking option');
          }
        } catch (err) {
          toast.error('Network error deleting booking option');
        }
      }
      if (type === 'discounts') {
        try {
          const res = await fetch(`http://localhost:5000/api/listings/master-discounts/${id}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Discount promotion deleted from database!');
            fetchDiscounts();
          } else {
            toast.error(data.message || 'Failed to delete discount');
          }
        } catch (err) {
          toast.error('Network error deleting discount');
        }
      }
      if (type === 'safetyItems') {
        try {
          const res = await fetch(`http://localhost:5000/api/listings/master-safety-items/${id}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Safety item deleted from database!');
            fetchSafetyItems();
          } else {
            toast.error(data.message || 'Failed to delete safety item');
          }
        } catch (err) {
          toast.error('Network error deleting safety item');
        }
      }
      if (type === 'homeDestinations') {
        try {
          const res = await fetch(`http://localhost:5000/api/listings/home-destinations/${id}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Home destination deleted from database!');
            fetchHomeDestinations();
          } else {
            toast.error(data.message || 'Failed to delete home destination');
          }
        } catch (err) {
          toast.error('Network error deleting destination');
        }
      }
      if (type === 'locations') setLocations(locations.filter(l => l.id !== id));
      if (type === 'categories') setCategories(categories.filter(c => c.id !== id));
      if (type === 'hostServices') {
        try {
          const res = await fetch(`http://localhost:5000/api/listings/host-categories/${id}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Category removed successfully');
            setHostServices(hostServices.filter(s => s.id !== id));
          } else {
            toast.error(data.message || 'Failed to delete category');
          }
        } catch (err) {
          toast.error('Network error deleting category');
        }
      }
    }
  };

  // Handlers for saving Add/Edit
  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (modalType === 'stepBasic') {
      try {
        const payload = {
          key: editingItem.key,
          label: editingItem.label,
          default_val: parseInt(editingItem.default_val, 10) || 1,
          min_val: parseInt(editingItem.min_val, 10) || 1,
          max_val: parseInt(editingItem.max_val, 10) || 50,
          is_active: editingItem.status === 'Active' || editingItem.is_active !== false
        };

        if (editingItem.id && typeof editingItem.id === 'number' && editingItem.id < 1000000000000) {
          const res = await fetch(`http://localhost:5000/api/listings/step-basics/${editingItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Room basic item updated successfully!');
            fetchStepBasics();
          } else {
            toast.error(data.message || 'Failed to update item');
          }
        } else {
          const res = await fetch('http://localhost:5000/api/listings/step-basics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Room basic counter added & live for hosts!');
            fetchStepBasics();
          } else {
            toast.error(data.message || 'Failed to add item');
          }
        }
      } catch (err) {
        toast.error('Network error saving room basic counter');
      }
    } else if (modalType === 'stepSetting') {
      try {
        const payload = {
          title: editingItem.title,
          subtitle: editingItem.subtitle,
          toggle_label: editingItem.toggle_label,
          toggle_subtitle: editingItem.toggle_subtitle,
          default_state: editingItem.default_state,
          learn_more_link: editingItem.learn_more_link
        };

        const res = await fetch(`http://localhost:5000/api/listings/step-settings/${editingItem.step_key}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          toast.success(`Settings for ${editingItem.step_key} updated & live for hosts!`);
          fetchStepSettings();
        } else {
          toast.error(data.message || 'Failed to update step settings');
        }
      } catch (err) {
        toast.error('Network error saving step settings');
      }
    } else if (modalType === 'placeType') {
      try {
        const payload = {
          key: editingItem.key,
          title: editingItem.title,
          subtitle: editingItem.subtitle || '',
          icon: editingItem.icon || 'home',
          is_active: editingItem.status === 'Active' || editingItem.is_active !== false
        };

        if (editingItem.id && typeof editingItem.id === 'number' && editingItem.id < 1000000000000) {
          const res = await fetch(`http://localhost:5000/api/listings/place-types/${editingItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Place type updated successfully!');
            fetchPlaceTypes();
          } else {
            toast.error(data.message || 'Failed to update place type');
          }
        } else {
          const res = await fetch('http://localhost:5000/api/listings/place-types', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Place type added & live for hosts in Step 3!');
            fetchPlaceTypes();
          } else {
            toast.error(data.message || 'Failed to add place type');
          }
        }
      } catch (err) {
        toast.error('Network error saving place type');
      }
    } else if (modalType === 'propertyType') {
      try {
        const payload = {
          name: editingItem.name,
          slug: editingItem.slug,
          icon: editingItem.icon || 'home',
          description: editingItem.description || '',
          is_active: editingItem.status === 'Active' || editingItem.is_active !== false
        };

        if (editingItem.id && typeof editingItem.id === 'number' && editingItem.id < 1000000000000) {
          const res = await fetch(`http://localhost:5000/api/listings/property-types/${editingItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Property type updated successfully!');
            fetchPropertyTypes();
          } else {
            toast.error(data.message || 'Failed to update property type');
          }
        } else {
          const res = await fetch('http://localhost:5000/api/listings/property-types', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Property type added & live for hosts!');
            fetchPropertyTypes();
          } else {
            toast.error(data.message || 'Failed to add property type');
          }
        }
      } catch (err) {
        toast.error('Network error saving property type');
      }
    } else if (modalType === 'amenity') {
      try {
        const payload = {
          key: editingItem.key,
          name: editingItem.name,
          sublabel: editingItem.sublabel || '',
          category: editingItem.category || 'Basics',
          icon: editingItem.icon || 'wifi',
          is_highlight: editingItem.is_highlight === true || editingItem.isHighlight === true,
          display_order: editingItem.display_order || 0,
          is_active: editingItem.status === 'Active' || editingItem.is_active !== false
        };

        if (editingItem.id && typeof editingItem.id === 'number' && editingItem.id < 1000000000000) {
          const res = await fetch(`http://localhost:5000/api/listings/master-amenities/${editingItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Amenity updated & live in HostStep2!');
            fetchAmenities();
          } else {
            toast.error(data.message || 'Failed to update amenity');
          }
        } else {
          const res = await fetch('http://localhost:5000/api/listings/master-amenities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Amenity added & live in HostStep2!');
            fetchAmenities();
          } else {
            toast.error(data.message || 'Failed to add amenity');
          }
        }
      } catch (err) {
        toast.error('Network error saving amenity');
      }
    } else if (modalType === 'highlight') {
      try {
        const payload = {
          key: editingItem.key,
          label: editingItem.label,
          icon: editingItem.icon || 'star',
          display_order: editingItem.display_order || 0,
          is_active: editingItem.status === 'Active' || editingItem.is_active !== false
        };

        if (editingItem.id && typeof editingItem.id === 'number' && editingItem.id < 1000000000000) {
          const res = await fetch(`http://localhost:5000/api/listings/master-highlights/${editingItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Listing highlight updated & live in HostStep2!');
            fetchHighlights();
          } else {
            toast.error(data.message || 'Failed to update highlight');
          }
        } else {
          const res = await fetch('http://localhost:5000/api/listings/master-highlights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Listing highlight added & live in HostStep2!');
            fetchHighlights();
          } else {
            toast.error(data.message || 'Failed to add highlight');
          }
        }
      } catch (err) {
        toast.error('Network error saving highlight');
      }
    } else if (modalType === 'bookingOption') {
      try {
        const payload = {
          key: editingItem.key,
          title: editingItem.title,
          badge: editingItem.badge || '',
          description: editingItem.description || '',
          icon: editingItem.icon || 'calendar',
          display_order: editingItem.display_order || 0,
          is_active: editingItem.status === 'Active' || editingItem.is_active !== false
        };

        if (editingItem.id && typeof editingItem.id === 'number' && editingItem.id < 1000000000000) {
          const res = await fetch(`http://localhost:5000/api/listings/master-booking-options/${editingItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Booking option updated & live in HostStep3!');
            fetchBookingOptions();
          } else {
            toast.error(data.message || 'Failed to update booking option');
          }
        } else {
          const res = await fetch('http://localhost:5000/api/listings/master-booking-options', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Booking option added & live in HostStep3!');
            fetchBookingOptions();
          } else {
            toast.error(data.message || 'Failed to add booking option');
          }
        }
      } catch (err) {
        toast.error('Network error saving booking option');
      }
    } else if (modalType === 'discount') {
      try {
        const payload = {
          key: editingItem.key,
          title: editingItem.title,
          description: editingItem.description || '',
          discount_percentage: parseInt(editingItem.discount_percentage, 10) || 0,
          is_customizable: editingItem.is_customizable !== false,
          display_order: parseInt(editingItem.display_order, 10) || 0,
          is_active: editingItem.status === 'Active' || editingItem.is_active !== false
        };

        if (editingItem.id && typeof editingItem.id === 'number' && editingItem.id < 1000000000000) {
          const res = await fetch(`http://localhost:5000/api/listings/master-discounts/${editingItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Discount updated & live in HostStep3!');
            fetchDiscounts();
          } else {
            toast.error(data.message || 'Failed to update discount');
          }
        } else {
          const res = await fetch('http://localhost:5000/api/listings/master-discounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Discount added & live in HostStep3!');
            fetchDiscounts();
          } else {
            toast.error(data.message || 'Failed to add discount');
          }
        }
      } catch (err) {
        toast.error('Network error saving discount');
      }
    } else if (modalType === 'safetyItem') {
      try {
        const payload = {
          key: editingItem.key,
          label: editingItem.label,
          requires_details: editingItem.requires_details === true,
          display_order: parseInt(editingItem.display_order, 10) || 0,
          is_active: editingItem.status === 'Active' || editingItem.is_active !== false
        };

        if (editingItem.id && typeof editingItem.id === 'number' && editingItem.id < 1000000000000) {
          const res = await fetch(`http://localhost:5000/api/listings/master-safety-items/${editingItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Safety item updated & live in HostStep3!');
            fetchSafetyItems();
          } else {
            toast.error(data.message || 'Failed to update safety item');
          }
        } else {
          const res = await fetch('http://localhost:5000/api/listings/master-safety-items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Safety item added & live in HostStep3!');
            fetchSafetyItems();
          } else {
            toast.error(data.message || 'Failed to add safety item');
          }
        }
      } catch (err) {
        toast.error('Network error saving safety item');
      }
    } else if (modalType === 'homeDestination') {
      try {
        const payload = {
          country: editingItem.country,
          title: editingItem.title,
          image: editingItem.image,
          display_order: parseInt(editingItem.display_order, 10) || 0,
          is_active: editingItem.status === 'Active' || editingItem.is_active !== false
        };

        if (editingItem.id && typeof editingItem.id === 'number' && editingItem.id < 1000000000000) {
          const res = await fetch(`http://localhost:5000/api/listings/home-destinations/${editingItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Home destination updated & live on Homepage!');
            fetchHomeDestinations();
          } else {
            toast.error(data.message || 'Failed to update destination');
          }
        } else {
          const res = await fetch('http://localhost:5000/api/listings/home-destinations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Home destination added & live on Homepage!');
            fetchHomeDestinations();
          } else {
            toast.error(data.message || 'Failed to add destination');
          }
        }
      } catch (err) {
        toast.error('Network error saving destination');
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
    } else if (modalType === 'hostService') {
      try {
        const payload = {
          hosting_type: editingItem.hosting_type || 'service',
          name: editingItem.name,
          icon: editingItem.icon || '✨',
          sub_options: typeof editingItem.sub_options_str === 'string'
            ? editingItem.sub_options_str.split(',').map(s => s.trim()).filter(Boolean)
            : (editingItem.sub_options || []),
          is_active: editingItem.is_active !== false
        };

        if (editingItem.id) {
          const res = await fetch(`http://localhost:5000/api/listings/host-categories/${editingItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Category updated in database!');
            fetchHostServices();
          } else {
            toast.error(data.message || 'Failed to update');
          }
        } else {
          const res = await fetch('http://localhost:5000/api/listings/host-categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            toast.success('Category created and live for hosts!');
            fetchHostServices();
          } else {
            toast.error(data.message || 'Failed to create');
          }
        }
      } catch (err) {
        toast.error('Network error saving category');
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
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'placeTypes' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('placeTypes')}
            >
              Place Types ({placeTypes.length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'hostServices' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('hostServices')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FaConciergeBell size={13} /> Services & Experiences ({hostServices.length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'stepSettings' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('stepSettings')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FaMapMarkerAlt size={13} /> Host Steps & Modals Setup ({stepSettings.length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'stepBasics' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('stepBasics')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FaHome size={13} /> Step 6 Basics Counters ({stepBasics.length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'highlights' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('highlights')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FaStar size={13} /> Step 5 Highlights ({highlights.length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'bookingOptions' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('bookingOptions')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FaRegCalendarCheck size={13} /> Step 3 Booking Options ({bookingOptions.length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'discounts' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('discounts')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FaTag size={13} /> Step 4 Discounts ({discounts.length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'safetyItems' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('safetyItems')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FaShieldAlt size={13} /> Step 5 Safety Items ({safetyItems.length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'homeDestinations' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('homeDestinations')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FaGlobeAmericas size={13} /> Home Destinations Slider ({homeDestinations.length})
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
              if (activeTab === 'stepBasics') {
                setEditingItem({ key: '', label: '', default_val: 1, min_val: 1, max_val: 30, status: 'Active' });
                setModalType('stepBasic');
              } else if (activeTab === 'placeTypes') {
                setEditingItem({ key: '', title: '', subtitle: '', icon: 'home', status: 'Active' });
                setModalType('placeType');
              } else if (activeTab === 'propertyTypes') {
                setEditingItem({ name: '', slug: '', description: '', status: 'Active' });
                setModalType('propertyType');
              } else if (activeTab === 'amenities') {
                setEditingItem({ key: '', name: '', sublabel: '', category: 'Basics', icon: 'wifi', is_highlight: false, display_order: amenities.length + 1, status: 'Active' });
                setModalType('amenity');
              } else if (activeTab === 'locations') {
                setEditingItem({ country: 'India', state: '', city: '', tier: 'Top Destination', status: 'Active' });
                setModalType('location');
              } else if (activeTab === 'categories') {
                setEditingItem({ title: '', sectionKey: '', badge: '', displayOrder: categories.length + 1, bannerText: '', status: 'Active' });
                setModalType('category');
              } else if (activeTab === 'hostServices') {
                setEditingItem({ hosting_type: 'service', name: '', icon: '🛎️', sub_options_str: '', is_active: true });
                setModalType('hostService');
              } else if (activeTab === 'highlights') {
                setEditingItem({ key: '', label: '', icon: 'star', display_order: highlights.length + 1, status: 'Active' });
                setModalType('highlight');
              } else if (activeTab === 'bookingOptions') {
                setEditingItem({ key: '', title: '', badge: '', description: '', icon: 'calendar', display_order: bookingOptions.length + 1, status: 'Active' });
                setModalType('bookingOption');
              } else if (activeTab === 'discounts') {
                setEditingItem({ key: '', title: '', description: '', discount_percentage: 0, is_customizable: true, display_order: discounts.length + 1, status: 'Active' });
                setModalType('discount');
              } else if (activeTab === 'safetyItems') {
                setEditingItem({ key: '', label: '', requires_details: false, display_order: safetyItems.length + 1, status: 'Active' });
                setModalType('safetyItem');
              } else if (activeTab === 'homeDestinations') {
                setEditingItem({ country: '', title: '', image: '', display_order: homeDestinations.length + 1, status: 'Active' });
                setModalType('homeDestination');
              }
            }}
          >
            <FaPlus size={11} /> + Add New {activeTab === 'stepBasics' ? 'Basic Counter' : activeTab === 'placeTypes' ? 'Place Type' : activeTab === 'propertyTypes' ? 'Property Type' : activeTab === 'amenities' ? 'Amenity' : activeTab === 'highlights' ? 'Highlight' : activeTab === 'bookingOptions' ? 'Booking Option' : activeTab === 'discounts' ? 'Discount' : activeTab === 'safetyItems' ? 'Safety Item' : activeTab === 'homeDestinations' ? 'Destination' : activeTab === 'locations' ? 'City' : activeTab === 'hostServices' ? 'Service/Experience' : 'Category'}
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
                          <div className={styles.itemIconCircle}>
                            {renderCategoryIcon(p.icon || p.slug, { size: '16px' })}
                          </div>
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
                  .filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || (a.category && a.category.toLowerCase().includes(searchTerm.toLowerCase())) || (a.key && a.key.toLowerCase().includes(searchTerm.toLowerCase())))
                  .map((a, idx) => (
                    <tr key={a.id}>
                      <td><span style={{ fontWeight: '600', color: '#64748b' }}>{idx + 1}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className={styles.itemIconCircle}>
                            {renderCategoryIcon(a.icon || a.key, { size: '16px' })}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', color: '#111111' }}>{a.name}</div>
                            {a.sublabel && <div style={{ fontSize: '11px', color: '#717171' }}>{a.sublabel}</div>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ 
                          background: '#f1f5f9', 
                          color: '#334155', 
                          padding: '3px 8px', 
                          borderRadius: '6px', 
                          fontSize: '12px', 
                          fontWeight: '600' 
                        }}>
                          {a.category}
                        </span>
                      </td>
                      <td>
                        {a.is_highlight || a.isHighlight ? (
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

        {/* 5. Services & Experiences Categories (Dynamic from Backend) */}
        {activeTab === 'hostServices' && (
          <div className="table-responsive">
            {loadingServices ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>
                Loading categories from database...
              </div>
            ) : (
              <table className={`table table-hover align-middle mb-0 ${styles.masterTable}`}>
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '60px' }}>Sr. No.</th>
                    <th>Icon</th>
                    <th>Category Name</th>
                    <th>Type</th>
                    <th>Sub-Services / Activities</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hostServices.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#9ca3af' }}>
                        No categories found. Click "+ Add New Service/Experience Category" above to create one.
                      </td>
                    </tr>
                  ) : (
                    hostServices
                      .filter(s => 
                        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        s.hosting_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (Array.isArray(s.sub_options) && s.sub_options.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase())))
                      )
                      .map((s, idx) => (
                        <tr key={s.id}>
                          <td><span style={{ fontWeight: '600', color: '#64748b' }}>{idx + 1}</span></td>
                          <td>
                            <span style={{ fontSize: '20px', display: 'flex', alignItems: 'center', color: '#ff385c' }}>
                              {renderCategoryIcon(s.icon || 'service', { size: '20px' })}
                            </span>
                          </td>
                          <td>
                            <strong style={{ color: '#111827', fontSize: '14px' }}>{s.name}</strong>
                          </td>
                          <td>
                            <span style={{
                              background: s.hosting_type === 'service' ? '#ecfdf5' : '#eff6ff',
                              color: s.hosting_type === 'service' ? '#059669' : '#2563eb',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: '700',
                              textTransform: 'uppercase'
                            }}>
                              {s.hosting_type}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '350px' }}>
                              {Array.isArray(s.sub_options) && s.sub_options.length > 0 ? (
                                s.sub_options.map((sub, i) => (
                                  <span 
                                    key={i} 
                                    style={{ 
                                      background: '#f3f4f6', 
                                      color: '#374151', 
                                      padding: '2px 8px', 
                                      borderRadius: '6px', 
                                      fontSize: '11.5px' 
                                    }}
                                  >
                                    {sub}
                                  </span>
                                ))
                              ) : (
                                <span style={{ color: '#9ca3af', fontSize: '12px', fontStyle: 'italic' }}>None specified</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: s.is_active ? '#ecfdf5' : '#fef2f2',
                              color: s.is_active ? '#10b981' : '#ef4444',
                              padding: '3px 9px',
                              borderRadius: '20px',
                              fontSize: '11.5px',
                              fontWeight: '600'
                            }}>
                              {s.is_active ? <FaCheck size={9} /> : <FaTimes size={9} />}
                              {s.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actionGroup}>
                              <button 
                                type="button" 
                                className={`${styles.btnAction} ${styles.btnActionEdit}`}
                                onClick={() => { 
                                  setEditingItem({ 
                                    ...s,
                                    sub_options_str: Array.isArray(s.sub_options) ? s.sub_options.join(', ') : ''
                                  }); 
                                  setModalType('hostService'); 
                                }}
                                title="Edit Category"
                              >
                                <FaEdit /> Edit
                              </button>
                              <button 
                                type="button" 
                                className={`${styles.btnAction} ${styles.btnActionDelete}`}
                                onClick={() => handleDeleteItem(s.id, 'hostServices')}
                                title="Delete Category"
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
            )}
          </div>
        )}

        {/* 6. Place Types Table (HostStep1 Step 3 - Entire place, Room, Shared room) */}
        {activeTab === 'placeTypes' && (
          <div className="table-responsive">
            {loadingPlaceTypes ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>
                Loading place types from database...
              </div>
            ) : (
              <table className={`table table-hover align-middle mb-0 ${styles.masterTable}`}>
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '60px' }}>Sr. No.</th>
                    <th>Icon</th>
                    <th>Place Type Title (Step 3)</th>
                    <th>Key Identifier</th>
                    <th>Description / Subtitle</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {placeTypes
                    .filter(pl => 
                      pl.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      pl.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (pl.subtitle && pl.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                    .map((pl, idx) => (
                      <tr key={pl.id}>
                        <td><span style={{ fontWeight: '600', color: '#64748b' }}>{idx + 1}</span></td>
                        <td>
                          <div className={styles.itemIconCircle}>
                            {renderCategoryIcon(pl.icon || pl.key, { size: '18px' })}
                          </div>
                        </td>
                        <td>
                          <strong style={{ color: '#111827', fontSize: '14px' }}>{pl.title}</strong>
                        </td>
                        <td><code>{pl.key}</code></td>
                        <td><span style={{ color: '#4b5563', fontSize: '13px' }}>{pl.subtitle}</span></td>
                        <td>
                          <span className={`${styles.badgeStatus} ${pl.status === 'Active' ? styles.badgeActive : styles.badgeInactive}`}>
                            ● {pl.status}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionGroup}>
                            <button 
                              type="button" 
                              className={`${styles.btnAction} ${styles.btnActionEdit}`}
                              onClick={() => { 
                                setEditingItem({ ...pl }); 
                                setModalType('placeType'); 
                              }}
                              title="Edit Place Type"
                            >
                              <FaEdit /> Edit
                            </button>
                            <button 
                              type="button" 
                              className={`${styles.btnAction} ${styles.btnActionDelete}`}
                              onClick={() => handleDeleteItem(pl.id, 'placeTypes')}
                              title="Delete Place Type"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* 7. Host Steps & Modals Setup Table */}
        {activeTab === 'stepSettings' && (
          <div className="table-responsive">
            <table className={`table table-hover align-middle mb-0 ${styles.masterTable}`}>
              <thead className="table-light">
                <tr>
                  <th style={{ width: '60px' }}>Sr. No.</th>
                  <th>Step Key</th>
                  <th>Type</th>
                  <th>Main Heading / Modal Title</th>
                  <th>Sub-Heading / Modal Subtitle</th>
                  <th>Secondary / Action Label</th>
                  <th>Secondary Sub-Text</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stepSettings
                  .filter(s => 
                    s.step_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (s.subtitle && s.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map((s, idx) => {
                    const isExp = s.step_key.startsWith('exp_');
                    return (
                      <tr key={s.id || idx}>
                        <td><span style={{ fontWeight: '600', color: '#64748b' }}>{idx + 1}</span></td>
                        <td><code>{s.step_key}</code></td>
                        <td>
                          <span style={{
                            background: isExp ? '#f3e8ff' : '#eff6ff',
                            color: isExp ? '#7e22ce' : '#2563eb',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '700',
                            textTransform: 'uppercase'
                          }}>
                            {isExp ? 'Experience' : 'Stay / Home'}
                          </span>
                        </td>
                        <td>
                          <strong style={{ color: '#111827', fontSize: '14px' }}>{s.title}</strong>
                        </td>
                        <td><span style={{ color: '#4b5563', fontSize: '13px' }}>{s.subtitle}</span></td>
                        <td><span style={{ color: '#111827', fontWeight: 600, fontSize: '13px' }}>{s.toggle_label || '-'}</span></td>
                        <td>
                          {s.toggle_subtitle ? (
                            <span style={{ color: '#4b5563', fontSize: '13px' }}>{s.toggle_subtitle}</span>
                          ) : (
                            <span className={`${styles.badgeStatus} ${s.default_state ? styles.badgeActive : styles.badgeInactive}`}>
                              ● {s.default_state ? 'Enabled (ON)' : 'Disabled (OFF)'}
                            </span>
                          )}
                        </td>
                        <td>
                          <div className={styles.actionGroup}>
                            <button 
                              type="button" 
                              className={`${styles.btnAction} ${styles.btnActionEdit}`}
                              onClick={() => { 
                                setEditingItem({ ...s }); 
                                setModalType('stepSetting'); 
                              }}
                              title="Edit Step / Modal Settings"
                            >
                              <FaEdit /> Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

        {/* 8. Step 6 Room Basics Counters Table */}
        {activeTab === 'stepBasics' && (
          <div className="table-responsive">
            <table className={`table table-hover align-middle mb-0 ${styles.masterTable}`}>
              <thead className="table-light">
                <tr>
                  <th style={{ width: '60px' }}>Sr. No.</th>
                  <th>Key</th>
                  <th>Counter Label</th>
                  <th>Default Value</th>
                  <th>Min Value</th>
                  <th>Max Value</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stepBasics
                  .filter(b => 
                    b.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    b.key.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((b, idx) => (
                    <tr key={b.id || idx}>
                      <td><span style={{ fontWeight: '600', color: '#64748b' }}>{idx + 1}</span></td>
                      <td><code>{b.key}</code></td>
                      <td>
                        <strong style={{ color: '#111827', fontSize: '14px' }}>{b.label}</strong>
                      </td>
                      <td><span style={{ fontWeight: 700, color: '#2563eb' }}>{b.default_val}</span></td>
                      <td>{b.min_val}</td>
                      <td>{b.max_val}</td>
                      <td>
                        <span className={`${styles.badgeStatus} ${b.status === 'Active' ? styles.badgeActive : styles.badgeInactive}`}>
                          ● {b.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionGroup}>
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnActionEdit}`}
                            onClick={() => { 
                              setEditingItem({ ...b }); 
                              setModalType('stepBasic'); 
                            }}
                            title="Edit Basic Counter"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnActionDelete}`}
                            onClick={() => handleDeleteItem(b.id, 'stepBasics')}
                            title="Delete Basic Counter"
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

        {/* 9. Step 5 Listing Highlights Table */}
        {activeTab === 'highlights' && (
          <div className="table-responsive">
            <table className={`table table-hover align-middle mb-0 ${styles.masterTable}`}>
              <thead className="table-light">
                <tr>
                  <th style={{ width: '60px' }}>Sr. No.</th>
                  <th>Highlight Label</th>
                  <th>Key Identifier</th>
                  <th>Icon Preview</th>
                  <th>Display Order</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {highlights
                  .filter(h => 
                    h.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    h.key.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((h, idx) => (
                    <tr key={h.id || idx}>
                      <td><span style={{ fontWeight: '600', color: '#64748b' }}>{idx + 1}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className={styles.itemIconCircle}>
                            {renderCategoryIcon(h.icon || h.key, { size: '16px' })}
                          </div>
                          <span style={{ fontWeight: '700', color: '#111111' }}>{h.label}</span>
                        </div>
                      </td>
                      <td><code>{h.key}</code></td>
                      <td>
                        <span style={{ background: '#eff6ff', color: '#2563eb', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                          {h.icon || 'star'}
                        </span>
                      </td>
                      <td><span style={{ fontWeight: 600 }}>{h.display_order}</span></td>
                      <td>
                        <span className={`${styles.badgeStatus} ${h.status === 'Active' ? styles.badgeActive : styles.badgeInactive}`}>
                          ● {h.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionGroup}>
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnActionEdit}`}
                            onClick={() => { 
                              setEditingItem({ ...h }); 
                              setModalType('highlight'); 
                            }}
                            title="Edit Listing Highlight"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnActionDelete}`}
                            onClick={() => handleDeleteItem(h.id, 'highlights')}
                            title="Delete Listing Highlight"
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

        {/* 10. Step 3 Booking Options Table (HostStep3 Step 2) */}
        {activeTab === 'bookingOptions' && (
          <div className="table-responsive">
            <table className={`table table-hover align-middle mb-0 ${styles.masterTable}`}>
              <thead className="table-light">
                <tr>
                  <th style={{ width: '60px' }}>Sr. No.</th>
                  <th>Option Title</th>
                  <th>Key Identifier</th>
                  <th>Icon Preview</th>
                  <th>Badge</th>
                  <th>Description</th>
                  <th>Display Order</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookingOptions
                  .filter(b => 
                    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    b.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (b.description && b.description.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map((b, idx) => (
                    <tr key={b.id || idx}>
                      <td><span style={{ fontWeight: '600', color: '#64748b' }}>{idx + 1}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className={styles.itemIconCircle}>
                            {renderCategoryIcon(b.icon || b.key, { size: '16px' })}
                          </div>
                          <div>
                            <span style={{ fontWeight: '700', color: '#111111' }}>{b.title}</span>
                            {b.badge && (
                              <span style={{ marginLeft: '8px', background: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>
                                {b.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td><code>{b.key}</code></td>
                      <td>
                        <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                          {b.icon || 'calendar'}
                        </span>
                      </td>
                      <td>
                        {b.badge ? <span style={{ fontWeight: 600, color: '#b45309' }}>{b.badge}</span> : <span style={{ color: '#94a3b8' }}>-</span>}
                      </td>
                      <td style={{ maxWidth: '300px', fontSize: '12px', color: '#64748b' }}>
                        {b.description}
                      </td>
                      <td><span style={{ fontWeight: 600 }}>{b.display_order}</span></td>
                      <td>
                        <span className={`${styles.badgeStatus} ${b.status === 'Active' ? styles.badgeActive : styles.badgeInactive}`}>
                          ● {b.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionGroup}>
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnActionEdit}`}
                            onClick={() => { 
                              setEditingItem({ ...b }); 
                              setModalType('bookingOption'); 
                            }}
                            title="Edit Booking Option"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnActionDelete}`}
                            onClick={() => handleDeleteItem(b.id, 'bookingOptions')}
                            title="Delete Booking Option"
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

        {/* 11. Step 4 Discounts Table (HostStep3 Step 4) */}
        {activeTab === 'discounts' && (
          <div className="table-responsive">
            <table className={`table table-hover align-middle mb-0 ${styles.masterTable}`}>
              <thead className="table-light">
                <tr>
                  <th style={{ width: '60px' }}>Sr. No.</th>
                  <th>Discount Title</th>
                  <th>Key Identifier</th>
                  <th>Default % / Value</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Display Order</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {discounts
                  .filter(d => 
                    d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    d.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (d.description && d.description.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map((d, idx) => (
                    <tr key={d.id || idx}>
                      <td><span style={{ fontWeight: '600', color: '#64748b' }}>{idx + 1}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className={styles.itemIconCircle} style={{ background: '#fef2f2', color: '#ef4444' }}>
                            <FaTag size={14} />
                          </div>
                          <span style={{ fontWeight: '700', color: '#111111' }}>{d.title}</span>
                        </div>
                      </td>
                      <td><code>{d.key}</code></td>
                      <td>
                        <span style={{ background: '#eff6ff', color: '#2563eb', padding: '3px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: '700' }}>
                          {d.discount_percentage}%
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', color: d.is_customizable ? '#059669' : '#6b7280', fontWeight: 600 }}>
                          {d.is_customizable ? 'User Editable Input' : 'Fixed Promotion'}
                        </span>
                      </td>
                      <td style={{ maxWidth: '300px', fontSize: '12px', color: '#64748b' }}>
                        {d.description}
                      </td>
                      <td><span style={{ fontWeight: 600 }}>{d.display_order}</span></td>
                      <td>
                        <span className={`${styles.badgeStatus} ${d.status === 'Active' ? styles.badgeActive : styles.badgeInactive}`}>
                          ● {d.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionGroup}>
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnActionEdit}`}
                            onClick={() => { 
                              setEditingItem({ ...d }); 
                              setModalType('discount'); 
                            }}
                            title="Edit Discount"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnActionDelete}`}
                            onClick={() => handleDeleteItem(d.id, 'discounts')}
                            title="Delete Discount"
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

        {/* 12. Step 5 Safety Items Table (HostStep3 Step 5) */}
        {activeTab === 'safetyItems' && (
          <div className="table-responsive">
            <table className={`table table-hover align-middle mb-0 ${styles.masterTable}`}>
              <thead className="table-light">
                <tr>
                  <th style={{ width: '60px' }}>Sr. No.</th>
                  <th>Safety Disclosure Label</th>
                  <th>Key Identifier</th>
                  <th>Requires Details / Modal</th>
                  <th>Display Order</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {safetyItems
                  .filter(s => 
                    s.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    s.key.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((s, idx) => (
                    <tr key={s.id || idx}>
                      <td><span style={{ fontWeight: '600', color: '#64748b' }}>{idx + 1}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className={styles.itemIconCircle} style={{ background: '#fef3c7', color: '#b45309' }}>
                            <FaShieldAlt size={14} />
                          </div>
                          <span style={{ fontWeight: '700', color: '#111111' }}>{s.label}</span>
                        </div>
                      </td>
                      <td><code>{s.key}</code></td>
                      <td>
                        <span style={{ 
                          fontSize: '12px', 
                          fontWeight: 600, 
                          color: s.requires_details ? '#2563eb' : '#64748b',
                          background: s.requires_details ? '#eff6ff' : '#f1f5f9',
                          padding: '3px 8px',
                          borderRadius: '6px'
                        }}>
                          {s.requires_details ? 'Requires Modal & Details' : 'Simple Checkbox'}
                        </span>
                      </td>
                      <td><span style={{ fontWeight: 600 }}>{s.display_order}</span></td>
                      <td>
                        <span className={`${styles.badgeStatus} ${s.status === 'Active' ? styles.badgeActive : styles.badgeInactive}`}>
                          ● {s.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionGroup}>
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnActionEdit}`}
                            onClick={() => { 
                              setEditingItem({ ...s }); 
                              setModalType('safetyItem'); 
                            }}
                            title="Edit Safety Item"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnActionDelete}`}
                            onClick={() => handleDeleteItem(s.id, 'safetyItems')}
                            title="Delete Safety Item"
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

        {/* 11. Home Destinations Slider Table */}
        {activeTab === 'homeDestinations' && (
          <div className="table-responsive">
            {loadingHomeDestinations ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>
                Loading destinations from database...
              </div>
            ) : (
              <table className={`table table-hover align-middle mb-0 ${styles.masterTable}`}>
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '60px' }}>Sr. No.</th>
                    <th>Image</th>
                    <th>Country / Destination</th>
                    <th>Tagline Title</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {homeDestinations
                    .filter(d => 
                      d.country.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      d.title.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((d, idx) => (
                      <tr key={d.id}>
                        <td><span style={{ fontWeight: '600', color: '#64748b' }}>{idx + 1}</span></td>
                        <td>
                          <img 
                            src={d.image} 
                            alt={d.country} 
                            style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} 
                          />
                        </td>
                        <td>
                          <strong style={{ color: '#111827', fontSize: '14px' }}>{d.country}</strong>
                        </td>
                        <td>
                          <span style={{ color: '#4b5563', fontSize: '13px' }}>{d.title}</span>
                        </td>
                        <td>
                          <span style={{ fontWeight: '700', color: '#2563eb' }}>{d.display_order}</span>
                        </td>
                        <td>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: d.status === 'Active' ? '#ecfdf5' : '#fef2f2',
                            color: d.status === 'Active' ? '#10b981' : '#ef4444',
                            padding: '3px 9px',
                            borderRadius: '20px',
                            fontSize: '11.5px',
                            fontWeight: '600'
                          }}>
                            ● {d.status}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionGroup}>
                            <button 
                              type="button" 
                              className={`${styles.btnAction} ${styles.btnActionEdit}`}
                              onClick={() => { 
                                setEditingItem({ ...d }); 
                                setModalType('homeDestination'); 
                              }}
                              title="Edit Destination"
                            >
                              <FaEdit /> Edit
                            </button>
                            <button 
                              type="button" 
                              className={`${styles.btnAction} ${styles.btnActionDelete}`}
                              onClick={() => handleDeleteItem(d.id, 'homeDestinations')}
                              title="Delete Destination"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
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
                    modalType === 'stepBasic' ? 'Step 6 Basics Counter (Guests, Beds...)' :
                    modalType === 'stepSetting' ? 'Step Onboarding Header Settings' :
                    modalType === 'placeType' ? 'Place Type (Host Step 3)' :
                    modalType === 'propertyType' ? 'Property Type' :
                    modalType === 'amenity' ? 'Amenity' :
                    modalType === 'highlight' ? 'Listing Highlight (HostStep2 Step 5)' :
                    modalType === 'bookingOption' ? 'Booking Setting Option (HostStep3 Step 2)' :
                    modalType === 'discount' ? 'Discount Promotion (HostStep3 Step 4)' :
                    modalType === 'safetyItem' ? 'Safety Item (HostStep3 Step 5)' :
                    modalType === 'homeDestination' ? 'Homepage Destination' :
                    modalType === 'location' ? 'City / Location' : 
                    modalType === 'hostService' ? 'Host Service / Experience Category' : 'Homepage Section'
                  }
                </h3>
                <button type="button" className={styles.modalCloseBtn} onClick={() => setModalType(null)}>
                  <FaTimes />
                </button>
              </div>

              <div className={styles.modalBody}>
                {/* Form fields for Step 6 Basics Counter */}
                {modalType === 'stepBasic' && (
                  <>
                    <div className="row g-2">
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Counter Label (Display Name)</label>
                          <input 
                            type="text" 
                            value={editingItem.label} 
                            onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })} 
                            required 
                            className={styles.formInput} 
                            placeholder="e.g. Guests, Bedrooms, Beds, Bathrooms"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Key Identifier</label>
                          <input 
                            type="text" 
                            value={editingItem.key} 
                            onChange={(e) => setEditingItem({ ...editingItem, key: e.target.value })} 
                            required 
                            className={styles.formInput} 
                            placeholder="e.g. guests, bedrooms, beds"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row g-2">
                      <div className="col-4">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Default Value</label>
                          <input 
                            type="number" 
                            value={editingItem.default_val} 
                            onChange={(e) => setEditingItem({ ...editingItem, default_val: parseInt(e.target.value, 10) || 1 })} 
                            required 
                            className={styles.formInput} 
                            min="1"
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Min Allowed</label>
                          <input 
                            type="number" 
                            value={editingItem.min_val} 
                            onChange={(e) => setEditingItem({ ...editingItem, min_val: parseInt(e.target.value, 10) || 1 })} 
                            required 
                            className={styles.formInput} 
                            min="0"
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Max Allowed</label>
                          <input 
                            type="number" 
                            value={editingItem.max_val} 
                            onChange={(e) => setEditingItem({ ...editingItem, max_val: parseInt(e.target.value, 10) || 50 })} 
                            required 
                            className={styles.formInput} 
                            min="1"
                          />
                        </div>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Status</label>
                      <select 
                        value={editingItem.status === 'Active' || editingItem.is_active !== false ? 'Active' : 'Inactive'} 
                        onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value, is_active: e.target.value === 'Active' })} 
                        className={styles.formInput}
                      >
                        <option value="Active">Active (Visible in HostStep1 Step 6)</option>
                        <option value="Inactive">Inactive (Hidden)</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Form fields for Host Steps & Modals Setup */}
                {modalType === 'stepSetting' && (
                  <>
                    <div style={{ marginBottom: '14px', padding: '10px 14px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e40af' }}>
                        Editing Configuration Key: <code>{editingItem.step_key}</code>
                      </span>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        {editingItem.step_key === 'step4_title' ? 'Step 4 Main Title' :
                         editingItem.step_key === 'step3_photos' ? 'Main Photos Heading (Empty state)' :
                         editingItem.step_key === 'step3_modals' ? 'Upload Modal Main Title' :
                         editingItem.step_key === 'step5_location' ? 'Step 5 Main Heading' :
                         'Main Step Heading'}
                      </label>
                      <input 
                        type="text" 
                        value={editingItem.title} 
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} 
                        required 
                        className={styles.formInput} 
                        placeholder="e.g. Now, let's give your house a title"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        {editingItem.step_key === 'step4_title' ? 'Step 4 Sub-Heading / Title Advice' :
                         editingItem.step_key === 'step3_photos' ? 'Sub-Heading / Photos Guidance' :
                         editingItem.step_key === 'step3_modals' ? 'Upload Modal Sub-Notice' :
                         editingItem.step_key === 'step5_location' ? 'Sub-Heading / Privacy Notice' :
                         'Sub-Heading'}
                      </label>
                      <textarea 
                        rows="2"
                        value={editingItem.subtitle} 
                        onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })} 
                        className={styles.formInput} 
                        style={{ height: 'auto', padding: '10px 12px' }}
                        placeholder="e.g. Short titles work best. Have fun with it — you can always change it later."
                      />
                    </div>

                    <div className="row g-2">
                      <div className={editingItem.step_key === 'step5_location' ? "col-6" : "col-12"}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>
                            {editingItem.step_key === 'step4_title' ? 'Maximum Character Limit' :
                             editingItem.step_key === 'step3_photos' ? 'Populated State Heading ("Ta-da! How does this look?")' :
                             editingItem.step_key === 'step3_modals' ? 'Delete Modal Question ("Delete this photo?")' :
                             editingItem.step_key === 'step5_location' ? 'Toggle Button Title' :
                             'Secondary Label'}
                          </label>
                          <input 
                            type="text" 
                            value={editingItem.toggle_label || ''} 
                            onChange={(e) => setEditingItem({ ...editingItem, toggle_label: e.target.value })} 
                            className={styles.formInput} 
                            placeholder="e.g. 50"
                          />
                        </div>
                      </div>

                      {editingItem.step_key === 'step5_location' && (
                        <div className="col-6">
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Default State for Hosts</label>
                            <select 
                              value={editingItem.default_state ? 'true' : 'false'} 
                              onChange={(e) => setEditingItem({ ...editingItem, default_state: e.target.value === 'true' })} 
                              className={styles.formInput}
                            >
                              <option value="true">Enabled (ON by default)</option>
                              <option value="false">Disabled (OFF by default)</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        {editingItem.step_key === 'step3_photos' ? 'Populated State Sub-Text ("Drag to reorder")' :
                         editingItem.step_key === 'step3_modals' ? 'Delete Modal Warning ("Once you delete it, you can\'t get it back.")' :
                         editingItem.step_key === 'step5_location' ? 'Toggle Sub-Text Description' :
                         'Secondary Description'}
                      </label>
                      <input 
                        type="text" 
                        value={editingItem.toggle_subtitle || ''} 
                        onChange={(e) => setEditingItem({ ...editingItem, toggle_subtitle: e.target.value })} 
                        className={styles.formInput} 
                        placeholder="e.g. Drag to reorder"
                      />
                    </div>

                    {editingItem.step_key === 'step5_location' && (
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>'Learn More' Policy Link</label>
                        <input 
                          type="text" 
                          value={editingItem.learn_more_link} 
                          onChange={(e) => setEditingItem({ ...editingItem, learn_more_link: e.target.value })} 
                          className={styles.formInput} 
                          placeholder="e.g. /privacy-policy"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Form fields for Place Type (HostStep1 Step 3) */}
                {modalType === 'placeType' && (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Place Type Title</label>
                      <input 
                        type="text" 
                        value={editingItem.title} 
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} 
                        required 
                        className={styles.formInput} 
                        placeholder="e.g. An entire place, A private room"
                      />
                    </div>
                    <div className="row g-2">
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Key Identifier</label>
                          <input 
                            type="text" 
                            value={editingItem.key} 
                            onChange={(e) => setEditingItem({ ...editingItem, key: e.target.value })} 
                            required 
                            className={styles.formInput} 
                            placeholder="e.g. entire, room, shared"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Icon Identifier</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ 
                              width: '38px', 
                              height: '38px', 
                              borderRadius: '8px', 
                              background: '#eff6ff', 
                              color: '#2563eb', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              fontSize: '18px',
                              border: '1px solid #dbeafe',
                              flexShrink: 0
                            }}>
                              {renderCategoryIcon(editingItem.icon || 'home', { size: '18px' })}
                            </div>
                            <select
                              value={editingItem.icon || 'home'}
                              onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                              className={styles.formInput}
                              style={{ flex: 1 }}
                            >
                              <option value="home">Home / Entire place</option>
                              <option value="door">Door / Private Room</option>
                              <option value="bunkbeds">Bunkbeds / Shared room</option>
                              <option value="apartment">Building / Flat</option>
                              <option value="hotel">Hotel Room</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Subtitle / Description for Hosts</label>
                      <input 
                        type="text" 
                        value={editingItem.subtitle} 
                        onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })} 
                        className={styles.formInput} 
                        placeholder="e.g. Guests have the whole place to themselves."
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Status</label>
                      <select 
                        value={editingItem.status === 'Active' || editingItem.is_active !== false ? 'Active' : 'Inactive'} 
                        onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value, is_active: e.target.value === 'Active' })} 
                        className={styles.formInput}
                      >
                        <option value="Active">Active (Live in HostStep1 Step 3)</option>
                        <option value="Inactive">Inactive (Hidden)</option>
                      </select>
                    </div>
                  </>
                )}

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
                    <div className="row g-2">
                      <div className="col-6">
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
                      </div>
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>React Icon Identifier</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ 
                              width: '38px', 
                              height: '38px', 
                              borderRadius: '8px', 
                              background: '#eff6ff', 
                              color: '#2563eb', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              fontSize: '18px',
                              border: '1px solid #dbeafe',
                              flexShrink: 0
                            }}>
                              {renderCategoryIcon(editingItem.icon || 'home', { size: '18px' })}
                            </div>
                            <select
                              value={editingItem.icon || 'home'}
                              onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                              className={styles.formInput}
                              style={{ flex: 1 }}
                            >
                              <option value="home">Home / House</option>
                              <option value="apartment">Apartment / Flat</option>
                              <option value="barn">Barn</option>
                              <option value="bnb">Bed & breakfast</option>
                              <option value="boat">Boat / Yacht</option>
                              <option value="cabin">Cabin / Chalet</option>
                              <option value="campervan">Campervan / RV</option>
                              <option value="casa">Casa Particular</option>
                              <option value="castle">Castle / Estate</option>
                              <option value="cave">Cave</option>
                              <option value="container">Container</option>
                              <option value="cycladic">Cycladic home</option>
                              <option value="dammuso">Dammuso</option>
                              <option value="dome">Dome</option>
                              <option value="earth_home">Earth home</option>
                              <option value="farm">Farm / Ranch</option>
                              <option value="guesthouse">Guest house</option>
                              <option value="hotel">Hotel / Boutique</option>
                              <option value="houseboat">Houseboat</option>
                              <option value="minsu">Minsu</option>
                              <option value="riad">Riad</option>
                              <option value="ryokan">Ryokan</option>
                              <option value="shepherds-hut">Shepherd’s Hut</option>
                              <option value="tent">Tent</option>
                              <option value="tiny-home">Tiny Home</option>
                              <option value="tower">Tower</option>
                              <option value="tree-house">Treehouse</option>
                              <option value="trullo">Trullo</option>
                              <option value="windmill">Windmill</option>
                              <option value="yurt">Yurt</option>
                            </select>
                          </div>
                        </div>
                      </div>
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
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Status</label>
                      <select 
                        value={editingItem.status === 'Active' || editingItem.is_active !== false ? 'Active' : 'Inactive'} 
                        onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value, is_active: e.target.value === 'Active' })} 
                        className={styles.formInput}
                      >
                        <option value="Active">Active (Live in HostStep1)</option>
                        <option value="Inactive">Inactive (Hidden)</option>
                      </select>
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
                        placeholder="e.g. Air conditioning, Swimming pool, High-Speed Wifi"
                      />
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Key Identifier</label>
                          <input 
                            type="text" 
                            value={editingItem.key || ''} 
                            onChange={(e) => setEditingItem({ ...editingItem, key: e.target.value })} 
                            className={styles.formInput} 
                            placeholder="e.g. ac, wifi, pool"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>React Icon Identifier</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ 
                              width: '38px', 
                              height: '38px', 
                              borderRadius: '8px', 
                              background: '#eff6ff', 
                              color: '#2563eb', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              fontSize: '18px',
                              border: '1px solid #dbeafe',
                              flexShrink: 0
                            }}>
                              {renderCategoryIcon(editingItem.icon || editingItem.key || 'wifi', { size: '18px' })}
                            </div>
                            <select
                              value={editingItem.icon || 'wifi'}
                              onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                              className={styles.formInput}
                              style={{ flex: 1 }}
                            >
                              <option value="wifi">Wifi</option>
                              <option value="snowflake">Air conditioning</option>
                              <option value="kitchen">Kitchen</option>
                              <option value="tv">TV</option>
                              <option value="fridge">Fridge</option>
                              <option value="heating">Heating</option>
                              <option value="hot_water">Hot water</option>
                              <option value="dryer">Tumble dryer</option>
                              <option value="washing_machine">Washing machine</option>
                              <option value="cleaning">Essentials / Cleaning</option>
                              <option value="pool">Pool / Swimming</option>
                              <option value="hottub">Hot tub</option>
                              <option value="patio">Patio / Balcony</option>
                              <option value="bbq">BBQ grill</option>
                              <option value="outdoor_dining">Outdoor dining</option>
                              <option value="firepit">Fire pit</option>
                              <option value="parking">Free parking</option>
                              <option value="beachfront">Beachfront</option>
                              <option value="waterfront">Waterfront</option>
                              <option value="ski_in">Ski-in/ski-out</option>
                              <option value="smoke_alarm">Smoke alarm</option>
                              <option value="first_aid">First aid kit</option>
                              <option value="fire_extinguisher">Fire extinguisher</option>
                              <option value="carbon_monoxide">Carbon monoxide alarm</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Category</label>
                          <select 
                            value={editingItem.category || 'Basics'} 
                            onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })} 
                            className={styles.formInput}
                          >
                            <option value="Basics">Basics</option>
                            <option value="Standout amenities (Features/Popular)">Standout amenities (Features/Popular)</option>
                            <option value="Location">Location</option>
                            <option value="Safety">Safety</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Show as Quick Filter</label>
                          <select 
                            value={editingItem.is_highlight || editingItem.isHighlight ? 'yes' : 'no'} 
                            onChange={(e) => setEditingItem({ ...editingItem, is_highlight: e.target.value === 'yes', isHighlight: e.target.value === 'yes' })} 
                            className={styles.formInput}
                          >
                            <option value="yes">Yes (Highlighted)</option>
                            <option value="no">No (Standard)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Sublabel (Optional explanation)</label>
                      <input 
                        type="text" 
                        value={editingItem.sublabel || ''} 
                        onChange={(e) => setEditingItem({ ...editingItem, sublabel: e.target.value })} 
                        className={styles.formInput} 
                        placeholder="e.g. Towels, bed sheets, soap and toilet paper"
                      />
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Display Order</label>
                          <input 
                            type="number" 
                            value={editingItem.display_order !== undefined ? editingItem.display_order : 0} 
                            onChange={(e) => setEditingItem({ ...editingItem, display_order: parseInt(e.target.value, 10) || 0 })} 
                            className={styles.formInput} 
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Status</label>
                          <select 
                            value={editingItem.status === 'Active' || editingItem.is_active !== false ? 'Active' : 'Inactive'} 
                            onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value, is_active: e.target.value === 'Active' })} 
                            className={styles.formInput}
                          >
                            <option value="Active">Active (Live for Hosts)</option>
                            <option value="Inactive">Inactive (Hidden)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Form fields for Listing Highlight (HostStep2 Step 5) */}
                {modalType === 'highlight' && (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Highlight Label</label>
                      <input 
                        type="text" 
                        value={editingItem.label} 
                        onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })} 
                        required 
                        className={styles.formInput} 
                        placeholder="e.g. Peaceful, Unique, Family-friendly, Stylish"
                      />
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Key Identifier</label>
                          <input 
                            type="text" 
                            value={editingItem.key || ''} 
                            onChange={(e) => setEditingItem({ ...editingItem, key: e.target.value })} 
                            className={styles.formInput} 
                            placeholder="e.g. peaceful, unique, family-friendly"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>React Icon Identifier</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ 
                              width: '38px', 
                              height: '38px', 
                              borderRadius: '8px', 
                              background: '#eff6ff', 
                              color: '#2563eb', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              fontSize: '18px',
                              border: '1px solid #dbeafe',
                              flexShrink: 0
                            }}>
                              {renderCategoryIcon(editingItem.icon || editingItem.key || 'star', { size: '18px' })}
                            </div>
                            <select
                              value={editingItem.icon || 'star'}
                              onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                              className={styles.formInput}
                              style={{ flex: 1 }}
                            >
                              <option value="spa">Peaceful (Spa / Lotus)</option>
                              <option value="star">Unique (Star)</option>
                              <option value="users">Family-friendly (Users / Family)</option>
                              <option value="paint">Stylish (Paint / Design)</option>
                              <option value="map">Central (Map Location)</option>
                              <option value="expand">Spacious (Expand / Large Space)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Display Order</label>
                          <input 
                            type="number" 
                            value={editingItem.display_order !== undefined ? editingItem.display_order : 0} 
                            onChange={(e) => setEditingItem({ ...editingItem, display_order: parseInt(e.target.value, 10) || 0 })} 
                            className={styles.formInput} 
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Status</label>
                          <select 
                            value={editingItem.status === 'Active' || editingItem.is_active !== false ? 'Active' : 'Inactive'} 
                            onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value, is_active: e.target.value === 'Active' })} 
                            className={styles.formInput}
                          >
                            <option value="Active">Active (Live in Step 5)</option>
                            <option value="Inactive">Inactive (Hidden)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Form fields for Booking Option (HostStep3 Step 2) */}
                {modalType === 'bookingOption' && (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Option Title</label>
                      <input 
                        type="text" 
                        value={editingItem.title} 
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} 
                        required 
                        className={styles.formInput} 
                        placeholder="e.g. Approve your first 5 bookings, Use Instant Book"
                      />
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Key Identifier</label>
                          <input 
                            type="text" 
                            value={editingItem.key || ''} 
                            onChange={(e) => setEditingItem({ ...editingItem, key: e.target.value })} 
                            className={styles.formInput} 
                            placeholder="e.g. approve, instant"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Highlight Badge (Optional)</label>
                          <input 
                            type="text" 
                            value={editingItem.badge || ''} 
                            onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })} 
                            className={styles.formInput} 
                            placeholder="e.g. Recommended, Popular, New"
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Description</label>
                      <textarea 
                        rows="2"
                        value={editingItem.description || ''} 
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })} 
                        className={styles.formInput} 
                        placeholder="e.g. Start by reviewing reservation requests, then switch to Instant Book so guests can book automatically."
                      />
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>React Icon Identifier</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ 
                              width: '38px', 
                              height: '38px', 
                              borderRadius: '8px', 
                              background: '#eff6ff', 
                              color: '#16a34a', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              fontSize: '18px',
                              border: '1px solid #dbeafe',
                              flexShrink: 0
                            }}>
                              {renderCategoryIcon(editingItem.icon || editingItem.key || 'calendar', { size: '18px' })}
                            </div>
                            <select
                              value={editingItem.icon || 'calendar'}
                              onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                              className={styles.formInput}
                              style={{ flex: 1 }}
                            >
                              <option value="calendar">Calendar Check (Approve bookings)</option>
                              <option value="bolt">Lightning Bolt (Instant Book)</option>
                              <option value="star">Star / Recommended</option>
                              <option value="home">Home / Direct</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Order</label>
                          <input 
                            type="number" 
                            value={editingItem.display_order !== undefined ? editingItem.display_order : 0} 
                            onChange={(e) => setEditingItem({ ...editingItem, display_order: parseInt(e.target.value, 10) || 0 })} 
                            className={styles.formInput} 
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Status</label>
                          <select 
                            value={editingItem.status === 'Active' || editingItem.is_active !== false ? 'Active' : 'Inactive'} 
                            onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value, is_active: e.target.value === 'Active' })} 
                            className={styles.formInput}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Form fields for Discount (HostStep3 Step 4) */}
                {modalType === 'discount' && (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Discount Title</label>
                      <input 
                        type="text" 
                        value={editingItem.title} 
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} 
                        required 
                        className={styles.formInput} 
                        placeholder="e.g. New listing promotion, Weekly discount"
                      />
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Key Identifier</label>
                          <input 
                            type="text" 
                            value={editingItem.key || ''} 
                            onChange={(e) => setEditingItem({ ...editingItem, key: e.target.value })} 
                            className={styles.formInput} 
                            placeholder="e.g. newListing, lastMinute, weekly, monthly"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Default Discount %</label>
                          <input 
                            type="number" 
                            value={editingItem.discount_percentage !== undefined ? editingItem.discount_percentage : 0} 
                            onChange={(e) => setEditingItem({ ...editingItem, discount_percentage: parseInt(e.target.value, 10) || 0 })} 
                            className={styles.formInput} 
                            placeholder="e.g. 20"
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Description</label>
                      <textarea 
                        rows="2"
                        value={editingItem.description || ''} 
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })} 
                        className={styles.formInput} 
                        placeholder="e.g. Offer 20% off your first 3 bookings"
                      />
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Discount Type / User Input</label>
                          <select 
                            value={editingItem.is_customizable ? 'true' : 'false'} 
                            onChange={(e) => setEditingItem({ ...editingItem, is_customizable: e.target.value === 'true' })} 
                            className={styles.formInput}
                          >
                            <option value="true">User Editable (Host can change % in input)</option>
                            <option value="false">Fixed Promotion (Fixed % badge)</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Order</label>
                          <input 
                            type="number" 
                            value={editingItem.display_order !== undefined ? editingItem.display_order : 0} 
                            onChange={(e) => setEditingItem({ ...editingItem, display_order: parseInt(e.target.value, 10) || 0 })} 
                            className={styles.formInput} 
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Status</label>
                          <select 
                            value={editingItem.status === 'Active' || editingItem.is_active !== false ? 'Active' : 'Inactive'} 
                            onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value, is_active: e.target.value === 'Active' })} 
                            className={styles.formInput}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Form fields for Safety Item (HostStep3 Step 5) */}
                {modalType === 'safetyItem' && (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Safety Disclosure Label</label>
                      <input 
                        type="text" 
                        value={editingItem.label} 
                        onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })} 
                        required 
                        className={styles.formInput} 
                        placeholder="e.g. Exterior security camera present, Noise decibel monitor present"
                      />
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Key Identifier</label>
                          <input 
                            type="text" 
                            value={editingItem.key || ''} 
                            onChange={(e) => setEditingItem({ ...editingItem, key: e.target.value })} 
                            className={styles.formInput} 
                            placeholder="e.g. camera, noise, weapons"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Requires Modal / Description</label>
                          <select 
                            value={editingItem.requires_details ? 'true' : 'false'} 
                            onChange={(e) => setEditingItem({ ...editingItem, requires_details: e.target.value === 'true' })} 
                            className={styles.formInput}
                          >
                            <option value="false">No (Simple Checkbox)</option>
                            <option value="true">Yes (Opens Detail Modal, e.g. Camera)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Display Order</label>
                          <input 
                            type="number" 
                            value={editingItem.display_order !== undefined ? editingItem.display_order : 0} 
                            onChange={(e) => setEditingItem({ ...editingItem, display_order: parseInt(e.target.value, 10) || 0 })} 
                            className={styles.formInput} 
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Status</label>
                          <select 
                            value={editingItem.status === 'Active' || editingItem.is_active !== false ? 'Active' : 'Inactive'} 
                            onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value, is_active: e.target.value === 'Active' })} 
                            className={styles.formInput}
                          >
                            <option value="Active">Active (Live for Hosts)</option>
                            <option value="Inactive">Inactive (Hidden)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Form fields for Home Destination */}
                {modalType === 'homeDestination' && (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Country / Destination Name</label>
                      <input 
                        type="text" 
                        value={editingItem.country} 
                        onChange={(e) => setEditingItem({ ...editingItem, country: e.target.value })} 
                        required 
                        className={styles.formInput} 
                        placeholder="e.g. Maldives, Switzerland, Japan"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Tagline / Title</label>
                      <input 
                        type="text" 
                        value={editingItem.title} 
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} 
                        required 
                        className={styles.formInput} 
                        placeholder="e.g. Prime beach spot, Mountain retreat"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Image URL</label>
                      <input 
                        type="url" 
                        value={editingItem.image} 
                        onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })} 
                        required 
                        className={styles.formInput} 
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <div className="row g-2">
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Display Order</label>
                          <input 
                            type="number" 
                            value={editingItem.display_order !== undefined ? editingItem.display_order : 0} 
                            onChange={(e) => setEditingItem({ ...editingItem, display_order: parseInt(e.target.value, 10) || 0 })} 
                            className={styles.formInput} 
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Status</label>
                          <select 
                            value={editingItem.status === 'Active' || editingItem.is_active !== false ? 'Active' : 'Inactive'} 
                            onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value, is_active: e.target.value === 'Active' })} 
                            className={styles.formInput}
                          >
                            <option value="Active">Active (Visible on Homepage)</option>
                            <option value="Inactive">Inactive (Hidden)</option>
                          </select>
                        </div>
                      </div>
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

                {/* Form fields for Host Services & Experiences */}
                {modalType === 'hostService' && (
                  <>
                    <div className="row g-2">
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Hosting Type</label>
                          <select 
                            value={editingItem.hosting_type} 
                            onChange={(e) => setEditingItem({ ...editingItem, hosting_type: e.target.value })} 
                            className={styles.formInput}
                          >
                            <option value="service">Service (In-Person / On-Demand)</option>
                            <option value="experience">Experience (Activity / Tour)</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>React Icon Identifier</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ 
                              width: '38px', 
                              height: '38px', 
                              borderRadius: '8px', 
                              background: '#eff6ff', 
                              color: '#ff385c', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              fontSize: '18px',
                              border: '1px solid #dbeafe',
                              flexShrink: 0
                            }}>
                              {renderCategoryIcon(editingItem.icon || 'service', { size: '18px' })}
                            </div>
                            <select 
                              value={editingItem.icon || 'service'} 
                              onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })} 
                              className={styles.formInput}
                              style={{ flex: 1 }}
                            >
                              {AVAILABLE_ICONS.map((opt) => (
                                <option key={opt.key} value={opt.key}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Category Name</label>
                      <input 
                        type="text" 
                        value={editingItem.name} 
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} 
                        required 
                        className={styles.formInput} 
                        placeholder="e.g. Catering, Massage, Art and design"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Sub-Services / Sub-Options (Comma separated)</label>
                      <textarea 
                        rows="3"
                        value={editingItem.sub_options_str || ''} 
                        onChange={(e) => setEditingItem({ ...editingItem, sub_options_str: e.target.value })} 
                        className={styles.formInput} 
                        placeholder="e.g. Swedish massage, Deep tissue, Sports massage, Reflexology"
                      />
                      <small style={{ color: '#6b7280', fontSize: '11px', display: 'block', marginTop: '4px' }}>
                        Enter each item separated by commas. These will appear as selectable sub-services for the host.
                      </small>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Status</label>
                      <select 
                        value={editingItem.is_active ? 'active' : 'inactive'} 
                        onChange={(e) => setEditingItem({ ...editingItem, is_active: e.target.value === 'active' })} 
                        className={styles.formInput}
                      >
                        <option value="active">Active (Visible to Hosts in HostSetup)</option>
                        <option value="inactive">Inactive (Hidden from Hosts)</option>
                      </select>
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
