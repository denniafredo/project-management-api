const { body, validationResult } = require('express-validator');
const User = require("../models/user");
const Project = require("../models/project");
const Task = require("../models/task");
const mongoose = require('mongoose');

const saveTask = async (req, res, next) => {
    await body('name').trim().escape().notEmpty().run(req);
    await body('description').trim().escape().run(req);
    await body('due_date').trim().isDate().toDate().run(req);
    await body('project_id').trim().notEmpty().run(req);
    await body('user_id').trim().notEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next({ code: 422, msg: errors.array() });
    }
    try {
        const { name, description, due_date, user_id, project_id } = req.body;

        const project = await Project.findOne({ _id: project_id })
        if (!project) {
            next({ code: 404, msg: 'Project not Found' });
        }
        //check owned project
        if (project.user_id != req.user._id) {
            next({ code: 403, msg: 'Access denied' });
        }

        const user = await User.findOne({ _id: user_id })
        if (!user) {
            next({ code: 404, msg: 'User not Found' });
        }

        const task = new Task({
            name,
            description,
            due_date,
            user_id: user_id,
            project_id: project_id,
        });

        await task.save();

        await Project.updateOne({ _id: project_id }, { $push: { tasks: task._id } });
        await User.updateOne({ _id: user_id }, { $push: { tasks: task._id } });

        res.status(201).json(task);
    } catch (error) {
        next(error)
    }
};

const getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({ user_id: req.user._id });
        if (!tasks.length) {
            next({ code: 404, msg: 'Task is empty' })
        } else {
            res.status(200).json(tasks);
        }
    } catch (error) {
        next(error)
    }
}

const getTaskById = async (req, res, next) => {
    try {
        const task = await Task.find({ _id: req.params.id });
        if (!task) {
            next({ code: 404, msg: 'Task not Found' })
        }
        res.status(200).json(task);
    } catch (error) {
        if (error instanceof mongoose.CastError) {
            next({ code: 400, msg: 'Invalid task ID' })
        }
        next(error)
    }
}

const updateTask = async (req, res, next) => {
    await body('name').trim().escape().notEmpty().run(req);
    await body('description').trim().escape().run(req);
    await body('due_date').trim().isDate().toDate().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next({ code: 422, msg: errors.array() });
    }
    try {
        const { name, description, due_date } = req.body;
        const { id } = req.params;

        const updatedTask = await Task.findByIdAndUpdate(id, { name, description, due_date });
        if (!updatedTask) {
            next({ code: 404, msg: 'Task not found' });
        }
        else {
            res.status(200).json({ message: 'Task updated' });
        }
    } catch (error) {
        if (error instanceof mongoose.CastError) {
            next({ code: 400, msg: 'Invalid task ID' })
        }
        next(error)
    }
}

const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            next({ code: 404, msg: 'Task not found' });
        } else {
            await User.updateOne(
                { tasks: id },
                { $pull: { tasks: id } }
            );
            await Project.updateOne(
                { tasks: id },
                { $pull: { tasks: id } }
            );
            res.status(200).json({ message: 'Task deleted' });
        }
    } catch (error) {
        next(error);
    }
}

module.exports = { getTasks, getTaskById, saveTask, updateTask, deleteTask }
