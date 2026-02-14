'use client';

import { useSocketListener } from '@/hooks/use-socket-listener';

function SocketProvider() {
    useSocketListener('chat:new_message', (payload) => {
        console.log(payload);
    });

    return null;
}

export default SocketProvider;
