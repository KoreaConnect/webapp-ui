'use client';

import { Plus } from 'lucide-react';

import { CreateRideModal } from '@/components/airport-ride/create-ride-modal';
import { RideFilter } from '@/components/airport-ride/ride-filter';
import { RideList } from '@/components/airport-ride/ride-list';
import { Button } from '@/components/ui/button';

import { useAirportRides } from '@/hooks/use-airport-rides';

export default function TaxiSharePage() {
    const {
        tripDirection,
        setTripDirection,
        airport,
        setAirport,
        currentAddress,
        setCurrentAddress,
        date,
        setDate,
        time,
        setTime,
        maxDistance,
        setMaxDistance,
        timeTolerance,
        setTimeTolerance,
        rides,
        isLoading,
        fetchRides,
        handleAddressComplete,
        clearAddress,
        resetFilters,
    } = useAirportRides();

    return (
        <div className="p-4 md:p-8">
            <div className="mx-auto w-full space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                            Airport Ride Sharing
                        </h1>
                        <p className="text-sm text-zinc-500 mt-1">Find people to share a ride with and save costs.</p>
                    </div>
                    <CreateRideModal
                        onSuccess={fetchRides}
                        trigger={
                            <Button className="w-full md:w-auto shadow-lg shadow-primary/20">
                                <Plus className="h-4 w-4 mr-2" />
                                New Ride
                            </Button>
                        }
                    />
                </div>

                {/* Filters */}
                <RideFilter
                    tripDirection={tripDirection}
                    setTripDirection={setTripDirection}
                    airport={airport}
                    setAirport={setAirport}
                    currentAddress={currentAddress}
                    onAddressComplete={handleAddressComplete}
                    clearAddress={clearAddress}
                    date={date}
                    setDate={setDate}
                    time={time}
                    setTime={setTime}
                    maxDistance={maxDistance}
                    setMaxDistance={setMaxDistance}
                    timeTolerance={timeTolerance}
                    setTimeTolerance={setTimeTolerance}
                    onSearch={fetchRides}
                    onReset={resetFilters}
                    isLoading={isLoading}
                />

                {/* List */}
                <RideList rides={rides} isLoading={isLoading} />
            </div>
        </div>
    );
}
