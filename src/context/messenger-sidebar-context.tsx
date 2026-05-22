'use client';

import { ReactNode, createContext, useContext, useState } from 'react';

interface MessengerSidebarContextType {
    isMessengerSidebarOpen: boolean;
    toggleMessengerSidebar: () => void;
    setIsMessengerSidebarOpen: (isOpen: boolean) => void;
    closeMessengerSidebar: () => void;
}

const MessengerSidebarContext = createContext<MessengerSidebarContextType | undefined>(undefined);

export function useMessengerSidebar() {
    const context = useContext(MessengerSidebarContext);
    if (context === undefined) {
        throw new Error('useMessengerSidebar must be used within a MessengerSidebarProvider');
    }
    return context;
}

export function MessengerSidebarProvider({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <MessengerSidebarContext.Provider
            value={{
                isMessengerSidebarOpen: isSidebarOpen,
                toggleMessengerSidebar: toggleSidebar,
                setIsMessengerSidebarOpen: setIsSidebarOpen,
                closeMessengerSidebar: closeSidebar,
            }}
        >
            {children}
        </MessengerSidebarContext.Provider>
    );
}
