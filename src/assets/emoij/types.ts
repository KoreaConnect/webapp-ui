import React from 'react';

export interface EmojiProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    width?: number | string;
    height?: number | string;
}
