import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    Typography,
    ListItemButton,
    styled,
    alpha,
    useTheme,
    Avatar
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Handshake as HandshakeIcon,
    ManageAccounts as ManageAccountsIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import { ChevronsRightLeft } from 'lucide-react';

import { stringToColor } from '../../utils/stringToColor';

import { useAuth } from '../../../context/AuthContext';
import authService from '../../services/authService';


const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    margin: '4px 8px',
    '&.Mui-selected': {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.18),
        },
        '& .MuiListItemIcon-root': {
            color: theme.palette.primary.main,
        },
        '& .MuiListItemText-primary': {
            color: theme.palette.primary.main,
            fontWeight: 600,
        },
    },
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
}));

const Logo = ({ collapsed }) => (
    <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 2,
        overflow: 'hidden',
        gap: 1
    }}>
        <Box sx={{
            width: collapsed ? '100%' : 'auto',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <img
                src='/images/logo.png'
                alt='Logo'
                style={{
                    height: '40px',
                    width: 'auto',
                    objectFit: 'contain'
                }}
            />
        </Box>
        {!collapsed && (
            <Typography variant="h6" fontWeight="bold" color="primary">
                Admin panel
            </Typography>
        )}

    </Box>
);

const Sidebar = ({
    mobileOpen,
    handleDrawerToggle,
    drawerWidth = 260,
    collapsedWidth = 72,
    sidebarCollapsed,
}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const location = useLocation();
    const currentPath = location.pathname.split('/')[2] || 'dashboard';

    const handleLogoutClick = async () => {

        try {
            await authService.logout();
        } catch (error) {
            console.error('Error during logout', error);
        } finally {
            await logout();
            navigate('/login');
        }
    }

    const menuItems = [
        {
            text: 'Tổng quan',
            path: 'dashboard',
            icon: <DashboardIcon />
        },
        {
            text: 'Quản lý yêu cầu',
            path: 'partnership-request',
            icon: <HandshakeIcon />
        },
        {
            text: 'Các chi nhánh',
            path: 'branches',
            icon: <ChevronsRightLeft />
        },
        {
            text: 'Quản lý tài khoản',
            path: 'accounts',
            icon: <ManageAccountsIcon />
        }
    ];

    const drawerContent = (
        <>
            <Logo collapsed={sidebarCollapsed} />
            <Divider sx={{ mx: 2 }} />
            <List component="nav" sx={{ px: 1 }}>
                {menuItems.map((item) => (
                    <StyledListItemButton
                        key={item.text}
                        component={Link}
                        to={`/admin/${item.path}`}
                        selected={currentPath === item.path}
                        sx={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                    >
                        <ListItemIcon sx={{
                            minWidth: 'auto',
                            mr: sidebarCollapsed ? 0 : 2,
                            justifyContent: 'center'
                        }}>
                            {item.icon}
                        </ListItemIcon>
                        {!sidebarCollapsed && <ListItemText primary={item.text} />}
                    </StyledListItemButton>
                ))}
            </List>
            <Divider sx={{ mx: 2, mt: 'auto' }} />
            <List sx={{ px: 1 }}>
                <StyledListItemButton
                    component={Link}
                    to="/admin/my-account"
                    selected={currentPath === 'my-account'}
                    sx={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                >
                    <ListItemIcon sx={{
                        minWidth: 'auto',
                        mr: sidebarCollapsed ? 0 : 2,
                        justifyContent: 'center'
                    }}>
                        {user.imagePath ?
                            <Avatar src={`${import.meta.env.VITE_API_URL}/${user.imagePath}`} alt={user.username} />

                            : <Avatar style={{ backgroundColor: stringToColor(user.username) }}>
                                {user.username.charAt(0).toUpperCase()}
                            </Avatar>
                        }
                    </ListItemIcon>
                    {!sidebarCollapsed && <ListItemText primary={user.username} />}
                </StyledListItemButton>
                <StyledListItemButton
                    component={Link}
                    onClick={handleLogoutClick}
                    selected={currentPath === 'logout'}
                    sx={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                >
                    <ListItemIcon sx={{
                        minWidth: 'auto',
                        mr: sidebarCollapsed ? 0 : 2,
                        justifyContent: 'center'
                    }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    {!sidebarCollapsed && <ListItemText primary="Đăng xuất" />}
                </StyledListItemButton>
            </List>
        </>
    );

    return (
        <Box
            component="nav"
            sx={{
                width: { sm: sidebarCollapsed ? collapsedWidth : drawerWidth },
                flexShrink: { sm: 0 },
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
            }}
        >
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
                        boxShadow: '0 8px 10px -5px rgba(0,0,0,0.1)'
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: sidebarCollapsed ? collapsedWidth : drawerWidth,
                        borderRight: `1px solid ${theme.palette.divider}`,
                        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
                        overflowX: 'hidden',
                        transition: theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                    },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};

export default Sidebar;