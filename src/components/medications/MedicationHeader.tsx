
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BriefcaseMedicalIcon, AlertTriangleIcon } from 'lucide-react'; // Updated Icons
import { BookmarkButton } from './BookmarkButton';
import type { Database } from '@/integrations/supabase/types';
import { cn } from '@/lib/utils';

type Medication = Database['public']['Tables']['medications']['Row'];

interface MedicationHeaderProps {
  medication: Medication;
}

export const MedicationHeader = ({ medication }: MedicationHeaderProps) => {
  return (
    <div
      className={cn(
        "mb-6 p-4 sm:p-5 bg-card border border-border rounded-lg shadow-sm", // Use themed styles, responsive padding
        medication.high_alert && "bg-destructive/5 border-destructive/20" // Subtle highlight for high alert
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className={cn(
            "flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center",
            medication.high_alert && "bg-destructive/10"
          )}>
            <BriefcaseMedicalIcon
              className={cn("h-5 w-5 text-primary", medication.high_alert && "text-destructive")}
            />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-1.5 break-words leading-tight">
              {medication.medication_name}
            </h1>
            {medication.classification && medication.classification.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {medication.classification.slice(0, 5).map((cls: string, index: number) => ( // Type cls, show 5
                  <Badge
                    key={index}
                    variant={medication.high_alert ? "destructive_secondary" : "secondary"} // Themed badge
                    className="text-xs truncate max-w-[150px] sm:max-w-[200px]" // Responsive max-width
                    title={cls}
                  >
                    {cls}
                  </Badge>
                ))}
                {medication.classification.length > 5 && (
                  <Badge variant={medication.high_alert ? "destructive_secondary" : "secondary"} className="text-xs">
                    +{medication.classification.length - 5} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0 sm:ml-4">
          {medication.high_alert && (
            <Badge variant="destructive" className="items-center gap-1.5 py-1 px-2 text-xs order-first sm:order-none">
              <AlertTriangleIcon className="h-3.5 w-3.5" />
              High Alert Medication
            </Badge>
          )}
          <BookmarkButton
            medicationId={medication.id}
            medicationName={medication.medication_name}
            size="default" // Use default button size for more prominence
            className={cn(medication.high_alert && "mt-1 sm:mt-0")} // Add margin if high_alert badge is present on mobile
          />
        </div>
      </div>
    </div>
  );
};
