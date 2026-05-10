import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(request: Request) {
  try {
    const { items } = await request.json();
    
    for (const item of items) {
      const { error } = await supabase
        .from("activities")
        .update({ order_index: item.orderIndex })
        .eq("id", item.id);
      if (error) throw error;
    }

    return NextResponse.json({ success: true, message: "Activities reordered" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newActivity = {
      trip_id: body.tripId,
      day: body.day || "Day 1",
      type: body.type || "sightseeing",
      title: body.title,
      time: body.time || "TBD",
      order_index: body.orderIndex ?? 999,
    };

    const { data, error } = await supabase
      .from("activities")
      .insert([newActivity])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert activity error:", error);
      throw new Error(error.message);
    }

    // Map back to camelCase for frontend
    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        tripId: data.trip_id,
        day: data.day,
        type: data.type,
        title: data.title,
        time: data.time,
        orderIndex: data.order_index,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
