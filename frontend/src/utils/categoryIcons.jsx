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
  FaCampground
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
import { MdFitnessCenter, MdOutlineHealthAndSafety, MdLocalCafe, MdCabin, MdHouseSiding, MdCastle, MdHolidayVillage } from 'react-icons/md';
import { BiHomeAlt, BiDoorOpen } from 'react-icons/bi';

// Map icon string identifier to React Icon component
export const ICON_MAP = {
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
  'cleaning': FaBroom,
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
  { key: 'catering', label: 'Catering / Food', icon: FaUtensils },
  { key: 'chef', label: 'Private Chef', icon: GiChefToque },
  { key: 'massage', label: 'Massage Therapy', icon: FaSpa },
  { key: 'hair', label: 'Hairstyling', icon: GiScissors },
  { key: 'makeup', label: 'Make-up Glam', icon: GiLipstick },
  { key: 'spa', label: 'Spa Treatments', icon: GiSoap },
  { key: 'fitness', label: 'Personal Training / Gym', icon: MdFitnessCenter },
  { key: 'photo', label: 'Photography', icon: FaCamera },
  { key: 'meals', label: 'Prepared Meals', icon: GiMeal },
  { key: 'art', label: 'Art and Design', icon: FaPalette },
  { key: 'wellness', label: 'Fitness & Wellness / Yoga', icon: GiMeditation },
  { key: 'food', label: 'Food & Drink Tours', icon: FaWineGlassAlt },
  { key: 'history', label: 'History & Culture', icon: FaLandmark },
  { key: 'nature', label: 'Nature & Outdoors', icon: FaTree },
  { key: 'hiking', label: 'Hiking & Trails', icon: FaHiking },
  { key: 'cleaning', label: 'Cleaning Service', icon: FaBroom },
  { key: 'driver', label: 'Chauffeur / Driver', icon: FaCar },
  { key: 'pets', label: 'Pet Care', icon: FaPaw },
  { key: 'service', label: 'General Service', icon: FaConciergeBell }
];

/**
 * Universal Category Icon Renderer
 * Renders React-Icon if matching key or emoji fallback seamlessly
 */
export function renderCategoryIcon(iconKey, props = {}) {
  if (!iconKey) return <FaConciergeBell {...props} />;

  // Normalize key (e.g., 'chef', 'FaUtensils', or lowercase match)
  const cleanKey = String(iconKey).toLowerCase().replace(/^(fa|gi|md)/, '').trim();

  // 1. Direct match or alias in ICON_MAP
  const IconComponent = ICON_MAP[cleanKey] || ICON_MAP[iconKey];
  if (IconComponent) {
    return <IconComponent {...props} />;
  }

  // 2. Keyword check (e.g. if key contains 'chef' or 'art')
  for (const [key, Comp] of Object.entries(ICON_MAP)) {
    if (cleanKey.includes(key)) {
      return <Comp {...props} />;
    }
  }

  // 3. Fallback: If it's still an emoji string or plain text, render as text gracefully
  return <span style={{ fontSize: props.size || '1.2em' }}>{iconKey}</span>;
}
