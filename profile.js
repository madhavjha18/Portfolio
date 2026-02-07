export const PROFILE = {
  name: "Madhav Jha",
  links: {
    email: "madhavjha18557@gmail.com",
    linkedin: "https://www.linkedin.com/in/madhav-jha-74079531b/",
    github: "https://github.com/madhavjha18",
    leetcode: "https://leetcode.com/u/Madhav_jha18/",
    codeforces: "https://codeforces.com/profile/madhavjha18",
    gfg: "https://www.geeksforgeeks.org/profile/madhavjh1vsl?tab=activity",
  },

  education: {
    school: "Galgotias College of Engineering & Technology, Greater Noida, India",
    degree: "Bachelor of Technology (B.Tech) in Computer Science & Engineering",
    years: "2023 – 2027",
  },

  heroChips: [
    "<strong>500+</strong> problems (DSA)",
    "<strong>MERN</strong> task system",
    "<strong>Frontend</strong> interactions",
  ],

  focus: [
    "Full‑stack web development (React, Node/Express, REST APIs).",
    "Data Structures & Algorithms practice across competitive platforms.",
    "Shipping small apps with clean UX and reliable edge‑case handling.",
  ],

  likesBuilding: [
    "Dashboards with charts, activity logs, and deadline tracking.",
    "Apps that feel responsive: keyboard shortcuts, smooth transitions, good empty states.",
    "Projects that teach fundamentals: game logic, storage, validation, and state.",
  ],

  experience: [
    {
      title: "Software Development and DSA Practice",
      years: "2023 – Present",
      tagline: "Hands-on projects + consistent problem solving",
      bullets: [
        "Designed and developed small applications in Python and JavaScript to strengthen fundamentals.",
        "Implemented game logic, input validation, and state handling in CLI-based Python games (Blackjack, Rock Paper Scissors).",
        "Built interactive HTML/CSS/JS apps focused on DOM manipulation and event handling.",
        "Practiced debugging, testing edge cases, and improving user interaction flows.",
        "Improved code quality through clean structure and incremental feature iteration.",
        "Solved 500+ DSA problems across competitive coding platforms.",
      ],
    },
  ],

  projects: [
    {
      id: "blackjack",
      name: "Blackjack Game (CLI)",
      tag: "Python · CLI",
      summary: "A command-line Blackjack game following standard rules, designed for readable and reusable logic.",
      tech: ["Python", "CLI", "Game Logic", "Functions"],
      bullets: [
        "Implemented card shuffling, score calculation, and win/lose logic.",
        "Structured the game using functions for clarity and reuse.",
        "Handled common edge cases like busts and blackjack checks.",
      ],
    },
    {
      id: "expense",
      name: "Expense Tracker",
      tag: "HTML · CSS · JavaScript",
      summary: "A browser-based expense tracker with persistent storage and dynamic balance updates.",
      tech: ["HTML", "CSS", "JavaScript", "DOM", "LocalStorage"],
      bullets: [
        "Built a clean UI that updates balances dynamically via DOM manipulation.",
        "Persisted entries with browser storage for reload-safe state.",
        "Designed interactions around fast entry and clear feedback.",
      ],
    },
    {
      id: "mern-tasks",
      name: "MERN Task Management System",
      tag: "React · Node · MongoDB",
      summary:
        "A full-stack task manager featuring role-based authentication, dashboards, and deadline tracking.",
      tech: ["React", "Node.js", "Express", "MongoDB", "REST APIs", "Tailwind"],
      bullets: [
        "Built role-based authentication for different user capabilities.",
        "Created a dashboard with charts, activity logs, and deadline tracking.",
        "Used REST APIs and MongoDB Atlas for cloud data storage.",
      ],
    },
  ],

  skills: [
    {
      label: "Languages",
      hint: "core",
      items: ["C++", "JavaScript (ES6+)", "Python", "HTML5", "CSS3"],
    },
    {
      label: "Frameworks & Libraries",
      hint: "web",
      items: ["React.js", "Node.js", "Express.js", "Tailwind CSS"],
    },
    {
      label: "Databases",
      hint: "data",
      items: ["MongoDB", "MySQL"],
    },
    {
      label: "Tools & Platforms",
      hint: "workflow",
      items: ["Git", "GitHub", "VS Code", "Netlify", "LeetCode", "Codeforces", "GeeksforGeeks"],
    },
    {
      label: "Web Development",
      hint: "practice",
      items: ["REST APIs", "Responsive Design", "Authentication", "Deployment"],
    },
  ],

  achievements: [
    "Solved 350+ DSA problems on LeetCode.",
    "Solved 50+ DSA problems on Codeforces.",
    "Solved 100+ DSA problems on GeeksforGeeks.",
    "Built full‑stack applications with real‑world deployment experience.",
  ],
};
