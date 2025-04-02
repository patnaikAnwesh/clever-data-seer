
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PredictionData } from "@/services/stockService";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PredictionCardProps {
  data: PredictionData;
  currentPrice: number;
  colorScheme?: 'green' | 'blue' | 'red' | 'yellow';
}

const PredictionCard = ({ 
  data, 
  currentPrice,
  colorScheme = 'blue' 
}: PredictionCardProps) => {
  const isPositive = data.predictedClose > currentPrice;
  const change = data.predictedClose - currentPrice;
  const changePercent = (change / currentPrice) * 100;
  
  const getColor = () => {
    switch (colorScheme) {
      case 'green': return 'bg-green-500 text-white';
      case 'red': return 'bg-red-500 text-white';
      case 'yellow': return 'bg-yellow-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className={cn("py-3 px-4", getColor())}>
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>
            {data.modelType === 'ARIMA' ? 'ARIMA' : 
             data.modelType === 'LSTM' ? 'LSTM' : 
             'Linear Regression'}
          </span>
          <Badge variant="outline" className="text-xs bg-white/20 hover:bg-white/30">
            MAPE: {data.mape.toFixed(2)}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold">
            ${data.predictedClose.toFixed(2)}
          </div>
          <div className={cn(
            "text-sm mt-1",
            isPositive ? "text-stock-green" : "text-stock-red"
          )}>
            {isPositive ? "+" : ""}{change.toFixed(2)} ({isPositive ? "+" : ""}{changePercent.toFixed(2)}%)
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Prediction for {new Date(data.date).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionCard;
