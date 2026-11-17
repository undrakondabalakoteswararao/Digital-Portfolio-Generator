# PortfolioForge - Digital Portfolio Generator for Students and Freshers

A full-stack web application (React + Node/Express + MongoDB) that lets students register, enter their details,
pick a template, and automatically get a public portfolio page plus a PDF resume.

> **Honest status note:** all code was written and statically checked (syntax of every backend and frontend file,
> import/export resolution). It could **not** be executed where it was written (no internet, so no `npm install`, no MongoDB).
> Follow the [testing checklist](#15-testing) on your machine and fix anything you find - the checklist covers every item in the spec.

---

## Table of contents
1. [Introduction](#1-introduction) - 2. [Problem statement](#2-problem-statement) - 3. [Objectives](#3-objectives) - 4. [Proposed solution](#4-proposed-solution) - 5. [Features](#5-features) - 6. [Technology stack](#6-technology-stack) - 7. [Frontend architecture](#7-frontend-architecture) - 8. [Backend architecture](#8-backend-architecture) - 9. [Database design](#9-database-design) - 10. [API documentation](#10-api-documentation) - 11. [Folder structure](#11-folder-structure) - 12. [Installation](#12-installation-windows--vs-code) - 13. [Execution](#13-running-the-project) - 14. [Security](#14-security-measures) - 15. [Testing](#15-testing) - 16. [Future enhancements](#16-future-enhancements) - 17. [Viva guide](#17-technology-explanations-for-your-viva)

## 1. Introduction
PortfolioForge helps students and freshers present themselves professionally online without programming or design skills.

## 2. Problem statement
Freshers often have good projects but no work history, and a plain resume does not show their work. Building a personal website needs HTML/CSS/JS skills and time that many students do not have.

## 3. Objectives
- Let a user register, log in and manage a profile securely.
- Collect education, skills, projects, experience, certifications and achievements.
- Generate a responsive portfolio automatically from stored data using one of four templates.
- Publish it at a public URL (`/portfolio/<slug>`) and generate a PDF resume.

## 4. Proposed solution
A React single-page app talks to an Express REST API. Data lives in MongoDB. Templates are React components that receive the student's data and render only the sections that have content.

## 5. Features
Landing page - Register/Login/Logout (JWT in HTTP-only cookie) - Dashboard with completion %, stats, chart, activity - Multi-section profile builder with add/edit/remove records - Profile image and project image upload (validated) - 4 templates with live previews of the user's own data - Live preview with desktop/tablet/mobile widths - Publish/unpublish, editable slug, copy/share link - Public portfolio page with SEO tags and a clear "not available" page - PDF resume (jsPDF) - Light/dark theme saved between visits - Unsaved-changes warning - Account settings (name, email, password).

## 6. Technology stack
| Layer | Tools |
|---|---|
| Frontend | React 18 + Vite, Tailwind CSS 3, React Router 6, Axios, React Hook Form, React Hot Toast, Recharts, Lucide icons, jsPDF |
| Backend | Node.js, Express 4, express-validator, JWT (jsonwebtoken), bcryptjs, Helmet, CORS, express-rate-limit, Multer, cookie-parser |
| Database | MongoDB (local or Atlas) with Mongoose |

## 7. Frontend architecture
- `context/` - `AuthContext` (who is logged in), `ThemeContext` (light/dark), `ProfileContext` (profile + portfolio shared by all dashboard pages, so the preview updates instantly after saving).
- `pages/` - route-level screens. `layouts/` - dashboard shell with sidebar. `components/` - reusable pieces.
- `components/forms/RecordListEditor` + `ArraySectionPage` - one reusable editor powers Education, Projects, Experience, Certifications and Achievements.
- `templates/` - the four portfolio templates; `shared.jsx` prepares data so each template shows only non-empty sections.
- `services/api.js` - Axios instance (sends the cookie, adds the CSRF header).
- Route guards (`ProtectedRoute`, `GuestRoute`) protect pages; `/auth/me` on load keeps you logged in after refresh.

## 8. Backend architecture
Routes -> validators -> controllers -> models, with `protect` middleware (reads the JWT cookie), a CSRF guard, upload middleware and one central error handler. Controllers never trust a user id from the request: the owner is always `req.user` from the verified cookie, so one student cannot edit another's data.

## 9. Database design
- **User**: name, email (unique), password (bcrypt hash, never returned), timestamps.
- **Profile** (1:1 with User via `userId`): profileImage, professionalTitle, careerObjective, about, contactEmail, phone, city, country, socialLinks, and embedded arrays `education`, `skills`, `projects`, `experience`, `certifications`, `achievements`, plus `languages`, `interests`, `hobbies`, and a small `activity` log.
- **Portfolio** (1:1 with User via `userId`): slug (unique), selectedTemplate, isPublished, publishedAt, timestamps.

Skill proficiency (`level`) is stored only if the user types it; otherwise no bar is shown.

## 10. API documentation
All state-changing requests need header `X-Requested-With: PortfolioForge` (the frontend adds it automatically). Errors look like `{ "success": false, "message": "...", "errors": [...] }`.

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/register | - | Create account (name, email, password, confirmPassword) |
| POST | /api/auth/login | - | Log in, sets cookie |
| POST | /api/auth/logout | - | Clears cookie |
| GET | /api/auth/me | yes | Current user |
| PUT | /api/auth/account | yes | Update name/email |
| PUT | /api/auth/password | yes | Change password |
| GET | /api/profile | yes | Own profile |
| PUT | /api/profile | yes | Update any profile sections (partial update) |
| POST | /api/profile/upload-image | yes | Profile picture (field `image`, JPG/PNG/WebP, 2 MB) |
| POST | /api/profile/upload-project-image | yes | Project image, returns URL |
| GET | /api/portfolio/me | yes | Portfolio + profile + name |
| PUT | /api/portfolio/me | yes | Change slug |
| POST | /api/portfolio/publish | yes | Publish |
| POST | /api/portfolio/unpublish | yes | Unpublish |
| GET | /api/portfolio/public/:slug | - | Public data (404 if unpublished) |
| GET | /api/templates | - | List templates |
| PUT | /api/templates/select | yes | `{ templateId }` |
| GET | /api/dashboard/stats | yes | Counts, completion %, activity |
| GET | /api/health | - | Health check |

## 11. Folder structure
```
Digital-Portfolio-Generator/
  package.json  README.md  .gitignore
  backend/   server.js app.js  config/ controllers/ middleware/ models/ routes/ utils/ uploads/  .env.example
  frontend/  index.html vite.config.js tailwind.config.js  .env.example
             src/ App.jsx main.jsx index.css  components/{common,dashboard,forms,portfolio} context/ hooks/ layouts/ pages/ services/ templates/ utils/
```

## 12. Installation (Windows + VS Code)
1. Install **Node.js LTS** (https://nodejs.org) and **VS Code**. Check in a terminal: `node -v` and `npm -v`.
2. Unzip the project and open the `Digital-Portfolio-Generator` folder in VS Code (File > Open Folder). Open a terminal (Ctrl+`).
3. Install everything:
   ```
   npm run install-all
   ```
4. **Database - choose one:**
   - **Local MongoDB:** install MongoDB Community Server with "Install as a Service" ticked. Connection string: `mongodb://127.0.0.1:27017/portfolioforge`.
   - **MongoDB Atlas (free):** create an account at mongodb.com/atlas > create a free M0 cluster > *Database Access*: add a user with a password > *Network Access*: add your current IP (or 0.0.0.0/0 for testing only) > *Connect > Drivers*: copy the `mongodb+srv://...` string and put your database name (`portfolioforge`) after `.net/`. If the password has special characters, URL-encode them.
5. Create the backend environment file:
   ```
   copy backend\.env.example backend\.env
   ```
   Open `backend/.env` and set `MONGODB_URI` and a long random `JWT_SECRET`. Generate one with:
   ```
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```
   The frontend needs no `.env` for local development (Vite proxies `/api` and `/uploads` to port 5000).

## 13. Running the project
- Both servers together: `npm run dev` (backend on http://localhost:5000, frontend on **http://localhost:5173**).
- Separately: `npm run backend` and `npm run frontend` in two terminals.
- Production-style build of the frontend: `npm run build`.

If the backend prints "MongoDB connection failed", check that the MongoDB service is running (local) or your Atlas user/password/IP allow-list.

## 14. Security measures
bcrypt hashing (12 rounds) - JWT in an **HTTP-only, SameSite=Lax** cookie (`Secure` in production) - never stored in JavaScript - CSRF guard (custom header required on state-changing requests + CORS restricted to `CLIENT_URL`) - Helmet headers - rate limit on login/register/password - express-validator + Mongoose validation - field whitelisting on profile updates - ownership always taken from the verified cookie - upload type/size limits with random filenames - generic login error (does not reveal which emails exist) - secrets only in `.env`, which is git-ignored.

Limitations: upload validation checks the declared MIME type, not file contents; for deployment the frontend and API should share a site (e.g. same domain) because the cookie is `SameSite=Lax`; the preview's tablet/mobile buttons narrow the container, but template breakpoints follow the real screen, so use browser dev tools (F12 > device toolbar) for a true mobile check. The resume PDF uses standard fonts, so non-Latin characters (e.g. Telugu or Hindi text) are omitted.

## 15. Testing
Run `npm run dev`, then tick each item:

| # | Test | Expected |
|---|---|---|
| 1 | Register with valid data | Redirect to dashboard; user appears in MongoDB `users` with a hashed password |
| 2 | Register same email again | "An account with this email already exists." |
| 3 | Register with mismatched passwords / short password | Inline validation errors |
| 4 | Login correct / wrong credentials | Dashboard / "Incorrect email or password." |
| 5 | Refresh the dashboard | Still logged in |
| 6 | Logout, then open `/dashboard` | Redirected to login |
| 7 | Fill profile, save, reload | Data persists |
| 8 | Add 3 projects, edit one, remove one, save | Counts update on Overview |
| 9 | Edit a form, click another sidebar link | Unsaved-changes prompt |
| 10 | Upload a `.pdf`/`.txt` as image; upload >2 MB | Error toast; a valid JPG works |
| 11 | Templates page: select each template | Selected badge; preview shows your data |
| 12 | Preview: Publish, Copy link, open it in a private window | Portfolio visible without login |
| 13 | Unpublish, reload the public link | "Portfolio not available" |
| 14 | While logged in as user A, call `PUT /api/profile` as user B's cookie only | Only B's data changes (no user id accepted from the body) |
| 15 | Download resume (preview and public page) | PDF has all entered sections and nothing invented |
| 16 | Stop MongoDB and start the backend | Clear error message and exit |
| 17 | Stop the backend while the app is open | "Cannot reach the server" messages / retry button |
| 18 | Theme toggle, refresh | Theme persists |
| 19 | Phone widths in browser dev tools | Layouts adapt, no horizontal scroll |

Record your actual results here for the "testing report" part of your submission.

## 16. Future enhancements
Custom domains - more templates and colour options - drag-and-drop section ordering - email verification and password reset - portfolio view analytics - cloud image storage (Cloudinary/S3) - automated tests (Jest, Supertest, Playwright) - Unicode fonts in the resume PDF.

## 17. Technology explanations for your viva
- **HTML/CSS/JavaScript** - structure, style, behaviour of every web page; React and Tailwind build on them.
- **React** - library for building UIs from reusable components; state changes re-render only what changed. **Vite** - fast dev server and bundler for React.
- **Tailwind CSS** - utility classes (`p-4`, `flex`) styled directly in markup; we use CSS variables for the light/dark theme.
- **React Router** - client-side routing: URL changes without full page reloads; used for guards and nested dashboard routes.
- **Axios** - HTTP client for calling the API; configured to send cookies.
- **React Hook Form** - efficient form state and validation, including dynamic lists (`useFieldArray`).
- **React Hot Toast** - success/error notifications. **Recharts** - dashboard chart. **Lucide** - icons. **jsPDF** - builds the PDF in the browser.
- **Node.js** - runs JavaScript on the server. **Express** - minimal web framework: routes, middleware, JSON APIs.
- **REST API** - resources exposed through URLs and HTTP methods (GET read, POST create, PUT update).
- **MongoDB** - NoSQL document database storing JSON-like documents. **Mongoose** - schemas, validation and queries for MongoDB.
- **JWT** - signed token proving who the user is; we store it in an HTTP-only cookie so scripts cannot steal it.
- **bcryptjs** - one-way, salted password hashing. **Helmet** - safe HTTP headers. **CORS** - controls which sites can call the API. **Rate limiting** - slows brute-force login attempts. **Multer** - handles file uploads. **express-validator** - checks request data.
- **Why embed education/skills/projects in Profile?** They are always read together with the profile and never shared between users, so one document means one fast read.
- **Why a separate Portfolio collection?** Slug, template and publish state are public-facing settings with their own unique index.

### Common viva questions
- *How does login persist after refresh?* The cookie is sent automatically; the app calls `/api/auth/me` on load.
- *How do you stop one user editing another's data?* The backend ignores any user id in the request and uses the id inside the verified JWT cookie.
- *Why not localStorage for the token?* Any injected script could read it; HTTP-only cookies cannot be read by JavaScript.
- *What happens if a portfolio is unpublished?* The public endpoint returns 404 and the page shows "not available".
