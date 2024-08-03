import React, { useState } from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Corrected import
import "../styles/login.css";

// Access the environment variable
const URL = process.env.REACT_APP_BACKEND_URL;

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${URL}/api/v1/employees/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            // Check if the response is JSON
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.user.id); 
                    const decoded = jwtDecode(data.token);

                    console.log('User:', decoded);
                    setUser({
                        isAuthenticated: true,
                        role: decoded.role,
                    });
                    const redirectPath = decoded.role === 'admin' ? `/admin/${data.user.id}` : `/user/${data.user.id}`;
                    navigate(redirectPath);
                } else {
                    setError(data.message || 'An error occurred.');
                }
            } else {
                setError('Unexpected server response.');
            }
        } catch (error) {
            setError('An error occurred during login.');
            console.error('Login error:', error);
        }
    };

    return (
        <div className="login-container">
            <h1>Welcome to Performance Feedback</h1>
            <h3>Please Login</h3>
            <form className='login-form' onSubmit={handleLogin}>
                <input
                    type="email"
                    value={email}
                    placeholder='Email'
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    value={password}
                    placeholder='Password'
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit" text="Login" className="login-btn" />
                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default Login;
