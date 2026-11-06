"""Owner's forum profile, 6 November 2026, as approved by the tools coordinator. Facts file wins on conflicts (10+ fractional years, not 8+).
Not used from the profile: "highly awarded", "8+ years", "Claude specialist" and any client name."""
import json, os
F = os.path.join(os.path.dirname(os.path.abspath(__file__)), "facts", "shashwat-ghosh.json")
d = json.load(open(F, encoding="utf-8"))
SRC, CAP = "owner-2026-11-06", "2026-11-06"
d["careerPath"] = {"_about": "How the career built the judgement. Plain English lines for the About page; no arrows or dashes.",
                   "lines": ["From hardware to services to product marketing.",
                             "From horizontal SaaS to vertical SaaS to AI driven marketing.",
                             "From agency work to B2C storytelling to B2B strategy.",
                             "From brand builder to revenue marketing architect."],
                   "source": SRC, "captured": CAP}
d["knowsAbout"] = {"_about": "Added to the Person knowsAbout list after the frameworks.",
                   "sectors": ["Fintech", "BFSI", "Logistics tech", "Cybersecurity", "Telecommunications", "IT services and ITeS", "Retail", "Consumer packaged goods"],
                   "disciplines": ["GTM strategy", "Product marketing", "Enterprise brand building", "Demand generation", "Account based marketing (ABM)",
                                   "Product led growth (PLG)", "Sales enablement: ROI calculators and battle cards",
                                   "Ecosystem partnerships with ITeS, BPO, payment gateway and ERP vendors"],
                   "source": SRC, "captured": CAP}
d["quotes"] = [{"id": "context-drives-strategy", "text": "Context drives strategy. Playbooks merely execute it. But the right AI tool is the real judgement.",
                "author": "Shashwat Ghosh", "note": "Verbatim from the owner, with \"the\" added before \"real judgement\".", "source": SRC, "captured": CAP}]
d["capturedAt"] = CAP
s = json.dumps(d, ensure_ascii=False, indent=1)
for bad in ["8+ years", "highly awarded", "Claude specialist"]:
    assert bad not in s, bad
open(F, "w", encoding="utf-8", newline="\n").write(s + "\n")
print("facts updated: sectors", len(d["knowsAbout"]["sectors"]), "disciplines", len(d["knowsAbout"]["disciplines"]))
