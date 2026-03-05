import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from "@mui/material";
import {
	Box,
	Typography,
	Grid,
	Card,
	CardContent,
	Divider,
	Button,
	Chip,
	Stack,
	CircularProgress,
	Alert,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Paper,
	LinearProgress,
	Avatar,
	IconButton,
	Tooltip
} from '@mui/material';
import { formatVND } from "../../utils/format";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import LabelIcon from '@mui/icons-material/Label';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import UserLayout from "../../layouts/user/UserLayout";
import reservationService from "../../services/reservationService";

const CheckoutPage = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const location = useLocation();
	const { search } = location;

	const [timeLeft, setTimeLeft] = useState(600); // 10 phút
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [openCancelDialog, setOpenCancelDialog] = useState(false);
	const [paymentContent, setPaymentContent] = useState('');
	const [updatedReservationData, setUpdatedReservationData] = useState({});

	// Copy states
	const [copiedNumber, setCopiedNumber] = useState(false);
	const [copiedContent, setCopiedContent] = useState(false);

	const queryParams = useMemo(() => new URLSearchParams(search), [search]);
	const session = queryParams.get('session');

	const branchDetail = location.state?.branchDetail;
	const reservationId = location.state?.reservationId;
	const reservationData = location.state?.reservationData;
	const reservationDetails = location.state?.reservationDetails || [];
	const selectedVoucher = location.state?.selectedVoucher;

	// Lấy thông tin ngân hàng từ branchDetail (từ bảng Branch)
	const bankInfo = useMemo(() => ({
		bankName: branchDetail?.bankName || 'Chưa cập nhật ngân hàng',
		bankNumber: branchDetail?.bankNumber || '',
		bankId: branchDetail?.bankId || '970422', // fallback MB Bank nếu không có
	}), [branchDetail]);

	const { originalPrice, discountAmount, depositAmount, remainingAmount } = useMemo(() => {
		if (!reservationData) return {};
		const original = reservationData.totalPrice / (selectedVoucher ? 1 - selectedVoucher.discountRate / 100 : 1);
		const discount = selectedVoucher ? (original * selectedVoucher.discountRate / 100) : 0;
		const deposit = reservationData.deposit || 0;
		const remaining = reservationData.totalPrice - deposit;

		return { originalPrice: original, discountAmount: discount, depositAmount: deposit, remainingAmount: remaining };
	}, [reservationData, selectedVoucher]);

	// Copy to clipboard
	const copyToClipboard = (text, type) => {
		navigator.clipboard.writeText(text);
		if (type === 'number') {
			setCopiedNumber(true);
			setTimeout(() => setCopiedNumber(false), 2000);
		} else if (type === 'content') {
			setCopiedContent(true);
			setTimeout(() => setCopiedContent(false), 2000);
		}
	};

	useEffect(() => {
		const validateSession = () => {
			try {
				const storedSession = sessionStorage.getItem('checkoutSession');
				if (!session || session !== storedSession || !reservationData || !branchDetail) {
					throw new Error('Phiên thanh toán không hợp lệ hoặc đã hết hạn');
				}
				setIsLoading(false);
			} catch (err) {
				setError(err.message);
				setIsLoading(false);
				setTimeout(() => navigate('/badminton-branchs'), 3000);
			}
		};

		setUpdatedReservationData({ ...reservationData, deposit: 0, status: 'cancel' });

		const playerId = reservationData?.playerId || reservationData?.id || 'USER';
		const bookDate = new Date(reservationData?.bookAt).toLocaleString('vi-VN', { hour12: false })
			.replace(/[^\w]/g, '').slice(0, 12);

		setPaymentContent(`${playerId}${bookDate}`);

		validateSession();
	}, [session, reservationData, branchDetail, navigate]);

	// Timer + cleanup
	useEffect(() => {
		if (!session || isLoading) return;

		const timer = setInterval(() => {
			setTimeLeft(prev => {
				if (prev <= 1) {
					clearInterval(timer);
					sessionStorage.removeItem('checkoutSession');
					navigate('/badminton-branchs', { state: { sessionExpired: true } });
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		const cleanup = () => {
			sessionStorage.removeItem('checkoutSession');
			if (reservationId) updateReservation(reservationId, updatedReservationData);
		};

		window.addEventListener('beforeunload', cleanup);
		return () => {
			clearInterval(timer);
			window.removeEventListener('beforeunload', cleanup);
		};
	}, [session, isLoading, navigate, reservationId, updatedReservationData]);

	const updateReservation = async (id, data) => {
		try {
			await reservationService.updateReservation(id, data);
		} catch (error) {
			console.error('Error updating reservation:', error);
		}
	};

	const formatTimeLeft = (seconds) => {
		const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
		const secs = (seconds % 60).toString().padStart(2, '0');
		return `${mins}:${secs}`;
	};

	const handleCancelPayment = () => setOpenCancelDialog(true);
	const handleCloseCancelDialog = () => setOpenCancelDialog(false);

	const handleConfirmPayment = async () => {
		await updateReservation(reservationId, { ...reservationData, status: 'waiting' });
		navigate('/booking-successfully', {
			state: { branchDetail, reservationId }
		});
	};

	const confirmCancelPayment = async () => {
		sessionStorage.removeItem('checkoutSession');
		await updateReservation(reservationId, updatedReservationData);
		navigate('/badminton-branchs');
	};

	const getTimerColor = () => {
		if (timeLeft > 300) return 'success.main';
		if (timeLeft > 120) return 'warning.main';
		return 'error.main';
	};

	if (isLoading) return <UserLayout><Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}><CircularProgress size={60} /><Typography variant="h6" sx={{ mt: 3 }}>Đang tải...</Typography></Box></UserLayout>;

	if (error) return <UserLayout><Box sx={{ p: 4, textAlign: 'center' }}><Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>{error}</Alert><CircularProgress /></Box></UserLayout>;

	return (
		<UserLayout>
			<Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'background.default', minHeight: '100vh' }}>
				{/* Header */}
				<Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
						<IconButton onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>
						<Typography variant="h5" fontWeight={700} ml={1}>
							Thanh Toán Đặt Cọc
						</Typography>
					</Box>
					<LinearProgress variant="determinate" value={(timeLeft / 600) * 100} sx={{ height: 10, borderRadius: 5, mb: 2, '& .MuiLinearProgress-bar': { bgcolor: getTimerColor() } }} />
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<Typography variant="body2">Vui lòng chuyển khoản trong thời gian còn lại</Typography>
						<Typography variant="h6" color={getTimerColor()} fontWeight={600}>
							<AccessTimeIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} /> {formatTimeLeft(timeLeft)}
						</Typography>
					</Box>
				</Paper>

				<Grid container spacing={4}>
					{/* Left: Payment Info */}
					<Grid size={{ xs: 12, md: 5 }}>
						<Card sx={{ height: '100%', borderRadius: 3, overflow: 'hidden' }}>
							<Box sx={{ p: 2.5, bgcolor: 'primary.main', color: 'white' }}>
								<Typography variant="h6" fontWeight={600}>Thông Tin Chuyển Khoản</Typography>
							</Box>
							<CardContent sx={{ p: 3 }}>
								<Stack spacing={3} alignItems="center">
									{/* Bank Info */}
									<Paper elevation={2} sx={{ p: 3, width: '100%', borderRadius: 3, bgcolor: 'background.paper' }}>
										<Stack spacing={2.5}>
											<Box textAlign="center">
												<AccountBalanceIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
												<Typography variant="subtitle1" fontWeight={600} color="primary">
													{bankInfo.bankName}
												</Typography>
											</Box>

											<Divider />

											<Box>
												<Typography variant="body2" color="text.secondary">Số tài khoản</Typography>
												<Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
													<Typography variant="h6" fontWeight={700}>{bankInfo.bankNumber || 'Chưa có'}</Typography>
													{bankInfo.bankNumber && (
														<Tooltip title={copiedNumber ? "Đã copy!" : "Copy"}>
															<IconButton size="small" onClick={() => copyToClipboard(bankInfo.bankNumber, 'number')}>
																{copiedNumber ? <CheckCircleIcon color="success" /> : <ContentCopyIcon fontSize="small" />}
															</IconButton>
														</Tooltip>
													)}
												</Box>
											</Box>


											<Box>
												<Typography variant="body2" color="text.secondary">Nội dung chuyển khoản</Typography>
												<Paper variant="outlined" sx={{ p: 1.5, mt: 1, bgcolor: 'action.selected' }}>
													<Box display="flex" alignItems="center" justifyContent="space-between">
														<Typography variant="body2" fontWeight={600} sx={{ wordBreak: 'break-all' }}>
															{paymentContent}
														</Typography>
														<Tooltip title={copiedContent ? "Đã copy!" : "Copy"}>
															<IconButton size="small" onClick={() => copyToClipboard(paymentContent, 'content')}>
																{copiedContent ? <CheckCircleIcon color="success" /> : <ContentCopyIcon fontSize="small" />}
															</IconButton>
														</Tooltip>
													</Box>
												</Paper>
											</Box>
										</Stack>
									</Paper>

									{/* QR Code */}
									{bankInfo.bankNumber && (
										<Box textAlign="center">
											<Typography variant="subtitle2" fontWeight={600} mb={2}>Quét mã QR để thanh toán nhanh</Typography>
											<Paper elevation={3} sx={{ p: 3, display: 'inline-block', borderRadius: 3 }}>
												<img
													src={`https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.bankNumber}-qr_only.png?amount=${depositAmount}&addInfo=${paymentContent}`}
													alt="QR Thanh toán"
													style={{ width: '100%', maxWidth: '220px' }}
												/>
											</Paper>
										</Box>
									)}

									{/* Amount */}
									<Paper sx={{ p: 3, width: '100%', bgcolor: 'primary.main', color: 'white', borderRadius: 3, textAlign: 'center' }}>
										<CurrencyExchangeIcon sx={{ fontSize: 32, mb: 1 }} />
										<Typography variant="h6">Số tiền cần chuyển:</Typography>
										<Typography variant="h5" fontWeight={700}>
											{formatVND(depositAmount)}
										</Typography>
									</Paper>
								</Stack>
							</CardContent>
						</Card>
					</Grid>

					{/* Right: Booking Details */}
					<Grid size={{ xs: 12, md: 7 }}>
						<Card sx={{ height: '100%', borderRadius: 3 }}>
							<Box sx={{ p: 2.5, bgcolor: 'primary.main', color: 'white' }}>
								<Typography variant="h6" fontWeight={600}>Chi Tiết Đặt Sân</Typography>
							</Box>
							<CardContent sx={{ p: 3 }}>
								{/* Courts */}
								{reservationDetails.map((court, i) => (
									<Paper key={i} elevation={1} sx={{ p: 2.5, mb: 3, borderRadius: 3 }}>
										<Box display="flex" alignItems="center" mb={2}>
											<SportsBaseballIcon color="primary" sx={{ mr: 1 }} />
											<Typography variant="subtitle1" fontWeight={600}>Sân {court.courtName}</Typography>
										</Box>
										<Stack direction="row" flexWrap="wrap" gap={1}>
											{court.slots?.map((slot, j) => (
												<Chip key={j} icon={<AccessTimeIcon />} label={`${slot.startTime} - ${slot.endTime}`} color="primary" variant="outlined" />
											))}
										</Stack>
									</Paper>
								))}

								{/* Price Summary */}
								<Paper elevation={2} sx={{ p: 3, mt: 3, borderRadius: 3 }}>
									<Typography variant="h6" fontWeight={600} mb={2}>Tổng kết thanh toán</Typography>
									<Stack spacing={2}>
										<Box display="flex" justifyContent="space-between"><Typography>Tổng tiền gốc:</Typography><Typography fontWeight={500}>{formatVND(originalPrice)}</Typography></Box>
										{selectedVoucher && (
											<>
												<Box display="flex" justifyContent="space-between" color="success.main">
													<Box display="flex" alignItems="center"><LabelIcon sx={{ mr: 1 }} /> Giảm giá voucher:</Box>
													<Typography fontWeight={600}>-{formatVND(discountAmount)}</Typography>
												</Box>
												<Box display="flex" justifyContent="space-between"><Typography>Thành tiền:</Typography><Typography fontWeight={700} color="primary">{formatVND(reservationData.totalPrice)}</Typography></Box>
											</>
										)}
										<Divider />
										<Box display="flex" justifyContent="space-between"><Typography fontWeight={600}>Đặt cọc ngay (50%):</Typography><Typography fontWeight={700} color="error.main">{formatVND(depositAmount)}</Typography></Box>
										<Box display="flex" justifyContent="space-between"><Typography fontWeight={600}>Còn lại thanh toán tại sân:</Typography><Typography fontWeight={700} color="primary">{formatVND(remainingAmount)}</Typography></Box>
									</Stack>
								</Paper>

								{/* Actions */}
								<Box mt={5} display="flex" gap={2} justifyContent="center">
									<Button variant="outlined" color="error" size="large" onClick={handleCancelPayment} sx={{ borderRadius: 30, px: 4, py: 1.5 }}>
										Hủy thanh toán
									</Button>
									<Button variant="contained" size="large" onClick={handleConfirmPayment} sx={{ borderRadius: 30, px: 5, py: 1.5, boxShadow: 6 }}>
										Tôi đã chuyển khoản
									</Button>
								</Box>
							</CardContent>
						</Card>
					</Grid>
				</Grid>

				{/* Cancel Dialog */}
				<Dialog open={openCancelDialog} onClose={handleCloseCancelDialog}>
					<DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>Xác nhận hủy</DialogTitle>
					<DialogContent sx={{ pt: 3 }}>
						<DialogContentText>Bạn có chắc muốn hủy thanh toán? Đơn đặt sân sẽ bị hủy và không được giữ lại.</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCloseCancelDialog}>Quay lại</Button>
						<Button onClick={confirmCancelPayment} color="error" variant="contained">Xác nhận hủy</Button>
					</DialogActions>
				</Dialog>
			</Box>
		</UserLayout>
	);
};

export default CheckoutPage;