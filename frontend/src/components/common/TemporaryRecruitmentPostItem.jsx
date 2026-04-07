import { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Avatar,
    Box,
    Typography,
    IconButton,
    Button
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import WorkIcon from "@mui/icons-material/Work";
import ShareIcon from "@mui/icons-material/Share";
import CheckIcon from '@mui/icons-material/Check';

import LoginModal from "../../components/modal/LoginModal";
import RegistrationConfirmModal from "../modal/RegistrationConfirmModal"
import ShareModal from "../modal/ShareModal";
import { formatDateForDisplay, formatDateOnly } from "../../utils/format";
import { stringToColor } from '../../utils/stringToColor';
import temporaryRecruitmentSavedService from "../../services/temporaryRecruitmentSavedService";
import authService from "../../services/authService";
import { resolveBackendUrl } from "../../services/api";
import { useSnackbar } from "../../../context/SnackbarContext";
import { useAuth } from "../../../context/AuthContext";


const TemporaryRecruitmentPostItem = ({
    item,
    handleOpenDetail,
    theme,
    isSaved = false,
    isRegistration = false,
    user = null,
    onUnsaveSuccess,
}) => {

    const { showSnackbar } = useSnackbar();
    const { login } = useAuth();

    const [saved, setSaved] = useState(isSaved);
    const [registration, setRegistration] = useState(isRegistration);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [openRegistrationConfirmModal, setOpenRegistrationConfirmModal] = useState(false);
    const [openShare, setOpenShare] = useState(false);

    useEffect(() => {
        setSaved(isSaved);
    }, [isSaved]);

    useEffect(() => {
        setRegistration(isRegistration);
    }, [isRegistration]);

    const recruitmentId = item?.id || item?.temporaryRecruitmentId;
    const displayName = item?.username || "Người chơi";
    const recruitmentQuantity = Number(item?.quantity || 0);
    const createAt = item?.createAt || item?.createdAt;
    const branchName = item?.branchName || "Chưa cập nhật";
    const shareUrl = recruitmentId
        ? `${window.location.origin}/share/temporary-recruitment/${recruitmentId}`
        : window.location.origin;

    const handleBookmark = async () => {
        if (!recruitmentId) {
            showSnackbar("Không tìm thấy mã tin tuyển vãng lai", "error");
            return;
        }

        if (!user) {
            setOpenLoginModal(true);
            return;
        }

        if (saved) {
            await temporaryRecruitmentSavedService.unSaved(recruitmentId);
            setSaved(false);
            if (onUnsaveSuccess) {
                onUnsaveSuccess();
            }
        } else {
            const res = await temporaryRecruitmentSavedService.save(recruitmentId);

            if (res) {
                setSaved(true);
            }
        };

    };

    const handleRegistion = () => {
        if (!recruitmentId) {
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
        setRegistration(true);
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
            <Card
                sx={{
                    borderRadius: 2,
                    boxShadow: 1,
                    background: "#fff",
                    "&:hover": {
                        boxShadow: 3,
                        cursor: "pointer"
                    },
                    transition: "all 0.2s ease-in-out"
                }}
                onClick={() => handleOpenDetail?.(item)}
            >
                <CardHeader
                    avatar={
                        item?.imagePath ? (
                            <Avatar
                                src={resolveBackendUrl(item.imagePath)}
                                alt={displayName}
                                sx={{ width: 40, height: 40 }}
                            />
                        ) : (
                            <Avatar
                                sx={{ width: 40, height: 40, bgcolor: stringToColor(displayName) }}
                            >
                                {displayName.charAt(0).toUpperCase()}
                            </Avatar>
                        )
                    }
                    title={
                        <Typography fontWeight={600} variant="subtitle1">
                            {displayName}
                        </Typography>
                    }
                    subheader={
                        <Typography variant="caption" color="text.secondary">
                            Ngày đăng: {formatDateForDisplay(createAt)}
                        </Typography>
                    }
                />

                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 2,
                            p: 1.5,
                            backgroundColor: "#f8f9fa",
                            borderRadius: 2,
                            border: "1px solid #e9ecef"
                        }}
                    >
                        <EventIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                        <Box>
                            <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.primary.main }}>
                                Ngày tuyển: {formatDateOnly(item?.bookAt)}
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 2,
                            p: 1.5,
                            backgroundColor: "#fff3e0",
                            borderRadius: 2,
                            border: "1px solid #ffcc80"
                        }}
                    >
                        <LocationOnIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="body2" fontWeight={600} color="secondary">
                                Đia điểm:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {branchName}
                            </Typography>
                        </Box>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 1 }}>
                        Số lượng tuyển: <strong>{recruitmentQuantity}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {item?.content || "Chưa có nội dung mô tả."}
                    </Typography>
                </CardContent>

                <CardActions
                    sx={{ display: "flex", justifyContent: "space-between", px: 2, pb: 2 }}
                >

                    <IconButton
                        color="primary"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleBookmark();
                        }}
                    >
                        {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </IconButton>
                        
                    {displayName !== user?.username && (
                        <Button
                            variant="contained"
                            startIcon={registration ? <CheckIcon /> : <WorkIcon />}
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                backgroundColor: registration ? "grey.500" : undefined,
                            }}
                            size="small"
                            disabled={registration}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!registration) {
                                    handleRegistion();
                                }
                            }}
                        >
                            {registration ? "Đã đăng ký" : "Đăng ký"}
                        </Button>
                    )}

                    <IconButton
                        color="primary"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenShare(true);
                        }}>
                        <ShareIcon />
                    </IconButton>
                </CardActions>
            </Card>

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

            {openRegistrationConfirmModal && (
                <RegistrationConfirmModal
                    open={openRegistrationConfirmModal}
                    onClose={() => setOpenRegistrationConfirmModal(false)}
                    item={item}
                    onRegisterSuccess={handleRegisterRecruitmentSuccess}
                />
            )}

            <ShareModal
                open={openShare}
                onClose={() => setOpenShare(false)}
                shareUrl={shareUrl}
            />
        </>
    );
};

export default TemporaryRecruitmentPostItem;
