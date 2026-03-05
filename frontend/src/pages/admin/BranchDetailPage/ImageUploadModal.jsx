import React, { useState, useRef } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    IconButton,
    CircularProgress
} from '@mui/material';
import { CloudUpload, Close, Image } from '@mui/icons-material';

import theme from '../../../theme/adminTheme';


const ImageUploadModal = ({courtId, open, onClose, onUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [description, setDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        setDescription(description || file.name);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('shortDescription', description);
            formData.append('badmintonCourtId', courtId);

            await onUpload(formData);

            handleClose();
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setPreview('');
        setDescription('');
        onClose();
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        p: 3,
                        borderRadius: 3
                    }
                }
            }}
        >
            <DialogContent dividers>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />

                {!preview ? (
                    <Box
                        sx={{
                            border: '2px dashed #ccc',
                            borderRadius: 2,
                            p: 4,
                            textAlign: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                                borderColor: theme.palette.primary.main,
                                backgroundColor:  theme.palette.action.hover
                            }
                        }}
                        onClick={triggerFileInput}
                    >
                        <CloudUpload fontSize="large" color="action" />
                        <Typography variant="body1" mt={2}>
                            Nhấn để chọn hình ảnh hoặc kéo thả vào đây
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            Hỗ trợ: JPG, PNG, GIF (Tối đa 5MB)
                        </Typography>
                    </Box>
                ) : (
                    <Box>
                        <Box
                            component="img"
                            src={preview}
                            alt="Preview"
                            sx={{
                                maxWidth: '100%',
                                maxHeight: '400px',
                                display: 'block',
                                margin: '0 auto',
                                borderRadius: 2,
                                boxShadow: 1
                            }}
                        />

                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<Image />}
                            onClick={triggerFileInput}
                            sx={{ mt: 2 }}
                        >
                            Chọn hình khác
                        </Button>
                    </Box>
                )}

                <TextField
                    label="Mô tả hình ảnh"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={description}
                    onChange={handleDescriptionChange}
                    sx={{ mt: 3 }}
                    placeholder="Nhập mô tả cho hình ảnh..."
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Hủy bỏ
                </Button>
                <Button
                    onClick={handleUpload}
                    color="primary"
                    variant="contained"
                    disabled={!selectedFile || isUploading}
                    startIcon={isUploading ? <CircularProgress size={20} /> : null}
                >
                    {isUploading ? 'Đang tải lên...' : 'Xác nhận'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ImageUploadModal;