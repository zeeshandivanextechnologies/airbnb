import React, { useState } from 'react';
import { 
  FaLifeRing, 
  FaShieldAlt, 
  FaComments, 
  FaClock, 
  FaSearch, 
  FaPlus, 
  FaEye, 
  FaCheck, 
  FaTimes, 
  FaExclamationTriangle, 
  FaUser, 
  FaHome, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaReply, 
  FaBan, 
  FaFlag, 
  FaLock, 
  FaUnlock, 
  FaCamera, 
  FaPaperPlane 
} from 'react-icons/fa';
import styles from './styles/Support.module.css';

// Initial Mock Support Tickets
const INITIAL_TICKETS = [
  {
    id: 'TCK-9401',
    subject: 'Host did not provide key / passcode at midnight check-in',
    category: 'Check-in & Access',
    userType: 'Guest',
    userName: 'Kunal Singhania',
    userEmail: 'kunal.s@gmail.com',
    userPhone: '+91 98201 12345',
    priority: 'Critical',
    status: 'Open',
    assignedTo: 'Ananya Verma',
    listingName: 'Luxury Sea-Facing Villa, Goa',
    bookingId: 'BK-8902',
    createdAt: '25 mins ago',
    messages: [
      { sender: 'Guest', text: 'I have arrived at the property but the host is not answering calls. The keypad lock shows error code 404. I am stranded outside with my family.', time: '25 mins ago' }
    ]
  },
  {
    id: 'TCK-9402',
    subject: 'Request for full refund: AC broken in 42°C Jaipur weather',
    category: 'Refund & Billing',
    userType: 'Guest',
    userName: 'Meera Deshmukh',
    userEmail: 'meera.d@outlook.com',
    userPhone: '+91 98112 54321',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Rohan Kapoor',
    listingName: 'Royal Heritage Haveli, Jaipur',
    bookingId: 'BK-8750',
    createdAt: '1 hour ago',
    messages: [
      { sender: 'Guest', text: 'The master bedroom AC stopped working on day 1. Host promised repair but nobody came. Requesting cancellation and refund for remaining 2 nights.', time: '1 hour ago' },
      { sender: 'Support Staff', text: 'Hello Meera, we have contacted the host to verify the maintenance report. We will update you in 30 minutes.', time: '40 mins ago' }
    ]
  },
  {
    id: 'TCK-9403',
    subject: 'Guest brought 8 people for a 2-guest booking, refused extra charge',
    category: 'Host Dispute',
    userType: 'Host',
    userName: 'Rajesh Khurana',
    userEmail: 'rajesh.khurana@gmail.com',
    userPhone: '+91 98765 89012',
    priority: 'Medium',
    status: 'Open',
    assignedTo: 'Unassigned',
    listingName: 'Modern Studio Apartment, Mumbai',
    bookingId: 'BK-8612',
    createdAt: '2 hours ago',
    messages: [
      { sender: 'Host', text: 'CCTV footage shows 8 adults entered with mattresses and party equipment despite house rule stating maximum 2 guests.', time: '2 hours ago' }
    ]
  },
  {
    id: 'TCK-9404',
    subject: 'Payment deducted twice via UPI for booking confirmation',
    category: 'Refund & Billing',
    userType: 'Guest',
    userName: 'Aditya Nair',
    userEmail: 'aditya.n@gmail.com',
    userPhone: '+91 98450 67890',
    priority: 'High',
    status: 'Resolved',
    assignedTo: 'Ananya Verma',
    listingName: 'Cozy Mountain Cottage, Manali',
    bookingId: 'BK-8590',
    createdAt: '4 hours ago',
    messages: [
      { sender: 'Guest', text: 'UPI debited Rs 14,500 twice for transaction ref 98234124. Please reverse the duplicate charge.', time: '4 hours ago' },
      { sender: 'Support Staff', text: 'Duplicate payment confirmed and refund of Rs 14,500 initiated back to your UPI account. ARN: 7891230.', time: '2 hours ago' }
    ]
  },
  {
    id: 'TCK-9405',
    subject: 'WiFi speed is 2 Mbps instead of promised 100 Mbps workation setup',
    category: 'Listing Amenities',
    userType: 'Guest',
    userName: 'Simran Jolly',
    userEmail: 'simran.jolly@techfirm.com',
    userPhone: '+91 98990 43210',
    priority: 'Low',
    status: 'In Progress',
    assignedTo: 'Rohan Kapoor',
    listingName: 'Forest Hideaway Cabin, Coorg',
    bookingId: 'BK-8420',
    createdAt: '5 hours ago',
    messages: [
      { sender: 'Guest', text: 'Booked this for remote office workation but router speed test is 2.1 Mbps. Cannot attend Zoom meetings.', time: '5 hours ago' }
    ]
  }
];

// Initial Mock Safety Incident Reports
const INITIAL_INCIDENTS = [
  {
    id: 'SAFE-401',
    title: 'Physical altercation and threatening behavior by host',
    listingName: 'Lakeview Penthouse, Udaipur',
    reportedBy: 'Pooja Kashyap (Guest)',
    reportedUser: 'Harish Lodha (Host)',
    severity: 'Critical',
    status: 'Investigating',
    category: 'Harassment & Safety Threat',
    evidencePhotos: 3,
    reportedAt: '35 mins ago',
    description: 'Host banged on guest bedroom door at 1:30 AM demanding cash payment and used abusive and threatening language.',
    actionTaken: 'Emergency local response notified. Host listing temporarily suspended pending investigation.'
  },
  {
    id: 'SAFE-402',
    title: 'Severe property vandalism & broken French windows during unauthorized party',
    listingName: 'Beachside Villa Nirvana, Alibaug',
    reportedBy: 'Sunil Rao (Host)',
    reportedUser: 'Raghav Bhasin (Guest)',
    severity: 'High',
    status: 'Action Taken',
    category: 'Property Damage & Trespass',
    evidencePhotos: 5,
    reportedAt: '3 hours ago',
    description: 'Guests hosted unauthorized 25-person DJ party with broken balcony glass railings, deep pool stains and damaged stereo equipment. Estimated damage Rs 85,000.',
    actionTaken: 'Security deposit held. Guest account flagged for permanent deactivation.'
  },
  {
    id: 'SAFE-403',
    title: 'Hidden camera suspicion behind bathroom digital clock',
    listingName: 'Private Room in South Delhi',
    reportedBy: 'Kavita Roy (Guest)',
    reportedUser: 'Deepak Ahuja (Host)',
    severity: 'Critical',
    status: 'Investigating',
    category: 'Privacy Violation',
    evidencePhotos: 2,
    reportedAt: '5 hours ago',
    description: 'Guest found an unauthorized surveillance recording device disguised as a digital LED clock inside bathroom wall.',
    actionTaken: 'Host immediately delisted from platform. Guest relocated to 5-star partner hotel. Legal notice dispatched.'
  },
  {
    id: 'SAFE-404',
    title: 'Noise complaints and neighbor dispute regarding midnight loud music',
    listingName: 'Hilltop Chalet, Kasauli',
    reportedBy: 'Resident Welfare Association',
    reportedUser: 'Guest Party (Aman & Friends)',
    severity: 'Medium',
    status: 'Resolved',
    category: 'Community Disturbance',
    evidencePhotos: 1,
    reportedAt: '1 day ago',
    description: 'Multiple neighboring bungalows complained about loudspeaker music past 11 PM.',
    actionTaken: 'Warning issued to host. Quiet hours policy enforcement added.'
  }
];

// Initial Mock Chat Monitoring Logs
const INITIAL_FLAGGED_CHATS = [
  {
    id: 'CHAT-810',
    participants: 'Amit Verma (Guest) ⟷ Sagar Mittal (Host)',
    listing: 'Pine Forest Cottage, Shimla',
    flagReason: 'Attempted Off-Platform Cash Payment & Phone Number Sharing',
    severity: 'High',
    flaggedKeyword: 'Pay me directly cash / +91 98111XXXXX to avoid 18% fee',
    timestamp: '18 mins ago',
    status: 'Flagged',
    transcript: [
      { sender: 'Guest', text: 'Is there any discount if we stay for 5 days?', time: '2:15 PM' },
      { sender: 'Host', text: 'Yes, Airbnb charges 18% platform fee. Pay me directly cash / +91 98111XXXXX to avoid 18% fee and I will give 15% discount.', time: '2:18 PM', isFlagged: true },
      { sender: 'Guest', text: 'Is it safe to do off-platform booking?', time: '2:20 PM' },
      { sender: 'Host', text: 'Yes brother, send advance to my GPay 9811123456.', time: '2:22 PM', isFlagged: true }
    ]
  },
  {
    id: 'CHAT-811',
    participants: 'Varun Joshi (Guest) ⟷ Neha Kapoor (Host)',
    listing: 'Sea View Suite, Candolim Goa',
    flagReason: 'Abusive / Intimidating Language Trigger',
    severity: 'Medium',
    flaggedKeyword: 'I will teach you a lesson if you leave bad review',
    timestamp: '1 hour ago',
    status: 'Flagged',
    transcript: [
      { sender: 'Guest', text: 'The bathroom is not clean and geyser is not turning on.', time: '11:10 AM' },
      { sender: 'Host', text: 'You are exaggerating small things. We cleaned it.', time: '11:15 AM' },
      { sender: 'Guest', text: 'I will have to mention this in the review.', time: '11:16 AM' },
      { sender: 'Host', text: 'Do not threaten me with 1 star. I will teach you a lesson if you leave bad review, I have your ID proof.', time: '11:20 AM', isFlagged: true }
    ]
  },
  {
    id: 'CHAT-812',
    participants: 'Karthik Rao (Guest) ⟷ Maya Devi (Host)',
    listing: 'Heritage Retreat, Mysore',
    flagReason: 'External Link / Phishing Warning',
    severity: 'High',
    flaggedKeyword: 'Click this link bit.ly/advance-stay to pay deposit',
    timestamp: '3 hours ago',
    status: 'Reviewed - Warned',
    transcript: [
      { sender: 'Host', text: 'Welcome! Before check-in please pay key deposit.', time: '9:00 AM' },
      { sender: 'Host', text: 'Click this link bit.ly/advance-stay to pay deposit immediately.', time: '9:02 AM', isFlagged: true }
    ]
  }
];

export default function Support() {
  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets' | 'safety' | 'chats'
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [flaggedChats, setFlaggedChats] = useState(INITIAL_FLAGGED_CHATS);

  // Filters
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketStatusFilter, setTicketStatusFilter] = useState('ALL');
  const [ticketPriorityFilter, setTicketPriorityFilter] = useState('ALL');

  const [incidentSearch, setIncidentSearch] = useState('');
  const [incidentSeverityFilter, setIncidentSeverityFilter] = useState('ALL');

  const [chatSearch, setChatSearch] = useState('');

  // Modals
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicketData, setNewTicketData] = useState({
    subject: '',
    category: 'Check-in & Access',
    userType: 'Guest',
    userName: '',
    userEmail: '',
    userPhone: '',
    priority: 'High',
    description: '',
    listingName: ''
  });

  // Summary counts
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'Open').length;
  const criticalSafetyAlerts = incidents.filter(i => i.severity === 'Critical' && i.status !== 'Resolved').length;
  const totalFlaggedChats = flaggedChats.filter(c => c.status === 'Flagged').length;

  // Filtered lists
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.id.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.subject.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.userName.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.userEmail.toLowerCase().includes(ticketSearch.toLowerCase());
    const matchesStatus = ticketStatusFilter === 'ALL' || t.status === ticketStatusFilter;
    const matchesPriority = ticketPriorityFilter === 'ALL' || t.priority === ticketPriorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = 
      inc.id.toLowerCase().includes(incidentSearch.toLowerCase()) ||
      inc.title.toLowerCase().includes(incidentSearch.toLowerCase()) ||
      inc.listingName.toLowerCase().includes(incidentSearch.toLowerCase()) ||
      inc.reportedBy.toLowerCase().includes(incidentSearch.toLowerCase());
    const matchesSeverity = incidentSeverityFilter === 'ALL' || inc.severity === incidentSeverityFilter;
    return matchesSearch && matchesSeverity;
  });

  const filteredChats = flaggedChats.filter(chat => {
    return (
      chat.id.toLowerCase().includes(chatSearch.toLowerCase()) ||
      chat.participants.toLowerCase().includes(chatSearch.toLowerCase()) ||
      chat.flagReason.toLowerCase().includes(chatSearch.toLowerCase()) ||
      chat.listing.toLowerCase().includes(chatSearch.toLowerCase())
    );
  });

  // Ticket status update
  const handleUpdateTicketStatus = (ticketId, newStatus) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
  };

  // Send reply in ticket modal
  const handleSendTicketReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newMsg = {
      sender: 'Support Staff',
      text: replyText.trim(),
      time: 'Just now'
    };

    const updated = {
      ...selectedTicket,
      status: selectedTicket.status === 'Open' ? 'In Progress' : selectedTicket.status,
      messages: [...selectedTicket.messages, newMsg]
    };

    setTickets(prev => prev.map(t => t.id === selectedTicket.id ? updated : t));
    setSelectedTicket(updated);
    setReplyText('');
  };

  // Create new ticket
  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTicketData.subject || !newTicketData.userName) return;

    const newTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: newTicketData.subject,
      category: newTicketData.category,
      userType: newTicketData.userType,
      userName: newTicketData.userName,
      userEmail: newTicketData.userEmail || 'support.inquiry@airbnb.internal',
      userPhone: newTicketData.userPhone || '+91 98000 00000',
      priority: newTicketData.priority,
      status: 'Open',
      assignedTo: 'Ananya Verma',
      listingName: newTicketData.listingName || 'General Platform Inquiry',
      bookingId: 'BK-N/A',
      createdAt: 'Just now',
      messages: [
        { sender: newTicketData.userType, text: newTicketData.description, time: 'Just now' }
      ]
    };

    setTickets(prev => [newTicket, ...prev]);
    setShowNewTicketModal(false);
  };

  // Incident status update
  const handleUpdateIncidentStatus = (incidentId, newStatus) => {
    setIncidents(prev => prev.map(inc => inc.id === incidentId ? { ...inc, status: newStatus } : inc));
    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident({ ...selectedIncident, status: newStatus });
    }
  };

  // Chat status update
  const handleUpdateChatStatus = (chatId, newStatus) => {
    setFlaggedChats(prev => prev.map(c => c.id === chatId ? { ...c, status: newStatus } : c));
    if (selectedChat && selectedChat.id === chatId) {
      setSelectedChat({ ...selectedChat, status: newStatus });
    }
  };

  return (
    <div className="container-fluid p-0">
      {/* 4 Summary Stat Cards with Bootstrap Grid */}
      <div className="row g-3 mb-4">
        {/* Card 1: Active Tickets */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Support Tickets</span>
              <div className={styles.statIconBox} style={{ background: '#eff6ff', color: '#2563eb' }}>
                <FaLifeRing />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>{totalTickets}</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgeDanger}`}>
                  {openTickets} Open / Urgent
                </span>
                <span className={styles.statSubtext}>Across Inquiries</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Critical Safety Issues */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Safety Incidents</span>
              <div className={styles.statIconBox} style={{ background: '#fee2e2', color: '#dc2626' }}>
                <FaShieldAlt />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>{criticalSafetyAlerts}</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgeDanger}`}>
                  <FaExclamationTriangle size={9} /> High Alert
                </span>
                <span className={styles.statSubtext}>Trust & Safety Queue</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Flagged Chat Logs */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Chat Monitoring</span>
              <div className={styles.statIconBox} style={{ background: '#fefce8', color: '#ca8a04' }}>
                <FaComments />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>{totalFlaggedChats}</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgeWarning}`}>
                  <FaFlag size={9} /> Policy Violations
                </span>
                <span className={styles.statSubtext}>Flagged by AI Filters</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Avg Response Time */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Avg Response SLA</span>
              <div className={styles.statIconBox} style={{ background: '#eaf8ee', color: '#16a34a' }}>
                <FaClock />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>18m</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
                  <FaCheck size={9} /> 98.4% SLA Met
                </span>
                <span className={styles.statSubtext}>24/7 Live Desk</span>
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
              <FaShieldAlt style={{ color: '#ff385c', fontSize: '20px' }} />
              Support & Safety Control Center
            </h2>
            <p className={styles.subtitle}>
              Support tickets aur complaints handle karein, safety reports resolve karein aur policy compliance ke liye messages monitor karein.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className={styles.tabGroup}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'tickets' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('tickets')}
            >
              <FaLifeRing size={13} />
              Support Tickets & Complaints
              <span className={styles.tabCount}>{totalTickets}</span>
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'safety' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('safety')}
            >
              <FaShieldAlt size={13} />
              Safety Issues & Reports
              <span className={`${styles.tabCount} ${styles.tabCountDanger}`}>{criticalSafetyAlerts}</span>
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'chats' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('chats')}
            >
              <FaComments size={13} />
              Chat & Messages Monitoring
              <span className={styles.tabCount}>{totalFlaggedChats}</span>
            </button>
          </div>
        </div>

        {/* =========================================================
            TAB 1: SUPPORT TICKETS & COMPLAINTS
            ========================================================= */}
        {activeTab === 'tickets' && (
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
                    placeholder="Search by ticket ID, user, or issue..."
                    value={ticketSearch}
                    onChange={(e) => setTicketSearch(e.target.value)}
                  />
                </div>

                {/* Priority Filter */}
                <select 
                  className={styles.filterSelect}
                  value={ticketPriorityFilter}
                  onChange={(e) => setTicketPriorityFilter(e.target.value)}
                >
                  <option value="ALL">All Priorities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                {/* Status Filter */}
                <select 
                  className={styles.filterSelect}
                  value={ticketStatusFilter}
                  onChange={(e) => setTicketStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Status</option>
                  <option value="Open">Open ({openTickets})</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {/* Add Ticket Button */}
              <button className={styles.btnPrimary} onClick={() => setShowNewTicketModal(true)}>
                <FaPlus size={11} /> Create Ticket
              </button>
            </div>

            {/* Bootstrap Table Responsive Wrapper */}
            <div className={styles.tableResponsive}>
              <table className={`table table-hover align-middle mb-0 ${styles.customTable}`}>
                <thead>
                  <tr>
                    <th className={styles.srNoCol}>Sr. No.</th>
                    <th>Ticket ID</th>
                    <th>Subject & Category</th>
                    <th>User / Submitter</th>
                    <th>Property Involved</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned Staff</th>
                    <th>Created</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan="10" style={{ textAlign: 'center', padding: '40px 16px', color: '#6b7280' }}>
                        No support tickets found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((t, idx) => (
                      <tr key={t.id}>
                        {/* Sr. No. */}
                        <td className={styles.srNoCol}>{idx + 1}</td>

                        {/* Ticket ID */}
                        <td>
                          <span className={styles.ticketId}>#{t.id}</span>
                        </td>

                        {/* Subject & Category */}
                        <td>
                          <div className={styles.ticketSubject}>{t.subject}</div>
                          <div className={styles.ticketCategory}>Category: {t.category}</div>
                        </td>

                        {/* User / Submitter */}
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontWeight: '600', color: '#111827' }}>{t.userName}</span>
                              <span className={`${styles.userRolePill} ${t.userType === 'Guest' ? styles.pillGuest : styles.pillHost}`}>
                                {t.userType}
                              </span>
                            </div>
                            <span style={{ fontSize: '11.5px', color: '#6b7280' }}>{t.userEmail}</span>
                          </div>
                        </td>

                        {/* Property Involved */}
                        <td>
                          <span style={{ fontSize: '12.5px', color: '#374151' }}>
                            {t.listingName}
                          </span>
                        </td>

                        {/* Priority */}
                        <td>
                          <span className={`${styles.badgePriority} ${
                            t.priority === 'Critical' ? styles.priorityCritical :
                            t.priority === 'High' ? styles.priorityHigh :
                            t.priority === 'Medium' ? styles.priorityMedium : styles.priorityLow
                          }`}>
                            {t.priority}
                          </span>
                        </td>

                        {/* Status */}
                        <td>
                          <span className={`${styles.badgeStatus} ${
                            t.status === 'Open' ? styles.statusOpen :
                            t.status === 'In Progress' ? styles.statusInProgress : styles.statusResolved
                          }`}>
                            <span className={styles.statusDot} />
                            {t.status}
                          </span>
                        </td>

                        {/* Assigned Staff */}
                        <td>
                          <span style={{ fontSize: '12.5px', color: '#4b5563', fontWeight: '500' }}>
                            {t.assignedTo}
                          </span>
                        </td>

                        {/* Created At */}
                        <td style={{ color: '#6b7280', fontSize: '12px' }}>
                          {t.createdAt}
                        </td>

                        {/* Actions */}
                        <td>
                          <div className={styles.actionBtnGroup} style={{ justifyContent: 'center' }}>
                            {/* View / Reply */}
                            <button 
                              className={`${styles.actionBtn} ${styles.actionBtnView}`}
                              title="Inspect & Reply Ticket"
                              onClick={() => setSelectedTicket(t)}
                            >
                              <FaReply />
                            </button>

                            {/* Mark Resolved */}
                            {t.status !== 'Resolved' && (
                              <button 
                                className={`${styles.actionBtn} ${styles.actionBtnResolve}`}
                                title="Mark Resolved"
                                onClick={() => handleUpdateTicketStatus(t.id, 'Resolved')}
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

        {/* =========================================================
            TAB 2: SAFETY ISSUES & INCIDENT REPORTS
            ========================================================= */}
        {activeTab === 'safety' && (
          <div>
            {/* Filter and Info Bar */}
            <div className={styles.controlsBar}>
              <div className={styles.filterControls}>
                {/* Search */}
                <div className={styles.searchBox}>
                  <FaSearch className={styles.searchIcon} />
                  <input 
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search safety incidents, property, or involved parties..."
                    value={incidentSearch}
                    onChange={(e) => setIncidentSearch(e.target.value)}
                  />
                </div>

                {/* Severity Filter */}
                <select 
                  className={styles.filterSelect}
                  value={incidentSeverityFilter}
                  onChange={(e) => setIncidentSeverityFilter(e.target.value)}
                >
                  <option value="ALL">All Severities</option>
                  <option value="Critical">Critical Emergency</option>
                  <option value="High">High Severity</option>
                  <option value="Medium">Medium Incident</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`${styles.badgeTrend} ${styles.badgeDanger}`}>
                  <FaShieldAlt size={10} /> 24/7 Safety Protocol Active
                </span>
              </div>
            </div>

            {/* Bootstrap Table Responsive Wrapper */}
            <div className={styles.tableResponsive}>
              <table className={`table table-hover align-middle mb-0 ${styles.customTable}`}>
                <thead>
                  <tr>
                    <th className={styles.srNoCol}>Sr. No.</th>
                    <th>Incident ID</th>
                    <th>Incident Title & Category</th>
                    <th>Reported By</th>
                    <th>Reported Party</th>
                    <th>Property Involved</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Evidence</th>
                    <th>Reported Time</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIncidents.length === 0 ? (
                    <tr>
                      <td colSpan="11" style={{ textAlign: 'center', padding: '40px 16px', color: '#6b7280' }}>
                        No safety incident reports found.
                      </td>
                    </tr>
                  ) : (
                    filteredIncidents.map((inc, idx) => (
                      <tr key={inc.id}>
                        {/* Sr. No. */}
                        <td className={styles.srNoCol}>{idx + 1}</td>

                        {/* Incident ID */}
                        <td>
                          <span className={styles.incidentId}>#{inc.id}</span>
                        </td>

                        {/* Incident Title & Category */}
                        <td>
                          <div className={styles.ticketSubject}>{inc.title}</div>
                          <div className={styles.ticketCategory}>{inc.category}</div>
                        </td>

                        {/* Reported By */}
                        <td>
                          <span style={{ fontWeight: '600', color: '#111827', fontSize: '13px' }}>
                            {inc.reportedBy}
                          </span>
                        </td>

                        {/* Reported Party */}
                        <td>
                          <span style={{ color: '#dc2626', fontWeight: '600', fontSize: '13px' }}>
                            {inc.reportedUser}
                          </span>
                        </td>

                        {/* Property Involved */}
                        <td>
                          <span style={{ fontSize: '12.5px', color: '#374151' }}>
                            {inc.listingName}
                          </span>
                        </td>

                        {/* Severity */}
                        <td>
                          <span className={`${styles.badgePriority} ${
                            inc.severity === 'Critical' ? styles.priorityCritical :
                            inc.severity === 'High' ? styles.priorityHigh : styles.priorityMedium
                          }`}>
                            <FaExclamationTriangle size={9} /> {inc.severity}
                          </span>
                        </td>

                        {/* Status */}
                        <td>
                          <span className={`${styles.badgeStatus} ${
                            inc.status === 'Investigating' ? styles.statusOpen :
                            inc.status === 'Action Taken' ? styles.statusEscalated : styles.statusResolved
                          }`}>
                            <span className={styles.statusDot} />
                            {inc.status}
                          </span>
                        </td>

                        {/* Evidence count */}
                        <td>
                          <span style={{ fontSize: '12px', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FaCamera size={11} style={{ color: '#ff385c' }} />
                            {inc.evidencePhotos} Photos
                          </span>
                        </td>

                        {/* Reported At */}
                        <td style={{ color: '#6b7280', fontSize: '12px' }}>
                          {inc.reportedAt}
                        </td>

                        {/* Actions */}
                        <td>
                          <div className={styles.actionBtnGroup} style={{ justifyContent: 'center' }}>
                            {/* Inspect Incident */}
                            <button 
                              className={`${styles.actionBtn} ${styles.actionBtnAlert}`}
                              title="Inspect Incident Dossier"
                              onClick={() => setSelectedIncident(inc)}
                            >
                              <FaEye />
                            </button>

                            {/* Mark Resolved */}
                            {inc.status !== 'Resolved' && (
                              <button 
                                className={`${styles.actionBtn} ${styles.actionBtnResolve}`}
                                title="Mark Safe & Resolved"
                                onClick={() => handleUpdateIncidentStatus(inc.id, 'Resolved')}
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

        {/* =========================================================
            TAB 3: CHAT & MESSAGES MONITORING (AUDIT LOGS)
            ========================================================= */}
        {activeTab === 'chats' && (
          <div>
            {/* Filter and Security Notice */}
            <div className={styles.controlsBar}>
              <div className={styles.filterControls}>
                <div className={styles.searchBox}>
                  <FaSearch className={styles.searchIcon} />
                  <input 
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search flagged keywords, conversation ID, or parties..."
                    value={chatSearch}
                    onChange={(e) => setChatSearch(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                <FaLock size={10} style={{ color: '#16a34a', marginRight: '5px' }} />
                Encrypted Policy Audit: Only flagged messages with sensitive trigger patterns are scanned.
              </div>
            </div>

            {/* Bootstrap Table Responsive Wrapper */}
            <div className={styles.tableResponsive}>
              <table className={`table table-hover align-middle mb-0 ${styles.customTable}`}>
                <thead>
                  <tr>
                    <th className={styles.srNoCol}>Sr. No.</th>
                    <th>Audit ID</th>
                    <th>Conversation Participants</th>
                    <th>Listing Reference</th>
                    <th>Trigger Reason</th>
                    <th>Flagged Snippet Keyword</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChats.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '40px 16px', color: '#6b7280' }}>
                        No flagged chat conversations found.
                      </td>
                    </tr>
                  ) : (
                    filteredChats.map((chat, idx) => (
                      <tr key={chat.id}>
                        {/* Sr. No. */}
                        <td className={styles.srNoCol}>{idx + 1}</td>

                        {/* Audit ID */}
                        <td>
                          <span className={styles.ticketId}>#{chat.id}</span>
                        </td>

                        {/* Participants */}
                        <td>
                          <span style={{ fontWeight: '600', color: '#111827', fontSize: '13px' }}>
                            {chat.participants}
                          </span>
                        </td>

                        {/* Listing Reference */}
                        <td>
                          <span style={{ fontSize: '12.5px', color: '#4b5563' }}>
                            {chat.listing}
                          </span>
                        </td>

                        {/* Trigger Reason */}
                        <td>
                          <span className={styles.flaggedBadge}>
                            <FaFlag size={10} />
                            {chat.flagReason}
                          </span>
                        </td>

                        {/* Flagged Snippet */}
                        <td>
                          <div className={styles.snippetBox} title={chat.flaggedKeyword}>
                            <span className={styles.flaggedKeyword}>{chat.flaggedKeyword}</span>
                          </div>
                        </td>

                        {/* Timestamp */}
                        <td style={{ color: '#6b7280', fontSize: '12px' }}>
                          {chat.timestamp}
                        </td>

                        {/* Status */}
                        <td>
                          <span className={`${styles.badgeStatus} ${
                            chat.status === 'Flagged' ? styles.statusOpen :
                            chat.status === 'Reviewed - Warned' ? styles.statusEscalated : styles.statusResolved
                          }`}>
                            <span className={styles.statusDot} />
                            {chat.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className={styles.actionBtnGroup} style={{ justifyContent: 'center' }}>
                            {/* Inspect Transcript */}
                            <button 
                              className={`${styles.actionBtn} ${styles.actionBtnView}`}
                              title="Audit Chat Transcript"
                              onClick={() => setSelectedChat(chat)}
                            >
                              <FaEye />
                            </button>

                            {/* Clear Flag */}
                            {chat.status !== 'Cleared' && (
                              <button 
                                className={`${styles.actionBtn} ${styles.actionBtnResolve}`}
                                title="Clear Flag as False Positive"
                                onClick={() => handleUpdateChatStatus(chat.id, 'Cleared')}
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
          MODAL 1: TICKET DETAILS & REPLY MODAL
          ========================================================= */}
      {selectedTicket && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedTicket(null)}>
          <div className={`${styles.modalDialog} ${styles.modalDialogLarge}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <FaLifeRing style={{ color: '#ff385c' }} />
                Support Ticket: #{selectedTicket.id}
              </h3>
              <button 
                type="button" 
                className={styles.modalCloseBtn}
                onClick={() => setSelectedTicket(null)}
              >
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Ticket Meta Details (Bootstrap Grid) */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>
                      Submitter Information:
                    </div>
                    <div style={{ fontWeight: '700', color: '#111827', fontSize: '14px', marginTop: '2px' }}>
                      {selectedTicket.userName} ({selectedTicket.userType})
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '3px' }}>
                      <FaEnvelope size={10} style={{ marginRight: '5px' }} />{selectedTicket.userEmail}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                      <FaPhoneAlt size={10} style={{ marginRight: '5px' }} />{selectedTicket.userPhone}
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>
                      Reservation Reference:
                    </div>
                    <div style={{ fontWeight: '700', color: '#111827', fontSize: '13.5px', marginTop: '2px' }}>
                      {selectedTicket.listingName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '3px' }}>
                      Booking ID: <span style={{ fontWeight: '600', color: '#2563eb' }}>{selectedTicket.bookingId}</span>
                    </div>
                    <div style={{ marginTop: '6px', display: 'flex', gap: '8px' }}>
                      <span className={`${styles.badgePriority} ${selectedTicket.priority === 'Critical' ? styles.priorityCritical : styles.priorityHigh}`}>
                        {selectedTicket.priority} Priority
                      </span>
                      <span className={`${styles.badgeStatus} ${styles.statusInProgress}`}>
                        {selectedTicket.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#4b5563', textTransform: 'uppercase' }}>
                  Issue Description:
                </span>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginTop: '3px' }}>
                  {selectedTicket.subject}
                </div>
              </div>

              {/* Message Thread */}
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#4b5563', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Communication Thread:
                </span>
                <div className={styles.chatThreadBox}>
                  {selectedTicket.messages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`${styles.chatBubble} ${msg.sender === 'Support Staff' ? styles.bubbleHost : styles.bubbleGuest}`}
                    >
                      <div className={styles.bubbleSender}>
                        <span>{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <div>{msg.text}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Staff Response Form */}
              <form onSubmit={handleSendTicketReply}>
                <label className={styles.formLabel}>Send Official Staff Response:</label>
                <textarea 
                  className={styles.formTextarea}
                  rows="3"
                  placeholder="Type official reply to guest/host or internal instructions..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Update Status:</span>
                    <select 
                      className={styles.filterSelect}
                      style={{ height: '32px', fontSize: '12px' }}
                      value={selectedTicket.status}
                      onChange={(e) => handleUpdateTicketStatus(selectedTicket.id, e.target.value)}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                  <button type="submit" className={styles.btnPrimary}>
                    <FaPaperPlane size={11} /> Send Response
                  </button>
                </div>
              </form>
            </div>

            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className={styles.btnSecondary}
                onClick={() => setSelectedTicket(null)}
              >
                Close
              </button>
              {selectedTicket.status !== 'Resolved' && (
                <button 
                  type="button" 
                  className={styles.btnPrimary}
                  style={{ background: '#16a34a' }}
                  onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'Resolved')}
                >
                  <FaCheck size={12} /> Resolve Ticket
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: SAFETY INCIDENT DOSSIER
          ========================================================= */}
      {selectedIncident && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedIncident(null)}>
          <div className={`${styles.modalDialog} ${styles.modalDialogLarge}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <FaShieldAlt style={{ color: '#dc2626' }} />
                Safety Incident Dossier: #{selectedIncident.id}
              </h3>
              <button 
                type="button" 
                className={styles.modalCloseBtn}
                onClick={() => setSelectedIncident(null)}
              >
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Emergency Banner */}
              <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '10px', padding: '14px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FaExclamationTriangle style={{ color: '#dc2626', fontSize: '24px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: '700', color: '#991b1b', fontSize: '14px' }}>
                    Priority: {selectedIncident.severity} Safety Event
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#b91c1c' }}>
                    Incident category: {selectedIncident.category}. Handled under Trust & Safety Fast-Track Protocol.
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#111827' }}>
                  {selectedIncident.title}
                </h4>
                <div style={{ fontSize: '12.5px', color: '#6b7280', marginTop: '4px' }}>
                  Property: <span style={{ fontWeight: '600', color: '#111827' }}>{selectedIncident.listingName}</span> • Reported {selectedIncident.reportedAt}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>
                  Detailed Incident Narrative:
                </span>
                <p style={{ margin: '6px 0 0 0', fontSize: '13.5px', color: '#1e293b', lineHeight: '1.5' }}>
                  {selectedIncident.description}
                </p>
              </div>

              {/* Action Taken / Current State */}
              <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '10px', border: '1px solid #bbf7d0', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#166534' }}>
                  Enforcement Actions Logged:
                </span>
                <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#14532d', fontWeight: '500' }}>
                  {selectedIncident.actionTaken}
                </p>
              </div>

              {/* Evidence Photos Mock Grid */}
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#4b5563', display: 'block', marginBottom: '8px' }}>
                  Attached Evidence & Photos ({selectedIncident.evidencePhotos}):
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                  {Array.from({ length: selectedIncident.evidencePhotos }).map((_, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        height: '90px', 
                        borderRadius: '8px', 
                        background: '#f1f5f9', 
                        border: '1px dashed #cbd5e1', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#64748b',
                        fontSize: '11px',
                        gap: '4px'
                      }}
                    >
                      <FaCamera size={16} />
                      Evidence #{i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className={styles.btnSecondary}
                onClick={() => setSelectedIncident(null)}
              >
                Close
              </button>
              <button 
                type="button" 
                className={styles.btnDangerAction}
                onClick={() => {
                  alert(`Emergency restrictions dispatched for ${selectedIncident.reportedUser}`);
                  handleUpdateIncidentStatus(selectedIncident.id, 'Action Taken');
                }}
              >
                <FaBan size={12} /> Suspend Involved Party
              </button>
              {selectedIncident.status !== 'Resolved' && (
                <button 
                  type="button" 
                  className={styles.btnPrimary}
                  style={{ background: '#16a34a' }}
                  onClick={() => handleUpdateIncidentStatus(selectedIncident.id, 'Resolved')}
                >
                  <FaCheck size={12} /> Mark Safe & Closed
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: AUDITED CHAT TRANSCRIPT INSPECTOR
          ========================================================= */}
      {selectedChat && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedChat(null)}>
          <div className={`${styles.modalDialog} ${styles.modalDialogLarge}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <FaComments style={{ color: '#ca8a04' }} />
                Audited Conversation: #{selectedChat.id}
              </h3>
              <button 
                type="button" 
                className={styles.modalCloseBtn}
                onClick={() => setSelectedChat(null)}
              >
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Flag details alert */}
              <div style={{ background: '#fefce8', border: '1px solid #fef08a', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px' }}>
                <div style={{ fontWeight: '700', color: '#854d0e', fontSize: '13.5px' }}>
                  Safety Violation Trigger: {selectedChat.flagReason}
                </div>
                <div style={{ fontSize: '12px', color: '#a16207', marginTop: '3px' }}>
                  Listing: <span style={{ fontWeight: '600' }}>{selectedChat.listing}</span> • Between: <span style={{ fontWeight: '600' }}>{selectedChat.participants}</span>
                </div>
              </div>

              {/* Transcript thread */}
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#4b5563', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Secure Message Stream (Flagged messages highlighted):
                </span>
                <div className={styles.chatThreadBox}>
                  {selectedChat.transcript.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`${styles.chatBubble} ${msg.sender === 'Host' ? styles.bubbleHost : styles.bubbleGuest} ${msg.isFlagged ? styles.bubbleFlagged : ''}`}
                    >
                      <div className={styles.bubbleSender}>
                        <span>{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <div>
                        {msg.isFlagged && (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#dc2626', fontWeight: '700', fontSize: '11px', marginBottom: '3px' }}>
                            <FaExclamationTriangle size={10} /> Policy Flag:
                          </div>
                        )}
                        <div style={{ fontWeight: msg.isFlagged ? '600' : 'normal' }}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className={styles.btnSecondary}
                onClick={() => setSelectedChat(null)}
              >
                Close
              </button>
              <button 
                type="button" 
                className={styles.btnDangerAction}
                onClick={() => {
                  alert('Formal policy warning dispatched to offending user account.');
                  handleUpdateChatStatus(selectedChat.id, 'Reviewed - Warned');
                }}
              >
                <FaExclamationTriangle size={12} /> Issue Formal Warning
              </button>
              {selectedChat.status !== 'Cleared' && (
                <button 
                  type="button" 
                  className={styles.btnPrimary}
                  style={{ background: '#16a34a' }}
                  onClick={() => handleUpdateChatStatus(selectedChat.id, 'Cleared')}
                >
                  <FaCheck size={12} /> Clear Flag
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 4: CREATE SUPPORT TICKET MODAL
          ========================================================= */}
      {showNewTicketModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowNewTicketModal(false)}>
          <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <FaLifeRing style={{ color: '#ff385c' }} />
                Create New Support Ticket
              </h3>
              <button 
                type="button" 
                className={styles.modalCloseBtn}
                onClick={() => setShowNewTicketModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateTicket}>
              <div className={styles.modalBody}>
                {/* Subject */}
                <div style={{ marginBottom: '14px' }}>
                  <label className={styles.formLabel}>Ticket Subject / Summary *</label>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    placeholder="e.g. Guest reporting water leakage in master bathroom"
                    required
                    value={newTicketData.subject}
                    onChange={(e) => setNewTicketData({ ...newTicketData, subject: e.target.value })}
                  />
                </div>

                {/* Category & Priority (Bootstrap Grid) */}
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Category</label>
                    <select 
                      className={styles.formSelect}
                      value={newTicketData.category}
                      onChange={(e) => setNewTicketData({ ...newTicketData, category: e.target.value })}
                    >
                      <option value="Check-in & Access">Check-in & Access</option>
                      <option value="Refund & Billing">Refund & Billing</option>
                      <option value="Host Dispute">Host Dispute</option>
                      <option value="Listing Amenities">Listing Amenities</option>
                      <option value="Account & Security">Account & Security</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Priority Level</label>
                    <select 
                      className={styles.formSelect}
                      value={newTicketData.priority}
                      onChange={(e) => setNewTicketData({ ...newTicketData, priority: e.target.value })}
                    >
                      <option value="Critical">Critical (Immediate action)</option>
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                    </select>
                  </div>
                </div>

                {/* Submitter Name & User Type */}
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-8">
                    <label className={styles.formLabel}>Submitter Name *</label>
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      placeholder="e.g. Ramesh Patel"
                      required
                      value={newTicketData.userName}
                      onChange={(e) => setNewTicketData({ ...newTicketData, userName: e.target.value })}
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className={styles.formLabel}>User Role</label>
                    <select 
                      className={styles.formSelect}
                      value={newTicketData.userType}
                      onChange={(e) => setNewTicketData({ ...newTicketData, userType: e.target.value })}
                    >
                      <option value="Guest">Guest</option>
                      <option value="Host">Host</option>
                    </select>
                  </div>
                </div>

                {/* Email & Property */}
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Contact Email</label>
                    <input 
                      type="email" 
                      className={styles.formInput} 
                      placeholder="user@example.com"
                      value={newTicketData.userEmail}
                      onChange={(e) => setNewTicketData({ ...newTicketData, userEmail: e.target.value })}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Property / Listing Reference</label>
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      placeholder="e.g. Sea View Villa, Goa"
                      value={newTicketData.listingName}
                      onChange={(e) => setNewTicketData({ ...newTicketData, listingName: e.target.value })}
                    />
                  </div>
                </div>

                {/* Detailed Description */}
                <div>
                  <label className={styles.formLabel}>Initial Issue Narrative</label>
                  <textarea 
                    className={styles.formTextarea} 
                    rows="3"
                    placeholder="Provide full details of the customer complaint or issue..."
                    value={newTicketData.description}
                    onChange={(e) => setNewTicketData({ ...newTicketData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button 
                  type="button" 
                  className={styles.btnSecondary}
                  onClick={() => setShowNewTicketModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  <FaCheck size={12} /> Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
