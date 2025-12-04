import React from 'react';
import { Link } from 'react-router-dom';
import type { BlogOverviewResponse } from '../../api/types';

interface BlogSidebarProps {
    recentPosts: BlogOverviewResponse[];
    onSearch?: (query: string) => void;
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({ recentPosts, onSearch }) => {
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    return (
        <>
            {/* Search */}
            <aside className="mb-7">
                <form onSubmit={handleSearch}>
                    <div className="d-flex align-items-center">
                        <label className="sr-only" htmlFor="blogSearch">Search Electro blog</label>
                        <div className="input-group">
                            <input 
                                type="text" 
                                className="form-control px-4" 
                                name="search" 
                                id="blogSearch" 
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary text-nowrap ml-3">
                            <span className="fas fa-search font-size-1 mr-2"></span> Search
                        </button>
                    </div>
                </form>
            </aside>

            {/* About Blog */}
            <aside className="mb-7">
                <div className="border-bottom border-color-1 mb-5">
                    <h3 className="section-title section-title__sm mb-0 pb-2 font-size-18">About Blog</h3>
                </div>
                <p className="text-gray-90 mb-0">
                    Discover the latest technology trends, product reviews, and expert insights 
                    in the world of electronics and gadgets.
                </p>
            </aside>

            {/* Recent Posts */}
            <aside className="mb-7">
                <div className="border-bottom border-color-1 mb-5">
                    <h3 className="section-title section-title__sm mb-0 pb-2 font-size-18">Recent Posts</h3>
                </div>
                {(recentPosts || []).map((post) => (
                    <article key={post.id} className="mb-4">
                        <div className="media">
                            <div className="width-75 height-75 mr-3">
                                <img 
                                    className="img-fluid object-fit-cover" 
                                    src={post.thumbnailUrl || 'https://via.placeholder.com/75x75'} 
                                    alt={post.title}
                                />
                            </div>
                            <div className="media-body">
                                <h4 className="font-size-14 mb-1">
                                    <Link to={`/blogs/${post.slug}`} className="text-gray-39">
                                        {post.title}
                                    </Link>
                                </h4>
                                <span className="text-gray-5">{formatDate(post.createdAt)}</span>
                            </div>
                        </div>
                    </article>
                ))}
            </aside>
        </>
    );
};

export default BlogSidebar;