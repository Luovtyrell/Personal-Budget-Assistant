import React, { useState, useEffect, Profiler, Suspense } from 'react';
import { Box, Typography, CircularProgress, Paper, Avatar, List, ListItem, ListItemAvatar, ListItemText, TextField, Button } from '@mui/material';
import { onRenderCallback } from '../utils/onRenderCallback';
import ContactList from './ContactList';

function SupportPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Implement the effect to get user data from the API (`https://jsonplaceholder.typicode.com/users`)
  useEffect(() => {
    const fetchUsersFromApi = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error('Failed to fetch');
        const dataUsers = await response.json();
        console.log('Fetched Users:', dataUsers)
        setUsers(dataUsers);
      }
      catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUsersFromApi()
  }, []);

  // Filter users by search term
  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => { setSearchTerm(event.target.value) };

  // Display loading spinner
  if (loading) {
    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  // Display error
  if (error) {
    return (
      <>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Box>
      </>
    )
  }

  return (
    <Profiler id="SupportPage" onRender={onRenderCallback}>
      <Box sx={{ mt: 4, p: { xs: 2, md: 4 }, bgcolor: 'background.default' }}>
        <Typography variant="h4" gutterBottom color="primary">
          Support Contacts
        </Typography>

        {/* Search bar */}
        <TextField
          label="Search by Name"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 4 }}
        />

        {/* Support contact list */}
        <Suspense fallback={<CircularProgress />}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <List>
              {filteredUsers.map(user => (
                <ContactList key={user.id} user={user} /> 
              ))}
            </List>
          </Paper>
        </Suspense>
      </Box>
    </Profiler>
  );
}

export default SupportPage;