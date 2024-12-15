import { QualityOfLife } from "@/types/country";

export async function getCountryData(
  countryCode: string
): Promise<QualityOfLife> {
  // Fetch data from World Bank API
  const indicators = [
    "NY.GDP.PCAP.CD", // GDP per capita
    "SL.UEM.TOTL.ZS", // Unemployment rate
    "SP.DYN.LE00.IN", // Life expectancy
    "SE.XPD.TOTL.GD.ZS", // Government expenditure on education
    "SH.XPD.CHEX.GD.ZS", // Current health expenditure
    "IT.NET.USER.ZS", // Internet users (% of population)
    "IT.NET.BBND", // Fixed broadband subscriptions (per 100 people)
    "ST.INT.ARVL", // Tourism receipts (current US$)
  ];

  const responses = await Promise.all(
    indicators.map((indicator) =>
      fetch(
        `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json&date=2021:2021`
      ).then((res) => res.json())
    )
  );

  const [
    gdpPerCapita,
    unemploymentRate,
    lifeExpectancy,
    educationExpenditure,
    internetUsersPercentage,
    broadbandSubscriptions,
    tourismReceipts,
  ] = responses.map((res) => res?.[1]?.[0]?.value || 0);

  // Calculate quality of life scores (simplified calculation for demonstration)
  const costOfLiving = Math.max(0, 100 - gdpPerCapita / 1000);
  const safety = Math.max(0, 100 - unemploymentRate);
  const healthcare = (lifeExpectancy / 85) * 100;
  const education = (educationExpenditure / 10) * 100;
  const overall = (costOfLiving + safety + healthcare + education) / 4;

  // Calculate internet speed
  const population = 1000000; // Replace with actual population data if available
  const internetUsers = (internetUsersPercentage / 100) * population;
  const broadbandUsers = (broadbandSubscriptions / 100) * population;

  // Estimate internet speed (in Mbps)
  const internetSpeed =
    broadbandUsers > 0 ? (internetUsers / broadbandUsers) * 10 : 0; // Adjust the multiplier as needed

  return {
    overall: Math.round(overall),
    costOfLiving: Math.round(costOfLiving),
    safety: Math.round(safety),
    healthcare: Math.round(healthcare),
    education: Math.round(education),
    gdpPerCapita: Math.round(gdpPerCapita),
    unemploymentRate: Math.round(unemploymentRate * 10) / 10,
    lifeExpectancy: Math.round(lifeExpectancy * 10) / 10,
    internetSpeed: Math.round(internetSpeed),
    tourismReceipts: Math.round(tourismReceipts),
  };
}
