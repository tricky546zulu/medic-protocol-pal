
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangleIcon, BriefcaseMedicalIcon, InfoIcon } from 'lucide-react'; // Updated Icons
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BookmarkButton } from './BookmarkButton';
import type { Database } from '@/integrations/supabase/types';
import { cn } from '@/lib/utils';

type Medication = Database['public']['Tables']['medications']['Row'];

interface MedicationCardProps {
  medication: Medication;
}

export const MedicationCard = ({ medication }: MedicationCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className={cn(
        "bg-card border border-border hover:shadow-lg transition-all duration-200 flex flex-col h-full", // Ensure card takes full height for grid layouts
        medication.high_alert && "border-destructive/30 hover:border-destructive/50" // Highlight high-alert meds
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle 
          className="text-base font-semibold text-foreground cursor-pointer hover:text-primary transition-colors duration-200 flex items-start gap-2.5"
          onClick={() => navigate(`/medications/${medication.id}`)}
        >
          <div className={cn(
            "flex-shrink-0 w-7 h-7 bg-primary/10 rounded-md flex items-center justify-center mt-0.5",
            medication.high_alert && "bg-destructive/10"
            )}>
            <BriefcaseMedicalIcon className={cn("h-4 w-4 text-primary", medication.high_alert && "text-destructive")} />
          </div>
          <span className="leading-tight flex-1">{medication.medication_name}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3 flex-grow flex flex-col"> {/* Allow content to grow */}
        {medication.classification && medication.classification.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">Classification</p>
            <div className="flex flex-wrap gap-1">
              {medication.classification.slice(0, 3).map((cls: string) => ( // Explicitly type cls
                <Badge key={cls} variant="secondary" className="text-xs">
                  {cls}
                </Badge>
              ))}
              {medication.classification.length > 3 && (
                <Badge variant="outline" className="text-xs font-normal">
                  +{medication.classification.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {medication.high_alert && (
          <Badge variant="destructive" className="inline-flex items-center gap-1.5 py-1 px-2 text-xs mt-1">
            <AlertTriangleIcon className="h-3.5 w-3.5" />
            High Alert Medication
          </Badge>
        )}

        <div className="flex-grow"></div> {/* Spacer to push buttons to the bottom */}

        <div className="flex gap-2 pt-2 border-t border-border -mx-6 px-6 pb-0"> {/* Negative margin to extend border */}
          <Button 
            variant="ghost" // Changed to ghost for a less prominent look, primary action is bookmark or title click
            size="sm" 
            className="flex-1 text-sm text-primary hover:bg-primary/10" // Themed hover
            onClick={() => navigate(`/medications/${medication.id}`)}
          >
            <InfoIcon className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <BookmarkButton 
            medicationId={medication.id} 
            medicationName={medication.medication_name}
            size="sm" // Ensure consistent button size
          />
        </div>
      </CardContent>
    </Card>
  );
};
