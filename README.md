# VoteGuide

VoteGuide is an interactive web assistant that helps citizens understand the election process, timelines, and steps.

## Chosen Vertical
**Civic Engagement / Citizen Services.**
Persona: A first-time or infrequent voter who needs clear, jurisdiction-aware guidance.

## Approach
Our approach is to create a secure, accessible, and fast web application. We use a lightweight React frontend powered by Vite and Zustand for state management. To keep API keys secure, we use a Node.js Express backend as a thin proxy, ensuring no sensitive information is exposed to the client. The application integrates deeply with Google Services (Gemini for conversational AI, Maps for polling locations, Translate for i18n, and Calendar for deadlines) to provide a rich user experience. Accessibility is treated as a first-class citizen, targeting a WCAG 2.1 AA compliance and a Lighthouse score of 95+.

## Architecture Diagram

```
+-------------------------------------------------------------+
|                       VoteGuide Client                      |
| (React, Vite, Tailwind CSS, Zustand, Accessible UI/UX)      |
+------------------------------+------------------------------+
                               |
                        [REST API /chat]
                               |
+------------------------------v------------------------------+
|                       VoteGuide Server                      |
|         (Node.js, Express, Rate Limiter, Helmet)            |
|   - Thin Proxy to hide API keys                             |
|   - Input Validation & Sanitization                         |
+-----+-------------------+-------------------+---------------+
      |                   |                   |               
+-----v-----+       +-----v-----+       +-----v-----+         
| Google    |       | Google    |       | Google    |         
| Gemini    |       | Maps API  |       | Translate | ...     
| API       |       |           |       | API       |         
+-----------+       +-----------+       +-----------+         

Deployment: Firebase Hosting (Client) & Cloud Run / Functions (Server)
Database: Firestore (for FAQ Knowledge Base)
```

## Setup Steps
1. **Clone the repository.**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` in the root (or `server` folder) and fill in your Google API keys.
4. **Start Development Servers:**
   ```bash
   npm run dev
   ```
   This will start both the client and server concurrently using npm workspaces.
5. **Access the Application:**
   Client: `http://localhost:5173`
   Server: `http://localhost:3001`

## Assumptions
- The application will be deployed on a platform that supports Node.js (e.g., Google Cloud Run for backend) and static hosting (e.g., Firebase Hosting for frontend).
- The Gemini API will be used for reasoning and answering questions based on an injected system prompt containing election knowledge.
- The UI will be designed mobile-first and fully responsive.
- All Google APIs are enabled in the Google Cloud Console and proper quota/billing is set up.