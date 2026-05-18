import React from 'react';
import { X, Sparkles, UserCheck, TrendingUp, BookOpen, AlertCircle } from 'lucide-react';

const AIAnalysisModal = ({ isOpen, onClose, candidate, loading, aiData }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <Sparkles size={20} />
            AI Career Analysis: {candidate?.name}
          </h3>
          <button 
            onClick={onClose} 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem', border: 'none', background: 'transparent' }}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 0', gap: '1rem' }}>
              <div className="loader"></div>
              <p style={{ color: 'var(--text-secondary)' }}>Analyzing profile using DeepSeek AI...</p>
            </div>
          ) : aiData ? (
            <div>
              {aiData.isFallback && (
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <AlertCircle size={16} />
                  Showing fallback data (AI API unavailable)
                </div>
              )}
              
              <div className="ai-section">
                <h4><UserCheck size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }}/> Suitable Role</h4>
                <p style={{ color: 'var(--text-primary)', fontWeight: '500', fontSize: '1.1rem' }}>{aiData.suitableRole}</p>
              </div>

              <div className="ai-section">
                <h4><TrendingUp size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }}/> Key Strengths</h4>
                <ul>
                  {aiData.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div className="ai-section">
                <h4><BookOpen size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }}/> Recommended Skills to Learn</h4>
                <ul>
                  {aiData.missingSkills?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div className="ai-section">
                <h4>Training Plan</h4>
                <p>{aiData.trainingSuggestions}</p>
              </div>

              <div className="ai-section" style={{ borderLeftColor: 'var(--accent-green)', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
                <h4 style={{ color: 'var(--accent-green)' }}>Final Recommendation</h4>
                <p style={{ color: 'var(--text-primary)' }}>{aiData.recommendation}</p>
              </div>
            </div>
          ) : (
            <p>Failed to load analysis.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisModal;
