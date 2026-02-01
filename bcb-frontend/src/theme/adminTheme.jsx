import { createTheme } from '@mui/material/styles';

const adminTheme = createTheme({
    palette: {
        mode: 'light', // hoặc 'dark' cho chế độ tối
        primary: {
            main: '#1976d2', // Màu chính
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#9c27b0', // Màu phụ
            light: '#ba68c8',
            dark: '#7b1fa2',
            contrastText: '#ffffff',
        },
        error: {
            main: '#d32f2f',
        },
        warning: {
            main: '#ed6c02',
        },
        info: {
            main: '#0288d1',
        },
        success: {
            main: '#2e7d32',
        },
        background: {
            default: '#f5f5f5', // Màu nền
            paper: '#ffffff', // Màu nền components
        },
        text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.6)',
            disabled: 'rgba(0, 0, 0, 0.38)',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 500,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 500,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
        },
        subtitle1: {
            fontSize: '1rem',
            fontWeight: 400,
        },
        subtitle2: {
            fontSize: '0.875rem',
            fontWeight: 500,
        },
        body1: {
            fontSize: '1rem',
            fontWeight: 400,
        },
        body2: {
            fontSize: '0.875rem',
            fontWeight: 400,
        },
        button: {
            fontSize: '0.875rem',
            fontWeight: 500,
            textTransform: 'none',
        },
        caption: {
            fontSize: '0.75rem',
            fontWeight: 400,
        },
        overline: {
            fontSize: '0.75rem',
            fontWeight: 400,
            textTransform: 'uppercase',
        },
    },
    shape: {
        borderRadius: 3,
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: 'none',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.1)',
                    '&:hover': {
                        boxShadow: '0px 4px 8px -1px rgba(0,0,0,0.1)',
                    },
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                size: 'small',
            },
        },
    },
});

export default adminTheme;