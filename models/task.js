const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    due_date: {
        type: Date
    },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
