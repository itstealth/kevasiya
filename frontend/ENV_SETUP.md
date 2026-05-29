# Environment Setup Required

## Important: Environment Variable Configuration

Since `.env.local` is in your `.gitignore`, you need to manually create or update it.

### Create/Update `.env.local` file in your project root:

```env
# Strapi API Configuration
NEXT_PUBLIC_STRAPI_API_URL=http://57.128.189.225:1337
```

### Steps:

1. Create `.env.local` file in the root directory if it doesn't exist
2. Add the line above to the file
3. Save the file
4. Restart your Next.js development server

```bash
# Stop your current dev server (Ctrl+C)
# Then restart it
pnpm dev
```

### Verification

After setting up the environment variable:

1. Navigate to http://localhost:3000/blog
2. You should see blog posts loaded from Strapi
3. Click on a post to verify the content renders correctly

### Troubleshooting

If posts don't load:
- Check the console for error messages
- Verify the Strapi API is accessible at http://57.128.189.225:1337
- Make sure the environment variable name is exact: `NEXT_PUBLIC_STRAPI_API_URL`
- Restart your development server after adding the env var

### Production Deployment

For production deployment, add the environment variable to your hosting platform:

**Vercel:**
1. Go to Project Settings → Environment Variables
2. Add: `NEXT_PUBLIC_STRAPI_API_URL` = `http://57.128.189.225:1337`
3. Redeploy

**Netlify:**
1. Go to Site Settings → Environment Variables
2. Add the variable
3. Redeploy

**Other platforms:**
Follow their specific instructions for adding environment variables.

