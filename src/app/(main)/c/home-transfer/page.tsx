'use client';

import { Bath, Bed, Calendar, Filter, Home, MapPin, Maximize, Plus, Search, Wifi } from 'lucide-react';

import { Button } from '@/components/ui/button';

const MOCK_HOMES = [
    {
        id: 1,
        title: 'Sunny Studio in District 1',
        location: 'Ben Nghe, District 1, HCMC',
        price: '7,500,000₫',
        type: 'Studio',
        area: '30m²',
        date: 'Available Now',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
        user: {
            name: 'Elena Vo',
            avatar: 'https://i.pravatar.cc/150?u=elena',
        },
        amenities: ['Wifi', 'AC', 'Kitchen'],
    },
    {
        id: 2,
        title: 'Cozy Room near University',
        location: 'Tan Phong, District 7, HCMC',
        price: '4,200,000₫',
        type: 'Room',
        area: '20m²',
        date: 'Feb 1, 2026',
        image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80',
        user: {
            name: 'David Nguyen',
            avatar: 'https://i.pravatar.cc/150?u=david',
        },
        amenities: ['Wifi', 'Parking'],
    },
    {
        id: 3,
        title: 'Modern 1BR Apartment',
        location: 'Thao Dien, District 2, HCMC',
        price: '12,000,000₫',
        type: 'Apartment',
        area: '55m²',
        date: 'Available Now',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
        user: {
            name: 'Sarah James',
            avatar: 'https://i.pravatar.cc/150?u=sarah',
        },
        amenities: ['Pool', 'Gym', 'Wifi', 'AC'],
    },
];

export default function HomeTransferPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Home Transfer</h1>
                    <p className="text-zinc-500 mt-1">Find your next home or pass on your lease.</p>
                </div>
                <Button className="w-full md:w-auto shadow-lg shadow-primary/20">
                    <Plus className="h-4 w-4 mr-2" />
                    Post Listing
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-border">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative group">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Location"
                            className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-2xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all"
                        />
                    </div>
                    <div className="relative group">
                        <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                        <select className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-2xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all appearance-none cursor-pointer">
                            <option value="">Type</option>
                            <option value="room">Room</option>
                            <option value="studio">Studio</option>
                            <option value="apartment">Apartment</option>
                            <option value="house">Whole House</option>
                        </select>
                    </div>
                    <div className="relative group">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs group-focus-within:text-primary transition-colors">
                            ₫
                        </span>
                        <input
                            type="text"
                            placeholder="Max Price"
                            className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-2xl pl-8 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all"
                        />
                    </div>
                    <Button variant="default" className="w-full h-11">
                        <Search className="h-4 w-4 mr-2" />
                        Find Home
                    </Button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Latest Listings</h2>
                    <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-foreground">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_HOMES.map((home) => (
                        <div
                            key={home.id}
                            className="group bg-white dark:bg-zinc-900 rounded-3xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer flex flex-col h-full"
                        >
                            {/* Image */}
                            <div className="relative h-48 w-full overflow-hidden">
                                <img
                                    src={home.image}
                                    alt={home.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                                    {home.type}
                                </div>
                                <div className="absolute bottom-3 left-3 bg-primary/90 text-white px-2 py-1 rounded-lg text-sm font-bold shadow-sm">
                                    {home.price}
                                    <span className="text-[10px] font-normal opacity-80">/month</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-1 gap-4">
                                <div>
                                    <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                        {home.title}
                                    </h3>
                                    <div className="flex items-center text-zinc-500 text-sm">
                                        <MapPin className="h-3.5 w-3.5 mr-1 shrink-0" />
                                        <span className="truncate">{home.location}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                                    <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800 p-2 rounded-xl">
                                        <Maximize className="h-3.5 w-3.5" />
                                        <span>{home.area}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800 p-2 rounded-xl">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span className="truncate">{home.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800 p-2 rounded-xl">
                                        <Bed className="h-3.5 w-3.5" />
                                        <span>Furnished</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800 p-2 rounded-xl">
                                        <Bath className="h-3.5 w-3.5" />
                                        <span>Private</span>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={home.user.avatar}
                                            alt={home.user.name}
                                            className="h-6 w-6 rounded-full object-cover ring-2 ring-white dark:ring-zinc-800"
                                        />
                                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                            {home.user.name}
                                        </span>
                                    </div>
                                    <div className="flex gap-1">
                                        {home.amenities.includes('Wifi') && (
                                            <Wifi className="h-3.5 w-3.5 text-zinc-400" />
                                        )}
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
