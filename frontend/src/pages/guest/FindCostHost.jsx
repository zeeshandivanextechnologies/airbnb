import React from 'react';
import styles from '../../components/styles/FindCostHost.module.css';
import { FcRules, FcKey, FcLandscape } from 'react-icons/fc';

export default function FindCostHost() {
  return (
    <div className={styles['fch-page-wrapper']}>
      <main className={styles['fch-main-content']}>
        <div className="container">
          <div className="row justify-content-start">
            {/* Using Bootstrap grid for responsiveness */}
            <div className="col-md-10 col-lg-7 ">
              
              <h1 className={styles['fch-title']}>Find someone to help you host</h1>
              <p className={styles['fch-subtitle']}>
                Get help managing your home and guests from a co-host — a top-rated Airbnb host.
              </p>

              <div className={styles['fch-features-list']}>
                
                <div className={styles['fch-feature-item']}>
                  <div className={styles['fch-icon-wrapper']}>
                    <FcRules size={40} />
                  </div>
                  <div className={styles['fch-feature-text']}>
                    <h3>Choose the help you need</h3>
                    <p>Let a co-host handle everything, or choose from a list of services.</p>
                  </div>
                </div>

                <div className={styles['fch-feature-item']}>
                  <div className={styles['fch-icon-wrapper']}>
                    <FcKey size={40} />
                  </div>
                  <div className={styles['fch-feature-text']}>
                    <h3>Get on-site support</h3>
                    <p>Co-hosts can be at your home to help when you need it.</p>
                  </div>
                </div>

                <div className={styles['fch-feature-item']}>
                  <div className={styles['fch-icon-wrapper']}>
                    <FcLandscape size={40} />
                  </div>
                  <div className={styles['fch-feature-text']}>
                    <h3>Make the most of your home</h3>
                    <p>Get help styling your space, taking photos and writing a catchy description.</p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className={styles['fch-sticky-footer']}>
        <button className={styles['fch-login-btn']}>
          Log in to continue
        </button>
      </footer>
    </div>
  );
}