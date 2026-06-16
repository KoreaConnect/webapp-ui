import { AirportRideAlarm } from '@/types/airport-ride.type';

const STORAGE_KEY = 'airport_ride_alarms';

export const rideAlarmService = {
    async setAlarm(alarm: AirportRideAlarm): Promise<{ success: boolean; data: AirportRideAlarm }> {
        // Mock API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const alarms = this.getAlarms();
        const newAlarm = {
            ...alarm,
            id: Math.random().toString(36).substring(2, 9),
            created_at: new Date().toISOString(),
        };

        const updatedAlarms = [...alarms, newAlarm];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAlarms));

        return { success: true, data: newAlarm };
    },

    getAlarms(): AirportRideAlarm[] {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    findAlarm(criteria: Partial<AirportRideAlarm>): AirportRideAlarm | undefined {
        const alarms = this.getAlarms();
        return alarms.find(
            (a) =>
                a.airport === criteria.airport &&
                a.direction === criteria.direction &&
                a.address === criteria.address &&
                a.date === criteria.date &&
                a.time === criteria.time &&
                a.radius_meters === criteria.radius_meters,
        );
    },

    async deleteAlarm(id: string): Promise<{ success: boolean }> {
        const alarms = this.getAlarms();
        const updatedAlarms = alarms.filter((a) => a.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAlarms));
        return { success: true };
    },
};
