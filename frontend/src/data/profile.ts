export const profile = {
  name: 'Manish Chauhan',
  role: 'Data & AI Platform Lead',
  tagline: 'Platforms that turn knowledge into the next move',
  location: 'India',
  // Paste your YouTube video ID here (the part after v= in the URL) to show it in the About section.
  introVideoId: '',
  email: 'manishchauhan.work95@gmail.com',
  // TODO: replace with your real LinkedIn profile URL.
  linkedin: '',
  summary:
    "I build the enterprise data platforms and AI systems that turn weeks of manual reporting into minutes-to-decision analytics — currently at The Coca-Cola Company, previously with Deloitte, Capgemini and Dell. My work spans master data modelling at multi-billion-row scale, agentic AI and RAG systems that survive contact with production, and the evaluation harnesses that make them trustworthy enough to hand to Finance, Supply Chain and Strategy leadership.",
  longBio: [
    "AI engineer with 7+ years across data, cloud and AI: 6 years applying ML in production and 3+ years designing and shipping GenAI and agentic systems end to end.",
    "At The Coca-Cola Company I architected a multi-agent orchestration platform over an enterprise ontology, built MCP servers that unify cross-domain data into one self-service agentic workspace, and took multiple MVPs to production over ~2 billion records a day, all under guardrails, human review and Responsible AI controls.",
  ],
}

export const socials = [
  { label: 'Email', href: `mailto:${profile.email}` },
  ...(profile.linkedin ? [{ label: 'LinkedIn', href: profile.linkedin }] : []),
]
