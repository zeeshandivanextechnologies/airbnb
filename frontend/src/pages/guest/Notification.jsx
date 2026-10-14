import React from 'react';
import styles from '../../components/styles/Notification.module.css';

function Notification() {
  return (
    <div className={styles['notif-page-wrapper']}>
      <div className="container">
        
        {/* Title Section */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <h1 className={styles['notif-title']}>Notifications</h1>
          </div>
        </div>
        
        {/* Empty State Centered */}
        <div className="row justify-content-center py-5">
          <div className="col-md-8 col-lg-6 text-center">
            <div className={styles['notif-empty-state']}>
              <h2 className={styles['notif-empty-title']}>No notifications yet</h2>
              <p className={styles['notif-empty-subtitle']}>
                You've got a blank slate (for now). We'll let you know when updates arrive.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Notification;