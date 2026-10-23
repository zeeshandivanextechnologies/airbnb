import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { 
  FiShare, FiHeart, FiStar, FiMonitor, FiWifi, FiCoffee 
} from 'react-icons/fi';
import { 
  MdOutlineDoorFront, MdOutlineWorkspacePremium, 
  MdOutlineDirectionsCar, MdOutlineLocalLaundryService,
  MdOutlineSevereCold, MdOutlineReportProblem,
  MdOutlineHotTub, MdOutlineSecurity, MdOutlineHeatPump,
  MdOutlineShower, MdOutlineOutdoorGrill, MdOutlinePool
} from 'react-icons/md';
import { 
  BsDoorOpen, BsBuilding, BsFlag, BsShieldCheck, BsCameraVideo, BsVolumeUp 
} from 'react-icons/bs';
import { TbToolsKitchen2, TbMountain } from 'react-icons/tb';
import { 
  FaChevronDown, FaTimes, FaChevronLeft, FaChevronRight,
  FaCopy, FaEnvelope, FaCommentDots, FaWhatsapp, FaFacebookMessenger, FaFacebook, FaTwitter, FaCode, FaEllipsisH,
  FaSwimmingPool, FaTv, FaCar, FaFireExtinguisher, FaFirstAid, FaBan, FaCheck, FaThermometerHalf, FaBath, FaSnowflake,
  FaArrowLeft
} from 'react-icons/fa';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, parse, isValid, addDays } from 'date-fns';
import { useEffect } from 'react';

import styles from '../../components/styles/ListingDetails.module.css';
import Loader from '../../components/Loader';
import { 
  getStoredWishlists, 
  addWishlist, 
  isItemInAnyWishlist, 
  removeItemFromWishlists,
  trackRecentlyViewedItem
} from '../../utils/wishlistStorage';

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useSelector((state) => state.auth);
  
  // State for booking widget & calendar
  const [rateType, setRateType] = useState('non-refundable');
  const [isReserving, setIsReserving] = useState(false);
  const [showRequestToBookPage, setShowRequestToBookPage] = useState(false);
  const [rtbShowCalendarModal, setRtbShowCalendarModal] = useState(false);
  const [rtbShowGuestModal, setRtbShowGuestModal] = useState(false);
  const [hostMessage, setHostMessage] = useState('');
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
  const [wishlistName, setWishlistName] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // State for description modal
  const [isDescModalOpen, setIsDescModalOpen] = useState(false);
  const [isDescModalClosing, setIsDescModalClosing] = useState(false);

  // State for What this place offers (Amenities) modal
  const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false);
  const [isAmenitiesModalClosing, setIsAmenitiesModalClosing] = useState(false);
  const [masterAmenities, setMasterAmenities] = useState([]);

  useEffect(() => {
    if (isShareModalOpen || isSaveModalOpen || isDescModalOpen || isAmenitiesModalOpen || lightboxState.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isShareModalOpen, isSaveModalOpen, isDescModalOpen, isAmenitiesModalOpen, lightboxState.isOpen]);

  const [copiedLink, setCopiedLink] = useState(false);

  const closeShareModal = () => {
    setIsShareModalClosing(true);
    setTimeout(() => {
      setIsShareModalOpen(false);
      setIsShareModalClosing(false);
      setCopiedLink(false);
    }, 250);
  };

  const handleSharePlatform = (platform) => {
    const shareUrl = window.location.href;
    const shareTitle = title || 'Check out this listing on Airbnb';
    const shareDesc = `${title || 'Amazing place'} in ${city} · ₹${basePrice.toLocaleString('en-IN')}/night`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    const encodedText = encodeURIComponent(`${shareDesc} - ${shareUrl}`);

    switch (platform) {
      case 'copy':
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(shareUrl).then(() => {
            setCopiedLink(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopiedLink(false), 2500);
          }).catch(() => {
            toast.success('Link copied to clipboard!');
          });
        } else {
          toast.success('Link copied to clipboard!');
        }
        break;

      case 'email':
        window.open(`mailto:?subject=${encodedTitle}&body=${encodedText}`, '_blank');
        break;

      case 'messages':
      case 'sms':
        window.open(`sms:?&body=${encodedText}`, '_blank');
        break;

      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
        break;

      case 'messenger':
        window.open(`https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=292787834164101&redirect_uri=${encodedUrl}`, '_blank');
        break;

      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
        break;

      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
        break;

      case 'embed':
        const embedCode = `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0"></iframe>`;
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(embedCode).then(() => {
            toast.success('Embed HTML code copied to clipboard!');
          });
        } else {
          toast.success('Embed code copied!');
        }
        break;

      case 'more':
        if (navigator.share) {
          navigator.share({
            title: shareTitle,
            text: shareDesc,
            url: shareUrl
          }).catch(() => {});
        } else {
          handleSharePlatform('copy');
        }
        break;

      default:
        handleSharePlatform('copy');
        break;
    }
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

  const closeAmenitiesModal = () => {
    setIsAmenitiesModalClosing(true);
    setTimeout(() => {
      setIsAmenitiesModalOpen(false);
      setIsAmenitiesModalClosing(false);
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

  // Hardcoded fallback images matching the 5-grid style
  const fallbackImages = [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=720&q=80",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=720&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=720&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=720&q=80"
  ];

  // Dynamic listing state loaded from database
  const [listingData, setListingData] = useState(null);
  const [dynamicReviews, setDynamicReviews] = useState([]);
  const [loadingListing, setLoadingListing] = useState(true);

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        setLoadingListing(true);
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        
        // 1. Fetch listing by ID if provided, otherwise fetch first active listing
        let targetId = id;
        let fetchedData = null;

        // Try fetching with the requested ID first if provided and valid
        if (targetId && targetId !== 'sample') {
          try {
            const res = await fetch(`${baseUrl}/listings/${targetId}`);
            const json = await res.json();
            if (json.success && json.data) {
              fetchedData = json.data;
            }
          } catch (e) {
            console.warn(`Listing ${targetId} fetch failed:`, e);
          }
        }

        // If requested ID does not exist in DB (e.g. user clicked /listing/1 but DB has id 5, 6, etc.),
        // fetch the active Stay listing from DB if available!
        if (!fetchedData) {
          try {
            const listRes = await fetch(`${baseUrl}/listings?status=Active`);
            const listJson = await listRes.json();
            if (listJson.success && Array.isArray(listJson.data) && listJson.data.length > 0) {
              const stayOnly = listJson.data.find(l => (l.type || '').toLowerCase().includes('stay') || (l.type || '').toLowerCase().includes('entire') || (l.type || '').toLowerCase().includes('room') || (l.type || '').toLowerCase().includes('apartment') || (l.type || '').toLowerCase().includes('villa') || (l.type || '').toLowerCase().includes('home'));
              if (stayOnly) {
                fetchedData = stayOnly;
                targetId = stayOnly.id;
              }
            }
          } catch (e) {
            console.warn('Failed to fetch active fallback listings:', e);
          }
        }

        if (fetchedData) {
          setListingData(fetchedData);
          targetId = fetchedData.id;

          // Fetch reviews for this active listing
            try {
              const revRes = await fetch(`${baseUrl}/listings/${targetId}/reviews`);
              const revJson = await revRes.json();
              if (revJson.success && Array.isArray(revJson.data) && revJson.data.length > 0) {
                setDynamicReviews(revJson.data);
              }
            } catch (rErr) {
              console.warn('Could not fetch reviews:', rErr);
            }

            // Fetch master amenities list for categorized modal
            try {
              const amRes = await fetch(`${baseUrl}/listings/master-amenities?all=true`);
              const amJson = await amRes.json();
              if (amJson.success && Array.isArray(amJson.data) && amJson.data.length > 0) {
                setMasterAmenities(amJson.data);
              }
            } catch (aErr) {
              console.warn('Could not fetch master amenities:', aErr);
            }
          }
      } catch (err) {
        console.warn('Listing fetch error, fallback in use:', err);
      } finally {
        setLoadingListing(false);
      }
    };

    fetchListingDetails();
  }, [id]);

  // Dynamic Images with reliable fallback
  const rawPhotos = Array.isArray(listingData?.photos) && listingData.photos.length > 0
    ? listingData.photos
    : listingData?.cover_img
    ? [listingData.cover_img]
    : fallbackImages;

  // Ensure minimum 5 images for the 5-grid
  const images = [...rawPhotos];
  while (images.length < 5) {
    images.push(fallbackImages[images.length % fallbackImages.length]);
  }

  // Dynamic categorized images for full gallery
  const categorizedImages = Array.isArray(listingData?.categorized_photos) && listingData.categorized_photos.length > 0
    ? listingData.categorized_photos
    : [
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

  // Dynamic host & listing fields
  const title = listingData?.title || 'Dhananjaya:Apartment in sawai madhopur';
  
  // Extract accurate dynamic location from database (city, residential_address, street, state, country)
  const resAddr = typeof listingData?.residential_address === 'string'
    ? (() => { try { return JSON.parse(listingData.residential_address); } catch { return {}; } })()
    : (listingData?.residential_address || {});
  const meetupAddr = typeof listingData?.meetup_address === 'string'
    ? (() => { try { return JSON.parse(listingData.meetup_address); } catch { return {}; } })()
    : (listingData?.meetup_address || {});

  const dynamicStreet = listingData?.street || resAddr?.street || meetupAddr?.street || '';
  const dynamicDistrict = resAddr?.district || meetupAddr?.district || '';
  const dynamicCity = listingData?.city || resAddr?.city || meetupAddr?.city || 'Sawai Madhopur, India';
  const dynamicState = listingData?.state || resAddr?.state || meetupAddr?.state || '';
  const dynamicCountry = listingData?.country || resAddr?.country || meetupAddr?.country || 'India';
  const dynamicPin = resAddr?.pin || meetupAddr?.pin || '';

  // Construct readable location string
  const city = dynamicCity;
  const fullLocationDisplay = [dynamicStreet, dynamicCity, dynamicState, dynamicCountry].filter(Boolean).join(', ') || city;
  const mapSearchQuery = [dynamicStreet, dynamicCity, dynamicState, dynamicCountry].filter(Boolean).join(', ') || city;

  const type = listingData?.type || 'Entire apartment';
  const hostName = listingData?.host_name || 'Host';
  const hostAvatar = listingData?.host_avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80';
  
  // Calculate real hosting years from user registration or years_experience column
  const hostMemberSinceYear = listingData?.host_member_since 
    ? new Date(listingData.host_member_since).getFullYear() 
    : (new Date().getFullYear() - (Number(listingData?.years_experience) || 1));
  const calculatedYears = Math.max(1, new Date().getFullYear() - hostMemberSinceYear);
  const hostYears = listingData?.years_experience ? Number(listingData.years_experience) : calculatedYears;

  // Real reviews count & rating
  const reviewsCount = dynamicReviews.length > 0 
    ? dynamicReviews.length 
    : (listingData?.reviews_count !== undefined && listingData?.reviews_count !== null 
        ? Number(listingData.reviews_count) 
        : 0);

  const calculatedAvgRating = dynamicReviews.length > 0
    ? (dynamicReviews.reduce((sum, r) => sum + (parseFloat(r.rating) || 5), 0) / dynamicReviews.length).toFixed(2)
    : (listingData?.rating ? Number(listingData.rating).toFixed(2) : '5.0');
  const rating = calculatedAvgRating;

  const basePrice = listingData?.price ? Number(listingData.price) : 2583;
  const originalPrice = Math.round(basePrice * 1.15);
  const refundablePrice = Math.round(basePrice * 1.11);
  const maxAllowedGuests = listingData?.max_guests || 5;
  const bedroomsCount = listingData?.bedrooms || 2;
  const bedsCount = listingData?.beds || 4;
  const bathroomsCount = listingData?.bathrooms || 2;
  const description = listingData?.description || `Kick back and relax in this calm, stylish space.
Forget your worries in this spacious and serene space.
a place near wildlife sanctuary. 2 large bedrooms with balconies.peaceful environment and spacious stay. you can enjoy sunrise and sunset.
railway station distance 3 kms
safari office is 3.5 kms

(safari booking available)...`;

  const isSuperhost = listingData?.is_featured || listingData?.is_guest_favourite || Number(rating) >= 4.8;
  const hostIntro = listingData?.host_intro || listingData?.host_bio || `${hostName} is committed to providing great stays for guests.`;
  const hostRecognition = listingData?.career_highlight || listingData?.host_recognition || '';
  const hostQualifications = listingData?.degree || listingData?.host_qualifications || '';
  const hostVerification = listingData?.host_verification || 'Identity verified';
  const hostLocation = listingData?.host_location || city;
  const hostLanguage = Array.isArray(listingData?.languages) && listingData.languages.length > 0
    ? listingData.languages.join(', ')
    : (listingData?.host_preferred_language || 'English, Hindi');

  const amenitiesList = Array.isArray(listingData?.amenities) && listingData.amenities.length > 0
    ? listingData.amenities
    : ['Desert view', 'Mountain view', 'Kitchen', 'Wifi – 30 Mbps', 'Dedicated workspace', 'Free parking on premises', 'TV', 'Lift'];

  // Helper for dynamic amenity icon
  const getAmenityIcon = (name = '', isStrikethrough = false) => {
    const lower = String(name || '').toLowerCase();
    if (lower.includes('wifi') || lower.includes('internet')) return <FiWifi size={24} />;
    if (lower.includes('water') || lower.includes('shower') || lower.includes('bath')) return <MdOutlineShower size={24} />;
    if (lower.includes('heat') || lower.includes('warm')) return <MdOutlineHeatPump size={24} />;
    if (lower.includes('air conditioning') || lower.includes('ac') || lower.includes('cool')) return <FaSnowflake size={22} />;
    if (lower.includes('kitchen') || lower.includes('cook') || lower.includes('fridge')) return <TbToolsKitchen2 size={24} />;
    if (lower.includes('camera') || lower.includes('security')) return <BsCameraVideo size={22} />;
    if (lower.includes('noise') || lower.includes('sound') || lower.includes('decibel')) return <BsVolumeUp size={24} />;
    if (lower.includes('pool')) return <MdOutlinePool size={24} />;
    if (lower.includes('hottub') || lower.includes('hot tub')) return <MdOutlineHotTub size={24} />;
    if (lower.includes('park') || lower.includes('car')) return <MdOutlineDirectionsCar size={24} />;
    if (lower.includes('tv') || lower.includes('cable')) return <FaTv size={22} />;
    if (lower.includes('smoke') || lower.includes('fire') || lower.includes('alarm') || lower.includes('monoxide')) return <MdOutlineReportProblem size={24} />;
    if (lower.includes('view') || lower.includes('mountain')) return <TbMountain size={24} />;
    if (lower.includes('work') || lower.includes('desk') || lower.includes('laptop')) return <FiMonitor size={24} />;
    if (lower.includes('bbq') || lower.includes('grill') || lower.includes('dining')) return <MdOutlineOutdoorGrill size={24} />;
    if (lower.includes('wash') || lower.includes('laundry') || lower.includes('dryer')) return <MdOutlineLocalLaundryService size={24} />;
    return <MdOutlineWorkspacePremium size={24} />;
  };

  // Group master amenities by category for modal
  const defaultMasterCategories = [
    {
      category: 'Bathroom',
      items: [
        { name: 'Hot water', sublabel: '' },
        { name: 'Shower gel & Shampoo', sublabel: '' }
      ]
    },
    {
      category: 'Heating and cooling',
      items: [
        { name: 'Heating', sublabel: '' },
        { name: 'Air conditioning', sublabel: '' }
      ]
    },
    {
      category: 'Home safety',
      items: [
        { name: 'Noise decibel monitors on property', sublabel: '' },
        { name: 'Exterior security cameras on property', sublabel: 'Installed at building entrance and exterior premises' }
      ]
    },
    {
      category: 'Internet and office',
      items: [
        { name: 'Wifi – 30 Mbps', sublabel: 'Verified speed' },
        { name: 'Dedicated workspace', sublabel: 'A desk and chair for working' }
      ]
    },
    {
      category: 'Services',
      items: [
        { name: 'Dedicated Host', sublabel: 'Available for personalized check-in & support' },
        { name: 'Local Guide', sublabel: 'Assistance with safari tours and town recommendations' }
      ]
    },
    {
      category: 'Not included',
      items: [
        { name: 'Kitchen', sublabel: '', notIncluded: true },
        { name: 'Carbon monoxide alarm', sublabel: '', notIncluded: true },
        { name: 'Smoke alarm', sublabel: '', notIncluded: true }
      ]
    }
  ];

  // Dynamically map backend master_amenities if available
  const dynamicAmenitiesCategories = (() => {
    try {
      if (!Array.isArray(masterAmenities) || masterAmenities.length === 0) {
        return defaultMasterCategories;
      }
      
      const safeAmenitiesList = Array.isArray(amenitiesList) ? amenitiesList : [];
      const catMap = {};

      masterAmenities.forEach(am => {
        if (!am || typeof am !== 'object') return;
        const cat = am.category || 'Features & Standouts';
        if (!catMap[cat]) catMap[cat] = [];

        const amName = String(am.name || '').trim();
        const isIncluded = safeAmenitiesList.some(item => {
          const sItem = String(item || '').trim().toLowerCase();
          const sAm = amName.toLowerCase();
          return sItem.length > 0 && sAm.length > 0 && (sItem.includes(sAm) || sAm.includes(sItem));
        });

        catMap[cat].push({
          name: amName || 'Amenity',
          sublabel: String(am.sublabel || ''),
          notIncluded: !isIncluded
        });
      });

      const categories = Object.keys(catMap).map(cName => ({
        category: cName,
        items: catMap[cName]
      }));

      // Add extra listed amenities that are not in master table
      const unmappedListed = safeAmenitiesList.filter(al => {
        const sAl = String(al || '').trim().toLowerCase();
        return sAl && !masterAmenities.some(ma => String(ma?.name || '').trim().toLowerCase() === sAl);
      });

      if (unmappedListed.length > 0) {
        categories.unshift({
          category: 'Highlights of this place',
          items: unmappedListed.map(name => ({ name: String(name), sublabel: 'Offered by host', notIncluded: false }))
        });
      }

      return categories.length > 0 ? categories : defaultMasterCategories;
    } catch (e) {
      console.warn('Error computing dynamic amenities:', e);
      return defaultMasterCategories;
    }
  })();

  const totalAmenitiesCount = Array.isArray(dynamicAmenitiesCategories)
    ? dynamicAmenitiesCategories.reduce((acc, cat) => acc + (Array.isArray(cat?.items) ? cat.items.length : 0), 0)
    : 10;

  // Calculate nights
  const nightsCount = selectedRange?.from && selectedRange?.to
    ? Math.max(1, Math.ceil((selectedRange.to - selectedRange.from) / (1000 * 60 * 60 * 24)))
    : 1;

  const currentTotal = rateType === 'refundable' 
    ? refundablePrice * nightsCount 
    : basePrice * nightsCount;

  // Dynamic booking submission to backend
  const handleReserveBooking = async () => {
    try {
      if (!selectedRange?.from || !selectedRange?.to) {
        toast.error('Please select valid check-in and checkout dates.');
        setShowCalendarWidget(true);
        return;
      }

      setIsReserving(true);
      const baseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://airbnb-7xie.onrender.com/api');

      const fullLocation = fullLocationDisplay || `${city}, India`;
      const guestFullName = authUser 
        ? `${authUser.firstName || authUser.first_name || ''} ${authUser.lastName || authUser.last_name || ''}`.trim() || 'Valued Guest'
        : 'Guest User';
      const guestEmail = authUser?.email || 'guest@example.com';
      const guestPhone = authUser?.phone || '+91 98765 43210';

      const orderPayload = {
        amount: currentTotal,
        listingId: listingData?.id || (id && !isNaN(Number(id)) ? Number(id) : null),
        listingTitle: title,
        packageTitle: `${rateType === 'refundable' ? 'Refundable Rate' : 'Non-refundable Rate'} (${nightsCount} Night${nightsCount > 1 ? 's' : ''})`,
        guestsCount: totalGuests,
        hostName,
        location: fullLocation,
        bookingDate: selectedRange.from.toISOString(),
        bookingTime: '3:00 pm (Check-in)',
        guestName: guestFullName,
        guestEmail: guestEmail,
        guestPhone: guestPhone,
        userId: authUser?.id || null
      };

      const res = await fetch(`${baseUrl}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const orderData = await res.json();
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to initialize booking order');
      }

      // Check if Razorpay SDK is available
      if (!window.Razorpay) {
        // Fallback confirmation redirect if script was blocked
        toast.success('Reservation initiated successfully!');
        const bCode = orderData.bookingCode || orderData.booking?.booking_code;
        if (bCode) {
          navigate(`/booking-confirmed/${bCode}`);
        }
        setIsReserving(false);
        return;
      }

      const options = {
        key: orderData.key || 'rzp_test_ToafKH36vIRD5L',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Airbnb Stay Reservation',
        description: `${title} (${nightsCount} night${nightsCount > 1 ? 's' : ''})`,
        image: images[0] || '/favicon.png',
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${baseUrl}/payments/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingCode: orderData.bookingCode
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              toast.success('🎉 Booking Confirmed Successfully!');
              const bCode = verifyData.bookingCode || orderData.bookingCode;
              navigate(`/booking-confirmed/${bCode}`);
            } else {
              toast.error(verifyData.message || 'Payment verification failed');
            }
          } catch (vErr) {
            console.error('Verification error:', vErr);
            toast.error('Network error during confirmation.');
          } finally {
            setIsReserving(false);
          }
        },
        prefill: {
          name: guestFullName,
          email: guestEmail,
          contact: guestPhone
        },
        theme: {
          color: '#e51d53'
        },
        modal: {
          ondismiss: function () {
            setIsReserving(false);
            toast('Reservation pending payment', { icon: 'ℹ️' });
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        console.error('Payment failed:', resp.error);
        toast.error(`Payment failed: ${resp.error?.description || 'Transaction declined'}`);
        setIsReserving(false);
      });
      rzp.open();

    } catch (err) {
      console.error('Booking reservation error:', err);
      toast.error(err.message || 'Could not complete reservation.');
      setIsReserving(false);
    }
  };

  // Sync wishlist status across components & storage
  useEffect(() => {
    if (listingData) {
      setIsSaved(isItemInAnyWishlist(listingData.id, title, type));
    }
    const handleWishlistUpdate = () => {
      if (listingData) {
        setIsSaved(isItemInAnyWishlist(listingData.id, title, type));
      }
    };
    window.addEventListener('airbnb_wishlists_updated', handleWishlistUpdate);
    return () => window.removeEventListener('airbnb_wishlists_updated', handleWishlistUpdate);
  }, [listingData, title, type]);

  // Track recently viewed listing
  useEffect(() => {
    if (listingData && title) {
      trackRecentlyViewedItem({
        id: listingData.id || id,
        title: title,
        category: type || 'Stays',
        host: hostName,
        image: images[0],
        price: `₹${basePrice.toLocaleString('en-IN')}`
      });
    }
  }, [listingData, title, type, hostName, images, basePrice, id]);

  // Wishlist toggle handler
  const handleToggleWishlist = () => {
    if (isSaved) {
      removeItemFromWishlists(listingData?.id || id, title, type);
      setIsSaved(false);
      toast.success('Removed from wishlist');
    } else {
      setWishlistName(city ? `${city} ${new Date().getFullYear()}` : 'My Wishlist');
      setIsSaveModalOpen(true);
    }
  };

  // Handle Save / Create Wishlist submission
  const handleCreateWishlist = () => {
    const trimmed = wishlistName.trim();
    if (!trimmed) {
      toast.error('Please enter a wishlist name');
      return;
    }
    addWishlist(trimmed, {
      id: listingData?.id || id,
      title: title,
      category: type || 'Stays',
      host: hostName,
      image: images[0],
      price: `₹${basePrice.toLocaleString('en-IN')}`
    });
    setIsSaved(true);
    closeSaveModal();
    toast.success(`Saved to "${trimmed}"!`);
  };

  // If listing details are still loading from backend, show universal Airbnb loader
  if (loadingListing) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader fullScreen={false} size="large" variant="airbnb" text="Loading listing details..." />
      </div>
    );
  }

  // If user clicked Reserve, render the "Request to book" screen
  if (showRequestToBookPage) {
    const formattedDateRange = selectedRange?.from && selectedRange?.to
      ? `${format(selectedRange.from, 'd')}-${format(selectedRange.to, 'd MMM yyyy')}`
      : '19-20 Oct 2026';

    const guestsText = `${totalGuests} guest${totalGuests > 1 ? 's' : ''}${guests.infants > 0 ? `, ${guests.infants} infant${guests.infants > 1 ? 's' : ''}` : ''}`;
    const baseSubtotal = currentTotal;
    const taxesAmount = Math.round(baseSubtotal * 0.05); // 5% GST taxes
    const grandTotal = baseSubtotal + taxesAmount;

    return (
      <div className={`container ${styles['rtb-page-wrapper']}`}>
        {/* Back and Title */}
        <div className={styles['rtb-header-row']}>
          <button 
            className={styles['rtb-back-btn']} 
            onClick={() => setShowRequestToBookPage(false)}
            title="Go back"
          >
            <FaArrowLeft />

          </button>
          <h1 className={styles['rtb-page-title']}>Request to book</h1>
        </div>

        <div className="row  align-items-start">
          {/* Left Column: Message host & Proceed to payment */}
          <div className="col-lg-7 mb-3">
            
            {/* Message the Host Card */}
            <div className={styles['rtb-message-card']}>
              <h3 className={styles['rtb-card-heading']}>Message the host</h3>
              <p className={styles['rtb-card-subtext']}>
                Before you can continue, let {hostName} know a little about your trip and why their place is a good fit.
              </p>

              <div className={styles['rtb-host-badge']}>
                <img 
                  src={hostAvatar} 
                  alt={hostName} 
                  className={styles['rtb-host-avatar']}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80'; }} 
                />
                <div>
                  <h4 className={styles['rtb-host-name']}>{hostName}</h4>
                  <p className={styles['rtb-host-since']}>Hosting since {hostMemberSinceYear}</p>
                </div>
              </div>

              <textarea 
                className={styles['rtb-textarea']}
                placeholder={`Example: "Hi ${hostName}, my partner and I are going to a friend's wedding and your place is just down the road."`}
                value={hostMessage}
                onChange={(e) => setHostMessage(e.target.value)}
              />
            </div>

            {/* Proceed to payment section */}
            <div className={styles['rtb-payment-section']}>
              <h2 className={styles['rtb-payment-title']}>Proceed to payment</h2>
              <p className={styles['rtb-payment-subtext']}>
                You'll be directed to Razorpay to complete payment.
              </p>

              <p className={styles['rtb-notice-text']}>
                The host has 24 hours to accept your request. You'll pay now, but get a full refund if the booking isn't confirmed.
              </p>

              <p className={styles['rtb-terms-agreement']}>
                By selecting the button, I agree to the <span className={styles['rtb-terms-link']} onClick={() => alert('Standard Airbnb Booking Terms & Policies apply.')}>booking terms</span>.
              </p>

              <button 
                className={styles['rtb-continue-btn']}
                onClick={handleReserveBooking}
                disabled={isReserving}
              >
                {isReserving ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Redirecting to Razorpay...
                  </span>
                ) : (
                  'Continue to payment'
                )}
              </button>
            </div>

          </div>

          {/* Right Column: Listing Card & Price Breakdown */}
          <div className="col-lg-5">
            
            {/* Price green banner */}
            <div className={styles['rtb-avg-banner']}>
              <span>🍃</span>
              <span>Your price is below the 60-day average</span>
            </div>

            {/* Summary card */}
            <div className={styles['rtb-summary-card']}>
              <div className={styles['rtb-summary-top']}>
                <img 
                  src={images[0]} 
                  alt={title} 
                  className={styles['rtb-summary-thumb']} 
                />
                <div>
                  <h3 className={styles['rtb-summary-title']}>{title}</h3>
                  <div className={styles['rtb-summary-rating']}>
                    ★ {rating} ({reviewsCount}) · {isSuperhost ? 'Guest favourite' : 'Verified stay'}
                  </div>
                </div>
              </div>

              <div className={styles['rtb-policy-sub']}>
                This reservation is {rateType === 'refundable' ? 'refundable' : 'non-refundable'}.{' '}
                <span className={styles['rtb-policy-link']} onClick={() => alert(`Policy: ${listingData?.cancellation_policy || 'Standard cancellation policy'}`)}>Full policy</span>
              </div>

              {/* Dates row with Change button */}
              <div className={styles['rtb-change-row']}>
                <div>
                  <div className={styles['rtb-change-label']}>Dates</div>
                  <div className={styles['rtb-change-val']}>{formattedDateRange}</div>
                </div>
                <button 
                  className={styles['rtb-change-btn']}
                  onClick={() => setRtbShowCalendarModal(true)}
                >
                  Change
                </button>
              </div>

              {/* Guests row with Change button */}
              <div className={styles['rtb-change-row']}>
                <div>
                  <div className={styles['rtb-change-label']}>Guests</div>
                  <div className={styles['rtb-change-val']}>{guestsText}</div>
                </div>
                <button 
                  className={styles['rtb-change-btn']}
                  onClick={() => setRtbShowGuestModal(true)}
                >
                  Change
                </button>
              </div>

              {/* Price Details */}
              <div className={styles['rtb-price-details-section']}>
                <h4 className={styles['rtb-price-sec-heading']}>Price details</h4>
                
                <div className={styles['rtb-price-line']}>
                  <span>{nightsCount} night{nightsCount > 1 ? 's' : ''} x ₹{rateType === 'refundable' ? refundablePrice.toLocaleString() : basePrice.toLocaleString()}</span>
                  <span>₹{baseSubtotal.toLocaleString()}.00</span>
                </div>

                <div className={styles['rtb-price-line']}>
                  <span>Taxes (5% GST)</span>
                  <span>₹{taxesAmount.toLocaleString()}.00</span>
                </div>

                <div className={`${styles['rtb-price-line']} ${styles.total}`}>
                  <span>Total INR</span>
                  <span>₹{grandTotal.toLocaleString()}.00</span>
                </div>

                <span 
                  className={styles['rtb-price-breakdown-link']}
                  onClick={() => alert(`Base fare: ₹${baseSubtotal}\nTaxes: ₹${taxesAmount}\nTotal Payable: ₹${grandTotal}`)}
                >
                  Price breakdown
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* In-page Calendar Modal for Request to book */}
        {rtbShowCalendarModal && (
          <div 
            className={styles['modal-overlay']} 
            onClick={() => setRtbShowCalendarModal(false)}
          >
            <div 
              className={styles['rtb-modal-card']} 
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles['rtb-modal-header']}>
                <h3 className={styles['rtb-modal-title']}>Select dates</h3>
                <button 
                  className={styles['share-close-btn']} 
                  onClick={() => setRtbShowCalendarModal(false)}
                >
                  <FaTimes size={16} />
                </button>
              </div>
              <div className={styles['rtb-modal-body']}>
                <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
                  <DayPicker
                    mode="range"
                    selected={selectedRange}
                    onSelect={setSelectedRange}
                    numberOfMonths={2}
                    pagedNavigation
                  />
                </div>
              </div>
              <div className={styles['rtb-modal-footer']}>
                <button 
                  className={styles['outline-btn']}
                  onClick={() => setSelectedRange({from: undefined, to: undefined})}
                >
                  Clear dates
                </button>
                <button 
                  className={styles['rtb-continue-btn']}
                  style={{ minWidth: '120px', padding: '10px 20px' }}
                  onClick={() => {
                    if (!selectedRange?.from || !selectedRange?.to) {
                      toast.error('Please pick check-in and checkout dates');
                      return;
                    }
                    setRtbShowCalendarModal(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* In-page Guests Modal for Request to book */}
        {rtbShowGuestModal && (
          <div 
            className={styles['modal-overlay']} 
            onClick={() => setRtbShowGuestModal(false)}
          >
            <div 
              className={styles['rtb-modal-card']} 
              style={{ maxWidth: '480px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles['rtb-modal-header']}>
                <h3 className={styles['rtb-modal-title']}>Guests</h3>
                <button 
                  className={styles['share-close-btn']} 
                  onClick={() => setRtbShowGuestModal(false)}
                >
                  <FaTimes size={16} />
                </button>
              </div>
              <div className={styles['rtb-modal-body']}>
                <div className={styles['guest-row']}>
                  <div className={styles['guest-info']}>
                    <h3>Adults</h3>
                    <p>Age 13+</p>
                  </div>
                  <div className={styles['guest-controls']}>
                    <button className={styles['guest-btn']} disabled={guests.adults <= 1} onClick={() => setGuests(prev => ({...prev, adults: prev.adults - 1}))}>-</button>
                    <span className={styles['guest-count']}>{guests.adults}</span>
                    <button className={styles['guest-btn']} disabled={totalGuests >= maxAllowedGuests} onClick={() => setGuests(prev => ({...prev, adults: prev.adults + 1}))}>+</button>
                  </div>
                </div>
                <div className={styles['guest-row']}>
                  <div className={styles['guest-info']}>
                    <h3>Children</h3>
                    <p>Ages 2-12</p>
                  </div>
                  <div className={styles['guest-controls']}>
                    <button className={styles['guest-btn']} disabled={guests.children <= 0} onClick={() => setGuests(prev => ({...prev, children: prev.children - 1}))}>-</button>
                    <span className={styles['guest-count']}>{guests.children}</span>
                    <button className={styles['guest-btn']} disabled={totalGuests >= maxAllowedGuests} onClick={() => setGuests(prev => ({...prev, children: prev.children + 1}))}>+</button>
                  </div>
                </div>
                <div className={styles['guest-row']}>
                  <div className={styles['guest-info']}>
                    <h3>Infants</h3>
                    <p>Under 2</p>
                  </div>
                  <div className={styles['guest-controls']}>
                    <button className={styles['guest-btn']} disabled={guests.infants <= 0} onClick={() => setGuests(prev => ({...prev, infants: prev.infants - 1}))}>-</button>
                    <span className={styles['guest-count']}>{guests.infants}</span>
                    <button className={styles['guest-btn']} disabled={guests.infants >= 5} onClick={() => setGuests(prev => ({...prev, infants: prev.infants + 1}))}>+</button>
                  </div>
                </div>
                <p className={styles['guest-disclaimer']} style={{ marginTop: '16px' }}>
                  This place has a maximum of {maxAllowedGuests} guests, not including infants. Pets aren't allowed.
                </p>
              </div>
              <div className={styles['rtb-modal-footer']}>
                <button 
                  className={styles['rtb-continue-btn']}
                  style={{ minWidth: '120px', padding: '10px 20px' }}
                  onClick={() => setRtbShowGuestModal(false)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className='container pt-3'>
      
      {/* Header Section */}
      <div className={styles['title-section']}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles['action-buttons']}>
          <button className={styles['action-btn']} onClick={() => setIsShareModalOpen(true)}>
            <FiShare size={16} /> Share
          </button>
          <button 
            className={styles['action-btn']} 
            onClick={handleToggleWishlist}
            title={isSaved ? 'Saved in wishlist' : 'Save to wishlist'}
          >
            <FiHeart 
              size={16} 
              fill={isSaved ? '#ff385c' : 'none'} 
              color={isSaved ? '#ff385c' : '#222222'} 
            /> 
            {isSaved ? 'Saved' : 'Save'}
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

      <div className={`row ${styles['content-layout']}`}>
        
        {/* Left Column */}
        <div className={`col-lg-8 ${styles['left-column']}`}>
          
          <div className={styles['subtitle-section']}>
            <h2 className={styles.subtitle}>{type} in {city}</h2>
            <div className={styles['guest-info']}>
              {maxAllowedGuests} guests · {bedroomsCount} bedroom{bedroomsCount > 1 ? 's' : ''} · {bedsCount} bed{bedsCount > 1 ? 's' : ''} · {bathroomsCount} bathroom{bathroomsCount > 1 ? 's' : ''}
            </div>
            <div className={styles['reviews-info']}>
              <FiStar fill="#222" /> {rating} · <span className={styles['reviews-link']}>{reviewsCount} reviews</span>
            </div>
          </div>

          <div className={styles['host-section']}>
            <img 
              src={hostAvatar} 
              alt={hostName} 
              className={styles['host-avatar']} 
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80'; }} 
            />
            <div>
              <h3 className={styles['host-name']}>Hosted by {hostName}</h3>
              <p className={styles['host-status']}>Superhost · {hostYears} years hosting</p>
            </div>
          </div>

          <div className={styles['highlights-section']}>
            <div className={styles['highlight-item']}>
              <MdOutlineWorkspacePremium className={styles['highlight-icon']} />
              <div>
                <h4 className={styles['highlight-title']}>{listingData?.career_highlight || `Top rated stay in ${city}`}</h4>
                <p className={styles['highlight-desc']}>One of the most loved homes on Airbnb based on ratings and reliability.</p>
              </div>
            </div>
            <div className={styles['highlight-item']}>
              <BsDoorOpen className={styles['highlight-icon']} />
              <div>
                <h4 className={styles['highlight-title']}>Self check-in</h4>
                <p className={styles['highlight-desc']}>You can check in seamlessly with the door code or building staff.</p>
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
            <div style={{ whiteSpace: 'pre-line' }}>{description}</div>
            <button className={styles['show-more-btn']} onClick={() => setIsDescModalOpen(true)}>
              Show more <FaChevronDown size={12} />
            </button>
          </div>

          <div className={styles['sleep-section']}>
            <h2 className={styles['section-title']}>Where you'll sleep</h2>
            <div className="row g-3">
              {Array.from({ length: Math.min(Math.max(1, bedroomsCount), 4) }).map((_, bIdx) => (
                <div key={bIdx} className="col-12 col-sm-6 col-md-4">
                  <div className={styles['bedroom-card']} style={{ width: '100%' }}>
                    <img 
                      src={images[(bIdx + 1) % images.length]} 
                      alt={`Bedroom ${bIdx + 1}`} 
                      className={styles['bedroom-img']} 
                    />
                    <h4 className={styles['bedroom-title']}>Bedroom {bIdx + 1}</h4>
                    <p className={styles['bedroom-desc']}>
                      {bIdx === 0 ? '1 king bed' : '1 queen bed'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles['amenities-section']}>
            <h2 className={styles['section-title']}>What this place offers</h2>
            <div className="row g-3 mb-4">
              {amenitiesList.slice(0, 8).map((amenity, aIdx) => (
                <div key={aIdx} className="col-12 col-sm-6">
                  <div className={styles['amenity-item']}>
                    {getAmenityIcon(amenity)} {amenity}
                  </div>
                </div>
              ))}
              <div className="col-12 col-sm-6">
                <div className={`${styles['amenity-item']} ${styles.strikethrough}`}>
                  <MdOutlineReportProblem size={24} /> Carbon monoxide alarm
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className={`${styles['amenity-item']} ${styles.strikethrough}`}>
                  <MdOutlineReportProblem size={24} /> Smoke alarm
                </div>
              </div>
            </div>
            <button 
              className={styles['outline-btn']}
              onClick={() => setIsAmenitiesModalOpen(true)}
            >
              Show all {totalAmenitiesCount} amenities
            </button>
          </div>
        </div>

        {/* Right Column (Booking Widget) */}
        <div className={`col-lg-4 ${styles['right-column']}`}>
          <div className={styles['booking-widget']}>
            
            <div className={styles['widget-price-section']}>
              <span className={styles['original-price']}>₹{originalPrice.toLocaleString()}</span>
              <span className={styles['discounted-price']}>₹{basePrice.toLocaleString()}</span>
              <span className={styles['price-unit']}>per night</span>
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
                          ? `${nightsCount} night${nightsCount > 1 ? 's' : ''}` 
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
                      <button className={styles['guest-btn']} disabled={totalGuests >= maxAllowedGuests} onClick={(e) => { e.stopPropagation(); setGuests(prev => ({...prev, adults: prev.adults + 1})); }}>+</button>
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
                      <button className={styles['guest-btn']} disabled={totalGuests >= maxAllowedGuests} onClick={(e) => { e.stopPropagation(); setGuests(prev => ({...prev, children: prev.children + 1})); }}>+</button>
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
                    This place has a maximum of {maxAllowedGuests} guests, not including infants. Pets aren't allowed.
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
                  <h4 className={styles['rate-title']}>Non-refundable · ₹{(basePrice * nightsCount).toLocaleString()}.00 total</h4>
                  <p className={styles['rate-desc']}>Free cancellation for 24 hours. After that, the reservation is non-refundable.</p>
                </div>
                <input type="radio" checked={rateType === 'non-refundable'} readOnly style={{ accentColor: '#222' }} />
              </div>
              
              <div 
                className={`${styles['rate-option']} ${rateType === 'refundable' ? styles.active : ''}`}
                onClick={() => setRateType('refundable')}
              >
                <div className={styles['rate-text']}>
                  <h4 className={styles['rate-title']}>Refundable · ₹{(refundablePrice * nightsCount).toLocaleString()}.00 total</h4>
                  <p className={styles['rate-desc']}>Free cancellation before check-in. Policy: {listingData?.cancellation_policy || 'Flexible'}.</p>
                </div>
                <input type="radio" checked={rateType === 'refundable'} readOnly style={{ accentColor: '#222' }} />
              </div>
            </div>

            <button 
              className={styles['reserve-btn']} 
              onClick={() => {
                if (!selectedRange?.from || !selectedRange?.to) {
                  toast.error('Please select valid check-in and checkout dates.');
                  setShowCalendarWidget(true);
                  return;
                }
                setShowRequestToBookPage(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Reserve
            </button>
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
          <FiStar fill="#222" /> {rating} · {reviewsCount} reviews
        </div>

        <div className='row'>
          {dynamicReviews.length > 0 ? (
            dynamicReviews.map((rev, revIdx) => (
              <div key={rev.id || revIdx} className="col-md-6 mb-3">
                <div className={styles['review-card']}>
                  <div className={styles['reviewer-info']}>
                    {rev.reviewer_avatar ? (
                      <img src={rev.reviewer_avatar} className={styles['reviewer-avatar']} alt={rev.reviewer_name} />
                    ) : (
                      <div className={styles['reviewer-avatar']}>{(rev.reviewer_name || 'G')[0].toUpperCase()}</div>
                    )}
                    <div>
                      <h4 className={styles['reviewer-name']}>{rev.reviewer_name}</h4>
                      <p className={styles['review-date']}>{rev.created_at ? format(new Date(rev.created_at), 'MMMM yyyy') : 'Recent stay'}</p>
                    </div>
                  </div>
                  <p className={styles['review-text']}>{rev.review_text}</p>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="col-md-6">
                <div className={styles['review-card']}>
                  <div className={styles['reviewer-info']}>
                    <div className={styles['reviewer-avatar']}>A</div>
                    <div>
                      <h4 className={styles['reviewer-name']}>Abhimanyu Singh</h4>
                      <p className={styles['review-date']}>3 weeks ago</p>
                    </div>
                  </div>
                  <p className={styles['review-text']}>Great stay! The place was clean, comfortable, and well-maintained. The host was helpful and responsive. Everything went smoothly, and I would happily stay here again. Highly recommended!</p>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className={styles['review-card']}>
                  <div className={styles['reviewer-info']}>
                    <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80" className={styles['reviewer-avatar']} alt="Amit" />
                    <div>
                      <h4 className={styles['reviewer-name']}>Amit</h4>
                      <p className={styles['review-date']}>June 2026</p>
                    </div>
                  </div>
                  <p className={styles['review-text']}>I had a pleasant stay at this place. The location and overall experience were good, and the host was responsive and helpful whenever we had questions.</p>
                </div>
              </div>
              <div className="col-12 col-md-6">
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
              </div>
              <div className="col-12 col-md-6">
                <div className={styles['review-card']}>
                  <div className={styles['reviewer-info']}>
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" className={styles['reviewer-avatar']} alt="Diksha" />
                    <div>
                      <h4 className={styles['reviewer-name']}>Diksha</h4>
                      <p className={styles['review-date']}>May 2026</p>
                    </div>
                  </div>
                  <p className={styles['review-text']}>I rented the place for my family trip. The location was very peaceful, clean rooms, and close to all the main attractions.</p>
                </div>
              </div>
            </>
          )}
        </div>
        <button className={styles['outline-btn']}>Show all {reviewsCount} reviews</button>
      </div>

      {/* Map Section */}
      <div className={styles['map-section']}>
        <h2 className={styles['section-title']}>Where you'll be</h2>
        <p style={{marginBottom: '16px', color: '#222222', fontSize: '16px', fontWeight: '500'}}>
          {fullLocationDisplay}
        </p>
        <div className={styles['map-placeholder']} style={{ overflow: 'hidden', borderRadius: '16px', height: '480px', position: 'relative', border: '1px solid #e5e7eb' }}>
          <iframe 
            src={`https://maps.google.com/maps?q=${encodeURIComponent(mapSearchQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`} 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map of ${fullLocationDisplay}`}
          ></iframe>
          <div style={{
            position: 'absolute', 
            top: '20px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            background: 'white', 
            padding: '10px 20px', 
            borderRadius: '24px', 
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)', 
            fontWeight: '600',
            fontSize: '14px',
            color: '#222222',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📍 Exact location provided after booking
          </div>
        </div>
      </div>

      {/* Meet your host */}
      <div className={styles['host-details-section']}>
        <h2 className={styles['section-title']}>Meet your host</h2>
        <div className={`row align-items-start`}>
          <div className="col-md-5 col-lg-4 mb-3">
            <div className={styles['host-card-left']}>
              <img 
                src={hostAvatar} 
                alt={hostName} 
                className={styles['host-card-avatar']} 
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80'; }} 
              />
              <h3 className={styles.title} style={{fontSize: '24px', margin: '4px 0', textAlign : 'center'}}>{hostName}</h3>
              <p className={styles['host-status']} >
                {isSuperhost ? 'Superhost' : 'Verified Host'}
              </p>
              
              <div className={styles['host-stats']}>
                <div className={styles['host-stat-item']}>
                  <div className={styles['host-stat-val']}>{reviewsCount}</div>
                  <div className={styles['host-stat-label']}>Reviews</div>
                </div>
                <div className={styles['host-stat-item']}>
                  <div className={styles['host-stat-val']}>{rating}<FiStar fill="#222" size={12}/></div>
                  <div className={styles['host-stat-label']}>Rating</div>
                </div>
                <div className={styles['host-stat-item']}>
                  <div className={styles['host-stat-val']}>{hostYears}</div>
                  <div className={styles['host-stat-label']}>Years hosting</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-7 col-lg-8">
            <div className={styles['host-card-right']}>
              <h2>{hostName} is a {isSuperhost ? 'Superhost' : 'Verified Host'}</h2>
              <p>
                {hostIntro}
              </p>
              
              {hostRecognition && (
                <p style={{ fontWeight: '600', color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>⭐</span> {hostRecognition}
                </p>
              )}

              {hostQualifications && (
                <p >
                  🎓 {hostQualifications}
                </p>
              )}

              <h3 >Host details</h3>
              
              <button 
                className={styles['outline-btn']} 
                onClick={() => alert(`Starting direct conversation with host: ${hostName}`)}
              >
                Message {hostName}
              </button>
              <p style={{marginTop: '10px', fontSize: '14px', color: '#717171'}}>
                To help protect your payment, always use Airbnb to send money and communicate directly with {hostName}.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Things to know */}
      <div className={styles['things-to-know']}>
        <h2 className={styles['section-title']}>Things to know</h2>
        <div className={`row `}>
          <div className="col-md-4 mb-3">
            <div className={styles['rule-column']}>
              <h4>Cancellation policy</h4>
              <div className={styles['rule-item']}>Policy: {listingData?.cancellation_policy || 'Free cancellation for 24 hours. After that, the reservation is non-refundable.'}</div>
              <div className={styles['rule-item']}>Review this host's full policy for details.</div>
              <div className={styles['rule-link']}>Learn more</div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className={styles['rule-column']}>
              <h4>House rules</h4>
              <div className={styles['rule-item']}>Check-in: 1:00 pm – 9:00 pm</div>
              <div className={styles['rule-item']}>Checkout before 10:00 am</div>
              <div className={styles['rule-item']}>{maxAllowedGuests} guests maximum</div>
              <div className={styles['rule-link']}>Learn more</div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className={styles['rule-column']}>
              <h4>Safety & property</h4>
              <div className={styles['rule-item']}>Carbon monoxide alarm not reported</div>
              <div className={styles['rule-item']}>Smoke alarm not reported</div>
              <div className={styles['rule-link']}>Learn more</div>
            </div>
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
              <button className={styles['action-btn']} onClick={() => setIsShareModalOpen(true)}>
                <FiShare size={16} /> Share
              </button>
              <button 
                className={styles['action-btn']} 
                onClick={handleToggleWishlist}
                title={isSaved ? 'Saved in wishlist' : 'Save to wishlist'}
              >
                <FiHeart 
                  size={16} 
                  fill={isSaved ? '#ff385c' : 'none'} 
                  color={isSaved ? '#ff385c' : '#222222'} 
                /> 
                {isSaved ? 'Saved' : 'Save'}
              </button>
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
              <img src={images[0]} alt={title} className={styles['share-info-img']} />
              <div className={styles['share-info-text']}>
                <div style={{ fontWeight: 600, fontSize: '15px', color: '#222', marginBottom: '2px' }}>
                  {title}
                </div>
                <div style={{ fontSize: '13px', color: '#717171' }}>
                  {type} in {city} · ★{rating} · {bedroomsCount} bedrooms · {bedsCount} beds · {bathroomsCount} baths
                </div>
              </div>
            </div>

            <div className={styles['share-options-grid']}>
              <button 
                type="button"
                className={styles['share-option-btn']}
                onClick={() => handleSharePlatform('copy')}
                title="Copy Link"
              >
                <FaCopy size={20} color={copiedLink ? '#059669' : '#222'} /> 
                <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
              <button 
                type="button"
                className={styles['share-option-btn']}
                onClick={() => handleSharePlatform('email')}
                title="Share via Email"
              >
                <FaEnvelope size={20} color="#222" /> 
                <span>Email</span>
              </button>
              <button 
                type="button"
                className={styles['share-option-btn']}
                onClick={() => handleSharePlatform('messages')}
                title="Share via SMS / Messages"
              >
                <FaCommentDots size={20} color="#222" /> 
                <span>Messages</span>
              </button>
              <button 
                type="button"
                className={styles['share-option-btn']}
                onClick={() => handleSharePlatform('whatsapp')}
                title="Share via WhatsApp"
              >
                <FaWhatsapp size={20} color="#25D366" /> 
                <span>WhatsApp</span>
              </button>
              <button 
                type="button"
                className={styles['share-option-btn']}
                onClick={() => handleSharePlatform('messenger')}
                title="Share via Messenger"
              >
                <FaFacebookMessenger size={20} color="#0084FF" /> 
                <span>Messenger</span>
              </button>
              <button 
                type="button"
                className={styles['share-option-btn']}
                onClick={() => handleSharePlatform('facebook')}
                title="Share on Facebook"
              >
                <FaFacebook size={20} color="#1877F2" /> 
                <span>Facebook</span>
              </button>
              <button 
                type="button"
                className={styles['share-option-btn']}
                onClick={() => handleSharePlatform('twitter')}
                title="Share on Twitter / X"
              >
                <FaTwitter size={20} color="#1DA1F2" /> 
                <span>Twitter</span>
              </button>
              <button 
                type="button"
                className={styles['share-option-btn']}
                onClick={() => handleSharePlatform('embed')}
                title="Copy Embed HTML"
              >
                <FaCode size={20} color="#222" /> 
                <span>Embed</span>
              </button>
              <button 
                type="button"
                className={`${styles['share-option-btn']} ${styles['share-more-btn']}`}
                onClick={() => handleSharePlatform('more')}
                title="More sharing options"
              >
                <FaEllipsisH size={20} color="#222" /> 
                <span>More options</span>
              </button>
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
              <button className={styles['wishlist-create-btn']} onClick={handleCreateWishlist}>Create</button>
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
               <div style={{ whiteSpace: 'pre-line', marginBottom: '20px' }}>
                 {description}
               </div>
               
               <h3>The space</h3>
               <p>{type} located in {city}. Featuring {bedroomsCount} bedrooms and {bathroomsCount} bathrooms, accommodating up to {maxAllowedGuests} guests comfortably.</p>
               
               <h3>Guest access</h3>
               <p>Guests will have complete and private access to the entire {type.toLowerCase()} and all listed amenities.</p>

               <h3>Other things to note</h3>
               <p>Please review our house rules and check-in times before arrival. Carry a valid photo ID proof for seamless check-in.</p>
            </div>
          </div>
        </div>
      )}

      {/* What this place offers (Amenities) Modal */}
      {isAmenitiesModalOpen && (
        <div 
          className={`${styles['modal-overlay']} ${isAmenitiesModalClosing ? styles.closing : ''}`} 
          onClick={closeAmenitiesModal}
        >
          <div 
            className={`${styles['amenities-modal']} ${isAmenitiesModalClosing ? styles.closing : ''}`} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles['amenities-modal-header']}>
              <button className={styles['share-close-btn']} onClick={closeAmenitiesModal}>
                <FaTimes size={16} />
              </button>
            </div>
            
            <div className={styles['amenities-modal-body']}>
              <h2 className={styles['amenities-modal-title']}>What this place offers</h2>
              
              {dynamicAmenitiesCategories.map((group, gIdx) => (
                <div key={gIdx} className={styles['amenity-category-block']}>
                  <h3 className={styles['amenity-category-heading']}>{group.category}</h3>
                  <div>
                    {group.items.map((item, iIdx) => (
                      <div key={iIdx} className={styles['amenity-modal-row']}>
                        <div className={styles['amenity-modal-icon']}>
                          {getAmenityIcon(item.name, item.notIncluded)}
                        </div>
                        <div>
                          <div className={`${styles['amenity-modal-name']} ${item.notIncluded ? styles['amenity-not-included-text'] : ''}`}>
                            {item.name}
                          </div>
                          {item.sublabel && (
                            <div className={styles['amenity-modal-sublabel']}>
                              {item.sublabel}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
