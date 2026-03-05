import React from "react";
import {
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Chip,
	Stack,
	TextField,
	Button,
	Tooltip,
	IconButton,
	Select,
	MenuItem,
	Box,
	Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const formatTime = (num) => (num == null ? "--:--" : `${Math.floor(num).toString().padStart(2, "0")}:00`);

const PriceRow = ({
	price,
	editingPriceId,
	editedPrice,
	setEditedPrice,
	handleEditClick,
	handleSaveClick,
	handleDeleteClick,
}) => {
	return (
		<TableRow hover>
			<TableCell>
				{editingPriceId === price.id ? (
					<Stack direction="row" spacing={1}>
						<TextField
							size="small"
							type="number"
							value={editedPrice.startTime}
							onChange={(e) => setEditedPrice({ ...editedPrice, startTime: +e.target.value })}
							inputProps={{ min: 0, max: 23 }}
							sx={{ width: 60 }}
						/>
						<Typography sx={{ alignSelf: "center" }}>→</Typography>
						<TextField
							size="small"
							type="number"
							value={editedPrice.endTime}
							onChange={(e) => setEditedPrice({ ...editedPrice, endTime: +e.target.value })}
							inputProps={{ min: 0, max: 23 }}
							sx={{ width: 60 }}
						/>
					</Stack>
				) : (
					`${formatTime(price.startTime)} - ${formatTime(price.endTime)}`
				)}
			</TableCell>

			<TableCell>
				{editingPriceId === price.id ? (
					<Select
						size="small"
						value={editedPrice.dayOfWeek}
						onChange={(e) => setEditedPrice({ ...editedPrice, dayOfWeek: e.target.value })}
						sx={{ minWidth: 110 }}
					>
						<MenuItem value="Trong tuần">Trong tuần</MenuItem>
						<MenuItem value="Cuối tuần">Cuối tuần</MenuItem>
					</Select>
				) : (
					<Chip
						label={price.dayOfWeek || "Trong tuần"}
						size="small"
						color={price.dayOfWeek === "Cuối tuần" ? "warning" : "default"}
					/>
				)}
			</TableCell>

			<TableCell>
				{editingPriceId === price.id ? (
					<Stack direction="row" spacing={1} alignItems="center">
						<TextField
							size="small"
							type="number"
							value={editedPrice.pricePerHour}
							onChange={(e) => setEditedPrice({ ...editedPrice, pricePerHour: +e.target.value })}
							inputProps={{ min: 0 }}
							sx={{ width: 100 }}
						/>
						<Button
							variant="contained"
							size="small"
							onClick={() => handleSaveClick(price.id)}
							sx={{ bgcolor: "success.main", "&:hover": { bgcolor: "success.dark" } }}
						>
							Lưu
						</Button>
						<Button size="small" onClick={() => setEditedPrice(null)} sx={{ color: "error.main" }}>
							Hủy
						</Button>
					</Stack>
				) : (
					<Typography fontWeight="medium" color="#1a3c34">
						{price.pricePerHour?.toLocaleString()} VND
					</Typography>
				)}
			</TableCell>

			<TableCell>
				{editingPriceId !== price.id && (
					<Stack direction="row" spacing={0.5}>
						<Tooltip title="Sửa">
							<IconButton size="small" onClick={() => handleEditClick(price)}>
								<Edit sx={{ fontSize: 18, color: "#1976d2" }} />
							</IconButton>
						</Tooltip>
						<Tooltip title="Xóa">
							<IconButton size="small" onClick={() => handleDeleteClick(price.id)}>
								<Delete sx={{ fontSize: 18, color: "#d32f2f" }} />
							</IconButton>
						</Tooltip>
					</Stack>
				)}
			</TableCell>
		</TableRow>
	);
};

const PriceTable = ({
	prices,
	type, // "fixedPrices" | "casualPrices"
	title,
	color,
	editingPriceId,
	editedPrice,
	setEditedPrice,
	handleEditClick,
	handleSaveClick,
	handleDeleteClick,
	loading,
}) => {
	const data = prices[type] || [];

	return (
		<Box>
			<Typography variant="subtitle1" fontWeight="bold" color={`${color}.main`} gutterBottom>
				{title}
			</Typography>
			<Box sx={{ overflowX: "auto", bgcolor: type === "fixedPrices" ? "#f9fafb" : "#fff8e1", borderRadius: 2, p: 1 }}>
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell>Giờ</TableCell>
							<TableCell>Loại ngày</TableCell>
							<TableCell>Giá/giờ</TableCell>
							<TableCell>Hành động</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={4}>
									<Typography color="text.secondary" fontStyle="italic">Đang tải...</Typography>
								</TableCell>
							</TableRow>
						) : data.length === 0 ? (
							<TableRow>
								<TableCell colSpan={4} align="center" sx={{ color: "text.secondary", fontStyle: "italic" }}>
									Chưa có giá {type === "fixedPrices" ? "cố định" : "vãng lai"}
								</TableCell>
							</TableRow>
						) : (
							data.map((price) => (
								<PriceRow
									key={price.id}
									price={price}
									editingPriceId={editingPriceId}
									editedPrice={editedPrice}
									setEditedPrice={setEditedPrice}
									handleEditClick={handleEditClick}
									handleSaveClick={handleSaveClick}
									handleDeleteClick={handleDeleteClick}
								/>
							))
						)}
					</TableBody>
				</Table>
			</Box>
		</Box>
	);
};

export default PriceTable;