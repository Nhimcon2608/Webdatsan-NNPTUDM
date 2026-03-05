import React, { useState, useEffect } from "react";
import {
    useTheme,
    Button,
    Box,
    List,
    useMediaQuery,
    Container,
    Drawer,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import DoneIcon from '@mui/icons-material/Done';
import ListIcon from '@mui/icons-material/List';
import MenuIcon from '@mui/icons-material/Menu';

import UserLayout from "../../../layouts/user/UserLayout"
import DrawerItem from "../../../components/common/DrawerItem";


import AllTemporaryRecruitment from "./AllTemporaryRecruitmentPage";
import SavedTemporaryRecruitmentPage from "./SavedTemporaryRecruitmentPage";
import RegisteredTemporaryRecruitmentPage from "./RegisteredTemporaryRecruitmentPage";

import userService from "../../../services/userService";
import authService from "../../../services/authService";

import { useAuth } from "../../../../context/AuthContext";
import { useSnackbar } from "../../../../context/SnackbarContext";
import LoginModal from "../../../components/modal/LoginModal";



const TemporaryRecruitment = () => {
    const theme = useTheme();
    const { showSnackbar } = useSnackbar();

    const [activeTab, setActiveTab] = useState('all');
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, login } = useAuth();
    const [profileData, setProfileData] = useState();
    const [openLoginModal, setOpenLoginModal] = useState(false);

    useEffect(() => {
        if (!user || !user.id) {
            return;
        }

        if (user.role !== "USER") {
            return;
        }

        const fetchProfile = async () => {
            try {
                const profile = await userService.getProfile(user.id);
                setProfileData(profile.data);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };

        fetchProfile();
    }, [user]);

    useEffect(() => {
        if (activeTab === "registered" && !user) {
            setOpenLoginModal(true);
            setActiveTab("all");
        }
    }, [activeTab, user]);


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    const handleLoginSuccess = async (response) => {
        localStorage.setItem("authToken", response.token);
        const userLogged = await login();
        setOpenLoginModal(false);
    };

    const handleRegisterSuccess = () => {
        setOpenLoginModal(false);
        showSnackbar("Đăng ký thành công", "success");
    };

    const drawer = (
        <List sx={{ bgcolor: theme.palette.background.paper, width: '100%' }}>
            <DrawerItem
                icon={<ListIcon fontSize="small" />}
                label="Các tin tuyển vãng lai"
                tabKey="all"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isMobile={isMobile}
                setMobileOpen={setMobileOpen}
                theme={theme}
            />
            <DrawerItem
                icon={<BookmarkBorderIcon fontSize="small" />}
                label="Tin dã lưu"
                tabKey="saved"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isMobile={isMobile}
                setMobileOpen={setMobileOpen}
                theme={theme}
                user={user}
                requireLogin={true}
                setOpenLoginModal={setOpenLoginModal}
            />
            <DrawerItem
                icon={<DoneIcon fontSize="small" />}
                label="Đã đang ký"
                tabKey="registered"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isMobile={isMobile}
                setMobileOpen={setMobileOpen}
                theme={theme}
                user={user}
                requireLogin={true}
                setOpenLoginModal={setOpenLoginModal}  
            />
        </List>
    );

    const renderContent = () => {
        switch (activeTab) {
            case "all":
                return <AllTemporaryRecruitment user={user}  />;

            case "saved":
                return <SavedTemporaryRecruitmentPage user={user}/>;

            case "registered":
                return <RegisteredTemporaryRecruitmentPage user={user}/>;

            default:
                return null;
        }
    };


    return (
        <>
            <UserLayout>
                <Container maxWidth="lg" sx={{ py: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    {isMobile && (
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleDrawerToggle}
                            startIcon={<MenuIcon />}
                            sx={{
                                mb: 2,
                                alignSelf: 'flex-start',
                                borderRadius: 2,
                                boxShadow: 2
                            }}
                        >
                            Menu
                        </Button>
                    )}

                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true,
                        }}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                            '& .MuiDrawer-paper': {
                                boxSizing: 'border-box',
                                width: 250,
                                boxShadow: '0px 3px 15px rgba(0,0,0,0.1)',
                                borderRight: '1px solid rgba(0,0,0,0.08)'
                            },
                        }}
                    >
                        {drawer}
                    </Drawer>

                    <Box
                        sx={{
                            flexShrink: 0,
                            display: { xs: 'none', md: 'block' },
                            overflow: 'auto'
                        }}
                    >
                        {drawer}
                    </Box>

                    <Box
                        sx={{
                            flexGrow: 1,
                            overflow: 'hidden'
                        }}
                    >
                        {renderContent()}
                    </Box>
                </Container>
            </UserLayout>

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

export default TemporaryRecruitment