import { StockItem } from "@/types/stock";
import { detectCookwareCategory } from "./stock-service";

const REAL_COOKWARE_TEMPLATES = [
  { name: "VITA 1000 BOTTLE", balance: 135, opening: 135, sales: 0, reorder: 30 },
  { name: "VK ALUMINIUM COOKER IB 3 LTR", balance: 18, opening: 20, sales: 2, reorder: 25 },
  { name: "VK ALUMINIUM COOKER IB 5 LTR", balance: 23, opening: 25, sales: 2, reorder: 25 },
  { name: "VK APPACHATTY 200", balance: 183, opening: 183, sales: 0, reorder: 40 },
  { name: "VK APPACHATTY 200 SHRINK WRAP", balance: 213, opening: 213, sales: 0, reorder: 50 },
  { name: "VK BIRIYANI POT 8L - NIB W/GL", balance: 161, opening: 161, sales: 0, reorder: 30 },
  { name: "VK BIRIYANI POT 10L - NIB W/GL", balance: 16, opening: 16, sales: 0, reorder: 20 },
  { name: "VK BIRIYANI POT 12L - NIB W/GL", balance: 20, opening: 20, sales: 0, reorder: 20 },
  { name: "VK ELECTRIC KETTLE 1.5 LTR", balance: 354, opening: 354, sales: 0, reorder: 60 },
  { name: "VK FESTIVE SPL BIRIYANI POT 10L - NIB W GL", balance: 138, opening: 138, sales: 0, reorder: 25 },
  { name: "VK FESTIVE SPL BIRIYANI POT 8L - NIB W GL", balance: 33, opening: 33, sales: 0, reorder: 20 },
  { name: "VK FESTIVE SPL FRYPAN 240 SHRINK", balance: 179, opening: 179, sales: 0, reorder: 35 },
  { name: "VK IB FRY PAN 280", balance: 56, opening: 56, sales: 0, reorder: 25 },
  { name: "VK IB FRYPAN 240 (TAPER)", balance: 120, opening: 120, sales: 0, reorder: 30 },
  { name: "VK IB TAWA 250", balance: 272, opening: 272, sales: 0, reorder: 50 },
  { name: "VK IB TAWA 280", balance: 88, opening: 88, sales: 0, reorder: 25 },
  { name: "VK KADAI 240 NIB W GL", balance: -2, opening: -2, sales: 0, reorder: 15 },
  { name: "VK KADAI 260 IB GL", balance: 41, opening: 41, sales: 0, reorder: 20 },
  { name: "VK KADAI 260 NIB W GL", balance: 142, opening: 142, sales: 0, reorder: 30 },
  { name: "VK KADAI 280 IB GL", balance: 38, opening: 38, sales: 0, reorder: 20 },
  { name: "VK KADAI 280 NIB W GL", balance: 36, opening: 36, sales: 0, reorder: 20 },
  { name: "VK KTF 3 PCS SET - IB W GL", balance: 1, opening: 1, sales: 0, reorder: 10 },
  { name: "VK MINI FRYPAN 120 NIB SHRINK WRAP", balance: 169, opening: 169, sales: 0, reorder: 40 },
  { name: "VK MINI FRYPAN 160 NIB SHRINK WRAP", balance: 1, opening: 1, sales: 0, reorder: 20 },
  { name: "VK MINI FRYPAN 200", balance: 0, opening: 0, sales: 0, reorder: 25 },
  { name: "VK MINI TAWA 190 NIB SHRINK WRAP", balance: 367, opening: 367, sales: 0, reorder: 50 },
  { name: "VK NIB FRYPAN 240 (TAPER)", balance: 42, opening: 42, sales: 0, reorder: 20 },
  { name: "VK NIB KTF 3 PC SET", balance: 211, opening: 211, sales: 0, reorder: 30 },
  { name: "VK NIB TAWA 250", balance: 59, opening: 69, sales: 10, reorder: 30 },
  { name: "VK PANIYARAKKAL 12 PIT SHRINK", balance: 212, opening: 218, sales: 6, reorder: 40 },
  { name: "VK PREMIUM DIE CAST FRYPAN 250", balance: 116, opening: 116, sales: 0, reorder: 25 },
  { name: "VK PREMIUM DIE CAST GRILLPAN 250 NIB", balance: 66, opening: 66, sales: 0, reorder: 20 },
  { name: "VK PREMIUM DIE CAST TAWA 270", balance: 3, opening: 3, sales: 0, reorder: 15 },
  { name: "VK PREMIUM DIE CAST TAWA 310", balance: -2, opening: -2, sales: 0, reorder: 15 },
  { name: "VK PREMIUM IB CASSEROLE 200 GL", balance: 160, opening: 160, sales: 0, reorder: 30 },
  { name: "VK PREMIUM IB CASSEROLE 240 GL", balance: 173, opening: 176, sales: 3, reorder: 30 },
  { name: "VK PREMIUM NIB TAWA 280 WIRE HANDLE", balance: 142, opening: 142, sales: 0, reorder: 30 },
  { name: "VK ROUND PATHIRI TAWA - 325", balance: 41, opening: 41, sales: 0, reorder: 25 },
  { name: "VK SC ROUND PATHIRI TAWA 325 - 3MM", balance: 52, opening: 52, sales: 0, reorder: 20 },
  { name: "VK SC SQUARE PATHIRI TAWA 3MM", balance: 26, opening: 31, sales: 5, reorder: 20 },
  { name: "VK SHRINK TAWA 250", balance: 264, opening: 264, sales: 0, reorder: 40 }
];

const VARIANT_SUFFIXES = [
  "200", "220", "240", "260", "280", "300", "325", "350", "400",
  "IB INDUCTION", "NIB NON-INDUCTION", "GLASSTOP (GL)", "STEEL LID",
  "WOODEN HANDLE", "SOFT TOUCH", "EXTRA DEEP", "HARD ANODISED",
  "3-PLY STAINLESS", "CERAMIC COAT", "DOUBLE COAT", "EXPORT QUALITY"
];

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateMockStockData(totalCount: number = 2500): StockItem[] {
  const items: StockItem[] = [];
  const racks = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"];

  // 1. First add the exact items from the user's billing screen
  REAL_COOKWARE_TEMPLATES.forEach((tmpl, i) => {
    const isOut = tmpl.balance <= 0;
    const isLow = !isOut && tmpl.balance <= tmpl.reorder;
    const rackLetter = racks[i % racks.length];
    const shelfNum = ((i * 3) % 30) + 1;

    items.push({
      id: `real-${i}`,
      itemCode: tmpl.name,
      itemName: tmpl.name,
      category: detectCookwareCategory(tmpl.name),
      quantity: tmpl.balance,
      opening: tmpl.opening,
      sales: tmpl.sales,
      unit: "Nos",
      reorderLevel: tmpl.reorder,
      lastUpdated: "11-10-2026",
      location: `Rack ${rackLetter}-${shelfNum.toString().padStart(2, "0")}`,
      rate: Math.floor(pseudoRandom(i * 33) * 600) + 250,
      status: isOut ? "out_of_stock" : isLow ? "low_stock" : "in_stock"
    });
  });

  // 2. Expand up to 2500 items with matching cookware variants to test large-scale virtualization
  const baseCount = REAL_COOKWARE_TEMPLATES.length;
  for (let i = baseCount; i < totalCount; i++) {
    const baseTmpl = REAL_COOKWARE_TEMPLATES[i % baseCount];
    const suffix = VARIANT_SUFFIXES[(i * 7) % VARIANT_SUFFIXES.length];
    const variantNum = Math.floor(i / baseCount) + 1;
    const itemName = `${baseTmpl.name} [V${variantNum} ${suffix}]`;
    const rand = pseudoRandom(i * 19 + 7);
    const reorderLevel = Math.floor(pseudoRandom(i * 29) * 30) + 10;

    let quantity: number;
    let status: StockItem["status"];

    if (rand < 0.04) {
      quantity = rand < 0.015 ? -2 : 0; // negative or 0
      status = "out_of_stock";
    } else if (rand < 0.16) {
      quantity = Math.floor(pseudoRandom(i * 13) * (reorderLevel - 1)) + 1;
      status = "low_stock";
    } else {
      quantity = Math.floor(pseudoRandom(i * 37) * 300) + reorderLevel + 10;
      status = "in_stock";
    }

    const rackLetter = racks[(i * 3) % racks.length];
    const shelfNum = ((i * 5) % 35) + 1;
    const location = `Rack ${rackLetter}-${shelfNum.toString().padStart(2, "0")}`;

    items.push({
      id: `item-${i}`,
      itemCode: itemName,
      itemName,
      category: detectCookwareCategory(itemName),
      quantity,
      opening: quantity + Math.floor(pseudoRandom(i) * 5),
      sales: Math.floor(pseudoRandom(i * 11) * 8),
      unit: "Nos",
      reorderLevel,
      lastUpdated: "11-10-2026",
      location,
      rate: Math.floor(pseudoRandom(i * 23) * 750) + 200,
      status
    });
  }

  return items;
}
