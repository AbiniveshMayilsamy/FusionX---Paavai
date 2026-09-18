import React from 'react';
import { X, FileText, FileSpreadsheet, FileCode, CheckCircle2 } from 'lucide-react';

export function DownloadPopup({ reportType, reportData, isOpen, onClose, onDownload }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <h3 style={{ color: '#ffd700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={22} />
          Export & Download Report
        </h3>

        <p style={{ color: '#cbd5e1', marginBottom: '20px', fontSize: '0.95rem' }}>
          Selected Report: <strong style={{ color: '#fff' }}>{reportType}</strong>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            className="btn"
            onClick={() => onDownload(reportType, 'pdf')}
            style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: '#fff' }}
          >
            <FileText size={18} />
            Download Executive Document (.txt / formatted)
          </button>

          <button
            className="btn"
            onClick={() => onDownload(reportType, 'excel')}
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', color: '#fff' }}
          >
            <FileSpreadsheet size={18} />
            Download Excel Spreadsheet (.csv)
          </button>

          <button
            className="btn"
            onClick={() => onDownload(reportType, 'json')}
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)', color: '#fff' }}
          >
            <FileCode size={18} />
            Download Machine-Readable JSON (.json)
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            marginTop: '16px',
            width: '100%',
            background: 'rgba(239, 68, 68, 0.2)',
            color: '#f87171',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            padding: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
