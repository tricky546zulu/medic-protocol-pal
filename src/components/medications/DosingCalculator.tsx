
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

interface DosingCalculatorProps {
  medicationName: string;
}

export const DosingCalculator = ({ medicationName }: DosingCalculatorProps) => {
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState('');

  const calculateDose = () => {
    const weightNum = parseFloat(weight);
    if (!weightNum) return;

    // Basic calculation example - in real implementation, this would use
    // specific medication dosing algorithms
    const dose = weightNum * 0.1; // Example: 0.1 mg/kg
    setResult(`Calculated dose: ${dose.toFixed(2)} mg`);
  };

  return (
    <Card className="border-green-500 bg-green-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Calculator className="h-5 w-5 text-green-600" />
          Dosing Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="weight" className="text-sm font-medium">
              Patient Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight in kg"
              className="mt-1"
            />
          </div>
          
          <Button 
            onClick={calculateDose}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={!weight}
          >
            Calculate Dose
          </Button>

          {result && (
            <div className="p-3 bg-white rounded-lg border-2 border-green-300">
              <p className="text-center font-semibold text-green-800">{result}</p>
              <p className="text-xs text-center text-gray-600 mt-1">
                Always verify with protocol guidelines
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
