import { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Clock, ArrowRight } from "lucide-react";
import { supabase } from "../../supabaseClient";

interface ActiveProject {
  id: string;
  title: string;
  status: string;
  percentage: number;
  submission_deadline: string | null;
}

export default function ActiveWork() {
  const [projects, setProjects] = useState<ActiveProject[]>([]);
  const [loading, setLoading] = useState(true);

  /* ----------------------------------
     Fetch ONLY selected submissions + percentage < 100
  -----------------------------------*/
  useEffect(() => {
    const fetchActiveProjects = async () => {
      setLoading(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!user || authError) {
        setLoading(false);
        return;
      }

      /**
       * Fetch only selected submissions
       * → join projects
       */
      const { data, error } = await supabase
        .from("submissions")
        .select(`
          project:project_id (
            id,
            title,
            status,
            percentage,
            submission_deadline
          )
        `)
        .eq("selected", true);

      if (error) {
        console.error("Failed to fetch active projects:", error.message);
        setLoading(false);
        return;
      }

      // Extract joined project + filter out completed ones (percentage >= 100)
      const active = data
        .map((row: any) => row.project)
        .filter((project): project is ActiveProject => 
          Boolean(project) && project.percentage < 100
        );

      setProjects(active);
      setLoading(false);
    };

    fetchActiveProjects();
  }, []);

  /* ----------------------------------
     UI
  -----------------------------------*/
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Active Work</h1>
        <p className="text-zinc-500 mt-1">
          Manage your ongoing projects and track progress
        </p>
      </div>

      {loading ? (
        <p className="text-zinc-500">Loading active projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-zinc-500">
          You don’t have any active (incomplete) projects right now.
        </p>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="hover:border-zinc-300 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-indigo-600" />
                      </div>

                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-zinc-900 mb-1">
                          {project.title}
                        </h2>

                        <p className="text-sm text-zinc-500 mb-2">
                          Submission deadline:{" "}
                          {project.submission_deadline
                            ? new Date(project.submission_deadline).toLocaleDateString()
                            : "N/A"}
                        </p>

                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">
                            {project.status}
                          </Badge>

                          <div className="flex-1 max-w-xs">
                            <div className="w-full bg-zinc-100 rounded-full h-2">
                              <div
                                className="bg-indigo-600 h-2 rounded-full transition-all"
                                style={{
                                  width: `${project.percentage}%`,
                                }}
                              />
                            </div>
                          </div>

                          <span className="text-xs text-zinc-500">
                            {project.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <Button className="w-full md:w-auto">
                      Apply Now.
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}