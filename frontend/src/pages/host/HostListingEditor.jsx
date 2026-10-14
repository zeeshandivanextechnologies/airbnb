import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaCog, FaEye, FaPlus, FaChevronRight, FaImages, FaSnowflake, FaDoorClosed, FaArchive, FaClock, FaUserFriends, FaBellSlash, FaVideo, FaTimes, FaCheckCircle } from 'react-icons/fa';
import styles from '../../components/styles/HostListingEditor.module.css';
import VerifyBanner from '../../components/VerifyBanner';

function HostListingEditor() {
  const [activeTab, setActiveTab] = useState('Your space');
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [checkInStart, setCheckInStart] = useState("3:00 pm");
  const [checkInEnd, setCheckInEnd] = useState("Flexible");
  const [checkoutTime, setCheckoutTime] = useState("11:00 am");
  
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const hasChanges = checkInStart !== "3:00 pm" || checkInEnd !== "Flexible" || checkoutTime !== "11:00 am";

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

  return (
    <div className={`container-fluid p-0 ${styles.editorPage}`}>
      <VerifyBanner />
      <div className="row w-100 m-0 flex-grow-1" style={{ overflow: 'hidden' }}>
        
        {/* Left Sidebar (Scrollable) */}
        <div className={`col-lg-4 ${styles.leftSidebar}`}>
          {!isSettingsOpen ? (
            <>
          <div className={styles.headerRow}>
            <button className={styles.backBtn}>
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
                Your space
              </button>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'Arrival guide' ? styles.active : ''}`}
                onClick={() => setActiveTab('Arrival guide')}
              >
                Arrival guide
              </button>
            </div>
            <button className={styles.settingsBtn} onClick={() => setIsSettingsOpen(true)}>
              <FaCog size={16} />
            </button>
          </div>

          {activeTab === 'Your space' && (
            <>

          <div className={styles.cardItem} style={{cursor: 'pointer'}} onClick={() => setIsOffcanvasOpen(true)}>
            <div className={styles.cardFlex}>
              <div className={styles.cardIconBadge}>
                <span className={styles.badgeDark}>2</span>
                <span>🛡️</span>
              </div>
              <div>
                <h3 className={styles.cardTitle}>Complete steps to publish</h3>
                <p className={styles.cardSub}>Required to publish</p>
              </div>
            </div>
          </div>

          <div className={styles.cardItemOutline}>
            <h3 className={styles.cardTitleLg}>Photo tour</h3>
            <p className={styles.cardSub} style={{marginBottom: '16px'}}>1 bedroom · 1 bed · 1 bath</p>
            
            {/* Visual representation of layered photos */}
            <div style={{height: '140px', backgroundColor: '#f7f7f7', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center'}}>
               <img src="/face_04.avif" alt="preview" style={{width: '120px', height: '100px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)'}} />
            </div>

            <div className={styles.taskText}>
              <span className={styles.orangeDot}></span>
              You have 2 tasks
            </div>
          </div>

          <div className={styles.cardItem}>
            <h3 className={styles.cardTitleLg}>Title</h3>
            <p className={styles.cardSub}>hi</p>
          </div>
          
          <div className={styles.cardItem}>
            <h3 className={styles.cardTitleLg}>Property type</h3>
            <p className={styles.cardSub}>Entire place</p>
          </div>
          
          {/* Old description removed */}

          <div className={styles.cardItem}>
             <h3 className={styles.cardTitleLg}>Sleeping arrangements</h3>
             <div className={styles.innerActionBox}>
               <div className={styles.innerActionBoxContent}>
                 <span style={{fontSize: '20px'}}>🛏️</span>
                 Add sleeping arrangements
               </div>
               <FaChevronRight size={14} color="#717171" />
             </div>
          </div>

          <div className={styles.cardItem}>
            <h3 className={styles.cardTitleLg}>Pricing</h3>
            <p className={styles.cardSub}>₹2,024 - ₹2,145 per night</p>
          </div>

          <div className={styles.cardItem}>
            <h3 className={styles.cardTitleLg}>Discounts</h3>
            <p className={styles.cardSub} style={{marginBottom: '4px'}}>10% weekly discount</p>
            <p className={styles.cardSub}>20% monthly discount</p>
          </div>

          <div className={styles.cardItem}>
            <h3 className={styles.cardTitleLg}>Booking settings</h3>
            <p className={styles.cardSub}>Your first 5 bookings require approval.</p>
            <div className={styles.innerActionBox}>
               <div className={styles.innerActionBoxContent}>
                 <span style={{fontSize: '20px'}}>⚡</span>
                 <span className={styles.innerActionBoxSub}>
                   Instant Book listings often get booked quicker.
                 </span>
               </div>
            </div>
          </div>

          <div className={styles.cardItem}>
            <h3 className={styles.cardTitleLg}>Availability</h3>
            <p className={styles.cardSub} style={{marginBottom: '4px'}}>1–365 night stays</p>
            <p className={styles.cardSub}>Same-day advance notice</p>
          </div>

          <div className={styles.cardItem}>
            <h3 className={styles.cardTitleLg}>Number of guests</h3>
            <p className={styles.cardSub}>4 guests</p>
          </div>

          <div className={styles.cardItem}>
             <h3 className={styles.cardTitleLg}>Description</h3>
             <p className={styles.cardSub}>Take it easy at this unique and tranquil getaway.</p>
          </div>

          <div className={styles.cardItem}>
             <h3 className={styles.cardTitleLg}>Amenities</h3>
             <div style={{display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px'}}>
               <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                 <FaSnowflake size={24} color="#222222" />
                 <span style={{fontSize: '16px', color: '#222222'}}>Air conditioning</span>
               </div>
               <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                 <FaDoorClosed size={24} color="#222222" />
                 <span style={{fontSize: '16px', color: '#222222'}}>Essentials</span>
               </div>
               <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                 <FaArchive size={24} color="#222222" />
                 <span style={{fontSize: '16px', color: '#222222'}}>Fridge</span>
               </div>
             </div>
          </div>

          <div className={styles.cardItem}>
            <h3 className={styles.cardTitleLg}>Accessibility features</h3>
            <p className={styles.cardSub}>Add details</p>
          </div>

          <div className={styles.cardItem}>
            <h3 className={styles.cardTitleLg} style={{marginBottom: '16px'}}>Location</h3>
            <iframe 
              src="https://maps.google.com/maps?q=Vaishali%20Nagar,%20Jaipur&t=&z=13&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="200" 
              style={{ border: 0, borderRadius: '12px', marginBottom: '16px' }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map"
            ></iframe>
            <p className={styles.cardSub} style={{fontSize: '14px', lineHeight: '1.4', color: '#717171'}}>
              Vaishali Tower II, B Block, Vaishali Nagar, Jaipur, Jaipur Nagar Nigam Area, Rajasthan 302021, India
            </p>
          </div>

          <div className={styles.cardItem} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '32px'}}>
            <h3 className={styles.cardTitleLg} style={{alignSelf: 'flex-start', width: '100%', marginBottom: '24px'}}>About the host</h3>
            
            <div >
              <img 
                src="/face_04.avif" 
                alt="Host" 
                style={{width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover'}} 
              />
      
            </div>
            
            <h4 style={{fontSize: '16px', fontWeight: '700', margin: '24px 0 4px 0', color: '#222222'}}>Mohammad</h4>
            <p style={{fontSize: '14px', color: '#717171', margin: 0}}>Started hosting in 2026</p>
          </div>

          <div className={styles.cardItem}>
            <h3 className={styles.cardTitleLg}>Co-hosts</h3>
            <p className={styles.cardSub}>Add details</p>
          </div>

          <div className={styles.cardItem}>
             <h3 className={styles.cardTitleLg}>House rules</h3>
             <div style={{display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px'}}>
               <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                 <FaClock size={24} color="#222222" />
                 <span style={{fontSize: '16px', color: '#222222'}}>Check-in after 3:00 pm</span>
               </div>
               <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                 <FaUserFriends size={24} color="#222222" />
                 <span style={{fontSize: '16px', color: '#222222'}}>4 guests maximum</span>
               </div>
             </div>
          </div>

          <div className={styles.cardItem}>
             <h3 className={styles.cardTitleLg}>Guest safety</h3>
             <div style={{display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px'}}>
               <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                 <FaBellSlash size={24} color="#222222" />
                 <span style={{fontSize: '16px', color: '#222222'}}>Carbon monoxide alarm not reported</span>
               </div>
               <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                 <FaBellSlash size={24} color="#222222" />
                 <span style={{fontSize: '16px', color: '#222222'}}>Smoke alarm not reported</span>
               </div>
               <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                 <FaVideo size={24} color="#222222" />
                 <span style={{fontSize: '16px', color: '#222222'}}>Exterior security camera present</span>
               </div>
               <p style={{fontSize: '14px', color: '#717171', margin: '4px 0 0 0', cursor: 'pointer', fontWeight: '600'}}>+ 2 more</p>
             </div>
          </div>

          <div className={styles.cardItem}>
            <h3 className={styles.cardTitleLg}>Cancellation policy</h3>
            <p className={styles.cardSub} style={{marginBottom: '4px'}}>Flexible for short-term stays</p>
            <p className={styles.cardSub}>Firm Long-Term for long-term stays</p>
          </div>

          <div className={styles.cardItem}>
            <h3 className={styles.cardTitleLg}>Custom link</h3>
            <p className={styles.cardSub} style={{marginBottom: '4px'}}>Add Address</p>

          </div>
          </>
          )}

          {activeTab === 'Arrival guide' && (
            <>
              <div className={styles.cardItemOutline} style={{display: 'flex', padding: 0, overflow: 'hidden'}}>
                <div style={{flex: 1, padding: '24px', borderRight: '1px solid #ebebeb'}}>
                  <h3 className={styles.cardTitleLg} style={{fontSize: '14px'}}>Check-in</h3>
                  <p className={styles.cardSub} style={{fontSize: '14px'}}>3:00 pm</p>
                </div>
                <div style={{flex: 1, padding: '24px'}}>
                  <h3 className={styles.cardTitleLg} style={{fontSize: '14px'}}>Checkout</h3>
                  <p className={styles.cardSub} style={{fontSize: '14px'}}>11:00 am</p>
                </div>
              </div>

              <div className={styles.cardItem}>
                <h3 className={styles.cardTitleLg}>Directions</h3>
                <p className={styles.cardSub}>Add details</p>
              </div>

              <div className={styles.cardItem}>
                <h3 className={styles.cardTitleLg}>Check-in method</h3>
                <p className={styles.cardSub}>Add details</p>
              </div>

              <div className={styles.cardItem}>
                <h3 className={styles.cardTitleLg}>Wifi details</h3>
                <p className={styles.cardSub}>Add details</p>
              </div>

              <div className={styles.cardItem}>
                <h3 className={styles.cardTitleLg}>House manual</h3>
                <p className={styles.cardSub}>Add details</p>
              </div>

              <div className={styles.cardItem} style={{paddingBottom: '40px'}}>
                <h3 className={styles.cardTitleLg}>House rules</h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <FaClock size={20} color="#222222" />
                    <span style={{fontSize: '14px', color: '#222222'}}>Check-in after 3:00 pm</span>
                  </div>

                   <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                 <FaUserFriends size={24} color="#222222" />
                 <span style={{fontSize: '16px', color: '#222222'}}>4 guests maximum</span>
               </div>
                </div>
              </div>

               <div className={styles.cardItem}>
                <h3 className={styles.cardTitleLg}>Checkout instructions</h3>
                <p className={styles.cardSub}>Add details</p>
              </div>
              
               <div className={styles.cardItem}>
                <h3 className={styles.cardTitleLg}>Guidebooks</h3>
                <p className={styles.cardSub}>Create a guidebook to easily share local tips with guests.</p>
              </div>
              <div className={styles.cardItem}>
                <h3 className={styles.cardTitleLg}>Interaction preferences</h3>
                <p className={styles.cardSub}>Add details</p>
              </div>

            </>
          )}

          <button className={styles.floatingViewBtn}>
            <FaEye /> View
          </button>
            </>
          ) : (
            <>
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
                    <div className={styles.settingsNavSub}>English</div>
                  </div>
                  <FaChevronRight size={14} />
                </div>
                <div className={styles.settingsNavItem}>
                  <div>
                    <div className={styles.settingsNavTitle}>Guest requirements</div>
                    <div className={styles.settingsNavSub}>Profile photo not required</div>
                  </div>
                  <FaChevronRight size={14} />
                </div>
                <div className={styles.settingsNavItem}>
                  <div>
                    <div className={styles.settingsNavTitle}>Local laws</div>
                    <div className={styles.settingsNavSub}>Review your local laws</div>
                  </div>
                  <FaChevronRight size={14} />
                </div>
                <div className={styles.settingsNavItem}>
                  <div>
                    <div className={styles.settingsNavTitle}>Taxes</div>
                    <div className={styles.settingsNavSub}>Learn how taxes work for Hosts</div>
                  </div>
                  <FaChevronRight size={14} />
                </div>
                <div className={styles.settingsNavItem}>
                  <div>
                    <div className={styles.settingsNavTitle}>Airbnb.org stays</div>
                    <div className={styles.settingsNavSub}>Set a discount</div>
                  </div>
                  <FaChevronRight size={14} />
                </div>
                <div className={styles.settingsNavItem}>
                  <div>
                    <div className={styles.settingsNavTitle}>Remove listing</div>
                    <div className={styles.settingsNavSub}>Permanently remove your listing</div>
                  </div>
                  <FaChevronRight size={14} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Content (Fixed/No scroll) */}
        <div className={`col-lg-8 ${styles.rightContent}`}>
          {!isSettingsOpen ? (
            <>
          {activeTab === 'Your space' && (
            <div className='row justify-content-center'>
            <div className='col-lg-10'>
                  <div className={styles.rightHeader}>
            <div>
              <h1 className={styles.rightTitle}>Photo tour</h1>
              <p className={styles.rightSub}>
                Manage photos and add details. Guests will only see your tour if every room has a photo.
              </p>
            </div>
            <div className={styles.rightActions}>
              <button className={styles.pillBtn}>
                <FaImages size={14} /> All photos
              </button>
              <button className={styles.pillBtn} style={{padding: '8px', borderRadius: '50%', width: '36px', height: '36px', justifyContent: 'center'}}>
                <FaPlus size={14} />
              </button>
            </div>
          </div>

          <div className={styles.taskBanner}>
            <div className={styles.taskBannerText}>
              <span className={styles.orangeDot}></span>
              View your tasks
            </div>
            <FaChevronRight size={16} />
          </div>

          <div className="row">
            <div className="col-lg-3">
              <div className={styles.photoItem}>
                <div className={styles.photoImgWrapper}>
                  <span>🛏️</span>
                </div>
                <div>
                  <h4 className={styles.photoTitle}>Bedroom</h4>
                  <p className={styles.photoSub}>Add photos</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className={styles.photoItem}>
                <div className={styles.photoImgWrapper}>
                  <span>🛁</span>
                </div>
                <div>
                  <h4 className={styles.photoTitle}>Full bathroom</h4>
                  <p className={styles.photoSub}>Add photos</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className={styles.photoItem}>
                <div className={styles.photoImgWrapper}>
                  <img src="/face_04.avif" alt="Additional photos" />
                </div>
                <div>
                  <h4 className={styles.photoTitle}>Additional photos</h4>
                  <p className={styles.photoSub} style={{textDecoration: 'none'}}>5 photos</p>
                </div>
              </div>
            </div>
          </div>
                
            </div>

            </div>
          )}

          {activeTab === 'Arrival guide' && (
            <>
            <div className='row justify-content-center'>
              <div className='col-lg-10'>
                <div className={styles.rightHeader}>
                  <div>
                    <h1 className={styles.rightTitle}>Check-in & checkout</h1>
                  </div>
                </div>

                <div style={{marginBottom: '32px'}}>
                  <h4 style={{fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#222222'}}>Check-in window</h4>
                  <div className={styles.customSelectBox} style={{position: 'relative'}} onClick={() => setIsStartOpen(!isStartOpen)}>
                    <div className={styles.selectContent}>
                      <span className={styles.selectLabel}>Start time</span>
                      <span className={styles.selectValue}>{checkInStart}</span>
                    </div>
                    <FaChevronRight size={14} style={{transform: isStartOpen ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.2s'}} color="#222222" />
                    
                    {isStartOpen && (
                      <div className={styles.dropdownMenu}>
                        {['1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm', '5:00 pm'].map(time => (
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
                        {['Flexible', '8:00 pm', '10:00 pm', '12:00 am'].map(time => (
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
                  <h4 style={{fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#222222'}}>Checkout</h4>
                  <div className={styles.customSelectBox} style={{position: 'relative'}} onClick={() => setIsCheckoutOpen(!isCheckoutOpen)}>
                    <div className={styles.selectContent}>
                      <span className={styles.selectLabel}>Time</span>
                      <span className={styles.selectValue}>{checkoutTime}</span>
                    </div>
                    <FaChevronRight size={14} style={{transform: isCheckoutOpen ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.2s'}} color="#222222" />

                    {isCheckoutOpen && (
                      <div className={styles.dropdownMenu}>
                        {['10:00 am', '11:00 am', '12:00 pm', '1:00 pm'].map(time => (
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
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px 40px',
              borderTop: '1px solid #ebebeb',
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'flex-end',
              zIndex: 10
            }}>
              <button 
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
                disabled={!hasChanges}
              >
                Save
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

      {/* Offcanvas */}
      <div className={`offcanvas offcanvas-end ${isOffcanvasOpen ? 'show' : ''}`} tabIndex="-1" style={{ visibility: isOffcanvasOpen ? 'visible' : 'hidden', width: '450px', borderLeft: 'none', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)' }}>
        <div className={styles.offcanvasHeader}>
          <div style={{width: '24px'}}></div>
          <h5 className={styles.offcanvasTitle}>Steps to publish<br/><span style={{fontSize: '12px', color: '#717171', fontWeight: '400'}}>hi</span></h5>
          <button className={styles.offcanvasClose} onClick={() => setIsOffcanvasOpen(false)}>
            <FaTimes />
          </button>
        </div>
        <div className={styles.offcanvasBody}>
          <div className={styles.publishCard}>
            <p className={styles.publishCardSub}>Your House listing started on 6 October 2026</p>
            <h4 className={styles.publishCardTitle}>Identity verification</h4>
            <p className={styles.publishCardStatus}>Not started</p>
            <img src="/face_04.avif" alt="Verify Identity" className={styles.publishCardImg} />
            <h3 className={styles.publishCardCenterTitle}>Verify your identity</h3>
            <p className={styles.publishCardCenterDesc}>We'll gather some information to help confirm you're you.</p>
            <button className={styles.publishBtn}>Get started</button>
          </div>
          <div className={styles.publishCardSmall}>
            <div>
              <p className={styles.publishCardSub}>Your House listing started on 6 October 2026</p>
              <h4 className={styles.publishCardTitle}>Phone number confirmation</h4>
              <p className={styles.publishCardStatus}>Not started</p>
            </div>
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

    </div>
  );
}

export default HostListingEditor;