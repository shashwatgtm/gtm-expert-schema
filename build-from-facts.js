/**
 * Generates every public file in this repo from facts/shashwat-ghosh.json.
 * Run: node build-from-facts.js          (writes the files)
 *      node build-from-facts.js --check  (exits 1 if a file differs from what the facts file produces)
 */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const FACTS_PATH = path.join(DIR, 'facts', 'shashwat-ghosh.json');
const J = (o) => JSON.stringify(o, null, 2) + '\n';

function build(facts) {
  const id = facts.identity;
  const PERSON = id.person.id;
  const ORG = id.organization.id;
  const HYPER = id.hyperplays.id;
  const ctx = 'https://schema.org';
  const pid = (x) => ({ '@id': x });
  const city = id.organization.city;
  const place = (name) => ({ '@type': 'Place', name });
  const head = Object.fromEntries(facts.headline.map((h) => [h.id, h.text]));
  const base = 'https://gtmhelix.com/#';
  const roleId = (r) => 'https://www.gtmexpert.com/#role-' + r.id;
  const fwId = (f) => base + 'framework-' + f.id;
  const connId = (c) => base + 'connector-' + c.id;
  const plugId = (p) => base + 'plugin-' + p.id;
  const nlId = (n) => base + 'newsletter-' + n.id;
  const svcId = (s) => base + 'service-' + s.id;
  const CRAFT_TEMPLATES = base + 'craft-templates';
  const PAGE = 'https://gtmhelix.com/about/#page';

  const personDescription = `${id.person.jobTitle} of ${id.organization.name}, founded in ${id.organization.foundingDate} in ${city}. ` +
    `${head['years-b2b']} and ${head['years-fractional']}. ${head.frameworks} ${head.rebrands} Results: ` +
    ['happay', 'locus', 'fieldassist', 'quantumstreet', 'airtel', 'seclore'].map((k) => head[k]).join(' ');

  const person = {
    '@type': 'Person', '@id': PERSON, name: id.person.name, url: id.person.url, jobTitle: id.person.jobTitle,
    description: personDescription, worksFor: pid(ORG), email: id.person.email,
    address: { '@type': 'PostalAddress', addressLocality: id.person.city },
    award: facts.awards.map((a) => a.text), knowsAbout: facts.frameworks.map((f) => f.name),
    sameAs: id.person.sameAs,
    contactPoint: { '@type': 'ContactPoint', contactType: id.person.contactPoint.contactType, name: id.person.contactPoint.name, url: id.person.contactPoint.url, email: id.person.contactPoint.email },
  };
  const aboutPage = { '@type': 'WebPage', '@id': PAGE, url: id.person.aboutPage, name: 'About Shashwat Ghosh | Helix GTM Consulting', mainEntity: pid(PERSON) };

  const services = facts.services.map((s) => ({ '@type': 'Service', '@id': svcId(s), name: s.name, url: s.url, description: s.description, provider: pid(ORG) }));
  const org = {
    '@type': 'Organization', '@id': ORG, name: id.organization.name, alternateName: id.organization.alternateName, url: id.organization.url,
    email: id.organization.email, foundingDate: id.organization.foundingDate,
    description: `Founded in ${id.organization.foundingDate} in ${city}, ${id.organization.country}.`,
    foundingLocation: place(city),
    address: { '@type': 'PostalAddress', addressLocality: city, addressCountry: id.organization.country },
    areaServed: id.organization.areaServed.map(place),
    sameAs: id.organization.sameAs, founder: pid(PERSON),
    hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Services', itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: pid(s['@id']) })) },
  };
  const hyper = { '@type': 'Organization', '@id': HYPER, name: id.hyperplays.name, url: id.hyperplays.url, parentOrganization: pid(ORG) };

  const roles = facts.roles.map((r) => {
    const parts = [`${r.title}, ${r.organization}.`, ...r.bullets];
    const node = { '@type': 'Role', '@id': roleId(r), roleName: r.title, name: `${r.title}, ${r.organization}`, startDate: r.start };
    if (r.end) node.endDate = r.end;
    node.description = parts.join(' ');
    if (r.id === 'helix-co-founder') node.url = id.organization.url;
    return node;
  });
  const personRoles = { '@type': 'Person', '@id': PERSON, name: id.person.name, hasOccupation: roles.map((r) => pid(r['@id'])) };

  const fwBased = { 'gtm-alpha': 'epic', impact: 'impact', 'craft-gtm': 'craft', 'craft-content': 'craft' };
  const frameworks = facts.frameworks.map((f) => {
    const n = { '@type': 'CreativeWork', '@id': fwId(f), name: f.name, description: f.description, creator: pid(PERSON) };
    if (f.url) n.url = f.url;
    return n;
  });
  const connectors = facts.connectors.map((c) => {
    const n = { '@type': 'SoftwareApplication', '@id': connId(c), name: c.name, url: c.url, description: c.description, applicationCategory: 'BusinessApplication', isAccessibleForFree: true, creator: pid(PERSON), publisher: pid(ORG) };
    if (fwBased[c.id]) n.isBasedOn = pid(base + 'framework-' + fwBased[c.id]);
    return n;
  });
  const plugins = facts.plugins.map((p) => {
    const n = { '@type': 'SoftwareApplication', '@id': plugId(p), name: p.name, url: p.url, sameAs: [p.repo], description: p.description, isAccessibleForFree: true };
    if (!/partner/i.test(p.name)) { n.creator = pid(PERSON); n.publisher = pid(ORG); }
    return n;
  });
  const newsletters = facts.newsletters.map((n) => ({ '@type': 'CreativeWorkSeries', '@id': nlId(n), name: n.name, url: n.url, author: pid(PERSON) }));
  const ct = facts.craftTemplates;
  const craftTemplates = {
    '@type': 'CreativeWork', '@id': CRAFT_TEMPLATES, name: ct.name, url: ct.url, creator: pid(PERSON), isBasedOn: pid(base + 'framework-craft'),
    description: `${ct.templates} templates (${Object.entries(ct.breakdown).map(([k, v]) => `${v} ${k}`).join(', ')}) and ${ct.chatgptAssistants} ChatGPT assistants, on the ${ct.platform}.`,
  };

  const faqQ = (q, a) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } });
  const lastWord = (t) => t.replace(/\.$/, '');
  const faq = [
    faqQ('Who is Shashwat Ghosh?', `${id.person.name} is ${id.person.jobTitle} of ${id.organization.name}, founded in ${id.organization.foundingDate} in ${city}, ${id.organization.country}. He has ${head['years-b2b'].replace('24+ years in B2B', '24+ years in B2B')} and ${head['years-fractional']}.`),
    faqQ('What is Helix GTM Consulting?', `${id.organization.name} was founded in ${id.organization.foundingDate} in ${city}, ${id.organization.country}. Its Co-Founder and Fractional CMO is ${id.person.name}. It offers ${facts.connectors.length === 6 ? 'six' : facts.connectors.length} free GTM connectors and ${facts.plugins.length === 4 ? 'four' : facts.plugins.length} plugins, and Fractional CMO work.`),
    faqQ('What results has Shashwat Ghosh delivered?', ['happay', 'locus', 'fieldassist', 'quantumstreet', 'airtel', 'seclore'].map((k) => head[k]).join(' ')),
    faqQ('Which frameworks did Shashwat Ghosh create?', head.frameworks.replace(/^He created/, `${id.person.name} created`) + ' ' + facts.frameworks.filter((f) => f.url).map((f) => `${f.name}: ${f.url}`).join('; ') + '.'),
    faqQ('How many rebrands has Shashwat Ghosh been part of?', head.rebrands),
    faqQ('What recognition has Shashwat Ghosh received?', facts.awards.map((a) => lastWord(a.text) + '.').join(' ')),
    faqQ('What is the CRAFT: 50 AI Context Engineering for Business template pack?', craftTemplates.description + ' ' + ct.url),
    faqQ('Which newsletters does Shashwat Ghosh write?', facts.newsletters.map((n) => `${n.name}: ${n.url}`).join('; ') + '.'),
    faqQ('Which free GTM connectors does Helix GTM Consulting offer?', facts.connectors.map((c) => `${c.name}: ${c.url}`).join('; ') + '.'),
    faqQ('Which plugins does Helix GTM Consulting offer?', facts.plugins.map((p) => `${p.name}: ${p.url}`).join('; ') + '.'),
    faqQ('How do I book a call with Shashwat Ghosh?', `Book 45 minutes with Shashwat: ${id.person.contactPoint.url}`),
    faqQ('What do people say about working with Shashwat Ghosh?', `Recommendations from colleagues and clients are on his LinkedIn profile, and Helix GTM Consulting has ${facts.googleReviewsSummary.reviews} Google reviews, all ${facts.googleReviewsSummary.stars} stars.`),
  ];
  const faqNode = { '@type': 'FAQPage', '@id': 'https://gtmhelix.com/#faq', about: pid(PERSON), mainEntity: faq };

  const gl = (nodes) => ({ '@context': ctx, '@graph': nodes });
  const out = {};
  out['person-schema.jsonld'] = J(gl([person, aboutPage]));
  out['organization-schema.jsonld'] = J(gl([org, hyper, ...services]));
  out['work-experience-schema.jsonld'] = J(gl([personRoles, ...roles]));
  out['faq-schema.jsonld'] = J(gl([faqNode]));

  // one plain @graph: merge nodes with the same @id, then add the rest
  const merged = new Map();
  for (const n of [person, aboutPage, org, hyper, ...services, personRoles, ...roles]) {
    merged.set(n['@id'], { ...(merged.get(n['@id']) || {}), ...n });
  }
  const graph = [...merged.values(), ...frameworks, ...connectors, ...plugins, ...newsletters, craftTemplates];
  out['gnn-graph-schema.jsonld'] = J(gl(graph));

  const tm = {
    _about: 'Plain data generated from facts/shashwat-ghosh.json. Word for word, original spelling kept. Not marked up as Review or AggregateRating anywhere.',
    google: { reviews: facts.googleReviewsSummary.reviews, stars: facts.googleReviewsSummary.stars, withText: facts.googleReviewsSummary.withText, source: id.googleBusinessProfile.shortLink },
    testimonials: facts.testimonials.map((t) => {
      const o = { author: t.author };
      if (t.headline) o.headline = t.headline;
      o.platform = t.platform; o.date = t.date;
      if (t.relationship) o.relationship = t.relationship;
      if (t.rating) o.stars = t.rating;
      o.text = t.text; o.source = t.url;
      return o;
    }),
  };
  out['testimonials.json'] = J(tm);

  out['README.md'] = readme(facts, { head, org, roles });
  return out;
}

function readme(facts, { head }) {
  const id = facts.identity;
  const pkg = JSON.parse(fs.readFileSync(path.join(DIR, 'package.json'), 'utf8'));
  const d = facts.capturedAt;
  const L = [];
  L.push('# GTM Expert Schema: Shashwat Ghosh and Helix GTM Consulting', '');
  L.push('Structured data for Shashwat Ghosh and Helix GTM Consulting. One facts file is the single source of truth; every other file here is generated from it.', '');
  L.push(`**Facts captured:** ${d}. **Licence:** ${pkg.license}, ${pkg.private ? 'private repository, all rights reserved' : 'see package.json'} (as in package.json).`, '');
  L.push('## Profile', '');
  L.push(`**${id.person.name}**, ${id.person.jobTitle}, ${id.organization.name} (founded ${id.organization.foundingDate}, ${id.organization.city}, ${id.organization.country}).`, '');
  L.push(`- ${head['years-b2b']}; ${head['years-fractional']}`, `- ${head.rebrands}`, `- ${head.frameworks}`);
  for (const k of ['happay', 'locus', 'fieldassist', 'quantumstreet', 'airtel', 'seclore']) L.push(`- ${head[k]}`);
  L.push('');
  L.push('## Recognition', '');
  for (const a of facts.awards) L.push(`- ${a.text}`);
  L.push('', '## Identity', '', '| Entity | @id | URL |', '|---|---|---|');
  L.push(`| ${id.person.name} (Person) | ${id.person.id} | ${id.person.url} |`);
  L.push(`| ${id.organization.name} (Organization) | ${id.organization.id} | ${id.organization.url} |`);
  L.push(`| ${id.hyperplays.name} (Organization, parent: ${id.organization.name}) | ${id.hyperplays.id} | ${id.hyperplays.url} |`);
  L.push('', 'The About page, https://gtmhelix.com/about/, is a WebPage whose mainEntity is the Person @id.', '');
  L.push('## Work history (LinkedIn wording)', '');
  for (const r of facts.roles) L.push(`- ${r.title}, ${r.organization}: ${r.start} to ${r.end || 'present'}`);
  L.push('', '## Frameworks', '');
  for (const f of facts.frameworks) L.push(`- **${f.name}**${f.url ? ` (${f.url})` : ''}: ${f.description}`);
  L.push('', `CRAFT templates: [${facts.craftTemplates.name}](${facts.craftTemplates.url}) on the ${facts.craftTemplates.platform}: ${facts.craftTemplates.templates} templates and ${facts.craftTemplates.chatgptAssistants} ChatGPT assistants.`, '');
  L.push('## Connectors and plugins', '');
  for (const c of facts.connectors) L.push(`- ${c.name}: ${c.url}`);
  for (const p of facts.plugins) L.push(`- ${p.name}: ${p.url}`);
  L.push('', '## Newsletters', '');
  for (const n of facts.newsletters) L.push(`- ${n.name}: ${n.url}`);
  L.push('', '## Files', '', '| File | What it is |', '|---|---|');
  L.push('| facts/shashwat-ghosh.json | The facts, each with a source and the date captured. Edit this file only. |');
  L.push('| person-schema.jsonld | Person and the About WebPage |');
  L.push('| organization-schema.jsonld | Helix GTM Consulting, HyperPlays and the services on the live /services/ page |');
  L.push('| work-experience-schema.jsonld | One Role node per job, linked from the Person |');
  L.push('| faq-schema.jsonld | Questions answered only from the facts |');
  L.push('| gnn-graph-schema.jsonld | One plain schema.org @graph linking every entity by @id |');
  L.push('| testimonials.json | Plain data with a source link. No Review or AggregateRating markup anywhere. |');
  L.push('| build-from-facts.js | Generates all of the above and this README |');
  L.push('| validate-schemas.js | Checks the files against the facts and the wording rules |', '');
  L.push('## Use', '', '```', 'node build-from-facts.js    # regenerate from the facts file', 'node validate-schemas.js    # run the checks', '```', '');
  L.push('The sites read the same facts: work/bio.json in the project repo is generated from the facts file by work/facts/make_bio.py, and the site generators stop with an error if it differs.', '');
  return L.join('\n');
}

module.exports = { build, FACTS_PATH };

if (require.main === module) {
  const facts = JSON.parse(fs.readFileSync(FACTS_PATH, 'utf8'));
  const out = build(facts);
  const check = process.argv.includes('--check');
  let bad = 0;
  for (const [name, content] of Object.entries(out)) {
    const p = path.join(DIR, name);
    if (check) {
      if (!fs.existsSync(p) || fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n') !== content) { console.log('DIFFERS: ' + name); bad++; }
    } else {
      fs.writeFileSync(p, content);
      console.log('wrote ' + name);
    }
  }
  if (check) process.exit(bad ? 1 : 0);
}
