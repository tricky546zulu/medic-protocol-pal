import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SyringeIcon } from 'lucide-react'; // Or another suitable icon like Settings2Icon
import { cn } from '@/lib/utils';

// Define a more specific type for pump settings if possible, or use Record<string, any>
interface PumpSettings {
  medication_selection?: string;
  cca_setting?: string;
  line_option?: string;
  duration?: string;
  vtbi?: string;
  pump_instructions?: string;
  [key: string]: any; // Allow other potential fields
}

interface PumpSettingsDisplayProps {
  pumpSettings: PumpSettings;
  className?: string;
}

export const PumpSettingsDisplay = ({ pumpSettings, className }: PumpSettingsDisplayProps) => {
  const settingsToShow = [
    { label: 'Medication', value: pumpSettings.medication_selection },
    { label: 'CCA Setting', value: pumpSettings.cca_setting },
    { label: 'Line Option', value: pumpSettings.line_option },
    { label: 'Duration', value: pumpSettings.duration },
    { label: 'VTBI', value: pumpSettings.vtbi },
  ].filter(setting => setting.value); // Filter out settings with no value

  if (settingsToShow.length === 0 && !pumpSettings.pump_instructions) {
    return null; // Don't render if no settings or instructions
  }

  return (
    <Card className={cn("bg-primary/5 border-primary/20", className)}>
      <CardHeader className="py-2 px-3 sm:py-3 sm:px-4 border-b border-primary/10">
        <CardTitle className="text-sm font-semibold text-primary flex items-center gap-2">
          <SyringeIcon className="h-4 w-4" />
          IV Pump Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 space-y-2">
        {settingsToShow.map((setting) => (
          <div key={setting.label} className="text-xs sm:text-sm flex justify-between">
            <span className="font-medium text-primary/90">{setting.label}:</span>
            <span className="text-right text-foreground/90 break-words ml-2">{setting.value}</span>
          </div>
        ))}
        {pumpSettings.pump_instructions && (
          <div className="pt-2 mt-2 border-t border-primary/10">
            <p className="text-xs sm:text-sm text-primary/90 font-medium mb-1">Instructions:</p>
            <p className="text-xs sm:text-sm text-foreground/90 whitespace-pre-wrap break-words">
              {pumpSettings.pump_instructions}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
