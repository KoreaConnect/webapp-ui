'use client';

import { CarryHelp } from '@/types/carry-help.type';
import { ArrowRight, Box, Calendar, Clock, Plane, Weight } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface CarryHelpCardProps {
    item: CarryHelp;
}

export function CarryHelpCard({ item }: CarryHelpCardProps) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-border hover:border-primary/30 transition-all cursor-pointer group">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Route & Date */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                item.type === 'offer'
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                            }`}
                        >
                            {item.type === 'offer' ? 'Can Carry' : 'Need Send'}
                        </span>
                        <span className="text-zinc-400 text-xs flex items-center gap-1">
                            <Plane className="h-3 w-3" /> Flight
                        </span>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex flex-col">
                            <span className="font-bold text-lg">{item.from}</span>
                        </div>
                        <ArrowRight className="h-5 w-5 text-zinc-300" />
                        <div className="flex flex-col">
                            <span className="font-bold text-lg">{item.to}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                        <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>{item.date}</span>
                        </div>
                        {item.time && (
                            <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl">
                                <Clock className="h-4 w-4 text-primary" />
                                <span>{item.time}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px bg-border my-2" />
                <div className="block md:hidden h-px w-full bg-border" />

                {/* Details & Price */}
                <div className="md:w-64 flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-500 flex items-center gap-2">
                                {item.type === 'offer' ? <Weight className="h-4 w-4" /> : <Box className="h-4 w-4" />}
                                {item.type === 'offer' ? 'Capacity' : 'Item'}
                            </span>
                            <span className="font-semibold">{item.type === 'offer' ? item.capacity : item.weight}</span>
                        </div>
                        {item.items && <div className="text-sm text-zinc-500 line-clamp-1">{item.items}</div>}
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-500 text-sm">Price</span>
                            <div className="text-right">
                                <span className="font-bold text-lg text-primary">{item.price}</span>
                                <span className="text-xs text-zinc-400 block">{item.priceUnit}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                        <div className="flex items-center gap-2">
                            <img
                                src={item.user.avatar}
                                alt={item.user.name}
                                className="h-8 w-8 rounded-full object-cover ring-2 ring-white dark:ring-zinc-800"
                            />
                            <div className="flex flex-col">
                                <span className="text-xs font-bold leading-none">{item.user.name}</span>
                                <span className="text-[10px] text-zinc-500">★ {item.user.rating}</span>
                            </div>
                        </div>
                        <Button size="sm" variant="outline" className="rounded-xl h-8">
                            Contact
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
