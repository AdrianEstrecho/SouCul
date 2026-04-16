/*
Estrecho, Adrian M.
Mansilla, Rhangel R.
Romualdo, Jervin Paul C.
Sostea, Joana Marie A.
Torres, Ceazarion Sean Nicholas M.
Tupaen, Arianne Kaye E.

BSIT/IT22S1
*/

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import mapBg from "./assets/mapbg.png";

const PW_RULES = [
  { key: "length", label: "At least 8 characters", test: (v) => v.length >= 8 },
  { key: "upper", label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { key: "lower", label: "One lowercase letter", test: (v) => /[a-z]/.test(v) },
  { key: "number", label: "One number", test: (v) => /[0-9]/.test(v) },
  { key: "special", label: "One special character (!@#$%^&*)", test: (v) => /[!@#$%^&*]/.test(v) },
];

export default function Login({ onLogin, onGuestLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [view, setView] = useState("login"); // "login" | "signup"
  const [showForgot, setShowForgot] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showTos, setShowTos] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);

  // Login state
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginMsg, setLoginMsg] = useState(null);
  const [showLoginPw, setShowLoginPw] = useState(false);

  // Signup state
  const [signupForm, setSignupForm] = useState({
    firstName: "", lastName: "", email: "", password: "", confirm: "",
  });
  const [signupErrors, setSignupErrors] = useState({});
  const [signupMsg, setSignupMsg] = useState(null);
  const [termsChecked, setTermsChecked] = useState(false);
  const [showSignupPw, setShowSignupPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Forgot state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotMsg, setForgotMsg] = useState(null);

  // Reset password state
  const [resetToken, setResetToken] = useState("");
  const [resetForm, setResetForm] = useState({ password: "", confirm: "" });
  const [resetErrors, setResetErrors] = useState({});
  const [resetMsg, setResetMsg] = useState(null);
  const [showResetPw, setShowResetPw] = useState(false);
  const [showResetConfirmPw, setShowResetConfirmPw] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = (params.get("reset_token") || "").trim();

    if (!tokenFromUrl) {
      return;
    }

    setView("login");
    setShowForgot(false);
    setShowReset(true);
    setResetToken(tokenFromUrl);
    setResetForm({ password: "", confirm: "" });
    setResetErrors({});
    setResetMsg(null);
  }, [location.search]);

  const handleGuest = () => {
    if (onGuestLogin) onGuestLogin();
    navigate("/");
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const switchToSignup = () => {
    setView("signup");
    setLoginForm({ username: "", password: "" });
    setLoginErrors({});
    setLoginMsg(null);
    // Show the privacy notice when entering the signup flow
    setPrivacyAcknowledged(false);
    setShowPrivacy(true);
  };

  const switchToLogin = () => {
    setView("login");
    setSignupForm({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
    setSignupErrors({});
    setSignupMsg(null);
    setTermsChecked(false);
    setPrivacyAcknowledged(false);
  };

  // ── Demo account (works without backend) ──
  const DEMO_EMAIL = "demo@soucul.com";
  const DEMO_PASSWORD = "Demo1234!";
  const DEMO_PROFILE = {
    name: "Juan Dela Cruz",
    email: DEMO_EMAIL,
    phone: "09171234567",
    birthday: "1998-06-15",
    gender: "Male",
    profileImage: "",
  };

  // ── Login ──
  const handleLogin = async () => {
    const errors = {};
    if (!loginForm.username.trim()) errors.username = "Email is required.";
    if (!loginForm.password) errors.password = "Password is required.";
    setLoginErrors(errors);
    if (Object.keys(errors).length) return;

    const email = loginForm.username.trim().toLowerCase();
    const password = loginForm.password;

    // Demo account fallback
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setLoginMsg({ type: "success", text: "Login successful! Redirecting..." });
      if (onLogin) onLogin(DEMO_PROFILE);
      setTimeout(() => navigate("/"), 1200);
      return;
    }

    try {
      setLoginMsg({ type: "info", text: "Logging in..." });
      const api = window.CustomerAPI;
      const result = await api.login(email, password);

      if (result.success) {
        setLoginMsg({ type: "success", text: "Login successful! Redirecting..." });
        if (onLogin) {
          onLogin({
            name: (result.data.user?.first_name || '') + " " + (result.data.user?.last_name || ''),
            email: result.data.user?.email || "",
            phone: "",
            birthday: "",
            gender: "",
            profileImage: result.data.user?.profile_image_url || "",
          });
        }
        setTimeout(() => navigate("/"), 1200);
      } else {
        setLoginMsg({ type: "error", text: result.message || "Login failed." });
      }
    } catch {
      setLoginMsg({ type: "error", text: "Invalid email or password." });
    }
  };

  // ── Signup ──
  const handleSignup = async () => {
    const { firstName, lastName, email, password, confirm } = signupForm;
    const errors = {};

    if (!firstName.trim()) errors.firstName = "First name is required.";
    else if (!/^[a-zA-Z\s'-]+$/.test(firstName)) errors.firstName = "First name contains invalid characters.";

    if (!lastName.trim()) errors.lastName = "Last name is required.";
    else if (!/^[a-zA-Z\s'-]+$/.test(lastName)) errors.lastName = "Last name contains invalid characters.";

    if (!email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email address.";

    if (!password) errors.password = "Password is required.";
    else if (!PW_RULES.every((r) => r.test(password))) errors.password = "Password does not meet all requirements.";

    if (!confirm) errors.confirm = "Please confirm your password.";
    else if (confirm !== password) errors.confirm = "Passwords do not match.";

    if (!termsChecked) errors.terms = "You must agree to the Terms & Conditions.";

    setSignupErrors(errors);
    if (Object.keys(errors).length) return;

    try {
      setSignupMsg({ type: "info", text: "Creating account..." });
      const api = window.CustomerAPI;
      const result = await api.register(firstName.trim(), lastName.trim(), email.trim(), password);

      if (result.success) {
        setSignupMsg({ type: "success", text: "Account created successfully! Redirecting to login..." });
        setTimeout(() => switchToLogin(), 1600);
      } else {
        setSignupMsg({ type: "error", text: result.message || "Registration failed." });
      }
    } catch {
      setSignupMsg({ type: "error", text: "Registration failed. Please try again." });
    }
  };

  // ── Forgot ──
  const clearResetTokenFromUrl = () => {
    const params = new URLSearchParams(location.search);
    if (!params.has("reset_token")) return;

    params.delete("reset_token");
    const search = params.toString();
    navigate({ pathname: "/Login", search: search ? `?${search}` : "" }, { replace: true });
  };

  const closeResetModal = () => {
    setShowReset(false);
    setResetForm({ password: "", confirm: "" });
    setResetErrors({});
    setResetMsg(null);
    setShowResetPw(false);
    setShowResetConfirmPw(false);
    clearResetTokenFromUrl();
  };

  const requestForgotPassword = async (email) => {
    const api = window.CustomerAPI;
    if (!api) {
      throw new Error("Customer API is unavailable.");
    }

    if (typeof api.forgotPassword === "function") {
      return api.forgotPassword(email);
    }

    if (typeof api.request === "function") {
      return api.request("/api/v1/customer/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        skipAuth: true,
      });
    }

    throw new Error("Forgot password service is unavailable.");
  };

  const requestResetPassword = async (token, password, confirmPassword) => {
    const api = window.CustomerAPI;
    if (!api) {
      throw new Error("Customer API is unavailable.");
    }

    if (typeof api.resetPassword === "function") {
      return api.resetPassword(token, password, confirmPassword);
    }

    if (typeof api.request === "function") {
      return api.request("/api/v1/customer/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token,
          password,
          confirm_password: confirmPassword,
        }),
        skipAuth: true,
      });
    }

    throw new Error("Reset password service is unavailable.");
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) { setForgotError("Please enter your email address."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) { setForgotError("Please enter a valid email address."); return; }
    setForgotError("");
    setForgotMsg({ type: "info", text: "Sending reset link..." });

    try {
      const result = await requestForgotPassword(forgotEmail.trim());
      setForgotMsg({ type: "success", text: result?.message || "If this email exists, a reset link will be sent." });
    } catch (err) {
      setForgotMsg({ type: "error", text: err?.message || "Unable to send reset link. Please try again." });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!resetToken.trim()) {
      errors.token = "Reset link is invalid or missing token.";
    }

    if (!resetForm.password) {
      errors.password = "New password is required.";
    } else if (!PW_RULES.every((rule) => rule.test(resetForm.password))) {
      errors.password = "Password does not meet all requirements.";
    }

    if (!resetForm.confirm) {
      errors.confirm = "Please confirm your new password.";
    } else if (resetForm.confirm !== resetForm.password) {
      errors.confirm = "Passwords do not match.";
    }

    setResetErrors(errors);
    if (Object.keys(errors).length) return;

    setResetMsg({ type: "info", text: "Updating password..." });

    try {
      const result = await requestResetPassword(resetToken.trim(), resetForm.password, resetForm.confirm);

      setResetMsg({ type: "success", text: result?.message || "Password has been reset successfully." });
      setLoginMsg({ type: "success", text: "Password updated. You can now log in." });

      setTimeout(() => {
        closeResetModal();
      }, 1000);
    } catch (err) {
      setResetMsg({ type: "error", text: err?.message || "Unable to reset password. Please try again." });
    }
  };

  return (
    <div className="auth-page">
      <img src={mapBg} alt="" className="auth-bg" />

      {/* ── Back button (rendered outside card wrappers so the wrapper's
            transform animation doesn't reposition the fixed button) ── */}
      <button
        className="auth-back-btn"
        onClick={view === "signup" ? switchToLogin : handleBack}
        aria-label={view === "signup" ? "Back to login" : "Go back"}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        <span>Back</span>
      </button>

      {/* ── Login Card ── */}
      {view === "login" && (
        <div className="auth-card-wrapper auth-fade-in">
          <div className="auth-logo"><img src="/assets/images/icon.png" alt="SouCul Logo" /></div>
          <div className="auth-card">
            <h2 className="auth-title">Welcome</h2>
            <p className="auth-subtitle">Login to open your account</p>

            {loginMsg && <div className={`auth-msg auth-msg-${loginMsg.type}`}>{loginMsg.text}</div>}

            <div className="auth-input-group">
              <span className="auth-icon-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <input
                type="email" placeholder="Email Address"
                className={loginErrors.username ? "auth-error-field" : ""}
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            {loginErrors.username && <span className="auth-field-error">{loginErrors.username}</span>}

            <div className="auth-input-group">
              <span className="auth-icon-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input
                type={showLoginPw ? "text" : "password"} placeholder="Password"
                className={loginErrors.password ? "auth-error-field" : ""}
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <span className="auth-icon-right" onClick={() => setShowLoginPw(!showLoginPw)}>
                {showLoginPw ? "Hide" : "Show"}
              </span>
            </div>
            {loginErrors.password && <span className="auth-field-error">{loginErrors.password}</span>}

            <div className="auth-options">
              <a onClick={() => { setShowForgot(true); setForgotEmail(""); setForgotError(""); setForgotMsg(null); }}>Forget Password?</a>
            </div>

            <div className="auth-btn-row">
              <button className="auth-btn auth-btn-outline" onClick={switchToSignup}>SIGN UP</button>
              <button className="auth-btn auth-btn-solid" onClick={handleLogin}>LOG IN</button>
            </div>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <button className="auth-btn-guest" onClick={handleGuest}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Continue as Guest
            </button>

          </div>
        </div>
      )}

      {/* ── Signup Card ── */}
        {view === "signup" && (
          <div className="auth-card-wrapper auth-fade-in">
            <div className="auth-logo"><img src="/assets/images/icon.png" alt="SouCul Logo" /></div>
            <div className="auth-card">
          <h2 className="auth-title">Welcome</h2>
          <p className="auth-subtitle">Sign Up to open your account</p>

          {signupMsg && <div className={`auth-msg auth-msg-${signupMsg.type}`}>{signupMsg.text}</div>}

          <div className="auth-input-group">
            <span className="auth-icon-left">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <input type="text" placeholder="First Name" className={signupErrors.firstName ? "auth-error-field" : ""}
              value={signupForm.firstName} onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })} />
          </div>
          {signupErrors.firstName && <span className="auth-field-error">{signupErrors.firstName}</span>}

          <div className="auth-input-group">
            <span className="auth-icon-left">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <input type="text" placeholder="Last Name" className={signupErrors.lastName ? "auth-error-field" : ""}
              value={signupForm.lastName} onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })} />
          </div>
          {signupErrors.lastName && <span className="auth-field-error">{signupErrors.lastName}</span>}

          <div className="auth-input-group">
            <span className="auth-icon-left">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/></svg>
            </span>
            <input type="email" placeholder="Email Address" className={signupErrors.email ? "auth-error-field" : ""}
              value={signupForm.email} onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })} />
          </div>
          {signupErrors.email && <span className="auth-field-error">{signupErrors.email}</span>}

          <div className="auth-input-group">
            <span className="auth-icon-left">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <input type={showSignupPw ? "text" : "password"} placeholder="Password"
              className={signupErrors.password ? "auth-error-field" : ""}
              value={signupForm.password}
              onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })} />
            <span className="auth-icon-right" onClick={() => setShowSignupPw(!showSignupPw)}>
              {showSignupPw ? "Hide" : "Show"}
            </span>
          </div>
          {signupErrors.password && <span className="auth-field-error">{signupErrors.password}</span>}

          <div className="auth-pw-requirements">
            <p>Password must contain:</p>
            {PW_RULES.map((r) => (
              <div key={r.key} className={`auth-pw-req-item${r.test(signupForm.password) ? " met" : ""}`}>
            <span className="auth-req-dot" />
            {r.label}
              </div>
            ))}
          </div>

          <div className="auth-input-group">
            <span className="auth-icon-left">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <input type={showConfirmPw ? "text" : "password"} placeholder="Confirm Password"
              className={signupErrors.confirm ? "auth-error-field" : ""}
              value={signupForm.confirm}
              onChange={(e) => setSignupForm({ ...signupForm, confirm: e.target.value })} />
            <span className="auth-icon-right" onClick={() => setShowConfirmPw(!showConfirmPw)}>
              {showConfirmPw ? "Hide" : "Show"}
            </span>
          </div>
          {signupErrors.confirm && <span className="auth-field-error">{signupErrors.confirm}</span>}

          <label className="auth-terms" onClick={() => setTermsChecked(!termsChecked)}>
            <span className={`auth-circle-check${termsChecked ? " checked" : ""}`} />
            <span>I agree to the <a onClick={(e) => { e.stopPropagation(); setShowTos(true); }}>Terms & Conditions</a></span>
            </label>
            {signupErrors.terms && <span className="auth-field-error">{signupErrors.terms}</span>}

            <button className="auth-btn-full" onClick={handleSignup}>SIGN UP</button>
            <div className="auth-footer-text">
              Already have an Account? <a onClick={switchToLogin}>Login</a>
            </div>
          </div>
        </div>
      )}

      {/* ── Forgot Password Modal ── */}
      {showForgot && (
        <div className="auth-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForgot(false)}>
          <div className="auth-modal-wrapper auth-fade-in">
            <div className="auth-logo">S</div>
            <div className="auth-modal-card">
              <span className="auth-modal-close" onClick={() => setShowForgot(false)}>&times;</span>
              <h2 className="auth-title">Forgot Password</h2>
              <p className="auth-subtitle">Enter your email to reset your password</p>
              <form onSubmit={handleForgot}>
                <div className="auth-input-group">
                  <span className="auth-icon-left">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/></svg>
                  </span>
                  <input type="email" placeholder="Email Address"
                    className={forgotError ? "auth-error-field" : ""}
                    value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
                </div>
                {forgotError && <span className="auth-field-error">{forgotError}</span>}
                {forgotMsg && <div className={`auth-msg auth-msg-${forgotMsg.type}`}>{forgotMsg.text}</div>}
                <button className="auth-btn-full" type="submit" style={{ marginTop: 0 }}>Send Reset Link</button>
              </form>
              <div className="auth-footer-text" style={{ marginTop: 14 }}>
                Remembered? <a onClick={() => setShowForgot(false)}>Back to Login</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Reset Password Modal ── */}
      {showReset && (
        <div className="auth-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeResetModal()}>
          <div className="auth-modal-wrapper auth-fade-in">
            <div className="auth-logo">S</div>
            <div className="auth-modal-card">
              <span className="auth-modal-close" onClick={closeResetModal}>&times;</span>
              <h2 className="auth-title">Reset Password</h2>
              <p className="auth-subtitle">Set your new password for your account</p>

              <form onSubmit={handleResetPassword}>
                {resetErrors.token && <span className="auth-field-error">{resetErrors.token}</span>}

                <div className="auth-input-group">
                  <span className="auth-icon-left">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                  <input
                    type={showResetPw ? "text" : "password"}
                    placeholder="New Password"
                    className={resetErrors.password ? "auth-error-field" : ""}
                    value={resetForm.password}
                    onChange={(e) => setResetForm({ ...resetForm, password: e.target.value })}
                  />
                  <span className="auth-icon-right" onClick={() => setShowResetPw(!showResetPw)}>
                    {showResetPw ? "Hide" : "Show"}
                  </span>
                </div>
                {resetErrors.password && <span className="auth-field-error">{resetErrors.password}</span>}

                <div className="auth-pw-requirements">
                  <p>Password must contain:</p>
                  {PW_RULES.map((r) => (
                    <div key={`reset-${r.key}`} className={`auth-pw-req-item${r.test(resetForm.password) ? " met" : ""}`}>
                      <span className="auth-req-dot" />
                      {r.label}
                    </div>
                  ))}
                </div>

                <div className="auth-input-group">
                  <span className="auth-icon-left">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                  <input
                    type={showResetConfirmPw ? "text" : "password"}
                    placeholder="Confirm New Password"
                    className={resetErrors.confirm ? "auth-error-field" : ""}
                    value={resetForm.confirm}
                    onChange={(e) => setResetForm({ ...resetForm, confirm: e.target.value })}
                  />
                  <span className="auth-icon-right" onClick={() => setShowResetConfirmPw(!showResetConfirmPw)}>
                    {showResetConfirmPw ? "Hide" : "Show"}
                  </span>
                </div>
                {resetErrors.confirm && <span className="auth-field-error">{resetErrors.confirm}</span>}

                {resetMsg && <div className={`auth-msg auth-msg-${resetMsg.type}`}>{resetMsg.text}</div>}

                <button className="auth-btn-full" type="submit" style={{ marginTop: 0 }}>Update Password</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Terms & Conditions Modal ── */}
      {showTos && (
        <div className="auth-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowTos(false)}>
          <div className="auth-tos-wrapper auth-fade-in">
            <div className="auth-modal-card auth-tos-card">
              <span className="auth-modal-close" onClick={() => setShowTos(false)}>&times;</span>
              <div className="auth-tos-title">Terms & Conditions</div>
              <p className="auth-tos-text">
                Welcome to <strong>SouCul Shop</strong> — your gateway to authentic Philippine culture. These Terms and Conditions govern your access to and use of our website and services. By creating an account or placing an order, you confirm that you have read, understood, and agree to be bound by these Terms.
              </p>

              {[
                { title: "1. About SouCul Shop", text: "SouCul Shop, short for Souvenir Culture, is an online retail platform dedicated to celebrating and promoting the richness of Filipino heritage. We offer a diverse range of products sourced from various provinces across the Philippines." },
                { title: "2. Eligibility & Account Registration", text: "To access certain features, you must register for an account. You agree to provide accurate, current, and complete information during registration and to keep your account details up to date." },
                { title: "3. Use of the Platform", text: "You agree to use SouCul Shop solely for lawful purposes and in a manner consistent with all applicable laws and regulations." },
                { title: "4. Product Listings & Availability", text: "SouCul Shop strives to provide accurate descriptions, images, and pricing for all listed products. Products are subject to availability." },
                { title: "5. Orders & Payments", text: "By placing an order, you represent that you are authorized to use the selected payment method. Payment must be completed in full before any order is processed." },
                { title: "6. Shipping & Delivery", text: "SouCul Shop ships products to both local and international addresses. Estimated delivery times are provided as a guide only." },
                { title: "7. Returns & Refunds", text: "If you receive a damaged, defective, or incorrect item, please contact us within 7 days of delivery." },
                { title: "8. Privacy & Data Protection", text: "We value your privacy. Any personal information you provide is collected and processed in accordance with our Privacy Policy." },
              ].map((s) => (
                <div key={s.title}>
                  <div className="auth-tos-section-title">{s.title}</div>
                  <p className="auth-tos-text">{s.text}</p>
                </div>
              ))}

              <div className="auth-tos-divider" />
              <button className="auth-btn-full" onClick={() => { setTermsChecked(true); setShowTos(false); setSignupErrors((e) => ({ ...e, terms: undefined })); }}>
                I Agree & Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── Data Privacy Modal (shown on signup entry) ── */}
      {showPrivacy && (
        <div className="auth-modal-overlay">
          <div className="auth-tos-wrapper auth-fade-in">
            <div className="auth-modal-card auth-tos-card">
              <div className="auth-privacy-header">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <div className="auth-tos-title" style={{ marginBottom: 0 }}>Data Privacy Notice</div>
              </div>
              <p className="auth-tos-text" style={{ marginTop: 12 }}>
                Before creating your account, please read how <strong>SouCul Shop</strong> collects, uses, and protects your personal information in accordance with the <strong>Philippine Data Privacy Act of 2012 (Republic Act No. 10173)</strong>.
              </p>

              {[
                {
                  title: "1. Personal Information We Collect",
                  text: "We collect your full name, email address, and account credentials during registration. Additional information such as your shipping address, contact number, and order history may be collected as you use our services.",
                },
                {
                  title: "2. Purpose of Data Collection",
                  text: "Your personal data is used solely to manage your account, process orders and payments, deliver products, send relevant service notifications, and improve your shopping experience on SouCul Shop.",
                },
                {
                  title: "3. Data Sharing & Disclosure",
                  text: "We do not sell or rent your personal information to third parties. We may share data with trusted logistics and payment partners strictly for order fulfillment, and only to the extent necessary.",
                },
                {
                  title: "4. Data Retention",
                  text: "We retain your personal data for as long as your account is active or as required by law. You may request deletion of your account and associated data at any time by contacting our support team.",
                },
                {
                  title: "5. Your Rights Under RA 10173",
                  text: "You have the right to be informed, to access, to correct, to erase, to object, and to data portability. To exercise any of these rights, please reach out to our Data Protection Officer.",
                },
                {
                  title: "6. Security Measures",
                  text: "We implement industry-standard security measures including encrypted connections (HTTPS) and hashed password storage to protect your personal information from unauthorized access.",
                },
                {
                  title: "7. Consent",
                  text: "By clicking 'I Understand & Continue', you acknowledge that you have read this notice and consent to the collection and use of your personal information as described above.",
                },
              ].map((s) => (
                <div key={s.title}>
                  <div className="auth-tos-section-title">{s.title}</div>
                  <p className="auth-tos-text">{s.text}</p>
                </div>
              ))}

              <div className="auth-tos-divider" />
              <button
                className="auth-btn-full auth-btn-privacy-confirm"
                onClick={() => {
                  setPrivacyAcknowledged(true);
                  setShowPrivacy(false);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                I Understand &amp; Continue
              </button>
              <button
                className="auth-btn-privacy-decline"
                onClick={() => { setShowPrivacy(false); setView("login"); }}
              >
                Decline &amp; Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
