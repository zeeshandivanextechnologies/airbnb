import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles/Footer.module.css';
import { FaGlobe, FaFacebookSquare, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Popular');
  const [footerSections, setFooterSections] = useState([]);
  const [platformConfig, setPlatformConfig] = useState({
    siteName: 'Airbnb, Inc.',
    currencySymbol: '₹',
    defaultCurrency: 'INR',
    language: 'English (IN)'
  });

  const defaultTabData = {
    'Popular': [
      { name: "Jaipur", type: "Heritage palace rentals" },
      { name: "North Goa", type: "Luxury beach villa rentals" },
      { name: "Udaipur", type: "Lakeside haveli rentals" },
      { name: "Manali", type: "Wooden cabin & cottage rentals" },
      { name: "Mumbai", type: "Sea-facing penthouse rentals" },
      { name: "Dubai", type: "Downtown luxury flat rentals" },
      { name: "South Goa", type: "Private beach cottage rentals" },
      { name: "Rishikesh", type: "Riverfront chalet rentals" },
      { name: "Gurugram", type: "Modern serviced flat rentals" },
      { name: "Varanasi", type: "Ghatside heritage stays" },
      { name: "Delhi", type: "Art & design city rentals" },
      { name: "Bengaluru", type: "Garden city apartment rentals" }
    ],
    'Arts & culture': [
      { name: "Paris", type: "Flat rentals" },
      { name: "Jaipur", type: "Handicrafts & art studio stays" },
      { name: "Rome", type: "Historic holiday rentals" },
      { name: "Florence", type: "Villa rentals" },
      { name: "Kyoto", type: "Traditional house rentals" },
      { name: "Athens", type: "Acropolis view flat rentals" },
      { name: "Varanasi", type: "Cultural & spiritual stays" }
    ],
    'Beach': [
      { name: "North Goa", type: "Beachfront villa rentals" },
      { name: "South Goa", type: "Beach house rentals" },
      { name: "Maldives", type: "Water villa rentals" },
      { name: "Miami", type: "Oceanfront flat rentals" },
      { name: "Phuket", type: "Tropical holiday rentals" },
      { name: "Bali", type: "Private pool villas" },
      { name: "Kochi", type: "Coastal seaside retreats" }
    ],
    'Mountains': [
      { name: "Manali", type: "Snow-view cottage rentals" },
      { name: "Rishikesh", type: "Himalayan valley retreats" },
      { name: "Aspen", type: "Alpine cabin rentals" },
      { name: "Banff", type: "Chalet rentals" },
      { name: "Zermatt", type: "Mountain holiday rentals" },
      { name: "Chamonix", type: "Ski villa rentals" }
    ],
    'Outdoors': [
      { name: "Rishikesh", type: "Rafting & camping retreats" },
      { name: "Yosemite", type: "National park cabin rentals" },
      { name: "Zion", type: "House rentals" },
      { name: "Yellowstone", type: "Lodge rentals" },
      { name: "Sedona", type: "Desert house rentals" },
      { name: "Kullu", type: "Eco retreat rentals" }
    ],
    'Things to do': [
      { name: "Dubai", type: "Desert safaris & luxury stays" },
      { name: "New York", type: "Broadway city breaks" },
      { name: "Tokyo", type: "Urban food exploration" },
      { name: "Las Vegas", type: "Entertainment & resort stays" },
      { name: "Singapore", type: "Marina city escapes" },
      { name: "Jaipur", type: "Fort tours & culinary sessions" }
    ]
  };

  const [tabData, setTabData] = useState(defaultTabData);

  useEffect(() => {
    let isMounted = true;
    const fetchFooter = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${baseUrl}/listings/cms/footer`);
        const data = await res.json();
        if (data && data.success && isMounted) {
          if (Array.isArray(data.sections) && data.sections.length > 0) {
            setFooterSections(data.sections);
          }
          if (data.platformConfig) {
            setPlatformConfig(data.platformConfig);
          }
          if (data.inspirationData && typeof data.inspirationData === 'object') {
            setTabData(data.inspirationData);
          }
        }
      } catch (e) {
        console.warn('Failed to load dynamic footer:', e);
      }
    };
    fetchFooter();
    return () => { isMounted = false; };
  }, []);

  const tabs = Object.keys(tabData).length > 0 
    ? Object.keys(tabData) 
    : ['Popular', 'Arts & culture', 'Beach', 'Mountains', 'Outdoors', 'Things to do'];

  const currentItems = tabData[activeTab] || defaultTabData[activeTab] || [];

  const handleDestinationClick = (destName) => {
    if (!destName || destName.includes('Show more')) return;
    const cleanLocation = destName.trim();
    // Navigate straight to the location search results page
    navigate(`/search/${encodeURIComponent(cleanLocation)}`);
  };

  return (
    <footer className={styles['custom-footer']}>
      <div className={styles['footer-content']}>
        
        {/* Inspiration Section */}
        <div className={styles['footer-inspiration']}>
          <h2>Inspiration for future getaways</h2>
          
          <div className={styles['footer-tabs']}>
            {tabs.map((tab) => (
              <button 
                key={tab} 
                className={`${styles['footer-tab']} ${activeTab === tab ? styles.active : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className={styles['footer-grid-6']}>
            {currentItems.map((item, index) => (
              <div 
                key={index} 
                className={styles['inspiration-item']}
                onClick={() => handleDestinationClick(item.name)}
                style={{ cursor: item.name?.includes('Show more') ? 'default' : 'pointer' }}
              >
                <strong>{item.name}</strong>
                <span>{item.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Links Section - Dynamic from Database */}
        <div className={styles['footer-main-links']}>
          {footerSections && footerSections.length > 0 ? (
            footerSections.map((section) => (
              <div key={section.id} className={styles['footer-column']}>
                <h3>{section.title}</h3>
                <ul>
                  {(section.links || []).filter(l => l.isLive !== false).map((link, lIdx) => (
                    <li key={lIdx}>
                      {link.url && link.url.startsWith('/') ? (
                        <Link to={link.url}>{link.label}</Link>
                      ) : (
                        <a href={link.url || '#'} target={link.url && link.url.startsWith('http') ? '_blank' : '_self'} rel="noreferrer">
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <>
              <div className={styles['footer-column']}>
                <h3>Support</h3>
                <ul>
                  <li><Link to="/help">Help Centre</Link></li>
                  <li><Link to="/aircover">AirCover</Link></li>
                  <li><Link to="/anti-discrimination">Anti-discrimination</Link></li>
                  <li><Link to="/accessibility">Disability support</Link></li>
                  <li><Link to="/cancellations">Cancellation options</Link></li>
                </ul>
              </div>
              <div className={styles['footer-column']}>
                <h3>Hosting</h3>
                <ul>
                  <li><Link to="/become-host">Airbnb your home</Link></li>
                  <li><Link to="/aircover">AirCover for Hosts</Link></li>
                  <li><Link to="/hosting/home">Hosting resources & home</Link></li>
                  <li><Link to="/hosting/host-experience">Host an experience</Link></li>
                  <li><Link to="/find-cost-host">Find a co-host</Link></li>
                  <li><Link to="/hosting/intro-to-host">Intro to hosting</Link></li>
                  <li><Link to="/hosting/listings">Host Dashboard</Link></li>
                  <li><Link to="/responsible-hosting">Hosting responsibly</Link></li>
                  <li><Link to="/refer">Refer a host</Link></li>
                </ul>
              </div>
              <div className={styles['footer-column']}>
                <h3>Airbnb</h3>
                <ul>
                  <li><Link to="/about-us">About Us</Link></li>
                  <li><Link to="/careers">Careers</Link></li>
                  <li><Link to="/guest-refund-policy">Guest Refund Policy</Link></li>
                  <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                  <li><Link to="/terms-of-service">Terms of Service</Link></li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Bottom Bar with Dynamic Year and Currency */}
        <div className={styles['footer-bottom']}>
          <div className={styles['footer-bottom-left']}>
            <span>© {new Date().getFullYear()} {platformConfig.siteName || 'Airbnb, Inc.'}</span>
            <ul>
              <li><Link to="/privacy-policy">Privacy</Link></li>
              <li><Link to="/terms-of-service">Terms</Link></li>
              <li><Link to="/sitemap">Sitemap</Link></li>
              <li><Link to="/about-us">Company details</Link></li>
            </ul>
          </div>
          
          <div className={styles['footer-bottom-right']}>
            <div className={styles['footer-buttons']}>
              <button title="Change Language">
                <FaGlobe className={styles['globe-icon']} />
                {platformConfig.language || 'English (IN)'}
              </button>
              <button title="Currency">
                {platformConfig.currencySymbol || '₹'} {platformConfig.defaultCurrency || 'INR'}
              </button>
            </div>
            
            <div className={styles['footer-socials']}>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <FaFacebookSquare className={styles['social-icon']} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                <FaTwitter className={styles['social-icon']} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <FaInstagram className={styles['social-icon']} />
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
