
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
      'bg-gradient-to-r from-sky-100/90 to-blue-200/80 text-sky-800 border-sky-200/60 hover:from-sky-200/90 hover:to-blue-300/80',
      'bg-gradient-to-r from-rose-100/90 to-pink-200/80 text-rose-800 border-rose-200/60 hover:from-rose-200/90 hover:to-pink-300/80',
      'bg-gradient-to-r from-violet-100/90 to-purple-200/80 text-violet-800 border-violet-200/60 hover:from-violet-200/90 hover:to-purple-300/80',
      'bg-gradient-to-r from-amber-100/90 to-orange-200/80 text-amber-800 border-amber-200/60 hover:from-amber-200/90 hover:to-orange-300/80',
      'bg-gradient-to-r from-emerald-100/90 to-green-200/80 text-emerald-800 border-emerald-200/60 hover:from-emerald-200/90 hover:to-green-300/80',
    ];
    return colors[index % colors.length];
  };

  return (
    <Card className="bg-white/85 backdrop-blur-lg border border-white/30 rounded-3xl hover:shadow-2xl hover:shadow-violet-300/70 transition-all duration-300 group overflow-hidden shadow-2xl shadow-violet-200/60 hover:scale-[1.02] ring-1 ring-violet-200/30 hover:ring-violet-300/50">
      <CardHeader className="p-8 bg-gradient-to-br from-white/90 to-violet-50/80 backdrop-blur-lg border-b border-violet-100/50">
        <div className="flex items-center justify-between gap-4">
          <CardTitle 
            className="text-lg font-semibold flex items-center gap-4 cursor-pointer flex-1 hover:text-violet-700 transition-colors duration-200 min-w-0"
            onClick={() => navigate(`/medications/${medication.id}`)}
          >
            <div className="flex-shrink-0 p-4 bg-gradient-to-br from-violet-100/90 to-purple-200/80 rounded-2xl group-hover:scale-105 transition-transform duration-300 backdrop-blur-lg border border-violet-200/50 hover:shadow-lg shadow-violet-200/50 ring-1 ring-violet-200/40">
              <Pill className="h-5 w-5 text-violet-700" />
            </div>
            <span className="text-gray-900 leading-tight break-words font-semibold">{medication.medication_name}</span>
          </CardTitle>
          {medication.high_alert && (
            <Badge variant="destructive" className="flex items-center gap-2 flex-shrink-0 px-4 py-2 rounded-2xl text-sm font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 backdrop-blur-lg border border-red-300/50 shadow-2xl shadow-red-300/60 ring-2 ring-red-400/40">
              <AlertTriangle className="h-4 w-4" />
              HIGH ALERT
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-8">
        {medication.classification && medication.classification.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-600 mb-4 uppercase tracking-wide">Classification</p>
            <div className="flex flex-wrap gap-3">
              {medication.classification.slice(0, 3).map((cls, index) => (
                <Badge key={cls} variant="secondary" className={`text-sm px-4 py-2 rounded-2xl border backdrop-blur-sm font-medium hover:scale-105 hover:shadow-md transition-all duration-200 ${getClassificationColor(cls, index)}`}>
                  {cls}
                </Badge>
              ))}
              {medication.classification.length > 3 && (
                <Badge variant="secondary" className="text-sm bg-gradient-to-r from-indigo-100/90 to-blue-200/80 text-indigo-800 px-4 py-2 rounded-2xl border border-indigo-200/60 font-medium backdrop-blur-sm hover:scale-105 hover:shadow-md transition-all duration-200 hover:from-indigo-200/90 hover:to-blue-300/80">
                  +{medication.classification.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        <div className="flex gap-4 mt-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-violet-200/60 hover:border-violet-400/70 hover:bg-gradient-to-r hover:from-violet-50/90 hover:to-purple-100/80 transition-all duration-300 text-sm font-semibold text-gray-700 hover:text-violet-800 hover:scale-[1.02] hover:shadow-lg shadow-violet-200/40"
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
