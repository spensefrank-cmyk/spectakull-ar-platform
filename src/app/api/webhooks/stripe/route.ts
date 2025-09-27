import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Next.js App Router configuration - ensure server-side only
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  // Get runtime environment variables - only access at runtime to prevent bundling
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_demo_key';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret';

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2025-08-27.basil',
  });

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    if (!sig || !webhookSecret) {
      console.error('❌ Missing Stripe signature or webhook secret');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log('✅ Webhook signature verified:', event.type);

  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription, stripe);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, stripe);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object as Stripe.Subscription, stripe);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice, stripe);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice, stripe);
        break;

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object as Stripe.Subscription, stripe);
        break;

      default:
        console.log(`🔔 Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('❌ Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription, stripe: Stripe) {
  console.log('🎉 New subscription created:', subscription.id);

  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price.id;

  // Determine tier from price ID
  const tier = getTierFromPriceId(priceId);

  try {
    // In production, update your database here
    // For now, we'll log the subscription details
    console.log('📋 Subscription Details:', {
      subscriptionId: subscription.id,
      customerId,
      tier,
      status: subscription.status,
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000)
    });

    // Update user subscription in your database
    await updateUserSubscription(customerId, {
      subscriptionId: subscription.id,
      tier,
      status: subscription.status,
      currentPeriodEnd: (subscription as any).current_period_end || 0,
      isActive: subscription.status === 'active'
    });

    // Send welcome email (implement this based on your email service)
    await sendWelcomeEmail(customerId, tier);

  } catch (error) {
    console.error('❌ Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, stripe: Stripe) {
  console.log('🔄 Subscription updated:', subscription.id);

  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price.id;
  const tier = getTierFromPriceId(priceId);

  try {
    await updateUserSubscription(customerId, {
      subscriptionId: subscription.id,
      tier,
      status: subscription.status,
      currentPeriodEnd: (subscription as any).current_period_end || 0,
      isActive: subscription.status === 'active'
    });

    console.log('✅ User subscription updated successfully');

  } catch (error) {
    console.error('❌ Error handling subscription updated:', error);
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription, stripe: Stripe) {
  console.log('❌ Subscription canceled:', subscription.id);

  const customerId = subscription.customer as string;

  try {
    await updateUserSubscription(customerId, {
      subscriptionId: subscription.id,
      tier: 'free',
      status: 'canceled',
      currentPeriodEnd: (subscription as any).current_period_end || 0,
      isActive: false
    });

    // Send cancellation email
    await sendCancellationEmail(customerId);

    console.log('✅ User downgraded to free tier');

  } catch (error) {
    console.error('❌ Error handling subscription canceled:', error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice, stripe: Stripe) {
  console.log('💰 Payment succeeded for invoice:', invoice.id);

  const customerId = invoice.customer as string;
  const subscriptionId = (invoice as any).subscription as string;

  try {
    // Get the subscription to update user data
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0]?.price.id;
    const tier = getTierFromPriceId(priceId);

    await updateUserSubscription(customerId, {
      subscriptionId: subscription.id,
      tier,
      status: subscription.status,
      currentPeriodEnd: (subscription as any).current_period_end || 0,
      isActive: true,
      lastPaymentDate: (invoice as any).status_transitions?.paid_at || undefined
    });

    // Send payment confirmation email
    await sendPaymentConfirmationEmail(customerId, invoice.amount_paid / 100);

    console.log('✅ Payment processed and subscription renewed');

  } catch (error) {
    console.error('❌ Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice, stripe: Stripe) {
  console.log('⚠️ Payment failed for invoice:', invoice.id);

  const customerId = invoice.customer as string;

  try {
    // Send payment failure notification
    await sendPaymentFailedEmail(customerId, invoice.amount_due / 100);

    // Log the failed payment for admin review
    console.log('📧 Payment failure email sent to customer');

  } catch (error) {
    console.error('❌ Error handling payment failed:', error);
  }
}

async function handleTrialWillEnd(subscription: Stripe.Subscription, stripe: Stripe) {
  console.log('⏰ Trial ending soon for subscription:', subscription.id);

  const customerId = subscription.customer as string;

  try {
    // Send trial ending notification
    await sendTrialEndingEmail(customerId, subscription.trial_end);

    console.log('📧 Trial ending notification sent');

  } catch (error) {
    console.error('❌ Error handling trial will end:', error);
  }
}

// Helper function to determine tier from Stripe price ID
function getTierFromPriceId(priceId: string): 'free' | 'pro' | 'enterprise' {
  // These should match your actual Stripe price IDs
  if (priceId?.includes('pro') || priceId === 'price_1SB7TD06iMUa2XwhrwiTRx2X') {
    return 'pro';
  } else if (priceId?.includes('enterprise') || priceId === 'price_1SB7TD06iMUa2XwhjOekUNW0') {
    return 'enterprise';
  }
  return 'free';
}

// Helper function to update user subscription in your database
async function updateUserSubscription(customerId: string, subscriptionData: {
  subscriptionId: string;
  tier: 'free' | 'pro' | 'enterprise';
  status: string;
  currentPeriodEnd: number;
  isActive: boolean;
  lastPaymentDate?: number;
}) {
  // In production, this would update your actual database
  // For now, we'll store in localStorage (for demo purposes)

  console.log('💾 Updating user subscription:', {
    customerId,
    ...subscriptionData
  });

  // In a real implementation, you would:
  // 1. Find the user by Stripe customer ID
  // 2. Update their subscription tier and status
  // 3. Update their feature access permissions
  // 4. Log the change for audit purposes

  // Example database update:
  /*
  await db.user.update({
    where: { stripeCustomerId: customerId },
    data: {
      subscriptionTier: subscriptionData.tier,
      subscriptionStatus: subscriptionData.status,
      subscriptionId: subscriptionData.subscriptionId,
      currentPeriodEnd: new Date(subscriptionData.currentPeriodEnd * 1000),
      isSubscriptionActive: subscriptionData.isActive,
      lastPaymentDate: subscriptionData.lastPaymentDate
        ? new Date(subscriptionData.lastPaymentDate * 1000)
        : null
    }
  });
  */
}

// Email notification functions (implement with your email service)
async function sendWelcomeEmail(customerId: string, tier: string) {
  console.log(`📧 Welcome email: Customer ${customerId} upgraded to ${tier}`);
  // Implement with your email service (SendGrid, Resend, etc.)
}

async function sendCancellationEmail(customerId: string) {
  console.log(`📧 Cancellation email: Customer ${customerId} subscription canceled`);
  // Implement cancellation email
}

async function sendPaymentConfirmationEmail(customerId: string, amount: number) {
  console.log(`📧 Payment confirmation: Customer ${customerId} paid $${amount}`);
  // Implement payment confirmation email
}

async function sendPaymentFailedEmail(customerId: string, amount: number) {
  console.log(`📧 Payment failed: Customer ${customerId} failed to pay $${amount}`);
  // Implement payment failure email
}

async function sendTrialEndingEmail(customerId: string, trialEnd: number | null) {
  const endDate = trialEnd ? new Date(trialEnd * 1000) : null;
  console.log(`📧 Trial ending: Customer ${customerId} trial ends ${endDate}`);
  // Implement trial ending email
}

export async function GET() {
  return NextResponse.json({
    status: 'Stripe webhooks endpoint ready',
    supportedEvents: [
      'customer.subscription.created',
      'customer.subscription.updated',
      'customer.subscription.deleted',
      'invoice.payment_succeeded',
      'invoice.payment_failed',
      'customer.subscription.trial_will_end'
    ]
  });
}
