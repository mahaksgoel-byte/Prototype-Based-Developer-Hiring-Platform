import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { InsightBadge } from "../../components/ml/InsightBadge";
import { ViewDetailsModal } from "../../components/ViewDetailsModal";
import { FileText, ArrowRight } from "lucide-react";
import { ApplicationData } from "../../components/ApplyModal";

/* ---------------- RAW SUPABASE TYPE ---------------- */

type RawSubmission = {
  id: string;
  created_at: string | null;
  description: string | null;
  github_link: string | null;
  figma_link: string | null;
  expected_pay: number | null;
  estimated_hours: number | null;
  availability: number | null;
  selected: boolean | null;
  accepted: boolean | null;
  projects: {
    title: string | null;
    status: string | null;
    company: {
      id: string | null;
    } | null;
  } | null;
};

/* ---------------- UI TYPE ---------------- */

interface Application {
  id: string;
  project: string;
  company: string;
  status: string;
  fitScore: number;
  appliedDate: string;
  applicationData: ApplicationData;
}

/* ---------------- COMPONENT ---------------- */

export default function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  /* ---------------- FETCH FROM SUPABASE ---------------- */

  const fetchApplications = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from("submissions")
      .select(`
        id,
        created_at,
        description,
        github_link,
        figma_link,
        expected_pay,
        estimated_hours,
        availability,
        selected,
        accepted,
        projects (
          title,
          status,
          company (
            id
          )
        )
      `)
      .eq("developer_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return;
    }

    if (!data || data.length === 0) {
      setApplications([]);
      return;
    }

    const mapped: Application[] = (data as RawSubmission[]).map((sub) => {
      const status = sub.accepted
        ? "Accepted"
        : sub.selected
        ? "Shortlisted"
        : "Pending";

      return {
        id: sub.id,
        project: sub.projects?.title ?? "Untitled Project",
        company: sub.projects?.company?.id
          ? `Company #${sub.projects.company.id}`
          : "Unknown Company",
        status,
        fitScore: 85,
        appliedDate: sub.created_at
          ? new Date(sub.created_at).toLocaleDateString()
          : "—",
        applicationData: {
          description: sub.description ?? "",
          links: {
            github: sub.github_link ?? "",
            figma: sub.figma_link ?? "",
          },
          estimatedHours: sub.estimated_hours?.toString() ?? "",
          availability: sub.availability?.toString() ?? "",
          expectedAmount: sub.expected_pay?.toString() ?? "",
        },
      };
    });

    setApplications(mapped);
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            My Applications
          </h1>
          <p className="text-zinc-500 mt-1">
            Manage your submissions and view details
          </p>
        </div>

        <div className="grid gap-4">
          {applications.map((app) => (
            <Card
              key={app.id}
              className="hover:border-zinc-300 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-zinc-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-zinc-900 mb-1">
                        {app.project}
                      </h2>
                      <p className="text-sm text-zinc-500 mb-3">
                        {app.company}
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        <Badge
                          variant={
                            app.status === "Accepted"
                              ? "success"
                              : "secondary"
                          }
                        >
                          {app.status}
                        </Badge>

                        <InsightBadge
                          label="Fit Score"
                          score={app.fitScore}
                        />

                        <span className="text-xs text-zinc-500">
                          Applied on {app.appliedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedApplication(app);
                      setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedApplication && (
        <ViewDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedApplication(null);
          }}
          projectTitle={selectedApplication.project}
          company={selectedApplication.company}
          status={selectedApplication.status}
          appliedDate={selectedApplication.appliedDate}
          applicationData={selectedApplication.applicationData}
        />
      )}
    </>
  );
}
