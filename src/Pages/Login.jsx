import { useState } from 'react';
import api from '../Service/api';

function Login({ isOpen, onClose }) {
    const [formData, setFormData] = useState({ username: '', password: '' });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', formData);
            localStorage.setItem('token', response.data.token);
            window.alert("Login successful! Redirecting to dashboard...");
            console.log("Login successful:", response.data);
            window.location.href = '/dashboard'; 
        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (
        /* Clicking the overlay closes the modal */
        <div className="modal-overlay" onClick={onClose}>
            {/* e.stopPropagation() prevents clicks inside the card from closing the modal */}
            <div className="auth-card" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                <h2>Login</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <input 
                        type="text" 
                        placeholder="Username" 
                        className="auth-input"
                        onChange={e => setFormData({...formData, username: e.target.value})} 
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
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;