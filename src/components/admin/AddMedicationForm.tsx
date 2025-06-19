
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const AddMedicationForm = () => {
  const [medicationName, setMedicationName] = useState('');
  const [classifications, setClassifications] = useState<string[]>([]);
  const [newClassification, setNewClassification] = useState('');
  const [highAlert, setHighAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addClassification = () => {
    if (newClassification.trim() && !classifications.includes(newClassification.trim())) {
      setClassifications([...classifications, newClassification.trim()]);
      setNewClassification('');
    }
  };

  const removeClassification = (index: number) => {
    setClassifications(classifications.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!medicationName.trim()) {
      toast({
        title: "Error",
        description: "Medication name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('medications')
        .insert({
          medication_name: medicationName.trim(),
          classification: classifications.length > 0 ? classifications : null,
          high_alert: highAlert,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: `${medicationName} has been added successfully`,
      });

      // Reset form
      setMedicationName('');
      setClassifications([]);
      setHighAlert(false);

    } catch (error: any) {
      console.error('Error adding medication:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add medication",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="medicationName">Medication Name *</Label>
        <Input
          id="medicationName"
          value={medicationName}
          onChange={(e) => setMedicationName(e.target.value)}
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
        {classifications.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {classifications.map((classification, index) => (
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
          checked={highAlert}
          onCheckedChange={setHighAlert}
        />
        <Label htmlFor="highAlert">High Alert Medication</Label>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Adding...' : 'Add Medication'}
      </Button>
    </form>
  );
};
