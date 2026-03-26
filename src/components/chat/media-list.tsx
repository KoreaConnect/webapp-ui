'use client';

export function MediaList() {
    // Placeholder for actual media loading logic
    const media = [
        { url: 'https://picsum.photos/seed/1/200', alt: 'Media 1' },
        { url: 'https://picsum.photos/seed/2/200', alt: 'Media 2' },
        { url: 'https://picsum.photos/seed/3/200', alt: 'Media 3' },
        { url: 'https://picsum.photos/seed/4/200', alt: 'Media 4' },
    ];

    return (
        <div className="grid grid-cols-3 gap-1">
            {media.map((item, i) => (
                <div
                    key={i}
                    className="aspect-square relative rounded-md overflow-hidden bg-accent hover:opacity-80 transition cursor-pointer"
                >
                    <img src={item.url} alt={item.alt} className="absolute inset-0 w-full h-full object-cover" />
                </div>
            ))}
            <button className="col-span-3 py-2 text-xs text-primary hover:underline font-medium">View all media</button>
        </div>
    );
}
