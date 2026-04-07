'use client';

import { useEffect } from 'react';

import { useMessengerSidebar } from '@/context/messenger-sidebar-context';
import { useConversationsStore } from '@/store/use-conversations-store';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Avatar from '@/components/ui/avatar';
import { Loader } from '@/components/ui/loader';
import { ScrollableView } from '@/components/ui/scrollable-view';

import { cn } from '@/utils';

export default function MessengerSidebar() {
    const pathname = usePathname();
    const { conversations, isLoading, fetchConversations } = useConversationsStore();
    const { isMessengerSidebarOpen, closeMessengerSidebar } = useMessengerSidebar();
    const isShowCloseButton = pathname.startsWith('/messenger/');

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    return (
        <aside
            className={cn(
                'md:w-80 border-r border-border bg-background  md:flex md:flex-col h-full overflow-hidden shrink-0 md:static md:mt-0',
                'absolute z-20 mt-header inset-y-0 left-0 w-full',
                !isMessengerSidebarOpen && 'hidden',
            )}
        >
            <div className="p-4 border-b h-chat-header border-border flex items-center justify-between gap-4">
                <h1 className="text-xl font-bold">Messages</h1>
                {isShowCloseButton && (
                    <ChevronLeft
                        className="h-6 w-6 cursor-pointer md:hidden"
                        onClick={closeMessengerSidebar}
                        aria-label="Close Messenger Sidebar"
                    />
                )}
            </div>
            <ScrollableView vertical className="flex-1">
                {isLoading && conversations.length === 0 ? (
                    <div className="flex justify-center p-4">
                        <Loader size={24} />
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {conversations.map((conv) => {
                            const isActive = pathname === `/messenger/${conv.id}`;
                            const lastMsg = conv.last_message;

                            return (
                                <Link
                                    key={conv.id}
                                    href={`/messenger/${conv.id}`}
                                    className={cn(
                                        'flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors border-b border-border/50 relative',
                                        isActive && 'bg-accent',
                                    )}
                                >
                                    <Avatar
                                        src={conv.thumbnail_url || ''}
                                        alt={conv.title}
                                        fallback={conv.title.charAt(0).toUpperCase()}
                                        size={48}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-semibold truncate text-sm">{conv.title}</h3>
                                            {conv.last_message_at && (
                                                <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                                    {new Date(conv.last_message_at).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center mt-0.5">
                                            <p className="text-xs text-muted-foreground truncate flex-1 min-w-0">
                                                {lastMsg ? (
                                                    <>
                                                        <span className="font-medium text-foreground/80">
                                                            {lastMsg.sender_name}:{' '}
                                                        </span>
                                                        {lastMsg.content}
                                                    </>
                                                ) : (
                                                    'No messages yet'
                                                )}
                                            </p>
                                            {conv.unread_count && conv.unread_count > 0 && (
                                                <span className="ml-2 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.2rem] text-center">
                                                    {conv.unread_count}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {conv.onlineCount !== undefined && conv.onlineCount > 0 && (
                                        <div className="w-2 h-2 rounded-full bg-green-500 absolute top-4 left-12 border border-background" />
                                    )}
                                </Link>
                            );
                        })}
                        {conversations.length === 0 && !isLoading && (
                            <div className="p-8 text-center text-muted-foreground text-sm">No conversations yet.</div>
                        )}
                    </div>
                )}
            </ScrollableView>
        </aside>
    );
}
