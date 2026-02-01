import React from 'react';
import {
    Dialog,
    Box,
    Typography,
    Button
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const ChangeCooperationStatusDialog = ({
    open,
    onClose,
    onConfirm,
    newCooperationStatus,
    branchName
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="cooperation-status-dialog"
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '12px',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                        padding: '16px 0'
                    }
                }
            }}
        >
            <Box sx={{ textAlign: 'center', px: 3, py: 2 }}>
                <Box sx={{
                    display: 'inline-flex',
                    p: 2,
                    bgcolor: newCooperationStatus ? '#e8f5e9' : '#ffebee',
                    borderRadius: '50%',
                    mb: 2
                }}>
                    {newCooperationStatus ? (
                        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 40 }} />
                    ) : (
                        <HighlightOffIcon color="error" sx={{ fontSize: 40 }} />
                    )}
                </Box>

                <Typography id="cooperation-status-dialog" variant="h6" sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: 'text.primary'
                }}>
                    Xác nhận thay đổi trạng thái hợp tác
                </Typography>

                <Typography variant="body1" sx={{
                    color: 'text.secondary',
                    mb: 3
                }}>
                    Bạn có chắc chắn muốn <strong>{newCooperationStatus ? 'kích hoạt' : 'ngừng'}</strong> hợp tác với chi nhánh <strong>{branchName || 'này'}</strong>?
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{
                            minWidth: '120px',
                            borderRadius: '8px',
                            textTransform: 'none',
                            py: 1,
                            px: 3
                        }}
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={onConfirm}
                        variant="contained"
                        color={newCooperationStatus ? "success" : "error"}
                        autoFocus
                        sx={{
                            minWidth: '120px',
                            borderRadius: '8px',
                            textTransform: 'none',
                            py: 1,
                            px: 3,
                            boxShadow: 'none',
                            '&:hover': {
                                boxShadow: 'none'
                            }
                        }}
                    >
                        Xác nhận
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default ChangeCooperationStatusDialog;