import * as RadixAvatar from '@radix-ui/react-avatar';

type AvatarProps = {
    src?: string;
    alt?: string;
    fallback?: string;
    className?: string;
};

export default function Avatar({ src, alt, fallback, className }: AvatarProps) {
    return (
        <RadixAvatar.Root className={`relative flex shrink-0 overflow-hidden rounded-full ${className}`}>
            <RadixAvatar.Image src={src} alt={alt} className="h-full w-full object-cover" />
            <RadixAvatar.Fallback
                delayMs={300}
                className="flex h-full w-full items-center justify-center bg-muted text-sm font-medium text-muted-foreground"
            >
                {fallback ?? 'U'}
            </RadixAvatar.Fallback>
        </RadixAvatar.Root>
    );
}
