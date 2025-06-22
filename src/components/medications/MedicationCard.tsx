
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BookmarkButton } from './BookmarkButton';
import type { Database } from '@/integrations/supabase/types';

type Medication = Database['public']['Tables']['medications']['Row'];

interface MedicationCardProps {
  medication: Medication;
}

export const MedicationCard = ({ medication }: MedicationCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle 
            className="text-lg font-semibold flex items-center gap-2 cursor-pointer flex-1"
            onClick={() => navigate(`/medications/${medication.id}`)}
          >
            <Pill className="h-5 w-5 text-primary" />
            {medication.medication_name}
          </CardTitle>
          {medication.high_alert && (
            <Badge variant="destructive" className="flex items-center gap-1 ml-2">
              <AlertTriangle className="h-3 w-3" />
              <span className="hidden sm:inline">High Alert</span>
              <span className="sm:hidden">Alert</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {medication.classification && medication.classification.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Classification:</p>
            <div className="flex flex-wrap gap-1">
              {medication.classification.slice(0, 3).map((cls) => (
                <Badge key={cls} variant="secondary" className="text-xs">
                  {cls}
                </Badge>
              ))}
              {medication.classification.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{medication.classification.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
        <div className="flex gap-2 mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 touch-manipulation min-h-[44px]"
            onClick={() => navigate(`/medications/${medication.id}`)}
          >
            View Details
          </Button>
          <BookmarkButton 
            medicationId={medication.id} 
            medicationName={medication.medication_name}
          />
        </div>
      </CardContent>
    </Card>
  );
};
