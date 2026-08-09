import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import RichTextEditor from '../components/RichTextEditor';
import { FiArrowLeft, FiX } from 'react-icons/fi';

function Editor() {
    const { category, slug } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const isEditMode = !!slug;
    const categoryFromUrl = searchParams.get('category') || '';

    const [postId, setPostId] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [postSlug, setPostSlug] = useState('');
    const [postCategory, setPostCategory] = useState(categoryFromUrl);
    const [categories, setCategories] = useState([]);
    const [status, setStatus] = useState('');
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const titleRef = useRef(null);

    useEffect(() => {
        loadData();
    }, [category, slug, isEditMode]);

    // Auto-resize title textarea
    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.style.height = 'auto';
            titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
        }
    }, [title]);

    const loadData = async () => {
        const { data: cats } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        setCategories(cats || []);

        // Default to first category if none was set
        if (!isEditMode && !postCategory && cats?.length > 0) {
            setPostCategory(cats[0].name);
        }

        if (isEditMode) {
            const { data: post, error } = await supabase
                .from('posts')
                .select('*')
                .eq('slug', slug)
                .ilike('category', category)
                .single();

            if (error || !post) {
                setStatus('Post not found');
                return;
            }

            setPostId(post.id);
            setTitle(post.title);
            setDescription(post.description || '');
            setPostSlug(post.slug);
            setPostCategory(post.category);
            // Content is now stored as HTML — load it directly
            setContent(post.content || '');
        }

        setLoaded(true);
    };

    const generateSlug = (str) => {
        return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const handlePublish = async () => {
        const finalSlug = postSlug || generateSlug(title);
        setStatus('Saving...');

        try {
            // Check for slug collision
            let query = supabase
                .from('posts')
                .select('id')
                .eq('slug', finalSlug)
                .eq('category', postCategory);

            if (postId) {
                query = query.neq('id', postId);
            }

            const { data: existing, error: checkError } = await query.maybeSingle();
            if (checkError) throw checkError;
            if (existing) throw new Error('A post with this slug already exists in this category.');

            const postData = {
                title,
                category: postCategory,
                slug: finalSlug,
                description,
                content, // Store HTML directly — no more conversion
            };

            if (postId) postData.id = postId;

            const { error } = await supabase
                .from('posts')
                .upsert(postData, { onConflict: 'id' });

            if (error) throw error;

            setStatus('Published!');
            setTimeout(() => {
                navigate(`/blog/${postCategory.toLowerCase()}/${finalSlug}`);
            }, 800);

        } catch (err) {
            console.error(err);
            setStatus(`Error: ${err.message}`);
        }
    };

    if (!loaded && isEditMode) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="writer-page">
            {/* Top bar */}
            <header className="writer-topbar">
                <button
                    type="button"
                    onClick={() => navigate('/admin')}
                    className="writer-back-btn"
                >
                    <FiArrowLeft size={18} />
                </button>

                <div className="writer-topbar-right">
                    {status && (
                        <span className={`writer-status ${status.startsWith('Error') ? 'error' : ''}`}>
                            {status}
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={() => {
                            if (!title.trim()) {
                                setStatus('Please add a title');
                                setTimeout(() => setStatus(''), 2000);
                                return;
                            }
                            setPostSlug(postSlug || generateSlug(title));
                            setShowPublishModal(true);
                        }}
                        className="writer-publish-btn"
                    >
                        {isEditMode ? 'Update' : 'Publish'}
                    </button>
                </div>
            </header>

            {/* Writing area */}
            <main className="writer-content">
                <textarea
                    ref={titleRef}
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="writer-title"
                    rows={1}
                />

                <textarea
                    placeholder="Write a subtitle..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="writer-subtitle"
                    rows={1}
                    onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                />

                <div className="writer-editor-area">
                    <RichTextEditor
                        content={content}
                        onChange={setContent}
                    />
                </div>
            </main>

            {/* Publish Modal */}
            {showPublishModal && (
                <div className="publish-overlay" onClick={() => setShowPublishModal(false)}>
                    <div className="publish-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="publish-modal-header">
                            <h2>Publish Settings</h2>
                            <button
                                onClick={() => setShowPublishModal(false)}
                                className="publish-close-btn"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        <div className="publish-modal-body">
                            <div className="publish-field">
                                <label>Category</label>
                                <select
                                    value={postCategory}
                                    onChange={(e) => setPostCategory(e.target.value)}
                                    className="publish-select"
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                    {categories.length === 0 && <option value="general">general</option>}
                                </select>
                            </div>

                            <div className="publish-field">
                                <label>URL Slug</label>
                                <input
                                    value={postSlug}
                                    onChange={(e) => setPostSlug(e.target.value)}
                                    className="publish-input"
                                    placeholder="auto-generated-from-title"
                                />
                                <span className="publish-hint">
                                    /blog/{postCategory}/{postSlug || generateSlug(title) || 'your-post'}
                                </span>
                            </div>

                            <div className="publish-field">
                                <label>Preview Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="publish-textarea"
                                    placeholder="A short description for preview cards..."
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="publish-modal-footer">
                            {status && (
                                <span className={`writer-status ${status.startsWith('Error') ? 'error' : ''}`}>
                                    {status}
                                </span>
                            )}
                            <button
                                onClick={handlePublish}
                                className="publish-confirm-btn"
                                disabled={status === 'Saving...'}
                            >
                                {status === 'Saving...' ? 'Publishing...' : isEditMode ? 'Update Post' : 'Publish Now'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .writer-page {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    background: var(--bg);
                }

                /* Top bar */
                .writer-topbar {
                    position: sticky;
                    top: 0;
                    z-index: 40;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px 24px;
                    background: var(--bg);
                    border-bottom: 1px solid var(--border);
                }

                .writer-back-btn {
                    padding: 8px;
                    background: transparent;
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    color: var(--text);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    transition: all 0.15s;
                }

                .writer-back-btn:hover {
                    background: var(--bg-elevated);
                }

                .writer-topbar-right {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .writer-status {
                    font-size: 13px;
                    color: var(--accent);
                }

                .writer-status.error {
                    color: #ff6b6b;
                }

                .writer-publish-btn {
                    padding: 8px 24px;
                    background: var(--accent);
                    border: none;
                    border-radius: 20px;
                    color: #000;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.15s;
                }

                .writer-publish-btn:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }

                /* Writing area */
                .writer-content {
                    max-width: 900px;
                    width: 100%;
                    margin: 0 auto;
                    padding: 60px 24px 200px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .writer-title {
                    font-family: 'Quicksand', sans-serif;
                    font-size: 42px;
                    font-weight: 700;
                    color: var(--text);
                    background: transparent;
                    border: none;
                    outline: none;
                    resize: none;
                    overflow: hidden;
                    line-height: 1.2;
                    padding: 0;
                    margin: 0 0 8px;
                    width: 100%;
                }

                .writer-title::placeholder {
                    color: var(--text-muted);
                    opacity: 0.5;
                }

                .writer-subtitle {
                    font-family: 'Georgia', 'Charter', serif;
                    font-size: 20px;
                    color: var(--text-muted);
                    background: transparent;
                    border: none;
                    outline: none;
                    resize: none;
                    overflow: hidden;
                    line-height: 1.5;
                    padding: 0;
                    margin: 0 0 32px;
                    width: 100%;
                }

                .writer-subtitle::placeholder {
                    color: var(--text-muted);
                    opacity: 0.4;
                }

                .writer-editor-area {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-height: 400px;
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    padding: 24px;
                    background: var(--bg-elevated);
                }

                /* Publish Modal */
                .publish-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(5px);
                    animation: fadeIn 0.15s ease-out;
                }

                .publish-modal {
                    background: var(--bg-elevated);
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    width: 100%;
                    max-width: 480px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
                    animation: modalIn 0.2s ease-out;
                }

                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }

                .publish-modal-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 24px;
                    border-bottom: 1px solid var(--border);
                }

                .publish-modal-header h2 {
                    margin: 0;
                    font-size: 18px;
                }

                .publish-close-btn {
                    padding: 4px;
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    display: flex;
                    border-radius: 4px;
                    transition: color 0.15s;
                }

                .publish-close-btn:hover {
                    color: var(--text);
                }

                .publish-modal-body {
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .publish-field {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .publish-field label {
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .publish-select,
                .publish-input,
                .publish-textarea {
                    padding: 10px 14px;
                    background: var(--bg);
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    color: var(--text);
                    font-size: 15px;
                    outline: none;
                    transition: border-color 0.15s;
                }

                .publish-select:focus,
                .publish-input:focus,
                .publish-textarea:focus {
                    border-color: var(--accent);
                }

                .publish-select {
                    appearance: none;
                    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
                    background-repeat: no-repeat;
                    background-position: right 12px center;
                    background-size: 10px;
                    padding-right: 36px;
                }

                .publish-textarea {
                    resize: none;
                    font-family: inherit;
                }

                .publish-hint {
                    font-size: 12px;
                    color: var(--text-muted);
                    font-family: monospace;
                }

                .publish-modal-footer {
                    padding: 16px 24px;
                    border-top: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 12px;
                }

                .publish-confirm-btn {
                    padding: 10px 28px;
                    background: var(--accent);
                    border: none;
                    border-radius: 8px;
                    color: #000;
                    font-weight: 600;
                    font-size: 15px;
                    cursor: pointer;
                    transition: all 0.15s;
                }

                .publish-confirm-btn:hover {
                    opacity: 0.9;
                }

                .publish-confirm-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
}

export default Editor;
