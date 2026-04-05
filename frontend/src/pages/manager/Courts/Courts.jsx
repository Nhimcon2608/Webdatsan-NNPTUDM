// src/pages/manager/Courts.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
	Container,
	Typography,
	Box,
	Button,
	TextField,
	InputAdornment,
	Select,
	MenuItem,
	Alert,
	useTheme,
	Stack,
	Chip,
	Skeleton,
	alpha,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // Import Grid cũ
import {
	Search as SearchIcon,
	Refresh as RefreshIcon,
	SportsTennis,
	Add as AddIcon,
} from "@mui/icons-material";
import CourtCard from "./CourtCard";
import BadmintonIcon from "../../../components/common/BadmintonIcon";
import badmintionCourtService from "../../../services/badmintonCourtService";
import authService from "../../../services/authService";
import branchService from "../../../services/branchServce";
import reservationDetailService from "../../../services/reservationDetailService";
import AddCourtModal from "../../admin/BranchDetailPage/AddCourtModal";

const Courts = () => {
	const theme = useTheme();

	const [courts, setCourts] = useState([]);
	const [expandedCourtId, setExpandedCourtId] = useState(null);
	const [slots, setSlots] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [search, setSearch] = useState("");
	const [filterStatus, setFilterStatus] = useState("ALL");
	const [openAddCourtModal, setOpenAddCourtModal] = useState(false);
	const [managerContext, setManagerContext] = useState({
		accountId: "",
		branchId: "",
	});

	// === FETCH COURTS ===
	const fetchCourts = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const token = localStorage.getItem("authToken");
			if (!token) throw new Error("Vui lòng đăng nhập lại.");

			const account = await authService.getCurrentAccount(token);
			const branch = await branchService.getBranchByAccountId(account.id, token);
			const data = await badmintionCourtService.getCourtsByManager(account.id, token);

			const sortedData = (data || []).sort((a, b) => a.ordinalNumber - b.ordinalNumber);

			setManagerContext({
				accountId: account.id || "",
				branchId: branch?.id || "",
			});
			setCourts(sortedData);
		} catch (err) {
			setError(err.message || "Không thể tải danh sách sân.");
			console.error("Lỗi tải sân:", err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchCourts();
	}, [fetchCourts]);

	// === TOGGLE EXPAND + LOAD SLOTS ===
	const toggleCourt = async (courtId) => {
		if (expandedCourtId === courtId) {
			setExpandedCourtId(null);
			return;
		}

		if (!slots[courtId]) {
			try {
				const token = localStorage.getItem("authToken");
				const courtSlots = await reservationDetailService.getTodaySlotsByCourt(courtId, token);
				setSlots((prev) => ({ ...prev, [courtId]: courtSlots || [] }));
			} catch (err) {
				setError("Không thể tải lịch đặt hôm nay.");
				console.error(err);
			}
		}
		setExpandedCourtId(courtId);
	};

	// === FILTER & SEARCH ===
	const filteredCourts = courts.filter((court) => {
		const matchesSearch = court.ordinalNumber.toString().includes(search);
		const matchesStatus =
			filterStatus === "ALL" ||
			(filterStatus === "AVAILABLE" ? court.available : !court.available);
		return matchesSearch && matchesStatus;
	});

	const handleClearFilters = () => {
		setSearch("");
		setFilterStatus("ALL");
	};

	const handleAddCourtSubmit = async (courtData) => {
		if (!managerContext.branchId) {
			throw new Error("Không tìm thấy chi nhánh của quản lý.");
		}

		await badmintionCourtService.addCourt({
			...courtData,
			branchId: managerContext.branchId,
			managerAccountId: managerContext.accountId,
		});
		await fetchCourts();
	};

	return (
		<Container maxWidth="xl" sx={{ py: 4, position: "relative" }}>
			<Box
				sx={{
					position: "sticky",
					top: "64px",
					zIndex: 20,
					backdropFilter: "blur(10px)",
					bgcolor: alpha(theme.palette.background.paper, 0.8),
					borderBottom: "1px solid",
					borderColor: "divider",
					py: 2,
					px: { xs: 2, md: 3 },
					mb: 3,
					borderRadius: "0 0 16px 16px",
					boxShadow: theme.palette.mode === "dark" ? 3 : 1,
				}}
			>
				<Stack
					direction={{ xs: "column", md: "row" }}
					justifyContent="space-between"
					alignItems={{ xs: "flex-start", md: "center" }}
					spacing={2}
				>
					<Stack direction="row" alignItems="center" spacing={2}>
						<BadmintonIcon sx={{ fontSize: 40, color: "primary.main" }} />
						<Box>
							<Typography variant="h5" fontWeight="bold" color="text.primary">
								Quản lý Sân Cầu Lông
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Tổng cộng: {courts.length} sân • Hoạt động:{" "}
								{courts.filter((c) => c.available).length}
							</Typography>
						</Box>
					</Stack>

					{/* Bộ lọc & nút thao tác */}
					<Stack
						direction={{ xs: "column", sm: "row" }}
						spacing={2}
						width={{ xs: "100%", md: "auto" }}
						alignItems="center"
					>
						<TextField
							size="small"
							placeholder="Tìm sân số..."
							value={search}
							onChange={(e) => setSearch(e.target.value.toLowerCase())}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon color="action" />
									</InputAdornment>
								),
							}}
							sx={{ minWidth: 200 }}
						/>

						<Select
							size="small"
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}
							sx={{ minWidth: 160 }}
						>
							<MenuItem value="ALL">Tất cả sân</MenuItem>
							<MenuItem value="AVAILABLE">
								<Chip label="Hoạt động" color="success" size="small" sx={{ mr: 1 }} />
								Đang hoạt động
							</MenuItem>
							<MenuItem value="UNAVAILABLE">
								<Chip label="Dừng" color="error" size="small" sx={{ mr: 1 }} />
								Đã vô hiệu
							</MenuItem>
						</Select>

						<Button variant="outlined" onClick={handleClearFilters} size="small">
							Xóa lọc
						</Button>

						<Button
							variant="contained"
							startIcon={<RefreshIcon />}
							onClick={fetchCourts}
							size="small"
							sx={{ whiteSpace: "nowrap", minWidth: 120 }}
						>
							Làm mới
						</Button>

						<Button
							variant="contained"
							color="success"
							startIcon={<AddIcon />}
							onClick={() => setOpenAddCourtModal(true)}
							size="small"
							disabled={!managerContext.branchId}
							sx={{ whiteSpace: "nowrap", minWidth: 140 }}
						>
							Thêm sân
						</Button>
					</Stack>
				</Stack>
			</Box>

			{/* === CONTENT === */}
			{loading ? (
				<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
					{[...Array(6)].map((_, i) => (
						<Skeleton key={i} variant="rectangular" height={240} sx={{ borderRadius: 3 }} />
					))}
				</Box>
			) : error ? (
				<Alert severity="error" sx={{ borderRadius: 2 }}>
					{error}
				</Alert>
			) : filteredCourts.length === 0 ? (
				<Alert severity="info" icon={<SportsTennis />} sx={{ borderRadius: 2 }}>
					Không tìm thấy sân nào phù hợp với bộ lọc.
				</Alert>
			) : (
				<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
					{filteredCourts.map((court) => (
						<Box
							key={court.id}
							sx={{
								transition: "all 0.3s ease",
								"&:hover": { transform: "translateY(-4px)" },
							}}
						>
							<CourtCard
								court={court}
								isExpanded={expandedCourtId === court.id}
								toggleCourt={() => toggleCourt(court.id)}
								slots={slots[court.id] || []}
								onStatusUpdate={fetchCourts}
							/>
						</Box>
					))}
				</Box>
			)}

			<AddCourtModal
				open={openAddCourtModal}
				onClose={() => setOpenAddCourtModal(false)}
				branchId={managerContext.branchId}
				managerAccountId={managerContext.accountId}
				onSubmit={handleAddCourtSubmit}
				existedCourt={courts.map((court) => court.ordinalNumber)}
			/>
		</Container>
	);
};

export default Courts;
