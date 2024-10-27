import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, InputLabel, FormControl, Grid, Box } from '@mui/material';
import { addTransaction, updateTransaction } from '../stores/transactionStore';
import { categoryKeywords } from '../constants/categoryKeywords';
import { allCategories } from '../constants/categories';

function TransactionForm({ transactionToEdit, onClose }) {
    const { control, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            description: '',
            amount: '',
            type: 'expense',
            category: '',
            date: new Date().toISOString().split('T')[0],
        }
    });

    useEffect(() => {
        if (transactionToEdit) {
            console.log("Editing transaction:", transactionToEdit);
            Object.keys(transactionToEdit).forEach(key => {
                setValue(key, transactionToEdit[key]);
            });
        }
    }, [transactionToEdit, setValue]);

    const description = watch('description');

    useEffect(() => {
        if (!transactionToEdit && description) {
            const assignedCategory = assignCategory(description);
            setValue('category', assignedCategory);
        }
    }, [transactionToEdit, description, setValue]);

    const assignCategory = (desc) => {
        for (const [category, keywords] of Object.entries(categoryKeywords)) {
            if (keywords.some(keyword => desc.toLowerCase().includes(keyword.toLowerCase()))) {
                return category;
            }
        }
        return 'Other Expenses';
    };

    const onSubmit = (data) => {
        const transaction = {
            id: transactionToEdit ? transactionToEdit.id : Date.now(),
            ...data,
            amount: parseFloat(data.amount),
        };

        if (transactionToEdit) {
            updateTransaction(transaction);
        } else {
            addTransaction(transaction);
        }

        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>{transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Controller
                                name="description"
                                control={control}
                                rules={{ required: 'Description is required' }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="Description"
                                        fullWidth
                                        margin="normal"
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="amount"
                                control={control}
                                rules={{
                                    required: 'Amount is required',
                                    min: { value: 0, message: 'Amount must be positive' }
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="Amount (€)"
                                        type="number"
                                        fullWidth
                                        margin="normal"
                                        inputProps={{ min: 0, step: '0.01' }}
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="type"
                                control={control}
                                rules={{ required: 'Type is required' }}
                                render={({ field }) => (
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel id="type-label">Type</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="type-label"
                                            label="Type"
                                        >
                                            <MenuItem value="income">Income</MenuItem>
                                            <MenuItem value="expense">Expense</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="category"
                                control={control}
                                rules={{ required: 'Category is required' }}
                                render={({ field }) => (
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel id="category-label">Category</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="category-label"
                                            label="Category"
                                        >
                                            {allCategories.map((cat) => (
                                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                            ))}
                                            <MenuItem value="Other Expenses">Other Expenses</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="date"
                                control={control}
                                rules={{ required: 'Date is required' }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="Date"
                                        type="date"
                                        fullWidth
                                        margin="normal"
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', p: 2 }}>
                        <Button onClick={onClose} color="secondary">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary" data-testid="add-transaction-button">
                            {transactionToEdit ? 'Update' : 'Add'}
                        </Button>
                    </Box>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default TransactionForm;