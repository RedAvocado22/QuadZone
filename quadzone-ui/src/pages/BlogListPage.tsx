// src/pages/BlogListPage.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BlogCard from "@/components/blog/BlogCard";
import BlogSidebar from "../components/blog/BlogSideBar";
import { getBlogs, getRecentBlogs } from "../api/blog";
import type { BlogOverviewResponse } from "@/api/types";

const BlogListPage: React.FC = () => {
    const [blogs, setBlogs] = useState<BlogOverviewResponse[]>([]);
    const [recentPosts, setRecentPosts] = useState<BlogOverviewResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch blogs
    const fetchBlogs = async (page: number = 0, search?: string) => {
        try {
            setLoading(true);
            const response = await getBlogs({
                page,
                size: 10,
                search
            });
            
            // Handle different response structures
            const blogs = response.content || [];
            const pageInfo = response.page || { number: 0, totalPages: 1 };
            
            setBlogs(blogs);
            setCurrentPage(pageInfo.number);
            setTotalPages(pageInfo.totalPages);
        } catch (err) {
            setError("Failed to load blog posts");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch recent posts for sidebar
    const fetchRecentPosts = async () => {
        try {
            const recent = await getRecentBlogs(5);
            setRecentPosts(recent);
        } catch (err) {
            console.error("Failed to load recent posts:", err);
        }
    };

    useEffect(() => {
        fetchBlogs();
        fetchRecentPosts();
    }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        fetchBlogs(0, query);
    };

    const handlePageChange = (page: number) => {
        fetchBlogs(page, searchQuery);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading && blogs.length === 0) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
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
                                <li
                                    className="breadcrumb-item flex-shrink-0 flex-xl-shrink-1 active"
                                    aria-current="page">
                                    Blog
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
                            {blogs.length === 0 ? (
                                <div className="text-center py-5">
                                    <h4>No blog posts found</h4>
                                    <p className="text-gray-90">Check back later for new content!</p>
                                </div>
                            ) : (
                                blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <nav aria-label="Blog pagination">
                                    <ul className="pagination justify-content-center mb-6">
                                        <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 0}>
                                                Previous
                                            </button>
                                        </li>
                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
                                                <button className="page-link" onClick={() => handlePageChange(i)}>
                                                    {i + 1}
                                                </button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages - 1}>
                                                Next
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-xl-3 col-wd">
                        <BlogSidebar recentPosts={recentPosts} onSearch={handleSearch} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogListPage;
