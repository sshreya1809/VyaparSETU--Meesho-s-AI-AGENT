"use client";

import React, { useState, useEffect } from "react";
import "./catalog-upload.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DEFAULT_CATALOGS = [
  {
    id: "MSH-KRTI-101",
    title: "Designer Floral Silk Anarkali Kurti",
    category: "Women Ethnic",
    price: 599,
    mrp: 1499,
    stock: 120,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80",
    influencerEnrolled: true,
    roi: "8% ROI",
  },
  {
    id: "MSH-SRE-204",
    title: "Georgette Embroidered Saree with Blouse",
    category: "Women Ethnic",
    price: 1299,
    mrp: 2999,
    stock: 85,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80",
    influencerEnrolled: true,
    roi: "6% ROI",
  },
  {
    id: "MSH-WTCH-88",
    title: "Men Luxury Chronograph Wrist Watch",
    category: "Men Fashion",
    price: 849,
    mrp: 1999,
    stock: 40,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=300&q=80",
    influencerEnrolled: false,
    roi: "10% ROI",
  },
];

export default function CatalogUploadPage() {
  const router = useRouter();
  const [supplierName, setSupplierName] = useState<string>("Frostilicious");
  const [activeTab, setActiveTab] = useState<"add" | "list">("add");
  const [catalogs, setCatalogs] = useState<any[]>(DEFAULT_CATALOGS);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State exactly as in supplier-catalog-upload.js
  const [title, setTitle] = useState("Handwoven Banarasi Silk Kurta Set");
  const [sku, setSku] = useState("MSH-SLK-408");
  const [category, setCategory] = useState("Women Ethnic");
  const [price, setPrice] = useState("799");
  const [mrp, setMrp] = useState("1899");
  const [stock, setStock] = useState("75");
  const [imgUrl, setImgUrl] = useState("https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80");
  const [enrollAi, setEnrollAi] = useState(true);

  useEffect(() => {
    // Strict Authentication Guard
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

    // Load Catalogs DB
    const savedDb = localStorage.getItem("meesho_supplier_catalogs_db");
    if (savedDb) {
      try {
        setCatalogs(JSON.parse(savedDb));
      } catch (e) {
        setCatalogs(DEFAULT_CATALOGS);
      }
    } else {
      localStorage.setItem("meesho_supplier_catalogs_db", JSON.stringify(DEFAULT_CATALOGS));
      setCatalogs(DEFAULT_CATALOGS);
    }
  }, [router]);

  const saveCatalogsDb = (newCatList: any[]) => {
    setCatalogs(newCatList);
    localStorage.setItem("meesho_supplier_catalogs_db", JSON.stringify(newCatList));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !sku) return;

    const newProduct = {
      id: sku,
      title: title,
      category: category,
      price: parseFloat(price) || 0,
      mrp: parseFloat(mrp) || 0,
      stock: parseInt(stock) || 0,
      image: imgUrl || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80",
      influencerEnrolled: enrollAi,
      roi: enrollAi ? "9% ROI Expected" : "Standard Listing",
    };

    const updatedList = [newProduct, ...catalogs];
    saveCatalogsDb(updatedList);

    alert(`✓ Catalog Published Successfully!\n\nProduct: "${title}" (SKU: ${sku})\nSelling Price: ₹${price}\nInfluencer Marketing: ${enrollAi ? "ENABLED (50K+ Creators Matched)" : "DISABLED"}`);
    setActiveTab("list");
  };

  const handleToggleEnroll = (id: string) => {
    const updated = catalogs.map((item) => {
      if (item.id === id) {
        const nextState = !item.influencerEnrolled;
        alert(`Influencer Marketing for "${item.title}" is now ${nextState ? "ENABLED ✓ (Creators notified)" : "DISABLED ✕"}.`);
        return {
          ...item,
          influencerEnrolled: nextState,
          roi: nextState ? "9% ROI Expected" : "Standard Listing",
        };
      }
      return item;
    });
    saveCatalogsDb(updated);
  };

  const handleDeleteCatalog = (id: string) => {
    if (!confirm(`Are you sure you want to delete SKU '${id}' from the catalog database?`)) return;
    const updated = catalogs.filter((item) => item.id !== id);
    saveCatalogsDb(updated);
  };

  const handleResetForm = () => {
    setTitle("");
    setSku("");
    setPrice("");
    setMrp("");
    setStock("");
    setImgUrl("https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80");
    setEnrollAi(true);
    alert("Form reset");
  };

  const filteredCatalogs = catalogs.filter((item) => {
    const q = searchQuery.toLowerCase();
    return item.title.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
  });

  return (
    <div className="catalog-body" style={{ display: "flex", minHeight: "100vh" }}>
      {/* ==================== LEFT DARK SIDEBAR ==================== */}
      <aside className="dashboard-sidebar">
        {/* Store Dropdown Selector */}
        <div className="store-selector-bar">
          <div className="store-info">
            <div className="store-avatar">{supplierName.charAt(0).toUpperCase()}</div>
            <span className="store-name">{supplierName}</span>
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
        {/* Top Hub Header */}
        <header className="top-hub-header">
          <div className="hub-breadcrumb">
            <span>Supplier Hub / Manage Business / <strong>Catalog Database &amp; Uploads</strong></span>
          </div>
          <div className="hub-actions">
            <Link href="/supplier/dashboard" className="btn-hub-switch">← Back to Dashboard</Link>
            <Link href="/supplier/influencer" className="btn-hub-switch">🚀 Influencer Marketing</Link>
            <Link href="/" className="btn-hub-switch">🛒 Shopping Front Page</Link>
          </div>
        </header>

        {/* Content Pad */}
        <div className="catalog-content-pad">
          {/* Top Tab Switcher Bar */}
          <div className="catalog-tabs-bar">
            <div className="catalog-tab-buttons">
              <button
                className={`tab-btn ${activeTab === "add" ? "active" : ""}`}
                type="button"
                onClick={() => setActiveTab("add")}
              >
                <span>➕ Add New Catalog</span>
              </button>
              <button
                className={`tab-btn ${activeTab === "list" ? "active" : ""}`}
                type="button"
                onClick={() => setActiveTab("list")}
              >
                <span>📋 My Catalogs</span>
                <span className="tab-badge" id="my-catalogs-badge">{catalogs.length}</span>
              </button>
            </div>

            <div className="catalog-search-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                type="text"
                placeholder="Search SKU, Product Title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* ==================== TAB 1: ADD NEW CATALOG FORM ==================== */}
          {activeTab === "add" && (
            <div className="tab-view active" id="view-add-catalog">
              <div className="add-catalog-card">
                <h2>Upload Product Catalog &amp; Enroll in Marketing</h2>
                <p className="form-subtitle">Add product details and photos. Enable Influencer Marketing to let 50,000+ Meesho Creators promote this item.</p>

                <form onSubmit={handleSubmit} id="new-catalog-form">
                  <div className="form-grid-2col">
                    {/* Left Form Fields */}
                    <div className="form-left-fields">
                      <div className="field-group">
                        <label htmlFor="cat-title">Product Title *</label>
                        <input
                          type="text"
                          id="cat-title"
                          required
                          placeholder="e.g. Designer Embroidered Georgette Anarkali Gown"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>

                      <div className="form-row-2">
                        <div className="field-group">
                          <label htmlFor="cat-sku">SKU ID *</label>
                          <input
                            type="text"
                            id="cat-sku"
                            required
                            placeholder="e.g. MSH-KRTI-501"
                            value={sku}
                            onChange={(e) => setSku(e.target.value)}
                          />
                        </div>
                        <div className="field-group">
                          <label htmlFor="cat-category">Category *</label>
                          <select id="cat-category" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="Women Ethnic">Women Ethnic</option>
                            <option value="Women Western">Women Western</option>
                            <option value="Men Fashion">Men Fashion</option>
                            <option value="Kids & Baby">Kids &amp; Baby</option>
                            <option value="Home & Kitchen">Home &amp; Kitchen</option>
                            <option value="Electronics">Electronics</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-row-2">
                        <div className="field-group">
                          <label htmlFor="cat-price">Selling Price (₹) *</label>
                          <input
                            type="number"
                            id="cat-price"
                            required
                            placeholder="499"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            min="50"
                          />
                        </div>
                        <div className="field-group">
                          <label htmlFor="cat-mrp">MRP (₹)</label>
                          <input
                            type="number"
                            id="cat-mrp"
                            placeholder="1499"
                            value={mrp}
                            onChange={(e) => setMrp(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="field-group">
                        <label htmlFor="cat-stock">Initial Stock Quantity *</label>
                        <input
                          type="number"
                          id="cat-stock"
                          required
                          placeholder="100"
                          value={stock}
                          onChange={(e) => setStock(e.target.value)}
                        />
                      </div>

                      <div className="field-group">
                        <label htmlFor="cat-img-url">Product Photo (Device Upload, Google Drive, or URL) *</label>

                        <div style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
                          <button
                            type="button"
                            id="btn-device-upload"
                            onClick={() => alert("Device upload triggered! Choose any local picture or URL preview below.")}
                            style={{ flex: 1, padding: "10px 14px", background: "#EEECFA", color: "#4A1FB8", fontSize: "13px", fontWeight: 700, borderRadius: "8px", border: "1.5px solid #D8CEFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer" }}
                          >
                            <span>📁 Upload from Device / Drive</span>
                          </button>
                          <button
                            type="button"
                            id="btn-gdrive-import"
                            onClick={() => {
                              const gUrl = prompt("Paste public Google Drive sharing link:", "https://drive.google.com/file/d/...");
                              if (gUrl) setImgUrl(gUrl);
                            }}
                            style={{ padding: "10px 14px", background: "#FFFFFF", color: "#1E8E3E", fontSize: "13px", fontWeight: 700, borderRadius: "8px", border: "1.5px solid #A7EAD1", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", cursor: "pointer" }}
                          >
                            <span>☁️ Google Drive Link</span>
                          </button>
                        </div>

                        <input
                          type="url"
                          id="cat-img-url"
                          required
                          placeholder="https://... or choose file above"
                          value={imgUrl}
                          onChange={(e) => setImgUrl(e.target.value)}
                        />
                      </div>

                      {/* Special Box: Send to Influencers for Marketing */}
                      <div className="influencer-optin-box">
                        <div className="inf-optin-head">
                          <div className="inf-optin-title">
                            <span>🚀</span>
                            <span>Send to Influencers for Marketing (50K+ Creators)</span>
                          </div>
                          <label className="inf-switch">
                            <input
                              type="checkbox"
                              id="inf-enroll-toggle"
                              checked={enrollAi}
                              onChange={(e) => setEnrollAi(e.target.checked)}
                            />
                            <span className="slider-toggle"></span>
                          </label>
                        </div>
                        <p style={{ fontSize: "12.5px", color: "#6E5A1C", lineHeight: 1.4 }}>
                          When enabled, this product is immediately sent to 50,000+ Meesho creators to create video reels on Meesho App &amp; Instagram. Only pay commission on successfully delivered orders!
                        </p>
                      </div>
                    </div>

                    {/* Right Image Preview Block */}
                    <div className="form-right-visual">
                      <label style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-dark)" }}>Product Photo Preview (Drag &amp; Drop Supported)</label>

                      <div className="img-preview-card" id="dropzone-card">
                        <img
                          id="preview-img-display"
                          className="preview-img-display"
                          src={imgUrl}
                          style={{ display: "block", maxHeight: "260px", objectFit: "cover" }}
                          alt="Preview"
                        />
                      </div>

                      <div>
                        <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px", textAlign: "center" }}>Or Click Sample Product Presets:</div>
                        <div className="preset-thumbs-row">
                          <div
                            className={`preset-thumb ${imgUrl.includes("1583391733956") ? "active" : ""}`}
                            onClick={() => setImgUrl("https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80")}
                          >
                            <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80" alt="Kurti" />
                          </div>
                          <div
                            className={`preset-thumb ${imgUrl.includes("1610030469983") ? "active" : ""}`}
                            onClick={() => setImgUrl("https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80")}
                          >
                            <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80" alt="Saree" />
                          </div>
                          <div
                            className={`preset-thumb ${imgUrl.includes("1524592094714") ? "active" : ""}`}
                            onClick={() => setImgUrl("https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=300&q=80")}
                          >
                            <img src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=300&q=80" alt="Watch" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-submit-row">
                    <button type="button" className="btn-cancel-form" onClick={handleResetForm}>Reset Form</button>
                    <button type="submit" className="btn-publish-catalog">Publish Catalog &amp; Save to Database →</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ==================== TAB 2: MY CATALOGS DATABASE VIEW ==================== */}
          {activeTab === "list" && (
            <div className="tab-view active" id="view-my-catalogs">
              <div className="catalogs-table-card">
                <div style={{ padding: "24px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "20px", fontWeight: 700 }}>My Catalogs Database</h3>
                    <p style={{ fontSize: "13.5px", color: "#58596B" }}>Manage stored catalogs and toggle real-time Influencer Marketing enrollment.</p>
                  </div>
                  <button className="btn-hub-switch" onClick={() => setActiveTab("add")}>+ Add Another Catalog</button>
                </div>

                <table className="catalog-data-table">
                  <thead>
                    <tr>
                      <th>Product Information</th>
                      <th>Category</th>
                      <th>Price &amp; MRP</th>
                      <th>Stock Status</th>
                      <th>Influencer Marketing Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody id="my-catalogs-tbody">
                    {filteredCatalogs.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                            <img src={item.image} alt={item.title} style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover", border: "1px solid #EAEAF2" }} />
                            <div>
                              <div style={{ fontWeight: 700, color: "#1E1F2C" }}>{item.title}</div>
                              <div style={{ fontSize: "12px", color: "#616173" }}>SKU: {item.id}</div>
                            </div>
                          </div>
                        </td>
                        <td><span style={{ background: "#F4F6F9", padding: "4px 8px", borderRadius: "4px", fontSize: "12.5px", fontWeight: 600 }}>{item.category}</span></td>
                        <td>
                          <div><strong>₹{item.price}</strong></div>
                          {item.mrp > 0 && <div style={{ fontSize: "12px", color: "#888", textDecoration: "line-through" }}>₹{item.mrp}</div>}
                        </td>
                        <td>
                          <span style={{ color: item.stock > 10 ? "#038D63" : "#D3184B", fontWeight: 700 }}>
                            {item.stock} Units ({item.stock > 10 ? "In Stock" : "Low Stock"})
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleToggleEnroll(item.id)}
                            style={{
                              background: item.influencerEnrolled ? "#E8F7F0" : "#F4F6F9",
                              color: item.influencerEnrolled ? "#038D63" : "#616173",
                              border: `1px solid ${item.influencerEnrolled ? "#038D63" : "#D1D1DB"}`,
                              padding: "6px 12px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <span>{item.influencerEnrolled ? "✓ Enrolled (Live)" : "✕ Disabled"}</span>
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeleteCatalog(item.id)}
                            style={{ background: "#FEE2E2", color: "#DC2626", border: "none", padding: "6px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
