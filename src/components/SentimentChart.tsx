
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SentimentData } from "@/services/stockService";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { cn } from "@/lib/utils";

interface SentimentChartProps {
  data: SentimentData;
  title?: string;
}

const SentimentChart = ({ data, title = "Sentiment Analysis" }: SentimentChartProps) => {
  const chartData = [
    { name: 'Positive', value: data.positive },
    { name: 'Negative', value: data.negative },
    { name: 'Neutral', value: data.neutral }
  ];
  
  const COLORS = ['#10b981', '#ef4444', '#3b82f6'];
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className={cn(
            "mt-2 px-4 py-2 rounded-full text-white text-sm font-medium",
            data.overall === 'positive' ? "bg-green-500" : 
            data.overall === 'negative' ? "bg-red-500" : "bg-blue-500"
          )}>
            Overall: {data.overall === 'positive' ? 'Positive' : 
                     data.overall === 'negative' ? 'Negative' : 'Neutral'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentChart;
