import { useState, useRef, useEffect } from 'react';
import { useProfile } from '../hooks/userProfile';
import { format } from 'date-fns';
import '../UserProfilePage.css';

const UserProfilePage = () => {
    const { profile, loading, isInitialLoading, updateProfile, uploadAvatar } = useProfile();
    const [activeTab, setActiveTab] = useState('account-info');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                                            <a className="nav-item nav-link" href="/logout">
                                                <i className="fas fa-sign-out-alt"></i>Logout
                                            </a>
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
                                                Hello <span>{fullName}</span>! (not{' '}
                                                <span>{fullName}</span>? <a href="/logout">Logout</a>
                                                )
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
                                            <form className="account-details-form">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="form-group">
                                                            <label>
                                                                Current Password{' '}
                                                                <span className="text-danger">
                                                                    *
                                                                </span>
                                                            </label>
                                                            <input
                                                                type="password"
                                                                className="form-control"
                                                                placeholder="Enter current password"
                                                                required
                                                            />
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
                                                            <input
                                                                type="password"
                                                                className="form-control"
                                                                placeholder="Enter new password"
                                                                required
                                                            />
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
                                                            <input
                                                                type="password"
                                                                className="form-control"
                                                                placeholder="Re-enter new password"
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Buttons Row */}
                                                    <div className="col-12">
                                                        <div className="profile-buttons-wrapper">
                                                            <button
                                                                type="submit"
                                                                className="btn btn-warning profile-button"
                                                            >
                                                                <i className="fas fa-key me-2"></i>
                                                                Change Password
                                                            </button>
                                                            <button
                                                                type="reset"
                                                                className="btn btn-outline-secondary profile-button"
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
        </main>
    );
};

export default UserProfilePage;

