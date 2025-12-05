// src/components/blog/BlogCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { BlogOverviewResponse } from 'src/api/types';

interface BlogCardProps {
    blog: BlogOverviewResponse;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <article className="card mb-13 border-0">
            <div className="row">
                <div className="col-lg-4 mb-5 mb-lg-0">
                    <Link to={`/blog/${blog.slug}`} className="d-block">
                        <img
                            className="img-fluid min-height-250 object-fit-cover"
                            src={blog.thumbnailUrl || 'https://via.placeholder.com/400x250'}
                            alt={blog.title}
                        />
                    </Link>
                </div>
                <div className="col-lg-8">
                    <div className="card-body p-0">
                        <h4 className="mb-3">
                            <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                        </h4>
                        <div className="mb-3 pb-3 border-bottom">
                            <div className="list-group list-group-horizontal flex-wrap list-group-borderless align-items-center mx-n0dot5">
                                <span className="mx-0dot5 text-gray-5">{blog.authorName}</span>
                                <span className="mx-2 font-size-n5 mt-1 text-gray-5">
                                    <i className="fas fa-circle"></i>
                                </span>
                                <span className="mx-0dot5 text-gray-5">
                                    {formatDate(blog.createdAt)}
                                </span>
                            </div>
                        </div>
                        <p>{blog.excerpt}</p>
                        <div className="flex-horizontal-center">
                            <Link
                                to={`/blog/${blog.slug}`}
                                className="btn btn-soft-secondary-w mb-md-0 font-weight-normal px-5 px-md-4 px-lg-5"
                            >
                                Read More
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default BlogCard;
