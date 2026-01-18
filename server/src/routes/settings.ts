import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/settings
router.get('/', async (req, res) => {
    const walletAddress = req.headers['x-wallet-address'] as string;

    if (!walletAddress) {
        res.status(400).json({ error: 'Wallet address required' });
        return;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { walletAddress },
            include: { settings: true },
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // If settings don't exist, return defaults (or create them)
        if (!user.settings) {
            const newSettings = await prisma.settings.create({
                data: { userId: user.id },
            });
            res.json(newSettings);
            return;
        }

        res.json(user.settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// PUT /api/settings
router.put('/', async (req, res) => {
    const walletAddress = req.headers['x-wallet-address'] as string;
    const settingsData = req.body;

    if (!walletAddress) {
        res.status(400).json({ error: 'Wallet address required' });
        return;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { walletAddress },
            include: { settings: true },
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const updatedSettings = await prisma.settings.upsert({
            where: { userId: user.id },
            update: settingsData,
            create: {
                ...settingsData,
                userId: user.id,
            },
        });

        res.json(updatedSettings);
    } catch (error) {
        console.error('Error saving settings:', error);
        res.status(500).json({ error: 'Failed to save settings' });
    }
});

export default router;
