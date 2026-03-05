import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteImageModal = ({onOpen, onClose, onDelete }) => {
    const handleConfirmDelete = () => {
        onDelete();
        onClose();
    };

    return (
        <>
            <Dialog
                open={onOpen}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                slotProps={{
                    paper: {
                        sx: {
                            p: 2,
                            borderRadius: 3,
                        }
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title">
                    Xác nhận xóa hình ảnh
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn muốn xóa hình ảnh này?<br/> Hành động này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        autoFocus
                        variant="contained"
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DeleteImageModal;