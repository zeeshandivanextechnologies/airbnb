import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/Footer.module.css';
import { FaGlobe, FaFacebookSquare, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  const [activeTab, setActiveTab] = useState('Popular');
  const [footerSections, setFooterSections] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchFooter = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${baseUrl}/listings/cms/footer`);
        const data = await res.json();
        if (data && data.success && Array.isArray(data.sections) && isMounted) {
          setFooterSections(data.sections);
        }
      } catch (e) {
        console.warn('Failed to load dynamic footer:', e);
      }
    };
    fetchFooter();
    return () => { isMounted = false; };
  }, []);

  const tabs = ['Popular', 'Arts & culture', 'Beach', 'Mountains', 'Outdoors', 'Things to do'];

  const tabData = {
    'Popular': [
      { name: "Canmore", type: "Flat rentals" },
      { name: "Benalmádena", type: "Beach house rentals" },
      { name: "Marbella", type: "Flat rentals" },
      { name: "Mijas", type: "House rentals" },
      { name: "Prescott", type: "Holiday rentals" },
      { name: "Scottsdale", type: "House rentals" },
      { name: "Tucson", type: "Holiday rentals" },
      { name: "Jasper", type: "Cabin rentals" },
      { name: "Mountain View", type: "Holiday rentals" },
      { name: "Devonport", type: "Cottage rentals" },
      { name: "Mallacoota", type: "Pet-friendly rentals" },
      { name: "Ibiza", type: "Holiday rentals" },
      { name: "Anaheim", type: "Holiday rentals" },
      { name: "Monterey", type: "Cottage rentals" },
      { name: "Paso Robles", type: "House rentals" },
      { name: "Santa Barbara", type: "Cottage rentals" },
      { name: "Sonoma", type: "Holiday rentals" },
      { name: "Show more ˅", type: "" }
    ],
    'Arts & culture': [
      { name: "Paris", type: "Flat rentals" },
      { name: "London", type: "Apartment rentals" },
      { name: "Rome", type: "Holiday rentals" },
      { name: "Florence", type: "Villa rentals" },
      { name: "Kyoto", type: "House rentals" },
      { name: "Athens", type: "Holiday rentals" },
      { name: "Show more ˅", type: "" }
    ],
    'Beach': [
      { name: "Miami", type: "Beachfront rentals" },
      { name: "Goa", type: "Villa rentals" },
      { name: "Phuket", type: "Holiday rentals" },
      { name: "Bali", type: "House rentals" },
      { name: "Maui", type: "Condo rentals" },
      { name: "Malibu", type: "Beach house rentals" },
      { name: "Show more ˅", type: "" }
    ],
    'Mountains': [
      { name: "Aspen", type: "Cabin rentals" },
      { name: "Manali", type: "Cottage rentals" },
      { name: "Banff", type: "Chalet rentals" },
      { name: "Zermatt", type: "Holiday rentals" },
      { name: "Chamonix", type: "Villa rentals" },
      { name: "Whistler", type: "Cabin rentals" },
      { name: "Show more ˅", type: "" }
    ],
    'Outdoors': [
      { name: "Yosemite", type: "Cabin rentals" },
      { name: "Zion", type: "House rentals" },
      { name: "Moab", type: "Holiday rentals" },
      { name: "Banff", type: "Cabin rentals" },
      { name: "Yellowstone", type: "Lodge rentals" },
      { name: "Sedona", type: "House rentals" },
      { name: "Show more ˅", type: "" }
    ],
    'Things to do': [
      { name: "New York", type: "City breaks" },
      { name: "Tokyo", type: "Urban exploration" },
      { name: "Dubai", type: "Luxury stays" },
      { name: "Las Vegas", type: "Entertainment" },
      { name: "Singapore", type: "City escapes" },
      { name: "Macau", type: "Holiday rentals" },
      { name: "Show more ˅", type: "" }
    ]
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
            {tabData[activeTab].map((item, index) => (
              <div key={index} className={styles['inspiration-item']}>
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
                  <li><Link to="/host">Airbnb your home</Link></li>
                  <li><Link to="/hosting/host-experience">Host an experience</Link></li>
                  <li><Link to="/hosting/intro-to-host">Intro to hosting</Link></li>
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

        {/* Bottom Bar */}
        <div className={styles['footer-bottom']}>
          <div className={styles['footer-bottom-left']}>
            <span>© 2026 Airbnb, Inc.</span>
            <ul>
              <li><Link to="/privacy-policy">Privacy</Link></li>
              <li><Link to="/terms-of-service">Terms</Link></li>
              <li><Link to="/sitemap">Sitemap</Link></li>
              <li><Link to="/about-us">Company details</Link></li>
            </ul>
          </div>
          
          <div className={styles['footer-bottom-right']}>
            <div className={styles['footer-buttons']}>
              <button>
                <FaGlobe className={styles['globe-icon']} />
                English (IN)
              </button>
              <button>
                ₹ INR
              </button>
            </div>
            
            <div className={styles['footer-socials']}>
              <a href="#" aria-label="Facebook">
                <FaFacebookSquare className={styles['social-icon']} />
              </a>
              <a href="#" aria-label="Twitter">
                <FaTwitter className={styles['social-icon']} />
              </a>
              <a href="#" aria-label="Instagram">
                <FaInstagram className={styles['social-icon']} />
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
