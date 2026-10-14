import React, { useState } from 'react';
import { 
  FaUsers, 
  FaUserCheck, 
  FaUserSlash, 
  FaUserClock,
  FaArrowUp,
  FaArrowDown,
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaEdit, 
  FaBan, 
  FaCheck, 
  FaTrashAlt, 
  FaEnvelope, 
  FaPhoneAlt, 
  FaTimes, 
  FaShieldAlt,
  FaCalendarAlt,
  FaMapMarkerAlt
} from 'react-icons/fa';
import styles from './styles/Users.module.css';
import { adminApiRequest } from '../services/api';

export default function Users() {
  // Mock Guest Users list with email and phone verification status
  const initialUsers = [
    {
      id: 1,
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      phone: '+91 98765 43210',
      city: 'Mumbai, Maharashtra',
      registeredDate: '12 Jan 2026',
      totalBookings: 8,
      status: 'Active',
      emailVerified: true,
      phoneVerified: true,
      avatarBg: '#ff385c',
      initials: 'AS'
    },
    {
      id: 2,
      name: 'Rohan Mehra',
      email: 'rohan.mehra@example.com',
      phone: '+91 98234 56789',
      city: 'Delhi, NCR',
      registeredDate: '24 Feb 2026',
      totalBookings: 3,
      status: 'Active',
      emailVerified: true,
      phoneVerified: false,
      avatarBg: '#2563eb',
      initials: 'RM'
    },
    {
      id: 3,
      name: 'Neha Kapoor',
      email: 'neha.kapoor@example.com',
      phone: '+91 97112 34567',
      city: 'Bengaluru, Karnataka',
      registeredDate: '05 Mar 2026',
      totalBookings: 14,
      status: 'Active',
      emailVerified: true,
      phoneVerified: true,
      avatarBg: '#16a34a',
      initials: 'NK'
    },
    {
      id: 4,
      name: 'Vikramaditya Rao',
      email: 'vikram.rao@example.com',
      phone: '+91 99887 66554',
      city: 'Hyderabad, Telangana',
      registeredDate: '18 Apr 2026',
      totalBookings: 0,
      status: 'Blocked',
      emailVerified: false,
      phoneVerified: false,
      avatarBg: '#dc2626',
      initials: 'VR'
    },
    {
      id: 5,
      name: 'Pooja Verma',
      email: 'pooja.verma@example.com',
      phone: '+91 94567 89012',
      city: 'Jaipur, Rajasthan',
      registeredDate: '02 May 2026',
      totalBookings: 5,
      status: 'Active',
      emailVerified: true,
      phoneVerified: true,
      avatarBg: '#ca8a04',
      initials: 'PV'
    },
    {
      id: 6,
      name: 'Siddharth Sen',
      email: 'siddharth.sen@example.com',
      phone: '+91 93345 67890',
      city: 'Kolkata, West Bengal',
      registeredDate: '22 Jun 2026',
      totalBookings: 1,
      status: 'Pending',
      emailVerified: true,
      phoneVerified: false,
      avatarBg: '#8b5cf6',
      initials: 'SS'
    }
  ];

  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'blocked'
  const [verificationFilter, setVerificationFilter] = useState('all'); // 'all' | 'verified' | 'unverified'

  // Modals state

  // Fetch real guest users from PostgreSQL Backend
  React.useEffect(() => {
    let isMounted = true;
    adminApiRequest('/admin/auth/users')
      .then((res) => {
        if (isMounted && res.success && Array.isArray(res.users) && res.users.length > 0) {
          setUsers(res.users);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch live users from backend:', err.message);
      });
    return () => { isMounted = false; };
  }, []);

  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);

  // Filtered logic
  const filteredUsers = users.filter((u) => {
    // 1. Search filter
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);

    // 2. Tab status filter
    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'active' ? u.status === 'Active' :
      activeTab === 'blocked' ? u.status === 'Blocked' : true;

    // 3. Verification filter
    const matchesVerify = 
      verificationFilter === 'all' ? true :
      verificationFilter === 'both' ? (u.emailVerified && u.phoneVerified) :
      verificationFilter === 'email' ? u.emailVerified :
      verificationFilter === 'unverified' ? (!u.emailVerified || !u.phoneVerified) : true;

    return matchesSearch && matchesTab && matchesVerify;
  });

    // Action handlers
  const handleToggleBlock = async (id) => {
    const targetUser = users.find((u) => u.id === id);
    if (!targetUser) return;
    const nextStatus = targetUser.status === 'Blocked' ? 'Active' : 'Blocked';

    // Optimistically update state
    setUsers(users.map((u) => {
      if (u.id === id) {
        return { ...u, status: nextStatus };
      }
      return u;
    }));

    try {
      await adminApiRequest(`/admin/auth/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus })
      });
      console.log(`✅ Guest #${id} status toggled to ${nextStatus} in backend database`);
    } catch (e) {
      console.warn('Backend status update failed:', e.message);
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this guest account?')) {
      setUsers(users.filter((u) => u.id !== id));
      if (viewUser && viewUser.id === id) setViewUser(null);
      if (editUser && editUser.id === id) setEditUser(null);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editUser) return;

    const updatedUser = { ...editUser };
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setEditUser(null);

    try {
      await adminApiRequest(`/admin/auth/users/${updatedUser.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: updatedUser.status })
      });
      console.log(`✅ Saved edit for user #${updatedUser.id} with status ${updatedUser.status}`);
    } catch (err) {
      console.error('Failed to update status in backend:', err);
    }
  };

  return (
    <>
      {/* 1. Summary Stat Cards */}
      <div className="row mb-3">
        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Total Guests</span>
                <div className={styles.statIconBox} style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <FaUsers />
                </div>
              </div>
              <div className={styles.statValue}>{users.length}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
                <FaArrowUp size={9} /> +12%
              </span>
              <span className={styles.statSubtext}>Registered customers</span>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Active Accounts</span>
                <div className={styles.statIconBox} style={{ background: '#f0fdf4', color: '#16a34a' }}>
                  <FaUserCheck />
                </div>
              </div>
              <div className={styles.statValue}>{users.filter(u => u.status === 'Active').length}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
                <FaArrowUp size={9} /> 94%
              </span>
              <span className={styles.statSubtext}>Good standing</span>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
          <div className={styles.statCard}>
            <div>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Blocked Guests</span>
                <div className={styles.statIconBox} style={{ background: '#fef2f2', color: '#dc2626' }}>
                  <FaUserSlash />
                </div>
              </div>
              <div className={styles.statValue}>{users.filter(u => u.status === 'Blocked').length}</div>
            </div>
            <div className={styles.statFooter}>
              <span className={`${styles.badgeTrend} ${styles.badgeAlert}`}>
                Alert
              </span>
              <span className={styles.statSubtext}>Policy violations</span>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 mb-lg-0">
  <div className={styles.statCard}>
    <div>
      <div className={styles.statHeader}>
        <span className={styles.statTitle}>Fully Verified</span>
        <div
          className={styles.statIconBox}
          style={{ background: '#fff1f2', color: '#ff385c' }}
        >
          <FaShieldAlt />
        </div>
      </div>

      <div className={styles.statValue}>
        {users.filter(u => u.emailVerified && u.phoneVerified).length}
      </div>
    </div>

    <div className={styles.statFooter}>
      <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
        KYC Done
      </span>
      <span className={styles.statSubtext}>
        Email & Phone valid
      </span>
    </div>
  </div>
</div>
      </div>

      {/* 2. Main Table & Search / Filter Card */}
      <div className={styles.mainCard}>
        <div className={styles.cardHeader}>
          <div className={styles.headerTitles}>
            <h2 className={styles.title}>Guest Users Directory</h2>
            <p className={styles.subtitle}>
              Manage customer accounts, verify credentials, edit profiles and control access permissions.
            </p>
          </div>

          {/* Quick Status Tabs */}
          <div className={styles.tabGroup}>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'all' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All ({users.length})
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'active' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active
            </button>
            <button 
              type="button" 
              className={`${styles.tabBtn} ${activeTab === 'blocked' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('blocked')}
            >
              Blocked
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className={styles.controlsBar}>
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search by name, email or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <select 
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Verification: All</option>
              <option value="both">Both Verified (Email & Phone)</option>
              <option value="email">Email Verified</option>
              <option value="unverified">Needs Verification</option>
            </select>
          </div>
        </div>

        {/* Table of Guests */}
        <div className="table-responsive">
          <table className={`table table-hover align-middle mb-0 ${styles.userTable}`}>
            <thead className="table-light">
              <tr>
                <th style={{ width: '60px' }}>Sr. No.</th>
                <th>Guest Profile</th>
                <th>Phone Number</th>
                <th>Location</th>
                <th>Email Verified</th>
                <th>Phone Verified</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#9ca3af' }}>
                    No guest users found matching the selected search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => (
                  <tr key={user.id}>
                    <td><span style={{ fontWeight: '600', color: '#64748b' }}>{idx + 1}</span></td>
                    <td>
                      <div className={styles.userProfileCell}>
                        <div className={styles.avatarBox} style={{ backgroundColor: user.avatarBg }}>
                          {user.initials}
                        </div>
                        <div className={styles.userMeta}>
                          <span className={styles.userName}>{user.name}</span>
                          <span className={styles.userEmail}>{user.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontWeight: '500' }}>{user.phone}</span>
                    </td>

                    <td>
                      <span style={{ color: '#4b5563' }}>{user.city}</span>
                    </td>

                    {/* Email Verification */}
                    <td>
                      <span className={`${styles.verifyPill} ${user.emailVerified ? styles.verifyVerified : styles.verifyUnverified}`}>
                        {user.emailVerified ? <FaCheck size={10} /> : <FaTimes size={10} />}
                        {user.emailVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>

                    {/* Phone Verification */}
                    <td>
                      <span className={`${styles.verifyPill} ${user.phoneVerified ? styles.verifyVerified : styles.verifyUnverified}`}>
                        {user.phoneVerified ? <FaCheck size={10} /> : <FaTimes size={10} />}
                        {user.phoneVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>

                    {/* Account Status */}
                    <td>
                      <span className={`${styles.badgeStatus} ${
                        user.status === 'Active' ? styles.badgeActive : 
                        user.status === 'Blocked' ? styles.badgeBlocked : styles.badgePending
                      }`}>
                        ● {user.status}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td>
                      <div className={styles.actionGroup}>
                        {/* View Profile */}
                        <button 
                          type="button" 
                          className={`${styles.btnAction} ${styles.btnActionView}`}
                          title="View Profile Details"
                          onClick={() => setViewUser(user)}
                        >
                          <FaEye />
                        </button>

                        {/* Edit Profile */}
                        <button 
                          type="button" 
                          className={`${styles.btnAction} ${styles.btnActionEdit}`}
                          title="Edit User Profile"
                          onClick={() => setEditUser({ ...user })}
                        >
                          <FaEdit />
                        </button>

                        {/* Block / Unblock */}
                        <button 
                          type="button" 
                          className={`${styles.btnAction} ${styles.btnActionBlock}`}
                          title={user.status === 'Blocked' ? 'Unblock User' : 'Block User'}
                          onClick={() => handleToggleBlock(user.id)}
                        >
                          {user.status === 'Blocked' ? <FaCheck color="#16a34a" /> : <FaBan color="#ea580c" />}
                        </button>

                        {/* Delete User */}
                        <button 
                          type="button" 
                          className={`${styles.btnAction} ${styles.btnActionDelete}`}
                          title="Delete User Account"
                          onClick={() => handleDeleteUser(user.id)}
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

      {/* 3. View Profile Modal Dialog */}
      {viewUser && (
        <div className={styles.modalBackdrop} onClick={() => setViewUser(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Guest Profile Details</h3>
              <button type="button" className={styles.modalCloseBtn} onClick={() => setViewUser(null)}>
                <FaTimes />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div className={styles.avatarBox} style={{ width: '56px', height: '56px', fontSize: '20px', backgroundColor: viewUser.avatarBg }}>
                  {viewUser.initials}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>{viewUser.name}</h4>
                  <span style={{ color: '#717171', fontSize: '13px' }}>Customer ID: #GST-00{viewUser.id}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px' }}>
                  <span style={{ color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaEnvelope /> Email Address
                  </span>
                  <span style={{ fontWeight: '600', fontSize: '13px' }}>{viewUser.email}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px' }}>
                  <span style={{ color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaPhoneAlt /> Phone Number
                  </span>
                  <span style={{ fontWeight: '600', fontSize: '13px' }}>{viewUser.phone}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px' }}>
                  <span style={{ color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaMapMarkerAlt /> City & Location
                  </span>
                  <span style={{ fontWeight: '600', fontSize: '13px' }}>{viewUser.city}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px' }}>
                  <span style={{ color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaCalendarAlt /> Joined Date
                  </span>
                  <span style={{ fontWeight: '600', fontSize: '13px' }}>{viewUser.registeredDate}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px' }}>
                  <span style={{ color: '#64748b', fontSize: '13px' }}>Total Completed Bookings</span>
                  <span style={{ fontWeight: '700', fontSize: '14px', color: '#ff385c' }}>{viewUser.totalBookings} Stays</span>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.btnSecondary} onClick={() => setViewUser(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Edit Profile Modal Dialog */}
      {editUser && (
        <div className={styles.modalBackdrop} onClick={() => setEditUser(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSaveEdit}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Edit Guest Profile</h3>
                <button type="button" className={styles.modalCloseBtn} onClick={() => setEditUser(null)}>
                  <FaTimes />
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Name</label>
                  <input 
                    type="text" 
                    value={editUser.name}
                    onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                    required
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email Address</label>
                  <input 
                    type="email" 
                    value={editUser.email}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                    required
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone Number</label>
                  <input 
                    type="text" 
                    value={editUser.phone}
                    onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                    required
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>City & Region</label>
                  <input 
                    type="text" 
                    value={editUser.city}
                    onChange={(e) => setEditUser({ ...editUser, city: e.target.value })}
                    className={styles.formInput}
                  />
                </div>

                <div className="row g-2">
                  <div className="col-6">
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Email Verified</label>
                      <select 
                        value={editUser.emailVerified ? 'yes' : 'no'}
                        onChange={(e) => setEditUser({ ...editUser, emailVerified: e.target.value === 'yes' })}
                        className={styles.formInput}
                      >
                        <option value="yes">Verified</option>
                        <option value="no">Unverified</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Phone Verified</label>
                      <select 
                        value={editUser.phoneVerified ? 'yes' : 'no'}
                        onChange={(e) => setEditUser({ ...editUser, phoneVerified: e.target.value === 'yes' })}
                        className={styles.formInput}
                      >
                        <option value="yes">Verified</option>
                        <option value="no">Unverified</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Account Status</label>
                  <select 
                    value={editUser.status}
                    onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}
                    className={styles.formInput}
                  >
                    <option value="Active">Active</option>
                    <option value="Blocked">Blocked</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={() => setEditUser(null)}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
