import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  FaBullhorn, 
  FaTag, 
  FaPaperPlane, 
  FaGift, 
  FaPercent, 
  FaPlus, 
  FaSearch, 
  FaEdit, 
  FaTrashAlt, 
  FaCheck, 
  FaTimes, 
  FaCopy, 
  FaEnvelope, 
  FaMobileAlt, 
  FaComments, 
  FaUserCheck, 
  FaUsers, 
  FaCalendarAlt, 
  FaEye, 
  FaRupeeSign, 
  FaExternalLinkAlt, 
  FaCog 
} from 'react-icons/fa';
import styles from './styles/Marketing.module.css';

// Initial Mock Coupons
const INITIAL_COUPONS = [
  {
    id: 1,
    code: 'AIRBNB2026',
    discountType: 'Percentage',
    discountValue: 20,
    maxDiscount: 3000,
    minBooking: 6000,
    usedCount: 482,
    maxUses: 1000,
    validTill: '2026-12-31',
    targetAudience: 'All Guests',
    status: 'Active',
    description: 'Welcome promotion for new & returning guests across India'
  },
  {
    id: 2,
    code: 'FIRSTSTAY',
    discountType: 'Flat',
    discountValue: 1500,
    maxDiscount: 1500,
    minBooking: 4500,
    usedCount: 890,
    maxUses: 1500,
    validTill: '2026-11-30',
    targetAudience: 'First Time Guests',
    status: 'Active',
    description: 'Flat Rs 1,500 off on first verified booking'
  },
  {
    id: 3,
    code: 'MONSOONMAGIC',
    discountType: 'Percentage',
    discountValue: 15,
    maxDiscount: 2500,
    minBooking: 5000,
    usedCount: 320,
    maxUses: 500,
    validTill: '2026-10-31',
    targetAudience: 'Hill Station & Beach Stays',
    status: 'Active',
    description: 'Seasonal promotion for villas in Goa, Coorg, and Lonavala'
  },
  {
    id: 4,
    code: 'DIWALIRETREAT',
    discountType: 'Percentage',
    discountValue: 25,
    maxDiscount: 5000,
    minBooking: 10000,
    usedCount: 0,
    maxUses: 2000,
    validTill: '2026-11-20',
    targetAudience: 'Luxury & Heritage Stays',
    status: 'Scheduled',
    description: 'Upcoming festive special for premium homestays & havelis'
  },
  {
    id: 5,
    code: 'SUMMER2026',
    discountType: 'Percentage',
    discountValue: 10,
    maxDiscount: 2000,
    minBooking: 4000,
    usedCount: 1000,
    maxUses: 1000,
    validTill: '2026-07-31',
    targetAudience: 'All Guests',
    status: 'Expired',
    description: 'Early summer holiday escape campaign'
  }
];

// Initial Mock Marketing Campaigns
const INITIAL_CAMPAIGNS = [
  {
    id: 1,
    name: 'Monsoon Villa Getaways in Goa',
    subject: 'Rain-soaked paradise: Private pool villas starting at ₹3,999/night 🌧️',
    channel: 'Email',
    segment: 'Guests who searched beach destinations',
    recipients: 42500,
    openRate: '38.4%',
    clickRate: '14.2%',
    sentDate: 'Yesterday, 4:30 PM',
    status: 'Sent'
  },
  {
    id: 2,
    name: 'Become a Host: Earn up to ₹85,000/Month',
    subject: 'Have an extra room or villa? Start hosting on Airbnb today with 0% fee!',
    channel: 'Email',
    segment: 'Prospective Hosts in Top Tier-1 Cities',
    recipients: 28400,
    openRate: '41.2%',
    clickRate: '19.8%',
    sentDate: '3 days ago',
    status: 'Sent'
  },
  {
    id: 3,
    name: 'Weekend Flash Deal Push Alert',
    subject: '⚡ Flash Sale: Get 20% OFF this weekend with code AIRBNB2026',
    channel: 'Push Notification',
    segment: 'Active Mobile App Users (Last 7 Days)',
    recipients: 65000,
    openRate: '24.6%',
    clickRate: '9.8%',
    sentDate: 'Today, 10:00 AM',
    status: 'Sent'
  },
  {
    id: 4,
    name: 'Diwali Festive Holiday Advance Booking',
    subject: 'Book your Diwali family holiday before havelis run out of slots!',
    channel: 'Email',
    segment: 'High LTV Repeat Guests',
    recipients: 15200,
    openRate: '-',
    clickRate: '-',
    sentDate: 'Scheduled: 20 Oct 2026, 9:00 AM',
    status: 'Scheduled'
  }
];

// Initial Mock Referral Tracking Data
const INITIAL_REFERRALS = [
  {
    id: 1,
    referrerName: 'Amit Saxena',
    referrerEmail: 'amit.saxena@gmail.com',
    userType: 'Host',
    programType: 'Refer a Host',
    referralCode: 'HOST-AMIT-99',
    invitedCount: 14,
    convertedCount: 9,
    rewardEarned: 22500,
    payoutStatus: 'Disbursed',
    referredList: [
      { name: 'Pankaj Varma', property: 'Goa Coastal Villa', status: 'Active & Hosting', date: '12 Sep 2026' },
      { name: 'Sunita Roy', property: 'Kasauli Pine Cottage', status: 'Active & Hosting', date: '28 Aug 2026' },
      { name: 'Deepak Rao', property: 'Bengaluru Penthouse', status: 'Active & Hosting', date: '04 Oct 2026' }
    ]
  },
  {
    id: 2,
    referrerName: 'Pooja Mehta',
    referrerEmail: 'pooja.mehta@yahoo.com',
    userType: 'Host',
    programType: 'Refer a Host',
    referralCode: 'POOJA-HOST-GOA',
    invitedCount: 10,
    convertedCount: 6,
    rewardEarned: 15000,
    payoutStatus: 'Disbursed',
    referredList: [
      { name: 'Rohan Deshmukh', property: 'Alibaug Farmhouse', status: 'Active & Hosting', date: '19 Sep 2026' },
      { name: 'Kavita Joshi', property: 'Lonavala Glass Villa', status: 'Active & Hosting', date: '02 Oct 2026' }
    ]
  },
  {
    id: 3,
    referrerName: 'Rohit Bansal',
    referrerEmail: 'rohit.b@outlook.com',
    userType: 'Guest',
    programType: 'Refer a Guest',
    referralCode: 'ROHIT-STAYS-26',
    invitedCount: 22,
    convertedCount: 14,
    rewardEarned: 14000,
    payoutStatus: 'Disbursed',
    referredList: [
      { name: 'Aditi Sharma', property: 'First Booking at Manali Chalet', status: 'Stay Completed', date: '22 Sep 2026' },
      { name: 'Nikhil Sen', property: 'First Booking at Udaipur Palace', status: 'Stay Completed', date: '29 Sep 2026' }
    ]
  },
  {
    id: 4,
    referrerName: 'Neha Singhal',
    referrerEmail: 'neha.singhal@gmail.com',
    userType: 'Host',
    programType: 'Refer a Host',
    referralCode: 'HOST-NEHA-DELHI',
    invitedCount: 5,
    convertedCount: 2,
    rewardEarned: 5000,
    payoutStatus: 'Pending Verification',
    referredList: [
      { name: 'Sameer Juneja', property: 'Jaipur Heritage Flat', status: 'Listing Pending Approval', date: '08 Oct 2026' }
    ]
  }
];

export default function Marketing() {
  const [activeTab, setActiveTab] = useState('coupons'); // 'coupons' | 'campaigns' | 'referrals'
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [referrals, setReferrals] = useState(INITIAL_REFERRALS);

  // Filters
  const [couponSearch, setCouponSearch] = useState('');
  const [couponStatusFilter, setCouponStatusFilter] = useState('ALL');

  const [campaignSearch, setCampaignSearch] = useState('');
  const [campaignChannelFilter, setCampaignChannelFilter] = useState('ALL');

  const [referralSearch, setReferralSearch] = useState('');

  // Modals
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [couponFormData, setCouponFormData] = useState({
    code: '',
    discountType: 'Percentage',
    discountValue: 20,
    maxDiscount: 3000,
    minBooking: 5000,
    maxUses: 1000,
    validTill: '2026-12-31',
    targetAudience: 'All Guests',
    description: ''
  });

  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignFormData, setCampaignFormData] = useState({
    name: '',
    subject: '',
    channel: 'Email',
    segment: 'All Active Guests',
    bodyText: ''
  });

  const [selectedReferral, setSelectedReferral] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  // Referral policy configs
  const [hostBonus, setHostBonus] = useState(2500);
  const [guestBonus, setGuestBonus] = useState(1000);

  // KPI calculations
  const activeCouponsCount = coupons.filter(c => c.status === 'Active').length;
  const totalCampaignRecipients = campaigns.reduce((acc, c) => acc + (c.recipients || 0), 0);
  const totalHostOnboarded = referrals.filter(r => r.programType === 'Refer a Host').reduce((acc, r) => acc + r.convertedCount, 0);
  const totalReferralPayouts = referrals.reduce((acc, r) => acc + r.rewardEarned, 0);

  // Filtered lists
  const filteredCoupons = coupons.filter(c => {
    const matchesSearch = c.code.toLowerCase().includes(couponSearch.toLowerCase()) ||
      c.description.toLowerCase().includes(couponSearch.toLowerCase()) ||
      c.targetAudience.toLowerCase().includes(couponSearch.toLowerCase());
    const matchesStatus = couponStatusFilter === 'ALL' || c.status === couponStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCampaigns = campaigns.filter(camp => {
    const matchesSearch = camp.name.toLowerCase().includes(campaignSearch.toLowerCase()) ||
      camp.subject.toLowerCase().includes(campaignSearch.toLowerCase()) ||
      camp.segment.toLowerCase().includes(campaignSearch.toLowerCase());
    const matchesChannel = campaignChannelFilter === 'ALL' || camp.channel === campaignChannelFilter;
    return matchesSearch && matchesChannel;
  });

  const filteredReferrals = referrals.filter(ref => {
    return ref.referrerName.toLowerCase().includes(referralSearch.toLowerCase()) ||
      ref.referrerEmail.toLowerCase().includes(referralSearch.toLowerCase()) ||
      ref.referralCode.toLowerCase().includes(referralSearch.toLowerCase());
  });

  // Copy code helper
  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Open Add Coupon Modal
  const handleOpenAddCoupon = () => {
    setEditingCoupon(null);
    setCouponFormData({
      code: '',
      discountType: 'Percentage',
      discountValue: 20,
      maxDiscount: 3000,
      minBooking: 5000,
      maxUses: 1000,
      validTill: '2026-12-31',
      targetAudience: 'All Guests',
      description: ''
    });
    setShowCouponModal(true);
  };

  // Open Edit Coupon Modal
  const handleOpenEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setCouponFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount,
      minBooking: coupon.minBooking,
      maxUses: coupon.maxUses,
      validTill: coupon.validTill,
      targetAudience: coupon.targetAudience,
      description: coupon.description
    });
    setShowCouponModal(true);
  };

  // Backend API URL
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  // Fetch Coupons from Backend API on mount
  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${API_BASE}/coupons`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCoupons(data.data);
      }
    } catch (err) {
      console.warn('Backend unavailable, using local coupons:', err.message);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Save Coupon (Create / Update via Backend API)
  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    if (!couponFormData.code) return;

    const payload = {
      ...couponFormData,
      code: couponFormData.code.toUpperCase().trim()
    };

    try {
      if (editingCoupon) {
        const res = await fetch(`${API_BASE}/coupons/${editingCoupon.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          toast.success(`Coupon ${payload.code} updated successfully!`);
          fetchCoupons();
        } else {
          toast.error(data.message || 'Failed to update coupon');
          // Optimistic local update fallback
          setCoupons(prev => prev.map(c => c.id === editingCoupon.id ? { ...c, ...payload } : c));
        }
      } else {
        const res = await fetch(`${API_BASE}/coupons`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          toast.success(`Coupon ${payload.code} created successfully!`);
          fetchCoupons();
        } else {
          toast.error(data.message || 'Failed to create coupon');
          // Optimistic local fallback
          const newCoupon = {
            id: Date.now(),
            ...payload,
            usedCount: 0,
            status: 'Active'
          };
          setCoupons(prev => [newCoupon, ...prev]);
        }
      }
    } catch (err) {
      toast.error('Network error. Updated locally.');
      if (editingCoupon) {
        setCoupons(prev => prev.map(c => c.id === editingCoupon.id ? { ...c, ...payload } : c));
      } else {
        setCoupons(prev => [{ id: Date.now(), ...payload, usedCount: 0, status: 'Active' }, ...prev]);
      }
    }
    setShowCouponModal(false);
  };

  // Toggle Coupon Active / Expired
  const handleToggleCoupon = async (couponId) => {
    const target = coupons.find(c => c.id === couponId);
    if (!target) return;
    const newStatus = target.status === 'Active' ? 'Expired' : 'Active';

    try {
      const res = await fetch(`${API_BASE}/coupons/${couponId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Coupon marked as ${newStatus}`);
        fetchCoupons();
      } else {
        setCoupons(prev => prev.map(c => c.id === couponId ? { ...c, status: newStatus } : c));
      }
    } catch (e) {
      setCoupons(prev => prev.map(c => c.id === couponId ? { ...c, status: newStatus } : c));
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon code?')) {
      try {
        const res = await fetch(`${API_BASE}/coupons/${couponId}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        if (data.success) {
          toast.success('Coupon deleted successfully!');
          fetchCoupons();
        } else {
          setCoupons(prev => prev.filter(c => c.id !== couponId));
        }
      } catch (e) {
        setCoupons(prev => prev.filter(c => c.id !== couponId));
        toast.success('Coupon removed locally');
      }
    }
  };

  // Create Campaign
  const handleCreateCampaign = (e) => {
    e.preventDefault();
    if (!campaignFormData.name || !campaignFormData.subject) return;

    const newCamp = {
      id: Date.now(),
      name: campaignFormData.name,
      subject: campaignFormData.subject,
      channel: campaignFormData.channel,
      segment: campaignFormData.segment,
      recipients: 34000,
      openRate: '0.0%',
      clickRate: '0.0%',
      sentDate: 'Just now',
      status: 'Sent'
    };

    setCampaigns(prev => [newCamp, ...prev]);
    setShowCampaignModal(false);
  };

  // Approve Payout for Referrer
  const handleApprovePayout = (referralId) => {
    setReferrals(prev => prev.map(r => r.id === referralId ? { ...r, payoutStatus: 'Disbursed' } : r));
    alert('Referral bonus payout approved and dispatched successfully!');
  };

  return (
    <div className="container-fluid p-0">
      {/* 4 Summary Stat Cards with Bootstrap Grid */}
      <div className="row g-3 mb-4">
        {/* Card 1: Active Coupons */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Active Promo Codes</span>
              <div className={styles.statIconBox} style={{ background: '#fff1f2', color: '#ff385c' }}>
                <FaTag />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>{activeCouponsCount}</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgePink}`}>
                  <FaPercent size={8} /> 5 Active Promos
                </span>
                <span className={styles.statSubtext}>Across All Tiers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Campaign Reach */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Campaign Deliveries</span>
              <div className={styles.statIconBox} style={{ background: '#eff6ff', color: '#2563eb' }}>
                <FaPaperPlane />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>151K</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgeBlue}`}>
                  38.4% Open Rate
                </span>
                <span className={styles.statSubtext}>Email & Push Notifications</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Host Referral Onboarded */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Host Referrals</span>
              <div className={styles.statIconBox} style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                <FaGift />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>{totalHostOnboarded}</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgePurple}`}>
                  ₹{(totalReferralPayouts).toLocaleString('en-IN')} Paid
                </span>
                <span className={styles.statSubtext}>Verified Onboarded Hosts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Generated Booking GMV */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Promo Booking Value</span>
              <div className={styles.statIconBox} style={{ background: '#eaf8ee', color: '#16a34a' }}>
                <FaRupeeSign />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>₹32.8L</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
                  +22.4% MoM
                </span>
                <span className={styles.statSubtext}>Direct Campaign ROI</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel Card */}
      <div className={styles.mainCard}>
        {/* Card Header & Tabs */}
        <div className={styles.cardHeader}>
          <div className={styles.headerTitles}>
            <h2 className={styles.title}>
              <FaBullhorn style={{ color: '#ff385c', fontSize: '20px' }} />
              Marketing & Promotions Hub
            </h2>
            <p className={styles.subtitle}>
              Discount coupons create karein, email/push campaigns launch karein aur "Refer a Host" program track karein.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className={styles.tabGroup}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'coupons' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('coupons')}
            >
              <FaTag size={12} />
              Coupons & Discounts
              <span className={styles.tabCount}>{coupons.length}</span>
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'campaigns' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('campaigns')}
            >
              <FaPaperPlane size={12} />
              Campaigns & Notifications
              <span className={styles.tabCount}>{campaigns.length}</span>
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'referrals' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('referrals')}
            >
              <FaGift size={12} />
              Referral Program ("Refer a Host")
              <span className={styles.tabCount}>{referrals.length}</span>
            </button>
          </div>
        </div>

        {/* =========================================================
            TAB 1: COUPONS & DISCOUNT CODES
            ========================================================= */}
        {activeTab === 'coupons' && (
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
                    placeholder="Search promo codes, audience, or offer..."
                    value={couponSearch}
                    onChange={(e) => setCouponSearch(e.target.value)}
                  />
                </div>

                {/* Status Filter */}
                <select 
                  className={styles.filterSelect}
                  value={couponStatusFilter}
                  onChange={(e) => setCouponStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Status</option>
                  <option value="Active">Active ({activeCouponsCount})</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

              {/* Add Coupon Button */}
              <button className={styles.btnPrimary} onClick={handleOpenAddCoupon}>
                <FaPlus size={11} /> Create Promo Code
              </button>
            </div>

            {/* Bootstrap Table Responsive Wrapper */}
            <div className={styles.tableResponsive}>
              <table className={`table table-hover align-middle mb-0 ${styles.customTable}`}>
                <thead>
                  <tr>
                    <th className={styles.srNoCol}>Sr. No.</th>
                    <th>Coupon Code</th>
                    <th>Discount Offer</th>
                    <th>Min Booking</th>
                    <th>Redemptions & Usage</th>
                    <th>Target Audience</th>
                    <th>Valid Till</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoupons.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '40px 16px', color: '#6b7280' }}>
                        No promo codes found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredCoupons.map((coupon, idx) => {
                      const percentUsed = Math.min(100, Math.round((coupon.usedCount / coupon.maxUses) * 100));
                      return (
                        <tr key={coupon.id}>
                          {/* Sr. No. */}
                          <td className={styles.srNoCol}>{idx + 1}</td>

                          {/* Coupon Code */}
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className={styles.couponBadge}>
                                <FaTag size={10} />
                                {coupon.code}
                              </span>
                              <button 
                                type="button" 
                                className={styles.actionBtn} 
                                style={{ width: '26px', height: '26px' }}
                                title="Copy Coupon Code"
                                onClick={() => handleCopyCode(coupon.code)}
                              >
                                {copiedCode === coupon.code ? <FaCheck style={{ color: '#16a34a' }} /> : <FaCopy />}
                              </button>
                            </div>
                            <div className={styles.subMetaText}>{coupon.description}</div>
                          </td>

                          {/* Discount Offer */}
                          <td>
                            <div className={styles.discountValue}>
                              {coupon.discountType === 'Percentage' ? `${coupon.discountValue}% OFF` : `Flat ₹${coupon.discountValue.toLocaleString('en-IN')} OFF`}
                            </div>
                            <div className={styles.subMetaText}>
                              {coupon.discountType === 'Percentage' ? `Capped at ₹${coupon.maxDiscount.toLocaleString('en-IN')}` : 'Instant direct savings'}
                            </div>
                          </td>

                          {/* Min Booking */}
                          <td>
                            <span style={{ fontWeight: '600', color: '#111827' }}>
                              ₹{coupon.minBooking.toLocaleString('en-IN')}
                            </span>
                          </td>

                          {/* Redemptions Progress */}
                          <td>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', color: '#374151' }}>
                              <span>{coupon.usedCount} used</span>
                              <span style={{ color: '#6b7280' }}>/ {coupon.maxUses}</span>
                            </div>
                            <div className={styles.progressBarBox}>
                              <div className={styles.progressBarFill} style={{ width: `${percentUsed}%` }} />
                            </div>
                          </td>

                          {/* Target Audience */}
                          <td>
                            <span style={{ fontSize: '12.5px', color: '#4b5563', fontWeight: '500' }}>
                              {coupon.targetAudience}
                            </span>
                          </td>

                          {/* Valid Till */}
                          <td style={{ color: '#6b7280', fontSize: '12.5px' }}>
                            <FaCalendarAlt size={10} style={{ marginRight: '5px' }} />
                            {coupon.validTill}
                          </td>

                          {/* Status */}
                          <td>
                            <span className={`${styles.statusBadge} ${
                              coupon.status === 'Active' ? styles.statusActive :
                              coupon.status === 'Scheduled' ? styles.statusScheduled : styles.statusExpired
                            }`}>
                              <span className={styles.statusDot} />
                              {coupon.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td>
                            <div className={styles.actionBtnGroup} style={{ justifyContent: 'center' }}>
                              {/* Edit */}
                              <button 
                                className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                                title="Edit Coupon"
                                onClick={() => handleOpenEditCoupon(coupon)}
                              >
                                <FaEdit />
                              </button>

                              {/* Toggle Active / Deactivate */}
                              <button 
                                className={`${styles.actionBtn} ${styles.actionBtnToggle}`}
                                title={coupon.status === 'Active' ? 'Deactivate Coupon' : 'Activate Coupon'}
                                onClick={() => handleToggleCoupon(coupon.id)}
                              >
                                {coupon.status === 'Active' ? <FaTimes /> : <FaCheck />}
                              </button>

                              {/* Delete */}
                              <button 
                                className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                                title="Delete Coupon"
                                onClick={() => handleDeleteCoupon(coupon.id)}
                              >
                                <FaTrashAlt />
                              </button>
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
            TAB 2: EMAIL & PUSH NOTIFICATION CAMPAIGNS
            ========================================================= */}
        {activeTab === 'campaigns' && (
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
                    placeholder="Search campaigns, subject, or audience segment..."
                    value={campaignSearch}
                    onChange={(e) => setCampaignSearch(e.target.value)}
                  />
                </div>

                {/* Channel Filter */}
                <select 
                  className={styles.filterSelect}
                  value={campaignChannelFilter}
                  onChange={(e) => setCampaignChannelFilter(e.target.value)}
                >
                  <option value="ALL">All Channels</option>
                  <option value="Email">Email Marketing</option>
                  <option value="Push Notification">Push Notifications</option>
                  <option value="SMS">SMS Alerts</option>
                </select>
              </div>

              {/* Launch Campaign Button */}
              <button className={styles.btnPrimary} onClick={() => setShowCampaignModal(true)}>
                <FaPaperPlane size={11} /> Launch New Campaign
              </button>
            </div>

            {/* Bootstrap Table Responsive Wrapper */}
            <div className={styles.tableResponsive}>
              <table className={`table table-hover align-middle mb-0 ${styles.customTable}`}>
                <thead>
                  <tr>
                    <th className={styles.srNoCol}>Sr. No.</th>
                    <th>Campaign Name & Subject</th>
                    <th>Delivery Channel</th>
                    <th>Audience Segment</th>
                    <th>Recipients Count</th>
                    <th>Open Rate & CTR</th>
                    <th>Sent / Scheduled Time</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCampaigns.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '40px 16px', color: '#6b7280' }}>
                        No marketing campaigns found.
                      </td>
                    </tr>
                  ) : (
                    filteredCampaigns.map((camp, idx) => (
                      <tr key={camp.id}>
                        {/* Sr. No. */}
                        <td className={styles.srNoCol}>{idx + 1}</td>

                        {/* Campaign Name & Subject */}
                        <td>
                          <div style={{ fontWeight: '700', color: '#111827', fontSize: '13.5px' }}>
                            {camp.name}
                          </div>
                          <div className={styles.subMetaText} style={{ maxWidth: '340px' }}>
                            {camp.subject}
                          </div>
                        </td>

                        {/* Channel */}
                        <td>
                          <span className={`${styles.channelBadge} ${
                            camp.channel === 'Email' ? styles.channelEmail :
                            camp.channel === 'Push Notification' ? styles.channelPush : styles.channelSms
                          }`}>
                            {camp.channel === 'Email' ? <FaEnvelope size={10} /> : <FaMobileAlt size={10} />}
                            {camp.channel}
                          </span>
                        </td>

                        {/* Audience Segment */}
                        <td>
                          <span style={{ fontSize: '12.5px', color: '#374151', fontWeight: '500' }}>
                            {camp.segment}
                          </span>
                        </td>

                        {/* Recipients */}
                        <td>
                          <span style={{ fontWeight: '600', color: '#111827' }}>
                            {camp.recipients.toLocaleString('en-IN')}
                          </span>
                        </td>

                        {/* Open Rate & CTR */}
                        <td>
                          {camp.openRate !== '-' ? (
                            <div>
                              <span style={{ fontWeight: '700', color: '#16a34a', fontSize: '13px' }}>
                                {camp.openRate} Open
                              </span>
                              <span style={{ color: '#6b7280', fontSize: '11px', marginLeft: '6px' }}>
                                ({camp.clickRate} CTR)
                              </span>
                            </div>
                          ) : (
                            <span style={{ color: '#9ca3af', fontSize: '12px' }}>Pending Delivery</span>
                          )}
                        </td>

                        {/* Sent Date */}
                        <td style={{ color: '#6b7280', fontSize: '12.5px' }}>
                          {camp.sentDate}
                        </td>

                        {/* Status */}
                        <td>
                          <span className={`${styles.statusBadge} ${
                            camp.status === 'Sent' ? styles.statusActive : styles.statusScheduled
                          }`}>
                            <span className={styles.statusDot} />
                            {camp.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className={styles.actionBtnGroup} style={{ justifyContent: 'center' }}>
                            <button 
                              className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                              title="View Campaign Details"
                              onClick={() => alert(`Campaign: ${camp.name}\nSubject: ${camp.subject}\nRecipients: ${camp.recipients}`)}
                            >
                              <FaEye />
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
        )}

        {/* =========================================================
            TAB 3: REFERRAL PROGRAM ("REFER A HOST" & "REFER A GUEST")
            ========================================================= */}
        {activeTab === 'referrals' && (
          <div>
            {/* Referral Hero Overview Cards (Bootstrap Grid) */}
            <div className={styles.referralHeroBox}>
              <div className="row g-3">
                {/* Program 1: Refer a Host */}
                <div className="col-12 col-md-6">
                  <div className={styles.referralProgramCard}>
                    <div className={styles.referralIconBox} style={{ background: '#fdf2f8', color: '#be185d' }}>
                      <FaGift />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#111827' }}>
                        "Refer a Host" Program
                      </h4>
                      <span className={`${styles.badgeTrend} ${styles.badgePink}`}>High Growth</span>
                    </div>
                    <p style={{ margin: '6px 0 0 0', fontSize: '12.5px', color: '#6b7280', lineHeight: '1.45' }}>
                      Existing hosts & ambassadors receive cash payout when their referred host publishes their first verified listing and completes a booking.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700' }}>Current Bonus:</span>
                        <div className={styles.referralBonusAmount}>₹{hostBonus.toLocaleString('en-IN')} <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#6b7280' }}>/ verified host</span></div>
                      </div>
                      <button 
                        className={styles.btnPrimary} 
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => {
                          const val = prompt('Enter new Host Referral Reward (in ₹):', hostBonus);
                          if (val && !isNaN(val)) setHostBonus(Number(val));
                        }}
                      >
                        <FaCog size={11} /> Edit Bonus
                      </button>
                    </div>
                  </div>
                </div>

                {/* Program 2: Refer a Guest */}
                <div className="col-12 col-md-6">
                  <div className={styles.referralProgramCard}>
                    <div className={styles.referralIconBox} style={{ background: '#eff6ff', color: '#2563eb' }}>
                      <FaUsers />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#111827' }}>
                        "Refer a Friend (Guest)" Program
                      </h4>
                      <span className={`${styles.badgeTrend} ${styles.badgeBlue}`}>Guest Virality</span>
                    </div>
                    <p style={{ margin: '6px 0 0 0', fontSize: '12.5px', color: '#6b7280', lineHeight: '1.45' }}>
                      Both the referrer and friend receive travel credits when the invited friend books their first stay of ₹4,000 or more.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700' }}>Current Travel Credit:</span>
                        <div className={styles.referralBonusAmount}>₹{guestBonus.toLocaleString('en-IN')} <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#6b7280' }}>/ friend stay</span></div>
                      </div>
                      <button 
                        className={styles.btnPrimary} 
                        style={{ padding: '6px 12px', fontSize: '12px', background: '#2563eb' }}
                        onClick={() => {
                          const val = prompt('Enter new Guest Referral Credit (in ₹):', guestBonus);
                          if (val && !isNaN(val)) setGuestBonus(Number(val));
                        }}
                      >
                        <FaCog size={11} /> Edit Bonus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls Bar */}
            <div className={styles.controlsBar}>
              <div className={styles.filterControls}>
                <div className={styles.searchBox}>
                  <FaSearch className={styles.searchIcon} />
                  <input 
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search referrer name, email, or referral code..."
                    value={referralSearch}
                    onChange={(e) => setReferralSearch(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ fontSize: '12.5px', color: '#4b5563', fontWeight: '500' }}>
                Total Referral Payouts Released: <span style={{ fontWeight: '700', color: '#15803d' }}>₹{totalReferralPayouts.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Referral Leaderboard Table */}
            <div className={styles.tableResponsive}>
              <table className={`table table-hover align-middle mb-0 ${styles.customTable}`}>
                <thead>
                  <tr>
                    <th className={styles.srNoCol}>Sr. No.</th>
                    <th>Referrer Member</th>
                    <th>Program Type</th>
                    <th>Unique Referral Code</th>
                    <th>Invited vs Onboarded</th>
                    <th>Total Reward Earned</th>
                    <th>Payout Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReferrals.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '40px 16px', color: '#6b7280' }}>
                        No referral tracking records found.
                      </td>
                    </tr>
                  ) : (
                    filteredReferrals.map((ref, idx) => (
                      <tr key={ref.id}>
                        {/* Sr. No. */}
                        <td className={styles.srNoCol}>{idx + 1}</td>

                        {/* Referrer Info */}
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontWeight: '700', color: '#111827' }}>{ref.referrerName}</span>
                              <span className={`${styles.statusBadge} ${ref.userType === 'Host' ? styles.badgePink : styles.badgeBlue}`} style={{ fontSize: '10.5px', padding: '1px 6px' }}>
                                {ref.userType}
                              </span>
                            </div>
                            <span style={{ fontSize: '11.5px', color: '#6b7280' }}>{ref.referrerEmail}</span>
                          </div>
                        </td>

                        {/* Program */}
                        <td>
                          <span style={{ fontWeight: '600', color: '#374151' }}>
                            {ref.programType}
                          </span>
                        </td>

                        {/* Referral Code */}
                        <td>
                          <span className={styles.couponBadge} style={{ fontSize: '12px' }}>
                            {ref.referralCode}
                          </span>
                        </td>

                        {/* Invited vs Converted */}
                        <td>
                          <div>
                            <span style={{ fontWeight: '700', color: '#15803d', fontSize: '13.5px' }}>
                              {ref.convertedCount} Converted
                            </span>
                            <span style={{ fontSize: '11px', color: '#6b7280', marginLeft: '5px' }}>
                              ({ref.invitedCount} Invited)
                            </span>
                          </div>
                        </td>

                        {/* Reward Earned */}
                        <td>
                          <span style={{ fontWeight: '700', color: '#111827', fontSize: '14px' }}>
                            ₹{ref.rewardEarned.toLocaleString('en-IN')}
                          </span>
                        </td>

                        {/* Payout Status */}
                        <td>
                          <span className={`${styles.statusBadge} ${
                            ref.payoutStatus === 'Disbursed' ? styles.statusActive : styles.statusScheduled
                          }`}>
                            <span className={styles.statusDot} />
                            {ref.payoutStatus}
                          </span>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className={styles.actionBtnGroup} style={{ justifyContent: 'center' }}>
                            {/* View Referred Listings / Friends */}
                            <button 
                              className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                              title="View Referred Properties / Friends"
                              onClick={() => setSelectedReferral(ref)}
                            >
                              <FaEye />
                            </button>

                            {/* Approve Payout */}
                            {ref.payoutStatus !== 'Disbursed' && (
                              <button 
                                className={`${styles.actionBtn} ${styles.actionBtnToggle}`}
                                title="Approve Payout"
                                onClick={() => handleApprovePayout(ref.id)}
                              >
                                <FaCheck />
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
        )}
      </div>

      {/* =========================================================
          MODAL 1: CREATE / EDIT COUPON MODAL
          ========================================================= */}
      {showCouponModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowCouponModal(false)}>
          <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <FaTag style={{ color: '#ff385c' }} />
                {editingCoupon ? 'Edit Discount Coupon' : 'Create New Promo Code'}
              </h3>
              <button 
                type="button" 
                className={styles.modalCloseBtn}
                onClick={() => setShowCouponModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon}>
              <div className={styles.modalBody}>
                {/* Code & Audience (Bootstrap Grid) */}
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Promo Code *</label>
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      placeholder="e.g. FESTIVE2026"
                      required
                      style={{ textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px' }}
                      value={couponFormData.code}
                      onChange={(e) => setCouponFormData({ ...couponFormData, code: e.target.value })}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Target Audience</label>
                    <select 
                      className={styles.formSelect}
                      value={couponFormData.targetAudience}
                      onChange={(e) => setCouponFormData({ ...couponFormData, targetAudience: e.target.value })}
                    >
                      <option value="All Guests">All Guests</option>
                      <option value="First Time Guests">First Time Guests Only</option>
                      <option value="Luxury & Heritage Stays">Luxury & Heritage Stays</option>
                      <option value="Hill Station & Beach Stays">Hill Station & Beach Stays</option>
                      <option value="Repeat Guests">Repeat Guests</option>
                    </select>
                  </div>
                </div>

                {/* Discount Type & Value */}
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-4">
                    <label className={styles.formLabel}>Discount Type</label>
                    <select 
                      className={styles.formSelect}
                      value={couponFormData.discountType}
                      onChange={(e) => setCouponFormData({ ...couponFormData, discountType: e.target.value })}
                    >
                      <option value="Percentage">Percentage (%)</option>
                      <option value="Flat">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-4">
                    <label className={styles.formLabel}>
                      {couponFormData.discountType === 'Percentage' ? 'Percentage Value (%) *' : 'Flat Discount (₹) *'}
                    </label>
                    <input 
                      type="number" 
                      className={styles.formInput} 
                      placeholder="20"
                      required
                      value={couponFormData.discountValue}
                      onChange={(e) => setCouponFormData({ ...couponFormData, discountValue: Number(e.target.value) })}
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className={styles.formLabel}>Max Cap (₹)</label>
                    <input 
                      type="number" 
                      className={styles.formInput} 
                      placeholder="3000"
                      value={couponFormData.maxDiscount}
                      onChange={(e) => setCouponFormData({ ...couponFormData, maxDiscount: Number(e.target.value) })}
                    />
                  </div>
                </div>

                {/* Min Booking & Max Redemptions */}
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-4">
                    <label className={styles.formLabel}>Min Booking (₹)</label>
                    <input 
                      type="number" 
                      className={styles.formInput} 
                      placeholder="5000"
                      value={couponFormData.minBooking}
                      onChange={(e) => setCouponFormData({ ...couponFormData, minBooking: Number(e.target.value) })}
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className={styles.formLabel}>Max Usage Cap</label>
                    <input 
                      type="number" 
                      className={styles.formInput} 
                      placeholder="1000"
                      value={couponFormData.maxUses}
                      onChange={(e) => setCouponFormData({ ...couponFormData, maxUses: Number(e.target.value) })}
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className={styles.formLabel}>Expiry Date</label>
                    <input 
                      type="date" 
                      className={styles.formInput} 
                      value={couponFormData.validTill}
                      onChange={(e) => setCouponFormData({ ...couponFormData, validTill: e.target.value })}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className={styles.formLabel}>Promotion Synopsis</label>
                  <textarea 
                    className={styles.formTextarea} 
                    rows="2"
                    placeholder="Brief description for customer visibility on checkout..."
                    value={couponFormData.description}
                    onChange={(e) => setCouponFormData({ ...couponFormData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button 
                  type="button" 
                  className={styles.btnSecondary}
                  onClick={() => setShowCouponModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  <FaCheck size={12} /> {editingCoupon ? 'Update Promo Code' : 'Create Promo Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: LAUNCH CAMPAIGN MODAL
          ========================================================= */}
      {showCampaignModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowCampaignModal(false)}>
          <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <FaPaperPlane style={{ color: '#ff385c' }} />
                Launch Marketing Campaign
              </h3>
              <button 
                type="button" 
                className={styles.modalCloseBtn}
                onClick={() => setShowCampaignModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign}>
              <div className={styles.modalBody}>
                {/* Campaign Name */}
                <div style={{ marginBottom: '14px' }}>
                  <label className={styles.formLabel}>Internal Campaign Title *</label>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    placeholder="e.g. Diwali Villa Getaway 2026 Blast"
                    required
                    value={campaignFormData.name}
                    onChange={(e) => setCampaignFormData({ ...campaignFormData, name: e.target.value })}
                  />
                </div>

                {/* Channel & Target Segment (Bootstrap Grid) */}
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Dispatch Channel</label>
                    <select 
                      className={styles.formSelect}
                      value={campaignFormData.channel}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, channel: e.target.value })}
                    >
                      <option value="Email">Email Marketing</option>
                      <option value="Push Notification">Mobile Push Notification</option>
                      <option value="SMS">SMS Message</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Audience Segment</label>
                    <select 
                      className={styles.formSelect}
                      value={campaignFormData.segment}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, segment: e.target.value })}
                    >
                      <option value="All Active Guests">All Active Guests</option>
                      <option value="Prospective Hosts in Top Tier-1 Cities">Prospective Hosts (Tier-1)</option>
                      <option value="Guests who searched beach stays">Beach & Villa Seekers</option>
                      <option value="High LTV Repeat Guests">High LTV Repeat Guests</option>
                    </select>
                  </div>
                </div>

                {/* Email Subject / Push Title */}
                <div style={{ marginBottom: '14px' }}>
                  <label className={styles.formLabel}>Subject Line / Notification Header *</label>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    placeholder="e.g. 🌟 Exclusive 20% OFF on private luxury pools!"
                    required
                    value={campaignFormData.subject}
                    onChange={(e) => setCampaignFormData({ ...campaignFormData, subject: e.target.value })}
                  />
                </div>

                {/* Body Message */}
                <div>
                  <label className={styles.formLabel}>Campaign Content / Copy</label>
                  <textarea 
                    className={styles.formTextarea} 
                    rows="3"
                    placeholder="Write personalized email body or push notification message..."
                    value={campaignFormData.bodyText}
                    onChange={(e) => setCampaignFormData({ ...campaignFormData, bodyText: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button 
                  type="button" 
                  className={styles.btnSecondary}
                  onClick={() => setShowCampaignModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  <FaPaperPlane size={12} /> Dispatch Campaign Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: REFERRAL BREAKDOWN MODAL
          ========================================================= */}
      {selectedReferral && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedReferral(null)}>
          <div className={`${styles.modalDialog} ${styles.modalDialogLarge}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <FaGift style={{ color: '#ff385c' }} />
                Referral Breakdown: {selectedReferral.referrerName}
              </h3>
              <button 
                type="button" 
                className={styles.modalCloseBtn}
                onClick={() => setSelectedReferral(null)}
              >
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Referrer Highlights */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div className="row g-3">
                  <div className="col-12 col-md-4">
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: '700' }}>Referrer:</span>
                    <div style={{ fontWeight: '700', fontSize: '15px', color: '#111827', marginTop: '2px' }}>{selectedReferral.referrerName}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{selectedReferral.referrerEmail}</div>
                  </div>
                  <div className="col-12 col-md-4">
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: '700' }}>Program & Code:</span>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#111827', marginTop: '2px' }}>{selectedReferral.programType}</div>
                    <span className={styles.couponBadge} style={{ fontSize: '11.5px', marginTop: '3px' }}>{selectedReferral.referralCode}</span>
                  </div>
                  <div className="col-12 col-md-4">
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: '700' }}>Bonus Accrued:</span>
                    <div style={{ fontWeight: '800', fontSize: '18px', color: '#15803d', marginTop: '2px' }}>₹{selectedReferral.rewardEarned.toLocaleString('en-IN')}</div>
                    <span className={`${styles.statusBadge} ${selectedReferral.payoutStatus === 'Disbursed' ? styles.statusActive : styles.statusScheduled}`} style={{ marginTop: '3px' }}>
                      {selectedReferral.payoutStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Referred Members List */}
              <h5 style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '10px' }}>
                Referred Members & Conversion Milestones ({selectedReferral.referredList.length}):
              </h5>
              <div className={styles.tableResponsive}>
                <table className={`table table-hover align-middle mb-0 ${styles.customTable}`}>
                  <thead>
                    <tr>
                      <th className={styles.srNoCol}>Sr. No.</th>
                      <th>Referred Name</th>
                      <th>Property / Activity</th>
                      <th>Status Milestone</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReferral.referredList.map((item, i) => (
                      <tr key={i}>
                        <td className={styles.srNoCol}>{i + 1}</td>
                        <td style={{ fontWeight: '600', color: '#111827' }}>{item.name}</td>
                        <td style={{ color: '#4b5563' }}>{item.property}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles.statusActive}`}>
                            <FaCheck size={9} /> {item.status}
                          </span>
                        </td>
                        <td style={{ color: '#6b7280', fontSize: '12px' }}>{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className={styles.btnSecondary}
                onClick={() => setSelectedReferral(null)}
              >
                Close
              </button>
              {selectedReferral.payoutStatus !== 'Disbursed' && (
                <button 
                  type="button" 
                  className={styles.btnPrimary}
                  onClick={() => {
                    handleApprovePayout(selectedReferral.id);
                    setSelectedReferral(null);
                  }}
                >
                  <FaCheck size={12} /> Approve Payout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
