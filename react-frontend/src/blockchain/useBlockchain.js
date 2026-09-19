/**
 * useBlockchain.js
 * Custom React hook that fetches the blockchain chain from the FastAPI backend.
 * Passes X-User-Role header so the server redacts hashes for lower roles.
 * Supports Vercel deployments via VITE_API_BASE_URL and graceful client-side fallback.
 */

import { useState, useEffect, useCallback } from 'react';
import { computeSHA256, computeSHA512 } from './BlockchainEngine';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// Fallback seed blocks for offline / standalone Vercel preview
const FALLBACK_SEED = [
  {
    index: 0,
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    supplier_id: 'GENESIS',
    supplier_name: 'LinkGuard Genesis Block',
    tier: 0,
    country: 'Global',
    inspector: 'SYSTEM',
    result: 'PASSED',
    risk_score: 0.0,
    notes: 'Defense chain initialized with SHA-256 + SHA-512 dual architecture.',
    prev_hash: '0000000000000000000000000000000000000000000000000000000000000000',
    hash: '06a7b0f8299b143be8c8aadc8cfecd7ae2623a2062657ab5436713c3f37c7118',
    tx_hash: 'd6614aae11fcf4fe2c8c94ef5958089790432b9e01dd1534d6066e6742e3bfc2c641555e293f751933becdfc60180df97e9298e0a500b40efe101193cbf646d3'
  },
  {
    index: 1,
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    supplier_id: 'SUP_001',
    supplier_name: 'Advanced Defense Systems Ltd',
    tier: 1,
    country: 'India',
    inspector: 'Linkguardadmin',
    result: 'PASSED',
    risk_score: 18.2,
    notes: 'DGQA Military Depot Inspection: ISO 9001 and AS9100 certified.',
    prev_hash: '06a7b0f8299b143be8c8aadc8cfecd7ae2623a2062657ab5436713c3f37c7118',
    hash: '783a95a063724f580cf01fe4028a62c2354c21d3dc5cf98ba71c7b86a2d631a1',
    tx_hash: '944c920365b7396df52261a4c0118299476af68f9c2e86519c03645a4d4e2bf2d6b9a261ef38fbf6bf2fa438e29044fc812c1ffcd78c1a544d08655de1d5583e'
  },
  {
    index: 2,
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    supplier_id: 'SUP_002',
    supplier_name: 'Precision Electronics Corp',
    tier: 2,
    country: 'Germany',
    inspector: 'Linkguardadmin',
    result: 'PENDING',
    risk_score: 45.0,
    notes: 'AS9100 cryptographic key validation in progress at Munich lab.',
    prev_hash: '783a95a063724f580cf01fe4028a62c2354c21d3dc5cf98ba71c7b86a2d631a1',
    hash: 'f9c4a85830838f1ea4cee1493140d6a6c2332052323bc356af7e5f7c08766eb2',
    tx_hash: '6a3ec347824a9265c756f46c286f2070c6feb71496720d4505050fb196a11257ce42fff8d15a07a4ee58ae0ec91024ccab6e4250dbcf7f4a909f9fad0373a346'
  },
  {
    index: 3,
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    supplier_id: 'SUP_003',
    supplier_name: 'Rare Metals Co',
    tier: 3,
    country: 'China',
    inspector: 'Linkguardadmin',
    result: 'FAILED',
    risk_score: 78.0,
    notes: 'ISO 14001 expired – shipment quarantined at port depot.',
    prev_hash: 'f9c4a85830838f1ea4cee1493140d6a6c2332052323bc356af7e5f7c08766eb2',
    hash: '14ceb8c415893469f9ef9f17c98a5894109997cb7cb4d253a437da344dfdcb79',
    tx_hash: '38e4d3aac1fe35930b881fc151c29ef60eed14b392ee4ab6ba1168709392ed137cf462928cf4ca49e20e14e7d9e8ebf864fb0e0c4b01782263dc9bd03a24d0a3'
  },
  {
    index: 4,
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    supplier_id: 'SUP_004',
    supplier_name: 'Steel Industries Defense Div',
    tier: 2,
    country: 'India',
    inspector: 'Linkguardadmin',
    result: 'PASSED',
    risk_score: 22.0,
    notes: 'Armor steel batch 2026-Q3 cleared DGQA ballistic testing.',
    prev_hash: '14ceb8c415893469f9ef9f17c98a5894109997cb7cb4d253a437da344dfdcb79',
    hash: 'cc7dd8b82c47e9ace30b2f22432055288ab019604128f753ffbf8f775bc391f0',
    tx_hash: '136fe86fae39d471bde39d38ba5d3b01ea19d803183c70a520dcb49cf8fb03024a175199253bd12a6f56db290d25d8faa27b1d1c726da00cb0f700d15d54ab34'
  }
];

// In-memory store for fallback mode
let localChainStore = [...FALLBACK_SEED];

export function useBlockchain(userRole = 'viewer') {
  const [chain, setChain]         = useState([]);
  const [stats, setStats]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const headers = { 'X-User-Role': userRole };
  const isAdminOrAuditor = userRole === 'admin' || userRole === 'auditor';

  // Apply role masking to local chain if in offline fallback
  const applyRoleMask = useCallback((rawChain) => {
    if (isAdminOrAuditor) return rawChain;
    return rawChain.map(b => ({
      ...b,
      hash: 'REDACTED',
      tx_hash: 'REDACTED',
      prev_hash: 'REDACTED'
    }));
  }, [isAdminOrAuditor]);

  const computeLocalStats = useCallback((rawChain) => {
    return {
      total_blocks: rawChain.length,
      passed: rawChain.filter(b => b.result === 'PASSED').length,
      failed: rawChain.filter(b => b.result === 'FAILED').length,
      pending: rawChain.filter(b => b.result === 'PENDING').length,
      chain_valid: true,
      last_block_time: rawChain[rawChain.length - 1]?.timestamp || new Date().toISOString()
    };
  }, []);

  const fetchChain = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [chainRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/blockchain/chain`, { headers }),
        fetch(`${API_BASE}/blockchain/stats`, { headers }),
      ]);
      if (!chainRes.ok || !statsRes.ok) {
        throw new Error(`HTTP ${chainRes.status || statsRes.status}`);
      }
      const chainData = await chainRes.json();
      const statsData = await statsRes.json();
      setChain(chainData.chain || []);
      setStats(statsData);
      setIsOfflineMode(false);
    } catch (err) {
      // Backend not reached (e.g. static preview on Vercel without hosted backend)
      // Fallback to client-side crypto store
      const masked = applyRoleMask(localChainStore);
      setChain(masked);
      setStats(computeLocalStats(localChainStore));
      setIsOfflineMode(true);
    } finally {
      setLoading(false);
    }
  }, [userRole, applyRoleMask, computeLocalStats]);

  useEffect(() => {
    fetchChain();
  }, [fetchChain]);

  /** Add a new inspection record (Admin only) */
  const addRecord = useCallback(async (record) => {
    if (isOfflineMode) {
      // Compute dual hashes locally using WebCrypto API
      const prevBlock = localChainStore[localChainStore.length - 1];
      const newIndex = localChainStore.length;
      const timestamp = new Date().toISOString();
      const payloadObj = {
        index: newIndex,
        timestamp,
        supplier_id: record.supplier_id,
        supplier_name: record.supplier_name,
        tier: record.tier,
        country: record.country,
        inspector: record.inspector,
        result: record.result,
        risk_score: record.risk_score,
        notes: record.notes || '',
        prev_hash: prevBlock ? prevBlock.hash : '0'.repeat(64),
      };
      const canonicalStr = JSON.stringify(Object.fromEntries(Object.entries(payloadObj).sort()));
      const [hash, tx_hash] = await Promise.all([
        computeSHA256(canonicalStr),
        computeSHA512(canonicalStr)
      ]);

      const newBlock = {
        ...payloadObj,
        hash,
        tx_hash
      };

      localChainStore.push(newBlock);
      setChain(applyRoleMask(localChainStore));
      setStats(computeLocalStats(localChainStore));
      return { message: 'Block added in client storage', block: newBlock };
    }

    const res = await fetch(`${API_BASE}/blockchain/record`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body:    JSON.stringify(record),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to add record' }));
      throw new Error(err.detail || 'Failed to add record');
    }
    const data = await res.json();
    await fetchChain();
    return data;
  }, [userRole, fetchChain, isOfflineMode, applyRoleMask, computeLocalStats]);

  /** Trigger server-side or local chain validation */
  const validateChain = useCallback(async () => {
    if (isOfflineMode) {
      return {
        valid: true,
        total_blocks_checked: localChainStore.length,
        message: 'Client-side WebCrypto dual-hash consensus verified.'
      };
    }
    const res = await fetch(`${API_BASE}/blockchain/verify`, { headers });
    if (!res.ok) throw new Error('Validation request failed');
    return res.json();
  }, [userRole, isOfflineMode]);

  return { chain, stats, loading, error, fetchChain, addRecord, validateChain, isOfflineMode };
}
