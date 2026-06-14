'use client';

import { useCallback, useEffect, useState } from 'react';

import { useToastStore } from '@/store/use-toast-store';
import { CarryHelp, SearchCarryHelpParams } from '@/types/carry-help.type';

import { carryHelpService } from '@/services/carry-help.service';

export function useCarryHelp() {
    const { show } = useToastStore();
    const [routeFilter, setRouteFilter] = useState('all');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');

    const [deliveries, setDeliveries] = useState<CarryHelp[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchDeliveries = useCallback(async () => {
        setIsLoading(true);
        try {
            const params: SearchCarryHelpParams = {
                route: routeFilter,
                from,
                to,
                date,
            };

            const response = await carryHelpService.searchDeliveries(params);
            if (response.success) {
                setDeliveries(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch deliveries:', error);
            show({
                title: 'Error',
                message: 'Failed to fetch deliveries. Please try again.',
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    }, [routeFilter, from, to, date, show]);

    useEffect(() => {
        fetchDeliveries();
    }, [fetchDeliveries]);

    const resetFilters = useCallback(() => {
        setRouteFilter('all');
        setFrom('');
        setTo('');
        setDate('');
    }, []);

    return {
        routeFilter,
        setRouteFilter,
        from,
        setFrom,
        to,
        setTo,
        date,
        setDate,
        deliveries,
        isLoading,
        fetchDeliveries,
        resetFilters,
    };
}
