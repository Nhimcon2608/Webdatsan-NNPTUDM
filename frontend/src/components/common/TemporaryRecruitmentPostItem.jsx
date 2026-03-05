import { useState } from "react";
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
import { useSnackbar } from "../../../context/SnackbarContext";


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

    const [saved, setSaved] = useState(isSaved);
    const [registration, setRegistration] = useState(isRegistration);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [openRegistrationConfirmModal, setOpenRegistrationConfirmModal] = useState(false);
    const [openShare, setOpenShare] = useState(false);

    // console.log("isSaved: ", isSaved);
    // console.log("isRegistration: ", isRegistration);

    const handleBookmark = async (e) => {
        if (!user) {
            setOpenLoginModal(true);
            return;
        }

        if (saved) {
            await temporaryRecruitmentSavedService.unSaved(item.id);
            setSaved(false);
            if (onUnsaveSuccess) {
                onUnsaveSuccess();
            }
        } else {
            const res = await temporaryRecruitmentSavedService.save(item.id);

            if (res) {
                setSaved(true);
            }
        };

    };

    const handleRegistion = (e) => {
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
        const userLogged = await login();
        setOpenLoginModal(false);
    };

    const handleRegisterSuccess = () => {
        setOpenLoginModal(false);
        showSnackbar("Đăng ký thành công", "success");
    };

    const shareUrl = `${window.location.origin}/share/temporary-recruitment/${item.id}`;
    // console.log("shareUrl: ", shareUrl);

    return (
        <>
            <Card
                key={item.id}
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
                onClick={() => handleOpenDetail(item)}
            >
                <CardHeader
                    avatar={
                        item.imagePath ? (
                            <Avatar
                                src={`${import.meta.env.VITE_API_URL}/${item.imagePath}`}
                                alt={item.username}
                                sx={{ width: 40, height: 40 }}
                            />
                        ) : (
                            <Avatar
                                sx={{ width: 40, height: 40, bgcolor: stringToColor(item.username) }}
                            >
                                {item.username?.charAt(0).toUpperCase()}
                            </Avatar>
                        )
                    }
                    title={
                        <Typography fontWeight={600} variant="subtitle1">
                            {item.username}
                        </Typography>
                    }
                    subheader={
                        <Typography variant="caption" color="text.secondary">
                            Ngày đăng: {formatDateForDisplay(item.createAt)}
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
                                Ngày tuyển: {formatDateOnly(item.bookAt)}
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
                                {item.branchName}
                            </Typography>
                        </Box>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 1 }}>
                        Số lượng tuyển: <strong>{item.quantity}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {item.content}
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
                        
                    {item.username !== user?.username && (
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
                        color="theme.palette.primary.main"
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
