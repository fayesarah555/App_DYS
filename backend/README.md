# Upload API backend

Routes:
- POST /upload (champ fichier: `file`) -> place dans S3 suivant le type (audio/pdf/image/video).
- GET /health -> statut.

Config (.env):
AWS_REGION=eu-west-1
S3_BUCKET=projetbigdata0
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
PORT=4000
FRONTEND_ORIGIN=http://localhost:3000

Démarrer:
1) cd backend
2) npm install
3) npm run start
