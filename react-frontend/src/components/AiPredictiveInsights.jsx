import React from 'react';
import { Bot, TrendingUp, AlertTriangle, DollarSign, BrainCircuit } from 'lucide-react';
import { ShinyText } from './react-bits';

export function AiPredictiveInsights() {
  return (
    <div className="card full-width">
      <div className="ai-insights">
        <h2>
          <BrainCircuit size={22} style={{ color: 'var(--primary-gold)' }} />
          <ShinyText text="Neural Predictive Analytics & Defense Insights" color="var(--primary-gold)" shineColor="#ffffff" />
        </h2>
        <div className="predictive-grid">
          <div className="predictive-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <TrendingUp size={16} style={{ color: '#10b981' }} />
              <h4>Demand Vector Forecasting</h4>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.88rem' }}>
              AI models predict a <strong style={{ color: 'var(--primary-gold)' }}>23% surge</strong> in aerospace avionics & radar component demand for Q4.
            </p>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: '75%', background: '#10b981' }}
              ></div>
            </div>
          </div>

          <div className="predictive-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <AlertTriangle size={16} style={{ color: '#ef4444' }} />
              <h4>Maritime & Chokepoint Risk</h4>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.88rem' }}>
              High-contingency bottleneck detected across Tier 3 rare-earth mineral transit routes (Malacca Strait).
            </p>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: '85%', background: 'linear-gradient(90deg, #ef4444, #dc2626)' }}
              ></div>
            </div>
          </div>

          <div className="predictive-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <DollarSign size={16} style={{ color: 'var(--primary-gold)' }} />
              <h4>Allied Procurement Optimization</h4>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.88rem' }}>
              Autonomous re-routing via NATO-compliant allied domestic foundries yields <strong style={{ color: 'var(--primary-gold)' }}>15% net efficiency</strong>.
            </p>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: '60%', background: 'linear-gradient(90deg, #d9ba84, #f3e6cf)' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
