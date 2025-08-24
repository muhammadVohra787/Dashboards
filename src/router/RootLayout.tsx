// components/RootLayout.tsx
import { Outlet } from '@tanstack/react-router';
import ResponsiveAppBar from '../components/ResponsiveAppBar';

export default function RootLayout() {
  return (
    <>
      <ResponsiveAppBar />
      <Outlet />
    </>
  );
}
