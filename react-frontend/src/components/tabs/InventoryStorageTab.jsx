import React, { useState } from 'react';
import { 
  Warehouse, 
  Boxes, 
  AlertTriangle, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  MapPin, 
  Layers, 
  Plus, 
  Minus, 
  Clock, 
  AlertOctagon,
  CheckCircle2,
  Package
} from 'lucide-react';
import { ShinyText } from '../react-bits';

export function InventoryStorageTab({ onTriggerExecution, userRole = 'viewer' }) {
  const isAdmin = userRole === 'admin';
  // Strategic Defense Depots
  const [depots, setDepots] = useState([
    {
      id: 'DEPOT-01',
      name: 'Central Strategic Depot',
      location: 'Bengaluru, India',
      capacityM3: 50000,
      occupiedM3: 38400,
      security: 'DEFENSE-TIER-1-MAX',
      climateControl: 'Active (+18°C / 40% RH)',
      primaryFleet: 'LCA Tejas Mk2 / AMCA Line'
    },
    {
      id: 'DEPOT-02',
      name: 'European Forward Logistics Hub',
      location: 'Frankfurt, Germany',
      capacityM3: 35000,
      occupiedM3: 24150,
      security: 'NATO-STANAG-LEVEL-3',
      climateControl: 'Active (+20°C / 45% RH)',
      primaryFleet: 'Eurofighter / Typhoon Subsystems'
    },
    {
      id: 'DEPOT-03',
      name: 'Indo-Pacific Buffer Depot',
      location: 'Singapore Port Logistics Hub',
      capacityM3: 40000,
      occupiedM3: 33200,
      security: 'DEFENSE-MARITIME-CLEARANCE',
      climateControl: 'Marine Dehumidification Active',
      primaryFleet: 'Naval Surface & Subsurface Spares'
    },
    {
      id: 'DEPOT-04',
      name: 'North American Defense Reserves',
      location: 'Fort Worth, Texas, USA',
      capacityM3: 60000,
      occupiedM3: 41500,
      security: 'ITAR-COMPLIANT-MAX',
      climateControl: 'High-Temp / Inert Gas Storage',
      primaryFleet: 'F-35 Strategic Subsystem Spares'
    }
  ]);

  // SKU Inventory with linked supplier delay cross-referencing
  const [inventory, setInventory] = useState([
    {
      sku: 'SKU-RAD-901',
      name: 'AESA Radar Transceiver Modules',
      category: 'Avionics & Sensing',
      depotId: 'DEPOT-01',
      depotName: 'Central Strategic Depot (Bengaluru)',
      currentStock: 1420,
      targetBuffer: 1800,
      minSafetyStock: 500,
      dailyBurnRate: 28,
      unit: 'Units',
      leadSupplier: 'Precision Electronics Corp (Germany)',
      predictedSupplierDelay: 1.2, // Days
      unitCost: '$14,500'
    },
    {
      sku: 'SKU-NEO-08',
      name: 'Samarium-Cobalt High-Temp Magnets',
      category: 'Rare Earth Precursors',
      depotId: 'DEPOT-03',
      depotName: 'Indo-Pacific Buffer Depot (Singapore)',
      currentStock: 180, // Low!
      targetBuffer: 800,
      minSafetyStock: 250,
      dailyBurnRate: 14,
      unit: 'Kg',
      leadSupplier: 'Mining Corp (Katanga, Congo)',
      predictedSupplierDelay: 14.8, // Days - Severe Delay!
      unitCost: '$2,800/kg'
    },
    {
      sku: 'SKU-TI-440',
      name: 'Aerospace Titanium 6Al-4V Billets',
      category: 'Structural Alloys',
      depotId: 'DEPOT-01',
      depotName: 'Central Strategic Depot (Bengaluru)',
      currentStock: 8400,
      targetBuffer: 10000,
      minSafetyStock: 2500,
      dailyBurnRate: 180,
      unit: 'Kg',
      leadSupplier: 'Steel & Alloy Industries (India)',
      predictedSupplierDelay: 0.6,
      unitCost: '$120/kg'
    },
    {
      sku: 'SKU-HYD-31',
      name: 'Fly-by-Wire Hydraulic Actuators',
      category: 'Flight Control & Hydraulics',
      depotId: 'DEPOT-02',
      depotName: 'European Forward Hub (Frankfurt)',
      currentStock: 680,
      targetBuffer: 950,
      minSafetyStock: 200,
      dailyBurnRate: 12,
      unit: 'Units',
      leadSupplier: 'Precision Electronics Corp (Germany)',
      predictedSupplierDelay: 2.1,
      unitCost: '$8,200'
    },
    {
      sku: 'SKU-MCU-55',
      name: 'Rad-Hardened GaN Microcontroller SOCs',
      category: 'Defense Silicon',
      depotId: 'DEPOT-04',
      depotName: 'North American Reserves (Fort Worth)',
      currentStock: 1950,
      targetBuffer: 4000,
      minSafetyStock: 1000,
      dailyBurnRate: 65,
      unit: 'Chips',
      leadSupplier: 'Advanced Defense Systems (Taiwan/USA)',
      predictedSupplierDelay: 5.4,
      unitCost: '$650'
    }
  ]);

  const [selectedDepotFilter, setSelectedDepotFilter] = useState('ALL');
  const [adjustModal, setAdjustModal] = useState(null); // item object
  const [adjustQty, setAdjustQty] = useState(50);
  const [adjustType, setAdjustType] = useState('INBOUND'); // 'INBOUND' | 'ISSUE'

  const handleAdjustStock = () => {
    if (!adjustModal) return;
    const delta = adjustType === 'INBOUND' ? Math.abs(adjustQty) : -Math.abs(adjustQty);

    const executeUpdate = () => {
      setInventory(prev => prev.map(item => {
        if (item.sku === adjustModal.sku) {
          const newStock = Math.max(0, item.currentStock + delta);
          return {
            ...item,
            currentStock: newStock
          };
        }
        return item;
      }));
      setAdjustModal(null);
    };

    if (onTriggerExecution) {
      onTriggerExecution(
        adjustType === 'INBOUND' 
          ? `LOGGING INBOUND DEFENSE SHIPMENT (+${adjustQty} ${adjustModal.unit}) FOR ${adjustModal.sku}...`
          : `ISSUING ${adjustQty} ${adjustModal.unit} TO ASSEMBLY PRODUCTION FOR ${adjustModal.sku}...`,
        executeUpdate
      );
    } else {
      executeUpdate();
    }
  };

  const filteredInventory = inventory.filter(item => 
    selectedDepotFilter === 'ALL' || item.depotId === selectedDepotFilter
  );

  return (
    <div className="tab-content">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2>
          <Warehouse size={22} style={{ color: 'var(--primary-gold)' }} />
          Inventory Storage Management & Strategic Buffer Telemetry
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '850px' }}>
          Live multi-depot storage capacity tracking, SKU burn rates, safety buffer thresholds, and automated stock runout risk alerts cross-referenced with active supplier delay forecasts.
        </p>
      </div>

      {/* Strategic Depots Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '32px' }}>
        {depots.map(depot => {
          const utilPct = Math.round((depot.occupiedM3 / depot.capacityM3) * 100);
          const isSelected = selectedDepotFilter === depot.id;

          return (
            <div 
              key={depot.id}
              onClick={() => setSelectedDepotFilter(isSelected ? 'ALL' : depot.id)}
              style={{
                background: isSelected ? 'rgba(217, 186, 132, 0.08)' : 'rgba(14, 16, 22, 0.75)',
                border: isSelected ? '1px solid var(--primary-gold)' : '1px solid var(--glass-border)',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--primary-gold)', fontWeight: 700 }}>
                  {depot.id}
                </span>
                <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.06)', color: '#cbd5e1', padding: '2px 6px' }}>
                  {depot.security}
                </span>
              </div>

              <strong style={{ fontSize: '1.02rem', color: '#ffffff', display: 'block', marginBottom: '4px' }}>
                {depot.name}
              </strong>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px' }}>
                <MapPin size={13} style={{ color: 'var(--primary-gold)' }} />
                {depot.location}
              </div>

              {/* Capacity Meter Bar */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                  <span style={{ color: '#94a3b8' }}>Capacity Utilization</span>
                  <strong style={{ color: utilPct > 80 ? '#f59e0b' : 'var(--primary-gold)' }}>
                    {utilPct}% ({depot.occupiedM3.toLocaleString()} / {depot.capacityM3.toLocaleString()} m&sup3;)
                  </strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{ width: `${utilPct}%`, height: '100%', background: utilPct > 80 ? '#f59e0b' : 'var(--primary-gold)' }}></div>
                </div>
              </div>

              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                Assigned: <span style={{ color: '#cbd5e1' }}>{depot.primaryFleet}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter state indicator */}
      {selectedDepotFilter !== 'ALL' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', fontSize: '0.85rem', color: '#94a3b8' }}>
          Filtering by: <strong style={{ color: 'var(--primary-gold)' }}>{depots.find(d => d.id === selectedDepotFilter)?.name}</strong>
          <button 
            onClick={() => setSelectedDepotFilter('ALL')}
            style={{ background: 'transparent', border: '1px solid #64748b', color: '#cbd5e1', padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer' }}
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Inventory Telemetry Table */}
      <div style={{ background: 'rgba(14, 16, 22, 0.75)', border: '1px solid var(--glass-border)', padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Boxes size={18} style={{ color: 'var(--primary-gold)' }} />
          Strategic SKU Inventory & Stock Runout Analysis
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                <th style={{ padding: '12px 10px' }}>SKU / Material</th>
                <th style={{ padding: '12px 10px' }}>Depot Location</th>
                <th style={{ padding: '12px 10px' }}>Current Stock</th>
                <th style={{ padding: '12px 10px' }}>Burn Rate</th>
                <th style={{ padding: '12px 10px' }}>Stock Remaining</th>
                <th style={{ padding: '12px 10px' }}>Supplier Delay</th>
                <th style={{ padding: '12px 10px' }}>Buffer Health</th>
                <th style={{ padding: '12px 10px', textAlign: 'right' }}>Operations</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map(item => {
                const daysRemaining = Math.round((item.currentStock / item.dailyBurnRate) * 10) / 10;
                const safetyDays = Math.round((item.minSafetyStock / item.dailyBurnRate) * 10) / 10;
                
                // Real cross-reference with supplier delay!
                const isCriticalRunout = item.predictedSupplierDelay >= daysRemaining;
                const isSafetyBreach = (daysRemaining - item.predictedSupplierDelay) < safetyDays;

                let statusBadge = { text: 'HEALTHY', color: '#10b981' };
                if (isCriticalRunout) {
                  statusBadge = { text: 'CRITICAL RUNOUT DEFICIT', color: '#ef4444' };
                } else if (isSafetyBreach) {
                  statusBadge = { text: 'SAFETY BUFFER BREACH', color: '#f59e0b' };
                }

                return (
                  <tr 
                    key={item.sku} 
                    style={{ 
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      background: isCriticalRunout ? 'rgba(239, 68, 68, 0.05)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '14px 10px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary-gold)' }}>
                        {item.sku}
                      </div>
                      <strong style={{ color: '#ffffff', fontSize: '0.92rem' }}>{item.name}</strong>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.category} &bull; {item.unitCost}</div>
                    </td>

                    <td style={{ padding: '14px 10px', color: '#cbd5e1' }}>
                      {item.depotName}
                    </td>

                    <td style={{ padding: '14px 10px', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                      {item.currentStock.toLocaleString()} <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 'normal' }}>{item.unit}</span>
                    </td>

                    <td style={{ padding: '14px 10px', color: '#cbd5e1' }}>
                      {item.dailyBurnRate} {item.unit}/day
                    </td>

                    <td style={{ padding: '14px 10px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: isCriticalRunout ? '#ef4444' : isSafetyBreach ? '#f59e0b' : '#10b981' }}>
                      {daysRemaining} Days
                    </td>

                    <td style={{ padding: '14px 10px', color: item.predictedSupplierDelay > 10 ? '#ef4444' : item.predictedSupplierDelay > 3 ? '#f59e0b' : '#10b981', fontFamily: 'var(--font-mono)' }}>
                      +{item.predictedSupplierDelay}d
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.leadSupplier.substring(0, 20)}...</div>
                    </td>

                    <td style={{ padding: '14px 10px' }}>
                      <span style={{
                        background: `${statusBadge.color}22`,
                        border: `1px solid ${statusBadge.color}`,
                        color: statusBadge.color,
                        padding: '3px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}>
                        {statusBadge.text}
                      </span>
                    </td>

                    <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => { setAdjustModal(item); setAdjustType('INBOUND'); }}
                          disabled={!isAdmin}
                          title={!isAdmin ? 'Admin access required' : ''}
                          style={{
                            background: isAdmin ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${isAdmin ? '#10b981' : '#475569'}`,
                            color: isAdmin ? '#10b981' : '#475569',
                            padding: '4px 8px',
                            fontSize: '0.75rem',
                            cursor: isAdmin ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Plus size={12} /> Receive
                        </button>
                        <button
                          onClick={() => { setAdjustModal(item); setAdjustType('ISSUE'); }}
                          disabled={!isAdmin}
                          title={!isAdmin ? 'Admin access required' : ''}
                          style={{
                            background: isAdmin ? 'rgba(217, 186, 132, 0.1)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${isAdmin ? 'var(--primary-gold)' : '#475569'}`,
                            color: isAdmin ? 'var(--primary-gold)' : '#475569',
                            padding: '4px 8px',
                            fontSize: '0.75rem',
                            cursor: isAdmin ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Minus size={12} /> Issue
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {adjustModal && (
        <div className="execution-overlay" style={{ background: 'rgba(6, 7, 9, 0.92)' }}>
          <div className="execution-box" style={{ maxWidth: '520px', width: '100%', textAlign: 'left', padding: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={20} style={{ color: 'var(--primary-gold)' }} />
              {adjustType === 'INBOUND' ? 'Record Inbound Shipment' : 'Issue Stock to Assembly Line'}
            </h3>
            
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '18px' }}>
              Material: <strong style={{ color: '#ffffff' }}>{adjustModal.name}</strong> ({adjustModal.sku})
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px' }}>
                Quantity ({adjustModal.unit})
              </label>
              <input 
                type="number"
                min="1"
                value={adjustQty}
                onChange={(e) => setAdjustQty(parseInt(e.target.value) || 0)}
                style={{ width: '100%', background: '#0a0c10', border: '1px solid var(--glass-border)', color: '#ffffff', padding: '10px', fontSize: '1rem', fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                className="execution-btn"
                onClick={() => setAdjustModal(null)}
                style={{ borderColor: '#ef4444', color: '#ef4444' }}
              >
                Cancel
              </button>
              <button 
                className="action-btn-gold"
                onClick={handleAdjustStock}
                style={{ padding: '10px 20px' }}
              >
                <CheckCircle size={16} style={{ color: 'inherit' }} />
                <span style={{ fontWeight: 800, letterSpacing: '0.08em', color: 'inherit' }}>CONFIRM INVENTORY TRANSACTION</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
