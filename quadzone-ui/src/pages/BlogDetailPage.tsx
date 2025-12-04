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
                navigate("/blog");
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
                <Link to="/blog" className="btn btn-primary">
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
                                    <Link to="/blog">Blog</Link>
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
            <div className="container">
                <div className="row">
                    <div className="col-xl-9 col-wd">
                        <div className="min-width-1100-wd">
                            {/* Article */}
                            <article className="card mb-8 border-0">
                                <img
                                    className="img-fluid"
                                    src={blog.thumbnailUrl || "https://via.placeholder.com/1500x730"}
                                    alt={blog.title}
                                />
                                <div className="card-body pt-5 pb-0 px-0">
                                    <div className="d-block d-md-flex flex-center-between mb-4 mb-md-0">
                                        <h4 className="mb-md-3 mb-1">{blog.title}</h4>
                                    </div>
                                    <div className="mb-3 pb-3 border-bottom">
                                        <div className="list-group list-group-horizontal flex-wrap list-group-borderless align-items-center mx-n0dot5">
                                            <span className="mx-0dot5 text-gray-5">{formatDate(blog.createdAt)}</span>
                                        </div>
                                    </div>

                                    {/* Blog Content */}
                                    <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }} />
                                </div>
                            </article>

                            {/* Author Bio */}
                            <div className="bg-gray-1 px-3 py-5 mb-10">
                                <div className="d-block d-md-flex media">
                                    <div className="u-xl-avatar mb-4 mb-md-0 mr-md-4">
                                        <div className="width-100 height-100 bg-primary rounded-circle d-flex align-items-center justify-content-center text-white font-size-30">
                                            {(blog.authorName || 'A').charAt(0)}
                                        </div>
                                    </div>
                                    <div className="media-body">
                                        <h3 className="font-size-18 mb-3">{blog.authorName || 'Unknown Author'}</h3>
                                        <p className="mb-0">{blog.excerpt}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <ul className="nav justify-content-between mb-11">
                                <li className="nav-item m-0">
                                    <Link className="nav-link text-gray-27 px-0" to="/blogs">
                                        <span className="mr-1">←</span> Back to Blog
                                    </Link>
                                </li>
                            </ul>

                            {/* Existing Comments */}
                            {(blog.comments && blog.comments.length > 0) && (
                                <div className="mb-10">
                                    <div className="border-bottom border-color-1 mb-6">
                                        <h4 className="section-title mb-0 pb-3 font-size-25">Comments ({blog.comments.length})</h4>
                                    </div>
                                    <div className="mb-8">
                                        {blog.comments.map((comment) => (
                                            <article key={comment.id} className="mb-6 pb-6 border-bottom">
                                                <div className="d-flex mb-2">
                                                    <div className="u-avatar-circle mr-3">
                                                        <div className="width-50 height-50 bg-light rounded-circle d-flex align-items-center justify-content-center font-size-20 font-weight-bold">
                                                            {comment.authorName.charAt(0).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="w-100">
                                                        <h5 className="mb-1">{comment.authorName}</h5>
                                                        <small className="text-gray-5">{formatDate(comment.createdAt)}</small>
                                                    </div>
                                                </div>
                                                <p className="text-gray-90 ml-5">{comment.content}</p>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Comment Form */}
                            <div className="mb-10">
                                <div className="border-bottom border-color-1 mb-6">
                                    <h4 className="section-title mb-0 pb-3 font-size-25">Leave a Reply</h4>
                                </div>
                                
                                {commentSuccess && (
                                    <div className="alert alert-success mb-4" role="alert">
                                        Thank you! Your comment has been submitted and is pending approval.
                                    </div>
                                )}
                                
                                <p className="text-gray-90">
                                    Your email address will not be published. Required fields are marked{" "}
                                    <span className="text-dark">*</span>
                                </p>
                                <form onSubmit={handleCommentSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="commentText" className="form-label">Comment</label>
                                        <div className="input-group">
                                            <textarea
                                                id="commentText"
                                                className="form-control p-5"
                                                rows={4}
                                                value={commentForm.comment}
                                                onChange={(e) =>
                                                    setCommentForm({ ...commentForm, comment: e.target.value })
                                                }
                                                required
                                                disabled={submittingComment}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-4">
                                                <label htmlFor="commentName" className="form-label">
                                                    Name <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    id="commentName"
                                                    type="text"
                                                    className="form-control"
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
                                                <label htmlFor="commentEmail" className="form-label">
                                                    Email address <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    id="commentEmail"
                                                    type="email"
                                                    className="form-control"
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
                                                <label htmlFor="commentWebsite" className="form-label">Website</label>
                                                <input
                                                    id="commentWebsite"
                                                    type="text"
                                                    className="form-control"
                                                    value={commentForm.website}
                                                    onChange={(e) =>
                                                        setCommentForm({ ...commentForm, website: e.target.value })
                                                    }
                                                    disabled={submittingComment}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <button type="submit" className="btn btn-primary-dark-w px-5" disabled={submittingComment}>
                                            {submittingComment ? "Posting..." : "Post Comment"}
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
                            onSearch={(query) => navigate(`/blog?search=${query}`)}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogDetailPage;
