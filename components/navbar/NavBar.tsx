import { auth } from '@clerk/nextjs/server';
import { NavLinks } from './nav-links';
import { AuthStatus } from './auth-status';
import { Logo } from './logo';
import { MobileMenu } from './mobile-menu';

const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Nutrition', path: '/nutrition' },
    { label: 'Water', path: '/water' },
    { label: 'Workout', path: '/workout' },
    { label: 'Social', path: '/social' },
    { label: 'Profile', path: '/profile' },
];

export async function NavBar() {
    const { userId } = await auth();

    return (
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <nav className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Logo />
                        <NavLinks items={navItems} />
                    </div>
                    
                    {/* Desktop auth status */}
                    <div className="hidden lg:block">
                        <AuthStatus userId={userId} />
                    </div>
                    
                    {/* Mobile menu */}
                    <MobileMenu userId={userId} items={navItems} />
                </nav>
            </div>
        </header>
    );
}