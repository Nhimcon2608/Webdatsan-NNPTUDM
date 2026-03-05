import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Container,
    Avatar,
    Chip,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import theme from '../../theme/Theme';
import UserLayout from '../../layouts/user/UserLayout';
import reservationService from '../../services/reservationService';
import badmintionCourtService from '../../services/badmintonCourtService';
import BookingDetail from '../../components/modal/BookingDetail';

const BookingSuccessfullyPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [reservationData, setReservationData] = useState({});
    const [reservationDetails, setReservationDetails] = useState([]);
    const [remaining, setRemaining] = useState(0);
    const [isAdditionalPlayers, setAdditionalPlayers] = useState(true);
    const [isDirectAccess, setIsDirectAccess] = useState(false);

    const reservationId = location.state?.reservationId;
    const branchInfo = location.state?.branchDetail;

    useEffect(() => {
        if (!location.state?.reservationId) {
            setIsDirectAccess(true);
            navigate('/badminton-branchs', { replace: true });
        }
    }, [location.state, navigate]);

    useEffect(() => {
        if (!location.state?.reservationId) {
            setIsDirectAccess(true);
            navigate('/badminton-branchs', { replace: true });
            return;
        }

        window.history.pushState(null, null, window.location.pathname);
        const handleBackButtonEvent = () => {
            window.history.pushState(null, null, window.location.pathname);
        };
        window.addEventListener('popstate', handleBackButtonEvent);

        return () => {
            window.removeEventListener('popstate', handleBackButtonEvent);
        };
    }, [location.state, navigate]);

    useEffect(() => {
        const fetchReservationData = async () => {
            if (!reservationId) return;

            try {
                const response = await reservationService.getReservationById(reservationId);
                if (response) {
                    setReservationData(response);
                    response.totalPrice ? setRemaining(parseFloat(response.totalPrice) - parseFloat(response.deposit)) : 0;

                }
                await reservationService.sendToManager(reservationId);
            } catch (error) {
                console.error("Error fetching reservation data:", error);
            }
        };
        fetchReservationData();
    }, [reservationId]);

    useEffect(() => {
        const fetchBadmintonCourts = async () => {
            if (!reservationData.branchId) return;

            try {
                const response = await badmintionCourtService.getAllCourtsOfBranchByStatus(reservationData.branchId, 'all');
                if (response) {
                    const courtIdToOrdinal = {};
                    response.forEach(court => {
                        courtIdToOrdinal[court.id] = court.ordinalNumber;
                    });

                    const updatedDetails = reservationData.reservationDetails?.map(detail => ({
                        ...detail,
                        ordinalNumber: courtIdToOrdinal[detail.badmintonCourtId] || null
                    })) || [];

                    setReservationDetails(updatedDetails);
                }
            } catch (error) {
                console.error("Error fetching badminton courts data:", error);
            }
        };

        if (reservationData.branchId) fetchBadmintonCourts();
    }, [reservationData]);

    if (isDirectAccess) {
        return null;
    }

    const handleGoBranchs = () => {
        navigate('/badminton-branchs');
    };

    return (
        <UserLayout>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Box sx={{
                    textAlign: 'center',
                    mb: 4,
                    animation: 'fadeIn 0.5s ease-in'
                }}>
                    <Avatar sx={{
                        bgcolor: theme.palette.primary.light,
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 2
                    }}>
                        <CheckCircle sx={{ fontSize: 50 }} />
                    </Avatar>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                        ĐẶT SÂN THÀNH CÔNG
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Cảm ơn bạn đã đặt sân tại <strong style={{ color: theme.palette.primary.main }}>{branchInfo?.branchName}</strong>
                    </Typography>
                    <Chip
                        label={`Mã đặt sân: ${reservationId}`}
                        variant="outlined"
                        sx={{ mt: 2, fontWeight: 600 }}
                    />
                </Box>

                <BookingDetail
                    reservationData={reservationData}
                    reservationDetails={reservationDetails}
                    branchInfo={branchInfo}
                    status="success"
                />

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 3,
                    flexDirection: { xs: 'column', sm: 'row' }
                }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        sx={{ px: 6, py: 1.5 }}
                        onClick={handleGoBranchs}
                    >
                        Trải nghệm các sân càu lông khác
                    </Button>
                </Box>
            </Container>
        </UserLayout>
    );
};

export default BookingSuccessfullyPage;