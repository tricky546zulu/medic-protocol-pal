
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Plus, Database, Upload } from 'lucide-react';
import { MedicationWizard } from '@/components/admin/MedicationWizard';
import { MedicationsList } from '@/components/admin/MedicationsList';
import { BulkImportManager } from '@/components/admin/BulkImportManager';
import { CreateTestMedication } from '@/components/admin/CreateTestMedication';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('add');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white rounded-lg border border-gray-200">
              <Shield className="h-8 w-8 text-gray-700 shrink-0" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 break-words">
              Admin Panel
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Comprehensive medication data management for Saskatchewan EMS protocols
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-10 bg-white border border-gray-200">
            <TabsTrigger value="add" className="flex items-center gap-2 p-2 sm:p-1.5 text-xs sm:text-sm">
              <Plus className="h-4 w-4 shrink-0" />
              <span className="truncate">Add Medication</span>
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2 p-2 sm:p-1.5 text-xs sm:text-sm">
              <Upload className="h-4 w-4 shrink-0" />
              <span className="truncate">Bulk Import</span>
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2 p-2 sm:p-1.5 text-xs sm:text-sm">
              <Database className="h-4 w-4 shrink-0" />
              <span className="truncate">Manage Data</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="mt-6">
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Add Complete Medication Profile</CardTitle>
                <p className="text-sm text-gray-600 leading-relaxed">
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
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Bulk Import Medications</CardTitle>
                <p className="text-sm text-gray-600 leading-relaxed">
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
            <div className="space-y-6">
              <CreateTestMedication />
              <Card className="border border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Existing Medications</CardTitle>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    View and manage existing medication records in the database.
                  </p>
                </CardHeader>
                <CardContent>
                  <MedicationsList />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
