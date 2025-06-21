
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const MedicationsList = () => {
  const { data: medications, isLoading, refetch } = useQuery({
    queryKey: ['admin-medications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('medication_name');
      
      if (error) throw error;
      return data;
    },
  });

  const deleteMedication = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This will also delete all associated data.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${name} has been deleted successfully`,
      });

      refetch();
    } catch (error: any) {
      console.error('Error deleting medication:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete medication",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading medications...</div>;
  }

  if (!medications || medications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No medications found. Add your first medication using the form above.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {medications.map((medication) => (
        <Card key={medication.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold break-words">{medication.medication_name}</h3>
                  {medication.high_alert && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      High Alert
                    </Badge>
                  )}
                </div>
                {medication.classification && medication.classification.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {medication.classification.map((cls, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {cls}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => deleteMedication(medication.id, medication.medication_name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
