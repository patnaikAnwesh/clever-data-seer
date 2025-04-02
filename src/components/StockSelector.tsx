
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { availableSymbols } from "@/services/stockService";

interface StockSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const StockSelector = ({ value, onChange }: StockSelectorProps) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div className="h-10 w-40 rounded-md border border-input bg-background px-3 py-2 animate-pulse">
        Loading...
      </div>
    );
  }
  
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Select stock" />
      </SelectTrigger>
      <SelectContent>
        {availableSymbols.map(symbol => (
          <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StockSelector;
