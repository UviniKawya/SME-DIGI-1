# SME Digi — Local Setup Guide (XAMPP + React)

Stack: React (Vite) + PHP + MySQL, running locally via XAMPP.

## 1. Backend (PHP + MySQL)

1. Copy the `backend` folder into your XAMPP `htdocs` directory, renaming it `sme-digi`:
   ```
   C:\xampp\htdocs\sme-digi\backend\
   ```
2. Start **Apache** and **MySQL** in the XAMPP Control Panel.
3. Open `http://localhost/phpmyadmin`, create nothing manually — instead:
   - Go to the **Import** tab (or SQL tab) and run `backend/database/schema.sql`
   - Then run `backend/database/seed_questions.sql` to load the readiness questions
   - Then run `backend/database/seed_barrier_performance.sql` to load barrier/performance questions
4. Test it's working by visiting:
   ```
   http://localhost/sme-digi/backend/api/get_smes.php
   ```
   You should see `[]` (empty array — no SMEs yet).

## 2. Frontend (React + Vite)

1. Open the `frontend` folder in VS Code.
2. Install dependencies:
   ```
   cd frontend
   npm install
   ```
3. Run the dev server:
   ```
   npm run dev
   ```
4. Open the app at `http://localhost:5173`

The frontend calls the backend at `http://localhost/sme-digi/backend/api` (see `src/api/api.js` — change this if you use a different folder name or port).

## 3. Flow

1. **SME Registration** → creates a record in `smes` table, sets it as the active SME.
2. **Assessment** → loads Likert questions grouped into 3 types: Digital Readiness (Infrastructure, Financial, Digital Skills & Workforce, Cybersecurity), Barriers (Cost, Skills Gap, Infrastructure, Awareness, Other), and Business Performance (Sales Growth, Operational Efficiency, Profitability, Customer Satisfaction).
3. **Inventory** → add/track stock items for the active SME.
4. **Sales** → record sales against inventory items (auto-decrements stock).
5. **Dashboard** → score rings for Readiness/Barrier/Performance, bar chart of readiness dimensions, donut chart of barrier categories, recent activity feed, quick actions.

## 4. Notes for your thesis writeup

- Business types and questions are stored in the DB (`assessment_questions` table), so you can add more types/questions without touching code.
- Likert scale is 1–5.
- `dashboard.php` computes the average score per dimension and overall scores for each assessment type.