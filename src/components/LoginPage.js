import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../stores/authStore';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    Grid
} from '@mui/material';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showCredentials, setShowCredentials] = useState(false);
    const navigate = useNavigate();

    const defaultCredentials = {
        email: 'default@example.com',
        password: 'password123'
    };

    const handleLogin = (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Email and password are required.');
            return;
        }

        const storedUser = JSON.parse(localStorage.getItem('user'));

        // Validar credenciales
        if (
            (email === defaultCredentials.email && password === defaultCredentials.password) ||
            (storedUser && email === storedUser.email && password === storedUser.password)
        ) {
            const userData = { email };
            login(userData);
            navigate('/');
        } else {
            setError('Invalid email or password.');
        }
    };


    const handleShowDefaultCredentials = () => {
        // Show default credentials in case the user requests it
        setEmail(defaultCredentials.email);
        setPassword(defaultCredentials.password);
        setShowCredentials(true);
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 2, border: '1px solid #ddd', borderRadius: 2, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleLogin}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            Login
                        </Button>
                    </Grid>
                </Grid>
            </form>

            {/* Show error message when applicable */}
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
            <Box sx={{ mt: 2 }}>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                    <Button variant="text">Don't have an account? Register</Button>
                </Link>
            </Box>

            {/* Show default credentials button */}
            <Button onClick={handleShowDefaultCredentials}>
                Show Default Credentials
            </Button>

            {showCredentials && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    <strong>Email:</strong> {defaultCredentials.email}<br />
                    <strong>Password:</strong> {defaultCredentials.password}
                </Alert>
            )}
        </Box>
    );
}

export default LoginPage;
