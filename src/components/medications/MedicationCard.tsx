
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
    <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group rounded-2xl overflow-hidden hover:bg-white">
      <CardHeader className="pb-4 bg-gradient-to-r from-slate-50/90 to-white/90 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle 
            className="text-xl font-bold flex items-center gap-3 cursor-pointer flex-1 hover:text-blue-600 transition-colors duration-200"
            onClick={() => navigate(`/medications/${medication.id}`)}
          >
            <div className="p-2.5 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl group-hover:scale-110 transition-transform duration-300 border border-blue-200/50">
              <Pill className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-gray-900 leading-tight">{medication.medication_name}</span>
          </CardTitle>
          {medication.high_alert && (
            <Badge variant="destructive" className="flex items-center gap-2 ml-3 px-3 py-1.5 rounded-xl shadow-md bg-red-500 hover:bg-red-600 transition-colors">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline font-semibold text-sm">High Alert</span>
              <span className="sm:hidden font-semibold text-sm">Alert</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {medication.classification && medication.classification.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Classification:</p>
            <div className="flex flex-wrap gap-2">
              {medication.classification.slice(0, 3).map((cls) => (
                <Badge key={cls} variant="secondary" className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors font-medium">
                  {cls}
                </Badge>
              ))}
              {medication.classification.length > 3 && (
                <Badge variant="secondary" className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg border border-blue-200 font-medium">
                  +{medication.classification.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        <div className="flex gap-3 mt-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 touch-manipulation min-h-[48px] rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 font-semibold text-gray-700 hover:text-blue-700"
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
