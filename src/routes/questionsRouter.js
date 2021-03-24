const express = require('express')
const controller = require('../controllers/qaController.js');
const router = express.Router();

router.get('/questions', controller.getQuestions );
router.post('/questions', controller.postQuestion);
router.put('/questions/:question_id/helpful', controller.upvoteQuestion);
router.put('/questions/:question_id/report', controller.reportQuestion);

router.get('/answers', controller.getAnswers);
router.post('/answers', controller.postAnswer);
router.put('/answers/:answer_id/helpful', controller.upvoteAnswer);
router.put('/answers/:answer_id/report', controller.reportAnswer);

module.exports = router;