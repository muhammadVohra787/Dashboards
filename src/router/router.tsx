// router.tsx
import { createRouter, createRootRoute, createRoute, RouterProvider } from '@tanstack/react-router';
import RootLayout from './RootLayout';
import Dashboard1 from '../pages/EmployeeManagerDashboard';
import FinancialPortfolio from '../pages/FinancialPortfolio';

// Use RootLayout as the root "wrapper"
const rootRoute = createRootRoute({
  component: RootLayout,
});

const homeRoute = createRoute({
  path: '/',
  getParentRoute: () => rootRoute,
  component: Dashboard1,
});

const financialPortfolioRoute = createRoute({
  path: '/financial',
  getParentRoute: () => rootRoute,
  component: FinancialPortfolio,
});

const routeTree = rootRoute.addChildren([homeRoute, financialPortfolioRoute]);
export const router = createRouter({ routeTree });

export function AppRouter() {
  return <RouterProvider router={router} />;
}
