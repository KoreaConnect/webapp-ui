'use client';

import { ArrowRight, Box, Calendar, Clock, Filter, MapPin, Plane, Plus, Search, Weight } from 'lucide-react';

import { Button } from '@/components/ui/button';

const MOCK_DELIVERIES = [
    {
        id: 1,
        type: 'offer', // Offering to carry
        from: 'Hanoi (HAN)',
        to: 'Seoul (ICN)',
        date: '2026-01-25',
        time: '23:30',
        capacity: '15kg',
        price: '200,000₫',
        priceUnit: 'per kg',
        user: {
            name: 'Tuan Tran',
            avatar: 'https://i.pravatar.cc/150?u=tuan',
            rating: 4.8,
        },
    },
    {
        id: 2,
        type: 'request', // Requesting someone to carry
        from: 'Ho Chi Minh (SGN)',
        to: 'Da Nang (DAD)',
        date: '2026-01-22',
        time: 'Flexible',
        items: 'Documents, Small Box',
        weight: '2kg',
        price: '300,000₫',
        priceUnit: 'total',
        user: {
            name: 'Lisa Nguyen',
            avatar: 'https://i.pravatar.cc/150?u=lisa',
            rating: 5.0,
        },
    },
    {
        id: 3,
        type: 'offer',
        from: 'Tokyo (NRT)',
        to: 'Ho Chi Minh (SGN)',
        date: '2026-02-01',
        time: '10:00',
        capacity: '23kg',
        price: '250,000₫',
        priceUnit: 'per kg',
        user: {
            name: 'Kenji Suzuki',
            avatar: 'https://i.pravatar.cc/150?u=kenji',
            rating: 4.9,
        },
    },
];

export default function StaffDeliveryPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Carry Help</h1>
                    <p className="text-zinc-500 mt-1">Send items securely or earn by using your extra luggage space.</p>
                </div>
                <Button className="w-full md:w-auto shadow-lg shadow-primary/20">
                    <Plus className="h-4 w-4 mr-2" />
                    New Request/Offer
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-border">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative group">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="From (Origin)"
                            className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-2xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all"
                        />
                    </div>
                    <div className="relative group">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="To (Destination)"
                            className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-2xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all"
                        />
                    </div>
                    <div className="relative group">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="date"
                            className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-2xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all"
                        />
                    </div>
                    <Button variant="default" className="w-full h-11">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                    </Button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Recent Opportunities</h2>
                    <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-foreground">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                </div>

                <div className="grid gap-4">
                    {MOCK_DELIVERIES.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-border hover:border-primary/30 transition-all cursor-pointer group"
                        >
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
                                                {item.type === 'offer' ? (
                                                    <Weight className="h-4 w-4" />
                                                ) : (
                                                    <Box className="h-4 w-4" />
                                                )}
                                                {item.type === 'offer' ? 'Capacity' : 'Item'}
                                            </span>
                                            <span className="font-semibold">
                                                {item.type === 'offer' ? item.capacity : item.weight}
                                            </span>
                                        </div>
                                        {item.items && (
                                            <div className="text-sm text-zinc-500 line-clamp-1">{item.items}</div>
                                        )}
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
                    ))}
                </div>
            </div>
        </div>
    );
}
