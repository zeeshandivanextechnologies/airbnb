import React, { useState } from 'react';
import { 
  FaCog, 
  FaGlobe, 
  FaCalendarTimes, 
  FaCreditCard, 
  FaPercent, 
  FaSave, 
  FaCheck, 
  FaAirbnb, 
  FaEnvelope, 
  FaMobileAlt, 
  FaShieldAlt, 
  FaRupeeSign, 
  FaInfoCircle, 
  FaServer, 
  FaKey, 
  FaLock 
} from 'react-icons/fa';
import styles from './styles/Settings.module.css';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'cancellation' | 'gateways' | 'tax'
  const [saveToast, setSaveToast] = useState(false);

  // 1. General Branding & Localization State
  const [generalConfig, setGeneralConfig] = useState({
    siteName: 'Airbnb India',
    tagline: 'Vacation Homes & Experiences',
    supportEmail: 'support@airbnb.co.in',
    contactPhone: '+91 80 4567 8900',
    defaultCurrency: 'INR (₹)',
    currencySymbol: '₹',
    defaultLanguage: 'English (India)',
    timeZone: 'Asia/Kolkata (IST +5:30)',
    siteLogoText: 'Airbnb',
    maintenanceMode: false
  });

  // 2. Cancellation Policy State
  const [cancellationPolicies, setCancellationPolicies] = useState({
    defaultHostPolicy: 'Flexible',
    flexibleCutoffHours: 24,
    flexibleRefundPercent: 100,
    moderateCutoffDays: 5,
    moderateRefundPercent: 100,
    strictCutoffDays: 14,
    strictRefundPercent: 50,
    extenuatingCircumstancesEnabled: true,
    cleaningFeeRefundable: true
  });

  // 3. Email, SMS & Payment Gateway Settings State
  const [gatewaysConfig, setGatewaysConfig] = useState({
    // Payment Gateways
    razorpayEnabled: true,
    razorpayKeyId: 'rzp_live_9a8B7c6D5e4F3g',
    razorpaySecret: '••••••••••••••••••••••••',
    stripeEnabled: true,
    stripePublishableKey: 'pk_live_51M0abcde9876xyz',
    stripeWebhookSecret: '••••••••••••••••••••••••',
    upiDirectEnabled: true,
    cashOnArrivalAllowed: false,
    // Email Provider (SMTP / SendGrid)
    emailProvider: 'SendGrid Web API',
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: '587',
    senderEmail: 'noreply@airbnb.internal',
    senderName: 'Airbnb Automated Notifications',
    emailApiKey: 'SG.live_key_9876543210',
    // SMS / OTP Provider (Twilio / Gupshup)
    smsProvider: 'Twilio India SMS Gateway',
    smsAccountSid: 'AC_twilio_live_9823401294',
    smsAuthToken: '••••••••••••••••••••••••',
    otpExpiryMinutes: 10,
    whatsappAlertsEnabled: true
  });

  // 4. Tax & Regulatory Settings State
  const [taxConfig, setTaxConfig] = useState({
    gstRate: 18,
    gstThresholdSlab: 7500, // Stays above 7500 per night
    lowTierGstRate: 12,    // Stays below 7500 per night
    tdsRateHost: 1,        // Section 194-O (1% TDS on E-commerce operators)
    panRequiredForHosts: true,
    hsnSacCode: '996311',  // SAC Code for Hotel, Homestay & Accommodation
    gstinNumber: '29AAACA1234A1Z5',
    taxInvoiceAutoGenerate: true,
    tcsRate: 1             // 1% TCS under GST
  });

  const handleSaveSettings = (e) => {
    if (e) e.preventDefault();
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
    }, 4000);
  };

  return (
    <div className="container-fluid p-0">
      {/* 4 Summary Stat Cards with Bootstrap Grid */}
      <div className="row g-3 mb-4">
        {/* Card 1: Default Currency & Locale */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Locale & Currency</span>
              <div className={styles.statIconBox} style={{ background: '#eff6ff', color: '#2563eb' }}>
                <FaGlobe />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>INR (₹)</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
                  <FaCheck size={8} /> Active Primary
                </span>
                <span className={styles.statSubtext}>{generalConfig.defaultLanguage}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Cancellation Policy */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Cancellation Tier</span>
              <div className={styles.statIconBox} style={{ background: '#fff1f2', color: '#ff385c' }}>
                <FaCalendarTimes />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>3 Tiers</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgePink}`}>
                  Flexible • Moderate • Strict
                </span>
                <span className={styles.statSubtext}>AirCover Protected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Active Gateways */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Payment Gateways</span>
              <div className={styles.statIconBox} style={{ background: '#eaf8ee', color: '#16a34a' }}>
                <FaCreditCard />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>Razorpay + UPI</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgeSuccess}`}>
                  Live Mode
                </span>
                <span className={styles.statSubtext}>Stripe + Twilio Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Tax GST/TDS Setup */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Tax Compliance</span>
              <div className={styles.statIconBox} style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                <FaPercent />
              </div>
            </div>
            <div>
              <div className={styles.statValue}>18% GST</div>
              <div className={styles.statFooter}>
                <span className={`${styles.badgeTrend} ${styles.badgePurple}`}>
                  1% TDS Sec 194-O
                </span>
                <span className={styles.statSubtext}>Auto GST Invoicing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings Panel */}
      <div className={styles.mainCard}>
        {/* Card Header & Tabs */}
        <div className={styles.cardHeader}>
          <div className={styles.headerTitles}>
            <h2 className={styles.title}>
              <FaCog style={{ color: '#ff385c', fontSize: '20px' }} />
              Platform System Settings
            </h2>
            <p className={styles.subtitle}>
              Global site configuration, cancellation policies, email/SMS/payment integrations aur GST/TDS tax settings configure karein.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className={styles.tabGroup}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'general' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <FaGlobe size={12} />
              General Branding & Locale
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'cancellation' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('cancellation')}
            >
              <FaCalendarTimes size={12} />
              Cancellation Policies
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'gateways' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('gateways')}
            >
              <FaCreditCard size={12} />
              Email, SMS & Gateways
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'tax' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('tax')}
            >
              <FaPercent size={12} />
              GST & Tax Compliance
            </button>
          </div>
        </div>

        {/* Save Toast Notification */}
        {saveToast && (
          <div className={styles.saveAlert}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaCheck />
              <span>
                <strong>System Settings Updated Successfully:</strong> All platform configurations have been committed to live database.
              </span>
            </div>
            <button 
              type="button" 
              style={{ background: 'transparent', border: 'none', color: '#065f46', cursor: 'pointer' }}
              onClick={() => setSaveToast(false)}
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSaveSettings}>
          {/* =========================================================
              TAB 1: GENERAL BRANDING, LOGO, CURRENCY & LANGUAGE
              ========================================================= */}
          {activeTab === 'general' && (
            <div>
              {/* Section 1: Brand Identity */}
              <div className={styles.settingsSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3 className={styles.sectionTitle}>
                      <FaAirbnb style={{ color: '#ff385c' }} />
                      Site Branding & Identity
                    </h3>
                    <div className={styles.sectionDesc}>
                      Customer-facing platform title, logo branding, and contact credentials.
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Platform Name *</label>
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      value={generalConfig.siteName}
                      onChange={(e) => setGeneralConfig({ ...generalConfig, siteName: e.target.value })}
                      required
                    />
                    <div className={styles.helpText}>Displayed in browser titles, meta headers, and invoices.</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Brand Slogan / Tagline</label>
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      value={generalConfig.tagline}
                      onChange={(e) => setGeneralConfig({ ...generalConfig, tagline: e.target.value })}
                    />
                    <div className={styles.helpText}>Primary headline for homepage search banners.</div>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Official Support Email *</label>
                    <input 
                      type="email" 
                      className={styles.formInput} 
                      value={generalConfig.supportEmail}
                      onChange={(e) => setGeneralConfig({ ...generalConfig, supportEmail: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Toll-Free Customer Support Phone</label>
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      value={generalConfig.contactPhone}
                      onChange={(e) => setGeneralConfig({ ...generalConfig, contactPhone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Currency & Localization */}
              <div className={styles.settingsSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3 className={styles.sectionTitle}>
                      <FaGlobe style={{ color: '#2563eb' }} />
                      Currency, Language & Timezone
                    </h3>
                    <div className={styles.sectionDesc}>
                      Set default monetary unit and regional localization options for guest bookings.
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-4">
                    <label className={styles.formLabel}>Default Currency</label>
                    <select 
                      className={styles.formSelect}
                      value={generalConfig.defaultCurrency}
                      onChange={(e) => setGeneralConfig({ ...generalConfig, defaultCurrency: e.target.value })}
                    >
                      <option value="INR (₹)">INR - Indian Rupee (₹)</option>
                      <option value="USD ($)">USD - US Dollar ($)</option>
                      <option value="EUR (€)">EUR - Euro (€)</option>
                      <option value="GBP (£)">GBP - British Pound (£)</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-4">
                    <label className={styles.formLabel}>Default Language</label>
                    <select 
                      className={styles.formSelect}
                      value={generalConfig.defaultLanguage}
                      onChange={(e) => setGeneralConfig({ ...generalConfig, defaultLanguage: e.target.value })}
                    >
                      <option value="English (India)">English (India)</option>
                      <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
                      <option value="Bengali (বাংলা)">Bengali (বাংলা)</option>
                      <option value="Marathi (मराठी)">Marathi (मराठी)</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-4">
                    <label className={styles.formLabel}>Platform Timezone</label>
                    <select 
                      className={styles.formSelect}
                      value={generalConfig.timeZone}
                      onChange={(e) => setGeneralConfig({ ...generalConfig, timeZone: e.target.value })}
                    >
                      <option value="Asia/Kolkata (IST +5:30)">Asia/Kolkata (IST +5:30)</option>
                      <option value="UTC (Coordinated Universal Time)">UTC (+0:00)</option>
                    </select>
                  </div>
                </div>

                {/* Maintenance Toggle */}
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className={styles.toggleCard}>
                      <div>
                        <div className={styles.toggleLabel}>Maintenance Mode</div>
                        <div className={styles.toggleSub}>Temporary lockout with friendly maintenance notice for guests.</div>
                      </div>
                      <label className={styles.switch}>
                        <input 
                          type="checkbox" 
                          checked={generalConfig.maintenanceMode}
                          onChange={(e) => setGeneralConfig({ ...generalConfig, maintenanceMode: e.target.checked })}
                        />
                        <span className={styles.slider} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 2: CANCELLATION POLICIES
              ========================================================= */}
          {activeTab === 'cancellation' && (
            <div>
              <div className={styles.settingsSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3 className={styles.sectionTitle}>
                      <FaCalendarTimes style={{ color: '#ff385c' }} />
                      Standardized Cancellation Policy Tiers
                    </h3>
                    <div className={styles.sectionDesc}>
                      Hosts can choose one of these three standardized tiers for their listings.
                    </div>
                  </div>
                </div>

                {/* 3 Tier Cards (Bootstrap Grid) */}
                <div className="row g-3 mb-4">
                  {/* Tier 1: Flexible */}
                  <div className="col-12 col-md-4">
                    <div className={styles.policyCard}>
                      <span className={`${styles.policyBadge} ${styles.policyFlexible}`}>Flexible Policy</span>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', margin: '4px 0 8px 0' }}>
                        Free Cancellation up to 24h
                      </h4>
                      <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.45', margin: 0 }}>
                        Guests can cancel up to 24 hours before check-in and get a full 100% refund of the booking value.
                      </p>
                      <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                        <label className={styles.formLabel}>Cutoff Hours Before Check-in</label>
                        <input 
                          type="number" 
                          className={styles.formInput} 
                          value={cancellationPolicies.flexibleCutoffHours}
                          onChange={(e) => setCancellationPolicies({ ...cancellationPolicies, flexibleCutoffHours: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tier 2: Moderate */}
                  <div className="col-12 col-md-4">
                    <div className={styles.policyCard}>
                      <span className={`${styles.policyBadge} ${styles.policyModerate}`}>Moderate Policy</span>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', margin: '4px 0 8px 0' }}>
                        Free Cancellation up to 5 Days
                      </h4>
                      <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.45', margin: 0 }}>
                        Guests get 100% refund if cancelled at least 5 days prior to check-in. Non-refundable after that.
                      </p>
                      <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                        <label className={styles.formLabel}>Cutoff Days Prior</label>
                        <input 
                          type="number" 
                          className={styles.formInput} 
                          value={cancellationPolicies.moderateCutoffDays}
                          onChange={(e) => setCancellationPolicies({ ...cancellationPolicies, moderateCutoffDays: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tier 3: Strict */}
                  <div className="col-12 col-md-4">
                    <div className={styles.policyCard}>
                      <span className={`${styles.policyBadge} ${styles.policyStrict}`}>Strict Policy</span>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', margin: '4px 0 8px 0' }}>
                        50% Refund up to 14 Days
                      </h4>
                      <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.45', margin: 0 }}>
                        Best for high-demand luxury villas. Guests receive 50% refund if cancelled at least 14 days before check-in.
                      </p>
                      <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                        <label className={styles.formLabel}>Cutoff Days Prior</label>
                        <input 
                          type="number" 
                          className={styles.formInput} 
                          value={cancellationPolicies.strictCutoffDays}
                          onChange={(e) => setCancellationPolicies({ ...cancellationPolicies, strictCutoffDays: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Rules Toggles */}
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className={styles.toggleCard}>
                      <div>
                        <div className={styles.toggleLabel}>Extenuating Circumstances Override</div>
                        <div className={styles.toggleSub}>Full refund override for medical emergencies or declared natural disasters.</div>
                      </div>
                      <label className={styles.switch}>
                        <input 
                          type="checkbox" 
                          checked={cancellationPolicies.extenuatingCircumstancesEnabled}
                          onChange={(e) => setCancellationPolicies({ ...cancellationPolicies, extenuatingCircumstancesEnabled: e.target.checked })}
                        />
                        <span className={styles.slider} />
                      </label>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className={styles.toggleCard}>
                      <div>
                        <div className={styles.toggleLabel}>Always Refund Cleaning Fee</div>
                        <div className={styles.toggleSub}>Cleaning fee is always refunded 100% if guest cancels prior to check-in.</div>
                      </div>
                      <label className={styles.switch}>
                        <input 
                          type="checkbox" 
                          checked={cancellationPolicies.cleaningFeeRefundable}
                          onChange={(e) => setCancellationPolicies({ ...cancellationPolicies, cleaningFeeRefundable: e.target.checked })}
                        />
                        <span className={styles.slider} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 3: EMAIL, SMS & PAYMENT GATEWAY INTEGRATIONS
              ========================================================= */}
          {activeTab === 'gateways' && (
            <div>
              {/* Payment Gateways Section */}
              <div className={styles.settingsSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3 className={styles.sectionTitle}>
                      <FaCreditCard style={{ color: '#16a34a' }} />
                      Payment Gateways & UPI Processing
                    </h3>
                    <div className={styles.sectionDesc}>
                      Credentials for Razorpay, Stripe India, and Instant UPI QR rails.
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Razorpay Key ID (Live)</label>
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      value={gatewaysConfig.razorpayKeyId}
                      onChange={(e) => setGatewaysConfig({ ...gatewaysConfig, razorpayKeyId: e.target.value })}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Razorpay Key Secret</label>
                    <input 
                      type="password" 
                      className={styles.formInput} 
                      value={gatewaysConfig.razorpaySecret}
                      onChange={(e) => setGatewaysConfig({ ...gatewaysConfig, razorpaySecret: e.target.value })}
                    />
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Stripe Publishable Key (International Cards)</label>
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      value={gatewaysConfig.stripePublishableKey}
                      onChange={(e) => setGatewaysConfig({ ...gatewaysConfig, stripePublishableKey: e.target.value })}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <div className={styles.toggleCard}>
                      <div>
                        <div className={styles.toggleLabel}>Instant UPI Direct Checkout</div>
                        <div className={styles.toggleSub}>GPay, PhonePe, Paytm QR intent triggers for instant payments.</div>
                      </div>
                      <label className={styles.switch}>
                        <input 
                          type="checkbox" 
                          checked={gatewaysConfig.upiDirectEnabled}
                          onChange={(e) => setGatewaysConfig({ ...gatewaysConfig, upiDirectEnabled: e.target.checked })}
                        />
                        <span className={styles.slider} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email & SMS Service Config */}
              <div className={styles.settingsSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3 className={styles.sectionTitle}>
                      <FaEnvelope style={{ color: '#2563eb' }} />
                      Email & SMS Delivery Services
                    </h3>
                    <div className={styles.sectionDesc}>
                      Transactional email delivery and mobile OTP authentication channels.
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Email Dispatch Service</label>
                    <select 
                      className={styles.formSelect}
                      value={gatewaysConfig.emailProvider}
                      onChange={(e) => setGatewaysConfig({ ...gatewaysConfig, emailProvider: e.target.value })}
                    >
                      <option value="SendGrid Web API">SendGrid Web API (Recommended)</option>
                      <option value="Amazon SES">Amazon SES (Simple Email Service)</option>
                      <option value="Custom SMTP">Custom Corporate SMTP Relay</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Sender Email Address</label>
                    <input 
                      type="email" 
                      className={styles.formInput} 
                      value={gatewaysConfig.senderEmail}
                      onChange={(e) => setGatewaysConfig({ ...gatewaysConfig, senderEmail: e.target.value })}
                    />
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>SMS Gateway Provider</label>
                    <select 
                      className={styles.formSelect}
                      value={gatewaysConfig.smsProvider}
                      onChange={(e) => setGatewaysConfig({ ...gatewaysConfig, smsProvider: e.target.value })}
                    >
                      <option value="Twilio India SMS Gateway">Twilio India SMS Gateway</option>
                      <option value="Gupshup Enterprise Messaging">Gupshup Enterprise Messaging</option>
                      <option value="Karix DLT Approved SMS">Karix DLT Approved SMS</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className={styles.toggleCard}>
                      <div>
                        <div className={styles.toggleLabel}>WhatsApp Booking Confirmations</div>
                        <div className={styles.toggleSub}>Send instant reservation vouchers directly to guest WhatsApp.</div>
                      </div>
                      <label className={styles.switch}>
                        <input 
                          type="checkbox" 
                          checked={gatewaysConfig.whatsappAlertsEnabled}
                          onChange={(e) => setGatewaysConfig({ ...gatewaysConfig, whatsappAlertsEnabled: e.target.checked })}
                        />
                        <span className={styles.slider} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 4: GST & TAX COMPLIANCE SETTINGS
              ========================================================= */}
          {activeTab === 'tax' && (
            <div>
              <div className={styles.settingsSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3 className={styles.sectionTitle}>
                      <FaPercent style={{ color: '#7c3aed' }} />
                      GST & Regulatory Tax Configuration
                    </h3>
                    <div className={styles.sectionDesc}>
                      Goods and Services Tax slabs and Income Tax TDS deductions as mandated by Indian tax authorities.
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-4">
                    <label className={styles.formLabel}>Standard Accommodation GST (%) *</label>
                    <input 
                      type="number" 
                      className={styles.formInput} 
                      value={taxConfig.gstRate}
                      onChange={(e) => setTaxConfig({ ...taxConfig, gstRate: Number(e.target.value) })}
                      required
                    />
                    <div className={styles.helpText}>Applicable for stays above ₹7,500/night (18%).</div>
                  </div>

                  <div className="col-12 col-md-4">
                    <label className={styles.formLabel}>Budget Stays GST (%) *</label>
                    <input 
                      type="number" 
                      className={styles.formInput} 
                      value={taxConfig.lowTierGstRate}
                      onChange={(e) => setTaxConfig({ ...taxConfig, lowTierGstRate: Number(e.target.value) })}
                      required
                    />
                    <div className={styles.helpText}>Applicable for room tariffs up to ₹7,500/night (12%).</div>
                  </div>

                  <div className="col-12 col-md-4">
                    <label className={styles.formLabel}>Host TDS Deducted (%) [Sec 194-O]</label>
                    <input 
                      type="number" 
                      className={styles.formInput} 
                      value={taxConfig.tdsRateHost}
                      onChange={(e) => setTaxConfig({ ...taxConfig, tdsRateHost: Number(e.target.value) })}
                      required
                    />
                    <div className={styles.helpText}>Mandatory 1% TDS deducted from host payouts.</div>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>Company GSTIN Registration Number *</label>
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      value={taxConfig.gstinNumber}
                      onChange={(e) => setTaxConfig({ ...taxConfig, gstinNumber: e.target.value })}
                      required
                    />
                    <div className={styles.helpText}>Printed on every printable tax invoice.</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className={styles.formLabel}>HSN / SAC Code for Accommodation</label>
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      value={taxConfig.hsnSacCode}
                      onChange={(e) => setTaxConfig({ ...taxConfig, hsnSacCode: e.target.value })}
                    />
                    <div className={styles.helpText}>SAC 996311 (Hotel & Homestay Services).</div>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className={styles.toggleCard}>
                      <div>
                        <div className={styles.toggleLabel}>Auto-Generate GST Tax Invoices</div>
                        <div className={styles.toggleSub}>Instantly create downloadable tax invoices upon guest payment completion.</div>
                      </div>
                      <label className={styles.switch}>
                        <input 
                          type="checkbox" 
                          checked={taxConfig.taxInvoiceAutoGenerate}
                          onChange={(e) => setTaxConfig({ ...taxConfig, taxInvoiceAutoGenerate: e.target.checked })}
                        />
                        <span className={styles.slider} />
                      </label>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className={styles.toggleCard}>
                      <div>
                        <div className={styles.toggleLabel}>Enforce Mandatory PAN for Host Payouts</div>
                        <div className={styles.toggleSub}>Hold payouts until host submits verified PAN to prevent 20% TDS penalty.</div>
                      </div>
                      <label className={styles.switch}>
                        <input 
                          type="checkbox" 
                          checked={taxConfig.panRequiredForHosts}
                          onChange={(e) => setTaxConfig({ ...taxConfig, panRequiredForHosts: e.target.checked })}
                        />
                        <span className={styles.slider} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Persistent Save Floating Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button 
              type="button" 
              className={styles.btnSecondary}
              onClick={() => alert('Settings changes reset to last saved state.')}
            >
              Discard Changes
            </button>
            <button type="submit" className={styles.btnPrimary}>
              <FaSave size={14} /> Save & Apply All Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
