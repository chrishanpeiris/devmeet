// ─── App-wide constants ───────────────────────────────────────────────────────

export const TECH_TAGS = [
  'React', 'React Native', 'TypeScript', 'JavaScript', 'Node.js',
  'Python', 'Go', 'Rust', 'Swift', 'Kotlin',
  'GraphQL', 'REST', 'PostgreSQL', 'MongoDB', 'Redis',
  'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes',
  'Next.js', 'Vue', 'Angular', 'Flutter', 'iOS', 'Android',
  'Machine Learning', 'DevOps', 'Blockchain', 'Web3',
];

export const INTEREST_TAGS = [
  'Open Source', 'Startups', 'FinTech', 'HealthTech', 'EdTech',
  'Gaming', 'AR/VR', 'AI', 'Security', 'Design Systems',
  'Developer Tools', 'SaaS', 'Mobile', 'Web', 'Embedded',
];

export const ROLE_LABELS: Record<string, string> = {
  junior:  'Junior Engineer',
  mid:     'Mid-level Engineer',
  senior:  'Senior Engineer',
  lead:    'Tech Lead',
  founder: 'Founder / CTO',
};

export const LOOKING_FOR_LABELS: Record<string, string> = {
  job:           'Open to new roles',
  collaboration: 'Looking to collaborate',
  mentorship:    'Looking for a mentor',
  networking:    'Just networking',
  hiring:        'Hiring talent',
};

export const LOOKING_FOR_ICONS: Record<string, string> = {
  job:           '💼',
  collaboration: '🤝',
  mentorship:    '🎓',
  networking:    '🌐',
  hiring:        '🔍',
};
