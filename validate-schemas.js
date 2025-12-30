/**
 * Schema Validation Script for GTMExpert
 * Run: node validate-schemas.js
 */

const fs = require('fs');
const path = require('path');

const schemaDir = __dirname;
const files = fs.readdirSync(schemaDir).filter(f => f.endsWith('.jsonld'));

console.log('\\n🔍 Validating GTMExpert Schema Files...\\n');

let valid = 0;
let errors = 0;

files.forEach(file => {
  try {
    const content = fs.readFileSync(path.join(schemaDir, file), 'utf8');
    JSON.parse(content);
    console.log(`✅ ${file}`);
    valid++;
  } catch (e) {
    console.log(`❌ ${file}: ${e.message}`);
    errors++;
  }
});

console.log(`\\n📊 Results: ${valid} valid, ${errors} errors\\n`);

// Check for required relationships
console.log('🔗 Checking Parent-Child Relationships...\\n');

const orgFile = path.join(schemaDir, 'organization-schema-with-testimonials.jsonld');
if (fs.existsSync(orgFile)) {
  const org = JSON.parse(fs.readFileSync(orgFile, 'utf8'));
  if (org.subOrganization) {
    console.log('✅ HyperPlays subOrganization found in organization schema');
  } else {
    console.log('❌ Missing subOrganization for HyperPlays');
  }
  if (org.isRelatedTo) {
    console.log('✅ isRelatedTo (Discovery Outcomes, Hub Page) found');
  } else {
    console.log('❌ Missing isRelatedTo references');
  }
}

const personFile = path.join(schemaDir, 'person-schema.jsonld');
if (fs.existsSync(personFile)) {
  const person = JSON.parse(fs.readFileSync(personFile, 'utf8'));
  const hyperplaysOwned = person.owns?.some(o => o.name === 'HyperPlays');
  if (hyperplaysOwned) {
    console.log('✅ HyperPlays found in person owns array');
  }
  const hyperplaysFounder = person.founder?.some(o => o.name === 'HyperPlays');
  if (hyperplaysFounder) {
    console.log('✅ HyperPlays found in person founder array');
  }
}

console.log('\\n✨ Validation Complete!\\n');
