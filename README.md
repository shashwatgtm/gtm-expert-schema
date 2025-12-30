# GTMExpert Schema Repository (v2.1 - Comprehensive Update)

## 🏗️ Brand Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Helix GTM Consulting (Company Entity)                      │
│  └── GTMExpert.com (Personal Brand - Shashwat Ghosh)       │
│       ├── /ai-personalised-leadgeneration (Hub Page)       │
│       │    ├── HyperPlays.com (SERVICES) - CHILD BRAND    │
│       │    └── DiscoveryOutcomes.com (PRODUCT) - ADVISOR  │
│       └── GTM Services (EPIC, IMPACT, CRAFT Frameworks)    │
│       └── Brand Strategy & Rebranding (6+ Major Rebrands) │
└─────────────────────────────────────────────────────────────┘
```

## ✅ What's Updated in v2.1

### FieldAssist CMO Case Study (2023-2024)
Comprehensive achievements now documented:
- **FAi Launch GTM** — positioning, launch plan & demand engine
- **2.25× growth** in mid-market & enterprise qualified leads
- **+30% organic website traffic** (zero paid)
- **2× organic social growth** (10.5K → 23K+ followers)
- **DMS GTM Launch** — 3-phase go-to-market strategy
- **Africa GTM** — international expansion
- **419 validated leads**, 256 assigned (38 C/D/E + 28 B category)
- **60 enterprise accounts** (28 mid + 32 large)
- **Pathfinders program** (Atomberg: 3.5K views record)
- **Big 4 roundtables** (PwC, EY, Deloitte)
- **Case studies**: Bonjour, Cello, Too Yumm, Pearl Dairy, ITC, Mars

### Brand Strategy & Rebranding (NEW)
Led 6+ major corporate rebrands:

| Company | Role | Agency Partners |
|---------|------|-----------------|
| QuantumStreet AI | Led Complete Rebrand | Digitas Agency |
| Airtel Business | 2X Rebrands | Wolff Olins, JWT, Brand Union |
| FieldAssist | Brand Messaging | Hub-Spoke Methodology |
| HCL Infosystems | Key Team Member | (Restructure into HCL Services + 3 companies) |
| Reliance Communications | Key Team Member | DDB Mudra, Grey |
| Locus | Key Team Member | (Prior to IKEA acquisition) |

### Company Updates
- **Locus**: Acquired by Ingka Group (~90% IKEA retail) October 2025, valued at $300M
- **Happay**: 2X EXITS (CRED $180M Dec 2021 + MakeMyTrip Nov 2024)
- **Seclore**: $46M total funding (Series C $27M May 2022)
- **Discovery Outcomes**: Updated description - AI-powered GTM platform with human-like AI strategist

### New Skills Added
- Brand Strategist occupation
- Corporate Rebranding
- Brand Architecture
- Hub-Spoke Messaging Methodology
- Agency Management (Wolff Olins, JWT, Brand Union, Digitas, DDB Mudra, Grey)

## 📁 Files Included

| File | Purpose | v2.1 Updates |
|------|---------|--------------|
| `work-experience-schema.jsonld` | Career history | FieldAssist full achievements, rebrands, date corrections |
| `person-schema.jsonld` | Shashwat Ghosh canonical | Brand Strategist occupation, new skills |
| `organization-schema-with-testimonials.jsonld` | Main org | Discovery Outcomes description, Brand Strategy service |
| `professional-service-schema.jsonld` | Service details | Brand Strategy & Rebranding service |
| `person-schema-with-testimonials.jsonld` | Full testimonials | - |
| `person-schema-fixed-reviews.jsonld` | Compact version | - |
| `faq-schema-with-testimonials.jsonld` | FAQ with brand relationships | - |
| `ai-knowledge-base-schema.jsonld` | Knowledge hub | - |
| `educational-content-schema.jsonld` | Course/training | - |
| `service-gtm-epic.jsonld` | EPIC framework service | - |
| `structured_data_service_ai_lead_gen.jsonld` | AI lead gen options | - |
| `structured_data_service_fractional_cmo.jsonld` | Fractional CMO service | - |
| `validate-schemas.js` | Validation script | - |
| `package.json` | Package config | - |

## 🔗 Key Relationships

| Entity | Relationship | URL |
|--------|--------------|-----|
| **GTMExpert** | CANONICAL | gtmexpert.com |
| **HyperPlays** | subOrganization (CHILD) | hyper-plays.com |
| **Discovery Outcomes** | isRelatedTo (ADVISOR) | discoveryoutcomes.com |
| **Hub Page** | isRelatedTo | gtmexpert.com/ai-personalised-leadgeneration |
| **QuantumStreet AI** | Advisor (Rebrand Led) | - |

## 📊 Career Highlights (Updated)

| Company | Role | Key Achievement |
|---------|------|-----------------|
| **FieldAssist** | CMO | 2.25× qualified leads, 419 validated leads, 60 enterprise accounts |
| **Locus** | VP Global Performance Marketing | $4.2M pipeline (acquired by IKEA Oct 2025) |
| **Happay** | VP Marketing | 161% ARR growth (2X exits: CRED + MakeMyTrip) |
| **Seclore** | Director Product Marketing | 165% revenue growth |
| **Airtel** | Senior Brand Manager | 4X business growth + 2X rebrands |

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
- ✅ Discovery Outcomes referenced (correct description)
- ✅ Hub page linked
- ✅ FieldAssist comprehensive achievements
- ✅ Brand Strategist occupation added
- ✅ 6+ Rebrands documented
- ✅ Company acquisition updates (Locus IKEA, Happay MakeMyTrip)

---

**Version**: 2.1.0
**Last Updated**: December 30, 2025
**Author**: Shashwat Ghosh

### Changelog
- v2.1.0 (Dec 30, 2025): Added comprehensive FieldAssist CMO achievements, Brand Strategist occupation, 6+ rebrands, company acquisition updates
- v2.0.0 (Dec 30, 2025): Added HyperPlays as subOrganization, Discovery Outcomes reference, standardized URLs
