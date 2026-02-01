import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
	Container,
	Typography,
	Grid,
	CircularProgress,
	Alert,
	Box,
	Button,
	TextField,
	Card,
	CardContent,
	Divider,
	Snackbar,
	Tooltip,
	InputAdornment,
	Skeleton,
	useTheme,
	Stack,
} from "@mui/material";
import {
	Email,
	LocationOn,
	Description,
	Business,
	Save,
	Cancel,
	Edit,
	AccountBalance,
	CreditCard,
} from "@mui/icons-material";
import { MenuItem } from "@mui/material";
import branchService from "../../../services/branchServce";
import authService from "../../../services/authService";

const BranchInfo = () => {
	const theme = useTheme();
	const [branch, setBranch] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [updatedBranch, setUpdatedBranch] = useState({
		email: "",
		address: "",
		description: "",
		branchName: "",
		bankName: "",
		bankNumber: "",
	});
	const [errors, setErrors] = useState({
		email: "",
		address: "",
		branchName: "",
		bankName: "",
		bankNumber: "",
	});

	const token = localStorage.getItem("authToken");

	// === DANH SÁCH NGÂN HÀNG ===
	const bankList = [
		"Vietcombank - Ngân hàng Ngoại thương Việt Nam",
		"VietinBank - Ngân hàng Công thương Việt Nam",
		"BIDV - Ngân hàng Đầu tư và Phát triển Việt Nam",
		"Agribank - Ngân hàng Nông nghiệp và Phát triển Nông thôn",
		"Techcombank - Ngân hàng Kỹ thương Việt Nam",
		"MB Bank - Ngân hàng Quân đội",
		"VPBank - Ngân hàng Việt Nam Thịnh vượng",
		"ACB - Ngân hàng Á Châu",
		"Sacombank - Ngân hàng Sài Gòn Thương tín",
		"SHB - Ngân hàng Sài Gòn - Hà Nội",
		"TPBank - Ngân hàng Tiên Phong",
		"VIB - Ngân hàng Quốc tế",
		"HDBank - Ngân hàng Phát triển TP.HCM",
		"MSB - Ngân hàng Hàng Hải",
		"OCB - Ngân hàng Phương Đông",
		"SeABank - Ngân hàng Đông Nam Á",
		"LienVietPostBank - Ngân hàng Bưu điện Liên Việt",
		"VietCapital Bank - Ngân hàng Bản Việt",
		"BacABank - Ngân hàng Bắc Á",
		"NCB - Ngân hàng Quốc dân",
		"PVcomBank - Ngân hàng Đại Chúng",
		"VietBank - Ngân hàng Việt Nam Thương tín",
		"BVBank - Ngân hàng Bảo Việt",
		"ABBank - Ngân hàng An Bình",
		"Nam A Bank - Ngân hàng Nam Á",
		"SCB - Ngân hàng Sài Gòn",
		"Eximbank - Ngân hàng Xuất Nhập khẩu",
		"KienLongBank - Ngân hàng Kiên Long",
		"Public Bank - Ngân hàng TNHH MTV Public Việt Nam",
		"Woori Bank - Ngân hàng Woori Việt Nam",
		"Shinhan Bank - Ngân hàng Shinhan Việt Nam",
		"Standard Chartered - Ngân hàng Standard Chartered Việt Nam",
		"HSBC - Ngân hàng HSBC Việt Nam",
		"Citibank - Ngân hàng Citibank Việt Nam",
	];

	// === TÍNH TOÁN MÀU THEO THEME ===
	const labelColor = theme.palette.mode === "dark" ? "grey.300" : "grey.800";
	const badgeBg = theme.palette.mode === "dark" ? "grey.700" : "grey.100";

	// === FETCH BRANCH ===
	useEffect(() => {
		const fetchBranch = async () => {
			if (!token) {
				setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
				setLoading(false);
				return;
			}

			try {
				const account = await authService.getCurrentAccount(token);
				const branchData = await branchService.getBranchByAccountId(account.id, token);
				setBranch(branchData);
				setUpdatedBranch({
					email: branchData.email || "",
					address: branchData.address || "",
					description: branchData.description || "",
					branchName: branchData.branchName || "",
					bankName: branchData.bankName || "",
					bankNumber: branchData.bankNumber || "",
				});
			} catch (err) {
				setError(err.message || "Không thể tải thông tin chi nhánh.");
			} finally {
				setLoading(false);
			}
		};

		fetchBranch();
	}, [token]);

	// === VALIDATION REAL-TIME ===
	const validateField = useCallback((name, value) => {
		let error = "";
		if (name === "branchName" && !value.trim()) error = "Tên chi nhánh không được để trống";
		if (name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
			error = "Email không hợp lệ";
		if (name === "address" && !value.trim()) error = "Địa chỉ không được để trống";
		if (name === "bankNumber" && value && !/^\d+$/.test(value))
			error = "Số tài khoản chỉ được chứa số";
		return error;
	}, []);

	const handleChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setUpdatedBranch((prev) => ({ ...prev, [name]: value }));
			const error = validateField(name, value);
			setErrors((prev) => ({ ...prev, [name]: error }));
		},
		[validateField]
	);

	const validateAll = useCallback(() => {
		const fields = ["branchName", "email", "address", "bankName", "bankNumber"];
		const newErrors = {};
		let valid = true;

		fields.forEach((field) => {
			const error = validateField(field, updatedBranch[field]);
			newErrors[field] = error;
			if (error) valid = false;
		});

		setErrors(newErrors);
		return valid;
	}, [updatedBranch, validateField]);

	// === SAVE ===
	const handleSave = useCallback(async () => {
		if (!validateAll()) {
			setError("Vui lòng sửa các trường lỗi.");
			return;
		}

		setSaving(true);
		try {
			await branchService.updateBranch(branch.id, updatedBranch, token);
			setBranch((prev) => ({ ...prev, ...updatedBranch }));
			setEditMode(false);
			setSuccess("Cập nhật thành công!");
			setTimeout(() => setSuccess(null), 3000);
		} catch (err) {
			setError(err.message || "Cập nhật thất bại.");
		} finally {
			setSaving(false);
		}
	}, [branch?.id, updatedBranch, token, validateAll]);

	// === CANCEL ===
	const handleCancel = useCallback(() => {
		setEditMode(false);
		setErrors({ email: "", address: "", branchName: "", bankName: "", bankNumber: "" });
		setUpdatedBranch({
			email: branch?.email || "",
			address: branch?.address || "",
			description: branch?.description || "",
			branchName: branch?.branchName || "",
			bankName: branch?.bankName || "",
			bankNumber: branch?.bankNumber || "",
		});
	}, [branch]);

	// === LOADING SKELETON ===
	const LoadingSkeleton = () => (
		<Grid container spacing={3}>
			{[...Array(8)].map((_, i) => (
				<Grid size={{ xs: 12, sm: i % 2 === 0 ? 4 : 8 }} key={i}>
					<Skeleton variant="text" width={i % 2 === 0 ? "60%" : "80%"} height={28} />
					{i % 2 === 1 && <Skeleton variant="text" width="100%" height={56} sx={{ mt: 1 }} />}
				</Grid>
			))}
		</Grid>
	);

	// === RENDER ===
	if (loading) {
		return (
			<Container maxWidth="md" sx={{ mt: 6 }}>
				<Card sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
					<Skeleton variant="text" width="50%" height={48} sx={{ mx: "auto", mb: 3 }} />
					<Divider sx={{ mb: 3 }} />
					<LoadingSkeleton />
				</Card>
			</Container>
		);
	}

	if (error && !editMode) {
		return (
			<Container maxWidth="md" sx={{ mt: 6 }}>
				<Alert severity="error" sx={{ borderRadius: 2, boxShadow: 2 }}>
					{error}
				</Alert>
			</Container>
		);
	}

	return (
		<Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
			{/* SNACKBAR */}
			<Snackbar
				open={!!success || !!error}
				autoHideDuration={3000}
				onClose={() => {
					setSuccess(null);
					setError(null);
				}}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
			>
				<Alert
					severity={success ? "success" : "error"}
					onClose={() => {
						setSuccess(null);
						setError(null);
					}}
					sx={{
						borderRadius: 2,
						minWidth: 320,
						boxShadow: 3,
						fontWeight: 500,
					}}
				>
					{success || error}
				</Alert>
			</Snackbar>

			{/* CARD CHÍNH */}
			<Card
				sx={{
					borderRadius: 3,
					boxShadow: 4,
					overflow: "hidden",
					transition: "all 0.3s ease",
					"&:hover": {
						boxShadow: 6,
						transform: "translateY(-2px)",
					},
				}}
			>
				<CardContent sx={{ p: { xs: 3, md: 5 } }}>
					<Typography
						variant="h5"
						align="center"
						color="primary"
						sx={{ mb: 3, fontWeight: 700, fontSize: "1.6rem" }}
					>
						Thông Tin Chi Nhánh
					</Typography>
					<Divider sx={{ mb: 4, bgcolor: "divider" }} />

					<Grid container spacing={3}>
						{/* MÃ CHI NHÁNH */}
						<Grid size={{ xs: 12, sm: 4 }}>
							<Typography variant="subtitle1" fontWeight="bold" color={labelColor}>
								Mã chi nhánh:
							</Typography>
						</Grid>
						<Grid size={{ xs: 12, sm: 8 }}>
							<Typography variant="body1" color="text.primary">
								{branch.id}
							</Typography>
						</Grid>

						{/* TÊN CHI NHÁNH */}
						<Grid size={{ xs: 12, sm: 4 }}>
							<Typography variant="subtitle1" fontWeight="bold" color={labelColor}>
								Tên chi nhánh:
							</Typography>
						</Grid>
						<Grid size={{ xs: 12, sm: 8 }}>
							{editMode ? (
								<TextField
									fullWidth
									variant="outlined"
									name="branchName"
									value={updatedBranch.branchName}
									onChange={handleChange}
									error={!!errors.branchName}
									helperText={errors.branchName}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Business color="primary" />
											</InputAdornment>
										),
									}}
									sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
								/>
							) : (
								<Typography variant="body1" color="text.primary">
									{branch.branchName || "Chưa có tên"}
								</Typography>
							)}
						</Grid>

						{/* TÊN NGÂN HÀNG */}
						<Grid size={{ xs: 12, sm: 4 }}>
							<Typography variant="subtitle1" fontWeight="bold" color={labelColor}>
								Ngân hàng:
							</Typography>
						</Grid>
						<Grid size={{ xs: 12, sm: 8 }}>
							{editMode ? (
								<TextField
									select
									fullWidth
									variant="outlined"
									name="bankName"
									value={updatedBranch.bankName}
									onChange={handleChange}
									error={!!errors.bankName}
									helperText={errors.bankName}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<AccountBalance color="primary" />
											</InputAdornment>
										),
									}}
									sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
								>
									<MenuItem value="">
										<em>-- Chọn ngân hàng --</em>
									</MenuItem>
									{bankList.map((bank, index) => (
										<MenuItem key={index} value={bank}>
											{bank}
										</MenuItem>
									))}
								</TextField>
							) : (
								<Typography variant="body1" color="text.primary">
									{branch.bankName || "Chưa có thông tin"}
								</Typography>
							)}
						</Grid>

						{/* SỐ TÀI KHOẢN */}
						<Grid size={{ xs: 12, sm: 4 }}>
							<Typography variant="subtitle1" fontWeight="bold" color={labelColor}>
								Số tài khoản:
							</Typography>
						</Grid>
						<Grid size={{ xs: 12, sm: 8 }}>
							{editMode ? (
								<TextField
									fullWidth
									variant="outlined"
									name="bankNumber"
									value={updatedBranch.bankNumber}
									onChange={handleChange}
									error={!!errors.bankNumber}
									helperText={errors.bankNumber}
									placeholder="Nhập số tài khoản ngân hàng"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<CreditCard color="primary" />
											</InputAdornment>
										),
									}}
									sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
								/>
							) : (
								<Typography variant="body1" color="text.primary">
									{branch.bankNumber || "Chưa có thông tin"}
								</Typography>
							)}
						</Grid>

						{/* EMAIL */}
						<Grid size={{ xs: 12, sm: 4 }}>
							<Typography variant="subtitle1" fontWeight="bold" color={labelColor}>
								Email:
							</Typography>
						</Grid>
						<Grid size={{ xs: 12, sm: 8 }}>
							{editMode ? (
								<TextField
									fullWidth
									variant="outlined"
									name="email"
									value={updatedBranch.email}
									onChange={handleChange}
									error={!!errors.email}
									helperText={errors.email}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Email color="primary" />
											</InputAdornment>
										),
									}}
									sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
								/>
							) : (
								<Typography variant="body1" color="text.primary">
									{branch.email || "Chưa có email"}
								</Typography>
							)}
						</Grid>

						{/* ĐỊA CHỈ */}
						<Grid size={{ xs: 12, sm: 4 }}>
							<Typography variant="subtitle1" fontWeight="bold" color={labelColor}>
								Địa chỉ:
							</Typography>
						</Grid>
						<Grid size={{ xs: 12, sm: 8 }}>
							{editMode ? (
								<TextField
									fullWidth
									variant="outlined"
									name="address"
									value={updatedBranch.address}
									onChange={handleChange}
									error={!!errors.address}
									helperText={errors.address}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<LocationOn color="primary" />
											</InputAdornment>
										),
									}}
									sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
								/>
							) : (
								<Typography variant="body1" color="text.primary">
									{branch.address || "Chưa có địa chỉ"}
								</Typography>
							)}
						</Grid>

						{/* MÔ TẢ */}
						<Grid size={{ xs: 12, sm: 4 }}>
							<Typography variant="subtitle1" fontWeight="bold" color={labelColor}>
								Mô tả:
							</Typography>
						</Grid>
						<Grid size={{ xs: 12, sm: 8 }}>
							{editMode ? (
								<TextField
									fullWidth
									multiline
									minRows={3}
									variant="outlined"
									name="description"
									value={updatedBranch.description}
									onChange={handleChange}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1 }}>
												<Description color="primary" />
											</InputAdornment>
										),
									}}
									sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
								/>
							) : (
								<Typography
									variant="body1"
									color="text.primary"
									sx={{ whiteSpace: "pre-line" }}
								>
									{branch.description || "Chưa có mô tả"}
								</Typography>
							)}
						</Grid>

						{/* TRẠNG THÁI */}
						<Grid size={{ xs: 12, sm: 4 }}>
							<Typography variant="subtitle1" fontWeight="bold" color={labelColor}>
								Trạng thái:
							</Typography>
						</Grid>
						<Grid size={{ xs: 12, sm: 8 }}>
							<Box
								sx={{
									bgcolor: branch.cooperated ? "success.light" : "error.light",
									color: branch.cooperated ? "success.main" : "error.main",
									fontWeight: 600,
									px: 2,
									py: 0.8,
									borderRadius: 2,
									display: "inline-block",
									fontSize: "0.95rem",
								}}
							>
								{branch.cooperated ? "Đang hợp tác" : "Ngưng hợp tác"}
							</Box>
						</Grid>
					</Grid>

					{/* NÚT HÀNH ĐỘNG */}
					<Stack direction="row" justifyContent="center" spacing={2} mt={5}>
						{editMode ? (
							<>
								<Button
									variant="contained"
									onClick={handleSave}
									startIcon={saving ? <CircularProgress size={20} /> : <Save />}
									disabled={saving}
									sx={{
										minWidth: 120,
										borderRadius: 2,
										fontWeight: 600,
										bgcolor: "primary.main",
										"&:hover": {
											bgcolor: "primary.dark",
											transform: "translateY(-1px)",
										},
									}}
								>
									{saving ? "Đang lưu..." : "Lưu"}
								</Button>
								<Button
									variant="outlined"
									onClick={handleCancel}
									startIcon={<Cancel />}
									sx={{
										minWidth: 120,
										borderRadius: 2,
										fontWeight: 600,
										borderColor: "grey.400",
										color: "text.primary",
										"&:hover": {
											borderColor: "grey.600",
											bgcolor: "action.hover",
										},
									}}
								>
									Hủy
								</Button>
							</>
						) : (
							<Button
								variant="contained"
								onClick={() => setEditMode(true)}
								startIcon={<Edit />}
								sx={{
									minWidth: 180,
									borderRadius: 2,
									fontWeight: 600,
									bgcolor: "primary.main",
									"&:hover": {
										bgcolor: "primary.dark",
										transform: "translateY(-1px)",
										boxShadow: 3,
									},
								}}
							>
								Chỉnh sửa
							</Button>
						)}
					</Stack>
				</CardContent>
			</Card>
		</Container>
	);
};

export default BranchInfo;