
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type MedicationDosing = Database['public']['Tables']['medication_dosing']['Row'];

interface EmergencyDosingCardProps {
  dosing: MedicationDosing;
  isHighAlert: boolean;
}

export const EmergencyDosingCard = ({ dosing, isHighAlert }: EmergencyDosingCardProps) => {
  return (
    <Card className={`border-2 ${isHighAlert ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            {isHighAlert && <AlertTriangle className="h-5 w-5 text-red-600" />}
            {dosing.patient_type}
          </CardTitle>
          <div className="flex gap-2">
            {dosing.route && (
              <Badge variant="secondary" className="font-semibold">
                {dosing.route}
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm font-medium text-gray-700">{dosing.indication}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center p-4 bg-white rounded-lg border-2 border-gray-300">
            <p className="text-xs font-medium text-gray-600 mb-1">DOSE</p>
            <p className="text-2xl font-bold text-gray-900">{dosing.dose}</p>
          </div>
          
          {dosing.concentration_supplied && (
            <div className="text-center p-3 bg-gray-100 rounded-lg">
              <p className="text-xs font-medium text-gray-600 mb-1">CONCENTRATION</p>
              <p className="text-lg font-semibold text-gray-800">{dosing.concentration_supplied}</p>
            </div>
          )}

          {dosing.notes && dosing.notes.length > 0 && (
            <div className="border-t pt-3">
              <p className="text-xs font-medium text-gray-600 mb-2">NOTES</p>
              <ul className="space-y-1">
                {dosing.notes.map((note, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-blue-500 mt-1 text-xs">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
