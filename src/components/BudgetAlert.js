// src/components/BudgetAlert.js
import React, { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { userSettingsStore } from '../stores/userSettingsStore';
import { transactionsStore } from '../stores/transactionStore';
import { Alert } from '@mui/material';
import { budgetAlertStore } from '../stores/budgetAlertStore'; // Importar el store de alertas

const BudgetAlert = () => {
    const userSettings = useStore(userSettingsStore);
    const transactions = useStore(transactionsStore);
    console.log('transactions', transactions)

    // Instructions:
    // - Calculate the total expenses from the transactions.
    const totalExpense = transactions.reduce((acc, current) => acc + current.amount, 0)

    // Determine if the budget has been exceeded
    const budgetExceeded = totalExpense > userSettings.totalBudgetLimit
    console.log('budgetExceeded', budgetExceeded)

    // Use the useEffect hook to update the budgetAlertStore when the budget is exceeded
    useEffect(() => {
        budgetAlertStore.set(
            budgetExceeded ?
                {
                    isVisible: true,
                    message: "You have exceeded your budget",
                    severity: 'error',
                }
                :
                {
                    isVisible: false,
                    message: '',
                    severity: '',
                }
        )
    }, [budgetExceeded, userSettings.totalBudgetLimit, totalExpense]);

    return (
        <>
            {budgetAlertStore.isVisible ? (
                <Alert severity={budgetAlertStore.severity}>
                    {budgetAlertStore.message}
                </Alert>
            ) : null}
        </>
    )
};

export default BudgetAlert;
