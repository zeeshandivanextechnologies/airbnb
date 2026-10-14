import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaAirbnb, FaRegCalendarCheck, FaBolt, FaMapMarkerAlt, FaPencilAlt, FaChevronDown, FaChevronUp, FaQuestionCircle, FaCheck } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import styles from '../../components/styles/HostStep1.module.css';

export default function HostStep3() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [bookingSetting, setBookingSetting] = useState('approve');
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isWeekendModalOpen, setIsWeekendModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isBreakdownExpanded, setIsBreakdownExpanded] = useState(false);
  const [basePrice, setBasePrice] = useState(2028);
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
  const [addressDetails, setAddressDetails] = useState({
    country: 'India', flat: '', street: '', landmark: '', district: '', city: '', state: '', pin: ''
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

  const serviceFee = Math.round(basePrice * 0.144);
  const youEarn = basePrice - serviceFee;
  const weekendPrice = Math.round(basePrice * (1 + weekendAdjustment / 100));

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) setStep(4);
    else if (step === 4) setStep(5);
    else if (step === 5) setStep(6);
    else if (step === 6) {
      navigate('/');
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
            <h1 className={styles.step2Title} style={{ marginBottom: '8px', textAlign: 'center' }}>Pick your booking settings</h1>
            <p className={styles.mapSubtitle} style={{ textAlign: 'center', marginBottom: '32px' }}>
              You can change this at any time. <a href="#" style={{ color: '#222', textDecoration: 'underline', fontWeight: 600 }}>Learn more</a>
            </p>
            
            <div style={{ width: '100%' }}>
              <div 
                className={`${styles.bookingOptionCard} ${bookingSetting === 'approve' ? styles.bookingOptionCardSelected : ''}`}
                onClick={() => setBookingSetting('approve')}
              >
                <div className={styles.bookingOptionText}>
                  <div className={styles.bookingOptionTitle}>Approve your first 5 bookings</div>
                  <div className={styles.bookingOptionRecommended}>Recommended</div>
                  <div className={styles.bookingOptionDesc}>
                    Start by reviewing reservation requests, then switch to Instant Book so guests can book automatically.
                  </div>
                </div>
                <div className={styles.bookingOptionIcon}><FaRegCalendarCheck /></div>
              </div>

              <div 
                className={`${styles.bookingOptionCard} ${bookingSetting === 'instant' ? styles.bookingOptionCardSelected : ''}`}
                onClick={() => setBookingSetting('instant')}
              >
                <div className={styles.bookingOptionText}>
                  <div className={styles.bookingOptionTitle}>Use Instant Book</div>
                  <div className={styles.bookingOptionDesc}>
                    Let guests book automatically.
                  </div>
                </div>
                <div className={styles.bookingOptionIcon}><FaBolt /></div>
              </div>
            </div>
          </div>
        ) : step === 3 ? (
          <div className={styles.titleContainer} style={{ alignItems: 'center' }}>
            <h1 className={styles.step2Title} style={{ marginBottom: '8px', textAlign: 'center' }}>Now, set your prices</h1>
            <p className={styles.mapSubtitle} style={{ textAlign: 'center', marginBottom: '32px' }}>
              These suggestions are based on guest demand for similar listings. <a href="#" style={{ color: '#222', textDecoration: 'underline', fontWeight: 600 }}>Learn more</a>
            </p>
            
            <div style={{ width: '100%', maxWidth: '600px' }}>
              <div className={styles.priceCard} onClick={() => setIsPriceModalOpen(true)}>
                <div className={styles.priceCardLabel}>Base price</div>
                <div className={styles.priceCardValue}>
                  ₹{basePrice.toLocaleString('en-IN')}
                </div>
              </div>

              <div className={styles.priceCard} onClick={() => setIsWeekendModalOpen(true)}>
                <div className={styles.priceCardLabel}>Weekend adjustment</div>
                <div className={styles.priceCardValue}>
                  {weekendAdjustment > 0 ? '+' : ''}{weekendAdjustment}%
                  <span className={styles.priceCardSub}>₹{weekendPrice.toLocaleString('en-IN')} for Fri and Sat</span>
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
            <h1 className={styles.step2Title} style={{ marginBottom: '8px', textAlign: 'center' }}>Add discounts</h1>
            <p className={styles.mapSubtitle} style={{ textAlign: 'center', marginBottom: '32px' }}>
              Help your place stand out to get booked faster and earn your first reviews.
            </p>
            
            <div style={{ width: '100%', maxWidth: '650px' }}>
              
              {/* New Listing Promotion */}
              <div className={`${styles.discountCard} ${discounts.newListing ? styles.discountCardSelected : ''}`} onClick={() => toggleDiscount('newListing')}>
                <div className={styles.discountPrefix}>20%</div>
                <div className={styles.discountContent}>
                  <div className={styles.discountTitle}>New listing promotion</div>
                  <div className={styles.discountDesc}>Offer 20% off your first 3 bookings</div>
                </div>
                <div className={`${styles.discountCheckbox} ${discounts.newListing ? styles.discountCheckboxChecked : ''}`}>
                  {discounts.newListing && <FaCheck size={12} />}
                </div>
              </div>

              {/* Last-minute */}
              <div className={`${styles.discountCard} ${discounts.lastMinute ? styles.discountCardSelected : ''}`} onClick={() => toggleDiscount('lastMinute')}>
                <input 
                  type="text" 
                  className={styles.discountPrefixInput} 
                  value={discountValues.lastMinute ? `${discountValues.lastMinute}%` : '0%'} 
                  onChange={(e) => setDiscountValues({...discountValues, lastMinute: parseInt(e.target.value.replace('%', '')) || 0})}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className={styles.discountContent}>
                  <div className={styles.discountTitle}>Last-minute discount</div>
                  <div className={styles.discountDesc}>For stays booked 14 days or less before arrival</div>
                </div>
                <div className={`${styles.discountCheckbox} ${discounts.lastMinute ? styles.discountCheckboxChecked : ''}`}>
                  {discounts.lastMinute && <FaCheck size={12} />}
                </div>
              </div>

              {/* Weekly */}
              <div className={`${styles.discountCard} ${discounts.weekly ? styles.discountCardSelected : ''}`} onClick={() => toggleDiscount('weekly')}>
                <input 
                  type="text" 
                  className={styles.discountPrefixInput} 
                  value={discountValues.weekly ? `${discountValues.weekly}%` : '0%'} 
                  onChange={(e) => setDiscountValues({...discountValues, weekly: parseInt(e.target.value.replace('%', '')) || 0})}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className={styles.discountContent}>
                  <div className={styles.discountTitle}>Weekly discount</div>
                  <div className={styles.discountDesc}>For stays of 7 nights or more</div>
                </div>
                <div className={`${styles.discountCheckbox} ${discounts.weekly ? styles.discountCheckboxChecked : ''}`}>
                  {discounts.weekly && <FaCheck size={12} />}
                </div>
              </div>

              {/* Monthly */}
              <div className={`${styles.discountCard} ${discounts.monthly ? styles.discountCardSelected : ''}`} onClick={() => toggleDiscount('monthly')}>
                <input 
                  type="text" 
                  className={styles.discountPrefixInput} 
                  value={discountValues.monthly ? `${discountValues.monthly}%` : '0%'} 
                  onChange={(e) => setDiscountValues({...discountValues, monthly: parseInt(e.target.value.replace('%', '')) || 0})}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className={styles.discountContent}>
                  <div className={styles.discountTitle}>Monthly discount</div>
                  <div className={styles.discountDesc}>For stays of 28 nights or more</div>
                </div>
                <div className={`${styles.discountCheckbox} ${discounts.monthly ? styles.discountCheckboxChecked : ''}`}>
                  {discounts.monthly && <FaCheck size={12} />}
                </div>
              </div>

              <div style={{ textAlign: 'center', fontSize: '12px', color: '#717171', marginTop: '32px' }}>
                Only one discount will be applied per stay. <a href="#" style={{ color: '#222', textDecoration: 'underline' }}>Learn more</a>
              </div>
            </div>
          </div>
        ) : step === 5 ? (
          <div className={styles.titleContainer} style={{ alignItems: 'flex-start' }}>
            <h1 className={styles.step2Title} style={{ marginBottom: '32px', textAlign: 'left' }}>Share safety details</h1>
            
            <div style={{ width: '100%', maxWidth: '650px', textAlign: 'left' }}>
              <div style={{ fontSize: '18px', color: '#222', marginBottom: '16px' }}>
                Does your place have any of these? <FaQuestionCircle size={14} style={{ display: 'inline', color: '#717171' }} />
              </div>
              
              <div className={styles.safetyRow} onClick={() => toggleSafety('camera')}>
                <div className={styles.safetyLabel}>Exterior security camera present</div>
                <div className={`${styles.safetyCheckbox} ${safetyOptions.camera ? styles.safetyCheckboxChecked : ''}`}>
                  {safetyOptions.camera && <FaCheck size={12} />}
                </div>
              </div>

              {safetyOptions.camera && (
                <div className={styles.cameraDetailsBox}>
                  <div className={styles.cameraDetailsText}>
                    "{cameraDetails}"
                  </div>
                  <button className={styles.cameraDetailsEditBtn} onClick={(e) => { e.stopPropagation(); setTempCameraText(cameraDetails); setIsCameraModalOpen(true); }}>Edit</button>
                </div>
              )}

              <div className={styles.safetyRow} onClick={() => toggleSafety('noise')}>
                <div className={styles.safetyLabel}>Noise decibel monitor present</div>
                <div className={`${styles.safetyCheckbox} ${safetyOptions.noise ? styles.safetyCheckboxChecked : ''}`}>
                  {safetyOptions.noise && <FaCheck size={12} />}
                </div>
              </div>

              <div className={styles.safetyRow} onClick={() => toggleSafety('weapons')}>
                <div className={styles.safetyLabel}>Weapon(s) on the property</div>
                <div className={`${styles.safetyCheckbox} ${safetyOptions.weapons ? styles.safetyCheckboxChecked : ''}`}>
                  {safetyOptions.weapons && <FaCheck size={12} />}
                </div>
              </div>

              <hr style={{ borderTop: '1px solid #ebebeb', margin: '32px 0' }} />

              <div style={{ fontSize: '16px', fontWeight: 600, color: '#222', marginBottom: '16px' }}>Important things to know</div>
              <div style={{ fontSize: '14px', color: '#717171', lineHeight: 1.4, marginBottom: '16px' }}>
                Security cameras that monitor indoor spaces are not allowed even if they're turned off. All exterior security cameras must be disclosed.
              </div>
              <div style={{ fontSize: '14px', color: '#717171', lineHeight: 1.4 }}>
                Be sure to comply with your <a href="#" style={{ color: '#222', textDecoration: 'underline' }}>local laws</a> and review Airbnb's <a href="#" style={{ color: '#222', textDecoration: 'underline' }}>anti-discrimination policy</a> and <a href="#" style={{ color: '#222', textDecoration: 'underline' }}>guest and host fees</a>.
              </div>
            </div>
          </div>
        ) : step === 6 ? (
          <div className={styles.titleContainer} style={{ alignItems: 'flex-start' }}>
            <h1 className={styles.step2Title} style={{ marginBottom: '8px', textAlign: 'left' }}>Provide a few final details</h1>
            <p className={styles.mapSubtitle} style={{ textAlign: 'left', marginBottom: '32px' }}>
              This is required to comply with financial regulations and helps us prevent fraud.
            </p>
            
            <div style={{ width: '100%', maxWidth: '650px', textAlign: 'left' }}>
              <div style={{ fontSize: '18px', color: '#222', marginBottom: '4px', fontWeight: 600 }}>What's your residential address?</div>
              <div style={{ fontSize: '14px', color: '#717171', marginBottom: '24px' }}>Guests won't see this information.</div>
              
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

              <div style={{ fontSize: '18px', fontWeight: 600, color: '#222', marginBottom: '4px' }}>Are you hosting as a business?</div>
              <div style={{ fontSize: '14px', color: '#717171', marginBottom: '16px' }}>
                This means your business is most likely registered with your government. <a href="#" style={{ color: '#222', textDecoration: 'underline' }} onClick={(e) => { e.preventDefault(); setIsBusinessModalOpen(true); }}>Get details</a>
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
            className={`${styles.nextBtn} ${step === 6 && (!addressDetails.street || !addressDetails.city || !addressDetails.state || !addressDetails.pin || isBusiness === null) ? styles.disabledBtn : ''}`} 
            onClick={handleNext}
            disabled={step === 6 && (!addressDetails.street || !addressDetails.city || !addressDetails.state || !addressDetails.pin || isBusiness === null)}
          >
            {step === 6 ? 'Create listing' : 'Next'}
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
                    onChange={(e) => setBasePrice(Number(e.target.value) || 0)}
                    onBlur={() => setIsEditingPrice(false)}
                    autoFocus
                    style={{ fontSize: '48px', fontWeight: 800, color: '#222', border: 'none', background: 'transparent', width: `${String(basePrice).length + 1}ch`, outline: 'none', padding: 0 }}
                  />
                </div>
              ) : (
                <>
                  ₹{basePrice.toLocaleString('en-IN')}
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
                  <span>₹{basePrice.toLocaleString('en-IN')}</span>
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
            <h2 className={styles.mapModalInfoTitle}>Compare similar listings</h2>
            <div className={styles.mapModalInfoSub}>Entire home/flat · 1 bedroom<br/>1 Oct 2025 - 1 Oct 2026</div>
            
            <h3 className={styles.mapModalInfoSectTitle}>Booked listings</h3>
            <div className={styles.mapModalInfoDesc}>
              Most listings with reservations during these dates were an average of ₹962 - ₹3,864 per night.
            </div>
            <a href="#" style={{ color: '#222', fontSize: '14px', fontWeight: 600, textDecoration: 'underline' }}>Learn more</a>
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
            
            <h2 className={styles.priceModalTitle} style={{ textAlign: 'left', fontSize: '22px', marginBottom: '8px' }}>Tell guests about your exterior security cameras</h2>
            <div style={{ fontSize: '14px', color: '#717171' }}>
              Describe the area that each camera monitors, such as the back garden or pool. <a href="#" style={{ color: '#222', textDecoration: 'underline', fontWeight: 600 }}>Learn more</a>
            </div>

            <textarea 
              className={styles.cameraModalTextarea}
              value={tempCameraText}
              onChange={(e) => setTempCameraText(e.target.value.substring(0, 300))}
              placeholder="e.g. Camera facing the driveway"
              autoFocus
            ></textarea>
            <div className={styles.cameraModalCharCount}>
              {300 - tempCameraText.length} characters available
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
            <h2 className={styles.priceModalTitle} style={{ textAlign: 'center', fontSize: '18px', marginBottom: '24px', fontWeight: 800 }}>Hosting as a business</h2>
            
            <div style={{ fontSize: '14px', color: '#222', lineHeight: 1.5, marginBottom: '24px' }}>
              Select "yes" if you're registered as a business with your government and have a business registration number or tax ID.
            </div>

            <div style={{ fontSize: '14px', color: '#222', lineHeight: 1.5, marginBottom: '24px' }}>
              <strong>For hosts in the EEA, Switzerland or the UK</strong><br/>
              If you're not registered, you may also qualify as a business under local rules. For example, hosting is your primary profession or you're a sole trader where registration is optional. <a href="#" style={{ color: '#222', textDecoration: 'underline', fontWeight: 600 }}>Learn more</a>
            </div>

            <div style={{ fontSize: '14px', color: '#222', lineHeight: 1.5 }}>
              <strong>For hosts in South Korea</strong><br/>
              Korean law has specific business registration requirements. If you're not yet registered and you need to be, you can still select "yes" now, then complete registration before you publish. <a href="#" style={{ color: '#222', textDecoration: 'underline', fontWeight: 600 }}>Learn more</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
