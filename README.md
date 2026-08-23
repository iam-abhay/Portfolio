# Portfolio

## Live Website
https://iam-abhay.github.io/Portfolio/

## Repository
https://github.com/iam-abhay/Portfolio

## Overview
This repository contains **Abhay Kharat**'s personal portfolio built with **React** and **Vite**. The site pulls live data from **Supabase** (PostgreSQL + Auth + Storage) and is deployed automatically to **GitHub Pages** via a GitHub Actions workflow.

## Features

### Public Portfolio
- Hero / Profile section
- About
- Skills
- Projects
- Experience
- Education
- Certifications
- Contact form
- Fully responsive design
- Data driven from Supabase (read‑only for public users)

### Admin CMS
- Supabase authentication for admin users
- Protected admin routes (`ProtectedRoute` component)
- Profile management
- Project CRUD with publish/featured controls
- Skill management
- Experience management
- Education management
- Certification management
- Dashboard metrics
- Project image upload from device
- External HTTPS project image URLs support
- Image preview, replacement, and removal
- Integration with Supabase Storage bucket `portfolio-images`

## Technology Stack
| Layer | Technologies |
|-------|--------------|
| Frontend | React, Vite, React Router, Tailwind CSS, Framer Motion, Lucide React |
| Backend / Data | Supabase (PostgreSQL, Auth, Storage), Row‑Level Security |
| Deployment | GitHub Actions, GitHub Pages |
| Development | npm, Git |

## Architecture
```
GitHub Repository
    ↓
GitHub Actions (CI/CD)
    ↓
GitHub Pages (static host)
    ↓
React + Vite SPA
    ↓
Supabase
        ├─ PostgreSQL (tables)
        ├─ Auth (admin authentication)
        ├─ Row‑Level Security (protect writes)
        └─ Storage (project image bucket)
```
- **Public API**: unauthenticated reads from Supabase tables (profiles, projects, etc.)
- **Admin API**: authenticated requests (via Supabase Auth) that respect RLS policies, allowing writes and storage operations.

## Database
The Supabase schema defines the following tables:
- **profiles** – basic user profile data displayed on the public site.
- **projects** – project entries; includes `image_url` field.
- **skills** – skill items shown in the Skills section.
- **experience** – professional experience records.
- **education** – academic background entries.
- **certifications** – certifications and awards.
- **social_links** – links to GitHub, LinkedIn, etc.
- **admin_users** – list of users authorized as admins (used by `public.is_admin()`).

## Project Images
1. **Static images** are stored under `public/assets/images/` and referenced directly.
2. **Dynamic images** are stored in Supabase Storage bucket `portfolio-images`. The URL is saved in `projects.image_url`.
3. Admin can **upload** an image from the device (max 5 MB, formats: JPEG, PNG, WEBP, GIF).
4. Admin can also provide an **external HTTPS image URL**.
5. The UI offers **preview**, **replace**, and **remove** actions for project images.
6. Public project cards resolve correct base paths on GitHub Pages.

## Authentication & Security
- **Supabase Auth** handles login for admin users.
- `ProtectedRoute` component guards admin routes.
- `admin_users` table defines which authenticated users are admins.
- `public.is_admin()` utility checks admin status.
- **Row‑Level Security** enforces that only admins can write to the tables.
- Storage uploads/deletes are restricted to authenticated admins.
- No service‑role key is shipped to the frontend; only the **publishable** anon key is used.
- `.env` file (containing `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`) is listed in `.gitignore` and never committed.

## Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview the production build locally
npm run preview
```
Create a `.env` file at the project root with:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```
**Never commit** this file.

## Deployment
The workflow defined in `.github/workflows/deploy.yml` runs on every push to `main`:
1. Checks out the repository.
2. Installs Node dependencies.
3. Executes `npm run build`.
4. Deploys the contents of the `dist/` folder to GitHub Pages using the `peaceiris/actions-gh-pages` action.

## Repository Structure
```
Portfolio/
├─ .github/
│   └─ workflows/
│       └─ deploy.yml
├─ public/
│   └─ assets/
│       └─ images/
├─ src/
│   ├─ components/
│   ├─ context/
│   ├─ lib/
│   └─ pages/
│       └─ admin/
├─ supabase/
│   ├─ schema.sql
│   └─ seed_portfolio.sql
├─ .env.example
├─ .gitignore
├─ index.html
├─ package.json
├─ package-lock.json
├─ postcss.config.js
├─ tailwind.config.js
├─ vite.config.js
└─ README.md
```
*Only the items shown actually exist in the repository.*

## License
No explicit open‑source license file is present in this repository.

## Author
**Abhay Kharat** – Aspiring Software Engineer
- GitHub: https://github.com/iam-abhay
- LinkedIn: https://www.linkedin.com/in/abhay-kharat
- Portfolio: https://iam-abhay.github.io/Portfolio/