import { CATEGORY_SEO } from "./page-seo";
import type { CategorySlug } from "./types";

export type IntroPart =
  | string
  | {
      text: string;
      slug: string;
    };

export interface CategoryPick {
  title: string;
  slug: string;
}

export interface CategoryContent {
  slug: CategorySlug;
  seoDescription: string;
  intro: IntroPart[];
  picks: CategoryPick[];
}

export const CATEGORY_CONTENT: Record<CategorySlug, CategoryContent> = {
  breakfast: {
    slug: "breakfast",
    seoDescription: CATEGORY_SEO.breakfast.description,
    intro: [
      "Start your day right with our comforting ",
      { text: "Shakshouka", slug: "shakshouka" },
      " or a fluffy ",
      { text: "Feta and Egg Omelet", slug: "feta-and-egg-recipes" },
      ". From golden ",
      { text: "Sheet Pan Pancakes", slug: "sheet-pan-pancakes" },
      " to hearty ",
      { text: "Chicken Breakfast Sausage", slug: "chicken-breakfast-sausage" },
      ", our wholesome recipes are perfect for busy mornings or lazy weekends.",
    ],
    picks: [
      { title: "Spicy Morning Shakshouka", slug: "shakshouka" },
      { title: "Feta and Egg Omelet", slug: "feta-and-egg-recipes" },
      { title: "Sheet Pan Pancakes", slug: "sheet-pan-pancakes" },
      { title: "Sorghum Flakes with Almond Milk", slug: "sorghum-flakes" },
      { title: "Chicken Breakfast Sausage", slug: "chicken-breakfast-sausage" },
    ],
  },
  lunch: {
    slug: "lunch",
    seoDescription: CATEGORY_SEO.lunch.description,
    intro: [
      "Explore a variety of easy-to-make meals including sandwiches, salads, soups, and light entrées inspired by homemade cooking — like our ",
      { text: "Falafel Bowl", slug: "falafel-bowl" },
      ", ",
      { text: "Chicken Shawarma Wrap", slug: "chicken-shawarma-wrap" },
      ", or refreshing ",
      { text: "Zucchini Chips", slug: "crispy-air-fried-zucchini-chips" },
      ".",
    ],
    picks: [
      { title: "Falafel Bowl", slug: "falafel-bowl" },
      { title: "Chipotle Queso", slug: "chipotle-queso" },
      { title: "Chicken Shawarma Wrap", slug: "chicken-shawarma-wrap" },
      { title: "Crispy Chicken Burger", slug: "crispy-chicken-burger" },
      { title: "Crab Pasta Salad", slug: "crab-pasta-salad" },
    ],
  },
  dinner: {
    slug: "dinner",
    seoDescription: CATEGORY_SEO.dinner.description,
    intro: [
      "End the day with comforting dinner recipes straight from Grandma's kitchen. Discover hearty main courses like ",
      { text: "Creamy Tuscan Chicken Pasta", slug: "tuscan-chicken-pasta" },
      ", classic ",
      { text: "Cowboy Casserole", slug: "cowboy-casserole" },
      ", or easy one-pot meals such as ",
      { text: "Lobster Ravioli", slug: "lobster-ravioli" },
      " that bring warmth and flavor to your table.",
    ],
    picks: [
      { title: "Beef Medallions", slug: "beef-medallions" },
      { title: "Tomahawk Steak", slug: "tomahawk-steak" },
      { title: "Cabbage Roll Casserole", slug: "cabbage-roll-casserole" },
      { title: "Lobster Ravioli", slug: "lobster-ravioli" },
      { title: "String Beans and Potatoes", slug: "string-beans-and-potatoes" },
    ],
  },
  snacks: {
    slug: "snacks",
    seoDescription: CATEGORY_SEO.snacks.description,
    intro: [
      "Whether you're craving a little something between meals or need a quick bite to hold you over, these ",
      { text: "Veggie Chips", slug: "veggie-chips" },
      " and ",
      { text: "Tortilla Chips", slug: "tortilla-chips" },
      " are made with love and just the right touch of comfort. From crispy, savory treats to sweet bites like ",
      { text: "Homemade Granola Bars", slug: "homemade-granola-bars" },
      ", they bring back childhood memories with every crunch.",
    ],
    picks: [
      { title: "Veggie Chips", slug: "veggie-chips" },
      { title: "Tortilla Chips", slug: "tortilla-chips" },
      { title: "Homemade Granola Bars", slug: "homemade-granola-bars" },
      { title: "Air-Fried Zucchini Chips", slug: "crispy-air-fried-zucchini-chips" },
      { title: "Homemade Trail Mix", slug: "homemade-trail-mix" },
    ],
  },
  dessert: {
    slug: "dessert",
    seoDescription: CATEGORY_SEO.dessert.description,
    intro: [
      "Indulge in sweet treats and timeless dessert recipes. From rich ",
      { text: "Apple Cider Doughnut Cake", slug: "apple-cider-doughnut-cake" },
      " and fruity ",
      { text: "Blueberry Cookies", slug: "blueberry-cookies" },
      " to classic no-bake delights like ",
      { text: "No Bake Oreo Cream Pie", slug: "no-bake-oreo-cream-pie" },
      ", our dessert collection brings joy to every occasion.",
    ],
    picks: [
      { title: "Apple Cider Doughnut Cake", slug: "apple-cider-doughnut-cake" },
      { title: "Blueberry Cookies", slug: "blueberry-cookies" },
      { title: "Perfect Strawberry Jello Pie", slug: "strawberry-jello-pie" },
      { title: "Peanut Butter Lasagna", slug: "peanut-butter-lasagna" },
      { title: "Best Dubai Chocolate", slug: "dubai-chocolate" },
    ],
  },
};

export function getCategoryContent(slug: CategorySlug): CategoryContent {
  return CATEGORY_CONTENT[slug];
}
