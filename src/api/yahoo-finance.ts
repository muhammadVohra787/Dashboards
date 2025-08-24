export interface StockData {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    date_utc: number;
    adjclose: number;
}

const options = {
    method: "GET",
    headers: {
        "x-rapidapi-key": "83d741748fmsh3ce7af0c682901dp1f0c3djsn9351c8a7ec88",
        "x-rapidapi-host": "yahoo-finance15.p.rapidapi.com"
    }
};

export async function getStockData(symbol: string): Promise<StockData[]> {
    try {
        console.log("using rapid api")
        const url = `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/history?symbol=${symbol}&interval=5m&diffandsplits=false`;
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Extract values from the body object and map to StockData type
        const data: StockData[] = Object.values(result?.body || {}).map((item: any) => ({
            date: item.date,
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
            volume: item.volume,
            date_utc: item.date_utc,
            adjclose: item.adjclose
        }));

        return data
    } catch (error) {
        console.error(error);
        throw error;
    }
}
