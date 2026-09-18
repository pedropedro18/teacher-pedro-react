import { Link } from 'react-router-dom';
import { posts, parsePost } from '../utils/posts';

function getExcerpt(content, maxWords = 20) {
  const plain = content.replace(/[#*_`>[\]]/g, '').trim();
  const words = plain.split(/\s+/).slice(0, maxWords);
  return words.join(' ') + (plain.split(/\s+/).length > maxWords ? '...' : '');
}

function getReadingTime(content) {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min de leitura`;
}

export default function Blog() {

  const articles = Object.entries(posts)
    .map(([path, raw]) => parsePost(raw, path))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredArticles = articles;

  return (
    <main className="blog-page">
      <div className="blog-page-inner">
        <h1>Blog</h1>
        <div className="blog-list">
          {filteredArticles.length === 0 && (
            <p className="blog-empty">Ainda não há artigos publicados.</p>
          )}
          {filteredArticles.map(post => (
            <Link to={`/blog/${post.slug}`} key={post.slug} className="blog-card">
              <div className="blog-card-header">
                <span className="blog-date">{post.date}</span>
                <span className="blog-reading-time">{getReadingTime(post.content)}</span>
              </div>
              <h2 className="blog-card-title">{post.title}</h2>
              <p className="blog-card-excerpt">{getExcerpt(post.content)}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}