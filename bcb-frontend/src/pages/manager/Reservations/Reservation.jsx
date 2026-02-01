import React, { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Card,
	CardContent,
	Select,
	MenuItem,
	Chip,
	IconButton,
	Typography,
	Box,
	TextField,
	Snackbar,
	Alert,
	Button,
	Tooltip,
	Skeleton,
	TablePagination,
	useTheme,
} from "@mui/material";
import {
	Edit as EditIcon,
	Check as CheckIcon,
	Clear as ClearIcon,
	Receipt as ReceiptIcon,
	Event as EventIcon,
} from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { vi } from "date-fns/locale";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import reservationService from "../../../services/reservationService";
import badmintionCourtService from "../../../services/badmintonCourtService";
import invoiceService from "../../../services/invoiceService";
import branchService from "../../../services/branchServce";
import authService from "../../../services/authService";
import { useAuth } from "../../../../context/AuthContext";
import useSSE from "../../../../hook/useSSE";

const statusColors = { cancel: "error", waiting: "warning", checked: "success", finish: "success" };
const statusLabels = { cancel: "Đã hủy", waiting: "Chờ đến sân", checked: "Đã đến", finish: "Đã kết thúc" };

const ReservationTable = () => {
	const theme = useTheme(); // Sử dụng theme từ ManagerLayout
	const navigate = useNavigate();
	const [reservations, setReservations] = useState([]);
	const [courts, setCourts] = useState([]);
	const [editId, setEditId] = useState(null);
	const [statusUpdate, setStatusUpdate] = useState("");
	const [filterStatus, setFilterStatus] = useState("ALL");
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
	const [filterDate, setFilterDate] = useState(null);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [justCreatedInvoiceId, setJustCreatedInvoiceId] = useState(null);
	const { user } = useAuth();
	const { onEvent } = useSSE(user.id);


	const fetchData = async () => {
		setLoading(true);
		try {
			const token = localStorage.getItem("authToken");
			if (!token) throw new Error("Không tìm thấy token đăng nhập.");

			const account = await authService.getCurrentAccount(token);
			const courts = await badmintionCourtService.getCourtsByManager(account.id, token);
			const branch = await branchService.getBranchByAccountId(account.id, token);
			const reservations = await reservationService.getAllReservationsByBookAtDesc(branch.id);

			const reservationsWithInvoices = await Promise.all(
				reservations.map(async (res) => {
					try {
						const invoice = await invoiceService.getInvoiceByReservationId(res.id, token);
						return { ...res, invoiceCode: invoice?.id || null };
					} catch {
						return { ...res, invoiceCode: null };
					}
				})
			);

			setCourts(courts);
			setReservations(reservationsWithInvoices);
		} catch (err) {
			setSnackbar({ open: true, message: err.message || "Lỗi tải dữ liệu", severity: "error" });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { fetchData(); }, []);

	useEffect(() => {
		const handleNewReservation = (newRes) => {
			setReservations(prev =>
				prev.some(r => r.id === newRes.id) ? prev : [newRes, ...prev]
			);
		};

		onEvent("RESERVATION_CREATED", handleNewReservation);
	}, [onEvent]);


	const handleStatusChange = async (id, newStatus) => {
		try {
			const token = localStorage.getItem("authToken");
			await reservationService.updateReservationStatus(id, newStatus, token);
			setReservations(prev => prev.map(res => res.id === id ? { ...res, status: newStatus } : res));
			setEditId(null);
			setSnackbar({ open: true, message: "Cập nhật trạng thái thành công!", severity: "success" });
		} catch (err) {
			setSnackbar({ open: true, message: "Cập nhật thất bại", severity: "error" });
		}
	};

	const handleCreateInvoice = async (reservationId) => {
		try {
			const token = localStorage.getItem("authToken");
			const response = await invoiceService.createInvoice(reservationId, token, {
				payment_status: "PENDING"
			});

			const invoiceCode = response.id || response.invoiceId || response.data?.id;

			setReservations(prev =>
				prev.map(res =>
					res.id === reservationId ? { ...res, invoiceCode } : res
				)
			);

			setJustCreatedInvoiceId(invoiceCode);

			setSnackbar({
				open: true,
				message: (
					<Box>
						Tạo hóa đơn thành công! Mã: <strong>{invoiceCode}</strong>
						<Button
							size="small"
							variant="contained"
							color="info"
							sx={{ ml: 2, py: 0.5, fontSize: "0.8rem" }}
							onClick={() => {
								setSnackbar({ ...snackbar, open: false });
								navigate("/manager/invoices", { state: { highlightInvoiceId: invoiceCode } });
							}}
						>
							Xem ngay
						</Button>
					</Box>
				),
				severity: "success",
			});
		} catch (err) {
			setSnackbar({
				open: true,
				message: err.response?.data?.message || "Tạo hóa đơn thất bại!",
				severity: "error",
			});
		}
	};

	const handleViewInvoice = (invoiceId) => {
		navigate("/manager/invoices", { state: { highlightInvoiceId: invoiceId } });
	};

	const handleClearFilters = () => {
		setFilterStatus("ALL");
		setSearchTerm("");
		setFilterDate(null);
		setPage(0);
	};

	const filteredReservations = reservations
		.filter(res => filterStatus === "ALL" || res.status === filterStatus)
		.filter(res =>
			res.reservationDetails.some(d =>
				d.playerName?.toLowerCase().includes(searchTerm.toLowerCase())
			)
		)
		.filter(res => !filterDate || dayjs(res.bookAt).format("YYYY-MM-DD") === filterDate);

	const flattenedRows = filteredReservations.flatMap((res, index) =>
		res.reservationDetails.map(detail => ({ reservation: res, detail, index }))
	);

	const paginatedRows = flattenedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	return (
		<Box sx={{ mt: 6, mb: 8, mx: { xs: 2, md: 4 } }}>
			<Card
				elevation={0}
				sx={{
					bgcolor: 'background.paper',
					borderRadius: 3,
					boxShadow: theme.palette.mode === 'dark'
						? '0 4px 20px rgba(0,0,0,0.3)'
						: '0 4px 20px rgba(0,0,0,0.06)',
				}}
			>
				<CardContent sx={{ p: { xs: 3, md: 5 } }}>
					<Typography
						variant="h5"
						color="primary"
						sx={{
							mb: 4,
							fontWeight: 700,
							display: 'flex',
							alignItems: 'center',
							gap: 1.5
						}}
					>
						<EventIcon sx={{ fontSize: 32 }} />
						Quản lý lịch đặt sân
					</Typography>

					{/* Filter Bar */}
					<Box sx={{
						display: "flex",
						flexWrap: "wrap",
						gap: 2,
						mb: 4,
						p: 3,
						bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'grey.50',
						borderRadius: 3,
						border: "1px solid",
						borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'grey.200',
						transition: 'all 0.3s ease'
					}}>
						<TextField
							size="small"
							label="Tìm người đặt"
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							sx={{ minWidth: 220 }}
						/>
						<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
							<DatePicker
								label="Chọn ngày"
								value={filterDate ? new Date(filterDate) : null}
								onChange={newDate => {
									setFilterDate(newDate ? newDate.toISOString().split("T")[0] : null);
									setPage(0);
								}}
								slotProps={{ textField: { size: "small" } }}
							/>
						</LocalizationProvider>
						<Select
							value={filterStatus}
							onChange={e => { setFilterStatus(e.target.value); setPage(0); }}
							size="small"
							sx={{ minWidth: 180 }}
						>
							<MenuItem value="ALL">Tất cả</MenuItem>
							<MenuItem value="waiting">Chờ đến sân</MenuItem>
							<MenuItem value="checked">Đã đến</MenuItem>
							<MenuItem value="cancel">Đã hủy</MenuItem>
							<MenuItem value="finish">Đã kết thúc</MenuItem>
						</Select>
						<Button
							variant="outlined"
							startIcon={<ClearIcon />}
							onClick={handleClearFilters}
							color="primary"
						>
							Xóa bộ lọc
						</Button>
					</Box>

					{/* Table */}
					{loading ? (
						<Box sx={{ p: 4 }}>
							{[...Array(6)].map((_, i) =>
								<Skeleton
									key={i}
									height={60}
									sx={{
										mb: 1,
										borderRadius: 2,
										bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : undefined
									}}
								/>
							)}
						</Box>
					) : (
						<>
							<TableContainer sx={{
								borderRadius: 2,
								border: '1px solid',
								borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'grey.200'
							}}>
								<Table size="medium">
									<TableHead>
										<TableRow sx={{
											bgcolor: theme.palette.mode === 'dark' ? 'rgba(79, 195, 161, 0.1)' : 'grey.50'
										}}>
											<TableCell>
												<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
													<EventIcon fontSize="small" color="primary" />
													<strong>Mã lịch đặt</strong>
												</Box>
											</TableCell>
											<TableCell><strong>Người đặt</strong></TableCell>
											<TableCell><strong>Sân</strong></TableCell>
											<TableCell><strong>Bắt đầu</strong></TableCell>
											<TableCell><strong>Kết thúc</strong></TableCell>
											<TableCell><strong>Ngày đặt</strong></TableCell>
											<TableCell><strong>Trạng thái</strong></TableCell>
											<TableCell align="center"><strong>Hành động</strong></TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{paginatedRows.map(({ reservation: res, detail }, index) => {
											const court = courts.find(c => c.id === detail.badmintonCourtId);
											const courtNumber = court?.ordinalNumber || "N/A";
											const [hour, minute] = detail.startTime.split(":").map(Number);
											const endTime = dayjs(new Date(0, 0, 0, hour, minute + (detail.rentalTime + (detail.extendedTime || 0)) * 60)).format("HH:mm");

											return (
												<TableRow
													key={`${res.id}-${detail.badmintonCourtId}-${detail.startTime}`}
													sx={{
														backgroundColor: theme.palette.mode === 'dark'
															? (index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)')
															: (index % 2 === 0 ? "white" : "#fafcfb"),
														transition: "all 0.3s",
														"&:hover": {
															backgroundColor: theme.palette.mode === 'dark'
																? 'rgba(79, 195, 161, 0.1) !important'
																: "#ecfdf5 !important"
														},
													}}
												>
													<TableCell>
														<Tooltip title="Mã lịch đặt sân">
															<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
																<EventIcon fontSize="small" color="primary" />
																<Typography
																	fontWeight="bold"
																	color="primary"
																	sx={{ fontFamily: "monospace" }}
																>
																	{res.id}
																</Typography>
															</Box>
														</Tooltip>
													</TableCell>

													<TableCell>{res.playerName || res.id}</TableCell>
													<TableCell>
														<Chip
															label={`Sân ${courtNumber}`}
															color="primary"
															size="small"
															sx={{
																fontWeight: 600,
																borderRadius: 2
															}}
														/>
													</TableCell>
													<TableCell>{detail.startTime}</TableCell>
													<TableCell>{endTime}</TableCell>
													<TableCell>{dayjs(res.bookAt).format("DD/MM/YYYY")}</TableCell>
													<TableCell>
														{editId === res.id ? (
															<Select
																value={statusUpdate}
																onChange={e => setStatusUpdate(e.target.value)}
																size="small"
																sx={{ minWidth: 140 }}
															>
																{["waiting", "checked", "cancel", "finish"]
																	.filter(s => !(res.status === "cancel" && s !== "cancel"))
																	.map(s => (
																		<MenuItem key={s} value={s} disabled={res.status === "cancel"}>
																			{statusLabels[s]}
																		</MenuItem>
																	))}
															</Select>
														) : (
															<Chip
																label={statusLabels[res.status] || res.status}
																color={statusColors[res.status] || "default"}
																size="small"
																sx={{ fontWeight: 600, borderRadius: 2 }}
															/>
														)}
													</TableCell>
													<TableCell>
														<Box sx={{ display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap" }}>
															{res.status !== "cancel" && res.status !== "finish" && (
																editId === res.id ? (
																	<IconButton
																		color="primary"
																		onClick={() => handleStatusChange(res.id, statusUpdate)}
																		sx={{
																			'&:hover': {
																				transform: 'scale(1.1)',
																				transition: 'transform 0.2s'
																			}
																		}}
																	>
																		<CheckIcon />
																	</IconButton>
																) : (
																	<Tooltip title="Chỉnh sửa trạng thái">
																		<IconButton
																			onClick={() => { setEditId(res.id); setStatusUpdate(res.status); }}
																			color="primary"
																			sx={{
																				'&:hover': {
																					transform: 'scale(1.1)',
																					transition: 'transform 0.2s'
																				}
																			}}
																		>
																			<EditIcon />
																		</IconButton>
																	</Tooltip>
																)
															)}
															{(res.status === "cancel" || res.status === "finish") && (
																<Tooltip title={res.status === "finish" ? "Đã kết thúc" : "Đã hủy"}>
																	<span>
																		<IconButton disabled>
																			<EditIcon color="disabled" />
																		</IconButton>
																	</span>
																</Tooltip>
															)}

															{res.status === "checked" && !res.invoiceCode && (
																<Button
																	variant="contained"
																	size="small"
																	onClick={() => handleCreateInvoice(res.id)}
																	sx={{
																		minWidth: 120,
																		borderRadius: 2,
																		textTransform: 'none',
																		fontWeight: 600
																	}}
																>
																	Tạo hóa đơn
																</Button>
															)}

															{res.invoiceCode && (
																<Button
																	variant="contained"
																	color="info"
																	size="small"
																	startIcon={<ReceiptIcon />}
																	onClick={() => handleViewInvoice(res.invoiceCode)}
																	sx={{
																		minWidth: 120,
																		borderRadius: 2,
																		textTransform: 'none',
																		fontWeight: 600,
																		animation: res.invoiceCode === justCreatedInvoiceId ? "pulse 1.5s ease-in-out 3" : "none",
																		"@keyframes pulse": {
																			"0%, 100%": { transform: "scale(1)" },
																			"50%": { transform: "scale(1.05)" },
																		},
																	}}
																>
																	Xem hóa đơn
																</Button>
															)}
														</Box>
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</TableContainer>

							<TablePagination
								rowsPerPageOptions={[10, 25, 50]}
								component="div"
								count={flattenedRows.length}
								rowsPerPage={rowsPerPage}
								page={page}
								onPageChange={(e, p) => setPage(p)}
								onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }}
								labelRowsPerPage="Số dòng/trang:"
								labelDisplayedRows={({ from, to, count }) => `${from}–${to} / ${count}`}
								sx={{
									borderTop: '1px solid',
									borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'grey.200',
									mt: 2
								}}
							/>
						</>
					)}

					<Snackbar
						open={snackbar.open}
						autoHideDuration={5000}
						onClose={() => setSnackbar({ ...snackbar, open: false })}
						anchorOrigin={{ vertical: "top", horizontal: "center" }}
					>
						<Alert
							severity={snackbar.severity}
							sx={{
								borderRadius: 3,
								fontWeight: 500,
								boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
							}}
						>
							{snackbar.message}
						</Alert>
					</Snackbar>
				</CardContent>
			</Card>
		</Box>
	);
};

export default ReservationTable;