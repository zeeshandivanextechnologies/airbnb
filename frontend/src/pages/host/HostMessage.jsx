import React from 'react';
import { FaSearch, FaCog, FaChevronRight, FaShieldAlt } from 'react-icons/fa';
import styles from '../../components/styles/HostMessage.module.css';
import VerifyBanner from '../../components/VerifyBanner';

function HostMessage() {
  return (
    <div className={`container-fluid p-0 ${styles.messagePage}`}>
      <VerifyBanner />

      {/* Main Split Layout */}
      <div className={`row ${styles.mainRow}`}>
        {/* Left Sidebar */}
        <div className={`col-lg-3 col-md-4 ${styles.sidebar}`}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Messages</h2>
            <div className={styles.iconBtnGroup}>
              <button className={styles.iconBtn}><FaSearch size={14} /></button>
              <button className={styles.iconBtn}><FaCog size={14} /></button>
            </div>
          </div>

          <div className={styles.emptyState}>
            <div className={styles.emptyIconWrapper}>
              <div className={styles.chatBubbleBlue}></div>
              <div className={styles.chatBubbleWhite}>
                <div className={styles.chatLine}></div>
                <div className={styles.chatLineShort}></div>
              </div>
            </div>
            <h3 className={styles.emptyTitle}>Your inbox is empty</h3>
            <p className={styles.emptySub}>Come back soon for conversations with your guests.</p>
          </div>

          <div className={styles.sidebarFooter}>
            <div className={styles.pastLink}>
              <span>Past conversations</span>
              <FaChevronRight size={12} />
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className={`col-lg-9 col-md-8 ${styles.mainContent}`}>
          {/* Empty Right Side as requested */}
        </div>
      </div>
    </div>
  );
}

export default HostMessage;