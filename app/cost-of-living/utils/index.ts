export const formatCountryName = (countryName: string): string => {
  return countryName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const categoryMap: Record<string, { emoji: string; category: string }> =
  {
    // Housing
    "apartment 1 bedroom in city centre": { emoji: "🏙️", category: "Housing" },
    "apartment 1 bedroom outside of centre": {
      emoji: "🏡",
      category: "Housing",
    },
    "apartment 3 bedrooms in city centre": { emoji: "🏢", category: "Housing" },
    "apartment 3 bedrooms outside of centre": {
      emoji: "🏠",
      category: "Housing",
    },

    // Food & Drinks
    milk: { emoji: "🥛", category: "Food & Drinks" },
    cappuccino: { emoji: "☕", category: "Food & Drinks" },
    "bottle of wine": { emoji: "🍷", category: "Food & Drinks" },
    "meal inexpensive restaurant": { emoji: "🍽️", category: "Food & Drinks" },
    "meal for 2 people mid-range restaurant": {
      emoji: "🍷🍴",
      category: "Food & Drinks",
    },

    // Transportation
    "one-way ticket": { emoji: "🚌", category: "Transportation" },
    gasoline: { emoji: "⛽", category: "Transportation" },
    "taxi start": { emoji: "🚕", category: "Transportation" },
    "monthly pass": { emoji: "🛴", category: "Transportation" },

    // Utilities
    internet: { emoji: "🌐", category: "Utilities" },
    "basic electricity heating cooling water garbage": {
      emoji: "💡",
      category: "Utilities",
    },

    // Entertainment & Fitness
    "fitness club": { emoji: "🏋️", category: "Entertainment & Fitness" },
    "cinema international release": {
      emoji: "🎬",
      category: "Entertainment & Fitness",
    },

    // Other Costs (limited to 4 items)
    "1 pair of jeans": { emoji: "👖", category: "Other Costs" },
    "1 pair of nike running shoes": { emoji: "👟", category: "Other Costs" },
    "1 summer dress in a chain store": { emoji: "👗", category: "Other Costs" },
    "mobile phone monthly plan": { emoji: "📱", category: "Other Costs" },

    // Default
    default: { emoji: "📦", category: "Other Costs" },
  };

const getCategory = (itemName: string): { emoji: string; category: string } => {
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim();

  const normalizedItem = normalize(itemName);

  for (const key in categoryMap) {
    const normalizedKey = normalize(key);
    if (normalizedItem.includes(normalizedKey)) {
      return categoryMap[key];
    }
  }

  return categoryMap.default;
};

const PRIORITY_ITEMS = [
  { item: "Apartment (1 bedroom) in City Centre", emoji: "🏙️" },
  { item: "Meal, Inexpensive Restaurant", emoji: "🍽️" },
  {
    item: "Internet (60 Mbps or More, Unlimited Data, Cable/ADSL)",
    emoji: "🌐",
  },
  { item: "One-way Ticket (Local Transport)", emoji: "🚌" },
];

export const getPriorityItems = (
  items: { item: string; price: number }[]
): { item: string; price: number; emoji: string }[] => {
  return PRIORITY_ITEMS.map(({ item, emoji }) => {
    const matchingItem = items.find((i) => i.item === item);
    return matchingItem ? { ...matchingItem, emoji } : null;
  }).filter(Boolean) as { item: string; price: number; emoji: string }[];
};

export const groupItemsByCategory = (
  items: { item: string; price: number }[]
): Record<string, { emoji: string; item: string; price: number }[]> => {
  const grouped: Record<
    string,
    { emoji: string; item: string; price: number }[]
  > = {};

  const uniqueItems = items.filter(
    (item, index, self) => index === self.findIndex((i) => i.item === item.item)
  );

  uniqueItems.forEach((item) => {
    const { emoji, category } = getCategory(item.item);
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push({ emoji, item: item.item, price: item.price });
  });

  // Limit "Other Costs" to 4 items max
  if (grouped["Other Costs"]?.length > 4) {
    grouped["Other Costs"] = grouped["Other Costs"].slice(0, 4);
  }

  return grouped;
};
