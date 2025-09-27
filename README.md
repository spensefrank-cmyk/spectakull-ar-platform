# 🎯 Spectakull AR Platform

A comprehensive AR creation platform that allows users to build, share, and analyze AR experiences with unique QR code tracking and advanced analytics.

## 🚀 New Features

### Advanced Subscription System
- **Free Tier**: Create 3 AR projects (no QR code generation or publishing)
- **Business Card Creator**: $19.99 one-time payment for 1 business card project + $10 per additional project
- **AR Studio Pro**: $39.99/month for 7 projects with full QR code capabilities
- **Enterprise**: $199/month for 50 projects with team management
- **White Label**: $499/month for 200 projects with complete customization

### Unique QR Code Analytics System
- Each project gets a **unique QR code with tracking**
- Real-time analytics dashboard with:
  - Total scans and daily/hourly breakdowns
  - Geographic tracking and user engagement
  - Export capabilities for data analysis
- **Project deletion warnings** to prevent accidental loss of QR analytics

### Enhanced AR Studio
- Advanced AR editing tools with real-time positioning
- Live AR preview with Three.js optimization
- Mobile-responsive AR sandbox
- Private user media library with multi-format support
- Admin access with password authentication

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **AR**: Three.js, WebXR, KitCore WebAR
- **Payments**: Stripe integration with flexible pricing
- **Analytics**: Real-time QR code scan tracking
- **Package Manager**: Bun (faster than npm/yarn)

## 📊 Subscription Details

### Business Card Creator ($19.99)
- 1 AR business card project
- Unique QR code with analytics
- Publishing & sharing capabilities
- Additional projects: $10 each

### AR Studio Free
- 3 AR projects (creation only)
- Live AR preview
- **No QR code generation or publishing**

### AR Studio Pro ($39.99/month)
- 7 AR projects
- All projects get unique QR codes
- Advanced analytics dashboard
- Collaboration tools
- Priority support

### Enterprise & White Label
- Unlimited projects (50-200 depending on tier)
- Team management capabilities
- Custom branding options
- API access and integrations

## 🎯 QR Code Analytics Features

Every QR code generated includes:
- **Unique tracking ID** per project
- **Real-time scan analytics**:
  - Time of day analysis
  - Daily/weekly trends
  - Total interaction counts
- **Private analytics dashboard** for subscribers
- **Data export capabilities** (CSV format)
- **Project deletion warnings** to prevent data loss

## 🔧 Environment Variables

```env
# Required for Stripe payments
STRIPE_SECRET_KEY=sk_live_... # or sk_test_... for testing
STRIPE_WEBHOOK_SECRET=whsec_...

# Required for proper URL generation
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional: Analytics tracking
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env.local`
   - Add your Stripe keys and app URL

3. **Run development server**:
   ```bash
   bun dev
   ```

4. **Visit the application**:
   - Open [http://localhost:3000](http://localhost:3000)
   - Try the Business Card AR creator
   - Explore the AR Studio

## 📱 Key Features

### AR Business Card Creator
- Upload images, videos, and 3D models
- Advanced AR positioning controls
- Unique QR code generation with analytics
- Real-time preview and sharing
- Admin access bypass with password

### AR Studio
- Create complex AR experiences
- 3D object library and positioning tools
- Animation and physics controls
- Team collaboration (Pro+ plans)
- Analytics dashboard for all projects

### Analytics Dashboard
- View scan data across all projects
- Export analytics data for external analysis
- Track user engagement patterns
- Monitor QR code performance

## 💡 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── business-card-ar/   # Business card creator
│   ├── studio/             # AR Studio interface
│   ├── subscription/       # Pricing and checkout
│   └── api/                # API routes (Stripe, webhooks)
├── components/             # Reusable UI components
│   ├── QRAnalyticsDashboard.tsx
│   ├── QRCodeCreator.tsx
│   ├── ProjectDeletionWarning.tsx
│   └── ARSandbox.tsx
├── contexts/               # React context providers
│   ├── SubscriptionContext.tsx
│   ├── AnalyticsContext.tsx
│   └── AuthContext.tsx
└── lib/                    # Utility functions
```

## 🔐 Admin Features

### Admin Access
- Password: `specktacull2024!`
- Bypasses subscription requirements
- Access to all premium features
- Analytics tracking for admin usage

### Project Management
- Project deletion with comprehensive warnings
- QR code analytics preservation
- Subscription tier management
- User access control

## 🌟 Monetization Features

### Flexible Pricing
- One-time payments for business cards
- Monthly subscriptions for AR Studio
- Pay-per-additional-project model
- Enterprise licensing options

### Analytics Upselling
- Free users see what they're missing
- Clear upgrade paths to access QR features
- Analytics previews to encourage upgrades

## 📈 Analytics & Tracking

### QR Code Analytics
```typescript
interface ProjectAnalytics {
  projectId: string;
  qrCodeId?: string;
  totalScans: number;
  dailyScans: { date: string; count: number }[];
  hourlyBreakdown: { hour: number; count: number }[];
  lastScanAt?: string;
  createdAt: string;
}
```

### Tracking Implementation
- Automatic scan detection on QR code usage
- Real-time dashboard updates
- Export functionality for business intelligence
- Privacy-compliant analytics collection

## 🔒 Security Features

- Subscription-based access control
- Admin authentication system
- Project-level permissions
- Secure payment processing with Stripe
- Environment-based configuration

## 🌐 Deployment

### Netlify Deployment
1. Connect your GitHub repository
2. Set environment variables in Netlify dashboard
3. Deploy automatically on git push
4. Configure custom domain if needed

### Required Netlify Environment Variables
```
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
```

## 📞 Support

For technical support or enterprise inquiries:
- Email: support@spectakull.com
- Documentation: [docs.spectakull.com](https://docs.spectakull.com)
- Enterprise: enterprise@spectakull.com

## 🎉 What's New in This Version

- ✅ Complete subscription system overhaul
- ✅ Unique QR code generation per project
- ✅ Comprehensive analytics dashboard
- ✅ Project deletion warnings with cost implications
- ✅ Business card creator with additional project purchases
- ✅ Mobile-optimized AR studio
- ✅ Admin access system
- ✅ Real-time analytics tracking
- ✅ Stripe integration with flexible pricing

---

**Built with ❤️ for AR creators and businesses worldwide**
