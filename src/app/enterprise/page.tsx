import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function EnterprisePage() {
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
              <Link href="/about" className="text-white/80 hover:text-white transition-colors">About</Link>
              <Link href="/enterprise" className="text-white font-medium">Enterprise</Link>
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
              Enterprise AR
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                Solutions
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-4xl mx-auto">
              Empower your organization with professional-grade AR creation tools.
              Scale your AR initiatives across teams with advanced collaboration, security, and management features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-lg px-8 py-4">
                <Link href="/contact">Request Demo</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4">
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise Features */}
      <div className="py-20 bg-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Enterprise-Grade AR Platform</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Built for scale, security, and collaboration. Everything your enterprise needs to deploy AR across your organization.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold text-white mb-3">Enterprise Security</h3>
              <p className="text-white/70">
                SSO integration, advanced user permissions, audit logs, and compliance-ready security controls.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-white mb-3">Team Management</h3>
              <p className="text-white/70">
                Unlimited team members, role-based access control, and centralized project management.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="text-4xl mb-4">☁️</div>
              <h3 className="text-xl font-bold text-white mb-3">Cloud Infrastructure</h3>
              <p className="text-white/70">
                Dedicated cloud storage, global CDN, 99.9% uptime SLA, and automatic backups.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-3">Analytics & Insights</h3>
              <p className="text-white/70">
                Advanced analytics, usage reporting, performance metrics, and ROI tracking.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-white mb-3">White Labeling</h3>
              <p className="text-white/70">
                Custom branding, domain setup, and fully branded AR experiences for your clients.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="text-4xl mb-4">🛠️</div>
              <h3 className="text-xl font-bold text-white mb-3">API & Integrations</h3>
              <p className="text-white/70">
                REST API access, webhook support, and integrations with your existing tools and workflows.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 relative">
        <div className="absolute inset-0">
          <img
            src="/spectakull_background_skull_image.jpg"
            alt="Enterprise Background"
            className="w-full h-full object-cover opacity-15"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Enterprise Pricing</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Flexible pricing that scales with your organization. Start with our professional plan or get custom enterprise solutions.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Professional Plan */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                <div className="text-4xl font-bold text-cyan-400 mb-1">$99</div>
                <div className="text-white/60 mb-6">per user/month</div>
                <Button asChild className="w-full bg-cyan-600 hover:bg-cyan-700 mb-6">
                  <Link href="/contact">Start Trial</Link>
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-cyan-400">✓</span>
                  <span className="text-white">Unlimited AR projects</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-cyan-400">✓</span>
                  <span className="text-white">Advanced collaboration tools</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-cyan-400">✓</span>
                  <span className="text-white">Cloud storage (100GB)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-cyan-400">✓</span>
                  <span className="text-white">Priority support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-cyan-400">✓</span>
                  <span className="text-white">Analytics dashboard</span>
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-gradient-to-b from-cyan-500/20 to-blue-600/20 backdrop-blur-sm rounded-lg border-2 border-cyan-400 p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-cyan-400 text-blue-900 px-4 py-1 rounded-full text-sm font-bold">Most Popular</span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-cyan-400 mb-1">$299</div>
                <div className="text-white/60 mb-6">per user/month</div>
                <Button asChild className="w-full bg-cyan-400 text-blue-900 hover:bg-cyan-300 mb-6">
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-cyan-400">✓</span>
                  <span className="text-white">Everything in Professional</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-cyan-400">✓</span>
                  <span className="text-white">SSO & advanced security</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-cyan-400">✓</span>
                  <span className="text-white">Unlimited cloud storage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-cyan-400">✓</span>
                  <span className="text-white">White labeling</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-cyan-400">✓</span>
                  <span className="text-white">Dedicated success manager</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-cyan-400">✓</span>
                  <span className="text-white">API access</span>
                </div>
              </div>
            </div>

            {/* Custom Plan */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Custom</h3>
                <div className="text-4xl font-bold text-cyan-400 mb-1">Custom</div>
                <div className="text-white/60 mb-6">pricing</div>
                <Button asChild variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 mb-6">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-cyan-400">✓</span>
                  <span className="text-white">Everything in Enterprise</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-cyan-400">✓</span>
                  <span className="text-white">On-premise deployment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-cyan-400">✓</span>
                  <span className="text-white">Custom integrations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-cyan-400">✓</span>
                  <span className="text-white">24/7 premium support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-cyan-400">✓</span>
                  <span className="text-white">Custom training</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="py-20 bg-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Enterprise Use Cases</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              See how leading organizations are using Spectakull to transform their business operations.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🏭</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Manufacturing & Training</h3>
                  <p className="text-white/80">
                    Create immersive training simulations for complex machinery, safety procedures, and assembly processes.
                    Reduce training costs and improve retention with hands-on AR learning.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🏢</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Real Estate & Architecture</h3>
                  <p className="text-white/80">
                    Enable clients to visualize properties and architectural plans in stunning detail.
                    Create virtual tours, showcase designs, and close deals faster with immersive AR experiences.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🛒</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Retail & E-commerce</h3>
                  <p className="text-white/80">
                    Transform the shopping experience with AR product visualization.
                    Let customers try products virtually, reducing returns and increasing customer satisfaction.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Education & Universities</h3>
                  <p className="text-white/80">
                    Enhance learning with interactive 3D models, virtual laboratories, and immersive educational content.
                    Make complex subjects accessible and engaging for students.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⚕️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Healthcare & Medical</h3>
                  <p className="text-white/80">
                    Revolutionize medical training and patient education with detailed anatomical models,
                    surgical simulations, and interactive treatment explanations.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🚗</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Automotive & Design</h3>
                  <p className="text-white/80">
                    Showcase vehicles in stunning detail, create virtual showrooms, and enable customers
                    to customize and visualize options before purchase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join leading enterprises already using Spectakull to create spectacular AR experiences.
            Get started with a free consultation and custom demo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-cyan-600 hover:bg-gray-100 text-lg px-8 py-4">
              <Link href="/contact">Schedule Demo</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4">
              <Link href="/studio">Try Free Version</Link>
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
                Enterprise-grade AR creation for organizations worldwide.
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
              © 2024 Spectakull. All rights reserved. Enterprise AR solutions for the future.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
