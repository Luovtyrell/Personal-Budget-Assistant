import React from 'react';
import { useStore } from '@nanostores/react';
import { transactionsStore } from '../stores/transactionStore';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Grid, Typography, Paper } from '@mui/material';

function BalanceOverTime() {
    const transactions = useStore(transactionsStore);

    // Sort transactions by date
    const sortedTransactions = transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate cumulative balance
    let cumulativeBalance = 0;
    const data = sortedTransactions.map(transaction => {
        cumulativeBalance += transaction.amount;
        return {
            date: new Date(transaction.date).toLocaleDateString(),
            Balance: cumulativeBalance,
        };
    });

    return (
        <Grid item xs={12} md={8}>
            <Paper sx={{ padding: 2, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Balance Over Time
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="Balance" stroke="#007EAE" />
                    </LineChart>
                </ResponsiveContainer>
            </Paper>
        </Grid>
    );
}

export default BalanceOverTime;
