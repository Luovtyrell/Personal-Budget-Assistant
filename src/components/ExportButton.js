import React, { useCallback } from 'react';
import { Button } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';

const ExportButton = React.memo(function ExportButton({ data, filename, headers, label }) {
    const handleExport = useCallback(() => {
        // Data to CSV format
        const csv = convertArrayOfObjectsToCSV();
        if (!csv) return;

        // CSV content
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();

    }, [data, filename, headers]);

    // Function to convert object array to CSV
    const convertArrayOfObjectsToCSV = () => {
        if (!data || data.length === 0) return null;

        const csvHeaders = headers.join(',');
        const csvRows = data.map(row =>
            headers.map(fieldName => JSON.stringify(row[fieldName] ?? '')).join(',')
        );

        return [csvHeaders, ...csvRows].join('\n');
    };

    return (
        <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            disabled={!data || data.length === 0}
        >
            {label || 'Export CSV'}
        </Button>
    );
});

ExportButton.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    filename: PropTypes.string,
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    label: PropTypes.string,
};

ExportButton.defaultProps = {
    filename: 'data.csv',
    label: 'Export CSV',
};

export default ExportButton;
