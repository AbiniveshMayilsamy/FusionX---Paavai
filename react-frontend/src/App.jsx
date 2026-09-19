import React, { useState } from 'react';
import {
  Map,
  BarChart3,
  Lightbulb,
  FileText,
  Link2,
  Leaf,
  Database,
  FileSignature,
  Bot,
  Brain,
  Globe,
  Clock,
  Warehouse,
  Shield,
  Compass,
  Network
} from 'lucide-react';

import { INITIAL_SUPPLIERS } from './data/suppliersData';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { RealTimeMonitor } from './components/RealTimeMonitor';
import { EquipmentRegistration } from './components/EquipmentRegistration';
import { SupplierIntelligenceForm } from './components/SupplierIntelligenceForm';
import { AiPredictiveInsights } from './components/AiPredictiveInsights';

// Tabs
import { AutomaticTierMapping } from './components/tabs/AutomaticTierMapping';
import { DelayPredictionTab } from './components/tabs/DelayPredictionTab';
import { DigitalAccountabilityTab } from './components/tabs/DigitalAccountabilityTab';
import { InventoryStorageTab } from './components/tabs/InventoryStorageTab';
import { LogisticRouteTab } from './components/tabs/LogisticRouteTab';
import { SupplyChainMappingTab } from './components/tabs/SupplyChainMappingTab';
import { RiskAnalysisTab } from './components/tabs/RiskAnalysisTab';
import { AiRecommendationsTab } from './components/tabs/AiRecommendationsTab';
import { AdvancedReportsTab } from './components/tabs/AdvancedReportsTab';
import { BlockchainVerificationTab } from './components/tabs/BlockchainVerificationTab';
import { SustainabilityTab } from './components/tabs/SustainabilityTab';
import { SyntheticDataTab } from './components/tabs/SyntheticDataTab';
import { ContractsTab } from './components/tabs/ContractsTab';
import { AiAssistantTab } from './components/tabs/AiAssistantTab';
import { MlTrainingTab } from './components/tabs/MlTrainingTab';
import { CoalitionTrustTab } from './components/tabs/CoalitionTrustTab';
import { DatabaseViewerTab } from './components/tabs/DatabaseViewerTab';

// Modals
import { ExecutionOverlay } from './components/modals/ExecutionOverlay';
import { SupplierModal } from './components/modals/SupplierModal';
import { DownloadPopup } from './components/modals/DownloadPopup';
import { AiAssistantDrawer } from './components/modals/AiAssistantDrawer';
import { LandingPage } from './components/LandingPage';
import { Waves } from './components/react-bits';

export function App() {
  // View Mode: 'landing' (60fps.fr showcase) or 'app' (login / dashboard)
  const [viewMode, setViewMode] = useState('landing');

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);

  // Global 60fps Cursor State
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

  React.useEffect(() => {
    const handleMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // Active Tab (default: mapping)
  const [activeTab, setActiveTab] = useState('mapping');

  // Suppliers Dataset State
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);

  // Modals & Overlays State
  const [executionState, setExecutionState] = useState({
    isVisible: false,
    text: '',
    callback: null
  });

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

  const [downloadModalState, setDownloadModalState] = useState({
    isOpen: false,
    reportType: '',
    reportData: null
  });

  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  // Trigger Execution Overlay with callback
  const triggerExecution = (text, callback) => {
    setExecutionState({
      isVisible: true,
      text: text,
      callback: callback
    });
  };

  const handleExecutionSave = () => {
    if (executionState.callback) {
      executionState.callback();
    }
    setExecutionState({ isVisible: false, text: '', callback: null });
  };

  const handleExecutionExit = () => {
    setExecutionState({ isVisible: false, text: '', callback: null });
  };

  // Login & Logout
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('mapping');
    setViewMode('landing');
  };

  // Add Supplier Handler
  const handleAddSupplier = (newSup) => {
    triggerExecution(`INGESTING & VERIFYING SUPPLIER "${newSup.name.toUpperCase()}"...`, () => {
      const created = {
        id: `SUP_00${suppliers.length + 1}`,
        name: newSup.name,
        country: newSup.country,
        tier: newSup.tier,
        risk: newSup.geopoliticalRisk === 'critical' ? 'Critical' : newSup.geopoliticalRisk === 'high' ? 'High' : newSup.geopoliticalRisk === 'medium' ? 'Medium' : 'Low',
        risk_score: newSup.geopoliticalRisk === 'critical' ? 0.85 : newSup.geopoliticalRisk === 'high' ? 0.65 : newSup.geopoliticalRisk === 'medium' ? 0.45 : 0.2,
        reliability: '92%',
        reliability_score: 0.92,
        revenue: '$210M',
        employees: '1,400',
        certifications: 'ISO 9001:2015',
        sustainability: '80/100',
        sustainability_score: 80,
        blockchain: 'Verified',
        blockchain_verified: true,
        aiScore: '90%',
        statusBadge: '✓ Blockchain Verified',
        statusType: 'verified'
      };

      setSuppliers((prev) => [...prev, created]);
      alert(` Supplier "${newSup.name}" has been verified and registered into Tier ${newSup.tier}.`);
    });
  };

  // Register Equipment Handler
  const handleRegisterEquipment = (eq) => {
    triggerExecution(`ANALYZING MULTI-TIER SUPPLY PATH FOR "${eq.name.toUpperCase()}"...`, () => {
      const reportData = {
        equipment: eq.name,
        type: eq.type,
        criticality: eq.criticality,
        aiAnalysis: eq.aiEnabled ? 'Enabled' : 'Manual',
        suppliersScanned: suppliers.length,
        vulnerabilitiesDetected: 3,
        recommendationsReady: 7
      };

      setDownloadModalState({
        isOpen: true,
        reportType: `Equipment Analysis: ${eq.name}`,
        reportData: reportData
      });
      setActiveTab('mapping');
    });
  };

  // File Exporter
  const handleDownloadReport = (reportType, format) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    let filename = '';
    let content = '';
    let mimeType = 'text/plain';

    if (format === 'pdf') {
      filename = `LinkGuard_${reportType.replace(/\s+/g, '_')}_${timestamp}.txt`;
      content = `
╔══════════════════════════════════════════════════════════════╗
║                         LINKGUARD                           ║
║           AI-Powered Supply Chain Intelligence              ║
║        Advanced Multi-Tier Risk Analytics Platform         ║
╚══════════════════════════════════════════════════════════════╝

Report Title: ${reportType}
Generated: ${new Date().toLocaleString()}
Classification: CONFIDENTIAL & VERIFIED
Auditor: LinkGuard AI Neural Engine

=================================================================
EXECUTIVE SUMMARY & FINDINGS:
• Total Active Suppliers Monitored: ${suppliers.length}
• Multi-Tier Verified Consensus: 95%
• Critical Path Vulnerabilities: 2 Flagged
• Geopolitical Risk Index: 72%
• Predicted Disruption Exposure: Low-to-Moderate (Mitigated)

=================================================================
SYSTEM:
LinkGuard AI Neural Engine v2.0
`;
      mimeType = 'text/plain';
    } else if (format === 'excel') {
      filename = `LinkGuard_${reportType.replace(/\s+/g, '_')}_${timestamp}.csv`;
      const rows = [
        ['Metric', 'Value', 'Status'],
        ['Total Suppliers', suppliers.length, 'Monitored'],
        ['Tier 1 Suppliers', suppliers.filter(s => s.tier === 1).length, 'Active'],
        ['Tier 2 Suppliers', suppliers.filter(s => s.tier === 2).length, 'Active'],
        ['Tier 3 Suppliers', suppliers.filter(s => s.tier === 3).length, 'Vulnerable Path Flagged'],
        ['Tier 4 Suppliers', suppliers.filter(s => s.tier === 4).length, 'Active'],
        ['AI Confidence', '96.2%', 'High Accuracy'],
        ['Blockchain Status', '95% Consensus', 'Verified'],
        ['ESG Average Score', '78 / 100', 'Good']
      ];
      content = 'LinkGuard Supply Chain Intelligence Report\n' + rows.map(r => r.join(',')).join('\n');
      mimeType = 'text/csv';
    } else {
      filename = `LinkGuard_${reportType.replace(/\s+/g, '_')}_${timestamp}.json`;
      content = JSON.stringify({
        system: "LinkGuard AI Supply Chain Intelligence",
        reportType: reportType,
        timestamp: new Date().toISOString(),
        suppliersSummary: {
          total: suppliers.length,
          suppliers: suppliers
        }
      }, null, 2);
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadModalState({ isOpen: false, reportType: '', reportData: null });
    alert(` Report Downloaded Successfully!\nFile: ${filename}\nFormat: ${format.toUpperCase()}`);
  };

  // Supplier inspection & Audit trigger
  const handleSelectSupplier = (s) => {
    setSelectedSupplier(s);
    setIsSupplierModalOpen(true);
  };

  const handleInitiateAudit = (supplierName) => {
    setIsSupplierModalOpen(false);
    triggerExecution(`INITIATING AUTOMATED COMPLIANCE & ESG AUDIT FOR ${supplierName.toUpperCase()}...`, () => {
      alert(` AI Audit for "${supplierName}" completed successfully.\nAll smart contract assertions and ISO certificates verified.`);
    });
  };

  // 1. Render 60fps.fr Themed Landing Page
  if (viewMode === 'landing') {
    return (
      <LandingPage
        onLaunchPlatform={() => setViewMode('app')}
      />
    );
  }

  // 2. If in 'app' mode and not logged in, render the Login screen
  if (!currentUser) {
    return (
      <>
        <Login
          onLoginSuccess={handleLoginSuccess}
          onStartExecution={triggerExecution}
          onBackToLanding={() => setViewMode('landing')}
        />
        <ExecutionOverlay
          isVisible={executionState.isVisible}
          text={executionState.text}
          onSave={handleExecutionSave}
          onExit={handleExecutionExit}
        />
        <div
          className="fps-global-cursor-dot"
          style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
        />
        <div
          className="fps-global-cursor-ring"
          style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
        />
      </>
    );
  }

  // 3. Logged-in Dashboard
  return (
    <div className="container" style={{ position: 'relative' }}>
      {/* React Bits Ambient Background Waves */}
      <Waves
        lineColor="rgba(217, 186, 132, 0.18)"
        backgroundColor="transparent"
        waveSpeedX={0.012}
        waveSpeedY={0.006}
        waveAmpX={34}
        waveAmpY={16}
        xGap={16}
        yGap={36}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0
        }}
      />

      {/* Header with return to 60fps landing page option */}
      <Header
        user={currentUser}
        onLogout={handleLogout}
        onShowLanding={() => setViewMode('landing')}
        onOpenDashAnalytics={() => window.open('http://localhost:3000', '_blank')}
      />

      {/* Real-Time Supply Chain Status Monitor */}
      <RealTimeMonitor />

      {/* Management Cards (Grid: Equipment Registration + Supplier Intelligence) */}
      <div className="main-content">
        <EquipmentRegistration onRegisterEquipment={handleRegisterEquipment} userRole={currentUser.userType} />
        <SupplierIntelligenceForm onAddSupplier={handleAddSupplier} userRole={currentUser.userType} />
      </div>

      {/* AI Predictive Insights */}
      <AiPredictiveInsights />

      {/* 10 Core Application Tabs */}
      <div className="card full-width">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'mapping' ? 'active' : ''}`}
            onClick={() => setActiveTab('mapping')}
          >
            <Network size={16} /> Auto Tier Mapping
          </button>
          <button
            className={`tab ${activeTab === 'delay-prediction' ? 'active' : ''}`}
            onClick={() => setActiveTab('delay-prediction')}
          >
            <Clock size={16} /> Delay Prediction
          </button>
          <button
            className={`tab ${activeTab === 'accountability' ? 'active' : ''}`}
            onClick={() => setActiveTab('accountability')}
          >
            <Shield size={16} /> Accountability Ledger
          </button>
          <button
            className={`tab ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <Warehouse size={16} /> Inventory Storage
          </button>
          <button
            className={`tab ${activeTab === 'logistics' ? 'active' : ''}`}
            onClick={() => setActiveTab('logistics')}
          >
            <Compass size={16} /> Logistics & 3D Globe
          </button>
          <button
            className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            <BarChart3 size={16} /> Risk Analysis
          </button>
          <button
            className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            <Lightbulb size={16} /> AI Recommendations
          </button>
          <button
            className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <FileText size={16} /> Advanced Reports
          </button>
          <button
            className={`tab ${activeTab === 'blockchain' ? 'active' : ''}`}
            onClick={() => setActiveTab('blockchain')}
          >
            <Link2 size={16} /> Blockchain Verification
          </button>
          <button
            className={`tab ${activeTab === 'coalition' ? 'active' : ''}`}
            onClick={() => setActiveTab('coalition')}
          >
            <Globe size={16} /> Coalition Trust
          </button>
          <button
            className={`tab ${activeTab === 'sustainability' ? 'active' : ''}`}
            onClick={() => setActiveTab('sustainability')}
          >
            <Leaf size={16} /> Sustainability
          </button>
          <button
            className={`tab ${activeTab === 'synthetic' ? 'active' : ''}`}
            onClick={() => setActiveTab('synthetic')}
          >
            <Database size={16} /> Data Access
          </button>
          <button
            className={`tab ${activeTab === 'contracts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contracts')}
          >
            <FileSignature size={16} /> Contracts
          </button>
          <button
            className={`tab ${activeTab === 'ai-assistant' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-assistant')}
          >
            <Bot size={16} /> AI Assistant
          </button>
          <button
            className={`tab ${activeTab === 'ml-training' ? 'active' : ''}`}
            onClick={() => setActiveTab('ml-training')}
          >
            <Brain size={16} /> ML Training
          </button>
          <button
            className={`tab ${activeTab === 'db-viewer' ? 'active' : ''}`}
            onClick={() => setActiveTab('db-viewer')}
          >
            <Database size={16} /> DB Viewer
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'mapping' && (
          <AutomaticTierMapping
            suppliers={suppliers}
            onSelectSupplier={handleSelectSupplier}
            onTriggerExecution={triggerExecution}
          />
        )}

        {activeTab === 'delay-prediction' && (
          <DelayPredictionTab
            onTriggerExecution={triggerExecution}
          />
        )}

        {activeTab === 'accountability' && (
          <DigitalAccountabilityTab
            currentUser={currentUser}
            onTriggerExecution={triggerExecution}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryStorageTab
            onTriggerExecution={triggerExecution}
            userRole={currentUser.userType}
          />
        )}

        {activeTab === 'logistics' && (
          <LogisticRouteTab
            onTriggerExecution={triggerExecution}
          />
        )}

        {activeTab === 'analysis' && (
          <RiskAnalysisTab suppliers={suppliers} />
        )}

        {activeTab === 'recommendations' && (
          <AiRecommendationsTab
            onGenerateActionPlan={() => {
              triggerExecution('COMPILING STRATEGIC AI ACTION PLAN & SCENARIO BLUEPRINTS...', () => {
                setDownloadModalState({
                  isOpen: true,
                  reportType: 'AI Strategic Action Plan',
                  reportData: { pages: 47, accuracy: 96 }
                });
              });
            }}
          />
        )}

        {activeTab === 'reports' && (
          <AdvancedReportsTab
            onExportReport={(reportTitle, format) => {
              triggerExecution(`EXPORTING "${reportTitle.toUpperCase()}" IN ${format.toUpperCase()} FORMAT...`, () => {
                setDownloadModalState({
                  isOpen: true,
                  reportType: reportTitle,
                  reportData: { format: format }
                });
              });
            }}
          />
        )}

        {activeTab === 'blockchain' && (
          <BlockchainVerificationTab
            userRole={currentUser?.userType || 'viewer'}
            userName={currentUser?.username}
            onStartExecution={triggerExecution}
            onDeployContract={() => {
              triggerExecution('DEPLOYING SMART CONTRACT TO DECENTRALIZED NETWORK...', () => {
                alert(' Smart Contract successfully deployed at address 0x742d35Cc6634C0532925a3b8D4C0d8b3f8e7f1a2');
              });
            }}
            onTraceComponent={() => {
              triggerExecution('QUERYING IMMUTABLE PROVENANCE FOR CRITICAL RADAR MODULE...', () => {
                alert(' Component Trace Complete:\nMined in Australia ➔ Processed in Japan ➔ Assembled in India ➔ Quality Verified.');
              });
            }}
          />
        )}

        {activeTab === 'coalition' && (
          <CoalitionTrustTab onStartExecution={triggerExecution} />
        )}

        {activeTab === 'sustainability' && (
          <SustainabilityTab
            userRole={currentUser.userType}
            onGenerateEsgReport={() => {
              triggerExecution('GENERATING ESG SUSTAINABILITY & EMISSIONS AUDIT...', () => {
                setDownloadModalState({
                  isOpen: true,
                  reportType: 'ESG Sustainability Assessment Report',
                  reportData: { score: 78 }
                });
              });
            }}
            onAssessSuppliers={() => {
              triggerExecution('ASSESSING TIER-LEVEL DECARBONIZATION RATINGS...', () => {
                alert(' ESG Assessment Complete: 12 High-Performing Suppliers Identified.');
              });
            }}
            onCalculateFootprint={() => {
              triggerExecution('CALCULATING ANNUAL SUPPLY CHAIN CO2e EMISSIONS...', () => {
                alert(' Total Annual Emissions: 2,847 tons CO2e.\nPotential reduction of 45% achievable via renewable route shifts.');
              });
            }}
          />
        )}

        {activeTab === 'synthetic' && (
          <SyntheticDataTab onStartExecution={triggerExecution} userRole={currentUser.userType} />
        )}

        {activeTab === 'contracts' && (
          <ContractsTab onStartExecution={triggerExecution} userRole={currentUser.userType} />
        )}

        {activeTab === 'ai-assistant' && (
          <AiAssistantTab onStartExecution={triggerExecution} />
        )}

        {activeTab === 'db-viewer' && (
          <DatabaseViewerTab />
        )}

        {activeTab === 'ml-training' && (
          <MlTrainingTab
            userRole={currentUser.userType}
            onStartExecution={triggerExecution}
            onShowDownload={(title, data) => {
              setDownloadModalState({
                isOpen: true,
                reportType: title,
                reportData: data
              });
            }}
          />
        )}
      </div>



      {/* Floating AI Assistant Drawer */}
      <AiAssistantDrawer
        isOpen={isAiDrawerOpen}
        onToggle={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
      />

      {/* Supplier Modal */}
      <SupplierModal
        supplier={selectedSupplier}
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        onInitiateAudit={handleInitiateAudit}
      />

      {/* Download Popup */}
      <DownloadPopup
        isOpen={downloadModalState.isOpen}
        reportType={downloadModalState.reportType}
        reportData={downloadModalState.reportData}
        onClose={() => setDownloadModalState({ isOpen: false, reportType: '', reportData: null })}
        onDownload={handleDownloadReport}
      />

      {/* Execution Overlay */}
      <ExecutionOverlay
        isVisible={executionState.isVisible}
        text={executionState.text}
        onSave={handleExecutionSave}
        onExit={handleExecutionExit}
      />

      {/* 60fps Themed Footer */}
      <footer className="footer">
        <div className="developer-info">LINKGUARD DEFENSE INTELLIGENCE PLATFORM // LEVEL 4</div>
        <div className="developer-contact">
          NATO NCAGE • CMMC LEVEL 3 • NIST SP 800-161 • SHA-256 ZERO-KNOWLEDGE PROOFS
        </div>
      </footer>

      {/* Global 60fps Cursor Follower */}
      <div
        className="fps-global-cursor-dot"
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
      />
      <div
        className="fps-global-cursor-ring"
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
      />
    </div>
  );
}

export default App;
