import { ReplyProvider } from '@/context/reply-context';

import Messenger from './messenger';

function Page() {
    return (
        <ReplyProvider>
            <Messenger />;
        </ReplyProvider>
    );
}

export default Page;
