import { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/Card";
import { InsightBadge } from "../../components/ml/InsightBadge";
import { Wallet, TrendingUp, Award } from "lucide-react";
import { supabase } from "../../supabaseClient";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ----------------------------------
   TypeScript workaround for Recharts
-----------------------------------*/
const XAxisComp = XAxis as any;
const YAxisComp = YAxis as any;
const LineComp = Line as any;
const TooltipComp = Tooltip as any;

interface DeveloperEarnings {
  available_balance: number;
  total_earned: number;
  rating: number;
  total_jobs: number;
  created_at: string;
}

/* ----------------------------------
   Generate visual earnings trend
-----------------------------------*/
const generateEarningsTrend = (total: number) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  let current = Math.floor(total * 0.3);

  return months.map((month) => {
    const value = current;
    current += Math.floor(total * 0.1);
    return { month, amount: value };
  });
};

export default function Earnings() {
  const [data, setData] = useState<DeveloperEarnings | null>(null);
  const [loading, setLoading] = useState(true);

  /* ----------------------------------
     Fetch earnings from Supabase
  -----------------------------------*/
  useEffect(() => {
    const fetchEarnings = async () => {
      setLoading(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!user || authError) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("developers")
        .select(
          "available_balance, total_earned, rating, total_jobs, created_at"
        )
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Failed to fetch earnings:", error.message);
        setLoading(false);
        return;
      }

      setData(data);
      setLoading(false);
    };

    fetchEarnings();
  }, []);

  if (loading) {
    return <p className="text-zinc-500">Loading earnings...</p>;
  }

  if (!data) {
    return <p className="text-zinc-500">No earnings data found.</p>;
  }

  const reliability =
    data.rating >= 4.5 ? "High" : data.rating >= 3 ? "Medium" : "Low";

  const earningsTrend = generateEarningsTrend(data.total_earned);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Earnings</h1>
        <p className="text-zinc-500 mt-1">
          Financial summary based on your developer profile
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Balance */}
        <Card>
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>

            <p className="text-sm text-zinc-500 mb-2">
              Available for Payout
            </p>

            <h2 className="text-3xl font-bold text-zinc-900">
              ₹{data.available_balance.toLocaleString()}
            </h2>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card>
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>

            <div className="flex gap-3">
              <InsightBadge label="Reliability" value={reliability} />
              <InsightBadge
                label="Rating"
                score={Math.round((data.rating / 5) * 100)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 📈 Earnings Graph */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-zinc-900 mb-4">
            Earnings Trend
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={earningsTrend}>
                <XAxisComp dataKey="month" />
                <YAxisComp />
                <TooltipComp />
                <LineComp
                  type="monotone"
                  dataKey="amount"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-zinc-900">
              Earnings Summary
            </h3>
          </div>

          <p>Total Earned: ₹{data.total_earned.toLocaleString()}</p>
          <p>Jobs Completed: {data.total_jobs}</p>
        </CardContent>
      </Card>
    </div>
  );
}