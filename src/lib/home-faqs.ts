import type { FaqItem } from "@/lib/schema-data";
import { SITE } from "@/lib/types";

/** Brand-level FAQs for homepage AEO/GEO (not recipe-specific). */
export const HOME_FAQS: FaqItem[] = [
  {
    question: "Are Grandma Recipe recipes free to use?",
    answer: `Yes. Every recipe on ${SITE.name} is free to read, cook, print, and share at home. No subscription is required to follow the ingredients and instructions.`,
  },
  {
    question: "Are all these recipes kitchen-tested?",
    answer:
      "We do not claim that every recipe has been kitchen-tested. Our editorial standards focus on consistent ingredients, clear instructions, and corrections. Cooking-test details, when documented, belong on the individual recipe page. Read Our recipe standards for more.",
  },
  {
    question: "Who is Grandma Millie?",
    answer: `${SITE.author.name} is the grandmother-inspired character and welcoming voice of ${SITE.name} — sharing comfort-food recipes, family-style tips, and the little fixes that help home cooks succeed. Meet her on the About Us page.`,
  },
  {
    question: "How do recipe ratings and comments work?",
    answer:
      "Ratings and comments come from real readers after they cook. We never invent star ratings. Your feedback helps the next cook and strengthens trust on each recipe page.",
  },
  {
    question: "Are nutrition numbers exact?",
    answer:
      "No. Calories and nutrition figures are estimates for general guidance. They can vary by brand, portion size, and how you cook. We reference typical public nutrition data such as USDA FoodData Central and explain this in each recipe's kitchen notes when nutrition is listed.",
  },
  {
    question: "Does Grandma Recipe use affiliate links?",
    answer:
      "Sometimes. If you buy through an affiliate link, we may earn a small commission at no extra cost to you. Recommendations stay honest to home cooks — details are on our Affiliate Disclosure page.",
  },
];
