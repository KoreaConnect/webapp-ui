import ChatInterface from '../_components/chat-interface';

interface ConversationPageProps {
    params: Promise<{ id: string }>;
}

export default async function ConversationPage({ params }: ConversationPageProps) {
    const { id } = await params;

    return <ChatInterface conversationId={id} />;
}
