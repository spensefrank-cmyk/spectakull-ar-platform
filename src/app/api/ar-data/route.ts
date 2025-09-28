import { NextRequest } from 'next/server';

// AR Data Polling API - Fallback when WebSocket connections fail
// Provides real-time AR object data via HTTP polling

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('sessionId') || 'default';
  const projectId = searchParams.get('projectId') || 'unknown';
  const lastUpdate = searchParams.get('lastUpdate');

  console.log('📊 AR data polling request:', { sessionId, projectId, lastUpdate });

  try {
    // In a real implementation, this would:
    // 1. Fetch from database/cache
    // 2. Filter by lastUpdate timestamp for efficiency
    // 3. Return only changed data

    // Mock AR data with live updates
    const currentTime = Date.now();
    const rotationSpeed = 0.001;

    const arData = {
      objects: [
        {
          id: 'live-cube',
          type: 'cube',
          name: 'Live Cube',
          position: [
            Math.sin(currentTime * 0.001) * 2, // Moving in X
            0.5 + Math.sin(currentTime * 0.002) * 0.5, // Floating in Y
            0
          ],
          rotation: [0, currentTime * rotationSpeed, 0], // Rotating
          scale: [1, 1, 1],
          color: '#3b82f6',
          visible: true,
          metallic: 0.2,
          roughness: 0.3
        },
        {
          id: 'live-sphere',
          type: 'sphere',
          name: 'Live Sphere',
          position: [2, 0.5, Math.sin(currentTime * 0.0015) * 1.5], // Moving in Z
          rotation: [currentTime * rotationSpeed * 0.7, 0, 0],
          scale: [1, 1, 1],
          color: '#10b981',
          visible: true,
          metallic: 0.8,
          roughness: 0.1
        }
      ],
      camera: {
        position: [0, 1.6, 3],
        rotation: [0, 0, 0],
        fov: 75
      },
      lighting: {
        ambient: { color: '#ffffff', intensity: 0.6 },
        directional: {
          color: '#ffffff',
          intensity: 1,
          position: [1, 1, 1]
        }
      },
      sessionId,
      projectId,
      timestamp: currentTime,
      updateId: `update-${currentTime}`,
      isLiveData: true,
      connectionType: 'polling',
      stats: {
        connectedClients: Math.floor(Math.random() * 5) + 1,
        dataPoints: Math.floor(currentTime / 1000) % 1000,
        lastSync: currentTime
      }
    };

    // Check if data has changed since lastUpdate
    if (lastUpdate) {
      const lastUpdateTime = parseInt(lastUpdate);
      const timeDiff = currentTime - lastUpdateTime;

      // Only return data if enough time has passed (reduce bandwidth)
      if (timeDiff < 100) {
        return new Response(JSON.stringify({
          hasUpdate: false,
          timestamp: currentTime,
          message: 'No new data available'
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    return new Response(JSON.stringify({
      hasUpdate: true,
      data: arData
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('❌ AR data polling failed:', error);

    return new Response(JSON.stringify({
      hasUpdate: false,
      error: 'Failed to fetch AR data',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle AR data updates via POST
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, projectId, objects, camera, timestamp } = body;

    console.log('📤 AR data update via polling:', {
      sessionId,
      projectId,
      objectCount: objects?.length,
      timestamp
    });

    // In a real implementation, this would:
    // 1. Validate the incoming data
    // 2. Store in database/Redis for real-time sync
    // 3. Trigger updates to other connected clients
    // 4. Return confirmation

    return new Response(JSON.stringify({
      success: true,
      timestamp: Date.now(),
      updateId: `update-${Date.now()}`,
      message: 'AR data stored successfully',
      received: {
        sessionId,
        projectId,
        objectCount: objects?.length || 0
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('❌ AR data storage failed:', error);

    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to store AR data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}
