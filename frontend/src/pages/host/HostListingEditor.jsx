import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaCog, 
  FaEye, 
  FaPlus, 
  FaChevronRight, 
  FaImages, 
  FaSnowflake, 
  FaDoorClosed, 
  FaArchive, 
  FaClock, 
  FaUserFriends, 
  FaBellSlash, 
  FaVideo, 
  FaTimes, 
  FaCheckCircle,
  FaEdit,
  FaCalendarAlt,
  FaConciergeBell,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaTrashAlt,
  FaCamera,
  FaTrash,
  FaUserCheck,
  FaAward,
  FaGraduationCap,
  FaExternalLinkAlt,
  FaPhoneAlt,
  FaMinus,
  FaChevronDown,
  FaChevronUp,
  FaCheck,
  FaTrophy,
  FaLink,
  FaHandHoldingHeart,
  FaAirbnb
} from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { FcPortraitMode, FcConferenceCall } from 'react-icons/fc';
import { BsChatLeftText } from 'react-icons/bs';
import { PiSparkle } from 'react-icons/pi';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import styles from '../../components/styles/HostListingEditor.module.css';
import hostSetupStyles from '../../components/styles/HostSetup.module.css';
import VerifyBanner from '../../components/VerifyBanner';
import EditMode from '../guest/EditMode';
import Loader from '../../components/Loader';

function HostListingEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const photoInputRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('Your space');
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPhotoUpdating, setIsPhotoUpdating] = useState(false);

  // Listing Data from Backend
  const [listing, setListing] = useState({
    id: null,
    title: 'Your Listing',
    type: 'Entire place',
    category: 'Stays',
    price: 2000,
    city: 'Jaipur, Rajasthan',
    description: 'Welcome to this cozy place.',
    status: 'Active',
    cover_img: '',
    photos: [],
    amenities: ['Air conditioning', 'Essentials', 'Fridge'],
    discounts: {},
    service_offerings: [],
    business_hours: [],
    max_guests: 4,
    host_name: 'Host',
    created_at: new Date().toISOString()
  });

  // Arrival / Check-in State
  const [checkInStart, setCheckInStart] = useState("3:00 pm");
  const [checkInEnd, setCheckInEnd] = useState("Flexible");
  const [checkoutTime, setCheckoutTime] = useState("11:00 am");
  
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Edit Modals State
  const [editModal, setEditModal] = useState(null); // 'title' | 'description' | 'price' | 'category' | 'host_profile'
  const [showHostProfileModal, setShowHostProfileModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    host_name: '',
    years_experience: 0,
    host_intro: '',
    host_qualifications: '',
    host_recognition: '',
    host_phone: ''
  });
  const [saving, setSaving] = useState(false);

  // Language Selection States (Screenshot reference)
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [availableLanguagesList] = useState([
    'English', 'Hindi', 'Spanish', 'French', 'German', 'Italian', 'Japanese', 
    'Portuguese', 'Russian', 'Chinese', 'Arabic', 'Bengali', 'Marathi', 'Telugu', 
    'Tamil', 'Gujarati', 'Urdu', 'Kannada', 'Punjabi', 'Malayalam'
  ]);
  const [selectedLanguages, setSelectedLanguages] = useState(['English']);

  // Function to persist languages to DB
  const saveLanguagesToDb = async (newLanguages) => {
    setSelectedLanguages(newLanguages);
    setListing(prev => ({ ...prev, languages: newLanguages }));
    if (!listing.id) return;
    try {
      await fetch(`${baseUrl}/listings/${listing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ languages: newLanguages })
      });
      toast.success('Languages updated successfully');
    } catch (err) {
      console.error('Failed to save languages:', err);
      toast.error('Failed to update languages');
    }
  };

  // Accessibility Features States (Screenshot reference)
  const [selectedAccessibility, setSelectedAccessibility] = useState([]);

  // Function to toggle and persist accessibility features to DB
  const toggleAccessibilityFeature = async (featureName) => {
    const isPresent = selectedAccessibility.includes(featureName);
    const updated = isPresent
      ? selectedAccessibility.filter(f => f !== featureName)
      : [...selectedAccessibility, featureName];

    setSelectedAccessibility(updated);
    setListing(prev => ({
      ...prev,
      accessibility_features: updated
    }));

    if (!listing.id) return;
    try {
      await fetch(`${baseUrl}/listings/${listing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessibility_features: updated })
      });
      toast.success(isPresent ? 'Feature removed' : 'Feature added');
    } catch (err) {
      console.error('Failed to save accessibility features:', err);
      toast.error('Failed to update accessibility features');
    }
  };

  // Co-host states & handler
  const [showCoHostInviteModal, setShowCoHostInviteModal] = useState(false);
  const [coHostForm, setCoHostForm] = useState({ name: '', email: '', role: 'Full access' });

  const handleInviteCoHost = async (e) => {
    e?.preventDefault();
    if (!coHostForm.email.trim()) return;

    const currentCoHosts = Array.isArray(listing.co_hosts) ? [...listing.co_hosts] : [];
    const newCoHost = {
      id: Date.now(),
      name: coHostForm.name.trim() || coHostForm.email.split('@')[0],
      email: coHostForm.email.trim(),
      role: coHostForm.role || 'Full access',
      invited_at: new Date().toISOString()
    };
    const updatedCoHosts = [...currentCoHosts, newCoHost];

    setListing(prev => ({ ...prev, co_hosts: updatedCoHosts }));
    setShowCoHostInviteModal(false);
    setCoHostForm({ name: '', email: '', role: 'Full access' });

    if (!listing.id) return;
    try {
      await fetch(`${baseUrl}/listings/${listing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ co_hosts: updatedCoHosts })
      });
      toast.success('Co-host invitation sent');
    } catch (err) {
      console.error('Failed to save co-host:', err);
      toast.error('Failed to invite co-host');
    }
  };

  // Location / Service Area States
  const [showLocationEditModal, setShowLocationEditModal] = useState(false);
  const [mapType, setMapType] = useState('Map'); // 'Map' | 'Satellite'
  const [serviceLocationForm, setServiceLocationForm] = useState({
    travel_preference: 'You travel to guests',
    service_radius_desc: 'Within a 1-hour drive from 1st floor, Vaishali Tower II, 101, Nursery Circle',
    service_address: '1st floor, Vaishali Tower II, 101, Nursery Circle',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India'
  });

  const saveLocationToDb = async (updatedData) => {
    setListing(prev => ({ ...prev, ...updatedData }));
    setShowLocationEditModal(false);
    if (!listing.id) return;
    try {
      await fetch(`${baseUrl}/listings/${listing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      toast.success('Location & service area updated');
    } catch (err) {
      console.error('Failed to save location data:', err);
      toast.error('Failed to update location data');
    }
  };

  // Guest Requirements States
  const [guestRequirementsForm, setGuestRequirementsForm] = useState({
    min_age: 18,
    allow_infants: true
  });
  const [isAgeDropdownOpen, setIsAgeDropdownOpen] = useState(false);

  const saveGuestRequirementsToDb = async (updatedReqs) => {
    setListing(prev => ({ ...prev, ...updatedReqs }));
    setEditModal(null);
    if (!listing.id) return;
    try {
      await fetch(`${baseUrl}/listings/${listing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedReqs)
      });
      toast.success('Guest requirements saved');
    } catch (err) {
      console.error('Failed to save guest requirements:', err);
      toast.error('Failed to save guest requirements');
    }
  };

  // Online Profiles States & Persistence
  const [showAddProfileModal, setShowAddProfileModal] = useState(false);
  const [newProfileLink, setNewProfileLink] = useState('');

  const saveOnlineProfilesToDb = async (updatedLink) => {
    setListing(prev => ({ 
      ...prev, 
      social_link: updatedLink,
      online_profile: updatedLink
    }));
    setShowAddProfileModal(false);
    setNewProfileLink('');
    if (!listing.id) return;
    try {
      await fetch(`${baseUrl}/listings/${listing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ social_link: updatedLink })
      });
      toast.success('Online profile link updated');
    } catch (err) {
      console.error('Failed to save online profile link:', err);
      toast.error('Failed to save online profile');
    }
  };

  // Availability States & Persistence (Matching User's Screenshot Modal)
  const [showSimultaneousModal, setShowSimultaneousModal] = useState(false);
  const [tempSimultaneousCount, setTempSimultaneousCount] = useState(1);

  const getSimultaneousCount = () => {
    const raw = listing.simultaneous_bookings || '1 booking at a time';
    const match = raw.match(/\d+/);
    return match ? Math.max(1, parseInt(match[0], 10)) : 1;
  };

  const saveSimultaneousCountToDb = async (countVal) => {
    const textVal = `${countVal} booking${countVal > 1 ? 's' : ''} at a time`;
    setListing(prev => ({ ...prev, simultaneous_bookings: textVal }));
    setShowSimultaneousModal(false);
    if (!listing.id) return;
    try {
      await fetch(`${baseUrl}/listings/${listing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simultaneous_bookings: textVal })
      });
      toast.success('Availability updated');
    } catch (err) {
      console.error('Failed to save simultaneous bookings:', err);
      toast.error('Failed to update availability');
    }
  };

  // Cancellation Policy Persistence
  const saveCancellationPolicyToDb = async (policyVal) => {
    setListing(prev => ({ ...prev, cancellation_policy: policyVal }));
    if (!listing.id) return;
    try {
      await fetch(`${baseUrl}/listings/${listing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancellation_policy: policyVal })
      });
      toast.success('Cancellation policy updated');
    } catch (err) {
      console.error('Failed to save cancellation policy:', err);
      toast.error('Failed to update cancellation policy');
    }
  };

  // Custom Link State & Persistence
  const [customLinkInput, setCustomLinkInput] = useState('');
  const [copyLinkSuccess, setCopyLinkSuccess] = useState(false);
  const [isSavingCustomLink, setIsSavingCustomLink] = useState(false);

  const saveCustomLinkToDb = async (linkVal) => {
    try {
      setIsSavingCustomLink(true);
      const cleanSlug = (linkVal || '').trim().replace(/^\/+|\/+$/g, '');
      setListing(prev => ({ ...prev, custom_link: cleanSlug }));
      if (listing.id) {
        await fetch(`${baseUrl}/listings/${listing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ custom_link: cleanSlug })
        });
      }
      setEditModal(null);
      toast.success('Custom link saved');
    } catch (err) {
      console.error('Failed to save custom link:', err);
      toast.error('Failed to save custom link');
    } finally {
      setIsSavingCustomLink(false);
    }
  };

  // Photo Detail Screen Modal States (Screenshot matching)
  const [activePhotoDetail, setActivePhotoDetail] = useState(null); // { url, index, isCover }
  const [photoCaptionInput, setPhotoCaptionInput] = useState('');
  const [isSavingPhotoCaption, setIsSavingPhotoCaption] = useState(false);

  const openPhotoDetail = (photoUrl, photoIdx) => {
    const isCover = listing.cover_img ? listing.cover_img === photoUrl : photoIdx === 0;
    const existingCaptions = listing.photo_captions || {};
    const existingCap = existingCaptions[photoUrl] || existingCaptions[photoIdx] || '';
    setActivePhotoDetail({
      url: photoUrl,
      index: photoIdx,
      isCover
    });
    setPhotoCaptionInput(existingCap);
  };

  const savePhotoCaptionToDb = async () => {
    if (!activePhotoDetail || !listing.id) {
      setActivePhotoDetail(null);
      return;
    }
    try {
      setIsSavingPhotoCaption(true);
      const updatedCaptions = {
        ...(listing.photo_captions || {}),
        [activePhotoDetail.url]: photoCaptionInput
      };
      setListing(prev => ({
        ...prev,
        photo_captions: updatedCaptions
      }));

      await fetch(`${baseUrl}/listings/${listing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo_captions: updatedCaptions })
      });
      setActivePhotoDetail(null);
      toast.success('Photo caption saved');
    } catch (err) {
      console.error('Failed to save photo caption:', err);
      toast.error('Failed to save photo caption');
    } finally {
      setIsSavingPhotoCaption(false);
    }
  };

  // Offering Modal States (same flow and UX as HostSetup)
  const [showOfferingModal, setShowOfferingModal] = useState(false);
  const [offeringModalPhase, setOfferingModalPhase] = useState("title"); // 'title' | 'details'
  const [editingOfferingIndex, setEditingOfferingIndex] = useState(null);
  const [offeringForm, setOfferingForm] = useState({
    title: "",
    description: "",
    serviceType: "Swedish massage",
    price: "",
    priceType: "Per guest",
    maxGuests: 1,
    durationHours: 0,
    durationMinutes: 30,
    duration: "30 mins",
    image: "",
  });
  const [activeOfferingDetailModal, setActiveOfferingDetailModal] = useState(null);
  const [tempDescription, setTempDescription] = useState("");
  const [tempDurationHours, setTempDurationHours] = useState(0);
  const [tempDurationMinutes, setTempDurationMinutes] = useState(30);
  const [tempGuests, setTempGuests] = useState(1);
  const [tempPrice, setTempPrice] = useState("");
  const [tempPriceType, setTempPriceType] = useState("Per guest");
  const [tempServiceType, setTempServiceType] = useState("");
  const [showOfferingPriceBreakdown, setShowOfferingPriceBreakdown] = useState(false);

  // Function to persist service offerings to DB
  const saveOfferingsToDb = async (updatedOfferings) => {
    setListing(prev => ({ ...prev, service_offerings: updatedOfferings }));
    if (!listing.id) return;
    try {
      await fetch(`${baseUrl}/listings/${listing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_offerings: updatedOfferings })
      });
      toast.success('Service offerings updated');
    } catch (err) {
      console.error('Failed to save service offerings:', err);
      toast.error('Failed to update service offerings');
    }
  };

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  // Fetch listing data from backend
  useEffect(() => {
    const applyListing = (item) => {
      if (!item) return;
      let rawOfferings = item.service_offerings;
      if (typeof rawOfferings === 'string') {
        try {
          rawOfferings = JSON.parse(rawOfferings);
        } catch (e) {
          rawOfferings = [];
        }
      }
      let parsedOfferings = [];
      if (Array.isArray(rawOfferings)) {
        parsedOfferings = rawOfferings;
      } else if (rawOfferings && typeof rawOfferings === 'object') {
        parsedOfferings = Object.values(rawOfferings);
      }
      
      const parsedHours = Array.isArray(item.business_hours) 
        ? item.business_hours 
        : (typeof item.business_hours === 'string' ? JSON.parse(item.business_hours || '[]') : []);

      const parsedDiscounts = typeof item.discounts === 'object' && item.discounts !== null
        ? item.discounts
        : (typeof item.discounts === 'string' ? JSON.parse(item.discounts || '{}') : {});

      const parsedPhotos = Array.isArray(item.photos) && item.photos.length > 0
        ? item.photos
        : (item.cover_img ? [item.cover_img] : []);

      const parsedAmenities = Array.isArray(item.amenities)
        ? item.amenities
        : (typeof item.amenities === 'string' ? JSON.parse(item.amenities || '[]') : []);

      let parsedItinerary = item.itinerary;
      if (typeof parsedItinerary === 'string') {
        try {
          parsedItinerary = JSON.parse(parsedItinerary);
        } catch (e) {
          parsedItinerary = {};
        }
      }

      if (parsedItinerary && typeof parsedItinerary === 'object' && !Array.isArray(parsedItinerary)) {
        if (parsedItinerary.checkInStart) setCheckInStart(parsedItinerary.checkInStart);
        if (parsedItinerary.checkInEnd) setCheckInEnd(parsedItinerary.checkInEnd);
        if (parsedItinerary.checkoutTime) setCheckoutTime(parsedItinerary.checkoutTime);
      }

      let parsedLanguages = ['English'];
      if (Array.isArray(item.languages)) {
        parsedLanguages = item.languages;
      } else if (typeof item.languages === 'string') {
        try {
          const parsed = JSON.parse(item.languages);
          if (Array.isArray(parsed)) parsedLanguages = parsed;
          else if (item.languages.trim()) parsedLanguages = [item.languages];
        } catch (e) {
          if (item.languages.trim()) parsedLanguages = item.languages.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
      let parsedAccessibility = [];
      if (Array.isArray(item.accessibility_features)) {
        parsedAccessibility = item.accessibility_features;
      } else if (typeof item.accessibility_features === 'string') {
        try {
          const parsed = JSON.parse(item.accessibility_features);
          if (Array.isArray(parsed)) parsedAccessibility = parsed;
          else if (item.accessibility_features.trim()) parsedAccessibility = [item.accessibility_features];
        } catch (e) {
          if (item.accessibility_features.trim()) parsedAccessibility = item.accessibility_features.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
      setSelectedAccessibility(parsedAccessibility);

      let parsedCoHosts = [];
      if (Array.isArray(item.co_hosts)) {
        parsedCoHosts = item.co_hosts;
      } else if (typeof item.co_hosts === 'string') {
        try {
          const parsed = JSON.parse(item.co_hosts);
          if (Array.isArray(parsed)) parsedCoHosts = parsed;
        } catch (e) {
          parsedCoHosts = [];
        }
      }

      setListing({
        ...item,
        photos: parsedPhotos,
        amenities: parsedAmenities,
        service_offerings: parsedOfferings,
        business_hours: parsedHours,
        discounts: parsedDiscounts,
        itinerary: parsedItinerary,
        languages: parsedLanguages,
        accessibility_features: parsedAccessibility,
        co_hosts: parsedCoHosts,
        cover_img: item.cover_img || parsedPhotos[0] || '',
        custom_link: item.custom_link || '',
        photo_captions: typeof item.photo_captions === 'object' && item.photo_captions !== null
          ? item.photo_captions
          : (typeof item.photo_captions === 'string' ? JSON.parse(item.photo_captions || '{}') : {})
      });

      setCustomLinkInput(item.custom_link || '');

      setServiceLocationForm({
        travel_preference: item.travel_preference || 'You travel to guests',
        service_radius_desc: item.service_radius_desc || `Within a 1-hour drive from ${item.street || item.address || '1st floor, Vaishali Tower II, 101, Nursery Circle'}`,
        service_address: item.street || item.address || '1st floor, Vaishali Tower II, 101, Nursery Circle',
        city: item.city || 'Jaipur',
        state: item.state || 'Rajasthan',
        country: item.country || 'India'
      });

      setGuestRequirementsForm({
        min_age: item.min_age !== undefined && item.min_age !== null ? Number(item.min_age) : 18,
        allow_infants: item.allow_infants !== undefined ? Boolean(item.allow_infants) : true
      });

      setEditFormData({
        title: item.title || '',
        description: item.description || '',
        price: item.price || 0,
        category: item.category || '',
        host_name: item.host_name || '',
        years_experience: item.years_experience || 0,
        host_intro: item.host_intro || '',
        host_qualifications: item.host_qualifications || '',
        host_recognition: item.host_recognition || '',
        host_phone: item.host_phone || ''
      });
    };

    const fetchListingData = async () => {
      try {
        setLoading(true);
        let targetId = id;

        // If no ID provided in URL, fetch from /listings and use it directly without a second roundtrip
        if (!targetId || targetId === 'sample') {
          const allRes = await fetch(`${baseUrl}/listings`);
          const allData = await allRes.json();
          if (allData.success && Array.isArray(allData.data) && allData.data.length > 0) {
            const latestService = allData.data.slice().reverse().find(l => (l.type || '').toLowerCase().includes('service')) || allData.data[allData.data.length - 1];
            applyListing(latestService || allData.data[0]);
          }
        } else {
          const res = await fetch(`${baseUrl}/listings/${targetId}`);
          const data = await res.json();
          if (data.success && data.data) {
            applyListing(data.data);
          }
        }
      } catch (err) {
        console.error('Error fetching listing in editor:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListingData();
  }, [id, location.key]);

  useEffect(() => {
    if (isOffcanvasOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOffcanvasOpen]);

  // Check if current listing is a Service
  const isService = (listing.type || '').toLowerCase().includes('service') ||
    ['chef', 'hairstyling', 'make-up', 'massage', 'personal training', 'photography', 'prepared meals', 'spa treatments', 'catering'].some(
      s => (listing.category || '').toLowerCase().includes(s)
    );

  // Check if current listing is an Experience
  const isExperience = (listing.type || '').toLowerCase().includes('experience') ||
    ['art and design', 'fitness and wellness', 'food and drink', 'history and culture', 'nature and outdoors'].some(
      e => (listing.category || '').toLowerCase().includes(e)
    );

  // Save changes handler for modals
  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!listing.id) return;
    try {
      setSaving(true);
      const res = await fetch(`${baseUrl}/listings/${listing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setListing(prev => ({
          ...prev,
          title: editFormData.title,
          description: editFormData.description,
          price: editFormData.price,
          category: editFormData.category,
          host_name: editFormData.host_name,
          years_experience: editFormData.years_experience,
          host_intro: editFormData.host_intro,
          host_qualifications: editFormData.host_qualifications,
          host_recognition: editFormData.host_recognition,
          host_phone: editFormData.host_phone,
          experience_description: editFormData.experience_description,
          degree: editFormData.degree,
          career_highlight: editFormData.career_highlight
        }));
        if (['experience_detail', 'degree_detail', 'career_highlight_detail'].includes(editModal)) {
          setEditModal('qualifications');
        } else {
          setEditModal(null);
        }
        toast.success('Listing details updated');
      }
    } catch (err) {
      console.error('Failed to update listing:', err);
      toast.error('Failed to update listing');
    } finally {
      setSaving(false);
    }
  };

  // Save Arrival Guide Changes
  const [arrivalSaving, setArrivalSaving] = useState(false);
  const handleSaveArrivalTimes = async () => {
    if (!listing.id) return;
    try {
      setArrivalSaving(true);
      const res = await fetch(`${baseUrl}/listings/${listing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itinerary: {
            checkInStart,
            checkInEnd,
            checkoutTime
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Arrival times updated');
      }
    } catch (err) {
      console.error('Failed to save arrival times:', err);
      toast.error('Failed to update arrival times');
    } finally {
      setArrivalSaving(false);
    }
  };

  // Permanently Remove / Delete Listing
  const handleRemoveListing = async () => {
    if (!listing.id) return;
    if (window.confirm('Are you sure you want to permanently remove this listing?')) {
      try {
        await fetch(`${baseUrl}/listings/${listing.id}`, { method: 'DELETE' });
        toast.success('Listing permanently removed');
        navigate('/hosting/listings');
      } catch (err) {
        console.error('Failed to remove listing:', err);
        toast.error('Failed to remove listing');
      }
    }
  };

  // Upload new photos to listing
  const handleUploadNewPhotos = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !listing.id) return;
    
    try {
      setIsPhotoUpdating(true);
      const readAsDataUrl = (file) => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      const newUrls = await Promise.all(files.map(readAsDataUrl));
      const updatedPhotos = [...(listing.photos || []), ...newUrls];
      const updatedCover = listing.cover_img || updatedPhotos[0];

      // Update backend
      const res = await fetch(`${baseUrl}/listings/${listing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photos: updatedPhotos,
          cover_img: updatedCover
        })
      });
      const data = await res.json();
      if (data.success) {
        setListing(prev => ({
          ...prev,
          photos: updatedPhotos,
          cover_img: updatedCover
        }));
        toast.success('Photos uploaded successfully');
      }
    } catch (err) {
      console.error('Error uploading photos:', err);
      toast.error('Failed to upload photos');
    } finally {
      setIsPhotoUpdating(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  // Delete photo from listing
  const handleDeletePhoto = async (indexToDelete) => {
    if (!listing.id) return;
    if (!window.confirm('Delete this photo from listing?')) return;

    try {
      setIsPhotoUpdating(true);
      const updatedPhotos = (listing.photos || []).filter((_, idx) => idx !== indexToDelete);
      const updatedCover = updatedPhotos.length > 0 ? updatedPhotos[0] : '';

      const res = await fetch(`${baseUrl}/listings/${listing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photos: updatedPhotos,
          cover_img: updatedCover
        })
      });
      const data = await res.json();
      if (data.success) {
        setListing(prev => ({
          ...prev,
          photos: updatedPhotos,
          cover_img: updatedCover
        }));
        toast.success('Photo deleted');
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
      toast.error('Failed to delete photo');
    } finally {
      setIsPhotoUpdating(false);
    }
  };

  const hasChanges = checkInStart !== "3:00 pm" || checkInEnd !== "Flexible" || checkoutTime !== "11:00 am";

  if (loading) {
    return <Loader fullScreen={true} variant="airbnb" text="Loading listing..." />;
  }

  return (
    <div className={`container-fluid p-0 ${styles.editorPage}`}>
      <VerifyBanner />
      <div className="row w-100 m-0 flex-grow-1" style={{ overflow: 'hidden' }}>
        
        {/* Left Sidebar (Scrollable) */}
        <div className={`col-lg-4 ${styles.leftSidebar}`}>
          {!isSettingsOpen ? (
            <>
          <div className={styles.headerRow}>
            <button className={styles.backBtn} onClick={() => navigate('/hosting/listings')}>
              <FaArrowLeft size={14} />
            </button>
            <h1 className={styles.pageTitle}>Listing editor</h1>
          </div>

          <div className={styles.tabsContainer}>
            <div className={styles.tabsGroup}>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'Your space' ? styles.active : ''}`}
                onClick={() => setActiveTab('Your space')}
              >
                {isService ? 'Your service' : isExperience ? 'Your experience' : 'Your space'}
              </button>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'Arrival guide' ? styles.active : ''}`}
                onClick={() => setActiveTab('Arrival guide')}
              >
                {isService ? 'Service schedule' : 'Arrival guide'}
              </button>
            </div>
            <button className={styles.settingsBtn} onClick={() => setIsSettingsOpen(true)} title="Settings">
              <FaCog size={16} />
            </button>
          </div>

          {activeTab === 'Your space' && (
            <>

          {/* 1. Review required changes card (Screenshot 1) / Steps to publish */}
          {isService ? (
            <div 
              className={styles.reviewNoticeCard} 
              onClick={() => setIsOffcanvasOpen(true)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#c13515', display: 'inline-block' }}></span>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#222222' }}>Review required changes</span>
                </div>
                <FaChevronRight size={12} color="#222222" />
              </div>
              <p style={{ fontSize: '13px', color: '#717171', margin: 0, lineHeight: '1.4' }}>
                Make sure to update any unapproved content before you resubmit for review.
              </p>
            </div>
          ) : (
            <div className={styles.cardItem} style={{cursor: 'pointer'}} onClick={() => setIsOffcanvasOpen(true)}>
              <div className={styles.cardFlex}>
                <div className={styles.cardIconBadge}>
                  <span className={styles.badgeDark}>
                    {listing.status === 'Active' ? '✓' : '1'}
                  </span>
                  <span>{listing.status === 'Active' ? '🎉' : '🛡️'}</span>
                </div>
                <div>
                  <h3 className={styles.cardTitle}>
                    {listing.status === 'Active' ? 'Listing is Published & Live' : 'Complete steps to publish'}
                  </h3>
                  <p className={styles.cardSub}>
                    {listing.status === 'Active' ? 'Status: Active on Airbnb' : 'Required to publish'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. Photo Tour Overview Card (Airbnb Style Overlapping Photo Stack) */}
          <div 
            className={`${styles.cardItem} ${styles.editableCard}`}
            style={{cursor: 'pointer', padding: '24px'}}
            onClick={() => {
              if (listing.id) {
                navigate(`/hosting/listing-editor/${listing.id}/all-photos`);
              } else {
                navigate('/hosting/listing-editor/all-photos');
              }
            }}
            title="Click to manage all photos"
          >
            <h3 className={styles.cardTitleLg} style={{fontSize: '18px', fontWeight: '600', marginBottom: '4px'}}>
              Photos
            </h3>
            <p className={styles.cardSub} style={{fontSize: '15px', color: '#717171', marginBottom: '16px'}}>
              {(listing.photos || []).length} photos
            </p>
            
            {/* Dynamic visual representation of layered 3 overlapping cards */}
            <div className={styles.layeredPhotoStack}>
              {(() => {
                const photos = Array.isArray(listing.photos) && listing.photos.length > 0
                  ? listing.photos
                  : (listing.cover_img ? [listing.cover_img] : []);
                
                if (photos.length === 0) {
                  return (
                    <div style={{
                      width: '100%',
                      height: '110px',
                      borderRadius: '12px',
                      border: '1px dashed #d1d5db',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      color: '#717171',
                      background: '#fafafa'
                    }}>
                      <FaCamera size={20} color="#9ca3af" />
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Add service photos</span>
                    </div>
                  );
                }

                const cover = listing.cover_img || photos[0];
                const otherPhotos = photos.filter(p => p !== cover);
                const leftPhoto = otherPhotos[0] || photos[1] || cover;
                const centerPhoto = cover;
                const rightPhoto = otherPhotos[1] || photos[2] || otherPhotos[0] || cover;

                return (
                  <>
                    {/* Left Layered Photo */}
                    <div className={`${styles.stackCardBase} ${styles.stackCardLeft}`}>
                      <img 
                        src={leftPhoto} 
                        alt="Left thumbnail" 
                        className={styles.stackCardImg}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>

                    {/* Center Cover Photo (Elevated front) */}
                    <div className={`${styles.stackCardBase} ${styles.stackCardCenter}`}>
                      <img 
                        src={centerPhoto} 
                        alt="Center cover" 
                        className={styles.stackCardImg}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>

                    {/* Right Layered Photo */}
                    <div className={`${styles.stackCardBase} ${styles.stackCardRight}`}>
                      <img 
                        src={rightPhoto} 
                        alt="Right thumbnail" 
                        className={styles.stackCardImg}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* 3. Title Card (Editable) */}
          <div 
            className={`${styles.cardItem} ${styles.editableCard}`} 
            style={{
              cursor: 'pointer',
              border: editModal === 'title' ? '2px solid #222222' : '1px solid #ebebeb',
              backgroundColor: editModal === 'title' ? '#fcfcfc' : '#ffffff'
            }}
            onClick={() => {
              setEditFormData(prev => ({ ...prev, title: listing.title || '' }));
              setEditModal(editModal === 'title' ? null : 'title');
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h3 className={styles.cardTitleLg}>Title</h3>
              <FaEdit size={14} color="#717171" />
            </div>
            <p className={styles.cardSub}>{listing.title || 'Untitled Listing'}</p>
          </div>

          {/* 3.5. Expertise Card (Directly below Title - Editable in Right Panel) */}
          <div 
            className={`${styles.cardItem} ${styles.editableCard}`} 
            style={{
              cursor: 'pointer',
              border: editModal === 'expertise' ? '2px solid #222222' : '1px solid #ebebeb',
              backgroundColor: editModal === 'expertise' ? '#fcfcfc' : '#ffffff'
            }}
            onClick={() => {
              setEditFormData(prev => ({ ...prev, host_qualifications: listing.host_qualifications || '' }));
              setEditModal(editModal === 'expertise' ? null : 'expertise');
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h3 className={styles.cardTitleLg}>Expertise</h3>
              <FaEdit size={14} color="#717171" />
            </div>
            <p className={styles.cardSub}>
              {listing.host_qualifications || 'I focus on thoughtful styling details to create polished hair looks.'}
            </p>
          </div>
          
          {/* 4. Offerings Card (Directly below Expertise - Screenshot Design) */}
          <div 
            className={`${styles.cardItem} ${styles.editableCard}`}
            style={{
              cursor: 'pointer',
              border: editModal === 'offerings' ? '2px solid #222222' : '1px solid #ebebeb',
              backgroundColor: editModal === 'offerings' ? '#fcfcfc' : '#ffffff'
            }}
            onClick={() => {
              setEditModal(editModal === 'offerings' ? null : 'offerings');
            }}
          >
            <h3 className={styles.cardTitleLg} style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              Offerings
            </h3>

            {(() => {
              const offerings = Array.isArray(listing.service_offerings) ? listing.service_offerings : [];
              if (offerings.length === 0) {
                return (
                  <p className={styles.cardSub} style={{ color: '#717171', margin: '4px 0 0' }}>
                    No offerings added yet. Click to add your offerings.
                  </p>
                );
              }

              const primary = offerings[0];
              const primaryName = primary.title || primary.name || 'Untitled Offering';
              const primaryPrice = primary.price || primary.price_per_guest || 0;
              const photo = primary.image || (listing.photos && listing.photos[0]) || listing.cover_img;
              const statusText = primary.status || (listing.status === 'Active' ? 'Active' : 'Offer not approved');
              const isApproved = statusText.toLowerCase().includes('active') || statusText.toLowerCase().includes('approved');

              return (
                <div>
                  <div className={styles.offeringPreviewRow}>
                    {photo ? (
                      <img 
                        src={photo} 
                        alt={primaryName} 
                        className={styles.offeringThumb}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className={styles.offeringThumb} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7f7' }}>
                        <FaConciergeBell size={18} color="#717171" />
                      </div>
                    )}
                    <div className={styles.offeringInfoCol}>
                      <span className={styles.offeringMainName}>{primaryName}</span>
                      <span className={styles.offeringMainPrice}>₹{primaryPrice} / guest</span>
                    </div>
                  </div>

                  <div className={styles.offeringStatusBadge}>
                    <span 
                      className={styles.statusRedDot} 
                      style={{ backgroundColor: isApproved ? '#008a05' : '#c13515' }}
                    ></span>
                    <span style={{ color: isApproved ? '#008a05' : '#c13515' }}>{statusText}</span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Services Specific Listing Cards (Matching Reference Screenshots 1, 2, 3, 4, 5) */}
          {isService ? (
            <>
              {/* 5. About the host (Screenshot 2) */}
              <div 
                className={`${styles.cardItem} ${styles.editableCard}`} 
                style={{
                  padding: '24px 24px', 
                  cursor: 'pointer', 
                  transition: 'all 0.2s ease',
                  border: editModal === 'edit_mode' ? '2px solid #222222' : '1px solid #ebebeb',
                  backgroundColor: editModal === 'edit_mode' ? '#fcfcfc' : '#ffffff'
                }}
                onClick={() => {
                  setEditModal(editModal === 'edit_mode' ? null : 'edit_mode');
                }}
                title="Click to view and edit host profile"
              >
                <h3 className={styles.cardTitleLg} style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '600', color: '#222222' }}>
                  About the host
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '8px 0 16px 0' }}>
                  <div style={{ position: 'relative', marginBottom: '16px' }}>
                    {listing.host_avatar || user?.avatar ? (
                      <img 
                        src={listing.host_avatar || user?.avatar} 
                        alt={listing.host_name || user?.name || user?.firstName || 'Host'} 
                        className={styles.serviceRoundAvatar}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div style={{
                        width: '90px', 
                        height: '90px', 
                        borderRadius: '50%', 
                        backgroundColor: '#222222', 
                        color: '#ffffff', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '32px', 
                        fontWeight: '700'
                      }}>
                        {((listing.host_name || user?.name || user?.firstName || 'H')[0]).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#222222', margin: '0 0 4px 0' }}>
                    {listing.host_name || user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Host')}
                  </h4>
                  <p style={{ fontSize: '14px', color: '#717171', margin: 0, fontWeight: '400' }}>
                    Host
                  </p>
                </div>
              </div>

              {/* 6. Languages (Screenshot 2) */}
              <div 
                className={`${styles.cardItem} ${styles.editableCard}`}
                style={{ 
                  cursor: 'pointer',
                  border: editModal === 'languages' ? '2px solid #222222' : '1px solid #ebebeb',
                  backgroundColor: editModal === 'languages' ? '#fcfcfc' : '#ffffff'
                }}
                onClick={() => {
                  setEditFormData(prev => ({ ...prev, languages: listing.languages || 'English' }));
                  setEditModal(editModal === 'languages' ? null : 'languages');
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className={styles.cardTitleLg}>Languages</h3>
                  <FaEdit size={14} color="#717171" />
                </div>
                <p className={styles.cardSub}>
                  {Array.isArray(listing.languages) ? listing.languages.join(', ') : listing.languages || 'English'}
                </p>
              </div>

              {/* 7. Accessibility features (Screenshot 3 & new user screenshots) */}
              <div 
                className={`${styles.cardItem} ${styles.editableCard}`}
                style={{ 
                  cursor: 'pointer',
                  border: editModal === 'accessibility' ? '2px solid #222222' : '1px solid #ebebeb',
                  backgroundColor: editModal === 'accessibility' ? '#fcfcfc' : '#ffffff'
                }}
                onClick={() => {
                  setEditModal(editModal === 'accessibility' ? null : 'accessibility');
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className={styles.cardTitleLg}>Accessibility features</h3>
                  <FaEdit size={14} color="#717171" />
                </div>
                {selectedAccessibility && selectedAccessibility.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                    {selectedAccessibility.map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaHandHoldingHeart size={16} color="#222222" />
                        <span style={{ fontSize: '14px', color: '#222222', fontWeight: 500 }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.cardSub}>Add details</p>
                )}
              </div>

              {/* 8. Qualifications (Screenshot 3) */}
              <div 
                className={`${styles.cardItem} ${styles.editableCard}`}
                style={{ 
                  cursor: 'pointer',
                  border: ['qualifications', 'experience_detail', 'degree_detail', 'career_highlight_detail'].includes(editModal) ? '2px solid #222222' : '1px solid #ebebeb',
                  backgroundColor: ['qualifications', 'experience_detail', 'degree_detail', 'career_highlight_detail'].includes(editModal) ? '#fcfcfc' : '#ffffff'
                }}
                onClick={() => {
                  setEditFormData(prev => ({ 
                    ...prev, 
                    host_qualifications: listing.host_qualifications || '',
                    host_recognition: listing.host_recognition || '',
                    years_experience: listing.years_experience || 0
                  }));
                  setEditModal(editModal === 'qualifications' ? null : 'qualifications');
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 className={styles.cardTitleLg} style={{ margin: 0 }}>Qualifications</h3>
                  <FaEdit size={14} color="#717171" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Experience row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div className={styles.serviceCardIconBox}>
                      <FaTrophy size={18} color="#222222" />
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#222222' }}>Experience</div>
                      <div style={{ fontSize: '13px', color: '#717171' }}>
                        {listing.years_experience ? `${listing.years_experience} years` : (listing.experience_description || 'f')}
                      </div>
                    </div>
                  </div>

                  {/* Degree row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div className={styles.serviceCardIconBox}>
                      <FaGraduationCap size={20} color="#222222" />
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#222222' }}>Degree</div>
                      <div style={{ fontSize: '13px', color: '#717171' }}>
                        {listing.host_recognition || listing.degree || 'f'}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#c13515', display: 'inline-block' }}></span>
                  <span style={{ fontSize: '13px', color: '#c13515', fontWeight: '500' }}>Qualifications not approved</span>
                </div>
              </div>

              {/* 9. Co-hosts (Screenshot 3) */}
              <div 
                className={`${styles.cardItem} ${styles.editableCard}`}
                style={{ 
                  cursor: 'pointer',
                  border: editModal === 'co_hosts' ? '2px solid #222222' : '1px solid #ebebeb',
                  backgroundColor: editModal === 'co_hosts' ? '#fcfcfc' : '#ffffff'
                }}
                onClick={() => {
                  setEditModal(editModal === 'co_hosts' ? null : 'co_hosts');
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className={styles.cardTitleLg}>Co-hosts</h3>
                  <FaEdit size={14} color="#717171" />
                </div>
                <p className={styles.cardSub}>
                  {listing.co_hosts && listing.co_hosts.length > 0 ? `${listing.co_hosts.length} co-host(s)` : 'Add details'}
                </p>
              </div>

              {/* 10. Location (Screenshot 3) */}
              <div 
                className={`${styles.cardItem} ${styles.editableCard}`}
                style={{ 
                  cursor: 'pointer',
                  border: editModal === 'location' ? '2px solid #222222' : '1px solid #ebebeb',
                  backgroundColor: editModal === 'location' ? '#fcfcfc' : '#ffffff'
                }}
                onClick={() => {
                  setEditFormData(prev => ({ ...prev, city: listing.city || '' }));
                  setEditModal(editModal === 'location' ? null : 'location');
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 className={styles.cardTitleLg} style={{ margin: 0 }}>Location</h3>
                  <FaEdit size={14} color="#717171" />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div className={styles.serviceMapPreviewThumb}>
                    <FaMapMarkerAlt size={20} color="#16a34a" />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#222222' }}>
                      {listing.travel_preference || 'You travel to guests'}
                    </div>
                    <div style={{ fontSize: '13px', color: '#717171' }}>
                      {listing.city || 'Danta Ramgarh'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 11. Guest requirements (Screenshot 4) */}
              <div 
                className={`${styles.cardItem} ${styles.editableCard}`}
                style={{ 
                  cursor: 'pointer',
                  border: editModal === 'guest_requirements' ? '2px solid #222222' : '1px solid #ebebeb',
                  backgroundColor: editModal === 'guest_requirements' ? '#fcfcfc' : '#ffffff'
                }}
                onClick={() => {
                  setEditModal(editModal === 'guest_requirements' ? null : 'guest_requirements');
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 className={styles.cardTitleLg} style={{ margin: 0 }}>Guest requirements</h3>
                  <FaEdit size={14} color="#717171" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FaUserFriends size={16} color="#222222" />
                    <span style={{ fontSize: '14px', color: '#222222' }}>
                      Minimum age: {listing.min_age || 18}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FaCheck size={14} color="#222222" />
                    <span style={{ fontSize: '14px', color: '#222222' }}>
                      {listing.allow_infants !== false ? 'Parents can bring children under 2' : 'No children under 2'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 12. Online profiles (Screenshot 4) */}
              <div 
                className={`${styles.cardItem} ${styles.editableCard}`}
                style={{ 
                  cursor: 'pointer',
                  border: editModal === 'online_profiles' ? '2px solid #222222' : '1px solid #ebebeb',
                  backgroundColor: editModal === 'online_profiles' ? '#fcfcfc' : '#ffffff'
                }}
                onClick={() => {
                  setEditFormData(prev => ({ ...prev, host_phone: listing.host_phone || '' }));
                  setEditModal(editModal === 'online_profiles' ? null : 'online_profiles');
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 className={styles.cardTitleLg} style={{ margin: 0 }}>Online profiles</h3>
                  <FaEdit size={14} color="#717171" />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div className={styles.serviceCardIconBox}>
                    <FaLink size={16} color="#222222" />
                  </div>
                  <div style={{ fontSize: '14px', color: '#222222', wordBreak: 'break-all' }}>
                    {listing.social_link || listing.online_profile || 'f'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#c13515', display: 'inline-block' }}></span>
                  <span style={{ fontSize: '13px', color: '#c13515', fontWeight: '500' }}>Online profiles not approved</span>
                </div>
              </div>

              {/* 13. Availability (Screenshot 4 & 5) */}
              <div 
                className={`${styles.cardItem} ${styles.editableCard}`}
                style={{ 
                  cursor: 'pointer',
                  border: editModal === 'availability' ? '2px solid #222222' : '1px solid #ebebeb',
                  backgroundColor: editModal === 'availability' ? '#fcfcfc' : '#ffffff'
                }}
                onClick={() => {
                  setEditModal(editModal === 'availability' ? null : 'availability');
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className={styles.cardTitleLg}>Availability</h3>
                  <FaEdit size={14} color="#717171" />
                </div>
                <p className={styles.cardSub}>
                  Simultaneous bookings: {listing.simultaneous_bookings || '1 at a time'}
                </p>
              </div>

              {/* 14. Cancellation policy (Screenshot 4 & 5) */}
              <div 
                className={`${styles.cardItem} ${styles.editableCard}`}
                style={{ 
                  cursor: 'pointer',
                  border: editModal === 'cancellation_policy' ? '2px solid #222222' : '1px solid #ebebeb',
                  backgroundColor: editModal === 'cancellation_policy' ? '#fcfcfc' : '#ffffff'
                }}
                onClick={() => {
                  setEditModal(editModal === 'cancellation_policy' ? null : 'cancellation_policy');
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className={styles.cardTitleLg}>Cancellation policy</h3>
                  <FaEdit size={14} color="#717171" />
                </div>
                <p className={styles.cardSub}>
                  {listing.cancellation_policy || '1 day'}
                </p>
              </div>

              {/* 15. Custom link (Screenshot 5) */}
              <div 
                className={`${styles.cardItem} ${styles.editableCard}`}
                style={{ 
                  cursor: 'pointer',
                  border: editModal === 'custom_link' ? '2px solid #222222' : '1px solid #ebebeb',
                  backgroundColor: editModal === 'custom_link' ? '#fcfcfc' : '#ffffff'
                }}
                onClick={() => {
                  if (editModal !== 'custom_link') {
                    setCustomLinkInput(listing.custom_link || '');
                  }
                  setEditModal(editModal === 'custom_link' ? null : 'custom_link');
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className={styles.cardTitleLg}>Custom link</h3>
                  <FaEdit size={14} color="#717171" />
                </div>
                <p className={styles.cardSub}>
                  {listing.custom_link ? `airbnb.co.in/sv/${listing.custom_link}` : 'Add details'}
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Fallback Non-Service (Stays / Property) Cards */}
              {/* 5. Type & Category Card */}
              <div 
                className={`${styles.cardItem} ${styles.editableCard}`}
                style={{
                  cursor: 'pointer',
                  border: editModal === 'property_type' ? '2px solid #222222' : '1px solid #ebebeb',
                  backgroundColor: editModal === 'property_type' ? '#fcfcfc' : '#ffffff'
                }}
                onClick={() => {
                  setEditFormData(prev => ({ 
                    ...prev, 
                    type: listing.type || 'Entire place',
                    category: listing.category || 'Trending'
                  }));
                  setEditModal(editModal === 'property_type' ? null : 'property_type');
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <h3 className={styles.cardTitleLg}>
                    {isExperience ? 'Experience Category' : 'Property type'}
                  </h3>
                  <FaEdit size={14} color="#717171" />
                </div>
                <p className={styles.cardSub}>
                  {listing.category ? `${listing.category} (${listing.type})` : listing.type || 'Entire place'}
                </p>
              </div>

              {/* 6. Pricing Card */}
              <div 
                className={`${styles.cardItem} ${styles.editableCard}`}
                style={{cursor: 'pointer'}}
                onClick={() => {
                  setEditFormData(prev => ({ ...prev, price: Number(listing.price) || 0 }));
                  setEditModal('price');
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <h3 className={styles.cardTitleLg}>Pricing</h3>
                  <FaEdit size={14} color="#717171" />
                </div>
                <p className={styles.cardSub}>
                  ₹{Number(listing.price || 0).toLocaleString()} per night
                </p>
              </div>

              {/* 8. Discounts Card */}
              <div className={styles.cardItem}>
                <h3 className={styles.cardTitleLg}>Discounts</h3>
                {listing.discounts && Object.keys(listing.discounts).length > 0 ? (
                  <>
                    {listing.discounts.limitedTime && (
                      <p className={styles.cardSub} style={{marginBottom: '4px'}}>
                        {listing.discounts.limitedTime}% limited-time promotional discount
                      </p>
                    )}
                    {listing.discounts.earlyBird && (
                      <p className={styles.cardSub} style={{marginBottom: '4px'}}>
                        20% early-bird discount (booked 3+ weeks in advance)
                      </p>
                    )}
                    {listing.discounts.largeGroup && (
                      <p className={styles.cardSub}>
                        {listing.discounts.largeGroupDiscount || 10}% large group discount ({listing.discounts.minGuests || 4}+ guests)
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className={styles.cardSub} style={{marginBottom: '4px'}}>10% weekly discount</p>
                    <p className={styles.cardSub}>20% monthly discount</p>
                  </>
                )}
              </div>

              {/* 9. Description Card */}
              <div 
                className={`${styles.cardItem} ${styles.editableCard}`}
                style={{cursor: 'pointer'}}
                onClick={() => {
                  setEditFormData(prev => ({ ...prev, description: listing.description || '' }));
                  setEditModal('description');
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <h3 className={styles.cardTitleLg}>Description</h3>
                  <FaEdit size={14} color="#717171" />
                </div>
                <p className={styles.cardSub}>
                  {listing.description || 'Add an inspiring description for your listing.'}
                </p>
              </div>

              {/* 10. Number of Guests */}
              <div className={styles.cardItem}>
                <h3 className={styles.cardTitleLg}>Number of guests</h3>
                <p className={styles.cardSub}>{listing.max_guests || 4} guests maximum</p>
              </div>

              {/* 11. Amenities Card */}
              <div className={styles.cardItem}>
                 <h3 className={styles.cardTitleLg}>Amenities</h3>
                 <div style={{display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px'}}>
                   {Array.isArray(listing.amenities) && listing.amenities.length > 0 ? (
                     listing.amenities.map((am, i) => (
                       <div key={i} style={{display: 'flex', alignItems: 'center', gap: '14px'}}>
                         <FaCheckCircle size={18} color="#16a34a" />
                         <span style={{fontSize: '15px', color: '#222222'}}>{am}</span>
                       </div>
                     ))
                   ) : (
                     <>
                       <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                         <FaSnowflake size={24} color="#222222" />
                         <span style={{fontSize: '16px', color: '#222222'}}>Air conditioning</span>
                       </div>
                       <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                         <FaDoorClosed size={24} color="#222222" />
                         <span style={{fontSize: '16px', color: '#222222'}}>Essentials</span>
                       </div>
                     </>
                   )}
                 </div>
              </div>

              {/* 12. Location Card */}
              <div className={styles.cardItem}>
                <h3 className={styles.cardTitleLg} style={{marginBottom: '16px'}}>Location</h3>
                <iframe 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.city || 'Jaipur')}&t=&z=13&ie=UTF8&iwloc=&output=embed`} 
                  width="100%" 
                  height="200" 
                  style={{ border: 0, borderRadius: '12px', marginBottom: '16px' }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Map"
                ></iframe>
                <p className={styles.cardSub} style={{fontSize: '14px', lineHeight: '1.4', color: '#717171'}}>
                  <FaMapMarkerAlt color="#ff385c" size={13} style={{marginRight: '6px'}} />
                  {listing.city || 'Jaipur, Rajasthan, India'}
                </p>
              </div>

              {/* 13. About the Host */}
              <div 
                className={`${styles.cardItem} ${styles.editableCard}`} 
                style={{
                  padding: '24px 24px', 
                  cursor: 'pointer', 
                  transition: 'all 0.2s ease',
                  border: editModal === 'edit_mode' ? '2px solid #222222' : '1px solid #ebebeb',
                  backgroundColor: editModal === 'edit_mode' ? '#fcfcfc' : '#ffffff'
                }}
                onClick={() => {
                  setEditModal(editModal === 'edit_mode' ? null : 'edit_mode');
                }}
              >
                <h3 className={styles.cardTitleLg} style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '600', color: '#222222' }}>
                  About the host
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '8px 0 16px 0' }}>
                  <div style={{ position: 'relative', marginBottom: '16px' }}>
                    {listing.host_avatar || user?.avatar ? (
                      <img 
                        src={listing.host_avatar || user?.avatar} 
                        alt="Host" 
                        style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div style={{
                        width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#222222', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: '700'
                      }}>
                        {((listing.host_name || user?.name || 'H')[0]).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#222222', margin: '0 0 4px 0' }}>
                    {listing.host_name || user?.name || 'Host'}
                  </h4>
                  <p style={{ fontSize: '14px', color: '#717171', margin: 0 }}>Host</p>
                </div>
              </div>

              {/* 14. House Rules */}
              <div className={styles.cardItem}>
                 <h3 className={styles.cardTitleLg}>House rules</h3>
                 <div style={{display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px'}}>
                   <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                     <FaClock size={20} color="#222222" />
                     <span style={{fontSize: '15px', color: '#222222'}}>
                       Check-in after {checkInStart || '3:00 pm'}
                     </span>
                   </div>
                   <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                     <FaUserFriends size={20} color="#222222" />
                     <span style={{fontSize: '15px', color: '#222222'}}>
                       {listing.max_guests || 4} guests maximum
                     </span>
                   </div>
                 </div>
              </div>

              {/* 15. Cancellation Policy */}
              <div className={styles.cardItem}>
                <h3 className={styles.cardTitleLg}>Cancellation policy</h3>
                <p className={styles.cardSub} style={{marginBottom: '4px'}}>Flexible cancellation 24h prior</p>
                <p className={styles.cardSub}>Full refund within grace period</p>
              </div>
            </>
          )}

          </>
          )}

          {activeTab === 'Arrival guide' && (
            <>
              <div className={styles.cardItemOutline} style={{display: 'flex', padding: 0, overflow: 'hidden'}}>
                <div style={{flex: 1, padding: '24px', borderRight: '1px solid #ebebeb'}}>
                  <h3 className={styles.cardTitleLg} style={{fontSize: '14px'}}>
                    {isService ? 'Service Start' : 'Check-in'}
                  </h3>
                  <p className={styles.cardSub} style={{fontSize: '14px'}}>{checkInStart}</p>
                </div>
                <div style={{flex: 1, padding: '24px'}}>
                  <h3 className={styles.cardTitleLg} style={{fontSize: '14px'}}>
                    {isService ? 'Service End' : 'Checkout'}
                  </h3>
                  <p className={styles.cardSub} style={{fontSize: '14px'}}>{checkoutTime}</p>
                </div>
              </div>

              <div className={styles.cardItem}>
                <h3 className={styles.cardTitleLg}>Directions & Meeting location</h3>
                <p className={styles.cardSub}>
                  {(() => {
                    const addr = listing.meetup_address;
                    if (addr && typeof addr === 'object' && addr.street) {
                      return `${addr.street}, ${addr.city || listing.city}`;
                    }
                    return listing.city || 'Jaipur, Rajasthan';
                  })()}
                </p>
              </div>

              <div className={styles.cardItem}>
                <h3 className={styles.cardTitleLg}>
                  {isService ? 'Service instructions' : 'Check-in method'}
                </h3>
                <p className={styles.cardSub}>
                  {isService 
                    ? 'Host arrives with required materials & equipment or welcomes guests at venue' 
                    : 'Smart lock / Host in-person meetup'}
                </p>
              </div>

              <div className={styles.cardItem}>
                <h3 className={styles.cardTitleLg}>Interaction preferences</h3>
                <p className={styles.cardSub}>
                  {listing.host_intro ? `"${listing.host_intro.substring(0, 80)}..."` : 'I love to socialize with guests and provide dedicated guidance.'}
                </p>
              </div>
            </>
          )}

          <button 
            className={styles.floatingViewBtn} 
            onClick={() => {
              if (listing.id) {
                const targetUrl = isService ? `/service/${listing.id}` : isExperience ? `/experience/${listing.id}` : `/listing/${listing.id}`;
                window.open(targetUrl, '_blank');
              } else {
                window.open('/hosting/listings', '_blank');
              }
            }}
          >
            <FaEye /> View live
          </button>
            </>
          ) : (
            <>
              {/* Settings Nav Screen */}
              <div className={styles.headerRow}>
                <button className={styles.backBtn} onClick={() => setIsSettingsOpen(false)}>
                  <FaArrowLeft size={14} />
                </button>
                <h1 className={styles.pageTitle}>Edit preferences</h1>
              </div>

              <div className={styles.settingsNavList}>
                <div className={`${styles.settingsNavItem} ${styles.settingsNavActive}`}>
                  <div>
                    <div className={styles.settingsNavTitle}>Languages</div>
                    <div className={styles.settingsNavSub}>English (Default)</div>
                  </div>
                  <FaChevronRight size={14} />
                </div>
                <div className={styles.settingsNavItem}>
                  <div>
                    <div className={styles.settingsNavTitle}>Guest requirements</div>
                    <div className={styles.settingsNavSub}>Phone & government ID verified</div>
                  </div>
                  <FaChevronRight size={14} />
                </div>
                <div className={styles.settingsNavItem}>
                  <div>
                    <div className={styles.settingsNavTitle}>Listing Status</div>
                    <div className={styles.settingsNavSub}>Currently: {listing.status || 'Active'}</div>
                  </div>
                  <FaChevronRight size={14} />
                </div>
                <div className={styles.settingsNavItem} onClick={handleRemoveListing} style={{cursor: 'pointer'}}>
                  <div>
                    <div className={styles.settingsNavTitle} style={{color: '#dc2626'}}>Remove listing</div>
                    <div className={styles.settingsNavSub}>Permanently delete this listing from database</div>
                  </div>
                  <FaTrashAlt size={14} color="#dc2626" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Content (Fixed / Interactive Display) */}
        <div className={`col-lg-8 ${styles.rightContent}`}>
          {editModal === 'title' ? (
            /* Title Editor Right Panel Screen matching screenshot */
            <form onSubmit={handleSaveModal} className={styles.rightTitleEditorContainer}>
              <div className={styles.titleEditorCenter}>
                <div className={styles.charAvailableCount}>
                  {Math.max(0, 50 - (editFormData.title || '').length)}/50 available
                </div>

                <textarea
                  className={styles.titleBigTextarea}
                  rows={2}
                  maxLength={50}
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  required
                  placeholder="Creative hair looks by Mohammad"
                  autoFocus
                />
              </div>

              <div className={styles.titleEditorFooter}>
                <button 
                  type="button" 
                  className={styles.titleCancelBtn} 
                  onClick={() => setEditModal(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.titleSaveBtn} 
                  disabled={saving || !editFormData.title?.trim()}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          ) : editModal === 'expertise' ? (
            /* Expertise Editor Right Panel Screen matching user's screenshot */
            <form onSubmit={handleSaveModal} className={styles.rightTitleEditorContainer}>
              <div className={styles.expertiseContainer}>
                <h1 className={styles.expertiseTitle}>Expertise</h1>
                
                <div className={styles.expertiseCount}>
                  {Math.max(0, 200 - (editFormData.host_qualifications || '').length)}/200 available
                </div>

                <textarea
                  className={styles.expertiseTextarea}
                  rows={6}
                  maxLength={200}
                  value={editFormData.host_qualifications}
                  onChange={(e) => setEditFormData({ ...editFormData, host_qualifications: e.target.value })}
                  placeholder="I focus on thoughtful styling details to create polished hair looks."
                  autoFocus
                />
              </div>

              <div className={styles.titleEditorFooter}>
                <button 
                  type="button" 
                  className={styles.titleCancelBtn} 
                  onClick={() => setEditModal(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.titleSaveBtn} 
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          ) : editModal === 'offerings' ? (
            /* Offerings Right Panel Screen matching screenshot */
            <div className={styles.rightTitleEditorContainer}>
              <div className={styles.offeringsRightContainer}>
                <div className={styles.offeringsRightHeader}>
                  <div>
                    <h1 className={styles.offeringsRightTitle}>Offerings</h1>
                    <p className={styles.offeringsRightSub}>
                      Add or edit your offerings. Consider an affordable option to help you attract guests.
                    </p>
                  </div>
                  <button 
                    type="button" 
                    className={styles.offeringPlusBtn} 
                    title="Add new offering"
                    onClick={() => {
                      setEditingOfferingIndex(null);
                      setOfferingForm({
                        title: '',
                        description: '',
                        serviceType: listing.category || 'Swedish massage',
                        price: '200',
                        priceType: 'Per guest',
                        maxGuests: 1,
                        durationHours: 0,
                        durationMinutes: 30,
                        duration: '30 mins',
                        image: (listing.photos && listing.photos[0]) || listing.cover_img || '',
                      });
                      setOfferingModalPhase('title');
                      setShowOfferingModal(true);
                    }}
                  >
                    <FaPlus size={14} />
                  </button>
                </div>

                {/* Offerings List matching screenshot */}
                <div style={{ marginTop: '20px' }}>
                  {(() => {
                    const offerings = Array.isArray(listing.service_offerings) ? listing.service_offerings : [];
                    if (offerings.length === 0) {
                      return (
                        <div style={{ padding: '30px 20px', textAlign: 'center', color: '#717171', border: '1px dashed #dddddd', borderRadius: '16px' }}>
                          <p style={{ margin: '0 0 10px', fontSize: '15px' }}>No offerings created yet.</p>
                          <p style={{ margin: 0, fontSize: '13px' }}>Click the + button above to add your first offering.</p>
                        </div>
                      );
                    }

                    const defaultPhoto = (listing.photos && listing.photos[0]) || listing.cover_img;

                    return offerings.map((off, oIdx) => {
                      const name = off.title || off.name || 'Untitled Offering';
                      const price = off.price || off.price_per_guest || 0;
                      const itemPhoto = off.image || defaultPhoto;
                      const statusText = off.status || (listing.status === 'Active' ? 'Active' : 'Update required');
                      const isApproved = statusText.toLowerCase().includes('active') || statusText.toLowerCase().includes('approved');

                      return (
                        <div 
                          key={oIdx} 
                          className={styles.offeringsListItem}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setEditingOfferingIndex(oIdx);
                            setOfferingForm({
                              title: off.title || off.name || '',
                              description: off.description || '',
                              serviceType: off.serviceType || listing.category || 'Swedish massage',
                              price: String(off.price || off.price_per_guest || '200'),
                              priceType: off.priceType || 'Per guest',
                              maxGuests: parseInt(off.maxGuests || off.guests) || 1,
                              durationHours: off.durationHours || 0,
                              durationMinutes: off.durationMinutes !== undefined ? off.durationMinutes : 30,
                              duration: off.duration || '30 mins',
                              image: off.image || itemPhoto,
                            });
                            setOfferingModalPhase('details');
                            setShowOfferingModal(true);
                          }}
                        >
                          <div className={styles.offeringsListItemLeft}>
                            {itemPhoto ? (
                              <img 
                                src={itemPhoto} 
                                alt={name} 
                                className={styles.offeringsListThumb}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <div className={styles.offeringsListThumb} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7f7' }}>
                                <FaConciergeBell size={18} color="#717171" />
                              </div>
                            )}
                            <div className={styles.offeringsListInfo}>
                              <span className={styles.offeringsListName}>{name}</span>
                              <span className={styles.offeringsListPrice}>₹{price} / guest</span>
                              <div className={styles.offeringsListStatus}>
                                <span 
                                  className={styles.statusRedDot}
                                  style={{ backgroundColor: isApproved ? '#008a05' : '#c13515' }}
                                ></span>
                                <span style={{ color: isApproved ? '#008a05' : '#c13515' }}>{statusText}</span>
                              </div>
                            </div>
                          </div>
                          <FaChevronRight size={14} color="#717171" />
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              <div className={styles.titleEditorFooter}>
                <button 
                  type="button" 
                  className={styles.titleCancelBtn} 
                  onClick={() => setEditModal(null)}
                >
                  Done
                </button>
                <div style={{ width: '40px' }}></div>
              </div>
            </div>
          ) : editModal === 'property_type' ? (
            /* Property Type Editor Right Panel Screen */
            <form onSubmit={handleSaveModal} className={styles.rightTitleEditorContainer}>
              <div style={{ padding: '40px 30px', maxWidth: '750px', margin: '0 auto', width: '100%' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#222222', marginBottom: '8px' }}>
                  {isService ? 'Which of these best describes your service?' : isExperience ? 'Which experience category?' : 'Which of these best describes your place?'}
                </h2>
                <p style={{ fontSize: '15px', color: '#717171', marginBottom: '24px' }}>
                  Select the category that best matches your listing to help guests discover your offering.
                </p>

                <div className={styles.propertyTypeGrid}>
                  {(isService
                    ? [
                        { name: 'Chef', desc: 'Private dinners, menu planning, cooking classes' },
                        { name: 'Hairstyling', desc: 'Haircut, styling, coloring & treatments' },
                        { name: 'Make-up', desc: 'Bridal makeup, lessons & everyday glam' },
                        { name: 'Massage', desc: 'Deep tissue, Swedish & sports massage' },
                        { name: 'Personal training', desc: 'Strength training, cardio, yoga, fitness' },
                        { name: 'Photography', desc: 'Portrait sessions, event & wedding shoots' },
                        { name: 'Prepared meals', desc: 'Weekly meal prep, diet-specific menus' },
                        { name: 'Spa treatments', desc: 'Facials, body scrubs, wellness therapies' },
                        { name: 'Catering', desc: 'Buffet setup, party appetizers & weddings' }
                      ]
                    : isExperience
                    ? [
                        { name: 'Food and drink', desc: 'Tastings, cooking sessions & farm tours' },
                        { name: 'Art and design', desc: 'Workshops, exhibitions & craft sessions' },
                        { name: 'Fitness and wellness', desc: 'Yoga retreats, hikes & meditation' },
                        { name: 'History and culture', desc: 'Guided walks, monument tours & stories' },
                        { name: 'Nature and outdoors', desc: 'Wildlife safari, trekking & eco tours' }
                      ]
                    : [
                        { name: 'Entire place', desc: 'Guests have the whole place to themselves' },
                        { name: 'Private room', desc: 'Guests have their own room, with shared spaces' },
                        { name: 'Shared room', desc: 'Guests sleep in a room or common area shared with others' },
                        { name: 'Villa', desc: 'Standalone luxury home with private amenities' },
                        { name: 'Apartment', desc: 'A residential flat in a multi-unit building' },
                        { name: 'Boutique hotel', desc: 'A professional hospitality establishment' }
                      ]
                  ).map((item, idx) => {
                    const isSelected = isService || isExperience
                      ? (editFormData.category || '').toLowerCase() === item.name.toLowerCase()
                      : (editFormData.type || '').toLowerCase() === item.name.toLowerCase();

                    return (
                      <div
                        key={idx}
                        className={`${styles.propertyTypeCard} ${isSelected ? styles.propertyTypeCardActive : ''}`}
                        onClick={() => {
                          if (isService || isExperience) {
                            setEditFormData(prev => ({ ...prev, category: item.name }));
                          } else {
                            setEditFormData(prev => ({ ...prev, type: item.name }));
                          }
                        }}
                      >
                        <div className={styles.propertyTypeInfo}>
                          <span className={styles.propertyTypeName}>{item.name}</span>
                          <span className={styles.propertyTypeDesc}>{item.desc}</span>
                        </div>
                        <div className={`${styles.propertyRadioCircle} ${isSelected ? styles.propertyRadioCircleActive : ''}`}>
                          {isSelected && <span className={styles.propertyRadioDot}></span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={styles.titleEditorFooter}>
                <button 
                  type="button" 
                  className={styles.titleCancelBtn} 
                  onClick={() => setEditModal(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.titleSaveBtn} 
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          ) : editModal === 'languages' ? (
            /* Languages Right Panel Screen matching user's screenshot */
            <div className={styles.rightTitleEditorContainer}>
              <div style={{ padding: '48px 48px 24px 48px', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#222222', margin: 0 }}>
                    Languages
                  </h1>
                  <button 
                    type="button" 
                    className={styles.offeringPlusBtn} 
                    title="Add or change languages"
                    onClick={() => setShowLanguageModal(true)}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid #ebebeb', backgroundColor: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <FaPlus size={13} color="#222222" />
                  </button>
                </div>

                <p style={{ fontSize: '15px', color: '#717171', margin: '0 0 40px 0', lineHeight: '1.4', maxWidth: '480px' }}>
                  Select all the languages you can speak when providing your service.
                </p>

                {/* List of active languages */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {(selectedLanguages && selectedLanguages.length > 0 ? selectedLanguages : ['English']).map((lang, lIdx) => (
                    <div 
                      key={lIdx} 
                      style={{ 
                        fontSize: '16px', 
                        color: '#222222', 
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{lang}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.titleEditorFooter}>
                <button 
                  type="button" 
                  className={styles.titleCancelBtn} 
                  onClick={() => setEditModal(null)}
                >
                  Done
                </button>
                <div style={{ width: '40px' }}></div>
              </div>
            </div>
          ) : editModal === 'accessibility' ? (
            /* Accessibility features Right Panel Screen matching user's screenshots */
            <div className={styles.rightTitleEditorContainer}>
              <div style={{ padding: '48px 48px 24px 48px', width: '100%' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#222222', margin: '0 0 28px 0' }}>
                  Accessibility features
                </h1>

                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#222222', margin: '0 0 8px 0' }}>
                  Does your experience have any accessibility features? (optional)
                </h3>

                <p style={{ fontSize: '14px', color: '#717171', margin: '0 0 36px 0', lineHeight: '1.4' }}>
                  Help guests understand whether your experience is suitable for their needs. Learn more about{' '}
                  <span style={{ textDecoration: 'underline', color: '#222222', cursor: 'pointer' }}>
                    adding accessibility features.
                  </span>
                </p>

                {/* Sign language options row matching screenshot */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 0',
                  borderTop: '1px solid #f0f0f0',
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    {/* Hand with heart React Icon */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px', color: '#222222' }}>
                      <FaHandHoldingHeart size={26} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#222222', margin: '0 0 4px 0' }}>
                        Sign language options
                      </h4>
                      <p style={{ fontSize: '13px', color: '#717171', margin: 0, lineHeight: '1.4' }}>
                        Either you or a co-host can communicate to guests in sign language or an interpreter is available.
                      </p>
                    </div>
                  </div>

                  {/* Toggle Button: round plus (+) or filled dark circle with checkmark (✓) */}
                  <button
                    type="button"
                    onClick={() => toggleAccessibilityFeature('Sign language options')}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: selectedAccessibility.includes('Sign language options') ? '#222222' : '#f7f7f7',
                      color: selectedAccessibility.includes('Sign language options') ? '#ffffff' : '#222222',
                      border: selectedAccessibility.includes('Sign language options') ? 'none' : '1px solid #ebebeb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.2s ease'
                    }}
                    title={selectedAccessibility.includes('Sign language options') ? 'Remove feature' : 'Add feature'}
                  >
                    {selectedAccessibility.includes('Sign language options') ? (
                      <FaCheck size={13} color="#ffffff" />
                    ) : (
                      <FaPlus size={13} color="#222222" />
                    )}
                  </button>
                </div>
              </div>

              <div className={styles.titleEditorFooter}>
                <button 
                  type="button" 
                  className={styles.titleCancelBtn} 
                  onClick={() => setEditModal(null)}
                >
                  Done
                </button>
                <div style={{ width: '40px' }}></div>
              </div>
            </div>
          ) : editModal === 'qualifications' ? (
            /* Qualifications Right Panel Screen matching user's screenshot */
            <div className={styles.rightTitleEditorContainer}>
              <div style={{ padding: '48px 48px 24px 48px', width: '100%' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#222222', margin: '0 0 36px 0' }}>
                  Qualifications
                </h1>

                {/* List of Qualification Sections matching screenshot */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* 1. Experience Item */}
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px 0',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                    onClick={() => {
                      setEditFormData(prev => ({ 
                        ...prev, 
                        years_experience: listing.years_experience || 0,
                        experience_description: listing.experience_description || ''
                      }));
                      setEditModal('experience_detail');
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                      <div className={styles.serviceCardIconBox} style={{ width: '48px', height: '48px', borderRadius: '12px' }}>
                        <FaTrophy size={18} color="#222222" />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#222222', margin: '0 0 4px 0' }}>
                          Experience
                        </h4>
                        <p style={{ fontSize: '13px', color: '#717171', margin: '0 0 4px 0' }}>
                          {listing.experience_description || (listing.years_experience ? `${listing.years_experience} years` : 'f')}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#c13515', display: 'inline-block' }}></span>
                          <span style={{ fontSize: '12px', color: '#c13515', fontWeight: '500' }}>Update required</span>
                        </div>
                      </div>
                    </div>
                    <FaChevronRight size={14} color="#717171" />
                  </div>

                  {/* 2. Degree Item */}
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px 0',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                    onClick={() => {
                      setEditFormData(prev => ({ 
                        ...prev, 
                        degree: listing.degree || listing.host_recognition || '' 
                      }));
                      setEditModal('degree_detail');
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                      <div className={styles.serviceCardIconBox} style={{ width: '48px', height: '48px', borderRadius: '12px' }}>
                        <FaGraduationCap size={20} color="#222222" />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#222222', margin: '0 0 4px 0' }}>
                          Degree
                        </h4>
                        <p style={{ fontSize: '13px', color: '#717171', margin: '0 0 4px 0' }}>
                          {listing.degree || listing.host_recognition || 'f'}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#c13515', display: 'inline-block' }}></span>
                          <span style={{ fontSize: '12px', color: '#c13515', fontWeight: '500' }}>Update required</span>
                        </div>
                      </div>
                    </div>
                    <FaChevronRight size={14} color="#717171" />
                  </div>

                  {/* 3. Career highlight (optional) Item */}
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px 0',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                    onClick={() => {
                      setEditFormData(prev => ({ 
                        ...prev, 
                        career_highlight: listing.career_highlight || '' 
                      }));
                      setEditModal('career_highlight_detail');
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                      <div className={styles.serviceCardIconBox} style={{ width: '48px', height: '48px', borderRadius: '12px' }}>
                        <PiSparkle size={20} color="#222222" />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#222222', margin: '0 0 4px 0' }}>
                          Career highlight (optional)
                        </h4>
                        <p style={{ fontSize: '13px', color: '#717171', margin: 0 }}>
                          {listing.career_highlight || 'Add details'}
                        </p>
                      </div>
                    </div>
                    <FaChevronRight size={14} color="#717171" />
                  </div>
                </div>
              </div>

              <div className={styles.titleEditorFooter}>
                <button 
                  type="button" 
                  className={styles.titleCancelBtn} 
                  onClick={() => setEditModal(null)}
                >
                  Done
                </button>
                <div style={{ width: '40px' }}></div>
              </div>
            </div>
          ) : editModal === 'experience_detail' ? (
            /* Experience Detail Sub-Screen */
            <form onSubmit={handleSaveModal} className={styles.rightTitleEditorContainer}>
              <div style={{ padding: '48px 48px 24px 48px', width: '100%', maxWidth: '750px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#222222', margin: '0 0 8px 0' }}>
                  Experience
                </h1>
                <p style={{ fontSize: '14px', color: '#717171', margin: '0 0 24px 0' }}>
                  Describe your professional background and relevant work experience.
                </p>

                <textarea
                  className={styles.expertiseTextarea}
                  rows={5}
                  value={editFormData.experience_description !== undefined ? editFormData.experience_description : (listing.experience_description || '')}
                  onChange={(e) => setEditFormData({ ...editFormData, experience_description: e.target.value })}
                  placeholder="e.g. 5+ years styling for high-profile clients and salon management"
                  autoFocus
                />
              </div>

              <div className={styles.titleEditorFooter}>
                <button 
                  type="button" 
                  className={styles.titleCancelBtn} 
                  onClick={() => setEditModal('qualifications')}
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className={styles.titleSaveBtn} 
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          ) : editModal === 'degree_detail' ? (
            /* Degree Detail Sub-Screen */
            <form onSubmit={handleSaveModal} className={styles.rightTitleEditorContainer}>
              <div style={{ padding: '48px 48px 24px 48px', width: '100%', maxWidth: '750px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#222222', margin: '0 0 8px 0' }}>
                  Degree or certification
                </h1>
                <p style={{ fontSize: '14px', color: '#717171', margin: '0 0 24px 0' }}>
                  Add your formal education, degrees, diplomas, or trade certificates.
                </p>

                <input
                  type="text"
                  className={styles.titleBigTextarea}
                  style={{ height: 'auto', padding: '16px' }}
                  value={editFormData.degree !== undefined ? editFormData.degree : (listing.degree || listing.host_recognition || '')}
                  onChange={(e) => setEditFormData({ ...editFormData, degree: e.target.value, host_recognition: e.target.value })}
                  placeholder="e.g. Diploma in Cosmetology & Hair Styling"
                  autoFocus
                />
              </div>

              <div className={styles.titleEditorFooter}>
                <button 
                  type="button" 
                  className={styles.titleCancelBtn} 
                  onClick={() => setEditModal('qualifications')}
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className={styles.titleSaveBtn} 
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          ) : editModal === 'career_highlight_detail' ? (
            /* Career Highlight Detail Sub-Screen */
            <form onSubmit={handleSaveModal} className={styles.rightTitleEditorContainer}>
              <div style={{ padding: '48px 48px 24px 48px', width: '100%', maxWidth: '750px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#222222', margin: '0 0 8px 0' }}>
                  Career highlight
                </h1>
                <p style={{ fontSize: '14px', color: '#717171', margin: '0 0 24px 0' }}>
                  Mention any awards, features, notable projects, or media recognitions.
                </p>

                <textarea
                  className={styles.expertiseTextarea}
                  rows={4}
                  value={editFormData.career_highlight !== undefined ? editFormData.career_highlight : (listing.career_highlight || '')}
                  onChange={(e) => setEditFormData({ ...editFormData, career_highlight: e.target.value })}
                  placeholder="e.g. Winner of Best Creative Stylist Award 2024"
                  autoFocus
                />
              </div>

              <div className={styles.titleEditorFooter}>
                <button 
                  type="button" 
                  className={styles.titleCancelBtn} 
                  onClick={() => setEditModal('qualifications')}
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className={styles.titleSaveBtn} 
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          ) : editModal === 'co_hosts' ? (
            /* Co-hosts Screen matching user's screenshot */
            <div className={styles.rightTitleEditorContainer}>
              <div style={{ padding: '60px 48px 32px 48px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* 3D Co-host Card Illustration */}
                <div style={{ position: 'relative', width: '160px', height: '170px', marginBottom: '36px' }}>
                  {/* Glowing shadow underneath */}
                  <div style={{
                    position: 'absolute',
                    bottom: '4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '130px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.04) 60%, transparent 80%)',
                    filter: 'blur(4px)'
                  }}></div>

                  {/* Envelope / Holder Back */}
                  <div style={{
                    position: 'absolute',
                    top: '0px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '144px',
                    height: '154px',
                    background: 'linear-gradient(180deg, #faf5f3 0%, #f5ece8 100%)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                  }}></div>

                  {/* Top Fold / Tab */}
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100px',
                    height: '22px',
                    backgroundColor: '#ede3df',
                    borderRadius: '8px 8px 0 0',
                    border: '1px solid rgba(220, 205, 200, 0.4)'
                  }}></div>

                  {/* Holographic / Iridescent Airbnb Card */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '128px',
                    height: '84px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #fbc2eb 100%)',
                    boxShadow: '0 4px 12px rgba(220, 150, 180, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {/* Subtle rainbow overlay highlight */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85) 0%, transparent 60%)',
                      pointerEvents: 'none'
                    }}></div>
                    <FaAirbnb size={36} color="rgba(255, 255, 255, 0.95)" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))', zIndex: 1 }} />
                  </div>

                  {/* Envelope / Holder Front Pocket with subtle curved cutout */}
                  <div style={{
                    position: 'absolute',
                    bottom: '6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '144px',
                    height: '100px',
                    background: 'linear-gradient(180deg, #fbf7f6 0%, #f5ede9 100%)',
                    borderRadius: '0 0 16px 16px',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 8px 20px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(230, 218, 214, 0.7)',
                    borderTop: 'none',
                    clipPath: 'polygon(0 0, 16px 0, 26px 14px, 118px 14px, 128px 0, 100% 0, 100% 100%, 0 100%)'
                  }}></div>
                </div>

                {/* Title */}
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  color: '#222222', 
                  margin: '0 0 14px 0', 
                  textAlign: 'center',
                  letterSpacing: '-0.4px'
                }}>
                  Invite a co-host
                </h1>

                {/* Description */}
                <p style={{ 
                  fontSize: '15px', 
                  color: '#717171', 
                  textAlign: 'center', 
                  maxWidth: '440px', 
                  lineHeight: '1.45', 
                  margin: '0 auto 18px auto' 
                }}>
                  A co-host can help you with everything from managing your calendar to welcoming guests.
                </p>

                {/* Learn about co-hosting link */}
                <a 
                  href="#learn-cohosting" 
                  onClick={(e) => { e.preventDefault(); }}
                  style={{ 
                    color: '#222222', 
                    textDecoration: 'underline', 
                    fontWeight: '600', 
                    fontSize: '14px', 
                    marginBottom: '38px',
                    cursor: 'pointer'
                  }}
                >
                  Learn about co-hosting
                </a>

                {/* Get started button */}
                <button 
                  type="button" 
                  onClick={() => setShowCoHostInviteModal(true)}
                  style={{ 
                    minWidth: '130px', 
                    padding: '13px 26px', 
                    fontSize: '15px', 
                    fontWeight: '600', 
                    borderRadius: '8px', 
                    border: '1px solid #222222', 
                    backgroundColor: '#ffffff', 
                    color: '#222222', 
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7f7f7'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                >
                  Get started
                </button>

                {/* Current Active Co-hosts list (if any invited) */}
                {Array.isArray(listing.co_hosts) && listing.co_hosts.length > 0 && (
                  <div style={{ marginTop: '48px', width: '100%', maxWidth: '480px', borderTop: '1px solid #ebebeb', paddingTop: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#222222', marginBottom: '16px' }}>
                      Co-hosts on this listing ({listing.co_hosts.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {listing.co_hosts.map((coHost, chIdx) => (
                        <div key={coHost.id || chIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '10px', backgroundColor: '#f9f9f9', border: '1px solid #ebebeb' }}>
                          <div>
                            <div style={{ fontSize: '15px', fontWeight: '600', color: '#222222' }}>{coHost.name}</div>
                            <div style={{ fontSize: '13px', color: '#717171' }}>{coHost.email} • <span style={{ color: '#222222', fontWeight: '500' }}>{coHost.role}</span></div>
                          </div>
                          <button
                            type="button"
                            onClick={async () => {
                              const updated = listing.co_hosts.filter((_, i) => i !== chIdx);
                              setListing(prev => ({ ...prev, co_hosts: updated }));
                              if (listing.id) {
                                try {
                                  await fetch(`${baseUrl}/listings/${listing.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ co_hosts: updated })
                                  });
                                } catch (err) {
                                  console.error('Failed to remove co-host:', err);
                                }
                              }
                            }}
                            title="Remove co-host"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#717171', padding: '6px' }}
                          >
                            <FaTrash size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Done Bar */}
              <div className={styles.titleEditorFooter}>
                <button 
                  type="button" 
                  className={styles.titleCancelBtn} 
                  onClick={() => setEditModal(null)}
                >
                  Done
                </button>
                <div style={{ width: '40px' }}></div>
              </div>
            </div>
          ) : editModal === 'location' ? (
            /* Location Right Panel Screen matching user's screenshot */
            <div className={styles.rightTitleEditorContainer}>
              <div style={{ padding: '48px 48px 32px 48px', width: '100%' }}>
                {/* 1. Main Heading */}
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  color: '#222222', 
                  margin: '0 0 40px 0',
                  letterSpacing: '-0.3px'
                }}>
                  Location
                </h1>

                {/* 2. Sub-heading */}
                <h2 style={{ 
                  fontSize: '22px', 
                  fontWeight: '600', 
                  color: '#222222', 
                  margin: '0 0 20px 0',
                  letterSpacing: '-0.2px'
                }}>
                  {serviceLocationForm.travel_preference || listing.travel_preference || 'You travel to guests'}
                </h2>

                {/* 3. Map Box Container matching screenshot */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '380px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  backgroundColor: '#f4f3ef',
                  marginBottom: '28px'
                }}>
                  {/* Google Map iframe with dynamic location */}
                  <iframe 
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      [
                        serviceLocationForm.city || listing.city || 'Jaipur',
                        serviceLocationForm.state || listing.state || 'Rajasthan',
                        serviceLocationForm.country || listing.country || 'India'
                      ].filter(Boolean).join(', ')
                    )}&t=${mapType === 'Satellite' ? 'k' : 'm'}&z=10&ie=UTF8&iwloc=&output=embed`} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Service Location Map"
                  ></iframe>

                  {/* Shaded Service Area Polygon overlay (matching shaded zone in screenshot) */}
                  <div style={{
                    position: 'absolute',
                    top: '18%',
                    left: '32%',
                    width: '36%',
                    height: '62%',
                    backgroundColor: 'rgba(215, 215, 215, 0.45)',
                    border: '1.5px solid rgba(130, 130, 130, 0.6)',
                    borderRadius: '35% 45% 40% 30% / 30% 35% 45% 40%',
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.04)'
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.92)',
                      padding: '4px 10px',
                      borderRadius: '14px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#222222',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <FaMapMarkerAlt size={11} color="#FF385C" />
                      <span>{serviceLocationForm.city || listing.city || 'Jaipur'}</span>
                    </div>
                  </div>

                  {/* Top-Left Map / Satellite Toggle (exact match with screenshot) */}
                  <div className={styles.locationMapToggle}>
                    <button
                      type="button"
                      onClick={() => setMapType('Map')}
                      className={styles.locationMapToggleBtn}
                      style={{
                        backgroundColor: mapType === 'Map' ? '#ffffff' : '#f8f8f8',
                        color: mapType === 'Map' ? '#000000' : '#565656',
                        fontWeight: mapType === 'Map' ? '600' : '400',
                        borderRight: '1px solid #e6e6e6'
                      }}
                    >
                      Map
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapType('Satellite')}
                      className={styles.locationMapToggleBtn}
                      style={{
                        backgroundColor: mapType === 'Satellite' ? '#ffffff' : '#f8f8f8',
                        color: mapType === 'Satellite' ? '#000000' : '#565656',
                        fontWeight: mapType === 'Satellite' ? '600' : '400'
                      }}
                    >
                      Satellite
                    </button>
                  </div>
                </div>

                {/* 4. Your service area clickable row with right chevron */}
                <div 
                  onClick={() => setShowLocationEditModal(true)}
                  className={styles.serviceAreaRow}
                  title="Click to edit service area or location"
                >
                  <div>
                    <h3 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#222222', 
                      margin: '0 0 6px 0' 
                    }}>
                      Your service area
                    </h3>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#717171', 
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      {serviceLocationForm.service_radius_desc || 
                        `Within a 1-hour drive from ${serviceLocationForm.service_address || listing.street || '1st floor, Vaishali Tower II, 101, Nursery Circle'}`}
                    </p>
                  </div>
                  <FaChevronRight size={15} color="#222222" style={{ flexShrink: 0, marginLeft: '16px' }} />
                </div>
              </div>

              {/* Bottom Done Bar */}
              <div className={styles.titleEditorFooter}>
                <button 
                  type="button" 
                  className={styles.titleCancelBtn} 
                  onClick={() => setEditModal(null)}
                >
                  Done
                </button>
                <div style={{ width: '40px' }}></div>
              </div>
            </div>
          ) : editModal === 'guest_requirements' ? (
            /* Guest Requirements Screen matching user's screenshot */
            <div className={styles.rightTitleEditorContainer}>
              <div className={styles.policyPanelContent}>
                {/* Title */}
                <h1 className={styles.policyPanelTitle}>
                  Guest requirements
                </h1>

                {/* Minimum Age Select Box (matching screenshot exactly) */}
                <div style={{ position: 'relative', width: '100%', marginBottom: '8px' }}>
                  <div 
                    onClick={() => setIsAgeDropdownOpen(!isAgeDropdownOpen)}
                    className={styles.ageSelectBox}
                  >
                    <div>
                      <div style={{ fontSize: '11px', color: '#717171', fontWeight: '500', marginBottom: '2px' }}>
                        Minimum age
                      </div>
                      <div style={{ fontSize: '16px', color: '#222222', fontWeight: '400' }}>
                        {guestRequirementsForm.min_age}
                      </div>
                    </div>
                    <FaChevronDown 
                      size={14} 
                      color="#222222" 
                      style={{
                        transform: isAgeDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                  </div>

                  {/* Dropdown Options List */}
                  {isAgeDropdownOpen && (
                    <div className={styles.ageDropdownMenu}>
                      {[18, 19, 20, 21, 25].map(age => (
                        <div
                          key={age}
                          onClick={() => {
                            setGuestRequirementsForm(prev => ({ ...prev, min_age: age }));
                            setIsAgeDropdownOpen(false);
                          }}
                          className={styles.ageDropdownItem}
                          style={{
                            backgroundColor: guestRequirementsForm.min_age === age ? '#f7f7f7' : '#ffffff',
                            fontWeight: guestRequirementsForm.min_age === age ? '600' : '400'
                          }}
                        >
                          {age}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subtitle helper text under Minimum age box */}
                <p style={{ fontSize: '12px', color: '#717171', margin: '0 0 28px 0' }}>
                  Set a minimum age limit.
                </p>

                {/* Custom Checkbox: Parents can bring children under 2 years old */}
                <div 
                  onClick={() => {
                    setGuestRequirementsForm(prev => ({
                      ...prev,
                      allow_infants: !prev.allow_infants
                    }));
                  }}
                  className={styles.infantsCheckboxRow}
                >
                  <div 
                    className={styles.infantsCheckbox}
                    style={{
                      backgroundColor: guestRequirementsForm.allow_infants ? '#000000' : '#ffffff',
                      border: guestRequirementsForm.allow_infants ? 'none' : '1.5px solid #b0b0b0'
                    }}
                  >
                    {guestRequirementsForm.allow_infants && (
                      <FaCheck size={13} color="#ffffff" />
                    )}
                  </div>
                  <span style={{ fontSize: '15px', color: '#222222', fontWeight: '400' }}>
                    Parents can bring children under 2 years old
                  </span>
                </div>
              </div>

              {/* Bottom Footer with Save Button matching screenshot */}
              <div className={styles.titleEditorFooter} style={{ justifyContent: 'flex-end', padding: '16px 48px' }}>
                <button 
                  type="button" 
                  className={styles.titleCancelBtn}
                  style={{ marginRight: '12px' }}
                  onClick={() => setEditModal(null)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className={styles.titleSaveBtn}
                  onClick={() => saveGuestRequirementsToDb(guestRequirementsForm)}
                >
                  Save
                </button>
              </div>
            </div>
          ) : editModal === 'online_profiles' ? (
            /* Online Profiles Screen matching user's screenshot */
            <div className={styles.rightTitleEditorContainer}>
              <div className={styles.policyPanelContent}>
                {/* Header with Title and Plus Button */}
                <div className={styles.profilesHeader}>
                  <h1 className={styles.policyPanelTitle} style={{ margin: 0 }}>
                    Online profiles
                  </h1>
                  <button 
                    type="button"
                    onClick={() => {
                      setNewProfileLink(listing.social_link || listing.online_profile || '');
                      setShowAddProfileModal(true);
                    }}
                    className={styles.profileAddCircleBtn}
                    title="Add or edit profile link"
                  >
                    <FaPlus size={14} color="#222222" />
                  </button>
                </div>

                {/* Subtitle description */}
                <p className={styles.profilesDesc}>
                  To help us confirm your skills, add links to your reviews, any press you've received and your professional website. Guests won't see these.
                </p>

                {/* Red Alert Pill / Box matching screenshot */}
                <div className={styles.profileAlertBox}>
                  <span className={styles.profileAlertDot}></span>
                  <p style={{ fontSize: '13px', color: '#222222', margin: 0, lineHeight: '1.45' }}>
                    <strong style={{ color: '#222222', fontWeight: '700' }}>Online profiles not approved.</strong>{' '}
                    <span style={{ color: '#222222' }}>Skills not verified. Add links that show reviews or press about your work. Then resubmit for review.</span>
                  </p>
                </div>

                {/* Current Active Profile Link Box matching screenshot */}
                <div 
                  onClick={() => {
                    setNewProfileLink(listing.social_link || listing.online_profile || '');
                    setShowAddProfileModal(true);
                  }}
                  className={styles.profileLinkBox}
                  title="Click to edit profile link"
                >
                  <FaLink size={18} color="#222222" style={{ transform: 'rotate(-45deg)' }} />
                  <span style={{ fontSize: '15px', color: '#222222', wordBreak: 'break-all', fontWeight: '400' }}>
                    {listing.social_link || listing.online_profile || 'f'}
                  </span>
                </div>
              </div>

              {/* Bottom Done Bar */}
              <div className={styles.titleEditorFooter}>
                <button 
                  type="button" 
                  className={styles.titleCancelBtn} 
                  onClick={() => setEditModal(null)}
                >
                  Done
                </button>
                <div style={{ width: '40px' }}></div>
              </div>
            </div>
          ) : editModal === 'availability' ? (
            /* Availability Screen matching user's screenshot */
            <div className={styles.rightTitleEditorContainer}>
              <div className={styles.policyPanelContent}>
                {/* Title */}
                <h1 className={styles.policyPanelTitle} style={{ margin: '0 0 32px 0' }}>
                  Availability
                </h1>

                {/* Section Subtitle Heading */}
                <h2 style={{ 
                  fontSize: '17px', 
                  fontWeight: '600', 
                  color: '#222222', 
                  margin: '0 0 6px 0' 
                }}>
                  Simultaneous bookings
                </h2>

                <p style={{ 
                  fontSize: '14px', 
                  color: '#717171', 
                  margin: '0 0 20px 0', 
                  lineHeight: '1.4' 
                }}>
                  Choose how many bookings your team can host at the same time.{' '}
                  <a 
                    href="#learn-more" 
                    onClick={(e) => { e.preventDefault(); }} 
                    className={styles.policyHelpLink}
                  >
                    Learn more
                  </a>
                </p>

                {/* Simultaneous Bookings Select Box (Click opens modal) */}
                <div style={{ width: '100%', marginBottom: '24px' }}>
                  <div 
                    onClick={() => {
                      setTempSimultaneousCount(getSimultaneousCount());
                      setShowSimultaneousModal(true);
                    }}
                    className={styles.availabilitySelectBox}
                  >
                    <span className={styles.availabilitySelectVal}>
                      {listing.simultaneous_bookings || '1 booking at a time'}
                    </span>
                    <FaChevronDown size={14} color="#222222" />
                  </div>
                </div>

                {/* Invite co-hosts Banner Box matching screenshot */}
                <div className={styles.coHostBannerBox}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {/* Overlapping circular avatars */}
                    <div className={styles.coHostAvatarsWrap}>
                      <div className={styles.coHostAvatar1}>
                        <FcPortraitMode size={24} />
                      </div>
                      <div className={styles.coHostAvatar2}>
                        <FcConferenceCall size={20} />
                      </div>
                    </div>

                    <span className={styles.coHostBannerText}>
                      Invite co-hosts to help manage bookings.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowCoHostInviteModal(true)}
                    className={styles.coHostInviteBtn}
                  >
                    Invite
                  </button>
                </div>
              </div>

              {/* Bottom Done Bar */}
              <div className={styles.titleEditorFooter}>
                <button 
                  type="button" 
                  className={styles.titleCancelBtn} 
                  onClick={() => setEditModal(null)}
                >
                  Done
                </button>
                <div style={{ width: '40px' }}></div>
              </div>
            </div>
          ) : editModal === 'cancellation_policy' ? (
            /* Cancellation Policy Screen matching user's screenshot */
            <div className={styles.rightTitleEditorContainer}>
              <div className={styles.policyPanelContent}>
                {/* Main Heading */}
                <h1 className={styles.policyPanelTitle}>
                  Cancellation policy
                </h1>

                {/* Subtitle with Help Centre link */}
                <p className={styles.policyPanelSub}>
                  You can read the full policies in the{' '}
                  <a 
                    href="#help-centre" 
                    onClick={(e) => { e.preventDefault(); }} 
                    className={styles.policyHelpLink}
                  >
                    Help Centre
                  </a>.
                </p>

                {/* Rounded Policy Card matching screenshot */}
                <div className={styles.policyCard}>
                  <h3 className={styles.policyCardTitle}>
                    {listing.cancellation_policy || '1 day'}
                  </h3>
                  <p className={styles.policyCardDesc}>
                    Guests can cancel until 24 hours before the experience start time for a full refund.
                  </p>
                </div>
              </div>

              {/* Bottom Done Bar */}
              <div className={styles.titleEditorFooter}>
                <button 
                  type="button" 
                  className={styles.titleCancelBtn} 
                  onClick={() => setEditModal(null)}
                >
                  Done
                </button>
                <div style={{ width: '40px' }}></div>
              </div>
            </div>
          ) : editModal === 'custom_link' ? (
            /* Custom Link Screen Matching User Screenshot */
            <div className={`${styles.rightTitleEditorContainer} ${styles.customLinkContainer}`}>
              {/* Main Content Area */}
              <div className={styles.customLinkContent}>
                {/* Character Counter Top Header */}
                <p className={styles.customLinkCounter}>
                  {16 + (customLinkInput ? customLinkInput.length : 0)}/116 available
                </p>

                {/* Editable Custom Link Main URL Display */}
                <div className={styles.customLinkUrlRow}>
                  <span className={styles.customLinkPrefix}>
                    airbnb.co.in/sv/
                  </span>
                  <input
                    type="text"
                    value={customLinkInput}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\s+/g, '-').replace(/^\/+/, '');
                      if (val.length <= 100) {
                        setCustomLinkInput(val);
                      }
                    }}
                    placeholder=""
                    autoFocus
                    className={styles.customLinkInput}
                    style={{
                      width: `${Math.max(1, (customLinkInput || '').length + 1)}ch`
                    }}
                  />
                </div>
              </div>

              {/* Bottom Actions Bar (Copy link on left, Save on right) */}
              <div className={styles.customLinkFooter}>
                {/* Left: Copy link */}
                <button
                  type="button"
                  onClick={() => {
                    const fullUrl = `https://airbnb.co.in/sv/${customLinkInput || ''}`;
                    navigator.clipboard.writeText(fullUrl);
                    setCopyLinkSuccess(true);
                    setTimeout(() => setCopyLinkSuccess(false), 2500);
                  }}
                  className={`${styles.customLinkCopyBtn} ${copyLinkSuccess ? styles.customLinkCopyBtnSuccess : ''}`}
                >
                  <FaLink size={15} style={{ transform: 'rotate(-45deg)' }} />
                  <span>{copyLinkSuccess ? 'Link copied!' : 'Copy link'}</span>
                </button>

                {/* Right: Save / Cancel Button */}
                <div className={styles.customLinkActions}>
                  <button
                    type="button"
                    className={styles.titleCancelBtn}
                    onClick={() => {
                      setCustomLinkInput(listing.custom_link || '');
                      setEditModal(null);
                    }}
                    style={{ fontSize: '14px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSavingCustomLink}
                    onClick={() => saveCustomLinkToDb(customLinkInput)}
                    className={styles.customLinkSaveBtn}
                  >
                    {isSavingCustomLink ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          ) : editModal === 'edit_mode' ? (
            /* About the Host / EditMode Screen in Right Panel */
            <div className={styles.rightTitleEditorContainer}>
              <div style={{ paddingBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ebebeb' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#222222', margin: '0 0 4px 0' }}>About the host</h1>
                  <p style={{ fontSize: '14px', color: '#717171', margin: 0 }}>View and update your host profile, interests, and bio.</p>
                </div>
                <button
                  type="button"
                  className={styles.titleCancelBtn}
                  onClick={() => setEditModal(null)}
                  style={{ minWidth: '80px', padding: '8px 18px', fontSize: '14px', fontWeight: '600' }}
                >
                  Done
                </button>
              </div>

              <div style={{ padding: '20px 0', overflowY: 'auto', flex: 1 }}>
                <EditMode 
                  userId={listing.host_id || user?.id || 4} 
                  userEmail={listing.host_email || user?.email}
                  onProfileUpdated={(updatedProfile) => {
                    if (updatedProfile.avatar) {
                      setListing(prev => ({ ...prev, host_avatar: updatedProfile.avatar }));
                    }
                    if (updatedProfile.name || updatedProfile.firstName) {
                      setListing(prev => ({ ...prev, host_name: updatedProfile.name || `${updatedProfile.firstName} ${updatedProfile.lastName || ''}`.trim() }));
                    }
                  }}
                />
              </div>
            </div>
          ) : !isSettingsOpen ? (
            <>
          {activeTab === 'Your space' && (
            <div className='row justify-content-center'>
            <div className='col-lg-10'>
              <div className={styles.rightHeader}>
                <div>
                  <h1 className={styles.rightTitle}>
                    {isService ? 'Service gallery' : 'Photo tour'}
                  </h1>
                  <p className={styles.rightSub}>
                    {isService 
                      ? 'Manage photos showing your service equipment, dishes, or experience highlights.'
                      : 'Manage photos and add details. Guests will only see your tour if every room has a photo.'}
                  </p>
                </div>
                <div className={styles.rightActions}>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    ref={photoInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleUploadNewPhotos}
                  />
                  <button 
                    type="button" 
                    className={styles.pillBtn} 
                    onClick={() => photoInputRef.current?.click()}
                    disabled={isPhotoUpdating}
                  >
                    <FaCamera size={14} /> {isPhotoUpdating ? 'Saving...' : 'Add photos'}
                  </button>
                  <button 
                    type="button"
                    className={styles.pillBtn}
                    onClick={() => {
                      if (listing.id) {
                        navigate(`/hosting/listing-editor/${listing.id}/all-photos`);
                      } else {
                        navigate('/hosting/listing-editor/all-photos');
                      }
                    }}
                  >
                    <FaImages size={14} /> All photos ({(listing.photos || []).length})
                  </button>
                </div>
              </div>

              <div className={styles.taskBanner}>
                <div className={styles.taskBannerText}>
                  <span className={styles.orangeDot}></span>
                  {listing.title || 'Your Listing'}
                </div>
                <span style={{fontSize: '13px', fontWeight: '600', color: '#16a34a'}}>
                  ● {listing.status || 'Active'}
                </span>
              </div>

              {/* Dynamic Photos Grid */}
              {(() => {
                const photos = Array.isArray(listing.photos) && listing.photos.length > 0 
                  ? listing.photos 
                  : (listing.cover_img ? [listing.cover_img] : []);

                if (photos.length === 0) {
                  return (
                    <div style={{
                      padding: '60px 20px',
                      textAlign: 'center',
                      border: '2px dashed #e5e7eb',
                      borderRadius: '16px',
                      backgroundColor: '#fafafa',
                      marginTop: '20px'
                    }}>
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px auto'
                      }}>
                        <FaCamera size={24} color="#717171" />
                      </div>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#222222', margin: '0 0 6px 0' }}>
                        No photos uploaded yet
                      </h3>
                      <p style={{ fontSize: '14px', color: '#717171', margin: '0 0 20px 0' }}>
                        Add high quality photos to showcase your service to guests.
                      </p>
                      <button 
                        type="button" 
                        className={styles.pillBtn} 
                        onClick={() => photoInputRef.current?.click()}
                        disabled={isPhotoUpdating}
                        style={{ margin: '0 auto' }}
                      >
                        <FaCamera size={14} /> {isPhotoUpdating ? 'Uploading...' : 'Upload photos'}
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="row g-3">
                    {photos.map((pUrl, pIdx) => {
                      const isCover = listing.cover_img ? listing.cover_img === pUrl : pIdx === 0;
                      const photoCap = (listing.photo_captions && listing.photo_captions[pUrl]) || '';

                      return (
                        <div key={pIdx} className="col-lg-4 col-md-6 col-12">
                          <div 
                            className={styles.photoItem}
                            onClick={() => openPhotoDetail(pUrl, pIdx)}
                            style={{ cursor: 'pointer' }}
                            title="Click to view and edit photo caption"
                          >
                            <div className={styles.photoImgWrapper} style={{ position: 'relative' }}>
                              <img 
                                src={pUrl} 
                                alt={`Listing photo ${pIdx + 1}`} 
                                style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px'}}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                              {isCover && (
                                <span style={{
                                  position: 'absolute',
                                  top: '8px',
                                  left: '8px',
                                  backgroundColor: '#222222',
                                  color: '#ffffff',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  padding: '3px 8px',
                                  borderRadius: '4px'
                                }}>
                                  Cover
                                </span>
                              )}
                              <button
                                type="button"
                                title="Delete photo"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePhoto(pIdx);
                                }}
                                style={{
                                  position: 'absolute',
                                  top: '8px',
                                  right: '8px',
                                  backgroundColor: 'rgba(0,0,0,0.6)',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: '28px',
                                  height: '28px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.6)'}
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                            <div>
                              <h4 className={styles.photoTitle}>
                                {isCover ? 'Cover photo' : `Photo ${pIdx + 1}`}
                              </h4>
                              <p className={styles.photoSub} style={{textDecoration: 'none'}}>
                                {photoCap || (isCover ? 'Main listing thumbnail' : 'Gallery item')}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
                
            </div>
            </div>
          )}

          {activeTab === 'Arrival guide' && (
            <>
            <div className='row justify-content-center'>
              <div className='col-lg-10'>
                <div className={styles.rightHeader}>
                  <div>
                    <h1 className={styles.rightTitle}>
                      {isService ? 'Service Schedule Window' : 'Check-in & checkout'}
                    </h1>
                  </div>
                </div>

                <div style={{marginBottom: '32px'}}>
                  <h4 style={{fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#222222'}}>
                    {isService ? 'Available start time' : 'Check-in window'}
                  </h4>
                  <div className={styles.customSelectBox} style={{position: 'relative'}} onClick={() => setIsStartOpen(!isStartOpen)}>
                    <div className={styles.selectContent}>
                      <span className={styles.selectLabel}>Start time</span>
                      <span className={styles.selectValue}>{checkInStart}</span>
                    </div>
                    <FaChevronRight size={14} style={{transform: isStartOpen ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.2s'}} color="#222222" />
                    
                    {isStartOpen && (
                      <div className={styles.dropdownMenu}>
                        {['9:00 am', '10:00 am', '11:00 am', '1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm', '5:00 pm'].map(time => (
                          <div 
                            key={time} 
                            className={styles.dropdownItem} 
                            onClick={(e) => {
                               e.stopPropagation();
                               setCheckInStart(time);
                               setIsStartOpen(false);
                            }}
                          >
                            {time}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.customSelectBox} style={{marginTop: '16px', position: 'relative'}} onClick={() => setIsEndOpen(!isEndOpen)}>
                    <div className={styles.selectContent}>
                      <span className={styles.selectLabel}>End time</span>
                      <span className={styles.selectValue}>{checkInEnd}</span>
                    </div>
                    <FaChevronRight size={14} style={{transform: isEndOpen ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.2s'}} color="#222222" />
                    
                    {isEndOpen && (
                      <div className={styles.dropdownMenu}>
                        {['Flexible', '6:00 pm', '8:00 pm', '10:00 pm', '12:00 am'].map(time => (
                          <div 
                            key={time} 
                            className={styles.dropdownItem} 
                            onClick={(e) => {
                               e.stopPropagation();
                               setCheckInEnd(time);
                               setIsEndOpen(false);
                            }}
                          >
                            {time}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 style={{fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#222222'}}>
                    {isService ? 'Completion / End time' : 'Checkout'}
                  </h4>
                  <div className={styles.customSelectBox} style={{position: 'relative'}} onClick={() => setIsCheckoutOpen(!isCheckoutOpen)}>
                    <div className={styles.selectContent}>
                      <span className={styles.selectLabel}>Time</span>
                      <span className={styles.selectValue}>{checkoutTime}</span>
                    </div>
                    <FaChevronRight size={14} style={{transform: isCheckoutOpen ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.2s'}} color="#222222" />

                    {isCheckoutOpen && (
                      <div className={styles.dropdownMenu}>
                        {['10:00 am', '11:00 am', '12:00 pm', '1:00 pm', '5:00 pm', '7:00 pm'].map(time => (
                          <div 
                            key={time} 
                            className={styles.dropdownItem} 
                            onClick={(e) => {
                               e.stopPropagation();
                               setCheckoutTime(time);
                               setIsCheckoutOpen(false);
                            }}
                          >
                            {time}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              position: 'sticky',
              bottom: 0,
              left: 0,
              right: 0,
              marginTop: '40px',
              padding: '16px 40px',
              borderTop: '1px solid #ebebeb',
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'flex-end',
              zIndex: 10
            }}>
              <button 
                onClick={handleSaveArrivalTimes}
                style={{
                  backgroundColor: hasChanges ? '#222222' : '#dddddd',
                  color: hasChanges ? 'white' : '#717171',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: hasChanges ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
                disabled={!hasChanges || arrivalSaving}
              >
                {arrivalSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
            </>
          )}


          </>
          ) : (
             <div className='row justify-content-center'>
               <div className='col-lg-10'>
                 <div className={styles.rightHeader}>
                   <div>
                     <h1 className={styles.rightTitle}>Languages</h1>
                   </div>
                 </div>
                 <p className={styles.settingsDesc}>
                   For some settings, you can add details in any language you add to your listing. Guests will be shown automatic translations for everything else.
                 </p>
                 
                 <div className={styles.settingsLangItem}>
                   English (Default)
                 </div>
                 
                 <button className={styles.settingsOutlineBtn}>
                   <FaPlus size={12} /> Add a language
                 </button>
               </div>
             </div>
          )}
        </div>
        
        {/* Invisible Overlay to close dropdowns when clicking outside */}
        {(isStartOpen || isEndOpen || isCheckoutOpen) && (
          <div 
            style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99}} 
            onClick={() => { setIsStartOpen(false); setIsEndOpen(false); setIsCheckoutOpen(false); }}
          />
        )}

      </div>

      {/* Full Host Profile Modal (Triggered by About the host card) */}
      {showHostProfileModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowHostProfileModal(false)}>
          <div className={styles.modalBox} style={{maxWidth: '620px'}} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <FaUserCheck color="#ff385c" size={18} />
                <h3 className={styles.modalTitle}>Host Profile & Credentials</h3>
              </div>
              <button type="button" className={styles.modalCloseBtn} onClick={() => setShowHostProfileModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody} style={{gap: '24px'}}>
              {/* Host Hero Badge Card */}
              <div style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: '20px', 
                background: 'linear-gradient(135deg, #fff5f6 0%, #fff 100%)', 
                padding: '20px', 
                borderRadius: '16px',
                border: '1px solid #ffd2d7'
              }}>
                <div style={{position: 'relative'}}>
                  {(listing.host_avatar || user?.avatar) ? (
                    <img 
                      src={listing.host_avatar || user?.avatar} 
                      alt={listing.host_name || user?.name || 'Host'} 
                      style={{width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #ff385c'}}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '50%',
                      backgroundColor: '#222222',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      fontWeight: '700',
                      border: '3px solid #ff385c'
                    }}>
                      {(listing.host_name || user?.name || 'H').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#ff385c',
                    color: 'white',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FaCheckCircle size={13} />
                  </span>
                </div>

                <div style={{flex: 1}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <h2 style={{fontSize: '20px', fontWeight: '800', color: '#222222', margin: 0}}>
                      {listing.host_name || 'Verified Host'}
                    </h2>
                    <span style={{
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}>
                      Verified Host
                    </span>
                  </div>

                  <p style={{fontSize: '13px', color: '#717171', margin: '4px 0 8px 0'}}>
                    {listing.years_experience ? `${listing.years_experience} years of professional hosting experience` : 'Airbnb community host since 2026'}
                  </p>

                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: '#4b5563'}}>
                    <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                      <FaMapMarkerAlt color="#ff385c" size={12} /> {listing.city || 'Jaipur, Rajasthan'}
                    </span>
                    {listing.host_phone && (
                      <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                        <FaPhoneAlt color="#222222" size={11} /> {listing.host_phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Host Intro / Bio */}
              <div>
                <h4 style={{fontSize: '15px', fontWeight: '700', color: '#222222', marginBottom: '8px'}}>
                  About Me & Hosting Philosophy
                </h4>
                <p style={{fontSize: '14px', lineHeight: '1.6', color: '#374151', margin: 0, backgroundColor: '#f9fafb', padding: '14px 16px', borderRadius: '12px', border: '1px solid #f3f4f6'}}>
                  {listing.host_intro || 'Welcome! I take pride in providing seamless experiences, ensuring clear communication, cleanliness, and hospitality that exceeds your expectations.'}
                </p>
              </div>

              {/* Host Qualifications */}
              {listing.host_qualifications && (
                <div>
                  <h4 style={{fontSize: '15px', fontWeight: '700', color: '#222222', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <FaGraduationCap color="#2563eb" size={16} /> Qualifications & Expertise
                  </h4>
                  <p style={{fontSize: '14px', lineHeight: '1.6', color: '#374151', margin: 0, backgroundColor: '#f9fafb', padding: '14px 16px', borderRadius: '12px', border: '1px solid #f3f4f6'}}>
                    {listing.host_qualifications}
                  </p>
                </div>
              )}

              {/* Host Recognition / Awards */}
              {listing.host_recognition && (
                <div>
                  <h4 style={{fontSize: '15px', fontWeight: '700', color: '#222222', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <FaAward color="#f59e0b" size={16} /> Awards & Community Recognition
                  </h4>
                  <p style={{fontSize: '14px', lineHeight: '1.6', color: '#374151', margin: 0, backgroundColor: '#f9fafb', padding: '14px 16px', borderRadius: '12px', border: '1px solid #f3f4f6'}}>
                    {listing.host_recognition}
                  </p>
                </div>
              )}

              {/* Hosting Details & Safety Badges */}
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px'}}>
                <div style={{border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 14px'}}>
                  <div style={{fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600'}}>Hosting Status</div>
                  <div style={{fontSize: '14px', fontWeight: '700', color: '#16a34a', marginTop: '2px'}}>
                    ● {listing.status || 'Active'}
                  </div>
                </div>

                <div style={{border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 14px'}}>
                  <div style={{fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600'}}>Identity Verified</div>
                  <div style={{fontSize: '14px', fontWeight: '700', color: '#222222', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px'}}>
                    <FaCheckCircle color="#16a34a" size={13} /> Confirmed
                  </div>
                </div>

                <div style={{border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 14px'}}>
                  <div style={{fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600'}}>Hosting As</div>
                  <div style={{fontSize: '14px', fontWeight: '700', color: '#222222', marginTop: '2px'}}>
                    {listing.hosting_as_business === 'yes' ? 'Registered Business' : 'Individual Host'}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className={styles.modalSaveBtn} 
                onClick={() => setShowHostProfileModal(false)}
                style={{minWidth: '100px'}}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Language Selection Modal (Triggered by plus icon on Languages screen) */}
      {showLanguageModal && (
        <div
          className={hostSetupStyles.modalOverlay}
          onClick={() => setShowLanguageModal(false)}
          style={{ zIndex: 9999 }}
        >
          <div
            className={hostSetupStyles.offeringModalDialog}
            style={{ maxWidth: '520px', width: '92%', borderRadius: '20px', overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={hostSetupStyles.offeringModalHeader} style={{ padding: '20px 24px', borderBottom: '1px solid #ebebeb' }}>
              <div style={{ width: '28px' }}></div>
              <span className={hostSetupStyles.offeringModalHeaderTitle} style={{ fontSize: '17px', fontWeight: 700 }}>
                Languages you speak
              </span>
              <button
                className={hostSetupStyles.offeringModalCloseBtn}
                onClick={() => setShowLanguageModal(false)}
              >
                <IoMdClose size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', maxHeight: '420px', overflowY: 'auto' }}>
              <p style={{ fontSize: '14px', color: '#717171', margin: '0 0 20px 0' }}>
                Select all the languages you are fluent in and can use to communicate with guests.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {availableLanguagesList.map((lang) => {
                  const isChecked = selectedLanguages.includes(lang);
                  return (
                    <label
                      key={lang}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: isChecked ? '1.5px solid #222222' : '1px solid #e5e7eb',
                        backgroundColor: isChecked ? '#f9fafb' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onClick={() => {
                        let updated;
                        if (isChecked) {
                          if (selectedLanguages.length === 1) return; // Keep at least one
                          updated = selectedLanguages.filter(l => l !== lang);
                        } else {
                          updated = [...selectedLanguages, lang];
                        }
                        saveLanguagesToDb(updated);
                      }}
                    >
                      <span style={{ fontSize: '15px', fontWeight: isChecked ? 600 : 400, color: '#222222' }}>
                        {lang}
                      </span>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '6px',
                        border: isChecked ? '2px solid #222222' : '2px solid #d1d5db',
                        backgroundColor: isChecked ? '#222222' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff'
                      }}>
                        {isChecked && <FaCheck size={11} />}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #ebebeb', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className={styles.titleSaveBtn}
                style={{ width: '100%', borderRadius: '10px', padding: '12px 0' }}
                onClick={() => setShowLanguageModal(false)}
              >
                Save languages
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offering Modal (Phase 1: Add a title & Phase 2: Add details) */}
      {showOfferingModal && (
        <div
          className={hostSetupStyles.modalOverlay}
          onClick={() => setShowOfferingModal(false)}
          style={{ zIndex: 9999 }}
        >
          <div
            className={hostSetupStyles.offeringModalDialog}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={hostSetupStyles.offeringModalHeader}>
              <div style={{ width: '32px' }}></div>
              <span className={hostSetupStyles.offeringModalHeaderTitle}>
                {offeringModalPhase === "title" ? "Add a title" : "Add details"}
              </span>
              <button
                className={hostSetupStyles.offeringModalCloseBtn}
                onClick={() => setShowOfferingModal(false)}
              >
                <IoMdClose size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className={hostSetupStyles.offeringModalBody}>
              {offeringModalPhase === "title" ? (
                /* Phase 1: Add a title */
                <div className={hostSetupStyles.offeringModalBodyCenter}>
                  <div
                    className={hostSetupStyles.offeringIconLargeBox}
                    onClick={() => setActiveOfferingDetailModal("photo")}
                    style={{ cursor: 'pointer', overflow: 'hidden' }}
                    title="Choose a photo"
                  >
                    {offeringForm.image ? (
                      <img
                        src={offeringForm.image}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 10h18v4H3z" rx="1" />
                        <path d="M5 14v6M19 14v6M8 14v6M16 14v6" />
                        <path d="M7 10V7a2 2 0 0 1 2-2h1" />
                      </svg>
                    )}
                  </div>

                  <input
                    type="text"
                    className={hostSetupStyles.offeringInputGiant}
                    placeholder="Service title"
                    value={offeringForm.title}
                    maxLength={32}
                    autoFocus
                    onChange={(e) =>
                      setOfferingForm({ ...offeringForm, title: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && offeringForm.title.trim()) {
                        setOfferingModalPhase("details");
                      }
                    }}
                  />

                  <div style={{ fontSize: '13px', color: '#717171', fontWeight: 600 }}>
                    {offeringForm.title.length}/32 <span style={{ fontWeight: 400 }}>available</span>
                  </div>
                </div>
              ) : (
                /* Phase 2: Add details */
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
                    <div
                      className={hostSetupStyles.offeringIconLargeBox}
                      onClick={() => setActiveOfferingDetailModal("photo")}
                      style={{ width: '64px', height: '64px', borderRadius: '16px', marginBottom: '16px', cursor: 'pointer', overflow: 'hidden' }}
                      title="Choose a photo"
                    >
                      {offeringForm.image ? (
                        <img
                          src={offeringForm.image}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 10h18v4H3z" rx="1" />
                          <path d="M5 14v6M19 14v6M8 14v6M16 14v6" />
                          <path d="M7 10V7a2 2 0 0 1 2-2h1" />
                        </svg>
                      )}
                    </div>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#222', textAlign: 'center', margin: 0 }}>
                      {offeringForm.title || "Offering"}
                    </h2>
                  </div>

                  {/* Description Section */}
                  <div
                    className={hostSetupStyles.offeringDetailSection}
                    onClick={() => {
                      setTempDescription(offeringForm.description || "");
                      setActiveOfferingDetailModal("description");
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={hostSetupStyles.offeringSectionLabel}>Description</div>
                    <div
                      style={{
                        fontSize: '15px',
                        color: offeringForm.description ? '#222' : '#717171',
                        lineHeight: '1.4',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        minHeight: '22px'
                      }}
                    >
                      {offeringForm.description || "Add a description"}
                    </div>
                  </div>

                  {/* Type of service Section */}
                  <div
                    className={hostSetupStyles.offeringDetailSection}
                    onClick={() => {
                      setTempServiceType(
                        offeringForm.serviceType ||
                        listing.category ||
                        "Standard service"
                      );
                      setActiveOfferingDetailModal("service_type");
                    }}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <div className={hostSetupStyles.offeringSectionLabel} style={{ margin: 0 }}>Type of service</div>
                    <span style={{ fontSize: '15px', color: offeringForm.serviceType ? '#222' : '#717171', fontWeight: 500 }}>
                      {offeringForm.serviceType || "Select"}
                    </span>
                  </div>

                  {/* Price Section */}
                  <div className={hostSetupStyles.offeringDetailSection}>
                    <div className={hostSetupStyles.offeringSectionLabel}>Price</div>
                    <div className={hostSetupStyles.offeringPriceRow}>
                      <div
                        className={hostSetupStyles.offeringPriceInputWrap}
                        onClick={() => {
                          setTempPrice(offeringForm.price || "");
                          setShowOfferingPriceBreakdown(false);
                          setActiveOfferingDetailModal("price");
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <span>₹</span>
                        <span style={{ minWidth: '30px', color: offeringForm.price ? '#222' : '#b0b0b0' }}>
                          {offeringForm.price || "0"}
                        </span>
                      </div>

                      <div
                        className={hostSetupStyles.offeringPriceTypeSelect}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTempPriceType(offeringForm.priceType || "Per guest");
                          setActiveOfferingDetailModal("pricing_option");
                        }}
                      >
                        <span>{offeringForm.priceType || "Per guest"}</span>
                        <FaChevronDown size={11} color="#717171" />
                      </div>
                    </div>
                  </div>

                  {/* Number of guests Section */}
                  <div
                    className={hostSetupStyles.offeringDetailSection}
                    onClick={() => {
                      setTempGuests(parseInt(offeringForm.maxGuests) || 1);
                      setActiveOfferingDetailModal("guests");
                    }}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <div className={hostSetupStyles.offeringSectionLabel} style={{ margin: 0 }}>Number of guests</div>
                    <span style={{ fontSize: '15px', color: offeringForm.maxGuests ? '#222' : '#717171', fontWeight: 500 }}>
                      {offeringForm.maxGuests ? `${offeringForm.maxGuests} guests` : "Set guest limit"}
                    </span>
                  </div>

                  {/* Duration Section */}
                  <div
                    className={hostSetupStyles.offeringDetailSection}
                    onClick={() => {
                      setTempDurationHours(offeringForm.durationHours || 0);
                      setTempDurationMinutes(offeringForm.durationMinutes !== undefined ? offeringForm.durationMinutes : 30);
                      setActiveOfferingDetailModal("duration");
                    }}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <div className={hostSetupStyles.offeringSectionLabel} style={{ margin: 0 }}>Duration</div>
                    <span style={{ fontSize: '15px', color: offeringForm.duration ? '#222' : '#717171', fontWeight: 500 }}>
                      {offeringForm.duration || "Set a duration"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className={hostSetupStyles.offeringModalFooter}>
              {offeringModalPhase === "title" ? (
                <>
                  <span className={hostSetupStyles.offeringGetTips}>Get tips</span>
                  <button
                    className={`${hostSetupStyles.offeringDoneBtn} ${!offeringForm.title.trim() ? hostSetupStyles.offeringDoneBtnDisabled : ""}`}
                    disabled={!offeringForm.title.trim()}
                    onClick={() => setOfferingModalPhase("details")}
                  >
                    Next
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className={hostSetupStyles.offeringRemoveBtn}
                    onClick={() => {
                      const currentOfferings = Array.isArray(listing.service_offerings) ? [...listing.service_offerings] : [];
                      if (editingOfferingIndex !== null) {
                        const updated = currentOfferings.filter((_, idx) => idx !== editingOfferingIndex);
                        saveOfferingsToDb(updated);
                      }
                      setShowOfferingModal(false);
                    }}
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    className={`${hostSetupStyles.offeringDoneBtn} ${!offeringForm.title.trim() ? hostSetupStyles.offeringDoneBtnDisabled : ""}`}
                    disabled={!offeringForm.title.trim()}
                    onClick={() => {
                      const newOffering = { 
                        ...offeringForm,
                        name: offeringForm.title,
                        price: parseInt(offeringForm.price) || 200,
                        price_per_guest: parseInt(offeringForm.price) || 200
                      };
                      const currentOfferings = Array.isArray(listing.service_offerings) ? [...listing.service_offerings] : [];
                      let updated;
                      if (editingOfferingIndex !== null) {
                        updated = currentOfferings.map((item, idx) =>
                          idx === editingOfferingIndex ? newOffering : item
                        );
                      } else {
                        updated = [...currentOfferings, newOffering];
                      }
                      saveOfferingsToDb(updated);
                      setShowOfferingModal(false);
                    }}
                  >
                    Done
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 1: Set a duration */}
      {activeOfferingDetailModal === "duration" && (
        <div
          className={hostSetupStyles.detailSubModalOverlay}
          onClick={() => setActiveOfferingDetailModal(null)}
        >
          <div
            className={hostSetupStyles.detailSubModalDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={hostSetupStyles.detailSubModalHeader}>
              <span className={hostSetupStyles.detailSubModalTitle}>Set a duration</span>
              <button
                className={hostSetupStyles.detailSubModalClose}
                onClick={() => setActiveOfferingDetailModal(null)}
              >
                <IoMdClose size={18} />
              </button>
            </div>

            <div className={hostSetupStyles.detailSubModalBody}>
              <div className={hostSetupStyles.detailSelectBoxRow}>
                {/* Hours Selector */}
                <div className={hostSetupStyles.detailSelectFieldWrap}>
                  <div className={hostSetupStyles.detailSelectFieldLabel}>Hours</div>
                  <select
                    className={hostSetupStyles.detailSelectNative}
                    value={tempDurationHours}
                    onChange={(e) => setTempDurationHours(parseInt(e.target.value) || 0)}
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                {/* Minutes Selector */}
                <div className={hostSetupStyles.detailSelectFieldWrap}>
                  <div className={hostSetupStyles.detailSelectFieldLabel}>Minutes</div>
                  <select
                    className={hostSetupStyles.detailSelectNative}
                    value={tempDurationMinutes}
                    onChange={(e) => setTempDurationMinutes(parseInt(e.target.value) || 0)}
                  >
                    {[0, 15, 30, 45].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                className={hostSetupStyles.detailSubModalSaveBtn}
                onClick={() => {
                  const formatted =
                    tempDurationHours > 0
                      ? `${tempDurationHours} hr${tempDurationHours > 1 ? "s" : ""}${tempDurationMinutes > 0 ? ` ${tempDurationMinutes} mins` : ""}`
                      : `${tempDurationMinutes} mins`;
                  setOfferingForm((prev) => ({
                    ...prev,
                    durationHours: tempDurationHours,
                    durationMinutes: tempDurationMinutes,
                    duration: formatted,
                  }));
                  setActiveOfferingDetailModal(null);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 2: Number of guests */}
      {activeOfferingDetailModal === "guests" && (
        <div
          className={hostSetupStyles.detailSubModalOverlay}
          onClick={() => setActiveOfferingDetailModal(null)}
        >
          <div
            className={hostSetupStyles.detailSubModalDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={hostSetupStyles.detailSubModalHeader}>
              <span className={hostSetupStyles.detailSubModalTitle}>Number of guests</span>
              <button
                className={hostSetupStyles.detailSubModalClose}
                onClick={() => setActiveOfferingDetailModal(null)}
              >
                <IoMdClose size={18} />
              </button>
            </div>

            <div className={hostSetupStyles.detailSubModalBody}>
              <div className={hostSetupStyles.detailGuestsCounterWrap}>
                <button
                  type="button"
                  className={hostSetupStyles.detailGuestsCircleBtn}
                  disabled={tempGuests <= 1}
                  onClick={() => setTempGuests((prev) => Math.max(1, prev - 1))}
                >
                  <FaMinus size={14} />
                </button>
                <span className={hostSetupStyles.detailGuestsBigNumber}>{tempGuests}</span>
                <button
                  type="button"
                  className={hostSetupStyles.detailGuestsCircleBtn}
                  disabled={tempGuests >= 100}
                  onClick={() => setTempGuests((prev) => Math.min(100, prev + 1))}
                >
                  <FaPlus size={14} />
                </button>
              </div>

              <div className={hostSetupStyles.detailGuestsHelperText}>
                You can host up to 100 guests.
              </div>

              <button
                type="button"
                className={hostSetupStyles.detailSubModalSaveBtn}
                onClick={() => {
                  setOfferingForm((prev) => ({
                    ...prev,
                    maxGuests: tempGuests,
                  }));
                  setActiveOfferingDetailModal(null);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 3: Choose a pricing option (Per guest / Fixed price) */}
      {activeOfferingDetailModal === "pricing_option" && (
        <div
          className={hostSetupStyles.detailSubModalOverlay}
          onClick={() => setActiveOfferingDetailModal(null)}
        >
          <div
            className={hostSetupStyles.detailSubModalDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={hostSetupStyles.detailSubModalHeader}>
              <span className={hostSetupStyles.detailSubModalTitle}>Choose a pricing option</span>
              <button
                className={hostSetupStyles.detailSubModalClose}
                onClick={() => setActiveOfferingDetailModal(null)}
              >
                <IoMdClose size={18} />
              </button>
            </div>

            <div className={hostSetupStyles.detailSubModalBody}>
              {/* Option 1: Per guest */}
              <div
                className={`${hostSetupStyles.detailPricingOptionCard} ${tempPriceType === "Per guest" ? hostSetupStyles.detailPricingOptionCardSelected : ""}`}
                onClick={() => setTempPriceType("Per guest")}
              >
                <div className={hostSetupStyles.detailPricingOptionTitle}>Per guest</div>
                <div className={hostSetupStyles.detailPricingOptionDesc}>
                  Set the price that each guest will pay and your minimum price per booking.
                </div>
                {tempPriceType === "Per guest" && (
                  <div className={hostSetupStyles.detailPricingOptionCheck}>
                    <FaCheck size={16} />
                  </div>
                )}
              </div>

              {/* Option 2: Fixed price */}
              <div
                className={`${hostSetupStyles.detailPricingOptionCard} ${tempPriceType === "Fixed price" ? hostSetupStyles.detailPricingOptionCardSelected : ""}`}
                onClick={() => setTempPriceType("Fixed price")}
              >
                <div className={hostSetupStyles.detailPricingOptionTitle}>Fixed price</div>
                <div className={hostSetupStyles.detailPricingOptionDesc}>
                  Set a price for any number of guests up to your limit.
                </div>
                {tempPriceType === "Fixed price" && (
                  <div className={hostSetupStyles.detailPricingOptionCheck}>
                    <FaCheck size={16} />
                  </div>
                )}
              </div>

              <button
                type="button"
                className={hostSetupStyles.detailSubModalSaveBtn}
                onClick={() => {
                  setOfferingForm((prev) => ({
                    ...prev,
                    priceType: tempPriceType,
                  }));
                  setActiveOfferingDetailModal(null);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 4: Price per guest / Price modal */}
      {activeOfferingDetailModal === "price" && (
        <div
          className={hostSetupStyles.detailSubModalOverlay}
          onClick={() => setActiveOfferingDetailModal(null)}
        >
          <div
            className={hostSetupStyles.detailSubModalDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={hostSetupStyles.detailSubModalHeader}>
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px",
                  color: "#717171",
                }}
                onClick={() => alert("Enter the total amount per guest or booking.")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </button>
              <span className={hostSetupStyles.detailSubModalTitle}>
                {offeringForm.priceType === "Fixed price" ? "Fixed price" : "Price per guest"}
              </span>
              <button
                className={hostSetupStyles.detailSubModalClose}
                onClick={() => setActiveOfferingDetailModal(null)}
              >
                <IoMdClose size={18} />
              </button>
            </div>

            <div className={hostSetupStyles.detailSubModalBody}>
              {/* Giant Price Display with Clean User Input */}
              <div className={hostSetupStyles.detailPriceCenterInputWrap}>
                <span className={hostSetupStyles.detailPriceCurrencySymbol}>₹</span>
                <input
                  type="number"
                  min="0"
                  id="offeringPriceModalInput"
                  placeholder="0"
                  className={hostSetupStyles.detailPriceGiantInput}
                  value={tempPrice}
                  onChange={(e) => setTempPrice(e.target.value)}
                  style={{
                    width: tempPrice ? `${Math.max(1, String(tempPrice).length) * 32 + 15}px` : '40px',
                    maxWidth: '220px',
                  }}
                />
                <button
                  type="button"
                  className={hostSetupStyles.offeringPriceEditPencil}
                  onClick={() => {
                    const el = document.getElementById("offeringPriceModalInput");
                    if (el) el.focus();
                  }}
                  title="Edit price"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </button>
              </div>

              {/* Collapsible Earnings Breakdown */}
              {(() => {
                const parsedOfferingPrice = parseInt(tempPrice) || 0;
                const offeringServiceFee = Math.round(parsedOfferingPrice * 0.20);
                const offeringYouEarn = Math.max(0, parsedOfferingPrice - offeringServiceFee);
                return (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '6px', marginBottom: '24px', position: 'relative', zIndex: 10 }}>
                    {showOfferingPriceBreakdown ? (
                      <>
                        <div className={hostSetupStyles.offeringPriceBreakdownBox}>
                          <div className={hostSetupStyles.offeringBreakdownRow}>
                            <span>Base price</span>
                            <span>₹{parsedOfferingPrice}</span>
                          </div>
                          <div className={hostSetupStyles.offeringBreakdownRow}>
                            <span>Airbnb service fee</span>
                            <span>-₹{offeringServiceFee}</span>
                          </div>
                          <div style={{ borderBottom: '1px solid #ebebeb', margin: '4px 0' }} />
                          <div className={hostSetupStyles.offeringBreakdownRowTotal}>
                            <span>You earn</span>
                            <span>₹{offeringYouEarn}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowOfferingPriceBreakdown(false);
                          }}
                          className={hostSetupStyles.offeringShowLessBtn}
                          style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer', padding: '8px 12px', userSelect: 'none' }}
                        >
                          <span>Show less</span>
                          <FaChevronUp size={12} />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowOfferingPriceBreakdown(true);
                        }}
                        className={hostSetupStyles.offeringYouEarnBtn}
                        style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer', padding: '8px 14px', userSelect: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <span>You earn ₹{offeringYouEarn}</span>
                        <FaChevronDown size={13} />
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Footer */}
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
                <span className={hostSetupStyles.offeringGetTips}>Get tips</span>
                <button
                  type="button"
                  className={`${hostSetupStyles.offeringDoneBtn} ${!tempPrice ? hostSetupStyles.detailSubModalSaveBtnDisabled : ''}`}
                  disabled={!tempPrice}
                  onClick={() => {
                    setOfferingForm((prev) => ({
                      ...prev,
                      price: tempPrice,
                    }));
                    setActiveOfferingDetailModal(null);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 5: Choose a type of service */}
      {activeOfferingDetailModal === "service_type" && (
        <div
          className={hostSetupStyles.detailSubModalOverlay}
          onClick={() => setActiveOfferingDetailModal(null)}
        >
          <div
            className={hostSetupStyles.detailSubModalDialog}
            style={{ maxWidth: '480px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={hostSetupStyles.detailSubModalHeader}>
              <div style={{ width: '30px' }}></div>
              <span className={hostSetupStyles.detailSubModalTitle} style={{ fontSize: '20px' }}>
                Choose a type of service
              </span>
              <button
                className={hostSetupStyles.detailSubModalClose}
                onClick={() => setActiveOfferingDetailModal(null)}
              >
                <IoMdClose size={18} />
              </button>
            </div>

            <div className={hostSetupStyles.detailSubModalBody}>
              <div className={hostSetupStyles.detailServiceTypeList}>
                {[
                  { name: "Swedish", icon: "⇡⇡" },
                  { name: "Deep tissue", icon: "↡" },
                  { name: "Hot stone massage", icon: "♨" },
                  { name: "Antenatal", icon: "♡" },
                  { name: "Couples", icon: "⚏" },
                  { name: "Thai", icon: "≋" },
                  { name: "Reflexology", icon: "👣" },
                  { name: "Aromatherapy", icon: "🌸" },
                  { name: "Sports massage", icon: "⚡" },
                  { name: "Standard service", icon: "★" }
                ].map((item) => (
                  <div
                    key={item.name}
                    className={`${hostSetupStyles.detailServiceTypeItem} ${tempServiceType === item.name ? hostSetupStyles.detailServiceTypeItemSelected : ""}`}
                    onClick={() => setTempServiceType(item.name)}
                  >
                    <div className={hostSetupStyles.detailServiceTypeIcon}>
                      <span>{item.icon}</span>
                    </div>
                    <span className={hostSetupStyles.detailServiceTypeName}>{item.name}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className={`${hostSetupStyles.detailSubModalSaveBtn} ${!tempServiceType ? hostSetupStyles.detailSubModalSaveBtnDisabled : ""}`}
                disabled={!tempServiceType}
                onClick={() => {
                  setOfferingForm((prev) => ({
                    ...prev,
                    serviceType: tempServiceType,
                  }));
                  setActiveOfferingDetailModal(null);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 6: Describe your offering modal */}
      {activeOfferingDetailModal === "description" && (
        <div
          className={hostSetupStyles.detailSubModalOverlay}
          onClick={() => setActiveOfferingDetailModal(null)}
        >
          <div
            className={hostSetupStyles.detailSubModalDialog}
            style={{ maxWidth: '580px', width: '92%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={hostSetupStyles.detailSubModalHeader}>
              <div style={{ width: '28px' }}></div>
              <span className={hostSetupStyles.detailSubModalTitle} style={{ fontSize: '16px', fontWeight: 700 }}>
                Describe your offering
              </span>
              <button
                className={hostSetupStyles.detailSubModalClose}
                onClick={() => setActiveOfferingDetailModal(null)}
              >
                <IoMdClose size={18} />
              </button>
            </div>

            <div className={hostSetupStyles.detailSubModalBody} style={{ padding: '20px 28px 24px', alignItems: 'stretch' }}>
              <div className={hostSetupStyles.detailDescriptionWrap}>
                <textarea
                  className={hostSetupStyles.detailDescriptionTextarea}
                  maxLength={500}
                  rows={8}
                  autoFocus
                  placeholder="Tell guests what’s included. For example, “A relaxing service tailored to your needs, including...”"
                  value={tempDescription}
                  onChange={(e) => setTempDescription(e.target.value)}
                />
                <div className={hostSetupStyles.detailDescriptionCounter}>
                  {tempDescription.length}/500 available
                </div>
              </div>

              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '16px', marginTop: '16px' }}>
                <span className={hostSetupStyles.offeringGetTips}>Get tips</span>
                <button
                  type="button"
                  className={`${hostSetupStyles.offeringDoneBtn} ${!tempDescription.trim() ? hostSetupStyles.detailSubModalSaveBtnDisabled : ''}`}
                  disabled={!tempDescription.trim()}
                  onClick={() => {
                    setOfferingForm((prev) => ({
                      ...prev,
                      description: tempDescription.trim(),
                    }));
                    setActiveOfferingDetailModal(null);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 7: Choose a photo modal */}
      {activeOfferingDetailModal === "photo" && (
        <div
          className={hostSetupStyles.detailSubModalOverlay}
          onClick={() => setActiveOfferingDetailModal(null)}
        >
          <div
            className={hostSetupStyles.detailSubModalDialog}
            style={{ maxWidth: '540px', width: '92%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={hostSetupStyles.detailSubModalHeader}>
              <div style={{ width: '28px' }}></div>
              <span className={hostSetupStyles.detailSubModalTitle} style={{ fontSize: '18px', fontWeight: 700 }}>
                Choose a photo
              </span>
              <button
                type="button"
                className={hostSetupStyles.detailSubModalClose}
                onClick={() => setActiveOfferingDetailModal(null)}
              >
                <IoMdClose size={18} />
              </button>
            </div>

            <div className={hostSetupStyles.detailSubModalBody} style={{ padding: '24px 28px 28px', alignItems: 'stretch' }}>
              {listing.photos && listing.photos.length > 0 ? (
                <>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '14px',
                      maxHeight: '380px',
                      overflowY: 'auto',
                      padding: '4px',
                    }}
                  >
                    {listing.photos.map((pic, pIdx) => {
                      const isSelected = offeringForm.image === pic;
                      return (
                        <div
                          key={pIdx}
                          onClick={() => {
                            setOfferingForm((prev) => ({
                              ...prev,
                              image: pic,
                            }));
                            setActiveOfferingDetailModal(null);
                          }}
                          style={{
                            position: 'relative',
                            aspectRatio: '1',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            border: isSelected ? '3px solid #222' : '2px solid #e0e0e0',
                            boxShadow: isSelected ? '0 0 0 2px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <img
                            src={pic}
                            alt={`Option ${pIdx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                          {isSelected && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '6px',
                                right: '6px',
                                background: '#222',
                                color: '#fff',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '11px',
                                fontWeight: 'bold',
                              }}
                            >
                              ✓
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button
                      type="button"
                      className={hostSetupStyles.detailSubModalSaveBtn}
                      style={{ width: 'auto', padding: '10px 24px' }}
                      onClick={() => setActiveOfferingDetailModal(null)}
                    >
                      Done
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#717171' }}>
                  <p>No listing photos available. Upload photos first.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Co-Host Invite Modal */}
      {showCoHostInviteModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowCoHostInviteModal(false)}
        >
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '520px',
              padding: '32px',
              boxShadow: '0 8px 28px rgba(0, 0, 0, 0.28)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#222222', margin: 0 }}>
                Invite a co-host
              </h2>
              <button 
                type="button"
                onClick={() => setShowCoHostInviteModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '50%' }}
              >
                <IoMdClose size={22} color="#222222" />
              </button>
            </div>

            <p style={{ fontSize: '14px', color: '#717171', margin: '0 0 24px 0', lineHeight: '1.45' }}>
              Enter the email address of the person you’d like to invite to help host your experience or service.
            </p>

            <form onSubmit={handleInviteCoHost}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#222222', marginBottom: '8px' }}>
                  Co-host name (optional)
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={coHostForm.name}
                  onChange={(e) => setCoHostForm({ ...coHostForm, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #b0b0b0',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#222222', marginBottom: '8px' }}>
                  Email address <span style={{ color: '#c13515' }}>*</span>
                </label>
                <input 
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={coHostForm.email}
                  onChange={(e) => setCoHostForm({ ...coHostForm, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #b0b0b0',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#222222', marginBottom: '8px' }}>
                  Access permissions
                </label>
                <select
                  value={coHostForm.role}
                  onChange={(e) => setCoHostForm({ ...coHostForm, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #b0b0b0',
                    fontSize: '15px',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Full access">Full access (Manage calendar, messages, pricing)</option>
                  <option value="Calendar and messaging">Calendar and messaging only</option>
                  <option value="Calendar access only">Calendar access only</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowCoHostInviteModal(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '1px solid #222222',
                    backgroundColor: '#ffffff',
                    color: '#222222',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#222222',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Send invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Area / Location Edit Modal */}
      {showLocationEditModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowLocationEditModal(false)}
        >
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '540px',
              padding: '32px',
              boxShadow: '0 8px 28px rgba(0, 0, 0, 0.28)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#222222', margin: 0 }}>
                Edit service area & location
              </h2>
              <button 
                type="button"
                onClick={() => setShowLocationEditModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '50%' }}
              >
                <IoMdClose size={22} color="#222222" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              saveLocationToDb({
                travel_preference: serviceLocationForm.travel_preference,
                service_radius_desc: serviceLocationForm.service_radius_desc,
                street: serviceLocationForm.service_address,
                city: serviceLocationForm.city,
                state: serviceLocationForm.state,
                country: serviceLocationForm.country
              });
            }}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#222222', marginBottom: '8px' }}>
                  Travel preference
                </label>
                <select
                  value={serviceLocationForm.travel_preference}
                  onChange={(e) => setServiceLocationForm({ ...serviceLocationForm, travel_preference: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #b0b0b0',
                    fontSize: '15px',
                    backgroundColor: '#ffffff',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="You travel to guests">You travel to guests</option>
                  <option value="Guests come to your location">Guests come to your location</option>
                  <option value="Both (you travel or guests visit)">Both (you travel or guests visit)</option>
                </select>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#222222', marginBottom: '8px' }}>
                  City
                </label>
                <input 
                  type="text"
                  required
                  value={serviceLocationForm.city}
                  onChange={(e) => setServiceLocationForm({ ...serviceLocationForm, city: e.target.value })}
                  placeholder="e.g. Jaipur"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #b0b0b0',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#222222', marginBottom: '8px' }}>
                  Base address
                </label>
                <input 
                  type="text"
                  value={serviceLocationForm.service_address}
                  onChange={(e) => setServiceLocationForm({ ...serviceLocationForm, service_address: e.target.value })}
                  placeholder="e.g. 1st floor, Vaishali Tower II, 101, Nursery Circle"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #b0b0b0',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#222222', marginBottom: '8px' }}>
                  Service area description
                </label>
                <textarea 
                  rows={2}
                  value={serviceLocationForm.service_radius_desc}
                  onChange={(e) => setServiceLocationForm({ ...serviceLocationForm, service_radius_desc: e.target.value })}
                  placeholder="e.g. Within a 1-hour drive from 1st floor, Vaishali Tower II, 101, Nursery Circle"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #b0b0b0',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowLocationEditModal(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '1px solid #222222',
                    backgroundColor: '#ffffff',
                    color: '#222222',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#222222',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Online Profiles Add/Edit Link Modal */}
      {showAddProfileModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowAddProfileModal(false)}
        >
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '520px',
              padding: '32px',
              boxShadow: '0 8px 28px rgba(0, 0, 0, 0.28)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#222222', margin: 0 }}>
                Online profile link
              </h2>
              <button 
                type="button"
                onClick={() => setShowAddProfileModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '50%' }}
              >
                <IoMdClose size={22} color="#222222" />
              </button>
            </div>

            <p style={{ fontSize: '14px', color: '#717171', margin: '0 0 24px 0', lineHeight: '1.45' }}>
              Add a URL to your website, social media, review page, or portfolio to verify your skills.
            </p>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (newProfileLink.trim()) {
                saveOnlineProfilesToDb(newProfileLink.trim());
              }
            }}>
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#222222', marginBottom: '8px' }}>
                  Website or Profile URL <span style={{ color: '#c13515' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <FaLink size={14} color="#717171" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%) rotate(-45deg)' }} />
                  <input 
                    type="text"
                    required
                    placeholder="https://facebook.com/your-business or https://yourdomain.com"
                    value={newProfileLink}
                    onChange={(e) => setNewProfileLink(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 40px',
                      borderRadius: '8px',
                      border: '1px solid #b0b0b0',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    autoFocus
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddProfileModal(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '1px solid #222222',
                    backgroundColor: '#ffffff',
                    color: '#222222',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#222222',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Save link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simultaneous Bookings Counter Modal matching user's screenshot */}
      {showSimultaneousModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowSimultaneousModal(false)}
        >
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '460px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.28)',
              overflow: 'hidden',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px 24px',
              position: 'relative'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#222222',
                margin: 0,
                textAlign: 'center'
              }}>
                Simultaneous bookings
              </h3>
              <button 
                type="button"
                onClick={() => setShowSimultaneousModal(false)}
                style={{
                  position: 'absolute',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IoMdClose size={20} color="#222222" />
              </button>
            </div>

            {/* Modal Body: Minus, Huge Number, Plus, and label */}
            <div style={{
              padding: '48px 32px 56px 32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '40px',
                marginBottom: '16px'
              }}>
                {/* Decrement Button */}
                <button
                  type="button"
                  onClick={() => setTempSimultaneousCount(prev => Math.max(1, prev - 1))}
                  disabled={tempSimultaneousCount <= 1}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: '#f2f2f2',
                    color: '#222222',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: tempSimultaneousCount <= 1 ? 'not-allowed' : 'pointer',
                    opacity: tempSimultaneousCount <= 1 ? 0.35 : 1,
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => { if (tempSimultaneousCount > 1) e.currentTarget.style.backgroundColor = '#e5e5e5'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f2f2f2'; }}
                >
                  <FaMinus size={13} color="#222222" />
                </button>

                {/* Big Centered Number */}
                <div style={{
                  fontSize: '84px',
                  fontWeight: '800',
                  color: '#222222',
                  lineHeight: '1',
                  minWidth: '60px',
                  textAlign: 'center',
                  letterSpacing: '-2px'
                }}>
                  {tempSimultaneousCount}
                </div>

                {/* Increment Button */}
                <button
                  type="button"
                  onClick={() => setTempSimultaneousCount(prev => Math.min(20, prev + 1))}
                  disabled={tempSimultaneousCount >= 20}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: '#f2f2f2',
                    color: '#222222',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: tempSimultaneousCount >= 20 ? 'not-allowed' : 'pointer',
                    opacity: tempSimultaneousCount >= 20 ? 0.35 : 1,
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => { if (tempSimultaneousCount < 20) e.currentTarget.style.backgroundColor = '#e5e5e5'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f2f2f2'; }}
                >
                  <FaPlus size={13} color="#222222" />
                </button>
              </div>

              {/* Subtitle label under big number */}
              <p style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#222222',
                margin: 0,
                textAlign: 'center'
              }}>
                booking{tempSimultaneousCount > 1 ? 's' : ''} at a time
              </p>
            </div>

            {/* Modal Footer with Cancel & Save Button */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              borderTop: '1px solid #ebebeb'
            }}>
              <button
                type="button"
                onClick={() => setShowSimultaneousModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#222222',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: '8px 12px'
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => saveSimultaneousCountToDb(tempSimultaneousCount)}
                style={{
                  padding: '12px 28px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#222222',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offcanvas Verification & Publishing Steps */}
      <div className={`offcanvas offcanvas-end ${isOffcanvasOpen ? 'show' : ''}`} tabIndex="-1" style={{ visibility: isOffcanvasOpen ? 'visible' : 'hidden', width: '450px', borderLeft: 'none', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)' }}>
        <div className={styles.offcanvasHeader}>
          <div style={{width: '24px'}}></div>
          <h5 className={styles.offcanvasTitle}>
            Steps to publish<br/>
            <span style={{fontSize: '12px', color: '#717171', fontWeight: '400'}}>
              {listing.title || 'Your Listing'}
            </span>
          </h5>
          <button className={styles.offcanvasClose} onClick={() => setIsOffcanvasOpen(false)}>
            <FaTimes />
          </button>
        </div>
        <div className={styles.offcanvasBody}>
          <div className={styles.publishCard}>
            <p className={styles.publishCardSub}>
              Started on {new Date(listing.created_at || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <h4 className={styles.publishCardTitle}>Identity verification</h4>
            <p className={styles.publishCardStatus}>
              {listing.status === 'Active' ? 'Verified' : 'Ready'}
            </p>
            {(listing.host_avatar || user?.avatar) ? (
              <img 
                src={listing.host_avatar || user?.avatar} 
                alt="Host" 
                className={styles.publishCardImg} 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#222222',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '12px auto',
                fontSize: '22px',
                fontWeight: '700'
              }}>
                {(listing.host_name || user?.name || 'H').charAt(0).toUpperCase()}
              </div>
            )}
            <h3 className={styles.publishCardCenterTitle}>
              {listing.status === 'Active' ? 'Your Identity is Verified' : 'Verify your identity'}
            </h3>
            <p className={styles.publishCardCenterDesc}>
              {listing.status === 'Active' 
                ? 'Your host account is in good standing and ready to accept bookings.'
                : 'We gather some information to help confirm you are you.'}
            </p>
            {listing.status !== 'Active' && (
              <button className={styles.publishBtn} onClick={() => setIsOffcanvasOpen(false)}>
                Get started
              </button>
            )}
          </div>
          <div className={styles.publishCardSmall}>
            <div>
              <p className={styles.publishCardSub}>Host Account</p>
              <h4 className={styles.publishCardTitle}>Phone number confirmation</h4>
              <p className={styles.publishCardStatus}>Completed</p>
            </div>
            <FaCheckCircle color="#008a05" size={24} />
          </div>
          <div className={styles.publishCardSmall}>
            <div>
              <h4 className={styles.publishCardTitle}>Date of birth confirmation</h4>
              <p className={styles.publishCardStatus}>Completed</p>
            </div>
            <FaCheckCircle color="#008a05" size={24} />
          </div>
        </div>
      </div>
      {isOffcanvasOpen && <div className="offcanvas-backdrop fade show" onClick={() => setIsOffcanvasOpen(false)}></div>}

      {/* Service Gallery Photo Detail Modal matching user screenshot */}
      {activePhotoDetail && (
        <div className={styles.photoDetailOverlay}>
          {/* Top Left Close 'x' Button */}
          <div className={styles.photoDetailTopBar}>
            <button
              type="button"
              className={styles.photoDetailCloseBtn}
              onClick={() => setActivePhotoDetail(null)}
              title="Close"
            >
              <IoMdClose size={20} />
            </button>
          </div>

          {/* Center Main Content */}
          <div className={styles.photoDetailContent}>
            {/* Image Preview with 'Cover in review' badge */}
            <div className={styles.photoDetailImgContainer}>
              <img
                src={activePhotoDetail.url}
                alt="Selected preview"
                className={styles.photoDetailImg}
              />
              <div className={styles.photoDetailBadge}>
                <span className={styles.photoDetailBadgeDot}></span>
                <span>{activePhotoDetail.isCover ? 'Cover in review' : 'Photo in review'}</span>
              </div>
            </div>

            {/* Caption Input Box */}
            <div className={styles.photoDetailCaptionBox}>
              <input
                type="text"
                placeholder="Caption"
                value={photoCaptionInput}
                maxLength={250}
                onChange={(e) => setPhotoCaptionInput(e.target.value)}
                className={styles.photoDetailCaptionInput}
              />
              <div className={styles.photoDetailCharCounter}>
                {250 - (photoCaptionInput || '').length} characters available
              </div>
            </div>
          </div>

          {/* Bottom Footer with Save Button */}
          <div className={styles.photoDetailFooter}>
            <button
              type="button"
              className={styles.titleCancelBtn}
              onClick={() => setActivePhotoDetail(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSavingPhotoCaption}
              onClick={savePhotoCaptionToDb}
              className={styles.customLinkSaveBtn}
            >
              {isSavingPhotoCaption ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default HostListingEditor;