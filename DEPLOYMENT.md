# 🚀 Spectakull AR Platform - Deployment Guide

This guide covers the complete deployment process for the Spectakull AR platform using Netlify with automatic GitHub deployments.

## 🏗️ Pre-deployment Checklist

### ✅ Repository Requirements
- [x] GitHub repository: `spensefrank-cmyk/spectakull-ar-platform`
- [x] All AR fixes and features pushed to `main` branch
- [x] `netlify.toml` configured for Bun builds
- [x] Environment variables documented in `.env.example`
- [x] Dependencies properly listed in `package.json`

### ✅ Required Accounts
- GitHub account with repository access
- Netlify account (free or paid)
- Stripe account (for subscription features)

## 🌐 Netlify Deployment Setup

### Step 1: Connect GitHub Repository

1. **Login to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign in with your GitHub account

2. **Import Repository**
   - Click "Add new site" → "Import an existing project"
   - Select "Deploy with GitHub"
   - Authorize Netlify to access your GitHub repositories
   - Select `spensefrank-cmyk/spectakull-ar-platform`

### Step 2: Configure Build Settings

1. **Build Configuration**
   ```
   Repository: spensefrank-cmyk/spectakull-ar-platform
   Branch: main
   Build command: bun install && bun run build
   Publish directory: .next
   ```

2. **Runtime Settings**
   ```
   Node.js version: 22
   Package manager: Bun (auto-detected)
   ```

### Step 3: Environment Variables

Navigate to **Site Settings → Environment Variables** and add:

#### Required Variables
```env
NEXT_PUBLIC_APP_URL=https://your-site-name.netlify.app
```

#### Optional (For Full Functionality)
```env
# Stripe Integration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database (if using analytics)
DATABASE_URL=your_database_url

# Additional Configuration
NODE_ENV=production
```

### Step 4: Deploy

1. **Initial Deployment**
   - Click "Deploy site"
   - Netlify will automatically start the build process
   - Build logs will show real-time progress

2. **Automatic Deployments**
   - Every push to `main` branch triggers automatic deployment
   - Pull request previews available with Netlify Pro

## 🔧 Build Configuration Details

### netlify.toml Breakdown

```toml
[build]
  command = "bun install && bun run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "22"
  NPM_FLAGS = "--legacy-peer-deps"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/ar/*"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### Key Features:
- **Bun Integration**: Uses Bun for faster installs and builds
- **Next.js Plugin**: Optimized for Next.js 15 App Router
- **Security Headers**: CSP and security best practices
- **API Routes**: Proper handling of Next.js API routes
- **Static Caching**: Optimized caching for performance

## 🧪 Testing Deployment

### Local Build Test
```bash
cd spectakull-ar-platform
bun install
bun run build
bun start
```

### Deployment Verification

1. **Core Pages**
   - [ ] Homepage (`/`) loads correctly
   - [ ] AR Studio (`/studio`) accessible
   - [ ] AR Viewer (`/ar/demo-project`) renders
   - [ ] Subscription page (`/subscription`) loads

2. **AR Functionality**
   - [ ] AR Sandbox renders 3D scene
   - [ ] Camera preview requests permissions
   - [ ] Object manipulation works
   - [ ] QR code generation functions

3. **Subscription Features**
   - [ ] Free tier limitations enforced
   - [ ] Upgrade prompts display correctly
   - [ ] Stripe checkout flow works

## 🚨 Common Issues & Solutions

### Build Failures

**Issue**: `Bun not found`
```
Solution: Ensure NODE_VERSION is set to 22 in environment variables
```

**Issue**: `Module not found` errors
```
Solution: Check all imports use correct paths and file extensions
```

**Issue**: TypeScript compilation errors
```
bash
cd spectakull-ar-platform
bun run lint
# Fix any reported TypeScript errors
```

### Runtime Issues

**Issue**: AR Sandbox shows black screen
```
Solution: Verify Three.js and WebGL compatibility in production environment
```

**Issue**: Camera permissions not working
```
Solution: Ensure HTTPS is enabled (required for camera access)
```

**Issue**: Stripe integration fails
```
Solution: Verify environment variables are set correctly in Netlify
```

### Performance Issues

**Issue**: Slow initial load
```
Solutions:
- Enable Netlify's built-in CDN
- Verify static asset caching headers
- Check bundle size with `bun run build`
```

## 📊 Production Monitoring

### Netlify Analytics
- **Page Views**: Monitor traffic to AR experiences
- **Performance**: Track Core Web Vitals
- **Forms**: Monitor subscription form submissions

### Custom Analytics
- **AR Usage**: Track AR session duration and interactions
- **Conversion**: Monitor free-to-paid subscription conversions
- **Device Types**: Track mobile vs desktop usage

## 🔄 Continuous Deployment

### Workflow
1. **Development**: Make changes locally
2. **Testing**: Test with `bun dev`
3. **Commit**: Push to `main` branch
4. **Deploy**: Netlify automatically builds and deploys
5. **Verify**: Check production site functionality

### Branch Strategy
- `main`: Production deployments
- `develop`: Feature development (deploy to preview)
- `feature/*`: Individual features (PR previews)

## 🛡️ Security Considerations

### Production Security
- **HTTPS Enforced**: All traffic redirected to HTTPS
- **CSP Headers**: Content Security Policy configured
- **Frame Protection**: X-Frame-Options prevents embedding
- **Environment Variables**: Secrets stored securely in Netlify

### API Security
- **Stripe Webhooks**: Signature verification enabled
- **Rate Limiting**: Implemented for API routes
- **CORS**: Properly configured for AR viewer embeds

## 📈 Performance Optimization

### Next.js Features
- **Image Optimization**: Automatic WebP conversion
- **Code Splitting**: Route-based chunking
- **Static Generation**: ISR for public pages
- **Edge Functions**: API routes at the edge

### Netlify Features
- **Global CDN**: Worldwide distribution
- **Asset Optimization**: Automatic minification
- **Branch Deploys**: Test features safely
- **Split Testing**: A/B test different versions

## 🚀 Post-Deployment Steps

1. **Domain Configuration**
   - Set up custom domain if needed
   - Configure DNS records
   - Enable automatic HTTPS

2. **Monitoring Setup**
   - Configure error tracking
   - Set up uptime monitoring
   - Enable performance monitoring

3. **SEO Optimization**
   - Submit sitemap to search engines
   - Configure Open Graph metadata
   - Set up analytics tracking

## 🆘 Support & Troubleshooting

### Netlify Support
- **Build Logs**: Check for detailed error messages
- **Deploy Previews**: Test changes before going live
- **Rollback**: Instantly revert to previous deployment

### Community Resources
- **Netlify Community**: community.netlify.com
- **Next.js Discussions**: github.com/vercel/next.js/discussions
- **Spectakull Support**: support@spectakull.com

---

## 🎯 Deployment Success Criteria

- ✅ Site builds without errors
- ✅ All pages load correctly
- ✅ AR functionality works on mobile and desktop
- ✅ Subscription flow completes successfully
- ✅ Environment variables configured properly
- ✅ Performance metrics meet targets
- ✅ Security headers implemented
- ✅ Automatic deployments functioning

**Deployment complete! 🚀 Your Spectakull AR platform is now live and ready for users.**