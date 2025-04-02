
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ModelAccuracyChartProps {
  title: string;
  data: Array<{
    day: number;
    actual: number;
    predicted: number;
  }>;
  color?: string;
}

const ModelAccuracyChart = ({ title, data, color = "#3b82f6" }: ModelAccuracyChartProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="day"
                label={{ value: 'Day', position: 'insideBottomRight', offset: -10 }}
              />
              <YAxis
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  return [`$${value.toFixed(2)}`, name === 'actual' ? 'Actual Price' : 'Predicted Price'];
                }}
                labelFormatter={(label) => `Day ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#ef4444"
                name="Actual Price"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke={color}
                name="Predicted Price"
                strokeWidth={2}
                dot={{ r: 3 }}
                strokeDasharray="3 3"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelAccuracyChart;
