require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler')

mongoose.connect(process.env.MONGODB_URL);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})
database.once('connected', () => {
    console.log('Database Connected');
})
const UserRoute = require('./routes/user')
const ProjectRoute = require('./routes/project')
const TaskRoute = require('./routes/task')
const app = express();

app.use(cors());
app.use(express.json());
app.use(UserRoute)
app.use(ProjectRoute)
app.use(TaskRoute)
app.use(errorHandler)


app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})