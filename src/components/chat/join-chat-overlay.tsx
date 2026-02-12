'use client';

import React, { useState } from 'react';

import { useChatStore } from '@/store/use-chat-store';

import { Button } from '@/components/ui/button';

import { cn } from '@/utils/cn';

// Mock data for Korean cities - In a real app, this would come from an API
const KOREAN_CITIES = [
    'Seoul',
    'Busan',
    'Incheon',
    'Daegu',
    'Daejeon',
    'Gwangju',
    'Ulsan',
    'Suwon',
    'Changwon',
    'Goyang',
];

export function JoinChatOverlay() {
    const { hasJoined, joinChat } = useChatStore();
    const [name, setName] = useState('');
    const [school, setSchool] = useState('');
    const [city, setCity] = useState('');
    const [nameError, setNameError] = useState('');
    const [cityError, setCityError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let valid = true;
        if (!name.trim()) {
            setNameError('Name is required');
            valid = false;
        } else {
            setNameError('');
        }
        if (!city.trim()) {
            setCityError('City is required');
            valid = false;
        } else {
            setCityError('');
        }

        if (valid) {
            joinChat(name.trim(), school.trim() || null, city.trim());
        }
    };

    if (hasJoined) {
        return null;
    }

    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-[1px] p-4">
            <div className="w-full max-w-md rounded-lg bg-white dark:bg-zinc-900 p-8 shadow-xl border border-border">
                <h2 className="text-2xl font-bold text-center mb-6">Join the Chat</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={cn(
                                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary',
                                nameError ? 'border-red-500' : 'border-border',
                            )}
                            placeholder="Enter your name"
                        />
                        {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
                    </div>
                    <div>
                        <label htmlFor="school" className="block text-sm font-medium text-foreground mb-1">
                            School (Optional)
                        </label>
                        <input
                            type="text"
                            id="school"
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter your school"
                        />
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-foreground mb-1">
                            City <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className={cn(
                                'w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary appearance-none pr-8',
                                cityError ? 'border-red-500' : 'border-border',
                            )}
                        >
                            <option value="">Select a city</option>
                            {KOREAN_CITIES.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                        {cityError && <p className="text-red-500 text-xs mt-1">{cityError}</p>}
                    </div>
                    <Button type="submit" className="w-full">
                        Join Chat
                    </Button>
                </form>
            </div>
        </div>
    );
}
