/** @type {import("next").NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Enhanced configuration for AR live view and WebSocket connections
  turbopack: {
    rules: {
      '*.glb': ['file-loader'],
      '*.gltf': ['file-loader']
    }
  },
  // Headers for AR and WebXR
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          // WebXR requires HTTPS in production
          {
            key: 'Permissions-Policy',
            value: 'camera=*, microphone=*, xr-spatial-tracking=*'
          }
        ]
      }
    ]
  },
  // Webpack config for AR assets
  webpack: (config, { isServer }) => {
    // Handle GLTF and GLB files
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/files/',
          outputPath: 'static/files/'
        }
      }
    });

    return config;
  }
}

module.exports = nextConfig