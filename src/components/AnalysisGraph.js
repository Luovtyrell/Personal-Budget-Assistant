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

    // Unique categories
    // Instructions:
    // - Extract unique categories from the transactions
    // - This should gather all the categories used in the 'category' field of the transactions
    const categories = []; // Add logic to extract unique categories from transactions

    // Chart data
    // Instructions:
    // - Aggregate income and expense data for each category
    // - For each category, calculate the total 'income' and 'expense'
    // - The data array should return an object like this for each category: { category, Income, Expense }
    const data = []; // Add logic to calculate income and expense for each category

    return (
        <Grid item xs={12} md={4} sx={{ mt: 4 }}>
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
                        <Bar dataKey="Income" stackId="a" fill="#82ca9d" />
                        <Bar dataKey="Expense" stackId="a" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>
        </Grid>
    );
}

export default AnalysisGraph;
