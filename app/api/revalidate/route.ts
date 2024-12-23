import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const AVAILABLE_COUNTRIES = [
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bali',
  'Belgium',
  'Bosnia And Herzegovina',
  'Brazil',
  'Bulgaria',
  'Cambodia',
  'Canada',
  'Cape Verde',
  'Chile',
  'China',
  'Colombia',
  'Costa Rica',
  'Croatia',
  'Czech Republic',
  'Denmark',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'Estonia',
  'Finland',
  'France',
  'Georgia',
  'Germany',
  'Greece',
  'Hungary',
  'Iceland',
  'Indonesia',
  'Ireland',
  'Israel',
  'Italy',
  'Japan',
  'Jordan',
  'Kenya',
  'Latvia',
  'Lithuania',
  'Malaysia',
  'Malta',
  'Mexico',
  'Montenegro',
  'Morocco',
  'Netherlands',
  'New Zealand',
  'Norway',
  'Panama',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Puerto Rico',
  'Qatar',
  'Romania',
  'Serbia',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'South Africa',
  'South Korea',
  'Spain',
  'Sri Lanka',
  'Sweden',
  'Switzerland',
  'Taiwan',
  'Thailand',
  'Tunisia',
  'Turkey',
  'UAE',
  'Ukraine',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vietnam',
];

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag');
  const revalidateAll = request.nextUrl.searchParams.get('all') === 'true';

  if (revalidateAll) {
    try {
      // Revalidate all country image tags
      await Promise.all(
        AVAILABLE_COUNTRIES.map((country) =>
          revalidateTag(`country-image-${country}`)
        )
      );

      return NextResponse.json({
        revalidated: true,
        message: 'Revalidated all country images',
      });
    } catch (error: unknown) {
      console.error('Error revalidating all countries:', error);
      return NextResponse.json(
        { error: 'Failed to revalidate all countries' },
        { status: 500 }
      );
    }
  }

  if (!tag) {
    return NextResponse.json(
      { error: 'Missing tag parameter' },
      { status: 400 }
    );
  }

  try {
    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, tag });
  } catch (error: unknown) {
    console.error('Error revalidating tag:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}
