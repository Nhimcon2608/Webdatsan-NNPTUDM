import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    Avatar,
    IconButton,
    Divider,
    Paper,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    CircularProgress
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsIcon from "@mui/icons-material/Directions";
import ScheduleIcon from "@mui/icons-material/Schedule";
import WorkIcon from "@mui/icons-material/Work";
import CheckIcon from '@mui/icons-material/Check';

import { useSnackbar } from "../../../context/SnackbarContext";
import { useAuth } from "../../../context/AuthContext";


import BadmintonIcon from "../../components/common/BadmintonIcon";
import RegistrationConfirmModal from "./RegistrationConfirmModal";
import LoginModal from "./LoginModal";

import temporaryRecruitmentService from "../../services/temporaryRecruitmentService";
import authService from "../../services/authService";

import { stringToColor } from "../../utils/stringToColor";


const TemporaryRecruitmentDetailModal = ({
    open,
    onClose,
    data,
    handleGetDirections,
    formatDateForDisplay,
    formatDateOnly,
    isRegistration,
    user,
    theme
}) => {
    const { showSnackbar } = useSnackbar();
    const { login } = useAuth();

    const [recruitmentDetails, setRecruitmentDetails] = useState();
    const [loading, setLoading] = useState(false);
    const [openRegistrationConfirmModal, setOpenRegistrationConfirmModal] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);

    useEffect(() => {
        if (!open || !data?.id) return;
        setRecruitmentDetails(data);

        const fetchDetail = async () => {
            setLoading(true);
            try {
                const res = await temporaryRecruitmentService.getById(data.id);
                setRecruitmentDetails(res);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [open, data]);

    const detailData = recruitmentDetails || data || {};
    const displayName = detailData?.username || "Người chơi";
    const createAt = detailData?.createAt || detailData?.createdAt;
    const rentalInformations = detailData?.badmintonCourtRentalInformations || [];
    const firstStartTime = rentalInformations
        .map(item => item?.startTime)
        .filter(Boolean)
        .sort()[0];

    const handleRegistion = () => {
        if (!detailData?.id) {
            showSnackbar("Không tìm thấy mã tin tuyển vãng lai", "error");
            return;
        }

        if (!user) {
            setOpenLoginModal(true);
            return;
        }
        setOpenRegistrationConfirmModal(true);
    }

    const handleRegisterRecruitmentSuccess = () => {
        showSnackbar("Đăng ký vãng lai thành công", "success");
    }

    const handleLoginSuccess = async (response) => {
        localStorage.setItem("authToken", response.token);
        await login();
        setOpenLoginModal(false);
    };

    const handleRegisterSuccess = () => {
        setOpenLoginModal(false);
        showSnackbar("Đăng ký thành công", "success");
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" fontWeight={600}>
                            Chi tiết tin tuyển vãng lai
                        </Typography>
                        <IconButton onClick={onClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    detailData && (
                        <DialogContent>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                                {
                                    detailData.imagePath ? (
                                        <Avatar
                                            src={`${import.meta.env.VITE_API_URL}/${detailData.imagePath}`}
                                            alt={displayName}
                                            sx={{ width: 56, height: 56, mr: 2 }}
                                        />
                                    ) : (
                                        <Avatar
                                            sx={{ width: 56, height: 56, mr: 2, bgcolor: stringToColor(displayName) }}
                                        >
                                            {displayName.charAt(0).toUpperCase()}
                                        </Avatar>
                                    )
                                }
                                <Box>
                                    <Typography variant="h6" fontWeight={600}>
                                        {displayName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Ngày đăng: {formatDateForDisplay(createAt)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />


                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                    Thông tin tuyển vãng lai
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 2,
                                        p: 2,
                                        backgroundColor: "#f8f9fa",
                                        borderRadius: 2
                                    }}
                                >
                                    <EventIcon color="primary" sx={{ mr: 2 }} />
                                    <Box>
                                        <Typography variant="body1" fontWeight={600} color="primary">
                                            Ngày tuyển: {formatDateOnly(detailData.bookAt)}
                                        </Typography>
                                        {firstStartTime && (
                                            <Typography variant="body2" color="text.secondary">
                                                Lúc: {firstStartTime.slice(0, 5)}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>

                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    Số lượng tuyển: <strong>{detailData.quantity || 0} người</strong>
                                </Typography>

                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    Nội dung:
                                </Typography>

                                <Paper sx={{ p: 2, backgroundColor: "#fafafa", borderRadius: 1 }}>
                                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                                        {detailData.content || "Chưa có nội dung mô tả."}
                                    </Typography>
                                </Paper>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {detailData && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                        Thông tin sân cầu lông
                                    </Typography>

                                    <Box sx={{ mb: 3 }}>
                                        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                                            <BadmintonIcon
                                                style={{ marginRight: 10, color: theme?.palette?.secondary?.main }}
                                            />
                                            <Box>
                                                <Typography variant="body1" fontWeight={600}>
                                                    {detailData.branchName || "Chưa cập nhật"}
                                                </Typography>
                                                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                                                    <LocationOnIcon color="action" sx={{ fontSize: 16, mr: 0.5 }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {detailData.address || "Chưa cập nhật địa chỉ"}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Button
                                            variant="outlined"
                                            startIcon={<DirectionsIcon />}
                                            size="small"
                                            onClick={() => handleGetDirections(detailData.address || "")}
                                            disabled={!detailData.address}
                                        >
                                            Chỉ đường
                                        </Button>
                                    </Box>

                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                        Chi tiết đặt sân:
                                    </Typography>

                                    <List dense>
                                        {rentalInformations.map((court, index) => (
                                            <ListItem key={index} sx={{ px: 0 }}>
                                                <ListItemIcon sx={{ minWidth: 40 }}>
                                                    <ScheduleIcon color="secondary" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={`Sân: ${court.ordinalNumber}`}
                                                    secondary={`Bắt đầu: ${(court.startTime || "").slice(0, 5)} • Thời gian: ${court.rentalTime || 0} tiếng`}
                                                />

                                            </ListItem>
                                        ))}
                                    </List>

                                    {rentalInformations.length === 0 && (
                                        <Typography variant="body2" color="text.secondary">
                                            Chưa có chi tiết đặt sân.
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </DialogContent>
                    ))
                }
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose} color="inherit">
                        Đóng
                    </Button>
                    {displayName !== user?.username && (
                        <Button
                            variant="contained"
                            startIcon={isRegistration ? <CheckIcon /> : <WorkIcon />}
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                backgroundColor: isRegistration ? "grey.500" : undefined,
                            }}
                            size="small"
                            disabled={isRegistration}
                            onClick={(e) => {
                                if (!isRegistration) {
                                    handleRegistion();
                                }
                            }}
                        >
                            {isRegistration ? "Đã đăng ký" : "Đăng ký"}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {openRegistrationConfirmModal && (
                <RegistrationConfirmModal
                    open={openRegistrationConfirmModal}
                    onClose={() => setOpenRegistrationConfirmModal(false)}
                    item={detailData}
                    onRegisterSuccess={handleRegisterRecruitmentSuccess}
                />
            )}

            {openLoginModal && (
                <LoginModal
                    open={openLoginModal}
                    isModal={true}
                    onClose={() => setOpenLoginModal(false)}
                    authService={authService}
                    onLoginSuccess={handleLoginSuccess}
                    onRegisterSuccess={handleRegisterSuccess}
                    defaultTab="login"
                    showTabs={true}
                />
            )}
        </>
    );
};

export default TemporaryRecruitmentDetailModal;
