import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { FiEdit, FiTrash2, FiPlus, FiLogOut, FiFolder, FiLayers, FiCheck, FiX } from 'react-icons/fi';

function Admin() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({ name: 'All' }); // Changed to object to support ID if needed, but name is fine for filter
    const [status, setStatus] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        // Load posts
        const { data: postsData, error: postsError } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (postsError) console.error('Error fetching posts:', postsError);
        else setPosts(postsData || []);

        // Load categories
        const { data: categoriesData, error: categoriesError } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (categoriesError) console.error('Error fetching categories:', categoriesError);
        else setCategories(categoriesData || []);
    };

    const handleDelete = async (category, slug, title) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

        setStatus(`Deleting ${title}...`);

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('slug', slug);

        if (error) {
            setStatus(`Error: ${error.message}`);
        } else {
            setPosts(posts.filter(p => p.slug !== slug));
            setStatus(`Deleted "${title}"`);
            setTimeout(() => setStatus(''), 3000);
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        const { data, error } = await supabase
            .from('categories')
            .insert([{ name: newCategory.trim() }])
            .select();

        if (error) {
            setStatus(`Error: ${error.message}`);
        } else {
            setCategories([...categories, data[0]]);
            setNewCategory('');
            setShowNewCategoryInput(false);
            setStatus(`Created category: ${data[0].name}`);
            setTimeout(() => setStatus(''), 3000);
        }
    };

    const handleDeleteCategory = async (id, name) => {
        if (!confirm(`Are you sure you want to delete folder "${name}"? Posts in this folder will not be deleted but may be harder to find.`)) return;

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) {
            setStatus(`Error: ${error.message}`);
        } else {
            setCategories(categories.filter(c => c.id !== id));
            if (selectedCategory.name === name) setSelectedCategory({ name: 'All' });
            setStatus(`Deleted folder "${name}"`);
            setTimeout(() => setStatus(''), 3000);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const filteredPosts = selectedCategory.name === 'All'
        ? posts
        : posts.filter(p => p.category === selectedCategory.name);

    return (
        <div className="admin-container" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '80px', display: 'flex', gap: '32px', minHeight: '80vh' }}>

            {/* Sidebar */}
            <aside className="admin-sidebar" style={{ width: '250px', flexShrink: 0 }}>
                <h2 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiLayers /> Dashboard
                </h2>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                        onClick={() => setSelectedCategory({ name: 'All' })}
                        style={{
                            textAlign: 'left',
                            padding: '10px 12px',
                            background: selectedCategory.name === 'All' ? 'var(--bg-elevated)' : 'transparent',
                            border: selectedCategory.name === 'All' ? '1px solid var(--border)' : '1px solid transparent',
                            borderRadius: '6px',
                            color: selectedCategory.name === 'All' ? 'var(--accent)' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontWeight: 500
                        }}
                    >
                        All Posts
                    </button>

                    <div style={{ margin: '16px 0 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                        <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Folders</span>
                        <button
                            onClick={() => setShowNewCategoryInput(true)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--accent)',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                            title="New Folder"
                        >
                            <FiPlus size={16} />
                        </button>
                    </div>

                    {categories.map(cat => (
                        <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', group: 'category-item' }} className="category-item-wrapper">
                            <button
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    flex: 1,
                                    textAlign: 'left',
                                    padding: '8px 12px',
                                    background: selectedCategory.name === cat.name ? 'var(--bg-elevated)' : 'transparent',
                                    border: selectedCategory.name === cat.name ? '1px solid var(--border)' : '1px solid transparent',
                                    borderRadius: '6px',
                                    color: selectedCategory.name === cat.name ? 'var(--accent)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                <FiFolder size={14} flexShrink={0} /> <span style={{ truncate: true }}>{cat.name}</span>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCategory(cat.id, cat.name);
                                }}
                                className="delete-cat-btn"
                                style={{
                                    padding: '8px',
                                    color: 'var(--text-muted)',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    opacity: 0.5,
                                    transition: 'all 0.2s',
                                }}
                                title="Delete Folder"
                            >
                                <FiTrash2 size={12} />
                            </button>
                        </div>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
                    <button onClick={handleLogout} className="btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <FiLogOut /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1 }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ margin: 0 }}>{selectedCategory.name === 'All' ? 'All Posts' : selectedCategory.name}</h1>
                        <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>{filteredPosts.length} articles</p>
                    </div>
                    <Link
                        to={`/write?category=${selectedCategory.name !== 'All' ? selectedCategory.name : ''}`}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <FiPlus /> New Article
                    </Link>
                </header>

                {status && <div style={{ marginBottom: '24px', padding: '12px', background: 'var(--bg-elevated)', borderRadius: '8px', border: '1px solid var(--border)' }}>{status}</div>}

                <div className="posts-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredPosts.map(post => (
                        <div key={post.slug} className="admin-post-item" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px',
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px'
                        }}>
                            <div>
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{post.title}</h3>
                                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
                                    <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{post.category}</span> • {new Date(post.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Link to={`/edit/${post.category?.toLowerCase()}/${post.slug}`} className="btn" style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Edit">
                                    <FiEdit />
                                </Link>
                                <button
                                    onClick={() => handleDelete(post.category, post.slug, post.title)}
                                    className="btn"
                                    style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red', borderColor: 'rgba(255,0,0,0.2)' }}
                                    title="Delete"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredPosts.length === 0 && (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-elevated)', borderRadius: '8px', border: '1px dashed var(--border)' }}>
                            No posts found in this folder.
                            <br />
                            <Link to={`/write?category=${selectedCategory.name !== 'All' ? selectedCategory.name : ''}`} style={{ color: 'var(--accent)', marginTop: '8px', display: 'inline-block' }}>Write the first one</Link>
                        </div>
                    )}
                </div>
            </main>
            {showNewCategoryInput && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(5px)'
                }} onClick={() => setShowNewCategoryInput(false)}>
                    <div
                        style={{
                            background: 'var(--bg-card)',
                            padding: '32px',
                            borderRadius: '16px',
                            width: '100%',
                            maxWidth: '400px',
                            border: '1px solid var(--border)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 style={{ margin: '0 0 24px 0', fontSize: '24px' }}>New Folder</h3>
                        <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <input
                                autoFocus
                                placeholder="Folder Name"
                                value={newCategory}
                                onChange={e => setNewCategory(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    background: 'var(--bg-elevated)',
                                    color: 'var(--text)',
                                    fontSize: '18px',
                                    outline: 'none'
                                }}
                            />
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={() => { setShowNewCategoryInput(false); setNewCategory(''); }}
                                    style={{
                                        flex: 1,
                                        padding: '16px',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        background: 'transparent',
                                        color: 'var(--text-secondary)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '12px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newCategory.trim()}
                                    style={{
                                        flex: 1,
                                        padding: '16px',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        background: 'var(--accent)',
                                        color: 'black',
                                        border: 'none',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        opacity: newCategory.trim() ? 1 : 0.5
                                    }}
                                >
                                    Create Folder
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin;
