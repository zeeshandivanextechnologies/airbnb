import React, { useState } from 'react';
import styles from '../../components/styles/HostToday.module.css';
import VerifyBanner from '../../components/VerifyBanner';

function HostToday() {
  const [activeTab, setActiveTab] = useState('Today');

  return (
    <div className={styles.todayPage}>
      <VerifyBanner />
      {/* Main Content */}
      <div className="container py-4">
        {/* Tabs */}
        <div className={styles.tabsWrapper}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'Today' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('Today')}
          >
            Today
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'Upcoming' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('Upcoming')}
          >
            Upcoming
          </button>
        </div>

        {/* Empty State */}
        <div className="row w-100 justify-content-center" key={activeTab}>
          <div className={`col-md-8 col-lg-6 text-center ${styles.fadeInUp}`}>
            <div className={styles.bookImageContainer}>
               <img src="/book_01.avif" alt="Open book" className={styles.bookImage} />
            </div>
            <h2 className={styles.emptyTitle}>
              You don't have<br/>any {activeTab === 'Upcoming' ? 'upcoming ' : ''}reservations
            </h2>
            <p className={styles.emptySubtext}>
              To get booked, you'll need to<br/>complete and publish your listing.
            </p>
            <button className={styles.completeBtn}>Complete your listing</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HostToday;