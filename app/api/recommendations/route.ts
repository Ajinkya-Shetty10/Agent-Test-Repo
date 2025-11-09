import { NextResponse } from "next/server";

let recommendations = [
  {
    id: "1",
    productId: "prod-001",
    productName: "Wireless Bluetooth Headphones",
    productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    skus: ["WH-BT-001", "WH-BT-001-BLK", "WH-BT-001-WHT"],
    stock: 45,
    fixes: [
      { id: "fix-1-1", title: "Optimize Product Description", description: "Add more detailed specifications and benefits" },
      { id: "fix-1-2", title: "Improve Image Quality", description: "Use higher resolution product images" },
      { id: "fix-1-3", title: "Add Customer Reviews Section", description: "Display verified customer reviews" }
    ],
    impactScore: 92,
    estimatedTimeHours: 3.5,
    completed: false
  },
  {
    id: "2",
    productId: "prod-002",
    productName: "Smart Fitness Watch",
    productImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    skus: ["SFW-001", "SFW-001-SLV", "SFW-001-BLK"],
    stock: 9,
    fixes: [
      { id: "fix-2-1", title: "Update Pricing Strategy", description: "Review and optimize pricing for better competitiveness" },
      { id: "fix-2-2", title: "Enhance SEO Keywords", description: "Add relevant keywords to improve search visibility" },
      { id: "fix-2-3", title: "Add Conversion Proof", description: "Highlight recent customer wins and testimonials" },
      { id: "fix-2-4", title: "Improve Scarcity Messaging", description: "Communicate limited stock to increase urgency" }
    ],
    impactScore: 88,
    estimatedTimeHours: 1,
    completed: false
  },
  {
    id: "3",
    productId: "prod-003",
    productName: "Portable USB-C Charger",
    productImage: "https://images.unsplash.com/photo-1609091839311-d5365f5bf644?w=400&h=400&fit=crop",
    skus: ["PUC-001", "PUC-001-BLK"],
    stock: 67,
    fixes: [
      { id: "fix-3-1", title: "Add Product Video", description: "Create demonstration video showing product features" },
      { id: "fix-3-2", title: "Optimize Product Description", description: "Improve description clarity and detail" }
    ],
    impactScore: 78,
    estimatedTimeHours: 4,
    completed: false
  },
  {
    id: "4",
    productId: "prod-004",
    productName: "Ergonomic Office Chair",
    productImage: "https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=400&fit=crop",
    skus: ["EOC-001", "EOC-001-BLK", "EOC-001-GRY"],
    stock: 12,
    fixes: [
      { id: "fix-4-1", title: "Improve Image Quality", description: "Add 360-degree view and multiple angles" }
    ],
    impactScore: 68,
    estimatedTimeHours: 1.5,
    completed: false
  },
  {
    id: "5",
    productId: "prod-005",
    productName: "Mechanical Gaming Keyboard",
    productImage: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop",
    skus: ["MGK-001", "MGK-001-RGB"],
    stock: 89,
    fixes: [
      { id: "fix-5-1", title: "Add Customer Reviews Section", description: "Showcase user testimonials and ratings" },
      { id: "fix-5-2", title: "Enhance SEO Keywords", description: "Optimize for gaming keyboard searches" },
      { id: "fix-5-3", title: "Update Pricing Strategy", description: "Review competitor pricing" }
    ],
    impactScore: 73,
    estimatedTimeHours: 2,
    completed: false
  },
  {
    id: "6",
    productId: "prod-006",
    productName: "Wireless Mouse Pro",
    productImage: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop",
    skus: ["WM-PRO-001", "WM-PRO-001-BLK", "WM-PRO-001-WHT"],
    stock: 8,
    fixes: [
      { id: "fix-6-1", title: "Update Product Images", description: "Add lifestyle images showing mouse in use" },
      { id: "fix-6-2", title: "Add Technical Specifications", description: "Include detailed battery life and DPI information" }
    ],
    impactScore: 88,
    estimatedTimeHours: 2,
    completed: false
  },
  {
    id: "7",
    productId: "prod-007",
    productName: "4K Ultra HD Monitor",
    productImage: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
    skus: ["MON-4K-001", "MON-4K-001-27", "MON-4K-001-32"],
    stock: 34,
    fixes: [
      { id: "fix-7-1", title: "Optimize Product Description", description: "Highlight key features like HDR and refresh rate" },
      { id: "fix-7-2", title: "Add Comparison Table", description: "Compare with similar models to help decision making" },
      { id: "fix-7-3", title: "Improve Image Quality", description: "Use higher resolution product images" }
    ],
    impactScore: 91,
    estimatedTimeHours: 3.5,
    completed: false
  },
  {
    id: "8",
    productId: "prod-008",
    productName: "Noise Cancelling Earbuds",
    productImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    skus: ["NC-EB-001", "NC-EB-001-BLK"],
    stock: 156,
    fixes: [
      { id: "fix-8-1", title: "Add Product Video", description: "Create video demonstrating noise cancellation features" }
    ],
    impactScore: 65,
    estimatedTimeHours: 2.5,
    completed: false
  },
  {
    id: "9",
    productId: "prod-009",
    productName: "Laptop Stand Adjustable",
    productImage: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    skus: ["LS-ADJ-001", "LS-ADJ-001-SLV", "LS-ADJ-001-BLK"],
    stock: 5,
    fixes: [
      { id: "fix-9-1", title: "Update Pricing Strategy", description: "Review and adjust pricing for better competitiveness" },
      { id: "fix-9-2", title: "Add Customer Reviews Section", description: "Display verified customer reviews and ratings" },
      { id: "fix-9-3", title: "Enhance SEO Keywords", description: "Add relevant keywords for better search visibility" },
      { id: "fix-9-4", title: "Improve Image Quality", description: "Add multiple angle views and usage scenarios" }
    ],
    impactScore: 95,
    estimatedTimeHours: 4,
    completed: false
  },
  {
    id: "10",
    productId: "prod-010",
    productName: "USB-C Hub Multiport",
    productImage: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=400&fit=crop",
    skus: ["USB-HUB-001", "USB-HUB-001-7P", "USB-HUB-001-10P"],
    stock: 42,
    fixes: [
      { id: "fix-10-1", title: "Optimize Product Description", description: "Clarify port types and compatibility information" },
      { id: "fix-10-2", title: "Add Compatibility List", description: "List compatible devices and operating systems" }
    ],
    impactScore: 72,
    estimatedTimeHours: 1.5,
    completed: false
  },
  {
    id: "11",
    productId: "prod-011",
    productName: "Standing Desk Converter",
    productImage: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
    skus: ["SD-CONV-001", "SD-CONV-001-L", "SD-CONV-001-XL"],
    stock: 19,
    fixes: [
      { id: "fix-11-1", title: "Add Product Video", description: "Create demonstration video showing height adjustment" },
      { id: "fix-11-2", title: "Improve Image Quality", description: "Show product in different office setups" },
      { id: "fix-11-3", title: "Add Customer Reviews Section", description: "Showcase user testimonials" }
    ],
    impactScore: 84,
    estimatedTimeHours: 3,
    completed: false
  },
  {
    id: "12",
    productId: "prod-012",
    productName: "Wireless Charging Pad",
    productImage: "https://images.unsplash.com/photo-1609091837363-28d50b3c36e5?w=400&h=400&fit=crop",
    skus: ["WC-PAD-001", "WC-PAD-001-FAST"],
    stock: 78,
    fixes: [
      { id: "fix-12-1", title: "Enhance SEO Keywords", description: "Optimize for wireless charger searches" }
    ],
    impactScore: 58,
    estimatedTimeHours: 1,
    completed: false
  },
  {
    id: "13",
    productId: "prod-013",
    productName: "Ergonomic Keyboard Wrist Rest",
    productImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    skus: ["KB-WR-001", "KB-WR-001-FULL"],
    stock: 3,
    fixes: [
      { id: "fix-13-1", title: "Update Product Images", description: "Show wrist rest in use with keyboard" },
      { id: "fix-13-2", title: "Add Health Benefits Section", description: "Explain ergonomic benefits and comfort" },
      { id: "fix-13-3", title: "Update Pricing Strategy", description: "Review competitor pricing" },
      { id: "fix-13-4", title: "Add Customer Reviews Section", description: "Display user testimonials" }
    ],
    impactScore: 89,
    estimatedTimeHours: 2.5,
    completed: false
  },
  {
    id: "14",
    productId: "prod-014",
    productName: "Webcam HD 1080p",
    productImage: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=400&fit=crop",
    skus: ["WC-1080-001", "WC-1080-001-PRO"],
    stock: 67,
    fixes: [
      { id: "fix-14-1", title: "Optimize Product Description", description: "Highlight video quality and features" },
      { id: "fix-14-2", title: "Add Product Video", description: "Show video quality samples" }
    ],
    impactScore: 76,
    estimatedTimeHours: 2,
    completed: false
  },
  {
    id: "15",
    productId: "prod-015",
    productName: "Desk Organizer Set",
    productImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    skus: ["DO-SET-001", "DO-SET-001-5P", "DO-SET-001-10P"],
    stock: 124,
    fixes: [
      { id: "fix-15-1", title: "Improve Image Quality", description: "Show organizer with items in use" }
    ],
    impactScore: 52,
    estimatedTimeHours: 1,
    completed: false
  },
  {
    id: "16",
    productId: "prod-016",
    productName: "Gaming Headset RGB",
    productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    skus: ["GH-RGB-001", "GH-RGB-001-7.1", "GH-RGB-001-WIRELESS"],
    stock: 15,
    fixes: [
      { id: "fix-16-1", title: "Add Product Video", description: "Demonstrate RGB lighting and sound quality" },
      { id: "fix-16-2", title: "Optimize Product Description", description: "Highlight gaming features and audio specs" },
      { id: "fix-16-3", title: "Add Customer Reviews Section", description: "Showcase gamer testimonials" },
      { id: "fix-16-4", title: "Enhance SEO Keywords", description: "Optimize for gaming headset searches" }
    ],
    impactScore: 87,
    estimatedTimeHours: 3.5,
    completed: false
  },
  {
    id: "17",
    productId: "prod-017",
    productName: "Cable Management Sleeve",
    productImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    skus: ["CM-SLEEVE-001", "CM-SLEEVE-001-L"],
    stock: 92,
    fixes: [
      { id: "fix-17-1", title: "Add Before/After Images", description: "Show cable organization improvement" }
    ],
    impactScore: 61,
    estimatedTimeHours: 1,
    completed: false
  },
  {
    id: "18",
    productId: "prod-018",
    productName: "Monitor Arm Dual",
    productImage: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
    skus: ["MA-DUAL-001", "MA-DUAL-001-HEAVY"],
    stock: 7,
    fixes: [
      { id: "fix-18-1", title: "Update Product Images", description: "Show dual monitor setup in different configurations" },
      { id: "fix-18-2", title: "Add Installation Guide", description: "Create step-by-step installation instructions" },
      { id: "fix-18-3", title: "Optimize Product Description", description: "Highlight weight capacity and adjustability" }
    ],
    impactScore: 82,
    estimatedTimeHours: 2.5,
    completed: false
  },
  {
    id: "19",
    productId: "prod-019",
    productName: "LED Desk Lamp",
    productImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    skus: ["LED-LAMP-001", "LED-LAMP-001-RGB", "LED-LAMP-001-WARM"],
    stock: 28,
    fixes: [
      { id: "fix-19-1", title: "Add Product Video", description: "Show different lighting modes and brightness levels" },
      { id: "fix-19-2", title: "Enhance SEO Keywords", description: "Optimize for desk lamp searches" }
    ],
    impactScore: 69,
    estimatedTimeHours: 1.5,
    completed: false
  },
  {
    id: "20",
    productId: "prod-020",
    productName: "Laptop Cooling Pad",
    productImage: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    skus: ["LC-PAD-001", "LC-PAD-001-17", "LC-PAD-001-15"],
    stock: 11,
    fixes: [
      { id: "fix-20-1", title: "Add Temperature Comparison", description: "Show before/after temperature reduction data" },
      { id: "fix-20-2", title: "Optimize Product Description", description: "Highlight cooling performance and fan speeds" },
      { id: "fix-20-3", title: "Add Customer Reviews Section", description: "Display user testimonials about cooling effectiveness" }
    ],
    impactScore: 79,
    estimatedTimeHours: 2,
    completed: false
  },
  {
    id: "21",
    productId: "prod-021",
    productName: "USB Microphone Studio",
    productImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop",
    skus: ["USB-MIC-001", "USB-MIC-001-PRO"],
    stock: 45,
    fixes: [
      { id: "fix-21-1", title: "Add Audio Samples", description: "Include audio quality demonstrations" },
      { id: "fix-21-2", title: "Optimize Product Description", description: "Highlight studio-quality features and specs" }
    ],
    impactScore: 74,
    estimatedTimeHours: 2.5,
    completed: false
  },
  {
    id: "22",
    productId: "prod-022",
    productName: "Monitor Light Bar",
    productImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    skus: ["ML-BAR-001", "ML-BAR-001-PRO"],
    stock: 56,
    fixes: [
      { id: "fix-22-1", title: "Add Installation Guide", description: "Show how to mount on different monitor sizes" },
      { id: "fix-22-2", title: "Improve Image Quality", description: "Show light bar in use on monitor" }
    ],
    impactScore: 66,
    estimatedTimeHours: 1.5,
    completed: false
  },
  {
    id: "23",
    productId: "prod-023",
    productName: "Mechanical Keycaps Set",
    productImage: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop",
    skus: ["MK-CAPS-001", "MK-CAPS-001-ANSI", "MK-CAPS-001-ISO"],
    stock: 2,
    fixes: [
      { id: "fix-23-1", title: "Update Product Images", description: "Show keycaps on different keyboard models" },
      { id: "fix-23-2", title: "Add Compatibility List", description: "List compatible keyboard models" },
      { id: "fix-23-3", title: "Add Customer Reviews Section", description: "Showcase customization enthusiasts' feedback" },
      { id: "fix-23-4", title: "Enhance SEO Keywords", description: "Optimize for mechanical keyboard searches" },
      { id: "fix-23-5", title: "Update Pricing Strategy", description: "Review market pricing" }
    ],
    impactScore: 96,
    estimatedTimeHours: 4.5,
    completed: false
  },
  {
    id: "24",
    productId: "prod-024",
    productName: "Laptop Sleeve 15 inch",
    productImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    skus: ["LS-15-001", "LS-15-001-GRY", "LS-15-001-BLK"],
    stock: 89,
    fixes: [
      { id: "fix-24-1", title: "Add Size Guide", description: "Help customers choose correct laptop size" }
    ],
    impactScore: 55,
    estimatedTimeHours: 1,
    completed: false
  },
  {
    id: "25",
    productId: "prod-025",
    productName: "USB-C to HDMI Adapter",
    productImage: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=400&fit=crop",
    skus: ["USB-HDMI-001", "USB-HDMI-001-4K"],
    stock: 134,
    fixes: [
      { id: "fix-25-1", title: "Add Compatibility List", description: "List compatible devices and resolutions" },
      { id: "fix-25-2", title: "Optimize Product Description", description: "Clarify supported resolutions and refresh rates" }
    ],
    impactScore: 63,
    estimatedTimeHours: 1.5,
    completed: false
  }
];

export async function GET() {
  // Sort by impact score (highest first) so the most important recommendation is shown first
  const sorted = [...recommendations].sort((a, b) => b.impactScore - a.impactScore);
  return NextResponse.json(sorted);
}

export async function PATCH(request: Request) {
  const { id, completed } = await request.json();
  recommendations = recommendations.map((r) =>
    r.id === id ? { ...r, completed } : r
  );
  return NextResponse.json({ success: true });
}
