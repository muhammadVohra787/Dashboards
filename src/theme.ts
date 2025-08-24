import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#191b1f',
    },
    background: {
      default: '#0a0230', // ← background for <body>
      paper: '#0a0187',   // ← background for Paper, Cards, etc.

    },
    text: {
      primary: '#ffffff',        // Main white text
      secondary: '#b0b3c0',      // Subtle/off-white text (labels, helper)
      disabled: '#7a7a7a',       // Disabled/placeholder
    },
    
  },
  typography: {
    fontFamily: '"Roboto", "Lato", sans-serif',
    h1: {
      fontFamily: '"Lato", sans-serif',
    },
    h2: {
      fontFamily: '"Lato", sans-serif',

    },
    h3: {
      fontFamily: '"Lato", sans-serif',

    },
    body1: {
      fontFamily: '"Roboto", sans-serif',

    },
    body2: {
      fontFamily: '"Roboto", sans-serif',
    },
  },
});
  