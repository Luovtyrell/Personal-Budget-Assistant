import React from 'react';
import { useStore } from '@nanostores/react';
import { transactionsStore } from '../stores/transactionStore';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Grid, Typography, Paper } from '@mui/material';

function AnalysisGraph() {
    const transactions = useStore(transactionsStore);

    const categoriesSet = new Set();
    transactions.forEach(transaction => {
        if (transaction.category) {
            categoriesSet.add(transaction.category);
        }
    });
    const categories = Array.from(categoriesSet);

    const data = categories.map(category => {
        const categoryTransactions = transactions.filter(transaction => transaction.category === category);

        const totalIncome = categoryTransactions
            .filter(transaction => transaction.type === 'income')
            .reduce((acc, curr) => acc + curr.amount, 0);

        const totalExpense = categoryTransactions
            .filter(transaction => transaction.type === 'expense')
            .reduce((acc, curr) => acc + curr.amount, 0);

        return {
            category,
            Income: totalIncome,
            Expense: totalExpense,
        };
    });

    return (
        <Grid item xs={12} md={4}>
            <Paper sx={{ padding: 2, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Income vs. Expenses by Category
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data}>
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Income" stackId="a" fill="#6dcf91" />
                        <Bar dataKey="Expense" stackId="a" fill="#f56e6e" />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>
        </Grid>
    );
}

export default AnalysisGraph;