
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { EditMedicationModal } from './EditMedicationModal';

export const MedicationsList = () => {
  const [editingMedicationId, setEditingMedicationId] = useState<string | null>(null);

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

  const handleEditSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return <div className="text-center py-6">Loading medications...</div>;
  }

  if (!medications || medications.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No medications found. Add your first medication using the form above.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {medications.map((medication) => (
          <Card key={medication.id} className="border border-gray-200">
            <CardContent className="p-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-semibold text-sm truncate max-w-full sm:max-w-md">
                      {medication.medication_name}
                    </h3>
                    {medication.high_alert && (
                      <Badge variant="destructive" className="flex items-center gap-1 shrink-0 text-xs px-2 py-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="hidden sm:inline">High Alert</span>
                        <span className="sm:hidden">Alert</span>
                      </Badge>
                    )}
                  </div>
                  {medication.classification && medication.classification.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {medication.classification.slice(0, 3).map((cls, index) => (
                        <Badge key={index} variant="secondary" className="text-xs truncate max-w-24 sm:max-w-32 px-2 py-1">
                          {cls}
                        </Badge>
                      ))}
                      {medication.classification.length > 3 && (
                        <Badge variant="secondary" className="text-xs px-2 py-1">
                          +{medication.classification.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 px-2 sm:px-3 text-xs"
                    onClick={() => setEditingMedicationId(medication.id)}
                  >
                    <Edit className="h-3 w-3" />
                    <span className="hidden sm:ml-1 sm:inline">Edit</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-8 px-2 sm:px-3 text-xs"
                    onClick={() => deleteMedication(medication.id, medication.medication_name)}
                  >
                    <Trash2 className="h-3 w-3" />
                    <span className="hidden sm:ml-1 sm:inline">Delete</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingMedicationId && (
        <EditMedicationModal
          medicationId={editingMedicationId}
          isOpen={!!editingMedicationId}
          onClose={() => setEditingMedicationId(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
};
