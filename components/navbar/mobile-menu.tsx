'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavLinks } from './nav-links';
import { AuthStatus } from './auth-status';

interface MobileMenuProps {
    userId: string | null;
    items: Array<{ label: string; path: string; }>;
}

export function MobileMenu({ userId, items }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="lg:hidden">
            {/* Hamburger button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Toggle menu"
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-gray-600" />
                ) : (
                    <Menu className="h-6 w-6 text-gray-600" />
                )}
            </button>

            {/* Mobile menu overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/20" 
                    onClick={() => setIsOpen(false)} 
                />
            )}

            {/* Mobile menu panel */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-72 bg-white transform transition-transform duration-200 ease-in-out ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Close button */}
                    <div className="flex justify-end p-4">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <X className="h-6 w-6 text-gray-600" />
                        </button>
                    </div>

                    {/* Mobile menu content */}
                    <div className="flex flex-col flex-1 px-4 pb-6">
                        {/* Navigation Links */}
                        <div className="mb-6">
                            <NavLinks items={items} mobile={true} />
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200 my-4"></div>

                        {/* Auth Status */}
                        <div className="mt-auto">
                            <AuthStatus userId={userId} mobile={true} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}