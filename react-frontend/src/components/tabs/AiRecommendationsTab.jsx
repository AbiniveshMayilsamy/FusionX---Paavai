import React from 'react';
import { Lightbulb, Target, Network, ShieldCheck, FileCheck } from 'lucide-react';

export function AiRecommendationsTab({ onGenerateActionPlan }) {
  return (
    <div className="tab-content">
      <h2>
        <Lightbulb size={22} style={{ color: '#ffd700' }} />
        AI-Generated Strategic Recommendations
      </h2>

      <div className="recommendation-item">
        <h4>
          <Target size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          Primary AI Recommendation (Confidence: 96%)
        </h4>
        <p><strong>Action:</strong> Immediate diversification of rare earth material suppliers</p>
        <p><strong>Alternative Suppliers Identified:</strong> 3 verified options across Australia, Canada, India</p>
        <p><strong>Implementation Timeline:</strong> 4-8 months</p>
        <p><strong>Predicted Risk Reduction:</strong> 67% vulnerability mitigation</p>
        <p><strong>Cost Impact:</strong> +12% initial setup, -8% long-term operational savings</p>
      </div>

      <div className="recommendation-item" style={{ borderLeftColor: '#38bdf8', background: 'rgba(56, 189, 248, 0.08)' }}>
        <h4 style={{ color: '#38bdf8' }}>
          <Network size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          Secondary Strategic Consortium (Confidence: 89%)
        </h4>
        <p><strong>Strategic Partnership:</strong> Establish allied tri-nation defense supply consortium (India-Australia-Japan)</p>
        <p><strong>Benefits:</strong> Guaranteed quota allocations, political stability, standardized AS9100 quality</p>
        <p><strong>Investment Required:</strong> $2.5M initial integration</p>
        <p><strong>ROI Timeline:</strong> 18 months payback</p>
      </div>

      <div className="recommendation-item" style={{ borderLeftColor: '#fbbf24', background: 'rgba(251, 191, 36, 0.08)' }}>
        <h4 style={{ color: '#fbbf24' }}>
          <ShieldCheck size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          Advanced Autonomous Risk Mitigation Strategy
        </h4>
        <p><strong>AI-Optimized Buffer Stock:</strong> Dynamic predictive inventory balancing based on weather & maritime alerts.</p>
        <p><strong>Smart Monitoring:</strong> IoT sensor tracking with blockchain cryptographic seal verification.</p>
        <p><strong>Automated Fallback:</strong> Zero-downtime supplier switching protocol triggered upon critical SLA breach.</p>
      </div>

      <button className="btn" onClick={onGenerateActionPlan} style={{ marginTop: '20px' }}>
        <FileCheck size={18} />
        Generate AI-Powered Action Plan Document
      </button>
    </div>
  );
}
