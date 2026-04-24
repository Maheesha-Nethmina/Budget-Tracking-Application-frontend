import React from 'react';

function Navbar({ onLoginClick, onRegisterClick, isAuthenticated, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <h2 style={{ margin: 0 }}>FinanceApp</h2>
      </div>
      <div className="nav-buttons">
        
        {/* Conditional Rendering based on Authentication state */}
        {isAuthenticated ? (
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button 
              onClick={onLogout} 
              className="btn-outline" 
              style={{ borderColor: '#ef4444', color: '#ef4444' }}
            >
              Logout
            </button>
          </div>

        ) : (
          
          <>
            <button onClick={onLoginClick} className="btn-outline">
              Login
            </button>
            <button onClick={onRegisterClick} className="btn-primary">
              Register
            </button>
          </>

        )}

      </div>
    </nav>
  );
}

export default Navbar;