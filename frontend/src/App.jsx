import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, Users, Target, Activity } from 'lucide-react';
import CandidateForm from './components/CandidateForm';
import MatchForm from './components/MatchForm';
import CandidateCard from './components/CandidateCard';
import AnalyticsChart from './components/AnalyticsChart';
import AIAnalysisModal from './components/AIAnalysisModal';

const API_BASE_URL = 'http://localhost:3000/api';

function App() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMatchMode, setIsMatchMode] = useState(false);
  
  // AI Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/candidates`);
      setCandidates(res.data);
      setIsMatchMode(false);
    } catch (err) {
      console.error('Error fetching candidates', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidate = async (candidateData) => {
    try {
      await axios.post(`${API_BASE_URL}/candidates`, candidateData);
      fetchCandidates();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding candidate');
    }
  };

  const handleDeleteCandidate = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`${API_BASE_URL}/candidates/${id}`);
        fetchCandidates();
      } catch (err) {
        console.error('Error deleting candidate', err);
      }
    }
  };

  const handleMatch = async (requiredSkills, minExperience) => {
    if (requiredSkills.length === 0) {
      fetchCandidates();
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/match`, {
        requiredSkills,
        minExperience
      });
      setCandidates(res.data);
      setIsMatchMode(true);
    } catch (err) {
      console.error('Error matching candidates', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
    setAiLoading(true);
    setAiData(null);

    try {
      const res = await axios.post(`${API_BASE_URL}/ai-match`, {
        candidateId: candidate._id
      });
      setAiData(res.data);
    } catch (err) {
      console.error('Error with AI analysis', err);
      alert('Failed to get AI analysis');
      setIsModalOpen(false);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-title">
          <LayoutDashboard size={28} />
          <span>AI Employee Analytics</span>
        </div>
        <div className="badge badge-cyan" style={{ fontSize: '0.85rem' }}>
          <Activity size={14} style={{ marginRight: '4px' }} /> System Active
        </div>
      </header>

      <main className="main-content">
        <aside className="sidebar">
          <CandidateForm onAddCandidate={handleAddCandidate} />
          <MatchForm onMatch={handleMatch} />
        </aside>

        <section className="dashboard-area">
          <div className="overview-grid">
            <div className="card stat-card">
              <div className="stat-icon">
                <Users size={24} />
              </div>
              <div className="stat-info">
                <h4>Total Employees</h4>
                <p>{isMatchMode ? '-' : candidates.length}</p>
              </div>
            </div>
            
            <div className="card stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)' }}>
                <Target size={24} />
              </div>
              <div className="stat-info">
                <h4>{isMatchMode ? 'Matches Found' : 'Avg Performance'}</h4>
                <p>
                  {isMatchMode 
                    ? candidates.length 
                    : (candidates.length ? Math.round(candidates.reduce((acc, c) => acc + c.performanceScore, 0) / candidates.length) : 0)}
                </p>
              </div>
            </div>
          </div>

          <AnalyticsChart candidates={candidates} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
              {isMatchMode ? 'Matched Candidates' : 'Employee Directory'}
            </h2>
            {isMatchMode && (
              <button onClick={fetchCandidates} className="btn btn-secondary btn-sm">
                Clear Match Filter
              </button>
            )}
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <div className="loader"></div>
            </div>
          ) : candidates.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No employees found.
            </div>
          ) : (
            <div className="candidates-grid">
              {candidates.map(candidate => (
                <CandidateCard 
                  key={candidate._id} 
                  candidate={candidate} 
                  onDelete={handleDeleteCandidate}
                  onAnalyze={handleAnalyze}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <AIAnalysisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        candidate={selectedCandidate}
        loading={aiLoading}
        aiData={aiData}
      />
    </div>
  );
}

export default App;