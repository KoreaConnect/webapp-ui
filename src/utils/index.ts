import { cn } from './cn';
import { getErrorMessage } from './get-error-message';

export { cn, getErrorMessage };

export function formatFileSize(bytes?: number) {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(dateString?: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Centrally scrolls to a message and applies a temporary highlight ring.
 */
export const applyMessageHighlight = (messageId: string, behavior: ScrollBehavior = 'smooth') => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
        // Find the closest scrollable viewport (Radix ScrollArea.Viewport)
        const viewport = element.closest('[data-radix-scroll-area-viewport]') as HTMLElement;

        if (viewport) {
            // Manual centering:
            // targetScrollTop = (elementTop relative to viewport) - (viewportHeight/2) + (elementHeight/2)
            const elementRect = element.getBoundingClientRect();
            const viewportRect = viewport.getBoundingClientRect();

            // Position of the element relative to the top of the viewport
            const relativeTop = elementRect.top - viewportRect.top + viewport.scrollTop;

            // Calculate the scroll position that centers the element
            const targetScrollTop = relativeTop - viewportRect.height / 2 + elementRect.height / 2;

            viewport.scrollTo({
                top: targetScrollTop,
                behavior: behavior,
            });
        } else {
            // Fallback to basic behavior if viewport not found
            element.scrollIntoView({ behavior, block: 'center' });
        }

        element.classList.add('ring-2', 'ring-primary/50', 'transition-all', 'duration-500');
        setTimeout(() => {
            element.classList.remove('ring-2', 'ring-primary/50');
        }, 2000);
        return true;
    }
    return false;
};
