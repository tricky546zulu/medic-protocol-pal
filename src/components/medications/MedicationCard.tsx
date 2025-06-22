
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
    <Card className="border-0 shadow-lg bg-white rounded-xl hover:shadow-xl transition-all duration-200 group overflow-hidden">
      <CardHeader className="p-4 bg-gray-50/80 border-b border-gray-100">
        <div className="flex items-center justify-between gap-3">
          <CardTitle 
            className="text-lg font-semibold flex items-center gap-3 cursor-pointer flex-1 hover:text-blue-600 transition-colors duration-200 min-w-0"
            onClick={() => navigate(`/medications/${medication.id}`)}
          >
            <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg group-hover:scale-105 transition-transform duration-200">
              <Pill className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-gray-900 leading-tight truncate">{medication.medication_name}</span>
          </CardTitle>
          {medication.high_alert && (
            <Badge variant="destructive" className="flex items-center gap-1 flex-shrink-0 px-2 py-1 rounded-lg text-xs font-medium bg-red-500 hover:bg-red-600 transition-colors">
              <AlertTriangle className="h-3 w-3" />
              Alert
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {medication.classification && medication.classification.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Classification</p>
            <div className="flex flex-wrap gap-2">
              {medication.classification.slice(0, 3).map((cls) => (
                <Badge key={cls} variant="secondary" className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md border border-gray-200 font-normal">
                  {cls}
                </Badge>
              ))}
              {medication.classification.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md border border-blue-200 font-normal">
                  +{medication.classification.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-9 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-sm font-medium text-gray-700 hover:text-blue-700"
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
