import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FaAirbnb, FaSnowflake, FaThermometerHalf, FaHotTub, FaTv, FaWifi,
  FaSwimmer, FaCar, FaFireExtinguisher, FaFirstAid, FaUmbrellaBeach, FaFire, FaTree, FaVideo, FaMapMarkedAlt, FaCamera, FaPlus, FaImages, FaTrash,
  FaSpa, FaStar, FaUsers, FaPaintBrush, FaExpandArrowsAlt
} from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import { MdOutlineCleaningServices, MdKitchen, MdLocalLaundryService, MdOutlineWash } from 'react-icons/md';
import { TbFridge } from 'react-icons/tb';
import styles from '../../components/styles/HostStep1.module.css';

const defaultBasicAmenities = [
  { id: 'ac', label: 'Air conditioning', icon: <FaSnowflake /> },
  { id: 'essentials', label: 'Essentials', sublabel: 'Towels, bed sheets, soap and toilet paper', icon: <MdOutlineCleaningServices /> },
  { id: 'fridge', label: 'Fridge', icon: <TbFridge /> },
  { id: 'heating', label: 'Heating', icon: <FaThermometerHalf /> },
  { id: 'hot_water', label: 'Hot water', icon: <FaHotTub /> },
  { id: 'kitchen', label: 'Kitchen', icon: <MdKitchen /> },
  { id: 'tv', label: 'TV', icon: <FaTv /> },
  { id: 'dryer', label: 'Tumble dryer', icon: <MdLocalLaundryService /> },
  { id: 'washing_machine', label: 'Washing machine', icon: <MdOutlineWash /> },
  { id: 'wifi', label: 'Wifi', icon: <FaWifi /> },
];

const defaultStandoutAmenities = [
  { id: 'pool', label: 'Pool', icon: <FaSwimmer /> },
  { id: 'hottub', label: 'Hot tub', icon: <FaHotTub /> },
  { id: 'patio', label: 'Patio', icon: <FaTree /> },
  { id: 'bbq', label: 'BBQ grill', icon: <FaFire /> },
  { id: 'outdoor_dining', label: 'Outdoor dining area', icon: <FaUmbrellaBeach /> },
  { id: 'firepit', label: 'Fire pit', icon: <FaFire /> },
  { id: 'parking', label: 'Free parking on premises', icon: <FaCar /> },
];

const defaultLocationAmenities = [
  { id: 'beachfront', label: 'Beachfront', icon: <FaUmbrellaBeach /> },
  { id: 'waterfront', label: 'Waterfront', icon: <FaMapMarkedAlt /> },
  { id: 'ski_in', label: 'Ski-in/ski-out', icon: <FaSnowflake /> },
];

const defaultSafetyAmenities = [
  { id: 'smoke_alarm', label: 'Smoke alarm', icon: <FaFireExtinguisher /> },
  { id: 'first_aid', label: 'First aid kit', icon: <FaFirstAid /> },
  { id: 'fire_extinguisher', label: 'Fire extinguisher', icon: <FaFireExtinguisher /> },
  { id: 'carbon_monoxide', label: 'Carbon monoxide alarm', icon: <FaFireExtinguisher /> },
];

// Icon resolver helper for amenities
const getAmenityIcon = (iconKey, id) => {
  const key = (iconKey || id || '').toLowerCase();
  switch (key) {
    case 'ac':
    case 'snowflake':
    case 'ski_in':
      return <FaSnowflake />;
    case 'essentials':
    case 'cleaning':
      return <MdOutlineCleaningServices />;
    case 'fridge':
      return <TbFridge />;
    case 'heating':
      return <FaThermometerHalf />;
    case 'hot_water':
    case 'hottub':
      return <FaHotTub />;
    case 'kitchen':
      return <MdKitchen />;
    case 'tv':
      return <FaTv />;
    case 'dryer':
      return <MdLocalLaundryService />;
    case 'washing_machine':
      return <MdOutlineWash />;
    case 'wifi':
      return <FaWifi />;
    case 'pool':
    case 'swimmer':
      return <FaSwimmer />;
    case 'patio':
      return <FaTree />;
    case 'bbq':
    case 'firepit':
    case 'fire':
      return <FaFire />;
    case 'outdoor_dining':
    case 'beachfront':
      return <FaUmbrellaBeach />;
    case 'parking':
      return <FaCar />;
    case 'waterfront':
      return <FaMapMarkedAlt />;
    case 'first_aid':
      return <FaFirstAid />;
    case 'smoke_alarm':
    case 'fire_extinguisher':
    case 'carbon_monoxide':
      return <FaFireExtinguisher />;
    default:
      return <FaWifi />;
  }
};

const defaultHighlightsData = [
  { id: 'peaceful', label: 'Peaceful', icon: <FaSpa /> },
  { id: 'unique', label: 'Unique', icon: <FaStar /> },
  { id: 'family-friendly', label: 'Family-friendly', icon: <FaUsers /> },
  { id: 'stylish', label: 'Stylish', icon: <FaPaintBrush /> },
  { id: 'central', label: 'Central', icon: <FaMapMarkedAlt /> },
  { id: 'spacious', label: 'Spacious', icon: <FaExpandArrowsAlt /> }
];

const getHighlightIcon = (iconName) => {
  switch (iconName?.toLowerCase()) {
    case 'peaceful':
    case 'spa':
      return <FaSpa />;
    case 'unique':
    case 'star':
      return <FaStar />;
    case 'family-friendly':
    case 'users':
    case 'family':
      return <FaUsers />;
    case 'stylish':
    case 'paint':
    case 'paintbrush':
      return <FaPaintBrush />;
    case 'central':
    case 'map':
    case 'map-pin':
      return <FaMapMarkedAlt />;
    case 'spacious':
    case 'expand':
    case 'arrows':
      return <FaExpandArrowsAlt />;
    default:
      return <FaStar />;
  }
};

export default function HostStep2() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(() => {
    const qStep = parseInt(searchParams.get('step'), 10);
    if (!isNaN(qStep) && qStep >= 1 && qStep <= 6) return qStep;
    try {
      const stored = localStorage.getItem('host_step2_data');
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

  const [selectedAmenities, setSelectedAmenities] = useState(() => {
    try {
      const stored = localStorage.getItem('host_step2_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.amenities)) return parsed.amenities;
      }
    } catch (e) {}
    return [];
  });

  // Dynamic Backend State for Amenities & Step Settings
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [highlightsList, setHighlightsList] = useState([]);
  const [loadingAmenities, setLoadingAmenities] = useState(true);
  const [step2Settings, setStep2Settings] = useState({
    title: "Tell guests which amenities they'll find at your place",
    subtitle: "You can add more amenities after you publish your listing."
  });

  const [step3Settings, setStep3Settings] = useState({
    title: "Add some photos of your house",
    subtitle: "You'll need 5 photos to get started. You can add more or make changes later.",
    tadaTitle: "Ta-da! How does this look?",
    tadaSubtitle: "Drag to reorder"
  });

  const [step3ModalsSettings, setStep3ModalsSettings] = useState({
    uploadTitle: "Upload photos",
    uploadSubtitle: "Drag and drop or browse for photos",
    deleteTitle: "Delete this photo?",
    deleteSubtitle: "Once you delete it, you can't get it back."
  });

  const [step4Settings, setStep4Settings] = useState({
    title: "Now, let's give your house a title",
    subtitle: "Short titles work best. Have fun with it — you can always change it later.",
    maxLength: 50
  });

  const [step5Settings, setStep5Settings] = useState({
    title: "Next, let's describe your house",
    subtitle: "Choose up to 2 highlights. We'll use these to get your description started."
  });

  // Fetch Step 2, 3 & 4 Data and Settings from backend
  useEffect(() => {
    const fetchStepData = async () => {
      try {
        setLoadingAmenities(true);
        // 1. Fetch amenities
        const amenRes = await fetch('http://localhost:5000/api/listings/master-amenities');
        const amenData = await amenRes.json();
        if (amenData.success && Array.isArray(amenData.data) && amenData.data.length > 0) {
          setAmenitiesList(amenData.data);
        }

        // 2. Fetch Step 2 settings
        const set2Res = await fetch('http://localhost:5000/api/listings/step-settings/step2_amenities');
        const set2Data = await set2Res.json();
        if (set2Data.success && set2Data.data) {
          setStep2Settings({
            title: set2Data.data.title || "Tell guests which amenities they'll find at your place",
            subtitle: set2Data.data.subtitle || "You can add more amenities after you publish your listing."
          });
        }

        // 3. Fetch Step 3 settings
        const set3Res = await fetch('http://localhost:5000/api/listings/step-settings/step3_photos');
        const set3Data = await set3Res.json();
        if (set3Data.success && set3Data.data) {
          setStep3Settings({
            title: set3Data.data.title || "Add some photos of your house",
            subtitle: set3Data.data.subtitle || "You'll need 5 photos to get started. You can add more or make changes later.",
            tadaTitle: set3Data.data.toggle_label || "Ta-da! How does this look?",
            tadaSubtitle: set3Data.data.toggle_subtitle || "Drag to reorder"
          });
        }

        // 4. Fetch Step 3 Modals settings
        const setModalsRes = await fetch('http://localhost:5000/api/listings/step-settings/step3_modals');
        const setModalsData = await setModalsRes.json();
        if (setModalsData.success && setModalsData.data) {
          setStep3ModalsSettings({
            uploadTitle: setModalsData.data.title || "Upload photos",
            uploadSubtitle: setModalsData.data.subtitle || "Drag and drop or browse for photos",
            deleteTitle: setModalsData.data.toggle_label || "Delete this photo?",
            deleteSubtitle: setModalsData.data.toggle_subtitle || "Once you delete it, you can't get it back."
          });
        }

        // 5. Fetch Step 4 Title settings
        const set4Res = await fetch('http://localhost:5000/api/listings/step-settings/step4_title');
        const set4Data = await set4Res.json();
        if (set4Data.success && set4Data.data) {
          setStep4Settings({
            title: set4Data.data.title || "Now, let's give your house a title",
            subtitle: set4Data.data.subtitle || "Short titles work best. Have fun with it — you can always change it later.",
            maxLength: parseInt(set4Data.data.toggle_label, 10) || 50
          });
        }

        // 6. Fetch Step 5 Highlights & Settings
        const highlightsRes = await fetch('http://localhost:5000/api/listings/master-highlights');
        const highlightsData = await highlightsRes.json();
        if (highlightsData.success && Array.isArray(highlightsData.data) && highlightsData.data.length > 0) {
          setHighlightsList(highlightsData.data);
        }

        const set5Res = await fetch('http://localhost:5000/api/listings/step-settings/step5_highlights');
        const set5Data = await set5Res.json();
        if (set5Data.success && set5Data.data) {
          setStep5Settings({
            title: set5Data.data.title || "Next, let's describe your house",
            subtitle: set5Data.data.subtitle || "Choose up to 2 highlights. We'll use these to get your description started."
          });
        }
      } catch (err) {
        console.error('Failed to fetch dynamic step settings data:', err);
      } finally {
        setLoadingAmenities(false);
      }
    };

    fetchStepData();
  }, []);

  // Filter amenities into 4 categories with fallback to defaults
  const basicAmenities = amenitiesList.length > 0 
    ? amenitiesList.filter(a => a.category === 'Basics').map(a => ({
        id: a.key,
        label: a.name,
        sublabel: a.sublabel,
        icon: getAmenityIcon(a.icon, a.key)
      }))
    : defaultBasicAmenities;

  const standoutAmenities = amenitiesList.length > 0
    ? amenitiesList.filter(a => a.category === 'Standout amenities (Features/Popular)').map(a => ({
        id: a.key,
        label: a.name,
        sublabel: a.sublabel,
        icon: getAmenityIcon(a.icon, a.key)
      }))
    : defaultStandoutAmenities;

  const locationAmenities = amenitiesList.length > 0
    ? amenitiesList.filter(a => a.category === 'Location').map(a => ({
        id: a.key,
        label: a.name,
        sublabel: a.sublabel,
        icon: getAmenityIcon(a.icon, a.key)
      }))
    : defaultLocationAmenities;

  const safetyAmenities = amenitiesList.length > 0
    ? amenitiesList.filter(a => a.category === 'Safety').map(a => ({
        id: a.key,
        label: a.name,
        sublabel: a.sublabel,
        icon: getAmenityIcon(a.icon, a.key)
      }))
    : defaultSafetyAmenities;

  // Dynamic Highlights List with fallback
  const highlights = highlightsList.length > 0
    ? highlightsList.map(h => ({
        id: h.key,
        label: h.label,
        icon: getHighlightIcon(h.icon || h.key)
      }))
    : defaultHighlightsData;
  
  // Step 3 state
  const [photos, setPhotos] = useState(() => {
    try {
      const stored = localStorage.getItem('host_step2_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.photos) && parsed.photos.length > 0) return parsed.photos;
      }
    } catch (e) {}
    return [];
  });
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [pendingPhotos, setPendingPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [photoToEdit, setPhotoToEdit] = useState(null);
  const [title, setTitle] = useState(() => {
    try {
      const stored = localStorage.getItem('host_step2_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.title) return parsed.title;
      }
    } catch (e) {}
    return '';
  });
  const [selectedHighlights, setSelectedHighlights] = useState(() => {
    try {
      const stored = localStorage.getItem('host_step2_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.highlights)) return parsed.highlights;
      }
    } catch (e) {}
    return [];
  });
  const [description, setDescription] = useState(() => {
    try {
      const stored = localStorage.getItem('host_step2_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.description) return parsed.description;
      }
    } catch (e) {}
    return 'Have fun with the whole family at this stylish place.';
  });
  const fileInputRef = useRef(null);

  const toggleHighlight = (id) => {
    setSelectedHighlights(prev => {
      if (prev.includes(id)) {
        return prev.filter(h => h !== id);
      } else {
        if (prev.length < 2) return [...prev, id];
        return prev;
      }
    });
  };

  const toggleAmenity = (id) => {
    setSelectedAmenities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const readFileAsDataUrl = (file) => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/') || file.size < 150 * 1024) {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
        return;
      }

      // Canvas compression for smooth storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1280;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const dataUrls = await Promise.all(newFiles.map(file => readFileAsDataUrl(file)));
      setPendingPhotos(prev => [...prev, ...dataUrls]);
    }
  };

  const handleAddPhotosClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const removePendingPhoto = (index) => {
    setPendingPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = () => {
    setIsUploading(true);
    setTimeout(() => {
      setPhotos(prev => [...prev, ...pendingPhotos]);
      setPendingPhotos([]);
      setIsUploading(false);
      setIsUploadModalOpen(false);
    }, 2000);
  };

  const closeUploadModal = () => {
    if (!isUploading) {
      setIsUploadModalOpen(false);
      setPendingPhotos([]);
    }
  };

  const confirmDeletePhoto = () => {
    if (photoToDelete !== null) {
      setPhotos(prev => prev.filter((_, i) => i !== photoToDelete));
      setActiveMenuIndex(null);
      setPhotoToDelete(null);
    }
  };

  const movePhotoBackwards = (index) => {
    if (index > 0) {
      setPhotos(prev => {
        const newPhotos = [...prev];
        const temp = newPhotos[index - 1];
        newPhotos[index - 1] = newPhotos[index];
        newPhotos[index] = temp;
        return newPhotos;
      });
      setActiveMenuIndex(null);
    }
  };

  const movePhotoForwards = (index) => {
    if (index < photos.length - 1) {
      setPhotos(prev => {
        const newPhotos = [...prev];
        const temp = newPhotos[index + 1];
        newPhotos[index + 1] = newPhotos[index];
        newPhotos[index] = temp;
        return newPhotos;
      });
      setActiveMenuIndex(null);
    }
  };

  const makeCoverPhoto = (index) => {
    if (index > 0) {
      setPhotos(prev => {
        const newPhotos = [...prev];
        const [photo] = newPhotos.splice(index, 1);
        newPhotos.unshift(photo);
        return newPhotos;
      });
      setActiveMenuIndex(null);
    }
  };

  const handleNext = () => {
    let nextStep = step;
    if (step === 1) nextStep = 2;
    else if (step === 2) nextStep = 3;
    else if (step === 3) nextStep = 4;
    else if (step === 4) nextStep = 5;
    else if (step === 5) nextStep = 6;
    else {
      try {
        const step2Data = {
          lastStep: 6,
          amenities: selectedAmenities,
          photos: photos,
          cover_img: photos[0] || '',
          title: title || 'Modern Entire Place',
          highlights: selectedHighlights,
          description: description || ''
        };
        localStorage.setItem('host_step2_data', JSON.stringify(step2Data));
        localStorage.setItem('host_resume_route', '/step3?step=1');
      } catch (e) {
        console.warn('Failed to cache step 2 data', e);
      }
      navigate('/step3');
      return;
    }

    setStep(nextStep);
    try {
      localStorage.setItem('host_resume_route', `/step2?step=${nextStep}`);
      const existing = localStorage.getItem('host_step2_data');
      const obj = existing ? JSON.parse(existing) : {};
      obj.lastStep = nextStep;
      obj.amenities = selectedAmenities;
      obj.photos = photos;
      obj.title = title;
      obj.highlights = selectedHighlights;
      obj.description = description;
      localStorage.setItem('host_step2_data', JSON.stringify(obj));
    } catch (e) {}
  };

  const handleBack = () => {
    let prevStep = step - 1;
    if (step === 6) prevStep = 5;
    else if (step === 5) prevStep = 4;
    else if (step === 4) prevStep = 3;
    else if (step === 3) prevStep = 2;
    else if (step === 2) prevStep = 1;
    else {
      navigate('/step1');
      return;
    }

    setStep(prevStep);
    try {
      localStorage.setItem('host_resume_route', `/step2?step=${prevStep}`);
    } catch (e) {}
  };

  const handleSaveAndExit = async () => {
    try {
      let currentUserId = null;
      let currentUserName = 'Airbnb Host';
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const u = JSON.parse(stored);
          currentUserId = u?.id;
          currentUserName = u?.first_name || u?.name || currentUserName;
        }
        if (!currentUserId) {
          const storedAuth = localStorage.getItem('airbnb_user_auth');
          if (storedAuth) {
            const parsed = JSON.parse(storedAuth);
            currentUserId = parsed?.user?.id;
            currentUserName = parsed?.user?.first_name || parsed?.user?.name || currentUserName;
          }
        }
      } catch (e) {}

      let step1Data = {};
      try {
        const s1 = localStorage.getItem('host_step1_data');
        if (s1) step1Data = JSON.parse(s1);
      } catch (e) {}

      const hostId = currentUserId || 4;
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const coverPhoto = (photos && photos[0]) || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';

      const draftPayload = {
        title: title || (step1Data.selectedType ? `${step1Data.selectedType} hosted by ${currentUserName}` : 'Home in progress'),
        type: step1Data.placeType === 'room' ? 'Room' : (step1Data.placeType === 'shared' ? 'Shared room' : 'Entire place'),
        category: step1Data.selectedType || 'Home',
        host_name: currentUserName,
        host_id: hostId,
        city: step1Data.address?.city || 'Jaipur, Rajasthan',
        price: 2000,
        status: 'In progress',
        cover_img: coverPhoto,
        photos: photos.length > 0 ? photos : [coverPhoto],
        amenities: selectedAmenities,
        description: description || 'Listing creation in progress. Finish required steps to publish.',
        residential_address: step1Data.address || {}
      };

      try {
        const step2Data = {
          lastStep: step,
          amenities: selectedAmenities,
          photos: photos,
          cover_img: coverPhoto,
          title: title || 'Modern Entire Place',
          highlights: selectedHighlights,
          description: description || ''
        };
        localStorage.setItem('host_step2_data', JSON.stringify(step2Data));
        localStorage.setItem('host_resume_route', `/step2?step=${step}`);
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
      console.warn('Save & exit draft warning in step2:', e);
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
              <div className="col-12 col-md-6 d-flex flex-column justify-content-center pe-md-5 mb-5 mb-md-0">
                <span className={styles.stepText}>Step 2</span>
                <h1 className={styles.title}>
                  Make your place stand out
                </h1>
                <p className={styles.description}>
                  In this step, you'll add some of the amenities your place offers, plus 5 or more photos. Then you'll create a title and description.
                </p>
              </div>
              
              {/* Right Column - Image */}
              <div className="col-12 col-md-6 d-flex justify-content-center">
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
          <div className={styles.step2Container}>
            <h1 className={styles.step2Title} style={{ marginBottom: '8px' }}>{step2Settings.title}</h1>
            <p className={styles.mapSubtitle}>{step2Settings.subtitle}</p>
            
            <div className={styles.sectionTitle}>Basics</div>
            <div className={styles.gridContainer}>
              {basicAmenities.map((amenity) => (
                <div 
                  key={amenity.id}
                  className={`${styles.typeCard} ${selectedAmenities.includes(amenity.id) ? styles.typeCardSelected : ''}`}
                  onClick={() => toggleAmenity(amenity.id)}
                  style={{ height: 'auto', minHeight: '100px' }}
                >
                  <div className={styles.typeIcon}>{amenity.icon}</div>
                  <div className={styles.typeLabel}>{amenity.label}</div>
                  {amenity.sublabel && <div className={styles.typeSublabel}>{amenity.sublabel}</div>}
                </div>
              ))}
            </div>

            <div className={styles.sectionTitle}>Standout amenities (Features/Popular)</div>
            <div className={styles.gridContainer}>
              {standoutAmenities.map((amenity) => (
                <div 
                  key={amenity.id}
                  className={`${styles.typeCard} ${selectedAmenities.includes(amenity.id) ? styles.typeCardSelected : ''}`}
                  onClick={() => toggleAmenity(amenity.id)}
                  style={{ height: 'auto', minHeight: '100px' }}
                >
                  <div className={styles.typeIcon}>{amenity.icon}</div>
                  <div className={styles.typeLabel}>{amenity.label}</div>
                  {amenity.sublabel && <div className={styles.typeSublabel}>{amenity.sublabel}</div>}
                </div>
              ))}
            </div>

            <div className={styles.sectionTitle}>Location</div>
            <div className={styles.gridContainer}>
              {locationAmenities.map((amenity) => (
                <div 
                  key={amenity.id}
                  className={`${styles.typeCard} ${selectedAmenities.includes(amenity.id) ? styles.typeCardSelected : ''}`}
                  onClick={() => toggleAmenity(amenity.id)}
                  style={{ height: 'auto', minHeight: '100px' }}
                >
                  <div className={styles.typeIcon}>{amenity.icon}</div>
                  <div className={styles.typeLabel}>{amenity.label}</div>
                  {amenity.sublabel && <div className={styles.typeSublabel}>{amenity.sublabel}</div>}
                </div>
              ))}
            </div>

            <div className={styles.sectionTitle}>Safety</div>
            <div className={styles.gridContainer}>
              {safetyAmenities.map((amenity) => (
                <div 
                  key={amenity.id}
                  className={`${styles.typeCard} ${selectedAmenities.includes(amenity.id) ? styles.typeCardSelected : ''}`}
                  onClick={() => toggleAmenity(amenity.id)}
                  style={{ height: 'auto', minHeight: '100px' }}
                >
                  <div className={styles.typeIcon}>{amenity.icon}</div>
                  <div className={styles.typeLabel}>{amenity.label}</div>
                  {amenity.sublabel && <div className={styles.typeSublabel}>{amenity.sublabel}</div>}
                </div>
              ))}
            </div>
          </div>
        ) : step === 3 ? (
          <>
            {photos.length === 0 ? (
              <div className={styles.step6Container}>
                <h1 className={styles.step2Title} style={{ marginBottom: '8px' }}>{step3Settings.title}</h1>
                <p className={styles.mapSubtitle}>{step3Settings.subtitle}</p>

                <div className={styles.photoUploadBox} onClick={handleAddPhotosClick} style={{ cursor: 'pointer' }}>
                  <FaCamera className={styles.photoUploadIcon} />
                  <button className={styles.addPhotosBtn}>Add photos</button>
                </div>
              </div>
            ) : (
              <div className={styles.tadaContainer}>
                <div className={styles.tadaHeader}>
                  <div>
                    <h1 className={styles.step2Title} style={{ marginBottom: '8px' }}>{step3Settings.tadaTitle}</h1>
                    <p className={styles.mapSubtitle} style={{ marginBottom: 0 }}>{step3Settings.tadaSubtitle}</p>
                  </div>
                  <button className={styles.tadaPlusBtn} onClick={handleAddPhotosClick}>
                    <FaPlus size={16} color="#222" />
                  </button>
                </div>

                <div className={styles.photosGrid}>
                  {/* Cover Photo */}
                  {photos.length > 0 && (
                    <div className={styles.coverPhoto}>
                      <img src={photos[0]} alt="Cover" className={styles.coverPhotoImg} />
                      <div className={styles.coverPill}>Cover Photo</div>
                      <button className={styles.photoMenuBtn} onClick={() => setActiveMenuIndex(activeMenuIndex === 0 ? null : 0)}>
                        <BsThreeDots />
                      </button>
                      
                      {activeMenuIndex === 0 && (
                        <div className={styles.photoDropdown}>
                          <div className={styles.photoDropdownItem} onClick={() => { setPhotoToEdit(0); setActiveMenuIndex(null); }}>Edit</div>
                          {photos.length > 1 && (
                            <div className={styles.photoDropdownItem} onClick={() => movePhotoForwards(0)}>Move forwards</div>
                          )}
                          <div className={styles.photoDropdownItem} onClick={() => { setPhotoToDelete(0); setActiveMenuIndex(null); }}>Delete</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Smaller Photos */}
                  {photos.length > 1 && (
                    <div className={styles.smallPhotosGrid}>
                      {photos.slice(1).map((photo, idx) => {
                        const index = idx + 1;
                        return (
                          <div key={index} className={styles.smallPhoto}>
                            <img src={photo} alt={`Photo ${index}`} className={styles.smallPhotoImg} />
                            <button className={styles.photoMenuBtn} onClick={() => setActiveMenuIndex(activeMenuIndex === index ? null : index)}>
                              <BsThreeDots />
                            </button>
                            
                            {activeMenuIndex === index && (
                              <div className={styles.photoDropdown}>
                                <div className={styles.photoDropdownItem} onClick={() => { setPhotoToEdit(index); setActiveMenuIndex(null); }}>Edit</div>
                                <div className={styles.photoDropdownItem} onClick={() => movePhotoBackwards(index)}>Move backwards</div>
                                {index < photos.length - 1 && (
                                  <div className={styles.photoDropdownItem} onClick={() => movePhotoForwards(index)}>Move forwards</div>
                                )}
                                <div className={styles.photoDropdownItem} onClick={() => makeCoverPhoto(index)}>Make cover photo</div>
                                <div className={styles.photoDropdownItem} onClick={() => { setPhotoToDelete(index); setActiveMenuIndex(null); }}>Delete</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      
                      <div className={styles.addMoreBox} onClick={handleAddPhotosClick}>
                        <FaPlus className={styles.addMoreIcon} />
                        <div style={{ fontSize: '16px', fontWeight: 600, color: '#222' }}>Add more</div>
                      </div>
                    </div>
                  )}
                  
                  {photos.length === 1 && (
                    <div className={styles.smallPhotosGrid}>
                      <div className={styles.addMoreBox} onClick={handleAddPhotosClick}>
                        <FaPlus className={styles.addMoreIcon} />
                        <div style={{ fontSize: '16px', fontWeight: 600, color: '#222' }}>Add more</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Hidden File Input */}
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange} 
            />

            {/* Upload Modal */}
            {isUploadModalOpen && (
              <div className={styles.uploadOverlay}>
                <div className={styles.uploadModal}>
                  <div className={styles.uploadModalHeader}>
                    <button className={styles.closeBtn} style={{ position: 'static', padding: '4px' }} onClick={closeUploadModal} disabled={isUploading}>
                      <IoMdClose size={20} />
                    </button>
                    <div className={styles.uploadModalTitle}>
                      {step3ModalsSettings.uploadTitle}
                      <span className={styles.uploadModalSubtitle}>
                        {isUploading ? `0 of ${pendingPhotos.length} items uploaded` : pendingPhotos.length === 0 ? 'No items selected' : `${pendingPhotos.length} items selected`}
                      </span>
                    </div>
                    <button className={styles.closeBtn} style={{ position: 'static', padding: '4px', visibility: 'hidden' }}>
                      <IoMdClose size={20} />
                    </button>
                  </div>
                  
                  {pendingPhotos.length === 0 ? (
                    <div className={styles.uploadModalBody}>
                      <div className={styles.uploadDragBox}>
                        <FaImages className={styles.uploadDragIcon} />
                        <div className={styles.uploadDragTitle}>Drag and drop</div>
                        <div className={styles.uploadDragSub}>{step3ModalsSettings.uploadSubtitle}</div>
                        <button className={styles.uploadBrowseBtn} onClick={handleBrowseClick}>Browse</button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.uploadModalBodyGrid}>
                      {pendingPhotos.map((photo, i) => (
                        <div key={i} className={styles.uploadPreviewWrap}>
                          <img src={photo} alt="Preview" className={styles.uploadPreviewImg} />
                          {!isUploading && (
                            <button className={styles.uploadDeleteBtn} onClick={() => removePendingPhoto(i)}>
                              <FaTrash size={12} />
                            </button>
                          )}
                          {isUploading && (
                            <div className={styles.uploadOverlayDark}>
                              <div className={styles.uploadSpinner}></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className={styles.uploadModalFooter}>
                    {pendingPhotos.length === 0 ? (
                      <>
                        <span style={{ fontSize: '16px', fontWeight: 600 }}>Done</span>
                        <button className={styles.uploadDoneBtn} disabled>Upload</button>
                      </>
                    ) : (
                      <>
                        <button className={styles.uploadCancelBtn} onClick={closeUploadModal} disabled={isUploading}>Cancel</button>
                        <button 
                          className={isUploading ? styles.uploadDoneBtnActive : styles.uploadDoneBtnActive} 
                          onClick={handleUploadSubmit}
                          disabled={isUploading}
                        >
                          {isUploading ? '...' : 'Upload'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Delete Photo Modal */}
            {photoToDelete !== null && (
              <div className={styles.deleteModalOverlay}>
                <div className={styles.deleteModal}>
                  <div className={styles.deleteModalHeader}>
                    <div style={{ width: '32px' }}></div> {/* Spacer */}
                    <h2 className={styles.deleteModalTitle}>{step3ModalsSettings.deleteTitle}</h2>
                    <button className={styles.closeBtn} style={{ position: 'static' }} onClick={() => setPhotoToDelete(null)}>
                      <IoMdClose />
                    </button>
                  </div>
                  <div className={styles.deleteModalBody}>
                    {step3ModalsSettings.deleteSubtitle}
                  </div>
                  <div className={styles.deleteModalFooter}>
                    <button className={styles.deleteCancelBtn} onClick={() => setPhotoToDelete(null)}>Cancel</button>
                    <button className={styles.deleteConfirmBtn} onClick={confirmDeletePhoto}>Delete it</button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Photo Modal */}
            {photoToEdit !== null && (
              <div className={styles.editModalOverlay}>
                <div className={styles.editModal}>
                  <div className={styles.editModalHeader}>
                    <div style={{ width: '32px' }}></div> {/* Spacer */}
                    <h2 className={styles.editModalTitle}>Edit photo</h2>
                    <button className={styles.closeBtn} style={{ position: 'static', padding: '4px' }} onClick={() => setPhotoToEdit(null)}>
                      <IoMdClose size={20} />
                    </button>
                  </div>
                  
                  <div className={styles.editModalBody}>
                    <div className={styles.editModalImgWrap}>
                      <img src={photos[photoToEdit]} alt="Edit Preview" className={styles.editModalImg} />
                    </div>
                    <div className={styles.editModalRight}>
                      <div className={styles.editModalLabel}>Caption</div>
                      <div className={styles.editModalDesc}>
                        Mention what's special about this space like comfortable furniture or favourite details.
                      </div>
                      <textarea className={styles.editModalTextarea}></textarea>
                    </div>
                  </div>

                  <div className={styles.editModalFooter}>
                    <button 
                      className={styles.editModalDeleteBtn} 
                      onClick={() => {
                        setPhotoToDelete(photoToEdit);
                        setPhotoToEdit(null);
                      }}
                    >
                      Delete photo
                    </button>
                    <button className={styles.editModalSaveBtn} onClick={() => setPhotoToEdit(null)}>Save</button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : step === 4 ? (
          <div className={styles.step6Container}>
            <h1 className={styles.step2Title} style={{ marginBottom: '8px', textAlign: 'left' }}>{step4Settings.title}</h1>
            <p className={styles.mapSubtitle}>{step4Settings.subtitle}</p>
            
            <textarea 
              className={styles.titleTextarea}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={step4Settings.maxLength}
            ></textarea>
            <div className={styles.charCount}>
              {title.length}/{step4Settings.maxLength}
            </div>
          </div>
        ) : step === 5 ? (
          <div className={styles.highlightsContainer}>
            <h1 className={styles.step2Title} style={{ marginBottom: '8px' }}>{step5Settings.title}</h1>
            <p className={styles.mapSubtitle} style={{ textAlign: 'center' }}>{step5Settings.subtitle}</p>
            
            <div className={styles.highlightsGrid}>
              {highlights.map((h) => (
                <div 
                  key={h.id}
                  className={`${styles.highlightPill} ${selectedHighlights.includes(h.id) ? styles.highlightPillSelected : ''}`}
                  onClick={() => toggleHighlight(h.id)}
                >
                  <span className={styles.highlightIcon}>{h.icon}</span>
                  <span>{h.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : step === 6 ? (
          <div className={styles.titleContainer}>
            <h1 className={styles.step2Title} style={{ marginBottom: '8px', textAlign: 'left' }}>Create your description</h1>
            <p className={styles.mapSubtitle}>Share what makes your place special.</p>
            
            <textarea 
              className={styles.titleTextarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              style={{ height: '250px', fontSize: '18px', fontWeight: 400 }}
            ></textarea>
            <div className={styles.charCount}>
              {description.length}/500
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
            <div className={styles.progressFill} style={{ width: step === 1 ? '10%' : step === 2 ? '30%' : step === 3 ? '50%' : step === 4 ? '70%' : step === 5 ? '85%' : '100%' }}></div>
          </div>
          <div className={styles.progressSegment}>
            <div className={styles.progressFill} style={{ width: '0%' }}></div>
          </div>
        </div>
        <div className={styles.footerContent}>
          <button className={styles.backBtn} onClick={handleBack}>Back</button>
          <button 
            className={`${styles.nextBtn} ${(step === 2 && selectedAmenities.length === 0) || (step === 3 && photos.length < 5) || (step === 4 && title.trim().length === 0) || (step === 5 && selectedHighlights.length === 0) || (step === 6 && description.trim().length === 0) ? styles.disabledBtn : ''}`} 
            onClick={handleNext}
            disabled={(step === 2 && selectedAmenities.length === 0) || (step === 3 && photos.length < 5) || (step === 4 && title.trim().length === 0) || (step === 5 && selectedHighlights.length === 0) || (step === 6 && description.trim().length === 0)}
          >
            Next
          </button>
        </div>
      </footer>
    </div>
  );
}
