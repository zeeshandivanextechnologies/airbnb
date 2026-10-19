import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaAirbnb, FaRegCalendarCheck, FaBolt, FaMapMarkerAlt, FaPencilAlt, FaChevronDown, FaChevronUp, FaQuestionCircle, FaCheck, FaStar, FaHome } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import styles from '../../components/styles/HostStep1.module.css';

const defaultBookingOptions = [
  {
    id: 'approve',
    title: 'Approve your first 5 bookings',
    badge: 'Recommended',
    description: 'Start by reviewing reservation requests, then switch to Instant Book so guests can book automatically.',
    icon: <FaRegCalendarCheck />
  },
  {
    id: 'instant',
    title: 'Use Instant Book',
    badge: '',
    description: 'Let guests book automatically.',
    icon: <FaBolt />
  }
];

const getBookingIcon = (iconName) => {
  switch (iconName?.toLowerCase()) {
    case 'calendar':
    case 'regcalendarcheck':
    case 'approve':
      return <FaRegCalendarCheck />;
    case 'bolt':
    case 'instant':
      return <FaBolt />;
    case 'star':
      return <FaStar />;
    case 'home':
      return <FaHome />;
    default:
      return <FaRegCalendarCheck />;
  }
};

export default function HostStep3() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);
  const [step, setStep] = useState(() => {
    const qStep = parseInt(searchParams.get('step'), 10);
    if (!isNaN(qStep) && qStep >= 1 && qStep <= 6) return qStep;
    try {
      const stored = localStorage.getItem('host_step3_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.lastStep) return parsed.lastStep;
      }
    } catch (e) {}
    return 1;
  });

  // Sync step if URL search parameter changes
  useEffect(() => {
    const qStep = parseInt(searchParams.get('step'), 10);
    if (!isNaN(qStep) && qStep >= 1 && qStep <= 6) {
      setStep(qStep);
    }
  }, [searchParams]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSetting, setBookingSetting] = useState('approve');

  // Dynamic Backend State for Step 2 Booking Settings
  const [bookingOptionsList, setBookingOptionsList] = useState([]);
  const [step2BookingSettings, setStep2BookingSettings] = useState({
    title: 'Pick your booking settings',
    subtitle: 'You can change this at any time.',
    learnMoreLink: '#'
  });

  // Dynamic Backend State for Step 3 Pricing Settings
  const [step3PricingSettings, setStep3PricingSettings] = useState({
    title: 'Now, set your prices',
    subtitle: 'These suggestions are based on guest demand for similar listings.',
    basePrice: '',
    suggestedPrice: 2028,
    weekendAdjustment: 6,
    learnMoreLink: '#'
  });

  // Dynamic Backend State for Step 3 Modals (Map / Compare similar listings modal)
  const [step3ModalsSettings, setStep3ModalsSettings] = useState({
    mapTitle: 'Compare similar listings',
    mapSubtitle: 'Entire home/flat · 1 bedroom',
    mapDates: '1 Oct 2025 - 1 Oct 2026',
    mapDesc: 'Most listings with reservations during these dates were an average of ₹962 - ₹3,864 per night.',
    learnMoreLink: '#'
  });

  // Dynamic Backend State for Step 4 Discounts Settings & List
  const [discountsList, setDiscountsList] = useState([]);
  const [step4DiscountsSettings, setStep4DiscountsSettings] = useState({
    title: 'Add discounts',
    subtitle: 'Help your place stand out to get booked faster and earn your first reviews.',
    footerNote: 'Only one discount will be applied per stay.',
    learnMoreLink: '#'
  });

  // Dynamic Backend State for Step 5 Safety Settings & Master Safety Items
  const [safetyItemsList, setSafetyItemsList] = useState([]);
  const [step5SafetySettings, setStep5SafetySettings] = useState({
    title: 'Share safety details',
    subtitle: 'Does your place have any of these?',
    toggleLabel: 'Important things to know',
    toggleSubtitle: "Security cameras that monitor indoor spaces are not allowed even if they're turned off. All exterior security cameras must be disclosed.",
    learnMoreLink: '#'
  });

  // Dynamic Backend State for Step 5 Camera Details Modal
  const [step5CameraModalSettings, setStep5CameraModalSettings] = useState({
    title: 'Tell guests about your exterior security cameras',
    subtitle: 'Describe the area that each camera monitors, such as the back garden or pool.',
    maxChars: 300,
    learnMoreLink: '#'
  });

  // Dynamic Backend State for Step 6 Legal & Address Final Details Settings
  const [step6LegalSettings, setStep6LegalSettings] = useState({
    title: 'Provide a few final details',
    subtitle: 'This is required to comply with financial regulations and helps us prevent fraud.',
    addressHeading: "What's your residential address?",
    addressSub: "Guests won't see this information.",
    learnMoreLink: '#'
  });

  // Dynamic Backend State for Step 6 Business Modal Settings
  const [step6BusinessModalSettings, setStep6BusinessModalSettings] = useState({
    modalTitle: 'Hosting as a business',
    modalDesc: 'Select "yes" if you\'re registered as a business with your government and have a business registration number or tax ID.',
    sectionTitle: 'Are you hosting as a business?',
    sectionSub: 'This means your business is most likely registered with your government.',
    learnMoreLink: '#'
  });

  useEffect(() => {
    const fetchStep3Data = async () => {
      try {
        // 1. Fetch dynamic booking options
        const optRes = await fetch('http://localhost:5000/api/listings/master-booking-options');
        const optData = await optRes.json();
        if (optData.success && Array.isArray(optData.data) && optData.data.length > 0) {
          setBookingOptionsList(optData.data);
          // if current selection not valid, default to first option's key
          if (!optData.data.some(o => o.key === bookingSetting)) {
            setBookingSetting(optData.data[0].key);
          }
        }

        // 2. Fetch Step 2 Settings
        const setRes = await fetch('http://localhost:5000/api/listings/step-settings/step3_step2_booking');
        const setData = await setRes.json();
        if (setData.success && setData.data) {
          setStep2BookingSettings({
            title: setData.data.title || 'Pick your booking settings',
            subtitle: setData.data.subtitle || 'You can change this at any time.',
            learnMoreLink: setData.data.learn_more_link || '#'
          });
        }

        // 3. Fetch Step 3 Pricing Settings
        const priceSetRes = await fetch('http://localhost:5000/api/listings/step-settings/step3_step3_pricing');
        const priceSetData = await priceSetRes.json();
        if (priceSetData.success && priceSetData.data) {
          const fetchedSuggested = parseInt(priceSetData.data.toggle_label, 10) || 2028;
          const fetchedWeekend = parseInt(priceSetData.data.toggle_subtitle, 10) || 6;
          setStep3PricingSettings({
            title: priceSetData.data.title || 'Now, set your prices',
            subtitle: priceSetData.data.subtitle || 'These suggestions are based on guest demand for similar listings.',
            basePrice: '',
            suggestedPrice: fetchedSuggested,
            weekendAdjustment: fetchedWeekend,
            learnMoreLink: priceSetData.data.learn_more_link || '#'
          });
          setWeekendAdjustment(fetchedWeekend);
        }

        // 4. Fetch Step 3 Pricing Modals Settings
        const modalsSetRes = await fetch('http://localhost:5000/api/listings/step-settings/step3_modals_pricing');
        const modalsSetData = await modalsSetRes.json();
        if (modalsSetData.success && modalsSetData.data) {
          setStep3ModalsSettings({
            mapTitle: modalsSetData.data.title || 'Compare similar listings',
            mapDesc: modalsSetData.data.subtitle || 'Most listings with reservations during these dates were an average of ₹962 - ₹3,864 per night.',
            mapSubtitle: modalsSetData.data.toggle_label || 'Entire home/flat · 1 bedroom',
            mapDates: modalsSetData.data.toggle_subtitle || '1 Oct 2025 - 1 Oct 2026',
            learnMoreLink: modalsSetData.data.learn_more_link || '#'
          });
        }

        // 5. Fetch Step 4 Discounts Master Data & Settings
        const discRes = await fetch('http://localhost:5000/api/listings/master-discounts');
        const discData = await discRes.json();
        if (discData.success && Array.isArray(discData.data) && discData.data.length > 0) {
          setDiscountsList(discData.data);
          // populate default percentage values
          setDiscountValues(prev => {
            const updated = { ...prev };
            discData.data.forEach(d => {
              if (d.discount_percentage > 0 && (updated[d.key] === undefined || updated[d.key] === 0)) {
                updated[d.key] = d.discount_percentage;
              }
            });
            return updated;
          });
        }

        const discSetRes = await fetch('http://localhost:5000/api/listings/step-settings/step3_step4_discounts');
        const discSetData = await discSetRes.json();
        if (discSetData.success && discSetData.data) {
          setStep4DiscountsSettings({
            title: discSetData.data.title || 'Add discounts',
            subtitle: discSetData.data.subtitle || 'Help your place stand out to get booked faster and earn your first reviews.',
            footerNote: discSetData.data.toggle_label || 'Only one discount will be applied per stay.',
            learnMoreLink: discSetData.data.learn_more_link || '#'
          });
        }

        // 6. Fetch Step 5 Safety Master Items & Settings
        const safetyRes = await fetch('http://localhost:5000/api/listings/master-safety-items');
        const safetyData = await safetyRes.json();
        if (safetyData.success && Array.isArray(safetyData.data) && safetyData.data.length > 0) {
          setSafetyItemsList(safetyData.data);
        }

        const safetySetRes = await fetch('http://localhost:5000/api/listings/step-settings/step3_step5_safety');
        const safetySetData = await safetySetRes.json();
        if (safetySetData.success && safetySetData.data) {
          setStep5SafetySettings({
            title: safetySetData.data.title || 'Share safety details',
            subtitle: safetySetData.data.subtitle || 'Does your place have any of these?',
            toggleLabel: safetySetData.data.toggle_label || 'Important things to know',
            toggleSubtitle: safetySetData.data.toggle_subtitle || "Security cameras that monitor indoor spaces are not allowed even if they're turned off. All exterior security cameras must be disclosed.",
            learnMoreLink: safetySetData.data.learn_more_link || '#'
          });
        }

        const cameraModalSetRes = await fetch('http://localhost:5000/api/listings/step-settings/step3_camera_modal');
        const cameraModalSetData = await cameraModalSetRes.json();
        if (cameraModalSetData.success && cameraModalSetData.data) {
          setStep5CameraModalSettings({
            title: cameraModalSetData.data.title || 'Tell guests about your exterior security cameras',
            subtitle: cameraModalSetData.data.subtitle || 'Describe the area that each camera monitors, such as the back garden or pool.',
            maxChars: parseInt(cameraModalSetData.data.toggle_label, 10) || 300,
            learnMoreLink: cameraModalSetData.data.learn_more_link || '#'
          });
        }

        // 7. Fetch Step 6 Legal & Address Final Details Settings
        const legalSetRes = await fetch('http://localhost:5000/api/listings/step-settings/step3_step6_legal');
        const legalSetData = await legalSetRes.json();
        if (legalSetData.success && legalSetData.data) {
          setStep6LegalSettings({
            title: legalSetData.data.title || 'Provide a few final details',
            subtitle: legalSetData.data.subtitle || 'This is required to comply with financial regulations and helps us prevent fraud.',
            addressHeading: legalSetData.data.toggle_label || "What's your residential address?",
            addressSub: legalSetData.data.toggle_subtitle || "Guests won't see this information.",
            learnMoreLink: legalSetData.data.learn_more_link || '#'
          });
        }

        // 8. Fetch Step 6 Business Modal Settings
        const bizSetRes = await fetch('http://localhost:5000/api/listings/step-settings/step3_business_modal');
        const bizSetData = await bizSetRes.json();
        if (bizSetData.success && bizSetData.data) {
          setStep6BusinessModalSettings({
            modalTitle: bizSetData.data.title || 'Hosting as a business',
            modalDesc: bizSetData.data.subtitle || 'Select "yes" if you\'re registered as a business with your government and have a business registration number or tax ID.',
            sectionTitle: bizSetData.data.toggle_label || 'Are you hosting as a business?',
            sectionSub: bizSetData.data.toggle_subtitle || 'This means your business is most likely registered with your government.',
            learnMoreLink: bizSetData.data.learn_more_link || '#'
          });
        }
      } catch (err) {
        console.error('Failed to fetch dynamic booking settings:', err);
      }
    };

    fetchStep3Data();
  }, []);

  const defaultSafetyItems = [
    { key: 'camera', label: 'Exterior security camera present', requires_details: true },
    { key: 'noise', label: 'Noise decibel monitor present', requires_details: false },
    { key: 'weapons', label: 'Weapon(s) on the property', requires_details: false }
  ];

  const safetyItems = safetyItemsList.length > 0 ? safetyItemsList : defaultSafetyItems;

  const bookingOptions = bookingOptionsList.length > 0
    ? bookingOptionsList.map(o => ({
        id: o.key,
        title: o.title,
        badge: o.badge,
        description: o.description,
        icon: getBookingIcon(o.icon || o.key)
      }))
    : defaultBookingOptions;
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isWeekendModalOpen, setIsWeekendModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isBreakdownExpanded, setIsBreakdownExpanded] = useState(false);
  const [basePrice, setBasePrice] = useState('');
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [weekendAdjustment, setWeekendAdjustment] = useState(6);
  const [discounts, setDiscounts] = useState({
    newListing: false,
    lastMinute: false,
    weekly: false,
    monthly: false
  });
  const [discountValues, setDiscountValues] = useState({
    lastMinute: 0,
    weekly: 0,
    monthly: 0
  });
  const [safetyOptions, setSafetyOptions] = useState({
    camera: false,
    noise: false,
    weapons: false
  });
  const [cameraDetails, setCameraDetails] = useState('');
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [tempCameraText, setTempCameraText] = useState('');
  const [addressDetails, setAddressDetails] = useState(() => {
    try {
      const stored = localStorage.getItem('host_address');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          country: parsed.country || 'India',
          flat: parsed.flat || '',
          street: parsed.street || '',
          landmark: parsed.landmark || '',
          district: parsed.district || '',
          city: parsed.city || '',
          state: parsed.state || '',
          pin: parsed.pin || ''
        };
      }
    } catch (e) {}
    return {
      country: 'India', flat: '', street: '', landmark: '', district: '', city: '', state: '', pin: ''
    };
  });
  const [isBusiness, setIsBusiness] = useState(null);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);

  const toggleDiscount = (key) => setDiscounts(prev => ({ ...prev, [key]: !prev[key] }));

  const toggleSafety = (key) => {
    if (key === 'camera') {
      if (!safetyOptions.camera) {
        setTempCameraText(cameraDetails);
        setIsCameraModalOpen(true);
      } else {
        setSafetyOptions(prev => ({ ...prev, camera: false }));
        setCameraDetails('');
      }
    } else {
      setSafetyOptions(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const numBasePrice = Number(basePrice) || 0;
  const serviceFee = Math.round(numBasePrice * 0.144);
  const youEarn = numBasePrice - serviceFee;
  const weekendPrice = Math.round(numBasePrice * (1 + weekendAdjustment / 100));

  const handleNext = async () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) setStep(4);
    else if (step === 4) setStep(5);
    else if (step === 5) setStep(6);
    else if (step === 6) {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        let step1Data = {};
        try {
          const s1 = localStorage.getItem('host_step1_data');
          if (s1) step1Data = JSON.parse(s1);
        } catch (e) {}

        let step2Data = {};
        try {
          const s2 = localStorage.getItem('host_step2_data');
          if (s2) step2Data = JSON.parse(s2);
        } catch (e) {}

        // Determine current host id & name
        let currentUserId = user?.id;
        let currentUserEmail = user?.email || null;

        if (!currentUserId || !currentUserEmail) {
          try {
            const storedAuth = localStorage.getItem('airbnb_user_auth');
            if (storedAuth) {
              const parsed = JSON.parse(storedAuth);
              currentUserId = parsed?.user?.id || currentUserId;
              currentUserEmail = parsed?.user?.email || currentUserEmail;
              currentUserName = parsed?.user?.name || parsed?.user?.first_name || currentUserName;
              currentUserPhone = parsed?.user?.phone || currentUserPhone;
            }
          } catch (e) {}
        }

        const fallbackCover = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';
        const coverImg = step2Data.cover_img || (Array.isArray(step2Data.photos) && step2Data.photos[0]) || fallbackCover;
        const photosList = Array.isArray(step2Data.photos) && step2Data.photos.length > 0 ? step2Data.photos : [coverImg];

        const payload = {
          title: step2Data.title || 'Entire Place hosted by ' + currentUserName,
          type: step1Data.placeType || 'Entire place',
          category: step1Data.selectedType || 'Home',
          host_name: currentUserName,
          host_email: currentUserEmail,
          host_phone: currentUserPhone,
          city: addressDetails.city ? `${addressDetails.city}, ${addressDetails.state}` : (step1Data.address?.city || 'Jaipur, Rajasthan'),
          price: numBasePrice || 2028,
          cover_img: coverImg,
          amenities: Array.isArray(step2Data.amenities) ? step2Data.amenities : [],
          description: step2Data.description || 'Comfortable and stylish accommodation.',
          photos: photosList,
          itinerary: [],
          discounts: {
            ...discounts,
            values: discountValues
          },
          host_id: currentUserId || null,
          max_guests: step1Data.guests || 4,
          years_experience: 1,
          host_intro: '',
          host_qualifications: '',
          host_recognition: '',
          online_profiles: [],
          residential_address: addressDetails,
          hosting_as_business: isBusiness || 'no',
          review_requirements_agreed: true
        };

        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        const response = await fetch(`${baseUrl}/listings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.success) {
          // Clear cached listing flow steps
          localStorage.removeItem('host_step1_data');
          localStorage.removeItem('host_step2_data');
          // Navigate to host's listings dashboard so they immediately see their new listing!
          navigate('/hosting/listings');
        } else {
          alert(result.message || 'Failed to create listing. Please try again.');
        }
      } catch (err) {
        console.error('Error creating listing:', err);
        alert('Server error while creating listing.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step === 6) setStep(5);
    else if (step === 5) setStep(4);
    else if (step === 4) setStep(3);
    else if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
    else if (step === 1) navigate('/step2');
  };

  const handleSaveAndExit = async () => {
    try {
      let currentUserId = user?.id;
      let currentUserName = user?.name || user?.first_name || 'Airbnb Host';
      let currentUserEmail = user?.email || null;

      if (!currentUserId || !currentUserEmail) {
        try {
          const storedAuth = localStorage.getItem('airbnb_user_auth');
          if (storedAuth) {
            const parsed = JSON.parse(storedAuth);
            currentUserId = parsed?.user?.id || currentUserId;
            currentUserEmail = parsed?.user?.email || currentUserEmail;
            currentUserName = parsed?.user?.name || parsed?.user?.first_name || currentUserName;
          }
        } catch (e) {}
      }

      let step1Data = {};
      let step2Data = {};
      try {
        const s1 = localStorage.getItem('host_step1_data');
        const s2 = localStorage.getItem('host_step2_data');
        if (s1) step1Data = JSON.parse(s1);
        if (s2) step2Data = JSON.parse(s2);
      } catch (e) {}

      const hostId = currentUserId || 4;
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const coverPhoto = step2Data.cover_img || (Array.isArray(step2Data.photos) && step2Data.photos[0]) || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';

      const draftPayload = {
        title: step2Data.title || (step1Data.selectedType ? `${step1Data.selectedType} hosted by ${currentUserName}` : 'Home in progress'),
        type: step1Data.placeType === 'room' ? 'Room' : (step1Data.placeType === 'shared' ? 'Shared room' : 'Entire place'),
        category: step1Data.selectedType || 'Home',
        host_name: currentUserName,
        host_email: currentUserEmail,
        host_id: hostId,
        city: addressDetails?.city ? `${addressDetails.city}, ${addressDetails.state}` : (step1Data.address?.city || 'Jaipur, Rajasthan'),
        price: numBasePrice || 2028,
        status: 'In progress',
        cover_img: coverPhoto,
        photos: Array.isArray(step2Data.photos) && step2Data.photos.length > 0 ? step2Data.photos : [coverPhoto],
        amenities: Array.isArray(step2Data.amenities) ? step2Data.amenities : [],
        description: step2Data.description || 'Listing creation in progress. Finish required steps to publish.',
        residential_address: addressDetails || step1Data.address || {}
      };

      try {
        localStorage.setItem('host_resume_route', `/step3?step=${step}`);
      } catch (err) {}

      const existingDraftId = localStorage.getItem('host_draft_listing_id');
      const method = existingDraftId ? 'PUT' : 'POST';
      const endpoint = existingDraftId ? `${baseUrl}/listings/${existingDraftId}` : `${baseUrl}/listings`;

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftPayload)
      });
      const data = await res.json();
      if (data.success && data.data?.id) {
        localStorage.setItem('host_draft_listing_id', String(data.data.id));
      }
    } catch (e) {
      console.warn('Save & exit draft warning in step3:', e);
    }
    navigate('/hosting/listings');
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <NavLink to="/" className={styles.logoLink}>
          <FaAirbnb size={32} color="#222222" />
        </NavLink>
        <div className={styles.headerRight}>
          <button className={styles.questionsBtn} type="button">Questions?</button>
          <button 
            className={styles.saveExitBtn} 
            type="button"
            onClick={handleSaveAndExit}
          >
            Save & exit
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className={styles.mainContent}>
        {step === 1 ? (
          <div className="container" style={{ height: 'calc(100vh - 180px)' }}>
            <div className="row h-100 align-items-center">
            
            {/* Left Column - Text */}
            <div className="col-md-6 d-flex flex-column justify-content-center pe-md-5 mb-5 mb-md-0">
              <span className={styles.stepText}>Step 3</span>
              <h1 className={styles.title}>
                Finish up and publish
              </h1>
              <p className={styles.description}>
                Finally, you'll choose booking settings, set up pricing and publish your listing.
              </p>
            </div>
            
            {/* Right Column - Image */}
            <div className="col-md-6 d-flex justify-content-center">
              <div className={styles.imageContainer}>
                {/* using the video for the 3D apartment */}
                <video 
                  src="/host-intro.mp4" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  className={styles.illustration}
                />
              </div>
              </div>
            </div>
          </div>
        ) : step === 2 ? (
          <div className={styles.titleContainer}>
            <h1 className={styles.step2Title} style={{ marginBottom: '8px', textAlign: 'center' }}>{step2BookingSettings.title}</h1>
            <p className={styles.mapSubtitle} style={{ textAlign: 'center', marginBottom: '32px' }}>
              {step2BookingSettings.subtitle} <a href={step2BookingSettings.learnMoreLink} style={{ color: '#222', textDecoration: 'underline', fontWeight: 600 }}>Learn more</a>
            </p>
            
            <div style={{ width: '100%' }}>
              {bookingOptions.map((opt) => (
                <div 
                  key={opt.id}
                  className={`${styles.bookingOptionCard} ${bookingSetting === opt.id ? styles.bookingOptionCardSelected : ''}`}
                  onClick={() => setBookingSetting(opt.id)}
                >
                  <div className={styles.bookingOptionText}>
                    <div className={styles.bookingOptionTitle}>{opt.title}</div>
                    {opt.badge && <div className={styles.bookingOptionRecommended}>{opt.badge}</div>}
                    <div className={styles.bookingOptionDesc}>
                      {opt.description}
                    </div>
                  </div>
                  <div className={styles.bookingOptionIcon}>{opt.icon}</div>
                </div>
              ))}
            </div>
          </div>
        ) : step === 3 ? (
          <div className={styles.titleContainer} style={{ alignItems: 'center' }}>
            <h1 className={styles.step2Title} style={{ marginBottom: '8px', textAlign: 'center' }}>{step3PricingSettings.title}</h1>
            <p className={styles.mapSubtitle} style={{ textAlign: 'center', marginBottom: '32px' }}>
              {step3PricingSettings.subtitle} <a href={step3PricingSettings.learnMoreLink} style={{ color: '#222', textDecoration: 'underline', fontWeight: 600 }}>Learn more</a>
            </p>
            
            <div style={{ width: '100%', maxWidth: '600px' }}>
              {/* Direct Editable Base Price Card */}
              <div 
                className={styles.priceCard} 
                style={{ cursor: 'default' }}
                onClick={(e) => {
                  const input = document.getElementById('directBasePriceInput');
                  if (input && e.target !== input) input.focus();
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div className={styles.priceCardLabel} style={{ marginBottom: 0, fontWeight: 600 }}>Base price (per night)</div>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setIsPriceModalOpen(true); }}
                    style={{ background: 'none', border: 'none', color: '#717171', fontSize: '13px', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                  >
                    View breakdown
                  </button>
                </div>
                <div className={styles.priceCardValue} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '38px', fontWeight: 800, color: '#222' }}>₹</span>
                  <input 
                    id="directBasePriceInput"
                    type="number" 
                    value={basePrice}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBasePrice(val === '' ? '' : Math.max(0, parseInt(val, 10) || 0));
                    }}
                    placeholder=""
                    style={{ 
                      fontSize: '38px', 
                      fontWeight: 800, 
                      color: '#222', 
                      border: 'none', 
                      background: 'transparent', 
                      outline: 'none', 
                      width: '100%',
                      padding: 0
                    }}
                  />
                  <div 
                    onClick={() => {
                      const input = document.getElementById('directBasePriceInput');
                      if (input) input.focus();
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #e2e8f0', cursor: 'pointer', background: '#f8fafc', flexShrink: 0 }}
                    title="Click to edit price"
                  >
                    <FaPencilAlt size={13} color="#475569" />
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: '#717171', marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Guest price before taxes: <strong>₹{numBasePrice.toLocaleString('en-IN')}</strong></span>
                  <span style={{ color: '#059669', fontWeight: 600 }}>You earn: ₹{youEarn.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Weekend Adjustment Card */}
              <div className={styles.priceCard} onClick={() => setIsWeekendModalOpen(true)}>
                <div className={styles.priceCardLabel} style={{ fontWeight: 600 }}>Weekend adjustment</div>
                <div className={styles.priceCardValue}>
                  <span>{weekendAdjustment > 0 ? '+' : ''}{weekendAdjustment}%</span>
                  <span className={styles.priceCardSub} style={{ fontSize: '13px' }}>₹{weekendPrice.toLocaleString('en-IN')} for Fri and Sat</span>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button className={styles.showListingsBtn} onClick={() => setIsMapModalOpen(true)}>
                  <FaMapMarkerAlt style={{ color: '#e51d53' }} /> Show similar listings
                </button>
              </div>
            </div>
          </div>
        ) : step === 4 ? (
          <div className={styles.titleContainer} style={{ alignItems: 'center' }}>
            <h1 className={styles.step2Title} style={{ marginBottom: '8px', textAlign: 'center' }}>{step4DiscountsSettings.title}</h1>
            <p className={styles.mapSubtitle} style={{ textAlign: 'center', marginBottom: '32px' }}>
              {step4DiscountsSettings.subtitle}
            </p>
            
            <div style={{ width: '100%', maxWidth: '650px' }}>
              {(discountsList.length > 0 ? discountsList : [
                { key: 'newListing', title: 'New listing promotion', description: 'Offer 20% off your first 3 bookings', discount_percentage: 20, is_customizable: false },
                { key: 'lastMinute', title: 'Last-minute discount', description: 'For stays booked 14 days or less before arrival', discount_percentage: 0, is_customizable: true },
                { key: 'weekly', title: 'Weekly discount', description: 'For stays of 7 nights or more', discount_percentage: 0, is_customizable: true },
                { key: 'monthly', title: 'Monthly discount', description: 'For stays of 28 nights or more', discount_percentage: 0, is_customizable: true }
              ]).map((d) => (
                <div 
                  key={d.key} 
                  className={`${styles.discountCard} ${discounts[d.key] ? styles.discountCardSelected : ''}`} 
                  onClick={() => toggleDiscount(d.key)}
                >
                  {d.is_customizable ? (
                    <input 
                      type="text" 
                      className={styles.discountPrefixInput} 
                      value={discountValues[d.key] ? `${discountValues[d.key]}%` : '0%'} 
                      onChange={(e) => setDiscountValues({ ...discountValues, [d.key]: parseInt(e.target.value.replace('%', ''), 10) || 0 })}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div className={styles.discountPrefix}>{d.discount_percentage}%</div>
                  )}
                  <div className={styles.discountContent}>
                    <div className={styles.discountTitle}>{d.title}</div>
                    <div className={styles.discountDesc}>{d.description}</div>
                  </div>
                  <div className={`${styles.discountCheckbox} ${discounts[d.key] ? styles.discountCheckboxChecked : ''}`}>
                    {discounts[d.key] && <FaCheck size={12} />}
                  </div>
                </div>
              ))}

              <div style={{ textAlign: 'center', fontSize: '12px', color: '#717171', marginTop: '32px' }}>
                {step4DiscountsSettings.footerNote} <a href={step4DiscountsSettings.learnMoreLink} style={{ color: '#222', textDecoration: 'underline' }}>Learn more</a>
              </div>
            </div>
          </div>
        ) : step === 5 ? (
          <div className={styles.titleContainer} style={{ alignItems: 'flex-start' }}>
            <h1 className={styles.step2Title} style={{ marginBottom: '32px', textAlign: 'left' }}>{step5SafetySettings.title}</h1>
            
            <div style={{ width: '100%', maxWidth: '650px', textAlign: 'left' }}>
              <div style={{ fontSize: '18px', color: '#222', marginBottom: '16px' }}>
                {step5SafetySettings.subtitle} <FaQuestionCircle size={14} style={{ display: 'inline', color: '#717171' }} />
              </div>
              
              {safetyItems.map((item) => (
                <React.Fragment key={item.key || item.id}>
                  <div className={styles.safetyRow} onClick={() => toggleSafety(item.key)}>
                    <div className={styles.safetyLabel}>{item.label}</div>
                    <div className={`${styles.safetyCheckbox} ${safetyOptions[item.key] ? styles.safetyCheckboxChecked : ''}`}>
                      {safetyOptions[item.key] && <FaCheck size={12} />}
                    </div>
                  </div>

                  {item.key === 'camera' && safetyOptions.camera && (
                    <div className={styles.cameraDetailsBox}>
                      <div className={styles.cameraDetailsText}>
                        "{cameraDetails}"
                      </div>
                      <button className={styles.cameraDetailsEditBtn} onClick={(e) => { e.stopPropagation(); setTempCameraText(cameraDetails); setIsCameraModalOpen(true); }}>Edit</button>
                    </div>
                  )}
                </React.Fragment>
              ))}

              <hr style={{ borderTop: '1px solid #ebebeb', margin: '32px 0' }} />

              <div style={{ fontSize: '16px', fontWeight: 600, color: '#222', marginBottom: '16px' }}>{step5SafetySettings.toggleLabel}</div>
              <div style={{ fontSize: '14px', color: '#717171', lineHeight: 1.4, marginBottom: '16px' }}>
                {step5SafetySettings.toggleSubtitle}
              </div>
              <div style={{ fontSize: '14px', color: '#717171', lineHeight: 1.4 }}>
                Be sure to comply with your <a href={step5SafetySettings.learnMoreLink} style={{ color: '#222', textDecoration: 'underline' }}>local laws</a> and review Airbnb's <a href={step5SafetySettings.learnMoreLink} style={{ color: '#222', textDecoration: 'underline' }}>anti-discrimination policy</a> and <a href={step5SafetySettings.learnMoreLink} style={{ color: '#222', textDecoration: 'underline' }}>guest and host fees</a>.
              </div>
            </div>
          </div>
        ) : step === 6 ? (
          <div className={styles.titleContainer} style={{ alignItems: 'flex-start' }}>
            <h1 className={styles.step2Title} style={{ marginBottom: '8px', textAlign: 'left' }}>{step6LegalSettings.title}</h1>
            <p className={styles.mapSubtitle} style={{ textAlign: 'left', marginBottom: '32px' }}>
              {step6LegalSettings.subtitle}
            </p>
            
            <div style={{ width: '100%', maxWidth: '650px', textAlign: 'left' }}>
              <div style={{ fontSize: '18px', color: '#222', marginBottom: '4px', fontWeight: 600 }}>{step6LegalSettings.addressHeading}</div>
              <div style={{ fontSize: '14px', color: '#717171', marginBottom: '24px' }}>{step6LegalSettings.addressSub}</div>
              
              <div className="border rounded-3 overflow-hidden mb-4">
                <div className="form-floating border-bottom">
                  <select className="form-select border-0 shadow-none" id="countrySelect" value={addressDetails.country} onChange={(e) => setAddressDetails({...addressDetails, country: e.target.value})}>
                    <option value="India">India</option>
                    <option value="USA">United States</option>
                  </select>
                  <label htmlFor="countrySelect">Country/region</label>
                </div>
                <div className="form-floating border-bottom">
                  <input type="text" className="form-control border-0 shadow-none" id="flatInput" placeholder="Flat" value={addressDetails.flat} onChange={(e) => setAddressDetails({...addressDetails, flat: e.target.value})} />
                  <label htmlFor="flatInput">Flat, house, etc. (if applicable)</label>
                </div>
                <div className="form-floating border-bottom">
                  <input type="text" className="form-control border-0 shadow-none" id="streetInput" placeholder="Street address" value={addressDetails.street} onChange={(e) => setAddressDetails({...addressDetails, street: e.target.value})} />
                  <label htmlFor="streetInput">Street address</label>
                </div>
                <div className="form-floating border-bottom">
                  <input type="text" className="form-control border-0 shadow-none" id="landmarkInput" placeholder="Landmark" value={addressDetails.landmark} onChange={(e) => setAddressDetails({...addressDetails, landmark: e.target.value})} />
                  <label htmlFor="landmarkInput">Nearby landmark (if applicable)</label>
                </div>
                <div className="form-floating border-bottom">
                  <input type="text" className="form-control border-0 shadow-none" id="districtInput" placeholder="District" value={addressDetails.district} onChange={(e) => setAddressDetails({...addressDetails, district: e.target.value})} />
                  <label htmlFor="districtInput">District/locality (if applicable)</label>
                </div>
                <div className="form-floating border-bottom">
                  <input type="text" className="form-control border-0 shadow-none" id="cityInput" placeholder="City" value={addressDetails.city} onChange={(e) => setAddressDetails({...addressDetails, city: e.target.value})} />
                  <label htmlFor="cityInput">City/town</label>
                </div>
                <div className="form-floating border-bottom">
                  <input type="text" className="form-control border-0 shadow-none" id="stateInput" placeholder="State" value={addressDetails.state} onChange={(e) => setAddressDetails({...addressDetails, state: e.target.value})} />
                  <label htmlFor="stateInput">State/union territory</label>
                </div>
                <div className="form-floating">
                  <input type="text" className="form-control border-0 shadow-none" id="pinInput" placeholder="PIN code" value={addressDetails.pin} onChange={(e) => setAddressDetails({...addressDetails, pin: e.target.value})} />
                  <label htmlFor="pinInput">PIN code</label>
                </div>
              </div>

              <hr style={{ borderTop: '1px solid #ebebeb', margin: '32px 0' }} />

              <div style={{ fontSize: '18px', fontWeight: 600, color: '#222', marginBottom: '4px' }}>{step6BusinessModalSettings.sectionTitle}</div>
              <div style={{ fontSize: '14px', color: '#717171', marginBottom: '16px' }}>
                {step6BusinessModalSettings.sectionSub} <a href={step6BusinessModalSettings.learnMoreLink} style={{ color: '#222', textDecoration: 'underline' }} onClick={(e) => { e.preventDefault(); setIsBusinessModalOpen(true); }}>Get details</a>
              </div>
              
              <div className={styles.businessBtnGroup}>
                <button 
                  className={`${styles.businessBtn} ${isBusiness === 'yes' ? styles.businessBtnSelected : ''}`}
                  onClick={() => setIsBusiness('yes')}
                >
                  Yes
                </button>
                <button 
                  className={`${styles.businessBtn} ${isBusiness === 'no' ? styles.businessBtnSelected : ''}`}
                  onClick={() => setIsBusiness('no')}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.progressBar}>
          <div className={styles.progressSegment}>
            <div className={styles.progressFill} style={{ width: '100%' }}></div>
          </div>
          <div className={styles.progressSegment}>
            <div className={styles.progressFill} style={{ width: '100%' }}></div>
          </div>
          <div className={styles.progressSegment}>
            <div className={styles.progressFill} style={{ width: step === 1 ? '10%' : step === 2 ? '30%' : step === 3 ? '50%' : step === 4 ? '70%' : step === 5 ? '90%' : '100%' }}></div>
          </div>
        </div>
        <div className={styles.footerContent}>
          <button className={styles.backBtn} onClick={handleBack}>Back</button>
          <button 
            className={`${styles.nextBtn} ${(isSubmitting || (step === 6 && (!addressDetails.street || !addressDetails.city || !addressDetails.state || !addressDetails.pin || isBusiness === null))) ? styles.disabledBtn : ''}`} 
            onClick={handleNext}
            disabled={isSubmitting || (step === 6 && (!addressDetails.street || !addressDetails.city || !addressDetails.state || !addressDetails.pin || isBusiness === null))}
          >
            {step === 6 ? (isSubmitting ? 'Creating listing...' : 'Create listing') : 'Next'}
          </button>
        </div>
      </footer>

      {/* Price Modal */}
      {isPriceModalOpen && (
        <div className={styles.priceModalOverlay}>
          <div className={styles.priceModal}>
            <div className={styles.priceModalHeader}>
              <FaQuestionCircle size={20} color="#717171" />
              <h2 className={styles.priceModalTitle}>Base price</h2>
              <button className={styles.mapModalClose} style={{ width: '32px', height: '32px', boxShadow: 'none', background: 'transparent' }} onClick={() => setIsPriceModalOpen(false)}>
                <IoMdClose size={24} />
              </button>
            </div>

            <div className={styles.priceModalBigPrice}>
              {isEditingPrice ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span>₹</span>
                  <input 
                    type="number" 
                    value={basePrice}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBasePrice(val === '' ? '' : Math.max(0, parseInt(val, 10) || 0));
                    }}
                    placeholder=""
                    onBlur={() => setIsEditingPrice(false)}
                    autoFocus
                    style={{ fontSize: '48px', fontWeight: 800, color: '#222', border: 'none', background: 'transparent', width: `${Math.max(2, String(basePrice).length + 1)}ch`, outline: 'none', padding: 0 }}
                  />
                </div>
              ) : (
                <>
                  ₹{numBasePrice.toLocaleString('en-IN')}
                  <div 
                    onClick={() => setIsEditingPrice(true)}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #ddd', cursor: 'pointer' }}
                  >
                    <FaPencilAlt size={12} color="#222" />
                  </div>
                </>
              )}
            </div>

            {isBreakdownExpanded ? (
              <div className={styles.priceBreakdownBox}>
                <div className={styles.priceBreakdownRow}>
                  <span>Guest price before taxes</span>
                  <span>₹{numBasePrice.toLocaleString('en-IN')}</span>
                </div>
                <div className={styles.priceBreakdownRow}>
                  <span>Host service fee</span>
                  <span>-₹{serviceFee.toLocaleString('en-IN')}</span>
                </div>
                <div className={styles.priceBreakdownRow}>
                  <span>You earn</span>
                  <span>₹{youEarn.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <button onClick={() => setIsBreakdownExpanded(false)} style={{ background: 'none', border: 'none', fontSize: '14px', fontWeight: 600, color: '#222', cursor: 'pointer', textDecoration: 'underline' }}>
                    Show less <FaChevronUp size={12} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <button onClick={() => setIsBreakdownExpanded(true)} style={{ background: 'none', border: 'none', fontSize: '16px', color: '#222', cursor: 'pointer' }}>
                  You earn ₹{youEarn.toLocaleString('en-IN')} <FaChevronDown size={14} />
                </button>
              </div>
            )}

            <div className={styles.priceModalFooter}>
              <button 
                style={{ background: 'none', border: 'none', fontSize: '14px', textDecoration: 'underline', color: '#222', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                onClick={() => { setIsPriceModalOpen(false); setIsMapModalOpen(true); }}
              >
                Show similar listings
              </button>
              <button className={styles.editModalSaveBtn} onClick={() => setIsPriceModalOpen(false)}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Weekend Modal */}
      {isWeekendModalOpen && (
        <div className={styles.priceModalOverlay}>
          <div className={styles.priceModal}>
            <div className={styles.priceModalHeader}>
              <FaQuestionCircle size={20} color="#717171" />
              <h2 className={styles.priceModalTitle}>Weekend adjustment</h2>
              <button className={styles.mapModalClose} style={{ width: '32px', height: '32px', boxShadow: 'none', background: 'transparent' }} onClick={() => setIsWeekendModalOpen(false)}>
                <IoMdClose size={24} />
              </button>
            </div>

            <div className={styles.priceModalBigPrice}>
              {weekendAdjustment > 0 ? '+' : ''}{weekendAdjustment}%
            </div>
            
            <div style={{ textAlign: 'center', fontSize: '14px', color: '#717171', marginBottom: '24px' }}>
              ₹{weekendPrice.toLocaleString('en-IN')} for Fri and Sat
            </div>
            
            <div style={{ padding: '0 24px', marginBottom: '40px' }}>
              <input 
                type="range" 
                min="-20" 
                max="50" 
                value={weekendAdjustment} 
                onChange={(e) => setWeekendAdjustment(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#222' }}
              />
            </div>

            <div className={styles.priceModalFooter}>
              <button 
                style={{ background: 'none', border: 'none', fontSize: '14px', textDecoration: 'underline', color: '#222', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                onClick={() => { setIsWeekendModalOpen(false); setIsMapModalOpen(true); }}
              >
                Show similar listings
              </button>
              <button className={styles.editModalSaveBtn} onClick={() => setIsWeekendModalOpen(false)}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {isMapModalOpen && (
        <div className={styles.mapModalOverlay}>
          <div className={styles.mapModalHeader}>
            <button className={styles.mapModalClose} onClick={() => setIsMapModalOpen(false)}>
              <IoMdClose size={24} />
            </button>
          </div>
          
          <div className={styles.mapModalInfoBox}>
            <h2 className={styles.mapModalInfoTitle}>{step3ModalsSettings.mapTitle}</h2>
            <div className={styles.mapModalInfoSub}>{step3ModalsSettings.mapSubtitle}<br/>{step3ModalsSettings.mapDates}</div>
            
            <h3 className={styles.mapModalInfoSectTitle}>Booked listings</h3>
            <div className={styles.mapModalInfoDesc}>
              {step3ModalsSettings.mapDesc}
            </div>
            <a href={step3ModalsSettings.learnMoreLink} style={{ color: '#222', fontSize: '14px', fontWeight: 600, textDecoration: 'underline' }}>Learn more</a>
          </div>

          <div className={styles.mapModalContent}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14234.697479717757!2d75.7275089069502!3d26.904803024848972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db49b1ff1b539%3A0x6b4fb8ec042e6a32!2sVaishali%20Nagar%2C%20Jaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }}
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Compare listings map"
            ></iframe>
            
            <div style={{ position: 'absolute', top: '50%', left: '40%', background: '#e51d53', color: 'white', padding: '6px 12px', borderRadius: '24px', fontWeight: 800, fontSize: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
              <FaMapMarkerAlt size={12} style={{ marginRight: '4px' }} /> ₹2,028
            </div>
            
            <div style={{ position: 'absolute', top: '45%', left: '30%', background: 'white', color: '#222', padding: '6px 12px', borderRadius: '24px', fontWeight: 800, fontSize: '14px', border: '1px solid #ddd', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              ₹1,214
            </div>
            
            <div style={{ position: 'absolute', top: '30%', left: '45%', background: 'white', color: '#222', padding: '6px 12px', borderRadius: '24px', fontWeight: 800, fontSize: '14px', border: '1px solid #ddd', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              ₹2,500
            </div>
          </div>
        </div>
      )}

      {/* Camera Details Modal */}
      {isCameraModalOpen && (
        <div className={styles.priceModalOverlay}>
          <div className={styles.cameraModal}>
            <button className={styles.mapModalClose} style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', boxShadow: 'none', background: 'transparent' }} onClick={() => setIsCameraModalOpen(false)}>
              <IoMdClose size={24} />
            </button>
            
            <h2 className={styles.priceModalTitle} style={{ textAlign: 'left', fontSize: '22px', marginBottom: '8px' }}>{step5CameraModalSettings.title}</h2>
            <div style={{ fontSize: '14px', color: '#717171' }}>
              {step5CameraModalSettings.subtitle} <a href={step5CameraModalSettings.learnMoreLink} style={{ color: '#222', textDecoration: 'underline', fontWeight: 600 }}>Learn more</a>
            </div>

            <textarea 
              className={styles.cameraModalTextarea}
              value={tempCameraText}
              onChange={(e) => setTempCameraText(e.target.value.substring(0, step5CameraModalSettings.maxChars || 300))}
              placeholder="e.g. Camera facing the driveway"
              autoFocus
            ></textarea>
            <div className={styles.cameraModalCharCount}>
              {(step5CameraModalSettings.maxChars || 300) - tempCameraText.length} characters available
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button 
                className={`${styles.nextBtn} ${tempCameraText.trim().length === 0 ? styles.disabledBtn : ''}`}
                style={{ padding: '12px 24px', fontSize: '14px' }}
                disabled={tempCameraText.trim().length === 0}
                onClick={() => {
                  setCameraDetails(tempCameraText);
                  setSafetyOptions(prev => ({ ...prev, camera: true }));
                  setIsCameraModalOpen(false);
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Business Modal */}
      {isBusinessModalOpen && (
        <div className={styles.priceModalOverlay} onClick={() => setIsBusinessModalOpen(false)}>
          <div className={styles.cameraModal} style={{ padding: '32px' }} onClick={(e) => e.stopPropagation()}>
            <button className={styles.mapModalClose} style={{ position: 'absolute', top: '16px', left: '16px', width: '32px', height: '32px', boxShadow: 'none', background: 'transparent' }} onClick={() => setIsBusinessModalOpen(false)}>
              <IoMdClose size={24} />
            </button>
            <h2 className={styles.priceModalTitle} style={{ textAlign: 'center', fontSize: '18px', marginBottom: '24px', fontWeight: 800 }}>{step6BusinessModalSettings.modalTitle}</h2>
            
            <div style={{ fontSize: '14px', color: '#222', lineHeight: 1.5, marginBottom: '24px' }}>
              {step6BusinessModalSettings.modalDesc}
            </div>

            <div style={{ fontSize: '14px', color: '#222', lineHeight: 1.5, marginBottom: '24px' }}>
              <strong>For hosts in the EEA, Switzerland or the UK</strong><br/>
              If you're not registered, you may also qualify as a business under local rules. For example, hosting is your primary profession or you're a sole trader where registration is optional. <a href={step6BusinessModalSettings.learnMoreLink} style={{ color: '#222', textDecoration: 'underline', fontWeight: 600 }}>Learn more</a>
            </div>

            <div style={{ fontSize: '14px', color: '#222', lineHeight: 1.5 }}>
              <strong>For hosts in South Korea</strong><br/>
              Korean law has specific business registration requirements. If you're not yet registered and you need to be, you can still select "yes" now, then complete registration before you publish. <a href={step6BusinessModalSettings.learnMoreLink} style={{ color: '#222', textDecoration: 'underline', fontWeight: 600 }}>Learn more</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
