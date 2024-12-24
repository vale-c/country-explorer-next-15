export const formatCountryName = (countryName: string): string => {
  return countryName
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const categoryMap: Record<string, { emoji: string; category: string }> =
  {
    // Restaurants 🍽️
    'meal inexpensive restaurant': { emoji: '🍽️', category: 'Restaurants' },
    'meal for 2 people mid-range restaurant threecourse': {
      emoji: '🍽️',
      category: 'Restaurants',
    },
    'mcmeal at mcdonalds or equivalent combo meal': {
      emoji: '🍔',
      category: 'Restaurants',
    },
    'cappuccino regular': {
      emoji: '☕',
      category: 'Restaurants',
    },
    'domestic beer 0.5 liter draught': {
      emoji: '🍺',
      category: 'Restaurants',
    },
    'imported beer 0.33 liter bottle': {
      emoji: '🍻',
      category: 'Restaurants',
    },
    'coke pepsi 0.33 liter bottle': {
      emoji: '🥤',
      category: 'Restaurants',
    },
    'water 0.33 liter bottle': {
      emoji: '💧',
      category: 'Restaurants',
    },

    // Markets 🛒
    'milk regular': { emoji: '🥛', category: 'Markets' },
    'bread fresh white': { emoji: '🍞', category: 'Markets' },
    'rice white': { emoji: '🍚', category: 'Markets' },
    'eggs regular': { emoji: '🥚', category: 'Markets' },
    'local cheese': { emoji: '🧀', category: 'Markets' },
    'chicken fillets': { emoji: '🍗', category: 'Markets' },
    'beef round': { emoji: '🥩', category: 'Markets' },
    apples: { emoji: '🍎', category: 'Markets' },
    banana: { emoji: '🍌', category: 'Markets' },
    oranges: { emoji: '🍊', category: 'Markets' },
    tomato: { emoji: '🍅', category: 'Markets' },
    potato: { emoji: '🥔', category: 'Markets' },
    onion: { emoji: '🧅', category: 'Markets' },
    lettuce: { emoji: '🥬', category: 'Markets' },
    'water 1.5l bottle': { emoji: '💧', category: 'Markets' },
    'water 0.33l bottle': { emoji: '💧', category: 'Markets' },
    'coke pepsi': { emoji: '🥤', category: 'Markets' },
    'domestic beer bottle': { emoji: '🍺', category: 'Markets' },
    'imported beer bottle': { emoji: '🍻', category: 'Markets' },
    'cigarettes marlboro': { emoji: '🚬', category: 'Markets' },
    'wine mid-range': { emoji: '🍷', category: 'Markets' },

    // Transportation 🚗
    'one-way ticket': { emoji: '🚌', category: 'Transportation' },
    'monthly pass': { emoji: '🎫', category: 'Transportation' },
    'taxi start': { emoji: '🚕', category: 'Transportation' },
    'taxi 1km': { emoji: '🚖', category: 'Transportation' },
    'taxi 1hour waiting': { emoji: '⏰', category: 'Transportation' },
    gasoline: { emoji: '⛽', category: 'Transportation' },

    // Utilities (Monthly) ⚡
    'basic electricity heating cooling water garbage': {
      emoji: '⚡',
      category: 'Utilities (Monthly)',
    },
    'mobile phone monthly plan with calls and 10gb data': {
      emoji: '📱',
      category: 'Utilities (Monthly)',
    },
    'internet 60 mbps': { emoji: '📶', category: 'Utilities (Monthly)' },

    // Sports And Leisure 🎯
    'fitness club': { emoji: '🏋️‍♂️', category: 'Sports And Leisure' },
    'tennis court': { emoji: '🎾', category: 'Sports And Leisure' },
    cinema: { emoji: '🎬', category: 'Sports And Leisure' },

    // Childcare 👶
    'preschool or kindergarten full day private monthly': {
      emoji: '🎓',
      category: 'Childcare',
    },
    'international primary school yearly': {
      emoji: '🏫',
      category: 'Childcare',
    },

    // Clothing And Shoes 👕
    'jeans levis': { emoji: '👖', category: 'Clothing And Shoes' },
    'summer dress chain store': { emoji: '👗', category: 'Clothing And Shoes' },
    'nike running shoes': { emoji: '👟', category: 'Clothing And Shoes' },
    'leather business shoes': { emoji: '👞', category: 'Clothing And Shoes' },

    // Rent Per Month 🏠
    'apartment 1 bedroom in city centre': {
      emoji: '🌇',
      category: 'Rent Per Month',
    },
    'apartment 1 bedroom outside of centre': {
      emoji: '🏡',
      category: 'Rent Per Month',
    },
    'apartment 3 bedrooms in city centre': {
      emoji: '🌆',
      category: 'Rent Per Month',
    },
    'apartment 3 bedrooms outside of centre': {
      emoji: '🏘️',
      category: 'Rent Per Month',
    },

    // Salaries And Financing 💰
    'average monthly net salary': {
      emoji: '💵',
      category: 'Salaries And Financing',
    },

    default: { emoji: '📍', category: 'Other' },
  };

// Priority items for cards (most important items for digital nomads)
export const PRIORITY_ITEMS = [
  {
    key: 'apartment 1 bedroom in city centre',
    label: 'Apartment (City Center)',
    emoji: '🌇',
  },
  {
    key: 'basic electricity heating cooling water garbage',
    label: 'Basic Utilities',
    emoji: '⚡',
  },
  {
    key: 'meal inexpensive restaurant',
    label: 'Meal (Restaurant)',
    emoji: '🍽️',
  },
  {
    key: 'internet 60 mbps',
    label: 'Internet (60 Mbps)',
    emoji: '📶',
  },
];

export const getPriorityItems = (
  items: { item: string; price: number }[]
): { item: string; price: number; emoji: string }[] => {
  return PRIORITY_ITEMS.map(({ key, label, emoji }) => {
    const matchingItem = items.find((i) => {
      const normalizedInput = normalize(i.item);
      const normalizedKey = normalize(key);
      return (
        normalizedInput.includes(normalizedKey) ||
        normalizedKey.includes(normalizedInput)
      );
    });

    return matchingItem
      ? { item: label, price: matchingItem.price, emoji }
      : null;
  }).filter(Boolean) as { item: string; price: number; emoji: string }[];
};

// Normalize strings for comparison
const normalize = (str: string): string =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim();

// Group items by their categories
export const groupItemsByCategory = (
  items: { item: string; price: number }[]
): Record<string, { emoji: string; item: string; price: number }[]> => {
  const grouped: Record<
    string,
    { emoji: string; item: string; price: number }[]
  > = {};

  // Ensure unique items
  const uniqueItems = items.filter(
    (item, index, self) =>
      index ===
      self.findIndex((i) => normalize(i.item) === normalize(item.item))
  );

  // Map each item to its category with more flexible matching
  uniqueItems.forEach((item) => {
    const normalizedItem = normalize(item.item);

    // Find matching category entry with more flexible matching for specific cases
    const categoryEntry = Object.entries(categoryMap).find(([key]) => {
      const normalizedKey = normalize(key);
      return (
        normalizedItem.includes(normalizedKey) ||
        normalizedKey.includes(normalizedItem) ||
        (normalizedItem.includes('mobile') &&
          normalizedItem.includes('plan') &&
          normalizedKey.includes('mobile'))
      );
    });

    if (categoryEntry) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, { emoji, category }] = categoryEntry;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push({
        emoji,
        item: item.item,
        price: item.price,
      });
    }
  });

  return grouped;
};

// Category order for display
export const categoryOrder = [
  'Rent Per Month',
  'Markets',
  'Restaurants',
  'Utilities (Monthly)',
  'Transportation',
  'Sports And Leisure',
  'Clothing And Shoes',
  'Childcare',
  'Other',
  'Salaries And Financing',
];
