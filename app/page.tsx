import { sql } from "@vercel/postgres";

export default async function Cart({
  params
} : {
  params: { user: string }
}): Promise<JSX.Element> {
  const { rows } = await sql`SELECT * from userprofile`;

  return (
    <div>
      {rows.map((row) => (
        <div key={row.id}>
          {row.firstName} {row.lastName} - {row.age}
        </div>
      ))}
    </div>
  );
}