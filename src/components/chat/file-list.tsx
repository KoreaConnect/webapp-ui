'use client';

import { FileText } from 'lucide-react';

export function FileList() {
    // Placeholder for actual file loading logic
    const files = [
        { name: 'Project_Requirements.pdf', size: '2.4 MB', date: 'Oct 12' },
        { name: 'Architecture_v2.png', size: '1.1 MB', date: 'Oct 11' },
    ];

    return (
        <div className="space-y-1">
            {files.map((file, i) => (
                <div
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition cursor-pointer group"
                >
                    <div className="p-2 rounded bg-accent group-hover:bg-accent/80">
                        <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {file.size} • {file.date}
                        </p>
                    </div>
                </div>
            ))}
            <button className="w-full py-2 text-xs text-primary hover:underline font-medium">View all files</button>
        </div>
    );
}
