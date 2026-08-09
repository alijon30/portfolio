import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiFolder } from 'react-icons/fi'; // Assuming react-icons is installed

function BlogCard({ post }) {
    const { title, description, date, category, slug, readingTime } = post;

    return (
        <article className="blog-card">
            <div className="blog-card-meta">
                <span className="blog-category">{category}</span>
                <span className="blog-date">
                    {new Date(post.created_at || post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </span>
            </div>

            <Link to={`/blog/${category?.toLowerCase()}/${slug}`} className="blog-title-link">
                <h2 className="blog-title">{title}</h2>
            </Link>

            <p className="blog-excerpt">{description}</p>

            <Link to={`/blog/${category?.toLowerCase()}/${slug}`} className="read-more">
                Read Article
                <span className="arrow">→</span>
            </Link>
        </article>
    );
}

export default BlogCard;
