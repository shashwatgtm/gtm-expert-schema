"""Owner approved figures and links, 6 November 2026. Edits facts/shashwat-ghosh.json in place, keeping its layout."""
import json, os
F = os.path.join(os.path.dirname(os.path.abspath(__file__)), "facts", "shashwat-ghosh.json")
d = json.load(open(F, encoding="utf-8"))
SRC, CAP = "owner-2026-11-06", "2026-11-06"
SAMEAS = ["https://www.linkedin.com/in/shashwatghosh-ai-b2b-gtm-fractionalcmo/", "https://github.com/shashwatgtm",
          "https://www.npmjs.com/org/shashwatgtmalpha", "https://apify.com/shashghosh", "https://x.com/Shashwat_Ghosh",
          "https://www.skills.sh/shashwatgtm", "https://grokipedia.com/page/Shashwat_Ghosh"]
p = d["identity"]["person"]
p.update({"id": "https://gtmhelix.com/about/#shashwat-ghosh", "url": "https://gtmhelix.com/about/", "jobTitle": "AI native fractional CMO",
          "roleAtCompany": "Co-Founder of Helix GTM Consulting", "sameAs": SAMEAS, "source": SRC, "captured": CAP,
          "sameAsNote": "Owner rule, 6 November 2026: only profiles he controls, each checked live, plus the Grokipedia page about him (owner request). gtmexpert.com, Substack and the Google search link are no longer used as profiles; the newsletter stays under newsletters."})
d["capturedAt"] = CAP
d["figures"] = {
    "_about": "Owner approved figures. Every page on every Helix site must match these; the site check script fails a page that differs.",
    "yearsB2b": "24+", "yearsFractional": "10+", "engagements": "37+",
    "toolsAndSkills": 85, "connectorTools": 48, "connectors": 6, "pluginSkills": 37, "plugins": 9, "helixPlugins": 8, "partnerPlugins": 1,
    "guides": 30, "npmDownloads": 12400, "npmDownloadsTo": "2026-11-04", "npmDownloadsLabel": "npm downloads, first release to 4 November 2026",
    "positioning": {"primary": "AI native fractional CMO", "supporting": ["one person GTM team with AI agents", "the CMO who builds his own GTM tools"]},
    "source": SRC, "captured": CAP}
skills = {"gtm-skills": 3, "b2b-sales-enablement": 3, "b2b-customer-success": 5, "optise-helix-aeo-toolkit": 6}
for pl in d["plugins"]:
    pl["skills"] = skills.get(pl["id"], pl.get("skills"))
new = [
    ("b2b-deal-execution", "B2B Deal Execution", 4, "B2B Deal Execution is a Claude plugin with four skills for winning the deal in front of you: deal review and close plan, discovery and buying group, negotiation and champion, and sales sequences."),
    ("b2b-events-pr-and-launches", "B2B Events, PR and Launches", 4, "B2B Events, PR and Launches is a Claude plugin with four skills to plan B2B events, press releases and product launches."),
    ("b2b-icp-and-customer-insight", "B2B ICP and Customer Insight", 5, "B2B ICP and Customer Insight is a Claude plugin with five skills to review the ICP you have, plan customer interviews, build a fit scoring model, set buying role hypotheses and check product market fit."),
    ("b2b-personal-branding", "B2B Personal Branding", 3, "B2B Personal Branding is a Claude plugin with three skills to write bios and positioning from your own facts, audit drafts for machine sounding text and curate newsletters."),
    ("b2b-research-market-and-account", "B2B Research: Market and Account", 4, "B2B Research: Market and Account is a Claude plugin with four skills to research target accounts, build evidence based research assets, fact check claims and judge a second opinion."),
]
have = {pl["id"] for pl in d["plugins"]}
for pid, name, n, desc in new:
    if pid in have: continue
    d["plugins"].append({"id": pid, "name": name, "url": f"https://tools.gtmhelix.com/plugins/{pid}/", "repo": f"https://github.com/shashwatgtm/{pid}",
                         "licence": "MIT", "skills": n, "description": desc, "source": SRC, "captured": CAP, "nodeId": f"https://tools.gtmhelix.com/plugins/{pid}/#plugin"})
assert len(d["plugins"]) == 9 and sum(pl["skills"] for pl in d["plugins"]) == 37 and sum(c["tools"] for c in d["connectors"]) == 48
sb = d["siteBio"]
sb["role"] = "AI native fractional CMO"; sb["role_at"] = "AI native fractional CMO, Co-Founder of Helix GTM Consulting"
sb["links"].pop("gtmexpert", None)
s = json.dumps(d, ensure_ascii=False, indent=1)
s = s.replace("builds GTM tools (six connectors and four Claude plugins)", "builds GTM tools (85 tools and skills: 48 tools in six connectors and 37 skills in nine Claude plugins)")
assert "four Claude plugins" not in s
open(F, "w", encoding="utf-8", newline="\n").write(s + "\n")
print("facts updated: plugins", len(d["plugins"]), "skills", sum(pl["skills"] for pl in d["plugins"]), "tools", sum(c["tools"] for c in d["connectors"]))
