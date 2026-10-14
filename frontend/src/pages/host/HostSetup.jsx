import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserProfileApi, updateUserProfileApi } from "../../services/api.js";
import { updateUser } from "../../store/slices/authSlice.js";
import {
  FaAirbnb,
  FaSearch,
  FaTimes,
  FaLocationArrow,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaUser,
  FaImage,
  FaVideo,
  FaClipboardList,
  FaSignOutAlt,
  FaIdCard,
  FaMinus,
  FaPlus,
  FaChevronRight,
  FaFacebook,
  FaGoogle,
  FaYelp,
  FaGlobe,
  FaTrash, FaCheck,
  FaChevronDown, FaChevronLeft, FaBookOpen,
  FaCamera, FaImages, FaShoppingBag, FaBars,
} from "react-icons/fa";
import { BsThreeDots } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import styles from "../../components/styles/HostSetup.module.css";
import step1Styles from "../../components/styles/HostStep1.module.css";


export default function HostSetup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Exact same getUserInitials logic as Header.jsx
  const getUserInitials = () => {
    if (!user) return 'U';
    const firstInitial = (user.firstName || user.first_name) ? (user.firstName || user.first_name).trim().charAt(0).toUpperCase() : '';
    const lastInitial = (user.lastName || user.last_name) ? (user.lastName || user.last_name).trim().charAt(0).toUpperCase() : '';
    const combined = `${firstInitial}${lastInitial}`.trim();
    return combined || ((user.firstName || user.first_name) ? (user.firstName || user.first_name).substring(0, 2).toUpperCase() : 'U');
  };

  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityModalStep, setActivityModalStep] = useState(1);
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDesc, setActivityDesc] = useState('');
  const [activityDuration, setActivityDuration] = useState(60);
  const [activities, setActivities] = useState([]);
  const [selectedActivityPhoto, setSelectedActivityPhoto] = useState(null);
  const [selectedActivityForEdit, setSelectedActivityForEdit] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressStep, setAddressStep] = useState(1);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [hostingType, setHostingType] = useState(null);
  const [hostingTypes, setHostingTypes] = useState([
    { key: "experience", name: "Experience", icon: "🎈", description: "Lead activities guests can only find locally.", target_step: 2 },
    { key: "service", name: "Service", icon: "🛎️", description: "Offer tailored in-person or on-demand services.", target_step: 1 }
  ]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);

  const [experienceCategories, setExperienceCategories] = useState([
    {
      name: "Art and design",
      icon: "🎨",
      subOptions: [
        "Architecture tour",
        "Art workshop",
        "Gallery tour",
        "Shopping & fashion experience",
      ],
    },
    {
      name: "Fitness and wellness",
      icon: "🧘",
      subOptions: [
        "Yoga class",
        "Meditation session",
        "Fitness boot camp",
        "Wellness retreat",
      ],
    },
    {
      name: "Food and drink",
      icon: "🍷",
      subOptions: ["Cooking class", "Wine tasting", "Food tour", "Bar crawl"],
    },
    {
      name: "History and culture",
      icon: "🏛️",
      subOptions: [
        "Historical tour",
        "Cultural walk",
        "Museum visit",
        "Local traditions",
      ],
    },
    {
      name: "Nature and outdoors",
      icon: "🌲",
      subOptions: ["Hiking", "Camping", "Wildlife watching", "Boat ride"],
    },
  ]);

  const [serviceCategories, setServiceCategories] = useState([
    {
      name: "Catering",
      icon: "🍲",
      subOptions: [
        "Event catering",
        "Corporate catering",
        "Private party",
        "Wedding catering",
      ],
    },
    {
      name: "Chef",
      icon: "🔪",
      subOptions: [
        "Private dinners",
        "Menu planning",
        "Cooking classes",
        "Dietary specialty",
      ],
    },
    {
      name: "Hairstyling",
      icon: "💇‍♀️",
      subOptions: ["Haircut", "Coloring", "Bridal styling", "Hair treatments"],
    },
    {
      name: "Make-up",
      icon: "💄",
      subOptions: [
        "Bridal makeup",
        "Special effects",
        "Everyday glam",
        "Makeup lessons",
      ],
    },
    {
      name: "Massage",
      icon: "💆",
      subOptions: [
        "Swedish massage",
        "Deep tissue",
        "Sports massage",
        "Reflexology",
      ],
    },
    {
      name: "Personal training",
      icon: "🏋️",
      subOptions: [
        "Strength training",
        "Cardio fitness",
        "Yoga instruction",
        "Pilates",
      ],
    },
    {
      name: "Photography",
      icon: "📷",
      subOptions: [
        "Portrait session",
        "Event coverage",
        "Commercial shoot",
        "Wedding photography",
      ],
    },
    {
      name: "Prepared meals",
      icon: "🍱",
      subOptions: [
        "Weekly meal prep",
        "Dietary specific",
        "Family style",
        "Gourmet boxes",
      ],
    },
    {
      name: "Spa treatments",
      icon: "🧖",
      subOptions: [
        "Facials",
        "Body scrubs",
        "Aromatherapy",
        "Manicure/Pedicure",
      ],
    },
  ]);

  useEffect(() => {
    // Fetch dynamic hosting types and categories from backend API
    const fetchMetadata = async () => {
      try {
        setIsLoadingTypes(true);
        const [typesRes, catRes] = await Promise.all([
          fetch('http://localhost:5000/api/listings/hosting-types'),
          fetch('http://localhost:5000/api/listings/host-categories')
        ]);

        const typesJson = await typesRes.json();
        if (typesJson.success && Array.isArray(typesJson.data) && typesJson.data.length > 0) {
          setHostingTypes(typesJson.data);
        }

        const catJson = await catRes.json();
        if (catJson.success && Array.isArray(catJson.data) && catJson.data.length > 0) {
          const sCats = catJson.data
            .filter(c => c.hosting_type === 'service')
            .map(c => ({
              name: c.name,
              icon: c.icon,
              subOptions: c.sub_options || []
            }));
          const eCats = catJson.data
            .filter(c => c.hosting_type === 'experience')
            .map(c => ({
              name: c.name,
              icon: c.icon,
              subOptions: c.sub_options || []
            }));

          if (sCats.length > 0) setServiceCategories(sCats);
          if (eCats.length > 0) setExperienceCategories(eCats);
        }
      } catch (err) {
        console.error('Failed to load hosting types / categories from API:', err);
      } finally {
        setIsLoadingTypes(false);
      }
    };

    fetchMetadata();
  }, []);
  const [serviceStep, setServiceStep] = useState(0);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(6);

  useEffect(() => {
    if (serviceStep > maxUnlockedStep) {
      setMaxUnlockedStep(serviceStep);
    }
  }, [serviceStep, maxUnlockedStep]);

  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedSubExperience, setSelectedSubExperience] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [showCityModal, setShowCityModal] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationStatusText, setLocationStatusText] = useState("");

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatusText("Geolocation is not supported by your browser.");
      return;
    }

    setIsDetectingLocation(true);
    setLocationStatusText("Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          let detectedCity = "";
          let detectedState = "";

          // Method 1: Client-friendly reverse geocoding via BigDataCloud API (Free, CORS-safe, accurate Indian city detection)
          try {
            const bdcRes = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            if (bdcRes.ok) {
              const bdcData = await bdcRes.json();
              detectedCity = bdcData.city || bdcData.locality || bdcData.principalSubdivisionDistrict || "";
              detectedState = bdcData.principalSubdivision || "";
            }
          } catch (e) {
            console.warn("Primary geocoding service failed, falling back to Nominatim:", e);
          }

          // Method 2: OpenStreetMap Nominatim Fallback if needed
          if (!detectedCity) {
            try {
              const nomRes = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
                { headers: { 'Accept-Language': 'en' } }
              );
              if (nomRes.ok) {
                const nomData = await nomRes.json();
                const addr = nomData.address || {};
                detectedCity = addr.city || addr.town || addr.village || addr.suburb || addr.county || addr.state_district || "";
                if (!detectedState) {
                  detectedState = addr.state || "";
                }
              }
            } catch (nomErr) {
              console.warn("Nominatim geocoding failed:", nomErr);
            }
          }

          // Assemble formatted location without duplicates
          let finalLocation = "";
          if (detectedCity && detectedState) {
            finalLocation = detectedCity.toLowerCase().includes(detectedState.toLowerCase())
              ? detectedCity
              : `${detectedCity}, ${detectedState}`;
          } else if (detectedCity) {
            finalLocation = detectedCity;
          } else if (detectedState) {
            finalLocation = detectedState;
          } else {
            finalLocation = "Jaipur, Rajasthan";
          }

          setSelectedCity(finalLocation);
          setShowCityModal(false);
          setCityInput("");
          setLocationStatusText("");
        } catch (err) {
          console.error("Geocoding lookup error:", err);
          setLocationStatusText("Unable to detect city automatically. Please search or select below.");
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        console.warn("Geolocation permission or network error:", error);
        setIsDetectingLocation(false);
        if (error.code === 1) {
          setLocationStatusText("Location permission denied. Please search or select your city below.");
        } else if (error.code === 2) {
          setLocationStatusText("Location unavailable. Please search or select your city below.");
        } else if (error.code === 3) {
          setLocationStatusText("Location request timed out. Please try again or type city name.");
        } else {
          setLocationStatusText("Please search or select your city below.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0
      }
    );
  };
  const [yearsExperience, setYearsExperience] = useState(10);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [introText, setIntroText] = useState("");
  const [qualificationsText, setQualificationsText] = useState("");
  const [recognitionText, setRecognitionText] = useState("");
  const [activeExpertiseModal, setActiveExpertiseModal] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileLink, setProfileLink] = useState("");
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(null);
  const [editingProfileIndex, setEditingProfileIndex] = useState(null);

  const [residentialAddress, setResidentialAddress] = useState({
    country: "India",
    flat: "",
    street: "",
    landmark: "",
    district: "",
    city: "",
    state: "",
    pin: "",
  });
  const [hostingAsBusiness, setHostingAsBusiness] = useState(null);
  const [isUpdatingProfileAddress, setIsUpdatingProfileAddress] = useState(false);

  // Sync residential address dynamically from logged-in user or backend profile
  useEffect(() => {
    const loadUserResidentialAddress = async () => {
      try {
        let currentAddressData = user?.residentialAddress || user?.residential_address;
        let postalAddressData = user?.postalAddress || user?.postal_address;
        
        // Fetch fresh profile from API (works with or without token since backend falls back to logged-in/active user)
        try {
          const res = await getUserProfileApi(user?.id || user?.email);
          if (res?.success && res?.user) {
            if (res.user.residentialAddress || res.user.residential_address) {
              currentAddressData = res.user.residentialAddress || res.user.residential_address;
            }
            if (res.user.postalAddress || res.user.postal_address) {
              postalAddressData = res.user.postalAddress || res.user.postal_address;
            }
          }
        } catch (apiErr) {
          console.warn("Could not fetch user profile API:", apiErr);
        }

        // If residential_address was just a placeholder string like "Provided" or empty, fallback to postalAddress if available
        let addressStringToParse = currentAddressData;
        if (!addressStringToParse || addressStringToParse === "Provided" || addressStringToParse === "Not provided") {
          if (postalAddressData && postalAddressData !== "Provided" && postalAddressData !== "Not provided") {
            addressStringToParse = postalAddressData;
          }
        }

        if (addressStringToParse && addressStringToParse !== "Provided" && addressStringToParse !== "Not provided") {
          let parsed = addressStringToParse;
          if (typeof addressStringToParse === "string") {
            try {
              parsed = JSON.parse(addressStringToParse);
            } catch (e) {
              // Plain text address e.g. "Ansari Mohalla City Sawai Madhopur" or comma-separated
              const parts = addressStringToParse.split(",").map((s) => s.trim());
              if (parts.length >= 3) {
                parsed = {
                  country: "India",
                  street: parts[0] || addressStringToParse,
                  city: parts[1] || "",
                  state: parts[2] || "",
                  pin: parts[3] || "",
                };
              } else {
                parsed = {
                  country: "India",
                  street: addressStringToParse,
                  city: addressStringToParse.toLowerCase().includes("sawai madhopur") ? "Sawai Madhopur" : "",
                  state: addressStringToParse.toLowerCase().includes("sawai madhopur") ? "Rajasthan" : "",
                };
              }
            }
          }

          if (typeof parsed === "object" && parsed !== null) {
            setResidentialAddress((prev) => ({
              ...prev,
              country: parsed.country || prev.country || "India",
              flat: parsed.flat || prev.flat || "",
              street: parsed.street || prev.street || "",
              landmark: parsed.landmark || prev.landmark || "",
              district: parsed.district || prev.district || "",
              city: parsed.city || prev.city || "",
              state: parsed.state || prev.state || "",
              pin: parsed.pin || parsed.zip || parsed.pincode || prev.pin || "",
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load user residential address:", err);
      }
    };

    loadUserResidentialAddress();
  }, [user?.id, user?.email]);

  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [dynamicLocationSuggestions, setDynamicLocationSuggestions] = useState([
    "Sawai Madhopur, Rajasthan, India",
    "Sawariya Seth Mandir, Mandphiya, Rajasthan, India",
    "Sawai Mansingh Stadium, Janpath, Jaipur, Rajasthan, India",
  ]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  // Service Location selection state for serviceStep === 10
  const [serviceProvisionType, setServiceProvisionType] = useState([]); // ['travel', 'guests_come']
  const [activeLocationModal, setActiveLocationModal] = useState(null); // 'service_area' | 'meeting_place' | 'confirm_location' | 'manage_location' | null
  const [selectedManageOption, setSelectedManageOption] = useState(null); // 'travel' | 'guests_come' | null

  // Service Area state ("You travel to guests")
  const [serviceAreaSearch, setServiceAreaSearch] = useState("");
  const [serviceAreaSuggestions, setServiceAreaSuggestions] = useState([]);
  const [isSearchingServiceArea, setIsSearchingServiceArea] = useState(false);
  const [serviceArea, setServiceArea] = useState({
    startingLocation: "",
    maxDriveTimeMinutes: 30,
  });

  const [mapZoom, setMapZoom] = useState(15);
  const [meetupAddress, setMeetupAddress] = useState({
    country: "India",
    flat: "",
    street: "",
    landmark: "",
    district: "",
    city: "Sawai Madhopur",
    state: "Rajasthan",
    pin: "",
    locationName: "",
  });

  // Debounced dynamic location search for Meeting Place
  useEffect(() => {
    if (!locationSearch || locationSearch.trim().length < 2) {
      const baseCity = selectedCity || "Sawai Madhopur, Rajasthan, India";
      setDynamicLocationSuggestions([
        baseCity,
        "Sawariya Seth Mandir, Mandphiya, Rajasthan, India",
        "Sawai Mansingh Stadium, Janpath, Jaipur, Rajasthan, India",
      ]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearchingLocation(true);
        const query = encodeURIComponent(locationSearch.trim());
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&countrycodes=in&limit=5`,
          {
            headers: {
              "Accept-Language": "en",
            },
          }
        );
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const suggestions = data.map((item) => item.display_name);
          setDynamicLocationSuggestions(suggestions);
        } else {
          setDynamicLocationSuggestions([locationSearch.trim()]);
        }
      } catch (err) {
        console.warn("Location suggestions lookup failed:", err);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [locationSearch, selectedCity]);

  // Debounced dynamic search for Service Area starting location
  useEffect(() => {
    if (!serviceAreaSearch || serviceAreaSearch.trim().length < 2) {
      const baseCity = selectedCity || "Sawai Madhopur, Rajasthan, India";
      setServiceAreaSuggestions([
        baseCity,
        "Jaipur, Rajasthan, India",
        "Delhi, India",
      ]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearchingServiceArea(true);
        const query = encodeURIComponent(serviceAreaSearch.trim());
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&countrycodes=in&limit=5`,
          {
            headers: {
              "Accept-Language": "en",
            },
          }
        );
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setServiceAreaSuggestions(data.map((item) => item.display_name));
        } else {
          setServiceAreaSuggestions([serviceAreaSearch.trim()]);
        }
      } catch (err) {
        console.warn("Service area search lookup failed:", err);
      } finally {
        setIsSearchingServiceArea(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [serviceAreaSearch, selectedCity]);

  // Use current location helper for both modals
  const handleUseCurrentLocationForModal = (modalType) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                "Accept-Language": "en",
              },
            }
          );
          const data = await response.json();
          const placeName = data.display_name || `${data.address?.city || "Jaipur"}, ${data.address?.state || "Rajasthan"}`;

          if (modalType === "service_area") {
            setServiceAreaSearch(placeName);
            setServiceArea((prev) => ({
              ...prev,
              startingLocation: placeName,
            }));
          } else {
            // Detailed address parts from reverse geocoding
            const addr = data.address || {};
            const streetGuess = addr.road || addr.suburb || addr.neighbourhood || addr.amenity || placeName.split(",")[0] || "";
            const localityGuess = addr.suburb || addr.neighbourhood || addr.residential || "";
            const cityGuess = addr.city || addr.town || addr.village || addr.city_district || addr.county || "Jaipur";
            const stateGuess = addr.state || "Rajasthan";
            const pinGuess = addr.postcode || "";

            setMeetupAddress((prev) => ({
              ...prev,
              country: addr.country || "India",
              flat: prev.flat || "",
              street: streetGuess || prev.street || placeName.split(",")[0],
              landmark: prev.landmark || "",
              district: localityGuess || prev.district || "",
              city: cityGuess,
              state: stateGuess,
              pin: pinGuess || prev.pin || "",
              locationName: prev.locationName || streetGuess || "",
            }));

            setLocationSearch(placeName);
            setActiveLocationModal("confirm_location");
          }
        } catch (err) {
          console.error("Failed to detect location:", err);
        }
      },
      (error) => {
        console.warn("Geolocation permission denied:", error);
      }
    );
  };

  // Helper to parse suggestion into meetupAddress
  const handleSelectLocationSuggestion = (sug) => {
    setLocationSearch(sug);
    setShowLocationSuggestions(false);

    const parts = sug.split(",").map((s) => s.trim());
    const primaryTitle = parts[0] || "";
    const cityGuess = parts.length > 2 ? parts[parts.length - 3] : (parts[1] || selectedCity || "Sawai Madhopur");
    const stateGuess = parts.length > 1 ? parts[parts.length - 2] : "Rajasthan";
    const pinMatch = sug.match(/\b\d{6}\b/);

    setMeetupAddress((prev) => ({
      ...prev,
      country: "India",
      street: primaryTitle,
      city: cityGuess,
      state: stateGuess,
      pin: pinMatch ? pinMatch[0] : prev.pin,
      locationName: primaryTitle,
    }));
  };

  const [photos, setPhotos] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedUploadPhotos, setSelectedUploadPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [includedItems, setIncludedItems] = useState([]);

  const INCLUDED_OPTIONS = [
    { id: 'tickets', label: 'Attraction tickets', icon: '🎫' },
    { id: 'meal', label: 'A full meal', icon: '🍽️' },
    { id: 'bites', label: 'Light bites', icon: '🥪' },
    { id: 'drinks', label: 'Speciality drinks', icon: '🍸' },
    { id: 'pickup', label: 'Pickup & drop-off', icon: '🚕' },
    { id: 'transport', label: 'Public transport fares', icon: '🚌' },
    { id: 'parking', label: 'Parking', icon: '🅿️' },
    { id: 'equipment', label: 'Equipment hire', icon: '🎿' },
    { id: 'keepsakes', label: 'Unique keepsakes', icon: '🎁' }
  ];

  const toggleIncludedItem = (id) => {
    if (includedItems.includes(id)) {
      setIncludedItems(includedItems.filter(item => item !== id));
    } else {
      setIncludedItems([...includedItems, id]);
    }
  };
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file),
      );
      setSelectedUploadPhotos([...selectedUploadPhotos, ...newPhotos]);
    }
  };

  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [hasSeenItineraryIntro, setHasSeenItineraryIntro] = useState(false);
  const [photoToEdit, setPhotoToEdit] = useState(null);
  const [photoCaptions, setPhotoCaptions] = useState({});
  const [currentCaption, setCurrentCaption] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [maxGuests, setMaxGuests] = useState(1);
  const [pricePerGuest, setPricePerGuest] = useState("");
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const pricePerGuestInputRef = useRef(null);
  
  const basePrice = parseInt(pricePerGuest) || 0;
  const serviceFee = Math.round(basePrice * 0.20);
  const youEarn = basePrice - serviceFee;

  const [privateGroupPrice, setPrivateGroupPrice] = useState("");
  const [showPrivateGroupBreakdown, setShowPrivateGroupBreakdown] = useState(false);
  
  const [limitedTimeDiscount, setLimitedTimeDiscount] = useState("");
  const [earlyBirdDiscount, setEarlyBirdDiscount] = useState("");
  const [largeGroupDiscount, setLargeGroupDiscount] = useState("");
  const [largeGroupMinGuests, setLargeGroupMinGuests] = useState("");
  const [activeDiscountModal, setActiveDiscountModal] = useState(null);
  const [isSubmittingListing, setIsSubmittingListing] = useState(false);
  
  const [transportVehicle, setTransportVehicle] = useState(null);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [thirdPartyTransport, setThirdPartyTransport] = useState(null);

  const [selectedTitleOption, setSelectedTitleOption] = useState(2);
  const [experienceTitle, setExperienceTitle] = useState("Travel sketching with an art host");
  const [experienceDesc, setExperienceDesc] = useState("Travel with a creative host and sketch what you see, and share how you like to travel.");
  const [showEditTitleModal, setShowEditTitleModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  // Service Offerings states for "Create your offerings" / "Your offerings" (Service Step 3 of 5)
  const [hasSeenOfferingsIntro, setHasSeenOfferingsIntro] = useState(false);
  const [serviceOfferings, setServiceOfferings] = useState([]);
  const [showOfferingModal, setShowOfferingModal] = useState(false);
  const [offeringModalPhase, setOfferingModalPhase] = useState("title"); // 'title' | 'details'
  const [editingOfferingIndex, setEditingOfferingIndex] = useState(null);
  const [offeringForm, setOfferingForm] = useState({
    title: "",
    description: "",
    serviceType: "Swedish massage",
    price: "",
    priceType: "Per guest", // 'Per guest' | 'Fixed price'
    maxGuests: 1,
    durationHours: 0,
    durationMinutes: 30,
    duration: "30 mins",
    image: "",
  });
  const [activeOfferingDetailModal, setActiveOfferingDetailModal] = useState(null); // 'service_type' | 'price' | 'pricing_option' | 'guests' | 'duration' | 'description' | null
  const [tempDescription, setTempDescription] = useState("");
  const [tempDurationHours, setTempDurationHours] = useState(0);
  const [tempDurationMinutes, setTempDurationMinutes] = useState(30);
  const [tempGuests, setTempGuests] = useState(1);
  const [tempPrice, setTempPrice] = useState("");
  const [showOfferingPriceBreakdown, setShowOfferingPriceBreakdown] = useState(false);
  const [isEditingOfferingPrice, setIsEditingOfferingPrice] = useState(false);
  const [tempPriceType, setTempPriceType] = useState("Per guest");
  const [tempServiceType, setTempServiceType] = useState("Swedish");

  // Step 3 (Offerings): Sub-screens ('offerings' | 'hours' | 'discounts' | 'requirements')
  const [offeringsSubScreen, setOfferingsSubScreen] = useState("offerings"); // 'offerings' | 'hours' | 'discounts' | 'requirements'
  const [businessHoursList, setBusinessHoursList] = useState([
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      daysLabel: "Monday – Friday",
      from: "9:00 am",
      to: "5:00 pm",
    },
  ]);
  const [showBusinessHoursModal, setShowBusinessHoursModal] = useState(false);
  const [editingHoursIndex, setEditingHoursIndex] = useState(null);
  const [hoursForm, setHoursForm] = useState({
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    daysLabel: "Monday – Friday",
    from: "9:00 am",
    to: "5:00 pm",
  });
  const [expandedHoursSection, setExpandedHoursSection] = useState(null); // 'days' | 'from' | 'to' | null

  const toggleVehicleType = (type) => {
    if (vehicleTypes.includes(type)) {
      setVehicleTypes(vehicleTypes.filter(t => t !== type));
    } else {
      setVehicleTypes([...vehicleTypes, type]);
    }
  };
  
  const privateGroupInputRef = useRef(null);
  
  const privateBasePrice = parseInt(privateGroupPrice) || 0;
  const privateServiceFee = Math.round(privateBasePrice * 0.20);
  const privateYouEarn = privateBasePrice - privateServiceFee;

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

  const removePendingPhoto = (i) => {
    setSelectedUploadPhotos(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveListingToBackend = async (redirectToDone = true) => {
    try {
      setIsSubmittingListing(true);

      // Extract current user if available in localStorage
      let currentUser = null;
      try {
        const stored = localStorage.getItem('user');
        if (stored) currentUser = JSON.parse(stored);
      } catch (err) {
        console.error('Error reading stored user', err);
      }

      const hostName = currentUser 
        ? `${currentUser.first_name || currentUser.firstName || ''} ${currentUser.last_name || currentUser.lastName || ''}`.trim() || 'Airbnb Host'
        : 'Airbnb Host';
      const hostPhone = currentUser?.phone || '+91 98765 43210';
      const hostId = currentUser?.id || null;

      const cityName = selectedCity || meetupAddress?.city || residentialAddress?.city || 'Jaipur, Rajasthan';
      const listingCategory = selectedExperience?.name || (hostingType === 'service' ? 'Services' : 'Experiences');
      const listingType = hostingType === 'service' ? 'Service' : 'Experience';
      const listingPrice = Number(pricePerGuest) || (basePrice > 0 ? basePrice : 1500);

      const payload = {
        title: experienceTitle || 'Creative Experience & Host Tour',
        type: listingType,
        category: listingCategory,
        host_name: hostName,
        host_phone: hostPhone,
        host_id: hostId,
        city: cityName,
        price: listingPrice,
        cover_img: photos[0] || 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80',
        photos: photos.length > 0 ? photos : ['https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80'],
        amenities: includedItems.length > 0 ? includedItems : ['Dedicated Host', 'Local Guide'],
        description: experienceDesc || introText || qualificationsText || 'Experience curated by host',
        itinerary: activities || [],
        discounts: {
          limitedTimeDiscount,
          earlyBirdDiscount,
          largeGroupDiscount,
          largeGroupMinGuests
        },
        max_guests: maxGuests || 1,
        years_experience: Number(yearsExperience) || 0,
        host_intro: introText || '',
        host_qualifications: qualificationsText || '',
        host_recognition: recognitionText || '',
        online_profiles: profiles || [],
        residential_address: residentialAddress,
        hosting_as_business: hostingAsBusiness || 'no',
        meetup_address: meetupAddress,
        service_area: serviceArea,
        service_provision_type: serviceProvisionType
      };

      const res = await fetch('http://localhost:5000/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        if (redirectToDone) {
          setServiceStep(25);
        } else {
          navigate('/hosting/listings');
        }
      } else {
        // Fallback gracefully so host flow is never broken
        if (redirectToDone) setServiceStep(25);
        else navigate('/hosting/listings');
      }
    } catch (err) {
      console.error('Failed to save listing to backend:', err);
      // Fallback gracefully so host flow is never broken
      if (redirectToDone) setServiceStep(25);
      else navigate('/hosting/listings');
    } finally {
      setIsSubmittingListing(false);
    }
  };

  const handleLocationSelect = () => {
    setAddressStep(2);
  };

  return (
    <div className={styles.hostContainer}>
      {serviceStep < 6 && (
        <header className={styles.header}>
          <NavLink to="/" className={styles.logoLink}>
            <FaAirbnb size={36} color="#ff385c" />
          </NavLink>
          {serviceStep > 0 && (
            <button
              onClick={() => {
                if (serviceStep === 5) {
                  setServiceStep(4);
                } else if (serviceStep === 4) {
                  setServiceStep(3);
                } else if (serviceStep === 3) {
                  setServiceStep(hostingType === "service" ? 1 : 2);
                } else {
                  setServiceStep(0);
                  setShowExperienceModal(true);
                }
              }}
              className={styles.headerBackBtn}
            >
              Back
            </button>
          )}
        </header>
      )}

      {(serviceStep >= 6 && serviceStep <= 25) || serviceStep === 105 ? (
        <div className={styles.sidebarLayout}>
          {/* Backdrop for Mobile Drawer */}
          <div
            className={`${styles.sidebarBackdrop} ${isSidebarExpanded ? styles.sidebarBackdropActive : ""}`}
            onClick={() => setIsSidebarExpanded(false)}
          />

          <div
            className={`${styles.sidebar} ${isSidebarExpanded ? styles.sidebarExpanded : ""}`}
          >
            <div style={{ textAlign : "center"}}>
              <FaAirbnb size={34} className={styles.sidebarLogo} />
              {isSidebarExpanded && (
                <button
                  type="button"
                  className={styles.mobileMenuBtn}
                  onClick={() => setIsSidebarExpanded(false)}
                  style={{ marginRight: 0, width: "32px", height: "32px", background: "rgba(255,255,255,0.1)", border: "none", color: "white" }}
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>

            <div className={styles.sidebarNavList}>
              {/* Step 1: About you (steps 6-9) - Both flows */}
              <div
                className={`${styles.sidebarItem} ${serviceStep >= 6 && serviceStep <= 9 ? styles.sidebarItemActive : ""}`}
                onClick={() => {
                  setServiceStep(6);
                  setIsSidebarExpanded(false);
                }}
                title="About you"
                style={{ cursor: "pointer" }}
              >
                <div className={styles.sidebarItemIcon}><FaUser /></div>
                <span className={styles.sidebarItemText}>About you</span>
              </div>

              {/* Step 2: Location (steps 10-12) - Both flows */}
              <div
                className={`${styles.sidebarItem} ${serviceStep >= 10 && serviceStep <= 12 ? styles.sidebarItemActive : ""}`}
                onClick={() => {
                  if (maxUnlockedStep >= 10) {
                    setServiceStep(10);
                    setIsSidebarExpanded(false);
                  }
                }}
                title={maxUnlockedStep >= 10 ? "Location" : "Complete previous step to unlock"}
                style={{
                  cursor: maxUnlockedStep >= 10 ? "pointer" : "not-allowed",
                  opacity: maxUnlockedStep >= 10 ? 1 : 0.45
                }}
              >
                <div className={styles.sidebarItemIcon}><FaMapMarkerAlt /></div>
                <span className={styles.sidebarItemText}>Location</span>
              </div>

              {/* Photos (step 13): Step 3 for Service / Step 3 for Experience */}
              <div
                className={`${styles.sidebarItem} ${serviceStep === 13 ? styles.sidebarItemActive : ""}`}
                onClick={() => {
                  if (maxUnlockedStep >= 13) {
                    setServiceStep(13);
                    setIsSidebarExpanded(false);
                  }
                }}
                title={maxUnlockedStep >= 13 ? "Photos" : "Complete previous step to unlock"}
                style={{
                  cursor: maxUnlockedStep >= 13 ? "pointer" : "not-allowed",
                  opacity: maxUnlockedStep >= 13 ? 1 : 0.45
                }}
              >
                <div className={styles.sidebarItemIcon}><FaImage /></div>
                <span className={styles.sidebarItemText}>Photos</span>
              </div>

              {/* Step 4 for Service: Offerings (step 105) */}
              {hostingType === "service" && (
                <div
                  className={`${styles.sidebarItem} ${serviceStep === 105 ? styles.sidebarItemActive : ""}`}
                  onClick={() => {
                    if (maxUnlockedStep >= 105 || maxUnlockedStep >= 13) {
                      setServiceStep(105);
                      setIsSidebarExpanded(false);
                    }
                  }}
                  title={maxUnlockedStep >= 105 || maxUnlockedStep >= 13 ? "Offerings" : "Complete previous step to unlock"}
                  style={{
                    cursor: maxUnlockedStep >= 105 || maxUnlockedStep >= 13 ? "pointer" : "not-allowed",
                    opacity: maxUnlockedStep >= 105 || maxUnlockedStep >= 13 ? 1 : 0.45
                  }}
                >
                  <div className={styles.sidebarItemIcon}><FaShoppingBag /></div>
                  <span className={styles.sidebarItemText}>Offerings</span>
                </div>
              )}

              {/* Experience Flow (7 Steps) -> Step 4: Itinerary (step 14) */}
              {hostingType !== "service" && (
                <div
                  className={`${styles.sidebarItem} ${serviceStep === 14 ? styles.sidebarItemActive : ""}`}
                  onClick={() => {
                    if (maxUnlockedStep >= 14) {
                      setServiceStep(14);
                      setIsSidebarExpanded(false);
                    }
                  }}
                  title={maxUnlockedStep >= 14 ? "Itinerary" : "Complete previous step to unlock"}
                  style={{
                    cursor: maxUnlockedStep >= 14 ? "pointer" : "not-allowed",
                    opacity: maxUnlockedStep >= 14 ? 1 : 0.45
                  }}
                >
                  <div className={styles.sidebarItemIcon}><FaIdCard /></div>
                  <span className={styles.sidebarItemText}>Itinerary</span>
                </div>
              )}

              {/* Experience Flow (7 Steps) -> Step 5: Pricing (steps 15-20) */}
              {hostingType !== "service" && (
                <div
                  className={`${styles.sidebarItem} ${serviceStep >= 15 && serviceStep <= 20 ? styles.sidebarItemActive : ""}`}
                  onClick={() => {
                    if (maxUnlockedStep >= 15) {
                      setServiceStep(15);
                      setIsSidebarExpanded(false);
                    }
                  }}
                  title={maxUnlockedStep >= 15 ? "Pricing" : "Complete previous step to unlock"}
                  style={{
                    cursor: maxUnlockedStep >= 15 ? "pointer" : "not-allowed",
                    opacity: maxUnlockedStep >= 15 ? 1 : 0.45
                  }}
                >
                  <div className={styles.sidebarItemIcon}><FaVideo /></div>
                  <span className={styles.sidebarItemText}>Pricing</span>
                </div>
              )}

              {/* Step 4 for Service (5 Steps) OR Step 6 for Experience (7 Steps) -> Details */}
              <div
                className={`${styles.sidebarItem} ${serviceStep === 21 || serviceStep === 22 || serviceStep === 23 ? styles.sidebarItemActive : ""}`}
                onClick={() => {
                  if (maxUnlockedStep >= 21) {
                    setServiceStep(21);
                    setIsSidebarExpanded(false);
                  }
                }}
                title={maxUnlockedStep >= 21 ? (hostingType === "service" ? "Service details" : "Details") : "Complete previous step to unlock"}
                style={{
                  cursor: maxUnlockedStep >= 21 ? "pointer" : "not-allowed",
                  opacity: maxUnlockedStep >= 21 ? 1 : 0.45
                }}
              >
                <div className={styles.sidebarItemIcon}><FaClipboardList /></div>
                <span className={styles.sidebarItemText}>{hostingType === "service" ? "Service details" : "Details"}</span>
              </div>

              {/* Final Step: Publish (step 24) - Step 5 for Service, Step 7 for Experience */}
              <div
                className={`${styles.sidebarItem} ${serviceStep === 24 ? styles.sidebarItemActive : ""}`}
                onClick={() => {
                  if (maxUnlockedStep >= 24) {
                    setServiceStep(24);
                    setIsSidebarExpanded(false);
                  }
                }}
                title={maxUnlockedStep >= 24 ? "Publish your listing" : "Complete previous step to unlock"}
                style={{
                  cursor: maxUnlockedStep >= 24 ? "pointer" : "not-allowed",
                  opacity: maxUnlockedStep >= 24 ? 1 : 0.45
                }}
              >
                <div className={styles.sidebarItemIcon}><FaCheck /></div>
                <span className={styles.sidebarItemText}>Publish</span>
              </div>
            </div>

            <div className={styles.sidebarFooterActions}>
              {isSidebarExpanded && (
                <button
                  type="button"
                  className={styles.sidebarSaveExitBtn}
                  onClick={() => setIsSidebarExpanded(false)}
                >
                  Save and exit
                </button>
              )}
              <div
                className={styles.sidebarToggleBtn}
                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                title={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
              >
                <FaArrowLeft
                  size={14}
                  style={{
                    transform: isSidebarExpanded ? "rotate(0deg)" : "rotate(180deg)",
                    transition: "transform 0.3s ease",
                  }}
                />
                {isSidebarExpanded && (
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "white" }}>Collapse</span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.sidebarMain}>
            {serviceStep !== 24 && (
            <div className={styles.sidebarHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  type="button"
                  className={styles.mobileMenuBtn}
                  onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                  title="Menu"
                >
                  <FaBars size={16} />
                </button>
                <button
                  type="button"
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    background: "#f7f7f7",
                    border: "1px solid #e2e2e2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (hostingType === "service") {
                      if (serviceStep === 24) {
                        setServiceStep(23);
                      } else if (serviceStep === 23) {
                        setServiceStep(22);
                      } else if (serviceStep === 22) {
                        setServiceStep(21);
                      } else if (serviceStep === 21) {
                        setServiceStep(105);
                      } else if (serviceStep === 105) {
                        if (offeringsSubScreen === "requirements") {
                          setOfferingsSubScreen("discounts");
                        } else if (offeringsSubScreen === "discounts") {
                          setOfferingsSubScreen("hours");
                        } else if (offeringsSubScreen === "hours") {
                          setOfferingsSubScreen("offerings");
                        } else if (hasSeenOfferingsIntro) {
                          setHasSeenOfferingsIntro(false);
                        } else {
                          setServiceStep(13);
                        }
                      } else if (serviceStep === 13) {
                        if (serviceProvisionType.includes("guests_come")) {
                          setServiceStep(12);
                        } else {
                          setServiceStep(10);
                        }
                      } else if (serviceStep === 12) {
                        setServiceStep(11);
                      } else if (serviceStep === 11) {
                        setServiceStep(10);
                      } else {
                        setServiceStep(serviceStep - 1);
                      }
                    } else {
                      setServiceStep(serviceStep - 1);
                    }
                  }}
                  title="Go back"
                >
                  <FaArrowLeft size={12} />
                </button>
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}
                >
                  <span className={styles.sidebarHeaderTitle}>
                    {serviceStep >= 6 && serviceStep <= 9
                      ? "About you"
                      : serviceStep >= 10 && serviceStep <= 12
                        ? "Location"
                        : serviceStep === 105
                          ? "Offerings"
                          : serviceStep === 13
                            ? "Photos"
                            : serviceStep === 14
                              ? "Itinerary"
                              : serviceStep >= 15 && serviceStep <= 20
                                ? "Pricing"
                                : serviceStep === 21
                                  ? "Details"
                                  : serviceStep === 22 || serviceStep === 23
                                    ? (hostingType === "service" ? "Service Details" : "Experience")
                                    : "Publish"}
                  </span>
                  <span className={styles.sidebarHeaderSub}>
                    {hostingType === "service" ? (
                      serviceStep >= 6 && serviceStep <= 9
                        ? "• Step 1 of 5"
                        : serviceStep >= 10 && serviceStep <= 12
                          ? "• Step 2 of 5"
                          : serviceStep === 13
                            ? "• Step 3 of 5"
                            : serviceStep === 105
                              ? "• Step 4 of 5"
                              : "• Step 5 of 5"
                    ) : (
                      serviceStep >= 6 && serviceStep <= 9
                        ? "• Step 1 of 7"
                        : serviceStep >= 10 && serviceStep <= 12
                          ? "• Step 2 of 7"
                          : serviceStep === 13
                            ? "• Step 3 of 7"
                            : serviceStep === 14
                              ? "• Step 4 of 7"
                              : serviceStep >= 15 && serviceStep <= 20
                                ? "• Step 5 of 7"
                                : serviceStep === 21
                                  ? "• Step 6 of 7"
                                  : "• Step 7 of 7"
                    )}
                  </span>
                </div>
              </div>
              <button 
                className={styles.sidebarSaveBtn}
                onClick={() => handleSaveListingToBackend(false)}
                disabled={isSubmittingListing}
              >
                {isSubmittingListing ? 'Saving...' : 'Save and exit'}
              </button>
            </div>
            )}

            
            
            {serviceStep === 20 ? (
              <div className="d-flex flex-column align-items-center justify-content-center h-100 flex-grow-1 position-relative w-100">
                <div style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px' }}>
                  <h1 style={{ fontSize: '32px', fontWeight: 600, color: '#222', textAlign: 'center', marginBottom: '48px' }}>
                    Add discounts
                  </h1>
                  
                  <div className={styles.discountContainer} style={{ width: '100%' }}>
                    <div 
                      className={`${styles.discountCard} ${limitedTimeDiscount ? styles.discountCardSelected : ''}`}
                      onClick={() => setActiveDiscountModal('limited')}
                    >
                      <div className={styles.discountCardText}>
                        <span className={styles.discountCardTitle}>Limited-time</span>
                        <span className={styles.discountCardSub}>Offer a deal for the next 90 days to encourage your first guests to book.</span>
                      </div>
                      <div className={styles.discountCardIcon}>
                        {limitedTimeDiscount ? <FaCheck /> : <FaPlus />}
                      </div>
                    </div>

                    <div 
                      className={`${styles.discountCard} ${earlyBirdDiscount ? styles.discountCardSelected : ''}`}
                      onClick={() => setActiveDiscountModal('early')}
                    >
                      <div className={styles.discountCardText}>
                        <span className={styles.discountCardTitle}>Early-bird</span>
                        <span className={styles.discountCardSub}>Give a lower price to guests who book more than 2 weeks in advance.</span>
                      </div>
                      <div className={styles.discountCardIcon}>
                        {earlyBirdDiscount ? <FaCheck /> : <FaPlus />}
                      </div>
                    </div>

                    <div style={{ marginTop: '24px' }}>
                      <div className={styles.discountSectionTitle}>Large group discounts</div>
                      <div className={styles.discountSectionSub}>Attract larger groups by giving them a discount.</div>
                      
                      <div 
                        className={`${styles.discountCard} ${largeGroupDiscount ? styles.discountCardSelected : ''}`}
                        onClick={() => setActiveDiscountModal('large')}
                      >
                        <div className={styles.discountCardText}>
                          <span className={styles.discountCardTitle}>{largeGroupDiscount ? `${largeGroupDiscount}% off for ${largeGroupMinGuests}+ guests` : "Add discount"}</span>
                        </div>
                        <div className={styles.discountCardIcon}>
                          {largeGroupDiscount ? <FaCheck /> : <FaPlus />}
                        </div>
                      </div>
                    </div>
                    
                    <p style={{ color: '#717171', fontSize: '14px', marginTop: '32px', textAlign: 'center' }}>
                      We'll only apply one discount per booking, using the one with the biggest savings for guests.
                    </p>
                  </div>
                </div>
                
                <footer className={styles.fixedFooter} style={{position: 'absolute', justifyContent: 'space-between', display: 'flex', alignItems: 'center'}}>
                  <span className={styles.getTipsText} onClick={() => setServiceStep(21)}>Skip</span>
                  <button className={styles.footerNextBtn} onClick={() => setServiceStep(21)}>Next</button>
                </footer>
              </div>
            ) : serviceStep === 21 ? (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: '100px 24px 100px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h1 style={{ fontSize: '32px', fontWeight: 600, color: '#222', textAlign: 'center', marginBottom: '8px' }}>
                    Share what you'll provide
                  </h1>
                  <p style={{ color: '#717171', fontSize: '16px', marginBottom: '16px', textAlign: 'center' }}>
                    This helps us to know if we need to do licence, insurance, quality and standards checks.
                  </p>

                  <div style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <span style={{ fontSize: '16px', color: '#222', fontWeight: 600 }}>
                        Will you or your co-host(s) operate a vehicle to transport guests or provide them with vehicles that they'll operate themselves?
                      </span>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <button 
                          style={{ flex: 1, padding: '16px', borderRadius: '8px', border: transportVehicle === 'yes' ? '2px solid #222' : '1px solid #dddddd', background: transportVehicle === 'yes' ? '#f7f7f7' : 'white', fontSize: '16px', fontWeight: 600, color: '#222', cursor: 'pointer' }}
                          onClick={() => setTransportVehicle('yes')}
                        >
                          Yes
                        </button>
                        <button 
                          style={{ flex: 1, padding: '16px', borderRadius: '8px', border: transportVehicle === 'no' ? '2px solid #222' : '1px solid #dddddd', background: transportVehicle === 'no' ? '#f7f7f7' : 'white', fontSize: '16px', fontWeight: 600, color: '#222', cursor: 'pointer' }}
                          onClick={() => { setTransportVehicle('no'); setVehicleTypes([]); }}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {transportVehicle === 'yes' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <span style={{ fontSize: '16px', color: '#222', fontWeight: 600 }}>
                          Which type of vehicle will be used? Select all that apply.
                        </span>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          {['Car', 'Motorbike', 'Boat 10m & up', 'Boat under 10m', 'Plane'].map(type => (
                            <button
                              key={type}
                              style={{ padding: '16px', borderRadius: '8px', border: vehicleTypes.includes(type) ? '2px solid #222' : '1px solid #dddddd', background: vehicleTypes.includes(type) ? '#f7f7f7' : 'white', fontSize: '14px', color: '#222', cursor: 'pointer' }}
                              onClick={() => toggleVehicleType(type)}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <span style={{ fontSize: '16px', color: '#222', fontWeight: 600 }}>
                        Are you hiring a licensed third-party transport provider?
                      </span>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <button 
                          style={{ flex: 1, padding: '16px', borderRadius: '8px', border: thirdPartyTransport === 'yes' ? '2px solid #222' : '1px solid #dddddd', background: thirdPartyTransport === 'yes' ? '#f7f7f7' : 'white', fontSize: '16px', fontWeight: 600, color: '#222', cursor: 'pointer' }}
                          onClick={() => setThirdPartyTransport('yes')}
                        >
                          Yes
                        </button>
                        <button 
                          style={{ flex: 1, padding: '16px', borderRadius: '8px', border: thirdPartyTransport === 'no' ? '2px solid #222' : '1px solid #dddddd', background: thirdPartyTransport === 'no' ? '#f7f7f7' : 'white', fontSize: '16px', fontWeight: 600, color: '#222', cursor: 'pointer' }}
                          onClick={() => setThirdPartyTransport('no')}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {(transportVehicle === 'no' || vehicleTypes.length > 0) && (
                      <>
                        <div style={{ borderTop: '1px solid #ebebeb', margin: '16px 0' }}></div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <span style={{ fontSize: '16px', color: '#222', fontWeight: 600 }}>Requirements and terms</span>
                          <p style={{ fontSize: '12px', color: '#222', lineHeight: '1.5' }}>
                            You have read, understand and agree to the <a href="https://www.airbnb.com/help/article/2870?locale=en-IN&country_override=IN" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600, color: '#222' }}>experiences terms</a>, <a href="https://www.airbnb.com/help/article/4059?locale=en-IN&country_override=IN" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600, color: '#222' }}>supplemental terms for adding business personnel</a>, <a href="https://www.airbnb.com/help/article/2039?locale=en-IN&country_override=IN" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600, color: '#222' }}>host cancellation policy</a> for experiences and services, and <a href="https://www.airbnb.com/help/article/1565?locale=en-IN&country_override=IN" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600, color: '#222' }}>cancellation policies</a> for experiences and services. You also acknowledge the <a href="https://www.airbnb.com/help/article/3175?locale=en-IN&country_override=IN" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600, color: '#222' }}>privacy policy</a>.
                          </p>
                          <p style={{ fontSize: '12px', color: '#222', lineHeight: '1.5' }}>
                            By selecting "I agree", you authorise Airbnb to conduct <a href="https://www.airbnb.com/help/article/3901?locale=en-IN&country_override=IN" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600, color: '#222' }}>quality and standards checks</a> and you attest that you will maintain all necessary licences, authorisations and customary commercial liability insurance.
                          </p>
                          <p style={{ fontSize: '12px', color: '#222', lineHeight: '1.5' }}>
                            You attest that you will comply with the <a href="https://www.airbnb.com/help/article/1451?locale=en-IN&country_override=IN" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600, color: '#222' }}>experiences standards and requirements</a>, all laws and other requirements that apply to your experience, including those specific to:
                          </p>
                          <ul style={{ fontSize: '12px', color: '#222', lineHeight: '1.5', paddingLeft: '24px', margin: 0 }}>
                            <li><a href="https://www.airbnb.com/help/article/2251?locale=en-IN&country_override=IN" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600, color: '#222' }}>Handling, serving or selling food</a>, plus our <a href="https://www.airbnb.com/help/article/2647?locale=en-IN&country_override=IN" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600, color: '#222' }}>food safety guidelines</a></li>
                            <li>Serving <a href="https://www.airbnb.com/help/article/2252?locale=en-IN&country_override=IN" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600, color: '#222' }}>alcohol</a>, like requirements for a licensed location and checking valid guest IDs</li>
                            <li><a href="https://www.airbnb.com/help/article/2255?locale=en-IN&country_override=IN" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600, color: '#222' }}>Tour guiding</a> or otherwise accompanying guests in locations that require permits</li>
                            <li>Operating on <a href="https://www.airbnb.com/help/article/2254?locale=en-IN&country_override=IN" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600, color: '#222' }}>public land, like a park</a>, which may require permits</li>
                            <li><a href="https://www.airbnb.com/help/article/2256?locale=en-IN&country_override=IN" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600, color: '#222' }}>Transporting guests</a>, which may require licences, and motor carrier operating authority, and ensuring any hired third-party providers hold all required licences and insurance</li>
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {(transportVehicle === 'no' || vehicleTypes.length > 0) && (
                  <footer className={styles.fixedFooter} style={{position: 'absolute', bottom: 0, left: 0, right: 0, justifyContent: 'flex-end', display: 'flex', alignItems: 'center'}}>
                    <button 
                      className={styles.footerNextBtn} 
                      onClick={() => {
                        setServiceStep(22);
                      }}
                    >
                      I agree.
                    </button>
                  </footer>
                )}
              </div>
            ) : serviceStep === 22 ? (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: '40px 24px 100px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '220px', background: 'white', borderRadius: '16px', boxShadow: '0 12px 24px rgba(0,0,0,0.08)', padding: '16px', marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #ebebeb' }}>
                    <div style={{ width: '100%', height: '140px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                       <img src={photos[0] || 'https://via.placeholder.com/300x200'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="cover" />
                       <div style={{ position: 'absolute', bottom: '-16px', left: '50%', transform: 'translateX(-50%)', width: '32px', height: '32px', borderRadius: '50%', background: '#F7E6F7', color: '#892789', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600, border: '2px solid white' }}>M</div>
                    </div>
                    <div style={{ marginTop: '32px', width: '80%', height: '12px', background: '#f0f0f0', borderRadius: '6px' }}></div>
                    <div style={{ marginTop: '12px', width: '60%', height: '12px', background: '#f0f0f0', borderRadius: '6px' }}></div>
                  </div>
                  <h1 style={{ fontSize: '40px', fontWeight: 600, color: '#222', textAlign: 'center', marginBottom: '16px', maxWidth: '480px', lineHeight: '1.2' }}>
                    Add an experience title and description
                  </h1>
                  <p style={{ color: '#717171', fontSize: '18px', textAlign: 'center', maxWidth: '400px', lineHeight: '1.4' }}>
                    We'll share some options to get you started – then you'll choose one and make it your own.
                  </p>
                </div>
                <footer className={styles.fixedFooter} style={{position: 'absolute', bottom: 0, left: 0, right: 0, justifyContent: 'flex-end', display: 'flex', alignItems: 'center'}}>
                  <button className={styles.footerNextBtn} onClick={() => setServiceStep(23)}>Next</button>
                </footer>
              </div>
            ) : serviceStep === 23 ? (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: '40px 24px 120px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h1 style={{ fontSize: '32px', fontWeight: 600, color: '#222', textAlign: 'center', marginBottom: '48px' }}>
                    Choose one and make it your own
                  </h1>
                  <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {[
                      { id: 1, title: 'Travel stories with an art host', desc: 'Trade travel stories with a creative host and talk about how you like to travel.' },
                      { id: 2, title: 'Travel sketching with an art host', desc: 'Travel with a creative host and sketch what you see, and share how you like to travel.' },
                      { id: 3, title: 'Travel journaling with an art host', desc: 'Travel with a creative host and journal what you notice, and share how you like to travel.' }
                    ].map((opt) => (
                      <div 
                        key={opt.id}
                        onClick={() => {
                          setSelectedTitleOption(opt.id);
                          setExperienceTitle(opt.title);
                          setExperienceDesc(opt.desc);
                        }}
                        style={{ width: '260px', background: 'white', borderRadius: '16px', padding: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: selectedTitleOption === opt.id ? '2px solid #222' : '1px solid #ebebeb', boxShadow: selectedTitleOption === opt.id ? '0 12px 24px rgba(0,0,0,0.1)' : 'none', transform: selectedTitleOption === opt.id ? 'scale(1.02)' : 'scale(1)', transition: 'all 0.2s ease' }}
                      >
                        <div style={{ width: '100%', height: '140px', borderRadius: '12px', overflow: 'hidden', position: 'relative', marginBottom: '32px' }}>
                          <img src={photos[0] || 'https://via.placeholder.com/300x200'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="cover" />
                          <div style={{ position: 'absolute', bottom: '-16px', left: '50%', transform: 'translateX(-50%)', width: '32px', height: '32px', borderRadius: '50%', background: '#F7E6F7', color: '#892789', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600, border: '2px solid white' }}>M</div>
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginBottom: '12px', lineHeight: '1.2' }}>{opt.title}</h3>
                        <p style={{ fontSize: '14px', color: '#717171', lineHeight: '1.4' }}>{opt.desc}</p>
                      </div>
                    ))}
                  </div>
                  
                  {selectedTitleOption && (
                    <button 
                      onClick={() => setShowEditTitleModal(true)}
                      style={{ marginTop: '40px', padding: '12px 32px', borderRadius: '24px', border: '1px solid #dddddd', background: 'white', fontSize: '14px', fontWeight: 600, color: '#222', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                  )}
                </div>
                
                <footer className={styles.fixedFooter} style={{position: 'absolute', bottom: 0, left: 0, right: 0, justifyContent: 'flex-end', display: 'flex', alignItems: 'center'}}>
                  <button className={styles.footerNextBtn} onClick={() => setServiceStep(24)}>Next</button>
                </footer>

                {showEditTitleModal && (
                  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ width: '560px', background: 'white', borderRadius: '12px', padding: '24px', position: 'relative' }}>
                      <button 
                        onClick={() => setShowEditTitleModal(false)}
                        style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#222' }}
                      >
                        <IoMdClose />
                      </button>
                      <h2 style={{ fontSize: '16px', fontWeight: 600, textAlign: 'center', marginBottom: '32px', color: '#222' }}>Edit title and description</h2>
                      
                      <div style={{ marginBottom: '24px' }}>
                        <div style={{ position: 'relative', border: '1px solid #B0B0B0', borderRadius: '8px', padding: '8px 12px' }}>
                          <label style={{ fontSize: '12px', color: '#717171', display: 'block', marginBottom: '2px' }}>Title</label>
                          <input 
                            value={experienceTitle}
                            onChange={(e) => setExperienceTitle(e.target.value)}
                            maxLength={50}
                            style={{ width: '100%', border: 'none', outline: 'none', fontSize: '16px', color: '#222' }}
                          />
                        </div>
                        <div style={{ fontSize: '12px', color: '#717171', marginTop: '4px', fontWeight: 600 }}>{experienceTitle.length}/50 <span style={{fontWeight: 400}}>available</span></div>
                      </div>

                      <div style={{ marginBottom: '40px' }}>
                        <div style={{ position: 'relative', border: '1px solid #B0B0B0', borderRadius: '8px', padding: '8px 12px' }}>
                          <label style={{ fontSize: '12px', color: '#717171', display: 'block', marginBottom: '2px' }}>Description</label>
                          <textarea 
                            value={experienceDesc}
                            onChange={(e) => setExperienceDesc(e.target.value)}
                            maxLength={200}
                            rows={3}
                            style={{ width: '100%', border: 'none', outline: 'none', fontSize: '16px', color: '#222', resize: 'none' }}
                          />
                        </div>
                        <div style={{ fontSize: '12px', color: '#717171', marginTop: '4px', fontWeight: 600 }}>{experienceDesc.length}/200 <span style={{fontWeight: 400}}>available</span></div>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '16px', fontWeight: 600, color: '#222', textDecoration: 'underline', cursor: 'pointer' }}>Get tips</span>
                        <button 
                          onClick={() => setShowEditTitleModal(false)}
                          style={{ padding: '14px 24px', background: '#222', color: 'white', borderRadius: '8px', fontSize: '16px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : serviceStep === 24 ? (
              <div className={styles.publishScreenWrapper}>
                <header className={styles.publishHeader}>
                  <FaAirbnb style={{ fontSize: '32px', color: 'white' }} />
                  <button 
                    onClick={() => handleSaveListingToBackend(false)} 
                    className={styles.publishExitBtn}
                    disabled={isSubmittingListing}
                  >
                    {isSubmittingListing ? 'Saving...' : 'Save and exit'}
                  </button>
                </header>

                <div className={styles.publishScrollBody}>
                  <div className="container">
                    <div className="row justify-content-center align-items-start">
                      {/* Left Column: Form & Steps */}
                      <div className="col-lg-7 col-md-12">
                        <h1 className={styles.publishTitle}>Publish your listing</h1>
                        <p className={styles.publishSubtitle}>
                          If your listing meets our requirements, we'll let you know. It will be published one week later.
                        </p>
                        
                        <div className={styles.publishItemsList}>
                          {(hostingType === "service"
                            ? [
                                { 
                                  icon: <div className={`${styles.publishItemIconWrapper} ${styles.publishIconAvatar}`}>{getUserInitials()}</div>, 
                                  title: 'About you', 
                                  desc: qualificationsText || 'Your qualifications', 
                                  step: 6 
                                },
                                { 
                                  icon: <div className={`${styles.publishItemIconWrapper} ${styles.publishIconLocation}`}><FaMapMarkerAlt size={20} /></div>, 
                                  title: 'Location', 
                                  desc: meetupAddress?.street || (residentialAddress?.street ? `${residentialAddress.street}, ${residentialAddress.city}` : 'Jaipur, Rajasthan'), 
                                  step: 10 
                                },
                                { 
                                  icon: <img src={photos[0] || 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=100&q=80'} className={styles.publishIconImage} alt="photos"/>, 
                                  title: 'Photos', 
                                  desc: photos.length > 0 ? `${photos.length} photos added` : '0 photos', 
                                  step: 13 
                                },
                                { 
                                  icon: <div className={`${styles.publishItemIconWrapper} ${styles.publishIconDetails}`}><FaShoppingBag size={18}/></div>, 
                                  title: 'Offerings', 
                                  desc: serviceOfferings.length > 0 ? `${serviceOfferings.length} offerings added` : 'Offerings & hours', 
                                  step: 105 
                                },
                                { 
                                  icon: <div className={`${styles.publishItemIconWrapper} ${styles.publishIconItinerary}`}><FaClipboardList size={18}/></div>, 
                                  title: 'Details', 
                                  desc: experienceTitle || 'Title & description', 
                                  step: 22 
                                },
                                {
                                  icon: <div className={`${styles.publishItemIconWrapper} ${styles.publishIconAvatar}`}><FaCheck size={18}/></div>,
                                  title: 'Publish',
                                  desc: 'Ready for review',
                                  step: 24
                                }
                              ]
                            : [
                                { 
                                  icon: <div className={`${styles.publishItemIconWrapper} ${styles.publishIconAvatar}`}>{getUserInitials()}</div>, 
                                  title: 'About you', 
                                  desc: qualificationsText || 'Your qualifications', 
                                  step: 6 
                                },
                                { 
                                  icon: <div className={`${styles.publishItemIconWrapper} ${styles.publishIconLocation}`}><FaMapMarkerAlt size={20} /></div>, 
                                  title: 'Location', 
                                  desc: meetupAddress?.street || (residentialAddress?.street ? `${residentialAddress.street}, ${residentialAddress.city}` : 'Jaipur, Rajasthan'), 
                                  step: 10 
                                },
                                { 
                                  icon: <img src={photos[0] || 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=100&q=80'} className={styles.publishIconImage} alt="photos"/>, 
                                  title: 'Photos', 
                                  desc: photos.length > 0 ? `${photos.length} photos added` : '0 photos', 
                                  step: 13 
                                },
                                { 
                                  icon: <div className={`${styles.publishItemIconWrapper} ${styles.publishIconItinerary}`}><FaIdCard size={18}/></div>, 
                                  title: 'Itinerary', 
                                  desc: activities.length > 0 ? `${activities.length} activities` : 'Activities planned', 
                                  step: 14 
                                },
                                { 
                                  icon: <div className={`${styles.publishItemIconWrapper} ${styles.publishIconPricing}`}><FaVideo size={18}/></div>, 
                                  title: 'Pricing', 
                                  desc: pricePerGuest ? `₹${pricePerGuest} / guest` : 'Pricing & discounts', 
                                  step: 15 
                                },
                                { 
                                  icon: <div className={`${styles.publishItemIconWrapper} ${styles.publishIconExperience}`}><FaShoppingBag size={18}/></div>, 
                                  title: 'Details', 
                                  desc: experienceTitle || 'Title & details', 
                                  step: 21 
                                },
                                {
                                  icon: <div className={`${styles.publishItemIconWrapper} ${styles.publishIconAvatar}`}><FaCheck size={18}/></div>,
                                  title: 'Publish',
                                  desc: 'Ready for review',
                                  step: 24
                                }
                              ]
                          ).map((item, i) => (
                            <div 
                              key={i} 
                              onClick={() => setServiceStep(item.step)} 
                              className={styles.publishTabItem}
                            >
                              <div className={styles.publishTabLeft}>
                                {item.icon}
                                <div className={styles.publishItemTextContent}>
                                  <div className={styles.publishItemTitle}>{item.title}</div>
                                  <div className={styles.publishItemDesc}>{item.desc}</div>
                                </div>
                              </div>
                              <FaChevronRight className={styles.publishTabArrow} />
                            </div>
                          ))}
                        </div>

                        <div className={styles.publishPartnerBox}>
                          <p style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '6px' }}>Are you a partner organisation?</p>
                          <span onClick={() => setShowInviteModal(true)} style={{ fontSize: '14px', color: '#ffffff', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500 }}>
                            Enter an invite code
                          </span>
                        </div>
                      </div>

                      {/* Right Column: Listing Preview Card */}
                      <div className="col-md-12 col-lg-5 d-flex justify-content-center">
                        <div style={{ width: '100%', maxWidth: '380px' }}>
                          <div className={styles.publishPreviewCard}>
                            <div className={styles.publishPreviewImgWrapper}>
                              <img 
                                src={photos[0] || 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80'} 
                                className={styles.publishPreviewImg} 
                                alt="cover" 
                              />
                              <div className={styles.publishPreviewAvatar}>M</div>
                            </div>
                            <h2 className={styles.publishPreviewTitle}>{experienceTitle}</h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <footer className={styles.publishFooter}>
                  <p className={styles.publishFooterText}>
                    By requesting to publish, you agree to the <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Experiences terms</span> and attest all details are accurate, including any suggested content.
                  </p>
                  <button 
                    className={styles.publishFooterBtn} 
                    disabled={isSubmittingListing}
                    onClick={() => handleSaveListingToBackend(true)}
                  >
                    {isSubmittingListing ? 'Publishing...' : 'Request to publish'}
                  </button>
                </footer>

                {showInviteModal && (
                  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ width: '400px', background: 'white', borderRadius: '16px', padding: '24px', position: 'relative', color: '#222' }}>
                      <button 
                        onClick={() => setShowInviteModal(false)}
                        style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#222' }}
                      >
                        <IoMdClose />
                      </button>
                      <h2 style={{ fontSize: '20px', fontWeight: 600, textAlign: 'center', marginBottom: '32px' }}>Invite code</h2>
                      
                      <div style={{ position: 'relative', border: '1px solid #B0B0B0', borderRadius: '8px', padding: '12px', marginBottom: '32px' }}>
                        <input 
                          placeholder="Enter an invite code"
                          value={inviteCode}
                          onChange={(e) => setInviteCode(e.target.value)}
                          style={{ width: '100%', border: 'none', outline: 'none', fontSize: '16px', color: '#222' }}
                        />
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span onClick={() => setShowInviteModal(false)} style={{ fontSize: '16px', fontWeight: 600, color: '#222', textDecoration: 'underline', cursor: 'pointer' }}>Cancel</span>
                        <button 
                          style={{ padding: '14px 32px', background: inviteCode.length > 0 ? '#222' : '#f0f0f0', color: inviteCode.length > 0 ? 'white' : '#b0b0b0', borderRadius: '8px', fontSize: '16px', fontWeight: 600, border: 'none', cursor: inviteCode.length > 0 ? 'pointer' : 'not-allowed' }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : serviceStep === 25 ? (
              <div className={styles.submissionScreenWrapper}>
                <header className={styles.submissionHeader}>
                  <FaAirbnb style={{ fontSize: '32px', color: '#222222' }} />
                </header>

                <div className={styles.submissionBody}>
                  <div className="container">
                    <div className="row align-items-center justify-content-center g-4 g-lg-5">
                      {/* Left Column: Heading & Subtitle */}
                      <div className="col-md-6 col-lg-6 d-flex flex-column justify-content-center">
                        <h1 className={styles.submissionTitle}>
                          Thanks for your submission
                        </h1>
                        <p className={styles.submissionSubtitle}>
                          We'll let you know in a few days if your listing has been approved. It will be published one week later.
                        </p>
                      </div>

                      {/* Right Column: Tilted Preview Card */}
                      <div className={`col-md-6 col-lg-6 ${styles.submissionCardCol}`}>
                        <div className={styles.submissionCardTiltWrapper}>
                          <div className={styles.submissionCard}>
                            <div className={styles.submissionCardImgWrapper}>
                              <img 
                                src={photos[0] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'} 
                                className={styles.submissionCardImg} 
                                alt="submission preview" 
                              />
                              <div className={styles.submissionCardAvatar}>
                                <img 
                                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" 
                                  className={styles.submissionCardAvatarImg} 
                                  alt="host avatar" 
                                />
                              </div>
                            </div>
                            <h3 className={styles.submissionCardTitle}>
                              {experienceTitle || "Creative hair styles by Mohammad"}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <footer className={styles.submissionFooter}>
                  <button 
                    className={styles.submissionDoneBtn} 
                    onClick={() => navigate('/hosting/listings')}
                  >
                    Done
                  </button>
                </footer>
              </div>
            ) : serviceStep === 19 ? (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: '40px 24px 100px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h1 style={{ fontSize: '32px', fontWeight: 600, color: '#222', textAlign: 'center', marginBottom: '8px' }}>
                    Share what's included
                  </h1>
                  <p style={{ color: '#717171', fontSize: '16px', marginBottom: '48px', textAlign: 'center' }}>
                    Let guests know exactly what's covered in the price.
                  </p>
                  
                  <div style={{ width: '100%', maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '16px', alignSelf: 'center' }}>
                    {INCLUDED_OPTIONS.map((option) => {
                      const isSelected = includedItems.includes(option.id);
                      return (
                        <div 
                          key={option.id}
                          onClick={() => toggleIncludedItem(option.id)}
                          style={{ border: isSelected ? '2px solid #222' : '1px solid #dddddd', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', cursor: 'pointer', background: isSelected ? '#f7f7f7' : 'white', transition: 'border 0.2s ease, background 0.2s ease' }}
                        >
                          <span style={{ fontSize: '24px', marginRight: '24px' }}>{option.icon}</span>
                          <span style={{ fontSize: '16px', color: '#222', fontWeight: isSelected ? 600 : 400 }}>{option.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <p style={{ color: '#717171', fontSize: '14px', marginTop: '32px', textAlign: 'center' }}>
                    You'll be able to add more later
                  </p>
                </div>
                
                <footer className={styles.fixedFooter} style={{position: 'absolute', bottom: 0, left: 0, right: 0, justifyContent: 'space-between', display: 'flex', alignItems: 'center'}}>
                  <span className={styles.getTipsText} onClick={() => setServiceStep(20)}>Skip</span>
                  <button className={styles.footerNextBtn} onClick={() => setServiceStep(20)}>Next</button>
                </footer>
              </div>
            ) : serviceStep === 18 ? (
              <div className="d-flex flex-column align-items-center justify-content-center h-100 flex-grow-1 position-relative w-100">
                <h1 style={{ fontSize: '32px', fontWeight: 600, color: '#222', textAlign: 'center', marginBottom: '48px' }}>
                  Review your pricing
                </h1>
                
                <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div 
                    onClick={() => setServiceStep(16)}
                    style={{ border: '1px solid #dddddd', borderRadius: '12px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: 'white' }}
                  >
                    <span style={{ fontSize: '16px', color: '#222', fontWeight: 600 }}>Price per guest</span>
                    <span style={{ fontSize: '24px', fontWeight: 600, color: '#222' }}>₹{pricePerGuest}</span>
                  </div>
                  
                  <div 
                    onClick={() => setServiceStep(17)}
                    style={{ border: '1px solid #dddddd', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', cursor: 'pointer', background: 'white' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontSize: '16px', color: '#222', fontWeight: 600 }}>Private group minimum</span>
                      <span style={{ fontSize: '24px', fontWeight: 600, color: '#222' }}>₹{privateGroupPrice}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#717171' }}>
                      Guests pay ₹{pricePerGuest} per guest with a private group minimum of ₹{privateGroupPrice}.
                    </span>
                  </div>
                </div>
                
                <footer className={styles.fixedFooter} style={{position: 'absolute', justifyContent: 'space-between', display: 'flex', alignItems: 'center'}}>
                  <span className={styles.getTipsText} onClick={() => setServiceStep(19)}>Skip</span>
                  <button className={styles.footerNextBtn} onClick={() => setServiceStep(19)}>Next</button>
                </footer>
              </div>
            ) : serviceStep === 16 ? (
              <div className="d-flex flex-column align-items-center justify-content-center h-100 flex-grow-1 position-relative w-100">
                <h1 style={{ fontSize: '32px', fontWeight: 600, color: '#222', textAlign: 'center', marginBottom: '48px' }}>
                  Price per guest
                </h1>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '72px', fontWeight: 600, color: '#222' }}>₹</span>
                  <input 
                    type="number" 
                    ref={pricePerGuestInputRef}
                    value={pricePerGuest}
                    onChange={(e) => { setPricePerGuest(e.target.value); setShowPriceBreakdown(false); }}
                    placeholder="00"
                    style={{ fontSize: '72px', fontWeight: 600, color: '#222', border: 'none', outline: 'none', background: 'transparent', width: pricePerGuest ? `${Math.max(2, pricePerGuest.length) * 45}px` : '90px', maxWidth: '300px', textAlign: 'center' }}
                  />
                  <div onClick={() => pricePerGuestInputRef.current?.focus()} style={{ marginLeft: '12px', background: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{display: 'block', height: '12px', width: '12px', fill: 'currentColor'}}><path d="M22.82 2.5a5.5 5.5 0 0 1 7.78 7.78L10.02 30.85a3 3 0 0 1-1.68.83l-5.69.8a1.5 1.5 0 0 1-1.7-1.7l.8-5.69a3 3 0 0 1 .83-1.68L22.82 2.5zm5.66 2.12a2.5 2.5 0 0 0-3.54 0L22.5 7.06l5.65 5.65 2.44-2.43a2.5 2.5 0 0 0 0-3.54L28.48 4.62zm-5.65 6.68-5.66-5.66L5.3 23.23a1 1 0 0 0-.28.56l-.64 4.54 4.54-.64a1 1 0 0 0 .56-.28l13.35-13.35z"></path></svg>
                  </div>
                </div>
                
                <div style={{ marginTop: '20px', width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {showPriceBreakdown ? (
                    <>
                      <div className={styles.offeringPriceBreakdownBox}>
                        <div className={styles.offeringBreakdownRow}>
                          <span>Base price</span>
                          <span>₹{basePrice}</span>
                        </div>
                        <div className={styles.offeringBreakdownRow}>
                          <span>Airbnb service fee</span>
                          <span>-₹{basePrice > 0 ? (serviceFee || basePrice) : 0}</span>
                        </div>
                        <div style={{ borderBottom: '1px solid #ebebeb', margin: '4px 0' }}></div>
                        <div className={styles.offeringBreakdownRowTotal}>
                          <span>You earn</span>
                          <span>₹{youEarn}</span>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPriceBreakdown(false);
                        }}
                        className={styles.offeringShowLessBtn}
                        style={{ background: 'none', border: 'none', outline: 'none' }}
                      >
                        <span>Show less</span>
                        <FaChevronUp size={12} />
                      </button>
                    </>
                  ) : (
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPriceBreakdown(true);
                      }}
                      className={styles.offeringYouEarnBtn}
                      style={{ background: 'none', border: 'none', outline: 'none' }}
                    >
                      <span>You earn ₹{youEarn}</span>
                      <FaChevronDown size={13} />
                    </button>
                  )}
                </div>
                
                <div style={{ marginTop: '32px', textDecoration: 'underline', color: '#717171', fontSize: '14px', cursor: 'pointer', fontWeight: 600 }}>
                  Learn more about pricing
                </div>
                
                <footer className={styles.fixedFooter} style={{position: 'absolute', justifyContent: 'space-between', display: 'flex', alignItems: 'center'}}>
                  <span className={styles.getTipsText}>Get tips</span>
                  <button className={`${styles.footerNextBtn} ${!pricePerGuest ? styles.footerNextBtnDisabled : ''}`} disabled={!pricePerGuest} onClick={() => setServiceStep(17)}>Next</button>
                </footer>
              </div>
            ) : serviceStep === 17 ? (
              <div className="d-flex flex-column align-items-center justify-content-center h-100 flex-grow-1 position-relative w-100">
                <h1 style={{ fontSize: '32px', fontWeight: 600, color: '#222', textAlign: 'center', marginBottom: '8px' }}>
                  Private group minimum
                </h1>
                <p style={{ color: '#717171', fontSize: '16px', marginBottom: '48px' }}>
                  Bookings will start at this price
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '72px', fontWeight: 600, color: (privateBasePrice > 0 && privateBasePrice < 100) ? '#c13515' : '#222' }}>₹</span>
                  <input 
                    type="number" 
                    ref={privateGroupInputRef}
                    value={privateGroupPrice}
                    onChange={(e) => { setPrivateGroupPrice(e.target.value); setShowPrivateGroupBreakdown(false); }}
                    placeholder="00"
                    style={{ fontSize: '72px', fontWeight: 600, color: (privateBasePrice > 0 && privateBasePrice < 100) ? '#c13515' : '#222', border: 'none', outline: 'none', background: 'transparent', width: privateGroupPrice ? `${Math.max(2, privateGroupPrice.length) * 45}px` : '90px', maxWidth: '300px', textAlign: 'center' }}
                  />
                  <div onClick={() => privateGroupInputRef.current?.focus()} style={{ marginLeft: '12px', background: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{display: 'block', height: '12px', width: '12px', fill: 'currentColor'}}><path d="M22.82 2.5a5.5 5.5 0 0 1 7.78 7.78L10.02 30.85a3 3 0 0 1-1.68.83l-5.69.8a1.5 1.5 0 0 1-1.7-1.7l.8-5.69a3 3 0 0 1 .83-1.68L22.82 2.5zm5.66 2.12a2.5 2.5 0 0 0-3.54 0L22.5 7.06l5.65 5.65 2.44-2.43a2.5 2.5 0 0 0 0-3.54L28.48 4.62zm-5.65 6.68-5.66-5.66L5.3 23.23a1 1 0 0 0-.28.56l-.64 4.54 4.54-.64a1 1 0 0 0 .56-.28l13.35-13.35z"></path></svg>
                  </div>
                </div>
                
                {(privateBasePrice > 0 && privateBasePrice < 100) && (
                  <div style={{ color: '#c13515', fontSize: '14px', fontWeight: 600, marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{display: 'block', height: '16px', width: '16px', fill: '#c13515'}}><path d="M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2zm0 26a12 12 0 1 1 12-12 12.014 12.014 0 0 1-12 12z"></path><path d="M16 19a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 16 19zm1-11h-2v8h2z"></path></svg>
                    Set a price at or above ₹100
                  </div>
                )}
                
                {(privateBasePrice >= 100) && (
                  <div style={{ marginTop: '24px', width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {showPrivateGroupBreakdown ? (
                      <>
                        <div style={{ width: '100%', border: '1px solid #222', borderRadius: '12px', padding: '16px', background: 'white', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', color: '#717171' }}>
                            <span>Base price</span>
                            <span>₹{privateBasePrice}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', color: '#717171' }}>
                            <span>Airbnb service fee (20%)</span>
                            <span>-₹{privateServiceFee}</span>
                          </div>
                          <div style={{ borderBottom: '1px solid #ebebeb' }}></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', color: '#222', fontWeight: 600 }}>
                            <span>You earn</span>
                            <span>₹{privateYouEarn}</span>
                          </div>
                        </div>
                        <div 
                          onClick={() => setShowPrivateGroupBreakdown(false)}
                          style={{ marginTop: '24px', fontSize: '14px', color: '#222', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
                        >
                          Show less <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{display: 'block', height: '12px', width: '12px', fill: 'currentColor'}}><path d="M4.29 20.71a1 1 0 0 0 1.42 0L16 10.41l10.29 10.3a1 1 0 0 0 1.42-1.42l-11-11a1 1 0 0 0-1.42 0l-11 11a1 1 0 0 0 0 1.42z"></path></svg>
                        </div>
                      </>
                    ) : (
                      <div 
                        onClick={() => setShowPrivateGroupBreakdown(true)}
                        style={{ fontSize: '16px', color: '#222', cursor: 'pointer', fontWeight: 600, marginTop: '8px' }}
                      >
                        <span style={{ textDecoration: 'underline' }}>You earn ₹{privateYouEarn}</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div style={{ marginTop: '32px', textDecoration: 'underline', color: '#717171', fontSize: '14px', cursor: 'pointer', fontWeight: 600 }}>
                  Learn more about pricing
                </div>
                
                <footer className={styles.fixedFooter} style={{position: 'absolute', justifyContent: 'space-between', display: 'flex', alignItems: 'center'}}>
                  <span className={styles.getTipsText} onClick={() => setServiceStep(18)}>Skip</span>
                  <button className={`${styles.footerNextBtn} ${(!privateGroupPrice || privateBasePrice < 100) ? styles.footerNextBtnDisabled : ''}`} disabled={!privateGroupPrice || privateBasePrice < 100} onClick={() => setServiceStep(18)}>Next</button>
                </footer>
              </div>
            ) : serviceStep === 15 ? (
              <div className="d-flex flex-column align-items-center justify-content-center h-100 flex-grow-1 position-relative w-100">
                <h1 style={{ fontSize: '32px', fontWeight: 600, color: '#222', textAlign: 'center', maxWidth: '400px', lineHeight: '1.2', marginBottom: '48px' }}>
                  Add your maximum<br/>number of guests
                </h1>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                  <button 
                    onClick={() => setMaxGuests(Math.max(1, maxGuests - 1))}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #ebebeb', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: maxGuests <= 1 ? 'not-allowed' : 'pointer', opacity: maxGuests <= 1 ? 0.4 : 1 }}
                    disabled={maxGuests <= 1}
                  >
                    <FaMinus color="#222" />
                  </button>
                  
                  <span style={{ fontSize: '72px', fontWeight: 600, color: '#222', minWidth: '100px', textAlign: 'center' }}>{maxGuests}</span>
                  
                  <button 
                    onClick={() => setMaxGuests(maxGuests + 1)}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #ebebeb', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <FaPlus color="#222" />
                  </button>
                </div>
                
                <footer className={styles.fixedFooter} style={{position: 'absolute', justifyContent: 'space-between', display: 'flex', alignItems: 'center'}}>
                  <span className={styles.getTipsText}>Get tips</span>
                  <button className={styles.footerNextBtn} onClick={() => setServiceStep(16)}>Next</button>
                </footer>
              </div>
            ) : serviceStep === 14 ? (
              !hasSeenItineraryIntro ? (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 flex-grow-1 position-relative w-100">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', width: '320px', zIndex: 3, position: 'relative', border: '1px solid #ebebeb' }}>
                      <img src="https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=100&h=100&fit=crop" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} alt="" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#222' }}>Get set up</div>
                        <div style={{ fontSize: '12px', color: '#717171' }}>15 mins</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', width: '320px', zIndex: 2, position: 'relative', border: '1px solid #ebebeb' }}>
                      <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=100&h=100&fit=crop" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} alt="" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#222' }}>Review colour theory</div>
                        <div style={{ fontSize: '12px', color: '#717171' }}>1 hour</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', width: '320px', zIndex: 1, position: 'relative', border: '1px solid #ebebeb' }}>
                      <img src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=100&h=100&fit=crop" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} alt="" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#222' }}>Learn art restoration</div>
                        <div style={{ fontSize: '12px', color: '#717171' }}>30 mins</div>
                      </div>
                    </div>
                  </div>
                  <h1 style={{ fontSize: '40px', fontWeight: 600, color: '#222', textAlign: 'center', maxWidth: '500px', lineHeight: '1.2' }}>Let guests know what they'll do with an itinerary</h1>
                  <footer className={styles.fixedFooter} style={{position: 'absolute', justifyContent: 'space-between', display: 'flex', alignItems: 'center'}}>
                    <span className={styles.getTipsText}>Get tips</span>
                    <button
                      className={styles.footerNextBtn}
                      onClick={() => setHasSeenItineraryIntro(true)}
                    >
                      Next
                    </button>
                  </footer>
                </div>
              ) : (
              <div className={styles.itineraryCreateMain} style={{ overflowY: 'auto', paddingBottom: '100px', paddingTop: '40px', justifyContent: activities.length === 0 ? 'center' : 'flex-start' }}>
                {activities.length === 0 ? (
                  <>
                    <h1 className={styles.itineraryCreateTitle}>
                      Create an itinerary
                    </h1>
                    <p className={styles.itineraryCreateSub}>
                      Add up to 10 activities for your experience so guests know what<br/>to expect.
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className={styles.itineraryCreateTitle}>
                      Your itinerary
                    </h1>
                    <p className={styles.itineraryCreateSub}>
                      Add up to 10 activities.
                    </p>
                    
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {activities.map((act, index) => (
                        <div 
                          key={index} 
                          className={styles.itineraryActivityCard}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedActivityForEdit(index)}
                        >
                          <img src={act.photo} className={styles.itineraryActivityPhoto} alt={act.title} />
                          <div className={styles.itineraryActivityInfo}>
                            <div className={styles.itineraryActivityHeader}>
                              {act.title} &middot; {act.duration < 60 ? `${act.duration} mins` : `${Math.floor(act.duration/60)} hr ${act.duration%60 > 0 ? `${act.duration%60} mins` : ''}`}
                            </div>
                            <div className={styles.itineraryActivityDesc}>
                              {act.desc}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div 
                  onClick={() => {
                    setShowActivityModal(true);
                    setActivityModalStep(1);
                    setActivityTitle("");
                    setActivityDesc("");
                    setActivityDuration(60);
                    setSelectedActivityPhoto(null);
                  }}
                  className={styles.itineraryAddCard} 
                >
                   <div className={styles.itineraryAddIconBox}>
                     <FaPlus color="#222" size={16} />
                   </div>
                   <span className={styles.itineraryAddText}>Add activity</span>
                </div>

                <footer className={styles.fixedFooter} style={{position: 'absolute', justifyContent: 'space-between', display: 'flex', alignItems: 'center'}}>
                  <span className={styles.getTipsText}>Get tips</span>
                  <button
                    className={`${styles.footerNextBtn} ${activities.length === 0 ? styles.footerNextBtnDisabled : ""}`}
                    disabled={activities.length === 0}
                    onClick={() => setServiceStep(15)}
                  >
                    Next
                  </button>
                </footer>

                {showActivityModal && (
                  <div className={styles.modalOverlay}>
                    <div className={styles.itineraryModalDialog} onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh' }}>
                      
                      <div className={styles.itineraryModalHeader}>
                        {activityModalStep > 1 && activityModalStep < 4 ? (
                          <button className={styles.itineraryModalHeaderBtn} onClick={() => setActivityModalStep(prev => prev - 1)}>
                            <FaArrowLeft size={16} color="#222"/>
                          </button>
                        ) : activityModalStep === 4 ? (
                          <button className={styles.itineraryModalHeaderBtn} onClick={() => setActivityModalStep(prev => prev - 1)}>
                            <FaArrowLeft size={16} color="#222"/>
                          </button>
                        ) : <div style={{width: '32px'}}></div>}
                        
                        <button className={styles.itineraryModalHeaderBtn} onClick={() => setShowActivityModal(false)}>
                          <FaTimes size={16} color="#222"/>
                        </button>
                      </div>
                      
                      <div className={styles.itineraryModalBody} style={{ minHeight: 0 }}>
                        
                        {activityModalStep === 1 && (
                          <div className={styles.itineraryModalStepContent}>
                            <h2 className={styles.itineraryModalBigTitle}>Title your first activity</h2>
                            <input 
                              type="text"
                              value={activityTitle}
                              onChange={e => setActivityTitle(e.target.value)}
                              placeholder="Learn the basics"
                              className={styles.itineraryModalGiantInput}
                              maxLength={35}
                            />
                            <span className={styles.itineraryModalCharCount}>{activityTitle.length}/35 available</span>
                          </div>
                        )}

                        {activityModalStep === 2 && (
                          <div className={styles.itineraryModalStepContent}>
                            <h2 className={styles.itineraryModalBigTitle}>Describe what guests will do</h2>
                            <h3 className={styles.itineraryModalActivityTitle}>{activityTitle || "Travel"}</h3>
                            <textarea 
                              value={activityDesc}
                              onChange={e => setActivityDesc(e.target.value)}
                              placeholder="Add details about the activity. For example, &quot;Learn the process behind leather making&quot;."
                              className={styles.itineraryModalTextArea}
                              maxLength={30}
                            />
                            <span className={styles.itineraryModalCharCount}>{activityDesc.length}/30 required characters</span>
                          </div>
                        )}

                        {activityModalStep === 3 && (
                          <div className={styles.itineraryModalStepContent}>
                            <h2 className={styles.itineraryModalBigTitle}>Set a duration</h2>
                            
                            <div className={styles.durationSelectorWrap}>
                               <button 
                                 onClick={() => setActivityDuration(Math.max(0, activityDuration - 15))}
                                 className={styles.durationBtn}
                               >
                                 <FaMinus color="#222" />
                               </button>
                               <div className={styles.durationDisplay}>
                                 <span className={styles.durationValue}>{activityDuration}</span>
                                 <span className={styles.durationLabel}>Minutes</span>
                               </div>
                               <button 
                                 onClick={() => setActivityDuration(activityDuration + 15)}
                                 className={styles.durationBtn}
                               >
                                 <FaPlus color="#222" />
                               </button>
                            </div>
                          </div>
                        )}

                        {activityModalStep === 4 && (
                          <div className={styles.itineraryModalStepContent} style={{justifyContent: 'flex-start', paddingTop: '24px', overflowY: 'auto', minHeight: 0, paddingBottom: '24px'}}>
                            <div className={styles.itineraryModalTopCard}>
                               <FaBookOpen size={24} color="#222" />
                               <span className={styles.itineraryModalTopCardText}>{activityTitle || "Travel"}</span>
                            </div>
                            
                            <div className={styles.photoGrid}>
                               {photos.map((p, i) => (
                                  <div 
                                    key={i} 
                                    className={`${styles.photoGridItem} ${selectedActivityPhoto === p ? styles.photoGridItemActive : ''}`}
                                    onClick={() => setSelectedActivityPhoto(p)}
                                  >
                                     <img src={p} className={styles.photoGridImg} alt="" />
                                     {selectedActivityPhoto === p && (
                                       <div className={styles.photoGridCheck}>
                                         <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{display: 'block', fill: 'none', height: '12px', width: '12px', stroke: 'currentColor', strokeWidth: '4', overflow: 'visible'}}><path fill="none" d="m4 16.5 8 8 16-16"></path></svg>
                                       </div>
                                     )}
                                  </div>
                               ))}
                               <div className={styles.photoGridAdd}>
                                  <FaPlus size={24} color="#717171" />
                               </div>
                            </div>
                          </div>
                        )}

                        <div className={styles.itineraryModalProgressWrap}>
                           <div className={styles.itineraryModalProgressBar}>
                              <div className={styles.itineraryModalProgressSegment} style={{background: activityModalStep >= 1 ? '#222' : '#ebebeb'}}></div>
                              <div className={styles.itineraryModalProgressSegment} style={{background: activityModalStep >= 2 ? '#222' : '#ebebeb'}}></div>
                              <div className={styles.itineraryModalProgressSegment} style={{background: activityModalStep >= 3 ? '#222' : '#ebebeb'}}></div>
                              <div className={styles.itineraryModalProgressSegment} style={{background: activityModalStep >= 4 ? '#222' : '#ebebeb'}}></div>
                           </div>
                        </div>

                        <div className={styles.itineraryModalFooter}>
                           <span className={styles.getTipsText}>Get tips</span>
                           <button 
                             className={`${styles.footerNextBtn} ${
                               (activityModalStep === 1 && !activityTitle) || 
                               (activityModalStep === 2 && activityDesc.length < 30) ||
                               (activityModalStep === 4 && !selectedActivityPhoto) 
                               ? styles.footerNextBtnDisabled : ""
                             }`}
                             onClick={() => {
                               if (activityModalStep < 4) {
                                  setActivityModalStep(prev => prev + 1);
                               } else {
                                  setActivities([...activities, {
                                    title: activityTitle,
                                    desc: activityDesc,
                                    duration: activityDuration,
                                    photo: selectedActivityPhoto
                                  }]);
                                  setShowActivityModal(false);
                               }
                             }}
                             disabled={
                               (activityModalStep === 1 && !activityTitle) || 
                               (activityModalStep === 2 && activityDesc.length < 30) ||
                               (activityModalStep === 4 && !selectedActivityPhoto)
                             }
                           >
                             Next
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedActivityForEdit !== null && (
                  <div className={styles.modalOverlay} onClick={() => setSelectedActivityForEdit(null)}>
                    <div className={styles.editActivityModalDialog} onClick={(e) => e.stopPropagation()}>
                      <div className={styles.editActivityModalHeader}>
                        <span className={styles.editActivityModalHeaderTitle}>Itinerary</span>
                        <button className={styles.editActivityModalClose} onClick={() => setSelectedActivityForEdit(null)}>
                          <FaTimes size={16} color="#222"/>
                        </button>
                      </div>
                      
                      <div className={styles.editActivityModalBody}>
                        <img 
                          src={activities[selectedActivityForEdit].photo} 
                          className={styles.editActivityModalImg} 
                          alt="" 
                        />
                        <div className={styles.editActivityModalTitle}>
                          {activities[selectedActivityForEdit].title}
                        </div>
                        <div className={styles.editActivityModalDesc}>
                          {activities[selectedActivityForEdit].desc}
                        </div>
                        <div className={styles.editActivityModalDuration}>
                          {activities[selectedActivityForEdit].duration < 60 ? `${activities[selectedActivityForEdit].duration} mins` : `${Math.floor(activities[selectedActivityForEdit].duration/60)} hr ${activities[selectedActivityForEdit].duration%60 > 0 ? `${activities[selectedActivityForEdit].duration%60} mins` : ''}`}
                        </div>
                        
                        <button 
                          className={styles.editActivityBtn}
                          onClick={() => {
                             const act = activities[selectedActivityForEdit];
                             setActivityTitle(act.title);
                             setActivityDesc(act.desc);
                             setActivityDuration(act.duration);
                             setSelectedActivityPhoto(act.photo);
                             const newActs = activities.filter((_, i) => i !== selectedActivityForEdit);
                             setActivities(newActs);
                             setSelectedActivityForEdit(null);
                             setShowActivityModal(true);
                             setActivityModalStep(1);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className={styles.removeActivityBtn}
                          onClick={() => {
                             const newActs = activities.filter((_, i) => i !== selectedActivityForEdit);
                             setActivities(newActs);
                             setSelectedActivityForEdit(null);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              )
            ) : serviceStep === 13 ? (
              <div className={step1Styles.pageContainer} style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
                <div style={{ flexGrow: 1, padding: '40px' }}>
                  {photos.length === 0 ? (
                    <div className={step1Styles.step6Container}>
                      <h1 className={step1Styles.step2Title} style={{ marginBottom: '8px' }}>
                        {hostingType === "service" ? "Add unique photos of your Airbnb Service" : "Add unique photos of your Airbnb Experience"}
                      </h1>
                      <p className={step1Styles.mapSubtitle}>You'll need 5 photos to get started. You can add more or make changes later.</p>

                      <div 
                        className={step1Styles.photoUploadBox} 
                        onClick={() => setShowUploadModal(true)} 
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragOver(false);
                          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            const newPhotos = Array.from(e.dataTransfer.files).map((f) => URL.createObjectURL(f));
                            setPhotos(prev => [...prev, ...newPhotos]);
                          }
                        }}
                        style={{ cursor: 'pointer', borderColor: isDragOver ? '#222' : '#b0b0b0', background: isDragOver ? '#f0f0f0' : 'white' }}
                      >
                        <FaCamera className={step1Styles.photoUploadIcon} />
                        <button className={step1Styles.addPhotosBtn} type="button">Add photos</button>
                      </div>
                    </div>
                  ) : (
                    <div className={step1Styles.step6Container}>
                      <h1 className={step1Styles.step2Title} style={{ marginBottom: '8px', textAlign: 'center' }}>
                        {hostingType === "service" ? "Add unique photos of your Airbnb Service" : "Add unique photos of your Airbnb Experience"}
                      </h1>
                      <p className={step1Styles.mapSubtitle} style={{ textAlign: 'center' }}>
                        {photos.length < 5 ? `Add at least ${5 - photos.length} more photo${5 - photos.length > 1 ? 's' : ''} (5 required).` : `${photos.length} photos added.`}
                      </p>

                      <div className={styles.experiencePhotosGrid}>
                        {photos.map((photo, index) => (
                          <div key={index} className={styles.experiencePhotoItem}>
                            <img src={photo} alt={`Experience ${index}`} className={styles.experiencePhotoImg} />
                            {index === 0 && <div className={styles.experienceCoverPill}>Cover</div>}
                            
                            {photoCaptions[index] && (
                              <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.65)', color: 'white', fontSize: '11px', padding: '3px 8px', borderRadius: '12px', maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {photoCaptions[index]}
                              </div>
                            )}

                            <button className={styles.experienceMenuBtn} onClick={() => setActiveMenuIndex(activeMenuIndex === index ? null : index)}>
                              <BsThreeDots />
                            </button>
                            
                            {activeMenuIndex === index && (
                              <div className={styles.experiencePhotoDropdown}>
                                <div className={styles.experiencePhotoDropdownItem} onClick={() => { 
                                  setPhotoToEdit(index); 
                                  setCurrentCaption(photoCaptions[index] || "");
                                  setActiveMenuIndex(null); 
                                }}>Edit</div>
                                {index > 0 && <div className={styles.experiencePhotoDropdownItem} onClick={() => movePhotoBackwards(index)}>Move backwards</div>}
                                {index < photos.length - 1 && <div className={styles.experiencePhotoDropdownItem} onClick={() => movePhotoForwards(index)}>Move forwards</div>}
                                {index > 0 && <div className={styles.experiencePhotoDropdownItem} onClick={() => makeCoverPhoto(index)}>Make cover photo</div>}
                                <div className={styles.experiencePhotoDropdownItem} onClick={() => { setPhotoToDelete(index); setActiveMenuIndex(null); }}>Delete</div>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        <div 
                          className={styles.experienceAddPhotoBox} 
                          onClick={() => setShowUploadModal(true)}
                          onDragOver={(e) => { e.preventDefault(); }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                              const newPhotos = Array.from(e.dataTransfer.files).map((f) => URL.createObjectURL(f));
                              setPhotos(prev => [...prev, ...newPhotos]);
                            }
                          }}
                        >
                          <FaPlus size={32} color="#aaaaaa" style={{ fontWeight: '100' }} />
                        </div>
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
                  {showUploadModal && (
                    <div className={step1Styles.uploadOverlay} onClick={() => { if (!isUploading) { setShowUploadModal(false); setSelectedUploadPhotos([]); } }}>
                      <div className={step1Styles.uploadModal} onClick={(e) => e.stopPropagation()}>
                        <div className={step1Styles.uploadModalHeader}>
                          <button className={step1Styles.closeBtn} style={{ position: 'static', padding: '4px' }} onClick={() => { setShowUploadModal(false); setSelectedUploadPhotos([]); }} disabled={isUploading}>
                            <IoMdClose size={20} />
                          </button>
                          <div className={step1Styles.uploadModalTitle}>
                            Upload photos
                            <span className={step1Styles.uploadModalSubtitle}>
                              {isUploading ? `Uploading ${selectedUploadPhotos.length} item${selectedUploadPhotos.length > 1 ? 's' : ''}...` : selectedUploadPhotos.length === 0 ? 'No items selected' : `${selectedUploadPhotos.length} item${selectedUploadPhotos.length > 1 ? 's' : ''} selected`}
                            </span>
                          </div>
                          <button className={step1Styles.closeBtn} style={{ position: 'static', padding: '4px', visibility: 'hidden' }}>
                            <IoMdClose size={20} />
                          </button>
                        </div>
                        
                        {selectedUploadPhotos.length === 0 ? (
                          <div className={step1Styles.uploadModalBody}>
                            <div 
                              className={step1Styles.uploadDragBox}
                              onDragOver={(e) => { e.preventDefault(); }}
                              onDrop={(e) => {
                                e.preventDefault();
                                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                  const dropped = Array.from(e.dataTransfer.files).map(f => URL.createObjectURL(f));
                                  setSelectedUploadPhotos(prev => [...prev, ...dropped]);
                                }
                              }}
                            >
                              <FaImages className={step1Styles.uploadDragIcon} />
                              <div className={step1Styles.uploadDragTitle}>Drag and drop</div>
                              <div className={step1Styles.uploadDragSub}>or browse for photos from your device</div>
                              <button className={step1Styles.uploadBrowseBtn} type="button" onClick={handleBrowseClick}>Browse</button>
                            </div>
                          </div>
                        ) : (
                          <div className={step1Styles.uploadModalBodyGrid}>
                            {selectedUploadPhotos.map((photo, i) => (
                              <div key={i} className={step1Styles.uploadPreviewWrap}>
                                <img src={photo} alt="Preview" className={step1Styles.uploadPreviewImg} />
                                {!isUploading && (
                                  <button className={step1Styles.uploadDeleteBtn} onClick={() => removePendingPhoto(i)}>
                                    <FaTrash size={12} />
                                  </button>
                                )}
                                {isUploading && (
                                  <div className={step1Styles.uploadOverlayDark}>
                                    <div className={step1Styles.uploadSpinner}></div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className={step1Styles.uploadModalFooter}>
                          {selectedUploadPhotos.length === 0 ? (
                            <>
                              <span style={{ fontSize: '16px', fontWeight: 600 }}>Done</span>
                              <button className={step1Styles.uploadDoneBtn} disabled>Upload</button>
                            </>
                          ) : (
                            <>
                              <button className={step1Styles.uploadCancelBtn} onClick={() => { setShowUploadModal(false); setSelectedUploadPhotos([]); }} disabled={isUploading}>Cancel</button>
                              <button 
                                className={step1Styles.uploadDoneBtnActive} 
                                onClick={() => { 
                                  setIsUploading(true); 
                                  setTimeout(() => { 
                                    setPhotos(prev => [...prev, ...selectedUploadPhotos]); 
                                    setSelectedUploadPhotos([]); 
                                    setIsUploading(false); 
                                    setShowUploadModal(false); 
                                  }, 800); 
                                }}
                                disabled={isUploading}
                              >
                                {isUploading ? 'Uploading...' : 'Upload'}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delete Photo Modal */}
                  {photoToDelete !== null && (
                    <div className={step1Styles.deleteModalOverlay} onClick={() => setPhotoToDelete(null)}>
                      <div className={step1Styles.deleteModal} onClick={(e) => e.stopPropagation()}>
                        <div className={step1Styles.deleteModalHeader}>
                          <div style={{ width: '32px' }}></div>
                          <h2 className={step1Styles.deleteModalTitle}>Delete this photo?</h2>
                          <button className={step1Styles.closeBtn} style={{ position: 'static' }} onClick={() => setPhotoToDelete(null)}>
                            <IoMdClose />
                          </button>
                        </div>
                        <div className={step1Styles.deleteModalBody}>
                          Once you delete this photo from your experience, you can't get it back.
                        </div>
                        <div className={step1Styles.deleteModalFooter}>
                          <button className={step1Styles.deleteCancelBtn} onClick={() => setPhotoToDelete(null)}>Cancel</button>
                          <button 
                            className={step1Styles.deleteConfirmBtn} 
                            onClick={() => { 
                              setPhotos(prev => prev.filter((_, i) => i !== photoToDelete)); 
                              setPhotoCaptions(prev => {
                                const next = { ...prev };
                                delete next[photoToDelete];
                                return next;
                              });
                              setPhotoToDelete(null); 
                            }}
                          >
                            Delete it
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Edit Photo & Caption Modal */}
                  {photoToEdit !== null && photos[photoToEdit] && (
                    <div className={step1Styles.editModalOverlay} onClick={() => setPhotoToEdit(null)}>
                      <div className={step1Styles.editModal} onClick={(e) => e.stopPropagation()}>
                        <div className={step1Styles.editModalHeader}>
                          <div style={{ width: '32px' }}></div>
                          <h2 className={step1Styles.editModalTitle}>Edit photo</h2>
                          <button className={step1Styles.closeBtn} style={{ position: 'static', padding: '4px' }} onClick={() => setPhotoToEdit(null)}>
                            <IoMdClose size={20} />
                          </button>
                        </div>
                        
                        <div className={step1Styles.editModalBody}>
                          <div className={step1Styles.editModalImgWrap}>
                            <img src={photos[photoToEdit]} alt="Edit Preview" className={step1Styles.editModalImg} />
                          </div>
                          <div className={step1Styles.editModalRight}>
                            <div className={step1Styles.editModalLabel}>Caption</div>
                            <div className={step1Styles.editModalDesc}>
                              Mention what's special about this moment or details guests will experience.
                            </div>
                            <textarea 
                              className={step1Styles.editModalTextarea}
                              value={currentCaption}
                              onChange={(e) => setCurrentCaption(e.target.value)}
                              placeholder="e.g. Preparing fresh local ingredients together in the studio"
                              maxLength={150}
                            />
                            <div style={{ fontSize: '12px', color: '#717171', marginTop: '6px', textAlign: 'right' }}>
                              {currentCaption.length}/150
                            </div>
                          </div>
                        </div>

                        <div className={step1Styles.editModalFooter}>
                          <button 
                            className={step1Styles.editModalDeleteBtn} 
                            onClick={() => {
                              const targetIndex = photoToEdit;
                              setPhotoToEdit(null);
                              setPhotoToDelete(targetIndex);
                            }}
                          >
                            Delete photo
                          </button>
                          <button 
                            className={step1Styles.editModalSaveBtn} 
                            onClick={() => {
                              setPhotoCaptions(prev => ({
                                ...prev,
                                [photoToEdit]: currentCaption.trim()
                              }));
                              setPhotoToEdit(null);
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <footer className={styles.fixedFooter} style={{position: 'absolute', justifyContent: 'space-between', display: 'flex', alignItems: 'center'}}>
                  <span className={styles.getTipsText}>Get tips</span>
                  <button
                    className={`${styles.footerNextBtn} ${photos.length < 5 ? styles.footerNextBtnDisabled : ""}`}
                    disabled={photos.length < 5}
                    onClick={() => {
                      if (hostingType === "service") {
                        setServiceStep(105);
                      } else {
                        setServiceStep(14);
                      }
                    }}
                  >
                    Next
                  </button>
                </footer>
              </div>
            ) : serviceStep === 105 ? (
              <>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflowY: 'auto' }}>
                {!hasSeenOfferingsIntro ? (
                  /* Screen 1: Create your offerings Intro with stacked tilted cards */
                  <div className={styles.offeringsIntroWrap}>
                    <div className={styles.offeringsCardStack}>
                      {/* Card 1 (Back) */}
                      <div className={styles.offeringsCard1}>
                        <div className={styles.cardIconBox}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 10h18v4H3z" rx="1" />
                            <path d="M5 14v6M19 14v6M8 14v6M16 14v6" />
                            <path d="M7 10V7a2 2 0 0 1 2-2h1" />
                          </svg>
                        </div>
                        <div className={styles.cardTextContent}>
                          <div className={styles.cardTitleText}>Swedish massage</div>
                          <div className={styles.cardPriceText}>₹70 total</div>
                        </div>
                      </div>

                      {/* Card 2 (Middle) */}
                      <div className={styles.offeringsCard2}>
                        <div className={styles.cardIconBox}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 10h18v4H3z" rx="1" />
                            <path d="M5 14v6M19 14v6M8 14v6M16 14v6" />
                            <path d="M7 10V7a2 2 0 0 1 2-2h1" />
                          </svg>
                        </div>
                        <div className={styles.cardTextContent}>
                          <div className={styles.cardTitleText}>Aromatherapy massage</div>
                          <div className={styles.cardPriceText}>₹100 total</div>
                        </div>
                      </div>

                      {/* Card 3 (Front) */}
                      <div className={styles.offeringsCard3}>
                        <div className={styles.cardIconBox}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 10h18v4H3z" rx="1" />
                            <path d="M5 14v6M19 14v6M8 14v6M16 14v6" />
                            <path d="M7 10V7a2 2 0 0 1 2-2h1" />
                          </svg>
                        </div>
                        <div className={styles.cardTextContent}>
                          <div className={styles.cardTitleText}>Deep tissue massage</div>
                          <div className={styles.cardPriceText}>₹150 total</div>
                        </div>
                      </div>
                    </div>

                    <h1 className={styles.offeringsMainTitle}>
                      Create your offerings
                    </h1>
                    <p className={styles.offeringsMainSub}>
                      These are what guests will book. You’ll add a photo, some details and a price.
                    </p>

                    
                  </div>
                ) : offeringsSubScreen === "offerings" ? (
                  /* Screen 2: Your offerings List Screen */
                  <div className={styles.offeringsListContainer}>
                    <h1 className={styles.offeringsMainTitle} style={{ fontSize: '32px', marginBottom: '8px' }}>
                      Your offerings
                    </h1>
                    <p className={styles.offeringsMainSub} style={{ fontSize: '16px', maxWidth: '420px', marginBottom: '32px' }}>
                      Add at least one. Start with an affordable option to help you attract more guests.
                    </p>

                    {/* Display Created Offerings */}
                    {serviceOfferings.length > 0 && (
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
                        {serviceOfferings.map((offering, idx) => (
                          <div
                            key={idx}
                            className={styles.offeringItemCard}
                            onClick={() => {
                              setEditingOfferingIndex(idx);
                              setOfferingForm({
                                title: offering.title || "",
                                description: offering.description || "",
                                serviceType: offering.serviceType || "Swedish massage",
                                price: offering.price || "",
                                priceType: offering.priceType || "Per guest",
                                maxGuests: offering.maxGuests || "",
                                durationHours: offering.durationHours !== undefined ? offering.durationHours : 1,
                                durationMinutes: offering.durationMinutes !== undefined ? offering.durationMinutes : 0,
                                duration: offering.duration || "60 mins",
                                image: offering.image || "",
                              });
                              setOfferingModalPhase("details");
                              setShowOfferingModal(true);
                            }}
                          >
                            <div className={styles.offeringItemLeft}>
                              <div
                                style={{
                                  width: '52px',
                                  height: '52px',
                                  borderRadius: '12px',
                                  background: '#f7f7f7',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  overflow: 'hidden',
                                }}
                              >
                                {offering.image ? (
                                  <img
                                    src={offering.image}
                                    alt={offering.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                ) : (
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 10h18v4H3z" rx="1" />
                                    <path d="M5 14v6M19 14v6M8 14v6M16 14v6" />
                                    <path d="M7 10V7a2 2 0 0 1 2-2h1" />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <div className={styles.offeringItemTitle}>{offering.title}</div>
                                <div className={styles.offeringItemMeta}>
                                  <span>₹{offering.price || 0} / {offering.priceType === "Fixed price" ? "booking" : "guest"}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* + Add your first offering / Add another offering button */}
                    <div
                      className={styles.offeringsAddBtnBox}
                      onClick={() => {
                        setEditingOfferingIndex(null);
                        setOfferingForm({
                          title: "",
                          description: "",
                          serviceType: "Swedish massage",
                          price: "",
                          priceType: "Per guest",
                          maxGuests: "",
                          duration: "60 mins",
                          image: "",
                        });
                        setOfferingModalPhase("title");
                        setShowOfferingModal(true);
                      }}
                    >
                      <div className={styles.offeringsAddIcon}>
                        <FaPlus size={16} />
                      </div>
                      <span className={styles.offeringsAddText}>
                        {serviceOfferings.length === 0 ? "Add your first offering" : "Add another offering"}
                      </span>
                    </div>

                    
                  </div>
                ) : offeringsSubScreen === "hours" ? (
                  /* Screen 3: Set your business hours */
                  <div className={styles.businessHoursContainer}>
                    <h1 className={styles.offeringsMainTitle} style={{ fontSize: '32px', marginBottom: '8px' }}>
                      Set your business hours
                    </h1>
                    <p className={styles.offeringsMainSub} style={{ fontSize: '16px', maxWidth: '460px', marginBottom: '40px' }}>
                      Your business hours apply to all offerings. You can set custom hours for each offering later.
                    </p>

                    <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
                      {businessHoursList.map((bh, idx) => (
                        <div
                          key={idx}
                          className={styles.businessHoursCard}
                          onClick={() => {
                            setEditingHoursIndex(idx);
                            setHoursForm({
                              days: [...bh.days],
                              daysLabel: bh.daysLabel,
                              from: bh.from,
                              to: bh.to,
                            });
                            setExpandedHoursSection(null);
                            setShowBusinessHoursModal(true);
                          }}
                        >
                          <div>
                            <div className={styles.businessHoursCardTitle}>{bh.daysLabel}</div>
                            <div className={styles.businessHoursCardSub}>{bh.from} – {bh.to}</div>
                          </div>
                          <FaChevronRight size={14} color="#717171" />
                        </div>
                      ))}

                      <button
                        type="button"
                        className={styles.businessHoursAddBtn}
                        onClick={() => {
                          setEditingHoursIndex(null);
                          setHoursForm({
                            days: [],
                            daysLabel: "Select",
                            from: "Choose",
                            to: "Choose",
                          });
                          setExpandedHoursSection(null);
                          setShowBusinessHoursModal(true);
                        }}
                      >
                        Add more hours
                      </button>
                    </div>
                  </div>
                ) : offeringsSubScreen === "discounts" ? (
                  /* Screen 4: Add discounts (Offerings Step) */
                  <div className="d-flex flex-column align-items-center justify-content-center h-100 flex-grow-1 position-relative w-100" style={{ padding: '40px 24px 100px' }}>
                    <div style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <h1 style={{ fontSize: '32px', fontWeight: 600, color: '#222', textAlign: 'center', marginBottom: '48px' }}>
                        Add discounts
                      </h1>

                      <div className={styles.discountContainer} style={{ width: '100%' }}>
                        <div
                          className={`${styles.discountCard} ${limitedTimeDiscount ? styles.discountCardSelected : ''}`}
                          onClick={() => setActiveDiscountModal('limited')}
                        >
                          <div className={styles.discountCardText}>
                            <span className={styles.discountCardTitle}>Limited-time</span>
                            <span className={styles.discountCardSub}>Offer a deal for the next 90 days to encourage your first guests to book.</span>
                          </div>
                          <div className={styles.discountCardIcon}>
                            {limitedTimeDiscount ? <FaCheck /> : <FaPlus />}
                          </div>
                        </div>

                        <div
                          className={`${styles.discountCard} ${earlyBirdDiscount ? styles.discountCardSelected : ''}`}
                          onClick={() => setActiveDiscountModal('early')}
                        >
                          <div className={styles.discountCardText}>
                            <span className={styles.discountCardTitle}>Early-bird</span>
                            <span className={styles.discountCardSub}>Give a lower price to guests who book more than 2 weeks in advance.</span>
                          </div>
                          <div className={styles.discountCardIcon}>
                            {earlyBirdDiscount ? <FaCheck /> : <FaPlus />}
                          </div>
                        </div>

                        <div style={{ marginTop: '24px' }}>
                          <div className={styles.discountSectionTitle}>Large group discounts</div>
                          <div className={styles.discountSectionSub}>Attract larger groups by giving them a discount.</div>

                          <div
                            className={`${styles.discountCard} ${largeGroupDiscount ? styles.discountCardSelected : ''}`}
                            onClick={() => setActiveDiscountModal('large')}
                          >
                            <div className={styles.discountCardText}>
                              <span className={styles.discountCardTitle}>{largeGroupDiscount ? `${largeGroupDiscount}% off for ${largeGroupMinGuests}+ guests` : "Add discount"}</span>
                            </div>
                            <div className={styles.discountCardIcon}>
                              {largeGroupDiscount ? <FaCheck /> : <FaPlus />}
                            </div>
                          </div>
                        </div>

                        <p style={{ color: '#717171', fontSize: '14px', marginTop: '32px', textAlign: 'center' }}>
                          We'll only apply one discount per booking, using the one with the biggest savings for guests.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Screen 5: Review requirements (Offerings Step) */
                  <div className="d-flex flex-column align-items-center justify-content-center h-100 flex-grow-1 position-relative w-100" style={{ padding: '40px 24px 100px' }}>
                    <div style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <h1 style={{ fontSize: '32px', fontWeight: 600, color: '#222', textAlign: 'center', marginBottom: '8px' }}>
                        Review requirements
                      </h1>
                      <p style={{ color: '#717171', fontSize: '16px', marginBottom: '40px', textAlign: 'center' }}>
                        Confirm that your listing meets our standards and requirements.
                      </p>

                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '13px', color: '#222', lineHeight: '1.6' }}>
                        <p style={{ margin: 0 }}>
                          You have read, understand and agree to the <a href="https://www.airbnb.com/help/article/2870" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600, color: '#222' }}>services terms</a>, <a href="https://www.airbnb.com/help/article/2039" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600, color: '#222' }}>host cancellation policy</a> for services and experiences and <a href="https://www.airbnb.com/help/article/1565" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600, color: '#222' }}>cancellation policies</a> for services and experiences. You also acknowledge the <a href="https://www.airbnb.com/help/article/3175" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600, color: '#222' }}>privacy policy</a>.
                        </p>

                        <p style={{ margin: 0 }}>
                          By selecting "I agree", you authorise Airbnb to conduct <a href="https://www.airbnb.com/help/article/3901" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600, color: '#222' }}>quality and standards checks</a>.
                        </p>

                        <p style={{ margin: 0 }}>
                          You attest that you will comply with the <a href="https://www.airbnb.com/help/article/1451" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600, color: '#222' }}>services standards and requirements</a>, all laws and other requirements that apply to your offering, including those specific to:
                        </p>

                        <ul style={{ margin: 0, paddingLeft: '24px' }}>
                          <li>providing <a href="https://www.airbnb.com/help/article/1451" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600, color: '#222' }}>massage services</a>.</li>
                        </ul>

                        <p style={{ margin: 0 }}>
                          You attest that you and third parties used in experiences and services currently hold and will maintain all necessary and customary: (a) authorisations, certificates, licences, permits, registrations or similar, and (b) liability insurance.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Offering Modal (Phase 1: Add a title & Phase 2: Add details) */}
                {showOfferingModal && (
                  <div
                    className={styles.modalOverlay}
                    onClick={() => setShowOfferingModal(false)}
                    style={{ zIndex: 9999 }}
                  >
                    <div
                      className={styles.offeringModalDialog}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Modal Header */}
                      <div className={styles.offeringModalHeader}>
                        <div style={{ width: '32px' }}></div>
                        <span className={styles.offeringModalHeaderTitle}>
                          {offeringModalPhase === "title" ? "Add a title" : "Add details"}
                        </span>
                        <button
                          className={styles.offeringModalCloseBtn}
                          onClick={() => setShowOfferingModal(false)}
                        >
                          <IoMdClose size={20} />
                        </button>
                      </div>

                      {/* Modal Body */}
                      <div className={styles.offeringModalBody}>
                        {offeringModalPhase === "title" ? (
                          /* Phase 1: Add a title */
                          <div className={styles.offeringModalBodyCenter}>
                            <div
                              className={styles.offeringIconLargeBox}
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
                              className={styles.offeringInputGiant}
                              placeholder="Swedish massage"
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
                                className={styles.offeringIconLargeBox}
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
                              className={styles.offeringDetailSection}
                              onClick={() => {
                                setTempDescription(offeringForm.description || "");
                                setActiveOfferingDetailModal("description");
                              }}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className={styles.offeringSectionLabel}>Description</div>
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
                              className={styles.offeringDetailSection}
                              onClick={() => {
                                setTempServiceType(offeringForm.serviceType || "Swedish");
                                setActiveOfferingDetailModal("service_type");
                              }}
                              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                            >
                              <div className={styles.offeringSectionLabel} style={{ margin: 0 }}>Type of service</div>
                              <span style={{ fontSize: '15px', color: offeringForm.serviceType ? '#222' : '#717171', fontWeight: 500 }}>
                                {offeringForm.serviceType || "Select"}
                              </span>
                            </div>

                            {/* Price Section */}
                            <div className={styles.offeringDetailSection}>
                              <div className={styles.offeringSectionLabel}>Price</div>
                              <div className={styles.offeringPriceRow}>
                                <div
                                  className={styles.offeringPriceInputWrap}
                                  onClick={() => {
                                    setTempPrice(offeringForm.price || "");
                                    setIsEditingOfferingPrice(false);
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
                                  className={styles.offeringPriceTypeSelect}
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
                              className={styles.offeringDetailSection}
                              onClick={() => {
                                setTempGuests(parseInt(offeringForm.maxGuests) || 1);
                                setActiveOfferingDetailModal("guests");
                              }}
                              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                            >
                              <div className={styles.offeringSectionLabel} style={{ margin: 0 }}>Number of guests</div>
                              <span style={{ fontSize: '15px', color: offeringForm.maxGuests ? '#222' : '#717171', fontWeight: 500 }}>
                                {offeringForm.maxGuests ? `${offeringForm.maxGuests} guests` : "Set guest limit"}
                              </span>
                            </div>

                            {/* Duration Section */}
                            <div
                              className={styles.offeringDetailSection}
                              onClick={() => {
                                setTempDurationHours(offeringForm.durationHours || 0);
                                setTempDurationMinutes(offeringForm.durationMinutes !== undefined ? offeringForm.durationMinutes : 30);
                                setActiveOfferingDetailModal("duration");
                              }}
                              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                            >
                              <div className={styles.offeringSectionLabel} style={{ margin: 0 }}>Duration</div>
                              <span style={{ fontSize: '15px', color: offeringForm.duration ? '#222' : '#717171', fontWeight: 500 }}>
                                {offeringForm.duration || "Set a duration"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Modal Footer */}
                      <div className={styles.offeringModalFooter}>
                        {offeringModalPhase === "title" ? (
                          <>
                            <span className={styles.offeringGetTips}>Get tips</span>
                            <button
                              className={`${styles.offeringDoneBtn} ${!offeringForm.title.trim() ? styles.offeringDoneBtnDisabled : ""}`}
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
                              className={styles.offeringRemoveBtn}
                              onClick={() => {
                                if (editingOfferingIndex !== null) {
                                  setServiceOfferings((prev) =>
                                    prev.filter((_, idx) => idx !== editingOfferingIndex)
                                  );
                                }
                                setShowOfferingModal(false);
                              }}
                            >
                              Remove
                            </button>
                            <button
                              type="button"
                              className={`${styles.offeringDoneBtn} ${!offeringForm.title.trim() ? styles.offeringDoneBtnDisabled : ""}`}
                              disabled={!offeringForm.title.trim()}
                              onClick={() => {
                                const newOffering = { ...offeringForm };
                                if (editingOfferingIndex !== null) {
                                  setServiceOfferings((prev) =>
                                    prev.map((item, idx) =>
                                      idx === editingOfferingIndex ? newOffering : item
                                    )
                                  );
                                } else {
                                  setServiceOfferings((prev) => [...prev, newOffering]);
                                }
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
                    className={styles.detailSubModalOverlay}
                    onClick={() => setActiveOfferingDetailModal(null)}
                  >
                    <div
                      className={styles.detailSubModalDialog}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={styles.detailSubModalHeader}>
                        <span className={styles.detailSubModalTitle}>Set a duration</span>
                        <button
                          className={styles.detailSubModalClose}
                          onClick={() => setActiveOfferingDetailModal(null)}
                        >
                          <IoMdClose size={18} />
                        </button>
                      </div>

                      <div className={styles.detailSubModalBody}>
                        <div className={styles.detailSelectBoxRow}>
                          {/* Hours Selector */}
                          <div className={styles.detailSelectFieldWrap}>
                            <div className={styles.detailSelectFieldLabel}>Hours</div>
                            <select
                              className={styles.detailSelectNative}
                              value={tempDurationHours}
                              onChange={(e) => setTempDurationHours(parseInt(e.target.value) || 0)}
                            >
                              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
                                <option key={h} value={h}>{h}</option>
                              ))}
                            </select>
                          </div>

                          {/* Minutes Selector */}
                          <div className={styles.detailSelectFieldWrap}>
                            <div className={styles.detailSelectFieldLabel}>Minutes</div>
                            <select
                              className={styles.detailSelectNative}
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
                          className={styles.detailSubModalSaveBtn}
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
                    className={styles.detailSubModalOverlay}
                    onClick={() => setActiveOfferingDetailModal(null)}
                  >
                    <div
                      className={styles.detailSubModalDialog}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={styles.detailSubModalHeader}>
                        <span className={styles.detailSubModalTitle}>Number of guests</span>
                        <button
                          className={styles.detailSubModalClose}
                          onClick={() => setActiveOfferingDetailModal(null)}
                        >
                          <IoMdClose size={18} />
                        </button>
                      </div>

                      <div className={styles.detailSubModalBody}>
                        <div className={styles.detailGuestsCounterWrap}>
                          <button
                            type="button"
                            className={styles.detailGuestsCircleBtn}
                            disabled={tempGuests <= 1}
                            onClick={() => setTempGuests((prev) => Math.max(1, prev - 1))}
                          >
                            <FaMinus size={14} />
                          </button>
                          <span className={styles.detailGuestsBigNumber}>{tempGuests}</span>
                          <button
                            type="button"
                            className={styles.detailGuestsCircleBtn}
                            disabled={tempGuests >= 100}
                            onClick={() => setTempGuests((prev) => Math.min(100, prev + 1))}
                          >
                            <FaPlus size={14} />
                          </button>
                        </div>

                        <div className={styles.detailGuestsHelperText}>
                          You can host up to 100 guests.
                        </div>

                        <button
                          type="button"
                          className={styles.detailSubModalSaveBtn}
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
                    className={styles.detailSubModalOverlay}
                    onClick={() => setActiveOfferingDetailModal(null)}
                  >
                    <div
                      className={styles.detailSubModalDialog}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={styles.detailSubModalHeader}>
                        <span className={styles.detailSubModalTitle}>Choose a pricing option</span>
                        <button
                          className={styles.detailSubModalClose}
                          onClick={() => setActiveOfferingDetailModal(null)}
                        >
                          <IoMdClose size={18} />
                        </button>
                      </div>

                      <div className={styles.detailSubModalBody}>
                        {/* Option 1: Per guest */}
                        <div
                          className={`${styles.detailPricingOptionCard} ${tempPriceType === "Per guest" ? styles.detailPricingOptionCardSelected : ""}`}
                          onClick={() => setTempPriceType("Per guest")}
                        >
                          <div className={styles.detailPricingOptionTitle}>Per guest</div>
                          <div className={styles.detailPricingOptionDesc}>
                            Set the price that each guest will pay and your minimum price per booking.
                          </div>
                          {tempPriceType === "Per guest" && (
                            <div className={styles.detailPricingOptionCheck}>
                              <FaCheck size={16} />
                            </div>
                          )}
                        </div>

                        {/* Option 2: Fixed price */}
                        <div
                          className={`${styles.detailPricingOptionCard} ${tempPriceType === "Fixed price" ? styles.detailPricingOptionCardSelected : ""}`}
                          onClick={() => setTempPriceType("Fixed price")}
                        >
                          <div className={styles.detailPricingOptionTitle}>Fixed price</div>
                          <div className={styles.detailPricingOptionDesc}>
                            Set a price for any number of guests up to your limit.
                          </div>
                          {tempPriceType === "Fixed price" && (
                            <div className={styles.detailPricingOptionCheck}>
                              <FaCheck size={16} />
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          className={styles.detailSubModalSaveBtn}
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
                    className={styles.detailSubModalOverlay}
                    onClick={() => setActiveOfferingDetailModal(null)}
                  >
                    <div
                      className={styles.detailSubModalDialog}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={styles.detailSubModalHeader}>
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
                        <span className={styles.detailSubModalTitle}>
                          {offeringForm.priceType === "Fixed price" ? "Fixed price" : "Price per guest"}
                        </span>
                        <button
                          className={styles.detailSubModalClose}
                          onClick={() => setActiveOfferingDetailModal(null)}
                        >
                          <IoMdClose size={18} />
                        </button>
                      </div>

                      <div className={styles.detailSubModalBody}>
                        {/* Giant Price Display with Clean User Input & Edit Pencil */}
                        <div className={styles.detailPriceCenterInputWrap}>
                          <span className={styles.detailPriceCurrencySymbol}>₹</span>
                          <input
                            type="number"
                            min="0"
                            id="offeringPriceModalInput"
                            placeholder="0"
                            className={styles.detailPriceGiantInput}
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            style={{
                              width: tempPrice ? `${Math.max(1, String(tempPrice).length) * 32 + 15}px` : '40px',
                              maxWidth: '220px',
                            }}
                          />
                          <button
                            type="button"
                            className={styles.offeringPriceEditPencil}
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
                                  <div className={styles.offeringPriceBreakdownBox}>
                                    <div className={styles.offeringBreakdownRow}>
                                      <span>Base price</span>
                                      <span>₹{parsedOfferingPrice}</span>
                                    </div>
                                    <div className={styles.offeringBreakdownRow}>
                                      <span>Airbnb service fee</span>
                                      <span>-₹{offeringServiceFee}</span>
                                    </div>
                                    <div style={{ borderBottom: '1px solid #ebebeb', margin: '4px 0' }} />
                                    <div className={styles.offeringBreakdownRowTotal}>
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
                                    className={styles.offeringShowLessBtn}
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
                                  className={styles.offeringYouEarnBtn}
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
                          <span className={styles.offeringGetTips}>Get tips</span>
                          <button
                            type="button"
                            className={`${styles.offeringDoneBtn} ${!tempPrice ? styles.detailSubModalSaveBtnDisabled : ''}`}
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

                {/* SUB-MODAL 5: Choose a type of massage / service */}
                {activeOfferingDetailModal === "service_type" && (
                  <div
                    className={styles.detailSubModalOverlay}
                    onClick={() => setActiveOfferingDetailModal(null)}
                  >
                    <div
                      className={styles.detailSubModalDialog}
                      style={{ maxWidth: '480px' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={styles.detailSubModalHeader}>
                        <div style={{ width: '30px' }}></div>
                        <span className={styles.detailSubModalTitle} style={{ fontSize: '20px' }}>
                          Choose a type of massage
                        </span>
                        <button
                          className={styles.detailSubModalClose}
                          onClick={() => setActiveOfferingDetailModal(null)}
                        >
                          <IoMdClose size={18} />
                        </button>
                      </div>

                      <div className={styles.detailSubModalBody}>
                        <div className={styles.detailServiceTypeList}>
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
                          ].map((item) => (
                            <div
                              key={item.name}
                              className={`${styles.detailServiceTypeItem} ${tempServiceType === item.name ? styles.detailServiceTypeItemSelected : ""}`}
                              onClick={() => setTempServiceType(item.name)}
                            >
                              <div className={styles.detailServiceTypeIcon}>
                                <span>{item.icon}</span>
                              </div>
                              <span className={styles.detailServiceTypeName}>{item.name}</span>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          className={`${styles.detailSubModalSaveBtn} ${!tempServiceType ? styles.detailSubModalSaveBtnDisabled : ""}`}
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
                    className={styles.detailSubModalOverlay}
                    onClick={() => setActiveOfferingDetailModal(null)}
                  >
                    <div
                      className={styles.detailSubModalDialog}
                      style={{ maxWidth: '580px', width: '92%' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={styles.detailSubModalHeader}>
                        <div style={{ width: '28px' }}></div>
                        <span className={styles.detailSubModalTitle} style={{ fontSize: '16px', fontWeight: 700 }}>
                          Describe your offering
                        </span>
                        <button
                          className={styles.detailSubModalClose}
                          onClick={() => setActiveOfferingDetailModal(null)}
                        >
                          <IoMdClose size={18} />
                        </button>
                      </div>

                      <div className={styles.detailSubModalBody} style={{ padding: '20px 28px 24px', alignItems: 'stretch' }}>
                        <div className={styles.detailDescriptionWrap}>
                          <textarea
                            className={styles.detailDescriptionTextarea}
                            maxLength={500}
                            rows={8}
                            autoFocus
                            placeholder="Tell guests what’s included. For example, “A relaxing full-body massage that uses long, gentle strokes and other techniques to...”"
                            value={tempDescription}
                            onChange={(e) => setTempDescription(e.target.value)}
                          />
                          <div className={styles.detailDescriptionCounter}>
                            {tempDescription.length}/500 available
                          </div>
                        </div>

                        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '16px', marginTop: '16px' }}>
                          <span className={styles.offeringGetTips}>Get tips</span>
                          <button
                            type="button"
                            className={`${styles.offeringDoneBtn} ${!tempDescription.trim() ? styles.detailSubModalSaveBtnDisabled : ''}`}
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
                    className={styles.detailSubModalOverlay}
                    onClick={() => setActiveOfferingDetailModal(null)}
                  >
                    <div
                      className={styles.detailSubModalDialog}
                      style={{ maxWidth: '540px', width: '92%' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={styles.detailSubModalHeader}>
                        <div style={{ width: '28px' }}></div>
                        <span className={styles.detailSubModalTitle} style={{ fontSize: '18px', fontWeight: 700 }}>
                          Choose a photo
                        </span>
                        <button
                          type="button"
                          className={styles.detailSubModalClose}
                          onClick={() => setActiveOfferingDetailModal(null)}
                        >
                          <IoMdClose size={18} />
                        </button>
                      </div>

                      <div className={styles.detailSubModalBody} style={{ padding: '24px 28px 28px', alignItems: 'stretch' }}>
                        {photos && photos.length > 0 ? (
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
                              {photos.map((pic, pIdx) => {
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

                            {offeringForm.image && (
                              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOfferingForm((prev) => ({ ...prev, image: "" }));
                                    setActiveOfferingDetailModal(null);
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#717171',
                                    textDecoration: 'underline',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                  }}
                                >
                                  Reset to default icon
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '36px 16px', color: '#717171' }}>
                            <p style={{ fontSize: '15px', marginBottom: '8px', fontWeight: 600, color: '#222' }}>
                              No photos found
                            </p>
                            <p style={{ fontSize: '13px', lineHeight: 1.4 }}>
                              Please upload photos in the photos step first.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {/* Business Hours Modal */}
                {showBusinessHoursModal && (
                  <div
                    className={styles.detailSubModalOverlay}
                    onClick={() => setShowBusinessHoursModal(false)}
                  >
                    <div
                      className={styles.detailSubModalDialog}
                      style={{ maxWidth: '540px', width: '92%' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={styles.detailSubModalHeader}>
                        <div style={{ width: '28px' }}></div>
                        <span className={styles.detailSubModalTitle} style={{ fontSize: '16px', fontWeight: 700 }}>
                          Business hours
                        </span>
                        <button
                          className={styles.detailSubModalClose}
                          onClick={() => setShowBusinessHoursModal(false)}
                        >
                          <IoMdClose size={18} />
                        </button>
                      </div>

                      <div className={styles.detailSubModalBody} style={{ padding: '24px 28px 24px', alignItems: 'stretch' }}>
                        {/* Days Accordion */}
                        <div
                          className={styles.hoursAccordionItem}
                          onClick={() => setExpandedHoursSection(expandedHoursSection === "days" ? null : "days")}
                        >
                          <div className={styles.hoursAccordionHeader}>
                            <div>
                              <div className={styles.hoursAccordionLabel}>Days</div>
                              <div className={styles.hoursAccordionValue}>
                                {hoursForm.days && hoursForm.days.length > 0 ? hoursForm.daysLabel : "Select"}
                              </div>
                            </div>
                            <FaChevronDown
                              size={14}
                              color="#222"
                              style={{
                                transform: expandedHoursSection === "days" ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.2s ease"
                              }}
                            />
                          </div>

                          {expandedHoursSection === "days" && (
                            <div className={styles.hoursPillGrid} onClick={(e) => e.stopPropagation()}>
                              {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => {
                                const isSelected = hoursForm.days?.includes(day);
                                return (
                                  <button
                                    type="button"
                                    key={day}
                                    className={`${styles.hoursDayPill} ${isSelected ? styles.hoursDayPillSelected : ""}`}
                                    onClick={() => {
                                      let newDays = isSelected
                                        ? hoursForm.days.filter((d) => d !== day)
                                        : [...(hoursForm.days || []), day];
                                      
                                      // Sort by standard week order
                                      const order = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                                      newDays.sort((a, b) => order.indexOf(a) - order.indexOf(b));

                                      let label = "Select";
                                      if (newDays.length === 7) {
                                        label = "Every day";
                                      } else if (
                                        newDays.length === 5 &&
                                        ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].every((d) => newDays.includes(d))
                                      ) {
                                        label = "Monday – Friday";
                                      } else if (
                                        newDays.length === 2 &&
                                        ["Saturday", "Sunday"].every((d) => newDays.includes(d))
                                      ) {
                                        label = "Saturday – Sunday";
                                      } else if (newDays.length > 0) {
                                        label = newDays.join(", ");
                                      }

                                      setHoursForm((prev) => ({
                                        ...prev,
                                        days: newDays,
                                        daysLabel: label,
                                      }));
                                    }}
                                  >
                                    {day}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* From Accordion */}
                        <div
                          className={styles.hoursAccordionItem}
                          onClick={() => setExpandedHoursSection(expandedHoursSection === "from" ? null : "from")}
                        >
                          <div className={styles.hoursAccordionHeader}>
                            <div>
                              <div className={styles.hoursAccordionLabel}>From</div>
                              <div className={styles.hoursAccordionValue}>
                                {hoursForm.from || "Choose"}
                              </div>
                            </div>
                            <FaChevronDown
                              size={14}
                              color="#222"
                              style={{
                                transform: expandedHoursSection === "from" ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.2s ease"
                              }}
                            />
                          </div>

                          {expandedHoursSection === "from" && (
                            <div className={styles.hoursTimeSelectGrid} onClick={(e) => e.stopPropagation()}>
                              {[
                                "6:00 am", "6:30 am", "7:00 am", "7:30 am", "8:00 am", "8:30 am",
                                "9:00 am", "9:30 am", "10:00 am", "10:30 am", "11:00 am", "11:30 am",
                                "12:00 pm", "12:30 pm", "1:00 pm", "1:30 pm", "2:00 pm", "2:30 pm",
                                "3:00 pm", "3:30 pm", "4:00 pm", "4:30 pm", "5:00 pm", "5:30 pm",
                                "6:00 pm", "6:30 pm", "7:00 pm", "7:30 pm", "8:00 pm", "8:30 pm",
                                "9:00 pm", "9:30 pm", "10:00 pm", "10:30 pm", "11:00 pm"
                              ].map((t) => (
                                <button
                                  type="button"
                                  key={t}
                                  className={`${styles.hoursTimePill} ${hoursForm.from === t ? styles.hoursTimePillSelected : ""}`}
                                  onClick={() => {
                                    setHoursForm((prev) => ({ ...prev, from: t }));
                                    setExpandedHoursSection(null);
                                  }}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* To Accordion */}
                        <div
                          className={styles.hoursAccordionItem}
                          onClick={() => setExpandedHoursSection(expandedHoursSection === "to" ? null : "to")}
                        >
                          <div className={styles.hoursAccordionHeader}>
                            <div>
                              <div className={styles.hoursAccordionLabel}>To</div>
                              <div className={styles.hoursAccordionValue}>
                                {hoursForm.to || "Choose"}
                              </div>
                            </div>
                            <FaChevronDown
                              size={14}
                              color="#222"
                              style={{
                                transform: expandedHoursSection === "to" ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.2s ease"
                              }}
                            />
                          </div>

                          {expandedHoursSection === "to" && (
                            <div className={styles.hoursTimeSelectGrid} onClick={(e) => e.stopPropagation()}>
                              {[
                                "6:00 am", "6:30 am", "7:00 am", "7:30 am", "8:00 am", "8:30 am",
                                "9:00 am", "9:30 am", "10:00 am", "10:30 am", "11:00 am", "11:30 am",
                                "12:00 pm", "12:30 pm", "1:00 pm", "1:30 pm", "2:00 pm", "2:30 pm",
                                "3:00 pm", "3:30 pm", "4:00 pm", "4:30 pm", "5:00 pm", "5:30 pm",
                                "6:00 pm", "6:30 pm", "7:00 pm", "7:30 pm", "8:00 pm", "8:30 pm",
                                "9:00 pm", "9:30 pm", "10:00 pm", "10:30 pm", "11:00 pm"
                              ].map((t) => (
                                <button
                                  type="button"
                                  key={t}
                                  className={`${styles.hoursTimePill} ${hoursForm.to === t ? styles.hoursTimePillSelected : ""}`}
                                  onClick={() => {
                                    setHoursForm((prev) => ({ ...prev, to: t }));
                                    setExpandedHoursSection(null);
                                  }}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Actions: Remove & Save */}
                        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', marginTop: '12px' }}>
                          {editingHoursIndex !== null ? (
                            <button
                              type="button"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                textDecoration: 'underline',
                                fontWeight: 600,
                                fontSize: '15px',
                                color: '#222',
                                cursor: 'pointer',
                                padding: 0
                              }}
                              onClick={() => {
                                setBusinessHoursList((prev) => prev.filter((_, idx) => idx !== editingHoursIndex));
                                setShowBusinessHoursModal(false);
                              }}
                            >
                              Remove
                            </button>
                          ) : (
                            <span style={{ fontWeight: 600, fontSize: '15px', color: '#222' }}>
                              Remove
                            </span>
                          )}

                          {(() => {
                            const isSaveValid =
                              hoursForm.days &&
                              hoursForm.days.length > 0 &&
                              hoursForm.from &&
                              hoursForm.from !== "Choose" &&
                              hoursForm.to &&
                              hoursForm.to !== "Choose";

                            return (
                              <button
                                type="button"
                                className={`${styles.offeringDoneBtn} ${!isSaveValid ? styles.detailSubModalSaveBtnDisabled : ""}`}
                                disabled={!isSaveValid}
                                onClick={() => {
                                  if (!isSaveValid) return;
                                  if (editingHoursIndex !== null) {
                                    setBusinessHoursList((prev) => {
                                      const updated = [...prev];
                                      updated[editingHoursIndex] = { ...hoursForm };
                                      return updated;
                                    });
                                  } else {
                                    setBusinessHoursList((prev) => [...prev, { ...hoursForm }]);
                                  }
                                  setShowBusinessHoursModal(false);
                                }}
                              >
                                Save
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 105 Footer */}
              <footer
                className={styles.fixedFooter}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '20px 40px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  background: 'white',
                  borderTop: '1px solid #ebebeb',
                }}
              >
                {!hasSeenOfferingsIntro ? (
                  <button
                    type="button"
                    className={styles.footerNextBtn}
                    onClick={() => setHasSeenOfferingsIntro(true)}
                  >
                    Next
                  </button>
                ) : offeringsSubScreen === "offerings" ? (
                  <button
                    type="button"
                    className={`${styles.footerNextBtn} ${serviceOfferings.length === 0 ? styles.footerNextBtnDisabled : ""}`}
                    disabled={serviceOfferings.length === 0}
                    onClick={() => setOfferingsSubScreen("hours")}
                  >
                    Next
                  </button>
                ) : offeringsSubScreen === "hours" ? (
                  <button
                    type="button"
                    className={styles.footerNextBtn}
                    onClick={() => setOfferingsSubScreen("discounts")}
                  >
                    Next
                  </button>
                ) : offeringsSubScreen === "discounts" ? (
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={styles.getTipsText} onClick={() => setOfferingsSubScreen("requirements")}>Skip</span>
                    <button
                      type="button"
                      className={styles.footerNextBtn}
                      onClick={() => setOfferingsSubScreen("requirements")}
                    >
                      Next
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={styles.footerNextBtn}
                    onClick={() => setServiceStep(22)}
                  >
                    I agree.
                  </button>
                )}
              </footer>

              </>
            ) : serviceStep === 12 ? (
              <div
                className={styles.autoStyle40}
              >
                <div
                  className={styles.autoStyle41}
                >
                  <h1
                    className={styles.autoStyle42}
                  >
                    Is the pin in the right spot?
                  </h1>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#717171",
                      textAlign: "center",
                      marginTop: "-32px",
                      marginBottom: "36px",
                    }}
                  >
                    Your address is only shared with guests after they've made a reservation.
                  </p>

                  <div
                    className={styles.autoStyle43}
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "440px",
                      borderRadius: "20px",
                      overflow: "hidden",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      background: "#f0ede8",
                    }}
                  >
                    {/* Live Dynamic Embedded Map */}
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        [
                          meetupAddress.street,
                          meetupAddress.district,
                          meetupAddress.city || selectedCity || "Jaipur",
                          meetupAddress.state || "Rajasthan",
                          meetupAddress.country || "India"
                        ]
                          .filter(Boolean)
                          .join(", ")
                      )}&t=&z=${mapZoom}&ie=UTF8&iwloc=&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0, position: "absolute", top: 0, left: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Meetup Location Map"
                    ></iframe>

                    {/* Top Address Overlay Card */}
                    <div
                      style={{
                        position: "absolute",
                        top: "16px",
                        left: "16px",
                        right: "72px",
                        background: "white",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                        zIndex: 4,
                        maxWidth: "480px",
                      }}
                    >
                      <FaMapMarkerAlt style={{ color: "#222", flexShrink: 0, fontSize: "16px" }} />
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "#222",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {[
                          meetupAddress.flat,
                          meetupAddress.street,
                          meetupAddress.district,
                          meetupAddress.city || selectedCity,
                          meetupAddress.state,
                          meetupAddress.pin,
                          meetupAddress.country || "India"
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>

                    {/* Center Animated Airbnb Pin */}
                    <div
                      className={styles.autoStyle44}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -100%)",
                        zIndex: 5,
                        pointerEvents: "none",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <FaMapMarkerAlt size={44} color="#FF385C" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }} />
                      <div
                        style={{
                          width: "12px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "rgba(0,0,0,0.3)",
                          marginTop: "-2px",
                        }}
                      ></div>
                    </div>

                    {/* Reposition Pin Guidance pill */}
                    <button
                      className={styles.autoStyle46}
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 4,
                        background: "rgba(34,34,34,0.85)",
                        backdropFilter: "blur(4px)",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "20px",
                        border: "none",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      Drag the map to reposition the pin
                    </button>

                    {/* Zoom In / Zoom Out Controls */}
                    <div
                      className={styles.autoStyle47}
                      style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        display: "flex",
                        flexDirection: "column",
                        background: "white",
                        borderRadius: "10px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                        overflow: "hidden",
                        zIndex: 4,
                      }}
                    >
                      <button
                        className={styles.autoStyle48}
                        style={{
                          padding: "12px",
                          border: "none",
                          borderBottom: "1px solid #ebebeb",
                          background: "white",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={() => setMapZoom((prev) => Math.min(20, prev + 1))}
                        title="Zoom in"
                      >
                        <FaPlus size={14} color="#222" />
                      </button>
                      <button
                        className={styles.autoStyle49}
                        style={{
                          padding: "12px",
                          border: "none",
                          background: "white",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={() => setMapZoom((prev) => Math.max(8, prev - 1))}
                        title="Zoom out"
                      >
                        <FaMinus size={14} color="#222" />
                      </button>
                    </div>
                  </div>
                </div>

                <footer
                  className={`${styles.fixedFooter} ${styles.autoStyle50}`}
                >
                  <button
                    className={styles.footerNextBtn}
                    onClick={() => {
                      setServiceStep(13);
                    }}
                  >
                    Next
                  </button>
                </footer>
              </div>
            ) : serviceStep === 11 ? (
              <div
                className={styles.autoStyle51}
              >
                <div
                  className={styles.autoStyle52}
                >
                  <h1
                    className={styles.autoStyle53}
                  >
                    Confirm location
                  </h1>
                  <p
                    className={styles.autoStyle54}
                  >
                    Make sure this address is correct. You can't change it once
                    you
                    <br />
                    submit your listing.
                  </p>

                  <div
                    className={styles.autoStyle55}
                  >
                    <div
                      className={styles.autoStyle56}
                    >
                      <label
                        className={styles.autoStyle57}
                      >
                        Country/region
                      </label>
                      <select
                        value={meetupAddress.country}
                        onChange={(e) =>
                          setMeetupAddress({
                            ...meetupAddress,
                            country: e.target.value,
                          })
                        }
                        className={styles.autoStyle58}
                      >
                        <option>India</option>
                      </select>
                      <FaChevronDown
                        className={styles.autoStyle59}
                      />
                    </div>

                    {[
                      {
                        key: "flat",
                        label: "Flat, house, etc. (if applicable)",
                      },
                      { key: "street", label: "Street address" },
                      {
                        key: "landmark",
                        label: "Nearby landmark (if applicable)",
                      },
                      {
                        key: "district",
                        label: "District/locality (if applicable)",
                      },
                      { key: "city", label: "City/town" },
                      { key: "state", label: "State/union territory" },
                      { key: "pin", label: "PIN code", isLast: true },
                    ].map((field) => (
                      <div
                        key={field.key}
                        style={{
                          position: "relative",
                          borderBottom: field.isLast
                            ? "none"
                            : "1px solid #b0b0b0",
                        }}
                      >
                        {meetupAddress[field.key] && (
                          <label
                            className={styles.autoStyle60}
                          >
                            {field.label}
                          </label>
                        )}
                        <input
                          placeholder={field.label}
                          value={meetupAddress[field.key]}
                          onChange={(e) =>
                            setMeetupAddress({
                              ...meetupAddress,
                              [field.key]: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: meetupAddress[field.key]
                              ? "20px 16px 6px"
                              : "16px",
                            border: "none",
                            outline: "none",
                            fontSize: "16px",
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div
                    className={styles.autoStyle61}
                  >
                    {meetupAddress.locationName && (
                      <label
                        className={styles.autoStyle62}
                      >
                        Location name (optional)
                      </label>
                    )}
                    <input
                      placeholder="Location name (optional)"
                      value={meetupAddress.locationName}
                      onChange={(e) =>
                        setMeetupAddress({
                          ...meetupAddress,
                          locationName: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: meetupAddress.locationName
                          ? "20px 16px 6px"
                          : "16px",
                        border: "none",
                        outline: "none",
                        fontSize: "16px",
                      }}
                    />
                  </div>
                </div>

                <footer
                  className={`${styles.fixedFooter} ${styles.autoStyle63}`}
                >
                  <button
                    className={`${styles.footerNextBtn} ${!meetupAddress.city || !meetupAddress.state ? styles.footerNextBtnDisabled : ""}`}
                    disabled={!meetupAddress.city || !meetupAddress.state}
                    onClick={() => setServiceStep(12)}
                  >
                    Next
                  </button>
                </footer>
              </div>
            ) : serviceStep === 10 ? (

              <>
                {hostingType !== "service" ? (
                  /* EXPERIENCE FLOW: Where should guests meet you? */
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "40px 24px 100px",
                      position: "relative",
                      width: "100%",
                      maxWidth: "680px",
                      margin: "0 auto",
                    }}
                  >
                    <div style={{ width: "100%", textAlign: "center", marginBottom: "36px" }}>
                      <h1
                        style={{
                          fontSize: "36px",
                          fontWeight: 700,
                          color: "#222",
                          marginBottom: "12px",
                          letterSpacing: "-0.5px",
                        }}
                      >
                        Where should guests meet
                        <br />
                        you?
                      </h1>
                      <p style={{ fontSize: "16px", color: "#717171", margin: 0 }}>
                        Guests will see this address on your listing.
                      </p>
                    </div>

                    <div style={{ width: "100%", maxWidth: "560px", position: "relative" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1.5px solid #222",
                          borderRadius: "999px",
                          padding: "14px 22px",
                          background: "white",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                        }}
                      >
                        <FaSearch size={16} color="#717171" style={{ marginRight: "12px", flexShrink: 0 }} />
                        <input
                          placeholder="Enter an address"
                          value={locationSearch}
                          onChange={(e) => {
                            setLocationSearch(e.target.value);
                            setShowLocationSuggestions(e.target.value.length > 0);
                          }}
                          style={{
                            flex: 1,
                            border: "none",
                            outline: "none",
                            fontSize: "16px",
                            color: "#222",
                            background: "transparent",
                          }}
                        />
                        {locationSearch && (
                          <button
                            type="button"
                            onClick={() => {
                              setLocationSearch("");
                              setShowLocationSuggestions(false);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "4px",
                              color: "#717171",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FaTimes size={12} />
                          </button>
                        )}
                      </div>

                      {/* Use my current location pill */}
                      <div
                        onClick={() => {
                          handleUseCurrentLocationForModal("meeting_place");
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          padding: "16px 8px 8px",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "12px",
                            background: "#f7f7f7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#222",
                            flexShrink: 0,
                          }}
                        >
                          <FaLocationArrow size={16} />
                        </div>
                        <span style={{ fontSize: "15px", fontWeight: 500, color: "#222" }}>
                          Use my current location
                        </span>
                      </div>

                      {/* Suggestions list */}
                      {showLocationSuggestions && dynamicLocationSuggestions.length > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            top: "60px",
                            left: 0,
                            right: 0,
                            maxHeight: "220px",
                            overflowY: "auto",
                            border: "1px solid #ebebeb",
                            borderRadius: "16px",
                            background: "white",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                            zIndex: 10,
                          }}
                        >
                          {dynamicLocationSuggestions.map((sug, i) => (
                            <div
                              key={i}
                              style={{
                                padding: "14px 18px",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                cursor: "pointer",
                                borderTop: i === 0 ? "none" : "1px solid #f0f0f0",
                              }}
                              onClick={() => {
                                handleSelectLocationSuggestion(sug);
                                if (!serviceProvisionType.includes("guests_come")) {
                                  setServiceProvisionType([...serviceProvisionType, "guests_come"]);
                                }
                                setActiveLocationModal("confirm_location");
                              }}
                            >
                              <FaMapMarkerAlt size={16} color="#717171" />
                              <span style={{ fontSize: "14px", color: "#222" }}>{sug}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* SERVICES FLOW: Where do you provide your service? */
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "40px 24px 100px",
                      position: "relative",
                      width: "100%",
                      maxWidth: "680px",
                      margin: "0 auto",
                    }}
                  >
                <div style={{ width: "100%", textAlign: "center", marginBottom: "40px" }}>
                  <h1
                    style={{
                      fontSize: "36px",
                      fontWeight: 700,
                      color: "#222",
                      marginBottom: "12px",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    Where do you provide
                    <br />
                    your service?
                  </h1>
                  <p style={{ fontSize: "16px", color: "#717171", margin: 0 }}>
                    Choose one or both.
                  </p>
                </div>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {/* Option 1: You travel to guests */}
                  <div
                    onClick={() => {
                      if (serviceProvisionType.includes("travel") && serviceArea.startingLocation) {
                        setSelectedManageOption("travel");
                        setActiveLocationModal("manage_location");
                      } else {
                        setActiveLocationModal("service_area");
                      }
                    }}
                    style={{
                      border: serviceProvisionType.includes("travel")
                        ? "2px solid #222"
                        : "1px solid #dddddd",
                      borderRadius: "16px",
                      padding: "24px 28px",
                      cursor: "pointer",
                      background: serviceProvisionType.includes("travel") ? "#f7f7f7" : "#ffffff",
                      transition: "all 0.2s ease",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#222",
                      }}
                    >
                      You travel to guests
                    </div>
                    <div style={{ fontSize: "14px", color: "#717171" }}>
                      {serviceArea.startingLocation
                        ? `Within 1 hour of ${serviceArea.startingLocation.split(",")[0]}`
                        : "Set your service area"}
                    </div>
                  </div>

                  {/* Option 2: Guests come to you */}
                  <div
                    onClick={() => {
                      if (serviceProvisionType.includes("guests_come") && meetupAddress.street) {
                        setSelectedManageOption("guests_come");
                        setActiveLocationModal("manage_location");
                      } else {
                        setActiveLocationModal("meeting_place");
                      }
                    }}
                    style={{
                      border: serviceProvisionType.includes("guests_come")
                        ? "2px solid #222"
                        : "1px solid #dddddd",
                      borderRadius: "16px",
                      padding: "24px 28px",
                      cursor: "pointer",
                      background: serviceProvisionType.includes("guests_come") ? "#f7f7f7" : "#ffffff",
                      transition: "all 0.2s ease",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#222",
                      }}
                    >
                      Guests come to you
                    </div>
                    <div style={{ fontSize: "14px", color: "#717171" }}>
                      {meetupAddress.street
                        ? `${meetupAddress.street}${meetupAddress.city ? `, ${meetupAddress.city}` : ""}`
                        : "Add a meeting place"}
                    </div>
                  </div>
                </div>
              </div>
            )}

               

                {/* MODAL 1: Set your service area ("You travel to guests") */}
                {activeLocationModal === "service_area" && (
                  <div
                    className={styles.modalOverlay}
                    onClick={() => setActiveLocationModal(null)}
                    style={{ zIndex: 9999 }}
                  >
                    <div
                      className={styles.expModalDialog}
                      style={{
                        maxWidth: "600px",
                        borderRadius: "24px",
                        padding: "32px 32px 24px",
                        position: "relative",
                        background: "white",
                        boxShadow: "0 12px 36px rgba(0,0,0,0.18)",
                        width: "90%",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setActiveLocationModal(null)}
                        style={{
                          position: "absolute",
                          right: "24px",
                          top: "24px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "6px",
                          color: "#222",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FaTimes size={16} />
                      </button>

                      <div style={{ textAlign: "center", marginBottom: "28px", padding: "0 24px" }}>
                        <h2
                          style={{
                            fontSize: "24px",
                            fontWeight: 700,
                            color: "#222",
                            marginBottom: "8px",
                          }}
                        >
                          Set your service area
                        </h2>
                        <p style={{ fontSize: "14px", color: "#717171", lineHeight: 1.45, margin: 0 }}>
                          Enter your business address or starting point, then set your maximum drive time.
                        </p>
                      </div>

                      {/* Pill-shaped search bar matching Image 2 */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1.5px solid #222",
                          borderRadius: "999px",
                          padding: "12px 20px",
                          marginBottom: "16px",
                          background: "white",
                        }}
                      >
                        <FaSearch size={16} color="#717171" style={{ marginRight: "12px", flexShrink: 0 }} />
                        <input
                          placeholder="Enter your starting location"
                          value={serviceAreaSearch}
                          onChange={(e) => setServiceAreaSearch(e.target.value)}
                          style={{
                            flex: 1,
                            border: "none",
                            outline: "none",
                            fontSize: "15px",
                            color: "#222",
                            background: "transparent",
                          }}
                        />
                        {serviceAreaSearch && (
                          <button
                            onClick={() => setServiceAreaSearch("")}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "4px",
                              color: "#717171",
                            }}
                          >
                            <FaTimes size={12} />
                          </button>
                        )}
                      </div>

                      {/* Use my current location pill */}
                      <div
                        onClick={() => handleUseCurrentLocationForModal("service_area")}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          padding: "10px 4px",
                          cursor: "pointer",
                          marginBottom: "24px",
                        }}
                      >
                        <div
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "12px",
                            background: "#f7f7f7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#222",
                          }}
                        >
                          <FaLocationArrow size={16} />
                        </div>
                        <span style={{ fontSize: "15px", fontWeight: 500, color: "#222" }}>
                          Use my current location
                        </span>
                      </div>

                      {/* Dynamic suggestions dropdown if typing */}
                      {serviceAreaSearch && serviceAreaSuggestions.length > 0 && (
                        <div
                          style={{
                            maxHeight: "160px",
                            overflowY: "auto",
                            marginBottom: "20px",
                            border: "1px solid #ebebeb",
                            borderRadius: "12px",
                          }}
                        >
                          {serviceAreaSuggestions.map((sug, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                setServiceAreaSearch(sug);
                                setServiceArea((prev) => ({
                                  ...prev,
                                  startingLocation: sug,
                                }));
                              }}
                              style={{
                                padding: "12px 16px",
                                borderBottom: idx < serviceAreaSuggestions.length - 1 ? "1px solid #f0f0f0" : "none",
                                cursor: "pointer",
                                fontSize: "14px",
                                color: "#222",
                              }}
                            >
                              {sug}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Save button matching Image 2 */}
                      <button
                        disabled={!serviceAreaSearch.trim()}
                        onClick={() => {
                          setServiceArea((prev) => ({
                            ...prev,
                            startingLocation: serviceAreaSearch.trim(),
                          }));
                          if (!serviceProvisionType.includes("travel")) {
                            setServiceProvisionType([...serviceProvisionType, "travel"]);
                          }
                          setActiveLocationModal(null);
                        }}
                        style={{
                          width: "100%",
                          padding: "16px",
                          borderRadius: "12px",
                          background: serviceAreaSearch.trim() ? "#222" : "#f2f2f2",
                          color: serviceAreaSearch.trim() ? "#ffffff" : "#b0b0b0",
                          border: "none",
                          fontWeight: 600,
                          fontSize: "16px",
                          cursor: serviceAreaSearch.trim() ? "pointer" : "not-allowed",
                          transition: "all 0.2s",
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}

                {/* MODAL 2: Where should guests meet you? ("Guests come to you") */}
                {activeLocationModal === "meeting_place" && (
                  <div
                    className={styles.modalOverlay}
                    onClick={() => setActiveLocationModal(null)}
                    style={{ zIndex: 9999 }}
                  >
                    <div
                      className={styles.expModalDialog}
                      style={{
                        maxWidth: "600px",
                        borderRadius: "24px",
                        padding: "32px 32px 28px",
                        position: "relative",
                        background: "white",
                        boxShadow: "0 12px 36px rgba(0,0,0,0.18)",
                        width: "90%",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setActiveLocationModal(null)}
                        style={{
                          position: "absolute",
                          right: "24px",
                          top: "24px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "6px",
                          color: "#222",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FaTimes size={16} />
                      </button>

                      <div style={{ textAlign: "center", marginBottom: "28px", padding: "0 24px" }}>
                        <h2
                          style={{
                            fontSize: "24px",
                            fontWeight: 700,
                            color: "#222",
                            marginBottom: "8px",
                          }}
                        >
                          Where should guests meet you?
                        </h2>
                        <p style={{ fontSize: "14px", color: "#717171", margin: 0 }}>
                          Guests will see this address on your listing.
                        </p>
                      </div>

                      {/* Pill-shaped search bar matching Image 3 */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1.5px solid #222",
                          borderRadius: "999px",
                          padding: "12px 20px",
                          marginBottom: "16px",
                          background: "white",
                        }}
                      >
                        <FaSearch size={16} color="#717171" style={{ marginRight: "12px", flexShrink: 0 }} />
                        <input
                          placeholder="Enter an address"
                          value={locationSearch}
                          onChange={(e) => {
                            setLocationSearch(e.target.value);
                            setShowLocationSuggestions(e.target.value.length > 0);
                          }}
                          style={{
                            flex: 1,
                            border: "none",
                            outline: "none",
                            fontSize: "15px",
                            color: "#222",
                            background: "transparent",
                          }}
                        />
                        {locationSearch && (
                          <button
                            onClick={() => {
                              setLocationSearch("");
                              setShowLocationSuggestions(false);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "4px",
                              color: "#717171",
                            }}
                          >
                            <FaTimes size={12} />
                          </button>
                        )}
                      </div>

                      {/* Use my current location pill */}
                      <div
                        onClick={() => {
                          handleUseCurrentLocationForModal("meeting_place");
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          padding: "10px 4px",
                          cursor: "pointer",
                          marginBottom: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "12px",
                            background: "#f7f7f7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#222",
                          }}
                        >
                          <FaLocationArrow size={16} />
                        </div>
                        <span style={{ fontSize: "15px", fontWeight: 500, color: "#222" }}>
                          Use my current location
                        </span>
                      </div>

                      {/* Suggested dropdown list if typing */}
                      {showLocationSuggestions && dynamicLocationSuggestions.length > 0 && (
                        <div
                          style={{
                            maxHeight: "180px",
                            overflowY: "auto",
                            border: "1px solid #ebebeb",
                            borderRadius: "12px",
                            marginTop: "8px",
                          }}
                        >
                          {dynamicLocationSuggestions.map((sug, i) => (
                            <div
                              key={i}
                              style={{
                                padding: "12px 16px",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                cursor: "pointer",
                                borderTop: i === 0 ? "none" : "1px solid #f0f0f0",
                              }}
                              onClick={() => {
                                handleSelectLocationSuggestion(sug);
                                if (!serviceProvisionType.includes("guests_come")) {
                                  setServiceProvisionType([...serviceProvisionType, "guests_come"]);
                                }
                                setActiveLocationModal(null);
                              }}
                            >
                              <FaMapMarkerAlt size={16} color="#717171" />
                              <span style={{ fontSize: "14px", color: "#222" }}>{sug}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* MODAL 3: Confirm location modal triggered by 'Use my current location' */}
                {activeLocationModal === "confirm_location" && (
                  <div
                    className={styles.modalOverlay}
                    onClick={() => setActiveLocationModal(null)}
                    style={{ zIndex: 9999 }}
                  >
                    <div
                      className={styles.expModalDialog}
                      style={{
                        maxWidth: "600px",
                        borderRadius: "24px",
                        padding: "32px 32px 24px",
                        position: "relative",
                        background: "white",
                        boxShadow: "0 12px 36px rgba(0,0,0,0.18)",
                        width: "90%",
                        maxHeight: "90vh",
                        overflowY: "auto",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setActiveLocationModal(null)}
                        style={{
                          position: "absolute",
                          right: "24px",
                          top: "24px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "6px",
                          color: "#222",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FaTimes size={16} />
                      </button>

                      <div style={{ textAlign: "center", marginBottom: "24px", padding: "0 24px" }}>
                        <h2
                          style={{
                            fontSize: "24px",
                            fontWeight: 700,
                            color: "#222",
                            marginBottom: "8px",
                          }}
                        >
                          Confirm location
                        </h2>
                        <p style={{ fontSize: "14px", color: "#717171", margin: 0, lineHeight: 1.45 }}>
                          Make sure this address is correct. You can't change it once you submit your listing.
                        </p>
                      </div>

                      {/* Country dropdown */}
                      <div
                        style={{
                          border: "1px solid #b0b0b0",
                          borderRadius: "12px",
                          padding: "8px 16px",
                          position: "relative",
                          marginBottom: "16px",
                          background: "white",
                        }}
                      >
                        <label style={{ fontSize: "12px", color: "#717171", display: "block" }}>
                          Country/region
                        </label>
                        <select
                          value={meetupAddress.country}
                          onChange={(e) =>
                            setMeetupAddress({
                              ...meetupAddress,
                              country: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            border: "none",
                            outline: "none",
                            fontSize: "16px",
                            background: "transparent",
                            color: "#222",
                            cursor: "pointer",
                            appearance: "none",
                            paddingRight: "24px",
                          }}
                        >
                          <option>India</option>
                          <option>United States</option>
                          <option>United Kingdom</option>
                        </select>
                        <FaChevronDown
                          style={{
                            position: "absolute",
                            right: "16px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            color: "#717171",
                          }}
                        />
                      </div>

                      {/* Stacked Address Fields Group matching Image */}
                      <div
                        style={{
                          border: "1px solid #b0b0b0",
                          borderRadius: "12px",
                          overflow: "hidden",
                          marginBottom: "16px",
                          background: "white",
                        }}
                      >
                        {[
                          { key: "flat", label: "Flat, house, etc. (if applicable)" },
                          { key: "street", label: "Street address" },
                          { key: "landmark", label: "Nearby landmark (if applicable)" },
                          { key: "district", label: "District/locality (if applicable)" },
                          { key: "city", label: "City/town" },
                          { key: "state", label: "State/union territory" },
                          { key: "pin", label: "PIN code", isLast: true },
                        ].map((field) => (
                          <div
                            key={field.key}
                            style={{
                              position: "relative",
                              borderBottom: field.isLast ? "none" : "1px solid #b0b0b0",
                            }}
                          >
                            {meetupAddress[field.key] && (
                              <label
                                style={{
                                  position: "absolute",
                                  top: "6px",
                                  left: "16px",
                                  fontSize: "11px",
                                  color: "#717171",
                                }}
                              >
                                {field.label}
                              </label>
                            )}
                            <input
                              placeholder={field.label}
                              value={meetupAddress[field.key] || ""}
                              onChange={(e) =>
                                setMeetupAddress({
                                  ...meetupAddress,
                                  [field.key]: e.target.value,
                                })
                              }
                              style={{
                                width: "100%",
                                padding: meetupAddress[field.key]
                                  ? "22px 16px 6px"
                                  : "16px",
                                border: "none",
                                outline: "none",
                                fontSize: "15px",
                                color: "#222",
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Location name (optional) field */}
                      <div
                        style={{
                          border: "1px solid #b0b0b0",
                          borderRadius: "12px",
                          position: "relative",
                          marginBottom: "24px",
                          background: "white",
                        }}
                      >
                        {meetupAddress.locationName && (
                          <label
                            style={{
                              position: "absolute",
                              top: "6px",
                              left: "16px",
                              fontSize: "11px",
                              color: "#717171",
                            }}
                          >
                            Location name (optional)
                          </label>
                        )}
                        <input
                          placeholder="Location name (optional)"
                          value={meetupAddress.locationName || ""}
                          onChange={(e) =>
                            setMeetupAddress({
                              ...meetupAddress,
                              locationName: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: meetupAddress.locationName
                              ? "22px 16px 6px"
                              : "16px",
                            border: "none",
                            outline: "none",
                            fontSize: "15px",
                            color: "#222",
                          }}
                        />
                      </div>

                      {/* Next button matching screenshot */}
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button
                          disabled={!meetupAddress.street || !meetupAddress.city || !meetupAddress.state}
                          onClick={() => {
                            if (!serviceProvisionType.includes("guests_come")) {
                              setServiceProvisionType([...serviceProvisionType, "guests_come"]);
                            }
                            setActiveLocationModal(null);
                          }}
                          style={{
                            padding: "14px 32px",
                            borderRadius: "8px",
                            background:
                              meetupAddress.street && meetupAddress.city && meetupAddress.state
                                ? "#222"
                                : "#ebebeb",
                            color:
                              meetupAddress.street && meetupAddress.city && meetupAddress.state
                                ? "#fff"
                                : "#b0b0b0",
                            border: "none",
                            fontWeight: 600,
                            fontSize: "16px",
                            cursor:
                              meetupAddress.street && meetupAddress.city && meetupAddress.state
                                ? "pointer"
                                : "not-allowed",
                            transition: "all 0.2s",
                          }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODAL 4: Manage / Remove Selected Location Modal matching user screenshot */}
                {activeLocationModal === "manage_location" && selectedManageOption && (
                  <div
                    className={styles.modalOverlay}
                    onClick={() => {
                      setActiveLocationModal(null);
                      setSelectedManageOption(null);
                    }}
                    style={{ zIndex: 9999 }}
                  >
                    <div
                      className={styles.expModalDialog}
                      style={{
                        maxWidth: "460px",
                        borderRadius: "28px",
                        padding: "28px 28px 32px",
                        position: "relative",
                        background: "white",
                        boxShadow: "0 16px 44px rgba(0,0,0,0.2)",
                        width: "90%",
                        textAlign: "center",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Top Header */}
                      <div
                        style={{
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "28px",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#222",
                            margin: 0,
                          }}
                        >
                          {selectedManageOption === "travel"
                            ? "You travel to guests"
                            : "Guests come to you"}
                        </h3>
                        <button
                          onClick={() => {
                            setActiveLocationModal(null);
                            setSelectedManageOption(null);
                          }}
                          style={{
                            position: "absolute",
                            right: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "6px",
                            color: "#222",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FaTimes size={16} />
                        </button>
                      </div>

                      {/* Radar / Grid map icon container matching screenshot */}
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "20px",
                          background: "#f0f2eb",
                          backgroundImage:
                            "radial-gradient(#cbe3c6 30%, transparent 31%), linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)",
                          backgroundSize: "80px 80px, 12px 12px, 12px 12px",
                          margin: "0 auto 20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "50%",
                            background: "rgba(34,34,34,0.75)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                          }}
                        >
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              background: "#ffffff",
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Title: Service area or Meeting place */}
                      <h2
                        style={{
                          fontSize: "22px",
                          fontWeight: 700,
                          color: "#222",
                          marginBottom: "8px",
                        }}
                      >
                        {selectedManageOption === "travel"
                          ? "Service area"
                          : "Meeting place"}
                      </h2>

                      {/* Subtitle with dynamic address */}
                      <p
                        style={{
                          fontSize: "15px",
                          color: "#717171",
                          lineHeight: 1.45,
                          maxWidth: "340px",
                          margin: "0 auto 32px",
                        }}
                      >
                        {selectedManageOption === "travel"
                          ? `Within 1 hour of ${
                              serviceArea.startingLocation ||
                              "your selected starting point"
                            }`
                          : [
                              meetupAddress.flat,
                              meetupAddress.street,
                              meetupAddress.district,
                              meetupAddress.city,
                              meetupAddress.state,
                            ]
                              .filter(Boolean)
                              .join(", ") || "Your meeting place"}
                      </p>

                      {/* Edit Button */}
                      <button
                        onClick={() => {
                          if (selectedManageOption === "travel") {
                            setActiveLocationModal("service_area");
                          } else {
                            setActiveLocationModal("meeting_place");
                          }
                          setSelectedManageOption(null);
                        }}
                        style={{
                          width: "100%",
                          padding: "16px",
                          borderRadius: "12px",
                          background: "#222",
                          color: "#ffffff",
                          border: "none",
                          fontWeight: 600,
                          fontSize: "16px",
                          cursor: "pointer",
                          marginBottom: "16px",
                          transition: "background 0.2s ease",
                        }}
                      >
                        Edit
                      </button>

                      {/* Remove Button */}
                      <button
                        onClick={() => {
                          if (selectedManageOption === "travel") {
                            setServiceArea({
                              startingLocation: "",
                              maxDriveTimeMinutes: 30,
                            });
                            setServiceAreaSearch("");
                            setServiceProvisionType((prev) =>
                              prev.filter((t) => t !== "travel")
                            );
                          } else {
                            setMeetupAddress({
                              country: "India",
                              flat: "",
                              street: "",
                              landmark: "",
                              district: "",
                              city: "",
                              state: "",
                              pin: "",
                              locationName: "",
                            });
                            setLocationSearch("");
                            setServiceProvisionType((prev) =>
                              prev.filter((t) => t !== "guests_come")
                            );
                          }
                          setActiveLocationModal(null);
                          setSelectedManageOption(null);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#222",
                          fontWeight: 600,
                          fontSize: "15px",
                          cursor: "pointer",
                          padding: "8px",
                          textDecoration: "underline",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

               <footer
                  className={styles.fixedFooter}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "20px 40px",
                    display: "flex",
                    justifyContent: "flex-end",
                    background: "white",
                    borderTop: "1px solid #ebebeb",
                  }}
                >
                  <button
                    className={`${styles.footerNextBtn} ${
                      hostingType !== "service"
                        ? (!meetupAddress.street && !locationSearch ? styles.footerNextBtnDisabled : "")
                        : (serviceProvisionType.length === 0 ? styles.footerNextBtnDisabled : "")
                    }`}
                    disabled={
                      hostingType !== "service"
                        ? (!meetupAddress.street && !locationSearch)
                        : (serviceProvisionType.length === 0)
                    }
                    onClick={() => {
                      if (hostingType !== "service") {
                        if (meetupAddress.street && meetupAddress.city) {
                          setServiceStep(11);
                        } else if (locationSearch) {
                          handleSelectLocationSuggestion(locationSearch);
                          setServiceStep(11);
                        }
                      } else {
                        if (serviceProvisionType.includes("guests_come")) {
                          setServiceStep(11);
                        } else {
                          setServiceStep(13);
                        }
                      }
                    }}
                  >
                    Next
                  </button>
                </footer>
              </>

             
            ) : serviceStep === 9 ? (
              <div
                className={styles.autoStyle80}
              >
                <div
                  className={styles.autoStyle81}
                >
                  <h1
                    className={styles.autoStyle82}
                  >
                    Let us know a bit more
                    <br />
                    about you
                  </h1>
                  <p
                    className={styles.autoStyle83}
                  >
                    This is required to comply with financial regulations and
                    helps us
                    <br />
                    prevent fraud.
                  </p>

                  <div className={styles.autoStyle84}>
                    <h3
                      className={styles.autoStyle85}
                    >
                      What's your residential address?
                    </h3>
                    <div
                      className={styles.autoStyle86}
                    >
                      Guests won't see this information.
                    </div>

                    <div
                      className={styles.autoStyle87}
                    >
                      <div
                        className={styles.autoStyle88}
                      >
                        <label
                          className={styles.autoStyle89}
                        >
                          Country/region
                        </label>
                        <select
                          value={residentialAddress.country}
                          onChange={(e) =>
                            setResidentialAddress({
                              ...residentialAddress,
                              country: e.target.value,
                            })
                          }
                          className={styles.autoStyle90}
                        >
                          <option>India</option>
                          <option>United States</option>
                          <option>United Kingdom</option>
                        </select>
                        <FaChevronDown
                          className={styles.autoStyle91}
                        />
                      </div>

                      {[
                        {
                          key: "flat",
                          label: "Flat, house, etc. (if applicable)",
                        },
                        { key: "street", label: "Street address" },
                        {
                          key: "landmark",
                          label: "Nearby landmark (if applicable)",
                        },
                        {
                          key: "district",
                          label: "District/locality (if applicable)",
                        },
                        { key: "city", label: "City/town" },
                        { key: "state", label: "State/union territory" },
                        { key: "pin", label: "PIN code", isLast: true },
                      ].map((field) => (
                        <div
                          key={field.key}
                          style={{
                            position: "relative",
                            borderBottom: field.isLast
                              ? "none"
                              : "1px solid #b0b0b0",
                          }}
                        >
                          {residentialAddress[field.key] && (
                            <label
                              className={styles.autoStyle92}
                            >
                              {field.label}
                            </label>
                          )}
                          <input
                            placeholder={field.label}
                            value={residentialAddress[field.key]}
                            onChange={(e) =>
                              setResidentialAddress({
                                ...residentialAddress,
                                [field.key]: e.target.value,
                              })
                            }
                            style={{
                              width: "100%",
                              padding: residentialAddress[field.key]
                                ? "20px 16px 6px"
                                : "16px",
                              border: "none",
                              outline: "none",
                              fontSize: "16px",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3
                      className={styles.autoStyle93}
                    >
                      Are you hosting as a business?
                    </h3>
                    <div
                      className={styles.autoStyle94}
                    >
                      This means your business is most likely registered with
                      your state or government.{" "}
                      <span
                        className={styles.autoStyle95}
                      >
                        Get details
                      </span>
                    </div>

                    <div className={styles.autoStyle96}>
                      <button
                        onClick={() => setHostingAsBusiness("yes")}
                        style={{
                          flex: 1,
                          padding: "24px 16px",
                          borderRadius: "12px",
                          background: "white",
                          border:
                            hostingAsBusiness === "yes"
                              ? "2px solid #222"
                              : "1px solid #b0b0b0",
                          fontWeight: 600,
                          fontSize: "16px",
                          cursor: "pointer",
                          transition: "0.2s",
                        }}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setHostingAsBusiness("no")}
                        style={{
                          flex: 1,
                          padding: "24px 16px",
                          borderRadius: "12px",
                          background: "white",
                          border:
                            hostingAsBusiness === "no"
                              ? "2px solid #222"
                              : "1px solid #b0b0b0",
                          fontWeight: 600,
                          fontSize: "16px",
                          cursor: "pointer",
                          transition: "0.2s",
                        }}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>

                <footer
                  className={`${styles.fixedFooter} ${styles.autoStyle97}`}
                >
                  <button
                    className={`${styles.footerNextBtn} ${!residentialAddress.street || !residentialAddress.city || !residentialAddress.state || !residentialAddress.pin || !hostingAsBusiness || isUpdatingProfileAddress ? styles.footerNextBtnDisabled : ""}`}
                    disabled={
                      !residentialAddress.street ||
                      !residentialAddress.city ||
                      !residentialAddress.state ||
                      !residentialAddress.pin ||
                      !hostingAsBusiness ||
                      isUpdatingProfileAddress
                    }
                    onClick={async () => {
                      if (user?.id || user?.email) {
                        try {
                          setIsUpdatingProfileAddress(true);
                          const res = await updateUserProfileApi({
                            id: user.id,
                            email: user.email,
                            residentialAddress: JSON.stringify(residentialAddress),
                          });
                          if (res?.success && res?.user) {
                            dispatch(updateUser({
                              residentialAddress: res.user.residentialAddress || JSON.stringify(residentialAddress),
                              residential_address: res.user.residential_address || JSON.stringify(residentialAddress),
                            }));
                          }
                        } catch (err) {
                          console.error("Failed to update profile residential address:", err);
                        } finally {
                          setIsUpdatingProfileAddress(false);
                        }
                      }
                      setServiceStep(10);
                    }}
                  >
                    {isUpdatingProfileAddress ? "Saving..." : "Next"}
                  </button>
                </footer>
              </div>
            ) : serviceStep === 8 ? (
              <div
                className={styles.autoStyle98}
              >
                <h1
                  className={styles.autoStyle99}
                >
                  Add your online profiles
                </h1>
                <p
                  className={styles.autoStyle100}
                >
                  To help us confirm your skills, add links to your reviews, any
                  press you've received and your professional website. Guests
                  won't see these.
                </p>

                <div
                  className={styles.autoStyle101}
                >
                  {profiles.length === 0 ? (
                    <div
                      className={styles.autoStyle102}
                    >
                      {/* Decorative tiles */}
                      <div
                        className={styles.autoStyle103}
                      ></div>
                      <div
                        className={styles.autoStyle104}
                      >
                        <FaFacebook size={36} />
                      </div>
                      <div
                        className={styles.autoStyle105}
                      >
                        <FaGoogle size={40} color="#DB4437" />
                      </div>
                      <div
                        className={styles.autoStyle106}
                      >
                        <FaYelp size={36} />
                      </div>
                      <div
                        className={styles.autoStyle107}
                      ></div>
                    </div>
                  ) : (
                    <div
                      className={styles.autoStyle108}
                    >
                      {profiles.map((link, idx) => (
                        <div
                          key={idx}
                          className={styles.autoStyle109}
                          onClick={() => setSelectedProfileIndex(idx)}
                        >
                          {link.toLowerCase().includes("google") ? (
                            <FaGoogle size={24} color="#DB4437" />
                          ) : link.toLowerCase().includes("facebook") ? (
                            <FaFacebook size={24} color="#1877F2" />
                          ) : link.toLowerCase().includes("yelp") ? (
                            <FaYelp size={24} color="#FF1A1A" />
                          ) : (
                            <FaGlobe size={24} color="#717171" />
                          )}
                          <span
                            className={styles.autoStyle110}
                          >
                            {link}
                          </span>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          setProfileLink("");
                          setEditingProfileIndex(null);
                          setShowProfileModal(true);
                        }}
                        className={styles.autoStyle111}
                      >
                        Add another link
                      </button>
                    </div>
                  )}

                  {profiles.length === 0 && (
                    <button
                      onClick={() => {
                        setProfileLink("");
                        setEditingProfileIndex(null);
                        setShowProfileModal(true);
                      }}
                      className={styles.autoStyle112}
                    >
                      Add profile
                    </button>
                  )}
                </div>

                <footer
                  className={`${styles.fixedFooter} ${styles.autoStyle113}`}
                >
                  {profiles.length === 0 ? (
                    <span
                      className={styles.autoStyle114}
                      onClick={() => setServiceStep(9)}
                    >
                      Skip
                    </span>
                  ) : (
                    <div></div>
                  )}
                  <button
                    className={`${styles.footerNextBtn} ${profiles.length === 0 ? styles.footerNextBtnDisabled : ""}`}
                    disabled={profiles.length === 0}
                    onClick={() => setServiceStep(9)}
                  >
                    Next
                  </button>
                </footer>
              </div>
            ) : serviceStep === 7 ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "64px",
                    marginBottom: "24px",
                  }}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user?.firstName || user?.first_name || "Host Profile"}
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        background: "#f6eef3",
                        color: "#882255",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "32px",
                        fontWeight: 600,
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                      }}
                    >
                      {getUserInitials()}
                    </div>
                  )}
                </div>
                <h1
                  style={{
                    fontSize: "32px",
                    fontWeight: 600,
                    color: "#222",
                    textAlign: "center",
                    marginBottom: "8px",
                  }}
                >
                  Showcase your expertise
                </h1>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#717171",
                    textAlign: "center",
                    marginBottom: "48px",
                  }}
                >
                  Let guests know why you're a great host for this{" "}
                  {hostingType === "service" ? "service" : "experience"}.
                </p>

                <div
                  style={{
                    maxWidth: "640px",
                    margin: "0 auto",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "24px",
                      cursor: "pointer",
                    }}
                    onClick={() => setActiveExpertiseModal("intro")}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "8px",
                        background: "#f7f7f7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        color: "#222",
                      }}
                    >
                      {introText ? (
                        <span style={{ fontSize: "16px" }}>✓</span>
                      ) : (
                        <FaPlus size={16} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#222",
                        }}
                      >
                        Intro
                      </div>
                      <div style={{ fontSize: "14px", color: "#717171" }}>
                        {introText || "Add your professional title"}
                      </div>
                    </div>
                    <FaChevronRight color="#717171" size={16} />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "24px",
                      cursor: "pointer",
                    }}
                    onClick={() => setActiveExpertiseModal("qualifications")}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "8px",
                        background: "#f7f7f7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        color: "#222",
                      }}
                    >
                      {qualificationsText ? (
                        <span style={{ fontSize: "16px" }}>✓</span>
                      ) : (
                        <FaPlus size={16} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#222",
                        }}
                      >
                        Qualifications
                      </div>
                      <div style={{ fontSize: "14px", color: "#717171" }}>
                        {qualificationsText ||
                          "Add your training and credentials"}
                      </div>
                    </div>
                    <FaChevronRight color="#717171" size={16} />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "24px",
                      cursor: "pointer",
                    }}
                    onClick={() => setActiveExpertiseModal("recognition")}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "8px",
                        background: "#f7f7f7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        color: "#222",
                      }}
                    >
                      {recognitionText ? (
                        <span style={{ fontSize: "16px" }}>✓</span>
                      ) : (
                        <FaPlus size={16} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#222",
                        }}
                      >
                        Recognition{" "}
                        <span style={{ color: "#717171", fontWeight: 400 }}>
                          (optional)
                        </span>
                      </div>
                      <div style={{ fontSize: "14px", color: "#717171" }}>
                        {recognitionText || "Add a career highlight"}
                      </div>
                    </div>
                    <FaChevronRight color="#717171" size={16} />
                  </div>
                </div>

                <footer
                  className={styles.fixedFooter}
                  style={{
                    position: "absolute",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    Get tips
                  </span>
                  <button
                    className={`${styles.footerNextBtn} ${!introText || !qualificationsText ? styles.footerNextBtnDisabled : ""}`}
                    disabled={!introText || !qualificationsText}
                    onClick={() => setServiceStep(8)}
                  >
                    Next
                  </button>
                </footer>
              </div>
            ) : (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h1
                  style={{
                    fontSize: "32px",
                    fontWeight: 600,
                    color: "#222",
                    textAlign: "center",
                    marginBottom: "24px",
                  }}
                >
                  How many years have you
                  <br />
                  worked in {selectedExperience?.name?.toLowerCase()}?
                </h1>
                <div className={styles.counterWrap}>
                  <button
                    className={styles.counterBtn}
                    onClick={() =>
                      setYearsExperience((prev) => Math.max(0, prev - 1))
                    }
                  >
                    <FaMinus size={16} />
                  </button>
                  <div className={styles.counterValue}>{yearsExperience}</div>
                  <button
                    className={styles.counterBtn}
                    onClick={() => setYearsExperience((prev) => prev + 1)}
                  >
                    <FaPlus size={16} />
                  </button>
                </div>

                <footer
                  className={styles.fixedFooter}
                  style={{ position: "absolute" }}
                >
                  <button
                    className={styles.footerNextBtn}
                    onClick={() => setServiceStep(7)}
                  >
                    Next
                  </button>
                </footer>
              </div>
            )}

            {activeExpertiseModal && (
              <div
                className={styles.modalOverlay}
                onClick={() => setActiveExpertiseModal(null)}
              >
                <div
                  className={styles.expModalDialog}
                  style={{
                    maxWidth: "560px",
                    borderRadius: "24px",
                    minHeight: "400px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div
                    style={{
                      position: "relative",
                      padding: "24px",
                      textAlign: "center",
                    }}
                  >
                    <button
                      onClick={() => setActiveExpertiseModal(null)}
                      style={{
                        position: "absolute",
                        right: "24px",
                        top: "24px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      <FaTimes size={16} />
                    </button>
                    <h2
                      style={{
                        fontSize: "22px",
                        fontWeight: 600,
                        margin: 0,
                        padding: "0 40px",
                      }}
                    >
                      {activeExpertiseModal === "intro"
                        ? "Add your professional title"
                        : activeExpertiseModal === "qualifications"
                          ? "Add your training and credentials"
                          : "Add a career highlight"}
                    </h2>
                  </div>

                  {/* Body */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      padding: "0 48px",
                    }}
                  >
                    <textarea
                      autoFocus
                      placeholder={
                        activeExpertiseModal === "intro"
                          ? "Leather craftsman and atelier owner"
                          : activeExpertiseModal === "qualifications"
                            ? "Share highlights of your career. For example, “I’m a leather craftsman and founder of R-Atelier, where I specialise in creating...”"
                            : "Featured in W Magazine"
                      }
                      value={
                        activeExpertiseModal === "intro"
                          ? introText
                          : activeExpertiseModal === "qualifications"
                            ? qualificationsText
                            : recognitionText
                      }
                      onChange={(e) => {
                        let val = e.target.value;
                        if (activeExpertiseModal === "intro" && val.length > 40)
                          val = val.substring(0, 40);
                        if (
                          activeExpertiseModal === "qualifications" &&
                          val.length > 150
                        )
                          val = val.substring(0, 150);
                        if (
                          activeExpertiseModal === "recognition" &&
                          val.length > 90
                        )
                          val = val.substring(0, 90);

                        if (activeExpertiseModal === "intro") setIntroText(val);
                        else if (activeExpertiseModal === "qualifications")
                          setQualificationsText(val);
                        else setRecognitionText(val);
                      }}
                      style={{
                        width: "100%",
                        border: "none",
                        outline: "none",
                        fontSize:
                          activeExpertiseModal === "qualifications"
                            ? "18px"
                            : "24px",
                        textAlign: "center",
                        resize: "none",
                        color: "#222",
                        minHeight: "80px",
                        overflow: "hidden",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>

                  {/* Character Count */}
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#717171",
                      textAlign: "center",
                      marginBottom: "24px",
                    }}
                  >
                    {activeExpertiseModal === "intro"
                      ? `${introText.length}/40 available`
                      : activeExpertiseModal === "qualifications"
                        ? `${qualificationsText.length}/150 required characters`
                        : `${recognitionText.length}/90 available`}
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 24px",
                      borderTop: "1px solid #ebebeb",
                    }}
                  >
                    {activeExpertiseModal === "recognition" ? (
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          fontWeight: 600,
                          textDecoration: "underline",
                          cursor: "pointer",
                          fontSize: "14px",
                          padding: 0,
                        }}
                        onClick={() => setActiveExpertiseModal(null)}
                      >
                        Cancel
                      </button>
                    ) : (
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "14px",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        Get tips
                      </span>
                    )}
                    <button
                      disabled={
                        !(
                          activeExpertiseModal === "intro"
                            ? introText
                            : activeExpertiseModal === "qualifications"
                              ? qualificationsText
                              : recognitionText
                        ).trim()
                      }
                      style={{
                        padding: "12px 24px",
                        borderRadius: "8px",
                        background: (activeExpertiseModal === "intro"
                          ? introText
                          : activeExpertiseModal === "qualifications"
                            ? qualificationsText
                            : recognitionText
                        ).trim()
                          ? "#222"
                          : "#ebebeb",
                        color: (activeExpertiseModal === "intro"
                          ? introText
                          : activeExpertiseModal === "qualifications"
                            ? qualificationsText
                            : recognitionText
                        ).trim()
                          ? "white"
                          : "#b0b0b0",
                        fontWeight: 600,
                        border: "none",
                        cursor: (activeExpertiseModal === "intro"
                          ? introText
                          : activeExpertiseModal === "qualifications"
                            ? qualificationsText
                            : recognitionText
                        ).trim()
                          ? "pointer"
                          : "not-allowed",
                        transition: "background-color 0.2s",
                      }}
                      onClick={() => setActiveExpertiseModal(null)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showProfileModal && (
              <div
                className={styles.modalOverlay}
                onClick={() => setShowProfileModal(false)}
              >
                <div
                  className={styles.expModalDialog}
                  style={{
                    maxWidth: "560px",
                    borderRadius: "24px",
                    minHeight: "400px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div
                    style={{
                      position: "relative",
                      padding: "24px",
                      textAlign: "center",
                    }}
                  >
                    <button
                      onClick={() => setShowProfileModal(false)}
                      style={{
                        position: "absolute",
                        right: "24px",
                        top: "24px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      <FaTimes size={16} />
                    </button>
                    <h2
                      style={{
                        fontSize: "22px",
                        fontWeight: 600,
                        margin: 0,
                        padding: "0 40px",
                      }}
                    >
                      Add link
                    </h2>
                  </div>

                  {/* Body */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      padding: "0 48px",
                    }}
                  >
                    <textarea
                      autoFocus
                      placeholder="www.yourwebsite.com"
                      value={profileLink}
                      onChange={(e) => setProfileLink(e.target.value)}
                      style={{
                        width: "100%",
                        border: "none",
                        outline: "none",
                        fontSize: "24px",
                        textAlign: "center",
                        resize: "none",
                        color: "#222",
                        minHeight: "80px",
                        overflow: "hidden",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 24px",
                      borderTop: "1px solid #ebebeb",
                    }}
                  >
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        fontWeight: 600,
                        textDecoration: "underline",
                        cursor: "pointer",
                        fontSize: "14px",
                        padding: 0,
                      }}
                      onClick={() => setShowProfileModal(false)}
                    >
                      Cancel
                    </button>

                    <button
                      disabled={!profileLink.trim()}
                      style={{
                        padding: "12px 24px",
                        borderRadius: "8px",
                        background: profileLink.trim() ? "#222" : "#ebebeb",
                        color: profileLink.trim() ? "white" : "#b0b0b0",
                        fontWeight: 600,
                        border: "none",
                        cursor: profileLink.trim() ? "pointer" : "not-allowed",
                        transition: "background-color 0.2s",
                      }}
                      onClick={() => {
                        if (profileLink.trim()) {
                          if (editingProfileIndex !== null) {
                            const newProfiles = [...profiles];
                            newProfiles[editingProfileIndex] =
                              profileLink.trim();
                            setProfiles(newProfiles);
                            setEditingProfileIndex(null);
                          } else {
                            setProfiles([...profiles, profileLink.trim()]);
                          }
                          setProfileLink("");
                          setShowProfileModal(false);
                        }
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedProfileIndex !== null && (
              <div
                className={styles.modalOverlay}
                onClick={() => setSelectedProfileIndex(null)}
              >
                <div
                  className={styles.expModalDialog}
                  style={{
                    maxWidth: "400px",
                    borderRadius: "24px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div
                    style={{
                      position: "relative",
                      textAlign: "center",
                      marginBottom: "40px",
                    }}
                  >
                    <button
                      onClick={() => setSelectedProfileIndex(null)}
                      style={{
                        position: "absolute",
                        right: "0px",
                        top: "0px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      <FaTimes size={16} />
                    </button>
                    <h2
                      style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}
                    >
                      Online profile
                    </h2>
                  </div>

                  {/* Body */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "24px",
                      marginBottom: "40px",
                    }}
                  >
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "24px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {profiles[selectedProfileIndex]
                        .toLowerCase()
                        .includes("google") ? (
                        <FaGoogle size={36} color="#DB4437" />
                      ) : profiles[selectedProfileIndex]
                        .toLowerCase()
                        .includes("facebook") ? (
                        <FaFacebook size={36} color="#1877F2" />
                      ) : profiles[selectedProfileIndex]
                        .toLowerCase()
                        .includes("yelp") ? (
                        <FaYelp size={36} color="#FF1A1A" />
                      ) : (
                        <FaGlobe size={36} color="#717171" />
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#222",
                      }}
                    >
                      {profiles[selectedProfileIndex]}
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    <button
                      style={{
                        padding: "14px",
                        borderRadius: "8px",
                        background: "#222",
                        color: "white",
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        width: "100%",
                      }}
                      onClick={() => {
                        setProfileLink(profiles[selectedProfileIndex]);
                        setEditingProfileIndex(selectedProfileIndex);
                        setSelectedProfileIndex(null);
                        setShowProfileModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        padding: "14px",
                        background: "none",
                        color: "#222",
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                      onClick={() => {
                        setProfiles(
                          profiles.filter((_, i) => i !== selectedProfileIndex),
                        );
                        setSelectedProfileIndex(null);
                      }}
                    >
                      <FaTrash size={14} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : serviceStep === 5 ? (
        <>
          <main className={styles.mainContent}>
            <div className={`container ${styles.subExpContainer}`}>
              <div className="row">
                <div className="col-md-7 d-flex flex-column justify-content-center">
                  <h1
                    className={styles.title}
                    style={{ fontSize: "52px", marginBottom: "16px" }}
                  >
                    Create your listing
                  </h1>
                  <p
                    style={{
                      fontSize: "18px",
                      color: "#717171",
                      lineHeight: "1.4",
                      maxWidth: "440px",
                    }}
                  >
                    Tell us about yourself and the{" "}
                    {hostingType === "service" ? "service" : "experience"} you
                    offer. Our team will review it to confirm it meets our{" "}
                    <a
                      href="#"
                      style={{ color: "#222", textDecoration: "underline" }}
                    >
                      requirements.
                    </a>
                  </p>
                </div>
                <div className="col-md-5 d-flex justify-content-center align-items-center">
                  <div
                    className={styles.subExpLargeCard}
                    style={{ transform: "rotate(-3deg)" }}
                  >
                    <div className={styles.subExpLargeIcon}>
                      {selectedExperience?.icon}
                    </div>
                    <div
                      className={styles.subExpLargeName}
                      style={{ marginBottom: "8px" }}
                    >
                      {selectedExperience?.name}
                    </div>
                    <div style={{ fontSize: "16px", color: "#717171" }}>
                      {selectedCity}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <footer className={styles.fixedFooter}>
            <button
              className={styles.footerNextBtn}
              onClick={() => setServiceStep(6)}
            >
              Get started
            </button>
          </footer>
        </>
      ) : serviceStep === 4 ? (
        <>
          <main className={styles.mainContent}>
            <div className={`container ${styles.subExpContainer}`}>
              <div className="row">
                <div className="col-md-7 d-flex flex-column justify-content-center">
                  <h1 className={styles.subExpTitle}>
                    Where will you offer
                    <br />
                    your {hostingType === "service" ? "service" : "experience"}?
                  </h1>
                  <div
                    className={styles.cityInputBox}
                    onClick={() => setShowCityModal(true)}
                  >
                    <FaMapMarkerAlt
                      style={{
                        marginRight: "16px",
                        fontSize: "20px",
                        color: "#222",
                      }}
                    />
                    <span
                      style={{
                        color: selectedCity ? "#222" : "#717171",
                        fontSize: "16px",
                      }}
                    >
                      {selectedCity || "Enter a city"}
                    </span>
                  </div>
                </div>
                <div className="col-md-5 d-flex justify-content-center align-items-center">
                  <div className={styles.subExpLargeCard}>
                    <div className={styles.subExpLargeIcon}>
                      {selectedExperience?.icon}
                    </div>
                    <div className={styles.subExpLargeName}>
                      {selectedExperience?.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <footer className={styles.fixedFooter}>
            <button
              className={`${styles.footerNextBtn} ${!selectedCity ? styles.footerNextBtnDisabled : ""}`}
              disabled={!selectedCity}
              onClick={() => setServiceStep(5)}
            >
              Next
            </button>
          </footer>

          {showCityModal && (
            <div
              className={styles.modalOverlay}
              onClick={() => setShowCityModal(false)}
            >
              <div
                className={styles.expModalDialog}
                style={{ maxWidth: "560px", minHeight: "400px" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.expModalHeader}>
                  <button
                    className={styles.expModalClose}
                    onClick={() => setShowCityModal(false)}
                  >
                    <FaTimes />
                  </button>
                  <h2 className={styles.expModalTitle}>Enter a city</h2>
                </div>
                <div
                  className={styles.expModalBody}
                  style={{ flexDirection: "column" }}
                >
                  <div className={styles.cityModalInput}>
                    <FaSearch
                      style={{
                        marginRight: "12px",
                        color: "#717171",
                        fontSize: "18px",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Search for cities"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      style={{
                        border: "none",
                        outline: "none",
                        width: "100%",
                        fontSize: "16px",
                      }}
                      autoFocus
                    />
                  </div>
                  <button
                    type="button"
                    className={styles.locationBtn}
                    onClick={handleUseCurrentLocation}
                    disabled={isDetectingLocation}
                   
                  >
                    <div className={styles.locationIconContainer}>
                      <FaLocationArrow className={styles.locationIcon} />
                    </div>
                    <span className={styles.locationText}>
                      {isDetectingLocation ? "Detecting location..." : "Use my current location"}
                    </span>
                  </button>

                  {locationStatusText && (
                    <div style={{ fontSize: "13px", color: "#717171", padding: "0 4px 8px 4px" }}>
                      {locationStatusText}
                    </div>
                  )}

                  <div style={{ marginTop: "8px" }}>
                    {cityInput ? (
                      <div
                        style={{
                          padding: "12px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          borderBottom: "1px solid #ebebeb",
                        }}
                        onClick={() => {
                          setSelectedCity(cityInput);
                          setShowCityModal(false);
                          setCityInput("");
                        }}
                      >
                        <div
                          style={{
                            background: "#f7f7f7",
                            padding: "16px",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FaMapMarkerAlt size={20} color="#222" />
                        </div>
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: "16px",
                            color: "#222",
                          }}
                        >
                          {cityInput}
                        </span>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div style={{ fontSize: "12px", fontWeight: 600, color: "#717171", textTransform: "uppercase", letterSpacing: "0.5px", padding: "8px 0 4px" }}>
                          Suggested cities
                        </div>
                        {[
                          "Jaipur, Rajasthan",
                          "Mumbai, Maharashtra",
                          "New Delhi, Delhi",
                          "Bengaluru, Karnataka",
                          "Goa, India",
                          "Udaipur, Rajasthan"
                        ].map((suggested) => (
                          <div
                            key={suggested}
                            style={{
                              padding: "10px 0px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "14px",
                              borderRadius: "8px",
                              transition: "background 0.15s ease",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "#f7f7f7"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                            onClick={() => {
                              setSelectedCity(suggested);
                              setShowCityModal(false);
                              setCityInput("");
                            }}
                          >
                            <FaMapMarkerAlt size={16} color="#717171" />
                            <span style={{ fontSize: "15px", color: "#222", fontWeight: 500 }}>
                              {suggested}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : serviceStep === 3 ? (
        <>
          <main className={styles.mainContent}>
            <div className={`container ${styles.subExpContainer}`}>
              <div className="row">
                <div className="col-md-7 d-flex flex-column justify-content-center">
                  <h1 className={styles.subExpTitle}>
                    How would you describe
                    <br />
                    your experience?
                  </h1>
                  <div className={styles.subExpGrid}>
                    {selectedExperience?.subOptions.map((opt) => (
                      <button
                        key={opt}
                        className={`${styles.subExpBtn} ${selectedSubExperience === opt ? styles.subExpBtnSelected : ""}`}
                        onClick={() => setSelectedSubExperience(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-md-5 d-flex justify-content-center align-items-center">
                  <div className={styles.subExpLargeCard}>
                    <div className={styles.subExpLargeIcon}>
                      {selectedExperience?.icon}
                    </div>
                    <div className={styles.subExpLargeName}>
                      {selectedExperience?.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <footer className={styles.fixedFooter}>
            <button
              className={`${styles.footerNextBtn} ${!selectedSubExperience ? styles.footerNextBtnDisabled : ""}`}
              disabled={!selectedSubExperience}
              onClick={() => setServiceStep(4)}
            >
              Next
            </button>
          </footer>
        </>
      ) : serviceStep === 1 || serviceStep === 2 ? (
        <main className={styles.mainContent}>
          <div className={`container ${styles.serviceContainer}`}>
            <h1
              className={styles.serviceTitle}
              style={{ whiteSpace: "pre-line" }}
            >
              {serviceStep === 1
                ? "What service will you\nprovide?"
                : "What experience will you\nhost?"}
            </h1>

            <div className={styles.serviceGrid}>
              {(serviceStep === 1
                ? serviceCategories
                : experienceCategories
              ).map((item) => (
                <div
                  key={item.name}
                  className={styles.serviceCard}
                  onClick={() => {
                    setSelectedExperience(item);
                    setSelectedSubExperience(null);
                    setServiceStep(3);
                  }}
                >
                  <div className={styles.serviceCardIcon}>{item.icon}</div>
                  <div className={styles.serviceCardName}>{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : (
        <main className={styles.mainContent}>
          <div className="container h-100">
            <div className="row align-items-center">
              {/* Left Column - Text and Input */}
              <div className="col-lg-6 col-md-12 d-flex flex-column justify-content-center pe-md-5 mb-5 mb-md-0">
                <h1 className={styles.title}>
                  Set up your
                  <br />
                  Airbnb listing
                </h1>

                <p className={styles.subtitle}>
                  It's easy to create a great listing - let's start
                  <br />
                  with your address.
                </p>

                <div
                  className={styles.searchContainer}
                  onClick={() => setShowAddressModal(true)}
                  style={{ cursor: "pointer" }}
                >
                  <FaSearch className={styles.searchIcon} />
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Enter your address"
                    readOnly
                    style={{ cursor: "pointer" }}
                  />
                </div>

                <p className={styles.bottomText}>
                  Not listing a home? Host an{" "}
                  <a
                    href="#"
                    className={styles.link}
                    onClick={(e) => {
                      e.preventDefault();
                      setShowExperienceModal(true);
                    }}
                  >
                    experience or service
                  </a>
                  .
                </p>
              </div>

              {/* Right Column - Video */}
              <div className="col-lg-6 col-md-12 d-flex justify-content-center justify-content-md-end">
                <div className={styles.imageContainer}>
                  <video
                    src="/host_main.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={styles.heroImage}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => {
            setShowAddressModal(false);
            setAddressStep(1);
          }}>
          <div
            className={styles.modalDialog}
            onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              {addressStep === 2 && (
                <button
                  className={styles.backBtn}
                  onClick={() => setAddressStep(1)}
                  style={{
                    position: "absolute",
                    left: "24px",
                    background: "transparent",
                    border: "none",
                    fontSize: "16px",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <FaArrowLeft />
                </button>
              )}
              <h2 className={styles.modalTitle}>
                {addressStep === 1
                  ? "Enter your address"
                  : "Confirm your address"}
              </h2>
              <button
                className={styles.closeBtn}
                onClick={() => {
                  setShowAddressModal(false);
                  setAddressStep(1);
                }}
              >
                <FaTimes />
              </button>
            </div>

            {addressStep === 1 ? (
              <div className={styles.modalBody}>
                <div className={styles.modalSearchContainer}>
                  <FaSearch className={styles.modalSearchIcon} />
                  <input
                    type="text"
                    className={styles.modalSearchInput}
                    placeholder="Enter your address"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleLocationSelect();
                    }}
                  />
                </div>

                <button
                  className={styles.locationBtn}
                  onClick={handleLocationSelect}
                >
                  <div className={styles.locationIconContainer}>
                    <FaLocationArrow className={styles.locationIcon} />
                  </div>
                  <span className={styles.locationText}>
                    Use my current location
                  </span>
                </button>
              </div>
            ) : (
              <div className={styles.modalBody}>
                <div className="border rounded-3 overflow-hidden mb-4">
                  <div className="form-floating border-bottom">
                    <select
                      className="form-select border-0 shadow-none"
                      id="countrySelect"
                      defaultValue="IN"
                    >
                      <option value="IN">India - IN</option>
                      <option value="US">United States - US</option>
                    </select>
                    <label htmlFor="countrySelect">Country/region</label>
                  </div>

                  <div className="form-floating border-bottom">
                    <input
                      type="text"
                      className="form-control border-0 shadow-none"
                      id="flatInput"
                      placeholder="Flat, house, etc."
                    />
                    <label htmlFor="flatInput">
                      Flat, house, etc. (if applicable)
                    </label>
                  </div>

                  <div className="form-floating border-bottom">
                    <input
                      type="text"
                      className="form-control border-0 shadow-none"
                      id="streetInput"
                      placeholder="Street address"
                      defaultValue="1st floor, Vaishali Tower II, 101, Nursery Circle"
                    />
                    <label htmlFor="streetInput">Street address</label>
                  </div>

                  <div className="form-floating border-bottom">
                    <input
                      type="text"
                      className="form-control border-0 shadow-none"
                      id="landmarkInput"
                      placeholder="Nearby landmark"
                    />
                    <label htmlFor="landmarkInput">
                      Nearby landmark (if applicable)
                    </label>
                  </div>

                  <div className="form-floating border-bottom">
                    <input
                      type="text"
                      className="form-control border-0 shadow-none"
                      id="districtInput"
                      placeholder="District/locality"
                      defaultValue="Vaishali Nagar"
                    />
                    <label htmlFor="districtInput">
                      District/locality (if applicable)
                    </label>
                  </div>

                  <div className="form-floating border-bottom">
                    <input
                      type="text"
                      className="form-control border-0 shadow-none"
                      id="cityInput"
                      placeholder="City/town"
                      defaultValue="Jaipur"
                    />
                    <label htmlFor="cityInput">City/town</label>
                  </div>

                  <div className="form-floating border-bottom">
                    <input
                      type="text"
                      className="form-control border-0 shadow-none"
                      id="stateInput"
                      placeholder="State"
                      defaultValue="Rajasthan"
                    />
                    <label htmlFor="stateInput">State/union territory</label>
                  </div>

                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control border-0 shadow-none"
                      id="pinInput"
                      placeholder="PIN code"
                      defaultValue="302021"
                    />
                    <label htmlFor="pinInput">PIN code</label>
                  </div>
                </div>

                <button
                  className={`btn w-100 fw-bold py-3 rounded-3 text-white`}
                  style={{ backgroundColor: "#222222" }}
                  onClick={() => (window.location.href = "/step1")}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Experience/Service Modal */}
      {showExperienceModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowExperienceModal(false)}
        >
          <div
            className={styles.expModalDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.expModalHeader}>
              <button
                className={styles.expModalClose}
                onClick={() => setShowExperienceModal(false)}
              >
                <FaTimes />
              </button>
              <h2 className={styles.expModalTitle}>
                What would you like to host?
              </h2>
            </div>

            <div className={styles.expModalBody}>
              {hostingTypes.map((type) => (
                <div
                  key={type.key || type.id}
                  className={`${styles.expModalCard} ${hostingType === type.key ? styles.expModalCardSelected : ""}`}
                  onClick={() => setHostingType(type.key)}
                >
                  <div className={styles.expModalIcon}>{type.icon || '✨'}</div>
                  <div className={styles.expModalName}>{type.name}</div>
                  {hostingType === type.key && type.description && (
                    <div className={styles.expModalSub}>
                      {type.description}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.expModalFooter}>
              <button
                className={`${styles.footerNextBtn} ${!hostingType ? styles.footerNextBtnDisabled : ""}`}
                disabled={!hostingType}
                onClick={() => {
                  const selectedObj = hostingTypes.find(t => t.key === hostingType);
                  setShowExperienceModal(false);
                  if (selectedObj && selectedObj.target_step) {
                    setServiceStep(selectedObj.target_step);
                  } else if (hostingType === "service") {
                    setServiceStep(1);
                  } else {
                    setServiceStep(2);
                  }
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {activeDiscountModal === 'limited' && (
        <div className={styles.discountModalOverlay}>
          <div className={styles.discountModalDialog}>
            <button className={styles.discountModalClose} onClick={() => setActiveDiscountModal(null)}>
              <FaTimes size={14} />
            </button>
            <div className={styles.discountModalHeader}>
              <span className={styles.discountModalTitle}>Limited-time discount</span>
              <span className={styles.discountModalSub}>Applies to all bookings made in the first 90 days</span>
            </div>
            
            <div className={styles.discountInputWrapper}>
              <input 
                type="text"
                className={styles.discountInputHuge}
                value={limitedTimeDiscount ? limitedTimeDiscount + "%" : "0%"}
                onChange={(e) => setLimitedTimeDiscount(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>
            
            <div className={styles.discountModalFooter}>
              <button 
                className={styles.discountRemoveBtn}
                onClick={() => { setLimitedTimeDiscount(""); setActiveDiscountModal(null); }}
              >
                Remove
              </button>
              <button 
                className={styles.discountSaveBtn}
                onClick={() => setActiveDiscountModal(null)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {activeDiscountModal === 'early' && (
        <div className={styles.discountModalOverlay}>
          <div className={styles.discountModalDialog}>
            <button className={styles.discountModalClose} onClick={() => setActiveDiscountModal(null)}>
              <FaTimes size={14} />
            </button>
            <div className={styles.discountModalHeader}>
              <span className={styles.discountModalTitle}>Early-bird discount</span>
            </div>
            
            <div className={styles.discountInputWrapper} style={{ flexDirection: 'column', gap: '8px' }}>
              <span className={styles.discountInputHuge}>20% off</span>
              <span className={styles.discountModalSub}>Applies to all bookings made more than 2 weeks in advance.</span>
            </div>
            
            <div className={styles.discountModalFooter}>
              <button 
                className={styles.discountRemoveBtn}
                onClick={() => { setEarlyBirdDiscount(""); setActiveDiscountModal(null); }}
              >
                Cancel
              </button>
              <button 
                className={styles.discountSaveBtn}
                onClick={() => { setEarlyBirdDiscount("20"); setActiveDiscountModal(null); }}
              >
                Apply discount
              </button>
            </div>
          </div>
        </div>
      )}

      {activeDiscountModal === 'large' && (
        <div className={styles.discountModalOverlay}>
          <div className={styles.discountModalDialog}>
            <button className={styles.discountModalClose} onClick={() => setActiveDiscountModal(null)}>
              <FaTimes size={14} />
            </button>
            <div className={styles.discountModalHeader}>
              <span className={styles.discountModalTitle}>Large group discount</span>
            </div>
            
            <div className={styles.discountStackedInputBox}>
              <div className={styles.discountStackedInputRow}>
                <span className={styles.discountStackedInputLabel}>Minimum guests</span>
                <input 
                  type="text"
                  className={styles.discountStackedInputField}
                  value={largeGroupMinGuests}
                  onChange={(e) => setLargeGroupMinGuests(e.target.value.replace(/[^0-9]/g, ''))}
                />
              </div>
              <div className={styles.discountStackedInputRow}>
                <span className={styles.discountStackedInputLabel}>Discount %</span>
                <input 
                  type="text"
                  className={styles.discountStackedInputField}
                  value={largeGroupDiscount}
                  onChange={(e) => setLargeGroupDiscount(e.target.value.replace(/[^0-9]/g, ''))}
                />
              </div>
            </div>
            
            <div className={styles.discountModalFooter}>
              <button 
                className={styles.discountRemoveBtn}
                onClick={() => { setLargeGroupMinGuests(""); setLargeGroupDiscount(""); setActiveDiscountModal(null); }}
              >
                Remove
              </button>
              <button 
                className={`${styles.discountSaveBtn} ${!largeGroupMinGuests || !largeGroupDiscount ? styles.discountSaveBtnDisabled : ''}`}
                disabled={!largeGroupMinGuests || !largeGroupDiscount}
                onClick={() => setActiveDiscountModal(null)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {activeDiscountModal === 'limited' && (
        <div className={styles.discountModalOverlay}>
          <div className={styles.discountModalDialog}>
            <button className={styles.discountModalClose} onClick={() => setActiveDiscountModal(null)}>
              <FaTimes size={14} />
            </button>
            <div className={styles.discountModalHeader}>
              <span className={styles.discountModalTitle}>Limited-time discount</span>
              <span className={styles.discountModalSub}>Applies to all bookings made in the first 90 days</span>
            </div>
            
            <div className={styles.discountInputWrapper}>
              <input 
                type="text"
                className={styles.discountInputHuge}
                value={limitedTimeDiscount ? limitedTimeDiscount + "%" : "0%"}
                onChange={(e) => setLimitedTimeDiscount(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>
            
            <div className={styles.discountModalFooter}>
              <button 
                className={styles.discountRemoveBtn}
                onClick={() => { setLimitedTimeDiscount(""); setActiveDiscountModal(null); }}
              >
                Remove
              </button>
              <button 
                className={styles.discountSaveBtn}
                onClick={() => setActiveDiscountModal(null)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {activeDiscountModal === 'early' && (
        <div className={styles.discountModalOverlay}>
          <div className={styles.discountModalDialog}>
            <button className={styles.discountModalClose} onClick={() => setActiveDiscountModal(null)}>
              <FaTimes size={14} />
            </button>
            <div className={styles.discountModalHeader}>
              <span className={styles.discountModalTitle}>Early-bird discount</span>
            </div>
            
            <div className={styles.discountInputWrapper} style={{ flexDirection: 'column', gap: '8px' }}>
              <span className={styles.discountInputHuge}>20% off</span>
              <span className={styles.discountModalSub}>Applies to all bookings made more than 2 weeks in advance.</span>
            </div>
            
            <div className={styles.discountModalFooter}>
              <button 
                className={styles.discountRemoveBtn}
                onClick={() => { setEarlyBirdDiscount(""); setActiveDiscountModal(null); }}
              >
                Cancel
              </button>
              <button 
                className={styles.discountSaveBtn}
                onClick={() => { setEarlyBirdDiscount("20"); setActiveDiscountModal(null); }}
              >
                Apply discount
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
