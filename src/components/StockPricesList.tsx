
import { useState, useEffect } from "react";
import { StockData, availableSymbols, fetchStockData } from "@/services/stockService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const StockPricesList = () => {
  const [stocksData, setStocksData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAllStocksData = async () => {
      try {
        setLoading(true);
        const promises = availableSymbols.map(symbol => fetchStockData(symbol));
        const results = await Promise.all(promises);
        setStocksData(results);
      } catch (error) {
        console.error("Error fetching all stocks data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch stock data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllStocksData();
  }, [toast]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Latest Stock Prices</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead className="hidden md:table-cell">Open</TableHead>
                  <TableHead className="hidden md:table-cell">High</TableHead>
                  <TableHead className="hidden md:table-cell">Low</TableHead>
                  <TableHead className="hidden md:table-cell">Volume</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocksData.map((stock) => {
                  const isPositive = stock.change >= 0;
                  return (
                    <TableRow key={stock.symbol}>
                      <TableCell className="font-medium">{stock.symbol}</TableCell>
                      <TableCell>${stock.close.toFixed(2)}</TableCell>
                      <TableCell className={cn(
                        "font-medium flex items-center",
                        isPositive ? "text-stock-green" : "text-stock-red"
                      )}>
                        {isPositive ? (
                          <ArrowUpIcon className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownIcon className="h-3 w-3 mr-1" />
                        )}
                        {isPositive ? "+" : ""}
                        {stock.change.toFixed(2)} ({isPositive ? "+" : ""}
                        {stock.changePercent.toFixed(2)}%)
                      </TableCell>
                      <TableCell className="hidden md:table-cell">${stock.open.toFixed(2)}</TableCell>
                      <TableCell className="hidden md:table-cell">${stock.high.toFixed(2)}</TableCell>
                      <TableCell className="hidden md:table-cell">${stock.low.toFixed(2)}</TableCell>
                      <TableCell className="hidden md:table-cell">{(stock.volume / 1000000).toFixed(2)}M</TableCell>
                      <TableCell className="hidden md:table-cell">{new Date(stock.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockPricesList;
