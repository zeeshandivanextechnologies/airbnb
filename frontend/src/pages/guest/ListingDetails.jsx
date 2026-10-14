import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FiShare, FiHeart, FiStar, FiMonitor, FiWifi, FiCoffee 
} from 'react-icons/fi';
import { 
  MdOutlineDoorFront, MdOutlineWorkspacePremium, 
  MdOutlineDirectionsCar, MdOutlineLocalLaundryService,
  MdOutlineSevereCold, MdOutlineReportProblem
} from 'react-icons/md';
import { 
  BsDoorOpen, BsBuilding, BsFlag 
} from 'react-icons/bs';
import { TbToolsKitchen2, TbMountain } from 'react-icons/tb';
import { 
  FaChevronDown, FaTimes, FaChevronLeft, FaChevronRight,
  FaCopy, FaEnvelope, FaCommentDots, FaWhatsapp, FaFacebookMessenger, FaFacebook, FaTwitter, FaCode, FaEllipsisH
} from 'react-icons/fa';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, parse, isValid, addDays } from 'date-fns';
import { useEffect } from 'react';

import styles from '../../components/styles/ListingDetails.module.css';

export default function ListingDetails() {
  const { id } = useParams();
  
  // State for booking widget & calendar
  const [rateType, setRateType] = useState('non-refundable');
  const [selectedRange, setSelectedRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 1)
  });
  
  // State for gallery modal
  const [galleryState, setGalleryState] = useState({ isOpen: false });
  // State for full-screen single image view (lightbox)
  const [lightboxState, setLightboxState] = useState({ isOpen: false, currentIndex: 0 });
  // State for calendar popup
  const [showCalendarWidget, setShowCalendarWidget] = useState(false);
  // State for share modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isShareModalClosing, setIsShareModalClosing] = useState(false);
  
  // State for save (wishlist) modal
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSaveModalClosing, setIsSaveModalClosing] = useState(false);
  const [wishlistName, setWishlistName] = useState('Rishikesh 2026');

  // State for description modal
  const [isDescModalOpen, setIsDescModalOpen] = useState(false);
  const [isDescModalClosing, setIsDescModalClosing] = useState(false);

  useEffect(() => {
    if (isShareModalOpen || isSaveModalOpen || isDescModalOpen || lightboxState.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isShareModalOpen, isSaveModalOpen, isDescModalOpen, lightboxState.isOpen]);

  const closeShareModal = () => {
    setIsShareModalClosing(true);
    setTimeout(() => {
      setIsShareModalOpen(false);
      setIsShareModalClosing(false);
    }, 250);
  };

  const closeSaveModal = () => {
    setIsSaveModalClosing(true);
    setTimeout(() => {
      setIsSaveModalOpen(false);
      setIsSaveModalClosing(false);
    }, 250);
  };

  const closeDescModal = () => {
    setIsDescModalClosing(true);
    setTimeout(() => {
      setIsDescModalOpen(false);
      setIsDescModalClosing(false);
    }, 250);
  };

  // Computed display dates for main widget button
  const checkInDisplay = selectedRange?.from ? format(selectedRange.from, 'M/d/yyyy') : 'Add date';
  const checkOutDisplay = selectedRange?.to ? format(selectedRange.to, 'M/d/yyyy') : 'Add date';

  // State for typed inputs in popup
  const [checkInInput, setCheckInInput] = useState('');
  const [checkOutInput, setCheckOutInput] = useState('');

  // State for guest popup
  const [showGuestWidget, setShowGuestWidget] = useState(false);
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0, pets: 0 });
  const totalGuests = guests.adults + guests.children;

  useEffect(() => {
    setCheckInInput(selectedRange?.from ? format(selectedRange.from, 'M/d/yyyy') : '');
  }, [selectedRange?.from]);

  useEffect(() => {
    setCheckOutInput(selectedRange?.to ? format(selectedRange.to, 'M/d/yyyy') : '');
  }, [selectedRange?.to]);

  const handleInputChange = (e, type) => {
    const val = e.target.value;
    if (type === 'from') setCheckInInput(val);
    else setCheckOutInput(val);

    const parsed = parse(val, 'M/d/yyyy', new Date());
    if (isValid(parsed)) {
      if (parsed.getFullYear() > 2000) {
        setSelectedRange(prev => ({...prev, [type]: parsed}));
      }
    }
  };

  // Hardcoded images matching the 5-grid style
  const images = [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=720&q=80",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=720&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=720&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=720&q=80"
  ];

  // Images grouped by category for the full gallery view
  const categorizedImages = [
    {
      id: 'room-living',
      category: 'Living room',
      thumb: images[0],
      images: [images[0], images[1], images[2]]
    },
    {
      id: 'room-bedroom-1',
      category: 'Bedroom 1',
      thumb: images[1],
      images: [images[1], images[2], images[3]]
    },
    {
      id: 'room-bedroom-2',
      category: 'Bedroom 2',
      thumb: images[2],
      images: [images[2], images[3], images[4]]
    },
    {
      id: 'room-exterior',
      category: 'Exterior',
      thumb: images[3],
      images: [images[3], images[4], images[0]]
    }
  ];

  return (
    <div className={styles['details-container']}>
      
      {/* Header Section */}
      <div className={styles['title-section']}>
        <h1 className={styles.title}>Dhananjaya:Apartment in sawai madhopur</h1>
        <div className={styles['action-buttons']}>
          <button className={styles['action-btn']} onClick={() => setIsShareModalOpen(true)}>
            <FiShare size={16} /> Share
          </button>
          <button className={styles['action-btn']} onClick={() => setIsSaveModalOpen(true)}>
            <FiHeart size={16} /> Save
          </button>
        </div>
      </div>

      {/* Photo Grid */}
      <div className={styles['photo-grid']}>
        <img src={images[0]} alt="Main View" className={styles['photo-main']} onClick={() => setGalleryState({ isOpen: true })} />
        <img src={images[1]} alt="View 2" className={styles['photo-small']} onClick={() => setGalleryState({ isOpen: true })} />
        <img src={images[2]} alt="View 3" className={styles['photo-small']} style={{ borderTopRightRadius: '12px' }} onClick={() => setGalleryState({ isOpen: true })} />
        <img src={images[3]} alt="View 4" className={styles['photo-small']} onClick={() => setGalleryState({ isOpen: true })} />
        <img src={images[4]} alt="View 5" className={styles['photo-small']} style={{ borderBottomRightRadius: '12px' }} onClick={() => setGalleryState({ isOpen: true })} />
        <button className={styles['show-all-btn']} onClick={() => setGalleryState({ isOpen: true })}>
          <BsBuilding size={16} /> Show all photos
        </button>
      </div>

      <div className={styles['content-layout']}>
        
        {/* Left Column */}
        <div className={styles['left-column']}>
          
          <div className={styles['subtitle-section']}>
            <h2 className={styles.subtitle}>Entire apartment in Sawai Madhopur, India</h2>
            <div className={styles['guest-info']}>
              5 guests · 2 bedrooms · 4 beds · 2 bathrooms
            </div>
            <div className={styles['reviews-info']}>
              <FiStar fill="#222" /> 4.79 · <span className={styles['reviews-link']}>82 reviews</span>
            </div>
          </div>

          <div className={styles['host-section']}>
            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80" alt="Host" className={styles['host-avatar']} />
            <div>
              <h3 className={styles['host-name']}>Hosted by Kushgra</h3>
              <p className={styles['host-status']}>Superhost · 4 years hosting</p>
            </div>
          </div>

          <div className={styles['highlights-section']}>
            <div className={styles['highlight-item']}>
              <MdOutlineWorkspacePremium className={styles['highlight-icon']} />
              <div>
                <h4 className={styles['highlight-title']}>20-min drive to Ranthambore National Park</h4>
                <p className={styles['highlight-desc']}>This home is near the national park.</p>
              </div>
            </div>
            <div className={styles['highlight-item']}>
              <BsDoorOpen className={styles['highlight-icon']} />
              <div>
                <h4 className={styles['highlight-title']}>Self check-in</h4>
                <p className={styles['highlight-desc']}>You can check in with the building staff.</p>
              </div>
            </div>
            <div className={styles['highlight-item']}>
              <MdOutlineDoorFront className={styles['highlight-icon']} />
              <div>
                <h4 className={styles['highlight-title']}>Extra spacious</h4>
                <p className={styles['highlight-desc']}>Guests love this home's spaciousness for a comfortable stay.</p>
              </div>
            </div>
          </div>

          <div className={styles['description-section']}>
            Kick back and relax in this calm, stylish space.<br/>
            Forget your worries in this spacious and serene space.<br/>
            a place near wildlife sanctuary. 2 large bedrooms with balconies.peaceful environment and spacious stay. you can enjoy sunrise and sunset.<br/>
            railway station distance 3 kms<br/>
            safari office is 3.5 kms<br/><br/>
            (safari booking available)...
            <button className={styles['show-more-btn']} onClick={() => setIsDescModalOpen(true)}>
              Show more <FaChevronDown size={12} />
            </button>
          </div>

          <div className={styles['sleep-section']}>
            <h2 className={styles['section-title']}>Where you'll sleep</h2>
            <div className={styles['bedroom-cards']}>
              <div className={styles['bedroom-card']}>
                <img src={images[1]} alt="Bedroom 1" className={styles['bedroom-img']} />
                <h4 className={styles['bedroom-title']}>Bedroom 1</h4>
                <p className={styles['bedroom-desc']}>2 queen beds</p>
              </div>
              <div className={styles['bedroom-card']}>
                <img src={images[2]} alt="Bedroom 2" className={styles['bedroom-img']} />
                <h4 className={styles['bedroom-title']}>Bedroom 2</h4>
                <p className={styles['bedroom-desc']}>2 queen beds</p>
              </div>
            </div>
          </div>

          <div className={styles['amenities-section']}>
            <h2 className={styles['section-title']}>What this place offers</h2>
            <div className={styles['amenities-grid']}>
              <div className={styles['amenity-item']}><TbMountain size={24} /> Desert view</div>
              <div className={styles['amenity-item']}><TbMountain size={24} /> Mountain view</div>
              <div className={styles['amenity-item']}><TbToolsKitchen2 size={24} /> Kitchen</div>
              <div className={styles['amenity-item']}><FiWifi size={24} /> Wifi – 30 Mbps</div>
              <div className={styles['amenity-item']}><FiMonitor size={24} /> Dedicated workspace</div>
              <div className={styles['amenity-item']}><MdOutlineDirectionsCar size={24} /> Free parking on premises</div>
              <div className={styles['amenity-item']}><FiMonitor size={24} /> TV</div>
              <div className={styles['amenity-item']}><MdOutlineLocalLaundryService size={24} /> Lift</div>
              <div className={`${styles['amenity-item']} ${styles.strikethrough}`}><MdOutlineReportProblem size={24} /> Carbon monoxide alarm</div>
              <div className={`${styles['amenity-item']} ${styles.strikethrough}`}><MdOutlineReportProblem size={24} /> Smoke alarm</div>
            </div>
            <button className={styles['outline-btn']}>Show all 34 amenities</button>
          </div>

        </div>

        {/* Right Column (Booking Widget) */}
        <div className={styles['right-column']}>
          <div className={styles['booking-widget']}>
            
            <div className={styles['widget-price-section']}>
              <span className={styles['original-price']}>₹2,955</span>
              <span className={styles['discounted-price']}>₹2,583</span>
              <span className={styles['price-unit']}>for 1 night</span>
            </div>

            <div className={styles['date-guest-picker']}>
              <div className={styles['dates-row']} onClick={() => setShowCalendarWidget(!showCalendarWidget)}>
                <div className={styles['date-box']}>
                  <div className={styles['picker-label']}>CHECK-IN</div>
                  <div className={styles['picker-value']}>{checkInDisplay}</div>
                </div>
                <div className={styles['date-box']}>
                  <div className={styles['picker-label']}>CHECKOUT</div>
                  <div className={styles['picker-value']}>{checkOutDisplay}</div>
                </div>
              </div>

              {showCalendarWidget && (
                <div className={styles['calendar-popup']}>
                  <div className={styles['calendar-popup-header']}>
                    <div>
                      <h3 className={styles['calendar-popup-title']}>
                        {selectedRange?.from && selectedRange?.to 
                          ? `${Math.ceil((selectedRange.to - selectedRange.from) / (1000 * 60 * 60 * 24))} nights` 
                          : 'Select dates'}
                      </h3>
                      <p className={styles['calendar-popup-subtitle']}>
                        {selectedRange?.from ? format(selectedRange.from, 'd MMM yyyy') : 'Add check-in date'} 
                        {' - '} 
                        {selectedRange?.to ? format(selectedRange.to, 'd MMM yyyy') : 'Add checkout date'}
                      </p>
                    </div>
                    <div className={styles['calendar-popup-inputs']}>
                      <div className={styles['calendar-popup-input-box']}>
                        <div>
                          <div className={styles['picker-label']}>CHECK-IN</div>
                          <input 
                            type="text" 
                            className={styles['picker-input']} 
                            value={checkInInput}
                            onChange={(e) => handleInputChange(e, 'from')}
                            placeholder="DD/MM/YYYY"
                          />
                        </div>
                        <FaTimes size={12} style={{cursor: 'pointer'}} onClick={(e) => { e.stopPropagation(); setSelectedRange(prev => ({...prev, from: undefined})); }} />
                      </div>
                      <div className={styles['calendar-popup-input-box']}>
                        <div>
                          <div className={styles['picker-label']}>CHECKOUT</div>
                          <input 
                            type="text" 
                            className={styles['picker-input']} 
                            value={checkOutInput}
                            onChange={(e) => handleInputChange(e, 'to')}
                             placeholder="DD/MM/YYYY"
                          />
                        </div>
                        <FaTimes size={12} style={{cursor: 'pointer'}} onClick={(e) => { e.stopPropagation(); setSelectedRange(prev => ({...prev, to: undefined})); }} />
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <DayPicker
                      mode="range"
                      selected={selectedRange}
                      onSelect={setSelectedRange}
                      numberOfMonths={2}
                      pagedNavigation
                    />
                  </div>

                  <div className={styles['calendar-popup-footer']}>
                    <button className={styles['calendar-clear-btn']} onClick={() => setSelectedRange({from: undefined, to: undefined})}>Clear dates</button>
                    <button className={styles['calendar-close-btn']} onClick={() => setShowCalendarWidget(false)}>Close</button>
                  </div>
                </div>
              )}

              <div className={styles['guest-box']} onClick={() => setShowGuestWidget(!showGuestWidget)} style={{ cursor: 'pointer' }}>
                <div>
                  <div className={styles['picker-label']}>GUESTS</div>
                  <div className={styles['picker-value']}>
                    {totalGuests === 1 ? '1 guest' : `${totalGuests} guests`}
                    {guests.infants > 0 ? `, ${guests.infants} infant${guests.infants > 1 ? 's' : ''}` : ''}
                    {guests.pets > 0 ? `, ${guests.pets} pet${guests.pets > 1 ? 's' : ''}` : ''}
                  </div>
                </div>
                <FaChevronDown size={14} style={{ transform: showGuestWidget ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>

              {showGuestWidget && (
                <div className={styles['guest-popup']}>
                  <div className={styles['guest-row']}>
                    <div className={styles['guest-info']}>
                      <h3>Adults</h3>
                      <p>Age 13+</p>
                    </div>
                    <div className={styles['guest-controls']}>
                      <button className={styles['guest-btn']} disabled={guests.adults <= 1} onClick={(e) => { e.stopPropagation(); setGuests(prev => ({...prev, adults: prev.adults - 1})); }}>-</button>
                      <span className={styles['guest-count']}>{guests.adults}</span>
                      <button className={styles['guest-btn']} disabled={totalGuests >= 5} onClick={(e) => { e.stopPropagation(); setGuests(prev => ({...prev, adults: prev.adults + 1})); }}>+</button>
                    </div>
                  </div>
                  <div className={styles['guest-row']}>
                    <div className={styles['guest-info']}>
                      <h3>Children</h3>
                      <p>Ages 2-12</p>
                    </div>
                    <div className={styles['guest-controls']}>
                      <button className={styles['guest-btn']} disabled={guests.children <= 0} onClick={(e) => { e.stopPropagation(); setGuests(prev => ({...prev, children: prev.children - 1})); }}>-</button>
                      <span className={styles['guest-count']}>{guests.children}</span>
                      <button className={styles['guest-btn']} disabled={totalGuests >= 5} onClick={(e) => { e.stopPropagation(); setGuests(prev => ({...prev, children: prev.children + 1})); }}>+</button>
                    </div>
                  </div>
                  <div className={styles['guest-row']}>
                    <div className={styles['guest-info']}>
                      <h3>Infants</h3>
                      <p>Under 2</p>
                    </div>
                    <div className={styles['guest-controls']}>
                      <button className={styles['guest-btn']} disabled={guests.infants <= 0} onClick={(e) => { e.stopPropagation(); setGuests(prev => ({...prev, infants: prev.infants - 1})); }}>-</button>
                      <span className={styles['guest-count']}>{guests.infants}</span>
                      <button className={styles['guest-btn']} disabled={guests.infants >= 5} onClick={(e) => { e.stopPropagation(); setGuests(prev => ({...prev, infants: prev.infants + 1})); }}>+</button>
                    </div>
                  </div>
                  <div className={styles['guest-row']}>
                    <div className={styles['guest-info']}>
                      <h3>Pets</h3>
                      <a href="#">Bringing a service animal?</a>
                    </div>
                    <div className={styles['guest-controls']}>
                      <button className={styles['guest-btn']} disabled={guests.pets <= 0} onClick={(e) => { e.stopPropagation(); setGuests(prev => ({...prev, pets: prev.pets - 1})); }}>-</button>
                      <span className={styles['guest-count']}>{guests.pets}</span>
                      <button className={styles['guest-btn']} disabled={true} onClick={(e) => e.stopPropagation()}>+</button>
                    </div>
                  </div>
                  
                  <p className={styles['guest-disclaimer']}>
                    This place has a maximum of 5 guests, not including infants. Pets aren't allowed.
                  </p>
                  
                  <button className={styles['guest-close-btn']} onClick={() => setShowGuestWidget(false)}>Close</button>
                </div>
              )}
            </div>

            <div className={styles['rates-section']}>
              <div 
                className={`${styles['rate-option']} ${rateType === 'non-refundable' ? styles.active : ''}`}
                onClick={() => setRateType('non-refundable')}
              >
                <div className={styles['rate-text']}>
                  <h4 className={styles['rate-title']}>Non-refundable · ₹2,583.00 total</h4>
                  <p className={styles['rate-desc']}>Free cancellation for 24 hours. After that, the reservation is non-refundable.</p>
                </div>
                <input type="radio" checked={rateType === 'non-refundable'} readOnly style={{ accentColor: '#222' }} />
              </div>
              
              <div 
                className={`${styles['rate-option']} ${rateType === 'refundable' ? styles.active : ''}`}
                onClick={() => setRateType('refundable')}
              >
                <div className={styles['rate-text']}>
                  <h4 className={styles['rate-title']}>Refundable · ₹2,870.00 total</h4>
                  <p className={styles['rate-desc']}>Free cancellation before 9 September. After that, the reservation is non-refundable.</p>
                </div>
                <input type="radio" checked={rateType === 'refundable'} readOnly style={{ accentColor: '#222' }} />
              </div>
            </div>

            <button className={styles['reserve-btn']}>Reserve</button>
            <p className={styles['charge-note']}>You won't be charged yet</p>

            <div className={styles['report-link']}>
              <BsFlag size={14} /> Report this listing
            </div>

          </div>
        </div>

      </div>

      {/* Calendar Section (Real react-dates) */}
      <div className={styles['calendar-section']}>
        <h2 className={styles['calendar-header']}>Select check-in date</h2>
        <p className={styles['calendar-subheader']}>Add your travel dates for exact pricing</p>
        <div style={{ marginTop: '24px', overflowX: 'auto', paddingBottom: '16px' }}>
          <DayPicker
            mode="range"
            selected={selectedRange}
            onSelect={setSelectedRange}
            numberOfMonths={2}
            pagedNavigation
          />
        </div>
      </div>

      {/* Reviews Section */}
      <div className={styles['reviews-section-large']}>
        <div className={styles['reviews-top']}>
          <FiStar fill="#222" /> 4.79 · 82 reviews
        </div>
        
        {/* <div className={styles['rating-bars']}>
          <div className={styles['rating-item']}>
            <div className={styles['rating-label']}>Cleanliness</div>
            <div className={styles['rating-bar-container']}><div className={styles['rating-bar-bg']}><div className={styles['rating-bar-fill']} style={{width: '95%'}}></div></div> 4.7</div>
          </div>
          <div className={styles['rating-item']}>
            <div className={styles['rating-label']}>Accuracy</div>
            <div className={styles['rating-bar-container']}><div className={styles['rating-bar-bg']}><div className={styles['rating-bar-fill']} style={{width: '98%'}}></div></div> 4.8</div>
          </div>
          <div className={styles['rating-item']}>
            <div className={styles['rating-label']}>Communication</div>
            <div className={styles['rating-bar-container']}><div className={styles['rating-bar-bg']}><div className={styles['rating-bar-fill']} style={{width: '100%'}}></div></div> 5.0</div>
          </div>
          <div className={styles['rating-item']}>
            <div className={styles['rating-label']}>Location</div>
            <div className={styles['rating-bar-container']}><div className={styles['rating-bar-bg']}><div className={styles['rating-bar-fill']} style={{width: '90%'}}></div></div> 4.6</div>
          </div>
          <div className={styles['rating-item']}>
            <div className={styles['rating-label']}>Value</div>
            <div className={styles['rating-bar-container']}><div className={styles['rating-bar-bg']}><div className={styles['rating-bar-fill']} style={{width: '96%'}}></div></div> 4.8</div>
          </div>
        </div> */}

        <div className={styles['reviews-grid']}>
          <div className={styles['review-card']}>
            <div className={styles['reviewer-info']}>
              <div className={styles['reviewer-avatar']}>A</div>
              <div>
                <h4 className={styles['reviewer-name']}>Abhimanyu Singh</h4>
                <p className={styles['review-date']}>3 weeks ago</p>
              </div>
            </div>
            <p className={styles['review-text']}>Great stay! The place was clean, comfortable, and well-maintained. The host was helpful and responsive. Everything went smoothly, and I would happily stay here again. Highly...</p>
          </div>
          <div className={styles['review-card']}>
            <div className={styles['reviewer-info']}>
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80" className={styles['reviewer-avatar']} alt="Amit" />
              <div>
                <h4 className={styles['reviewer-name']}>Amit</h4>
                <p className={styles['review-date']}>June 2026</p>
              </div>
            </div>
            <p className={styles['review-text']}>I had a pleasant stay at Kushgra's place. The location and overall experience were good, and the host was responsive and helpful. However, the washroom was not as clean as...</p>
          </div>
          <div className={styles['review-card']}>
            <div className={styles['reviewer-info']}>
              <div className={styles['reviewer-avatar']}>M</div>
              <div>
                <h4 className={styles['reviewer-name']}>Mayank</h4>
                <p className={styles['review-date']}>May 2026</p>
              </div>
            </div>
            <p className={styles['review-text']}>Had a great stay! The place was clean, comfortable, and exactly as shown in the photos. Host was helpful and responsive. Overall a smooth and pleasant experience.</p>
          </div>
          <div className={styles['review-card']}>
            <div className={styles['reviewer-info']}>
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" className={styles['reviewer-avatar']} alt="Diksha" />
              <div>
                <h4 className={styles['reviewer-name']}>Diksha</h4>
                <p className={styles['review-date']}>May 2026</p>
              </div>
            </div>
            <p className={styles['review-text']}>I rented the place for two days when I visited ranthambore national park with my family, we were four members. the location is near the entrance of national park, the...</p>
          </div>
        </div>
        <button className={styles['outline-btn']}>Show all 82 reviews</button>
      </div>

      {/* Map Section */}
      <div className={styles['map-section']}>
        <h2 className={styles['section-title']}>Where you'll be</h2>
        <p style={{marginBottom: '24px'}}>Sawai Madhopur, Rajasthan, India</p>
        <div className={styles['map-placeholder']} style={{ overflow: 'hidden', borderRadius: '12px', height: '480px', position: 'relative' }}>
          <iframe 
            src="https://maps.google.com/maps?q=Sawai%20Madhopur,%20Rajasthan,%20India&t=&z=13&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Map of Sawai Madhopur"
          ></iframe>
          <div style={{position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '12px 24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontWeight: 'bold'}}>Exact location provided after booking</div>
        </div>
      </div>

      {/* Meet your host */}
      <div className={styles['host-details-section']}>
        <h2 className={styles['section-title']}>Meet your host</h2>
        <div className={styles['host-card-large']}>
          <div className={styles['host-card-left']}>
            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80" alt="Host" className={styles['host-card-avatar']} />
            <h3 className={styles.title} style={{fontSize: '28px', margin: '4px 0'}}>Kushgra</h3>
            <p className={styles['host-status']} style={{marginBottom: '16px'}}>Superhost</p>
            
            <div className={styles['host-stats']}>
              <div className={styles['host-stat-item']}>
                <div className={styles['host-stat-val']}>161</div>
                <div className={styles['host-stat-label']}>Reviews</div>
              </div>
              <div className={styles['host-stat-item']}>
                <div className={styles['host-stat-val']}>4.81<FiStar fill="#222" size={12}/></div>
                <div className={styles['host-stat-label']}>Rating</div>
              </div>
              <div className={styles['host-stat-item']}>
                <div className={styles['host-stat-val']}>4</div>
                <div className={styles['host-stat-label']}>Years hosting</div>
              </div>
            </div>
          </div>
          <div className={styles['host-card-right']}>
            <h2>Kushgra is a Superhost</h2>
            <p>Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
            
            <h3>Host details</h3>
            <p>Response rate: 100%<br/>Responds within an hour</p>
            
            <button className={styles['outline-btn']} style={{marginTop: '16px'}}>Message host</button>
            <p style={{marginTop: '24px', fontSize: '12px', color: '#717171'}}>To help protect your payment, always use Airbnb to send money and communicate with hosts.</p>
          </div>
        </div>
      </div>

      {/* Things to know */}
      <div className={styles['things-to-know']}>
        <h2 className={styles['section-title']}>Things to know</h2>
        <div className={styles['rules-grid']}>
          <div className={styles['rule-column']}>
            <h4>Cancellation policy</h4>
            <div className={styles['rule-item']}>Free cancellation for 24 hours. After that, the reservation is non-refundable.</div>
            <div className={styles['rule-item']}>Review this host's full policy for details.</div>
            <div className={styles['rule-link']}>Learn more</div>
          </div>
          <div className={styles['rule-column']}>
            <h4>House rules</h4>
            <div className={styles['rule-item']}>Check-in: 1:00 pm – 9:00 pm</div>
            <div className={styles['rule-item']}>Checkout before 10:00 am</div>
            <div className={styles['rule-item']}>5 guests maximum</div>
            <div className={styles['rule-link']}>Learn more</div>
          </div>
          <div className={styles['rule-column']}>
            <h4>Safety & property</h4>
            <div className={styles['rule-item']}>Carbon monoxide alarm not reported</div>
            <div className={styles['rule-item']}>Smoke alarm not reported</div>
            <div className={styles['rule-link']}>Learn more</div>
          </div>
        </div>
      </div>

      {/* Gallery Modal (Category View) */}
      {galleryState.isOpen && (
        <div className={styles['gallery-modal-wrapper']}>
          <div className={styles['gallery-modal-header']}>
            <button 
              className={styles['gallery-back-btn']} 
              onClick={() => setGalleryState({ isOpen: false })}
            >
              <FaChevronLeft size={20} />
            </button>
            <div className={styles['gallery-header-right']}>
              <button className={styles['action-btn']}><FiShare size={16} /> Share</button>
              <button className={styles['action-btn']}><FiHeart size={16} /> Save</button>
            </div>
          </div>
          
          <div className={styles['gallery-content-container']}>
            <h2 className={styles['gallery-photo-tour-title']}>Photo tour</h2>
            <div className={styles['gallery-tour-nav']}>
              {categorizedImages.map((cat, idx) => (
                <div key={idx} className={styles['gallery-tour-item']} onClick={() => document.getElementById(cat.id)?.scrollIntoView({ behavior: 'smooth' })}>
                  <img src={cat.thumb} className={styles['gallery-tour-thumb']} alt={cat.category} />
                  <span className={styles['gallery-tour-label']}>{cat.category}</span>
                </div>
              ))}
            </div>

            {categorizedImages.map((categoryGroup, idx) => (
              <div key={idx} id={categoryGroup.id} className={styles['gallery-room-section']}>
                <h3 className={styles['gallery-room-title']}>{categoryGroup.category}</h3>
                <div className={styles['gallery-room-grid']}>
                  <img 
                    src={categoryGroup.images[0]} 
                    className={styles['gallery-room-grid-main']} 
                    alt="Main"
                    onClick={() => setLightboxState({ isOpen: true, currentIndex: images.indexOf(categoryGroup.images[0]) })}
                  />
                  <div className={styles['gallery-room-grid-side']}>
                    {categoryGroup.images.slice(1).map((img, imgIdx) => (
                      <img 
                        key={imgIdx} 
                        src={img} 
                        alt="Side"
                        onClick={() => setLightboxState({ isOpen: true, currentIndex: images.indexOf(img) })}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxState.isOpen && (
        <div className={styles['lightbox-modal']}>
          <button 
            className={styles['lightbox-close-btn']} 
            onClick={() => setLightboxState(prev => ({ ...prev, isOpen: false }))}
          >
            <FaTimes size={20} />
          </button>
          
          <button 
            className={`${styles['lightbox-nav-btn']} ${styles.prev}`}
            onClick={() => setLightboxState(prev => ({ ...prev, currentIndex: prev.currentIndex === 0 ? images.length - 1 : prev.currentIndex - 1 }))}
          >
            <FaChevronLeft size={20} />
          </button>
          
          <img src={images[lightboxState.currentIndex]} className={styles['lightbox-image']} alt="Lightbox View" />
          
          <button 
            className={`${styles['lightbox-nav-btn']} ${styles.next}`}
            onClick={() => setLightboxState(prev => ({ ...prev, currentIndex: prev.currentIndex === images.length - 1 ? 0 : prev.currentIndex + 1 }))}
          >
            <FaChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <div 
          className={`${styles['modal-overlay']} ${isShareModalClosing ? styles.closing : ''}`} 
          onClick={closeShareModal}
        >
          <div 
            className={`${styles['share-modal']} ${isShareModalClosing ? styles.closing : ''}`} 
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles['share-close-btn']} onClick={closeShareModal}>
              <FaTimes />
            </button>
            <h2 className={styles['share-title']}>Share this place</h2>
            
            <div className={styles['share-info-card']}>
              <img src={images[0]} alt="Thumbnail" className={styles['share-info-img']} />
              <div className={styles['share-info-text']}>
                Apartment in Rishikesh · ★5.0 · 3 bedrooms · 3 beds · 3 bathrooms
              </div>
            </div>

            <div className={styles['share-options-grid']}>
              <button className={styles['share-option-btn']}><FaCopy size={20} /> Copy Link</button>
              <button className={styles['share-option-btn']}><FaEnvelope size={20} /> Email</button>
              <button className={styles['share-option-btn']}><FaCommentDots size={20} /> Messages</button>
              <button className={styles['share-option-btn']}><FaWhatsapp size={20} /> WhatsApp</button>
              <button className={styles['share-option-btn']}><FaFacebookMessenger size={20} /> Messenger</button>
              <button className={styles['share-option-btn']}><FaFacebook size={20} /> Facebook</button>
              <button className={styles['share-option-btn']}><FaTwitter size={20} /> Twitter</button>
              <button className={styles['share-option-btn']}><FaCode size={20} /> Embed</button>
              <button className={`${styles['share-option-btn']} ${styles['share-more-btn']}`}><FaEllipsisH size={20} /> More options</button>
            </div>
          </div>
        </div>
      )}

      {/* Save / Wishlist Modal */}
      {isSaveModalOpen && (
        <div 
          className={`${styles['modal-overlay']} ${isSaveModalClosing ? styles.closing : ''}`} 
          onClick={closeSaveModal}
        >
          <div 
            className={`${styles['wishlist-modal']} ${isSaveModalClosing ? styles.closing : ''}`} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles['wishlist-header']}>
              <h2 className={styles['wishlist-title']}>Create wishlist</h2>
              <button className={styles['wishlist-close-btn']} onClick={closeSaveModal}>
                <FaTimes size={16} />
              </button>
            </div>
            
            <div className={styles['wishlist-body']}>
              <div className={styles['wishlist-input-container']}>
                <label className={styles['wishlist-label']}>Name</label>
                <input 
                  type="text" 
                  className={styles['wishlist-input']}
                  value={wishlistName}
                  onChange={(e) => {
                    if(e.target.value.length <= 50) setWishlistName(e.target.value)
                  }}
                />
                {wishlistName && (
                  <button className={styles['wishlist-clear-btn']} onClick={() => setWishlistName('')}>
                    <FaTimes size={10} color="#717171" />
                  </button>
                )}
              </div>
              <div className={styles['wishlist-char-count']}>
                {wishlistName.length}/50 characters
              </div>
            </div>

            <div className={styles['wishlist-footer']}>
              <button className={styles['wishlist-cancel-btn']} onClick={closeSaveModal}>Cancel</button>
              <button className={styles['wishlist-create-btn']} onClick={closeSaveModal}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Description Modal */}
      {isDescModalOpen && (
        <div 
          className={`${styles['modal-overlay']} ${isDescModalClosing ? styles.closing : ''}`} 
          onClick={closeDescModal}
        >
          <div 
            className={`${styles['desc-modal']} ${isDescModalClosing ? styles.closing : ''}`} 
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles['share-close-btn']} onClick={closeDescModal}>
              <FaTimes size={16} />
            </button>
            
            <h2 className={styles['desc-title']}>About this space</h2>
            
            <div className={styles['desc-content']}>
               <p>Kick back and relax in this calm, stylish space.</p>
               <p>Forget your worries in this spacious and serene space.</p>
               <p>A place near the wildlife sanctuary. 2 large bedrooms with balconies. Peaceful environment and spacious stay. You can enjoy sunrise and sunset.</p>
               
               <h3>The space</h3>
               <p>Railway station distance 3 kms.<br/>
               Safari office is 3.5 kms.</p>
               
               <h3>Guest access</h3>
               <p>Guests have full access to the apartment including both bedrooms, the living room, and balconies. Safari booking is available upon request.</p>

               <h3>Other things to note</h3>
               <p>Please carry a valid ID proof for check-in. Smoking is only allowed on the balconies.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
