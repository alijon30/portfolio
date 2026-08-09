// Simple frontmatter parser to avoid node dependencies in browser
const parseFrontmatter = (text) => {
    const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { data: {}, content: text };

    const frontmatterRaw = match[1];
    const content = match[2];

    const data = {};
    frontmatterRaw.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
            const value = valueParts.join(':').trim().replace(/^['"](.*)['"]$/, '$1'); // remove quotes
            data[key.trim()] = value;
        }
    });

    return { data, content };
};

// Get all markdown files from src/content
const modules = import.meta.glob('/src/content/**/*.md', { query: '?raw', import: 'default', eager: true });

export const getAllPosts = () => {
    console.log('Modules found:', Object.keys(modules));
    const posts = Object.entries(modules).map(([path, content]) => {
        console.log('Processing path:', path);

        // path is like /src/content/folder/slug.md
        const { data, content: markdownBody } = parseFrontmatter(content);

        // Extract info from path
        const relativePath = path.replace('/src/content/', '').replace('.md', '');
        const [category, slug] = relativePath.split('/');

        return {
            ...data, // frontmatter
            category,
            slug,
            path: relativePath,
            content: markdownBody,
            date: data.date ? new Date(data.date).toISOString() : null, // ensure date is serializable if needed
        };
    });

    // Sort by date desc
    return posts.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date) - new Date(a.date);
    });
};

export const getPostBySlug = (category, slug) => {
    const path = `/src/content/${category}/${slug}.md`;
    const content = modules[path];

    if (!content) {
        console.log('Post not found for path:', path);
        console.log('Available paths:', Object.keys(modules));
        return null;
    }

    const { data, content: markdownBody } = parseFrontmatter(content);
    return {
        ...data,
        category,
        slug,
        content: markdownBody
    };
};
