import React from 'react';
import {
  FaUtensils,
  FaConciergeBell,
  FaSpa,
  FaCamera,
  FaPalette,
  FaWineGlassAlt,
  FaLandmark,
  FaTree,
  FaHiking,
  FaBiking,
  FaMusic,
  FaCar,
  FaTshirt,
  FaBroom,
  FaShieldAlt,
  FaBaby,
  FaPaw,
  FaDumbbell,
  FaHotjar,
  FaHome,
  FaBuilding,
  FaCoffee,
  FaShip,
  FaShuttleVan,
  FaWarehouse,
  FaGlobe,
  FaTractor,
  FaWater,
  FaCampground,
  FaSnowflake,
  FaThermometerHalf,
  FaHotTub,
  FaTv,
  FaWifi,
  FaSwimmer,
  FaFireExtinguisher,
  FaFirstAid,
  FaUmbrellaBeach,
  FaFire,
  FaMapMarkedAlt,
  FaStar,
  FaUsers,
  FaPaintBrush,
  FaExpandArrowsAlt,
  FaRegCalendarCheck,
  FaBolt
} from 'react-icons/fa';
import {
  GiChefToque,
  GiScissors,
  GiLipstick,
  GiMeditation,
  GiMeal,
  GiSoap,
  GiBarn,
  GiCaveEntrance,
  GiIgloo,
  GiCampingTent,
  GiBunkBeds,
  GiWindmill,
  GiTreehouse,
  GiBarracksTent,
  GiPagoda,
  GiTowerFlag,
  GiCaravan,
  GiHut
} from 'react-icons/gi';
import { 
  MdFitnessCenter, 
  MdOutlineHealthAndSafety, 
  MdLocalCafe, 
  MdCabin, 
  MdHouseSiding, 
  MdCastle, 
  MdHolidayVillage,
  MdOutlineCleaningServices,
  MdKitchen,
  MdLocalLaundryService,
  MdOutlineWash
} from 'react-icons/md';
import { TbFridge } from 'react-icons/tb';
import { BiHomeAlt, BiDoorOpen } from 'react-icons/bi';

// Map icon string identifier to React Icon component
export const ICON_MAP = {
  // Amenities (HostStep2 Step 2)
  'snowflake': FaSnowflake,
  'ac': FaSnowflake,
  'cleaning': MdOutlineCleaningServices,
  'essentials': MdOutlineCleaningServices,
  'fridge': TbFridge,
  'heating': FaThermometerHalf,
  'hot_water': FaHotTub,
  'kitchen': MdKitchen,
  'tv': FaTv,
  'dryer': MdLocalLaundryService,
  'washing_machine': MdOutlineWash,
  'wifi': FaWifi,
  'pool': FaSwimmer,
  'swimmer': FaSwimmer,
  'hottub': FaHotTub,
  'patio': FaTree,
  'bbq': FaFire,
  'outdoor_dining': FaUmbrellaBeach,
  'firepit': FaFire,
  'parking': FaCar,
  'beachfront': FaUmbrellaBeach,
  'waterfront': FaMapMarkedAlt,
  'ski_in': FaSnowflake,
  'smoke_alarm': FaFireExtinguisher,
  'first_aid': FaFirstAid,
  'carbon_monoxide': FaFireExtinguisher,

  // Listing Highlights (HostStep2 Step 5)
  'star': FaStar,
  'users': FaUsers,
  'paint': FaPaintBrush,
  'paintbrush': FaPaintBrush,
  'map': FaMapMarkedAlt,
  'expand': FaExpandArrowsAlt,
  'arrows': FaExpandArrowsAlt,

  // Services
  'utensils': FaUtensils,
  'catering': FaUtensils,
  'chef': GiChefToque,
  'hair': GiScissors,
  'makeup': GiLipstick,
  'massage': FaSpa,
  'spa': GiSoap,
  'fitness': MdFitnessCenter,
  'gym': FaDumbbell,
  'photo': FaCamera,
  'photography': FaCamera,
  'meals': GiMeal,
  'service_cleaning': FaBroom,
  'laundry': FaTshirt,
  'driver': FaCar,
  'security': FaShieldAlt,
  'babysitting': FaBaby,
  'pets': FaPaw,
  'cafe': MdLocalCafe,

  // Property Types (HostStep1 Step 2)
  'house': FaHome,
  'home': FaHome,
  'apartment': FaBuilding,
  'flat': FaBuilding,
  'building': FaBuilding,
  'barn': GiBarn,
  'bnb': FaCoffee,
  'coffee': FaCoffee,
  'boat': FaShip,
  'ship': FaShip,
  'cabin': MdCabin,
  'campervan': FaShuttleVan,
  'van': FaShuttleVan,
  'casa': FaHome,
  'castle': MdCastle,
  'cave': GiCaveEntrance,
  'container': FaWarehouse,
  'cycladic': GiIgloo,
  'dammuso': MdHouseSiding,
  'dome': GiCampingTent,
  'tent': GiCampingTent,
  'earth_home': FaGlobe,
  'earth': FaGlobe,
  'farm': FaTractor,
  'tractor': FaTractor,
  'guesthouse': BiHomeAlt,
  'hotel': FaBuilding,
  'houseboat': FaWater,
  'minsu': MdHolidayVillage,
  'riad': MdHolidayVillage,
  'ryokan': GiPagoda,
  'shepherds-hut': GiHut,
  'tiny-home': FaHome,
  'tower': GiTowerFlag,
  'tree-house': GiTreehouse,
  'trullo': MdHouseSiding,
  'windmill': GiWindmill,
  'yurt': GiBarracksTent,

  // Place Types (HostStep1 Step 3)
  'entire': BiHomeAlt,
  'room': BiDoorOpen,
  'door': BiDoorOpen,
  'shared': GiBunkBeds,
  'bunkbeds': GiBunkBeds,
  'bunkbed': GiBunkBeds,
  'bed': GiBunkBeds,

  // Experiences & Types
  'art': FaPalette,
  'wellness': GiMeditation,
  'yoga': GiMeditation,
  'food': FaWineGlassAlt,
  'drink': FaWineGlassAlt,
  'history': FaLandmark,
  'nature': FaTree,
  'hiking': FaHiking,
  'biking': FaBiking,
  'music': FaMusic,
  'adventure': FaHotjar,
  'service': FaConciergeBell,
  'experience': FaHotjar,
  '🎈': FaHotjar,
  '🛎️': FaConciergeBell,
  '🛎': FaConciergeBell,
};

// Available icons list for Admin dropdown / selector
export const AVAILABLE_ICONS = [
  // Property Types
  { key: 'home', label: 'House / Home', icon: FaHome },
  { key: 'apartment', label: 'Apartment / Flat', icon: FaBuilding },
  { key: 'barn', label: 'Barn', icon: GiBarn },
  { key: 'bnb', label: 'Bed & Breakfast', icon: FaCoffee },
  { key: 'boat', label: 'Boat / Yacht', icon: FaShip },
  { key: 'cabin', label: 'Cabin / Chalet', icon: MdCabin },
  { key: 'campervan', label: 'Campervan / RV', icon: FaShuttleVan },
  { key: 'casa', label: 'Casa Particular', icon: FaHome },
  { key: 'castle', label: 'Castle / Estate', icon: MdCastle },
  { key: 'cave', label: 'Cave', icon: GiCaveEntrance },
  { key: 'container', label: 'Container', icon: FaWarehouse },
  { key: 'cycladic', label: 'Cycladic Home', icon: GiIgloo },
  { key: 'dammuso', label: 'Dammuso', icon: MdHouseSiding },
  { key: 'dome', label: 'Dome', icon: GiCampingTent },
  { key: 'earth_home', label: 'Earth Home', icon: FaGlobe },
  { key: 'farm', label: 'Farm / Ranch', icon: FaTractor },
  { key: 'guesthouse', label: 'Guest House', icon: BiHomeAlt },
  { key: 'hotel', label: 'Hotel / Boutique', icon: FaBuilding },
  { key: 'houseboat', label: 'Houseboat', icon: FaWater },
  { key: 'minsu', label: 'Minsu', icon: MdHolidayVillage },
  { key: 'riad', label: 'Riad', icon: MdHolidayVillage },
  { key: 'ryokan', label: 'Ryokan', icon: GiPagoda },
  { key: 'shepherds-hut', label: 'Shepherd’s Hut', icon: GiHut },
  { key: 'tent', label: 'Tent', icon: FaCampground },
  { key: 'tiny-home', label: 'Tiny Home', icon: FaHome },
  { key: 'tower', label: 'Tower', icon: GiTowerFlag },
  { key: 'tree-house', label: 'Treehouse', icon: GiTreehouse },
  { key: 'trullo', label: 'Trullo', icon: MdHouseSiding },
  { key: 'windmill', label: 'Windmill', icon: GiWindmill },
  { key: 'yurt', label: 'Yurt', icon: GiBarracksTent },

  // Services & Experiences
  { key: 'catering', label: 'Catering / Dining', icon: FaUtensils },
  { key: 'chef', label: 'Private Chef', icon: GiChefToque },
  { key: 'massage', label: 'Massage Therapy', icon: FaSpa },
  { key: 'hair', label: 'Hairstyling', icon: GiScissors },
  { key: 'makeup', label: 'Make-up Glam', icon: GiLipstick },
  { key: 'spa', label: 'Spa & Wellness', icon: GiSoap },
  { key: 'fitness', label: 'Personal Training / Gym', icon: MdFitnessCenter },
  { key: 'photo', label: 'Photography & Shoot', icon: FaCamera },
  { key: 'meals', label: 'Prepared Meals', icon: GiMeal },
  { key: 'art', label: 'Art and Design', icon: FaPalette },
  { key: 'wellness', label: 'Fitness & Wellness / Yoga', icon: GiMeditation },
  { key: 'food', label: 'Food & Drink Tours', icon: FaWineGlassAlt },
  { key: 'history', label: 'History & Culture', icon: FaLandmark },
  { key: 'nature', label: 'Nature & Outdoors', icon: FaTree },
  { key: 'hiking', label: 'Hiking & Adventure', icon: FaHiking },
  { key: 'cleaning', label: 'Cleaning Service', icon: FaBroom },
  { key: 'driver', label: 'Chauffeur / Driver', icon: FaCar },
  { key: 'pets', label: 'Pet Sitting & Care', icon: FaPaw },
  { key: 'service', label: 'General Concierge', icon: FaConciergeBell },

  // Amenities
  { key: 'wifi', label: 'Wifi', icon: FaWifi },
  { key: 'snowflake', label: 'Air conditioning', icon: FaSnowflake },
  { key: 'kitchen', label: 'Kitchen', icon: MdKitchen },
  { key: 'tv', label: 'TV', icon: FaTv },
  { key: 'fridge', label: 'Fridge', icon: TbFridge },
  { key: 'heating', label: 'Heating', icon: FaThermometerHalf },
  { key: 'hot_water', label: 'Hot water', icon: FaHotTub },
  { key: 'dryer', label: 'Tumble dryer', icon: MdLocalLaundryService },
  { key: 'washing_machine', label: 'Washing machine', icon: MdOutlineWash },
  { key: 'pool', label: 'Pool / Swimming', icon: FaSwimmer },
  { key: 'hottub', label: 'Hot tub', icon: FaHotTub },
  { key: 'patio', label: 'Patio / Balcony', icon: FaTree },
  { key: 'bbq', label: 'BBQ grill', icon: FaFire },
  { key: 'outdoor_dining', label: 'Outdoor dining', icon: FaUmbrellaBeach },
  { key: 'firepit', label: 'Fire pit', icon: FaFire },
  { key: 'parking', label: 'Free parking', icon: FaCar },
  { key: 'beachfront', label: 'Beachfront', icon: FaUmbrellaBeach },
  { key: 'waterfront', label: 'Waterfront', icon: FaMapMarkedAlt },
  { key: 'ski_in', label: 'Ski-in/ski-out', icon: FaSnowflake },
  { key: 'smoke_alarm', label: 'Smoke alarm', icon: FaFireExtinguisher },
  { key: 'first_aid', label: 'First aid kit', icon: FaFirstAid },
  { key: 'fire_extinguisher', label: 'Fire extinguisher', icon: FaFireExtinguisher },
  { key: 'carbon_monoxide', label: 'Carbon monoxide alarm', icon: FaFireExtinguisher },

  // Listing Highlights
  { key: 'spa', label: 'Peaceful / Spa', icon: FaSpa },
  { key: 'star', label: 'Unique / Star', icon: FaStar },
  { key: 'users', label: 'Family-friendly / Users', icon: FaUsers },
  { key: 'paint', label: 'Stylish / Paint', icon: FaPaintBrush },
  { key: 'map', label: 'Central / Map', icon: FaMapMarkedAlt },
  { key: 'expand', label: 'Spacious / Expand', icon: FaExpandArrowsAlt },

  // Booking Settings (Step 3 Step 2)
  { key: 'calendar', label: 'Booking / Calendar', icon: FaRegCalendarCheck },
  { key: 'bolt', label: 'Instant Book / Lightning', icon: FaBolt }
];

// Add booking settings to ICON_MAP
ICON_MAP['calendar'] = FaRegCalendarCheck;
ICON_MAP['regcalendarcheck'] = FaRegCalendarCheck;
ICON_MAP['bolt'] = FaBolt;

/**
 * Universal Category Icon Renderer for Admin
 */
export function renderCategoryIcon(iconKey, props = {}) {
  if (!iconKey) return <FaConciergeBell {...props} />;

  const cleanKey = String(iconKey).toLowerCase().replace(/^(fa|gi|md)/, '').trim();

  const IconComponent = ICON_MAP[cleanKey] || ICON_MAP[iconKey];
  if (IconComponent) {
    return <IconComponent {...props} />;
  }

  for (const [key, Comp] of Object.entries(ICON_MAP)) {
    if (cleanKey.includes(key)) {
      return <Comp {...props} />;
    }
  }

  return <span style={{ fontSize: props.size || '1.2em' }}>{iconKey}</span>;
}
