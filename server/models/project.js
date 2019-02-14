const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const projectSchema = new Schema({
    name: String,
    status: {
        type: String,
        required: true,
        enum: ['Queue', 'In Progress', 'Completed'],
        default: 'Queue'
    },
    description: {type: String},
    startDate: {type: Date},
    endDate: {type: Date},
    openTo: {type: Array}
});
module.exports = mongoose.model('project', projectSchema, 'projects');
