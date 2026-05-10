// Shared itinerary generation logic used by the API routes
export function generateItineraryActivities(destination: string, tripId: string, days: number = 3) {
  const dest = destination.toLowerCase();

  const themes: Record<string, any[][]> = {
    tokyo: [
      [
        { type: "transport", title: "Arrive at Narita / Haneda Airport", time: "09:00 AM" },
        { type: "stay", title: "Check-in at Shinjuku Hotel", time: "12:00 PM" },
        { type: "food", title: "Lunch at Ichiran Ramen, Shinjuku", time: "01:30 PM" },
        { type: "sightseeing", title: "Explore Shibuya Crossing & Scramble", time: "03:30 PM" },
        { type: "food", title: "Dinner at Izakaya in Golden Gai", time: "08:00 PM" },
      ],
      [
        { type: "sightseeing", title: "Visit Senso-ji Temple, Asakusa", time: "08:30 AM" },
        { type: "food", title: "Breakfast at Tsukiji Outer Market", time: "10:00 AM" },
        { type: "sightseeing", title: "Akihabara Electric Town & Anime Shops", time: "12:30 PM" },
        { type: "food", title: "Sushi Lunch at Kura Sushi", time: "02:00 PM" },
        { type: "sightseeing", title: "TeamLab Borderless Digital Art Museum", time: "04:00 PM" },
        { type: "food", title: "Omakase Sushi Dinner, Ginza", time: "08:30 PM" },
      ],
      [
        { type: "sightseeing", title: "Harajuku & Takeshita Street Shopping", time: "09:00 AM" },
        { type: "food", title: "Brunch at Omotesando Café", time: "11:00 AM" },
        { type: "sightseeing", title: "Shinjuku Gyoen National Garden", time: "01:00 PM" },
        { type: "sightseeing", title: "Tokyo Tower Observation Deck", time: "04:00 PM" },
        { type: "transport", title: "Depart from Tokyo", time: "08:00 PM" },
      ],
    ],
    paris: [
      [
        { type: "transport", title: "Arrive at Charles de Gaulle Airport", time: "10:00 AM" },
        { type: "stay", title: "Check-in near Le Marais District", time: "01:00 PM" },
        { type: "food", title: "Croissant & Coffee at Café de Flore", time: "02:30 PM" },
        { type: "sightseeing", title: "Stroll along the Seine River", time: "04:00 PM" },
        { type: "sightseeing", title: "Eiffel Tower Light Show at Night", time: "09:00 PM" },
      ],
      [
        { type: "sightseeing", title: "Louvre Museum Morning Tour", time: "09:00 AM" },
        { type: "food", title: "Lunch at Café Marly near the Louvre", time: "01:00 PM" },
        { type: "sightseeing", title: "Notre-Dame Cathedral & Île de la Cité", time: "03:00 PM" },
        { type: "sightseeing", title: "Montmartre & Sacré-Cœur Basilica", time: "05:30 PM" },
        { type: "food", title: "Classic French Bistro Dinner", time: "08:30 PM" },
      ],
      [
        { type: "food", title: "Breakfast Pastries at Local Boulangerie", time: "08:30 AM" },
        { type: "sightseeing", title: "Versailles Palace Day Trip", time: "10:00 AM" },
        { type: "food", title: "Picnic in the Versailles Gardens", time: "01:00 PM" },
        { type: "sightseeing", title: "Champs-Élysées & Arc de Triomphe", time: "04:00 PM" },
        { type: "transport", title: "Depart from Paris", time: "08:00 PM" },
      ],
    ],
    bali: [
      [
        { type: "transport", title: "Arrive at Ngurah Rai International Airport", time: "11:00 AM" },
        { type: "stay", title: "Check-in at Ubud Jungle Villa", time: "02:00 PM" },
        { type: "food", title: "Organic Lunch at Locavore, Ubud", time: "03:00 PM" },
        { type: "sightseeing", title: "Sacred Monkey Forest Sanctuary", time: "05:00 PM" },
        { type: "food", title: "Sunset Dinner at Swept Away Restaurant", time: "07:30 PM" },
      ],
      [
        { type: "sightseeing", title: "Tegalalang Rice Terrace Sunrise Trek", time: "06:00 AM" },
        { type: "food", title: "Balinese Breakfast at Local Warung", time: "09:00 AM" },
        { type: "sightseeing", title: "Tirta Empul Holy Water Temple", time: "10:30 AM" },
        { type: "sightseeing", title: "Besakih Mother Temple", time: "01:00 PM" },
        { type: "food", title: "BBQ Seafood at Jimbaran Bay", time: "07:00 PM" },
      ],
      [
        { type: "sightseeing", title: "Tanah Lot Sea Temple at Sunrise", time: "07:00 AM" },
        { type: "food", title: "Smoothie Bowl Brunch at Seminyak", time: "10:00 AM" },
        { type: "sightseeing", title: "Uluwatu Temple & Kecak Dance Show", time: "01:00 PM" },
        { type: "food", title: "Cocktails & Sunset at Single Fin Bar", time: "05:30 PM" },
        { type: "transport", title: "Depart from Bali", time: "09:00 PM" },
      ],
    ],
    london: [
      [
        { type: "transport", title: "Arrive at Heathrow Airport", time: "10:00 AM" },
        { type: "stay", title: "Check-in at Covent Garden Hotel", time: "01:00 PM" },
        { type: "food", title: "Fish & Chips at Rock & Sole Plaice", time: "02:30 PM" },
        { type: "sightseeing", title: "Big Ben & Westminster Bridge", time: "04:00 PM" },
        { type: "sightseeing", title: "South Bank & London Eye at Night", time: "07:00 PM" },
      ],
      [
        { type: "sightseeing", title: "Tower of London & Crown Jewels", time: "09:00 AM" },
        { type: "food", title: "Lunch at Borough Market", time: "12:30 PM" },
        { type: "sightseeing", title: "British Museum Free Tour", time: "02:30 PM" },
        { type: "sightseeing", title: "Notting Hill & Portobello Road", time: "05:00 PM" },
        { type: "food", title: "Dinner at a Michelin-Star Pub", time: "08:00 PM" },
      ],
      [
        { type: "sightseeing", title: "Buckingham Palace & Changing of Guard", time: "10:00 AM" },
        { type: "food", title: "Afternoon Tea at The Ritz", time: "03:00 PM" },
        { type: "sightseeing", title: "Oxford Street & Covent Garden Shopping", time: "05:00 PM" },
        { type: "transport", title: "Depart from London", time: "09:00 PM" },
      ],
    ],
    dubai: [
      [
        { type: "transport", title: "Arrive at Dubai International Airport", time: "08:00 AM" },
        { type: "stay", title: "Check-in at Downtown Dubai Hotel", time: "12:00 PM" },
        { type: "food", title: "Lunch at Zuma Restaurant, DIFC", time: "01:30 PM" },
        { type: "sightseeing", title: "Burj Khalifa At the Top Observation Deck", time: "04:00 PM" },
        { type: "sightseeing", title: "Dubai Fountain Show at Night", time: "08:00 PM" },
      ],
      [
        { type: "sightseeing", title: "Dubai Desert Safari at Dawn", time: "05:30 AM" },
        { type: "food", title: "Camel Ride & Bedouin Breakfast", time: "08:30 AM" },
        { type: "sightseeing", title: "Dubai Creek & Al Fahidi Historic District", time: "11:00 AM" },
        { type: "food", title: "Lunch at Arabian Tea House Café", time: "01:00 PM" },
        { type: "sightseeing", title: "Dubai Mall & VR Park", time: "03:00 PM" },
        { type: "food", title: "Dinner at Pierchic Overwater Restaurant", time: "08:00 PM" },
      ],
      [
        { type: "sightseeing", title: "Palm Jumeirah & Atlantis Hotel", time: "09:00 AM" },
        { type: "food", title: "Brunch at Bubbalicious, Westin", time: "12:00 PM" },
        { type: "sightseeing", title: "Jumeirah Beach & Dubai Marina Walk", time: "03:00 PM" },
        { type: "transport", title: "Depart from Dubai", time: "10:00 PM" },
      ],
    ],
  };

  // Generic fallback
  const generic: any[][] = Array.from({ length: Math.max(days, 1) }, (_, d) => [
    { type: d === 0 ? "transport" : "sightseeing", title: d === 0 ? `Arrive in ${destination}` : `Morning Exploration of ${destination}`, time: "09:00 AM" },
    { type: d === 0 ? "stay" : "food", title: d === 0 ? "Check-in to Hotel" : "Breakfast at Local Café", time: "11:00 AM" },
    { type: "food", title: `Lunch at a Popular ${destination} Restaurant`, time: "01:00 PM" },
    { type: "sightseeing", title: `Explore ${destination} City Center & Markets`, time: "03:00 PM" },
    { type: "sightseeing", title: `Visit Top-Rated Landmark in ${destination}`, time: "05:30 PM" },
    { type: "food", title: `Dinner & Local Cuisine Experience in ${destination}`, time: "08:00 PM" },
  ]);

  // Pick template
  let source: any[][] | null = null;
  for (const [key, val] of Object.entries(themes)) {
    if (dest.includes(key)) { source = val; break; }
  }
  if (!source) source = generic;

  const result: any[] = [];
  for (let d = 0; d < Math.min(days, source.length); d++) {
    source[d].forEach((act: any, idx: number) => {
      result.push({
        trip_id: tripId,
        day: `Day ${d + 1}`,
        type: act.type,
        title: act.title,
        time: act.time,
        order_index: d * 10 + idx,
      });
    });
  }
  return result;
}
