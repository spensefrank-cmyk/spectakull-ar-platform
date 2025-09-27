import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: '#004AAD' }}>
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img src="/spectakull_logo.png" alt="Spectakull" className="h-10 w-auto" />
            </div>
            <div className="flex items-center space-x-8">
              <Link href="/about" className="text-white/80 hover:text-white transition-colors">About</Link>
              <Link href="/enterprise" className="text-white/80 hover:text-white transition-colors">Enterprise</Link>
              <Link href="/contact" className="text-white/80 hover:text-white transition-colors">Contact</Link>
              <Link href="/business-card-ar" className="text-white/80 hover:text-white transition-colors">Business Card AR</Link>
              <Button asChild className="bg-cyan-500 hover:bg-cyan-600">
                <Link href="/studio">Launch AR Studio</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                  No-Code AR Creation
                  <span className="block bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                    For Everyone
                  </span>
                </h1>
                <p className="text-xl text-white/90 mb-6 max-w-2xl">
                  Create professional augmented reality experiences without coding.
                  Drag, drop, and publish AR content with our revolutionary browser-based platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-lg px-8 py-4">
                    <Link href="/studio">Start Creating Free</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4">
                    Watch Demo
                  </Button>
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-white/80">✨ No Code Required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-white/80">📱 Mobile AR Ready</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-white/80">🎯 Live Camera Preview</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-white/80">📱 QR Code Sharing</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <img
                src="/hero_image.png"
                alt="AR Creation Platform"
                className="w-1/2 h-auto rounded-lg shadow-2xl mx-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* No-Code Features Section */}
      <div className="py-20 bg-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Professional AR Without the Complexity
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              No coding, no downloads, no technical expertise required.
              Create stunning AR experiences with our intuitive visual editor.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-white mb-3">Visual Editor</h3>
              <p className="text-white/70">
                Drag and drop 3D objects, images, and videos. Adjust materials, lighting, and physics with simple sliders.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Sharing</h3>
              <p className="text-white/70">
                Generate QR codes instantly. Users scan to view your AR experience on any smartphone - no app downloads required.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-white mb-3">Browser-Based</h3>
              <p className="text-white/70">
                Works entirely in your web browser. No software to install, no system requirements. Create AR anywhere.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise Section */}
      <div className="py-20 relative">
        <div className="absolute inset-0">
          <img
            src="/spectakull_background_skull_image.jpg"
            alt="Spectakull Background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Augmented Reality From Your Phone
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Enterprise-grade AR creation tools that work on any device.
              Create presentations, training materials, and marketing experiences that captivate audiences.
            </p>
            <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-lg px-8 py-4">
              <Link href="/enterprise">Enterprise Solutions</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Team Collaboration */}
      <div className="py-20 bg-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/spectakull_teams.png"
                alt="Team Collaboration"
                className="w-1/2 h-auto rounded-lg shadow-xl mx-auto"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Make a Spectakull with your team!
              </h2>
              <p className="text-xl text-white/80 mb-6">
                Real-time collaboration features let your entire team work together on AR projects.
                Share ideas, iterate quickly, and create amazing experiences together.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-white">Real-time multiplayer editing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-white">Cloud project storage and sharing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-white">Team permissions and access controls</span>
                </div>
              </div>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link href="/about">Learn More About Teams</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Create Professional AR?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of creators building the future of augmented reality.
            No technical skills required - just your imagination.
          </p>
          <div className="space-y-4">
            <Button asChild size="lg" className="bg-white text-cyan-600 hover:bg-gray-100 text-lg px-12 py-4">
              <Link href="/studio">Start Creating Now - Free</Link>
            </Button>
            <div className="text-white/80">or</div>
            <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4">
              <Link href="/business-card-ar">🎯 Try Business Card AR Creator</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/20 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img src="/spectakull_logo.png" alt="Spectakull" className="h-8 w-auto mb-4" />
              <p className="text-white/60 text-sm">
                The world's most advanced no-code AR creation platform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <div className="space-y-2">
                <Link href="/studio" className="block text-white/60 hover:text-white text-sm transition-colors">AR Studio</Link>
                <Link href="/enterprise" className="block text-white/60 hover:text-white text-sm transition-colors">Enterprise</Link>
                <Link href="/agencies" className="block text-white/60 hover:text-white text-sm transition-colors">For Agencies</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <div className="space-y-2">
                <Link href="/about" className="block text-white/60 hover:text-white text-sm transition-colors">About</Link>
                <Link href="/contact" className="block text-white/60 hover:text-white text-sm transition-colors">Contact</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Connect</h4>
              <div className="space-y-2">
                <a href="#" className="block text-white/60 hover:text-white text-sm transition-colors">Twitter</a>
                <a href="#" className="block text-white/60 hover:text-white text-sm transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-white/60 text-sm">
              © 2024 Spectakull. All rights reserved. No-code AR creation for everyone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
