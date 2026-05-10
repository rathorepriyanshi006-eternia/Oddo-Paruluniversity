import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trips, activities } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const tripId = params.id;
    
    const tripData = await db.select().from(trips).where(eq(trips.id, tripId)).limit(1);
    
    if (tripData.length === 0) {
      return NextResponse.json({ success: false, error: "Trip not found" }, { status: 404 });
    }

    const tripActivities = await db.select().from(activities)
      .where(eq(activities.tripId, tripId))
      .orderBy(asc(activities.orderIndex));

    return NextResponse.json({ 
      success: true, 
      data: {
        ...tripData[0],
        activities: tripActivities
      } 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
