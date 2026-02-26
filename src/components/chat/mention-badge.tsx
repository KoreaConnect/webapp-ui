'use client';

import React from 'react';

import { BasicUserInfo } from '@/types/chat.type';
import * as HoverCard from '@radix-ui/react-hover-card';
import { Mail, User as UserIcon } from 'lucide-react';

import Avatar from '@/components/ui/avatar';

import { cn } from '@/utils/cn';

interface MentionBadgeProps {
    mention: BasicUserInfo;
}

export function MentionBadge({ mention }: MentionBadgeProps) {
    return (
        <HoverCard.Root openDelay={200} closeDelay={100}>
            <HoverCard.Trigger asChild>
                <span
                    className={cn(
                        'font-bold cursor-pointer transition-colors inline-block',
                        'text-blue-400 dark:text-blue-300 hover:text-blue-500 dark:hover:text-blue-200 underline decoration-blue-400/30 underline-offset-2',
                    )}
                >
                    @{mention.name}
                </span>
            </HoverCard.Trigger>

            <HoverCard.Portal>
                <HoverCard.Content
                    side="top"
                    align="center"
                    sideOffset={8}
                    className={cn(
                        'z-100 w-64 rounded-xl bg-white p-4 shadow-xl border border-zinc-200',
                        'dark:bg-zinc-900 dark:border-zinc-800',
                        'animate-in fade-in zoom-in duration-200',
                    )}
                >
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <Avatar
                                src={mention.picture || ''}
                                alt={mention.name}
                                fallback={mention.name.charAt(0).toUpperCase()}
                                size="lg"
                            />
                            <div className="flex-1 overflow-hidden">
                                <h4 className="font-bold text-zinc-900 dark:text-white truncate">{mention.name}</h4>
                                <p className="text-xs text-zinc-500 truncate">@{mention.username}</p>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                                <UserIcon className="h-3.5 w-3.5" />
                                <span>Member</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                                <Mail className="h-3.5 w-3.5" />
                                <span className="truncate">{mention.username}@koco.com</span>
                            </div>
                        </div>

                        <button className="w-full py-2 px-4 bg-primary text-white text-xs font-bold rounded-md hover:bg-primary/90 transition-colors cursor-pointer">
                            View Profile
                        </button>
                    </div>
                    <HoverCard.Arrow className="fill-white dark:fill-zinc-900" />
                </HoverCard.Content>
            </HoverCard.Portal>
        </HoverCard.Root>
    );
}
