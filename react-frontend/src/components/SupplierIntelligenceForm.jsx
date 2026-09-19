import React, { useState } from 'react';
import { Globe, UserPlus, ShieldCheck } from 'lucide-react';
import { ShinyText } from './react-bits';

export function SupplierIntelligenceForm({ onAddSupplier, userRole = 'viewer' }) {
  const isAdmin = userRole === 'admin';
  const [supplierName, setSupplierName] = useState('');
  const [supplierCountry, setSupplierCountry] = useState('');
  const [ownershipDetails, setOwnershipDetails] = useState('');
  const [tierLevel, setTierLevel] = useState('2');
  const [geopoliticalRisk, setGeopoliticalRisk] = useState('low');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!supplierName.trim() || !supplierCountry.trim()) {
      alert('⚠️ Please provide supplier name and country for AI verification.');
      return;
    }

    onAddSupplier({
      name: supplierName.trim(),
      country: supplierCountry.trim(),
      ownership: ownershipDetails.trim(),
      tier: parseInt(tierLevel),
      geopoliticalRisk: geopoliticalRisk
    });

    // Reset fields
    setSupplierName('');
    setSupplierCountry('');
    setOwnershipDetails('');
  };

  return (
    <div className="card">
      <h2>
        <Globe size={22} style={{ color: 'var(--primary-gold)' }} />
        <ShinyText text="Enhanced Supplier Intelligence" color="var(--primary-gold)" shineColor="#ffffff" />
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="supplierName">Supplier Organization Name</label>
          <input
            id="supplierName"
            type="text"
            placeholder="e.g., Nordic Avionics Corp"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="supplierCountry">Country of Origin</label>
          <input
            id="supplierCountry"
            type="text"
            placeholder="e.g., India, USA, Germany, Japan"
            value={supplierCountry}
            onChange={(e) => setSupplierCountry(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="ownershipDetails">Ownership Details (% Holdings / Board of Directors)</label>
          <textarea
            id="ownershipDetails"
            rows="2"
            placeholder="State Owned Enterprises, foreign holding equity %..."
            value={ownershipDetails}
            onChange={(e) => setOwnershipDetails(e.target.value)}
          ></textarea>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="input-group">
            <label htmlFor="tierLevel">Supplier Tier</label>
            <select
              id="tierLevel"
              value={tierLevel}
              onChange={(e) => setTierLevel(e.target.value)}
            >
              <option value="1">Tier 1 (Direct)</option>
              <option value="2">Tier 2</option>
              <option value="3">Tier 3</option>
              <option value="4">Tier 4 (Raw Materials)</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="geopoliticalRisk">Geopolitical Risk</label>
            <select
              id="geopoliticalRisk"
              value={geopoliticalRisk}
              onChange={(e) => setGeopoliticalRisk(e.target.value)}
            >
              <option value="low"> Low Risk</option>
              <option value="medium"> Medium Risk</option>
              <option value="high"> High Risk</option>
              <option value="critical"> Critical Risk</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn" disabled={!isAdmin} title={!isAdmin ? 'Admin access required' : ''}>
          <UserPlus size={18} />
          <ShinyText text={isAdmin ? 'Add Supplier with AI Verification' : 'Read-Only — Admin Required'} color="#060709" shineColor="#ffffff" speed={2.5} />
        </button>
        {!isAdmin && (
          <p style={{ fontSize: '0.78rem', color: '#f59e0b', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>
            ⚠ Adding suppliers requires Admin clearance.
          </p>
        )}
      </form>
    </div>
  );
}
