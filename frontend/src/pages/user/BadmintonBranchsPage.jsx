import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { motion } from "framer-motion";

import {
	Box,
	Container,
	Typography,
	Grid,
	Card,
	CardContent,
	CardMedia,
	Button,
	TextField,
	InputAdornment,
	Chip,
	Stack,
	Paper,
	Divider,
	Rating,
	Tab,
	Tabs,
} from '@mui/material';
import { Search, LocationOn, ArrowForward, AccessTime } from '@mui/icons-material';

import { formatVND } from '../../utils/format';

import UserLayout from '../../layouts/user/UserLayout';

import theme from '../../theme/Theme';

import branchService from '../../services/branchServce';
import reviewService from '../../services/reviewService';
import badmintionCourtService from '../../services/badmintonCourtService';
import { resolveBackendUrl } from '../../services/api';


const filterCategories = [
	{ id: 'all', label: 'Tất cả' },
	{ id: 'popular', label: 'Phổ biến' },
	{ id: 'nearby', label: 'Gần đây' },
	{ id: 'highRated', label: 'Đánh giá cao' },
	// { id: 'promotion', label: 'Ưu đãi' },
];

const BadmintonBranchsPage = () => {
	const navigate = useNavigate();

	const [allBranchs, setAllBranchs] = useState([]);
	const [branchsData, setBranchsData] = useState([{ branch: {}, price: [], review: [], courts: [] }]);
	const [branchsTransformedData, setBranchsTransformedData] = useState([]);

	const [searchTerm, setSearchTerm] = useState('');
	const [locationFilter, setLocationFilter] = useState('');
	const [filteredBranchs, setfilteredBranchs] = useState(branchsTransformedData);
	const [filterTab, setFilterTab] = useState('all');

	useEffect(() => {
		const fetchAllBranches = async () => {

			const currentHour = new Date().getHours();

			try {
				const branches = await branchService.getAllBranches('true');
				setAllBranchs(branches);

				const branchDataPromises = branches.map(async (branch) => {
					const [branchPrices, branchReviews, branchCourts] = await Promise.all([
						branchService.getAllPricesOfBranch(branch.id),
						reviewService.getAllReviewsOfBranch(branch.id),
						badmintionCourtService.getAllCourtsOfBranchByStatus(branch.id, 'true'),
					]);

					return {
						branch,
						prices: branchPrices,
						reviews: branchReviews,
						courts: branchCourts,
					};
				});

				const resolvedBranchData = await Promise.all(branchDataPromises);
				setBranchsData(resolvedBranchData);

				const isBranchOpen = (prices) => {
					const currentHour = new Date().getHours();

					if (!prices || prices.length === 0) {
						return currentHour >= 7 && currentHour < 22;
					}

					const minStartTime = Math.min(...prices.map(price => price.startTime || 7));
					const maxEndTime = Math.max(...prices.map(price => price.endTime || 22));

					return currentHour >= minStartTime && currentHour < maxEndTime;
				};


				const transformedData = resolvedBranchData.map(({ branch, prices, reviews, courts }) => ({
					id: branch.id,
					name: branch.branchName,
					location: branch.address || '',
					price: prices.length > 0
						? `${formatVND(Math.min(...prices.map(p => p.pricePerHour)))} - ${formatVND(Math.max(...prices.map(p => p.pricePerHour)))} / giờ`
						: '',
					rating: reviews.length > 0
						? +(reviews.reduce((sum, { ratingLevel }) => sum + ratingLevel, 0) / reviews.length).toFixed(1)
						: 0,
					reviews: reviews.length,
					image: branch.imagePath || '',
					available: courts?.some(({ available }) => available) || false,
					distance: 0,
					promoted: branch.promoted || false,
					open: isBranchOpen(prices)

				}));

				setBranchsTransformedData(transformedData);
			} catch (error) {
				console.error("Error fetching branch data:", error);
			}
		};

		fetchAllBranches();
	}, []);

	useEffect(() => {
		const filterBranches = () => {
			let results = branchsTransformedData.filter(
				({ name, location }) =>
					name.toLowerCase().includes(searchTerm.toLowerCase()) &&
					(locationFilter === '' || location.includes(locationFilter))
			);

			switch (filterTab) {
				case 'popular':
					results.sort((a, b) => b.reviews - a.reviews);
					break;
				case 'nearby':
					results.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
					break;
				case 'highRated':
					results.sort((a, b) => b.rating - a.rating);
					break;
				// case 'promotion':
				//     results = results.filter(({ promoted }) => promoted);
				//     break;
				default:
					break;
			}

			setfilteredBranchs(results);
		};

		filterBranches();
	}, [searchTerm, locationFilter, filterTab, branchsTransformedData]);

	// console.log('original: ', branchsData);

	return (
		<UserLayout>

			<Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					<Box
						sx={{
							position: 'relative',
							color: 'primary.contrastText',
							py: { xs: 8, md: 12 },
							overflow: 'hidden',
							background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
						}}
					>
						<Box sx={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							opacity: 0.1,
							background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="1" fill-rule="evenodd"/%3E%3C/svg%3E")',
						}} />

						<Container maxWidth="lg">
							<Typography
								variant="h3"
								component="h1"
								sx={{
									fontWeight: 800,
									mb: 2,
									fontSize: { xs: '2.2rem', sm: '2.5rem', md: '3.2rem' },
									textAlign: 'center',
									textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
								}}
							>
								Tìm Sân Cầu Lông Hoàn Hảo
							</Typography>
							<Typography
								variant="h6"
								sx={{
									fontSize: 17,
									mb: 5,
									fontWeight: 400,
									maxWidth: '700px',
									mx: 'auto',
									textAlign: 'center',
									opacity: 0.9,
								}}
							>
								Khám phá và đặt sân cầu lông tốt nhất tại TP.HCM chỉ trong vài bước đơn giản
							</Typography>

							<Paper
								elevation={0}
								sx={{
									p: { xs: 2, md: 3 },
									borderRadius: theme.shape.borderRadius * 2,
									maxWidth: '900px',
									mx: 'auto',
									// Dùng màu nền tương phản tự động theo mode
									bgcolor: 'background.paper',
									color: 'text.primary',
									backdropFilter: 'blur(20px)',
									// Thêm lớp overlay nhẹ để luôn đọc được ở cả 2 mode
									background: theme.palette.mode === 'dark'
										? 'rgba(151, 54, 54, 0.08)'
										: 'rgba(255, 255, 255, 0.85)',
									border: '1px solid',
									borderColor: theme.palette.mode === 'dark'
										? 'rgba(255, 255, 255, 0.12)'
										: 'rgba(0, 0, 0, 0.08)',
									boxShadow: theme.palette.mode === 'dark'
										? '0 8px 32px rgba(0, 0, 0, 0.4)'
										: '0 8px 32px rgba(31, 38, 135, 0.15)',
								}}
							>
								<Grid container spacing={2} alignItems="center">
									<Grid size={{ xs: 12, md: 5 }}>
										<TextField
											fullWidth
											placeholder="Tìm sân cầu lông..."
											variant="outlined"
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<Search sx={{ color: 'text.secondary' }} />
													</InputAdornment>
												),
											}}
											sx={{
												'& .MuiOutlinedInput-root': {
													bgcolor: theme.palette.mode === 'dark'
														? 'rgba(255, 255, 255, 0.08)'
														: 'white',
													borderRadius: '12px',
													'& fieldset': { borderColor: 'transparent' },
													'&:hover fieldset': { borderColor: 'primary.main' },
												},
												'& .MuiInputBase-input': {
													color: 'text.primary',
												},
												'& .MuiInputBase-input::placeholder': {
													color: theme.palette.mode === 'dark'
														? 'rgba(255, 255, 255, 0.7) !important'
														: 'rgba(0, 0, 0, 0.6) !important',
													opacity: 1,
													fontWeight: 500,
												},
												'& .MuiSvgIcon-root': {
													color: theme.palette.mode === 'dark'
														? 'rgba(255, 255, 255, 0.8)'
														: 'rgba(0, 0, 0, 0.6)',
												},
											}}
										/>
									</Grid>

									<Grid size={{ xs: 12, md: 3 }}>
										<TextField
											fullWidth
											placeholder="Địa điểm"
											variant="outlined"
											value={locationFilter}
											onChange={(e) => setLocationFilter(e.target.value)}
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<LocationOn sx={{ color: 'text.secondary' }} />
													</InputAdornment>
												),
											}}
											sx={{
												'& .MuiOutlinedInput-root': {
													bgcolor: theme.palette.mode === 'dark'
														? 'rgba(255, 255, 255, 0.08)'
														: 'white',
													borderRadius: '12px',
													'& fieldset': { borderColor: 'transparent' },
													'&:hover fieldset': { borderColor: 'primary.main' },
												},
												'& .MuiInputBase-input': {
													color: 'text.primary',
												},
												'& .MuiInputBase-input::placeholder': {
													color: theme.palette.mode === 'dark'
														? 'rgba(255, 255, 255, 0.7) !important'
														: 'rgba(0, 0, 0, 0.6) !important',
													opacity: 1,
													fontWeight: 500,
												},
												'& .MuiSvgIcon-root': {
													color: theme.palette.mode === 'dark'
														? 'rgba(255, 255, 255, 0.8)'
														: 'rgba(0, 0, 0, 0.6)',
												},
											}}
										/>
									</Grid>

									<Grid size={{ xs: 12, md: 4 }}>
										<Button
											fullWidth
											variant="contained"
											size="large"
											endIcon={<ArrowForward />}
											sx={{
												height: '56px',
												borderRadius: theme.shape.borderRadius * 2,
												textTransform: 'none',
												fontWeight: 700,
												fontSize: '1.05rem',
												bgcolor: 'primary.main',
												color: 'primary.contrastText',
												boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
												'&:hover': {
													bgcolor: 'primary.dark',
													boxShadow: '0 6px 24px rgba(59, 130, 246, 0.5)', // sửa ở đây
												},
											}}
										>
											Tìm kiếm ngay
										</Button>
									</Grid>
								</Grid>
							</Paper>
						</Container>
					</Box>
				</motion.div>

				<Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
					<Box sx={{ mb: 4 }}>
						<Tabs
							value={filterTab}
							onChange={(e, newValue) => setFilterTab(newValue)}
							variant="scrollable"
							scrollButtons="auto"
							sx={{
								mb: 3,
								'& .MuiTabs-indicator': {
									backgroundColor: theme.palette.primary.main,
								},
							}}
						>
							{filterCategories.map((category) => (
								<Tab
									key={category.id}
									value={category.id}
									label={category.label}
									sx={{
										textTransform: 'none',
										fontWeight: 600,
										fontSize: '0.95rem',
										minWidth: 80,
										'&.Mui-selected': {
											color: theme.palette.primary.main,
										},
									}}
								/>
							))}
						</Tabs>
					</Box>

					<Grid container spacing={3}>
						{filteredBranchs.map((branch, index) => (
							<Grid size={{ xs: 12, sm: 6, md: 4 }} key={branch.id}>
								<motion.div
									initial={{ opacity: 0, x: 30 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.5, delay: index * 0.3 }}
									style={{ height: '100%' }}
								>
									<Card
										sx={{
											height: '100%',
											display: 'flex',
											flexDirection: 'column',
											borderRadius: '12px',
											bgcolor: 'background.paper',
											overflow: 'hidden',
											boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
											transition: 'transform 0.3s, box-shadow 0.3s',
											'&:hover': {
												transform: 'translateY(-8px)',
												boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
											},
										}}
									>
										<Box sx={{
											position: 'relative',
											width: '100%',
											overflow: 'hidden'

										}}>
											<CardMedia
												component="img"
												height="180"
												image={branch.image ? resolveBackendUrl(branch.image) : '/images/default/branch-default-image.jpg'}
												alt={branch.name}
												sx={{
													height: 180,
													width: '100%',
													objectPosition: 'center',
													objectFit: 'cover',
												}}
											/>
										</Box>
										<CardContent sx={{ flexGrow: 1, p: 3 }}>
											<Typography
												variant="h6"
												component="h2"
												sx={{ fontWeight: 700, mb: 1, fontSize: '1.1rem' }}
											>
												{branch.name}
											</Typography>
											<Stack
												direction="row"
												alignItems="center"
												spacing={0.8}
												sx={{ mb: 1 }}
											>
												<LocationOn
													color="primary"
													fontSize="small"
													sx={{ fontSize: '1rem' }}
												/>
												<Typography variant="body2" color="text.secondary">
													{branch.location} • <strong>{branch.distance} Km</strong>
												</Typography>
											</Stack>
											<Stack
												direction="row"
												alignItems="center"
												justifyContent="space-between"
												sx={{ mb: 2 }}
											>
												<Stack direction="row" alignItems="center" spacing={0.5}>
													<Rating
														value={branch.rating}
														precision={0.1}
														size="small"
														readOnly
														sx={{
															'& .MuiRating-iconFilled': {
																color: '#f59e0b',
															},
														}}
													/>
													<Typography
														variant="body2"
														sx={{ fontWeight: 600 }}
													>
														{branch.rating}
													</Typography>
													<Typography
														variant="body2"
														component="span"
														color="text.secondary"
													>
														({branch.reviews})
													</Typography>
												</Stack>
												<Chip
													label={
														<Box sx={{ display: 'flex', alignItems: 'center' }}>
															<AccessTime fontSize="small" sx={{ mr: 0.5, fontSize: '0.9rem', verticalAlign: 'text-top', color: '#3a3a3a' }} />
															<Typography variant="body2" sx={{ fontWeight: 600, fontSize: 12, color: '#3a3a3a' }}>
																{branch.open ? 'Mở cửa' : 'Đóng cửa'}
															</Typography>
														</Box>
													}
													size="small"
													sx={{
														bgcolor: branch.open ? 'rgb(129, 199, 132)' : 'rgb(255, 130, 130)',
														color: 'white',
														borderRadius: '16px',
														'& .MuiChip-label': { px: 1 },
													}}
												/>
											</Stack>
											<Divider sx={{ my: 1.5 }} />
											<Typography
												variant="body1"
												sx={{
													fontWeight: 700,
													color: theme.palette.primary.main,
													mb: 2,
													fontSize: '1.1rem',
												}}
											>
												{branch.price}
											</Typography>
										</CardContent>
										<Box sx={{ p: 3, pt: 0 }}>
											<Stack direction={'row'} gap={2}>
												<Button
													fullWidth
													variant="contained"
													color="primary"
													disabled={!branch.available}
													onClick={() => navigate(`/branch-detail/${branch.id}`, {
														state: {
															tabIndex: 5
														}
													})}
													sx={{
														borderRadius: '10px',
														textTransform: 'none',
														fontWeight: 600,
														py: 1.2,
														background: branch.available
															? `linear-gradient(135deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`
															: undefined,
														boxShadow: branch.available ? '0 4px 12px rgba(59, 130, 246, 0.25)' : 'none',
														'&:hover': {
															boxShadow: branch.available ? '0 6px 16px rgba(59, 130, 246, 0.4)' : 'none',
														},
													}}
												>
													{branch.available ? 'Đặt sân ngay' : 'Đã kín'}
												</Button>

												<Button
													fullWidth
													variant="outlined"
													color="primary"
													sx={{
														borderRadius: '10px',
														textTransform: 'none',
														fontWeight: 600,
														py: 1.2,
														borderColor: theme.palette.primary.main,
														'&:hover': {
															borderColor: theme.palette.primary.dark,
															backgroundColor: 'rgba(59, 130, 246, 0.04)',
														},
													}}
													onClick={() => navigate(`/branch-detail/${branch.id}`)}
												>
													Xem chi tiết
												</Button>
											</Stack>
										</Box>
									</Card>
								</motion.div>
							</Grid>
						))}
					</Grid>
				</Container>
			</Box>

		</UserLayout>
	);
};

export default BadmintonBranchsPage;
