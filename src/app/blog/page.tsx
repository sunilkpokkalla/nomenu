import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { ArrowRight, Calendar, ChevronRight } from 'lucide-react';

export default function BlogIndex() {
  const posts = getAllPosts(['title', 'date', 'slug', 'excerpt', 'coverImage']);

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Simple Header */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="font-extrabold text-xl text-white tracking-tight flex items-center gap-2">
          NoMenu
        </Link>
        <Link href="/" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">
          Back to Main Site
        </Link>
      </header>
      
      {/* Header Section */}
      <section className="pt-32 pb-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              The NoMenu <span className="text-indigo-400">Journal.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-medium">
              Insights, strategies, and growth hacks for modern restaurant operators. Build a more profitable hospitality business.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link 
                key={post.slug} 
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-900/5 group-hover:bg-indigo-900/0 transition-colors z-10" />
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                      <span className="font-serif italic text-4xl text-slate-700 opacity-30 font-bold">NM</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col flex-grow p-6 md:p-8">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  
                  <h3 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center text-indigo-600 font-bold text-sm mt-auto">
                    Read Article 
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
