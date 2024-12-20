import { NOMINATIM_BASE_URL } from '../constants';

export async function searchCity(query: string) {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(query)}`,
      {
        next: {
          revalidate: 300,
        },
        headers: {
          'User-Agent': 'CountryExplorer/1.0',
        },
      }
    );
    if (!response.ok) throw new Error('Failed to search cities');
    return response.json();
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
}
