import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (walletAddress: string) => {
    if (socket) return socket;

    socket = io('http://localhost:3000');

    socket.on('connect', () => {
        console.log('Socket connected');
        socket?.emit('join_room', walletAddress);
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = () => socket;
