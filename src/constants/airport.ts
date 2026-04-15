export const AIRPORTS = [
    { label: 'Incheon (ICN)', value: 'icn' },
    { label: 'Gimpo (GMP)', value: 'gmp' },
    { label: 'Gimhae (PUS)', value: 'pus' },
] as const;

export type AirportCode = (typeof AIRPORTS)[number]['value'];
