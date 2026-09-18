import React, { useState } from 'react';
import { Cpu, Search, Sparkles } from 'lucide-react';

export function EquipmentRegistration({ onRegisterEquipment }) {
  const [equipmentName, setEquipmentName] = useState('Advanced Radar System');
  const [equipmentType, setEquipmentType] = useState('electronics');
  const [criticalityLevel, setCriticalityLevel] = useState('critical');
  const [aiRiskPrediction, setAiRiskPrediction] = useState('enabled');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!equipmentName.trim()) {
      alert('⚠️ Please enter an equipment or component name.');
      return;
    }

    onRegisterEquipment({
      name: equipmentName,
      type: equipmentType,
      criticality: criticalityLevel,
      aiEnabled: aiRiskPrediction === 'enabled'
    });
  };

  return (
    <div className="card">
      <h2>
        <Cpu size={22} style={{ color: '#ffd700' }} />
        Advanced Equipment Registration
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="equipmentName">Equipment / Component Name</label>
          <input
            id="equipmentName"
            type="text"
            placeholder="e.g., Advanced Radar System"
            value={equipmentName}
            onChange={(e) => setEquipmentName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="equipmentType">Equipment Type</label>
          <select
            id="equipmentType"
            value={equipmentType}
            onChange={(e) => setEquipmentType(e.target.value)}
          >
            <option value="weapon">🔫 Weapon System</option>
            <option value="electronics">📡 Electronics</option>
            <option value="vehicle">🚗 Vehicle Component</option>
            <option value="communication">📻 Communication Equipment</option>
            <option value="armor">🛡️ Armor & Protection</option>
            <option value="cyber">💻 Cyber Security</option>
            <option value="aerospace">✈️ Aerospace</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="criticalityLevel">Criticality Level</label>
          <select
            id="criticalityLevel"
            value={criticalityLevel}
            onChange={(e) => setCriticalityLevel(e.target.value)}
          >
            <option value="critical">🔴 Critical</option>
            <option value="high">🟠 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="aiRiskPrediction">AI Risk Prediction Mode</label>
          <select
            id="aiRiskPrediction"
            value={aiRiskPrediction}
            onChange={(e) => setAiRiskPrediction(e.target.value)}
          >
            <option value="enabled">🤖 Enable AI Multi-Tier Analysis</option>
            <option value="disabled">Manual Assessment Only</option>
          </select>
        </div>

        <button type="submit" className="btn">
          <Search size={18} />
          AI-Powered Supply Chain Mapping
        </button>
      </form>
    </div>
  );
}
