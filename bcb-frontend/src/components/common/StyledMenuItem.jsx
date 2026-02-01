import { MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({

    transition: 'all 0.3s ease',
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(0.7),

    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        transform: 'translateX(5px)',
        boxShadow: theme.shadows[2],
    },
    
    '&.Mui-selected': {
        backgroundColor: theme.palette.primary.light,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        }
    }
}));

export default StyledMenuItem;