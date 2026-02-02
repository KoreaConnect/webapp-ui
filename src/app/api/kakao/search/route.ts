import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const KAKAO_API_BASE_URL = 'https://dapi.kakao.com/v2/local';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const page = searchParams.get('page') || '1';
    const size = searchParams.get('size') || '15';

    if (!query) {
        return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    try {
        const response = await axios.get(`${KAKAO_API_BASE_URL}/search/keyword.json`, {
            headers: {
                Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY || process.env.KAKAO_REST_API_KEY}`,
            },
            params: {
                query,
                page,
                size,
            },
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error proxying Kakao search request:', error);
        return NextResponse.json({ error: 'Failed to fetch data from Kakao API' }, { status: 500 });
    }
}
