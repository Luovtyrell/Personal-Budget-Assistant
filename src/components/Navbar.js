import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, Box, Button, Badge, Switch, List, ListItem, ListItemText, Typography, Avatar, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link, useNavigate } from 'react-router-dom';
import logoBlue from '../assets/caixabank-icon-blue.png'
import { logout, authStore } from '../stores/authStore'
import { useStore } from '@nanostores/react';

const Navbar = ({ toggleTheme, isDarkMode, isAuthenticated }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate()
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
            <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
                <Toolbar>
                    <IconButton edge="start" aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                    <div className='logo'>
                        <img
                            src={logoBlue}
                            alt="CaixaBank logo"
                            style={{ height: '40px', marginLeft: '8px' }}
                        />
                    </div>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontStyle: 'italic' }}>
                        CaixaBankNow
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {isAuthenticated ? (
                            <>
                                <Button component={Link} to="/" color="inherit">Dashboard</Button>
                                <Button component={Link} to="/transactions" color="inherit">Transactions</Button>
                                <Button component={Link} to="/analysis" color="inherit">Analysis</Button>
                                <Button component={Link} to="/settings" color="inherit">Settings</Button>
                                <Button component={Link} to="/support" color="inherit">Support</Button>
                                <Button onClick={handleLogout} color="inherit">Logout</Button>
                            </>
                        ) : (
                            <>
                                <Button component={Link} to="/login" color="inherit">Login</Button>
                                <Button component={Link} to="/register" color="inherit">Register</Button>
                            </>
                        )}
                    </Box>
                    <Switch checked={isDarkMode} onChange={toggleTheme} />
                    <Box>
                        <IconButton color="primary">
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
                >
                    <List>
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