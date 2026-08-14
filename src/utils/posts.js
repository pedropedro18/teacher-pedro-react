export const posts = import.meta.glob('../posts/*.md', { eager: true, query: '?raw', import: 'default' });

export function parsePost(raw, path) {
  const clean = raw.replace(/^\uFEFF/, '');
  const match = clean.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  const frontmatter = {};
  let content = clean;
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