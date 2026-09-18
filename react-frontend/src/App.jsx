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
  Brain
} from 'lucide-react';

import { INITIAL_SUPPLIERS } from './data/suppliersData';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { RealTimeMonitor } from './components/RealTimeMonitor';
import { EquipmentRegistration } from './components/EquipmentRegistration';
import { SupplierIntelligenceForm } from './components/SupplierIntelligenceForm';
import { AiPredictiveInsights } from './components/AiPredictiveInsights';

// Tabs
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

// Modals
import { ExecutionOverlay } from './components/modals/ExecutionOverlay';
import { SupplierModal } from './components/modals/SupplierModal';
import { DownloadPopup } from './components/modals/DownloadPopup';
import { AiAssistantDrawer } from './components/modals/AiAssistantDrawer';

export function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);

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
      alert(`🏭 Supplier "${newSup.name}" has been verified and registered into Tier ${newSup.tier}.`);
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
    alert(`📥 Report Downloaded Successfully!\nFile: ${filename}\nFormat: ${format.toUpperCase()}`);
  };

  // Supplier inspection & Audit trigger
  const handleSelectSupplier = (s) => {
    setSelectedSupplier(s);
    setIsSupplierModalOpen(true);
  };

  const handleInitiateAudit = (supplierName) => {
    setIsSupplierModalOpen(false);
    triggerExecution(`INITIATING AUTOMATED COMPLIANCE & ESG AUDIT FOR ${supplierName.toUpperCase()}...`, () => {
      alert(`🔍 AI Audit for "${supplierName}" completed successfully.\nAll smart contract assertions and ISO certificates verified.`);
    });
  };

  // If not logged in, render the Login screen
  if (!currentUser) {
    return (
      <>
        <Login
          onLoginSuccess={handleLoginSuccess}
          onStartExecution={triggerExecution}
        />
        <ExecutionOverlay
          isVisible={executionState.isVisible}
          text={executionState.text}
          onSave={handleExecutionSave}
          onExit={handleExecutionExit}
        />
      </>
    );
  }

  // Logged-in Dashboard
  return (
    <div className="container">
      {/* Header */}
      <Header user={currentUser} onLogout={handleLogout} />

      {/* Real-Time Supply Chain Status Monitor */}
      <RealTimeMonitor />

      {/* Management Cards (Grid: Equipment Registration + Supplier Intelligence) */}
      <div className="main-content">
        <EquipmentRegistration onRegisterEquipment={handleRegisterEquipment} />
        <SupplierIntelligenceForm onAddSupplier={handleAddSupplier} />
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
            <Map size={16} /> 🗺️ Supply Chain Mapping
          </button>
          <button
            className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            <BarChart3 size={16} /> 📈 Risk Analysis
          </button>
          <button
            className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            <Lightbulb size={16} /> 💡 AI Recommendations
          </button>
          <button
            className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <FileText size={16} /> 📋 Advanced Reports
          </button>
          <button
            className={`tab ${activeTab === 'blockchain' ? 'active' : ''}`}
            onClick={() => setActiveTab('blockchain')}
          >
            <Link2 size={16} /> ⛓️ Blockchain Verification
          </button>
          <button
            className={`tab ${activeTab === 'sustainability' ? 'active' : ''}`}
            onClick={() => setActiveTab('sustainability')}
          >
            <Leaf size={16} /> 🌱 Sustainability
          </button>
          <button
            className={`tab ${activeTab === 'synthetic' ? 'active' : ''}`}
            onClick={() => setActiveTab('synthetic')}
          >
            <Database size={16} /> 📊 Data Access
          </button>
          <button
            className={`tab ${activeTab === 'contracts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contracts')}
          >
            <FileSignature size={16} /> 📋 Contracts
          </button>
          <button
            className={`tab ${activeTab === 'ai-assistant' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-assistant')}
          >
            <Bot size={16} /> 🤖 AI Assistant
          </button>
          <button
            className={`tab ${activeTab === 'ml-training' ? 'active' : ''}`}
            onClick={() => setActiveTab('ml-training')}
          >
            <Brain size={16} /> 🧠 ML Training
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'mapping' && (
          <SupplyChainMappingTab
            suppliers={suppliers}
            onSelectSupplier={handleSelectSupplier}
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
            onInitiateVerification={() => {
              triggerExecution('VERIFYING CRYPTOGRAPHIC LEDGER HASHS & CONSENSUS...', () => {
                alert('⛓️ Blockchain Verification Complete: 23 suppliers verified on ledger.');
              });
            }}
            onDeployContract={() => {
              triggerExecution('DEPLOYING SMART CONTRACT TO DECENTRALIZED NETWORK...', () => {
                alert('📋 Smart Contract successfully deployed at address 0x742d35Cc6634C0532925a3b8D4C0d8b3f8e7f1a2');
              });
            }}
            onTraceComponent={() => {
              triggerExecution('QUERYING IMMUTABLE PROVENANCE FOR CRITICAL RADAR MODULE...', () => {
                alert('🔎 Component Trace Complete:\nMined in Australia ➔ Processed in Japan ➔ Assembled in India ➔ Quality Verified.');
              });
            }}
          />
        )}

        {activeTab === 'sustainability' && (
          <SustainabilityTab
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
                alert('🌱 ESG Assessment Complete: 12 High-Performing Suppliers Identified.');
              });
            }}
            onCalculateFootprint={() => {
              triggerExecution('CALCULATING ANNUAL SUPPLY CHAIN CO2e EMISSIONS...', () => {
                alert('🌍 Total Annual Emissions: 2,847 tons CO2e.\nPotential reduction of 45% achievable via renewable route shifts.');
              });
            }}
          />
        )}

        {activeTab === 'synthetic' && (
          <SyntheticDataTab onStartExecution={triggerExecution} />
        )}

        {activeTab === 'contracts' && (
          <ContractsTab onStartExecution={triggerExecution} />
        )}

        {activeTab === 'ai-assistant' && (
          <AiAssistantTab onStartExecution={triggerExecution} />
        )}

        {activeTab === 'ml-training' && (
          <MlTrainingTab
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
    </div>
  );
}

export default App;
