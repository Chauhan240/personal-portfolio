export interface Client {
  name: string
  slug: string
  context: string
}

// Logos that ship as real files in frontend/public/logos/<slug>.svg. Every other client renders as
// a typographic wordmark until its official SVG is dropped in and its slug is added here.
export const logoFiles = new Set(['coca-cola', 'amazon', 'barclays', 'dell', 'unilever', 'aws', 'azure', 'gcp', 'databricks', 'snowflake'])

export const clients: Client[] = [
  { name: 'Coca-Cola', slug: 'coca-cola', context: 'Enterprise insights and agentic AI' },
  { name: 'Amazon', slug: 'amazon', context: 'RLHF for AI code generation' },
  { name: 'Barclays', slug: 'barclays', context: 'Regulatory reporting and financial KPI models' },
  { name: 'NTT Data', slug: 'ntt-data', context: 'Data and analytics engagements' },
  { name: 'Natixis', slug: 'natixis', context: 'Data and analytics engagements' },
  { name: 'Indorama', slug: 'indorama', context: 'Petrochemicals data engineering and ML' },
  { name: 'Capgemini', slug: 'capgemini', context: 'Financial ML models and regulatory reporting' },
  { name: 'Unilever', slug: 'unilever', context: 'Analytics and insights delivery' },
  { name: 'Takeda', slug: 'takeda', context: 'Data and analytics engagements' },
  { name: 'John Lewis', slug: 'john-lewis', context: 'Data and analytics engagements' },
  { name: 'Dell', slug: 'dell', context: 'Enterprise IT and infrastructure support' },
  { name: 'Honeywell', slug: 'honeywell', context: 'Global technical support operations' },
  { name: 'Deloitte', slug: 'deloitte', context: 'Data and AI engineering' },
]
