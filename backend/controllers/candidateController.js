const Candidate = require('../models/Candidate');
const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

// @desc    Get all candidates
// @route   GET /api/candidates
exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.status(200).json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add a candidate
// @route   POST /api/candidates
exports.addCandidate = async (req, res) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;
    
    const newCandidate = new Candidate({
      name,
      email,
      department,
      skills,
      performanceScore,
      experience,
    });

    const savedCandidate = await newCandidate.save();
    res.status(201).json(savedCandidate);
  } catch (error) {
    console.error('Error adding candidate:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a candidate
// @route   DELETE /api/candidates/:id
exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    await candidate.deleteOne();
    res.status(200).json({ message: 'Candidate removed' });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Match candidates based on skills and experience
// @route   POST /api/match
exports.matchCandidates = async (req, res) => {
  try {
    const { requiredSkills, minExperience } = req.body;

    if (!requiredSkills || !Array.isArray(requiredSkills)) {
      return res.status(400).json({ message: 'Please provide an array of required skills' });
    }

    const minExp = minExperience || 0;
    const candidates = await Candidate.find({ experience: { $gte: minExp } });

    // Calculate match score
    const matchedCandidates = candidates.map(candidate => {
      const candidateSkills = candidate.skills.map(s => s.toLowerCase());
      const reqSkills = requiredSkills.map(s => s.toLowerCase());
      
      let matchedSkillCount = 0;
      reqSkills.forEach(reqSkill => {
        if (candidateSkills.includes(reqSkill)) {
          matchedSkillCount++;
        }
      });

      const matchScore = reqSkills.length > 0 
        ? Math.round((matchedSkillCount / reqSkills.length) * 100)
        : 0;

      return {
        ...candidate.toObject(),
        matchScore
      };
    });

    // Sort by highest match score
    matchedCandidates.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json(matchedCandidates);
  } catch (error) {
    console.error('Error matching candidates:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Analyze candidate using AI
// @route   POST /api/ai-match
exports.aiMatchCandidate = async (req, res) => {
  try {
    const { candidateId } = req.body;
    const candidate = await Candidate.findById(candidateId);
    
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const prompt = `
    Analyze the following employee profile and provide a JSON response with career insights.
    
    Employee Profile:
    - Name: ${candidate.name}
    - Department: ${candidate.department}
    - Skills: ${candidate.skills.join(', ')}
    - Performance Score (out of 100): ${candidate.performanceScore}
    - Years of Experience: ${candidate.experience}

    Based on this profile, provide a valid JSON object with the following structure:
    {
      "suitableRole": "A specific job title that fits best",
      "strengths": ["List 2-3 key strengths"],
      "missingSkills": ["List 2-3 skills they should learn for career growth"],
      "trainingSuggestions": "A short sentence suggesting what training they should take",
      "recommendation": "Overall recommendation for promotion or improvement"
    }

    Respond ONLY with the JSON object, nothing else. No markdown formatting like \`\`\`json.
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: "deepseek/deepseek-chat",
        messages: [{ role: "user", content: prompt }],
      });

      let aiResponseText = completion.choices[0].message.content;
      
      // Clean up potential markdown formatting from the response
      aiResponseText = aiResponseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
      
      const parsedData = JSON.parse(aiResponseText);
      res.status(200).json(parsedData);
    } catch (apiError) {
      console.error('OpenRouter API Error:', apiError);
      // Fallback response if API fails
      const fallbackResponse = {
        suitableRole: `${candidate.department} Specialist`,
        strengths: candidate.skills.slice(0, 2),
        missingSkills: ["Leadership", "Advanced Data Analysis"],
        trainingSuggestions: "Focus on expanding current skill set with advanced certifications.",
        recommendation: candidate.performanceScore > 80 ? "Ready for promotion evaluation." : "Needs targeted improvement plan.",
        isFallback: true
      };
      res.status(200).json(fallbackResponse);
    }
  } catch (error) {
    console.error('Error in AI Analysis:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
