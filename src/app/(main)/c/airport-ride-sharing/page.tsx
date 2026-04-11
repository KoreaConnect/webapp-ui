'use client';

import { useCallback, useEffect, useState } from 'react';

import { useToastStore } from '@/store/use-toast-store';
import { AirportRide, SearchAirportRideParams } from '@/types/airport-ride.type';
import { Calendar, Clock, Filter, Loader2, MapPin, Navigation, Plus, RotateCcw, Search, Users, X } from 'lucide-react';
import Image from 'next/image';

import { CreateRideModal } from '@/components/airport-ride/create-ride-modal';
import { DaumAddressData, KakaoAddressSearch } from '@/components/kakao-address-search';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

import { airportRideService } from '@/services/airport-ride.service';
import { searchLocation } from '@/services/kakao.service';

import { cn } from '@/utils/cn';

export default function TaxiSharePage() {
    const { show } = useToastStore();
    const [tripDirection, setTripDirection] = useState<'to_airport' | 'from_airport'>('to_airport');
    const [airport, setAirport] = useState('icn');
    const [currentAddress, setCurrentAddress] = useState('');
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [maxDistance, setMaxDistance] = useState(5);
    const [timeTolerance, setTimeTolerance] = useState(30);

    const [rides, setRides] = useState<AirportRide[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchRides = useCallback(async () => {
        setIsLoading(true);
        try {
            const params: SearchAirportRideParams = {
                airport: airport.toUpperCase(),
                direction: tripDirection,
            };

            if (coords) {
                params.latitude = coords.lat;
                params.longitude = coords.lng;
                params.radius_meters = maxDistance * 1000;
            }

            const response = await airportRideService.searchRides(params);
            if (response.success) {
                setRides(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch rides:', error);
            show({
                title: 'Error',
                message: 'Failed to fetch rides. Please try again.',
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    }, [airport, tripDirection, coords, maxDistance, show]);

    useEffect(() => {
        fetchRides();
    }, [fetchRides]);

    const handleAddressComplete = async (data: DaumAddressData) => {
        console.log('Selected Address Data:', data);
        setCurrentAddress(data.fullAddress);

        if (data.x && data.y) {
            setCoords({ lat: Number(data.y), lng: Number(data.x) });
        } else {
            try {
                const searchRes = await searchLocation(data.address);
                if (searchRes.documents && searchRes.documents.length > 0) {
                    const first = searchRes.documents[0];
                    setCoords({ lat: Number(first.y), lng: Number(first.x) });
                }
            } catch (error) {
                console.error('Failed to get coordinates:', error);
            }
        }
    };

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
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 shadow-sm border border-border space-y-8">
                    {/* Direction Toggle */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Trip Direction</h3>
                            <p className="text-xs text-zinc-500">Are you going to or coming from the airport?</p>
                        </div>
                        <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl w-full sm:w-auto">
                            <button
                                onClick={() => setTripDirection('to_airport')}
                                className={cn(
                                    'flex-1 sm:flex-none flex items-center justify-center px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all',
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
                                    'flex-1 sm:flex-none flex items-center justify-center px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all',
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
                        {tripDirection === 'to_airport' ? (
                            <>
                                {/* Address Search (Departure) */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                                        Departure Address
                                    </label>
                                    <KakaoAddressSearch
                                        onComplete={handleAddressComplete}
                                        trigger={
                                            <div className="relative group cursor-pointer">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-hover:text-primary transition-colors z-10" />
                                                <div className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-2xl pl-10 pr-10 text-sm border border-transparent group-hover:border-primary/50 transition-all flex items-center text-zinc-900 dark:text-zinc-50 font-medium overflow-hidden">
                                                    <div className="w-full min-w-0">
                                                        {currentAddress ? (
                                                            <p className="truncate w-full">{currentAddress}</p>
                                                        ) : (
                                                            <p className="text-zinc-400 truncate w-full">
                                                                Search address or use GPS...
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                {currentAddress && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCurrentAddress('');
                                                            setCoords(null);
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

                                {/* Airport Select (Arrival) */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                                        Arrival Airport
                                    </label>
                                    <div className="relative">
                                        <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 z-10 pointer-events-none" />
                                        <Select value={airport} onValueChange={setAirport}>
                                            <SelectTrigger className="pl-10 h-11">
                                                <SelectValue placeholder="Which airport?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="icn">Incheon (ICN)</SelectItem>
                                                <SelectItem value="gmp">Gimpo (GMP)</SelectItem>
                                                <SelectItem value="nrt">Narita (NRT)</SelectItem>
                                                <SelectItem value="hnd">Haneda (HND)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Airport Select (Departure) */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                                        Departure Airport
                                    </label>
                                    <div className="relative">
                                        <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 z-10 pointer-events-none" />
                                        <Select value={airport} onValueChange={setAirport}>
                                            <SelectTrigger className="pl-10 h-11">
                                                <SelectValue placeholder="Which airport?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="icn">Incheon (ICN)</SelectItem>
                                                <SelectItem value="gmp">Gimpo (GMP)</SelectItem>
                                                <SelectItem value="nrt">Narita (NRT)</SelectItem>
                                                <SelectItem value="hnd">Haneda (HND)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Address Search (Destination) */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                                        Destination Address
                                    </label>
                                    <KakaoAddressSearch
                                        onComplete={handleAddressComplete}
                                        trigger={
                                            <div className="relative group cursor-pointer">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-hover:text-primary transition-colors z-10" />
                                                <div className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-2xl pl-10 pr-10 text-sm border border-transparent group-hover:border-primary/50 transition-all flex items-center text-zinc-900 dark:text-zinc-50 font-medium overflow-hidden">
                                                    <div className="w-full min-w-0">
                                                        {currentAddress ? (
                                                            <p className="truncate w-full">{currentAddress}</p>
                                                        ) : (
                                                            <p className="text-zinc-400 truncate w-full">
                                                                Search address or use GPS...
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                {currentAddress && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCurrentAddress('');
                                                            setCoords(null);
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
                            </>
                        )}

                        {/* Date */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                                Date
                            </label>
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
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                                Time
                            </label>
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

                        <div className="shrink-0 w-full lg:w-auto">
                            <Button
                                variant="default"
                                className="h-12 px-10 shadow-lg shadow-primary/20 w-full lg:w-auto text-base font-bold rounded-2xl"
                                onClick={fetchRides}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                ) : (
                                    <Search className="h-5 w-5 mr-2" />
                                )}
                                Search Ride
                            </Button>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Available Rides</h2>
                        <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-foreground">
                            <Filter className="h-4 w-4 mr-2" />
                            Sort by: Latest
                        </Button>
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
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-1">
                                    No rides found
                                </h3>
                                <p className="text-sm text-zinc-500 max-w-[280px] text-center">
                                    Try adjusting your search filters or be the first to create a ride!
                                </p>
                            </div>
                        ) : (
                            rides.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-border hover:border-primary/30 transition-all cursor-pointer group hover:shadow-md"
                                >
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* User Info */}
                                        <div className="flex items-center md:flex-col md:items-start md:w-32 gap-3 shrink-0">
                                            <div className="relative">
                                                <Image
                                                    src={
                                                        post.user.picture ||
                                                        `https://i.pravatar.cc/150?u=${post.user.username}`
                                                    }
                                                    alt={post.user.name}
                                                    width={56}
                                                    height={56}
                                                    className="h-12 w-12 md:h-14 md:w-14 rounded-2xl object-cover border-2 border-white dark:border-zinc-800 shadow-sm"
                                                />
                                                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white dark:border-zinc-800 rounded-full" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm md:text-base group-hover:text-primary transition-colors">
                                                    {post.user.name}
                                                </span>
                                                <span className="text-xs text-zinc-500 font-medium">
                                                    @{post.user.username}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Ride Details */}
                                        <div className="flex-1 flex flex-col gap-5">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col items-center gap-1.5 shrink-0 py-1">
                                                    <div className="h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/10" />
                                                    <div className="w-0.5 h-8 bg-dashed bg-zinc-200 dark:bg-zinc-800" />
                                                    <div className="h-2.5 w-2.5 rounded-full border-2 border-primary bg-white dark:bg-zinc-900" />
                                                </div>
                                                <div className="flex flex-col justify-between h-16">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-zinc-400 uppercase tracking-wider font-bold">
                                                            {post.direction === 'to_airport'
                                                                ? 'Departure'
                                                                : 'Airport Pickup'}
                                                        </span>
                                                        <span className="font-bold text-lg leading-tight truncate max-w-[400px]">
                                                            {post.direction === 'to_airport'
                                                                ? post.from_address
                                                                : post.airport.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-zinc-400 uppercase tracking-wider font-bold">
                                                            {post.direction === 'to_airport'
                                                                ? 'Arrival'
                                                                : 'Destination'}
                                                        </span>
                                                        <span className="font-bold text-lg leading-tight truncate max-w-[400px]">
                                                            {post.direction === 'to_airport'
                                                                ? post.airport.toUpperCase()
                                                                : post.from_address}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-6 text-sm">
                                                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl">
                                                    <Calendar className="h-4 w-4 text-primary" />
                                                    <span className="font-medium">
                                                        {new Date(post.departure_time).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl">
                                                    <Clock className="h-4 w-4 text-primary" />
                                                    <span className="font-medium">
                                                        {new Date(post.departure_time).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl">
                                                    <Users className="h-4 w-4 text-primary" />
                                                    <span className="font-medium">{post.status.toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-6 shrink-0 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                                            <div className="text-left md:text-right">
                                                <div className="text-3xl font-black text-primary tracking-tight">
                                                    OPEN
                                                </div>
                                                <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                                                    Status
                                                </span>
                                            </div>
                                            <Button
                                                variant="default"
                                                className="rounded-2xl px-6 group-hover:scale-105 transition-transform"
                                                onClick={() => {
                                                    show({
                                                        title: 'Contact Details',
                                                        message: post.description || 'No additional details provided.',
                                                        type: 'success',
                                                    });
                                                }}
                                            >
                                                Contact
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
