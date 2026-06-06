'use client';

import { Calendar, Locate, MapPin, Plane, RotateCcw, Search } from 'lucide-react';

import { KakaoAddressSearch } from '@/components/kakao-address-search';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CarryHelpFilterProps {
    routeFilter: string;
    setRouteFilter: (val: string) => void;
    from: string;
    setFrom: (val: string) => void;
    to: string;
    setTo: (val: string) => void;
    date: string;
    setDate: (val: string) => void;
    onSearch: () => void;
    onReset: () => void;
    isLoading: boolean;
}

export function CarryHelpFilter({
    routeFilter,
    setRouteFilter,
    from,
    setFrom,
    to,
    setTo,
    date,
    setDate,
    onSearch,
    onReset,
    isLoading,
}: CarryHelpFilterProps) {
    const getRouteLabel = (value: string) => {
        switch (value) {
            case 'kr-vn':
                return 'Korea to Vietnam';
            case 'vn-kr':
                return 'Vietnam to Korea';
            default:
                return 'All Routes';
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-border">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="relative group">
                    <Select value={routeFilter} onValueChange={setRouteFilter}>
                        <SelectTrigger
                            className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border-transparent focus:ring-primary/20 focus:border-primary/50 transition-all"
                            title={getRouteLabel(routeFilter)}
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <Plane className="h-4 w-4 shrink-0 text-zinc-400 group-focus-within:text-primary transition-colors" />
                                <div className="truncate">
                                    <SelectValue placeholder="Route" />
                                </div>
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Routes</SelectItem>
                            <SelectItem value="kr-vn">Korea to Vietnam</SelectItem>
                            <SelectItem value="vn-kr">Vietnam to Korea</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="relative group">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="From (Origin)"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        title={from || 'From (Origin)'}
                        className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-2xl pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all truncate"
                    />
                    <KakaoAddressSearch
                        onComplete={(data) => {
                            setFrom(data.fullAddress);
                        }}
                        trigger={
                            <button
                                title="Search Korea Address"
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-primary transition-all"
                            >
                                <Locate className="h-3.5 w-3.5" />
                            </button>
                        }
                    />
                </div>
                <div className="relative group">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="To (Destination)"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        title={to || 'To (Destination)'}
                        className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-2xl pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all truncate"
                    />
                    <KakaoAddressSearch
                        onComplete={(data) => setTo(data.fullAddress)}
                        trigger={
                            <button
                                title="Search Korea Address"
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-primary transition-all"
                            >
                                <Locate className="h-3.5 w-3.5" />
                            </button>
                        }
                    />
                </div>
                <div className="relative group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        title={date || 'Select Date'}
                        className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-2xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all"
                    />
                </div>
                <div className="flex gap-2 col-span-1 md:col-span-2">
                    <Button
                        variant="default"
                        className="flex-1 h-11 rounded-2xl"
                        onClick={onSearch}
                        disabled={isLoading}
                    >
                        <Search className="h-4 w-4 mr-2" />
                        Search
                    </Button>
                    <Button
                        variant="outline"
                        className="h-11 w-11 shrink-0 rounded-2xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        onClick={onReset}
                        disabled={isLoading}
                        title="Reset filters"
                    >
                        <RotateCcw className="h-4 w-4 text-zinc-500" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
