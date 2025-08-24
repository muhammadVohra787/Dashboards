// index.tsx
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { AppRouter } from './router/router';

/**// "dev": "concurrently \"server\\venv\\Scripts\\activate && python server\\main.py\" \"vite\"", */
createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AppRouter />   {/* everything, including ResponsiveAppBar, is now inside */}
  </ThemeProvider>
);
