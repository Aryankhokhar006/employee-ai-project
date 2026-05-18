import React from 'react';
import { Trash2, BrainCircuit, Briefcase, Award } from 'lucide-react';

const CandidateCard = ({ candidate, onDelete, onAnalyze }) => {
  const getScoreClass = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-med';
    return 'score-low';
  };

  return (
    <div className="card candidate-card">
      {candidate.matchScore !== undefined && (
        <div className="match-score">
          <div className={`score-circle ${getScoreClass(candidate.matchScore)}`}>
            {candidate.matchScore}%
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Match</span>
        </div>
      )}

      <div className="candidate-header">
        <div className="candidate-avatar">
          {candidate.name.charAt(0).toUpperCase()}
        </div>
        <div className="candidate-info" style={{ flex: 1, marginLeft: '1rem' }}>
          <h3>{candidate.name}</h3>
          <p>
            <Briefcase size={14} style={{ color: 'var(--text-muted)' }} />
            {candidate.department}
          </p>
          <p style={{ marginTop: '0.25rem' }}>
            <Award size={14} style={{ color: 'var(--text-muted)' }} />
            {candidate.experience} yrs exp &nbsp;|&nbsp; Score: {candidate.performanceScore}
          </p>
        </div>
      </div>

      <div className="skills-container">
        {candidate.skills.map((skill, index) => (
          <span key={index} className="badge badge-cyan">
            {skill}
          </span>
        ))}
      </div>

      <div className="candidate-actions">
        <button 
          onClick={() => onAnalyze(candidate)}
          className="btn btn-secondary btn-sm"
        >
          <BrainCircuit size={16} />
          AI Analyze
        </button>
        <button 
          onClick={() => onDelete(candidate._id)}
          className="btn btn-danger btn-sm"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;
