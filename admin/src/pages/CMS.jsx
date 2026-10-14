import React, { useState } from 'react';
import { 
  FaFileAlt, 
  FaQuestionCircle, 
  FaCompass, 
  FaBookOpen, 
  FaPlus, 
  FaSearch, 
  FaEdit, 
  FaTrashAlt, 
  FaCheck, 
  FaTimes, 
  FaExternalLinkAlt, 
  FaGlobe, 
  FaShieldAlt, 
  FaEye, 
  FaChevronDown, 
  FaChevronUp, 
  FaLink, 
  FaListUl, 
  FaInfoCircle, 
  FaFolder 
} from 'react-icons/fa';
import styles from './styles/CMS.module.css';

// Initial Mock CMS Website Pages
const INITIAL_PAGES = [
  {
    id: 1,
    title: 'Privacy Policy',
    slug: '/privacy-policy',
    category: 'Legal & Compliance',
    lastUpdated: '10 Oct 2026',
    author: 'Legal Team (Super Admin)',
    status: 'Published',
    viewsCount: '14.2K',
    excerpt: 'Detailed information regarding how Airbnb India collects, safeguards, and processes personal data and KYC records.',
    content: 'This Privacy Policy explains how Airbnb collects, uses, and shares your personal information. When you create an account, list a property, or make a reservation, we collect personal data including contact information, government ID proofs for host KYC verification, and billing transaction details. We implement high-grade encryption and comply with RBI data localization regulations.'
  },
  {
    id: 2,
    title: 'Terms of Service',
    slug: '/terms-of-service',
    category: 'Legal & Compliance',
    lastUpdated: '05 Oct 2026',
    author: 'Legal Team (Super Admin)',
    status: 'Published',
    viewsCount: '22.8K',
    excerpt: 'Governing agreement, guest booking conditions, host payout settlement timelines, and dispute arbitration rules.',
    content: 'By accessing or using the Airbnb platform, you agree to comply with and be bound by these Terms of Service. Hosts are responsible for the accuracy of their property descriptions, pricing, and house rules. Guests agree to observe check-out times and property rules. Airbnb acts as a payment collection agent and facilitator between guests and independent hosts.'
  },
  {
    id: 3,
    title: 'About Us & Company Story',
    slug: '/about-us',
    category: 'Company & Story',
    lastUpdated: '15 Sep 2026',
    author: 'Brand & PR Team',
    status: 'Published',
    viewsCount: '8.5K',
    excerpt: 'Our mission to create a world where anyone can belong anywhere, supporting local tourism and homestay entrepreneurs.',
    content: 'Airbnb began in 2008 when two hosts welcomed three guests to their home in San Francisco. Today, millions of hosts and guests have created memorable travel journeys across India and the globe. We empower local hosts to earn supplemental income while offering authentic experiences to travelers.'
  },
  {
    id: 4,
    title: 'Guest Refund Policy',
    slug: '/guest-refund-policy',
    category: 'Legal & Compliance',
    lastUpdated: '01 Oct 2026',
    author: 'Trust & Safety Desk',
    status: 'Published',
    viewsCount: '19.4K',
    excerpt: 'Clear guidelines on cancellations, extenuating circumstances, and qualifying refund criteria.',
    content: 'If an emergency or travel disruption occurs, or if a host fails to provide access or the listing is materially misrepresented, guests may be eligible for a full or partial refund under Airbnb Guest Refund Guidelines.'
  },
  {
    id: 5,
    title: 'Careers at Airbnb India',
    slug: '/careers',
    category: 'Company & Story',
    lastUpdated: '12 Aug 2026',
    author: 'HR & Talent Desk',
    status: 'Published',
    viewsCount: '6.1K',
    excerpt: 'Explore open positions in our Bengaluru, Gurgaon, and Mumbai engineering and customer experience centers.',
    content: 'Join our mission to revolutionize travel and hospitality. Check out our open roles in Engineering, Product Design, Operations, and Customer Support.'
  },
  {
    id: 6,
    title: 'Responsible Hosting in India',
    slug: '/responsible-hosting',
    category: 'Help & Knowledge',
    lastUpdated: '28 Sep 2026',
    author: 'Host Community Lead',
    status: 'Draft',
    viewsCount: '-',
    excerpt: 'Best practices for host taxation (GST/TDS), local municipal permits, fire safety, and neighbor courtesy.',
    content: 'As an Airbnb host, understanding local municipal licenses, registering under state homestay policies, and maintaining guest safety checklists ensures positive community relationships.'
  }
];

// Initial Mock Help Centre FAQs
const INITIAL_FAQS = [
  {
    id: 1,
    question: 'How do I cancel a reservation and get my refund?',
    category: 'Bookings & Refunds',
    targetRole: 'Guests',
    helpfulVotes: 842,
    status: 'Published',
    answer: 'To cancel a booking: Go to Trips -> Select your reservation -> Click "Cancel reservation". Your refund amount will depend on the host cancellation policy (Flexible, Moderate, or Strict) chosen for that property. Eligible refunds are returned to your original payment mode within 5-7 business days.'
  },
  {
    id: 2,
    question: 'What documents are required for Host KYC verification?',
    category: 'Hosting & Payouts',
    targetRole: 'Hosts',
    helpfulVotes: 619,
    status: 'Published',
    answer: 'Hosts must submit a government-issued Photo ID (Aadhaar Card, Passport, or Voter ID), PAN Card for tax compliance (TDS deduction), and a cancelled cheque or bank passbook copy for bank payout verification.'
  },
  {
    id: 3,
    question: 'How does Airbnb handle safety disputes or property damages?',
    category: 'Trust & Safety',
    targetRole: 'All Users',
    helpfulVotes: 520,
    status: 'Published',
    answer: 'Every eligible reservation includes AirCover protection. In case of accidental damage during a stay, hosts can open a dispute via Resolution Centre within 14 days of checkout. Guests and hosts can upload photo/video proof.'
  },
  {
    id: 4,
    question: 'When will I receive my Host payout for a guest stay?',
    category: 'Hosting & Payouts',
    targetRole: 'Hosts',
    helpfulVotes: 735,
    status: 'Published',
    answer: 'Airbnb releases your payout approximately 24 hours after your guest scheduled check-in time. Depending on your bank processing speed, funds will reflect in your account within 1-3 business days.'
  },
  {
    id: 5,
    question: 'How does Airbnb "Refer a Host" program work?',
    category: 'Referrals & Promos',
    targetRole: 'All Users',
    helpfulVotes: 412,
    status: 'Published',
    answer: 'Share your unique referral link with prospective hosts. When they publish their first listing and complete a booking worth at least ₹4,000, you receive a ₹2,500 cash referral bonus directly into your payout account.'
  }
];

// Initial Mock Footer Links Navigation Structure
const INITIAL_FOOTER_SECTIONS = [
  {
    id: 'support_col',
    title: 'Support',
    links: [
      { label: 'Help Centre', url: '/help', isLive: true },
      { label: 'AirCover', url: '/aircover', isLive: true },
      { label: 'Anti-discrimination', url: '/anti-discrimination', isLive: true },
      { label: 'Disability support', url: '/accessibility', isLive: true },
      { label: 'Cancellation options', url: '/cancellations', isLive: true }
    ]
  },
  {
    id: 'hosting_col',
    title: 'Hosting',
    links: [
      { label: 'Airbnb your home', url: '/host/homes', isLive: true },
      { label: 'AirCover for Hosts', url: '/host/aircover', isLive: true },
      { label: 'Hosting resources', url: '/resources', isLive: true },
      { label: 'Community forum', url: '/community', isLive: true },
      { label: 'Hosting responsibly', url: '/responsible-hosting', isLive: true }
    ]
  },
  {
    id: 'airbnb_col',
    title: 'Airbnb',
    links: [
      { label: 'Newsroom', url: '/news', isLive: true },
      { label: 'New features', url: '/features', isLive: true },
      { label: 'Careers', url: '/careers', isLive: true },
      { label: 'Investors', url: '/investors', isLive: true },
      { label: 'Airbnb.org emergency stays', url: '/emergency-stays', isLive: true }
    ]
  },
  {
    id: 'legal_col',
    title: 'Legal & Policies',
    links: [
      { label: 'Privacy Policy', url: '/privacy-policy', isLive: true },
      { label: 'Terms of Service', url: '/terms-of-service', isLive: true },
      { label: 'Company details', url: '/about-us', isLive: true },
      { label: 'Sitemap', url: '/sitemap', isLive: true }
    ]
  }
];

export default function CMS() {
  const [activeTab, setActiveTab] = useState('pages'); // 'pages' | 'faqs' | 'footer'
  const [pages, setPages] = useState(INITIAL_PAGES);
  const [faqs, setFaqs] = useState(INITIAL_FAQS);
  const [footerSections, setFooterSections] = useState(INITIAL_FOOTER_SECTIONS);

  // Filters
  const [pageSearch, setPageSearch] = useState('');
  const [pageCatFilter, setPageCatFilter] = useState('ALL');
  const [pageStatusFilter, setPageStatusFilter] = useState('ALL');

  const [faqSearch, setFaqSearch] = useState('');
  const [faqCatFilter, setFaqCatFilter] = useState('ALL');

  // Accordion state in FAQ
  const [expandedFaqId, setExpandedFaqId] = useState(1);

  // Modals state
  const [showPageModal, setShowPageModal] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [pageFormData, setPageFormData] = useState({
    title: '',
    slug: '',
    category: 'Legal & Compliance',
    status: 'Published',
    excerpt: '',
    content: ''
  });

  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqFormData, setFaqFormData] = useState({
    question: '',
    category: 'Bookings & Refunds',
    targetRole: 'Guests',
    answer: '',
    status: 'Published'
  });

  const [previewPage, setPreviewPage] = useState(null);

  // Calculations
  const totalPagesCount = pages.length;
  const publishedPagesCount = pages.filter(p => p.status === 'Published').length;
  const totalFaqsCount = faqs.length;
  const totalFooterLinksCount = footerSections.reduce((acc, col) => acc + col.links.length, 0);

  // Filtered lists
  const filteredPages = pages.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(pageSearch.toLowerCase()) ||
      p.slug.toLowerCase().includes(pageSearch.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(pageSearch.toLowerCase());
    const matchesCat = pageCatFilter === 'ALL' || p.category === pageCatFilter;
    const matchesStatus = pageStatusFilter === 'ALL' || p.status === pageStatusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const filteredFaqs = faqs.filter(f => {
    const matchesSearch = f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearch.toLowerCase());
    const matchesCat = faqCatFilter === 'ALL' || f.category === faqCatFilter;
    return matchesSearch && matchesCat;
  });

  // Open Page Modal (Add)
  const handleOpenAddPage = () => {
    setEditingPage(null);
    setPageFormData({
      title: '',
      slug: '',
      category: 'Legal & Compliance',
      status: 'Published',
      excerpt: '',
      content: ''
    });
    setShowPageModal(true);
  };

  // Open Page Modal (Edit)
  const handleOpenEditPage = (page) => {
    setEditingPage(page);
    setPageFormData({
      title: page.title,
      slug: page.slug,
      category: page.category,
      status: page.status,
      excerpt: page.excerpt,
      content: page.content
    });
    setShowPageModal(true);
  };

  // Save Page
  const handleSavePage = (e) => {
    e.preventDefault();
    if (!pageFormData.title || !pageFormData.slug) return;

    if (editingPage) {
      setPages(prev => prev.map(p => p.id === editingPage.id ? {
        ...p,
        ...pageFormData,
        lastUpdated: 'Today'
      } : p));
    } else {
      const newPage = {
        id: Date.now(),
        ...pageFormData,
        lastUpdated: 'Today',
        author: 'Admin Staff',
        viewsCount: '0'
      };
      setPages(prev => [newPage, ...prev]);
    }
    setShowPageModal(false);
  };

  // Delete Page
  const handleDeletePage = (pageId) => {
    if (window.confirm('Are you sure you want to delete this CMS content page?')) {
      setPages(prev => prev.filter(p => p.id !== pageId));
    }
  };

  // Open FAQ Modal (Add)
  const handleOpenAddFaq = () => {
    setEditingFaq(null);
    setFaqFormData({
      question: '',
      category: 'Bookings & Refunds',
      targetRole: 'Guests',
      answer: '',
      status: 'Published'
    });
    setShowFaqModal(true);
  };

  // Open FAQ Modal (Edit)
  const handleOpenEditFaq = (faq) => {
    setEditingFaq(faq);
    setFaqFormData({
      question: faq.question,
      category: faq.category,
      targetRole: faq.targetRole,
      answer: faq.answer,
      status: faq.status
    });
    setShowFaqModal(true);
  };

  // Save FAQ
  const handleSaveFaq = (e) => {
    e.preventDefault();
    if (!faqFormData.question || !faqFormData.answer) return;

    if (editingFaq) {
      setFaqs(prev => prev.map(f => f.id === editingFaq.id ? { ...f, ...faqFormData } : f));
    } else {
      const newFaq = {
        id: Date.now(),
        ...faqFormData,
        helpfulVotes: 0
      };
      setFaqs(prev => [newFaq, ...prev]);
    }
    setShowFaqModal(false);
  };

  // Delete FAQ
  const handleDeleteFaq = (faqId) => {
    if (window.confirm('Are you sure you want to delete this FAQ question?')) {
      setFaqs(prev => prev.filter(f => f.id !== faqId));
    }
  };

  return (
    <div className="container-fluid p-0">
      {/* 4 Summary Stat Cards with Bootstrap Grid */}
      <div className="row g-3 mb-4">
        {/* Card 1: Total CMS Pages */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Content Pages</span>
              <div className={styles.statIconBox} style={{ background: '#eff6ff', color: '#2563eb' }}>
                <FaFileAlt />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>{totalPagesCount}</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
                  {publishedPagesCount} Published Live
                </span>
                <span className={styles.statSubtext}>Legal & Policy Docs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Help Centre FAQs */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Help Centre FAQs</span>
              <div className={styles.statIconBox} style={{ background: '#f0fdf4', color: '#16a34a' }}>
                <FaQuestionCircle />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>{totalFaqsCount}</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
                  2.7K+ Helpful Votes
                </span>
                <span className={styles.statSubtext}>Knowledge Base</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Footer Navigation Links */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Footer Site Links</span>
              <div className={styles.statIconBox} style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                <FaCompass />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>{totalFooterLinksCount}</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgePurple}`}>
                  4 Nav Columns
                </span>
                <span className={styles.statSubtext}>User Portal Navigation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Total Knowledge Reads */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Monthly Readership</span>
              <div className={styles.statIconBox} style={{ background: '#fff1f2', color: '#ff385c' }}>
                <FaBookOpen />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>91.2K</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgePink}`}>
                  +16.8% Readership
                </span>
                <span className={styles.statSubtext}>Self-Serve Support</span>
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
              <FaFileAlt style={{ color: '#ff385c', fontSize: '20px' }} />
              CMS & Content Pages Management
            </h2>
            <p className={styles.subtitle}>
              Privacy Policy, Terms of Service, About Us, Help Centre FAQs aur footer navigation pages ko customize karein.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className={styles.tabGroup}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'pages' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('pages')}
            >
              <FaFileAlt size={12} />
              Website Pages (Privacy, Terms, About)
              <span className={styles.tabCount}>{pages.length}</span>
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'faqs' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('faqs')}
            >
              <FaQuestionCircle size={12} />
              Help Centre & FAQs
              <span className={styles.tabCount}>{faqs.length}</span>
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'footer' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('footer')}
            >
              <FaCompass size={12} />
              Footer Site Map & Links
              <span className={styles.tabCount}>{totalFooterLinksCount}</span>
            </button>
          </div>
        </div>

        {/* =========================================================
            TAB 1: WEBSITE CONTENT PAGES
            ========================================================= */}
        {activeTab === 'pages' && (
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
                    placeholder="Search pages by title, slug, or content..."
                    value={pageSearch}
                    onChange={(e) => setPageSearch(e.target.value)}
                  />
                </div>

                {/* Category Filter */}
                <select 
                  className={styles.filterSelect}
                  value={pageCatFilter}
                  onChange={(e) => setPageCatFilter(e.target.value)}
                >
                  <option value="ALL">All Categories</option>
                  <option value="Legal & Compliance">Legal & Compliance</option>
                  <option value="Company & Story">Company & Story</option>
                  <option value="Help & Knowledge">Help & Knowledge</option>
                </select>

                {/* Status Filter */}
                <select 
                  className={styles.filterSelect}
                  value={pageStatusFilter}
                  onChange={(e) => setPageStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Status</option>
                  <option value="Published">Published ({publishedPagesCount})</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              {/* Add Page Button */}
              <button className={styles.btnPrimary} onClick={handleOpenAddPage}>
                <FaPlus size={11} /> Create New Page
              </button>
            </div>

            {/* Bootstrap Table Responsive Wrapper */}
            <div className={styles.tableResponsive}>
              <table className={`table table-hover align-middle mb-0 ${styles.customTable}`}>
                <thead>
                  <tr>
                    <th className={styles.srNoCol}>Sr. No.</th>
                    <th>Page Title</th>
                    <th>URL Path (Slug)</th>
                    <th>Category</th>
                    <th>Last Updated</th>
                    <th>Readership</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPages.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '40px 16px', color: '#6b7280' }}>
                        No content pages found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredPages.map((page, idx) => (
                      <tr key={page.id}>
                        {/* Sr. No. */}
                        <td className={styles.srNoCol}>{idx + 1}</td>

                        {/* Title & Excerpt */}
                        <td>
                          <div style={{ fontWeight: '700', color: '#111827', fontSize: '13.5px' }}>
                            {page.title}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#6b7280', maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {page.excerpt}
                          </div>
                        </td>

                        {/* URL Slug */}
                        <td>
                          <span className={styles.slugPill}>
                            {page.slug}
                          </span>
                        </td>

                        {/* Category */}
                        <td>
                          <span className={`${styles.categoryPill} ${
                            page.category === 'Legal & Compliance' ? styles.catLegal :
                            page.category === 'Company & Story' ? styles.catCompany : styles.catHelp
                          }`}>
                            {page.category}
                          </span>
                        </td>

                        {/* Last Updated */}
                        <td style={{ color: '#6b7280', fontSize: '12.5px' }}>
                          {page.lastUpdated}
                        </td>

                        {/* Readership Views */}
                        <td>
                          <span style={{ fontWeight: '600', color: '#111827' }}>
                            {page.viewsCount}
                          </span>
                        </td>

                        {/* Status */}
                        <td>
                          <span className={`${styles.statusBadge} ${
                            page.status === 'Published' ? styles.statusPublished : styles.statusDraft
                          }`}>
                            <span className={styles.statusDot} />
                            {page.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className={styles.actionBtnGroup} style={{ justifyContent: 'center' }}>
                            {/* Preview Page */}
                            <button 
                              className={`${styles.actionBtn} ${styles.actionBtnView}`}
                              title="Preview Article Content"
                              onClick={() => setPreviewPage(page)}
                            >
                              <FaEye />
                            </button>

                            {/* Edit Page */}
                            <button 
                              className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                              title="Edit Content & Metadata"
                              onClick={() => handleOpenEditPage(page)}
                            >
                              <FaEdit />
                            </button>

                            {/* Delete Page */}
                            <button 
                              className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                              title="Delete Page"
                              onClick={() => handleDeletePage(page.id)}
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
        )}

        {/* =========================================================
            TAB 2: HELP CENTRE & FAQS
            ========================================================= */}
        {activeTab === 'faqs' && (
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
                    placeholder="Search FAQ questions or solutions..."
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                  />
                </div>

                {/* Category Filter */}
                <select 
                  className={styles.filterSelect}
                  value={faqCatFilter}
                  onChange={(e) => setFaqCatFilter(e.target.value)}
                >
                  <option value="ALL">All Topics</option>
                  <option value="Bookings & Refunds">Bookings & Refunds</option>
                  <option value="Hosting & Payouts">Hosting & Payouts</option>
                  <option value="Trust & Safety">Trust & Safety</option>
                  <option value="Referrals & Promos">Referrals & Promos</option>
                </select>
              </div>

              {/* Add FAQ Button */}
              <button className={styles.btnPrimary} onClick={handleOpenAddFaq}>
                <FaPlus size={11} /> Add New FAQ
              </button>
            </div>

            {/* Accordion FAQ Preview List */}
            <div style={{ marginTop: '14px' }}>
              {filteredFaqs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 16px', color: '#6b7280' }}>
                  No FAQ questions found matching your filter criteria.
                </div>
              ) : (
                filteredFaqs.map((faq, idx) => {
                  const isExpanded = expandedFaqId === faq.id;
                  return (
                    <div key={faq.id} className={styles.faqAccordionCard}>
                      <div 
                        className={styles.faqAccordionHeader}
                        onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: '700', color: '#ff385c', fontSize: '13px', width: '28px' }}>
                            Q{idx + 1}.
                          </span>
                          <div>
                            <span className={styles.faqQuestionText}>{faq.question}</span>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '3px' }}>
                              <span className={`${styles.categoryPill} ${styles.catHelp}`} style={{ fontSize: '11px', padding: '1px 6px' }}>
                                {faq.category}
                              </span>
                              <span style={{ fontSize: '11.5px', color: '#6b7280' }}>
                                Target: <strong>{faq.targetRole}</strong> • {faq.helpfulVotes} users found this helpful
                              </span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className={styles.actionBtnGroup} onClick={(e) => e.stopPropagation()}>
                            <button 
                              className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                              title="Edit FAQ"
                              onClick={() => handleOpenEditFaq(faq)}
                            >
                              <FaEdit />
                            </button>
                            <button 
                              className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                              title="Delete FAQ"
                              onClick={() => handleDeleteFaq(faq.id)}
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                          {isExpanded ? <FaChevronUp size={12} color="#64748b" /> : <FaChevronDown size={12} color="#64748b" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className={styles.faqAccordionBody}>
                          <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '4px', fontSize: '12px', textTransform: 'uppercase' }}>
                            Answer / Solution:
                          </div>
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: FOOTER SITE MAP & LINKS
            ========================================================= */}
        {activeTab === 'footer' && (
          <div>
            <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '13.5px' }}>
                <FaCompass style={{ color: '#7c3aed', marginRight: '6px' }} />
                User App Global Footer Navigation Map
              </div>
              <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                Yeh 4 columns Airbnb live user website ke global footer links aur page redirects ko control karte hain.
              </p>
            </div>

            {/* Bootstrap Grid for 4 Footer Columns */}
            <div className="row g-3">
              {footerSections.map((col) => (
                <div key={col.id} className="col-12 col-md-6 col-xl-3">
                  <div className={styles.footerColumnCard}>
                    <div className={styles.footerColumnTitle}>
                      <span>{col.title}</span>
                      <span className={styles.slugPill} style={{ fontSize: '10.5px', padding: '1px 5px' }}>
                        {col.links.length} links
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {col.links.map((link, i) => (
                        <div key={i} className={styles.footerLinkItem}>
                          <span style={{ fontWeight: '600', color: '#334155' }}>{link.label}</span>
                          <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
                            {link.url}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button 
                      className={styles.btnPrimary} 
                      style={{ width: '100%', marginTop: '12px', padding: '6px 10px', fontSize: '12px', justifyContent: 'center' }}
                      onClick={() => {
                        const newName = prompt(`Enter new link label for "${col.title}" column:`);
                        const newUrl = newName ? prompt('Enter relative path or URL (e.g. /new-page):', `/${newName.toLowerCase().replace(/\\s+/g, '-')}`) : null;
                        if (newName && newUrl) {
                          setFooterSections(prev => prev.map(c => c.id === col.id ? {
                            ...c,
                            links: [...c.links, { label: newName, url: newUrl, isLive: true }]
                          } : c));
                        }
                      }}
                    >
                      <FaPlus size={10} /> Add Link to {col.title}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================
          MODAL 1: CREATE / EDIT PAGE MODAL
          ========================================================= */}
      {showPageModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowPageModal(false)}>
          <div className={`${styles.modalDialog} ${styles.modalDialogLarge}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <FaFileAlt style={{ color: '#ff385c' }} />
                {editingPage ? 'Edit CMS Page' : 'Create New Website Content Page'}
              </h3>
              <button 
                type="button" 
                className={styles.modalCloseBtn}
                onClick={() => setShowPageModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSavePage}>
              <div className={styles.modalBody}>
                {/* Title & Slug (Bootstrap Grid) */}
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Page Title *</label>
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      placeholder="e.g. Host Cancellation & Payout Policy"
                      required
                      value={pageFormData.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPageFormData({
                          ...pageFormData,
                          title: val,
                          slug: editingPage ? pageFormData.slug : `/${val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`
                        });
                      }}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>URL Path / Slug *</label>
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      placeholder="/example-slug"
                      required
                      value={pageFormData.slug}
                      onChange={(e) => setPageFormData({ ...pageFormData, slug: e.target.value })}
                    />
                  </div>
                </div>

                {/* Category & Status */}
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Page Category</label>
                    <select 
                      className={styles.formSelect}
                      value={pageFormData.category}
                      onChange={(e) => setPageFormData({ ...pageFormData, category: e.target.value })}
                    >
                      <option value="Legal & Compliance">Legal & Compliance</option>
                      <option value="Company & Story">Company & Story</option>
                      <option value="Help & Knowledge">Help & Knowledge</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Publish Status</label>
                    <select 
                      className={styles.formSelect}
                      value={pageFormData.status}
                      onChange={(e) => setPageFormData({ ...pageFormData, status: e.target.value })}
                    >
                      <option value="Published">Published Live</option>
                      <option value="Draft">Draft (Hidden)</option>
                    </select>
                  </div>
                </div>

                {/* Brief Excerpt */}
                <div style={{ marginBottom: '14px' }}>
                  <label className={styles.formLabel}>Page Summary / Meta Description</label>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    placeholder="Brief 1-line description displayed in search snippets and footers..."
                    value={pageFormData.excerpt}
                    onChange={(e) => setPageFormData({ ...pageFormData, excerpt: e.target.value })}
                  />
                </div>

                {/* Content Rich Body */}
                <div>
                  <label className={styles.formLabel}>Full Page Content Body</label>
                  <textarea 
                    className={styles.formTextarea} 
                    rows="6"
                    placeholder="Write official terms, policy clauses, company background..."
                    value={pageFormData.content}
                    onChange={(e) => setPageFormData({ ...pageFormData, content: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button 
                  type="button" 
                  className={styles.btnSecondary}
                  onClick={() => setShowPageModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  <FaCheck size={12} /> {editingPage ? 'Save Page Changes' : 'Publish Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: CREATE / EDIT FAQ MODAL
          ========================================================= */}
      {showFaqModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowFaqModal(false)}>
          <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <FaQuestionCircle style={{ color: '#ff385c' }} />
                {editingFaq ? 'Edit FAQ Item' : 'Add Help Centre Question'}
              </h3>
              <button 
                type="button" 
                className={styles.modalCloseBtn}
                onClick={() => setShowFaqModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveFaq}>
              <div className={styles.modalBody}>
                {/* Question */}
                <div style={{ marginBottom: '14px' }}>
                  <label className={styles.formLabel}>User Question *</label>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    placeholder="e.g. How do I request an early check-in from my host?"
                    required
                    value={faqFormData.question}
                    onChange={(e) => setFaqFormData({ ...faqFormData, question: e.target.value })}
                  />
                </div>

                {/* Category & Target Role (Bootstrap Grid) */}
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Topic / Category</label>
                    <select 
                      className={styles.formSelect}
                      value={faqFormData.category}
                      onChange={(e) => setFaqFormData({ ...faqFormData, category: e.target.value })}
                    >
                      <option value="Bookings & Refunds">Bookings & Refunds</option>
                      <option value="Hosting & Payouts">Hosting & Payouts</option>
                      <option value="Trust & Safety">Trust & Safety</option>
                      <option value="Referrals & Promos">Referrals & Promos</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Target Audience</label>
                    <select 
                      className={styles.formSelect}
                      value={faqFormData.targetRole}
                      onChange={(e) => setFaqFormData({ ...faqFormData, targetRole: e.target.value })}
                    >
                      <option value="Guests">Guests</option>
                      <option value="Hosts">Hosts</option>
                      <option value="All Users">All Users</option>
                    </select>
                  </div>
                </div>

                {/* Answer */}
                <div>
                  <label className={styles.formLabel}>Helpful Solution / Answer *</label>
                  <textarea 
                    className={styles.formTextarea} 
                    rows="4"
                    placeholder="Provide step-by-step guidance for the user..."
                    required
                    value={faqFormData.answer}
                    onChange={(e) => setFaqFormData({ ...faqFormData, answer: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button 
                  type="button" 
                  className={styles.btnSecondary}
                  onClick={() => setShowFaqModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  <FaCheck size={12} /> {editingFaq ? 'Update FAQ' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: PREVIEW ARTICLE CONTENT
          ========================================================= */}
      {previewPage && (
        <div className={styles.modalBackdrop} onClick={() => setPreviewPage(null)}>
          <div className={`${styles.modalDialog} ${styles.modalDialogLarge}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <FaGlobe style={{ color: '#ff385c' }} />
                Website Page Preview: {previewPage.title}
              </h3>
              <button 
                type="button" 
                className={styles.modalCloseBtn}
                onClick={() => setPreviewPage(null)}
              >
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid #f1f3f6' }}>
                <span className={styles.slugPill} style={{ fontSize: '13px' }}>
                  https://airbnb.internal{previewPage.slug}
                </span>
                <span className={`${styles.statusBadge} ${previewPage.status === 'Published' ? styles.statusPublished : styles.statusDraft}`}>
                  {previewPage.status}
                </span>
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>
                {previewPage.title}
              </h2>

              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '18px' }}>
                Category: <strong>{previewPage.category}</strong> • Last Updated: <strong>{previewPage.lastUpdated}</strong> • Maintained by: <strong>{previewPage.author}</strong>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>
                  Meta Summary:
                </span>
                <div style={{ fontSize: '13.5px', color: '#334155', fontStyle: 'italic', marginTop: '3px' }}>
                  "{previewPage.excerpt}"
                </div>
              </div>

              <div style={{ fontSize: '14.5px', color: '#1f2937', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                {previewPage.content}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className={styles.btnSecondary}
                onClick={() => setPreviewPage(null)}
              >
                Close
              </button>
              <button 
                type="button" 
                className={styles.btnPrimary}
                onClick={() => {
                  const p = previewPage;
                  setPreviewPage(null);
                  handleOpenEditPage(p);
                }}
              >
                <FaEdit size={12} /> Edit Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
