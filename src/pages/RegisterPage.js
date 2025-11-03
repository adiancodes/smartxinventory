import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './RegisterPage.css'; // Assuming you have this CSS file

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        companyName: '',
        email: '',
        contactNumber: '',
        password: '',
        confirmPassword: '',
        role: 'USER', // Default role
        warehouseLocation: '',
        storeName: '', // New field for store manager
    });
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // A single handler to update the formData state
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (formData.role === 'STORE_MANAGER' && (!formData.storeName || formData.storeName.trim() === '')) {
             setError("Store Manager must have a Store Name.");
            return;
        }
        if (!agreeTerms) {
            setError("You must agree to the Terms and Conditions.");
            return;
        }

        try {
            const dataToSubmit = { ...formData };
            delete dataToSubmit.confirmPassword;

            const response = await authService.register(dataToSubmit);

            if (response.token) {
                // This is the logic you wanted
                alert('Registration Successful! Please log in.');
                navigate('/login'); // Redirects to login page
                
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (err) {
            console.error("REGISTRATION FAILED:", err);
            if (err.response && err.response.data && err.response.data.token) {
                setError(err.response.data.token); // "Email is already taken"
            } else {
                setError('Registration failed. Please try again later.');
            }
        }
    };

    return (
        <div className="register-container">
            <div className="register-info-panel">
                <h2>INFOMATION</h2>
                <p>
                    Welcome to SmartShelfX. Join us to revolutionize your inventory management
                    with AI-powered forecasting and automated restocking.
                </p>
                <p>
                    Already have an account? Log in to access your dashboard.
                </p>
                <Link to="/login" className="login-button-link">
                    Have An Account
                </Link>
            </div>
            
            <div className="register-form-panel">
                <h3>REGISTER FORM</h3>
                <form className="register-form" onSubmit={handleRegister}>
                    {/* Full Name & Company Name */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="companyName">Company Name</label>
                            <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Email & Contact Number */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">Official Email ID</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contactNumber">Contact Number</label>
                            <input type="tel" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Password & Confirm Password */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Role & Warehouse Location */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="role">Role</label>
                            <select id="role" name="role" value={formData.role} onChange={handleChange}>
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                                <option value="STORE_MANAGER">Store Manager</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="warehouseLocation">Warehouse Location</label>
                            <input type="text" id="warehouseLocation" name="warehouseLocation" value={formData.warehouseLocation} onChange={handleChange} />
                        </div>
                    </div>

                    {/* --- NEW CONDITIONAL FIELD --- */}
                    {formData.role === 'STORE_MANAGER' && (
                        <div className="form-row">
                            <div className="form-group full-width">
                                <label htmlFor="storeName">Store Name</label>
                                <input 
                                    type="text" 
                                    id="storeName" 
                                    name="storeName" 
                                    value={formData.storeName || ''} 
                                    onChange={handleChange} 
                                    placeholder="Enter the name of your store"
                                    required 
                                />
                            </div>
                        </div>
                    )}

                    {/* Terms & Conditions */}
                    <div className="terms-group">
                        <input type="checkbox" id="agreeTerms" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
                        <label htmlFor="agreeTerms">I agree to the <a href="#" target="_blank" rel="noopener noreferrer">Terms and Conditions</a></label>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="register-button" disabled={!agreeTerms}>
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;

