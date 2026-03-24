import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Avatar,
    Box,
    Chip,
    CircularProgress,
    Container,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';

import adminTheme from '../../../theme/adminTheme';
import adminAccountService from '../../../services/adminAccountService';

const roleLabels = {
    ADMIN: 'Admin',
    MANAGER: 'Quản lý',
    USER: 'Người dùng',
};

const roleColors = {
    ADMIN: 'error',
    MANAGER: 'primary',
    USER: 'default',
};

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

const AccountsPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                setLoading(true);
                const data = await adminAccountService.getAllAccounts();
                setAccounts(Array.isArray(data) ? data : []);
                setError('');
            } catch (fetchError) {
                console.error('Failed to fetch accounts:', fetchError);
                setError('Không thể tải danh sách tài khoản.');
                setAccounts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const filteredAccounts = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        if (!keyword) {
            return accounts;
        }

        return accounts.filter((account) =>
            [
                account.username,
                account.fullName,
                account.email,
                account.phoneNumber,
                account.role,
            ]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(keyword))
        );
    }, [accounts, searchTerm]);

    const summary = useMemo(() => ({
        total: accounts.length,
        admin: accounts.filter((account) => account.role === 'ADMIN').length,
        manager: accounts.filter((account) => account.role === 'MANAGER').length,
        user: accounts.filter((account) => account.role === 'USER').length,
    }), [accounts]);

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
                    Các tài khoản trên hệ thống
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Xem và kiểm tra danh sách tài khoản hiện có
                </Typography>
            </Box>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <Paper sx={{ p: 2, flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">Tổng tài khoản</Typography>
                    <Typography variant="h5" fontWeight="bold">{summary.total}</Typography>
                </Paper>
                <Paper sx={{ p: 2, flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">Admin</Typography>
                    <Typography variant="h5" fontWeight="bold">{summary.admin}</Typography>
                </Paper>
                <Paper sx={{ p: 2, flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">Quản lý</Typography>
                    <Typography variant="h5" fontWeight="bold">{summary.manager}</Typography>
                </Paper>
                <Paper sx={{ p: 2, flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">Người dùng</Typography>
                    <Typography variant="h5" fontWeight="bold">{summary.user}</Typography>
                </Paper>
            </Stack>

            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    label="Tìm theo tên, email, số điện thoại hoặc vai trò"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
            </Paper>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : filteredAccounts.length === 0 ? (
                <Alert severity="info">Không có tài khoản nào phù hợp.</Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tài khoản</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Số điện thoại</TableCell>
                                <TableCell>Vai trò</TableCell>
                                <TableCell>Ngày tạo</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredAccounts.map((account) => (
                                <TableRow key={account.id} hover>
                                    <TableCell>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar src={account.imagePath ? `${import.meta.env.VITE_API_URL}/${account.imagePath}` : ''}>
                                                {(account.username || account.fullName || account.email || 'A').charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Box>
                                                <Typography fontWeight={600}>
                                                    {account.fullName || account.username || 'Chưa có tên'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {account.id}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>{account.email || '-'}</TableCell>
                                    <TableCell>{account.phoneNumber || '-'}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={roleLabels[account.role] || account.role || 'Chưa rõ'}
                                            color={roleColors[account.role] || 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{formatDateTime(account.createdAt)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default AccountsPage;
