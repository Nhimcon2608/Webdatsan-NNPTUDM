import React from 'react';
import { TableCell, Chip } from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Pending as PendingIcon,
    Cancel as CancelIcon,
    Send as SendIcon
} from '@mui/icons-material';

// đã gửi yêu cầu: sent
// chờ duyệt: pending
// đã duyệt: approved
// từ chối: refused

const StatusCell = ({ status }) => {

    const getStatusConfig = () => {
        switch (status) {
            case 'sent':
                return {
                    icon: <SendIcon fontSize="small" />,
                    color: 'primary',
                    label: 'Đã gửi',
                    bgColor: 'rgba(25, 118, 210, 0.1)'
                };
            case 'pending':
                return {
                    icon: <PendingIcon fontSize="small" />,
                    color: 'warning',
                    label: 'Chờ duyệt',
                    bgColor: 'rgba(255, 152, 0, 0.1)'
                };
            case 'approved':
                return {
                    icon: <CheckCircleIcon fontSize="small" />,
                    color: 'success',
                    label: 'Đã duyệt',
                    bgColor: 'rgba(46, 125, 50, 0.1)'
                };
            case 'refused':
                return {
                    icon: <CancelIcon fontSize="small" />,
                    color: 'error',
                    label: 'Từ chối',
                    bgColor: 'rgba(211, 47, 47, 0.1)'
                };
            default:
                return {
                    icon: null,
                    color: 'default',
                    label: status,
                    bgColor: 'rgba(0, 0, 0, 0.1)'
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <TableCell>
            <Chip
                icon={config.icon}
                label={config.label}
                color={config.color}
                variant="outlined"
                sx={{
                    backgroundColor: config.bgColor,
                    border: 'none',
                    fontSize: '0.75rem',
                    padding: '4px 8px'
                }}
            />
        </TableCell>
    );
};

export default StatusCell;