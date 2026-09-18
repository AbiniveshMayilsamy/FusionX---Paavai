import React, { useState, useRef, useEffect } from 'react';
import { Brain, Play, CheckCircle2, Award, Zap, Activity } from 'lucide-react';
import { ML_MODELS_DATA } from '../../data/suppliersData';

export function MlTrainingTab({ onStartExecution, onShowDownload }) {
  const [selectedModel, setSelectedModel] = useState('xgboost');
  const [trainedModelData, setTrainedModelData] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const canvasRef = useRef(null);

  const drawChart = (modelData) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 40; x < width - 20; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, height - 30);
      ctx.stroke();
    }
    for (let y = 30; y < height - 30; y += 30) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 20);
    ctx.lineTo(40, height - 30);
    ctx.lineTo(width - 20, height - 30);
    ctx.stroke();

    // Curve
    const epochs = modelData.epochs || 20;
    const points = [];
    const baseAcc = 60;
    const targetAcc = modelData.accuracy;

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let i = 0; i <= epochs; i++) {
      const progress = i / epochs;
      // Exponential convergence curve
      const currentAcc = baseAcc + (targetAcc - baseAcc) * (1 - Math.exp(-progress * 4.5));
      const px = 40 + progress * (width - 70);
      const py = height - 30 - ((currentAcc - 50) / 50) * (height - 60);
      points.push({ x: px, y: py });

      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Fill under curve
    ctx.lineTo(width - 30, height - 30);
    ctx.lineTo(40, height - 30);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.fill();

    // Points
    points.forEach((pt, idx) => {
      if (idx % 3 === 0 || idx === epochs) {
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Label
    ctx.fillStyle = '#f8fafc';
    ctx.font = '12px Outfit, sans-serif';
    ctx.fillText(`Epochs (0 to ${epochs})`, width / 2 - 40, height - 10);
    ctx.fillText(`Peak Accuracy: ${modelData.accuracy}%`, 50, 25);
  };

  const handleTrain = () => {
    setIsTraining(true);
    const model = ML_MODELS_DATA[selectedModel];

    onStartExecution(`TRAINING ${model.name.toUpperCase()} WITH 10,000+ MULTI-TIER DATA SAMPLES...`, () => {
      setTrainedModelData(model);
      setIsTraining(false);
      setTimeout(() => {
        drawChart(model);
        onShowDownload('ML Model Training Report', model);
      }, 200);
    });
  };

  useEffect(() => {
    if (trainedModelData) {
      drawChart(trainedModelData);
    }
  }, [trainedModelData]);

  return (
    <div className="tab-content">
      <h2>
        <Brain size={22} style={{ color: '#ffd700' }} />
        Machine Learning Model Training & Optimization
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', margin: '20px 0' }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '1.2rem' }}>📊 Algorithm Architecture Selection</h3>
          <div className="input-group">
            <label htmlFor="modelType">Select Neural / Statistical Model:</label>
            <select
              id="modelType"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="xgboost">XGBoost (Recommended - Best Accuracy & Speed)</option>
              <option value="random_forest">Random Forest (Multi-Tree Ensemble)</option>
              <option value="neural_network">Deep Neural Network (High Dimensional)</option>
            </select>
          </div>

          <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: '12px 0' }}>
            {ML_MODELS_DATA[selectedModel].description}
          </p>

          <button className="btn" onClick={handleTrain} disabled={isTraining}>
            <Play size={18} />
            {isTraining ? 'Training Model...' : 'Start Training & Evaluation'}
          </button>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '1.2rem' }}>📈 Real-Time Model Performance</h3>
          {trainedModelData ? (
            <div>
              <div className="stats-grid" style={{ margin: '10px 0 16px 0', gridTemplateColumns: '1fr 1fr' }}>
                <div className="stat-card" style={{ padding: '12px' }}>
                  <div className="stat-value" style={{ fontSize: '1.8rem', color: '#10b981' }}>{trainedModelData.accuracy}%</div>
                  <div className="stat-label">Model Accuracy</div>
                </div>
                <div className="stat-card" style={{ padding: '12px' }}>
                  <div className="stat-value" style={{ fontSize: '1.8rem', color: '#38bdf8' }}>{trainedModelData.precision}%</div>
                  <div className="stat-label">Precision Score</div>
                </div>
              </div>

              <canvas
                ref={canvasRef}
                width={360}
                height={200}
                style={{
                  width: '100%',
                  background: 'rgba(5, 10, 20, 0.7)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 215, 0, 0.2)'
                }}
              />
            </div>
          ) : (
            <div style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', padding: '40px 20px' }}>
              Select an algorithm and click <strong>"Start Training"</strong> to visualize the epoch convergence curve and validation metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
