# Strapi Live Deployment Fix

## Updated Diagnosis

**Both your website and Strapi are running on the same OVH server via PM2.** This changes the troubleshooting approach significantly!

## Problem Analysis

Since both applications are on the same server, the issue is **internal networking**, not external access:

1. **Same Server Access**: Your Next.js app should be able to reach Strapi internally
2. **PM2 Configuration**: Process management and port binding issues
3. **Network Interface**: Strapi may not be listening on the correct interface
4. **Internal Firewall**: Server-level firewall blocking internal requests

## Solutions

### Option 1: Fix Internal Server Communication (Quick Fix)

Since both apps are on the same server, let's fix the internal networking:

**Step 1: Check PM2 Configuration**

1. **Check PM2 status**:
   ```bash
   pm2 list
   pm2 logs strapi-app-name  # Replace with your Strapi PM2 name
   pm2 logs nextjs-app-name  # Replace with your Next.js PM2 name
   ```

2. **Check Strapi server configuration** (`config/server.js`):
   ```javascript
   module.exports = ({ env }) => ({
     host: env('HOST', '0.0.0.0'), // Must listen on all interfaces
     port: env.int('PORT', 1337),
     app: {
       keys: env.array('APP_KEYS'),
     },
   });
   ```

3. **Check if Strapi is actually running on port 1337**:
   ```bash
   # Check what's listening on port 1337
   netstat -tlnp | grep 1337
   # or
   ss -tlnp | grep 1337

   # Test internal API access
   curl http://localhost:1337/api/blogs?populate=*
   curl http://127.0.0.1:1337/api/blogs?populate=*
   ```

**Step 2: Fix Network Interface Issues**

1. **Update Strapi to listen on all interfaces**:
   ```javascript
   // config/server.js
   module.exports = ({ env }) => ({
     host: '0.0.0.0', // Listen on all interfaces, not just localhost
     port: env.int('PORT', 1337),
     // ... rest of config
   });
   ```

2. **Restart Strapi**:
   ```bash
   pm2 restart strapi-app-name
   ```

**Step 3: Test Internal Communication**

1. **From your server terminal**:
   ```bash
   # Test if Next.js can reach Strapi internally
   curl http://localhost:1337/api/blogs?populate=*
   curl http://127.0.0.1:1337/api/blogs?populate=*
   ```

2. **Check PM2 logs for errors**:
   ```bash
   pm2 logs --lines 50
   ```

**Step 4: Update Next.js Configuration**

1. **Update your environment variable** to use `localhost`:
   ```env
   NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
   ```

2. **Update `next.config.ts`** to allow localhost images:
   ```typescript
   {
     protocol: "http",
     hostname: "localhost",
     port: "1337",
     pathname: "/uploads/**",
   }
   ```

**Step 5: Configure CORS (Still Needed)**

Even on the same server, CORS might be required. Update Strapi's CORS configuration:

```javascript
// config/middlewares.js
module.exports = [
  // ... other middlewares
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['http://localhost:3000', 'https://kevasiya.com'],
      credentials: true,
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    }
  },
  // ... rest of middlewares
];
```

### Option 2: Expose Strapi on Public Domain (Alternative)

**Step 1: Configure Strapi for Public Access**

1. **Purchase a domain** for your Strapi server (e.g., `api.kevasiya.com` or `cms.kevasiya.com`)

2. **Configure DNS** to point to your Strapi server's public IP

3. **Update Strapi configuration** (`config/server.js`):
   ```javascript
   module.exports = ({ env }) => ({
     host: env('HOST', '0.0.0.0'), // Listen on all interfaces
     port: env.int('PORT', 1337),
     app: {
       keys: env.array('APP_KEYS'),
     },
     webhooks: {
       populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
     },
   });
   ```

4. **Configure CORS** in Strapi (`config/middlewares.js`):
   ```javascript
   module.exports = [
     'strapi::errors',
     'strapi::security',
     {
       name: 'strapi::cors',
       config: {
         enabled: true,
         origin: ['https://kevasiya.com', 'http://localhost:3000'],
         credentials: true,
         headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
       }
     },
     'strapi::poweredBy',
     'strapi::logger',
     'strapi::query',
     'strapi::body',
     'strapi::session',
     'strapi::favicon',
     'strapi::public',
   ];
   ```

**Step 2: Update Your Next.js Configuration**

1. **Update `.env.local`** (for local development):
   ```env
   NEXT_PUBLIC_STRAPI_API_URL=https://your-strapi-domain.com
   ```

2. **Update production environment** on your hosting platform (Vercel/Netlify/etc.):
   ```env
   NEXT_PUBLIC_STRAPI_API_URL=https://your-strapi-domain.com
   ```

3. **Update `next.config.ts`**:
   ```typescript
   {
     protocol: "https",
     hostname: "your-strapi-domain.com",
     pathname: "/uploads/**",
   }
   ```

### Option 2: Use Cloudflare Tunnel (Quick Fix)

If you want a quick solution without changing domains:

1. **Install Cloudflare Tunnel** on your Strapi server:
   ```bash
   # Install cloudflared
   curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
   sudo dpkg -i cloudflared.deb

   # Authenticate
   cloudflared tunnel login

   # Create tunnel
   cloudflared tunnel create kevasiya-strapi

   # Configure tunnel
   cloudflared tunnel route dns kevasiya-strapi api.kevasiya.com
   ```

2. **Start the tunnel**:
   ```bash
   cloudflared tunnel run kevasiya-strapi
   ```

3. **Update your configuration** to use `https://api.kevasiya.com`

### Option 3: Deploy Strapi to Cloud (Production Ready)

**Recommended for production:**

1. **Deploy Strapi to Railway/Vercel/Heroku**:
   - Railway: `railway login && railway deploy`
   - Heroku: `heroku create your-app-name`
   - DigitalOcean App Platform

2. **Environment Variables for Cloud Deployment**:
   ```env
   DATABASE_URL=your-database-url
   JWT_SECRET=your-jwt-secret
   APP_KEYS=your-app-keys
   NODE_ENV=production
   ```

## Environment Configuration

### For Development (`.env.local`):
```env
NEXT_PUBLIC_STRAPI_API_URL=https://your-strapi-domain.com
```

### For Production (Hosting Platform):
```env
NEXT_PUBLIC_STRAPI_API_URL=https://your-strapi-domain.com
```

## Testing the Fix

1. **Update your environment variable**:
   ```env
   NEXT_PUBLIC_STRAPI_API_URL=https://your-public-strapi-domain.com
   ```

2. **Restart your development server**:
   ```bash
   pnpm dev
   ```

3. **Test locally first**:
   - Visit `http://localhost:3000/blog`
   - Verify posts load correctly

4. **Deploy to production**:
   - Update environment variables on your hosting platform
   - Redeploy your Next.js app
   - Test `https://kevasiya.com/blog`

## Troubleshooting

### If still not working:

1. **Check Network Access**:
   ```bash
   # Test from your live server
   curl https://your-strapi-domain.com/api/blogs?populate=*
   ```

2. **Check CORS**:
   - Ensure Strapi allows requests from `kevasiya.com`
   - Check browser console for CORS errors

3. **Check SSL**:
   - Ensure Strapi is accessible over HTTPS
   - Update Next.js config for the new domain

4. **Check Image Loading**:
   - Images should load from the new public domain
   - Update `next.config.ts` with the new domain

## Security Considerations

1. **HTTPS Only**: Always use HTTPS in production
2. **CORS Configuration**: Only allow trusted domains
3. **API Keys**: Use strong, unique API keys
4. **Database Security**: Secure your database credentials

## Next Steps

1. Choose one of the options above
2. Update your Strapi server configuration
3. Update environment variables in Next.js
4. Test thoroughly before deploying to production
5. Monitor for any issues after deployment

The key is making your Strapi server publicly accessible with proper CORS configuration for kevasiya.com domain.
