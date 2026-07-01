const mongoose = require('mongoose');

const nutritionLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  meals: [
    {
      mealType: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        required: true
      },
      foodItems: [
        {
          name: String,
          quantity: Number,
          unit: String,
          calories: Number,
          protein: Number,
          carbs: Number,
          fat: Number
        }
      ],
      totalCalories: Number,
      totalProtein: Number,
      totalCarbs: Number,
      totalFat: Number
    }
  ],
  dailyTotal: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  water: Number,
  exercise: [
    {
      type: String,
      duration: Number,
      caloriesBurned: Number
    }
  ],
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('NutritionLog', nutritionLogSchema);
