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
  /**
   * Optional custom soft line under Pro Tips (same affiliate URL, no product box).
   * When omitted, the first sentence of `blurb` is used.
   */
  softCta?: string;
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
    recipeSlugs: [
      "easy-chicken-recipes",
      "broasted-chicken",
      "thanksgiving-recipes",
      "thanksgiving-dinner-ideas",
      "bone-turkey-breast",
      "butterball-turkey-breast",
      "frozen-whole-turkey",
    ],
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
    recipeSlugs: [
      "ritz-cracker-chicken-casserole",
      "thanksgiving-side-dishes",
      "thanksgiving-recipes",
      "mashed-potato-casserole",
      "green-bean-casserole",
      "sweet-potato-casserole",
      "classic-stuffing",
    ],
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
    recipeSlugs: ["easy-low-calorie-meals", "cajun-chicken-turkey-sausage-pasta"],
    title: "Tramontina Professional Nonstick Skillet (12 in)",
    imageSrc: "/affiliates/tramontina-nonstick-skillet-12in.jpg",
    imageAlt: "Tramontina Professional 12-inch nonstick skillet",
    affiliateUrl: "https://link.amazon/B0ftyS93G",
    blurb:
      "A 12-inch nonstick skillet that gives chicken and vegetables room to brown in a single layer.",
    softCta:
      "A roomy skillet browns chicken and turkey sausage before the creamy Cajun sauce.",
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
    recipeSlugs: [
      "pumpkin-pie-recipe",
      "thanksgiving-desserts",
      "thanksgiving-recipes",
    ],
    title: "OXO Good Grips Glass Pie Plate (9 in)",
    imageSrc: "/affiliates/oxo-glass-pie-plate-9in.jpg",
    imageAlt: "OXO Good Grips 9-inch glass pie plate",
    affiliateUrl: "https://link.amazon/B00FUWh7R",
    blurb:
      "A 9-inch glass plate for baking pumpkin pie and checking how the crust is browning.",
    softCta: "A glass pie plate helps you check browning.",
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
    softCta:
      "A bread maker helps when you want homemade loaves with less hands-on time.",
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
  {
    recipeSlugs: ["easy-pasta-recipes"],
    title: "All-Clad Simply Strain Stainless Steel Multipot with Insert (12 qt)",
    imageSrc: "/affiliates/all-clad-simply-strain-multipot-12qt.jpg",
    imageAlt: "All-Clad Simply Strain 12-quart stainless steel multipot with strainer insert",
    affiliateUrl: "https://link.amazon/B0b6EUGfR",
    blurb:
      "A deep pasta pot with a strainer insert for boiling and draining in one step.",
  },
  {
    recipeSlugs: ["easy-beef-recipes"],
    title: "Typhur Sync Dual WiFi Meat Thermometer (2 probes)",
    imageSrc: "/affiliates/typhur-sync-dual-wifi-thermometer.jpg",
    imageAlt: "Typhur Sync Dual WiFi meat thermometer with two probes",
    affiliateUrl: "https://link.amazon/B0fZRGOZn",
    blurb:
      "Wireless probes for checking roast beef and other oven dinners without opening the door.",
  },
  {
    recipeSlugs: ["christmas-eve-recipes"],
    title: "Ninja PossibleCooker PRO 8-in-1 (8.5 qt, Sea Salt Gray)",
    imageSrc: "/affiliates/ninja-possiblecooker-pro-85qt.jpg",
    imageAlt: "Ninja PossibleCooker PRO 8.5-quart multicooker in sea salt gray",
    affiliateUrl: "https://link.amazon/B0fG1iNfT",
    blurb:
      "An 8-in-1 multicooker for holiday sides, stews, and hands-off Christmas Eve cooking.",
  },
  {
    recipeSlugs: ["christmas-recipes-for-kids"],
    title: "OXO Good Grips Cookie Press Set (14 pieces)",
    imageSrc: "/affiliates/oxo-cookie-press-set.jpg",
    imageAlt: "OXO Good Grips 14-piece cookie press set with shape discs",
    affiliateUrl: "https://link.amazon/B04pqtTef",
    blurb:
      "A cookie press with discs for shaping festive cookies kids can help decorate.",
  },
  {
    recipeSlugs: [
      "gluten-free-christmas-dinner",
      "thanksgiving-recipes",
      "thanksgiving-dinner-ideas",
      "bone-turkey-breast",
      "butterball-turkey-breast",
      "frozen-whole-turkey",
      "pineapple-glazed-turkey",
    ],
    title: "All-Clad Stainless Steel Roasting Pan with Rack (16 × 13 in)",
    imageSrc: "/affiliates/all-clad-roasting-pan-with-rack.jpg",
    imageAlt: "All-Clad stainless steel roasting pan with rack, 16 by 13 inches",
    affiliateUrl: "https://link.amazon/B068edmSB",
    blurb:
      "A roomy roasting pan with a rack for holiday mains and vegetables.",
    softCta:
      "A roasting pan with a rack helps pineapple glazed turkey brown evenly.",
  },
  {
    recipeSlugs: ["vegan-christmas-recipes"],
    title: "Cuisinart Pro Custom 11-Cup Food Processor (DLC-8SBCYP1)",
    imageSrc: "/affiliates/cuisinart-pro-custom-11cup-food-processor.jpg",
    imageAlt: "Cuisinart Pro Custom 11-cup food processor",
    affiliateUrl: "https://link.amazon/B01jXKTCb",
    blurb:
      "A sturdy processor for chopping vegetables, dips, and plant-based holiday sides.",
  },
  {
    recipeSlugs: ["christmas-mocktails"],
    title: "Smeg SKC01 Sparkling Water Maker (1 L bottle)",
    imageSrc: "/affiliates/smeg-skc01-sparkling-water-maker.jpg",
    imageAlt: "Smeg SKC01 sparkling water maker with one-liter bottle",
    affiliateUrl: "https://link.amazon/B09hVgtJ1",
    blurb:
      "Fresh sparkling water for festive mocktails without buying bottles.",
  },
  {
    recipeSlugs: ["no-bake-christmas-treats"],
    title: "Cuisinart Electric Fondue Pot (3 qt)",
    imageSrc: "/affiliates/cuisinart-electric-fondue-pot-3qt.jpg",
    imageAlt: "Cuisinart 3-quart electric fondue pot",
    affiliateUrl: "https://link.amazon/B02pcmV3i",
    blurb:
      "An electric pot for melting chocolate and setting up no-bake treat stations.",
  },
  {
    recipeSlugs: ["christmas-desserts"],
    title: "Bosch Universal Plus Stand Mixer Bundle (6.5 qt, 500 W)",
    imageSrc: "/affiliates/bosch-universal-plus-stand-mixer.jpg",
    imageAlt: "Bosch Universal Plus 6.5-quart stand mixer bundle",
    affiliateUrl: "https://link.amazon/B08m4rAgD",
    blurb:
      "A powerful mixer for holiday doughs, frostings, and dessert batters.",
  },
  {
    recipeSlugs: ["sheet-pan-christmas-dinner"],
    title: "Hestan OvenBond Tri-Ply Stainless Steel Baking Sheet Set (3 pieces)",
    imageSrc: "/affiliates/hestan-ovenbond-baking-sheet-set.jpg",
    imageAlt: "Hestan OvenBond tri-ply stainless steel baking sheet set, 3 pieces",
    affiliateUrl: "https://link.amazon/B0aLpbCCR",
    blurb:
      "Heavy sheet pans for roasting a full sheet-pan Christmas dinner.",
  },
  {
    recipeSlugs: [
      "christmas-eve-dinner",
      "thanksgiving-recipes",
      "thanksgiving-dinner-ideas",
      "bone-turkey-breast",
      "butterball-turkey-breast",
    ],
    title: "Wüsthof Classic 2-Piece Carving Set",
    imageSrc: "/affiliates/wusthof-classic-carving-set.jpg",
    imageAlt: "Wüsthof Classic carving knife and fork set",
    affiliateUrl: "https://link.amazon/B02F07CjX",
    blurb:
      "A carving knife and fork set for slicing the Christmas Eve roast cleanly at the table.",
  },
  {
    recipeSlugs: [
      "christmas-appetizers",
      "thanksgiving-appetizers",
      "thanksgiving-recipes",
    ],
    title: "Chefman Electric Warming Tray (21 × 16 in)",
    imageSrc: "/affiliates/chefman-electric-warming-tray.jpg",
    imageAlt: "Chefman electric food warming tray, 21 by 16 inches",
    affiliateUrl: "https://link.amazon/B04haGVQE",
    blurb:
      "Keeps appetizers hot through the party so trays stay ready to serve.",
  },
  {
    recipeSlugs: ["christmas-snack-ideas"],
    title: "VEVOR Countertop Popcorn Maker (8 oz, Red)",
    imageSrc: "/affiliates/vevor-countertop-popcorn-maker.jpg",
    imageAlt: "VEVOR 8-ounce red countertop popcorn maker",
    affiliateUrl: "https://link.amazon/B03ge236t",
    blurb:
      "A countertop popcorn maker for fresh holiday snack bowls in minutes.",
  },
  {
    recipeSlugs: ["christmas-brunch-ideas"],
    title: "GreenPan Elite Multi Grill & Griddle (Graphite)",
    imageSrc: "/affiliates/greenpan-elite-multi-grill-griddle.jpg",
    imageAlt: "GreenPan Elite multi grill and griddle in graphite",
    affiliateUrl: "https://link.amazon/B0asMsomu",
    blurb:
      "An electric grill and griddle for brunch pancakes, eggs, and grilled sides.",
  },
  {
    recipeSlugs: ["christmas-breakfast-ideas"],
    title: "Technivorm Moccamaster KBGV Select (10 cups, Black)",
    imageSrc: "/affiliates/technivorm-moccamaster-kbgv-select.jpg",
    imageAlt: "Technivorm Moccamaster KBGV Select 10-cup drip coffee maker in black",
    affiliateUrl: "https://link.amazon/B0aKXUARA",
    blurb:
      "A reliable drip coffee maker for a full pot of Christmas morning coffee.",
  },
  {
    recipeSlugs: ["white-rice"],
    title: "Tiger Micom Rice Cooker and Warmer (5.5 cups, JBV-A10U)",
    imageSrc: "/affiliates/tiger-micom-rice-cooker-jbv-a10u.jpg",
    imageAlt: "Tiger Micom 5.5-cup rice cooker and warmer, model JBV-A10U",
    affiliateUrl: "https://link.amazon/B0hmuGm7q",
    blurb:
      "A programmable rice cooker that keeps fluffy white rice warm for dinner.",
  },
  {
    recipeSlugs: ["rice-cooker-ratio"],
    title: "Escali Primo Digital Kitchen Scale (Royal Blue)",
    imageSrc: "/affiliates/escali-primo-digital-kitchen-scale.jpg",
    imageAlt: "Escali Primo digital kitchen scale in royal blue",
    affiliateUrl: "https://link.amazon/B0ac2vUFS",
    blurb:
      "A compact scale for weighing rice and water when dialing in cooker ratios.",
  },
  {
    recipeSlugs: ["bok-choy-recipes"],
    title: "HexClad Hybrid Nonstick Wok (12 in)",
    imageSrc: "/affiliates/hexclad-hybrid-nonstick-wok-12in.jpg",
    imageAlt: "HexClad 12-inch hybrid nonstick wok",
    affiliateUrl: "https://link.amazon/B06sHNqWh",
    blurb:
      "A hybrid wok for high-heat stir-fries with bok choy and other greens.",
  },
  {
    recipeSlugs: ["how-long-do-you-do-hard-boiled-eggs"],
    title: "Dash Deluxe Rapid Egg Cooker (12 eggs, White)",
    imageSrc: "/affiliates/dash-deluxe-rapid-egg-cooker.jpg",
    imageAlt: "Dash Deluxe rapid egg cooker for 12 eggs in white",
    affiliateUrl: "https://link.amazon/B0c4kEpbN",
    blurb:
      "An electric egg cooker for consistent hard-boiled eggs without guessing timing.",
  },
  {
    recipeSlugs: ["recipe-for-brinjal"],
    title: "Staub Cast Iron Braiser with Glass Lid (3.5 qt, Matte Black)",
    imageSrc: "/affiliates/staub-cast-iron-braiser-35qt.jpg",
    imageAlt: "Staub 3.5-quart enameled cast iron braiser with glass lid in matte black",
    affiliateUrl: "https://link.amazon/B08iPMfEX",
    blurb:
      "An enameled braiser for simmering eggplant curry and other stovetop stews.",
  },
  {
    recipeSlugs: ["baked-chicken-breast-recipes"],
    title: "USA Pan Half Sheet Pan and Oven-Safe Rack Set",
    imageSrc: "/affiliates/usa-pan-half-sheet-rack-set.jpg",
    imageAlt: "USA Pan half sheet pan with oven-safe roasting rack",
    affiliateUrl: "https://link.amazon/B08443bqa",
    blurb:
      "A half sheet pan with a rack for baking juicy chicken breasts with even heat.",
  },
  {
    recipeSlugs: ["carnitas-recipe"],
    title: "Staub Round Cast Iron Dutch Oven (5.5 qt, Matte Black)",
    imageSrc: "/affiliates/staub-round-dutch-oven-55qt-matte-black.jpg",
    imageAlt: "Staub 5.5-quart round enameled cast iron Dutch oven in matte black",
    affiliateUrl: "https://link.amazon/B0f1vVxLO",
    blurb:
      "A heavy Dutch oven for braising tender carnitas low and slow.",
  },
  {
    recipeSlugs: ["how-to-poach-an-egg"],
    title: "Eggssentials Stainless Steel Egg Poaching Pan (4 cups)",
    imageSrc: "/affiliates/eggssentials-egg-poaching-pan.jpg",
    imageAlt: "Eggssentials stainless steel 4-cup egg poaching pan",
    affiliateUrl: "https://link.amazon/B0hH9LnCV",
    blurb:
      "A stovetop poacher with four cups for neat, consistent poached eggs.",
  },
  {
    recipeSlugs: ["steak-recipes"],
    title: "Le Creuset Signature Cast Iron Skillet (11.75 in, Cerise)",
    imageSrc: "/affiliates/le-creuset-signature-skillet-1175-cerise.jpg",
    imageAlt: "Le Creuset Signature 11.75-inch enameled cast iron skillet in Cerise",
    affiliateUrl: "https://link.amazon/B03os2Qg5",
    blurb:
      "An enameled skillet that holds high heat for a deep steak sear.",
  },
  {
    recipeSlugs: ["pineapple-cake-upside"],
    title: "USA Pan Nonstick Round Cake Pan Set (9 in, 2 pieces)",
    imageSrc: "/affiliates/usa-pan-nonstick-round-cake-pan-set-9in.jpg",
    imageAlt: "USA Pan nonstick 9-inch round cake pan set, two pieces",
    affiliateUrl: "https://link.amazon/B0be1ffk7",
    blurb:
      "Two 9-inch cake pans for flipping pineapple upside-down cake cleanly.",
  },
  {
    recipeSlugs: ["caramel-popcorn"],
    title: "Great Northern Stainless Steel Stovetop Popcorn Maker (6.5 qt)",
    imageSrc: "/affiliates/great-northern-stovetop-popcorn-maker.jpg",
    imageAlt: "Great Northern 6.5-quart stainless steel stovetop popcorn maker",
    affiliateUrl: "https://link.amazon/B07QET9UU",
    blurb:
      "A stovetop popper for fresh popcorn ready to coat in caramel.",
  },
  {
    recipeSlugs: ["pumpkin-roll"],
    title: "Nordic Ware Naturals Jelly Roll Pan (15 × 10.5 in)",
    imageSrc: "/affiliates/nordic-ware-naturals-jelly-roll-pan.jpg",
    imageAlt: "Nordic Ware Naturals aluminum jelly roll pan, 15 by 10.5 inches",
    affiliateUrl: "https://link.amazon/B059LHmOe",
    blurb:
      "A jelly roll pan sized for baking and rolling a classic pumpkin roll.",
  },
  {
    recipeSlugs: ["pumpkin-muffins"],
    title: "Nordic Ware Naturals 12-Cavity Muffin Pan",
    imageSrc: "/affiliates/nordic-ware-naturals-12-cavity-muffin-pan.jpg",
    imageAlt: "Nordic Ware Naturals 12-cavity aluminum muffin pan",
    affiliateUrl: "https://link.amazon/B019XL92v",
    blurb:
      "A 12-cup muffin pan for bakery-style pumpkin muffins with even browning.",
  },
  {
    recipeSlugs: ["pumpkin-bread"],
    title: "Le Creuset Signature Cast Iron Loaf Pan (2 qt, Licorice)",
    imageSrc: "/affiliates/le-creuset-signature-loaf-pan-2qt-licorice.jpg",
    imageAlt: "Le Creuset Signature 2-quart enameled cast iron loaf pan in Licorice",
    affiliateUrl: "https://link.amazon/B08fkzMrV",
    blurb:
      "An enameled loaf pan that holds heat for moist pumpkin bread with a sturdy crust.",
  },
  {
    recipeSlugs: ["chicken-breast-in-oven"],
    title: "ThermoPro TempSpike Plus Wireless Thermometer (2 probes, 600 ft)",
    imageSrc: "/affiliates/thermopro-tempspike-plus-wireless-thermometer.jpg",
    imageAlt: "ThermoPro TempSpike Plus wireless thermometer with two probes",
    affiliateUrl: "https://link.amazon/B09Gr6W3z",
    blurb:
      "Wireless probes so oven chicken breasts hit juicy temps without opening the door.",
  },
  {
    recipeSlugs: ["how-to-medium-boil-eggs"],
    title: "Cuisinart Chef’s Classic 1.5-Qt Stainless Steel Saucepan (719-16)",
    imageSrc: "/affiliates/cuisinart-chefs-classic-saucepan-15qt.jpg",
    imageAlt: "Cuisinart Chef’s Classic 1.5-quart stainless steel saucepan",
    affiliateUrl: "https://link.amazon/B09gMBr8m",
    blurb:
      "A compact saucepan sized for simmering eggs to a medium boil.",
  },
  {
    recipeSlugs: ["bok-choy-recipe"],
    title: "Joyce Chen Professional Series 14-Inch Carbon Steel Wok",
    imageSrc: "/affiliates/joyce-chen-carbon-steel-wok-14in.jpg",
    imageAlt: "Joyce Chen Professional Series 14-inch carbon steel wok",
    affiliateUrl: "https://link.amazon/B07Yha3W1",
    blurb:
      "A carbon-steel wok for quick, high-heat bok choy stir-fries.",
  },
  {
    recipeSlugs: ["mango-ice-cream"],
    title: "Cuisinart ICE-100 1.5-Qt Compressor Ice Cream Maker",
    imageSrc: "/affiliates/cuisinart-ice-100-ice-cream-maker.jpg",
    imageAlt: "Cuisinart ICE-100 1.5-quart compressor ice cream maker",
    affiliateUrl: "https://link.amazon/B07MhdJer",
    blurb:
      "A compressor ice cream maker for churning homemade mango ice cream anytime.",
  },
  {
    recipeSlugs: ["lo-mein-noodles"],
    title: "Lodge BOLD 14-Inch Pre-Seasoned Cast Iron Wok",
    imageSrc: "/affiliates/lodge-bold-cast-iron-wok-14in.jpg",
    imageAlt: "Lodge BOLD 14-inch pre-seasoned cast iron wok",
    affiliateUrl: "https://link.amazon/B0aZiuMqS",
    blurb:
      "A deep cast-iron wok for tossing lo mein noodles over high heat.",
  },
  {
    recipeSlugs: ["crumpet"],
    title: "Norpro 3776 Stainless Steel English Muffin Rings, Set of 4",
    imageSrc: "/affiliates/norpro-english-muffin-rings-set-of-4.jpg",
    imageAlt: "Norpro stainless steel English muffin rings, set of four",
    affiliateUrl: "https://link.amazon/B07sKh59S",
    blurb:
      "Ring molds for shaping homemade crumpets on the griddle.",
  },
  {
    recipeSlugs: ["potato-recipes"],
    title: "Le Creuset Signature 3.5-Qt Cast Iron Braiser, Sea Salt",
    imageSrc: "/affiliates/le-creuset-signature-braiser-35qt-sea-salt.jpg",
    imageAlt: "Le Creuset Signature 3.5-quart cast iron braiser in Sea Salt",
    affiliateUrl: "https://link.amazon/B0d3XOG4o",
    blurb:
      "A wide braiser for roasting, simmering, and serving potato dishes.",
  },
  {
    recipeSlugs: ["red-curry-paste"],
    title: "ChefSofi Granite Mortar and Pestle Set, Gray, 2 Cups",
    imageSrc: "/affiliates/chefsofi-granite-mortar-pestle-2cup.jpg",
    imageAlt: "ChefSofi gray granite mortar and pestle set, 2 cups",
    affiliateUrl: "https://link.amazon/B0gItRUkr",
    blurb:
      "A heavy granite mortar for pounding fragrant red curry paste by hand.",
  },
  {
    recipeSlugs: ["sukiyaki"],
    title: "Duxtop 9100MC 1800W Portable Induction Cooktop, Black",
    imageSrc: "/affiliates/duxtop-9100mc-induction-cooktop.jpg",
    imageAlt: "Duxtop 9100MC 1800W portable induction cooktop in black",
    affiliateUrl: "https://link.amazon/B06biXZTO",
    blurb:
      "A portable induction burner for simmering sukiyaki at the table.",
  },
  {
    recipeSlugs: ["sunday-dinner-ideas"],
    title: "Staub 7-Qt Round Cast Iron Cocotte, Cherry",
    imageSrc: "/affiliates/staub-round-cocotte-7qt-cherry.jpg",
    imageAlt: "Staub 7-quart round cast iron cocotte in cherry",
    affiliateUrl: "https://link.amazon/B04E1ox9t",
    blurb:
      "A roomy Dutch oven for braises and one-pot Sunday dinners.",
  },
  {
    recipeSlugs: ["eclairs"],
    title: "Ateco 787 6-Piece Stainless Steel Piping Tip Set",
    imageSrc: "/affiliates/ateco-787-piping-tip-set.jpg",
    imageAlt: "Ateco 787 six-piece stainless steel piping tip set",
    affiliateUrl: "https://link.amazon/B073L8Cgp",
    blurb:
      "Piping tips for filling and finishing homemade eclairs.",
  },
  {
    recipeSlugs: ["chicken-fried-rice-recipe"],
    title: "Calphalon Premier 5-Ply Stainless Steel 13-Inch Wok",
    imageSrc: "/affiliates/calphalon-premier-stainless-wok-13in.jpg",
    imageAlt: "Calphalon Premier 5-ply stainless steel 13-inch wok",
    affiliateUrl: "https://link.amazon/B03UHA0UR",
    blurb:
      "A stainless wok with room to toss chicken fried rice without crowding.",
  },
  {
    recipeSlugs: ["brussel-sprout-recipes"],
    title: "Nordic Ware Naturals Half Sheet and Quarter Sheet Set",
    imageSrc: "/affiliates/nordic-ware-naturals-half-quarter-sheet-set.jpg",
    imageAlt: "Nordic Ware Naturals half sheet and quarter sheet pan set",
    affiliateUrl: "https://link.amazon/B0iNn9Pd1",
    blurb:
      "Sheet pans for roasting Brussels sprouts in an even single layer.",
  },
  {
    recipeSlugs: ["how-to-make-rice"],
    title: "Zojirushi NS-TSC10 5.5-Cup Micom Rice Cooker",
    imageSrc: "/affiliates/zojirushi-ns-tsc10-micom-rice-cooker.jpg",
    imageAlt: "Zojirushi NS-TSC10 5.5-cup Micom rice cooker",
    affiliateUrl: "https://link.amazon/B08J8AhOd",
    blurb:
      "A Micom rice cooker for fluffy rice with a keep-warm setting.",
  },
  {
    recipeSlugs: ["winston-soup"],
    title: "Cuisinart Chef’s Classic 8-Qt Stainless Steel Stockpot with Lid",
    imageSrc: "/affiliates/cuisinart-chefs-classic-stockpot-8qt.jpg",
    imageAlt: "Cuisinart Chef’s Classic 8-quart stainless steel stockpot with lid",
    affiliateUrl: "https://link.amazon/B09DKQ1GA",
    blurb:
      "A tall stockpot for simmering big batches of soup.",
  },
  {
    recipeSlugs: ["how-to-cook-fish"],
    title: "OXO Good Grips Slotted Stainless Steel Fish Turner",
    imageSrc: "/affiliates/oxo-slotted-fish-turner.jpg",
    imageAlt: "OXO Good Grips slotted stainless steel fish turner",
    affiliateUrl: "https://link.amazon/B0bPUf0uJ",
    blurb:
      "A flexible fish spatula for flipping delicate fillets without breaking them.",
  },
  {
    recipeSlugs: ["easy-fish-recipes-for-dinner"],
    title: "All-Clad D3 Stainless Steel 12-Inch Fry Pan",
    imageSrc: "/affiliates/all-clad-d3-fry-pan-12in.jpg",
    imageAlt: "All-Clad D3 stainless steel 12-inch fry pan",
    affiliateUrl: "https://link.amazon/B0cc5y2ES",
    blurb:
      "A wide stainless skillet for searing fish fillets for weeknight dinners.",
  },
  {
    recipeSlugs: ["smashed-potatoes"],
    title: "OXO Good Grips Stainless Steel Potato Masher",
    imageSrc: "/affiliates/oxo-stainless-potato-masher.jpg",
    imageAlt: "OXO Good Grips stainless steel potato masher",
    affiliateUrl: "https://link.amazon/B09VAxave",
    blurb:
      "A sturdy masher for crushing boiled potatoes before roasting.",
  },
  {
    recipeSlugs: ["porchetta"],
    title: "MEATER Pro Wireless Meat Thermometer, Walnut",
    imageSrc: "/affiliates/meater-pro-wireless-meat-thermometer.jpg",
    imageAlt: "MEATER Pro wireless meat thermometer with walnut finish",
    affiliateUrl: "https://link.amazon/B0gC13S5C",
    blurb:
      "A wireless probe for monitoring roast temperatures without opening the oven.",
  },
  {
    recipeSlugs: ["upside-down-pineapple"],
    title: "USA Pan 9-Inch Nonstick Round Cake Pan",
    imageSrc: "/affiliates/usa-pan-nonstick-round-cake-pan-9in.jpg",
    imageAlt: "USA Pan 9-inch nonstick round cake pan",
    affiliateUrl: "https://link.amazon/B09EZKt9K",
    blurb:
      "A nonstick round pan for flipping pineapple upside-down cake cleanly.",
  },
  {
    recipeSlugs: ["frenchs-fried"],
    title: "All-Clad 3.5-L Electric Deep Fryer with Basket and Lid",
    imageSrc: "/affiliates/all-clad-electric-deep-fryer-35l.jpg",
    imageAlt: "All-Clad 3.5-liter electric deep fryer with basket and lid",
    affiliateUrl: "https://link.amazon/B0bNtsPdi",
    blurb:
      "An electric fryer for crisp homemade French-fried onions.",
  },
  {
    recipeSlugs: ["biscotti"],
    title: "USA Pan Nonstick Aluminized Steel Biscotti Pan",
    imageSrc: "/affiliates/usa-pan-nonstick-biscotti-pan.jpg",
    imageAlt: "USA Pan nonstick aluminized steel biscotti pan",
    affiliateUrl: "https://link.amazon/B0jfYt7zi",
    blurb:
      "A long biscotti pan for shaping and baking twice-baked cookies.",
  },
  {
    recipeSlugs: ["cowboy-butter"],
    title: "OXO Good Grips Silicone Pastry Brush",
    imageSrc: "/affiliates/oxo-silicone-pastry-brush.jpg",
    imageAlt: "OXO Good Grips silicone pastry brush",
    affiliateUrl: "https://link.amazon/B063tjkW1",
    blurb:
      "A silicone brush for basting melted cowboy butter onto steaks and veggies.",
  },
  {
    recipeSlugs: ["bearnaise-sauce"],
    title: "Farberware Classic Series 2-Qt Double Boiler and Saucepan",
    imageSrc: "/affiliates/farberware-classic-double-boiler-2qt.jpg",
    imageAlt: "Farberware Classic Series 2-quart double boiler and saucepan",
    affiliateUrl: "https://link.amazon/B03en5aMe",
    blurb:
      "A double boiler for gently whisking silky béarnaise without scrambling.",
  },
  {
    recipeSlugs: ["easy-side-dish-recipes"],
    title: "OXO Good Grips 8-Inch Stainless Steel Steamer Basket",
    imageSrc: "/affiliates/oxo-stainless-steamer-basket-8in.jpg",
    imageAlt: "OXO Good Grips 8-inch stainless steel steamer basket",
    affiliateUrl: "https://link.amazon/B0hkKN8aB",
    blurb:
      "A steamer basket for quick vegetable side dishes.",
  },
  {
    recipeSlugs: ["easy-creamy-tomato-pasta-for-dinner"],
    title: "Cuisinart MultiClad Pro 5.5-Qt Triple-Ply Sauté Pan with Lid",
    imageSrc: "/affiliates/cuisinart-multiclad-pro-saute-pan-55qt.jpg",
    imageAlt: "Cuisinart MultiClad Pro 5.5-quart triple-ply sauté pan with lid",
    affiliateUrl: "https://link.amazon/B0cIEkd5A",
    blurb:
      "A deep sauté pan for simmering creamy tomato pasta sauce and tossing noodles.",
  },
  {
    recipeSlugs: ["easy-pasta-recipes-for-dinner"],
    title: "Rösle Elegance 5-L Stainless Steel Pasta Pot (13153)",
    imageSrc: "/affiliates/rosle-elegance-pasta-pot-5l.jpg",
    imageAlt: "Rösle Elegance 5-liter stainless steel pasta pot",
    affiliateUrl: "https://link.amazon/B0iVjDjZ4",
    blurb:
      "A tall pasta pot with room to boil noodles for easy weeknight dinners.",
  },
  {
    recipeSlugs: ["cauliflower-recipes"],
    title: "Ninja Crispi 4-in-1 Portable Glass Air Fryer, Mint",
    imageSrc: "/affiliates/ninja-crispi-portable-glass-air-fryer-mint.jpg",
    imageAlt: "Ninja Crispi 4-in-1 portable glass air fryer in mint",
    affiliateUrl: "https://link.amazon/B0gHb2fAF",
    blurb:
      "A glass air fryer for crisp cauliflower without heating the whole oven.",
  },
  {
    recipeSlugs: ["japanese-curry"],
    title: "Lodge 6-Qt Enameled Cast Iron Dutch Oven, Storm Blue",
    imageSrc: "/affiliates/lodge-enameled-dutch-oven-6qt-storm-blue.jpg",
    imageAlt: "Lodge 6-quart enameled cast iron Dutch oven in Storm Blue",
    affiliateUrl: "https://link.amazon/B0fAOdfDT",
    blurb:
      "A sturdy Dutch oven for simmering thick Japanese curry until tender.",
  },
  {
    recipeSlugs: ["tikka-masala"],
    title: "GreenPan Valencia Pro 5-Qt Sauté Pan with Lid",
    imageSrc: "/affiliates/greenpan-valencia-pro-saute-pan-5qt.jpg",
    imageAlt: "GreenPan Valencia Pro 5-quart ceramic nonstick sauté pan with lid",
    affiliateUrl: "https://link.amazon/B0hcIDwMy",
    blurb:
      "A deep sauté pan for building creamy tikka masala sauce and chicken.",
  },
  {
    recipeSlugs: ["chicken-francese"],
    title: "Demeyere Industry 5-Ply 11-Inch Stainless Steel Fry Pan",
    imageSrc: "/affiliates/demeyere-industry-fry-pan-11in.jpg",
    imageAlt: "Demeyere Industry 5-ply 11-inch stainless steel fry pan",
    affiliateUrl: "https://link.amazon/B0hL17s2j",
    blurb:
      "A stainless fry pan for browning chicken Francese cutlets evenly.",
  },
  {
    recipeSlugs: ["crispy-homemade-arayes"],
    title: "Lodge Pro-Grid 20 × 10.44-Inch Reversible Cast Iron Grill and Griddle",
    imageSrc: "/affiliates/lodge-pro-grid-reversible-grill-griddle.jpg",
    imageAlt: "Lodge Pro-Grid reversible cast iron grill and griddle",
    affiliateUrl: "https://link.amazon/B0crZm8Ct",
    blurb:
      "A reversible grill-griddle for crisping homemade arayes on both sides.",
  },
  {
    recipeSlugs: ["homemade-corn-casserole-recipe"],
    title: "STAUB Ceramic 13 × 9-Inch Rectangular Baking Dish, White",
    imageSrc: "/affiliates/staub-ceramic-rectangular-baking-dish-13x9-white.jpg",
    imageAlt: "Staub ceramic 13 by 9-inch rectangular baking dish in white",
    affiliateUrl: "https://link.amazon/B0f3IG1iN",
    blurb:
      "A ceramic baking dish sized for creamy homemade corn casserole.",
  },
  {
    recipeSlugs: ["how-to-cook-rice"],
    title: "CUCKOO CR-0655F 6-Cup Micom Rice Cooker and Warmer",
    imageSrc: "/affiliates/cuckoo-cr-0655f-micom-rice-cooker.jpg",
    imageAlt: "CUCKOO CR-0655F 6-cup Micom rice cooker and warmer",
    affiliateUrl: "https://link.amazon/B045JhoP6",
    blurb:
      "A Micom rice cooker that keeps fluffy rice warm after cooking.",
  },
  {
    recipeSlugs: ["how-to-cook-steak-in-a-skillet"],
    title: "Lodge Blacklock 12-Inch Lightweight Cast Iron Skillet",
    imageSrc: "/affiliates/lodge-blacklock-cast-iron-skillet-12in.jpg",
    imageAlt: "Lodge Blacklock 12-inch lightweight cast iron skillet",
    affiliateUrl: "https://link.amazon/B00fHNYGU",
    blurb:
      "A lighter cast-iron skillet for a deep steak sear on the stovetop.",
  },
  {
    recipeSlugs: ["homemade-vegetarian-lasagna-recipe"],
    title: "Le Creuset Heritage Covered Rectangular Stoneware Casserole, Oyster",
    imageSrc: "/affiliates/le-creuset-heritage-covered-casserole-oyster.jpg",
    imageAlt: "Le Creuset Heritage covered rectangular stoneware casserole in Oyster",
    affiliateUrl: "https://link.amazon/B0fsGmu6A",
    blurb:
      "A covered stoneware casserole for baking vegetarian lasagna evenly.",
  },
  {
    recipeSlugs: ["grandmas-homemade-apple-hand-pies"],
    title: "Norpro 1041 Large Dough and Dumpling Press",
    imageSrc: "/affiliates/norpro-large-dough-dumpling-press.jpg",
    imageAlt: "Norpro large dough and dumpling press for hand pies",
    affiliateUrl: "https://link.amazon/B0aqGFfRf",
    blurb:
      "A dough press for sealing neat apple hand pies quickly.",
  },
  {
    recipeSlugs: ["ground-chicken-recipes-cozy-skillet-chicken-meatballs"],
    title: "OXO Good Grips Medium Stainless Steel Cookie Scoop",
    imageSrc: "/affiliates/oxo-medium-cookie-scoop.jpg",
    imageAlt: "OXO Good Grips medium stainless steel cookie scoop",
    affiliateUrl: "https://link.amazon/B0eLMPufl",
    blurb:
      "A portion scoop for even skillet chicken meatballs every time.",
  },
  {
    recipeSlugs: ["juicy-baked-chicken-breast"],
    title: "TempPro TempTrack Leave-In Digital Meat Thermometer",
    imageSrc: "/affiliates/temppro-temptrack-leave-in-thermometer.jpg",
    imageAlt: "TempPro TempTrack leave-in digital meat thermometer",
    affiliateUrl: "https://link.amazon/B04HKzMge",
    blurb:
      "A leave-in probe so baked chicken breasts hit juicy temps without guessing.",
  },
  {
    recipeSlugs: ["how-to-cook-basmati-rice"],
    title: "AROMA CoreCoat 8-Cup Cooked Digital Rice Cooker and Steamer",
    imageSrc: "/affiliates/aroma-corecoat-digital-rice-cooker-8cup.jpg",
    imageAlt: "AROMA CoreCoat 8-cup cooked digital rice cooker and steamer",
    affiliateUrl: "https://link.amazon/B001jOSQc",
    blurb:
      "A digital rice cooker for fluffy basmati with a simple one-touch start.",
  },
  {
    recipeSlugs: ["grandmas-cozy-sweet-potato-casserole"],
    title: "STAUB Ceramic Rectangular Baking Dish Set, 2-Piece, Citron",
    imageSrc: "/affiliates/staub-ceramic-baking-dish-set-2pc-citron.jpg",
    imageAlt: "Staub ceramic rectangular baking dish set, two pieces in Citron",
    affiliateUrl: "https://link.amazon/B06ZvrE5z",
    blurb:
      "Ceramic baking dishes for sweet potato casserole from oven to table.",
  },
  {
    recipeSlugs: ["how-to-cook-brown-rice"],
    title: "Zojirushi NW-QAC10 5.5-Cup Induction Rice Cooker and Warmer",
    imageSrc: "/affiliates/zojirushi-nw-qac10-induction-rice-cooker.jpg",
    imageAlt: "Zojirushi NW-QAC10 5.5-cup induction rice cooker and warmer",
    affiliateUrl: "https://link.amazon/B05R0D312",
    blurb:
      "An induction rice cooker that handles brown rice with even heat and keep-warm.",
  },
  {
    recipeSlugs: ["best-homemade-chicken-ramen-recipe"],
    title: "Cuisinart 3-Piece Stainless Steel Fine Mesh Strainer Set",
    imageSrc: "/affiliates/cuisinart-fine-mesh-strainer-set-3pc.jpg",
    imageAlt: "Cuisinart 3-piece stainless steel fine mesh strainer set",
    affiliateUrl: "https://link.amazon/B0j7mNLuU",
    blurb:
      "Fine mesh strainers for clarifying broth and rinsing noodles for ramen.",
  },
  {
    recipeSlugs: ["grandmas-golden-wooflix-waffles"],
    title: "Cuisinart Round Classic Waffle Maker, WMR-CAP2",
    imageSrc: "/affiliates/cuisinart-round-classic-waffle-maker.jpg",
    imageAlt: "Cuisinart Round Classic waffle maker, model WMR-CAP2",
    affiliateUrl: "https://link.amazon/B041sbqLl",
    blurb:
      "A classic waffle maker for golden weekend waffles with crisp edges.",
  },
  {
    recipeSlugs: ["how-to-make-crostini"],
    title: "15 × 10-Inch Nonstick Jelly Roll Pan, Champagne Gold",
    imageSrc: "/affiliates/nonstick-jelly-roll-pan-15x10-champagne-gold.jpg",
    imageAlt: "15 by 10-inch nonstick jelly roll pan in champagne gold",
    affiliateUrl: "https://link.amazon/B0gsrvHAf",
    blurb:
      "A rimmed baking sheet for toasting crostini in an even single layer.",
  },
  {
    recipeSlugs: ["how-to-make-vegetable-stock"],
    title: "Cuisinart MultiClad Pro 12-Qt Stainless Steel Stockpot with Lid",
    imageSrc: "/affiliates/cuisinart-multiclad-pro-stockpot-12qt.jpg",
    imageAlt: "Cuisinart MultiClad Pro 12-quart stainless steel stockpot with lid",
    affiliateUrl: "https://link.amazon/B04gJp8ZU",
    blurb:
      "A tall stockpot for simmering big batches of vegetable stock.",
  },
  {
    recipeSlugs: ["how-to-roast-a-chicken"],
    title: "Viking 3-Ply Stainless Steel Roasting Pan with Rack",
    imageSrc: "/affiliates/viking-3ply-roasting-pan-with-rack.jpg",
    imageAlt: "Viking 3-ply stainless steel roasting pan with rack",
    affiliateUrl: "https://link.amazon/B0hw38fsK",
    blurb:
      "A roasting pan with a rack for chicken that browns evenly all over.",
  },
  {
    recipeSlugs: ["homemade-beef-pastrami"],
    title: "Cuisinart Kitchen Pro FS-75 Food Slicer",
    imageSrc: "/affiliates/cuisinart-kitchen-pro-food-slicer.jpg",
    imageAlt: "Cuisinart Kitchen Pro FS-75 electric food slicer",
    affiliateUrl: "https://link.amazon/B04Pl9dwC",
    blurb:
      "An electric slicer for thin, deli-style slices of homemade beef pastrami.",
  },
  {
    recipeSlugs: ["how-to-make-soup-stock"],
    title: "Instant Pot Pro Plus 6-Qt Wi-Fi Electric Pressure Cooker",
    imageSrc: "/affiliates/instant-pot-pro-plus-6qt.jpg",
    imageAlt: "Instant Pot Pro Plus 6-quart Wi-Fi electric pressure cooker",
    affiliateUrl: "https://link.amazon/B01LddgrO",
    blurb:
      "A pressure cooker for rich soup stock in a fraction of the simmer time.",
  },
  {
    recipeSlugs: ["slow-cooker-style-beef-barbacoa"],
    title: "Crock-Pot 7-Qt Programmable Countdown Slow Cooker",
    imageSrc: "/affiliates/crock-pot-7qt-programmable-countdown.jpg",
    imageAlt: "Crock-Pot 7-quart programmable countdown slow cooker",
    affiliateUrl: "https://link.amazon/B05xxcqpn",
    blurb:
      "A programmable slow cooker for tender beef barbacoa with a timer.",
  },
  {
    recipeSlugs: ["cozy-lasagna-soup"],
    title: "Lodge Essential Enamel 7.5-Qt Dutch Oven, Storm Blue",
    imageSrc: "/affiliates/lodge-essential-enamel-dutch-oven-75qt-storm-blue.jpg",
    imageAlt: "Lodge Essential Enamel 7.5-quart Dutch oven in Storm Blue",
    affiliateUrl: "https://link.amazon/B04CfUAHs",
    blurb:
      "A roomy Dutch oven for simmering cozy lasagna soup for the table.",
  },
  {
    recipeSlugs: ["chop-sandwich"],
    title: "John Boos Chop-N-Slice 18 × 12-Inch Maple Cutting Board",
    imageSrc: "/affiliates/john-boos-chop-n-slice-maple-cutting-board.jpg",
    imageAlt: "John Boos Chop-N-Slice 18 by 12-inch maple cutting board",
    affiliateUrl: "https://link.amazon/B0gIz2dIS",
    blurb:
      "A sturdy maple board for chopping sandwich fillings and slicing bread.",
  },
  {
    recipeSlugs: ["marinara-pasta"],
    title: "All-Clad D5 3-Qt Stainless Steel Saucepan with Lid",
    imageSrc: "/affiliates/all-clad-d5-saucepan-3qt.jpg",
    imageAlt: "All-Clad D5 3-quart stainless steel saucepan with lid",
    affiliateUrl: "https://link.amazon/B07CsWcbA",
    blurb:
      "A stainless saucepan for simmering marinara without scorching.",
  },
  {
    recipeSlugs: ["seaweed-salad"],
    title: "OXO Good Grips Stainless Steel 6.34-Qt Salad Spinner",
    imageSrc: "/affiliates/oxo-stainless-salad-spinner-634qt.jpg",
    imageAlt: "OXO Good Grips stainless steel 6.34-quart salad spinner",
    affiliateUrl: "https://link.amazon/B0bcpSrbi",
    blurb:
      "A salad spinner for drying greens and rinsed seaweed thoroughly.",
  },
  {
    recipeSlugs: ["smoked-sirloin-steak"],
    title: "MEATER Pro Duo Wireless Meat Thermometer, 2 Probes",
    imageSrc: "/affiliates/meater-pro-duo-wireless-thermometer.jpg",
    imageAlt: "MEATER Pro Duo wireless meat thermometer with two probes",
    affiliateUrl: "https://link.amazon/B0e9Rl2tp",
    blurb:
      "Dual wireless probes for tracking smoked sirloin without lifting the lid.",
  },
  {
    recipeSlugs: ["teriyaki-noodles-recipe"],
    title: "Cuisinart 12-Inch Stainless Steel Stir-Fry Wok with Lid, 726-30SD",
    imageSrc: "/affiliates/cuisinart-stainless-stir-fry-wok-12in.jpg",
    imageAlt: "Cuisinart 12-inch stainless steel stir-fry wok with lid",
    affiliateUrl: "https://link.amazon/B0aHWpRBh",
    blurb:
      "A stainless wok for tossing teriyaki noodles over high heat.",
  },
  {
    recipeSlugs: ["teriyaki-chicken"],
    title: "Lodge 10.5-Inch Pre-Seasoned Cast Iron Square Grill Pan",
    imageSrc: "/affiliates/lodge-cast-iron-square-grill-pan-105in.jpg",
    imageAlt: "Lodge 10.5-inch pre-seasoned cast iron square grill pan",
    affiliateUrl: "https://link.amazon/B0bpHvhMR",
    blurb:
      "A cast-iron grill pan for searing teriyaki chicken with neat grill marks.",
  },
  {
    recipeSlugs: ["pho-ha-noi"],
    title: "Cooks Standard Professional 20-Qt Stainless Steel Stockpot with Lid",
    imageSrc: "/affiliates/cooks-standard-stockpot-20qt.jpg",
    imageAlt: "Cooks Standard Professional 20-quart stainless steel stockpot with lid",
    affiliateUrl: "https://link.amazon/B0iUPi4Z9",
    blurb:
      "A tall stockpot for simmering big pots of Pho Ha Noi broth.",
  },
  {
    recipeSlugs: ["cheesecake-balls"],
    title: "Wilton Candy Melts Candy and Chocolate Melting Pot",
    imageSrc: "/affiliates/wilton-candy-melts-melting-pot.jpg",
    imageAlt: "Wilton Candy Melts candy and chocolate melting pot",
    affiliateUrl: "https://link.amazon/B09bGpVgQ",
    blurb:
      "A melting pot for coating cheesecake balls in smooth chocolate.",
  },
  {
    recipeSlugs: ["chocolate-lasagna"],
    title: "Pyrex Deep 9 × 13-Inch Glass Baking Dish with Lid",
    imageSrc: "/affiliates/pyrex-deep-9x13-glass-baking-dish-lid.jpg",
    imageAlt: "Pyrex deep 9 by 13-inch glass baking dish with lid",
    affiliateUrl: "https://link.amazon/B0hjslA7Z",
    blurb:
      "A deep glass dish for layering and chilling chocolate lasagna.",
  },
  {
    recipeSlugs: ["strawberries-cheesecake"],
    title: "Farberware 9-Inch Nonstick Springform Pan",
    imageSrc: "/affiliates/farberware-nonstick-springform-pan-9in.jpg",
    imageAlt: "Farberware 9-inch nonstick springform pan",
    affiliateUrl: "https://link.amazon/B03hP4mIc",
    blurb:
      "A springform pan for releasing strawberry cheesecake cleanly.",
  },
  {
    recipeSlugs: ["strawberry-bread"],
    title: "OXO Good Grips Nonstick Pro 1-lb Loaf Pan",
    imageSrc: "/affiliates/oxo-nonstick-pro-loaf-pan-1lb.jpg",
    imageAlt: "OXO Good Grips Nonstick Pro 1-pound loaf pan",
    affiliateUrl: "https://link.amazon/B0iN4jtJe",
    blurb:
      "A nonstick loaf pan for baking strawberry bread with easy release.",
  },
  {
    recipeSlugs: ["black-garlic-ramen"],
    title: "Lareina Ceramic Japanese Ramen Bowl Set",
    imageSrc: "/affiliates/lareina-ceramic-japanese-ramen-bowl-set.jpg",
    imageAlt: "Lareina ceramic Japanese ramen bowl set",
    affiliateUrl: "https://link.amazon/B0is5PT4f",
    blurb:
      "Deep ceramic ramen bowls for serving black garlic ramen at the table.",
  },
  {
    recipeSlugs: ["holy-cow-burgers"],
    title: "Cuisinart Cast Iron Smashed Burger Press",
    imageSrc: "/affiliates/cuisinart-cast-iron-smashed-burger-press.jpg",
    imageAlt: "Cuisinart cast iron smashed burger press",
    affiliateUrl: "https://link.amazon/B0frdE1SJ",
    blurb:
      "A cast-iron press for thin, crispy smashed burgers.",
  },
  {
    recipeSlugs: ["4-inch-cake"],
    title: "Fat Daddio’s 4 × 2-Inch Anodized Aluminum Round Cake Pan",
    imageSrc: "/affiliates/fat-daddios-round-cake-pan-4x2in.jpg",
    imageAlt: "Fat Daddio’s 4 by 2-inch anodized aluminum round cake pan",
    affiliateUrl: "https://link.amazon/B055kz6OV",
    blurb:
      "A small round pan sized for neat 4-inch layer cakes.",
  },
  {
    recipeSlugs: ["plate-short-ribs"],
    title: "ThermoPro TP20 Dual-Probe Wireless Meat Thermometer",
    imageSrc: "/affiliates/thermopro-tp20-dual-probe-thermometer.jpg",
    imageAlt: "ThermoPro TP20 dual-probe wireless meat thermometer",
    affiliateUrl: "https://link.amazon/B0eaeB3WT",
    blurb:
      "Dual probes for monitoring short ribs until they hit tender temps.",
  },
  {
    recipeSlugs: ["cheesy-ravioli"],
    title: "Marcato Atlas Ravioli Tablet",
    imageSrc: "/affiliates/marcato-atlas-ravioli-tablet.jpg",
    imageAlt: "Marcato Atlas ravioli tablet mold",
    affiliateUrl: "https://link.amazon/B0hQxHJgn",
    blurb:
      "A ravioli mold for sealing neat squares of cheesy homemade pasta.",
  },
  {
    recipeSlugs: ["blt-macaroni-salad"],
    title: "OXO Good Grips 5-Qt Stainless Steel Colander",
    imageSrc: "/affiliates/oxo-stainless-colander-5qt.jpg",
    imageAlt: "OXO Good Grips 5-quart stainless steel colander",
    affiliateUrl: "https://link.amazon/B083AITCm",
    blurb:
      "A roomy colander for draining pasta for macaroni salad.",
  },
  {
    recipeSlugs: ["mississippi-pot-roast"],
    title: "Hamilton Beach Set & Forget 6-Qt Programmable Slow Cooker",
    imageSrc: "/affiliates/hamilton-beach-set-forget-slow-cooker-6qt.jpg",
    imageAlt: "Hamilton Beach Set & Forget 6-quart programmable slow cooker",
    affiliateUrl: "https://link.amazon/B0bFfHBZZ",
    blurb:
      "A programmable slow cooker for tender Mississippi pot roast.",
  },
  {
    recipeSlugs: ["keto-chicken-parmesan"],
    title: "Zyliss Classic Rotary Cheese Grater",
    imageSrc: "/affiliates/zyliss-classic-rotary-cheese-grater.jpg",
    imageAlt: "Zyliss Classic rotary cheese grater",
    affiliateUrl: "https://link.amazon/B0ivu5hdZ",
    blurb:
      "A rotary grater for fresh Parmesan over chicken cutlets.",
  },
  {
    recipeSlugs: ["blt-pasta-salad"],
    title: "OXO Good Grips 3-Piece Mixing Bowl Set",
    imageSrc: "/affiliates/oxo-3-piece-mixing-bowl-set.jpg",
    imageAlt: "OXO Good Grips 3-piece mixing bowl set",
    affiliateUrl: "https://link.amazon/B02yCZiU0",
    blurb:
      "Nesting bowls for tossing pasta salad and prepping toppings.",
  },
  {
    recipeSlugs: ["kfc-coleslaw-copycat"],
    title: "Ninja Professional Plus 9-Cup Food Processor, BN601",
    imageSrc: "/affiliates/ninja-professional-plus-food-processor-bn601.jpg",
    imageAlt: "Ninja Professional Plus 9-cup food processor, model BN601",
    affiliateUrl: "https://link.amazon/B04aHBV1I",
    blurb:
      "A food processor for finely shredding cabbage for creamy coleslaw.",
  },
  {
    recipeSlugs: ["air-fryer-nachos"],
    title: "Instant Vortex Plus ClearCook 6-Qt Air Fryer",
    imageSrc: "/affiliates/instant-vortex-plus-clearcook-air-fryer-6qt.jpg",
    imageAlt: "Instant Vortex Plus ClearCook 6-quart air fryer",
    affiliateUrl: "https://link.amazon/B0cKHp9Zv",
    blurb:
      "A ClearCook air fryer for melting nacho cheese without soggy chips.",
  },
  {
    recipeSlugs: ["air-fryer-chips"],
    title: "OXO Good Grips Chef’s Mandoline 2.0",
    imageSrc: "/affiliates/oxo-chefs-mandoline-2.jpg",
    imageAlt: "OXO Good Grips Chef’s Mandoline 2.0",
    affiliateUrl: "https://link.amazon/B0gUhS96E",
    blurb:
      "A mandoline for even potato slices that crisp in the air fryer.",
  },
  {
    recipeSlugs: ["homemade-alfredo-sauce"],
    title: "Made In 2-Qt Stainless Clad Saucier",
    imageSrc: "/affiliates/made-in-stainless-clad-saucier-2qt.jpg",
    imageAlt: "Made In 2-quart stainless clad saucier",
    affiliateUrl: "https://link.amazon/B0amRW0Pd",
    blurb:
      "A rounded saucier for whisking silky homemade Alfredo without scorching.",
  },
  {
    recipeSlugs: ["chili-cheese-tater-tot-casserole"],
    title: "Emile Henry Modern Classics 13 × 9-Inch Rectangular Baker",
    imageSrc: "/affiliates/emile-henry-modern-classics-rectangular-baker.jpg",
    imageAlt: "Emile Henry Modern Classics 13 by 9-inch rectangular baker",
    affiliateUrl: "https://link.amazon/B0eddSlBk",
    blurb:
      "A ceramic baker for chili cheese tater tot casserole from oven to table.",
  },
  {
    recipeSlugs: ["cheese-ball-bites"],
    title: "OXO Good Grips Small Cookie Scoop",
    imageSrc: "/affiliates/oxo-small-cookie-scoop.jpg",
    imageAlt: "OXO Good Grips Small Cookie Scoop",
    affiliateUrl: "https://link.amazon/B0erEiqGf",
    blurb: "A small scoop for even cheese ball bites.",
    softCta: "A small scoop for even cheese ball bites.",
  },
  {
    recipeSlugs: ["better-than-sex-cake"],
    title: "M MCIRCO 8-Piece Deep Glass Baking Dish Set with Lids, Gray",
    imageSrc: "/affiliates/mcirco-8pc-deep-glass-baking-dish-set.jpg",
    imageAlt: "M MCIRCO 8-Piece Deep Glass Baking Dish Set with Lids, Gray",
    affiliateUrl: "https://link.amazon/B0bow5hfN",
    blurb: "A deep glass bakeware set for layered poke cakes and covered leftovers.",
    softCta: "A deep glass bakeware set for layered poke cakes and covered leftovers.",
  },
  {
    recipeSlugs: ["peanut-butter-oatmeal-chocolate-chip-cookies"],
    title: "Silpat Premium Nonstick Silicone Half Sheet Baking Mat",
    imageSrc: "/affiliates/silpat-premium-half-sheet-baking-mat.jpg",
    imageAlt: "Silpat Premium Nonstick Silicone Half Sheet Baking Mat",
    affiliateUrl: "https://link.amazon/B0gGForju",
    blurb: "A reusable silicone mat for even cookie browning without parchment every time.",
    softCta: "A reusable silicone mat for even cookie browning without parchment every time.",
  },
  {
    recipeSlugs: ["air-fryer-mozzarella-sticks"],
    title: "Ninja Air Fryer Max XL, 5.5 Qt",
    imageSrc: "/affiliates/ninja-air-fryer-max-xl-55qt.jpg",
    imageAlt: "Ninja Air Fryer Max XL, 5.5 Qt",
    affiliateUrl: "https://link.amazon/B051qPRyp",
    blurb: "A roomy air fryer for crisp mozzarella sticks without a deep fryer.",
    softCta: "A roomy air fryer for crisp mozzarella sticks without a deep fryer.",
  },
  {
    recipeSlugs: ["strawberry-brownies"],
    title: "Wilton Recipe Right Nonstick 8-Inch Square Baking Pan",
    imageSrc: "/affiliates/wilton-recipe-right-8in-square-pan.jpg",
    imageAlt: "Wilton Recipe Right Nonstick 8-Inch Square Baking Pan",
    affiliateUrl: "https://link.amazon/B09PVGyXx",
    blurb: "An 8-inch square pan for brownies with clean edges and easy release.",
    softCta: "An 8-inch square pan for brownies with clean edges and easy release.",
  },
  {
    recipeSlugs: ["keto-egg-roll-in-a-bowl"],
    title: "GreenPan Valencia Pro 12-Inch Ceramic Nonstick Wok with Lid",
    imageSrc: "/affiliates/greenpan-valencia-pro-wok-12in.jpg",
    imageAlt: "GreenPan Valencia Pro 12-Inch Ceramic Nonstick Wok with Lid",
    affiliateUrl: "https://link.amazon/B0gYDCcKL",
    blurb: "A nonstick wok for quick egg-roll-in-a-bowl stir-fries.",
    softCta: "A nonstick wok for quick egg-roll-in-a-bowl stir-fries.",
  },
  {
    recipeSlugs: ["samoa-cheesecake"],
    title: "Nordic Ware 9-Inch Nonstick Springform Pan",
    imageSrc: "/affiliates/nordic-ware-9in-nonstick-springform.jpg",
    imageAlt: "Nordic Ware 9-Inch Nonstick Springform Pan",
    affiliateUrl: "https://link.amazon/B0hKJgaxw",
    blurb: "A 9-inch springform for releasing Samoa cheesecake cleanly.",
    softCta: "A 9-inch springform for releasing Samoa cheesecake cleanly.",
  },
  {
    recipeSlugs: ["turtle-cheesecake"],
    title: "HIWARE 9-Inch Nonstick Cheesecake Pan with Removable Bottom",
    imageSrc: "/affiliates/hiware-9in-nonstick-cheesecake-pan.jpg",
    imageAlt: "HIWARE 9-Inch Nonstick Cheesecake Pan with Removable Bottom",
    affiliateUrl: "https://link.amazon/B09X8PqH5",
    blurb: "A removable-bottom pan for neat Turtle cheesecake slices.",
    softCta: "A removable-bottom pan for neat Turtle cheesecake slices.",
  },
  {
    recipeSlugs: ["chocolate-depression-cake"],
    title: "USA Pan American Bakeware Classics 8-Inch Square Cake and Brownie Pan",
    imageSrc: "/affiliates/usa-pan-8in-square-cake-brownie-pan.jpg",
    imageAlt: "USA Pan American Bakeware Classics 8-Inch Square Cake and Brownie Pan",
    affiliateUrl: "https://link.amazon/B0iKZYIvG",
    blurb: "An 8-inch square pan for Depression cake with sturdy browning.",
    softCta: "An 8-inch square pan for Depression cake with sturdy browning.",
  },
  {
    recipeSlugs: ["macaroni-and-cheese"],
    title: "All-Clad D3 3-Qt Stainless Steel Saucepan with Lid",
    imageSrc: "/affiliates/all-clad-d3-saucepan-3qt-lid.jpg",
    imageAlt: "All-Clad D3 3-Qt Stainless Steel Saucepan with Lid",
    affiliateUrl: "https://link.amazon/B01lkSwtJ",
    blurb: "A 3-quart saucepan for creamy stovetop mac and cheese.",
    softCta: "A 3-quart saucepan for creamy stovetop mac and cheese.",
  },
  {
    recipeSlugs: ["pineapple-delight"],
    title: "Nordic Ware Naturals 9 × 13-Inch Aluminum Cake Pan with Lid",
    imageSrc: "/affiliates/nordic-ware-naturals-9x13-cake-pan-lid.jpg",
    imageAlt: "Nordic Ware Naturals 9 × 13-Inch Aluminum Cake Pan with Lid",
    affiliateUrl: "https://link.amazon/B0gQntUDu",
    blurb: "A covered 9×13 pan for chilled pineapple delight.",
    softCta: "A covered 9×13 pan for chilled pineapple delight.",
  },
  {
    recipeSlugs: ["crack-chicken-sliders"],
    title: "Emile Henry Modern Classics 13 × 9-Inch Ceramic Baker, Rouge",
    imageSrc: "/affiliates/emile-henry-modern-classics-baker-rouge.jpg",
    imageAlt: "Emile Henry Modern Classics 13 × 9-Inch Ceramic Baker, Rouge",
    affiliateUrl: "https://link.amazon/B0aQkFkfs",
    blurb: "A ceramic baker for warm crack chicken sliders from oven to table.",
    softCta: "A ceramic baker for warm crack chicken sliders from oven to table.",
  },
  {
    recipeSlugs: ["crack-chicken-penne"],
    title: "Cuisinart Chef’s Classic 5.5-Qt Stainless Steel Sauté Pan with Lid",
    imageSrc: "/affiliates/cuisinart-chefs-classic-saute-55qt.jpg",
    imageAlt: "Cuisinart Chef’s Classic 5.5-Qt Stainless Steel Sauté Pan with Lid",
    affiliateUrl: "https://link.amazon/B0euVMEt4",
    blurb: "A deep sauté pan for simmering crack chicken penne in one pot.",
    softCta: "A deep sauté pan for simmering crack chicken penne in one pot.",
  },
  {
    recipeSlugs: ["cucumber-bites"],
    title: "Benriner 64 mm Japanese Mandoline Slicer",
    imageSrc: "/affiliates/benriner-64mm-japanese-mandoline.jpg",
    imageAlt: "Benriner 64 mm Japanese Mandoline Slicer",
    affiliateUrl: "https://link.amazon/B00yr8vhT",
    blurb: "A mandoline for even cucumber slices for bite-sized appetizers.",
    softCta: "A mandoline for even cucumber slices for bite-sized appetizers.",
  },
  {
    recipeSlugs: ["butterfinger-puppy-chow"],
    title: "OXO Good Grips 3-Piece Plastic Mixing Bowl Set with Multicolor Handles",
    imageSrc: "/affiliates/oxo-3pc-plastic-mixing-bowl-set-multicolor.jpg",
    imageAlt: "OXO Good Grips 3-Piece Plastic Mixing Bowl Set with Multicolor Handles",
    affiliateUrl: "https://link.amazon/B0dxeDdtz",
    blurb: "Nesting bowls for tossing puppy chow without the mess.",
    softCta: "Nesting bowls for tossing puppy chow without the mess.",
  },
  {
    recipeSlugs: ["pretzel-bites-with-cheese"],
    title: "Made In 2-Qt Stainless Clad Saucepan with Lid, Antique Brass Handle",
    imageSrc: "/affiliates/made-in-2qt-saucepan-antique-brass.jpg",
    imageAlt: "Made In 2-Qt Stainless Clad Saucepan with Lid, Antique Brass Handle",
    affiliateUrl: "https://link.amazon/B0hzOlt96",
    blurb: "A small saucepan for smooth cheese dip for pretzel bites.",
    softCta: "A small saucepan for smooth cheese dip for pretzel bites.",
  },
  {
    recipeSlugs: ["not-yo-mamas-banana-pudding"],
    title: "Libbey Selene 9-Inch Glass Trifle Bowl",
    imageSrc: "/affiliates/libbey-selene-9in-glass-trifle-bowl.jpg",
    imageAlt: "Libbey Selene 9-Inch Glass Trifle Bowl",
    affiliateUrl: "https://link.amazon/B05oCHhZ9",
    blurb: "A clear trifle bowl for layered banana pudding.",
    softCta: "A clear trifle bowl for layered banana pudding.",
  },
  {
    recipeSlugs: ["chicken-pot-pie-hand-pies"],
    title: "Prepworks 3-Piece Dough Press Set",
    imageSrc: "/affiliates/prepworks-3pc-dough-press-set.jpg",
    imageAlt: "Prepworks 3-Piece Dough Press Set",
    affiliateUrl: "https://link.amazon/B0eIW0zGS",
    blurb: "Dough presses for sealing neat chicken pot pie hand pies.",
    softCta: "Dough presses for sealing neat chicken pot pie hand pies.",
  },
  {
    recipeSlugs: ["chocolate-mayonnaise-cake"],
    title: "Cuisinart 9-Speed Electric Hand Mixer with Storage Case",
    imageSrc: "/affiliates/cuisinart-9speed-hand-mixer-storage.jpg",
    imageAlt: "Cuisinart 9-Speed Electric Hand Mixer with Storage Case",
    affiliateUrl: "https://link.amazon/B0bVwLtlH",
    blurb: "A hand mixer for cake batter and frosting with tidy storage.",
    softCta: "A hand mixer for cake batter and frosting with tidy storage.",
  },
  {
    recipeSlugs: ["slow-cooker-chicken-stroganoff"],
    title: "Crock-Pot 4-Qt Manual Slow Cooker",
    imageSrc: "/affiliates/crock-pot-4qt-manual-slow-cooker.jpg",
    imageAlt: "Crock-Pot 4-Qt Manual Slow Cooker",
    affiliateUrl: "https://link.amazon/B0b4Hn20x",
    blurb: "A compact slow cooker for creamy chicken stroganoff.",
    softCta: "A compact slow cooker for creamy chicken stroganoff.",
  },
  {
    recipeSlugs: ["chocolate-pistachio-bundt-cake"],
    title: "Nordic Ware Heritage Bundt Pan",
    imageSrc: "/affiliates/nordic-ware-heritage-bundt-pan.jpg",
    imageAlt: "Nordic Ware Heritage Bundt Pan",
    affiliateUrl: "https://link.amazon/B07OFXfHV",
    blurb: "A detailed Bundt pan for chocolate pistachio cakes with crisp edges.",
    softCta: "A detailed Bundt pan for chocolate pistachio cakes with crisp edges.",
  },
  {
    recipeSlugs: ["7up-bundt-cake"],
    title: "Nordic Ware Anniversary Bundt Pan",
    imageSrc: "/affiliates/nordic-ware-anniversary-bundt-pan.jpg",
    imageAlt: "Nordic Ware Anniversary Bundt Pan",
    affiliateUrl: "https://link.amazon/B0iDsrUis",
    blurb: "A classic Bundt pan for tall 7UP cakes.",
    softCta: "A classic Bundt pan for tall 7UP cakes.",
  },
  {
    recipeSlugs: ["oreo-bundt-cake"],
    title: "Nordic Ware Blossom Bundt Pan",
    imageSrc: "/affiliates/nordic-ware-blossom-bundt-pan.jpg",
    imageAlt: "Nordic Ware Blossom Bundt Pan",
    affiliateUrl: "https://link.amazon/B01RGARUa",
    blurb: "A blossom Bundt pan for Oreo cakes with a pretty release.",
    softCta: "A blossom Bundt pan for Oreo cakes with a pretty release.",
  },
  {
    recipeSlugs: ["lemon-bundt-cake"],
    title: "Nordic Ware Brilliance Bundt Pan, 10 Cup",
    imageSrc: "/affiliates/nordic-ware-brilliance-bundt-pan-10cup.jpg",
    imageAlt: "Nordic Ware Brilliance Bundt Pan, 10 Cup",
    affiliateUrl: "https://link.amazon/B0av09X6u",
    blurb: "A 10-cup Brilliance Bundt for lemon cakes with sharp detail.",
    softCta: "A 10-cup Brilliance Bundt for lemon cakes with sharp detail.",
  },
  {
    recipeSlugs: ["cherry-cake"],
    title: "OXO Good Grips Cherry and Olive Pitter",
    imageSrc: "/affiliates/oxo-cherry-olive-pitter.jpg",
    imageAlt: "OXO Good Grips Cherry and Olive Pitter",
    affiliateUrl: "https://link.amazon/B02dRJDeA",
    blurb: "A cherry pitter that speeds prep for cherry cake.",
    softCta: "A cherry pitter that speeds prep for cherry cake.",
  },
  {
    recipeSlugs: ["summer-corn-salad"],
    title: "OXO Good Grips Corn Prep Peeler",
    imageSrc: "/affiliates/oxo-corn-prep-peeler.jpg",
    imageAlt: "OXO Good Grips Corn Prep Peeler",
    affiliateUrl: "https://link.amazon/B0fRWDqgF",
    blurb: "A corn peeler for fast kernels for summer corn salad.",
    softCta: "A corn peeler for fast kernels for summer corn salad.",
  },
  {
    recipeSlugs: ["monterey-chicken"],
    title: "All-Clad D3 Stainless Steel 12-Inch Fry Pan with Lid",
    imageSrc: "/affiliates/all-clad-d3-fry-pan-12in-lid.jpg",
    imageAlt: "All-Clad D3 Stainless Steel 12-Inch Fry Pan with Lid",
    affiliateUrl: "https://link.amazon/B00nqKtZc",
    blurb: "A 12-inch stainless skillet for Monterey chicken and pan sauces.",
    softCta: "A 12-inch stainless skillet for Monterey chicken and pan sauces.",
  },
  {
    recipeSlugs: ["garlic-butter-steak-bites"],
    title: "Victoria 12-Inch Cast Iron Skillet",
    imageSrc: "/affiliates/victoria-12in-cast-iron-skillet.jpg",
    imageAlt: "Victoria 12-Inch Cast Iron Skillet",
    affiliateUrl: "https://link.amazon/B0htS3wqh",
    blurb: "A cast-iron skillet for a deep sear on garlic butter steak bites.",
    softCta: "A cast-iron skillet for a deep sear on garlic butter steak bites.",
  },
  {
    recipeSlugs: ["crock-pot-beef-and-noodles"],
    title: "Hamilton Beach 7-Quart Set & Forget Portable Programmable Slow Cooker",
    imageSrc: "/affiliates/hamilton-beach-7qt-set-forget-portable.jpg",
    imageAlt: "Hamilton Beach 7-Quart Set & Forget Portable Programmable Slow Cooker",
    affiliateUrl: "https://link.amazon/B0jm8feyA",
    blurb: "A programmable slow cooker for tender beef and noodles.",
    softCta: "A programmable slow cooker for tender beef and noodles.",
  },
  {
    recipeSlugs: ["orange-creamsicle-poke-cake"],
    title: "Anchor Hocking 2-Piece Glass Baking Dish Set, 2 and 3 Quart",
    imageSrc: "/affiliates/anchor-hocking-2pc-glass-baking-dish-set.jpg",
    imageAlt: "Anchor Hocking 2-Piece Glass Baking Dish Set, 2 and 3 Quart",
    affiliateUrl: "https://link.amazon/B0g6FIfXC",
    blurb: "Glass baking dishes for poke cakes and chilled desserts.",
    softCta: "Glass baking dishes for poke cakes and chilled desserts.",
  },
  {
    recipeSlugs: ["no-bake-oreo-dessert"],
    title: "Pyrex 3-Quart Glass Baking Dish with Red Lid",
    imageSrc: "/affiliates/pyrex-3qt-glass-baking-dish-red-lid.jpg",
    imageAlt: "Pyrex 3-Quart Glass Baking Dish with Red Lid",
    affiliateUrl: "https://link.amazon/B0fyPQ3qW",
    blurb: "A lidded glass dish for layered no-bake Oreo dessert.",
    softCta: "A lidded glass dish for layered no-bake Oreo dessert.",
  },
  {
    recipeSlugs: ["chicken-pot-pie-soup"],
    title: "Cuisinart Chef’s Classic Stainless 6-Quart Stockpot with Cover",
    imageSrc: "/affiliates/cuisinart-chefs-classic-stockpot-6qt.jpg",
    imageAlt: "Cuisinart Chef’s Classic Stainless 6-Quart Stockpot with Cover",
    affiliateUrl: "https://link.amazon/B0d1TSX7b",
    blurb: "A 6-quart stockpot for chicken pot pie soup.",
    softCta: "A 6-quart stockpot for chicken pot pie soup.",
  },
  {
    recipeSlugs: ["puffy-tacos"],
    title: "Lodge 5-Qt Cast Iron Dutch Oven",
    imageSrc: "/affiliates/lodge-5qt-cast-iron-dutch-oven.jpg",
    imageAlt: "Lodge 5-Qt Cast Iron Dutch Oven",
    affiliateUrl: "https://link.amazon/B0eKcfCBE",
    blurb: "A cast-iron Dutch oven for frying puffy taco shells.",
    softCta: "A cast-iron Dutch oven for frying puffy taco shells.",
  },
  {
    recipeSlugs: ["orange-fluff"],
    title: "OXO Good Grips Silicone Balloon Whisk",
    imageSrc: "/affiliates/oxo-silicone-balloon-whisk.jpg",
    imageAlt: "OXO Good Grips Silicone Balloon Whisk",
    affiliateUrl: "https://link.amazon/B04yTrI60",
    blurb: "A silicone whisk for folding fluffy dessert mixtures.",
    softCta: "A silicone whisk for folding fluffy dessert mixtures.",
  },
  {
    recipeSlugs: ["oreo-lasagna"],
    title: "Hamilton Beach 10-Cup Food Processor with Bowl Scraper",
    imageSrc: "/affiliates/hamilton-beach-10cup-food-processor-scraper.jpg",
    imageAlt: "Hamilton Beach 10-Cup Food Processor with Bowl Scraper",
    affiliateUrl: "https://link.amazon/B03asgsLa",
    blurb: "A food processor for crushing cookies for Oreo lasagna crusts.",
    softCta: "A food processor for crushing cookies for Oreo lasagna crusts.",
  },
  {
    recipeSlugs: ["strawberry-shortcake-cake"],
    title: "Fat Daddio’s 8 × 2-Inch Round Cake Pan",
    imageSrc: "/affiliates/fat-daddios-8x2in-round-cake-pan.jpg",
    imageAlt: "Fat Daddio’s 8 × 2-Inch Round Cake Pan",
    affiliateUrl: "https://link.amazon/B02mjbgq7",
    blurb: "An 8-inch round pan for strawberry shortcake layers.",
    softCta: "An 8-inch round pan for strawberry shortcake layers.",
  },
  {
    recipeSlugs: ["mini-doughnut-hot-buttered-cheerios"],
    title: "Lodge 12-Inch Cast Iron Skillet",
    imageSrc: "/affiliates/lodge-12in-cast-iron-skillet.jpg",
    imageAlt: "Lodge 12-Inch Cast Iron Skillet",
    affiliateUrl: "https://link.amazon/B03z1sNMg",
    blurb: "A cast-iron skillet for hot buttered Cheerios on the stove.",
    softCta: "A cast-iron skillet for hot buttered Cheerios on the stove.",
  },
  {
    recipeSlugs: ["heaven-on-earth-cake"],
    title: "Anchor Hocking Monaco Glass Trifle Bowl",
    imageSrc: "/affiliates/anchor-hocking-monaco-glass-trifle-bowl.jpg",
    imageAlt: "Anchor Hocking Monaco Glass Trifle Bowl",
    affiliateUrl: "https://link.amazon/B0ilPz6jT",
    blurb: "A trifle bowl for layered Heaven on Earth cake.",
    softCta: "A trifle bowl for layered Heaven on Earth cake.",
  },
  {
    recipeSlugs: ["peanut-butter-cup-pie"],
    title: "Emile Henry Modern Classics 9-Inch Ceramic Pie Dish",
    imageSrc: "/affiliates/emile-henry-modern-classics-9in-pie-dish.jpg",
    imageAlt: "Emile Henry Modern Classics 9-Inch Ceramic Pie Dish",
    affiliateUrl: "https://link.amazon/B03BcA9Z6",
    blurb: "A ceramic pie dish for peanut butter cup pie.",
    softCta: "A ceramic pie dish for peanut butter cup pie.",
  },
  {
    recipeSlugs: ["cowboy-caviar-dip"],
    title: "Fullstar 4-in-1 Vegetable Chopper",
    imageSrc: "/affiliates/fullstar-4in1-vegetable-chopper.jpg",
    imageAlt: "Fullstar 4-in-1 Vegetable Chopper",
    affiliateUrl: "https://link.amazon/B0hnlkj6z",
    blurb: "A chopper for quick peppers and onions for cowboy caviar.",
    softCta: "A chopper for quick peppers and onions for cowboy caviar.",
  },
  {
    recipeSlugs: ["chicken-and-dumplings"],
    title: "Cuisinart Chef’s Classic 12-Quart Stainless Steel Stockpot with Lid",
    imageSrc: "/affiliates/cuisinart-chefs-classic-stockpot-12qt.jpg",
    imageAlt: "Cuisinart Chef’s Classic 12-Quart Stainless Steel Stockpot with Lid",
    affiliateUrl: "https://link.amazon/B03Ym236s",
    blurb: "A deep stockpot for chicken and dumplings.",
    softCta: "A deep stockpot for chicken and dumplings.",
  },
  {
    recipeSlugs: ["mini-cupcakes"],
    title: "Wilton Recipe Right 24-Cup Mini Muffin Pan",
    imageSrc: "/affiliates/wilton-recipe-right-24cup-mini-muffin-pan.jpg",
    imageAlt: "Wilton Recipe Right 24-Cup Mini Muffin Pan",
    affiliateUrl: "https://link.amazon/B05xabtjo",
    blurb: "A 24-cup mini muffin pan for bite-size cupcakes.",
    softCta: "A 24-cup mini muffin pan for bite-size cupcakes.",
  },
  {
    recipeSlugs: ["dark-chocolate-cake"],
    title: "USA Pan American Bakeware Classics 9-Inch Round Cake Pan",
    imageSrc: "/affiliates/usa-pan-9in-round-cake-pan-classics.jpg",
    imageAlt: "USA Pan American Bakeware Classics 9-Inch Round Cake Pan",
    affiliateUrl: "https://link.amazon/B00F4CfTx",
    blurb: "A 9-inch round pan for even dark chocolate cake layers.",
    softCta: "A 9-inch round pan for even dark chocolate cake layers.",
  },
  {
    recipeSlugs: ["italian-pasta-salad"],
    title: "Bellemain 5-Quart Stainless Steel Colander",
    imageSrc: "/affiliates/bellemain-5qt-stainless-colander.jpg",
    imageAlt: "Bellemain 5-Quart Stainless Steel Colander",
    affiliateUrl: "https://link.amazon/B06KJy02t",
    blurb: "A roomy colander for draining pasta salad noodles.",
    softCta: "A roomy colander for draining pasta salad noodles.",
  },
  {
    recipeSlugs: ["taco-soup"],
    title: "Lodge Enameled Cast Iron Dutch Oven",
    imageSrc: "/affiliates/lodge-enameled-cast-iron-dutch-oven-generic.jpg",
    imageAlt: "Lodge Enameled Cast Iron Dutch Oven",
    affiliateUrl: "https://link.amazon/B05z2iWpa",
    blurb: "An enameled Dutch oven for simmering taco soup.",
    softCta: "An enameled Dutch oven for simmering taco soup.",
  },
  {
    recipeSlugs: ["nashville-hot-chicken"],
    title: "T-fal 3.5-Liter Deep Fryer",
    imageSrc: "/affiliates/tfal-35l-deep-fryer.jpg",
    imageAlt: "T-fal 3.5-Liter Deep Fryer",
    affiliateUrl: "https://link.amazon/B0dC6z9DA",
    blurb: "An electric deep fryer for Nashville hot chicken.",
    softCta: "An electric deep fryer for Nashville hot chicken.",
  },
  {
    recipeSlugs: ["buffalo-chicken"],
    title: "Instant Pot Vortex Plus 4-Quart Air Fryer",
    imageSrc: "/affiliates/instant-vortex-plus-4qt-air-fryer.jpg",
    imageAlt: "Instant Pot Vortex Plus 4-Quart Air Fryer",
    affiliateUrl: "https://link.amazon/B07kWFHbk",
    blurb: "A compact air fryer for buffalo chicken.",
    softCta: "A compact air fryer for buffalo chicken.",
  },
  {
    recipeSlugs: ["ramen-noodle-salad"],
    title: "Cuisinart 5-Quart Salad Spinner",
    imageSrc: "/affiliates/cuisinart-5qt-salad-spinner.jpg",
    imageAlt: "Cuisinart 5-Quart Salad Spinner",
    affiliateUrl: "https://link.amazon/B02lZXuNX",
    blurb: "A salad spinner for drying greens for ramen noodle salad.",
    softCta: "A salad spinner for drying greens for ramen noodle salad.",
  },
  {
    recipeSlugs: ["loaded-mashed-potatoes"],
    title: "OXO Good Grips Potato Masher",
    imageSrc: "/affiliates/oxo-potato-masher-classic.jpg",
    imageAlt: "OXO Good Grips Potato Masher",
    affiliateUrl: "https://link.amazon/B04GW03oP",
    blurb: "A sturdy masher for creamy loaded mashed potatoes.",
    softCta: "A sturdy masher for creamy loaded mashed potatoes.",
  },
  {
    recipeSlugs: ["peanut-butter-banana-cookies"],
    title: "Nordic Ware Naturals Half Sheet Pan",
    imageSrc: "/affiliates/nordic-ware-naturals-half-sheet-pan.jpg",
    imageAlt: "Nordic Ware Naturals Half Sheet Pan",
    affiliateUrl: "https://link.amazon/B03XDNqFR",
    blurb: "A half sheet pan for even batches of cookies.",
    softCta: "A half sheet pan for even batches of cookies.",
  },
  {
    recipeSlugs: ["philly-cheese-steak-pizza"],
    title: "Old Stone 14 × 16-Inch Rectangular Pizza Stone",
    imageSrc: "/affiliates/old-stone-14x16-pizza-stone.jpg",
    imageAlt: "Old Stone 14 × 16-Inch Rectangular Pizza Stone",
    affiliateUrl: "https://link.amazon/B01Dpx7mD",
    blurb: "A pizza stone for crisp Philly cheesesteak pizza crust.",
    softCta: "A pizza stone for crisp Philly cheesesteak pizza crust.",
  },
  {
    recipeSlugs: ["pepper-steak"],
    title: "YOSUKATA 13.5-Inch Carbon Steel Wok",
    imageSrc: "/affiliates/yosukata-135in-carbon-steel-wok-pepper-steak.jpg",
    imageAlt: "YOSUKATA 13.5-Inch Carbon Steel Wok",
    affiliateUrl: "https://link.amazon/B01gjLQyV",
    blurb: "A carbon steel wok for high-heat pepper steak.",
    softCta: "A carbon steel wok for high-heat pepper steak.",
  },
  {
    recipeSlugs: ["deviled-egg-pasta-salad"],
    title: "OXO Good Grips Egg Slicer",
    imageSrc: "/affiliates/oxo-egg-slicer.jpg",
    imageAlt: "OXO Good Grips Egg Slicer",
    affiliateUrl: "https://link.amazon/B0hAXAvUN",
    blurb: "An egg slicer for neat egg pieces in pasta salad.",
    softCta: "An egg slicer for neat egg pieces in pasta salad.",
  },
  {
    recipeSlugs: ["cloud-bread"],
    title: "Breville Handy Mix Scraper 9-Speed Hand Mixer",
    imageSrc: "/affiliates/breville-handy-mix-scraper-hand-mixer.jpg",
    imageAlt: "Breville Handy Mix Scraper 9-Speed Hand Mixer",
    affiliateUrl: "https://link.amazon/B0fx0moao",
    blurb: "A hand mixer for light cloud bread batter.",
    softCta: "A hand mixer for light cloud bread batter.",
  },
  {
    recipeSlugs: ["biscoff-butter-cookies"],
    title: "OXO Good Grips Medium Silicone Cookie Scoop and Small Spatula Set",
    imageSrc: "/affiliates/oxo-cookie-scoop-spatula-set.jpg",
    imageAlt: "OXO Good Grips Medium Silicone Cookie Scoop and Small Spatula Set",
    affiliateUrl: "https://link.amazon/B0eXmsEOx",
    blurb: "A cookie scoop set for even Biscoff butter cookies.",
    softCta: "A cookie scoop set for even Biscoff butter cookies.",
  },
  {
    recipeSlugs: ["pineapple-upside-down-cake"],
    title: "Nordic Ware 8-Cup Pineapple Upside Down Cake Pan",
    imageSrc: "/affiliates/nordic-ware-8cup-pineapple-upside-down-pan.jpg",
    imageAlt: "Nordic Ware 8-Cup Pineapple Upside Down Cake Pan",
    affiliateUrl: "https://link.amazon/B00dFOL6K",
    blurb: "A shaped pan for pineapple upside-down cake.",
    softCta: "A shaped pan for pineapple upside-down cake.",
  },
  {
    recipeSlugs: ["focaccia"],
    title: "LloydPans 10 × 14-Inch Deep Baking Pan",
    imageSrc: "/affiliates/lloydpans-10x14-deep-baking-pan.jpg",
    imageAlt: "LloydPans 10 × 14-Inch Deep Baking Pan",
    affiliateUrl: "https://link.amazon/B06sFzIXq",
    blurb: "A deep pan for focaccia with crisp edges.",
    softCta: "A deep pan for focaccia with crisp edges.",
  },
  {
    recipeSlugs: ["sandwich-meat"],
    title: "Chef’sChoice 615A Electric Meat Slicer",
    imageSrc: "/affiliates/chefschoice-615a-electric-meat-slicer.jpg",
    imageAlt: "Chef’sChoice 615A Electric Meat Slicer",
    affiliateUrl: "https://link.amazon/B02VfoJ9a",
    blurb: "An electric slicer for thin sandwich meat.",
    softCta: "An electric slicer for thin sandwich meat.",
  },
  {
    recipeSlugs: ["shells-and-cheese"],
    title: "Tramontina Signature Tri-Ply Stainless Steel Saucepan",
    imageSrc: "/affiliates/tramontina-signature-triply-saucepan.jpg",
    imageAlt: "Tramontina Signature Tri-Ply Stainless Steel Saucepan",
    affiliateUrl: "https://link.amazon/B0f45uKEr",
    blurb: "A stainless saucepan for creamy shells and cheese.",
    softCta: "A stainless saucepan for creamy shells and cheese.",
  },
  {
    recipeSlugs: ["blueberry-pie"],
    title: "Emile Henry 9-Inch Ceramic Pie Dish",
    imageSrc: "/affiliates/emile-henry-9in-ceramic-pie-dish.jpg",
    imageAlt: "Emile Henry 9-Inch Ceramic Pie Dish",
    affiliateUrl: "https://link.amazon/B0gA3Vy54",
    blurb: "A ceramic pie dish for blueberry pie.",
    softCta: "A ceramic pie dish for blueberry pie.",
  },
  {
    recipeSlugs: ["chicken-patty-sandwich"],
    title: "Ninja Air Fryer Pro 5-Quart AF141",
    imageSrc: "/affiliates/ninja-air-fryer-pro-5qt-af141.jpg",
    imageAlt: "Ninja Air Fryer Pro 5-Quart AF141",
    affiliateUrl: "https://link.amazon/B0bHIj3iB",
    blurb: "An air fryer for crisp chicken patties.",
    softCta: "An air fryer for crisp chicken patties.",
  },
  {
    recipeSlugs: ["german-cake"],
    title: "Wilton Aluminum Round Cake Pan Set, 9 × 2 Inches",
    imageSrc: "/affiliates/wilton-aluminum-round-cake-pan-set-9in.jpg",
    imageAlt: "Wilton Aluminum Round Cake Pan Set, 9 × 2 Inches",
    affiliateUrl: "https://link.amazon/B06ztecFY",
    blurb: "A 9-inch round pan set for German cake layers.",
    softCta: "A 9-inch round pan set for German cake layers.",
  },
  {
    recipeSlugs: ["kimchi-noodles"],
    title: "OXO Good Grips 12-Inch Silicone Tongs",
    imageSrc: "/affiliates/oxo-12in-silicone-tongs.jpg",
    imageAlt: "OXO Good Grips 12-Inch Silicone Tongs",
    affiliateUrl: "https://link.amazon/B0eAuOBh0",
    blurb: "Silicone tongs for tossing kimchi noodles.",
    softCta: "Silicone tongs for tossing kimchi noodles.",
  },
  {
    recipeSlugs: ["cooked-sushi-rolls"],
    title: "SushiQuik Sushi Making Kit",
    imageSrc: "/affiliates/sushiquik-sushi-making-kit.jpg",
    imageAlt: "SushiQuik Sushi Making Kit",
    affiliateUrl: "https://link.amazon/B06mY4s4W",
    blurb: "A sushi kit for rolling cooked sushi at home.",
    softCta: "A sushi kit for rolling cooked sushi at home.",
  },
  {
    recipeSlugs: ["buffalo-chicken-wings"],
    title: "COSORI TurboBlaze 6-Quart Air Fryer",
    imageSrc: "/affiliates/cosori-turboblaze-6qt-air-fryer.jpg",
    imageAlt: "COSORI TurboBlaze 6-Quart Air Fryer",
    affiliateUrl: "https://link.amazon/B01FuamZv",
    blurb: "A 6-quart air fryer for buffalo chicken wings.",
    softCta: "A 6-quart air fryer for buffalo chicken wings.",
  },
  {
    recipeSlugs: ["strawberry-roses"],
    title: "Victorinox Swiss Classic 3.25-Inch Paring Knife",
    imageSrc: "/affiliates/victorinox-swiss-classic-paring-knife.jpg",
    imageAlt: "Victorinox Swiss Classic 3.25-Inch Paring Knife",
    affiliateUrl: "https://link.amazon/B0eYat95G",
    blurb: "A sharp paring knife for carving strawberry roses.",
    softCta: "A sharp paring knife for carving strawberry roses.",
  },
  {
    recipeSlugs: ["thai-yellow-curry"],
    title: "Cuisinart MultiClad Pro Stainless 3.5-Quart Sauté Pan with Lid",
    imageSrc: "/affiliates/cuisinart-multiclad-pro-saute-35qt.jpg",
    imageAlt: "Cuisinart MultiClad Pro Stainless 3.5-Quart Sauté Pan with Lid",
    affiliateUrl: "https://link.amazon/B04nLQUjM",
    blurb: "A sauté pan for Thai yellow curry.",
    softCta: "A sauté pan for Thai yellow curry.",
  },
  {
    recipeSlugs: ["pollock-fish"],
    title: "Mercer Culinary Hell’s Handle Fish Turner",
    imageSrc: "/affiliates/mercer-hells-handle-fish-turner.jpg",
    imageAlt: "Mercer Culinary Hell’s Handle Fish Turner",
    affiliateUrl: "https://link.amazon/B0eKRvIlP",
    blurb: "A fish turner for flipping delicate pollock fillets.",
    softCta: "A fish turner for flipping delicate pollock fillets.",
  },
  {
    recipeSlugs: ["chocolate-ganache-cake"],
    title: "Ateco 4.5-Inch Offset Spatula",
    imageSrc: "/affiliates/ateco-45in-offset-spatula.jpg",
    imageAlt: "Ateco 4.5-Inch Offset Spatula",
    affiliateUrl: "https://link.amazon/B04SrIHdO",
    blurb: "An offset spatula for smooth ganache frosting.",
    softCta: "An offset spatula for smooth ganache frosting.",
  },
  {
    recipeSlugs: ["osso-buco"],
    title: "Lodge 7-Quart Cast Iron Dutch Oven with Loop Handle",
    imageSrc: "/affiliates/lodge-7qt-cast-iron-dutch-oven-loop.jpg",
    imageAlt: "Lodge 7-Quart Cast Iron Dutch Oven with Loop Handle",
    affiliateUrl: "https://link.amazon/B0i2Rs8Pt",
    blurb: "A deep Dutch oven for slow-braised osso buco.",
    softCta: "A deep Dutch oven for slow-braised osso buco.",
  },
  {
    recipeSlugs: ["whipped-yogurt"],
    title: "OXO Good Grips 11-Inch Stainless Steel Balloon Whisk",
    imageSrc: "/affiliates/oxo-11in-stainless-balloon-whisk.jpg",
    imageAlt: "OXO Good Grips 11-Inch Stainless Steel Balloon Whisk",
    affiliateUrl: "https://link.amazon/B0gS1Nc1d",
    blurb: "A balloon whisk for fluffy whipped yogurt.",
    softCta: "A balloon whisk for fluffy whipped yogurt.",
  },
  {
    recipeSlugs: ["pull-apart-garlic-bread"],
    title: "USA Pan 1-Pound Loaf Pan Set",
    imageSrc: "/affiliates/usa-pan-1lb-loaf-pan-set.jpg",
    imageAlt: "USA Pan 1-Pound Loaf Pan Set",
    affiliateUrl: "https://link.amazon/B0djH1TjY",
    blurb: "Loaf pans for pull-apart garlic bread.",
    softCta: "Loaf pans for pull-apart garlic bread.",
  },
  {
    recipeSlugs: ["seed-crackers"],
    title: "Amazon Basics Silicone Half Sheet Baking Mats, 2 Pack",
    imageSrc: "/affiliates/amazon-basics-silicone-half-sheet-mats-2pk.jpg",
    imageAlt: "Amazon Basics Silicone Half Sheet Baking Mats, 2 Pack",
    affiliateUrl: "https://link.amazon/B0ebf3rf4",
    blurb: "Silicone mats for baking seed crackers evenly.",
    softCta: "Silicone mats for baking seed crackers evenly.",
  },
  {
    recipeSlugs: ["angus-beef-steak"],
    title: "MEATER Pro Wireless Meat Thermometer",
    imageSrc: "/affiliates/meater-pro-wireless-thermometer-steak.jpg",
    imageAlt: "MEATER Pro Wireless Meat Thermometer",
    affiliateUrl: "https://link.amazon/B06g1FhwU",
    blurb: "A wireless probe for perfect Angus steak temps.",
    softCta: "A wireless probe for perfect Angus steak temps.",
  },
  {
    recipeSlugs: ["hibachi-noodles"],
    title: "Cuisinart MultiClad Pro Nonstick Double Burner Griddle, 10 × 18 Inches",
    imageSrc: "/affiliates/cuisinart-multiclad-pro-double-burner-griddle.jpg",
    imageAlt: "Cuisinart MultiClad Pro Nonstick Double Burner Griddle, 10 × 18 Inches",
    affiliateUrl: "https://link.amazon/B0hDL5E2k",
    blurb: "A wide griddle for hibachi-style noodles.",
    softCta: "A wide griddle for hibachi-style noodles.",
  },
  {
    recipeSlugs: ["salmon-meal-prep"],
    title: "PrepNaturals Glass Meal Prep Containers",
    imageSrc: "/affiliates/prepnaturals-glass-meal-prep-containers.jpg",
    imageAlt: "PrepNaturals Glass Meal Prep Containers",
    affiliateUrl: "https://link.amazon/B0gKaE8zT",
    blurb: "Glass containers for salmon meal prep.",
    softCta: "Glass containers for salmon meal prep.",
  },
  {
    recipeSlugs: ["3-ingredient-brownies"],
    title: "Wilton Perfect Results 8-Inch Nonstick Square Cake Pan Set, 2 Pack",
    imageSrc: "/affiliates/wilton-perfect-results-8in-square-pan-set.jpg",
    imageAlt: "Wilton Perfect Results 8-Inch Nonstick Square Cake Pan Set, 2 Pack",
    affiliateUrl: "https://link.amazon/B0c4gilov",
    blurb: "8-inch square pans for quick brownie batches.",
    softCta: "8-inch square pans for quick brownie batches.",
  },
  {
    recipeSlugs: ["korean-mango-ice-cream"],
    title: "Cuisinart ICE-21 1.5-Quart Ice Cream Maker",
    imageSrc: "/affiliates/cuisinart-ice-21-ice-cream-maker.jpg",
    imageAlt: "Cuisinart ICE-21 1.5-Quart Ice Cream Maker",
    affiliateUrl: "https://link.amazon/B07POpXK8",
    blurb: "An ice cream maker for homemade mango ice cream.",
    softCta: "An ice cream maker for homemade mango ice cream.",
  },
  {
    recipeSlugs: ["stuffed-sole"],
    title: "OXO Good Grips Angled Baster with Cleaning Brush",
    imageSrc: "/affiliates/oxo-angled-baster.jpg",
    imageAlt: "OXO Good Grips Angled Baster with Cleaning Brush",
    affiliateUrl: "https://link.amazon/B0fqW3vIU",
    blurb: "A baster for keeping stuffed sole moist while baking.",
    softCta: "A baster for keeping stuffed sole moist while baking.",
  },
  {
    recipeSlugs: ["chuck-eye-roast"],
    title: "Calphalon Roasting Pan with Rack",
    imageSrc: "/affiliates/calphalon-roasting-pan-with-rack.jpg",
    imageAlt: "Calphalon Roasting Pan with Rack",
    affiliateUrl: "https://link.amazon/B0b5AgnKV",
    blurb: "A roasting pan with rack for chuck eye roast.",
    softCta: "A roasting pan with rack for chuck eye roast.",
  },
  {
    recipeSlugs: ["frozen-whole-turkey"],
    title: "ThermoPro TempSpike Plus Wireless Meat Thermometer",
    imageSrc: "/affiliates/thermopro-tempspike-plus-frozen-turkey.jpg",
    imageAlt: "ThermoPro TempSpike Plus Wireless Meat Thermometer",
    affiliateUrl: "https://link.amazon/B0dbIx45h",
    blurb: "Wireless probes for roasting a frozen whole turkey safely.",
    softCta: "Wireless probes for roasting a frozen whole turkey safely.",
  },
  {
    recipeSlugs: ["beef-short-ribs"],
    title: "Staub 5.5-Quart Round Cast Iron Cocotte, Grenadine",
    imageSrc: "/affiliates/staub-55qt-cocotte-grenadine.jpg",
    imageAlt: "Staub 5.5-Quart Round Cast Iron Cocotte, Grenadine",
    affiliateUrl: "https://link.amazon/B08jKme45",
    blurb: "A Staub cocotte for braising beef short ribs.",
    softCta: "A Staub cocotte for braising beef short ribs.",
  },
  {
    recipeSlugs: ["broccoli-soup"],
    title: "Braun MultiQuick 7 Immersion Blender",
    imageSrc: "/affiliates/braun-multiquick-7-immersion-blender.jpg",
    imageAlt: "Braun MultiQuick 7 Immersion Blender",
    affiliateUrl: "https://link.amazon/B09qWQlrm",
    blurb: "An immersion blender for silky broccoli soup.",
    softCta: "An immersion blender for silky broccoli soup.",
  },
  {
    recipeSlugs: ["granola-peanut-butter-bars"],
    title: "Nordic Ware 9-Inch Square Cake Pan",
    imageSrc: "/affiliates/nordic-ware-9in-square-cake-pan.jpg",
    imageAlt: "Nordic Ware 9-Inch Square Cake Pan",
    affiliateUrl: "https://link.amazon/B07kq4Cl9",
    blurb: "A 9-inch square pan for granola peanut butter bars.",
    softCta: "A 9-inch square pan for granola peanut butter bars.",
  },
  {
    recipeSlugs: ["fried-dough"],
    title: "Presto FryDaddy Electric Deep Fryer",
    imageSrc: "/affiliates/presto-frydaddy-electric-deep-fryer.jpg",
    imageAlt: "Presto FryDaddy Electric Deep Fryer",
    affiliateUrl: "https://link.amazon/B0a2eqNnN",
    blurb: "A compact deep fryer for fried dough.",
    softCta: "A compact deep fryer for fried dough.",
  },
  {
    recipeSlugs: ["thai-papaya-salad"],
    title: "Kiwi Pro Slice Thai Julienne Peeler",
    imageSrc: "/affiliates/kiwi-pro-slice-thai-julienne-peeler.jpg",
    imageAlt: "Kiwi Pro Slice Thai Julienne Peeler",
    affiliateUrl: "https://link.amazon/B0fSp6cF1",
    blurb: "A julienne peeler for shredded papaya salad.",
    softCta: "A julienne peeler for shredded papaya salad.",
  },
  {
    recipeSlugs: ["chicken-tenders"],
    title: "Dreo ChefMaker Combi Fryer",
    imageSrc: "/affiliates/dreo-chefmaker-combi-fryer.jpg",
    imageAlt: "Dreo ChefMaker Combi Fryer",
    affiliateUrl: "https://link.amazon/B0j9FjPFJ",
    blurb: "A combi fryer for crisp chicken tenders.",
    softCta: "A combi fryer for crisp chicken tenders.",
  },
  {
    recipeSlugs: ["catfish-fillets"],
    title: "Lodge 10.25-Inch Cast Iron Skillet with Silicone Handle Holder",
    imageSrc: "/affiliates/lodge-1025in-skillet-silicone-holder.jpg",
    imageAlt: "Lodge 10.25-Inch Cast Iron Skillet with Silicone Handle Holder",
    affiliateUrl: "https://link.amazon/B02Go8lVc",
    blurb: "A cast-iron skillet for searing catfish fillets.",
    softCta: "A cast-iron skillet for searing catfish fillets.",
  },
  {
    recipeSlugs: ["nut-bar"],
    title: "Webake Silicone Snack Bar Mold Set",
    imageSrc: "/affiliates/webake-silicone-snack-bar-mold-set.jpg",
    imageAlt: "Webake Silicone Snack Bar Mold Set",
    affiliateUrl: "https://link.amazon/B040bY3hs",
    blurb: "Silicone molds for homemade nut bars.",
    softCta: "Silicone molds for homemade nut bars.",
  },
  {
    recipeSlugs: ["hamburger-buns"],
    title: "Six-Cavity Silicone Hamburger Bun Pan",
    imageSrc: "/affiliates/silicone-hamburger-bun-pan-6cavity.jpg",
    imageAlt: "Six-Cavity Silicone Hamburger Bun Pan",
    affiliateUrl: "https://link.amazon/B0bQTrTMf",
    blurb: "A bun pan for even homemade hamburger buns.",
    softCta: "A bun pan for even homemade hamburger buns.",
  },
  {
    recipeSlugs: ["beef-strips"],
    title: "de Buyer Mineral B Carbon Steel Fry Pan",
    imageSrc: "/affiliates/de-buyer-mineral-b-carbon-steel-fry-pan.jpg",
    imageAlt: "de Buyer Mineral B Carbon Steel Fry Pan",
    affiliateUrl: "https://link.amazon/B069dtHaa",
    blurb: "A carbon steel skillet for quick beef strips.",
    softCta: "A carbon steel skillet for quick beef strips.",
  },
  {
    recipeSlugs: ["hawaiian-chicken-sheet-pan"],
    title: "OXO Good Grips Nonstick Pro Half Sheet Pan",
    imageSrc: "/affiliates/oxo-nonstick-pro-half-sheet-pan.jpg",
    imageAlt: "OXO Good Grips Nonstick Pro Half Sheet Pan",
    affiliateUrl: "https://link.amazon/B00OQ2SlP",
    blurb: "A half sheet pan for Hawaiian chicken dinners.",
    softCta: "A half sheet pan for Hawaiian chicken dinners.",
  },
  {
    recipeSlugs: ["beef-chuck-steak"],
    title: "ThermoPro TP620 Instant Read Meat Thermometer",
    imageSrc: "/affiliates/thermopro-tp620-instant-read.jpg",
    imageAlt: "ThermoPro TP620 Instant Read Meat Thermometer",
    affiliateUrl: "https://link.amazon/B0fPnrZJV",
    blurb: "An instant-read thermometer for chuck steak.",
    softCta: "An instant-read thermometer for chuck steak.",
  },
  {
    recipeSlugs: ["cheeseburger-macaroni"],
    title: "Calphalon Classic Hard-Anodized Nonstick 5-Quart Sauté Pan with Cover",
    imageSrc: "/affiliates/calphalon-classic-saute-5qt.jpg",
    imageAlt: "Calphalon Classic Hard-Anodized Nonstick 5-Quart Sauté Pan with Cover",
    affiliateUrl: "https://link.amazon/B04m50exq",
    blurb: "A deep sauté pan for cheeseburger macaroni.",
    softCta: "A deep sauté pan for cheeseburger macaroni.",
  },
  {
    recipeSlugs: ["ginger-ale-bread"],
    title: "USA Pan 1145LF 1.25-lb Aluminized Steel Loaf Pan",
    imageSrc: "/affiliates/usa-pan-125lb-aluminized-loaf-pan.jpg",
    imageAlt: "USA Pan 1.25-pound aluminized steel loaf pan",
    affiliateUrl: "https://link.amazon/B0h5vY0R6",
    blurb:
      "A sturdy loaf pan for ginger ale bread with even browning and easy release.",
    softCta: "A sturdy loaf pan helps ginger ale bread bake evenly.",
  },
  {
    recipeSlugs: ["pineapple-soft-serve"],
    title: "Ninja Professional Plus BN701 Blender",
    imageSrc: "/affiliates/ninja-professional-plus-bn701-blender.jpg",
    imageAlt: "Ninja Professional Plus BN701 countertop blender",
    affiliateUrl: "https://link.amazon/B0bG7gr5D",
    blurb:
      "A powerful blender for creamy pineapple soft serve from frozen fruit.",
    softCta: "A powerful blender helps whip frozen pineapple into soft serve.",
  },
  {
    recipeSlugs: ["big-mac-sauce"],
    title: "OXO Good Grips Chef’s Squeeze Bottle Set",
    imageSrc: "/affiliates/oxo-chefs-squeeze-bottle-set.jpg",
    imageAlt: "OXO Good Grips chef’s squeeze bottle set",
    affiliateUrl: "https://link.amazon/B03ifUk1k",
    blurb: "Squeeze bottles for neat Big Mac sauce drizzle and burger assembly.",
    softCta: "Squeeze bottles make Big Mac sauce easy to drizzle without a mess.",
  },
  {
    recipeSlugs: ["strawberry-eclair-cake"],
    title: "Pyrex Deep 5.2-Qt 9 × 13-Inch Glass Baking Dish with Glass Lid",
    imageSrc: "/affiliates/pyrex-deep-52qt-9x13-glass-baking-dish-lid.jpg",
    imageAlt: "Pyrex deep 5.2-quart 9 by 13 inch glass baking dish with glass lid",
    affiliateUrl: "https://link.amazon/B0aGeQrbK",
    blurb: "A deep covered glass dish for layered strawberry éclair cake.",
    softCta: "A deep covered glass dish keeps layered éclair cake neat in the fridge.",
  },
  {
    recipeSlugs: ["chocolate-peanut-butter-no-bake-cookies"],
    title: "Reynolds Kitchens Parchment Paper Sheets",
    imageSrc: "/affiliates/reynolds-kitchens-parchment-paper-sheets.jpg",
    imageAlt: "Reynolds Kitchens parchment paper sheets",
    affiliateUrl: "https://link.amazon/B04xlZ7qW",
    blurb: "Pre-cut parchment sheets for setting no-bake cookies without sticking.",
    softCta: "Parchment sheets keep no-bake cookies from sticking as they set.",
  },
  {
    recipeSlugs: ["cherry-cheesecake-brownies"],
    title: "USA Pan 9 × 13-Inch Nonstick Rectangular Cake Pan",
    imageSrc: "/affiliates/usa-pan-9x13-nonstick-rectangular-cake-pan.jpg",
    imageAlt: "USA Pan 9 by 13 inch nonstick rectangular cake pan",
    affiliateUrl: "https://link.amazon/B08TtEefH",
    blurb: "A sturdy 9×13 pan for cherry cheesecake brownies with even browning.",
    softCta: "A sturdy 9×13 pan helps cherry cheesecake brownies bake evenly.",
  },
  {
    recipeSlugs: ["baked-potato-skins"],
    title: "Nordic Ware Extra Large Oven Crisping Baking Tray with Rack",
    imageSrc: "/affiliates/nordic-ware-xl-oven-crisping-tray-rack.jpg",
    imageAlt: "Nordic Ware extra large oven crisping baking tray with rack",
    affiliateUrl: "https://link.amazon/B08CPzzPt",
    blurb: "A crisping tray with rack for baked potato skins that stay crunchy.",
    softCta: "A crisping tray with rack helps potato skins bake up crunchy.",
  },
  {
    recipeSlugs: ["pull-apart-pizza-bread"],
    title: "Nordic Ware 12-Cup Formed Bundt Pan",
    imageSrc: "/affiliates/nordic-ware-12cup-formed-bundt-pan.jpg",
    imageAlt: "Nordic Ware 12-cup formed Bundt pan",
    affiliateUrl: "https://link.amazon/B00Yx2LMw",
    blurb: "A formed Bundt pan that turns pull-apart pizza bread into a showpiece.",
    softCta: "A Bundt pan shapes pull-apart pizza bread into an easy pull-and-share loaf.",
  },
  {
    recipeSlugs: ["valentine-cookie"],
    title: "Ann Clark 3⅜-Inch Heart Cookie Cutter",
    imageSrc: "/affiliates/ann-clark-338in-heart-cookie-cutter.jpg",
    imageAlt: "Ann Clark 3 and 3/8 inch heart cookie cutter",
    affiliateUrl: "https://link.amazon/B0cKw2gmF",
    blurb: "A sturdy heart cutter for clean Valentine cookie shapes.",
    softCta: "A sturdy heart cutter makes clean Valentine cookie shapes.",
  },
  {
    recipeSlugs: ["buttermilk-pie"],
    title: "Emile Henry 9-Inch Deep Ceramic Pie Dish",
    imageSrc: "/affiliates/emile-henry-9in-deep-ceramic-pie-dish.jpg",
    imageAlt: "Emile Henry 9-inch deep ceramic pie dish",
    affiliateUrl: "https://link.amazon/B0dSdOPjj",
    blurb: "A deep ceramic pie dish for buttermilk pie with a sturdy crust edge.",
    softCta: "A deep ceramic pie dish helps buttermilk pie bake with a sturdy crust.",
  },
  {
    recipeSlugs: ["bow-tie-pasta-salad"],
    title: "Tramontina Signature 8-Quart Tri-Ply Stainless Steel Stockpot",
    imageSrc: "/affiliates/tramontina-signature-8qt-triply-stockpot.jpg",
    imageAlt: "Tramontina Signature 8-quart tri-ply stainless steel stockpot",
    affiliateUrl: "https://link.amazon/B0dUCesqI",
    blurb: "An 8-quart stockpot for boiling bow-tie pasta for big salad batches.",
    softCta: "An 8-quart stockpot gives bow-tie pasta plenty of room to cook.",
  },
  {
    recipeSlugs: ["millionaire-shortbread"],
    title: "USA Pan 8-Inch Square Cake Pan",
    imageSrc: "/affiliates/usa-pan-8in-square-cake-pan.jpg",
    imageAlt: "USA Pan 8-inch square cake pan",
    affiliateUrl: "https://link.amazon/B0bIg2KaG",
    blurb: "An 8-inch square pan for layered millionaire shortbread bars.",
    softCta: "An 8-inch square pan is ideal for layered millionaire shortbread.",
  },
  {
    recipeSlugs: ["lemon-pretzel-dessert"],
    title: "OXO Good Grips 8-Inch Glass Baking Dish with Lid",
    imageSrc: "/affiliates/oxo-8in-glass-baking-dish-lid.jpg",
    imageAlt: "OXO Good Grips 8-inch glass baking dish with lid",
    affiliateUrl: "https://link.amazon/B00Iontyk",
    blurb: "A lidded glass dish for lemon pretzel dessert layers and leftovers.",
    softCta: "A lidded glass dish keeps lemon pretzel dessert chilled and tidy.",
  },
  {
    recipeSlugs: ["wheat-waffles"],
    title: "Cuisinart Double Flip Belgian Waffle Maker",
    imageSrc: "/affiliates/cuisinart-double-flip-belgian-waffle-maker.jpg",
    imageAlt: "Cuisinart double flip Belgian waffle maker",
    affiliateUrl: "https://link.amazon/B0fHP7mvI",
    blurb: "A double-flip waffle maker for crisp wheat waffles in batches.",
    softCta: "A double-flip waffle maker helps wheat waffles cook evenly and crisp.",
  },
  {
    recipeSlugs: ["broccoli-potato-soup"],
    title: "Breville Control Grip Immersion Blender",
    imageSrc: "/affiliates/breville-control-grip-immersion-blender.jpg",
    imageAlt: "Breville Control Grip immersion blender",
    affiliateUrl: "https://link.amazon/B0a1bUMhx",
    blurb: "An immersion blender for silky broccoli potato soup right in the pot.",
    softCta: "An immersion blender makes broccoli potato soup silky without transferring pots.",
  },
  {
    recipeSlugs: ["chicken-chorizo"],
    title: "Tramontina Professional 12-Inch Nonstick Fry Pan",
    imageSrc: "/affiliates/tramontina-professional-12in-nonstick-fry-pan.jpg",
    imageAlt: "Tramontina Professional 12-inch nonstick fry pan",
    affiliateUrl: "https://link.amazon/B09i8nNNV",
    blurb: "A 12-inch nonstick skillet for browning seasoned chicken chorizo.",
    softCta: "A roomy nonstick skillet browns chicken chorizo without sticking.",
  },
  {
    recipeSlugs: ["antipasto-salad"],
    title: "Rubbermaid Brilliance 9.6-Cup Food Storage Containers, 2-Pack",
    imageSrc: "/affiliates/rubbermaid-brilliance-96cup-containers-2pk.jpg",
    imageAlt: "Rubbermaid Brilliance 9.6-cup food storage containers, 2-pack",
    affiliateUrl: "https://link.amazon/B09jAkOcM",
    blurb: "Clear leak-resistant containers for make-ahead antipasto salad.",
    softCta: "Clear storage containers keep antipasto salad ready for lunches.",
  },
  {
    recipeSlugs: ["butterfly-cupcakes"],
    title: "Wilton Gold Nonstick 12-Cup Muffin Pan",
    imageSrc: "/affiliates/wilton-gold-nonstick-12cup-muffin-pan.jpg",
    imageAlt: "Wilton Gold nonstick 12-cup muffin pan",
    affiliateUrl: "https://link.amazon/B0cRd7hXK",
    blurb: "A nonstick muffin pan for even butterfly cupcakes.",
    softCta: "A nonstick muffin pan helps butterfly cupcakes bake evenly.",
  },
  {
    recipeSlugs: ["bone-in-chuck-roast"],
    title: "Tramontina 6.5-Quart Enameled Cast Iron Dutch Oven",
    imageSrc: "/affiliates/tramontina-65qt-enameled-cast-iron-dutch-oven.jpg",
    imageAlt: "Tramontina 6.5-quart enameled cast iron Dutch oven",
    affiliateUrl: "https://link.amazon/B02wnBZZQ",
    blurb: "A Dutch oven for braising bone-in chuck roast low and slow.",
    softCta: "A Dutch oven is ideal for braising bone-in chuck roast until tender.",
  },
  {
    recipeSlugs: ["vanilla-cake-chocolate-frosting"],
    title: "KitchenAid 7-Speed Hand Mixer, Contour Silver",
    imageSrc: "/affiliates/kitchenaid-7speed-hand-mixer-contour-silver.jpg",
    imageAlt: "KitchenAid 7-speed hand mixer in contour silver",
    affiliateUrl: "https://link.amazon/B0fzu3ZT5",
    blurb: "A 7-speed hand mixer for vanilla cake batter and chocolate frosting.",
    softCta: "A hand mixer makes vanilla cake batter and chocolate frosting smooth.",
  },
  {
    recipeSlugs: ["beef-cubes"],
    title: "Lodge 12-Inch Dual-Handle Cast Iron Skillet",
    imageSrc: "/affiliates/lodge-12in-dual-handle-cast-iron-skillet.jpg",
    imageAlt: "Lodge 12-inch dual-handle cast iron skillet",
    affiliateUrl: "https://link.amazon/B06DnQ2qj",
    blurb: "A dual-handle cast-iron skillet for searing beef cubes hard and even.",
    softCta: "A cast-iron skillet gives beef cubes a deep, even sear.",
  },
  {
    recipeSlugs: ["pad-thai"],
    title: "Craft Wok 14-Inch Flat-Bottom Carbon Steel Wok",
    imageSrc: "/affiliates/craft-wok-14in-flat-bottom-carbon-steel.jpg",
    imageAlt: "Craft Wok 14-inch flat-bottom carbon steel wok",
    affiliateUrl: "https://link.amazon/B03DO5Tgz",
    blurb: "A flat-bottom carbon steel wok for high-heat pad Thai tosses.",
    softCta: "A carbon steel wok handles the high heat pad Thai needs.",
  },
  {
    recipeSlugs: ["whole-brisket"],
    title: "TempPro TP829 Wireless Four-Probe Meat Thermometer",
    imageSrc: "/affiliates/temppro-tp829-wireless-four-probe-thermometer.jpg",
    imageAlt: "TempPro TP829 wireless four-probe meat thermometer",
    affiliateUrl: "https://link.amazon/B05EewRdR",
    blurb: "Wireless probes for tracking a whole brisket across a long cook.",
    softCta: "Wireless probes help you track a whole brisket without opening the cooker.",
  },
  {
    recipeSlugs: ["pizza-sub"],
    title: "Cuisinart 5-in-1 Griddler and Panini Press",
    imageSrc: "/affiliates/cuisinart-5in1-griddler-panini-press.jpg",
    imageAlt: "Cuisinart 5-in-1 Griddler and panini press",
    affiliateUrl: "https://link.amazon/B0fIpPbM3",
    blurb: "A panini press for toasting pizza subs until the cheese melts.",
    softCta: "A panini press toasts pizza subs until the cheese is melted and gooey.",
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

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtmlText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Prefer a product with an explicit softCta; otherwise the first mapped product. */
export function getAmazonAffiliateSoftCtaProduct(
  products: AmazonAffiliateProduct[],
): AmazonAffiliateProduct | undefined {
  if (products.length === 0) return undefined;
  return (
    products.find((product) => Boolean(product.softCta?.trim())) ?? products[0]
  );
}

/** Soft Pro Tips line: custom softCta, else first blurb sentence, else title. */
export function resolveAmazonSoftCtaLine(
  product: AmazonAffiliateProduct,
): string {
  const explicit = product.softCta?.trim();
  if (explicit) {
    return /[.!?]$/.test(explicit) ? explicit : `${explicit}.`;
  }

  const blurb = product.blurb?.trim().replace(/\s+/g, " ");
  if (blurb) {
    const firstSentence = blurb.match(/^(.+?[.!?])(?:\s|$)/)?.[1] ?? blurb;
    if (firstSentence.length <= 140) {
      return /[.!?]$/.test(firstSentence)
        ? firstSentence
        : `${firstSentence}.`;
    }
    return `${firstSentence.slice(0, 137).replace(/\s+\S*$/, "")}…`;
  }

  const shortTitle = product.title
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return `${shortTitle} makes this recipe easier.`;
}

/** Inline soft CTA markup for injection under the Pro Tips heading. */
export function buildAmazonAffiliateSoftCtaHtml(
  product: AmazonAffiliateProduct,
): string {
  const line = resolveAmazonSoftCtaLine(product);
  if (!line) return "";

  const href = escapeHtmlAttr(product.affiliateUrl);
  const text = escapeHtmlText(line);

  return `<p class="amazon-soft-cta not-prose my-4 text-base leading-relaxed text-[#6b5b4f]"><span>${text}</span> <a href="${href}" target="_blank" rel="nofollow sponsored noopener noreferrer" class="font-semibold text-accent transition hover:text-accent-dark">View on Amazon</a></p>`;
}

/**
 * Inserts the soft CTA immediately after the Pro Tips &lt;h2&gt;.
 * No-op when there is no Pro Tips heading or no CTA HTML.
 */
export function injectAmazonSoftCtaAfterProTips(
  html: string,
  ctaHtml: string,
): string {
  if (!html || !ctaHtml) return html;

  const proTipsHeading =
    /(<h2\b[^>]*>[\s\S]*?Pro Tips[\s\S]*?<\/h2>)/i;
  if (!proTipsHeading.test(html)) return html;

  return html.replace(proTipsHeading, `$1${ctaHtml}`);
}
