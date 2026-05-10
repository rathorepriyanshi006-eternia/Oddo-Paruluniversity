import { NextResponse } from "next/server";
import { db, initDb } from "@/lib/db";
import { users, trips, activities } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    initDb();

    // Check if user exists
    const existingUsers = await db.select().from(users);
    if (existingUsers.length === 0) {
      await db.insert(users).values({
        id: "user_1",
        email: "marcus@example.com",
        name: "Marcus Chen",
        avatarUrl: "https://i.pravatar.cc/150?img=11",
        createdAt: new Date()
      });

      // Insert mock trips
      await db.insert(trips).values([
        {
          id: "trip_1",
          ownerId: "user_1",
          title: "Kyoto Autumn Escape",
          destination: "Kyoto, Japan",
          startDate: new Date("2026-10-12"),
          endDate: new Date("2026-10-19"),
          budgetTotal: 2500,
          currency: "USD",
          createdAt: new Date(),
          progress: 80,
          daysLeft: 14,
          collaborators: 3,
          image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800"
        },
        {
          id: "trip_2",
          ownerId: "user_1",
          title: "Swiss Alps Ski Trip",
          destination: "Zermatt, Switzerland",
          startDate: new Date("2026-12-20"),
          endDate: new Date("2026-12-27"),
          budgetTotal: 4000,
          currency: "USD",
          createdAt: new Date(),
          progress: 35,
          daysLeft: 84,
          collaborators: 5,
          image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=800"
        }
      ]);

      // Insert activities for trip_1
      await db.insert(activities).values([
        { id: "act_1", tripId: "trip_1", day: "day-1", type: "transport", title: "Arrive at Narita Airport", time: "10:00 AM", orderIndex: 0 },
        { id: "act_2", tripId: "trip_1", day: "day-1", type: "stay", title: "Check-in at Shinjuku Hotel", time: "12:30 PM", orderIndex: 1 },
        { id: "act_3", tripId: "trip_1", day: "day-1", type: "food", title: "Lunch at Ichiran Ramen", time: "02:00 PM", orderIndex: 2 },
        { id: "act_4", tripId: "trip_1", day: "day-1", type: "sightseeing", title: "Explore Shinjuku Gyoen", time: "04:00 PM", orderIndex: 3 }
      ]);
    }

    return NextResponse.json({ success: true, message: "Database setup completed" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
