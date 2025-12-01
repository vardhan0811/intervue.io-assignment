# Backend - Live Polling System

Express.js server with Socket.io for real-time polling functionality.

## Setup

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Running

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

- `GET /` - API information
- `GET /health` - Health check

## Socket.io Events

See main README for complete event documentation.

## Deployment

1. Set environment variables on your hosting platform
2. Run `npm install`
3. Start with `npm start`

Recommended platforms:
- Render
- Railway
- Heroku
- DigitalOcean App Platform
