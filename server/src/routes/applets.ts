import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/applets
router.get('/', async (req, res) => {
    try {
        const applets = await prisma.applet.findMany();
        const parsedApplets = applets.map(applet => ({
            ...applet,
            metrics: applet.metrics ? JSON.parse(applet.metrics) : undefined
        }));
        res.json(parsedApplets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch applets' });
    }
});

// GET /api/applets/:id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const applet = await prisma.applet.findUnique({
            where: { id },
        });
        if (!applet) {
            res.status(404).json({ error: 'Applet not found' });
            return;
        }
        res.json({
            ...applet,
            metrics: applet.metrics ? JSON.parse(applet.metrics) : undefined
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch applet' });
    }
});

export default router;
