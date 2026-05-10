import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: allTrips, error } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map from Supabase snake_case to frontend camelCase
    const formattedTrips = (allTrips || []).map(trip => ({
      id: trip.id,
      ownerId: trip.user_id,
      title: trip.title,
      destination: trip.destination,
      startDate: trip.start_date,
      endDate: trip.end_date,
      budgetTotal: trip.budget,
      image: trip.cover_image_url,
      status: trip.status,
      createdAt: trip.created_at,
      // mock calculated fields since they aren't in DB:
      progress: Math.floor(Math.random() * 20) + 10,
      daysLeft: Math.floor(Math.random() * 60) + 5,
    }));

    return NextResponse.json({ success: true, data: formattedTrips });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const days = body.days || 3;
    
    let img = "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=800";
    const destL = (body.destination || "").toLowerCase();
    if (destL.includes("tokyo")) img = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800";
    if (destL.includes("paris")) img = "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=800";
    if (destL.includes("bali")) img = "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800";
    if (destL.includes("new york") || destL.includes("nyc")) img = "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800";
    if (destL.includes("london")) img = "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800";
    if (destL.includes("dubai")) img = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800";

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    const newTrip = {
      title: body.title || (body.destination ? `Trip to ${body.destination}` : "New Unknown Trip"),
      destination: body.destination || "Unknown Destination",
      start_date: body.startDate || new Date().toISOString(),
      end_date: body.endDate || endDate.toISOString(),
      budget: body.budget || 2000,
      cover_image_url: img,
      status: 'planning'
    };

    const { data: insertedTrip, error } = await supabase
      .from('trips')
      .insert([newTrip])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw new Error(error.message);
    }

    // Auto-generate itinerary activities
    const { generateItineraryActivities } = await import("@/lib/itinerary");
    const activities = generateItineraryActivities(body.destination || "", insertedTrip.id, days);
    if (activities.length > 0) {
      const { error: actErr } = await supabase.from('activities').insert(activities);
      if (actErr) console.error("Activities insert error:", actErr.message);
    }

    return NextResponse.json({ success: true, data: { ...insertedTrip, id: insertedTrip.id } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

