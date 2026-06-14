import { CarryHelp, SearchCarryHelpParams } from '@/types/carry-help.type';

const MOCK_DELIVERIES: CarryHelp[] = [
    {
        id: 1,
        type: 'offer',
        from: 'Hanoi (HAN)',
        to: 'Seoul (ICN)',
        date: '2026-01-25',
        time: '23:30',
        capacity: '15kg',
        price: '200,000₫',
        priceUnit: 'per kg',
        user: {
            name: 'Tuan Tran',
            avatar: 'https://i.pravatar.cc/150?u=tuan',
            rating: 4.8,
        },
    },
    {
        id: 2,
        type: 'request',
        from: 'Ho Chi Minh (SGN)',
        to: 'Da Nang (DAD)',
        date: '2026-01-22',
        time: 'Flexible',
        items: 'Documents, Small Box',
        weight: '2kg',
        price: '300,000₫',
        priceUnit: 'total',
        user: {
            name: 'Lisa Nguyen',
            avatar: 'https://i.pravatar.cc/150?u=lisa',
            rating: 5.0,
        },
    },
    {
        id: 3,
        type: 'offer',
        from: 'Tokyo (NRT)',
        to: 'Ho Chi Minh (SGN)',
        date: '2026-02-01',
        time: '10:00',
        capacity: '23kg',
        price: '250,000₫',
        priceUnit: 'per kg',
        user: {
            name: 'Kenji Suzuki',
            avatar: 'https://i.pravatar.cc/150?u=kenji',
            rating: 4.9,
        },
    },
    {
        id: 4,
        type: 'offer',
        from: 'Seoul (ICN)',
        to: 'Ho Chi Minh (SGN)',
        date: '2026-02-05',
        time: '08:45',
        capacity: '20kg',
        price: '180,000₫',
        priceUnit: 'per kg',
        user: {
            name: 'Ji-won Kim',
            avatar: 'https://i.pravatar.cc/150?u=jiwon',
            rating: 4.7,
        },
    },
];

export const carryHelpService = {
    async searchDeliveries(params: SearchCarryHelpParams): Promise<{ success: boolean; data: CarryHelp[] }> {
        // Mock delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const filtered = MOCK_DELIVERIES.filter((item) => {
            if (params.route && params.route !== 'all') {
                const isVietnam = (place: string) =>
                    place.includes('Hanoi') ||
                    place.includes('Ho Chi Minh') ||
                    place.includes('Da Nang') ||
                    place.includes('SGN') ||
                    place.includes('HAN') ||
                    place.includes('DAD');
                const isKorea = (place: string) =>
                    place.includes('Seoul') ||
                    place.includes('ICN') ||
                    place.includes('Pusan') ||
                    place.includes('PUS');

                if (params.route === 'kr-vn') {
                    if (!(isKorea(item.from) && isVietnam(item.to))) return false;
                }
                if (params.route === 'vn-kr') {
                    if (!(isVietnam(item.from) && isKorea(item.to))) return false;
                }
            }

            if (params.from && !item.from.toLowerCase().includes(params.from.toLowerCase())) return false;
            if (params.to && !item.to.toLowerCase().includes(params.to.toLowerCase())) return false;
            if (params.date && item.date !== params.date) return false;

            return true;
        });

        return { success: true, data: filtered };
    },
};
