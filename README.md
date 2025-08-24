# Dashboard Management System

A modern, responsive dashboard application built with React, TypeScript, and Material-UI for managing and visualizing various types of data including employee information and financial portfolios.

## Features

### 📊 Employee Management Dashboard
- Interactive data grid with employee information
- Department-wise analytics and visualizations
- Employee search and filtering capabilities
- Responsive charts using Recharts library

### 💰 Financial Portfolio Dashboard
- Real-time stock data visualization using Yahoo Finance API
- Interactive charts (Area, Line, Composed charts)
- Stock selector with multiple companies (AAPL, GOOG, MSFT, AMZN, TSLA, NVDA, NFLX, META)
- Date-based filtering with cached data for performance
- Custom tooltips and color-coded visualizations

### 🎨 Modern UI/UX
- Dark theme with custom Material-UI styling
- Responsive navigation bar
- Clean, professional design
- Mobile-friendly interface

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Material-UI (MUI)
- **Charts**: Recharts
- **Routing**: TanStack Router
- **API Integration**: Yahoo Finance API via RapidAPI
- **Styling**: Custom MUI theme with dark mode

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd dashboard-project
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add your RapidAPI key:
```env
VITE_RAPIDAPI_KEY=your_rapidapi_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── api/                    # API integration files
│   ├── yahoo-finance.ts   # Financial data API
│   └── faker-api.ts       # Mock employee data
├── components/            # Reusable components
│   └── ResponsiveAppBar.tsx
├── pages/                 # Main dashboard pages
│   ├── EmployeeManagerDashboard.tsx
│   └── FinancialPortfolio.tsx
├── router/                # Routing configuration
│   └── router.tsx
├── theme.ts              # Material-UI theme configuration
└── main.tsx              # Application entry point
```

## Available Routes

- `/` - Employee Management Dashboard
- `/financial` - Financial Portfolio Dashboard

## API Integration

The application integrates with Yahoo Finance API through RapidAPI for real-time stock data. Make sure to configure your API key in the environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.