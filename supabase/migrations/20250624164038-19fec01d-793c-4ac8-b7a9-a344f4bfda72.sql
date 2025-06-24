
-- Add infusion_only field to medications table
ALTER TABLE public.medications 
ADD COLUMN infusion_only boolean DEFAULT false;

-- Update the comment to reflect the new column
COMMENT ON COLUMN public.medications.infusion_only IS 'Indicates if this medication is infusion-only and should only display pump settings';
