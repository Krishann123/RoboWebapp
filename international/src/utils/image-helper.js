export function getImageUrl(path) {
    if (!path) {
        // Return a path to a placeholder image if the path is missing
        return '/images/placeholder.png'; 
    }
    if (path.startsWith('http') || path.startsWith('//')) {
        return path; // It's already a full URL
    }
    // For all other paths, just ensure they start with a single slash
    return path.startsWith('/') ? path : `/${path}`;
} 