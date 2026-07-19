"use client";

import React, { useState, useEffect, useRef } from "react";
import { MEESHO_CATEGORIES, MEESHO_FEATURED_CATEGORIES, MEESHO_PRODUCTS } from "@/lib/data";

export default function Home() {
  const [currentFilter, setCurrentFilter] = useState("all");
  const [currentSort, setCurrentSort] = useState("relevance");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>(MEESHO_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [buyerUser, setBuyerUser] = useState<any | null>(null);
  const [mobileOtpInput, setMobileOtpInput] = useState("9876543210");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiUrl = "";
    fetch(`${apiUrl}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {
        // use default MEESHO_PRODUCTS
      });

    // Load buyer user from localStorage
    const savedBuyer = localStorage.getItem("meesho_buyer_user");
    if (savedBuyer) {
      try {
        setBuyerUser(JSON.parse(savedBuyer));
      } catch (e) {}
    }

    // Load cart if saved
    const savedCart = localStorage.getItem("meesho_buyer_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {}
    }

    // Close search dropdown when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const addToCart = (product: any) => {
    const updated = [...cart, product];
    setCart(updated);
    localStorage.setItem("meesho_buyer_cart", JSON.stringify(updated));
    triggerToast(`${product.title.slice(0, 24)}... added to Cart!`);
  };

  const removeFromCart = (index: number) => {
    const updated = cart.filter((_, idx) => idx !== index);
    setCart(updated);
    localStorage.setItem("meesho_buyer_cart", JSON.stringify(updated));
  };

  const calculateTotal = () => cart.reduce((acc, item) => acc + item.price, 0);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 1) {
      setIsSearchDropdownOpen(true);
    } else {
      setIsSearchDropdownOpen(false);
    }
  };

  const handleBuyerOAuth = (provider: string) => {
    const identifier =
      provider === "Google"
        ? "meesho.shopper@gmail.com"
        : provider === "WhatsApp"
        ? "+91 9876543210 (WhatsApp Verified)"
        : mobileOtpInput;

    const record = {
      sub: `BUYER_${Math.floor(100000 + Math.random() * 900000)}`,
      identifier,
      auth_provider: provider,
      role: "MEESHO_VERIFIED_BUYER",
      authenticated: true,
    };

    localStorage.setItem("meesho_buyer_user", JSON.stringify(record));
    setBuyerUser(record);
    setIsAuthModalOpen(false);
    triggerToast(`✓ Welcome ${identifier}! Authenticated via ${provider}.`);
  };

  const handleBuyerLogout = () => {
    if (!confirm("Are you sure you want to log out from your Meesho Shopper Account? This will erase all authenticated session data.")) {
      return;
    }
    localStorage.removeItem("meesho_buyer_user");
    localStorage.removeItem("meesho_buyer_jwt");
    setBuyerUser(null);
    setIsAuthModalOpen(false);
    triggerToast("✓ Successfully logged out! All session data erased.");
  };

  const filterByCategory = (category: string) => {
    setCurrentFilter(category);
    const section = document.getElementById("products-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  // Filter & Sort computation
  let filteredProducts = [...products];
  if (currentFilter !== "all") {
    if (currentFilter === "under-299") {
      filteredProducts = filteredProducts.filter((p) => p.price <= 299);
    } else {
      filteredProducts = filteredProducts.filter((p) => p.category === currentFilter);
    }
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        (p.badge && p.badge.toLowerCase().includes(q))
    );
  }

  switch (currentSort) {
    case "price-asc":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    case "discount":
      filteredProducts.sort((a, b) => b.discount - a.discount);
      break;
  }

  const matchedDropdownProducts = searchQuery.trim().length > 1
    ? products
        .filter((p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.subCategory.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <>
      {/* Top Notification Bar */}
      <div className="top-notice-bar">
        <span>UI inspired from the Meesho&apos;s original website</span>
      </div>

      {/* Main Sticky Header */}
      <header className="main-header">
        <div className="header-container">
          {/* Brand Logo */}
          <a href="#" className="brand-logo" id="home-logo">
            <svg className="meesho-logo-svg" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="160" height="40" rx="6" fill="transparent" />
              <path d="M12 28V12L18.5 21L25 12V28" stroke="#9F2089" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="32" y="27" fill="#9F2089" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="24" letterSpacing="-0.5px">meesho</text>
            </svg>
          </a>

          {/* Search Component */}
          <div className="search-container" ref={searchBoxRef}>
            <div className="search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                className="search-input"
                id="search-input"
                placeholder="Try Saree, Kurti or Search by Product Code"
                autoComplete="off"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => {
                  if (searchQuery.trim().length > 1) setIsSearchDropdownOpen(true);
                }}
              />
            </div>

            {/* Live Autocomplete Results */}
            {isSearchDropdownOpen && matchedDropdownProducts.length > 0 && (
              <div className="search-dropdown active" id="search-dropdown">
                <div className="search-dropdown-header">Matching Products</div>
                <div id="search-dropdown-list">
                  {matchedDropdownProducts.map((p) => (
                    <div
                      key={p.id}
                      className="search-dropdown-item"
                      onClick={() => {
                        setSelectedProduct(p);
                        setIsSearchDropdownOpen(false);
                      }}
                    >
                      <img src={p.image} alt={p.title} />
                      <div className="search-dropdown-info">
                        <h4>{p.title}</h4>
                        <span>₹{p.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Header Actions */}
          <div className="header-actions">
            <a href="/supplier" className="header-nav-item">Become a Supplier</a>
            <div className="header-divider"></div>
            <a href="#investor" className="header-nav-item" onClick={(e) => { e.preventDefault(); alert("Meesho Investor Relations: Q3 FY26 GMV up 40% YoY!"); }}>Investor Relations</a>
            <div className="header-divider"></div>
            <div className="header-nav-item profile-action" id="profile-action-btn" onClick={() => setIsAuthModalOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span id="profile-action-label">{buyerUser ? "✓ Verified User" : "Profile"}</span>
            </div>
            <div className="header-divider"></div>
            <button className="cart-action" id="cart-drawer-btn" aria-label="Shopping Cart" onClick={() => setIsCartOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span>Cart</span>
              <span className="cart-badge" id="cart-badge-count">{cart.length}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Secondary Category Navigation Bar */}
      <nav className="category-nav-bar">
        <div className="category-list" id="category-nav-list">
          {MEESHO_CATEGORIES.map((cat) => (
            <div key={cat.id} className="category-item" onClick={() => filterByCategory(cat.id)}>
              <span>{cat.name}</span>
              <div className="mega-menu" onClick={(e) => e.stopPropagation()}>
                <div>
                  <h4 style={{ color: "#9F2089", fontSize: "14px", marginBottom: "10px", borderBottom: "1px solid #EAEAF2", paddingBottom: "6px" }}>
                    Popular in {cat.name}
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {cat.subcategories.map((sub, sIdx) => (
                      <div
                        key={sIdx}
                        className="mega-sub-item"
                        style={{ padding: "6px 0", fontSize: "14px", color: "#616173", cursor: "pointer" }}
                        onClick={() => {
                          setSearchQuery(sub === "All " + cat.name ? "" : sub);
                          filterByCategory(cat.id);
                        }}
                      >
                        {sub}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-banner">
          <div className="hero-content">
            <h1 className="hero-title">Lowest Prices<br />Best Quality Shopping</h1>
            <p className="hero-subtitle">Discover over 50 Lakh+ must-have products at unbeatable wholesale prices — From fashion wear to cutting-edge gadgets!</p>

            <div className="hero-features-box">
              <div className="hero-feature-pill">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                <span>Free Delivery</span>
              </div>
              <div className="hero-feature-pill">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 1v22"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                <span>Cash on Delivery</span>
              </div>
              <div className="hero-feature-pill">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
                <span>Easy 7-Day Returns</span>
              </div>
            </div>

            <button className="hero-cta-btn" id="hero-shop-btn" onClick={() => filterByCategory("all")}>
              <span>Explore Products</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
            </button>
          </div>

          {/* Hero Visual Composition */}
          <div className="hero-visual">
            <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80" alt="Saree Fashion" className="hero-card-img" />
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80" alt="Western Wear" className="hero-card-img" style={{ marginTop: "24px" }} />
          </div>
        </div>
      </section>

      {/* Trust Highlights Strip */}
      <section className="trust-strip">
        <div className="trust-grid">
          <div className="trust-item">
            <div className="trust-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <div className="trust-text">
              <h4>100% Quality Inspected</h4>
              <p>Every supplier vetted &amp; verified</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
            </div>
            <div className="trust-text">
              <h4>Lowest Wholesale Price</h4>
              <p>Direct from factories across India</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </div>
            <div className="trust-text">
              <h4>Free &amp; Fast Shipping</h4>
              <p>Zero delivery charges on all orders</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
            </div>
            <div className="trust-text">
              <h4>Easy 7-Day Returns</h4>
              <p>No questions asked doorstep pickup</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Strip */}
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">Top Categories to Explore</h2>
        </div>
        <div className="featured-grid" id="featured-categories-grid">
          {MEESHO_FEATURED_CATEGORIES.map((cat) => (
            <div key={cat.id} className="featured-card" onClick={() => filterByCategory(cat.id)}>
              <img src={cat.image} alt={cat.title} className="featured-card-image" loading="lazy" />
              <div className="featured-card-body">
                <h4 className="featured-card-title">{cat.title}</h4>
                <span className="featured-card-tag">{cat.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products For You Section */}
      <section className="feed-section" id="products-section">
        <div className="section-header">
          <h2 className="section-title">Products For You</h2>
        </div>

        {/* Toolbar: Filter Tabs & Sorting */}
        <div className="feed-toolbar">
          <div className="filter-tabs" id="feed-filter-tabs">
            <button className={`filter-tab-btn ${currentFilter === "all" ? "active" : ""}`} onClick={() => filterByCategory("all")}>All Products</button>
            <button className={`filter-tab-btn ${currentFilter === "women-ethnic" ? "active" : ""}`} onClick={() => filterByCategory("women-ethnic")}>Women Ethnic</button>
            <button className={`filter-tab-btn ${currentFilter === "women-western" ? "active" : ""}`} onClick={() => filterByCategory("women-western")}>Women Western</button>
            <button className={`filter-tab-btn ${currentFilter === "men" ? "active" : ""}`} onClick={() => filterByCategory("men")}>Men</button>
            <button className={`filter-tab-btn ${currentFilter === "home-kitchen" ? "active" : ""}`} onClick={() => filterByCategory("home-kitchen")}>Home &amp; Kitchen</button>
            <button className={`filter-tab-btn ${currentFilter === "electronics" ? "active" : ""}`} onClick={() => filterByCategory("electronics")}>Electronics</button>
            <button className={`filter-tab-btn ${currentFilter === "under-299" ? "active" : ""}`} onClick={() => filterByCategory("under-299")}>Under ₹299</button>
          </div>

          <div className="sort-control">
            <span className="sort-label">Sort by:</span>
            <select className="sort-select" id="sort-select" value={currentSort} onChange={(e) => setCurrentSort(e.target.value)}>
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </div>

        {/* Product Grid Feed */}
        <div className="products-grid" id="products-grid">
          {filteredProducts.length === 0 ? (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px", color: "#8B8BA3" }}>
              <h3 style={{ fontSize: "18px", color: "#353543", marginBottom: "8px" }}>No matching products found</h3>
              <p>Try searching for Saree, Kurti, Shirt, or choose another category filter.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-card" onClick={() => setSelectedProduct(product)}>
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.title} className="product-image" loading="lazy" />
                  {product.badge && <span className="product-badge">{product.badge}</span>}
                  <button className="product-quick-view-btn" onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}>Quick View</button>
                </div>
                <div className="product-info">
                  <h4 className="product-title" title={product.title}>{product.title}</h4>
                  <div className="product-pricing">
                    <span className="current-price">₹{product.price}</span>
                    <span className="original-price">₹{product.originalPrice}</span>
                    <span className="discount-tag">{product.discount}% off</span>
                  </div>
                  {product.freeDelivery && <span className="product-delivery-tag">Free Delivery</span>}
                  <div className="product-footer">
                    <div className="rating-pill">
                      <span>{product.rating}</span>
                      <span>★</span>
                    </div>
                    <button className="add-to-cart-sm-btn" onClick={(e) => { e.stopPropagation(); addToCart(product); }}>+ Cart</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <div className="modal-overlay active" id="quick-view-modal" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" id="modal-close-btn" onClick={() => setSelectedProduct(null)} aria-label="Close modal">&times;</button>
            <div className="modal-image-box">
              <img src={selectedProduct.image} alt={selectedProduct.title} className="modal-image" id="modal-img" />
            </div>
            <div className="modal-details">
              <div className="modal-category-tag" id="modal-cat">{selectedProduct.subCategory}</div>
              <h3 className="modal-title" id="modal-title">{selectedProduct.title}</h3>
              <div className="modal-supplier" id="modal-supplier">Sold by: {selectedProduct.supplier || "Verified Meesho Supplier"}</div>

              <div className="modal-price-row">
                <span className="modal-current-price" id="modal-price">₹{selectedProduct.price}</span>
                <span className="original-price" id="modal-orig-price">₹{selectedProduct.originalPrice}</span>
                <span className="discount-tag" id="modal-discount">{selectedProduct.discount}% off</span>
              </div>

              <p className="modal-desc" id="modal-desc">{selectedProduct.description || selectedProduct.title}</p>

              <div className="modal-perks">
                <div className="modal-perk-item">
                  <span>✓</span> Free Delivery
                </div>
                <div className="modal-perk-item">
                  <span>✓</span> COD Available
                </div>
                <div className="modal-perk-item">
                  <span>✓</span> 7-Day Returns
                </div>
              </div>

              <div className="modal-cta-group">
                <button className="btn-primary" id="modal-add-cart-btn" onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}>
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buyer Login & OAuth Modal */}
      {isAuthModalOpen && (
        <div className="modal-overlay active" id="buyer-login-modal" onClick={() => setIsAuthModalOpen(false)}>
          <div className="modal" style={{ maxWidth: "440px", padding: "28px" }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" id="buyer-login-close" style={{ top: "16px", right: "16px" }} onClick={() => setIsAuthModalOpen(false)}>&times;</button>
            <div style={{ textAlign: "center", marginBottom: "22px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#9F2089", marginBottom: "6px" }}>Sign In to Meesho</h3>
              <p style={{ fontSize: "13.5px", color: "#616173" }}>Instant 1-click login using Google, WhatsApp, or mobile OTP</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              <button
                type="button"
                onClick={() => handleBuyerOAuth("Google")}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1.5px solid #E2E8F0", background: "#FFF", fontSize: "13.5px", fontWeight: 700, color: "#1E1F2C", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.3 8.9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                  <path fill="#FBBC05" d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7.1C.6 9.1 0 11.3 0 13.8s.6 4.7 1.6 6.7l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.2L1.6 16C3.5 19.8 7.4 23 12 23z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", margin: "16px 0", color: "#8B8BA3", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>
              <div style={{ flex: 1, borderBottom: "1px solid #EAEAF2" }}></div>
              <span style={{ padding: "0 10px" }}>Or Mobile OTP</span>
              <div style={{ flex: 1, borderBottom: "1px solid #EAEAF2" }}></div>
            </div>

            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <input
                type="text"
                id="buyer-mobile-input"
                placeholder="Enter 10 digit phone number"
                value={mobileOtpInput}
                onChange={(e) => setMobileOtpInput(e.target.value)}
                style={{ flex: 1, padding: "12px", border: "1.5px solid #EAEAF2", borderRadius: "8px", fontSize: "14px", outline: "none" }}
              />
              <button
                type="button"
                onClick={() => handleBuyerOAuth("Mobile OTP Verification")}
                style={{ background: "#9F2089", color: "#FFF", fontWeight: 700, fontSize: "13.5px", padding: "0 18px", borderRadius: "8px", border: "none", cursor: "pointer" }}
              >
                Send OTP
              </button>
            </div>

            <div style={{ borderTop: "1px solid #EAEAF2", paddingTop: "16px", textAlign: "center" }}>
              {buyerUser && (
                <button
                  type="button"
                  onClick={handleBuyerLogout}
                  style={{ display: "block", width: "100%", background: "#FEE2E2", color: "#DC2626", fontSize: "13px", fontWeight: 700, padding: "10px", borderRadius: "8px", border: "1px solid #FECACA", cursor: "pointer", marginBottom: "12px" }}
                >
                  Log Out &amp; Erase Buyer Session
                </button>
              )}
              <p style={{ fontSize: "13px", color: "#616173", marginBottom: "8px" }}>Are you selling products on Meesho?</p>
              <a href="/supplier/influencer" style={{ display: "inline-block", background: "#FDEEFA", color: "#9F2089", fontSize: "13px", fontWeight: 700, padding: "8px 16px", borderRadius: "6px", textDecoration: "none" }}>
                enter supplier dashboard →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Cart Slide-Out Drawer */}
      {isCartOpen && (
        <div className="cart-drawer-overlay active" id="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h3>Shopping Cart ({cart.length})</h3>
              <button id="cart-drawer-close" onClick={() => setIsCartOpen(false)} style={{ fontSize: "24px", background: "transparent", border: "none", cursor: "pointer" }}>&times;</button>
            </div>
            <div className="cart-body" id="cart-items-list">
              {cart.length === 0 ? (
                <div className="empty-cart-state" style={{ textAlign: "center", padding: "60px 20px", color: "#8B8BA3" }}>
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: "0 auto 12px" }}><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                  <h4>Your Meesho Cart is Empty</h4>
                  <p>Explore Sarees, Kurtis &amp; Wholesale deals!</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="cart-item">
                    <img src={item.image} alt={item.title} className="cart-item-img" />
                    <div className="cart-item-info">
                      <h5 className="cart-item-title">{item.title}</h5>
                      <div className="cart-item-price">₹{item.price}</div>
                      <button className="cart-item-remove" onClick={() => removeFromCart(idx)}>Remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="cart-footer">
              <div className="cart-summary-row">
                <span>Total Amount</span>
                <span id="cart-total-amount">₹{calculateTotal()}</span>
              </div>
              <button
                className="btn-checkout"
                id="cart-checkout-btn"
                onClick={() => {
                  if (cart.length === 0) {
                    triggerToast("Your shopping cart is empty!");
                    return;
                  }
                  triggerToast(`Order Placed for ₹${calculateTotal()}! Thank you for shopping on Meesho.`);
                  setCart([]);
                  localStorage.removeItem("meesho_buyer_cart");
                  setIsCartOpen(false);
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Alert */}
      <div className={`toast-container ${showToast ? "show" : ""}`} id="toast-container">
        <span id="toast-msg">{toastMessage}</span>
      </div>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-col">
            <h3>Shop Non-Stop on Meesho</h3>
            <p>Trusted by more than 10 Crore Indians. Cash on Delivery | Free Delivery</p>
          </div>
          <div className="footer-col">
            <h4>Careers &amp; About</h4>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press &amp; Media</a></li>
              <li><a href="#">Tech Blog</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Help &amp; Support</h4>
            <ul className="footer-links">
              <li><a href="#">Shipping &amp; Delivery</a></li>
              <li><a href="#">Returns Policy</a></li>
              <li><a href="#">Customer Support</a></li>
              <li><a href="#">Trust &amp; Safety</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Reach out to us</h4>
            <ul className="footer-links">
              <li><a href="#">Twitter / X</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">YouTube</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Fashnear Technologies Private Limited / Meesho Prototype. All Rights Reserved.</span>
          <span>Design Replica for Prototype Testing</span>
        </div>
      </footer>
    </>
  );
}
