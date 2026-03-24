import React, { useState, useEffect } from "react";
import {
    useTheme,
    IconButton,
    Typography,
    Button,
    Stack,
    Pagination,
    Box,
    TextField,
    Grid,
    Paper,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Collapse,
    InputAdornment,
    RadioGroup,
    FormControlLabel,
    Radio,
    CircularProgress,
} from "@mui/material";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import NumbersIcon from '@mui/icons-material/Numbers';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PublishIcon from '@mui/icons-material/Publish';
import SortIcon from '@mui/icons-material/Sort';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { vi } from "date-fns/locale";
import FilterListIcon from "@mui/icons-material/FilterList";
import EventIcon from "@mui/icons-material/Event";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import TemporaryRecruitmentPostItem from '../../../components/common/TemporaryRecruitmentPostItem'
import temporaryRecruitmentService from '../../../services/temporaryRecruitmentService';
import temporaryRecruitmentSavedService from "../../../services/temporaryRecruitmentSavedService";
import temporaryRegistrationService from "../../../services/temporaryRegistrationService";
import { formatDateForDisplay, formatDateOnly, formatTimeOnly } from '../../../utils/format';
import TemporaryRecruitmentDetailModal from "../../../components/modal/TemporaryRecruitmentDetailModal";
import RefreshIcon from "@mui/icons-material/Refresh";
import useSSE from "../../../../hook/useSSE";

const ITEMS_PER_PAGE = 5;

const AllTemporaryRecruitmentPage = ({ user = null }) => {
    const theme = useTheme();

    const { onEvent } = useSSE(user?.id);
    const [hasNewData, setHasNewData] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        searchByName: "",
        sortBy: "reservation.bookAt",
        sortOrder: "DESC",
        createdDateFrom: null,
        createdDateTo: null,
        recruitmentDateFrom: null,
        recruitmentDateTo: null,
        quantityMin: "",
        quantityMax: ""
    });

    const [filtersExpanded, setFiltersExpanded] = useState(false);
    const [selectedRecruitment, setSelectedRecruitment] = useState(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [tempRecruitmentsRes, setTempRecruitmentsRes] = useState({
        data: [],
        first: true,
        last: true,
        pageNumber: 0,
        pageSize: ITEMS_PER_PAGE,
        totalElements: 0,
        totalPages: 0,
    });
    const [savedIds, setSavedIds] = useState(new Set());
    const [registrationIds, setRegistrationIds] = useState(new Set());

    const buildParams = (filters, currentPage) => ({
        page: currentPage - 1,
        size: ITEMS_PER_PAGE,
        status: true,
        sortBy: filters.sortBy,
        sortDirection: filters.sortOrder,
        searchByName: filters.searchByName || undefined,
        createdDateFrom: filters.createdDateFrom?.toISOString(),
        createdDateTo: filters.createdDateTo?.toISOString(),
        recruitmentDateFrom: filters.recruitmentDateFrom?.toISOString(),
        recruitmentDateTo: filters.recruitmentDateTo?.toISOString(),
        quantityMin: filters.quantityMin ?? undefined,
        quantityMax: filters.quantityMax ?? undefined,
    });

    const fetchRecruitments = async () => {
        setLoading(true);
        try {
            const params = buildParams(filters, currentPage);
            const response = await temporaryRecruitmentService.getPaginated(params);
            setTempRecruitmentsRes(response);

            if (user) {
                const [saved, registration] = await Promise.all([
                    temporaryRecruitmentSavedService.getAllTemporaryRecruitmentSavedOfUser(),
                    temporaryRegistrationService.getAllTemporaryRegistrationOfUser(),
                ]);

                setSavedIds(prev => {
                    const newSet = new Set(saved.map(item => item.id));
                    return areSetsEqual(prev, newSet) ? prev : newSet;
                });

                setRegistrationIds(prev => {
                    const newSet = new Set(registration.map(item => item.id));
                    return areSetsEqual(prev, newSet) ? prev : newSet;
                });
            } else {

                setSavedIds(new Set());
                setRegistrationIds(new Set());
            }
        } catch (error) {
            console.error("Error fetching recruitments:", error);
        } finally {
            setLoading(false);
        }
    };

    const areSetsEqual = (a, b) => {
        return a.size === b.size && [...a].every(item => b.has(item));
    };

    // console.log("registrationIds: ", registrationIds);

    useEffect(() => {
        return onEvent("TEMPORARY_RECRUITMENT_POST_CREATED", () => {
            setHasNewData(true);
        });
    }, [onEvent]);


    useEffect(() => {
        fetchRecruitments();
    }, [
        user,
        currentPage,
        filters.sortBy,
        filters.sortOrder,
        filters.searchByName,
        filters.createdDateFrom,
        filters.createdDateTo,
        filters.recruitmentDateFrom,
        filters.recruitmentDateTo,
        filters.quantityMin,
        filters.quantityMax
    ]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));

        if (field !== 'sortBy' && field !== 'sortOrder') {
            setCurrentPage(1);
        }
    };

    const clearSearch = () => {
        handleFilterChange('searchByName', '');
    };

    const clearAllFilters = () => {
        setFilters({
            searchByName: "",
            sortBy: "reservation.bookAt",
            sortOrder: "DESC",
            createdDateFrom: null,
            createdDateTo: null,
            recruitmentDateFrom: null,
            recruitmentDateTo: null,
            quantityMin: "",
            quantityMax: ""
        });
        setCurrentPage(1);
    };

    const removeFilter = (filterType) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: filterType.includes('Date') ? null :
                filterType === 'sortBy' ? 'reservation.bookAt' :
                    filterType === 'sortOrder' ? 'DESC' :
                        filterType === 'searchByName' ? '' : ""
        }));
        setCurrentPage(1);
    };

    const handleOpenDetail = (recruitment) => {
        setSelectedRecruitment(recruitment);
        setDetailDialogOpen(true);
    };

    const handleCloseDetail = () => {
        setDetailDialogOpen(false);
        setSelectedRecruitment(null);
    };

    const handleGetDirections = (address) => {
        const encodedAddress = encodeURIComponent(address);
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
        window.open(googleMapsUrl, '_blank');
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRefresh = () => {
        fetchRecruitments();
        setHasNewData(false);
    }

    const hasActiveFilters = filters.searchByName ||
        filters.createdDateFrom || filters.createdDateTo ||
        filters.recruitmentDateFrom || filters.recruitmentDateTo ||
        filters.quantityMin || filters.quantityMax ||
        filters.sortBy !== "reservation.bookAt" || filters.sortOrder !== "DESC";

    const isQuantityRangeValid = () => {
        const min = filters.quantityMin ? parseInt(filters.quantityMin) : null;
        const max = filters.quantityMax ? parseInt(filters.quantityMax) : null;

        if (min !== null && max !== null) {
            return min <= max;
        }
        return true;
    };

    const quantityError = !isQuantityRangeValid();

    const getSortByDisplayName = (sortBy) => {
        switch (sortBy) {
            case 'reservation.bookAt':
                return 'Ngày tuyển';
            case 'createAt':
                return 'Ngày đăng';
            default:
                return sortBy;
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>

            {hasNewData && (
                <Box
                    sx={{
                        position: "fixed",
                        top: "85px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 1500,
                        display: "flex",
                        justifyContent: "center"
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRefresh}
                        startIcon={<RefreshIcon />}
                        sx={{
                            fontWeight: "bold",
                            px: 2.5,
                            borderRadius: "50px",
                            boxShadow: "0px 4px 10px rgba(0,0,0,0.25)",
                            textTransform: "none",
                            animation: "fadeSlideDown 0.3s ease",
                            "&:hover": {
                                backgroundColor: theme.palette.primary.light,
                            }
                        }}
                    >
                        Tin vãng lai mới
                    </Button>
                </Box>
            )}

            <Stack spacing={3} sx={{ p: 2, maxWidth: 800, margin: "auto" }}>
                <Paper
                    elevation={1}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                        border: '1px solid #e0e0e0'
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: 3,
                        mb: 2
                    }}>
                        <Box sx={{ flex: 1, minWidth: 250 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    mb: 1
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <BusinessCenterIcon sx={{ fontSize: 30, color: "primary.main" }} />
                                    <Typography variant="h5" fontWeight={700}>
                                        Tin tuyển vãng lai
                                    </Typography>
                                </Box>

                                <Chip
                                    label={`${tempRecruitmentsRes.totalElements} kết quả`}
                                    size="small"
                                    color="primary"
                                    variant="soft"
                                />
                            </Box>

                            <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                                Danh sách các tin tuyển vãng lai. Tìm kiếm và tham gia ngay
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    flexWrap: "wrap"
                                }}
                            >
                                {(filters.quantityMin || filters.quantityMax) && (
                                    <Chip
                                        icon={<NumbersIcon />}
                                        label={`SL: ${filters.quantityMin || "min"} - ${filters.quantityMax || "max"}`}
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                    />
                                )}

                                {filters.searchByName && (
                                    <Chip
                                        icon={<SearchIcon />}
                                        label={`"${filters.searchByName}"`}
                                        size="small"
                                        color="warning"
                                        variant="outlined"
                                    />
                                )}
                            </Box>
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            gap: 2,
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'flex-end'
                        }}>
                            <FormControl
                                size="small"
                                sx={{
                                    minWidth: 180,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        backgroundColor: 'white'
                                    }
                                }}
                            >
                                <InputLabel>Sắp xếp theo</InputLabel>
                                <Select
                                    value={filters.sortBy}
                                    label="Sắp xếp theo"
                                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                >
                                    <MenuItem value="reservation.bookAt">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <EventIcon fontSize="small" />
                                            Ngày tuyển
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="createAt">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PublishIcon fontSize="small" />
                                            Ngày đăng
                                        </Box>
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            <Paper
                                elevation={0}
                                sx={{
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    px: 1.5,
                                    py: 0.5,
                                    backgroundColor: 'background.paper'
                                }}
                            >
                                <RadioGroup
                                    row
                                    value={filters.sortOrder}
                                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                                    sx={{ gap: 1 }}
                                >
                                    <FormControlLabel
                                        value="DESC"
                                        control={<Radio size="small" color="primary" />}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <ArrowDownwardIcon fontSize="small" />
                                                Mới nhất
                                            </Box>
                                        }
                                    />
                                    <FormControlLabel
                                        value="ASC"
                                        control={<Radio size="small" color="primary" />}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <ArrowUpwardIcon fontSize="small" />
                                                Cũ nhất
                                            </Box>
                                        }
                                    />
                                </RadioGroup>
                            </Paper>

                            <Button
                                variant={hasActiveFilters ? "contained" : "outlined"}
                                startIcon={<FilterListIcon />}
                                endIcon={filtersExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                onClick={() => setFiltersExpanded(!filtersExpanded)}
                                sx={{
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1,
                                    fontWeight: 600,
                                    position: 'relative',
                                    minWidth: 120
                                }}
                            >
                                Bộ lọc
                                {hasActiveFilters && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: -8,
                                            right: -8,
                                            width: 20,
                                            height: 20,
                                            backgroundColor: 'error.main',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {Object.values(filters).filter(val =>
                                            val && val !== "bookAt" && val !== "DESC"
                                        ).length}
                                    </Box>
                                )}
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 3 }}>
                        <TextField
                            fullWidth
                            size="medium"
                            placeholder="Tìm kiếm theo username hoặc tên sân cầu..."
                            value={filters.searchByName}
                            onChange={(e) => handleFilterChange('searchByName', e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: 'white',
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'primary.main',
                                        borderWidth: 2,
                                    },
                                }
                            }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: filters.searchByName && (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="clear search"
                                                onClick={clearSearch}
                                                edge="end"
                                                size="small"
                                                sx={{
                                                    color: 'text.secondary',
                                                    '&:hover': {
                                                        backgroundColor: 'action.hover',
                                                        color: 'error.main'
                                                    }
                                                }}
                                            >
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }
                            }}
                        />
                    </Box>

                    {hasActiveFilters && (
                        <Box sx={{
                            mt: 3,
                            display: 'flex',
                            gap: 1,
                            flexWrap: 'wrap',
                            alignItems: 'center'
                        }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                Bộ lọc đang áp dụng:
                            </Typography>

                            {filters.searchByName && (
                                <Chip
                                    icon={<SearchIcon />}
                                    label={`Tìm: "${filters.searchByName}"`}
                                    onDelete={() => removeFilter('searchByName')}
                                    size="small"
                                    color="warning"
                                    variant="outlined"
                                    sx={{ borderRadius: 1 }}
                                />
                            )}
                            {filters.sortBy && filters.sortBy !== "bookAt" && (
                                <Chip
                                    icon={<SortIcon />}
                                    label={`Sắp xếp: ${getSortByDisplayName(filters.sortBy)}`}
                                    onDelete={() => removeFilter('sortBy')}
                                    size="small"
                                    color="info"
                                    variant="outlined"
                                    sx={{ borderRadius: 1 }}
                                />
                            )}
                            {filters.sortOrder && filters.sortOrder !== "DESC" && (
                                <Chip
                                    icon={filters.sortOrder === "ASC" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                                    label={filters.sortOrder === "ASC" ? "Cũ nhất" : "Mới nhất"}
                                    onDelete={() => removeFilter('sortOrder')}
                                    size="small"
                                    color="info"
                                    variant="outlined"
                                    sx={{ borderRadius: 1 }}
                                />
                            )}
                            {filters.createdDateFrom && (
                                <Chip
                                    icon={<CalendarTodayIcon />}
                                    label={`Đăng từ: ${formatDateForDisplay(filters.createdDateFrom)}`}
                                    onDelete={() => removeFilter('createdDateFrom')}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ borderRadius: 1 }}
                                />
                            )}
                            {filters.createdDateTo && (
                                <Chip
                                    icon={<CalendarTodayIcon />}
                                    label={`Đăng đến: ${formatDateForDisplay(filters.createdDateTo)}`}
                                    onDelete={() => removeFilter('createdDateTo')}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ borderRadius: 1 }}
                                />
                            )}
                            {filters.recruitmentDateFrom && (
                                <Chip
                                    icon={<EventAvailableIcon />}
                                    label={`Tuyển từ: ${formatDateForDisplay(filters.recruitmentDateFrom)}`}
                                    onDelete={() => removeFilter('recruitmentDateFrom')}
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                    sx={{ borderRadius: 1 }}
                                />
                            )}
                            {filters.recruitmentDateTo && (
                                <Chip
                                    icon={<EventAvailableIcon />}
                                    label={`Tuyển đến: ${formatDateForDisplay(filters.recruitmentDateTo)}`}
                                    onDelete={() => removeFilter('recruitmentDateTo')}
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                    sx={{ borderRadius: 1 }}
                                />
                            )}
                            {filters.quantityMin && (
                                <Chip
                                    icon={<NumbersIcon />}
                                    label={`SL từ: ${filters.quantityMin}`}
                                    onDelete={() => removeFilter('quantityMin')}
                                    size="small"
                                    color="secondary"
                                    variant="outlined"
                                    sx={{ borderRadius: 1 }}
                                />
                            )}
                            {filters.quantityMax && (
                                <Chip
                                    icon={<NumbersIcon />}
                                    label={`SL đến: ${filters.quantityMax}`}
                                    onDelete={() => removeFilter('quantityMax')}
                                    size="small"
                                    color="secondary"
                                    variant="outlined"
                                    sx={{ borderRadius: 1 }}
                                />
                            )}

                            <Button
                                size="small"
                                onClick={clearAllFilters}
                                color="inherit"
                                startIcon={<ClearAllIcon />}
                                sx={{
                                    ml: 'auto',
                                    borderRadius: 1,
                                    textTransform: 'none',
                                    fontWeight: 600
                                }}
                            >
                                Xóa tất cả
                            </Button>
                        </Box>
                    )}
                </Paper>

                <Collapse in={filtersExpanded}>
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                            <FilterListIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Bộ lọc chi tiết
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                    Lọc theo ngày đăng
                                </Typography>
                            </Grid>
                            <Grid sx={{ xs: 12, sm: 6 }}>
                                <DatePicker
                                    label="Ngày đăng từ"
                                    value={filters.createdDateFrom}
                                    onChange={(newValue) => handleFilterChange('createdDateFrom', newValue)}
                                    slotProps={{ textField: { size: "small", fullWidth: true } }}
                                    inputFormat="dd/MM/yyyy"
                                    maxDate={filters.createdDateTo || new Date()}
                                />
                            </Grid>
                            <Grid sx={{ xs: 12, sm: 6 }}>
                                <DatePicker
                                    label="Ngày đăng đến"
                                    value={filters.createdDateTo}
                                    onChange={(newValue) => handleFilterChange('createdDateTo', newValue)}
                                    slotProps={{ textField: { size: "small", fullWidth: true } }}
                                    inputFormat="dd/MM/yyyy"
                                    minDate={filters.createdDateFrom}
                                    maxDate={new Date()}
                                />
                            </Grid>

                            <Grid sx={{ xs: 12, mt: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                    Lọc theo ngày tuyển
                                </Typography>
                            </Grid>
                            <Grid sx={{ xs: 12, sm: 6 }}>
                                <DatePicker
                                    label="Ngày tuyển từ"
                                    value={filters.recruitmentDateFrom}
                                    onChange={(newValue) => handleFilterChange('recruitmentDateFrom', newValue)}
                                    slotProps={{ textField: { size: "small", fullWidth: true } }}
                                    inputFormat="dd/MM/yyyy"
                                    maxDate={filters.recruitmentDateTo}
                                />
                            </Grid>
                            <Grid sx={{ xs: 12, sm: 6 }}>
                                <DatePicker
                                    label="Ngày tuyển đến"
                                    value={filters.recruitmentDateTo}
                                    onChange={(newValue) => handleFilterChange('recruitmentDateTo', newValue)}
                                    slotProps={{ textField: { size: "small", fullWidth: true } }}
                                    inputFormat="dd/MM/yyyy"
                                />
                            </Grid>

                            <Grid sx={{ xs: 12, mt: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                    Lọc theo số lượng
                                </Typography>
                            </Grid>
                            <Grid sx={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Số lượng từ"
                                    type="number"
                                    value={filters.quantityMin}
                                    onChange={(e) => handleFilterChange('quantityMin', e.target.value)}
                                    InputProps={{
                                        inputProps: {
                                            min: 1,
                                            max: filters.quantityMax || 100
                                        }
                                    }}
                                    error={quantityError}
                                    helperText={quantityError ? "Số lượng từ phải nhỏ hơn hoặc bằng số lượng đến" : ""}
                                />
                            </Grid>
                            <Grid sx={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Số lượng đến"
                                    type="number"
                                    value={filters.quantityMax}
                                    onChange={(e) => handleFilterChange('quantityMax', e.target.value)}
                                    InputProps={{
                                        inputProps: {
                                            min: filters.quantityMin || 1,
                                            max: 100
                                        }
                                    }}
                                    error={quantityError}
                                    helperText={quantityError ? "Số lượng đến phải lớn hơn hoặc bằng số lượng từ" : ""}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Collapse>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : tempRecruitmentsRes.data.length > 0 ? (
                    <>
                        <Stack spacing={2}>
                            {tempRecruitmentsRes.data.map(item => (
                                <TemporaryRecruitmentPostItem
                                    key={item.id}
                                    item={item}
                                    handleOpenDetail={handleOpenDetail}
                                    theme={theme}
                                    isSaved={savedIds.has(item.id)}
                                    isRegistration={registrationIds.has(item.id)}
                                    user={user}
                                />
                            ))}
                        </Stack>

                        {tempRecruitmentsRes.totalPages > 1 && (
                            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                                <Pagination
                                    count={tempRecruitmentsRes.totalPages}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                    size="large"
                                    showFirstButton
                                    showLastButton
                                />
                            </Box>
                        )}
                    </>
                ) : (
                    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            {quantityError ? "Khoảng số lượng không hợp lệ" : "Không tìm thấy kết quả phù hợp"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {quantityError
                                ? "Vui lòng kiểm tra lại khoảng số lượng từ - đến"
                                : filters.searchByName
                                    ? `Không tìm thấy kết quả nào cho "${filters.searchByName}"`
                                    : "Hãy thử điều chỉnh bộ lọc để tìm kiếm"
                            }
                        </Typography>
                        {hasActiveFilters && (
                            <Button
                                variant="contained"
                                onClick={clearAllFilters}
                            >
                                Xóa tất cả bộ lọc
                            </Button>
                        )}
                    </Paper>
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
                    theme={theme}
                    isRegistration={registrationIds.has(selectedRecruitment.id)}
                    user={user}
                />
            )}
        </LocalizationProvider>
    );
};

export default AllTemporaryRecruitmentPage;
