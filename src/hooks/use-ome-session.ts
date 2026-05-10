'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type OmeStatus = 'idle' | 'searching' | 'connected' | 'ended' | 'error';
export type OmeChatMode = 'video' | 'voice';

export interface OmePartner {
    id: string;
    name: string;
    avatar?: string;
    location?: string;
    gender?: 'male' | 'female' | 'other';
}

const MOCK_PARTNERS: OmePartner[] = [
    { id: '1', name: 'Alex', location: 'Seoul, KR', gender: 'male' },
    { id: '2', name: 'Elena', location: 'Tokyo, JP', gender: 'female' },
    { id: '3', name: 'Yuki', location: 'London, UK', gender: 'female' },
    { id: '4', name: 'Mateo', location: 'Madrid, ES', gender: 'male' },
    { id: '5', name: 'Sarah', location: 'New York, US', gender: 'female' },
];

export const useOmeSession = () => {
    const [status, setStatus] = useState<OmeStatus>('idle');
    const [chatMode, setChatMode] = useState<OmeChatMode>('video');
    const [partner, setPartner] = useState<OmePartner | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startSession = useCallback(async (mode: OmeChatMode = 'video') => {
        try {
            setChatMode(mode);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: mode === 'video',
                audio: true,
            });
            setLocalStream(stream);
            setStatus('searching');
        } catch (error) {
            console.error('Failed to get media devices:', error);
            setStatus('error');
        }
    }, []);

    const stopSession = useCallback(() => {
        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
            setLocalStream(null);
        }
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        setStatus('idle');
        setPartner(null);
    }, [localStream]);

    const nextPartner = useCallback(() => {
        setPartner(null);
        setStatus('searching');
    }, []);

    const endSession = useCallback(() => {
        setStatus('ended');
    }, []);

    useEffect(() => {
        if (status === 'searching') {
            const delay = Math.random() * 2000 + 1000; // 1-3 seconds
            searchTimeoutRef.current = setTimeout(() => {
                const randomPartner = MOCK_PARTNERS[Math.floor(Math.random() * MOCK_PARTNERS.length)];
                setPartner(randomPartner);
                setStatus('connected');
            }, delay);
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [status]);

    return {
        status,
        chatMode,
        partner,
        localStream,
        startSession,
        stopSession,
        nextPartner,
        endSession,
    };
};
