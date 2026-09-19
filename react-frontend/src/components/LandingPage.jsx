import React, { useState, useEffect } from 'react';
import {
  Shield,
  ArrowRight,
  ChevronDown,
  Layers,
  Database,
  AlertTriangle,
  FileCheck,
  Cpu,
  Lock,
  Globe2,
  ExternalLink,
  Zap,
  Terminal,
  RefreshCw,
  Server
} from 'lucide-react';
import './LandingPage.css';
import { ShinyText, DecryptedText, BlurText, Waves } from './react-bits';

export function LandingPage({ onLaunchPlatform, onOpenDashAnalytics }) {
  // Cursor follower state
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Real-time telemetry simulated metrics
  const [telemetry, setTelemetry] = useState({
    monitoredNodes: 4829,
    consensusRate: 99.98,
    activeBlocks: 849204,
    threatsQuarantined: 142
  });

  // Simulator active scenario
  const [activeScenario, setActiveScenario] = useState('counterfeit');

  // Clock
  const [timeStr, setTimeStr] = useState('');

  // Time updater
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }) + ' UTC'
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  // Telemetry tick
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        monitoredNodes: prev.monitoredNodes + (Math.random() > 0.6 ? 1 : 0),
        consensusRate: +(99.97 + Math.random() * 0.02).toFixed(2),
        activeBlocks: prev.activeBlocks + 1,
        threatsQuarantined: prev.threatsQuarantined + (Math.random() > 0.85 ? 1 : 0)
      }));
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Mouse & Scroll listeners
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const hoverHandlers = {
    onMouseEnter: () => setIsHovering(true),
    onMouseLeave: () => setIsHovering(false)
  };

  // Threat scenarios data
  const scenarios = {
    counterfeit: {
      title: 'Counterfeit Microchip Interception',
      tag: 'MIL-SPEC HARDWARE',
      desc: 'Tier-3 avionics processor batch flagged with anomalous silicon die signature.',
      logs: [
        { time: '14:22:01.04', tag: 'INGEST', text: 'Lot #XC-9921 from Shenzhen AeroTech received at Tier-2 integrator.' },
        { time: '14:22:01.18', tag: 'SCAN', text: 'Optical & X-ray die inspection hash: 0x8f2d...c419 does NOT match DoD master hash.' },
        { time: '14:22:01.21', tag: 'ALERT', text: 'VULNERABILITY DETECTED: Counterfeit thermal tolerance variance +14.2% above threshold.', warn: true },
        { time: '14:22:01.24', tag: 'CONSENSUS', text: 'Blockchain Smart Contract 0xLNK-DEF-7 automatically QUARANTINED batch.', highlight: true },
        { time: '14:22:01.27', tag: 'RESOLVE', text: 'Autonomous alternate PO routed to Raytheon-approved domestic foundry. Risk delta: 0.00%.', highlight: true }
      ]
    },
    chokepoint: {
      title: 'Strait of Malacca Disruption',
      tag: 'GEOPOLITICAL RADAR',
      desc: 'Maritime congestion index exceeds 84% following typhoon contingency.',
      logs: [
        { time: '09:14:12.80', tag: 'TELEMETRY', text: 'AIS satellite radar detects 18 allied cargo carriers anchored outside Singapore channel.' },
        { time: '09:14:13.02', tag: 'PREDICTION', text: 'LinkGuard Neural Engine forecasts 11-day delivery lag for Tier-1 radar antenna assemblies.', warn: true },
        { time: '09:14:13.15', tag: 'OPTIMIZE', text: 'Dynamic re-routing generated: Rail freight corridor via India-Middle East economic nexus activated.', highlight: true },
        { time: '09:14:13.29', tag: 'STATUS', text: 'Supply continuity maintained at 98.4%. Assembly line downtime prevented.', highlight: true }
      ]
    },
    firmware: {
      title: 'Firmware Supply Chain Infiltration',
      tag: 'ZERO-TRUST KERNEL',
      desc: 'Upstream open-source library dependency compromised in telemetry driver.',
      logs: [
        { time: '21:05:44.11', tag: 'AUDIT', text: 'Continuous SBOM audit scan executed across 1,840 software components.' },
        { time: '21:05:44.22', tag: 'SIGNATURE', text: 'Cryptographic hash mismatch in libcrypto-telemetry.so (v2.14.0b). Remote callback injected.', warn: true },
        { time: '21:05:44.30', tag: 'ISOLATION', text: 'Air-gapped firmware sandbox triggered. Affected node blacklisted from defense ledger.', highlight: true },
        { time: '21:05:44.42', tag: 'PROOF', text: 'Zero-Knowledge Proof verified by coalition peers (Airbus DS & Lockheed). Consensus locked.', highlight: true }
      ]
    }
  };

  return (
    <div className="fps-landing">
      {/* React Bits Waves Background (Replaces Three.js) */}
      <Waves
        lineColor="rgba(217, 186, 132, 0.42)"
        backgroundColor="transparent"
        waveSpeedX={0.018}
        waveSpeedY={0.008}
        waveAmpX={38}
        waveAmpY={20}
        xGap={14}
        yGap={34}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1
        }}
      />
      <div className="fps-vignette" style={{ zIndex: 0 }} />

      {/* Custom Magnetic Cursor */}
      <div
        className="fps-cursor-dot"
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
      />
      <div
        className={`fps-cursor-ring ${isHovering ? 'active' : ''}`}
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
      />

      <div className="fps-content-wrap">
        {/* Navigation Bar */}
        <header className={`fps-nav ${isScrolled ? 'scrolled' : ''}`}>
          <div
            className="fps-logo-wrap"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            {...hoverHandlers}
          >
            <span className="fps-logo-text">
              <Shield size={22} className="fps-logo-shield" />
              LINK<ShinyText text="GUARD" color="var(--primary-gold)" shineColor="#ffffff" />
            </span>
            <div className="fps-status-pill">
              <span className="fps-pulse-dot" />
              <span>60 FPS // DEFENSE PROTOCOL</span>
            </div>
          </div>

          <ul className="fps-nav-links">
            <li>
              <a
                className="fps-nav-link"
                onClick={() => scrollTo('capabilities')}
                {...hoverHandlers}
              >
                Capabilities
              </a>
            </li>
            <li>
              <a
                className="fps-nav-link"
                onClick={() => scrollTo('simulator')}
                {...hoverHandlers}
              >
                Threat Simulator
              </a>
            </li>
            <li>
              <a
                className="fps-nav-link"
                onClick={() => scrollTo('standards')}
                {...hoverHandlers}
              >
                Defense Standards
              </a>
            </li>
            <li>
              <a
                className="fps-nav-link"
                onClick={onLaunchPlatform}
                {...hoverHandlers}
              >
                Dash Suite ↗
              </a>
            </li>
          </ul>

          <div className="fps-nav-actions">
            <button
              className="fps-btn-minimal"
              onClick={onLaunchPlatform}
              {...hoverHandlers}
            >
              <ExternalLink size={13} />
              Formal Analytics
            </button>
            <button
              className="fps-btn-primary"
              onClick={onLaunchPlatform}
              {...hoverHandlers}
            >
              <Lock size={13} />
              Launch Console
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="fps-hero">
          <div className="fps-hero-top">
            <div className="fps-badge-row">
              <div className="fps-badge-tag">
                <Zap size={13} />
                <DecryptedText
                  text="PROTOCOL 01 // AUTONOMOUS DEFENSE SUPPLY INTELLIGENCE"
                  speed={22}
                  animateOn="mount"
                />
              </div>
              <span className="fps-badge-sub">• MIL-STD-810H & NIST SP 800-161 AUDITED</span>
            </div>

            <h1 className="fps-hero-title">
              <div className="fps-title-line">
                <span>Autonomous</span>
              </div>
              <div className="fps-title-line">
                <span>
                  Supply Chain <ShinyText text="Defense" color="var(--primary-gold)" shineColor="#ffffff" />
                </span>
              </div>
              <div className="fps-title-line">
                <span>Intelligence Protocol</span>
              </div>
            </h1>

            <div className="fps-hero-meta-grid">
              <div>
                <p className="fps-hero-desc">
                  <BlurText
                    text="Engineered for aerospace primes and defense agencies. Continuous multi-tier graph neural mapping, zero-knowledge cryptographic provenance, and sub-15ms threat interception across global manufacturing networks."
                    delay={18}
                    animateBy="words"
                  />
                </p>

                <div className="fps-hero-actions">
                  <button
                    className="fps-btn-primary"
                    style={{ padding: '14px 32px', fontSize: '13px' }}
                    onClick={onLaunchPlatform}
                    {...hoverHandlers}
                  >
                    <span>Initialize LinkGuard Console</span>
                    <ArrowRight size={15} />
                  </button>
                  <button
                    className="fps-btn-minimal"
                    style={{ padding: '14px 28px', fontSize: '13px' }}
                    onClick={() => scrollTo('capabilities')}
                    {...hoverHandlers}
                  >
                    <span>Explore Architecture</span>
                  </button>
                </div>
              </div>

              {/* Hero Stats Card */}
              <div className="fps-hero-stats">
                <div className="fps-stat-item">
                  <div className="fps-stat-num">
                    {telemetry.monitoredNodes.toLocaleString()}
                    <span>+</span>
                  </div>
                  <div className="fps-stat-lbl">Tier 1–4 Monitored Nodes</div>
                </div>
                <div className="fps-stat-item">
                  <div className="fps-stat-num">
                    {telemetry.consensusRate}
                    <span>%</span>
                  </div>
                  <div className="fps-stat-lbl">Ledger Immutability</div>
                </div>
                <div className="fps-stat-item">
                  <div className="fps-stat-num">
                    &lt; 15<span>ms</span>
                  </div>
                  <div className="fps-stat-lbl">Anomaly Detection Speed</div>
                </div>
                <div className="fps-stat-item">
                  <div className="fps-stat-num">
                    {telemetry.threatsQuarantined}
                    <span>!</span>
                  </div>
                  <div className="fps-stat-lbl">Threats Quarantined (24h)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Bottom Bar */}
          <div className="fps-hero-bottom">
            <div
              className="fps-scroll-prompt"
              onClick={() => scrollTo('capabilities')}
              {...hoverHandlers}
            >
              <span>Scroll to Explore</span>
              <ChevronDown size={14} className="fps-scroll-icon" />
            </div>

            <div className="fps-hero-live-telemetry">
              <span>SYSTEM CLOCK: <span className="val">{timeStr}</span></span>
              <span>BLOCK: <span className="val">#{telemetry.activeBlocks.toLocaleString()}</span></span>
              <span>READINESS: <span className="val" style={{ color: '#10b981' }}>DEFCON 5 OPTIMAL</span></span>
            </div>
          </div>
        </section>

        {/* Infinite Telemetry Marquee */}
        <div className="fps-marquee-container">
          <div className="fps-marquee-track">
            <div className="fps-marquee-item">
              <span className="symbol">//</span>
              <span>LINKGUARD DEFENSE LEDGER</span>
            </div>
            <div className="fps-marquee-item">
              <span className="symbol">●</span>
              <span>AIRBUS DEFENCE & SPACE CONSENSUS: <strong>CONFIRMED</strong></span>
            </div>
            <div className="fps-marquee-item">
              <span className="symbol">●</span>
              <span>LOCKHEED MARTIN INTEGRATION: <strong>ACTIVE</strong></span>
            </div>
            <div className="fps-marquee-item">
              <span className="symbol">●</span>
              <span>NATO NCAGE SPECIFICATION: <strong>COMPLIANT</strong></span>
            </div>
            <div className="fps-marquee-item">
              <span className="symbol">●</span>
              <span>CRYPTOGRAPHIC HASH: <strong>SHA-256 ZERO-KNOWLEDGE PROOF</strong></span>
            </div>
            <div className="fps-marquee-item">
              <span className="symbol">●</span>
              <span>SUB-TIER GRAPH NEURAL VISIBILITY: <strong>TIER 4 CONFIRMED</strong></span>
            </div>

            {/* Duplicate for seamless infinite loop */}
            <div className="fps-marquee-item">
              <span className="symbol">//</span>
              <span>LINKGUARD DEFENSE LEDGER</span>
            </div>
            <div className="fps-marquee-item">
              <span className="symbol">●</span>
              <span>AIRBUS DEFENCE & SPACE CONSENSUS: <strong>CONFIRMED</strong></span>
            </div>
            <div className="fps-marquee-item">
              <span className="symbol">●</span>
              <span>LOCKHEED MARTIN INTEGRATION: <strong>ACTIVE</strong></span>
            </div>
            <div className="fps-marquee-item">
              <span className="symbol">●</span>
              <span>NATO NCAGE SPECIFICATION: <strong>COMPLIANT</strong></span>
            </div>
            <div className="fps-marquee-item">
              <span className="symbol">●</span>
              <span>CRYPTOGRAPHIC HASH: <strong>SHA-256 ZERO-KNOWLEDGE PROOF</strong></span>
            </div>
            <div className="fps-marquee-item">
              <span className="symbol">●</span>
              <span>SUB-TIER GRAPH NEURAL VISIBILITY: <strong>TIER 4 CONFIRMED</strong></span>
            </div>
          </div>
        </div>

        {/* Section 01: Core Capabilities Grid (60fps.fr signature style) */}
        <section className="fps-section" id="capabilities">
          <div className="fps-section-label">
            <div className="fps-section-line" />
            <span className="fps-label-title">Defense Architecture & Capabilities</span>
            <span className="fps-label-count">MODULES // 04</span>
          </div>

          <div className="fps-cards-grid">
            {/* Card 01 */}
            <div className="fps-card" onClick={onLaunchPlatform} {...hoverHandlers}>
              <div className="fps-card-bg-gradient" />
              <div className="fps-card-top">
                <span className="fps-card-num">01</span>
                <span className="fps-card-tag">GRAPH NEURAL NET</span>
              </div>
              <div className="fps-card-middle">
                <div className="fps-card-icon-wrap">
                  <Layers size={22} />
                </div>
                <h3 className="fps-card-title">Multi-Tier Topology Mapping</h3>
                <p className="fps-card-desc">
                  Deep recursive graph analysis uncovering hidden Tier-3 & Tier-4 sub-supplier
                  chokepoints and single-source dependencies before disruptions trigger.
                </p>
              </div>
              <div className="fps-card-bottom">
                <span className="fps-card-metric">Graph Depth: <strong>Tier 4</strong></span>
                <span className="fps-card-arrow">→</span>
              </div>
            </div>

            {/* Card 02 */}
            <div className="fps-card" onClick={onLaunchPlatform} {...hoverHandlers}>
              <div className="fps-card-bg-gradient" />
              <div className="fps-card-top">
                <span className="fps-card-num">02</span>
                <span className="fps-card-tag">SHA-256 LEDGER</span>
              </div>
              <div className="fps-card-middle">
                <div className="fps-card-icon-wrap">
                  <Database size={22} />
                </div>
                <h3 className="fps-card-title">Quantum-Proof Immutable Ledger</h3>
                <p className="fps-card-desc">
                  Tamper-evident blockchain recording every bill of materials, material
                  certification, and chain of custody with military-grade non-repudiation.
                </p>
              </div>
              <div className="fps-card-bottom">
                <span className="fps-card-metric">Consensus: <strong>99.98%</strong></span>
                <span className="fps-card-arrow">→</span>
              </div>
            </div>

            {/* Card 03 */}
            <div className="fps-card" onClick={onLaunchPlatform} {...hoverHandlers}>
              <div className="fps-card-bg-gradient" />
              <div className="fps-card-top">
                <span className="fps-card-num">03</span>
                <span className="fps-card-tag">PREDICTIVE RADAR</span>
              </div>
              <div className="fps-card-middle">
                <div className="fps-card-icon-wrap">
                  <AlertTriangle size={22} />
                </div>
                <h3 className="fps-card-title">Geopolitical Threat Forecaster</h3>
                <p className="fps-card-desc">
                  Live satellite telemetry, maritime tracking, and geopolitical NLP flagging
                  embargo risks, canal blockages, and rare-earth mineral shortages 72 hours early.
                </p>
              </div>
              <div className="fps-card-bottom">
                <span className="fps-card-metric">Lead Time: <strong>72 Hours</strong></span>
                <span className="fps-card-arrow">→</span>
              </div>
            </div>

            {/* Card 04 */}
            <div className="fps-card" onClick={onLaunchPlatform} {...hoverHandlers}>
              <div className="fps-card-bg-gradient" />
              <div className="fps-card-top">
                <span className="fps-card-num">04</span>
                <span className="fps-card-tag">SMART CONTRACTS</span>
              </div>
              <div className="fps-card-middle">
                <div className="fps-card-icon-wrap">
                  <FileCheck size={22} />
                </div>
                <h3 className="fps-card-title">Coalition Trust & Proofs</h3>
                <p className="fps-card-desc">
                  Multi-signatory zero-knowledge protocols allowing allied defense partners
                  to verify component authenticity without disclosing classified intellectual property.
                </p>
              </div>
              <div className="fps-card-bottom">
                <span className="fps-card-metric">Protocol: <strong>Zero-Knowledge</strong></span>
                <span className="fps-card-arrow">→</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 02: Interactive Threat & Interception Simulator */}
        <section className="fps-section" id="simulator">
          <div className="fps-section-label">
            <div className="fps-section-line" />
            <span className="fps-label-title">Real-Time Threat Simulation Terminal</span>
            <span className="fps-label-count">LIVE KERNEL // 02</span>
          </div>

          <div className="fps-simulator-box">
            {/* Sidebar Tab Selection */}
            <div className="fps-sim-sidebar">
              {Object.entries(scenarios).map(([key, item]) => (
                <div
                  key={key}
                  className={`fps-sim-tab-btn ${activeScenario === key ? 'active' : ''}`}
                  onClick={() => setActiveScenario(key)}
                  {...hoverHandlers}
                >
                  <div className="fps-sim-tab-header">
                    <span className="fps-sim-tab-title">{item.title}</span>
                    <span className="fps-sim-tab-tag">{item.tag}</span>
                  </div>
                  <p className="fps-sim-tab-desc">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Terminal Console View */}
            <div className="fps-sim-console">
              <div className="fps-console-header">
                <div className="fps-console-dots">
                  <span className="fps-console-dot" />
                  <span className="fps-console-dot" />
                  <span className="fps-console-dot" />
                </div>
                <span className="fps-console-status">
                  ● KERNEL AUDIT STREAM — SCENARIO: {scenarios[activeScenario].tag}
                </span>
              </div>

              <div className="fps-console-log">
                {scenarios[activeScenario].logs.map((log, idx) => (
                  <div key={idx} className="fps-log-row">
                    <span className="fps-log-time">[{log.time}]</span>
                    <span className="fps-log-hash">[{log.tag}]</span>
                    <span
                      className={`fps-log-msg ${
                        log.warn ? 'fps-log-warn' : log.highlight ? 'fps-log-highlight' : ''
                      }`}
                    >
                      {log.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="fps-console-actions">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={14} style={{ color: '#d9ba84' }} />
                  <span style={{ fontFamily: 'var(--fps-font-mono)', fontSize: '11px', color: '#8e8e93' }}>
                    LINKGUARD AI DEFENSE AGENT v4.9 — AUTONOMOUS REMEDIATION ENGAGED
                  </span>
                </div>
                <button
                  className="fps-btn-minimal"
                  onClick={onLaunchPlatform}
                  {...hoverHandlers}
                >
                  Inspect In Console →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 03: Defense Certifications & Standards */}
        <section className="fps-section" id="standards">
          <div className="fps-section-label">
            <div className="fps-section-line" />
            <span className="fps-label-title">Defense Compliance & Verification Mandates</span>
            <span className="fps-label-count">AUDITED // 03</span>
          </div>

          <div className="fps-standards-strip">
            <div className="fps-standard-card">
              <span className="fps-std-code">MIL-STD-810H</span>
              <h4 className="fps-std-name">Environmental & Material Integrity</h4>
              <p className="fps-std-desc">
                Automated validation of aerospace component operational tolerances under high-stress criteria.
              </p>
            </div>

            <div className="fps-standard-card">
              <span className="fps-std-code">CMMC LEVEL 3</span>
              <h4 className="fps-std-name">Cybersecurity Maturity Model</h4>
              <p className="fps-std-desc">
                Enforced access control, cryptographic verification, and air-gapped ledger consensus for defense data.
              </p>
            </div>

            <div className="fps-standard-card">
              <span className="fps-std-code">NIST SP 800-161</span>
              <h4 className="fps-std-name">Supply Chain Risk Management</h4>
              <p className="fps-std-desc">
                Full-lifecycle zero-trust supply network visibility from raw ingot extraction to final assembly.
              </p>
            </div>

            <div className="fps-standard-card">
              <span className="fps-std-code">NATO NCAGE CODE</span>
              <h4 className="fps-std-name">Allied Codification System</h4>
              <p className="fps-std-desc">
                Interoperable cataloging and multi-nation smart contract settlement across NATO allied commands.
              </p>
            </div>
          </div>
        </section>

        {/* Monumental Call to Action (60fps.fr Style) */}
        <section className="fps-cta-section">
          <h2 className="fps-cta-headline">
            Ready to secure your <span className="gold">mission-critical</span> defense supply chain?
          </h2>
          <p className="fps-cta-desc">
            Join allied defense leaders utilizing LinkGuard to guarantee end-to-end
            hardware provenance, neutralize counterfeit intrusion, and mitigate global chokepoints.
          </p>

          <div className="fps-cta-btns">
            <button
              className="fps-btn-primary"
              style={{ padding: '16px 38px', fontSize: '13px' }}
              onClick={onLaunchPlatform}
              {...hoverHandlers}
            >
              <Lock size={15} />
              <span>Launch LinkGuard Console</span>
              <ArrowRight size={15} />
            </button>

            <button
              className="fps-btn-minimal"
              style={{ padding: '16px 32px', fontSize: '13px' }}
              onClick={onLaunchPlatform}
              {...hoverHandlers}
            >
              <ExternalLink size={15} />
              <span>Open Dash Defense Suite</span>
            </button>
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="fps-footer">
          <div className="fps-footer-left">
            <span>© {new Date().getFullYear()} LINKGUARD DEFENSE SYSTEMS</span>
            <span>CLASSIFICATION: ALLIED SECURE // LEVEL 4</span>
          </div>
          <div className="fps-footer-right">
            <a href="#capabilities" onClick={() => scrollTo('capabilities')}>
              CAPABILITIES
            </a>
            <a href="#simulator" onClick={() => scrollTo('simulator')}>
              THREAT ENGINE
            </a>
            <a onClick={onLaunchPlatform} style={{ cursor: 'pointer' }}>
              DASH SUITE
            </a>
            <span>60FPS.FR THEMED ARCHITECTURE</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
