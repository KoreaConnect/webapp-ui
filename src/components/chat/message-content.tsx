import type { Attachment, Message } from '@/types/chat.type';
import { FileText } from 'lucide-react';

import { cn } from '@/utils/cn';

import { ReactionGroup } from './reaction-group';

type MessageContentProps = {
    id: string;
    text: string;
    sender: 'me' | 'other';
    reactions: Record<string, string[]>;
    reply_to_message?: Message | null;
    attachments?: Attachment[];
};

export function MessageContent({ id, text, sender, reactions, reply_to_message, attachments }: MessageContentProps) {
    const scrollToMessage = (msgId: string) => {
        const element = document.getElementById(`message-${msgId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('ring-2', 'ring-primary/50', 'transition-all', 'duration-500');
            setTimeout(() => {
                element.classList.remove('ring-2', 'ring-primary/50');
            }, 2000);
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

    return (
        <div
            className={cn(
                'max-w-[50vw] md:max-w-[calc(50vw-var(--sidebar-width)+100px)] lg:max-w-100 xl:max-w-125 flex flex-col',
                sender === 'me' ? 'items-end' : 'items-start',
            )}
        >
            {reply_to_message && (
                <div
                    onClick={() => scrollToMessage(reply_to_message.id)}
                    className={cn(
                        'flex flex-col gap-0.5 px-3 py-2 pb-3 -mb-2 cursor-pointer transition-colors \
                        hover:bg-zinc-200 dark:hover:bg-zinc-800/50 max-w-full',
                        sender === 'me'
                            ? 'bg-zinc-300 dark:bg-zinc-800/30 rounded-tl-2xl'
                            : 'bg-zinc-300 dark:bg-zinc-800/50 rounded-tr-2xl',
                    )}
                >
                    <span className="text-[10px] font-bold text-primary uppercase leading-none">
                        {reply_to_message.sender === 'me' ? 'You' : reply_to_message.name}
                    </span>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 italic leading-tight truncate">
                        {getReplyText(reply_to_message)}
                    </p>
                </div>
            )}

            {attachments && attachments.length > 0 && (
                <div
                    className={cn(
                        'flex flex-col gap-2 p-2 rounded-lg mb-2 max-w-full',
                        sender === 'me'
                            ? 'bg-primary/80 rounded-br-none text-white'
                            : 'bg-zinc-200 text-zinc-800 rounded-bl-none dark:bg-zinc-800 dark:text-zinc-100',
                        reply_to_message && (sender === 'me' ? 'rounded-tr-none' : 'rounded-tl-none'),
                    )}
                >
                    {attachments.map((attachment) => (
                        <a
                            key={attachment.id}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 rounded-md bg-white/20 hover:bg-white/30 transition-colors"
                        >
                            {attachment.mime_type?.startsWith('image/') ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={attachment.url}
                                    alt={attachment.name || 'Attached image'}
                                    className="max-h-32 object-contain rounded-md"
                                />
                            ) : (
                                <FileText className="h-5 w-5 text-white" />
                            )}
                            <span className="text-sm text-white truncate">{attachment.name || 'File'}</span>
                        </a>
                    ))}
                </div>
            )}

            {text.trim() !== '' && (
                <div
                    id={`message-${id}`}
                    className={cn(
                        'rounded-2xl p-3 text-sm wrap-break-word shadow-sm mb-2 max-w-full',
                        sender === 'me'
                            ? 'bg-primary rounded-tr-none text-white'
                            : 'bg-zinc-200 text-zinc-800 rounded-tl-none dark:bg-zinc-800 dark:text-zinc-100',
                        reply_to_message && (sender === 'me' ? 'rounded-tr-none' : 'rounded-tl-none'),
                        attachments &&
                            attachments.length > 0 &&
                            (sender === 'me' ? 'rounded-tr-none' : 'rounded-tl-none'),
                    )}
                >
                    <p className="">{text}</p>
                </div>
            )}

            <ReactionGroup reactions={reactions} sender={sender} />
        </div>
    );
}
