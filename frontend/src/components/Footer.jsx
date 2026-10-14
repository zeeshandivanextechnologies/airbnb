import { useState } from 'react';
import styles from './styles/Footer.module.css';
import { FaGlobe, FaFacebookSquare, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  const [activeTab, setActiveTab] = useState('Popular');

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

        {/* Main Links Section */}
        <div className={styles['footer-main-links']}>
          <div className={styles['footer-column']}>
            <h3>Support</h3>
            <ul>
              <li><a href="#">Help Centre</a></li>
              <li><a href="#">Get help with a safety issue</a></li>
              <li><a href="#">AirCover</a></li>
              <li><a href="#">Anti-discrimination</a></li>
              <li><a href="#">Disability support</a></li>
              <li><a href="#">Cancellation options</a></li>
              <li><a href="#">Report neighbourhood concern</a></li>
            </ul>
          </div>
          <div className={styles['footer-column']}>
            <h3>Hosting</h3>
            <ul>
              <li><a href="#">Airbnb your home</a></li>
              <li><a href="#">AirCover for Hosts</a></li>
              <li><a href="#">Hosting resources</a></li>
              <li><a href="#">Community forum</a></li>
              <li><a href="#">Hosting responsibly</a></li>
              <li><a href="#">Join a free hosting class</a></li>
              <li><a href="#">Find a co-host</a></li>
              <li><a href="#">Refer a host</a></li>
            </ul>
          </div>
          <div className={styles['footer-column']}>
            <h3>Airbnb</h3>
            <ul>
              <li><a href="#">Newsroom</a></li>
              <li><a href="#">New features</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Investors</a></li>
              <li><a href="#">Gift cards</a></li>
              <li><a href="#">Airbnb.org emergency stays</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles['footer-bottom']}>
          <div className={styles['footer-bottom-left']}>
            <span>© 2026 Airbnb, Inc.</span>
            <ul>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Sitemap</a></li>
              <li><a href="#">Company details</a></li>
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
