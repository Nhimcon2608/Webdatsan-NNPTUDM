import React, { useState, forwardRef, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Paper,
    Divider,
    Grid,
    Button,
    TextField,
    Collapse,
    Stack,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Chip,
    Switch,
    IconButton
} from '@mui/material';
import {
    SportsSoccer,
    LocationOn,
    Phone,
    Email,
    CalendarToday,
    Person,
    Payments,
    AccessTime,
    Group,
    Edit,
    ExpandLess,
    ExpandMore
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';

import dayjs from 'dayjs';

import { formatVND } from '../../utils/format';

import theme from '../../theme/Theme';

import badmintonCourtService from '../../services/badmintonCourtService';
import temporaryRecruitmentService from '../../services/temporaryRecruitmentService';


const BookingDetail = forwardRef(({
    reservationData,
    reservationDetails,
    branchInfo,
    status = 'success',
    isModal = false,
    onClose
}, ref) => {
    const [remaining, setRemaining] = useState(0);
    const [showRecruitForm, setShowRecruitForm] = useState(false);

    const [recruitments, setRecruitments] = useState([]);
    const [currentForm, setCurrentForm] = useState({
        quantity: '',
        content: '',
        available: false
    });
    const [editingIndex, setEditingIndex] = useState(null);
    const [errors, setErrors] = useState({});
    const [details, setDetails] = useState(reservationDetails || []);

    useEffect(() => {
        if (!reservationData) return;

        const fetchCourt = async () => {
            try {
                const courtsData = await badmintonCourtService.getAllCourtsOfBranchByStatus(branchInfo.id, 'all');

                const courtMap = {};
                courtsData.forEach(c => {
                    courtMap[c.id] = c.ordinalNumber;
                });

                setDetails(prev => prev.map(detail => {
                    if (!detail.ordinalNumber && detail.badmintonCourtId) {
                        return {
                            ...detail,
                            ordinalNumber: courtMap[detail.badmintonCourtId] || null
                        };
                    }
                    return detail;
                }));
            } catch (err) {
                console.error('fetch courts error', err);
            }
        };

        const fetchTemporaryRecruitment = async () => {
            try {
                const tempoRecuitData = await temporaryRecruitmentService.getByReservation(reservationData.id);
                const normalized = (tempoRecuitData || []).map(r => ({ ...r, available: Boolean(r.available) }));
                setRecruitments(normalized);
            } catch (err) {
                console.error('fetch temporary recruitment error', err);
            }
        };


        if (isModal) {
            fetchCourt();
            fetchTemporaryRecruitment();
        }

        if (reservationData?.totalPrice) {
            setRemaining(parseFloat(reservationData.totalPrice) - parseFloat(reservationData.deposit || 0));
        }

    }, [reservationData, branchInfo, isModal]);

    useEffect(() => {
        if (reservationDetails) {
            setDetails(reservationDetails);
        }
    }, [reservationDetails]);


    // console.log('details: ', details);

    const getStatusColor = () => {
        switch (status) {
            case 'cancel':
                return theme.palette.error.main;
            case 'checked':
                return theme.palette.primary.light;
            case 'finish':
                return theme.palette.primary.light;
            case 'waiting':
            default:
                return theme.palette.primary.main;
        }
    };

    const openEditForm = (index) => {
        setCurrentForm(recruitments[index]);
        setEditingIndex(index);
        setErrors({});
        setShowRecruitForm(true);
    };

    const handleRecruitInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'quantity') {
            let v = value;
            if (v === '') {
                setCurrentForm(prev => ({ ...prev, [name]: '' }));
                return;
            }

            const num = Number(v);
            if (isNaN(num)) return;
            if (num < 1) v = 1;
            if (num > 20) v = 20;
            setCurrentForm(prev => ({ ...prev, [name]: v }));
            return;
        }

        setCurrentForm(prev => ({ ...prev, [name]: value }));
    };

    const handleRecruitToggleActive = (checked) => {
        setCurrentForm(prev => ({ ...prev, available: checked }));
    };

    const handleChangeStatus = async (id, checked) => {
        try {
            await temporaryRecruitmentService.changeStatus(id, checked);
            setRecruitments(prev => prev.map(r => r.id === id ? { ...r, available: checked } : r));
        } catch (err) {
            console.error('change recruitment status error', err);
        }
    };

    const handleSaveRecruitment = async () => {
        const newErrors = {};
        if (!currentForm.quantity || currentForm.quantity === '') newErrors.quantity = 'Vui lòng nhập số lượng tuyển';

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const payload = {
            quantity: Number(currentForm.quantity),
            available: Boolean(currentForm.available),
            content: currentForm.content || '',
            reservationId: reservationData?.id || null,
        };

        try {
            if (editingIndex === null) {
                const res = await temporaryRecruitmentService.create(payload);
                if (res) {
                    setRecruitments(prev => [...prev, { ...res, available: Boolean(res.available) }]);
                }
            } else {
                const res = await temporaryRecruitmentService.update(recruitments[editingIndex].id, payload)
                setRecruitments(prev => {
                    const updated = [...prev];
                    updated[editingIndex] = res
                        ? { ...res, available: Boolean(res.available) }
                        : { ...updated[editingIndex], ...payload };
                    return updated;
                });
            }

            setShowRecruitForm(false);
            setCurrentForm({ quantity: '', content: '', available: false });
            setEditingIndex(null);
        } catch (err) {
            console.error('save recruitment error', err);
        }
    };

    const handleCancelRecruit = () => {
        setShowRecruitForm(false);
        setCurrentForm({ quantity: '', content: '', available: false });
        setEditingIndex(null);
        setErrors({});
    };

    const RecruitmentItem = React.memo(({ item, index }) => (
        <Paper elevation={0} sx={{ p: 2, mt: 1, borderRadius: 1, border: `1px solid ${theme.palette.divider}` }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="body2">Số lượng</Typography>
                    <Typography variant="body1" fontWeight={600}>{item.quantity}</Typography>
                </Grid>
                {reservationData.status === 'waiting' ? (
                    <>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="body2">Trạng thái</Typography>
                            <Typography variant="body1" fontWeight={600}>{item.available ? 'Đang tuyển': 'Ngưng tuyển'}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Button size="small" startIcon={<Edit />} onClick={() => openEditForm(index)}>Chỉnh sửa</Button>
                        </Grid>
                    </>
                ) : (
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack direction="column" spacing={0.5}>
                            <Typography variant="body2">Trạng thái</Typography>

                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Switch
                                    checked={Boolean(item.available)}
                                    onChange={(e) => handleChangeStatus(item.id, e.target.checked)}
                                    size="small"
                                />
                                <Chip
                                    label={item.available ? 'Đang tuyển' : 'Ngưng tuyển'}
                                    color={item.available ? 'success' : 'default'}
                                    variant={item.available ? 'filled' : 'outlined'}
                                    size="small"
                                />
                            </Stack>
                        </Stack>
                    </Grid>
                )}
                <Grid size={{ xs: 12 }}>
                    <Typography variant="body2">Nội dung</Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{item.content}</Typography>
                </Grid>
            </Grid>
        </Paper>
    ));

    const content = (
        <>
            <Paper elevation={2} sx={{
                p: 3,
                mb: 4,
                borderRadius: theme.shape.borderRadius,
                borderLeft: `4px solid ${getStatusColor()}`
            }}>
                <Typography variant="h6" gutterBottom sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: getStatusColor()
                }}>
                    <LocationOn sx={{ mr: 1 }} />
                    Thông tin chi nhánh
                </Typography>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                            <LocationOn color="action" />
                            <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                                {branchInfo?.address}
                            </Typography>
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                            <Phone color="action" />
                            <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                                {branchInfo?.phoneNumber}
                            </Typography>
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="flex-start"
                            sx={{ mb: 1.5, flexWrap: "wrap" }}
                        >
                            <Email color="action" />
                            <Typography
                                variant="body1"
                                sx={{
                                    wordBreak: "break-word",
                                    flex: 1,
                                    minWidth: 0
                                }}
                            >
                                {branchInfo?.email}
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>

            </Paper>

            <Paper elevation={2} sx={{
                p: 3,
                mb: 4,
                borderRadius: theme.shape.borderRadius,
                background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
            }}>
                <Typography variant="h6" gutterBottom sx={{ color: getStatusColor(), display: 'flex', alignItems: 'center' }}>
                    <CalendarToday sx={{ mr: 1 }} /> Thông tin đặt sân
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Stack spacing={0.5}>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <CalendarToday fontSize="small" sx={{ mr: 1 }} /> Ngày đặt
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>{dayjs(reservationData?.createAt).format('DD/MM/YYYY')}</Typography>
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Stack spacing={0.5}>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <Person fontSize="small" sx={{ mr: 1 }} /> Tên người đặt
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>{reservationData?.playerName || ''}</Typography>
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Stack spacing={0.5}>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <CalendarToday fontSize="small" sx={{ mr: 1 }} /> Ngày đến
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>{dayjs(reservationData?.bookAt).format('DD/MM/YYYY')}</Typography>
                        </Stack>
                    </Grid>

                    {reservationData?.totalPrice ? (
                        <>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <Stack spacing={0.5}>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Payments fontSize="small" sx={{ mr: 1 }} /> Tổng tiền
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>{formatVND(reservationData.totalPrice)}</Typography>
                                </Stack>
                            </Grid>

                            {status === 'waiting' && (
                                <>
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <Stack spacing={0.5}>
                                            <Typography variant="body2" color="text.secondary">Đã cọc</Typography>
                                            <Typography variant="body1" fontWeight={500} color="primary.main">{formatVND(reservationData.deposit)}</Typography>
                                        </Stack>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <Stack spacing={0.5}>
                                            <Typography variant="body2" color="text.secondary">Còn lại</Typography>
                                            <Typography variant="body1" fontWeight={500} color={remaining > 0 ? 'secondary.main' : 'primary.main'}>{formatVND(remaining)}</Typography>
                                        </Stack>
                                    </Grid>
                                </>
                            )}

                            {status === 'cancel' && (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <Stack spacing={0.5}>
                                        <Typography variant="body2" color="text.secondary">Đã cọc</Typography>
                                        <Typography variant="body1" fontWeight={500} color="primary.main">{formatVND(reservationData.deposit)}</Typography>
                                    </Stack>
                                </Grid>
                            )}
                        </>
                    ) : null}
                </Grid>

                {remaining > 0 && status === 'waiting' && (
                    <Box sx={{ mt: 3, p: 2, backgroundColor: theme.palette.primary.light + '20', borderRadius: theme.shape.borderRadius, borderLeft: `3px solid ${getStatusColor()}` }}>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                            <strong>Lưu ý:</strong> Bạn cần thanh toán số tiền còn lại ({formatVND(remaining)}) khi đến sử dụng dịch vụ.
                        </Typography>
                    </Box>
                )}
            </Paper>

            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: theme.shape.borderRadius }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: getStatusColor() }}>
                    <SportsSoccer sx={{ mr: 1 }} /> Chi tiết đặt sân
                </Typography>

                <Divider sx={{ my: 2 }} />

                {details?.map((item, index) => (
                    <React.Fragment key={item.reservationId + '-' + item.badmintonCourtId}>
                        <Grid container spacing={2} sx={{ py: 2 }}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <SportsSoccer color="primary" sx={{ mr: 1, fontSize: 20 }} /> Sân số {item.ordinalNumber}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Stack spacing={0.5}>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AccessTime fontSize="small" sx={{ mr: 1 }} /> Thời gian bắt đầu
                                    </Typography>
                                    <Typography variant="body1">{item.startTime?.slice(0, 5)}</Typography>
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Stack spacing={0.5}>
                                    <Typography variant="body2" color="text.secondary">Thời gian thuê</Typography>
                                    <Typography variant="body1">{item.rentalTime} giờ</Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                        {index < details.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </Paper>

            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: theme.shape.borderRadius, border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: getStatusColor() }}>
                    <Group sx={{ mr: 1 }} /> Tuyển thêm người chơi
                </Typography>

                {reservationData.status === 'waiting' ? (
                    <>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                            <Button variant="outlined" onClick={() => setShowRecruitForm(prev => !prev)} startIcon={showRecruitForm ? <ExpandLess /> : <ExpandMore />}>
                                {showRecruitForm ? 'Ẩn' : 'Tuyển thêm / Chỉnh sửa'}
                            </Button>
                        </Box>

                        <Collapse in={showRecruitForm}>
                            <Box sx={{ mt: 2, p: 3, backgroundColor: theme.palette.background.paper, borderRadius: theme.shape.borderRadius }}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            fullWidth
                                            required
                                            type="number"
                                            label="Số lượng tuyển"
                                            name="quantity"
                                            value={currentForm.quantity}
                                            onChange={handleRecruitInputChange}
                                            error={Boolean(errors.quantity)}
                                            helperText={errors.quantity}
                                            slotProps={{
                                                htmlInput: {
                                                    min: 1,
                                                    max: 20
                                                }
                                            }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Switch checked={currentForm.available} onChange={(e) => handleRecruitToggleActive(e.target.checked)} />

                                        <Chip
                                            label={currentForm.available ? 'Đang tuyển' : 'Ngưng tuyển'}
                                            color={currentForm.available ? 'success' : 'default'}
                                            variant={currentForm.available ? 'filled' : 'outlined'}
                                            size="small"
                                            sx={{ ml: 1 }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            fullWidth
                                            label="Trình độ, nội dung mô tả, ..."
                                            multiline
                                            minRows={3}
                                            maxRows={10}
                                            name="content"
                                            value={currentForm.content}
                                            onChange={handleRecruitInputChange}
                                        />
                                    </Grid>
                                </Grid>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                                    <Button variant="outlined" onClick={handleCancelRecruit} sx={{ px: 3 }}>Hủy</Button>
                                    <Button variant="contained" color="primary" onClick={handleSaveRecruitment} sx={{ px: 3 }}>Lưu thông tin</Button>
                                </Box>
                            </Box>
                        </Collapse>

                        {recruitments.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Danh sách tin tuyển đã lưu</Typography>
                                {recruitments.map((r, i) => (
                                    <RecruitmentItem key={i} item={r} index={i} />
                                ))}
                            </Box>
                        )}

                        {recruitments.length === 0 && (
                            <Box sx={{ mt: 2, p: 2, borderRadius: 1, border: `1px dashed ${theme.palette.divider}` }}>
                                <Typography variant="body2" color="text.secondary">Chưa có tin tuyển nào. Bạn có thể nhấn "Thêm mới tin tuyển" để tạo.</Typography>
                            </Box>
                        )}
                    </>
                ) : recruitments.length > 0 ? (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Danh sách tin tuyển đã lưu</Typography>
                        {recruitments.map((r, i) => (
                            <RecruitmentItem key={i} item={r} index={i} />
                        ))}
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.secondary">(Bạn không tuyển vãng lai)</Typography>
                )}
            </Paper>
        </>
    );

    if (isModal) {
        return (
            <Dialog
                open={true}
                onClose={onClose}
                maxWidth="md"
                fullWidth
                scroll="paper"
                slotProps={{ paper: { sx: { borderRadius: 3 } } }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: getStatusColor(), color: 'white', py: 2 }}>
                    <Typography fontSize={20}>Chi tiết đặt sân</Typography>
                    <IconButton onClick={onClose} sx={{ color: 'white' }}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 0 }}>{content}</DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onClose} variant="contained" color="primary">Đóng</Button>
                </DialogActions>
            </Dialog>
        );
    }

    return content;
});

export default BookingDetail;
