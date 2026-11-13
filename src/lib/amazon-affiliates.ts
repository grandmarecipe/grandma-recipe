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
    recipeSlugs: ["gluten-free-christmas-dinner"],
    title: "All-Clad Stainless Steel Roasting Pan with Rack (16 × 13 in)",
    imageSrc: "/affiliates/all-clad-roasting-pan-with-rack.jpg",
    imageAlt: "All-Clad stainless steel roasting pan with rack, 16 by 13 inches",
    affiliateUrl: "https://link.amazon/B068edmSB",
    blurb:
      "A roomy roasting pan with a rack for holiday mains and vegetables.",
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
    recipeSlugs: ["christmas-eve-dinner"],
    title: "Wüsthof Classic 2-Piece Carving Set",
    imageSrc: "/affiliates/wusthof-classic-carving-set.jpg",
    imageAlt: "Wüsthof Classic carving knife and fork set",
    affiliateUrl: "https://link.amazon/B02F07CjX",
    blurb:
      "A carving knife and fork set for slicing the Christmas Eve roast cleanly at the table.",
  },
  {
    recipeSlugs: ["christmas-appetizers"],
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
