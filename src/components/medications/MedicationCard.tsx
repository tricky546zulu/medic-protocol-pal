
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
    <div className="med-card">
      <div className="med-card-header">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-200">
            <Pill className="h-5 w-5 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 
              className="med-title cursor-pointer hover:text-blue-600 transition-colors duration-200 mb-3"
              onClick={() => navigate(`/medications/${medication.id}`)}
            >
              {medication.medication_name}
            </h3>
            {medication.classification && medication.classification.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {medication.classification.slice(0, 3).map((cls, index) => (
                  <span key={cls} className="med-category-tag">
                    {cls}
                  </span>
                ))}
                {medication.classification.length > 3 && (
                  <span className="med-category-tag bg-gray-500">
                    +{medication.classification.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-3 flex-shrink-0">
          {medication.high_alert && (
            <div className="med-critical-tag flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>High Alert</span>
            </div>
          )}
          <BookmarkButton 
            medicationId={medication.id} 
            medicationName={medication.medication_name}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button 
          variant="outline" 
          className="flex-1 h-11 text-base border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
          onClick={() => navigate(`/medications/${medication.id}`)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};
