import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div className="home-container">
      
      <Navbar 
        onLoginClick={() => setIsLoginOpen(true)} 
        onRegisterClick={() => setIsRegisterOpen(true)} 
      />

      {/* Hero Section */}
      <main className="hero-section">
        <h1>Take Control of Your Personal Finances</h1>
        <p>Track your income, monitor expenses, and achieve your budgeting goals with our intuitive dashboard.</p>
        <button onClick={() => setIsRegisterOpen(true)} className="btn-primary hero-btn">
          Get Started Today
        </button>
      </main>

      {/* Modals for login and registration */}
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <Register isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
        <Footer />
    </div>
     
  );
}

export default Home;