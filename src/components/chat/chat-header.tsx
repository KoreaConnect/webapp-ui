'use client';

import { useChatPanelStore } from '@/store/use-chat-panel-store';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';

import Avatar from '../ui/avatar';

type ChatHeaderProps = {
    title: string;
    thumbnailUrl?: string;
    onlineUserCount?: number;
};

function ChatHeader({ title, thumbnailUrl, onlineUserCount }: ChatHeaderProps) {
    const { toggle, isOpen } = useChatPanelStore();

    return (
        <div className="p-4 h-chat-header border-b border-border gap-3 flex justify-between items-center bg-background">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10" src={thumbnailUrl} backgroundColor="cyan" />
                <div>
                    <h2 className="font-bold">{title}</h2>
                    <p className="text-xs text-green-500 font-medium"> {onlineUserCount} Online</p>
                </div>
            </div>

            <button onClick={toggle} className="p-2 rounded-md hover:bg-accent/50 transition cursor-pointer">
                {isOpen ? <PanelRightClose className="h-6 w-6" /> : <PanelRightOpen className="h-6 w-6" />}
            </button>
        </div>
    );
}

export default ChatHeader;
