'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavLinksProps {
    items: Array<{ label: string; path: string; }>;
    mobile?: boolean;
}

export function NavLinks({ items, mobile }: NavLinksProps) {
    const pathname = usePathname();

    return (
        <ul className={`${
            mobile 
                ? 'flex flex-col w-full gap-1' 
                : 'hidden lg:flex gap-2 items-center'
        }`}>
            {items.map((item) => (
                <li key={item.path} className={mobile ? 'w-full' : ''}>
                    <Link 
                        href={item.path} 
                        className={`${
                        mobile
                            ? 'flex w-full px-4 py-2 rounded-lg text-sm font-medium'
                            : 'px-4 py-2 rounded-lg text-sm font-medium'
                        } ${
                        pathname === item.path 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        } transition-colors duration-200`}
                    >
                        {item.label}
                    </Link>
                </li>
            ))}
        </ul>
    );
}