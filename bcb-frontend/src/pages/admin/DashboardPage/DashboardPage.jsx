import React from 'react';
import {
    Container,
    Typography,
    Box,
} from '@mui/material';

import adminTheme from '../../../theme/adminTheme';

const DashboardPage = () => {
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
                    Tổng quan quản lý
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Xem thóng kê và kiểm soát mọt số thứ từ đây
                </Typography>
            </Box>
        </Container>
    );
};

export default DashboardPage;