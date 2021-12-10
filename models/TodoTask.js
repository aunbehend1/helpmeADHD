const mongoose = require('mongoose');

const todoTaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    content: {
        type: String,
        required: true
        },
    
    taskComplete: {
        type: Boolean 
        },
    
    completedDate: {
        type: Date,
    },

    }, { timestamps: true });
    
    
module.exports = mongoose.model('TodoTask',todoTaskSchema);