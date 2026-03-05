import { useState, useEffect, useRef } from 'react';

import {
    Modal,
    Box,
    Typography,
    Button,
    Rating,
    Avatar,
    IconButton,
    Paper,
    Stack,
    Fade,
    CircularProgress,
    useMediaQuery
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import EditIcon from '@mui/icons-material/Edit';

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import reviewService from '../../services/reviewService';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95%',
    maxWidth: '850px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    maxHeight: '95vh',
    p: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
};

const ReviewModal = ({ open, onClose, branch, theme, review, player, onReviewSubmitted }) => {
    const [isEditReview, setEditReview] = useState(false);
    const [reviewEdited, setReviewEdited] = useState({
        ratingLevel: 0,
        content: '',
        playerId: '',
        branchId: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const quillRef = useRef();

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['clean']
        ],
        clipboard: {
            matchVisual: false,
        }
    };

    const quillFormats = [
        'header',
        'bold', 'italic', 'underline', 'blockquote',
        'list'
    ];

    useEffect(() => {
        if (review) {
            setReviewEdited({
                ratingLevel: review.ratingLevel,
                content: review.content,
                branchId: review.branchId,
                playerId: review.playerId,
            });
            setEditReview(true);
        } else {
            setReviewEdited((prev) => ({
                ...prev,
                branchId: branch?.id,
                playerId: player?.id,
            }));
        }
    }, [review, branch, player]);

    const handleRatingChange = (_, newValue) => {
        setReviewEdited(prev => ({
            ...prev,
            ratingLevel: newValue
        }));
    };

    const handleContentChange = (value) => {
        setReviewEdited(prev => ({
            ...prev,
            content: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (isEditReview) {
                await reviewService.putReview(review.id, reviewEdited);
            } else {
                await reviewService.postReview(reviewEdited);
            }

            if (quillRef.current && quillRef.current.getEditor) {
                const editor = quillRef.current.getEditor();
                editor.blur?.();
            }

            if (onReviewSubmitted) {
                onReviewSubmitted();
            }

            onClose();
        } catch (error) {
            console.error("Lỗi khi gửi đánh giá:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const ratingLabels = {
        1: 'Kém',
        2: 'Trung bình',
        3: 'Tốt',
        4: 'Rất tốt',
        5: 'Xuất sắc'
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            disableAutoFocus
            disableEnforceFocus
            aria-labelledby="review-modal-title"
            aria-describedby="review-modal-description"
        >
            <Fade in={open}>
                <Paper sx={style}>
                    <Box sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                        color: theme.palette.primary.contrastText,
                        p: 2,
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Typography
                            id="review-modal-title"
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                letterSpacing: '0.5px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            {isEditReview ? (
                                <>
                                    <EditIcon fontSize="small" />
                                    Chỉnh sửa đánh giá
                                </>
                            ) : (
                                'Đánh giá chi nhánh'
                            )}
                        </Typography>
                        <IconButton
                            onClick={onClose}
                            sx={{
                                color: theme.palette.primary.contrastText,
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)'
                                }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{
                        flex: 1,
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: theme.palette.grey[100],
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: theme.palette.primary.light,
                            borderRadius: '4px',
                        }
                    }}>

                        <Box sx={{
                            p: 3,
                            backgroundColor: theme.palette.background.paper,
                            borderBottom: `1px solid ${theme.palette.divider}`
                        }}>
                            <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={3}>
                                <Avatar
                                    src={`${import.meta.env.VITE_API_URL}/${branch?.imagePath}`}
                                    alt={branch?.branchName}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        borderRadius: 2,
                                        boxShadow: theme.shadows[3],
                                        alignSelf: isMobile ? 'center' : 'flex-start'
                                    }}
                                    variant="rounded"
                                />
                                <Box flex={1}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 600,
                                            color: theme.palette.text.primary,
                                            mb: 1
                                        }}
                                    >
                                        {branch?.branchName}
                                    </Typography>

                                    <Stack spacing={1.5} sx={{ mt: 2 }}>
                                        <Box display="flex" alignItems="flex-start" gap={1.5}>
                                            <LocationOnIcon
                                                color="primary"
                                                fontSize="small"
                                                sx={{ mt: 0.5 }}
                                            />
                                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                {branch?.address}
                                            </Typography>
                                        </Box>

                                        <Box display="flex" alignItems="center" gap={1.5}>
                                            <PhoneIcon color="primary" fontSize="small" />
                                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                {branch?.phoneNumber}
                                            </Typography>
                                        </Box>

                                        <Box display="flex" alignItems="center" gap={1.5}>
                                            <EmailIcon color="primary" fontSize="small" />
                                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                {branch?.email}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Box>
                        </Box>

                        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                    mb: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                {isEditReview ? 'Cập nhật đánh giá' : 'Viết đánh giá của bạn'}
                            </Typography>

                            <Box
                                sx={{
                                    mb: 4,
                                    p: 3,
                                    backgroundColor: theme.palette.grey[50],
                                    borderRadius: 2,
                                    border: `1px solid ${theme.palette.divider}`,
                                    textAlign: 'center'
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        color: theme.palette.text.primary,
                                        mb: 2,
                                        fontWeight: 500
                                    }}
                                >
                                    Bạn đánh giá chi nhánh này bao nhiêu sao?
                                </Typography>

                                <Rating
                                    name="ratingLevel"
                                    value={reviewEdited.ratingLevel}
                                    onChange={handleRatingChange}
                                    size="large"
                                    icon={<StarIcon fontSize="inherit" sx={{ color: theme.palette.warning.main }} />}
                                    emptyIcon={<StarBorderIcon fontSize="inherit" sx={{ color: theme.palette.grey[400] }} />}
                                    sx={{
                                        fontSize: '2.5rem',
                                        mb: 1
                                    }}
                                />

                                {reviewEdited.ratingLevel > 0 && (
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color:
                                                reviewEdited.ratingLevel >= 4 ? theme.palette.success.main :
                                                    reviewEdited.ratingLevel >= 3 ? theme.palette.info.main :
                                                        reviewEdited.ratingLevel >= 2 ? theme.palette.warning.main :
                                                            theme.palette.error.main,
                                            fontWeight: 500,
                                            mt: 1
                                        }}
                                    >
                                        {ratingLabels[reviewEdited.ratingLevel]}
                                    </Typography>
                                )}
                            </Box>

                            <Box mb={4}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        color: theme.palette.text.primary,
                                        mb: 2,
                                        fontWeight: 500
                                    }}
                                >
                                    Chi tiết đánh giá
                                </Typography>

                                <Box sx={{
                                    '& .ql-toolbar': {
                                        borderRadius: '8px 8px 0 0',
                                        borderColor: theme.palette.divider,
                                        backgroundColor: theme.palette.grey[50]
                                    },
                                    '& .ql-container': {
                                        borderRadius: '0 0 8px 8px',
                                        borderColor: theme.palette.divider,
                                        backgroundColor: theme.palette.grey[50],
                                        fontFamily: theme.typography.fontFamily,
                                        fontSize: theme.typography.fontSize,
                                        minHeight: '200px'
                                    },
                                    '& .ql-editor': {
                                        minHeight: '200px',
                                        '&.ql-blank::before': {
                                            color: theme.palette.text.disabled,
                                            fontStyle: 'normal'
                                        }
                                    }
                                }}>
                                    <ReactQuill
                                        ref={quillRef}
                                        theme="snow"
                                        value={reviewEdited.content}
                                        onChange={handleContentChange}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Chia sẻ trải nghiệm của bạn tại chi nhánh này..."
                                    />
                                </Box>
                            </Box>

                            <Box
                                display="flex"
                                justifyContent="flex-end"
                                gap={2}
                                sx={{
                                    pt: 2,
                                    borderTop: `1px solid ${theme.palette.divider}`
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    sx={{
                                        minWidth: 100,
                                        color: theme.palette.text.secondary,
                                        borderColor: theme.palette.divider,
                                        '&:hover': {
                                            borderColor: theme.palette.text.primary,
                                            backgroundColor: 'transparent'
                                        }
                                    }}
                                >
                                    Hủy
                                </Button>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={
                                        !reviewEdited.ratingLevel ||
                                        isSubmitting
                                    }
                                    sx={{
                                        minWidth: 140,
                                        boxShadow: 'none',
                                        '&:hover': {
                                            boxShadow: theme.shadows[2]
                                        },
                                        '&.Mui-disabled': {
                                            backgroundColor: theme.palette.action.disabledBackground,
                                            color: theme.palette.action.disabled
                                        }
                                    }}
                                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                                >
                                    {isSubmitting ? 'Đang xử lý...' : isEditReview ? 'Cập nhật' : 'Gửi đánh giá'}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Fade>
        </Modal>
    );
};

export default ReviewModal;