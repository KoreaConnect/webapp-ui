'use client';

import { useState } from 'react';

import DaumPostcodeEmbed, { Address } from 'react-daum-postcode';

import { Button } from '@/components/ui/button';
import { DialogWrapper } from '@/components/ui/dialog';

interface DaumAddressData {
    address: string;
    addressType: string;
    bname: string;
    buildingName: string;
    [key: string]: unknown;
}

type KakaoAddressSearchProps = {
    onComplete: (data: DaumAddressData) => void;
};

export function KakaoAddressSearch({ onComplete }: KakaoAddressSearchProps) {
    const [open, setOpen] = useState(false);

    const handleComplete = (data: Address) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        onComplete({
            ...data,
            fullAddress, // Add the constructed full address
        } as DaumAddressData);
        setOpen(false);
    };

    return (
        <DialogWrapper
            open={open}
            onOpenChange={setOpen}
            trigger={<Button variant="outline">Search Address (Default UI)</Button>}
        >
            <div className="p-4 bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Search Address</h3>
                    <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>
                <div className="h-[400px] w-full border rounded-md overflow-hidden">
                    <DaumPostcodeEmbed onComplete={handleComplete} style={{ height: '100%' }} />
                </div>
            </div>
        </DialogWrapper>
    );
}
