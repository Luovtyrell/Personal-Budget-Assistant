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
        setLoading(true);
        setTimeout(() => {
            try {
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth();
                const currentYear = currentDate.getFullYear();

                const expenses = transactions.filter(t => t.type === 'expense');

                const expenseThisMonth = expenses
                    .filter(t => {
                        const transactionDate = new Date(t.date);
                        return transactionDate.getMonth() === currentMonth &&
                            transactionDate.getFullYear() === currentYear;
                    })
                    .reduce((total, t) => total + t.amount, 0);

                const expenseLastMonth = expenses
                    .filter(t => {
                        const transactionDate = new Date(t.date);
                        return transactionDate.getMonth() === (currentMonth - 1 + 12) % 12 &&
                            (currentMonth === 0 ? transactionDate.getFullYear() === currentYear - 1 : transactionDate.getFullYear() === currentYear);
                    })
                    .reduce((total, t) => total + t.amount, 0);

                let newMessage = '';
                if (expenseLastMonth === 0) {
                    newMessage = 'Keep recording your expenses for more accurate recommendations.';
                } else if (expenseThisMonth > expenseLastMonth) {
                    const increasePercentage = ((expenseThisMonth - expenseLastMonth) / expenseLastMonth * 100).toFixed(2);
                    newMessage = `Your expenses increased ${increasePercentage}% Watch out!`;
                } else if (expenseThisMonth < expenseLastMonth) {
                    const decreasePercentage = ((expenseLastMonth - expenseThisMonth) / expenseLastMonth * 100).toFixed(2);
                    newMessage = `Congratulations! Your expense decreased ${decreasePercentage}% `;
                } else {
                    newMessage = 'Good job, no variations!';
                }

                setMessage(newMessage);
                setLoading(false);
            } catch (error) {
                setError("Error fetching data")
                setLoading(false);
            }
        }, 1000);
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
                <Typography variant="h6">Recomendations</Typography>
                <Typography>{message}</Typography>
            </Paper>
        </Box>
    );
}

export default Recommendations;