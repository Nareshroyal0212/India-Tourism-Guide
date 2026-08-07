// src/data/fuelStations.js
// Curated sample data. In production, replace with a live Places API
// (Google Places "gas_station" / "charging_station" types) for real-time
// results near the user's actual location.

const FUEL_STATIONS = [
  { id: 1, name: 'Indian Oil - NH48 Plaza', type: 'Petrol', city: 'Gurugram', state: 'Haryana', highway: 'NH48', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom', 'ATM', 'Convenience Store'], hours: '24 Hours' },
  { id: 2, name: 'HP Petrol Pump - Jaipur Highway', type: 'Petrol', city: 'Jaipur', state: 'Rajasthan', highway: 'NH48', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom', 'Air Check', 'Food Court'], hours: '24 Hours' },
  { id: 3, name: 'Bharat Petroleum - Mumbai-Pune Expy', type: 'Petrol', city: 'Lonavala', state: 'Maharashtra', highway: 'Mumbai-Pune Expressway', fuels: ['Petrol', 'Diesel', 'CNG'], amenities: ['Restroom', 'Restaurant', 'ATM'], hours: '24 Hours' },
  { id: 4, name: 'Reliance Petroleum - Bangalore Bypass', type: 'Petrol', city: 'Bangalore', state: 'Karnataka', highway: 'NH44', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom', 'Convenience Store'], hours: '24 Hours' },
  { id: 5, name: 'Indian Oil - GT Road', type: 'Petrol', city: 'Amritsar', state: 'Punjab', highway: 'NH1', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom', 'Dhaba Nearby', 'ATM'], hours: '24 Hours' },
  { id: 6, name: 'Tata Power EV Charging - DLF Cyber City', type: 'EV', city: 'Gurugram', state: 'Haryana', highway: 'NH48', fuels: ['EV Fast Charging'], amenities: ['Cafe', 'Restroom', 'Waiting Lounge'], hours: '24 Hours', chargerType: 'CCS2, Type 2', power: '60 kW' },
  { id: 7, name: 'Statiq EV Hub - MG Road', type: 'EV', city: 'Bangalore', state: 'Karnataka', highway: 'Ring Road', fuels: ['EV Fast Charging'], amenities: ['Restroom', 'Shopping Mall Nearby'], hours: '6 AM - 11 PM', chargerType: 'CCS2', power: '50 kW' },
  { id: 8, name: 'Ather Grid - Indiranagar', type: 'EV', city: 'Bangalore', state: 'Karnataka', highway: 'Local', fuels: ['EV Fast Charging'], amenities: ['Cafe'], hours: '24 Hours', chargerType: 'Type 2', power: '3.3 kW' },
  { id: 9, name: 'ChargeZone - Vadodara Expressway', type: 'EV', city: 'Vadodara', state: 'Gujarat', highway: 'NE1 Expressway', fuels: ['EV Fast Charging'], amenities: ['Restroom', 'Food Court'], hours: '24 Hours', chargerType: 'CCS2, CHAdeMO', power: '60 kW' },
  { id: 10, name: 'Fortum Charge & Drive - Pune-Bangalore Hwy', type: 'EV', city: 'Kolhapur', state: 'Maharashtra', highway: 'NH48', fuels: ['EV Fast Charging'], amenities: ['Restroom', 'Cafe'], hours: '24 Hours', chargerType: 'CCS2', power: '50 kW' },
  { id: 11, name: 'HP Petrol Pump - Chennai OMR', type: 'Petrol', city: 'Chennai', state: 'Tamil Nadu', highway: 'OMR', fuels: ['Petrol', 'Diesel', 'CNG'], amenities: ['Restroom', 'ATM', 'Air Check'], hours: '24 Hours' },
  { id: 12, name: 'Indian Oil - Kochi Bypass', type: 'Petrol', city: 'Kochi', state: 'Kerala', highway: 'NH66', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom', 'Convenience Store'], hours: '24 Hours' },

  // ---- Karnataka (more) ----
  { id: 13, name: 'Bharat Petroleum - Electronic City', type: 'Petrol', city: 'Bangalore', state: 'Karnataka', highway: 'NH44', fuels: ['Petrol', 'Diesel', 'CNG'], amenities: ['Restroom', 'ATM'], hours: '24 Hours' },
  { id: 14, name: 'Indian Oil - Mysuru Road', type: 'Petrol', city: 'Mysuru', state: 'Karnataka', highway: 'NH275', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom', 'Food Court'], hours: '24 Hours' },
  { id: 15, name: 'Zeon Charging - Whitefield', type: 'EV', city: 'Bangalore', state: 'Karnataka', highway: 'Local', fuels: ['EV Fast Charging'], amenities: ['Cafe', 'Restroom'], hours: '24 Hours', chargerType: 'CCS2', power: '60 kW' },

  // ---- Tamil Nadu (more) ----
  { id: 16, name: 'Indian Oil - GST Road', type: 'Petrol', city: 'Chennai', state: 'Tamil Nadu', highway: 'NH32', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom', 'Convenience Store', 'ATM'], hours: '24 Hours' },
  { id: 17, name: 'HP Petrol Pump - Madurai Bypass', type: 'Petrol', city: 'Madurai', state: 'Tamil Nadu', highway: 'NH38', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom', 'Food Court'], hours: '24 Hours' },
  { id: 18, name: 'Statiq EV Hub - Coimbatore', type: 'EV', city: 'Coimbatore', state: 'Tamil Nadu', highway: 'NH544', fuels: ['EV Fast Charging'], amenities: ['Restroom', 'Cafe'], hours: '6 AM - 11 PM', chargerType: 'CCS2', power: '50 kW' },

  // ---- Kerala (more) ----
  { id: 19, name: 'Bharat Petroleum - NH66 Kozhikode', type: 'Petrol', city: 'Kozhikode', state: 'Kerala', highway: 'NH66', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom', 'ATM'], hours: '24 Hours' },
  { id: 20, name: 'Kerala EV Charging Hub - Kochi Metro', type: 'EV', city: 'Kochi', state: 'Kerala', highway: 'Local', fuels: ['EV Fast Charging'], amenities: ['Restroom', 'Waiting Lounge'], hours: '6 AM - 10 PM', chargerType: 'CCS2, Type 2', power: '50 kW' },

  // ---- Andhra Pradesh ----
  { id: 21, name: 'Indian Oil - NH16 Vijayawada', type: 'Petrol', city: 'Vijayawada', state: 'Andhra Pradesh', highway: 'NH16', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom', 'Food Court', 'ATM'], hours: '24 Hours' },
  { id: 22, name: 'HP Petrol Pump - Visakhapatnam Beach Road', type: 'Petrol', city: 'Visakhapatnam', state: 'Andhra Pradesh', highway: 'NH16', fuels: ['Petrol', 'Diesel', 'CNG'], amenities: ['Restroom', 'Convenience Store'], hours: '24 Hours' },

  // ---- Telangana (more) ----
  { id: 23, name: 'Bharat Petroleum - ORR Hyderabad', type: 'Petrol', city: 'Hyderabad', state: 'Telangana', highway: 'Outer Ring Road', fuels: ['Petrol', 'Diesel', 'CNG'], amenities: ['Restroom', 'Food Court', 'ATM'], hours: '24 Hours' },
  { id: 24, name: 'Tata Power EV Charging - Gachibowli', type: 'EV', city: 'Hyderabad', state: 'Telangana', highway: 'Local', fuels: ['EV Fast Charging'], amenities: ['Cafe', 'Restroom'], hours: '24 Hours', chargerType: 'CCS2, Type 2', power: '60 kW' },

  // ---- Maharashtra (more) ----
  { id: 25, name: 'Indian Oil - Pune-Bangalore Highway', type: 'Petrol', city: 'Pune', state: 'Maharashtra', highway: 'NH48', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom', 'Dhaba Nearby'], hours: '24 Hours' },
  { id: 26, name: 'Ather Grid - Nagpur', type: 'EV', city: 'Nagpur', state: 'Maharashtra', highway: 'Local', fuels: ['EV Fast Charging'], amenities: ['Cafe'], hours: '24 Hours', chargerType: 'Type 2', power: '3.3 kW' },

  // ---- Gujarat ----
  { id: 27, name: 'Indian Oil - NE1 Expressway', type: 'Petrol', city: 'Vadodara', state: 'Gujarat', highway: 'NE1 Expressway', fuels: ['Petrol', 'Diesel', 'CNG'], amenities: ['Restroom', 'Food Court', 'ATM'], hours: '24 Hours' },
  { id: 28, name: 'ChargeZone - Ahmedabad Ring Road', type: 'EV', city: 'Ahmedabad', state: 'Gujarat', highway: 'Ring Road', fuels: ['EV Fast Charging'], amenities: ['Restroom', 'Cafe'], hours: '24 Hours', chargerType: 'CCS2', power: '60 kW' },

  // ---- Madhya Pradesh ----
  { id: 29, name: 'HP Petrol Pump - AB Road Indore', type: 'Petrol', city: 'Indore', state: 'Madhya Pradesh', highway: 'NH52', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom', 'Convenience Store'], hours: '24 Hours' },
  { id: 30, name: 'Bharat Petroleum - Bhopal Bypass', type: 'Petrol', city: 'Bhopal', state: 'Madhya Pradesh', highway: 'NH46', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom', 'ATM'], hours: '24 Hours' },

  // ---- Uttar Pradesh ----
  { id: 31, name: 'Indian Oil - Yamuna Expressway', type: 'Petrol', city: 'Greater Noida', state: 'Uttar Pradesh', highway: 'Yamuna Expressway', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom', 'Food Court', 'ATM'], hours: '24 Hours' },
  { id: 32, name: 'Tata Power EV Charging - Lucknow', type: 'EV', city: 'Lucknow', state: 'Uttar Pradesh', highway: 'Local', fuels: ['EV Fast Charging'], amenities: ['Cafe', 'Restroom'], hours: '24 Hours', chargerType: 'CCS2, Type 2', power: '50 kW' },

  // ---- Bihar ----
  { id: 33, name: 'Indian Oil - NH31 Patna', type: 'Petrol', city: 'Patna', state: 'Bihar', highway: 'NH31', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom'], hours: '24 Hours' },

  // ---- Jharkhand ----
  { id: 34, name: 'HP Petrol Pump - Ranchi NH33', type: 'Petrol', city: 'Ranchi', state: 'Jharkhand', highway: 'NH33', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom', 'ATM'], hours: '24 Hours' },

  // ---- Chhattisgarh ----
  { id: 35, name: 'Bharat Petroleum - Raipur NH53', type: 'Petrol', city: 'Raipur', state: 'Chhattisgarh', highway: 'NH53', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom', 'Convenience Store'], hours: '24 Hours' },

  // ---- Odisha ----
  { id: 36, name: 'Indian Oil - Bhubaneswar NH16', type: 'Petrol', city: 'Bhubaneswar', state: 'Odisha', highway: 'NH16', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom', 'Food Court'], hours: '24 Hours' },

  // ---- Arunachal Pradesh ----
  { id: 37, name: 'IOC Petrol Pump - Tawang Road', type: 'Petrol', city: 'Tawang', state: 'Arunachal Pradesh', highway: 'NH13', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom'], hours: '6 AM - 8 PM' },

  // ---- Manipur ----
  { id: 38, name: 'Indian Oil - Imphal', type: 'Petrol', city: 'Imphal', state: 'Manipur', highway: 'NH2', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom'], hours: '6 AM - 9 PM' },

  // ---- Meghalaya ----
  { id: 39, name: 'HP Petrol Pump - Shillong', type: 'Petrol', city: 'Shillong', state: 'Meghalaya', highway: 'NH6', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom', 'Cafe Nearby'], hours: '6 AM - 9 PM' },

  // ---- Mizoram ----
  { id: 40, name: 'Indian Oil - Aizawl', type: 'Petrol', city: 'Aizawl', state: 'Mizoram', highway: 'NH54', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom'], hours: '6 AM - 8 PM' },

  // ---- Nagaland ----
  { id: 41, name: 'Bharat Petroleum - Kohima', type: 'Petrol', city: 'Kohima', state: 'Nagaland', highway: 'NH29', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom'], hours: '6 AM - 8 PM' },

  // ---- Sikkim ----
  { id: 42, name: 'Indian Oil - Gangtok', type: 'Petrol', city: 'Gangtok', state: 'Sikkim', highway: 'NH10', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom', 'Cafe Nearby'], hours: '7 AM - 8 PM' },

  // ---- Tripura ----
  { id: 43, name: 'HP Petrol Pump - Agartala', type: 'Petrol', city: 'Agartala', state: 'Tripura', highway: 'NH8', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom'], hours: '6 AM - 9 PM' },

  // ---- Jammu & Kashmir ----
  { id: 44, name: 'Indian Oil - Srinagar-Jammu Highway', type: 'Petrol', city: 'Srinagar', state: 'Jammu and Kashmir', highway: 'NH44', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom', 'Food Court'], hours: '6 AM - 10 PM' },

  // ---- Ladakh ----
  { id: 45, name: 'Indian Oil - Leh (Highest Petrol Pump Route)', type: 'Petrol', city: 'Leh', state: 'Ladakh', highway: 'NH1', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom'], hours: '7 AM - 7 PM (seasonal)' },

  // ---- Puducherry ----
  { id: 46, name: 'Bharat Petroleum - ECR Puducherry', type: 'Petrol', city: 'Puducherry', state: 'Puducherry', highway: 'East Coast Road', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom', 'Cafe'], hours: '24 Hours' },

  // ---- Chandigarh ----
  { id: 47, name: 'Indian Oil - Chandigarh Highway', type: 'Petrol', city: 'Chandigarh', state: 'Chandigarh', highway: 'NH5', fuels: ['Petrol', 'Diesel'], amenities: ['Restroom', 'ATM'], hours: '24 Hours' },
  { id: 48, name: 'Tata Power EV Charging - Chandigarh Sector 17', type: 'EV', city: 'Chandigarh', state: 'Chandigarh', highway: 'Local', fuels: ['EV Fast Charging'], amenities: ['Cafe', 'Restroom'], hours: '24 Hours', chargerType: 'CCS2, Type 2', power: '50 kW' },
];

export const STATION_TYPES = ['All', 'Petrol', 'EV'];
export const FUEL_STATES = ['All States', ...Array.from(new Set(FUEL_STATIONS.map(s => s.state))).sort()];

export default FUEL_STATIONS;