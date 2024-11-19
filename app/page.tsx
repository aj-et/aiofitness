import { sql } from "@vercel/postgres";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from '@clerk/nextjs/server';
import Link from "next/link";

export default async function HomePage() {
  const { userId } = await auth();

  // Get the userId from auth() -- if null, the user is not signed in
  if (userId) {
    // Query DB for user specific information or display assets only to signed in users
    const { rows } = await sql`SELECT * from userprofile`;
  }

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser()
  // Use `user` to render user details or create UI elements

  return (
    <div className="flex flex-col">
      
      
      {/* {rows.map((row) => (
        <div key={row.id}>
          {row.firstName} {row.lastName} - {row.age}
        </div>
      ))} */}

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
  );
}