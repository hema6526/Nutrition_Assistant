import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [dailyLog, setDailyLog] = useState(null);
  const [weeklyLogs, setWeeklyLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredPoint, setHoveredPoint] = useState(null); // { dayIndex, x, y, calories }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Fetch today's log
      const todayRes = await axios.get('/api/nutrition/today', { headers });
      const logData = todayRes.data;
      if (logData && (logData.meals || logData._id)) {
        setDailyLog(logData);
      } else {
        setDailyLog(null);
      }

      // 2. Fetch past week logs for the trend chart
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);

      const weeklyRes = await axios.get('/api/nutrition/range', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        },
        headers
      });
      setWeeklyLogs(weeklyRes.data);

    } catch (err) {
      setError('Failed to fetch dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  // Generate 7-day data mapping for the SVG chart
  const getChartData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
      
      const dayData = {
        dateStr,
        dateKey,
        calories: 0
      };

      const matchedLog = weeklyLogs.find(log => {
        const logDateKey = new Date(log.date).toISOString().split('T')[0];
        return logDateKey === dateKey;
      });

      if (matchedLog && matchedLog.dailyTotal) {
        dayData.calories = matchedLog.dailyTotal.calories || 0;
      }

      data.push(dayData);
    }
    return data;
  };

  if (loading) return <div className="container"><p>Loading dashboard...</p></div>;

  const dailyTotal = dailyLog?.dailyTotal || { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const chartData = getChartData();

  // SVG Chart Configuration
  const width = 550;
  const height = 250;
  const padding = { top: 25, right: 15, bottom: 40, left: 45 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale Y-axis
  let maxCalVal = Math.max(...chartData.map(d => d.calories));
  if (maxCalVal === 0) maxCalVal = 2000;
  const yCalMax = Math.ceil(maxCalVal * 1.2 / 500) * 500;
  const gridValues = [0, yCalMax * 0.5, yCalMax];

  // Coordinates
  const points = chartData.map((d, i) => {
    const x = padding.left + (i / 6) * chartWidth;
    const y = padding.top + chartHeight - (d.calories / yCalMax) * chartHeight;
    return { x, y, data: d, index: i };
  });

  const pathString = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaPathString = points.length > 0
    ? `${pathString} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`
    : '';

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Dashboard</h1>
        <span style={{ fontSize: '14px', color: '#666' }}>Today's Date: {new Date().toLocaleDateString()}</span>
      </div>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      {/* 4 Stat Boxes */}
      <div className="dashboard" style={{ marginBottom: '2rem' }}>
        <div className="stat-box" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
          <h3>Calories</h3>
          <div className="value">{dailyTotal.calories} kcal</div>
          <p>Goal: 2000 kcal</p>
        </div>
        <div className="stat-box" style={{ background: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)' }}>
          <h3>Protein</h3>
          <div className="value">{dailyTotal.protein.toFixed(1)}g</div>
          <p>Goal: 150g</p>
        </div>
        <div className="stat-box" style={{ background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)' }}>
          <h3>Carbs</h3>
          <div className="value">{dailyTotal.carbs.toFixed(1)}g</div>
          <p>Goal: 225g</p>
        </div>
        <div className="stat-box" style={{ background: 'linear-gradient(135deg, #f1c40f 0%, #f39c12 100%)' }}>
          <h3>Fat</h3>
          <div className="value">{dailyTotal.fat.toFixed(1)}g</div>
          <p>Goal: 65g</p>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Side: Today's Meals */}
        <div className="card" style={{ minHeight: '330px' }}>
          <h2>Today's Logged Meals</h2>
          <div style={{ marginTop: '1rem' }}>
            {dailyLog && dailyLog.meals && dailyLog.meals.length > 0 ? (
              dailyLog.meals.map((meal, idx) => (
                <div key={idx} style={{ marginBottom: '1.25rem', borderLeft: '4px solid #27ae60', paddingLeft: '1rem' }}>
                  <h4 style={{ textTransform: 'uppercase', color: '#27ae60', marginBottom: '0.25rem' }}>{meal.mealType}</h4>
                  {meal.foodItems.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#555' }}>
                      <span>{item.name} ({item.quantity} {item.unit})</span>
                      <span><strong>{item.calories} cal</strong></span>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p style={{ color: '#888', fontStyle: 'italic' }}>No meals logged for today. Go to the "Add Meal" page to get started!</p>
            )}
          </div>
        </div>

        {/* Right Side: Day-by-Day Calorie Analytics Chart */}
        <div className="card" style={{ position: 'relative', overflow: 'visible', minHeight: '330px' }}>
          <h2>7-Day Calorie Intake Trend</h2>
          <div style={{ position: 'relative', marginTop: '1.5rem' }}>
            <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
              <defs>
                <linearGradient id="dash-chart-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#27ae60" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#27ae60" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {gridValues.map((val, idx) => {
                const y = padding.top + chartHeight - (val / yCalMax) * chartHeight;
                return (
                  <g key={idx}>
                    <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#f0f0f0" strokeWidth="1" />
                    <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#999">{Math.round(val)}</text>
                  </g>
                );
              })}

              {/* X Axis Labels */}
              {chartData.map((d, i) => {
                const x = padding.left + (i / 6) * chartWidth;
                return (
                  <text key={i} x={x} y={height - padding.bottom + 20} textAnchor="middle" fontSize="10" fill="#777">{d.dateStr}</text>
                );
              })}

              {/* Area under the line */}
              {points.length > 0 && (
                <path d={areaPathString} fill="url(#dash-chart-grad)" />
              )}

              {/* Trend Line */}
              {points.length > 0 && (
                <path d={pathString} fill="none" stroke="#27ae60" strokeWidth="3" strokeLinecap="round" />
              )}

              {/* Interactive Circles */}
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={hoveredPoint?.dayIndex === i ? 6 : 4}
                  fill="#27ae60"
                  stroke="#fff"
                  strokeWidth="2"
                  style={{ cursor: 'pointer', transition: 'r 0.1s' }}
                  onMouseEnter={() => setHoveredPoint({
                    dayIndex: i,
                    x: p.x,
                    y: p.y,
                    calories: p.data.calories,
                    date: p.data.dateStr
                  })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </svg>

            {/* Hover Tooltip */}
            {hoveredPoint && (
              <div
                style={{
                  position: 'absolute',
                  top: `${hoveredPoint.y - 65}px`,
                  left: `${hoveredPoint.x - 55}px`,
                  backgroundColor: 'rgba(44, 62, 80, 0.95)',
                  color: '#fff',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  pointerEvents: 'none',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                  zIndex: 10,
                  textAlign: 'center',
                  width: '110px'
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{hoveredPoint.date}</div>
                <div>🔥 {hoveredPoint.calories} kcal</div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
