export interface EducationItem {
  id: number;
  institution: string;
  period: string;
  degree?: string;
  achievements: string[];
  href?: string;
}

export const education: EducationItem[] = [
  {
    id: 7,
    institution: "Queen's University Belfast",
    period: '2021 — 2025',
    degree: 'BSc Computer Science',
    achievements: ['First Class Bachelors', 'Grade average 80%'],
    href: 'https://www.qub.ac.uk/',
  },
  {
    id: 8,
    institution: "St Patrick's Grammar School",
    period: '2013 — 2020',
    achievements: ['GCSE Computer Science', 'A-Level Digital Technology'],
  },
];
