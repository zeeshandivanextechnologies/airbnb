import React, { useState } from 'react';
import { 
  FaUserTie,
  FaArrowUp,
  FaArrowDown, 
  FaClock, 
  FaShieldAlt, 
  FaBan, 
  FaCheck, 
  FaTimes, 
  FaSearch, 
  FaEye, 
  FaHome, 
  FaRupeeSign, 
  FaIdCard, 
  FaCalendarAlt, 
  FaEnvelope, 
  FaPhoneAlt, 
  FaMapMarkerAlt,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaExclamationCircle
} from 'react-icons/fa';
import styles from './styles/Hosts.module.css';

export default function Hosts() {
  const initialHosts = [
    {
      id: 1,
      name: 'Priya Sharma',
      email: 'priya.sharma@artstays.in',
      phone: '+91 98290 12345',
      city: 'Jaipur, Rajasthan',
      kycType: 'Aadhaar & PAN Card',
      kycDocId: 'AADHAAR-8921-XXXX',
      kycStatus: 'Verified',
      registrationStatus: 'Approved',
      listingsCount: 4,
      totalEarnings: '₹3,45,000',
      payouts: [
        { id: 'PAY-901', amount: '₹42,000', date: '01 Oct 2026', status: 'Settled' },
        { id: 'PAY-864', amount: '₹68,500', date: '15 Sep 2026', status: 'Settled' }
      ],
      avatarBg: '#ff385c',
      initials: 'PS'
    },
    {
      id: 2,
      name: 'Mohammad Alvi',
      email: 'mohammad.alvi@heritage.in',
      phone: '+91 98760 54321',
      city: 'Sawai Madhopur, RJ',
      kycType: 'Passport & PAN',
      kycDocId: 'PASS-Z982143',
      kycStatus: 'Verified',
      registrationStatus: 'Approved',
      listingsCount: 2,
      totalEarnings: '₹1,85,000',
      payouts: [
        { id: 'PAY-892', amount: '₹28,000', date: '28 Sep 2026', status: 'Settled' }
      ],
      avatarBg: '#16a34a',
      initials: 'MA'
    },
    {
      id: 3,
      name: 'Ananya Roy',
      email: 'ananya.roy@goastays.com',
      phone: '+91 99123 45678',
      city: 'North Goa',
      kycType: 'Aadhaar Card',
      kycDocId: 'AADHAAR-5541-XXXX',
      kycStatus: 'Under Review',
      registrationStatus: 'Pending',
      listingsCount: 1,
      totalEarnings: '₹0 (New)',
      payouts: [],
      avatarBg: '#ca8a04',
      initials: 'AR'
    },
    {
      id: 4,
      name: 'Vikram Rajput',
      email: 'vikram.rajput@hilltop.in',
      phone: '+91 94140 88776',
      city: 'Udaipur, Rajasthan',
      kycType: 'Driving License & PAN',
      kycDocId: 'DL-RJ-14202100',
      kycStatus: 'Verified',
      registrationStatus: 'Approved',
      listingsCount: 6,
      totalEarnings: '₹8,20,000',
      payouts: [
        { id: 'PAY-912', amount: '₹1,15,000', date: '05 Oct 2026', status: 'Settled' },
        { id: 'PAY-875', amount: '₹95,000', date: '20 Sep 2026', status: 'Settled' }
      ],
      avatarBg: '#2563eb',
      initials: 'VR'
    },
    {
      id: 5,
      name: 'Devendra Joshi',
      email: 'devendra.j@mountainvilla.com',
      phone: '+91 98111 22334',
      city: 'Manali, Himachal Pradesh',
      kycType: 'Voter ID Card',
      kycDocId: 'EPIC-XYZ9811',
      kycStatus: 'Rejected',
      registrationStatus: 'Rejected',
      listingsCount: 0,
      totalEarnings: '₹0',
      payouts: [],
      avatarBg: '#6b7280',
      initials: 'DJ'
    },
    {
      id: 6,
      name: 'Kavita Menon',
      email: 'kavita.menon@keralabackwaters.in',
      phone: '+91 97455 66778',
      city: 'Alleppey, Kerala',
      kycType: 'Aadhaar & GSTIN',
      kycDocId: 'AADHAAR-7712-XXXX',
      kycStatus: 'Verified',
      registrationStatus: 'Suspended',
      listingsCount: 3,
      totalEarnings: '₹4,10,000',
      payouts: [
        { id: 'PAY-880', amount: '₹52,000', date: '10 Sep 2026', status: 'Settled' }
      ],
      avatarBg: '#dc2626',
      initials: 'KM'
    }
  ];

  const [hosts, setHosts] = useState(initialHosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'approved' | 'suspended'
  const [kycFilter, setKycFilter] = useState('all'); // 'all' | 'Verified' | 'Under Review' | 'Rejected'

  // Modals state
  const [selectedHost, setSelectedHost] = useState(null); // for KYC & Details
  const [payoutHost, setPayoutHost] = useState(null); // for Earnings & Payout history

  // Filtered Hosts
  const filteredHosts = hosts.filter((h) => {
    const matchesSearch = 
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'pending' ? h.registrationStatus === 'Pending' :
      activeTab === 'approved' ? h.registrationStatus === 'Approved' :
      activeTab === 'suspended' ? h.registrationStatus === 'Suspended' : true;

    const matchesKyc = 
      kycFilter === 'all' ? true : h.kycStatus === kycFilter;

    return matchesSearch && matchesTab && matchesKyc;
  });

  // Action handlers
  const handleApproveRegistration = (id) => {
    setHosts(hosts.map(h => h.id === id ? { ...h, registrationStatus: 'Approved', kycStatus: 'Verified' } : h));
    if (selectedHost && selectedHost.id === id) {
      setSelectedHost({ ...selectedHost, registrationStatus: 'Approved', kycStatus: 'Verified' });
    }
  };

  const handleRejectRegistration = (id) => {
    setHosts(hosts.map(h => h.id === id ? { ...h, registrationStatus: 'Rejected', kycStatus: 'Rejected' } : h));
    if (selectedHost && selectedHost.id === id) {
      setSelectedHost({ ...selectedHost, registrationStatus: 'Rejected', kycStatus: 'Rejected' });
    }
  };

  const handleToggleSuspend = (id) => {
    setHosts(hosts.map(h => {
      if (h.id === id) {
        const nextStatus = h.registrationStatus === 'Suspended' ? 'Approved' : 'Suspended';
        return { ...h, registrationStatus: nextStatus };
      }
      return h;
    }));
  };

  return (
    <>
      {/* 1. Stat Summary Cards */}
      <div className="row mb-3">
        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Total Hosts</span>
                <div className={styles.statIconBox} style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <FaUserTie />
                </div>
              </div>
              <div className={styles.statValue}>{hosts.length}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
                <FaArrowUp size={9} /> +8.1%
              </span>
              <span className={styles.statSubtext}>Active partners</span>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Pending Approval</span>
                <div className={styles.statIconBox} style={{ background: '#fefce8', color: '#ca8a04' }}>
                  <FaClock />
                </div>
              </div>
              <div className={styles.statValue}>{hosts.filter(h => h.registrationStatus === 'Pending').length}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeWarning}`}>
                Action Needed
              </span>
              <span className={styles.statSubtext}>New registrations</span>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>KYC Verified</span>
                <div className={styles.statIconBox} style={{ background: '#f0fdf4', color: '#16a34a' }}>
                  <FaShieldAlt />
                </div>
              </div>
              <div className={styles.statValue}>{hosts.filter(h => h.kycStatus === 'Verified').length}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
                Govt ID Ok
              </span>
              <span className={styles.statSubtext}>Verified identities</span>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
  <div className={styles.statCard}>
    <div>
      <div className={styles.statHeader}>
        <span className={styles.statTitle}>Suspended</span>
        <div
          className={styles.statIconBox}
          style={{ background: '#fef2f2', color: '#dc2626' }}
        >
          <FaBan />
        </div>
      </div>

      <div className={styles.statValue}>
        {hosts.filter(h => h.registrationStatus === 'Suspended').length}
      </div>
    </div>

    <div className={styles.statFooter}>
      <span className={`${styles.badgeTrend} ${styles.badgeAlert}`}>
        Restricted
      </span>
      <span className={styles.statSubtext}>Requires review</span>
    </div>
  </div>
</div>
      </div>

      {/* 2. Main Hosts Directory Card */}
      <div className={styles.mainCard}>
        <div className={styles.cardHeader}>
          <div className={styles.headerTitles}>
            <h2 className={styles.title}>Host Management & Verification</h2>
            <p className={styles.subtitle}>
              Review host registrations, verify government ID proofs, monitor earnings and control host status.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className={styles.tabGroup}>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'all' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All ({hosts.length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'pending' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending ({hosts.filter(h => h.registrationStatus === 'Pending').length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'approved' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('approved')}
            >
              Approved
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'suspended' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('suspended')}
            >
              Suspended
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className={styles.controlsBar}>
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search host by name, email or city..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <select 
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">KYC: All</option>
              <option value="Verified">KYC Verified</option>
              <option value="Under Review">KYC Under Review</option>
              <option value="Rejected">KYC Rejected</option>
            </select>
          </div>
        </div>

        {/* Hosts Table */}
        <div className="table-responsive">
          <table className={`table table-hover align-middle mb-0 ${styles.hostTable}`}>
            <thead className="table-light">
              <tr>
                <th style={{ width: '60px' }}>Sr. No.</th>
                <th>Host Profile</th>
                <th>Location</th>
                <th>KYC Verification</th>
                <th>Listings</th>
                <th>Total Earnings</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHosts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#9ca3af' }}>
                    No hosts found matching the selected search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredHosts.map((host, idx) => (
                  <tr key={host.id}>
                    <td><span style={{ fontWeight: '600', color: '#64748b' }}>{idx + 1}</span></td>
                    <td>
                      <div className={styles.hostProfileCell}>
                        <div className={styles.avatarBox} style={{ backgroundColor: host.avatarBg }}>
                          {host.initials}
                        </div>
                        <div className={styles.hostMeta}>
                          <span className={styles.hostName}>{host.name}</span>
                          <span className={styles.hostEmail}>{host.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span style={{ color: '#4b5563' }}>{host.city}</span>
                    </td>

                    {/* KYC Badge */}
                    <td>
                      <span 
                        className={`${styles.kycBadge} ${
                          host.kycStatus === 'Verified' ? styles.kycVerified :
                          host.kycStatus === 'Under Review' ? styles.kycReview : styles.kycRejected
                        }`}
                        onClick={() => setSelectedHost(host)}
                        style={{ cursor: 'pointer' }}
                        title="Click to review ID proof"
                      >
                        <FaIdCard size={11} />
                        {host.kycStatus}
                      </span>
                    </td>

                    {/* Listings */}
                    <td>
                      <span style={{ fontWeight: '600', color: '#111111' }}>
                        {host.listingsCount} {host.listingsCount === 1 ? 'Stay' : 'Stays'}
                      </span>
                    </td>

                    {/* Total Earnings */}
                    <td>
                      <button 
                        type="button"
                        onClick={() => setPayoutHost(host)}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                        title="View Earnings & Payout History"
                      >
                        <span style={{ fontWeight: '700', color: '#16a34a', textDecoration: 'underline dotted' }}>
                          {host.totalEarnings}
                        </span>
                      </button>
                    </td>

                    {/* Registration Status */}
                    <td>
                      <span className={`${styles.badgeStatus} ${
                        host.registrationStatus === 'Approved' ? styles.badgeActive :
                        host.registrationStatus === 'Pending' ? styles.badgePending :
                        host.registrationStatus === 'Suspended' ? styles.badgeSuspended : styles.badgeRejected
                      }`}>
                        ● {host.registrationStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className={styles.actionGroup}>
                        {/* If Pending: Approve / Reject buttons */}
                        {host.registrationStatus === 'Pending' ? (
                          <>
                            <button 
                              type="button" 
                              className={`${styles.btnAction} ${styles.btnApprove}`}
                              onClick={() => handleApproveRegistration(host.id)}
                              title="Approve Host Registration"
                            >
                              <FaCheck /> Approve
                            </button>
                            <button 
                              type="button" 
                              className={`${styles.btnAction} ${styles.btnReject}`}
                              onClick={() => handleRejectRegistration(host.id)}
                              title="Reject Registration"
                            >
                              <FaTimes /> Reject
                            </button>
                          </>
                        ) : (
                          <>
                            {/* View KYC & Details */}
                            <button 
                              type="button" 
                              className={`${styles.btnAction} ${styles.btnActionView}`}
                              onClick={() => setSelectedHost(host)}
                              title="View KYC & Profile Details"
                            >
                              <FaEye /> View
                            </button>

                            {/* View Payout History */}
                            <button 
                              type="button" 
                              className={styles.btnAction}
                              onClick={() => setPayoutHost(host)}
                              title="Earnings & Payouts"
                            >
                              <FaFileInvoiceDollar /> Payouts
                            </button>

                            {/* Suspend / Unsuspend */}
                            <button 
                              type="button" 
                              className={`${styles.btnAction} ${styles.btnActionSuspend}`}
                              onClick={() => handleToggleSuspend(host.id)}
                              title={host.registrationStatus === 'Suspended' ? 'Unsuspend Host' : 'Suspend / Block Host'}
                            >
                              {host.registrationStatus === 'Suspended' ? <FaCheck color="#16a34a" /> : <FaBan color="#ea580c" />}
                            </button>
                          </>
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

      {/* 3. KYC Verification & Details Modal Dialog */}
      {selectedHost && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedHost(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Host KYC & Registration Review</h3>
              <button type="button" className={styles.modalCloseBtn} onClick={() => setSelectedHost(null)}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div className={styles.avatarBox} style={{ width: '56px', height: '56px', fontSize: '20px', backgroundColor: selectedHost.avatarBg }}>
                  {selectedHost.initials}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>{selectedHost.name}</h4>
                  <span style={{ color: '#717171', fontSize: '13px' }}>Host ID: #HST-00{selectedHost.id} · {selectedHost.city}</span>
                </div>
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}><FaEnvelope /> Email Address</span>
                  <span className={styles.infoVal}>{selectedHost.email}</span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}><FaPhoneAlt /> Phone Number</span>
                  <span className={styles.infoVal}>{selectedHost.phone}</span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}><FaHome /> Active Stays</span>
                  <span className={styles.infoVal}>{selectedHost.listingsCount} Listings Online</span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}><FaRupeeSign /> Total Lifetime Earnings</span>
                  <span className={styles.infoVal} style={{ color: '#16a34a' }}>{selectedHost.totalEarnings}</span>
                </div>
              </div>

              {/* KYC ID Proof Document Box */}
              <div style={{ marginTop: '20px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#111111', display: 'block', marginBottom: '6px' }}>
                  Government ID Proof Submitted:
                </span>
                <div className={styles.kycDocPreview}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '24px', color: '#2563eb' }}><FaIdCard /></div>
                    <div>
                      <span style={{ fontWeight: '700', fontSize: '14px', display: 'block', color: '#111111' }}>
                        {selectedHost.kycType}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        Doc Ref: {selectedHost.kycDocId}
                      </span>
                    </div>
                  </div>
                  <span className={`${styles.kycBadge} ${
                    selectedHost.kycStatus === 'Verified' ? styles.kycVerified :
                    selectedHost.kycStatus === 'Under Review' ? styles.kycReview : styles.kycRejected
                  }`}>
                    {selectedHost.kycStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              {selectedHost.registrationStatus === 'Pending' ? (
                <>
                  <button 
                    type="button" 
                    className={`${styles.btnAction} ${styles.btnReject}`}
                    onClick={() => handleRejectRegistration(selectedHost.id)}
                  >
                    <FaTimes /> Reject Registration
                  </button>
                  <button 
                    type="button" 
                    className={styles.btnPrimary}
                    onClick={() => handleApproveRegistration(selectedHost.id)}
                  >
                    <FaCheck /> Approve Host & KYC
                  </button>
                </>
              ) : (
                <button type="button" className={styles.btnSecondary} onClick={() => setSelectedHost(null)}>
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Earnings & Payout History Modal */}
      {payoutHost && (
        <div className={styles.modalBackdrop} onClick={() => setPayoutHost(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Host Earnings & Payout History</h3>
              <button type="button" className={styles.modalCloseBtn} onClick={() => setPayoutHost(null)}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0', marginBottom: '18px' }}>
                <span style={{ fontSize: '12px', color: '#15803d', fontWeight: '600', textTransform: 'uppercase' }}>
                  Total Earnings Disbursed
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '800', color: '#166534' }}>
                  {payoutHost.totalEarnings}
                </h3>
                <span style={{ fontSize: '12px', color: '#16a34a' }}>
                  Platform fee 20% already deducted automatically.
                </span>
              </div>

              <span style={{ fontSize: '14px', fontWeight: '700', color: '#111111', display: 'block', marginBottom: '8px' }}>
                Recent Payout Disbursements:
              </span>

              {payoutHost.payouts.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '13px', background: '#f8fafc', borderRadius: '10px' }}>
                  No historical payouts found for this host yet.
                </div>
              ) : (
                <div className={styles.payoutHistoryList}>
                  {payoutHost.payouts.map((pay) => (
                    <div key={pay.id} className={styles.payoutHistoryItem}>
                      <div>
                        <span style={{ fontWeight: '700', color: '#111111', display: 'block' }}>{pay.id}</span>
                        <span style={{ color: '#64748b' }}>Date: {pay.date}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: '700', color: '#16a34a', fontSize: '14px', display: 'block' }}>{pay.amount}</span>
                        <span style={{ color: '#059669', fontWeight: '600' }}>✓ {pay.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button type="button" className={styles.btnSecondary} onClick={() => setPayoutHost(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
