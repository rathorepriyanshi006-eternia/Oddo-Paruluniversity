import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trips, activities } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const allTrips = await db.select().from(trips).orderBy(desc(trips.createdAt));
    return NextResponse.json({ success: true, data: allTrips });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Simple dynamic mock AI generation
function generateMockItinerary(destination: string, tripId: string) {
  const destLower = destination.toLowerCase();
  
  // Basic template
  let generatedActivities = [
    { type: "transport", title: `Arrive in ${destination}`, time: "10:00 AM" },
    { type: "stay", title: "Check-in to Hotel", time: "01:00 PM" },
    { type: "food", title: "Lunch at Local Cafe", time: "02:00 PM" },
    { type: "sightseeing", title: `Explore Downtown ${destination}`, time: "03:30 PM" },
    { type: "food", title: "Dinner & Drinks", time: "07:30 PM" }
  ];

  // Themed variations
  if (destLower.includes("tokyo") || destLower.includes("japan")) {
    generatedActivities = [
      { type: "transport", title: "Arrive at Haneda Airport", time: "09:00 AM" },
      { type: "stay", title: "Check-in at Shinjuku Ryokan", time: "12:00 PM" },
      { type: "food", title: "Lunch at Ichiran Ramen", time: "01:30 PM" },
      { type: "sightseeing", title: "Explore Akihabara Electric Town", time: "03:00 PM" },
      { type: "sightseeing", title: "Visit Senso-ji Temple", time: "05:00 PM" },
      { type: "food", title: "Omakase Sushi Dinner", time: "08:00 PM" }
    ];
  } else if (destLower.includes("paris") || destLower.includes("france")) {
    generatedActivities = [
      { type: "transport", title: "Arrive at Charles de Gaulle", time: "10:00 AM" },
      { type: "stay", title: "Check-in near Le Marais", time: "12:30 PM" },
      { type: "food", title: "Croissant & Coffee near Notre Dame", time: "02:00 PM" },
      { type: "sightseeing", title: "Louvre Museum Tour", time: "03:30 PM" },
      { type: "sightseeing", title: "Eiffel Tower at Sunset", time: "07:00 PM" },
      { type: "food", title: "Classic French Bistro Dinner", time: "08:30 PM" }
    ];
  } else if (destLower.includes("bali") || destLower.includes("indonesia")) {
    generatedActivities = [
      { type: "transport", title: "Arrive at Ngurah Rai Airport", time: "11:00 AM" },
      { type: "stay", title: "Check-in to Ubud Villa", time: "02:00 PM" },
      { type: "food", title: "Organic Lunch at Clear Cafe", time: "03:00 PM" },
      { type: "sightseeing", title: "Sacred Monkey Forest Sanctuary", time: "04:30 PM" },
      { type: "sightseeing", title: "Sunset at Tegalalang Rice Terrace", time: "06:00 PM" },
      { type: "food", title: "Dinner at Locavore", time: "08:00 PM" }
    ];
  }

  return generatedActivities.map((act, idx) => ({
    id: `act_${Date.now()}_${idx}`,
    tripId: tripId,
    day: "Day 1",
    type: act.type,
    title: act.title,
    time: act.time,
    orderIndex: idx
  }));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const tripId = `trip_${Date.now()}`;
    
    // Attempt to match an image based on destination
    let img = "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=800";
    const destL = (body.destination || "").toLowerCase();
    if (destL.includes("tokyo")) img = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800";
    if (destL.includes("paris")) img = "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=800";
    if (destL.includes("bali")) img = "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800";

    const newTrip = {
      id: tripId,
      ownerId: "user_1",
      title: body.destination ? `Trip to ${body.destination}` : "New Unknown Trip",
      destination: body.destination || "Unknown Destination",
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
      budgetTotal: body.budget || 2000,
      currency: "USD",
      createdAt: new Date(),
      progress: Math.floor(Math.random() * 20) + 10,
      daysLeft: Math.floor(Math.random() * 60) + 5,
      collaborators: 1,
      image: img
    };

    // Insert Trip
    await db.insert(trips).values(newTrip);

    // Generate and Insert Activities
    const generatedActs = generateMockItinerary(body.destination || "", tripId);
    if (generatedActs.length > 0) {
      await db.insert(activities).values(generatedActs);
    }

    return NextResponse.json({ success: true, data: newTrip });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
