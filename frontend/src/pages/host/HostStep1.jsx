import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaAirbnb, FaHome, FaBuilding, FaCoffee, FaShip, FaShuttleVan, FaWarehouse, FaGlobe, FaTractor, FaMapMarkerAlt, FaPlus, FaMinus } from 'react-icons/fa';
import { MdCabin, MdHouseSiding, MdCastle, MdOutlineFestival, MdAccountBalance, MdLocationCity, MdNaturePeople, MdOutlineMeetingRoom } from 'react-icons/md';
import { GiBarn, GiCaveEntrance, GiIgloo, GiCampingTent, GiBunkBeds } from 'react-icons/gi';
import { BiHomeAlt, BiDoorOpen } from 'react-icons/bi';
import styles from '../../components/styles/HostStep1.module.css';

const propertyTypes = [
  { id: 'house', label: 'House', icon: <FaHome /> },
  { id: 'apartment', label: 'Flat/apartment', icon: <FaBuilding /> },
  { id: 'barn', label: 'Barn', icon: <GiBarn /> },
  { id: 'bnb', label: 'Bed & breakfast', icon: <FaCoffee /> },
  { id: 'boat', label: 'Boat', icon: <FaShip /> },
  { id: 'cabin', label: 'Cabin', icon: <MdCabin /> },
  { id: 'campervan', label: 'Campervan/motorhome', icon: <FaShuttleVan /> },
  { id: 'casa', label: 'Casa particular', icon: <FaHome /> },
  { id: 'castle', label: 'Castle', icon: <MdCastle /> },
  { id: 'cave', label: 'Cave', icon: <GiCaveEntrance /> },
  { id: 'container', label: 'Container', icon: <FaWarehouse /> },
  { id: 'cycladic', label: 'Cycladic home', icon: <GiIgloo /> },
  { id: 'dammuso', label: 'Dammuso', icon: <MdHouseSiding /> },
  { id: 'dome', label: 'Dome', icon: <GiCampingTent /> },
  { id: 'earth_home', label: 'Earth home', icon: <FaGlobe /> },
  { id: 'farm', label: 'Farm', icon: <FaTractor /> },
  { id: 'guesthouse', label: 'Guest house', icon: <BiHomeAlt /> },
  { id: 'hotel', label: 'Hotel', icon: <FaBuilding /> }
];

// Fallback for BiHomeAlt if missing: I will just use FaHome instead to avoid import errors
const safePropertyTypes = propertyTypes.map(pt => pt.id === 'guesthouse' ? { ...pt, icon: <FaHome /> } : pt);

export default function HostStep1() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [placeType, setPlaceType] = useState(null);

  const [showPreciseLocation, setShowPreciseLocation] = useState(true);

  // Step 6 state
  const [guests, setGuests] = useState(4);
  const [bedrooms, setBedrooms] = useState(1);
  const [beds, setBeds] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2 && selectedType) setStep(3);
    else if (step === 3 && placeType) setStep(4);
    else if (step === 4) setStep(5);
    else if (step === 5) setStep(6);
    else if (step === 6) {
      navigate('/step2');
    }
  };

  const handleBack = () => {
    if (step === 6) setStep(5);
    else if (step === 5) setStep(4);
    else if (step === 4) setStep(3);
    else if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
    else navigate('/host');
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <NavLink to="/" className={styles.logoLink}>
          <FaAirbnb size={32} color="#222222" />
        </NavLink>
        <div className={styles.headerRight}>
          <button className={styles.questionsBtn}>Questions?</button>
          <button className={styles.saveExitBtn}>Save & exit</button>
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
              {safePropertyTypes.map((type) => (
                <div 
                  key={type.id}
                  className={`${styles.typeCard} ${selectedType === type.id ? styles.typeCardSelected : ''}`}
                  onClick={() => setSelectedType(type.id)}
                >
                  <div className={styles.typeIcon}>{type.icon}</div>
                  <div className={styles.typeLabel}>{type.label}</div>
                </div>
              ))}
            </div>
          </div>
        ) : step === 3 ? (
          <div className={styles.step3Container}>
            <h1 className={styles.step2Title}>What type of place will guests have?</h1>
            
            <div className={styles.placeTypeList}>
              <div 
                className={`${styles.placeTypeCard} ${placeType === 'entire' ? styles.placeTypeCardSelected : ''}`}
                onClick={() => setPlaceType('entire')}
              >
                <div className={styles.placeTypeText}>
                  <div className={styles.placeTypeTitle}>An entire place</div>
                  <div className={styles.placeTypeSubtitle}>Guests have the whole place to themselves.</div>
                </div>
                <div className={styles.placeTypeIcon}><BiHomeAlt /></div>
              </div>

              <div 
                className={`${styles.placeTypeCard} ${placeType === 'room' ? styles.placeTypeCardSelected : ''}`}
                onClick={() => setPlaceType('room')}
              >
                <div className={styles.placeTypeText}>
                  <div className={styles.placeTypeTitle}>A room</div>
                  <div className={styles.placeTypeSubtitle}>Guests have their own room in a home, plus access to shared spaces.</div>
                </div>
                <div className={styles.placeTypeIcon}><BiDoorOpen /></div>
              </div>

              <div 
                className={`${styles.placeTypeCard} ${placeType === 'shared' ? styles.placeTypeCardSelected : ''}`}
                onClick={() => setPlaceType('shared')}
              >
                <div className={styles.placeTypeText}>
                  <div className={styles.placeTypeTitle}>A shared room in a hostel</div>
                  <div className={styles.placeTypeSubtitle}>Guests sleep in a shared room in a professionally managed hostel with staff on-site 24/7.</div>
                </div>
                <div className={styles.placeTypeIcon}><GiBunkBeds /></div>
              </div>
            </div>
          </div>
        ) : step === 4 ? (
          <div className={styles.step4Container}>
            <h1 className={styles.step2Title} style={{ marginBottom: '8px' }}>Is the pin in the right spot?</h1>
            <p className={styles.mapSubtitle}>Your address is only shared with guests after they've made a reservation.</p>
            
            <div className={styles.mapContainer}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14234.697479717757!2d75.7275089069502!3d26.904803024848972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db49b1ff1b539%3A0x6b4fb8ec042e6a32!2sVaishali%20Nagar%2C%20Jaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
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
                  Vaishali Tower II, B Block, Vaishali Nagar, Jaipur, Jaipur Nagar Nigam Area, Rajasthan 302021, India
                </span>
              </div>
              
              <div className={styles.mapPin}>
                <FaHome size={20} />
              </div>

              <div style={{ position: 'absolute', top: 'calc(50% + 32px)', left: '50%', transform: 'translateX(-50%)', background: '#222', color: 'white', padding: '8px 16px', borderRadius: '24px', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                Drag the map to reposition the pin
              </div>
            </div>
          </div>

        ) : step === 5 ? (
          <div className={styles.step4Container}>
            <h1 className={styles.step2Title} style={{ marginBottom: '8px' }}>Choose how guests see your location on a map</h1>
            <p className={styles.mapSubtitle}>We only share your address after guests book. Until then, they'll see an approximate location.</p>
            
            <div className={styles.mapContainer}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14234.697479717757!2d75.7275089069502!3d26.904803024848972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db49b1ff1b539%3A0x6b4fb8ec042e6a32!2sVaishali%20Nagar%2C%20Jaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
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
                  Vaishali Tower II, B Block, Vaishali Nagar, Jaipur, Jaipur Nagar Nigam Area, Rajasthan 302021, India
                </span>
              </div>
              
              <div className={styles.mapPin}>
                <FaHome size={20} />
              </div>
              
              <div className={styles.mapOverlayBottom}>
                <div className={styles.mapOverlayBottomText}>
                  <div className={styles.mapOverlayBottomTitle}>Show precise location</div>
                  <div className={styles.mapOverlayBottomSubtitle}>Let guests see your home's exact location on the map before they book. <a href="#" style={{ color: '#222', fontWeight: 600 }}>Learn more</a></div>
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
            <h1 className={styles.step2Title} style={{ marginBottom: '8px' }}>Share some basics about your place</h1>
            <p className={styles.mapSubtitle}>You'll add more details later, such as bed types.</p>
            
            <div className={styles.counterRow}>
              <div className={styles.counterLabel}>Guests</div>
              <div className={styles.counterControls}>
                <button className={styles.counterBtn} onClick={() => setGuests(Math.max(1, guests - 1))} disabled={guests <= 1}>
                  <FaMinus size={12} />
                </button>
                <div className={styles.counterValue}>{guests}</div>
                <button className={styles.counterBtn} onClick={() => setGuests(guests + 1)}>
                  <FaPlus size={12} />
                </button>
              </div>
            </div>

            <div className={styles.counterRow}>
              <div className={styles.counterLabel}>Bedrooms</div>
              <div className={styles.counterControls}>
                <button className={styles.counterBtn} onClick={() => setBedrooms(Math.max(1, bedrooms - 1))} disabled={bedrooms <= 1}>
                  <FaMinus size={12} />
                </button>
                <div className={styles.counterValue}>{bedrooms}</div>
                <button className={styles.counterBtn} onClick={() => setBedrooms(bedrooms + 1)}>
                  <FaPlus size={12} />
                </button>
              </div>
            </div>

            <div className={styles.counterRow}>
              <div className={styles.counterLabel}>Beds</div>
              <div className={styles.counterControls}>
                <button className={styles.counterBtn} onClick={() => setBeds(Math.max(1, beds - 1))} disabled={beds <= 1}>
                  <FaMinus size={12} />
                </button>
                <div className={styles.counterValue}>{beds}</div>
                <button className={styles.counterBtn} onClick={() => setBeds(beds + 1)}>
                  <FaPlus size={12} />
                </button>
              </div>
            </div>

            <div className={styles.counterRow}>
              <div className={styles.counterLabel}>Bathrooms</div>
              <div className={styles.counterControls}>
                <button className={styles.counterBtn} onClick={() => setBathrooms(Math.max(1, bathrooms - 1))} disabled={bathrooms <= 1}>
                  <FaMinus size={12} />
                </button>
                <div className={styles.counterValue}>{bathrooms}</div>
                <button className={styles.counterBtn} onClick={() => setBathrooms(bathrooms + 1)}>
                  <FaPlus size={12} />
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
