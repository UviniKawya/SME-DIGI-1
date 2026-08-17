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
   - Then run `backend/database/seed_questions.sql` to load the assessment questions
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
2. **Digital Readiness Assessment** → loads Likert questions filtered by the SME's `business_type` (Retail / Manufacturing / Services / Agriculture), grouped into 4 dimensions: Infrastructure, Financial, Digital Skills & Workforce, Cybersecurity.
3. **Inventory** → add/track stock items for the active SME.
4. **Sales** → record sales against inventory items (auto-decrements stock).
5. **Dashboard** → radar chart of readiness scores, bar chart of inventory levels, line chart of sales revenue trend.

## 4. Notes for your thesis writeup

- Business types and questions are stored in the DB (`assessment_questions` table), so you can add more types/questions without touching code — useful if your supervisor asks for changes.
- Likert scale is 1–5 (Strongly Disagree → Strongly Agree).
- `dashboard.php` computes the average score per dimension and an overall readiness score — this maps directly to your TOE framework dimensions.
