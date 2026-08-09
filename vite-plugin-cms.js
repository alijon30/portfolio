import fs from 'fs';
import path from 'path';

export default function cmsPlugin() {
    return {
        name: 'vite-plugin-cms',
        configureServer(server) {
            server.middlewares.use('/api/save-post', async (req, res, next) => {
                if (req.method === 'POST') {
                    let body = '';
                    req.on('data', chunk => {
                        body += chunk.toString();
                    });

                    req.on('end', async () => {
                        try {
                            const { category, slug, title, date, description, content } = JSON.parse(body);

                            if (!category || !slug || !title || !content) {
                                res.statusCode = 400;
                                res.end(JSON.stringify({ error: 'Missing required fields' }));
                                return;
                            }

                            // Sanitize slug and category to prevent directory traversal
                            const safeSlug = slug.replace(/[^a-z0-9-]/g, '').toLowerCase();
                            const safeCategory = category.replace(/[^a-z0-9-]/g, '').toLowerCase();

                            const targetDir = path.resolve(process.cwd(), `src/content/${safeCategory}`);
                            const targetFile = path.join(targetDir, `${safeSlug}.md`); // Changed to .md

                            // Ensure directory exists
                            if (!fs.existsSync(targetDir)) {
                                fs.mkdirSync(targetDir, { recursive: true });
                            }

                            // Construct file content
                            const fileContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date || new Date().toISOString().split('T')[0]}"
description: "${(description || '').replace(/"/g, '\\"')}"
---

${content}`;

                            fs.writeFileSync(targetFile, fileContent);

                            console.log(`[CMS] Saved post to ${targetFile}`);

                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ success: true, path: `/blog/${safeCategory}/${safeSlug}` }));
                        } catch (err) {
                            console.error('[CMS] Error saving post:', err);
                            res.statusCode = 500;
                            res.end(JSON.stringify({ error: err.message }));
                        }
                    });
                } else if (req.method === 'DELETE' && req.url.startsWith('/api/delete-post')) {
                    let body = '';
                    req.on('data', chunk => {
                        body += chunk.toString();
                    });

                    req.on('end', async () => {
                        try {
                            const { category, slug } = JSON.parse(body);

                            if (!category || !slug) {
                                res.statusCode = 400;
                                res.end(JSON.stringify({ error: 'Missing category or slug' }));
                                return;
                            }

                            const safeSlug = slug.replace(/[^a-z0-9-]/g, '').toLowerCase();
                            const safeCategory = category.replace(/[^a-z0-9-]/g, '').toLowerCase();
                            const targetFile = path.resolve(process.cwd(), `src/content/${safeCategory}/${safeSlug}.md`);

                            if (fs.existsSync(targetFile)) {
                                fs.unlinkSync(targetFile);
                                console.log(`[CMS] Deleted post: ${targetFile}`);
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify({ success: true }));
                            } else {
                                res.statusCode = 404;
                                res.end(JSON.stringify({ error: 'File not found' }));
                            }
                        } catch (err) {
                            console.error('[CMS] Error deleting post:', err);
                            res.statusCode = 500;
                            res.end(JSON.stringify({ error: err.message }));
                        }
                    });
                } else if (req.method === 'GET' && req.url === '/api/categories') {
                    try {
                        const contentDir = path.resolve(process.cwd(), 'src/content');
                        if (!fs.existsSync(contentDir)) {
                            fs.mkdirSync(contentDir, { recursive: true });
                        }
                        const categories = fs.readdirSync(contentDir, { withFileTypes: true })
                            .filter(dirent => dirent.isDirectory())
                            .map(dirent => dirent.name);

                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(categories));
                    } catch (err) {
                        console.error('[CMS] Error fetching categories:', err);
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: err.message }));
                    }
                } else if (req.method === 'POST' && req.url === '/api/create-category') {
                    let body = '';
                    req.on('data', chunk => {
                        body += chunk.toString();
                    });

                    req.on('end', async () => {
                        try {
                            const { category } = JSON.parse(body);
                            if (!category) {
                                res.statusCode = 400;
                                res.end(JSON.stringify({ error: 'Missing category name' }));
                                return;
                            }

                            const safeCategory = category.replace(/[^a-z0-9-]/g, '').toLowerCase();
                            const targetDir = path.resolve(process.cwd(), `src/content/${safeCategory}`);

                            if (!fs.existsSync(targetDir)) {
                                fs.mkdirSync(targetDir, { recursive: true });
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify({ success: true, category: safeCategory }));
                            } else {
                                res.statusCode = 400; // Conflict
                                res.end(JSON.stringify({ error: 'Category already exists' }));
                            }
                        } catch (err) {
                            console.error('[CMS] Error creating category:', err);
                            res.statusCode = 500;
                            res.end(JSON.stringify({ error: err.message }));
                        }
                    });
                } else {
                    next();
                }
            });
        }
    };
}
