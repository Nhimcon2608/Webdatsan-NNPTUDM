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
                    Các tài khoản trên hệ thông
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Xem thông tin các tài khoản ở đây
                </Typography>
            </Box>
        </Container>
    );
};

export default DashboardPage;