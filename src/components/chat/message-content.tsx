import { useCommunityConversationStore } from '@/store/use-community-conversation-store';
import { useCurrentMessages } from '@/store/use-current-messages';
import {
    type Attachment,
    type BasicUserInfo,
    MESSAGE_ROLE,
    type Message,
    MessageReactions,
    type MessageRole,
} from '@/types/chat.type';
import { FileText } from 'lucide-react';

import { cn } from '@/utils/cn';

import { MentionBadge } from './mention-badge';
import { ReactionGroup } from './reaction-group';

type MessageContentProps = {
    id: string;
    text: string;
    sender: MessageRole;
    reactions: MessageReactions;
    reply_to_message?: Message | null;
    attachments?: Attachment[];
    mentions?: BasicUserInfo[];
};

export function MessageContent({
    id,
    text,
    sender,
    reactions,
    reply_to_message,
    attachments,
    mentions,
}: MessageContentProps) {
    const { fetchMessageContext } = useCurrentMessages();
    const { conversation } = useCommunityConversationStore();

    const applyHighlight = (msgId: string, behavior: ScrollBehavior = 'smooth') => {
        const element = document.getElementById(`message-${msgId}`);
        if (element) {
            // Find the closest scrollable viewport (Radix ScrollArea.Viewport)
            const viewport = element.closest('[data-radix-scroll-area-viewport]') as HTMLElement;

            if (viewport) {
                // Manual centering:
                // targetScrollTop = (elementTop relative to viewport) - (viewportHeight/2) + (elementHeight/2)
                const elementRect = element.getBoundingClientRect();
                const viewportRect = viewport.getBoundingClientRect();

                // Position of the element relative to the top of the viewport
                const relativeTop = elementRect.top - viewportRect.top + viewport.scrollTop;

                // Calculate the scroll position that centers the element
                const targetScrollTop = relativeTop - viewportRect.height / 2 + elementRect.height / 2;

                viewport.scrollTo({
                    top: targetScrollTop,
                    behavior: behavior,
                });
            } else {
                // Fallback to basic behavior if viewport not found
                element.scrollIntoView({ behavior, block: 'center' });
            }

            element.classList.add('ring-2', 'ring-primary/50', 'transition-all', 'duration-500');
            setTimeout(() => {
                element.classList.remove('ring-2', 'ring-primary/50');
            }, 2000);
            return true;
        }
        return false;
    };

    const scrollToMessage = async (msgId: string) => {
        // 1. Try to find and scroll immediately (if in current messages)
        if (applyHighlight(msgId)) return;

        // 2. If not found, fetch context
        if (conversation?.id) {
            await fetchMessageContext(conversation.id, msgId);
            // 3. After context is loaded, jump instantly (behavior: 'auto')
            // Then highlight. 'auto' is much more stable after a large DOM swap.
            setTimeout(() => {
                applyHighlight(msgId, 'smooth');
            }, 200);
        }
    };

    const getReplyText = (msg: Message) => {
        const content = msg.text || msg.content;
        if (!content) return '';

        try {
            if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
                const parsed = JSON.parse(content);
                if (parsed.text) return parsed.text;
                if (parsed.content) return parsed.content;
            }
        } catch (_e) {
            // Not JSON
        }
        return content;
    };

    const renderTextWithMentions = (textContent: string) => {
        if (!mentions || mentions.length === 0) return textContent;

        // Create a regex to match @username
        const parts = textContent.split(/(@\w+)/g);

        return parts.map((part, index) => {
            if (part.startsWith('@')) {
                const username = part.slice(1);
                const mention = mentions.find((m) => m.username === username);

                if (mention) {
                    return <MentionBadge key={index} mention={mention} />;
                }
            }
            return part;
        });
    };

    const imageAttachments = attachments?.filter((a) => a.mime_type?.startsWith('image/')) || [];
    const fileAttachments = attachments?.filter((a) => !a.mime_type?.startsWith('image/')) || [];

    return (
        <div
            className={cn(
                'max-w-[50vw] md:max-w-[calc(50vw-var(--sidebar-width)+100px)] lg:max-w-100 xl:max-w-125 flex flex-col',
                sender === MESSAGE_ROLE.ME ? 'items-end' : 'items-start',
            )}
        >
            <div
                id={`message-${id}`}
                className={cn(
                    'relative w-full rounded-xl p-3 text-sm wrap-break-word shadow-sm mb-2 max-w-full',
                    sender === MESSAGE_ROLE.ME
                        ? 'bg-primary text-white after:content-[""] after:absolute after:top-3 after:-right-2 after:border-t-[10px] after:border-t-primary after:border-r-[10px] after:border-r-transparent'
                        : 'bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100 before:content-[""] before:absolute before:top-3 before:-left-2 before:border-t-[10px] before:border-t-zinc-200 dark:before:border-t-zinc-800 before:border-l-[10px] before:border-l-transparent',
                )}
            >
                {reply_to_message && (
                    <div
                        onClick={() => scrollToMessage(reply_to_message.id)}
                        className={cn(
                            'flex flex-col gap-0.5 font-medium cursor-pointer transition-colors max-w-full border-b mb-2 pb-2',
                            sender === MESSAGE_ROLE.ME
                                ? 'text-gray-300 hover:text-white border-gray-300 hover:border-white'
                                : 'text-gray-500 hover:text-gray-700 border-gray-400 hover:border-gray-600',
                        )}
                    >
                        <span className="text-[10px]  uppercase leading-none">
                            Reply to{' '}
                            {reply_to_message.role === MESSAGE_ROLE.ME
                                ? 'You'
                                : reply_to_message.sender.name || reply_to_message.sender.username || 'Unknown'}
                        </span>
                        <p className="text-xs  italic leading-tight line-clamp-2">{getReplyText(reply_to_message)}</p>
                    </div>
                )}

                {text.trim() !== '' && <p className="">{renderTextWithMentions(text)}</p>}

                <div
                    className={cn(
                        'flex flex-col gap-2',
                        text.trim() === '' ? 'mt-0' : 'mt-2',
                        !imageAttachments.length && !fileAttachments.length ? 'hidden' : '',
                    )}
                >
                    {imageAttachments.length > 0 && (
                        <div
                            className={cn(
                                'grid gap-2 rounded-lg w-full max-w-full',
                                imageAttachments.length === 1 ? 'grid-cols-1' : 'grid-cols-2',
                                sender === MESSAGE_ROLE.ME
                                    ? 'rounded-br-none text-white'
                                    : 'bg-zinc-200 text-zinc-800 rounded-bl-none dark:bg-zinc-800 dark:text-zinc-100',
                                reply_to_message &&
                                    (sender === MESSAGE_ROLE.ME ? 'rounded-tr-none' : 'rounded-tl-none'),
                            )}
                        >
                            {imageAttachments.map((attachment, index) => (
                                <a
                                    key={attachment.id}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        'relative overflow-hidden rounded-md group',
                                        imageAttachments.length === 1 ? 'aspect-auto max-h-[300px]' : 'aspect-square',
                                        imageAttachments.length % 2 !== 0 && imageAttachments.length > 1 && index === 0
                                            ? 'col-span-2 aspect-video'
                                            : '',
                                    )}
                                >
                                    <img
                                        src={attachment.url}
                                        alt={attachment.name || 'Attached image'}
                                        className="w-full h-full object-cover transition-transform hover:scale-105"
                                    />
                                </a>
                            ))}
                        </div>
                    )}

                    {fileAttachments.length > 0 && (
                        <div
                            className={cn(
                                'grid gap-2 rounded-lg w-full max-w-full',
                                fileAttachments.length === 1 ? 'grid-cols-1' : 'grid-cols-2',
                                sender === MESSAGE_ROLE.ME
                                    ? 'rounded-br-none text-white'
                                    : 'bg-zinc-200 text-zinc-800 rounded-bl-none dark:bg-zinc-800 dark:text-zinc-100',
                                reply_to_message &&
                                    (sender === MESSAGE_ROLE.ME ? 'rounded-tr-none' : 'rounded-tl-none'),
                            )}
                        >
                            {fileAttachments.map((attachment) => (
                                <a
                                    key={attachment.id}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-2 rounded-md bg-white/20 hover:bg-white/30 transition-colors overflow-hidden"
                                >
                                    <FileText className="h-4 w-4 shrink-0 text-white" />
                                    <span className="text-xs text-white truncate">{attachment.name || 'File'}</span>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ReactionGroup reactions={reactions} sender={sender} />
        </div>
    );
}
