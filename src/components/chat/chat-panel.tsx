'use client';

import { useChatPanelStore } from '@/store/use-chat-panel-store';
import { Bell, FileText, Image, Info, LogOut, Users, X } from 'lucide-react';

import { cn } from '@/utils/cn';

import Avatar from '../ui/avatar';
import { ScrollableView } from '../ui/scrollable-view';

export default function ChatPanel() {
    const { isOpen, close } = useChatPanelStore();

    return (
        <aside
            className={cn(
                'absolute h-full inset-y-0 right-0 z-50 w-full lg:w-80 bg-sky-100 transition-all duration-300 transform  lg:border-l border-border rounded-lg',
                'lg:relative lg:inset-y-auto lg:z-0 lg:translate-x-0',
                isOpen ? 'translate-x-0' : 'translate-x-full lg:w-0 g:opacity-0',
            )}
        >
            <div className={cn('flex flex-col h-full overflow-hidden w-full lg:w-80', !isOpen && 'lg:w-0')}>
                <button
                    onClick={close}
                    className="p-2 absolute top-4 right-4 ounded-md hover:bg-accent transition lg:hidden"
                >
                    <X className="h-5 w-5" />
                </button>

                <ScrollableView className="flex-1">
                    <div className="px-4 mt-12 lg:mt-6 space-y-6">
                        {/* Group Profile */}
                        <div className="flex flex-col items-center text-center space-y-3">
                            <Avatar
                                className="h-20 w-20 text-2xl"
                                src="/images/community-avatar.png"
                                backgroundColor="cyan"
                            />
                            <div>
                                <h3 className="font-bold text-xl">Community Chat</h3>
                                <p className="text-sm text-muted-foreground">Created by John Doe • 2 months ago</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                <Info className="h-4 w-4" />
                                <span>Description</span>
                            </div>
                            <p className="text-sm">
                                Welcome to our community chat! Share your thoughts, ask questions, and connect with
                                others.
                            </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { icon: Bell, label: 'Mute' },
                                { icon: Users, label: 'Members' },
                                { icon: Image, label: 'Media' },
                                { icon: FileText, label: 'Files' },
                            ].map((action, i) => (
                                <button
                                    key={i}
                                    className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent transition cursor-pointer"
                                >
                                    <div className="p-2 rounded-full bg-accent/50">
                                        <action.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-[10px] font-medium">{action.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Members Preview */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold">Members (12)</span>
                                <button className="text-xs text-primary hover:underline">View all</button>
                            </div>
                            <div className="space-y-2">
                                {[1, 2, 3].map((m) => (
                                    <div key={m} className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8" backgroundColor={m === 1 ? 'blue' : 'orange'} />
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-medium truncate">User {m}</p>
                                            <p className="text-xs text-muted-foreground">Online</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollableView>

                {/* Danger Zone - Fixed at bottom */}
                <div className="p-4 border-t border-border bg-red-100">
                    <button className="flex items-center gap-3 w-full p-2 text-destructive hover:bg-destructive/10 rounded-md transition cursor-pointer">
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm font-medium">Leave Group</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
