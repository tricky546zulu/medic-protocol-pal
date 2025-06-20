
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import type { WizardStepProps } from './types';

export const AdministrationStep = ({ data, updateData }: WizardStepProps) => {
  const [newPreparation, setNewPreparation] = useState('');
  const [newAdminNote, setNewAdminNote] = useState('');
  const [newMonitoring, setNewMonitoring] = useState('');
  const [newAdverseEffect, setNewAdverseEffect] = useState('');

  const addItem = (
    category: 'preparation' | 'administration_notes' | 'monitoring' | 'adverse_effects',
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (value.trim()) {
      updateData('administration', {
        ...data.administration,
        [category]: [...data.administration[category], value.trim()],
      });
      setter('');
    }
  };

  const removeItem = (
    category: 'preparation' | 'administration_notes' | 'monitoring' | 'adverse_effects',
    index: number
  ) => {
    updateData('administration', {
      ...data.administration,
      [category]: data.administration[category].filter((_, i) => i !== index),
    });
  };

  const categories = [
    {
      key: 'preparation' as const,
      title: 'Preparation Instructions',
      description: 'How to prepare the medication before administration',
      value: newPreparation,
      setter: setNewPreparation,
      placeholder: 'Enter preparation step...'
    },
    {
      key: 'administration_notes' as const,
      title: 'Administration Notes',
      description: 'Important notes about how to administer the medication',
      value: newAdminNote,
      setter: setNewAdminNote,
      placeholder: 'Enter administration note...'
    },
    {
      key: 'monitoring' as const,
      title: 'Monitoring Requirements',
      description: 'What to monitor during and after administration',
      value: newMonitoring,
      setter: setNewMonitoring,
      placeholder: 'Enter monitoring requirement...'
    },
    {
      key: 'adverse_effects' as const,
      title: 'Adverse Effects',
      description: 'Potential adverse effects to watch for',
      value: newAdverseEffect,
      setter: setNewAdverseEffect,
      placeholder: 'Enter adverse effect...'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600">
        Add administration details, monitoring requirements, and safety information. All fields are optional.
      </div>

      {categories.map((category) => (
        <Card key={category.key}>
          <CardHeader>
            <CardTitle className="text-lg">{category.title}</CardTitle>
            <p className="text-sm text-gray-600">{category.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                value={category.value}
                onChange={(e) => category.setter(e.target.value)}
                placeholder={category.placeholder}
                rows={2}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    addItem(category.key, category.value, category.setter);
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => addItem(category.key, category.value, category.setter)}
                size="sm"
                disabled={!category.value.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {data.administration[category.key].length > 0 && (
              <div className="space-y-2">
                {data.administration[category.key].map((item, index) => (
                  <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-md">
                    <p className="text-sm flex-1">{item}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(category.key, index)}
                      className="ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
