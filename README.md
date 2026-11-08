# AZHY Fashion Studio

A bilingual (English/Arabic) fashion concept studio built with React, Vite, Three.js and Express.

## Requirements
- Node.js 18.18+ (Node 20 LTS recommended)
- npm

## Run the app
1. Extract this ZIP.
2. Open the extracted `azhy-fashion-studio-ready` folder in VS Code.
3. Open Terminal in that folder.
4. Run `npm install`
5. Run `npm run dev`
6. Open the local URL printed by Vite (usually http://localhost:5173).

The 3D preview, garment selection, color palette, fabric/size selection, artwork upload, design saving, collection, bag and bilingual interface work in the browser. Saved designs and bag are stored in that browser's localStorage.

## Optional API server
In a second terminal run `npm run server`. The API starts at http://localhost:4000 and exposes:
- GET /api/health
- GET/POST /api/designs
- DELETE /api/designs/:id
- GET/POST /api/orders

The current UI uses local browser storage for its interactive demo. The Express API is provided as a starter backend and can be connected to the UI in a next development step.

## Important production notes
This is a runnable, functional starter—not a deployed global commerce platform. Before accepting real customers or payments, add a managed database, secure authentication, cloud image storage, payment provider integration, email notifications, shipping/tax rules, admin permissions, backups, privacy/terms pages, security review and production hosting. Checkout is intentionally demo-only and does not charge money. The 3D garment shapes are concept previews, not manufacturing-grade patterns or fabric simulation.

## GitHub
Create a new GitHub repository, then upload the extracted project files or use:
`git init`
`git add .`
`git commit -m "Initial AZHY Fashion Studio"`
`git branch -M main`
`git remote add origin YOUR_REPOSITORY_URL`
`git push -u origin main`
