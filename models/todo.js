const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ToDoSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    isDone: {
        type: Boolean,
        required: true
    }
})

let ToDo = mongoose.model('todo', ToDoSchema);
module.exports = ToDo;