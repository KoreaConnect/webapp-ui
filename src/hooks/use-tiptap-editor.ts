'use client';

import { useAuthStore } from '@/store/use-auth-store';
import { useCommunityConversationStore } from '@/store/use-community-conversation-store';
import { useCurrentMessages } from '@/store/use-current-messages';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import { type Editor, Range, ReactRenderer, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';
import tippy, { type Instance as TippyInstance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

import { MentionList } from '@/components/tiptap/mention-list';

export type MentionItem = {
    userId: string | number; // This is the actual numeric ID
    username: string; // This can be the username or fallback
    name: string;
    avatar?: string;
};

// Define interface for mention command props
interface MentionCommandProps {
    id: string;
    userId: string | number;
    label: string;
}

export const CustomMention = Mention.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            userId: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-user-id'),
                renderHTML: (attributes) => {
                    if (!attributes.userId) {
                        return {};
                    }
                    return {
                        'data-user-id': attributes.userId,
                    };
                },
            },
        };
    },
}).configure({
    HTMLAttributes: {
        class: 'text-blue-500 font-medium',
    },
    suggestion: {
        items: ({ query, editor }: { query: string; editor: Editor }): MentionItem[] => {
            const { members, conversation } = useCommunityConversationStore.getState();

            const currentUser = useAuthStore.getState().user;

            // Get existing mentions from the editor content to avoid duplicates
            const existingMentionIds = new Set<string>();
            editor.state.doc.descendants((node) => {
                if (node.type.name === 'mention' && node.attrs.userId) {
                    existingMentionIds.add(node.attrs.userId.toString());
                }
            });

            // 1. Map members from the official list
            const usersFromMembers: MentionItem[] = members
                .filter((user) => {
                    const userIdStr = user.id.toString();
                    return userIdStr !== currentUser?.id.toString() && !existingMentionIds.has(userIdStr);
                })
                .map((user) => ({
                    userId: user.id,
                    username: user.username || user.id.toString(),
                    name: user.name,
                    avatar: (user.avatar || user.picture) ?? undefined,
                }));

            const seenUserIds = new Set(usersFromMembers.map((u) => u.userId.toString()));
            if (currentUser) seenUserIds.add(currentUser.id.toString());

            // 2. Fallback: Map participants from conversation object
            const participants = conversation?.participants ?? [];
            const usersFromParticipants: MentionItem[] = participants
                .filter((user) => {
                    const userIdStr = user.id.toString();
                    return (
                        !seenUserIds.has(userIdStr) &&
                        userIdStr !== currentUser?.id.toString() &&
                        !existingMentionIds.has(userIdStr)
                    );
                })
                .map((user) => ({
                    id: user.username || user.id.toString(),
                    userId: user.id,
                    username: user.username || user.id.toString(),
                    name: user.name,
                    avatar: (user.picture || user.avatar) ?? undefined,
                }));

            usersFromParticipants.forEach((u) => seenUserIds.add(u.userId.toString()));

            const allUsers = [...usersFromMembers, ...usersFromParticipants];

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
                        placement: 'top-start',
                        theme: 'mention',
                        arrow: false,
                    });

                    popup = instances[0];
                },

                onUpdate(props: SuggestionProps<MentionItem>) {
                    reactRenderer?.updateProps(props);

                    if (props.clientRect) {
                        popup?.setProps({
                            getReferenceClientRect: props.clientRect,
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

        command: ({ editor, range, props }: { editor: Editor; range: Range; props: MentionCommandProps }) => {
            editor
                .chain()
                .focus()
                .insertContentAt(range, [
                    {
                        type: 'mention',
                        attrs: {
                            id: props.id,
                            label: props.id, // Hiển thị username trong chat input
                            userId: props.userId,
                        },
                    },
                    { type: 'text', text: ' ' },
                ])
                .run();
        },
    },
});

export function useTiptapEditor({ placeholderText = 'Type a message...' }: { placeholderText?: string }) {
    const editor = useEditor({
        immediatelyRender: false,
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
            CustomMention,
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
