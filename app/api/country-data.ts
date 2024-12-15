import { QualityOfLife } from "@/types/country";

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

// Official stable API endpoint (v2):
const WORLD_BANK_API_URL = "https://api.worldbank.org/v2";

// Fetch last 10 years of data
const YEAR_RANGE = "2012:2022";

// Indicators known to exist in WDI (v2) and be retrievable by country:
// - PPP GDP per capita: NY.GDP.PCAP.PP.CD
// - Life expectancy: SP.DYN.LE00.IN
// - Education expenditure % GDP: SE.XPD.TOTL.GD.ZS
// - Health expenditure % GDP: SH.XPD.CHEX.GD.ZS
// - Broadband subscriptions (per 100): IT.NET.BBND
//
// We'll omit the political stability indicator since the WGI data isn't directly accessible via the same simple endpoints.

const INDICATORS = {
  pppGdpPerCapita: "NY.GDP.PCAP.PP.CD",
  lifeExpectancy: "SP.DYN.LE00.IN",
  educationExpenditure: "SE.XPD.TOTL.GD.ZS",
  healthExpenditure: "SH.XPD.CHEX.GD.ZS",
  fixedBroadband: "IT.NET.BBND", // Fixed broadband subscriptions (per 100 people)
  mobileBroadband: "IT.NET.MOBZ", // Mobile broadband subscriptions (per 100 people)
  internetUsers: "IT.NET.USER.ZS", // Internet users (% of population)
};

async function fetchLatestValue(
  countryCode: string,
  indicator: string
): Promise<number | null> {
  const url = `${WORLD_BANK_API_URL}/country/${countryCode}/indicator/${indicator}?format=json&date=${YEAR_RANGE}&per_page=100`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error fetching ${indicator}: ${response.statusText}`);
      return null;
    }

    const json = (await response.json()) as [
      WorldBankResponse,
      WorldBankIndicatorResponse[]
    ];
    const dataArray = json?.[1] || [];
    // Sort by date (descending) and pick the most recent non-null value
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
    fixedBroadband,
    mobileBroadband,
    internetUsers,
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
  // Life expectancy normalization: Map 50-85 to 0-100
  const lifeExpScore = Math.min(100, Math.max(0, ((le - 50) / 35) * 100));

  const ee = safeVal(educationExpenditure, 3);
  // Education: assume 0-10% maps to 0-100
  const education = Math.min(100, (ee / 10) * 100);

  const he = safeVal(healthExpenditure, 5);
  // Healthcare: assume 0-15% maps to 0-100
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
