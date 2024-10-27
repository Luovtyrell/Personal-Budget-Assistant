import React, { useState, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { transactionsStore, deleteTransaction } from '../stores/transactionStore';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Box,
    Typography,
    IconButton,
    Pagination
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import TransactionForm from './TransactionForm';
import { allCategories } from '../constants/categories';

function TransactionList() {
    const transactions = useStore(transactionsStore);

    const [filterCategory, setFilterCategory] = useState('');
    const [filterType, setFilterType] = useState('');
    const [sortField, setSortField] = useState('');
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState(null);

    const handleEdit = (transaction) => {
        setTransactionToEdit(transaction);
        setIsFormOpen(true);
    };

    const handleDelete = (id) => {
        deleteTransaction(id);
    };

    const filteredAndSortedTransactions = useMemo(() => {
        let result = transactions;

        if (filterCategory) {
            result = result.filter(t => t.category === filterCategory);
        }

        if (filterType) {
            result = result.filter(t => t.type === filterType);
        }

        if (sortField) {
            result.sort((a, b) => {
                if (a[sortField] < b[sortField]) return -1;
                if (a[sortField] > b[sortField]) return 1;
                return 0;
            });
        }

        return result;
    }, [transactions, filterCategory, filterType, sortField]);

    const paginatedTransactions = filteredAndSortedTransactions.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    const pageCount = Math.ceil(filteredAndSortedTransactions.length / rowsPerPage);

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Transaction List
            </Typography>

            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setIsFormOpen(true)}
                sx={{ mb: 2 }}
            >
                Add Transaction
            </Button>

            <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="filter-category-label">Category</InputLabel>
                    <Select
                        labelId="filter-category-label"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        {allCategories.map(category => (
                            <MenuItem key={category} value={category}>{category}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="filter-type-label">Type</InputLabel>
                    <Select
                        labelId="filter-type-label"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="income">Income</MenuItem>
                        <MenuItem value="expense">Expense</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel id="sort-field-label">Sort By</InputLabel>
                    <Select
                        labelId="sort-field-label"
                        value={sortField}
                        onChange={(e) => setSortField(e.target.value)}
                    >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="amount">Amount</MenuItem>
                        <MenuItem value="date">Date</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell>Amount (€)</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell>{transaction.amount.toFixed(2)}</TableCell>
                                <TableCell>{transaction.type}</TableCell>
                                <TableCell>{transaction.category}</TableCell>
                                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(transaction)} size="small">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(transaction.id)} size="small">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination 
                    count={pageCount} 
                    page={page} 
                    onChange={(event, value) => setPage(value)} 
                />
            </Box>

            {isFormOpen && (
                <TransactionForm
                    transactionToEdit={transactionToEdit}
                    onClose={() => {
                        setIsFormOpen(false);
                        setTransactionToEdit(null);
                    }}
                />
            )}
        </Box>
    );
}

export default TransactionList;