
export class CSVParser {
  static parseCSV(csvText: string): any[] {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const obj: any = {};
        
        headers.forEach((header, index) => {
          let value: any = values[index] || '';
          
          // Handle array fields - convert string to array
          if (header.includes('classification') || header.includes('preparation') || 
              header.includes('administration_notes') || header.includes('monitoring') || 
              header.includes('adverse_effects') || header.includes('notes') ||
              header.includes('compatibility_stability') || header.includes('provider_routes')) {
            obj[header] = value ? value.split(';').map((v: string) => v.trim()) : [];
          }
          // Handle boolean fields - convert string to boolean
          else if (header === 'high_alert') {
            obj[header] = value.toLowerCase() === 'true' || value === '1';
          }
          // Handle regular string fields
          else {
            obj[header] = value;
          }
        });
        
        return obj;
      });
  }
}
