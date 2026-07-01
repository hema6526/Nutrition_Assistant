const express = require('express');
const router = express.Router();
const nutritionController = require('../controllers/nutritionController');
const auth = require('../middleware/auth');

router.post('/meal', auth, nutritionController.addMeal);
router.get('/today', auth, nutritionController.getTodayLog);
router.get('/range', auth, nutritionController.getLogsByDateRange);
router.post('/exercise', auth, nutritionController.addExercise);

module.exports = router;
