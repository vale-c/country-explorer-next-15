import { pgTable, numeric, text } from "drizzle-orm/pg-core";

export const costOfLiving = pgTable("cost_of_living", {
  item: text("item").notNull(),
  country: text("country").notNull(),
  price: numeric("price").notNull(),
});

export const costOfLivingCities = pgTable("cost_of_living_cities", {
  item: text("item").notNull(),
  city: text("city").notNull(),
  price: numeric("price").notNull(),
});
