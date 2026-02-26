'use client';

import { useAuthStore } from '@/store/use-auth-store';
import { useCommunityConversationStore } from '@/store/use-community-conversation-store';
import { useCurrentMessages } from '@/store/use-current-messages';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import { ReactRenderer, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';
import tippy from 'tippy.js';
import { Instance as TippyInstance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

import { MentionList } from '@/components/tiptap/mention-list';

type MentionItem = {
    id: string;
    name: string;
    avatar?: string; // Add avatar to the type
};

export const CustomMention = Mention.configure({
    HTMLAttributes: {
        class: 'text-blue-500 font-medium',
    },

    suggestion: {
        items: ({ query }: { query: string }): MentionItem[] => {
            const conversation = useCommunityConversationStore.getState().conversation;
            const messages = useCurrentMessages.getState().messages;
            const currentUser = useAuthStore.getState().user;

            // Get participants from conversation
            const participants = conversation?.participants ?? [];
            const usersFromParticipants: MentionItem[] = participants
                .filter((user) => user.id.toString() !== currentUser?.id.toString())
                .map((user) => ({
                    id: user.username || user.id.toString(),
                    name: user.name || user.username || 'Unknown',
                    avatar: user.picture || user.avatar,
                }));

            // Get unique senders from messages as fallback/addition
            const usersFromMessages: MentionItem[] = [];
            const seenIds = new Set(usersFromParticipants.map((u) => u.id));
            // Add current user to seenIds to prevent them from being added via messages loop
            if (currentUser) {
                seenIds.add(currentUser.username || currentUser.id.toString());
                seenIds.add(currentUser.id.toString());
            }

            messages.forEach((msg) => {
                const identifier = msg.sender.username || msg.sender.id.toString();
                const senderId = msg.sender.id.toString();

                if (senderId !== currentUser?.id.toString() && !seenIds.has(identifier) && msg.sender.name) {
                    seenIds.add(identifier);
                    usersFromMessages.push({
                        id: identifier,
                        name: msg.sender.name,
                        avatar: msg.sender.picture || undefined,
                    });
                }
            });

            const allUsers = [...usersFromParticipants, ...usersFromMessages];

            return allUsers.filter((user) => user.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
        },

        render: () => {
            let reactRenderer: ReactRenderer | null = null;
            let popup: TippyInstance | null = null;

            return {
                onStart: (props: SuggestionProps<MentionItem>) => {
                    reactRenderer = new ReactRenderer(MentionList, {
                        props,
                        editor: props.editor,
                    });

                    if (!props.clientRect) {
                        return;
                    }

                    const instances = tippy(document.body, {
                        getReferenceClientRect: props.clientRect,
                        appendTo: () => document.body,
                        content: reactRenderer.element,
                        showOnCreate: true,
                        interactive: true,
                        trigger: 'manual',
                        placement: 'bottom-start',
                        theme: 'mention',
                        arrow: false,
                    });

                    popup = instances[0];
                },

                onUpdate(props: SuggestionProps<MentionItem>) {
                    reactRenderer?.updateProps(props);

                    if (props.clientRect) {
                        popup?.setProps({
                            getReferenceClientRect: () => props.clientRect?.() || new DOMRect(),
                        });
                    }
                },

                onKeyDown(props: SuggestionKeyDownProps) {
                    if (props.event.key === 'Escape') {
                        popup?.hide();
                        return true;
                    }

                    if (
                        props.event.key === 'ArrowUp' ||
                        props.event.key === 'ArrowDown' ||
                        props.event.key === 'Enter'
                    ) {
                        const handled = (
                            reactRenderer?.ref as {
                                onKeyDown?: (props: SuggestionKeyDownProps) => boolean;
                            } | null
                        )?.onKeyDown?.(props);

                        if (handled) {
                            props.event.preventDefault();
                            props.event.stopPropagation();
                            return true;
                        }
                    }

                    return false;
                },

                onExit() {
                    popup?.destroy();
                    reactRenderer?.destroy();
                },
            };
        },
    },
});

export function useTiptapEditor({ placeholderText = 'Type a message...' }: { placeholderText?: string }) {
    const editor = useEditor({
        immediatelyRender: false, // Added this to address the SSR error
        extensions: [
            StarterKit.configure({
                heading: false,
                horizontalRule: false,
                codeBlock: false,
                blockquote: false,
                strike: false,
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            Placeholder.configure({
                placeholder: placeholderText,
            }),
            CustomMention, // Use the CustomMention defined above
        ],
        editorProps: {
            attributes: {
                class: 'min-h-[24px] prose dark:prose-invert prose-sm sm:prose-base focus:outline-none whitespace-pre-wrap [&_*]:break-words [overflow-wrap:anywhere]',
            },
        },
        content: '',
    });

    return editor;
}
