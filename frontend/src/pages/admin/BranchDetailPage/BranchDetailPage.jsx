import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
    Box,
    Container,
    CircularProgress,
    Typography,
    Button,
    Stack,
    Switch,
    alpha,
    FormControlLabel
} from '@mui/material';

import { useSnackbar } from '../../../../context/SnackbarContext';

import adminTheme from '../../../theme/adminTheme';

import branchService from '../../../services/branchServce';
import badmintonCourtService from '../../../services/badmintonCourtService';
import reviewService from '../../../services/reviewService';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ChangeCooperationStatusDialog from './ChangeCooperationStatusDialog';

import BranchDetail from './/BranchDetail';


const BranchDetailPage = () => {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const { branchId } = useParams();
    const [branch, setBranch] = useState(null);
    const [courts, serCourts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshFlag, setRefreshFlag] = useState(false);

    const [openChangeCopperatedConfirmDialog, setOpenChangeCopperatedConfirmDialog] = useState(false);
    const [newCooperationStatus, setNewCooperationStatus] = useState(branch?.cooperated || false);

    useEffect(() => {
        const fetchBranchDetail = async () => {
            try {
                const branchResponse = await branchService.getBranchById(branchId);
                setBranch(branchResponse);

                const courtsResponse = await badmintonCourtService.getAllCourtsOfBranchByStatus(branchId, 'all');
                serCourts(courtsResponse);

                const reviewResponse = await reviewService.getAllReviewsOfBranch(branchId);
                setReviews(reviewResponse);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching branch details:', error);
                setLoading(false);
            }
        };

        fetchBranchDetail();
    }, [branchId, refreshFlag]);

    // console.log('branch: ', branch);
    // console.log('courts: ', courts);
    // console.log('review: ', reviews);

    const handleCooperationChange = (event) => {
        setNewCooperationStatus(event.target.checked);
        setOpenChangeCopperatedConfirmDialog(true);
    };

    const handleConfirmCooperationChange = async () => {
        try {
            await branchService.changeCooperate(branch.id, {cooperated: newCooperationStatus});
            setOpenChangeCopperatedConfirmDialog(false);
            setRefreshFlag(prev => !prev);
        } catch (error) {
            showSnackbar('Đã xảy ra lỗi khi cập nhật trạng thái hợp tác', 'error');
        }
    };

    const handleCloseChangeCopperatedConfirmDialog = () => {
        setNewCooperationStatus(branch?.cooperated || false);
        setOpenChangeCopperatedConfirmDialog(false);
    };

    if (loading) {
        return (
            <Container maxWidth="xl" style={{ textAlign: 'center', padding: '2rem' }} sx={{ py: 3 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (!branch) {
        return (
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Typography variant="h5" color="error">
                    Không tìm thấy chi nhánh
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/admin/branches')}
                    sx={{
                        borderRadius: '10px',
                        px: 2,
                        py: 0.75,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                    startIcon={<ArrowBackIcon />}
                >
                    Quay lại danh sách
                </Button>

                <Stack direction="row" spacing={2}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={branch?.cooperated || false}
                                onChange={handleCooperationChange}
                                color="primary"
                            />
                        }
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <HandshakeIcon sx={{ mr: 1 }} />
                                <Typography variant="body1" fontWeight={500} fontSize={15}>
                                    {branch?.cooperated ? 'Đang hợp tác' : 'Ngừng hợp tác'}
                                </Typography>
                            </Box>
                        }
                        sx={{
                            pl: 0,
                            px: 2,
                            py: 0,
                            borderRadius: '10px',
                            bgcolor: branch?.cooperated ? alpha(adminTheme.palette.success.main, 0.1) : alpha(adminTheme.palette.error.main, 0.1),
                            border: 1,
                            borderColor: branch?.cooperated ? adminTheme.palette.success.main : adminTheme.palette.error.main
                        }}
                    />
                </Stack>
            </Box>

            <BranchDetail theme={adminTheme} branch={branch} badmintonCourts={courts} reviews={reviews} />

            <ChangeCooperationStatusDialog
                open={openChangeCopperatedConfirmDialog}
                onClose={handleCloseChangeCopperatedConfirmDialog}
                onConfirm={handleConfirmCooperationChange}
                newCooperationStatus={newCooperationStatus}
                branchName={branch?.branchName}
            />
        </Container>
    );
};

export default BranchDetailPage;