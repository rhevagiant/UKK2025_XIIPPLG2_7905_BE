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
