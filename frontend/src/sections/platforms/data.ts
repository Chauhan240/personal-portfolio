export interface PlatformInfo {
  id: 'insight' | 'tower' | 'analyst' | 'unified' | 'okr'
  title: string
  tag: string
  summary: string
  metrics: { value: string; label: string }[]
  stack: string[]
  stat: { pre?: string; to?: number; dec?: number; post: string; label: string }
}

export const platforms: PlatformInfo[] = [
  {
    id: 'insight',
    stat: { post: '< 1 min', label: 'from question to answer, down from days. Adopted by teams around the world.' },
    title: 'Gen AI Insight Engine',
    tag: 'Conversational analytics',
    summary:
      'Business users ask in plain language and get tables, charts and maps back, interactive and self-corrected by a multi-agent, multi-model harness across sales, Nielsen, household panel and BEACH data. Scaled to global users.',
    metrics: [
      { value: '< 1 min', label: 'to answer, was days' },
      { value: 'Global', label: 'user adoption' },
    ],
    stack: ['Azure', 'Multi-agent orchestration', 'Multi-hop queries', 'Text2SQL', 'RAG', 'Azure AI Search', 'React', 'FastAPI', 'AI governance', 'Power Automate'],
  },
  {
    id: 'tower',
    stat: { post: 'One view', label: 'for every bottler, plant and launch, with the next action recommended each morning.' },
    title: 'Supply Chain Control Tower',
    tag: 'Alerts, forecasts, recommendations',
    summary:
      'Bottler and plant performance, savings against target, and daily stock alerts across FBO, CBO and new launches. SKU forecasts plus a recommender on WAI, NAI and days cover, linked to consumer behaviour through the Insight Engine.',
    metrics: [
      { value: 'Daily', label: 'stock refresh' },
      { value: 'Alerts', label: 'to action' },
    ],
    stack: ['Azure ML', 'Cosmos DB', 'Key Vault', 'Entra ID', 'Anthropic models', 'Python', 'React'],
  },
  {
    id: 'analyst',
    stat: { to: 80, dec: 0, post: '%', label: 'of every financial report captured automatically. Months became hours.' },
    title: 'Autonomous Financial Analyst',
    tag: 'Document intelligence',
    summary:
      'XBRL, APIs and PDF statements extracted, mapped and calculated into the standard report with one click. Work that took analysts months now takes hours, spent on the last 20 percent.',
    metrics: [
      { value: '80%', label: 'automated accuracy' },
      { value: 'Months → hours', label: 'per report' },
    ],
    stack: ['Claude', 'GPT (OCR)', 'PyMuPDF', 'pdfplumber', 'Azure AD SSO', 'RBAC', 'Responsible AI', 'React', 'Node'],
  },
  {
    id: 'unified',
    stat: { post: 'End to end', label: 'owned from architecture to adoption: one flagship platform, including its move from AWS to GCP.' },
    title: 'Unified AI Platform',
    tag: 'Deloitte Australia flagship',
    summary:
      'Owned the platform end to end, from architecture to adoption, for individuals and their managers: calculations, controlled Q&A, scrum project builder and RAG pipelines. Moved from AWS to GCP with Docker, with token budgets and an admin feedback loop.',
    metrics: [
      { value: 'Owner', label: 'architecture to adoption' },
      { value: 'AWS → GCP', label: 'via Docker' },
    ],
    stack: ['AWS', 'IAM', 'Kendra', 'GCP Cloud Run', 'Vertex AI', 'OpenAI', 'Docker', 'Kubernetes', 'Hybrid RAG', 'Confluence', 'JIRA'],
  },
  {
    id: 'okr',
    stat: { post: 'Aligned', label: 'every individual objective traced up to the company goals and the business impact metrics.' },
    title: 'OKR System',
    tag: 'Objectives and key results',
    summary:
      'An end-to-end application that tracks objectives from individuals up to leaders, aligns them to business objectives and correlates them with business impact metrics. Role-based access, with Workday and Qualtrics data integrated. Everyone sees their own progress, their peers, and their contribution to company growth.',
    metrics: [
      { value: 'RBAC', label: 'role-based access' },
      { value: 'Workday', label: 'and Qualtrics data' },
    ],
    stack: ['RBAC', 'Workday', 'Qualtrics', 'Document uploads', 'In-built AI chat', 'Memory'],
  },
]
