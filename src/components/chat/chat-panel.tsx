'use client';

import { useEffect } from 'react';

import { useChatPanelStore } from '@/store/use-chat-panel-store';
import { useCommunityConversationStore } from '@/store/use-community-conversation-store';
import { Bell, FileText, Image, Info, LogOut, Users, X } from 'lucide-react';

import { cn } from '@/utils/cn';

import Avatar from '../ui/avatar';
import CloseButton from '../ui/close-button';
import { ScrollableView } from '../ui/scrollable-view';
import { MemberList } from './member-list';

export default function ChatPanel() {
    const { isOpen, close } = useChatPanelStore();
    const { conversation, members } = useCommunityConversationStore();

    if (!conversation) return null;

    return (
        <aside
            className={cn(
                'absolute h-full inset-y-0 right-0 z-(--chat-panel-z-index) w-full lg:w-80 bg-background transition-all duration-300 transform ',
                'lg:relative lg:inset-y-auto lg:z-0 lg:translate-x-0',
                isOpen ? 'translate-x-0' : 'translate-x-full lg:w-0 lg:opacity-0 pointer-events-none',
            )}
            aria-hidden={!isOpen}
            inert={!isOpen}
        >
            <div
                className={cn(
                    'flex flex-col h-full overflow-hidden w-full lg:w-80 lg:border-l border-border ',
                    !isOpen && 'lg:w-0',
                )}
            >
                <CloseButton onClick={close} className="absolute top-4 right-4 z-1" />

                <ScrollableView className="flex-1">
                    <div className="px-4 mt-12 lg:mt-6 space-y-6">
                        {/* Group Profile */}
                        <div className="flex flex-col items-center text-center space-y-3">
                            <Avatar
                                className="h-20 w-20 text-2xl"
                                src={conversation.thumbnail_url}
                                backgroundColor="cyan"
                            />
                            <div>
                                <h3 className="font-bold text-xl">{conversation.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    Created by {conversation.createdBy} • {conversation.createdAt}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        {conversation.description && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                    <Info className="h-4 w-4" />
                                    <span>Description</span>
                                </div>
                                <p className="text-sm">{conversation.description}</p>
                            </div>
                        )}

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

                        {/* Members List */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold">Members ({members.length})</span>
                                <button className="text-xs text-primary hover:underline">View all</button>
                            </div>
                            <MemberList />
                        </div>
                    </div>
                </ScrollableView>

                {/* Danger Zone - Fixed at bottom */}
                <div className="p-4 border-t border-border bg-red-100 ">
                    <button className="flex items-center gap-3 w-full p-2 text-destructive hover:bg-destructive/10 transition cursor-pointer">
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm font-medium">Leave Group</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
