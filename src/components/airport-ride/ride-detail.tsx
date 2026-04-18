'use client';

import { useAuthStore } from '@/store/use-auth-store';
import { AirportRide } from '@/types/airport-ride.type';
import { Calendar, Clock, MapPin, MessageSquare, Phone, Share2, Shield, Users } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import { SendPostMessageModal } from '../chat/send-post-message-modal';

interface RideDetailProps {
    ride: AirportRide;
}

export function RideDetail({ ride }: RideDetailProps) {
    const user = useAuthStore((state) => state.user);
    const departureDate = new Date(ride.departure_time);

    const isOwner = user?.id && Number(user.id) === ride.user_id;

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-sm border border-border">
            <div className="flex flex-col gap-10">
                {/* User Info Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
                    <div className="flex items-center gap-5">
                        <Avatar className="h-16 w-16 border-2 border-white dark:border-zinc-800 shadow-sm rounded-2xl">
                            <AvatarImage
                                src={ride.user.picture || `https://i.pravatar.cc/150?u=${ride.user.username}`}
                            />
                            <AvatarFallback className="rounded-2xl">
                                {ride.user.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold text-foreground">{ride.user.name}</h2>
                            <p className="text-sm text-zinc-500 font-medium">@{ride.user.username}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                                <Shield className="h-3.5 w-3.5 text-green-500 fill-green-500/10" />
                                <span className="text-xs text-green-600 dark:text-green-500 font-semibold uppercase tracking-wider">
                                    Verified User
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-2xl h-12 px-5 gap-2 font-semibold">
                            <Share2 className="h-4 w-4" />
                            Share
                        </Button>
                        {!isOwner && (
                            <SendPostMessageModal
                                postId={ride.id}
                                postType="airport_ride"
                                ownerId={ride.user_id}
                                ownerName={ride.user.name}
                                trigger={
                                    <Button className="rounded-2xl h-12 px-6 gap-2 font-bold shadow-lg shadow-primary/20">
                                        <MessageSquare className="h-4 w-4 fill-white" />
                                        Message
                                    </Button>
                                }
                            />
                        )}
                    </div>
                </div>

                {/* Journey Info Section */}
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xs text-zinc-400 uppercase tracking-widest font-black mb-5">
                                Journey Route
                            </h3>
                            <div className="flex gap-6 relative">
                                <div className="flex flex-col items-center gap-2 py-1 relative z-10">
                                    <div className="h-4 w-4 rounded-full bg-primary ring-4 ring-primary/10 shadow-sm" />
                                    <div className="w-0.5 h-16 bg-dashed bg-zinc-200 dark:bg-zinc-800" />
                                    <div className="h-4 w-4 rounded-full border-2 border-primary bg-white dark:bg-zinc-900 shadow-sm" />
                                </div>
                                <div className="flex flex-col justify-between py-0.5">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                                            {ride.direction === 'to_airport' ? 'Pickup Point' : 'Airport'}
                                        </span>
                                        <span className="font-extrabold text-xl md:text-2xl text-foreground mt-1">
                                            {ride.direction === 'to_airport'
                                                ? ride.from_address
                                                : ride.airport.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                                            {ride.direction === 'to_airport' ? 'Airport' : 'Destination'}
                                        </span>
                                        <span className="font-extrabold text-xl md:text-2xl text-foreground mt-1">
                                            {ride.direction === 'to_airport'
                                                ? ride.airport.toUpperCase()
                                                : ride.from_address}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 shadow-inner">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-border">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-foreground">Meeting Address</h4>
                                    <p className="text-sm text-zinc-500 mt-1 leading-relaxed">{ride.from_address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xs text-zinc-400 uppercase tracking-widest font-black mb-5">
                                Ride Details
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-3 p-5 bg-white dark:bg-zinc-900 rounded-3xl border border-border shadow-sm">
                                    <div className="h-10 w-10 flex items-center justify-center bg-primary/5 rounded-2xl">
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                                            Date
                                        </span>
                                        <span className="text-sm font-bold text-foreground">
                                            {departureDate.toLocaleDateString(undefined, {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 p-5 bg-white dark:bg-zinc-900 rounded-3xl border border-border shadow-sm">
                                    <div className="h-10 w-10 flex items-center justify-center bg-primary/5 rounded-2xl">
                                        <Clock className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                                            Time
                                        </span>
                                        <span className="text-sm font-bold text-foreground">
                                            {departureDate.toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 p-5 bg-white dark:bg-zinc-900 rounded-3xl border border-border shadow-sm">
                                    <div className="h-10 w-10 flex items-center justify-center bg-primary/5 rounded-2xl">
                                        <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                                            Status
                                        </span>
                                        <span className="text-sm font-bold text-foreground uppercase tracking-tight">
                                            {ride.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 p-5 bg-white dark:bg-zinc-900 rounded-3xl border border-border shadow-sm">
                                    <div className="h-10 w-10 flex items-center justify-center bg-primary/5 rounded-2xl">
                                        <Shield className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                                            Contact
                                        </span>
                                        <span className="text-sm font-bold text-foreground uppercase tracking-tight">
                                            {ride.contact.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {ride.description && (
                            <div className="flex flex-col">
                                <h3 className="text-xs text-zinc-400 uppercase tracking-widest font-black mb-4">
                                    Note
                                </h3>
                                <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-3xl p-6 border border-transparent">
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                                        &ldquo;{ride.description}&rdquo;
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact Footer Section */}
                {!isOwner && (
                    <div className="bg-zinc-900 dark:bg-zinc-800 rounded-[2rem] p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
                        <div className="flex flex-col">
                            <h4 className="text-white font-bold text-lg">Interested in this ride?</h4>
                            <p className="text-zinc-400 text-sm mt-1 font-medium">
                                Get in touch with the provider to book your spot.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {ride.phone_number && (
                                <a href={`tel:${ride.phone_number}`} className="flex-1 md:flex-initial">
                                    <Button
                                        variant="outline"
                                        className="w-full h-14 rounded-2xl border-white/20 text-white hover:bg-white/10 hover:text-white gap-3 font-bold px-8 transition-all"
                                    >
                                        <Phone className="h-5 w-5" />
                                        Call Provider
                                    </Button>
                                </a>
                            )}
                            <SendPostMessageModal
                                postId={ride.id}
                                postType="airport_ride"
                                ownerId={ride.user_id}
                                ownerName={ride.user.name}
                                trigger={
                                    <Button className="flex-1 md:flex-initial h-14 rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200 gap-3 font-black px-8 transition-all">
                                        <MessageSquare className="h-5 w-5" />
                                        Message Now
                                    </Button>
                                }
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
