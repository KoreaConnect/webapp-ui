'use client';

import { CarryHelp } from '@/types/carry-help.type';
import { Search } from 'lucide-react';

import { Loader } from '@/components/ui/loader';

import { CarryHelpCard } from './carry-help-card';

interface CarryHelpListProps {
    deliveries: CarryHelp[];
    isLoading: boolean;
}

export function CarryHelpList({ deliveries, isLoading }: CarryHelpListProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Opportunities</h2>
            </div>

            <div className="grid gap-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-border">
                        <Loader className="h-8 w-8 text-primary mb-4" />
                        <p className="text-zinc-500">Searching for opportunities...</p>
                    </div>
                ) : deliveries.length > 0 ? (
                    deliveries.map((item) => <CarryHelpCard key={item.id} item={item} />)
                ) : (
                    <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-border">
                        <Search className="h-10 w-10 text-zinc-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No results found</h3>
                        <p className="text-zinc-500">Try adjusting your filters to find more opportunities.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
