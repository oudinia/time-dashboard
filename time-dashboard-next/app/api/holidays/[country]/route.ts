import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ country: string }> }
) {
  try {
    const { country } = await params;
    const countryCode = country.toUpperCase();

    // Get years parameter (default 5 years)
    const searchParams = request.nextUrl.searchParams;
    const yearsParam = searchParams.get('years');
    const years = yearsParam ? parseInt(yearsParam, 10) : 5;

    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 1;
    const endYear = currentYear + years - 1;

    const holidays = await prisma.holiday.findMany({
      where: {
        countryCode: countryCode,
        year: {
          gte: startYear,
          lte: endYear,
        },
      },
      orderBy: {
        date: 'asc',
      },
      select: {
        name: true,
        date: true,
        type: true,
      },
    });

    return NextResponse.json({
      country: countryCode,
      holidays: holidays.map((h) => ({
        name: h.name,
        date: h.date.toISOString(),
        type: h.type,
      })),
    });
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return NextResponse.json(
      { error: 'Failed to fetch holidays' },
      { status: 500 }
    );
  }
}
