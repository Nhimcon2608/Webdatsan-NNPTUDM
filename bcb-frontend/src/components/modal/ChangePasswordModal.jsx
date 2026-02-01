import React, { useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import PasswordIcon from "@mui/icons-material/Password";

import { useSnackbar } from "../../../context/SnackbarContext";

import authService from "../../services/authService";

const ChangePasswordModal = ({ open, onClose }) => {
    const theme = useTheme();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { showSnackbar } = useSnackbar();

    const handleSubmit = (e) => {
        e.preventDefault();

        const changePassword = async () => {
            try {
                if (newPassword !== confirmPassword) {
                    showSnackbar("Mật khẩu mới không khớp", "error");
                    return;
                }

                await authService.changePassword({
                    oldPassword: currentPassword,
                    newPassword: newPassword,
                });

                showSnackbar("Đổi mật khẩu thành công", "success");
            } catch (err) {
                showSnackbar("Đổi mật khẩu thất bại: " + err.message, "error");
            }
        };

        // console.log({
        //     currentPassword,
        //     newPassword,
        //     confirmPassword
        // });

        changePassword();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: theme.shape.borderRadius
                    }
                }
            }}
        >
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <PasswordIcon color="primary" />
                    <Typography variant="h6">Đổi mật khẩu</Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Mật khẩu hiện tại"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Mật khẩu mới"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Xác nhận mật khẩu mới"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Button onClick={onClose} variant="outlined" sx={{ mr: 2 }}>
                    Hủy
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                >
                    Lưu thay đổi
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChangePasswordModal;