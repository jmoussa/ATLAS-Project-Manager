const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const taskSchema = new Schema({
    name: String,
    status: {
        type: String,
        required: true,
        enum: ['Queued', 'Prioritized', 'In Progress', 'Completed'],
        default: 'Queued'
    },
    description: {type: String},
    startDate: {type: Date},
    endDate: {type: Date},
    openTo: {type: Array},
    projectId: {type: String}
});
module.exports = mongoose.model('task', taskSchema, 'tasks');