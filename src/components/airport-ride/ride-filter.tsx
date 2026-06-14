'use client';

import { useEffect, useRef } from 'react';

import { AIRPORTS } from '@/constants/airport';
import { useToastStore } from '@/store/use-toast-store';
import { AirportRideDirection } from '@/types/airport-ride.type';
import { Bell, Calendar, Clock, Loader2, MapPin, Navigation, RotateCcw, Search, X } from 'lucide-react';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

import { DaumAddressData, KakaoAddressSearch } from '@/components/kakao-address-search';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

import { cn } from '@/utils/cn';

interface RideFilterProps {
    tripDirection: AirportRideDirection;
    setTripDirection: (dir: AirportRideDirection) => void;
    airport: string;
    setAirport: (val: string) => void;
    currentAddress: string;
    onAddressComplete: (data: DaumAddressData) => void;
    clearAddress: () => void;
    date: string;
    setDate: (val: string) => void;
    time: string;
    setTime: (val: string) => void;
    maxDistance: number;
    setMaxDistance: (val: number) => void;
    timeTolerance: number;
    setTimeTolerance: (val: number) => void;
    onSearch: () => void;
    onReset: () => void;
    onSetAlarm?: () => void;
    isLoading: boolean;
    isAlarmLoading?: boolean;
    hasSearched?: boolean;
}

export function RideFilter({
    tripDirection,
    setTripDirection,
    airport,
    setAirport,
    currentAddress,
    onAddressComplete,
    clearAddress,
    date,
    setDate,
    time,
    setTime,
    maxDistance,
    setMaxDistance,
    timeTolerance,
    setTimeTolerance,
    onSearch,
    onReset,
    onSetAlarm,
    isLoading,
    isAlarmLoading,
    hasSearched,
}: RideFilterProps) {
    const { show } = useToastStore();

    const allFieldsFilled = !!(date && currentAddress && airport);

    const validateInputs = (actionName: string) => {
        if (!date) {
            show({
                title: 'Validation Error',
                message: `Please select a date for your trip to ${actionName}.`,
                type: 'error',
            });
            return false;
        }

        if (!currentAddress) {
            show({
                title: 'Validation Error',
                message:
                    tripDirection === 'to_airport'
                        ? `Please enter a departure address to ${actionName}.`
                        : `Please enter a destination address to ${actionName}.`,
                type: 'error',
            });
            return false;
        }

        if (!airport) {
            show({
                title: 'Validation Error',
                message: `Please select an airport to ${actionName}.`,
                type: 'error',
            });
            return false;
        }

        return true;
    };

    const handleSearch = () => {
        if (validateInputs('search')) {
            onSearch();
        }
    };

    const handleSetAlarm = () => {
        if (validateInputs('set an alarm') && onSetAlarm) {
            onSetAlarm();
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 shadow-sm border border-border space-y-8">
            {/* Direction Toggle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
                <div className="space-y-1">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Trip Direction</h3>
                    <p className="text-xs text-zinc-500">Are you going to or coming from the airport?</p>
                </div>
                <div className="flex flex-wrap p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl w-full sm:w-auto">
                    <button
                        onClick={() => setTripDirection('to_airport')}
                        className={cn(
                            'flex-1 min-w-40 flex items-center justify-center px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all whitespace-normal wrap-break-word',
                            tripDirection === 'to_airport'
                                ? 'bg-white dark:bg-zinc-700 text-primary shadow-sm'
                                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300',
                        )}
                    >
                        <Navigation className="h-3.5 w-3.5 mr-2" />
                        To Airport
                    </button>
                    <button
                        onClick={() => setTripDirection('from_airport')}
                        className={cn(
                            'flex-1 min-w-40 flex items-center justify-center px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all whitespace-normal wrap-break-word',
                            tripDirection === 'from_airport'
                                ? 'bg-white dark:bg-zinc-700 text-primary shadow-sm'
                                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300',
                        )}
                    >
                        <RotateCcw className="h-3.5 w-3.5 mr-2" />
                        From Airport
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {/* Location Inputs (Directional) */}
                <LocationInputs
                    tripDirection={tripDirection}
                    airport={airport}
                    setAirport={setAirport}
                    currentAddress={currentAddress}
                    onAddressComplete={onAddressComplete}
                    clearAddress={clearAddress}
                />

                {/* Date */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">Date</label>
                    <div className="relative group">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors z-10" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-2xl pl-10 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Time */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">Time</label>
                    <div className="relative group">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors z-10" />
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-2xl pl-10 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 w-full">
                    <Slider
                        label="Radius (Distance)"
                        min={1}
                        max={20}
                        step={1}
                        value={maxDistance}
                        onValueChange={setMaxDistance}
                        valueLabel={`${maxDistance} km`}
                    />
                    <Slider
                        label="Time Tolerance"
                        min={5}
                        max={120}
                        step={5}
                        value={timeTolerance}
                        onValueChange={setTimeTolerance}
                        valueLabel={`± ${timeTolerance} min`}
                    />
                </div>

                <div className="shrink-0 w-full lg:w-auto flex flex-col md:flex-row gap-3">
                    <Button
                        variant="default"
                        className="h-12 px-10 shadow-lg shadow-primary/20 w-full lg:w-auto text-base font-bold rounded-2xl"
                        onClick={handleSearch}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        ) : (
                            <Search className="h-5 w-5 mr-2" />
                        )}
                        Search Ride
                    </Button>
                    {hasSearched && allFieldsFilled && (
                        <Button
                            variant="outline"
                            className="h-12 px-6 font-bold rounded-2xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 w-full md:w-auto"
                            onClick={handleSetAlarm}
                            disabled={isAlarmLoading}
                        >
                            {isAlarmLoading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Bell className="h-4 w-4 mr-2" />
                            )}
                            Set Alarm
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        className="h-12 px-6 font-bold rounded-2xl border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800 w-full md:w-auto text-zinc-500"
                        onClick={onReset}
                        disabled={isLoading}
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    );
}

function LocationInputs({
    tripDirection,
    airport,
    setAirport,
    currentAddress,
    onAddressComplete,
    clearAddress,
}: {
    tripDirection: AirportRideDirection;
    airport: string;
    setAirport: (val: string) => void;
    currentAddress: string;
    onAddressComplete: (data: DaumAddressData) => void;
    clearAddress: () => void;
}) {
    const isToAirport = tripDirection === 'to_airport';
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (tooltipRef.current && currentAddress) {
            const instance = tippy(tooltipRef.current, {
                content: currentAddress,
                placement: 'top',
                animation: 'fade',
            });
            return () => {
                instance.destroy();
            };
        }
    }, [currentAddress]);

    const addressSearch = (
        <div className="space-y-1.5">
            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1 whitespace-nowrap">
                {isToAirport ? 'Departure Address' : 'Destination Address'}
            </label>
            <KakaoAddressSearch
                onComplete={onAddressComplete}
                trigger={
                    <div ref={tooltipRef} className="relative group cursor-pointer">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-hover:text-primary transition-colors z-10" />
                        <div className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-2xl pl-10 pr-10 text-sm border border-transparent group-hover:border-primary/50 transition-all flex items-center text-zinc-900 dark:text-zinc-50 font-medium overflow-hidden">
                            <div className="w-full min-w-0">
                                {currentAddress ? (
                                    <p className="truncate w-full">{currentAddress}</p>
                                ) : (
                                    <p className="text-zinc-400 truncate w-full">Search address or use GPS...</p>
                                )}
                            </div>
                        </div>
                        {currentAddress && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearAddress();
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 z-20"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                }
            />
        </div>
    );

    const airportSelect = (
        <div className="space-y-1.5">
            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1 whitespace-nowrap">
                {isToAirport ? 'Arrival Airport' : 'Departure Airport'}
            </label>
            <div className="relative">
                <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 z-10 pointer-events-none" />
                <Select value={airport} onValueChange={setAirport}>
                    <SelectTrigger className="pl-10 h-11">
                        <SelectValue placeholder="Which airport?" />
                    </SelectTrigger>
                    <SelectContent>
                        {AIRPORTS.map((ap) => (
                            <SelectItem key={ap.value} value={ap.value}>
                                {ap.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );

    return (
        <>
            {isToAirport ? (
                <>
                    {addressSearch}
                    {airportSelect}
                </>
            ) : (
                <>
                    {airportSelect}
                    {addressSearch}
                </>
            )}
        </>
    );
}
