# GTMExpert Schema Repository (v2.0 - Updated)

## 🏗️ Brand Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Helix GTM Consulting (Company Entity)                      │
│  └── GTMExpert.com (Personal Brand - Shashwat Ghosh)       │
│       ├── /ai-personalised-leadgeneration (Hub Page)       │
│       │    ├── HyperPlays.com (SERVICES) - CHILD BRAND    │
│       │    └── DiscoveryOutcomes.com (PRODUCT) - ADVISOR  │
│       └── GTM Services (EPIC, IMPACT, CRAFT Frameworks)    │
└─────────────────────────────────────────────────────────────┘
```

## ✅ What's Updated in v2.0

1. **Added HyperPlays as subOrganization** in organization schema
2. **Added Discovery Outcomes as isRelatedTo** reference
3. **Added Hub Page reference** (gtmexpert.com/ai-personalised-leadgeneration)
4. **Standardized LinkedIn URL**: `linkedin.com/in/shashwatghosh-ai-b2b-gtm-fractionalcmo/`
5. **Standardized Twitter**: `x.com/Shashwat_Ghosh`
6. **Added HyperPlays to person's owns and founder arrays**

## 📁 Files Included

| File | Purpose |
|------|---------|
| `organization-schema-with-testimonials.jsonld` | Main org with HyperPlays subOrganization |
| `person-schema.jsonld` | Shashwat Ghosh canonical profile |
| `person-schema-with-testimonials.jsonld` | Full testimonials |
| `person-schema-fixed-reviews.jsonld` | Compact version |
| `work-experience-schema.jsonld` | Career history |
| `professional-service-schema.jsonld` | Service details |
| `faq-schema-with-testimonials.jsonld` | FAQ with brand relationships |
| `ai-knowledge-base-schema.jsonld` | Knowledge hub |
| `educational-content-schema.jsonld` | Course/training |
| `service-gtm-epic.jsonld` | EPIC framework service |
| `structured_data_service_ai_lead_gen.jsonld` | AI lead gen options |
| `structured_data_service_fractional_cmo.jsonld` | Fractional CMO service |
| `validate-schemas.js` | Validation script |
| `package.json` | Package config |

## 🔗 Key Relationships

| Entity | Relationship | URL |
|--------|--------------|-----|
| **GTMExpert** | CANONICAL | gtmexpert.com |
| **HyperPlays** | subOrganization (CHILD) | hyper-plays.com |
| **Discovery Outcomes** | isRelatedTo (ADVISOR) | discoveryoutcomes.com |
| **Hub Page** | isRelatedTo | gtmexpert.com/ai-personalised-leadgeneration |

## 📧 Contact Hierarchy

| Brand | Email | Purpose |
|-------|-------|---------|
| GTMExpert | shashwat@gtmexpert.com | PRIMARY - All consulting inquiries |
| HyperPlays | shashwat@hyperplays.in | AI Lead Gen service inquiries |

## 🚀 Deployment

### Option 1: Manual (GTM Custom HTML)
Paste each schema file content wrapped in:
```html
<script type="application/ld+json">
[SCHEMA CONTENT]
</script>
```

### Option 2: WordPress Plugin
Use a JSON-LD schema plugin and paste content.

## ✨ Validation

```bash
npm run validate
# or
node validate-schemas.js
```

## 📊 Schema Integrity Checks

- ✅ All @id references consistent
- ✅ LinkedIn URL standardized
- ✅ Twitter/X handle correct (@Shashwat_Ghosh)
- ✅ Review count = 9 (matches Google)
- ✅ HyperPlays as subOrganization
- ✅ Discovery Outcomes referenced
- ✅ Hub page linked

---

**Version**: 2.0.0
**Last Updated**: December 30, 2025
**Author**: Shashwat Ghosh
