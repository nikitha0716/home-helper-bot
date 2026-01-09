import { memo } from 'react';
import { Package, AlertTriangle } from 'lucide-react';

interface WeightIndicatorProps {
  weight: number;
  maxWeight: number;
}

/**
 * Weight Indicator - Shows current load weight
 * Highlights if near or over limit
 */
export const WeightIndicator = memo(function WeightIndicator({
  weight,
  maxWeight,
}: WeightIndicatorProps) {
  const percentage = (weight / maxWeight) * 100;
  const isWarning = percentage >= 80 && percentage < 100;
  const isOverload = percentage >= 100;

  return (
    <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors ${
      isOverload 
        ? 'bg-destructive/10 border border-destructive/30' 
        : isWarning 
          ? 'bg-warning/10 border border-warning/30' 
          : 'bg-secondary/50'
    }`}>
      {isOverload ? (
        <AlertTriangle className="w-4 h-4 text-destructive" />
      ) : (
        <Package className={`w-4 h-4 ${isWarning ? 'text-warning' : 'text-muted-foreground'}`} />
      )}
      <span className={`text-sm font-mono font-medium ${
        isOverload 
          ? 'text-destructive' 
          : isWarning 
            ? 'text-warning' 
            : 'text-foreground'
      }`}>
        {weight.toFixed(1)} kg
      </span>
      {(isWarning || isOverload) && (
        <span className="text-[10px] text-muted-foreground">
          / {maxWeight} kg
        </span>
      )}
    </div>
  );
});
