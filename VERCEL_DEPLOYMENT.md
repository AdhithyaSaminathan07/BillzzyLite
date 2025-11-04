# Vercel Deployment Guide for Billzzy Lite

This guide explains how to deploy the Billzzy Lite application to Vercel with proper configuration for authentication to work correctly.

## Environment Variables

When deploying to Vercel, you must set the following environment variables in your Vercel project settings:

1. **NEXTAUTH_URL** - Set this to your Vercel site URL + `/api/auth` (e.g., `https://your-site-name.vercel.app/api/auth`)
2. **NEXTAUTH_SECRET** - A random string used to hash tokens and sessions (generate with `openssl rand -base64 32`)
3. **GOOGLE_CLIENT_ID** - Your Google OAuth client ID
4. **GOOGLE_CLIENT_SECRET** - Your Google OAuth client secret
5. **MONGODB_URI** - Your MongoDB connection string
6. **ADMIN_EMAIL** - The admin email for master admin access
7. **ADMIN_PASSWORD** - The admin password for master admin access

## Vercel Configuration

### Build Settings
- **Build Command**: `next build`
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### Environment Variables Setup
1. Go to your Vercel project dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add the environment variables listed above

## Important Notes

1. **Authentication Redirects**: The application is configured to work with Vercel's URL structure. The `NEXTAUTH_URL` variable is crucial for proper Google authentication redirects.

2. **API Routes**: All API routes should work correctly with the updated configuration.

3. **Static Assets**: All images and static assets in the `public` directory will be served correctly.

## Troubleshooting

If you encounter issues with Google login redirecting to localhost:

1. Verify that `NEXTAUTH_URL` is set to your Vercel site URL
2. Check that your Google OAuth client is configured with the correct redirect URIs:
   - `https://your-site-name.vercel.app/api/auth/callback/google`

## Example Environment Configuration

```
NEXTAUTH_URL=https://your-site-name.vercel.app/api/auth
NEXTAUTH_SECRET=your-random-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MONGODB_URI=your-mongodb-connection-string
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-admin-password
```