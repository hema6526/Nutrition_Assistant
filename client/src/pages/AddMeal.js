import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddMeal() {
  const [mealType, setMealType] = useState('breakfast');
  const [foodItems, setFoodItems] = useState([{ name: '', quantity: '', unit: '', calories: '' }]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddFoodItem = () => {
    setFoodItems([...foodItems, { name: '', quantity: '', unit: '', calories: '' }]);
  };

  const handleRemoveFoodItem = (idx) => {
    setFoodItems(foodItems.filter((_, i) => i !== idx));
  };

  const handleFoodItemChange = (idx, field, value) => {
    const newItems = [...foodItems];
    newItems[idx][field] = value;
    setFoodItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const meals = [{
        mealType,
        foodItems: foodItems.map(item => ({
          ...item,
          quantity: parseFloat(item.quantity),
          calories: parseFloat(item.calories)
        }))
      }];

      await axios.post('/api/nutrition/meal', { date, meals }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Meal added successfully!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add meal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h2>Add Meal</h2>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Meal Type</label>
            <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <h3>Food Items</h3>
          {foodItems.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
              <div className="form-group">
                <label>Food Name</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleFoodItemChange(idx, 'name', e.target.value)}
                  placeholder="e.g., Chicken Breast"
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleFoodItemChange(idx, 'quantity', e.target.value)}
                    placeholder="100"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) => handleFoodItemChange(idx, 'unit', e.target.value)}
                    placeholder="g"
                  />
                </div>
                <div className="form-group">
                  <label>Calories</label>
                  <input
                    type="number"
                    value={item.calories}
                    onChange={(e) => handleFoodItemChange(idx, 'calories', e.target.value)}
                    placeholder="165"
                    required
                  />
                </div>
              </div>
              {foodItems.length > 1 && (
                <button type="button" onClick={() => handleRemoveFoodItem(idx)} style={{ background: '#e74c3c' }}>
                  Remove
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={handleAddFoodItem} style={{ background: '#3498db', marginBottom: '1rem' }}>
            + Add Another Food Item
          </button>

          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Meal'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddMeal;
