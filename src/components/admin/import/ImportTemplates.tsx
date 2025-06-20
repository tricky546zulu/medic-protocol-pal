
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Code } from 'lucide-react';

export const ImportTemplates = () => {
  const generateCSVTemplate = () => {
    const headers = [
      'medication_name',
      'classification',
      'high_alert',
      'indication_type_1',
      'indication_text_1',
      'indication_type_2',
      'indication_text_2',
      'contraindication_1',
      'contraindication_2',
      'patient_type_1',
      'indication_1',
      'dose_1',
      'route_1',
      'preparation',
      'administration_notes',
      'monitoring',
      'adverse_effects'
    ];

    const sampleRow = [
      'Epinephrine',
      'Sympathomimetic;Vasopressor',
      'true',
      'EMS INDICATIONS',
      'Anaphylaxis and severe allergic reactions',
      'EMS INDICATIONS',
      'Cardiac arrest',
      'None in emergency situations',
      'Caution in patients with coronary artery disease',
      'Adult',
      'Anaphylaxis',
      '0.3-0.5 mg IM',
      'Intramuscular',
      'Use prefilled auto-injector when available',
      'Administer into lateral thigh;Monitor injection site',
      'Vital signs;ECG;Blood pressure',
      'Tachycardia;Hypertension;Anxiety'
    ];

    const csvContent = [headers.join(','), sampleRow.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medication_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateJSONTemplate = () => {
    const template = [
      {
        basic: {
          medication_name: "Epinephrine",
          classification: ["Sympathomimetic", "Vasopressor"],
          high_alert: true
        },
        indications: [
          {
            indication_type: "EMS INDICATIONS",
            indication_text: "Anaphylaxis and severe allergic reactions"
          },
          {
            indication_type: "EMS INDICATIONS", 
            indication_text: "Cardiac arrest"
          }
        ],
        contraindications: [
          "None in emergency situations",
          "Caution in patients with coronary artery disease"
        ],
        dosing: [
          {
            patient_type: "Adult",
            indication: "Anaphylaxis",
            dose: "0.3-0.5 mg IM",
            route: "Intramuscular",
            provider_routes: ["EMR", "PCP", "ACP"],
            concentration_supplied: "1:1000 (1 mg/mL)",
            notes: ["Use prefilled auto-injector when available"]
          }
        ],
        administration: {
          preparation: ["Use prefilled auto-injector when available"],
          administration_notes: ["Administer into lateral thigh", "Monitor injection site"],
          monitoring: ["Vital signs", "ECG", "Blood pressure"],
          adverse_effects: ["Tachycardia", "Hypertension", "Anxiety"]
        }
      }
    ];

    const jsonContent = JSON.stringify(template, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medication_import_template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600">
        Download templates and examples to structure your medication data for bulk import.
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              CSV Template
              <Badge variant="outline">Recommended</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              CSV format with predefined columns. Best for spreadsheet applications like Excel or Google Sheets.
            </p>
            <div className="space-y-2">
              <div className="text-xs font-medium">Includes:</div>
              <ul className="text-xs space-y-1 text-gray-600">
                <li>• Basic medication information</li>
                <li>• Multiple indication fields</li>
                <li>• Contraindication fields</li>
                <li>• Dosing protocol fields</li>
                <li>• Administration details</li>
              </ul>
            </div>
            <Button onClick={generateCSVTemplate} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download CSV Template
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              JSON Template
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Structured JSON format. Best for programmatic data entry or complex medications with multiple protocols.
            </p>
            <div className="space-y-2">
              <div className="text-xs font-medium">Features:</div>
              <ul className="text-xs space-y-1 text-gray-600">
                <li>• Nested data structure</li>
                <li>• Arrays for multiple entries</li>
                <li>• Complete medication profiles</li>
                <li>• Flexible dosing scenarios</li>
              </ul>
            </div>
            <Button onClick={generateJSONTemplate} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download JSON Template
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Import Format Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">CSV Format Notes:</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Use semicolons (;) to separate array values</li>
                <li>• Use "true"/"false" for boolean fields</li>
                <li>• Leave cells empty for optional fields</li>
                <li>• Number multiple fields (indication_1, indication_2, etc.)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">JSON Format Notes:</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Arrays for multiple values: ["value1", "value2"]</li>
                <li>• Boolean values: true/false (no quotes)</li>
                <li>• Nested objects for complex data</li>
                <li>• Validate JSON syntax before import</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-medium text-blue-900 mb-2">Required Fields:</h4>
            <div className="text-sm text-blue-800">
              <strong>medication_name</strong>, at least one <strong>indication</strong>, and at least one <strong>dosing protocol</strong> are required for successful import.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
