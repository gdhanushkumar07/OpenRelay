// src/lib/products.ts

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number; // in USD
  deliveryTime: string;
  suppliers: number;
  status: "In Stock" | "Low Stock" | "Available from Multiple Suppliers" | "Limited Availability" | "Made To Order" | "Out of Stock";
}

export const CATEGORIES = [
  "Industrial Equipment",
  "Construction Materials",
  "Electronics",
  "Medical Equipment",
  "Automotive Parts",
  "Office Equipment",
  "Manufacturing Components",
  "Renewable Energy",
  "Networking Hardware",
  "Warehouse Equipment"
];

export const PRODUCTS: Product[] = [
  // Industrial Equipment
  { id: "girder", name: "Industrial Steel Girders", category: "Industrial Equipment", price: 1200, deliveryTime: "5-7 Days", suppliers: 3, status: "Available from Multiple Suppliers" },
  { id: "pump", name: "Heavy Duty Hydraulic Pumps", category: "Industrial Equipment", price: 3400, deliveryTime: "10-14 Days", suppliers: 2, status: "In Stock" },
  { id: "bearing", name: "Industrial Spherical Bearings", category: "Industrial Equipment", price: 150, deliveryTime: "2-4 Days", suppliers: 5, status: "In Stock" },
  { id: "valve", name: "High-Pressure Industrial Valves", category: "Industrial Equipment", price: 850, deliveryTime: "4-6 Days", suppliers: 4, status: "Low Stock" },
  { id: "actuator", name: "Pneumatic Control Actuators", category: "Industrial Equipment", price: 620, deliveryTime: "3-5 Days", suppliers: 2, status: "In Stock" },

  // Construction Materials
  { id: "alum_sheet", name: "Grade-A Aluminium Sheets", category: "Construction Materials", price: 450, deliveryTime: "4-6 Days", suppliers: 4, status: "In Stock" },
  { id: "copper_pipe", name: "Seamless Copper Piping (bulk)", category: "Construction Materials", price: 1800, deliveryTime: "3-5 Days", suppliers: 3, status: "In Stock" },
  { id: "rebar", name: "Reinforcing Steel Bar (Rebar)", category: "Construction Materials", price: 950, deliveryTime: "6-8 Days", suppliers: 6, status: "Available from Multiple Suppliers" },
  { id: "concrete", name: "Ready-Mix Concrete Grade-S", category: "Construction Materials", price: 180, deliveryTime: "1 Day", suppliers: 2, status: "In Stock" },
  { id: "gypsum", name: "Fire-Resistant Gypsum Boards", category: "Construction Materials", price: 25, deliveryTime: "2-3 Days", suppliers: 4, status: "In Stock" },

  // Electronics
  { id: "semi_v4", name: "Semiconductor Chips v4", category: "Electronics", price: 45, deliveryTime: "30-45 Days", suppliers: 2, status: "Limited Availability" },
  { id: "micro_con", name: "ARM Cortex Microcontrollers", category: "Electronics", price: 12, deliveryTime: "15-20 Days", suppliers: 3, status: "Low Stock" },
  { id: "capacitor", name: "High-Frequency Ceramic Capacitors", category: "Electronics", price: 1.5, deliveryTime: "5-7 Days", suppliers: 5, status: "In Stock" },
  { id: "led_array", name: "High-Power LED Array Modules", category: "Electronics", price: 85, deliveryTime: "7-10 Days", suppliers: 2, status: "In Stock" },
  { id: "regulator", name: "Monolithic Voltage Regulators", category: "Electronics", price: 8, deliveryTime: "10-12 Days", suppliers: 4, status: "In Stock" },

  // Medical Equipment
  { id: "ventilator", name: "ICU Medical Ventilators", category: "Medical Equipment", price: 22000, deliveryTime: "14-21 Days", suppliers: 2, status: "Made To Order" },
  { id: "mri_comp", name: "Superconducting MRI Components", category: "Medical Equipment", price: 350000, deliveryTime: "60-90 Days", suppliers: 1, status: "Limited Availability" },
  { id: "monitor", name: "Multi-Parameter Patient Monitors", category: "Medical Equipment", price: 4500, deliveryTime: "7-10 Days", suppliers: 3, status: "In Stock" },
  { id: "transducer", name: "Ultrasound Phased Array Transducers", category: "Medical Equipment", price: 8500, deliveryTime: "12-15 Days", suppliers: 2, status: "Low Stock" },
  { id: "defib", name: "Biphasic Defibrillator Packs", category: "Medical Equipment", price: 3200, deliveryTime: "5-7 Days", suppliers: 3, status: "In Stock" },

  // Automotive Parts
  { id: "alternator", name: "Heavy-Duty Alternators", category: "Automotive Parts", price: 280, deliveryTime: "3-5 Days", suppliers: 4, status: "In Stock" },
  { id: "caliper", name: "Six-Piston Brake Calipers", category: "Automotive Parts", price: 450, deliveryTime: "4-6 Days", suppliers: 3, status: "In Stock" },
  { id: "strut", name: "Coilover Suspension Struts", category: "Automotive Parts", price: 350, deliveryTime: "3-5 Days", suppliers: 5, status: "In Stock" },
  { id: "radiator", name: "High-Performance Radiators", category: "Automotive Parts", price: 180, deliveryTime: "2-4 Days", suppliers: 3, status: "In Stock" },
  { id: "injector", name: "Multi-Port Fuel Injectors", category: "Automotive Parts", price: 95, deliveryTime: "3-5 Days", suppliers: 4, status: "Low Stock" },

  // Office Equipment
  { id: "printer", name: "Enterprise Laser Printers", category: "Office Equipment", price: 1500, deliveryTime: "4-6 Days", suppliers: 2, status: "In Stock" },
  { id: "chair", name: "Ergonomic Mesh Office Chairs", category: "Office Equipment", price: 450, deliveryTime: "3-5 Days", suppliers: 6, status: "In Stock" },
  { id: "desk", name: "Electric Height Standing Desks", category: "Office Equipment", price: 650, deliveryTime: "5-7 Days", suppliers: 4, status: "In Stock" },
  { id: "scanner", name: "Duplex High-Speed Scanners", category: "Office Equipment", price: 890, deliveryTime: "3-5 Days", suppliers: 3, status: "In Stock" },
  { id: "shredder", name: "Cross-Cut Document Shredders", category: "Office Equipment", price: 350, deliveryTime: "2-4 Days", suppliers: 3, status: "In Stock" },

  // Manufacturing Components
  { id: "conv_motor", name: "Synchronous Conveyor Motors", category: "Manufacturing Components", price: 1100, deliveryTime: "8-10 Days", suppliers: 3, status: "In Stock" },
  { id: "robot", name: "6-Axis Industrial Robots", category: "Manufacturing Components", price: 45000, deliveryTime: "30-45 Days", suppliers: 2, status: "Made To Order" },
  { id: "drive", name: "Precision AC Servo Drives", category: "Manufacturing Components", price: 1400, deliveryTime: "6-8 Days", suppliers: 3, status: "Low Stock" },
  { id: "milling_bit", name: "Carbide CNC Milling Bits", category: "Manufacturing Components", price: 45, deliveryTime: "2-3 Days", suppliers: 8, status: "In Stock" },
  { id: "engraver", name: "Fiber Laser Engraving Heads", category: "Manufacturing Components", price: 7800, deliveryTime: "12-15 Days", suppliers: 2, status: "Low Stock" },

  // Renewable Energy
  { id: "solar", name: "Monocrystalline Solar Panels", category: "Renewable Energy", price: 290, deliveryTime: "7-10 Days", suppliers: 3, status: "Available from Multiple Suppliers" },
  { id: "lith_batt", name: "Lithium Iron Phosphate Batteries", category: "Renewable Energy", price: 1200, deliveryTime: "14-21 Days", suppliers: 2, status: "Low Stock" },
  { id: "inverter", name: "Grid-Tied Wind Inverters", category: "Renewable Energy", price: 4500, deliveryTime: "10-12 Days", suppliers: 2, status: "In Stock" },
  { id: "heat_pump", name: "Geothermal Heat Pumps", category: "Renewable Energy", price: 9500, deliveryTime: "20-25 Days", suppliers: 1, status: "Limited Availability" },
  { id: "biomass", name: "Biomass Pellet Generators", category: "Renewable Energy", price: 12500, deliveryTime: "30-45 Days", suppliers: 2, status: "Made To Order" },

  // Networking Hardware
  { id: "router", name: "Enterprise Gigabit Routers", category: "Networking Hardware", price: 2800, deliveryTime: "4-6 Days", suppliers: 3, status: "In Stock" },
  { id: "switch", name: "48-Port PoE+ Gigabit Switches", category: "Networking Hardware", price: 1450, deliveryTime: "3-5 Days", suppliers: 4, status: "In Stock" },
  { id: "transceiver", name: "10G SFP+ Optical Transceivers", category: "Networking Hardware", price: 75, deliveryTime: "2-3 Days", suppliers: 6, status: "In Stock" },
  { id: "ap", name: "Wi-Fi 6E Wireless Access Points", category: "Networking Hardware", price: 380, deliveryTime: "3-5 Days", suppliers: 4, status: "In Stock" },
  { id: "firewall", name: "Unified Threat Firewall Appliances", category: "Networking Hardware", price: 4200, deliveryTime: "5-7 Days", suppliers: 2, status: "Low Stock" },

  // Warehouse Equipment
  { id: "forklift", name: "Electric Warehouse Forklifts", category: "Warehouse Equipment", price: 24000, deliveryTime: "15-20 Days", suppliers: 2, status: "Low Stock" },
  { id: "scanner_wh", name: "Rugged Bluetooth Warehouse Scanners", category: "Warehouse Equipment", price: 650, deliveryTime: "3-5 Days", suppliers: 5, status: "In Stock" },
  { id: "pallet_jack", name: "Manual Hydraulic Pallet Jacks", category: "Warehouse Equipment", price: 320, deliveryTime: "2-4 Days", suppliers: 4, status: "In Stock" },
  { id: "rack", name: "Heavy Duty Pallet Racking", category: "Warehouse Equipment", price: 450, deliveryTime: "5-7 Days", suppliers: 3, status: "In Stock" },
  { id: "agv", name: "Autonomous Guided Vehicles (AGV)", category: "Warehouse Equipment", price: 38000, deliveryTime: "45-60 Days", suppliers: 2, status: "Made To Order" }
];
