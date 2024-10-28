import React, { useState, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { transactionsStore } from '../stores/transactionStore';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import ExportButton from './ExportButton';

function Analysis() {
    const transactions = useStore(transactionsStore);
    const [timeFrame, setTimeFrame] = useState('monthly');

    // Generate Trend Analysis Data
    const trendData = useMemo(() => {
        const groupedData = {};

        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            let key;

            switch (timeFrame) {
                case 'daily':
                    key = date.toISOString().split('T')[0];
                    break;
                case 'weekly':
                    const weekNumber = Math.ceil(date.getDate() / 7);
                    key = `${date.getFullYear()}-W${weekNumber}`;
                    break;
                case 'monthly':
                    key = date.toISOString().split('T')[0].slice(0, 7);
                    break;
                case 'yearly':
                    key = date.getFullYear().toString();
                    break;
                default:
                    key = '';
            }

            if (!groupedData[key]) {
                groupedData[key] = { key, income: 0, expense: 0 };
            }

            if (transaction.type === 'income') {
                groupedData[key].income += transaction.amount;
            } else {
                groupedData[key].expense += transaction.amount;
            }
        });

        return Object.values(groupedData);
    }, [transactions, timeFrame]);

    return (
        <Box sx={{ mt: 4, p: { xs: 2, md: 4 }, bgcolor: 'background.default' }}>
            <Typography variant="h4" gutterBottom color="primary">
                Trend Analysis
            </Typography>

            {transactions.length === 0 && (
                <Typography variant="h6" color="text.secondary">
                    No transactions available.
                </Typography>
            )}

            {/* Controls */}
            <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id="timeframe-select-label">Time Frame</InputLabel>
                        <Select
                            labelId="timeframe-select-label"
                            id="timeframe-select"
                            label="Time Frame"
                            value={timeFrame}
                            onChange={(e) => setTimeFrame(e.target.value)}
                        >
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                            <MenuItem value="yearly">Yearly</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <ExportButton
                        data={trendData}
                        filename={`trend_report_${timeFrame}.csv`}
                        headers={['key', 'income', 'expense']}
                    />
                </Grid>
            </Grid>

            {/* Render the trend analysis chart */}
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Paper sx={{ padding: 2, boxShadow: 3, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom color="text.secondary">
                            Income and Expenses Trend
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={trendData}>
                                <XAxis dataKey="key" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="income" stroke="#28B463" name="Income" />
                                <Line type="monotone" dataKey="expense" stroke="#E74C3C" name="Expenses" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Analysis;
