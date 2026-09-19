import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, Shield, Sparkles } from 'lucide-react';

export function AdvancedReportsTab({ onExportReport }) {
  const [reportType, setReportType] = useState('vulnerability');
  const [reportFormat, setReportFormat] = useState('pdf');

  const reportNamesMap = {
    vulnerability: 'AI Vulnerability Assessment Report',
    supplier: 'Comprehensive Supplier Risk Analysis',
    alternative: 'Alternative Supplier Recommendations',
    compliance: 'Compliance & Ownership Audit Report',
    geopolitical: 'Geopolitical Risk Assessment',
    predictive: 'Predictive Analytics Report',
    blockchain: 'Blockchain Verification Status'
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    const title = reportNamesMap[reportType] || 'Supply Chain Analysis';
    onExportReport(title, reportFormat);
  };

  return (
    <div className="tab-content">
      <h2>
        <FileText size={22} style={{ color: 'var(--primary-gold)' }} />
        Advanced Supply Chain Analytics & Reports
      </h2>

      <form onSubmit={handleGenerate} style={{ maxWidth: '600px', margin: '20px 0' }}>
        <div className="input-group">
          <label htmlFor="reportType">Report Classification</label>
          <select
            id="reportType"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="vulnerability"> AI Vulnerability Assessment Report</option>
            <option value="supplier"> Comprehensive Supplier Risk Analysis</option>
            <option value="alternative"> Alternative Supplier Recommendations</option>
            <option value="compliance"> Compliance & Ownership Audit Report</option>
            <option value="geopolitical"> Geopolitical Risk Assessment</option>
            <option value="predictive"> Predictive Analytics Report</option>
            <option value="blockchain">⛓️ Blockchain Verification Status</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="reportFormat">Export Delivery Format</label>
          <select
            id="reportFormat"
            value={reportFormat}
            onChange={(e) => setReportFormat(e.target.value)}
          >
            <option value="pdf"> Executive Formatted Document (.txt / printable)</option>
            <option value="excel"> Excel Analytics Dashboard (.csv)</option>
            <option value="json"> Structured Machine Data (.json)</option>
            <option value="powerbi"> Power BI Integration Package</option>
            <option value="blockchain">⛓️ Cryptographic Blockchain Certificate</option>
          </select>
        </div>

        <button type="submit" className="btn">
          <Download size={18} />
          Generate & Export Advanced Report
        </button>
      </form>

      <div className="results-panel">
        <h3>Recent AI Analysis Results & Audit Logs</h3>
        <div style={{ color: '#cbd5e1', fontSize: '0.92rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p>•  <strong>AI Analysis:</strong> Advanced Radar System - Risk Level: High (Confidence: 94%)</p>
          <p>•  <strong>Critical Path Analysis:</strong> Tier 3 → Tier 2 → Tier 1 vulnerability chain identified</p>
          <p>•  <strong>Alternative Suppliers:</strong> 7 AI-verified options found across 4 sovereign allied countries</p>
          <p>• ⛓️ <strong>Blockchain Consensus:</strong> 95% supply chain authenticated with multi-signature validation</p>
          <p>•  <strong>Geopolitical Assessment:</strong> 3 medium-risk trading channels flagged for auto-rerouting</p>
          <p>•  <strong>Predictive Model Accuracy:</strong> 96.2% precision benchmark achieved</p>
        </div>
      </div>
    </div>
  );
}
