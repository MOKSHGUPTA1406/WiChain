import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import appletRoutes from './routes/applets';
import executionRoutes from './routes/executions';
import settingsRoutes from './routes/settings';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT"]
    }
});

app.use(cors());
app.use(express.json());

// Inject io into request
app.use((req, res, next) => {
    (req as any).io = io;
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applets', appletRoutes);
app.use('/api/executions', executionRoutes);
app.use('/api/settings', settingsRoutes);

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (walletAddress) => {
        socket.join(walletAddress);
        console.log(`User ${walletAddress} joined room`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
