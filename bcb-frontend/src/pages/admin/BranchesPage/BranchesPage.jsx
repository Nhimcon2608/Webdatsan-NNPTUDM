import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,

} from '@mui/material';

import branchService from '../../../services/branchServce';

import BranchList from './BranchList';
import adminTheme from '../../../theme/adminTheme';

const BranchesPage = () => {

    const [branches, setBranches] = useState([]);

    useEffect(() => {

        const fetchAllBranches = async () => {
            try {
                const branchesResponse = await branchService.getAllBranches('all');
                setBranches(branchesResponse);
            } catch (error) {
                console.error('Failed to fetch branches:', error);
            }
        };

        fetchAllBranches();

    }, [])

    // console.log('branches: ', branches);

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: adminTheme.palette.primary.main
                    }}
                >
                    Quản Lý Chi Nhánh
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Quản lý và chỉnh sửa một vài thông tin của các chi nhánh
                </Typography>
            </Box>

            <BranchList branches={branches} theme={adminTheme} />
        </Container>
    );
};

export default BranchesPage;