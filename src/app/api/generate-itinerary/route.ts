import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Smart template-based itinerary generator
function generateItinerary(destination: string, tripId: string, days: number = 3) {
  const dest = destination.toLowerCase();
  const allActivities: any[] = [];

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
        { type: "food", title: "Breakfast at Tsukiji Market", time: "10:00 AM" },
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
        { type: "sightseeing", title: "Eiffel Tower Light Show", time: "09:00 PM" },
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
        { type: "sightseeing", title: "Tanah Lot Sea Temple", time: "07:00 AM" },
        { type: "food", title: "Smoothie Bowl Brunch at Seminyak", time: "10:00 AM" },
        { type: "sightseeing", title: "Uluwatu Temple & Kecak Dance Show", time: "01:00 PM" },
        { type: "food", title: "Cocktails & Sunset at Single Fin Bar", time: "05:30 PM" },
        { type: "transport", title: "Depart from Bali", time: "09:00 PM" },
      ],
    ],
  };

  // Match destination to theme
  let template: any[][] | null = null;
  for (const [key, val] of Object.entries(themes)) {
    if (dest.includes(key)) {
      template = val;
      break;
    }
  }

  // Fallback generic template
  const generic: any[][] = Array.from({ length: Math.max(days, 3) }, (_, d) => [
    { type: "transport", title: d === 0 ? `Arrive in ${destination}` : `Morning in ${destination}`, time: "09:00 AM" },
    { type: "stay", title: d === 0 ? "Check-in to Hotel" : "Hotel Breakfast", time: "11:00 AM" },
    { type: "food", title: "Lunch at a Local Restaurant", time: "01:00 PM" },
    { type: "sightseeing", title: `Explore ${destination} City Center`, time: "03:00 PM" },
    { type: "sightseeing", title: `Visit Popular Landmarks in ${destination}`, time: "05:00 PM" },
    { type: "food", title: "Dinner & Local Cuisine Experience", time: "08:00 PM" },
  ]);

  const source = template || generic;

  for (let d = 0; d < Math.min(days, source.length); d++) {
    const dayActivities = source[d];
    dayActivities.forEach((act: any, idx: number) => {
      allActivities.push({
        trip_id: tripId,
        day: `Day ${d + 1}`,
        type: act.type,
        title: act.title,
        time: act.time,
        order_index: d * 10 + idx,
      });
    });
  }

  return allActivities;
}

export async function POST(request: Request) {
  try {
    const { tripId, destination, days } = await request.json();

    if (!tripId || !destination) {
      return NextResponse.json({ success: false, error: "tripId and destination are required" }, { status: 400 });
    }

    const activities = generateItinerary(destination, tripId, days || 3);

    const { data, error } = await supabase
      .from("activities")
      .insert(activities)
      .select();

    if (error) {
      console.error("Supabase activities insert error:", error);
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
