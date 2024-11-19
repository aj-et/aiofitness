'use client';

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

interface AuthStatusProps {
  userId: string | null;
  mobile?: boolean;
}

export function AuthStatus({ userId, mobile }: AuthStatusProps) {
    return (
        <div className={`flex ${mobile ? 'flex-col items-start gap-2' : 'items-center gap-4'}`}>
            {userId ? (
                <div className={`flex ${mobile ? 'flex-col items-start gap-2' : 'items-center gap-4'}`}>
                    <UserButton />
                    {/* <p className="text-sm text-gray-600">User Id: {userId}</p> */}
                </div>
            ) : (
                <Link href="/sign-in" className={mobile ? 'w-full' : ''}>
                    <button className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 ${
                        mobile ? 'w-full' : ''
                    }`}>
                        Sign In
                    </button>
                </Link>
            )}
        </div>
    );
}