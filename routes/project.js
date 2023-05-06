const routes = require('express').Router()
const ProjectController = require('../controllers/project')
const { authenticate, authorize, ownsProject, ownsTask } = require('../middlewares/auth')

routes.use(authenticate)
routes.post('/projects', ProjectController.saveProject)
routes.get('/projects', ProjectController.getProjects)
routes.get('/projects/:id', ownsProject, ProjectController.getProjectById)
routes.put('/projects/:id', ownsProject, ProjectController.updateProject)
routes.delete('/projects/:id', ownsProject, ProjectController.deleteProject)

routes.get('/projects/tasks/:id', ownsTask, ProjectController.getProjectsByTaskId)

module.exports = routes
