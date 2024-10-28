import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { userSettingsStore } from '../stores/userSettingsStore';
import { budgetAlertStore, updateBudgetAlert, resetBudgetAlert } from '../stores/budgetAlertStore';
import {
    Box,
    Typography,
    Switch,
    FormControlLabel,
    TextField,
    Button,
    Grid,
    Paper,
    Alert,
    Snackbar,
} from '@mui/material';
import { expenseCategories } from '../constants/categories';
import { transactionsStore } from '../stores/transactionStore';

function Settings() {
    const userSettings = useStore(userSettingsStore);
    const transactions = useStore(transactionsStore);
    const budgetAlert = useStore(budgetAlertStore);

    const [categoryLimits, setCategoryLimits] = useState(userSettings.categoryLimits || {});
    const [totalBudgetLimit, setTotalBudgetLimit] = useState(userSettings.totalBudgetLimit);
    const [alertsEnabled, setAlertsEnabled] = useState(userSettings.alertsEnabled);
    const [budgetExceeded, setBudgetExceeded] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        checkBudgetLimits();
    }, [transactions, userSettings]);

    const checkBudgetLimits = () => {
        const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        if (totalSpent > totalBudgetLimit && alertsEnabled) {
            updateBudgetAlert(`You've exceeded your total budget limit of ${totalBudgetLimit} €!`);
            setBudgetExceeded(true);
        } else {
            setBudgetExceeded(false);
        }

        // Check category limits
        const categoryTotals = transactions.reduce((totals, transaction) => {
            totals[transaction.category] = (totals[transaction.category] || 0) + transaction.amount;
            return totals;
        }, {});

        Object.entries(categoryTotals).forEach(([category, total]) => {
            if (categoryLimits[category] && total > categoryLimits[category] && alertsEnabled) {
                updateBudgetAlert(`You've exceeded your budget limit for ${category}!`);
            }
        });
    };

    const handleSave = () => {
        const totalCategoryLimits = Object.values(categoryLimits).reduce((acc, limit) => acc + Number(limit), 0);

        if (totalCategoryLimits > totalBudgetLimit) {
            setError('Total of category limits exceeds the total budget limit.');
            return;
        }

        userSettingsStore.set({ 
            totalBudgetLimit, 
            categoryLimits, 
            alertsEnabled, 
            budgetExceeded 
        });

        setSuccessMessage('Settings saved successfully!');
        setError('');
        setBudgetExceeded(false);
        checkBudgetLimits();
    };

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        resetBudgetAlert();
    };

    return (
        <Box sx={{ mt: 4, p: { xs: 2, md: 4 }, bgcolor: 'background.default' }}>
            <Typography variant="h4" gutterBottom color="primary">
                Settings
            </Typography>

            <FormControlLabel
                control={
                    <Switch
                        color="primary"
                        checked={alertsEnabled}
                        onChange={(e) => setAlertsEnabled(e.target.checked)}
                    />
                }
                label="Enable Alerts"
            />

            <Paper sx={{ padding: 2, mt: 2, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h6" color="text.secondary">Total Budget Limit (€)</Typography>
                <TextField
                    type="number"
                    value={totalBudgetLimit}
                    onChange={(e) => setTotalBudgetLimit(Number(e.target.value))}
                    fullWidth
                    margin="normal"
                    inputProps={{ min: 0, step: '0.01' }}
                    sx={{ mt: 1 }}
                />
            </Paper>

            <Paper sx={{ padding: 2, mt: 2, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h6" color="text.secondary">Category Budget Limits (€)</Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {expenseCategories.map((category) => (
                        <Grid item xs={12} sm={6} md={4} key={category}>
                            <TextField
                                label={category}
                                type="number"
                                value={categoryLimits[category] || 0}
                                onChange={(e) => setCategoryLimits({
                                    ...categoryLimits,
                                    [category]: Number(e.target.value)
                                })}
                                fullWidth
                                margin="normal"
                                inputProps={{ min: 0, step: '0.01' }}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            <Box sx={{ mt: 4 }}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ boxShadow: 2 }}
                    onClick={handleSave}
                >
                    Save Settings
                </Button>
            </Box>

            {budgetExceeded && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                    You have exceeded your budget limit of {totalBudgetLimit} €!
                </Alert>
            )}

            {successMessage && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    {successMessage}
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            <Snackbar
                open={budgetAlert.isVisible}
                autoHideDuration={6000}
                onClose={handleAlertClose}
                message={budgetAlert.message}
            />
        </Box>
    );
}

export default Settings;