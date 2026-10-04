/**
 * Validation for gtm-expert-schema. Run: node validate-schemas.js [--offline]
 * Checks: every file parses; the generated files equal what the facts file produces; one Person @id and one Helix
 * Organization @id (the only other Organizations are the ones the facts file declares: HyperPlays, Optise, employers);
 * Person and Organization share no sameAs address; connector and plugin @ids equal the @ids their live pages use;
 * banned wording is absent; every number in the JSON-LD appears in the facts file; every image answers 200.
 */
const fs = require('fs');
const path = require('path');
const { build, FACTS_PATH } = require('./build-from-facts.js');

const DIR = __dirname;
const OFFLINE = process.argv.includes('--offline');
let errors = 0;
const fail = (m) => { console.log('FAIL ' + m); errors++; };
const ok = (m) => console.log('ok   ' + m);

const factsText = fs.readFileSync(FACTS_PATH, 'utf8');
const facts = JSON.parse(factsText);
const PERSON = facts.identity.person.id;
const ORG = facts.identity.organization.id;

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.jsonld') || f === 'testimonials.json' || f === 'README.md');
const parsed = {};
for (const f of files) {
  if (f === 'README.md') continue;
  try { parsed[f] = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); ok('parses: ' + f); } catch (e) { fail(`${f} does not parse: ${e.message}`); }
}
ok('parses: facts/shashwat-ghosh.json');

// generated files equal the facts file output
let before = errors;
const expected = build(facts);
for (const [name, content] of Object.entries(expected)) {
  const p = path.join(DIR, name);
  if (!fs.existsSync(p)) fail('missing generated file ' + name);
  else if (fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n') !== content) fail(`${name} differs from the facts file (run: node build-from-facts.js)`);
}
for (const f of files) if (!(f in expected)) fail('file not generated from facts: ' + f);
if (errors === before) ok('every file equals the facts file output');

// nodes
const nodes = [];
for (const [f, j] of Object.entries(parsed)) {
  if (!f.endsWith('.jsonld')) continue;
  for (const n of j['@graph'] || [j]) nodes.push({ f, n });
}
const typeOf = (n) => [].concat(n['@type'] || []);

// one Person @id, one Helix Organization @id
const personIds = new Set(nodes.filter(({ n }) => typeOf(n).includes('Person') && n['@id']).map(({ n }) => n['@id']));
if (personIds.size === 1 && personIds.has(PERSON)) ok('one Person @id: ' + PERSON); else fail('Person @ids: ' + [...personIds].join(', '));
const declared = new Set([ORG, facts.identity.hyperplays.id, facts.identity.optise.id, ...facts.employers.map((e) => 'https://www.gtmexpert.com/#employer-' + e.id)]);
const orgNodes = nodes.filter(({ n }) => typeOf(n).includes('Organization') && n['@id']).map(({ n }) => n);
const stray = [...new Set(orgNodes.map((n) => n['@id']))].filter((i) => !declared.has(i));
const helixLike = orgNodes.filter((n) => n['@id'] !== ORG && (/helix/i.test(n.name || '') || /gtmhelix\.com\/?$/.test(n.url || '')));
if (stray.length) fail('Organization @ids not declared in the facts file: ' + stray.join(', '));
else if (helixLike.length) fail('a second Helix Organization: ' + helixLike.map((n) => n['@id']).join(', '));
else ok('one Helix Organization @id: ' + ORG + '; the other Organizations are the declared ones (HyperPlays, Optise, employers)');

// Person and Organization share no sameAs
const sa = (type) => new Set(nodes.filter(({ n }) => typeOf(n).includes(type) && n.sameAs).flatMap(({ n }) => [].concat(n.sameAs).map((u) => u.replace(/\/$/, ''))));
const both = [...sa('Person')].filter((u) => sa('Organization').has(u));
if (both.length) fail('Person and Organization share sameAs: ' + both.join(', ')); else ok('Person and Organization share no sameAs address');

// graph: every @id reference resolves; connector and plugin @ids
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
  if (/"gnn[A-Za-z]*"/.test(JSON.stringify(gnn))) fail('custom gnn vocabulary'); else ok('gnn graph uses plain schema.org only');
  const apps = gnn['@graph'].filter((n) => typeOf(n).includes('SoftwareApplication'));
  const badIds = apps.filter((n) => !(n['@id'] === n.url.replace(/\/$/, '') + '/#app' || n['@id'] === n.url + '#plugin'));
  if (badIds.length) fail('connector or plugin @id not in the live pattern: ' + badIds.map((n) => n['@id']).join(', ')); else ok(`${apps.length} connector and plugin nodes use the live @id pattern`);
}

// wording rules over every file, README and facts file included
const rules = [
  [/Led 6\+/i, '"Led 6+"'],
  [/Hub-Spoke Messaging Methodology/, '"Hub-Spoke Messaging Methodology" without "Brand"'],
  [/50\+ templates/i, '"50+ templates"'],
  [/#14 in AI Research/, '"#14 in AI Research"'],
  [/aggregateRating/i, 'aggregateRating', 'jsonld'],
  [/"@type":\s*"(Review|AggregateRating)"/, 'Review or AggregateRating markup', 'jsonld'],
  [/isAccessibleForFree/, 'isAccessibleForFree', 'jsonld'],
  [/hasOccupation/, 'hasOccupation', 'jsonld'],
  [/VP Performance Marketing/, '"VP Performance Marketing"'],
  [/CRED \(\$180M\+\)/, '"CRED ($180M+)"'],
  [/\bfree\b/i, 'the word "free"'],
  [/featured by Notion/i, '"featured by Notion"'],
  [/HSBC|BNP/, 'a client name'],
  [/Prashant Sarin|Mukundhan Sivaraman|Ravi Shankar|Ankit Agarwal|Sneha Kapoor|Krishnamohan|Sandesh Bilagi/, 'a removed testimonial'],
  [/5\.0 Star Google Reviews/, 'the removed Google Reviews award'],
  [/https:\/\/www\.gtmexpert\.com\/#organization|https:\/\/gtmhelix\.com\/about\/#person/, 'an old @id'],
  [/tools\.gtmhelix\.com\/?"/, 'a tools.gtmhelix.com company url'],
  [/gtmexpert\.com\/wp-content/, 'a gtmexpert.com/wp-content address'],
  [/Founder of Helix|Cofounder/, 'Founder wording'],
  [/Ltd\.\./, 'a double full stop after Ltd.'],
  [/\(AEO\/GEO\), partner/, '", partner" in the Optise plugin name'],
  [/\$300M/, 'the Locus $300M valuation'],
  [/APAC/, 'APAC'],
  [/for 24 years/, '"for 24 years"'],
  [/[–—]/, 'a long or short dash'],
];
before = errors;
for (const f of [...files, 'facts/shashwat-ghosh.json']) {
  let t = fs.readFileSync(path.join(DIR, f), 'utf8');
  if (f.startsWith('facts/')) { const j = JSON.parse(t); delete j.siteBio.forbidden; delete j.doNotUse; t = JSON.stringify(j); }
  for (const [re, label, only] of rules) {
    if (only === 'jsonld' && !f.endsWith('.jsonld')) continue;
    if (re.test(t)) fail(`${f} contains ${label}`);
  }
}
const readme = fs.readFileSync(path.join(DIR, 'README.md'), 'utf8');
if (/\bprivate\b/i.test(readme)) fail('README calls the repository private');
if (errors === before) ok('no banned wording, no review markup, no dashes, no "free"');
const pkg = JSON.parse(fs.readFileSync(path.join(DIR, 'package.json'), 'utf8'));
if (!readme.includes(pkg.license)) fail('README licence differs from package.json');
if (!/shashwat@gtmhelix\.com/.test(pkg.author)) fail('package.json author email is not shashwat@gtmhelix.com');

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

// testimonials: every entry has a source link, and only the facts-file entries
const tm = parsed['testimonials.json'];
if (tm) {
  const bad = tm.testimonials.filter((t) => !/^https:\/\//.test(t.source || ''));
  if (bad.length) fail('testimonials without a source link: ' + bad.map((b) => b.author).join(', ')); else ok(`testimonials: ${tm.testimonials.length} entries, each with a source link`);
}

// images and live @ids (network)
const imgs = new Set();
const walkImg = (x) => { if (Array.isArray(x)) x.forEach(walkImg); else if (x && typeof x === 'object') for (const [k, val] of Object.entries(x)) { if ((k === 'image' || k === 'logo') && typeof val === 'string') imgs.add(val); else walkImg(val); } };
for (const j of Object.values(parsed)) walkImg(j);

async function online() {
  for (const u of imgs) {
    try { const r = await fetch(u); if (r.status !== 200) fail(`image ${u} answers ${r.status}`); else ok(`image answers 200: ${u}`); } catch (e) { fail(`image ${u}: ${e.message}`); }
  }
  const apps = gnn['@graph'].filter((n) => typeOf(n).includes('SoftwareApplication'));
  for (const n of apps) {
    try {
      const r = await fetch(n.url, { headers: { 'user-agent': 'Mozilla/5.0' } });
      const t = await r.text();
      const ids = [];
      for (const m of t.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        for (const g of (JSON.parse(m[1])['@graph'] || [])) if (typeOf(g).includes('SoftwareApplication')) ids.push(g['@id']);
      }
      if (ids.includes(n['@id'])) ok(`live page declares ${n['@id']}`); else fail(`live page ${n.url} declares ${ids.join(', ')}, not ${n['@id']}`);
      const orgs = [];
      for (const m of t.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) for (const g of (JSON.parse(m[1])['@graph'] || [])) if (typeOf(g).includes('Organization') && /helix/i.test(g.name || '') && g['@id'] !== ORG) orgs.push(g['@id']);
      if (orgs.length) fail(`${n.url} declares another Helix Organization: ${orgs.join(', ')}`);
    } catch (e) { fail(`live check ${n.url}: ${e.message}`); }
  }
}

(OFFLINE ? Promise.resolve() : online()).then(() => {
  console.log(errors ? `\n${errors} problem(s)` : '\nAll checks passed');
  process.exit(errors ? 1 : 0);
});
