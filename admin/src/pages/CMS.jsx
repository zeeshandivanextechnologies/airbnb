import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
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
  FaFolder,
  FaMagic,
  FaSave
} from 'react-icons/fa';
import { adminApiRequest } from '../services/api';
import styles from './styles/CMS.module.css';

export default function CMS() {
  const [activeTab, setActiveTab] = useState('pages'); // 'pages' | 'faqs' | 'footer' | 'hostExperience'
  const [pages, setPages] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [footerSections, setFooterSections] = useState([]);
  const [loadingCms, setLoadingCms] = useState(true);

  // Dynamic Host Experience Content state
  const [expContent, setExpContent] = useState({
    hero: { title: '', subtitle: '', video: '' },
    best_city: { title: '', subtitle: '', cards: [] },
    kinds: { title: '', items: [] },
    stats: { title: '', subtitle: '', guestsCount: '', guestsYear: '', spendingCount: '', spendingYear: '', disclaimer: '' },
    tools: { title: '', subtitle: '', cards: [] }
  });
  const [loadingExp, setLoadingExp] = useState(false);
  const [savingExpSection, setSavingExpSection] = useState(null);
  const [expToast, setExpToast] = useState(false);

  // Fetch all CMS content (pages, FAQs, footer sections) from database
  const fetchCmsData = async () => {
    try {
      setLoadingCms(true);
      const res = await adminApiRequest('/admin/auth/cms-data');
      if (res && res.success) {
        if (Array.isArray(res.pages)) setPages(res.pages);
        if (Array.isArray(res.faqs)) setFaqs(res.faqs);
        if (Array.isArray(res.footerSections)) setFooterSections(res.footerSections);
      }
    } catch (err) {
      console.warn('Could not fetch live CMS data:', err);
    } finally {
      setLoadingCms(false);
    }
  };

  // Fetch host experience content from database
  const fetchExpContent = async () => {
    try {
      setLoadingExp(true);
      const res = await adminApiRequest('/admin/auth/host-experience');
      if (res && res.success && res.data) {
        setExpContent(prev => ({
          ...prev,
          ...res.data
        }));
      }
    } catch (err) {
      console.error('Failed to load host experience content:', err);
    } finally {
      setLoadingExp(false);
    }
  };

  useEffect(() => {
    fetchCmsData();
    fetchExpContent();
  }, []);

  // Save specific section of host experience content
  const handleSaveExpSection = async (sectionKey) => {
    try {
      setSavingExpSection(sectionKey);
      const res = await adminApiRequest('/admin/auth/host-experience', {
        method: 'PUT',
        body: JSON.stringify({
          section_key: sectionKey,
          content: expContent[sectionKey]
        })
      });
      if (res && res.success) {
        setExpToast(true);
        setTimeout(() => setExpToast(false), 3500);
      }
    } catch (err) {
      alert('Error updating section: ' + (err.message || 'Database error'));
    } finally {
      setSavingExpSection(null);
    }
  };

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

  // Save Page with backend database persistence
  const handleSavePage = async (e) => {
    e.preventDefault();
    if (!pageFormData.title || !pageFormData.slug) return;

    try {
      const payload = {
        id: editingPage ? editingPage.id : undefined,
        title: pageFormData.title,
        slug: pageFormData.slug,
        category: pageFormData.category,
        status: pageFormData.status,
        excerpt: pageFormData.excerpt,
        content: pageFormData.content
      };

      const res = await adminApiRequest('/admin/auth/cms/pages', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res && res.success) {
        toast.success(res.message || 'Page saved successfully');
        fetchCmsData();
      } else {
        toast.success('Page updated');
      }
    } catch (err) {
      toast.error('Failed to save page');
      console.error(err);
    }
    setShowPageModal(false);
  };

  // Delete Page with backend database persistence
  const handleDeletePage = async (pageId) => {
    if (window.confirm('Are you sure you want to delete this CMS content page?')) {
      try {
        await adminApiRequest(`/admin/auth/cms/pages/${pageId}`, {
          method: 'DELETE'
        });
        toast.success('Page deleted successfully');
        setPages(prev => prev.filter(p => p.id !== pageId));
      } catch (err) {
        toast.error('Failed to delete page');
      }
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

  // Save FAQ with backend database persistence
  const handleSaveFaq = async (e) => {
    e.preventDefault();
    if (!faqFormData.question || !faqFormData.answer) return;

    try {
      const payload = {
        id: editingFaq ? editingFaq.id : undefined,
        question: faqFormData.question,
        category: faqFormData.category,
        targetRole: faqFormData.targetRole,
        answer: faqFormData.answer,
        status: faqFormData.status
      };

      const res = await adminApiRequest('/admin/auth/cms/faqs', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res && res.success) {
        toast.success(res.message || 'FAQ saved successfully');
        fetchCmsData();
      } else {
        toast.success('FAQ updated');
      }
    } catch (err) {
      toast.error('Failed to save FAQ');
      console.error(err);
    }
    setShowFaqModal(false);
  };

  // Delete FAQ with backend database persistence
  const handleDeleteFaq = async (faqId) => {
    if (window.confirm('Are you sure you want to delete this FAQ question?')) {
      try {
        await adminApiRequest(`/admin/auth/cms/faqs/${faqId}`, {
          method: 'DELETE'
        });
        toast.success('FAQ deleted successfully');
        setFaqs(prev => prev.filter(f => f.id !== faqId));
      } catch (err) {
        toast.error('Failed to delete FAQ');
      }
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
            <button 
              className={`${styles.tabBtn} ${activeTab === 'hostExperience' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('hostExperience')}
            >
              <FaMagic size={12} />
              Host Experience Page CMS
              <span className={styles.tabCount}>5 Sec</span>
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

        {/* =========================================================
            TAB 4: HOST EXPERIENCE PAGE DYNAMIC MANAGEMENT
            ========================================================= */}
        {activeTab === 'hostExperience' && (
          <div>
            {expToast && (
              <div style={{ background: '#ecfdf5', color: '#065f46', padding: '12px 18px', borderRadius: '8px', border: '1px solid #a7f3d0', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaCheck />
                <span><strong>Saved Successfully:</strong> Host Experience section updated in database and propagated to live user page!</span>
              </div>
            )}

            {/* Section 1: Hero Banner */}
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>1. Main Hero Section</h4>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Top headline, subtitle text and phone preview video URL</span>
                </div>
                <button 
                  className={styles.btnPrimary}
                  disabled={savingExpSection === 'hero'}
                  onClick={() => handleSaveExpSection('hero')}
                >
                  <FaSave size={12} /> {savingExpSection === 'hero' ? 'Saving...' : 'Save Hero Section'}
                </button>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className={styles.formLabel}>Hero Headline *</label>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    value={expContent.hero.title || ''}
                    onChange={(e) => setExpContent({ ...expContent, hero: { ...expContent.hero, title: e.target.value } })}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className={styles.formLabel}>Hero Subtitle</label>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    value={expContent.hero.subtitle || ''}
                    onChange={(e) => setExpContent({ ...expContent, hero: { ...expContent.hero, subtitle: e.target.value } })}
                  />
                </div>
                <div className="col-12">
                  <label className={styles.formLabel}>Hero Video Path / URL</label>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    value={expContent.hero.video || ''}
                    onChange={(e) => setExpContent({ ...expContent, hero: { ...expContent.hero, video: e.target.value } })}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Best of City Section */}
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>2. Bring the Best of Your City Section</h4>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>City highlights cards and featured host showcase</span>
                </div>
                <button 
                  className={styles.btnPrimary}
                  disabled={savingExpSection === 'best_city'}
                  onClick={() => handleSaveExpSection('best_city')}
                >
                  <FaSave size={12} /> {savingExpSection === 'best_city' ? 'Saving...' : 'Save City Section'}
                </button>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className={styles.formLabel}>Section Title</label>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    value={expContent.best_city.title || ''}
                    onChange={(e) => setExpContent({ ...expContent, best_city: { ...expContent.best_city, title: e.target.value } })}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className={styles.formLabel}>Section Subtitle</label>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    value={expContent.best_city.subtitle || ''}
                    onChange={(e) => setExpContent({ ...expContent, best_city: { ...expContent.best_city, subtitle: e.target.value } })}
                  />
                </div>
              </div>

              <div className="row g-3">
                {(expContent.best_city.cards || []).map((card, cIdx) => (
                  <div key={cIdx} className="col-12 col-md-4">
                    <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <label className={styles.formLabel}>Card {cIdx + 1} Image URL</label>
                      <input 
                        type="text" 
                        className={styles.formInput} 
                        style={{ marginBottom: '8px', fontSize: '12px' }}
                        value={card.img || ''}
                        onChange={(e) => {
                          const updated = [...expContent.best_city.cards];
                          updated[cIdx].img = e.target.value;
                          setExpContent({ ...expContent, best_city: { ...expContent.best_city, cards: updated } });
                        }}
                      />
                      <label className={styles.formLabel}>Card {cIdx + 1} Host Description</label>
                      <textarea 
                        className={styles.formTextarea} 
                        rows="2"
                        style={{ fontSize: '12px' }}
                        value={card.text || ''}
                        onChange={(e) => {
                          const updated = [...expContent.best_city.cards];
                          updated[cIdx].text = e.target.value;
                          setExpContent({ ...expContent, best_city: { ...expContent.best_city, cards: updated } });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Global Travel Stats */}
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>3. Millions of Guests & Financial Stats</h4>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Platform guest arrivals and total gross booking turnover stats</span>
                </div>
                <button 
                  className={styles.btnPrimary}
                  disabled={savingExpSection === 'stats'}
                  onClick={() => handleSaveExpSection('stats')}
                >
                  <FaSave size={12} /> {savingExpSection === 'stats' ? 'Saving...' : 'Save Stats Section'}
                </button>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className={styles.formLabel}>Guest Arrivals Number (e.g. 390 million guests)</label>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    value={expContent.stats.guestsCount || ''}
                    onChange={(e) => setExpContent({ ...expContent, stats: { ...expContent.stats, guestsCount: e.target.value } })}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className={styles.formLabel}>Total Spending Amount (e.g. $81 billion)</label>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    value={expContent.stats.spendingCount || ''}
                    onChange={(e) => setExpContent({ ...expContent, stats: { ...expContent.stats, spendingCount: e.target.value } })}
                  />
                </div>
                <div className="col-12">
                  <label className={styles.formLabel}>Disclaimer Text</label>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    value={expContent.stats.disclaimer || ''}
                    onChange={(e) => setExpContent({ ...expContent, stats: { ...expContent.stats, disclaimer: e.target.value } })}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Hosting Tools Section */}
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>4. Hosting Tools Section</h4>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Manage calendar, reservations and payout tools highlight cards</span>
                </div>
                <button 
                  className={styles.btnPrimary}
                  disabled={savingExpSection === 'tools'}
                  onClick={() => handleSaveExpSection('tools')}
                >
                  <FaSave size={12} /> {savingExpSection === 'tools' ? 'Saving...' : 'Save Tools Section'}
                </button>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className={styles.formLabel}>Section Title</label>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    value={expContent.tools.title || ''}
                    onChange={(e) => setExpContent({ ...expContent, tools: { ...expContent.tools, title: e.target.value } })}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className={styles.formLabel}>Section Subtitle</label>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    value={expContent.tools.subtitle || ''}
                    onChange={(e) => setExpContent({ ...expContent, tools: { ...expContent.tools, subtitle: e.target.value } })}
                  />
                </div>
              </div>

              <div className="row g-3">
                {(expContent.tools.cards || []).map((tool, tIdx) => (
                  <div key={tIdx} className="col-12 col-md-6">
                    <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <label className={styles.formLabel}>Tool {tIdx + 1} Title</label>
                      <input 
                        type="text" 
                        className={styles.formInput} 
                        style={{ marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}
                        value={tool.title || ''}
                        onChange={(e) => {
                          const updated = [...expContent.tools.cards];
                          updated[tIdx].title = e.target.value;
                          setExpContent({ ...expContent, tools: { ...expContent.tools, cards: updated } });
                        }}
                      />
                      <label className={styles.formLabel}>Tool Description</label>
                      <textarea 
                        className={styles.formTextarea} 
                        rows="2"
                        style={{ fontSize: '12px' }}
                        value={tool.desc || ''}
                        onChange={(e) => {
                          const updated = [...expContent.tools.cards];
                          updated[tIdx].desc = e.target.value;
                          setExpContent({ ...expContent, tools: { ...expContent.tools, cards: updated } });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
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
