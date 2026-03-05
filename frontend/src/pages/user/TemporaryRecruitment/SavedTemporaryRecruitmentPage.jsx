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

import temporaryRecruitmentSavedService from "../../../services/temporaryRecruitmentSavedService";
import temporaryRegistrationService from "../../../services/temporaryRegistrationService";
import { formatDateForDisplay, formatDateOnly, formatTimeOnly } from '../../../utils/format';


const SavedTemporaryRecruitmentPage = ({user = null}) => {

    const theme = useTheme();

    const [loading, setLoading] = useState(false);
    const [temporaryRecruitmentSaved, setTemporaryRecruitmentSaved] = useState([])
    const [selectedRecruitment, setSelectedRecruitment] = useState(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [registrationIds, setRegistrationIds] = useState(new Set());

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await temporaryRecruitmentSavedService.getAllTemporaryRecruitmentSavedOfUser();
            setTemporaryRecruitmentSaved(res);

            const temporaryRegistration = await temporaryRegistrationService.getAllTemporaryRegistrationOfUser();
            setRegistrationIds(new Set(temporaryRegistration.map(item => item.id)));
            
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
                    temporaryRecruitmentSaved.length > 0 ? (
                        <Stack spacing={2}>
                            {temporaryRecruitmentSaved.map((item) => (
                                <TemporaryRecruitmentPostItem
                                    key={item.id}
                                    item={item}
                                    handleOpenDetail={handleOpenDetail}
                                    theme={theme}
                                    isSaved={true}
                                    isRegistration={registrationIds.has(item.id)}
                                    user={user}
                                    onUnsaveSuccess={handleUnsaveSuccess}
                                />
                            ))}
                        </Stack>

                    ) : (
                        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                {"Không có tin vãng lai nào dược lưu"}
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
                />
            )}
        </>
    )
}

export default SavedTemporaryRecruitmentPage;