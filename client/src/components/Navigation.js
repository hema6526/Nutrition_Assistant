import React from 'react';
import { Link } from 'react-router-dom';

function Navigation({ onLogout, user }) {
  return (
    <nav>
      <div>
        <h2>🥗 Nutrition Assistant</h2>
      </div>
      <div>
        <Link to="/">Dashboard</Link>
        <Link to="/analytics">Analytics</Link>
        <Link to="/add-meal">Add Meal</Link>
        <Link to="/profile">Profile</Link>
        <button onClick={onLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navigation;
