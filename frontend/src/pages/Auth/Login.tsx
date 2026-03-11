// src/pages/Auth/Login.tsx
import React, { ChangeEvent, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import mainImage from "../../assets/main.png"; // 👈 import the image

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (authError) throw authError;
      if (!data.user) throw new Error("Login failed");

      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (userError || !userData)
        throw userError || new Error("Role fetch failed");

      if (userData.role === "company") navigate("/company");
      else navigate("/developer");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 grid grid-cols-1 md:grid-cols-2">
      {/* LEFT: LOGIN FORM */}
      <div className="flex items-center justify-center p-8">
        <motion.div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">
            Welcome back
          </h1>
          <p className="text-zinc-500 mb-8">
            Log in to continue to your workspace.
          </p>

          {error && <p className="text-red-500 mb-2">{error}</p>}

          <Card className="p-6 space-y-5">
            <div>
              <label className="text-sm text-zinc-600">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="w-full pl-10 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-zinc-600">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 py-2 border rounded-lg"
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-zinc-900 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-800 transition"
            >
              {loading ? "Logging in..." : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </Card>

          <p className="text-sm text-zinc-500 text-center mt-6">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-zinc-900 font-medium">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* RIGHT: IMAGE */}
      <div className="hidden md:flex items-center justify-center bg-zinc-100">
        <img
          src={mainImage}
          alt="Login visual"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

