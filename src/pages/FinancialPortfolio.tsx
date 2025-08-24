import { useState, useEffect, useMemo } from 'react';
import { getStockData, StockData } from '../api/yahoo-finance';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, ComposedChart, Bar } from 'recharts';
import { Container, Paper, Typography, Select, MenuItem, InputLabel, Box, FormControl } from '@mui/material';

interface GenericTooltipProps {
    active: boolean;
    payload: any;
    label: string;
    selectedColor: string;
    keys?: string[]; // optional array of keys to display
}

const GenericTooltip = ({ active, payload, label, selectedColor, keys = ['close'] }: GenericTooltipProps) => {
    if (!active || !payload?.length) return null;

    return (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 3, backgroundColor: selectedColor, marginLeft: 4, opacity: 0.8 }}>
            {keys.map(key => (
                <Typography key={key} variant="body1">
                    {key}: {payload[0]?.payload?.[key]?.toFixed?.(key === 'volume' ? 0 : 2) || payload[0]?.payload?.[key]}
                </Typography>
            ))}
            <Typography variant="body2">date: {label}</Typography>
        </Paper>
    );
};


// First, define the interface for the props
interface StockSelectorProps {
    setSelectedStock: (stock: string) => void;
    selectedStock: string;
    selectedColor: string;
    setSelectedColor: (color: string) => void;
}

// Then fix the component definition - use curly braces instead of parentheses
const StockSelector: React.FC<StockSelectorProps> = ({ setSelectedStock, selectedStock, selectedColor, setSelectedColor }) => {
    const possibleStocks: Record<string, string> = {
        AAPL: "Apple -  #A2AAAD",
        GOOG: "Google - #4285F4",
        MSFT: "Microsoft -  #F25022",
        AMZN: "Amazon - #FF9900",
        TSLA: "Tesla - #CC0000",
        NVDA: "NVIDIA - #76B900",
        NFLX: "Netflix - #E50914",
        META: "Meta - #1877F2",
    };


    return (
        <Box sx={{ width: '100%', alignItems: 'center', justifyContent: 'center', margin: 'auto' }}>
            <Typography variant="h6" align="center" gutterBottom sx={{ mb: 4 }}>Selected Stock: {selectedStock}</Typography>
            <FormControl fullWidth>
                <InputLabel>Stock</InputLabel>
                <Select label="Stock" value={selectedStock} onChange={(e) => {
                    setSelectedColor(possibleStocks[e.target.value as keyof typeof possibleStocks].split(" - ")[1]);
                    setSelectedStock(e.target.value as string);
                }}>
                    {Object.keys(possibleStocks).map((stock) => (
                        <MenuItem key={stock} value={stock}>
                            {possibleStocks[stock as keyof typeof possibleStocks].split(" - ")[0]}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

const FinancialPortfolio = () => {
    const [allStockData, setAllStockData] = useState<StockData[]>([]);
    const [selectedStock, setSelectedStock] = useState<string>("AAPL");
    const [selectedColor, setSelectedColor] = useState<string>("#A2AAAD");
    const [selectedDate, setSelectedDate] = useState<string>("");

    // Fetch stock data when stock changes
    useEffect(() => {
        const fetchStockData = async () => {
            const data = await getStockData(selectedStock);
            setAllStockData(data);
            // Set first date as default when new data loads
            if (data.length > 0) {
                setSelectedDate(data[0].date);
            }
        };
        fetchStockData();
    }, [selectedStock]);

    // Filter data based on selected date - keep all data cached
    const filteredStockData = useMemo(() => {
        if (!selectedDate || !allStockData.length) return allStockData;
        return allStockData.filter(sd => sd.date === selectedDate);
    }, [allStockData, selectedDate]);

    // Get unique dates for the date selector
    const uniqueDates = useMemo(() => {
        return [...new Set(allStockData.map(sd => sd.date))];
    }, [allStockData]);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
                Financial Portfolio
            </Typography>

            <StockSelector setSelectedStock={setSelectedStock} selectedStock={selectedStock} selectedColor={selectedColor} setSelectedColor={setSelectedColor} />

            <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                <InputLabel>Date</InputLabel>
                <Select
                    label="Date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                >
                    {uniqueDates.map((date) => (
                        <MenuItem key={date} value={date}>
                            {date}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {filteredStockData.length > 0 ? (
                <>
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={filteredStockData} margin={{ top: 20, right: 20, bottom: 20, left: -25 }}>
                            <XAxis dataKey="date" tick={{ dy: 10 }} />
                            <YAxis
                                domain={['dataMin - 1', 'dataMax + 1']}
                                tick={true}
                                axisLine={true}
                                tickLine={true}
                                tickFormatter={(value) => value.toFixed(0)}
                            />
                            <Tooltip content={<GenericTooltip active={false} payload={undefined} label={''} selectedColor={selectedColor} keys={['close']} />} />
                            <Legend verticalAlign="top" align="center" />
                            <Area
                                type="linear"
                                dataKey="close"
                                stroke={selectedColor}
                                fill={selectedColor}
                                fillOpacity={0.3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>

                    <ResponsiveContainer width="100%" height={400} >
                        <LineChart data={filteredStockData} margin={{ top: 20, right: 20, bottom: 20, left: -25 }}>
                            <XAxis dataKey="date" />
                            <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                            <Line dataKey="close" stroke={selectedColor} type="linear" />
                            <Line dataKey="high" stroke="red" type="linear" />
                            <Line dataKey="low" stroke="blue" type="linear" />
                            <CartesianGrid vertical={true} horizontal={true} />
                            <Tooltip content={<GenericTooltip active={false} payload={undefined} label={''} selectedColor={selectedColor} keys={['volume', 'close', 'high', 'low']} />} />
                            <Legend />
                        </LineChart>
                    </ResponsiveContainer>

                    <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart data={filteredStockData} margin={{ top: 20, right: 20, bottom: 20, left: -25 }}>
                            <XAxis dataKey="date" />
                            <YAxis axisLine={false} tickLine={false} tick={false} />
                            <Bar dataKey="close" name="close" fill={selectedColor} />
                            <Bar dataKey="volume" name="volume" fill="#82ca9d" />
                            <Tooltip content={<GenericTooltip active={false} payload={undefined} label={''} selectedColor={selectedColor} keys={['volume', 'close']} />} />
                            <Legend />
                        </ComposedChart>
                    </ResponsiveContainer>
                </>
            ) : (
                <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                    Loading stock data...
                </Typography>
            )}
        </Container>
    )
}

export default FinancialPortfolio;