'use client';

import { useChatPanelStore } from '@/store/use-chat-panel-store';
import { useCommunityConversationStore } from '@/store/use-community-conversation-store';
import { BellRing, FileText, Image, Info, LogOut, Search, Users } from 'lucide-react';

import { cn } from '@/utils/cn';

import Avatar from '../ui/avatar';
import { Button } from '../ui/button';
import CloseButton from '../ui/close-button';
import { Collapsible } from '../ui/collapsible';
import { ScrollableView } from '../ui/scrollable-view';
import { FileList } from './file-list';
import { MediaList } from './media-list';
import { MemberList } from './member-list';

export default function ChatPanel() {
    const { isOpen, close, toggleSearch } = useChatPanelStore();
    const {
        conversation,
        members,
        fetchMembers,
        media,
        files,
        fetchAttachments,
        isMediaLoading,
        isFilesLoading,
        isMembersLoading,
    } = useCommunityConversationStore();

    if (!conversation) return null;

    const handleOpenMembers = () => {
        if (members.length === 0 && !isMembersLoading) {
            fetchMembers(conversation.id);
        }
    };

    const handleOpenMedia = () => {
        if (media.length === 0 && !isMediaLoading) {
            fetchAttachments(conversation.id, 'image');
        }
    };

    const handleOpenFiles = () => {
        if (files.length === 0 && !isFilesLoading) {
            fetchAttachments(conversation.id, 'file');
        }
    };

    return (
        <aside
            className={cn(
                'absolute h-full inset-y-0 right-0 z-(--chat-panel-z-index) w-full lg:w-80 bg-background transition-all duration-300 transform ',
                'lg:relative lg:inset-y-auto lg:z-0 lg:translate-x-0',
                isOpen ? 'translate-x-0' : 'translate-x-full lg:w-0 lg:opacity-0 pointer-events-none',
            )}
            aria-hidden={!isOpen}
            inert={!isOpen}
        >
            <div
                className={cn(
                    'flex flex-col h-full overflow-hidden w-full lg:w-80 lg:border-l border-border ',
                    !isOpen && 'lg:w-0',
                )}
            >
                {/* Header - Only Close Button */}
                <div className="flex items-center justify-end p-4">
                    <CloseButton onClick={close} />
                </div>

                <ScrollableView className="flex-1">
                    <div className="p-4 space-y-6">
                        {/* Group Profile */}
                        <div className="flex flex-col items-center text-center space-y-3 py-4">
                            <Avatar
                                className="h-24 w-24 text-3xl shadow-sm"
                                src={conversation.thumbnail_url}
                                backgroundColor="cyan"
                            />
                            <div>
                                <h3 className="font-bold text-xl">{conversation.title}</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Created by {conversation.createdBy} •{' '}
                                    {new Date(conversation.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-center gap-8">
                            <div className="flex flex-col items-center gap-2">
                                <Button variant="secondary" size="icon" className="shadow-sm" onClick={toggleSearch}>
                                    <Search className="h-4 w-4" />
                                </Button>
                                <span className="text-xs font-medium text-muted-foreground">Search</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Button variant="secondary" size="icon" className="shadow-sm">
                                    <BellRing className="h-4 w-4" />
                                </Button>
                                <span className="text-xs font-medium text-muted-foreground">Mute</span>
                            </div>
                        </div>

                        {/* Collapsible Sections */}
                        <div className="space-y-1">
                            {conversation.description && (
                                <Collapsible title="Description" icon={<Info className="h-4 w-4" />} defaultOpen>
                                    <p className="text-sm text-muted-foreground leading-relaxed px-1">
                                        {conversation.description}
                                    </p>
                                </Collapsible>
                            )}

                            <Collapsible
                                title="Members"
                                icon={<Users className="h-4 w-4" />}
                                badge={members.length || conversation.members_count}
                                onOpen={handleOpenMembers}
                            >
                                <MemberList />
                            </Collapsible>

                            <Collapsible
                                title="Media"
                                icon={<Image className="h-4 w-4" />}
                                onOpen={handleOpenMedia}
                                badge={media.length > 0 ? media.length : undefined}
                            >
                                <MediaList />
                            </Collapsible>

                            <Collapsible
                                title="Files"
                                icon={<FileText className="h-4 w-4" />}
                                onOpen={handleOpenFiles}
                                badge={files.length > 0 ? files.length : undefined}
                            >
                                <FileList />
                            </Collapsible>

                            {/* Leave Group Button */}
                            <div className="pt-6">
                                <button className="flex items-center justify-center gap-2.5 w-full py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all font-semibold text-sm group cursor-pointer shadow-sm">
                                    <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                    <span>Leave Group</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </ScrollableView>
            </div>
        </aside>
    );
}
