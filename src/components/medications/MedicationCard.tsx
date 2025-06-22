
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

  const getClassificationColor = (index: number) => {
    const colors = [
      'bg-blue-50 text-blue-700',
      'bg-rose-50 text-rose-700',
      'bg-violet-50 text-violet-700',
      'bg-amber-50 text-amber-700',
      'bg-emerald-50 text-emerald-700',
    ];
    return colors[index % colors.length];
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <CardHeader className="p-4 border-b border-gray-100">
        <CardTitle 
          className="text-base font-semibold flex items-center gap-3 cursor-pointer hover:text-violet-600 transition-colors"
          onClick={() => navigate(`/medications/${medication.id}`)}
        >
          <div className="flex-shrink-0 p-2 bg-violet-50 rounded-lg">
            <Pill className="h-4 w-4 text-violet-600" />
          </div>
          <span className="text-gray-900 truncate">{medication.medication_name}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {medication.classification && medication.classification.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Classification</p>
            <div className="flex flex-wrap gap-1">
              {medication.classification.slice(0, 3).map((cls, index) => (
                <Badge key={cls} variant="secondary" className={`text-xs px-2 py-1 rounded ${getClassificationColor(index)}`}>
                  <span className="truncate max-w-24">{cls}</span>
                </Badge>
              ))}
              {medication.classification.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded">
                  +{medication.classification.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {medication.high_alert && (
          <Badge variant="destructive" className="flex items-center gap-1 w-fit bg-red-500 text-white text-xs px-2 py-1 rounded">
            <AlertTriangle className="h-3 w-3" />
            HIGH ALERT
          </Badge>
        )}

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-8 rounded border-gray-200 hover:border-violet-300 hover:bg-violet-50 text-sm text-gray-700 hover:text-violet-700"
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
