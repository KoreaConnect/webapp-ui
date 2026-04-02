import * as React from 'react';

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: number;
    className?: string;
}

const Loader = ({ size = 24, className = '', ...props }: LoaderProps) => {
    return (
        <div className={`flex items-center justify-center ${className}`} {...props}>
            <div
                className={`animate-spin rounded-full h-8 w-8 border-b-2 border-primary`}
                style={{ width: `${size}px`, height: `${size}px` }}
            ></div>
        </div>
    );
};

export { Loader };
