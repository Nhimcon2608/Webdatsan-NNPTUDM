import React from "react";

import { Box, Typography, CircularProgress } from "@mui/material";
import ConstructionIcon from '@mui/icons-material/Construction';
import PaletteIcon from '@mui/icons-material/Palette';
import CodeIcon from '@mui/icons-material/Code';

import { motion } from "framer-motion";

const Developing = ({ theme }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <Box
            component={motion.div}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '70vh',
                textAlign: 'center',
                p: 3,
                background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.light}20 100%)`,
                borderRadius: 2
            }}
        >
            <ConstructionIcon
                component={motion.svg}
                variants={itemVariants}
                sx={{
                    fontSize: 80,
                    color: theme.palette.warning.main,
                    mb: 2
                }}
            />

            <Typography
                component={motion.p}
                variants={itemVariants}
                variant="h4"
                gutterBottom
                sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 3
                }}
            >
                Tính năng đang được xây dựng
            </Typography>

            <Typography
                component={motion.p}
                variants={itemVariants}
                variant="body1"
                sx={{
                    maxWidth: '600px',
                    mb: 4,
                    color: theme.palette.text.secondary
                }}
            >
                Chúng tôi đang nỗ lực hoàn thiện trang web để mang đến trải nghiệm tốt nhất cho bạn. Vui lòng quay lại sau!
            </Typography>

            <Box
                component={motion.div}
                variants={itemVariants}
                sx={{ display: 'flex', alignItems: 'center', mb: 4 }}
            >
                <CircularProgress
                    size={24}
                    thickness={4}
                    sx={{ mr: 2, color: theme.palette.primary.main }}
                />
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    Đang tiến hành...
                </Typography>
            </Box>

            <Box
                component={motion.div}
                variants={itemVariants}
                sx={{ display: 'flex', gap: 3 }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <PaletteIcon sx={{ color: theme.palette.secondary.main, mb: 1 }} />
                    <Typography variant="caption">Thiết kế</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CodeIcon sx={{ color: theme.palette.success.main, mb: 1 }} />
                    <Typography variant="caption">Phát triển</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ConstructionIcon sx={{ color: theme.palette.warning.main, mb: 1 }} />
                    <Typography variant="caption">Xây dựng</Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default Developing;