export type AirportRideDirection = 'to_airport' | 'from_airport';
export type AirportRideStatus = 'open' | 'full' | 'completed' | 'cancelled';
export type AirportRideContact = 'in_app' | 'phone' | 'both';

export interface AirportRideUser {
    id: number;
    name: string;
    username: string;
    picture: string;
}

export interface AirportRide {
    id: number;
    user_id: number;
    name: string;
    airport: string;
    direction: AirportRideDirection;
    from_address: string;
    location_point: {
        x: number; // longitude
        y: number; // latitude
    };
    departure_time: string;
    status: AirportRideStatus;
    description?: string;
    contact: AirportRideContact;
    phone_number?: string;
    user: AirportRideUser;
}

export interface CreateAirportRideDto {
    name: string;
    airport: string;
    direction: AirportRideDirection;
    from_address: string;
    longitude: number;
    latitude: number;
    departure_time: string;
    time_flex_minutes?: number;
    description?: string;
    contact: AirportRideContact;
    phone_number?: string;
}

export interface SearchAirportRideParams {
    airport?: string;
    direction?: AirportRideDirection;
    latitude?: number | string;
    longitude?: number | string;
    radius_meters?: number | string;
    radius?: number | string;
    address?: string;
    date?: string;
    time?: string;
    time_tolerance?: number | string;
    start_time?: string;
    end_time?: string;
    status?: AirportRideStatus;
    limit?: number | string;
    offset?: number | string;
}

export interface AirportRideResponse<T> {
    success: boolean;
    data: T;
    pagination?: {
        total: number;
        limit: number;
        offset: number;
    };
}
