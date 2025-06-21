
-- Add infusion pump fields to medication_dosing table
ALTER TABLE public.medication_dosing 
ADD COLUMN requires_infusion_pump BOOLEAN DEFAULT FALSE,
ADD COLUMN infusion_pump_settings JSONB;

-- Add comment to document the JSONB structure
COMMENT ON COLUMN public.medication_dosing.infusion_pump_settings IS 
'JSON object containing infusion pump settings: {
  "cca_setting": "string",
  "line_option": "A" | "B",
  "duration": "string",
  "vtbi": "string", 
  "pump_instructions": "string"
}';
