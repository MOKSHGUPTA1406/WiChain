import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/executions
router.get('/', async (req, res) => {
    // Read wallet address from header or query
    const walletAddress = req.headers['x-wallet-address'] as string;

    if (!walletAddress) {
        res.status(400).json({ error: 'Wallet address header required' });
        return;
    }

    try {
        // Find user first
        const user = await prisma.user.findUnique({
            where: { walletAddress },
        });

        if (!user) {
            res.json([]); // Return empty if user doesn't exist yet
            return;
        }

        const executions = await prisma.execution.findMany({
            where: { userId: user.id },
            include: { applet: true },
            orderBy: { timestamp: 'desc' },
            take: 20 // Limit to last 20
        });

        res.json(executions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch executions' });
    }
});

// POST /api/executions
router.post('/', async (req, res) => {
    const { walletAddress, appletId } = req.body;
    const io = (req as any).io;

    if (!walletAddress || !appletId) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    try {
        // Ensure user exists
        let user = await prisma.user.findUnique({ where: { walletAddress } });
        if (!user) {
            user = await prisma.user.create({ data: { walletAddress } });
        }

        const applet = await prisma.applet.findUnique({ where: { id: appletId } });
        if (!applet) {
            res.status(404).json({ error: 'Applet not found' });
            return;
        }

        // Create "Pending" execution
        const execution = await prisma.execution.create({
            data: {
                status: 'pending',
                fee: applet.gasCost,
                appletId: applet.id,
                userId: user.id,
            },
            include: { applet: true }
        });

        // Emit initial update
        io.to(walletAddress).emit('execution_update', execution);

        res.json(execution);

        // Simulate async simulation
        setTimeout(async () => {
            // 80% chance of success
            const isSuccess = Math.random() > 0.2;
            const status = isSuccess ? 'success' : 'failed';

            const updatedExecution = await prisma.execution.update({
                where: { id: execution.id },
                data: { status },
                include: { applet: true }
            });

            console.log(`Execution ${execution.id} processed: ${status}`);

            // Emit final update
            io.to(walletAddress).emit('execution_update', updatedExecution);

        }, 3000); // 3 seconds simulation time

    } catch (error) {
        console.error('Execution error:', error);
        res.status(500).json({ error: 'Failed to create execution' });
    }
});

// DELETE /api/executions
router.delete('/', async (req, res) => {
    const walletAddress = req.headers['x-wallet-address'] as string;

    if (!walletAddress) {
        res.status(400).json({ error: 'Wallet address header required' });
        return;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { walletAddress },
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        await prisma.execution.deleteMany({
            where: { userId: user.id },
        });

        res.json({ message: 'History cleared' });
    } catch (error) {
        console.error('Clear history error:', error);
        res.status(500).json({ error: 'Failed to clear history' });
    }
});

export default router;
