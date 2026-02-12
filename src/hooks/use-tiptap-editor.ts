'use client';

import { DUMMY_MESSAGES } from '@/app/(main)/messenger/page';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import { ReactRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import tippy from 'tippy.js';

import { MentionList } from '@/components/tiptap/mention-list';

export const CustomMention = Mention.configure({
    HTMLAttributes: {
        class: 'text-blue-500 font-medium',
    },
    suggestion: {
        items: ({ query }) => {
            // Filter users based on query
            const users = DUMMY_MESSAGES.map((msg) => ({ id: msg.id, name: msg.name || msg.sender }));
            return users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
        },
        render: () => {
            let reactRenderer: ReactRenderer;
            let popup: unknown;

            return {
                onStart: (props) => {
                    reactRenderer = new ReactRenderer(MentionList, {
                        props,
                        editor: props.editor,
                        // Pass a key to force remount when items change, resetting internal state
                        // The key should uniquely identify the list of items for reset purposes.
                        key: props.items.map((item: unknown) => item.id).join('-'),
                    });

                    popup = tippy('body', {
                        getReferenceClientRect: props.clientRect,
                        appendTo: () => document.body,
                        content: reactRenderer.element,
                        showOnCreate: true,
                        interactive: true,
                        trigger: 'manual',
                        placement: 'bottom-start',
                    });
                },
                onUpdate(props) {
                    reactRenderer.updateProps(props);

                    popup[0].setProps({
                        getReferenceClientRect: props.clientRect,
                    });
                },
                onKeyDown(props) {
                    if (props.event.key === 'Escape') {
                        popup[0].hide();
                        return true;
                    }
                    if (
                        props.event.key === 'ArrowUp' ||
                        props.event.key === 'ArrowDown' ||
                        props.event.key === 'Enter'
                    ) {
                        if (reactRenderer.ref?.onKeyDown(props)) {
                            props.event.preventDefault();
                            props.event.stopPropagation(); // Explicitly stop propagation here
                            return true;
                        }
                    }
                    return false;
                },
                onExit() {
                    popup[0].destroy();
                    reactRenderer.destroy();
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
