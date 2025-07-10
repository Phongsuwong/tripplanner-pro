# Environment Variables Guide

This document explains how environment variables are implemented and used in the TravelEase application.

## Available Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key for maps and location services | Yes |

## Local Development

For local development:

1. Create a `.env` file in the project root
2. Add your environment variables to the file:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```
3. The `.env` file is already in `.gitignore` to prevent accidental commits

## How Environment Variables Work

This project uses:

1. Vite's built-in environment variable system (prefixed with `VITE_`)
2. A centralized environment handler (`src/lib/env-handler.ts`) 
3. Type definitions for environment variables (`src/env.d.ts`)

### Environment Handler

The environment handler in `src/lib/env-handler.ts` provides:

- Centralized access to environment variables
- Default values when appropriate
- Type safety through TypeScript
- Validation to catch missing variables early

### Usage Examples

Import and use the environment handler:

```typescript
// Import the environment handler
import { env } from './lib/env-handler';

// Access environment variables
const apiKey = env.googleMapsApiKey;

// Use validation in components
import { validateEnv } from './lib/env-handler';

useEffect(() => {
  const isValid = validateEnv();
  if (!isValid) {
    // Handle missing environment variables
  }
}, []);
```

## Production Deployment

For GitHub Pages deployment:

1. Add required secrets to your GitHub repository:
   - Go to repository Settings > Secrets and variables > Actions
   - Add `VITE_GOOGLE_MAPS_API_KEY` with your Google Maps API key

2. The GitHub Actions workflow will automatically use these secrets during the build process.

## Troubleshooting

If you encounter issues with environment variables:

1. Check that your `.env` file exists and has the correct format
2. Ensure variables are prefixed with `VITE_` for Vite to expose them
3. Restart your development server after changing environment variables
4. For production, verify your GitHub repository secrets are correctly set

## Security Considerations

- Never commit API keys or sensitive values to your repository
- Always use environment variables for sensitive data
- Limit the scope and permissions of API keys when possible
- Regularly rotate API keys, especially if you suspect they've been compromised