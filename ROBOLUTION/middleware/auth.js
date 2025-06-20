// Authentication middleware functions
// These functions are used to protect routes that require authentication

// Ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    
    // Store the original URL the user was trying to access
    req.session.returnTo = req.originalUrl;
    
    // Redirect to login page if not authenticated
    res.redirect('/login');
}

// Ensure user is an admin
function ensureAdmin(req, res, next) {
    if (req.session && req.session.user && 
        (req.session.user.role === 'admin' || req.session.user.role === 'superadmin')) {
        return next();
    }
    
    // If authenticated but not an admin
    if (req.session && req.session.user) {
        return res.status(403).send('Access Denied: You need admin privileges to access this resource.');
    }
    
    // If not authenticated at all
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
}

// Ensure user is a super admin
function ensureSuperAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === 'superadmin') {
        return next();
    }
    
    // If authenticated but not a super admin
    if (req.session && req.session.user) {
        return res.status(403).send('Access Denied: You need superadmin privileges to access this resource.');
    }
    
    // If not authenticated at all
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
}

module.exports = {
    ensureAuthenticated,
    ensureAdmin,
    ensureSuperAdmin
}; 