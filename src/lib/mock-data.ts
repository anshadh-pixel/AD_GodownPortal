import { StockItem } from "@/types/stock";

const CATEGORIES = [
  "Hardware & Fasteners",
  "Electrical & Lighting",
  "Plumbing & Pipes",
  "Paints & Chemicals",
  "Power Tools & Blades",
  "Building Materials",
  "Sanitary & Fittings",
  "Safety & PPE",
  "Hand Tools",
  "Adhesives & Sealants",
  "Pumps & Motors",
  "Packaging Materials"
];

const UNITS = ["Nos", "Boxes", "Pcs", "Kg", "Mtrs", "Rolls", "Sets", "Ltrs"];

const SAMPLE_PREFIXES = [
  "Premium Heavy Duty", "Standard Industrial", "Super-Grip", "Ultra-Tough",
  "Brass Coated", "Stainless Steel SS-304", "Galvanized GI", "High Performance",
  "Compact Pro", "Multi-Purpose", "Eco-Line", "Precision Engineered"
];

const SAMPLE_ITEMS: Record<string, string[]> = {
  "Hardware & Fasteners": [
    "Hex Head Bolt M8 x 50mm", "Self-Tapping Screw 2.5 inch", "Drywall Screw Black 1.5 inch",
    "Expansion Anchor Bolt 10mm", "Nylon Wall Plug 6mm", "SS-304 Washer M10",
    "Nyloc Lock Nut M12", "Carriage Bolt 3/8 x 3 inch", "Spring Washer 8mm",
    "Threaded Rod 1 Meter M12", "Corner L-Bracket 4x4 inch", "Heavy Duty Door Hinge 5 inch"
  ],
  "Electrical & Lighting": [
    "Copper Flexible Wire 1.5 sq mm Red", "Copper Flexible Wire 2.5 sq mm Blue",
    "MCB Single Pole 16A C-Curve", "MCB Double Pole 32A C-Curve", "RCCB 4-Pole 63A 30mA",
    "Modular Switch 6A 1-Way", "Modular Socket 16A with Shutter", "LED Batten Tube 20W 6500K",
    "LED Slim Panel Downlight 12W Warm White", "PVC Conduit Pipe 20mm Heavy",
    "PVC Conduit Junction Box 4-Way", "Industrial Cable Tie 200mm Heavy"
  ],
  "Plumbing & Pipes": [
    "CPVC Pipe 1 inch SDR 11 3M", "UPVC Pipe 1.5 inch Schedule 40", "CPVC Elbow 90 Deg 1 inch",
    "CPVC Brass Male Adaptor 1 x 0.5 inch", "UPVC Ball Valve 1.25 inch Solvent Weld",
    "PTFE Teflon Thread Seal Tape 12mm", "PVC Waste Pipe Flexible 32mm", "Brass Bib Cock 0.5 inch",
    "Angle Valve with Flange Quarter Turn", "CPVC Solvent Cement 250ml Tin",
    "Overhead Water Tank Ball Valve 1 inch", "Multi-Floor Drain Trap with Jali 100mm"
  ],
  "Paints & Chemicals": [
    "Interior Acrylic Emulsion 20L White", "Exterior Weatherproof Paint 10L Terracotta",
    "Metal Primer Red Oxide 4L", "Wood Primer Oil Based 4L", "Universal Stainer Fast Yellow 100ml",
    "Synthetic Enamel Gloss 1L Signal Red", "Waterproof Wall Putty 40Kg Bag",
    "Polyurethane Wood Varnish 1L", "Rust Remover Liquid 500ml", "Masking Tape 2 inch General Purpose"
  ],
  "Power Tools & Blades": [
    "Angle Grinder 850W 4-inch Heavy", "Hammer Drill Machine 650W 13mm",
    "Cordless Screwdriver 12V Li-Ion", "Diamond Cutting Blade 4-inch Marble",
    "TCT Saw Blade 7-1/4 inch 40T", "HSS Drill Bit Set 13 Pcs", "SDS Plus Masonry Bit 10x160mm",
    "Abrasive Cut-Off Wheel 14-inch Metal", "Flap Disc 4-inch Grit 80", "Electric Blower 600W Variable Speed"
  ],
  "Building Materials": [
    "Portland Pozzolana Cement (PPC) 50Kg", "Ordinary Portland Cement 53 Grade 50Kg",
    "Tile Adhesive High Polymer 20Kg", "Grout Water Resistant 1Kg Ivory",
    "Gypsum Plaster Super Fine 25Kg", "Waterproofing Chemical 2K 10Kg Pack",
    "Fiberglass Mesh Roll 160g 50M", "AAC Block Joining Mortar 40Kg"
  ],
  "Sanitary & Fittings": [
    "Wall Hung Water Closet White", "Ceramic Wash Basin Countertop 18x13 inch",
    "Health Faucet ABS Chrome with 1.2m Hose", "Wall Mixer with Provision for Hand Shower",
    "Kitchen Sink Single Bowl Stainless Steel 24x18", "Brass Waste Coupling 32mm Half Thread",
    "Shower Arm 9-inch with Round Rain Shower 6-inch", "Toilet Seat Cover Soft Close Standard"
  ],
  "Safety & PPE": [
    "Safety Helmet Industrial Ratchet Suspension Yellow", "Safety Shoes Steel Toe Cap Size 8",
    "Nitrile Coated Work Gloves Pair", "Safety Goggles Clear Anti-Fog Polycarbonate",
    "Dust Mask N95 Respirator Pack of 20", "Reflective Safety Vest High-Visibility Orange",
    "Ear Plugs Corded Reusable SNR 32dB", "Full Body Safety Harness with Double Lanyard"
  ],
  "Hand Tools": [
    "Adjustable Wrench 10-inch Chrome Vanadium", "Combination Plier 8-inch Insulated",
    "Long Nose Plier 6-inch with Cutter", "Claw Hammer 16oz Fiberglass Handle",
    "Spirit Level 24-inch Magnetic 3-Vial", "Measuring Tape 5 Meter Steel Blade Heavy",
    "Hacksaw Frame Heavy Duty with High Carbon Blade", "Pipe Wrench 14-inch Cast Iron Heavy"
  ],
  "Adhesives & Sealants": [
    "Cyanoacrylate Instant Super Glue 20g", "Epoxy Steel Compound Adhesive 50g",
    "Silicone Sealant Clear All-Weather 300ml Cartridge", "PU Expanding Foam 750ml Can",
    "Wood Adhesive Waterproof PVA 1Kg", "Heavy Duty Mounting Tape 1 inch x 5M",
    "Threadlocker Blue Medium Strength 50ml", "Gasket Maker RTV Red High Temp 85g"
  ],
  "Pumps & Motors": [
    "Self-Priming Monoblock Pump 0.5 HP Single Phase", "Open Well Submersible Pump 1.0 HP Single Phase",
    "Automatic Water Pressure Booster Pump 0.5 HP", "Float Switch Sensor Cable 5 Meter for Tank",
    "Centrifugal Water Pump 1.5 HP Three Phase", "Capacitor 25 MFD 440V Motor Run"
  ],
  "Packaging Materials": [
    "BOPP Packaging Tape 2 inch 65M Brown", "Stretch Wrap Film Roll 500mm x 300M 23 Micron",
    "Air Bubble Roll 1 Meter x 100M Heavy", "Corrugated Box 12x10x8 inch 3-Ply (Pack of 25)",
    "PP Strapping Roll Manual Grade 12mm 10Kg", "Strapping Tensioner & Sealer Combo Tool"
  ]
};

// Seeded pseudorandom function to ensure stable mock data
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateMockStockData(count: number = 2500): StockItem[] {
  const items: StockItem[] = [];
  const racks = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"];

  for (let i = 1; i <= count; i++) {
    const catIndex = (i - 1) % CATEGORIES.length;
    const category = CATEGORIES[catIndex];
    const itemPool = SAMPLE_ITEMS[category] || ["Standard Warehouse Item"];
    const baseItemName = itemPool[(i * 7) % itemPool.length];
    const prefix = SAMPLE_PREFIXES[(i * 13) % SAMPLE_PREFIXES.length];
    
    // Compute item code e.g. "HW-1001", "EL-1045", "PL-2090"
    const catCode = category.substring(0, 2).toUpperCase();
    const itemCode = `${catCode}-${(1000 + i).toString()}`;
    
    // Vary quantities to have realistic mix of normal, low, and out of stock
    const rand = pseudoRandom(i * 17 + 42);
    const reorderLevel = Math.floor(pseudoRandom(i * 31) * 35) + 10; // 10 to 45
    
    let quantity: number;
    let status: StockItem["status"];

    if (rand < 0.05) {
      // 5% out of stock
      quantity = 0;
      status = "out_of_stock";
    } else if (rand < 0.18) {
      // ~13% low stock
      quantity = Math.floor(pseudoRandom(i * 19) * (reorderLevel - 1)) + 1;
      status = "low_stock";
    } else {
      // 82% healthy stock
      quantity = Math.floor(pseudoRandom(i * 23) * 350) + reorderLevel + 15;
      status = "in_stock";
    }

    const unit = UNITS[(i * 3) % UNITS.length];
    const rackLetter = racks[(i * 5) % racks.length];
    const shelfNum = ((i * 11) % 40) + 1;
    const location = `Rack ${rackLetter}-${shelfNum.toString().padStart(2, "0")}`;

    const dateDay = ((i * 7) % 28) + 1;
    const lastUpdated = `${dateDay.toString().padStart(2, "0")}-10-2026`;

    items.push({
      id: `item-${i}`,
      itemCode,
      itemName: `${prefix} ${baseItemName}`,
      category,
      quantity,
      unit,
      reorderLevel,
      lastUpdated,
      location,
      rate: Math.floor(pseudoRandom(i * 47) * 900) + 45,
      status
    });
  }

  return items;
}
