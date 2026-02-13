export interface ExperienceItem {
  id: number;
  company: string;
  role: string;
  period: string;
  description: string;
  details: string;
  href: string;
  logo?: string;
  skills: string[];
}

export const experiences: ExperienceItem[] = [
  {
    id: 0,
    company: 'Magnite',
    role: 'Software Engineer — Placement Year',
    period: '2023 — 2024',
    description: '1 year placement in the Magnite Belfast office, working across the full stack on ad-tech infrastructure.',
    details:
      'Developed a deep technical understanding of APIs, coding theory, and programming concepts including OOP, component-based programming, and asynchronous programming. Proficient in both front-end and back-end development with experience creating, developing, and implementing login flows across multiple projects. Solid understanding of SQL and database architecture. Over 6 months of hands-on experience with AWS and Auth0 (SaaS), entrusted with admin roles and clearance. Adept at working with macOS, Bash Terminal, NPM, and professional Git workflows.',
    href: 'https://www.magnite.com/',
    logo: '/images/magnite.jpg',
    skills: ['React', 'Node.js', 'AWS', 'Auth0', 'SQL', 'Git', 'REST APIs'],
  },
];
