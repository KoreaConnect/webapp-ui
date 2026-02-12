export const IMAGE_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
    'image/svg+xml',
    'image/tiff',
];

export const TEXT_MIME_TYPES = [
    'text/plain',
    'text/html',
    'text/css',
    'text/javascript',
    'text/csv',
    'text/xml',
    'application/json',
    'application/xml',
    // Common code file types (often treated as text)
    'application/x-javascript',
    'application/x-typescript',
    'application/x-sh', // Shell scripts
    'application/x-python', // Python scripts
    // Add more as needed based on common text file usage
];

export const ACCEPTABLE_MIME_TYPES = [...IMAGE_MIME_TYPES, ...TEXT_MIME_TYPES];

export const ACCEPTABLE_MIME_TYPES_STRING = ACCEPTABLE_MIME_TYPES.join(',');
