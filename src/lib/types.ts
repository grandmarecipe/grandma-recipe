export type CategorySlug =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snacks"
  | "dessert";

export interface RecipeMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: CategorySlug;
  categories: CategorySlug[];
  publishedAt: string;
  modifiedAt: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  servings?: string;
  calories?: string;
  cuisine?: string;
  course?: string;
}

export interface Recipe extends RecipeMeta {
  contentHtml: string;
  ingredients: string[];
  instructions: string[];
  equipment?: string[];
  notesHtml?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface StaticPage {
  slug: string;
  title: string;
  contentHtml: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CategoryInfo {
  slug: CategorySlug;
  name: string;
  description: string;
  count: number;
  image: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: "breakfast",
    name: "Breakfast",
    description:
      "Start your day with cozy classics and quick morning favorites.",
    count: 42,
    image: "/brand/category-breakfast.webp",
  },
  {
    slug: "lunch",
    name: "Lunch",
    description: "Light, satisfying midday meals made with love.",
    count: 64,
    image: "/brand/category-lunch.webp",
  },
  {
    slug: "dinner",
    name: "Dinner",
    description: "Hearty main courses and comforting family classics.",
    count: 255,
    image: "/brand/category-dinner.webp",
  },
  {
    slug: "snacks",
    name: "Snacks",
    description: "Savory crunch and sweet bites for any time of day.",
    count: 122,
    image: "/brand/category-snacks.webp",
  },
  {
    slug: "dessert",
    name: "Dessert",
    description: "Sweet treats and timeless bakes for every occasion.",
    count: 154,
    image: "/brand/category-dessert.webp",
  },
];

export const CATEGORY_SLUGS = new Set<string>(
  CATEGORIES.map((category) => category.slug),
);

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/category/breakfast/", label: "Breakfast" },
  { href: "/category/lunch/", label: "Lunch" },
  { href: "/category/dinner/", label: "Dinner" },
  { href: "/category/snacks/", label: "Snacks" },
  { href: "/category/dessert/", label: "Dessert" },
  { href: "/about-us/", label: "About Us" },
  { href: "/contact-us/", label: "Contact Us" },
];

export const SITE = {
  name: "Grandma Recipe",
  url: "https://www.grandmarecipe.com",
  tagline: "Homestyle Recipes Made with Love",
  description:
    "Discover easy grandma recipes and vintage comfort food your family will love. Find homemade breakfast, dinner, and dessert ideas just like Grandma used to cook.",
  email: "contact@grandmarecipe.com",
  logo: "/brand/logo.webp",
  logoAlt:
    "Illustration of a smiling grandma in a chef hat and apron, holding a wooden spoon, with the text GrandmaRecipe.com below her.",
  /** Default share image for home, categories, and pages without a recipe photo */
  defaultOgImage: "/brand/grandma-millie.webp",
  sameAs: [
    "https://www.facebook.com/people/Grandma-Recipe/61584510173518/",
    "https://www.instagram.com/grandmarecipe_com/",
    "https://www.pinterest.com/grandmarecipe_com/",
    "https://www.tumblr.com/grandma-recipe",
  ],
  socialLinks: [
    {
      label: "Facebook",
      href: "https://www.facebook.com/people/Grandma-Recipe/61584510173518/",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/grandmarecipe_com/",
    },
    {
      label: "Pinterest",
      href: "https://www.pinterest.com/grandmarecipe_com/",
    },
    {
      label: "Tumblr",
      href: "https://www.tumblr.com/grandma-recipe",
    },
  ],
  author: {
    name: "Grandma Millie",
    description:
      "Grandma Millie shares homestyle recipes passed down from flour-dusted counters and handwritten cards.",
    image: "/brand/grandma-millie.webp",
  },
};
