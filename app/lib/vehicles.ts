export type VehicleModel = {
  name: string;
  yearFrom: number;
  yearTo: number;
};

export type VehicleMake = {
  name: string;
  models: VehicleModel[];
};

const RECENT_MAKES = [
  "Toyota",
  "Volkswagen",
  "Ford",
  "Nissan",
  "Hyundai",
  "BMW",
  "Mercedes-Benz",
];

const RECENT_MODELS: Record<string, string[]> = {
  Toyota: ["Hilux", "Fortuner", "Corolla", "Corolla Cross", "RAV4", "Starlet", "Urban Cruiser"],
  Volkswagen: ["Polo", "Polo Vivo", "T-Cross", "Tiguan", "Golf", "Amarok", "Caddy"],
  Ford: ["Ranger", "EcoSport", "Everest", "Figo", "Territory", "Mustang"],
  Nissan: ["NP200", "NP300", "Navara", "X-Trail", "Qashqai", "Magnite"],
  Hyundai: ["Tucson", "Creta", "i20", "Grand Creta", "Venue", "Staria"],
  BMW: ["3 Series", "1 Series", "X1", "X3", "X5", "2 Series"],
  "Mercedes-Benz": ["C-Class", "A-Class", "GLC", "E-Class", "GLA", "CLA"],
};

export const VEHICLE_CATALOG: VehicleMake[] = [
  {
    name: "Alfa Romeo",
    models: [
      { name: "Giulia", yearFrom: 2017, yearTo: 2026 },
      { name: "Giulietta", yearFrom: 2010, yearTo: 2021 },
      { name: "Stelvio", yearFrom: 2017, yearTo: 2026 },
      { name: "Tonale", yearFrom: 2023, yearTo: 2026 },
    ],
  },
  {
    name: "Audi",
    models: [
      { name: "A1", yearFrom: 2010, yearTo: 2026 },
      { name: "A3", yearFrom: 2003, yearTo: 2026 },
      { name: "A4", yearFrom: 2001, yearTo: 2026 },
      { name: "A5", yearFrom: 2008, yearTo: 2026 },
      { name: "A6", yearFrom: 2004, yearTo: 2026 },
      { name: "Q2", yearFrom: 2017, yearTo: 2026 },
      { name: "Q3", yearFrom: 2012, yearTo: 2026 },
      { name: "Q5", yearFrom: 2009, yearTo: 2026 },
      { name: "Q7", yearFrom: 2006, yearTo: 2026 },
      { name: "Q8", yearFrom: 2019, yearTo: 2026 },
    ],
  },
  {
    name: "BAIC",
    models: [
      { name: "Beijing X55", yearFrom: 2021, yearTo: 2026 },
      { name: "D20", yearFrom: 2018, yearTo: 2023 },
      { name: "X35", yearFrom: 2020, yearTo: 2026 },
    ],
  },
  {
    name: "BMW",
    models: [
      { name: "1 Series", yearFrom: 2004, yearTo: 2026 },
      { name: "2 Series", yearFrom: 2014, yearTo: 2026 },
      { name: "3 Series", yearFrom: 1998, yearTo: 2026 },
      { name: "4 Series", yearFrom: 2014, yearTo: 2026 },
      { name: "5 Series", yearFrom: 2003, yearTo: 2026 },
      { name: "X1", yearFrom: 2010, yearTo: 2026 },
      { name: "X2", yearFrom: 2018, yearTo: 2026 },
      { name: "X3", yearFrom: 2004, yearTo: 2026 },
      { name: "X4", yearFrom: 2014, yearTo: 2026 },
      { name: "X5", yearFrom: 2000, yearTo: 2026 },
      { name: "X6", yearFrom: 2008, yearTo: 2026 },
      { name: "X7", yearFrom: 2019, yearTo: 2026 },
      { name: "iX", yearFrom: 2022, yearTo: 2026 },
      { name: "iX3", yearFrom: 2021, yearTo: 2026 },
    ],
  },
  {
    name: "BYD",
    models: [
      { name: "Atto 3", yearFrom: 2022, yearTo: 2026 },
      { name: "Dolphin", yearFrom: 2023, yearTo: 2026 },
      { name: "Seal", yearFrom: 2024, yearTo: 2026 },
      { name: "Shark", yearFrom: 2024, yearTo: 2026 },
    ],
  },
  {
    name: "Chery",
    models: [
      { name: "Tiggo 4 Pro", yearFrom: 2021, yearTo: 2026 },
      { name: "Tiggo 7 Pro", yearFrom: 2022, yearTo: 2026 },
      { name: "Tiggo 8 Pro", yearFrom: 2022, yearTo: 2026 },
    ],
  },
  {
    name: "Chevrolet",
    models: [
      { name: "Aveo", yearFrom: 2008, yearTo: 2017 },
      { name: "Captiva", yearFrom: 2007, yearTo: 2018 },
      { name: "Cruze", yearFrom: 2009, yearTo: 2017 },
      { name: "Spark", yearFrom: 2005, yearTo: 2018 },
      { name: "Trailblazer", yearFrom: 2012, yearTo: 2017 },
      { name: "Utility", yearFrom: 2004, yearTo: 2017 },
    ],
  },
  {
    name: "Citroën",
    models: [
      { name: "C3", yearFrom: 2017, yearTo: 2026 },
      { name: "C3 Aircross", yearFrom: 2019, yearTo: 2026 },
      { name: "C5 Aircross", yearFrom: 2019, yearTo: 2026 },
    ],
  },
  {
    name: "Datsun",
    models: [
      { name: "Go", yearFrom: 2014, yearTo: 2023 },
      { name: "Go+", yearFrom: 2015, yearTo: 2023 },
    ],
  },
  {
    name: "Ford",
    models: [
      { name: "EcoSport", yearFrom: 2013, yearTo: 2025 },
      { name: "Everest", yearFrom: 2016, yearTo: 2026 },
      { name: "Figo", yearFrom: 2015, yearTo: 2024 },
      { name: "Fiesta", yearFrom: 2005, yearTo: 2023 },
      { name: "Focus", yearFrom: 2005, yearTo: 2022 },
      { name: "Mustang", yearFrom: 2016, yearTo: 2026 },
      { name: "Puma", yearFrom: 2021, yearTo: 2026 },
      { name: "Ranger", yearFrom: 1998, yearTo: 2026 },
      { name: "Territory", yearFrom: 2021, yearTo: 2026 },
      { name: "Tourneo Connect", yearFrom: 2022, yearTo: 2026 },
    ],
  },
  {
    name: "GWM",
    models: [
      { name: "P-Series", yearFrom: 2020, yearTo: 2026 },
      { name: "Steed", yearFrom: 2010, yearTo: 2022 },
      { name: "Tank 300", yearFrom: 2023, yearTo: 2026 },
    ],
  },
  {
    name: "Haval",
    models: [
      { name: "H6", yearFrom: 2021, yearTo: 2026 },
      { name: "Jolion", yearFrom: 2021, yearTo: 2026 },
      { name: "H6 GT", yearFrom: 2023, yearTo: 2026 },
    ],
  },
  {
    name: "Honda",
    models: [
      { name: "Amaze", yearFrom: 2018, yearTo: 2026 },
      { name: "Ballade", yearFrom: 2014, yearTo: 2026 },
      { name: "BR-V", yearFrom: 2016, yearTo: 2026 },
      { name: "CR-V", yearFrom: 2007, yearTo: 2026 },
      { name: "Fit", yearFrom: 2015, yearTo: 2023 },
      { name: "HR-V", yearFrom: 2015, yearTo: 2026 },
      { name: "WR-V", yearFrom: 2023, yearTo: 2026 },
    ],
  },
  {
    name: "Hyundai",
    models: [
      { name: "Accent", yearFrom: 2006, yearTo: 2023 },
      { name: "Atos", yearFrom: 2019, yearTo: 2024 },
      { name: "Creta", yearFrom: 2017, yearTo: 2026 },
      { name: "Exter", yearFrom: 2024, yearTo: 2026 },
      { name: "Grand Creta", yearFrom: 2020, yearTo: 2026 },
      { name: "i10", yearFrom: 2008, yearTo: 2020 },
      { name: "i20", yearFrom: 2009, yearTo: 2026 },
      { name: "i30", yearFrom: 2012, yearTo: 2023 },
      { name: "Kona", yearFrom: 2018, yearTo: 2026 },
      { name: "Santa Fe", yearFrom: 2006, yearTo: 2026 },
      { name: "Staria", yearFrom: 2022, yearTo: 2026 },
      { name: "Tucson", yearFrom: 2005, yearTo: 2026 },
      { name: "Venue", yearFrom: 2020, yearTo: 2026 },
    ],
  },
  {
    name: "Isuzu",
    models: [
      { name: "D-Max", yearFrom: 2012, yearTo: 2026 },
      { name: "MU-X", yearFrom: 2014, yearTo: 2026 },
    ],
  },
  {
    name: "JAC",
    models: [
      { name: "T6", yearFrom: 2019, yearTo: 2026 },
      { name: "T8", yearFrom: 2020, yearTo: 2026 },
    ],
  },
  {
    name: "Jeep",
    models: [
      { name: "Compass", yearFrom: 2017, yearTo: 2026 },
      { name: "Grand Cherokee", yearFrom: 2005, yearTo: 2026 },
      { name: "Renegade", yearFrom: 2015, yearTo: 2026 },
      { name: "Wrangler", yearFrom: 2007, yearTo: 2026 },
    ],
  },
  {
    name: "Kia",
    models: [
      { name: "Carens", yearFrom: 2022, yearTo: 2026 },
      { name: "Cerato", yearFrom: 2009, yearTo: 2024 },
      { name: "EV6", yearFrom: 2022, yearTo: 2026 },
      { name: "Forte", yearFrom: 2019, yearTo: 2026 },
      { name: "Pegas", yearFrom: 2021, yearTo: 2026 },
      { name: "Picanto", yearFrom: 2008, yearTo: 2026 },
      { name: "Rio", yearFrom: 2012, yearTo: 2024 },
      { name: "Seltos", yearFrom: 2020, yearTo: 2026 },
      { name: "Sonet", yearFrom: 2022, yearTo: 2026 },
      { name: "Sorento", yearFrom: 2010, yearTo: 2026 },
      { name: "Sportage", yearFrom: 2005, yearTo: 2026 },
    ],
  },
  {
    name: "Land Rover",
    models: [
      { name: "Defender", yearFrom: 2020, yearTo: 2026 },
      { name: "Discovery", yearFrom: 2004, yearTo: 2026 },
      { name: "Discovery Sport", yearFrom: 2015, yearTo: 2026 },
      { name: "Range Rover", yearFrom: 2002, yearTo: 2026 },
      { name: "Range Rover Evoque", yearFrom: 2012, yearTo: 2026 },
      { name: "Range Rover Sport", yearFrom: 2005, yearTo: 2026 },
      { name: "Range Rover Velar", yearFrom: 2017, yearTo: 2026 },
    ],
  },
  {
    name: "Lexus",
    models: [
      { name: "IS", yearFrom: 2006, yearTo: 2026 },
      { name: "NX", yearFrom: 2015, yearTo: 2026 },
      { name: "RX", yearFrom: 2009, yearTo: 2026 },
      { name: "UX", yearFrom: 2019, yearTo: 2026 },
    ],
  },
  {
    name: "Mahindra",
    models: [
      { name: "Bolero", yearFrom: 2014, yearTo: 2026 },
      { name: "KUV100", yearFrom: 2016, yearTo: 2022 },
      { name: "Pik Up", yearFrom: 2007, yearTo: 2026 },
      { name: "Scorpio", yearFrom: 2005, yearTo: 2026 },
      { name: "XUV300", yearFrom: 2019, yearTo: 2026 },
      { name: "XUV700", yearFrom: 2022, yearTo: 2026 },
    ],
  },
  {
    name: "Mazda",
    models: [
      { name: "2", yearFrom: 2008, yearTo: 2024 },
      { name: "3", yearFrom: 2004, yearTo: 2026 },
      { name: "CX-3", yearFrom: 2015, yearTo: 2026 },
      { name: "CX-30", yearFrom: 2020, yearTo: 2026 },
      { name: "CX-5", yearFrom: 2012, yearTo: 2026 },
      { name: "CX-60", yearFrom: 2023, yearTo: 2026 },
      { name: "BT-50", yearFrom: 2012, yearTo: 2026 },
    ],
  },
  {
    name: "Mercedes-Benz",
    models: [
      { name: "A-Class", yearFrom: 2013, yearTo: 2026 },
      { name: "C-Class", yearFrom: 2000, yearTo: 2026 },
      { name: "CLA", yearFrom: 2013, yearTo: 2026 },
      { name: "E-Class", yearFrom: 2002, yearTo: 2026 },
      { name: "GLA", yearFrom: 2014, yearTo: 2026 },
      { name: "GLB", yearFrom: 2020, yearTo: 2026 },
      { name: "GLC", yearFrom: 2015, yearTo: 2026 },
      { name: "GLE", yearFrom: 2015, yearTo: 2026 },
      { name: "S-Class", yearFrom: 2006, yearTo: 2026 },
      { name: "Vito", yearFrom: 2004, yearTo: 2026 },
    ],
  },
  {
    name: "MG",
    models: [
      { name: "3", yearFrom: 2021, yearTo: 2026 },
      { name: "HS", yearFrom: 2021, yearTo: 2026 },
      { name: "ZS", yearFrom: 2021, yearTo: 2026 },
      { name: "ZS EV", yearFrom: 2022, yearTo: 2026 },
    ],
  },
  {
    name: "Mini",
    models: [
      { name: "Cooper", yearFrom: 2007, yearTo: 2026 },
      { name: "Countryman", yearFrom: 2011, yearTo: 2026 },
    ],
  },
  {
    name: "Mitsubishi",
    models: [
      { name: "ASX", yearFrom: 2011, yearTo: 2026 },
      { name: "Eclipse Cross", yearFrom: 2018, yearTo: 2026 },
      { name: "Outlander", yearFrom: 2013, yearTo: 2026 },
      { name: "Pajero", yearFrom: 2000, yearTo: 2021 },
      { name: "Pajero Sport", yearFrom: 2016, yearTo: 2026 },
      { name: "Triton", yearFrom: 2007, yearTo: 2026 },
      { name: "Xpander", yearFrom: 2022, yearTo: 2026 },
    ],
  },
  {
    name: "Nissan",
    models: [
      { name: "Almera", yearFrom: 2013, yearTo: 2023 },
      { name: "Magnite", yearFrom: 2021, yearTo: 2026 },
      { name: "Micra", yearFrom: 2004, yearTo: 2020 },
      { name: "Navara", yearFrom: 2005, yearTo: 2026 },
      { name: "NP200", yearFrom: 2009, yearTo: 2026 },
      { name: "NP300", yearFrom: 2008, yearTo: 2026 },
      { name: "Patrol", yearFrom: 2010, yearTo: 2026 },
      { name: "Qashqai", yearFrom: 2007, yearTo: 2026 },
      { name: "X-Trail", yearFrom: 2004, yearTo: 2026 },
    ],
  },
  {
    name: "Omoda",
    models: [
      { name: "C5", yearFrom: 2023, yearTo: 2026 },
    ],
  },
  {
    name: "Opel",
    models: [
      { name: "Corsa", yearFrom: 2007, yearTo: 2026 },
      { name: "Crossland", yearFrom: 2021, yearTo: 2026 },
      { name: "Mokka", yearFrom: 2021, yearTo: 2026 },
    ],
  },
  {
    name: "Peugeot",
    models: [
      { name: "2008", yearFrom: 2014, yearTo: 2026 },
      { name: "208", yearFrom: 2013, yearTo: 2026 },
      { name: "3008", yearFrom: 2017, yearTo: 2026 },
      { name: "5008", yearFrom: 2018, yearTo: 2026 },
    ],
  },
  {
    name: "Porsche",
    models: [
      { name: "Cayenne", yearFrom: 2004, yearTo: 2026 },
      { name: "Macan", yearFrom: 2014, yearTo: 2026 },
    ],
  },
  {
    name: "Renault",
    models: [
      { name: "Clio", yearFrom: 2013, yearTo: 2026 },
      { name: "Duster", yearFrom: 2018, yearTo: 2026 },
      { name: "Kiger", yearFrom: 2022, yearTo: 2026 },
      { name: "Kwid", yearFrom: 2016, yearTo: 2026 },
      { name: "Sandero", yearFrom: 2009, yearTo: 2023 },
      { name: "Triber", yearFrom: 2020, yearTo: 2026 },
    ],
  },
  {
    name: "Subaru",
    models: [
      { name: "Crosstrek", yearFrom: 2023, yearTo: 2026 },
      { name: "Forester", yearFrom: 2008, yearTo: 2026 },
      { name: "Outback", yearFrom: 2010, yearTo: 2026 },
      { name: "XV", yearFrom: 2012, yearTo: 2023 },
    ],
  },
  {
    name: "Suzuki",
    models: [
      { name: "Baleno", yearFrom: 2016, yearTo: 2026 },
      { name: "Celerio", yearFrom: 2015, yearTo: 2026 },
      { name: "Fronx", yearFrom: 2024, yearTo: 2026 },
      { name: "Grand Vitara", yearFrom: 2023, yearTo: 2026 },
      { name: "Ignis", yearFrom: 2017, yearTo: 2026 },
      { name: "Jimny", yearFrom: 2019, yearTo: 2026 },
      { name: "S-Presso", yearFrom: 2020, yearTo: 2026 },
      { name: "Swift", yearFrom: 2006, yearTo: 2026 },
      { name: "Vitara", yearFrom: 2015, yearTo: 2023 },
      { name: "Vitara Brezza", yearFrom: 2018, yearTo: 2023 },
    ],
  },
  {
    name: "Toyota",
    models: [
      { name: "Agya", yearFrom: 2023, yearTo: 2026 },
      { name: "Avanza", yearFrom: 2006, yearTo: 2026 },
      { name: "Aygo X", yearFrom: 2022, yearTo: 2026 },
      { name: "C-HR", yearFrom: 2017, yearTo: 2026 },
      { name: "Corolla", yearFrom: 2002, yearTo: 2026 },
      { name: "Corolla Cross", yearFrom: 2021, yearTo: 2026 },
      { name: "Fortuner", yearFrom: 2005, yearTo: 2026 },
      { name: "Hilux", yearFrom: 1969, yearTo: 2026 },
      { name: "Land Cruiser 300", yearFrom: 2022, yearTo: 2026 },
      { name: "Land Cruiser 79", yearFrom: 2007, yearTo: 2026 },
      { name: "Land Cruiser Prado", yearFrom: 2003, yearTo: 2026 },
      { name: "RAV4", yearFrom: 2006, yearTo: 2026 },
      { name: "Rumion", yearFrom: 2022, yearTo: 2026 },
      { name: "Starlet", yearFrom: 2020, yearTo: 2026 },
      { name: "Urban Cruiser", yearFrom: 2020, yearTo: 2026 },
      { name: "Veloz", yearFrom: 2023, yearTo: 2026 },
      { name: "Vitz", yearFrom: 2005, yearTo: 2019 },
      { name: "Yaris", yearFrom: 2006, yearTo: 2023 },
      { name: "Yaris Cross", yearFrom: 2024, yearTo: 2026 },
    ],
  },
  {
    name: "Volkswagen",
    models: [
      { name: "Amarok", yearFrom: 2011, yearTo: 2026 },
      { name: "Caddy", yearFrom: 2004, yearTo: 2026 },
      { name: "Golf", yearFrom: 2004, yearTo: 2026 },
      { name: "ID.4", yearFrom: 2023, yearTo: 2026 },
      { name: "Polo", yearFrom: 2002, yearTo: 2026 },
      { name: "Polo Vivo", yearFrom: 2010, yearTo: 2026 },
      { name: "T-Cross", yearFrom: 2019, yearTo: 2026 },
      { name: "T-Roc", yearFrom: 2022, yearTo: 2026 },
      { name: "Taigo", yearFrom: 2023, yearTo: 2026 },
      { name: "Tiguan", yearFrom: 2008, yearTo: 2026 },
      { name: "Touareg", yearFrom: 2010, yearTo: 2026 },
      { name: "Transporter", yearFrom: 2004, yearTo: 2026 },
    ],
  },
  {
    name: "Volvo",
    models: [
      { name: "XC40", yearFrom: 2018, yearTo: 2026 },
      { name: "XC60", yearFrom: 2009, yearTo: 2026 },
      { name: "XC90", yearFrom: 2003, yearTo: 2026 },
    ],
  },
];

export const SA_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape",
] as const;

export function getRecentMakes(): string[] {
  return RECENT_MAKES;
}

export function getAllMakes(): string[] {
  return VEHICLE_CATALOG.map((m) => m.name).sort();
}

export function getModelsForMake(make: string): { recent: VehicleModel[]; all: VehicleModel[] } {
  const entry = VEHICLE_CATALOG.find((m) => m.name === make);
  if (!entry) return { recent: [], all: [] };

  const recentNames = RECENT_MODELS[make] ?? [];
  const recent = recentNames
    .map((n) => entry.models.find((m) => m.name === n))
    .filter((m): m is VehicleModel => !!m);
  const all = [...entry.models].sort((a, b) => a.name.localeCompare(b.name));

  return { recent, all };
}

export function getYearsForModel(make: string, model: string): number[] {
  const entry = VEHICLE_CATALOG.find((m) => m.name === make);
  if (!entry) return [];
  const m = entry.models.find((mod) => mod.name === model);
  if (!m) return [];
  const years: number[] = [];
  for (let y = m.yearTo; y >= m.yearFrom; y--) {
    years.push(y);
  }
  return years;
}
