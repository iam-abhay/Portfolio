// Authoritative Portfolio Datasets for Abhay Kharat matching exact Resume Specs

export const PROFILE_DATA = {
  name: "Abhay Kharat",
  headline: "Aspiring Software Engineer | Java Backend & Full-Stack Developer",
  subtext: "Hands-on experience in Java, Spring Boot, React.js, PostgreSQL, and REST APIs. Strong foundation in OOP, DSA, DBMS, and JWT Authentication with familiarity in Docker, Microservices, and Kafka.",
  about: `Aspiring Software Engineer with hands-on experience in Java, Spring Boot, React.js, PostgreSQL, REST APIs, and Full-Stack Development through academic projects and internship experience. 

Strong foundation in OOP, Data Structures & Algorithms, DBMS, Git, and JWT Authentication, with familiarity in Apache Kafka, Docker, Kubernetes, CI/CD concepts, and Microservices architecture. Driven to build scalable, high-performance software applications and web platforms.`,
  email: "abhaykharat.er@gmail.com",
  phone: "+91-8888537005",
  github: "https://github.com/iam-abhay",
  linkedin: "https://linkedin.com/in/abhay-kharat",
  location: "Pune, India | Open to Remote & Relocation",
  resumeUrl: "#"
};

export const INITIAL_PROJECTS = [
  {
    id: "agriease",
    title: "AgriEase – AI-Powered Smart Agriculture Platform",
    category: "Software Engineering",
    secondaryCategory: "AI / ML",
    short_description: "Full-stack web application connecting farmers and suppliers through equipment rental and marketplace services with JWT security and Spring Boot REST APIs.",
    description: "Developed a full-stack web application connecting farmers and suppliers through equipment rental and marketplace services. Implemented secure JWT authentication, role-based access control, and RESTful APIs using Spring Boot. Built responsive React.js interfaces, integrated PostgreSQL for efficient data management, and utilized Git for version control while following OOP principles and layered architecture.",
    technologies: ["Java", "Spring Boot", "React.js", "PostgreSQL", "JWT", "REST APIs", "Git"],
    github_url: "https://github.com/iam-abhay",
    live_url: "https://github.com/iam-abhay",
    image_url: "assets/images/project-ai-analytics.jpg",
    featured: true,
    published: true,
    metrics: "Implemented secure JWT auth, RBAC & PostgreSQL database optimization with layered OOP architecture."
  },
  {
    id: "moodflix",
    title: "MoodFlix – Mood-Based Movie Recommendation System",
    category: "Software Engineering",
    secondaryCategory: "Software Engineering",
    short_description: "JavaFX desktop application that recommends movies based on user mood with Java Collections Framework, PostgreSQL, HikariCP, and Firebase Firestore.",
    description: "Developed a JavaFX desktop application that recommends movies based on user mood. Applied OOP principles and the Java Collections Framework to build a modular application, integrated REST APIs, OMDb API, PostgreSQL connection pooling with HikariCP, and Firebase Firestore for cloud-based data storage, and designed an intuitive user interface to enhance user experience.",
    technologies: ["Java", "JavaFX", "PostgreSQL", "OMDb API", "HikariCP", "Firebase Firestore", "REST APIs", "OOP"],
    github_url: "https://github.com/iam-abhay",
    live_url: "https://github.com/iam-abhay",
    image_url: "assets/images/project-dev-platform.jpg",
    featured: true,
    published: true,
    metrics: "Applied Java Collections Framework, HikariCP & Firebase Firestore for modular cloud-backed movie discovery."
  },
  {
    id: "apnaghar",
    title: "ApnaGhar – Real Estate Listing Website",
    category: "Software Engineering",
    secondaryCategory: "Software Engineering",
    short_description: "Responsive real estate listing platform using React.js with property browsing, filtering features, and component-based architecture.",
    description: "Developed a responsive real estate listing platform using React.js with reusable UI components and responsive layouts. Implemented property browsing and filtering features, followed component-based architecture and clean coding practices, and used Git for version control to improve maintainability and user experience.",
    technologies: ["React.js", "JavaScript", "HTML5", "CSS3", "Git"],
    github_url: "https://github.com/iam-abhay",
    live_url: "https://github.com/iam-abhay",
    image_url: "assets/images/project-cyber-shop.jpg",
    featured: true,
    published: true,
    metrics: "Component-based React.js architecture with property search, multi-parameter filtering & responsive UI."
  }
];

export const SKILL_CATEGORIES = [
  {
    id: "languages",
    name: "Programming Languages",
    skills: ["Java", "JavaScript", "SQL", "C"]
  },
  {
    id: "backend",
    name: "Backend Development",
    skills: ["Spring Boot", "REST APIs", "JDBC", "JWT Authentication", "Node.js", "Microservices", "Apache Kafka", "Java Collections Framework"]
  },
  {
    id: "frontend",
    name: "Frontend Development",
    skills: ["React.js", "HTML5", "CSS3", "Responsive Web Design"]
  },
  {
    id: "database",
    name: "Database",
    skills: ["SQL", "PostgreSQL", "MySQL", "Firebase Firestore"]
  },
  {
    id: "cloud-devops",
    name: "Cloud & DevOps",
    skills: ["Docker", "Kubernetes", "CI/CD Concepts"]
  },
  {
    id: "tools",
    name: "Tools & IDES",
    skills: ["Git", "GitHub", "Maven", "Postman", "VS Code", "IntelliJ IDEA"]
  },
  {
    id: "ai-dev",
    name: "AI-Assisted Development",
    skills: ["Prompt Engineering", "AI-Assisted Coding", "GitHub Copilot", "ChatGPT", "AI-Powered Debugging"]
  },
  {
    id: "core-concepts",
    name: "Core CS Concepts",
    skills: ["Object Oriented Programming (OOP)", "Data Structures & Algorithms (DSA)", "DBMS", "Operating Systems", "Computer Networks", "Software Engineering", "System Design"]
  }
];

export const INITIAL_EXPERIENCE = [
  {
    id: "exp-mass-it",
    company: "Mass IT Solutions, Pune",
    position: "Web Developer Intern",
    location: "Pune, India",
    start_date: "Jan 2025",
    end_date: "Feb 2025",
    current: false,
    description: "Developed responsive web applications using HTML, CSS, JavaScript, and React.js, focusing on clean UI design and cross-device compatibility. Built reusable React components and collaborated with mentors to implement frontend features following software development best practices. Performed debugging, testing, and UI optimization to improve application usability, responsiveness, and overall user experience. Developed a Real Estate Listing Website featuring property browsing, responsive layouts, and interactive user interfaces using React.js.",
    technologies: ["React.js", "JavaScript", "HTML5", "CSS3", "Web Development"]
  }
];

export const INITIAL_EDUCATION = [
  {
    id: "skncoe",
    institution: "Shrimati Kashibai Navale College of Engineering, Pune",
    degree: "Bachelor of Engineering (B.E.)",
    branch: "Electronics and Telecommunication Engineering",
    start_date: "2022",
    end_date: "2026",
    grade: "CGPA: 8.16/10",
    description: "Academic coursework in Data Structures & Algorithms, Object Oriented Programming, DBMS, Computer Networks, Operating Systems, and Software Engineering."
  },
  {
    id: "hsc",
    institution: "Swami Samarth Jr. Arts & Science College",
    degree: "Higher Secondary Certificate (HSC)",
    branch: "Science",
    start_date: "2018",
    end_date: "2020",
    grade: "92.92%",
    description: "Completed Higher Secondary Certificate coursework with 92.92% distinction."
  },
  {
    id: "ssc",
    institution: "Saraswati Bhuvan High School",
    degree: "Secondary School Certificate (SSC)",
    branch: "General High School",
    start_date: "2017",
    end_date: "2018",
    grade: "94.60%",
    description: "Completed Secondary School Certificate with 94.60% distinction."
  }
];

export const INITIAL_CERTIFICATIONS = [
  {
    id: "cert-core2web",
    name: "Java Programming",
    issuer: "Core2Web",
    date: "Certified",
    credential_url: "#",
    description: "In-depth practical training in Java Core concepts, OOP principles, Exception Handling, Collections Framework, and Multithreading."
  },
  {
    id: "cert-moodflix",
    name: "Super-X Java Project (MoodFlix)",
    issuer: "Java Development Track",
    date: "Certified",
    credential_url: "#",
    description: "Hands-on project certification for architecting and building the MoodFlix JavaFX movie recommendation application."
  },
  {
    id: "cert-ibm-ds",
    name: "IBM Getting Started with Enterprise Data Science",
    issuer: "IBM",
    date: "Certified",
    credential_url: "#",
    description: "Foundational training in Enterprise Data Science methodologies, data analysis pipelines, and analytics concepts."
  },
  {
    id: "cert-ibm-cloud",
    name: "IBM Journey to Cloud: Envisioning Your Solution",
    issuer: "IBM",
    date: "Certified",
    credential_url: "#",
    description: "Enterprise Cloud architecture concepts, microservices deployment, and cloud solution design."
  }
];
