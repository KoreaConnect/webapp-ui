import Avatar from '../ui/avatar';

type ChatHeaderProps = {
    title: string;
    thumbnailUrl?: string;
    onlineUserCount?: number;
};
function ChatHeader({ title, thumbnailUrl, onlineUserCount }: ChatHeaderProps) {
    return (
        <div className="p-4 border-b border-border flex items-center gap-3">
            <Avatar className="h-10 w-10" src={thumbnailUrl} backgroundColor="cyan" />
            <div>
                <h2 className="font-bold">{title}</h2>
                <p className="text-xs text-green-500 font-medium"> {onlineUserCount} Online</p>
            </div>
        </div>
    );
}

export default ChatHeader;
