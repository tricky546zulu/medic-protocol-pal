
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Trash2, X, Syringe } from 'lucide-react';
import type { WizardStepProps, MedicationDosing } from './types';

const patientTypes = ['Adult', 'Pediatric', 'Neonate', 'Geriatric'];
const commonRoutes = ['IV', 'IM', 'PO', 'SL', 'Inhalation', 'Topical', 'PR'];

export const DosingStep = ({ data, updateData }: WizardStepProps) => {
  const [currentDosing, setCurrentDosing] = useState<MedicationDosing>({
    patient_type: '',
    indication: '',
    dose: '',
    route: '',
    provider_routes: [],
    concentration_supplied: '',
    compatibility_stability: [],
    notes: [],
    requires_infusion_pump: false,
    infusion_pump_settings: {
      cca_setting: '',
      line_option: 'A',
      duration: '',
      vtbi: '',
      pump_instructions: '',
    },
  });

  const [newRoute, setNewRoute] = useState('');
  const [newNote, setNewNote] = useState('');

  const addDosing = () => {
    if (currentDosing.patient_type && currentDosing.indication && currentDosing.dose) {
      updateData('dosing', [...data.dosing, currentDosing]);
      setCurrentDosing({
        patient_type: '',
        indication: '',
        dose: '',
        route: '',
        provider_routes: [],
        concentration_supplied: '',
        compatibility_stability: [],
        notes: [],
        requires_infusion_pump: false,
        infusion_pump_settings: {
          cca_setting: '',
          line_option: 'A',
          duration: '',
          vtbi: '',
          pump_instructions: '',
        },
      });
    }
  };

  const removeDosing = (index: number) => {
    updateData('dosing', data.dosing.filter((_, i) => i !== index));
  };

  const addRoute = () => {
    if (newRoute.trim() && !currentDosing.provider_routes?.includes(newRoute.trim())) {
      setCurrentDosing({
        ...currentDosing,
        provider_routes: [...(currentDosing.provider_routes || []), newRoute.trim()],
      });
      setNewRoute('');
    }
  };

  const removeRoute = (index: number) => {
    setCurrentDosing({
      ...currentDosing,
      provider_routes: currentDosing.provider_routes?.filter((_, i) => i !== index) || [],
    });
  };

  const addNote = () => {
    if (newNote.trim()) {
      setCurrentDosing({
        ...currentDosing,
        notes: [...(currentDosing.notes || []), newNote.trim()],
      });
      setNewNote('');
    }
  };

  const updateInfusionPumpSetting = (field: string, value: string) => {
    setCurrentDosing({
      ...currentDosing,
      infusion_pump_settings: {
        ...currentDosing.infusion_pump_settings,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600">
        Add dosing information for different patient populations and indications.
      </div>

      {/* Add New Dosing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Dosing Protocol</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Patient Type</Label>
              <Select
                value={currentDosing.patient_type}
                onValueChange={(value) => setCurrentDosing({
                  ...currentDosing,
                  patient_type: value,
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select patient type" />
                </SelectTrigger>
                <SelectContent>
                  {patientTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Primary Route</Label>
              <Select
                value={currentDosing.route || ''}
                onValueChange={(value) => setCurrentDosing({
                  ...currentDosing,
                  route: value,
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  {commonRoutes.map((route) => (
                    <SelectItem key={route} value={route}>
                      {route}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Indication</Label>
            <Input
              value={currentDosing.indication}
              onChange={(e) => setCurrentDosing({
                ...currentDosing,
                indication: e.target.value,
              })}
              placeholder="Specific indication for this dosing"
            />
          </div>

          <div className="space-y-2">
            <Label>Dose</Label>
            <Textarea
              value={currentDosing.dose}
              onChange={(e) => setCurrentDosing({
                ...currentDosing,
                dose: e.target.value,
              })}
              placeholder="Dosing information (e.g., 0.5 mg/kg IV every 15 minutes)"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Concentration Supplied</Label>
            <Input
              value={currentDosing.concentration_supplied || ''}
              onChange={(e) => setCurrentDosing({
                ...currentDosing,
                concentration_supplied: e.target.value,
              })}
              placeholder="e.g., 1 mg/mL"
            />
          </div>

          {/* IV Infusion Pump Section */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requires_pump"
                checked={currentDosing.requires_infusion_pump}
                onCheckedChange={(checked) => setCurrentDosing({
                  ...currentDosing,
                  requires_infusion_pump: checked as boolean,
                })}
              />
              <Label htmlFor="requires_pump" className="flex items-center gap-2">
                <Syringe className="h-4 w-4" />
                Requires IV Infusion Pump
              </Label>
            </div>

            {currentDosing.requires_infusion_pump && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Syringe className="h-4 w-4" />
                    Infusion Pump Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>CCA Setting</Label>
                      <Input
                        value={currentDosing.infusion_pump_settings?.cca_setting || ''}
                        onChange={(e) => updateInfusionPumpSetting('cca_setting', e.target.value)}
                        placeholder="e.g., 5 mcg/kg/min"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Line Selection</Label>
                      <RadioGroup
                        value={currentDosing.infusion_pump_settings?.line_option || 'A'}
                        onValueChange={(value) => updateInfusionPumpSetting('line_option', value)}
                        className="flex flex-row space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="A" id="lineA" />
                          <Label htmlFor="lineA">Line A</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="B" id="lineB" />
                          <Label htmlFor="lineB">Line B</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Input
                        value={currentDosing.infusion_pump_settings?.duration || ''}
                        onChange={(e) => updateInfusionPumpSetting('duration', e.target.value)}
                        placeholder="e.g., 30 minutes"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>VTBI (Volume to be Infused)</Label>
                      <Input
                        value={currentDosing.infusion_pump_settings?.vtbi || ''}
                        onChange={(e) => updateInfusionPumpSetting('vtbi', e.target.value)}
                        placeholder="e.g., 250 mL"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Pump Instructions</Label>
                    <Textarea
                      value={currentDosing.infusion_pump_settings?.pump_instructions || ''}
                      onChange={(e) => updateInfusionPumpSetting('pump_instructions', e.target.value)}
                      placeholder="Any additional instructions for pump setup or monitoring"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Provider Routes */}
          <div className="space-y-2">
            <Label>Additional Provider Routes</Label>
            <div className="flex gap-2">
              <Input
                value={newRoute}
                onChange={(e) => setNewRoute(e.target.value)}
                placeholder="Add route"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRoute())}
              />
              <Button type="button" onClick={addRoute} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {currentDosing.provider_routes && currentDosing.provider_routes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentDosing.provider_routes.map((route, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {route}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeRoute(index)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button 
            onClick={addDosing}
            disabled={!currentDosing.patient_type || !currentDosing.indication || !currentDosing.dose}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Dosing Protocol
          </Button>
        </CardContent>
      </Card>

      {/* Existing Dosing Protocols */}
      {data.dosing.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Added Dosing Protocols ({data.dosing.length})</h3>
          {data.dosing.map((dosing, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{dosing.patient_type}</Badge>
                      {dosing.route && <Badge variant="secondary">{dosing.route}</Badge>}
                      {dosing.requires_infusion_pump && (
                        <Badge variant="outline" className="flex items-center gap-1 bg-blue-100 border-blue-300">
                          <Syringe className="h-3 w-3" />
                          IV Pump Required
                        </Badge>
                      )}
                    </div>
                    <div className="font-medium break-words">{dosing.indication}</div>
                    <div className="text-gray-700 break-words">{dosing.dose}</div>
                    {dosing.concentration_supplied && (
                      <div className="text-sm text-gray-600 break-words">
                        Supplied: {dosing.concentration_supplied}
                      </div>
                    )}
                    {dosing.requires_infusion_pump && dosing.infusion_pump_settings && (
                      <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded border">
                        <div className="font-medium mb-1">Pump Settings:</div>
                        {dosing.infusion_pump_settings.cca_setting && (
                          <div>CCA: {dosing.infusion_pump_settings.cca_setting}</div>
                        )}
                        {dosing.infusion_pump_settings.line_option && (
                          <div>Line: {dosing.infusion_pump_settings.line_option}</div>
                        )}
                        {dosing.infusion_pump_settings.duration && (
                          <div>Duration: {dosing.infusion_pump_settings.duration}</div>
                        )}
                        {dosing.infusion_pump_settings.vtbi && (
                          <div>VTBI: {dosing.infusion_pump_settings.vtbi}</div>
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeDosing(index)}
                    className="ml-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
