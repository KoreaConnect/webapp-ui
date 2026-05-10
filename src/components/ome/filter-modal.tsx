'use client';

import { Settings2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FILTERS = [
    { label: 'Nearby', value: 'nearby', description: 'People in your current city' },
    { label: 'Same School', value: 'school', description: 'Students from your institution' },
    { label: 'Same City', value: 'city', description: 'People in your metropolitan area' },
    { label: 'Interests', value: 'interests', description: 'Match based on shared hobbies' },
];

export const FilterModal = ({ isOpen, onClose }: FilterModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl bg-background p-6 shadow-2xl ring-1 ring-border animate-in fade-in zoom-in duration-200">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-foreground">
                        <Settings2 className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-black uppercase tracking-tighter">Match Filters</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:bg-accent">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="space-y-3">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter.value}
                            className="w-full flex flex-col items-start gap-1 rounded-2xl bg-accent/50 p-4 text-left transition-all hover:bg-accent ring-1 ring-border hover:ring-primary/20 group"
                        >
                            <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors uppercase">
                                {filter.label}
                            </span>
                            <span className="text-xs opacity-50 font-medium">{filter.description}</span>
                        </button>
                    ))}
                </div>

                <Button
                    onClick={onClose}
                    className="mt-8 w-full rounded-2xl bg-primary py-6 font-bold text-white shadow-[0_0_20px_rgba(232,60,145,0.4)] hover:opacity-90"
                >
                    APPLY FILTERS
                </Button>
            </div>
        </div>
    );
};
