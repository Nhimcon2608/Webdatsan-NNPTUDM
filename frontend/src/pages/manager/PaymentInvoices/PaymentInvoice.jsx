import React, { useEffect, useState, useMemo } from "react";
import {
	Box,
	Card,
	CardContent,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Snackbar,
	Alert,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Skeleton,
	IconButton,
	Select,
	MenuItem,
	Chip,
	useTheme,
	Divider,
	Stack,
	TablePagination,
	Paper,
	CircularProgress,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import authService from "../../../services/authService";
import branchService from "../../../services/branchServce";
import reservationService from "../../../services/reservationService";
import invoiceService from "../../../services/invoiceService";
import badmintonCourtService from "../../../services/badmintonCourtService";

const PaymentInvoiceTable = () => {
	const theme = useTheme();
	const isDark = theme.palette.mode === "dark";
	const location = useLocation();

	const [invoices, setInvoices] = useState([]);
	const [branch, setBranch] = useState(null);
	const [reservationsMap, setReservationsMap] = useState({}); // { reservationId → full reservation }
	const [badmintonCourts, setBadmintonCourts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [search, setSearch] = useState("");
	const [filterStatus, setFilterStatus] = useState("ALL");
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
	const [selectedInvoice, setSelectedInvoice] = useState(null);
	const [openDialog, setOpenDialog] = useState(false);
	const [highlightedInvoiceId, setHighlightedInvoiceId] = useState(null);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	// === LẤY DANH SÁCH SÂN (chỉ 1 lần) ===
	useEffect(() => {
		const fetchCourts = async () => {
			const token = localStorage.getItem("authToken");
			if (!token) return;
			try {
				const account = await authService.getCurrentAccount(token);
				const branchData = await branchService.getBranchByAccountId(account.id, token);
				setBranch(branchData);
				const courts = await badmintonCourtService.getByBranchId(branchData.id, token);
				setBadmintonCourts(Array.isArray(courts) ? courts : []);
			} catch (err) {
				console.error("Lỗi lấy sân:", err);
			}
		};
		fetchCourts();
	}, []);

	// === LẤY CHI TIẾT RESERVATION KHI CÓ INVOICES ===
	useEffect(() => {
		if (invoices.length === 0) return;
		const token = localStorage.getItem("authToken");
		const ids = [...new Set(invoices.map(i => i.reservationId).filter(Boolean))];

		const fetchDetails = async () => {
			try {
				const promises = ids.map(id => reservationService.getReservationById(id, token));
				const results = await Promise.all(promises);
				const map = {};
				results.forEach(res => { if (res) map[res.id] = res; });
				setReservationsMap(map);
			} catch (err) {
				console.error("Lỗi lấy chi tiết đặt sân:", err);
			}
		};
		fetchDetails();
	}, [invoices]);

	// === HELPER: LẤY TÊN KHÁCH + SÂN ===
	const getCustomerName = (reservationId) => {
		const res = reservationsMap[reservationId];
		return res?.playerName?.trim() || "Khách lẻ";
	};

	const getCourtDisplay = (reservationId) => {
		const res = reservationsMap[reservationId];
		if (!res?.reservationDetails?.length) return "Chưa rõ";
		const detail = res.reservationDetails[0];
		const court = badmintonCourts.find(c => String(c.id) === String(detail.badmintonCourtId));
		return court?.ordinalNumber ? `Sân ${court.ordinalNumber}` : "Chưa rõ";
	};

	const renderStatusChip = (invoice) => {
		const status = (invoice.paymentStatus || "PENDING").toUpperCase();
		return status === "PAID"
			? <Chip label="ĐÃ THANH TOÁN" color="success" size="small" sx={{ fontWeight: 600 }} />
			: <Chip label="CHƯA THANH TOÁN" color="error" variant="outlined" size="small" sx={{ fontWeight: 600 }} />;
	};

	// === HIGHLIGHT KHI CHUYỂN TỪ TRANG KHÁC ===
	useEffect(() => {
		if (location.state?.highlightInvoiceId) {
			setHighlightedInvoiceId(location.state.highlightInvoiceId);
			setTimeout(() => {
				const el = document.getElementById(`invoice-${location.state.highlightInvoiceId}`);
				if (el) {
					el.scrollIntoView({ behavior: "smooth", block: "center" });
					el.style.backgroundColor = isDark ? "#134331" : "#d1fae5";
					el.style.transition = "background-color 0.8s ease";
					setTimeout(() => { el.style.backgroundColor = ""; }, 5000);
				}
			}, 800);
		}
	}, [location.state, isDark]);

	// === MỞ DIALOG ===
	const handleOpenPayment = (invoice) => {
		setSelectedInvoice(invoice);
		setOpenDialog(true);
	};
	const handleCloseDialog = () => {
		setOpenDialog(false);
		setSelectedInvoice(null);
	};

	// === XÁC NHẬN ĐÃ NHẬN TIỀN ===
	const handleMarkAsPaid = async () => {
		if (!selectedInvoice || selectedInvoice.paymentStatus === "PAID") {
			setSnackbar({ open: true, message: "Hóa đơn đã được thanh toán!", severity: "success" });
			handleCloseDialog();
			return;
		}
		try {
			const token = localStorage.getItem("authToken");
			await invoiceService.updatePaymentStatus(selectedInvoice.id, "PAID", token);
			await reservationService.updateReservationStatus(selectedInvoice.reservationId, "finish", token);

			setInvoices(prev => prev.map(inv =>
				inv.id === selectedInvoice.id ? { ...inv, paymentStatus: "PAID" } : inv
			));

			setSnackbar({ open: true, message: `Thanh toán thành công hóa đơn ${selectedInvoice.id}`, severity: "success" });
			handleCloseDialog();
		} catch (err) {
			setSnackbar({ open: true, message: "Xác nhận thanh toán thất bại!", severity: "error" });
		}
	};

	const handleCopy = (text) => {
		navigator.clipboard.writeText(text);
		setSnackbar({ open: true, message: "Đã sao chép!", severity: "success" });
	};

	const handleClearFilters = () => {
		setSearch("");
		setFilterStatus("ALL");
		setPage(0);
	};

	// === LÀM MỚI ===
	const handleRefresh = async () => {
		setRefreshing(true);
		setSearch("");
		setFilterStatus("ALL");
		setPage(0);

		const token = localStorage.getItem("authToken");
		if (!token) {
			setSnackbar({ open: true, message: "Không tìm thấy token", severity: "error" });
			setRefreshing(false);
			return;
		}

		try {
			const account = await authService.getCurrentAccount(token);
			const branchData = await branchService.getBranchByAccountId(account.id, token);
			setBranch(branchData);

			const [invoiceData, courtsData] = await Promise.all([
				invoiceService.getInvoicesByBranch(branchData.id, token),
				badmintonCourtService.getByBranchId(branchData.id, token),
			]);

			setInvoices(invoiceData);
			setBadmintonCourts(Array.isArray(courtsData) ? courtsData : []);

			setSnackbar({ open: true, message: "Đã làm mới dữ liệu!", severity: "success" });
		} catch (err) {
			setSnackbar({ open: true, message: "Làm mới thất bại!", severity: "error" });
		} finally {
			setRefreshing(false);
		}
	};

	// === LOAD LẦN ĐẦU ===
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const token = localStorage.getItem("authToken");
			if (!token) {
				setSnackbar({ open: true, message: "Không tìm thấy token", severity: "error" });
				setLoading(false);
				return;
			}

			try {
				const account = await authService.getCurrentAccount(token);
				const branchData = await branchService.getBranchByAccountId(account.id, token);
				setBranch(branchData);

				const [invoiceData, courtsData] = await Promise.all([
					invoiceService.getInvoicesByBranch(branchData.id, token),
					badmintonCourtService.getByBranchId(branchData.id, token),
				]);

				setInvoices(invoiceData);
				setBadmintonCourts(Array.isArray(courtsData) ? courtsData : []);
			} catch (err) {
				setSnackbar({ open: true, message: err.message || "Lỗi tải dữ liệu", severity: "error" });
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	// === LỌC + TÌM KIẾM + SẮP XẾP ===
	const filteredAndSortedInvoices = useMemo(() => {
		return invoices
			.filter(inv => {
				const customerName = getCustomerName(inv.reservationId);
				const courtDisplay = getCourtDisplay(inv.reservationId);

				return (
					inv.id.toLowerCase().includes(search.toLowerCase()) ||
					(inv.reservationId?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
					customerName.toLowerCase().includes(search.toLowerCase()) ||
					courtDisplay.toLowerCase().includes(search.toLowerCase())
				);
			})
			.filter(inv => {
				const status = (inv.paymentStatus || "PENDING").toUpperCase();
				return filterStatus === "ALL" ||
					(filterStatus === "PAID" && status === "PAID") ||
					(filterStatus === "UNPAID" && status === "PENDING");
			})
			.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
	}, [invoices, reservationsMap, badmintonCourts, search, filterStatus]);

	const paginatedInvoices = useMemo(() => {
		const start = page * rowsPerPage;
		return filteredAndSortedInvoices.slice(start, start + rowsPerPage);
	}, [filteredAndSortedInvoices, page, rowsPerPage]);

	useEffect(() => setPage(0), [search, filterStatus]);

	const filterBg = isDark ? "grey.800" : "grey.100";
	const contentBg = isDark ? "rgba(255,255,255,0.05)" : "#ecfdf5";
	const contentText = isDark ? "#86efac" : "#065f46";

	return (
		<Box sx={{ mt: 6, mb: 4, mx: { xs: 2, md: 4 } }}>
			<Card>
				<CardContent sx={{ p: { xs: 3, md: 4 } }}>
					<Typography variant="h5" color="primary" fontWeight="bold" sx={{ mb: 4 }}>
						Quản lý hóa đơn thanh toán
					</Typography>

					{/* Bộ lọc + Làm mới */}
					<Box sx={{
						display: "flex", flexWrap: "wrap", gap: 2, mb: 3, p: 2,
						bgcolor: filterBg, borderRadius: 2,
						border: isDark ? "1px solid" : "none", borderColor: "grey.700",
						alignItems: "center"
					}}>
						<TextField size="small" label="Tìm khách, sân..." value={search} onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 260 }} />
						<Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} size="small" sx={{ minWidth: 180 }}>
							<MenuItem value="ALL">Tất cả</MenuItem>
							<MenuItem value="UNPAID">Chưa thanh toán</MenuItem>
							<MenuItem value="PAID">Đã thanh toán</MenuItem>
						</Select>
						<Button variant="outlined" onClick={handleClearFilters}>Xóa bộ lọc</Button>
						<Button variant="contained" color="primary"
							startIcon={refreshing ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
							onClick={handleRefresh} disabled={refreshing}
							sx={{ ml: "auto", minWidth: 140 }}>
							{refreshing ? "Đang tải..." : "Làm mới"}
						</Button>
					</Box>

					<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
						Tổng: <strong>{filteredAndSortedInvoices.length}</strong> hóa đơn
					</Typography>

					<Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
						<TableContainer>
							<Table size="small">
								<TableHead>
									<TableRow>
										<TableCell><strong>Khách hàng</strong></TableCell>
										<TableCell><strong>Sân</strong></TableCell>
										<TableCell><strong>Ngày tạo</strong></TableCell>
										<TableCell><strong>Tổng tiền</strong></TableCell>
										<TableCell><strong>Còn lại</strong></TableCell>
										<TableCell align="center"><strong>Trạng thái</strong></TableCell>
										<TableCell><strong>Hành động</strong></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{loading ? (
										[...Array(rowsPerPage)].map((_, i) => (
											<TableRow key={i}><TableCell colSpan={7}><Skeleton height={50} /></TableCell></TableRow>
										))
									) : paginatedInvoices.length === 0 ? (
										<TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}>
											<Typography color="text.secondary">Không có hóa đơn nào</Typography>
										</TableCell></TableRow>
									) : (
										paginatedInvoices.map((invoice) => {
											const customerName = getCustomerName(invoice.reservationId);
											const courtDisplay = getCourtDisplay(invoice.reservationId);

											return (
												<TableRow
													key={invoice.id}
													id={`invoice-${invoice.id}`}
													sx={{
														bgcolor: invoice.id === highlightedInvoiceId ? (isDark ? "#134331" : "#d1fae5") : "transparent",
														transition: "all 0.4s ease",
														"&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.08)" : "grey.50" },
													}}
												>
													<TableCell sx={{ fontWeight: 600, minWidth: 130 }}>
														{customerName}
														{invoice.id === highlightedInvoiceId && (
															<Typography component="span" color="success.main" sx={{ ml: 1, fontSize: "0.85rem" }}>Mới</Typography>
														)}
													</TableCell>
													<TableCell>
														<Chip
															label={courtDisplay}
															size="small"
															color="primary"
															variant="filled"
															sx={{
																fontWeight: 700,
																background: courtDisplay.includes("Sân") ? "linear-gradient(45deg, #10b981, #34d399)" : undefined,
																color: "white",
															}}
														/>
													</TableCell>
													<TableCell>{dayjs(invoice.createAt).format("DD/MM HH:mm")}</TableCell>
													<TableCell>{invoice.total?.toLocaleString("vi-VN")} ₫</TableCell>
													<TableCell sx={{
														fontWeight: 700,
														color: invoice.paymentStatus === "PAID"
															? (isDark ? "#86efac" : "#10b981")
															: (isDark ? "#f87171" : "#dc2626"),
													}}>
														{invoice.paymentStatus === "PAID" ? "0 ₫" : `${invoice.total?.toLocaleString("vi-VN")} ₫`}
													</TableCell>
													<TableCell align="center">{renderStatusChip(invoice)}</TableCell>
													<TableCell>
														<Button
															variant="contained"
															size="small"
															color={invoice.paymentStatus === "PAID" ? "success" : "primary"}
															onClick={() => handleOpenPayment(invoice)}
														>
															{invoice.paymentStatus === "PAID" ? "Xem chi tiết" : "Xem & Thanh toán"}
														</Button>
													</TableCell>
												</TableRow>
											);
										})
									)}
								</TableBody>
							</Table>
						</TableContainer>

						<TablePagination
							rowsPerPageOptions={[10, 25, 50]}
							component="div"
							count={filteredAndSortedInvoices.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={(_, newPage) => setPage(newPage)}
							onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
							labelRowsPerPage="Số dòng/trang:"
							labelDisplayedRows={({ from, to, count }) => `${from}–${to} của ${count}`}
						/>
					</Paper>
				</CardContent>
			</Card>

			{/* DIALOG CHI TIẾT - HIỂN THỊ ĐẦY ĐỦ MÃ */}
			<Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
				{!selectedInvoice ? (
					<DialogContent><Typography>Đang tải...</Typography></DialogContent>
				) : selectedInvoice.paymentStatus === "PAID" ? (
					<>
						<DialogTitle color="success.main">Hóa đơn đã thanh toán hoàn tất</DialogTitle>
						<DialogContent dividers>
							<Box sx={{ p: 3 }}>
								<Stack spacing={3}>
									<Box>
										<Typography variant="subtitle2" color="text.secondary">Mã hóa đơn</Typography>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
											<Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>
												{selectedInvoice.id}
											</Typography>
											<IconButton
												size="small"
												onClick={() => handleCopy(selectedInvoice.id)}
												color="primary"
											>
												<ContentCopyIcon fontSize="small" />
											</IconButton>
										</Box>
									</Box>
									<Box>
										<Typography variant="subtitle2" color="text.secondary">Mã đặt sân</Typography>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
											<Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
												{selectedInvoice.reservationId || "-"}
											</Typography>
											{selectedInvoice.reservationId && (
												<IconButton
													size="small"
													onClick={() => handleCopy(selectedInvoice.reservationId)}
													color="primary"
												>
													<ContentCopyIcon fontSize="small" />
												</IconButton>
											)}
										</Box>
									</Box>
									{getCustomerName(selectedInvoice.reservationId) !== "Khách lẻ" && (
										<Box><Typography variant="subtitle2" color="text.secondary">Khách hàng</Typography><Typography variant="h6" fontWeight="bold">{getCustomerName(selectedInvoice.reservationId)}</Typography></Box>
									)}
									{getCourtDisplay(selectedInvoice.reservationId) !== "Chưa rõ" && (
										<Box><Typography variant="subtitle2" color="text.secondary">Sân đã đặt</Typography><Typography variant="h6" color="primary">{getCourtDisplay(selectedInvoice.reservationId)}</Typography></Box>
									)}
									<Box><Typography variant="subtitle2" color="text.secondary">Ngày tạo</Typography><Typography>{dayjs(selectedInvoice.createAt).format("DD/MM/YYYY HH:mm")}</Typography></Box>
									<Divider />
									<Box><Typography variant="subtitle2" color="text.secondary">Tổng tiền</Typography><Typography variant="h5" color="primary" fontWeight="bold">{selectedInvoice.total?.toLocaleString("vi-VN")} ₫</Typography></Box>
									<Box><Typography variant="subtitle2" color="text.secondary">Còn lại</Typography><Typography variant="h5" color="success.main" fontWeight="bold">0 ₫</Typography></Box>
									<Box textAlign="center" mt={3}>
										<Chip label="ĐÃ THANH TOÁN HOÀN TẤT" color="success" size="large" sx={{ fontSize: "1.1rem", px: 4, py: 2.5 }} />
									</Box>
								</Stack>
							</Box>
						</DialogContent>
						<DialogActions sx={{ p: 3 }}>
							<Button onClick={handleCloseDialog} variant="contained" size="large">Đóng</Button>
						</DialogActions>
					</>
				) : (
					<>
						<DialogTitle>Thông tin chuyển khoản</DialogTitle>
						<DialogContent dividers>
							<Box sx={{ mb: 3, p: 2, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'grey.50', borderRadius: 2 }}>
								<Stack spacing={2}>
									<Box>
										<Typography variant="subtitle2" color="text.secondary">Mã hóa đơn</Typography>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
											<Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>
												{selectedInvoice.id}
											</Typography>
											<IconButton
												size="small"
												onClick={() => handleCopy(selectedInvoice.id)}
												color="primary"
											>
												<ContentCopyIcon fontSize="small" />
											</IconButton>
										</Box>
									</Box>
									<Box>
										<Typography variant="subtitle2" color="text.secondary">Mã đặt sân</Typography>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
											<Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
												{selectedInvoice.reservationId || "-"}
											</Typography>
											{selectedInvoice.reservationId && (
												<IconButton
													size="small"
													onClick={() => handleCopy(selectedInvoice.reservationId)}
													color="primary"
												>
													<ContentCopyIcon fontSize="small" />
												</IconButton>
											)}
										</Box>
									</Box>
								</Stack>
							</Box>

							{branch?.bankName && branch?.bankNumber ? (
								<Box sx={{ p: 4, textAlign: "center" }}>
									<Typography variant="h6" color="primary" fontWeight={700} gutterBottom>
										{branch.bankName.toUpperCase()}
									</Typography>
									<Box sx={{ my: 3 }}>
										<Typography variant="subtitle1" color="text.secondary">Số tài khoản</Typography>
										<Box display="flex" justifyContent="center" alignItems="center" gap={1}>
											<Typography variant="h4" fontWeight="bold" letterSpacing={1}>{branch.bankNumber}</Typography>
											<IconButton onClick={() => handleCopy(branch.bankNumber)} color="primary"><ContentCopyIcon /></IconButton>
										</Box>
									</Box>
									<Box sx={{ my: 3 }}>
										<Typography variant="subtitle1" color="text.secondary">Nội dung chuyển khoản</Typography>
										<Box sx={{
											mt: 1, p: 2, bgcolor: contentBg, color: contentText, borderRadius: 2,
											fontSize: "1.25rem", fontWeight: "bold", fontFamily: "monospace",
											display: "inline-flex", alignItems: "center", gap: 1,
											border: isDark ? "1px solid #166534" : "1px solid #86efac",
										}}>
											Thanh toán {selectedInvoice.id}
											<IconButton size="small" onClick={() => handleCopy(`Thanh toán ${selectedInvoice.id}`)}><ContentCopyIcon fontSize="small" /></IconButton>
										</Box>
									</Box>
									<Box sx={{ mt: 4 }}>
										<Typography variant="subtitle1" fontWeight={600} gutterBottom>Quét mã QR để thanh toán nhanh</Typography>
										<img
											src={`https://img.vietqr.io/image/mb-${branch.bankNumber}-compact2.png?amount=${selectedInvoice.total}&addInfo=ThanhToan%20${selectedInvoice.id}`}
											alt="QR Thanh toán"
											style={{ width: "100%", maxWidth: 280, borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.3)", background: "white", padding: 8 }}
										/>
									</Box>
								</Box>
							) : (
								<Typography color="error" align="center" sx={{ p: 4 }}>Chưa cấu hình thông tin ngân hàng.</Typography>
							)}
						</DialogContent>
						<DialogActions sx={{ p: 3, justifyContent: "space-between" }}>
							<Button variant="contained" color="success" size="large" onClick={handleMarkAsPaid} sx={{ px: 5 }}>
								Xác nhận đã nhận tiền
							</Button>
							<Button onClick={handleCloseDialog} variant="outlined">Đóng</Button>
						</DialogActions>
					</>
				)}
			</Dialog>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={4000}
				onClose={() => setSnackbar({ ...snackbar, open: false })}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
			>
				<Alert severity={snackbar.severity} sx={{ borderRadius: 2, fontSize: "1rem" }}>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default PaymentInvoiceTable;