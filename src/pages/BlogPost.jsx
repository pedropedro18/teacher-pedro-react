import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const posts = import.meta.glob('../posts/*.md', { eager: true, query: '?raw', import: 'default' });

function parsePost(raw, path) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  const frontmatter = {};
  let content = raw;
  if (match) {
    match[1].split(/\r?\n/).forEach(line => {
      const [key, ...rest] = line.split(':');
      if (key) frontmatter[key.trim()] = rest.join(':').trim();
    });
    content = match[2];
  }
  const slug = path.split('/').pop().replace('.md', '');
  return { ...frontmatter, slug, content };
}

export default function BlogPost() {
  const { slug } = useParams();
  const articles = Object.entries(posts).map(([path, raw]) => parsePost(raw, path));
  const post = articles.find(p => p.slug === slug);

  if (!post) return <p style={{ padding: '2rem' }}>Artigo não encontrado.</p>;

  return (
       <main className="blog-post">
      <Link to="/blog" className="back-link">← Voltar ao blog</Link>
      <h1>{post.title}</h1>
      <span className="blog-date">{post.date}</span>
      <div className="blog-post-content">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </main>
  );
}