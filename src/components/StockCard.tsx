
import { StockData } from "@/services/stockService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockCardProps {
  data: StockData;
}

const StockCard = ({ data }: StockCardProps) => {
  const isPositive = data.change >= 0;
  
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{data.symbol}</span>
          <span 
            className={cn(
              "text-base font-medium",
              isPositive ? "text-stock-green" : "text-stock-red"
            )}
          >
            ${data.close.toFixed(2)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-500">Open</span>
            <span className="font-medium">${data.open.toFixed(2)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">High</span>
            <span className="font-medium">${data.high.toFixed(2)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">Low</span>
            <span className="font-medium">${data.low.toFixed(2)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">Change</span>
            <span className={cn(
              "font-medium flex items-center",
              isPositive ? "text-stock-green" : "text-stock-red"
            )}>
              {isPositive ? (
                <ArrowUpIcon className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              )}
              {isPositive ? "+" : ""}
              {data.change.toFixed(2)} ({isPositive ? "+" : ""}
              {data.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          <span>Vol: {(data.volume / 1000000).toFixed(2)}M</span>
          <span className="ml-3">{new Date(data.date).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockCard;
