import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaCheck } from 'react-icons/fa';
import { FiHome, FiCreditCard, FiShield, FiChevronLeft, FiChevronRight, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import styles from '../../components/styles/HostHome.module.css';

const HostHome = () => {
  const navigate = useNavigate();
  const [nights, setNights] = useState(7);
  const [faqExpanded, setFaqExpanded] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Jaipur');
  const [availableCities, setAvailableCities] = useState(['Jaipur', 'Goa', 'Udaipur', 'Mumbai', 'Manali', 'Gurugram']);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [basePrice, setBasePrice] = useState(3484);
  const sliderRef = useRef(null);

  // Fetch available cities and dynamic base price for selected city
  useEffect(() => {
    let isMounted = true;
    const fetchCityEstimate = async () => {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      try {
        const [citiesRes, estimateRes] = await Promise.all([
          fetch(`${baseUrl}/listings/cohosts/cities`).catch(() => null),
          fetch(`${baseUrl}/listings/earnings-estimate?city=${encodeURIComponent(selectedCity)}`).catch(() => null)
        ]);

        if (citiesRes && citiesRes.ok) {
          const cData = await citiesRes.json();
          if (cData.success && Array.isArray(cData.cities) && isMounted) {
            setAvailableCities(cData.cities);
          }
        }

        if (estimateRes && estimateRes.ok) {
          const eData = await estimateRes.json();
          if (eData.success && eData.basePrice && isMounted) {
            setBasePrice(Number(eData.basePrice));
          }
        }
      } catch (err) {
        console.error('Error fetching earnings estimate:', err);
      }
    };

    fetchCityEstimate();
    return () => {
      isMounted = false;
    };
  }, [selectedCity]);

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: direction === 'left' ? -350 : 350, behavior: 'smooth' });
    }
  };

  const totalEarnings = nights * basePrice;

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setIsCityDropdownOpen(false);
  };

  return (
    <>
      <div className={styles.hostHomeContainer}>
        <div className="container py-lg-5 py-3">
          <div className="row align-items-center justify-content-center" style={{ minHeight: '50vh' }}>

            <div className="col-lg-6 text-center d-flex flex-column align-items-center mb-5 mb-lg-0 pe-lg-5">
              <h1 className={styles.heroTitle}>
                Your home could<br />make <span className={styles.priceHighlight}>₹{totalEarnings.toLocaleString('en-IN')}</span><br />on Airbnb
              </h1>

              <div className={styles.earningsSubtitle}>
                <strong>{nights} {nights === 1 ? 'night' : 'nights'}</strong> · ₹{basePrice.toLocaleString('en-IN')}/night<br />
                <span className={styles.estimateLink} style={{ cursor: 'pointer' }} onClick={() => navigate('/become-host')}>
                  Learn how we estimate earnings
                </span>
              </div>

              <div className={styles.sliderWrapper}>
                <input
                  type="range"
                  className={styles.rangeSlider}
                  min="1"
                  max="30"
                  value={nights}
                  onChange={(e) => setNights(Number(e.target.value))}
                  style={{ background: `linear-gradient(to right, #e51d53 ${(nights - 1) / 29 * 100}%, #dddddd ${(nights - 1) / 29 * 100}%)` }}
                />
              </div>

              {/* Dynamic City Search Pill */}
              <div style={{ position: 'relative', width: 'auto' }}>
                <div 
                  className={styles.searchPill}
                  onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                >
                  <FaSearch className={styles.searchIcon} />
                  <div className={styles.searchTextWrapper}>
                    <span className={styles.searchMainText}>{selectedCity}</span>
                    <span>·</span>
                    <span className={styles.searchSubText}>Entire place · 2 bedrooms</span>
                  </div>
                </div>

                {isCityDropdownOpen && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      right: '0',
                      marginTop: '8px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #ebebeb',
                      borderRadius: '16px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      zIndex: 100,
                      maxHeight: '220px',
                      overflowY: 'auto',
                      textAlign: 'left'
                    }}
                  >
                    {availableCities.map((city) => (
                      <div
                        key={city}
                        onClick={() => handleCitySelect(city)}
                        style={{
                          padding: '12px 20px',
                          cursor: 'pointer',
                          fontWeight: selectedCity === city ? '700' : '500',
                          color: selectedCity === city ? '#e51d53' : '#222222',
                          backgroundColor: selectedCity === city ? '#fff5f7' : 'transparent',
                          transition: 'background-color 0.15s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f7f7f7'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = selectedCity === city ? '#fff5f7' : 'transparent'; }}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-6 d-flex justify-content-center">
              <div className={styles.mapContainer}>
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedCity)}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Google Map ${selectedCity}`}
                ></iframe>
              </div>
            </div>

          </div>

          {/* Banner Section */}
          <div className="row justify-content-center py-5">
            <div className="col-lg-8">
              <div className={styles.bannerContainer}>
                <div className={styles.bannerContent}>
                  <div className={styles.bannerLeft}>
                    <img
                      src="/hosting-taking.avif"
                      alt="Superhosts"
                      className={styles.bannerImage}
                      style={{ objectFit: 'cover' }}
                    />
                    <div className={styles.bannerTextWrap}>
                      <h3 className={styles.bannerTitle}>Curious about hosting?</h3>
                      <p className={styles.bannerSubText}>Get helpful tips from Airbnb specialists.</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className={styles.bannerBtn}
                    onClick={() => navigate('/hosting/intro-to-host')}
                  >
                    Let's talk
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Join Millions Section */}
          <div className={styles.joinSection}>
            <h2 className={styles.joinSectionTitle}>Join millions of <span className="d-lg-block d-sm-inline">hosts on Airbnb</span> </h2>

            <div className="row text-center ">
              <div className="col-md-4 mb-3 d-flex flex-column align-items-center">
                <div className={styles.featureIconWrap}>
                  <FiHome className={styles.featureIcon} />
                </div>
                <h4 className={styles.featureTitle}>It’s easy</h4>
                <p className={styles.featureDesc}>Create a listing in just a few steps, and get 1:1 support from experienced hosts at any time.</p>
              </div>

              <div className="col-md-4 mb-3 d-flex flex-column align-items-center">
                <div className={styles.featureIconWrap}>
                  <FiCreditCard className={styles.featureIcon} />
                </div>
                <h4 className={styles.featureTitle}>It’s worth it</h4>
                <p className={styles.featureDesc}>Getting started is free. You set your price, and we only collect a fee after you've got paid.</p>
              </div>

              <div className="col-md-4 mb-3 d-flex flex-column align-items-center">
                <div className={styles.featureIconWrap}>
                  <FiShield className={styles.featureIcon} />
                </div>
                <h4 className={styles.featureTitle}>You’re protected</h4>
                <p className={styles.featureDesc}>Peace of mind for your home and belongings every time you host on Airbnb.</p>
              </div>
            </div>
          </div>
        </div>

        {/* AirCover Section */}
        <div className="container pb-lg-5 pb-3 text-center">
          <div className="d-flex justify-content-center mb-3">
            <img
              src="/air-cover.avif"
              alt="AirCover"
              height="40"
              width="150"
            />
          </div>
          <h2 className={styles.aircoverTitle}>When you host, <span className="d-lg-block d-sm-inline">you're protected</span> </h2>
          <p className={styles.aircoverSubtitle}>Top-to-bottom protection, <span className="d-lg-block d-sm-inline"> included every time you host.</span> </p>

          <div className="row justify-content-center">
            <div className="col-lg-8">

              <div className={styles.aircoverListItem}>
                <span className={styles.aircoverListText}>Up to $3m USD damage protection</span>
                <FaCheck className={styles.aircoverCheckIcon} />
              </div>

              <div className={styles.aircoverListItem}>
                <span className={styles.aircoverListText}>Up to $1m USD liability insurance</span>
                <FaCheck className={styles.aircoverCheckIcon} />
              </div>

              <div className={styles.aircoverListItem}>
                <span className={styles.aircoverListText}>24-hour safety line</span>
                <FaCheck className={styles.aircoverCheckIcon} />
              </div>

              <p className={styles.aircoverDisclaimer}>
                Host Damage Protection reimburses for certain guest damages during Airbnb stays. It's not insurance and may apply if guests don't pay. Liability insurance is provided by 3rd parties. Check details and exclusions.
              </p>

              <button 
                type="button" 
                className={styles.aircoverBtn}
                onClick={() => navigate('/hosting/intro-to-host')}
              >
                Learn about AirCover
              </button>
            </div>
          </div>

          {/* Additional safeguards */}
          <div className="row justify-content-center ">
            <div className="col-lg-8">
              <h4 className={styles.safeguardsTitle}>Plus additional safeguards and features:</h4>
              <div className="row">
                <div className="col-md-6 d-flex flex-column align-items-center px-4 mb-5 mb-md-0">
                  <img src="/home-right.avif" alt="Guest identity verification" className={styles.safeguardIcon} />
                  <h5 className={styles.safeguardSubtitle}>Guest identity verification</h5>
                  <p className={styles.safeguardDesc}>Airbnb's processes help ensure booking guests are genuine.</p>
                </div>
                <div className="col-md-6 d-flex flex-column align-items-center px-4">
                  <img src="/home-star.avif" alt="Profiles & reviews" className={styles.safeguardIcon} />
                  <h5 className={styles.safeguardSubtitle}>Profiles & reviews</h5>
                  <p className={styles.safeguardDesc}>View info, ratings and past trips for every guest that books.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Great on Airbnb Section */}
        <div className="container text-center py-3">
          <h2 className={styles.greatOnAirbnbTitle}>Your place looks <span className="d-lg-block d-sm-inline">great on Airbnb</span> </h2>

          <div className="row justify-content-center py-lg-3 py-0">
            <div className="col-md-5 d-flex flex-column align-items-center">
              <img src="/airbnb-look_01.avif" alt="Beautiful listings made easy" className={styles.greatImage} />
              <div className="mt-4 px-3">
                <h4 className={styles.greatSubtitle}>Beautiful listings made easy</h4>
                <p className={styles.greatDesc}>Your photos, amenities and unique features, showcased automatically.</p>
              </div>
            </div>

            <div className="col-md-5 d-flex flex-column align-items-center">
              <img src="/airbnb-look_02.avif" alt="Show up where guests book" className={styles.greatImage} />
              <div className="mt-4 px-3">
                <h4 className={styles.greatSubtitle}>Show up where guests book</h4>
                <p className={styles.greatDesc}>Your listing is smartly served to guests looking to stay in your city.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ & Slider Section */}
      <div className="container">
        <h2 className={styles.faqMainTitle}>Your questions, <span className="d-lg-block d-sm-inline">answered</span> </h2>

        <div className="row justify-content-center mt-lg-5 mt-0">
          <div className="col-lg-8">

            {/* Slider Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className={styles.sliderSectionTitle}>Top questions</h4>
              <div className={styles.sliderControls}>
                <button type="button" className={styles.sliderBtn} onClick={() => scrollSlider('left')}><FiChevronLeft /></button>
                <button type="button" className={styles.sliderBtn} onClick={() => scrollSlider('right')}><FiChevronRight /></button>
              </div>
            </div>

            {/* Slider Container */}
            <div className={styles.sliderContainer} ref={sliderRef}>
              <div className={styles.sliderCard}>
                <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop" alt="Is my place right for Airbnb?" className={styles.sliderImg} />
                <p className={styles.sliderCardTitle}>Is my place right for Airbnb?</p>
              </div>
              <div className={styles.sliderCard}>
                <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400&auto=format&fit=crop" alt="What about safety?" className={styles.sliderImg} />
                <p className={styles.sliderCardTitle}>How does hosting work?</p>
              </div>
              <div className={styles.sliderCard}>
                <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop" alt="How do I get started?" className={styles.sliderImg} />
                <p className={styles.sliderCardTitle}>How do I get started?</p>
              </div>
              <div className={styles.sliderCard}>
                <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=400&auto=format&fit=crop" alt="How do I earn money?" className={styles.sliderImg} />
                <p className={styles.sliderCardTitle}>How do I earn money?</p>
              </div>
              <div className={styles.sliderCard}>
                <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400&auto=format&fit=crop" alt="What about safety?" className={styles.sliderImg} />
                <p className={styles.sliderCardTitle}>What about safety?</p>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className={styles.faqAccordionWrap}>
              <div className={styles.faqAccordionHeader} onClick={() => setFaqExpanded(!faqExpanded)} style={{ cursor: 'pointer' }}>
                <h4 className={styles.faqSectionTitle}>Hosting basics</h4>
                {faqExpanded ? <FiChevronUp className={styles.faqIcon} /> : <FiChevronDown className={styles.faqIcon} />}
              </div>

              {faqExpanded && (
                <div className={styles.faqContent}>
                  <div className={styles.faqItem}>
                    <h5 className={styles.faqItemTitle}>What are Airbnb's fees?</h5>
                    <p className={styles.faqItemDesc}>
                      It's free to create a listing, and Airbnb typically collects a service fee of 3% of the reservation subtotal once you get paid. In many areas, Airbnb automatically collects and pays sales and tourism taxes on your behalf. <a href="#" className={styles.faqLink}>Learn more about fees.</a>
                    </p>
                  </div>

                  <div className={styles.faqItem}>
                    <h5 className={styles.faqItemTitle}>Any tips on being a great host?</h5>
                    <p className={styles.faqItemDesc}>
                      From sharing a list of your favourite local places to responding quickly to guest messages, there are lots of ways to be an excellent host. <a href="#" className={styles.faqLink}>Get more hosting tips.</a>
                    </p>
                  </div>

                  <div className={styles.faqItem}>
                    <h5 className={styles.faqItemTitle}>What if I have other questions?</h5>
                    <p className={styles.faqItemDesc}>
                      Local hosts are a great source for information and insights. We can connect you with an experienced Airbnb host in your area who may be able to answer additional questions. <a href="#" className={styles.faqLink}>Ask a host.</a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="container py-lg-5 py-3 text-center ">
        <h3 className={styles.footerCtaTitle}>Still have questions?</h3>
        <p className={styles.footerCtaDesc}>Get answers from an experienced local host.</p>
        <button 
          type="button" 
          className={styles.footerCtaBtn}
          onClick={() => navigate('/find-cost-host')}
        >
          Ask a host
        </button>
      </div>
    </>
  );
};

export default HostHome;
// Triggering Vite HMR reload
