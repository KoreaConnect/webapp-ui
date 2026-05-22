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
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [error, setError] = useState<{ name: string; message: string } | null>(null);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startSession = useCallback(async (mode: OmeChatMode = 'video') => {
        try {
            setChatMode(mode);
            setError(null);
            setIsAudioEnabled(true);
            setIsVideoEnabled(mode === 'video');

            let stream: MediaStream;
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: mode === 'video',
                    audio: true,
                });
            } catch (err) {
                const errorObj = err as Error;
                // Handle case where camera is missing but user requested video
                if (
                    mode === 'video' &&
                    (errorObj.name === 'NotFoundError' || errorObj.name === 'DevicesNotFoundError')
                ) {
                    console.warn('Camera not found, attempting audio-only fallback');
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: false,
                        audio: true,
                    });
                    setChatMode('voice');
                    setIsVideoEnabled(false);
                } else {
                    throw err;
                }
            }

            setLocalStream(stream);
            setStatus('searching');
        } catch (err) {
            const errorObj = err as Error;
            console.error('Failed to get media devices:', errorObj);
            setError({
                name: errorObj.name || 'Error',
                message: errorObj.message || 'Could not access media devices',
            });
            setStatus('error');
        }
    }, []);

    const toggleAudio = useCallback(() => {
        if (localStream) {
            const audioTracks = localStream.getAudioTracks();
            audioTracks.forEach((track) => {
                track.enabled = !track.enabled;
            });
            setIsAudioEnabled(audioTracks[0]?.enabled ?? false);
        }
    }, [localStream]);

    const toggleVideo = useCallback(async () => {
        if (localStream) {
            const videoTracks = localStream.getVideoTracks();

            if (videoTracks.length === 0) {
                // Dynamically request video track if missing (e.g. started in voice mode)
                try {
                    const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
                    const newTrack = videoStream.getVideoTracks()[0];
                    localStream.addTrack(newTrack);
                    // Re-create MediaStream to trigger updates in components
                    setLocalStream(new MediaStream(localStream.getTracks()));
                    setIsVideoEnabled(true);
                    setChatMode('video');
                } catch (err) {
                    const errorObj = err as Error;
                    console.error('Failed to add video track:', errorObj);
                    setError({
                        name: errorObj.name || 'Error',
                        message: errorObj.message || 'Could not access camera',
                    });
                }
            } else {
                const newState = !videoTracks[0].enabled;
                videoTracks.forEach((track) => {
                    track.enabled = newState;
                });
                setIsVideoEnabled(newState);
                if (newState) {
                    setChatMode('video');
                }
            }
        }
    }, [localStream]);

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
        setError(null);
        setIsAudioEnabled(true);
        setIsVideoEnabled(true);
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
        isAudioEnabled,
        isVideoEnabled,
        error,
        startSession,
        stopSession,
        nextPartner,
        endSession,
        toggleAudio,
        toggleVideo,
    };
};
