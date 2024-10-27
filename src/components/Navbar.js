import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, Box, Button, Badge, Switch, List, ListItem, ListItemText, Typography, Avatar, Tooltip, Grid } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link, useNavigate } from 'react-router-dom';
import logoIcon from '../assets/caixabank-icon.png';
import { logout, authStore } from '../stores/authStore';
import { useStore } from '@nanostores/react';

const Navbar = ({ toggleTheme, isDarkMode, isAuthenticated }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useStore(authStore);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" aria-label="menu" onClick={toggleDrawer(true)} sx={{ display: { xs: 'block', md: 'none' } }}>
                        <MenuIcon />
                    </IconButton>
                    <div className='logo'>
                        <img
                            src={logoIcon}
                            alt="CaixaBank logo"
                            style={{ height: '40px', marginLeft: '8px' }}
                        />
                    </div>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontStyle: 'italic', display: { xs: 'none', md: 'block' } }}>
                        CaixaBankNow
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {isAuthenticated ? (
                            <>
                                <Button component={Link} to="/" color="inherit" sx={{ display: { xs: 'none', md: 'block' } }}>Dashboard</Button>
                                <Button component={Link} to="/transactions" color="inherit" sx={{ display: { xs: 'none', md: 'block' } }}>Transactions</Button>
                                <Button component={Link} to="/analysis" color="inherit" sx={{ display: { xs: 'none', md: 'block' } }}>Analysis</Button>
                                <Button component={Link} to="/settings" color="inherit" sx={{ display: { xs: 'none', md: 'block' } }}>Settings</Button>
                                <Button component={Link} to="/support" color="inherit" sx={{ display: { xs: 'none', md: 'block' } }}>Support</Button>
                                <Button onClick={handleLogout} color="inherit" sx={{ display: { xs: 'none', md: 'block' } }}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Button component={Link} to="/login" color="inherit" sx={{ display: { xs: 'none', md: 'block' } }}>Login</Button>
                                <Button component={Link} to="/register" color="inherit" sx={{ display: { xs: 'none', md: 'block' } }}>Register</Button>
                            </>
                        )}
                    </Box>
                    <Switch checked={isDarkMode} onChange={toggleTheme} />
                    <Box>
                        <IconButton>
                            <Badge color="error" variant="dot">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Box>

                    {/* User avatar with tooltip */}
                    {isAuthenticated && (
                        <Tooltip title={user?.email || "User"} arrow>
                            <Avatar
                                alt={user?.email || "User"}
                                src={user?.avatarUrl || `https://i.pravatar.cc/150?img=${user?.id || 21}`}
                                sx={{ width: 40, height: 40, marginLeft: 2 }}
                            />
                        </Tooltip>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                    className="w-56"
                >
                    <List>
                    <h2 className="ml-4 p-5 text-2xl text-primary">Menu</h2>
                        {isAuthenticated ? (
                            <>
                                <ListItem button component={Link} to="/">
                                    <ListItemText primary="Dashboard" />
                                </ListItem>
                                <ListItem button component={Link} to="/transactions">
                                    <ListItemText primary="Transactions" />
                                </ListItem>
                                <ListItem button component={Link} to="/analysis">
                                    <ListItemText primary="Analysis" />
                                </ListItem>
                                <ListItem button component={Link} to="/settings">
                                    <ListItemText primary="Settings" />
                                </ListItem>
                                <ListItem button component={Link} to="/support">
                                    <ListItemText primary="Support" />
                                </ListItem>
                                <ListItem button onClick={handleLogout}>
                                    <ListItemText primary="Logout" />
                                </ListItem>
                            </>
                        ) : (
                            <>
                                <ListItem button component={Link} to="/login">
                                    <ListItemText primary="Login" />
                                </ListItem>
                                <ListItem button component={Link} to="/register">
                                    <ListItemText primary="Register" />
                                </ListItem>
                            </>
                        )}
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default Navbar;
