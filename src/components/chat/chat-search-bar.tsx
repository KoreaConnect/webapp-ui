'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useAuthStore } from '@/store/use-auth-store';
import { useChatPanelStore } from '@/store/use-chat-panel-store';
import { mapRawMessageToMessage, useCurrentMessages } from '@/store/use-current-messages';
import { useToastStore } from '@/store/use-toast-store';
import { type Message } from '@/types/chat.type';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';

import { Loader } from '@/components/ui/loader';

import { conversationService } from '@/services';

import { applyMessageHighlight } from '@/utils';

interface ChatSearchBarProps {
    conversationId: string;
}

export default function ChatSearchBar({ conversationId }: ChatSearchBarProps) {
    const { closeSearch, isSearching, setIsSearching } = useChatPanelStore();
    const { show } = useToastStore();
    const { messages, fetchMessageContext } = useCurrentMessages();
    const currentUser = useAuthStore((state) => state.user);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Message[]>([]);
    const [searchTotal, setSearchTotal] = useState(0);
    const [currentResultOffset, setCurrentResultOffset] = useState(-1);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const jumpToMessage = useCallback(
        async (messageId: string) => {
            if (!conversationId) return;

            // Check if message already exists in current list
            const messageExists = messages.some((m) => m.id.toString() === messageId.toString());

            if (!messageExists) {
                await fetchMessageContext(conversationId, messageId);
            }

            // Scroll to the message and highlight after a short delay
            setTimeout(() => {
                applyMessageHighlight(messageId);
            }, 500);
        },
        [conversationId, fetchMessageContext, messages],
    );

    const fetchSearchResult = useCallback(
        async (query: string, offset: number) => {
            if (!conversationId || !query.trim()) return;

            setIsSearching(true);
            try {
                const response = await conversationService.searchMessages(conversationId, query, 1, offset);
                const currentUserId = currentUser?.id;
                const mappedResults = response.data.map((msg) => mapRawMessageToMessage(msg, currentUserId));

                setSearchResults(mappedResults);
                setSearchTotal(response.pagination.total || 0);
                setCurrentResultOffset(response.pagination.offset ?? offset);

                if (mappedResults.length > 0) {
                    jumpToMessage(mappedResults[0].id);
                }
            } catch (error) {
                console.error('Search failed:', error);
                show({ title: 'Search Error', message: 'Failed to search messages', type: 'error' });
            } finally {
                setIsSearching(false);
            }
        },
        [conversationId, currentUser?.id, jumpToMessage, show, setIsSearching],
    );

    const handleSearch = useCallback(
        async (query: string) => {
            if (!query.trim()) {
                setSearchResults([]);
                setSearchTotal(0);
                setCurrentResultOffset(-1);
                return;
            }
            await fetchSearchResult(query, 0);
        },
        [fetchSearchResult],
    );

    useEffect(() => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        if (searchQuery.trim()) {
            searchTimeoutRef.current = setTimeout(() => {
                handleSearch(searchQuery);
            }, 500);
        } else {
            setSearchResults([]);
            setSearchTotal(0);
            setCurrentResultOffset(-1);
        }

        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        };
    }, [searchQuery, handleSearch]);

    const handleNextResult = () => {
        if (currentResultOffset + 1 < searchTotal) {
            fetchSearchResult(searchQuery, currentResultOffset + 1);
        }
    };

    const handlePrevResult = () => {
        if (currentResultOffset > 0) {
            fetchSearchResult(searchQuery, currentResultOffset - 1);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setSearchTotal(0);
        setCurrentResultOffset(-1);
    };

    return (
        <div className="px-4 py-3 bg-background border-b border-border relative z-20">
            <div className="relative flex items-center gap-2">
                <div className="relative flex-1 flex items-center">
                    <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search in conversation..."
                        className="w-full bg-accent/50 rounded-lg py-2 pl-10 pr-24 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                    <div className="absolute right-2 flex items-center gap-1">
                        {searchTotal > 0 ? (
                            <>
                                <span className="text-[10px] font-medium text-muted-foreground px-1">
                                    {currentResultOffset + 1}/{searchTotal}
                                </span>
                                <div className="flex items-center bg-background/50 rounded-md border border-border/50">
                                    <button
                                        onClick={handleNextResult}
                                        className="p-1.5 hover:bg-accent rounded-l-md transition cursor-pointer"
                                        title="Older result"
                                    >
                                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                    <div className="w-[1px] h-4 bg-border/50" />
                                    <button
                                        onClick={handlePrevResult}
                                        className="p-1.5 hover:bg-accent rounded-r-md transition cursor-pointer"
                                        title="Newer result"
                                    >
                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                </div>
                            </>
                        ) : searchQuery && !isSearching ? (
                            <span className="text-[10px] font-medium text-destructive px-2">No results</span>
                        ) : null}
                        {searchQuery && (
                            <button
                                onClick={handleClearSearch}
                                className="p-1 rounded-md hover:bg-accent transition cursor-pointer"
                            >
                                <X className="h-3 w-3 text-muted-foreground" />
                            </button>
                        )}
                    </div>
                </div>
                <button
                    onClick={closeSearch}
                    className="p-1.5 rounded-md hover:bg-accent transition cursor-pointer shrink-0"
                >
                    <X className="h-4 w-4 text-muted-foreground" />
                </button>
            </div>
        </div>
    );
}
