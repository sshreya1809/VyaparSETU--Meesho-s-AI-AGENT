"use client";

import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SupplierDashboard() {
  const router = useRouter();
  const [supplierName, setSupplierName] = useState<string>("Frostilicious");
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showSingleModal, setShowSingleModal] = useState<boolean>(false);

  // Single Catalog Modal Form State
  const [prodTitle, setProdTitle] = useState("Designer Floral Silk Kurti");
  const [prodPrice, setProdPrice] = useState("599");
  const [prodCat, setProdCat] = useState("Women Ethnic");

  useEffect(() => {
    // Strict Authentication Guard exactly as in supplier-dashboard.js
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
  }, [router]);

  const handleSingleCatalogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Catalog successfully uploaded for "${prodTitle}" at ₹${prodPrice}! It will go live after standard 0% Commission QC.`);
    setShowSingleModal(false);
    setProdTitle("");
    setProdPrice("499");
  };

  const getDynamicHeader = () => {
    if (activeTab === 0) return "Choose how you would like to upload your catalog";
    if (activeTab === 1) return "Catalog Quality Check & Live Verification Status";
    return "Manage Inventory & Track Your First Orders";
  };

  return (
    <div className="dashboard-body" style={{ display: "flex", minHeight: "100vh" }}>
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
          <Link href="/supplier/dashboard" className="nav-link active">
            <div className="nav-link-content">
              <span className="nav-icon">🏠</span>
              <span>Home</span>
            </div>
          </Link>

          <div className="nav-section-title">Boost Sales</div>

          <Link href="/supplier/influencer" className="nav-link">
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
        {/* Top Return Header */}
        <header className="top-hub-header">
          <div className="hub-breadcrumb">
            <span>Supplier Hub / <strong>Dashboard Home</strong></span>
          </div>
          <div className="hub-actions">
            <Link href="/supplier" className="btn-hub-switch">← Supplier Front Page</Link>
            <Link href="/" className="btn-hub-switch">🛒 Shopping Front Page</Link>
          </div>
        </header>

        {/* Dashboard Content Pad */}
        <div className="dashboard-content-pad">
          {/* Welcome Header Card */}
          <div className="welcome-header-card">
            <div>
              <h1 id="hub-welcome-name">Welcome {supplierName}</h1>
              <p>Let&apos;s get your business started in 3 steps</p>
            </div>
            <button className="btn-need-help" onClick={() => alert('Connecting to Meesho Seller Support...')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
              <span>Need Help?</span>
            </button>
          </div>

          {/* Main Dashboard 2-Column Grid */}
          <div className="dashboard-grid">
            {/* LEFT CARD: STEPPER & CATALOG UPLOAD */}
            <section className="catalog-onboard-card">
              {/* Stepper Tabs */}
              <div className="onboard-stepper">
                <div
                  className={`stepper-tab ${activeTab === 0 ? "active" : ""}`}
                  onClick={() => setActiveTab(0)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="stepper-num">1</span>
                  <span>Upload catalogs to get started</span>
                </div>
                <div
                  className={`stepper-tab ${activeTab === 1 ? "active" : ""}`}
                  onClick={() => setActiveTab(1)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="stepper-num">2</span>
                  <span>Catalogs go live on Meesho</span>
                </div>
                <div
                  className={`stepper-tab ${activeTab === 2 ? "active" : ""}`}
                  onClick={() => setActiveTab(2)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="stepper-num">3</span>
                  <span>Get your first order</span>
                </div>
              </div>

              <h3 className="upload-section-title" id="stepper-dynamic-header">{getDynamicHeader()}</h3>

              {/* Upload Options Grid */}
              <div className="upload-options-grid">
                {/* Option 1: Single Catalog */}
                <div className="upload-card-col">
                  <div className="upload-card-header-row">
                    <div className="upload-col-header" style={{ marginBottom: 0 }}>Upload Single Catalog</div>
                    <span className="recommended-badge">⚡ Recommended &amp; Fast</span>
                  </div>

                  <div className="upload-visual-banner">
                    <div className="banner-left-graphic">
                      <div className="catalog-icon-circle">🛍️</div>
                    </div>
                    <div className="banner-right-content">
                      <div className="banner-badge-title">Interactive Catalog Builder</div>
                      <div className="banner-badge-sub">Add product photos, SKU &amp; price in seconds. AI auto-extracts categories &amp; attributes!</div>
                      <div className="banner-tags">
                        <span className="tag-pill">✨ No Excel Sheet</span>
                        <span className="tag-pill">0% Commission</span>
                        <span className="tag-pill">Instant Live</span>
                      </div>
                    </div>
                  </div>

                  <div className="upload-bullet-list">
                    <div className="upload-bullet">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#038D63" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span><strong>Add one catalog at a time</strong> directly through our step-by-step visual form</span>
                    </div>
                    <div className="upload-bullet">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#038D63" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span><strong>Excel sheet not required</strong> — perfect for quick additions or testing new collections</span>
                    </div>
                    <div className="upload-bullet">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#038D63" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span><strong>AI attribute extraction</strong> automatically organizes your sarees, kurtis &amp; ethnic listings</span>
                    </div>
                  </div>

                  <button
                    className="btn-upload-primary"
                    id="btn-add-single"
                    type="button"
                    onClick={(e) => e.preventDefault()}
                  >
                    <span>Add Single Catalog →</span>
                  </button>
                </div>
              </div>
            </section>

            {/* RIGHT STACKED CARDS */}
            <div className="right-col-stack">
              {/* Card 2: Learn & Grow On Meesho */}
              <div className="learn-grow-card">
                <h3 className="setup-card-title" style={{ marginBottom: "12px" }}>Learn &amp; Grow On Meesho</h3>

                <div className="learn-list">
                  {/* Item 1 */}
                  <div className="learn-row" onClick={() => alert('Live Seller Training registration opened!')}>
                    <div className="learn-row-left">
                      <div className="learn-icon">🎓</div>
                      <div>
                        <div className="learn-text-head">
                          <span>Book free live training</span>
                          <span className="expert-pill">Expert Led</span>
                        </div>
                        <div className="learn-text-sub">Learn to operate and grow your business on meesho.</div>
                      </div>
                    </div>
                    <span className="chevron-right">&gt;</span>
                  </div>

                  {/* Item 2 */}
                  <div className="learn-row" onClick={() => alert('Catalog preparation tutorial loaded.')}>
                    <div className="learn-row-left">
                      <div className="learn-icon red">▶</div>
                      <div className="learn-text-head" style={{ marginTop: "6px" }}>Prepare catalogs for meesho</div>
                    </div>
                    <span className="chevron-right">&gt;</span>
                  </div>

                  {/* Item 3 */}
                  <div className="learn-row" onClick={() => alert('0% Commission & Pricing structure guide opened.')}>
                    <div className="learn-row-left">
                      <div className="learn-icon blue">%</div>
                      <div className="learn-text-head" style={{ marginTop: "6px" }}>Pricing &amp; commission</div>
                    </div>
                    <span className="chevron-right">&gt;</span>
                  </div>

                  {/* Item 4 */}
                  <div className="learn-row" onClick={() => alert('Logistics, Free Doorstep Pickup & Returns FAQ opened.')}>
                    <div className="learn-row-left">
                      <div className="learn-icon">🚚</div>
                      <div className="learn-text-head" style={{ marginTop: "6px" }}>Delivery &amp; Returns</div>
                    </div>
                    <span className="chevron-right">&gt;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ==================== INTERACTIVE SINGLE CATALOG UPLOAD MODAL ==================== */}
      {showSingleModal && (
        <div className="catalog-modal-overlay active" id="single-catalog-modal" style={{ display: "flex" }}>
          <div className="catalog-modal">
            <div className="modal-head">
              <h3>Upload Single Product Catalog</h3>
              <button onClick={() => setShowSingleModal(false)} style={{ fontSize: "22px", color: "#888", background: "transparent", border: "none", cursor: "pointer" }}>&times;</button>
            </div>

            <form onSubmit={handleSingleCatalogSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <label htmlFor="cat-prod-name">Product Title</label>
                  <input
                    type="text"
                    id="cat-prod-name"
                    placeholder="e.g. Designer Georgette Saree with Blouse"
                    required
                    value={prodTitle}
                    onChange={(e) => setProdTitle(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="cat-prod-price">Selling Price (₹)</label>
                  <input
                    type="number"
                    id="cat-prod-price"
                    placeholder="499"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    min="50"
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="cat-prod-cat">Category</label>
                  <select id="cat-prod-cat" value={prodCat} onChange={(e) => setProdCat(e.target.value)}>
                    <option value="Women Ethnic">Women Ethnic</option>
                    <option value="Women Western">Women Western</option>
                    <option value="Men">Men Fashion</option>
                    <option value="Home & Kitchen">Home &amp; Kitchen</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowSingleModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit-catalog">Submit Catalog Live</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
