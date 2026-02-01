import React, { useState } from 'react';
import {
    Box,
    Chip,
    Fade,
    Grid,
    IconButton,
    Paper,
    Stack,
    Tooltip,
    Typography,
    useTheme,
    useMediaQuery,
    TextField,
    MenuItem,
    Popover,
    Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle,
    Cancel,
    LocationOn,
    Email,
    Phone,
    Store,
    FilterList,
    Search,
    Close
} from '@mui/icons-material';

import { stringToColor } from '../../../utils/stringToColor';


const BranchList = ({ branches }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const isVerySmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [anchorEl, setAnchorEl] = useState(null);

    const openFilter = Boolean(anchorEl);

    const handleBranchClick = (branchId) => {
        navigate(`/admin/branches/${branchId}`);
    };

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        handleFilterClose();
    };

    const filteredBranches = branches.filter(branch => {
        const statusMatch = statusFilter === 'all' ||
            (statusFilter === 'active' && branch.cooperated) ||
            (statusFilter === 'inactive' && !branch.cooperated);

        const searchMatch = searchTerm === '' ||
            branch.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (branch.phoneNumber && branch.phoneNumber.includes(searchTerm));

        return statusMatch && searchMatch;
    });

    return (
        <Box sx={{ width: '100%' }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 2
                }}
            >
                <Typography variant="h5" fontWeight="bold" color="primary">
                    Chi nhánh
                    <Typography
                        component="span"
                        variant="body2"
                        sx={{ ml: 2, color: theme.palette.text.secondary }}
                    >
                        ({filteredBranches.length} chi nhánh)
                    </Typography>
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

                    <TextField
                        size="small"
                        placeholder="Tìm theo tên hoặc số điện thoại..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        slotProps={{
                            startAdornment: <Search sx={{ color: theme.palette.action.active, mr: 1 }} />,
                            endAdornment: searchTerm && (
                                <IconButton
                                    size="small"
                                    onClick={() => setSearchTerm('')}
                                >
                                    <Close fontSize="small" />
                                </IconButton>
                            )

                        }}
                        sx={{
                            width: isVerySmallScreen ? '100%' : 300,
                            '& .MuiInputBase-root': {
                                borderRadius: 2,
                                backgroundColor: theme.palette.background.paper
                            }
                        }}
                    />

                    <Tooltip title="Lọc danh sách">
                        <IconButton
                            color="primary"
                            onClick={handleFilterClick}
                            sx={{
                                backgroundColor: statusFilter !== 'all' ?
                                    theme.palette.action.selected : 'transparent'
                            }}
                        >
                            <FilterList />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <Popover
                open={openFilter}
                anchorEl={anchorEl}
                onClose={handleFilterClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                slotProps={{
                    paper: {
                        sx: {
                            p: 3,
                            borderRadius: 3,
                            minWidth: 240,
                            boxShadow: 3,
                            backgroundColor: '#fff',
                        },
                    },
                }}
            >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Lọc theo trạng thái
                </Typography>

                <TextField
                    select
                    fullWidth
                    size="small"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{
                        mb: 2,
                        '& .MuiInputBase-root': {
                            borderRadius: 2,
                        }
                    }}
                >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="active">Đang hợp tác</MenuItem>
                    <MenuItem value="inactive">Ngừng hợp tác</MenuItem>
                </TextField>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={handleClearFilters}
                        disabled={statusFilter === 'all' && searchTerm === ''}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            px: 2,
                        }}
                    >
                        Xóa bộ lọc
                    </Button>
                </Box>
            </Popover>


            <Grid container spacing={3}>
                {filteredBranches.length > 0 ? (
                    filteredBranches.map((branch, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 6 }} key={branch.id}>
                            <Fade in timeout={500 + index * 100}>
                                <Paper
                                    elevation={2}
                                    sx={{
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        transition: 'transform 0.3s ease-in-out !important',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 6,
                                        },
                                        height: '100%'
                                    }}
                                >
                                    <Box
                                        component="div"
                                        onClick={() => handleBranchClick(branch.id)}
                                        sx={{
                                            height: '100%',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: isSmallScreen ? 'column' : 'row',
                                            height: '100%'
                                        }}>

                                            <Box
                                                sx={{
                                                    position: 'relative',
                                                    width: isSmallScreen ? '100%' : 200,
                                                    height: isVerySmallScreen ? 150 : isSmallScreen ? 180 : '100%',
                                                    minHeight: isSmallScreen ? 150 : 180,
                                                    flexShrink: 0,
                                                    bgcolor: theme.palette.background.default,
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {branch.imagePath ? (
                                                    <Box
                                                        component="img"
                                                        sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                            transition: 'transform 0.3s ease',
                                                            '&:hover': {
                                                                transform: 'scale(1.05)'
                                                            }
                                                        }}
                                                        src={`${import.meta.env.VITE_API_URL}/${branch.imagePath}`}
                                                        alt={branch.branchName}
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: '100%',
                                                            height: '100%',
                                                            bgcolor: stringToColor(branch.branchName + '!'),
                                                            opacity: 0.8
                                                        }}
                                                    >
                                                        <Store
                                                            sx={{
                                                                fontSize: isVerySmallScreen ? 40 : 60,
                                                                color: '#fff',
                                                                transition: 'transform 0.3s ease',
                                                                '&:hover': {
                                                                    transform: 'scale(1.2)'
                                                                }
                                                            }}
                                                        />
                                                    </Box>
                                                )}

                                                <Chip
                                                    size="small"
                                                    icon={branch.cooperated ?
                                                        <CheckCircle fontSize="small" /> :
                                                        <Cancel fontSize="small" />
                                                    }
                                                    label={branch.cooperated ? 'Đang hợp tác' : 'Ngừng hợp tác'}
                                                    color={branch.cooperated ? 'success' : 'error'}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        right: 8,
                                                        fontWeight: 500,
                                                        backdropFilter: 'blur(4px)',
                                                        backgroundColor: branch.cooperated ?
                                                            'rgba(46, 125, 50, 0.85)' :
                                                            'rgba(211, 47, 47, 0.85)',
                                                        color: '#fff',
                                                        '& .MuiChip-icon': {
                                                            color: '#fff'
                                                        }
                                                    }}
                                                />
                                            </Box>

                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                flexGrow: 1,
                                                p: isVerySmallScreen ? 1 : 2,
                                                overflow: 'hidden'
                                            }}>
                                                <Typography
                                                    variant={isVerySmallScreen ? "subtitle1" : "h6"}
                                                    sx={{
                                                        fontWeight: 600,
                                                        mb: 1,
                                                        color: theme.palette.text.primary,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 1,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {branch.branchName}
                                                </Typography>

                                                {!isVerySmallScreen && (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontFamily: 'monospace',
                                                            color: 'text.secondary',
                                                            mb: 2,
                                                            fontSize: '0.8rem'
                                                        }}
                                                    >
                                                        ID: {branch.id}
                                                    </Typography>
                                                )}

                                                <Stack spacing={1} sx={{ flexGrow: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                        <LocationOn
                                                            sx={{
                                                                fontSize: isVerySmallScreen ? 16 : 18,
                                                                color: theme.palette.primary.main,
                                                                mr: 1,
                                                                mt: isVerySmallScreen ? 0.1 : 0.3
                                                            }}
                                                        />
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: theme.palette.text.primary,
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: isVerySmallScreen ? 1 : 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                                lineHeight: 1.4,
                                                                fontSize: isVerySmallScreen ? '0.75rem' : '0.875rem'
                                                            }}
                                                        >
                                                            {branch.address}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Email
                                                            sx={{
                                                                fontSize: isVerySmallScreen ? 16 : 18,
                                                                color: theme.palette.primary.main,
                                                                mr: 1
                                                            }}
                                                        />
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: theme.palette.text.primary,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                fontSize: isVerySmallScreen ? '0.75rem' : '0.875rem'
                                                            }}
                                                        >
                                                            {branch.email}
                                                        </Typography>
                                                    </Box>

                                                    {branch.phoneNumber && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Phone
                                                                sx={{
                                                                    fontSize: isVerySmallScreen ? 16 : 18,
                                                                    color: theme.palette.primary.main,
                                                                    mr: 1
                                                                }}
                                                            />
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: theme.palette.text.primary,
                                                                    fontSize: isVerySmallScreen ? '0.75rem' : '0.875rem'
                                                                }}
                                                            >
                                                                {branch.phoneNumber}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Stack>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Fade>
                        </Grid>
                    ))
                ) : (
                    <Grid size={{ xs: 12 }}>
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body1" color="textSecondary">
                                Không tìm thấy chi nhánh nào phù hợp với tiêu chí tìm kiếm
                            </Typography>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default BranchList;