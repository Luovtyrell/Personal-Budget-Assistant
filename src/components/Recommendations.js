import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { transactionsStore } from '../stores/transactionStore';
import { CircularProgress, Typography, Box, Paper } from '@mui/material';

function Recommendations() {
    const transactions = useStore(transactionsStore);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const calculateTransactions = () => {
            try {
                const expenses = transactions.filter(t => t.type === 'expense');
                const income = transactions.filter(t => t.type === 'income');

                if (expenses.length > 0) {
                    setMessage('You have recorded expenses. Keep an eye on your spending!');
                } else if (income.length > 0) {
                    setMessage('Good job! You have recorded income. Keep it up!');
                } else {
                    setMessage('No transactions recorded yet. Start adding your expenses and income!');
                }

                setLoading(false);
            } catch (error) {
                setError("Error fetching data");
                setLoading(false);
            }
        };

        setLoading(true);
        calculateTransactions();
    }, [transactions]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Paper sx={{ padding: 2, mt: 2 }}>
                <Typography variant="h6">Recommendations</Typography>
                <Typography>{message}</Typography>
            </Paper>
        </Box>
    );
}

export default Recommendations;
