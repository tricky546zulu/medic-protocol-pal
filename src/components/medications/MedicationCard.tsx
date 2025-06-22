
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
    <Card className="bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl hover:shadow-xl transition-all duration-200 group overflow-hidden shadow-lg">
      <CardHeader className="p-6 bg-gray-50/60 backdrop-blur-sm border-b border-gray-100/50">
        <div className="flex items-center justify-between gap-4">
          <CardTitle 
            className="text-lg font-semibold flex items-center gap-3 cursor-pointer flex-1 hover:text-blue-600 transition-colors duration-200 min-w-0"
            onClick={() => navigate(`/medications/${medication.id}`)}
          >
            <div className="flex-shrink-0 p-3 bg-blue-100/70 rounded-xl group-hover:scale-105 transition-transform duration-200 backdrop-blur-sm border border-blue-200/30">
              <Pill className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-gray-900 leading-tight truncate">{medication.medication_name}</span>
          </CardTitle>
          {medication.high_alert && (
            <Badge variant="destructive" className="flex items-center gap-1 flex-shrink-0 px-3 py-1 rounded-xl text-xs font-medium bg-red-500/90 hover:bg-red-600/90 transition-colors backdrop-blur-sm border border-red-300/30">
              <AlertTriangle className="h-3 w-3" />
              Alert
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {medication.classification && medication.classification.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wide">Classification</p>
            <div className="flex flex-wrap gap-2">
              {medication.classification.slice(0, 3).map((cls) => (
                <Badge key={cls} variant="secondary" className="text-xs bg-white/70 text-gray-700 px-3 py-1 rounded-xl border border-gray-200/50 font-normal backdrop-blur-sm">
                  {cls}
                </Badge>
              ))}
              {medication.classification.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-blue-50/70 text-blue-600 px-3 py-1 rounded-xl border border-blue-200/50 font-normal backdrop-blur-sm">
                  +{medication.classification.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        <div className="flex gap-3 mt-5">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-10 rounded-xl bg-white/70 border border-gray-200/50 hover:border-blue-400/50 hover:bg-blue-50/70 transition-all duration-200 text-sm font-medium text-gray-700 hover:text-blue-700 backdrop-blur-sm"
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
