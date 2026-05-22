'use client';

import { ArrowLeft, Construction } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export function UnderDevelopment() {
    const router = useRouter();

    return (
        <div className="flex h-full min-h-[400px] w-full flex-col items-center justify-center p-4">
            <div className="flex max-w-md flex-col items-center gap-6 text-center">
                <div className="rounded-full bg-primary/10 p-6 animate-pulse">
                    <Construction className="h-12 w-12 text-primary" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
                        Tính năng đang phát triển
                    </h1>
                    <p className="text-muted-foreground">
                        Chúng mình đang nỗ lực hoàn thiện tính năng này. Hãy quay lại sau nhé!
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button variant="outline" onClick={() => router.back()} className="flex-1 gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại
                    </Button>
                    <Button onClick={() => router.push('/feed')} className="flex-1">
                        Về Trang chủ
                    </Button>
                </div>
            </div>
        </div>
    );
}
