import React, { useState } from 'react';
import { 
  FaUserShield, 
  FaUserTie, 
  FaHeadset, 
  FaShieldAlt, 
  FaPlus, 
  FaSearch, 
  FaEdit, 
  FaTrashAlt, 
  FaCheck, 
  FaTimes, 
  FaKey, 
  FaEye, 
  FaBan, 
  FaUndo, 
  FaSlidersH,
  FaUsersCog
} from 'react-icons/fa';
import styles from './styles/Roles.module.css';

// Initial Roles definitions with granular permission sets
const INITIAL_ROLES = [
  {
    id: 'super_admin',
    name: 'Super Admin',
    badgeClass: styles.roleSuperAdmin,
    icon: <FaShieldAlt style={{ color: '#be185d' }} />,
    color: '#be185d',
    bgColor: '#fdf2f8',
    description: 'Unrestricted full access across all modules, sensitive financial configs, and security settings.',
    membersCount: 2,
    permissions: {
      dashboard: { view: true, edit: true, delete: true, export: true },
      listings: { view: true, edit: true, delete: true, export: true },
      users: { view: true, edit: true, delete: true, export: true },
      hosts: { view: true, edit: true, delete: true, export: true },
      bookings: { view: true, edit: true, delete: true, export: true },
      finance: { view: true, edit: true, delete: true, export: true },
      reviews: { view: true, edit: true, delete: true, export: true },
      masterData: { view: true, edit: true, delete: true, export: true },
      roles: { view: true, edit: true, delete: true, export: true },
    }
  },
  {
    id: 'sub_admin',
    name: 'Sub-Admin',
    badgeClass: styles.roleSubAdmin,
    icon: <FaUserShield style={{ color: '#15803d' }} />,
    color: '#15803d',
    bgColor: '#f0fdf4',
    description: 'Platform operations manager. Can approve listings, manage hosts & bookings, and view financial reports.',
    membersCount: 4,
    permissions: {
      dashboard: { view: true, edit: false, delete: false, export: true },
      listings: { view: true, edit: true, delete: true, export: true },
      users: { view: true, edit: true, delete: false, export: true },
      hosts: { view: true, edit: true, delete: false, export: true },
      bookings: { view: true, edit: true, delete: false, export: true },
      finance: { view: true, edit: false, delete: false, export: true },
      reviews: { view: true, edit: true, delete: true, export: true },
      masterData: { view: true, edit: true, delete: false, export: true },
      roles: { view: true, edit: false, delete: false, export: false },
    }
  },
  {
    id: 'support_staff',
    name: 'Support Staff',
    badgeClass: styles.roleSupport,
    icon: <FaHeadset style={{ color: '#1d4ed8' }} />,
    color: '#1d4ed8',
    bgColor: '#eff6ff',
    description: 'Customer assistance & booking care. Can view guests/hosts, update booking states, and issue refunds.',
    membersCount: 5,
    permissions: {
      dashboard: { view: true, edit: false, delete: false, export: false },
      listings: { view: true, edit: false, delete: false, export: false },
      users: { view: true, edit: true, delete: false, export: false },
      hosts: { view: true, edit: false, delete: false, export: false },
      bookings: { view: true, edit: true, delete: false, export: true },
      finance: { view: false, edit: false, delete: false, export: false },
      reviews: { view: true, edit: false, delete: false, export: false },
      masterData: { view: false, edit: false, delete: false, export: false },
      roles: { view: false, edit: false, delete: false, export: false },
    }
  },
  {
    id: 'moderator',
    name: 'Content Moderator',
    badgeClass: styles.roleModerator,
    icon: <FaUsersCog style={{ color: '#a16207' }} />,
    color: '#a16207',
    bgColor: '#fefce8',
    description: 'Trust & Safety team. Can inspect property photos, review quality, and take down abusive reviews or fake listings.',
    membersCount: 3,
    permissions: {
      dashboard: { view: true, edit: false, delete: false, export: false },
      listings: { view: true, edit: true, delete: true, export: false },
      users: { view: true, edit: false, delete: false, export: false },
      hosts: { view: true, edit: false, delete: false, export: false },
      bookings: { view: false, edit: false, delete: false, export: false },
      finance: { view: false, edit: false, delete: false, export: false },
      reviews: { view: true, edit: true, delete: true, export: true },
      masterData: { view: false, edit: false, delete: false, export: false },
      roles: { view: false, edit: false, delete: false, export: false },
    }
  }
];

// Modules list for matrix display
const MODULE_DEFINITIONS = [
  { key: 'dashboard', name: 'Dashboard & Analytics', desc: 'Realtime KPIs, revenue stats & metrics' },
  { key: 'listings', name: 'Listings & Approvals', desc: 'Property review, photos, approve & reject' },
  { key: 'users', name: 'Guests (Users)', desc: 'Guest directory, profiles & account status' },
  { key: 'hosts', name: 'Hosts Management', desc: 'Host verification, KYC docs & earnings' },
  { key: 'bookings', name: 'Bookings & Disputes', desc: 'Reservations, status changes & disputes' },
  { key: 'finance', name: 'Payments & Finance', desc: 'Payouts, tax invoices & commission rates' },
  { key: 'reviews', name: 'Reviews & Ratings', desc: 'Feedback moderation & spam removal' },
  { key: 'masterData', name: 'Master Data Setup', desc: 'Property types, amenities & locations' },
  { key: 'roles', name: 'Roles & Staff Admin', desc: 'Admin roles, permissions & security access' },
];

// Mock Initial Staff Directory
const INITIAL_STAFF = [
  {
    id: 1,
    name: 'Aarav Sharma',
    email: 'aarav.sharma@airbnb.internal',
    phone: '+91 98100 23456',
    role: 'super_admin',
    department: 'Platform Operations & IT',
    status: 'Active',
    lastActive: 'Just now',
    avatarBg: '#ff385c',
    customModules: ['Full Access']
  },
  {
    id: 2,
    name: 'Pooja Mehta',
    email: 'pooja.mehta@airbnb.internal',
    phone: '+91 98200 45678',
    role: 'sub_admin',
    department: 'Regional Operations (North India)',
    status: 'Active',
    lastActive: '12 mins ago',
    avatarBg: '#15803d',
    customModules: ['Listings', 'Hosts', 'Bookings', 'Reviews', 'Master Data']
  },
  {
    id: 3,
    name: 'Vikram Rajput',
    email: 'vikram.rajput@airbnb.internal',
    phone: '+91 98300 78912',
    role: 'sub_admin',
    department: 'Listing Approvals & Verification',
    status: 'Active',
    lastActive: '45 mins ago',
    avatarBg: '#0891b2',
    customModules: ['Listings', 'Hosts', 'Reviews', 'Master Data']
  },
  {
    id: 4,
    name: 'Ananya Verma',
    email: 'ananya.verma@airbnb.internal',
    phone: '+91 98400 34567',
    role: 'support_staff',
    department: 'Customer Delight & Dispute Resolution',
    status: 'Active',
    lastActive: '5 mins ago',
    avatarBg: '#2563eb',
    customModules: ['Bookings', 'Users', 'Disputes', 'Refunds']
  },
  {
    id: 5,
    name: 'Rohan Kapoor',
    email: 'rohan.kapoor@airbnb.internal',
    phone: '+91 98500 89012',
    role: 'support_staff',
    department: 'Host Payout & Helpdesk Support',
    status: 'Active',
    lastActive: '1 hour ago',
    avatarBg: '#4f46e5',
    customModules: ['Bookings', 'Users', 'Host Inquiries']
  },
  {
    id: 6,
    name: 'Sneha Patel',
    email: 'sneha.patel@airbnb.internal',
    phone: '+91 98600 12345',
    role: 'moderator',
    department: 'Trust & Safety / Quality Assurance',
    status: 'Active',
    lastActive: '22 mins ago',
    avatarBg: '#ca8a04',
    customModules: ['Reviews', 'Listing Quality', 'Spam Moderation']
  },
  {
    id: 7,
    name: 'Karan Malhotra',
    email: 'karan.malhotra@airbnb.internal',
    phone: '+91 98700 67890',
    role: 'moderator',
    department: 'Trust & Safety (Guest Reviews)',
    status: 'Active',
    lastActive: '3 hours ago',
    avatarBg: '#d97706',
    customModules: ['Reviews', 'Fake Ratings', 'Property Reports']
  },
  {
    id: 8,
    name: 'Divya Sen',
    email: 'divya.sen@airbnb.internal',
    phone: '+91 98800 54321',
    role: 'support_staff',
    department: 'Weekend Escalation Desk',
    status: 'Suspended',
    lastActive: '3 days ago',
    avatarBg: '#9ca3af',
    customModules: ['Bookings', 'Users']
  }
];

export default function Roles() {
  const [activeTab, setActiveTab] = useState('staff'); // 'staff' | 'matrix' | 'roles'
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [roleConfigs, setRoleConfigs] = useState(INITIAL_ROLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [staffFormData, setStaffFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'support_staff',
    department: '',
    status: 'Active',
    modules: ['Bookings', 'Users']
  });

  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [selectedRoleForMatrix, setSelectedRoleForMatrix] = useState(null);
  const [showViewStaffModal, setShowViewStaffModal] = useState(null);

  // Quick stats calculation
  const totalStaff = staffList.length;
  const subAdminsCount = staffList.filter(s => s.role === 'sub_admin').length;
  const supportCount = staffList.filter(s => s.role === 'support_staff').length;
  const moderatorCount = staffList.filter(s => s.role === 'moderator').length;

  // Filtered staff
  const filteredStaff = staffList.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || member.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Helper to get role details
  const getRoleDetails = (roleId) => {
    return roleConfigs.find(r => r.id === roleId) || {
      name: roleId,
      badgeClass: styles.roleSupport,
      description: ''
    };
  };

  // Open Add Staff Modal
  const handleOpenAddModal = () => {
    setEditingStaff(null);
    setStaffFormData({
      name: '',
      email: '',
      phone: '',
      role: 'support_staff',
      department: 'Customer Delight',
      status: 'Active',
      modules: ['Bookings', 'Users']
    });
    setShowStaffModal(true);
  };

  // Open Edit Staff Modal
  const handleOpenEditModal = (staff) => {
    setEditingStaff(staff);
    setStaffFormData({
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      role: staff.role,
      department: staff.department,
      status: staff.status,
      modules: staff.customModules || ['Bookings']
    });
    setShowStaffModal(true);
  };

  // Save Staff (Add or Edit)
  const handleSaveStaff = (e) => {
    e.preventDefault();
    if (!staffFormData.name || !staffFormData.email) return;

    if (editingStaff) {
      setStaffList(prev => prev.map(item => {
        if (item.id === editingStaff.id) {
          return {
            ...item,
            ...staffFormData,
            customModules: staffFormData.role === 'super_admin' ? ['Full Access'] : staffFormData.modules
          };
        }
        return item;
      }));
    } else {
      const colors = ['#ff385c', '#15803d', '#2563eb', '#ca8a04', '#4f46e5', '#0891b2'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newMember = {
        id: Date.now(),
        ...staffFormData,
        lastActive: 'Just now',
        avatarBg: randomColor,
        customModules: staffFormData.role === 'super_admin' ? ['Full Access'] : staffFormData.modules
      };
      setStaffList(prev => [newMember, ...prev]);
    }

    setShowStaffModal(false);
  };

  // Toggle Suspend / Activate
  const handleToggleStatus = (staffId) => {
    setStaffList(prev => prev.map(s => {
      if (s.id === staffId) {
        return {
          ...s,
          status: s.status === 'Active' ? 'Suspended' : 'Active'
        };
      }
      return s;
    }));
  };

  // Delete staff member
  const handleDeleteStaff = (staffId) => {
    if (window.confirm('Are you sure you want to revoke and delete this staff administrator?')) {
      setStaffList(prev => prev.filter(s => s.id !== staffId));
    }
  };

  // Open matrix modal for specific role
  const handleOpenMatrixModal = (role) => {
    setSelectedRoleForMatrix(JSON.parse(JSON.stringify(role)));
    setShowMatrixModal(true);
  };

  // Toggle permission in role config
  const handleToggleRolePermission = (roleId, moduleKey, actionKey) => {
    setRoleConfigs(prev => prev.map(role => {
      if (role.id === roleId) {
        const currentVal = role.permissions[moduleKey]?.[actionKey] ?? false;
        return {
          ...role,
          permissions: {
            ...role.permissions,
            [moduleKey]: {
              ...role.permissions[moduleKey],
              [actionKey]: !currentVal
            }
          }
        };
      }
      return role;
    }));
  };

  // Toggle permission in matrix modal
  const handleModalPermissionToggle = (moduleKey, actionKey) => {
    if (!selectedRoleForMatrix) return;
    const currentVal = selectedRoleForMatrix.permissions[moduleKey]?.[actionKey] ?? false;
    setSelectedRoleForMatrix({
      ...selectedRoleForMatrix,
      permissions: {
        ...selectedRoleForMatrix.permissions,
        [moduleKey]: {
          ...selectedRoleForMatrix.permissions[moduleKey],
          [actionKey]: !currentVal
        }
      }
    });
  };

  // Save matrix changes
  const handleSaveRoleMatrix = () => {
    if (!selectedRoleForMatrix) return;
    setRoleConfigs(prev => prev.map(r => r.id === selectedRoleForMatrix.id ? selectedRoleForMatrix : r));
    setShowMatrixModal(false);
  };

  return (
    <div className="container-fluid p-0">
      {/* 4 Summary Stat Cards with Bootstrap Grid */}
      <div className="row g-3 mb-4">
        {/* Card 1: Total Staff */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Total Staff Admins</span>
              <div className={styles.statIconBox} style={{ background: '#fdf2f8', color: '#ff385c' }}>
                <FaUserShield />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>{totalStaff}</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
                  <FaCheck size={9} /> Active System
                </span>
                <span className={styles.statSubtext}>Across 4 Roles</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Sub-Admins */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Sub-Admins</span>
              <div className={styles.statIconBox} style={{ background: '#f0fdf4', color: '#15803d' }}>
                <FaUserTie />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>{subAdminsCount}</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
                  Operations
                </span>
                <span className={styles.statSubtext}>Approvals & Regional</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Support Staff */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Support Staff</span>
              <div className={styles.statIconBox} style={{ background: '#eff6ff', color: '#2563eb' }}>
                <FaHeadset />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>{supportCount}</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgeBlue}`}>
                  Customer Care
                </span>
                <span className={styles.statSubtext}>Disputes & Refunds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Content Moderators */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Content Moderators</span>
              <div className={styles.statIconBox} style={{ background: '#fefce8', color: '#a16207' }}>
                <FaShieldAlt />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>{moderatorCount}</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgeWarning}`}>
                  Trust & Safety
                </span>
                <span className={styles.statSubtext}>Reviews & Photos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Card Panel */}
      <div className={styles.mainCard}>
        {/* Card Header & Tab Controls */}
        <div className={styles.cardHeader}>
          <div className={styles.headerTitles}>
            <h2 className={styles.title}>
              <FaKey style={{ color: '#ff385c', fontSize: '18px' }} />
              Roles & Permissions Management
            </h2>
            <p className={styles.subtitle}>
              Sub-admin, support staff aur moderators ke liye access controls aur module-level permissions configure karein.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className={styles.tabGroup}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'staff' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('staff')}
            >
              <FaUserShield size={12} />
              Staff Members
              <span className={styles.tabCount}>{totalStaff}</span>
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'roles' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('roles')}
            >
              <FaShieldAlt size={12} />
              Role Definitions
              <span className={styles.tabCount}>{roleConfigs.length}</span>
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'matrix' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('matrix')}
            >
              <FaSlidersH size={12} />
              Permission Matrix
            </button>
          </div>
        </div>

        {/* =========================================================
            TAB 1: STAFF DIRECTORY
            ========================================================= */}
        {activeTab === 'staff' && (
          <div>
            {/* Filter and Action Bar */}
            <div className={styles.controlsBar}>
              <div className={styles.filterControls}>
                {/* Search */}
                <div className={styles.searchBox}>
                  <FaSearch className={styles.searchIcon} />
                  <input 
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search by name, email or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Role Filter */}
                <select 
                  className={styles.filterSelect}
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="ALL">All Roles ({totalStaff})</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="sub_admin">Sub-Admin</option>
                  <option value="support_staff">Support Staff</option>
                  <option value="moderator">Content Moderator</option>
                </select>

                {/* Status Filter */}
                <select 
                  className={styles.filterSelect}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {/* Add New Staff Button */}
              <button className={styles.btnPrimary} onClick={handleOpenAddModal}>
                <FaPlus size={12} /> Add Staff Member
              </button>
            </div>

            {/* Bootstrap Table Responsive Wrapper */}
            <div className={styles.tableResponsive}>
              <table className={`table table-hover align-middle mb-0 ${styles.customTable}`}>
                <thead>
                  <tr>
                    <th className={styles.srNoCol}>Sr. No.</th>
                    <th>Staff Member</th>
                    <th>Assigned Role</th>
                    <th>Department</th>
                    <th>Assigned Modules & Access</th>
                    <th>Status</th>
                    <th>Last Active</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '40px 16px', color: '#6b7280' }}>
                        No staff members found matching your search and filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredStaff.map((member, idx) => {
                      const roleMeta = getRoleDetails(member.role);
                      const isSuper = member.role === 'super_admin';
                      return (
                        <tr key={member.id}>
                          {/* Sr. No. */}
                          <td className={styles.srNoCol}>{idx + 1}</td>

                          {/* Staff Member Info */}
                          <td>
                            <div className={styles.staffUserCell}>
                              <div 
                                className={styles.staffAvatar} 
                                style={{ backgroundColor: member.avatarBg || '#ff385c' }}
                              >
                                {member.name.charAt(0)}
                              </div>
                              <div className={styles.staffDetails}>
                                <span className={styles.staffName}>{member.name}</span>
                                <span className={styles.staffEmail}>{member.email}</span>
                                <span className={styles.staffPhone}>{member.phone}</span>
                              </div>
                            </div>
                          </td>

                          {/* Role Badge */}
                          <td>
                            <span className={`${styles.roleBadge} ${roleMeta.badgeClass}`}>
                              <FaKey size={10} />
                              {roleMeta.name}
                            </span>
                          </td>

                          {/* Department */}
                          <td>
                            <span style={{ fontWeight: '500', color: '#374151' }}>
                              {member.department}
                            </span>
                          </td>

                          {/* Modules List */}
                          <td>
                            <div className={styles.permChipList}>
                              {isSuper ? (
                                <span className={`${styles.permChip} ${styles.permChipFull}`}>
                                  ★ Full Platform Access
                                </span>
                              ) : (
                                member.customModules?.slice(0, 3).map((mod, i) => (
                                  <span key={i} className={styles.permChip}>
                                    {mod}
                                  </span>
                                ))
                              )}
                              {!isSuper && member.customModules?.length > 3 && (
                                <span className={styles.permChipMore}>
                                  +{member.customModules.length - 3} more
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td>
                            <span 
                              className={`${styles.statusBadge} ${member.status === 'Active' ? styles.statusActive : styles.statusSuspended}`}
                            >
                              <span className={styles.statusDot} />
                              {member.status}
                            </span>
                          </td>

                          {/* Last Active */}
                          <td style={{ color: '#6b7280', fontSize: '12.5px' }}>
                            {member.lastActive}
                          </td>

                          {/* Actions */}
                          <td>
                            <div className={styles.actionBtnGroup} style={{ justifyContent: 'center' }}>
                              {/* View Details */}
                              <button 
                                className={`${styles.actionBtn} ${styles.actionBtnView}`}
                                title="View Permissions"
                                onClick={() => setShowViewStaffModal(member)}
                              >
                                <FaEye />
                              </button>

                              {/* Edit Staff */}
                              <button 
                                className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                                title="Edit Staff / Change Role"
                                onClick={() => handleOpenEditModal(member)}
                              >
                                <FaEdit />
                              </button>

                              {/* Suspend / Reactivate */}
                              <button 
                                className={`${styles.actionBtn} ${styles.actionBtnToggle}`}
                                title={member.status === 'Active' ? 'Suspend Staff' : 'Reactivate Staff'}
                                onClick={() => handleToggleStatus(member.id)}
                              >
                                {member.status === 'Active' ? <FaBan /> : <FaUndo />}
                              </button>

                              {/* Delete Staff */}
                              {!isSuper && (
                                <button 
                                  className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                                  title="Delete Staff"
                                  onClick={() => handleDeleteStaff(member.id)}
                                >
                                  <FaTrashAlt />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: ROLE DEFINITIONS CARDS
            ========================================================= */}
        {activeTab === 'roles' && (
          <div>
            <div className="row g-3">
              {roleConfigs.map((role) => {
                const assignedStaffCount = staffList.filter(s => s.role === role.id).length;
                return (
                  <div key={role.id} className="col-12 col-md-6 col-xl-3">
                    <div className={styles.roleCard}>
                      <div className={styles.roleCardTop}>
                        <div className={styles.roleCardHeader}>
                          <div>
                            <h3 className={styles.roleCardTitle}>{role.name}</h3>
                            <span className={styles.roleCardSubtitle}>System Role Archetype</span>
                          </div>
                          <div 
                            className={styles.roleCardIconBox}
                            style={{ backgroundColor: role.bgColor, color: role.color }}
                          >
                            {role.icon}
                          </div>
                        </div>

                        <p className={styles.roleCardDesc}>
                          {role.description}
                        </p>

                        <div className={styles.rolePermissionsSummary}>
                          <span className={styles.roleSummaryLabel}>Key Capabilities:</span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#4b5563' }}>
                            {role.id === 'super_admin' && (
                              <>
                                <div><FaCheck style={{ color: '#16a34a', marginRight: '6px' }} /> Full read, write & delete all data</div>
                                <div><FaCheck style={{ color: '#16a34a', marginRight: '6px' }} /> Sensitive financial payouts & settings</div>
                                <div><FaCheck style={{ color: '#16a34a', marginRight: '6px' }} /> Staff member management</div>
                              </>
                            )}
                            {role.id === 'sub_admin' && (
                              <>
                                <div><FaCheck style={{ color: '#16a34a', marginRight: '6px' }} /> Approve & reject host listings</div>
                                <div><FaCheck style={{ color: '#16a34a', marginRight: '6px' }} /> Manage host KYC & bookings</div>
                                <div><FaTimes style={{ color: '#dc2626', marginRight: '6px' }} /> Cannot edit tax & fee configurations</div>
                              </>
                            )}
                            {role.id === 'support_staff' && (
                              <>
                                <div><FaCheck style={{ color: '#16a34a', marginRight: '6px' }} /> Guest inquiry & booking modification</div>
                                <div><FaCheck style={{ color: '#16a34a', marginRight: '6px' }} /> Process booking cancellation & refunds</div>
                                <div><FaTimes style={{ color: '#dc2626', marginRight: '6px' }} /> No finance commission or roles access</div>
                              </>
                            )}
                            {role.id === 'moderator' && (
                              <>
                                <div><FaCheck style={{ color: '#16a34a', marginRight: '6px' }} /> Moderate guest & host reviews</div>
                                <div><FaCheck style={{ color: '#16a34a', marginRight: '6px' }} /> Inspect property photos & amenities</div>
                                <div><FaTimes style={{ color: '#dc2626', marginRight: '6px' }} /> Cannot process bookings or payouts</div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={styles.roleCardFooter}>
                        <span className={styles.memberCountBadge}>
                          <FaUserShield size={12} style={{ color: '#6b7280' }} />
                          {assignedStaffCount} Active {assignedStaffCount === 1 ? 'Admin' : 'Admins'}
                        </span>
                        <button 
                          className={styles.btnEditMatrix}
                          onClick={() => handleOpenMatrixModal(role)}
                        >
                          <FaSlidersH size={10} />
                          Edit Matrix
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: FULL PERMISSION MATRIX (VIEW / EDIT / DELETE / EXPORT)
            ========================================================= */}
        {activeTab === 'matrix' && (
          <div className={styles.matrixWrapper}>
            <div className={styles.matrixHeaderBox}>
              <div>
                <h3 className={styles.matrixTitle}>Granular Role vs Module Permissions Matrix</h3>
                <span className={styles.matrixNotice}>
                  Neeche diye gaye matrix mein har role ke specific modules ke access levels (View, Edit, Delete, Export) interactively check ya update karein.
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className={styles.permBadgeGranted}><FaCheck size={9} /> Granted</span>
                <span className={styles.permBadgeRestricted}><FaEdit size={9} /> Partial</span>
                <span className={styles.permBadgeDenied}><FaTimes size={9} /> Denied</span>
              </div>
            </div>

            <div className={styles.tableResponsive}>
              <table className={`table table-hover align-middle mb-0 ${styles.matrixTable}`}>
                <thead>
                  <tr>
                    <th style={{ width: '280px' }}>Platform Module</th>
                    {roleConfigs.map(role => (
                      <th key={role.id} style={{ minWidth: '150px' }}>
                        <span className={`${styles.roleBadge} ${role.badgeClass}`}>
                          {role.name}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MODULE_DEFINITIONS.map(mod => (
                    <tr key={mod.key}>
                      <td>
                        <div style={{ fontWeight: '600', color: '#111827' }}>{mod.name}</div>
                        <div className={styles.moduleDescription}>{mod.desc}</div>
                      </td>

                      {/* Columns for each role */}
                      {roleConfigs.map(role => {
                        const perm = role.permissions[mod.key] || { view: false, edit: false, delete: false, export: false };
                        const hasFull = perm.view && perm.edit && perm.delete;
                        const hasNone = !perm.view && !perm.edit && !perm.delete;
                        const isSuper = role.id === 'super_admin';

                        return (
                          <td key={role.id}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                              {hasFull ? (
                                <span className={styles.permBadgeGranted}>
                                  <FaCheck size={10} /> Full Access
                                </span>
                              ) : hasNone ? (
                                <span className={styles.permBadgeDenied}>
                                  <FaTimes size={10} /> No Access
                                </span>
                              ) : (
                                <span className={styles.permBadgeRestricted}>
                                  <FaEdit size={10} />
                                  {perm.view && perm.edit ? 'View & Edit' : perm.view ? 'View Only' : 'Custom'}
                                </span>
                              )}

                              {/* Interactive check toggles */}
                              <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                                <label 
                                  title="View Access" 
                                  style={{ cursor: isSuper ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                                >
                                  <input 
                                    type="checkbox" 
                                    className={styles.matrixCheckbox}
                                    checked={perm.view} 
                                    disabled={isSuper}
                                    onChange={() => handleToggleRolePermission(role.id, mod.key, 'view')}
                                  />
                                  <span>R</span>
                                </label>

                                <label 
                                  title="Edit / Write Access" 
                                  style={{ cursor: isSuper ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                                >
                                  <input 
                                    type="checkbox" 
                                    className={styles.matrixCheckbox}
                                    checked={perm.edit} 
                                    disabled={isSuper}
                                    onChange={() => handleToggleRolePermission(role.id, mod.key, 'edit')}
                                  />
                                  <span>W</span>
                                </label>

                                <label 
                                  title="Delete / Take Down Access" 
                                  style={{ cursor: isSuper ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                                >
                                  <input 
                                    type="checkbox" 
                                    className={styles.matrixCheckbox}
                                    checked={perm.delete} 
                                    disabled={isSuper}
                                    onChange={() => handleToggleRolePermission(role.id, mod.key, 'delete')}
                                  />
                                  <span>D</span>
                                </label>
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================
          MODAL 1: ADD / EDIT STAFF MEMBER
          ========================================================= */}
      {showStaffModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowStaffModal(false)}>
          <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <FaUserShield style={{ color: '#ff385c' }} />
                {editingStaff ? 'Edit Staff Administrator' : 'Add New Staff Member'}
              </h3>
              <button 
                type="button" 
                className={styles.modalCloseBtn}
                onClick={() => setShowStaffModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveStaff}>
              <div className={styles.modalBody}>
                {/* Name & Email Row (Bootstrap Grid) */}
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Full Name *</label>
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      placeholder="e.g. Ramesh Kulkarni"
                      required
                      value={staffFormData.name}
                      onChange={(e) => setStaffFormData({ ...staffFormData, name: e.target.value })}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Official Email Address *</label>
                    <input 
                      type="email" 
                      className={styles.formInput} 
                      placeholder="e.g. ramesh@airbnb.internal"
                      required
                      value={staffFormData.email}
                      onChange={(e) => setStaffFormData({ ...staffFormData, email: e.target.value })}
                    />
                  </div>
                </div>

                {/* Phone & Department Row */}
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Contact Phone</label>
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      placeholder="+91 98XXX XXXXX"
                      value={staffFormData.phone}
                      onChange={(e) => setStaffFormData({ ...staffFormData, phone: e.target.value })}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Department / Team</label>
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      placeholder="e.g. Host Operations / Dispute Desk"
                      value={staffFormData.department}
                      onChange={(e) => setStaffFormData({ ...staffFormData, department: e.target.value })}
                    />
                  </div>
                </div>

                {/* Role & Status Row */}
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Assign Administrative Role *</label>
                    <select 
                      className={styles.formSelect}
                      value={staffFormData.role}
                      onChange={(e) => setStaffFormData({ ...staffFormData, role: e.target.value })}
                    >
                      <option value="sub_admin">Sub-Admin (Operations Manager)</option>
                      <option value="support_staff">Support Staff (Customer Care & Bookings)</option>
                      <option value="moderator">Content Moderator (Trust & Quality)</option>
                      <option value="super_admin">Super Admin (Full System Access)</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Account Status</label>
                    <select 
                      className={styles.formSelect}
                      value={staffFormData.status}
                      onChange={(e) => setStaffFormData({ ...staffFormData, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                {/* Module-level Permissions Checklist */}
                <div>
                  <label className={styles.formLabel}>
                    Assigned Working Modules
                    <span style={{ fontWeight: 'normal', color: '#6b7280', marginLeft: '6px' }}>
                      (Selected role default permissions will be granted)
                    </span>
                  </label>
                  <div className={styles.permCheckGrid}>
                    {[
                      { key: 'Listings', title: 'Listings & Approvals', sub: 'Inspect, approve & edit' },
                      { key: 'Users', title: 'Guests Directory', sub: 'View & support guests' },
                      { key: 'Hosts', title: 'Host Management', sub: 'KYC & host accounts' },
                      { key: 'Bookings', title: 'Bookings & Refunds', sub: 'State change & cancellations' },
                      { key: 'Disputes', title: 'Disputes & Claims', sub: 'Complaint resolution' },
                      { key: 'Reviews', title: 'Reviews & Ratings', sub: 'Feedback moderation' },
                      { key: 'Finance', title: 'Payments & Payouts', sub: 'Disbursement & invoices' },
                      { key: 'Master Data', title: 'Master Setup', sub: 'Amenities & cities' },
                    ].map(mod => {
                      const isChecked = staffFormData.role === 'super_admin' || staffFormData.modules.includes(mod.key);
                      return (
                        <label key={mod.key} className={styles.permCheckItem}>
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            disabled={staffFormData.role === 'super_admin'}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setStaffFormData({
                                  ...staffFormData,
                                  modules: [...staffFormData.modules, mod.key]
                                });
                              } else {
                                setStaffFormData({
                                  ...staffFormData,
                                  modules: staffFormData.modules.filter(m => m !== mod.key)
                                });
                              }
                            }}
                          />
                          <div>
                            <div className={styles.permCheckLabel}>{mod.title}</div>
                            <div className={styles.permCheckSub}>{mod.sub}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button 
                  type="button" 
                  className={styles.btnSecondary}
                  onClick={() => setShowStaffModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  <FaCheck size={12} />
                  {editingStaff ? 'Update Staff Member' : 'Create Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: EDIT ROLE PERMISSION MATRIX
          ========================================================= */}
      {showMatrixModal && selectedRoleForMatrix && (
        <div className={styles.modalBackdrop} onClick={() => setShowMatrixModal(false)}>
          <div className={`${styles.modalDialog} ${styles.modalDialogLarge}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <FaSlidersH style={{ color: '#ff385c' }} />
                Configure Permissions: {selectedRoleForMatrix.name}
              </h3>
              <button 
                type="button" 
                className={styles.modalCloseBtn}
                onClick={() => setShowMatrixModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div style={{ marginBottom: '16px', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '13px' }}>
                  {selectedRoleForMatrix.description}
                </span>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                  Tick or untick access capabilities below for all administrators assigned to this role.
                </p>
              </div>

              <div className={styles.tableResponsive}>
                <table className={`table table-hover align-middle mb-0 ${styles.customTable}`}>
                  <thead>
                    <tr>
                      <th>Module</th>
                      <th style={{ textAlign: 'center' }}>View (Read)</th>
                      <th style={{ textAlign: 'center' }}>Create / Edit (Write)</th>
                      <th style={{ textAlign: 'center' }}>Delete / Remove</th>
                      <th style={{ textAlign: 'center' }}>Export Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MODULE_DEFINITIONS.map(mod => {
                      const perm = selectedRoleForMatrix.permissions[mod.key] || { view: false, edit: false, delete: false, export: false };
                      return (
                        <tr key={mod.key}>
                          <td>
                            <div style={{ fontWeight: '600', color: '#111827' }}>{mod.name}</div>
                            <div style={{ fontSize: '11px', color: '#6b7280' }}>{mod.desc}</div>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <input 
                              type="checkbox"
                              className={styles.matrixCheckbox}
                              checked={perm.view}
                              disabled={selectedRoleForMatrix.id === 'super_admin'}
                              onChange={() => handleModalPermissionToggle(mod.key, 'view')}
                            />
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <input 
                              type="checkbox"
                              className={styles.matrixCheckbox}
                              checked={perm.edit}
                              disabled={selectedRoleForMatrix.id === 'super_admin'}
                              onChange={() => handleModalPermissionToggle(mod.key, 'edit')}
                            />
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <input 
                              type="checkbox"
                              className={styles.matrixCheckbox}
                              checked={perm.delete}
                              disabled={selectedRoleForMatrix.id === 'super_admin'}
                              onChange={() => handleModalPermissionToggle(mod.key, 'delete')}
                            />
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <input 
                              type="checkbox"
                              className={styles.matrixCheckbox}
                              checked={perm.export}
                              disabled={selectedRoleForMatrix.id === 'super_admin'}
                              onChange={() => handleModalPermissionToggle(mod.key, 'export')}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className={styles.btnSecondary}
                onClick={() => setShowMatrixModal(false)}
              >
                Close
              </button>
              <button 
                type="button" 
                className={styles.btnPrimary}
                onClick={handleSaveRoleMatrix}
              >
                <FaCheck size={12} /> Save Matrix Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: VIEW STAFF DETAILS & EFFECTIVE PERMISSIONS
          ========================================================= */}
      {showViewStaffModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowViewStaffModal(null)}>
          <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <FaEye style={{ color: '#ff385c' }} />
                Staff Administrator Profile
              </h3>
              <button 
                type="button" 
                className={styles.modalCloseBtn}
                onClick={() => setShowViewStaffModal(null)}
              >
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div 
                  className={styles.staffAvatar} 
                  style={{ width: '56px', height: '56px', fontSize: '20px', backgroundColor: showViewStaffModal.avatarBg || '#ff385c' }}
                >
                  {showViewStaffModal.name.charAt(0)}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#111827' }}>
                    {showViewStaffModal.name}
                  </h4>
                  <div style={{ color: '#6b7280', fontSize: '13px', marginTop: '2px' }}>
                    {showViewStaffModal.email} • {showViewStaffModal.phone}
                  </div>
                  <div style={{ marginTop: '6px', display: 'flex', gap: '8px' }}>
                    <span className={`${styles.roleBadge} ${getRoleDetails(showViewStaffModal.role).badgeClass}`}>
                      {getRoleDetails(showViewStaffModal.role).name}
                    </span>
                    <span className={`${styles.statusBadge} ${showViewStaffModal.status === 'Active' ? styles.statusActive : styles.statusSuspended}`}>
                      {showViewStaffModal.status}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>
                  Department / Assignment:
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                  {showViewStaffModal.department}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  Last Active Session: {showViewStaffModal.lastActive}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                  Authorized Modules & Capabilities:
                </div>
                <div className={styles.permChipList} style={{ maxWidth: '100%' }}>
                  {showViewStaffModal.role === 'super_admin' ? (
                    <span className={`${styles.permChip} ${styles.permChipFull}`}>
                      ★ Complete Super Admin Master Access across all Modules
                    </span>
                  ) : (
                    showViewStaffModal.customModules?.map((mod, i) => (
                      <span key={i} className={styles.permChip} style={{ padding: '4px 10px', fontSize: '12px' }}>
                        ✓ {mod}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className={styles.btnSecondary}
                onClick={() => setShowViewStaffModal(null)}
              >
                Close
              </button>
              <button 
                type="button" 
                className={styles.btnPrimary}
                onClick={() => {
                  const staff = showViewStaffModal;
                  setShowViewStaffModal(null);
                  handleOpenEditModal(staff);
                }}
              >
                <FaEdit size={12} /> Edit Staff Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
