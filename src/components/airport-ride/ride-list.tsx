'use client';

import { AirportRide } from '@/types/airport-ride.type';
import { Filter, Loader2, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { RideCard } from './ride-card';

interface RideListProps {
    rides: AirportRide[];
    isLoading: boolean;
}

export function RideList({ rides, isLoading }: RideListProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Available Rides</h2>
            </div>

            <div className="grid gap-4">
                {isLoading && rides.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-border">
                        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                        <p className="text-zinc-500 font-medium">Searching for best rides...</p>
                    </div>
                ) : rides.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-border">
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-full mb-4">
                            <Search className="h-8 w-8 text-zinc-300" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-1">No rides found</h3>
                        <p className="text-sm text-zinc-500 max-w-[280px] text-center">
                            Try adjusting your search filters or be the first to create a ride!
                        </p>
                    </div>
                ) : (
                    rides.map((ride) => <RideCard key={ride.id} ride={ride} />)
                )}
            </div>
        </div>
    );
}
