
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

  // Get pastel color based on classification
  const getClassificationColor = (classification: string, index: number) => {
    const colors = [
      'bg-gradient-to-r from-sky-100/98 to-blue-200/95 text-sky-800 border-sky-300/70 hover:from-sky-200/98 hover:to-blue-300/95',
      'bg-gradient-to-r from-rose-100/98 to-pink-200/95 text-rose-800 border-rose-300/70 hover:from-rose-200/98 hover:to-pink-300/95',
      'bg-gradient-to-r from-violet-100/98 to-purple-200/95 text-violet-800 border-violet-300/70 hover:from-violet-200/98 hover:to-purple-300/95',
      'bg-gradient-to-r from-amber-100/98 to-orange-200/95 text-amber-800 border-amber-300/70 hover:from-amber-200/98 hover:to-orange-300/95',
      'bg-gradient-to-r from-emerald-100/98 to-green-200/95 text-emerald-800 border-emerald-300/70 hover:from-emerald-200/98 hover:to-green-300/95',
    ];
    return colors[index % colors.length];
  };

  return (
    <Card className="bg-white/98 backdrop-blur-xl border-2 border-white/80 rounded-3xl hover:shadow-2xl hover:shadow-violet-400/80 transition-all duration-300 group overflow-hidden shadow-2xl shadow-violet-300/70 hover:scale-[1.02] ring-2 ring-violet-300/60 hover:ring-violet-400/70">
      <CardHeader className="p-6 sm:p-8 bg-gradient-to-br from-white/98 to-violet-50/95 backdrop-blur-lg border-b-2 border-violet-200/60">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <CardTitle 
              className="text-base sm:text-lg font-semibold flex items-center gap-3 sm:gap-4 cursor-pointer flex-1 hover:text-violet-700 transition-colors duration-200 min-w-0"
              onClick={() => navigate(`/medications/${medication.id}`)}
            >
              <div className="flex-shrink-0 p-3 sm:p-4 bg-gradient-to-br from-violet-100/98 to-purple-200/95 rounded-2xl group-hover:scale-105 transition-transform duration-300 backdrop-blur-lg border-2 border-violet-300/60 hover:shadow-xl shadow-violet-300/60 ring-2 ring-violet-300/50">
                <Pill className="h-4 w-4 sm:h-5 sm:w-5 text-violet-700" />
              </div>
              <span className="text-gray-900 leading-tight break-words font-semibold overflow-hidden">{medication.medication_name}</span>
            </CardTitle>
            {medication.high_alert && (
              <Badge variant="destructive" className="flex items-center gap-2 flex-shrink-0 px-3 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 backdrop-blur-lg border-2 border-red-400/60 shadow-2xl shadow-red-400/70 ring-2 ring-red-500/50 min-h-[44px] whitespace-nowrap">
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">HIGH ALERT</span>
                <span className="sm:hidden">ALERT</span>
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 sm:p-8 bg-white/98">
        {medication.classification && medication.classification.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-700 mb-4 uppercase tracking-wide">Classification</p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {medication.classification.slice(0, 3).map((cls, index) => (
                <Badge key={cls} variant="secondary" className={`text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-2xl border-2 backdrop-blur-sm font-medium hover:scale-105 hover:shadow-lg transition-all duration-200 break-words max-w-full shadow-lg shadow-gray-200/50 ${getClassificationColor(cls, index)}`}>
                  <span className="truncate">{cls}</span>
                </Badge>
              ))}
              {medication.classification.length > 3 && (
                <Badge variant="secondary" className="text-xs sm:text-sm bg-gradient-to-r from-indigo-100/98 to-blue-200/95 text-indigo-800 px-3 sm:px-4 py-2 rounded-2xl border-2 border-indigo-300/70 font-medium backdrop-blur-sm hover:scale-105 hover:shadow-lg transition-all duration-200 hover:from-indigo-200/98 hover:to-blue-300/95 whitespace-nowrap shadow-lg shadow-indigo-200/60">
                  +{medication.classification.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-12 rounded-2xl bg-white/95 backdrop-blur-sm border-2 border-violet-300/70 hover:border-violet-400/80 hover:bg-gradient-to-r hover:from-violet-50/98 hover:to-purple-100/95 transition-all duration-300 text-sm font-semibold text-gray-700 hover:text-violet-800 hover:scale-[1.02] hover:shadow-xl shadow-violet-300/50 min-h-[44px]"
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
