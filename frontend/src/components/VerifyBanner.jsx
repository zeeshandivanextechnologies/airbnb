import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaShieldAlt, FaTimes, FaCheckCircle } from 'react-icons/fa';
import styles from './styles/VerifyBanner.module.css';

function VerifyBanner() {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [activeCard, setActiveCard] = useState('identity');

  useEffect(() => {
    if (isOffcanvasOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOffcanvasOpen]);

  return (
    <>
    <div className={styles.topBannerWrapper}>
      <div className={styles.topBanner} onClick={() => setIsOffcanvasOpen(true)}>
        <div className={styles.bannerIconWrapper}>
          <span className={styles.bannerBadge}>2</span>
          <FaShieldAlt color="#e51d53" size={20} />
        </div>
        <div>
          <h4 className={styles.bannerTitle}>Verify your identity</h4>
          <p className={styles.bannerSub}>Required to publish</p>
        </div>
      </div>
    </div>

    {/* Offcanvas Structure always rendered for smooth transitions */}
    {createPortal(
      <>
        <div 
          className={`${styles.overlay} ${isOffcanvasOpen ? styles.open : ''}`} 
        onClick={() => setIsOffcanvasOpen(false)}
      ></div>
      <div className={`${styles.offcanvas} ${isOffcanvasOpen ? styles.open : ''}`}>
        <div className={styles.offcanvasHeader}>
          <div style={{width: '32px'}}></div>
          <div>
            <div className={styles.offcanvasTitle}>Steps to publish</div>
            <div className={styles.offcanvasSubTitle}>hi</div>
          </div>
          <button className={styles.closeBtn} onClick={() => setIsOffcanvasOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.offcanvasBody}>
          {/* Identity Card */}
          <div 
            className={`${styles.taskCard} ${activeCard === 'identity' ? styles.active : ''}`}
            onClick={() => setActiveCard('identity')}
          >
            <div>
              <div className={styles.taskSub}>Your House listing started on 6 October 2026</div>
              <div className={styles.taskTitle}>Identity verification</div>
              <div className={styles.taskStatus}>Not started</div>
            </div>
            
            <div className={`${styles.taskInnerContainer} ${activeCard === 'identity' ? styles.expanded : ''}`}>
              <div className={styles.taskInnerContent}>
                <div className={styles.taskInner}>
                  <div className={styles.taskInnerIllustration}>
                    🧍‍♀️🛡️
                  </div>
                  <div className={styles.taskInnerTitle}>Verify your identity</div>
                  <div className={styles.taskInnerDesc}>
                    We'll gather some information to help confirm you're you.
                  </div>
                  <button className={styles.darkBtn} onClick={(e) => e.stopPropagation()}>Get started</button>
                </div>
              </div>
            </div>
          </div>

          {/* Phone Card */}
          <div 
            className={`${styles.taskCard} ${activeCard === 'phone' ? styles.active : ''}`}
            onClick={() => setActiveCard('phone')}
          >
            <div>
              <div className={styles.taskSub}>Your House listing started on 6 October 2026</div>
              <div className={styles.taskTitle}>Phone number confirmation</div>
              <div className={styles.taskStatus}>Not started</div>
            </div>
            
            <div className={`${styles.taskInnerContainer} ${activeCard === 'phone' ? styles.expanded : ''}`}>
              <div className={styles.taskInnerContent}>
                <div className={styles.taskInner}>
                  <div className={styles.taskInnerIllustration}>
                    ☎️
                  </div>
                  <div className={styles.taskInnerTitle}>Confirm your phone number</div>
                  <div className={styles.taskInnerDesc}>
                    Provide the number where we can send important notifications.
                  </div>
                  <button className={styles.darkBtn} onClick={(e) => e.stopPropagation()}>Confirm phone number</button>
                </div>
              </div>
            </div>
          </div>

          {/* Small Card 2 (Completed) */}
          <div className={styles.taskCardSmallStatic}>
            <div>
              <div className={styles.taskTitle}>Date of birth confirmation</div>
              <div className={styles.taskStatus}>Completed</div>
            </div>
            <div>
              <FaCheckCircle color="#008a05" size={24} />
            </div>
          </div>
        </div>
      </div>
      </>,
      document.body
    )}
    </>
  );
}

export default VerifyBanner;
