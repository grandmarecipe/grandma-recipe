export interface AmazonAffiliateProduct {
  /** Matches recipe slug(s) that should show this product. */
  recipeSlugs: string[];
  title: string;
  imageSrc: string;
  imageAlt: string;
  /** SiteStripe short link from Associates Central. */
  affiliateUrl: string;
  /** Optional blurb under the title. */
  blurb?: string;
}

/**
 * Curated Amazon Associates products mapped to recipe pages
 * (from all_website_-_amazon_afelialt.csv).
 */
export const AMAZON_AFFILIATE_PRODUCTS: AmazonAffiliateProduct[] = [
  {
    recipeSlugs: ["crockpot-hashbrown-casserole"],
    title: "Crock-Pot Cook & Carry Slow Cooker (6 qt)",
    imageSrc: "/affiliates/crock-pot-cook-carry-6qt.jpg",
    imageAlt:
      "Crock-Pot Cook & Carry programmable 6-quart slow cooker in stainless steel with glass lid",
    affiliateUrl: "https://link.amazon/B0j20qQuO",
    blurb:
      "The programmable cook & carry slow cooker we use for hashbrown casserole and other dump-and-go dinners.",
  },
  {
    recipeSlugs: ["air-fryer-zucchini-chips"],
    title: "Ninja Air Fryer XL AF150AMZ (5.5 qt)",
    imageSrc: "/affiliates/ninja-air-fryer-xl-af150.jpg",
    imageAlt: "Ninja Air Fryer XL 5.5-quart countertop air fryer",
    affiliateUrl: "https://link.amazon/B00yBFzI6",
    blurb:
      "A roomy air fryer for crisp zucchini chips and other snacks without a full oven heat-up.",
  },
  {
    recipeSlugs: ["homemade-banana-pancakes"],
    title: "Lodge Pre-Seasoned Cast Iron Skillet (8 in)",
    imageSrc: "/affiliates/lodge-cast-iron-skillet-8in.jpg",
    imageAlt: "Lodge 8-inch pre-seasoned cast iron skillet",
    affiliateUrl: "https://link.amazon/B0fL5Ji9g",
    blurb:
      "A small cast-iron skillet that holds steady heat for golden banana pancakes.",
  },
  {
    recipeSlugs: ["chocolate-coconut-cake"],
    title: "KitchenAid 5-Speed Hand Mixer (Red)",
    imageSrc: "/affiliates/kitchenaid-hand-mixer-red.jpg",
    imageAlt: "KitchenAid 5-speed hand mixer in red",
    affiliateUrl: "https://link.amazon/B00ZLb1E1",
    blurb:
      "A reliable hand mixer for cake batters, frosting, and weeknight baking projects.",
  },
  {
    recipeSlugs: [
      "fruit-pastry",
      "autumn-frost-squash-recipe",
      "chicken-tenders-recipe",
    ],
    title: "Nordic Ware Naturals Half Sheet Pans (2-pack)",
    imageSrc: "/affiliates/nordic-ware-half-sheet-pans.jpg",
    imageAlt: "Nordic Ware Naturals aluminum half sheet pans, set of two",
    affiliateUrl: "https://link.amazon/B0jefkM64",
    blurb:
      "Heavy aluminum half sheets for pastry, cookies, and even roasting.",
  },
  {
    recipeSlugs: ["easy-chicken-recipes", "broasted-chicken"],
    title: "TempPro TP19H Instant-Read Thermometer",
    imageSrc: "/affiliates/temppro-tp19h-thermometer.jpg",
    imageAlt: "TempPro TP19H digital instant-read meat thermometer in orange",
    affiliateUrl: "https://link.amazon/B080gDK8w",
    blurb:
      "Quick temp checks so chicken hits a safe, juicy finish every time.",
  },
  {
    recipeSlugs: ["how-to-cook-jasmine-rice"],
    title: "Aroma Digital Rice Cooker (8 cups cooked)",
    imageSrc: "/affiliates/aroma-digital-rice-cooker.jpg",
    imageAlt: "Aroma digital rice cooker for up to 8 cups cooked rice",
    affiliateUrl: "https://link.amazon/B0056yEcz",
    blurb:
      "Set-it-and-forget-it jasmine rice with a keep-warm finish.",
  },
  {
    recipeSlugs: ["falafel-bowl"],
    title: "Cuisinart Mini Food Processor (3 cup)",
    imageSrc: "/affiliates/cuisinart-mini-food-processor.jpg",
    imageAlt: "Cuisinart 3-cup mini food processor",
    affiliateUrl: "https://link.amazon/B0gFsbxCq",
    blurb:
      "A compact processor for chickpea mixtures, herbs, and bowl toppings.",
  },
  {
    recipeSlugs: ["navy-beans", "beef-knuckle"],
    title: "Lodge Enameled Dutch Oven (6 qt, blue)",
    imageSrc: "/affiliates/lodge-enameled-dutch-oven-6qt.jpg",
    imageAlt: "Lodge 6-quart enameled cast iron Dutch oven in blue",
    affiliateUrl: "https://link.amazon/B02iWcpQM",
    blurb:
      "A sturdy Dutch oven for simmering beans and other one-pot dinners.",
  },
  {
    recipeSlugs: ["ritz-cracker-chicken-casserole"],
    title: "OXO Glass Baking Dish with Lid (9 × 13 in)",
    imageSrc: "/affiliates/oxo-glass-baking-dish-9x13.jpg",
    imageAlt: "OXO 9 by 13 inch glass baking dish with lid",
    affiliateUrl: "https://link.amazon/B071Ywz8S",
    blurb:
      "A 9×13 glass dish with a lid for casseroles you can bake, chill, and reheat.",
  },
  {
    recipeSlugs: ["chocolate-chip-banana-bread"],
    title: "USA Pan Nonstick Loaf Pan (1 lb)",
    imageSrc: "/affiliates/usa-pan-loaf-pan-1lb.jpg",
    imageAlt: "USA Pan nonstick 1-pound loaf pan",
    affiliateUrl: "https://link.amazon/B0c8WN0Uk",
    blurb:
      "A sturdy loaf pan that releases banana bread cleanly.",
  },
  {
    recipeSlugs: ["creamy-cucumber-salad"],
    title: "OXO Good Grips Handheld Mandoline",
    imageSrc: "/affiliates/oxo-handheld-mandoline.jpg",
    imageAlt: "OXO Good Grips handheld mandoline slicer",
    affiliateUrl: "https://link.amazon/B00bgj8Hn",
    blurb:
      "Even cucumber slices for creamy salads without a bulky slicer.",
  },
  {
    recipeSlugs: ["star-cake"],
    title: "Microplane Classic Zester Grater (Black)",
    imageSrc: "/affiliates/microplane-classic-zester.jpg",
    imageAlt: "Microplane Classic zester grater in black",
    affiliateUrl: "https://link.amazon/B0370iWQA",
    blurb:
      "Fine zest for cake batters, frostings, and finishing sugar.",
  },
  {
    recipeSlugs: ["rice-stick-noodles"],
    title: "Yosukata Carbon Steel Wok (13.5 in)",
    imageSrc: "/affiliates/yosukata-carbon-steel-wok.jpg",
    imageAlt: "Yosukata 13.5-inch pre-seasoned carbon steel wok",
    affiliateUrl: "https://link.amazon/B03KDQr5t",
    blurb:
      "A flat-bottom carbon steel wok for stir-fried noodles and high-heat sides.",
  },
  {
    recipeSlugs: ["what-is-a-light-roast-coffee"],
    title: "OXO Good Grips Digital Food Scale (11 lb)",
    imageSrc: "/affiliates/oxo-digital-food-scale.jpg",
    imageAlt: "OXO Good Grips digital food scale, 11 pound capacity",
    affiliateUrl: "https://link.amazon/B09YMT26p",
    blurb:
      "Weigh beans and water for consistent light-roast brews.",
  },
  {
    recipeSlugs: ["what-is-a-light-roast-coffee"],
    title: "OXO Brew 8-Cup Coffee Maker (Silver)",
    imageSrc: "/affiliates/oxo-brew-8-cup-coffee-maker.jpg",
    imageAlt: "OXO Brew 8-cup drip coffee maker in silver",
    affiliateUrl: "https://link.amazon/B0h5HrNsF",
    blurb:
      "An automatic drip option when you want a full pot of light roast.",
  },
  {
    recipeSlugs: ["what-is-a-light-roast-coffee"],
    title: "Baratza Encore ESP Burr Grinder (Black)",
    imageSrc: "/affiliates/baratza-encore-esp-grinder.jpg",
    imageAlt: "Baratza Encore ESP burr coffee grinder in black",
    affiliateUrl: "https://link.amazon/B08izm0LS",
    blurb:
      "A burr grinder so light-roast beans stay fresh and evenly ground.",
  },
  {
    recipeSlugs: ["brioche-loaf"],
    title: "Cuisinart Precision Master Stand Mixer (5.5 qt)",
    imageSrc: "/affiliates/cuisinart-precision-stand-mixer.jpg",
    imageAlt: "Cuisinart Precision Master 5.5-quart stand mixer",
    affiliateUrl: "https://link.amazon/B04bjFriL",
    blurb:
      "A stand mixer that handles enriched doughs like brioche with less arm work.",
  },
  {
    recipeSlugs: ["pumpkin-soup"],
    title: "Vitamix Immersion Blender Bundle (3-piece)",
    imageSrc: "/affiliates/vitamix-immersion-blender-bundle.jpg",
    imageAlt: "Vitamix immersion blender 3-piece bundle",
    affiliateUrl: "https://link.amazon/B07S7VSB4",
    blurb:
      "Blend pumpkin soup smooth right in the pot.",
  },
  {
    recipeSlugs: ["french-onion-chicken"],
    title: "Instant Pot Duo Plus Pressure Cooker (8 qt)",
    imageSrc: "/affiliates/instant-pot-duo-plus-8qt.jpg",
    imageAlt: "Instant Pot Duo Plus 8-quart multi-use pressure cooker",
    affiliateUrl: "https://link.amazon/B07bVtiTe",
    blurb:
      "An 8-quart multi-cooker for weeknight chicken dinners and broth-rich meals.",
  },
  {
    recipeSlugs: ["easy-low-calorie-meals"],
    title: "Tramontina Professional Nonstick Skillet (12 in)",
    imageSrc: "/affiliates/tramontina-nonstick-skillet-12in.jpg",
    imageAlt: "Tramontina Professional 12-inch nonstick skillet",
    affiliateUrl: "https://link.amazon/B0ftyS93G",
    blurb:
      "A 12-inch nonstick skillet that gives chicken and vegetables room to brown in a single layer.",
  },
  {
    recipeSlugs: ["coleslaw-dressing-recipe"],
    title: "OXO Good Grips Stainless Steel Whisk (9 in)",
    imageSrc: "/affiliates/oxo-stainless-whisk-9in.jpg",
    imageAlt: "OXO Good Grips 9-inch stainless steel whisk",
    affiliateUrl: "https://link.amazon/B0izYRQFs",
    blurb:
      "A small whisk for blending mayonnaise and vinegar into a smooth coleslaw dressing.",
  },
  {
    recipeSlugs: ["rice-paper"],
    title: "DS. Distinctive Style Steamer Rack (8.5 in)",
    imageSrc: "/affiliates/ds-steamer-rack-85in.jpg",
    imageAlt:
      "DS Distinctive Style 8.5-inch stainless steel steamer rack with removable legs",
    affiliateUrl: "https://link.amazon/B0cbJLFrA",
    blurb:
      "Keeps the cloth above simmering water for homemade rice paper. Make sure your pot is wider than the rack.",
  },
  {
    recipeSlugs: ["pumpkin-pie-recipe"],
    title: "OXO Good Grips Glass Pie Plate (9 in)",
    imageSrc: "/affiliates/oxo-glass-pie-plate-9in.jpg",
    imageAlt: "OXO Good Grips 9-inch glass pie plate",
    affiliateUrl: "https://link.amazon/B00FUWh7R",
    blurb:
      "A 9-inch glass plate for baking pumpkin pie and checking how the crust is browning.",
  },
  {
    recipeSlugs: ["white-rice-recipe"],
    title: "Cuisinart Chef's Classic Saucepan (3 qt)",
    imageSrc: "/affiliates/cuisinart-classic-saucepan-3qt.jpg",
    imageAlt: "Cuisinart Chef's Classic 3-quart saucepan with lid",
    affiliateUrl: "https://link.amazon/B06eOqRb5",
    blurb:
      "A lidded saucepan for simmering rice and holding steam during the covered rest.",
  },
  {
    recipeSlugs: ["apple-crumble-recipe"],
    title: "OXO Good Grips Apple Slicer and Corer",
    imageSrc: "/affiliates/oxo-apple-slicer-corer.jpg",
    imageAlt: "OXO Good Grips apple slicer and corer",
    affiliateUrl: "https://link.amazon/B03ucFjJc",
    blurb:
      "Core apples and cut them into wedges in one pass, then slice thinner for the crumble.",
  },
];

export function getAmazonAffiliateProductsForRecipe(
  slug: string,
): AmazonAffiliateProduct[] {
  return AMAZON_AFFILIATE_PRODUCTS.filter((product) =>
    product.recipeSlugs.includes(slug),
  );
}
