import jwt from 'jsonwebtoken';
export function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'emission_admin_secret_key_change_in_production');
        req.adminId = decoded.id;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}
