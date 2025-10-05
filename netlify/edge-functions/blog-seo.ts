import { Context } from "https://edge.netlify.com/";

interface BlogPost {
  title: string;
  excerpt: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
  featured_image?: string;
  category?: string;
  slug: string;
  status: string;
  published_at?: string;
  updated_at: string;
  created_at: string;
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  if (!SUPABASE_SERVICE_KEY) {
    console.error('SUPABASE_SERVICE_ROLE_KEY environment variable not set');
    return null;
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/posts?slug=eq.${slug}&status=eq.published&select=*`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`Supabase request failed: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

function generateSEOTags(post: BlogPost): string {
  const title = post.meta_title || `${post.title} - Your Site Name`;
  const description = post.meta_description || post.excerpt || `Read "${post.title}" on Your Site Name - expert insights and professional advice.`;
  const canonicalUrl = `https://yoursite.netlify.app/blog/${post.slug}`;
  
  // Safe FAQ schema generation with fallback
  const hasFAQ = post.content && (
    post.content.includes('## Frequently Asked Questions') || 
    post.content.includes('### 1.') ||
    post.content.includes('**Q:')
  );
  const faqSchema = (hasFAQ && post.content) ? generateFAQSchema(post.content) : '';
  
  return `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${canonicalUrl}">
    
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:locale" content="en_US">
    ${post.featured_image ? `<meta property="og:image" content="${escapeHtml(post.featured_image)}">` : ''}
    <meta property="og:site_name" content="Your Site Name">
    
    <meta property="article:published_time" content="${post.published_at || post.created_at}">
    <meta property="article:modified_time" content="${post.updated_at}">
    ${post.category ? `<meta property="article:section" content="${escapeHtml(post.category)}">` : ''}
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:site" content="@yourhandle">
    ${post.featured_image ? `<meta name="twitter:image" content="${escapeHtml(post.featured_image)}">` : ''}
    
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "${escapeHtml(title.replace(' - Your Site Name', ''))}",
      "description": "${escapeHtml(post.excerpt || '')}",
      ${post.featured_image ? `"image": "${escapeHtml(post.featured_image)}",` : ''}
      "url": "${canonicalUrl}",
      "datePublished": "${post.published_at || post.created_at}",
      "dateModified": "${post.updated_at}",
      "author": {
        "@type": "Organization",
        "name": "Your Site Name",
        "url": "https://yoursite.netlify.app"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Your Site Name",
        "logo": {
          "@type": "ImageObject",
          "url": "https://yoursite.netlify.app/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${canonicalUrl}"
      }
    }
    </script>
    ${faqSchema}
  `;
}

function generateFAQSchema(content: string): string {
  const faqRegex = /### \d+\.\s+\*\*(.*?)\*\*\n(.*?)(?=\n### \d+\.|$)/gs;
  const faqs = [];
  let match;
  
  while ((match = faqRegex.exec(content)) !== null) {
    const question = match[1].trim();
    let answerText = match[2].trim();
    
    answerText = answerText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    
    if (question && answerText && question.includes('?')) {
      faqs.push({
        question: escapeHtml(question),
        answer: escapeHtml(answerText.substring(0, 500))
      });
    }
  }
  
  if (faqs.length === 0) return '';
  
  return `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        ${faqs.map(faq => `{
          "@type": "Question",
          "name": "${faq.question}",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "${faq.answer}"
          }
        }`).join(',')}
      ]
    }
    </script>
  `;
}

function escapeHtml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (!pathname.startsWith('/blog/') || pathname === '/blog' || pathname === '/blog/') {
    return;
  }

  const slug = pathname.replace('/blog/', '');
  const post = await fetchBlogPost(slug);
  
  if (!post) {
    return;
  }

  const response = await context.next();
  const html = await response.text();
  const seoTags = generateSEOTags(post);
  
  const modifiedHtml = html.replace(
    /<title>\s*.*?\s*<\/title>/i,
    seoTags
  );

  return new Response(modifiedHtml, {
    status: response.status,
    headers: {
      ...response.headers,
      'content-type': 'text/html',
    },
  });
};
