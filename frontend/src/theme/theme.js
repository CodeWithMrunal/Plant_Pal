import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#4A90E2',
        },
        background: {
            default: '#1A1D24',
            paper: '#252836',
        },
    },
    typography: {
        h1: {
            fontSize: '3.5rem',
            fontWeight: 700,
        },
        h2: {
            fontSize: '2.5rem',
            fontWeight: 600,
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                    },
                },
            },
        },
    },
});