import React, { useState } from "react";
import {
    Dialog,
    Box,
    Typography,
    IconButton,
    Button,
    Stack,
    Fade,
    Backdrop,

} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FacebookIcon from "@mui/icons-material/Facebook";
import ChatIcon from "@mui/icons-material/Chat";
import SmsIcon from "@mui/icons-material/Sms";
import ShareIcon from "@mui/icons-material/Share";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LinkIcon from "@mui/icons-material/Link";

import { useSnackbar } from "../../../context/SnackbarContext";

const ShareModal = ({
    open,
    onClose,
    shareUrl = "https://example.com/share/abc123",
    title = "Chia sẻ liên kết"
}) => {
    const [copied, setCopied] = useState(false);
    const { showSnackbar } = useSnackbar();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            showSnackbar("Đã sao chép liên kết vào clipboard!", "success");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            showSnackbar("Không thể sao chép liên kết", "error");
        }
    };

    const handleSystemShare = () => {
        if (navigator.share) {
            navigator.share({
                title: title,
                url: shareUrl
            });
        } else {
            handleCopy();
        }
    };

    const shareFacebook = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            "_blank"
        );
    };

    const shareMessenger = () => {
        window.open(
            `https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}&app_id=YOUR_APP_ID`,
            "_blank"
        );
    };

    const shareZalo = () => {
        window.open(
            `https://zalo.me/share?url=${encodeURIComponent(shareUrl)}`,
            "_blank"
        );
    };

    const shareOptions = [
        {
            icon: <ShareIcon />,
            label: "Thiết bị",
            color: "#6366f1",
            onClick: handleSystemShare
        },
        {
            icon: <FacebookIcon />,
            label: "Facebook",
            color: "#1877F2",
            onClick: shareFacebook
        },
        {
            icon: <ChatIcon />,
            label: "Messenger",
            color: "#0084FF",
            onClick: shareMessenger
        },
        {
            icon: <SmsIcon />,
            label: "Zalo",
            color: "#0068FF",
            onClick: shareZalo
        }
    ];

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 300 }}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 300,
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(2px)'
                    }
                }}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                        overflow: 'visible',
                        mx: 2
                    }
                }}
            >
                <Box
                    sx={{
                        p: 3,
                        pb: 2,
                        position: 'relative',
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                color: 'text.primary',
                                fontSize: '1.25rem'
                            }}
                        >
                            {title}
                        </Typography>
                        <IconButton
                            onClick={onClose}
                            sx={{
                                color: 'text.secondary',
                                backgroundColor: 'action.hover',
                                '&:hover': {
                                    backgroundColor: 'action.selected',
                                    color: 'text.primary'
                                }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{ p: 3, pt: 2 }}>

                    <Stack
                        direction="row"
                        spacing={3}
                        justifyContent="center"
                        sx={{ mb: 4, mt: 1 }}
                    >
                        {shareOptions.map((option, index) => (
                            <Box
                                key={index}
                                onClick={option.onClick}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        '& .share-icon': {
                                            backgroundColor: option.color,
                                            color: 'white',
                                            boxShadow: `0 8px 20px ${option.color}40`
                                        }
                                    }
                                }}
                            >
                                <Box
                                    className="share-icon"
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: '16px',
                                        backgroundColor: 'background.default',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 1.5,
                                        transition: 'all 0.2s ease',
                                        color: 'text.secondary',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                                    }}
                                >
                                    {option.icon}
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: 'text.primary'
                                    }}
                                >
                                    {option.label}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>

                    {/* Link section */}
                    <Box sx={{ mb: 2 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: 'text.secondary',
                                mb: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <LinkIcon sx={{ fontSize: 18 }} />
                            Liên kết chia sẻ
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                backgroundColor: 'background.default',
                                borderRadius: 2,
                                p: 2,
                                border: '1px solid',
                                borderColor: copied ? 'success.main' : 'divider',
                                transition: 'all 0.2s ease',
                                position: 'relative'
                            }}
                        >
                            <Box
                                sx={{
                                    flex: 1,
                                    overflow: 'hidden'
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontSize: '0.875rem',
                                        color: 'text.primary',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        fontWeight: 500
                                    }}
                                >
                                    {shareUrl}
                                </Typography>
                            </Box>

                            <Button
                                onClick={handleCopy}
                                startIcon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
                                variant={copied ? "contained" : "outlined"}
                                color={copied ? "success" : "primary"}
                                size="small"
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    minWidth: 'auto',
                                    px: 2,
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {copied ? "Đã sao chép" : "Sao chép"}
                            </Button>
                        </Box>
                    </Box>

                    {/* Hint text */}
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'text.secondary',
                            textAlign: 'center',
                            display: 'block',
                            fontSize: '0.75rem'
                        }}
                    >
                        Liên kết sẽ hết hạn sau 30 ngày
                    </Typography>
                </Box>
            </Dialog>
        </>
    );
};


export default ShareModal;