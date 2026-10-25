export interface QA {
  id: string
  q: string
  a: string
  tags: string[]
  timeline?: boolean
}

// Deliberately short: each answer is the headline of a story and ends on a hook, so the conversation continues off-page.
export const qa: QA[] = [
  {
    id: 'what',
    q: 'What do you actually do?',
    a: "I build platforms from the first conversation to global rollout. Part engineer, part team lead, part business partner.\n\nThe code is only one piece of it. **Ask me how I spend the rest.**",
    tags: ['Build', 'Lead', 'Partner'],
  },
  {
    id: 'history',
    q: 'Walk me through your work history',
    a: "Four companies, one thread: owning the problem end to end, then the people and platform around it.",
    tags: ['Career'],
    timeline: true,
  },
  {
    id: 'impact',
    q: "What's the most impactful thing you've built?",
    a: "An assistant that turned days of waiting into answers in under a minute, then reached users around the world.\n\nThe technology was half the story. **The adoption was the hard part.**",
    tags: ['Platform', 'Adoption'],
  },
  {
    id: 'engine',
    q: 'How does your AI engine actually work?',
    a: "Every question is routed, grounded in an ontology across multiple data sources, then planned by an orchestrator that delegates to specialist agents and the right model for each step.\n\nA harness of evals and guardrails checks every answer, and a failed check loops back and retries. The result lands as an answer plus a governed Power BI report.\n\n**The loop is the interesting part.**",
    tags: ['Multi-agent', 'Ontology', 'LLM routing', 'Harness', 'Power BI'],
  },
  {
    id: 'stack',
    q: "What's your tech stack?",
    a: "I cover the whole platform, and the people around it.\n\n- **Functional:** stakeholder management, product ownership, team leadership, delivery and adoption, Responsible AI governance\n- **AI:** multi-agent orchestration, RAG, Text2SQL, MCP, LLM evaluation, prompt engineering\n- **Data:** Python, PySpark, SQL, Databricks, Delta Lake, Fabric, ETL and data modelling\n- **Cloud and DevOps:** Azure, AWS, GCP, Docker, Kubernetes, GitHub Actions\n- **Apps and BI:** React, FastAPI, Node, Power BI, Tableau\n\n**Every line has a story. Ask me which one.**",
    tags: ['Functional', 'AI', 'Data', 'Cloud', 'Apps'],
  },
  {
    id: 'talk',
    q: 'Can we talk?',
    a: "Yes. Tell me the problem you want solved and I will tell you how I would approach it.\n\n**manishchauhan.work95@gmail.com**",
    tags: ['Contact'],
  },
]
