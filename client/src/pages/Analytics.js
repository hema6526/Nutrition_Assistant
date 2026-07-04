import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Analytics() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('calories'); // 'calories' or 'macros'
  const [hoveredPoint, setHoveredPoint] = useState(null); // { dayIndex, x, y, calories, protein, carbs, fat, date }

  useEffect(() => {
    fetchWeekData();
  }, []);

  const fetchWeekData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Calculate start date (7 days ago) and end date (today)
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);

      const res = await axios.get('/api/nutrition/range', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      setLogs(res.data);
    } catch (err) {
      setError('Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  // Generate 7-day data structure
  const getChartData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      
      // Default empty log
      const dayData = {
        dateStr,
        dateKey,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        hasLog: false
      };

      // Match fetched database log
      const matchedLog = logs.find(log => {
        const logDateKey = new Date(log.date).toISOString().split('T')[0];
        return logDateKey === dateKey;
      });

      if (matchedLog && matchedLog.dailyTotal) {
        dayData.calories = matchedLog.dailyTotal.calories || 0;
        dayData.protein = matchedLog.dailyTotal.protein || 0;
        dayData.carbs = matchedLog.dailyTotal.carbs || 0;
        dayData.fat = matchedLog.dailyTotal.fat || 0;
        dayData.hasLog = true;
      }

      data.push(dayData);
    }
    return data;
  };

  if (loading) return <div className="container"><p>Loading analytics...</p></div>;
  if (error) return <div className="container"><div className="alert alert-error">{error}</div></div>;

  const chartData = getChartData();
  
  // Calculate average stats
  const totalCalories = chartData.reduce((acc, curr) => acc + curr.calories, 0);
  const averageCalories = Math.round(totalCalories / 7);

  const totalProtein = chartData.reduce((acc, curr) => acc + curr.protein, 0);
  const averageProtein = Math.round(totalProtein / 7);

  const totalCarbs = chartData.reduce((acc, curr) => acc + curr.carbs, 0);
  const averageCarbs = Math.round(totalCarbs / 7);

  const totalFat = chartData.reduce((acc, curr) => acc + curr.fat, 0);
  const averageFat = Math.round(totalFat / 7);

  // SVG Chart configuration
  const width = 800;
  const height = 350;
  const padding = { top: 40, right: 30, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find max values to scale chart
  let maxCalVal = Math.max(...chartData.map(d => d.calories));
  if (maxCalVal === 0) maxCalVal = 2000;
  const yCalMax = Math.ceil(maxCalVal * 1.2 / 500) * 500; // grid scale

  let maxMacroVal = Math.max(...chartData.map(d => Math.max(d.protein, d.carbs, d.fat)));
  if (maxMacroVal === 0) maxMacroVal = 150;
  const yMacroMax = Math.ceil(maxMacroVal * 1.2 / 50) * 50;

  // Grid coordinates
  const calGridValues = [0, yCalMax * 0.25, yCalMax * 0.5, yCalMax * 0.75, yCalMax];
  const macroGridValues = [0, yMacroMax * 0.25, yMacroMax * 0.5, yMacroMax * 0.75, yMacroMax];

  // Compute points for SVG lines
  const pointsCalories = chartData.map((d, i) => {
    const x = padding.left + (i / 6) * chartWidth;
    const y = padding.top + chartHeight - (d.calories / yCalMax) * chartHeight;
    return { x, y, data: d, index: i };
  });

  const pointsProtein = chartData.map((d, i) => {
    const x = padding.left + (i / 6) * chartWidth;
    const y = padding.top + chartHeight - (d.protein / yMacroMax) * chartHeight;
    return { x, y, data: d, index: i };
  });

  const pointsCarbs = chartData.map((d, i) => {
    const x = padding.left + (i / 6) * chartWidth;
    const y = padding.top + chartHeight - (d.carbs / yMacroMax) * chartHeight;
    return { x, y, data: d, index: i };
  });

  const pointsFat = chartData.map((d, i) => {
    const x = padding.left + (i / 6) * chartWidth;
    const y = padding.top + chartHeight - (d.fat / yMacroMax) * chartHeight;
    return { x, y, data: d, index: i };
  });

  // Helper to make line SVG path string
  const getPathString = (points) => {
    return points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');
  };

  // Helper for area fill path string under line
  const getAreaPathString = (points) => {
    if (points.length === 0) return '';
    const first = points[0];
    const last = points[points.length - 1];
    const linePath = getPathString(points);
    return `${linePath} L ${last.x} ${padding.top + chartHeight} L ${first.x} ${padding.top + chartHeight} Z`;
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Day-by-Day Analytics</h1>
        <div className="tab-group" style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`btn-tab ${activeTab === 'calories' ? 'active' : ''}`}
            onClick={() => { setActiveTab('calories'); setHoveredPoint(null); }}
            style={{ 
              backgroundColor: activeTab === 'calories' ? '#27ae60' : '#ddd',
              color: activeTab === 'calories' ? 'white' : '#333'
            }}
          >
            Calorie Intake
          </button>
          <button 
            className={`btn-tab ${activeTab === 'macros' ? 'active' : ''}`}
            onClick={() => { setActiveTab('macros'); setHoveredPoint(null); }}
            style={{ 
              backgroundColor: activeTab === 'macros' ? '#27ae60' : '#ddd',
              color: activeTab === 'macros' ? 'white' : '#333'
            }}
          >
            Macronutrients
          </button>
        </div>
      </div>

      <div className="dashboard" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-box" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
          <h3>Avg Daily Calories</h3>
          <div className="value">{averageCalories} kcal</div>
          <p>Over the last 7 days</p>
        </div>
        <div className="stat-box" style={{ background: 'linear-gradient(135deg, #e74c3c 0%, #f39c12 100%)' }}>
          <h3>Avg Protein</h3>
          <div className="value">{averageProtein}g</div>
          <p>Weekly average</p>
        </div>
        <div className="stat-box" style={{ background: 'linear-gradient(135deg, #3498db 0%, #9b59b6 100%)' }}>
          <h3>Avg Carbs / Fat</h3>
          <div className="value">{averageCarbs}g / {averageFat}g</div>
          <p>Weekly average</p>
        </div>
      </div>

      <div className="card" style={{ position: 'relative', overflow: 'visible' }}>
        <h2>{activeTab === 'calories' ? '7-Day Calorie Intake Trend' : '7-Day Macronutrient Distribution'}</h2>
        
        {/* Render Chart using Inline SVG */}
        <div style={{ width: '100%', overflowX: 'auto', marginTop: '1rem' }}>
          <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ background: '#fff', borderRadius: '8px' }}>
            <defs>
              <linearGradient id="cal-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#27ae60" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#27ae60" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Render Grid Lines */}
            {(activeTab === 'calories' ? calGridValues : macroGridValues).map((val, idx) => {
              const currentMax = activeTab === 'calories' ? yCalMax : yMacroMax;
              const y = padding.top + chartHeight - (val / currentMax) * chartHeight;
              return (
                <g key={idx}>
                  <line 
                    x1={padding.left} 
                    y1={y} 
                    x2={width - padding.right} 
                    y2={y} 
                    stroke="#eee" 
                    strokeWidth="1" 
                  />
                  <text 
                    x={padding.left - 10} 
                    y={y + 4} 
                    textAnchor="end" 
                    fontSize="12" 
                    fill="#888"
                  >
                    {Math.round(val)}{activeTab === 'macros' ? 'g' : ''}
                  </text>
                </g>
              );
            })}

            {/* X-Axis labels */}
            {chartData.map((d, i) => {
              const x = padding.left + (i / 6) * chartWidth;
              return (
                <text 
                  key={i} 
                  x={x} 
                  y={height - padding.bottom + 25} 
                  textAnchor="middle" 
                  fontSize="12" 
                  fill="#666"
                >
                  {d.dateStr}
                </text>
              );
            })}

            {/* Chart Area and Lines */}
            {activeTab === 'calories' && (
              <>
                {/* Area Gradient */}
                <path 
                  d={getAreaPathString(pointsCalories)} 
                  fill="url(#cal-gradient)" 
                />
                {/* Calorie Line */}
                <path 
                  d={getPathString(pointsCalories)} 
                  fill="none" 
                  stroke="#27ae60" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
                {/* Data Points */}
                {pointsCalories.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint?.dayIndex === i ? 7 : 5}
                    fill="#27ae60"
                    stroke="#fff"
                    strokeWidth="2"
                    style={{ cursor: 'pointer', transition: 'r 0.2s' }}
                    onMouseEnter={() => setHoveredPoint({
                      dayIndex: i,
                      x: p.x,
                      y: p.y,
                      calories: p.data.calories,
                      protein: p.data.protein,
                      carbs: p.data.carbs,
                      fat: p.data.fat,
                      date: p.data.dateStr
                    })}
                  />
                ))}
              </>
            )}

            {activeTab === 'macros' && (
              <>
                {/* Protein Line */}
                <path 
                  d={getPathString(pointsProtein)} 
                  fill="none" 
                  stroke="#e74c3c" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
                {/* Carbs Line */}
                <path 
                  d={getPathString(pointsCarbs)} 
                  fill="none" 
                  stroke="#3498db" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
                {/* Fat Line */}
                <path 
                  d={getPathString(pointsFat)} 
                  fill="none" 
                  stroke="#f1c40f" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />

                {/* Protein Points */}
                {pointsProtein.map((p, i) => (
                  <circle
                    key={`p-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint?.dayIndex === i ? 7 : 5}
                    fill="#e74c3c"
                    stroke="#fff"
                    strokeWidth="2"
                    style={{ cursor: 'pointer', transition: 'r 0.2s' }}
                    onMouseEnter={() => setHoveredPoint({
                      dayIndex: i,
                      x: p.x,
                      y: p.y,
                      calories: p.data.calories,
                      protein: p.data.protein,
                      carbs: p.data.carbs,
                      fat: p.data.fat,
                      date: p.data.dateStr
                    })}
                  />
                ))}

                {/* Carbs Points */}
                {pointsCarbs.map((p, i) => (
                  <circle
                    key={`c-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint?.dayIndex === i ? 7 : 5}
                    fill="#3498db"
                    stroke="#fff"
                    strokeWidth="2"
                    style={{ cursor: 'pointer', transition: 'r 0.2s' }}
                    onMouseEnter={() => setHoveredPoint({
                      dayIndex: i,
                      x: p.x,
                      y: p.y,
                      calories: p.data.calories,
                      protein: p.data.protein,
                      carbs: p.data.carbs,
                      fat: p.data.fat,
                      date: p.data.dateStr
                    })}
                  />
                ))}

                {/* Fat Points */}
                {pointsFat.map((p, i) => (
                  <circle
                    key={`f-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint?.dayIndex === i ? 7 : 5}
                    fill="#f1c40f"
                    stroke="#fff"
                    strokeWidth="2"
                    style={{ cursor: 'pointer', transition: 'r 0.2s' }}
                    onMouseEnter={() => setHoveredPoint({
                      dayIndex: i,
                      x: p.x,
                      y: p.y,
                      calories: p.data.calories,
                      protein: p.data.protein,
                      carbs: p.data.carbs,
                      fat: p.data.fat,
                      date: p.data.dateStr
                    })}
                  />
                ))}
              </>
            )}
          </svg>
        </div>

        {/* Hover Tooltip display */}
        {hoveredPoint && (
          <div 
            style={{
              position: 'absolute',
              top: `${hoveredPoint.y - 120}px`,
              left: `${hoveredPoint.x - 70}px`,
              backgroundColor: 'rgba(44, 62, 80, 0.95)',
              color: '#fff',
              padding: '0.75rem',
              borderRadius: '6px',
              fontSize: '12px',
              pointerEvents: 'none',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              zIndex: 10,
              width: '150px'
            }}
          >
            <div style={{ fontWeight: 'bold', borderBottom: '1px solid #7f8c8d', paddingBottom: '0.25rem', marginBottom: '0.25rem' }}>
              {hoveredPoint.date}
            </div>
            <div>🔥 {hoveredPoint.calories} kcal</div>
            <div style={{ color: '#ff7675' }}>🥩 Protein: {hoveredPoint.protein.toFixed(1)}g</div>
            <div style={{ color: '#74b9ff' }}>🍞 Carbs: {hoveredPoint.carbs.toFixed(1)}g</div>
            <div style={{ color: '#ffeaa7' }}>🥑 Fat: {hoveredPoint.fat.toFixed(1)}g</div>
          </div>
        )}
        
        {activeTab === 'macros' && (
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '14px' }}>
              <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#e74c3c', borderRadius: '2px' }} />
              Protein
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '14px' }}>
              <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#3498db', borderRadius: '2px' }} />
              Carbs
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '14px' }}>
              <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#f1c40f', borderRadius: '2px' }} />
              Fat
            </span>
          </div>
        )}

        <p style={{ color: '#888', fontSize: '12px', textAlign: 'center', marginTop: '1rem' }}>
          *Hover over any dot on the chart to inspect daily statistics detail.
        </p>
      </div>
    </div>
  );
}

export default Analytics;
