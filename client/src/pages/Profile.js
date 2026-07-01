import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [profile, setProfile] = useState({
    age: '',
    weight: '',
    height: '',
    goalCalories: '',
    dietaryPreferences: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userProfile = res.data.profile || {};
      setProfile({
        age: userProfile.age || '',
        weight: userProfile.weight || '',
        height: userProfile.height || '',
        goalCalories: userProfile.goalCalories || '',
        dietaryPreferences: (userProfile.dietaryPreferences || []).join(', ')
      });
    } catch (err) {
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/users/profile', {
        profile: {
          age: parseInt(profile.age),
          weight: parseFloat(profile.weight),
          height: parseFloat(profile.height),
          goalCalories: parseInt(profile.goalCalories),
          dietaryPreferences: profile.dietaryPreferences.split(',').map(p => p.trim())
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h2>My Profile</h2>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Age (years)</label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={profile.weight}
              onChange={handleChange}
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label>Height (cm)</label>
            <input
              type="number"
              name="height"
              value={profile.height}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Daily Calorie Goal</label>
            <input
              type="number"
              name="goalCalories"
              value={profile.goalCalories}
              onChange={handleChange}
              placeholder="2000"
            />
          </div>

          <div className="form-group">
            <label>Dietary Preferences (comma-separated)</label>
            <textarea
              name="dietaryPreferences"
              value={profile.dietaryPreferences}
              onChange={handleChange}
              placeholder="e.g., Vegetarian, Gluten-Free"
              rows="3"
            ></textarea>
          </div>

          <button type="submit">Save Profile</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
