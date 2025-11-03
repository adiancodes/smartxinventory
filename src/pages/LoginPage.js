import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // response is now the { token, username, role, storeId } object
            const response = await authService.login(email, password); 

            if (response.token) {
                // authService.login has already saved the token and user to localStorage.
                alert('Login Successful! Redirecting...');
                
                // We can get the role from the response object directly
                if (response.role === 'ADMIN') {
                    navigate('/admin/dashboard');
                } else if (response.role === 'STORE_MANAGER') {
                    navigate('/manager/dashboard'); // <-- ADDED THIS
                } else if (response.role === 'USER') {
                    // navigate('/user/dashboard'); // For later
                    navigate('/'); 
                } else {
                    navigate('/'); // Fallback
                }

            } else {
                setError('Login failed: No token received.');
            }
        } catch (err) {
            console.error("LOGIN FAILED:", err);
            
            if (err.response && err.response.status === 401) {
                setError('Invalid email or password.');
            } else {
                setError('Login failed. Please try again later.');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-panel-left">
                <h2>Welcome Back!</h2>
            </div>
            
            <div className="login-panel-right">
                <div className="login-box">
                    <h3>ALREADY MEMBERS</h3>
                    <a href="#" className="need-help">Need help?</a>
                    
                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="input-group">
                            <input 
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="input-group">
                            <input 
                                type="password" 
                                placeholder="Enter your password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>

                        {error && <p className="error-message">{error}</p>}
                        
                        <button type="submit" className="login-button">SIGN IN</button>
                    </form>
                    
                    <div className="signup-link">
                        <p>Don't have an account yet?</p>
                        <Link to="/register" className="create-account-link">
                            Create an account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
