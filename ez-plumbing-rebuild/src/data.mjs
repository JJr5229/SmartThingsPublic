/**
 * Single source of truth for every fact that appears on the site.
 *
 * Rule for this file: if a value is wrong here, it is wrong everywhere — and
 * only here. The old site hard-coded the phone number into ~83 hand-edited
 * pages, which is how it ended up displaying 612.392.0832 while linking
 * tel:651-392-0832 on every single one of them.
 *
 * Verified 2026-07-31 against the Google Business Profile for
 * "EZ Plumbing & Drains", Blaine MN.
 */

export const business = {
  name: 'EZ Plumbing & Drains',
  legalName: 'EZ Plumbing & Drains',
  tagline: 'Twin Cities plumbing and drain service — answered live, 24 hours a day.',

  // --- NAP. Must match the Google Business Profile character for character. ---
  phone: '(651) 392-0832',
  phoneHref: 'tel:+16513920832',
  phoneE164: '+1-651-392-0832',

  email: 'info@ezplumbingmn.com',
  // The old site also exposed ezsewermn@gmail.com in the header. Kept here only
  // so the migration checklist can confirm it has been retired from public view.
  legacyEmail: 'ezsewermn@gmail.com',

  street: '1033 109th Ave NE',
  city: 'Blaine',
  region: 'MN',
  regionName: 'Minnesota',
  postal: '55434',
  country: 'US',
  lat: 45.1394,
  lng: -93.2336,

  hoursText: 'Open 24 hours, 7 days a week',
  emergencyText: '24/7 emergency service — a real person answers',

  // --- Reputation (from the Google Business Profile, 2026-07-31) ---
  rating: '4.9',
  reviewCount: 216,
  reviewsUrl: 'https://www.google.com/maps/search/EZ+Plumbing+%26+Drains+Blaine+MN',

  // --- Differentiators. All three are already published on the GBP and were
  //     completely absent from the old website. ---
  badges: [
    'Family owned & operated',
    'Latino-owned',
    'LGBTQ+ friendly',
  ],

  yearsExperience: 'nearly 20 years',

  /**
   * MN plumbing contractor license number.
   *
   * INTENTIONALLY BLANK. Minnesota requires licensed plumbing contractors to
   * identify themselves in advertising, and it is the single strongest trust
   * signal a plumber can put on a page. We will not invent one. Drop the real
   * number in here and it renders in the header, the footer, every service
   * page and the LocalBusiness schema automatically.
   */
  licenseNumber: '',

  social: {
    facebook: 'https://www.facebook.com/p/Ez-Plumbing-Drains-61565953922569/',
  },

  siteUrl: 'https://www.ezplumbingmn.com',

  brandsCarried: ['Bradford White', 'Rheem', 'Navien', 'Rinnai'],
};

export const colors = {
  // Sampled from the existing logo so the rebuild stays on-brand.
  blue: '#2E86DE',
  blueDeep: '#12395F',
  red: '#D00000',
  ink: '#14181D',
};

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export const services = [
  {
    slug: 'emergency-plumbing',
    nav: 'Emergency',
    name: 'Emergency Plumbing Repair',
    short: 'Burst pipes, no water, sewage backing up. Call any hour.',
    title: '24/7 Emergency Plumber | Minneapolis & St. Paul',
    metaDescription:
      'Burst pipe, sewer backup or no hot water? EZ Plumbing & Drains answers live 24 hours a day across the Twin Cities metro. Call (651) 392-0832.',
    icon: 'siren',
    intro:
      'Plumbing emergencies do not wait for business hours, and neither do we. Call (651) 392-0832 at any hour and a person picks up — not an answering service that takes a message and calls you back Monday.',
    problems: [
      'Burst or frozen supply line flooding a basement',
      'Sewage backing up into a floor drain, tub or shower',
      'No water anywhere in the house',
      'Water heater leaking from the tank body',
      'A leak you cannot shut off at the fixture',
      'Gas smell near a water heater or boiler',
    ],
    body: [
      'The first thing we do on an emergency call is stop the loss. That usually means isolating the failed section at the nearest working shutoff so the damage stops climbing while we diagnose. Only then do we talk about the repair.',
      'You get the price before we start. Emergency work is quoted up front, in writing, as a flat number for the repair in front of us — not an hourly meter that runs while you watch.',
      'If the fix turns out to be bigger than the emergency call (a failed sewer lateral rather than a single clog, say), we will tell you that on the spot, get you running temporarily where we can, and schedule the real repair rather than selling you a rush job at 2am.',
    ],
    faqs: [
      {
        q: 'Do you actually answer the phone at 3am?',
        a: 'Yes. The line is staffed around the clock, every day including holidays. You will speak to someone who can dispatch, not a voicemail box.',
      },
      {
        q: 'Is there an after-hours surcharge?',
        a: 'Any after-hours difference is included in the quote you approve before work begins. You will never learn about a surcharge from the invoice.',
      },
      {
        q: 'What should I do before you get there?',
        a: 'Shut off the water at the fixture if you can reach it, or at the main shutoff (usually in the basement near the front wall where the line enters). If a water heater is leaking, shut off the cold inlet on top of the tank. Then stop — do not run drains or flush toilets if sewage is backing up.',
      },
    ],
  },
  {
    slug: 'drain-cleaning',
    nav: 'Drain Cleaning',
    name: 'Drain Cleaning & Hydro Jetting',
    short: 'Snaking, hydro jetting and flex-shaft descaling for lines that keep backing up.',
    title: 'Drain Cleaning & Hydro Jetting | Twin Cities Plumber',
    metaDescription:
      'Slow drains or repeat backups? Snaking, hydro jetting, flex-shaft descaling and camera diagnosis across Minneapolis, St. Paul and the metro. Call (651) 392-0832.',
    icon: 'drain',
    intro:
      'A drain that clogs twice is not a clog problem. It is a line problem. We clear the blockage, then put a camera down to find out why it happened — so the third call does not happen.',
    problems: [
      'One fixture draining slowly',
      'Repeat backups in the same floor drain',
      'Gurgling toilets when the washing machine drains',
      'Sewage odor with no visible leak',
      'Multiple fixtures backing up at once (usually a main line)',
    ],
    body: [
      'For a simple branch-line clog, a cable machine is the right tool and the cheapest answer. We start there.',
      'For grease, scale and root intrusion in a main line, cabling just punches a hole through the blockage and buys you a few months. Hydro jetting scours the pipe wall back to full diameter with high-pressure water. Flex-shaft descaling does the same thing for heavy mineral scale inside cast iron without the water volume.',
      'Every main-line job includes a camera pass when we are done, so you can see the line is actually clear rather than taking our word for it. If the camera shows a break, a belly, an offset joint or a root mass we cannot cut, you get footage and a repair quote — not a monthly cabling subscription.',
    ],
    faqs: [
      {
        q: 'What is the difference between snaking and hydro jetting?',
        a: 'A snake (cable machine) bores a channel through a blockage. Hydro jetting uses high-pressure water to scour the full inside diameter of the pipe. Snaking restores flow; jetting restores the pipe. For grease and roots, jetting lasts far longer.',
      },
      {
        q: 'How often should a main line be cleaned?',
        a: 'A healthy line should not need scheduled cleaning at all. If yours does, something is wrong with the line — roots, scale, a belly or a partial collapse. A camera inspection tells you which, and what it costs to fix permanently.',
      },
      {
        q: 'Will hydro jetting damage old pipe?',
        a: 'Not when the line is inspected first. That is exactly why we camera the line before jetting anything questionable. If a section is too compromised to jet safely, we will tell you and recommend the repair instead.',
      },
    ],
  },
  {
    slug: 'water-heater-installation',
    nav: 'Water Heaters',
    name: 'Water Heater Installation & Repair',
    short: 'Tank and tankless. Bradford White, Rheem, Navien and Rinnai.',
    title: 'Water Heater Installation & Repair | Minneapolis, MN',
    metaDescription:
      'Tank and tankless water heater installation and repair across the Twin Cities. Bradford White, Rheem, Navien, Rinnai. Same-day replacement available. (651) 392-0832.',
    icon: 'heater',
    intro:
      'No hot water, rusty hot water, or a tank that is quietly rusting toward a flood. We repair what is worth repairing and replace what is not — and we will tell you honestly which one you are looking at.',
    problems: [
      'No hot water, or hot water that runs out fast',
      'Rusty or metallic-smelling hot water',
      'Popping or rumbling from the tank',
      'Water pooling under the heater',
      'A tank past 10–12 years old',
    ],
    body: [
      'A leak from a fitting on top of the tank is a repair. A leak from the tank body is not — the glass lining has failed and the tank is going to open up. Anyone who quotes you a repair on a weeping tank body is selling you a delay.',
      'For replacements we install Bradford White and Rheem tanks, and Navien and Rinnai for high-efficiency tankless. Tankless is a genuinely better answer for some homes and a waste of money in others; it depends on your gas line size, venting path, and how your household actually uses hot water. We will walk you through both.',
      'Installations include correct venting, a new expansion tank where code requires it, a proper drip leg on the gas line, code-compliant T&P discharge, and hauling the old unit away. We pull permits where the city requires them.',
    ],
    faqs: [
      {
        q: 'How long does a water heater last in Minnesota?',
        a: 'Ten to twelve years is typical for a tank unit on municipal water. Hard water shortens that — sediment builds on the bottom of the tank and cooks the lining. Annual flushing helps meaningfully.',
      },
      {
        q: 'Is tankless worth it?',
        a: 'It is, if you have the gas capacity and venting for it and your household runs long or overlapping hot-water draws. If you have a small gas service and a two-person household, a good tank unit is the better value. We quote both so you can compare real numbers.',
      },
      {
        q: 'Can you replace it the same day?',
        a: 'Usually yes for common tank sizes. Tankless conversions need gas and venting work and are normally scheduled.',
      },
    ],
  },
  {
    slug: 'sewer-repair',
    nav: 'Sewer Repair',
    name: 'Sewer Line Repair & Replacement',
    short: 'Spot repairs, relining, dig-ups and full replacements.',
    title: 'Sewer Line Repair & Replacement | Twin Cities Metro',
    metaDescription:
      'Root intrusion, collapsed pipe, offsets and bellies. Spot repairs, sewer relining, excavation and full replacement across the Twin Cities. Call (651) 392-0832.',
    icon: 'pipe',
    intro:
      'Sewer work is the most expensive thing most homeowners will ever buy from a plumber, which is exactly why it should start with a camera and a locate — not a quote.',
    problems: [
      'Repeat main-line backups after cabling',
      'Root intrusion at pipe joints',
      'A collapsed or offset section',
      'Bellies holding standing water and solids',
      'Heavy scale inside old cast iron',
      'A city inspection or point-of-sale repair order',
    ],
    body: [
      'We camera the line and locate the defect on the surface before quoting anything, so you know exactly where the problem is, how deep it sits, and how much of the line is actually bad. A great many "full replacement" quotes are really an eight-foot spot repair.',
      'Depending on what the camera shows, the right answer is a spot repair, sectional or full-length relining (no trench, cured in place), or open-cut excavation and replacement. Relining is faster and saves the landscaping and driveway; excavation is the correct call for a collapse or a severe belly that relining would simply preserve.',
      'You get the camera footage either way. It is your pipe.',
    ],
    faqs: [
      {
        q: 'How do I know if it is roots or a collapse?',
        a: 'A camera inspection shows it directly. Roots appear as a fibrous mass at a joint; a collapse shows as pipe that has lost its round shape or as a hard stop the camera cannot pass. The two have very different repair costs, which is why guessing is expensive.',
      },
      {
        q: 'Do I need to dig up my yard?',
        a: 'Often not. Cured-in-place relining rehabilitates the existing pipe from the inside through a single access point. It is not appropriate for a full collapse or a significant belly, and we will say so rather than reline a pipe that needs replacing.',
      },
      {
        q: 'Does homeowners insurance cover sewer lines?',
        a: 'The line itself usually is not covered, but resulting water damage sometimes is, and many carriers sell a service-line rider. Check your policy — and keep the camera footage, because carriers ask for it.',
      },
    ],
  },
  {
    slug: 'camera-inspection',
    nav: 'Camera Inspection',
    name: 'Sewer Camera Inspection',
    short: 'High-resolution video and surface locating before you spend money.',
    title: 'Sewer Camera Inspection | Minneapolis & St. Paul',
    metaDescription:
      'High-resolution sewer camera inspection with surface locating across the Twin Cities. Know what is wrong before you pay to fix it. Call (651) 392-0832.',
    icon: 'camera',
    intro:
      'The cheapest money you can spend on a sewer line is the camera pass that tells you whether you need to spend the rest of it.',
    problems: [
      'Buying a home built before 1980',
      'Repeat backups with no obvious cause',
      'Sewer odor without a visible leak',
      'Sinkholes or unexplained wet spots in the yard',
      'Before committing to any major sewer quote',
    ],
    body: [
      'We run a high-resolution camera the full length of the lateral to the city main, recording the whole pass. Where we find a defect, we locate it on the surface and mark it, with depth — so any repair quote you get afterward is about a known point, not a guess.',
      'Home buyers: a pre-purchase camera inspection is the single highest-value inspection add-on in this metro. Twin Cities housing stock is old enough that clay and cast-iron laterals are common, and a failed lateral is a five-figure surprise that a standard home inspection will not catch.',
      'You keep the footage.',
    ],
    faqs: [
      {
        q: 'Do I get a copy of the video?',
        a: 'Yes. You get the footage and the locate marks, whether or not you hire us for the repair.',
      },
      {
        q: 'Can you inspect before I buy a house?',
        a: 'Yes, and we recommend it for anything built before roughly 1980, or any home where the lateral has never been documented. We can usually work inside an inspection contingency window.',
      },
      {
        q: 'Does the drain need to be clear first?',
        a: 'Ideally. A camera cannot see through standing sewage. If the line is blocked we clear it first, then inspect — and the inspection is what tells us why it blocked.',
      },
    ],
  },
  {
    slug: 'water-filtration',
    nav: 'Water Filtration',
    name: 'Water Softeners & Filtration',
    short: 'Softeners, iron filters, reverse osmosis and whole-house sediment.',
    title: 'Water Softeners & Filtration Systems | Twin Cities',
    metaDescription:
      'Water softeners, iron filtration, whole-house sediment filters and reverse osmosis for Twin Cities homes and businesses. Call (651) 392-0832.',
    icon: 'drop',
    intro:
      'Most of this metro is on hard water, and hard water is not just a nuisance — it is what kills water heaters early and scales the inside of your pipes.',
    problems: [
      'White scale on fixtures and glassware',
      'Soap that will not lather',
      'Orange or rust staining in sinks and toilets',
      'A rotten-egg smell from the hot side',
      'Sediment in aerators and fill valves',
      'Water heaters failing well before 10 years',
    ],
    body: [
      'A softener handles hardness — the calcium and magnesium that scale your heater and your pipes. Iron filtration is a separate problem and a separate unit; softeners will strip a small amount of iron but get fouled by a lot of it, which is why so many softeners fail early on iron-heavy water.',
      'A whole-house sediment filter protects everything downstream from grit, which matters most on private wells and on municipal lines after main work. Reverse osmosis is a point-of-use system, normally under the kitchen sink, for drinking and cooking water.',
      'We test first. There is no reason to buy a system for a problem your water does not have.',
    ],
    faqs: [
      {
        q: 'Do I need a softener if I am on city water?',
        a: 'Frequently, yes. Municipal supply across much of the Twin Cities metro is genuinely hard. A test takes minutes and settles it.',
      },
      {
        q: 'Will a softener fix rust stains?',
        a: 'Not on its own. Rust staining is iron, and heavy iron needs dedicated iron filtration ahead of the softener — otherwise it fouls the resin bed and shortens the softener\'s life.',
      },
      {
        q: 'Is reverse osmosis the same as a whole-house filter?',
        a: 'No. RO is point-of-use — one tap, usually the kitchen — and produces very high purity drinking water. A whole-house filter treats everything entering the building but far less aggressively. Many homes use both.',
      },
    ],
  },
];

export const serviceBySlug = Object.fromEntries(services.map((s) => [s.slug, s]));

/* ------------------------------------------------------------------ */
/* Service area                                                        */
/* ------------------------------------------------------------------ */

/**
 * vintage drives the "what we actually see in this city" paragraph. It is the
 * difference between 74 genuinely useful local pages and 74 pages of the same
 * paragraph with the city name swapped — which is what most contractor sites
 * ship and what Google discounts.
 *
 *   urban    pre-1950 housing stock, clay/cast-iron laterals, galvanized supply
 *   postwar  1950s-70s ring suburb, cast iron stacks at end of life
 *   growth   1980s+ development, PVC/ABS, softening and tankless upgrades
 *   lake     lake community, converted seasonal homes, long runs, some wells
 */
export const cities = [
  { name: 'Anoka', county: 'Anoka', vintage: 'urban' },
  { name: 'Apple Valley', county: 'Dakota', vintage: 'growth' },
  { name: 'Arden Hills', county: 'Ramsey', vintage: 'postwar' },
  { name: 'Bayport', county: 'Washington', vintage: 'urban' },
  { name: 'Birchwood Village', county: 'Washington', vintage: 'lake' },
  { name: 'Blaine', county: 'Anoka', vintage: 'growth' },
  { name: 'Bloomington', county: 'Hennepin', vintage: 'postwar' },
  { name: 'Brooklyn Center', county: 'Hennepin', vintage: 'postwar' },
  { name: 'Brooklyn Park', county: 'Hennepin', vintage: 'postwar' },
  { name: 'Burnsville', county: 'Dakota', vintage: 'postwar' },
  { name: 'Centerville', county: 'Anoka', vintage: 'growth' },
  { name: 'Champlin', county: 'Hennepin', vintage: 'growth' },
  { name: 'Chanhassen', county: 'Carver', vintage: 'growth' },
  { name: 'Chaska', county: 'Carver', vintage: 'growth' },
  { name: 'Circle Pines', county: 'Anoka', vintage: 'postwar' },
  { name: 'Columbia Heights', county: 'Anoka', vintage: 'urban' },
  { name: 'Coon Rapids', county: 'Anoka', vintage: 'postwar' },
  { name: 'Cottage Grove', county: 'Washington', vintage: 'growth' },
  { name: 'Crystal', county: 'Hennepin', vintage: 'postwar' },
  { name: 'Deephaven', county: 'Hennepin', vintage: 'lake' },
  { name: 'Eagan', county: 'Dakota', vintage: 'growth' },
  { name: 'Eden Prairie', county: 'Hennepin', vintage: 'growth' },
  { name: 'Edina', county: 'Hennepin', vintage: 'postwar' },
  { name: 'Excelsior', county: 'Hennepin', vintage: 'lake' },
  { name: 'Falcon Heights', county: 'Ramsey', vintage: 'postwar' },
  { name: 'Farmington', county: 'Dakota', vintage: 'growth' },
  { name: 'Fridley', county: 'Anoka', vintage: 'postwar' },
  { name: 'Golden Valley', county: 'Hennepin', vintage: 'postwar' },
  { name: 'Grant', county: 'Washington', vintage: 'lake' },
  { name: 'Greenwood', county: 'Hennepin', vintage: 'lake' },
  { name: 'Hastings', county: 'Dakota', vintage: 'urban' },
  { name: 'Hilltop', county: 'Anoka', vintage: 'postwar' },
  { name: 'Hopkins', county: 'Hennepin', vintage: 'urban' },
  { name: 'Hugo', county: 'Washington', vintage: 'growth' },
  { name: 'Inver Grove Heights', county: 'Dakota', vintage: 'growth' },
  { name: 'Lakeville', county: 'Dakota', vintage: 'growth' },
  { name: 'Landfall', county: 'Washington', vintage: 'postwar' },
  { name: 'Lauderdale', county: 'Ramsey', vintage: 'postwar' },
  { name: 'Lexington', county: 'Anoka', vintage: 'postwar' },
  { name: 'Lilydale', county: 'Dakota', vintage: 'lake' },
  { name: 'Lino Lakes', county: 'Anoka', vintage: 'growth' },
  { name: 'Little Canada', county: 'Ramsey', vintage: 'postwar' },
  { name: 'Long Lake', county: 'Hennepin', vintage: 'lake' },
  { name: 'Maple Grove', county: 'Hennepin', vintage: 'growth' },
  { name: 'Maplewood', county: 'Ramsey', vintage: 'postwar' },
  { name: 'Medina', county: 'Hennepin', vintage: 'growth' },
  { name: 'Mendota Heights', county: 'Dakota', vintage: 'postwar' },
  { name: 'Minneapolis', county: 'Hennepin', vintage: 'urban' },
  { name: 'Minnetonka', county: 'Hennepin', vintage: 'postwar' },
  { name: 'Minnetonka Beach', county: 'Hennepin', vintage: 'lake' },
  { name: 'Mound', county: 'Hennepin', vintage: 'lake' },
  { name: 'Mounds View', county: 'Ramsey', vintage: 'postwar' },
  { name: 'New Brighton', county: 'Ramsey', vintage: 'postwar' },
  { name: 'New Hope', county: 'Hennepin', vintage: 'postwar' },
  { name: 'North Oaks', county: 'Ramsey', vintage: 'lake' },
  { name: 'North Saint Paul', county: 'Ramsey', vintage: 'urban' },
  { name: 'Oak Park Heights', county: 'Washington', vintage: 'growth' },
  { name: 'Osseo', county: 'Hennepin', vintage: 'urban' },
  { name: 'Plymouth', county: 'Hennepin', vintage: 'growth' },
  { name: 'Robbinsdale', county: 'Hennepin', vintage: 'urban' },
  { name: 'Saint Louis Park', county: 'Hennepin', vintage: 'urban' },
  { name: 'Saint Paul', county: 'Ramsey', vintage: 'urban' },
  { name: 'Saint Paul Park', county: 'Washington', vintage: 'urban' },
  { name: 'Shakopee', county: 'Scott', vintage: 'growth' },
  { name: 'Shoreview', county: 'Ramsey', vintage: 'growth' },
  { name: 'South Saint Paul', county: 'Dakota', vintage: 'urban' },
  { name: 'Spring Lake Park', county: 'Anoka', vintage: 'postwar' },
  { name: 'Spring Park', county: 'Hennepin', vintage: 'lake' },
  { name: 'Stillwater', county: 'Washington', vintage: 'urban' },
  { name: 'Sunfish Lake', county: 'Dakota', vintage: 'lake' },
  { name: 'Tonka Bay', county: 'Hennepin', vintage: 'lake' },
  { name: 'Wayzata', county: 'Hennepin', vintage: 'lake' },
  { name: 'West Saint Paul', county: 'Dakota', vintage: 'urban' },
  { name: 'White Bear Lake', county: 'Ramsey', vintage: 'lake' },
].map((c) => ({
  ...c,
  slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
}));

export const vintageCopy = {
  urban: {
    label: 'older housing stock',
    paragraph:
      'Much of {city} was built before 1950, and that shows up in the plumbing. We spend a lot of time here on clay and cast-iron sewer laterals with root intrusion at the joints, galvanized supply lines that have narrowed to a trickle, and cast-iron drain stacks that have scaled shut behind the wall. None of that is a reason to panic — it is just what pipe of that age does, and it is all repairable. It does mean that if your drains are slow in a {city} home, a camera pass is worth far more than another round of cabling.',
    lead: 'roots, scale and aging cast iron',
  },
  postwar: {
    label: 'postwar suburban housing',
    paragraph:
      'Most of {city} filled in between the 1950s and the 1970s, which puts a lot of the original cast-iron waste piping right at the end of its service life and means most homes here are on their third or fourth water heater. The two calls we take most often in {city} are drain stacks that have scaled down to a fraction of their diameter and tanks that have quietly started weeping at the base. Both are far cheaper to handle before they fail than after.',
    lead: 'aging cast iron and end-of-life water heaters',
  },
  growth: {
    label: 'newer construction',
    paragraph:
      '{city} grew mostly from the 1980s onward, so the drain and supply piping is generally modern PVC and copper or PEX, and the sewer laterals are in good shape. What we get called for in {city} is different: hard water chewing through water heaters early, softener and iron-filter work, tankless conversions, and the occasional main-line clog from a line that has never been cleaned. Newer pipe is a real advantage — it means most problems here are solvable without opening the ground.',
    lead: 'water treatment and water heater work',
  },
  lake: {
    label: 'lake-country properties',
    paragraph:
      'Around {city}, a good share of the housing started as seasonal lake property and was converted to year-round living, sometimes more than once. That produces plumbing with a history: long supply runs, additions plumbed into undersized branch lines, older laterals on odd routes, and in some spots private wells and softeners doing more work than they were sized for. It pays to have somebody look at the whole system rather than the one fixture that is misbehaving.',
    lead: 'converted seasonal properties and long service runs',
  },
};

/* ------------------------------------------------------------------ */
/* Site-wide FAQs (rendered with FAQPage schema on the homepage)       */
/* ------------------------------------------------------------------ */

export const homeFaqs = [
  {
    q: 'Are you really available 24 hours a day?',
    a: 'Yes. (651) 392-0832 is answered live around the clock, every day of the year, including holidays. That is not an answering service taking a message — it is someone who can dispatch a truck.',
  },
  {
    q: 'What does a service call cost?',
    a: 'You get a flat, written price for the work before anything starts, and it does not change unless the scope does. We do not bill by the hour on residential service work, so a slow repair is our problem rather than yours.',
  },
  {
    q: 'What areas do you cover?',
    a: 'The full Twin Cities metro — 74 cities across Anoka, Hennepin, Ramsey, Dakota, Washington, Carver and Scott counties. If your city is not on our service-area page, call anyway; the list is where we go routinely, not a fence.',
  },
  {
    q: 'Do you handle commercial work?',
    a: 'Yes. Restaurants, retail, offices, multi-unit residential and light industrial. Commercial grease lines, main-line jetting and code-driven repairs are a regular part of the work.',
  },
  {
    q: 'Are you licensed and insured?',
    a: 'Yes — licensed, bonded and insured in the State of Minnesota. We are happy to send our certificate of insurance before we come out on any commercial job.',
  },
  {
    q: 'How fast can you get here?',
    a: 'For a true emergency, as fast as a truck can reach you — we are based in Blaine and cover the metro. For scheduled work we book in arrival windows rather than telling you "sometime Tuesday" and leaving you to wait.',
  },
];

/* ------------------------------------------------------------------ */
/* "Why us" — every claim here is verifiable on the Google profile     */
/* ------------------------------------------------------------------ */

export const differentiators = [
  {
    icon: 'clock',
    title: 'Answered live, 24/7',
    body: 'Every hour of every day, including holidays. Not an answering service.',
  },
  {
    icon: 'tag',
    title: 'Flat price before we start',
    body: 'You approve a written number first. No hourly meter, no surprises on the invoice.',
  },
  {
    icon: 'camera',
    title: 'We show you the pipe',
    body: 'Camera footage on every main-line job. You keep the video, whether or not you hire us for the repair.',
  },
  {
    icon: 'home',
    title: 'Family owned, nearly 20 years',
    body: 'Locally owned and operated out of Blaine. The person who quotes it is accountable for it.',
  },
];
