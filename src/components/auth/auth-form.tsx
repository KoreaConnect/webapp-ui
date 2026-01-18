import { Button } from '@/components/ui/button';

interface AuthFormProps {
    type: 'login' | 'register';
    onSubmit?: (e: React.FormEvent) => void;
}

export function AuthForm({ type, onSubmit }: AuthFormProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(e);
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="email">
                    Email
                </label>
                <input
                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400"
                    id="email"
                    placeholder="m@example.com"
                    required
                    type="email"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="password">
                    Password
                </label>
                <input
                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400"
                    id="password"
                    required
                    type="password"
                />
            </div>
            <Button className="w-full py-5" type="submit">
                {type === 'login' ? 'Đăng nhập' : 'Đăng ký'}
            </Button>
        </form>
    );
}
