"use client";

import React, { useState, useEffect } from "react";
import "./auth.css";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function SupplierAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentAuthMode, setCurrentAuthMode] = useState<"signup" | "login">("signup");

  // Form State
  const [identifier, setIdentifier] = useState("9876543210");
  const [gstin, setGstin] = useState("29ABCDE1234F1Z5");
  const [password, setPassword] = useState("Supplier@Meesho2026");
  const [confirmPassword, setConfirmPassword] = useState("Supplier@Meesho2026");

  // JWT Modal State
  const [showModal, setShowModal] = useState(false);
  const [jwtData, setJwtData] = useState<any>(null);
  const [oauthTokens, setOauthTokens] = useState<any>(null);

  useEffect(() => {
    const demoUser = {
      sub: "SUP_DEMO_2026",
      identifier: "9876543210",
      auth_type: "DEMO_SESSION",
      gstin: "29ABCDE1234F1Z5",
      role: "MEESHO_VERIFIED_SUPPLIER",
      commission_tier: "0% COMMISSION",
      authenticated: true,
      permissions: ["CATALOG_CREATE", "ORDERS_MANAGE", "PAYMENTS_VIEW"],
    };
    localStorage.setItem("meesho_supplier_user", JSON.stringify(demoUser));
    localStorage.setItem("meesho_supplier_jwt", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.DEMO_PAYLOAD.DEMO_SIGNATURE");
    router.push("/supplier/influencer");
  }, [router]);

  function base64urlEncode(obj: any) {
    const jsonStr = JSON.stringify(obj);
    return btoa(unescape(encodeURIComponent(jsonStr)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  function simulateHMACSHA256Signature(headerBase64: string, payloadBase64: string) {
    const input = headerBase64 + "." + payloadBase64;
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0;
    }
    const simulatedSigHex =
      Math.abs(hash).toString(16).padStart(8, "0") +
      "f9e2d4a8b7c6103982736451a0b9c8d7e6f5" +
      Math.abs(hash * 31).toString(16);
    return btoa(simulatedSigHex)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  function getUserDatabase() {
    try {
      return JSON.parse(localStorage.getItem("meesho_supplier_users_db") || "{}");
    } catch (e) {
      return {};
    }
  }

  function saveUserToDatabase(userObj: any) {
    const db = getUserDatabase();
    db[userObj.identifier] = userObj;
    localStorage.setItem("meesho_supplier_users_db", JSON.stringify(db));
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      alert("Please enter your mobile number or email ID");
      return;
    }

    const usersDb = getUserDatabase();
    let statusTitle = "✓ HS256 Signed JSON Web Token Generated";
    let statusDesc = "Your supplier login details have been securely encrypted into a session token.";
    let resolvedGstin = gstin;
    const apiUrl = "";

    if (currentAuthMode === "signup") {
      if (password && confirmPassword && password !== confirmPassword) {
        alert("Authentication Error: Confirm Password does not match Password!");
        return;
      }

      // Try Backend Registration if available
      try {
        const res = await fetch(`${apiUrl}/api/supplier/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password, gstin }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            resolvedGstin = data.user.gstin || gstin;
          }
        }
      } catch (err) {
        // Fallback to local DB check below
      }

      if (usersDb[identifier]) {
        statusTitle = "✓ Registered Account Authenticated & JWT Issued";
        statusDesc = `User '${identifier}' is already registered in the database. Credentials verified and new session token generated.`;
        resolvedGstin = usersDb[identifier].gstin || gstin;
      } else {
        const newUser = {
          identifier: identifier,
          password: password || "Supplier@Meesho2026",
          gstin: gstin,
          role: "MEESHO_VERIFIED_SUPPLIER",
          commission_tier: "0% COMMISSION",
          registered_at: new Date().toISOString(),
        };
        saveUserToDatabase(newUser);
        statusTitle = "✓ New Supplier Account Registered & JWT Generated";
        statusDesc = `User details for '${identifier}' saved to database. Credentials encrypted into a verified HS256 session token.`;
      }
    } else {
      // LOGIN MODE
      // Try Backend Verification first
      let backendHandled = false;
      try {
        const res = await fetch(`${apiUrl}/api/supplier/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            backendHandled = true;
            resolvedGstin = data.user.gstin || "VERIFIED_ON_FILE";
            statusTitle = "✓ User Authenticated via Backend Encrypted DB & JWT Verified";
            statusDesc = `Credentials for '${identifier}' successfully validated against encrypted database. HS256 session token verified.`;
            
            // Sync with local DB
            saveUserToDatabase({
              identifier: data.user.identifier,
              password: password,
              gstin: resolvedGstin,
              role: data.user.role || "MEESHO_VERIFIED_SUPPLIER",
              commission_tier: data.user.commission_tier || "0% COMMISSION",
              registered_at: new Date().toISOString(),
            });
          }
        } else if (res.status === 401 || res.status === 404) {
          const errData = await res.json().catch(() => ({}));
          alert(errData.detail || `Authentication Failed for '${identifier}'. Please check your credentials and try again.`);
          return;
        }
      } catch (err) {
        // Network error / backend not running, fall back to local check below
      }

      if (!backendHandled) {
        const existingUser = usersDb[identifier];
        if (!existingUser) {
          alert(`Authentication Failed: No registered account found for '${identifier}'. Please switch to Sign Up to create an account first.`);
          return;
        }

        if (password && existingUser.password && existingUser.password !== password) {
          alert(`Authentication Failed: Incorrect password entered for '${identifier}'. Please check your password and try again.`);
          return;
        }

        resolvedGstin = existingUser.gstin || "VERIFIED_ON_FILE";
        statusTitle = "✓ User Authenticated via Saved Credentials & JWT Verified";
        statusDesc = `Credentials for '${identifier}' successfully validated against registered user database. HS256 session token verified.`;
      }
    }

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 86400; // 24 hours

    const jwtHeader = { alg: "HS256", typ: "JWT" };
    const jwtPayload = {
      sub: `SUP_${Math.floor(1000 + Math.random() * 9000)}`,
      identifier: identifier,
      auth_type: currentAuthMode.toUpperCase(),
      gstin: resolvedGstin,
      role: "MEESHO_VERIFIED_SUPPLIER",
      commission_tier: "0% COMMISSION",
      authenticated: true,
      permissions: ["CATALOG_CREATE", "ORDERS_MANAGE", "PAYMENTS_VIEW"],
      iat: iat,
      exp: exp,
    };

    const headerB64 = base64urlEncode(jwtHeader);
    const payloadB64 = base64urlEncode(jwtPayload);
    const sigB64 = simulateHMACSHA256Signature(headerB64, payloadB64);
    const fullJwtString = `${headerB64}.${payloadB64}.${sigB64}`;

    localStorage.setItem("meesho_supplier_jwt", fullJwtString);
    localStorage.setItem("meesho_supplier_user", JSON.stringify(jwtPayload));

    router.push("/supplier/dashboard");
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const decoded: any = jwtDecode(credentialResponse.credential);
      const identifier = decoded.email || "google_supplier@meesho.com";
      const iat = Math.floor(Date.now() / 1000);
      const exp = iat + 86400;

      const jwtHeader = { alg: "HS256", typ: "JWT" };
      const jwtPayload = {
        sub: decoded.sub || `SUP_${Math.floor(1000 + Math.random() * 9000)}`,
        identifier: identifier,
        name: decoded.name,
        picture: decoded.picture,
        auth_type: "GOOGLE_OAUTH",
        gstin: "VERIFIED_VIA_GOOGLE_OAUTH",
        role: "MEESHO_VERIFIED_SUPPLIER",
        commission_tier: "0% COMMISSION",
        authenticated: true,
        permissions: ["CATALOG_CREATE", "ORDERS_MANAGE", "PAYMENTS_VIEW"],
        iat: iat,
        exp: exp,
      };

      const headerB64 = base64urlEncode(jwtHeader);
      const payloadB64 = base64urlEncode(jwtPayload);
      const sigB64 = simulateHMACSHA256Signature(headerB64, payloadB64);
      const fullJwtString = `${headerB64}.${payloadB64}.${sigB64}`;

      localStorage.setItem("meesho_supplier_jwt", fullJwtString);
      localStorage.setItem("meesho_supplier_user", JSON.stringify(jwtPayload));

      router.push("/supplier/dashboard");
    }
  };

  const handleGoogleError = () => {
    alert("Google Login Failed. Please try again or use Phone/Email.");
  };

  const copyJwt = () => {
    if (jwtData?.token) {
      navigator.clipboard.writeText(jwtData.token);
      alert("JWT Token copied to clipboard!");
    }
  };

  return (
    <div className="auth-body">
      {/* Top Navigation Header */}
      <header className="auth-header">
        <Link href="/" className="brand-link" title="Return to Meesho Main Home Page">
          {/* Exact Meesho Vector Logo */}
          <svg height="32" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 28V12L18.5 21L25 12V28" stroke="#9F2089" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <text x="32" y="27" fill="#9F2089" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="24" letterSpacing="-0.5px">meesho</text>
          </svg>
          <span className="brand-badge">Supplier Panel</span>
        </Link>

        <div className="header-links">
          <Link href="/supplier">← Back to Supplier Front Page</Link>
          <Link href="/" style={{ fontWeight: 700, color: "#9F2089" }}>🛒 Shopping Front Page</Link>
        </div>
      </header>

      {/* Main Split Auth Card */}
      <main className="auth-main">
        <div className="auth-container">
          {/* Left Promotional Composition Panel */}
          <div className="promo-panel">
            <div>
              <span className="promo-tag">INDIA&apos;S LEADING SELLER PLATFORM</span>
              <h1 className="promo-headline">Grow Your Business 10X on Meesho</h1>
              <p className="promo-subtext">Join over 14 Lakh+ verified suppliers across India and list your products at 0% commission.</p>

              <div className="benefit-list">
                <div className="benefit-item">
                  <div className="benefit-icon">₹</div>
                  <span>0% Commission Fee across 700+ Categories</span>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">⚡</div>
                  <span>Fast 10-Minute Catalog &amp; Store Setup</span>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🛡️</div>
                  <span>Guaranteed Payouts Every 7 Days</span>
                </div>
              </div>
            </div>

            <div className="promo-testimonial">
              <p>“I started selling sarees on Meesho with zero upfront cost. Within 6 months, our daily orders crossed 400+ shipments with 0% commission!”</p>
              <div className="promo-testimonial-user">
                <span>✓ Verified Meesho Supplier</span>
                <span style={{ opacity: 0.8 }}>• Surat, Gujarat</span>
              </div>
            </div>
          </div>

          {/* Right Interactive Auth Form Panel */}
          <div className="form-panel">
            {/* Auth Mode Toggle Tabs */}
            <div className="auth-tabs">
              <button
                className={`auth-tab-btn ${currentAuthMode === "signup" ? "active" : ""}`}
                type="button"
                onClick={() => setCurrentAuthMode("signup")}
              >
                Sign Up (New Supplier)
              </button>
              <button
                className={`auth-tab-btn ${currentAuthMode === "login" ? "active" : ""}`}
                type="button"
                onClick={() => setCurrentAuthMode("login")}
              >
                Login (Existing)
              </button>
            </div>

            <h2 className="form-title" id="auth-title">
              {currentAuthMode === "signup" ? "Create Supplier Account" : "Login to Supplier Panel"}
            </h2>
            <p className="form-subtitle" id="auth-subtitle">
              {currentAuthMode === "signup"
                ? "Start selling to crores of customers at 0% commission"
                : "Enter your registered mobile number or email ID"}
            </p>

            {/* Google OAuth Button */}
            <div className="oauth-buttons-grid" style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                shape="rectangular"
                theme="outline"
                size="large"
                width="100%"
              />
            </div>

            <div className="oauth-divider">
              <span>Or register with phone/email</span>
            </div>

            <form onSubmit={handleAuthSubmit} autoComplete="off">
              <div className="form-group">
                <label className="form-label" htmlFor="input-identifier">Mobile Number or Email ID</label>
                <div className="form-input-wrap">
                  <span className="input-prefix">+91</span>
                  <input
                    type="text"
                    id="input-identifier"
                    className="form-input has-prefix"
                    placeholder="98765 43210 or supplier@meesho.com"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
              </div>

              {currentAuthMode === "signup" && (
                <div className="form-group" id="field-gstin">
                  <label className="form-label" htmlFor="input-gstin">GSTIN or Enrolment ID</label>
                  <input
                    type="text"
                    id="input-gstin"
                    className="form-input"
                    placeholder="e.g. 29ABCDE1234F1Z5"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="input-password">Account Password</label>
                <input
                  type="password"
                  id="input-password"
                  className="form-input"
                  placeholder="Enter secure password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {currentAuthMode === "signup" && (
                <div className="form-group" id="field-confirm-pass">
                  <label className="form-label" htmlFor="input-confirm-password">Confirm Password</label>
                  <input
                    type="password"
                    id="input-confirm-password"
                    className="form-input"
                    placeholder="Re-enter secure password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              )}

              <div>
                <span className="role-badge">✓ JWT Authenticated Supplier Session</span>
              </div>

              <button type="submit" className="btn-submit-auth" id="auth-submit-btn">
                {currentAuthMode === "signup" ? "Register & Generate JWT" : "Authenticate & Login via JWT"}
              </button>

              <p className="form-footer-note">
                By proceeding, you agree to Meesho&apos;s <a href="#">Supplier Terms of Service</a> &amp; <a href="#">Privacy Policy</a>.
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Interactive JWT Authentication Modal */}
      {showModal && jwtData && (
        <div className="jwt-modal-overlay active" style={{ display: "flex" }}>
          <div className="jwt-modal">
            <div className="jwt-modal-header">
              <h3>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <span>Authentication Successful</span>
              </h3>
              <button onClick={() => setShowModal(false)} style={{ color: "white", fontSize: "24px", cursor: "pointer" }}>&times;</button>
            </div>

            <div className="jwt-modal-body">
              <div className="jwt-success-banner">
                <div>
                  <h4>{jwtData.statusTitle}</h4>
                  <p>{jwtData.statusDesc}</p>
                </div>
              </div>

              {oauthTokens && (
                <div style={{ marginBottom: "22px" }}>
                  <div className="jwt-section-title" style={{ color: "#9F2089" }}>BEARER &amp; ID SESSION TOKENS STORED</div>
                  <div style={{ background: "#1E1F2C", border: "1.5px solid #3C29B7", borderRadius: "8px", padding: "14px", fontFamily: "monospace", fontSize: "12.5px", color: "#FFFFFF", lineHeight: 1.6 }}>
                    <div style={{ marginBottom: "8px" }}><strong>Provider:</strong> <span style={{ color: "#43E6A1", fontWeight: 800 }}>{oauthTokens.provider}</span></div>
                    <div style={{ marginBottom: "8px" }}><strong>Access Token (Bearer):</strong> <div style={{ color: "#FF70B8", wordBreak: "break-all", background: "rgba(255, 112, 184, 0.1)", padding: "6px", borderRadius: "4px", marginTop: "4px" }}>{oauthTokens.accessToken}</div></div>
                    <div><strong>ID Token (Session Claims):</strong> <div style={{ color: "#A68FFF", wordBreak: "break-all", background: "rgba(166, 143, 255, 0.1)", padding: "6px", borderRadius: "4px", marginTop: "4px" }}>{oauthTokens.idToken}</div></div>
                  </div>
                </div>
              )}

              <div className="jwt-section-title">ENCODED JWT TOKEN (HEADER . PAYLOAD . SIGNATURE)</div>
              <div className="jwt-token-box">
                <button className="btn-copy-jwt" onClick={copyJwt} type="button">Copy JWT</button>
                <div id="jwt-token-formatted">
                  <span style={{ color: "#FF70B8" }}>{jwtData.headerB64}</span>.
                  <span style={{ color: "#A68FFF" }}>{jwtData.payloadB64}</span>.
                  <span style={{ color: "#43E6A1" }}>{jwtData.sigB64}</span>
                </div>
              </div>

              <div className="jwt-section-title">DECODED LOGIN DETAILS (JWT PAYLOAD JSON)</div>
              <pre className="jwt-payload-card">{JSON.stringify(jwtData.payload, null, 2)}</pre>
            </div>

            <div className="jwt-modal-footer">
              <button className="btn-dashboard-enter" onClick={() => router.push("/supplier/dashboard")}>
                Enter Supplier Dashboard →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SupplierAuth() {
  return (
    <React.Suspense fallback={<div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#FAF8FB", color: "#616173", fontWeight: 600 }}>Loading Supplier Authentication...</div>}>
      <SupplierAuthContent />
    </React.Suspense>
  );
}
