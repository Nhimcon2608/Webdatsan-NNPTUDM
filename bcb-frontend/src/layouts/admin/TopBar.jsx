import React from 'react';

import { useLocation } from 'react-router-dom';

import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';


const pageTitles = {
    dashboard: "Tổng quan",
    "partnership-request": "Quản lý yêu cầu",
    branches: "Các chi nhánh",
    accounts: "Quản lý tài khoản",
    "my-account": "Tài khoản của tôi",
    logout: "Đăng xuất",
};

const Topbar = ({ handleDrawerToggle, drawerWidth, sidebarCollapsed, toggleSidebar }) => {

    const location = useLocation();
    const currentPath = location.pathname.split('/')[2] || 'dashboard';

    const title = pageTitles[currentPath] || 'Cài đặt';

    return (
        <AppBar
            position="fixed"
            sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
                transition: theme => theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <IconButton
                    color="inherit"
                    aria-label="collapse sidebar"
                    edge="start"
                    onClick={toggleSidebar}
                    sx={{ mr: 2, display: { xs: 'none', sm: 'flex' } }}
                >
                    {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                    {title}
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;