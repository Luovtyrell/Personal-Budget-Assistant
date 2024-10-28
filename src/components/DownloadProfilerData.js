import React from 'react';
import { Button } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { useStore } from '@nanostores/react';
import { transactionsStore } from '../stores/transactionStore';

function DownloadTransactionsData() {
    const transactions = useStore(transactionsStore);

    const handleDownload = () => {
        if (!transactions || transactions.length === 0) {
            alert('No transaction data available to download.');
            return;
        }

        // Convert the data to JSON format
        const json = JSON.stringify(transactions, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'transactions_data.json');
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Button
            variant="contained"
            color="secondary"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
        >
            Download Transactions Data
        </Button>
    );
}

export default DownloadTransactionsData;
