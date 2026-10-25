from sqlmodel import Session, select

from app.models import BlogPost

SEED_POSTS = [
    {
        "slug": "master-data-modelling-at-2-billion-rows-a-day",
        "title": "What it takes to model master data at 2 billion rows a day",
        "dek": "Notes from building the trusted foundation under Coca-Cola's enterprise insights platform.",
        "cover_image_url": "",
        "tags": ["data-modelling", "data-engineering", "case-study"],
        "published": True,
        "content_md": """When primary sales, cooler sales, promotional flags and competitor data all
arrive from different bottlers, on different grains, in different shapes, the
first instinct is to reach for another dashboard. That's the wrong instinct.

Before any KPI — market share, salience, stock turnover, out-of-stock — could
be trusted, the platform needed one thing: a master data model that every
downstream pipeline could stand on without re-deriving its own truth.

## The problem underneath the problem

Fragmented source dependencies don't just slow reporting down, they make two
teams looking at "the same" number see two different answers, and nobody can
say with confidence which one is right. That erosion of trust is more
expensive than any individual pipeline delay.

## What the foundation actually looks like

- A modelling methodology that standardised primary sales across bottlers,
  plants and grains before a single downstream job touched the data.
- A denormalized columnar layer purpose-built for the query patterns
  leadership actually runs — day / month / quarter / YTD — instead of a
  general-purpose warehouse shape nobody optimized for.
- A medallion architecture (bronze → silver → gold) so raw ingestion,
  cleaning, and analytics-ready shaping stayed separable and independently
  testable.

## The payoff

Once the foundation was trusted, the interesting work could start: a
natural-language and speech-driven analytics layer over the same ~2B
rows/day, turning what used to be multi-day manual analyses into
minute-scale answers. None of that is possible without the boring part
coming first.
""",
    },
    {
        "slug": "building-an-automated-financial-analyst-agent",
        "title": "Building an AI agent that reads XBRL filings so Finance doesn't have to",
        "dek": "How an agentic pipeline collapsed a months-long manual workload into hours.",
        "cover_image_url": "",
        "tags": ["agentic-ai", "llm", "finance", "case-study"],
        "published": True,
        "content_md": """Every reporting cycle, Finance analysts across multiple bottlers were doing
the same painful thing by hand: opening unstructured XBRL filings, extracting
the KPIs that mattered, and computing composite fields against a rule
harness. It was accurate work done by people who were far too senior to be
doing it manually.

## Why this was an agent problem, not a script problem

XBRL filings vary enough in structure across bottlers that a fixed parser
breaks constantly. The task needed something that could reason about
where a figure lives in a filing, extract it, validate it, and flag what it
wasn't confident about — closer to how an analyst actually works than to a
traditional ETL job.

## The shape of the solution

1. **Ingestion** — pull unstructured filings from multiple bottlers into a
   consistent intake format.
2. **Extraction** — an LLM-driven step locates and extracts the financial
   KPIs the rule harness needs, rather than relying on brittle positional
   parsing.
3. **Computation** — composite fields get calculated against a rule harness
   that encodes how Finance actually defines these metrics.
4. **Human-in-the-loop review** — analysts review flagged or low-confidence
   outputs instead of starting from a blank filing every time.

## What actually mattered for adoption

The technical extraction was the easy 60%. The part that made Finance trust
it was the evaluation harness underneath — a golden dataset, LLM-as-judge
scoring, and A/B gates before anything shipped to production. An agent that
is occasionally brilliant and occasionally confidently wrong is worse than
no agent at all. Getting Finance to hand over months of manual work required
proving, repeatedly, where the system was reliable and where it wasn't.

The result: a months-long manual workload collapsed into hours, and analysts
got their time back for the judgment calls that actually need a human.
""",
    },
    {
        "slug": "evaluating-rag-and-agents-before-you-trust-them",
        "title": "You can't ship a RAG system on vibes: building an evaluation harness that holds up",
        "dek": "Golden sets, LLM-as-judge, and A/B gates — the unglamorous work that makes agentic systems trustworthy.",
        "cover_image_url": "",
        "tags": ["llm", "evaluation", "rag", "mlops"],
        "published": True,
        "content_md": """It's easy to get a RAG demo working. It's much harder to know, with any
rigor, whether the version you shipped last week is actually better than the
one before it. Most teams find out the hard way — a stakeholder notices a bad
answer in a live review.

## Start with a golden set, not a vibe check

Before optimizing anything, we built a golden dataset of real questions with
verified correct answers, spanning hybrid and multi-hop retrieval cases —
the queries that actually break naive RAG, not just the easy ones.

## LLM-as-judge, with guardrails on the judge itself

An LLM grading another LLM's output sounds circular until you constrain it
properly: structured rubrics, reference answers to compare against, and
periodic human spot-checks to make sure the judge hasn't drifted. Treat the
judge as a component that itself needs evaluation, not as ground truth.

## A/B gates before anything reaches production

Every change to retrieval, prompting, or the underlying model had to clear
an A/B gate against the golden set before it could ship. This is the
difference between "we think this prompt tweak helped" and "we can show it
helped, and here's what it cost us on the cases it made worse."

## Human-in-the-loop as a feedback loop, not a safety net

HITL review wasn't just a fallback for low-confidence answers — flagged
cases fed back into the golden set, so the evaluation harness got sharper
over time instead of staying static while the system around it evolved.

## Why this matters more as agents get more autonomous

The more a system plans, calls tools, and chains steps on its own, the more
ways it can fail silently. An evaluation harness isn't overhead on top of
building agentic systems — it's the only reason you're allowed to trust them
with real decisions.
""",
    },
]


def seed_if_empty(session: Session) -> None:
    existing = session.exec(select(BlogPost)).first()
    if existing:
        return
    for data in SEED_POSTS:
        post = BlogPost(
            slug=data["slug"],
            title=data["title"],
            dek=data["dek"],
            cover_image_url=data["cover_image_url"],
            content_md=data["content_md"].strip(),
            published=data["published"],
        )
        post.tags = data["tags"]
        session.add(post)
    session.commit()
