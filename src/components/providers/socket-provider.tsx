'use client';
import { useEffect } from 'react';

import { getSocket } from '@/config/ws';

function SocketProvider() {
    useEffect(() => {
        const ws = getSocket();
        ws.onopen = () => console.log('WS connected');
        ws.onclose = () => console.log('WS closed');
    }, []);

    return null;
}

export default SocketProvider;
