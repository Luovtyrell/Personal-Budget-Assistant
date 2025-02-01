import React from 'react';
import { Box, Typography, Paper, IconButton, InputBase, Button } from '@mui/material';
import bgMaps from '../assets/bgmaps.png';
import { Facebook, Twitter, Instagram, Search } from '@mui/icons-material';

const Footer = () => {
    return (
        <Box
            component="footer"
            className="bg-cover bg-center p-6 h-64 mt-2"
            style={{ backgroundImage: `url(${bgMaps})` }}
        >
            {/* Search bar */}
            <Box className="flex justify-center mt-2 mb-4">
                <Paper component="form">
                    <IconButton aria-label="search">
                        <Search />
                    </IconButton>
                    <InputBase placeholder="Find your branch..." />
                    <Button type="submit">Search</Button>
                </Paper>
            </Box>

            <Box className="flex justify-center mt-2 mb-4">
                <Typography color="info">
                    © {new Date().getFullYear()} Lucía Ordoñez Vilanova
                </Typography>
            </Box>

            {/* Social media icons */}
            <Box className="flex justify-center mt-2 mb-4">
                <IconButton component="a" href="https://facebook.com" target="_blank" aria-label="Facebook">
                    <Facebook color="info" />
                </IconButton>
                <IconButton component="a" href="https://twitter.com" target="_blank" aria-label="Twitter">
                    <Twitter color="info" />
                </IconButton>
                <IconButton component="a" href="https://instagram.com" target="_blank" aria-label="Instagram">
                    <Instagram color="info" />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Footer;
