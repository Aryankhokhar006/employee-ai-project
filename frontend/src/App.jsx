import { useEffect, useState } from "react";
import axios from "axios";

function App() {

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

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {

    const response = await axios.get(
  "https://employee-ai-backend-1aib.onrender.com/api/candidates"
);
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

  const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const newCandidate = {
      ...formData,

      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim()),
    };

    await axios.post(
  "https://employee-ai-backend-1aib.onrender.com/api/candidates",
  newCandidate
);

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

    await axios.delete(
      `https://employee-ai-backend-1aib.onrender.com/api/candidates/${id}`
    );

    fetchCandidates();

  } catch (error) {

    console.log(error);
  }
};
const analyzeSkills = async () => {

  try {

    const response = await axios.post(
      "https://employee-ai-backend-1aib.onrender.com/api/ai-match",
      {
        skills: skillsInput,
      }
    );

    setAiResponse(response.data.response);

  } catch (error) {

    console.log(error);
  }
};
const matchCandidates = async () => {
  try {
    const response = await axios.post(
      "https://employee-ai-backend-1aib.onrender.com/api/match",
      {
        requiredSkills: jobData.requiredSkills
          .split(",")
          .map((skill) => skill.trim()),
        minExperience: Number(jobData.minExperience),
      }
    );

    setMatchedCandidates(response.data);
  } catch (error) {
    console.log(error);
  }
};
  const handleJobChange = (e) => {

  setJobData({
    ...jobData,
    [e.target.name]: e.target.value,
  });
};
  return (
  <div
    style={{
      padding: "30px",
      maxWidth: "900px",
      margin: "auto",
      fontFamily: "Arial",
      lineHeight: "1.8",
    }}
  >
    <h1>AI-Based Employee Performance Analytics System</h1>

    <h2>Employee Registration Form</h2>

    <form onSubmit={handleSubmit}>
      <label>Employee Name</label><br />
      <input
        type="text"
        name="name"
        placeholder="Enter Employee Name"
        value={formData.name}
        onChange={handleChange}
      />

      <br /><br />

      <label>Email</label><br />
      <input
        type="email"
        name="email"
        placeholder="Enter Email"
        value={formData.email}
        onChange={handleChange}
      />

      <br /><br />

      <label>Department</label><br />
      <input
        type="text"
        name="department"
        placeholder="Enter Department"
        value={formData.department}
        onChange={handleChange}
      />

      <br /><br />

      <label>Skills</label><br />
      <input
        type="text"
        name="skills"
        placeholder="React, Node.js, MongoDB"
        value={formData.skills}
        onChange={handleChange}
      />

      <br /><br />

      <label>Performance Score</label><br />
      <input
        type="number"
        name="performanceScore"
        placeholder="Enter Performance Score"
        value={formData.performanceScore}
        onChange={handleChange}
      />

      <br /><br />

      <label>Years of Experience</label><br />
      <input
        type="number"
        name="experience"
        placeholder="Enter Experience"
        value={formData.experience}
        onChange={handleChange}
      />

      <br /><br />

      <button type="submit">Add Employee</button>
    </form>

    <hr />

    <h2>AI Employee Recommendation</h2>

    <input
      type="text"
      placeholder="Enter employee skills/performance"
      value={skillsInput}
      onChange={(e) => setSkillsInput(e.target.value)}
    />

    <br /><br />

    <button onClick={analyzeSkills}>
      Generate AI Recommendation
    </button>

    <div
      style={{
        whiteSpace: "pre-wrap",
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
        marginTop: "15px",
        lineHeight: "1.7",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      {aiResponse}
    </div>

    <hr />

    <h2>Employee Ranking / Filter Form</h2>

    <input
      type="text"
      name="requiredSkills"
      placeholder="Required Skills: React, Node.js"
      value={jobData.requiredSkills}
      onChange={handleJobChange}
    />

    <br /><br />

    <input
      type="number"
      name="minExperience"
      placeholder="Minimum Experience"
      value={jobData.minExperience}
      onChange={handleJobChange}
    />

    <br /><br />

    <button onClick={matchCandidates}>Rank Employees</button>

    <h2>Employee Analytics & Rankings</h2>

    {matchedCandidates.map((candidate) => (
      <div
        key={candidate._id}
        style={{
          border: "1px solid #28a745",
          marginBottom: "20px",
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "#f8fff8",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
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

    <hr />

    <h2>Employee List</h2>

    {candidates.map((candidate) => (
      <div
        key={candidate._id}
        style={{
          border: "1px solid #ccc",
          marginBottom: "20px",
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <h3>{candidate.name}</h3>
        <p>Email: {candidate.email}</p>
        <p>Department: {candidate.department}</p>
        <p>Skills: {candidate.skills.join(", ")}</p>
        <p>Performance Score: {candidate.performanceScore}</p>
        <p>Experience: {candidate.experience} years</p>

        <button onClick={() => deleteCandidate(candidate._id)}>
          Delete
        </button>
      </div>
    ))}
  </div>
);
}

export default App;