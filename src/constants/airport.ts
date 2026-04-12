export const AIRPORTS = [
    { label: 'Incheon (ICN)', value: 'icn' },
    { label: 'Gimpo (GMP)', value: 'gmp' },
    { label: 'Narita (NRT)', value: 'nrt' },
    { label: 'Haneda (HND)', value: 'hnd' },
] as const;

export type AirportCode = (typeof AIRPORTS)[number]['value'];
