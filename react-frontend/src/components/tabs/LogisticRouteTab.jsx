import React, { useState } from 'react';
import { 
  Globe, 
  Compass, 
  AlertTriangle, 
  Ship, 
  Plane, 
  Truck, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  RefreshCw, 
  ShieldCheck, 
  Anchor,
  Navigation
} from 'lucide-react';
import { LogisticGlobe, DEFENSE_HUBS, CHOKEPOINTS } from '../globe/LogisticGlobe';
import { ShinyText } from '../react-bits';

export function LogisticRouteTab({ onTriggerExecution }) {
  const [routes, setRoutes] = useState([
    {
      id: 'RTE-IND-EU',
      name: 'Eurasian High-Tech Corridor',
      origin: 'Bengaluru, India',
      destination: 'Frankfurt, Germany',
      mode: 'Air Cargo Express',
      distanceKm: '7,400 km',
      baseDays: 3.5,
      currentRisk: 'LOW (0.15)',
      chokepoint: 'None (Direct Eurasian Overflight)',
      status: 'NORMAL_TRANSIT',
      rerouted: false
    },
    {
      id: 'RTE-CGO-SGP',
      name: 'Central African Mineral Lane',
      origin: 'Kolwezi, Congo',
      destination: 'Singapore Port Hub',
      mode: 'Maritime Freight',
      distanceKm: '11,200 km (6,050 nm)',
      baseDays: 24.0,
      currentRisk: 'CRITICAL (0.84)',
      chokepoint: 'Bab-el-Mandeb Conflict Zone (+6.5d)',
      status: 'CHOKEPOINT_DELAYED',
      rerouted: false
    },
    {
      id: 'RTE-TWN-IND',
      name: 'Semiconductor Strategic Arterial',
      origin: 'Hsinchu, Taiwan',
      destination: 'Bengaluru, India',
      mode: 'Maritime & Air Hybrid',
      distanceKm: '4,850 km',
      baseDays: 8.0,
      currentRisk: 'MODERATE (0.42)',
      chokepoint: 'Strait of Malacca Congestion (+2.0d)',
      status: 'MODERATE_DELAY',
      rerouted: false
    },
    {
      id: 'RTE-USA-IND',
      name: 'Trans-Atlantic / Pacific Defense Link',
      origin: 'Fort Worth, Texas, USA',
      destination: 'Bengaluru, India',
      mode: 'Strategic Military Airlift',
      distanceKm: '14,600 km',
      baseDays: 4.0,
      currentRisk: 'LOW (0.12)',
      chokepoint: 'None (USAF / IAF Authorized Corridor)',
      status: 'NORMAL_TRANSIT',
      rerouted: false
    }
  ]);

  const [selectedRoute, setSelectedRoute] = useState(routes[1]);

  const handleSimulateReroute = (routeId) => {
    const target = routes.find(r => r.id === routeId);
    if (!target) return;

    const executeReroute = () => {
      setRoutes(prev => prev.map(r => {
        if (r.id === routeId) {
          return {
            ...r,
            rerouted: true,
            status: 'REROUTED_OPTIMIZED',
            chokepoint: 'Bypassed via Cape of Good Hope & Direct Air Lift',
            baseDays: Math.round((r.baseDays * 0.45) * 10) / 10,
            currentRisk: 'LOW (0.20)'
          };
        }
        return r;
      }));
      setSelectedRoute(prev => prev.id === routeId ? {
        ...prev,
        rerouted: true,
        status: 'REROUTED_OPTIMIZED',
        chokepoint: 'Bypassed via Cape of Good Hope & Direct Air Lift',
        baseDays: Math.round((prev.baseDays * 0.45) * 10) / 10,
        currentRisk: 'LOW (0.20)'
      } : prev);
      alert(`Route ${routeId} successfully rerouted. Bottleneck bypassed, transit duration slashed.`);
    };

    if (onTriggerExecution) {
      onTriggerExecution(`OPTIMIZING & REROUTING LOGISTIC CORRIDOR "${target.name.toUpperCase()}"...`, executeReroute);
    } else {
      executeReroute();
    }
  };

  return (
    <div className="tab-content">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2>
          <Globe size={22} style={{ color: 'var(--primary-gold)' }} />
          Logistic Route Management & 3D Tactical Globe
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '850px' }}>
          Interactive 3D geospatial supply route intelligence. Monitors active maritime corridors, strategic air corridors, and international shipping chokepoints with dynamic rerouting capability.
        </p>
      </div>

      {/* 3D Globe + Chokepoint Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', marginBottom: '28px' }}>
        {/* 3D Globe Container */}
        <div>
          <LogisticGlobe />
        </div>

        {/* Chokepoints & Corridor Health Sidebar */}
        <div style={{ background: 'rgba(14, 16, 22, 0.75)', border: '1px solid var(--glass-border)', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Anchor size={16} style={{ color: 'var(--primary-gold)' }} />
              Strategic Maritime Chokepoint Alerts
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {CHOKEPOINTS.map(cp => (
                <div 
                  key={cp.id}
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: `1px solid ${cp.color}55`,
                    borderLeft: `4px solid ${cp.color}`,
                    padding: '10px 14px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>{cp.name}</strong>
                    <span style={{ fontSize: '0.72rem', color: cp.color, fontWeight: 700 }}>
                      {cp.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Coordinates: {cp.lat}&deg;N, {cp.lon}&deg;E &bull; Maritime Chokepoint
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Route Telemetry Card */}
            {selectedRoute && (
              <div style={{ background: 'rgba(217, 186, 132, 0.05)', border: '1px solid rgba(217, 186, 132, 0.3)', padding: '14px' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--primary-gold)', fontWeight: 700, marginBottom: '4px' }}>
                  Active Selected Corridor
                </div>
                <strong style={{ color: '#ffffff', fontSize: '0.95rem', display: 'block', marginBottom: '4px' }}>
                  {selectedRoute.name} ({selectedRoute.id})
                </strong>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '8px' }}>
                  {selectedRoute.origin} &rarr; {selectedRoute.destination}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                  <div>Distance: <span style={{ color: '#ffffff' }}>{selectedRoute.distanceKm}</span></div>
                  <div>Duration: <span style={{ color: 'var(--primary-gold)', fontWeight: 700 }}>{selectedRoute.baseDays} Days</span></div>
                </div>
              </div>
            )}
          </div>

          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '12px' }}>
            Telemetry feed synced with Automated Tier Mapping and Central Defense Logistics.
          </div>
        </div>
      </div>

      {/* Defense Logistics Routes Table */}
      <div style={{ background: 'rgba(14, 16, 22, 0.75)', border: '1px solid var(--glass-border)', padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Navigation size={18} style={{ color: 'var(--primary-gold)' }} />
          Defense Logistics Corridors & Reroute Command Panel
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                <th style={{ padding: '12px 10px' }}>Corridor ID</th>
                <th style={{ padding: '12px 10px' }}>Corridor Name</th>
                <th style={{ padding: '12px 10px' }}>Origin &rarr; Destination</th>
                <th style={{ padding: '12px 10px' }}>Mode</th>
                <th style={{ padding: '12px 10px' }}>Distance / Transit Time</th>
                <th style={{ padding: '12px 10px' }}>Active Chokepoint</th>
                <th style={{ padding: '12px 10px' }}>Status</th>
                <th style={{ padding: '12px 10px', textAlign: 'right' }}>Reroute Action</th>
              </tr>
            </thead>
            <tbody>
              {routes.map(r => {
                const isDelayed = r.status === 'CHOKEPOINT_DELAYED';
                const isRerouted = r.rerouted;

                return (
                  <tr 
                    key={r.id} 
                    onClick={() => setSelectedRoute(r)}
                    style={{ 
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      background: isDelayed ? 'rgba(239, 68, 68, 0.04)' : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <td style={{ padding: '14px 10px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary-gold)' }}>
                      {r.id}
                    </td>

                    <td style={{ padding: '14px 10px', fontWeight: 600, color: '#ffffff' }}>
                      {r.name}
                    </td>

                    <td style={{ padding: '14px 10px', color: '#cbd5e1' }}>
                      {r.origin} &rarr; {r.destination}
                    </td>

                    <td style={{ padding: '14px 10px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}>
                        {r.mode.includes('Air') ? <Plane size={13} style={{ color: '#60a5fa' }} /> : <Ship size={13} style={{ color: '#f59e0b' }} />}
                        {r.mode}
                      </span>
                    </td>

                    <td style={{ padding: '14px 10px' }}>
                      <div>{r.distanceKm}</div>
                      <div style={{ color: 'var(--primary-gold)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{r.baseDays} Days</div>
                    </td>

                    <td style={{ padding: '14px 10px', color: isDelayed ? '#ef4444' : isRerouted ? '#10b981' : '#cbd5e1', fontSize: '0.8rem' }}>
                      {r.chokepoint}
                    </td>

                    <td style={{ padding: '14px 10px' }}>
                      <span style={{
                        background: isRerouted ? 'rgba(16, 185, 129, 0.15)' : isDelayed ? 'rgba(239, 68, 68, 0.15)' : 'rgba(217, 186, 132, 0.15)',
                        border: `1px solid ${isRerouted ? '#10b981' : isDelayed ? '#ef4444' : 'var(--primary-gold)'}`,
                        color: isRerouted ? '#10b981' : isDelayed ? '#ef4444' : 'var(--primary-gold)',
                        padding: '2px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}>
                        {r.status}
                      </span>
                    </td>

                    <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                      {isRerouted ? (
                        <span style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                          <CheckCircle2 size={14} /> Optimized
                        </span>
                      ) : (
                        <button
                          className="execution-btn"
                          onClick={(e) => { e.stopPropagation(); handleSimulateReroute(r.id); }}
                          style={{ borderColor: 'var(--primary-gold)', color: 'var(--primary-gold)', padding: '4px 10px', fontSize: '0.75rem' }}
                        >
                          Simulate Reroute
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
