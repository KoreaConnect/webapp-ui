import * as React from 'react';

import { Loader } from '@/components/ui/loader';

const AuthLoading = () => {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
            <Loader size={40} />
        </div>
    );
};

export { AuthLoading };
