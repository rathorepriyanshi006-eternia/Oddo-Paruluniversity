"use client";

import { Settings as SettingsIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-8 pb-10 max-w-2xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Settings</h1>
          <p className="text-zinc-400">Manage your account preferences.</p>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-zinc-300">Name</Label>
            <Input className="bg-white/5 border-white/10 text-white" defaultValue="Marcus Chen" />
          </div>
          <div className="space-y-3">
            <Label className="text-zinc-300">Email</Label>
            <Input className="bg-white/5 border-white/10 text-white" defaultValue="marcus@example.com" disabled />
          </div>
          <div className="space-y-3">
            <Label className="text-zinc-300">Currency</Label>
            <select className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white outline-none">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
