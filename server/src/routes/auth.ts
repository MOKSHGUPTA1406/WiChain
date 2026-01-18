import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { walletAddress } = req.body;

    if (!walletAddress) {
        res.status(400).json({ error: 'Wallet address is required' });
        return;
    }

    try {
        let user = await prisma.user.findUnique({
            where: { walletAddress },
        });

        if (!user) {
            user = await prisma.user.create({
                data: { walletAddress },
            });
        }

        res.json(user);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

export default router;
