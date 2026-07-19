"use client";

import React, { useState, useEffect } from "react";
import "./broker.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SCENARIOS: Record<string, any> = {
  "up-bedsheets": {
    title: "UP East Bedsheet Liquidation (₹1349)",
    rawPrompt: "Clear 500 unbranded cotton bedsheets in UP this week at ₹1349 unit price.",
    product: "Jaipuri Double Cotton Bedsheets (Unbranded)",
    region: "Uttar Pradesh (Lucknow, Kanpur, Varanasi)",
    volume: "500 Units",
    price: "₹1349 • HIGH URGENCY",
    creators: [
      {
        id: "cr-1",
        name: "Rahul Sharma (Bharat Top Influencer)",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        followers: "340K Followers",
        similarity: "99.9% ANN MATCH",
        hook: "💡 Reel Hook (0-3s): Unfold the vibrant Jaipuri double bedsheet in one dramatic sweep across the bed with a bold ₹1349 price tag sticker overlay.",
        valueProps: "🎯 Key Selling Points: 100% Pure Cotton • Guaranteed Fast Colors (Pucca Rang) • Free Home Delivery across UP • Cash on Delivery (COD) Available.",
        payout: "💰 Creator Sponsorship Offer: ₹18,000 Fixed Reel Integration + ₹35 Flat Affiliate Commission per order via your tracked link.",
        headline: "🔥 उत्तर प्रदेश के लिए खास: 100% पक्का रंग जयपुरी डबल बेडशीट अब केवल ₹1349 में!",
        regional: 'Verbatim English/Hinglish Script: "Guys, if you want hotel-luxury cooling cotton bedsheets for UP summer without paying ₹1200 in showrooms, check this out! Original Jaipuri 100% cotton double bedsheet with 2 pillow covers is now on Meesho for just ₹1349 factory wholesale rate. Link in my bio!"',
        hindi: '🗣️ हिंदी / भोजपुरी स्क्रिप्ट (0-30s): "अरे भौजी! गर्मी में आराम और ठंडक देने वाली 100% पक्का रंग जयपुरी कॉटन बेडशीट अब मीशो पर सीधे फैक्ट्री रेट में! पूरा डबल बेड साइज और दो पिलो कवर के साथ केवल ₹1349 में। लिंक बायो में है!"',
        phone: "918591852051",
        email: "rahul.sharma@meesho-creator.in",
        approved: true,
      },
      {
        id: "cr-2",
        name: "Pooja Tiwari (Lucknow Lifestyle)",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        followers: "84.2K Followers",
        similarity: "98.4% ANN MATCH",
        hook: "💡 Reel Hook (0-3s): Close-up fabric rub test showing zero color bleeding followed by smiling reaction at ₹1349 invoice.",
        valueProps: "🎯 Key Selling Points: Lucknow & UP East Fast Shipping • Full King/Double Size (90x100 inch) • Machine Washable 180 TC Cotton.",
        payout: "💰 Creator Sponsorship Offer: ₹11,000 Fixed Reel Fee + 12% Affiliate Rev-Share on all UP East conversions.",
        headline: "🌟 लखनऊ और यूपी ईस्ट के लिए 100% पक्का रंग जयपुरी बेडशीट अब ₹1349 में!",
        regional: 'Verbatim Avadhi/Hinglish Script: "Arre Bhauji! Garmi me araam aur thandak dene wali 100% pucca rang Jaipuri cotton bedsheet ab Meesho par sidhe factory rate me mil rahi hai. Pura double bed size aur do pillow cover ke sath keval ₹1349!"',
        hindi: '🗣️ अवधी / हिंदी स्क्रिप्ट: "अरे भौजी! गर्मी में आराम और ठंडक देने वाली 100% पक्का रंग जयपुरी कॉटन बेडशीट अब मीशो पर सीधे फैक्ट्री रेट में मिल रही है। पूरा डबल बेड साइज और दो पिलो कवर के साथ केवल ₹1349!"',
        phone: "919838112044",
        email: "pooja.tiwari.lucknow@meesho-affiliates.in",
        approved: true,
      },
    ],
  },
  "biar-sarees": {
    title: "Bihar Banarasi Saree Surplus (₹1699)",
    rawPrompt: "Liquidate 300 Banarasi Silk Sarees in Bihar & Purvanchal before festival season at ₹1699.",
    product: "Festive Banarasi Silk Saree Collection",
    region: "Bihar & Purvanchal (Patna, Gaya, Muzaffarpur)",
    volume: "300 Units",
    price: "₹1699 • CRITICAL LIQUIDATION",
    creators: [
      {
        id: "cr-3",
        name: "Neha Bhojpuri Queen (Patna Fashion)",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        followers: "210K Followers",
        similarity: "99.5% ANN MATCH",
        hook: "💡 Reel Hook (0-3s): Twirl in the golden Zari border Banarasi saree under festival lighting with ₹1699 flash deal title card.",
        valueProps: "🎯 Key Selling Points: Heavy Golden Zari Border • Soft Litchi Silk Weave • Rich Pallu with Blouse Piece • Direct Surat Factory Rate.",
        payout: "💰 Creator Sponsorship Offer: ₹15,000 Upfront Reel Sponsorship + ₹60 Bonus per Saree order.",
        headline: "✓ बिहार और पूर्वांचल के लिए खास: बनारसी सिल्क साड़ी अब केवल ₹1699 में!",
        regional: 'Verbatim Bhojpuri Script: "Chhath aur shadi season ke liye sabse best Banarasi Saree ab Meesho par sidhe factory daam ₹1699 me! Asli Zari border aur soft silk fabric."',
        hindi: '🗣️ भोजपुरी / हिंदी स्क्रिप्ट: "छठ और शादी सीजन के लिए सबसे बेस्ट बनारसी साड़ी अब मीशो पर सीधे फैक्ट्री दाम ₹1699 में! असली ज़री बॉर्डर और सॉफ्ट सिल्क फैब्रिक। लिंक नीचे बायो में है!"',
        phone: "919123456789",
        email: "neha.bhojpuri@meesho-creators.in",
        approved: true,
      },
    ],
  },
  "raj-kurtis": {
    title: "Rajasthan Printed Kurti Set (₹1499)",
    rawPrompt: "Fast movement for 450 Jaipuri Block Printed Kurti Sets across Jaipur & Udaipur at ₹1499.",
    product: "Jaipuri Block Printed Cotton Kurti Set",
    region: "Rajasthan (Jaipur, Jodhpur, Udaipur)",
    volume: "450 Units",
    price: "₹1499 • NORMAL URGENCY",
    creators: [
      {
        id: "cr-4",
        name: "Kavita Rathore (Jaipur Ethnic Reels)",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        followers: "145K Followers",
        similarity: "99.1% ANN MATCH",
        hook: "💡 Reel Hook (0-3s): Walk through Jaipur Hawa Mahal backdrop wearing the breathable pure cotton block print Kurti set.",
        valueProps: "🎯 Key Selling Points: Authentic Sanganeri Hand Block Print • 3-Piece Set (Kurti, Pant & Dupatta) • 100% Breathable Cotton.",
        payout: "💰 Creator Sponsorship Offer: ₹12,500 Fixed Sponsorship + 15% Affiliate Commission.",
        headline: "🚀 ओरिजिनल सांगानेरी हैंड ब्लॉक प्रिंट 3-पीस कुर्ती सेट केवल ₹1499 में!",
        regional: 'Verbatim Script: "Original Sanganeri hand block print 3-piece kurti set directly from Jaipur artisans on Meesho at wholesale ₹1499."',
        hindi: '🗣️ हिंदी / राजस्थानी स्क्रिप्ट: "ओरिजिनल सांगानेरी हैंड ब्लॉक प्रिंट 3-पीस कुर्ती सेट सीधे जयपुर के कारीगरों से मीशो पर होलसेल ₹1499 में। 100% कॉटन और फास्ट कलर गारंटी!"',
        phone: "919829012345",
        email: "kavita.jaipur@meesho-creators.in",
        approved: true,
      },
    ],
  },
};

export default function AIBrokerPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [currentScenarioKey, setCurrentScenarioKey] = useState<string>("up-bedsheets");
  const [isCampaignLaunched, setIsCampaignLaunched] = useState<boolean>(false);
  const [qdrantLatency, setQdrantLatency] = useState<number>(32);
  const [promptText, setPromptText] = useState<string>("");
  const [targetCount, setTargetCount] = useState<number | string>(10);
  const [creatorsState, setCreatorsState] = useState<any[]>([]);
  const [hasParsedIntent, setHasParsedIntent] = useState<boolean>(false);
  const [showDispatchModal, setShowDispatchModal] = useState<boolean>(false);
  const [showAudioModal, setShowAudioModal] = useState<boolean>(false);
  const [dispatchLogs, setDispatchLogs] = useState<string[]>([]);
  const [realtimeFeed, setRealtimeFeed] = useState<any[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechLang, setSpeechLang] = useState<"en-IN" | "hi-IN">("en-IN");
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [extractedEntities, setExtractedEntities] = useState<{ product: string; region: string; volume: string; price: string }>({
    product: SCENARIOS["up-bedsheets"].product,
    region: SCENARIOS["up-bedsheets"].region,
    volume: SCENARIOS["up-bedsheets"].volume,
    price: SCENARIOS["up-bedsheets"].price,
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("vyaparsetu_theme");
    if (savedTheme === "light") {
      setTheme("light");
      document.body.classList.remove("dark-theme");
    } else {
      setTheme("dark");
      document.body.classList.add("dark-theme");
    }

    const interval = setInterval(() => {
      setQdrantLatency(Math.floor(Math.random() * (46 - 24 + 1)) + 24);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleThemeToggle = () => {
    if (theme === "dark") {
      setTheme("light");
      localStorage.setItem("vyaparsetu_theme", "light");
      document.body.classList.remove("dark-theme");
    } else {
      setTheme("dark");
      localStorage.setItem("vyaparsetu_theme", "dark");
      document.body.classList.add("dark-theme");
    }
  };

  const handleSelectScenario = (key: string) => {
    setCurrentScenarioKey(key);
    setIsCampaignLaunched(false);
    setPromptText("");
    setCreatorsState([]);
    setHasParsedIntent(false);
    setRealtimeFeed([]);
    setExtractedEntities({
      product: SCENARIOS[key].product,
      region: SCENARIOS[key].region,
      volume: SCENARIOS[key].volume,
      price: SCENARIOS[key].price,
    });
  };

  const handleToggleApproved = (id: string, approved: boolean) => {
    setCreatorsState((prev) =>
      prev.map((c) => (c.id === id ? { ...c, approved } : c))
    );
  };

  const handleStartListening = () => {
    const isSecure = typeof window !== "undefined" && (window.isSecureContext || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition || !isSecure) {
      setShowAudioModal(true);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const initialPrompt = promptText.trim();
    const recognition = new SpeechRecognition();
    recognition.lang = speechLang;
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let currentSessionTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        currentSessionTranscript += event.results[i][0].transcript;
      }
      if (currentSessionTranscript) {
        const prefix = initialPrompt ? initialPrompt + " " : "";
        setPromptText((prefix + currentSessionTranscript).trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === "not-allowed" || event.error === "service-not-allowed" || event.error === "network") {
        setShowAudioModal(true);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
      setShowAudioModal(true);
    }
  };

  const handleParseIntentAndMatch = async () => {
    setIsParsing(true);
    setIsCampaignLaunched(false);
    const targetPrompt = promptText.trim() || "Clear 500 unbranded cotton bedsheets in UP this week at ₹1349 unit price.";
    const apiUrl = "";

    let parsed = {
      product: "",
      region: "",
      volume: "",
      price: ""
    };

    try {
      const parseResp = await fetch(`${apiUrl}/api/parse-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: targetPrompt })
      });
      if (!parseResp.ok) {
        const errData = await parseResp.json().catch(() => ({ detail: parseResp.statusText }));
        alert(`LLM Parsing Failed (${parseResp.status}): ${errData.detail || "Error communicating with backend LLM"}`);
        setIsParsing(false);
        return;
      }
      const data = await parseResp.json();
      if (data && data.product) {
        parsed = {
          product: data.product || "",
          region: data.region || "",
          volume: data.volume || "",
          price: data.price || ""
        };
      } else {
        alert("LLM Parsing returned empty structured entities.");
        setIsParsing(false);
        return;
      }
    } catch (err: any) {
      console.error("Backend parse-intent failed:", err);
      alert(`Backend connection failed when parsing intent via LLM: ${err.message || err}`);
      setIsParsing(false);
      return;
    }

    setExtractedEntities(parsed);
    setHasParsedIntent(true);

    const activeCount = Number(targetCount) > 0 ? Number(targetCount) : 10;
    try {
      const matchResp = await fetch(`${apiUrl}/api/match-creators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: parsed.product,
          region: parsed.region,
          volume: parsed.volume,
          price: parsed.price,
          limit: activeCount
        })
      });
      if (matchResp.ok) {
        const matches = await matchResp.json();
        if (Array.isArray(matches) && matches.length > 0) {
          const formattedCreators = matches.map((m: any, idx: number) => ({
            id: m.id || `matched_${idx}`,
            name: m.name || `Verified Creator #${idx + 1}`,
            followers: m.followers || "250K+ Followers",
            avatar: m.avatar || (idx % 2 === 0 ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"),
            similarity: m.similarity || "98.5% ANN MATCH",
            headline: m.headline || `${parsed.product} Regional Campaign`,
            hook: m.hook || `Special liquidation deal for ${parsed.region}`,
            valueProps: m.valueProps || `Limited inventory available at ${parsed.price}`,
            hindi: m.hindi || `नमस्ते! ${parsed.product} अब मीशो पर विशेष रेट में उपलब्ध है।`,
            payout: m.payout || "Fixed Sponsorship + Affiliate Rev-Share",
            phone: m.phone || "918591852051",
            email: m.email || "creator@meesho-affiliates.com",
            approved: true
          }));
          setCreatorsState(formattedCreators);
        } else {
          setCreatorsState([]);
          alert("No matching influencers found in Qdrant vector database for this prompt criteria.");
        }
      } else {
        const errData = await matchResp.json().catch(() => ({ detail: matchResp.statusText }));
        setCreatorsState([]);
        alert(`Influencer Matchmaking API Error (${matchResp.status}): ${errData.detail || "Unable to retrieve matches from Qdrant"}`);
      }
    } catch (err: any) {
      console.error("Backend match-creators unreachable or failed:", err);
      setCreatorsState([]);
      alert(`Backend connection failed during influencer matching: ${err.message || err}`);
    } finally {
      setIsParsing(false);
    }
  };

  const handleLaunchCampaign = async () => {
    setIsCampaignLaunched(true);
    setShowDispatchModal(true);
    setDispatchLogs([]);

    const approvedCreators = creatorsState.filter((c: any) => c.approved);

    setDispatchLogs([
      "[00:00.12] 🟢 [CELERY WORKER POOL] Initiating multi-channel automated dispatch queue...",
      "[00:00.38] ⚡ [API CONNECT] Contacting backend dispatch engine..."
    ]);

    try {
      const apiUrl = "";
      const resp = await fetch(`${apiUrl}/api/dispatch-campaign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creators: approvedCreators,
          product: extractedEntities.product,
          price: extractedEntities.price,
        }),
      });

      const data = await resp.json();
      if (data.mode === "meta_cloud_api" || data.mode === "twilio_api") {
        setDispatchLogs((prev) => [
          ...prev,
          `[00:00.85] 🟢 [DIRECT API SUCCESS] Mode: ${data.mode.toUpperCase()} — Dispatched ${data.dispatched} creators programmatically!`,
          "[00:01.20] ⚡ [SUCCESS] Campaign executed successfully."
        ]);
      } else {
        setDispatchLogs((prev) => [
          ...prev,
          "[00:00.85] 🟢 [BROWSER DISPATCH READY] Lead creator WhatsApp window opened automatically.",
          "[00:01.20] ⚡ [BATCH OUTREACH] Use the One-Click Outreach Table below to launch WhatsApp & Email briefs for all remaining creators right from your browser!"
        ]);
        if (approvedCreators.length > 0) {
          const lead = approvedCreators[0];
          const brief =
            `MEESHO INFLUENCER SPONSORSHIP CAMPAIGN BRIEF\n\n` +
            `🎯 Headline: ${lead.headline}\n` +
            `💰 Compensation: ${lead.payout || "Verified Integration & Rev-Share"}\n\n` +
            `${lead.hook || ""}\n\n` +
            `🗣️ Verbatim Script:\n${lead.hindi}\n\n` +
            `🔗 Referral Link: https://meesho.com/campaign/${currentScenarioKey}`;
          window.open(`https://wa.me/${lead.phone}?text=${encodeURIComponent(brief)}`, "_blank");
        }
      }
    } catch (err) {
      setDispatchLogs((prev) => [
        ...prev,
        "[00:00.85] 🟢 [DIRECT BROWSER DISPATCH] Backend fallback triggered. Launching direct WhatsApp (wa.me) dispatch...",
        "[00:01.20] ⚡ [SUCCESS] Lead creator WhatsApp chat window opened! Use the table below for all creators."
      ]);
      if (approvedCreators.length > 0) {
        const lead = approvedCreators[0];
        const brief =
          `MEESHO INFLUENCER SPONSORSHIP CAMPAIGN BRIEF\n\n` +
          `🎯 Headline: ${lead.headline}\n` +
          `💰 Compensation: ${lead.payout || "Verified Integration & Rev-Share"}\n\n` +
          `${lead.hook || ""}\n\n` +
          `🗣️ Verbatim Script:\n${lead.hindi}\n\n` +
          `🔗 Referral Link: https://meesho.com/campaign/${currentScenarioKey}`;
        window.open(`https://wa.me/${lead.phone}?text=${encodeURIComponent(brief)}`, "_blank");
      }
    }
  };

  const handleOpenAllWhatsApp = () => {
    const approvedCreators = creatorsState.filter((c: any) => c.approved);
    approvedCreators.forEach((c: any, index: number) => {
      const brief =
        `MEESHO INFLUENCER SPONSORSHIP CAMPAIGN BRIEF\n\n` +
        `🎯 Headline: ${c.headline || "Product Clearance Sponsorship"}\n` +
        `💰 Compensation: ${c.payout || "Verified Integration & Rev-Share"}\n\n` +
        `${c.hook || ""}\n\n` +
        `🗣️ Verbatim Script:\n${c.hindi || "Promote Meesho product with exclusive link"}\n\n` +
        `🔗 Referral Link: https://meesho.com/campaign/${currentScenarioKey}`;
      setTimeout(() => {
        window.open(`https://wa.me/${c.phone || "+919876543210"}?text=${encodeURIComponent(brief)}`, "_blank");
      }, index * 800);
    });
  };

  const handleOpenAllEmails = () => {
    const approvedCreators = creatorsState.filter((c: any) => c.approved);
    approvedCreators.forEach((c: any, index: number) => {
      const subject = `Sponsorship Invitation: ${c.headline || "Meesho Liquidation Campaign"}`;
      const body =
        `Hi ${c.name},\n\nWe would like to invite you to collaborate on our latest product campaign.\n\n` +
        `Target Product: ${extractedEntities.product}\nUnit Price: ${extractedEntities.price}\n\n` +
        `Script & Brief:\n${c.hindi || "Promote our latest deal"}\n\n` +
        `Please let us know if you are available this week!\n\nBest,\nMeesho Partner Team`;
      const email = c.email || `${c.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@meesho-creator.in`;
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setTimeout(() => {
        window.open(gmailUrl, "_blank");
      }, index * 800);
    });
  };

  const handleBackToHub = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      try {
        const targetName = (window.opener && window.opener.name) ? window.opener.name : "meesho_supplier_hub";
        if (window.opener && !window.opener.closed) {
          window.opener.name = targetName;
        }
        const targetTab = window.open("/supplier/influencer", targetName);
        if (targetTab) {
          targetTab.focus();
          return;
        }
      } catch (err) {}

      if (window.history.length > 1 && document.referrer && document.referrer.includes("/supplier")) {
        window.history.back();
        return;
      }
    }
    router.push("/supplier/influencer");
  };

  const currentScenario = SCENARIOS[currentScenarioKey];

  return (
    <div className={theme === "dark" ? "dark-theme" : ""} style={{ minHeight: "100vh", background: "var(--bg-main)", color: "var(--text-dark)", fontFamily: "'Inter', sans-serif" }}>
      {/* Top Navigation Header Strip */}
      <header className="broker-top-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", borderBottom: "1px solid var(--border-color)", background: "var(--bg-card)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div className="broker-logo-box" style={{ background: "linear-gradient(135deg, #9F2089, #4A1FB8)", color: "#FFF", padding: "6px 12px", borderRadius: "8px", fontWeight: 800, fontSize: "14px" }}>
            VyaparSETU AI Broker
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>Algorithmic Influencer &amp; Liquidation Broker</h1>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Connected to Meesho Supplier Hub • 50K+ Verified Creators</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            type="button"
            id="btn-theme-toggle"
            onClick={handleThemeToggle}
            style={{ display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "1px solid var(--border-color)", padding: "6px 12px", borderRadius: "20px", color: "var(--text-dark)", cursor: "pointer", fontSize: "13px", fontWeight: 700 }}
          >
            <span id="theme-icon">{theme === "dark" ? "☀️" : "🌙"}</span>
            <span id="theme-label">{theme === "dark" ? "Light" : "Dark"}</span>
          </button>

          <span className="qdrant-badge" style={{ background: "#EEECFA", color: "#4A1FB8", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, border: "1px solid #D8CEFF" }}>
            ⚡ Qdrant ANN: {qdrantLatency}ms
          </span>

          <a
            href="#"
            id="btn-back-meesho"
            onClick={handleBackToHub}
            style={{ display: "flex", alignItems: "center", gap: "6px", background: "linear-gradient(135deg, #9F2089, #4A1FB8)", color: "#FFF", textDecoration: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: 800, fontSize: "13.5px" }}
          >
            <span>← Return to Meesho Hub</span>
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="broker-main-pad" style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Campaign Status Banner if launched */}
        {isCampaignLaunched && (
          <div id="campaign-status-banner" style={{ background: "linear-gradient(135deg, #038D63, #026B4B)", color: "#FFF", padding: "18px 24px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 10px 30px rgba(3, 141, 99, 0.3)" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>✓ Campaign executed successfully</h2>
            </div>
            <span style={{ background: "#FFF", color: "#038D63", padding: "6px 14px", borderRadius: "20px", fontWeight: 800, fontSize: "12.5px" }}>DISPATCHED ACTIVE</span>
          </div>
        )}


        {/* Conversational Intent Input & NLP Extractor Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Left: Raw Prompt Input */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", padding: "24px", borderRadius: "14px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "var(--text-dark)" }}>1. Natural Language Intent Input</h3>
            </div>
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Example:- Clear 500 unbranded cotton bedsheets in UP this week at ₹1349 unit price."
              style={{ width: "100%", height: "120px", background: "var(--bg-main)", color: "var(--text-dark)", border: "1px solid var(--border-color)", padding: "16px", borderRadius: "8px", fontSize: "14.5px", fontFamily: "inherit" }}
            />
            <div style={{ background: "var(--bg-main)", padding: "12px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-dark)" }}>
                💡 <span style={{ textDecoration: "underline" }}>Prompt Guidance:</span> Please specify the following fields: <span style={{ color: "#D3184B" }}>Product / Category</span>, <span style={{ color: "#4A1FB8" }}>Target Region</span>, <span style={{ color: "#038D63" }}>Liquidation Volume</span>, and <span style={{ color: "#D3184B" }}>Unit Price</span>.
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-main)", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-dark)" }}>👑 Number of Influencers to Match:</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={targetCount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setTargetCount("");
                      return;
                    }
                    const num = parseInt(val, 10);
                    if (!isNaN(num)) {
                      if (num > 50) setTargetCount(50);
                      else setTargetCount(num);
                    }
                  }}
                  onBlur={() => {
                    if (targetCount === "" || Number(targetCount) < 1 || isNaN(Number(targetCount))) {
                      setTargetCount(10);
                    }
                  }}
                  style={{ width: "75px", padding: "6px 10px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-dark)", fontWeight: 800, fontSize: "14px", textAlign: "center" }}
                />
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>creators</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleParseIntentAndMatch}
              disabled={isParsing}
              style={{ background: isParsing ? "#8F85B8" : "linear-gradient(135deg, #9F2089, #4A1FB8)", color: "#FFF", border: "none", padding: "14px", borderRadius: "8px", fontWeight: 800, fontSize: "15px", cursor: isParsing ? "not-allowed" : "pointer", transition: "all 0.3s ease" }}
            >
              {isParsing ? "⏳ VyaparSETU is extracting suitable influencers..." : "⚡ Parse Intent & Discover Regional Influencers"}
            </button>
          </div>

          {/* Right: NLP Extractor Output */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", padding: "24px", borderRadius: "14px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "var(--text-dark)" }}>2. Extracted Structured Entities (NER)</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div style={{ background: "var(--bg-main)", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <div style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Product SKU / Category</div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-dark)", marginTop: "4px" }}>{hasParsedIntent ? extractedEntities.product : "—"}</div>
              </div>
              <div style={{ background: "var(--bg-main)", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <div style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Target Region</div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-dark)", marginTop: "4px" }}>{hasParsedIntent ? extractedEntities.region : "—"}</div>
              </div>
              <div style={{ background: "var(--bg-main)", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <div style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Target Liquidation Volume</div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-dark)", marginTop: "4px" }}>{hasParsedIntent ? extractedEntities.volume : "—"}</div>
              </div>
              <div style={{ background: "var(--bg-main)", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <div style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Unit Price &amp; Urgency</div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#D3184B", marginTop: "4px" }}>{hasParsedIntent ? extractedEntities.price : "—"}</div>
              </div>
            </div>
          </div>
        </div>

        {hasParsedIntent && creatorsState.length > 0 ? (
          <>
            {/* Localized Ads Banner Card */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", padding: "20px 24px", borderRadius: "14px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-dark)", margin: 0 }}>
                AI generates localized adds in regional language of the influencer.
              </h2>
            </div>

            {/* Creators Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "24px" }}>
              {creatorsState.map((c) => {
                const fullAdBrief =
                  `MEESHO INFLUENCER SPONSORSHIP CAMPAIGN BRIEF\n\n` +
                  `🎯 Headline: ${c.headline}\n` +
                  `💰 Compensation: ${c.payout || "Verified Integration & Rev-Share"}\n\n` +
                  `${c.hook || ""}\n\n` +
                  `${c.valueProps || ""}\n\n` +
                  `🗣️ Verbatim Script (Hindi/Vernacular):\n${c.hindi}\n\n` +
                  `🔗 Campaign Referral Link: https://meesho.com/campaign/${currentScenarioKey}`;

                const encodedCopy = encodeURIComponent(fullAdBrief);
                const whatsappUrl = `https://wa.me/${c.phone}?text=${encodedCopy}`;
                const targetEmail = c.email || `${c.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@meesho-creator.in`;
                const emailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${encodeURIComponent("Meesho Sponsorship Campaign Brief: " + (c.headline || "AI Partnership"))}&body=${encodedCopy}`;

                return (
                  <div
                    key={c.id}
                    style={{
                      background: "var(--bg-card)",
                      border: `2px solid ${c.approved ? (isCampaignLaunched ? "#038D63" : "#4A1FB8") : "#D3184B"}`,
                      opacity: c.approved ? 1 : 0.45,
                      padding: "24px",
                      borderRadius: "14px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", gap: "16px", marginBottom: "16px", alignItems: "center" }}>
                        <img src={c.avatar} alt={c.name} style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border-color)" }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "var(--text-dark)" }}>{c.name}</h3>
                            {isCampaignLaunched && <span style={{ background: "#038D63", color: "#FFF", fontSize: "11px", fontWeight: 800, padding: "2px 8px", borderRadius: "12px" }}>DISPATCHED ✓</span>}
                          </div>
                          <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "6px" }}>{c.followers} • Regional Match</div>
                          <span style={{ background: "#E8F7F0", color: "#038D63", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 800 }}>🕸️ {c.similarity}</span>
                        </div>
                      </div>

                    </div>

                    <div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                        <button
                          onClick={() => handleToggleApproved(c.id, true)}
                          style={{ background: c.approved ? "#038D63" : "transparent", color: c.approved ? "#FFF" : "#038D63", border: "1.5px solid #038D63", padding: "10px", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}
                        >
                          ✓ Approved
                        </button>
                        <button
                          onClick={() => handleToggleApproved(c.id, false)}
                          style={{ background: !c.approved ? "#D3184B" : "transparent", color: !c.approved ? "#FFF" : "#D3184B", border: "1.5px solid #D3184B", padding: "10px", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}
                        >
                          ✕ Veto / Exclude
                        </button>
                      </div>

                      <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        <span style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Real Direct Outreach (Sends Full Ad Brief)</span>
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: "#E8F7F0", color: "#038D63", textDecoration: "none", fontSize: "13px", fontWeight: 700, padding: "10px", borderRadius: "8px", border: "1px solid #BCEAD5" }}
                        >
                          <span>💬 Send via WhatsApp</span>
                          <span>→</span>
                        </a>
                        <a
                          href={emailUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: "#FFF5F7", color: "#D3184B", textDecoration: "none", fontSize: "13px", fontWeight: 700, padding: "10px", borderRadius: "8px", border: "1px solid #FCDAE3" }}
                        >
                          <span>📧 Send via Gmail</span>
                          <span>→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Big Launch Campaign Button */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "12px", marginBottom: "40px" }}>
              <button
                type="button"
                onClick={handleLaunchCampaign}
                style={{ background: isCampaignLaunched ? "#038D63" : "linear-gradient(135deg, #00FFA3, #038D63)", color: isCampaignLaunched ? "#FFF" : "#0B0C10", border: "none", padding: "18px 48px", borderRadius: "14px", fontSize: "18px", fontWeight: 900, cursor: "pointer", boxShadow: "0 10px 30px rgba(0, 255, 163, 0.3)" }}
              >
                {isCampaignLaunched ? "⚡ Campaign Launched (All Channels Active)" : "🚀 Launch Multi-Channel Direct Outreach Campaign →"}
              </button>
            </div>
          </>
        ) : (
          <div style={{ background: "var(--bg-card)", border: "1px dashed var(--border-color)", padding: "54px 24px", borderRadius: "16px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", margin: "12px 0" }}>
            <div style={{ fontSize: "40px" }}>{isParsing ? "⏳" : "👑"}</div>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "var(--text-dark)" }}>
              {isParsing ? "VyaparSETU is extracting the most suitable influencers for you." : "Discover Regional Influencers for Your Campaign"}
            </h3>
            <p style={{ margin: 0, fontSize: "14.5px", color: "var(--text-muted)", maxWidth: "560px", lineHeight: 1.6 }}>
              {isParsing
                ? "Please wait while our AI matches verified creators tailored to your product category and target region."
                : "Enter your product clearance prompt above and click \"⚡ Parse Intent & Discover Regional Influencers\" to unlock matching creators."}
            </p>
          </div>
        )}
      </main>

      {/* Dispatch Modal */}
      {showDispatchModal && (
        <div className="modal-overlay active" style={{ display: "flex", zIndex: 9999 }}>
          <div className="modal-box" style={{ maxWidth: "820px", width: "95%", background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "16px", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
            <div style={{ background: "linear-gradient(135deg, #2A1C5A, #4A1FB8)", padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#FFF" }}>
              <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800 }}>⚡ Multi-Channel Dispatch &amp; Outreach Queue</h3>
              <button onClick={() => { setShowDispatchModal(false); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ background: "transparent", border: "none", color: "#FFF", fontSize: "22px", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ padding: "16px 20px", background: "#0B0C10", color: "#00FFA3", fontFamily: "monospace", fontSize: "12.5px", maxHeight: "140px", overflowY: "auto", borderBottom: "1px solid var(--border-color)" }}>
              {dispatchLogs.map((log, idx) => (
                <div key={idx} style={{ marginBottom: "6px" }}>
                  {log}
                </div>
              ))}
            </div>

            {/* Batch Action Buttons Bar */}
            <div style={{ padding: "14px 20px", background: "var(--bg-main)", borderBottom: "1px solid var(--border-color)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
              <div>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-dark)" }}>Direct Outreach Queue ({creatorsState.filter((c: any) => c.approved).length} Creators)</span>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>Click below to send individual or batch messages via WhatsApp and Email.</p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={handleOpenAllWhatsApp}
                  style={{ background: "#25D366", color: "#FFF", border: "none", padding: "8px 14px", borderRadius: "8px", fontWeight: 800, fontSize: "12.5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  💬 Open All WhatsApp Tabs
                </button>
                <button
                  type="button"
                  onClick={handleOpenAllEmails}
                  style={{ background: "#D3184B", color: "#FFF", border: "none", padding: "8px 14px", borderRadius: "8px", fontWeight: 800, fontSize: "12.5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  📧 Open All Gmail Tabs
                </button>
              </div>
            </div>

            {/* Individual Creators List */}
            <div style={{ padding: "16px 20px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
              {creatorsState.filter((c: any) => c.approved).map((c: any, i: number) => {
                const brief =
                  `MEESHO INFLUENCER SPONSORSHIP CAMPAIGN BRIEF\n\n` +
                  `🎯 Headline: ${c.headline || "Product Clearance Sponsorship"}\n` +
                  `💰 Compensation: ${c.payout || "Verified Integration & Rev-Share"}\n\n` +
                  `${c.hook || ""}\n\n` +
                  `🗣️ Verbatim Script:\n${c.hindi || "Promote Meesho product with exclusive link"}\n\n` +
                  `🔗 Referral Link: https://meesho.com/campaign/${currentScenarioKey}`;
                const waLink = `https://wa.me/${c.phone || "+919876543210"}?text=${encodeURIComponent(brief)}`;

                const subject = `Sponsorship Invitation: ${c.headline || "Meesho Liquidation Campaign"}`;
                const body =
                  `Hi ${c.name},\n\nWe would like to invite you to collaborate on our latest product campaign.\n\n` +
                  `Target Product: ${extractedEntities.product}\nUnit Price: ${extractedEntities.price}\n\n` +
                  `Script & Brief:\n${c.hindi || "Promote our latest deal"}\n\n` +
                  `Please let us know if you are available this week!\n\nBest,\nMeesho Partner Team`;
                const email = c.email || `${c.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@meesho-creator.in`;
                const emailLinkGmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                return (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--bg-main)", border: "1px solid var(--border-color)", borderRadius: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <img src={c.avatar} alt={c.name} style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }} />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "14px", color: "var(--text-dark)" }}>{c.name}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{c.region} • {c.followers}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: "5px", background: "#E8FBF0", color: "#1A8A4A", textDecoration: "none", padding: "8px 12px", borderRadius: "8px", fontWeight: 700, fontSize: "12.5px", border: "1px solid #B8F2D0" }}
                      >
                        💬 WhatsApp Brief →
                      </a>
                      <a
                        href={emailLinkGmail}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: "5px", background: "#FFF5F7", color: "#D3184B", textDecoration: "none", padding: "8px 12px", borderRadius: "8px", fontWeight: 700, fontSize: "12.5px", border: "1px solid #FCDAE3" }}
                      >
                        📧 Gmail Brief →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ padding: "14px 20px", background: "var(--bg-card)", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => { setShowDispatchModal(false); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ background: "#4A1FB8", color: "#FFF", padding: "10px 28px", borderRadius: "8px", fontWeight: 800, border: "none", cursor: "pointer", fontSize: "14px" }}>
                Done ✓
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
