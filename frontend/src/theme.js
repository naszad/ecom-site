import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00fff9',
      light: '#5fffff',
      dark: '#00b4b0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff00ff',
      light: '#ff57ff',
      dark: '#b800b8',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ff0055',
      light: '#ff4081',
      dark: '#c51162',
    },
    warning: {
      main: '#ffbb00',
      light: '#ffd740',
      dark: '#c79100',
    },
    success: {
      main: '#00ff9f',
      light: '#69ffbd',
      dark: '#00c853',
    },
    background: {
      default: '#0a0b1e',
      paper: '#12152b',
    },
    text: {
      primary: '#ffffff',
      secondary: '#8f94b4',
    },
  },
  typography: {
    fontFamily: [
      'Rajdhani',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    button: {
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(65, 232, 255, 0.1) 25%, rgba(65, 232, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(65, 232, 255, 0.1) 75%, rgba(65, 232, 255, 0.1) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(65, 232, 255, 0.1) 25%, rgba(65, 232, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(65, 232, 255, 0.1) 75%, rgba(65, 232, 255, 0.1) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '50px 50px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 600,
          position: 'relative',
          overflow: 'hidden',
          color: '#ffffff',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(120deg, transparent, rgba(0, 255, 249, 0.4), transparent)',
            transition: '0.5s',
          },
          '&:hover::before': {
            left: '100%',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.1) 0%, rgba(255, 0, 255, 0.1) 100%)',
          border: '1px solid rgba(0, 255, 249, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.2) 0%, rgba(255, 0, 255, 0.2) 100%)',
            boxShadow: '0 0 15px rgba(0, 255, 249, 0.3)',
          },
        },
        outlined: {
          borderColor: 'rgba(0, 255, 249, 0.5)',
          '&:hover': {
            borderColor: '#00fff9',
            boxShadow: '0 0 15px rgba(0, 255, 249, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, rgba(0, 255, 249, 0.02) 0%, rgba(255, 0, 255, 0.02) 100%)',
          borderRadius: 2,
          border: '1px solid rgba(0, 255, 249, 0.1)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
            opacity: 0.3,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '& fieldset': {
              borderColor: 'rgba(0, 255, 249, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 255, 249, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00fff9',
              boxShadow: '0 0 10px rgba(0, 255, 249, 0.2)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.02) 0%, rgba(255, 0, 255, 0.02) 100%)',
          borderRadius: 2,
          border: '1px solid rgba(0, 255, 249, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(0, 255, 249, 0.15)',
            borderColor: 'rgba(0, 255, 249, 0.3)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(0, 255, 249, 0.1)',
        },
        head: {
          fontWeight: 600,
          background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.05) 0%, rgba(255, 0, 255, 0.05) 100%)',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '&.MuiOutlinedInput-root': {
            backgroundColor: 'rgba(18, 21, 43, 0.7)',
            backdropFilter: 'blur(10px)',
            '& fieldset': {
              borderColor: 'rgba(0, 255, 249, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 255, 249, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00fff9',
              boxShadow: '0 0 10px rgba(0, 255, 249, 0.2)',
            },
          },
        },
        icon: {
          color: '#00fff9',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(18, 21, 43, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 255, 249, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 255, 249, 0.15)',
          '& .MuiMenuItem-root': {
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.1), rgba(255, 0, 255, 0.1))',
            },
            '&.Mui-selected': {
              background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.2), rgba(255, 0, 255, 0.2))',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.3), rgba(255, 0, 255, 0.3))',
              },
            },
          },
        },
      },
    },
  },
});

export default theme; 