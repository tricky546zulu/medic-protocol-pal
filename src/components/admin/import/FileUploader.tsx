
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload } from 'lucide-react';

interface FileUploaderProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploader = ({ onFileUpload }: FileUploaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Medication Data
        </CardTitle>
        <p className="text-sm text-gray-600">
          Upload a CSV, JSON, or PDF file containing medication data. AI will extract data from PDFs automatically.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="file-upload">Select File</Label>
            <Input
              id="file-upload"
              type="file"
              accept=".csv,.json,.pdf"
              onChange={onFileUpload}
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border">
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <Badge variant="outline" className="mb-1">PDF</Badge>
                <div className="text-blue-700">AI-powered extraction</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded border">
              <FileText className="h-4 w-4 text-green-600" />
              <div>
                <Badge variant="outline" className="mb-1">CSV</Badge>
                <div className="text-green-700">Structured data import</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded border">
              <FileText className="h-4 w-4 text-purple-600" />
              <div>
                <Badge variant="outline" className="mb-1">JSON</Badge>
                <div className="text-purple-700">Direct format import</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
