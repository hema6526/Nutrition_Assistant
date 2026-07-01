import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [dailyLog, setDailyLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodayLog();
  }, []);

  const fetchTodayLog = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/nutrition/today', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDailyLog(res.data.log);
    } catch (err) {
      setError('Failed to fetch today\'s log');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  const dailyTotal = dailyLog?.dailyTotal || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  return (
    <div className="container">
      <h1>Dashboard</h1>
      {error && <div className="alert alert-error">{error}</div>}
      
      <div className="dashboard">
        <div className="stat-box">
          <h3>Calories</h3>
          <div className="value">{dailyTotal.calories}</div>
          <p>Goal: 2000 kcal</p>
        </div>
        <div className="stat-box">
          <h3>Protein</h3>
          <div className="value">{dailyTotal.protein.toFixed(1)}g</div>
          <p>Goal: 150g</p>
        </div>
        <div className="stat-box">
          <h3>Carbs</h3>
          <div className="value">{dailyTotal.carbs.toFixed(1)}g</div>
          <p>Goal: 225g</p>
        </div>
        <div className="stat-box">
          <h3>Fat</h3>
          <div className="value">{dailyTotal.fat.toFixed(1)}g</div>
          <p>Goal: 65g</p>
        </div>
      </div>

      {dailyLog && dailyLog.meals && dailyLog.meals.length > 0 && (
        <div className="card">
          <h2>Today's Meals</h2>
          {dailyLog.meals.map((meal, idx) => (
            <div key={idx} style={{ marginBottom: '1rem', borderLeft: '4px solid #27ae60', paddingLeft: '1rem' }}>
              <h4>{meal.mealType.toUpperCase()}</h4>
              {meal.foodItems.map((item, i) => (
                <p key={i}>{item.name} - {item.calories} cal</p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
