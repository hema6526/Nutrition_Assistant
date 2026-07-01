const NutritionLog = require('../models/NutritionLog');

exports.addMeal = async (req, res) => {
  try {
    const { date, meals } = req.body;

    let log = await NutritionLog.findOne({
      userId: req.user.id,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999)
      }
    });

    if (!log) {
      log = new NutritionLog({
        userId: req.user.id,
        date: new Date(date),
        meals: []
      });
    }

    log.meals.push(...meals);
    
    // Calculate daily totals
    let dailyCalories = 0, dailyProtein = 0, dailyCarbs = 0, dailyFat = 0;
    
    log.meals.forEach(meal => {
      meal.foodItems.forEach(item => {
        dailyCalories += item.calories || 0;
        dailyProtein += item.protein || 0;
        dailyCarbs += item.carbs || 0;
        dailyFat += item.fat || 0;
      });
    });

    log.dailyTotal = { calories: dailyCalories, protein: dailyProtein, carbs: dailyCarbs, fat: dailyFat };

    await log.save();
    res.status(201).json({ message: 'Meal added', log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTodayLog = async (req, res) => {
  try {
    const today = new Date();
    const log = await NutritionLog.findOne({
      userId: req.user.id,
      date: {
        $gte: new Date(today).setHours(0, 0, 0, 0),
        $lt: new Date(today).setHours(23, 59, 59, 999)
      }
    });

    if (!log) {
      return res.json({ message: 'No log found for today', log: null });
    }

    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLogsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const logs = await NutritionLog.find({
      userId: req.user.id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addExercise = async (req, res) => {
  try {
    const { date, exercise } = req.body;

    let log = await NutritionLog.findOne({
      userId: req.user.id,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999)
      }
    });

    if (!log) {
      log = new NutritionLog({
        userId: req.user.id,
        date: new Date(date),
        exercise: [exercise]
      });
    } else {
      log.exercise.push(exercise);
    }

    await log.save();
    res.status(201).json({ message: 'Exercise added', log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
