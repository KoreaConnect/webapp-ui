import { useEffect } from 'react';

import { getSocket } from '@/config/ws';

export const useSocketListener = <T>(type: string, callback: (data: T) => void) => {
    useEffect(() => {
        const ws = getSocket();

        const handleMessage = (event: MessageEvent) => {
            try {
                const payload = JSON.parse(event.data);
                console.log('payload:', payload);
                if (payload.type === type) {
                    callback(payload.payload);
                }
            } catch (error) {
                console.error('WS Parse Error:', error);
            }
        };

        ws.addEventListener('message', handleMessage);
        return () => ws.removeEventListener('message', handleMessage);
    }, [type, callback]);
};
