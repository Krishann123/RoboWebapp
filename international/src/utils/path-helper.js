const basePath = import.meta.env.BASE_URL || '/';

export function getPath(path) {
    if (!path) return '#';
    
    // Don't add prefix to external links
    if (path.startsWith('http') || path.startsWith('//')) {
        return path;
    }
    
    // For internal links, ensure they have the base path
    // The base path for country sites is managed by the Express router
    return path;
} 