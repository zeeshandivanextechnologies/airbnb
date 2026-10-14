import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  FaAirbnb,
  FaTimes,
  FaApple,
  FaGoogle,
  FaArrowLeft,
  FaLock,
} from "react-icons/fa";
import { sendOtpApi, verifyOtpApi, registerUserApi, loginWithPasswordApi, resetPasswordApi } from "../services/api.js";
import {
  setAuthStep,
  setIdentifier,
  setOtpCode,
  loginSuccess,
  closeAuthModal
} from "../store/slices/authSlice.js";
import styles from "./styles/Header.module.css";

export default function AuthModal({ show, onClose }) {
  const dispatch = useDispatch();
  const { authStep, identifier } = useSelector((state) => state.auth);

  // Local form input states
  const [localInput, setLocalInput] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [promotions, setPromotions] = useState(false);

  // "Try another way" & Password Login States
  const [showTryAnotherModal, setShowTryAnotherModal] = useState(false);
  const [loginMethod, setLoginMethod] = useState("otp"); // "otp" | "password" | "forgot_password"
  const [inputPassword, setInputPassword] = useState("");
  const [showInputPassword, setShowInputPassword] = useState(false);

  // Forgot Password States
  const [resetOtp, setResetOtp] = useState(["", "", "", "", "", ""]);
  const [newResetPassword, setNewResetPassword] = useState("");
  const [showNewResetPassword, setShowNewResetPassword] = useState(false);
  const resetOtpRefs = useRef([]);

  const otpRefs = useRef([]);
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 1. TanStack Query Mutation: Send OTP
  const sendOtpMutation = useMutation({
    mutationFn: (phoneOrEmail) => sendOtpApi(phoneOrEmail),
    onSuccess: (data) => {
      dispatch(setIdentifier(localInput.trim()));
      dispatch(setAuthStep(1));
      toast.success(data.message || `Code sent to ${localInput}!`);
      // If sandbox demo OTP provided, set it in state
      if (data.demoOtp) {
        console.log("Demo verification OTP:", data.demoOtp);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send verification code. Please check your input.");
    }
  });

  // 2. TanStack Query Mutation: Verify OTP
  const verifyOtpMutation = useMutation({
    mutationFn: ({ identifier, otpCode }) => verifyOtpApi(identifier, otpCode),
    onSuccess: (data) => {
      if (data.action === "LOGIN") {
        // Direct Login Success
        dispatch(loginSuccess({ token: data.token, user: data.user }));
        toast.success(data.message || `Welcome back, ${data.user.firstName}!`);
        handleClose();
      } else {
        // Proceed to Create Profile
        dispatch(setAuthStep(2));
        toast.success("Code verified! Complete your profile to continue.");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Invalid 6-digit code. Please try again.");
    }
  });

  // 3. TanStack Query Mutation: Register / Create Account
  const registerMutation = useMutation({
    mutationFn: (userData) => registerUserApi(userData),
    onSuccess: (data) => {
      dispatch(loginSuccess({ token: data.token, user: data.user }));
      toast.success(data.message || "Account created successfully!");
      handleClose();
    },
    onError: (error) => {
      toast.error(error.message || "Could not complete account creation.");
    }
  });

  // 4. TanStack Query Mutation: Login with Password
  const loginWithPasswordMutation = useMutation({
    mutationFn: ({ identifier, password }) => loginWithPasswordApi(identifier, password),
    onSuccess: (data) => {
      dispatch(loginSuccess({ token: data.token, user: data.user }));
      toast.success(data.message || `Welcome back, ${data.user.firstName}!`);
      handleClose();
    },
    onError: (error) => {
      toast.error(error.message || "Incorrect password. Please try again.");
    }
  });

  const handlePasswordLogin = (e) => {
    e.preventDefault();
    if (!inputPassword.trim()) {
      toast.error("Please enter your password.");
      return;
    }
    loginWithPasswordMutation.mutate({
      identifier: identifier || localInput,
      password: inputPassword.trim()
    });
  };

  // 5. TanStack Query Mutation: Reset Password & Login
  const resetPasswordMutation = useMutation({
    mutationFn: ({ identifier, otp, newPassword }) =>
      resetPasswordApi({ identifier, otp, newPassword }),
    onSuccess: (data) => {
      dispatch(loginSuccess({ token: data.token, user: data.user }));
      toast.success(data.message || `Password reset successfully! Welcome back, ${data.user.firstName}!`);
      handleClose();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reset password. Please check your code.");
    }
  });

  const handleForgotPasswordClick = () => {
    sendOtpMutation.mutate(identifier || localInput);
    setLoginMethod("forgot_password");
    setResetOtp(["", "", "", "", "", ""]);
    setNewResetPassword("");
  };

  const handleResetOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const updated = [...resetOtp];
    updated[index] = value;
    setResetOtp(updated);
    if (value && index < 5 && resetOtpRefs.current[index + 1]) {
      resetOtpRefs.current[index + 1].focus();
    }
  };

  const handleResetOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !resetOtp[index] && index > 0 && resetOtpRefs.current[index - 1]) {
      resetOtpRefs.current[index - 1].focus();
    }
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    const fullOtp = resetOtp.join("");
    if (fullOtp.length !== 6) {
      toast.error("Please enter the complete 6-digit verification code.");
      return;
    }
    if (!newResetPassword || newResetPassword.length < 6) {
      toast.error("Please enter a new password of at least 6 characters.");
      return;
    }
    resetPasswordMutation.mutate({
      identifier: identifier || localInput,
      otp: fullOtp,
      newPassword: newResetPassword
    });
  };

  const handleClose = () => {
    setShowTryAnotherModal(false);
    setLoginMethod("otp");
    setInputPassword("");
    setResetOtp(["", "", "", "", "", ""]);
    setNewResetPassword("");
    dispatch(closeAuthModal());
    onClose();
  };

  useEffect(() => {
    let timer;
    if (show) {
      setIsRendered(true);
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";
      timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
    } else {
      setIsVisible(false);
      dispatch(setAuthStep(0));
      setOtp(["", "", "", "", "", ""]);
      setLocalInput("");
      
      timer = setTimeout(() => {
        setIsRendered(false);
        document.body.style.overflow = "unset";
        document.body.style.paddingRight = "0px";
      }, 300);
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
      clearTimeout(timer);
    };
  }, [show, dispatch]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const hasAnyOtpDigit = otp.some((digit) => digit.trim() !== "");
  const isOtpComplete = otp.every((digit) => digit.trim() !== "");

  // Handlers for steps
  const handleStep0Continue = (e) => {
    e.preventDefault();
    if (!localInput.trim()) {
      toast.error("Please enter your phone number or email.");
      return;
    }
    sendOtpMutation.mutate(localInput.trim());
  };

  const handleStep1Continue = () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }
    dispatch(setOtpCode(fullOtp));
    verifyOtpMutation.mutate({ identifier: identifier || localInput.trim(), otpCode: fullOtp });
  };

  const handleStep2Submit = () => {
    if (!firstName.trim()) {
      toast.error("First name is required.");
      return;
    }
    // Proceed to Step 3: Community Commitment agreement
    dispatch(setAuthStep(3));
  };

  const handleStep3AgreeAndContinue = () => {
    registerMutation.mutate({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      identifier: identifier || localInput.trim(),
      dob: dob || null,
      password: password || null,
      promotions
    });
  };

  if (!isRendered) return null;

  return (
    <div
      className={`modal d-block ${styles.authOverlay} ${isVisible ? styles.visible : ''}`}
      tabIndex="-1"
      onClick={handleClose}
    >
      <div
        className={`modal-dialog modal-dialog-centered ${styles.authDialog} ${isVisible ? styles.visible : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header border-bottom-0 pt-4">
            {authStep > 0 && (
              <button
                type="button"
                className={`btn btn-sm btn-light position-absolute rounded-circle d-flex align-items-center justify-content-center ${styles.authBackBtn}`}
                aria-label="Back"
                onClick={() => dispatch(setAuthStep(authStep - 1))}
              >
                <FaArrowLeft />
              </button>
            )}
            <button
              type="button"
              className={`btn btn-sm btn-light position-absolute rounded-circle d-flex align-items-center justify-content-center ${styles.authCloseBtn}`}
              aria-label="Close"
              onClick={handleClose}
            >
              <FaTimes />
            </button>
          </div>
          <div className="modal-body px-4 pb-4 pt-2">
            
            {/* STEP 0: PHONE OR EMAIL INPUT */}
            {authStep === 0 && (
              <>
                <div className="text-center mb-4">
                  <FaAirbnb size={40} color="#ff385c" />
                  <h4 className="fw-bold mt-3 mb-0">Log in or sign up</h4>
                </div>

                <form onSubmit={handleStep0Continue}>
                  <div className="form-floating mb-3 border rounded-3 overflow-hidden">
                    <input
                      type="text"
                      className="form-control border-0 shadow-none"
                      id="floatingInput"
                      placeholder="Phone number or email"
                      value={localInput}
                      onChange={(e) => setLocalInput(e.target.value)}
                      required
                    />
                    <label htmlFor="floatingInput" className="text-muted">
                      Phone number or email
                    </label>
                  </div>

                  <p className={`text-muted mb-4 ${styles.authDisclaimerText}`}>
                    We'll send a confirmation code by text or email. Message and
                    data rates apply.
                    <a
                      href="#"
                      className="text-dark fw-bold text-decoration-underline ms-1"
                      onClick={(e) => e.preventDefault()}
                    >
                      Privacy Policy
                    </a>
                  </p>

                  <button
                    type="submit"
                    className={`btn w-100 fw-bold py-3 rounded-3 ${styles.authPrimaryBtn}`}
                    disabled={sendOtpMutation.isPending}
                  >
                    {sendOtpMutation.isPending ? "Sending code..." : "Continue"}
                  </button>
                </form>

                <div className="d-flex align-items-center my-4">
                  <hr className="flex-grow-1" />
                  <span className={`mx-3 text-muted ${styles.authDividerText}`}>
                    or
                  </span>
                  <hr className="flex-grow-1" />
                </div>

                <div className="d-flex justify-content-center gap-4">
                  <button
                    type="button"
                    className={`btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center ${styles.authSocialBtn}`}
                    onClick={() => {
                      setLocalInput("guest.google@airbnb.com");
                      toast.success("Google account selected: guest.google@airbnb.com");
                    }}
                    title="Sign in with Google"
                  >
                    <FaGoogle size={20} />
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center ${styles.authSocialBtn}`}
                    onClick={() => {
                      setLocalInput("guest.apple@airbnb.com");
                      toast.success("Apple account selected: guest.apple@airbnb.com");
                    }}
                    title="Sign in with Apple"
                  >
                    <FaApple size={22} />
                  </button>
                </div>
              </>
            )}

            {/* STEP 1: 6-DIGIT OTP VERIFICATION OR PASSWORD LOGIN */}
            {authStep === 1 && (
              <>
                {loginMethod === "otp" ? (
                  <div className="text-center">
                    <h3 className="fw-bold mb-2">Confirm it's you</h3>
                    <p className={`text-muted mb-4 ${styles.otpText}`}>
                      We sent a code to <strong>{identifier || localInput}</strong>.
                    </p>

                    <div
                      className={`d-flex justify-content-center gap-3 mb-4 border rounded-3 p-3 mx-auto ${styles.otpContainer}`}
                    >
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => (otpRefs.current[i] = el)}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className={`text-center border-0 p-0 m-0 fw-bold ${styles.otpInput}`}
                          placeholder="-"
                          autoFocus={i === 0}
                        />
                      ))}
                    </div>

                    <p className={`text-dark mb-4 ${styles.otpText}`}>
                      Didn't get it?{" "}
                      <button
                        type="button"
                        className="btn btn-link p-0 text-dark fw-bold text-decoration-underline"
                        onClick={() => {
                          sendOtpMutation.mutate(identifier || localInput);
                        }}
                      >
                        Send a new code
                      </button>
                    </p>

                    {hasAnyOtpDigit && (
                      <button
                        type="button"
                        className={`btn w-100 fw-bold py-3 rounded-3 mt-2 ${isOtpComplete ? styles.authPrimaryBtn : styles.otpBtnDisabled}`}
                        disabled={!isOtpComplete || verifyOtpMutation.isPending}
                        onClick={handleStep1Continue}
                      >
                        {verifyOtpMutation.isPending ? "Verifying code..." : "Continue"}
                      </button>
                    )}

                    <div className="mt-3">
                      <button 
                        type="button" 
                        className={`btn py-3 ${styles.authPrimaryBtn} w-100`}
                        onClick={() => setShowTryAnotherModal(true)}
                      >
                        Try Another now
                      </button>
                    </div>

                  </div>
                ) : loginMethod === "password" ? (
                  <div className="text-start">
                    <h3 className="fw-bold mb-2 text-center">Log in with password</h3>
                    <p className={`text-muted mb-4 text-center ${styles.otpText}`}>
                      Enter the password for <strong>{identifier || localInput}</strong>
                    </p>

                    <form onSubmit={handlePasswordLogin}>
                      <div className="position-relative mb-2 border rounded-3 overflow-hidden">
                        <div className="form-floating">
                          <input
                            type={showInputPassword ? "text" : "password"}
                            className="form-control border-0 shadow-none"
                            id="loginPassword"
                            placeholder="Password"
                            value={inputPassword}
                            onChange={(e) => setInputPassword(e.target.value)}
                            autoFocus
                            required
                          />
                          <label htmlFor="loginPassword" className="text-muted">
                            Password
                          </label>
                        </div>
                        <button
                          type="button"
                          className="btn position-absolute top-50 end-0 translate-middle-y me-2 text-muted border-0 bg-transparent fw-semibold"
                          onClick={() => setShowInputPassword(!showInputPassword)}
                        >
                          {showInputPassword ? "Hide" : "Show"}
                        </button>
                      </div>

                      <div className="d-flex justify-content-end mb-3">
                        <button
                          type="button"
                          className="btn btn-link text-dark fw-bold p-0 text-decoration-underline"
                          style={{ fontSize: "14px" }}
                          onClick={handleForgotPasswordClick}
                        >
                          Forgot password?
                        </button>
                      </div>

                      <button
                        type="submit"
                        className={`btn w-100 fw-bold py-3 rounded-3 mt-1 ${styles.authPrimaryBtn}`}
                        disabled={!inputPassword.trim() || loginWithPasswordMutation.isPending}
                      >
                        {loginWithPasswordMutation.isPending ? "Logging in..." : "Log in"}
                      </button>
                    </form>

                    <div className="text-center mt-3">
                      <button
                        type="button"
                        className="btn btn-link text-dark fw-bold text-decoration-underline p-0"
                        onClick={() => setLoginMethod("otp")}
                      >
                        Log in with verification code (OTP)
                      </button>
                    </div>
                  </div>
                ) : (
                  /* FORGOT PASSWORD: OTP VERIFICATION & SET NEW PASSWORD */
                  <div className="text-start">
                    <h3 className="fw-bold mb-2 text-center">Reset your password</h3>
                    <p className={`text-muted mb-4 text-center ${styles.otpText}`}>
                      Enter the code sent to <strong>{identifier || localInput}</strong> and choose a new password.
                    </p>

                    <form onSubmit={handleResetPasswordSubmit}>
                      <div className="text-center mb-3">
                        <label className="form-label text-muted fw-semibold small mb-2">6-digit verification code</label>
                        <div
                          className={`d-flex justify-content-center gap-2 border rounded-3 p-2 mx-auto ${styles.otpContainer}`}
                        >
                          {resetOtp.map((digit, i) => (
                            <input
                              key={i}
                              ref={(el) => (resetOtpRefs.current[i] = el)}
                              type="text"
                              maxLength="1"
                              value={digit}
                              onChange={(e) => handleResetOtpChange(i, e.target.value)}
                              onKeyDown={(e) => handleResetOtpKeyDown(i, e)}
                              className={`text-center border-0 p-0 m-0 fw-bold ${styles.otpInput}`}
                              placeholder="-"
                              autoFocus={i === 0}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="position-relative mb-3 border rounded-3 overflow-hidden">
                        <div className="form-floating">
                          <input
                            type={showNewResetPassword ? "text" : "password"}
                            className="form-control border-0 shadow-none"
                            id="newResetPassword"
                            placeholder="New password"
                            value={newResetPassword}
                            onChange={(e) => setNewResetPassword(e.target.value)}
                            required
                          />
                          <label htmlFor="newResetPassword" className="text-muted">
                            New password (min 6 characters)
                          </label>
                        </div>
                        <button
                          type="button"
                          className="btn position-absolute top-50 end-0 translate-middle-y me-2 text-muted border-0 bg-transparent fw-semibold"
                          onClick={() => setShowNewResetPassword(!showNewResetPassword)}
                        >
                          {showNewResetPassword ? "Hide" : "Show"}
                        </button>
                      </div>

                      <button
                        type="submit"
                        className={`btn w-100 fw-bold py-3 rounded-3 mt-2 ${styles.authPrimaryBtn}`}
                        disabled={resetOtp.join("").length !== 6 || !newResetPassword || resetPasswordMutation.isPending}
                      >
                        {resetPasswordMutation.isPending ? "Setting new password..." : "Set new password and log in"}
                      </button>
                    </form>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <button
                        type="button"
                        className="btn btn-link text-dark fw-bold text-decoration-underline p-0 small"
                        onClick={() => sendOtpMutation.mutate(identifier || localInput)}
                      >
                        Resend code
                      </button>
                      <button
                        type="button"
                        className="btn btn-link text-dark fw-bold text-decoration-underline p-0 small"
                        onClick={() => setLoginMethod("password")}
                      >
                        Back to password login
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* STEP 2: CREATE PROFILE */}
            {authStep === 2 && (
              <div className="text-start">
                <h3 className="fw-bold mb-1">Let's create your account</h3>
                <p className={`text-muted mb-4 ${styles.step2Subtitle}`}>
                  This information is required to book or host.
                </p>

                <h6 className="fw-bold mb-2">Legal name</h6>
                <div className="border rounded-3 overflow-hidden mb-2">
                  <div className="form-floating border-bottom">
                    <input
                      type="text"
                      className="form-control border-0 shadow-none"
                      id="firstName"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                    <label htmlFor="firstName" className="text-muted">
                      First name
                    </label>
                  </div>
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control border-0 shadow-none"
                      id="lastName"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                    <label htmlFor="lastName" className="text-muted">
                      Last name
                    </label>
                  </div>
                </div>
                <p className={`text-muted mb-4 ${styles.step2Disclaimer}`}>
                  Make sure it matches the name on your government ID.
                </p>

                <h6 className="fw-bold mb-2">Date of birth</h6>
                <div className="form-floating border rounded-3 mb-4 overflow-hidden">
                  <input
                    type="text"
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = "text";
                    }}
                    className="form-control border-0 shadow-none"
                    id="dob"
                    placeholder="Select a date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                  <label htmlFor="dob" className="text-muted">
                    Select a date
                  </label>
                </div>

                <h6 className="fw-bold mb-2">Password</h6>
                <div className="form-floating border rounded-3 mb-4 overflow-hidden position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control border-0 shadow-none"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label htmlFor="password" className="text-muted">
                    Password
                  </label>
                  <button
                    type="button"
                    className={`btn btn-link text-dark fw-bold text-decoration-underline position-absolute ${styles.passwordShowBtn}`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="bg-light p-3 rounded-3 mb-4">
                  <p className={`text-dark mb-3 ${styles.promoText}`}>
                    Airbnb will send you promotions such as deals and marketing
                    notifications.
                  </p>
                  <div className="form-check d-flex justify-content-between align-items-center mb-0 p-0">
                    <label
                      className={`form-check-label text-dark m-0 ${styles.promoText}`}
                      htmlFor="promotions"
                    >
                      I don't want to receive Airbnb promotions.
                    </label>
                    <input
                      className={`form-check-input ms-2 mt-0 float-none ${styles.promoCheckbox}`}
                      type="checkbox"
                      id="promotions"
                      checked={promotions}
                      onChange={(e) => setPromotions(e.target.checked)}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className={`btn w-100 fw-bold py-3 rounded-3 text-white ${styles.step2SubmitBtn}`}
                  onClick={handleStep2Submit}
                >
                  Agree and continue
                </button>
              </div>
            )}

            {/* STEP 3: COMMUNITY COMMITMENT */}
            {authStep === 3 && (
              <div className="text-center pb-2">
                <div className="mb-4">
                  <FaAirbnb size={40} color="#ff385c" />
                </div>
                <h3 className="fw-bold mb-4">Everyone belongs here</h3>
                <p className={`text-dark mb-4 ${styles.step3Text}`}>
                  When you join Airbnb, we ask you to agree to our Community Commitment:
                </p>
                <p className={`text-dark mb-4 ${styles.step3Text}`}>
                  I will treat everyone in the community - regardless of their
                  race, religion, national origin, ethnicity, skin colour,
                  disability, sex, gender identity, sexual orientation or age -
                  with respect and without judgement or bias.
                </p>

                <button
                  type="button"
                  className={`btn w-100 fw-bold py-3 rounded-3 mb-3 ${styles.authPrimaryBtn}`}
                  disabled={registerMutation.isPending}
                  onClick={handleStep3AgreeAndContinue}
                >
                  {registerMutation.isPending ? "Creating account..." : "Agree and continue"}
                </button>

                <button
                  type="button"
                  className="btn w-100 fw-bold py-3 rounded-3 text-dark bg-transparent border-0"
                  onClick={handleClose}
                >
                  Decline
                </button>
              </div>
            )}

          </div>

          {/* TRY ANOTHER WAY MODAL POPUP */}
          {showTryAnotherModal && (
            <div 
              className={styles.tryAnotherBackdrop} 
              onClick={() => setShowTryAnotherModal(false)}
            >
              <div 
                className={styles.tryAnotherCard} 
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className={styles.tryAnotherClose}
                  onClick={() => setShowTryAnotherModal(false)}
                  aria-label="Close"
                >
                  <FaTimes />
                </button>

                <h3 className={styles.tryAnotherTitle}>Try another way</h3>

                <button
                  type="button"
                  className={styles.tryAnotherOption}
                  onClick={() => {
                    setShowTryAnotherModal(false);
                    setLoginMethod("password");
                  }}
                >
                  <div className={styles.tryAnotherIconBox}>
                    <FaLock size={20} />
                  </div>
                  <span className={styles.tryAnotherOptionText}>Enter your password</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
