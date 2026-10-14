import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styles from '../../components/styles/Refer.module.css';
import { FaQrcode, FaPen, FaConciergeBell, FaWhatsapp, FaEnvelope, FaFacebook, FaCommentDots, FaFacebookMessenger, FaEllipsisH } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FcHome, FcGlobe } from 'react-icons/fc';
import { FiCopy, FiPlus } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import AuthModal from '../../components/AuthModal';
import toast from 'react-hot-toast';

function Refer() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCustomLinkModal, setShowCustomLinkModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Card selection state: 'home' | 'experience' | 'service'
  const [selectedCard, setSelectedCard] = useState('home');

  // Derive referral code
  const referralCode = user?.referralCode || (user?.firstName ? `${user.firstName.toLowerCase()}${user.id || '4512'}` : 'mohammadz4512');
  const fullReferralLink = `https://airbnb.co.in/rp/${referralCode}`;

  const handleCardClick = (cardType) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setSelectedCard(cardType);
    }
  };

  const handleQrClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setShowQrModal(true);
    }
  };

  const handleCustomiseLinkClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setShowCustomLinkModal(true);
    }
  };

  const handleShareButtonClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = (textToCopy = fullReferralLink) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const handleShareOption = (platform) => {
    const shareText = `Join me on Airbnb and start hosting! Use my link: ${fullReferralLink}`;
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(fullReferralLink);

    switch (platform) {
      case 'copy':
        copyToClipboard();
        break;
      case 'email':
        window.open(`mailto:?subject=Earn money hosting on Airbnb&body=${encodedText}`, '_blank');
        break;
      case 'messages':
        window.open(`sms:?&body=${encodedText}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
        break;
      case 'messenger':
        window.open(`https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=292787834164101&redirect_uri=${encodedUrl}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
        break;
      case 'more':
        if (navigator.share) {
          navigator.share({
            title: 'Refer a host on Airbnb',
            text: shareText,
            url: fullReferralLink,
          }).catch(() => {});
        } else {
          copyToClipboard();
        }
        break;
      default:
        copyToClipboard();
        break;
    }
  };

  const handleDownloadQr = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(fullReferralLink)}`;
    fetch(qrUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `airbnb-referral-${referralCode}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success('QR Code saved successfully!');
      })
      .catch(() => {
        toast.error('Failed to download QR code');
      });
  };

  const userInitial = user?.firstName?.charAt(0)?.toUpperCase() || user?.first_name?.charAt(0)?.toUpperCase() || 'M';

  return (
    <div className={styles['refer-page-wrapper']}>
      <main className="container">

        {/* Header Actions */}
        <div className={styles['refer-header-actions']}>
          <button
            className={styles['refer-action-btn']}
            onClick={handleQrClick}
            title="View QR Code"
          >
            <FaQrcode size={16} />
          </button>
          <button
            className={styles['refer-action-btn']}
            onClick={handleCustomiseLinkClick}
          >
            <FaPen size={14} /> Customise link
          </button>
        </div>

        <h1 className={styles['refer-main-title']}>Refer a host, earn cash</h1>

        {/* Bootstrap Grid for Cards */}
        <div className="row justify-content-center">
          
          <div className="col-lg-4 col-md-4 col-sm-12 mb-3">
            <div
              className={`${styles['refer-card']} ${isAuthenticated && selectedCard === 'home' ? styles['refer-card-active'] : ''}`}
              onClick={() => handleCardClick('home')}
            >
              <div className={styles['refer-card-content']}>
                <div className={styles['refer-card-title']}>Home</div>
                <div className={styles['refer-card-subtitle']}>You'll earn ₹1,928 INR – ₹3,374 INR</div>
              </div>
              <div className={styles['refer-card-icon']}>
                <FcHome />
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-4 col-sm-12 mb-3">
            <div
              className={`${styles['refer-card']} ${isAuthenticated && selectedCard === 'experience' ? styles['refer-card-active'] : ''}`}
              onClick={() => handleCardClick('experience')}
            >
              <div className={styles['refer-card-content']}>
                <div className={styles['refer-card-title']}>Experience</div>
                <div className={styles['refer-card-subtitle']}>You'll earn ₹4,820 INR</div>
              </div>
              <div className={styles['refer-card-icon']}>
                <FcGlobe />
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-4 col-sm-12 mb-lg-3 mb-0">
            <div
              className={`${styles['refer-card']} ${isAuthenticated && selectedCard === 'service' ? styles['refer-card-active'] : ''}`}
              onClick={() => handleCardClick('service')}
            >
              <div className={styles['refer-card-content']}>
                <div className={styles['refer-card-title']}>Service</div>
                <div className={styles['refer-card-subtitle']}>You'll earn ₹1,928 INR – ₹9,640 INR</div>
              </div>
              <div className={styles['refer-card-icon']}>
                <FaConciergeBell />
              </div>
            </div>
          </div>

        </div>

        {/* Share Button */}
        <div className={styles['refer-share-container']}>
          <button
            className={`${styles['refer-share-btn']} ${isAuthenticated ? styles['refer-share-btn-active'] : ''}`}
            disabled={!isAuthenticated}
            onClick={handleShareButtonClick}
          >
            Share referral link
          </button>
        </div>

      </main>

      {/* Footer Text */}
      {/* <div className={styles['refer-footer-text']}>
        Only for Airbnb members. Eligible locations and listing types only. Amounts expire on 6 Dec 2026. <a href="#">Terms apply</a>
      </div> */}

      {/* Auth Modal for Unauthenticated Users */}
      <AuthModal show={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* 1. Custom Links Modal */}
      {showCustomLinkModal && (
        <div className={styles['modal-overlay']} onClick={() => setShowCustomLinkModal(false)}>
          <div className={styles['modal-container']} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles['modal-close-btn']}
              onClick={() => setShowCustomLinkModal(false)}
              aria-label="Close"
            >
              <IoMdClose />
            </button>
            <h2 className={styles['modal-title']}>Custom links</h2>
            <p className={styles['modal-subtitle']}>Create up to 3 more homes referral links.</p>

            <div className={styles['custom-link-box']}>
              <div className={styles['custom-link-content']}>
                <span className={styles['custom-link-prefix']}>airbnb.co.in/rp/</span>
                <span className={styles['custom-link-code']}>{referralCode}</span>
              </div>
              <button
                className={styles['custom-link-action-icon']}
                onClick={() => copyToClipboard(fullReferralLink)}
                title="Copy link"
              >
                <FiCopy size={20} />
              </button>
            </div>

            <div
              className={styles['create-link-box']}
              onClick={() => {
                const newCode = prompt('Enter custom link suffix (e.g. yourname):');
                if (newCode && newCode.trim()) {
                  const custom = `https://airbnb.co.in/rp/${newCode.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}`;
                  copyToClipboard(custom);
                  toast.success('Custom link created and copied!');
                }
              }}
            >
              <span>Create a link</span>
              <FiPlus size={20} />
            </div>
          </div>
        </div>
      )}

      {/* 2. QR Code Modal */}
      {showQrModal && (
        <div className={styles['modal-overlay']} onClick={() => setShowQrModal(false)}>
          <div className={styles['modal-container']} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles['modal-close-btn']}
              onClick={() => setShowQrModal(false)}
              aria-label="Close"
            >
              <IoMdClose />
            </button>
            <h2 className={styles['modal-title']}>Your referral code</h2>
            <p className={styles['modal-subtitle']}>
              Have your friend scan this code with their device's camera to get started.
            </p>

            <div className={styles['qr-card-container']}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(fullReferralLink)}&margin=4`}
                alt="Referral QR Code"
                style={{ width: '220px', height: '220px', borderRadius: '16px' }}
              />
              <div className={styles['qr-avatar-badge']}>
                {user?.profilePicture || user?.avatar ? (
                  <img src={user.profilePicture || user.avatar} alt="User" />
                ) : (
                  <div className={styles['qr-avatar-initials']}>{userInitial}</div>
                )}
              </div>
            </div>

            <button className={styles['modal-btn-black']} onClick={handleDownloadQr}>
              Save
            </button>
            <button
              className={styles['modal-btn-light']}
              onClick={() => {
                setShowQrModal(false);
                setShowShareModal(true);
              }}
            >
              Share
            </button>
          </div>
        </div>
      )}

      {/* 3. Share Options Modal */}
      {showShareModal && (
        <div className={styles['modal-overlay']} onClick={() => setShowShareModal(false)}>
          <div className={styles['modal-container']} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles['modal-close-btn']}
              onClick={() => setShowShareModal(false)}
              aria-label="Close"
            >
              <IoMdClose />
            </button>
            <h2 className={styles['modal-title']} style={{ textAlign: 'left', marginBottom: '20px' }}>
              Share your referral link
            </h2>

            <div className={styles['share-host-badge']}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '12px',
                  background: '#f7f7f7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                }}
              >
                👥
              </div>
              <div className={styles['share-host-tagline']}>
                You'd be a great Airbnb host!
              </div>
            </div>

            <div className={styles['share-grid']}>
              <button className={styles['share-option-btn']} onClick={() => handleShareOption('copy')}>
                <span className={styles['share-option-icon']}><FiCopy /></span>
                <span>Copy Link</span>
              </button>

              <button className={styles['share-option-btn']} onClick={() => handleShareOption('email')}>
                <span className={styles['share-option-icon']}><FaEnvelope /></span>
                <span>Email</span>
              </button>

              <button className={styles['share-option-btn']} onClick={() => handleShareOption('messages')}>
                <span className={styles['share-option-icon']}><FaCommentDots /></span>
                <span>Messages</span>
              </button>

              <button className={styles['share-option-btn']} onClick={() => handleShareOption('whatsapp')}>
                <span className={styles['share-option-icon']} style={{ color: '#25D366' }}><FaWhatsapp /></span>
                <span>WhatsApp</span>
              </button>

              <button className={styles['share-option-btn']} onClick={() => handleShareOption('messenger')}>
                <span className={styles['share-option-icon']} style={{ color: '#0084FF' }}><FaFacebookMessenger /></span>
                <span>Messenger</span>
              </button>

              <button className={styles['share-option-btn']} onClick={() => handleShareOption('facebook')}>
                <span className={styles['share-option-icon']} style={{ color: '#1877F2' }}><FaFacebook /></span>
                <span>Facebook</span>
              </button>

              <button className={styles['share-option-btn']} onClick={() => handleShareOption('twitter')}>
                <span className={styles['share-option-icon']}><FaXTwitter /></span>
                <span>Twitter</span>
              </button>

              <button className={styles['share-option-btn']} onClick={() => handleShareOption('more')}>
                <span className={styles['share-option-icon']}><FaEllipsisH /></span>
                <span>More options</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Refer;
