'use client';

import { useMessageReactionStore } from '@/store/use-message-reaction-store';
import {
    type Attachment,
    type BasicUserInfo,
    MESSAGE_ROLE,
    type Message,
    type MessageMetadata,
    type MessageRole,
    type ReadReceipt,
} from '@/types/chat.type';

import Avatar from '@/components/ui/avatar';

import { cn } from '@/utils/cn';

import { MessageContent } from './message-content';
import MessageTools from './message-tools';
import { ReadReceipts } from './read-receipts';
import { SystemMessage } from './system-message';

type ChatMessageProps = {
    id: string;
    text: string;
    role: MessageRole;
    time: string;
    avatar?: string;
    name?: string;
    readBy?: ReadReceipt[];
    type?: 'text' | 'system';
    metadata?: MessageMetadata;
    content?: string;
    reply_to_message?: Message | null;
    attachments?: Attachment[];
    mentions?: BasicUserInfo[];
    is_deleted?: boolean;
};

function ChatMessage({
    id,
    text,
    role,
    time,
    avatar = '',
    name,
    readBy,
    type,
    metadata,
    content,
    reply_to_message,
    attachments,
    mentions,
    is_deleted,
}: ChatMessageProps) {
    const messageReactions = useMessageReactionStore((state) => state.messageReactions[id]);
    const reactions = messageReactions ?? {};

    if (type === 'system' || role === 'system') {
        return <SystemMessage message={{ id, text, role, type, metadata, content, mentions, is_deleted } as Message} />;
    }

    return (
        <div
            key={id}
            className={cn(
                'group relative flex flex-col w-full',
                role === MESSAGE_ROLE.ME ? 'justify-end' : 'justify-start',
                role === MESSAGE_ROLE.ME ? 'items-end' : 'items-start',
            )}
        >
            <div className={cn('flex items-start gap-2 w-full', role === MESSAGE_ROLE.ME && 'flex-row-reverse')}>
                <Avatar src={avatar} alt={name} fallback={name?.slice(0, 1).toUpperCase()} size="sm" />

                <div className={cn('flex', role === MESSAGE_ROLE.ME ? 'items-end' : 'items-start')}>
                    <div className={cn('flex items-center gap-2', role === MESSAGE_ROLE.ME && 'flex-row-reverse')}>
                        <MessageContent
                            id={id}
                            text={text}
                            sender={role}
                            reactions={reactions}
                            reply_to_message={reply_to_message}
                            attachments={attachments}
                            mentions={mentions}
                            is_deleted={is_deleted}
                        />
                        <MessageTools
                            messageId={id}
                            position={role === MESSAGE_ROLE.ME ? 'right' : 'left'}
                            is_deleted={is_deleted}
                        />
                    </div>
                </div>
            </div>
            <ReadReceipts readBy={readBy || []} sender={role} />
        </div>
    );
}

export default ChatMessage;
