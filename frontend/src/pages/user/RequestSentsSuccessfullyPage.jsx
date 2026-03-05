import React from "react";
import { useNavigate } from "react-router-dom";

import { keyframes } from "@emotion/react";

import { Box, Typography, Button, Container, useTheme, Fade, Grow, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import UserLayout from '../../layouts/user/UserLayout';


const floatAnimation = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
`;

export default function SuccessPage() {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <UserLayout>
            <Container maxWidth="md" sx={{
                my: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80vh',
                position: 'relative',
                overflow: 'hidden'
            }}>

                <Fade in={true} timeout={800}>
                    <Box sx={{
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, #ffffff 100%)`,
                        borderRadius: theme.shape.borderRadius,
                        boxShadow: `0 20px 40px -10px ${theme.palette.primary.main}20`,
                        p: { xs: 3, md: 6 },
                        textAlign: "center",
                        width: '100%',
                        maxWidth: '600px',
                        position: 'relative',
                        border: `1px solid ${theme.palette.divider}`,
                        overflow: 'hidden',
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '6px',
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
                        },
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            width: '100px',
                            height: '100px',
                            background: `radial-gradient(circle, ${theme.palette.primary.light}10 0%, transparent 70%)`,
                            transform: 'translate(50%, 50%)'
                        }
                    }}>
                        <Stack
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                            spacing={2}
                            sx={{
                                mb: 3,
                                justifyContent: 'center'
                            }}
                        >
                            <Grow in={true} timeout={1000}>
                                <Box sx={{
                                    position: 'relative',
                                    display: 'inline-flex',
                                    mb: 4,
                                    animation: `${floatAnimation} 3s ease-in-out infinite`
                                }}>
                                    <CheckCircleIcon sx={{
                                        fontSize: 100,
                                        color: theme.palette.primary.main,
                                        filter: 'drop-shadow(0 8px 20px rgba(59, 130, 246, 0.4))',
                                        zIndex: 1
                                    }} />
                                    <Box sx={{
                                        position: 'absolute',
                                        top: -20,
                                        left: -20,
                                        right: -20,
                                        bottom: -20,
                                        borderRadius: '50%',
                                        background: `radial-gradient(circle, ${theme.palette.primary.light}15 0%, transparent 70%)`,
                                    }} />
                                </Box>
                            </Grow>

                            <Typography variant="h3" gutterBottom sx={{
                                fontWeight: 800,
                                color: theme.palette.text.primary,
                                mb: 2,
                                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                display: 'inline-block',
                                letterSpacing: '-0.5px'
                            }}>
                                Thành công!
                            </Typography>
                        </Stack>
                        <Typography variant="body1" sx={{
                            mb: 4,
                            color: theme.palette.text.secondary,
                            maxWidth: '80%',
                            mx: 'auto',
                            lineHeight: 1.8,
                            fontSize: '1.1rem'
                        }}>
                            Yêu cầu của bạn đã được gửi đi thành công. <br/> Đội ngũ của chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
                        </Typography>

                        <Box sx={{
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <Button
                                variant="contained"
                                onClick={() => navigate("/")}
                                sx={{
                                    px: 5,
                                    py: 1.5,
                                    borderRadius: '50px',
                                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                                    boxShadow: `0 4px 15px ${theme.palette.primary.main}40`,
                                    '&:hover': {
                                        transform: 'translateY(-3px)',
                                        boxShadow: `0 8px 25px ${theme.palette.primary.main}60`,
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:after': {
                                        content: '""',
                                        position: 'absolute',
                                        top: '-50%',
                                        left: '-60%',
                                        width: '200%',
                                        height: '200%',
                                        background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                                        transform: 'rotate(30deg)',
                                        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                    },
                                    '&:hover:after': {
                                        left: '100%'
                                    }
                                }}
                            >
                                Trang chủ
                            </Button>

                        </Box>
                    </Box>
                </Fade>
            </Container>
        </UserLayout>
    );
}