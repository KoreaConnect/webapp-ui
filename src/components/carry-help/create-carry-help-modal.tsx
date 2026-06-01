'use client';

import { useState } from 'react';

import { useToastStore } from '@/store/use-toast-store';
import { Box, Calendar, Clock, DollarSign, Loader2, MapPin, Package, Weight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DialogDescription, DialogTitle, DialogWrapper } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { cn } from '@/utils/cn';

import CloseButton from '../ui/close-button';

interface CreateCarryHelpModalProps {
    trigger: React.ReactNode;
    onSuccess?: () => void;
}

export function CreateCarryHelpModal({ trigger, onSuccess }: CreateCarryHelpModalProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { show } = useToastStore();

    const [type, setType] = useState<'offer' | 'request'>('offer');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [amount, setAmount] = useState(''); // Weight or Capacity
    const [price, setPrice] = useState('');
    const [priceUnit, setPriceUnit] = useState<'per_kg' | 'total'>('per_kg');
    const [items, setItems] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!from || !to || !date || !amount || !price) {
            show({
                title: 'Validation Error',
                message: 'Please fill in all required fields.',
                type: 'error',
            });
            return;
        }

        setIsLoading(true);
        try {
            // Mock API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            show({
                title: 'Success!',
                message: `Your carry help ${type === 'offer' ? 'offer' : 'request'} has been created.`,
                type: 'success',
            });
            setOpen(false);
            onSuccess?.();
        } catch (error) {
            console.error('Failed to create carry help:', error);
            show({
                title: 'Error',
                message: 'Failed to create carry help. Please try again.',
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DialogWrapper open={open} onOpenChange={setOpen} trigger={trigger} closeOnClickOutside={false}>
            <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 w-full max-w-lg mx-auto">
                <DialogTitle className="sr-only">Create New Carry Help</DialogTitle>
                <DialogDescription className="sr-only">
                    Fill in the details to offer or request carry help
                </DialogDescription>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl">
                            <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">New Carry Help</h3>
                            <p className="text-xs text-zinc-500 font-medium">Send items or earn with extra space</p>
                        </div>
                    </div>
                    <CloseButton onClick={() => setOpen(false)} />
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                    {/* Type Selection */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                            Post Type
                        </label>
                        <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setType('offer')}
                                className={cn(
                                    'flex-1 flex items-center justify-center px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all',
                                    type === 'offer'
                                        ? 'bg-white dark:bg-zinc-700 text-primary shadow-sm'
                                        : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300',
                                )}
                            >
                                Can Carry (Offer)
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('request')}
                                className={cn(
                                    'flex-1 flex items-center justify-center px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all',
                                    type === 'request'
                                        ? 'bg-white dark:bg-zinc-700 text-primary shadow-sm'
                                        : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300',
                                )}
                            >
                                Need Send (Request)
                            </button>
                        </div>
                    </div>

                    {/* From & To */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                                From (Origin)
                            </label>
                            <div className="relative group">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors z-10" />
                                <input
                                    type="text"
                                    placeholder="e.g. Hanoi"
                                    required
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-xl pl-10 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all font-medium"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                                To (Destination)
                            </label>
                            <div className="relative group">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors z-10" />
                                <input
                                    type="text"
                                    placeholder="e.g. Seoul"
                                    required
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-xl pl-10 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

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
                                Time (Optional)
                            </label>
                            <div className="relative group">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors z-10" />
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-xl pl-10 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Amount & Items */}
                    <div className={cn('grid gap-4', type === 'request' ? 'grid-cols-2' : 'grid-cols-1')}>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                                {type === 'offer' ? 'Available Capacity' : 'Weight'}
                            </label>
                            <div className="relative group">
                                <Weight className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors z-10" />
                                <input
                                    type="text"
                                    placeholder={type === 'offer' ? 'e.g. 20kg' : 'e.g. 5kg'}
                                    required
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-xl pl-10 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all font-medium"
                                />
                            </div>
                        </div>
                        {type === 'request' && (
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                                    Items to Send
                                </label>
                                <div className="relative group">
                                    <Box className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors z-10" />
                                    <input
                                        type="text"
                                        placeholder="e.g. Clothes, Books"
                                        value={items}
                                        onChange={(e) => setItems(e.target.value)}
                                        className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-xl pl-10 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Price & Unit */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                                Price
                            </label>
                            <div className="relative group">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors z-10" />
                                <input
                                    type="text"
                                    placeholder="e.g. 200,000"
                                    required
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full h-11 bg-zinc-50 dark:bg-zinc-800 rounded-xl pl-10 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all font-medium"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                                Price Unit
                            </label>
                            <Select value={priceUnit} onValueChange={(val: 'per_kg' | 'total') => setPriceUnit(val)}>
                                <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="per_kg">Per kg</SelectItem>
                                    <SelectItem value="total">Total Price</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">
                            Additional Details
                        </label>
                        <textarea
                            rows={3}
                            placeholder="e.g. No liquid, no batteries. Meeting at the airport entrance."
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
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            `Post ${type === 'offer' ? 'Offer' : 'Request'}`
                        )}
                    </Button>
                </form>
            </div>
        </DialogWrapper>
    );
}
