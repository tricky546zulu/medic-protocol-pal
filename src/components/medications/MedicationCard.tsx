
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
    <Card className="bg-white border border-gray-200 hover:border-gray-300 transition-colors duration-200 shadow-sm hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle 
          className="text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-200 flex items-start gap-3"
          onClick={() => navigate(`/medications/${medication.id}`)}
        >
          <div className="flex-shrink-0 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mt-0.5">
            <Pill className="h-4 w-4 text-blue-600" />
          </div>
          <span className="leading-tight">{medication.medication_name}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {medication.classification && medication.classification.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Classification</p>
            <div className="flex flex-wrap gap-1.5">
              {medication.classification.slice(0, 3).map((cls, index) => (
                <Badge key={cls} variant="secondary" className="text-xs px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border-0">
                  {cls}
                </Badge>
              ))}
              {medication.classification.length > 3 && (
                <Badge variant="secondary" className="text-xs px-2 py-1 bg-gray-100 text-gray-600 border-0">
                  +{medication.classification.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {medication.high_alert && (
          <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <span className="text-sm font-medium text-red-700">High Alert Medication</span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-sm border-gray-300 hover:bg-gray-50 hover:border-gray-400"
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
