import * as Dialog from '@radix-ui/react-dialog';
import { Car, Home, MessageSquare, Package, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

const postTypes = [
    {
        id: 'taxi-share',
        title: 'Taxi Share',
        description: 'Share a taxi ride with others',
        icon: Car,
        color: 'text-green-600 bg-green-50',
    },
    {
        id: 'home-pass',
        title: 'Home Pass',
        description: 'Share your home or find accommodation',
        icon: Home,
        color: 'text-blue-600 bg-blue-50',
    },
    {
        id: 'stuff-delivery',
        title: 'Stuff Delivery',
        description: 'Request or offer delivery services',
        icon: Package,
        color: 'text-orange-600 bg-orange-50',
    },
    {
        id: 'general',
        title: 'General Post',
        description: 'Share anything else',
        icon: MessageSquare,
        color: 'text-purple-600 bg-purple-50',
    },
];

const WritePostDialogContent = ({ onSelect }: { onSelect: (id: string) => void }) => {
    return (
        <div className="py-6">
            <div className="flex items-center justify-between mb-6 px-6">
                <Dialog.Title className="text-2xl font-semibold text-gray-900">Create a Post</Dialog.Title>

                <Dialog.Close asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <X className="h-5 w-5" />
                    </Button>
                </Dialog.Close>
            </div>

            <Dialog.Description className="text-gray-600 mb-6 px-6">
                Choose what type of post you would like to create
            </Dialog.Description>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 overflow-y-auto max-h-100 ">
                {postTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                        <button
                            key={type.id}
                            onClick={() => onSelect(type.id)}
                            className="flex flex-col items-start p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left"
                        >
                            <div className={`p-3 rounded-lg ${type.color} mb-3`}>
                                <Icon className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">{type.title}</h3>
                            <p className="text-sm text-gray-600">{type.description}</p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default WritePostDialogContent;
