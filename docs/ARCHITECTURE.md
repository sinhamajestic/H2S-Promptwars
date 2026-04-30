# Architecture

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
