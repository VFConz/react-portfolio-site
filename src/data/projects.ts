export interface ProjectItem {
  id: number;
  title: string;
  subtitle: string;
  techStack: string[];
  features: string[];
  description: string;
  details: string;
  image: string;
  href?: string;
  accentColor: string;
}

export const projects: ProjectItem[] = [
  {
    id: 1,
    title: 'This Website',
    subtitle: 'React & Node.JS',
    techStack: ['React', 'Node.js', 'Next.js', 'Tailwind CSS', 'TypeScript'],
    features: [
      'My First Full Website Built with the React Framework',
      'Uses React-Bootstrap',
      'Data-Driven Website',
    ],
    description: 'My portfolio website built with React',
    details:
      "I've learnt a lot from this Project about Node.js, JS itself and most importantly how React fits into the web development stack, improving the scalability and consistency of websites! I've also used the react-bootstrap module for more fluid development.",
    image: '/images/react.png',
    accentColor: '#61DAFB',
  },
  {
    id: 2,
    title: 'Govanopoly',
    subtitle: 'Java Game',
    techStack: ['Java', 'OOP', 'Game Design'],
    features: [
      'Sustainability-Themed Monopoly Game',
      'Team-Based Portfolio Work',
      'Sole Developer',
    ],
    description: 'Sustainability Focused Monopoly Game',
    details:
      'This team-based project took 4 weeks total development work from demo phase to release. I was the Lead Developer of the game and Team Lead for the project. The game focuses on tackling the serious sustainability issues tackling the Scottish City of Govan and took months of Research and Documentation before our development phase.',
    image: '/images/govanopoly.png',
    href: 'https://github.com/VFConz/Monopoly_Style_Game_Java',
    accentColor: '#F89820',
  },
  {
    id: 3,
    title: 'Largest-Clock-Angle',
    subtitle: 'C++ Program',
    techStack: ['C++', 'Algorithms', 'Mathematics'],
    features: [
      'Converts Time: 24hr to 12hr',
      'Finds Angle Difference',
      'Lightweight C++ Program',
      'Coding Challenge',
    ],
    description: 'C++ Clock Conversion and Angle Difference Program',
    details:
      'This Simple C++ Program converts a 24 hour formatted time into a 12 hour time and then calculates the largest angle between the minute and hour hand. Personally I thought this challenge was quite fun and engaging as I believe it was designed to test a candidates ability to breakdown physical objects into their respective properties and functions and manipulate these variables to produce the required output for the challenge. For testing I used try catch statements for any invalid data while it instantiates 100 instances of a 24 time, its conversion and its largest angle.',
    image: '/images/clockproject.png',
    href: 'https://github.com/VFConz/Largest-Clock-Angle',
    accentColor: '#DC3545',
  },
  {
    id: 4,
    title: 'Escape the Titanic',
    subtitle: 'HTML, CSS, JS',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    features: [
      'Text-Based Escape Game',
      'Fully-featured',
      'Party & Inventory System',
      'JS Game Framework',
    ],
    description: 'Titanic Escape Game',
    details:
      'Team-Based Coursework where our goal was to develop a text-adventure game. The project was made in pure HTML, CSS and JS and is a fully featured escape game. I am the developer of the Front-End and Additional Components such as Accessibility Features, Animated Background, Game Over Screens, and the ScoreBoard and Points System for replayability. This Project netted us 80%.',
    image: '/images/window.jpg',
    href: 'https://github.com/VFConz/TitanicEscapeGame',
    accentColor: '#6C757D',
  },
  {
    id: 5,
    title: 'School Web-Dev Portfolio',
    subtitle: 'HTML, CSS, JS',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    features: [
      'Basic HTML CSS Projects',
      'Fundamentals of HTML',
      'Beginner CSS Styling',
      'JS Functionality',
    ],
    description: 'Web-Development Portfolio from First Year',
    details:
      'This collection of Projects are too small to be put on this website individually, but are good proofs of my grades throughout my Web-Development Module at Queens. It contains HTML, CSS and JS implementations adhering to constraints placed by the Module Coursework Requirements.',
    image: '/images/htmlcssjs.png',
    href: 'https://github.com/VFConz/WebDesignPortfolio-Year1',
    accentColor: '#6C757D',
  },
  {
    id: 6,
    title: 'Minesweeper CLI Game',
    subtitle: 'Kotlin Game',
    techStack: ['Kotlin', 'CLI', 'Game Design'],
    features: [
      'MineSweeper Game in Kotlin',
      'Self-Learning Project',
      'Deep Knowledge of Map Function',
      'Favourite Project To Date',
    ],
    description: 'Minesweeper CLI Game',
    details:
      "From this Project I learnt Kotlin on a practical level. It is honestly one of my favourite languages to use as it is such an improvement to Java as it naturally improves productivity due to the simplicity of manipulating data using maps and lists.",
    image: '/images/Kotlin_Icon.png',
    href: 'https://github.com/VFConz/WIP_MineSweeperGame_Kotlin',
    accentColor: '#F89820',
  },
];
