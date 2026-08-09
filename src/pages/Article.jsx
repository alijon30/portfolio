import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { useEffect, useState } from 'react';
import 'highlight.js/styles/github-dark.css';
import { supabase } from '../lib/supabase';
import { FiArrowLeft } from 'react-icons/fi';

function Article() {
    const { category, slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        async function fetchPost() {
            setLoading(true);
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('slug', slug)
                .ilike('category', category)
                .single();

            if (error) {
                console.error('Error fetching post:', error);
            } else {
                setPost(data);
            }
            setLoading(false);
        }
        fetchPost();
    }, [category, slug]);

    if (loading) return <div className="main" style={{ textAlign: 'center', paddingTop: '100px' }}><div className="loading-spinner"></div></div>;
    if (!post) return <div className="main" style={{ textAlign: 'center', paddingTop: '100px' }}>Article not found</div>;

    const isHtml = post.content?.trimStart().startsWith('<');

    return (
        <article className="main article-page">
            <div className="article-page-inner">
                <Link to="/blog" className="article-back">
                    <FiArrowLeft size={16} />
                    <span>All Articles</span>
                </Link>

                <header className="article-page-header">
                    <div className="article-page-meta">
                        <span className="article-page-category">{post.category}</span>
                        <span className="article-page-dot">&middot;</span>
                        <time>{new Date(post.created_at || post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                    </div>
                    <h1 className="article-page-title">{post.title}</h1>
                    {post.description && <p className="article-page-subtitle">{post.description}</p>}
                </header>

                <div className="article-page-divider" />

                {isHtml ? (
                    <div
                        className="article-body"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                ) : (
                    <div className="article-body">
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                            {post.content}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </article>
    );
}

export default Article;
