'use server';

import { NOMINATIM_BASE_URL } from '../constants';

export async function getCityDetails(lat: number, lon: number) {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`
    );
    if (!response.ok) throw new Error('Failed to fetch city details');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching city details:', error);
    return null;
  }
}
