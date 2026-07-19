"use client";

import React, { useState, useEffect } from "react";
import "./influencer.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InfluencerMarketingPage() {
  const router = useRouter();
  const [supplierName, setSupplierName] = useState<string>("Frostilicious");

  // Modal States exactly as in supplier-influencer.html/js
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [showAiConsoleModal, setShowAiConsoleModal] = useState(false);
  const [showHowModal, setShowHowModal] = useState(false);

  // AI Console Toggles
  const [optCreators, setOptCreators] = useState(true);
  const [optRoi, setOptRoi] = useState(true);
  const [optScripts, setOptScripts] = useState(true);
  const [aiLogs, setAiLogs] = useState<string[]>([
    "[VyaparSetu Autonomous AI] System initialized. Ready to automate catalog promotion...",
    "[AI Matchmaker] Connected to Meesho Creator Network API (50,418 Active Creators)",
    '[System] Click "Activate Autonomous AI Mode" to start 24/7 campaigns.',
  ]);

  // Catalogs for selection
  const [modalCatalogs, setModalCatalogs] = useState<any[]>([
    {
      id: "MSH-KRTI-101",
      title: "Designer Floral Silk Anarkali Kurti",
      price: 599,
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80",
      roi: "Recommended 8% ROI",
      selected: true,
    },
    {
      id: "MSH-SRE-204",
      title: "Georgette Embroidered Saree with Blouse",
      price: 1299,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80",
      roi: "Recommended 6% ROI",
      selected: true,
    },
    {
      id: "MSH-WTCH-88",
      title: "Men Luxury Chronograph Wrist Watch",
      price: 849,
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=300&q=80",
      roi: "Recommended 10% ROI",
      selected: false,
    },
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.name = "meesho_supplier_hub";
    }
    // Strict Authentication Guard exactly as in supplier-influencer.js
    const jwt = localStorage.getItem("meesho_supplier_jwt") || sessionStorage.getItem("session_jwt");
    const userJson = localStorage.getItem("meesho_supplier_user");

    if (!jwt && !userJson) {
      // Flexible Hackathon Mode: Allow unauthenticated visitors to view the page by initializing a default demo session
      const demoUser = {
        sub: `SUP_${Math.floor(1000 + Math.random() * 9000)}`,
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
      setSupplierName("9876543210");
      return;
    }

    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user.identifier) {
          const cleanId = user.identifier.split("@")[0];
          const name = cleanId.charAt(0).toUpperCase() + cleanId.slice(1);
          setSupplierName(name);
        }
      } catch (err) {
        console.warn("Error reading session user:", err);
      }
    }

    // Load Catalogs from DB if present
    const raw = localStorage.getItem("meesho_supplier_catalogs_db");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.length > 0) {
          setModalCatalogs(
            parsed.map((item: any) => ({
              id: item.id,
              title: item.title,
              price: item.price,
              image: item.image,
              roi: item.roi || "Recommended 8% ROI",
              selected: item.influencerEnrolled ?? true,
            }))
          );
        }
      } catch (e) {}
    }
  }, [router]);

  const handleToggleCheck = (index: number) => {
    setModalCatalogs((prev) =>
      prev.map((item, i) => (i === index ? { ...item, selected: !item.selected } : item))
    );
  };

  const handleConfirmEnroll = () => {
    alert("⚡ Success! Your selected catalogs have been enrolled and sent to 50,000+ Meesho Influencers for reel creation.");
    setShowCatalogModal(false);
    const topBtn = document.getElementById("btn-select-catalogs-top");
    const mainBtn = document.getElementById("btn-select-catalogs-main");
    if (topBtn) {
      topBtn.textContent = "✓ Catalogs Enrolled";
      topBtn.style.background = "#038D63";
    }
    if (mainBtn) {
      mainBtn.textContent = "✓ Catalogs Enrolled in Influencer Program";
      mainBtn.style.background = "#038D63";
    }
  };

  const handleActivateAi = () => {
    const lines = [
      "[00:01s] Scanning Meesho Catalog Database (meesho_supplier_catalogs)...",
      "[00:02s] Found 3 Active SKUs -> Matching with Top Reel Creators...",
      "[00:03s] SKU MSH-KRTI-101 matched with @lishapatel._ (Reach: 450k views)",
      "[00:04s] Dynamic Commission auto-balanced to 8.2% ROI to outbid competitors.",
      "[00:05s] ✓ AUTONOMOUS INFLUENCER AUTO-PILOT ENGAGED! 🚀",
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setAiLogs((prev) => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setShowAiConsoleModal(false);
          window.open("/ai-broker", "vyaparsetu_ai_tab");
        }, 1200);
      }
    }, 400);
  };

  return (
    <div className="influencer-body" style={{ display: "flex", minHeight: "100vh" }}>
      {/* ==================== LEFT DARK SIDEBAR ==================== */}
      <aside className="dashboard-sidebar">
        {/* Store Dropdown Selector */}
        <div className="store-selector-bar">
          <div className="store-info">
            <div className="store-avatar" id="store-avatar-char">{supplierName.charAt(0).toUpperCase()}</div>
            <span className="store-name" id="store-name-display">{supplierName}</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>

        {/* Quick Action Notices & Support */}
        <div className="quick-notices-bar">
          <a href="#" className="notice-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span>Notices</span>
          </a>
          <a href="#" className="notice-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
            <span>Support</span>
          </a>
        </div>

        {/* Scrollable Sidebar Links */}
        <nav className="sidebar-nav-scroll">
          <Link href="/supplier/dashboard" className="nav-link">
            <div className="nav-link-content">
              <span className="nav-icon">🏠</span>
              <span>Home</span>
            </div>
          </Link>

          <div className="nav-section-title">Boost Sales</div>

          <Link href="/supplier/influencer" className="nav-link active">
            <div className="nav-link-content">
              <span className="nav-icon">🚀</span>
              <span>Influencer Marketing</span>
            </div>
          </Link>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px" }}>
          <Link href="/" style={{ textDecoration: "none" }} title="Go to Meesho Main Shopping Home">
            <div className="sidebar-meesho-logo">meesho</div>
            <div className="sidebar-meesho-sub">Supplier Hub</div>
          </Link>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT AREA ==================== */}
      <main className="dashboard-main" style={{ flex: 1 }}>
        {/* Top Hub Header */}
        <header className="top-hub-header">
          <div className="hub-breadcrumb">
            <span>Supplier Hub / Boost Sales / <strong>Influencer Marketing</strong></span>
          </div>
          <div className="hub-actions">
            <Link href="/supplier/dashboard" className="btn-hub-switch">← Back to Dashboard</Link>
            <Link href="/" className="btn-hub-switch">🛒 Shopping Front Page</Link>
          </div>
        </header>

        {/* Influencer Content Area */}
        <div className="influencer-content-pad">
          {/* Page Title Header Strip */}
          <div className="influencer-page-header">
            <h1>Influencer Marketing</h1>

            <div className="header-right-actions">
              <div className="btn-how-it-works" onClick={() => alert('Opening video walkthrough: How Meesho Influencer Marketing works!')}>
                <span className="yt-play-icon">▶</span>
                <span>How it Works?</span>
              </div>
              <button
                className="btn-select-catalogs-top"
                id="btn-select-catalogs-top"
                type="button"
                onClick={() => setShowCatalogModal(true)}
              >
                Select Catalogs
              </button>
            </div>
          </div>

          {/* NEW: AI ROBOT AUTOMATION BANNER & BUTTON */}
          <div className="ai-robot-automate-strip">
            <div className="ai-strip-left">
              <div className="robot-avatar-badge">
                <div className="robot-pulse-ring"></div>
                <span>🤖</span>
              </div>
              <div className="ai-strip-text">
                <h2>
                  <span>VyaparSetu AI Auto-Pilot</span>
                  <span className="ai-status-pill">BOT READY</span>
                </h2>
                <p>Let autonomous AI match your catalogs with high-converting Instagram &amp; Meesho App creators 24/7.</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
              {/* Small Helper Buttons / Icons Row */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  id="btn-open-ai-agent-how"
                  onClick={() => setShowHowModal(true)}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#FFF", color: "#3B169E", border: "1.5px solid #D6D0F2", padding: "6px 14px", borderRadius: "8px", fontWeight: 700, fontSize: "12px", cursor: "pointer", transition: "all 0.2s" }}
                >
                  <span style={{ fontSize: "14px" }}>💡</span>
                  <span>How it Works (AI Agent)</span>
                </button>

                <a
                  href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#FF0000", color: "#FFFFFF", textDecoration: "none", padding: "6px 14px", borderRadius: "8px", fontWeight: 700, fontSize: "12px", transition: "all 0.2s" }}
                >
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF", color: "#FF0000", width: "16px", height: "12px", borderRadius: "3px", fontSize: "8px", fontWeight: 900 }}>▶</span>
                  <span>Demo Video</span>
                </a>
              </div>

              {/* Large Prominent Hero Automate Button */}
              <Link
                href="/ai-broker"
                target="vyaparsetu_ai_tab"
                className="btn-robot-automate"
                id="btn-open-ai-robot"
                style={{ textDecoration: "none", padding: "18px 36px", fontSize: "17px", borderRadius: "16px" }}
              >
                <span className="robot-btn-icon" style={{ fontSize: "26px" }}>🤖</span>
                <span>Automate Your Influencer Market ✓</span>
              </Link>
            </div>
          </div>

          {/* 3. Hero Composition Banner */}
          <section className="influencer-hero-banner">
            {/* Left Text Content */}
            <div className="hero-left-col">
              <h2>Grow Orders with Influencer Promotion! <span className="chart-emoji">📈</span></h2>

              <div className="bullet-rows">
                <div className="bullet-row">
                  <span className="check-circle-green">✓</span>
                  <span><strong>50K+ influencers</strong> can make videos on your products</span>
                </div>

                <div className="bullet-row">
                  <span className="check-circle-green">✓</span>
                  <span>Videos are posted on <span className="meesho-pink-hl">Meesho App</span> + <strong>Social Media</strong> = <strong>More Visibility, More Sales</strong></span>
                </div>
              </div>

              <button
                className="btn-select-catalogs-main"
                id="btn-select-catalogs-main"
                type="button"
                onClick={() => setShowCatalogModal(true)}
              >
                Select Catalogs
              </button>
            </div>

            {/* Right Smartphone Reel Mockup */}
            <div className="hero-visual-col">
              {/* Floating Pills around phone */}
              <div className="floating-pill pill-top-right">Your Product</div>
              <div className="floating-pill pill-bottom-left">Your Product</div>
              <div className="floating-participate">
                <span>Participate</span>
                <span style={{ fontSize: "16px" }}>✨</span>
              </div>

              {/* Social Icons */}
              <div className="floating-icon-insta">📸</div>
              <div className="floating-icon-yt">▶</div>
              <div className="floating-icon-meesho">
                <span style={{ background: "#9F2089", color: "white", padding: "2px 6px", borderRadius: "4px", fontWeight: 800 }}>m</span>
                <span>meesho</span>
              </div>

              {/* Phone Mockup */}
              <div className="phone-mockup-frame">
                <div className="phone-screen">
                  <div className="reel-user-head">
                    <div className="reel-avatar">L</div>
                    <span>lishapatel._</span>
                  </div>

                  <div className="reel-center-model">💃🥻</div>

                  <div className="reel-product-overlay">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div className="reel-prod-thumb">👚</div>
                      <div>
                        <div className="reel-prod-text">Designer Floral Kurti</div>
                        <div className="reel-prod-price">₹1499 • Free COD</div>
                      </div>
                    </div>
                    <span style={{ color: "#9F2089", fontWeight: 800, fontSize: "12px" }}>View →</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Yellow Guarantee Strip */}
          <div className="yellow-guarantee-strip">
            <span className="thumbs-up-icon">👍</span>
            <span><strong>The Best Part = Opt out anytime</strong> from the program, in just one click</span>
          </div>

          {/* 5. Feature Benefits Cards Grid + Floating Callback Pill */}
          <section className="influencer-footer-section">
            {/* Floating Request Callback Button */}
            <button className="floating-callback-btn" onClick={() => alert('Meesho Creator Account Manager callback requested for your store!')}>
              <span>📞 Request Callback</span>
            </button>

            <div className="feature-cards-grid">
              {/* Card 1 */}
              <div className="inf-feature-card">
                <div className="inf-card-icon">📋</div>
                <div>
                  <div className="inf-card-title">No charges on Returned / Cancelled Orders</div>
                  <div className="inf-card-text">You only pay influencer promotion commission on successfully delivered orders.</div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="inf-feature-card">
                <div className="inf-card-icon purple">🛍️</div>
                <div>
                  <div className="inf-card-title">Choose Catalogs of your choice</div>
                  <div className="inf-card-text">Enroll specific high-margin catalogs you want top creators to showcase in video reels.</div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="inf-feature-card">
                <div className="inf-card-icon blue">💰</div>
                <div>
                  <div className="inf-card-title">Set any commission structure</div>
                  <div className="inf-card-text">Decide flexible, ROI-focused commission percentages tailored to your store&apos;s margin.</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ==================== INTERACTIVE SELECT CATALOGS MODAL ==================== */}
      {showCatalogModal && (
        <div className="modal-overlay active" id="catalog-selection-modal" style={{ display: "flex" }}>
          <div className="modal-box">
            <div className="modal-header-strip">
              <h3>Select Catalogs for Influencer Reels (50K+ Creators)</h3>
              <button onClick={() => setShowCatalogModal(false)} style={{ fontSize: "24px", color: "#888", background: "transparent", border: "none", cursor: "pointer" }}>&times;</button>
            </div>

            <div className="modal-content-pad">
              <p style={{ fontSize: "13.5px", color: "#58596B", marginBottom: "16px" }}>Select catalogs below to enroll them in the Meesho Influencer Promotion program:</p>

              {modalCatalogs.map((cat, idx) => (
                <div className="catalog-check-row" key={cat.id || idx}>
                  <div className="catalog-info-left" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={cat.selected}
                      onChange={() => handleToggleCheck(idx)}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <img src={cat.image} alt={cat.title} style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover" }} />
                    <div>
                      <div className="cat-title" style={{ fontWeight: 700, color: "#1E1F2C" }}>{cat.title}</div>
                      <div className="cat-meta" style={{ fontSize: "12px", color: "#616173" }}>SKU: {cat.id} • Selling Price: ₹{cat.price}</div>
                    </div>
                  </div>
                  <span className="comm-badge">{cat.roi}</span>
                </div>
              ))}
            </div>

            <div className="modal-foot">
              <button className="btn-hub-switch" type="button" onClick={() => setShowCatalogModal(false)}>Cancel</button>
              <button className="btn-select-catalogs-top" type="button" onClick={handleConfirmEnroll}>Enroll in Influencer Program →</button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== AI ROBOT AUTOMATION CONSOLE MODAL ==================== */}
      {showAiConsoleModal && (
        <div className="ai-console-modal active" id="ai-console-modal" style={{ display: "flex" }}>
          <div className="ai-console-card">
            <div className="ai-console-header">
              <div className="ai-console-title">
                <span style={{ fontSize: "26px" }}>🤖</span>
                <div>
                  <h3>VyaparSetu Autonomous AI Bot</h3>
                  <span style={{ fontSize: "11.5px", color: "#A3A6BC" }}>AI-Powered Influencer Matchmaking &amp; Commission Auto-Pilot</span>
                </div>
              </div>
              <button onClick={() => setShowAiConsoleModal(false)} type="button" style={{ color: "#A3A6BC", fontSize: "20px", background: "transparent", border: "none", cursor: "pointer" }}>✕</button>
            </div>

            <div className="ai-console-body">
              <div className="ai-feature-row">
                <div>
                  <h4>🕸️ Creator Auto-Match Engine (50,000+ Verified Reels)</h4>
                  <p>Automatically match SKUs with top fashion/tech creators based on audience demographic.</p>
                </div>
                <label className="ai-toggle-switch">
                  <input type="checkbox" checked={optCreators} onChange={(e) => setOptCreators(e.target.checked)} />
                  <span className="ai-slider"></span>
                </label>
              </div>

              <div className="ai-feature-row">
                <div>
                  <h4>📊 Dynamic ROI Commission Auto-Pilot</h4>
                  <p>Adjust influencer commission automatically (+/- 1.5%) to outbid competitors and maximize sales.</p>
                </div>
                <label className="ai-toggle-switch">
                  <input type="checkbox" checked={optRoi} onChange={(e) => setOptRoi(e.target.checked)} />
                  <span className="ai-slider"></span>
                </label>
              </div>

              <div className="ai-feature-row">
                <div>
                  <h4>💬 Automated Creator Script &amp; Reel Generation</h4>
                  <p>Generate high-converting script highlights and viral hashtags for creator submissions.</p>
                </div>
                <label className="ai-toggle-switch">
                  <input type="checkbox" checked={optScripts} onChange={(e) => setOptScripts(e.target.checked)} />
                  <span className="ai-slider"></span>
                </label>
              </div>

              <div className="ai-log-terminal" id="ai-terminal-log">
                {aiLogs.map((log, idx) => (
                  <div key={idx} style={{ marginBottom: "6px" }}>
                    {log}
                  </div>
                ))}
              </div>
            </div>

            <div className="ai-console-footer">
              <button className="btn-ai-cancel" type="button" onClick={() => setShowAiConsoleModal(false)}>Cancel</button>
              <button className="btn-ai-activate" type="button" onClick={handleActivateAi}>⚡ Activate Autonomous AI Mode</button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== AI AGENT HOW IT WORKS MODAL ==================== */}
      {showHowModal && (
        <div className="ai-console-modal active" id="ai-agent-how-modal" style={{ display: "flex" }}>
          <div className="ai-console-card" style={{ maxWidth: "720px", background: "#1E1F2C", border: "1px solid #3A3D54" }}>
            <div className="ai-console-header" style={{ background: "linear-gradient(135deg, #2A1C5A, #4A1FB8)", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "28px" }}>🤖</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#FFF" }}>How VyaparSetu AI Agent Works</h3>
                  <span style={{ fontSize: "12px", color: "#E8E0FF" }}>4-Stage Autonomous Influencer Marketing Pipeline</span>
                </div>
              </div>
              <button onClick={() => setShowHowModal(false)} type="button" style={{ background: "transparent", border: "none", color: "#FFF", fontSize: "20px", cursor: "pointer" }}>✕</button>
            </div>

            <div className="ai-console-body" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px", maxHeight: "70vh", overflowY: "auto" }}>
              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", background: "#262838", padding: "16px", borderRadius: "12px", borderLeft: "4px solid #4A1FB8" }}>
                <span style={{ fontSize: "24px" }}>📦</span>
                <div>
                  <h4 style={{ margin: "0 0 4px", color: "#FFF", fontSize: "15px" }}>Stage 1: Catalog &amp; Vector RAG Ingestion</h4>
                  <p style={{ margin: 0, fontSize: "13px", color: "#A3A6BC", lineHeight: "1.4" }}>The AI agent scans your live Meesho store inventory, extracting item specifications, target price tiers (e.g. ₹349 liquidation), and regional demand hotspots.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", background: "#262838", padding: "16px", borderRadius: "12px", borderLeft: "4px solid #9F2089" }}>
                <span style={{ fontSize: "24px" }}>🎯</span>
                <div>
                  <h4 style={{ margin: "0 0 4px", color: "#FFF", fontSize: "15px" }}>Stage 2: Approximate Nearest Neighbors (ANN) Creator Match</h4>
                  <p style={{ margin: 0, fontSize: "13px", color: "#A3A6BC", lineHeight: "1.4" }}>Using high-dimensional vector embeddings, the bot matches your SKUs with verified top creators across Uttar Pradesh, Bihar, and Rajasthan with 99%+ demographic fit.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", background: "#262838", padding: "16px", borderRadius: "12px", borderLeft: "4px solid #E2483D" }}>
                <span style={{ fontSize: "24px" }}>🗣️</span>
                <div>
                  <h4 style={{ margin: "0 0 4px", color: "#FFF", fontSize: "15px" }}>Stage 3: Vernacular Multi-Dialect Ad Copy &amp; Scripting</h4>
                  <p style={{ margin: 0, fontSize: "13px", color: "#A3A6BC", lineHeight: "1.4" }}>Instead of generic lines, the agent synthesizes full 4-part campaign packages: Reel Hooks (0-3s), Selling Points, Payout Terms, and verbatim scripts in Avadhi, Bhojpuri, and Hindi.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", background: "#262838", padding: "16px", borderRadius: "12px", borderLeft: "4px solid #038D63" }}>
                <span style={{ fontSize: "24px" }}>⚡</span>
                <div>
                  <h4 style={{ margin: "0 0 4px", color: "#FFF", fontSize: "15px" }}>Stage 4: Real-Time Multi-Channel Outreach Dispatch</h4>
                  <p style={{ margin: 0, fontSize: "13px", color: "#A3A6BC", lineHeight: "1.4" }}>After your human-in-the-loop verification, the agent instantly broadcasts the sponsorship briefs via direct WhatsApp (`wa.me`) and Gmail SMTP Relay with real-time replies.</p>
                </div>
              </div>
            </div>

            <div className="ai-console-footer" style={{ justifyContent: "flex-end", padding: "16px 24px", background: "#171822", borderTop: "1px solid #282A3A" }}>
              <button onClick={() => setShowHowModal(false)} type="button" style={{ background: "#4A1FB8", color: "#FFF", fontWeight: 800, padding: "12px 26px", borderRadius: "10px", border: "none", cursor: "pointer" }}>
                Got It, Let&apos;s Automate! 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
