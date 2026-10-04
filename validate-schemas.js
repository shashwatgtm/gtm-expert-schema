/**
 * Validation for gtm-expert-schema. Run: node validate-schemas.js
 * Checks: every file parses; the generated files equal what the facts file produces; one Person @id and one Helix
 * Organization @id (HyperPlays is the one declared child Organization); banned wording is absent; no Review or
 * AggregateRating; every number in the JSON-LD appears in the facts file; no long or short dashes.
 */
const fs = require('fs');
const path = require('path');
const { build, FACTS_PATH } = require('./build-from-facts.js');

const DIR = __dirname;
let errors = 0;
const fail = (m) => { console.log('FAIL ' + m); errors++; };
const ok = (m) => console.log('ok   ' + m);

const factsText = fs.readFileSync(FACTS_PATH, 'utf8');
const facts = JSON.parse(factsText);
const PERSON = facts.identity.person.id;
const ORG = facts.identity.organization.id;
const HYPER = facts.identity.hyperplays.id;

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.jsonld') || f === 'testimonials.json' || f === 'README.md');
const parsed = {};
for (const f of files) {
  if (f === 'README.md') continue;
  try { parsed[f] = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); ok('parses: ' + f); } catch (e) { fail(`${f} does not parse: ${e.message}`); }
}
try { JSON.parse(factsText); ok('parses: facts/shashwat-ghosh.json'); } catch (e) { fail('facts file does not parse'); }

// generated files equal the facts file output
const before = errors;
const expected = build(facts);
for (const [name, content] of Object.entries(expected)) {
  const p = path.join(DIR, name);
  if (!fs.existsSync(p)) fail('missing generated file ' + name);
  else if (fs.readFileSync(p, 'utf8') !== content) fail(`${name} differs from the facts file (run: node build-from-facts.js)`);
}
for (const f of files) if (!(f in expected)) fail('file not generated from facts: ' + f);
if (errors === before) ok('every file equals the facts file output');

// one Person @id, one Helix Organization @id
const nodes = [];
for (const [f, j] of Object.entries(parsed)) {
  if (!f.endsWith('.jsonld')) continue;
  for (const n of j['@graph'] || [j]) nodes.push({ f, n });
}
const typeOf = (n) => [].concat(n['@type'] || []);
const personIds = new Set();
const orgIds = new Set();
for (const { n } of nodes) {
  if (typeOf(n).includes('Person') && n['@id']) personIds.add(n['@id']);
  if (typeOf(n).includes('Organization') && n['@id']) orgIds.add(n['@id']);
}
if (personIds.size === 1 && personIds.has(PERSON)) ok('one Person @id: ' + PERSON); else fail('Person @ids: ' + [...personIds].join(', '));
const helixOrgs = [...orgIds].filter((i) => i !== HYPER);
if (helixOrgs.length === 1 && helixOrgs[0] === ORG) ok('one Organization @id: ' + ORG + ' (plus the child ' + HYPER + ')'); else fail('Organization @ids: ' + [...orgIds].join(', '));

// every @id reference resolves inside the gnn graph, which holds every entity
const gnn = parsed['gnn-graph-schema.jsonld'];
if (gnn) {
  const have = new Set(gnn['@graph'].map((n) => n['@id']));
  const refs = new Set();
  const walk = (v) => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') {
      const keys = Object.keys(v);
      if (keys.length === 1 && keys[0] === '@id') refs.add(v['@id']);
      else keys.forEach((k) => walk(v[k]));
    }
  };
  walk(gnn['@graph']);
  const dangling = [...refs].filter((r) => !have.has(r));
  if (dangling.length) fail('@id references with no node in the graph: ' + dangling.join(', ')); else ok(`gnn graph: ${have.size} nodes, every @id reference resolves`);
  const custom = JSON.stringify(gnn).match(/"gnn[A-Za-z]*"|"@type":\s*"GNN[^"]*"/g);
  if (custom) fail('custom gnn vocabulary: ' + custom.join(', ')); else ok('gnn graph uses plain schema.org only');
}

// wording rules over every file, README and facts file included
const rules = [
  [/Led 6\+/i, '"Led 6+"'],
  [/Hub-Spoke Messaging Methodology/, '"Hub-Spoke Messaging Methodology" without "Brand"'],
  [/50\+ templates/i, '"50+ templates"'],
  [/#14 in AI Research/, '"#14 in AI Research"'],
  [/aggregateRating/i, 'aggregateRating', 'jsonld'],
  [/"@type":\s*"(Review|AggregateRating)"/, 'Review or AggregateRating markup', 'jsonld'],
  [/VP Performance Marketing/, '"VP Performance Marketing"'],
  [/CRED \(\$180M\+\)/, '"CRED ($180M+)"'],
  [/featured by Notion/i, '"featured by Notion"'],
  [/HSBC|BNP/, 'a client name'],
  [/Prashant Sarin|Mukundhan Sivaraman|Ravi Shankar|Ankit Agarwal|Sneha Kapoor/, 'a removed testimonial'],
  [/5\.0 Star Google Reviews/, 'the removed Google Reviews award'],
  [/https:\/\/www\.gtmexpert\.com\/#organization|https:\/\/gtmhelix\.com\/about\/#person/, 'an old @id'],
  [/tools\.gtmhelix\.com\/?"/, 'a tools.gtmhelix.com company url'],
  [/Founder of Helix|Cofounder/, 'Founder wording'],
  [/[–—]/, 'a long or short dash'],
];
const before2 = errors;
for (const f of [...files, 'facts/shashwat-ghosh.json']) {
  let t = fs.readFileSync(path.join(DIR, f), 'utf8');
  if (f.startsWith('facts/')) { const j = JSON.parse(t); delete j.siteBio.forbidden; t = JSON.stringify(j); } // the site bio's own list of forbidden wordings names the old wordings on purpose
  for (const [re, label, only] of rules) {
    if (only === 'jsonld' && !f.endsWith('.jsonld')) continue;
    if (re.test(t)) fail(`${f} contains ${label}`);
  }
}
if (errors === before2) ok('no banned wording, no Review or AggregateRating, no dashes');

// every number in the JSON-LD appears in the facts file
const numbers = (s) => s.match(/\d+(?:\.\d+)?/g) || [];
const factNumbers = new Set(numbers(factsText));
const missing = new Set();
const scan = (v) => {
  if (typeof v === 'string') { for (const n of numbers(v)) if (!factNumbers.has(n)) missing.add(n); }
  else if (Array.isArray(v)) v.forEach(scan);
  else if (v && typeof v === 'object') Object.values(v).forEach(scan);
};
for (const [f, j] of Object.entries(parsed)) if (f.endsWith('.jsonld')) scan(j);
if (missing.size) fail('numbers in JSON-LD that are not in the facts file: ' + [...missing].join(', ')); else ok('every number in the JSON-LD appears in the facts file');

// testimonials: every entry has a source link
const tm = parsed['testimonials.json'];
if (tm) {
  const bad = tm.testimonials.filter((t) => !/^https:\/\//.test(t.source || ''));
  if (bad.length) fail('testimonials without a source link: ' + bad.map((b) => b.author).join(', ')); else ok(`testimonials: ${tm.testimonials.length} entries, each with a source link`);
}

console.log(errors ? `\n${errors} problem(s)` : '\nAll checks passed');
process.exit(errors ? 1 : 0);
