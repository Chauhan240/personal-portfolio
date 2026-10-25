// Visual-first content for the home page. Long-form copy lives in the other data files;
// everything here is deliberately terse so the visuals carry the story.

export interface JourneyStage {
  id: string
  year: string
  company: string
  role: string
  phrase: string
  logos: { name: string; slug: string }[]
  metric: { value: string; label: string }
}

export const journey: JourneyStage[] = [
  {
    id: 'dell',
    year: '2019',
    company: 'Dell',
    role: 'Technical Support Engineer',
    phrase: 'Where it started: keeping 6,000 people online.',
    logos: [
      { name: 'Dell', slug: 'dell' },
      { name: 'Honeywell', slug: 'honeywell' },
    ],
    metric: { value: '6,000', label: 'global users supported' },
  },
  {
    id: 'capgemini',
    year: '2020',
    company: 'Capgemini',
    role: 'Business Analyst, Barclays',
    phrase: 'Models and regulatory reports for an investment bank.',
    logos: [{ name: 'Capgemini', slug: 'capgemini' }],
    metric: { value: 'HKMA', label: 'regulatory reporting, built end to end' },
  },
  {
    id: 'deloitte',
    year: '2022',
    company: 'Deloitte',
    role: 'Data and AI Engineer',
    phrase: 'GenAI platforms and RLHF for some of the biggest names in tech.',
    logos: [
      { name: 'Deloitte', slug: 'deloitte' },
      { name: 'Amazon', slug: 'amazon' },
      { name: 'Indorama', slug: 'indorama' },
    ],
    metric: { value: '€20K', label: 'saved every month on cloud spend' },
  },
  {
    id: 'coca-cola',
    year: '2024',
    company: 'The Coca-Cola Company',
    role: 'Consultant, Digital Insights and Analytics',
    phrase: 'Now: one data foundation for the whole group.',
    logos: [{ name: 'Coca-Cola', slug: 'coca-cola' }],
    metric: { value: '2B', label: 'rows processed every day' },
  },
]

export interface Stat {
  value: number
  prefix?: string
  suffix?: string
  label: string
  /** Fraction (0-1) of the ring to fill. Purely decorative. */
  ring: number
}

export const stats: Stat[] = [
  { value: 2, suffix: 'B', label: 'rows a day, modelled', ring: 0.92 },
  { value: 53, label: 'plants across 9 bottlers, one view', ring: 0.7 },
  { value: 20, prefix: '€', suffix: 'K', label: 'saved every month', ring: 0.55 },
  { value: 7, suffix: '+', label: 'years across 4 industries', ring: 0.8 },
]

export interface AboutCard {
  title: string
  value: string
  line: string
  icon: 'data' | 'agent' | 'cloud' | 'report'
  color: string
}

export const aboutCards: AboutCard[] = [
  { title: 'Data platforms', value: '2B', line: 'rows modelled every day', icon: 'data', color: '#5B8CFF' },
  { title: 'Agentic AI', value: 'RAG', line: 'agents that reach production', icon: 'agent', color: '#8E7CFF' },
  { title: 'Cloud and MLOps', value: '11', line: 'cloud certifications', icon: 'cloud', color: '#43C9A8' },
  { title: 'Regulatory reporting', value: 'HKMA', line: 'built end to end', icon: 'report', color: '#FF7F66' },
]

export interface CertGroup {
  slug: string
  provider: string
  names: string[]
}

export const certGroups: CertGroup[] = [
  {
    slug: 'aws',
    provider: 'AWS',
    names: ['Machine Learning, Specialty', 'Data Analytics, Specialty', 'Solutions Architect, Associate', 'Cloud Developer, Associate'],
  },
  {
    slug: 'azure',
    provider: 'Azure',
    names: ['Data Scientist Associate', 'Data Engineer Associate', 'PL-300 Power BI Analyst', 'Data Fundamentals'],
  },
  { slug: 'gcp', provider: 'Google Cloud', names: ['Cloud Digital Leader'] },
  { slug: 'databricks', provider: 'Databricks', names: ['Lake Formation'] },
  { slug: 'snowflake', provider: 'Snowflake', names: ['SnowPro Core'] },
]
