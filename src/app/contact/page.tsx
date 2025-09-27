import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
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
              <Link href="/enterprise" className="text-white/80 hover:text-white transition-colors">Enterprise</Link>
              <Link href="/contact" className="text-white font-medium">Contact</Link>
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
              Get in
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Ready to transform your business with AR? Our team is here to help you get started with Spectakull.
              Let's discuss your AR needs and create something spectacular together.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20 bg-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-white/80 text-sm font-medium mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-white/80 text-sm font-medium mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-white/80 text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-white/80 text-sm font-medium mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="Enter your company name"
                  />
                </div>

                <div>
                  <label htmlFor="interest" className="block text-white/80 text-sm font-medium mb-2">
                    I'm interested in
                  </label>
                  <select
                    id="interest"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  >
                    <option value="">Select your interest</option>
                    <option value="demo">Product Demo</option>
                    <option value="enterprise">Enterprise Solutions</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="support">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-white/80 text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none"
                    placeholder="Tell us about your AR needs and how we can help..."
                  ></textarea>
                </div>

                <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-lg py-3">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Let's Connect</h2>
                <p className="text-xl text-white/80 mb-8">
                  Whether you're looking for a demo, have questions about our enterprise solutions,
                  or want to explore partnership opportunities, we'd love to hear from you.
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Email Us</h3>
                    <p className="text-white/80 mb-2">Get in touch via email for any inquiries</p>
                    <a href="mailto:hello@spectakull.com" className="text-cyan-400 hover:text-cyan-300">
                      hello@spectakull.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Enterprise Sales</h3>
                    <p className="text-white/80 mb-2">Dedicated support for enterprise customers</p>
                    <a href="mailto:enterprise@spectakull.com" className="text-cyan-400 hover:text-cyan-300">
                      enterprise@spectakull.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🛠️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Technical Support</h3>
                    <p className="text-white/80 mb-2">Need help with the platform? We're here to assist</p>
                    <a href="mailto:support@spectakull.com" className="text-cyan-400 hover:text-cyan-300">
                      support@spectakull.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Partnerships</h3>
                    <p className="text-white/80 mb-2">Explore collaboration opportunities</p>
                    <a href="mailto:partnerships@spectakull.com" className="text-cyan-400 hover:text-cyan-300">
                      partnerships@spectakull.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Office Information */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Our Office</h3>
                <div className="space-y-2 text-white/80">
                  <p>Spectakull Technologies Inc.</p>
                  <p>123 Innovation Drive</p>
                  <p>San Francisco, CA 94105</p>
                  <p>United States</p>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Response Time</h3>
                <div className="space-y-2 text-white/80">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span>General Inquiries: Within 24 hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    <span>Enterprise Sales: Within 4 hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    <span>Technical Support: Within 1 hour</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 relative">
        <div className="absolute inset-0">
          <img
            src="/spectakull_background_skull_image.jpg"
            alt="Background"
            className="w-full h-full object-cover opacity-15"
          />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-white/80">
              Quick answers to common questions about Spectakull and our AR solutions.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-3">How quickly can I get started with Spectakull?</h3>
              <p className="text-white/80">
                You can start creating AR experiences immediately! Simply visit our AR Studio and begin building.
                For enterprise solutions, we can have you set up within 24-48 hours after our initial consultation.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-3">Do I need any technical skills to use Spectakull?</h3>
              <p className="text-white/80">
                Not at all! Spectakull is designed as a no-code platform. Our intuitive drag-and-drop interface
                allows anyone to create professional AR experiences without programming knowledge.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-3">What devices are supported for viewing AR experiences?</h3>
              <p className="text-white/80">
                AR experiences created with Spectakull work on any smartphone or tablet with a camera.
                No special apps required - users simply scan a QR code to view your AR content.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-3">Can I customize the platform for my brand?</h3>
              <p className="text-white/80">
                Yes! Our Enterprise plan includes white-labeling options, allowing you to customize the platform
                with your brand colors, logo, and domain. Perfect for agencies and large organizations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Don't wait - start creating amazing AR experiences today. Try our platform for free
            or schedule a personalized demo to see what Spectakull can do for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-cyan-600 hover:bg-gray-100 text-lg px-8 py-4">
              <Link href="/studio">Start Creating Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4">
              <Link href="/enterprise">View Enterprise Plans</Link>
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
                We're here to help you create spectacular AR experiences.
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
              © 2024 Spectakull. All rights reserved. Let's create something spectacular together.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
