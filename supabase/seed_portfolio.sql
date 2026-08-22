-- Supabase Portfolio Seed Script for Abhay Kharat
-- Idempotent Transaction Seed File based on exact Supabase PostgreSQL Schema

BEGIN;

-- 1. CLEANUP PREVIOUS PORTFOLIO CONTENT (Preserving admin_users table)
DELETE FROM public.social_links;
DELETE FROM public.certifications;
DELETE FROM public.education;
DELETE FROM public.experience;
DELETE FROM public.skills;
DELETE FROM public.projects;
DELETE FROM public.profiles;

-- 2. SEED PROFILES TABLE
INSERT INTO public.profiles (
  id,
  name,
  headline,
  short_bio,
  about,
  email,
  phone,
  github_url,
  linkedin_url,
  resume_url,
  profile_image_url
) VALUES (
  gen_random_uuid(),
  'Abhay Kharat',
  'Aspiring Software Engineer | Java Backend & Full-Stack Developer',
  'Hands-on experience in Java, Spring Boot, React.js, PostgreSQL, and REST APIs. Strong foundation in OOP, DSA, DBMS, and JWT Authentication with familiarity in Docker, Microservices, and Kafka.',
  'Aspiring Software Engineer with hands-on experience in Java, Spring Boot, React.js, PostgreSQL, REST APIs, and Full-Stack Development through academic projects and internship experience. 

Strong foundation in OOP, Data Structures & Algorithms, DBMS, Git, and JWT Authentication, with familiarity in Apache Kafka, Docker, Kubernetes, CI/CD concepts, and Microservices architecture. Driven to build scalable, high-performance software applications and web platforms.',
  'abhaykharat.er@gmail.com',
  '+91-8888537005',
  'https://github.com/iam-abhay',
  'https://linkedin.com/in/abhay-kharat',
  '#',
  NULL
);

-- 3. SEED PROJECTS TABLE
INSERT INTO public.projects (
  id,
  title,
  slug,
  category,
  short_description,
  description,
  technologies,
  github_url,
  live_url,
  image_url,
  featured,
  published,
  display_order
) VALUES 
(
  gen_random_uuid(),
  'AgriEase – AI-Powered Smart Agriculture Platform',
  'agriease',
  'Software Engineering',
  'Full-stack web application connecting farmers and suppliers through equipment rental and marketplace services with JWT security and Spring Boot REST APIs.',
  'Developed a full-stack web application connecting farmers and suppliers through equipment rental and marketplace services. Implemented secure JWT authentication, role-based access control, and RESTful APIs using Spring Boot. Built responsive React.js interfaces, integrated PostgreSQL for efficient data management, and utilized Git for version control while following OOP principles and layered architecture.',
  ARRAY['Java', 'Spring Boot', 'React.js', 'PostgreSQL', 'JWT', 'REST APIs', 'Git'],
  'https://github.com/iam-abhay',
  'https://github.com/iam-abhay',
  'assets/images/project-ai-analytics.jpg',
  true,
  true,
  1
),
(
  gen_random_uuid(),
  'MoodFlix – Mood-Based Movie Recommendation System',
  'moodflix',
  'Software Engineering',
  'JavaFX desktop application that recommends movies based on user mood with Java Collections Framework, PostgreSQL, HikariCP, and Firebase Firestore.',
  'Developed a JavaFX desktop application that recommends movies based on user mood. Applied OOP principles and the Java Collections Framework to build a modular application, integrated REST APIs, OMDb API, PostgreSQL connection pooling with HikariCP, and Firebase Firestore for cloud-based data storage, and designed an intuitive user interface to enhance user experience.',
  ARRAY['Java', 'JavaFX', 'PostgreSQL', 'OMDb API', 'HikariCP', 'Firebase Firestore', 'REST APIs', 'OOP'],
  'https://github.com/iam-abhay',
  'https://github.com/iam-abhay',
  'assets/images/project-dev-platform.jpg',
  true,
  true,
  2
),
(
  gen_random_uuid(),
  'ApnaGhar – Real Estate Listing Website',
  'apnaghar',
  'Software Engineering',
  'Responsive real estate listing platform using React.js with property browsing, filtering features, and component-based architecture.',
  'Developed a responsive real estate listing platform using React.js with reusable UI components and responsive layouts. Implemented property browsing and filtering features, followed component-based architecture and clean coding practices, and used Git for version control to improve maintainability and user experience.',
  ARRAY['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Git'],
  'https://github.com/iam-abhay',
  'https://github.com/iam-abhay',
  'assets/images/project-cyber-shop.jpg',
  true,
  true,
  3
);

-- 4. SEED SKILLS TABLE (Individual skill rows)
INSERT INTO public.skills (id, name, category, display_order, visible) VALUES
-- Programming Languages
(gen_random_uuid(), 'Java', 'Programming Languages', 1, true),
(gen_random_uuid(), 'JavaScript', 'Programming Languages', 2, true),
(gen_random_uuid(), 'SQL', 'Programming Languages', 3, true),
(gen_random_uuid(), 'C', 'Programming Languages', 4, true),

-- Backend Development
(gen_random_uuid(), 'Spring Boot', 'Backend Development', 5, true),
(gen_random_uuid(), 'REST APIs', 'Backend Development', 6, true),
(gen_random_uuid(), 'JDBC', 'Backend Development', 7, true),
(gen_random_uuid(), 'JWT Authentication', 'Backend Development', 8, true),
(gen_random_uuid(), 'Node.js', 'Backend Development', 9, true),
(gen_random_uuid(), 'Microservices', 'Backend Development', 10, true),
(gen_random_uuid(), 'Apache Kafka', 'Backend Development', 11, true),
(gen_random_uuid(), 'Java Collections Framework', 'Backend Development', 12, true),

-- Frontend Development
(gen_random_uuid(), 'React.js', 'Frontend Development', 13, true),
(gen_random_uuid(), 'HTML5', 'Frontend Development', 14, true),
(gen_random_uuid(), 'CSS3', 'Frontend Development', 15, true),
(gen_random_uuid(), 'Responsive Web Design', 'Frontend Development', 16, true),

-- Database
(gen_random_uuid(), 'SQL', 'Database', 17, true),
(gen_random_uuid(), 'PostgreSQL', 'Database', 18, true),
(gen_random_uuid(), 'MySQL', 'Database', 19, true),
(gen_random_uuid(), 'Firebase Firestore', 'Database', 20, true),

-- Cloud & DevOps
(gen_random_uuid(), 'Docker', 'Cloud & DevOps', 21, true),
(gen_random_uuid(), 'Kubernetes', 'Cloud & DevOps', 22, true),
(gen_random_uuid(), 'CI/CD Concepts', 'Cloud & DevOps', 23, true),

-- Tools & IDEs
(gen_random_uuid(), 'Git', 'Tools & IDEs', 24, true),
(gen_random_uuid(), 'GitHub', 'Tools & IDEs', 25, true),
(gen_random_uuid(), 'Maven', 'Tools & IDEs', 26, true),
(gen_random_uuid(), 'Postman', 'Tools & IDEs', 27, true),
(gen_random_uuid(), 'VS Code', 'Tools & IDEs', 28, true),
(gen_random_uuid(), 'IntelliJ IDEA', 'Tools & IDEs', 29, true),

-- AI-Assisted Development
(gen_random_uuid(), 'Prompt Engineering', 'AI-Assisted Development', 30, true),
(gen_random_uuid(), 'AI-Assisted Coding', 'AI-Assisted Development', 31, true),
(gen_random_uuid(), 'GitHub Copilot', 'AI-Assisted Development', 32, true),
(gen_random_uuid(), 'ChatGPT', 'AI-Assisted Development', 33, true),
(gen_random_uuid(), 'AI-Powered Debugging', 'AI-Assisted Development', 34, true),

-- Core CS Concepts
(gen_random_uuid(), 'Object Oriented Programming (OOP)', 'Core CS Concepts', 35, true),
(gen_random_uuid(), 'Data Structures & Algorithms (DSA)', 'Core CS Concepts', 36, true),
(gen_random_uuid(), 'DBMS', 'Core CS Concepts', 37, true),
(gen_random_uuid(), 'Operating Systems', 'Core CS Concepts', 38, true),
(gen_random_uuid(), 'Computer Networks', 'Core CS Concepts', 39, true),
(gen_random_uuid(), 'Software Engineering', 'Core CS Concepts', 40, true),
(gen_random_uuid(), 'System Design', 'Core CS Concepts', 41, true);

-- 5. SEED EXPERIENCE TABLE
INSERT INTO public.experience (
  id,
  company,
  position,
  location,
  start_date,
  end_date,
  current,
  description,
  technologies,
  display_order
) VALUES (
  gen_random_uuid(),
  'Mass IT Solutions, Pune',
  'Web Developer Intern',
  'Pune, India',
  '2025-01-01'::date,
  '2025-02-01'::date,
  false,
  'Developed responsive web applications using HTML, CSS, JavaScript, and React.js, focusing on clean UI design and cross-device compatibility. Built reusable React components and collaborated with mentors to implement frontend features following software development best practices. Performed debugging, testing, and UI optimization to improve application usability, responsiveness, and overall user experience. Developed a Real Estate Listing Website featuring property browsing, responsive layouts, and interactive user interfaces using React.js.',
  ARRAY['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Web Development'],
  1
);

-- 6. SEED EDUCATION TABLE
INSERT INTO public.education (
  id,
  institution,
  degree,
  branch,
  start_date,
  end_date,
  description,
  display_order
) VALUES 
(
  gen_random_uuid(),
  'Shrimati Kashibai Navale College of Engineering, Pune',
  'Bachelor of Engineering (B.E.)',
  'Electronics and Telecommunication Engineering',
  '2022-01-01'::date,
  '2026-06-01'::date,
  'Academic coursework in Data Structures & Algorithms, Object Oriented Programming, DBMS, Computer Networks, Operating Systems, and Software Engineering. Grade: CGPA: 8.16/10',
  1
),
(
  gen_random_uuid(),
  'Swami Samarth Jr. Arts & Science College',
  'Higher Secondary Certificate (HSC)',
  'Science',
  '2018-06-01'::date,
  '2020-05-01'::date,
  'Completed Higher Secondary Certificate coursework with 92.92% distinction.',
  2
),
(
  gen_random_uuid(),
  'Saraswati Bhuvan High School',
  'Secondary School Certificate (SSC)',
  'General High School',
  '2017-06-01'::date,
  '2018-05-01'::date,
  'Completed Secondary School Certificate with 94.60% distinction.',
  3
);

-- 7. SEED CERTIFICATIONS TABLE
INSERT INTO public.certifications (
  id,
  name,
  issuer,
  issue_date,
  credential_url,
  image_url,
  description,
  display_order
) VALUES 
(
  gen_random_uuid(),
  'Java Programming',
  'Core2Web',
  '2025-01-01'::date,
  '#',
  NULL,
  'In-depth practical training in Java Core concepts, OOP principles, Exception Handling, Collections Framework, and Multithreading.',
  1
),
(
  gen_random_uuid(),
  'Super-X Java Project (MoodFlix)',
  'Java Development Track',
  '2025-01-01'::date,
  '#',
  NULL,
  'Hands-on project certification for architecting and building the MoodFlix JavaFX movie recommendation application.',
  2
),
(
  gen_random_uuid(),
  'IBM Getting Started with Enterprise Data Science',
  'IBM',
  '2025-01-01'::date,
  '#',
  NULL,
  'Foundational training in Enterprise Data Science methodologies, data analysis pipelines, and analytics concepts.',
  3
),
(
  gen_random_uuid(),
  'IBM Journey to Cloud: Envisioning Your Solution',
  'IBM',
  '2025-01-01'::date,
  '#',
  NULL,
  'Enterprise Cloud architecture concepts, microservices deployment, and cloud solution design.',
  4
);

-- 8. SEED SOCIAL LINKS TABLE
INSERT INTO public.social_links (
  id,
  platform,
  url,
  display_order,
  visible
) VALUES 
(
  gen_random_uuid(),
  'GitHub',
  'https://github.com/iam-abhay',
  1,
  true
),
(
  gen_random_uuid(),
  'LinkedIn',
  'https://linkedin.com/in/abhay-kharat',
  2,
  true
);

COMMIT;
