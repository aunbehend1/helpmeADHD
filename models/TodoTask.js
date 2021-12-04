const mongoose = require('mongoose');

//create date and updated date are handled with timestamps:true

const todoTaskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },

    taskComplete: {
        type: Boolean 
    },
}, { timestamps: true });

    
module.exports = mongoose.model('TodoTask',todoTaskSchema);