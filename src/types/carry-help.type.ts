export type CarryHelpType = 'offer' | 'request';

export interface CarryHelpUser {
    name: string;
    avatar: string;
    rating: number;
}

export interface CarryHelp {
    id: number;
    type: CarryHelpType;
    from: string;
    to: string;
    date: string;
    time?: string;
    capacity?: string;
    weight?: string;
    items?: string;
    price: string;
    priceUnit: string;
    user: CarryHelpUser;
}

export interface SearchCarryHelpParams {
    route?: string;
    from?: string;
    to?: string;
    date?: string;
}
