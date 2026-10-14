import React, { useState } from 'react';
import { 
  FaStar, 
  FaCheck, 
  FaTimes, 
  FaSearch, 
  FaEye, 
  FaTrashAlt, 
  FaExclamationTriangle, 
  FaShieldAlt, 
  FaUser, 
  FaUserTie, 
  FaHome, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaFilter,
  FaArrowUp,
  FaFlag
} from 'react-icons/fa';
import styles from './styles/Reviews.module.css';

export default function Reviews() {
  const initialReviews = [
    {
      id: 'REV-501',
      authorType: 'Guest', // 'Guest' | 'Host'
      authorName: 'Sneha Patel',
      authorRole: 'Guest',
      recipientName: 'Ananya Roy',
      recipientRole: 'Host',
      stayTitle: 'Goan Beachfront Eco Cottage',
      rating: 5,
      comment: 'Incredible stay! The cottage was right on the beach, pristine clean, and Ananya was an exceptionally warm host. Highly recommended for couples!',
      date: '10 Oct 2026',
      status: 'Published', // 'Published' | 'Flagged' | 'Removed'
      flagReason: ''
    },
    {
      id: 'REV-502',
      authorType: 'Host',
      authorName: 'Vikram Rajput',
      authorRole: 'Host',
      recipientName: 'Rahul Verma',
      recipientRole: 'Guest',
      stayTitle: 'Sunset Hilltop Heritage Homestay',
      rating: 5,
      comment: 'Rahul and his family were fantastic guests. They respected house rules, kept the property clean, and communicated proactively.',
      date: '08 Oct 2026',
      status: 'Published',
      flagReason: ''
    },
    {
      id: 'REV-503',
      authorType: 'Guest',
      authorName: 'FakeUser992',
      authorRole: 'Guest',
      recipientName: 'Mohammad Alvi',
      recipientRole: 'Host',
      stayTitle: 'Creative Hair & Styling Studio Stay',
      rating: 1,
      comment: 'Worst place ever! Don’t go here, visit my website at discountdeals.biz to get free coupons! Total scam!',
      date: '11 Oct 2026',
      status: 'Flagged',
      flagReason: 'Detected automated spam / promotional link violation.'
    },
    {
      id: 'REV-504',
      authorType: 'Guest',
      authorName: 'Karan Malhotra',
      authorRole: 'Guest',
      recipientName: 'Priya Sharma',
      recipientRole: 'Host',
      stayTitle: 'Travel Sketching in Old Jaipur Courtyard',
      rating: 5,
      comment: 'Priya is an authentic artist and a patient teacher. The historical courtyard was breathtaking and sketching tea was delicious.',
      date: '07 Oct 2026',
      status: 'Published',
      flagReason: ''
    },
    {
      id: 'REV-505',
      authorType: 'Host',
      authorName: 'Devendra Joshi',
      authorRole: 'Host',
      recipientName: 'Rohan Mehra',
      recipientRole: 'Guest',
      stayTitle: 'Snow View Wooden Chalet',
      rating: 2,
      comment: 'Guest arrived late past midnight without informing and broke two dining glasses without acknowledging.',
      date: '05 Oct 2026',
      status: 'Published',
      flagReason: ''
    },
    {
      id: 'REV-506',
      authorType: 'Guest',
      authorName: 'Anonymous_User',
      authorRole: 'Guest',
      recipientName: 'Ananya Roy',
      recipientRole: 'Host',
      stayTitle: 'Goan Beachfront Eco Cottage',
      rating: 1,
      comment: 'Horrible abusive language used by host. She threatened us directly! (Unverified dispute allegation)',
      date: '03 Oct 2026',
      status: 'Removed',
      flagReason: 'Removed by Moderator: Violates policy on defamatory unverified claims.'
    }
  ];

  const [reviews, setReviews] = useState(initialReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'guest' | 'host' | 'flagged' | 'removed'
  const [ratingFilter, setRatingFilter] = useState('all'); // 'all' | '5' | '4' | '1'

  // Selected Review for Modal Inspection
  const [inspectReview, setInspectReview] = useState(null);

  // Filtered Logic
  const filteredReviews = reviews.filter((r) => {
    const matchesSearch = 
      r.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.stayTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'guest' ? r.authorType === 'Guest' :
      activeTab === 'host' ? r.authorType === 'Host' :
      activeTab === 'flagged' ? r.status === 'Flagged' :
      activeTab === 'removed' ? r.status === 'Removed' : true;

    const matchesRating = 
      ratingFilter === 'all' ? true : r.rating === Number(ratingFilter);

    return matchesSearch && matchesTab && matchesRating;
  });

  // Action Handlers
  const handleApprovePublish = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'Published', flagReason: '' } : r));
    if (inspectReview && inspectReview.id === id) {
      setInspectReview({ ...inspectReview, status: 'Published', flagReason: '' });
    }
  };

  const handleRemoveReview = (id, reason) => {
    setReviews(reviews.map(r => r.id === id ? { 
      ...r, 
      status: 'Removed', 
      flagReason: reason || 'Removed by Administrator for policy violation.' 
    } : r));
    if (inspectReview && inspectReview.id === id) {
      setInspectReview({ ...inspectReview, status: 'Removed', flagReason: reason || 'Removed by Admin' });
    }
  };

  const handleDeletePermanently = (id) => {
    if (window.confirm('Delete this review record permanently?')) {
      setReviews(reviews.filter(r => r.id !== id));
      if (inspectReview && inspectReview.id === id) setInspectReview(null);
    }
  };

  return (
    <>
      {/* 1. Stat Summary Cards */}
      <div className="row mb-3">
        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Total Reviews</span>
                <div className={styles.statIconBox} style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <FaStar />
                </div>
              </div>
              <div className={styles.statValue}>{reviews.length}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
                <FaArrowUp size={9} /> Verified
              </span>
              <span className={styles.statSubtext}>Guests & Hosts feedback</span>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Published Live</span>
                <div className={styles.statIconBox} style={{ background: '#f0fdf4', color: '#16a34a' }}>
                  <FaCheckCircle />
                </div>
              </div>
              <div className={styles.statValue}>{reviews.filter(r => r.status === 'Published').length}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
                Live on site
              </span>
              <span className={styles.statSubtext}>Publicly visible</span>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Flagged / Fake</span>
                <div className={styles.statIconBox} style={{ background: '#fefce8', color: '#ca8a04' }}>
                  <FaFlag />
                </div>
              </div>
              <div className={styles.statValue}>{reviews.filter(r => r.status === 'Flagged').length}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeWarning}`}>
                Review Needed
              </span>
              <span className={styles.statSubtext}>Suspected spam / abuse</span>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Removed Reviews</span>
                <div className={styles.statIconBox} style={{ background: '#fef2f2', color: '#dc2626' }}>
                  <FaTimes />
                </div>
              </div>
              <div className={styles.statValue}>{reviews.filter(r => r.status === 'Removed').length}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeAlert}`}>
                Moderated
              </span>
              <span className={styles.statSubtext}>Taken down by admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Panel Card */}
      <div className={styles.mainCard}>
        <div className={styles.cardHeader}>
          <div className={styles.headerTitles}>
            <h2 className={styles.title}>Reviews & Ratings Moderation</h2>
            <p className={styles.subtitle}>
              Monitor guest and host feedback, remove fraudulent or defamatory reviews, and maintain platform trust.
            </p>
          </div>

          {/* Quick Filter Status Tabs */}
          <div className={styles.tabGroup}>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'all' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All ({reviews.length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'guest' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('guest')}
            >
              Guest Reviews ({reviews.filter(r => r.authorType === 'Guest').length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'host' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('host')}
            >
              Host Reviews ({reviews.filter(r => r.authorType === 'Host').length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'flagged' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('flagged')}
            >
              Flagged ({reviews.filter(r => r.status === 'Flagged').length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'removed' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('removed')}
            >
              Removed ({reviews.filter(r => r.status === 'Removed').length})
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className={styles.controlsBar}>
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search by Author, Recipient, Stay or Keywords..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <select 
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Rating: All Stars</option>
              <option value="5">★ 5 Stars Only</option>
              <option value="4">★ 4 Stars</option>
              <option value="2">★ 2 Stars</option>
              <option value="1">★ 1 Star (Low)</option>
            </select>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="table-responsive">
          <table className={`table table-hover align-middle mb-0 ${styles.reviewsTable}`}>
            <thead className="table-light">
              <tr>
                <th style={{ width: '60px' }}>Sr. No.</th>
                <th>Author / Type</th>
                <th>Reviewed For</th>
                <th>Rating</th>
                <th>Review Snippet</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#9ca3af' }}>
                    No reviews found matching the selected search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((r, idx) => (
                  <tr key={r.id}>
                    <td><span style={{ fontWeight: '600', color: '#64748b' }}>{idx + 1}</span></td>

                    {/* Author & Type */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontWeight: '700', color: '#111111' }}>{r.authorName}</span>
                        <span className={`${styles.typeBadge} ${r.authorType === 'Guest' ? styles.typeGuest : styles.typeHost}`}>
                          {r.authorType === 'Guest' ? <FaUser size={12} /> : <FaUserTie size={12} />}
                          {r.authorType}
                        </span>
                      </div>
                    </td>

                    {/* Recipient / Stay */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: '600', color: '#111111' }}>{r.recipientName} ({r.recipientRole})</span>
                        <span style={{ fontSize: '12px', color: '#717171' }}>{r.stayTitle}</span>
                      </div>
                    </td>

                    {/* Rating */}
                    <td>
                      <div className={styles.starRatingBox}>
                        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                        <span style={{ color: '#111111', marginLeft: '4px' }}>{r.rating}.0</span>
                      </div>
                    </td>

                    {/* Snippet */}
                    <td>
                      <div className={styles.reviewSnippet} title={r.comment}>
                        "{r.comment}"
                      </div>
                    </td>

                    {/* Date */}
                    <td>
                      <span style={{ color: '#64748b' }}>{r.date}</span>
                    </td>

                    {/* Status Badge */}
                    <td>
                      <span className={`${styles.badgeStatus} ${
                        r.status === 'Published' ? styles.badgePublished :
                        r.status === 'Flagged' ? styles.badgeFlagged : styles.badgeRemoved
                      }`}>
                        ● {r.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className={styles.actionGroup}>
                        {/* View & Inspect */}
                        <button 
                          type="button" 
                          className={`${styles.btnAction} ${styles.btnActionView}`}
                          onClick={() => setInspectReview(r)}
                          title="Inspect Full Review & Moderation Details"
                        >
                          <FaEye /> View
                        </button>

                        {/* If Flagged: Approve or Remove */}
                        {r.status === 'Flagged' && (
                          <>
                            <button 
                              type="button" 
                              className={`${styles.btnAction} ${styles.btnActionApprove}`}
                              onClick={() => handleApprovePublish(r.id)}
                              title="Approve & Publish (Mark as Authentic)"
                            >
                              <FaCheck /> Keep
                            </button>
                            <button 
                              type="button" 
                              className={`${styles.btnAction} ${styles.btnActionRemove}`}
                              onClick={() => handleRemoveReview(r.id, 'Spam / Advertisement')}
                              title="Remove Review from Public View"
                            >
                              <FaTimes /> Remove
                            </button>
                          </>
                        )}

                        {/* If Published: Option to Remove / Moderation */}
                        {r.status === 'Published' && (
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnActionRemove}`}
                            onClick={() => handleRemoveReview(r.id, 'Removed upon Host / Guest Complaint')}
                            title="Remove from Live Site"
                          >
                            <FaFlag /> Take Down
                          </button>
                        )}

                        {/* Permanent Delete */}
                        <button 
                          type="button" 
                          className={styles.btnAction}
                          onClick={() => handleDeletePermanently(r.id)}
                          title="Delete Record Permanently"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Inspect & Moderation Modal Dialog */}
      {inspectReview && (
        <div className={styles.modalBackdrop} onClick={() => setInspectReview(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Review Inspection & Moderation</h3>
              <button type="button" className={styles.modalCloseBtn} onClick={() => setInspectReview(null)}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.reviewCardDetail}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '15px', color: '#111111' }}>
                      {inspectReview.authorName} ({inspectReview.authorType})
                    </span>
                    <span style={{ color: '#64748b', fontSize: '12px', display: 'block' }}>
                      Reviewed {inspectReview.recipientName} ({inspectReview.recipientRole}) on {inspectReview.date}
                    </span>
                  </div>

                  <div className={styles.starRatingBox} style={{ fontSize: '16px' }}>
                    {'★'.repeat(inspectReview.rating)}{'☆'.repeat(5 - inspectReview.rating)}
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: '#4b5563' }}>
                  Property: <strong>{inspectReview.stayTitle}</strong>
                </div>
              </div>

              {/* Full Comment */}
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#374151', textTransform: 'uppercase' }}>
                Full Review Feedback:
              </span>
              <div className={styles.commentBlock}>
                "{inspectReview.comment}"
              </div>

              {/* Flag / Moderation notes */}
              {inspectReview.flagReason && (
                <div className={styles.flagReasonBox}>
                  <strong>Moderation Alert:</strong> {inspectReview.flagReason}
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              {inspectReview.status !== 'Published' && (
                <button 
                  type="button" 
                  className={`${styles.btnAction} ${styles.btnActionApprove}`}
                  onClick={() => handleApprovePublish(inspectReview.id)}
                >
                  <FaCheck /> Publish / Restore Review
                </button>
              )}

              {inspectReview.status !== 'Removed' && (
                <button 
                  type="button" 
                  className={`${styles.btnAction} ${styles.btnActionRemove}`}
                  onClick={() => handleRemoveReview(inspectReview.id, 'Violates Community Guidelines')}
                >
                  <FaTimes /> Take Down Review
                </button>
              )}

              <button type="button" className={styles.btnSecondary} onClick={() => setInspectReview(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
