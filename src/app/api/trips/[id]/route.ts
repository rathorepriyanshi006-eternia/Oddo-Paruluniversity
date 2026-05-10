import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const tripId = params.id;

    const { data: tripData, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    if (error || !tripData) {
      return NextResponse.json({ success: false, error: "Trip not found" }, { status: 404 });
    }

    // Fetch activities for this trip
    const { data: activitiesData } = await supabase
      .from('activities')
      .select('*')
      .eq('trip_id', tripId)
      .order('order_index', { ascending: true });

    // Map activities to camelCase
    const activities = (activitiesData || []).map((a: any) => ({
      id: a.id,
      tripId: a.trip_id,
      day: a.day,
      type: a.type,
      title: a.title,
      time: a.time,
      orderIndex: a.order_index,
    }));

    const trip = {
      id: tripData.id,
      ownerId: tripData.user_id,
      title: tripData.title,
      destination: tripData.destination,
      startDate: tripData.start_date,
      endDate: tripData.end_date,
      budgetTotal: tripData.budget,
      image: tripData.cover_image_url,
      status: tripData.status,
      createdAt: tripData.created_at,
      activities,
    };

    return NextResponse.json({ success: true, data: trip });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

