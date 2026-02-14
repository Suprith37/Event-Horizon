# Backend for New-event-project

Requirements:
- Node 18+ (or compatible)
- MongoDB running locally or accessible via `MONGO_URI`

Quick start:

1. Install dependencies

```
npm install
```

2. Copy `.env.example` to `.env` and update values

3. Run in development

```
npm run dev
```

API endpoints:
- `GET /api/events` - list events
- `POST /api/events` - create event (protected)
- `POST /api/registrations` - create registration
- `GET /api/registrations` - list registrations
- `GET /api/registrations/verify/:ticketId` - verify ticket
- `POST /api/auth/register` - user register
- `POST /api/auth/login` - user login