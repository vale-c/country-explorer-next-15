'use server';

import { db } from '@/drizzle.config';
import { costOfLiving, costOfLivingCities } from '@/lib/db/schema';
import { ilike } from 'drizzle-orm';
import { Country, QualityOfLife } from '@/types/country';

const RESTCOUNTRIES_BASE_URL = 'https://restcountries.com/v3.1';
const WORLD_BANK_API_URL = 'https://api.worldbank.org/v2';
const YEAR_RANGE = '2012:2024';

async function getCountryByName(name: string) {
  try {
    const response = await fetch(
      `${RESTCOUNTRIES_BASE_URL}/name/${encodeURIComponent(
        name
      )}?fields=name,flags`
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error(`Error fetching country data for ${name}:`, error);
    return null;
  }
}

export async function getCountryImage(countryName: string) {
  try {
    const country = await getCountryByName(countryName);
    const fallbackImage = country?.flags?.svg || '/images/placeholder.jpg';

    if (!process.env.NEXT_PUBLIC_PEXELS_API_KEY) {
      return fallbackImage;
    }

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        countryName
      )} landscape architecture landmark&per_page=1`,
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY,
        },
        cache: 'force-cache',
        next: {
          revalidate: 86400, // 1 day
        },
      }
    );
    if (!response.ok) return fallbackImage;
    const data = await response.json();
    return data?.photos?.[0]?.src?.large || fallbackImage;
  } catch (error) {
    console.error(error);
    return '/images/placeholder.jpg';
  }
}

export async function searchCountry(query: string) {
  try {
    const normalizedQuery = query.toLowerCase().trim();
    const countries = await db.select().from(costOfLiving).execute();

    const filteredCountries = countries.filter((country) =>
      country.country.toLowerCase().includes(normalizedQuery)
    );

    const groupedData = filteredCountries.reduce((acc, row) => {
      const { country, item, price } = row;
      if (!acc[country]) acc[country] = [];
      acc[country].push({ item, price: Number(price) });
      return acc;
    }, {} as Record<string, { item: string; price: number }[]>);

    return Object.entries(groupedData);
  } catch (error) {
    console.error('Error searching countries in the database:', error);
    return [];
  }
}

export async function searchCity(searchTerm: string) {
  try {
    // Split search term and get first part as city name
    const cityName = searchTerm.split(',')[0].trim();

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        new URLSearchParams({
          q: cityName,
          format: 'json',
          addressdetails: '1',
          limit: '1',
          featuretype: 'city',
        })
    );

    if (!response.ok) return [];

    const locations = await response.json();
    if (locations.length === 0) return [];

    // Get cost of living data for this city
    const cityData = await db
      .select({
        city: costOfLivingCities.city,
        item: costOfLivingCities.item,
        price: costOfLivingCities.price,
      })
      .from(costOfLivingCities)
      .where(
        ilike(
          costOfLivingCities.city,
          `%${cityName}%` // Use the cleaned city name instead
        )
      );

    if (!cityData.length) return []; // Return empty array if no city data found

    // Group the city data
    const groupedData = cityData.reduce((acc, row) => {
      if (!acc[row.city]) acc[row.city] = [];
      acc[row.city].push({ item: row.item, price: Number(row.price) });
      return acc;
    }, {} as Record<string, { item: string; price: number }[]>);

    // Return in the expected format
    return Object.entries(groupedData);
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
}

export async function searchCityForMap(searchTerm: string) {
  try {
    // Remove the country code from search term to focus on city name
    const cityName = searchTerm.split(',')[0].trim();

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        new URLSearchParams({
          q: cityName,
          format: 'json',
          addressdetails: '1',
          limit: '10',
          featuretype: 'city',
          countrycodes: searchTerm.split(',')[1]?.trim().toLowerCase() || '', // Add country filter
        })
    );

    if (!response.ok) return [];

    const locations = (await response.json()) as Array<{
      lat: string;
      lon: string;
      display_name: string;
      address: {
        city?: string;
        town?: string;
        municipality?: string;
        state?: string;
        country?: string;
      };
      importance: number;
    }>;

    // Less strict filtering to improve matches
    const filteredLocations = locations
      .filter((loc) => {
        const address = loc.address;
        const cityNameLower = cityName.toLowerCase();
        return (
          address.city?.toLowerCase().includes(cityNameLower) ||
          address.town?.toLowerCase().includes(cityNameLower) ||
          address.municipality?.toLowerCase().includes(cityNameLower)
        );
      })
      .sort((a, b) => b.importance - a.importance);

    return filteredLocations;
  } catch (error) {
    console.error('Error searching city:', error);
    return [];
  }
}

export async function fetchGlobalStatistics(): Promise<{
  averageRentCityCenter: number;
  averageInternetSpeed: number;
  averageCoffeePrice: number;
}> {
  const rawData = await db.select().from(costOfLiving);

  const parsedData = rawData.map((row) => ({
    ...row,
    price: Number(row.price),
  }));

  // Group by country to ensure equal country weight
  const rentByCountry = parsedData
    .filter((row) => row.item === 'Apartment (1 bedroom) in City Centre')
    .reduce((acc, row) => {
      if (!acc[row.country]) acc[row.country] = [];
      acc[row.country].push(row.price);
      return acc;
    }, {} as Record<string, number[]>);

  // Get median rent for each country
  const countryMedians = Object.entries(rentByCountry).map(([, prices]) => {
    const sorted = [...prices].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  });

  // Global average from country medians
  const avgRent =
    countryMedians.length > 0
      ? countryMedians.reduce((sum, price) => sum + price, 0) /
        countryMedians.length
      : 0;

  const internetSpeeds = parsedData
    .filter(
      (row) =>
        row.item === 'Internet (60 Mbps or More, Unlimited Data, Cable/ADSL)'
    )
    .map((row) => row.price);

  const avgInternetSpeed =
    internetSpeeds.length > 0
      ? internetSpeeds.reduce((sum, speed) => sum + speed, 0) /
        internetSpeeds.length
      : 0;

  const coffeePrices = parsedData
    .filter((row) => row.item === 'Cappuccino (regular)')
    .map((row) => row.price)
    .sort((a, b) => a - b);

  const medianCoffeePrice =
    coffeePrices.length > 0
      ? coffeePrices[Math.floor(coffeePrices.length / 2)]
      : 0;

  return {
    averageRentCityCenter: parseFloat(avgRent.toFixed(2)),
    averageInternetSpeed: parseFloat(avgInternetSpeed.toFixed(2)),
    averageCoffeePrice: parseFloat(medianCoffeePrice.toFixed(2)),
  };
}

/**
 * Fetches paginated and grouped cost of living data for cities, sorted alphabetically by city.
 *
 * @param {number} currentPage - The current page number.
 * @param {number} rowsPerPage - The number of cities per page.
 * @returns {Promise<{ data: [string, { item: string; price: number }[]][]; totalRows: number }>}
 */
export async function fetchPaginatedGroupedCitiesData(
  currentPage: number,
  rowsPerPage: number
): Promise<{
  data: [string, { item: string; price: number }[]][];
  totalRows: number;
}> {
  // Fetch all rows sorted alphabetically by city
  const rawData = await db
    .select()
    .from(costOfLivingCities)
    .orderBy(costOfLivingCities.city);

  // Ensure `price` is a number
  const parsedData = rawData.map((row) => ({
    ...row,
    price: Number(row.price), // Convert `price` from string to number
  }));

  // Group data by city
  const groupedData = parsedData.reduce((acc, row) => {
    const { city, item, price } = row;
    if (!acc[city]) acc[city] = [];
    acc[city].push({ item, price });
    return acc;
  }, {} as Record<string, { item: string; price: number }[]>);

  // Convert grouped data into an array of [city, items]
  const allGroupedData = Object.entries(groupedData);

  // Apply pagination to the grouped data
  const totalRows = allGroupedData.length; // Total number of cities
  const paginatedData = allGroupedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return { data: paginatedData, totalRows };
}

/**
 * Fetches paginated and grouped cost of living data, sorted alphabetically by country.
 *
 * @param {number} currentPage - The current page number.
 * @param {number} rowsPerPage - The number of countries per page.
 * @returns {Promise<{ data: [string, { item: string; price: number }[]][]; totalRows: number }>}
 */
export async function fetchPaginatedGroupedCountryData(
  currentPage: number,
  rowsPerPage: number
): Promise<{
  data: [string, { item: string; price: number }[]][];
  totalRows: number;
}> {
  // Fetch all rows sorted alphabetically by country
  const rawData = await db
    .select()
    .from(costOfLiving)
    .orderBy(costOfLiving.country);

  // Ensure `price` is a number
  const parsedData = rawData.map((row) => ({
    ...row,
    price: Number(row.price), // Convert `price` from string to number
  }));

  // Group data by country
  const groupedData = parsedData.reduce((acc, row) => {
    const { country, item, price } = row;
    if (!acc[country]) acc[country] = [];
    acc[country].push({ item, price });
    return acc;
  }, {} as Record<string, { item: string; price: number }[]>);

  // Convert grouped data into an array of [country, items]
  const allGroupedData = Object.entries(groupedData);

  // Apply pagination to the grouped data
  const totalRows = allGroupedData.length; // Total number of countries
  const paginatedData = allGroupedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return { data: paginatedData, totalRows };
}

export async function getCityDetails(lat: number, lon: number) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`
    );
    if (!response.ok) throw new Error('Failed to fetch city details');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching city details:', error);
    return null;
  }
}

export async function getCountryByCode(code: string): Promise<Country | null> {
  try {
    const response = await fetch(`${RESTCOUNTRIES_BASE_URL}/alpha/${code}`, {
      cache: 'force-cache',
      next: {
        revalidate: 604800, // 1 week
      },
    });
    if (!response.ok) throw new Error('Failed to fetch country');
    const [country] = await response.json();
    return country;
  } catch (error) {
    console.error('Error fetching country:', error);
    return null;
  }
}

interface WorldBankIndicatorResponse {
  indicator: { id: string; value: string };
  country: { id: string; value: string };
  countryiso3code: string;
  date: string;
  value: number | null;
  unit: string;
  obs_status: string;
  decimal: number;
}

interface WorldBankResponse {
  page: number;
  pages: number;
  per_page: string;
  total: number;
  sourceid: string;
  lastupdated: string;
}

const INDICATORS = {
  pppGdpPerCapita: 'NY.GDP.PCAP.PP.CD',
  lifeExpectancy: 'SP.DYN.LE00.IN',
  educationExpenditure: 'SE.XPD.TOTL.GD.ZS',
  healthExpenditure: 'SH.XPD.CHEX.GD.ZS',
  fixedBroadband: 'IT.NET.BBND',
  mobileBroadband: 'IT.NET.MOBZ',
  internetUsers: 'IT.NET.USER.ZS',
};

export async function getCountries() {
  try {
    const response = await fetch(
      `${RESTCOUNTRIES_BASE_URL}/all?fields=name,cca3,flags,capital,region,population,translations`,
      {
        cache: 'force-cache',
        next: {
          revalidate: 604800,
        },
      }
    );
    if (!response.ok)
      throw new Error(`Failed to fetch countries. Status: ${response.status}`);

    const countries = await response.json();

    return countries
      .map((country: Country) => ({
        ...country,
        name: {
          common: country.translations?.eng?.common || country.name.common,
        },
      }))
      .sort((a: Country, b: Country) =>
        a.name.common.localeCompare(b.name.common)
      );
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}

async function fetchLatestValue(
  countryCode: string,
  indicator: string
): Promise<number | null> {
  const url = `${WORLD_BANK_API_URL}/country/${countryCode}/indicator/${indicator}?format=json&date=${YEAR_RANGE}&per_page=100`;

  try {
    const response = await fetch(url, {
      cache: 'force-cache',
      next: {
        revalidate: 3600,
      },
    });
    if (!response.ok) {
      console.error(`Error fetching ${indicator}: ${response.statusText}`);
      return null;
    }

    const json = (await response.json()) as [
      WorldBankResponse,
      WorldBankIndicatorResponse[]
    ];
    const dataArray = json?.[1] || [];
    const sorted = dataArray
      .filter((d) => d.value !== null)
      .sort((a, b) => parseInt(b.date) - parseInt(a.date));
    return sorted.length > 0 ? sorted[0].value : null;
  } catch (error) {
    console.error(`Fetch error for ${indicator}:`, error);
    return null;
  }
}

export async function getCountryData(
  countryCode: string
): Promise<QualityOfLife> {
  const [
    pppGdpPerCapita,
    lifeExpectancy,
    educationExpenditure,
    healthExpenditure,
  ] = await Promise.all([
    fetchLatestValue(countryCode, INDICATORS.pppGdpPerCapita),
    fetchLatestValue(countryCode, INDICATORS.lifeExpectancy),
    fetchLatestValue(countryCode, INDICATORS.educationExpenditure),
    fetchLatestValue(countryCode, INDICATORS.healthExpenditure),
    fetchLatestValue(countryCode, INDICATORS.fixedBroadband),
    fetchLatestValue(countryCode, INDICATORS.mobileBroadband),
    fetchLatestValue(countryCode, INDICATORS.internetUsers),
  ]);

  const safeVal = (val: number | null, fallback = 0) =>
    val !== null ? val : fallback;

  const ppp = safeVal(pppGdpPerCapita, 20000);
  const costOfLiving = Math.min(100, Math.max(0, Math.log(ppp / 1000) * 20));

  const le = safeVal(lifeExpectancy, 70);
  const lifeExpScore = Math.min(100, Math.max(0, ((le - 50) / 35) * 100));

  const ee = safeVal(educationExpenditure, 3);
  const education = Math.min(100, (ee / 10) * 100);

  const he = safeVal(healthExpenditure, 5);
  const healthcare = Math.min(100, (he / 15) * 100);

  const overall = (costOfLiving + lifeExpScore + education + healthcare) / 4;

  return {
    overall: Math.round(overall),
    gdpPerCapita: Math.round(ppp),
    lifeExpectancy: Math.round(le),
    education: Math.round(education),
    healthcare: Math.round(healthcare),
    costOfLiving: Math.round(costOfLiving),
  };
}

export async function searchCountries(query: string) {
  try {
    const response = await fetch(
      `${RESTCOUNTRIES_BASE_URL}/name/${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error('Failed to search countries');
    return await response.json();
  } catch (error) {
    console.error('Error searching countries:', error);
    return [];
  }
}
