import React, { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import styles from '../../components/styles/IntroToHost.module.css';

const defaultWebinarList = [
  { country: "Australia & New Zealand", language: "English", buttonText: "View webinars", zoom_link: "https://zoom.us" },
  { country: "Brasil", language: "Português", buttonText: "Ver webinarios", zoom_link: "https://zoom.us" },
  { country: "Canada", language: "English and French", buttonText: "View webinars", zoom_link: "https://zoom.us" },
  { country: "España", language: "Español", buttonText: "Ver webinarios", zoom_link: "https://zoom.us" },
  { country: "France", language: "Français", buttonText: "Voir les webinaires", zoom_link: "https://zoom.us" },
  { country: "Germany, Austria & Switzerland", language: "Deutsch", buttonText: "Webinare ansehen", zoom_link: "https://zoom.us" },
  { country: "Greece", language: "Ελληνικά", buttonText: "Προβολή webinars", zoom_link: "https://zoom.us" },
  { country: "Italia", language: "Italiano", buttonText: "Visualizza i webinar", zoom_link: "https://zoom.us" },
  { country: "Japan", language: "日本語", buttonText: "ウェビナーを見る", zoom_link: "https://zoom.us" },
  { country: "Mexico", language: "Español", buttonText: "Ver webinarios", zoom_link: "https://zoom.us" },
  { country: "Nordics", language: "English", buttonText: "View webinars", zoom_link: "https://zoom.us" },
  { country: "United Kingdom & Ireland", language: "English", buttonText: "View webinars", zoom_link: "https://zoom.us" },
  { country: "United States", language: "English", buttonText: "View webinars", zoom_link: "https://zoom.us" },
  { country: "United States", language: "Español", buttonText: "Ver webinarios", zoom_link: "https://zoom.us" }
];

const defaultFaqs = [
  {
    question: "What is a Superhost Ambassador?",
    answer: "Superhost Ambassadors are experienced hosts who help new hosts get started. They can offer one-on-one guidance, tips, and support during your first hosting journey."
  },
  {
    question: "How do I join a webinar?",
    answer: "Simply click the 'View webinars' button for your region above. You'll be directed to a Zoom site where you can register and attend the session."
  },
  {
    question: "Is there any cost to attend?",
    answer: "No, all introductory webinars presented by Superhost Ambassadors are completely free of charge."
  },
  {
    question: "What if I can't find a webinar in my language?",
    answer: "We are constantly expanding our resources. In the meantime, you can access the Airbnb Resource Centre for articles and videos in multiple languages."
  }
];

function IntroToHost() {
  const [openFaq, setOpenFaq] = useState(null);
  const [webinars, setWebinars] = useState(defaultWebinarList);
  const [faqs, setFaqs] = useState(defaultFaqs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchIntroData = async () => {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      try {
        const [webinarsRes, faqsRes] = await Promise.all([
          fetch(`${baseUrl}/listings/intro-webinars`).catch(() => null),
          fetch(`${baseUrl}/listings/intro-faqs`).catch(() => null)
        ]);

        if (webinarsRes && webinarsRes.ok) {
          const wData = await webinarsRes.json();
          if (wData.success && Array.isArray(wData.data) && wData.data.length > 0 && isMounted) {
            setWebinars(wData.data.map(item => ({
              country: item.country,
              language: item.language,
              buttonText: item.button_text || 'View webinars',
              zoom_link: item.zoom_link || 'https://zoom.us'
            })));
          }
        }

        if (faqsRes && faqsRes.ok) {
          const fData = await faqsRes.json();
          if (fData.success && Array.isArray(fData.data) && fData.data.length > 0 && isMounted) {
            setFaqs(fData.data.map(item => ({
              question: item.question,
              answer: item.answer
            })));
          }
        }
      } catch (err) {
        console.error('Error fetching intro data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchIntroData();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleWebinarClick = (item) => {
    const targetUrl = item.zoom_link || 'https://zoom.us';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={styles.introPage}>
      <div className="container">
        <div className={styles.headerContainer}>
          <div className={styles.topLine}></div>
          <h1 className={styles.mainTitle}>Intro to hosting on Airbnb</h1>
          <p className={styles.subTitle}>Learn the basics in a free webinar presented by Superhost Ambassadors.</p>
        </div>
        
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className={styles.imageContainer}>
              <img 
                src="/airbnb_intro_banner_01.avif" 
                alt="Intro to hosting webinar" 
                className={styles.bannerImage}
              />
            </div>
          </div>
        </div>

        {/* Webinar Section */}
        <div className={styles.webinarSection}>
          <div className={styles.webinarHeader}>
            <h2 className={styles.webinarTitle}>Sign up for a webinar</h2>
            <p className={styles.webinarSubTitle}>Selecting a link will take you to a Zoom site.</p>
          </div>
          
          <div className="row">
            {webinars.map((item, index) => (
              <div className="col-md-4" key={index}>
                <div className={styles.webinarCard}>
                  <div className={styles.countryName}>{item.country}</div>
                  <div className={styles.languageName}>{item.language}</div>
                  <button 
                    type="button" 
                    onClick={() => handleWebinarClick(item)}
                    className={styles.pinkBtn}
                  >
                    {item.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What to expect Section */}
        <div className={styles.expectSection}>
          <div className={styles.headerContainer}>
            <div className={styles.topLine}></div>
            <h2 className={styles.mainTitle}>What to expect</h2>
          </div>

          <div className="row align-items-center mb-lg-5 mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className={styles.expectTextWrapper}>
                <h3 className={styles.expectItemTitle}>Everything you need to get started</h3>
                <p className={styles.expectItemText}>
                  Experienced hosts called Superhost Ambassadors will walk you through hosting, from how to list your space to what to do before guests arrive.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <img 
                src="/expect_01.avif" 
                alt="What to expect" 
                className={styles.expectImage}
              />
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-md-6">
              <img 
                src="/expect_02.avif" 
                alt="What to expect" 
                className={styles.expectImage}
              />
            </div>

            <div className="col-md-6 mb-3 mb-md-0">
              <div className={styles.expectTextWrapperSecond}>
                <h3 className={styles.expectItemTitle}>Support beyond the webinar</h3>
                <p className={styles.expectItemText}>
                  The Superhost Ambassador who presents your webinar can also be your guide. They can provide free one-to-one support, help you set up your listing and give you hosting tips as you discover what it’s like to become a host.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Airbnb Resources FAQ Section */}
        <div className={styles.resourcesSection}>
          <div className="row">
            <div className="col-12 col-lg-6 mb-4 mb-lg-0">
              <h2 className={styles.resourcesTitle}>Airbnb resources</h2>
            </div>
            <div className="col-12 col-lg-6">
              <div className={styles.faqList}>
                {faqs.map((faq, index) => (
                  <div key={index} className={styles.faqItem}>
                    <button 
                      type="button"
                      className={styles.faqQuestion} 
                      onClick={() => toggleFaq(index)}
                    >
                      <span>{faq.question}</span>
                      <FaChevronDown 
                        className={`${styles.faqIcon} ${openFaq === index ? styles.faqIconOpen : ''}`} 
                      />
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

export default IntroToHost;