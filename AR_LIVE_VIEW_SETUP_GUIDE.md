# 🚀 AR Live View Setup Guide - Connection Troubleshooting

## Overview
This guide addresses the specific AR live view connection issues you mentioned and provides comprehensive setup instructions for the Spectakull AR platform.

## 🔧 1. Node.js Server Configuration

### Current Status ✅
Your `package.json` is already correctly configured:
```json
{
  "scripts": {
    "dev": "next dev -H 0.0.0.0 --turbopack"
  }
}
```

### What This Means:
- ✅ Server listens on `0.0.0.0` (all network interfaces)
- ✅ Accessible from other devices on the same network
- ✅ Supports external connections through port forwarding

### Port Forwarding Setup:
1. **Router Configuration:**
   - Forward port `3000` (or your chosen port) from public IP to local AR PC
   - Example: `Public IP:3000` → `192.168.1.100:3000` (your AR PC's private IP)

2. **Firewall Settings:**
   ```bash
   # Windows Firewall
   netsh advfirewall firewall add rule name="NextJS AR Server" dir=in action=allow protocol=TCP localport=3000

   # Linux UFW
   sudo ufw allow 3000
   ```

3. **Test Local Network Access:**
   ```bash
   # Find your local IP
   ipconfig getifaddr en0  # macOS
   hostname -I             # Linux
   ipconfig               # Windows

   # Test from another device
   http://[YOUR_LOCAL_IP]:3000
   ```

## 🌐 2. WebSocket URL Configuration (Vercel Fix)

### Current Implementation ✅
Our new AR connection manager automatically handles the protocol:

```typescript
// In /src/lib/ar-connection.ts
private getWebSocketUrl(): string {
  if (typeof window === 'undefined') {
    return 'ws://localhost:3000';
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;

  // For Vercel deployments, always use wss://
  if (host.includes('.vercel.app') || window.location.protocol === 'https:') {
    return `wss://${host}/api/ar-websocket`;
  }

  // For local development
  if (host.includes('localhost') || host.includes('127.0.0.1') || host.startsWith('0.0.0.0')) {
    return `ws://${host}/api/ar-websocket`;
  }

  // Default to secure WebSocket
  return `wss://${host}/api/ar-websocket`;
}
```

### Key Fixes Applied:
- ✅ **wss://** for HTTPS/Vercel (not ws://)
- ✅ **ws://** for local development
- ✅ Automatic protocol detection
- ✅ Fallback to polling if WebSocket fails

## 🔧 3. Enhanced AR Connection Features

### New Features Added:
1. **Connection Manager** (`/src/lib/ar-connection.ts`)
   - Automatic WebSocket/polling fallback
   - Connection status monitoring
   - Reconnection logic
   - Heartbeat system

2. **AR State Context** (`/src/contexts/ARStateContext.tsx`)
   - Centralized AR object management
   - Cross-component state sync
   - Auto-save functionality
   - Live collaboration support

3. **Enhanced Components:**
   - `ARCameraPreview` with live connection status
   - Real-time object synchronization
   - Visual connection indicators

## 📱 4. Testing AR Live View

### Local Testing:
```bash
# 1. Start the development server
npm run dev
# or
bun dev

# 2. Test on same network
# Device 1: http://[YOUR_IP]:3000/studio
# Device 2: http://[YOUR_IP]:3000/business-card-ar

# 3. Check connection status in browser console
```

### Production Testing (Vercel):
```bash
# 1. Deploy to Vercel
vercel --prod

# 2. Test AR features
# Browser: https://your-app.vercel.app/studio
# Mobile: https://your-app.vercel.app/business-card-ar

# 3. Verify wss:// connections in Network tab
```

## 🐛 5. Troubleshooting Common Issues

### Issue 1: "WebSocket connection failed"
**Solution:**
```javascript
// Check browser console for exact error
// Common fixes:
1. Ensure HTTPS for production (required for WebXR)
2. Check if port 3000 is accessible
3. Verify no firewall blocking
4. Test fallback polling mode
```

### Issue 2: "Camera permissions denied"
**Solution:**
```javascript
// AR requires camera access
1. Click "Allow" when prompted
2. Check browser settings: chrome://settings/content/camera
3. Ensure HTTPS for production (required for getUserMedia)
4. Try different browsers (Chrome/Safari recommended)
```

### Issue 3: "AR not supported on this device"
**Solution:**
```javascript
// Fallback handling implemented
1. WebXR not available → 3D viewer mode
2. Camera not available → Static preview
3. WebSocket fails → Polling mode
4. All connections fail → Offline mode
```

## 🔒 6. Security Considerations

### HTTPS Requirements:
- **WebXR** requires HTTPS in production
- **getUserMedia** requires HTTPS for camera access
- **Service Workers** require HTTPS
- **WebSocket Secure (wss://)** required for HTTPS sites

### Environment Variables:
```bash
# Add to .env.local
NEXT_PUBLIC_AR_WEBSOCKET_URL=wss://your-domain.com/api/ar-websocket
NEXT_PUBLIC_ENABLE_AR_DEBUG=true
NEXT_PUBLIC_AR_POLLING_INTERVAL=2000
```

## 📊 7. Monitoring and Debugging

### Connection Status API:
```javascript
// Check connection info
const connection = useARConnection();
console.log('Status:', connection.status);
console.log('Type:', connection.connectionInfo.connectionType);
console.log('URL:', connection.connectionInfo.url);
```

### Browser DevTools:
1. **Network Tab:** Check WebSocket connections
2. **Console:** Look for AR connection logs
3. **Application → Storage:** Check local AR data
4. **Security:** Verify HTTPS/camera permissions

## 🚀 8. Performance Optimization

### Server Configuration:
```javascript
// next.config.js enhancements applied
module.exports = {
  experimental: {
    turbo: {
      loaders: {
        '.glb': ['file-loader'],
        '.gltf': ['file-loader']
      }
    }
  },
  headers: async () => [{
    source: '/(.*)',
    headers: [
      { key: 'Permissions-Policy', value: 'camera=*, microphone=*, xr-spatial-tracking=*' }
    ]
  }]
}
```

### Mobile Performance:
- ✅ Frame rate limited to 30 FPS
- ✅ Reduced pixel ratio for performance
- ✅ Optimized Three.js renderer settings
- ✅ Automatic quality adjustment

## 📦 9. Complete Project Download

The complete project with all AR live view fixes is available as:
- **File:** `spectakull-complete-fixed-ar.tar.gz`
- **Includes:** All source code, assets, configurations
- **Excludes:** node_modules, build files, logs

### Quick Setup:
```bash
# Extract the package
tar -xzf spectakull-complete-fixed-ar.tar.gz
cd spectakull-final

# Install dependencies
bun install
# or npm install

# Start development
bun dev
# or npm run dev

# Access from other devices
http://[YOUR_IP]:3000
```

## ✅ 10. Verification Checklist

- [ ] Server listens on 0.0.0.0:3000
- [ ] Port forwarding configured (if needed)
- [ ] WebSocket URLs use wss:// for HTTPS
- [ ] Camera permissions granted
- [ ] AR connection status visible in UI
- [ ] Objects sync between devices
- [ ] Fallback polling works when WebSocket fails
- [ ] HTTPS configured for production

## 🆘 Emergency Troubleshooting

If AR live view still fails:

1. **Check logs:** Browser console + server terminal
2. **Test connectivity:** `telnet [YOUR_IP] 3000`
3. **Verify protocols:** Network tab in DevTools
4. **Try different browsers:** Chrome/Safari/Edge
5. **Test on local network first** before external access

## 📞 Support

For additional support:
- Check browser console for specific error messages
- Test with the provided API endpoints
- Verify network configuration
- Ensure all dependencies are installed

The AR live view system now has comprehensive fallbacks and should work across different network configurations and deployment scenarios.
