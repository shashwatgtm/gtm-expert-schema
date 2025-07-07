/**
 * GTMExpert Schema Validation Script
 * Validates all JSON-LD schema files in the repository
 * Usage: node validate-schemas.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Schema files to validate
const schemaFiles = [
    'ai-knowledge-base-schema.jsonld',
    'educational-content-schema.jsonld', 
    'faq-schema-with-testimonials.jsonld',
    'organization-schema-with-testimonials.jsonld',
    'person-schema.jsonld',
    'person-schema-with-testimonials.jsonld',
    'professional-service-schema.jsonld',
    'service-gtm-epic.jsonld',
    'structured_data_service_ai_lead_gen.jsonld',
    'structured_data_service_fractional_cmo.jsonld',
    'work-experience-schema.jsonld'
];

class SchemaValidator {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            errors: []
        };
    }

    // Validate JSON syntax
    validateJSON(content, filename) {
        try {
            JSON.parse(content);
            return { valid: true };
        } catch (error) {
            return { 
                valid: false, 
                error: `JSON Syntax Error in ${filename}: ${error.message}`
            };
        }
    }

    // Validate required Schema.org properties
    validateSchemaProperties(schema, filename) {
        const errors = [];

        // Check for @context
        if (!schema['@context']) {
            errors.push(`Missing @context in ${filename}`);
        } else if (schema['@context'] !== 'https://schema.org') {
            errors.push(`Invalid @context in ${filename}. Should be 'https://schema.org'`);
        }

        // Check for @type
        if (!schema['@type']) {
            errors.push(`Missing @type in ${filename}`);
        }

        // Check for name (required for most schema types)
        if (!schema.name && schema['@type'] !== 'ContactPoint') {
            errors.push(`Missing name property in ${filename}`);
        }

        // Validate URL format if present
        if (schema.url && !this.isValidURL(schema.url)) {
            errors.push(`Invalid URL format in ${filename}: ${schema.url}`);
        }

        // Validate email format if present
        if (schema.email && !this.isValidEmail(schema.email)) {
            errors.push(`Invalid email format in ${filename}: ${schema.email}`);
        }

        // Validate telephone format if present
        if (schema.telephone && !this.isValidPhone(schema.telephone)) {
            errors.push(`Invalid telephone format in ${filename}: ${schema.telephone}`);
        }

        return errors;
    }

    // Validate GTMExpert specific requirements
    validateGTMExpertRequirements(schema, filename) {
        const errors = [];

        // Check for GTMExpert specific properties
        if (filename.includes('person') || filename.includes('organization')) {
            // Ensure contact information is present
            if (!schema.email && !schema.contactPoint) {
                errors.push(`Missing contact information in ${filename}`);
            }

            // Ensure GTMExpert URL is present
            if (!schema.url || !schema.url.includes('gtmexpert.com')) {
                errors.push(`Missing or incorrect gtmexpert.com URL in ${filename}`);
            }
        }

        // Validate testimonials structure if present
        if (schema.review || schema.testimonial) {
            const reviews = schema.review || schema.testimonial || [];
            reviews.forEach((review, index) => {
                if (!review.author || !review.author.name) {
                    errors.push(`Missing author name in review ${index} of ${filename}`);
                }
                if (!review.reviewBody && !review.reviewBody) {
                    errors.push(`Missing review content in review ${index} of ${filename}`);
                }
            });
        }

        return errors;
    }

    // URL validation
    isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Phone validation
    isValidPhone(phone) {
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        return phoneRegex.test(phone);
    }

    // Validate against Google's Structured Data Testing Tool
    async validateWithGoogle(schema, filename) {
        return new Promise((resolve) => {
            const postData = JSON.stringify({
                code_snippet: JSON.stringify(schema, null, 2),
                format: 'MICRODATA'
            });

            const options = {
                hostname: 'search.google.com',
                port: 443,
                path: '/structured-data/testing-tool/validate',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    resolve({ filename, status: res.statusCode, data });
                });
            });

            req.on('error', (error) => {
                resolve({ filename, error: error.message });
            });

            req.write(postData);
            req.end();
        });
    }

    // Main validation function
    async validateFile(filename) {
        console.log(`\n🔍 Validating ${filename}...`);

        try {
            // Read file
            const filePath = path.join(__dirname, filename);
            if (!fs.existsSync(filePath)) {
                this.results.failed++;
                this.results.errors.push(`File not found: ${filename}`);
                console.log(`❌ File not found: ${filename}`);
                return;
            }

            const content = fs.readFileSync(filePath, 'utf8');

            // Validate JSON syntax
            const jsonValidation = this.validateJSON(content, filename);
            if (!jsonValidation.valid) {
                this.results.failed++;
                this.results.errors.push(jsonValidation.error);
                console.log(`❌ ${jsonValidation.error}`);
                return;
            }

            const schema = JSON.parse(content);

            // Validate Schema.org properties
            const schemaErrors = this.validateSchemaProperties(schema, filename);
            const gtmExpertErrors = this.validateGTMExpertRequirements(schema, filename);

            const allErrors = [...schemaErrors, ...gtmExpertErrors];

            if (allErrors.length > 0) {
                this.results.failed++;
                this.results.errors.push(...allErrors);
                console.log(`❌ ${filename} has ${allErrors.length} errors:`);
                allErrors.forEach(error => console.log(`   - ${error}`));
            } else {
                this.results.passed++;
                console.log(`✅ ${filename} passed validation`);
            }

        } catch (error) {
            this.results.failed++;
            this.results.errors.push(`Error validating ${filename}: ${error.message}`);
            console.log(`❌ Error validating ${filename}: ${error.message}`);
        }
    }

    // Run validation on all files
    async validateAll() {
        console.log('🚀 Starting GTMExpert Schema Validation...\n');
        console.log(`📁 Validating ${schemaFiles.length} schema files:`);

        for (const file of schemaFiles) {
            await this.validateFile(file);
        }

        this.printSummary();
    }

    // Print validation summary
    printSummary() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 VALIDATION SUMMARY');
        console.log('='.repeat(50));
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`📝 Total Files: ${schemaFiles.length}`);

        if (this.results.errors.length > 0) {
            console.log('\n🔥 ERRORS TO FIX:');
            this.results.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }

        if (this.results.failed === 0) {
            console.log('\n🎉 All schemas passed validation!');
            console.log('✨ Ready for deployment to gtmexpert.com');
        } else {
            console.log(`\n⚠️  ${this.results.failed} schema(s) need fixing before deployment`);
        }

        console.log('\n🔗 Next steps:');
        console.log('1. Fix any validation errors');
        console.log('2. Test with Google Structured Data Testing Tool');
        console.log('3. Deploy to gtmexpert.com');
        console.log('4. Monitor in Google Search Console');
    }
}

// Run validation if called directly
if (require.main === module) {
    const validator = new SchemaValidator();
    validator.validateAll().catch(console.error);
}

module.exports = SchemaValidator;
