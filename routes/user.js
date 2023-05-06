const routes = require('express').Router()
const UserController = require('../controllers/user')
const { authenticate , authorize, ownsUser } = require('../middlewares/auth')

routes.post('/register', UserController.saveUser)
routes.post('/users', UserController.saveUser)
routes.post('/login', UserController.loginUser)
routes.get('/users',authorize, UserController.getUsers)
routes.use(authenticate)
routes.get('/users/:id',ownsUser, UserController.getUserById)
routes.put('/users/:id',ownsUser, UserController.updateUser)
routes.delete('/users/:id',ownsUser, UserController.deleteUser)

module.exports = routes
