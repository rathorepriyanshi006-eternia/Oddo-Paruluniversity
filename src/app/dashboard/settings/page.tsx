"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { Camera, Check, LogOut, Shield, Bell, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AVATAR_OPTIONS = [
  "https://i.pravatar.cc/150?img=11",
  "https://i.pravatar.cc/150?img=15",
  "https://i.pravatar.cc/150?img=22",
  "https://i.pravatar.cc/150?img=33",
  "https://i.pravatar.cc/150?img=44",
  "https://i.pravatar.cc/150?img=55",
  "https://i.pravatar.cc/150?img=60",
  "https://i.pravatar.cc/150?img=68",
];

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || AVATAR_OPTIONS[0]);
  const [currency, setCurrency] = useState("USD");
  const [notifications, setNotifications] = useState(true);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatar(user.avatar);
    }
  }, [user]);

  const handleSave = () => {
    if (!name.trim()) { toast.error("Name cannot be empty"); return; }
    updateUser({ name: name.trim(), email: email.trim(), avatar });
    setSaved(true);
    toast.success("Profile updated successfully!");
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-40 text-zinc-500">
        Please log in to view settings.
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-1">Settings</h1>
        <p className="text-zinc-400">Manage your account and preferences.</p>
      </div>

      {/* Profile Section */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Profile
          </CardTitle>
          <CardDescription className="text-zinc-500">Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="relative group">
              <img
                src={avatar}
                alt="Avatar"
                className="w-20 h-20 rounded-2xl border-2 border-white/20 object-cover"
              />
              <button
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
            </div>
            <div>
              <p className="text-white font-semibold text-lg capitalize">{user.name}</p>
              <p className="text-zinc-400 text-sm">@{user.username}</p>
              <span className="inline-flex items-center mt-1 text-xs px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 font-medium">
                {user.plan}
              </span>
            </div>
          </div>

          {/* Avatar Picker */}
          {showAvatarPicker && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-4 gap-3 p-4 bg-zinc-900 rounded-xl border border-white/10"
            >
              <p className="col-span-4 text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">Choose Avatar</p>
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av}
                  onClick={() => { setAvatar(av); setShowAvatarPicker(false); }}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                    avatar === av ? "border-cyan-400" : "border-transparent hover:border-white/20"
                  }`}
                >
                  <img src={av} alt="Avatar option" className="w-full aspect-square object-cover" />
                  {avatar === av && (
                    <div className="absolute inset-0 flex items-center justify-center bg-cyan-400/20">
                      <Check className="w-4 h-4 text-cyan-400" />
                    </div>
                  )}
                </button>
              ))}
            </motion.div>
          )}

          {/* Name & Email */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Display Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 border-white/10 text-white focus-visible:ring-cyan-500/40"
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Username</Label>
              <Input
                value={`@${user.username}`}
                disabled
                className="bg-white/5 border-white/5 text-zinc-500 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-zinc-300">Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white focus-visible:ring-cyan-500/40"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            className={`transition-all h-10 px-6 font-medium rounded-xl ${
              saved
                ? "bg-green-500 hover:bg-green-500 text-white"
                : "bg-cyan-500 hover:bg-cyan-600 text-white"
            }`}
          >
            {saved ? (
              <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Saved!</span>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            Preferences
          </CardTitle>
          <CardDescription className="text-zinc-500">Customize your experience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="text-zinc-300">Currency</Label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none appearance-none focus:ring-2 focus:ring-white/20"
            >
              <option value="USD" className="bg-zinc-900">USD ($)</option>
              <option value="EUR" className="bg-zinc-900">EUR (€)</option>
              <option value="GBP" className="bg-zinc-900">GBP (£)</option>
              <option value="JPY" className="bg-zinc-900">JPY (¥)</option>
              <option value="INR" className="bg-zinc-900">INR (₹)</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-white">Trip Notifications</p>
              <p className="text-xs text-zinc-500 mt-0.5">Get alerts for price drops and weather updates</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                notifications ? "bg-cyan-500" : "bg-zinc-700"
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                notifications ? "left-5" : "left-0.5"
              }`} />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 bg-red-400/5 hover:bg-red-400/10 border border-red-400/20 px-4 py-2.5 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign out of @{user.username}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
