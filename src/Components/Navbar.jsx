import React from 'react';

function Navbar({ onLoginClick, onRegisterClick }) {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <h2>FinanceApp</h2>
      </div>
      <div className="nav-buttons">
        <button onClick={onLoginClick} className="btn-outline">
          Login
        </button>
        <button onClick={onRegisterClick} className="btn-primary">
          Register
        </button>
      </div>
    </nav>
  );
}

export default Navbar;