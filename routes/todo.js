const express = require('express');
const router = express.Router();
const ToDo = require('../models/todo');



router.post('/add', (req, res, next) => {
    ToDo.create(req.body).then((data) => {
        res.send({
            allToDos: 'ADD TODO',
            todo: req.body
        })
    })
})
router.delete('/del/:id', (req, res, next) => {
    ToDo.findByIdAndRemove({ _id: req.params.id }).then((todo) => {
        res.send(todo);
    }).catch(next);
})
router.put('/put/:id', (req, res, next) => {
    ToDo.findByIdAndUpdate({ _id: req.params.id }, req.body).then(() => {
        ToDo.findOne({ _id: req.params.id }).then((todo) => {
            res.send(todo);
        })
    })
})
router.put('/done/:id', (req, res, next) => {
    ToDo.findByIdAndUpdate({ _id: req.params.id }, { isDone: true }).then(() => {
        ToDo.findOne({ _id: req.params.id }).then((todo) => {
            res.send(todo);
        })
    })
})

module.exports = router;