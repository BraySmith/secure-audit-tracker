const express = require('express');
const router = express.Router();

const AuditLog = require('../models/AuditLog');
const { verifyToken } = require('../middleware/authMiddleware');
const {requireAdmin} = require('../middleware/authMiddleware');

router.get('/', verifyToken, requireAdmin, async(req, res) => {
    try{
        const logs = await AuditLog.find().sort({createdAt: -1});
        return res.status(200).json({message: 'Audit logs retrieved', logs});
    }  catch (err) {
        console.error(err.message);
        return res.status(500).json({message: 'Error while fetching audit logs'});
    }
});

module.exports = router;