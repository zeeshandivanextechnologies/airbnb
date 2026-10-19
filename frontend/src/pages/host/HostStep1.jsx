import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { FaAirbnb, FaHome, FaBuilding, FaCoffee, FaShip, FaShuttleVan, FaWarehouse, FaGlobe, FaTractor, FaMapMarkerAlt, FaPlus, FaMinus } from 'react-icons/fa';
import { MdCabin, MdHouseSiding, MdCastle, MdOutlineFestival, MdAccountBalance, MdLocationCity, MdNaturePeople, MdOutlineMeetingRoom } from 'react-icons/md';
import { GiBarn, GiCaveEntrance, GiIgloo, GiCampingTent, GiBunkBeds } from 'react-icons/gi';
import { BiHomeAlt, BiDoorOpen } from 'react-icons/bi';
import { renderCategoryIcon } from '../../utils/categoryIcons.jsx';
import styles from '../../components/styles/HostStep1.module.css';

const defaultPropertyTypes = [
  { id: 'house', label: 'House', icon: 'home' },
  { id: 'apartment', label: 'Flat/apartment', icon: 'apartment' },
  { id: 'barn', label: 'Barn', icon: 'barn' },
  { id: 'bnb', label: 'Bed & breakfast', icon: 'bnb' },
  { id: 'boat', label: 'Boat', icon: 'boat' },
  { id: 'cabin', label: 'Cabin', icon: 'cabin' },
  { id: 'campervan', label: 'Campervan/motorhome', icon: 'campervan' },
  { id: 'casa', label: 'Casa particular', icon: 'casa' },
  { id: 'castle', label: 'Castle', icon: 'castle' },
  { id: 'cave', label: 'Cave', icon: 'cave' },
  { id: 'container', label: 'Container', icon: 'container' },
  { id: 'cycladic', label: 'Cycladic home', icon: 'cycladic' },
  { id: 'dammuso', label: 'Dammuso', icon: 'dammuso' },
  { id: 'dome', label: 'Dome', icon: 'dome' },
  { id: 'earth_home', label: 'Earth home', icon: 'earth_home' },
  { id: 'farm', label: 'Farm', icon: 'farm' },
  { id: 'guesthouse', label: 'Guest house', icon: 'guesthouse' },
  { id: 'hotel', label: 'Hotel', icon: 'hotel' },
  { id: 'houseboat', label: 'Houseboat', icon: 'houseboat' },
{ id: 'minsu', label: 'Minsu', icon: 'minsu' },
{ id: 'riad', label: 'Riad', icon: 'riad' },
{ id: 'ryokan', label: 'Ryokan', icon: 'ryokan' },
{ id: 'shepherds-hut', label: "Shepherd's hut", icon: 'shepherds-hut' },
{ id: 'tent', label: 'Tent', icon: 'tent' },
{ id: 'tiny-home', label: 'Tiny home', icon: 'tiny-home' },
{ id: 'tower', label: 'Tower', icon: 'tower' },
{ id: 'tree-house', label: 'Tree house', icon: 'tree-house' },
{ id: 'trullo', label: 'Trullo', icon: 'trullo' },
{ id: 'windmill', label: 'Windmill', icon: 'windmill' },
{ id: 'yurt', label: 'Yurt', icon: 'yurt' }
];

export default function HostStep1() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(() => {
    const qStep = parseInt(searchParams.get('step'), 10);
    if (!isNaN(qStep) && qStep >= 1 && qStep <= 6) return qStep;
    try {
      const stored = localStorage.getItem('host_step1_data');
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

  const [selectedType, setSelectedType] = useState(() => {
    try {
      const stored = localStorage.getItem('host_step1_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.selectedType) return parsed.selectedType;
      }
    } catch (e) {}
    return null;
  });
  const defaultPlaceTypes = [
    { key: 'entire', title: 'An entire place', subtitle: 'Guests have the whole place to themselves.', icon: 'home' },
    { key: 'room', title: 'A room', subtitle: 'Guests have their own room in a home, plus access to shared spaces.', icon: 'door' },
    { key: 'shared', title: 'A shared room in a hostel', subtitle: 'Guests sleep in a shared room in a professionally managed hostel with staff on-site 24/7.', icon: 'bunkbeds' }
  ];

  const [placeType, setPlaceType] = useState(() => {
    try {
      const stored = localStorage.getItem('host_step1_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.placeType) return parsed.placeType;
      }
    } catch (e) {}
    return null;
  });
  const [propertyTypes, setPropertyTypes] = useState(defaultPropertyTypes);
  const [placeTypes, setPlaceTypes] = useState(defaultPlaceTypes);
  const [loadingTypes, setLoadingTypes] = useState(false);

  const [showPreciseLocation, setShowPreciseLocation] = useState(true);

  // Dynamic Step 5 Location Privacy Settings from Backend
  const [step5Config, setStep5Config] = useState({
    title: 'Choose how guests see your location on a map',
    subtitle: "We only share your address after guests book. Until then, they'll see an approximate location.",
    toggle_label: 'Show precise location',
    toggle_subtitle: "Let guests see your home's exact location on the map before they book.",
    default_state: true,
    learn_more_link: '/privacy-policy'
  });

  // Dynamic Step 6 Basics Settings from Backend
  const [step6Config, setStep6Config] = useState({
    title: 'Share some basics about your place',
    subtitle: "You'll add more details later, such as bed types."
  });
  const [step6Basics, setStep6Basics] = useState([
    { key: 'guests', label: 'Guests', default_val: 4, min_val: 1, max_val: 30 },
    { key: 'bedrooms', label: 'Bedrooms', default_val: 1, min_val: 1, max_val: 20 },
    { key: 'beds', label: 'Beds', default_val: 1, min_val: 1, max_val: 30 },
    { key: 'bathrooms', label: 'Bathrooms', default_val: 1, min_val: 1, max_val: 15 }
  ]);
  const [basicsValues, setBasicsValues] = useState({
    guests: 4,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1
  });

  // Fetch dynamic property types, place types, step 5 & step 6 config from backend API
  useEffect(() => {
    const fetchStep1Taxonomy = async () => {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      try {
        setLoadingTypes(true);
        const [propRes, placeRes, stepRes, step6Res, basicsRes] = await Promise.all([
          fetch(`${baseUrl}/listings/property-types`),
          fetch(`${baseUrl}/listings/place-types`),
          fetch(`${baseUrl}/listings/step-settings?key=step5_location`),
          fetch(`${baseUrl}/listings/step-settings?key=step6_basics`),
          fetch(`${baseUrl}/listings/step-basics`)
        ]);

        const propData = await propRes.json();
        if (propData.success && Array.isArray(propData.data) && propData.data.length > 0) {
          setPropertyTypes(propData.data.map(pt => ({
            id: pt.slug || String(pt.id),
            label: pt.name,
            icon: pt.icon || 'home',
            description: pt.description
          })));
        }

        const placeData = await placeRes.json();
        if (placeData.success && Array.isArray(placeData.data) && placeData.data.length > 0) {
          setPlaceTypes(placeData.data.map(pl => ({
            key: pl.key,
            title: pl.title,
            subtitle: pl.subtitle,
            icon: pl.icon || 'home'
          })));
        }

        const stepData = await stepRes.json();
        if (stepData.success && Array.isArray(stepData.data) && stepData.data.length > 0) {
          const s5 = stepData.data[0];
          setStep5Config(s5);
          setShowPreciseLocation(s5.default_state !== false);
        }

        const s6Data = await step6Res.json();
        if (s6Data.success && Array.isArray(s6Data.data) && s6Data.data.length > 0) {
          setStep6Config(s6Data.data[0]);
        }

        const bData = await basicsRes.json();
        if (bData.success && Array.isArray(bData.data) && bData.data.length > 0) {
          setStep6Basics(bData.data);
          const initialVals = {};
          bData.data.forEach(item => {
            initialVals[item.key] = item.default_val || 1;
          });
          setBasicsValues(initialVals);
        }
      } catch (err) {
        console.warn('Using default step 1 taxonomy:', err.message);
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchStep1Taxonomy();
  }, []);

  // Dynamic Address selected from HostSetup Address Modal
  const [savedAddress, setSavedAddress] = useState(() => {
    try {
      const stored = localStorage.getItem('host_address');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const displayFullAddress = savedAddress?.full_address || 
    (savedAddress?.street ? `${savedAddress.street}, ${savedAddress.city || 'Jaipur'}, ${savedAddress.state || 'Rajasthan'} ${savedAddress.pin || '302021'}, India` : null) || 
    'Vaishali Tower II, B Block, Vaishali Nagar, Jaipur, Jaipur Nagar Nigam Area, Rajasthan 302021, India';

  // Dynamic Google Maps Embed URL generated from live address or coordinates
  const mapEmbedUrl = (() => {
    if (savedAddress?.lat && savedAddress?.lng) {
      return `https://maps.google.com/maps?q=${savedAddress.lat},${savedAddress.lng}&hl=en&z=16&output=embed`;
    }
    const query = encodeURIComponent(displayFullAddress);
    return `https://maps.google.com/maps?q=${query}&hl=en&z=15&output=embed`;
  })();

  // Step 6 state
  const [guests, setGuests] = useState(4);
  const [bedrooms, setBedrooms] = useState(1);
  const [beds, setBeds] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);

  const handleNext = () => {
    let nextStep = step;
    if (step === 1) nextStep = 2;
    else if (step === 2 && selectedType) nextStep = 3;
    else if (step === 3 && placeType) nextStep = 4;
    else if (step === 4) nextStep = 5;
    else if (step === 5) nextStep = 6;
    else if (step === 6) {
      // Save Step 1 configuration to localStorage
      try {
        const step1Data = {
          lastStep: 6,
          selectedType,
          placeType,
          showPreciseLocation,
          guests: basicsValues.guests ?? 4,
          bedrooms: basicsValues.bedrooms ?? 1,
          beds: basicsValues.beds ?? 1,
          bathrooms: basicsValues.bathrooms ?? 1,
          basics: basicsValues,
          address: savedAddress
        };
        localStorage.setItem('host_step1_data', JSON.stringify(step1Data));
        localStorage.setItem('host_resume_route', '/step2?step=1');
      } catch (e) {
        console.warn('Failed to cache step 1 data');
      }
      navigate('/step2');
      return;
    }

    setStep(nextStep);
    try {
      localStorage.setItem('host_resume_route', `/step1?step=${nextStep}`);
      const existing = localStorage.getItem('host_step1_data');
      const obj = existing ? JSON.parse(existing) : {};
      obj.lastStep = nextStep;
      obj.selectedType = selectedType;
      obj.placeType = placeType;
      localStorage.setItem('host_step1_data', JSON.stringify(obj));
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
      navigate('/host');
      return;
    }

    setStep(prevStep);
    try {
      localStorage.setItem('host_resume_route', `/step1?step=${prevStep}`);
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

      const hostId = currentUserId || 4;
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

      const draftPayload = {
        title: selectedType ? `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} hosted by ${currentUserName}` : 'Home in progress',
        type: placeType === 'room' ? 'Room' : (placeType === 'shared' ? 'Shared room' : 'Entire place'),
        category: selectedType ? (selectedType.charAt(0).toUpperCase() + selectedType.slice(1)) : 'Home',
        host_name: currentUserName,
        host_id: hostId,
        city: savedAddress?.city || 'Jaipur, Rajasthan',
        price: 2000,
        status: 'In progress',
        cover_img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        photos: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'],
        amenities: [],
        description: 'Listing creation in progress. Finish required steps to publish.',
        residential_address: savedAddress || {}
      };

      try {
        const step1Data = {
          lastStep: step,
          selectedType,
          placeType,
          showPreciseLocation,
          guests: basicsValues.guests ?? 4,
          bedrooms: basicsValues.bedrooms ?? 1,
          beds: basicsValues.beds ?? 1,
          bathrooms: basicsValues.bathrooms ?? 1,
          basics: basicsValues,
          address: savedAddress
        };
        localStorage.setItem('host_step1_data', JSON.stringify(step1Data));
        localStorage.setItem('host_resume_route', `/step1?step=${step}`);
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
      console.warn('Save & exit draft warning:', e);
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
            <div className="col-md-6 d-flex flex-column justify-content-center mb-5 mb-md-0">
              <span className={styles.stepText}>Step 1</span>
              <h1 className={styles.title}>
                Tell us about your place
              </h1>
              <p className={styles.description}>
                In this step, we'll ask you which type of property you have and if guests will book the entire place or just a room. Then let us know the location and how many guests can stay.
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
          <div className={styles.step2Container}>
            <h1 className={styles.step2Title}>Which of these best describes your place?</h1>
            
            <div className={styles.gridContainer}>
              {propertyTypes.map((type) => (
                <div 
                  key={type.id}
                  className={`${styles.typeCard} ${selectedType === type.id ? styles.typeCardSelected : ''}`}
                  onClick={() => setSelectedType(type.id)}
                >
                  <div className={styles.typeIcon}>
                    {renderCategoryIcon(type.icon, { size: 30 })}
                  </div>
                  <div className={styles.typeLabel}>{type.label}</div>
                </div>
              ))}
            </div>
          </div>
        ) : step === 3 ? (
          <div className={styles.step3Container}>
            <h1 className={styles.step2Title}>What type of place will guests have?</h1>
            
            <div className={styles.placeTypeList}>
              {placeTypes.map((pl) => (
                <div 
                  key={pl.key}
                  className={`${styles.placeTypeCard} ${placeType === pl.key ? styles.placeTypeCardSelected : ''}`}
                  onClick={() => setPlaceType(pl.key)}
                >
                  <div className={styles.placeTypeText}>
                    <div className={styles.placeTypeTitle}>{pl.title}</div>
                    <div className={styles.placeTypeSubtitle}>{pl.subtitle}</div>
                  </div>
                  <div className={styles.placeTypeIcon}>
                    {renderCategoryIcon(pl.icon || pl.key, { size: 30 })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : step === 4 ? (
          <div className={styles.step4Container}>
            <h1 className={styles.step2Title} style={{ marginBottom: '8px' }}>Is the pin in the right spot?</h1>
            <p className={styles.mapSubtitle}>Your address is only shared with guests after they've made a reservation.</p>
            
            <div className={styles.mapContainer}>
              <iframe 
                src={mapEmbedUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              ></iframe>
              
              <div className={styles.mapOverlayTop}>
                <FaMapMarkerAlt style={{ color: '#222', flexShrink: 0, marginTop: '2px' }} />
                <span className={styles.mapOverlayTopText}>
                  {displayFullAddress}
                </span>
              </div>
              
              <div className={styles.mapPin}>
                <FaHome size={20} />
              </div>
            </div>
          </div>

        ) : step === 5 ? (
          <div className={styles.step4Container}>
            <h1 className={styles.step2Title} style={{ marginBottom: '8px' }}>
              {step5Config.title || 'Choose how guests see your location on a map'}
            </h1>
            <p className={styles.mapSubtitle}>
              {step5Config.subtitle || "We only share your address after guests book. Until then, they'll see an approximate location."}
            </p>
            
            <div className={styles.mapContainer}>
              <iframe 
                src={mapEmbedUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              ></iframe>
              
              <div className={styles.mapOverlayTop}>
                <FaMapMarkerAlt style={{ color: '#222', flexShrink: 0, marginTop: '2px' }} />
                <span className={styles.mapOverlayTopText}>
                  {displayFullAddress}
                </span>
              </div>
              
              <div className={styles.mapPin}>
                <FaHome size={20} />
              </div>
              
              <div className={styles.mapOverlayBottom}>
                <div className={styles.mapOverlayBottomText}>
                  <div className={styles.mapOverlayBottomTitle}>
                    {step5Config.toggle_label || 'Show precise location'}
                  </div>
                  <div className={styles.mapOverlayBottomSubtitle}>
                    {step5Config.toggle_subtitle || "Let guests see your home's exact location on the map before they book."}{' '}
                    <a href={step5Config.learn_more_link || '#'} style={{ color: '#222', fontWeight: 600 }}>
                      Learn more
                    </a>
                  </div>
                </div>
                <label className={styles.toggleSwitch}>
                  <input 
                    type="checkbox" 
                    className={styles.toggleInput} 
                    checked={showPreciseLocation}
                    onChange={() => setShowPreciseLocation(!showPreciseLocation)}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
            </div>
          </div>
        ) : step === 6 ? (
          <div className={styles.step6Container}>
            <h1 className={styles.step2Title} style={{ marginBottom: '8px' }}>
              {step6Config.title || 'Share some basics about your place'}
            </h1>
            <p className={styles.mapSubtitle}>
              {step6Config.subtitle || "You'll add more details later, such as bed types."}
            </p>
            
            {step6Basics.map((item) => {
              const currentVal = basicsValues[item.key] ?? item.default_val ?? 1;
              const minVal = item.min_val ?? 1;
              const maxVal = item.max_val ?? 50;

              return (
                <div key={item.id || item.key} className={styles.counterRow}>
                  <div className={styles.counterLabel}>{item.label}</div>
                  <div className={styles.counterControls}>
                    <button 
                      type="button"
                      className={styles.counterBtn} 
                      onClick={() => setBasicsValues(prev => ({
                        ...prev,
                        [item.key]: Math.max(minVal, currentVal - 1)
                      }))} 
                      disabled={currentVal <= minVal}
                    >
                      <FaMinus size={12} />
                    </button>
                    <div className={styles.counterValue}>{currentVal}</div>
                    <button 
                      type="button"
                      className={styles.counterBtn} 
                      onClick={() => setBasicsValues(prev => ({
                        ...prev,
                        [item.key]: Math.min(maxVal, currentVal + 1)
                      }))}
                      disabled={currentVal >= maxVal}
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.progressBar}>
          <div className={styles.progressSegment}>
            <div className={styles.progressFill} style={{ width: step === 1 ? '10%' : step === 2 ? '20%' : step === 3 ? '40%' : step === 4 ? '60%' : step === 5 ? '80%' : '100%' }}></div>
          </div>
          <div className={styles.progressSegment}>
            <div className={styles.progressFill} style={{ width: '0%' }}></div>
          </div>
          <div className={styles.progressSegment}>
            <div className={styles.progressFill} style={{ width: '0%' }}></div>
          </div>
        </div>
        <div className={styles.footerContent}>
          <button className={styles.backBtn} onClick={handleBack}>Back</button>
          <button 
            className={`${styles.nextBtn} ${((step === 2 && !selectedType) || (step === 3 && !placeType)) ? styles.disabledBtn : ''}`} 
            onClick={handleNext}
            disabled={(step === 2 && !selectedType) || (step === 3 && !placeType)}
          >
            Next
          </button>
        </div>
      </footer>
    </div>
  );
}
