// src/components/layouts/user/UserLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
	ThemeProvider,
	CssBaseline,
	Box,
	Fab,
	Fade,
} from "@mui/material";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import { useAuth } from "../../../context/AuthContext";
import { getTheme } from "../../theme/Theme";

const UserLayout = ({ children }) => {
	const { user } = useAuth();
	const navigate = useNavigate();

	// Dark mode state
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const saved = localStorage.getItem("darkMode");
		if (saved !== null) return saved === "true";
		return window.matchMedia("(prefers-color-scheme: dark)").matches;
	});

	const toggleDarkMode = () => {
		const newMode = !isDarkMode;
		setIsDarkMode(newMode);
		localStorage.setItem("darkMode", newMode);
	};

	// Theo dõi thay đổi hệ thống (nếu chưa có cài đặt thủ công)
	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handler = (e) => {
			if (localStorage.getItem("darkMode") === null) {
				setIsDarkMode(e.matches);
			}
		};
		mediaQuery.addEventListener("change", handler);
		return () => mediaQuery.removeEventListener("change", handler);
	}, []);

	// Expose toggle cho Header (nếu cần)
	useEffect(() => {
		window.__toggleDarkMode = toggleDarkMode;
		window.__isDarkMode = isDarkMode;
	}, [isDarkMode]);

	// Redirect theo role
	useEffect(() => {
		if (user?.role === "ADMIN") navigate("/admin/dashboard");
		if (user?.role === "MANAGER") navigate("/manager/dashboard");
	}, [user, navigate]);

	// Cuộn lên đầu trang
	const [scrollY, setScrollY] = useState(0);
	useEffect(() => {
		const handleScroll = () => setScrollY(window.scrollY);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// ✅ Lấy theme theo mode
	const theme = getTheme(isDarkMode ? "dark" : "light");

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Header />
			<Box component="main">{children || <Outlet />}</Box>
			<Footer />

			{/* Nút scroll to top */}
			<Box
				sx={{
					position: "fixed",
					bottom: { xs: 20, sm: 30 },
					right: { xs: 16, sm: 30 },
					zIndex: 1300,
				}}
			>
				<Fade in={scrollY > 500} timeout={400}>
					<Fab
						color="primary"
						size="medium"
						onClick={() =>
							window.scrollTo({ top: 0, behavior: "smooth" })
						}
						sx={{
							boxShadow: isDarkMode
								? "0 8px 25px rgba(0,0,0,0.6)"
								: "0 8px 25px rgba(59, 130, 246, 0.3)",
							backdropFilter: "blur(12px)",
							border: isDarkMode
								? "1px solid rgba(255,255,255,0.1)"
								: "none",
							"&:hover": {
								transform: "translateY(-4px)",
								boxShadow: isDarkMode
									? "0 12px 35px rgba(0,0,0,0.7)"
									: "0 12px 35px rgba(59, 130, 246, 0.4)",
							},
							transition: "all 0.35s ease",
						}}
					>
						<ArrowUpward sx={{ fontSize: 28 }} />
					</Fab>
				</Fade>
			</Box>
		</ThemeProvider>
	);
};

export default UserLayout;
