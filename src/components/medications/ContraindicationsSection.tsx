
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileWarning } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Contraindication = Database['public']['Tables']['medication_contraindications']['Row'];

interface ContraindicationsSectionProps {
  contraindications: Contraindication[];
}

export const ContraindicationsSection = ({ contraindications }: ContraindicationsSectionProps) => {
  if (!contraindications || contraindications.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8 bg-red-50 border border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-red-800 text-lg font-medium">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <FileWarning className="h-4 w-4 text-red-600" />
          </div>
          Contraindications & Precautions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {contraindications.map((contraindication) => (
            <div key={contraindication.id} className="bg-white p-4 border border-red-100 rounded-lg">
              <p className="text-sm text-red-800 leading-relaxed">
                {contraindication.contraindication}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
