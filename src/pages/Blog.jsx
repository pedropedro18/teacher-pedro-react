import { Link } from 'react-router-dom';
import { useState } from 'react';
import { posts, parsePost } from '../utils/posts';

export default function Blog() {

  const articles = Object.entries(posts)
    .map(([path, raw]) => parsePost(raw, path))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredArticles = articles;

  return (
    <main className="blog-page">
      <h1>Blog</h1>
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