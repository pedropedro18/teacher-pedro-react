import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { posts, parsePost } from '../utils/posts';

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
  