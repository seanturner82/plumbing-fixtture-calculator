export interface Fixture {
  id: string;
  name: string;
  category: string;
  section: 'standard' | 'specialty-kitchen';
  dfu: number;
  hotWSFU: number;
  coldWSFU: number;
  combinedWSFU: number;
  isFlushValve: boolean;
  note?: string;
}

const PINT_URINAL_NOTE =
  'Code does not contain WSFU values for 0.125 GPF urinals. ' +
  "Values shown are Henderson's estimates and are less than code values. " +
  'Do not use in jurisdictions requiring fixture units on plans.';

export const FIXTURES: Fixture[] = [
  // ── BATHROOM GROUPS ───────────────────────────────────────────────────────
  { id: 'bg-16-ft', name: 'Bathroom Group (1.6 GPF Flush Tank)', category: 'Bathroom Groups', section: 'standard', dfu: 5, hotWSFU: 1.5, coldWSFU: 2.7, combinedWSFU: 3.6, isFlushValve: false },
  { id: 'bg-35-ft', name: 'Bathroom Group (3.5 GPF Flush Tank)', category: 'Bathroom Groups', section: 'standard', dfu: 6, hotWSFU: 3, coldWSFU: 6, combinedWSFU: 8, isFlushValve: false },

  // ── WATER CLOSETS ─────────────────────────────────────────────────────────
  { id: 'wc-private-16-flushmtr', name: 'Private WC (1.6 GPF Flushometer Tank)', category: 'Water Closets', section: 'standard', dfu: 4, hotWSFU: 0, coldWSFU: 2, combinedWSFU: 2, isFlushValve: false },
  { id: 'wc-private-16-ft', name: 'Private WC (1.6 GPF Flush Tank)', category: 'Water Closets', section: 'standard', dfu: 3, hotWSFU: 0, coldWSFU: 2.2, combinedWSFU: 2.2, isFlushValve: false },
  { id: 'wc-public-16-ft', name: 'Public WC (1.6 GPF Flush Tank)', category: 'Water Closets', section: 'standard', dfu: 4, hotWSFU: 0, coldWSFU: 5, combinedWSFU: 5, isFlushValve: false },
  { id: 'wc-private-16-fv', name: 'Private WC (1.6 GPF Flush Valve)', category: 'Water Closets', section: 'standard', dfu: 3, hotWSFU: 0, coldWSFU: 6, combinedWSFU: 6, isFlushValve: true },
  { id: 'wc-public-16-fv', name: 'Public WC (1.6 GPF Flush Valve)', category: 'Water Closets', section: 'standard', dfu: 4, hotWSFU: 0, coldWSFU: 10, combinedWSFU: 10, isFlushValve: true },
  { id: 'wc-public-35-fv', name: 'Public WC (3.5 GPF Flush Valve)', category: 'Water Closets', section: 'standard', dfu: 6, hotWSFU: 0, coldWSFU: 10, combinedWSFU: 10, isFlushValve: true },

  // ── URINALS ───────────────────────────────────────────────────────────────
  { id: 'urinal-10', name: 'Urinal (1.0 GPF)', category: 'Urinals', section: 'standard', dfu: 2, hotWSFU: 0, coldWSFU: 5, combinedWSFU: 5, isFlushValve: true },
  { id: 'urinal-pint', name: 'Urinal (0.125 GPF Pint)', category: 'Urinals', section: 'standard', dfu: 2, hotWSFU: 0, coldWSFU: 2, combinedWSFU: 2, isFlushValve: true, note: PINT_URINAL_NOTE },
  { id: 'urinal-waterless', name: 'Urinal (Waterless)', category: 'Urinals', section: 'standard', dfu: 0.5, hotWSFU: 0, coldWSFU: 0, combinedWSFU: 0, isFlushValve: false },

  // ── LAVATORIES ────────────────────────────────────────────────────────────
  { id: 'lav-private', name: 'Private Lavatory', category: 'Lavatories', section: 'standard', dfu: 1, hotWSFU: 0.5, coldWSFU: 0.5, combinedWSFU: 0.7, isFlushValve: false },
  { id: 'lav-public', name: 'Public Lavatory', category: 'Lavatories', section: 'standard', dfu: 1, hotWSFU: 1.5, coldWSFU: 1.5, combinedWSFU: 2, isFlushValve: false },

  // ── BATH / BIDET / SHOWERS ────────────────────────────────────────────────
  { id: 'bathtub', name: 'Bathtub (Private)', category: 'Bath / Bidet / Showers', section: 'standard', dfu: 2, hotWSFU: 1, coldWSFU: 1, combinedWSFU: 1.4, isFlushValve: false },
  { id: 'bidet', name: 'Bidet', category: 'Bath / Bidet / Showers', section: 'standard', dfu: 1, hotWSFU: 1.5, coldWSFU: 1.5, combinedWSFU: 2, isFlushValve: false },
  { id: 'shower-private', name: 'Shower (Private — One Head)', category: 'Bath / Bidet / Showers', section: 'standard', dfu: 2, hotWSFU: 1, coldWSFU: 1, combinedWSFU: 1.4, isFlushValve: false },
  { id: 'shower-public', name: 'Shower (Public — Each Head)', category: 'Bath / Bidet / Showers', section: 'standard', dfu: 2, hotWSFU: 3, coldWSFU: 3, combinedWSFU: 4, isFlushValve: false },

  // ── SINKS ─────────────────────────────────────────────────────────────────
  { id: 'sink-private', name: 'Private Sink (Bar, Kitchen or Breakroom)', category: 'Sinks', section: 'standard', dfu: 2, hotWSFU: 1, coldWSFU: 1, combinedWSFU: 1.4, isFlushValve: false },
  { id: 'sink-public', name: 'Public Sink (Kitchen or Breakroom)', category: 'Sinks', section: 'standard', dfu: 2, hotWSFU: 3, coldWSFU: 3, combinedWSFU: 4, isFlushValve: false },
  { id: 'sink-flushing-rim', name: 'Sink (Flushing Rim)', category: 'Sinks', section: 'standard', dfu: 6, hotWSFU: 3, coldWSFU: 3, combinedWSFU: 4, isFlushValve: false },
  { id: 'sink-wash-fountain', name: 'Sink (Wash Fountain, per Head)', category: 'Sinks', section: 'standard', dfu: 2, hotWSFU: 1, coldWSFU: 1, combinedWSFU: 1.4, isFlushValve: false },
  { id: 'sink-service', name: 'Service Sink (Mop Basin)', category: 'Sinks', section: 'standard', dfu: 3, hotWSFU: 2.25, coldWSFU: 2.25, combinedWSFU: 3, isFlushValve: false },
  { id: 'sink-clinical', name: 'Clinical Service Sink', category: 'Sinks', section: 'standard', dfu: 6, hotWSFU: 1.5, coldWSFU: 8, combinedWSFU: 8, isFlushValve: false },
  { id: 'sink-laundry-tub', name: 'Private Laundry Tub', category: 'Sinks', section: 'standard', dfu: 2, hotWSFU: 2, coldWSFU: 2, combinedWSFU: 3, isFlushValve: false },
  { id: 'drinking-fountain', name: 'Drinking Fountain', category: 'Sinks', section: 'standard', dfu: 0.5, hotWSFU: 0, coldWSFU: 0.25, combinedWSFU: 0.25, isFlushValve: false },

  // ── DISHWASHERS ───────────────────────────────────────────────────────────
  { id: 'dishwasher-res', name: 'Dishwasher (Residential)', category: 'Dishwashers', section: 'standard', dfu: 2, hotWSFU: 1.4, coldWSFU: 0, combinedWSFU: 1.4, isFlushValve: false },

  // ── CLOTHES WASHERS ───────────────────────────────────────────────────────
  { id: 'washer-private', name: 'Private Clothes Washer Residential', category: 'Clothes Washers', section: 'standard', dfu: 2, hotWSFU: 1, coldWSFU: 1, combinedWSFU: 1.4, isFlushValve: false },
  { id: 'washer-public', name: 'Public Clothes Washer Residential', category: 'Clothes Washers', section: 'standard', dfu: 3, hotWSFU: 3, coldWSFU: 3, combinedWSFU: 4, isFlushValve: false },

  // ── HYDRANTS & DRAINS ─────────────────────────────────────────────────────
  { id: 'hydrant-wall', name: 'Wall Hydrant', category: 'Hydrants & Drains', section: 'standard', dfu: 0, hotWSFU: 0, coldWSFU: 5, combinedWSFU: 5, isFlushValve: false },
  { id: 'hydrant-wall-nf', name: 'Wall Hydrant (Non-Freeze)', category: 'Hydrants & Drains', section: 'standard', dfu: 0, hotWSFU: 0, coldWSFU: 5, combinedWSFU: 5, isFlushValve: false },
  { id: 'floor-drain', name: 'Floor Drain', category: 'Hydrants & Drains', section: 'standard', dfu: 2, hotWSFU: 0, coldWSFU: 0, combinedWSFU: 0, isFlushValve: false },

  // ── MISC ──────────────────────────────────────────────────────────────────
  { id: 'misc-continuous', name: 'Misc. Continuous Flow (enter qty in GPM)', category: 'Misc.', section: 'standard', dfu: 1 / 7.5, hotWSFU: 0, coldWSFU: 1 / 7.5, combinedWSFU: 1 / 7.5, isFlushValve: false },

  // ── SPECIALTY KITCHEN EQUIP. ──────────────────────────────────────────────
  { id: 'washer-commercial', name: 'Commercial Washer Extractor', category: 'Specialty Kitchen', section: 'specialty-kitchen', dfu: 6, hotWSFU: 7.5, coldWSFU: 7.5, combinedWSFU: 10, isFlushValve: false },
  { id: 'disposer-2in', name: 'Disposer (2″ Trap)', category: 'Specialty Kitchen', section: 'specialty-kitchen', dfu: 3, hotWSFU: 0, coldWSFU: 2, combinedWSFU: 2, isFlushValve: false },
  { id: 'disposer-3in', name: 'Disposer (3″ Trap)', category: 'Specialty Kitchen', section: 'specialty-kitchen', dfu: 5, hotWSFU: 0, coldWSFU: 2, combinedWSFU: 2, isFlushValve: false },
  { id: 'pre-scrapper', name: 'Pre-Scrapper', category: 'Specialty Kitchen', section: 'specialty-kitchen', dfu: 2, hotWSFU: 1.5, coldWSFU: 1.5, combinedWSFU: 2, isFlushValve: false },
  { id: 'sink-bar-iw', name: 'Sink — Bar (1½″ IW)', category: 'Specialty Kitchen', section: 'specialty-kitchen', dfu: 2, hotWSFU: 1.5, coldWSFU: 1.5, combinedWSFU: 2, isFlushValve: false },
  { id: 'sink-dump-iw', name: 'Sink — Dump (1½″ IW)', category: 'Specialty Kitchen', section: 'specialty-kitchen', dfu: 2, hotWSFU: 1.5, coldWSFU: 1.5, combinedWSFU: 2, isFlushValve: false },
  { id: 'sink-hand-iw', name: 'Sink — Hand (1½″ IW)', category: 'Specialty Kitchen', section: 'specialty-kitchen', dfu: 2, hotWSFU: 1.5, coldWSFU: 1.5, combinedWSFU: 2, isFlushValve: false },
  { id: 'sink-prep-iw', name: 'Sink — Prep/Veggie (2″ IW)', category: 'Specialty Kitchen', section: 'specialty-kitchen', dfu: 3, hotWSFU: 1.5, coldWSFU: 1.5, combinedWSFU: 2, isFlushValve: false },
  { id: 'sink-2comp-iw', name: 'Sink — 2 Compartment (2″ IW)', category: 'Specialty Kitchen', section: 'specialty-kitchen', dfu: 3, hotWSFU: 1.5, coldWSFU: 1.5, combinedWSFU: 2, isFlushValve: false },
  { id: 'sink-3comp-iw', name: 'Sink — 3 Compartment (2″ IW)', category: 'Specialty Kitchen', section: 'specialty-kitchen', dfu: 3, hotWSFU: 3, coldWSFU: 3, combinedWSFU: 4, isFlushValve: false },
  { id: 'dishwasher-rest', name: 'Dishwasher (Restaurant) (2″ IW)', category: 'Specialty Kitchen', section: 'specialty-kitchen', dfu: 3, hotWSFU: 6, coldWSFU: 0, combinedWSFU: 6, isFlushValve: false },
  { id: 'ice-machine', name: 'Ice Machine (¾″ IW)', category: 'Specialty Kitchen', section: 'specialty-kitchen', dfu: 0.5, hotWSFU: 0, coldWSFU: 1, combinedWSFU: 1, isFlushValve: false },
  { id: 'coffee-maker', name: 'Coffee Maker (¾″ IW)', category: 'Specialty Kitchen', section: 'specialty-kitchen', dfu: 0.5, hotWSFU: 0, coldWSFU: 0.5, combinedWSFU: 0.5, isFlushValve: false },
  { id: 'tea-maker', name: 'Tea Maker (¾″ IW)', category: 'Specialty Kitchen', section: 'specialty-kitchen', dfu: 0.5, hotWSFU: 0, coldWSFU: 0.5, combinedWSFU: 0.5, isFlushValve: false },
  { id: 'cappuccino', name: 'Cappuccino Machine (¾″ IW)', category: 'Specialty Kitchen', section: 'specialty-kitchen', dfu: 0.5, hotWSFU: 0, coldWSFU: 0.5, combinedWSFU: 0.5, isFlushValve: false },
  { id: 'kettle-iw', name: 'Kettle (2″ IW)', category: 'Specialty Kitchen', section: 'specialty-kitchen', dfu: 3, hotWSFU: 1.5, coldWSFU: 1.5, combinedWSFU: 2, isFlushValve: false },
  { id: 'carbonator', name: 'Carbonator', category: 'Specialty Kitchen', section: 'specialty-kitchen', dfu: 0.5, hotWSFU: 0, coldWSFU: 0.5, combinedWSFU: 0.5, isFlushValve: false },
  { id: 'hot-food-table', name: 'Hot Food Table (¾″ IW)', category: 'Specialty Kitchen', section: 'specialty-kitchen', dfu: 0.5, hotWSFU: 0.75, coldWSFU: 0.75, combinedWSFU: 1, isFlushValve: false },
  { id: 'dipper-well', name: 'Dipper Well (¾″ IW)', category: 'Specialty Kitchen', section: 'specialty-kitchen', dfu: 0.5, hotWSFU: 0, coldWSFU: 0.75, combinedWSFU: 0.75, isFlushValve: false },
];

export const CATEGORIES = Array.from(new Set(FIXTURES.map((f) => f.category)));
