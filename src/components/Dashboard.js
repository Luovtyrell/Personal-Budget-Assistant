import React, { Profiler, Suspense } from 'react';
import { useStore } from '@nanostores/react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import ExportButton from './ExportButton';
import DownloadProfilerData from './DownloadProfilerData';
import { onRenderCallback } from '../utils/onRenderCallback';
import { transactionsStore } from '../stores/transactionStore';

// Lazy load components for performance optimization
const AnalysisGraph = React.lazy(() => import('./AnalysisGraph'));
const BalanceOverTime = React.lazy(() => import('./BalanceOverTime'));
const Statistics = React.lazy(() => import('./Statistics'));
const Recommendations = React.lazy(() => import('./Recommendations'));
const RecentTransactions = React.lazy(() => import('./RecentTransactions'));

function Dashboard() {
    const transactions = useStore(transactionsStore);

    const totalIncome = transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalExpense = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    const balance = totalIncome - totalExpense;

    return (
        <Profiler id="Dashboard" onRender={onRenderCallback}>
            <Suspense fallback={<Typography>Loading...</Typography>}>
                <Box sx={{ p: 4 }}>
                    <Typography variant="h3" gutterBottom color='primary'>
                        Financial Summary
                    </Typography>

                    {/* Action Buttons Section */}
                    {/* Instructions:
                    - Add a section with ExportButton and DownloadProfilerData components.
                    - The ExportButton should export the transaction data as a CSV file.
                    - The DownloadProfilerData button should export profiler data in JSON format.
                */}
                    {/* Totals Section */}
                    <Grid container spacing={4} sx={{ mt: 4 }}>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ padding: 2, boxShadow: 3, borderRadius: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Total Income (€)
                                </Typography>
                                <Typography variant="h5" data-testid="total-income">
                                    <p className='text-green-600'> {totalIncome.toFixed(2)}</p>
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ padding: 2, boxShadow: 3, borderRadius: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Total Expenses (€)
                                </Typography>
                                <Typography variant="h5" data-testid="total-expenses">
                                    <p className='text-red-600'> {totalExpense.toFixed(2)}</p>
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ padding: 2, boxShadow: 3, borderRadius: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Balance (€)
                                </Typography>
                                <Typography variant="h5" data-testid="balance">
                                    <p> {balance.toFixed(2)}</p>
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                    {/* Charts Section */}
                    <Grid container spacing={4} sx={{ mt: 4 }}>
                        <AnalysisGraph />
                        <BalanceOverTime />
                    </Grid>
                    <Recommendations />
                    <Statistics />
                    <Typography variant="h5" gutterBottom color="primary" sx={{ mt: 4 }}>
                        Recent transactions
                    </Typography>
                    <RecentTransactions transactions={transactions} />
                </Box>
            </Suspense>
        </Profiler>
    );
}

export default Dashboard;
