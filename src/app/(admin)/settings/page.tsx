"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and application preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Sidebar nav */}
        <div className="flex flex-col gap-1">
          {[
            { icon: Settings, label: "General", active: true },
            { icon: Bell, label: "Notifications", active: false },
            { icon: Shield, label: "Security", active: false },
            { icon: Palette, label: "Appearance", active: false },
          ].map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-left transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Settings content */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Company Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Company Name</Label>
                  <Input defaultValue="Datacor Inc." />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Industry</Label>
                  <Input defaultValue="Technology" />
                </div>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <Label>Headquarters</Label>
                  <Input defaultValue="San Francisco, CA 94102" />
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button size="sm">Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Admin Account</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Full Name</Label>
                  <Input defaultValue="Admin User" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Email</Label>
                  <Input defaultValue="admin@datacor.com" />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <p className="text-xs text-muted-foreground">Your current access level</p>
                </div>
                <Badge className="bg-violet-100 text-violet-700 border-violet-200 border" variant="outline">
                  Super Admin
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
