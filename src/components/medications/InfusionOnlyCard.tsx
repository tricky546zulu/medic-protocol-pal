
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Added CardHeader, CardTitle
import { Badge } from '@/components/ui/badge';
import { SyringeIcon, AlertTriangleIcon, InfoIcon } from 'lucide-react'; // Updated Icons
import type { Database } from '@/integrations/supabase/types';
import { cn } from '@/lib/utils';
import { PumpSettingsDisplay } from './PumpSettingsDisplay'; // Import PumpSettingsDisplay

type MedicationDosing = Database['public']['Tables']['medication_dosing']['Row'];

interface InfusionOnlyCardProps {
  dosing: MedicationDosing;
  isHighAlert?: boolean;
}

export const InfusionOnlyCard = ({ dosing, isHighAlert = false }: InfusionOnlyCardProps) => {
  const pumpSettings = dosing.infusion_pump_settings as any; // Keep type assertion for now
  const hasPumpSettings = pumpSettings &&
                          (pumpSettings.medication_selection || pumpSettings.cca_setting || pumpSettings.line_option || pumpSettings.duration || pumpSettings.vtbi || pumpSettings.pump_instructions);

  return (
    <Card className={cn(
        "bg-card border border-border shadow-sm",
        isHighAlert && "border-destructive/30 bg-destructive/5" // Subtle high alert theming
      )}
    >
      <CardHeader className="pb-3 pt-4 px-4"> {/* Adjusted padding */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base font-semibold text-foreground break-words leading-tight">
              {dosing.indication || "Indication not specified"}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">Continuous Infusion</p> {/* Consistent margin */}
          </div>
          {isHighAlert && (
            <Badge variant="destructive" className="text-xs items-center gap-1 flex-shrink-0">
              <AlertTriangleIcon className="h-3 w-3" />
              High Alert
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0"> {/* Adjusted padding */}
        {/* Primary Medication Selection (if available) */}
        {pumpSettings?.medication_selection && (
          <div className={cn(
              "rounded-md p-3 sm:p-4 mb-3 sm:mb-4 text-center",
              isHighAlert ? "bg-destructive/10" : "bg-primary/10" // Themed background
            )}
          >
            <div className={cn(
                "text-md sm:text-lg font-semibold break-words",
                isHighAlert ? "text-destructive-foreground" : "text-primary" // Themed text
              )}
            >
              {pumpSettings.medication_selection}
            </div>
            {dosing.concentration_supplied && (
              <div className={cn(
                  "text-xs sm:text-sm mt-1 break-words",
                  isHighAlert ? "text-destructive-foreground/80" : "text-primary/80" // Themed text
                )}
              >
                Supply: {dosing.concentration_supplied}
              </div>
            )}
          </div>
        )}

        {/* Pump Settings Display Component */}
        {hasPumpSettings && pumpSettings && (
          <PumpSettingsDisplay pumpSettings={pumpSettings} className="mb-3 sm:mb-4" />
        )}

        {/* Notes */}
        {dosing.notes && dosing.notes.length > 0 && (
           <div className={cn(
            "rounded-md p-3 mt-3 sm:mt-4",
            isHighAlert ? "bg-destructive/10" : "bg-amber-500/10 border border-amber-500/20"
            )}
          >
            <h4 className={cn(
                "text-sm font-semibold mb-1.5 flex items-center gap-1.5",
                isHighAlert ? "text-destructive-foreground" : "text-amber-700 dark:text-amber-400"
              )}
            >
              <InfoIcon className="h-4 w-4" />
              Important Notes
            </h4>
            <ul className="space-y-1 pl-1">
              {dosing.notes.map((note, index) => (
                <li key={index} className={cn(
                    "text-xs sm:text-sm break-words flex items-start gap-1.5",
                    isHighAlert ? "text-destructive-foreground/90" : "text-amber-800 dark:text-amber-300"
                  )}
                >
                  <span className="mt-0.5">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
