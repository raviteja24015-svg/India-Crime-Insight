import rawData from "./crimeData.json";

export const CITIES = [
  "Agra", "Ahmedabad", "Bangalore", "Bhopal", "Chennai", "Delhi",
  "Faridabad", "Ghaziabad", "Hyderabad", "Indore", "Jaipur", "Kalyan",
  "Kanpur", "Kolkata", "Lucknow", "Ludhiana", "Meerut", "Mumbai",
  "Nagpur", "Nashik", "Patna", "Pune", "Rajkot", "Srinagar",
  "Surat", "Thane", "Varanasi", "Vasai", "Visakhapatnam"
];

export const CRIME_TYPES = [
  "Arson", "Assault", "Burglary", "Counterfeiting", "Cybercrime",
  "Domestic Violence", "Drug Offense", "Extortion", "Firearm Offense",
  "Fraud", "Homicide", "Identity Theft", "Illegal Possession",
  "Kidnapping", "Public Intoxication", "Robbery", "Sexual Assault",
  "Shoplifting", "Traffic Violation", "Vandalism", "Vehicle - Stolen"
];

export const WEAPONS = [
  "Blunt Object", "Explosives", "Firearm", "Knife", "None", "Other", "Poison"
];

export const DOMAINS = ["Violent Crime", "Other Crime", "Fire Accident", "Traffic Fatality"];

export interface Incident {
  id: number;
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

export function generateData(): Incident[] {
  return rawData as Incident[];
}
