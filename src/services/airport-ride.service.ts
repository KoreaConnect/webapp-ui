import axios from '@/config/axios';
import {
    AirportRide,
    AirportRideResponse,
    AirportRideStatus,
    CreateAirportRideDto,
    SearchAirportRideParams,
} from '@/types/airport-ride.type';

export const airportRideService = {
    async createRide(dto: CreateAirportRideDto): Promise<AirportRideResponse<AirportRide>> {
        const { data } = await axios.post<AirportRideResponse<AirportRide>>('/airport-rides', dto);
        return data;
    },

    async searchRides(params: SearchAirportRideParams): Promise<AirportRideResponse<AirportRide[]>> {
        const { data } = await axios.get<AirportRideResponse<AirportRide[]>>('/airport-rides', {
            params,
        });
        return data;
    },

    async updateStatus(id: number, status: AirportRideStatus): Promise<AirportRideResponse<AirportRide>> {
        const { data } = await axios.patch<AirportRideResponse<AirportRide>>(`/airport-rides/${id}/status`, {
            status,
        });
        return data;
    },

    async deleteRide(id: number): Promise<AirportRideResponse<{ deleted: boolean }>> {
        const { data } = await axios.delete<AirportRideResponse<{ deleted: boolean }>>(`/airport-rides/${id}`);
        return data;
    },
};
