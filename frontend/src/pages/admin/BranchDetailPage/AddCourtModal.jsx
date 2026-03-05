import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
    Box
} from '@mui/material';

const AddCourtModal = ({
    open,
    onClose,
    branchId,
    onSubmit,
    existedCourt = []
}) => {
    const [formData, setFormData] = useState({
        ordinalNumber: '',
        available: true,
        branchId: branchId
    });
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    useEffect(() => {
        if (formData.ordinalNumber) {
            const inputNumber = parseInt(formData.ordinalNumber, 10);
            const numericExistedCourt = existedCourt.map(Number);
            const isExisted = numericExistedCourt.includes(inputNumber);

            setError(isExisted);
            setErrorMessage(isExisted ? 'Số thứ tự sân đã tồn tại' : '');
        } else {
            setError(false);
            setErrorMessage('');
        }
    }, [formData.ordinalNumber, existedCourt]);

    const handleSubmit = () => {
        if (error) return;

        onSubmit({
            ...formData,
            ordinalNumber: parseInt(formData.ordinalNumber)
        });
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3
                    }
                }
            }}
        >
            <DialogTitle>Thêm sân mới</DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ mt: 2 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Số thứ tự sân"
                        name="ordinalNumber"
                        type="number"
                        value={formData.ordinalNumber}
                        onChange={handleChange}
                        slotProps={{
                            htmlInput: {
                                minL: 1
                            },
                            formHelperText: {
                                sx: {
                                    olor: 'error.main'
                                }
                            }
                        }}
                        error={error}
                        helperText={errorMessage}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                name="available"
                                checked={formData.available}
                                onChange={handleChange}
                            />
                        }
                        label="Sân đang hoạt động"
                        sx={{ mt: 2 }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!formData.ordinalNumber || error}
                >
                    Thêm sân
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddCourtModal;