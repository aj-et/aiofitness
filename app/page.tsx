import { sql } from "@vercel/postgres";

export default async function HomePage() {
  

  const { rows } = await sql`SELECT * from userprofile`;

  return (
    <div>
      Home Page

      {/* {rows.map((row) => (
        <div key={row.id}>
          {row.firstName} {row.lastName} - {row.age}
        </div>
      ))} */}
    </div>
  );
}