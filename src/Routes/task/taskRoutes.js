const express = require('express');
const router = express.Router();
const taskController = require('../../Controller/task/taskController');

router.post('/add', taskController.createTask);
router.get('/all', taskController.getAllTasks);
router.put('/:id', taskController.updateTask);
router.patch('/:id/status', taskController.updateTaskStatus);
router.delete('/:id', taskController.deleteTask);

module.exports = router;