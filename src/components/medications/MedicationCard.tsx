
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

  // Get color based on classification
  const getClassificationColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-rose-100 text-rose-800 border-rose-200',
      'bg-violet-100 text-violet-800 border-violet-200',
      'bg-amber-100 text-amber-800 border-amber-200',
      'bg-emerald-100 text-emerald-800 border-emerald-200',
    ];
    return colors[index % colors.length];
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 group overflow-hidden">
      <CardHeader className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3">
          <CardTitle 
            className="text-base font-semibold flex items-center gap-3 cursor-pointer flex-1 hover:text-violet-700 transition-colors duration-200 min-w-0"
            onClick={() => navigate(`/medications/${medication.id}`)}
          >
            <div className="flex-shrink-0 p-2 bg-violet-100 rounded-lg border border-violet-200">
              <Pill className="h-4 w-4 text-violet-700" />
            </div>
            <span className="text-gray-900 leading-tight truncate">{medication.medication_name}</span>
          </CardTitle>
          {medication.high_alert && (
            <Badge variant="destructive" className="flex items-center gap-1 flex-shrink-0 px-2 py-1 rounded-lg text-xs font-medium bg-red-500 text-white border-red-500 whitespace-nowrap">
              <AlertTriangle className="h-3 w-3" />
              <span className="hidden sm:inline">HIGH ALERT</span>
              <span className="sm:hidden">ALERT</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {medication.classification && medication.classification.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Classification</p>
            <div className="flex flex-wrap gap-1">
              {medication.classification.slice(0, 3).map((cls, index) => (
                <Badge key={cls} variant="secondary" className={`text-xs px-2 py-1 rounded-lg border font-medium max-w-full ${getClassificationColor(index)}`}>
                  <span className="truncate">{cls}</span>
                </Badge>
              ))}
              {medication.classification.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-lg border border-gray-200 font-medium">
                  +{medication.classification.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-9 rounded-lg border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-colors text-sm font-medium text-gray-700 hover:text-violet-700"
            onClick={() => navigate(`/medications/${medication.id}`)}
          >
            View Details
          </Button>
          <div className="flex-shrink-0">
            <BookmarkButton 
              medicationId={medication.id} 
              medicationName={medication.medication_name}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
