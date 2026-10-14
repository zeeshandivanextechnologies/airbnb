import React, { useState } from 'react';
import { 
  FaCalendarCheck, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaExclamationTriangle, 
  FaSearch, 
  FaEdit, 
  FaEye, 
  FaRupeeSign, 
  FaUndo, 
  FaUser, 
  FaHome, 
  FaClock, 
  FaCheck, 
  FaTimes, 
  FaShieldAlt,
  FaArrowUp,
  FaGavel
} from 'react-icons/fa';
import styles from './styles/Bookings.module.css';

export default function Bookings() {
  const initialBookings = [
    {
      id: 'BK-10842',
      stayTitle: 'Sunset Hilltop Heritage Homestay',
      host: 'Vikram Rajput',
      guestName: 'Rahul Verma',
      guestEmail: 'rahul.verma@example.com',
      guestPhone: '+91 98711 22334',
      dates: '16 Oct 2026 – 19 Oct 2026 (3 Nights)',
      amount: 7200,
      airbnbFee: 1440,
      hostPayout: 5760,
      status: 'Upcoming', // 'Upcoming' | 'Completed' | 'Cancelled' | 'Dispute'
      paymentStatus: 'Paid',
      refundStatus: 'None',
      disputeReason: '',
      disputeResolution: ''
    },
    {
      id: 'BK-10839',
      stayTitle: 'Goan Beachfront Eco Cottage',
      host: 'Ananya Roy',
      guestName: 'Sneha Patel',
      guestEmail: 'sneha.patel@example.com',
      guestPhone: '+91 98220 44556',
      dates: '01 Oct 2026 – 04 Oct 2026 (3 Nights)',
      amount: 9600,
      airbnbFee: 1920,
      hostPayout: 7680,
      status: 'Completed',
      paymentStatus: 'Paid',
      refundStatus: 'None',
      disputeReason: '',
      disputeResolution: ''
    },
    {
      id: 'BK-10835',
      stayTitle: 'Snow View Wooden Chalet',
      host: 'Devendra Joshi',
      guestName: 'Arjun Singhania',
      guestEmail: 'arjun.s@example.com',
      guestPhone: '+91 99345 66778',
      dates: '12 Oct 2026 – 15 Oct 2026 (3 Nights)',
      amount: 13500,
      airbnbFee: 2700,
      hostPayout: 10800,
      status: 'Cancelled',
      paymentStatus: 'Refunded',
      refundStatus: 'Full Refund Processed (₹13,500)',
      disputeReason: 'Guest flight cancelled due to bad weather',
      disputeResolution: 'Approved 100% refund under Extenuating Policy'
    },
    {
      id: 'BK-10828',
      stayTitle: 'Travel Sketching in Old Jaipur Courtyard',
      host: 'Priya Sharma',
      guestName: 'Karan Malhotra',
      guestEmail: 'karan.m@example.com',
      guestPhone: '+91 97110 88990',
      dates: '08 Oct 2026 (1 Day Experience)',
      amount: 800,
      airbnbFee: 160,
      hostPayout: 640,
      status: 'Completed',
      paymentStatus: 'Paid',
      refundStatus: 'None',
      disputeReason: '',
      disputeResolution: ''
    },
    {
      id: 'BK-10822',
      stayTitle: 'Creative Hair & Styling Studio Stay',
      host: 'Mohammad Alvi',
      guestName: 'Vikas Taneja',
      guestEmail: 'vikas.t@example.com',
      guestPhone: '+91 94140 33221',
      dates: '18 Oct 2026 – 20 Oct 2026 (2 Nights)',
      amount: 1000,
      airbnbFee: 200,
      hostPayout: 800,
      status: 'Dispute',
      paymentStatus: 'Held in Escrow',
      refundStatus: 'Pending Review',
      disputeReason: 'Host rescheduled session without 24hr notice; guest requested full refund.',
      disputeResolution: ''
    }
  ];

  const [bookings, setBookings] = useState(initialBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'Upcoming' | 'Completed' | 'Cancelled' | 'Dispute'
  
  // Modals state
  const [selectedBooking, setSelectedBooking] = useState(null); // for view details
  const [statusBooking, setStatusBooking] = useState(null); // for changing status
  const [disputeBooking, setDisputeBooking] = useState(null); // for dispute / complaint resolution
  const [refundBooking, setRefundBooking] = useState(null); // for cancellation & refund

  // Dispute resolution text state
  const [disputeSolution, setDisputeSolution] = useState('');

  // Filtered logic
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.stayTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.host.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = 
      activeTab === 'all' ? true : b.status === activeTab;

    return matchesSearch && matchesTab;
  });

  // Handlers
  const handleUpdateStatus = (id, newStatus) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    setStatusBooking(null);
  };

  const handleProcessRefund = (id, refundAmount, reason) => {
    setBookings(bookings.map(b => {
      if (b.id === id) {
        return {
          ...b,
          status: 'Cancelled',
          paymentStatus: 'Refunded',
          refundStatus: `Refund Processed (₹${refundAmount})`,
          disputeReason: reason || 'Cancelled with refund'
        };
      }
      return b;
    }));
    setRefundBooking(null);
  };

  const handleResolveDispute = (id, decision) => {
    setBookings(bookings.map(b => {
      if (b.id === id) {
        return {
          ...b,
          status: decision === 'refund' ? 'Cancelled' : 'Completed',
          paymentStatus: decision === 'refund' ? 'Refunded' : 'Released to Host',
          refundStatus: decision === 'refund' ? `Full Refund (₹${b.amount})` : 'No Refund - Released to Host',
          disputeResolution: disputeSolution || (decision === 'refund' ? 'Resolved in favor of guest with refund' : 'Resolved in favor of host')
        };
      }
      return b;
    }));
    setDisputeBooking(null);
    setDisputeSolution('');
  };

  return (
    <>
      {/* 1. Stat Summary Cards */}
      <div className="row mb-3">
        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Total Bookings</span>
                <div className={styles.statIconBox} style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <FaCalendarCheck />
                </div>
              </div>
              <div className={styles.statValue}>{bookings.length}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
                <FaArrowUp size={9} /> Active
              </span>
              <span className={styles.statSubtext}>Across all listings</span>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Upcoming Trips</span>
                <div className={styles.statIconBox} style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <FaClock />
                </div>
              </div>
              <div className={styles.statValue}>{bookings.filter(b => b.status === 'Upcoming').length}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeBlue}`}>
                Scheduled
              </span>
              <span className={styles.statSubtext}>Awaiting check-in</span>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Open Disputes</span>
                <div className={styles.statIconBox} style={{ background: '#fefce8', color: '#ca8a04' }}>
                  <FaExclamationTriangle />
                </div>
              </div>
              <div className={styles.statValue}>{bookings.filter(b => b.status === 'Dispute').length}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeWarning}`}>
                Action Needed
              </span>
              <span className={styles.statSubtext}>Complaints to resolve</span>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Cancelled / Refund</span>
                <div className={styles.statIconBox} style={{ background: '#fef2f2', color: '#dc2626' }}>
                  <FaUndo />
                </div>
              </div>
              <div className={styles.statValue}>{bookings.filter(b => b.status === 'Cancelled').length}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeAlert}`}>
                Processed
              </span>
              <span className={styles.statSubtext}>Policy settlements</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Bookings Directory Card */}
      <div className={styles.mainCard}>
        <div className={styles.cardHeader}>
          <div className={styles.headerTitles}>
            <h2 className={styles.title}>Reservations & Booking Management</h2>
            <p className={styles.subtitle}>
              Monitor upcoming & completed stays, change booking status, process refunds and resolve disputes.
            </p>
          </div>

          {/* Quick Filter Status Tabs */}
          <div className={styles.tabGroup}>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'all' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All ({bookings.length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'Upcoming' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('Upcoming')}
            >
              Upcoming ({bookings.filter(b => b.status === 'Upcoming').length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'Completed' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('Completed')}
            >
              Completed
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'Dispute' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('Dispute')}
            >
              Disputes ({bookings.filter(b => b.status === 'Dispute').length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'Cancelled' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('Cancelled')}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className={styles.controlsBar}>
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search by ID (#BK-...), Stay, Guest or Host..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
            Showing <strong>{filteredBookings.length}</strong> bookings
          </div>
        </div>

        {/* Bookings Table */}
        <div className="table-responsive">
          <table className={`table table-hover align-middle mb-0 ${styles.bookingTable}`}>
            <thead className="table-light">
              <tr>
                <th style={{ width: '60px' }}>Sr. No.</th>
                <th>Booking Ref</th>
                <th>Property / Stay</th>
                <th>Guest Details</th>
                <th>Dates & Duration</th>
                <th>Total Paid</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#9ca3af' }}>
                    No bookings found matching the selected search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b, idx) => (
                  <tr key={b.id}>
                    <td><span style={{ fontWeight: '600', color: '#64748b' }}>{idx + 1}</span></td>
                    {/* Booking ID */}
                    <td>
                      <span className={styles.bookingIdBadge}>{b.id}</span>
                    </td>

                    {/* Stay Info */}
                    <td>
                      <div className={styles.stayInfoCell}>
                        <span className={styles.stayTitle}>{b.stayTitle}</span>
                        <span className={styles.stayHost}>Host: {b.host}</span>
                      </div>
                    </td>

                    {/* Guest Cell */}
                    <td>
                      <div className={styles.guestCell}>
                        <span className={styles.guestName}>{b.guestName}</span>
                        <span className={styles.guestContact}>{b.guestEmail}</span>
                      </div>
                    </td>

                    {/* Dates */}
                    <td>
                      <span style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FaCalendarAlt size={11} color="#6b7280" />
                        {b.dates}
                      </span>
                    </td>

                    {/* Total Amount */}
                    <td>
                      <div className='d-flex align-items-center gap-2'>
                        <span style={{ fontWeight: '800', color: '#111111', fontSize: '14px' }}>
                          ₹{b.amount.toLocaleString()}
                        </span>
                        {b.refundStatus !== 'None' && (
                          <div className={`${styles.refundBadge} ${
                            b.refundStatus.includes('Processed') ? styles.refundProcessed : styles.refundFull
                          }`}>
                            {b.refundStatus}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td>
                      <span className={`${styles.badgeStatus} ${
                        b.status === 'Upcoming' ? styles.badgeUpcoming :
                        b.status === 'Completed' ? styles.badgeCompleted :
                        b.status === 'Dispute' ? styles.badgeDispute : styles.badgeCancelled
                      }`}>
                        ● {b.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className={styles.actionGroup}>
                        {/* View Details */}
                        <button 
                          type="button" 
                          className={styles.btnAction}
                          onClick={() => setSelectedBooking(b)}
                          title="View Full Booking Breakdown"
                        >
                          <FaEye />
                        </button>

                        {/* Change Status */}
                        <button 
                          type="button" 
                          className={`${styles.btnAction} ${styles.btnActionStatus}`}
                          onClick={() => setStatusBooking(b)}
                          title="Change Booking Status"
                        >
                          <FaEdit /> Status
                        </button>

                        {/* If in Dispute: Resolve Button */}
                        {b.status === 'Dispute' && (
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnActionDispute}`}
                            onClick={() => setDisputeBooking(b)}
                            title="Resolve Dispute / Complaint"
                          >
                            <FaGavel /> Resolve
                          </button>
                        )}

                        {/* Cancellation & Refund */}
                        {b.status === 'Upcoming' && (
                          <button 
                            type="button" 
                            className={`${styles.btnAction} ${styles.btnActionRefund}`}
                            onClick={() => setRefundBooking(b)}
                            title="Cancel & Process Refund"
                          >
                            <FaUndo /> Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. View Booking Breakdown Modal */}
      {selectedBooking && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedBooking(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>Booking Summary ({selectedBooking.id})</h3>
                <span style={{ fontSize: '12px', color: '#717171' }}>
                  {selectedBooking.stayTitle}
                </span>
              </div>
              <button type="button" className={styles.modalCloseBtn} onClick={() => setSelectedBooking(null)}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.infoGrid}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}><FaUser /> Guest Name</span>
                  <span className={styles.infoVal}>{selectedBooking.guestName}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Guest Contact</span>
                  <span className={styles.infoVal}>{selectedBooking.guestPhone} · {selectedBooking.guestEmail}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}><FaHome /> Host Name</span>
                  <span className={styles.infoVal}>{selectedBooking.host}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}><FaCalendarAlt /> Reservation Dates</span>
                  <span className={styles.infoVal}>{selectedBooking.dates}</span>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#111111', display: 'block', marginBottom: '10px' }}>
                  Financial Settlement Breakdown:
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Total Paid by Guest:</span>
                  <span style={{ fontWeight: '800', color: '#111111' }}>₹{selectedBooking.amount.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Airbnb Commission (20% fee):</span>
                  <span style={{ fontWeight: '700', color: '#ff385c' }}>+ ₹{selectedBooking.airbnbFee.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingTop: '8px', borderTop: '1px dashed #cbd5e1' }}>
                  <span style={{ color: '#64748b' }}>Host Net Payout:</span>
                  <span style={{ fontWeight: '800', color: '#16a34a' }}>₹{selectedBooking.hostPayout.toLocaleString()}</span>
                </div>
              </div>

              {selectedBooking.disputeReason && (
                <div className={styles.disputeAlertBox}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#92400e', display: 'block', marginBottom: '4px' }}>
                    Complaint / Dispute Notes:
                  </span>
                  <p style={{ margin: 0, fontSize: '13px', color: '#78350f' }}>
                    {selectedBooking.disputeReason}
                  </p>
                  {selectedBooking.disputeResolution && (
                    <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#166534', fontWeight: '600' }}>
                      Resolution: {selectedBooking.disputeResolution}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button type="button" className={styles.btnSecondary} onClick={() => setSelectedBooking(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Change Status Modal */}
      {statusBooking && (
        <div className={styles.modalBackdrop} onClick={() => setStatusBooking(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Change Booking Status ({statusBooking.id})</h3>
              <button type="button" className={styles.modalCloseBtn} onClick={() => setStatusBooking(null)}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                Select new status for reservation at <strong>{statusBooking.stayTitle}</strong>:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Upcoming', 'Completed', 'Cancelled', 'Dispute'].map((st) => (
                  <button 
                    key={st}
                    type="button" 
                    className={styles.btnAction}
                    style={{ 
                      padding: '12px 16px', 
                      justifyContent: 'space-between',
                      border: statusBooking.status === st ? '2px solid #ff385c' : '1px solid #e5e7eb',
                      background: statusBooking.status === st ? '#fff1f2' : '#ffffff',
                      color: '#111111'
                    }}
                    onClick={() => handleUpdateStatus(statusBooking.id, st)}
                  >
                    <span style={{ fontWeight: '700' }}>{st}</span>
                    {statusBooking.status === st && <FaCheck color="#ff385c" />}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button type="button" className={styles.btnSecondary} onClick={() => setStatusBooking(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Dispute Resolution Modal */}
      {disputeBooking && (
        <div className={styles.modalBackdrop} onClick={() => setDisputeBooking(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Resolve Guest Dispute ({disputeBooking.id})</h3>
              <button type="button" className={styles.modalCloseBtn} onClick={() => setDisputeBooking(null)}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.disputeAlertBox}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#92400e', display: 'block', marginBottom: '4px' }}>
                  Reported Issue:
                </span>
                <p style={{ margin: 0, fontSize: '13px', color: '#78350f' }}>
                  {disputeBooking.disputeReason}
                </p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Resolution Summary & Notes</label>
                <textarea 
                  placeholder="Explain resolution (e.g. Host agreed to full refund due to schedule conflict)..."
                  value={disputeSolution}
                  onChange={(e) => setDisputeSolution(e.target.value)}
                  className={styles.formTextarea}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className={styles.btnSecondary}
                onClick={() => handleResolveDispute(disputeBooking.id, 'host')}
              >
                Resolve & Release to Host
              </button>
              <button 
                type="button" 
                className={styles.btnPrimary}
                onClick={() => handleResolveDispute(disputeBooking.id, 'refund')}
              >
                Approve Full Refund to Guest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Cancellation & Refund Modal */}
      {refundBooking && (
        <div className={styles.modalBackdrop} onClick={() => setRefundBooking(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Cancel Reservation & Refund ({refundBooking.id})</h3>
              <button type="button" className={styles.modalCloseBtn} onClick={() => setRefundBooking(null)}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div style={{ padding: '14px', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fecaca', marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', color: '#991b1b', fontWeight: '600' }}>
                  You are about to cancel this booking and disburse a refund to {refundBooking.guestName}.
                </span>
              </div>

              <div className={styles.infoRow} style={{ marginBottom: '14px' }}>
                <span style={{ color: '#64748b' }}>Original Total Amount:</span>
                <span style={{ fontWeight: '800', fontSize: '15px' }}>₹{refundBooking.amount.toLocaleString()}</span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Refund Amount to Guest (₹)</label>
                <input 
                  type="number" 
                  defaultValue={refundBooking.amount} 
                  id="refundAmtInput"
                  className={styles.formInput} 
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Cancellation Reason</label>
                <input 
                  type="text" 
                  placeholder="e.g. Guest requested emergency cancellation"
                  id="refundReasonInput"
                  className={styles.formInput} 
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button type="button" className={styles.btnSecondary} onClick={() => setRefundBooking(null)}>
                Dismiss
              </button>
              <button 
                type="button" 
                className={styles.btnPrimary}
                onClick={() => {
                  const amt = document.getElementById('refundAmtInput')?.value || refundBooking.amount;
                  const reason = document.getElementById('refundReasonInput')?.value || 'Guest Cancellation';
                  handleProcessRefund(refundBooking.id, amt, reason);
                }}
              >
                Confirm Refund & Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
