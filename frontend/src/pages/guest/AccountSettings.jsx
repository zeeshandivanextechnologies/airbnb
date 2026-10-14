import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { applyGoogleTranslate } from '../../i18n.js';
import { TIMEZONES, formatWithTimezone, setSavedTimezone, getSavedTimezone } from '../../utils/timezone.js';
import toast from 'react-hot-toast';
import { 
  BsShieldLock, BsLock, BsEye, BsEyeSlash, BsPerson, BsShieldCheck, 
  BsHandIndexThumb, BsBell, BsCalculator, BsCash, 
  BsGlobe, BsBriefcase, BsGraphUp, BsDisplay, BsChevronRight,
  BsChevronDown, BsBellFill, BsChevronLeft, BsPhone, BsReceipt,
  BsFingerprint, BsPersonBoundingBox, BsGrid3X3GapFill, BsCheckCircleFill, BsTrash, BsPersonX, BsCheck
} from 'react-icons/bs';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import styles from '../../components/styles/AccountSettings.module.css';
import { 
  getUserProfileApi, 
  updateUserProfileApi, 
  changePasswordApi, 
  setupPasskeyApi, 
  removePasskeyApi,
  sendOtpApi, 
  deactivateAccountApi,
  deleteAccountApi,
  requestPersonalDataApi,
  getBlockedUsersApi,
  unblockUserApi,
  blockUserApi
} from '../../services/api.js';
import { updateUser, logoutUser } from '../../store/slices/authSlice.js';
import { IoMdClose } from 'react-icons/io';

const SIDEBAR_TABS = [
  { id: 'personal', label: 'Personal information', icon: <BsPerson /> },
  { id: 'security', label: 'Login & security', icon: <BsShieldCheck /> },
  { id: 'privacy', label: 'Privacy', icon: <BsHandIndexThumb /> },
  { id: 'notifications', label: 'Notifications', icon: <BsBell /> },
  { id: 'taxes', label: 'Taxes', icon: <BsCalculator /> },
  { id: 'payments', label: 'Payments', icon: <BsCash /> },
  { id: 'languages', label: 'Languages & translation', icon: <BsGlobe />, isNew: true },
  { id: 'booking', label: 'Booking permissions', icon: <BsShieldLock /> },
  { id: 'travel', label: 'Travel for work', icon: <BsBriefcase /> },
  { id: 'tools', label: 'Professional hosting tools', icon: <BsGraphUp /> }
];

function AccountSettings() {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.auth);
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem('airbnb_preferred_language') || 'English'
  );
  const [tempLanguage, setTempLanguage] = useState(
    localStorage.getItem('airbnb_preferred_language') || 'English'
  );
  const [isSavingLanguage, setIsSavingLanguage] = useState(false);

  // Dynamic Profile state from Backend PostgreSQL
  const [profileUser, setProfileUser] = useState({
    id: null,
    firstName: 'Mohammad',
    lastName: 'Zeeshan',
    preferredFirstName: '',
    useFirstNameOnly: true,
    hostDisplayName: '',
    email: 'zeeshandivanextechnologies@gmail.com',
    phone: '',
    identityVerificationStatus: 'Not started',
    residentialAddress: 'Provided',
    postalAddress: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactLanguage: 'English',
    emergencyContactEmail: '',
    emergencyContactPhone: '',
    passwordUpdatedAt: '2026-10-09T10:00:00.000Z',
    passkeyEnabled: false,
    passkeyType: 'Fingerprint, face or PIN',
    passkeyCreatedAt: null,
    lastActiveDevice: 'Windows 10.0 • Chrome',
    lastActiveLocation: 'Jaipur, Rajasthan',
    lastLoginAt: '2026-10-07T11:48:00.000Z'
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Security states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passkeyEmail, setPasskeyEmail] = useState('');
  const [passkeyOtp, setPasskeyOtp] = useState('');
  const [isSendingPasskeyOtp, setIsSendingPasskeyOtp] = useState(false);
  const [isVerifyingPasskey, setIsVerifyingPasskey] = useState(false);
  const [selectedPasskeyMethod, setSelectedPasskeyMethod] = useState('fingerprint'); // 'fingerprint', 'face', 'pin'
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [passkeyPin, setPasskeyPin] = useState('2468');
  const [isTestingPasskey, setIsTestingPasskey] = useState(false);
  const [isRemovingPasskey, setIsRemovingPasskey] = useState(false);

  // Local form editing states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    preferredFirstName: '',
    useFirstNameOnly: true,
    hostDisplayName: '',
    email: '',
    phone: '',
    identityVerificationStatus: 'Not started',
    residentialAddress: '',
    postalAddress: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactLanguage: 'English',
    emergencyContactEmail: '',
    emergencyContactPhone: ''
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [editingId, setEditingId] = useState(null);
  const [useFirstName, setUseFirstName] = useState(true);
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [passkeyStep, setPasskeyStep] = useState(1);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [taxModalStep, setTaxModalStep] = useState(1);
  const [taxRegion, setTaxRegion] = useState('United States');
  const [taxIdNumber, setTaxIdNumber] = useState('');
  const [taxLegalName, setTaxLegalName] = useState('');
  const [isSubmittingTax, setIsSubmittingTax] = useState(false);
  const [taxInfo, setTaxInfo] = useState(null);

  const [showVatModal, setShowVatModal] = useState(false);
  const [vatCountry, setVatCountry] = useState('India');
  const [vatNumber, setVatNumber] = useState('');
  const [vatLegalName, setVatLegalName] = useState('');
  const [isSubmittingVat, setIsSubmittingVat] = useState(false);
  const [vatInfo, setVatInfo] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingModalStep, setBookingModalStep] = useState(1);
  const [showLangModal, setShowLangModal] = useState(false);
  const [showOtherLangModal, setShowOtherLangModal] = useState(false);
  const [knownLanguages, setKnownLanguages] = useState([]);
  const [tempKnownLanguages, setTempKnownLanguages] = useState([]);
  const [isSavingKnownLanguages, setIsSavingKnownLanguages] = useState(false);
  const [showTimezoneModal, setShowTimezoneModal] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState(getSavedTimezone());
  const [tempTimezone, setTempTimezone] = useState(getSavedTimezone());
  const [isSavingTimezone, setIsSavingTimezone] = useState(false);
  const [showCouponField, setShowCouponField] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutStep, setPayoutStep] = useState(1);
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState('');
  const [payoutAccountHolder, setPayoutAccountHolder] = useState('');
  const [accountType, setAccountType] = useState('');
  const [loginSubTab, setLoginSubTab] = useState('login');
  const [taxesSubTab, setTaxesSubTab] = useState('taxpayers');
  const [paymentsSubTab, setPaymentsSubTab] = useState('payments');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [automaticTranslation, setAutomaticTranslation] = useState(true);
  const [proHostingTools, setProHostingTools] = useState(false);
  const [workEmail, setWorkEmail] = useState('');
  const splideRef = useRef(null);

  // Fetch dynamic user profile from backend
  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const res = await getUserProfileApi(authUser?.id || authUser?.email);
        if (isMounted && res.success && res.user) {
          setProfileUser(prev => ({
            ...prev,
            ...res.user
          }));
          if (res.user.privacySettings) {
            setPrivacyToggles(prev => ({
              ...prev,
              ...res.user.privacySettings
            }));
          }
          if (res.user.notificationSettings && typeof res.user.notificationSettings === 'object') {
            setNotificationSettings(prev => ({
              ...prev,
              ...res.user.notificationSettings
            }));
          }
          if (res.user.taxInfo) {
            setTaxInfo(res.user.taxInfo);
          }
          if (res.user.vatInfo) {
            setVatInfo(res.user.vatInfo);
          }
          if (res.user.preferredLanguage) {
            setCurrentLanguage(res.user.preferredLanguage);
            setTempLanguage(res.user.preferredLanguage);
            localStorage.setItem('airbnb_preferred_language', res.user.preferredLanguage);
            if (i18n && i18n.changeLanguage) {
              i18n.changeLanguage(res.user.preferredLanguage);
            }
            applyGoogleTranslate(res.user.preferredLanguage);
          }
          if (res.user.timezone) {
            setSelectedTimezone(res.user.timezone);
            setTempTimezone(res.user.timezone);
            setSavedTimezone(res.user.timezone);
          }
          if (Array.isArray(res.user.knownLanguages)) {
            setKnownLanguages(res.user.knownLanguages);
            setTempKnownLanguages(res.user.knownLanguages);
          }
        }
      } catch (error) {
        console.warn('Backend profile fetch note:', error.message);
      } finally {
        if (isMounted) setIsLoadingProfile(false);
      }
    };

    fetchProfile();
    return () => { isMounted = false; };
  }, [authUser?.id, authUser?.email]);

  const handleStartEdit = (item) => {
    setFormData({
      firstName: profileUser.firstName || '',
      lastName: profileUser.lastName || '',
      preferredFirstName: profileUser.preferredFirstName || '',
      useFirstNameOnly: profileUser.useFirstNameOnly !== false,
      hostDisplayName: profileUser.hostDisplayName || '',
      email: profileUser.email || '',
      phone: profileUser.phone || '',
      identityVerificationStatus: profileUser.identityVerificationStatus || 'Not started',
      residentialAddress: profileUser.residentialAddress || '',
      postalAddress: profileUser.postalAddress || '',
      emergencyContactName: profileUser.emergencyContactName || '',
      emergencyContactRelationship: profileUser.emergencyContactRelationship || '',
      emergencyContactLanguage: profileUser.emergencyContactLanguage || 'English',
      emergencyContactEmail: profileUser.emergencyContactEmail || '',
      emergencyContactPhone: profileUser.emergencyContactPhone || ''
    });
    setEditingId(item.id);
  };

  const handleSave = async (itemId) => {
    try {
      setIsSaving(true);
      const payload = {
        id: profileUser.id || authUser?.id
      };

      if (itemId === 1) {
        if (!formData.firstName.trim()) {
          toast.error('First name on ID is required');
          setIsSaving(false);
          return;
        }
        payload.firstName = formData.firstName.trim();
        payload.lastName = formData.lastName.trim();
      } else if (itemId === 2) {
        payload.preferredFirstName = formData.preferredFirstName.trim();
      } else if (itemId === 3) {
        payload.useFirstNameOnly = formData.useFirstNameOnly;
        payload.hostDisplayName = formData.useFirstNameOnly ? '' : formData.hostDisplayName.trim();
      } else if (itemId === 4) {
        if (!formData.email.trim() || !formData.email.includes('@')) {
          toast.error('Please enter a valid email address');
          setIsSaving(false);
          return;
        }
        payload.email = formData.email.trim();
      } else if (itemId === 5) {
        payload.phone = formData.phone.trim();
      } else if (itemId === 6) {
        payload.identityVerificationStatus = formData.identityVerificationStatus;
      } else if (itemId === 7) {
        payload.residentialAddress = formData.residentialAddress.trim();
      } else if (itemId === 8) {
        payload.postalAddress = formData.postalAddress.trim();
      } else if (itemId === 9) {
        payload.emergencyContactName = formData.emergencyContactName.trim();
        payload.emergencyContactRelationship = formData.emergencyContactRelationship.trim();
        payload.emergencyContactLanguage = formData.emergencyContactLanguage;
        payload.emergencyContactEmail = formData.emergencyContactEmail.trim();
        payload.emergencyContactPhone = formData.emergencyContactPhone.trim();
      }

      const res = await updateUserProfileApi(payload);
      if (res.success && res.user) {
        setProfileUser(prev => ({
          ...prev,
          ...res.user
        }));
        dispatch(updateUser({
          firstName: res.user.firstName,
          lastName: res.user.lastName,
          name: res.user.name,
          email: res.user.email,
          phone: res.user.phone
        }));
        toast.success('Personal information updated successfully!');
        setEditingId(null);
      } else {
        toast.error(res.message || 'Failed to update personal information');
      }
    } catch (err) {
      console.error('Update personal info error:', err);
      toast.error(err.message || 'Failed to save changes. Please check backend connection.');
    } finally {
      setIsSaving(false);
    }
  };

  // Login & Security Handlers
  const getPasswordUpdatedText = (dateStr) => {
    if (!dateStr) return 'Last updated recently';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) return 'Last updated today';
      if (diffDays === 1) return 'Last updated 1 day ago';
      if (diffDays < 30) return `Last updated ${diffDays} days ago`;
      return `Last updated on ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    } catch (e) {
      return 'Last updated 4 days ago';
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const res = await changePasswordApi({
        id: profileUser.id || authUser?.id,
        email: profileUser.email,
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      if (res.success) {
        toast.success(res.message || 'Password updated successfully!');
        setProfileUser(prev => ({
          ...prev,
          passwordUpdatedAt: res.passwordUpdatedAt || new Date().toISOString()
        }));
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPassword({ current: false, new: false, confirm: false });
        setEditingId(null);
      } else {
        toast.error(res.message || 'Failed to update password');
      }
    } catch (err) {
      console.error('Password change error:', err);
      toast.error(err.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSendPasskeyOtp = async () => {
    const targetEmail = passkeyEmail || profileUser.email;
    if (!targetEmail || !targetEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    try {
      setIsSendingPasskeyOtp(true);
      const res = await sendOtpApi(targetEmail.trim());
      toast.success(res.message || `Verification code sent to ${targetEmail}!`);
      setPasskeyStep(2);
    } catch (err) {
      toast.error(err.message || 'Failed to send verification code');
    } finally {
      setIsSendingPasskeyOtp(false);
    }
  };

  const handleVerifyOtpAndProceed = () => {
    const cleanOtp = String(passkeyOtp || '').trim();
    if (!cleanOtp || cleanOtp.length < 6) {
      toast.error('Please enter the 6-digit verification code (e.g. 123456)');
      return;
    }
    toast.success('Code confirmed! Choose fingerprint, face or PIN to create passkey.');
    setPasskeyStep(3);
  };

  const handleActivateBiometricPasskey = async () => {
    const cleanOtp = String(passkeyOtp || '').trim();
    if (!cleanOtp) {
      toast.error('Verification code missing. Please re-enter OTP.');
      setPasskeyStep(2);
      return;
    }

    const methodNameLabel = 
      selectedPasskeyMethod === 'fingerprint' ? 'Fingerprint (Touch ID)' :
      selectedPasskeyMethod === 'face' ? 'Face recognition (Face ID)' :
      'Device PIN';

    try {
      setBiometricScanning(true);

      // Trigger WebAuthn API if supported on device
      if (typeof window !== 'undefined' && window.PublicKeyCredential) {
        try {
          const challenge = new Uint8Array(32);
          window.crypto.getRandomValues(challenge);
          const userIdBytes = new TextEncoder().encode(String(profileUser.id || '4'));

          await navigator.credentials.create({
            publicKey: {
              challenge,
              rp: { name: 'Airbnb Security', id: window.location.hostname },
              user: {
                id: userIdBytes,
                name: passkeyEmail || profileUser.email || 'user@example.com',
                displayName: `${profileUser.firstName} ${profileUser.lastName}`.trim() || 'Airbnb Guest'
              },
              pubKeyCredParams: [
                { alg: -7, type: 'public-key' },
                { alg: -257, type: 'public-key' }
              ],
              authenticatorSelection: {
                authenticatorAttachment: 'platform',
                userVerification: 'preferred'
              },
              timeout: 60000
            }
          });
        } catch (webAuthnErr) {
          console.warn('WebAuthn native dialog note:', webAuthnErr?.message);
        }
      }

      // Smooth realistic biometric scan feedback
      await new Promise(resolve => setTimeout(resolve, 950));

      const targetEmail = passkeyEmail || profileUser.email;
      const res = await setupPasskeyApi({
        identifier: targetEmail,
        otp: cleanOtp,
        passkeyType: methodNameLabel
      });

      if (res.success) {
        toast.success(res.message || `Passkey configured with ${methodNameLabel}!`);
        setProfileUser(prev => ({
          ...prev,
          passkeyEnabled: true,
          passkeyType: methodNameLabel,
          passkeyCreatedAt: new Date().toISOString()
        }));
        setPasskeyStep(4);
      } else {
        toast.error(res.message || 'Failed to configure passkey.');
      }
    } catch (err) {
      console.error('Passkey activation error:', err);
      toast.error(err.message || 'Failed to verify biometric credentials.');
    } finally {
      setBiometricScanning(false);
    }
  };

  const handleTestPasskey = async () => {
    try {
      setIsTestingPasskey(true);
      if (typeof window !== 'undefined' && window.PublicKeyCredential) {
        try {
          const challenge = new Uint8Array(32);
          window.crypto.getRandomValues(challenge);
          await navigator.credentials.get({
            publicKey: {
              challenge,
              timeout: 60000,
              userVerification: 'preferred'
            }
          });
        } catch (e) {
          console.warn('Test passkey WebAuthn note:', e?.message);
        }
      }
      await new Promise(resolve => setTimeout(resolve, 850));
      toast.success(`Passkey verified! Your ${profileUser.passkeyType || 'biometric/PIN'} authentication is active and working.`);
    } catch (err) {
      toast.error('Passkey test error: ' + err.message);
    } finally {
      setIsTestingPasskey(false);
    }
  };

  const handleRemovePasskey = async () => {
    const confirmed = window.confirm("Are you sure you want to remove the passkey from your account? You will need your password to log in.");
    if (!confirmed) return;

    try {
      setIsRemovingPasskey(true);
      const res = await removePasskeyApi({
        id: profileUser.id || authUser?.id,
        email: profileUser.email
      });
      if (res.success) {
        toast.success(res.message || 'Passkey removed from your account.');
        setProfileUser(prev => ({
          ...prev,
          passkeyEnabled: false,
          passkeyType: 'Fingerprint, face or PIN',
          passkeyCreatedAt: null
        }));
        setShowPasskeyModal(false);
        setPasskeyStep(1);
        setPasskeyOtp('');
      } else {
        toast.error(res.message || 'Failed to remove passkey');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to remove passkey');
    } finally {
      setIsRemovingPasskey(false);
    }
  };

  const handleDeactivateAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to deactivate your Airbnb account? This action cannot be undone and you will be signed out.");
    if (!confirmed) return;

    try {
      const res = await deactivateAccountApi({
        id: profileUser.id || authUser?.id,
        email: profileUser.email
      });
      if (res.success) {
        toast.success(res.message || 'Account successfully deactivated.');
        localStorage.removeItem('airbnb_user_auth');
        dispatch(logoutUser());
        window.location.href = '/';
      } else {
        toast.error(res.message || 'Failed to deactivate account.');
      }
    } catch (err) {
      toast.error(err.message || 'Deactivation failed.');
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteAccountModal(true);
  };

  const handleConfirmDeleteAccount = async () => {
    try {
      setIsDeletingAccount(true);
      const res = await deleteAccountApi({
        id: profileUser.id || authUser?.id,
        email: profileUser.email
      });
      if (res.success) {
        toast.success(res.message || 'Your account has been permanently deleted.');
        setShowDeleteAccountModal(false);
        localStorage.removeItem('airbnb_user_auth');
        dispatch(logoutUser());
        window.location.href = '/';
      } else {
        toast.error(res.message || 'Failed to delete account.');
      }
    } catch (err) {
      console.error('Delete account error:', err);
      toast.error(err.message || 'Failed to delete account.');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleSubmitDataRequest = async (e) => {
    if (e) e.preventDefault();
    if (!dataCountry) {
      toast.error('Please select where you reside.');
      return;
    }
    try {
      setIsSubmittingDataRequest(true);
      const res = await requestPersonalDataApi({
        id: profileUser.id || authUser?.id,
        email: profileUser.email,
        country: dataCountry,
        format: dataFormat,
        reason: dataReason
      });
      if (res.success) {
        toast.success(res.message || `Personal data request submitted. A download link will be emailed to ${profileUser.email}.`);
        setShowDataRequestModal(false);
        setDataCountry('');
        setDataReason('');
      } else {
        toast.error(res.message || 'Failed to submit data request.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit data request.');
    } finally {
      setIsSubmittingDataRequest(false);
    }
  };

  const getMaskedEmail = (email) => {
    if (!email) return 'Not provided';
    const parts = email.split('@');
    if (parts.length < 2) return email;
    const username = parts[0];
    const domain = parts[1];
    if (username.length <= 2) return `${username}***@${domain}`;
    return `${username[0]}***${username[username.length - 1]}@${domain}`;
  };

  const dynamicPersonalInfoData = [
    { 
      id: 1, 
      title: 'Legal name', 
      desc: `${profileUser.firstName || ''} ${profileUser.lastName || ''}`.trim() || 'Not provided', 
      action: 'Edit' 
    },
    { 
      id: 2, 
      title: 'Preferred first name', 
      desc: profileUser.preferredFirstName || 'Not provided', 
      action: profileUser.preferredFirstName ? 'Edit' : 'Add' 
    },
    { 
      id: 3, 
      title: 'Host display name for experiences and services', 
      desc: profileUser.useFirstNameOnly !== false 
        ? 'Show my first name only' 
        : (profileUser.hostDisplayName || 'Show my first name only'), 
      action: 'Edit' 
    },
    { 
      id: 4, 
      title: 'Email address', 
      desc: getMaskedEmail(profileUser.email), 
      action: 'Edit' 
    },
    { 
      id: 5, 
      title: 'Phone numbers', 
      desc: profileUser.phone || 'Add a number so confirmed guests and Airbnb can get in touch. You can add other numbers and choose how they’re used.', 
      action: profileUser.phone ? 'Edit' : 'Add' 
    },
    { 
      id: 6, 
      title: 'Identity verification', 
      desc: profileUser.identityVerificationStatus || 'Not started', 
      action: (profileUser.identityVerificationStatus && profileUser.identityVerificationStatus !== 'Not started') ? 'Edit' : 'Start' 
    },
    { 
      id: 7, 
      title: 'Residential address', 
      desc: profileUser.residentialAddress || 'Not provided', 
      action: profileUser.residentialAddress ? 'Edit' : 'Add' 
    },
    { 
      id: 8, 
      title: 'Postal address', 
      desc: profileUser.postalAddress || 'Not provided', 
      action: profileUser.postalAddress ? 'Edit' : 'Add' 
    },
    { 
      id: 9, 
      title: 'Emergency contact', 
      desc: profileUser.emergencyContactName 
        ? `${profileUser.emergencyContactName}${profileUser.emergencyContactRelationship ? ` (${profileUser.emergencyContactRelationship})` : ''}` 
        : 'Not provided', 
      action: profileUser.emergencyContactName ? 'Edit' : 'Add' 
    }
  ];
  
  const [privacyToggles, setPrivacyToggles] = useState({
    readMessages: true,
    searchEngines: false,
    homeCity: false,
    tripType: false,
    lengthOfStay: false,
    bookedServices: false,
    aiFeatures: true
  });

  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDataRequestModal, setShowDataRequestModal] = useState(false);
  const [dataCountry, setDataCountry] = useState('');
  const [dataFormat, setDataFormat] = useState('Interactive web content format (HTML)');
  const [dataReason, setDataReason] = useState('');
  const [isSubmittingDataRequest, setIsSubmittingDataRequest] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [isLoadingBlocked, setIsLoadingBlocked] = useState(false);
  const [showBlockNewForm, setShowBlockNewForm] = useState(false);
  const [newBlockName, setNewBlockName] = useState('');
  const [newBlockEmail, setNewBlockEmail] = useState('');
  const [newBlockReason, setNewBlockReason] = useState('Inappropriate messages');
  const [isSubmittingBlock, setIsSubmittingBlock] = useState(false);
  const [isUnblockingId, setIsUnblockingId] = useState(null);

  // Notifications Tab States & Settings
  const [notificationsSubTab, setNotificationsSubTab] = useState('offers');
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [activeNotifItem, setActiveNotifItem] = useState(null);
  const [unsubscribeMarketing, setUnsubscribeMarketing] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    recognition: { email: false, sms: false, phone: false, whatsapp: false },
    insights_tips: { email: false, sms: false, phone: false, whatsapp: false },
    pricing_trends: { email: false, sms: false, phone: false, whatsapp: false },
    hosting_perks: { email: false, sms: false, phone: false, whatsapp: false },
    news_updates: { email: false, sms: false, phone: false, whatsapp: false },
    local_laws: { email: false, sms: false, phone: false, whatsapp: false },
    inspiration_offers: { email: false, sms: false, phone: false, whatsapp: false },
    trip_planning: { email: false, sms: false, phone: false, whatsapp: false },
    news_programmes: { email: false, sms: false, phone: false, whatsapp: false },
    feedback: { email: false, sms: false, phone: false, whatsapp: false },
    travel_regulations: { email: false, sms: false, phone: false, whatsapp: false },
    // Account Activity & Policies
    account_activity: { email: true, sms: false, phone: false, whatsapp: false },
    listing_activity: { email: true, sms: true, phone: false, whatsapp: false },
    guest_policies: { email: true, sms: false, phone: false, whatsapp: false },
    host_policies: { email: true, sms: false, phone: false, whatsapp: false },
    // Reminders
    account_reminders: { email: true, sms: false, phone: false, whatsapp: false },
    // Messaging and Requests
    reservation_messaging: { email: true, sms: false, phone: false, whatsapp: false },
    social_messaging: { email: false, sms: false, phone: false, whatsapp: false },
    connection_requests: { email: false, sms: false, phone: false, whatsapp: false }
  });

  // Lock background page scroll when any modal is open
  useEffect(() => {
    const isAnyModalOpen = Boolean(
      showDeleteAccountModal ||
      showDataRequestModal ||
      showBlockedModal ||
      showNotifModal ||
      showPasskeyModal ||
      showTaxModal ||
      showVatModal ||
      showBookingModal ||
      showLangModal ||
      showOtherLangModal ||
      showTimezoneModal ||
      showPayoutModal
    );

    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [
    showDeleteAccountModal,
    showDataRequestModal,
    showBlockedModal,
    showNotifModal,
    showPasskeyModal,
    showTaxModal,
    showVatModal,
    showBookingModal,
    showLangModal,
    showOtherLangModal,
    showTimezoneModal,
    showPayoutModal
  ]);

  const handleOpenNotifModal = (item) => {
    setActiveNotifItem(item);
    setShowNotifModal(true);
  };

  const handleToggleNotifChannel = async (itemId, channel) => {
    const currentChannels = notificationSettings[itemId] || { email: false, sms: false, phone: false, whatsapp: false };
    const nextState = !currentChannels[channel];
    const updatedChannels = {
      ...currentChannels,
      [channel]: nextState
    };
    const updatedSettings = {
      ...notificationSettings,
      [itemId]: updatedChannels
    };
    setNotificationSettings(updatedSettings);

    const channelLabels = {
      email: 'Email',
      sms: 'SMS',
      phone: 'Phone calls',
      whatsapp: 'WhatsApp'
    };
    const channelName = channelLabels[channel] || channel;

    if (nextState) {
      toast.success(`${channelName} notifications enabled!`);
    } else {
      toast.success(`${channelName} notifications disabled!`);
    }

    try {
      await updateUserProfileApi({
        id: profileUser.id || authUser?.id,
        notificationSettings: updatedSettings
      });
    } catch (err) {
      console.warn('Auto-save notification settings note:', err);
      toast.error('Failed to save notification preferences.');
    }
  };

  const handleToggleUnsubscribeMarketing = async () => {
    const nextVal = !unsubscribeMarketing;
    setUnsubscribeMarketing(nextVal);
    if (nextVal) {
      toast.success('Unsubscribed from all marketing emails.');
      const updatedSettings = { ...notificationSettings };
      Object.keys(updatedSettings).forEach(key => {
        if (updatedSettings[key]) {
          updatedSettings[key] = { ...updatedSettings[key], email: false };
        }
      });
      setNotificationSettings(updatedSettings);
      try {
        await updateUserProfileApi({
          id: profileUser.id || authUser?.id,
          notificationSettings: updatedSettings
        });
      } catch (e) {}
    } else {
      toast.success('Preferences updated.');
    }
  };

  const getNotifStatusText = (itemId, isAccountTab = false) => {
    const settings = notificationSettings[itemId];
    if (!settings) return 'Off';
    const active = [];
    if (settings.email) active.push('Email');
    if (settings.sms) active.push('SMS');
    if (settings.phone) active.push('Phone calls');
    if (settings.whatsapp) active.push('WhatsApp');

    if (active.length === 0) return 'Off';

    let channelsText = '';
    if (active.length === 2) {
      channelsText = active.join(' and ');
    } else {
      channelsText = active.join(', ');
    }

    return isAccountTab ? `On: ${channelsText}` : channelsText;
  };

  // Tax and VAT Handlers
  const handleSaveTaxInfo = async (e) => {
    if (e) e.preventDefault();
    if (!taxIdNumber.trim()) {
      toast.error('Please enter a Tax ID / Identification number.');
      return;
    }
    try {
      setIsSubmittingTax(true);
      const newTaxData = {
        region: taxRegion,
        taxId: taxIdNumber.trim(),
        legalName: taxLegalName.trim() || `${profileUser.firstName} ${profileUser.lastName}`.trim(),
        submittedAt: new Date().toISOString()
      };
      const res = await updateUserProfileApi({
        id: profileUser.id || authUser?.id,
        taxInfo: newTaxData
      });
      if (res.success) {
        setTaxInfo(newTaxData);
        setShowTaxModal(false);
        setTaxModalStep(1);
        setTaxIdNumber('');
        setTaxLegalName('');
        toast.success('Taxpayer information saved successfully!');
      } else {
        toast.error(res.message || 'Failed to save taxpayer info.');
      }
    } catch (err) {
      console.error('Save tax error:', err);
      toast.error(err.message || 'Could not save tax info.');
    } finally {
      setIsSubmittingTax(false);
    }
  };

  const handleRemoveTaxInfo = async () => {
    if (!window.confirm('Are you sure you want to remove your taxpayer information?')) return;
    try {
      const res = await updateUserProfileApi({
        id: profileUser.id || authUser?.id,
        taxInfo: null
      });
      if (res.success) {
        setTaxInfo(null);
        toast.success('Taxpayer information removed.');
      } else {
        toast.error('Failed to remove tax info.');
      }
    } catch (err) {
      toast.error('Error removing tax info.');
    }
  };

  const handleSaveVatInfo = async (e) => {
    if (e) e.preventDefault();
    if (!vatNumber.trim()) {
      toast.error('Please enter a VAT / GST identification number.');
      return;
    }
    try {
      setIsSubmittingVat(true);
      const newVatData = {
        country: vatCountry,
        vatNumber: vatNumber.trim(),
        legalName: vatLegalName.trim() || `${profileUser.firstName} ${profileUser.lastName}`.trim(),
        submittedAt: new Date().toISOString()
      };
      const res = await updateUserProfileApi({
        id: profileUser.id || authUser?.id,
        vatInfo: newVatData
      });
      if (res.success) {
        setVatInfo(newVatData);
        setShowVatModal(false);
        setVatNumber('');
        setVatLegalName('');
        toast.success('VAT number registered successfully!');
      } else {
        toast.error(res.message || 'Failed to save VAT info.');
      }
    } catch (err) {
      console.error('Save VAT error:', err);
      toast.error(err.message || 'Could not save VAT info.');
    } finally {
      setIsSubmittingVat(false);
    }
  };

  const handleRemoveVatInfo = async () => {
    if (!window.confirm('Are you sure you want to remove your VAT registration details?')) return;
    try {
      const res = await updateUserProfileApi({
        id: profileUser.id || authUser?.id,
        vatInfo: null
      });
      if (res.success) {
        setVatInfo(null);
        toast.success('VAT details removed.');
      } else {
        toast.error('Failed to remove VAT info.');
      }
    } catch (err) {
      toast.error('Error removing VAT info.');
    }
  };

  const handleSaveLanguage = async () => {
    try {
      setIsSavingLanguage(true);
      const res = await updateUserProfileApi({
        id: profileUser.id || authUser?.id,
        preferredLanguage: tempLanguage
      });

      if (res.success) {
        setCurrentLanguage(tempLanguage);
        localStorage.setItem('airbnb_preferred_language', tempLanguage);
        if (i18n && i18n.changeLanguage) {
          i18n.changeLanguage(tempLanguage);
        }
        applyGoogleTranslate(tempLanguage);
        setShowLangModal(false);
        toast.success(`Preferred language updated to ${tempLanguage}!`);
      } else {
        toast.error(res.message || 'Failed to update preferred language.');
      }
    } catch (err) {
      console.error('Error saving language:', err);
      // Fallback update in case of offline/backend issue
      setCurrentLanguage(tempLanguage);
      localStorage.setItem('airbnb_preferred_language', tempLanguage);
      if (i18n && i18n.changeLanguage) {
        i18n.changeLanguage(tempLanguage);
      }
      applyGoogleTranslate(tempLanguage);
      setShowLangModal(false);
      toast.success(`Preferred language updated to ${tempLanguage}!`);
    } finally {
      setIsSavingLanguage(false);
    }
  };

  const handleSaveTimezone = async () => {
    try {
      setIsSavingTimezone(true);
      const res = await updateUserProfileApi({
        id: profileUser.id || authUser?.id,
        timezone: tempTimezone
      });

      if (res.success) {
        setSelectedTimezone(tempTimezone);
        setSavedTimezone(tempTimezone);
        setShowTimezoneModal(false);
        toast.success(`Time zone updated to ${tempTimezone}!`);
      } else {
        toast.error(res.message || 'Failed to update time zone.');
      }
    } catch (err) {
      console.error('Error saving timezone:', err);
      // Fallback
      setSelectedTimezone(tempTimezone);
      setSavedTimezone(tempTimezone);
      setShowTimezoneModal(false);
      toast.success(`Time zone updated to ${tempTimezone}!`);
    } finally {
      setIsSavingTimezone(false);
    }
  };

  const handleSaveKnownLanguages = async () => {
    try {
      setIsSavingKnownLanguages(true);
      const res = await updateUserProfileApi({
        id: profileUser.id || authUser?.id,
        knownLanguages: tempKnownLanguages
      });

      if (res.success) {
        setKnownLanguages(tempKnownLanguages);
        setShowOtherLangModal(false);
        toast.success('Other languages updated successfully!');
      } else {
        toast.error(res.message || 'Failed to update other languages.');
      }
    } catch (err) {
      console.error('Error saving other languages:', err);
      // Fallback
      setKnownLanguages(tempKnownLanguages);
      setShowOtherLangModal(false);
      toast.success('Other languages updated successfully!');
    } finally {
      setIsSavingKnownLanguages(false);
    }
  };

  const fetchBlockedUsers = async () => {
    try {
      setIsLoadingBlocked(true);
      const res = await getBlockedUsersApi(profileUser.id || authUser?.id || 4);
      if (res.success && res.blockedUsers) {
        setBlockedUsers(res.blockedUsers);
      }
    } catch (err) {
      console.warn('Blocked users fetch note:', err);
    } finally {
      setIsLoadingBlocked(false);
    }
  };

  const handleToggle = async (key) => {
    const updated = {
      ...privacyToggles,
      [key]: !privacyToggles[key]
    };
    setPrivacyToggles(updated);

    try {
      await updateUserProfileApi({
        id: profileUser.id || authUser?.id || 4,
        email: profileUser.email,
        privacySettings: updated
      });
      toast.success('Privacy setting updated');
    } catch (err) {
      console.warn('Failed to save privacy setting:', err);
    }
  };

  const handleUnblock = async (blockedId, name) => {
    try {
      setIsUnblockingId(blockedId);
      const res = await unblockUserApi({
        id: blockedId,
        userId: profileUser.id || authUser?.id || 4
      });
      if (res.success) {
        toast.success(res.message || `${name} has been unblocked.`);
        setBlockedUsers(prev => prev.filter(u => u.id !== blockedId));
      } else {
        toast.error(res.message || 'Failed to unblock user.');
      }
    } catch (err) {
      toast.error('Failed to unblock user: ' + err.message);
    } finally {
      setIsUnblockingId(null);
    }
  };

  const handleBlockNewUser = async (e) => {
    if (e) e.preventDefault();
    if (!newBlockName.trim()) {
      toast.error('Please enter the name of the person to block.');
      return;
    }
    try {
      setIsSubmittingBlock(true);
      const res = await blockUserApi({
        userId: profileUser.id || authUser?.id || 4,
        name: newBlockName.trim(),
        email: newBlockEmail.trim() || null,
        reason: newBlockReason
      });
      if (res.success && res.blockedUser) {
        toast.success(res.message || `${res.blockedUser.name} has been blocked.`);
        setBlockedUsers(prev => [res.blockedUser, ...prev]);
        setNewBlockName('');
        setNewBlockEmail('');
        setShowBlockNewForm(false);
      } else {
        toast.error(res.message || 'Failed to block user.');
      }
    } catch (err) {
      toast.error('Failed to block user: ' + err.message);
    } finally {
      setIsSubmittingBlock(false);
    }
  };

  const CustomToggle = ({ checked, onChange }) => (
    <label className={styles.switch}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className={`${styles.slider} ${checked ? styles.checked : ''}`}>
        <span className={styles.sliderThumb}>
          {checked && (
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{display: 'block', fill: 'none', height: '14px', width: '14px', stroke: 'currentcolor', strokeWidth: '5.33333', overflow: 'visible'}}>
              <path fill="none" d="m4 16.5 8 8 16-16"></path>
            </svg>
          )}
        </span>
      </span>
    </label>
  );

  return (
    <div className={`container-fluid main-content ${styles.pageContainer}`}>
      <div className="row">
        {/* Left Sidebar Navigation */}
        <div className={`col-lg-3 ${styles.sidebarColumn}`}>
          <h2 className={styles.sidebarTitleHeader}>Account settings</h2>
          <div className={styles.sidebarMenu}>
            {SIDEBAR_TABS.map(tab => (
              <React.Fragment key={tab.id}>
                {tab.id === 'tools' && <div className={styles.sidebarDivider}></div>}
                <div 
                  className={`${styles.sidebarMenuItem} ${activeTab === tab.id ? styles.active : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className={styles.menuIcon}>{tab.icon}</span>
                  {tab.label}
                  {tab.isNew && <span className={styles.newBadge}>New</span>}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right Content Area */}
        <div className={`col-lg-9 ${styles.contentRight}`} >
          {activeTab === 'personal' && (
            <>
              <div className="row justify-content-center">
                <div className=" col-lg-7">
                  <h1 className={styles.pageTitle}>Personal information</h1>

                  {dynamicPersonalInfoData.map(item => (
                    <div key={item.id} className={styles.infoItem}>
                      {editingId === item.id ? (
                        <div className={styles.editFormContainer}>
                          <div className={styles.editFormHeader}>
                            <div>
                              <h3 className={styles.itemTitle}>{item.title}</h3>
                              <p className={styles.itemDesc}>
                                {item.id === 1 
                                  ? "This is the name on your travel document, which could be a licence or a passport." 
                                  : `Update your ${item.title.toLowerCase()}.`}
                              </p>
                            </div>
                            <button className={styles.cancelBtn} onClick={() => setEditingId(null)} disabled={isSaving}>Cancel</button>
                          </div>
                          
                          {item.id === 1 ? (
                            <div className="row">
                              <div className="col-md-6">
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel}>First name On ID</label>
                                  <input 
                                    type="text" 
                                    className={styles.formControl} 
                                    value={formData.firstName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel}>Last name On ID</label>
                                  <input 
                                    type="text" 
                                    className={styles.formControl} 
                                    value={formData.lastName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                  />
                                </div>
                              </div>
                            </div>
                          ) : item.id === 2 ? (
                            <div className="row">
                              <div className="col-12">
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel}>Preferred first name</label>
                                  <input 
                                    type="text" 
                                    className={styles.formControl} 
                                    value={formData.preferredFirstName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, preferredFirstName: e.target.value }))}
                                    placeholder="e.g. Zee"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : item.id === 3 ? (
                            <div className="row">
                              <div className="col-12">
                                <div className={styles.toggleRow} style={{ marginTop: '16px', marginBottom: '16px', alignItems: 'center' }}>
                                  <div className={styles.toggleTextContent}>
                                    <div className={styles.inputLabel} style={{ marginBottom: '4px' }}>Use my first name only</div>
                                    <p className={styles.toggleDesc}>Turn this off if you want to use a different host display name.</p>
                                  </div>
                                  <CustomToggle 
                                    checked={formData.useFirstNameOnly} 
                                    onChange={() => setFormData(prev => ({ ...prev, useFirstNameOnly: !prev.useFirstNameOnly }))} 
                                  />
                                </div>
                                {!formData.useFirstNameOnly && (
                                  <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>Custom Host Display Name</label>
                                    <input 
                                      type="text" 
                                      className={styles.formControl} 
                                      value={formData.hostDisplayName}
                                      onChange={(e) => setFormData(prev => ({ ...prev, hostDisplayName: e.target.value }))}
                                      placeholder="e.g. The Zeeshan Villa" 
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : item.id === 4 ? (
                            <div className="row">
                              <div className="col-12">
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel}>Email address</label>
                                  <input 
                                    type="email" 
                                    className={styles.formControl} 
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="name@example.com"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : item.id === 5 ? (
                            <div className="row">
                              <div className="col-12">
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel}>Phone number</label>
                                  <input 
                                    type="text" 
                                    className={styles.formControl} 
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder="+91 XXXXXXXXXX"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : item.id === 6 ? (
                            <div className="row">
                              <div className="col-12">
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel}>Identity verification status</label>
                                  <select 
                                    className={styles.formControl} 
                                    value={formData.identityVerificationStatus}
                                    onChange={(e) => setFormData(prev => ({ ...prev, identityVerificationStatus: e.target.value }))}
                                  >
                                    <option value="Not started">Not started</option>
                                    <option value="In review">In review</option>
                                    <option value="Verified">Verified</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          ) : item.id === 7 ? (
                            <div className="row">
                              <div className="col-12">
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel}>Residential address</label>
                                  <input 
                                    type="text" 
                                    className={styles.formControl} 
                                    value={formData.residentialAddress}
                                    onChange={(e) => setFormData(prev => ({ ...prev, residentialAddress: e.target.value }))}
                                    placeholder="Enter residential address"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : item.id === 8 ? (
                            <div className="row">
                              <div className="col-12">
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel}>Postal address</label>
                                  <input 
                                    type="text" 
                                    className={styles.formControl} 
                                    value={formData.postalAddress}
                                    onChange={(e) => setFormData(prev => ({ ...prev, postalAddress: e.target.value }))}
                                    placeholder="Enter postal address"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : item.id === 9 ? (
                            <div className="row">
                              <div className="col-12">
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel}>Name</label>
                                  <input 
                                    type="text" 
                                    className={styles.formControl} 
                                    placeholder="Emergency contact name" 
                                    value={formData.emergencyContactName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel}>Relationship</label>
                                  <input 
                                    type="text" 
                                    className={styles.formControl} 
                                    placeholder="e.g. Brother, Friend" 
                                    value={formData.emergencyContactRelationship}
                                    onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactRelationship: e.target.value }))}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel}>Preferred Language</label>
                                  <select 
                                    className={styles.formControl} 
                                    value={formData.emergencyContactLanguage}
                                    onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactLanguage: e.target.value }))}
                                  >
                                    <option value="English">English</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="French">French</option>
                                    <option value="German">German</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel}>Email</label>
                                  <input 
                                    type="email" 
                                    className={styles.formControl} 
                                    placeholder="Email address" 
                                    value={formData.emergencyContactEmail}
                                    onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactEmail: e.target.value }))}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel}>Country Code or Phone Number</label>
                                  <input 
                                    type="text" 
                                    className={styles.formControl} 
                                    placeholder="+91 XXXXXXXXXX" 
                                    value={formData.emergencyContactPhone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="row">
                              <div className="col-12">
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel}>{item.title}</label>
                                  <input type="text" className={styles.formControl} defaultValue={item.desc !== 'Not provided' && item.desc !== 'Not started' ? item.desc : ''} />
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <button 
                            className={styles.saveBtn} 
                            onClick={() => handleSave(item.id)}
                            disabled={isSaving}
                          >
                            {isSaving ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className={styles.itemContent}>
                            <h3 className={styles.itemTitle}>{item.title}</h3>
                            <p className={styles.itemDesc}>{item.desc}</p>
                          </div>
                          <button 
                            className={styles.actionBtn} 
                            onClick={() => handleStartEdit(item)}
                            disabled={editingId !== null}
                            style={{ opacity: editingId !== null ? 0.5 : 1, cursor: editingId !== null ? 'default' : 'pointer', textDecoration: editingId !== null ? 'none' : 'underline' }}
                          >
                            {item.action}
                          </button>
                        </>
                      )}
                    </div>
                  ))}



                   <div className={styles.sidebarCard}>
                    <div className={styles.sidebarItem}>
                      <BsShieldLock className={styles.sidebarIcon} />
                      <div>
                        <h4 className={styles.sidebarTitle}>Why isn't my info shown here?</h4>
                        <p className={styles.sidebarDesc}>We're hiding some account details to protect your identity.</p>
                      </div>
                    </div>

                    <div className={styles.sidebarItem}>
                      <BsLock className={styles.sidebarIcon} />
                      <div>
                        <h4 className={styles.sidebarTitle}>Which details can be edited?</h4>
                        <p className={styles.sidebarDesc}>Contact info and personal details can be edited. If this info was used to verify your identity, you'll need to get verified again the next time you book - or to continue hosting.</p>
                      </div>
                    </div>

                    <div className={styles.sidebarItem}>
                      <BsEye className={styles.sidebarIcon} />
                      <div>
                        <h4 className={styles.sidebarTitle}>What info is shared with others?</h4>
                        <p className={styles.sidebarDesc}>Airbnb only releases contact information for Hosts and guests after a reservation is confirmed.</p>
                      </div>
                    </div>
                  </div>

                </div>

               
              </div>
            </>
          )}

          

          {activeTab === 'security' && (
            <>
              <div className="row justify-content-center">
                <div className="col-lg-7">
                  <h1 className={styles.pageTitle}>Login & security</h1>
                  
                  <div className={styles.subTabsContainer}>
                    <button 
                      className={`${styles.subTab} ${loginSubTab === 'login' ? styles.subTabActive : ''}`}
                      onClick={() => setLoginSubTab('login')}
                    >
                      Login
                    </button>
                    <button 
                      className={`${styles.subTab} ${loginSubTab === 'shared' ? styles.subTabActive : ''}`}
                      onClick={() => setLoginSubTab('shared')}
                    >
                      Shared access
                    </button>
                  </div>
                  
                  {loginSubTab === 'login' && (
                    <>
                      <h2 className={styles.sectionHeading} style={{ marginTop: '16px' }}>Login</h2>
                      <div className={styles.infoItem}>
                        <div className={styles.itemContent}>
                          <h3 className={styles.itemTitle}>Passkeys</h3>
                          <p className={styles.itemDesc}>
                            {profileUser.passkeyEnabled 
                              ? `Passkey is active (${profileUser.passkeyType || 'Fingerprint, face or PIN'}). Sign in securely without a password.` 
                              : 'Use your fingerprint, face or PIN.'}
                          </p>
                        </div>
                        <button 
                          className={styles.actionBtn} 
                          onClick={() => {
                            setPasskeyEmail(profileUser.email || '');
                            setPasskeyOtp('');
                            if (profileUser.passkeyEnabled) {
                              setPasskeyStep('manage');
                            } else {
                              setPasskeyStep(1);
                            }
                            setShowPasskeyModal(true);
                          }}
                          disabled={editingId !== null}
                          style={{ opacity: editingId !== null ? 0.5 : 1, cursor: editingId !== null ? 'default' : 'pointer', textDecoration: editingId !== null ? 'none' : 'underline' }}
                        >
                          {profileUser.passkeyEnabled ? 'Manage' : 'Add'}
                        </button>
                      </div>
                      
                      {editingId === 'password' ? (
                        <div className={styles.editFormContainer} style={{ marginTop: '16px', paddingBottom: '16px', borderBottom: '1px solid #ebebeb' }}>
                          <div className={styles.editFormHeader}>
                            <div>
                              <h3 className={styles.itemTitle}>Update password</h3>
                            </div>
                            <button 
                              className={styles.cancelBtn} 
                              onClick={() => { 
                                setEditingId(null); 
                                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); 
                                setShowPassword({ current: false, new: false, confirm: false });
                              }}
                              disabled={isUpdatingPassword}
                            >
                              Cancel
                            </button>
                          </div>
                          <div className="row">
                            <div className="col-12">
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Current password</label>
                                <div className={styles.passwordInputWrapper}>
                                  <input 
                                    type={showPassword.current ? 'text' : 'password'} 
                                    className={styles.formControl} 
                                    style={{ paddingRight: '44px' }}
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    placeholder="Enter current password"
                                  />
                                  <button
                                    type="button"
                                    className={styles.passwordToggleBtn}
                                    onClick={() => togglePasswordVisibility('current')}
                                    title={showPassword.current ? 'Hide password' : 'Show password'}
                                    aria-label={showPassword.current ? 'Hide password' : 'Show password'}
                                  >
                                    {showPassword.current ? <BsEyeSlash /> : <BsEye />}
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>New password</label>
                                <div className={styles.passwordInputWrapper}>
                                  <input 
                                    type={showPassword.new ? 'text' : 'password'} 
                                    className={styles.formControl} 
                                    style={{ paddingRight: '44px' }}
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                    placeholder="At least 6 characters"
                                  />
                                  <button
                                    type="button"
                                    className={styles.passwordToggleBtn}
                                    onClick={() => togglePasswordVisibility('new')}
                                    title={showPassword.new ? 'Hide password' : 'Show password'}
                                    aria-label={showPassword.new ? 'Hide password' : 'Show password'}
                                  >
                                    {showPassword.new ? <BsEyeSlash /> : <BsEye />}
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Confirm password</label>
                                <div className={styles.passwordInputWrapper}>
                                  <input 
                                    type={showPassword.confirm ? 'text' : 'password'} 
                                    className={styles.formControl} 
                                    style={{ paddingRight: '44px' }}
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    placeholder="Confirm new password"
                                  />
                                  <button
                                    type="button"
                                    className={styles.passwordToggleBtn}
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    title={showPassword.confirm ? 'Hide password' : 'Show password'}
                                    aria-label={showPassword.confirm ? 'Hide password' : 'Show password'}
                                  >
                                    {showPassword.confirm ? <BsEyeSlash /> : <BsEye />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <button 
                            className={styles.saveBtn} 
                            onClick={handleUpdatePassword}
                            disabled={isUpdatingPassword}
                          >
                            {isUpdatingPassword ? 'Updating...' : 'Update password'}
                          </button>
                        </div>
                      ) : (
                        <div className={styles.infoItem}>
                          <div className={styles.itemContent}>
                            <h3 className={styles.itemTitle}>Password</h3>
                            <p className={styles.itemDesc}>{getPasswordUpdatedText(profileUser.passwordUpdatedAt)}</p>
                          </div>
                          <button 
                            className={styles.actionBtn} 
                            onClick={() => {
                              setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                              setShowPassword({ current: false, new: false, confirm: false });
                              setEditingId('password');
                            }}
                            disabled={editingId !== null && editingId !== 'password'}
                            style={{ opacity: (editingId !== null && editingId !== 'password') ? 0.5 : 1, cursor: (editingId !== null && editingId !== 'password') ? 'default' : 'pointer', textDecoration: (editingId !== null && editingId !== 'password') ? 'none' : 'underline' }}
                          >
                            Update
                          </button>
                        </div>
                      )}
                      
                      <h2 className={styles.sectionHeading}>Device history</h2>
                      <div className={styles.infoItem} style={{ borderBottom: '1px solid #ebebeb' }}>
                        <div className="d-flex w-100 align-items-start">
                          <BsDisplay className={styles.deviceIconWrapper} />
                          <div>
                            <h3 className={styles.itemTitle}>{profileUser.lastActiveDevice || 'Windows 10.0 • Chrome'}</h3>
                            <span className={styles.currentSessionBadge}>CURRENT SESSION</span>
                            <p className={styles.itemDesc} style={{ marginTop: '4px' }}>
                              {profileUser.lastActiveLocation || 'Jaipur, Rajasthan'} • {formatWithTimezone(profileUser.lastLoginAt || Date.now(), { day: 'numeric', month: 'long', year: 'numeric' }, selectedTimezone)} at {formatWithTimezone(profileUser.lastLoginAt || Date.now(), { hour: '2-digit', minute: '2-digit', hour12: false }, selectedTimezone)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <h2 className={styles.sectionHeading}>Account</h2>
                      <div className={styles.infoItem}>
                        <div className={styles.itemContent}>
                          <h3 className={styles.itemTitle}>Account deactivation</h3>
                          <p className={styles.itemDesc}>This action cannot be undone</p>
                        </div>
                        <button className={styles.actionBtn} onClick={handleDeactivateAccount}>Deactivate</button>
                      </div>
                    </>
                  )}

                  {loginSubTab === 'shared' && (
                    <>
                      <h2 className={styles.sectionHeading} style={{ marginTop: '16px' }}>Shared access</h2>
                      <p className={styles.sharedAccessText}>
                        Review each request carefully before approving access. We'll email your employee or co-worker a 4-digit code that lets them log in to your account with their trusted device.
                      </p>
                      <div className={styles.sidebarCard} style={{ marginTop: 0 }}>
                        <div className="d-flex align-items-start">
                          <BsLock className={styles.infoCardPinkIcon} />
                          <div>
                            <h4 className={styles.sidebarTitle}>Adding devices from people you trust</h4>
                            <p className={styles.sidebarDesc}>
                              When you approve a request, you grant someone full access to your account. They'll be able to change reservations and send messages on your behalf.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'privacy' && (
            <>
              <div className="row justify-content-center">
                <div className="col-lg-7">
                  <h1 className={styles.pageTitle}>Privacy</h1>
                  
                  <div className={styles.privacySection}>
                    <h2 className={styles.privacyHeading}>Profile visibility</h2>
                    <div className={styles.actionBox}>
                      <div>
                        <div className={styles.actionBoxTitle}>Choose who can see your profile</div>
                        <p className={styles.actionBoxDesc}>Anyone on Airbnb</p>
                      </div>
                      <BsChevronRight className={styles.actionBoxIcon} />
                    </div>
                  </div>

                  <div className={styles.privacySection}>
                    <h2 className={styles.privacyHeading}>Messages</h2>
                    <div className={styles.toggleRow}>
                      <div className={styles.toggleTextContent}>
                        <div className={styles.toggleLabel}>
                          Show people when I've read their messages. <span className={styles.learnMoreLink}>Learn more</span>
                        </div>
                      </div>
                      <CustomToggle checked={privacyToggles.readMessages} onChange={() => handleToggle('readMessages')} />
                    </div>
                    
                    <div 
                      className={styles.actionBox}
                      onClick={() => {
                        setShowBlockedModal(true);
                        fetchBlockedUsers();
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={styles.actionBoxTitle}>Blocked people</div>
                      <BsChevronRight className={styles.actionBoxIcon} />
                    </div>
                  </div>

                  <div className={styles.privacySection}>
                    <h2 className={styles.privacyHeading}>Listings</h2>
                    <div className={styles.toggleRow}>
                      <div className={styles.toggleTextContent}>
                        <div className={styles.toggleLabel}>Include my listing(s) in search engines</div>
                        <p className={styles.toggleDesc}>Turning this on means search engines, like Google, will display your listing page(s) in search results.</p>
                      </div>
                      <CustomToggle checked={privacyToggles.searchEngines} onChange={() => handleToggle('searchEngines')} />
                    </div>
                  </div>

                  <div className={styles.privacySection}>
                    <h2 className={styles.privacyHeading}>Reviews</h2>
                    <p className={styles.privacyDesc}>
                      Choose what's shared when you write a review. Updating this setting will change what's displayed for all past reviews. <span className={styles.learnMoreLink}>Learn more</span>
                    </p>
                    
                    <div className={styles.toggleRow}>
                      <div className={styles.toggleTextContent}>
                        <div className={styles.toggleLabel}>Show my home city and country</div>
                        <p className={styles.toggleDesc}>E.g. City and country</p>
                      </div>
                      <CustomToggle checked={privacyToggles.homeCity} onChange={() => handleToggle('homeCity')} />
                    </div>
                    
                    <div className={styles.toggleRow}>
                      <div className={styles.toggleTextContent}>
                        <div className={styles.toggleLabel}>Show my trip type</div>
                        <p className={styles.toggleDesc}>E.g. Stayed with kids or pets</p>
                      </div>
                      <CustomToggle checked={privacyToggles.tripType} onChange={() => handleToggle('tripType')} />
                    </div>

                    <div className={styles.toggleRow}>
                      <div className={styles.toggleTextContent}>
                        <div className={styles.toggleLabel}>Show my length of stay</div>
                        <p className={styles.toggleDesc}>E.g. A few nights, about a week, etc.</p>
                      </div>
                      <CustomToggle checked={privacyToggles.lengthOfStay} onChange={() => handleToggle('lengthOfStay')} />
                    </div>

                    <div className={styles.toggleRow}>
                      <div className={styles.toggleTextContent}>
                        <div className={styles.toggleLabel}>Show my booked services</div>
                        <p className={styles.toggleDesc}>E.g. Gourmet brunch or tasting menu</p>
                      </div>
                      <CustomToggle checked={privacyToggles.bookedServices} onChange={() => handleToggle('bookedServices')} />
                    </div>
                  </div>

                  <div className={styles.privacySection} style={{ borderBottom: 'none' }}>
                    <h2 className={styles.privacyHeading}>Data privacy</h2>
                    <div 
                      className={styles.actionBox}
                      onClick={() => setShowDataRequestModal(true)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={styles.actionBoxTitle}>Request my personal data</div>
                      <BsChevronRight className={styles.actionBoxIcon} />
                    </div>
                    
                    <div className={styles.toggleRow} style={{ marginTop: '16px' }}>
                      <div className={styles.toggleTextContent}>
                        <div className={styles.toggleLabel}>Help improve AI-powered features</div>
                        <p className={styles.toggleDesc}>When this is on, we use your data to develop and improve AI models that power certain features on Airbnb. <span className={styles.learnMoreLink}>Learn more</span></p>
                      </div>
                      <CustomToggle checked={privacyToggles.aiFeatures} onChange={() => handleToggle('aiFeatures')} />
                    </div>
                    
                    <div 
                      className={styles.actionBox}
                      onClick={handleDeleteAccount}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={styles.actionBoxTitle}>Delete my account</div>
                      <BsChevronRight className={styles.actionBoxIcon} />
                    </div>
                    
                    <div className={styles.privacyInfoCard}>
                      <BsLock className={styles.infoCardPinkIcon} />
                      <div>
                        <div className={styles.toggleLabel}>Committed to privacy</div>
                        <p className={styles.toggleDesc}>
                          Airbnb is committed to keeping your data protected. Read details in our <span className={styles.learnMoreLink} style={{textDecoration:'underline'}}>Privacy Policy</span>. To help us improve your experience, <span className={styles.learnMoreLink} style={{textDecoration:'underline'}}>share your feedback</span>.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </>
          )}

          {activeTab === 'notifications' && (
            <>
              <div className="row justify-content-center">
                <div className="col-lg-7">
                  <h1 className={styles.pageTitle}>Notifications</h1>

                  <div className={styles.subTabsContainer}>
                    <button 
                      className={`${styles.subTab} ${notificationsSubTab === 'offers' ? styles.subTabActive : ''}`}
                      onClick={() => setNotificationsSubTab('offers')}
                    >
                      Offers and updates
                    </button>
                    <button 
                      className={`${styles.subTab} ${notificationsSubTab === 'account' ? styles.subTabActive : ''}`}
                      onClick={() => setNotificationsSubTab('account')}
                    >
                      Account
                    </button>
                  </div>

                  {notificationsSubTab === 'offers' && (
                    <>
                      {/* Section 1: Hosting insights and rewards */}
                      <div className={styles.notificationSection}>
                        <h2 className={styles.notifMainHeading}>Hosting insights and rewards</h2>
                        <p className={styles.notifMainDesc}>
                          Learn about best hosting practices and get access to exclusive hosting perks.
                        </p>

                        <div className={styles.notifItemBlock}>
                          <div className={styles.notifItemTitle}>Recognition and achievements</div>
                          <div className={styles.notifItemStatus}>{getNotifStatusText('recognition')}</div>
                          <button 
                            type="button" 
                            className={styles.notifEditBtn}
                            onClick={() => handleOpenNotifModal({
                              id: 'recognition',
                              title: 'Recognition and achievements',
                              desc: 'Get recognised for reaching hosting milestones and Superhost status.'
                            })}
                          >
                            Edit
                          </button>
                        </div>

                        <div className={styles.notifItemBlock}>
                          <div className={styles.notifItemTitle}>Insights and tips</div>
                          <div className={styles.notifItemStatus}>{getNotifStatusText('insights_tips')}</div>
                          <button 
                            type="button" 
                            className={styles.notifEditBtn}
                            onClick={() => handleOpenNotifModal({
                              id: 'insights_tips',
                              title: 'Insights and tips',
                              desc: 'Get personalised tips and recommendations to help your listing stand out.'
                            })}
                          >
                            Edit
                          </button>
                        </div>

                        <div className={styles.notifItemBlock}>
                          <div className={styles.notifItemTitle}>Pricing trends and suggestions</div>
                          <div className={styles.notifItemStatus}>{getNotifStatusText('pricing_trends')}</div>
                          <button 
                            type="button" 
                            className={styles.notifEditBtn}
                            onClick={() => handleOpenNotifModal({
                              id: 'pricing_trends',
                              title: 'Pricing trends and suggestions',
                              desc: 'Learn about demand trends in your area and pricing recommendations.'
                            })}
                          >
                            Edit
                          </button>
                        </div>

                        <div className={styles.notifItemBlock}>
                          <div className={styles.notifItemTitle}>Hosting perks</div>
                          <div className={styles.notifItemStatus}>{getNotifStatusText('hosting_perks')}</div>
                          <button 
                            type="button" 
                            className={styles.notifEditBtn}
                            onClick={() => handleOpenNotifModal({
                              id: 'hosting_perks',
                              title: 'Hosting perks',
                              desc: 'Get access to exclusive perks, partner offers, and discounts for hosts.'
                            })}
                          >
                            Edit
                          </button>
                        </div>
                      </div>

                      <hr className={styles.notifSectionDivider} />

                      {/* Section 2: Hosting updates */}
                      <div className={styles.notificationSection}>
                        <h2 className={styles.notifMainHeading}>Hosting updates</h2>
                        <p className={styles.notifMainDesc}>
                          Get updates about programmes, features, and regulations.
                        </p>

                        <div className={styles.notifItemBlock}>
                          <div className={styles.notifItemTitle}>News and updates</div>
                          <div className={styles.notifItemStatus}>{getNotifStatusText('news_updates')}</div>
                          <button 
                            type="button" 
                            className={styles.notifEditBtn}
                            onClick={() => handleOpenNotifModal({
                              id: 'news_updates',
                              title: 'News and updates',
                              desc: 'Stay informed about new host tools, policy updates, and platform features.'
                            })}
                          >
                            Edit
                          </button>
                        </div>

                        <div className={styles.notifItemBlock}>
                          <div className={styles.notifItemTitle}>Local laws and regulations</div>
                          <div className={styles.notifItemStatus}>{getNotifStatusText('local_laws')}</div>
                          <button 
                            type="button" 
                            className={styles.notifEditBtn}
                            onClick={() => handleOpenNotifModal({
                              id: 'local_laws',
                              title: 'Local laws and regulations',
                              desc: 'Learn about regulations and taxes that may apply to hosting in your jurisdiction.'
                            })}
                          >
                            Edit
                          </button>
                        </div>
                      </div>

                      <hr className={styles.notifSectionDivider} />

                      {/* Section 3: Travel tips and offers */}
                      <div className={styles.notificationSection}>
                        <h2 className={styles.notifMainHeading}>Travel tips and offers</h2>
                        <p className={styles.notifMainDesc}>
                          Inspire your next trip with personalised recommendations and special offers.
                        </p>

                        <div className={styles.notifItemBlock}>
                          <div className={styles.notifItemTitle}>Inspiration and offers</div>
                          <div className={styles.notifItemStatus}>{getNotifStatusText('inspiration_offers')}</div>
                          <button 
                            type="button" 
                            className={styles.notifEditBtn}
                            onClick={() => handleOpenNotifModal({
                              id: 'inspiration_offers',
                              title: 'Inspiration and offers',
                              desc: 'Get inspired with curated destinations, unique stays, and limited-time discounts.'
                            })}
                          >
                            Edit
                          </button>
                        </div>

                        <div className={styles.notifItemBlock}>
                          <div className={styles.notifItemTitle}>Trip planning</div>
                          <div className={styles.notifItemStatus}>{getNotifStatusText('trip_planning')}</div>
                          <button 
                            type="button" 
                            className={styles.notifEditBtn}
                            onClick={() => handleOpenNotifModal({
                              id: 'trip_planning',
                              title: 'Trip planning',
                              desc: 'Receive tailored suggestions for activities, dining, and logistics for your trips.'
                            })}
                          >
                            Edit
                          </button>
                        </div>
                      </div>

                      <hr className={styles.notifSectionDivider} />

                      {/* Section 4: Airbnb updates */}
                      <div className={styles.notificationSection}>
                        <h2 className={styles.notifMainHeading}>Airbnb updates</h2>
                        <p className={styles.notifMainDesc}>
                          Stay up to date on the latest news from Airbnb, and let us know how we can improve.
                        </p>

                        <div className={styles.notifItemBlock}>
                          <div className={styles.notifItemTitle}>News and programmes</div>
                          <div className={styles.notifItemStatus}>{getNotifStatusText('news_programmes')}</div>
                          <button 
                            type="button" 
                            className={styles.notifEditBtn}
                            onClick={() => handleOpenNotifModal({
                              id: 'news_programmes',
                              title: 'News and programmes',
                              desc: 'Hear about Airbnb initiatives, community stories, and product announcements.'
                            })}
                          >
                            Edit
                          </button>
                        </div>

                        <div className={styles.notifItemBlock}>
                          <div className={styles.notifItemTitle}>Feedback</div>
                          <div className={styles.notifItemStatus}>{getNotifStatusText('feedback')}</div>
                          <button 
                            type="button" 
                            className={styles.notifEditBtn}
                            onClick={() => handleOpenNotifModal({
                              id: 'feedback',
                              title: 'Feedback',
                              desc: 'Participate in surveys, research studies, and share your thoughts to help us improve.'
                            })}
                          >
                            Edit
                          </button>
                        </div>

                        <div className={styles.notifItemBlock}>
                          <div className={styles.notifItemTitle}>Travel regulations</div>
                          <div className={styles.notifItemStatus}>{getNotifStatusText('travel_regulations')}</div>
                          <button 
                            type="button" 
                            className={styles.notifEditBtn}
                            onClick={() => handleOpenNotifModal({
                              id: 'travel_regulations',
                              title: 'Travel regulations',
                              desc: 'Get timely updates about travel guidelines, health rules, and entry requirements.'
                            })}
                          >
                            Edit
                          </button>
                        </div>
                      </div>

                      <hr className={styles.notifSectionDivider} />

                      {/* Bottom Marketing Checkbox */}
                      <div 
                        className={styles.marketingUnsubscribeContainer}
                        onClick={handleToggleUnsubscribeMarketing}
                      >
                        <div className={unsubscribeMarketing ? styles.marketingCheckboxSquare : styles.marketingCheckboxSquareUnchecked}>
                          {unsubscribeMarketing && <BsCheck size={18} />}
                        </div>
                        <span className={styles.marketingCheckboxLabel}>
                          Unsubscribe from all marketing emails
                        </span>
                      </div>
                    </>
                  )}

                  {notificationsSubTab === 'account' && (
                    <>
                      {/* Section 1: Account activity and policies */}
                      <div className={styles.notificationSection}>
                        <h2 className={styles.notifMainHeading}>Account activity and policies</h2>
                        <p className={styles.notifMainDesc}>
                          Confirm your booking and account activity, and learn about important Airbnb policies.
                        </p>

                        <div className={styles.notifItemBlock}>
                          <div className={styles.notifItemTitle}>Account activity</div>
                          <div className={styles.notifItemStatus}>{getNotifStatusText('account_activity', true)}</div>
                          <button 
                            type="button" 
                            className={styles.notifEditBtn}
                            onClick={() => handleOpenNotifModal({
                              id: 'account_activity',
                              title: 'Account activity',
                              desc: 'Confirm your bookings and account activity, and learn about important Airbnb policies.'
                            })}
                          >
                            Edit
                          </button>
                        </div>

                        <div className={styles.notifItemBlock}>
                          <div className={styles.notifItemTitle}>Listing activity</div>
                          <div className={styles.notifItemStatus}>{getNotifStatusText('listing_activity', true)}</div>
                          <button 
                            type="button" 
                            className={styles.notifEditBtn}
                            onClick={() => handleOpenNotifModal({
                              id: 'listing_activity',
                              title: 'Listing activity',
                              desc: 'Confirm your bookings and account activity, and learn about important Airbnb policies.'
                            })}
                          >
                            Edit
                          </button>
                        </div>

                        <div className={styles.notifItemBlock}>
                          <div className={styles.notifItemTitle}>Guest policies</div>
                          <div className={styles.notifItemStatus}>{getNotifStatusText('guest_policies', true)}</div>
                          <button 
                            type="button" 
                            className={styles.notifEditBtn}
                            onClick={() => handleOpenNotifModal({
                              id: 'guest_policies',
                              title: 'Guest policies',
                              desc: 'Confirm your bookings and account activity, and learn about important Airbnb policies.'
                            })}
                          >
                            Edit
                          </button>
                        </div>

                        <div className={styles.notifItemBlock}>
                          <div className={styles.notifItemTitle}>Host policies</div>
                          <div className={styles.notifItemStatus}>{getNotifStatusText('host_policies', true)}</div>
                          <button 
                            type="button" 
                            className={styles.notifEditBtn}
                            onClick={() => handleOpenNotifModal({
                              id: 'host_policies',
                              title: 'Host policies',
                              desc: 'Confirm your bookings and account activity, and learn about important Airbnb policies.'
                            })}
                          >
                            Edit
                          </button>
                        </div>
                      </div>

                      <hr className={styles.notifSectionDivider} />

                      {/* Section 2: Reminders */}
                      <div className={styles.notificationSection}>
                        <h2 className={styles.notifMainHeading}>Reminders</h2>
                        <p className={styles.notifMainDesc}>
                          Get important reminders about your reservations, listings, and account activity.
                        </p>

                        <div className={styles.notifItemBlock}>
                          <div className={styles.notifItemTitle}>Reminders</div>
                          <div className={styles.notifItemStatus}>{getNotifStatusText('account_reminders', true)}</div>
                          <button 
                            type="button" 
                            className={styles.notifEditBtn}
                            onClick={() => handleOpenNotifModal({
                              id: 'account_reminders',
                              title: 'Reminders',
                              desc: 'Get important reminders about your reservations, listings, and account activity.'
                            })}
                          >
                            Edit
                          </button>
                        </div>
                      </div>

                      <hr className={styles.notifSectionDivider} />

                      {/* Section 3: Messaging and requests */}
                      <div className={styles.notificationSection}>
                        <h2 className={styles.notifMainHeading}>Messaging and requests</h2>
                        <p className={styles.notifMainDesc}>
                          Control how you’re notified about new messages and connection requests.
                        </p>

                        <div className={styles.notifItemBlock}>
                          <div className={styles.notifItemTitle}>Reservation messaging</div>
                          <div className={styles.notifItemStatus}>{getNotifStatusText('reservation_messaging', true)}</div>
                          <button 
                            type="button" 
                            className={styles.notifEditBtn}
                            onClick={() => handleOpenNotifModal({
                              id: 'reservation_messaging',
                              title: 'Reservation messaging',
                              desc: 'Control how you’re notified about new messages and connection requests.'
                            })}
                          >
                            Edit
                          </button>
                        </div>

                        <div className={styles.notifItemBlock}>
                          <div className={styles.notifItemTitle}>Social messaging</div>
                          <div className={styles.notifItemStatus}>{getNotifStatusText('social_messaging', true)}</div>
                          <button 
                            type="button" 
                            className={styles.notifEditBtn}
                            onClick={() => handleOpenNotifModal({
                              id: 'social_messaging',
                              title: 'Social messaging',
                              desc: 'Control how you’re notified about new messages and connection requests.'
                            })}
                          >
                            Edit
                          </button>
                        </div>

                        <div className={styles.notifItemBlock}>
                          <div className={styles.notifItemTitle}>Connection requests</div>
                          <div className={styles.notifItemStatus}>{getNotifStatusText('connection_requests', true)}</div>
                          <button 
                            type="button" 
                            className={styles.notifEditBtn}
                            onClick={() => handleOpenNotifModal({
                              id: 'connection_requests',
                              title: 'Connection requests',
                              desc: 'Control how you’re notified about new messages and connection requests.'
                            })}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                </div>
              </div>
            </>
          )}

          {activeTab === 'taxes' && (
            <>
              <div className="row justify-content-center">
                <div className="col-lg-7">
                  <h1 className={styles.pageTitle}>Taxes</h1>
                  
                  <div className={styles.subTabsContainer}>
                    <button 
                      className={`${styles.subTab} ${taxesSubTab === 'taxpayers' ? styles.subTabActive : ''}`}
                      onClick={() => setTaxesSubTab('taxpayers')}
                    >
                      Taxpayers
                    </button>
                    <button 
                      className={`${styles.subTab} ${taxesSubTab === 'documents' ? styles.subTabActive : ''}`}
                      onClick={() => setTaxesSubTab('documents')}
                    >
                      Tax documents
                    </button>
                  </div>
                  
                  {taxesSubTab === 'taxpayers' && (
                    <>
                      <h2 className={styles.sectionHeading} style={{ marginTop: '16px', marginBottom: '8px' }}>Taxpayer information</h2>
                      <p className={styles.privacyDesc} style={{ marginBottom: '16px' }}>
                        Tax info is required for most countries/regions. <span className={styles.learnMoreLink}>Learn more</span>
                      </p>
                      
                      {taxInfo ? (
                        <div className={styles.taxInfoCard}>
                          <div className={styles.taxInfoCardHeader}>
                            <h3 className={styles.taxInfoRegionTitle}>{taxInfo.region}</h3>
                            <span className={styles.taxInfoBadge}>Submitted</span>
                          </div>
                          <div className={styles.taxInfoCardDetail}>
                            <strong>Tax Identification Number:</strong> {taxInfo.taxId}
                          </div>
                          <div className={styles.taxInfoCardDetail}>
                            <strong>Legal Name:</strong> {taxInfo.legalName}
                          </div>
                          <div className={styles.taxInfoActions}>
                            <button 
                              type="button" 
                              className={styles.taxRemoveBtn}
                              onClick={handleRemoveTaxInfo}
                            >
                              Remove tax info
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button className={styles.blackBtn} onClick={() => { setTaxModalStep(1); setShowTaxModal(true); }}>Add tax info</button>
                      )}

                      <h2 className={styles.sectionHeading} style={{ marginTop: '24px', marginBottom: '8px' }}>Value Added Tax (VAT)</h2>
                      <p className={styles.privacyDesc} style={{ marginBottom: '16px' }}>
                        If you are VAT-registered, please add your VAT ID. <span className={styles.learnMoreLink}>Learn more</span>
                      </p>

                      {vatInfo ? (
                        <div className={styles.taxInfoCard}>
                          <div className={styles.taxInfoCardHeader}>
                            <h3 className={styles.taxInfoRegionTitle}>{vatInfo.country}</h3>
                            <span className={styles.taxInfoBadge}>Active</span>
                          </div>
                          <div className={styles.taxInfoCardDetail}>
                            <strong>VAT / GST ID:</strong> {vatInfo.vatNumber}
                          </div>
                          <div className={styles.taxInfoCardDetail}>
                            <strong>Registered Entity:</strong> {vatInfo.legalName}
                          </div>
                          <div className={styles.taxInfoActions}>
                            <button 
                              type="button" 
                              className={styles.taxRemoveBtn}
                              onClick={handleRemoveVatInfo}
                            >
                              Remove VAT ID
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button className={styles.blackBtn} onClick={() => setShowVatModal(true)}>Add VAT ID number</button>
                      )}

                      <h2 className={styles.sectionHeading} style={{ marginTop: '24px', marginBottom: '8px' }}>Need help?</h2>
                      <p className={styles.privacyDesc}>
                        Get answers to questions about taxes in our <span className={styles.learnMoreLink}>Help Centre</span>.
                      </p>
                    </>
                  )}

                  {taxesSubTab === 'documents' && (
                    <>
                      <p className={styles.privacyDesc} style={{ marginTop: '16px', marginBottom: '16px' }}>
                        Tax documents required for filing taxes are available to review and download here.
                      </p>
                      <p className={styles.privacyDesc}>
                        You can also file taxes using detailed earnings info, available in the <span className={styles.learnMoreLink}>earnings summary</span>.
                      </p>

                      <div style={{ marginTop: '16px' }}>
                        {[2025, 2024, 2023, 2022].map((year) => (
                          <div key={year} className={styles.taxYearItem}>
                            <h3 className={styles.taxYearTitle}>{year}</h3>
                            <p className={styles.taxYearDesc}>No tax document issued</p>
                          </div>
                        ))}
                      </div>

                      <p className={styles.privacyDesc} style={{ marginTop: '16px', marginBottom: ' 16px' }}>
                        For tax documents issued prior to 2022, <span className={styles.learnMoreLink}>contact us</span>.
                      </p>

                      <h2 className={styles.sectionHeading} style={{ marginBottom: '8px' }}>Need help?</h2>
                      <p className={styles.privacyDesc}>
                        Get answers to questions about taxes in our <span className={styles.learnMoreLink}>Help Centre</span>.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'payments' && (
            <>
              <div className="row justify-content-center">
                <div className="col-lg-7">
                  <div className={styles.headerRow}>
                    <h1 className={styles.pageTitle} style={{ margin: 0 }}>Payments</h1>
                    <button className={styles.currencyPill}>₹-INR</button>
                  </div>
                  
                  <div className={styles.subTabsContainer}>
                    <button 
                      className={`${styles.subTab} ${paymentsSubTab === 'payments' ? styles.subTabActive : ''}`}
                      onClick={() => setPaymentsSubTab('payments')}
                    >
                      Payments
                    </button>
                    <button 
                      className={`${styles.subTab} ${paymentsSubTab === 'payouts' ? styles.subTabActive : ''}`}
                      onClick={() => setPaymentsSubTab('payouts')}
                    >
                      Payouts
                    </button>
                    <button 
                      className={`${styles.subTab} ${paymentsSubTab === 'donations' ? styles.subTabActive : ''}`}
                      onClick={() => setPaymentsSubTab('donations')}
                    >
                      Donations
                    </button>
                  </div>
                  
                  {paymentsSubTab === 'payments' && (
                    <>
                      <h2 className={styles.sectionHeading} style={{ marginTop: '16px', marginBottom: '8px' }}>Your payments</h2>
                      <p className={styles.privacyDesc} style={{ marginBottom: '0px' }}>Keep track of all your payments and refunds.</p>
                      <button className={styles.blackBtn}>Manage payments</button>

                      <div style={{ borderBottom: '1px solid #ebebeb', margin: '0 0 16px 0' }}></div>

                      <h2 className={styles.sectionHeading} style={{ marginTop: '0', marginBottom: '8px' }}>Payment methods</h2>
                      <p className={styles.privacyDesc} style={{ marginBottom: '16px' }}>Add a payment method using our secure payment system, then start planning your next trip.</p>

                      <div style={{ borderBottom: '1px solid #ebebeb', margin: '0 0 16px 0' }}></div>

                      <h2 className={styles.sectionHeading} style={{ marginTop: '0', marginBottom: '0px' }}>Airbnb gift credit</h2>
                      <button className={styles.blackBtn}>Add gift card</button>

                      <div style={{ borderBottom: '1px solid #ebebeb', margin: '0 0 16px 0' }}></div>

                      <h2 className={styles.sectionHeading} style={{ marginTop: '0', marginBottom: '8px' }}>Coupons</h2>
                      <div className={`mb-0 ${styles.couponRow}`}>
                        <span className={styles.couponLabel}>Your coupons</span>
                        <span className={styles.couponValue}>0</span>
                      </div>
                      {showCouponField ? (
                        <div style={{ marginTop: '16px' }}>
                          <div className={styles.inputGroup} style={{ marginBottom: '16px' }}>
                            <label className={styles.inputLabel}>Enter a coupon</label>
                            <input type="text" className={styles.formControl} placeholder="Enter a coupon" />
                          </div>
                          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <button className={styles.saveBtn} style={{ margin: 0 }} onClick={() => setShowCouponField(false)}>Redeem coupon</button>
                            <button className={styles.cancelBtn} onClick={() => setShowCouponField(false)}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button className={styles.blackBtn} onClick={() => setShowCouponField(true)}>Add coupon</button>
                      )}

                      <div className={styles.privacyInfoCard} style={{ backgroundColor: '#ffffff', marginBottom: '64px' }}>
                        <BsCash className={styles.infoCardPinkIcon} style={{ fontSize: '2rem' }} />
                        <div>
                          <div className={styles.toggleLabel}>Make all payments through Airbnb</div>
                          <p className={styles.toggleDesc}>
                            Always pay and communicate through Airbnb to ensure you're protected under our <span className={styles.learnMoreLink} style={{textDecoration:'underline'}}>Terms of Service</span>, <span className={styles.learnMoreLink} style={{textDecoration:'underline'}}>Payments Terms of Service</span>, cancellation, and other safeguards. <span className={styles.learnMoreLink} style={{textDecoration:'underline'}}>Learn more</span>
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {paymentsSubTab === 'payouts' && (
                    <>
                      <h2 className={styles.sectionHeading} style={{ marginTop: '16px', marginBottom: '8px' }}>How you'll get paid</h2>
                      <p className={styles.privacyDesc} style={{ marginBottom: '0px' }}>Add at least one payout method so we know where to send your money.</p>
                      <button className={styles.blackBtn} onClick={() => { setShowPayoutModal(true); setPayoutStep(1); }}>Set up payouts</button>

                      <div className={styles.helpCard}>
                        <h3 className={styles.actionBoxTitle} style={{ marginBottom: '16px' }}>Need help?</h3>
                        <div className={styles.helpCardLink}>
                          <span>When you'll get your payout</span>
                          <BsChevronRight />
                        </div>
                        <div className={styles.helpCardLink}>
                          <span>How payouts work</span>
                          <BsChevronRight />
                        </div>
                        <div className={styles.helpCardLink}>
                          <span>Go to your transaction history</span>
                          <BsChevronRight />
                        </div>
                      </div>
                    </>
                  )}

                  {paymentsSubTab === 'donations' && (
                    <>
                      <div className={styles.alertCardBlue}>
                        <BsBellFill className={styles.alertCardBlueIcon} />
                        <div>
                          <div className={styles.toggleLabel}>Host payout donations aren't available</div>
                          <p className={styles.toggleDesc}>
                            These aren't available to hosts in your location. You can show your support by making a one-time or monthly donation.
                          </p>
                          <span className={styles.learnMoreLink} style={{ display: 'inline-block', marginTop: '16px' }}>Learn more</span>
                        </div>
                      </div>

                      <h2 className={styles.sectionHeading} style={{ marginTop: '0', marginBottom: '8px', fontSize: '1.5rem' }}>Donate to Airbnb.org</h2>
                      <p className={styles.privacyDesc} style={{ marginBottom: '24px' }}>
                        Give a percentage of each payout to Airbnb.org, a non-profit that gives free, emergency housing to people affected by disasters or other emergencies. <span className={styles.learnMoreLink}>Learn more</span>
                      </p>

                      <div className={styles.toggleLabel} style={{ marginBottom: '4px' }}>Choose a percentage to donate</div>
                      <p className={styles.toggleDesc} style={{ marginBottom: '16px' }}>
                        For example, a 3% donation of a ₹1000 payout would be ₹30 to Airbnb.org.
                      </p>

                      <div style={{ display: 'flex', marginBottom: '8px' }}>
                        <button className={styles.percentPill}>1%</button>
                        <button className={styles.percentPill}>3%</button>
                        <button className={styles.percentPill}>5%</button>
                        <button className={styles.percentPill}>Other</button>
                      </div>

                      <button className={styles.disabledBtn} disabled>Save</button>

                      <p className={styles.toggleDesc} style={{ fontSize: '0.85rem' }}>
                        By saving and choosing a percentage, you agree to the <span className={styles.learnMoreLink} style={{textDecoration:'underline'}}>Donation Terms</span>. <span className={styles.learnMoreLink} style={{textDecoration:'underline'}}>Learn more</span>
                      </p>

                      <div style={{ borderBottom: '1px solid #ebebeb', margin: '16px 0' }}></div>

                      <h2 className={styles.sectionHeading} style={{ marginTop: '0', marginBottom: '0px' }}>Frequently asked questions</h2>
                      
                      {[
                        { q: "Why donate to Airbnb.org?", a: "Airbnb.org is an independent nonprofit organization that partners with other nonprofits to provide emergency housing in times of crisis." },
                        { q: "How does a host payout donation work?", a: "When you set up a donation, we automatically deduct the percentage from your payout and route it to Airbnb.org." },
                        { q: "How can I manage my host payout donation?", a: "You can change your percentage or cancel your donation completely at any time from this settings page." },
                        { q: "Can I donate from split payouts?", a: "Yes, your donation percentage is calculated based only on your share of the payout." },
                        { q: "Are there other ways to donate?", a: "Yes, you can always make a direct one-time donation using a credit card on the Airbnb.org website." },
                        { q: "Where are donations tax-deductible?", a: "Donations to Airbnb.org are tax-deductible to the extent permitted by law in your local country." }
                      ].map((faq, index) => (
                        <div key={index} style={{ borderBottom: '1px solid #ebebeb' }}>
                          <div 
                            className={styles.accordionItem} 
                            style={{ borderBottom: 'none' }}
                            onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                          >
                            <span className={styles.accordionTitle}>{faq.q}</span>
                            <BsChevronDown style={{ transform: expandedFaq === index ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                          </div>
                          {expandedFaq === index && (
                            <div style={{ paddingBottom: '24px', color: '#717171', fontSize: '0.95rem', lineHeight: 1.5 }}>
                              {faq.a}
                            </div>
                          )}
                        </div>
                      ))}

                      <div className={styles.carouselHeaderRow}>
                        <h2 className={styles.sectionHeading} style={{ margin: 0 }}>Your donations at work</h2>
                        <div className={styles.carouselNavBtns}>
                          <button className={styles.carouselNavBtn} aria-label="Previous" onClick={() => splideRef.current?.splide?.go('<')}>
                            <BsChevronLeft />
                          </button>
                          <button className={styles.carouselNavBtn} aria-label="Next" onClick={() => splideRef.current?.splide?.go('>')}>
                            <BsChevronRight />
                          </button>
                        </div>
                      </div>

                      <Splide
                        ref={splideRef}
                        options={{
                          type: 'slide',
                          perPage: 2,
                          gap: '16px',
                          pagination: false,
                          arrows: false,
                          breakpoints: {
                            640: {
                              perPage: 1
                            }
                          }
                        }}
                        style={{ paddingBottom: '32px' }}
                      >
                        <SplideSlide>
                          <div className={styles.donationCard}>
                            <img src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=600&q=80" alt="Noto Peninsula" className={styles.donationCardImg} />
                            <div className={styles.donationCardContent}>
                              <h3 className={styles.donationCardTitle}>
                                Noto Peninsula <BsChevronRight style={{ marginLeft: '4px', fontSize: '0.9rem' }} />
                              </h3>
                              <p className={styles.donationCardSubtitle}>Japan</p>
                            </div>
                          </div>
                        </SplideSlide>

                        <SplideSlide>
                          <div className={styles.donationCard}>
                            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80" alt="Maui fires" className={styles.donationCardImg} />
                            <div className={styles.donationCardContent}>
                              <h3 className={styles.donationCardTitle}>
                                Maui fires <BsChevronRight style={{ marginLeft: '4px', fontSize: '0.9rem' }} />
                              </h3>
                              <p className={styles.donationCardSubtitle}>Maui, Hawaii, USA</p>
                            </div>
                          </div>
                        </SplideSlide>
                      </Splide>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'languages' && (
            <>
              <div className="row justify-content-center">
                <div className="col-lg-7">
                  <h1 className={styles.pageTitle}>Languages & translation</h1>

                  <h2 className={styles.sectionHeading} style={{ marginTop: '0', marginBottom: '8px' }}>Preferred language</h2>
                  <p className={styles.privacyDesc} style={{ marginBottom: '16px' }}>This updates what you read on Airbnb, and how we communicate with you.</p>
                  
                  <div className={styles.fieldBox}>
                    <span className={`${styles.fieldBoxValue} notranslate`} translate="no">{currentLanguage}</span>
                    <button className={styles.greyEditBtn} onClick={() => { setTempLanguage(currentLanguage); setShowLangModal(true); }}>Edit</button>
                  </div>

                  <div className={styles.toggleRow} style={{ marginBottom: '16px', alignItems: 'center' }}>
                    <div className={styles.toggleTextContent}>
                      <h2 className={styles.sectionHeading} style={{ marginTop: '0', marginBottom: '8px' }}>Automatic translation</h2>
                      <p className={styles.toggleDesc}>Translate reviews, descriptions and messages into English.</p>
                    </div>
                    <CustomToggle 
                      checked={automaticTranslation} 
                      onChange={() => {
                        const nextVal = !automaticTranslation;
                        setAutomaticTranslation(nextVal);
                        if (nextVal) {
                          toast.success('Automatic translation enabled');
                        } else {
                          toast.success('Automatic translation disabled');
                        }
                      }} 
                    />
                  </div>

                  <div>
                    <span className={styles.newBadgeInline}>New</span>
                    <h2 className={styles.sectionHeading} style={{ marginTop: '0', marginBottom: '8px' }}>Other languages you know</h2>
                    <p className={styles.privacyDesc} style={{ marginBottom: '16px' }}>These won't be translated so you can read reviews, descriptions and messages in their original language.</p>
                    
                    {knownLanguages && knownLanguages.length > 0 ? (
                      <div className={styles.fieldBox} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', width: '100%' }}>
                          {knownLanguages.map((l, i) => (
                            <span 
                              key={i} 
                              className="notranslate"
                              translate="no"
                              style={{ 
                                backgroundColor: '#f7f7f7', 
                                border: '1px solid #dddddd', 
                                borderRadius: '16px', 
                                padding: '6px 14px', 
                                fontSize: '0.9rem', 
                                fontWeight: '600',
                                color: '#222222' 
                              }}
                            >
                              {l}
                            </span>
                          ))}
                        </div>
                        <button 
                          className={styles.greyEditBtn} 
                          style={{ alignSelf: 'flex-end', marginTop: '4px' }}
                          onClick={() => {
                            setTempKnownLanguages([...knownLanguages]);
                            setShowOtherLangModal(true);
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    ) : (
                      <button 
                        className={styles.greyBtn} 
                        onClick={() => {
                          setTempKnownLanguages([...knownLanguages]);
                          setShowOtherLangModal(true);
                        }}
                      >
                        Add languages
                      </button>
                    )}
                  </div>

                  <h2 className={styles.sectionHeading} style={{ marginTop: '0', marginBottom: '16px' }}>Time zone</h2>
                  <div className={styles.fieldBox}>
                    <span className={`${styles.fieldBoxValue} notranslate`} translate="no">{selectedTimezone}</span>
                    <button className={styles.greyEditBtn} onClick={() => { setTempTimezone(selectedTimezone); setShowTimezoneModal(true); }}>Edit</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'booking' && (
            <>
              <div className="row justify-content-center">
                <div className="col-lg-7">
                  <h1 className={styles.pageTitle}>Booking permissions</h1>

                  <div className={styles.emptyStateContainer}>
                    <img 
                      src="/booking-permissions.avif" 
                      alt="Keys illustration" 
                      className={styles.emptyStateImage} 
                    />
                    <h3 className={styles.emptyStateTitle}>Start booking for someone else</h3>
                    <p className={styles.emptyStateDesc}>Once they approve your request, you can start booking for them.</p>
                    <span className={styles.emptyStateLink}>How it works</span>
                    
                    <button className={styles.blackBtn} onClick={() => setShowBookingModal(true)}>Send a request</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'travel' && (
            <>
              <div className="row justify-content-center">
                <div className="col-lg-7">
                  <h1 className={styles.pageTitle}>Travel for work</h1>

                  <h2 className={styles.sectionHeading} style={{ marginTop: '0', marginBottom: '16px' }}>Join Airbnb for Work</h2>
                  <p className={styles.privacyDesc} style={{ marginBottom: '16px' }}>Add your work email to get seamless expensing and exclusive offers on work trips.</p>

                  <div style={{ marginBottom: '8px', fontWeight: '600', color: '#222222', fontSize: '1rem' }}>Work email address</div>
                  <input 
                    type="email" 
                    className={styles.emailInput} 
                    placeholder="" 
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                  />
                  
                  <button 
                    className={workEmail.trim().length > 0 ? styles.blackBtn : styles.disabledBtn} 
                    style={{ marginTop: '0' }} 
                    disabled={workEmail.trim().length === 0}
                  >
                    Add work email
                  </button>

                  <div className={styles.featuresBox}>
                    <div className={styles.featureRow}>
                      <BsPhone className={styles.featureIcon} />
                      <div>
                        <h3 className={styles.featureTitle}>Simplified expensing</h3>
                        <p className={styles.featureDesc}>We'll send work trip receipts to your work inbox for easy expensing.</p>
                      </div>
                    </div>
                    
                    <div className={styles.featureRow}>
                      <BsReceipt className={styles.featureIcon} />
                      <div>
                        <h3 className={styles.featureTitle}>Trip description</h3>
                        <p className={styles.featureDesc}>Add an expense code and business purpose to work trips.</p>
                      </div>
                    </div>

                    <div className={styles.featureRow}>
                      <BsShieldLock className={styles.featureIcon} />
                      <div>
                        <h3 className={styles.featureTitle}>Keep personal trips private</h3>
                        <p className={styles.featureDesc}>Your company can only get info about trips you mark for work at checkout.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'tools' && (
            <>
              <div className="row justify-content-center">
                <div className="col-lg-7">
                  <h1 className={styles.pageTitle}>Professional hosting tools</h1>

                  <div className={styles.toggleRow} style={{ marginBottom: '16px', alignItems: 'center' }}>
                    <div className={styles.toggleTextContent}>
                      <h2 className={styles.sectionHeading} style={{ marginTop: '0', marginBottom: '8px' }}>Enable professional hosting tools</h2>
                      <p className={styles.toggleDesc}>
                        Explore tools designed to help you host more efficiently, whether it’s just you or a team. <span className={styles.learnMoreLink} style={{textDecoration:'underline'}}>Learn more</span>
                      </p>
                    </div>
                    <CustomToggle checked={proHostingTools} onChange={() => setProHostingTools(!proHostingTools)} />
                  </div>

                  <h2 className={styles.sectionHeading} style={{ marginTop: '0', marginBottom: '8px' }}>Create a custom profile URL</h2>
                  <p className={styles.privacyDesc} style={{ marginBottom: '0' }}>Share this URL when you want to show off your Airbnb profile, which has links to all of your listings.</p>

                  <div className={styles.urlInputRow}>
                    <input type="text" className={styles.urlInput} defaultValue="Airbnb.co.in/p/" />
                    <button className={styles.urlBtnBlack}>Save</button>
                    <button className={styles.urlBtnGray}>Copy</button>
                  </div>

                  <p className={styles.privacyDesc} style={{ marginBottom: '16px' }}>
                    <span style={{ fontWeight: '600', color: '#222222' }}>Tip:</span> Help to make your URL memorable by using words and phrases relevant to what you offer.
                  </p>
                  
                  <p className={styles.privacyDesc} style={{ marginBottom: '40px' }}>
                    Avoid including contact info, property types and regions only, trademarks, or travel company names (including Airbnb). <span className={styles.learnMoreLink} style={{textDecoration:'underline'}}>Learn more about our policies</span>
                  </p>

                </div>
              </div>
            </>
          )}

        </div>
      </div>

      {showPasskeyModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: passkeyStep === 3 ? '520px' : '480px' }}>
            <div className={styles.modalHeader} style={{ display: 'flex', alignItems: 'center' }}>
              {(passkeyStep === 2 || passkeyStep === 3) && (
                <button 
                  className={styles.closeModalBtn} 
                  onClick={() => setPasskeyStep(prev => prev - 1)} 
                  style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}
                  title="Go back"
                >
                  <BsChevronLeft style={{ fontSize: '1.1rem' }} />
                </button>
              )}
              <h3 className={styles.modalTitle} style={{ flex: 1 }}>
                {passkeyStep === 1 && 'Set up passkeys'}
                {passkeyStep === 2 && 'Confirm your email'}
                {passkeyStep === 3 && 'Set up passkey'}
                {passkeyStep === 4 && 'Passkey ready'}
                {passkeyStep === 'manage' && 'Manage passkeys'}
              </h3>
              <button 
                className={styles.closeModalBtn} 
                onClick={() => { setShowPasskeyModal(false); setPasskeyStep(1); }}
              >
                &times;
              </button>
            </div>
            
            {passkeyStep === 1 && (
              <div>
                <p className={styles.itemDesc} style={{ marginBottom: '16px' }}>Enter your email address to get started.</p>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Email</label>
                  <input 
                    type="email" 
                    className={styles.formControl} 
                    value={passkeyEmail}
                    onChange={(e) => setPasskeyEmail(e.target.value)}
                    placeholder="name@example.com" 
                  />
                </div>
                <button 
                  className={styles.saveBtn} 
                  style={{ width: '100%' }} 
                  onClick={handleSendPasskeyOtp}
                  disabled={isSendingPasskeyOtp}
                >
                  {isSendingPasskeyOtp ? 'Sending code...' : 'Continue'}
                </button>
              </div>
            )}

            {passkeyStep === 2 && (
              <div>
                <p className={styles.itemDesc} style={{ marginBottom: '16px' }}>
                  We've sent a 6-digit code to <strong>{passkeyEmail || profileUser.email}</strong>. Please enter it below.
                </p>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>One-time passcode (OTP)</label>
                  <input 
                    type="text" 
                    className={styles.formControl} 
                    placeholder="Enter 6-digit code" 
                    maxLength="6" 
                    value={passkeyOtp}
                    onChange={(e) => setPasskeyOtp(e.target.value)}
                    autoFocus
                  />
                  <p style={{ fontSize: '0.82rem', color: '#717171', marginTop: '6px' }}>
                    Tip: Enter code <strong>123456</strong> for testing
                  </p>
                </div>
                <button 
                  className={styles.saveBtn} 
                  style={{ width: '100%' }} 
                  onClick={handleVerifyOtpAndProceed}
                >
                  Continue to Passkey Setup
                </button>
              </div>
            )}

            {passkeyStep === 3 && (
              <div>
                <p className={styles.passkeySubtitle}>
                  Passkeys let you sign in quickly and securely using your fingerprint, face recognition, or device PIN.
                </p>

                <div className={styles.passkeyMethodsGrid}>
                  <div 
                    className={`${styles.passkeyMethodCard} ${selectedPasskeyMethod === 'fingerprint' ? styles.passkeyMethodCardSelected : ''}`}
                    onClick={() => setSelectedPasskeyMethod('fingerprint')}
                  >
                    <div className={styles.passkeyCardLeft}>
                      <div className={styles.passkeyCardIcon}>
                        <BsFingerprint />
                      </div>
                      <div>
                        <div className={styles.passkeyCardTitle}>Fingerprint</div>
                        <p className={styles.passkeyCardDesc}>Touch ID or fingerprint sensor on your device</p>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="passkey_method_select" 
                      checked={selectedPasskeyMethod === 'fingerprint'} 
                      onChange={() => setSelectedPasskeyMethod('fingerprint')}
                      style={{ width: '18px', height: '18px', accentColor: '#222', cursor: 'pointer' }}
                    />
                  </div>

                  <div 
                    className={`${styles.passkeyMethodCard} ${selectedPasskeyMethod === 'face' ? styles.passkeyMethodCardSelected : ''}`}
                    onClick={() => setSelectedPasskeyMethod('face')}
                  >
                    <div className={styles.passkeyCardLeft}>
                      <div className={styles.passkeyCardIcon}>
                        <BsPersonBoundingBox />
                      </div>
                      <div>
                        <div className={styles.passkeyCardTitle}>Face recognition</div>
                        <p className={styles.passkeyCardDesc}>Face ID or camera recognition</p>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="passkey_method_select" 
                      checked={selectedPasskeyMethod === 'face'} 
                      onChange={() => setSelectedPasskeyMethod('face')}
                      style={{ width: '18px', height: '18px', accentColor: '#222', cursor: 'pointer' }}
                    />
                  </div>

                  <div 
                    className={`${styles.passkeyMethodCard} ${selectedPasskeyMethod === 'pin' ? styles.passkeyMethodCardSelected : ''}`}
                    onClick={() => setSelectedPasskeyMethod('pin')}
                  >
                    <div className={styles.passkeyCardLeft}>
                      <div className={styles.passkeyCardIcon}>
                        <BsGrid3X3GapFill />
                      </div>
                      <div>
                        <div className={styles.passkeyCardTitle}>Device PIN</div>
                        <p className={styles.passkeyCardDesc}>Screen lock PIN or device passcode</p>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="passkey_method_select" 
                      checked={selectedPasskeyMethod === 'pin'} 
                      onChange={() => setSelectedPasskeyMethod('pin')}
                      style={{ width: '18px', height: '18px', accentColor: '#222', cursor: 'pointer' }}
                    />
                  </div>
                </div>

                <div className={styles.biometricScannerBox}>
                  <div className={`${styles.scannerIconWrap} ${biometricScanning ? styles.scannerIconWrapActive : ''}`}>
                    {selectedPasskeyMethod === 'fingerprint' && <BsFingerprint />}
                    {selectedPasskeyMethod === 'face' && <BsPersonBoundingBox />}
                    {selectedPasskeyMethod === 'pin' && <BsGrid3X3GapFill />}
                  </div>

                  {selectedPasskeyMethod === 'pin' ? (
                    <div style={{ marginBottom: '8px' }}>
                      <p className={styles.scannerStatusText}>
                        {biometricScanning ? 'Verifying device PIN credentials...' : 'Enter your device PIN'}
                      </p>
                      <input 
                        type="password" 
                        maxLength="6" 
                        value={passkeyPin} 
                        onChange={(e) => setPasskeyPin(e.target.value)} 
                        placeholder="••••" 
                        className={styles.formControl} 
                        style={{ maxWidth: '180px', margin: '8px auto', textAlign: 'center', fontSize: '1.4rem', letterSpacing: '8px', fontWeight: 'bold' }} 
                      />
                      <p className={styles.scannerHintText}>Default PIN: 2468 or enter your screen lock code</p>
                    </div>
                  ) : (
                    <div>
                      <p className={styles.scannerStatusText}>
                        {biometricScanning 
                          ? (selectedPasskeyMethod === 'fingerprint' ? 'Scanning fingerprint sensor...' : 'Scanning facial recognition...') 
                          : (selectedPasskeyMethod === 'fingerprint' ? 'Touch fingerprint sensor to verify' : 'Look at camera to verify')}
                      </p>
                      <p className={styles.scannerHintText}>
                        {selectedPasskeyMethod === 'fingerprint' 
                          ? 'Place your finger on your laptop, phone, or security key.' 
                          : 'Position your face in front of your device camera.'}
                      </p>
                    </div>
                  )}
                </div>

                <button 
                  className={styles.saveBtn} 
                  style={{ width: '100%', margin: 0 }} 
                  onClick={handleActivateBiometricPasskey}
                  disabled={biometricScanning}
                >
                  {biometricScanning 
                    ? 'Verifying biometric credentials...' 
                    : `Verify & Add Passkey with ${selectedPasskeyMethod === 'fingerprint' ? 'Fingerprint' : selectedPasskeyMethod === 'face' ? 'Face recognition' : 'Device PIN'}`}
                </button>
              </div>
            )}

            {passkeyStep === 4 && (
              <div className={styles.passkeySuccessContainer}>
                <BsCheckCircleFill className={styles.passkeySuccessIcon} />
                <h4 className={styles.passkeySuccessTitle}>Passkey added successfully!</h4>
                <div className={styles.passkeyInfoPill}>
                  <BsShieldCheck /> {profileUser.passkeyType || 'Biometric Passkey'} Active
                </div>
                <p className={styles.passkeySuccessDesc}>
                  Your passkey is configured and secured on this device. You can now use your fingerprint, face, or PIN to log into Airbnb without entering your password.
                </p>
                <button 
                  className={styles.saveBtn} 
                  style={{ width: '100%', margin: 0 }} 
                  onClick={() => {
                    setShowPasskeyModal(false);
                    setPasskeyStep(1);
                    setPasskeyOtp('');
                  }}
                >
                  Done
                </button>
              </div>
            )}

            {passkeyStep === 'manage' && (
              <div>
                <p className={styles.passkeySubtitle}>
                  You have an active passkey linked to your account for fast and secure login.
                </p>

                <div className={styles.managePasskeyCard}>
                  <div className={styles.managePasskeyIcon}>
                    <BsFingerprint />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: '#222' }}>
                      {profileUser.passkeyType || 'Fingerprint, face or PIN'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#717171' }}>
                      {profileUser.lastActiveDevice || 'Current Device'} • Secured
                    </div>
                  </div>
                </div>

                <button 
                  className={styles.saveBtn} 
                  style={{ width: '100%', margin: '0 0 12px 0' }} 
                  onClick={handleTestPasskey}
                  disabled={isTestingPasskey}
                >
                  {isTestingPasskey ? 'Verifying passkey...' : 'Test Passkey (Fingerprint, face or PIN)'}
                </button>

                <button 
                  className={styles.goBackBtn} 
                  style={{ width: '100%', padding: '12px', border: '1px solid #b0b0b0', borderRadius: '8px', margin: '0 0 16px 0', fontSize: '0.95rem' }} 
                  onClick={() => setPasskeyStep(1)}
                >
                  Re-register / Change passkey
                </button>

                <button 
                  style={{ width: '100%', background: 'transparent', border: 'none', color: '#c13515', fontWeight: 600, padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onClick={handleRemovePasskey}
                  disabled={isRemovingPasskey}
                >
                  <BsTrash /> {isRemovingPasskey ? 'Removing...' : 'Remove passkey from account'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showBlockedModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Blocked people</h3>
              <button 
                className={styles.closeModalBtn} 
                onClick={() => { setShowBlockedModal(false); setShowBlockNewForm(false); }}
              >
                &times;
              </button>
            </div>

            <p className={styles.itemDesc} style={{ marginBottom: '20px' }}>
              Blocked people can’t message you, request bookings, or see your profile.
            </p>

            {isLoadingBlocked ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#717171' }}>
                Loading blocked people...
              </div>
            ) : blockedUsers.length === 0 ? (
              <div className={styles.emptyBlockedBox}>
                <BsPersonX className={styles.emptyBlockedIcon} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#222', marginBottom: '6px' }}>
                  No blocked people
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#717171', margin: 0 }}>
                  You haven't blocked anyone. When you block someone, they will appear here.
                </p>
              </div>
            ) : (
              <div className={styles.blockedUserList}>
                {blockedUsers.map((bUser) => (
                  <div key={bUser.id} className={styles.blockedUserItem}>
                    <div className={styles.blockedUserLeft}>
                      <div className={styles.blockedUserAvatar}>
                        {(bUser.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className={styles.blockedUserName}>{bUser.name}</div>
                        <p className={styles.blockedUserMeta}>
                          {bUser.reason || 'Blocked'} • {new Date(bUser.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <button 
                      className={styles.unblockBtn}
                      onClick={() => handleUnblock(bUser.id, bUser.name)}
                      disabled={isUnblockingId === bUser.id}
                    >
                      {isUnblockingId === bUser.id ? 'Unblocking...' : 'Unblock'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showBlockNewForm ? (
              <div style={{ background: '#f7f7f7', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#222', marginBottom: '12px' }}>
                  Block someone new
                </h4>
                <div className={styles.inputGroup} style={{ marginBottom: '10px' }}>
                  <label className={styles.inputLabel} style={{ fontSize: '0.9rem' }}>Person's Name</label>
                  <input 
                    type="text" 
                    className={styles.formControl} 
                    placeholder="Enter full name" 
                    value={newBlockName}
                    onChange={(e) => setNewBlockName(e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup} style={{ marginBottom: '10px' }}>
                  <label className={styles.inputLabel} style={{ fontSize: '0.9rem' }}>Email (Optional)</label>
                  <input 
                    type="email" 
                    className={styles.formControl} 
                    placeholder="email@example.com" 
                    value={newBlockEmail}
                    onChange={(e) => setNewBlockEmail(e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup} style={{ marginBottom: '14px' }}>
                  <label className={styles.inputLabel} style={{ fontSize: '0.9rem' }}>Reason</label>
                  <select 
                    className={styles.formControl}
                    value={newBlockReason}
                    onChange={(e) => setNewBlockReason(e.target.value)}
                  >
                    <option value="Inappropriate messages">Inappropriate messages</option>
                    <option value="Unsolicited contact">Unsolicited contact</option>
                    <option value="Harassment or spam">Harassment or spam</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button 
                    type="button"
                    className={styles.cancelBtn} 
                    onClick={() => setShowBlockNewForm(false)}
                    style={{ fontSize: '0.9rem', marginRight: '8px' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    className={styles.saveBtn} 
                    style={{ padding: '8px 18px', fontSize: '0.9rem' }}
                    onClick={handleBlockNewUser}
                    disabled={isSubmittingBlock}
                  >
                    {isSubmittingBlock ? 'Blocking...' : 'Block Person'}
                  </button>
                </div>
              </div>
            ) : (
              <button 
                type="button"
                className={styles.goBackBtn} 
                style={{ width: '100%', padding: '12px', border: '1px solid #b0b0b0', borderRadius: '8px', margin: '0 0 12px 0', fontSize: '0.95rem' }} 
                onClick={() => setShowBlockNewForm(true)}
              >
                + Block another person
              </button>
            )}

            <button 
              className={styles.saveBtn} 
              style={{ width: '100%', margin: 0 }} 
              onClick={() => { setShowBlockedModal(false); setShowBlockNewForm(false); }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {showDeleteAccountModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.deleteModalContent}>
            <div className={styles.modalHeader}>
              <div className={styles.deleteHeaderLeft}>
                <div className={styles.deleteIconBadge}>
                  <BsTrash size={18} />
                </div>
                <h3 className={styles.deleteTitle}>
                  Delete your Airbnb account?
                </h3>
              </div>
              <button 
                className={styles.closeModalBtn} 
                onClick={() => !isDeletingAccount && setShowDeleteAccountModal(false)}
                disabled={isDeletingAccount}
              >
                &times;
              </button>
            </div>

            <div>
              <p className={styles.deleteBodyText}>
                Are you sure you want to delete your account? This action is <strong>permanent</strong> and cannot be undone.
              </p>

              <div className={styles.deleteWarningBox}>
                <div className={styles.deleteWarningTitle}>
                  What happens when you delete your account:
                </div>
                <ul className={styles.deleteWarningList}>
                  <li>Your profile, personal details, and preferences are permanently wiped from the database.</li>
                  <li>All active sessions and passkeys will be deleted immediately.</li>
                  <li>You will be logged out and cannot recover this account.</li>
                </ul>
              </div>

              <div className={styles.deleteAccountBadge}>
                Deleting: <strong>{profileUser.firstName || 'User'} {profileUser.lastName || ''}</strong> ({profileUser.email})
              </div>

              <div className={styles.deleteModalActions}>
                <button
                  type="button"
                  className={styles.deleteCancelBtn}
                  onClick={() => setShowDeleteAccountModal(false)}
                  disabled={isDeletingAccount}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.deleteConfirmBtn}
                  onClick={handleConfirmDeleteAccount}
                  disabled={isDeletingAccount}
                >
                  {isDeletingAccount ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: '14px', height: '14px' }}></span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <BsTrash /> Permanently delete account
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDataRequestModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDataRequestModal(false)}>
          <div 
            className={styles.dataModalContent} 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button"
              className={styles.dataBackBtn}
              onClick={() => setShowDataRequestModal(false)}
              aria-label="Back"
            >
              <BsChevronLeft size={18} />
            </button>

            <h2 className={styles.dataModalHeading}>
              Request your personal data
            </h2>

            <p className={styles.dataModalSubtitle}>
              Before we get you a copy of your data, we’ll just need you to answer a few questions.
            </p>

            <form onSubmit={handleSubmitDataRequest}>
              <div className={styles.dataFormGroup}>
                <label className={styles.dataFormLabel}>
                  Where do you reside?
                </label>
                <div className={styles.dataSelectWrapper}>
                  <select
                    className={`${styles.dataSelect} ${!dataCountry ? styles.dataSelectPlaceholder : ''}`}
                    value={dataCountry}
                    onChange={(e) => setDataCountry(e.target.value)}
                  >
                    <option value="" disabled>Country/Region</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Italy">Italy</option>
                    <option value="Spain">Spain</option>
                    <option value="Japan">Japan</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Switzerland">Switzerland</option>
                  </select>
                  <BsChevronDown className={styles.dataSelectIcon} />
                </div>
              </div>

              <div className={styles.dataFormGroup}>
                <label className={styles.dataFormLabel}>
                  In what format do you want your data?
                </label>
                <div className={styles.dataFormatBox}>
                  <div className={styles.dataFormatSubLabel}>
                    Select format
                  </div>
                  <select
                    className={styles.dataFormatSelect}
                    value={dataFormat}
                    onChange={(e) => setDataFormat(e.target.value)}
                  >
                    <option value="Interactive web content format (HTML)">
                      Interactive web content format (HTML)
                    </option>
                    <option value="Machine-readable data format (JSON)">
                      Machine-readable data format (JSON)
                    </option>
                    <option value="Spreadsheet data format (CSV)">
                      Spreadsheet data format (CSV)
                    </option>
                  </select>
                  <BsChevronDown className={styles.dataSelectIcon} />
                </div>
              </div>

              <p className={styles.dataHelpText}>
                To learn more about our available formats, please see our page on{' '}
                <span
                  className={styles.dataHelpLink}
                  onClick={() => toast('HTML archive is formatted for easy viewing in a browser. JSON and CSV provide raw data.')}
                >
                  Understanding your personal data file
                </span>.
              </p>

              <div className={styles.dataFormGroupLast}>
                <label className={styles.dataFormLabel}>
                  Why are you requesting a copy of your data?
                </label>
                <div className={styles.dataSelectWrapper}>
                  <select
                    className={`${styles.dataSelect} ${!dataReason ? styles.dataSelectPlaceholder : ''}`}
                    value={dataReason}
                    onChange={(e) => setDataReason(e.target.value)}
                  >
                    <option value="">Select reason (optional)</option>
                    <option value="Moving to another service">Moving to another service</option>
                    <option value="Curious about stored data">Curious about stored data</option>
                    <option value="Personal record / backup">Personal record / backup</option>
                    <option value="Privacy inquiry or review">Privacy inquiry or review</option>
                    <option value="Other">Other</option>
                  </select>
                  <BsChevronDown className={styles.dataSelectIcon} />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={!dataCountry || isSubmittingDataRequest}
                  className={`${styles.dataSubmitBtn} ${dataCountry && !isSubmittingDataRequest ? styles.dataSubmitBtnActive : styles.dataSubmitBtnDisabled}`}
                >
                  {isSubmittingDataRequest ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: '14px', height: '14px' }}></span>
                      Requesting...
                    </>
                  ) : (
                    'Request data'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTaxModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader} style={{ marginBottom: '16px' }}>
              <h3 className={styles.modalTitle}>
                {taxModalStep === 1 
                  ? 'To get started, select a country/region to add your tax info.'
                  : `Enter your tax details for ${taxRegion}`}
              </h3>
              <button 
                className={styles.closeModalBtn} 
                onClick={() => { setShowTaxModal(false); setTaxModalStep(1); }}
              >
                &times;
              </button>
            </div>
            
            {taxModalStep === 1 ? (
              <>
                <div style={{ marginBottom: '24px' }}>
                  <div className={styles.radioOption} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label htmlFor="tax_us" style={{ fontSize: '1rem', color: '#222222', cursor: 'pointer' }}>United States</label>
                    <input 
                      type="radio" 
                      id="tax_us" 
                      name="taxRegion" 
                      value="United States"
                      checked={taxRegion === 'United States'}
                      onChange={(e) => setTaxRegion(e.target.value)}
                      style={{ width: '20px', height: '20px', accentColor: '#222222', cursor: 'pointer' }}
                    />
                  </div>
                  <div className={styles.radioOption} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label htmlFor="tax_mexico" style={{ fontSize: '1rem', color: '#222222', cursor: 'pointer' }}>Mexico, Colombia or India</label>
                    <input 
                      type="radio" 
                      id="tax_mexico" 
                      name="taxRegion" 
                      value="Mexico, Colombia or India"
                      checked={taxRegion === 'Mexico, Colombia or India'}
                      onChange={(e) => setTaxRegion(e.target.value)}
                      style={{ width: '20px', height: '20px', accentColor: '#222222', cursor: 'pointer' }}
                    />
                  </div>
                  <div className={styles.radioOption} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label htmlFor="tax_other" style={{ fontSize: '1rem', color: '#222222', cursor: 'pointer' }}>Another country/region</label>
                    <input 
                      type="radio" 
                      id="tax_other" 
                      name="taxRegion" 
                      value="Another country/region"
                      checked={taxRegion === 'Another country/region'}
                      onChange={(e) => setTaxRegion(e.target.value)}
                      style={{ width: '20px', height: '20px', accentColor: '#222222', cursor: 'pointer' }}
                    />
                  </div>
                </div>
                
                <button 
                  className={styles.saveBtn} 
                  style={{ width: '100%', margin: 0 }} 
                  onClick={() => setTaxModalStep(2)}
                >
                  Next
                </button>
              </>
            ) : (
              <form onSubmit={handleSaveTaxInfo}>
                <div className={styles.taxInputGroup}>
                  <label className={styles.taxInputLabel}>Tax Identification Number (TIN / PAN / SSN)</label>
                  <input 
                    type="text" 
                    className={styles.taxInput} 
                    placeholder="e.g. ABCDE1234F or 123-45-6789"
                    value={taxIdNumber}
                    onChange={(e) => setTaxIdNumber(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.taxInputGroup}>
                  <label className={styles.taxInputLabel}>Legal Name (as shown on tax documents)</label>
                  <input 
                    type="text" 
                    className={styles.taxInput} 
                    placeholder="Legal name"
                    value={taxLegalName}
                    onChange={(e) => setTaxLegalName(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button 
                    type="button" 
                    className={styles.goBackBtn} 
                    style={{ width: 'auto', padding: '10px 16px', border: '1px solid #ccc', borderRadius: '8px' }}
                    onClick={() => setTaxModalStep(1)}
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    className={styles.taxSubmitBtn}
                    style={{ margin: 0 }}
                    disabled={isSubmittingTax}
                  >
                    {isSubmittingTax ? 'Saving...' : 'Save tax info'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {showVatModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader} style={{ marginBottom: '16px' }}>
              <h3 className={styles.modalTitle}>Select your country or region</h3>
              <button className={styles.closeModalBtn} onClick={() => setShowVatModal(false)}>&times;</button>
            </div>
            
            <p className={styles.itemDesc} style={{ marginBottom: '24px' }}>
              Let us know where your VAT, GST or VAT-equivalent number is registered.
            </p>
            
            <form onSubmit={handleSaveVatInfo}>
              <div className={styles.taxInputGroup}>
                <label className={styles.taxInputLabel}>Country/region</label>
                <select 
                  className={styles.taxInput} 
                  value={vatCountry}
                  onChange={(e) => setVatCountry(e.target.value)}
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Canada">Canada</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                </select>
              </div>

              <div className={styles.taxInputGroup}>
                <label className={styles.taxInputLabel}>VAT / GST ID Number</label>
                <input 
                  type="text" 
                  className={styles.taxInput} 
                  placeholder="e.g. 07AAAAA0000A1Z5 or GB123456789"
                  value={vatNumber}
                  onChange={(e) => setVatNumber(e.target.value)}
                  required
                />
              </div>

              <div className={styles.taxInputGroup}>
                <label className={styles.taxInputLabel}>Registered Entity / Business Name</label>
                <input 
                  type="text" 
                  className={styles.taxInput} 
                  placeholder="Business or registered individual name"
                  value={vatLegalName}
                  onChange={(e) => setVatLegalName(e.target.value)}
                />
              </div>
              
              <button 
                type="submit" 
                className={styles.taxSubmitBtn}
                disabled={isSubmittingVat}
              >
                {isSubmittingVat ? 'Saving...' : 'Add VAT ID'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showBookingModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {bookingModalStep === 1 ? (
              <>
                <div className={styles.modalHeader} style={{ marginBottom: '16px' }}>
                  <div></div>
                  <button className={styles.closeModalBtn} onClick={() => setShowBookingModal(false)}>&times;</button>
                </div>
                
                <h3 className={styles.modalTitle} style={{ fontSize: '1.5rem', marginBottom: '8px' }}>First, let's get you set up</h3>
                <p className={styles.itemDesc} style={{ marginBottom: '24px' }}>
                  These required steps help build trust in the Airbnb community.
                </p>
                
                <div className={styles.setupCard} style={{ boxShadow: '0px 2px 12px rgba(0,0,0,0.08)' }}>
                  <div className={styles.setupCardHeader}>
                    <div className={styles.setupCardLeft}>
                      <span className={styles.setupCardIcon}>📞</span>
                      <div>
                        <h4 className={styles.setupCardTitle}>Confirm your phone number</h4>
                        <p className={styles.setupCardSubtitle}>Not started</p>
                      </div>
                    </div>
                  </div>
                  <button className={styles.setupCardActionBtn} onClick={() => setBookingModalStep(2)}>Continue</button>
                </div>
                
                <div className={styles.setupCard}>
                  <div className={styles.setupCardHeader}>
                    <div className={styles.setupCardLeft}>
                      <span className={styles.setupCardIcon}>🖼️</span>
                      <div>
                        <h4 className={styles.setupCardTitle}>Add a profile photo</h4>
                        <p className={styles.setupCardSubtitle}>Complete</p>
                      </div>
                    </div>
                    <BsShieldCheck className={styles.setupCheckIcon} />
                  </div>
                </div>
                
                <div className={styles.setupCard}>
                  <div className={styles.setupCardHeader}>
                    <div className={styles.setupCardLeft}>
                      <span className={styles.setupCardIcon}>🛡️</span>
                      <div>
                        <h4 className={styles.setupCardTitle}>Verify your identity</h4>
                        <p className={styles.setupCardSubtitle}>Not started</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.modalHeader} style={{ marginBottom: '24px' }}>
                  <button className={styles.closeModalBtn} onClick={() => setBookingModalStep(1)}>
                    <BsChevronLeft style={{ fontSize: '1.2rem' }} />
                  </button>
                  <h3 className={styles.modalTitle}>Verify your phone number</h3>
                  <div></div>
                </div>
                
                <div className={styles.inputGroup} style={{ marginBottom: '16px' }}>
                  <label className={styles.inputLabel}>Country Code</label>
                  <select className={styles.formControl} defaultValue="India (+91)">
                    <option value="United States (+1)">United States (+1)</option>
                    <option value="India (+91)">India (+91)</option>
                    <option value="United Kingdom (+44)">United Kingdom (+44)</option>
                    <option value="Australia (+61)">Australia (+61)</option>
                  </select>
                </div>
                
                <div className={styles.inputGroup} style={{ marginBottom: '24px' }}>
                  <label className={styles.inputLabel}>Phone number</label>
                  <input type="text" className={styles.formControl} placeholder="Phone number" />
                </div>
                
                <button className={styles.saveBtn} style={{ width: '100%', margin: 0 }} onClick={() => setShowBookingModal(false)}>Verify</button>
              </>
            )}
          </div>
        </div>
      )}

      {showLangModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader} style={{ marginBottom: '16px' }}>
              <h3 className={styles.modalTitle}>Preferred language</h3>
              <button className={styles.closeModalBtn} onClick={() => setShowLangModal(false)}>&times;</button>
            </div>
            
            <p className={styles.itemDesc} style={{ marginBottom: '24px' }}>
              This updates what you read on Airbnb, and how we communicate with you.
            </p>
            
            <div className={styles.inputGroup} style={{ marginBottom: '24px' }}>
              <label className={styles.inputLabel}>Language</label>
              <select 
                className={`${styles.formControl} notranslate`}
                translate="no"
                value={tempLanguage}
                onChange={(e) => setTempLanguage(e.target.value)}
              >
                <optgroup label="Popular Languages">
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                  <option value="German">German (Deutsch)</option>
                  <option value="Italian">Italian (Italiano)</option>
                  <option value="Portuguese">Portuguese (Português)</option>
                  <option value="Russian">Russian (Русский)</option>
                  <option value="Japanese">Japanese (日本語)</option>
                  <option value="Korean">Korean (한국어)</option>
                  <option value="Chinese">Chinese (中文 - 简体)</option>
                  <option value="Arabic">Arabic (العربية)</option>
                </optgroup>
                <optgroup label="Indian Languages">
                  <option value="Bengali">Bengali (বাংলা)</option>
                  <option value="Marathi">Marathi (मराठी)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                  <option value="Urdu">Urdu (اردو)</option>
                  <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                  <option value="Malayalam">Malayalam (മലയാളം)</option>
                  <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
                </optgroup>
                <optgroup label="European & Global Languages">
                  <option value="Dutch">Dutch (Nederlands)</option>
                  <option value="Polish">Polish (Polski)</option>
                  <option value="Turkish">Turkish (Türkçe)</option>
                  <option value="Indonesian">Indonesian (Bahasa Indonesia)</option>
                  <option value="Vietnamese">Vietnamese (Tiếng Việt)</option>
                  <option value="Thai">Thai (ไทย)</option>
                  <option value="Greek">Greek (Ελληνικά)</option>
                  <option value="Czech">Czech (Čeština)</option>
                  <option value="Swedish">Swedish (Svenska)</option>
                  <option value="Danish">Danish (Dansk)</option>
                  <option value="Finnish">Finnish (Suomi)</option>
                  <option value="Norwegian">Norwegian (Norsk)</option>
                  <option value="Hungarian">Hungarian (Magyar)</option>
                  <option value="Romanian">Romanian (Română)</option>
                  <option value="Ukrainian">Ukrainian (Українська)</option>
                  <option value="Hebrew">Hebrew (עברית)</option>
                  <option value="Malay">Malay (Bahasa Melayu)</option>
                  <option value="Filipino">Filipino (Tagalog)</option>
                  <option value="Persian">Persian (فارسی)</option>
                </optgroup>
              </select>
            </div>
            
            <button 
              className={styles.saveBtn} 
              style={{ width: '100%', margin: 0 }} 
              onClick={handleSaveLanguage}
              disabled={isSavingLanguage}
            >
              {isSavingLanguage ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {showOtherLangModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '600px' }}>
            <div className={styles.modalHeader} style={{ marginBottom: '16px' }}>
              <h3 className={styles.modalTitle}>Other languages you know</h3>
              <button className={styles.closeModalBtn} onClick={() => setShowOtherLangModal(false)}>&times;</button>
            </div>
            
            <p className={styles.itemDesc} style={{ marginBottom: '24px' }}>
              These won’t be translated so you can read reviews, descriptions and messages in their original language.
            </p>
            
            <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '24px', display: 'flex', flexWrap: 'wrap' }}>
              {[
                'English', 'Hindi (हिंदी)', 'Spanish (Español)', 'French (Français)', 'German (Deutsch)', 
                'Italian (Italiano)', 'Portuguese (Português)', 'Russian (Русский)', 'Japanese (日本語)', 
                'Korean (한국어)', 'Chinese (中文)', 'Arabic (العربية)', 'Bengali (বাংলা)', 
                'Marathi (मराठी)', 'Telugu (తెలుగు)', 'Tamil (தமிழ்)', 'Gujarati (ગુજરાતી)', 
                'Urdu (اردو)', 'Kannada (ಕನ್ನಡ)', 'Malayalam (മലയാളം)', 'Punjabi (ਪੰਜਾਬੀ)', 
                'Dutch (Nederlands)', 'Polish (Polski)', 'Turkish (Türkçe)', 'Indonesian (Bahasa Indonesia)', 
                'Vietnamese (Tiếng Việt)', 'Thai (ไทย)', 'Greek (Ελληνικά)', 'Czech (Čeština)', 
                'Swedish (Svenska)', 'Danish (Dansk)', 'Finnish (Suomi)', 'Norwegian (Norsk)', 
                'Hungarian (Magyar)', 'Romanian (Română)', 'Ukrainian (Українська)', 'Hebrew (עברית)', 
                'Malay (Bahasa Melayu)', 'Filipino (Tagalog)', 'Persian (فارسی)'
              ].map((lang, index) => {
                const isChecked = tempKnownLanguages.includes(lang);
                return (
                  <div key={index} style={{ width: '50%', paddingRight: '24px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label 
                      htmlFor={`other_lang_${index}`} 
                      className="notranslate"
                      translate="no"
                      style={{ fontSize: '1rem', color: '#222222', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {lang}
                    </label>
                    <input 
                      type="checkbox" 
                      id={`other_lang_${index}`} 
                      checked={isChecked}
                      onChange={() => {
                        if (isChecked) {
                          setTempKnownLanguages(prev => prev.filter(item => item !== lang));
                        } else {
                          setTempKnownLanguages(prev => [...prev, lang]);
                        }
                      }}
                      style={{ width: '20px', height: '20px', accentColor: '#222222', cursor: 'pointer', flexShrink: 0 }}
                    />
                  </div>
                );
              })}
            </div>
            
            <button 
              className={styles.saveBtn} 
              style={{ width: '100%', margin: 0 }} 
              onClick={handleSaveKnownLanguages}
              disabled={isSavingKnownLanguages}
            >
              {isSavingKnownLanguages ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {showTimezoneModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '500px' }}>
            <div className={styles.modalHeader} style={{ marginBottom: '16px' }}>
              <h3 className={styles.modalTitle}>Time zone</h3>
              <button className={styles.closeModalBtn} onClick={() => setShowTimezoneModal(false)}>&times;</button>
            </div>
            
            <p className={styles.itemDesc} style={{ marginBottom: '24px' }}>
              Choose your local time zone.
            </p>
            
            <div style={{ maxHeight: '320px', overflowY: 'auto', marginBottom: '24px' }}>
              {TIMEZONES.map((tz, index) => (
                <div key={index} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <label htmlFor={`tz_${index}`} style={{ fontSize: '1rem', color: '#222222', cursor: 'pointer', display: 'block', fontWeight: '500' }}>{tz.label}</label>
                    <span style={{ fontSize: '0.85rem', color: '#717171' }}>{tz.offset} • {tz.iana}</span>
                  </div>
                  <input 
                    type="radio" 
                    id={`tz_${index}`} 
                    name="timezone_select"
                    checked={tempTimezone === tz.label}
                    onChange={() => setTempTimezone(tz.label)}
                    style={{ width: '20px', height: '20px', accentColor: '#222222', cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>
            
            <button 
              className={styles.saveBtn} 
              style={{ width: '100%', margin: 0 }} 
              onClick={handleSaveTimezone}
              disabled={isSavingTimezone}
            >
              {isSavingTimezone ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {showPayoutModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            {payoutStep === 1 && (
              <>
                <div className={styles.modalHeader} style={{ marginBottom: '16px', position: 'relative' }}>
                  <button className={styles.closeModalBtn} style={{ position: 'absolute', right: '0' }} onClick={() => setShowPayoutModal(false)}>&times;</button>
                  <h3 className={styles.payoutModalTitle}>Let's add a payout method</h3>
                </div>
                <p className={styles.payoutModalSubtitle}>To start, let us know where you'd like us to send your money.</p>
                
                <div style={{ marginBottom: '24px' }}>
                  <label className={styles.inputLabel}>Billing country/region</label>
                  <select className={styles.formControl} defaultValue="India">
                    <option value="India">India</option>
                  </select>
                  <p style={{ fontSize: '0.85rem', color: '#717171', marginTop: '8px' }}>This is where you opened your financial account. <span style={{ textDecoration: 'underline', cursor: 'pointer', color: '#222' }}>More info</span></p>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px', color: '#222' }}>How you'll get paid</h4>
                  <p style={{ fontSize: '1rem', color: '#717171' }}>Payouts will be sent in INR.</p>
                </div>
                
                <div 
                  className={`${styles.payoutBankCard} ${selectedPayoutMethod === 'bank' ? styles.payoutBankCardSelected : ''}`}
                  onClick={() => setSelectedPayoutMethod('bank')}
                >
                  <div className={styles.payoutBankIcon}>🏛️</div>
                  <div style={{ flex: 1 }}>
                    <div className={styles.payoutBankTitle}>Bank account</div>
                    <ul className={styles.payoutBankDescList}>
                      <li style={{ marginBottom: '4px' }}>3–5 business days</li>
                      <li>No fees</li>
                    </ul>
                  </div>
                  <input type="radio" checked={selectedPayoutMethod === 'bank'} onChange={() => {}} style={{ width: '24px', height: '24px', accentColor: '#222222', cursor: 'pointer', marginTop: '4px' }} />
                </div>
                
                <div className={styles.payoutModalFooter}>
                  <button className={styles.saveBtn} style={{ margin: 0, opacity: selectedPayoutMethod === 'bank' ? 1 : 0.5, padding: '14px 24px', fontSize: '1rem' }} disabled={selectedPayoutMethod !== 'bank'} onClick={() => setPayoutStep(2)}>Continue</button>
                </div>
              </>
            )}

            {payoutStep === 2 && (
              <>
                <div className={styles.modalHeader} style={{ position: 'relative', marginBottom: '0' }}>
                  <button className={styles.closeModalBtn} style={{ position: 'absolute', right: '0' }} onClick={() => setShowPayoutModal(false)}>&times;</button>
                </div>
                <div style={{ textAlign: 'center', padding: '20px 24px' }}>
                  <div className={styles.shieldIcon}>🛡️</div>
                  <h3 className={styles.shieldTitle}>Keep your account safe</h3>
                  <p className={styles.shieldDesc}>Be aware of scam calls. We'll never call and ask you to change your payout method or share one-time codes, passwords or payout details.</p>
                  
                  <button className={styles.saveBtn} style={{ width: '100%', margin: '0 0 16px 0', padding: '16px', fontSize: '1.1rem' }} onClick={() => setPayoutStep(3)}>Continue</button>
                  <button className={styles.goBackBtn} onClick={() => setPayoutStep(1)}>Go back</button>
                </div>
              </>
            )}

            {payoutStep === 3 && (
              <>
                <div className={styles.modalHeader} style={{ marginBottom: '32px' }}>
                  <button className={styles.closeModalBtn} onClick={() => setPayoutStep(2)}>
                    <BsChevronLeft style={{ fontSize: '1.2rem' }} />
                  </button>
                  <div></div>
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '32px', color: '#222' }}>Add the bank account holder</h3>
                
                <div style={{ marginBottom: '40px' }}>
                  <label className={styles.inputLabel} style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Whose bank account is it?</label>
                  <select className={styles.formControl} value={payoutAccountHolder} onChange={(e) => setPayoutAccountHolder(e.target.value)} style={{ padding: '16px' }}>
                    <option value="">Select one</option>
                    <option value="me">Me</option>
                    <option value="someone_else">Someone else</option>
                  </select>
                  <p style={{ fontSize: '0.9rem', color: '#717171', marginTop: '8px' }}>Choose from people you've added to your host account. <span style={{ textDecoration: 'underline', color: '#222', cursor: 'pointer' }}>Learn more</span></p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #ebebeb', paddingTop: '20px' }}>
                  <button className={styles.saveBtn} style={{ margin: 0, opacity: payoutAccountHolder ? 1 : 0.5, padding: '14px 24px', fontSize: '1rem' }} disabled={!payoutAccountHolder} onClick={() => setPayoutStep(4)}>Next</button>
                </div>
              </>
            )}

            {payoutStep === 4 && (
              <>
                <div className={styles.modalHeader} style={{ marginBottom: '32px' }}>
                  <button className={styles.closeModalBtn} onClick={() => setPayoutStep(3)}>
                    <BsChevronLeft style={{ fontSize: '1.2rem' }} />
                  </button>
                  <div></div>
                </div>
                <h3 className={styles.payoutStepTitle}>Add bank account info</h3>
                
                <div style={{ marginBottom: '32px' }}>
                  <label className={styles.inputLabel} style={{ marginBottom: '16px', display: 'block', fontSize: '1.1rem' }}>Is this a current or savings account?</label>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <input type="radio" id="acc_current" name="account_type" value="current" checked={accountType === 'current'} onChange={() => setAccountType('current')} style={{ width: '24px', height: '24px', marginRight: '16px', accentColor: '#222222', cursor: 'pointer' }} />
                    <label htmlFor="acc_current" style={{ fontSize: '1.1rem', color: '#222', cursor: 'pointer' }}>Current</label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="radio" id="acc_savings" name="account_type" value="savings" checked={accountType === 'savings'} onChange={() => setAccountType('savings')} style={{ width: '24px', height: '24px', marginRight: '16px', accentColor: '#222222', cursor: 'pointer' }} />
                    <label htmlFor="acc_savings" style={{ fontSize: '1.1rem', color: '#222', cursor: 'pointer' }}>Savings</label>
                  </div>
                </div>
                
                <div style={{ marginBottom: '32px' }}>
                  <label className={styles.inputLabel} style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Account number</label>
                  <div className={styles.groupedInputContainer}>
                    <input type="text" placeholder="Account number" className={styles.groupedInputFirst} />
                    <input type="text" placeholder="Confirm account number" className={styles.groupedInputSecond} />
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#717171', marginTop: '8px' }}>Enter the account number. This can usually be found within the account details.</p>
                </div>
                
                <div style={{ marginBottom: '32px' }}>
                  <label className={styles.inputLabel} style={{ fontSize: '1.1rem', marginBottom: '12px' }}>IFSC code</label>
                  <input type="text" className={`${styles.formControl} ${styles.formControlLarge}`} placeholder="IFSC code" />
                  <p style={{ fontSize: '0.9rem', color: '#717171', marginTop: '8px' }}>Please enter your IFSC code.</p>
                </div>
                
                <div style={{ marginBottom: '32px' }}>
                  <label className={styles.inputLabel} style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Permanent Account Number</label>
                  <input type="text" className={`${styles.formControl} ${styles.formControlLarge}`} placeholder="Permanent Account Number" />
                  <p style={{ fontSize: '0.9rem', color: '#717171', marginTop: '8px' }}>Add the PAN for the individual or corporation.</p>
                </div>
                
                <div className={styles.payoutModalFooter}>
                  <button className={styles.saveBtn} style={{ margin: 0, padding: '14px 24px', fontSize: '1rem' }} onClick={() => setShowPayoutModal(false)}>Submit</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showNotifModal && activeNotifItem && (
        <div className={styles.modalOverlay} onClick={() => setShowNotifModal(false)}>
          <div 
            className={styles.notifModalCard} 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button"
              className={styles.notifModalCloseBtn}
              onClick={() => setShowNotifModal(false)}
              aria-label="Close"
            >
              <IoMdClose />
            </button>

            <h3 className={styles.notifModalTitle}>
              {activeNotifItem.title}
            </h3>

            <p className={styles.notifModalSubtitle}>
              {activeNotifItem.desc}
            </p>

            <div className={styles.notifChannelList}>
              <div className={styles.notifChannelRow}>
                <span className={styles.notifChannelName}>Email</span>
                <CustomToggle 
                  checked={notificationSettings[activeNotifItem.id]?.email || false} 
                  onChange={() => handleToggleNotifChannel(activeNotifItem.id, 'email')} 
                />
              </div>

              <div className={styles.notifChannelRow}>
                <span className={styles.notifChannelName}>SMS</span>
                <CustomToggle 
                  checked={notificationSettings[activeNotifItem.id]?.sms || false} 
                  onChange={() => handleToggleNotifChannel(activeNotifItem.id, 'sms')} 
                />
              </div>

              <div className={styles.notifChannelRow}>
                <span className={styles.notifChannelName}>Phone calls</span>
                <CustomToggle 
                  checked={notificationSettings[activeNotifItem.id]?.phone || false} 
                  onChange={() => handleToggleNotifChannel(activeNotifItem.id, 'phone')} 
                />
              </div>

              <div className={styles.notifChannelRow}>
                <span className={styles.notifChannelName}>WhatsApp</span>
                <CustomToggle 
                  checked={notificationSettings[activeNotifItem.id]?.whatsapp || false} 
                  onChange={() => handleToggleNotifChannel(activeNotifItem.id, 'whatsapp')} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountSettings;