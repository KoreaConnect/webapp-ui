import { Bell, MessageCircle } from 'lucide-react';

function NotificationDropdown() {
    return (
        <div className="w-80 max-w-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">Notifications</p>
                <button className="text-sm text-blue-600 hover:underline">Mark all as read</button>
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto">
                {/* Item */}
                <NotificationItem
                    unread
                    icon={<MessageCircle className="h-5 w-5 text-blue-500" />}
                    title="New message"
                    description="You received a new message from John Doe"
                    time="2m ago"
                />

                <NotificationItem
                    icon={<Bell className="h-5 w-5 text-zinc-400" />}
                    title="System update"
                    description="Your settings have been updated successfully"
                    time="1h ago"
                />

                <NotificationItem
                    icon={<Bell className="h-5 w-5 text-zinc-400" />}
                    title="Weekly summary"
                    description="You have 12 new activities this week"
                    time="Yesterday"
                />
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 text-center">
                <button className="text-sm text-blue-600 hover:underline">View all notifications</button>
            </div>
        </div>
    );
}

export default NotificationDropdown;

interface NotificationItemProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    time: string;
    unread?: boolean;
}

function NotificationItem({ icon, title, description, time, unread }: NotificationItemProps) {
    return (
        <div
            className={`
                flex gap-3 px-4 py-3 cursor-pointer
                transition-colors
                hover:bg-zinc-100 dark:hover:bg-zinc-800
                ${unread ? 'bg-blue-50 dark:bg-blue-950/30' : ''}
            `}
        >
            {/* Icon */}
            <div className="mt-1 shrink-0">{icon}</div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{title}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{description}</p>
                <p className="mt-1 text-xs text-zinc-500">{time}</p>
            </div>

            {/* Unread dot */}
            {unread && <span className="mt-2 h-2 w-2 rounded-full bg-blue-600" />}
        </div>
    );
}
