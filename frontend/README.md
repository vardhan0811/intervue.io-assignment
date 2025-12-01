# Frontend - Live Polling System

React application with Redux and Socket.io for real-time polling.

## Setup

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```
VITE_BACKEND_URL=http://localhost:5000
```

## Running

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Main application pages
- `src/store/` - Redux store and slices
- `src/services/` - Socket.io client service
- `src/styles/` - Global CSS styles

## Design System

The application uses a custom design system based on the Figma specifications:

- **Primary Color:** #6C5CE7 (Purple)
- **Font:** Inter
- **Spacing:** 4px base unit
- **Border Radius:** 8px, 12px, 16px
- **Shadows:** Light, Medium, Heavy

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variable:
   ```
   VITE_BACKEND_URL=https://your-backend-url.com
   ```

3. Deploy the `dist` folder to:
   - Vercel
   - Netlify
   - GitHub Pages
   - Any static hosting service

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
