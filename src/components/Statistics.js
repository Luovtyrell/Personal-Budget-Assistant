import React from 'react';
import { useStore } from '@nanostores/react';
import { transactionsStore } from '../stores/transactionStore';
import { Paper, Typography } from '@mui/material';

function Statistics() {
    const transactions = useStore(transactionsStore);

    // Filter transactions by 'expense' type
    const expenses = transactions.filter(transaction => transaction.type === 'expense');

    // Calculate total expense
    const totalExpense = expenses.reduce((sum, transaction) => sum + transaction.amount, 0);

    // Get unique dates from expenses
    const uniqueDates = [...new Set(expenses.map(transaction => transaction.date))];
    const averageDailyExpense = uniqueDates.length ? (totalExpense / uniqueDates.length) : 0;

    // Find the category with the highest spending
    const categoryExpenses = {};
    expenses.forEach(transaction => {
        if (!categoryExpenses[transaction.category]) {
            categoryExpenses[transaction.category] = 0;
        }
        categoryExpenses[transaction.category] += transaction.amount;
    });

    let maxCategory = null;
    let maxAmount = 0;
    for (const category in categoryExpenses) {
        if (categoryExpenses[category] > maxAmount) {
            maxAmount = categoryExpenses[category];
            maxCategory = category;
        }
    }

    return (
        <Paper sx={{ padding: 2, mt: 2 }}>
            <Typography variant="h6">Key Statistics</Typography>
            <Typography>
                Total Expense: {totalExpense.toFixed(2)} €
            </Typography>
            <Typography>
                Average Daily Expense: {averageDailyExpense.toFixed(2)} €
            </Typography>
            <Typography>
                Highest Spending Category:{' '}
                {maxCategory
                    ? `${maxCategory} (${categoryExpenses[maxCategory].toFixed(2)} €)`
                    : 'No data available'}
            </Typography>
        </Paper>
    );
}

export default Statistics;
