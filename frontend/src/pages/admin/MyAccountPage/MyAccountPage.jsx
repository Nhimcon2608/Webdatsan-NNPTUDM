import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Avatar,
    Button,
    Divider,
    Grid,
    Switch,
    FormControlLabel,
    Card,
    CardContent,
    IconButton,
    useMediaQuery
} from '@mui/material';
import {
    Done as DoneIcon,
    PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';

import adminTheme from '../../../theme/adminTheme';

import { stringToColor } from '../../../utils/stringToColor';

import { useAuth } from '../../../../context/AuthContext';
import { useSnackbar } from '../../../../context/SnackbarContext';

import ChangePasswordModal from '../../../components/modal/ChangePasswordModal';

import userService from '../../../services/userService';


const MyAccountPage = () => {
    const { user, login } = useAuth();
    const { showSnackbar } = useSnackbar();
    const isMobile = useMediaQuery(adminTheme.breakpoints.down('md'));
    const displayName = user?.username || user?.fullName || user?.email || 'Admin';
    const displayImage = user?.imagePath || user?.avatarUrl || '';
    const displayInitial = displayName.charAt(0).toUpperCase();

    const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(false);

    const handleChangeEmailNotifications = (event) => {
        setEmailNotifications(event.target.checked);
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            await userService.uploadAvatar(formData);
            await login();
            showSnackbar('Đổi avatar thành công', 'success');
        } catch (error) {
            showSnackbar('Đổi avatar thất bại', 'error');
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>

            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: adminTheme.palette.primary.main
                    }}
                >
                    Cài Đặt Tài Khoản
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Quản lý thông tin cá nhân và cài đặt tài khoản của bạn
                </Typography>
            </Box>

            <Grid container spacing={4}>

                <Grid size={{ xs: 12, md: 5 }}>
                    <Card
                        elevation={1}
                        sx={{
                            borderRadius: 2,
                            height: '100%',
                            transition: 'all 0.3s',
                            '&:hover': {
                                boxShadow: adminTheme.shadows[4]
                            }
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{
                                        fontWeight: 'medium',
                                        color: adminTheme.palette.text.primary
                                    }}
                                >
                                    Thông Tin Tài Khoản
                                </Typography>
                            </Box>

                            <Box
                                display="flex"
                                flexDirection={isMobile ? 'column' : 'row'}
                                alignItems="center"
                                sx={{ mb: 3 }}
                            >
                                <Box
                                    position="relative"
                                    sx={{
                                        mb: isMobile ? 3 : 0,
                                        mr: isMobile ? 0 : 3
                                    }}
                                >
                                    {displayImage ? (
                                        <Avatar
                                            src={`${import.meta.env.VITE_API_URL}/${displayImage}`}
                                            alt={displayName}
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                border: `3px solid ${adminTheme.palette.primary.light}`
                                            }}
                                        />
                                    ) : (
                                        <Avatar
                                            style={{ backgroundColor: stringToColor(displayName) }}
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                border: `3px solid ${adminTheme.palette.primary.light}`
                                            }}
                                        >
                                            {displayInitial}
                                        </Avatar>
                                    )}
                                    <IconButton
                                        aria-label="upload picture"
                                        component="label"
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            backgroundColor: adminTheme.palette.primary.main,
                                            color: adminTheme.palette.common.white,
                                            '&:hover': {
                                                backgroundColor: adminTheme.palette.primary.dark,
                                            },
                                        }}
                                    >
                                        <input hidden accept="image/*" type="file" onChange={handleAvatarChange}/>
                                        <PhotoCameraIcon fontSize="small" />
                                    </IconButton>
                                </Box>

                                <Box
                                    textAlign={isMobile ? 'center' : 'left'}
                                    sx={{ flexGrow: 1 }}
                                >
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 'medium',
                                            color: adminTheme.palette.text.primary
                                        }}
                                    >
                                        {displayName}
                                    </Typography>

                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: adminTheme.palette.text.secondary,
                                            mt: 1
                                        }}
                                    >
                                        {user?.email || '-'}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: adminTheme.palette.text.secondary,
                                            mt: 1
                                        }}
                                    >
                                        {user?.phoneNumber || '-'}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>


                <Grid size={{ xs: 12, md: 7 }}>
                    <Grid container spacing={4} direction="column">
                        <Grid>
                            <Card
                                elevation={1}
                                sx={{
                                    borderRadius: 2,
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        boxShadow: adminTheme.shadows[4]
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        sx={{
                                            mb: 3,
                                            fontWeight: 'medium',
                                            color: adminTheme.palette.text.primary
                                        }}
                                    >
                                        Bảo Mật Tài Khoản
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                borderRadius: adminTheme.shape.borderRadius,
                                                boxShadow: 2,
                                                flexGrow: 1
                                            }}
                                            startIcon={<DoneIcon />}
                                            onClick={() => setOpenChangePasswordModal(true)}
                                        >
                                            Đổi mật khẩu
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            sx={{
                                                borderRadius: adminTheme.shape.borderRadius,
                                                flexGrow: 1
                                            }}
                                        >
                                            Xác thực hai yếu tố
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid>
                            <Card
                                elevation={1}
                                sx={{
                                    borderRadius: 2,
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        boxShadow: adminTheme.shadows[4]
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        sx={{
                                            mb: 3,
                                            fontWeight: 'medium',
                                            color: adminTheme.palette.text.primary
                                        }}
                                    >
                                        Tùy Chọn Thông Báo
                                    </Typography>

                                    <Box>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    name="emailNotifications"
                                                    color="primary"
                                                    checked={emailNotifications}
                                                    onChange={handleChangeEmailNotifications}
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        Nhận thông báo qua email
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Cập nhật và thông báo quan trọng sẽ được gửi đến email của bạn
                                                    </Typography>
                                                </Box>
                                            }
                                            sx={{ alignItems: 'flex-start', mb: 2 }}
                                        />
                                        <Divider sx={{ my: 1 }} />
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    name="pushNotifications"
                                                    color="primary"
                                                    checked={true}
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        Thông báo trong ứng dụng
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Hiển thị thông báo trong ứng dụng
                                                    </Typography>
                                                </Box>
                                            }
                                            sx={{ alignItems: 'flex-start', mt: 2 }}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <ChangePasswordModal
                open={openChangePasswordModal}
                onClose={() => setOpenChangePasswordModal(false)}
            />
        </Container>
    );
};

export default MyAccountPage;
