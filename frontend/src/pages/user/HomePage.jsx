import React from 'react';
import { useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';
import {
	Box,
	Container,
	Typography,
	Grid,
	Button,
	Paper,
	Avatar,
	Card,
	CardContent,
	Stack,
	useMediaQuery
} from '@mui/material';
import {
	Search,
	CalendarToday,
	Star,
	LocationOn,
	Timer,
	AccessTime,
	SportsTennis,
	EmojiEvents,
	Group,
	Shield
} from '@mui/icons-material';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';

import UserLayout from '../../layouts/user/UserLayout';
import theme from '../../theme/Theme';

const featuresData = [
	{
		icon: <Search sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
		title: 'Đặt sân dễ dàng',
		description: 'Chỉ với vài thao tác, bạn có thể đặt sân nhanh chóng mà không cần gọi điện.',
	},
	{
		icon: <CalendarToday sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
		title: 'Lịch trình linh hoạt',
		description: 'Xem lịch trống và đặt sân theo thời gian phù hợp với bạn.',
	},
	{
		icon: <Star sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
		title: 'Đánh giá minh bạch',
		description: 'Xem đánh giá từ người chơi khác để chọn sân phù hợp nhất.',
	},
];

const additionalFeatures = [
	{
		icon: <LocationOn sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
		title: 'Vị trí thuận tiện',
		description: 'Tìm kiếm sân cầu lông gần bạn nhất với bản đồ định vị thông minh.',
	},
	{
		icon: <Timer sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
		title: 'Đặt sân theo giờ',
		description: 'Linh hoạt lựa chọn khung giờ phù hợp với thời gian của bạn.',
	},
	{
		icon: <Shield sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
		title: 'Thanh toán an toàn',
		description: 'Hệ thống thanh toán an toàn, nhiều phương thức, không lo hoàn tiền.',
	},
];

const testimonials = [
	{
		name: "Nguyễn Văn A",
		position: "Người chơi thường xuyên",
		quote: "Ứng dụng giúp tôi tiết kiệm rất nhiều thời gian trong việc tìm kiếm và đặt sân cầu lông. Giao diện dễ sử dụng và hỗ trợ rất nhanh!",
		avatar: "/api/placeholder/40/40"
	},
	{
		name: "Trần Thị B",
		position: "Huấn luyện viên cầu lông",
		quote: "Tôi thường xuyên đặt sân cho các buổi huấn luyện. Nền tảng này giúp tôi dễ dàng quản lý lịch trình và tìm được sân chất lượng cao.",
		avatar: "/api/placeholder/40/40"
	},
	{
		name: "Lê Văn C",
		position: "Người mới chơi",
		quote: "Rất tiện lợi cho người mới bắt đầu như tôi. Có thể xem đánh giá và chọn sân phù hợp với trình độ của mình.",
		avatar: "/api/placeholder/40/40"
	}
];

const FeatureCard = ({ feature, index }) => (
	<Grid size={{ xs: 12, md: 4 }} key={index}>
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			whileInView={{ opacity: 1, scale: 1 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
		>
			<Paper
				elevation={0}
				sx={{
					textAlign: 'center',
					p: 4,
					height: '100%',
					borderRadius: '16px',
					boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
					transition: 'transform 0.3s, box-shadow 0.3s',
					'&:hover': {
						transform: 'translateY(-8px)',
						boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
					},
				}}
			>
				<Avatar
					sx={{
						width: 80,
						height: 80,
						mx: 'auto',
						mb: 3,
						bgcolor: 'rgba(59, 130, 246, 0.1)',
					}}
				>
					{feature.icon}
				</Avatar>
				<Typography
					variant="h6"
					sx={{ fontWeight: 700, mb: 2 }}
				>
					{feature.title}
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ lineHeight: 1.7 }}
				>
					{feature.description}
				</Typography>
			</Paper>
		</motion.div>
	</Grid>
);

const TestimonialCard = ({ testimonial, index }) => (
	<Grid size={{ xs: 12, md: 4 }} key={index}>
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
		>
			<Card sx={{
				height: '100%',
				borderRadius: '16px',
				boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
				transition: 'transform 0.3s, box-shadow 0.3s',
				'&:hover': {
					transform: 'translateY(-5px)',
					boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
				}
			}}>
				<CardContent sx={{ p: 4 }}>
					<Typography
						variant="body1"
						sx={{
							mb: 3,
							fontStyle: 'italic',
							color: theme.palette.text.secondary
						}}
					>
						"{testimonial.quote}"
					</Typography>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Avatar src={testimonial.avatar} alt={testimonial.name} />
						<Box sx={{ ml: 2 }}>
							<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
								{testimonial.name}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{testimonial.position}
							</Typography>
						</Box>
					</Box>
				</CardContent>
			</Card>
		</motion.div>
	</Grid>
);

const BenefitItem = ({ icon, title, description }) => (
	<Box sx={{ display: 'flex', mb: 3 }}>
		<Box sx={{ mr: 2 }}>
			{icon}
		</Box>
		<Box>
			<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
				{title}
			</Typography>
			<Typography variant="body2" color="text.secondary">
				{description}
			</Typography>
		</Box>
	</Box>
);

const HomePage = () => {
	const navigate = useNavigate();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	return (
		<UserLayout>
			<Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
				{/* Hero Banner Section */}
				<Box
					sx={{
						position: 'relative',
						height: { xs: '70vh', md: '90vh' },
						overflow: 'hidden',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: 'white',
					}}
				>
					{/* Background Video */}
					<Box
						sx={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							backgroundImage: 'url(https://images.unsplash.com/photo-1622977265115-cce36eb43f18?auto=format&fit=crop&w=1920&q=80)',
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							'&:before': {
								content: '""',
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								background: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7))',
								zIndex: 1,
							},
						}}
					/>

					{/* Animated Particles */}
					<Box
						sx={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							opacity: 0.3,
							zIndex: 2,
							background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23FFFFFF' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%23FFFFFF'%3E%3Ccircle cx='769' cy='229' r='5'/%3E%3Ccircle cx='539' cy='269' r='5'/%3E%3Ccircle cx='603' cy='493' r='5'/%3E%3Ccircle cx='731' cy='737' r='5'/%3E%3Ccircle cx='520' cy='660' r='5'/%3E%3Ccircle cx='309' cy='538' r='5'/%3E%3Ccircle cx='295' cy='764' r='5'/%3E%3Ccircle cx='40' cy='599' r='5'/%3E%3Ccircle cx='102' cy='382' r='5'/%3E%3Ccircle cx='127' cy='80' r='5'/%3E%3Ccircle cx='370' cy='105' r='5'/%3E%3Ccircle cx='578' cy='42' r='5'/%3E%3Ccircle cx='237' cy='261' r='5'/%3E%3Ccircle cx='390' cy='382' r='5'/%3E%3C/g%3E%3C/svg%3E")`,
						}}
					/>

					{/* Hero Content */}
					<Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3 }}>
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
						>
							<Typography
								variant="h2"
								sx={{
									fontWeight: 800,
									mb: 3,
									fontSize: { xs: '2.5rem', md: '4.5rem' },
									textShadow: '0 2px 10px rgba(0,0,0,0.3)',
									lineHeight: 1.2,
								}}
							>
								Nâng tầm trải nghiệm<br />cầu lông của bạn
							</Typography>
							<Typography
								variant="h6"
								sx={{
									mb: 5,
									maxWidth: '600px',
									mx: { xs: 'auto', md: 0 },
									opacity: 0.9,
									fontWeight: 400,
									textAlign: { xs: 'center', md: 'left' },
								}}
							>
								Đặt sân cầu lông chuyên nghiệp, dễ dàng và nhanh chóng với hệ thống hiện đại nhất Việt Nam
							</Typography>
							<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
								<Button
									variant="contained"
									size="large"
									onClick={() => navigate('/badminton-branchs')}
									sx={{
										bgcolor: theme.palette.primary.main,
										color: theme.palette.primary.contrastText,
										fontWeight: 600,
										px: 4,
										py: 1.5,
										borderRadius: '10px',
										textTransform: 'none',
										boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
										'&:hover': {
											bgcolor: theme.palette.primary.light,
											boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
										},
									}}
								>
									Tìm sân ngay
								</Button>
								<Button
									variant="outlined"
									size="large"
									onClick={() => {
										window.scrollTo({
											top: window.innerHeight,
											behavior: 'smooth',
										});
									}}
									sx={{
										borderColor: 'white',
										color: 'white',
										fontWeight: 600,
										px: 4,
										py: 1.5,
										borderRadius: '10px',
										textTransform: 'none',
										'&:hover': {
											borderColor: 'white',
											bgcolor: 'rgba(255, 255, 255, 0.1)',
										},
									}}
								>
									Tìm hiểu thêm
								</Button>
							</Box>
						</motion.div>
					</Container>
				</Box>

				{/* How It Works Section */}
				<Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 } }}>
					<Container maxWidth="lg">
						<Box sx={{ textAlign: 'center', mb: 8 }}>
							<Typography
								variant="overline"
								sx={{
									color: theme.palette.primary.main,
									fontWeight: 600,
									letterSpacing: 2,
									fontSize: '1rem'
								}}
							>
								HƯỚNG DẪN SỬ DỤNG
							</Typography>
							<Typography
								variant="h4"
								sx={{
									fontWeight: 800,
									mb: 2,
									background: `linear-gradient(135deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
									backgroundClip: 'text',
									WebkitBackgroundClip: 'text',
									color: 'transparent',
								}}
							>
								Đặt sân chỉ với 3 bước đơn giản
							</Typography>
							<Typography
								variant="body1"
								sx={{
									mb: 6,
									maxWidth: '700px',
									mx: 'auto',
									color: theme.palette.text.secondary,
								}}
							>
								Nền tảng của chúng tôi được thiết kế để mang lại sự đơn giản và hiệu quả cho trải nghiệm đặt sân cầu lông của bạn.
							</Typography>
						</Box>

						<Grid container spacing={5} justifyContent="center">
							{[
								{
									icon: <Search sx={{ fontSize: 40, color: 'white' }} />,
									title: 'Tìm kiếm sân phù hợp',
									description: 'Tìm kiếm sân cầu lông gần bạn với bộ lọc thông minh theo vị trí, giá cả và đánh giá.',
									bgColor: theme.palette.primary.main,
								},
								{
									icon: <CalendarToday sx={{ fontSize: 40, color: 'white' }} />,
									title: 'Chọn thời gian và đặt sân',
									description: 'Xem lịch trống và đặt sân theo khung giờ mong muốn chỉ với vài cú nhấp chuột.',
									bgColor: '#22d3ee',
								},
								{
									icon: <AccessTime sx={{ fontSize: 40, color: 'white' }} />,
									title: 'Thanh toán và xác nhận',
									description: 'Thanh toán trực tuyến an toàn và nhận xác nhận đặt sân ngay lập tức qua email hoặc SMS.',
									bgColor: '#3b82f6',
								},
							].map((step, index) => (
								<Grid size={{ xs: 12, md: 4 }} key={index}>
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.5, delay: index * 0.2 }}
									>
										<Box
											sx={{
												textAlign: 'center',
												height: '100%',
												position: 'relative',
											}}
										>
											{index < 2 && (
												<Box
													sx={{
														position: 'absolute',
														top: '50px',
														right: '-30px',
														width: { xs: '0', md: '60px' },
														height: '2px',
														bgcolor: theme.palette.divider,
														zIndex: 1,
														display: { xs: 'none', md: 'block' },
														'&:after': {
															content: '""',
															position: 'absolute',
															right: 0,
															top: '-4px',
															width: '10px',
															height: '10px',
															borderRight: `2px solid ${theme.palette.divider}`,
															borderTop: `2px solid ${theme.palette.divider}`,
															transform: 'rotate(45deg)',
														},
													}}
												/>
											)}
											<Avatar
												sx={{
													width: 100,
													height: 100,
													mx: 'auto',
													mb: 3,
													bgcolor: step.bgColor,
													boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
												}}
											>
												{step.icon}
											</Avatar>
											<Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
												{step.title}
											</Typography>
											<Typography
												variant="body2"
												color="text.secondary"
												sx={{ lineHeight: 1.7 }}
											>
												{step.description}
											</Typography>
										</Box>
									</motion.div>
								</Grid>
							))}
						</Grid>
					</Container>
				</Box>

				{/* Features Section */}
				<Box sx={{ bgcolor: 'background.default', py: { xs: 8, md: 12 } }}>
					<Container maxWidth="lg">
						<Box sx={{ textAlign: 'center', mb: 8 }}>
							<Typography
								variant="overline"
								sx={{
									color: theme.palette.primary.main,
									fontWeight: 600,
									letterSpacing: 2,
									fontSize: '1rem'
								}}
							>
								TÍNH NĂNG ĐẶC BIỆT
							</Typography>
							<Typography
								variant="h4"
								sx={{
									fontWeight: 800,
									mb: 2,
									background: `linear-gradient(135deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
									backgroundClip: 'text',
									WebkitBackgroundClip: 'text',
									color: 'transparent',
								}}
							>
								Tại sao chọn chúng tôi?
							</Typography>
							<Typography
								variant="body1"
								sx={{
									mb: 8,
									maxWidth: '700px',
									mx: 'auto',
									color: theme.palette.text.secondary,
								}}
							>
								Chúng tôi mang đến trải nghiệm đặt sân cầu lông dễ dàng và thuận tiện nhất với các tính năng vượt trội.
							</Typography>
						</Box>

						<Grid container spacing={5}>
							{featuresData.map((feature, index) => (
								<FeatureCard feature={feature} index={index} key={index} />
							))}
						</Grid>

						<Grid container spacing={5} sx={{ mt: 4 }}>
							{additionalFeatures.map((feature, index) => (
								<FeatureCard feature={feature} index={index + 3} key={index} />
							))}
						</Grid>
					</Container>
				</Box>

				{/* Value Proposition Section */}
				<Box sx={{
					bgcolor: 'background.paper',
					py: { xs: 8, md: 12 },
					backgroundImage: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(34, 211, 238, 0.03) 100%)'
				}}>
					<Container maxWidth="lg">
						<Grid container spacing={6} alignItems="center">
							<Grid size={{ xs: 12, md: 6 }}>
								<motion.div
									initial={{ opacity: 0, x: -30 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.8 }}
								>
									<Box
										component="img"
										src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80"
										alt="Badminton Court"
										sx={{
											width: '100%',
											height: 'auto',
											borderRadius: '16px',
											boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
										}}
									/>
								</motion.div>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<motion.div
									initial={{ opacity: 0, x: 30 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.8 }}
								>
									<Typography
										variant="overline"
										sx={{
											color: theme.palette.primary.main,
											fontWeight: 600,
											letterSpacing: 2,
											fontSize: '1rem'
										}}
									>
										LỢI ÍCH VƯỢT TRỘI
									</Typography>
									<Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
										Tối ưu trải nghiệm cầu lông của bạn
									</Typography>
									<Typography variant="body1" sx={{ mb: 4, color: theme.palette.text.secondary, lineHeight: 1.7 }}>
										Nền tảng của chúng tôi được thiết kế để giúp người chơi cầu lông tiết kiệm thời gian, tìm được sân chất lượng và tận hưởng trải nghiệm chơi tốt nhất.
									</Typography>

									<Box sx={{ mb: 4 }}>
										<BenefitItem
											icon={<SportsTennis sx={{ color: theme.palette.primary.main }} />}
											title="Đa dạng lựa chọn sân"
											description="Hàng trăm sân cầu lông chất lượng cao từ khắp các quận huyện để bạn lựa chọn."
										/>
										<BenefitItem
											icon={<EmojiEvents sx={{ color: theme.palette.primary.main }} />}
											title="Tổ chức giải đấu"
											description="Hỗ trợ đặt sân cho các giải đấu nhỏ và lớn với ưu đãi đặc biệt."
										/>
										<BenefitItem
											icon={<Group sx={{ color: theme.palette.primary.main }} />}
											title="Cộng đồng người chơi"
											description="Kết nối với những người chơi cầu lông khác để tìm bạn chơi cùng hoặc đối thủ."
										/>
									</Box>
								</motion.div>
							</Grid>
						</Grid>
					</Container>
				</Box>

				{/* CTA Section */}
				<Box sx={{ bgcolor: 'background.paper', py: { xs: 6, md: 10 } }}>
					<Container maxWidth="lg">
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
						>
							<Box
								sx={{
									p: { xs: 4, md: 8 },
									borderRadius: '24px',
									background: `linear-gradient(135deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
									color: 'white',
									textAlign: 'center',
									boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
									overflow: 'hidden',
									position: 'relative',
								}}
							>
								{/* Background Pattern */}
								<Box
									sx={{
										position: 'absolute',
										top: 0,
										left: 0,
										width: '100%',
										height: '100%',
										opacity: 0.1,
										background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23FFFFFF\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
									}}
								/>

								<Box sx={{ position: 'relative', zIndex: 1 }}>
									<Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
										Sẵn sàng bắt đầu trải nghiệm?
									</Typography>
									<Typography sx={{ mb: 5, maxWidth: '700px', mx: 'auto', opacity: 0.9, fontSize: '1.1rem' }}>
										Tham gia ngay hôm nay để nhận ưu đãi đặc biệt 20% cho lần đặt sân đầu tiên và cập nhật thông tin mới nhất về các sân cầu lông.
									</Typography>

									<Grid container spacing={2} justifyContent="center">
										<Grid size={{ xs: 12, md: "auto" }}>
											<Button
												variant="contained"
												size="large"
												onClick={() => {
													localStorage.getItem('authToken') ? navigate('/badminton-branchs') : navigate('/login')
												}}
												sx={{
													bgcolor: 'white',
													color: theme.palette.primary.main,
													fontWeight: 600,
													width: { xs: '100%', md: 'auto' },
													px: 4,
													py: 1.5,
													borderRadius: '10px',
													textTransform: 'none',
													boxShadow: '0 4px 12px rgba(255, 255, 255, 0.25)',
													'&:hover': {
														bgcolor: 'white',
														boxShadow: '0 6px 16px rgba(255, 255, 255, 0.4)',
													},
												}}
											>
												Tham gia ngay
											</Button>
										</Grid>
									</Grid>
								</Box>
							</Box>
						</motion.div>
					</Container>
				</Box>

				{/* Mobile App Download Section */}
				<Box sx={{ bgcolor: 'background.default', py: { xs: 8, md: 12 } }}>
					<Container maxWidth="lg">
						<Grid container spacing={6} alignItems="center">
							<Grid size={{ xs: 12, md: 6 }}>
								<motion.div
									initial={{ opacity: 0, x: -30 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.8 }}
								>
									<Typography
										variant="overline"
										sx={{
											color: theme.palette.primary.main,
											fontWeight: 600,
											letterSpacing: 2,
											fontSize: '1rem'
										}}
									>
										ỨNG DỤNG DI ĐỘNG
									</Typography>
									<Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
										Đặt sân cầu lông mọi lúc, mọi nơi
									</Typography>
									<Typography variant="body1" sx={{ mb: 4, color: theme.palette.text.secondary, lineHeight: 1.7 }}>
										Tải xuống ứng dụng di động của chúng tôi để có trải nghiệm đặt sân cầu lông tốt nhất. Dễ dàng tìm kiếm, đặt sân và thanh toán chỉ với vài thao tác đơn giản.
									</Typography>

									<Box sx={{ mb: 4 }}>
										<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
											{[
												{ key: 'instant', title: 'Đặt sân tức thì', description: 'Chỉ mất 30 giây để hoàn tất quá trình đặt sân.' },
												{ key: 'notification', title: 'Thông báo thông minh', description: 'Nhận thông báo về ưu đãi đặc biệt và nhắc nhở lịch chơi.' },
												{ key: 'payment', title: 'Thanh toán đa dạng', description: 'Hỗ trợ nhiều phương thức thanh toán an toàn và tiện lợi.' },
											].map((item) => (
												<Box key={item.key} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
													<Box
														sx={{
															minWidth: '24px',
															height: '24px',
															borderRadius: '50%',
															bgcolor: theme.palette.primary.main,
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															color: 'white',
															fontWeight: 'bold',
															fontSize: '14px',
															mr: 2,
															mt: 0.5
														}}
													>
														✓
													</Box>
													<Box>
														<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
															{item.title}
														</Typography>
														<Typography variant="body2" color="text.secondary">
															{item.description}
														</Typography>
													</Box>
												</Box>
											))}
										</Stack>
									</Box>

									<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
										<Button
											variant="outlined"
											color="primary"
											size="large"
											sx={{
												borderRadius: '10px',
												textTransform: 'none',
												py: 1.5,
												px: 3,
												borderColor: theme.palette.primary.main,
												'&:hover': {
													borderColor: theme.palette.primary.main,
													bgcolor: 'rgba(59, 130, 246, 0.04)',
												},
											}}
										>
											<AndroidIcon sx={{ mr: 1 }} /> Google Play
										</Button>

										<Button
											variant="outlined"
											color="primary"
											size="large"
											sx={{
												borderRadius: '10px',
												textTransform: 'none',
												py: 1.5,
												px: 3,
												borderColor: theme.palette.primary.main,
												'&:hover': {
													borderColor: theme.palette.primary.main,
													bgcolor: 'rgba(59, 130, 246, 0.04)',
												},
											}}
										>
											<AppleIcon sx={{ mr: 1 }} /> App Store
										</Button>

									</Box>
								</motion.div>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<motion.div
									initial={{ opacity: 0, x: 30 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.8 }}
								>
									<Box sx={{ position: 'relative' }}>
										<Box
											component="img"
											src="public\images\logo.png"
											alt="Mobile App"
											sx={{
												maxWidth: '300px',
												height: 'auto',
												borderRadius: '24px',
												boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
												display: 'block',
												mx: 'auto',
												border: '10px solid #f8f9fa',
												bgcolor: '#f8f9fa',
											}}
										/>
										<Box
											sx={{
												position: 'absolute',
												bottom: -20,
												right: { xs: 'calc(50% - 160px)', md: 0 },
												width: '220px',
												height: '220px',
												borderRadius: '50%',
												background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
												opacity: 0.1,
												zIndex: -1,
											}}
										/>
									</Box>
								</motion.div>
							</Grid>
						</Grid>
					</Container>
				</Box>
			</Box>
		</UserLayout>
	);
};

export default HomePage;