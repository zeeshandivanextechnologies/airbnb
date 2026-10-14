import React from 'react';
import styles from '../../components/styles/BecomeHost.module.css';
import { MdOutlineAddHome, MdChevronRight } from 'react-icons/md';
import { NavLink } from 'react-router-dom';

function BecomeHost() {
  return (
    <div className={styles['bh-page-wrapper']}>
      <div className="container ">
        {/* Bootstrap Grid for responsiveness */}
       <div className='row justify-content-center'>
         <div className={` col-md-6 col-lg-6 col-sm-12 ${styles['bh-content-container']}`}>
          
          <h1 className={styles['bh-title']}>Welcome back, Mohammad</h1>
          <h2 className={styles['bh-subtitle']}>Start a new listing</h2>
          
          <NavLink to = "/host" className={styles['bh-listing-btn']}>
            <div className={styles['bh-btn-left']}>
              <MdOutlineAddHome className={styles['bh-btn-icon']} />
              <span className={styles['bh-btn-text']}>Create a new listing</span>
            </div>
            <MdChevronRight className={styles['bh-btn-arrow']} />
          </NavLink>
          
        </div>

       </div>
      </div>
    </div>
  );
}

export default BecomeHost;