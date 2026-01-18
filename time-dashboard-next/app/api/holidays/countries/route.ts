import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      where: {
        supported: true,
      },
      orderBy: {
        name: 'asc',
      },
      select: {
        code: true,
        name: true,
      },
    });

    return NextResponse.json({
      countries,
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}
