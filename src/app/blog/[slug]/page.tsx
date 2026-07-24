import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';

export async function generateStaticParams() {
  const posts = getAllPosts(['slug']);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let post;
  
  try {
    post = getPostBySlug(resolvedParams.slug, [
      'title',
      'date',
      'slug',
      'author',
      'content',
      'coverImage',
    ]);
  } catch (e) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-slate-100">
        <Link href="/" className="font-extrabold text-xl text-slate-900 tracking-tight flex items-center gap-2">
          NoMenu
        </Link>
        <Link href="/" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
          Back to Main Site
        </Link>
      </header>
      
      <article className="pt-32 pb-24">
        {/* Article Header */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <Link href="/blog" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Journal
          </Link>
          
          <div className="flex items-center justify-center gap-4 text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>•</span>
            <span>By {post.author}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            {post.title}
          </h1>
        </header>

        {/* Hero Image Area */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="aspect-[21/9] w-full bg-slate-900 rounded-[2.5rem] overflow-hidden relative shadow-2xl">
             {post.coverImage ? (
               <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
             ) : (
               <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                  <span className="font-serif italic text-6xl text-slate-700 opacity-30 font-bold">NoMenu</span>
               </div>
             )}
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg prose-slate prose-indigo max-w-none prose-headings:font-extrabold prose-h3:text-2xl prose-a:font-bold prose-a:text-indigo-600 hover:prose-a:text-indigo-700">
            <ReactMarkdown>{post.content || ''}</ReactMarkdown>
          </div>
          
          {/* Share/Bottom Action */}
          <div className="mt-16 pt-8 border-t border-slate-200 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <span className="font-bold text-slate-900">Share this article</span>
                <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>
      </article>
    </div>
  );
}
