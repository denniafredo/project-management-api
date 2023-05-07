const { body, validationResult } = require('express-validator');
const User = require("../models/user");
const Project = require("../models/project");
const Task = require("../models/task");
const mongoose = require('mongoose');

const saveProject = async (req, res, next) => {
    await body('name').trim().escape().notEmpty().run(req);
    await body('description').trim().escape().run(req);
    await body('due_date').trim().isDate().toDate().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next({ code: 422, msg: errors.array() });
    }
    try {
        const { name, description, due_date } = req.body;

        const project = new Project({
            name,
            description,
            due_date,
            user_id: req.user._id,
            users: [req.user._id],
        });

        await project.save();

        await User.updateOne({ _id: req.user._id }, { $push: { projects: project._id } });

        res.status(201).json(project);
    } catch (error) {
        next(error)
    }
};

const getProjects = async (req, res, next) => {
    try {
        const projects = await Project.find({ user_id: req.user._id });
        if (!projects.length) {
            next({ code: 404, msg: 'Project is empty' })
        } else {
            res.status(200).json(projects);
        }
    } catch (error) {
        next(error)
    }
}

const getProjectById = async (req, res, next) => {
    try {
        const project = await Project.find({ _id: req.params.id });
        if (!project) {
            next({ code: 404, msg: 'Project not Found' })
        }
        res.status(200).json(project);
    } catch (error) {
        if (error instanceof mongoose.CastError) {
            next({ code: 400, msg: 'Invalid project ID' })
        }
        next(error)
    }
}

const updateProject = async (req, res, next) => {
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
        const updatedProject = await Project.findByIdAndUpdate(id, { name, description, due_date });
        if (!updateProject) {
            next({ code: 404, msg: 'Project not found' });
        }
        else {
            res.status(200).json({ message: 'Project updated' });
        }
    } catch (error) {
        if (error instanceof mongoose.CastError) {
            next({ code: 400, msg: 'Invalid project ID' })
        }
        next(error)
    }
}

const deleteProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedProject = await Project.findByIdAndDelete(id);
        if (!deletedProject) {
            next({ code: 404, msg: 'Project not found' });
        } else {
            await User.updateMany(
                { projects: id },
                { $pull: { projects: id } }
            );
            const tasks = await Task.find({ project_id: id }, '_id');
            const deletedTasks = await Task.deleteMany({ project_id: id });
            await User.updateMany(
                { tasks: { $in: tasks } },
                { $pull: { tasks: { $in: tasks } } }
            );

            res.status(200).json({ message: `Project deleted and ${deletedTasks.deletedCount} task deleted` });
        }
    } catch (error) {
        if (error instanceof mongoose.CastError) {
            next({ code: 400, msg: 'Invalid project ID' })
        }
        next(error);
    }
}
const getProjectsByTaskId = async (req, res, next) => {
    try {
        const projects = await Project.find({ tasks: req.params.id });
        if (!projects.length) {
            next({ code: 404, msg: 'Project is empty' })
        } else {
            res.status(200).json(projects);
        }
    } catch (error) {
        next(error)
    }
}

module.exports = { getProjects, getProjectById, saveProject, updateProject, deleteProject, getProjectsByTaskId }
