"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
import { MapPin, GripVertical, Camera, Utensils, BedDouble, PlaneTakeoff, Loader2, Plus, Calendar as CalendarIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SortableActivityItem({ activity }: { activity: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  const Icon = activity.type === 'food' ? Utensils :
               activity.type === 'sightseeing' ? Camera :
               activity.type === 'stay' ? BedDouble :
               activity.type === 'transport' ? PlaneTakeoff : MapPin;

  return (
    <div ref={setNodeRef} style={style} className="relative flex items-center gap-4 group">
      <div className="absolute left-6 top-10 bottom-[-1.5rem] w-px bg-white/10 z-0" />
      <div className="w-16 text-right text-xs text-zinc-400 font-medium pt-1">
        {activity.time || "TBD"}
      </div>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 border-background shadow-md shadow-black/20 ${
        activity.type === 'food' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
        activity.type === 'sightseeing' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' :
        activity.type === 'stay' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' :
        'bg-zinc-800 text-zinc-300 border-zinc-700'
      }`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 glass-panel p-3 rounded-2xl border border-white/5 hover:border-white/20 transition-all flex items-center gap-3 hover:bg-white/[0.08]">
        <div 
          {...attributes} 
          {...listeners}
          className="cursor-grab hover:bg-white/10 p-1.5 rounded transition-colors text-zinc-500"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white leading-tight mb-1">{activity.title}</h4>
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">{activity.type}</p>
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
  
  // Add Activity State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newType, setNewType] = useState("sightseeing");

  useEffect(() => {
    fetchTrip();
  }, [params.id]);

  async function fetchTrip() {
    try {
      const res = await fetch(`/api/trips/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setTrip(data.data);
        setActivities(data.data.activities || []);
      } else {
        toast.error("Failed to load trip");
      }
    } catch (e) {
      toast.error("Error loading trip data");
    } finally {
      setLoading(false);
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over) return;
    
    if (active.id !== over.id) {
      setActivities((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        
        const updates = newArray.map((item, index) => ({ id: item.id, orderIndex: index }));
        fetch('/api/activities', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: updates })
        }).then(() => {
           toast.success("Timeline updated");
        }).catch(() => {
           toast.error("Failed to save new order");
        });
        
        return newArray;
      });
    }
  }

  async function handleAddActivity() {
    if (!newTitle) return;
    
    const promise = fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tripId: params.id,
        title: newTitle,
        time: newTime || "TBD",
        type: newType,
        orderIndex: activities.length
      })
    }).then(async (res) => {
      const data = await res.json();
      if(data.success) {
        setActivities([...activities, data.data]);
        setIsAddOpen(false);
        setNewTitle("");
        setNewTime("");
      } else {
        throw new Error();
      }
    });

    toast.promise(promise, {
      loading: 'Adding activity...',
      success: 'Activity added to timeline!',
      error: 'Failed to add activity'
    });
  }

  if (loading) {
    return <div className="h-full flex flex-col items-center justify-center gap-4"><Loader2 className="w-8 h-8 text-cyan-400 animate-spin" /><p className="text-zinc-400">Loading your itinerary...</p></div>;
  }

  if (!trip) {
    return <div className="p-8 text-center text-zinc-400">Trip not found. It might have been deleted.</div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden">
      <div className="w-full lg:w-[480px] flex flex-col border-r border-white/5 bg-background/50 backdrop-blur-xl h-full shadow-2xl z-10">
        <div className="p-4 border-b border-white/5 bg-background/80">
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="w-full bg-white/5 border border-white/10 p-1 rounded-xl">
              <TabsTrigger value="timeline" className="flex-1 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-sm">Timeline</TabsTrigger>
              <TabsTrigger value="discover" className="flex-1 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-sm">Discover</TabsTrigger>
              <TabsTrigger value="budget" className="flex-1 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-sm">Budget</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <ScrollArea className="flex-1 h-full">
          <div className="p-6">
            <div className="mb-6 sticky top-0 bg-background/90 backdrop-blur-md z-20 py-3 flex justify-between items-center border-b border-white/5">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-indigo-400" /> Day 1</h2>
                <p className="text-sm text-zinc-400">{new Date(trip.startDate).toLocaleDateString()} • {trip.destination}</p>
              </div>
              
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/10 text-white">
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-950 border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle>Add Activity</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Activity Name</Label>
                      <Input placeholder="e.g. Visit Louvre Museum" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="bg-white/5 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input placeholder="e.g. 10:00 AM" value={newTime} onChange={e => setNewTime(e.target.value)} className="bg-white/5 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <select value={newType} onChange={e => setNewType(e.target.value)} className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white outline-none">
                        <option value="sightseeing" className="bg-zinc-900">Sightseeing</option>
                        <option value="food" className="bg-zinc-900">Food & Dining</option>
                        <option value="stay" className="bg-zinc-900">Accommodation</option>
                        <option value="transport" className="bg-zinc-900">Transportation</option>
                      </select>
                    </div>
                    <Button onClick={handleAddActivity} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold">Add to Itinerary</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {activities.length === 0 ? (
              <div className="text-center p-8 text-zinc-500 border border-white/5 border-dashed rounded-xl bg-white/[0.02]">
                <p className="mb-4">No activities planned yet.</p>
              </div>
            ) : (
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={activities.map(a => a.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-6 pb-20 mt-4">
                    {activities.map((activity) => (
                      <SortableActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Side - Map View */}
      <div className="hidden lg:block flex-1 relative bg-zinc-950 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity" 
          style={{ backgroundImage: `url('${trip.image || "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop"}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/80 to-transparent mix-blend-overlay" />
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="absolute inset-0 z-10 pointer-events-none p-10">
          {activities.map((act, i) => {
            const top = 20 + (i * 15) % 60;
            const left = 30 + (i * 20) % 50;
            const Icon = act.type === 'stay' ? BedDouble : act.type === 'food' ? Utensils : act.type === 'sightseeing' ? Camera : MapPin;
            
            return (
              <div 
                key={act.id}
                className="absolute flex items-center justify-center group pointer-events-auto cursor-pointer"
                style={{ top: `${top}%`, left: `${left}%` }}
                onClick={() => toast.info(act.title, { description: `Scheduled for ${act.time}` })}
              >
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 backdrop-blur border border-white/10 text-white text-xs px-3 py-1 rounded shadow-xl whitespace-nowrap">
                  {act.title}
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-transform hover:scale-110 ${
                  act.type === 'stay' ? 'bg-indigo-500' :
                  act.type === 'food' ? 'bg-orange-500' :
                  act.type === 'sightseeing' ? 'bg-cyan-500' : 'bg-zinc-800'
                }`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
