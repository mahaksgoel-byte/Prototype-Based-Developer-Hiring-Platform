import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import {
  User,
  Mail,
  ShieldCheck,
  Star,
  Briefcase,
  Code,
  Bell,
  Key,
} from "lucide-react";

import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

/* ---------------- Types ---------------- */

interface Profile {
  name: string;
  email: string;
}

interface Developer {
  skills: string;
  experience: number;
  rating: number;
  total_jobs: number;
  verify: boolean;
}

/* ---------------- Component ---------------- */

const DeveloperSettings = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch Data ---------------- */

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const [{ data: profileData }, { data: developerData }] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("name, email")
            .eq("id", user.id)
            .maybeSingle(),

          supabase
            .from("developers")
            .select(`
              skills,
              experience,
              rating,
              total_jobs,
              verify
            `)
            .eq("id", user.id)
            .maybeSingle(),
        ]);

      setProfile(profileData);
      setDeveloper(developerData);
      setLoading(false);
    };

    loadSettings();
  }, []);

  if (loading) {
    return <p className="text-zinc-500">Loading settings...</p>;
  }

  if (!profile || !developer) {
    return <p className="text-zinc-500">Settings unavailable.</p>;
  }

  /* ---------------- Render ---------------- */

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Developer Settings
      </h1>

      <Card>
        <CardContent className="p-6 space-y-8">
          {/* ---------------- Profile ---------------- */}
          <section>
            <h2 className="text-lg font-medium mb-3">
              Profile
            </h2>

            <div className="space-y-2 text-sm text-zinc-600">
              <p className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <strong>Name:</strong> {profile.name}
              </p>

              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <strong>Email:</strong> {profile.email}
              </p>
            </div>
          </section>

          {/* ---------------- Developer Info ---------------- */}
          <section>
            <h2 className="text-lg font-medium mb-3">
              Developer Profile
            </h2>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Code className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium">Skills</span>
                </div>
                <p className="text-zinc-600">
                  {developer.skills || "Not specified"}
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">Experience</span>
                </div>
                <p className="text-zinc-600">
                  {developer.experience} years
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="font-medium">Rating</span>
                </div>
                <p className="text-zinc-600">
                  {developer.rating} / 5
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">Verification</span>
                </div>
                <Badge
                  variant={
                    developer.verify ? "secondary" : "outline"
                  }
                >
                  {developer.verify
                    ? "Verified"
                    : "Not Verified"}
                </Badge>
              </div>
            </div>
          </section>

          {/* ---------------- Preferences ---------------- */}
          <section>
            <h2 className="text-lg font-medium mb-3">
              Preferences
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-medium">
                    Notifications
                  </span>
                </div>
                <Badge variant="secondary">
                  Enabled
                </Badge>
              </div>

              <div className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium">
                    Job Visibility
                  </span>
                </div>
                <Badge variant="outline">
                  Open to Work
                </Badge>
              </div>
            </div>
          </section>

          {/* ---------------- Security ---------------- */}
          <section>
            <h2 className="text-lg font-medium mb-3">
              Security
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-zinc-700" />
                  <span className="text-sm font-medium">
                    Account Status
                  </span>
                </div>
                <Badge variant="secondary">
                  Secure
                </Badge>
              </div>

              <div className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-zinc-700" />
                  <span className="text-sm font-medium">
                    Password
                  </span>
                </div>
                <Button size="sm">
                  Change Password
                </Button>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeveloperSettings;
