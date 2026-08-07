import { POSTS, type BlogPost } from './blog-posts-data';

export type { BlogPost };

export function getPostSlugs() {
  return POSTS.map(post => `${post.slug}.md`);
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, '');
  const post = POSTS.find(p => p.slug === realSlug);
  
  if (!post) {
    throw new Error(`Post not found with slug: ${realSlug}`);
  }

  const items: Partial<BlogPost> = {};

  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug;
    } else if (field === 'content') {
      items[field] = post.content;
    } else if (field === 'title' || field === 'date' || field === 'excerpt' || field === 'author' || field === 'coverImage') {
      items[field] = post[field as keyof BlogPost];
    }
  });

  return items as BlogPost;
}

export function getAllPosts(fields: string[] = []) {
  return POSTS.map(post => {
    const items: Partial<BlogPost> = {};
    fields.forEach((field) => {
      if (field === 'slug') {
        items[field] = post.slug;
      } else if (field === 'content') {
        items[field] = post.content;
      } else if (field === 'title' || field === 'date' || field === 'excerpt' || field === 'author' || field === 'coverImage') {
        items[field] = post[field as keyof BlogPost];
      }
    });
    return items as BlogPost;
  });
}
