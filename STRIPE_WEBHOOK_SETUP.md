# Stripe Webhook Setup Guide

This guide will help you set up Stripe webhooks for automated subscription management in your Spectakull AR platform.

## 🎯 What Webhooks Do

Webhooks automatically handle:
- ✅ **New subscriptions** - Automatically upgrade users when they subscribe
- ✅ **Subscription updates** - Handle plan changes and upgrades
- ✅ **Payment renewals** - Keep subscriptions active when payments succeed
- ✅ **Payment failures** - Handle failed payments and notify users
- ✅ **Cancellations** - Downgrade users when they cancel
- ✅ **Trial endings** - Notify users when trials are about to end

## 📋 Step-by-Step Setup

### Step 1: Get Your Webhook Endpoint URL

Your webhook endpoint is:
```
https://spectakull.com/api/webhooks/stripe
```

### Step 2: Create Webhook in Stripe Dashboard

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/
2. **Navigate to Webhooks**:
   - Click "Developers" in left sidebar
   - Click "Webhooks"
3. **Add Endpoint**:
   - Click "Add endpoint"
   - Endpoint URL: `https://spectakull.com/api/webhooks/stripe`
   - Description: "Spectakull Subscription Management"

### Step 3: Select Events to Listen For

Add these events (required for full automation):

**Subscription Events:**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

**Payment Events:**
- `invoice.payment_succeeded`
- `invoice.payment_failed`

**Trial Events:**
- `customer.subscription.trial_will_end`

### Step 4: Get Your Webhook Secret

1. After creating the webhook, click on it
2. In the "Signing secret" section, click "Reveal"
3. Copy the webhook secret (starts with `whsec_`)

### Step 5: Add Webhook Secret to Environment

Add to your `.env.local` file:
```env
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here
```

### Step 6: Test Your Webhook

1. **Send Test Event**:
   - In Stripe Dashboard webhook page
   - Click "Send test webhook"
   - Select `customer.subscription.created`
   - Click "Send test webhook"

2. **Check Logs**:
   - Watch your server logs for webhook events
   - Should see: `✅ Webhook signature verified: customer.subscription.created`

## 🔧 Webhook Events Handled

### `customer.subscription.created`
- **Triggers**: When a user completes payment for a new subscription
- **Action**: Upgrades user to Pro/Enterprise tier immediately
- **Email**: Sends welcome email with feature overview

### `customer.subscription.updated`
- **Triggers**: When user changes plans or subscription is modified
- **Action**: Updates user's tier and feature access
- **Email**: Sends plan change confirmation

### `customer.subscription.deleted`
- **Triggers**: When user cancels subscription
- **Action**: Downgrades user to free tier at end of billing period
- **Email**: Sends cancellation confirmation with reactivation link

### `invoice.payment_succeeded`
- **Triggers**: When monthly/yearly payment succeeds
- **Action**: Extends subscription period, keeps features active
- **Email**: Sends payment receipt

### `invoice.payment_failed`
- **Triggers**: When payment fails (expired card, insufficient funds)
- **Action**: Notifies user, starts retry cycle
- **Email**: Sends payment failure notice with update link

### `customer.subscription.trial_will_end`
- **Triggers**: 3 days before trial ends
- **Action**: Reminds user to add payment method
- **Email**: Sends trial ending reminder

## 🧪 Testing Webhooks Locally

For local development:

1. **Install Stripe CLI**:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Other systems: https://stripe.com/docs/stripe-cli
   ```

2. **Login to Stripe**:
   ```bash
   stripe login
   ```

3. **Forward webhooks to localhost**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Get webhook secret** from CLI output and add to `.env.local`

5. **Trigger test events**:
   ```bash
   stripe trigger customer.subscription.created
   stripe trigger invoice.payment_succeeded
   ```

## 🔍 Troubleshooting

### Webhook Not Receiving Events
- ✅ Check endpoint URL is correct
- ✅ Verify webhook secret in environment
- ✅ Check if events are selected in Stripe dashboard
- ✅ Ensure HTTPS (required for production)

### Signature Verification Failed
- ✅ Webhook secret is wrong - get fresh one from Stripe
- ✅ Raw body required - Next.js handles this automatically
- ✅ Headers case-sensitive - use exact `stripe-signature`

### Events Not Processing
- ✅ Check server logs for errors
- ✅ Database connection issues
- ✅ Email service configuration
- ✅ User lookup by customer ID

## 📊 Monitoring Webhooks

In Stripe Dashboard:
1. Go to **Webhooks** → Your endpoint
2. Check **Recent deliveries**
3. View response codes:
   - `200` = Success ✅
   - `400` = Bad request ❌
   - `500` = Server error ❌

## 🚀 Production Deployment

### Required Environment Variables:
```env
STRIPE_SECRET_KEY=sk_live_your_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
```

### Security Checklist:
- ✅ Use HTTPS endpoint URL
- ✅ Verify webhook signatures
- ✅ Store secrets securely
- ✅ Rate limit webhook endpoint
- ✅ Log webhook events for debugging
- ✅ Handle idempotency (same event twice)

## 📧 Email Integration

Update these functions in `/api/webhooks/stripe/route.ts` with your email service:

```typescript
// Example with SendGrid
import sgMail from '@sendgrid/mail';

async function sendWelcomeEmail(customerId: string, tier: string) {
  const user = await getUserByCustomerId(customerId);

  const msg = {
    to: user.email,
    from: 'hello@spectakull.com',
    subject: `Welcome to Spectakull ${tier.charAt(0).toUpperCase() + tier.slice(1)}!`,
    html: `<h1>Welcome to ${tier} plan!</h1><p>You now have access to all ${tier} features...</p>`
  };

  await sgMail.send(msg);
}
```

## 🎉 You're All Set!

Your Stripe webhooks are now configured for:
- ✅ Automatic subscription management
- ✅ Real-time user upgrades/downgrades
- ✅ Payment processing automation
- ✅ Customer email notifications
- ✅ Failed payment handling

Users can now subscribe and their accounts will be automatically managed! 🚀
