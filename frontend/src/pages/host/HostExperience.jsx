import React, { useState, useEffect } from 'react';
import styles from '../../components/styles/HostExperience.module.css';

function HostExperience() {
  const [openFaq, setOpenFaq] = useState(null);
  const [faqs, setFaqs] = useState([]);

  // Dynamic Content State loaded from Backend
  const [content, setContent] = useState({
    hero: {
      title: 'Get paid to do what you love',
      subtitle: 'Create a unique Airbnb Experience for millions of guests.',
      video: '/experience_video_01.mp4'
    },
    best_city: {
      title: 'Bring the best of your city to life on Airbnb',
      subtitle: 'Apply to join our marketplace of high-quality experiences led by locals like you.',
      cards: []
    },
    kinds: {
      title: 'Host one-of-a-kind experiences of all kinds',
      items: []
    },
    stats: {
      title: 'Millions of guests. The most loved brand in travel.',
      subtitle: 'Airbnb is the best way to reach people looking to explore your city.',
      guestsCount: '390 million guests',
      guestsYear: 'arrived in 2024',
      spendingCount: '$81 billion',
      spendingYear: 'spent on Airbnb in 2024',
      disclaimer: '390m includes new and returning guests. $81bn USD in gross bookings for stays and experiences.'
    },
    tools: {
      title: 'The best experiences deserve the best tools',
      subtitle: 'Your reservations, calendar, messages and payments – all in the Airbnb app.',
      cards: []
    }
  });

  useEffect(() => {
    let isMounted = true;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const fetchFaqs = async () => {
      try {
        const res = await fetch(`${baseUrl}/listings/intro-faqs?category=experience`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && isMounted) {
            setFaqs(data.data.map(item => ({
              question: item.question,
              answer: item.answer
            })));
          }
        }
      } catch (err) {
        console.error('Error fetching experience FAQs:', err);
      }
    };

    const fetchContent = async () => {
      try {
        const res = await fetch(`${baseUrl}/admin/auth/host-experience`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data && isMounted) {
            setContent(prev => ({
              ...prev,
              ...data.data
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching host experience content:', err);
      }
    };

    fetchFaqs();
    fetchContent();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className={styles.experienceContainer}>
      <div className="container py-lg-5 py-3">
        <div className="row align-items-center justify-content-center host-main-section" style={{ minHeight: '50vh' }}>
          
          <div className="col-md-5 text-center text-md-start mb-lg-5 mb-2 mb-md-0 pe-md-5">
            <h1 className={styles.heroTitle}>
              {content.hero.title}
            </h1>
            <p className={styles.heroSubtitle}>
              {content.hero.subtitle}
            </p>
          </div>
          
          <div className="col-md-6 d-flex justify-content-center justify-content-md-end">
             <div className={styles.phoneContainer}>
                <video 
                  src={content.hero.video || "/experience_video_01.mp4"} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className={styles.phoneVideo}
                />
             </div>
          </div>

        </div>
      </div>

      {/* Bring the best of your city section */}
      <div className="container py-lg-5 py-3 text-center mt-lg-4 mt-0">
        <h2 className={styles.bestCityTitle}>
          {content.best_city.title}
        </h2>
        <p className={styles.bestCitySubtitle}>
          {content.best_city.subtitle}
        </p>

        <div className="row justify-content-center pt-lg-3 pt-0">
          {(content.best_city.cards || []).map((card, i) => (
            <div key={i} className="col-md-4 mb-4">
              <div className={styles.bestCityCard}>
                <img src={card.img} alt={card.text} className={styles.bestCityImg} />
                <div className={styles.bestCityTextWrap}>
                  <p className={styles.bestCityText}>{card.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Host one-of-a-kind section */}
      <div className="container pb-lg-5 pb-3">
        <h2 className={`text-center ${styles.kindTitle}`}>{content.kinds.title}</h2>
        
        <div className="row justify-content-center mt-3">
          <div className="col-lg-8">
            <div className="row">
              {(content.kinds.items || []).map((item, idx) => (
                <div key={idx} className="col-md-6 mb-4">
                  <div className="d-flex align-items-center">
                    <img src={item.icon} alt={item.title} className={styles.kindIcon} />
                    <div>
                      <h4 className={styles.kindItemTitle}>{item.title}</h4>
                      <p className={styles.kindItemDesc}>{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Millions of Guests Section */}
      <div className="container pb-lg-5 pb-3 text-center">
        <h2 className={styles.guestsTitle}>{content.stats.title}</h2>
        <p className={styles.guestsSubtitle}>{content.stats.subtitle}</p>

        <div className={styles.facesContainer}>
          <img src="/face_03.avif" alt="Guest" className={`${styles.faceImg} ${styles.faceSmall}`} style={{ zIndex: 1 }} />
          <img src="/face_02.avif" alt="Guest" className={`${styles.faceImg} ${styles.faceMedium}`} style={{ zIndex: 2 }} />
          <img src="/face_01.avif" alt="Guest" className={`${styles.faceImg} ${styles.faceLarge}`} style={{ zIndex: 3 }} />
          <img src="/face_04.avif" alt="Guest" className={`${styles.faceImg} ${styles.faceMedium}`} style={{ zIndex: 2 }} />
          <img src="/face_05.avif" alt="Guest" className={`${styles.faceImg} ${styles.faceSmall}`} style={{ zIndex: 1 }} />
        </div>

        <div>
          <h3 className={styles.statTitle}>{content.stats.guestsCount}</h3>
          <p className={styles.statSubtitle}>{content.stats.guestsYear}</p>
          
          <hr className={styles.statDivider} />
          
          <h3 className={styles.statTitle}>{content.stats.spendingCount}</h3>
          <p className={styles.statSubtitle}>{content.stats.spendingYear}</p>
        </div>

        <p className={styles.statDisclaimer}>
          {content.stats.disclaimer}
        </p>
      </div>

      {/* Show up beautifully section */}
      <div className="container text-center">
        <h2 className={styles.beautifulTitle}>Show up beautifully. <span className='d-lg-block d-sm-inline'>Get booked instantly.</span></h2>
        <p className={styles.beautifulSubtitle}>Create a standout listing and fill your<br/>calendar with instant booking.</p>

        <div className="row justify-content-center mt-lg-5 mt-0">
          <div className="col-lg-6 col-md-8">
            <div className={styles.beautifulVideoContainer}>
              <video 
                src="/booking_03.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                className={styles.beautifulVideo}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Show up beautifully section (Videos) */}
      <div className="container py-lg-5 py-3 text-center mt-lg-5 mt-0">
        <h2 className={styles.beautifulTitle}>The best experiences <span className='d-lg-block d-sm-inline'>deserve the best tools</span></h2>
        <p className={styles.beautifulSubtitle}>Your reservations, calendar, messages <span className='d-lg-block d-sm-inline'>and payments – all in the Airbnb app.</span></p>

        <div className="row justify-content-center mt-lg-5 mt-3">
          <div className="col-lg-6 col-md-6 d-flex justify-content-end flex-column align-items-center mb-lg-0 mb-3">
            <div className={styles.beautifulVideoContainerSecond}>
              <video 
                src="/booking_02.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                className={styles.beautifulVideo}
              />
            </div>

            <div className={styles.hostContentBox}>
                <h4>Show up when guests plan</h4>
                <p>Your experience can appear to guests <br /> with upcoming stays in your city.</p>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 d-flex justify-content-center flex-column align-items-center mb-lg-0 mb-3">
            <div className={styles.beautifulVideoContainerSecond}>
              <video 
                src="/booking_01.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                className={styles.beautifulVideo}
              />
            </div>

            <div className={styles.hostContentBox}>
                <h4>Show up when guests plan</h4>
                <p>Your experience can appear to guests <br /> with upcoming stays in your city.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Best experiences section */}
      <div className="container py-lg-5 py-3 text-center">
        <h2 className={styles.beautifulTitle}>{content.tools.title}</h2>
        <p className={styles.beautifulSubtitle}>{content.tools.subtitle}</p>

        <div className="row justify-content-center">
          {(content.tools.cards || []).map((tool, tIdx) => (
            <div key={tIdx} className="col-lg-5 col-md-6 d-flex flex-column align-items-center mb-lg-5 mb-3">
              <div className={styles.toolsVideoBox}>
                <img 
                  src={tool.img} 
                  alt={tool.title}
                  className={styles.toolsVideo}
                />
              </div>

              <div className={styles.hostContentBox}>
                  <h4>{tool.title}</h4>
                  <p>{tool.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className={styles.faqSectionWrapper}>
        <div className="container py-lg-5 py-3">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <h2 className={styles.faqTitle}>Your questions, <span className='d-lg-block d-sm-inline'>answered</span></h2>
              
              <div className={styles.faqList}>
                {faqs.map((faq, index) => (
                  <div key={index} className={styles.faqItem}>
                    <button 
                      className={styles.faqButton} 
                      onClick={() => toggleFaq(index)}
                    >
                      <span className={styles.faqQuestion}>{faq.question}</span>
                      <span className={styles.faqIcon}>
                        {openFaq === index ? (
                          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: '3', overflow: 'visible' }}><path fill="none" d="M4 20L15.3 8.7a1 1 0 0 1 1.4 0L28 20"></path></svg>
                        ) : (
                          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: '3', overflow: 'visible' }}><path fill="none" d="m28 12-11.3 11.3a1 1 0 0 1-1.4 0L4 12"></path></svg>
                        )}
                      </span>
                    </button>
                    {openFaq === index && (
                      <div className={styles.faqAnswer}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HostExperience;
