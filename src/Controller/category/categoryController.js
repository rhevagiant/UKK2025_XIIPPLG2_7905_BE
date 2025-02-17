const prisma = require('@prisma/client');
const { PrismaClient } = prisma;
const prismaClient = new PrismaClient();

exports.createCategory = async (req, res) => {
    try{
        const {category} = req.body;
        const userId = req.headers['user-id'];

        if (!userId) {
            return res.status(400).json({error: 'User ID is required'});
        }

        const newCategory = await prismaClient.category.create({
            data: {
                category,
                userId: parseInt(userId, 10),
            },
        });
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

exports.getAllCategories = async (req, res) => {
    try{
        const userId = req.headers['user-id'];

        if (!userId) {
            return res.status(400).json({error: 'User ID is required'});
        }

        const categories = await prismaClient.category.findMany({
            where: {userId: parseInt(userId, 10)},
        });

        res.status(200).json(categories);
    } catch(error){
        res.status(500).json({error: error.message});
    }
}



exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { category } = req.body;
        const userId = req.headers['user-id'];

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const existingCategory = await prismaClient.category.findUnique({
            where: { id: parseInt(id, 10) },
        });

        if (!existingCategory || existingCategory.userId !== parseInt(userId, 10)) {
            return res.status(403).json({ error: 'Unauthorized to update this category' });
        }

        const updatedCategory = await prismaClient.category.update({
            where: { id: parseInt(id, 10) },
            data: { category },
        });

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers['user-id'];

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const existingCategory = await prismaClient.category.findUnique({
            where: { id: parseInt(id, 10) },
        });

        if (!existingCategory || existingCategory.userId !== parseInt(userId, 10)) {
            return res.status(403).json({ error: 'Unauthorized to delete this category' });
        }

        await prismaClient.category.delete({
            where: { id: parseInt(id, 10) },
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};