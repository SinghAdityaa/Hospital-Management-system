# HealthCare+ — Doctor Appointment System (React frontend)

A responsive, frontend-only healthcare management demo based on the supplied UI screenshots and React folder layout. There is **no Spring Boot backend or PostgreSQL connection in this ZIP**.

## Requirements
- Node.js 20.19+ or 22.12+ recommended
- npm

## Run locally
```bash
npm install
npm start
```
Open the URL shown in your terminal (Vite usually serves http://localhost:5173). To serve on port 3000 like the original screenshot, run `npm start -- --port 3000`.

## Pages
- `/` — Home
- `/login` — Login
- `/register` — Patient registration
- `/doctors` — Search and filter doctors
- `/book/:id` — Request an appointment (patient account)
- `/about`, `/services`, `/contact` — Information pages
- `/dashboard` — Role-specific dashboard
- Dashboard subsections: appointments, doctors, patients, reports, prescriptions, profile as permitted by role.

## Demo accounts
All accounts use **Demo@123** as their password.

| Role | Email |
|---|---|
| Patient | patient@demo.com |
| Doctor | doctor@demo.com |
| Admin | admin@demo.com |
| Reception | reception@demo.com |
| Lab | lab@demo.com |
| Pharmacy | pharmacy@demo.com |

Enter the demo email and password manually on the Login page; no account shortcuts are displayed in the interface.

## What works
- Role-based demo login, logout and route protection
- Patient registration and form validation
- Doctor search, specialty filtering and appointment requests
- Appointment status updates by staff
- Patient overview, appointments, reports, prescriptions and profile
- Doctor overview, appointments, and creation of prescriptions
- Admin doctor directory management and patient list
- Reception appointment updates and patient list
- Lab report entry and status updates
- Pharmacy dispensing status updates
- Responsive navigation and dashboard layout

## Important limitations
- This is **not production authentication**. Accounts and passwords exist in the browser's localStorage as visible demo data.
- Role access is only enforced within the React UI; it is not secure access control.
- Browser data is not synced between devices or browsers. Clearing localStorage removes changes and restores seeded demo content.
- Appointment times are requests, not availability checks; double-booking prevention is not implemented.
- No real emails, password resets, payment processing, medical verification, or report document downloads.
- Use only synthetic/test records — **do not enter real patient information**.
- The homepage's 500+ doctors and 10K+ appointments are illustrative marketing placeholders, not counts from this demo dataset.

## When connecting a backend
Replace `src/services/storage.js` and state actions in `src/context/AppContext.jsx` with authenticated API calls to Spring Boot. Implement real server-side authorization and secure token management, plus database-backed validation and appointment slot conflicts.

## Build
```bash
npm run build
npm run preview
```


## UI and launch requirements

- No demo-login shortcuts are shown in the login interface. Type demo credentials manually.
- No invented customer counts, star ratings, testimonials, or generic contact numbers.
- No purple gradients, emoji-based icons, cursor animations, or pill-shaped buttons.
- Favicon is included at `public/favicon.svg`.
- Privacy policy at `/privacy` and terms at `/terms` are **drafts for demo use**, not lawyer-approved production policies.
- **Not ready to launch:** Connect and verify a custom domain, choose hosting, configure actual contact information, review the legal pages, and replace browser storage with a secure backend before collecting personal or health data.
- No deployment was performed. No domain was connected.
