// src/data/tollPlazas.js
// Sample toll plaza data with representative fixed rates (as of listing).
// Real toll rates change periodically (NHAI revises them every April) -
// this is for trip cost estimation only, not a live/authoritative source.
// For actual live tolling and FASTag deductions, that requires direct
// NHAI/IHMCL API integration and a licensed payment processor tied to
// your business - not something fakeable with static data.

const TOLL_PLAZAS = [
  { id: 1, name: 'Kherki Daula Toll Plaza', highway: 'NH48', state: 'Haryana', nearCity: 'Gurugram', rates: { car: 65, suv: 105, bus_truck: 220 } },
  { id: 2, name: 'Shahjahanpur Toll Plaza', highway: 'NH48', state: 'Rajasthan', nearCity: 'Behror', rates: { car: 75, suv: 120, bus_truck: 250 } },
  { id: 3, name: 'Kishangarh Toll Plaza', highway: 'NH48', state: 'Rajasthan', nearCity: 'Ajmer', rates: { car: 80, suv: 130, bus_truck: 270 } },
  { id: 4, name: 'Khalapur Toll Plaza', highway: 'Mumbai-Pune Expressway', state: 'Maharashtra', nearCity: 'Khalapur', rates: { car: 270, suv: 410, bus_truck: 850 } },
  { id: 5, name: 'Talegaon Toll Plaza', highway: 'Mumbai-Pune Expressway', state: 'Maharashtra', nearCity: 'Talegaon', rates: { car: 45, suv: 70, bus_truck: 150 } },
  { id: 6, name: 'Electronic City Toll Plaza', highway: 'NH44', state: 'Karnataka', nearCity: 'Bangalore', rates: { car: 55, suv: 90, bus_truck: 190 } },
  { id: 7, name: 'Attibele Toll Plaza', highway: 'NH44', state: 'Karnataka', nearCity: 'Attibele', rates: { car: 60, suv: 95, bus_truck: 200 } },
  { id: 8, name: 'Shambhu Toll Plaza', highway: 'NH1', state: 'Punjab', nearCity: 'Rajpura', rates: { car: 70, suv: 115, bus_truck: 240 } },
  { id: 9, name: 'Panipat Toll Plaza', highway: 'NH44', state: 'Haryana', nearCity: 'Panipat', rates: { car: 85, suv: 140, bus_truck: 290 } },
  { id: 10, name: 'Vadape Toll Plaza', highway: 'NH160', state: 'Maharashtra', nearCity: 'Nashik', rates: { car: 90, suv: 145, bus_truck: 300 } },
  { id: 11, name: 'Paranur Toll Plaza', highway: 'NH48', state: 'Tamil Nadu', nearCity: 'Chennai', rates: { car: 65, suv: 100, bus_truck: 210 } },
  { id: 12, name: 'Walayar Toll Plaza', highway: 'NH544', state: 'Kerala', nearCity: 'Palakkad', rates: { car: 75, suv: 120, bus_truck: 250 } },

  // ---- Karnataka (more) ----
  { id: 13, name: 'Nelamangala Toll Plaza', highway: 'NH48', state: 'Karnataka', nearCity: 'Bangalore', rates: { car: 70, suv: 110, bus_truck: 230 } },
  { id: 14, name: 'Hoskote Toll Plaza', highway: 'NH75', state: 'Karnataka', nearCity: 'Bangalore', rates: { car: 60, suv: 95, bus_truck: 200 } },
  { id: 15, name: 'Kunigal Toll Plaza', highway: 'NH48', state: 'Karnataka', nearCity: 'Kunigal', rates: { car: 65, suv: 105, bus_truck: 215 } },
  { id: 16, name: 'Sira Toll Plaza', highway: 'NH48', state: 'Karnataka', nearCity: 'Tumakuru', rates: { car: 70, suv: 110, bus_truck: 225 } },

  // ---- Tamil Nadu (more) ----
  { id: 17, name: 'Chengalpattu Toll Plaza', highway: 'NH32', state: 'Tamil Nadu', nearCity: 'Chengalpattu', rates: { car: 60, suv: 95, bus_truck: 195 } },
  { id: 18, name: 'Ulundurpettai Toll Plaza', highway: 'NH32', state: 'Tamil Nadu', nearCity: 'Villupuram', rates: { car: 75, suv: 120, bus_truck: 245 } },
  { id: 19, name: 'Krishnagiri Toll Plaza', highway: 'NH44', state: 'Tamil Nadu', nearCity: 'Krishnagiri', rates: { car: 65, suv: 105, bus_truck: 215 } },

  // ---- Kerala (more) ----
  { id: 20, name: 'Edappally Toll Plaza', highway: 'NH66', state: 'Kerala', nearCity: 'Kochi', rates: { car: 55, suv: 90, bus_truck: 185 } },
  { id: 21, name: 'Kumarakom Toll Plaza', highway: 'NH183', state: 'Kerala', nearCity: 'Kottayam', rates: { car: 45, suv: 75, bus_truck: 160 } },
  { id: 22, name: 'Amaravila Toll Plaza', highway: 'NH66', state: 'Kerala', nearCity: 'Thiruvananthapuram', rates: { car: 60, suv: 95, bus_truck: 195 } },

  // ---- Andhra Pradesh ----
  { id: 23, name: 'Gundugolanu Toll Plaza', highway: 'NH16', state: 'Andhra Pradesh', nearCity: 'Eluru', rates: { car: 80, suv: 130, bus_truck: 270 } },
  { id: 24, name: 'Kadapa Toll Plaza', highway: 'NH716', state: 'Andhra Pradesh', nearCity: 'Kadapa', rates: { car: 65, suv: 105, bus_truck: 215 } },
  { id: 25, name: 'Nellore Bypass Toll Plaza', highway: 'NH16', state: 'Andhra Pradesh', nearCity: 'Nellore', rates: { car: 75, suv: 120, bus_truck: 250 } },

  // ---- Telangana ----
  { id: 26, name: 'Pantangi Toll Plaza', highway: 'NH65', state: 'Telangana', nearCity: 'Hyderabad', rates: { car: 85, suv: 135, bus_truck: 280 } },
  { id: 27, name: 'Bibinagar Toll Plaza', highway: 'NH65', state: 'Telangana', nearCity: 'Bhongir', rates: { car: 70, suv: 115, bus_truck: 235 } },
  { id: 28, name: 'Choutuppal Toll Plaza', highway: 'NH65', state: 'Telangana', nearCity: 'Choutuppal', rates: { car: 65, suv: 105, bus_truck: 220 } },

  // ---- Maharashtra (more) ----
  { id: 29, name: 'Urse Toll Plaza', highway: 'Mumbai-Pune Expressway', state: 'Maharashtra', nearCity: 'Lonavala', rates: { car: 100, suv: 155, bus_truck: 320 } },
  { id: 30, name: 'Chandwad Toll Plaza', highway: 'NH160', state: 'Maharashtra', nearCity: 'Nashik', rates: { car: 75, suv: 120, bus_truck: 250 } },
  { id: 31, name: 'Karad Toll Plaza', highway: 'NH48', state: 'Maharashtra', nearCity: 'Karad', rates: { car: 90, suv: 145, bus_truck: 300 } },

  // ---- Gujarat ----
  { id: 32, name: 'Bharuch Toll Plaza', highway: 'NH48', state: 'Gujarat', nearCity: 'Bharuch', rates: { car: 85, suv: 135, bus_truck: 280 } },
  { id: 33, name: 'Vadodara-Ahmedabad Expressway Toll', highway: 'NE1 Expressway', state: 'Gujarat', nearCity: 'Vadodara', rates: { car: 95, suv: 150, bus_truck: 310 } },

  // ---- Madhya Pradesh ----
  { id: 34, name: 'Dewas Bypass Toll Plaza', highway: 'NH52', state: 'Madhya Pradesh', nearCity: 'Dewas', rates: { car: 70, suv: 115, bus_truck: 235 } },
  { id: 35, name: 'Rau Toll Plaza', highway: 'NH52', state: 'Madhya Pradesh', nearCity: 'Indore', rates: { car: 65, suv: 105, bus_truck: 220 } },

  // ---- Uttar Pradesh ----
  { id: 36, name: 'Yamuna Expressway Toll (Jewar)', highway: 'Yamuna Expressway', state: 'Uttar Pradesh', nearCity: 'Greater Noida', rates: { car: 190, suv: 300, bus_truck: 610 } },
  { id: 37, name: 'Agra-Lucknow Expressway Toll', highway: 'Agra-Lucknow Expressway', state: 'Uttar Pradesh', nearCity: 'Agra', rates: { car: 165, suv: 260, bus_truck: 540 } },

  // ---- Bihar ----
  { id: 38, name: 'Bakhtiyarpur Toll Plaza', highway: 'NH31', state: 'Bihar', nearCity: 'Patna', rates: { car: 75, suv: 120, bus_truck: 245 } },

  // ---- Jharkhand ----
  { id: 39, name: 'Ramgarh Toll Plaza', highway: 'NH33', state: 'Jharkhand', nearCity: 'Ranchi', rates: { car: 70, suv: 110, bus_truck: 225 } },

  // ---- Chhattisgarh ----
  { id: 40, name: 'Simga Toll Plaza', highway: 'NH53', state: 'Chhattisgarh', nearCity: 'Raipur', rates: { car: 65, suv: 105, bus_truck: 215 } },

  // ---- Odisha ----
  { id: 41, name: 'Chandikhol Toll Plaza', highway: 'NH16', state: 'Odisha', nearCity: 'Bhubaneswar', rates: { car: 80, suv: 130, bus_truck: 270 } },
];

export const VEHICLE_TYPES = [
  { key: 'car', label: 'Car / Jeep / Van' },
  { key: 'suv', label: 'SUV / Light Commercial' },
  { key: 'bus_truck', label: 'Bus / Truck' },
];

export default TOLL_PLAZAS;