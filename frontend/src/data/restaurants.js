// src/data/restaurants.js
const RESTAURANTS = [
  { id: 1, name: 'Bukhara', city: 'Delhi', state: 'Delhi', cuisine: 'North Indian', category: 'Fine Dining', price: '₹₹₹', rating: 4.7, mustTry: 'Dal Bukhara, Sikandari Raan', desc: 'Legendary tandoor restaurant famous for its rustic North-West Frontier cuisine, a favorite of world leaders.' },
  { id: 2, name: 'Karim\'s', city: 'Delhi', state: 'Delhi', cuisine: 'Mughlai', category: 'Street Food', price: '₹', rating: 4.4, mustTry: 'Mutton Korma, Seekh Kebab', desc: 'A century-old institution near Jama Masjid serving authentic Mughlai food since 1913.' },
  { id: 3, name: 'Leopold Cafe', city: 'Mumbai', state: 'Maharashtra', cuisine: 'Multi-cuisine', category: 'Cafe', price: '₹₹', rating: 4.2, mustTry: 'Chicken Tikka, Beer', desc: 'Iconic Colaba cafe open since 1871, a favorite backpacker hangout with a storied history.' },
  { id: 4, name: 'Britannia & Co.', city: 'Mumbai', state: 'Maharashtra', cuisine: 'Parsi', category: 'Casual Dining', price: '₹₹', rating: 4.5, mustTry: 'Berry Pulao, Caramel Custard', desc: 'A charming old-world Parsi eatery run by the same family for generations.' },
  { id: 5, name: 'Vidyarthi Bhavan', city: 'Bangalore', state: 'Karnataka', cuisine: 'South Indian', category: 'Vegetarian', price: '₹', rating: 4.6, mustTry: 'Masala Dosa, Filter Coffee', desc: 'A beloved Basavanagudi institution since 1943, famous for crispy masala dosas.' },
  { id: 6, name: 'MTR (Mavalli Tiffin Room)', city: 'Bangalore', state: 'Karnataka', cuisine: 'South Indian', category: 'Vegetarian', price: '₹', rating: 4.5, mustTry: 'Rava Idli, Filter Coffee', desc: 'One of Bangalore\'s oldest and most famous vegetarian restaurants, running since 1924.' },
  { id: 7, name: 'Peter Cat', city: 'Kolkata', state: 'West Bengal', cuisine: 'Continental', category: 'Casual Dining', price: '₹₹', rating: 4.4, mustTry: 'Chelo Kebab, Chicken a la Kiev', desc: 'A Park Street landmark serving Kolkata\'s favorite Chelo Kebab since 1975.' },
  { id: 8, name: '6 Ballygunge Place', city: 'Kolkata', state: 'West Bengal', cuisine: 'Bengali', category: 'Fine Dining', price: '₹₹', rating: 4.5, mustTry: 'Kosha Mangsho, Bhapa Ilish', desc: 'Authentic Bengali cuisine served in a beautifully restored heritage mansion.' },
  { id: 9, name: 'Paradise Biryani', city: 'Hyderabad', state: 'Telangana', cuisine: 'Hyderabadi', category: 'Casual Dining', price: '₹₹', rating: 4.3, mustTry: 'Hyderabadi Biryani', desc: 'The most famous name in Hyderabadi biryani, a city institution since 1953.' },
  { id: 10, name: 'Bawarchi', city: 'Hyderabad', state: 'Telangana', cuisine: 'Hyderabadi', category: 'Casual Dining', price: '₹', rating: 4.4, mustTry: 'Chicken Biryani', desc: 'A local favorite for value-for-money, generously portioned Hyderabadi biryani.' },
  { id: 11, name: 'Saravana Bhavan', city: 'Chennai', state: 'Tamil Nadu', cuisine: 'South Indian', category: 'Vegetarian', price: '₹', rating: 4.4, mustTry: 'Ghee Roast, Sambar Vada', desc: 'The world-famous South Indian vegetarian chain that started right here in Chennai.' },
  { id: 12, name: 'Murugan Idli Shop', city: 'Chennai', state: 'Tamil Nadu', cuisine: 'South Indian', category: 'Vegetarian', price: '₹', rating: 4.5, mustTry: 'Soft Idli, Podi Idli', desc: 'Famous for the softest idlis in the city, a Chennai breakfast institution.' },
  { id: 13, name: 'Thalassery Food Court', city: 'Kochi', state: 'Kerala', cuisine: 'Kerala', category: 'Casual Dining', price: '₹', rating: 4.3, mustTry: 'Malabar Biryani, Fish Curry', desc: 'Known for authentic Malabar-style biryani and traditional Kerala home-style cooking.' },
  { id: 14, name: 'Kayikka Hotel', city: 'Kozhikode', state: 'Kerala', cuisine: 'Kerala', category: 'Casual Dining', price: '₹', rating: 4.4, mustTry: 'Kozhikode Biryani', desc: 'A beloved local spot serving Kozhikode-style biryani since the 1950s.' },
  { id: 15, name: 'Chokhi Dhani', city: 'Jaipur', state: 'Rajasthan', cuisine: 'Rajasthani', category: 'Themed Dining', price: '₹₹', rating: 4.5, mustTry: 'Dal Baati Churma, Thali', desc: 'An immersive Rajasthani village-themed resort and restaurant with unlimited thalis and folk performances.' },
  { id: 16, name: 'Laxmi Misthan Bhandar (LMB)', city: 'Jaipur', state: 'Rajasthan', cuisine: 'Rajasthani', category: 'Vegetarian', price: '₹', rating: 4.3, mustTry: 'Pyaaz Kachori, Sweets', desc: 'A historic Jaipur sweet shop and restaurant serving Rajasthani vegetarian food since 1954.' },
  { id: 17, name: 'Cafe Mangii Beach Shack', city: 'Calangute', state: 'Goa', cuisine: 'Goan Seafood', price: '₹₹', category: 'Beach Shack', rating: 4.2, mustTry: 'Fish Thali, Prawn Curry', desc: 'A relaxed beachfront shack serving fresh Goan seafood with your toes in the sand.' },
  { id: 18, name: 'Ritz Classic', city: 'Panaji', state: 'Goa', cuisine: 'Goan', category: 'Casual Dining', price: '₹', rating: 4.4, mustTry: 'Fish Curry Rice, Chicken Xacuti', desc: 'A no-frills local favorite serving authentic home-style Goan thalis.' },
  { id: 19, name: 'Kesar Da Dhaba', city: 'Amritsar', state: 'Punjab', cuisine: 'Punjabi', category: 'Street Food', price: '₹', rating: 4.5, mustTry: 'Dal Makhani, Lachha Paratha', desc: 'A legendary dhaba near the Golden Temple, run by the same family since 1916.' },
  { id: 20, name: 'Brothers Dhaba', city: 'Amritsar', state: 'Punjab', cuisine: 'Punjabi', category: 'Street Food', price: '₹', rating: 4.4, mustTry: 'Amritsari Kulcha, Chole', desc: 'One of the most popular spots in Amritsar for stuffed kulchas and chole.' },
  { id: 21, name: 'Indian Coffee House', city: 'Shimla', state: 'Himachal Pradesh', cuisine: 'Multi-cuisine', category: 'Cafe', price: '₹', rating: 4.1, mustTry: 'South Indian Coffee, Cutlets', desc: 'A nostalgic old-school coffee house on the Mall Road, a Shimla tradition since decades.' },
  { id: 22, name: 'Wangda Kitchen', city: 'Manali', state: 'Himachal Pradesh', cuisine: 'Tibetan', category: 'Casual Dining', price: '₹', rating: 4.3, mustTry: 'Thukpa, Momos', desc: 'A cozy Tibetan eatery in Old Manali serving hearty thukpa and handmade momos.' },
  { id: 23, name: 'Baba Cabin', city: 'Rishikesh', state: 'Uttarakhand', cuisine: 'Multi-cuisine', category: 'Cafe', price: '₹', rating: 4.4, mustTry: 'Israeli Thali, Smoothie Bowl', desc: 'A riverside cafe popular with travelers, known for its laid-back vibe and global menu.' },
  { id: 24, name: 'Assam Valley Kitchen', city: 'Guwahati', state: 'Assam', cuisine: 'Assamese', category: 'Casual Dining', price: '₹₹', rating: 4.3, mustTry: 'Masor Tenga, Duck Curry', desc: 'One of the few places serving authentic, traditional Assamese thalis in the city.' },

  // ---- Karnataka (more Bangalore + other cities) ----
  { id: 25, name: 'CTR (Central Tiffin Room)', city: 'Bangalore', state: 'Karnataka', cuisine: 'South Indian', category: 'Vegetarian', price: '₹', rating: 4.6, mustTry: 'Benne Masala Dosa', desc: 'A Malleswaram legend known almost exclusively for its butter-soaked masala dosa.' },
  { id: 26, name: 'Nagarjuna', city: 'Bangalore', state: 'Karnataka', cuisine: 'Andhra', category: 'Casual Dining', price: '₹₹', rating: 4.3, mustTry: 'Andhra Meals, Chicken Fry', desc: 'A fiery Andhra-style restaurant chain known for its spicy unlimited thalis.' },
  { id: 27, name: 'Mavalli Tiffin Room (Lalbagh)', city: 'Mysuru', state: 'Karnataka', cuisine: 'South Indian', category: 'Vegetarian', price: '₹', rating: 4.4, mustTry: 'Mysore Masala Dosa, Mysore Pak', desc: 'A Mysuru favorite for the original Mysore-style dosa and traditional sweets.' },
  { id: 28, name: 'Grand Bhandari Hotel', city: 'Mangalore', state: 'Karnataka', cuisine: 'Mangalorean', category: 'Casual Dining', price: '₹₹', rating: 4.2, mustTry: 'Neer Dosa, Kori Rotti', desc: 'Coastal Mangalorean fare with fresh seafood and traditional neer dosa.' },

  // ---- Tamil Nadu (more Chennai + other cities) ----
  { id: 29, name: 'Ponnusamy Hotel', city: 'Chennai', state: 'Tamil Nadu', cuisine: 'Chettinad', category: 'Casual Dining', price: '₹₹', rating: 4.3, mustTry: 'Chicken Chettinad, Mutton Kola Urundai', desc: 'A veteran Chennai spot serving fiery, authentic Chettinad-style non-vegetarian food.' },
  { id: 30, name: 'Amaravathi Restaurant', city: 'Chennai', state: 'Tamil Nadu', cuisine: 'Chettinad', category: 'Casual Dining', price: '₹₹', rating: 4.2, mustTry: 'Pepper Chicken, Parotta', desc: 'Known citywide for its intensely spiced Chettinad pepper chicken.' },
  { id: 31, name: 'The Bangala', city: 'Karaikudi', state: 'Tamil Nadu', cuisine: 'Chettinad', category: 'Heritage Dining', price: '₹₹', rating: 4.6, mustTry: 'Chettinad Thali', desc: 'A heritage stay in the heart of Chettinad country serving an elaborate traditional thali.' },
  { id: 32, name: 'Sri Krishna Sweets', city: 'Madurai', state: 'Tamil Nadu', cuisine: 'South Indian', category: 'Sweets & Snacks', price: '₹', rating: 4.4, mustTry: 'Mysore Pak, Jangiri', desc: 'A statewide favorite for traditional South Indian sweets and savories.' },

  // ---- Kerala (more Kochi + other cities) ----
  { id: 33, name: 'Dhe Puttu', city: 'Kochi', state: 'Kerala', cuisine: 'Kerala', category: 'Casual Dining', price: '₹', rating: 4.3, mustTry: 'Puttu with 20+ curry combinations', desc: 'An entire restaurant devoted to reinventing the humble Kerala puttu.' },
  { id: 34, name: 'Kaveri Restaurant', city: 'Thiruvananthapuram', state: 'Kerala', cuisine: 'Kerala', category: 'Vegetarian', price: '₹', rating: 4.2, mustTry: 'Sadya, Avial', desc: 'A trusted local spot for traditional Kerala vegetarian sadya meals.' },
  { id: 35, name: 'Paragon Restaurant', city: 'Kozhikode', state: 'Kerala', cuisine: 'Malabar', category: 'Casual Dining', price: '₹₹', rating: 4.4, mustTry: 'Malabar Biryani, Fish Fry', desc: 'One of Kerala\'s most famous names for Malabar biryani, with branches across the state.' },

  // ---- Andhra Pradesh ----
  { id: 36, name: 'Southern Spice', city: 'Visakhapatnam', state: 'Andhra Pradesh', cuisine: 'Andhra', category: 'Casual Dining', price: '₹₹', rating: 4.3, mustTry: 'Gongura Mutton, Andhra Meals', desc: 'A Vizag favorite for tangy gongura-based Andhra specialties.' },
  { id: 37, name: 'Minerva Coffee Shop', city: 'Vijayawada', state: 'Andhra Pradesh', cuisine: 'Andhra', category: 'Casual Dining', price: '₹', rating: 4.2, mustTry: 'Andhra Thali, Pesarattu', desc: 'A long-running Vijayawada chain known for wholesome Andhra vegetarian meals.' },
  { id: 38, name: 'Sri Ramyas', city: 'Tirupati', state: 'Andhra Pradesh', cuisine: 'Andhra', category: 'Vegetarian', price: '₹', rating: 4.1, mustTry: 'Tirupati Thali, Filter Coffee', desc: 'A popular pilgrim-town restaurant serving traditional Andhra vegetarian fare.' },

  // ---- Telangana (more Hyderabad) ----
  { id: 39, name: 'Shah Ghouse', city: 'Hyderabad', state: 'Telangana', cuisine: 'Hyderabadi', category: 'Casual Dining', price: '₹', rating: 4.3, mustTry: 'Biryani, Haleem', desc: 'Famous especially in Ramzan season for its rich, slow-cooked haleem.' },
  { id: 40, name: 'Cafe Bahar', city: 'Hyderabad', state: 'Telangana', cuisine: 'Hyderabadi', category: 'Casual Dining', price: '₹', rating: 4.4, mustTry: 'Chicken Biryani', desc: 'A long-standing Hyderabad favorite known for consistently good biryani.' },

  // ---- Maharashtra (more Mumbai + Pune) ----
  { id: 41, name: 'Shree Thaker Bhojanalay', city: 'Mumbai', state: 'Maharashtra', cuisine: 'Gujarati-Rajasthani', category: 'Vegetarian', price: '₹₹', rating: 4.5, mustTry: 'Unlimited Thali', desc: 'A century-old Mumbai institution serving an unlimited traditional Gujarati-Rajasthani thali.' },
  { id: 42, name: 'Bademiya', city: 'Mumbai', state: 'Maharashtra', cuisine: 'Mughlai', category: 'Street Food', price: '₹', rating: 4.2, mustTry: 'Seekh Kebab Rolls', desc: 'A legendary late-night Colaba street stall famous for its kebab rolls.' },
  { id: 43, name: 'Vaishali', city: 'Pune', state: 'Maharashtra', cuisine: 'South Indian', category: 'Vegetarian', price: '₹', rating: 4.4, mustTry: 'Sada Dosa, Misal', desc: 'A Pune institution on FC Road, popular with generations of students.' },
  { id: 44, name: 'Durvankur Bhojnalay', city: 'Pune', state: 'Maharashtra', cuisine: 'Maharashtrian', category: 'Vegetarian', price: '₹', rating: 4.3, mustTry: 'Puran Poli Thali', desc: 'A no-frills spot serving an authentic home-style Maharashtrian thali.' },

  // ---- Gujarat ----
  { id: 45, name: 'Agashiye', city: 'Ahmedabad', state: 'Gujarat', cuisine: 'Gujarati', category: 'Fine Dining', price: '₹₹₹', rating: 4.6, mustTry: 'Traditional Gujarati Thali', desc: 'A rooftop heritage-haveli restaurant serving an elaborate, refined Gujarati thali.' },
  { id: 46, name: 'Swati Snacks', city: 'Ahmedabad', state: 'Gujarat', cuisine: 'Gujarati', category: 'Casual Dining', price: '₹', rating: 4.4, mustTry: 'Panki, Handvo, Dahi Batata Puri', desc: 'A beloved local chain known for authentic Gujarati snacks and chaats.' },
  { id: 47, name: 'Honest Restaurant', city: 'Surat', state: 'Gujarat', cuisine: 'Street Food', category: 'Street Food', price: '₹', rating: 4.3, mustTry: 'Pav Bhaji', desc: 'A Surat institution famous city-wide for its buttery, generously loaded pav bhaji.' },

  // ---- Madhya Pradesh ----
  { id: 48, name: 'Bapu Ki Kutia', city: 'Indore', state: 'Madhya Pradesh', cuisine: 'North Indian', category: 'Vegetarian', price: '₹₹', rating: 4.4, mustTry: 'Rajasthani Thali', desc: 'A well-known Indore fine-dining spot for an elaborate vegetarian thali experience.' },
  { id: 49, name: 'Sarafa Bazaar', city: 'Indore', state: 'Madhya Pradesh', cuisine: 'Street Food', category: 'Street Food', price: '₹', rating: 4.6, mustTry: 'Garadu, Bhutte ka Kees, Jalebi', desc: 'Indore\'s famous night food market, turning into a street-food carnival after 9 PM.' },
  { id: 50, name: 'Bittu Tikki Wala', city: 'Bhopal', state: 'Madhya Pradesh', cuisine: 'Street Food', category: 'Street Food', price: '₹', rating: 4.3, mustTry: 'Aloo Tikki, Poha', desc: 'A Bhopal favorite for classic Madhya Pradesh-style poha and tikki breakfasts.' },

  // ---- Uttar Pradesh ----
  { id: 51, name: 'Tunday Kababi', city: 'Lucknow', state: 'Uttar Pradesh', cuisine: 'Awadhi', category: 'Street Food', price: '₹', rating: 4.5, mustTry: 'Galouti Kebab', desc: 'A century-old Lucknow legend famous for melt-in-the-mouth galouti kebabs.' },
  { id: 52, name: 'Idris Biryani', city: 'Lucknow', state: 'Uttar Pradesh', cuisine: 'Awadhi', category: 'Casual Dining', price: '₹', rating: 4.4, mustTry: 'Mutton Biryani', desc: 'A trusted old-city spot known for fragrant, slow-cooked Lucknowi biryani.' },
  { id: 53, name: 'Brijwasi Sweets', city: 'Agra', state: 'Uttar Pradesh', cuisine: 'North Indian', category: 'Sweets & Snacks', price: '₹', rating: 4.2, mustTry: 'Petha, Aloo Tikki Chaat', desc: 'A popular Agra stop for the city\'s signature petha sweet and chaats.' },

  // ---- Bihar ----
  { id: 54, name: 'Ashiana Restaurant', city: 'Patna', state: 'Bihar', cuisine: 'Bihari', category: 'Casual Dining', price: '₹₹', rating: 4.2, mustTry: 'Litti Chokha, Sattu Paratha', desc: 'A well-regarded Patna spot serving classic, hearty Bihari home-style food.' },
  { id: 55, name: 'Litti Chokha Junction', city: 'Patna', state: 'Bihar', cuisine: 'Bihari', category: 'Street Food', price: '₹', rating: 4.1, mustTry: 'Litti Chokha', desc: 'A no-frills local favorite for the smoky, traditional Bihari staple.' },

  // ---- Jharkhand ----
  { id: 56, name: 'Kaveri Restaurant', city: 'Ranchi', state: 'Jharkhand', cuisine: 'Multi-cuisine', category: 'Casual Dining', price: '₹₹', rating: 4.1, mustTry: 'Handia Chicken, Thali', desc: 'A popular Ranchi restaurant known for local tribal-inspired specialties.' },
  { id: 57, name: 'Rooh Afza Sweets', city: 'Jamshedpur', state: 'Jharkhand', cuisine: 'Sweets & Snacks', category: 'Sweets & Snacks', price: '₹', rating: 4.0, mustTry: 'Litti, Local Sweets', desc: 'A neighbourhood favorite for snacks and traditional sweets in Jamshedpur.' },

  // ---- Chhattisgarh ----
  { id: 58, name: 'Kaka Halwai', city: 'Raipur', state: 'Chhattisgarh', cuisine: 'Chhattisgarhi', category: 'Sweets & Snacks', price: '₹', rating: 4.1, mustTry: 'Chila, Faraa, Local Sweets', desc: 'A long-standing Raipur spot for traditional Chhattisgarhi snacks and sweets.' },
  { id: 59, name: 'Time 2 Eat', city: 'Bilaspur', state: 'Chhattisgarh', cuisine: 'Multi-cuisine', category: 'Casual Dining', price: '₹₹', rating: 4.0, mustTry: 'Chhattisgarhi Thali', desc: 'A popular family restaurant serving regional Chhattisgarhi thalis.' },

  // ---- Odisha ----
  { id: 60, name: 'Dalma Restaurant', city: 'Bhubaneswar', state: 'Odisha', cuisine: 'Odia', category: 'Casual Dining', price: '₹₹', rating: 4.3, mustTry: 'Dalma, Chhena Poda', desc: 'A well-loved Bhubaneswar spot serving traditional Odia thalis and desserts.' },
  { id: 61, name: 'Hare Krishna Restaurant', city: 'Puri', state: 'Odisha', cuisine: 'Odia', category: 'Vegetarian', price: '₹', rating: 4.2, mustTry: 'Puri Thali, Khaja', desc: 'A trusted pilgrim-town restaurant near the Jagannath Temple serving pure vegetarian Odia food.' },

  // ---- Arunachal Pradesh ----
  { id: 62, name: 'Dragon Lodge Restaurant', city: 'Tawang', state: 'Arunachal Pradesh', cuisine: 'Tibetan', category: 'Casual Dining', price: '₹', rating: 4.2, mustTry: 'Thukpa, Momos', desc: 'A cozy Tawang eatery serving warming Tibetan-style food in the high Himalayas.' },

  // ---- Manipur ----
  { id: 63, name: 'Luxmi Kitchen', city: 'Imphal', state: 'Manipur', cuisine: 'Manipuri', category: 'Casual Dining', price: '₹', rating: 4.1, mustTry: 'Eromba, Chak-hao Kheer', desc: 'A local favorite in Imphal for authentic Manipuri thalis.' },

  // ---- Meghalaya ----
  { id: 64, name: 'Trattoria', city: 'Shillong', state: 'Meghalaya', cuisine: 'Khasi', category: 'Casual Dining', price: '₹₹', rating: 4.2, mustTry: 'Jadoh, Pork with Bamboo Shoot', desc: 'A popular Shillong restaurant serving authentic Khasi tribal cuisine.' },

  // ---- Mizoram ----
  { id: 65, name: 'Chef\'s Kitchen', city: 'Aizawl', state: 'Mizoram', cuisine: 'Mizo', category: 'Casual Dining', price: '₹', rating: 4.0, mustTry: 'Bai, Sawhchiar', desc: 'A well-known Aizawl spot for traditional Mizo home-style cooking.' },

  // ---- Nagaland ----
  { id: 66, name: 'Naga Kitchen', city: 'Kohima', state: 'Nagaland', cuisine: 'Naga', category: 'Casual Dining', price: '₹', rating: 4.1, mustTry: 'Smoked Pork with Bamboo Shoot', desc: 'A local favorite in Kohima serving bold, smoky Naga specialties.' },

  // ---- Sikkim ----
  { id: 67, name: 'Nimtho', city: 'Gangtok', state: 'Sikkim', cuisine: 'Sikkimese', category: 'Casual Dining', price: '₹₹', rating: 4.4, mustTry: 'Gundruk Soup, Sinki', desc: 'A Gangtok favorite reviving traditional Sikkimese recipes for modern diners.' },

  // ---- Tripura ----
  { id: 68, name: 'Abhishek Restaurant', city: 'Agartala', state: 'Tripura', cuisine: 'Multi-cuisine', category: 'Casual Dining', price: '₹', rating: 4.0, mustTry: 'Mui Borok Thali', desc: 'A popular Agartala spot serving both local Tripuri dishes and North Indian staples.' },

  // ---- Jammu & Kashmir ----
  { id: 69, name: 'Ahdoos', city: 'Srinagar', state: 'Jammu and Kashmir', cuisine: 'Kashmiri', category: 'Casual Dining', price: '₹₹', rating: 4.4, mustTry: 'Rogan Josh, Wazwan', desc: 'A historic Srinagar institution known for authentic Kashmiri Wazwan cuisine.' },
  { id: 70, name: 'Mughal Darbar', city: 'Jammu', state: 'Jammu and Kashmir', cuisine: 'Kashmiri-Mughlai', category: 'Casual Dining', price: '₹₹', rating: 4.2, mustTry: 'Rajma Chawal, Kebabs', desc: 'A long-running Jammu favorite blending Kashmiri and Mughlai flavors.' },

  // ---- Ladakh ----
  { id: 71, name: 'Gesmo Restaurant', city: 'Leh', state: 'Ladakh', cuisine: 'Tibetan-Ladakhi', category: 'Casual Dining', price: '₹', rating: 4.3, mustTry: 'Thukpa, Butter Tea', desc: 'A well-known Leh cafe serving hearty Ladakhi and Tibetan staples for high-altitude travelers.' },

  // ---- Puducherry ----
  { id: 72, name: 'Le Café', city: 'Puducherry', state: 'Puducherry', cuisine: 'French-Continental', category: 'Cafe', price: '₹₹', rating: 4.2, mustTry: 'Croissants, French Coffee', desc: 'A seafront cafe in the French Quarter, popular for its colonial-era ambience.' },

  // ---- Chandigarh ----
  { id: 73, name: 'Pal Dhaba', city: 'Chandigarh', state: 'Chandigarh', cuisine: 'Punjabi', category: 'Street Food', price: '₹', rating: 4.3, mustTry: 'Butter Chicken, Paratha', desc: 'A veteran Chandigarh dhaba loved for its rustic, no-frills Punjabi food.' },
];

export const CUISINES = ['All', ...Array.from(new Set(RESTAURANTS.map(r => r.cuisine))).sort()];
export const CATEGORIES = ['All', ...Array.from(new Set(RESTAURANTS.map(r => r.category))).sort()];
export const STATES = ['All States', ...Array.from(new Set(RESTAURANTS.map(r => r.state))).sort()];

export default RESTAURANTS;