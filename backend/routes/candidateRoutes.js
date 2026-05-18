const express = require('express');
const router = express.Router();
const {
  getCandidates,
  addCandidate,
  deleteCandidate,
  matchCandidates,
  aiMatchCandidate
} = require('../controllers/candidateController');

router.route('/')
  .get(getCandidates)
  .post(addCandidate);

router.route('/:id')
  .delete(deleteCandidate);

router.post('/match', matchCandidates);
router.post('/ai-match', aiMatchCandidate);

module.exports = router;