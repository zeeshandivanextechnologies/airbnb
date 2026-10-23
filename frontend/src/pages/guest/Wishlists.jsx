import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import styles from '../../components/styles/Wishlists.module.css';
import { getStoredWishlists, deleteWishlist } from '../../utils/wishlistStorage';
import toast from 'react-hot-toast';

function Wishlists() {
  const navigate = useNavigate();
  const [wishlists, setWishlists] = useState(getStoredWishlists());
  const [wishlistToDelete, setWishlistToDelete] = useState(null);

  useEffect(() => {
    const handleUpdate = () => {
      setWishlists(getStoredWishlists());
    };
    window.addEventListener('airbnb_wishlists_updated', handleUpdate);
    return () => window.removeEventListener('airbnb_wishlists_updated', handleUpdate);
  }, []);

  const defaultThumbnails = [
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80',
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80',
    'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400&q=80',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80'
  ];

  const handleDeleteConfirm = () => {
    if (!wishlistToDelete) return;
    deleteWishlist(wishlistToDelete.id);
    toast.success(`"${wishlistToDelete.title}" deleted`);
    setWishlistToDelete(null);
  };

  return (
    <div className='container py-3'>
      <h1 className={styles.pageTitle}>Wishlists</h1>
      <div className="row">
        {wishlists.map((wl) => {
          const items = Array.isArray(wl.items) ? wl.items : [];
          const hasSingleCustom = items.length === 1;

          const gridImages = [
            items[0]?.image || defaultThumbnails[0],
            items[1]?.image || defaultThumbnails[1],
            items[2]?.image || defaultThumbnails[2],
            items[3]?.image || defaultThumbnails[3]
          ];

          const countLabel = items.length === 1 ? '1 saved' : `${items.length} saved`;

          return (
            <div key={wl.id} className="col-sm-6 col-md-4 col-lg-3 mb-lg-3 mb-0">
              <div 
                className={styles.wishlistCard} 
                onClick={() => navigate(`/wishlists/${wl.id}`)}
                style={{ position: 'relative' }}
              >
                {/* Delete Close Button on Hover (Top-Left as in user screenshot) */}
                <button
                  type="button"
                  className={styles.cardCloseBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setWishlistToDelete(wl);
                  }}
                  title={`Delete "${wl.title}"`}
                  aria-label="Delete wishlist"
                >
                  <FaTimes size={11} />
                </button>

                {/* If single item, show beautiful full single card or 4-grid */}
                {hasSingleCustom ? (
                  <div style={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.12)'
                  }}>
                    <img 
                      src={items[0].image} 
                      alt={wl.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                ) : (
                  <div className={styles.imageGrid}>
                    {gridImages.map((imgSrc, imgIdx) => (
                      <img 
                        key={imgIdx} 
                        src={imgSrc} 
                        alt={`Wishlist item ${imgIdx + 1}`} 
                        className={styles.gridImg} 
                      />
                    ))}
                  </div>
                )}

                <h3 className={styles.cardTitle}>{wl.title}</h3>
                <p className={styles.cardSubtitle}>
                  {items.length > 0 ? countLabel : (wl.subtitle || '0 saved')}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal - Matches User Screenshot */}
      {wishlistToDelete && (
        <div 
          className={styles.deleteModalOverlay} 
          onClick={() => setWishlistToDelete(null)}
        >
          <div 
            className={styles.deleteModalContent} 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button" 
              className={styles.deleteModalCloseBtn} 
              onClick={() => setWishlistToDelete(null)}
            >
              <FaTimes size={14} />
            </button>

            <h3 className={styles.deleteModalTitle}>Delete this wishlist?</h3>
            <p className={styles.deleteModalSubtitle}>
              "{wishlistToDelete.title}" will be permanently deleted.
            </p>

            <div className={styles.deleteModalFooter}>
              <button 
                type="button" 
                className={styles.deleteCancelLink} 
                onClick={() => setWishlistToDelete(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className={styles.deleteConfirmBtn} 
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wishlists;