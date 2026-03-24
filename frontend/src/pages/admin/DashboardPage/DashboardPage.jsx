import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import {
    Apartment,
    Handshake,
    ManageAccounts,
    PendingActions,
} from '@mui/icons-material';

import adminTheme from '../../../theme/adminTheme';
import adminAccountService from '../../../services/adminAccountService';
import branchService from '../../../services/branchServce';
import partnershipRequestService from '../../../services/partnershipRequestService';

const formatDateTime = (value) => {
    if (!value) {
        return '-';
    }

    return new Date(value).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const statusLabelMap = {
    sent: 'Đã gửi',
    pending: 'Chờ duyệt',
    approved: 'Đã duyệt',
    refused: 'Từ chối',
};

const statusColorMap = {
    sent: 'info',
    pending: 'warning',
    approved: 'success',
    refused: 'error',
};

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [branches, setBranches] = useState([]);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [accountRows, branchRows, requestRows] = await Promise.all([
                    adminAccountService.getAllAccounts(),
                    branchService.getAllBranches('all'),
                    partnershipRequestService.getAllPartnershipRequest(),
                ]);

                setAccounts(Array.isArray(accountRows) ? accountRows : []);
                setBranches(Array.isArray(branchRows) ? branchRows : []);
                setRequests(Array.isArray(requestRows) ? requestRows : []);
                setError('');
            } catch (fetchError) {
                console.error('Failed to fetch admin dashboard data:', fetchError);
                setError('Không thể tải dữ liệu tổng quan.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const summary = useMemo(() => {
        const activeBranches = branches.filter((branch) => branch.cooperated).length;
        const pendingRequests = requests.filter((request) => request.status === 'pending').length;
        const managers = accounts.filter((account) => account.role === 'MANAGER').length;
        const users = accounts.filter((account) => account.role === 'USER').length;

        return {
            totalAccounts: accounts.length,
            totalBranches: branches.length,
            activeBranches,
            pendingRequests,
            managers,
            users,
        };
    }, [accounts, branches, requests]);

    const recentBranches = useMemo(
        () => [...branches].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)).slice(0, 5),
        [branches]
    );

    const recentRequests = useMemo(
        () => [...requests].sort((left, right) => new Date(right.createAt) - new Date(left.createAt)).slice(0, 5),
        [requests]
    );

    const summaryCards = [
        {
            label: 'Tổng tài khoản',
            value: summary.totalAccounts,
            icon: <ManageAccounts color="primary" />,
            helper: `${summary.managers} quản lý, ${summary.users} người dùng`,
        },
        {
            label: 'Tổng chi nhánh',
            value: summary.totalBranches,
            icon: <Apartment color="primary" />,
            helper: `${summary.activeBranches} chi nhánh đang hợp tác`,
        },
        {
            label: 'Yêu cầu chờ duyệt',
            value: summary.pendingRequests,
            icon: <PendingActions color="warning" />,
            helper: `${requests.length} yêu cầu trong hệ thống`,
        },
        {
            label: 'Đối tác đang hợp tác',
            value: summary.activeBranches,
            icon: <Handshake color="success" />,
            helper: `${summary.totalBranches - summary.activeBranches} chi nhánh đang tạm dừng`,
        },
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: adminTheme.palette.primary.main,
                    }}
                >
                    Tổng quan quản lý
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Xem thống kê nhanh về tài khoản, chi nhánh và yêu cầu hợp tác
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        {summaryCards.map((card) => (
                            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={card.label}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                {card.label}
                                            </Typography>
                                            {card.icon}
                                        </Stack>
                                        <Typography variant="h4" fontWeight="bold" color="primary">
                                            {card.value}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            {card.helper}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, lg: 7 }}>
                            <Paper sx={{ p: 3, height: '100%' }}>
                                <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
                                    Chi nhánh gần đây
                                </Typography>
                                <List disablePadding>
                                    {recentBranches.length === 0 ? (
                                        <Typography color="text.secondary">
                                            Chưa có dữ liệu chi nhánh.
                                        </Typography>
                                    ) : (
                                        recentBranches.map((branch, index) => (
                                            <React.Fragment key={branch.id}>
                                                <ListItem disableGutters sx={{ py: 1.5 }}>
                                                    <ListItemText
                                                        primary={branch.branchName}
                                                        secondary={
                                                            <>
                                                                <Typography component="span" variant="body2" color="text.secondary">
                                                                    {branch.address || 'Chưa có địa chỉ'}
                                                                </Typography>
                                                                <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                                                                    {branch.phoneNumber || 'Chưa có số điện thoại'} • {formatDateTime(branch.createdAt)}
                                                                </Typography>
                                                            </>
                                                        }
                                                    />
                                                    <Chip
                                                        label={branch.cooperated ? 'Đang hợp tác' : 'Ngừng hợp tác'}
                                                        color={branch.cooperated ? 'success' : 'default'}
                                                        size="small"
                                                    />
                                                </ListItem>
                                                {index < recentBranches.length - 1 && <Divider />}
                                            </React.Fragment>
                                        ))
                                    )}
                                </List>
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, lg: 5 }}>
                            <Paper sx={{ p: 3, height: '100%' }}>
                                <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
                                    Yêu cầu hợp tác gần đây
                                </Typography>
                                <List disablePadding>
                                    {recentRequests.length === 0 ? (
                                        <Typography color="text.secondary">
                                            Chưa có yêu cầu hợp tác.
                                        </Typography>
                                    ) : (
                                        recentRequests.map((request, index) => (
                                            <React.Fragment key={request.id}>
                                                <ListItem disableGutters sx={{ py: 1.5 }}>
                                                    <ListItemText
                                                        primary={request.branchName || 'Chưa có tên chi nhánh'}
                                                        secondary={
                                                            <>
                                                                <Typography component="span" variant="body2" color="text.secondary">
                                                                    {request.ownerName || 'Chưa có chủ sở hữu'}
                                                                </Typography>
                                                                <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                                                                    {formatDateTime(request.createAt)}
                                                                </Typography>
                                                            </>
                                                        }
                                                    />
                                                    <Chip
                                                        label={statusLabelMap[request.status] || request.status}
                                                        color={statusColorMap[request.status] || 'default'}
                                                        size="small"
                                                    />
                                                </ListItem>
                                                {index < recentRequests.length - 1 && <Divider />}
                                            </React.Fragment>
                                        ))
                                    )}
                                </List>
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            )}
        </Container>
    );
};

export default DashboardPage;
