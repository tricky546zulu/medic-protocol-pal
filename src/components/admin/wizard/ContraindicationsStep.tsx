
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import type { WizardStepProps } from './types';

export const ContraindicationsStep = ({ data, updateData }: WizardStepProps) => {
  const [newContraindication, setNewContraindication] = useState('');

  const addContraindication = () => {
    if (newContraindication.trim() && !data.contraindications.includes(newContraindication.trim())) {
      updateData('contraindications', [...data.contraindications, newContraindication.trim()]);
      setNewContraindication('');
    }
  };

  const removeContraindication = (index: number) => {
    updateData('contraindications', data.contraindications.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600">
        Add contraindications and precautions for this medication. This step is optional but recommended for safety.
      </div>

      <div className="space-y-2">
        <Label>Add Contraindication</Label>
        <div className="flex gap-2">
          <Input
            value={newContraindication}
            onChange={(e) => setNewContraindication(e.target.value)}
            placeholder="Enter contraindication or precaution"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addContraindication())}
          />
          <Button type="button" onClick={addContraindication} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {data.contraindications.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Added Contraindications ({data.contraindications.length})</h3>
          {data.contraindications.map((contraindication, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-700">{contraindication}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeContraindication(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
