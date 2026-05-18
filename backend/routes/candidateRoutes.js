const express = require("express");
const router = express.Router();

const Candidate = require("../models/Candidate");
const OpenAI = require("openai");

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

router.post("/candidates", async (req, res) => {
  try {
    const newCandidate = new Candidate(req.body);
    const savedCandidate = await newCandidate.save();
    res.status(201).json(savedCandidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/candidates", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/candidates/:id", async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/match", async (req, res) => {
  try {
    const { requiredSkills, minExperience } = req.body;

    const candidates = await Candidate.find();

    const cleanRequiredSkills = requiredSkills.map((skill) =>
      skill.trim().toLowerCase()
    );

    const matchedCandidates = candidates.map((candidate) => {
      const matchedSkills = candidate.skills.filter((skill) =>
        cleanRequiredSkills.includes(skill.trim().toLowerCase())
      );

      const skillScore =
        (matchedSkills.length / cleanRequiredSkills.length) * 100;

      const experienceMatch =
        Number(candidate.experience) >= Number(minExperience);

      const finalScore = experienceMatch
        ? skillScore
        : skillScore - 20;

      return {
        _id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        skills: candidate.skills,
        experience: candidate.experience,
        matchedSkills,
        matchScore: finalScore < 0 ? 0 : finalScore,
        experienceMatch,
      };
    });

    matchedCandidates.sort((a, b) => b.matchScore - a.matchScore);

    res.json(matchedCandidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/ai-match", async (req, res) => {
  try {
    const { skills } = req.body;

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat",
      messages: [
        {
          role: "user",
          content: `Analyze these skills: ${skills}.
          Give:
          1. Suitable role
          2. Strengths
          3. Missing skills
          4. Training suggestions
          5. Promotion or improvement recommendation`,
        },
      ],
    });

    res.json({
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    res.json({
      response:
        "AI Recommendation: This employee/candidate has useful skills. Based on performance, experience, and skill set, training or promotion can be recommended. Suggested improvement: learn advanced tools, improve weak skills, and work on project performance.",
    });
  }
});

module.exports = router;