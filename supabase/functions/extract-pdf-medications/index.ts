
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfBase64, pageNumber = 1 } = await req.json();
    
    console.log(`Processing PDF page ${pageNumber}`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a medical data extraction specialist. Extract medication information from PDF pages and return it as a structured JSON array. Each medication should include:

- medication_name (string): The name of the medication
- classification (array of strings): Drug classifications/categories
- high_alert (boolean): Whether it's a high-alert medication
- indications (array): Each with indication_text and indication_type
- contraindications (array of strings): List of contraindications
- dosing (array): Each with patient_type, indication, dose, route, concentration_supplied, requires_infusion_pump, and infusion_pump_settings if applicable
- administration (object): With preparation, administration_notes, monitoring, adverse_effects arrays

Return ONLY valid JSON array format. If no medications found, return empty array [].`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract all medication information from this PDF page. Focus on medication names, dosing protocols, indications, contraindications, and administration details.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:application/pdf;base64,${pdfBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 4000,
        temperature: 0.1
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(data.error?.message || 'Failed to process PDF');
    }

    const extractedText = data.choices[0].message.content;
    console.log('AI Response:', extractedText);

    let extractedMedications;
    try {
      extractedMedications = JSON.parse(extractedText);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Try to extract JSON from the response if it's wrapped in markdown
      const jsonMatch = extractedText.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        extractedMedications = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('AI response was not valid JSON');
      }
    }

    // Ensure it's an array
    if (!Array.isArray(extractedMedications)) {
      extractedMedications = [extractedMedications];
    }

    // Transform to match our MedicationWizardData format
    const transformedData = extractedMedications.map((med: any) => ({
      basic: {
        medication_name: med.medication_name || '',
        classification: Array.isArray(med.classification) ? med.classification : [],
        high_alert: Boolean(med.high_alert),
        infusion_only: false
      },
      indications: Array.isArray(med.indications) ? med.indications.map((ind: any) => ({
        indication_text: ind.indication_text || ind,
        indication_type: ind.indication_type || 'Primary'
      })) : [],
      contraindications: Array.isArray(med.contraindications) ? med.contraindications : [],
      dosing: Array.isArray(med.dosing) ? med.dosing.map((dose: any) => ({
        patient_type: dose.patient_type || 'Adult',
        indication: dose.indication || '',
        dose: dose.dose || '',
        route: dose.route || '',
        provider_routes: Array.isArray(dose.provider_routes) ? dose.provider_routes : [],
        concentration_supplied: dose.concentration_supplied || '',
        compatibility_stability: Array.isArray(dose.compatibility_stability) ? dose.compatibility_stability : [],
        notes: Array.isArray(dose.notes) ? dose.notes : [],
        requires_infusion_pump: Boolean(dose.requires_infusion_pump),
        infusion_pump_settings: dose.infusion_pump_settings || {}
      })) : [],
      administration: {
        preparation: Array.isArray(med.administration?.preparation) ? med.administration.preparation : [],
        administration_notes: Array.isArray(med.administration?.administration_notes) ? med.administration.administration_notes : [],
        monitoring: Array.isArray(med.administration?.monitoring) ? med.administration.monitoring : [],
        adverse_effects: Array.isArray(med.administration?.adverse_effects) ? med.administration.adverse_effects : []
      }
    }));

    return new Response(JSON.stringify({
      success: true,
      medications: transformedData,
      pageNumber,
      extractedCount: transformedData.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in extract-pdf-medications function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      medications: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
