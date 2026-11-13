const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

router.post('/register', async(req, res) => {
    try{
        const {username, email, password} = req.body;
        console.log('Beginning Registration');

        if(!username || !email || !password) {
            return res.status(400).json({message : 'Please provide username email and password.'})
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }]});
        if(existingUser){
            return res.status(400).json({message : 'User Already Exists.'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashPassword});
        await newUser.save();

        const newAuditLog = new AuditLog({
            action: 'USER_REGISTERED',
            performedBy: username,
            details: `New account created for ${email}`
        });
        await newAuditLog.save();

        return res.status(201).json({message: 'Registration Successful.'});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({message : 'Server error'});
    }
});

router.post('/login', async(req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({ email });

        if(!user) {
            const newAuditLog = new AuditLog({
                action: 'LOGIN_FAILED',
                performedBy: email,
                details: `Login failed for ${email}`
            });
            await newAuditLog.save();
            return res.status(400).json({message: 'Invalid Credentials.'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            const newAuditLog = new AuditLog({
                action: 'LOGIN_FAILED',
                performedBy: email,
                details: `Login failed for ${email}`
            });
            await newAuditLog.save();
            return res.status(400).json({message: 'Invalid Credentials.'});
        }

        const payload = {id: user._id, role: user.role, username: user.username};
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h'}
        );

        const newAuditLog = new AuditLog({
            action: 'LOGIN_SUCCESS',
            performedBy: email,
            details: `Successful Login for ${email}`
        });
        await newAuditLog.save();

        return res.status(200).json({token, user: {id: user._id, username: user.username, role: user.role}});

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({message : 'Login Failed'})
    }
});

module.exports = router;