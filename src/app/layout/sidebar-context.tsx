'use client';

import { ReactNode, createContext, useContext, useState } from 'react';

interface SidebarContextType {
    isOpen: boolean;
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        if (window.innerWidth >= 640) {
            setIsCollapsed(!isCollapsed);
        } else {
            setIsOpen(!isOpen);
        }
    };

    return <SidebarContext.Provider value={{ isOpen, isCollapsed, toggleSidebar }}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}
