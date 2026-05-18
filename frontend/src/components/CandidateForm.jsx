import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';

const CandidateForm = ({ onAddCandidate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    skills: '',
    performanceScore: '',
    experience: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.submitter?.blur();
    e.preventDefault();
    
    // Convert comma separated string to array
    const skillsArray = formData.skills
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);

    const submissionData = {
      ...formData,
      skills: skillsArray,
      performanceScore: Number(formData.performanceScore),
      experience: Number(formData.experience)
    };

    onAddCandidate(submissionData);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      department: '',
      skills: '',
      performanceScore: '',
      experience: ''
    });
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <UserPlus size={20} className="text-accent-cyan" style={{ color: 'var(--accent-cyan)' }} />
        Add New Employee
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
            placeholder="e.g. Jane Doe"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
            placeholder="jane@company.com"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="form-input"
            required
            placeholder="e.g. Engineering"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Skills (comma separated)</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="form-input"
            required
            placeholder="React, Node.js, Python"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Performance (0-100)</label>
            <input
              type="number"
              name="performanceScore"
              value={formData.performanceScore}
              onChange={handleChange}
              className="form-input"
              required
              min="0"
              max="100"
              placeholder="85"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Experience (Years)</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="form-input"
              required
              min="0"
              placeholder="5"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
          Register Employee
        </button>
      </form>
    </div>
  );
};

export default CandidateForm;
