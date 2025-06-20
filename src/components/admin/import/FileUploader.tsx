
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FileUploaderProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploader = ({ onFileUpload }: FileUploaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Medication Data</CardTitle>
        <p className="text-sm text-gray-600">
          Upload a CSV or JSON file containing medication data. Use our templates for the correct format.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="file-upload">Select File</Label>
            <Input
              id="file-upload"
              type="file"
              accept=".csv,.json"
              onChange={onFileUpload}
              className="mt-1"
            />
          </div>
          <div className="text-xs text-gray-500">
            Supported formats: CSV, JSON
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
