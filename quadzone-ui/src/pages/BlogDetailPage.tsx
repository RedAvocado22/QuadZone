// src/pages/BlogDetailPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import BlogSidebar from "../components/blog/BlogSidebar";
import type { BlogDetailResponse, BlogOverviewResponse } from "../api/types";
import { getBlogBySlug, getRecentBlogs, submitBlogComment } from "../api/blog";

const BlogDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<BlogDetailResponse | null>(null);
    const [recentPosts, setRecentPosts] = useState<BlogOverviewResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [commentForm, setCommentForm] = useState({
        name: "",
        email: "",
        website: "",
        comment: ""
    });
    const [submittingComment, setSubmittingComment] = useState(false);
    const [commentSuccess, setCommentSuccess] = useState(false);

    useEffect(() => {
        const fetchBlogDetail = async () => {
            if (!slug) {
                navigate("/blogs");
                return;
            }

            try {
                setLoading(true);
                const [blogData, recentData] = await Promise.all([getBlogBySlug(slug), getRecentBlogs(5)]);
                setBlog(blogData);
                setRecentPosts(recentData);
            } catch (err) {
                setError("Failed to load blog post");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogDetail();
    }, [slug, navigate]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!blog) return;

        try {
            setSubmittingComment(true);
            await submitBlogComment(
                blog.id,
                commentForm.name,
                commentForm.email,
                commentForm.comment
            );

            // Reset form
            setCommentForm({ name: "", email: "", website: "", comment: "" });
            setCommentSuccess(true);

            // Reload blog data to show new comment
            const updatedBlog = await getBlogBySlug(slug!);
            setBlog(updatedBlog);

            // Hide success message after 3 seconds
            setTimeout(() => setCommentSuccess(false), 3000);
        } catch (err) {
            console.error("Error submitting comment:", err);
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary">
                        <output>Loading...</output>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger" role="alert">
                    {error || "Blog post not found"}
                </div>
                <Link to="/blogs" className="btn btn-primary">
                    Back to Blog
                </Link>
            </div>
        );
    }

    return (
        <>
            {/* Breadcrumb */}
            <div className="bg-gray-13 bg-md-transparent">
                <div className="container">
                    <div className="my-md-3">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-3 flex-nowrap flex-xl-wrap overflow-auto overflow-xl-visble">
                                <li className="breadcrumb-item flex-shrink-0 flex-xl-shrink-1">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item flex-shrink-0 flex-xl-shrink-1">
                                    <Link to="/blogs">Blog</Link>
                                </li>
                                <li
                                    className="breadcrumb-item flex-shrink-0 flex-xl-shrink-1 active"
                                    aria-current="page">
                                    {blog.title}
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container py-8">
                <div className="row">
                    <div className="col-xl-9 col-wd">
                        <div className="min-width-1100-wd">
                            {/* Article Header */}
                            <article className="mb-10">
                                {/* Hero Image */}
                                <div className="mb-6 position-relative">
                                    <img
                                        className="img-fluid w-100 rounded"
                                        style={{ maxHeight: "500px", objectFit: "cover" }}
                                        src={blog.thumbnailUrl || "https://via.placeholder.com/1500x730"}
                                        alt={blog.title}
                                    />
                                </div>

                                {/* Title and Metadata */}
                                <div className="mb-5">
                                    <h1 className="font-size-32 font-weight-bold text-dark mb-4" style={{ lineHeight: "1.3" }}>
                                        {blog.title}
                                    </h1>

                                    {/* Metadata Bar */}
                                    <div className="d-flex flex-wrap align-items-center mb-4 pb-3 border-bottom">
                                        <div className="d-flex align-items-center mr-4 mb-2 mb-md-0">
                                            <div className="width-40 height-40 rounded-circle d-flex align-items-center justify-content-center text-white font-weight-bold mr-3" style={{ backgroundColor: "#667eea" }}>
                                                {(blog.authorName || 'A').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-weight-bold text-dark">{blog.authorName || 'Unknown Author'}</div>
                                                <small className="text-gray-5">Author</small>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center mr-4 mb-2 mb-md-0">
                                            <i className="ec ec-calendar mr-2 font-size-18" style={{ color: "#667eea" }}></i>
                                            <span className="text-gray-90">{formatDate(blog.createdAt)}</span>
                                        </div>
                                        {blog.comments && (
                                            <div className="d-flex align-items-center mb-2 mb-md-0">
                                                <i className="ec ec-comment mr-2 font-size-18" style={{ color: "#667eea" }}></i>
                                                <span className="text-gray-90">{blog.comments.length} Comment{blog.comments.length !== 1 ? 's' : ''}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Blog Content */}
                                <div
                                    className="blog-content text-gray-90 font-size-16"
                                    style={{
                                        lineHeight: "1.8",
                                        color: "#555"
                                    }}
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />
                            </article>

                            {/* Author Bio */}
                            <div className="bg-gray-1 border rounded p-5 mb-10">
                                <div className="d-flex align-items-start">
                                    <div className="flex-shrink-0 mr-4">
                                        <div className="width-80 height-80 rounded-circle d-flex align-items-center justify-content-center text-white font-size-32 font-weight-bold" style={{ backgroundColor: "#667eea" }}>
                                            {(blog.authorName || 'A').charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h3 className="font-size-20 font-weight-bold text-dark mb-2">About the Author</h3>
                                        <h4 className="font-size-16 font-weight-semibold mb-3" style={{ color: "#667eea" }}>{blog.authorName || 'Unknown Author'}</h4>
                                        <p className="text-gray-90 mb-0" style={{ lineHeight: "1.7" }}>
                                            {blog.excerpt || "A passionate writer sharing insights and knowledge with our community."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <div className="d-flex justify-content-between align-items-center mb-10 py-4 border-top border-bottom">
                                <Link
                                    className="btn btn-soft-secondary font-weight-normal px-4"
                                    to="/blog"
                                >
                                    <i className="ec ec-arrow-left-categproes mr-2"></i>
                                    Back to Blog
                                </Link>
                                <div className="text-gray-5">
                                    Share this post
                                </div>
                            </div>

                            {/* Existing Comments */}
                            {(blog.comments && blog.comments.length > 0) && (
                                <div className="mb-10">
                                    <div className="mb-6">
                                        <h3 className="font-size-24 font-weight-bold text-dark mb-0 pb-3 border-bottom">
                                            <i className="ec ec-comment mr-2" style={{ color: "#667eea" }}></i>
                                            Comments ({blog.comments.length})
                                        </h3>
                                    </div>
                                    <div className="mb-8">
                                        {blog.comments.map((comment) => (
                                            <article key={comment.id} className="mb-6 pb-6 border-bottom">
                                                <div className="d-flex align-items-start">
                                                    <div className="flex-shrink-0 mr-4">
                                                        <div className="width-60 height-60 rounded-circle d-flex align-items-center justify-content-center text-white font-size-20 font-weight-bold" style={{ backgroundColor: "#667eea" }}>
                                                            {comment.authorName.charAt(0).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex align-items-center mb-2">
                                                            <h5 className="font-weight-bold text-dark mb-0 mr-3">{comment.authorName}</h5>
                                                            <small className="text-gray-5">
                                                                <i className="ec ec-calendar mr-1"></i>
                                                                {formatDate(comment.createdAt)}
                                                            </small>
                                                        </div>
                                                        <p className="text-gray-90 mb-0" style={{ lineHeight: "1.7" }}>
                                                            {comment.content}
                                                        </p>
                                                    </div>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Comment Form */}
                            <div className="mb-10">
                                <div className="mb-6">
                                    <h3 className="font-size-24 font-weight-bold text-dark mb-0 pb-3 border-bottom">
                                        <i className="ec ec-edit mr-2" style={{ color: "#667eea" }}></i>
                                        Leave a Reply
                                    </h3>
                                </div>

                                {commentSuccess && (
                                    <div className="alert alert-success mb-4 d-flex align-items-center" role="alert">
                                        <i className="ec ec-check mr-2 font-size-18"></i>
                                        <span>Thank you! Your comment has been submitted and is pending approval.</span>
                                    </div>
                                )}

                                <p className="text-gray-90 mb-4">
                                    Your email address will not be published. Required fields are marked{" "}
                                    <span className="text-danger">*</span>
                                </p>

                                <form onSubmit={handleCommentSubmit} className="bg-gray-1 rounded p-5">
                                    <div className="mb-4">
                                        <label htmlFor="commentText" className="form-label font-weight-bold text-dark">
                                            Comment <span className="text-danger">*</span>
                                        </label>
                                        <textarea
                                            id="commentText"
                                            className="form-control"
                                            style={{ minHeight: "150px", padding: "15px" }}
                                            rows={6}
                                            placeholder="Write your comment here..."
                                            value={commentForm.comment}
                                            onChange={(e) =>
                                                setCommentForm({ ...commentForm, comment: e.target.value })
                                            }
                                            required
                                            disabled={submittingComment}
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-4">
                                                <label htmlFor="commentName" className="form-label font-weight-bold text-dark">
                                                    Name <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    id="commentName"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Your name"
                                                    value={commentForm.name}
                                                    onChange={(e) =>
                                                        setCommentForm({ ...commentForm, name: e.target.value })
                                                    }
                                                    required
                                                    disabled={submittingComment}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-4">
                                                <label htmlFor="commentEmail" className="form-label font-weight-bold text-dark">
                                                    Email address <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    id="commentEmail"
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="your.email@example.com"
                                                    value={commentForm.email}
                                                    onChange={(e) =>
                                                        setCommentForm({ ...commentForm, email: e.target.value })
                                                    }
                                                    required
                                                    disabled={submittingComment}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="mb-4">
                                                <label htmlFor="commentWebsite" className="form-label font-weight-bold text-dark">
                                                    Website <small className="text-gray-5">(optional)</small>
                                                </label>
                                                <input
                                                    id="commentWebsite"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="https://yourwebsite.com"
                                                    value={commentForm.website}
                                                    onChange={(e) =>
                                                        setCommentForm({ ...commentForm, website: e.target.value })
                                                    }
                                                    disabled={submittingComment}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-0">
                                        <button
                                            type="submit"
                                            className="btn px-5 py-2 font-weight-bold text-white"
                                            style={{ backgroundColor: "#667eea", borderColor: "#667eea" }}
                                            disabled={submittingComment}
                                            onMouseEnter={(e) => !submittingComment && (e.currentTarget.style.backgroundColor = "#5568d3")}
                                            onMouseLeave={(e) => !submittingComment && (e.currentTarget.style.backgroundColor = "#667eea")}
                                        >
                                            {submittingComment ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                                    Posting...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="ec ec-check mr-2"></i>
                                                    Post Comment
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-xl-3 col-wd">
                        <BlogSidebar
                            recentPosts={recentPosts}
                            onSearch={(query) => navigate(`/blogs?search=${query}`)}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogDetailPage;
