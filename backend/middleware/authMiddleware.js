const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message: 'Access Denied. No token provided.'});
    }
    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({message: 'Unauthorized (Invalid or Expired Token)' });
    }
};

const requireAdmin = (req, res, next) => {
    const role = req.user.role
    if(!role || role !== 'admin'){
        return res.status(403).json({message: 'Access Denied. Admin privileges needed.'})
    }
    next();
}

module.exports = {verifyToken, requireAdmin};
