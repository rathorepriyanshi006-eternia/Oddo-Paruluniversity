"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  MapPin, GripVertical, Camera, Utensils, BedDouble, PlaneTakeoff,
  Loader2, Plus, Calendar as CalendarIcon, Map, Wallet, Users, Clock,
  ChevronDown, ChevronRight, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  transport: { icon: PlaneTakeoff, color: "text-blue-400",   bg: "bg-blue-400/10 border-blue-400/20",  label: "Transport"     },
  food:      { icon: Utensils,     color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20", label: "Food & Dining" },
  stay:      { icon: BedDouble,    color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20", label: "Stay"         },
  sightseeing:{ icon: Camera,      color: "text-cyan-400",   bg: "bg-cyan-400/10 border-cyan-400/20",   label: "Sightseeing"  },
  custom:    { icon: MapPin,       color: "text-zinc-400",   bg: "bg-zinc-400/10 border-zinc-400/20",   label: "Custom"       },
};

function ActivityItem({ activity, onDelete }: { activity: any; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: activity.id });
  const cfg = TYPE_CONFIG[activity.type] || TYPE_CONFIG.custom;
  const Icon = cfg.icon;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1, zIndex: isDragging ? 50 : 1 }}
      className="relative flex items-start gap-3 group pb-5"
    >
      {/* Timeline line */}
      <div className="absolute left-[19px] top-8 bottom-0 w-px bg-zinc-800 z-0" />

      {/* Icon node */}
      <div className={`relative z-10 w-10 h-10 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg}`}>
        <Icon className={`w-4 h-4 ${cfg.color}`} />
      </div>

      {/* Card */}
      <div className="flex-1 bg-zinc-900/40 border border-white/5 hover:border-white/10 hover:bg-zinc-900/70 transition-all rounded-xl p-3 group/card">
        <div className="flex items-start gap-2">
          {/* Drag handle */}
          <div {...attributes} {...listeners} className="cursor-grab text-zinc-600 hover:text-zinc-400 mt-0.5 shrink-0">
            <GripVertical className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white tracking-tight leading-snug mb-1">{activity.title}</h4>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                <Clock className="w-3 h-3" /> {activity.time || "TBD"}
              </span>
              <span className={`text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-md border ${cfg.bg} ${cfg.color}`}>
                {cfg.label}
              </span>
            </div>
          </div>
          {/* Delete */}
          <button
            onClick={() => onDelete(activity.id)}
            className="opacity-0 group-hover/card:opacity-100 text-zinc-600 hover:text-red-400 transition-all shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  const params = useParams();
  const [trip, setTrip] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  // Add Activity form state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addDay, setAddDay] = useState("Day 1");
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newType, setNewType] = useState("sightseeing");
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => { fetchTrip(); }, [params.id]);

  async function fetchTrip() {
    try {
      const res = await fetch(`/api/trips/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setTrip(data.data);
        const acts = data.data.activities || [];
        setActivities(acts);
        // Expand all days by default
        const days = [...new Set(acts.map((a: any) => a.day))] as string[];
        setExpandedDays(new Set(days));
        if (days.length > 0) setActiveDay(days[0]);
      } else {
        toast.error("Failed to load trip");
      }
    } catch (e) {
      toast.error("Error loading trip data");
    } finally {
      setLoading(false);
    }
  }

  // Group activities by day
  const days = [...new Set(activities.map((a) => a.day))].sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ""));
    const numB = parseInt(b.replace(/\D/g, ""));
    return numA - numB;
  });

  const activitiesByDay = days.reduce<Record<string, any[]>>((acc, day) => {
    acc[day] = activities.filter((a) => a.day === day);
    return acc;
  }, {});

  const toggleDay = (day: string) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setActivities((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newArray = arrayMove(items, oldIndex, newIndex);
      const updates = newArray.map((item, index) => ({ id: item.id, orderIndex: index }));
      fetch("/api/activities", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updates }),
      }).then(() => toast.success("Timeline updated"));
      return newArray;
    });
  }

  async function handleAddActivity() {
    if (!newTitle.trim()) { toast.error("Title is required"); return; }
    setSaving(true);

    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: params.id,
          day: addDay,
          title: newTitle.trim(),
          time: newTime || "TBD",
          type: newType,
          orderIndex: activities.length,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActivities([...activities, data.data]);
        setExpandedDays((prev) => new Set([...prev, addDay]));
        setIsAddOpen(false);
        setNewTitle("");
        setNewTime("");
        setNewType("sightseeing");
        toast.success("Activity added to timeline");
      } else {
        toast.error(`Failed to add: ${data.error}`);
      }
    } catch (e) {
      toast.error("Failed to save activity");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteActivity(id: string) {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    toast.success("Activity removed");
    // Optional: delete from DB (add DELETE endpoint later)
  }

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-zinc-950">
        <Loader2 className="w-5 h-5 text-zinc-500 animate-spin mb-4" />
        <p className="text-sm text-zinc-500 font-medium tracking-tight">Loading workspace...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center text-zinc-500 text-sm">
        Workspace not found
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-zinc-950">
      {/* Left — Timeline Panel */}
      <div className="w-full lg:w-[420px] flex flex-col border-r border-white/5 bg-zinc-950 shrink-0 min-h-0">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight truncate max-w-[220px]">{trip.title}</h2>
              <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3 h-3" /> {trip.destination}
                {trip.startDate && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-zinc-700 mx-0.5" />
                    <CalendarIcon className="w-3 h-3" />
                    {new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </>
                )}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsAddOpen(true)}
              className="bg-white text-black hover:bg-zinc-200 h-8 px-3 text-xs rounded-lg font-medium shrink-0"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add
            </Button>
          </div>

          {/* Trip meta */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {trip.budgetTotal && (
              <span className="flex items-center gap-1 text-[11px] text-zinc-500 bg-zinc-900 px-2 py-1 rounded-md border border-white/5">
                <Wallet className="w-3 h-3" /> ${Number(trip.budgetTotal).toLocaleString()} budget
              </span>
            )}
            <span className="flex items-center gap-1 text-[11px] text-zinc-500 bg-zinc-900 px-2 py-1 rounded-md border border-white/5">
              <CalendarIcon className="w-3 h-3" /> {days.length} day{days.length !== 1 ? "s" : ""}
            </span>
            <Badge variant="outline" className="text-[10px] border-white/10 text-zinc-400 bg-transparent font-normal h-6 capitalize">
              {trip.status}
            </Badge>
          </div>
        </div>

        {/* Timeline — native scroll with custom scrollbar */}
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700 hover:scrollbar-thumb-zinc-500">
          <div className="px-4 py-4 pb-28">
            {days.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <CalendarIcon className="w-8 h-8 text-zinc-700 mb-3" />
                <p className="text-sm text-zinc-500 mb-4">No timeline yet.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 text-white hover:bg-white/5"
                  onClick={() => setIsAddOpen(true)}
                >
                  Add your first activity
                </Button>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="space-y-2">
                  {days.map((day) => {
                    const dayActivities = activitiesByDay[day];
                    const isExpanded = expandedDays.has(day);

                    return (
                      <div key={day} className="rounded-2xl border border-white/5 bg-zinc-900/20 overflow-hidden">
                        {/* Day header */}
                        <button
                          onClick={() => toggleDay(day)}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/3 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">{day}</span>
                            <span className="text-xs text-zinc-500">{dayActivities.length} activit{dayActivities.length !== 1 ? "ies" : "y"}</span>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-zinc-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-zinc-500" />
                          )}
                        </button>

                        {/* Activities */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <SortableContext
                                items={dayActivities.map((a) => a.id)}
                                strategy={verticalListSortingStrategy}
                              >
                                <div className="px-4 pt-2 pb-3">
                                  {dayActivities.map((activity) => (
                                    <ActivityItem
                                      key={activity.id}
                                      activity={activity}
                                      onDelete={handleDeleteActivity}
                                    />
                                  ))}
                                </div>
                              </SortableContext>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </DndContext>
            )}
          </div>
        </div>
      </div>

      {/* Right — Map placeholder */}
      <div className="hidden lg:flex flex-1 relative bg-[#0a0a0a] items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative z-10 flex flex-col items-center text-center max-w-md p-8">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center mb-6 shadow-2xl">
            <Map className="w-6 h-6 text-zinc-500" />
          </div>
          <h3 className="text-xl font-medium text-white tracking-tight mb-2">Interactive Map</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            This area will show your interactive route, clustered pins, and dynamic pathing based on your timeline order.
          </p>
        </div>
      </div>

      {/* Add Activity Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setIsAddOpen(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-zinc-950 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-white tracking-tight">Add Activity</h3>
                <button onClick={() => setIsAddOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Day */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Day</label>
                  <select
                    value={addDay}
                    onChange={(e) => setAddDay(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm outline-none appearance-none"
                  >
                    {days.length > 0
                      ? days.map((d) => <option key={d} value={d} className="bg-zinc-900">{d}</option>)
                      : ["Day 1", "Day 2", "Day 3"].map((d) => <option key={d} value={d} className="bg-zinc-900">{d}</option>)
                    }
                    <option value="Day 1" className="bg-zinc-900">Day 1</option>
                  </select>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Activity Title *</label>
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Visit Louvre Museum"
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 placeholder:text-zinc-600"
                    onKeyDown={(e) => { if (e.key === "Enter") handleAddActivity(); }}
                  />
                </div>

                {/* Time */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Time</label>
                  <input
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 10:00 AM"
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 placeholder:text-zinc-600"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
                      const Icon = cfg.icon;
                      return (
                        <button
                          key={key}
                          onClick={() => setNewType(key)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                            newType === key
                              ? `${cfg.bg} ${cfg.color} border-current`
                              : "bg-zinc-900 border-white/5 text-zinc-400 hover:border-white/10"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  onClick={handleAddActivity}
                  disabled={saving || !newTitle.trim()}
                  className="w-full bg-white text-black hover:bg-zinc-200 h-11 rounded-xl font-medium mt-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Activity"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
