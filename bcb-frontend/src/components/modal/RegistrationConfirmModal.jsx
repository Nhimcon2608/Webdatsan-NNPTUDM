import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Checkbox,
    FormControlLabel,
    Typography,
    IconButton,
    Snackbar,
    Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSnackbar } from "../../../context/SnackbarContext";

import temporaryRegistrationService from "../../services/temporaryRegistrationService";

export default function RegistrationConfirmModal({ open, onClose, onRegisterSuccess, item }) {

    const [checked, setChecked] = useState(false);
    const { showSnackbar } = useSnackbar();
    const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

    const handleSubmit = async () => {
        if (!checked) {
            showSnackbar("Bạn cần xác nhận trước khi đăng ký", "warning");
            return;
        }

        try {

            const res = await temporaryRegistrationService.register(item.id);

            onRegisterSuccess();
            showSnackbar("Đăng ký thành công", "success");
            onClose?.();
        } catch (err) {
            showSnackbar("Lỗi khi đăng ký vãng lai", "error");
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h6" component="span">
                        Xác nhận đăng ký
                    </Typography>

                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>


                <DialogContent dividers>
                    <FormControlLabel
                        control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />}
                        label="Tôi xác nhận đăng ký đánh vãng lai cầu lông"
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Hủy</Button>
                    <Button variant="contained" disabled={!checked} onClick={handleSubmit}>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snack.open}
                autoHideDuration={2500}
                onClose={() => setSnack({ ...snack, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={snack.severity}>{snack.message}</Alert>
            </Snackbar>
        </>
    );
}
