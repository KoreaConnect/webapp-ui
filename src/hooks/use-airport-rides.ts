'use client';

import { useCallback, useEffect, useState } from 'react';

import { useToastStore } from '@/store/use-toast-store';
import { AirportRide, AirportRideDirection, SearchAirportRideParams } from '@/types/airport-ride.type';

import { DaumAddressData } from '@/components/kakao-address-search';

import { airportRideService } from '@/services/airport-ride.service';
import { searchLocation } from '@/services/kakao.service';

export function useAirportRides() {
    const { show } = useToastStore();
    const [tripDirection, setTripDirection] = useState<AirportRideDirection>('to_airport');
    const [airport, setAirport] = useState('icn');
    const [currentAddress, setCurrentAddress] = useState('');
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [maxDistance, setMaxDistance] = useState(5);
    const [timeTolerance, setTimeTolerance] = useState(30);

    const [rides, setRides] = useState<AirportRide[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchRides = useCallback(async () => {
        setIsLoading(true);
        try {
            const params: SearchAirportRideParams = {
                airport: airport.toUpperCase(),
                direction: tripDirection,
                status: 'open',
            };

            if (currentAddress) {
                params.address = currentAddress;
            }

            if (coords) {
                params.latitude = coords.lat;
                params.longitude = coords.lng;
                params.radius = maxDistance * 1000;
                params.radius_meters = maxDistance * 1000;
            }

            if (date) {
                params.date = date;
            }

            if (time) {
                params.time = time;
                params.time_tolerance = timeTolerance;
            }

            const response = await airportRideService.searchRides(params);
            if (response.success) {
                setRides(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch rides:', error);
            show({
                title: 'Error',
                message: 'Failed to fetch rides. Please try again.',
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    }, [airport, tripDirection, coords, maxDistance, timeTolerance, date, time, currentAddress, show]);

    useEffect(() => {
        fetchRides();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddressComplete = async (data: DaumAddressData) => {
        setCurrentAddress(data.fullAddress);

        if (data.x && data.y) {
            setCoords({ lat: Number(data.y), lng: Number(data.x) });
        } else {
            try {
                const searchRes = await searchLocation(data.address);
                if (searchRes.documents && searchRes.documents.length > 0) {
                    const first = searchRes.documents[0];
                    setCoords({ lat: Number(first.y), lng: Number(first.x) });
                }
            } catch (error) {
                console.error('Failed to get coordinates:', error);
            }
        }
    };

    const clearAddress = () => {
        setCurrentAddress('');
        setCoords(null);
    };

    const resetFilters = useCallback(() => {
        setTripDirection('to_airport');
        setAirport('icn');
        setCurrentAddress('');
        setCoords(null);
        setDate('');
        setTime('');
        setMaxDistance(5);
        setTimeTolerance(30);
    }, []);

    return {
        tripDirection,
        setTripDirection,
        airport,
        setAirport,
        currentAddress,
        setCurrentAddress,
        date,
        setDate,
        time,
        setTime,
        maxDistance,
        setMaxDistance,
        timeTolerance,
        setTimeTolerance,
        rides,
        isLoading,
        fetchRides,
        handleAddressComplete,
        clearAddress,
        resetFilters,
    };
}
