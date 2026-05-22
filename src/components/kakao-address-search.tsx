'use client';

import { useState } from 'react';

import { useToastStore } from '@/store/use-toast-store';
import { Loader2, Locate, MapPin, X } from 'lucide-react';
import DaumPostcodeEmbed, { Address } from 'react-daum-postcode';

import { Button } from '@/components/ui/button';
import { DialogDescription, DialogTitle, DialogWrapper } from '@/components/ui/dialog';

import { getAddressFromCoords } from '@/services/kakao.service';

export interface DaumAddressData {
    address: string;
    addressType: string;
    bname: string;
    buildingName: string;
    fullAddress: string;
    x?: string | number;
    y?: string | number;
    [key: string]: unknown;
}

type KakaoAddressSearchProps = {
    onComplete: (data: DaumAddressData) => void;
    trigger?: React.ReactNode;
};

export function KakaoAddressSearch({ onComplete, trigger }: KakaoAddressSearchProps) {
    const [open, setOpen] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const { show } = useToastStore();

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
            fullAddress,
        } as DaumAddressData);
        setOpen(false);
    };

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            show({
                title: 'Error',
                message: 'Geolocation is not supported by your browser.',
                type: 'error',
            });
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const data = await getAddressFromCoords(latitude, longitude);

                    if (data.documents && data.documents.length > 0) {
                        const address = data.documents[0];
                        const addressName = address.road_address?.address_name || address.address?.address_name;

                        onComplete({
                            address: addressName,
                            addressType: address.road_address ? 'R' : 'J',
                            bname: address.address?.region_3depth_name || '',
                            buildingName: address.road_address?.building_name || '',
                            fullAddress: addressName,
                            ...address,
                            x: longitude,
                            y: latitude,
                        } as DaumAddressData);

                        show({
                            title: 'Location Found',
                            message: `Successfully updated to: ${addressName}`,
                            type: 'success',
                        });
                        setOpen(false);
                    } else {
                        show({
                            title: 'Error',
                            message: 'Could not find address for this location.',
                            type: 'error',
                        });
                    }
                } catch (error) {
                    show({
                        title: 'Error',
                        message: 'Failed to fetch address from Kakao.',
                        type: 'error',
                    });
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                let message = 'An unknown error occurred.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = 'User denied the request for Geolocation.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        message = 'The request to get user location timed out.';
                        break;
                }
                show({
                    title: 'Error',
                    message,
                    type: 'error',
                });
                setIsLocating(false);
            },
        );
    };

    return (
        <DialogWrapper
            open={open}
            onOpenChange={setOpen}
            trigger={trigger || <Button variant="outline">Search Address</Button>}
        >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <DialogTitle className="sr-only">Search Address</DialogTitle>
                <DialogDescription className="sr-only">Find your location via address or GPS</DialogDescription>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Search Address</h3>
                            <p className="text-[11px] text-zinc-500 font-medium">
                                Find your location via address or GPS
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* GPS Option */}
                    <button
                        onClick={handleGetCurrentLocation}
                        disabled={isLocating}
                        className="w-full flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-primary/5 dark:hover:bg-primary/10 border border-zinc-100 dark:border-zinc-800 hover:border-primary/30 rounded-2xl transition-all group/gps"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-xl shadow-sm group-hover/gps:text-primary transition-colors">
                                {isLocating ? (
                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                ) : (
                                    <Locate className="h-5 w-5 text-zinc-400 group-hover/gps:text-primary" />
                                )}
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50 group-hover/gps:text-primary transition-colors">
                                    Use My Current Location
                                </div>
                                <div className="text-[11px] text-zinc-500 font-medium">
                                    Fastest way to find where you are right now
                                </div>
                            </div>
                        </div>
                        <div className="text-[10px] font-black text-primary/50 group-hover/gps:text-primary transition-all uppercase tracking-widest px-2 py-1 bg-primary/5 rounded-lg">
                            GPS
                        </div>
                    </button>

                    {/* Separator */}
                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-zinc-100 dark:border-zinc-800"></div>
                        <span className="flex-shrink mx-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-white dark:bg-zinc-900 px-2">
                            OR Search Manually
                        </span>
                        <div className="flex-grow border-t border-zinc-100 dark:border-zinc-800"></div>
                    </div>

                    {/* Address Embed */}
                    <div className="h-[450px] w-full border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-800 shadow-inner">
                        <DaumPostcodeEmbed onComplete={handleComplete} style={{ height: '100%' }} autoClose={false} />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800">
                    <p className="text-[10px] text-zinc-400 text-center font-medium">
                        Address data provided by Kakao/Daum Maps. Some addresses may differ slightly from official
                        records.
                    </p>
                </div>
            </div>
        </DialogWrapper>
    );
}
