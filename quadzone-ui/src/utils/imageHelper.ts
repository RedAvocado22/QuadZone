/**
 * Helper function to resolve image URLs
 * Handles both remote URLs and local asset paths
 */
export const getImageUrl = (path: string | null | undefined, fallback?: string): string => {
    const defaultFallback = '/assets/images/avatar/avatar-1.webp';
    
    if (!path || path.trim() === '') {
        return fallback || defaultFallback;
    }
    
    // If it's already a full URL (http/https), use it directly
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    
    // If it's a local path from /src/assets/img, keep as is (Vite handles it)
    if (path.startsWith('/src/assets/img')) {
        return path;
    }
    
    // If it uses @img alias, convert to /src/assets/img
    if (path.startsWith('@img/')) {
        return path.replace('@img/', '/src/assets/img/');
    }
    
    // If it starts with /assets (public folder), use as is
    if (path.startsWith('/assets')) {
        return path;
    }
    
    // Default: return the path as-is
    return path;
};

/**
 * Get avatar URL with proper fallback
 */
export const getAvatarUrl = (avatarUrl: string | null | undefined): string => {
    return getImageUrl(avatarUrl, '/assets/images/avatar/avatar-1.webp');
};

/**
 * Get product image URL with proper fallback
 */
export const getProductImageUrl = (imageUrl: string | null | undefined): string => {
    return getImageUrl(imageUrl, '/src/assets/img/300X300/placeholder.jpg');
};

/**
 * Get blog thumbnail URL with proper fallback
 */
export const getBlogThumbnailUrl = (thumbnailUrl: string | null | undefined): string => {
    return getImageUrl(thumbnailUrl, '/src/assets/img/500X300/blog-placeholder.jpg');
};

