import { UserButton } from "@clerk/nextjs";
import { auth } from '@clerk/nextjs/server';
import Link from "next/link";

export default async function NavBar() {
    const { userId } = await auth();

    return (
        <div className="">
            { userId ? (
                // Show user button when signed in
                <div>
                    <UserButton />
                    <p>User Id: {userId}</p>
                </div>
            ) : (
                // Show the button linking to the sign-in page when signed out
                <Link href="/sign-in">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Sign In
                    </button>
                </Link>
            )}
        </div>
    )
}

