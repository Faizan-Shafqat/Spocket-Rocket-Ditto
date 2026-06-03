const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, 'custom-modules');
const outputFile = path.join(__dirname, 'module_signatures.json');

const signatures = [];

function extractFieldSignature(field) {
  const sig = {
    name: field.name,
    label: field.label,
    type: field.type,
  };
  
  if (field.choices) {
    sig.choices = field.choices.map(c => c[0]); // Option values
  }
  
  if (field.default !== undefined) {
    sig.default = field.default;
  }
  
  if (field.children && field.children.length > 0) {
    sig.children = field.children.map(extractFieldSignature);
  }
  
  return sig;
}

if (fs.existsSync(modulesDir)) {
  const items = fs.readdirSync(modulesDir);
  
  for (const item of items) {
    if (item.endsWith('.module')) {
      const modulePath = path.join(modulesDir, item);
      const metaPath = path.join(modulePath, 'meta.json');
      const fieldsPath = path.join(modulePath, 'fields.json');
      
      let meta = {};
      let fields = [];
      
      try {
        if (fs.existsSync(metaPath)) {
          meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        }
        if (fs.existsSync(fieldsPath)) {
          fields = JSON.parse(fs.readFileSync(fieldsPath, 'utf8'));
        }
        
        const fieldSignatures = fields.map(extractFieldSignature);
        
        signatures.push({
          module_dir: item,
          module_label: meta.label || item.replace('.module', ''),
          module_id: meta.module_id || null,
          fields: fieldSignatures
        });
      } catch (err) {
        console.error(`Error parsing module ${item}:`, err.message);
      }
    }
  }
  
  fs.writeFileSync(outputFile, JSON.stringify(signatures, null, 2));
  console.log(`Successfully extracted signatures for ${signatures.length} modules.`);
  console.log(`File saved to: ${outputFile}`);
} else {
  console.error("custom-modules directory not found!");
}
