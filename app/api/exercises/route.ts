import { NextResponse } from 'next/server';

const API_KEY = process.env.API_NINJAS_KEY;
const BASE_URL = 'https://api.api-ninjas.com/v1/exercises';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');
  const muscle = searchParams.get('muscle');

  const queryParams = new URLSearchParams();
  if (name) queryParams.append('name', name);
  if (muscle) queryParams.append('muscle', muscle);

  try {
    const response = await fetch(`${BASE_URL}?${queryParams}`, {
      headers: {
        'X-Api-Key': API_KEY!,
      },
    });
    
    const exercises = await response.json();
    return NextResponse.json(exercises);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}