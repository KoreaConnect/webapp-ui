'use client';

import { useSocketListener } from '@/hooks/use-socket-listener';

function SocketProvider({ children }: { children: React.ReactNode }) {
    useSocketListener('chat:new_message', (payload) => {
        console.log('new message', payload);
    });

    return <>{children}</>;
}

export default SocketProvider;
