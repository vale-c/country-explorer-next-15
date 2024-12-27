"use server";

import { QualityOfLife } from "@/types/country";
import { Country } from "@/types/country";

const RESTCOUNTRIES_BASE_URL = "https://restcountries.com/v3.1";
const WORLD_BANK_API_URL = "https://api.worldbank.org/v2";
const YEAR_RANGE = "2012:2022";

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
  pppGdpPerCapita: "NY.GDP.PCAP.PP.CD",
  lifeExpectancy: "SP.DYN.LE00.IN",
  educationExpenditure: "SE.XPD.TOTL.GD.ZS",
  healthExpenditure: "SH.XPD.CHEX.GD.ZS",
  fixedBroadband: "IT.NET.BBND",
  mobileBroadband: "IT.NET.MOBZ",
  internetUsers: "IT.NET.USER.ZS",
};

export async function getCountries() {
  try {
    const response = await fetch(
      `${RESTCOUNTRIES_BASE_URL}/all?fields=name,cca3,flags,capital,region,population,translations`,
      {
        cache: "force-cache",
        next: {
          revalidate: 604800,
          tags: ["countries"],
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
    console.error("Error fetching countries:", error);
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
      cache: "force-cache",
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
    if (!response.ok) throw new Error("Failed to search countries");
    return await response.json();
  } catch (error) {
    console.error("Error searching countries:", error);
    return [];
  }
}
