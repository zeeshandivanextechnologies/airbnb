import React, { useState, useEffect } from 'react';
import styles from '../../components/styles/HostExperience.module.css';

const defaultFaqs = [
  {
    question: "Top questions",
    answer: "Here are some of the most frequently asked questions about hosting an Airbnb experience. Experiences are small-group activities led by passionate local hosts that immerse guests in unique cultures, skills, or adventures."
  },
  {
    question: "Hosting basics",
    answer: "Learn the basics of hosting an experience, including requirements and expectations. All experiences must offer expertise, insider access, and a connection with the host."
  },
  {
    question: "Application process",
    answer: "Find out how to submit your experience idea and what we look for in applications. Our review team evaluates quality standards, host background, and safety."
  },
  {
    question: "Licensing & insurance",
    answer: "Understand the local regulations, licensing, and insurance requirements for your activity. Hosts are protected under Airbnb's Experience Protection Insurance."
  }
];

function HostExperience() {
  const [openFaq, setOpenFaq] = useState(null);
  const [faqs, setFaqs] = useState(defaultFaqs);

  useEffect(() => {
    let isMounted = true;
    const fetchFaqs = async () => {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      try {
        const res = await fetch(`${baseUrl}/listings/intro-faqs?category=experience`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0 && isMounted) {
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

    fetchFaqs();
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
              Get paid to do <span className='d-lg-block d-sm-inline'>what you love</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Create a unique Airbnb Experience<br />for millions of guests.
            </p>
          </div>
          
          <div className="col-md-6 d-flex justify-content-center justify-content-md-end">
             <div className={styles.phoneContainer}>
                <video 
                  src="/experience_video_01.mp4" 
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
            Bring the best of your <span className='d-lg-block d-sm-inline'>city to life on Airbnb</span>
            </h2>
        <p className={styles.bestCitySubtitle}>
          Apply to join our marketplace of high-quality <span className='d-lg-block d-sm-inline'>experiences led by locals like you.</span>
        </p>

        <div className="row justify-content-center  pt-lg-3 pt-0">
          <div className="col-md-4 mb-4">
            <div className={styles.bestCityCard}>
              <img src="/experience_01.avif" alt="Horseback tours in Cusco" className={styles.bestCityImg} />
              <div className={styles.bestCityTextWrap}>
                <p className={styles.bestCityText}>Arnold leads horseback tours of Incan temples in Cusco</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className={styles.bestCityCard}>
              <img src="/experience_02.avif" alt="Car customisation in Los Angeles" className={styles.bestCityImg} />
              <div className={styles.bestCityTextWrap}>
                <p className={styles.bestCityText}>Ryan celebrates the art of car customisation in Los Angeles</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className={styles.bestCityCard}>
              <img src="/experience_03.avif" alt="Skate moves in Venice Beach" className={styles.bestCityImg} />
              <div className={styles.bestCityTextWrap}>
                <p className={styles.bestCityText}>Alicia shares skate moves on the boardwalk in Venice Beach</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Host one-of-a-kind section */}
      <div className="container pb-lg-5  pb-3">
        <h2 className={  `text-center ${styles.kindTitle}`}>Host one-of-a-kind <span className='d-lg-block d-sm-inline'>experiences of all kinds</span></h2>
        
        <div className="row justify-content-center mt-3" >
          
         <div className='col-lg-8'>
            <div className='row'>
                 <div className="col-md-6 mb-4">
            <div className="d-flex align-items-center">
              <img src="/kind_01.webp" alt="Show off your city" className={styles.kindIcon} />
              <div>
                <h4 className={styles.kindItemTitle}>Show off your city</h4>
                <p className={styles.kindItemDesc}>Lead unique tours of landmarks,<br/>museums or cultural hotspots.</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 mb-4">
            <div className="d-flex align-items-center">
              <img src="/kind_02.webp" alt="Share something tasty" className={styles.kindIcon} />
              <div>
                <h4 className={styles.kindItemTitle}>Share something tasty</h4>
                <p className={styles.kindItemDesc}>Host cooking classes, food<br/>tours or dining experiences.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="d-flex align-items-center">
              <img src="/kind_03.avif" alt="Lead an outdoor adventure" className={styles.kindIcon} />
              <div>
                <h4 className={styles.kindItemTitle}>Lead an outdoor adventure</h4>
                <p className={styles.kindItemDesc}>Guide nature hikes, water sports or<br/>wildlife expeditions.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="d-flex align-items-center">
              <img src="/kind_04.webp" alt="Celebrate the arts" className={styles.kindIcon} />
              <div>
                <h4 className={styles.kindItemTitle}>Celebrate the arts</h4>
                <p className={styles.kindItemDesc}>Explore galleries, shopping and<br/>fashion or run art workshops.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="d-flex align-items-center">
              <img src="/kind_05.webp" alt="Teach fitness and self-care" className={styles.kindIcon} />
              <div>
                <h4 className={styles.kindItemTitle}>Teach fitness and self-care</h4>
                <p className={styles.kindItemDesc}>Host workouts, wellness classes<br/>or beauty experiences.</p>
              </div>
            </div>
          </div>

            </div>

         </div>

        </div>
      </div>

      {/* Millions of Guests Section */}
      <div className="container pb-lg-5 pb-3 text-center">
        <h2 className={styles.guestsTitle}>Millions of guests. <span className='d-lg-block d-sm-inline'>The most loved brand in travel.</span> </h2>
        <p className={styles.guestsSubtitle}>Airbnb is the best way to reach people looking to explore your city.</p>

        <div className={styles.facesContainer}>
          <img src="/face_03.avif" alt="Guest" className={`${styles.faceImg} ${styles.faceSmall}`} style={{ zIndex: 1 }} />
          <img src="/face_02.avif" alt="Guest" className={`${styles.faceImg} ${styles.faceMedium}`} style={{ zIndex: 2 }} />
          <img src="/face_01.avif" alt="Guest" className={`${styles.faceImg} ${styles.faceLarge}`} style={{ zIndex: 3 }} />
          <img src="/face_04.avif" alt="Guest" className={`${styles.faceImg} ${styles.faceMedium}`} style={{ zIndex: 2 }} />
          <img src="/face_05.avif" alt="Guest" className={`${styles.faceImg} ${styles.faceSmall}`} style={{ zIndex: 1 }} />
        </div>

        <div className="">
          <h3 className={styles.statTitle}>390 million guests</h3>
          <p className={styles.statSubtitle}>arrived in 2024</p>
          
          <hr className={styles.statDivider} />
          
          <h3 className={styles.statTitle}>$81 billion</h3>
          <p className={styles.statSubtitle}>spent on Airbnb in 2024</p>
        </div>

        <p className={styles.statDisclaimer}>
          390m includes new and returning guests.<br/>
          $81bn USD in gross bookings for stays and experiences.
        </p>
      </div>

      {/* Show up beautifully section */}
      <div className="container text-center ">
        <h2 className={styles.beautifulTitle}>Show up beautifully. <span className='d-lg-block d-sm-inline'>Get booked instantly.</span> </h2>
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
        <h2 className={styles.beautifulTitle}>The best experiences  <span className='d-lg-block d-sm-inline'>deserve  the best tools</span></h2>
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
      <div className="container py-lg-5 py-3 text-center ">
        <h2 className={styles.beautifulTitle}>The best experiences <span className='d-lg-block d-sm-inline'>deserve the best tools</span></h2>
        <p className={styles.beautifulSubtitle}>Your reservations, calendar, messages<span className='d-lg-block d-sm-inline'> and payments – all in the Airbnb app.</span></p>

        <div className="row justify-content-center ">
          <div className="col-lg-5 col-md-6 d-flex flex-column align-items-center mb-lg-5 mb-3">
            <div className={styles.toolsVideoBox}>
              <img 
                src="/adds_01.avif" 
                alt="Manage reservations"
                className={styles.toolsVideo}
              />
            </div>

            <div className={styles.hostContentBox}>
                <h4>Manage reservations</h4>
                <p>See who's coming and get relevant info to<br/>tailor your experience to each guest.</p>
            </div>
          </div>
          
          <div className="col-lg-5 col-md-6 d-flex flex-column align-items-center mb-lg-5 mb-3">
            <div className={styles.toolsVideoBox}>
              <img 
                src="/adds_02.avif" 
                alt="Simplify scheduling"
                className={styles.toolsVideo}
              />
            </div>

            <div className={styles.hostContentBox}>
                <h4>Simplify scheduling</h4>
                <p>Easily sync with Google Calendar, set<br/>availability and fill gaps in your day.</p>
            </div>
          </div>

          <div className="col-lg-5 col-md-6 d-flex flex-column align-items-center mb-lg-5 mb-3">
            <div className={styles.toolsVideoBox}>
              <img 
                src="/adds_03.avif" 
                alt="Simplify scheduling"
                className={styles.toolsVideo}
              />
            </div>

            <div className={styles.hostContentBox}>
                <h4>Simplify scheduling</h4>
                <p>Easily sync with Google Calendar, set<br/>availability and fill gaps in your day.</p>
            </div>
          </div>
          
          <div className="col-lg-5 col-md-6 d-flex flex-column align-items-center mb-lg-5 mb-3">
            <div className={styles.toolsVideoBox}>
              <img 
                src="/adds_04.avif" 
                alt="Simplify scheduling"
                className={styles.toolsVideo}
              />
            </div>

            <div className={styles.hostContentBox}>
                <h4>Simplify scheduling</h4>
                <p>Easily sync with Google Calendar, set<br/>availability and fill gaps in your day.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className={styles.faqSectionWrapper}>
        <div className="container py-lg-5 py-3">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <h2 className={styles.faqTitle}>Your questions, <span className='d-lg-block d-sm-inline'>answered</span> </h2>
              
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
