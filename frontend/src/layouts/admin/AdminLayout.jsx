import React, { useState } from 'react';
import { Outlet } from "react-router-dom";
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import adminTheme from '../../theme/adminTheme';
import Sidebar from './SideBar';
import Topbar from './TopBar';


const Layout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const drawerWidth = 250;
    const collapsedWidth = 70;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <ThemeProvider theme={adminTheme}>
            <Box sx={{ display: 'flex' }}>
                <Topbar
                    handleDrawerToggle={handleDrawerToggle}
                    drawerWidth={sidebarCollapsed ? collapsedWidth : drawerWidth}
                    sidebarCollapsed={sidebarCollapsed}
                    toggleSidebar={toggleSidebar}
                />
                <Sidebar
                    mobileOpen={mobileOpen}
                    handleDrawerToggle={handleDrawerToggle}
                    drawerWidth={drawerWidth}
                    collapsedWidth={collapsedWidth}
                    sidebarCollapsed={sidebarCollapsed}
                    toggleSidebar={toggleSidebar}
                />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 2,
                        width: {
                            sm: `calc(100% - ${sidebarCollapsed ? collapsedWidth : drawerWidth}px)`
                        },
                        transition: theme => theme.transitions.create(['margin', 'width'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                        marginTop: 8
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default Layout;