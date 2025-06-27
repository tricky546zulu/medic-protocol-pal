
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Added CardHeader, CardTitle
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button'; // Added buttonVariants import
import { AlertTriangleIcon, EditIcon, Trash2Icon, PillIcon, PlusCircleIcon } from 'lucide-react'; // Updated Icons
import { toast } from '@/components/ui/use-toast'; // Updated toast import
import { EditMedicationModal } from './EditMedicationModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Import AlertDialog components
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { cn } from '@/lib/utils';

export const MedicationsList = () => {
  const [editingMedicationId, setEditingMedicationId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [medicationToDelete, setMedicationToDelete] = useState<{ id: string; name: string } | null>(null);


  const { data: medications, isLoading, refetch, error } = useQuery({
    queryKey: ['admin-medications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('medication_name');
      
      if (error) {
        console.error("Error fetching medications:", error);
        throw new Error(error.message || "Failed to fetch medications");
      }
      return data;
    },
  });

  const handleDeleteConfirmation = (id: string, name: string) => {
    setMedicationToDelete({ id, name });
    setShowDeleteConfirm(id);
  };

  const confirmDeleteMedication = async () => {
    if (!medicationToDelete) return;

    try {
      const { error: deleteError } = await supabase
        .from('medications')
        .delete()
        .eq('id', medicationToDelete.id);

      if (deleteError) throw deleteError;

      toast({
        title: "Success!",
        description: `${medicationToDelete.name} has been deleted.`,
      });

      refetch();
    } catch (e: any) {
      console.error('Error deleting medication:', e);
      toast({
        title: "Deletion Failed",
        description: e.message || "Could not delete the medication.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteConfirm(null);
      setMedicationToDelete(null);
    }
  };

  const handleEditSuccess = () => {
    toast({
      title: "Update Successful!",
      description: "Medication details have been updated.",
    });
    refetch();
    setEditingMedicationId(null);
  };

  const handleEditCancel = () => {
    setEditingMedicationId(null);
  }

  if (isLoading) {
    return (
      <div className="space-y-4 mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Manage Medications</CardTitle>
        </CardHeader>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-5 w-3/5" />
                  <Skeleton className="h-4 w-1/5" />
                </div>
                <Skeleton className="h-4 w-4/5 mb-3" />
                <div className="flex flex-wrap gap-1 mb-3">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mt-6 bg-destructive/10 border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangleIcon className="h-5 w-5" />
            Error Loading Medications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground">
            There was an issue fetching the medication list. Please try again later.
          </p>
          <Button onClick={() => refetch()} variant="destructive" className="mt-4">Try Again</Button>
        </CardContent>
      </Card>
    );
  }


  if (!medications || medications.length === 0) {
    return (
      <Card className="mt-6 text-center py-10 border-dashed">
        <CardContent className="flex flex-col items-center justify-center">
          <PillIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-1">No Medications Found</h3>
          <p className="text-muted-foreground mb-6">
            It looks like there are no medications in the system yet.
          </p>
          {/* Consider adding a button/link to the "Add Medication" form if it's on this page or link to it */}
          {/* Example: <Button onClick={() => navigateTo('/admin/add-medication')}> <PlusCircleIcon className="mr-2 h-4 w-4" /> Add First Medication </Button> */}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Manage Medications ({medications.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {medications.map((medication) => (
            <Card key={medication.id} className="bg-card border hover:shadow-md transition-shadow duration-150">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-base text-foreground truncate max-w-full sm:max-w-md">
                        {medication.medication_name}
                      </h3>
                      {medication.high_alert && (
                        <Badge variant="destructive" className="text-xs items-center gap-1 py-0.5 px-1.5">
                          <AlertTriangleIcon className="h-3 w-3" />
                          High Alert
                        </Badge>
                      )}
                    </div>
                    {medication.classification && medication.classification.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1 mb-2">
                        {medication.classification.slice(0, 4).map((cls: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {cls}
                          </Badge>
                        ))}
                        {medication.classification.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{medication.classification.length - 4} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0 mt-2 sm:mt-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingMedicationId(medication.id)}
                      className="h-9" // Consistent height
                    >
                      <EditIcon className="h-4 w-4 sm:mr-1.5" /> {/* Icon size and margin */}
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <AlertDialog open={showDeleteConfirm === medication.id} onOpenChange={(open) => !open && setShowDeleteConfirm(null)}>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteConfirmation(medication.id, medication.medication_name)}
                          className="h-9 text-destructive hover:bg-destructive/10 hover:text-destructive" // Destructive intent
                        >
                          <Trash2Icon className="h-4 w-4 sm:mr-1.5" /> {/* Icon size and margin */}
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the medication
                            <span className="font-semibold"> {medicationToDelete?.name}</span> and all its associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setShowDeleteConfirm(null)}>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={confirmDeleteMedication}
                            className={cn(buttonVariants({ variant: "destructive" }))} // Use destructive variant for action
                          >
                            Yes, delete medication
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {editingMedicationId && (
        <EditMedicationModal
          medicationId={editingMedicationId}
          isOpen={!!editingMedicationId}
          onClose={handleEditCancel}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
};
