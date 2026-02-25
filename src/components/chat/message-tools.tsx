import { useState } from 'react';

import { useReply } from '@/context/reply-context';
import { useAuthStore } from '@/store/use-auth-store';
import { useCurrentMessages } from '@/store/use-current-messages';
import { useMessageReactionStore } from '@/store/use-message-reaction-store';
import { Reply } from 'lucide-react';

import { cn } from '@/utils/cn';

import { MessageActions } from './message-actions';
import { ReactionPicker } from './reaction-picker';

type MessageToolsProps = {
    messageId: string;
    position?: 'left' | 'right';
};

function MessageTools({ messageId, position = 'right' }: MessageToolsProps) {
    const { messageReactions, toggleReaction } = useMessageReactionStore();
    const { removeMessage, reportMessage } = useCurrentMessages();
    const { openReplyBox } = useReply();
    const currentUserId = useAuthStore((state) => state.user?.id);
    const { messages } = useCurrentMessages();
    const reactions = messageReactions[messageId] ?? {};

    const [actionMenuOpen, setActionMenuOpen] = useState(false);
    const [reactionPickerOpen, setReactionPickerOpen] = useState(false);

    const handleReplyClick = () => {
        const messageToReply = messages.find((msg) => msg.id === messageId);
        if (messageToReply) {
            openReplyBox(messageToReply);
        }
    };

    return (
        <div
            className={cn(
                'flex items-center opacity-0 transition-opacity group-hover:opacity-100',
                position === 'right' ? 'mr-1 flex-row-reverse' : 'ml-1',
                actionMenuOpen || reactionPickerOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                reactions && Object.keys(reactions).length > 0 ? 'mb-6' : '',
            )}
        >
            <ReactionPicker
                reactions={reactions}
                currentUserId={currentUserId?.toString() || ''}
                onSelect={(emoji) => toggleReaction(messageId, emoji)}
                align={position === 'right' ? 'end' : 'start'}
                onOpenChange={setReactionPickerOpen}
            />

            <button
                onClick={handleReplyClick}
                className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer outline-none"
                title="Reply"
            >
                <Reply size={16} />
            </button>

            <MessageActions
                sender={position === 'right' ? 'me' : 'other'}
                onRemove={() => removeMessage(messageId)}
                onReport={() => reportMessage(messageId)}
                align={position === 'right' ? 'end' : 'start'}
                onOpenChange={setActionMenuOpen}
            />
        </div>
    );
}

export default MessageTools;
