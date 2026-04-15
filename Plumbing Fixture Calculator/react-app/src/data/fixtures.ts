export interface Fixture {
  id: string;
  name: string;
  category: string;
  dfu: number;
  hotWSFU: number;
  coldWSFU: number;
  combinedWSFU: number;
  isFlushValve: boolean;
  note?: string;
}

// Flush valve fixtures: urinals (rows 32,33) and flush valve WCs (rows 40,41,42)
// per Excel Q64: SUM(L42,L41,L40,L32,L33) determines system type
const PINT_URINAL_NOTE =
  'Code does not contain WSFU values for 0.125 GPF urinals. ' +
  "Values shown are Henderson's estimates and are less than code values. " +
  'Do not use in jurisdictions requiring fixture units on plans.';

export const FIXTURES: Fixture[] = [
  // ── BATHROOM GROUPS ──────────────────────────────────────────────────────
  {
    id: 'bg-16-ft',
    name: 'Bathroom Group (1.6 GPF Flush Tank)',
    category: 'Bathroom Groups',
    dfu: 5, hotWSFU: 1.5, coldWSFU: 2.7, combinedWSFU: 3.6,
    isFlushValve: false,
  },
  {
    id: 'bg-35-ft',
    name: 'Bathroom Group (3.5 GPF Flush Tank)',
    category: 'Bathroom Groups',
    dfu: 6, hotWSFU: 3, coldWSFU: 6, combinedWSFU: 8,
    isFlushValve: false,
  },

  // ── WATER CLOSETS ────────────────────────────────────────────────────────
  {
    id: 'wc-private-16-ft',
    name: 'Private Water Closet (1.6 GPF Flush Tank)',
    category: 'Water Closets',
    dfu: 3, hotWSFU: 0, coldWSFU: 2.2, combinedWSFU: 2.2,
    isFlushValve: false,
  },
  {
    id: 'wc-public-16-ft',
    name: 'Public Water Closet (1.6 GPF Flush Tank)',
    category: 'Water Closets',
    dfu: 4, hotWSFU: 0, coldWSFU: 5, combinedWSFU: 5,
    isFlushValve: false,
  },
  {
    id: 'wc-private-16-flushmtr',
    name: 'Private Water Closet (1.6 GPF Flushometer Tank)',
    category: 'Water Closets',
    dfu: 4, hotWSFU: 0, coldWSFU: 2, combinedWSFU: 2,
    isFlushValve: false,
  },
  {
    id: 'wc-private-16-fv',
    name: 'Private Water Closet (1.6 GPF Flush Valve)',
    category: 'Water Closets',
    dfu: 3, hotWSFU: 0, coldWSFU: 6, combinedWSFU: 6,
    isFlushValve: true,
  },
  {
    id: 'wc-public-16-fv',
    name: 'Public Water Closet (1.6 GPF Flush Valve)',
    category: 'Water Closets',
    dfu: 4, hotWSFU: 0, coldWSFU: 10, combinedWSFU: 10,
    isFlushValve: true,
  },
  {
    id: 'wc-public-35-fv',
    name: 'Public Water Closet (3.5 GPF Flush Valve)',
    category: 'Water Closets',
    dfu: 6, hotWSFU: 0, coldWSFU: 10, combinedWSFU: 10,
    isFlushValve: true,
  },

  // ── URINALS ───────────────────────────────────────────────────────────────
  {
    id: 'urinal-10',
    name: 'Urinal (1.0 GPF)',
    category: 'Urinals',
    dfu: 2, hotWSFU: 0, coldWSFU: 5, combinedWSFU: 5,
    isFlushValve: true,
  },
  {
    id: 'urinal-pint',
    name: 'Urinal (0.125 GPF Pint)',
    category: 'Urinals',
    dfu: 2, hotWSFU: 0, coldWSFU: 2, combinedWSFU: 2,
    isFlushValve: true,
    note: PINT_URINAL_NOTE,
  },
  {
    id: 'urinal-waterless',
    name: 'Urinal (Waterless)',
    category: 'Urinals',
    dfu: 0.5, hotWSFU: 0, coldWSFU: 0, combinedWSFU: 0,
    isFlushValve: false,
  },

  // ── LAVATORIES ───────────────────────────────────────────────────────────
  {
    id: 'lav-private',
    name: 'Private Lavatory',
    category: 'Lavatories',
    dfu: 1, hotWSFU: 0.5, coldWSFU: 0.5, combinedWSFU: 0.7,
    isFlushValve: false,
  },
  {
    id: 'lav-public',
    name: 'Public Lavatory',
    category: 'Lavatories',
    dfu: 1, hotWSFU: 1.5, coldWSFU: 1.5, combinedWSFU: 2,
    isFlushValve: false,
  },

  // ── BATHING ──────────────────────────────────────────────────────────────
  {
    id: 'bathtub',
    name: 'Bathtub (Private)',
    category: 'Bathing',
    dfu: 2, hotWSFU: 1, coldWSFU: 1, combinedWSFU: 1.4,
    isFlushValve: false,
  },
  {
    id: 'bidet',
    name: 'Bidet',
    category: 'Bathing',
    dfu: 1, hotWSFU: 1.5, coldWSFU: 1.5, combinedWSFU: 2,
    isFlushValve: false,
  },
  {
    id: 'shower-private',
    name: 'Shower (Private — One Head)',
    category: 'Bathing',
    dfu: 2, hotWSFU: 1, coldWSFU: 1, combinedWSFU: 1.4,
    isFlushValve: false,
  },
  {
    id: 'shower-public',
    name: 'Shower (Public — Each Head)',
    category: 'Bathing',
    dfu: 2, hotWSFU: 3, coldWSFU: 3, combinedWSFU: 4,
    isFlushValve: false,
  },

  // ── SINKS ────────────────────────────────────────────────────────────────
  {
    id: 'sink-private',
    name: 'Private Sink (Bar, Kitchen or Breakroom)',
    category: 'Sinks',
    dfu: 2, hotWSFU: 1, coldWSFU: 1, combinedWSFU: 1.4,
    isFlushValve: false,
  },
  {
    id: 'sink-public',
    name: 'Public Sink (Kitchen or Breakroom)',
    category: 'Sinks',
    dfu: 2, hotWSFU: 3, coldWSFU: 3, combinedWSFU: 4,
    isFlushValve: false,
  },
  {
    id: 'sink-flushing-rim',
    name: 'Sink (Flushing Rim)',
    category: 'Sinks',
    dfu: 6, hotWSFU: 3, coldWSFU: 3, combinedWSFU: 4,
    isFlushValve: false,
  },
  {
    id: 'sink-wash-fountain',
    name: 'Sink (Wash Fountain, per Head)',
    category: 'Sinks',
    dfu: 2, hotWSFU: 1, coldWSFU: 1, combinedWSFU: 1.4,
    isFlushValve: false,
  },
  {
    id: 'sink-service',
    name: 'Service Sink (Mop Basin)',
    category: 'Sinks',
    dfu: 3, hotWSFU: 2.25, coldWSFU: 2.25, combinedWSFU: 3,
    isFlushValve: false,
  },
  {
    id: 'sink-clinical',
    name: 'Clinical Service Sink',
    category: 'Sinks',
    dfu: 6, hotWSFU: 1.5, coldWSFU: 8, combinedWSFU: 8,
    isFlushValve: false,
  },
  {
    id: 'sink-laundry-tub',
    name: 'Private Laundry Tub',
    category: 'Sinks',
    dfu: 2, hotWSFU: 2, coldWSFU: 2, combinedWSFU: 3,
    isFlushValve: false,
  },

  // ── DISHWASHERS ──────────────────────────────────────────────────────────
  {
    id: 'dishwasher-res',
    name: 'Dishwasher (Residential)',
    category: 'Dishwashers',
    dfu: 2, hotWSFU: 1.4, coldWSFU: 0, combinedWSFU: 1.4,
    isFlushValve: false,
  },
  {
    id: 'dishwasher-rest',
    name: 'Dishwasher (Restaurant) (2″ IW)',
    category: 'Dishwashers',
    dfu: 3, hotWSFU: 6, coldWSFU: 0, combinedWSFU: 6,
    isFlushValve: false,
  },

  // ── CLOTHES WASHERS ──────────────────────────────────────────────────────
  {
    id: 'washer-private',
    name: 'Private Clothes Washer Residential',
    category: 'Clothes Washers',
    dfu: 2, hotWSFU: 1, coldWSFU: 1, combinedWSFU: 1.4,
    isFlushValve: false,
  },
  {
    id: 'washer-public',
    name: 'Public Clothes Washer Residential',
    category: 'Clothes Washers',
    dfu: 3, hotWSFU: 3, coldWSFU: 3, combinedWSFU: 4,
    isFlushValve: false,
  },
  {
    id: 'washer-commercial',
    name: 'Commercial Washer Extractor',
    category: 'Clothes Washers',
    dfu: 6, hotWSFU: 7.5, coldWSFU: 7.5, combinedWSFU: 10,
    isFlushValve: false,
  },

  // ── HYDRANTS ─────────────────────────────────────────────────────────────
  {
    id: 'hydrant-wall',
    name: 'Wall Hydrant',
    category: 'Hydrants & Drains',
    dfu: 0, hotWSFU: 0, coldWSFU: 5, combinedWSFU: 5,
    isFlushValve: false,
  },
  {
    id: 'hydrant-wall-nf',
    name: 'Wall Hydrant (Non-Freeze)',
    category: 'Hydrants & Drains',
    dfu: 0, hotWSFU: 0, coldWSFU: 5, combinedWSFU: 5,
    isFlushValve: false,
  },
  {
    id: 'floor-drain',
    name: 'Floor Drain',
    category: 'Hydrants & Drains',
    dfu: 2, hotWSFU: 0, coldWSFU: 0, combinedWSFU: 0,
    isFlushValve: false,
  },
  {
    id: 'drinking-fountain',
    name: 'Drinking Fountain',
    category: 'Hydrants & Drains',
    dfu: 0.5, hotWSFU: 0, coldWSFU: 0.25, combinedWSFU: 0.25,
    isFlushValve: false,
  },

  // ── SPECIALTY KITCHEN ────────────────────────────────────────────────────
  {
    id: 'disposer-2in',
    name: 'Disposer (2″ Trap)',
    category: 'Specialty Kitchen',
    dfu: 3, hotWSFU: 0, coldWSFU: 2, combinedWSFU: 2,
    isFlushValve: false,
  },
  {
    id: 'disposer-3in',
    name: 'Disposer (3″ Trap)',
    category: 'Specialty Kitchen',
    dfu: 5, hotWSFU: 0, coldWSFU: 2, combinedWSFU: 2,
    isFlushValve: false,
  },
  {
    id: 'pre-scrapper',
    name: 'Pre-Scrapper',
    category: 'Specialty Kitchen',
    dfu: 2, hotWSFU: 1.5, coldWSFU: 1.5, combinedWSFU: 2,
    isFlushValve: false,
  },
  {
    id: 'sink-bar-iw',
    name: 'Sink — Bar (1½″ IW)',
    category: 'Specialty Kitchen',
    dfu: 2, hotWSFU: 1.5, coldWSFU: 1.5, combinedWSFU: 2,
    isFlushValve: false,
  },
  {
    id: 'sink-dump-iw',
    name: 'Sink — Dump (1½″ IW)',
    category: 'Specialty Kitchen',
    dfu: 2, hotWSFU: 1.5, coldWSFU: 1.5, combinedWSFU: 2,
    isFlushValve: false,
  },
  {
    id: 'sink-hand-iw',
    name: 'Sink — Hand (1½″ IW)',
    category: 'Specialty Kitchen',
    dfu: 2, hotWSFU: 1.5, coldWSFU: 1.5, combinedWSFU: 2,
    isFlushValve: false,
  },
  {
    id: 'sink-prep-iw',
    name: 'Sink — Prep/Veggie (2″ IW)',
    category: 'Specialty Kitchen',
    dfu: 3, hotWSFU: 1.5, coldWSFU: 1.5, combinedWSFU: 2,
    isFlushValve: false,
  },
  {
    id: 'sink-2comp-iw',
    name: 'Sink — 2 Compartment (2″ IW)',
    category: 'Specialty Kitchen',
    dfu: 3, hotWSFU: 1.5, coldWSFU: 1.5, combinedWSFU: 2,
    isFlushValve: false,
  },
  {
    id: 'sink-3comp-iw',
    name: 'Sink — 3 Compartment (2″ IW)',
    category: 'Specialty Kitchen',
    dfu: 3, hotWSFU: 3, coldWSFU: 3, combinedWSFU: 4,
    isFlushValve: false,
  },
  {
    id: 'kettle-iw',
    name: 'Kettle (2″ IW)',
    category: 'Specialty Kitchen',
    dfu: 3, hotWSFU: 1.5, coldWSFU: 1.5, combinedWSFU: 2,
    isFlushValve: false,
  },
  {
    id: 'ice-machine',
    name: 'Ice Machine (¾″ IW)',
    category: 'Specialty Kitchen',
    dfu: 0.5, hotWSFU: 0, coldWSFU: 1, combinedWSFU: 1,
    isFlushValve: false,
  },
  {
    id: 'hot-food-table',
    name: 'Hot Food Table (¾″ IW)',
    category: 'Specialty Kitchen',
    dfu: 0.5, hotWSFU: 0.75, coldWSFU: 0.75, combinedWSFU: 1,
    isFlushValve: false,
  },
  {
    id: 'dipper-well',
    name: 'Dipper Well (¾″ IW)',
    category: 'Specialty Kitchen',
    dfu: 0.5, hotWSFU: 0, coldWSFU: 0.75, combinedWSFU: 0.75,
    isFlushValve: false,
  },
  {
    id: 'coffee-maker',
    name: 'Coffee Maker (¾″ IW)',
    category: 'Specialty Kitchen',
    dfu: 0.5, hotWSFU: 0, coldWSFU: 0.5, combinedWSFU: 0.5,
    isFlushValve: false,
  },
  {
    id: 'tea-maker',
    name: 'Tea Maker (¾″ IW)',
    category: 'Specialty Kitchen',
    dfu: 0.5, hotWSFU: 0, coldWSFU: 0.5, combinedWSFU: 0.5,
    isFlushValve: false,
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino Machine (¾″ IW)',
    category: 'Specialty Kitchen',
    dfu: 0.5, hotWSFU: 0, coldWSFU: 0.5, combinedWSFU: 0.5,
    isFlushValve: false,
  },
  {
    id: 'carbonator',
    name: 'Carbonator',
    category: 'Specialty Kitchen',
    dfu: 0.5, hotWSFU: 0, coldWSFU: 0.5, combinedWSFU: 0.5,
    isFlushValve: false,
  },

  // ── MISC CONTINUOUS FLOW ─────────────────────────────────────────────────
  // Each unit = 1 GPM continuous flow. DFU = 1/7.5 per GPM per IPC.
  {
    id: 'misc-continuous',
    name: 'Misc. Continuous Flow (enter qty in GPM)',
    category: 'Miscellaneous',
    dfu: 1 / 7.5,
    hotWSFU: 0,
    coldWSFU: 1 / 7.5,
    combinedWSFU: 1 / 7.5,
    isFlushValve: false,
  },
];

export const CATEGORIES = Array.from(new Set(FIXTURES.map((f) => f.category)));
