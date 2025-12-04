import { useState, useRef, useEffect } from 'react';
import { useProfile } from '../hooks/userProfile';
import { useUser } from '../hooks/useUser';
import { useMyOrders } from '../hooks/useMyOrders';
import { format } from 'date-fns';
import { ordersApi, type OrderDetails } from '../api/orders';
import { reviewsApi, type CreateReviewRequest, type UpdateReviewRequest } from '../api/reviews';
import type { OrderItem, Review } from '../api/types';
import '../UserProfilePage.css';

const UserProfilePage = () => {
    const { profile, loading, isInitialLoading, updateProfile, uploadAvatar, changePassword } = useProfile();
    const { logout } = useUser();
    const [activeTab, setActiveTab] = useState('account-info');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [ordersPage, setOrdersPage] = useState(0);
    const { orders, loading: ordersLoading, totalPages } = useMyOrders({
        page: ordersPage,
        pageSize: 5,
        enabled: activeTab === 'orders'
    });

    // Order items modal state
    const [showOrderItemsModal, setShowOrderItemsModal] = useState(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState<OrderDetails | null>(null);
    const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);

    // Review modal state
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewProduct, setReviewProduct] = useState<OrderItem | null>(null);
    const [reviewData, setReviewData] = useState<{ rating: number; title: string; text: string }>({
        rating: 5,
        title: '',
        text: '',
    });
    const [existingReview, setExistingReview] = useState<Review | null>(null);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [checkingReview, setCheckingReview] = useState(false);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
    };

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        city: '',
        dateOfBirth: '',
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                phoneNumber: profile.phoneNumber || '',
                address: profile.address || '',
                city: profile.city || '',
                dateOfBirth: profile.dateOfBirth || '',
            });
        }
    }, [profile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateProfile(formData);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        uploadAvatar(file);
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await changePassword({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
            confirmPassword: passwordData.confirmPassword,
        });

        if (success) {
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        }
    };

    // Handle view order items
    const handleViewOrderItems = async (orderId: number) => {
        setLoadingOrderDetails(true);
        setShowOrderItemsModal(true);
        try {
            const details = await ordersApi.getMyOrderDetails(orderId);
            setSelectedOrderDetails(details);
        } catch (error) {
            console.error('Failed to load order details:', error);
            setSelectedOrderDetails(null);
        } finally {
            setLoadingOrderDetails(false);
        }
    };

    // Handle open review modal
    const handleOpenReviewModal = async (item: OrderItem) => {
        setReviewProduct(item);
        setCheckingReview(true);
        setShowReviewModal(true);
        
        try {
            const result = await reviewsApi.checkReview(item.productId);
            if (result.hasReviewed && result.review) {
                setExistingReview(result.review);
                setReviewData({
                    rating: result.review.rating,
                    title: result.review.title || '',
                    text: result.review.text,
                });
            } else {
                setExistingReview(null);
                setReviewData({ rating: 5, title: '', text: '' });
            }
        } catch (error) {
            console.error('Failed to check review status:', error);
            setExistingReview(null);
            setReviewData({ rating: 5, title: '', text: '' });
        } finally {
            setCheckingReview(false);
        }
    };

    // Handle close review modal
    const handleCloseReviewModal = () => {
        setShowReviewModal(false);
        setReviewProduct(null);
        setExistingReview(null);
        setReviewData({ rating: 5, title: '', text: '' });
    };

    // Handle submit review (create or update)
    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewProduct) return;

        setReviewLoading(true);
        try {
            if (existingReview) {
                // Update existing review
                const updateData: UpdateReviewRequest = {
                    rating: reviewData.rating,
                    title: reviewData.title || undefined,
                    text: reviewData.text,
                };
                await reviewsApi.update(existingReview.id, updateData);
                alert('Review updated successfully!');
            } else {
                // Create new review
                const createData: CreateReviewRequest = {
                    productId: reviewProduct.productId,
                    rating: reviewData.rating,
                    title: reviewData.title || undefined,
                    text: reviewData.text,
                };
                await reviewsApi.create(createData);
                alert('Review submitted successfully!');
            }
            handleCloseReviewModal();
        } catch (error) {
            console.error('Failed to submit review:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to submit review. Please try again.';
            alert(errorMessage);
        } finally {
            setReviewLoading(false);
        }
    };

    // Handle delete review
    const handleDeleteReview = async () => {
        if (!existingReview) return;
        
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        setReviewLoading(true);
        try {
            await reviewsApi.delete(existingReview.id);
            alert('Review deleted successfully!');
            handleCloseReviewModal();
        } catch (error) {
            console.error('Failed to delete review:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete review. Please try again.';
            alert(errorMessage);
        } finally {
            setReviewLoading(false);
        }
    };

    if (isInitialLoading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    Failed to load profile. Please try again.
                </div>
            </div>
        );
    }

    const avatarUrl = avatarPreview || profile.avatarUrl || '/assets/images/product/author1.png';
    const fullName = `${profile.firstName} ${profile.lastName}`;

    return (
        <main className="main-wrapper">
            <div className="axil-dashboard-area axil-section-gap">
                <div className="container">
                    <div className="axil-dashboard-warp">
                        {/* Profile Header */}
                        <div className="axil-dashboard-author">
                            <div className="media">
                                <div className="thumbnail position-relative">
                                    <img
                                        src={avatarUrl}
                                        alt="User Avatar"
                                        className="rounded-circle"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            objectFit: 'cover',
                                            cursor: 'pointer',
                                        }}
                                        onClick={handleAvatarClick}
                                    />
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        style={{ display: 'none' }}
                                    />
                                    <button
                                        className="avatar-edit-btn"
                                        onClick={handleAvatarClick}
                                        title="Change avatar"
                                    >
                                        <i className="fas fa-camera"></i>
                                    </button>
                                </div>
                                <div className="media-body">
                                    <h5 className="title mb-0">
                                        Hello <span>{fullName}</span>!
                                    </h5>
                                    <span className="joining-date">
                                        Member since{' '}
                                        {profile.createdAt &&
                                            format(new Date(profile.createdAt), 'MMM yyyy')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            {/* Sidebar */}
                            <div className="col-xl-3 col-md-4">
                                <aside className="axil-dashboard-aside">
                                    <nav className="axil-dashboard-nav">
                                        <div className="nav nav-tabs flex-column" role="tablist">
                                            <button
                                                className={`nav-item nav-link ${activeTab === 'account-info' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('account-info')}
                                            >
                                                <i className="fas fa-user"></i>Account Information
                                            </button>
                                            <button
                                                className={`nav-item nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('orders')}
                                            >
                                                <i className="fas fa-shopping-basket"></i>Orders
                                            </button>
                                            <button
                                                className={`nav-item nav-link ${activeTab === 'edit-info' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('edit-info')}
                                            >
                                                <i className="fas fa-edit"></i>Edit Information
                                            </button>
                                            <button
                                                className={`nav-item nav-link ${activeTab === 'change-password' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('change-password')}
                                            >
                                                <i className="fas fa-key"></i>Change Password
                                            </button>
                                            <button
                                                className="nav-item nav-link"
                                                onClick={handleLogout}
                                            >
                                                <i className="fas fa-sign-out-alt"></i>Logout
                                            </button>
                                        </div>
                                    </nav>
                                </aside>
                            </div>

                            {/* Main Content */}
                            <div className="col-xl-9 col-md-8">
                                <div className="tab-content">
                                    {/* Account Info Tab */}
                                    {activeTab === 'account-info' && (
                                        <div className="axil-dashboard-overview">
                                            <div className="welcome-text">
                                                Hello <span>{fullName}</span>!
                                            </div>
                                            <p>
                                                View your account details here. To update
                                                information, use the "Edit Information" tab.
                                            </p>

                                            <div className="row mt-4">
                                                <div className="col-md-6">
                                                    <div className="card mb-3">
                                                        <div className="card-body">
                                                            <h6 className="card-title">
                                                                <i className="fas fa-info-circle"></i>{' '}
                                                                Basic Information
                                                            </h6>
                                                            <p className="card-text">
                                                                <strong>Full Name:</strong> {fullName}
                                                                <br />
                                                                <strong>Email:</strong> {profile.email}
                                                                <br />
                                                                <strong>Phone:</strong>{' '}
                                                                {profile.phoneNumber ||
                                                                    'Not updated'}
                                                                <br />
                                                                <strong>Address:</strong>{' '}
                                                                {profile.address || 'Not updated'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="card mb-3">
                                                        <div className="card-body">
                                                            <h6 className="card-title">
                                                                <i className="fas fa-shield-alt"></i>{' '}
                                                                Security & Status
                                                            </h6>
                                                            <p className="card-text">
                                                                <strong>Role:</strong>{' '}
                                                                <span>
                                                                    {profile.role}
                                                                </span>
                                                                <br />
                                                                <strong>Member Since:</strong>{' '}
                                                                {profile.createdAt &&
                                                                    format(
                                                                        new Date(
                                                                            profile.createdAt
                                                                        ),
                                                                        'dd/MM/yyyy'
                                                                    )}
                                                                <br />
                                                                <strong>Last Updated:</strong>{' '}
                                                                {profile.updatedAt &&
                                                                    format(
                                                                        new Date(
                                                                            profile.updatedAt
                                                                        ),
                                                                        'dd/MM/yyyy HH:mm'
                                                                    )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Orders Tab */}
                                    {activeTab === 'orders' && (
                                        <div className="axil-dashboard-order">
                                            <h4 className="title mb-4">
                                                <i className="fas fa-shopping-basket me-2"></i>
                                                My Orders
                                            </h4>

                                            {ordersLoading ? (
                                                <div className="text-center py-5">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    <p className="mt-3 text-muted">Loading orders...</p>
                                                </div>
                                            ) : orders.length === 0 ? (
                                                <div className="text-center py-5">
                                                    <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                                                    <h5>You have no orders yet</h5>
                                                    <p className="text-muted">
                                                        Start shopping to see your order history here!
                                                    </p>
                                                    <a href="/shop" className="btn btn-primary">
                                                        <i className="fas fa-shopping-cart me-2"></i>
                                                        Start Shopping
                                                    </a>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="table-responsive">
                                                        <table className="table table-hover">
                                                            <thead className="table-light">
                                                                <tr>
                                                                    <th scope="col">Order #</th>
                                                                    <th scope="col">Date</th>
                                                                    <th scope="col">Items</th>
                                                                    <th scope="col">Total</th>
                                                                    <th scope="col">Status</th>
                                                                    <th scope="col">Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {orders.map((order) => (
                                                                    <tr key={order.id}>
                                                                        <td>
                                                                            <strong className="text-primary">
                                                                                {order.orderNumber}
                                                                            </strong>
                                                                        </td>
                                                                        <td>
                                                                            {order.orderDate && (
                                                                                <>
                                                                                    <span>{format(new Date(order.orderDate), 'dd/MM/yyyy')}</span>
                                                                                    <br />
                                                                                    <small className="text-muted">
                                                                                        {format(new Date(order.orderDate), 'HH:mm')}
                                                                                    </small>
                                                                                </>
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            <span>
                                                                                {order.itemsCount} item{order.itemsCount !== 1 ? 's' : ''}
                                                                            </span>
                                                                        </td>
                                                                        <td>
                                                                            <strong>
                                                                                ${order.totalAmount?.toFixed(2) || '0.00'}
                                                                            </strong>
                                                                        </td>
                                                                        <td>
                                                                            <span
                                                                                className={`badge ${
                                                                                    order.status === 'PENDING'
                                                                                        ? 'bg-warning text-dark'
                                                                                        : order.status === 'CONFIRMED'
                                                                                        ? 'bg-info'
                                                                                        : order.status === 'PROCESSING'
                                                                                        ? 'bg-primary'
                                                                                        : order.status === 'COMPLETED'
                                                                                        ? 'bg-success'
                                                                                        : order.status === 'CANCELLED'
                                                                                        ? 'bg-danger'
                                                                                        : 'bg-secondary'
                                                                                }`}
                                                                            >
                                                                                {order.status === 'PENDING' && 'Pending'}
                                                                                {order.status === 'CONFIRMED' && 'Confirmed'}
                                                                                {order.status === 'PROCESSING' && 'Processing'}
                                                                                {order.status === 'COMPLETED' && 'Completed'}
                                                                                {order.status === 'CANCELLED' && 'Cancelled'}
                                                                            </span>
                                                                        </td>
                                                                        <td>
                                                                            <button
                                                                                className="btn btn-sm btn-outline-primary"
                                                                                onClick={() => handleViewOrderItems(order.id)}
                                                                                title="View order items"
                                                                            >
                                                                                <i className="fas fa-box me-1"></i>
                                                                                Items
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    {/* Pagination */}
                                                    {totalPages > 1 && (
                                                        <nav className="mt-4">
                                                            <ul className="pagination justify-content-center">
                                                                <li className={`page-item ${ordersPage === 0 ? 'disabled' : ''}`}>
                                                                    <button
                                                                        className="page-link"
                                                                        onClick={() => setOrdersPage((p) => Math.max(0, p - 1))}
                                                                        disabled={ordersPage === 0}
                                                                    >
                                                                        <i className="fas fa-chevron-left"></i>
                                                                    </button>
                                                                </li>
                                                                {Array.from({ length: totalPages }, (_, i) => (
                                                                    <li
                                                                        key={i}
                                                                        className={`page-item ${ordersPage === i ? 'active' : ''}`}
                                                                    >
                                                                        <button
                                                                            className="page-link"
                                                                            onClick={() => setOrdersPage(i)}
                                                                        >
                                                                            {i + 1}
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                                <li className={`page-item ${ordersPage >= totalPages - 1 ? 'disabled' : ''}`}>
                                                                    <button
                                                                        className="page-link"
                                                                        onClick={() => setOrdersPage((p) => Math.min(totalPages - 1, p + 1))}
                                                                        disabled={ordersPage >= totalPages - 1}
                                                                    >
                                                                        <i className="fas fa-chevron-right"></i>
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </nav>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Edit Info Tab */}
                                    {activeTab === 'edit-info' && (
                                        <div className="axil-dashboard-account">
                                            <h4 className="title mb-4">
                                                <i className="fas fa-edit"></i> Edit Personal
                                                Information
                                            </h4>
                                            <form
                                                className="account-details-form"
                                                onSubmit={handleUpdateProfile}
                                            >
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="form-group">
                                                            <label>
                                                                First Name{' '}
                                                                <span className="text-danger">
                                                                    *
                                                                </span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="firstName"
                                                                value={formData.firstName}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="form-group">
                                                            <label>
                                                                Last Name{' '}
                                                                <span className="text-danger">
                                                                    *
                                                                </span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="lastName"
                                                                value={formData.lastName}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="form-group">
                                                            <label>Email</label>
                                                            <input
                                                                type="email"
                                                                className="form-control"
                                                                value={profile.email}
                                                                disabled
                                                            />
                                                            <small className="text-muted">
                                                                Email cannot be changed
                                                            </small>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="form-group">
                                                            <label>Phone Number</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="phoneNumber"
                                                                value={formData.phoneNumber}
                                                                onChange={handleInputChange}
                                                                placeholder="Enter phone number"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="form-group">
                                                            <label>Address</label>
                                                            <textarea
                                                                className="form-control"
                                                                name="address"
                                                                rows={3}
                                                                value={formData.address}
                                                                onChange={handleInputChange}
                                                                placeholder="Enter address"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="form-group">
                                                            <label>City</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="city"
                                                                value={formData.city}
                                                                onChange={handleInputChange}
                                                                placeholder="Enter city"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Buttons Row */}
                                                    <div className="col-12">
                                                        <div className="profile-buttons-wrapper">
                                                            <button
                                                                type="submit"
                                                                className="btn btn-primary profile-button"
                                                                disabled={loading}
                                                            >
                                                                {loading ? (
                                                                    <>
                                                                        <span
                                                                            className="spinner-border spinner-border-sm me-2"
                                                                            role="status"
                                                                            aria-hidden="true"
                                                                        ></span>
                                                                        Saving...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="fas fa-save me-2"></i>
                                                                        Save Changes
                                                                    </>
                                                                )}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-secondary profile-button"
                                                                onClick={() => {
                                                                    if (profile) {
                                                                        setFormData({
                                                                            firstName:
                                                                                profile.firstName ||
                                                                                '',
                                                                            lastName:
                                                                                profile.lastName ||
                                                                                '',
                                                                            phoneNumber:
                                                                                profile.phoneNumber ||
                                                                                '',
                                                                            address:
                                                                                profile.address || '',
                                                                            city:
                                                                                profile.city || '',
                                                                            dateOfBirth:
                                                                                profile.dateOfBirth ||
                                                                                '',
                                                                        });
                                                                    }
                                                                }}
                                                            >
                                                                <i className="fas fa-undo me-2"></i>
                                                                Reset
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    {/* Change Password Tab */}
                                    {activeTab === 'change-password' && (
                                        <div className="axil-dashboard-account">
                                            <h4 className="title mb-4">
                                                <i className="fas fa-key"></i> Change Password
                                            </h4>
                                            <div className="alert alert-info">
                                                <i className="fas fa-info-circle me-2"></i>
                                                To secure your account, please use a strong
                                                password with at least 8 characters, including
                                                uppercase, lowercase, numbers and special
                                                characters.
                                            </div>
                                            <form className="account-details-form" onSubmit={handleChangePassword}>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="form-group">
                                                            <label>
                                                                Current Password{' '}
                                                                <span className="text-danger">
                                                                    *
                                                                </span>
                                                            </label>
                                                            <div className="position-relative">
                                                                <input
                                                                    type={showCurrentPassword ? "text" : "password"}
                                                                    className="form-control"
                                                                    name="currentPassword"
                                                                    value={passwordData.currentPassword}
                                                                    onChange={handlePasswordChange}
                                                                    placeholder="Enter current password"
                                                                    required
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-link position-absolute"
                                                                    style={{
                                                                        right: "10px",
                                                                        top: "50%",
                                                                        transform: "translateY(-50%)",
                                                                        padding: "0",
                                                                        border: "none",
                                                                        background: "none",
                                                                        color: "#6c757d",
                                                                        zIndex: 10
                                                                    }}
                                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                                                                >
                                                                    <i className={`fas ${showCurrentPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="form-group">
                                                            <label>
                                                                New Password{' '}
                                                                <span className="text-danger">
                                                                    *
                                                                </span>
                                                            </label>
                                                            <div className="position-relative">
                                                                <input
                                                                    type={showNewPassword ? "text" : "password"}
                                                                    className="form-control"
                                                                    name="newPassword"
                                                                    value={passwordData.newPassword}
                                                                    onChange={handlePasswordChange}
                                                                    placeholder="Enter new password"
                                                                    required
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-link position-absolute"
                                                                    style={{
                                                                        right: "10px",
                                                                        top: "50%",
                                                                        transform: "translateY(-50%)",
                                                                        padding: "0",
                                                                        border: "none",
                                                                        background: "none",
                                                                        color: "#6c757d",
                                                                        zIndex: 10
                                                                    }}
                                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                                                                >
                                                                    <i className={`fas ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="form-group">
                                                            <label>
                                                                Confirm New Password{' '}
                                                                <span className="text-danger">
                                                                    *
                                                                </span>
                                                            </label>
                                                            <div className="position-relative">
                                                                <input
                                                                    type={showConfirmNewPassword ? "text" : "password"}
                                                                    className="form-control"
                                                                    name="confirmPassword"
                                                                    value={passwordData.confirmPassword}
                                                                    onChange={handlePasswordChange}
                                                                    placeholder="Re-enter new password"
                                                                    required
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-link position-absolute"
                                                                    style={{
                                                                        right: "10px",
                                                                        top: "50%",
                                                                        transform: "translateY(-50%)",
                                                                        padding: "0",
                                                                        border: "none",
                                                                        background: "none",
                                                                        color: "#6c757d",
                                                                        zIndex: 10
                                                                    }}
                                                                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                                                    aria-label={showConfirmNewPassword ? "Hide password" : "Show password"}
                                                                >
                                                                    <i className={`fas ${showConfirmNewPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Buttons Row */}
                                                    <div className="col-12">
                                                        <div className="profile-buttons-wrapper">
                                                            <button
                                                                type="submit"
                                                                className="btn btn-warning profile-button"
                                                                disabled={loading}
                                                            >
                                                                {loading ? (
                                                                    <>
                                                                        <span
                                                                            className="spinner-border spinner-border-sm me-2"
                                                                            role="status"
                                                                            aria-hidden="true"
                                                                        ></span>
                                                                        Changing...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="fas fa-key me-2"></i>
                                                                        Change Password
                                                                    </>
                                                                )}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-secondary profile-button"
                                                                onClick={() => {
                                                                    setPasswordData({
                                                                        currentPassword: '',
                                                                        newPassword: '',
                                                                        confirmPassword: '',
                                                                    });
                                                                }}
                                                            >
                                                                <i className="fas fa-undo me-2"></i>
                                                                Reset
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Items Modal */}
            {showOrderItemsModal && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="fas fa-box me-2"></i>
                                    Order Items {selectedOrderDetails && `- #${selectedOrderDetails.orderNumber}`}
                                </h5>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => {
                                        setShowOrderItemsModal(false);
                                        setSelectedOrderDetails(null);
                                    }}
                                    aria-label="Close"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                {loadingOrderDetails ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-2 text-muted">Loading order items...</p>
                                    </div>
                                ) : selectedOrderDetails ? (
                                    <>
                                        <div className="table-responsive">
                                            <table className="table table-hover align-middle">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Product</th>
                                                        <th className="text-center">Qty</th>
                                                        <th className="text-end">Price</th>
                                                        <th className="text-end">Total</th>
                                                        {selectedOrderDetails.status === 'COMPLETED' && (
                                                            <th className="text-center">Review</th>
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedOrderDetails.items?.map((item) => (
                                                        <tr key={item.id}>
                                                            <td>
                                                                <div className="d-flex align-items-center gap-3">
                                                                    <img
                                                                        src={item.productImageUrl || '/assets/images/product/default.png'}
                                                                        alt={item.productName}
                                                                        style={{
                                                                            width: '50px',
                                                                            height: '50px',
                                                                            objectFit: 'cover',
                                                                            borderRadius: '8px',
                                                                        }}
                                                                    />
                                                                    <div>
                                                                        <strong>{item.productName}</strong>
                                                                        <br />
                                                                        <small className="text-muted">ID: {item.productId}</small>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="text-center">{item.quantity}</td>
                                                            <td className="text-end">${item.price.toFixed(2)}</td>
                                                            <td className="text-end">
                                                                <strong>${item.totalPrice.toFixed(2)}</strong>
                                                            </td>
                                                            {selectedOrderDetails.status === 'COMPLETED' && (
                                                                <td className="text-center">
                                                                    <button
                                                                        className="btn btn-sm btn-outline-warning"
                                                                        onClick={() => handleOpenReviewModal(item)}
                                                                        title="Write a review"
                                                                    >
                                                                        <i className="fas fa-star"></i>
                                                                    </button>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Order Summary */}
                                        <div className="border-top pt-3 mt-3">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p className="mb-1">
                                                        <strong>Shipping Address:</strong>
                                                    </p>
                                                    <p className="text-muted">{selectedOrderDetails.address || 'N/A'}</p>
                                                    {selectedOrderDetails.notes && (
                                                        <>
                                                            <p className="mb-1">
                                                                <strong>Notes:</strong>
                                                            </p>
                                                            <p className="text-muted">{selectedOrderDetails.notes}</p>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="col-md-6">
                                                    <table className="table table-sm table-borderless">
                                                        <tbody>
                                                            <tr>
                                                                <td>Subtotal:</td>
                                                                <td className="text-end">${selectedOrderDetails.subtotal?.toFixed(2) || '0.00'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Tax:</td>
                                                                <td className="text-end">${selectedOrderDetails.taxAmount?.toFixed(2) || '0.00'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Shipping:</td>
                                                                <td className="text-end">${selectedOrderDetails.shippingCost?.toFixed(2) || '0.00'}</td>
                                                            </tr>
                                                            {selectedOrderDetails.discountAmount > 0 && (
                                                                <tr className="text-success">
                                                                    <td>Discount:</td>
                                                                    <td className="text-end">-${selectedOrderDetails.discountAmount.toFixed(2)}</td>
                                                                </tr>
                                                            )}
                                                            <tr className="border-top">
                                                                <td><strong>Total:</strong></td>
                                                                <td className="text-end">
                                                                    <strong>${selectedOrderDetails.totalAmount.toFixed(2)}</strong>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-4">
                                        <i className="fas fa-exclamation-circle fa-3x text-warning mb-3"></i>
                                        <p>Failed to load order details. Please try again.</p>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowOrderItemsModal(false);
                                        setSelectedOrderDetails(null);
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && reviewProduct && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="fas fa-star me-2 text-warning"></i>
                                    {existingReview ? 'Edit Review' : 'Write a Review'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={handleCloseReviewModal}
                                    disabled={reviewLoading}
                                    aria-label="Close"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <form onSubmit={handleSubmitReview}>
                                <div className="modal-body">
                                    {checkingReview ? (
                                        <div className="text-center py-4">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Product Info */}
                                            <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-light rounded">
                                                <img
                                                    src={reviewProduct.productImageUrl || '/assets/images/product/default.png'}
                                                    alt={reviewProduct.productName}
                                                    style={{
                                                        width: '60px',
                                                        height: '60px',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px',
                                                    }}
                                                />
                                                <div>
                                                    <strong>{reviewProduct.productName}</strong>
                                                </div>
                                            </div>

                                            {/* Rating */}
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Rating <span className="text-danger">*</span>
                                                </label>
                                                <div className="d-flex gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            className="btn btn-link p-0"
                                                            onClick={() => setReviewData((prev) => ({ ...prev, rating: star }))}
                                                            style={{ fontSize: '1.5rem' }}
                                                        >
                                                            <i
                                                                className={`fas fa-star ${
                                                                    star <= reviewData.rating ? 'text-warning' : 'text-muted'
                                                                }`}
                                                            ></i>
                                                        </button>
                                                    ))}
                                                    <span className="ms-2 text-muted">({reviewData.rating}/5)</span>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <div className="mb-3">
                                                <label className="form-label">Review Title</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Give your review a title (optional)"
                                                    value={reviewData.title}
                                                    onChange={(e) =>
                                                        setReviewData((prev) => ({ ...prev, title: e.target.value }))
                                                    }
                                                    maxLength={100}
                                                />
                                            </div>

                                            {/* Review Text */}
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Your Review <span className="text-danger">*</span>
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    rows={4}
                                                    placeholder="Share your experience with this product..."
                                                    value={reviewData.text}
                                                    onChange={(e) =>
                                                        setReviewData((prev) => ({ ...prev, text: e.target.value }))
                                                    }
                                                    required
                                                    minLength={10}
                                                    maxLength={1000}
                                                />
                                                <small className="text-muted">
                                                    {reviewData.text.length}/1000 characters
                                                </small>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    {existingReview && (
                                        <button
                                            type="button"
                                            className="btn btn-danger me-auto"
                                            onClick={handleDeleteReview}
                                            disabled={reviewLoading || checkingReview}
                                        >
                                            <i className="fas fa-trash me-1"></i>
                                            Delete
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCloseReviewModal}
                                        disabled={reviewLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={reviewLoading || checkingReview || !reviewData.text.trim()}
                                    >
                                        {reviewLoading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                                {existingReview ? 'Updating...' : 'Submitting...'}
                                            </>
                                        ) : existingReview ? (
                                            <>
                                                <i className="fas fa-save me-1"></i>
                                                Update Review
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-paper-plane me-1"></i>
                                                Submit Review
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default UserProfilePage;

