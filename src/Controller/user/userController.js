const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.register = async (req, res) => {
    const { username, name, email, password } = req.body;

    try {
        const existingUser = await prisma.User.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email or username already exists' });
        }

        const newUser = await prisma.User.create({
            data: {
                username,
                name,
                email,
                password,
            },
        });
        res.status(201).json({message: 'User registered successfully', user: newUser})
    } catch (error) {
        console.error(error);
        res.status(500).json({message : 'Internal server error'});
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.status(200).json({
            userId: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            password: user.password
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({ where: { id: Number(id) } });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json({
        userId: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.logout = async (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};