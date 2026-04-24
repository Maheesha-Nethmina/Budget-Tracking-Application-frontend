import { useState } from 'react';
import api from '../Service/api';

function Register({ isOpen, onClose }) {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // THE FIX: Changed '/register' to '/auth/register'
            const response = await api.post('/auth/register', formData);
            
            localStorage.setItem('token', response.data.token);
            window.alert("Registration successful! Redirecting to dashboard...");
            window.location.href = '/dashboard'; 

        } catch (error) {
            console.error("Registration error:", error);
            alert(error.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="auth-card" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                <h2>Register</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <input 
                        type="text" 
                        placeholder="Username" 
                        className="auth-input"
                        onChange={e => setFormData({...formData, username: e.target.value})} 
                        required
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        className="auth-input"
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="auth-input"
                        onChange={e => setFormData({...formData, password: e.target.value})} 
                        required
                    />
                    <button type="submit" className="auth-button">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;