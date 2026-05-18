import React, { useState } from 'react';
import { Search } from 'lucide-react';

const MatchForm = ({ onMatch }) => {
  const [matchData, setMatchData] = useState({
    requiredSkills: '',
    minExperience: ''
  });

  const handleChange = (e) => {
    setMatchData({ ...matchData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const skillsArray = matchData.requiredSkills
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
      
    onMatch(skillsArray, Number(matchData.minExperience));
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <Search size={20} className="text-accent-cyan" style={{ color: 'var(--accent-cyan)' }} />
        Rank & Filter Employees
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Required Skills (comma separated)</label>
          <input
            type="text"
            name="requiredSkills"
            value={matchData.requiredSkills}
            onChange={handleChange}
            className="form-input"
            required
            placeholder="React, AWS"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Minimum Experience (Years)</label>
          <input
            type="number"
            name="minExperience"
            value={matchData.minExperience}
            onChange={handleChange}
            className="form-input"
            min="0"
            placeholder="3"
          />
        </div>

        <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}>
          Find Matches
        </button>
      </form>
    </div>
  );
};

export default MatchForm;
