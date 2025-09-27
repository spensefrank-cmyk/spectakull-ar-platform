import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
  readTime: string;
  featured: boolean;
  image: string;
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: 'ar-trends-2024',
    title: 'AR Creation Trends That Will Define 2024',
    excerpt: 'Discover the emerging trends in augmented reality that are reshaping how businesses and creators approach AR experiences.',
    content: 'The AR landscape is evolving rapidly, with new technologies and approaches emerging...',
    author: 'Sarah Martinez',
    publishedAt: '2024-01-15',
    category: 'Trends',
    readTime: '5 min read',
    featured: true,
    image: '/spectakull_background_skull_image.jpg',
    tags: ['AR Trends', '2024', 'Technology', 'Innovation']
  },
  {
    id: 'no-code-ar-revolution',
    title: 'The No-Code AR Revolution: Democratizing Augmented Reality',
    excerpt: 'How no-code platforms are making AR creation accessible to everyone, regardless of technical background.',
    content: 'The barrier to entry for AR creation has dramatically lowered...',
    author: 'Mike Chen',
    publishedAt: '2023-12-08',
    category: 'Technology',
    readTime: '7 min read',
    featured: false,
    image: '/spectakull_background_skull_image.jpg',
    tags: ['No-Code', 'AR Creation', 'Accessibility', 'Democracy']
  },
  {
    id: 'webxr-mobile-performance',
    title: 'Optimizing WebXR Performance for Mobile Devices',
    excerpt: 'Essential techniques for creating smooth AR experiences that work flawlessly on mobile browsers.',
    content: 'Mobile AR performance is crucial for user adoption...',
    author: 'Alex Rodriguez',
    publishedAt: '2023-11-22',
    category: 'Development',
    readTime: '8 min read',
    featured: false,
    image: '/spectakull_background_skull_image.jpg',
    tags: ['WebXR', 'Mobile', 'Performance', 'Optimization']
  },
  {
    id: 'ar-marketing-case-studies',
    title: '5 Brands That Mastered AR Marketing in 2023',
    excerpt: 'Real-world examples of how leading brands used AR to create memorable marketing campaigns.',
    content: 'AR marketing has proven its worth across industries...',
    author: 'Emma Thompson',
    publishedAt: '2023-10-30',
    category: 'Marketing',
    readTime: '6 min read',
    featured: false,
    image: '/spectakull_background_skull_image.jpg',
    tags: ['Marketing', 'Case Studies', 'Brands', 'Campaigns']
  },
  {
    id: 'ar-education-future',
    title: 'How AR is Transforming Education: A Teacher\'s Perspective',
    excerpt: 'Exploring the impact of augmented reality on modern education and student engagement.',
    content: 'Educators worldwide are discovering the power of AR...',
    author: 'Dr. Jennifer Lee',
    publishedAt: '2023-09-18',
    category: 'Education',
    readTime: '9 min read',
    featured: false,
    image: '/spectakull_background_skull_image.jpg',
    tags: ['Education', 'AR Learning', 'Teachers', 'Students']
  },
  {
    id: 'threejs-ar-fundamentals',
    title: 'Three.js AR Fundamentals: Building Your First AR Scene',
    excerpt: 'A comprehensive guide to creating AR experiences with Three.js and WebXR technologies.',
    content: 'Three.js has become the foundation for web-based AR...',
    author: 'David Park',
    publishedAt: '2023-09-05',
    category: 'Development',
    readTime: '12 min read',
    featured: true,
    image: '/spectakull_background_skull_image.jpg',
    tags: ['Three.js', 'WebXR', 'Development', 'Tutorial']
  },
  {
    id: 'ar-retail-revolution',
    title: 'The AR Retail Revolution: Try Before You Buy',
    excerpt: 'How augmented reality is changing the retail landscape and improving customer experiences.',
    content: 'Retail has been one of the early adopters of AR technology...',
    author: 'Lisa Wang',
    publishedAt: '2023-08-28',
    category: 'Retail',
    readTime: '7 min read',
    featured: false,
    image: '/spectakull_background_skull_image.jpg',
    tags: ['Retail', 'E-commerce', 'Customer Experience', 'Shopping']
  },
  {
    id: 'ar-accessibility-guidelines',
    title: 'Making AR Accessible: Design Guidelines for Inclusive Experiences',
    excerpt: 'Essential principles for creating AR experiences that work for users with diverse abilities.',
    content: 'Accessibility in AR is not just important—it\'s essential...',
    author: 'Marcus Johnson',
    publishedAt: '2023-08-14',
    category: 'Design',
    readTime: '10 min read',
    featured: false,
    image: '/spectakull_background_skull_image.jpg',
    tags: ['Accessibility', 'Inclusive Design', 'UX', 'Guidelines']
  },
  {
    id: 'getting-started-ar-creation',
    title: 'Getting Started with AR Creation: A Beginner\'s Guide',
    excerpt: 'Everything you need to know to start creating your own augmented reality experiences.',
    content: 'AR creation has never been more accessible...',
    author: 'Rachel Green',
    publishedAt: '2023-08-01',
    category: 'Beginner',
    readTime: '8 min read',
    featured: true,
    image: '/spectakull_background_skull_image.jpg',
    tags: ['Beginner', 'Getting Started', 'AR Basics', 'Tutorial']
  }
];

const categories = ['All', 'Technology', 'Marketing', 'Development', 'Education', 'Design', 'Retail', 'Beginner', 'Trends'];

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const recentPosts = blogPosts.slice(0, 6);

  return (
    <div className="min-h-screen" style={{ background: '#004AAD' }}>
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <img src="/spectakull_logo.png" alt="Spectakull" className="h-10 w-auto cursor-pointer" />
              </Link>
            </div>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-white/80 hover:text-white transition-colors">Home</Link>
              <Link href="/about" className="text-white/80 hover:text-white transition-colors">About</Link>
              <Link href="/enterprise" className="text-white/80 hover:text-white transition-colors">Enterprise</Link>
              <Link href="/contact" className="text-white/80 hover:text-white transition-colors">Contact</Link>
              <Link href="/blog" className="text-white font-medium">Blog</Link>
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
              AR Creation
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Insights, tutorials, and trends in augmented reality creation.
              Learn from experts and discover the future of AR technology.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Posts */}
      <div className="py-16 bg-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Featured Articles</h2>
            <p className="text-white/80">Must-read insights for AR creators</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <div key={post.id} className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden hover:border-white/20 transition-colors">
                <div className="aspect-video bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                  <div className="text-6xl">📱</div>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded text-xs font-medium">
                      {post.category}
                    </span>
                    <div className="flex items-center text-white/60 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-white/80 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-white/60 text-xs">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                      <span>•</span>
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-cyan-400 hover:text-cyan-300">
                      Read More <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="py-8 bg-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="py-16 bg-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Latest Articles</h2>
            <p className="text-white/80">Stay updated with the latest in AR creation</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <article key={post.id} className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden hover:border-white/20 transition-colors">
                <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center">
                  <div className="text-4xl">
                    {post.category === 'Technology' && '⚙️'}
                    {post.category === 'Marketing' && '📊'}
                    {post.category === 'Development' && '💻'}
                    {post.category === 'Education' && '📚'}
                    {post.category === 'Design' && '🎨'}
                    {post.category === 'Retail' && '🛍️'}
                    {post.category === 'Beginner' && '🌟'}
                    {post.category === 'Trends' && '📈'}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      post.category === 'Technology' ? 'bg-blue-500/20 text-blue-300' :
                      post.category === 'Marketing' ? 'bg-green-500/20 text-green-300' :
                      post.category === 'Development' ? 'bg-purple-500/20 text-purple-300' :
                      post.category === 'Education' ? 'bg-yellow-500/20 text-yellow-300' :
                      post.category === 'Design' ? 'bg-pink-500/20 text-pink-300' :
                      post.category === 'Retail' ? 'bg-orange-500/20 text-orange-300' :
                      post.category === 'Beginner' ? 'bg-cyan-500/20 text-cyan-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {post.category}
                    </span>
                    <div className="flex items-center text-white/60 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-white/80 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-white/60 text-xs">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="text-white/60 text-xs">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {post.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="bg-white/10 text-white/70 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="py-16 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated with AR Trends
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Get the latest AR creation insights, tutorials, and industry news delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white/50"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
          <p className="text-white/70 text-sm mt-4">
            No spam, unsubscribe anytime. Join 5,000+ AR creators.
          </p>
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
                <Link href="/blog" className="block text-white/60 hover:text-white text-sm transition-colors">Blog</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <div className="space-y-2">
                <Link href="/blog/getting-started-ar-creation" className="block text-white/60 hover:text-white text-sm transition-colors">Getting Started</Link>
                <Link href="/blog/threejs-ar-fundamentals" className="block text-white/60 hover:text-white text-sm transition-colors">Three.js Tutorial</Link>
                <Link href="/blog/ar-accessibility-guidelines" className="block text-white/60 hover:text-white text-sm transition-colors">Accessibility Guide</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <div className="space-y-2">
                <Link href="/about" className="block text-white/60 hover:text-white text-sm transition-colors">About</Link>
                <Link href="/contact" className="block text-white/60 hover:text-white text-sm transition-colors">Contact</Link>
                <Link href="/blog" className="block text-white/60 hover:text-white text-sm transition-colors">Blog</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-white/60 text-sm">
              © 2024 Spectakull. All rights reserved. AR creation for everyone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
