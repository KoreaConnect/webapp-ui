'use client';

import { Plus } from 'lucide-react';

import { CarryHelpFilter } from '@/components/carry-help/carry-help-filter';
import { CarryHelpList } from '@/components/carry-help/carry-help-list';
import { CreateCarryHelpModal } from '@/components/carry-help/create-carry-help-modal';
import { Button } from '@/components/ui/button';

import { useCarryHelp } from '@/hooks/use-carry-help';

export default function CarryHelpPage() {
    const {
        routeFilter,
        setRouteFilter,
        from,
        setFrom,
        to,
        setTo,
        date,
        setDate,
        deliveries,
        isLoading,
        fetchDeliveries,
        resetFilters,
    } = useCarryHelp();

    return (
        <div className="p-4 md:p-8">
            <div className="mx-auto w-full space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Carry Help</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Send items securely or earn by using your extra luggage space.
                        </p>
                    </div>
                    <CreateCarryHelpModal
                        onSuccess={fetchDeliveries}
                        trigger={
                            <Button className="w-full md:w-auto shadow-lg shadow-primary/20">
                                <Plus className="h-4 w-4 mr-2" />
                                New Request/Offer
                            </Button>
                        }
                    />
                </div>

                {/* Filters */}
                <CarryHelpFilter
                    routeFilter={routeFilter}
                    setRouteFilter={setRouteFilter}
                    from={from}
                    setFrom={setFrom}
                    to={to}
                    setTo={setTo}
                    date={date}
                    setDate={setDate}
                    onSearch={fetchDeliveries}
                    isLoading={isLoading}
                />

                {/* List */}
                <CarryHelpList deliveries={deliveries} isLoading={isLoading} onReset={resetFilters} />
            </div>
        </div>
    );
}
