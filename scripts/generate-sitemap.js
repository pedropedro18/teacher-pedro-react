import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE_URL = 'https://teacher-pedro-react.vercel.app';
const postsDir = path.join(__dirname, '../src/posts');
const outputPath = path.join(__dirname, '../public/sitemap.xml');

const staticPages = ['/', '/blog', '/cursos'];

const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
const postUrls = postFiles.map(f => `/blog/${f.replace('.md', '')}`);

const allUrls = [...staticPages, ...postUrls];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${SITE_URL}${url}</loc>
  </url>`).join('\n')}
</urlset>`;
fs.writeFileSync(outputPath, xml);
console.log(`Sitemap gerado com ${allUrls.length} URLs`);