import { ReplyProvider } from '@/context/reply-context';

import CommunityChat from './community-chat';

function Page() {
    return (
        <ReplyProvider>
            <CommunityChat />
        </ReplyProvider>
    );
}

export default Page;
