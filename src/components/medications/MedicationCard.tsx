
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
    <Card className="bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl hover:shadow-xl transition-all duration-300 group overflow-hidden shadow-lg hover:scale-[1.02]">
      <CardHeader className="p-6 bg-gradient-to-br from-gray-50/80 to-white/60 backdrop-blur-sm border-b border-gray-100/50">
        <div className="flex items-center justify-between gap-4">
          <CardTitle 
            className="text-lg font-semibold flex items-center gap-3 cursor-pointer flex-1 hover:text-blue-600 transition-colors duration-200 min-w-0"
            onClick={() => navigate(`/medications/${medication.id}`)}
          >
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-100/80 to-blue-200/60 rounded-xl group-hover:scale-105 transition-transform duration-300 backdrop-blur-sm border border-blue-200/40 hover:shadow-md">
              <Pill className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-gray-900 leading-tight break-words">{medication.medication_name}</span>
          </CardTitle>
          {medication.high_alert && (
            <Badge variant="destructive" className="flex items-center gap-1 flex-shrink-0 px-3 py-1 rounded-xl text-xs font-medium bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 backdrop-blur-sm border border-red-300/40 shadow-lg shadow-red-200/50 ring-2 ring-red-400/30">
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
                <Badge key={cls} variant="secondary" className="text-xs bg-gradient-to-r from-white/80 to-gray-50/90 text-gray-700 px-3 py-1 rounded-xl border border-gray-200/60 font-normal backdrop-blur-sm hover:scale-105 hover:shadow-sm hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-blue-100/70 hover:border-blue-200/60 hover:text-blue-700 transition-all duration-200">
                  {cls}
                </Badge>
              ))}
              {medication.classification.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-gradient-to-r from-blue-50/80 to-blue-100/70 text-blue-600 px-3 py-1 rounded-xl border border-blue-200/60 font-normal backdrop-blur-sm hover:scale-105 hover:shadow-sm transition-all duration-200">
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
            className="flex-1 h-10 rounded-xl bg-white/80 border border-gray-200/60 hover:border-blue-400/60 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-blue-100/60 transition-all duration-300 text-sm font-medium text-gray-700 hover:text-blue-700 backdrop-blur-sm hover:scale-[1.02] hover:shadow-md"
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
