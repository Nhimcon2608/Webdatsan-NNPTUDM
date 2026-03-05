import React from 'react';

import { TableCell, Button, Menu, MenuItem } from '@mui/material';
import {
    Check as CheckIcon,
    Visibility as VisibilityIcon,
    SettingsBackupRestore as RestoreIcon,
    MoreVert as MoreIcon,
    Close as CloseIcon,
    Send as SendIcon
} from '@mui/icons-material';


const ActionButton = ({ status, onApprove, onAccept, onViewDetail, onCancel }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    if (status === 'approved') {
        return (
            <Button
                variant="outlined"
                size="small"
                color="info"
                startIcon={<VisibilityIcon />}
                onClick={onViewDetail}
            >
                Xem chi tiết
            </Button>
        );
    }

    if (status === 'refused') {
        return (
            <>
                <Button
                    variant="outlined"
                    size="small"
                    color="secondary"
                    endIcon={<MoreIcon />}
                    onClick={handleClick}
                >
                    Thao tác
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    slotProps={{
                        paper: {
                            sx: {
                                borderRadius: 3,
                            },
                        }
                    }}
                >
                    <MenuItem onClick={() => {
                        onAccept();
                        handleClose();
                    }}>
                        <CheckIcon fontSize="small" sx={{ mr: 1 }} />
                        Chấp nhận
                    </MenuItem>
                    <MenuItem onClick={() => {
                        onApprove();
                        handleClose();
                    }}>
                        <RestoreIcon fontSize="small" sx={{ mr: 1 }} />
                        Duyệt lại
                    </MenuItem>
                </Menu>
            </>
        );
    }

    return (
        <>
            <Button
                variant="outlined"
                size="small"
                color="primary"
                endIcon={<MoreIcon />}
                onClick={handleClick}
            >
                Thao tác
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: 3,
                        },
                    }
                }}
            >
                {status === 'sent' && (
                    <MenuItem onClick={() => {
                        onApprove();
                        handleClose();
                    }}>
                        <SendIcon fontSize="small" sx={{ mr: 1 }} />
                        Đi duyệt
                    </MenuItem>
                )}
                {status === 'pending' && (
                    <MenuItem onClick={() => {
                        onAccept();
                        handleClose();
                    }}>
                        <CheckIcon fontSize="small" sx={{ mr: 1 }} />
                        Chấp nhận
                    </MenuItem>
                )}
                <MenuItem onClick={() => {
                    onCancel();
                    handleClose();
                }}>
                    <CloseIcon fontSize="small" sx={{ mr: 1 }} />
                    Hủy
                </MenuItem>
            </Menu>
        </>
    );
};

export default ActionButton;