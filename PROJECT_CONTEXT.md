# CivicX — Master Project Context

## 1. Project Identity

Project Name: CivicX

Full Title: AI-Powered Intelligent Civic Issue Reporting & Resolution Platform

Institution: GLA University, Mathura

Course: B.Tech Computer Science & Engineering

Group Number: 231

Team Size: 5 Members

Project Type: Final-Year Major Project

## 2. Project Overview

CivicX is a web-based platform that allows citizens to report civic problems such as potholes, garbage accumulation, water leakage and damaged streetlights.

Citizens can submit complaints with descriptions, photographs and geographical locations.

Administrators can review complaints, prioritize them and assign them to departments or field workers.

Field workers can update complaint progress and upload resolution evidence.

Citizens can track complaints and confirm or dispute their resolution.

The platform also incorporates AI-assisted image classification, priority scoring, geographical visualization and administrative analytics.

## 3. Main User Roles

1. Citizen
   - Register and log in.
   - Submit civic complaints.
   - Upload photographs.
   - Select geographical locations.
   - Track submitted complaints.
   - Confirm or dispute resolutions.

2. Administrator
   - Manage and review complaints.
   - Assign departments and workers.
   - Monitor complaint progress.
   - Manage priorities.
   - Access analytics dashboards.

3. Field Worker
   - View assigned complaints.
   - Update complaint status.
   - Add progress notes.
   - Upload resolution evidence.

## 4. Technology Stack

Frontend:
- React.js
- Tailwind CSS
- React Router
- Axios

Backend:
- Node.js
- Express.js

Database:
- MongoDB
- Mongoose

Authentication:
- JWT
- bcrypt

AI Service:
- Python
- FastAPI
- PyTorch
- MobileNetV2 (proposed model)

Maps:
- Leaflet
- OpenStreetMap

Charts:
- Recharts

Image Storage:
- Cloudinary or equivalent

Testing:
- Postman
- Jest/Vitest or equivalent

Version Control:
- Git
- GitHub

## 5. Core Features

F01: Authentication and Role Management

F02: Citizen Complaint Submission

F03: My Reports and Complaint Details

F04: Admin Review and Assignment

F05: Field Worker Workflow

F06: Resolution Verification

F07: Explainable Priority Scoring

F08: Geographical Map and Filters

F09: Administrative Analytics

F10: Testing and Documentation

## 6. AI Features

Image Classification:

The AI service should identify supported civic issue categories from uploaded photographs.

Initial categories:
- Road damage
- Garbage
- Water leakage
- Streetlight/electrical
- Other/uncertain

Predictions must return:
- Predicted category
- Confidence score
- Model version

Low-confidence predictions must allow manual category selection.

AI predictions are advisory. Administrators and citizens must retain appropriate human control.

Priority Scoring:

Use the following initial formula:

P = 0.35 × S + 0.30 × R + 0.20 × I + 0.15 × T

Where:
- S = Severity
- R = Safety Risk
- I = Public Impact
- T = Waiting Time

All factors must be normalized between 0 and 100.

## 7. Proposed Project Structure

CivicX/
│
├── frontend/
├── backend/
├── ai-service/
├── docs/
├── tests/
│
├── README.md
├── PROJECT_CONTEXT.md
├── .gitignore
└── .env.example

## 8. Team Responsibilities

Member 1 — Tushant Pratap Singh
Role: Team Lead, System Architect and Integration.

Responsibilities:
- Project architecture.
- Requirement management.
- GitHub management.
- API coordination.
- Code reviews.
- Integration.
- Documentation coordination.

Member 2 — Prabesh Kumar Singh
Role: Citizen Frontend and UI.

Responsibilities:
- React frontend.
- Citizen dashboard.
- Authentication screens.
- Complaint submission forms.
- My Reports interface.
- Responsive UI.

Member 3 — Name Pending
Role: Backend and Database.

Responsibilities:
- Express APIs.
- MongoDB schemas.
- Authentication.
- Role-based authorization.
- Complaint management.
- Status history.

Member 4 — Name Pending
Role: AI/ML and Prioritization.

Responsibilities:
- AI dataset preparation.
- Image classification.
- FastAPI service.
- Model evaluation.
- Priority scoring.

Member 5 — Name Pending
Role: GIS, Analytics, QA and Deployment.

Responsibilities:
- Maps.
- Geographical filters.
- Analytics dashboard.
- Testing.
- Deployment.

## 9. Development Rules

1. Understand the requirements before implementing features.
2. Never generate the entire project in one operation.
3. Develop one module at a time.
4. Follow modular and maintainable coding practices.
5. Do not introduce unnecessary technologies.
6. Do not modify unrelated modules without approval.
7. Explain significant architectural decisions.
8. Test every major feature.
9. Do not use hardcoded credentials or API keys.
10. Maintain environment variables in .env files.
11. Never commit .env files or secrets to GitHub.
12. Maintain proper error handling and input validation.
13. Keep frontend and backend API contracts consistent.
14. Document important implementation decisions.

## 10. GitHub Development Workflow

Branches:

- main: Stable production-ready code.
- develop: Integration branch.
- feature/<member>-<task>: Individual development branches.

All team members should:
- Work on assigned modules.
- Commit meaningful changes.
- Push their feature branches.
- Create pull requests.
- Get code reviewed before merging.

## 11. Development Methodology

Follow this development cycle:

1. Requirement analysis.
2. Task assignment.
3. Technical planning.
4. Implementation.
5. Code review.
6. Testing.
7. Integration.
8. Documentation.
9. Progress tracking.

A feature is complete only when it is integrated, tested, reviewed and documented.

## 12. Instructions for AI Coding Agents

You are assisting in the development of CivicX.

Before making changes:

- Read PROJECT_CONTEXT.md.
- Understand the existing repository structure.
- Inspect existing code before modifying it.
- Identify dependencies and possible conflicts.
- Explain the implementation plan.

During development:

- Work only on the requested task.
- Use clean and modular code.
- Follow existing naming conventions.
- Avoid unnecessary dependencies.
- Do not overwrite existing working functionality.
- Maintain security and validation standards.

After development:

- Explain all files created or modified.
- Explain how to run the implementation.
- Execute relevant tests.
- Report test results honestly.
- Mention known issues and limitations.
- Update relevant documentation.

IMPORTANT:

Do not start implementing the entire application immediately.

Wait for specific development instructions from the project lead.

Always prioritize a reliable, secure and testable application over generating large amounts of code.