'use client';

import { ReactNode, useState } from 'react';

import { AIRPORTS } from '@/constants/airport';
import { Calendar, Clock, History, MapPin, Navigation, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DialogDescription, DialogTitle, DialogWrapper } from '@/components/ui/dialog';

import { SearchHistoryItem, useSearchHistory } from '@/hooks/use-search-history';

import { cn } from '@/utils/cn';

import CloseButton from '../ui/close-button';

interface SearchHistoryModalProps {
    onSelect: (item: SearchHistoryItem) => void;
    trigger?: ReactNode;
}

export function SearchHistoryModal({ onSelect, trigger }: SearchHistoryModalProps) {
    const [open, setOpen] = useState(false);
    const { history, removeHistory, clearHistory } = useSearchHistory();

    const getAirportLabel = (value: string) => {
        return AIRPORTS.find((a) => a.value === value)?.label || value;
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'Any date';
        return new Date(dateStr).toLocaleDateString();
    };

    const handleSelect = (item: SearchHistoryItem) => {
        onSelect(item);
        setOpen(false);
    };

    return (
        <DialogWrapper open={open} onOpenChange={setOpen} trigger={trigger}>
            <div className="rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200 w-full w-full">
                <DialogTitle className="sr-only">Search History</DialogTitle>
                <DialogDescription className="sr-only">View and reuse your recent searches</DialogDescription>

                <div className="flex items-center justify-between p-6 pb-2">
                    <div className="flex items-center gap-2">
                        <History className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Search History</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {history.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearHistory}
                                className="text-zinc-500 hover:text-red-500 text-xs font-bold"
                            >
                                Clear All
                            </Button>
                        )}
                        <CloseButton onClick={() => setOpen(false)} />
                    </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-6 pt-4 space-y-4">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                <History className="h-6 w-6 text-zinc-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-zinc-900 dark:text-zinc-50">No history yet</p>
                                <p className="text-sm text-zinc-500">Your recent searches will appear here.</p>
                            </div>
                        </div>
                    ) : (
                        history.map((item) => (
                            <div
                                key={item.id}
                                className="group relative bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl p-4 transition-all cursor-pointer border border-transparent hover:border-primary/20"
                                onClick={() => handleSelect(item)}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-3 flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={cn(
                                                    'px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider',
                                                    item.tripDirection === 'to_airport'
                                                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                                        : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
                                                )}
                                            >
                                                {item.tripDirection === 'to_airport' ? 'To Airport' : 'From Airport'}
                                            </span>
                                            <span className="text-[10px] font-bold text-zinc-400">
                                                {new Date(item.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                                <Navigation className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                                                <span className="truncate">{getAirportLabel(item.airport)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-zinc-500">
                                                <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                                                <span className="truncate">{item.currentAddress}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-zinc-400 font-bold">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(item.date)}
                                            </div>
                                            {item.time && (
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-3 w-3" />
                                                    {item.time}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeHistory(item.id);
                                        }}
                                        className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-zinc-400 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </DialogWrapper>
    );
}
