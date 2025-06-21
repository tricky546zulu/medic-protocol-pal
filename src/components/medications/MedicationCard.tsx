
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { Database } from '@/integrations/supabase/types';

type Medication = Database['public']['Tables']['medications']['Row'];

interface MedicationCardProps {
  medication: Medication;
}

export const MedicationCard = ({ medication }: MedicationCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
          onClick={() => navigate(`/medications/${medication.id}`)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Pill className="h-5 w-5 text-blue-600" />
            {medication.medication_name}
          </CardTitle>
          {medication.high_alert && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              High Alert
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {medication.classification && medication.classification.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Classification:</p>
            <div className="flex flex-wrap gap-1">
              {medication.classification.map((cls) => (
                <Badge key={cls} variant="secondary" className="text-xs">
                  {cls}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <Button variant="outline" size="sm" className="w-full mt-3">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};
