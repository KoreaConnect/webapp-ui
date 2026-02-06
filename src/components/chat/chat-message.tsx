type ChatMessageProps = {
    id: string;
    text: string;
    sender: 'me' | 'other';
    time: string;
};
function ChatMessage({ id, text, sender, time }: ChatMessageProps) {
    return (
        <div key={id} className={`flex ${sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[70%] rounded-2xl p-3 text-sm
                                        ${
                                            sender === 'me'
                                                ? 'bg-primary text-white rounded-tr-none'
                                                : 'bg-zinc-300 text-zinc-800 rounded-tl-none'
                                        }
                                    `}
            >
                <p>{text}</p>
                <span className={`text-[10px] mt-1 block ${sender === 'me' ? 'text-blue-100' : 'text-zinc-500'}`}>
                    {time}
                </span>
            </div>
        </div>
    );
}

export default ChatMessage;
