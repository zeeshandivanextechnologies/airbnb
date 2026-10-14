import React from 'react';
import { FaGlobe, FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6'; // specific to X logo
import styles from './styles/HostFooter.module.css';

const HostFooter = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md-4 mb-4 mb-md-0">
            <h3 className={styles.columnTitle}>Support</h3>
            <ul className={styles.footerList}>
              <li><a href="#">Help Centre</a></li>
              <li><a href="#">Get help with a safety issue</a></li>
              <li><a href="#">AirCover</a></li>
              <li><a href="#">Anti-discrimination</a></li>
              <li><a href="#">Disability support</a></li>
              <li><a href="#">Cancellation options</a></li>
              <li><a href="#">Report neighbourhood concern</a></li>
            </ul>
          </div>
          <div className="col-12 col-md-4 mb-4 mb-md-0">
            <h3 className={styles.columnTitle}>Hosting</h3>
            <ul className={styles.footerList}>
              <li><a href="#">Airbnb your home</a></li>
              <li><a href="#">Airbnb your experience</a></li>
              <li><a href="#">Airbnb your service</a></li>
              <li><a href="#">AirCover for Hosts</a></li>
              <li><a href="#">Hosting resources</a></li>
              <li><a href="#">Community forum</a></li>
              <li><a href="#">Hosting responsibly</a></li>
              <li><a href="#">Join a free hosting class</a></li>
              <li><a href="#">Find a co-host</a></li>
              <li><a href="#">Refer a host</a></li>
            </ul>
          </div>
          <div className="col-12 col-md-4">
            <h3 className={styles.columnTitle}>Airbnb</h3>
            <ul className={styles.footerList}>
              <li><a href="#">2026 Summer Release</a></li>
              <li><a href="#">Newsroom</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Investors</a></li>
              <li><a href="#">Airbnb.org emergency stays</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.bottomLeft}>
            <span>© 2026 Airbnb, Inc.</span>
            <span className={styles.dot}>·</span>
            <a href="#">Privacy</a>
            <span className={styles.dot}>·</span>
            <a href="#">Terms</a>
            <span className={styles.dot}>·</span>
            <a href="#">Company details</a>
          </div>
          <div className={styles.bottomRight}>
            <div className={styles.languageCurrency}>
              <button className={styles.iconBtn}><FaGlobe /></button>
              <a href="#" className={styles.boldLink}>English (IN)</a>
              <a href="#" className={styles.boldLink}>₹ INR</a>
            </div>
            <div className={styles.socialIcons}>
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaXTwitter /></a>
              <a href="#"><FaInstagram /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HostFooter;
