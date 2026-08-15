import { Link } from 'react-router-dom';
import { useState } from 'react';
import { posts, parsePost } from '../utils/posts';

export default function Blog() {
  const [filter, setFilter] = useState('Todos');

  const articles = Object.entries(posts)
    .map(([path, raw]) => parsePost(raw, path))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const levels = ['Todos', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const filteredArticles = filter === 'Todos'
    ? articles
    : articles.filter(post => post.level === filter);

  return (
    <main className="blog-page">
      <h1>Blog</h1>

      <div className="blog-filters">
        {levels.map(level => (
          <button
            key={level}
            className={`filter-btn ${filter === level ? 'active' : ''}`}
            onClick={() => setFilter(level)}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="blog-list">
        {filteredArticles.map(post => (
          <div key={post.slug} className="blog-card">
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
            <span className="blog-date">{post.date}</span>
          </div>
        ))}
      </div>
    </main>
  );
}