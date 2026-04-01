import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import {
	Card,
	CardContent,
	Typography,
	Collapse,
	Button,
	Switch,
	Box,
	CardMedia,
	Chip,
	Stack,
	Paper,
	Divider,
	Snackbar,
	Alert,
	createTheme,
	ThemeProvider,
} from "@mui/material";
import {
	AccessTime,
	ExpandMore,
	ExpandLess,
	CheckCircle,
	Cancel,
	CalendarToday,
	Schedule,
	Person,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { resolveBackendUrl } from "../../../services/api";
import badmintionCourtService from "../../../services/badmintonCourtService";
import reservationDetailService from "../../../services/reservationDetailService";
import branchService from "../../../services/branchServce";
import { useAuth } from "../../../../context/AuthContext";

// === ĐỒNG BỘ VỚI DASHBOARD ===
const theme = createTheme({
	palette: {
		primary: { main: "#10b981", light: "#34d399", dark: "#059669" },
		success: { main: "#10b981" },
		error: { main: "#ef4444" },
		warning: { main: "#f59e0b" },
		background: { default: "#f9fafb", paper: "#ffffff" },
		grey: { 50: "#f9fafb", 100: "#f3f4f6", 200: "#e5e7eb", 300: "#d1d5db", 800: "#1f2937" },
		text: { primary: "#111827", secondary: "#6b7280" },
	},
	typography: {
		fontFamily: '"Inter", "SF Pro Display", -apple-system, system-ui, sans-serif',
		h6: { fontWeight: 700 },
		subtitle1: { fontWeight: 600 },
		body2: { fontSize: "0.875rem" },
		caption: { fontSize: "0.75rem", color: "#6b7280" },
	},
	shape: { borderRadius: 12 },
	components: {
		MuiCard: {
			styleOverrides: { root: { borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" } },
		},
		MuiButton: {
			styleOverrides: { root: { textTransform: "none", fontWeight: 600, borderRadius: 12 } },
		},
		MuiChip: {
			styleOverrides: { root: { borderRadius: 8, fontWeight: 600 } },
		},
	},
});

const getMinStartTimeAndMaxEndTime = (prices) => {
	let min = 7,
		max = 22;
	if (prices?.length > 0) {
		min = Math.min(min, ...prices.map((p) => p.startTime));
		max = Math.max(max, ...prices.map((p) => p.endTime));
	}
	return { minStartTime: min, maxEndTime: max };
};

const generateTimeSlots = (start, end) => {
	const slots = [];
	for (let h = start; h < end; h += 0.5) {
		const hour = Math.floor(h);
		const minute = h % 1 === 0 ? "00" : "30";
		const nextHour = Math.floor(h + 0.5);
		const nextMinute = minute === "00" ? "30" : "00";
		const endHour = nextHour > end ? end : nextHour;
		slots.push(`${String(hour).padStart(2, "0")}:${minute} - ${String(endHour).padStart(2, "0")}:${nextMinute}`);
	}
	return slots;
};

const timeToMinutes = (t) => {
	const [h, m] = t.split(":").map(Number);
	return h * 60 + m;
};

const getImageUrl = (p) => resolveBackendUrl(p);

const CourtCard = ({ court, isExpanded, toggleCourt, onStatusUpdate }) => {
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [slots, setSlots] = useState([]);
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
	const [prices, setPrices] = useState([]);
	const [startTime, setStartTime] = useState(7);
	const [endTime, setEndTime] = useState(22);
	const [fixedTimeSlots, setFixedTimeSlots] = useState([]);
	const [isInUse, setIsInUse] = useState(false);

	// === Lấy giá khung giờ của chi nhánh ===
	useEffect(() => {
		const fetch = async () => {
			try {
				const branch = await branchService.getBranchByAccountId(user.id);
				const data = await branchService.getAllPricesOfBranch(branch.id);
				setPrices(data || []);
			} catch (e) {
				console.error(e);
			}
		};
		if (user?.id) fetch();
	}, [user?.id]);

	// === Tạo khung giờ ===
	useEffect(() => {
		const { minStartTime, maxEndTime } = getMinStartTimeAndMaxEndTime(prices);
		setStartTime(minStartTime);
		setEndTime(maxEndTime);
	}, [prices]);

	useEffect(() => {
		setFixedTimeSlots(generateTimeSlots(startTime, endTime));
	}, [startTime, endTime]);

	// === Lấy danh sách slot hôm nay ===
	useEffect(() => {
		if (!court.id) return;
		const fetch = async () => {
			try {
				const token = localStorage.getItem("authToken");
				const data = await reservationDetailService.getTodaySlotsByCourt(court.id, token);
				setSlots(data || []);
			} catch (e) {
				console.error(e);
			}
		};
		fetch();

		// Tự động reload dữ liệu mỗi 5 phút (phòng khi có thay đổi từ người khác)
		const interval = setInterval(fetch, 5 * 60 * 1000);
		return () => clearInterval(interval);
	}, [court.id]);


	// === Hàm kiểm tra sân có đang được sử dụng không ===
	const checkCourtUsage = () => {
		const now = new Date();
		const currentMinutes = now.getHours() * 60 + now.getMinutes();

		const isBookedNow = slots.some((b) => {
			const start = timeToMinutes(b.startTime.slice(0, 5));
			const end = start + (b.rentalTime + (b.extendedTime || 0)) * 60;
			return currentMinutes >= start && currentMinutes < end;
		});

		setIsInUse(isBookedNow);
	};

	// === Kiểm tra trạng thái sân mỗi 30s ===
	useEffect(() => {
		if (!slots.length) return;
		checkCourtUsage();
		const interval = setInterval(checkCourtUsage, 30000);
		return () => clearInterval(interval);
	}, [slots]);

	// === Chuyển đổi trạng thái sân (bật/tắt) ===
	const handleSwitchChange = async () => {
		if (court.available && slots.length > 0) {
			setSnackbar({ open: true, message: "Còn lịch đặt, không thể tắt sân!", severity: "warning" });
			return;
		}
		setLoading(true);
		try {
			const token = localStorage.getItem("authToken");
			await badmintionCourtService.toggleCourtStatus(court.id, token);
			onStatusUpdate?.();
			setSnackbar({ open: true, message: "Cập nhật thành công!", severity: "success" });
		} catch (e) {
			setSnackbar({ open: true, message: "Lỗi cập nhật!", severity: "error" });
		} finally {
			setLoading(false);
		}
	};

	const bookedCount = slots.length;
	const totalSlots = fixedTimeSlots.length;
	const occupancyRate = totalSlots > 0 ? Math.round((bookedCount / totalSlots) * 100) : 0;

	return (
		<ThemeProvider theme={theme}>
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
				<Card
					sx={{
						width: { xs: 340, sm: 380 },
						m: 2,
						borderRadius: 4,
						overflow: "hidden",
						boxShadow: 3,
						border: court.available ? "2px solid #10b981" : "1px solid #e5e7eb",
						transition: "all 0.3s ease",
						"&:hover": {
							transform: "translateY(-8px)",
							boxShadow: 6,
							borderColor: court.available ? "#059669" : "#d1d5db",
						},
					}}
				>
					{/* Ảnh + Trạng thái */}
					{court.images?.length > 0 && (
						<Box sx={{ position: "relative" }}>
							<Slider dots infinite autoplay autoplaySpeed={5000} fade arrows={false}>
								{court.images.map((img, i) => (
									<Box key={i} sx={{ height: 240 }}>
										<CardMedia
											component="img"
											image={getImageUrl(img.imagePath)}
											alt=""
											sx={{ height: "100%", objectFit: "cover" }}
										/>
									</Box>
								))}
							</Slider>
							<Chip
								icon={
									!court.available ? (
										<Cancel />
									) : isInUse ? (
										<AccessTime />
									) : (
										<CheckCircle />
									)
								}
								label={
									!court.available
										? "Tạm đóng"
										: isInUse
											? "Đang sử dụng"
											: "Đang trống"
								}
								color={
									!court.available
										? "error"
										: isInUse
											? "warning"
											: "success"
								}
								size="small"
								sx={{
									position: "absolute",
									top: 16,
									right: 16,
									fontWeight: 600,
									boxShadow: 2,
								}}
							/>
						</Box>
					)}

					<CardContent sx={{ p: 3 }}>
						<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
							<Typography variant="h6" fontWeight="bold" color="text.primary">
								Sân số {court.ordinalNumber}
							</Typography>
							<Switch checked={court.available} onChange={handleSwitchChange} disabled={loading} color="success" />
						</Stack>

						{court.available && (
							<Paper
								elevation={0}
								sx={{
									p: 2,
									mb: 3,
									bgcolor: "grey.50",
									borderRadius: 3,
									border: "1px solid #e5e7eb",
								}}
							>
								<Stack direction="row" spacing={3} divider={<Divider orientation="vertical" flexItem />}>
									<Box>
										<Typography variant="caption" color="text.secondary">
											Đã đặt
										</Typography>
										<Typography variant="h6" color="primary" fontWeight="bold">
											{bookedCount} / {totalSlots}
										</Typography>
									</Box>
									<Box>
										<Typography variant="caption" color="text.secondary">
											Lấp đầy
										</Typography>
										<Typography
											variant="h6"
											fontWeight="bold"
											color={
												occupancyRate > 70
													? "success.main"
													: occupancyRate > 40
														? "warning.main"
														: "text.secondary"
											}
										>
											{occupancyRate}%
										</Typography>
									</Box>
								</Stack>
							</Paper>
						)}

						<Button
							fullWidth
							variant="contained"
							size="large"
							onClick={() => toggleCourt(court.id)}
							startIcon={<CalendarToday />}
							endIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
							disabled={!court.available}
							sx={{
								py: 1.8,
								borderRadius: 3,
								fontWeight: 600,
								bgcolor: isExpanded ? "grey.200" : "primary.main",
								color: isExpanded ? "text.primary" : "#fff",
								"&:hover": { bgcolor: isExpanded ? "grey.300" : "primary.dark" },
							}}
						>
							{isExpanded ? "Ẩn lịch đặt" : "Xem lịch hôm nay"}
						</Button>
					</CardContent>

					{/* Collapse lịch chi tiết */}
					<Collapse in={isExpanded}>
						<Box sx={{ bgcolor: "grey.50", p: 3, pt: 0 }}>
							<Stack direction="row" alignItems="center" spacing={1} mb={2} mt={2}>
								<Schedule color="primary" />
								<Typography variant="h6" fontWeight="bold">
									Lịch đặt hôm nay
								</Typography>
								<Chip label={`${bookedCount} đặt`} color="primary" size="small" />
							</Stack>

							<Stack spacing={1.5} sx={{ maxHeight: 500, overflowY: "auto", pr: 1 }}>
								{fixedTimeSlots.map((slot, idx) => {
									const slotStart = timeToMinutes(slot.split(" - ")[0]);
									const booking = slots.find((b) => {
										const s = timeToMinutes(b.startTime.slice(0, 5));
										const dur = (b.rentalTime + (b.extendedTime || 0)) * 60;
										return slotStart >= s && slotStart < s + dur;
									});

									return (
										<motion.div
											key={idx}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: idx * 0.02 }}
										>
											<Paper
												sx={{
													p: 2,
													borderRadius: 3,
													border: booking ? "2px solid #10b981" : "1px dashed #d1d5db",
													bgcolor: booking ? "#ecfdf5" : "#fff",
													transition: "all 0.2s",
													"&:hover": { boxShadow: booking ? 4 : 2 },
												}}
											>
												<Stack direction="row" alignItems="center" spacing={2}>
													<Box sx={{ width: 64, textAlign: "center" }}>
														<AccessTime color={booking ? "success" : "disabled"} />
														<Typography
															variant="body2"
															fontWeight="bold"
															color={booking ? "success.dark" : "text.secondary"}
														>
															{slot}
														</Typography>
													</Box>

													<Box flex={1}>
														{booking ? (
															<Stack spacing={0.5}>
																<Stack direction="row" alignItems="center" spacing={1}>
																	<Person color="success" />
																	<Typography fontWeight="bold" color="success.dark">
																		{booking.playerName}
																	</Typography>
																</Stack>
																<Typography variant="caption" color="text.secondary">
																	{(booking.startTime || "--:--").slice(0, 5)} -{" "}
																	{(booking.endTime || "--:--").slice(0, 5)} •{" "}
																	{booking.rentalTime || 0}h
																	{booking.extendedTime ? ` +${booking.extendedTime}h` : ""}
																</Typography>
															</Stack>
														) : (
															<Typography color="text.secondary" fontStyle="italic">
																Trống
															</Typography>
														)}
													</Box>

													<Chip
														label={booking ? "Đã đặt" : "Trống"}
														size="small"
														color={booking ? "success" : "default"}
														variant={booking ? "filled" : "outlined"}
													/>
												</Stack>
											</Paper>
										</motion.div>
									);
								})}
							</Stack>
						</Box>
					</Collapse>

					<Snackbar
						open={snackbar.open}
						autoHideDuration={3000}
						onClose={() => setSnackbar({ ...snackbar, open: false })}
						anchorOrigin={{ vertical: "top", horizontal: "center" }}
					>
						<Alert severity={snackbar.severity} sx={{ borderRadius: 3 }}>
							{snackbar.message}
						</Alert>
					</Snackbar>
				</Card>
			</motion.div>
		</ThemeProvider>
	);
};

export default CourtCard;
