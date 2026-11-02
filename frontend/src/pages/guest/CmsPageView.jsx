import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaUserCheck, 
  FaEye, 
  FaArrowLeft, 
  FaShieldAlt, 
  FaCheckCircle, 
  FaShareAlt, 
  FaPrint, 
  FaChevronRight, 
  FaInfoCircle,
  FaFileContract,
  FaQuestionCircle
} from 'react-icons/fa';
import styles from './styles/CmsPageView.module.css';

// Curated official high-resolution image galleries for visual showcase pages
const SHOWCASE_GALLERIES = {
  'about-us': {
    bannerImg: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80',
    bannerCaption: 'Airbnb community hosts & travelers connecting around the globe',
    cards: [
      {
        img: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=600&q=80',
        title: 'Where it all started',
        desc: 'In 2008, two designers opened their San Francisco home with air mattresses and homemade breakfast.'
      },
      {
        img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
        title: 'Belong Anywhere',
        desc: 'Over 4 million unique homes, heritage villas, and eco-cottages across 190+ countries.'
      },
      {
        img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
        title: 'Empowering Communities',
        desc: 'Connecting local entrepreneurs and artisans directly with conscious travelers.'
      }
    ]
  },
  'careers': {
    bannerImg: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80',
    bannerCaption: 'Airbnb Engineering & Operations Hubs: Bengaluru, Gurgaon & Mumbai',
    cards: [
      {
        img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
        title: 'Collaborative Culture',
        desc: 'Cross-functional teams solving challenging real-time distributed systems and AI matchmaking.'
      },
      {
        img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=80',
        title: 'Work & Travel Anywhere',
        desc: 'Enjoy quarterly offsites and annual travel stipends to experience listings firsthand.'
      },
      {
        img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80',
        title: 'Continuous Growth',
        desc: 'Mentorship, global learning programs, and generous wellness benefits.'
      }
    ]
  },
  'responsible-hosting': {
    bannerImg: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80',
    bannerCaption: 'Creating welcoming, safe, and memorable homestays across India',
    cards: [
      {
        img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
        title: 'State Tourism Registration',
        desc: 'Step-by-step guidance on state homestay licenses and Form C reporting.'
      },
      {
        img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80',
        title: 'Safety Checklists',
        desc: 'Fire extinguishers, verified first-aid kits, and clear emergency signage.'
      },
      {
        img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
        title: 'Neighborly Courtesy',
        desc: 'Clear house rules on parking, quiet hours, and respectful guest communication.'
      }
    ]
  },
  'aircover': {
    bannerImg: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    bannerCaption: 'Top-to-bottom protection included for free every time you book or host',
    cards: [
      {
        img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
        title: '$3M Host Damage Protection',
        desc: 'Coverage for unexpected property damages, rare art pieces, and specialized deep cleaning.'
      },
      {
        img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80',
        title: 'Check-In & Stay Guarantee',
        desc: 'If access is compromised, we rebook you in an equal or better stay immediately.'
      },
      {
        img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
        title: '24/7 Safety Priority Helpline',
        desc: 'One-touch access to specialized safety agents anytime, anywhere.'
      }
    ]
  }
};

export default function CmsPageView() {
  const params = useParams();
  const location = useLocation();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [relatedPages, setRelatedPages] = useState([]);

  // Derive target slug either from :slug param or path (e.g. /privacy-policy -> privacy-policy)
  const targetSlug = params.slug || location.pathname.replace(/^\//, '');
  const cleanKey = targetSlug.replace(/^\//, '');
  const showcase = SHOWCASE_GALLERIES[cleanKey] || null;

  useEffect(() => {
    let isMounted = true;
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(false);
        const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        
        const [pageRes, allPagesRes] = await Promise.all([
          fetch(`${baseUrl}/listings/cms/page/${targetSlug}`).catch(() => null),
          fetch(`${baseUrl}/admin/auth/cms-data`).catch(() => null)
        ]);

        if (pageRes && pageRes.ok) {
          const data = await pageRes.json();
          if (isMounted && data && data.success && data.page) {
            setPage(data.page);
            document.title = `${data.page.title} - Airbnb`;
          } else if (isMounted) {
            setError(true);
          }
        } else if (isMounted) {
          setError(true);
        }

        if (allPagesRes && allPagesRes.ok) {
          const allData = await allPagesRes.json();
          if (isMounted && allData && allData.success && Array.isArray(allData.pages)) {
            // Filter out current page and take 4 related items
            const filtered = allData.pages
              .filter(p => p.slug && !p.slug.includes(targetSlug) && p.status === 'Published')
              .slice(0, 4);
            setRelatedPages(filtered);
          }
        }
      } catch (err) {
        console.error('Failed to load CMS page:', err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (targetSlug) {
      fetchPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return () => { isMounted = false; };
  }, [targetSlug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className={styles.loadingSkeleton}>
        <div className={styles.skeletonLine} style={{ width: '160px' }}></div>
        <div className={`${styles.skeletonLine} ${styles.skeletonTitle}`}></div>
        <div className={styles.skeletonLine} style={{ width: '320px', height: '16px' }}></div>
        <div className={styles.skeletonLine} style={{ height: '90px', marginTop: '30px' }}></div>
        <div className={styles.skeletonLine} style={{ height: '180px', marginTop: '24px' }}></div>
        <div className={styles.skeletonLine} style={{ height: '220px', marginTop: '24px' }}></div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className={styles.cmsContainer}>
        <div className={styles.errorBox}>
          <div className={styles.errorIcon}>
            <FaQuestionCircle size={48} color="#ff385c" />
          </div>
          <h1 className={styles.errorTitle}>Page Not Found</h1>
          <p className={styles.errorDesc}>
            The document or article you requested could not be located or has not yet been published by the Airbnb team.
          </p>
          <Link to="/" className={styles.backBtn}>
            <FaArrowLeft /> Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Top Hero Banner */}
      <div className={styles.heroSection}>
        <div className={styles.heroInner}>
          <nav className={styles.breadcrumb}>
            <Link to="/">Home</Link>
            <FaChevronRight size={10} className={styles.breadcrumbSep} />
            <span>{page.category || 'Help & Policies'}</span>
            <FaChevronRight size={10} className={styles.breadcrumbSep} />
            <span className={styles.breadcrumbCurrent}>{page.title}</span>
          </nav>

          <div className={styles.heroBadgeRow}>
            {page.category && (
              <span className={styles.categoryBadge}>
                <FaFileContract size={11} style={{ marginRight: '6px' }} />
                {page.category}
              </span>
            )}
            <span className={styles.verifiedBadge}>
              <FaShieldAlt size={11} style={{ marginRight: '5px', color: '#16a34a' }} />
              Official Airbnb Documentation
            </span>
          </div>

          <h1 className={styles.heroTitle}>{page.title}</h1>

          <div className={styles.metaRow}>
            {page.lastUpdated && (
              <div className={styles.metaItem}>
                <FaCalendarAlt size={13} color="#717171" />
                <span>Last updated on <strong>{page.lastUpdated}</strong></span>
              </div>
            )}
            {page.author && (
              <div className={styles.metaItem}>
                <FaUserCheck size={13} color="#16a34a" />
                <span>Published by {page.author}</span>
              </div>
            )}
            {page.viewsCount && page.viewsCount !== '-' && (
              <div className={styles.metaItem}>
                <FaEye size={13} color="#717171" />
                <span>{page.viewsCount} readers</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout with Sticky Sidebar */}
      <div className={styles.mainLayout}>
        <div className={styles.contentCol}>
          {/* Visual Showcase Banner if available */}
          {showcase && (
            <div className={styles.showcaseBannerBox}>
              <img 
                src={showcase.bannerImg} 
                alt={page.title} 
                className={styles.showcaseBannerImg}
                loading="lazy"
              />
              <span className={styles.showcaseCaption}>{showcase.bannerCaption}</span>
            </div>
          )}

          {/* Excerpt Callout */}
          {page.excerpt && (
            <div className={styles.calloutCard}>
              <div className={styles.calloutIcon}>
                <FaInfoCircle size={18} color="#ff385c" />
              </div>
              <div className={styles.calloutText}>
                <strong>Overview:</strong> {page.excerpt}
              </div>
            </div>
          )}

          {/* Visual Cards Grid if available */}
          {showcase && showcase.cards && (
            <div className={styles.showcaseCardsGrid}>
              {showcase.cards.map((card, cIdx) => (
                <div key={cIdx} className={styles.showcaseCard}>
                  <img src={card.img} alt={card.title} className={styles.showcaseCardImg} loading="lazy" />
                  <div className={styles.showcaseCardBody}>
                    <h4 className={styles.showcaseCardTitle}>{card.title}</h4>
                    <p className={styles.showcaseCardDesc}>{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Formatted Article Body */}
          <article className={styles.articleBody}>
            {page.content.split('\n\n').map((block, idx) => {
              const trimmed = block.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith('## ')) {
                return (
                  <h2 key={idx} className={styles.sectionHeading}>
                    {trimmed.replace('## ', '')}
                  </h2>
                );
              }

              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={idx} className={styles.subHeading}>
                    {trimmed.replace('### ', '')}
                  </h3>
                );
              }

              // Parse bullet points
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                const items = trimmed.split('\n').filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '));
                return (
                  <ul key={idx} className={styles.bulletList}>
                    {items.map((item, i) => {
                      const cleanText = item.replace(/^[-*]\s+/, '');
                      const boldMatch = cleanText.match(/^\*\*(.*?)\*\*(.*)/);
                      if (boldMatch) {
                        return (
                          <li key={i}>
                            <strong>{boldMatch[1]}</strong>
                            <span>{boldMatch[2]}</span>
                          </li>
                        );
                      }
                      return <li key={i}>{cleanText}</li>;
                    })}
                  </ul>
                );
              }

              // Parse numbered lists
              if (/^\d+\.\s/.test(trimmed)) {
                const items = trimmed.split('\n').filter(line => /^\d+\.\s/.test(line.trim()));
                return (
                  <ol key={idx} className={styles.numberedList}>
                    {items.map((item, i) => {
                      const cleanText = item.replace(/^\d+\.\s+/, '');
                      const boldMatch = cleanText.match(/^\*\*(.*?)\*\*(.*)/);
                      if (boldMatch) {
                        return (
                          <li key={i}>
                            <strong>{boldMatch[1]}</strong>
                            <span>{boldMatch[2]}</span>
                          </li>
                        );
                      }
                      return <li key={i}>{cleanText}</li>;
                    })}
                  </ol>
                );
              }

              return <p key={idx} className={styles.paragraph}>{trimmed}</p>;
            })}
          </article>

          {/* Article Footer & Actions */}
          <div className={styles.articleFooter}>
            <div className={styles.feedbackBox}>
              <span className={styles.feedbackPrompt}>Was this article helpful to you?</span>
              <div className={styles.feedbackButtons}>
                <button type="button" className={styles.btnPill} onClick={() => alert('Thank you for your feedback!')}>
                  <FaCheckCircle color="#16a34a" /> Yes
                </button>
                <button type="button" className={styles.btnPill} onClick={() => alert('Thank you, we will improve this document.')}>
                  No
                </button>
              </div>
            </div>

            <div className={styles.shareGroup}>
              <button type="button" className={styles.actionBtn} onClick={handleShare}>
                <FaShareAlt /> {copied ? 'Link Copied!' : 'Share'}
              </button>
              <button type="button" className={styles.actionBtn} onClick={handlePrint}>
                <FaPrint /> Print
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className={styles.sidebarCol}>
          <div className={styles.sidebarStickyCard}>
            <h4 className={styles.sidebarTitle}>Related Articles & Policies</h4>
            <div className={styles.relatedList}>
              {relatedPages.map((relPage) => (
                <Link key={relPage.id} to={relPage.slug} className={styles.relatedItem}>
                  <div className={styles.relatedItemContent}>
                    <span className={styles.relatedCategory}>{relPage.category}</span>
                    <span className={styles.relatedTitle}>{relPage.title}</span>
                  </div>
                  <FaChevronRight size={11} className={styles.relatedArrow} />
                </Link>
              ))}
            </div>

            <hr className={styles.sidebarDivider} />

            <div className={styles.helpBox}>
              <h5 className={styles.helpBoxTitle}>Still need assistance?</h5>
              <p className={styles.helpBoxText}>
                Our specialized 24/7 guest & host customer support desk is available to assist you with active stays or security issues.
              </p>
              <Link to="/help" className={styles.helpBoxBtn}>
                Visit Help Centre
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
