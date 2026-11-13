const express = require('express');
const router = express.Router();

const Task = require('../models/Task');
const AuditLog = require('../models/AuditLog');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, async (req, res) => {
    try{
        const {title, description, status} = req.body;
        if(!title) {
            return res.status(400).json({message: 'No Title.'});
        }
        const newTask = new Task({title, description, status, createdBy: req.user.id});
        await newTask.save();
        const newAuditLog = new AuditLog({
                action: 'TASK_CREATED',
                performedBy: req.user.username,
                details: `New task created by ${req.user.username}`
        });
        await newAuditLog.save();
        return res.status(201).json({message: 'Task created successfully', task:newTask});
    } catch (err){
        console.error(err.message);
        return res.status(500).json({message: 'Error while creating Task'});
    }
});

router.get('/', verifyToken, async (req, res) => {
    try{
        const tasks = await Task.find({createdBy: req.user.id}).sort({createdAt: -1});
        return res.status(200).json({message: 'Found tasks', tasks});
    } catch (err){
        console.error(err.message);
        return res.status(500).json({message: 'Error while finding tasks'});
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try{
        const task = await Task.findById(req.params.id);
        if(!task){
            return res.status(404).json({message: 'Task not found.'});
        }
        if(task.createdBy.toString() !== req.user.id){
            return res.status(403).json({message: 'Forbidden Access'});
        }

        const {title, description, status} = req.body;
        if(title !== undefined){
            task.title = title;
        }
        if(description !== undefined){
            task.description = description;
        }
        if(status !== undefined) {
            task.status = status;
        }
        await task.save();

        const newAuditLog = new AuditLog({
                action: 'TASK_UPDATED',
                performedBy: req.user.username,
                details: `Task updated by ${req.user.username}`
        });
        await newAuditLog.save();

        return res.status(200).json({message: 'Task updated', task});
    } catch (err){
        console.error(err.message);
        return res.status(500).json({message: 'Error while updating task'});
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try{
        const task = await Task.findById(req.params.id);
        if(!task){
            return res.status(404).json({message: 'Task not found.'});
        }
        if(task.createdBy.toString() !== req.user.id){
            return res.status(403).json({message: 'Forbidden Access'});
        }
        await task.deleteOne();

        const newAuditLog = new AuditLog({
                action: 'TASK_DELETED',
                performedBy: req.user.username,
                details: `Task deleted by ${req.user.username}`
        });
        await newAuditLog.save();

        return res.status(200).json({message: 'Task deleted.'});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({message: 'Error while deleting task.'});
    }
});

module.exports = router;