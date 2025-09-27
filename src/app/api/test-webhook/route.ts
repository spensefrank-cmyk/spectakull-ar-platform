import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { eventType, customerId, subscriptionId } = await request.json();

    console.log('🧪 Testing webhook functionality:', {
      eventType,
      customerId,
      subscriptionId,
      timestamp: new Date().toISOString()
    });

    // Simulate different webhook events for testing
    switch (eventType) {
      case 'subscription.created':
        console.log('✅ Simulating: New Pro subscription created');
        return NextResponse.json({
          success: true,
          message: 'User upgraded to Pro tier',
          action: 'subscription_activated'
        });

      case 'payment.succeeded':
        console.log('✅ Simulating: Monthly payment succeeded');
        return NextResponse.json({
          success: true,
          message: 'Subscription renewed successfully',
          action: 'payment_processed'
        });

      case 'payment.failed':
        console.log('⚠️ Simulating: Payment failed');
        return NextResponse.json({
          success: true,
          message: 'Payment failure email sent',
          action: 'payment_retry_scheduled'
        });

      case 'subscription.canceled':
        console.log('❌ Simulating: Subscription canceled');
        return NextResponse.json({
          success: true,
          message: 'User downgraded to free tier',
          action: 'subscription_canceled'
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Unknown event type'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Test webhook error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test failed'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Webhook test endpoint ready',
    availableTests: [
      'subscription.created',
      'payment.succeeded',
      'payment.failed',
      'subscription.canceled'
    ],
    usage: 'POST with { eventType, customerId, subscriptionId }'
  });
}
