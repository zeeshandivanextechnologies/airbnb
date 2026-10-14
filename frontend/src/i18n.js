import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Common multi-language translations dictionary
const resources = {
  English: {
    translation: {
      "Where": "Where",
      "Check in": "Check in",
      "Check out": "Check out",
      "Who": "Who",
      "Search": "Search",
      "Prime beach spot": "Prime beach spot",
      "Mountain retreat": "Mountain retreat",
      "Cultural hub": "Cultural hub",
      "Historic getaway": "Historic getaway",
      "Tropical paradise": "Tropical paradise",
      "Romantic escape": "Romantic escape",
      "Island adventure": "Island adventure",
      "Coastal charm": "Coastal charm",
      "Lush greenery": "Lush greenery",
      "Home": "Home",
      "Experiences": "Experiences",
      "Services": "Services",
      "Airbnb your home": "Airbnb your home",
      "Languages & translation": "Languages & translation",
      "Preferred language": "Preferred language",
      "Automatic translation": "Automatic translation",
      "Other languages you know": "Other languages you know",
      "Time zone": "Time zone",
      "Personal information": "Personal information",
      "Login & security": "Login & security",
      "Privacy": "Privacy",
      "Notifications": "Notifications",
      "Taxes": "Taxes",
      "Payments": "Payments"
    }
  },
  Hindi: {
    translation: {
      "Where": "कहाँ जाना है",
      "Check in": "चेक इन",
      "Check out": "चेक आउट",
      "Who": "कौन",
      "Search": "खोजें",
      "Prime beach spot": "शानदार बीच स्थल",
      "Mountain retreat": "पहाड़ी इलाका",
      "Cultural hub": "सांस्कृतिक केंद्र",
      "Historic getaway": "ऐतिहासिक स्थल",
      "Tropical paradise": "उष्णकटिबंधीय स्वर्ग",
      "Romantic escape": "रोमांटिक स्थल",
      "Island adventure": "द्वीप साहसिक यात्रा",
      "Coastal charm": "तटीय आकर्षण",
      "Lush greenery": "हरी-भरी हरियाली",
      "Home": "होम",
      "Experiences": "अनुभव",
      "Services": "सेवाएं",
      "Airbnb your home": "अपना घर Airbnb पर जोड़ें",
      "Languages & translation": "भाषाएँ और अनुवाद",
      "Preferred language": "पसंदीदा भाषा",
      "Automatic translation": "स्वचालित अनुवाद",
      "Other languages you know": "अन्य भाषाएँ जो आप जानते हैं",
      "Time zone": "समय क्षेत्र",
      "Personal information": "व्यक्तिगत जानकारी",
      "Login & security": "लॉगिन और सुरक्षा",
      "Privacy": "गोपनीयता",
      "Notifications": "सूचनाएं",
      "Taxes": "कर (Taxes)",
      "Payments": "भुगतान"
    }
  },
  Spanish: {
    translation: {
      "Where": "Dónde",
      "Check in": "Llegada",
      "Check out": "Salida",
      "Who": "Quién",
      "Search": "Buscar",
      "Prime beach spot": "Destino de playa ideal",
      "Mountain retreat": "Retiro en la montaña",
      "Cultural hub": "Centro cultural",
      "Historic getaway": "Escapada histórica",
      "Tropical paradise": "Paraíso tropical",
      "Romantic escape": "Escapada romántica",
      "Island adventure": "Aventura en la isla",
      "Coastal charm": "Encanto costero",
      "Lush greenery": "Naturaleza exuberante",
      "Home": "Inicio",
      "Experiences": "Experiencias",
      "Services": "Servicios",
      "Airbnb your home": "Pon tu espacio en Airbnb",
      "Languages & translation": "Idiomas y traducción",
      "Preferred language": "Idioma preferido",
      "Automatic translation": "Traducción automática",
      "Other languages you know": "Otros idiomas que conoces",
      "Time zone": "Zona horaria",
      "Personal information": "Información personal",
      "Login & security": "Inicio de sesión y seguridad",
      "Privacy": "Privacidad",
      "Notifications": "Notificaciones",
      "Taxes": "Impuestos",
      "Payments": "Pagos"
    }
  },
  French: {
    translation: {
      "Where": "Où",
      "Check in": "Arrivée",
      "Check out": "Départ",
      "Who": "Qui",
      "Search": "Rechercher",
      "Prime beach spot": "Plage de rêve",
      "Mountain retreat": "Refuge en montagne",
      "Cultural hub": "Carrefour culturel",
      "Historic getaway": "Escapade historique",
      "Tropical paradise": "Paradis tropical",
      "Romantic escape": "Escapade romantique",
      "Island adventure": "Aventure insulaire",
      "Coastal charm": "Charme côtier",
      "Lush greenery": "Verdure luxuriante",
      "Home": "Accueil",
      "Experiences": "Expériences",
      "Services": "Services",
      "Airbnb your home": "Devenir hôte sur Airbnb",
      "Languages & translation": "Langues et traduction",
      "Preferred language": "Langue préférée",
      "Automatic translation": "Traduction automatique",
      "Other languages you know": "Autres langues que vous connaissez",
      "Time zone": "Fuseau horaire",
      "Personal information": "Informations personnelles",
      "Login & security": "Connexion et sécurité",
      "Privacy": "Confidentialité",
      "Notifications": "Notifications",
      "Taxes": "Taxes et impôts",
      "Payments": "Paiements"
    }
  },
  German: {
    translation: {
      "Where": "Wohin",
      "Check in": "Check-in",
      "Check out": "Check-out",
      "Who": "Wer",
      "Search": "Suchen",
      "Prime beach spot": "Bester Strandort",
      "Mountain retreat": "Rückzugsort in den Bergen",
      "Cultural hub": "Kulturzentrum",
      "Historic getaway": "Historischer Kurzurlaub",
      "Tropical paradise": "Tropisches Paradies",
      "Romantic escape": "Romantischer Ausflug",
      "Island adventure": "Inselabenteuer",
      "Coastal charm": "Küstenzauber",
      "Lush greenery": "Üppiges Grün",
      "Home": "Startseite",
      "Experiences": "Entdeckungen",
      "Services": "Dienstleistungen",
      "Airbnb your home": "Als Gastgeber auf Airbnb",
      "Languages & translation": "Sprachen & Übersetzung",
      "Preferred language": "Bevorzugte Sprache",
      "Automatic translation": "Automatische Übersetzung",
      "Other languages you know": "Weitere Sprachen, die Sie sprechen",
      "Time zone": "Zeitzone",
      "Personal information": "Persönliche Angaben",
      "Login & security": "Login & Sicherheit",
      "Privacy": "Datenschutz",
      "Notifications": "Benachrichtigungen",
      "Taxes": "Steuern",
      "Payments": "Zahlungen"
    }
  },
  Japanese: {
    translation: {
      "Where": "行き先",
      "Check in": "チェックイン",
      "Check out": "チェックアウト",
      "Who": "旅行者",
      "Search": "検索",
      "Prime beach spot": "人気のビーチスポット",
      "Mountain retreat": "山の隠れ家",
      "Cultural hub": "文化の中心地",
      "Historic getaway": "歴史的な休暇先",
      "Tropical paradise": "南国の楽園",
      "Romantic escape": "ロマンチックな旅",
      "Island adventure": "島の冒険",
      "Coastal charm": "海岸の魅力",
      "Lush greenery": "緑豊かな自然",
      "Home": "ホーム",
      "Experiences": "体験",
      "Services": "サービス",
      "Airbnb your home": "お部屋をAirbnbに掲載",
      "Languages & translation": "言語と翻訳",
      "Preferred language": "優先言語",
      "Automatic translation": "自動翻訳",
      "Other languages you know": "その他の言語",
      "Time zone": "タイムゾーン",
      "Personal information": "個人情報",
      "Login & security": "ログインとセキュリティ",
      "Privacy": "プライバシー",
      "Notifications": "通知",
      "Taxes": "税金",
      "Payments": "支払い"
    }
  },
  Chinese: {
    translation: {
      "Where": "目的地",
      "Check in": "入住",
      "Check out": "退房",
      "Who": "人数",
      "Search": "搜索",
      "Prime beach spot": "绝美海滩景点",
      "Mountain retreat": "山间度假胜地",
      "Cultural hub": "文化中心",
      "Historic getaway": "历史文化之旅",
      "Tropical paradise": "热带天堂",
      "Romantic escape": "浪漫度假",
      "Island adventure": "海岛探险",
      "Coastal charm": "迷人海岸",
      "Lush greenery": "郁郁葱葱的自然",
      "Home": "首页",
      "Experiences": "体验",
      "Services": "服务",
      "Airbnb your home": "成为爱彼迎房东",
      "Languages & translation": "语言与翻译",
      "Preferred language": "偏好语言",
      "Automatic translation": "自动翻译",
      "Other languages you know": "您掌握的其他语言",
      "Time zone": "时区",
      "Personal information": "个人信息",
      "Login & security": "登录与安全",
      "Privacy": "隐私",
      "Notifications": "通知",
      "Taxes": "税务",
      "Payments": "支付"
    }
  }
};

// Comprehensive language code mapper for all supported languages
export const LANG_MAP = {
  'English': 'en',
  'Hindi': 'hi',
  'हिन्दी': 'hi',
  'Spanish': 'es',
  'Español': 'es',
  'French': 'fr',
  'Français': 'fr',
  'German': 'de',
  'Deutsch': 'de',
  'Japanese': 'ja',
  '日本語': 'ja',
  'Chinese': 'zh-CN',
  'Chinese (Simplified)': 'zh-CN',
  '中文 (简体)': 'zh-CN',
  'Chinese (Traditional)': 'zh-TW',
  'Arabic': 'ar',
  'العربية': 'ar',
  'Russian': 'ru',
  'Русский': 'ru',
  'Portuguese': 'pt',
  'Português': 'pt',
  'Italian': 'it',
  'Italiano': 'it',
  'Korean': 'ko',
  '한국어': 'ko',
  'Turkish': 'tr',
  'Türkçe': 'tr',
  'Dutch': 'nl',
  'Nederlands': 'nl',
  'Polish': 'pl',
  'Polski': 'pl',
  'Indonesian': 'id',
  'Bahasa Indonesia': 'id',
  'Bengali': 'bn',
  'বাংলা': 'bn',
  'Punjabi': 'pa',
  'ਪੰਜਾਬੀ': 'pa',
  'Marathi': 'mr',
  'मराठी': 'mr',
  'Telugu': 'te',
  'తెలుగు': 'te',
  'Tamil': 'ta',
  'தமிழ்': 'ta',
  'Gujarati': 'gu',
  'ગુજરાતી': 'gu',
  'Urdu': 'ur',
  'اردو': 'ur',
  'Kannada': 'kn',
  'ಕನ್ನಡ': 'kn',
  'Malayalam': 'ml',
  'മലയാളം': 'ml',
  'Vietnamese': 'vi',
  'Tiếng Việt': 'vi',
  'Thai': 'th',
  'ไทย': 'th',
  'Greek': 'el',
  'Ελληνικά': 'el',
  'Czech': 'cs',
  'Čeština': 'cs',
  'Swedish': 'sv',
  'Svenska': 'sv',
  'Danish': 'da',
  'Dansk': 'da',
  'Finnish': 'fi',
  'Suomi': 'fi',
  'Norwegian': 'no',
  'Norsk': 'no',
  'Hungarian': 'hu',
  'Magyar': 'hu',
  'Romanian': 'ro',
  'Română': 'ro',
  'Ukrainian': 'uk',
  'Українська': 'uk',
  'Hebrew': 'he',
  'עברית': 'he',
  'Malay': 'ms',
  'Bahasa Melayu': 'ms',
  'Filipino': 'tl',
  'Tagalog': 'tl',
  'Persian': 'fa',
  'فارسی': 'fa',
  'Azerbaijani': 'az',
  'Azərbaycan dili': 'az',
  'Bosnian': 'bs',
  'Bosanski': 'bs',
  'Catalan': 'ca',
  'Català': 'ca',
  'Montenegrin': 'me',
  'Crnogorski': 'me',
  'Estonian': 'et',
  'Eesti': 'et'
};

// Global website-wide Google Translate triggering helper
export const applyGoogleTranslate = (languageName) => {
  const code = LANG_MAP[languageName] || 'en';
  try {
    // Set Google translate cookie for the entire site
    const domain = window.location.hostname;
    document.cookie = `googtrans=/en/${code}; path=/;`;
    if (domain) {
      document.cookie = `googtrans=/en/${code}; domain=.${domain}; path=/;`;
      document.cookie = `googtrans=/en/${code}; domain=${domain}; path=/;`;
    }

    // Trigger select element in google translate iframe/container if available
    const selectElem = document.querySelector('.goog-te-combo');
    if (selectElem) {
      selectElem.value = code;
      selectElem.dispatchEvent(new Event('change'));
    }

    // Hide any banner frame inserted by Google immediately
    const removeGoogleBanner = () => {
      document.querySelectorAll('.goog-te-banner-frame, iframe.goog-te-banner-frame').forEach(el => {
        el.style.display = 'none';
        el.style.visibility = 'hidden';
        el.style.height = '0px';
      });
      if (document.body) {
        document.body.style.top = '0px';
        document.body.style.position = 'static';
      }
    };
    removeGoogleBanner();
    setTimeout(removeGoogleBanner, 100);
    setTimeout(removeGoogleBanner, 300);
    setTimeout(removeGoogleBanner, 800);
    setTimeout(removeGoogleBanner, 1500);

    // Reveal page smoothly once translated without English flickering
    setTimeout(() => {
      document.documentElement.classList.remove('translating-active');
      document.documentElement.classList.add('translated-ready');
    }, 150);
  } catch (e) {
    document.documentElement.classList.remove('translating-active');
    document.documentElement.classList.add('translated-ready');
    console.warn('Google translate apply:', e);
  }
};

const savedLang = localStorage.getItem('airbnb_preferred_language') || 'English';

// Apply on initial load if saved language is not English
if (typeof window !== 'undefined' && savedLang && savedLang !== 'English') {
  setTimeout(() => {
    applyGoogleTranslate(savedLang);
  }, 600);
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'English',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
