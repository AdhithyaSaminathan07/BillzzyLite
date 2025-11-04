# Netlify Deployment Guide for Billzzy Lite

This guide explains how to deploy the Billzzy Lite application to Netlify with proper configuration for authentication to work correctly.

## Environment Variables

When deploying to Netlify, you must set the following environment variables in your Netlify project settings:

1. **NEXT_PUBLIC_BASE_URL** - Set this to your Netlify site URL (e.g., `https://your-site-name.netlify.app`)
2. **NEXTAUTH_URL** - Set this to your Netlify site URL + `/api/auth` (e.g., `https://your-site-name.netlify.app/api/auth`)
3. **NEXTAUTH_SECRET** - A random string used to hash tokens and sessions (generate with `openssl rand -base64 32`)
4. **GOOGLE_CLIENT_ID** - Your Google OAuth client ID
5. **GOOGLE_CLIENT_SECRET** - Your Google OAuth client secret
6. **MONGODB_URI** - Your MongoDB connection string
7. **ADMIN_EMAIL** - The admin email for master admin access
8. **ADMIN_PASSWORD** - The admin password for master admin access

## Netlify Configuration

### Build Settings
- **Build command**: `next build`
- **Publish directory**: `.next/standalone` (if using standalone mode) or `out` (if using static export)
- **Functions directory**: `.netlify/functions` (if using Netlify functions)

### Environment Variables Setup
1. Go to your Netlify site dashboard
2. Navigate to "Site settings" > "Build & deploy" > "Environment"
3. Add the environment variables listed above

## Important Notes

1. **Authentication Redirects**: The application is configured to work with Netlify's URL structure. The `NEXTAUTH_URL` and `NEXT_PUBLIC_BASE_URL` variables are crucial for proper Google authentication redirects.

2. **API Routes**: All API routes should work correctly with the updated configuration.

3. **Static Assets**: All images and static assets in the `public` directory will be served correctly.

## Troubleshooting

If you encounter issues with Google login redirecting to localhost:

1. Verify that `NEXTAUTH_URL` is set to your Netlify site URL
2. Check that `NEXT_PUBLIC_BASE_URL` is set correctly
3. Ensure your Google OAuth client is configured with the correct redirect URIs:
   - `https://your-site-name.netlify.app/api/auth/callback/google`

## Example Environment Configuration

```
NEXT_PUBLIC_BASE_URL=https://your-site-name.netlify.app
NEXTAUTH_URL=https://your-site-name.netlify.app/api/auth
NEXTAUTH_SECRET=your-random-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MONGODB_URI=your-mongodb-connection-string
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-admin-password
```