'use client';

import { useCallback, useState } from 'react';

import { AirportRideDirection } from '@/types/airport-ride.type';

export interface SearchHistoryItem {
    id: string;
    tripDirection: AirportRideDirection;
    airport: string;
    currentAddress: string;
    coords: { lat: number; lng: number } | null;
    date: string;
    time: string;
    maxDistance: number;
    timeTolerance: number;
    timestamp: number;
}

const STORAGE_KEY = 'airport_ride_search_history';
const MAX_HISTORY = 10;

export function useSearchHistory() {
    const [history, setHistory] = useState<SearchHistoryItem[]>(() => {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Failed to parse search history', e);
                return [];
            }
        }
        return [];
    });

    const saveSearch = useCallback((item: Omit<SearchHistoryItem, 'id' | 'timestamp'>) => {
        setHistory((prev) => {
            // Check if identical search already exists (ignoring timestamp and id)
            const exists = prev.find(
                (h) =>
                    h.tripDirection === item.tripDirection &&
                    h.airport === item.airport &&
                    h.currentAddress === item.currentAddress &&
                    h.date === item.date &&
                    h.time === item.time &&
                    h.maxDistance === item.maxDistance &&
                    h.timeTolerance === item.timeTolerance,
            );

            if (exists) {
                // Move to top
                const filtered = prev.filter((h) => h.id !== exists.id);
                const updated = [{ ...exists, timestamp: Date.now() }, ...filtered];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                return updated;
            }

            const newItem: SearchHistoryItem = {
                ...item,
                id: Math.random().toString(36).substring(2, 9),
                timestamp: Date.now(),
            };

            const updated = [newItem, ...prev].slice(0, MAX_HISTORY);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const removeHistory = useCallback((id: string) => {
        setHistory((prev) => {
            const updated = prev.filter((h) => h.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const clearHistory = useCallback(() => {
        setHistory([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return {
        history,
        saveSearch,
        removeHistory,
        clearHistory,
    };
}
