import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const KAKAO_API_BASE_URL = 'https://dapi.kakao.com/v2/local';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
        return NextResponse.json({ error: 'Latitude (lat) and Longitude (lng) are required' }, { status: 400 });
    }

    try {
        const response = await axios.get(`${KAKAO_API_BASE_URL}/geo/coord2address.json`, {
            headers: {
                Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY || process.env.KAKAO_REST_API_KEY}`,
            },
            params: {
                x: lng, // Kakao API uses x as longitude
                y: lat, // Kakao API uses y as latitude
            },
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error proxying Kakao address request:', error);
        return NextResponse.json({ error: 'Failed to fetch address from Kakao API' }, { status: 500 });
    }
}
