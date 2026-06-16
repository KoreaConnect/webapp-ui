'use client';

import { useCallback, useEffect, useState } from 'react';

import { useToastStore } from '@/store/use-toast-store';
import { AirportRide, AirportRideDirection, SearchAirportRideParams } from '@/types/airport-ride.type';

import { DaumAddressData } from '@/components/kakao-address-search';

import { airportRideService } from '@/services/airport-ride.service';
import { searchLocation } from '@/services/kakao.service';
import { rideAlarmService } from '@/services/ride-alarm.service';

import { SearchHistoryItem, useSearchHistory } from './use-search-history';

export function useAirportRides() {
    const { show } = useToastStore();
    const { saveSearch } = useSearchHistory();

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
    const [isAlarmLoading, setIsAlarmLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [isAlarmSet, setIsAlarmSet] = useState(false);

    // Check if alarm is set for current criteria
    useEffect(() => {
        const alarm = rideAlarmService.findAlarm({
            airport: airport.toUpperCase(),
            direction: tripDirection,
            address: currentAddress,
            date,
            time,
            radius_meters: maxDistance * 1000,
        });
        setIsAlarmSet(!!alarm);
    }, [airport, tripDirection, currentAddress, date, time, maxDistance]);

    const fetchRides = useCallback(
        async (options?: { saveToHistory?: boolean }) => {
            setIsLoading(true);
            setHasSearched(true);
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

                    // Save to history only if explicitly requested and search is valid
                    if (options?.saveToHistory && date && currentAddress && airport) {
                        saveSearch({
                            tripDirection,
                            airport,
                            currentAddress,
                            coords,
                            date,
                            time,
                            maxDistance,
                            timeTolerance,
                        });
                    }
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
        },
        [airport, tripDirection, coords, maxDistance, timeTolerance, date, time, currentAddress, show, saveSearch],
    );

    useEffect(() => {
        fetchRides();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tripDirection, airport]);

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
        setHasSearched(false);
    }, []);

    const handleToggleAlarm = useCallback(async () => {
        setIsAlarmLoading(true);
        try {
            const criteria = {
                airport: airport.toUpperCase(),
                direction: tripDirection,
                address: currentAddress,
                date,
                time,
                radius_meters: maxDistance * 1000,
            };

            const existingAlarm = rideAlarmService.findAlarm(criteria);

            if (existingAlarm) {
                if (existingAlarm.id) {
                    await rideAlarmService.deleteAlarm(existingAlarm.id);
                    setIsAlarmSet(false);
                    show({
                        title: 'Alarm Removed',
                        message: 'Notifications for this search have been disabled.',
                        type: 'success',
                    });
                }
            } else {
                const alarmData = {
                    ...criteria,
                    latitude: coords?.lat,
                    longitude: coords?.lng,
                    time_tolerance: timeTolerance,
                    is_active: true,
                };

                const response = await rideAlarmService.setAlarm(alarmData);
                if (response.success) {
                    setIsAlarmSet(true);
                    show({
                        title: 'Alarm Set',
                        message: 'We will notify you when matching rides are found.',
                        type: 'success',
                    });
                }
            }
        } catch (error) {
            console.error('Failed to toggle alarm:', error);
            show({
                title: 'Error',
                message: 'Failed to process alarm request. Please try again.',
                type: 'error',
            });
        } finally {
            setIsAlarmLoading(false);
        }
    }, [airport, tripDirection, currentAddress, coords, maxDistance, date, time, timeTolerance, show]);

    const handleSelectHistory = useCallback((item: SearchHistoryItem) => {
        setTripDirection(item.tripDirection);
        setAirport(item.airport);
        setCurrentAddress(item.currentAddress);
        setCoords(item.coords);
        setDate(item.date);
        setTime(item.time);
        setMaxDistance(item.maxDistance);
        setTimeTolerance(item.timeTolerance);
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
        isAlarmLoading,
        hasSearched,
        isAlarmSet,
        fetchRides,
        handleAddressComplete,
        clearAddress,
        resetFilters,
        handleToggleAlarm,
        handleSelectHistory,
    };
}
