import Header from '@/app/(main)/layout/header';
import { MessengerSidebarProvider } from '@/context/messenger-sidebar-context';

import MessengerSidebar from './_components/messenger-sidebar';

export default function MessengerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col overflow-hidden bg-background">
            <Header />
            <MessengerSidebarProvider>
                <div className="flex flex-1 overflow-hidden">
                    <MessengerSidebar />
                    <main className="flex-1 min-w-0 flex flex-col h-full relative">
                        <div className="h-full">{children}</div>
                    </main>
                </div>
            </MessengerSidebarProvider>
        </div>
    );
}
