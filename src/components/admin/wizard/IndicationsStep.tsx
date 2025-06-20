import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import type { WizardStepProps, MedicationIndication } from './types';

const indicationTypes = [
  'Primary',
  'Secondary',
  'Off-label',
  'Emergency',
  'Pediatric',
  'Adult',
];

export const IndicationsStep = ({ data, updateData }: WizardStepProps) => {
  const [currentIndication, setCurrentIndication] = useState<MedicationIndication>({
    indication_type: '',
    indication_text: '',
  });

  const addIndication = () => {
    if (currentIndication.indication_type && currentIndication.indication_text.trim()) {
      updateData('indications', [...data.indications, currentIndication]);
      setCurrentIndication({
        indication_type: '',
        indication_text: '',
      });
    }
  };

  const removeIndication = (index: number) => {
    updateData('indications', data.indications.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600">
        Add the medical indications for this medication. Include both primary and secondary uses.
      </div>

      {/* Add New Indication */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Indication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Indication Type</Label>
            <Select
              value={currentIndication.indication_type}
              onValueChange={(value) => setCurrentIndication({
                ...currentIndication,
                indication_type: value,
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select indication type" />
              </SelectTrigger>
              <SelectContent>
                {indicationTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Indication Description</Label>
            <Textarea
              value={currentIndication.indication_text}
              onChange={(e) => setCurrentIndication({
                ...currentIndication,
                indication_text: e.target.value,
              })}
              placeholder="Describe the medical indication..."
              rows={3}
            />
          </div>

          <Button 
            onClick={addIndication}
            disabled={!currentIndication.indication_type || !currentIndication.indication_text.trim()}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Indication
          </Button>
        </CardContent>
      </Card>

      {/* Existing Indications */}
      {data.indications.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Added Indications ({data.indications.length})</h3>
          {data.indications.map((indication, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-blue-600 mb-1">
                      {indication.indication_type}
                    </div>
                    <p className="text-gray-700">{indication.indication_text}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeIndication(index)}
                    className="ml-4"
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
