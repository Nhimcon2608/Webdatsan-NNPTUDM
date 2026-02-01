import { createTheme } from '@mui/material/styles';
import { lightBlue, deepOrange } from '@mui/material/colors';

const theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#3b82f6',
			light: '#22d3ee',
			contrastText: '#ffffff',
		},
		secondary: {
			main: '#6b7280',
			light: '#9ca3af',
		},
		background: {
			default: '#ffffff',
			paper: '#f3f4f6',
		},
		text: {
			primary: '#1f2937',
			secondary: '#6b7280',
		},
		divider: '#e5e7eb',
		action: {
			hover: 'rgba(96, 172, 242, 0.08)',
			selected: '#e5e7eb',
		},
	},
	typography: {
		fontFamily: 'Inter, sans-serif',
		h5: { fontWeight: 700, letterSpacing: '0.5px' },
		h6: { fontWeight: 600 },
		body2: { fontWeight: 400 },
	},
	shape: { borderRadius: 2 },
});

export const getTheme = (mode = 'light') =>
	createTheme({
		palette: {
			mode,
			primary: {
				main: mode === 'dark' ? lightBlue[300] : '#3b82f6',
				light: mode === 'dark' ? '#60a5fa' : '#22d3ee',
				contrastText: '#ffffff',
			},
			secondary: {
				main: mode === 'dark' ? deepOrange[400] : '#6b7280',
				light: mode === 'dark' ? '#fb923c' : '#9ca3af',
			},
			background: {
				default: mode === 'dark' ? '#0f172a' : '#ffffff',
				paper: mode === 'dark' ? '#1e293b' : '#f3f4f6',
			},
			text: {
				primary: mode === 'dark' ? '#e2e8f0' : '#1f2937',
				secondary: mode === 'dark' ? '#94a3b8' : '#6b7280',
			},
			divider: mode === 'dark' ? '#334155' : '#e5e7eb',
			action: {
				hover:
					mode === 'dark'
						? 'rgba(96, 172, 242, 0.15)'
						: 'rgba(96, 172, 242, 0.08)',
				selected: mode === 'dark' ? '#334155' : '#e5e7eb',
			},
		},
		typography: {
			fontFamily:
				'"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
			h5: { fontWeight: 700, letterSpacing: '0.5px' },
			h6: { fontWeight: 600 },
			body2: { fontWeight: 400 },
		},
		shape: { borderRadius: 8 },
	});

export default theme;
