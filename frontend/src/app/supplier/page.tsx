"use client";

import React, { useState } from "react";
import "./supplier.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SupplierMarketingHub() {
  const router = useRouter();

  // Profit Calculator State from supplier.js
  const [sellingPrice, setSellingPrice] = useState<number>(500);
  const [costPrice, setCostPrice] = useState<number>(320);

  // Derived calculations exactly as in supplier.js
  const meeshoProfit = Math.max(0, sellingPrice - costPrice);
  const otherCommission = sellingPrice * 0.18;
  const otherProfit = Math.max(0, sellingPrice - costPrice - otherCommission);
  const extraSavings = Math.max(0, meeshoProfit - otherProfit);

  return (
    <div className="supplier-hub-page" style={{ background: "#FFFFFF", minHeight: "100vh" }}>
      {/* Top Notice Bar */}
      <div className="supplier-notice-bar">
        <span>Meesho Supplier Center — Prototype Replica</span>
        <Link href="/" className="back-to-shop-link">
          <span>← Back to Meesho Shopping Front Page</span>
        </Link>
      </div>

      {/* Supplier Navigation Bar */}
      <nav className="supplier-navbar">
        <div className="supplier-nav-container">
          <Link href="/" className="supplier-brand" title="Back to Meesho Main Home Page">
            {/* Exact Meesho Vector Logo */}
            <svg height="32" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 28V12L18.5 21L25 12V28" stroke="#9F2089" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="32" y="27" fill="#9F2089" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="24" letterSpacing="-0.5px">meesho</text>
            </svg>
            <span className="supplier-brand-tag">Supplier</span>
          </Link>

          <div className="supplier-nav-links">
            <a href="#sell-online" className="supplier-nav-link active">Sell Online</a>
            <a href="#how-it-works" className="supplier-nav-link">How it works</a>
            <a href="#pricing" className="supplier-nav-link">Pricing &amp; Commission</a>
            <a href="#shipping" className="supplier-nav-link">Shipping &amp; Returns</a>
            <a href="#grow" className="supplier-nav-link">Grow Business</a>
            <a href="#gst" className="supplier-nav-link">Don&apos;t have GST?</a>
          </div>

          <div className="supplier-nav-actions">
            <Link href="/" className="btn-login" style={{ background: "#F8F6FD", borderColor: "#D8CEFF", color: "#9F2089" }}>🛒 Meesho Home</Link>
            <Link href="/supplier/influencer" className="btn-start-selling" style={{ padding: "10px 22px", fontSize: "14px", fontWeight: 800 }}>enter supplier dashboard →</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="supplier-hero" id="sell-online">
        <div className="hero-container">
          {/* Hero Left Text */}
          <div className="hero-text-box">
            <div className="gst-notice-pill">
              <span className="new-badge">New</span>
              <span>Don’t have a GSTIN? You can still sell on Meesho with Enrolment ID.</span>
            </div>

            <h1>Sell online to Crores of Customers at <span className="highlight-pink">0% Commission</span></h1>
            <p className="hero-subtitle">Become a Meesho seller and grow your business across India with zero selling fees and instant weekly payouts.</p>

            <div className="hero-cta-group">
              <Link href="/supplier/influencer" className="btn-hero-start">enter supplier dashboard →</Link>
              <div className="hero-guarantee">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "#038D63" }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>No Registration Fee • 100% Online Setup</span>
              </div>
            </div>
          </div>

          {/* Hero Right Interactive Profit Calculator */}
          <div className="hero-calc-card">
            <div className="hero-calc-header">
              <h3>Profit Calculator at 0% Commission</h3>
              <span className="calc-badge">Keep 100% Profit</span>
            </div>

            <div className="calc-field">
              <label htmlFor="calc-selling-price">Product Selling Price</label>
              <div className="calc-input-wrapper">
                <span>₹</span>
                <input
                  type="number"
                  id="calc-selling-price"
                  className="calc-input"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                  min="1"
                />
              </div>
            </div>

            <div className="calc-field">
              <label htmlFor="calc-cost-price">Product Cost Price</label>
              <div className="calc-input-wrapper">
                <span>₹</span>
                <input
                  type="number"
                  id="calc-cost-price"
                  className="calc-input"
                  value={costPrice}
                  onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                  min="1"
                />
              </div>
            </div>

            <div className="calc-result-box">
              <div className="calc-row">
                <span>Meesho Commission:</span>
                <strong style={{ color: "var(--green-accent)" }} id="res-meesho-comm">₹0 (0% Fee)</strong>
              </div>
              <div className="calc-row">
                <span>Profit on Other Platforms (~18% fee):</span>
                <span id="res-other-profit">₹{Math.round(otherProfit)}</span>
              </div>
              <div className="calc-row">
                <span>Your Profit on Meesho:</span>
                <strong id="res-meesho-profit">₹{Math.round(meeshoProfit)}</strong>
              </div>
              <div className="calc-row total-row">
                <span>Extra Profit on Every Sale:</span>
                <span id="res-extra-savings">+₹{Math.round(extraSavings)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics / Stats Strip */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-num">14 Lakh+</div>
            <div className="stat-label">Sellers trust Meesho to sell online</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">14 Crore+</div>
            <div className="stat-label">Customers buying across India</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">28,000+</div>
            <div className="stat-label">Serviceable pincodes — we deliver everywhere</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">700+</div>
            <div className="stat-label">Categories to list and sell online</div>
          </div>
        </div>
      </section>

      {/* Why Suppliers Love Meesho */}
      <section className="why-section" id="pricing">
        <div className="section-title-box">
          <h2>Why Suppliers Love Meesho</h2>
          <p>All the benefits designed to help you sell more and make it easier to grow your business.</p>
        </div>

        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon">₹</div>
            <h3>0% Commission Fee</h3>
            <p>Suppliers selling on Meesho keep 100% of their profit by not paying any commission across all product categories.</p>
          </div>

          <div className="why-card">
            <div className="why-icon">🛡️</div>
            <h3>0 Penalty Charges</h3>
            <p>Sell online without the fear of order cancellation charges or late dispatch penalties. Complete peace of mind.</p>
          </div>

          <div className="why-card">
            <div className="why-icon">📈</div>
            <h3>Growth for Every Supplier</h3>
            <p>From small home entrepreneurs to large manufacturers, Meesho&apos;s AI discovery engine gives equal visibility to all catalogs.</p>
          </div>

          <div className="why-card">
            <div className="why-icon">⚡</div>
            <h3>Ease of Doing Business</h3>
            <p>1-Click catalog listing, hassle-free doorstep pickup, and dedicated seller support to solve your queries fast.</p>
          </div>
        </div>
      </section>

      {/* How to Start Selling Stepper */}
      <section className="steps-section" id="how-it-works">
        <div className="steps-container">
          <div className="section-title-box">
            <h2>How to Start Selling on Meesho</h2>
            <p>Start your online selling journey in 4 simple steps</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h4>Register as a Seller</h4>
              <p>Sign up with your GSTIN (or Enrolment ID) and bank account details in under 5 minutes.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h4>Upload Your Catalog</h4>
              <p>List your products easily using our 1-click single or bulk catalog upload tools.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h4>Receive &amp; Dispatch Orders</h4>
              <p>Get orders from across India. Pack your product and our logistics partners pick it up from your doorstep.</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h4>Receive Fast 7-Day Payments</h4>
              <p>Payment is credited directly to your registered bank account every 7 days from the order delivery date.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="supplier-cta-banner">
        <div className="cta-box">
          <h2>Ready to Grow Your Business 10X?</h2>
          <p>Join over 14 Lakh+ sellers on India&apos;s fastest-growing e-commerce platform today at 0% commission.</p>
          <button className="btn-cta-white" onClick={() => router.push('/supplier/influencer')}>enter supplier dashboard →</button>
        </div>
      </section>

      {/* Supplier Footer */}
      <footer className="supplier-footer">
        <div className="footer-container">
          <div className="footer-col">
            <h4>Meesho Supplier Center</h4>
            <p>Sell your products online on Meesho at 0% commission. Register as a Meesho seller and start selling online to crores of customers across India.</p>
          </div>
          <div className="footer-col">
            <h4>Sell on Meesho</h4>
            <ul>
              <li><a href="#sell-online">Sell Online at 0% Commission</a></li>
              <li><a href="#how-it-works">How to Sell</a></li>
              <li><a href="#pricing">Pricing &amp; Commission</a></li>
              <li><a href="#shipping">Shipping &amp; Returns</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Grow Business</h4>
            <ul>
              <li><a href="#">Supplier Learning Hub</a></li>
              <li><a href="#">Advertising on Meesho</a></li>
              <li><a href="#">Catalog Quality Guide</a></li>
              <li><a href="#">Supplier Support</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/">← Meesho Shopping Front Page</Link></li>
              <li><Link href="/supplier/influencer">Enter Supplier Dashboard</Link></li>
              <li><a href="#">Terms &amp; Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Fashnear Technologies Private Limited / Meesho Supplier Center Prototype.</span>
          <span>Replicated for Prototype &amp; Feature Testing</span>
        </div>
      </footer>
    </div>
  );
}
