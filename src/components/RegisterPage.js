import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { login } from '../stores/authStore';

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();

        // Validate that all fields (email, password, confirmPassword) are filled.
        if (!email || !password || !confirmPassword) {
            setError('All fields are required.');
            return;
        }

        // Check if the passwords match.
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Check if the email is already registered in localStorage.
        const existingUser = JSON.parse(localStorage.getItem('user'));
        if (existingUser && existingUser.email === email) {
            setError('Email is already registered.');
            return;
        }

        // Save the new user's data to localStorage.
        const newUser = { email, password };
        localStorage.setItem('user', JSON.stringify(newUser));

        // Automatically log the user in after successful registration.
        login(newUser);

        // Redirect the user to the dashboard.
        setSuccess(true);
        setTimeout(() => {
            navigate('/');
        }, 2000);
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom>
                Register
            </Typography>
            <form onSubmit={handleRegister}>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    name="confirmPassword"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Register
                </Button>

                <Box sx={{ mt: 2 }}>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        <Button variant="text">Have an account? Login</Button>
                    </Link>
                </Box>

            </form>

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    Account created successfully! Redirecting to login...
                </Alert>
            )}
        </Box>
    );
}

export default RegisterPage;
