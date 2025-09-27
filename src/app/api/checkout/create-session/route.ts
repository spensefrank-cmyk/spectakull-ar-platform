import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Next.js App Router configuration
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Stripe configuration
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000';

// Product and price mapping for the new subscription structure
const PRICING_CONFIG = {
  'business-card': {
    productName: 'Business Card AR Creator',
    priceAmount: 1999, // $19.99 in cents
    currency: 'usd',
    mode: 'payment', // One-time payment
    description: 'Create AR business cards with unique QR codes and analytics'
  },
  'business-card-additional': {
    productName: 'Additional Business Card Project',
    priceAmount: 1000, // $10.00 in cents
    currency: 'usd',
    mode: 'payment', // One-time payment
    description: 'Add one more business card project with unique QR code'
  },
  'pro': {
    productName: 'AR Studio Pro',
    priceAmount: 3999, // $39.99 in cents
    currency: 'usd',
    mode: 'subscription',
    interval: 'month',
    description: '7 AR projects with QR codes and advanced analytics'
  },
  'enterprise': {
    productName: 'Enterprise Plan',
    priceAmount: 19900, // $199.00 in cents
    currency: 'usd',
    mode: 'subscription',
    interval: 'month',
    description: '50 projects, team management, and custom branding'
  },
  'white-label': {
    productName: 'White Label Plan',
    priceAmount: 49900, // $499.00 in cents
    currency: 'usd',
    mode: 'subscription',
    interval: 'month',
    description: '200 projects, complete customization, and white labeling'
  }
} as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tier, purchaseType = 'subscription', successUrl, cancelUrl } = body;

    console.log('🛒 Checkout request:', { tier, purchaseType });

    // Validate tier
    const config = PRICING_CONFIG[tier as keyof typeof PRICING_CONFIG];
    if (!config) {
      return NextResponse.json(
        { error: 'Invalid subscription tier' },
        { status: 400 }
      );
    }

    // Handle demo mode (when Stripe keys are not configured)
    if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY.startsWith('sk_test_demo')) {
      console.log('🎭 Demo mode: Simulating Stripe checkout');

      const demoUrl = successUrl || `${APP_URL}/subscription/success?session_id=demo_session&tier=${tier}`;

      return NextResponse.json({
        message: `Demo Mode: ${config.productName} checkout simulation`,
        url: demoUrl,
        demo: true,
        amount: config.priceAmount,
        currency: config.currency
      });
    }

    // Initialize Stripe with proper ES6 import
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
    });

    // Create or retrieve product
    const products = await stripe.products.list({
      limit: 100,
    });

    let product = products.data.find((p: any) => p.name === config.productName);

    if (!product) {
      product = await stripe.products.create({
        name: config.productName,
        description: config.description,
        type: 'service',
        metadata: {
          tier: tier,
          purchaseType: purchaseType
        }
      });
      console.log('📦 Created new product:', product.id);
    }

    // Create or retrieve price
    const prices = await stripe.prices.list({
      product: product.id,
      limit: 100,
    });

    let price = prices.data.find((p: any) =>
      p.unit_amount === config.priceAmount &&
      p.currency === config.currency &&
      (config.mode === 'subscription' ? p.recurring?.interval === config.interval : !p.recurring)
    );

    if (!price) {
      const priceData: any = {
        product: product.id,
        unit_amount: config.priceAmount,
        currency: config.currency,
        metadata: {
          tier: tier,
          purchaseType: purchaseType
        }
      };

      if (config.mode === 'subscription') {
        priceData.recurring = {
          interval: config.interval
        };
      }

      price = await stripe.prices.create(priceData);
      console.log('💰 Created new price:', price.id);
    }

    // Create checkout session
    const sessionData: any = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: config.mode,
      success_url: successUrl || `${APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
      cancel_url: cancelUrl || `${APP_URL}/subscription?cancelled=true`,
      metadata: {
        tier: tier,
        purchaseType: purchaseType,
        timestamp: new Date().toISOString()
      },
      allow_promotion_codes: true,
    };

    // Add customer email and additional options for subscriptions
    if (config.mode === 'subscription') {
      sessionData.subscription_data = {
        metadata: {
          tier: tier,
          created_at: new Date().toISOString()
        }
      };
    }

    // Add billing address collection for business purchases
    if (tier.includes('business') || tier === 'enterprise' || tier === 'white-label') {
      sessionData.billing_address_collection = 'required';
    }

    const session = await stripe.checkout.sessions.create(sessionData);

    console.log('✅ Stripe session created:', {
      sessionId: session.id,
      tier: tier,
      amount: config.priceAmount,
      mode: config.mode
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      tier: tier,
      amount: config.priceAmount,
      currency: config.currency,
      mode: config.mode
    });

  } catch (error: any) {
    console.error('❌ Stripe checkout error:', error);

    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        details: error.message,
        type: error.type || 'unknown_error'
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for session status
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID required' },
      { status: 400 }
    );
  }

  // Handle demo mode
  if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY.startsWith('sk_test_demo')) {
    return NextResponse.json({
      status: 'complete',
      customer_email: 'demo@spectakull.com',
      amount_total: 1999,
      currency: 'usd',
      demo: true
    });
  }

  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
    });
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details?.email,
      amount_total: session.amount_total,
      currency: session.currency,
      metadata: session.metadata
    });

  } catch (error: any) {
    console.error('❌ Failed to retrieve session:', error);

    return NextResponse.json(
      { error: 'Failed to retrieve session', details: error.message },
      { status: 500 }
    );
  }
}
