const prisma = require('@prisma/client');
const { PrismaClient } = prisma;
const prismaClient = new PrismaClient();

exports.createTask = async (req, res) => {
    try{
        const {task, categoryId, status} = req.body;
        const userId = req.headers['user-id'];

        if (!userId) {
            return res.status(400).json({error: 'User ID is required'});
        }

        if (!task || !categoryId){
            return res.status(400).json({error: 'Task and categoryId are required'});
        }

        const newTask = await prismaClient.task.create({
            data: {
                task,
                status: status || 'NOT_COMPLETE',
                date: new Date(),
                user: {
                    connect: {id: parseInt(userId,10)},
                },
                category: {
                    connect: {id: parseInt(categoryId, 10)},
                },
            },
        });
        res.status(201).json(newTask);
    } catch(error){
        console.error('Error creating task:', error.message);
        res.status(500).json({ error: error.message });
    }
}

exports.getAllTasks = async (req, res) => {
    try {
        const userId = req.headers['user-id'];
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const tasks = await prismaClient.task.findMany({
            where: { userId: parseInt(userId, 10) },
            include: { category: true },
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { task } = req.body;
        const userId = req.headers['user-id'];

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        if (!task) {
            return res.status(400).json({ error: 'Task field is required' });
        }

        const existingTask = await prismaClient.task.findUnique({
            where: { id: parseInt(id, 10) },
        });

        if (!existingTask || existingTask.userId !== parseInt(userId, 10)) {
            return res.status(403).json({ error: 'Unauthorized to update this task' });
        }

        const updatedTask = await prismaClient.task.update({
            where: { id: parseInt(id, 10) },
            data: { task }, 
        });

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.headers['user-id'];

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const existingTask = await prismaClient.task.findUnique({
            where: { id: parseInt(id, 10) },
        });

        if (!existingTask || existingTask.userId !== parseInt(userId, 10)) {
            return res.status(403).json({ error: 'Unauthorized to update this task' });
        }

        const updatedTask = await prismaClient.task.update({
            where: { id: parseInt(id, 10) },
            data: { 
                previousStatus: existingTask.status, 
                status 
            },
        });

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.undoTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers['user-id'];

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const existingTask = await prismaClient.task.findUnique({
            where: { id: parseInt(id, 10) },
        });

        console.log("Existing Task Data:", existingTask);

        if (!existingTask || existingTask.userId !== parseInt(userId, 10)) {
            return res.status(403).json({ error: 'Unauthorized to undo this task status' });
        }

        if (!existingTask.previousStatus) {
            return res.status(400).json({ error: 'No previous status to undo' });
        }

        const updatedTask = await prismaClient.task.update({
            where: { id: parseInt(id, 10) },
            data: { 
                status: existingTask.previousStatus, 
                previousStatus: null, 
            }
        });

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers['user-id'];

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const existingTask = await prismaClient.task.findUnique({
            where: { id: parseInt(id, 10) },
        });
        
        if (!existingTask || existingTask.userId !== parseInt(userId, 10)) {
            return res.status(403).json({ error: 'Unauthorized to delete this task' });
        }

        await prismaClient.task.delete({
            where: { id: parseInt(id, 10) },
        });
        res.status(204).send('success');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

