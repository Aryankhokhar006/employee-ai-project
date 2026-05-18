import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const API_URL = "https://employee-ai-backend-1aib.onrender.com";

  const [candidates, setCandidates] = useState([]);
  const [skillsInput, setSkillsInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const [jobData, setJobData] = useState({
    requiredSkills: "",
    minExperience: "",
  });

  const [matchedCandidates, setMatchedCandidates] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    skills: "",
    performanceScore: "",
    experience: "",
  });

  const cardStyle = {
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "14px",
    color: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
    marginBottom: "20px",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "white",
    marginTop: "6px",
  };

  const buttonStyle = {
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#38bdf8",
    color: "#020617",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/candidates`);
      setCandidates(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleJobChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newCandidate = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim()),
      };

      await axios.post(`${API_URL}/api/candidates`, newCandidate);

      fetchCandidates();

      setFormData({
        name: "",
        email: "",
        department: "",
        skills: "",
        performanceScore: "",
        experience: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCandidate = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/candidates/${id}`);
      fetchCandidates();
    } catch (error) {
      console.log(error);
    }
  };

  const analyzeSkills = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/ai-match`, {
        skills: skillsInput,
      });

      setAiResponse(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  const matchCandidates = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/match`, {
        requiredSkills: jobData.requiredSkills
          .split(",")
          .map((skill) => skill.trim()),
        minExperience: Number(jobData.minExperience),
      });

      setMatchedCandidates(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#020617",
        minHeight: "100vh",
        padding: "30px",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          AI-Based Employee Performance Analytics System
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "25px",
          }}
        >
          <div style={cardStyle}>
            <h3>Total Employees</h3>
            <h1>{candidates.length}</h1>
          </div>

          <div style={cardStyle}>
            <h3>Matched Employees</h3>
            <h1>{matchedCandidates.length}</h1>
          </div>

          <div style={cardStyle}>
            <h3>AI Module</h3>
            <h1>Active</h1>
          </div>
        </div>

        <div style={cardStyle}>
          <h2>Employee Registration Form</h2>

          <form onSubmit={handleSubmit}>
            <label>Employee Name</label>
            <input
              style={inputStyle}
              type="text"
              name="name"
              placeholder="Enter Employee Name"
              value={formData.name}
              onChange={handleChange}
            />

            <br /><br />

            <label>Email</label>
            <input
              style={inputStyle}
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
            />

            <br /><br />

            <label>Department</label>
            <input
              style={inputStyle}
              type="text"
              name="department"
              placeholder="Enter Department"
              value={formData.department}
              onChange={handleChange}
            />

            <br /><br />

            <label>Skills</label>
            <input
              style={inputStyle}
              type="text"
              name="skills"
              placeholder="React, Node.js, MongoDB"
              value={formData.skills}
              onChange={handleChange}
            />

            <br /><br />

            <label>Performance Score</label>
            <input
              style={inputStyle}
              type="number"
              name="performanceScore"
              placeholder="Enter Performance Score"
              value={formData.performanceScore}
              onChange={handleChange}
            />

            <br /><br />

            <label>Years of Experience</label>
            <input
              style={inputStyle}
              type="number"
              name="experience"
              placeholder="Enter Experience"
              value={formData.experience}
              onChange={handleChange}
            />

            <button style={buttonStyle} type="submit">
              Add Employee
            </button>
          </form>
        </div>

        <div style={cardStyle}>
          <h2>AI Employee Recommendation</h2>

          <input
            style={inputStyle}
            type="text"
            placeholder="Enter employee skills/performance"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
          />

          <button style={buttonStyle} onClick={analyzeSkills}>
            Generate AI Recommendation
          </button>

          <div
            style={{
              whiteSpace: "pre-wrap",
              border: "1px solid #334155",
              padding: "20px",
              borderRadius: "10px",
              backgroundColor: "#0f172a",
              marginTop: "20px",
              lineHeight: "1.7",
            }}
          >
            {aiResponse}
          </div>
        </div>

        <div style={cardStyle}>
          <h2>Employee Ranking / Filter Form</h2>

          <input
            style={inputStyle}
            type="text"
            name="requiredSkills"
            placeholder="Required Skills: React, Node.js"
            value={jobData.requiredSkills}
            onChange={handleJobChange}
          />

          <br /><br />

          <input
            style={inputStyle}
            type="number"
            name="minExperience"
            placeholder="Minimum Experience"
            value={jobData.minExperience}
            onChange={handleJobChange}
          />

          <button style={buttonStyle} onClick={matchCandidates}>
            Rank Employees
          </button>
        </div>

        <div style={cardStyle}>
          <h2>Employee Analytics & Rankings</h2>

          {matchedCandidates.map((candidate) => (
            <div
              key={candidate._id}
              style={{
                border: "1px solid #22c55e",
                marginBottom: "15px",
                padding: "18px",
                borderRadius: "10px",
                backgroundColor: "#052e16",
              }}
            >
              <h3>{candidate.name}</h3>
              <p>Match Score: {candidate.matchScore}%</p>
              <p>Matched Skills: {candidate.matchedSkills.join(", ")}</p>
              <p>Experience: {candidate.experience} years</p>
              <p>
                Experience Match:{" "}
                {candidate.experienceMatch ? "Yes" : "No"}
              </p>
            </div>
          ))}
        </div>

        <div style={cardStyle}>
          <h2>Employee List</h2>

          {candidates.map((candidate) => (
            <div
              key={candidate._id}
              style={{
                border: "1px solid #334155",
                marginBottom: "15px",
                padding: "18px",
                borderRadius: "10px",
                backgroundColor: "#0f172a",
              }}
            >
              <h3>{candidate.name}</h3>
              <p>Email: {candidate.email}</p>
              <p>Department: {candidate.department}</p>
              <p>Skills: {candidate.skills.join(", ")}</p>
              <p>Performance Score: {candidate.performanceScore}</p>
              <p>Experience: {candidate.experience} years</p>

              <button
                style={{
                  ...buttonStyle,
                  backgroundColor: "#ef4444",
                  color: "white",
                }}
                onClick={() => deleteCandidate(candidate._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;