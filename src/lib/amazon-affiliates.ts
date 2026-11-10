import type { CategorySlug } from "@/lib/types";

export interface AmazonAffiliateProduct {
  /** Matches recipe / pillar page slug(s). */
  recipeSlugs?: string[];
  /** Matches /category/{slug}/ pages. */
  categorySlugs?: CategorySlug[];
  title: string;
  imageSrc: string;
  imageAlt: string;
  /** SiteStripe short link from Associates Central. */
  affiliateUrl: string;
  /** Optional blurb under the title. */
  blurb?: string;
}

/**
 * Curated Amazon Associates products mapped to recipe, pillar, and category pages.
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
  {
    categorySlugs: ["breakfast"],
    title: "All-Clad Digital Belgian Waffle Maker (4-slice)",
    imageSrc: "/affiliates/all-clad-belgian-waffle-maker.jpg",
    imageAlt: "All-Clad digital Belgian waffle maker, 4-slice",
    affiliateUrl: "https://link.amazon/B04tjHI2J",
    blurb:
      "A sturdy waffle maker for weekend breakfasts and brunch plates.",
  },
  {
    categorySlugs: ["lunch"],
    title: "T-fal OptiGrill XL (6 servings)",
    imageSrc: "/affiliates/tfal-optigrill-xl.jpg",
    imageAlt: "T-fal OptiGrill XL indoor grill and panini press",
    affiliateUrl: "https://link.amazon/B03izSW4f",
    blurb:
      "An indoor grill for quick lunch sandwiches, panini, and weeknight plates.",
  },
  {
    categorySlugs: ["dinner"],
    title: "Le Creuset Round Enameled Dutch Oven (5.5 qt, Cerise)",
    imageSrc: "/affiliates/le-creuset-dutch-oven-55qt-cerise.jpg",
    imageAlt: "Le Creuset 5.5-quart round enameled Dutch oven in Cerise red",
    affiliateUrl: "https://link.amazon/B0fWM27xC",
    blurb:
      "A classic Dutch oven for braises, stews, and Sunday supper.",
  },
  {
    categorySlugs: ["snacks"],
    title: "Ninja Crispi Pro Glass Air Fryer (6 qt, Ash Gray)",
    imageSrc: "/affiliates/ninja-crispi-pro-glass-air-fryer.jpg",
    imageAlt: "Ninja Crispi Pro 6-quart glass air fryer in ash gray",
    affiliateUrl: "https://link.amazon/B0gfT0aug",
    blurb:
      "A glass air fryer for crisp snacks without a full oven heat-up.",
  },
  {
    categorySlugs: ["dessert"],
    title: "Ninja CREAMi XL Deluxe Gen 2 (NC601, Navy)",
    imageSrc: "/affiliates/ninja-creami-xl-deluxe-gen2.jpg",
    imageAlt: "Ninja CREAMi XL Deluxe Gen 2 frozen treat maker in navy",
    affiliateUrl: "https://link.amazon/B084YTgjk",
    blurb:
      "Turn simple bases into ice cream, sorbet, and other frozen desserts at home.",
  },
  {
    recipeSlugs: ["halloween-recipes"],
    title: "Ninja Double Oven Pro Smart XL (30.2 qt, DCT801)",
    imageSrc: "/affiliates/ninja-double-oven-pro-smart-xl.jpg",
    imageAlt: "Ninja Double Oven Pro Smart XL countertop convection oven",
    affiliateUrl: "https://link.amazon/B0cajlrmS",
    blurb:
      "Extra oven space for party trays, sheet snacks, and holiday baking.",
  },
  {
    recipeSlugs: ["bread-recipes"],
    title: "Zojirushi Home Bakery Virtuoso Plus (2 lb, BB-PDC20BA)",
    imageSrc: "/affiliates/zojirushi-home-bakery-virtuoso-plus.jpg",
    imageAlt: "Zojirushi Home Bakery Virtuoso Plus 2-pound bread maker",
    affiliateUrl: "https://link.amazon/B0h8OelyH",
    blurb:
      "A reliable bread maker for homemade loaves with less hands-on time.",
  },
  {
    recipeSlugs: ["cookie-recipes"],
    title: "KitchenAid Artisan Tilt-Head Stand Mixer (5 qt, Matte Black)",
    imageSrc: "/affiliates/kitchenaid-artisan-stand-mixer-5qt.jpg",
    imageAlt: "KitchenAid Artisan 5-quart tilt-head stand mixer in matte black",
    affiliateUrl: "https://link.amazon/B05JClOee",
    blurb:
      "A workhorse mixer for cookie dough, frosting, and holiday baking batches.",
  },
  {
    recipeSlugs: ["mexican-recipes"],
    title: "Vitamix E310 Explorian Blender (48 oz, Black)",
    imageSrc: "/affiliates/vitamix-e310-explorian-blender.jpg",
    imageAlt: "Vitamix E310 Explorian blender with 48-ounce container",
    affiliateUrl: "https://link.amazon/B01Cf0xNQ",
    blurb:
      "A powerful blender for salsa, sauces, and smooth taco-night sides.",
  },
  {
    recipeSlugs: ["fish-recipes"],
    title: "All-Clad D5 Brushed Stainless Steel Fry Pan (12 in)",
    imageSrc: "/affiliates/all-clad-d5-fry-pan-12in.jpg",
    imageAlt: "All-Clad D5 brushed stainless steel 12-inch fry pan",
    affiliateUrl: "https://link.amazon/B09difJzX",
    blurb:
      "A roomy stainless skillet for searing fish and finishing with a quick pan sauce.",
  },
  {
    recipeSlugs: ["egg-recipes"],
    title: "All-Clad D3 Stainless Steel Nonstick Fry Pan (10 in)",
    imageSrc: "/affiliates/all-clad-d3-nonstick-fry-pan-10in.jpg",
    imageAlt: "All-Clad D3 stainless steel nonstick 10-inch fry pan",
    affiliateUrl: "https://link.amazon/B0b3TVlsM",
    blurb:
      "A nonstick skillet that makes eggs, omelets, and quick breakfasts easy to release.",
  },
  {
    recipeSlugs: ["casserole-recipes"],
    title: "Le Creuset Heritage Covered Rectangular Casserole (4 qt, White)",
    imageSrc: "/affiliates/le-creuset-heritage-casserole-4qt.jpg",
    imageAlt: "Le Creuset Heritage 4-quart covered rectangular casserole in white",
    affiliateUrl: "https://link.amazon/B08kZUzoB",
    blurb:
      "A covered stoneware dish for baking, serving, and storing casseroles.",
  },
  {
    recipeSlugs: ["salad-recipes"],
    title: "Ninja Professional XL Food Processor (12 cups, NF701)",
    imageSrc: "/affiliates/ninja-professional-xl-food-processor.jpg",
    imageAlt: "Ninja Professional XL 12-cup food processor",
    affiliateUrl: "https://link.amazon/B01BwjOUl",
    blurb:
      "Slice and shred salad toppings fast with discs built for big batches.",
  },
  {
    recipeSlugs: ["slow-cooker-recipes"],
    title: "GreenPan Elite 14-in-1 Ceramic Slow Cooker (6 qt, Black)",
    imageSrc: "/affiliates/greenpan-elite-ceramic-slow-cooker.jpg",
    imageAlt: "GreenPan Elite 14-in-1 ceramic 6-quart slow cooker in black",
    affiliateUrl: "https://link.amazon/B0e3zSijo",
    blurb:
      "A programmable ceramic slow cooker for dump-and-go dinners.",
  },
  {
    recipeSlugs: ["air-fryer-recipes"],
    title: "Ninja Foodi DualZone Smart XL Air Fryer (10 qt, DZ550)",
    imageSrc: "/affiliates/ninja-foodi-dualzone-smart-xl-air-fryer.jpg",
    imageAlt: "Ninja Foodi DualZone Smart XL 10-quart air fryer",
    affiliateUrl: "https://link.amazon/B0dnKSlNh",
    blurb:
      "Two baskets so you can air-fry mains and sides at the same time.",
  },
  {
    recipeSlugs: ["easy-breakfast-recipes"],
    title: "Zojirushi Gourmet Sizzler Electric Griddle (EA-DCC10)",
    imageSrc: "/affiliates/zojirushi-gourmet-sizzler-griddle.jpg",
    imageAlt: "Zojirushi Gourmet Sizzler electric griddle",
    affiliateUrl: "https://link.amazon/B07jzyV73",
    blurb:
      "A wide electric griddle for pancakes, eggs, and big breakfast spreads.",
  },
  {
    recipeSlugs: ["easy-weeknight-dinners"],
    title: "All-Clad D3 Stainless Steel Sauté Pan with Lid (3 qt)",
    imageSrc: "/affiliates/all-clad-d3-saute-pan-3qt.jpg",
    imageAlt: "All-Clad D3 stainless steel 3-quart sauté pan with lid",
    affiliateUrl: "https://link.amazon/B09psFnLo",
    blurb:
      "A lidded sauté pan for one-pan weeknight dinners and quick sauces.",
  },
  {
    recipeSlugs: ["easy-dessert-recipes"],
    title: "GreenPan Reserve Ceramic Nonstick Bakeware Set (7 pieces, Sage Green)",
    imageSrc: "/affiliates/greenpan-reserve-bakeware-set.jpg",
    imageAlt: "GreenPan Reserve ceramic nonstick 7-piece bakeware set in sage green",
    affiliateUrl: "https://link.amazon/B00hVE3B3",
    blurb:
      "A matching bakeware set for cakes, bars, and weeknight sweets.",
  },
  {
    recipeSlugs: ["easy-soup-recipes"],
    title: "All-Clad D3 Stainless Steel Stockpot with Lid (8 qt)",
    imageSrc: "/affiliates/all-clad-d3-stockpot-8qt.jpg",
    imageAlt: "All-Clad D3 stainless steel 8-quart stockpot with lid",
    affiliateUrl: "https://link.amazon/B0983ijVz",
    blurb:
      "A deep stockpot for broths, soups, and big-batch simmering.",
  },
  {
    recipeSlugs: ["easy-rice-recipes"],
    title: "Zojirushi Neuro Fuzzy Rice Cooker and Warmer (5.5 cups, NS-ZCC10)",
    imageSrc: "/affiliates/zojirushi-neuro-fuzzy-rice-cooker.jpg",
    imageAlt: "Zojirushi Neuro Fuzzy 5.5-cup rice cooker and warmer",
    affiliateUrl: "https://link.amazon/B0e1VvtWj",
    blurb:
      "A programmable rice cooker that keeps rice fluffy and warm for the table.",
  },
];

export function getAmazonAffiliateProductsForRecipe(
  slug: string,
): AmazonAffiliateProduct[] {
  return AMAZON_AFFILIATE_PRODUCTS.filter((product) =>
    product.recipeSlugs?.includes(slug),
  );
}

export function getAmazonAffiliateProductsForCategory(
  slug: CategorySlug,
): AmazonAffiliateProduct[] {
  return AMAZON_AFFILIATE_PRODUCTS.filter((product) =>
    product.categorySlugs?.includes(slug),
  );
}
