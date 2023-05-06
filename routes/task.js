const routes = require('express').Router()
const TaskController = require('../controllers/task')
const { authenticate , authorize, ownsProject, ownsTask } = require('../middlewares/auth')

routes.use(authenticate)
routes.post('/tasks', TaskController.saveTask)
routes.get('/tasks', TaskController.getTasks)
routes.get('/tasks/:id',ownsTask, TaskController.getTaskById)
routes.put('/tasks/:id',ownsTask, TaskController.updateTask)
routes.delete('/tasks/:id',ownsTask, TaskController.deleteTask)

module.exports = routes
