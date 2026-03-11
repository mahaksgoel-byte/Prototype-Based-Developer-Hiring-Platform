import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Shield, Bell, Globe, Key } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

interface Profile {
  name: string;
  email: string;
}

const CompanySettings = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch Profile ---------------- */

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("name, email")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Profile fetch failed:", error.message);
        setLoading(false);
        return;
      }

      setProfile(data);
      setLoading(false);
    };

    loadProfile();
  }, []);

  if (loading) {
    return <p className="text-zinc-500">Loading settings...</p>;
  }

  if (!profile) {
    return <p className="text-zinc-500">Profile not found.</p>;
  }

  /* ---------------- Render ---------------- */

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Settings
      </h1>

      <Card>
        <CardContent className="p-6 space-y-8">
          {/* ---------------- Company Profile ---------------- */}
          <section>
            <h2 className="text-lg font-medium mb-3">
              Company Profile
            </h2>

            <div className="space-y-2 text-sm text-zinc-600">
              <p>
                <strong>Company Name:</strong>{" "}
                {profile.name}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {profile.email}
              </p>
              <p>
                <strong>Location:</strong> India
              </p>
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
                  <Globe className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium">
                    Project Visibility
                  </span>
                </div>
                <Badge variant="outline">
                  Public
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
                  <Shield className="w-5 h-5 text-zinc-700" />
                  <span className="text-sm font-medium">
                    Account Protection
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

export default CompanySettings;
