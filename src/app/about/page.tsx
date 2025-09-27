import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
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
              <Link href="/" className="text-white/80 hover:text-white transition-colors">Home</Link>
              <Link href="/about" className="text-white font-medium">About</Link>
              <Link href="/enterprise" className="text-white/80 hover:text-white transition-colors">Enterprise</Link>
              <Link href="/contact" className="text-white/80 hover:text-white transition-colors">Contact</Link>
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
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Revolutionizing
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                AR Creation
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-4xl mx-auto">
              We've built the world's most advanced no-code AR platform that empowers professionals,
              creators, and enterprises to build spectacular augmented reality experiences without any technical expertise.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-xl text-white/80 mb-6">
                To democratize augmented reality creation by making professional AR tools accessible to everyone.
                We believe that revolutionary technology should be simple enough for anyone to use, yet powerful enough for enterprise applications.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-white">Eliminate coding barriers to AR creation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-white">Empower professionals with advanced AR tools</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-white">Make AR creation as simple as drag and drop</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/hero_image.png"
                alt="AR Innovation"
                className="w-3/4 h-auto rounded-lg shadow-2xl mx-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="py-20 relative">
        <div className="absolute inset-0">
          <img
            src="/spectakull_background_skull_image.jpg"
            alt="Technology Background"
            className="w-full h-full object-cover opacity-15"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Revolutionary Technology</h2>
            <p className="text-xl text-white/90 max-w-4xl mx-auto">
              Spectakull combines cutting-edge web technologies with intuitive design to deliver
              an AR creation experience that rivals desktop applications while running entirely in your browser.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold text-white mb-3">Advanced Engine</h3>
              <p className="text-white/70">
                PBR materials, physics simulation, animation timeline, and particle systems - all running at 60fps in your browser.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-white mb-3">Mobile-First Design</h3>
              <p className="text-white/70">
                Live camera preview, QR code generation, and responsive interface that works perfectly on any device.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="text-4xl mb-4">☁️</div>
              <h3 className="text-xl font-bold text-white mb-3">Zero Installation</h3>
              <p className="text-white/70">
                No downloads, no plugins, no system requirements. Create professional AR experiences instantly.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-white mb-3">Professional Tools</h3>
              <p className="text-white/70">
                6-tab interface with objects, materials, lighting, media upload, and project management - rivaling desktop software.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-white mb-3">Real-Time Collaboration</h3>
              <p className="text-white/70">
                Multiplayer editing, team permissions, and cloud storage for seamless collaboration.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Sharing</h3>
              <p className="text-white/70">
                Generate QR codes instantly. Anyone can view your AR experience by scanning with their phone - no app required.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits for Professionals */}
      <div className="py-20 bg-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Transforming Professional Workflows</h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto">
              From marketing teams to educators, architects to product designers - Spectakull empowers professionals
              across industries to create compelling AR experiences that captivate audiences.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📈</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Marketing & Sales</h3>
                  <p className="text-white/80">
                    Create interactive product demonstrations, virtual showrooms, and immersive brand experiences
                    that drive engagement and conversions.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎓</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Education & Training</h3>
                  <p className="text-white/80">
                    Transform learning with interactive 3D models, virtual laboratories, and immersive educational content
                    that makes complex concepts accessible.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🏗️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Architecture & Design</h3>
                  <p className="text-white/80">
                    Visualize buildings, interior designs, and architectural concepts in real space before construction,
                    improving client communication and project outcomes.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎭</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Events & Entertainment</h3>
                  <p className="text-white/80">
                    Create memorable experiences for conferences, exhibitions, and entertainment venues with
                    interactive AR installations and experiences.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🛍️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Retail & E-commerce</h3>
                  <p className="text-white/80">
                    Enable customers to visualize products in their own space, try before they buy,
                    and create engaging shopping experiences.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🏥</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Healthcare & Medical</h3>
                  <p className="text-white/80">
                    Enhance medical training, patient education, and surgical planning with detailed 3D anatomical models
                    and interactive medical content.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Values */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Built on Innovation</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Every feature in Spectakull is designed with our core values: accessibility, innovation, and empowerment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Simplicity</h3>
              <p className="text-white/80">
                Complex technology made simple. Professional results without the learning curve.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Innovation</h3>
              <p className="text-white/80">
                Pushing the boundaries of what's possible in browser-based AR creation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🌟</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Empowerment</h3>
              <p className="text-white/80">
                Giving everyone the tools to create spectacular AR experiences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join the revolution in AR creation. Start building spectacular experiences today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-cyan-600 hover:bg-gray-100 text-lg px-8 py-4">
              <Link href="/studio">Try Spectakull Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4">
              <Link href="/enterprise">Enterprise Solutions</Link>
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
              © 2024 Spectakull. All rights reserved. Revolutionizing AR creation for everyone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
