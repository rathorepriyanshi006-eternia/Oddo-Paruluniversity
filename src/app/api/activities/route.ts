import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activities } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: Request) {
  try {
    const { items } = await request.json();
    
    // items is an array of { id: string, orderIndex: number }
    for (const item of items) {
      await db.update(activities)
        .set({ orderIndex: item.orderIndex })
        .where(eq(activities.id, item.id));
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
      id: `act_${Date.now()}`,
      tripId: body.tripId,
      day: body.day || "Day 1",
      type: body.type || "custom",
      title: body.title,
      time: body.time || "TBD",
      orderIndex: body.orderIndex || 999
    };

    await db.insert(activities).values(newActivity);

    return NextResponse.json({ success: true, data: newActivity });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
