
import { useEffect, useRef } from 'react';
import { StockData } from '@/services/stockService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';

interface StockChartProps {
  data: StockData[];
  title: string;
  className?: string;
  height?: number;
  showVolume?: boolean;
}

const StockChart = ({ data, title, className, height = 300, showVolume = false }: StockChartProps) => {
  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Prepare data for chart
  const chartData = data.map((item) => ({
    date: item.date,
    price: item.close,
    volume: item.volume / 1000000, // Convert to millions for readability
  }));

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: height }}>
          <ResponsiveContainer>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis} 
                minTickGap={30}
              />
              <YAxis 
                yAxisId="left"
                orientation="left"
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value}`}
              />
              {showVolume && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `${value}M`}
                />
              )}
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === 'price') return [`$${value.toFixed(2)}`, 'Price'];
                  if (name === 'volume') return [`${value.toFixed(2)}M`, 'Volume'];
                  return [value, name];
                }}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                activeDot={{ r: 6 }}
                name="price"
                strokeWidth={2}
              />
              {showVolume && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="volume"
                  stroke="#10b981"
                  name="volume"
                  strokeWidth={1.5}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChart;
