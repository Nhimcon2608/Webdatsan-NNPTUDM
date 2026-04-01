import { useEffect, useState } from "react";

import {
    useTheme,
    Typography,
    Stack,
    Box,
    Paper,
    CircularProgress,
} from "@mui/material";

import TemporaryRecruitmentDetailModal from "../../../components/modal/TemporaryRecruitmentDetailModal";
import TemporaryRecruitmentPostItem from "../../../components/common/TemporaryRecruitmentPostItem";

import temporaryRegistrationService from "../../../services/temporaryRegistrationService";
import temporaryRecruitmentSavedService from "../../../services/temporaryRecruitmentSavedService";
import { formatDateForDisplay, formatDateOnly, formatTimeOnly } from '../../../utils/format';


const RegisteredTemporaryRecruitmentPage = ({user = null}) => {

    const theme = useTheme();

    const [loading, setLoading] = useState(false);
    const [savedIds, setSavedIds] = useState([]);
    const [temporaryRegistration, setTemporaryRegistration] = useState([])
    const [selectedRecruitment, setSelectedRecruitment] = useState(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await temporaryRegistrationService.getAllTemporaryRegistrationOfUser();
            setTemporaryRegistration(res);

            if (user) {
                const temporaryRecruitmentSaved = await temporaryRecruitmentSavedService.getAllTemporaryRecruitmentSavedOfUser();
                setSavedIds(new Set(
                    temporaryRecruitmentSaved
                        .map(item => item.id || item.temporaryRecruitmentId)
                        .filter(Boolean)
                ));
            }
        } catch (error) {
            console.error("Error fetching recruitments saved:", error);
        } finally {
            setLoading(false);
        }

    }

    const handleOpenDetail = (recruitment) => {
        setSelectedRecruitment(recruitment);
        setDetailDialogOpen(true);
    };

    const handleCloseDetail = () => {
        setDetailDialogOpen(false);
        setSelectedRecruitment(null);
    };

    const handleUnsaveSuccess = () => {
        fetchData();
    };

    const handleGetDirections = (address) => {
        const encodedAddress = encodeURIComponent(address);
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
        window.open(googleMapsUrl, '_blank');
    };

    return (
        <>
            <Stack spacing={3} sx={{ p: 2, maxWidth: 800, margin: "auto" }}>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    temporaryRegistration.length > 0 ? (
                        <Stack spacing={2}>
                            {temporaryRegistration.map((item, index) => {
                                const recruitmentId = item?.id || item?.temporaryRecruitmentId || item?.reservationId || `registered-recruitment-${index}`;
                                return (
                                    <TemporaryRecruitmentPostItem
                                        key={recruitmentId}
                                        item={item}
                                        handleOpenDetail={handleOpenDetail}
                                        theme={theme}
                                        isSaved={savedIds.has(recruitmentId)}
                                        isRegistration={true}
                                        user={user}
                                        onUnsaveSuccess={handleUnsaveSuccess}
                                    />
                                );
                            })}
                        </Stack>

                    ) : (
                        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                {"Bạn chưa đăng ký đánh vãng lai"}
                            </Typography>

                        </Paper>
                    )
                )}
            </Stack>


            {detailDialogOpen && (
                <TemporaryRecruitmentDetailModal
                    open={detailDialogOpen}
                    onClose={handleCloseDetail}
                    data={selectedRecruitment}
                    handleGetDirections={handleGetDirections}
                    formatDateForDisplay={formatDateForDisplay}
                    formatDateOnly={formatDateOnly}
                    formatTimeOnly={formatTimeOnly}
                    theme={theme}
                    isRegistration={true}
                    user={user}
                />
            )}
        </>
    )
}

export default RegisteredTemporaryRecruitmentPage;
