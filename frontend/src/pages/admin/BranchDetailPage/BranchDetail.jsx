import React, { useEffect, useState } from 'react';

import {
    Box,
    Typography,
    Avatar,
    Paper,
    Divider,
    Button,
    Grid,
    Chip,
    List,
    ListItem,
    Card,
    CardMedia,
    CardContent,
    IconButton,
    Tabs,
    Tab,
    Fade,
    Rating,
    Stack,
    alpha,
} from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import InfoIcon from '@mui/icons-material/Info';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ImageIcon from '@mui/icons-material/Image';
import StarIcon from '@mui/icons-material/Star';
import DirectionsIcon from '@mui/icons-material/Directions';
import BusinessIcon from '@mui/icons-material/Business';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import BadmintonIcon from '../../../components/common/BadmintonIcon';

import { formatVND } from '../../../utils/format'

import { useSnackbar } from '../../../../context/SnackbarContext';

import ImageUploadModal from './ImageUploadModal';
import AddCourtModal from './AddCourtModal';
import DeleteImageModal from './DeleteImageModal';

import badmintionCourtService from '../../../services/badmintonCourtService';
import { resolveBackendUrl } from '../../../services/api';


const BranchDetail = ({ theme, branch = {}, badmintonCourts = [], reviews = [] }) => {
    const [courts, setCourts] = useState(badmintonCourts);
    const { showSnackbar } = useSnackbar();
    const [tabValue, setTabValue] = useState(0);
    const [openUploadImageModal, setOpenUploadImageModal] = useState(false);
    const [courtImageIndexes, setCourtImageIndexes] = useState(
        courts.reduce((acc, court) => ({
            ...acc,
            [court.id]: 0
        }), {})
    );
    const [openDeleteImageConfirm, setOpenDeleteImageConfirm] = useState(false);
    const [openAddCourtModal, setOpenAddCourtModal] = useState(false);

    const [selectedCourtId, setSelectedCourtId] = useState('');
    const [deletingImage, setDeletingImage] = useState(null);
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [existedCourt, setExistedCourt] = useState([]);

    useEffect(() => {

        const fetchCourt = async () => {
            const response = await badmintionCourtService.getAllCourtsOfBranchByStatus(branch.id, 'all');
            setCourts(response);

            setExistedCourt(() => response.map(court => court.ordinalNumber));
        }
        fetchCourt();

    }, [refreshFlag])


    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleCourtImageChange = (courtId, step) => {
        const court = courts.find(c => c.id === courtId);
        if (!court || !court.images || court.images.length === 0) return;

        setCourtImageIndexes(prev => ({
            ...prev,
            [courtId]: (prev[courtId] + step + court.images.length) % court.images.length
        }));

        console.log('courtImageIndexes: ', courtImageIndexes);
    };

    const handleImageUpload = async (formData) => {
        try {

            await badmintionCourtService.uploadImage(formData);

            setRefreshFlag(prev => !prev);

            showSnackbar('Thêm ảnh thành công', 'success');
        } catch (error) {
            console.error('Error uploading image:', error);
            showSnackbar('Thêm ảnh thất bại', 'error');
        } finally {
            setSelectedCourtId('');
        }
    };

    const handleDeleteImage = async (image) => {

        console.log('image: ', image);

        if (!image) {
            showSnackbar('Không tìm thấy hình ảnh', 'error');
            return;
        }

        try {
            await badmintionCourtService.deleteImage(image.badmintonCourtId, image.id);

            setRefreshFlag(prev => !prev);
            showSnackbar('Xóa hình ảnh thành công', 'success');
        } catch (error) {
            console.error('Error deleting image:', error);
            showSnackbar('Lỗi khi xóa hình ảnh', 'error');
        } finally {
            setOpenUploadImageModal(false);
            setDeletingImage(null);
        }
    };

    const handleAddCourtSubmit = async (courtData) => {
        try {

            await badmintionCourtService.addCourt(courtData);
            console.log('courtData: ', courtData)

            setRefreshFlag(prev => !prev);

            showSnackbar('Thêm Sân thành công', 'success');
        } catch (error) {
            console.error('Error adding court:', error);
            showSnackbar('Thêm sân thát bại', 'error');
        }
    };

    return (
        <>
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    mb: 4,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}
            >
                <Box sx={{ position: 'relative' }}>
                    {branch?.imagePath ? (
                        <Box
                            sx={{
                                height: { xs: 200, md: 300 },
                                width: '100%',
                                position: 'relative'
                            }}
                        >
                            <Box
                                component="img"
                                src={resolveBackendUrl(branch.imagePath)}
                                alt={branch.branchName || 'Chi nhánh'}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/images/default/branch-default-image.jpg';
                                }}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '50%',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                                }}
                            />
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                height: { xs: 200, md: 300 },
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                bgcolor: alpha(theme.palette.primary.main, 0.1)
                            }}
                        >
                            <BadmintonIcon />
                        </Box>
                    )}

                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            p: { xs: 2, md: 4 },
                            color: 'white',
                        }}
                    >
                        <Typography variant="h4" fontWeight="bold" sx={{ textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}>
                            {branch?.branchName || 'Tên chi nhánh'}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Rating
                                value={reviews?.length > 0
                                    ? +(reviews.reduce((sum, { ratingLevel }) => sum + ratingLevel, 0) / reviews.length).toFixed(1)
                                    : 0}
                                precision={0.1}
                                readOnly
                                size="small"
                                sx={{ mr: 1 }}
                                emptyIcon={<StarIcon style={{ color: 'rgba(255,255,255,0.4)' }} fontSize="inherit" />}
                            />
                            <Typography variant="body2" sx={{ mr: 2, textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}>
                                {reviews?.length > 0
                                    ? +(reviews.reduce((sum, { ratingLevel }) => sum + ratingLevel, 0) / reviews.length).toFixed(1)
                                    : 0} ({reviews.length} đánh giá)
                            </Typography>

                            {branch?.cooperated ? (
                                <Chip
                                    label="Đối tác chính thức"
                                    color="success"
                                    size="small"
                                    sx={{
                                        height: 24,
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        backgroundColor: '#00c853',
                                        '& .MuiChip-label': { px: 1 }
                                    }}
                                />
                            ) : (
                                <Chip
                                    label="Ngừng hợp tác"
                                    color="error"
                                    size="small"
                                    sx={{
                                        height: 24,
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        '& .MuiChip-label': { px: 1 }
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ p: { xs: 2, md: 4 } }}>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 8 }}>

                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                textColor="primary"
                                indicatorColor="primary"
                                variant="fullWidth"
                                sx={{
                                    mb: 3,
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    '& .MuiTab-root': {
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        minHeight: 48,
                                    }
                                }}
                            >
                                <Tab
                                    icon={<InfoIcon sx={{ fontSize: 20 }} />}
                                    iconPosition="start"
                                    label="Thông tin"
                                />
                                <Tab
                                    icon={<BadmintonIcon style={{ marginRight: 8 }} />}
                                    iconPosition="start"
                                    label={` Sân (${courts.length})`}
                                />

                                <Tab
                                    icon={<AttachMoneyIcon sx={{ fontSize: 20 }} />}
                                    iconPosition="start"
                                    label="Giá"
                                />
                            </Tabs>

                            <Box sx={{ minHeight: 400 }}>

                                <Fade in={tabValue === 0} timeout={500}>
                                    <Box role="tabpanel" hidden={tabValue !== 0} sx={{ height: tabValue === 0 ? 'auto' : 0, overflow: 'hidden' }}>
                                        <Typography variant="h6" gutterBottom>
                                            Giới thiệu
                                        </Typography>

                                        <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                                            {branch?.description || 'Chưa có thông tin mô tả về chi nhánh này.'}
                                        </Typography>
                                    </Box>
                                </Fade>

                                <Fade in={tabValue === 1} timeout={500}>
                                    <Box role="tabpanel" hidden={tabValue !== 1} sx={{ height: tabValue === 1 ? 'auto' : 0, overflow: 'hidden' }}>
                                        {courts.length === 0 ? (
                                            <Box
                                                display="flex"
                                                flexDirection="column"
                                                alignItems="center"
                                                justifyContent="center"
                                                py={6}
                                            >
                                                <BadmintonIcon />
                                                <Typography variant="h6" color="text.secondary">
                                                    Chi nhánh chưa có sân nào
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Grid container spacing={3}>
                                                {courts.map((court) => (
                                                    <Grid
                                                        size={{ xs: 12, sm: 6, md: 5 }}
                                                        key={court.id}
                                                    >
                                                        <Card
                                                            elevation={1}
                                                            sx={{
                                                                borderRadius: 2,
                                                                overflow: 'hidden',
                                                                transition: 'all 0.25s ease',
                                                                height: '100%',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                '&:hover': {
                                                                    transform: 'translateY(-4px)',
                                                                    boxShadow: '0 12px 20px rgba(0,0,0,0.08)',
                                                                },
                                                            }}
                                                        >
                                                            <Box sx={{ position: 'relative' }}>
                                                                <Chip
                                                                    label={court.available ? "Đang mở" : "Đang đóng"}
                                                                    color={court.available ? "success" : "error"}
                                                                    size="small"
                                                                    sx={{
                                                                        position: 'absolute',
                                                                        top: 12,
                                                                        left: 12,
                                                                        fontWeight: 600,
                                                                        fontSize: '0.75rem',
                                                                        height: 28,
                                                                        zIndex: 2,
                                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                                    }}
                                                                />

                                                                {court.images?.length > 0 ? (
                                                                    <>
                                                                        <Box sx={{ position: 'relative', height: 220 }}>
                                                                            <CardMedia
                                                                                component="img"
                                                                                sx={{
                                                                                    height: '100%',
                                                                                    objectFit: 'cover'
                                                                                }}
                                                                                image={resolveBackendUrl(court.images[courtImageIndexes[court.id]]?.imagePath)}
                                                                                alt={`Sân số ${court.ordinalNumber}`}
                                                                                onError={(e) => {
                                                                                    e.target.onerror = null;
                                                                                    e.target.src = '/images/default/no-image.png';
                                                                                }}
                                                                            />

                                                                            {court.images.length > 1 && (
                                                                                <Box
                                                                                    sx={{
                                                                                        position: 'absolute',
                                                                                        bottom: 0,
                                                                                        width: '100%',
                                                                                        display: 'flex',
                                                                                        justifyContent: 'space-between',
                                                                                        p: 1,
                                                                                        background: 'linear-gradient(transparent, rgba(0,0,0,0.3))'
                                                                                    }}
                                                                                >
                                                                                    <IconButton
                                                                                        size="small"
                                                                                        onClick={() => handleCourtImageChange(court.id, -1)}
                                                                                        sx={{
                                                                                            color: 'white',
                                                                                            bgcolor: 'rgba(0,0,0,0.4)',
                                                                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
                                                                                        }}
                                                                                    >
                                                                                        <KeyboardArrowLeft />
                                                                                    </IconButton>

                                                                                    <Typography
                                                                                        variant="caption"
                                                                                        sx={{
                                                                                            color: 'white',
                                                                                            alignSelf: 'center',
                                                                                            bgcolor: 'rgba(0,0,0,0.4)',
                                                                                            px: 1,
                                                                                            py: 0.5,
                                                                                            borderRadius: 1
                                                                                        }}
                                                                                    >
                                                                                        {courtImageIndexes[court.id] + 1}/{court.images.length}
                                                                                    </Typography>

                                                                                    <IconButton
                                                                                        size="small"
                                                                                        onClick={() => handleCourtImageChange(court.id, 1)}
                                                                                        sx={{
                                                                                            color: 'white',
                                                                                            bgcolor: 'rgba(0,0,0,0.4)',
                                                                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
                                                                                        }}
                                                                                    >
                                                                                        <KeyboardArrowRight />
                                                                                    </IconButton>
                                                                                </Box>
                                                                            )}
                                                                        </Box>
                                                                    </>
                                                                ) : (
                                                                    <Box
                                                                        sx={{
                                                                            height: 220,
                                                                            width: '100%',
                                                                            display: 'flex',
                                                                            flexDirection: 'column',
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center',
                                                                            bgcolor: alpha(theme.palette.primary.main, 0.05)
                                                                        }}
                                                                    >
                                                                        <BadmintonIcon sx={{ fontSize: 60, color: theme.palette.primary.main, opacity: 0.7 }} />
                                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                                            Chưa có hình ảnh
                                                                        </Typography>
                                                                    </Box>
                                                                )}
                                                            </Box>

                                                            <CardContent sx={{
                                                                flexGrow: 1,
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                p: 2.5
                                                            }}>

                                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                                                    <Typography variant="h6" fontWeight={600}>
                                                                        Sân số {court.ordinalNumber}
                                                                    </Typography>
                                                                </Box>

                                                                {court.images && court.images[courtImageIndexes[court.id]]?.shortDescription ? (
                                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                                        {court.images[courtImageIndexes[court.id]].shortDescription}
                                                                    </Typography>
                                                                ) : (
                                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                                                                        Chưa có mô tả
                                                                    </Typography>
                                                                )}

                                                                <Box
                                                                    sx={{
                                                                        mt: 'auto',
                                                                        pt: 2,
                                                                        borderTop: 1,
                                                                        borderColor: 'divider',
                                                                        width: '100%'
                                                                    }}
                                                                >
                                                                    <Box sx={{
                                                                        display: 'flex',
                                                                        flexDirection: { xs: 'column', sm: 'row' },
                                                                        justifyContent: 'space-between',
                                                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                                                        gap: 1
                                                                    }}>
                                                                        <Chip
                                                                            icon={<ImageIcon sx={{ fontSize: '16px !important' }} />}
                                                                            label={`${court.images?.length || 0} ảnh`}
                                                                            size="small"
                                                                            variant="outlined"
                                                                            sx={{ height: 28 }}
                                                                        />

                                                                        <Stack
                                                                            direction={{ xs: 'column', sm: 'row' }}
                                                                            spacing={1}
                                                                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                                                                        >
                                                                            {court.images?.length > 0 && (
                                                                                <Button
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    onClick={() => {
                                                                                        setSelectedCourtId(court.id);
                                                                                        setDeletingImage({
                                                                                            courtId: court.id,
                                                                                            imageIndex: courtImageIndexes[court.id]
                                                                                        });
                                                                                        setOpenDeleteImageConfirm(true);
                                                                                    }}
                                                                                    component="label"
                                                                                    color="error"
                                                                                    sx={{
                                                                                        borderRadius: 1.5,
                                                                                        width: { xs: '100%', sm: 'auto' },
                                                                                        minWidth: 36,
                                                                                        padding: '6px'
                                                                                    }}
                                                                                >
                                                                                    < DeleteIcon sx={{ color: 'red' }} />
                                                                                </Button>
                                                                            )}
                                                                            <Button
                                                                                variant="outlined"
                                                                                size="small"
                                                                                onClick={() => {
                                                                                    setSelectedCourtId(court.id);
                                                                                    setOpenUploadImageModal(true);
                                                                                }}
                                                                                component="label"
                                                                                color="primary"
                                                                                sx={{
                                                                                    borderRadius: 1.5,
                                                                                    width: { xs: '100%', sm: 'auto' },
                                                                                    minWidth: 36,
                                                                                    padding: '6px'
                                                                                }}
                                                                            >
                                                                                <AddPhotoAlternateIcon />
                                                                            </Button>
                                                                        </Stack>
                                                                    </Box>
                                                                </Box>

                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        )}
                                        <Grid size={{ xs: 12, sm: 6, md: 5 }}>
                                            <Card
                                                elevation={1}
                                                sx={{
                                                    borderRadius: 2,
                                                    overflow: 'hidden',
                                                    transition: 'all 0.25s ease',
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    cursor: 'pointer',
                                                    border: `2px dashed ${theme.palette.divider}`,
                                                    '&:hover': {
                                                        borderColor: theme.palette.primary.main,
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.05)
                                                    },
                                                }}
                                                onClick={() => setOpenAddCourtModal(true)}
                                            >
                                                <Box
                                                    sx={{
                                                        height: 220,
                                                        width: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        color: theme.palette.text.secondary,
                                                        '&:hover': {
                                                            color: theme.palette.primary.main
                                                        }
                                                    }}
                                                >
                                                    <AddIcon sx={{ fontSize: 60 }} />
                                                    <Typography variant="h6" sx={{ mt: 1 }}>
                                                        Thêm sân mới
                                                    </Typography>
                                                </Box>
                                            </Card>
                                        </Grid>
                                    </Box>
                                </Fade>

                                <Fade in={tabValue === 2} timeout={500}>
                                    <Box role="tabpanel" hidden={tabValue !== 2} sx={{ height: tabValue === 2 ? 'auto' : 0, overflow: 'hidden' }}>
                                        <Typography variant="h6" gutterBottom>
                                            Bảng giá theo khung giờ
                                        </Typography>

                                        {branch.prices?.length > 0 ? (
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    mt: 2,
                                                    border: 1,
                                                    borderColor: 'divider',
                                                    borderRadius: 2,
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {branch.prices.map((price, index) => (
                                                    <React.Fragment key={`price-${price.id}`}>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                p: 2,
                                                                ...(index % 2 === 0 && {
                                                                    bgcolor: alpha(theme.palette.primary.main, 0.03)
                                                                })
                                                            }}
                                                        >
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <ScheduleIcon color="primary" sx={{ mr: 2 }} />
                                                                <Typography variant="body1" fontWeight={500}>
                                                                    {`${price.startTime}:00 - ${price.endTime}:00`}
                                                                </Typography>
                                                            </Box>
                                                            <Typography
                                                                variant="h6"
                                                                color="primary.main"
                                                                fontWeight={700}
                                                            >
                                                                {`${price.pricePerHour ? formatVND(price.pricePerHour) + '/giờ' : '-'}`}
                                                            </Typography>
                                                        </Box>
                                                        {index < branch.prices.length - 1 && <Divider />}
                                                    </React.Fragment>
                                                ))}
                                            </Paper>
                                        ) : (
                                            <Box
                                                display="flex"
                                                justifyContent="center"
                                                alignItems="center"
                                                sx={{
                                                    p: 4,
                                                    mt: 2,
                                                    bgcolor: alpha(theme.palette.primary.main, 0.03),
                                                    borderRadius: 2
                                                }}
                                            >
                                                <AttachMoneyIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                                <Typography variant="body1" color="text.secondary">
                                                    Chưa có thông tin bảng giá
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Fade>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 16, md: 4 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    border: 1,
                                    borderColor: 'divider',
                                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                                    position: 'sticky',
                                    top: 24
                                }}
                            >
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Thông tin liên hệ
                                </Typography>

                                <List disablePadding>
                                    <ListItem disablePadding sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex' }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                    color: theme.palette.primary.main,
                                                    mr: 2
                                                }}
                                            >
                                                <PhoneIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Số điện thoại
                                                </Typography>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {branch?.phoneNumber || 'Chưa có thông tin'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </ListItem>

                                    <ListItem disablePadding sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex' }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                    color: theme.palette.primary.main,
                                                    mr: 2
                                                }}
                                            >
                                                <EmailIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Email
                                                </Typography>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {branch?.email || 'Chưa có thông tin'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </ListItem>

                                    <ListItem disablePadding sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex' }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                    color: theme.palette.primary.main,
                                                    mr: 2
                                                }}
                                            >
                                                <LocationOnIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Địa chỉ
                                                </Typography>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {branch?.address || 'Chưa có thông tin'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </ListItem>

                                    <ListItem disablePadding sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex' }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                    color: theme.palette.primary.main,
                                                    mr: 2
                                                }}
                                            >
                                                <BusinessIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Trạng thái hợp tác
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    fontWeight={500}
                                                    color={branch?.cooperated ? 'success.main' : 'error.main'}
                                                >
                                                    {branch?.cooperated ? 'Đang hợp tác' : 'Ngừng hợp tác'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                </List>

                                <Box sx={{ mt: 3 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        startIcon={<DirectionsIcon />}
                                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(branch.address)}`, '_blank')} sx={{
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 600
                                        }}
                                    >
                                        Chỉ đường
                                    </Button>

                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<PhoneIcon />}
                                        onClick={() => {
                                            if (branch.phoneNumber) {
                                                window.location.href = `tel:${branch.phoneNumber}`;
                                            } else {
                                                alert("Số điện thoại không hợp lệ");
                                            }
                                        }}
                                        sx={{
                                            mt: 2,
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 600
                                        }}
                                    >
                                        Gọi ngay
                                    </Button>

                                </Box>

                                <Box sx={{ mt: 4 }}>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Số sân hiện có
                                    </Typography>

                                    <Paper
                                        elevation={0}
                                        sx={{
                                            mt: 2,
                                            p: 2,
                                            border: 1,
                                            borderColor: 'divider',
                                            borderRadius: 2,
                                            bgcolor: 'background.paper'
                                        }}
                                    >
                                        <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                                            <Box sx={{ textAlign: 'center', flex: 1 }}>
                                                <Typography variant="h5" color="primary.main" fontWeight="bold">
                                                    {courts.length}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Tổng số sân
                                                </Typography>
                                            </Box>

                                            <Box sx={{ textAlign: 'center', flex: 1 }}>
                                                <Typography variant="h5" color="success.main" fontWeight="bold">
                                                    {courts.filter(c => c.available).length}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Đang mở
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            <ImageUploadModal
                courtId={selectedCourtId}
                open={openUploadImageModal}
                onClose={() => setOpenUploadImageModal(false)}
                onUpload={handleImageUpload}
                onDelete={handleDeleteImage}
            />

            <AddCourtModal
                open={openAddCourtModal}
                onClose={() => setOpenAddCourtModal(false)}
                branchId={branch.id}
                onSubmit={handleAddCourtSubmit}
                existedCourt={existedCourt}
            />

            <DeleteImageModal
                onOpen={openDeleteImageConfirm}
                onClose={() => setOpenDeleteImageConfirm(false)}
                onDelete={() =>
                    handleDeleteImage(
                        deletingImage ?
                            courts.find(c => c.id === deletingImage.courtId)?.images[deletingImage.imageIndex] : null
                    )
                }
            />
        </>
    );
};

export default BranchDetail;
