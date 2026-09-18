import React from 'react';
import { Bot, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';

export function AiPredictiveInsights() {
  return (
    <div className="card full-width">
      <div className="ai-insights">
        <h2>
          <Bot size={24} style={{ color: '#ffd700' }} />
          AI-Powered Predictive Insights
        </h2>
        <div className="predictive-grid">
          <div className="predictive-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <TrendingUp size={18} style={{ color: '#10b981' }} />
              <h4>Demand Forecasting</h4>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
              AI models forecast a <strong>23% increase</strong> in aerospace & electronics demand next quarter.
            </p>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: '75%', background: 'linear-gradient(90deg, #059669, #10b981)' }}
              ></div>
            </div>
          </div>

          <div className="predictive-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <AlertTriangle size={18} style={{ color: '#ef4444' }} />
              <h4>Disruption Risk</h4>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
              Potential bottleneck detected in Tier 3 rare mineral routes (East Asia & Congo regions).
            </p>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: '85%', background: 'linear-gradient(90deg, #dc2626, #ef4444)' }}
              ></div>
            </div>
          </div>

          <div className="predictive-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <DollarSign size={18} style={{ color: '#f59e0b' }} />
              <h4>Cost Optimization</h4>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
              Alternative sourcing via allied multi-nation hubs can achieve <strong>15% net procurement reduction</strong>.
            </p>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: '60%', background: 'linear-gradient(90deg, #d97706, #f59e0b)' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
