'use client';

import { useState } from 'react';

import { AIRPORTS } from '@/constants/airport';
import { useToastStore } from '@/store/use-toast-store';
import { AirportRideDirection } from '@/types/airport-ride.type';
import { Close } from '@radix-ui/react-dialog';
import { Calendar, Clock, Loader2, MapPin, Navigation, Phone, X } from 'lucide-react';

import { DaumAddressData, KakaoAddressSearch } from '@/components/kakao-address-search';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogTitle, DialogWrapper } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { airportRideService } from '@/services/airport-ride.service';
import { searchLocation } from '@/services/kakao.service';

import { cn } from '@/utils/cn';

import CloseButton from '../ui/close-button';

interface CreateRideModalProps {
    trigger: React.ReactNode;
    onSuccess?: () => void;
}

export function CreateRideModal({ trigger, onSuccess }: CreateRideModalProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { show } = useToastStore();

    const [direction, setDirection] = useState<AirportRideDirection>('to_airport');
    const [airport, setAirport] = useState('icn');
    const [address, setAddress] = useState('');
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [flexMinutes, setFlexMinutes] = useState('30');
    const [description, setDescription] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleAddressComplete = async (data: DaumAddressData) => {
        setAddress(data.fullAddress);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!coords || !address || !date || !time) {
            show({
                title: 'Validation Error',
                message: 'Please fill in all required fields.',
                type: 'error',
            });
            return;
        }

        setIsLoading(true);
        try {
            const departureTime = new Date(`${date}T${time}`).toISOString();
            const airportLabel = AIRPORTS.find((ap) => ap.value === airport)?.label || airport.toUpperCase();
            const directionLabel = direction === 'to_airport' ? 'To Airport' : 'From Airport';
            const rideName =
                direction === 'to_airport'
                    ? `[${directionLabel}] ${address} → ${airportLabel}`
                    : `[${directionLabel}] ${airportLabel} → ${address}`;

            const response = await airportRideService.createRide({
                name: rideName,
                airport: airport.toUpperCase(),
                direction,
                from_address: address,
                latitude: coords.lat,
                longitude: coords.lng,
                departure_time: departureTime,
                time_flex_minutes: Number(flexMinutes),
                description,
                contact: phoneNumber ? 'both' : 'in_app',
                phone_number: phoneNumber,
            });

            if (response.success) {
                show({
                    title: 'Success!',
                    message: 'Your ride post has been created.',
                    type: 'success',
                });
                setOpen(false);
                onSuccess?.();
            }
        } catch (error) {
            console.error('Failed to create ride:', error);
            show({
                title: 'Error',
                message: 'Failed to create ride. Please try again.',
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DialogWrapper open={open} onOpenChange={setOpen} trigger={trigger} closeOnClickOutside={false}>
            <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 w-full max-w-lg mx-auto">
                <DialogTitle className="sr-only">Create New Ride</DialogTitle>
                <DialogDescription className="sr-only">Fill in the details to share a ride</DialogDescription>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl">
                            <Navigation className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">New Ride Post</h3>
                            <p className="text-xs text-zinc-500 font-medium">Share your journey with others</p>
                        </div>
                    </div>
                    <CloseButton onClick={() => setOpen(false)} />
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                    {/* Direction Selection */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                            Trip Direction
                        </label>
                        <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setDirection('to_airport')}
                                className={cn(
                                    'flex-1 flex items-center justify-center px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all',
                                    direction === 'to_airport'
                                        ? 'bg-white dark:bg-zinc-700 text-primary shadow-sm'
                                        : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300',
                                )}
                            >
                                To Airport
                            </button>
                            <button
                                type="button"
                                onClick={() => setDirection('from_airport')}
                                className={cn(
                                    'flex-1 flex items-center justify-center px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all',
                                    direction === 'from_airport'
                                        ? 'bg-white dark:bg-zinc-700 text-primary shadow-sm'
                                        : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300',
                                )}
                            >
                                From Airport
                            </button>
                        </div>
                    </div>

                    {/* Address & Airport - Swapped based on direction */}
                    {direction === 'to_airport' ? (
                        <>
                            {/* Address (Departure) */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                                    Departure Address
                                </label>
                                <KakaoAddressSearch
                                    onComplete={handleAddressComplete}
                                    trigger={
                                        <div className="relative group cursor-pointer">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-hover:text-primary transition-colors z-10" />
                                            <div className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-xl pl-10 pr-4 text-sm border border-transparent group-hover:border-primary/50 transition-all flex items-center text-zinc-900 dark:text-zinc-50 font-medium overflow-hidden">
                                                <div className="w-full min-w-0">
                                                    {address ? (
                                                        <p className="truncate w-full">{address}</p>
                                                    ) : (
                                                        <p className="text-zinc-400 truncate w-full">
                                                            Search address...
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    }
                                />
                            </div>

                            {/* Airport (Arrival) */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                                    Arrival Airport
                                </label>
                                <Select value={airport} onValueChange={setAirport}>
                                    <SelectTrigger className="h-11 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <Navigation className="h-4 w-4 text-zinc-400" />
                                            <SelectValue />
                                        </div>
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
                        </>
                    ) : (
                        <>
                            {/* Airport (Departure) */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                                    Departure Airport
                                </label>
                                <Select value={airport} onValueChange={setAirport}>
                                    <SelectTrigger className="h-11 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <Navigation className="h-4 w-4 text-zinc-400" />
                                            <SelectValue />
                                        </div>
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

                            {/* Address (Destination) */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                                    Destination Address
                                </label>
                                <KakaoAddressSearch
                                    onComplete={handleAddressComplete}
                                    trigger={
                                        <div className="relative group cursor-pointer">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-hover:text-primary transition-colors z-10" />
                                            <div className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-xl pl-10 pr-4 text-sm border border-transparent group-hover:border-primary/50 transition-all flex items-center text-zinc-900 dark:text-zinc-50 font-medium overflow-hidden">
                                                <div className="w-full min-w-0">
                                                    {address ? (
                                                        <p className="truncate w-full">{address}</p>
                                                    ) : (
                                                        <p className="text-zinc-400 truncate w-full">
                                                            Search address...
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    }
                                />
                            </div>
                        </>
                    )}

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                                Date
                            </label>
                            <div className="relative group">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors z-10" />
                                <input
                                    type="date"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-xl pl-10 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all font-medium"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                                Time
                            </label>
                            <div className="relative group">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors z-10" />
                                <input
                                    type="time"
                                    required
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-xl pl-10 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Time Flex & Phone Number */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                                Time Flex (min)
                            </label>
                            <Select value={flexMinutes} onValueChange={setFlexMinutes}>
                                <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="15">± 15 min</SelectItem>
                                    <SelectItem value="30">± 30 min</SelectItem>
                                    <SelectItem value="60">± 60 min</SelectItem>
                                    <SelectItem value="120">± 120 min</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                                Phone Number (Optional)
                            </label>
                            <div className="relative group">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors z-10" />
                                <input
                                    type="tel"
                                    placeholder="010-0000-0000"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-xl pl-10 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            placeholder="e.g. I have 2 large suitcases. Looking for someone to split the taxi fare from Seoul Station."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all font-medium resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 rounded-2xl font-bold shadow-lg shadow-primary/20"
                    >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Post Ride Sharing'}
                    </Button>
                </form>
            </div>
        </DialogWrapper>
    );
}
