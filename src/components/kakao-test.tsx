'use client';

import { useState } from 'react';

import { KakaoAddressSearch } from '@/components/kakao-address-search';

interface DaumAddress {
    fullAddress: string;
    [key: string]: unknown;
}

export function KakaoTest() {
    const [daumAddress, setDaumAddress] = useState<DaumAddress | null>(null);

    return (
        <div className="p-4 border rounded-lg space-y-4 my-4 bg-gray-50 dark:bg-gray-800">
            <h2 className="text-xl font-bold">Kakao Address Search Test</h2>

            {/* Default UI Search Section */}
            <div className="space-y-2">
                <h3 className="font-semibold">Address Search (Default UI)</h3>
                <div className="flex gap-2 items-center">
                    <KakaoAddressSearch
                        onComplete={(data) =>
                            setDaumAddress({
                                ...data,
                                fullAddress: typeof data.fullAddress === 'string' ? data.fullAddress : '',
                            })
                        }
                    />
                    {daumAddress && (
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            Selected: <span className="font-medium">{daumAddress.fullAddress}</span>
                        </div>
                    )}
                </div>
                {daumAddress && (
                    <div className="mt-2 p-2 border rounded bg-white dark:bg-gray-900 text-sm overflow-auto max-h-60">
                        <pre>{JSON.stringify(daumAddress, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}
