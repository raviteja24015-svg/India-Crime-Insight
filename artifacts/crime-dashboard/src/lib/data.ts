export const CITIES = [
  "Mumbai", "Delhi", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", "Pune", 
  "Ahmedabad", "Jaipur", "Lucknow", "Surat", "Kanpur", "Nagpur", "Indore", 
  "Thane", "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ludhiana", 
  "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Amritsar", "Varanasi", 
  "Srinagar", "Aurangabad"
];

export const CRIME_TYPES = [
  "Homicide", "Assault", "Burglary", "Robbery", "Theft", "Rape", 
  "Kidnapping", "Arson", "Fraud", "Cybercrime", "Drug Trafficking", 
  "Arms Trafficking", "Extortion", "Vandalism", "Hit and Run", 
  "Domestic Violence", "Stalking", "Human Trafficking", "Counterfeiting", 
  "Rioting", "Vehicle Theft"
];

export const WEAPONS = [
  "Firearm", "Knife", "Blunt Object", "Explosive", "Vehicle", "Acid", "Bare Hands", "Unknown"
];

export const DOMAINS = ["Violent Crime", "Other", "Fire Accident", "Traffic Fatality"];

export interface Incident {
  id: string;
  reportNumber: string;
  city: string;
  date: string;
  month: number;
  crimeType: string;
  victimAge: number;
  gender: string;
  weaponUsed: string;
  policeDeployed: number;
  caseClosed: boolean;
  domain: string;
}

const getDomain = (crimeType: string) => {
  const violent = ["Homicide", "Assault", "Robbery", "Rape", "Kidnapping", "Extortion", "Domestic Violence", "Rioting", "Human Trafficking"];
  const traffic = ["Hit and Run"];
  const fire = ["Arson"];
  if (violent.includes(crimeType)) return "Violent Crime";
  if (traffic.includes(crimeType)) return "Traffic Fatality";
  if (fire.includes(crimeType)) return "Fire Accident";
  return "Other";
};

const getWeapon = (crimeType: string) => {
  const weapons = {
    Homicide: ["Firearm", "Knife", "Blunt Object"],
    Assault: ["Bare Hands", "Blunt Object", "Knife"],
    Cybercrime: ["Unknown"],
    Fraud: ["Unknown"],
    "Hit and Run": ["Vehicle"],
    Arson: ["Explosive", "Unknown"],
  };
  const list = weapons[crimeType as keyof typeof weapons] || WEAPONS;
  return list[Math.floor(Math.random() * list.length)];
};

export function generateData(count: number = 1200): Incident[] {
  const data: Incident[] = [];
  
  for (let i = 1; i <= count; i++) {
    const isMale = Math.random() < 0.65;
    const isFemale = !isMale && Math.random() < 0.85; // 30% of total
    
    // Normal-ish distribution around 30 for age (14-70)
    let age = Math.floor(30 + (Math.random() + Math.random() - 1) * 20);
    age = Math.max(14, Math.min(70, age));

    const crimeType = CRIME_TYPES[Math.floor(Math.random() * CRIME_TYPES.length)];
    
    // Random date in 2024
    const dateObj = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    
    data.push({
      id: `CR-2024-${i.toString().padStart(5, '0')}`,
      reportNumber: `CR-2024-${i.toString().padStart(5, '0')}`,
      city: CITIES[Math.floor(Math.random() * CITIES.length)],
      date: dateObj.toISOString().split('T')[0],
      month: dateObj.getMonth(),
      crimeType,
      victimAge: age,
      gender: isMale ? "Male" : (isFemale ? "Female" : "Other"),
      weaponUsed: getWeapon(crimeType),
      policeDeployed: Math.floor(Math.random() * 11) + 2,
      caseClosed: Math.random() < 0.6,
      domain: getDomain(crimeType)
    });
  }
  
  return data;
}