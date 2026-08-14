import { Link } from 'react-router-dom';

const posts = import.meta.glob('../posts/*.md', { eager: true, query: '?raw', import: 'default' });

function parsePost(raw, path) {

  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  const frontmatter = {};
  if (match) {
    match[1].split(/\r?\n/).forEach(line => {
      const [key, ...rest] = line.split(':');
      if (key) frontmatter[key.trim()] = rest.join(':').trim();
    });
  }
  const slug = path.split('/').pop().replace('.md', '');
  return { ...frontmatter, slug };
}

export default function Blog() {
  const articles = Object.entries(posts).map(([path, raw]) => parsePost(raw, path));
  console.log('posts:', posts);
  console.log('articles:', articles);

  return (
    <main className="blog-page" >
      <h1>Blog</h1>
      <div className="blog-list">
{articles.map(post => (
        <div key={post.slug} className="blog-card">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
          <span className="blog-date">{post.date}</span>
        </div>
      ))}
      </div>
    </main>
  );
}