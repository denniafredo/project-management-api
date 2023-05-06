
const { verify } = require('../helpers/jwt')
const Project = require("../models/project");
const Task = require("../models/task");

function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    if (token) {
        try {
            let payload = verify(token)
            req.user = { _id: payload.id }
            next()
        } catch (err) {
            next({ code: 401, msg: 'Unauthorized' })
        }
    } else {
        next({ code: 401, msg: 'Unauthorized' })
    }
}

function authorize(req, res, next) {
    let email = req.body.email
    let password = req.body.password
    if (email == 'admin@admin.com' && password == 'admin') {
        next()
    } else {
        next({ code: 400, msg: 'Admin only' })
    }
}

function ownsUser(req, res, next) {
    const requestedUserId = req.params.id;

    if (req.user._id.toString() === requestedUserId) {
        next();
    } else {
        next({ code: 403, msg: 'Access denied' })
    }
}

async function ownsProject(req, res, next) {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);

    if (!project) {
        return next({ code: 404, msg: 'Project not found' });
    }

    if (project.user_id != req.user._id) {
        return next({ code: 403, msg: 'Access denied' });
    }
    next();
}

async function ownsTask(req, res, next) {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
        return next({ code: 404, msg: 'Task not found' });
    }

    if (task.user_id != req.user._id) {
        return next({ code: 403, msg: 'Access denied' });
    }
    next();
}

module.exports = { authenticate, authorize, ownsUser, ownsProject, ownsTask }