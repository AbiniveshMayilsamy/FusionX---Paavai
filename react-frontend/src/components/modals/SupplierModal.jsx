import React from 'react';
import { X, Building2, Globe, ShieldAlert, CheckCircle, BarChart3, Users, Award, Zap } from 'lucide-react';

export function SupplierModal({ supplier, isOpen, onClose, onInitiateAudit }) {
  if (!isOpen || !supplier) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <h2 style={{ borderBottom: '1px solid rgba(255,215,0,0.3)', paddingBottom: '12px' }}>
          <Building2 size={24} style={{ color: '#ffd700' }} />
          {supplier.name}
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '18px',
          margin: '22px 0',
          fontSize: '0.92rem'
        }}>
          <div>
            <p style={{ margin: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={16} style={{ color: '#38bdf8' }} />
              <strong>Country:</strong> {supplier.country}
            </p>
            <p style={{ margin: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={16} style={{ color: supplier.risk === 'Critical' ? '#ef4444' : supplier.risk === 'Medium' ? '#f59e0b' : '#10b981' }} />
              <strong>Risk Level:</strong> <span style={{ fontWeight: 700, color: supplier.risk === 'Critical' ? '#ef4444' : supplier.risk === 'Medium' ? '#f59e0b' : '#10b981' }}>{supplier.risk}</span>
            </p>
            <p style={{ margin: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={16} style={{ color: '#ffd700' }} />
              <strong>Reliability:</strong> {supplier.reliability}
            </p>
            <p style={{ margin: '8px 0' }}>
              <strong>Annual Revenue:</strong> {supplier.revenue || '$280M'}
            </p>
            <p style={{ margin: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} style={{ color: '#a78bfa' }} />
              <strong>Employees:</strong> {supplier.employees || '1,800'}
            </p>
          </div>

          <div>
            <p style={{ margin: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={16} style={{ color: '#fbbf24' }} />
              <strong>Certifications:</strong> {supplier.certifications || 'ISO 9001:2015'}
            </p>
            <p style={{ margin: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} style={{ color: '#10b981' }} />
              <strong>Blockchain Status:</strong> {supplier.blockchain}
            </p>
            <p style={{ margin: '8px 0' }}>
              <strong>Sustainability:</strong> {supplier.sustainability}
            </p>
            <p style={{ margin: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} style={{ color: '#34d399' }} />
              <strong>AI Confidence:</strong> {supplier.aiScore || '92%'}
            </p>
          </div>
        </div>

        <button
          className="btn"
          onClick={() => onInitiateAudit(supplier.name)}
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff' }}
        >
          <ShieldAlert size={18} />
          Initiate Real-Time AI & Compliance Audit
        </button>
      </div>
    </div>
  );
}
