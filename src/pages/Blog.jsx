import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import BlogCard from '../components/BlogCard';
import { FiFolder, FiGrid } from 'react-icons/fi';

function Blog() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            const { data: cats, error: catsError } = await supabase
                .from('categories')
                .select('*')
                .order('name');

            if (catsError) console.error('Error fetching categories:', catsError);
            else setCategories(cats || []);

            const { data: postsData, error: postsError } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (postsError) console.error('Error fetching posts:', postsError);
            else setPosts(postsData || []);

            setLoading(false);
        }
        fetchData();
    }, []);

    const filteredPosts = selectedCategory === 'All'
        ? posts
        : posts.filter(post => post.category?.toLowerCase() === selectedCategory.toLowerCase());

    // Group posts by month/year
    const groupedPosts = filteredPosts.reduce((groups, post) => {
        const date = new Date(post.created_at || post.date);
        const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
        const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        if (!groups[key]) {
            groups[key] = { label, posts: [] };
        }
        groups[key].posts.push(post);
        return groups;
    }, {});

    // Sort groups newest first
    const sortedGroups = Object.entries(groupedPosts).sort(([a], [b]) => b.localeCompare(a));

    if (loading) {
        return (
            <div className="main blog-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <main className="main blog-layout">
            <aside className="blog-sidebar">
                <div className="sidebar-header">
                    <h2 className="sidebar-title">Library</h2>
                </div>
                <nav className="category-nav">
                    <button
                        className={`category-item ${selectedCategory === 'All' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('All')}
                    >
                        <FiGrid className="category-icon" />
                        <span>All Posts</span>
                        <span className="count">{posts.length}</span>
                    </button>

                    <div className="category-divider">Folders</div>

                    {categories.map(cat => {
                        const count = posts.filter(p => p.category?.toLowerCase() === cat.name.toLowerCase()).length;
                        return (
                            <button
                                key={cat.id}
                                className={`category-item ${selectedCategory === cat.name ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat.name)}
                            >
                                <FiFolder className="category-icon" />
                                <span>{cat.name}</span>
                                <span className="count">{count}</span>
                            </button>
                        );
                    })}
                </nav>
            </aside>

            <section className="blog-main">
                <div className="blog-header">
                    <h1 className="blog-page-title">{selectedCategory === 'All' ? 'All Posts' : selectedCategory}</h1>
                    <p className="title">
                        {selectedCategory === 'All'
                            ? 'Thoughts on engineering, design, and building products.'
                            : `Articles in ${selectedCategory}`
                        }
                    </p>
                </div>

                {sortedGroups.length > 0 ? (
                    <div className="posts-by-month">
                        {sortedGroups.map(([key, group]) => (
                            <div key={key} className="month-group">
                                <h3 className="month-label">{group.label}</h3>
                                <div className="posts-grid">
                                    {group.posts.map((post) => (
                                        <BlogCard key={post.slug} post={post} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-posts">
                        <p>No articles found in this folder.</p>
                    </div>
                )}
            </section>
        </main>
    );
}

export default Blog;
