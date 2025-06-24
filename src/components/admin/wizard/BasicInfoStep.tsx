
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import type { WizardStepProps } from './types';

export const BasicInfoStep = ({ data, updateData }: WizardStepProps) => {
  const [newClassification, setNewClassification] = React.useState('');

  const addClassification = () => {
    if (newClassification.trim() && !data.basic.classification.includes(newClassification.trim())) {
      updateData('basic', {
        ...data.basic,
        classification: [...data.basic.classification, newClassification.trim()],
      });
      setNewClassification('');
    }
  };

  const removeClassification = (index: number) => {
    updateData('basic', {
      ...data.basic,
      classification: data.basic.classification.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="medicationName">Medication Name *</Label>
        <Input
          id="medicationName"
          value={data.basic.medication_name}
          onChange={(e) => updateData('basic', {
            ...data.basic,
            medication_name: e.target.value,
          })}
          placeholder="Enter medication name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Classification</Label>
        <div className="flex gap-2">
          <Input
            value={newClassification}
            onChange={(e) => setNewClassification(e.target.value)}
            placeholder="Add classification"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addClassification())}
          />
          <Button type="button" onClick={addClassification} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {data.basic.classification.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.basic.classification.map((classification, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {classification}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeClassification(index)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="highAlert"
          checked={data.basic.high_alert}
          onCheckedChange={(checked) => updateData('basic', {
            ...data.basic,
            high_alert: checked,
          })}
        />
        <Label htmlFor="highAlert">High Alert Medication</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="infusionOnly"
          checked={data.basic.infusion_only || false}
          onCheckedChange={(checked) => updateData('basic', {
            ...data.basic,
            infusion_only: checked,
          })}
        />
        <Label htmlFor="infusionOnly">Infusion Only Medication</Label>
        <p className="text-xs text-gray-500 ml-2">
          Check this for medications that only require pump configuration
        </p>
      </div>
    </div>
  );
};
