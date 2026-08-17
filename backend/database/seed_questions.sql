USE sme_digi;

-- Clear existing (safe re-run)
DELETE FROM assessment_questions;

-- =========================================================
-- RETAIL
-- =========================================================
INSERT INTO assessment_questions (business_type, dimension, question_text, display_order) VALUES
('Retail','Infrastructure','Our business has reliable internet connectivity at all operating locations.',1),
('Retail','Infrastructure','We use a Point-of-Sale (POS) or billing system instead of manual records.',2),
('Retail','Infrastructure','Our devices (computers/POS/tablets) are adequate for daily operations.',3),

('Retail','Financial','We have budget allocated specifically for digital tools/software.',1),
('Retail','Financial','We accept digital payments (cards, QR, mobile wallets) in addition to cash.',2),
('Retail','Financial','We can access financing or loans to invest in digital upgrades.',3),

('Retail','Digital Skills & Workforce','Our staff are comfortable using digital sales/inventory systems.',1),
('Retail','Digital Skills & Workforce','We provide training when new digital tools are introduced.',2),
('Retail','Digital Skills & Workforce','Management actively encourages adoption of new technology.',3),

('Retail','Cybersecurity','We use secure passwords and access controls for business systems.',1),
('Retail','Cybersecurity','We regularly back up sales and customer data.',2),
('Retail','Cybersecurity','Staff are aware of basic cybersecurity risks (phishing, fraud).',3);

-- =========================================================
-- MANUFACTURING
-- =========================================================
INSERT INTO assessment_questions (business_type, dimension, question_text, display_order) VALUES
('Manufacturing','Infrastructure','Our production processes use digital monitoring or automation tools.',1),
('Manufacturing','Infrastructure','We have stable connectivity between factory floor and office systems.',2),
('Manufacturing','Infrastructure','Our machinery/equipment supports digital integration (sensors, software).',3),

('Manufacturing','Financial','We track production costs using digital accounting/ERP tools.',1),
('Manufacturing','Financial','We have capital allocated for upgrading production technology.',2),
('Manufacturing','Financial','We can access financing for digital transformation projects.',3),

('Manufacturing','Digital Skills & Workforce','Our production staff are trained to operate digital/automated equipment.',1),
('Manufacturing','Digital Skills & Workforce','We have technical staff capable of maintaining digital systems.',2),
('Manufacturing','Digital Skills & Workforce','Management supports continuous digital upskilling programs.',3),

('Manufacturing','Cybersecurity','Our production/inventory data is protected against unauthorized access.',1),
('Manufacturing','Cybersecurity','We have protocols to prevent industrial system tampering.',2),
('Manufacturing','Cybersecurity','We regularly update software on production-related systems.',3);

-- =========================================================
-- SERVICES
-- =========================================================
INSERT INTO assessment_questions (business_type, dimension, question_text, display_order) VALUES
('Services','Infrastructure','We use digital tools (booking systems, CRM) to manage client interactions.',1),
('Services','Infrastructure','Our team can access business systems remotely when needed.',2),
('Services','Infrastructure','Our internet and hardware reliably support daily service delivery.',3),

('Services','Financial','We use digital invoicing and payment collection systems.',1),
('Services','Financial','We have budget for subscription-based digital service tools (SaaS).',2),
('Services','Financial','We can access financing to expand digital service capabilities.',3),

('Services','Digital Skills & Workforce','Our staff are proficient in the digital tools used to deliver services.',1),
('Services','Digital Skills & Workforce','We provide ongoing training on new service-delivery technologies.',2),
('Services','Digital Skills & Workforce','Employees are encouraged to suggest digital process improvements.',3),

('Services','Cybersecurity','Client data is stored and handled securely (encryption/access control).',1),
('Services','Cybersecurity','We have a policy for handling data breaches or security incidents.',2),
('Services','Cybersecurity','Staff are trained to recognize cybersecurity threats.',3);

-- =========================================================
-- AGRICULTURE
-- =========================================================
INSERT INTO assessment_questions (business_type, dimension, question_text, display_order) VALUES
('Agriculture','Infrastructure','We use digital tools for crop/livestock/production tracking.',1),
('Agriculture','Infrastructure','We have reliable connectivity at our farm/production site.',2),
('Agriculture','Infrastructure','We use digital platforms to access market prices or buyers.',3),

('Agriculture','Financial','We use digital record-keeping for farm income and expenses.',1),
('Agriculture','Financial','We have access to agri-focused digital financing or microloans.',2),
('Agriculture','Financial','We receive digital payments from buyers/distributors.',3),

('Agriculture','Digital Skills & Workforce','Farm workers/staff are trained to use available digital tools.',1),
('Agriculture','Digital Skills & Workforce','We seek external training/extension services on agri-technology.',2),
('Agriculture','Digital Skills & Workforce','Management is open to adopting new agri-tech solutions.',3),

('Agriculture','Cybersecurity','Our farm/production data is protected against loss or unauthorized access.',1),
('Agriculture','Cybersecurity','We back up important records (yield, sales, customer data).',2),
('Agriculture','Cybersecurity','We are cautious about sharing sensitive data on digital platforms.',3);
