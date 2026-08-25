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
  'efa9bd86-6599-4f86-a39c-7edc7d1e188c',
  'Abhay Kharat',
  'Software Engineer | Data Analyst | BI Enthusiast | Cloud & DevOps Enthusiast | Open to Work',
  'Hands-on experience in Java, Spring Boot, React.js, PostgreSQL, SQL, Python, Excel, Power BI, AWS, Terraform, Docker, Kubernetes, CI/CD, cloud networking, IAM, security, and data analytics.',
  'BE Electronics & Telecommunication Engineering Graduate (2026)

Passionate about Software Engineering, Cloud Infrastructure, Data Analytics, and Business Intelligence, with an interest in developing scalable applications, automating infrastructure, and transforming structured data into meaningful business insights.

I enjoy solving real-world problems using Java, Spring Boot, React.js, PostgreSQL, SQL, Python, Microsoft Excel, Power BI, AWS, and Terraform.

Currently developing practical capabilities in AWS Cloud Infrastructure, Terraform, Infrastructure as Code (IaC), Docker, Kubernetes, CI/CD, cloud networking, IAM, and cloud security through hands-on projects.

Interested in building secure, scalable, maintainable, and cost-aware infrastructure using cloud technologies, automation, version control, and DevOps practices.

Interested in data analysis, business reporting, data visualization, KPI analysis, dashboard development, and data-driven decision making.

I am actively looking for opportunities where I can contribute, learn, and grow across Software Engineering, Cloud Infrastructure, DevOps, Data Analytics, and Business Intelligence roles.',
  'abhaykharat.er@gmail.com',
  '+91-8888537005',
  'https://github.com/iam-abhay',
  'https://linkedin.com/in/abhay-kharat',
  '#',
  'assets/images/profile.jpg'
);

-- 3. SEED PROJECTS TABLE
INSERT INTO public.projects (
  id,
  title,
  slug,
  category,
  secondary_category,
  short_description,
  description,
  technologies,
  github_url,
  live_url,
  image_url,
  featured,
  published,
  display_order,
  metrics
) VALUES 
(
  'e3ba6c71-3310-4bf6-905c-d784a95cb88a',
  'AWS Infrastructure Automation with Terraform',
  'aws-infra-terraform',
  'Cloud & DevOps',
  'Software Engineering',
  'Infrastructure as Code project focused on provisioning and managing AWS cloud infrastructure using Terraform.',
  'Developed and provisioned AWS cloud infrastructure using Terraform following Infrastructure as Code (IaC) practices. Configured custom VPC networking (subnets, route tables, Internet Gateway) and hosted EC2 instances securely. Implemented IAM roles, access policies, and security groups. Utilized S3 for storage, organized modular Terraform configurations using variables and outputs, managed infrastructure configuration changes through Git/GitHub, and optimized cloud setups for cost awareness, reliability, and security.',
  ARRAY['AWS', 'Terraform', 'Infrastructure as Code', 'VPC', 'EC2', 'IAM', 'S3', 'Security Groups', 'Git'],
  'https://github.com/iam-abhay',
  'https://github.com/iam-abhay',
  'assets/images/project-dev-platform.jpg',
  true,
  true,
  1,
  '100% automated IaC provisioning & cost-aware resource allocation'
),
(
  'fa446c82-841f-4efc-8b87-fa74ab89cb9c',
  'Retail Sales Performance & Business Intelligence Dashboard',
  'retail-sales-bi-dashboard',
  'Data Analytics',
  'Data Engineering',
  'End-to-end Business Intelligence solution for analyzing retail sales data and generating accurate, actionable business reports.',
  'Analyzed retail sales data to identify trends and performance patterns. Cleaned, transformed, and validated large datasets using Python and Pandas. Performed SQL-based data extraction, joins, filtering, aggregations, and KPI analysis. Created Excel reports using advanced formulas, Pivot Tables, Pivot Charts, and data validation. Developed an interactive Power BI dashboard featuring KPI cards, trends, category, and regional analysis to generate actionable business insights.',
  ARRAY['Microsoft Excel', 'SQL', 'Power BI', 'Python', 'Pandas'],
  'https://github.com/iam-abhay',
  'https://github.com/iam-abhay',
  'assets/images/project-ai-analytics.jpg',
  true,
  true,
  2,
  'End-to-end KPI tracking & visual data reporting'
),
(
  '3bf304b4-f24c-4beb-b7ec-1a4afbf01d04',
  'AgriEase – AI-Powered Smart Agriculture Platform',
  'agriease',
  'Software Engineering',
  NULL,
  'Full-stack web application connecting farmers and suppliers through equipment rental and marketplace services with JWT security and Spring Boot REST APIs.',
  'Developed a full-stack web application connecting farmers and suppliers through equipment rental and marketplace services. Implemented secure JWT authentication, role-based access control, and RESTful APIs using Spring Boot. Built responsive React.js interfaces, integrated PostgreSQL for efficient data management, and utilized Git for version control while following OOP principles and layered architecture.',
  ARRAY['Java', 'Spring Boot', 'React.js', 'PostgreSQL', 'JWT', 'REST APIs', 'Git'],
  'https://github.com/iam-abhay',
  'https://github.com/iam-abhay',
  'https://lwjvcfttycctwygkuoji.supabase.co/storage/v1/object/public/portfolio-images/projects/1787492237730-5qly29w.png',
  true,
  true,
  3,
  NULL
),
(
  '6ae26c46-f400-48e1-952e-670325e4de0a',
  'MoodFlix – Mood-Based Movie Recommendation System',
  'moodflix',
  'Software Engineering',
  NULL,
  'JavaFX desktop application that recommends movies based on user mood with Java Collections Framework, PostgreSQL, HikariCP, and Firebase Firestore.',
  'Developed a JavaFX desktop application that recommends movies based on user mood. Applied OOP principles and the Java Collections Framework to build a modular application, integrated REST APIs, OMDb API, PostgreSQL connection pooling with HikariCP, and Firebase Firestore for cloud-based data storage, and designed an intuitive user interface to enhance user experience.',
  ARRAY['Java', 'JavaFX', 'PostgreSQL', 'OMDb API', 'HikariCP', 'Firebase Firestore', 'REST APIs', 'OOP'],
  'https://github.com/iam-abhay',
  'https://github.com/iam-abhay',
  'assets/images/project-dev-platform.jpg',
  true,
  true,
  4,
  NULL
),
(
  '97265595-a746-4eb4-aa99-33cad7c0ff35',
  'ApnaGhar – Real Estate Listing Website',
  'apnaghar',
  'Software Engineering',
  NULL,
  'Responsive real estate listing platform using React.js with property browsing, filtering features, and component-based architecture.',
  'Developed ApnaGhar, a responsive real estate listing and property browsing platform. Built using React.js with reusable components and responsive design practices. Implemented property filtering functionality and interactive frontend components, utilizing Git-based version control for organized deployment.',
  ARRAY['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Git'],
  'https://github.com/iam-abhay',
  'https://github.com/iam-abhay',
  'assets/images/project-cyber-shop.jpg',
  true,
  true,
  5,
  NULL
);

-- 4. SEED SKILLS TABLE
INSERT INTO public.skills (id, name, category, display_order, visible) VALUES
-- Programming Languages
('sk-1', 'Java', 'Programming Languages', 1, true),
('sk-2', 'JavaScript', 'Programming Languages', 2, true),
('sk-3', 'Python', 'Programming Languages', 3, true),
('sk-4', 'SQL', 'Programming Languages', 4, true),
('sk-5', 'C', 'Programming Languages', 5, true),
('sk-6', 'Bash', 'Programming Languages', 6, true),

-- Backend Development
('sk-7', 'Spring Boot', 'Backend Development', 7, true),
('sk-8', 'REST APIs', 'Backend Development', 8, true),
('sk-9', 'JDBC', 'Backend Development', 9, true),
('sk-10', 'JWT Authentication', 'Backend Development', 10, true),
('sk-11', 'Node.js', 'Backend Development', 11, true),
('sk-12', 'Microservices', 'Backend Development', 12, true),
('sk-13', 'Apache Kafka', 'Backend Development', 13, true),
('sk-14', 'Java Collections Framework', 'Backend Development', 14, true),

-- Frontend Development
('sk-15', 'React.js', 'Frontend Development', 15, true),
('sk-16', 'HTML5', 'Frontend Development', 16, true),
('sk-17', 'CSS3', 'Frontend Development', 17, true),
('sk-18', 'Responsive Web Design', 'Frontend Development', 18, true),

-- Database
('sk-19', 'PostgreSQL', 'Database', 19, true),
('sk-20', 'MySQL', 'Database', 20, true),
('sk-21', 'SQL', 'Database', 21, true),
('sk-22', 'Firebase Firestore', 'Database', 22, true),

-- Cloud & DevOps
('sk-23', 'AWS (Amazon Web Services)', 'Cloud & DevOps', 23, true),
('sk-24', 'Terraform (Infrastructure as Code)', 'Cloud & DevOps', 24, true),
('sk-25', 'Docker', 'Cloud & DevOps', 25, true),
('sk-26', 'Kubernetes', 'Cloud & DevOps', 26, true),
('sk-27', 'CI/CD & Automation', 'Cloud & DevOps', 27, true),
('sk-28', 'Linux', 'Cloud & DevOps', 28, true),
('sk-29', 'Bash Scripting', 'Cloud & DevOps', 29, true),
('sk-30', 'Infrastructure Troubleshooting', 'Cloud & DevOps', 30, true),
('sk-31', 'Cloud Cost & Resource Optimization', 'Cloud & DevOps', 31, true),
('sk-32', 'Infrastructure Reliability & Monitoring', 'Cloud & DevOps', 32, true),
('sk-33', 'GitHub Actions', 'Cloud & DevOps', 33, true),

-- Data Analytics & BI
('sk-34', 'Microsoft Excel', 'Data Analytics & BI', 34, true),
('sk-35', 'Power BI', 'Data Analytics & BI', 35, true),
('sk-36', 'Python & Pandas', 'Data Analytics & BI', 36, true),
('sk-37', 'Data Cleaning & Validation', 'Data Analytics & BI', 37, true),
('sk-38', 'Data Visualization', 'Data Analytics & BI', 38, true),
('sk-39', 'Business Reporting', 'Data Analytics & BI', 39, true),
('sk-40', 'KPI Analysis', 'Data Analytics & BI', 40, true),
('sk-41', 'Dashboard Development', 'Data Analytics & BI', 41, true),
('sk-42', 'Data Quality & Data Analysis', 'Data Analytics & BI', 42, true),

-- Tools & IDEs
('sk-43', 'Git', 'Tools & IDEs', 43, true),
('sk-44', 'GitHub', 'Tools & IDEs', 44, true),
('sk-45', 'Maven', 'Tools & IDEs', 45, true),
('sk-46', 'Postman', 'Tools & IDEs', 46, true),
('sk-47', 'VS Code', 'Tools & IDEs', 47, true),
('sk-48', 'IntelliJ IDEA', 'Tools & IDEs', 48, true),

-- AI-Assisted Development
('sk-49', 'Prompt Engineering', 'AI-Assisted Development', 49, true),
('sk-50', 'AI-Assisted Coding', 'AI-Assisted Development', 50, true),
('sk-51', 'GitHub Copilot', 'AI-Assisted Development', 51, true),
('sk-52', 'ChatGPT', 'AI-Assisted Development', 52, true),
('sk-53', 'AI-Powered Debugging', 'AI-Assisted Development', 53, true),

-- Core CS Concepts
('sk-54', 'Object Oriented Programming (OOP)', 'Core CS Concepts', 54, true),
('sk-55', 'Data Structures & Algorithms (DSA)', 'Core CS Concepts', 55, true),
('sk-56', 'DBMS', 'Core CS Concepts', 56, true),
('sk-57', 'Operating Systems', 'Core CS Concepts', 57, true),
('sk-58', 'Computer Networks', 'Core CS Concepts', 58, true),
('sk-59', 'Software Engineering', 'Core CS Concepts', 59, true),
('sk-60', 'System Design', 'Core CS Concepts', 60, true);

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
  'db2ac360-53e9-47c8-8b8f-1239e114ba70',
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
  '36b1cf76-6265-4f4b-9770-0dfb2535a372',
  'Shrimati Kashibai Navale College of Engineering, Pune',
  'Bachelor of Engineering (B.E.)',
  'Electronics and Telecommunication Engineering',
  '2022-01-01'::date,
  '2026-06-01'::date,
  'Academic coursework in Data Structures & Algorithms, Object Oriented Programming, DBMS, Computer Networks, Operating Systems, and Software Engineering. Grade: CGPA: 8.16/10',
  1
),
(
  '09d4977b-ddd3-4f57-9766-db5b929f8302',
  'Swami Samarth Jr. Arts & Science College',
  'Higher Secondary Certificate (HSC)',
  'Science',
  '2018-06-01'::date,
  '2020-05-01'::date,
  'Completed Higher Secondary Certificate coursework with 92.92% distinction.',
  2
),
(
  '3a5fb5f3-2e39-4698-bd65-c6f941ba92ac',
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
  'cert-1',
  'Power BI – 30 Days Power BI Micro Course',
  'SkillCourse',
  '2025-01-01'::date,
  '#',
  NULL,
  'Completed a 30-day intensive Power BI training covering data visualization, dashboarding, and KPI analysis.',
  1
),
(
  'cert-2',
  'SQL (Intermediate)',
  'HackerRank',
  '2025-01-01'::date,
  '#',
  NULL,
  'Certified in intermediate-level SQL querying, joins, subqueries, and database analysis.',
  2
),
(
  'a601a291-fb83-45d6-b5e2-17a4e0abb79a',
  'Core2Web Java Language Course',
  'Core2Web',
  '2025-01-01'::date,
  '#',
  NULL,
  'In-depth practical training in Java Core concepts, OOP principles, Exception Handling, Collections Framework, and Multithreading.',
  3
),
(
  'd83a5ec8-bf95-40dd-a64c-698e1543e86f',
  'Super-X Java Project (MoodFlix)',
  'Java Development Track',
  '2025-01-01'::date,
  '#',
  NULL,
  'Hands-on project certification for architecting and building the MoodFlix JavaFX movie recommendation application.',
  4
),
(
  'cert-5',
  'IBM SkillsBuild Certifications',
  'IBM',
  '2025-01-01'::date,
  '#',
  NULL,
  'Multi-course certification covering Enterprise Data Science, Cloud Solutions design, and modern microservices architecture.',
  5
),
(
  'cert-6',
  'IIT Bombay Training Programs',
  'IIT Bombay',
  '2025-01-01'::date,
  '#',
  NULL,
  'Completed technical training programs and workshops organized by IIT Bombay.',
  6
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
  '0408f5ce-ac3c-4cc8-a992-a5269d976243',
  'GitHub',
  'https://github.com/iam-abhay',
  1,
  true
),
(
  '221f9e47-db6c-4315-b68c-ef574cb39297',
  'LinkedIn',
  'https://linkedin.com/in/abhay-kharat',
  2,
  true
);

COMMIT;
