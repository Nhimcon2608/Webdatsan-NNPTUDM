import React, { useEffect, useState } from "react";
import {
    IconButton,
    Stack,
    Box,
    Typography,
    Avatar,
    Divider,
    Paper,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    CircularProgress
} from "@mui/material";

import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsIcon from "@mui/icons-material/Directions";
import ScheduleIcon from "@mui/icons-material/Schedule";
import WorkIcon from "@mui/icons-material/Work";
import { CheckIcon } from "lucide-react";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';


import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import { useParams } from "react-router-dom";
import { useSnackbar } from "../../../../context/SnackbarContext";
import { useAuth } from "../../../../context/AuthContext";
import { stringToColor } from "../../../utils/stringToColor";

import RegistrationConfirmModal from "../../../components/modal/RegistrationConfirmModal"
import UserLayout from "../../../layouts/user/UserLayout";
import BadmintonIcon from "../../../components/common/BadmintonIcon";
import temporaryRecruitmentService from "../../../services/temporaryRecruitmentService";
import temporaryRegistrationService from "../../../services/temporaryRegistrationService";
import temporaryRecruitmentSavedService from "../../../services/temporaryRecruitmentSavedService";
import LoginModal from "../../../components/modal/LoginModal";
import authService from "../../../services/authService";


const TemporaryRecruitmentDetailSharePage = () => {

    const { showSnackbar } = useSnackbar();
    const { user, login } = useAuth();

    const { temporaryRecruitmentId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openRegistrationConfirmModal, setOpenRegistrationConfirmModal] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [isRegistration, setIsRegistration] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);

            try {
                const [detailRes] = await Promise.all([
                    temporaryRecruitmentService.getFullInforById(temporaryRecruitmentId),
                ]);

                setData(detailRes);


                if (user) {
                    const [registrationRes, savedRes] = await Promise.all([
                        temporaryRegistrationService.getAllTemporaryRegistrationOfUser(),
                        temporaryRecruitmentSavedService.getAllTemporaryRecruitmentSavedOfUser(),
                    ]);

                    const registrationIds = new Set(
                        registrationRes
                            .map(item => item.id || item.temporaryRecruitmentId)
                            .filter(Boolean)
                    );
                    const savedIds = new Set(
                        savedRes
                            .map(item => item.id || item.temporaryRecruitmentId)
                            .filter(Boolean)
                    );

                    setIsRegistration(registrationIds.has(detailRes.id));
                    setIsSaved(savedIds.has(detailRes.id));
                } else {
                    setIsRegistration(false);
                    setIsSaved(false);
                }

            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [temporaryRecruitmentId, user?.id]);

    useEffect(() => {
        if (!user || !user.id) {
            return;
        }

        if (user.role !== "USER") {
            return;
        }
    }, [user]);


    const handleLoginSuccess = async (response) => {
        localStorage.setItem("authToken", response.token);
        await login();
        setOpenLoginModal(false);
    };

    const handleRegisterSuccess = () => {
        setOpenLoginModal(false);
        showSnackbar("Đăng ký thành công", "success");
    };

    const handleRegistion = () => {
        if (!data?.id) {
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
        setIsRegistration(true);
    }

    const handleSaveRecruitment = async () => {
        if (!temporaryRecruitmentId) {
            showSnackbar("Không tìm thấy mã tin tuyển vãng lai", "error");
            return;
        }

        if (!user) {
            setOpenLoginModal(true);
            return;
        }

        if (isSaved) {
            await temporaryRecruitmentSavedService.unSaved(temporaryRecruitmentId);
            setIsSaved(false);
        } else {
            const res = await temporaryRecruitmentSavedService.save(temporaryRecruitmentId);

            if (res) {
                setIsSaved(true);
            }
        };
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!data) {
        return (
            <UserLayout>
                <Box
                    sx={{
                        height: "70vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        px: 2,
                    }}
                >
                    <Box sx={{ maxWidth: 400, height: 200 }}>
                        <DotLottieReact
                            src="https://lottie.host/4115b921-50ca-4af7-8620-7d582370f6a7/1BfSTojagQ.lottie"
                            loop
                            autoplay
                            style={{ width: "100%", height: "100%" }}
                        />
                    </Box>


                    <Typography
                        variant="h6"
                        sx={{ mt: 2, fontWeight: 600 }}
                    >
                        Không tìm thấy tin tuyển vãng lai này
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                        Có thể tin đã bị xoá hoặc không tồn tại.
                    </Typography>
                </Box>
            </UserLayout>
        );
    }

    const displayName = data?.username || "Người chơi";
    const createAt = data?.createAt || data?.createdAt;
    const rentalInformations = data?.badmintonCourtRentalInformations || [];
    const firstStartTime = rentalInformations
        .map(item => item?.startTime)
        .filter(Boolean)
        .sort()[0];


    return (
        <>
            <UserLayout>

                <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        {
                            data.imagePath ? (
                                <Avatar
                                    src={`${import.meta.env.VITE_API_URL}/${data.imagePath}`}
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
                            <Typography variant="h6">{displayName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Ngày đăng: {createAt ? new Date(createAt).toLocaleString() : "Chưa cập nhật"}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>
                        Thông tin tuyển vãng lai
                    </Typography>

                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        p: 2,
                        backgroundColor: "#f8f9fa",
                        borderRadius: 2
                    }}>
                        <EventIcon color="primary" sx={{ mr: 2 }} />
                        <Box>
                            <Typography>
                                Ngày tuyển: {data.bookAt?.slice(0, 10)}
                            </Typography>

                            {firstStartTime && (
                                <Typography variant="body2" color="text.secondary">
                                    Lúc: {firstStartTime.slice(0, 5)}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    <Typography>Số lượng tuyển: <strong>{data.quantity || 0} người</strong></Typography>

                    <Typography sx={{ mt: 2 }}>Nội dung:</Typography>
                    <Paper sx={{ p: 2, backgroundColor: "#fafafa", borderRadius: 1 }}>
                        <Typography>{data.content || "Chưa có nội dung mô tả."}</Typography>
                    </Paper>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" gutterBottom>
                        Thông tin sân cầu lông
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                        <BadmintonIcon style={{ marginRight: 10 }} />
                        <Box>
                            <Typography fontWeight={600}>{data.branchName || "Chưa cập nhật"}</Typography>

                            <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                                <LocationOnIcon color="action" sx={{ fontSize: 16, mr: 0.5 }} />
                                <Typography variant="body2" color="text.secondary">
                                    {data.address || "Chưa cập nhật địa chỉ"}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<DirectionsIcon />}
                        size="small"
                        sx={{ mb: 3 }}
                        onClick={() => window.open(`https://www.google.com/maps?q=${data.address}`)}
                        disabled={!data.address}
                    >
                        Chỉ đường
                    </Button>

                    <Typography variant="subtitle1" fontWeight={600}>
                        Chi tiết đặt sân:
                    </Typography>

                    <List dense>
                        {rentalInformations.map((court, index) => (
                            <ListItem key={index} sx={{ px: 0 }}>
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <ScheduleIcon />
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

                    <Divider sx={{ my: 3 }} />

                    {user?.username != displayName && (
                        <Stack direction="row" spacing={1} alignItems="center">

                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={isRegistration ? <CheckIcon /> : <WorkIcon />}
                                sx={{ borderRadius: 2 }}
                                disabled={isRegistration}
                                onClick={() => {
                                    if (!isRegistration) {
                                        handleRegistion();
                                    }
                                }}
                            >
                                {isRegistration ? "Đã đăng ký" : "Đăng ký"}
                            </Button>

                            <IconButton
                                color="primary"
                                sx={{
                                    borderRadius: 2,
                                    border: "1px solid",
                                    borderColor: "divider",
                                }}
                                onClick={handleSaveRecruitment}
                            >
                                {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                            </IconButton>
                        </Stack>
                    )}
                </Box>

            </UserLayout>

            {openRegistrationConfirmModal && (
                <RegistrationConfirmModal
                    open={openRegistrationConfirmModal}
                    onClose={() => setOpenRegistrationConfirmModal(false)}
                    item={data}
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

export default TemporaryRecruitmentDetailSharePage;
