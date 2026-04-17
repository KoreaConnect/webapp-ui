'use client';

import { AirportRide } from '@/types/airport-ride.type';
import { Calendar, Clock, MessageSquare, Phone, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { SendPostMessageModal } from '../chat/send-post-message-modal';

interface RideCardProps {
    ride: AirportRide;
}

export function RideCard({ ride }: RideCardProps) {
    const router = useRouter();
    const departureDate = new Date(ride.departure_time);

    const handleCardClick = () => {
        router.push(`/c/airport-ride-sharing/${ride.id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-border hover:border-primary/30 transition-all cursor-pointer group hover:shadow-md"
        >
            <div className="flex flex-col md:flex-row gap-6">
                {/* User Info */}
                <div className="flex items-center md:flex-col md:items-start md:w-32 gap-3 shrink-0">
                    <div className="relative">
                        <img
                            src={ride.user.picture || `https://i.pravatar.cc/150?u=${ride.user.username}`}
                            alt={ride.user.name}
                            width={56}
                            height={56}
                            className="h-12 w-12 md:h-14 md:w-14 rounded-2xl object-cover border-2 border-white dark:border-zinc-800 shadow-sm"
                        />
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white dark:border-zinc-800 rounded-full" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm md:text-base group-hover:text-primary transition-colors">
                            {ride.user.name}
                        </span>
                        <span className="text-xs text-zinc-500 font-medium">@{ride.user.username}</span>
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
                        <div className="flex flex-col justify-between">
                            <div className="flex flex-col">
                                <span className="text-xs text-zinc-400 uppercase tracking-wider font-bold">
                                    {ride.direction === 'to_airport' ? 'Departure' : 'Airport Pickup'}
                                </span>
                                <span className="font-bold text-lg leading-tight">
                                    {ride.direction === 'to_airport' ? ride.from_address : ride.airport.toUpperCase()}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-zinc-400 uppercase tracking-wider font-bold">
                                    {ride.direction === 'to_airport' ? 'Arrival' : 'Destination'}
                                </span>
                                <span className="font-bold text-lg leading-tight">
                                    {ride.direction === 'to_airport' ? ride.airport.toUpperCase() : ride.from_address}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="font-medium">{departureDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="font-medium">
                                {departureDate.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="font-medium uppercase">{ride.status}</span>
                        </div>
                    </div>

                    {ride.description && (
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-transparent group-hover:border-zinc-100 dark:group-hover:border-zinc-800 transition-all">
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 italic leading-relaxed">
                                {ride.description}
                            </p>
                        </div>
                    )}
                </div>

                {/* Action */}
                <div
                    className="flex items-center justify-center shrink-0 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-row md:flex-col gap-3">
                        {ride.phone_number && (
                            <a href={`tel:${ride.phone_number}`} aria-label="Call provider">
                                <Button
                                    variant="outline"
                                    className="h-10 w-10 p-2! rounded-xl border-green-500 text-green-500 hover:bg-green-500/10 hover:text-green-600 dark:hover:bg-green-500/20 transition-all"
                                >
                                    <Phone className="h-5 w-5" />
                                </Button>
                            </a>
                        )}
                        <SendPostMessageModal
                            postId={ride.id}
                            postType="airport_ride"
                            ownerId={ride.user_id}
                            ownerName={ride.user.name}
                            trigger={
                                <Button
                                    variant="default"
                                    aria-label="Send message"
                                    className="h-10 w-10 p-2! rounded-xl shadow-lg shadow-primary/20 transition-all"
                                >
                                    <MessageSquare className="h-5 w-5" />
                                </Button>
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
