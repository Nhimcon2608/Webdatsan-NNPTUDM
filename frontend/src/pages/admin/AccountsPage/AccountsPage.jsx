import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Link,
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
import { resolveBackendUrl } from '../../../services/api';
import { useSnackbar } from '../../../../context/SnackbarContext';

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
    const { showSnackbar } = useSnackbar();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [resettingId, setResettingId] = useState('');
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [previewInfo, setPreviewInfo] = useState(null);

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

    const handleOpenResetDialog = (account) => {
        setSelectedAccount(account);
    };

    const handleCloseResetDialog = () => {
        setSelectedAccount(null);
    };

    const handleClosePreviewDialog = () => {
        setPreviewInfo(null);
    };

    const handleResetPassword = async () => {
        if (!selectedAccount?.id) {
            return;
        }

        try {
            setResettingId(selectedAccount.id);
            const response = await adminAccountService.resetPassword(selectedAccount.id);
            const delivery = response?.delivery || {};

            if (delivery.method === 'file') {
                setPreviewInfo({
                    email: selectedAccount.email,
                    previewUrl: resolveBackendUrl(delivery.previewUrl || ''),
                    previewPath: delivery.previewPath || '',
                });
                showSnackbar('Đặt lại mật khẩu thành công. Email preview đã được lưu cục bộ.', 'warning');
            } else {
                showSnackbar('Đặt lại mật khẩu thành công và đã gửi email cho người dùng.', 'success');
            }
        } catch (resetError) {
            console.error('Failed to reset password:', resetError);
            showSnackbar(
                resetError.response?.data?.message || 'Không thể đặt lại mật khẩu.',
                'error',
            );
        } finally {
            setResettingId('');
            handleCloseResetDialog();
        }
    };

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
                                <TableCell align="right">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredAccounts.map((account) => (
                                <TableRow key={account.id} hover>
                                    <TableCell>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar src={resolveBackendUrl(account.imagePath || account.avatarUrl || '')}>
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
                                    <TableCell align="right">
                                        {account.role === 'ADMIN' ? (
                                            <Typography variant="body2" color="text.secondary">
                                                -
                                            </Typography>
                                        ) : (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                disabled={resettingId === account.id}
                                                onClick={() => handleOpenResetDialog(account)}
                                            >
                                                {resettingId === account.id ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={Boolean(selectedAccount)} onClose={handleCloseResetDialog} maxWidth="xs" fullWidth>
                <DialogTitle>Đặt lại mật khẩu</DialogTitle>
                <DialogContent>
                    <Typography>
                        {selectedAccount
                            ? `Tạo mật khẩu ngẫu nhiên mới cho ${selectedAccount.fullName || selectedAccount.email}?`
                            : ''}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Hệ thống sẽ gửi mật khẩu mới tới email của người dùng. Nếu SMTP chưa cấu hình,
                        email preview sẽ được lưu cục bộ.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseResetDialog}>Hủy</Button>
                    <Button
                        onClick={handleResetPassword}
                        variant="contained"
                        disabled={!selectedAccount || resettingId === selectedAccount?.id}
                    >
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={Boolean(previewInfo)} onClose={handleClosePreviewDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Email Preview Cục Bộ</DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 1 }}>
                        SMTP chưa được cấu hình. Nội dung email reset mật khẩu cho{' '}
                        <strong>{previewInfo?.email}</strong> đã được lưu cục bộ.
                    </Typography>
                    {previewInfo?.previewUrl ? (
                        <Link href={previewInfo.previewUrl} target="_blank" rel="noreferrer">
                            Mở file preview email
                        </Link>
                    ) : null}
                    {previewInfo?.previewPath ? (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {previewInfo.previewPath}
                        </Typography>
                    ) : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePreviewDialog}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AccountsPage;
