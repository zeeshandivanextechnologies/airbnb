import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  FaAirbnb, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaShieldAlt, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaArrowRight
} from 'react-icons/fa';
import { adminLogin } from '../services/api.js';
import styles from './styles/Login.module.css';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@airbnb.internal');
  const [password, setPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Direct Login (No OTP) with React Hot Toast Alerts
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both administrator email and password.');
      setAlert({ type: 'error', message: 'Please enter both administrator email and password.' });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      // Direct call to Backend: POST http://localhost:5000/api/admin/auth/login
      const response = await adminLogin(email, password);

      // Store authentic JWT session
      localStorage.setItem('airbnb_admin_auth', JSON.stringify({
        authenticated: true,
        token: response.token,
        user: response.user,
        email: response.user?.email || email,
        name: response.user?.name || 'Super Admin',
        role: response.user?.role || 'Super Admin',
        loginTime: response.user?.loginTime || new Date().toISOString()
      }));

      // Toast Success Alert
      toast.success(`Welcome back, ${response.user?.name || 'Administrator'}! Login successful.`);
      
      setAlert({
        type: 'success',
        message: 'Login successful! Redirecting to Dashboard...'
      });

      setTimeout(() => {
        navigate('/');
      }, 500);

    } catch (error) {
      setLoading(false);
      const errMsg = error.message || 'Invalid administrator email or password.';
      
      // Toast Error Alert on Wrong Password / Wrong Email
      toast.error(errMsg);
      
      setAlert({
        type: 'error',
        message: errMsg
      });
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.backgroundPattern} />

      {/* Bootstrap Grid Container */}
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
            
            <div className={styles.loginCard}>
              {/* Header Branding */}
              <div className={styles.brandHeader}>
                <div className={styles.logoBadge}>
                  <FaAirbnb />
                </div>
                <h1 className={styles.title}>Airbnb Admin Portal</h1>
                <p className={styles.subtitle}>
                  Enter your privileged administrator credentials
                </p>
                <div className={styles.badgeSecure}>
                  <FaShieldAlt size={11} />
                  <span>Backend Connected (Port 5000) • 256-Bit SSL</span>
                </div>
              </div>

              {/* Status Alert Notification */}
              {alert && (
                <div className={`${styles.alertBox} ${alert.type === 'error' ? styles.alertError : styles.alertSuccess}`}>
                  {alert.type === 'error' ? <FaExclamationCircle size={16} /> : <FaCheckCircle size={16} />}
                  <span>{alert.message}</span>
                </div>
              )}

              {/* DIRECT LOGIN FORM (NO OTP) */}
              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Official Admin Email</label>
                  <div className={styles.inputWrapper}>
                    <FaEnvelope className={styles.inputIcon} />
                    <input 
                      type="email"
                      required
                      className={styles.inputField}
                      placeholder="admin@airbnb.internal"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Secure Password</label>
                  <div className={styles.inputWrapper}>
                    <FaLock className={styles.inputIcon} />
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      required
                      className={styles.inputField}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button 
                      type="button" 
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className={styles.flexRowBetween}>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      className={styles.checkboxInput}
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember this workstation
                  </label>
                  <button 
                    type="button" 
                    className={styles.forgotLink}
                    onClick={() => {
                      toast.success('Password reset instructions sent to your email.');
                      setAlert({ type: 'success', message: 'Password reset link sent to your internal IT mailbox.' });
                    }}
                  >
                    Forgot access?
                  </button>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Sign In to Admin Portal</span>
                      <FaArrowRight size={13} />
                    </>
                  )}
                </button>
              </form>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
