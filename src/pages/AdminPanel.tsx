
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Plus, Database, Upload } from 'lucide-react';
import { MedicationWizard } from '@/components/admin/MedicationWizard';
import { MedicationsList } from '@/components/admin/MedicationsList';
import { BulkImportManager } from '@/components/admin/BulkImportManager';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('add');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-primary" /> {/* Updated to use theme primary color */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Panel</h1>
        </div>
        <p className="text-gray-600">
          Comprehensive medication data management for Saskatchewan EMS protocols
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="add" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Medication
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Bulk Import
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Manage Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Complete Medication Profile</CardTitle>
              <p className="text-sm text-gray-600">
                Use this comprehensive wizard to add all medication information including indications, 
                contraindications, dosing protocols, and administration details.
              </p>
            </CardHeader>
            <CardContent>
              <MedicationWizard />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Import Medications</CardTitle>
              <p className="text-sm text-gray-600">
                Import multiple medications at once using CSV or JSON files. Perfect for populating 
                your database with data from existing medication manuals.
              </p>
            </CardHeader>
            <CardContent>
              <BulkImportManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Existing Medications</CardTitle>
              <p className="text-sm text-gray-600">
                View and manage existing medication records in the database.
              </p>
            </CardHeader>
            <CardContent>
              <MedicationsList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
