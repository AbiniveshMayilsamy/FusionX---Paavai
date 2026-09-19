import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || '/api';

const DB_LABELS = {
  supply_chain: '📦 supply_chain.db',
  blockchain:   '🔗 blockchain.db',
};

export function DatabaseViewerTab() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [activeDb, setActiveDb]     = useState('supply_chain');
  const [activeTable, setActiveTable] = useState(null);
  const [expanded, setExpanded] = useState({});

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/db_viewer`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      // auto-select first table
      const firstDb = Object.keys(json)[0];
      const firstTable = Object.keys(json[firstDb] || {})[0];
      setActiveDb(firstDb);
      setActiveTable(firstTable);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const currentTable = data?.[activeDb]?.[activeTable];

  return (
    <div style={{ padding: '1.5rem', color: '#e5d5a0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <Database size={20} color="#d9ba84" />
        <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: 1 }}>SQLite Database Viewer</span>
        <button
          onClick={fetchData}
          disabled={loading}
          style={{
            marginLeft: 'auto', background: 'rgba(217,186,132,0.12)', border: '1px solid rgba(217,186,132,0.3)',
            borderRadius: 6, padding: '0.35rem 0.8rem', color: '#d9ba84', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem'
          }}
        >
          <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 8, padding: '0.85rem 1rem', marginBottom: '1rem', color: '#fca5a5', fontSize: '0.83rem', lineHeight: 1.6 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>⚠ {error === 'HTTP 404' ? 'Backend needs restart' : 'Backend unreachable'}</div>
          {error === 'HTTP 404'
            ? <span>The <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: 3 }}>/db_viewer</code> endpoint was just added. Stop and restart FastAPI:<br />
                <code style={{ background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: 4, display: 'inline-block', marginTop: 6 }}>cd backend &amp;&amp; python main.py</code>
              </span>
            : <span>Start FastAPI: <code style={{ background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: 4 }}>cd backend &amp;&amp; python main.py</code></span>
          }
        </div>
      )}

      {data && (
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1rem' }}>
          {/* Sidebar */}
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, border: '1px solid rgba(217,186,132,0.15)', overflow: 'hidden' }}>
            {Object.entries(data).map(([dbName, tables]) => (
              <div key={dbName}>
                <button
                  onClick={() => setExpanded(p => ({ ...p, [dbName]: !p[dbName] }))}
                  style={{
                    width: '100%', textAlign: 'left', background: activeDb === dbName ? 'rgba(217,186,132,0.12)' : 'transparent',
                    border: 'none', borderBottom: '1px solid rgba(217,186,132,0.1)', padding: '0.65rem 0.85rem',
                    color: '#d9ba84', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: '0.78rem', fontWeight: 700, letterSpacing: 0.5
                  }}
                  onClick={() => { setActiveDb(dbName); setExpanded(p => ({ ...p, [dbName]: true })); }}
                >
                  {expanded[dbName] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  {DB_LABELS[dbName] || dbName}
                </button>
                {(expanded[dbName] || activeDb === dbName) && Object.keys(tables).map(tbl => (
                  <button
                    key={tbl}
                    onClick={() => { setActiveDb(dbName); setActiveTable(tbl); }}
                    style={{
                      width: '100%', textAlign: 'left', padding: '0.5rem 0.85rem 0.5rem 1.8rem',
                      background: activeDb === dbName && activeTable === tbl ? 'rgba(217,186,132,0.18)' : 'transparent',
                      border: 'none', borderBottom: '1px solid rgba(217,186,132,0.06)',
                      color: activeDb === dbName && activeTable === tbl ? '#f0d898' : '#a89060',
                      cursor: 'pointer', fontSize: '0.78rem'
                    }}
                  >
                    {tbl}
                    <span style={{ float: 'right', opacity: 0.5, fontSize: '0.7rem' }}>
                      {tables[tbl]?.rows?.length ?? 0}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Table View */}
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, border: '1px solid rgba(217,186,132,0.15)', overflow: 'hidden' }}>
            {currentTable ? (
              <>
                <div style={{ padding: '0.65rem 1rem', borderBottom: '1px solid rgba(217,186,132,0.15)', fontSize: '0.8rem', color: '#a89060' }}>
                  <span style={{ color: '#d9ba84', fontWeight: 700 }}>{activeTable}</span>
                  &nbsp;— {currentTable.rows.length} row{currentTable.rows.length !== 1 ? 's' : ''}, {currentTable.columns.length} columns
                </div>
                {currentTable.error ? (
                  <div style={{ padding: '1rem', color: '#fca5a5' }}>Error: {currentTable.error}</div>
                ) : (
                  <div style={{ overflowX: 'auto', maxHeight: '60vh', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                      <thead>
                        <tr style={{ background: 'rgba(217,186,132,0.08)', position: 'sticky', top: 0 }}>
                          {currentTable.columns.map(col => (
                            <th key={col} style={{ padding: '0.55rem 0.75rem', textAlign: 'left', color: '#d9ba84', fontWeight: 600, borderBottom: '1px solid rgba(217,186,132,0.2)', whiteSpace: 'nowrap' }}>
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {currentTable.rows.length === 0 ? (
                          <tr><td colSpan={currentTable.columns.length} style={{ padding: '1.5rem', textAlign: 'center', color: '#6b5a3a', fontStyle: 'italic' }}>No records found</td></tr>
                        ) : currentTable.rows.map((row, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid rgba(217,186,132,0.07)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                            {row.map((cell, j) => (
                              <td key={j} style={{ padding: '0.45rem 0.75rem', color: cell === null ? '#4a3a20' : '#c8b07a', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {cell === null ? <span style={{ fontStyle: 'italic', opacity: 0.4 }}>NULL</span> : String(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b5a3a' }}>Select a table from the sidebar</div>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
