import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../components/styles/Wishlists.module.css';

function Wishlists() {
  const navigate = useNavigate();

  return (
    <div className={`container ${styles.pageContainer}`}>
      <h1 className={styles.pageTitle}>Wishlists</h1>
      <div className="row">
        <div className="col-sm-6 col-md-4 col-lg-3">
          <div className={styles.wishlistCard} onClick={() => navigate('/wishlists/recently-viewed')}>
            <div className={styles.imageGrid}>
              <img src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" alt="Wishlist item 1" className={styles.gridImg} />
              <img src="https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" alt="Wishlist item 2" className={styles.gridImg} />
              <img src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" alt="Wishlist item 3" className={styles.gridImg} />
              <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" alt="Wishlist item 4" className={styles.gridImg} />
            </div>
            <h3 className={styles.cardTitle}>Recently viewed</h3>
            <p className={styles.cardSubtitle}>Yesterday</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wishlists;