import { KakaoTest } from '@/components/kakao-test';
import { ScrollableView } from '@/components/ui/scrollable-view';

export default function FeedPage() {
    return (
        <ScrollableView className="">
            <h1 className="text-2xl font-bold mb-4">Feed Page</h1>
            <p>Welcome to the feed page!</p>
            <KakaoTest />
        </ScrollableView>
    );
}
