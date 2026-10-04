# GTM Expert Schema: Shashwat Ghosh and Helix GTM Consulting

Structured data for Shashwat Ghosh and Helix GTM Consulting. One facts file is the single source of truth; every other file here is generated from it.

**Facts captured:** 2026-10-04. **Licence:** UNLICENSED, private repository, all rights reserved (as in package.json).

## Profile

**Shashwat Ghosh**, Co-Founder and Fractional CMO, Helix GTM Consulting (founded 2022, Bengaluru, India).

- 24+ years in B2B; 10+ years of fractional experience
- Part of 6+ rebrands. He led two of them: QuantumStreet AI (from Equbot, with Digitas) and Airtel B2B (with Wolff Olins).
- He created the EPIC, IMPACT and CRAFT frameworks and the Hub-Spoke Brand Messaging Methodology.
- VP Marketing, Happay: 161% ARR growth. 2x exit: to CRED ($180M), then MakeMyTrip.
- VP Global Performance Marketing, Locus: $4.2M pipeline. Acquired by IKEA (Ingka Group) in Oct 2025.
- Fractional CMO, FieldAssist: 2.25x growth in mid-market and enterprise qualified leads.
- Advisor, QuantumStreet AI: rebranded a $7Bn AUM AI investment fund, with Digitas and IBM.
- 4x business growth, Airtel Data Centers and Managed Services.
- Rs 2.35 Cr TCV in 6 months with ABM at Seclore, and 225+ sales meetings across Seclore's target accounts.

## Recognition

- LinkedIn Top Product Marketing Voice: #10 India, #52 worldwide (Favikon verified)
- Top 15 AI Research and Innovation (India)
- Top 30 PLG creators worldwide
- Most Admired Marketing Leaders 2025 (CMO Asia)
- B2B Marketer of the Year 2020, Fintech (CMO Asia)

## Identity

| Entity | @id | URL |
|---|---|---|
| Shashwat Ghosh (Person) | https://www.gtmexpert.com/#shashwat-ghosh | https://www.gtmexpert.com |
| Helix GTM Consulting (Organization) | https://gtmhelix.com/#org | https://gtmhelix.com |
| HyperPlays (Organization, parent: Helix GTM Consulting) | https://www.hyper-plays.com/#org | https://www.hyper-plays.com/ |

The About page, https://gtmhelix.com/about/, is a WebPage whose mainEntity is the Person @id.

## Work history (LinkedIn wording)

- Co-Founder and Fractional CMO, Helix GTM Consulting: 2022-10 to present
- GTM Advisor, Discovery Outcomes: 2024-02 to present
- Partner, Fractional Frontiers: 2024-11 to present
- Advisor, GTM, Growth and Strategy, QuantumStreet AI: 2023-02 to present
- CMO, FieldAssist: 2023-04 to 2024-09
- VP Global Performance Marketing, Locus: 2022-02 to 2022-10
- Vice President Marketing, Happay: 2019-11 to 2022-01
- Strategic Marketing Consultant, Happay: 2018-04 to 2019-10
- Director of Product Marketing, Seclore: 2016-07 to 2017-10
- Head, Customer Insights, Brand & New Projects (Office Automation), HCL Infosystems Ltd.: 2013-02 to 2016-05
- Head, Strategy & Marketing (Office Automation), HCL Infosystems Ltd.: 2011-11 to 2013-02
- Senior Brand & Media Manager, Airtel: 2010-03 to 2011-10
- Senior Product Marketing Manager, Data, Voice & VAS, Airtel: 2008-03 to 2010-03
- Regional Marketing Head, West, Airtel: 2007-06 to 2008-03
- National Marketing Manager, Broadband, Reliance Communications: 2004-01 to 2007-05
- Account Manager, Wunderman (a Y&R, WPP agency): 2000-04 to 2004-01

## Frameworks

- **EPIC** (https://gtmhelix.com/epic/): Ecosystem and ABM, Product-Led Growth, Inbound and Outbound, Community-Led. It scores the four go-to-market motions from 1 to 10 for your stage, deal size, sales cycle and market, and names the one to lead with.
- **IMPACT** (https://impact.gtmhelix.com): Identify Champions, Map Alternatives, Pinpoint Value, Anchor Market, Craft Message, Translate Execution: six steps from the buyer who wants you to a message your team can use.
- **CRAFT** (https://craft-gtm.gtmhelix.com): Character, Result, Artifact, Frame, Timeline: the five things to tell an AI assistant so its answer is specific instead of generic.
- **Hub-Spoke Brand Messaging Methodology**: A methodology for effective branding, created by Shashwat Ghosh.

CRAFT templates: [CRAFT: 50 AI Context Engineering for Business](https://www.notion.com/templates/ai-context-engineering-craft-framework) on the Notion Marketplace: 50 templates and 3 ChatGPT assistants.

## Connectors and plugins

- GTM Alpha: https://gtmalpha.gtmhelix.com
- CRAFT GTM: https://craft-gtm.gtmhelix.com
- CRAFT Content: https://craft-content.gtmhelix.com
- IMPACT: https://impact.gtmhelix.com
- ICP Intelligence: https://icp-intelligence.gtmhelix.com
- Revenue Enablement: https://revenue-enablement.gtmhelix.com
- Positioning and GTM Strategy: https://tools.gtmhelix.com/plugins/gtm-skills/
- B2B Sales Enablement: https://tools.gtmhelix.com/plugins/b2b-sales-enablement/
- Customer Success: Churn and QBRs: https://tools.gtmhelix.com/plugins/b2b-customer-success/
- AI Search Visibility (AEO/GEO), partner: https://tools.gtmhelix.com/plugins/optise-helix-aeo-toolkit/

## Newsletters

- GTM Whisperer: https://gtmexpert.substack.com
- Offbeat AI Watch: https://gtmhelix.com/ai-trendwatch/

## Files

| File | What it is |
|---|---|
| facts/shashwat-ghosh.json | The facts, each with a source and the date captured. Edit this file only. |
| person-schema.jsonld | Person and the About WebPage |
| organization-schema.jsonld | Helix GTM Consulting, HyperPlays and the services on the live /services/ page |
| work-experience-schema.jsonld | One Role node per job, linked from the Person |
| faq-schema.jsonld | Questions answered only from the facts |
| gnn-graph-schema.jsonld | One plain schema.org @graph linking every entity by @id |
| testimonials.json | Plain data with a source link. No Review or AggregateRating markup anywhere. |
| build-from-facts.js | Generates all of the above and this README |
| validate-schemas.js | Checks the files against the facts and the wording rules |

## Use

```
node build-from-facts.js    # regenerate from the facts file
node validate-schemas.js    # run the checks
```

The sites read the same facts: work/bio.json in the project repo is generated from the facts file by work/facts/make_bio.py, and the site generators stop with an error if it differs.
